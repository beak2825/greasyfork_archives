// ==UserScript==
// @name         brain.fm Audio Download Widget
// @author       Hawk
// @namespace    https://brain.fm
// @license      CC-BY-NC-SA-4.0; https://creativecommons.org/licenses/by-nc-sa/4.0/legalcode
// @license      GPL-3.0-or-later; http://www.gnu.org/licenses/gpl-3.0.txt
// @version      1.0.0
// @description  Finds <audio> on the page and shows a top-right download button for it.
// @match        https://my.brain.fm/*
// @match        https://my.brain.fm/player/*
// @match        https://brain.fm/*
// @match        https://brain.fm/player/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=brain.fm
// @run-at       document-idle
// @run-at       document-end
// @grant        GM_download
// @grant        GM_addStyle
// @grant        GM_xmlhttpRequest
// @connect      brain.fm
// @connect      www.brain.fm
// @connect      audio.brain.fm
// @connect      audio1.brain.fm
// @connect      audio2.brain.fm
// @connect      audio*.brain.fm
// @connect      *.brain.fm
// @downloadURL https://update.greasyfork.org/scripts/546369/brainfm%20Audio%20Download%20Widget.user.js
// @updateURL https://update.greasyfork.org/scripts/546369/brainfm%20Audio%20Download%20Widget.meta.js
// ==/UserScript==

