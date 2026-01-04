// ==UserScript==
// @name         Google Scholar: One-Click Copy BibTeX (GM_xmlhttpRequest fix)
// @namespace    franz.tools.scholar.copybib
// @version      0.5.0
// @description  Add a "Copy BibTeX" button to each Google Scholar result and copy BibTeX in one click. Uses GM_xmlhttpRequest to bypass CORS issues.
// @author       Franz
// @match        *://scholar.google.com/scholar*
// @match        *://scholar.google.com.hk/scholar*
// @include      /^https?:\/\/scholar\.google\.[^\/]+\/scholar.*/
// @run-at       document-end
// @grant        GM_setClipboard
// @grant        GM_xmlhttpRequest
// @connect      scholar.googleusercontent.com
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/547522/Google%20Scholar%3A%20One-Click%20Copy%20BibTeX%20%28GM_xmlhttpRequest%20fix%29.user.js
// @updateURL https://update.greasyfork.org/scripts/547522/Google%20Scholar%3A%20One-Click%20Copy%20BibTeX%20%28GM_xmlhttpRequest%20fix%29.meta.js
// ==/UserScript==

(function () {
  'use strict';

  const RESULT_CONTAINER_SELECTOR = '.gs_r.gs_or.gs_scl';
  const RESULT_INNER_SELECTOR     = '.gs_ri';
  const ACTION_BAR_SELECTOR       = '.gs_fl';
  const CITE_LINK_SELECTOR        = 'a.gs_or_cit, a[aria-controls="gs_cit"]';
  const BTN_CLASS                 = 'copy-bibtex-btn';

  injectStyle(`
    .${BTN_CLASS} {
      font: 13px/1.4 Arial, sans-serif;
      padding: 0 8px;
      margin-left: 8px;
      cursor: pointer;
      border: 1px solid rgba(0,0,0,0.25);
      background: #f8f9fa;
      border-radius: 3px;
      color: #202124;
      height: 24px;
    }
    .${BTN_CLASS}:disabled { opacity: 0.6; cursor: default; }
    .${BTN_CLASS}.ok { background: #e6f4ea; border-color: #34a853; }
    .${BTN_CLASS}.fail { background: #fce8e6; border-color: #d93025; }
    .copy-bibtex-toast {
      position: fixed; right: 16px; bottom: 16px;
      background: rgba(32,33,36,.95); color: #fff;
      padding: 8px 12px; border-radius: 6px;
      z-index: 999999; font: 13px/1.3 Arial, sans-serif;
      box-shadow: 0 4px 18px rgba(0,0,0,.25);
    }
  `);

  addButtonsToAll();
  observeForNewResults(() => addButtonsToAll());

  function addButtonsToAll() {
    const results = document.querySelectorAll(RESULT_CONTAINER_SELECTOR);
    for (const res of results) {
      if (res.dataset.copyBibInjected === '1') continue;
      const inner = res.querySelector(RESULT_INNER_SELECTOR);
      if (!inner) continue;

      const actionBar = inner.querySelector(ACTION_BAR_SELECTOR) || inner;
      const citeAnchor = inner.querySelector(CITE_LINK_SELECTOR);
      const cid = extractCitationId(res, citeAnchor);
      if (!cid) continue;

      const lang = document.documentElement.getAttribute('lang') || 'en';
      const citeUrl = new URL('/scholar', location.origin);
      citeUrl.searchParams.set('hl', lang);
      citeUrl.searchParams.set('q', `info:${cid}:scholar.google.com`);
      citeUrl.searchParams.set('output', 'cite');

      const btn = document.createElement('button');
      btn.type = 'button';
      btn.className = BTN_CLASS;
      btn.textContent = 'Copy BibTeX';
      btn.addEventListener('click', async (e) => {
        e.preventDefault();
        e.stopPropagation();
        await handleCopy(btn, citeUrl.toString());
      });

      actionBar.appendChild(btn);
      res.dataset.copyBibInjected = '1';
    }
  }

  function extractCitationId(resultEl, citeAnchor) {
    let cid = citeAnchor?.dataset?.cid || citeAnchor?.getAttribute?.('data-cid')
           || citeAnchor?.dataset?.id  || citeAnchor?.getAttribute?.('data-id')
           || resultEl.getAttribute('data-cid');
    const href = citeAnchor?.getAttribute?.('href') || '';
    if (!cid && href) {
      const m = href.match(/info:([^:]+):scholar\.google\.com/);
      if (m) cid = m[1];
    }
    return cid || null;
  }

  async function fetchBibTeX(citePageUrl) {
    // Step 1: fetch cite page normally
    const resp = await fetch(citePageUrl, { credentials: 'include' });
    if (!resp.ok) throw new Error(`Cite page HTTP ${resp.status}`);
    const html = await resp.text();
    const doc = new DOMParser().parseFromString(html, 'text/html');

    // Step 2: find BibTeX link
    const bibLink = Array.from(doc.querySelectorAll('a')).find(a => /BibTeX/i.test(a.textContent || ''));
    if (!bibLink) throw new Error('BibTeX link not found');
    const bibUrl = new URL(bibLink.getAttribute('href'), location.origin).toString();

    // Step 3: fetch BibTeX with GM_xmlhttpRequest (bypass CORS)
    return new Promise((resolve, reject) => {
      GM_xmlhttpRequest({
        method: "GET",
        url: bibUrl,
        onload: function (r) {
          if (r.status === 200) resolve(r.responseText);
          else reject(new Error(`BibTeX HTTP ${r.status}`));
        },
        onerror: function (err) {
          reject(new Error(`BibTeX request failed: ${err.error}`));
        }
      });
    });
  }

  async function writeClipboardRobust(text) {
    try {
      GM_setClipboard(text, { type: 'text', mimetype: 'text/plain' });
      return true;
    } catch (_) {}
    if (navigator.clipboard?.writeText) {
      await navigator.clipboard.writeText(text);
      return true;
    }
    showManualCopy(text);
    return false;
  }

  async function handleCopy(btn, citeUrl) {
    const origText = btn.textContent;
    try {
      btn.disabled = true;
      btn.textContent = 'Fetching…';
      const bib = await fetchBibTeX(citeUrl);
      btn.textContent = 'Copying…';
      const ok = await writeClipboardRobust(bib);
      if (ok) {
        btn.textContent = 'Copied ✓';
        btn.classList.add('ok');
        showToast('BibTeX copied to clipboard.');
      } else {
        btn.textContent = 'Copied (manual)';
        btn.classList.add('ok');
        showToast('Clipboard blocked. Manual copy dialog opened.');
      }
    } catch (err) {
      console.error('[Copy BibTeX] Error:', err);
      btn.textContent = 'Failed';
      btn.classList.add('fail');
      showToast('Failed to copy BibTeX. See console for details.');
    } finally {
      setTimeout(() => {
        btn.disabled = false;
        btn.textContent = origText;
        btn.classList.remove('ok', 'fail');
      }, 1400);
    }
  }

  function observeForNewResults(onChange) {
    const mo = new MutationObserver((mutations) => {
      for (const m of mutations) {
        if (m.addedNodes && m.addedNodes.length) { onChange(); break; }
      }
    });
    mo.observe(document.body, { childList: true, subtree: true });
  }

  function showToast(msg) {
    const el = document.createElement('div');
    el.className = 'copy-bibtex-toast';
    el.textContent = msg;
    document.body.appendChild(el);
    setTimeout(() => el.remove(), 1600);
  }

  function showManualCopy(text) {
    const overlay = document.createElement('div');
    overlay.style.cssText = `
      position: fixed; inset: 0; background: rgba(0,0,0,.4); z-index: 999999;
      display: flex; align-items: center; justify-content: center; padding: 24px;
    `;
    const panel = document.createElement('div');
    panel.style.cssText = `
      background: #fff; padding: 16px; border-radius: 8px; max-width: 800px; width: 90%;
      box-shadow: 0 8px 30px rgba(0,0,0,.25); font: 13px Arial, sans-serif;
    `;
    const info = document.createElement('div');
    info.textContent = 'Clipboard blocked. Press ⌘/Ctrl+A then ⌘/Ctrl+C to copy:';
    info.style.marginBottom = '8px';
    const ta = document.createElement('textarea');
    ta.value = text; ta.rows = 16; ta.style.width = '100%';
    const closeBtn = document.createElement('button');
    closeBtn.textContent = 'Close';
    closeBtn.style.cssText = 'margin-top: 8px; padding: 4px 10px;';
    closeBtn.onclick = () => overlay.remove();
    panel.append(info, ta, closeBtn);
    overlay.append(panel);
    document.body.appendChild(overlay);
    ta.focus(); ta.select();
  }

  function injectStyle(css) {
    const style = document.createElement('style');
    style.textContent = css;
    document.head.appendChild(style);
  }
})();
