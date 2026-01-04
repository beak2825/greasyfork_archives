// ==UserScript==
// @name         Force Link Open in New
// @name:zh-CN   强制新标签页打开链接
// @namespace    http://tampermonkey.net/
// @version      0.3
// @description  Opens all web links in new tabs, enhancing browsing efficiency and preventing loss of work progress.
// @description:zh-CN  让所有网页链接都在新标签页中打开，提升浏览效率。
// @author       Yearly
// @license      AGPL-v3.0
// @match        *://*/*
// @exclude      *://*.greasyfork.org/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/498929/Force%20Link%20Open%20in%20New.user.js
// @updateURL https://update.greasyfork.org/scripts/498929/Force%20Link%20Open%20in%20New.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Capture all click events and open links in a new tab
    document.addEventListener('click', function(event) {
        let anchor = event.target.closest('a');
        if (anchor && anchor.href) {
            event.preventDefault();
            window.open(anchor.href, '_blank');
        }
    }, true);

    // Override window.open method to open URLs in a new tab
    const originalOpen = window.open;
    window.open = function(url, target = '_blank', features) {
        if (['_self', '_parent', '_top'].includes(target)) {
            target = '_blank';
        }
        return originalOpen.call(window, url, target, features);
    };

})();