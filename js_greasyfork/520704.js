// ==UserScript==
// @name           Dark and mobile MobileRead.com
// @name:pl        Ciemny i mobilny MobileRead.com
// @description    Dark theme and mobile mode for mobileread.com!
// @description:pl Ciemny motyw i tryb mobilny dla mobileread.com!
// @author         juliazero
// @license        GPL-3.0-only
// @version        5.1.2
// @match          https://www.mobileread.com/*
// @namespace      mobileread.com
// @resource       IMPORTED_CSS https://userstyles.world/api/style/13484.user.css?v=5.1.2
// @grant          GM_getResourceText
// @grant          GM_addStyle
// @run-at         document-body
// @downloadURL https://update.greasyfork.org/scripts/520704/Dark%20and%20mobile%20MobileReadcom.user.js
// @updateURL https://update.greasyfork.org/scripts/520704/Dark%20and%20mobile%20MobileReadcom.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Load and inject CSS as a <style> element
    let css = GM_getResourceText("IMPORTED_CSS");
    // Remove the @-moz-document wrapper, but keep the inner contents
    css = css.replace(/@-moz-document\s+domain\([^)]+\)\s*\{([\s\S]*?)\}\s*$/, '$1');
    GM_addStyle(css);

    // Add viewport meta tag for better mobile support
    const metaElement = document.createElement('meta');
    metaElement.name = 'viewport';
    metaElement.content = 'width=device-width, initial-scale=1.0, minimum-scale=0.5, maximum-scale=2.0, user-scalable=yes';
    document.head.appendChild(metaElement);

    // Remove " First" and "Last " from pagination links
    function cleanPaginationText() {
        document.querySelectorAll('a.smallfont').forEach(a => {
            for (let node of a.childNodes) {
                if (node.nodeType === Node.TEXT_NODE) {
                    node.textContent = node.textContent.replace(" First", "").replace("Last ", "");
                }
            }
        });
    }
    cleanPaginationText();
    const observer = new MutationObserver(cleanPaginationText);
    observer.observe(document.body, { childList: true, subtree: true });
})();