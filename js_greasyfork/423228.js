// ==UserScript==
// @name         LeetCode-Default-Font
// @namespace    leetcode-default-font
// @version      0.3
// @description  Always use the default monospace font in the codemirror editor.
// @author       fenghaolw@gmail.com
// @include      *://leetcode.com/*
// @downloadURL https://update.greasyfork.org/scripts/423228/LeetCode-Default-Font.user.js
// @updateURL https://update.greasyfork.org/scripts/423228/LeetCode-Default-Font.meta.js
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
    addGlobalStyle('.CodeMirror { font-family: monospace !important; }');
    addGlobalStyle('pre, code, kbd, samp { font-family: monospace !important; }');
})();