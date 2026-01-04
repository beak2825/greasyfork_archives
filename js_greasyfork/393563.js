// ==UserScript==
// @name         derSansard
// @namespace    https://derstandard.at/
// @version      0.1
// @description  derComicSansard.at
// @author       dersansard
// @match        *://*.derstandard.at/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/393563/derSansard.user.js
// @updateURL https://update.greasyfork.org/scripts/393563/derSansard.meta.js
// ==/UserScript==

(function() {
    'use strict';
     var head, style;
    head = document.getElementsByTagName('head')[0];
    if (!head) { return; }
    style = document.createElement('style');
    style.type = 'text/css';
    style.innerHTML = '* { font-family: Comic Sans MS,Comic Sans !important; }';
    head.appendChild(style);
})();