// ==UserScript==
// @name         YouTube Tools
// @namespace    https://youtube.com
// @version      1.2.0
// @description  Disables all forms of scrolling in fullscreen mode. Adds A-B loop functionality on YouTube videos. Record YouTube video with a toggle button. Downloads button for video or audio from.
// @author       beka
// @match        *://www.youtube.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=YouTube.com
// @grant        none
// @license      MIT 
// @downloadURL https://update.greasyfork.org/scripts/519780/YouTube%20Tools.user.js
// @updateURL https://update.greasyfork.org/scripts/519780/YouTube%20Tools.meta.js
// ==/UserScript==

(function () {
  'use strict';

  /***********************
   * SPA NAV HELPERS
   ***********************/
  const onAllNavigations = (fn) => {
    // Fires on load + YouTube SPA route changes
    window.addEventListener('yt-navigate-finish', fn);
    window.addEventListener('yt-page-data-updated', fn);
    document.addEventListener('DOMContentLoaded', fn, { once: true });
    // Run once now
    fn();
  };

  const qs = (sel, root = document) => root.querySelector(sel);
  const qsa = (sel, root = document) => Array.from(root.querySelectorAll(sel));

  const waitFor = (selector, { root = document, timeout = 10000 } = {}) =>
    new Promise((resolve, reject) => {
      const found = qs(selector, root);
      if (found) return resolve(found);
      const obs = new MutationObserver(() => {
        const el = qs(selector, root);
        if (el) {
          obs.disconnect();
          resolve(el);
        }
      });
      obs.observe(root, { childList: true, subtree: true });
      setTimeout(() => {
        obs.disconnect();
        reject(new Error(`Timeout waiting for ${selector}`));
      }, timeout);
    });

  const inFullscreen = () =>
    !!(document.fullscreenElement || document.webkitFullscreenElement || document.mozFullScreenElement || document.msFullscreenElement);

  /***********************
   * 1) FULLSCREEN SCROLL LOCK + UI HIDE
   ***********************/
  let hiddenBelow = [];
  const preventDefault = (e) => e.preventDefault();

  const preventScrollKeys = (e) => {
    // Only when fullscreen is active
    if (!inFullscreen()) return;
    // Block common scrolling/navigation keys
    const blocked = ['ArrowUp','ArrowDown','PageUp','PageDown','Home','End',' ' /*space*/, 'ArrowLeft','ArrowRight'];
    if (blocked.includes(e.key)) e.preventDefault();
  };

  const removeScrollPromptButton = () => {
    // Try common selectors + attr matches (language-agnostic)
    const candidates = [
      '.ytp-fullerscreen-edu-button',
      '[aria-label*="croll"]', // croll in any language likely catches “scroll”
      '[title*="croll"]',
    ];
    candidates.forEach(sel => qsa(sel).forEach(btn => btn.remove()));
  };

  const hideChapterContainer = () => {
    const c = qs('.ytp-chapter-container');
    if (c) {
      c.dataset.__prevVisibility = c.style.visibility || '';
      c.dataset.__prevPointerEvents = c.style.pointerEvents || '';
      c.style.visibility = 'hidden';
      c.style.pointerEvents = 'none';
    }
  };
  const showChapterContainer = () => {
    const c = qs('.ytp-chapter-container');
    if (c) {
      c.style.visibility = c.dataset.__prevVisibility || '';
      c.style.pointerEvents = c.dataset.__prevPointerEvents || '';
      delete c.dataset.__prevVisibility;
      delete c.dataset.__prevPointerEvents;
    }
  };

  const removeContentBelowVideo = () => {
    // On watch pages, content stack sits in #below[the fold] containers; this stays future-proof by hiding siblings under the main column container
    const col = qs('#primary #below, #below, #secondary, #secondary-inner, #related, #comments');
    hiddenBelow = [];
    // Hide a broad set but safely
    ['#below', '#secondary', '#secondary-inner', '#related', '#comments', '#sections', 'ytd-watch-flexy #columns #secondary', 'ytd-watch-metadata'].forEach(sel => {
      qsa(sel).forEach(el => {
        if (el && el.offsetParent !== null) {
          hiddenBelow.push([el, el.style.display]);
          el.style.display = 'none';
        }
      });
    });
  };

  const restoreBelowVideo = () => {
    hiddenBelow.forEach(([el, prev]) => { el.style.display = prev || ''; });
    hiddenBelow = [];
  };

  const applyFullscreenLocks = () => {
    document.body.dataset.__prevOverflow = document.body.style.overflow || '';
    document.body.style.overflow = 'hidden';
    window.addEventListener('wheel', preventDefault, { passive: false });
    window.addEventListener('touchmove', preventDefault, { passive: false });
    window.addEventListener('keydown', preventScrollKeys, { passive: false });
    removeScrollPromptButton();
    hideChapterContainer();
    removeContentBelowVideo();
  };

  const removeFullscreenLocks = () => {
    document.body.style.overflow = document.body.dataset.__prevOverflow || '';
    delete document.body.dataset.__prevOverflow;
    window.removeEventListener('wheel', preventDefault, { passive: false });
    window.removeEventListener('touchmove', preventDefault, { passive: false });
    window.removeEventListener('keydown', preventScrollKeys, { passive: false });
    showChapterContainer();
    restoreBelowVideo();
  };

  const onFullscreenChange = () => {
    if (inFullscreen()) applyFullscreenLocks(); else removeFullscreenLocks();
  };

  // Single set of FS listeners (avoid duplicates)
  ['fullscreenchange','webkitfullscreenchange','mozfullscreenchange','MSFullscreenChange']
    .forEach(evt => document.addEventListener(evt, onFullscreenChange));

  /***********************
   * 2) A-B LOOP BUTTON
   ***********************/
  let loopStart = null, loopEnd = null, isLooping = false, loopTimer = null;

  const ensureLoopStyles = () => {
    if (qs('#__yttools_loop_css')) return;
    const style = document.createElement('style');
    style.id = '__yttools_loop_css';
    style.textContent = `
      .yttools-loop-btn {
        position: relative;
        margin-left: 8px;
        padding: 0 8px;
        color: #fff;
        background: transparent;
        border: none;
        cursor: pointer;
        font-size: 12px;
        border-radius: 4px;
        display: flex;
        align-items: center;
      }
      .yttools-loop-btn:hover { background: rgba(255,255,255,0.2); }
      .yttools-loop-btn.active { color: #ff0000; }
    `;
    document.head.appendChild(style);
  };

  const startLoop = (video, a, b) => {
    isLooping = true;
    if (loopTimer) clearInterval(loopTimer);
    loopTimer = setInterval(() => {
      if (!isLooping) return;
      if (video.currentTime >= b) {
        video.currentTime = a;
        video.play();
      }
    }, 100);
  };
  const resetLoop = (btn) => {
    loopStart = loopEnd = null;
    isLooping = false;
    if (loopTimer) { clearInterval(loopTimer); loopTimer = null; }
    if (btn) {
      const span = btn.querySelector('span');
      if (span) span.textContent = 'Loop A-B';
      btn.classList.remove('active');
    }
  };

  const mountLoopButton = () => {
    const controls = qs('.ytp-left-controls');
    if (!controls || qs('.yttools-loop-btn', controls)) return;

    ensureLoopStyles();
    const btn = document.createElement('button');
    btn.className = 'yttools-loop-btn';
    btn.innerHTML = '<span>Loop A-B</span>';
    btn.addEventListener('click', () => {
      const video = qs('video');
      if (!video) return;
      const label = btn.querySelector('span');
      if (loopStart == null) {
        loopStart = video.currentTime;
        btn.classList.add('active');
        if (label) label.textContent = 'Set B';
      } else if (loopEnd == null) {
        loopEnd = video.currentTime;
        if (loopEnd <= loopStart) {
          alert('Loop end must be after start.');
          loopEnd = null; return;
        }
        if (label) label.textContent = 'Looping…';
        startLoop(video, loopStart, loopEnd);
      } else {
        resetLoop(btn);
      }
    });

    controls.appendChild(btn);
  };

  /***********************
   * 3) RECORD BUTTON (page header area)
   ***********************/
  const styleActionButton = (btn, bg) => {
    btn.style.padding = '8px 12px';
    btn.style.margin = '8px 6px';
    btn.style.color = '#fff';
    btn.style.backgroundColor = bg;
    btn.style.border = 'none';
    btn.style.borderRadius = '6px';
    btn.style.cursor = 'pointer';
    btn.style.fontSize = '13px';
  };

  const findTitleContainer = () => {
    // Resilient containers near the title area
    return (
      qs('#above-the-fold #title') ||
      qs('ytd-watch-metadata #title') ||
      qs('ytd-watch-metadata h1')?.parentElement ||
      qs('#title-container') ||
      qs('#owner-and-teaser') ||
      qs('#above-the-fold')
    );
  };

  const mountRecordButton = () => {
    const container = findTitleContainer();
    if (!container || qs('#yttools-record-btn', container)) return;

    const btn = document.createElement('button');
    btn.id = 'yttools-record-btn';
    btn.textContent = 'Start Recording';
    btn.title = 'Record the playing video (WebM)';
    styleActionButton(btn, '#ff0000');

    let recorder = null, chunks = [], stream = null;

    btn.addEventListener('click', () => {
      const video = qs('video');
      if (!video) return alert('Video not found.');
      if (btn.textContent === 'Start Recording') {
        try {
          stream = video.captureStream?.() || video.mozCaptureStream?.();
          if (!stream) throw new Error('captureStream() not supported.');
          recorder = new MediaRecorder(stream, { mimeType: 'video/webm;codecs=vp8,opus' });
        } catch (e) {
          alert('Recording not supported in this browser/tab.');
          return;
        }
        chunks = [];
        recorder.ondataavailable = (ev) => { if (ev.data?.size) chunks.push(ev.data); };
        recorder.onstop = () => {
          const blob = new Blob(chunks, { type: 'video/webm' });
          const link = document.createElement('a');
          link.href = URL.createObjectURL(blob);
          link.download = 'recorded_video.webm';
          document.body.appendChild(link);
          link.click();
          link.remove();
          URL.revokeObjectURL(link.href);
        };
        recorder.start();
        btn.textContent = 'Stop Recording';
        btn.title = 'Stop recording and save';
        video.play();
      } else {
        try { recorder.stop(); } catch {}
        try { stream?.getTracks?.().forEach(t => t.stop()); } catch {}
        btn.textContent = 'Start Recording';
        btn.title = 'Record the playing video (WebM)';
      }
    });

    container.appendChild(btn);
  };

  /***********************
   * 4) DOWNLOAD POPUP (y2api widget)
   ***********************/
/*** Add Download Button (Iframe Overlay + Pause Video) ***/

    function addDownloadButton() {
        const container = findTitleContainer?.() || document.querySelector('#above-the-fold #title');
        if (!container || document.querySelector('#download-widget-button')) return;

        const downloadButton = document.createElement('button');
        downloadButton.id = 'download-widget-button';
        downloadButton.textContent = 'Download';
        styleButton(downloadButton, '#28a745');
        downloadButton.addEventListener('click', () => showDownloadOverlay());
        container.appendChild(downloadButton);
    }

    function styleButton(button, backgroundColor) {
        button.style.padding = '8px 12px';
        button.style.margin = '10px 5px';
        button.style.color = '#fff';
        button.style.backgroundColor = backgroundColor;
        button.style.border = 'none';
        button.style.borderRadius = '6px';
        button.style.cursor = 'pointer';
        button.style.fontSize = '14px';
    }

    /*** Overlay + Iframe logic ***/
    let __wasPlaying = false;

    function showDownloadOverlay() {
        const videoURL = location.href;

        // pause current video; remember state
        const vid = document.querySelector('video');
        __wasPlaying = false;
        if (vid) {
            __wasPlaying = !vid.paused && !vid.ended;
            try { vid.pause(); } catch {}
        }

        // disable background scroll
        document.body.dataset.__dlPrevOverflow = document.body.style.overflow || '';
        document.body.style.overflow = 'hidden';

        // overlay
        const overlay = document.createElement('div');
        overlay.id = 'download-overlay';
        Object.assign(overlay.style, {
            position: 'fixed', inset: '0',
            background: 'rgba(0,0,0,0.85)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            zIndex: '10000'
        });

        // modal
        const box = document.createElement('div');
        Object.assign(box.style, {
            position: 'relative',
            width: '92%', maxWidth: '1200px',
            background: '#fff', borderRadius: '12px',
            boxShadow: '0 10px 30px rgba(0,0,0,0.4)',
            overflow: 'hidden'
        });

        // header
        const header = document.createElement('div');
        Object.assign(header.style, {
            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
            padding: '10px 14px', background: '#111', color: '#fff',
            fontSize: '14px'
        });
        header.textContent = 'Download (video or audio)';

        // controls (copy url + open window + close)
        const controls = document.createElement('div');
        Object.assign(controls.style, { display: 'flex', gap: '8px', alignItems: 'center' });

        // URL field (read-only) + Copy button
        const urlWrap = document.createElement('div');
        Object.assign(urlWrap.style, { display: 'flex', gap: '6px', alignItems: 'center' });

        const urlInput = document.createElement('input');
        urlInput.type = 'text';
        urlInput.value = videoURL;
        urlInput.readOnly = true;
        Object.assign(urlInput.style, {
            width: '38vw', maxWidth: '560px', minWidth: '240px',
            padding: '6px 8px', borderRadius: '6px', border: '1px solid #444',
            background: '#1f2937', color: '#fff', fontSize: '12px'
        });
        urlInput.addEventListener('focus', () => urlInput.select());

        const copyBtn = document.createElement('button');
        copyBtn.textContent = 'Copy URL';
        Object.assign(copyBtn.style, {
            background: '#059669', color: '#fff',
            border: 'none', borderRadius: '6px',
            padding: '6px 10px', cursor: 'pointer', fontSize: '12px'
        });
        copyBtn.addEventListener('click', async () => {
            try { await navigator.clipboard.writeText(videoURL); toast('Link copied'); }
            catch { urlInput.select(); document.execCommand('copy'); toast('Link copied'); }
        });

        urlWrap.appendChild(urlInput);
        urlWrap.appendChild(copyBtn);

        // Open in new window (always works + prefill)
        const openBtn = document.createElement('button');
        openBtn.textContent = 'Open in new window';
        Object.assign(openBtn.style, {
            background: '#2563eb', color: '#fff',
            border: 'none', borderRadius: '6px',
            padding: '6px 10px', cursor: 'pointer', fontSize: '12px'
        });
        openBtn.addEventListener('click', () => {
            const popupURL = buildSsyoutubeTargets(videoURL)[0];
            const win = window.open(popupURL, 'DownloadYT',
                                    'width=1000,height=760,menubar=no,toolbar=no,location=no,status=no,resizable=yes,scrollbars=yes');
            if (!win) alert('Please allow popups to open the download page.');
        });

        // Close
        const closeBtn = document.createElement('button');
        closeBtn.textContent = '×';
        Object.assign(closeBtn.style, {
            background: 'transparent', color: '#fff',
            border: '1px solid #444', borderRadius: '8px',
            padding: '0 10px', height: '28px',
            cursor: 'pointer', fontSize: '18px', lineHeight: '24px'
        });
        closeBtn.addEventListener('click', closeDownloadOverlay);

        controls.appendChild(urlWrap);
        controls.appendChild(openBtn);
        controls.appendChild(closeBtn);

        header.appendChild(document.createTextNode('')); // spacer
        header.appendChild(controls);

        // iframe (ssyoutube only)
        const iframe = document.createElement('iframe');
        iframe.id = 'download-iframe';
        iframe.referrerPolicy = 'no-referrer';
        iframe.allow = 'clipboard-read; clipboard-write';
        iframe.style.width = '100%';
        iframe.style.height = '70vh';
        iframe.style.border = 'none';

        const targets = buildSsyoutubeTargets(videoURL);
        let idx = 0;

        const loadTarget = () => {
            if (idx >= targets.length) return;
            iframe.src = targets[idx++];
            // if first host blocks frames (rare on ssyoutube), rotate once
            setTimeout(() => {
                try {
                    // we can't inspect cross-origin; just rotate once on a timer
                    if (idx === 1) { iframe.src = targets[idx] || iframe.src; }
                } catch {}
            }, 2000);
        };
        loadTarget();

        // assemble
        box.appendChild(header);
        box.appendChild(iframe);
        overlay.appendChild(box);
        document.body.appendChild(overlay);

        // click backdrop to close
        overlay.addEventListener('click', (e) => { if (e.target === overlay) closeDownloadOverlay(); });

        // auto-copy the URL once for convenience
        (async () => {
            try { await navigator.clipboard.writeText(videoURL); toast('Video link copied'); }
            catch { /* ignore */ }
        })();

        function closeDownloadOverlay() {
            document.body.style.overflow = document.body.dataset.__dlPrevOverflow || '';
            delete document.body.dataset.__dlPrevOverflow;
            if (vid && __wasPlaying) { try { vid.play(); } catch {} }
            overlay.remove();
        }

        // lightweight toast
        function toast(msg) {
            const t = document.createElement('div');
            t.textContent = msg;
            Object.assign(t.style, {
                position: 'fixed', bottom: '18px', left: '50%', transform: 'translateX(-50%)',
                padding: '8px 12px', background: 'rgba(0,0,0,0.8)', color: '#fff',
                fontSize: '12px', borderRadius: '6px', zIndex: 10001
            });
            document.body.appendChild(t);
            setTimeout(() => t.remove(), 1400);
        }
    }

    /** Helper: build ssyoutube targets in safe order */
    function buildSsyoutubeTargets(href) {
        // Primary: ss + youtube trick (still lands on landing page in iframe, but fine)
        const primary = href.replace(/^https?:\/\/(www\.)?youtube\.com\//i, 'https://ssyoutube.com/');
        // Secondary: generic ?url= form (some locales accept it)
        const secondary = `https://ssyoutube.com/?url=${encodeURIComponent(href)}`;
        return [primary, secondary];
    }

    /*** Initialize Download feature (observer to survive SPA nav) ***/
    function startDownloadFeature() {
        const obs = new MutationObserver(addDownloadButton);
        obs.observe(document.body, { childList: true, subtree: true });
        addDownloadButton();
    }

    // Call this once (or replace your old startFeature() call)
    startDownloadFeature();


  /***********************
   * 5) SHORTS → WATCH
   ***********************/
  const redirectShortsToWatch = () => {
    if (location.pathname.startsWith('/shorts/')) {
      const id = location.pathname.split('/')[2] || '';
      if (id) location.replace(`/watch?v=${id}`);
    }
  };

  /***********************
   * 6) DISABLE AMBIENT MODE / ANNOTATIONS (best-effort)
   ***********************/
  const toggleMenuItemOffByText = (texts) => {
    // Open player menu first (three dots / settings cog is nested; “Ambient mode”/“Annotations” are in player menu, not cog)
    const menuBtn = qs('.ytp-button.ytp-settings-button') || qs('.ytp-button[aria-label*="ettings"]');
    // Some regions put ambient/annotations in the main overflow menu (three vertical dots)
    const overflow = qs('.ytp-button[aria-label*="More"]') || qs('.ytp-button[aria-label*="menu"]');
    const openTarget = overflow || menuBtn;
    if (!openTarget) return;

    // Open the menu to let items render
    openTarget.click();

    // Give YouTube a moment to render
    setTimeout(() => {
      const items = qsa('.ytp-menuitem[role="menuitemcheckbox"]');
      if (!items.length) { openTarget.click(); return; }

      items.forEach(item => {
        const label = qs('.ytp-menuitem-label', item)?.textContent?.toLowerCase() || '';
        if (texts.some(t => label.includes(t))) {
          const checked = item.getAttribute('aria-checked') === 'true';
          if (checked) item.click();
        }
      });

      // Close menu
      openTarget.click();
    }, 50);
  };

  const disableAmbientAndAnnotations = () => {
    // Language-agnostic substrings
    // “ambient”, “annotation” in many locales still contain these Latin stems in the DOM labels
    toggleMenuItemOffByText(['ambient', 'annotation']);
  };

  /***********************
   * 7) DISABLE AUTOPLAY
   ***********************/
  const disableAutoplay = () => {
    // Classic toggle in player UI
    const btn = qs('.ytp-autonav-toggle-button');
    if (btn && btn.getAttribute('aria-checked') === 'true') btn.click();

    // Sometimes there’s a second toggle in the right rail
    const rightRailToggle = qs('tp-yt-paper-toggle-button[aria-label*="Autoplay"], tp-yt-paper-toggle-button[aria-label*="Play next"]');
    if (rightRailToggle?.getAttribute('aria-pressed') === 'true') rightRailToggle.click();
  };

  /***********************
   * MOUNTERS (run on each navigation)
   ***********************/
  const mountAll = () => {
    redirectShortsToWatch();

    // Player control mount (A-B)
    // Use a small observer loop to catch player controls when they appear
    const tryMountLoop = () => {
      mountLoopButton();
      if (!qs('.yttools-loop-btn')) requestAnimationFrame(tryMountLoop);
    };
    tryMountLoop();

    // Title-area buttons
    const tryMountHeaderBtns = () => {
      mountRecordButton();
      // Retry until present
      if (!qs('#yttools-record-btn') || !qs('#yttools-download-btn')) requestAnimationFrame(tryMountHeaderBtns);
    };
    tryMountHeaderBtns();

    // Initial best-effort toggles (don’t keep fighting user choices)
    setTimeout(() => {
      disableAmbientAndAnnotations();
      disableAutoplay();
    }, 800);
  };

  onAllNavigations(mountAll);
})();
