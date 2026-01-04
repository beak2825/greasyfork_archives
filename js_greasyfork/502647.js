// ==UserScript==
// @name         Anilist Auto Refresh on Session Expiry
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Refresh the page if session expired message appears and the page is focused
// @author       werapi
// @match        *://anilist.co/*
// @grant        none
// @license      GNU GPLv3
// @downloadURL https://update.greasyfork.org/scripts/502647/Anilist%20Auto%20Refresh%20on%20Session%20Expiry.user.js
// @updateURL https://update.greasyfork.org/scripts/502647/Anilist%20Auto%20Refresh%20on%20Session%20Expiry.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const elementSelector = 'div.el-message.el-message--error.is-closable';
    const textToFind = 'Session expired, please refresh';

    function checkForElement() {
        const elements = document.querySelectorAll(elementSelector);
        for (const element of elements) {
            if (element.textContent.includes(textToFind)) {
                if (document.hasFocus()) {
                    location.reload();
                }
                break;
            }
        }
    }
    
    // Observer to check when page changes
    const observer = new MutationObserver((mutations) => {
        for (const mutation of mutations) {
            if (mutation.type === 'childList' || mutation.type === 'subtree') {
                checkForElement();
            }
        }
    });

    observer.observe(document.body, {
        childList: true,
        subtree: true
    });

    // Initial check in case the element is already present
    checkForElement();

    // Add event listener to check when the page gains focus, as the observer will not trigger the refresh if not focussed as to not DOS the anilist servers.
    window.addEventListener('focus', checkForElement);
})();