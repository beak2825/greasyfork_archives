// ==UserScript==
// @name         Increase code font size on sourcegraph
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Change the font size on sourcegraph. Current font is too small. Used code from https://somethingididnotknow.wordpress.com/2013/07/01/change-page-styles-with-greasemonkeytampermonkey/
// @author       github.com/wangxiaodiu
// @match        *sourcegraph.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/420372/Increase%20code%20font%20size%20on%20sourcegraph.user.js
// @updateURL https://update.greasyfork.org/scripts/420372/Increase%20code%20font%20size%20on%20sourcegraph.meta.js
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
    addGlobalStyle(".code {font-size: 16px !important}");
})();