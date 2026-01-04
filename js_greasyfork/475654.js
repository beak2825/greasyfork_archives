// ==UserScript==
// @name         YouTube Dark Scrollbar
// @description  Sets scrollbar color to dark while using dark theme on YouTube.
// @version      1.1
// @author       yungsamd17
// @namespace    https://github.com/yungsamd17/UserScripts
// @license      MIT License
// @icon         https://raw.githubusercontent.com/yungsamd17/UserScripts/main/scripts/icons/YouTube-Dark-Scrollbar.png
// @match        https://www.youtube.com/*
// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/475654/YouTube%20Dark%20Scrollbar.user.js
// @updateURL https://update.greasyfork.org/scripts/475654/YouTube%20Dark%20Scrollbar.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const html = document.documentElement;
    if (html.getAttribute("dark") != null) {
        html.style.colorScheme = "dark";
    }
})();