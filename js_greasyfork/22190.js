// ==UserScript==
// @name         gh-better-monospace
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Better github code reading experience
// @author       Haishan
// @include      https://*github.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/22190/gh-better-monospace.user.js
// @updateURL https://update.greasyfork.org/scripts/22190/gh-better-monospace.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Your code here...
    var s = document.createElement('style');
    var head = document.querySelector('head');
    s.innerText = '.blob-code-inner, code, pre { font-family: Inconsolata; font-size: 14px; }';
    head.appendChild(s);
})();