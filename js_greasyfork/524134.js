// ==UserScript==
// @name         FireFox Gmail overrides
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Fix Gmail display
// @author       jmaccini
// @match        mail.google.com/*
// @license      MIT
// @icon         https://www.google.com/s2/favicons?sz=64&domain=folkstalk.com
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/524134/FireFox%20Gmail%20overrides.user.js
// @updateURL https://update.greasyfork.org/scripts/524134/FireFox%20Gmail%20overrides.meta.js
// ==/UserScript==

(function() {
    'use strict';

    function addGlobalStyle(css) {
        var head, style;
        head = document.getElementsByTagName('head')[0];
        if (!head) { return; }
        style = document.createElement('style');
        style.type = 'text/css';
        style.innerHTML = css.replace(/;/g, ' !important;');
        head.appendChild(style);
    }

    addGlobalStyle('.bkL>.bkK>.nH { background-color: transparent; }');
    addGlobalStyle('.yO, .zE { background-color: rgba(255,255,255,0.8); }');
    addGlobalStyle('.G-atb { background-color: rgba(255,255,255,0.8); }');
    addGlobalStyle('.x7 { background: #c2dbff; }');


})();

