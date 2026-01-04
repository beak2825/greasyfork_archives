// ==UserScript==
// @name        wykop.pl
// @namespace   Violentmonkey Scripts
// @match       https://wykop.pl/*
// @grant       none
// @version     1.0
// @author      me__
// @license MIT 
// @description 1/17/2023, 12:38:03 PM
// @downloadURL https://update.greasyfork.org/scripts/458423/wykoppl.user.js
// @updateURL https://update.greasyfork.org/scripts/458423/wykoppl.meta.js
// ==/UserScript==
(function() {
    'use strict';
  addGlobalStyle(`.entry>.comments {margin-left:34px !important;} [data-label*="ad: stream"],[data-label*="ad: sidebar"],[data-label*="ad: top"] {display:none !important; }`);
})();
function addGlobalStyle(css) {
    var head, style;
    head = document.getElementsByTagName('head')[0];
    if (!head) { return; }
    style = document.createElement('style');
    style.type = 'text/css';
    style.innerHTML = css;
    head.appendChild(style);
}