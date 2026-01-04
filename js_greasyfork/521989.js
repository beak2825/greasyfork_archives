// ==UserScript==
// @name        My Gyazo Redirector
// @namespace   Violentmonkey Scripts
// @match       https://gyazo.com/*
// @grant       none
// @version     1.2.1
// @description Gyazo Redirector with Retry and Delay
// @icon https://t2.gstatic.com/faviconV2?client=SOCIAL&type=FAVICON&fallback_opts=TYPE,SIZE,URL&url=http://gyazo.com&size=32
// @downloadURL https://update.greasyfork.org/scripts/521989/My%20Gyazo%20Redirector.user.js
// @updateURL https://update.greasyfork.org/scripts/521989/My%20Gyazo%20Redirector.meta.js
// ==/UserScript==

'use strict';

(() => {
  const MAX_RETRIES = 3;
  const REDIRECT_DELAY = 100;
  let retryCount = 0;

  const overlay = (() => {
    const div = document.createElement('div');
    Object.assign(div.style, {
      position: 'fixed', top: '0', left: '0', width: '100%',
      height: '100%', backgroundColor: '#121212',
      zIndex: '999999', pointerEvents: 'none',
    });
    return div;
  })();

  const detectAndRedirect = () => {
    const media = document.querySelector('video source') || document.querySelector('img.image-viewer');
    if (media) {
      console.log(`Redirecting to: ${media.src}`);
      setTimeout(() => (globalThis.location.href = media.src), REDIRECT_DELAY);
      return true;
    }
    return false;
  };

  const retryOrReload = () => {
    if (retryCount++ < MAX_RETRIES) {
      console.warn(`Retrying (${retryCount}/${MAX_RETRIES})...`);
      setTimeout(main, 1000);
    } else {
      console.error('Max retries reached, reloading.');
      globalThis.location.reload();
    }
  };

  const main = () => {
    if (!document.body.contains(overlay)) document.body.appendChild(overlay);
    if (!detectAndRedirect()) {
      new MutationObserver(() => {
        if (detectAndRedirect()) this.disconnect();
      }).observe(document.body, { childList: true, subtree: true });
    } else {
      overlay.remove();
    }
  };

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', main);
  } else {
    main();
  }
})();