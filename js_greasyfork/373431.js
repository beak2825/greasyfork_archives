// ==UserScript==
// @name         Dynasty Scans maximized fullscreen reader
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  Maximizes size of manga page on dynasty scans.
// @author       You
// @match        https://dynasty-scans.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/373431/Dynasty%20Scans%20maximized%20fullscreen%20reader.user.js
// @updateURL https://update.greasyfork.org/scripts/373431/Dynasty%20Scans%20maximized%20fullscreen%20reader.meta.js
// ==/UserScript==

(function() {
    'use strict';
    var head, style;
    head = document.getElementsByTagName('head')[0];
    if (!head) { return; }
    style = document.createElement('style');
    style.type = 'text/css';
    style.innerHTML = '#reader #image img { max-height: 100vh; } #reader #fullscreen2 { top: auto !important; bottom: 2px !important; right: 4px !important; } #reader #resize2 { top: auto !important; right: 40px !important; bottom: 2px !important; }';
    head.appendChild(style);
})();