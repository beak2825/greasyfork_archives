// ==UserScript==
// @name         Dark Theme for Reddit Chrome App
// @namespace    https://gist.github.com/jfroment/29cfc945a207b530046d6e1b373d32a6
// @version      0.1
// @description  Force Dark mode for reddit by setting theme-color meta property to #1a1a1a
// @author       Jean Froment
// @match        https://*.reddit.com/
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/399412/Dark%20Theme%20for%20Reddit%20Chrome%20App.user.js
// @updateURL https://update.greasyfork.org/scripts/399412/Dark%20Theme%20for%20Reddit%20Chrome%20App.meta.js
// ==/UserScript==

(function() {
    'use strict';
    document.querySelector("[name='theme-color']").remove();
    var m = document.createElement('meta');
    m.name = 'theme-color';
    m.content = '#1a1a1a';
    document.head.appendChild(m);
})();