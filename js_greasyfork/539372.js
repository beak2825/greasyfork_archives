// ==UserScript==
// @name         Full Size Udemy Video Player
// @namespace    http://tampermonkey.net/
// @version      2025-06-14
// @description  Makes Udemy video player take up the entire screen viewport when it is expanded
// @author       Jacky Xu
// @license      MIT
// @match        https://www.udemy.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=udemy.com
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/539372/Full%20Size%20Udemy%20Video%20Player.user.js
// @updateURL https://update.greasyfork.org/scripts/539372/Full%20Size%20Udemy%20Video%20Player.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Your code here...
    function addGlobalStyle(css) {
        var head, style;
        head = document.getElementsByTagName('head')[0];
        if (!head) { return; }
        style = document.createElement('style');
        style.type = 'text/css';
        style.innerHTML = css;
        head.appendChild(style);
    }

    addGlobalStyle("div[class*='curriculum-item-view--scaled-height-limiter--'][class*='curriculum-item-view--no-sidebar--'] { max-block-size: calc(100vh - 55px) !important; }");

})();