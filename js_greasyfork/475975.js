// ==UserScript==
// @name         Twitter Dark Scrollbar
// @description  Sets scrollbar color to dark on Twitter.
// @version      1.0
// @author       yungsamd17
// @namespace    https://github.com/yungsamd17/UserScripts
// @license      MIT License
// @match        https://twitter.com/*
// @match        https://x.com/*
// @grant        GM_addStyle
// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/475975/Twitter%20Dark%20Scrollbar.user.js
// @updateURL https://update.greasyfork.org/scripts/475975/Twitter%20Dark%20Scrollbar.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const darkModeCSS = `
        :root {
            color-scheme: dark;
        }
    `;

    GM_addStyle(darkModeCSS);
})();
