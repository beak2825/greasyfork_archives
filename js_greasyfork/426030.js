// ==UserScript==
// @name         Paul Graham - Fix
// @namespace    https://greasyfork.org/en/scripts/426030-paul-graham-fix
// @version      0.1
// @description  Fixes some off formating for paulgraham.com.
// @author       Makky
// @match        http://www.paulgraham.com/*
// @icon         https://www.google.com/s2/favicons?domain=paulgraham.com
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/426030/Paul%20Graham%20-%20Fix.user.js
// @updateURL https://update.greasyfork.org/scripts/426030/Paul%20Graham%20-%20Fix.meta.js
// ==/UserScript==

(function() {

    function addGlobalStyle(css) {
    var head, style;
    head = document.getElementsByTagName('head')[0];
    if (!head) { return; }
    style = document.createElement('style');
    style.type = 'text/css';
    style.innerHTML = css;
    head.appendChild(style);
}

    'use strict';
    addGlobalStyle("blockquote{font-size:120%;border-radius:5px;padding:1em;background-color:#AAA;}font{font-size: 16px;}table[width]{width:auto;}table[width]>tbody>tr>td{width: auto;padding-right:10%;text-align:justify;line-height: 150%}");

})();