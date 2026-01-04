// ==UserScript==
// @name         Microsoft 365 Copilot UI Adjuster
// @namespace    http://tampermonkey.net/
// @version      1.2.0
// @description  Adjusts the UI of Microsoft 365 Copilot by hiding the top bar for better visibility.
// @author       qianjunlang
// @match        *://copilot.cloud.microsoft/*
// @icon         https://res.cdn.office.net/officehub/images/content/images/favicon_copilot-4370172aa6.ico
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/530385/Microsoft%20365%20Copilot%20UI%20Adjuster.user.js
// @updateURL https://update.greasyfork.org/scripts/530385/Microsoft%20365%20Copilot%20UI%20Adjuster.meta.js
// ==/UserScript==


(function() {
    'use strict';

    const style = document.createElement('style');
    style.textContent = `
        #root {
            transform: translateY(-60px) !important;
            min-height: calc(100vh + 86px);
        }
    `;
    document.head.appendChild(style);


})();