(function () {
  'use strict';

  const WIDGET_ID = 'audio-dl-widget';
  const POS_KEY = 'audio-dl-widget-pos';
  const BTN_DEFAULT = 'Download';

  const STYLE = `
    #${WIDGET_ID} {
      position: fixed;
      top: 16px;
      right: 16px;
      z-index: 2147483647;
      display: inline-flex;
      align-items: center;
      gap: 8px;
      padding: 8px 10px;
      background: rgba(28,28,30,0.9);
      color: #fff;
      border: 1px solid rgba(255,255,255,0.12);
      border-radius: 10px;
      box-shadow: 0 8px 24px rgba(0,0,0,0.28);
      font: 13px/1.2 system-ui, -apple-system, Segoe UI, Roboto, Arial, sans-serif;
      backdrop-filter: blur(6px);
      cursor: grab;
      -webkit-user-select: none;
      user-select: none;
    }
    #${WIDGET_ID}.dragging { cursor: grabbing; }
    #${WIDGET_ID} .dl-btn {
      all: unset;
      cursor: pointer;
      background: #2563eb;           /* clean blue */
      color: #fff;
      padding: 8px 12px;
      border-radius: 8px;
      font-weight: 600;
      transition: background 0.2s ease, transform 0.06s ease, opacity 0.2s ease;
      white-space: nowrap;
    }
    #${WIDGET_ID} .dl-btn:hover { background: #1e4fd1; }
    #${WIDGET_ID} .dl-btn:active { transform: translateY(1px); }
    #${WIDGET_ID} .dl-btn[disabled] { opacity: 0.65; cursor: not-allowed; }

    #${WIDGET_ID} .meta {
      max-width: 38vw;
      overflow: hidden; text-overflow: ellipsis; white-space: nowrap;
      opacity: 0.92;
    }

    #${WIDGET_ID} .icon-btn {
      all: unset;
      width: 28px; height: 28px;
      display: inline-flex; align-items: center; justify-content: center;
      border-radius: 8px;
      background: rgba(255,255,255,0.08);
      color: #fff; cursor: pointer;
      transition: background 0.2s ease, transform 0.06s ease, opacity 0.2s ease;
      font-weight: 700;
    }
    #${WIDGET_ID} .icon-btn:hover { background: rgba(255,255,255,0.15); }
    #${WIDGET_ID} .icon-btn:active { transform: translateY(1px); }

    #${WIDGET_ID}.error { animation: errflash 0.9s ease; }
    @keyframes errflash {
      0%{box-shadow:0 0 0 rgba(255,0,0,0.0);}
      15%{box-shadow:0 0 0 3px rgba(255,0,0,0.55);}
      100%{box-shadow:0 8px 24px rgba(0,0,0,0.28);}
    }
  `;

  if (typeof GM_addStyle === 'function') GM_addStyle(STYLE);
  else {
    const style = document.createElement('style');
    style.textContent = STYLE;
    document.head.appendChild(style);
  }

  let widget, btn, meta, refreshBtn;
  let dragging = false;
  let startX = 0,
    startY = 0,
    offsetX = 0,
    offsetY = 0;
  let timer10s = null;
  let downloading = false;

  function createWidget() {
    if (document.getElementById(WIDGET_ID)) return;

    widget = document.createElement('div');
    widget.id = WIDGET_ID;

    btn = document.createElement('button');
    btn.className = 'dl-btn';
    btn.textContent = BTN_DEFAULT;
    btn.addEventListener('click', onDownloadClick);

    meta = document.createElement('div');
    meta.className = 'meta';
    meta.textContent = 'Looking for audio...';

    refreshBtn = document.createElement('button');
    refreshBtn.className = 'icon-btn';
    refreshBtn.title = 'Refresh';
    refreshBtn.textContent = '↻';
    refreshBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      updateAll();
    });

    widget.appendChild(btn);
    widget.appendChild(meta);
    widget.appendChild(refreshBtn);
    document.body.appendChild(widget);

    restorePosition();
    makeDraggable();

    // Poll every 10s
    timer10s = setInterval(updateAll, 10000);
  }

  function makeDraggable() {
    widget.addEventListener('pointerdown', (e) => {
      if (e.button !== 0) return;
      // don't drag when interacting with controls
      if (e.target.closest('button, a, input, select, textarea, label')) return;

      const rect = widget.getBoundingClientRect();
      startX = e.clientX;
      startY = e.clientY;
      offsetX = startX - rect.left;
      offsetY = startY - rect.top;
      dragging = true;
      widget.setPointerCapture(e.pointerId);
      widget.classList.add('dragging');
      widget.style.transition = 'none';
    });

    widget.addEventListener('pointermove', (e) => {
      if (!dragging || !widget.hasPointerCapture(e.pointerId)) return;
      const rect = widget.getBoundingClientRect();
      let left = e.clientX - offsetX;
      let top = e.clientY - offsetY;
      left = Math.max(4, Math.min(left, window.innerWidth - rect.width - 4));
      top = Math.max(4, Math.min(top, window.innerHeight - rect.height - 4));
      widget.style.left = `${left}px`;
      widget.style.top = `${top}px`;
      widget.style.right = 'auto';
      widget.style.bottom = 'auto';
    });

    const endDrag = (e) => {
      if (!dragging) return;
      dragging = false;
      if (widget.hasPointerCapture(e.pointerId)) widget.releasePointerCapture(e.pointerId);
      widget.classList.remove('dragging');
      widget.style.transition = '';
      savePosition();
    };

    widget.addEventListener('pointerup', endDrag);
    widget.addEventListener('pointercancel', endDrag);
    widget.addEventListener('dragstart', (e) => e.preventDefault(), true);
  }

  function savePosition() {
    const rect = widget.getBoundingClientRect();
    const pos = {
      left: rect.left,
      top: rect.top
    };
    try {
      localStorage.setItem(POS_KEY, JSON.stringify(pos));
    }
    catch {}
  }

  function restorePosition() {
    try {
      const raw = localStorage.getItem(POS_KEY);
      if (!raw) return;
      const pos = JSON.parse(raw);
      if (typeof pos?.left === 'number' && typeof pos?.top === 'number') {
        widget.style.left = `${Math.max(4, Math.min(pos.left, window.innerWidth - widget.offsetWidth - 4))}px`;
        widget.style.top = `${Math.max(4, Math.min(pos.top, window.innerHeight - widget.offsetHeight - 4))}px`;
        widget.style.right = 'auto';
        widget.style.bottom = 'auto';
      }
    }
    catch {}
  }

  function sanitizeFilename(name) {
    const cleaned = name.replace(/[/\\?%*:|"<>]/g, '_').trim();
    return cleaned || 'audio';
  }

  function guessExtensionFromUrl(urlStr) {
    const lower = urlStr.toLowerCase();
    if (lower.includes('.wav')) return 'wav';
    if (lower.includes('.ogg') || lower.includes('.oga')) return 'ogg';
    if (lower.includes('.m4a')) return 'm4a';
    if (lower.includes('.aac')) return 'aac';
    if (lower.includes('.flac')) return 'flac';
    if (lower.includes('.opus')) return 'opus';
    if (lower.includes('.mp3')) return 'mp3';
    return '';
  }

  function extFromContentType(ct) {
    if (!ct) return '';
    ct = ct.toLowerCase();
    if (ct.includes('audio/mpeg') || ct.includes('audio/mp3')) return 'mp3';
    if (ct.includes('audio/ogg')) return 'ogg';
    if (ct.includes('audio/opus')) return 'opus';
    if (ct.includes('audio/aac')) return 'aac';
    if (ct.includes('audio/wav') || ct.includes('audio/x-wav')) return 'wav';
    if (ct.includes('audio/flac')) return 'flac';
    if (ct.includes('audio/mp4') || ct.includes('audio/m4a')) return 'm4a';
    return '';
  }

  function inferFilenameFromUrl(urlStr) {
    try {
      const u = new URL(url, location.href);
      let base = decodeURIComponent(u.pathname.split('/').pop() || '').trim();
      if (!base) base = 'audio';
      if (!/\.[a-z0-9]{2,5}$/i.test(base)) {
        const ext = guessExtensionFromUrl(urlStr) || 'mp3';
        base += `.${ext}`;
      }
      return sanitizeFilename(base);
    }
    catch {
      return 'audio.mp3';
    }
  }

  function getAudioCandidates() {
    const audios = Array.from(document.querySelectorAll('audio'));
    const out = [];
    for (const audio of audios) {
      let src = '';
      if (audio.hasAttribute('src')) {
        const raw = audio.getAttribute('src') || '';
        if (raw.trim()) {
          try {
            src = new URL(raw, location.href).href;
          }
          catch {
            src = raw;
          }
        }
      }
      if (!src) {
        const source = audio.querySelector('source[src]');
        if (source) {
          const raw = source.getAttribute('src') || '';
          if (raw.trim()) {
            try {
              src = new URL(raw, location.href).href;
            }
            catch {
              src = raw;
            }
          }
        }
      }
      if (!src && audio.currentSrc) src = audio.currentSrc;
      if (src) out.push({
        audio,
        src
      });
    }
    return out;
  }

  function selectPrimaryAudio() {
    const list = getAudioCandidates();
    if (!list.length) return null;
    const playing = list.find(x => !x.audio.paused && x.audio.currentTime > 0 && !x.audio.ended);
    return playing || list[0];
  }

  // Track info from page HTML (provided example)
  function getTrackInfoFromPage() {
    const $ = (sel) => document.querySelector(sel);
    const title = textOf($('[data-testid="currentTrackTitle"]'));
    const genre = textOf($('[data-testid="trackGenre"]'));
    const effect = textOf($('[data-testid="trackNeuralEffect"]'));
    return {
      title: title || '',
      type: genre || '',
      effect: effect || ''
    };
  }

  function textOf(el) {
    return el ? el.textContent.trim() : '';
  }

  function buildDescriptiveBaseName(fallbackBase) {
    const info = getTrackInfoFromPage();
    const parts = [];
    if (info.title) parts.push(info.title);
    if (info.type) parts.push(info.type);
    // If you also want the effect, uncomment:
    // if (info.effect) parts.push(info.effect);
    const base = parts.length ? parts.join(' - ') : fallbackBase;
    return sanitizeFilename(base || 'audio');
  }

  function parseFilenameFromContentDisposition(cd) {
    if (!cd) return '';
    let m = cd.match(/filename\*\s*=\s*[^']*'[^']*'([^;]+)$/i);
    if (m) {
      try {
        return decodeURIComponent(m[1]);
      }
      catch {
        return m[1];
      }
    }
    m = cd.match(/filename\s*=\s*("?)([^";]+)\1/i);
    if (m) return m[2];
    return '';
  }

  function getHeader(headersStr, key) {
    if (!headersStr) return '';
    const lines = headersStr.split(/\r?\n/);
    key = key.toLowerCase();
    for (const line of lines) {
      const i = line.indexOf(':');
      if (i > -1) {
        const k = line.slice(0, i).trim().toLowerCase();
        if (k === key) return line.slice(i + 1).trim();
      }
    }
    return '';
  }

  function buildFullFilenameFromHints(url, fallbackBaseName, headers) {
    let ext = guessExtensionFromUrl(url);
    const ct = getHeader(headers, 'content-type');
    if (!ext) ext = extFromContentType(ct);
    if (!ext) {
      const inferred = inferFilenameFromUrl(url);
      ext = (inferred.split('.').pop() || '').toLowerCase() || 'mp3';
    }
    const cdName = parseFilenameFromContentDisposition(getHeader(headers, 'content-disposition'));
    if (cdName) {
      const name = /\.[a-z0-9]{2,5}$/i.test(cdName) ? cdName : `${cdName}.${ext || 'mp3'}`;
      return sanitizeFilename(name);
    }
    const base = buildDescriptiveBaseName(fallbackBaseName.replace(/\.[^.]+$/, ''));
    return sanitizeFilename(`${base}.${ext || 'mp3'}`);
  }

  function setWidgetState() {
    const item = selectPrimaryAudio();
    if (!item) {
      btn.disabled = true;
      meta.textContent = 'No audio found';
      btn.title = 'No audio found';
      meta.title = 'No audio found';
      return;
    }
    const fallback = inferFilenameFromUrl(item.src);
    const base = buildDescriptiveBaseName(fallback.replace(/\.[^.]+$/, ''));
    const fullName = buildFullFilenameFromHints(item.src, fallback, '');
    meta.textContent = base;
    btn.title = fullName;
    meta.title = fullName;
    btn.disabled = downloading ? true : false;
    if (!downloading && btn.textContent !== BTN_DEFAULT) btn.textContent = BTN_DEFAULT;
  }

  async function onDownloadClick() {
    if (downloading) return;
    const item = selectPrimaryAudio();
    if (!item) return;

    const url = item.src;
    const fallback = inferFilenameFromUrl(url);
    const niceName = buildFullFilenameFromHints(url, fallback, '');

    // Show only "Starting..." while we fetch
    downloading = true;
    btn.disabled = true;
    btn.textContent = 'Starting...';

    // Try GM_download
    if (typeof GM_download === 'function') {
      try {
        GM_download({
          url,
          name: niceName,
          saveAs: true,
          onload: () => {
            finish(true, 'Saved');
          },
          onerror: () => {
            gmXhrDownload(url, fallback).then(
              () => finish(true, 'Saved'),
              () => {
                finish(false, 'Failed');
                anchorDownload(url, fallback);
              }
            );
          },
          ontimeout: () => {
            gmXhrDownload(url, fallback).then(
              () => finish(true, 'Saved'),
              () => {
                finish(false, 'Timeout');
                anchorDownload(url, fallback);
              }
            );
          },
          timeout: 120000
        });
        return;
      }
      catch {
        // fall through
      }
    }

    // GM_xhr fallback
    try {
      await gmXhrDownload(url, fallback);
      finish(true, 'Saved');
    }
    catch {
      finish(false, 'Opening…');
      anchorDownload(url, fallback);
    }
  }

  function finish(success, label) {
    downloading = false;
    btn.disabled = false;
    btn.textContent = label || (success ? 'Saved' : 'Failed');
    setTimeout(() => {
      setWidgetState();
    }, 1300);
  }

  function gmXhrDownload(url, fallbackBase) {
    return new Promise((resolve, reject) => {
      const GMXHR =
        typeof GM_xmlhttpRequest === 'function' ?
        GM_xmlhttpRequest :
        (typeof GM !== 'undefined' && typeof GM.xmlHttpRequest === 'function') ?
        (opts) => GM.xmlHttpRequest(opts) :
        null;

      if (!GMXHR) {
        flashError();
        reject(new Error('GM_xhr not available'));
        return;
      }

      GMXHR({
        method: 'GET',
        url,
        responseType: 'arraybuffer',
        headers: {
          Referer: location.href,
          Accept: 'audio/*;q=0.9,*/*;q=0.5',
          'Cache-Control': 'no-cache'
        },
        onload: (resp) => {
          try {
            const buf = resp.response;
            if (!buf) throw new Error('Empty response');
            const ct = getHeader(resp.responseHeaders, 'content-type') || 'application/octet-stream';
            const name = buildFullFilenameFromHints(url, fallbackBase, resp.responseHeaders);
            const blob = new Blob([new Uint8Array(buf)], {
              type: ct
            });

            const a = document.createElement('a');
            a.href = URL.createObjectURL(blob);
            a.download = name;
            a.rel = 'noopener';
            document.body.appendChild(a);
            a.click();
            URL.revokeObjectURL(a.href);
            a.remove();
            resolve();
          }
          catch (e) {
            flashError();
            reject(e);
          }
        },
        onerror: (e) => {
          flashError();
          reject(e);
        },
        ontimeout: (e) => {
          flashError();
          reject(e);
        },
        timeout: 120000
      });
    });
  }

  function anchorDownload(url, fallbackBase) {
    const name = buildFullFilenameFromHints(url, fallbackBase, '');
    const a = document.createElement('a');
    a.href = url;
    a.download = name; // may be ignored cross-origin
    a.rel = 'noopener';
    a.target = '_blank';
    document.body.appendChild(a);
    a.click();
    a.remove();
  }

  function flashError() {
    widget.classList.add('error');
    setTimeout(() => widget.classList.remove('error'), 900);
  }

  function updateAll() {
    setWidgetState();
    attachListenersToAudios();
  }

  // Observe DOM (audio src updates + track info text)
  let mo;

  function startObserver() {
    if (mo) return;
    mo = new MutationObserver(debounce(updateAll, 200));
    mo.observe(document.documentElement || document.body, {
      childList: true,
      subtree: true,
      attributes: true,
      characterData: true
    });
  }

  // Media event listeners
  const listened = new WeakSet();

  function attachListenersToAudios() {
    document.querySelectorAll('audio').forEach(a => {
      if (listened.has(a)) return;
      listened.add(a);
      ['loadedmetadata', 'canplay', 'play', 'pause', 'ended', 'emptied', 'stalled', 'suspend']
      .forEach(ev => a.addEventListener(ev, () => setWidgetState(), {
        passive: true
      }));
      a.querySelectorAll('source').forEach(s => {
        ['load', 'error'].forEach(ev =>
          s.addEventListener(ev, () => setWidgetState(), {
            passive: true
          })
        );
      });
    });
  }

  function debounce(fn, wait) {
    let t;
    return (...args) => {
      clearTimeout(t);
      t = setTimeout(() => fn.apply(null, args), wait);
    };
  }

  // Init
  createWidget();
  updateAll();
  startObserver();
  document.addEventListener('visibilitychange', () => {
    if (document.visibilityState === 'visible') updateAll();
  });
  setTimeout(updateAll, 1500);
})();
