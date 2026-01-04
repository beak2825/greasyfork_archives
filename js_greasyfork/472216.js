// ==UserScript==
// @name         Auto Disable xLog Dark Mode
// @namespace    xlog-auto-disable-dark-mode
// @icon         https://xlog.app/assets/logo.svg
// @version      0.2
// @description  Automatically switch to Light Mode on any xLog blog site
// @author       Bryan
// @match        https://*/*
// @grant        none
// @run-at       document-end
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/472216/Auto%20Disable%20xLog%20Dark%20Mode.user.js
// @updateURL https://update.greasyfork.org/scripts/472216/Auto%20Disable%20xLog%20Dark%20Mode.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const isXLog = !!document.head.querySelector("[content=xLog]");
    if (!isXLog) return;

    const oldLocalStorage = localStorage.getItem('darkMode');
    if (oldLocalStorage !== 'light') {
        localStorage.setItem('darkMode', 'light')
    }
})();