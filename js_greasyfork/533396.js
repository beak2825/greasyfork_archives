// ==UserScript==
// @name         AppAgg - Auto Copy Clean Play Store Link
// @namespace    abadi718
// @version      7.0
// @description  Automatically resolves AppAgg redirect and copies a clean Play Store link (no referrer, no utm params)
// @author       abadi718
// @match        https://appagg.com/android/*
// @grant        GM_setClipboard
// @grant        GM_xmlhttpRequest
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/533396/AppAgg%20-%20Auto%20Copy%20Clean%20Play%20Store%20Link.user.js
// @updateURL https://update.greasyfork.org/scripts/533396/AppAgg%20-%20Auto%20Copy%20Clean%20Play%20Store%20Link.meta.js
// ==/UserScript==

(function() {
  'use strict';

  // ---- Helper: extract AppAgg tokens ----
  function findTokens() {
    if (window._gbe && window._gt) return { gbe: window._gbe, gt: window._gt };
    for (const s of document.scripts) {
      const m1 = s.textContent.match(/_gbe\s*=\s*['"]([^'"]+)['"]/);
      const m2 = s.textContent.match(/_gt\s*=\s*['"]([^'"]+)['"]/);
      if (m1 && m2) return { gbe: m1[1], gt: m2[1] };
    }
    return null;
  }

  // ---- Helper: resolve redirect ----
  function resolvePlayStoreLink(appaggUrl) {
    return new Promise((resolve) => {
      GM_xmlhttpRequest({
        method: "GET",
        url: appaggUrl,
        onload: (res) => {
          const locationHeader = res.responseHeaders.match(/location:\s*(\S+)/i);
          const finalUrl = res.finalUrl || (locationHeader ? locationHeader[1] : '');
          if (finalUrl && finalUrl.includes('play.google.com')) resolve(finalUrl.trim());
          else resolve(null);
        },
        onerror: () => resolve(null)
      });
    });
  }

  // ---- Helper: clean the Play Store link ----
  function cleanPlayStoreLink(url) {
    try {
      const u = new URL(url);
      if (!u.hostname.includes('play.google.com')) return url;
      const id = u.searchParams.get('id');
      if (!id) return url;
      return `https://play.google.com/store/apps/details?id=${id}`;
    } catch {
      return url;
    }
  }

  // ---- UI Builder ----
  function buildUI(initialText = "Resolving...") {
    const box = document.createElement('div');
    Object.assign(box.style, {
      position: 'fixed',
      bottom: '20px',
      right: '20px',
      zIndex: 9999,
      background: 'rgba(255,255,255,0.96)',
      padding: '10px',
      borderRadius: '8px',
      boxShadow: '0 2px 8px rgba(0,0,0,0.3)',
      fontFamily: 'system-ui, sans-serif',
      width: '420px'
    });

    const input = document.createElement('input');
    input.type = 'text';
    input.value = initialText;
    input.style.width = '100%';
    input.style.padding = '6px';
    input.style.marginBottom = '6px';
    input.style.fontSize = '13px';
    input.readOnly = true;

    const btnCopy = document.createElement('button');
    btnCopy.textContent = '📋 Copy';
    Object.assign(btnCopy.style, {
      background: '#007bff',
      color: '#fff',
      border: 'none',
      borderRadius: '6px',
      padding: '6px 10px',
      cursor: 'pointer',
      marginRight: '6px'
    });

    const btnRetry = document.createElement('button');
    btnRetry.textContent = '🔄 Retry';
    Object.assign(btnRetry.style, {
      background: '#28a745',
      color: '#fff',
      border: 'none',
      borderRadius: '6px',
      padding: '6px 10px',
      cursor: 'pointer'
    });

    box.append(input, btnCopy, btnRetry);
    document.body.appendChild(box);
    return { box, input, btnCopy, btnRetry };
  }

  // ---- Main Logic ----
  async function run() {
    const ui = buildUI();
    const { input, btnCopy, btnRetry } = ui;

    async function process() {
      input.value = "🔍 Resolving redirect...";
      const tokens = findTokens();
      if (!tokens) {
        input.value = "⚠️ Tokens not found, retrying...";
        setTimeout(process, 1000);
        return;
      }

      const { gbe, gt } = tokens;
      const redirectUrl = `https://appagg.com/go/${gbe}${gt}`;
      console.log("[AppAgg Copy] Redirect URL:", redirectUrl);

      const resolved = await resolvePlayStoreLink(redirectUrl);
      if (!resolved) {
        input.value = "⚠️ Failed to resolve Play Store link (CORS or redirect blocked)";
        return;
      }

      const clean = cleanPlayStoreLink(resolved);
      input.value = clean;
      GM_setClipboard(clean);
      console.log("[AppAgg Copy] ✅ Copied Clean Play Store Link:", clean);
    }

    btnCopy.onclick = () => {
      GM_setClipboard(input.value);
      alert(`✅ Copied:\n${input.value}`);
    };

    btnRetry.onclick = () => {
      process();
    };

    await process(); // Run immediately on load
  }

  run();
})();
