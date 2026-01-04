// ==UserScript==
// @name        探针去广告
// @namespace   Violentmonkey Scripts
// @match       https://nodepanels.com/*
// @grant       none
// @version     1.1
// @author      NONE
// @grant    GM_addStyle
// @run-at   document-start
// @description 2022/4/14 22:30:25
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/443381/%E6%8E%A2%E9%92%88%E5%8E%BB%E5%B9%BF%E5%91%8A.user.js
// @updateURL https://update.greasyfork.org/scripts/443381/%E6%8E%A2%E9%92%88%E5%8E%BB%E5%B9%BF%E5%91%8A.meta.js
// ==/UserScript==
(function() {
  GM_addStyle ( `
    .row .d-none {
        display: none!important;
    }
` );
    'use strict';
  
})();