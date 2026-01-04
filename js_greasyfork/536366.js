// ==UserScript==
// @name         YouTube Toolkit+: NewPipe button + H264 ≤30FPS + YouTube Adblock
// @version           1.1
// @description  NewPipe button + H.264 ≤30FPS + auto-hide overlays + auto-skip YouTube ads 
// @author       jc
// @namespace    https://viayoo.com/
// @match        *://*.youtube.com/*
// @match        *://*.youtube-nocookie.com/*
// @match        *://*.youtubekids.com/*
// @match        https://m.youtube.com/*
// @exclude      *://www.youtube.com/*/music*
// @exclude      *://music.youtube.com/*
// @run-at       document-start
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/536366/YouTube%20Toolkit%2B%3A%20NewPipe%20button%20%2B%20H264%20%E2%89%A430FPS%20%2B%20YouTube%20Adblock.user.js
// @updateURL https://update.greasyfork.org/scripts/536366/YouTube%20Toolkit%2B%3A%20NewPipe%20button%20%2B%20H264%20%E2%89%A430FPS%20%2B%20YouTube%20Adblock.meta.js
// ==/UserScript==

(function() {
  'use strict';

  //
  // 1. H.264 ≤30FPS limiter
  //
  (function() {
    const BAD = /webm|vp8|vp9|av01/i;
    const FR = /framerate=(\d+)/;
    const ms = window.MediaSource;
    if (!ms) return;
    const orig = ms.isTypeSupported.bind(ms);
    ms.isTypeSupported = type => {
      if (typeof type !== 'string' || BAD.test(type)) return false;
      const m = FR.exec(type);
      if (m && +m[1] > 30) return false;
      return orig(type);
    };
  })();

  //
  // 2. Hide ad overlays
  //
  (function() {
    const rules = [
      '.ytp-ad-overlay.ytp-overlay-loading',
      '.ytp-featured-product',
      'ytd-ad-preview-slot-renderer',
      'ytm-compact-ad'
    ];
    const s = document.createElement('style');
    s.textContent = rules.join(',') + '{display:none!important;}';
    document.head.appendChild(s);
  })();

  //
  // 3. Auto-skip ads
  //
  (function() {
    const CLICK_EVENTS = ['pointerdown','mouseup','click'];

    function dispatchClick(el) {
      CLICK_EVENTS.forEach(type => {
        el.dispatchEvent(new MouseEvent(type, { bubbles: true, cancelable: true, composed: true }));
      });
    }

    function isVisible(el) {
      const r = el.getBoundingClientRect();
      return r.width > 10 && r.height > 10 && r.bottom > 0 && r.top < innerHeight;
    }

    function skipOrJump() {
      const txtMatch = el => {
        const t = (el.innerText||'').trim().toLowerCase();
        return t === 'skip ad' || t.startsWith('skip ad') || t === 'skip ads' || t === 'skip';
      };
      const ariaMatch = el => {
        const a = el.getAttribute('aria-label')||'';
        return a.toLowerCase().includes('skip ad');
      };

      // find and click any visible “Skip” control
      for (const el of document.querySelectorAll('button, [role="button"], a')) {
        if (isVisible(el) && (txtMatch(el) || ariaMatch(el))) {
          dispatchClick(el);
          return;
        }
      }

      // fallback: fast-forward unskippable (mobile preview)
      const video = document.querySelector('video');
      if (video && isFinite(video.duration)) {
        video.currentTime = video.duration;
      }
    }

    // poll every 500ms when ad is active
    setInterval(() => {
      if (document.querySelector('.ad-showing') || document.querySelector('video.ad-active')) {
        skipOrJump();
      }
    }, 500);
  })();

  //
  // 4. Floating NewPipe button
  //
  (function() {
    function makeBtn() {
      const btn = document.createElement('div');
      btn.textContent = '⬇️';
      Object.assign(btn.style, {
        position: 'fixed', bottom: '80px', right: '16px',
        width: '48px', height: '48px', lineHeight: '48px',
        textAlign: 'center', fontSize: '24px',
        background: 'rgba(200,200,200,0.3)',
        borderRadius: '50%', cursor: 'pointer',
        zIndex: 999999, opacity: 0.7, transition: 'opacity .2s'
      });
      ['mouseenter','mouseleave'].forEach(evt => {
        btn.addEventListener(evt, () => btn.style.opacity = evt==='mouseenter'?1:0.7);
      });
      btn.addEventListener('click', () => {
        let id = new URL(location.href).searchParams.get('v');
        if (!id) {
          const m = location.pathname.match(/\/shorts\/([^\/?&]+)/);
          id = m && m[1];
        }
        if (id) {
          location.href = `intent://www.youtube.com/watch?v=${id}#Intent;scheme=https;package=org.schabi.newpipe;end`;
        } else {
          alert('No video ID found.');
        }
      });
      document.body.appendChild(btn);
    }

    if (document.body) {
      makeBtn();
    } else {
      new MutationObserver((_, obs) => {
        if (document.body) {
          obs.disconnect();
          makeBtn();
        }
      }).observe(document.documentElement, { childList: true });
    }
  })();

})();