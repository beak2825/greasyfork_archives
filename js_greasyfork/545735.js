// ==UserScript==
// @name         GTA 3 KICK CHAT
// @namespace    http://tampermonkey.net/
// @version      1.3
// @description  GTA 3 KICK
// @match        https://kicklet.app/overlay/*
// @run-at       document-start
// @all-frames   true
// @grant        GM_addStyle
// @grant        GM_xmlhttpRequest
// @connect      fonts.cdnfonts.com
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/545735/GTA%203%20KICK%20CHAT.user.js
// @updateURL https://update.greasyfork.org/scripts/545735/GTA%203%20KICK%20CHAT.meta.js
// ==/UserScript==

(function () {
  'use strict';

  const CSS_URL = 'https://fonts.cdnfonts.com/css/pricedown';
  const FAMILY_LIST = `'Pricedown Bl','Pricedown','Pricedown Black',sans-serif`;
  const FORCE_CSS = `
    *, *::before, *::after, input, button, textarea, select {
      font-family: ${FAMILY_LIST} !important;
      font-feature-settings: 'liga' 1;
      text-transform: uppercase !important;
    }
    .sender {
      filter: brightness(0.8) saturate(0.5) !important;
    }
  `;

  function injectStyle(root) {
    if (!root || root.__pricedownStyle) return;
    const style = document.createElement('style');
    style.setAttribute('data-pricedown', 'true');
    style.textContent = FORCE_CSS;
    root.appendChild(style);
    root.__pricedownStyle = true;
  }

  const origAttach = Element.prototype.attachShadow;
  if (origAttach) {
    Element.prototype.attachShadow = function (init) {
      const sr = origAttach.call(this, init);
      queueMicrotask(() => injectStyle(sr));
      return sr;
    };
  }

  new MutationObserver((muts) => {
    for (const m of muts) {
      for (const n of m.addedNodes || []) {
        if (n && n.shadowRoot) injectStyle(n.shadowRoot);
      }
    }
  }).observe(document, { subtree: true, childList: true });

  injectStyle(document.documentElement);

  const link = document.createElement('link');
  link.rel = 'stylesheet';
  link.href = CSS_URL;
  document.documentElement.appendChild(link);

  function fetchText(url) {
    return new Promise((resolve, reject) => {
      GM_xmlhttpRequest({
        method: 'GET',
        url,
        onload: (res) => (res.status >= 200 && res.status < 300 ? resolve(res.responseText) : reject(new Error('HTTP ' + res.status))),
        onerror: reject,
      });
    });
  }

  function fetchArrayBuffer(url) {
    return new Promise((resolve, reject) => {
      GM_xmlhttpRequest({
        method: 'GET',
        url,
        responseType: 'arraybuffer',
        onload: (res) => (res.status >= 200 && res.status < 300 ? resolve(res.response) : reject(new Error('HTTP ' + res.status))),
        onerror: reject,
      });
    });
  }

  async function ensureFont() {
    try {
      await document.fonts.load(`1em Pricedown`);
      if ([...document.fonts].some((f) => /pricedown/i.test(f.family))) return;

      const css = await fetchText(CSS_URL);
      const re = /url\((['"]?)([^'")]+?\.(?:woff2?|otf|ttf))\1\)/ig;
      let match, fontUrl = null;
      while ((match = re.exec(css))) {
        const cand = match[2];
        if (/woff2?|otf|ttf/i.test(cand)) {
          fontUrl = new URL(cand, CSS_URL).href;
          break;
        }
      }
      if (!fontUrl) return;

      const buf = await fetchArrayBuffer(fontUrl);
      const blob = new Blob([buf], { type: 'font/woff2' });
      const blobUrl = URL.createObjectURL(blob);

      for (const fam of ['Pricedown Bl', 'Pricedown', 'Pricedown Black']) {
        const ff = new FontFace(fam, `url(${blobUrl})`);
        await ff.load();
        document.fonts.add(ff);
      }

      document.documentElement.style.fontFamily = `${FAMILY_LIST}, system-ui`;

      setTimeout(() => URL.revokeObjectURL(blobUrl), 30000);
    } catch (_) {}
  }

  ensureFont();
})();