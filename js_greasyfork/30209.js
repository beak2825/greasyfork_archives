// ==UserScript==
// @name         FontShadow
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  给字体加上阴影
// @author       kirikiri
// @match        http*://*/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/30209/FontShadow.user.js
// @updateURL https://update.greasyfork.org/scripts/30209/FontShadow.meta.js
// ==/UserScript==

(function() {
    'use strict';
    document.getElementsByTagName('body')[0].style.textShadow = '0.01em 0.01em 0.01em #999';
    // Your code here...
})();