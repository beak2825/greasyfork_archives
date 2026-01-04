// ==UserScript==
// @name                Le Scienza Paywall Bypass
// @name:it             Le Scienze Paywall Bypass
// @namespace           KobayashiUserJS
// @version             0.1.7
// @description         Unhides the "paywalled" articles on lescienze.it.
// @description:it      Rimuove il paywall su lescienze.it
// @author              Davide Kobayashi
// @match               https://www.lescienze.it/*
// @license             GPL version 3 or any later version http://www.gnu.org/copyleft/gpl.html
// @downloadURL https://update.greasyfork.org/scripts/387209/Le%20Scienza%20Paywall%20Bypass.user.js
// @updateURL https://update.greasyfork.org/scripts/387209/Le%20Scienza%20Paywall%20Bypass.meta.js
// ==/UserScript==

const addStyle = function(css) {
  /**
   * Inject CSS into the document.
   *
   * This is a standalone implementation of GM_addStyle, which is
   * deprecated by Greasemonkey but still supported by other extensions.
   *
   * Inspired by Tampermonkey's TM_addStyle function, which is
   * Tampermonkey's own implementation of GM_addStyle.
   **/
  try {
    let style = document.createElement('style');
    style.textContent = css;
    var parent = document.head || document.getElementsByTagName('head')[0];
    parent.appendChild(style);
  } catch (e) {
    console.log("Error: " + e);
  }
};

(function () {
  'use strict';
  addStyle(
    `
    div#paywall-banner, #ph-paywall, .block_layout-list, #ls-footer {
      display: none !important;
    }
    #detail-body {
      display: block !important;
      max-height: auto!important;
      overflow: visible !important;
    }
    `
  );
    document.getElementById('detail-body').removeAttribute('hidden')
  window.dispatchEvent(new Event('resize'));
})()
