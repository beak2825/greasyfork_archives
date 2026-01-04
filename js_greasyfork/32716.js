// ==UserScript==
// @name         Avgle Helper
// @namespace    https://avgle.com/
// @version      1.1
// @description  Help you watch videos smoothly at Avgle
// @author       Neal
// @match        https://avgle.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/32716/Avgle%20Helper.user.js
// @updateURL https://update.greasyfork.org/scripts/32716/Avgle%20Helper.meta.js
// ==/UserScript==

function AddGlobalStyle(css) {
    var head, style;
    head = document.getElementsByTagName('head')[0];
    if (!head) return;
    style = document.createElement('style');
    style.type = 'text/css';
    style.innerHTML = css;
    head.appendChild(style);
}

(function() {
    'use strict';
    AddGlobalStyle('.top-nav {position: absolute}');
    AddGlobalStyle('.navbar-fixed-top {position: absolute}');
    AddGlobalStyle('#player_3x2_close {display:none}');
})();