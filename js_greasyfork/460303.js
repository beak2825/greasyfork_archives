// ==UserScript==
// @name        Always expand description on PChome
// @namespace   https://github.com/gslin/always-expand-description-on-pchome
// @match       https://24h.pchome.com.tw/prod/*
// @grant       none
// @version     0.20230228.0
// @author      -
// @description Always expand description
// @license     MIT
// @downloadURL https://update.greasyfork.org/scripts/460303/Always%20expand%20description%20on%20PChome.user.js
// @updateURL https://update.greasyfork.org/scripts/460303/Always%20expand%20description%20on%20PChome.meta.js
// ==/UserScript==

(() => {
  'use strict';

  const ob = new window.MutationObserver(mutations => {
    mutations.forEach(mutation => {
      mutation.addedNodes.forEach(node => {
        const el = document.querySelector('button[data-gtm-name="more"]');
        if (el) {
          // Uninstall first
          ob.disconnect();

          el.click();
          el.parentElement.addEventListener('click', ev => {
            ev.stopPropagation();
          });
        }
      });
    });
  });

  ob.observe(document, {
    childList: true,
    subtree: true,
  });
})();
