// ==UserScript==
// @name         Cloutgist skipper
// @namespace    http://tampermonkey.net/
// @version      0.1.1
// @description  Skip some of the timers
// @author       myklosbotond
// @license      MIT
// @match        https://cloutgist.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=cloutgist.com
// @grant        GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/501340/Cloutgist%20skipper.user.js
// @updateURL https://update.greasyfork.org/scripts/501340/Cloutgist%20skipper.meta.js
// ==/UserScript==

(function() {
    'use strict';

    GM_addStyle(`
.circular {
    display: none !important;
}
#paras-btn-before {
    display: none !important;
}
#paras-btn-after {
    display: block !important;
}

#paras-devgenerate ~ * {
  display: none;
}
#content > :not(center) {
  display: none;
}
body.banner-page > :not(.container) {
  display: none;
}
    `);
})();