// ==UserScript==
// @name         Larger Qt Forum
// @namespace    https://github.com/SnorlaxGengar
// @version      0.1
// @description  Adjust https://forum.qt.io font larger
// @author       SnorlaxGengar
// @match        https://forum.qt.io/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=qt.io
// @grant        GM_addStyle
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/441320/Larger%20Qt%20Forum.user.js
// @updateURL https://update.greasyfork.org/scripts/441320/Larger%20Qt%20Forum.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Make font larger and make some color
    // https://www.cs.cmu.edu/~jbigham/pubs/pdfs/2017/colors.pdf
    GM_addStyle('body {  font-family: "Fira Mono for Powerline"; font-size: 14px; background-color: #d8d3d6 }');
    GM_addStyle('.content {  font-family: "Fira Mono for Powerline"; font-size: 14px; background-color: #dbe1f1;}');
    GM_addStyle('.markdown-highlight {  font-family: "Source Sans Pro"; font-size: 15px; background-color: #9cadfc;}');
    GM_addStyle('code {  font-family: "Fira Mono for Powerline"; font-size: 15px; background-color: #f8fd89;}');
    GM_addStyle('blockquote {  font-family: "Fira Mono for Powerline"; font-size: 16px; background-color: #eddd6e;}');
    GM_addStyle('.topic .posts .content blockquote {  font-size: 14px; }');
})();