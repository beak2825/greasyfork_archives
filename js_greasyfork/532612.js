// ==UserScript==
// @name         Copilot Conversation Exporter
// @namespace    https://github.com/NoahTheGinger/Userscripts/
// @version      2.0.0
// @description  Export Microsoft Copilot conversations to Markdown or JSON (optionally includes AI Thoughts when present)
// @author       NoahTheGinger
// @match        https://copilot.microsoft.com/*
// @grant        none
// @run-at       document-start
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/532612/Copilot%20Conversation%20Exporter.user.js
// @updateURL https://update.greasyfork.org/scripts/532612/Copilot%20Conversation%20Exporter.meta.js
// ==/UserScript==

(function () {
  'use strict';

  // ==========
  // Config
  // ==========
  const ORIGIN = new URL(location.href).origin; // https://copilot.microsoft.com
  const API_BASE = `${ORIGIN}/c/api`;
  const API_VERSION = '2'; // history endpoint supports ?api-version=2

  // ==========
  // Auth capturing (best-effort)
  // ==========
  let capturedAuthToken = null;

  function tryCaptureAuthFromHeaders(headersLike) {
    try {
      if (!headersLike) return;
      const headers = headersLike instanceof Headers ? headersLike : new Headers(headersLike);
      const auth = headers.get('Authorization') || headers.get('authorization');
      if (auth && auth.startsWith('Bearer ')) {
        capturedAuthToken = auth.replace(/^Bearer\s+/, '');
      }
    } catch {}
  }

  // Patch fetch at document-start to sniff Authorization headers sent by the app
  (function patchFetch() {
    const origFetch = window.fetch;
    window.fetch = function patchedFetch(input, init) {
      try {
        if (init && init.headers) tryCaptureAuthFromHeaders(init.headers);
        if (input && typeof input === 'object' && input.headers) tryCaptureAuthFromHeaders(input.headers);
      } catch {}
      return origFetch.apply(this, arguments);
    };
  })();

  // Patch XMLHttpRequest to sniff Authorization headers
  (function patchXHR() {
    const origOpen = XMLHttpRequest.prototype.open;
    const origSetRequestHeader = XMLHttpRequest.prototype.setRequestHeader;

    XMLHttpRequest.prototype.open = function (method, url) {
      this._url = url;
      this._method = method;
      return origOpen.apply(this, arguments);
    };

    XMLHttpRequest.prototype.setRequestHeader = function (name, value) {
      try {
        if (typeof name === 'string' && name.toLowerCase() === 'authorization' && value && value.startsWith('Bearer ')) {
          capturedAuthToken = value.replace(/^Bearer\s+/, '');
        }
      } catch {}
      return origSetRequestHeader.apply(this, arguments);
    };
  })();

  // ==========
  // Utilities
  // ==========
  function sanitizeFilename(title) {
    return title.replace(/[<>:"/\\|?*]/g, '_').replace(/\s+/g, '_').slice(0, 200);
  }

  function downloadFile(filename, mimeType, content) {
    const blob = content instanceof Blob ? content : new Blob([content], { type: mimeType });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.style.display = 'none';
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    setTimeout(() => {
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    }, 0);
  }

  function standardizeLineBreaks(text) {
    return text.replace(/\r\n/g, '\n').replace(/\r/g, '\n');
  }

  function getCurrentTimestamp() {
    return new Date().toISOString().slice(0, 19).replace(/:/g, '-');
  }

  function getChatIdFromUrl() {
    // Expected: https://copilot.microsoft.com/chats/{chatId}
    const m = location.pathname.match(/^\/chats\/([A-Za-z0-9_-]+)/i);
    return m ? m[1] : null;
  }

  function getUILanguage() {
    return document.documentElement.getAttribute('lang') || navigator.language || 'en-US';
  }

  async function ensureSession() {
    // Lightly poke the start endpoint (this sometimes ensures cookies/session are initialized)
    try {
      await fetch(`${API_BASE}/start`, {
        method: 'POST',
        credentials: 'include'
      });
    } catch {}
  }

  async function fetchJSON(url, options = {}) {
    const opts = {
      method: 'GET',
      credentials: 'include',
      headers: {},
      ...options
    };

    opts.headers = new Headers(opts.headers);

    // Prefer captured Authorization token if available
    if (capturedAuthToken && !opts.headers.has('Authorization')) {
      opts.headers.set('Authorization', `Bearer ${capturedAuthToken}`);
    }

    // Send UI language if available (consistent with site)
    const lang = getUILanguage();
    if (!opts.headers.has('x-search-uilang') && lang) {
      opts.headers.set('x-search-uilang', lang.toLowerCase());
    }

    const res = await fetch(url, opts);
    if (!res.ok) {
      let detail = res.statusText || '';
      try {
        const data = await res.json();
        detail = data?.error || data?.message || JSON.stringify(data) || detail;
      } catch {}
      throw new Error(`Request failed (${res.status}): ${detail}`);
    }
    return res.json();
  }

  async function fetchConversationHistory(chatId) {
    if (!chatId) throw new Error('No chat ID found in URL');

    // Warm session first (harmless if already warm)
    await ensureSession();

    const url = `${API_BASE}/conversations/${encodeURIComponent(chatId)}/history?api-version=${API_VERSION}`;

    try {
      return await fetchJSON(url);
    } catch (err) {
      // Retry after warming session again (in case of race/expiry)
      await ensureSession();
      return await fetchJSON(url);
    }
  }

  async function fetchConversationsList() {
    const url = `${API_BASE}/conversations${API_VERSION ? `?api-version=${API_VERSION}` : ''}`;
    try {
      return await fetchJSON(url);
    } catch {
      return null;
    }
  }

  async function lookupConversationTitle(chatId) {
    if (!chatId) return 'Copilot Conversation';
    const list = await fetchConversationsList();
    // Expected shape: maybe { results: [ { id, title, ... }, ... ] } or just an array
    try {
      const items = Array.isArray(list?.results) ? list.results : (Array.isArray(list) ? list : []);
      const found = items.find(x => x?.id === chatId);
      return found?.title || 'Copilot Conversation';
    } catch {
      return 'Copilot Conversation';
    }
  }

  // ==========
  // Transform Copilot history -> Markdown
  // ==========
  function transformAuthor(author) {
    // In history JSON: author: { type: "ai" | "human" }
    if (!author || !author.type) return 'Unknown';
    return author.type === 'ai' ? 'Assistant' : author.type === 'human' ? 'User' : author.type;
  }

  function sortByCreatedAtAsc(results) {
    try {
      return [...results].sort((a, b) => {
        const at = new Date(a.createdAt).getTime() || 0;
        const bt = new Date(b.createdAt).getTime() || 0;
        return at - bt;
      });
    } catch {
      return results;
    }
  }

  function partsToMarkdown(parts) {
    if (!Array.isArray(parts)) return { body: '', thoughts: '' };

    const textBlocks = [];
    const imageBlocks = [];
    const citations = [];
    const thoughtsBlocks = [];

    for (const part of parts) {
      switch (part?.type) {
        case 'text':
          if (typeof part.text === 'string' && part.text.trim()) {
            textBlocks.push(part.text);
          }
          break;
        case 'image': {
          // Embed image, optionally include prompt as a caption line
          if (part.url) {
            const alt = 'image';
            imageBlocks.push(`![${alt}](${part.url})`);
            if (part.prompt && String(part.prompt).trim()) {
              imageBlocks.push(`*Prompt: ${part.prompt}*`);
            }
          }
          break;
        }
        case 'citation':
          // Collect for optional "Sources" listing; avoid exact duplicates
          if (part.url) {
            const key = `${part.title || part.url}::${part.url}`;
            if (!citations.some(c => c._k === key)) {
              citations.push({ _k: key, title: part.title || part.url, url: part.url });
            }
          }
          break;
        case 'chainOfThought':
          // Reasoning content (include only if present)
          if (typeof part.text === 'string' && part.text.trim()) {
            thoughtsBlocks.push(part.text);
          }
          if (part.screenshotUrl) {
            thoughtsBlocks.push(`![screenshot](${part.screenshotUrl})`);
          }
          break;
        default:
          // Ignore unsupported part types silently
          break;
      }
    }

    const sections = [];

    if (textBlocks.length) {
      sections.push(textBlocks.join('\n\n'));
    }

    if (imageBlocks.length) {
      sections.push(imageBlocks.join('\n\n'));
    }

    // If you prefer to show citations, uncomment the block below to include a sources list:
    // if (citations.length) {
    //   const list = citations.map(c => `- [${c.title}](${c.url})`).join('\n');
    //   sections.push(`#### Sources\n${list}`);
    // }

    const body = sections.filter(Boolean).join('\n\n');
    const thoughts = thoughtsBlocks.length ? thoughtsBlocks.join('\n\n') : '';

    return { body, thoughts };
  }

    // ----------------------------------------------------------
    //  Updated markdown conversion – thoughts come first
    // ----------------------------------------------------------
  function conversationToMarkdown({ title, results }) {
    // Ensure the messages are in chronological order
    const sorted = sortByCreatedAtAsc(results || []);

    const lines = [];

    // Title
    lines.push(`# ${title || 'Copilot Conversation'}`);
    lines.push(''); // blank line after title

    // Walk through each message
    for (const msg of sorted) {
      const authorLabel = transformAuthor(msg.author);
      const { body, thoughts } = partsToMarkdown(msg.content);

      const hasBody    = body    && body.trim().length   > 0;
      const hasThought = thoughts && thoughts.trim().length > 0;

      // Skip totally empty turns
      if (!hasBody && !hasThought) continue;

      // -----------------------------------------------------------------
      // Assistant – we want Thoughts *before* the answer
      // -----------------------------------------------------------------
      if (authorLabel === 'Assistant') {
        // 1. Thoughts (if any)
        if (hasThought) {
          lines.push('#### Thoughts');
          lines.push(thoughts);
          lines.push(''); // blank line after thoughts
        }

        // 2. Assistant answer (if any)
        if (hasBody) {
          lines.push(`#### ${authorLabel}:`);
          lines.push(body);
          lines.push(''); // blank line after answer
        }

        continue; // everything for this turn is done
      }

      // -----------------------------------------------------------------
      // Any other speaker (User, Tool, …) – keep the old order
      // -----------------------------------------------------------------
      lines.push(`#### ${authorLabel}:`);
      if (hasBody) lines.push(body);
      // (No “Thoughts” section for non‑assistant messages)
      lines.push(''); // blank line after the turn
    }

    // Trim trailing new‑lines but keep a final newline for nice file endings
    return lines.join('\n').trim() + '\n';
  }


  // ==========
  // Exporters
  // ==========
  async function exportToMarkdown() {
    try {
      const chatId = getChatIdFromUrl();
      if (!chatId) {
        alert('Open a conversation page first (URL should be /chats/{id}).');
        return;
      }

      console.log('[Copilot Exporter] Fetching history...');
      const history = await fetchConversationHistory(chatId);

      console.log('[Copilot Exporter] Looking up title...');
      const title = await lookupConversationTitle(chatId);

      console.log('[Copilot Exporter] Converting to Markdown...');
      const md = conversationToMarkdown({
        title: title || 'Copilot Conversation',
        results: Array.isArray(history?.results) ? history.results : []
      });

      const safeTitle = sanitizeFilename(title || 'Copilot Conversation');
      const timestamp = getCurrentTimestamp();
      const filename = `${safeTitle}_${timestamp}.md`;

      downloadFile(filename, 'text/markdown', standardizeLineBreaks(md));
      console.log('[Copilot Exporter] Markdown export complete.');
    } catch (err) {
      console.error('[Copilot Exporter] Markdown export failed:', err);
      alert(`Markdown export failed: ${err.message}`);
    }
  }

  async function exportToJSON() {
    try {
      const chatId = getChatIdFromUrl();
      if (!chatId) {
        alert('Open a conversation page first (URL should be /chats/{id}).');
        return;
      }

      console.log('[Copilot Exporter] Fetching history (JSON)...');
      const history = await fetchConversationHistory(chatId);

      console.log('[Copilot Exporter] Looking up title...');
      const title = await lookupConversationTitle(chatId);

      const jsonContent = JSON.stringify(history, null, 2);
      const safeTitle = sanitizeFilename(title || 'Copilot Conversation');
      const timestamp = getCurrentTimestamp();
      const filename = `${safeTitle}_${timestamp}.json`;

      downloadFile(filename, 'application/json', jsonContent);
      console.log('[Copilot Exporter] JSON export complete.');
    } catch (err) {
      console.error('[Copilot Exporter] JSON export failed:', err);
      alert(`JSON export failed: ${err.message}`);
    }
  }

  // ==========
  // UI (Export button + modal)
  // ==========
  function showExportDialog() {
    const modal = document.createElement('div');
    modal.style.cssText = `
      position: fixed; inset: 0;
      background: rgba(0,0,0,0.5);
      z-index: 2147483647;
      display: flex; align-items: center; justify-content: center;
    `;

    const dialog = document.createElement('div');
    dialog.style.cssText = `
      background: white;
      border-radius: 8px;
      padding: 24px;
      min-width: 300px;
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
      font-family: system-ui, -apple-system, Segoe UI, Roboto, Helvetica, Arial, sans-serif;
    `;

    dialog.innerHTML = `
      <h3 style="margin:0 0 16px 0; color:#333; font-size:18px;">Choose Export Format</h3>
      <p style="margin:0 0 20px 0; color:#666; font-size:14px;">Select the format you'd like to export this conversation in:</p>
      <div style="display:flex; gap:12px; justify-content:flex-end;">
        <button id="export-markdown-btn" style="
          background:#10a37f; color:white; border:none; border-radius:6px;
          padding:8px 16px; font-size:14px; cursor:pointer;
        ">Markdown (.md)</button>
        <button id="export-json-btn" style="
          background:#2563eb; color:white; border:none; border-radius:6px;
          padding:8px 16px; font-size:14px; cursor:pointer;
        ">JSON (.json)</button>
        <button id="export-cancel-btn" style="
          background:#6b7280; color:white; border:none; border-radius:6px;
          padding:8px 16px; font-size:14px; cursor:pointer;
        ">Cancel</button>
      </div>
    `;

    modal.appendChild(dialog);
    document.body.appendChild(modal);

    const markdownBtn = dialog.querySelector('#export-markdown-btn');
    const jsonBtn = dialog.querySelector('#export-json-btn');
    const cancelBtn = dialog.querySelector('#export-cancel-btn');

    markdownBtn.addEventListener('mouseenter', () => markdownBtn.style.background = '#0d9568');
    markdownBtn.addEventListener('mouseleave', () => markdownBtn.style.background = '#10a37f');

    jsonBtn.addEventListener('mouseenter', () => jsonBtn.style.background = '#1d4ed8');
    jsonBtn.addEventListener('mouseleave', () => jsonBtn.style.background = '#2563eb');

    cancelBtn.addEventListener('mouseenter', () => cancelBtn.style.background = '#4b5563');
    cancelBtn.addEventListener('mouseleave', () => cancelBtn.style.background = '#6b7280');

    markdownBtn.addEventListener('click', () => {
      document.body.removeChild(modal);
      exportToMarkdown();
    });
    jsonBtn.addEventListener('click', () => {
      document.body.removeChild(modal);
      exportToJSON();
    });
    cancelBtn.addEventListener('click', () => document.body.removeChild(modal));

    const onBgClick = (e) => {
      if (e.target === modal) {
        document.body.removeChild(modal);
        window.removeEventListener('click', onBgClick);
      }
    };
    window.addEventListener('click', onBgClick);

    const handleEscape = (e) => {
      if (e.key === 'Escape') {
        document.body.removeChild(modal);
        document.removeEventListener('keydown', handleEscape);
      }
    };
    document.addEventListener('keydown', handleEscape);
  }

  function createExportButton() {
    const btn = document.createElement('button');
    btn.id = 'copilot-export-btn';
    btn.textContent = 'Export';
    btn.title = 'Export conversation to Markdown or JSON';
    btn.style.cssText = `
      position: fixed; bottom: 20px; right: 20px;
      z-index: 2147483646;
      background: #10a37f; color: white;
      border: none; border-radius: 6px;
      padding: 8px 12px; font-size: 14px; font-weight: 500;
      cursor: pointer; box-shadow: 0 2px 4px rgba(0,0,0,0.1);
    `;

    btn.addEventListener('mouseenter', () => btn.style.background = '#0d9568');
    btn.addEventListener('mouseleave', () => btn.style.background = '#10a37f');
    btn.addEventListener('click', showExportDialog);
    return btn;
  }

  function addButton() {
    try {
      const existing = document.getElementById('copilot-export-btn');
      if (existing) existing.remove();
      const btn = createExportButton();
      document.body.appendChild(btn);
    } catch (e) {
      console.warn('[Copilot Exporter] Unable to add button yet. Will retry.');
    }
  }

  function ready(fn) {
    if (document.readyState !== 'loading') {
      fn();
    } else {
      document.addEventListener('DOMContentLoaded', fn);
    }
  }

  // ==========
  // Init
  // ==========
  ready(addButton);

  // Re-inject button on SPA navigations
  let lastHref = location.href;
  setInterval(() => {
    if (location.href !== lastHref) {
      lastHref = location.href;
      setTimeout(addButton, 800);
    }
  }, 800);

})();