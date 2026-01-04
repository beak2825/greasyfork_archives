// ==UserScript==
// @name         notYet
// @namespace    http://tampermonkey.net/
// @license      MIT
// @version      0.1
// @description  Hide inactive tv yettel channels
// @author       zamiere
// @match        https://tv.yettel.hu/
// @icon         https://www.google.com/s2/favicons?sz=64&domain=yettel.hu
// @grant        GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/442872/notYet.user.js
// @updateURL https://update.greasyfork.org/scripts/442872/notYet.meta.js
// ==/UserScript==
(function() {
    'use strict';
    function addGlobalStyle(css) {
        var head, style;
        head = document.getElementsByTagName('head')[0];
        if (!head) { return; }
        style = document.createElement('style');
        style.type = 'text/css';
        style.innerHTML = css;
        head.appendChild(style);
    }
    addGlobalStyle('.greyscale { display:none; }');
})();
