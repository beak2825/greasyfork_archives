// ==UserScript==
// @name         No gray filter
// @namespace    http://tampermonkey.net/
// @version      0.3
// @description  Remove gray filter from some china websits
// @author       Microdust
// @match        *://www.mcbbs.net/*
// @match        *://world.taobao.com/*
// @match        *://www.bilibili.com/*
// @icon         none
// @license MIT
// @grant    GM_addStyle
// @run-at   document-start
// @downloadURL https://update.greasyfork.org/scripts/455815/No%20gray%20filter.user.js
// @updateURL https://update.greasyfork.org/scripts/455815/No%20gray%20filter.meta.js
// ==/UserScript==

(function() {
    'use strict';
    GM_addStyle ( `
    html {
  filter: grayscale(0);
  -webkit-filter: grayscale(0);
  -moz-filter: grayscale(0);
  -ms-filter: grayscale(0);
  -o-filter: grayscale(0);
}
body {
  filter: grayscale(0);
  -webkit-filter: grayscale(0);
  -moz-filter: grayscale(0);
  -ms-filter: grayscale(0);
  -o-filter: grayscale(0);
}
` );
    window.addEventListener('load', function() {
    document.body.style.removeProperty('filter');
    document.documentElement.classList.remove("gray");
}, false);
})();