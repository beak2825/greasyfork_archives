// ==UserScript==
// @name         grok padding
// @description  a
// @match        *://grok.com/*
// @version 0.0.1.20250621072738
// @namespace https://greasyfork.org/users/1435046
// @downloadURL https://update.greasyfork.org/scripts/540105/grok%20padding.user.js
// @updateURL https://update.greasyfork.org/scripts/540105/grok%20padding.meta.js
// ==/UserScript==

(function () {
    'use strict';

    function applyRedBorder() {
        const container = document.querySelector('[class~="@container/main"]');
        if (container) {
            const firstDiv = Array.from(container.children).find(el => el.tagName === 'DIV');
            if (firstDiv) {
                firstDiv.style.setProperty('padding-left', 'unset', 'important');
                firstDiv.style.setProperty('padding-right', 'unset', 'important');

            }
        }
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', applyRedBorder);
    } else {
        applyRedBorder();
    }

    const observer = new MutationObserver(() => {
        applyRedBorder();
    });

    observer.observe(document.body, {
        childList: true,
        subtree: true
    });
})();
