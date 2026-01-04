// ==UserScript==
// @name         Sakugabooru Browse Fix (Alt+D Download, Alt+C copy)
// @namespace    http://tampermonkey.net/
// @version      0.75
// @description  Swap sample img→video (MP4/WEBM) when appropriate; download/copy ORIGINAL source via keyboard
// @match        *://www.sakugabooru.com/post/browse*
// @license      MIT
// @grant        GM_download
// @grant        GM_xmlhttpRequest
// @connect      *
// @downloadURL https://update.greasyfork.org/scripts/506018/Sakugabooru%20Browse%20Fix%20%28Alt%2BD%20Download%2C%20Alt%2BC%20copy%29.user.js
// @updateURL https://update.greasyfork.org/scripts/506018/Sakugabooru%20Browse%20Fix%20%28Alt%2BD%20Download%2C%20Alt%2BC%20copy%29.meta.js
// ==/UserScript==

(function () {
  'use strict';

  // -------------------- Debug toggle (optional) --------------------
  const DBG = false;
  const log = (...a) => DBG && console.log('[Sakuga]', ...a);

  // -------------------- UI: centered toast --------------------
  function toast(msg) {
    console.log('[Sakuga]', msg);
    try {
      const n = document.createElement('div');
      n.textContent = msg;
      Object.assign(n.style, {
        position: 'fixed',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        padding: '10px 14px',
        background: 'rgba(0,0,0,0.8)',
        color: '#fff',
        fontSize: '14px',
        borderRadius: '8px',
        zIndex: 999999,
        pointerEvents: 'none',
        textAlign: 'center',
        whiteSpace: 'nowrap',
        boxShadow: '0 2px 6px rgba(0,0,0,0.5)',
        transition: 'opacity 0.3s ease'
      });
      n.style.opacity = '0';
      document.body.appendChild(n);
      requestAnimationFrame(() => { n.style.opacity = '1'; });
      setTimeout(() => {
        n.style.opacity = '0';
        setTimeout(() => n.remove(), 300);
      }, 1000);
    } catch {}
  }

  // -------------------- Generic helpers --------------------
  const EXT_PRIORITY_VIDEO = ['.mp4', '.webm'];
  const EXT_PRIORITY_IMAGE = ['.png', '.jpg', '.jpeg', '.gif', '.webp'];

  const uniq = (arr) => {
    const s = new Set(); const out = [];
    for (const v of arr) if (v && !s.has(v)) s.add(v), out.push(v);
    return out;
  };

  const endsWithAny = (u, exts) => exts.some(e => u.toLowerCase().endsWith(e));

  const filenameFromUrl = (url) => {
    try {
      const u = new URL(url, location.href);
      return decodeURIComponent(u.pathname.split('/').filter(Boolean).pop() || 'download');
    } catch {
      const clean = (url || '').split(/[?#]/)[0];
      return decodeURIComponent(clean.split('/').pop() || 'download');
    }
  };

  const guessMime = (url) => {
    const l = url.toLowerCase();
    if (l.endsWith('.mp4')) return 'video/mp4';
    if (l.endsWith('.webm')) return 'video/webm';
    if (l.endsWith('.png')) return 'image/png';
    if (l.endsWith('.jpg') || l.endsWith('.jpeg')) return 'image/jpeg';
    if (l.endsWith('.gif')) return 'image/gif';
    if (l.endsWith('.webp')) return 'image/webp';
    return 'application/octet-stream';
  };

  // -------------------- “Active post” detection --------------------
  function rectVisibleArea(r) {
    const vw = window.innerWidth, vh = window.innerHeight;
    const x1 = Math.max(0, Math.min(vw, r.left));
    const y1 = Math.max(0, Math.min(vh, r.top));
    const x2 = Math.max(0, Math.min(vw, r.right));
    const y2 = Math.max(0, Math.min(vh, r.bottom));
    const w = Math.max(0, x2 - x1);
    const h = Math.max(0, y2 - y1);
    return w * h;
  }

  // Return the media element (img.main-image / img#image / video.vjs-tech) that is MOST visible.
  // Fallback: element at the screen center → nearest media.
  function getActiveMediaElement() {
    const mediaNodes = Array.from(document.querySelectorAll('img#image, img.main-image, video.vjs-tech'));
    let best = null, bestArea = -1;
    for (const n of mediaNodes) {
      const r = n.getBoundingClientRect();
      const area = rectVisibleArea(r);
      if (area > bestArea) { best = n; bestArea = area; }
    }
    if (best && bestArea > 0) return best;

    // Center fallback
    const cx = Math.floor(window.innerWidth / 2);
    const cy = Math.floor(window.innerHeight / 2);
    let el = document.elementFromPoint(cx, cy);
    const isMedia = (e) => e && (e.matches?.('img#image, img.main-image, video.vjs-tech'));
    for (let cur = el; cur && cur !== document.body; cur = cur.parentElement) {
      if (isMedia(cur)) return cur;
      const found = cur.querySelector?.('img#image, img.main-image, video.vjs-tech');
      if (found) return found;
    }
    return null;
  }

  // Choose a container for scoping to THIS post only.
  function getMediaRoot(mediaEl) {
    if (!mediaEl) return document;
    const root = mediaEl.closest?.('.post, .content, .image-container, .image, .post-content') ||
                 mediaEl.parentElement ||
                 document;
    return root;
  }

  // -------------------- Kind detection (scoped) --------------------
  function getDesiredKindInRoot(root) {
    const vid = root.querySelector('video.vjs-tech');
    if (vid) return 'video';
    const img = root.querySelector('img#image, img.main-image');
    const src = (img && (img.getAttribute('src') || '')) || '';
    if (/\.(mp4|webm)(\?|#|$)/i.test(src)) return 'video';
    return 'image';
  }

  // -------------------- Sample→Original upgrade --------------------
  const isLikelySample = (url) =>
    /\/sample\//i.test(url) || /\/preview\//i.test(url) || /(^|\/)sample_/i.test(url);

  const upgradeSampleOnce = (url) => {
    let s = url;
    s = s.replace(/\/preview\//i, '/data/');
    s = s.replace(/\/sample\//i, '/data/');
    s = s.replace(/\/sample_([^/]+)$/i, '/$1');
    s = s.replace(/\/(sample_)([^/]+?)(\.[a-z0-9]+)$/i, '/$2$3');
    return s !== url ? s : null;
  };

  // -------------------- Existence / Content-Type probing --------------------
  // Returns { ok: boolean, type: string|null }
  function headType(url) {
    return new Promise((resolve) => {
      const finish = (ok, type) => resolve({ ok, type: type || null });
      if (typeof GM_xmlhttpRequest !== 'function') {
        fetch(url, { method: 'HEAD', mode: 'cors' })
          .then(r => finish(r.ok, r.headers.get('content-type')))
          .catch(() => finish(true, null)); // permissive if blocked
        return;
      }
      GM_xmlhttpRequest({
        method: 'HEAD',
        url,
        onload: (r) => {
          if (r.status >= 200 && r.status < 400) {
            const type = (r.responseHeaders || '')
              .split(/\r?\n/)
              .map(l => l.split(':'))
              .reduce((acc, [k, v]) => k && k.toLowerCase() === 'content-type' ? (v || '').trim() : acc, null);
            resolve({ ok: true, type });
          } else {
            // fallback: GET 1 byte to infer headers
            GM_xmlhttpRequest({
              method: 'GET',
              url,
              headers: { Range: 'bytes=0-0' },
              onload: (r2) => {
                const ok = r2.status >= 200 && r2.status < 400;
                const type2 = (r2.responseHeaders || '')
                  .split(/\r?\n/)
                  .map(l => l.split(':'))
                  .reduce((acc, [k, v]) => k && k.toLowerCase() === 'content-type' ? (v || '').trim() : acc, null);
                resolve({ ok, type: ok ? type2 : null });
              },
              onerror: () => resolve({ ok: true, type: null }) // permissive
            });
          }
        },
        onerror: () => resolve({ ok: true, type: null }) // permissive when blocked
      });
    });
  }

  async function pickBestForKind(urls, kind) {
    const prefExts = kind === 'video' ? EXT_PRIORITY_VIDEO : EXT_PRIORITY_IMAGE;
    const sorted = urls.slice().sort((a, b) => {
      const ai = prefExts.findIndex(e => a.toLowerCase().endsWith(e));
      const bi = prefExts.findIndex(e => b.toLowerCase().endsWith(e));
      return (ai === -1 ? 999 : ai) - (bi === -1 ? 999 : bi);
    });

    let fallback = null;
    for (const u of sorted) {
      const { ok, type } = await headType(u);
      if (!ok) continue;
      if (!type) {
        const extOK = kind === 'video' ? endsWithAny(u, EXT_PRIORITY_VIDEO) : endsWithAny(u, EXT_PRIORITY_IMAGE);
        if (extOK) return u;
        if (!fallback) fallback = u;
        continue;
      }
      if (kind === 'video' && type.startsWith('video/')) return u;
      if (kind === 'image' && type.startsWith('image/')) return u;
    }
    return fallback || sorted[0] || null;
  }

  // -------------------- ORIGINAL URL resolver (scoped) --------------------
  async function getOriginalUrl(root) {
    const desired = getDesiredKindInRoot(root);
    const cands = [];

    // Likely original/highres anchors (scoped to root)
    const anchorSel = [
      '#highres', '#image-download-link', '#original-file-link',
      'a.original-file-unchanged',
      'a[href*="/data/"]',
      'a[href$=".mp4"]', 'a[href$=".webm"]',
      'a[href$=".png"]', 'a[href$=".jpg"]', 'a[href$=".jpeg"]', 'a[href$=".gif"]', 'a[href$=".webp"]'
    ];
    anchorSel.forEach((sel) =>
      root.querySelectorAll(sel).forEach((a) => a && a.href && cands.push(a.href))
    );

    // Main image (scoped)
    const img = root.querySelector('img#image, img.main-image');
    if (img) {
      const ds = img.dataset || {};
      ['fileUrl','largeFileUrl','fullImage','downloadUrl'].forEach(k => ds[k] && cands.push(ds[k]));
      ['data-file-url','data-large-file-url'].forEach(k => { const v = img.getAttribute(k); if (v) cands.push(v); });
      if (img.src) cands.push(img.src);
    }

    // Video (scoped)
    const vid = root.querySelector('video.vjs-tech');
    if (vid) {
      const s = vid.querySelector('source');
      if (s && s.src) cands.push(s.src);
      if (vid.src) cands.push(vid.src);
    }

    // Upgrade sample/preview → data/original
    const upgraded = cands.filter(isLikelySample).map(upgradeSampleOnce).filter(Boolean);

    // De-dup and early kind filter to avoid “image saved as mp4”
    let all = uniq([...upgraded, ...cands]);
    all = all.filter(u => desired === 'video'
      ? /\.(mp4|webm)(\?|#|$)/i.test(u)
      : /\.(png|jpe?g|gif|webp)(\?|#|$)/i.test(u)
    );

    const best = await pickBestForKind(all, desired);
    log('desired kind:', desired, 'best:', best);
    return best || null;
  }

  // -------------------- Network helpers for binary copy --------------------
  function gmFetchBlob(url) {
    return new Promise((resolve, reject) => {
      if (typeof GM_xmlhttpRequest !== 'function') {
        fetch(url, { mode: 'cors' })
          .then(r => r.ok ? r.blob() : Promise.reject(new Error(`HTTP ${r.status}`)))
          .then(b => resolve(b.type ? b : new Blob([b], { type: guessMime(url) })))
          .catch(reject);
        return;
      }
      GM_xmlhttpRequest({
        method: 'GET',
        url,
        responseType: 'blob',
        onload: (res) => {
          let body = res.response;
          if (!body) return reject(new Error('Empty response'));
          if (!(body instanceof Blob)) body = new Blob([body], { type: guessMime(url) });
          if (!body.type) body = new Blob([body], { type: guessMime(url) });
          resolve(body);
        },
        onerror: () => reject(new Error('GM_xmlhttpRequest failed'))
      });
    });
  }

  // -------------------- Actions: download / copy --------------------
  function nativeDownload(url, name) {
    const a = document.createElement('a');
    a.href = url;
    a.download = name;
    a.target = '_blank';
    document.body.appendChild(a);
    a.click();
    a.remove();
    toast(`Requested: ${name}`);
  }

  function download(url) {
    if (!url) return toast('No media detected.');
    const name = filenameFromUrl(url);
    if (typeof GM_download === 'function') {
      try {
        GM_download({ url, name, onerror: () => nativeDownload(url, name) });
        toast(`Downloading: ${name}`);
        return;
      } catch {}
    }
    nativeDownload(url, name);
  }

  async function copyBinary(url) {
    if (!url) return toast('No media detected.');
    try {
      if (!('clipboard' in navigator) || typeof window.ClipboardItem === 'undefined') {
        await navigator.clipboard.writeText(url);
        return toast('Clipboard item unsupported; URL copied.');
      }
      const blob = await gmFetchBlob(url);
      const item = new ClipboardItem({ [blob.type || guessMime(url)]: blob });
      await navigator.clipboard.write([item]);
      toast(`Copied ${blob.type.split('/')[0]} to clipboard.`);
    } catch {
      try {
        await navigator.clipboard.writeText(url);
        toast('Could not copy file; URL copied instead.');
      } catch {
        toast('Copy failed (permissions/CSP).');
      }
    }
  }

  // -------------------- Original behavior: swap img→video when src is video --------------------
  function replaceImageWithVideo() {
    try {
      const img = document.querySelector('img.main-image');
      const vid = document.querySelector('video.vjs-tech');

      if (img && !vid) {
        const src = img.getAttribute('src') || '';
        if (/\.(mp4|webm)(\?|#|$)/i.test(src)) {
          img.style.display = 'none';

          const video = document.createElement('video');
          video.className = 'vjs-tech';
          video.loop = true;
          video.autoplay = true;
          video.controls = false;
          video.style.width = '100%';
          video.style.height = '100%';
          video.tabIndex = -1;

          // Keep existing setup payload if you rely on videojs plugins
          video.setAttribute('data-setup', JSON.stringify({
            autoplay: true,
            controls: true,
            playbackRates: [0.2, 0.4, 0.6, 0.8, 1],
            plugins: { framebyframe: { fps: 24.0, steps: [{ text: '< 1f', step: -1 }, { text: '1f >', step: 1 }] } }
          }));

          const source = document.createElement('source');
          source.src = src;
          source.type = src.toLowerCase().endsWith('.mp4') ? 'video/mp4' : 'video/webm';
          video.appendChild(source);

          const p = document.createElement('p');
          p.className = 'vjs-no-js';
          p.textContent = 'Enable JavaScript for HTML5 video.';
          video.appendChild(p);

          const container = (img.parentNode && img.parentNode.parentNode) || img.parentNode || document.body;
          container.appendChild(video);
        }
      } else if (img && vid) {
        const src = img.getAttribute('src') || '';
        const s = vid.querySelector('source');
        const current = s ? s.getAttribute('src') : null;
        if (src && current && src !== current) {
          if (!/\.(mp4|webm)(\?|#|$)/i.test(src)) {
            vid.remove();
            img.style.display = '';
          } else {
            img.style.display = 'none';
            s.setAttribute('src', src);
            s.setAttribute('type', src.toLowerCase().endsWith('.mp4') ? 'video/mp4' : 'video/webm');
            vid.load();
          }
        }
      }
    } catch (e) {
      log('replace error', e);
    }
  }

  // -------------------- Run + observe --------------------
  replaceImageWithVideo();
  new MutationObserver(() => replaceImageWithVideo()).observe(document.body, { childList: true, subtree: true });

  // -------------------- Shortcuts (scoped to active post) --------------------
  window.addEventListener('keydown', async (e) => {
    const t = e.target;
    if (t && (t.tagName === 'INPUT' || t.tagName === 'TEXTAREA' || t.isContentEditable)) return;

    // Identify the active media/root at the moment of the keypress
    const mediaEl = getActiveMediaElement();
    const root = getMediaRoot(mediaEl);

    // Alt + D → download ORIGINAL of active post
    if (e.altKey && !e.shiftKey && !e.ctrlKey && !e.metaKey && (e.key === 'd' || e.key === 'D')) {
      e.preventDefault();
      const url = await getOriginalUrl(root);
      download(url);
      return;
    }

    // Alt + C → copy ORIGINAL (binary; fallback to URL) of active post
    if (e.altKey && !e.shiftKey && !e.ctrlKey && !e.metaKey && (e.key === 'c' || e.key === 'C')) {
      e.preventDefault();
      const url = await getOriginalUrl(root);
      await copyBinary(url);
      return;
    }
  });

})();
