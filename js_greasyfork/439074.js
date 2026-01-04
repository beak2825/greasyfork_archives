// ==UserScript==
// @name         Wyze Webview Improve Fullscreen
// @namespace    http://tampermonkey.net/
// @version      0.3
// @description  sets videos max height such that full screen videos top/bottom doesn't get cut off
// @author       james.pike@agilecollab.ca
// @license      MIT
// @match        https://view.wyze.com/*
// @icon         https://wyze.com/media/favicon/stores/1/favicon-32x32.png
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/439074/Wyze%20Webview%20Improve%20Fullscreen.user.js
// @updateURL https://update.greasyfork.org/scripts/439074/Wyze%20Webview%20Improve%20Fullscreen.meta.js
// ==/UserScript==

(function() {
    'use strict';

const style = document.createElement("style");
    style.textContent = "video { max-height: calc(100vh - 80px); }";
    document.head.appendChild(style);

})();