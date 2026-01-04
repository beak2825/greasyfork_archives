// ==UserScript==
// @name         AppDoze Download Wait Bypass
// @namespace    https://leaked.tools
// @version      1.0
// @description  Injects CSS to bypass wait time for downloads on appdoze.com
// @author       Sango
// @match        *://*.appdoze.com/*
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/518740/AppDoze%20Download%20Wait%20Bypass.user.js
// @updateURL https://update.greasyfork.org/scripts/518740/AppDoze%20Download%20Wait%20Bypass.meta.js
// ==/UserScript==

(function () {
    'use strict';
    const style = document.createElement('style');
    style.type = 'text/css';
    style.textContent = `
        .show_download_links {
            display: block !important;
        }
        .bx-download .spinvt {
            display: none !important;
        }
    `;
    document.head.appendChild(style);
})();
