// ==UserScript==
// @name        Facebook Reel: Video Controls Fork
// @namespace   UserScript
// @match       https://www.facebook.com/*
// @version     0.1.2
// @license     MIT
// @author      CY Fung | fork by ArminC
// @description A fixed control bar fork of CY Fung's Facebook Reel: Video Controls.
// @run-at      document-start
// @grant       none
// @unwrap
// @downloadURL https://update.greasyfork.org/scripts/487657/Facebook%20Reel%3A%20Video%20Controls%20Fork.user.js
// @updateURL https://update.greasyfork.org/scripts/487657/Facebook%20Reel%3A%20Video%20Controls%20Fork.meta.js
// ==/UserScript==

document.addEventListener('play', (evt) => {
  const target = (evt || 0).target;

  if (target instanceof HTMLVideoElement && !target.hasAttribute('controls') && location.href.includes('reel')) {
    let buttonLayer = target.closest('div[class][role="button"][tabindex]');

    if (buttonLayer) {
      target.setAttribute('controls', '');

      setTimeout(() => {
        Object.assign(target.style, {
          'position': 'relative',
          'zIndex': 999,
          'pointerEvents': 'all'
        });

        [...buttonLayer.querySelectorAll('.x10l6tqk.x13vifvy:not(.x1m3v4wt)')].forEach(s => {
          Object.assign(s.style, {
            'pointerEvents': 'none',
            'position': 'relative',
            'zIndex': 1000
          });
        });
      }, 1);
    }
  }
}, true);