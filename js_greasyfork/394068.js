// ==UserScript==
// @name         Djubo Firefox Chart Fix
// @namespace    https://*.djubo.com/*
// @version      0.1
// @description  Fix misaligned Chart layout on firefox
// @author       Zeeshan
// @match        https://*.djubo.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/394068/Djubo%20Firefox%20Chart%20Fix.user.js
// @updateURL https://update.greasyfork.org/scripts/394068/Djubo%20Firefox%20Chart%20Fix.meta.js
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
    addGlobalStyle('table tr {top: 0 !important;}');
})();