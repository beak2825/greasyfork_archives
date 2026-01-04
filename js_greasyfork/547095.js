// ==UserScript==
// @name         Chat Transcript Exporter (JSON+RTF)
// @namespace    TamperMonkey
// @version      0.4.5
// @description  Export current ChatGPT chat to JSON (AI-friendly) and RTF (Unicode, links, tables). Adds timestamps and message IDs.
// @author       Jeroen Bazuin
// @match        https://chat.openai.com/*
// @match        https://chatgpt.com/*
// @run-at       document-start
// @license      MIT
// @grant        GM_registerMenuCommand
// @grant        GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/547095/Chat%20Transcript%20Exporter%20%28JSON%2BRTF%29.user.js
// @updateURL https://update.greasyfork.org/scripts/547095/Chat%20Transcript%20Exporter%20%28JSON%2BRTF%29.meta.js
// ==/UserScript==

(function () {
  'use strict';
  console.info('[Chat Transcript Exporter] Boot v0.4.5');

  // ---------- Settings ----------
  const FILL_SYNTHETIC_TIMES = true; // fill missing timestamps (+1s monotonic)
  const SYNTHETIC_STEP_MS = 1000;

  // ---------- Styles (two blue buttons, top-right) ----------
  GM_addStyle(`
    .jb-toolbar{position:fixed;top:84px;right:16px;z-index:2147483647;display:flex;gap:6px;align-items:center}
    .jb-btn{background:#2563eb;color:#fff;border:1px solid #1d4ed8;border-radius:8px;padding:6px 10px;
      font:600 12px/1 system-ui,-apple-system,Segoe UI,Roboto,Arial;cursor:pointer;box-shadow:0 4px 12px rgba(0,0,0,.12)}
    .jb-btn:hover{filter:brightness(1.05)}
    .jb-toast{position:fixed;left:50%;transform:translateX(-50%);top:12px;background:#111827;color:#fff;padding:8px 12px;
      border-radius:8px;border:1px solid #e5e7eb;z-index:2147483647;font:500 12px/1 system-ui,-apple-system,Segoe UI,Roboto,Arial;pointer-events:none}
  `);

  // ---------- Utils ----------
  const sleep = (ms) => new Promise(r => setTimeout(r, ms));
  const pad = (n) => String(n).padStart(2, '0');
  const dateStamp = () => {
    const d = new Date();
    return `${d.getFullYear()}-${pad(d.getMonth()+1)}-${pad(d.getDate())}_${pad(d.getHours())}-${pad(d.getMinutes())}-${pad(d.getSeconds())}`;
  };
  function toast(msg, ms = 1200) {
    if (!document.body) return;
    const el = document.createElement('div');
    el.className = 'jb-toast';
    el.textContent = msg;
    document.body.appendChild(el);
    setTimeout(() => el.remove(), ms);
  }
  function download(filename, data, type = 'application/octet-stream') {
    const blob = new Blob([data], { type });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    (document.body || document.documentElement).appendChild(a);
    a.click();
    a.remove();
    setTimeout(() => URL.revokeObjectURL(url), 1500);
  }

  // ---------- Load all messages ----------
  async function ensureAllMessagesLoaded(maxLoops = 28) {
    let last = 0;
    for (let i = 0; i < maxLoops; i++) {
      const c = document.querySelectorAll('[data-message-author-role]').length;
      if (c > last) {
        last = c;
        window.scrollTo({ top: 0, behavior: 'auto' });
        await sleep(650);
      } else break;
    }
  }
  const getMessageNodes = () => Array.from(document.querySelectorAll('[data-message-author-role]'));

  // ---------- Extractors ----------
  function sanitizeClone(node) {
    const clone = node.cloneNode(true);
    clone.querySelectorAll('*').forEach(el => {
      [...el.attributes].forEach(a => { if (/^on/i.test(a.name)) el.removeAttribute(a.name); });
    });
    return clone;
  }
  function stripUI(root) {
    [
      'button','svg','textarea','input','[role="menu"]',
      '[data-testid="copy-code-button"]','[data-testid="followup-actions"]',
      '[data-testid="toolbar"]','nav','header','footer',
      'figure:has(img[alt*="avatar"])','[aria-label="Actions"]'
    ].forEach(sel => root.querySelectorAll(sel).forEach(n => n.remove()));
  }
  function pickContentEl(node) {
    return node.querySelector('article')
        || node.querySelector('.markdown, .prose, [data-testid="conversation-turn-content"]')
        || node;
  }
  function extractCodeBlocks(root) {
    const blocks = [];
    root.querySelectorAll('pre').forEach(pre => {
      const code = pre.querySelector('code');
      const text = (code ? code.textContent : pre.textContent) || '';
      let lang = '';
      if (code) {
        const ds = code.getAttribute('data-language');
        if (ds) lang = ds.toLowerCase();
        if (!lang && code.className) {
          const m = code.className.match(/language-([a-z0-9]+)/i);
          if (m) lang = m[1].toLowerCase();
        }
      }
      blocks.push({ lang, text });
    });
    return blocks;
  }
  function htmlToPlainText(html) {
    const c = document.createElement('div');
    c.innerHTML = html;
    c.querySelectorAll('pre').forEach(pre => {
      pre.replaceWith(document.createTextNode('\n' + pre.textContent + '\n'));
    });
    c.querySelectorAll('br').forEach(br => br.replaceWith(document.createTextNode('\n')));
    c.querySelectorAll('li').forEach(li => li.insertAdjacentText('afterbegin', '• '));
    return c.innerText.replace(/\n{3,}/g, '\n\n').trim();
  }
  function extractTimestamp(node) {
    const t = node.querySelector('time[datetime]');
    if (t && t.getAttribute('datetime')) return t.getAttribute('datetime');
    for (const a of ['data-message-timestamp','data-timestamp','data-created','data-created-at']) {
      const v = node.getAttribute(a) || (node.dataset && node.dataset[a.replace('data-','').replace(/-([a-z])/g,(_,c)=>c.toUpperCase())]);
      if (v) return v;
    }
    const t2 = node.querySelector('time');
    if (t2 && t2.textContent) {
      const d = new Date(t2.textContent.trim());
      if (!isNaN(d.getTime())) return d.toISOString();
    }
    return null;
  }
  function extractMessageId(node) {
    const self = node.getAttribute('data-message-id');
    if (self) return self;
    const desc = node.querySelector('[data-message-id]');
    if (desc) return desc.getAttribute('data-message-id');
    const anc = node.closest('[data-message-id]');
    if (anc) return anc.getAttribute('data-message-id');
    const idLike = node.id || node.getAttribute('id');
    if (idLike && /message|msg|node/i.test(idLike)) return idLike;
    return null;
  }

  // AI-friendly fragments
  function extractFragments(root) {
    const out = [];
    const el = root.cloneNode(true);
    stripUI(el);

    function push(f) {
      if (!f) return;
      if (f.text && !f.text.trim()) return;
      out.push(f);
    }
    function getText(n) {
      return (n.innerText || '').replace(/\s+\n/g, '\n').replace(/\n{3,}/g, '\n\n').trim();
    }
    function readList(listEl, ordered) {
      const items = Array.from(listEl.children).map(li => getText(li)).filter(Boolean);
      return { type: ordered ? 'ordered_list' : 'unordered_list', items };
    }
    function readTable(tbl) {
      const rows = Array.from(tbl.querySelectorAll('tr')).map(tr =>
        Array.from(tr.children).map(td => getText(td))
      );
      const hasHeader = rows.length && tbl.querySelector('th') != null;
      return { type: 'table', header: hasHeader ? rows[0] : null, rows: hasHeader ? rows.slice(1) : rows };
    }

    const blocks = Array.from(el.children.length ? el.children : [el]);
    blocks.forEach(node => {
      if (node.nodeType !== 1) return;
      const tag = node.tagName;
      if (/^H[1-6]$/.test(tag)) push({ type: 'heading', level: +tag[1], text: getText(node) });
      else if (tag === 'P') push({ type: 'paragraph', text: getText(node) });
      else if (tag === 'UL') push(readList(node, false));
      else if (tag === 'OL') push(readList(node, true));
      else if (tag === 'PRE') {
        const code = node.querySelector('code');
        let lang = '';
        if (code) {
          const ds = code.getAttribute('data-language');
          if (ds) lang = ds.toLowerCase();
          if (!lang && code.className) {
            const m = code.className.match(/language-([a-z0-9]+)/i);
            if (m) lang = m[1].toLowerCase();
          }
        }
        push({ type: 'code_block', lang, code: code ? code.textContent : node.textContent });
      }
      else if (tag === 'BLOCKQUOTE') push({ type: 'blockquote', text: getText(node) });
      else if (tag === 'TABLE') push(readTable(node));
    });

    if (!out.length) out.push({ type: 'paragraph', text: getText(el) });
    return out;
  }

  function extractMessage(node) {
    const role = node.getAttribute('data-message-author-role') || 'unknown';
    const message_id = extractMessageId(node);
    const created_at_raw = extractTimestamp(node);
    const contentEl = pickContentEl(node);
    const clean = sanitizeClone(contentEl);
    stripUI(clean);
    const html = clean.innerHTML;
    const text = htmlToPlainText(html);
    const code_blocks = extractCodeBlocks(clean);
    const fragments = extractFragments(clean);
    return { role, message_id, created_at: created_at_raw || null, html, text, code_blocks, fragments };
  }

  async function collectTranscript() {
    await ensureAllMessagesLoaded();
    const nodes = getMessageNodes();
    let messages = nodes.map((n, i) => ({ index: i + 1, ...extractMessage(n) })).filter(m => m.text || m.html);

    if (messages.some(m => !m.created_at) && FILL_SYNTHETIC_TIMES) {
      const start = Date.now() - (messages.length * SYNTHETIC_STEP_MS);
      messages = messages.map((m, i) =>
        m.created_at
          ? { ...m, created_at_synthetic: false }
          : { ...m, created_at: new Date(start + i * SYNTHETIC_STEP_MS).toISOString(), created_at_synthetic: true }
      );
    } else {
      messages = messages.map(m => ({ ...m, created_at_synthetic: false }));
    }

    return {
      source_url: location.href,
      title: document.title || 'ChatGPT chat',
      exported_at: new Date().toISOString(),
      messages
    };
  }

  // ---------- RTF helpers (Unicode, links, lists, tables) ----------
  function escapeRtfU(str) {
    let out = '';
    for (let i = 0; i < str.length; i++) {
      let cp = str.codePointAt(i);
      if (cp > 0xFFFF) i++;
      const ch = String.fromCodePoint(cp);
      if (ch === '\\'){ out += '\\\\'; continue; }
      if (ch === '{'){ out += '\\{'; continue; }
      if (ch === '}'){ out += '\\}'; continue; }
      if (ch === '\r'){ continue; }
      if (ch === '\n'){ out += '\\line '; continue; }
      if (cp > 127){ out += `\\u${cp}?`; continue; }
      out += ch;
    }
    return out;
  }
  function fldinstEscape(s) { return String(s).replace(/\\/g, '\\\\').replace(/"/g, '\\"'); }

  function rtfTableFromDOM(table) {
    // Word-friendly: per-cell \\pard\\intbl ... \\cell, then \\row
    const rows = Array.from(table.querySelectorAll('tr')).map(tr => Array.from(tr.children));
    if (!rows.length) return '';
    const maxCols = Math.max(...rows.map(r => r.length));
    const cellW = Math.round(9000 / Math.max(1, maxCols)); // twips
    let r = '';
    rows.forEach(tr => {
      r += '\\trowd\\trgaph108\\trleft0 ';
      let x = 0;
      for (let i = 0; i < maxCols; i++) { x += cellW; r += `\\cellx${x} `; }
      tr.forEach((cell) => {
        const isHead = cell.tagName === 'TH';
        const txt = (cell.innerText || '').trim();
        if (isHead) r += '\\b ';
        r += `\\pard\\intbl ${escapeRtfU(txt)}\\cell `;
        if (isHead) r += '\\b0 ';
      });
      for (let k = tr.length; k < maxCols; k++) r += '\\pard\\intbl \\cell ';
      r += '\\row ';
    });
    return r;
  }

  function richFragmentToRtf(html) {
    const root = document.createElement('div');
    root.innerHTML = html;
    let out = '';

    function walk(node, ctx = { inList: false }) {
      if (node.nodeType === 3) { out += escapeRtfU(node.nodeValue); return; }
      if (node.nodeType !== 1) return;
      const tag = node.tagName;

      switch (tag) {
        case 'BR': out += '\\line '; break;
        case 'P':
          Array.from(node.childNodes).forEach(n => walk(n, ctx));
          if (!ctx.inList) out += '\\par ';
          break;
        case 'H1': case 'H2': case 'H3':
          out += '\\b '; if (tag === 'H1') out += '\\fs36 '; if (tag === 'H2') out += '\\fs32 '; if (tag === 'H3') out += '\\fs28 ';
          Array.from(node.childNodes).forEach(n => walk(n, ctx));
          out += '\\b0 \\fs24 \\par ';
          break;
        case 'STRONG': case 'B': out += '\\b '; Array.from(node.childNodes).forEach(n => walk(n, ctx)); out += ' \\b0 '; break;
        case 'EM': case 'I': out += '\\i '; Array.from(node.childNodes).forEach(n => walk(n, ctx)); out += ' \\i0 '; break;

        case 'UL':
          Array.from(node.children).forEach(li => {
            out += '\\pard\\tx720\\li720\\fi-360 \\bullet\\tab ';
            Array.from(li.childNodes).forEach(n => {
              if (n.nodeType === 1 && n.tagName === 'P') Array.from(n.childNodes).forEach(nn => walk(nn, { inList: true }));
              else walk(n, { inList: true });
            });
            out += '\\par ';
          });
          out += '\\pard ';
          break;

        case 'OL': {
          let counter = 1;
          Array.from(node.children).forEach(li => {
            out += `\\pard\\tx720\\li720\\fi-360 ${escapeRtfU(String(counter) + '.')}\\tab `;
            Array.from(li.childNodes).forEach(n => {
              if (n.nodeType === 1 && n.tagName === 'P') Array.from(n.childNodes).forEach(nn => walk(nn, { inList: true }));
              else walk(n, { inList: true });
            });
            out += '\\par ';
            counter++;
          });
          out += '\\pard ';
          break;
        }

        case 'BLOCKQUOTE':
          out += '\\li360 ';
          Array.from(node.childNodes).forEach(n => walk(n, ctx));
          out += '\\li0 \\par ';
          break;

        case 'PRE': {
          const code = node.querySelector('code');
          const text = code ? code.textContent : node.textContent;
          out += '{\\pard\\f1\\cb2 ' + escapeRtfU(text) + ' \\par} ';
          break;
        }
        case 'CODE': {
          if (node.parentElement && node.parentElement.tagName === 'PRE') break;
          out += '{\\f1 ' + escapeRtfU(node.textContent) + '} ';
          break;
        }
        case 'A': {
          const href = node.getAttribute('href') || '';
          const label = node.textContent || href;
          out += `{\\field{\\*\\fldinst HYPERLINK "${fldinstEscape(href)}"}{\\fldrslt ${escapeRtfU(label)}}}`;
          break;
        }
        case 'TABLE': {
          out += rtfTableFromDOM(node);
          break;
        }
        default:
          Array.from(node.childNodes).forEach(n => walk(n, ctx));
      }
    }

    Array.from(root.childNodes).forEach(n => walk(n));
    return out;
  }

  function buildRTF(doc) {
    let body = '';
    doc.messages.forEach(m => {
      const roleLabel = m.role === 'user' ? 'User' : m.role === 'assistant' ? 'ChatGPT' : m.role === 'system' ? 'System' : m.role;
      const approx = m.created_at_synthetic ? ' ~' : '';
      const metaParts = [];
      if (m.created_at) metaParts.push(`${m.created_at}${approx}`);
      if (m.message_id) metaParts.push(`id: ${m.message_id}`);
      const meta = metaParts.join('; ');

      // Role + small inline meta in parentheses
      body += `\\b ${escapeRtfU(roleLabel)} \\b0`;
      if (meta) body += ` {\\fs18 (${escapeRtfU(meta)})}\\par `;
      else body += ' \\par ';

      body += richFragmentToRtf(m.html || m.text || '');
      body += '\\par\\par '; // blank line between messages
    });

    return '{\\rtf1\\ansi\\ansicpg1252\\deff0\\uc1'
      + '{\\fonttbl{\\f0 Segoe UI;}{\\f1 Courier New;}}'
      + '{\\colortbl;\\red0\\green0\\blue0;\\red243\\green244\\blue246;}' // \cb2 for code
      + '\\fs24 ' + body + '}';
  }

  // ---------- Export actions ----------
  async function exportJSON() {
    try {
      toast('Collecting transcript (JSON)…');
      const data = await collectTranscript();
      const titleSlug = (document.title || 'chat_transcript').replace(/[^\p{L}\p{N} _-]+/gu,'').replace(/\s+/g,'_').slice(0,70) || 'chat_transcript';
      const fname = `${titleSlug}_${dateStamp()}.json`;
      download(fname, JSON.stringify(data, null, 2), 'application/json;charset=utf-8');
      toast('JSON downloaded ✔');
    } catch (e) {
      console.error('[Chat Transcript Exporter] JSON error', e);
      toast('JSON export failed (see console).');
    }
  }
  async function exportRTF() {
    try {
      toast('Collecting transcript (RTF)…');
      const data = await collectTranscript();
      const rtf = buildRTF(data);
      const titleSlug = (document.title || 'chat_transcript').replace(/[^\p{L}\p{N} _-]+/gu,'').replace(/\s+/g,'_').slice(0,70) || 'chat_transcript';
      const fname = `${titleSlug}_${dateStamp()}.rtf`;
      download(fname, rtf, 'application/rtf;charset=utf-8');
      toast('RTF downloaded ✔');
    } catch (e) {
      console.error('[Chat Transcript Exporter] RTF error', e);
      toast('RTF export failed (see console).');
    }
  }

  // ---------- UI (top-right) ----------
  function topbarBottomY() {
    for (const sel of ['header[role="banner"]','[data-testid="top-nav"]','nav[role="navigation"]','header']) {
      const el = document.querySelector(sel);
      if (el) { const r = el.getBoundingClientRect(); if (r.bottom > 0) return Math.max(r.bottom + 12, 60); }
    }
    return 84;
  }
  function ensureToolbar() {
    if (!document.body) return;
    let bar = document.querySelector('.jb-toolbar');
    const top = topbarBottomY();
    if (!bar) {
      bar = document.createElement('div');
      bar.className = 'jb-toolbar';

      const btnJson = document.createElement('button');
      btnJson.className = 'jb-btn';
      btnJson.textContent = 'Export JSON';
      btnJson.title = 'Download transcript as JSON';
      btnJson.addEventListener('click', exportJSON);

      const btnRtf = document.createElement('button');
      btnRtf.className = 'jb-btn';
      btnRtf.textContent = 'Export RTF';
      btnRtf.title = 'Download transcript as RTF';
      btnRtf.addEventListener('click', exportRTF);

      bar.append(btnJson, btnRtf);
      document.body.appendChild(bar);
      toast('Exporter active');
      console.info('[Chat Transcript Exporter] Toolbar ready');
    }
    bar.style.top = `${top}px`;
  }

  // Tampermonkey menu
  if (typeof GM_registerMenuCommand === 'function') {
    GM_registerMenuCommand('Export JSON', exportJSON);
    GM_registerMenuCommand('Export RTF', exportRTF);
  }

  // Lifecycle
  const boot = () => {
    const readyInt = setInterval(() => {
      if (document.body) { ensureToolbar(); clearInterval(readyInt); }
    }, 200);
    const mo = new MutationObserver(() => ensureToolbar());
    mo.observe(document.documentElement, { childList: true, subtree: true });
    window.addEventListener('resize', ensureToolbar);
    window.addEventListener('scroll', ensureToolbar);
  };
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', boot, { once: true });
  } else {
    boot();
  }
})();
