// ==UserScript==
// @name        Duome CSS Injector
// @namespace   Violentmonkey Scripts
// @match       https://duome.eu/*
// @grant       none
// @run-at      document-end
// @version     1.0
// @author      kayleighember
// @license     MIT
// @description 8/11/2025, 1:56:49 AM
// @downloadURL https://update.greasyfork.org/scripts/545374/Duome%20CSS%20Injector.user.js
// @updateURL https://update.greasyfork.org/scripts/545374/Duome%20CSS%20Injector.meta.js
// ==/UserScript==

(function () {
  'use strict';

  const css = `
    /* -------- Base (both sizes) -------- */
    #notify { display: none !important; }
    div.page:has(> a.o.duo) { margin-top: 80px !important; padding-top:10px !important; padding-bottom:10px !important; }
    div.flexi > div.page:has(div.person) { padding: 0 !important; }
    div.flexi > div.page > div.person > h3 { margin: 0 !important; }
    div.flexi > div.page > div.person > h2 { margin-top: 6px !important; }
    div[class=" badge fade"] { display: none !important; }

    /* -------- Mobile & tablet: ≤768px -------- */
    @media screen and (max-width: 768px) {
      /* This was your adblock :style(...) that looked good on mobile */
      div.person > span.ava > a.ava {
        margin-top: 0 !important;
        margin-bottom: 0 !important;
      }
    }

    /* -------- Desktop: >768px -------- */
    @media screen and (min-width: 769px) {
      /* Restore the site’s default margins on desktop */
      div.person > span.ava > a.ava {
        margin: 30px !important;
      }
      div.stats.cCCC {
        padding-bottom:0px !important;
      }
      div.flexi > div.page:nth-child(2) {
        padding-bottom:10px !important;
      }
    }

    /* -------- CSS rules for any size -------- */

  `;

  const styleEl = document.createElement('style');
  styleEl.type = 'text/css';
  styleEl.textContent = css;
  document.head.appendChild(styleEl);
})();