// ==UserScript==
// @name         ChatGPT Chat Exporter (beta)
// @namespace    https://github.com/merlinm/chatgpt-exporter
// @version      0.93
// @description  Adds an “Export Chat” button to ChatGPT threads (JSON / TXT)
// @author       Merlin McKean
// @license      MIT
// @match        https://chat.openai.com/*
// @match        https://chatgpt.com/*
// @grant        GM_xmlhttpRequest
// @grant        GM_download
// @connect      chat.openai.com
// @connect      chatgpt.com
// @downloadURL https://update.greasyfork.org/scripts/544932/ChatGPT%20Chat%20Exporter%20%28beta%29.user.js
// @updateURL https://update.greasyfork.org/scripts/544932/ChatGPT%20Chat%20Exporter%20%28beta%29.meta.js
// ==/UserScript==

(function () {
  'use strict';

  /* ---------- 0. Config ---------- */

  // Works on both chat.openai.com and chatgpt.com
  const BASE = location.origin; // e.g. "https://chatgpt.com"

  /* ---------- 1. Helpers ---------- */

  // Lightweight XHR helper that keeps cookies
  function apiRequest(method, url, headers = {}, data = null) {
    return new Promise((resolve, reject) => {
      GM_xmlhttpRequest({
        method,
        url,
        headers,
        data: data ? JSON.stringify(data) : null,
        responseType: 'json',
        withCredentials: true,
        onload: ({ status, response }) =>
          status >= 200 && status < 300
            ? resolve(response)
            : reject(Error(`HTTP ${status}`)),
        onerror: reject,
      });
    });
  }

  // Grab JWT access-token
  async function getAccessToken() {
    const { accessToken } = await apiRequest('GET', `${BASE}/api/auth/session`);
    if (!accessToken) throw Error('No access token returned');
    return accessToken;
  }

  // Pull the full conversation JSON blob
  async function getConversation(chatId) {
    const token = await getAccessToken();
    return await apiRequest(
      'GET',
      `${BASE}/backend-api/conversation/${chatId}`,
      { Authorization: `Bearer ${token}` }
    );
  }

  /* ---------- 2. Formatting ---------- */

  // Convert OpenAI’s “mapping” object to an ordered array
  function mappingToOrderedArray(mapping) {
    return Object.values(mapping)
      .filter((m) => m.message?.content?.parts?.length)
      .map((m) => ({
        role: m.message.author.role, // 'user' | 'assistant'
        text: m.message.content.parts.join('\n'),
        time: m.message.create_time,
      }))
      .sort((a, b) => a.time - b.time);
  }

  // Build a plaintext version (handy for quick grep)
  function toTxt(name, msgs) {
    let out = `Chat Title: ${name}\nDate: ${new Date().toISOString()}\n\n`;
    msgs.forEach((m) => {
      const who = m.role === 'user' ? 'User' : 'ChatGPT';
      out += `${who}:\n${m.text}\n\n`;
    });
    return out.trim();
  }

  function download(str, filename) {
    const blob = new Blob([str], { type: 'text/plain' });
    GM_download({ url: URL.createObjectURL(blob), name: filename });
  }

  /* ---------- 3. UI ---------- */

  function addButton() {
    // Avoid duplicates when ChatGPT navigates SPA-style
    if (document.getElementById('m_export_btn')) return;

    const btn = document.createElement('button');
    btn.id = 'm_export_btn';
    btn.textContent = 'Export Chat';
    Object.assign(btn.style, {
      position: 'fixed',
      bottom: '90px',
      right: '20px',
      padding: '10px 18px',
      fontSize: '14px',
      background: '#202123',
      color: '#fff',
      border: 'none',
      borderRadius: '6px',
      cursor: 'pointer',
      zIndex: 9999,
    });

btn.onclick = async () => {
  const format = prompt('json / txt / clean?', 'json').toLowerCase();
  if (!['json', 'txt', 'clean'].includes(format)) {
    alert('Type “json”, “txt”, or “clean”.'); return;
  }

  try {
    const chatId = getChatIdFromUrl();
    const raw    = await getConversation(chatId);

    // always build the tidy array once
    const msgs = mappingToOrderedArray(raw.mapping);
    const fileBase = `chatgpt_${chatId}_${Date.now()}`;

    if (format === 'json') {
      download(JSON.stringify(raw,  null, 2), `${fileBase}.json`);
    } else if (format === 'clean') {
      download(JSON.stringify(msgs, null, 2), `${fileBase}.clean.json`);
    } else { // txt
      download(toTxt(raw.title ?? 'Untitled', msgs), `${fileBase}.txt`);
    }
    alert('Export complete!');
  } catch(e) {
    console.error(e); alert(`Export failed — ${e.message}`);
  }
};


    document.body.appendChild(btn);
  }

  /* ---------- 4. Routing helpers ---------- */

  function getChatIdFromUrl() {
    // Handles /c/<id>, /chat/<id>, and /share/<id>
    const m = location.pathname.match(/\/(?:c|chat|share)\/([\w-]+)/);
    if (!m) throw Error('Could not find conversation ID in URL');
    return m[1];
  }

  // Watch for internal SPA navigation
  let lastUrl = '';
  new MutationObserver(() => {
    if (location.href !== lastUrl) {
      lastUrl = location.href;
      setTimeout(addButton, 600); // let the DOM settle
    }
  }).observe(document, { childList: true, subtree: true });

  // Initial run once the page finishes loading
  window.addEventListener('load', addButton);
})();
