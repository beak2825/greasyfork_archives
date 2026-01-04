// ==UserScript==
// @name         Zyn Warning Removals & Topbar Adjustments
// @namespace    http://tampermonkey.net/
// @version      0.6
// @description  Adjusts styles on Zyn site to remove warnings that take up 20% of the view.
// @author       sharmanhall
// @match        https://us.zyn.com/*
// @match        https://*.us.zyn.com/*
// @match        https://*.zyn.com/*
// @match        https://us.zyn.com/*
// @grant        none
// @icon         https://www.google.com/s2/favicons?sz=48&domain=zyn.com
// @run-at       document-start
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/494997/Zyn%20Warning%20Removals%20%20Topbar%20Adjustments.user.js
// @updateURL https://update.greasyfork.org/scripts/494997/Zyn%20Warning%20Removals%20%20Topbar%20Adjustments.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Inject CSS to force the warning to be hidden and the header to be at the top
    const style = document.createElement('style');
    style.textContent = `
        .has-warning .header {
            top: 0 !important;
        }
        .site-warning,
        .zynheader-warning,
        .zyn-header .zynheader-warning {
            display: none !important;
            visibility: hidden !important;
            z-index:-99999999 !important;
        }

        .site-warning {
        font-size: 0px !important;
        line-height: 0px !important;
        }
}
    `;
    document.head.appendChild(style);

    // MutationObserver to watch for dynamically added elements
    const observer = new MutationObserver(() => {
        document.querySelectorAll('.has-warning .header').forEach(element => {
            element.style.top = '0';
        });

        document.querySelectorAll('.site-warning, .zynheader-warning, .zyn-header .zynheader-warning').forEach(element => {
            element.style.display = 'none';
            element.style.setProperty('display', 'none', 'important');
            element.style.visibility = 'hidden';
            element.style.setProperty('visibility', 'hidden', 'important');
        });
    });

    // Observe the whole document for changes in the subtree and child elements
    observer.observe(document.body, { childList: true, subtree: true });
})();
