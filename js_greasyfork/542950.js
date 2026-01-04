// ==UserScript==
// @name         Grok Sidebar Time Header Tweak
// @namespace    http://tampermonkey.net/
// @version      0.1.1
// @description  Bold & Center those time-header divs on grok for better readability when using theme userscripts. Only tested on the history section.
// @author       Setnour6
// @match        https://grok.com/*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/542950/Grok%20Sidebar%20Time%20Header%20Tweak.user.js
// @updateURL https://update.greasyfork.org/scripts/542950/Grok%20Sidebar%20Time%20Header%20Tweak.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const css = `
    div.py-1.pl-3.text-xs.sticky.top-0.z-20.text-nowrap {
        font-weight: bold !important;
        text-align: center !important;
    }
    `;
    const style = document.createElement('style');
    style.type = 'text/css';
    style.textContent = css;
    document.head.appendChild(style);
})();