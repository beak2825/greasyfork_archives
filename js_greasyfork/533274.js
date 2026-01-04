// ==UserScript==
// @name         Kick ↔ MultiKick Enhancer
// @namespace    http://tampermonkey.net/
// @version      1.7
// @description  Adds a “➕” on Kick.com to view multiple streams at once on MultiKick.com
// @match        https://kick.com/*
// @match        https://www.kick.com/*
// @match        https://multikick.com/*
// @match        https://www.multikick.com/*
// @grant        none
// @run-at       document-end
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/533274/Kick%20%E2%86%94%20MultiKick%20Enhancer.user.js
// @updateURL https://update.greasyfork.org/scripts/533274/Kick%20%E2%86%94%20MultiKick%20Enhancer.meta.js
// ==/UserScript==

(function() {
  'use strict';
  const host        = location.hostname.replace(/^www\./, '');
  const WINDOW_NAME = 'multikick-window';

  // ─── Kick.com side ─────────────────────────────────────────────────────
  if (host === 'kick.com') {
    function addButtons() {
      // streamer-list pages
      document
        .querySelectorAll('a[data-state][href^="/"] > img.rounded-full')
        .forEach(img => {
          const a = img.parentElement;
          if (a.dataset.mkDone) return;
          a.dataset.mkDone = '1';

          const slug = a.getAttribute('href').slice(1);
          const btn  = document.createElement('a');
          btn.textContent = '➕';
          btn.href        = '#';
          btn.title       = 'Add to MultiKick';
          Object.assign(btn.style, {
            marginLeft: '4px',
            cursor:     'pointer',
            fontSize:   '1em',
            textDecoration: 'none',
            color:      'inherit',
          });

          btn.addEventListener('click', e => {
            e.preventDefault();
            const mkWin = window.open('https://multikick.com', WINDOW_NAME);
            if (!mkWin) return;
            mkWin.focus();
            const msg = { type: 'MK_APPEND', slug };
            mkWin.postMessage(msg, 'https://multikick.com');
            setTimeout(() => mkWin.postMessage(msg, 'https://multikick.com'), 500);
          });

          a.parentElement.insertBefore(btn, a.nextSibling);
        });

      // single-streamer pages
      const header = document.getElementById('channel-username');
      if (header && !header.dataset.mkDone) {
        header.dataset.mkDone = '1';
        const slug = location.pathname.replace(/^\/|\/$/g, '');
        const btn  = document.createElement('a');
        btn.textContent = '➕';
        btn.href        = '#';
        btn.title       = 'Add to MultiKick';
        Object.assign(btn.style, {
          marginLeft:    '8px',
          cursor:        'pointer',
          fontSize:      '0.9em',
          textDecoration:'none',
          color:         'inherit',
          verticalAlign: 'middle',
        });

        btn.addEventListener('click', e => {
          e.preventDefault();
          const mkWin = window.open('https://multikick.com', WINDOW_NAME);
          if (!mkWin) return;
          mkWin.focus();
          const msg = { type: 'MK_APPEND', slug };
          mkWin.postMessage(msg, 'https://multikick.com');
          setTimeout(() => mkWin.postMessage(msg, 'https://multikick.com'), 500);
        });

        header.insertAdjacentElement('afterend', btn);
      }
    }

    addButtons();
    new MutationObserver(addButtons)
      .observe(document.body, { childList: true, subtree: true });
  }


  // ─── MultiKick.com side ────────────────────────────────────────────────
  else if (host === 'multikick.com') {
    // name the window for reuse
    if (window.name !== WINDOW_NAME) window.name = WINDOW_NAME;

    // patch History API
    const desired = location.pathname;
    function wrap(orig) {
      return function(state, _title, url) {
        if ((url === '/' || url === '') && desired !== '/') url = desired;
        return orig.call(this, state, '', url);
      };
    }
    history.pushState    = wrap(history.pushState);
    history.replaceState = wrap(history.replaceState);
    window.addEventListener('popstate', () => {
      if (location.pathname === '/' && desired !== '/') {
        history.replaceState(null, '', desired);
      }
    });

    // handle append messages
    window.addEventListener('message', e => {
      if (!/^https?:\/\/(?:www\.)?kick\.com$/.test(e.origin)) return;
      const msg = e.data || {};
      if (msg.type !== 'MK_APPEND' || typeof msg.slug !== 'string') return;

      const parts = location.pathname
        .replace(/^\/|\/$/g, '')
        .split('/')
        .filter(Boolean);

      if (!parts.includes(msg.slug)) {
        parts.push(msg.slug);
        history.replaceState(null, '', '/' + parts.join('/'));
        location.reload();
      }
    });

    // hook delete buttons—update URL only (no removal)
    function hookDeletes() {
      document
        .querySelectorAll('button[aria-label="delete stream"]')
        .forEach(btn => {
          if (btn.dataset.mkHooked) return;
          btn.dataset.mkHooked = '1';
          btn.addEventListener('click', () => {
            const wrapper = btn.closest('div.relative');
            if (!wrapper) return;
            const iframe = wrapper.querySelector('iframe');
            if (!iframe) return;
            const slug = iframe.getAttribute('src').split('/').pop();
            if (!slug) return;

            const filtered = location.pathname
              .replace(/^\/|\/$/g, '')
              .split('/')
              .filter(p => p !== slug);

            history.replaceState(null, '', '/' + filtered.join('/'));
          });
        });
    }

    hookDeletes();
    new MutationObserver(hookDeletes)
      .observe(document.body, { childList: true, subtree: true });
  }
})();