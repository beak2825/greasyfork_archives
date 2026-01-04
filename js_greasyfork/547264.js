// ==UserScript==
// @name         Random Image Downloader (Alt+Shift+D)
// @namespace    https://greasyfork.org/en/users/your-name
// @version      1.0.0
// @description  Download a random image from the current page. Click the floating button or press Alt+Shift+D.
// @author       Your Name
// @license      MIT
// @match        *://*/*
// @grant        GM_xmlhttpRequest
// @connect      *
// @downloadURL https://update.greasyfork.org/scripts/547264/Random%20Image%20Downloader%20%28Alt%2BShift%2BD%29.user.js
// @updateURL https://update.greasyfork.org/scripts/547264/Random%20Image%20Downloader%20%28Alt%2BShift%2BD%29.meta.js
// ==/UserScript==

(function () {
  'use strict';

  // ---- helpers -------------------------------------------------------------
  const sleep = (ms) => new Promise(r => setTimeout(r, ms));

  function pickImages() {
    // Grab all <img> plus common meta images (og:image) as fallbacks
    const imgTags = Array.from(document.querySelectorAll('img[src]'))
      .map(img => img.src)
      .filter(Boolean);

    const og = document.querySelector('meta[property="og:image"], meta[name="og:image"]');
    const ogUrl = og?.content?.trim();

    const candidates = [...new Set([...imgTags, ...(ogUrl ? [ogUrl] : [])])];

    // Filter out obvious sprites/very tiny images
    const filtered = candidates.filter((url) => {
      const u = url.toLowerCase();
      if (u.startsWith('data:')) return false;
      if (u.endsWith('.svg')) return false; // optional: skip SVGs
      // Skip tracking pixels and favicons
      if (u.includes('pixel') || u.includes('tracker') || u.includes('favicon')) return false;
      return true;
    });

    return filtered.length ? filtered : candidates;
  }

  function filenameFromUrl(url) {
    try {
      const u = new URL(url, location.href);
      const base = u.pathname.split('/').filter(Boolean).pop() || 'image';
      const clean = base.split('?')[0].split('#')[0];
      const ts = new Date().toISOString().replace(/[:.]/g, '-');
      return clean || `image-${ts}.jpg`;
    } catch {
      return `image-${Date.now()}.jpg`;
    }
  }

  function downloadViaBlob(url) {
    return new Promise((resolve, reject) => {
      GM_xmlhttpRequest({
        method: 'GET',
        url,
        responseType: 'blob',
        onload: (res) => {
          if (!res.response) return reject(new Error('Empty response'));
          const blob = res.response;
          const blobUrl = URL.createObjectURL(blob);
          const a = document.createElement('a');
          a.href = blobUrl;
          a.download = filenameFromUrl(url);
          document.body.appendChild(a);
          a.click();
          a.remove();
          URL.revokeObjectURL(blobUrl);
          resolve();
        },
        onerror: (e) => reject(e instanceof Error ? e : new Error('Request failed')),
      });
    });
  }

  function createToast() {
    const el = document.createElement('div');
    el.style.position = 'fixed';
    el.style.zIndex = '2147483647';
    el.style.right = '16px';
    el.style.bottom = '16px';
    el.style.padding = '10px 14px';
    el.style.borderRadius = '12px';
    el.style.background = 'rgba(0,0,0,0.8)';
    el.style.color = '#fff';
    el.style.font = '14px/1.3 system-ui, -apple-system, Segoe UI, Roboto, Arial, sans-serif';
    el.style.boxShadow = '0 6px 24px rgba(0,0,0,0.2)';
    el.style.pointerEvents = 'none';
    el.style.opacity = '0';
    el.style.transition = 'opacity .18s ease';
    document.documentElement.appendChild(el);
    return {
      show(msg) {
        el.textContent = msg;
        el.style.opacity = '1';
        clearTimeout(el._t);
        el._t = setTimeout(() => (el.style.opacity = '0'), 2200);
      }
    };
  }

  function createButton(onClick) {
    const btn = document.createElement('button');
    btn.textContent = '↓ Random Image';
    Object.assign(btn.style, {
      position: 'fixed',
      right: '16px',
      bottom: '64px',
      zIndex: 2147483647,
      padding: '10px 12px',
      borderRadius: '999px',
      border: 'none',
      font: '13px/1.2 system-ui, -apple-system, Segoe UI, Roboto, Arial, sans-serif',
      boxShadow: '0 6px 24px rgba(0,0,0,0.2)',
      cursor: 'pointer',
      background: '#111',
      color: '#fff',
      opacity: '0.9'
    });
    btn.addEventListener('mouseenter', () => (btn.style.opacity = '1'));
    btn.addEventListener('mouseleave', () => (btn.style.opacity = '0.9'));
    btn.addEventListener('click', onClick);
    document.documentElement.appendChild(btn);
    return btn;
  }

  // ---- main ---------------------------------------------------------------
  const toast = createToast();

  async function runDownload() {
    const list = pickImages();
    if (!list.length) {
      toast.show('No images found on this page.');
      return;
    }
    const pick = list[Math.floor(Math.random() * list.length)];

    toast.show('Downloading image...');
    try {
      await downloadViaBlob(pick);
      toast.show('Image downloaded.');
    } catch (e) {
      // Fallback: try direct navigation if blob download fails
      try {
        const a = document.createElement('a');
        a.href = pick;
        a.target = '_blank';
        a.rel = 'noopener';
        document.body.appendChild(a);
        a.click();
        a.remove();
        toast.show('Opened image in a new tab (save it manually).');
      } catch {
        toast.show('Download failed.');
      }
    }
  }

  // Add UI button
  createButton(runDownload);

  // Add keyboard shortcut: Alt+Shift+D
  window.addEventListener('keydown', (e) => {
    if (e.altKey && e.shiftKey && (e.key === 'D' || e.key === 'd')) {
      e.preventDefault();
      runDownload();
    }
  });

  // Optional: delay a bit so images can load on heavy pages
  (async () => {
    await sleep(800);
    // no-op; ensures DOM is mostly ready
  })();
})();