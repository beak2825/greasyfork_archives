// ==UserScript==
// @name         My Lightshot Redirector
// @namespace    Lightshot Scripts
// @match        https://prnt.sc/*
// @grant        none
// @version      1.0
// @description  Redirect Lightshot pages to the direct image URL
// @icon         https://t2.gstatic.com/faviconV2?client=SOCIAL&type=FAVICON&fallback_opts=TYPE,SIZE,URL&url=http://prnt.sc&size=128
// @downloadURL https://update.greasyfork.org/scripts/522089/My%20Lightshot%20Redirector.user.js
// @updateURL https://update.greasyfork.org/scripts/522089/My%20Lightshot%20Redirector.meta.js
// ==/UserScript==

'use strict';

(() => {
  const MAX_RETRIES = 5; // Number of retries before giving up
  const REDIRECT_DELAY = 100; // Delay in milliseconds between retries
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
    const img = document.querySelector('#screenshot-image'); // Find the image element
    if (img && img.src) {
      console.log(`Redirecting to: ${img.src}`);
      setTimeout(() => (globalThis.location.href = img.src), REDIRECT_DELAY);
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
      new MutationObserver((mutations, observer) => {
        if (detectAndRedirect()) observer.disconnect();
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
