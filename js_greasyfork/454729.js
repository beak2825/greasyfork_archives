// ==UserScript==
// @name         Disable Google Docs save icon
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Hides the Saving icon/text at the top of Google Docs pages, which can be a bit distracting while you're writing.
// @license      MIT
// @match        https://docs.google.com/document/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=google.com
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/454729/Disable%20Google%20Docs%20save%20icon.user.js
// @updateURL https://update.greasyfork.org/scripts/454729/Disable%20Google%20Docs%20save%20icon.meta.js
// ==/UserScript==


(function() {
    'use strict';
    const style = document.createElement('style');
    style.type = 'text/css';
    style.innerText = '.docs-save-indicator-badge{display:none;}';
    document.head.appendChild(style);
})();