// ==UserScript==
// @name         Gitlab width
// @namespace    http://tampermonkey.net/
// @version      0.5
// @description  adjust gitlab width for you!
// @author       gshmu
// @match        https://gitpd.paodingai.com/cheftin/*
// @grant        GM_addStyle
// @icon         https://www.google.com/s2/favicons?sz=64&domain=paodingai.com
// @downloadURL https://update.greasyfork.org/scripts/502254/Gitlab%20width.user.js
// @updateURL https://update.greasyfork.org/scripts/502254/Gitlab%20width.meta.js
// ==/UserScript==
(function() {
  'use strict';
  GM_addStyle(`
     @media (max-width: 1280px) {
       .wiki-page-details,
       .container-limited,
       .container-limited.limit-container-width,
       .container-limited.limit-container-width .issue-sticky-header-text {
         max-width: 100%;
       }
    }

     @media (min-width: 1281px) {
       .wiki-page-details,
       .container-limited,
       .container-limited.limit-container-width,
       .container-limited.limit-container-width .issue-sticky-header-text {
         max-width: 100%;
       }
    }
  `);
})();