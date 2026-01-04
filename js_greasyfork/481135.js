// ==UserScript==
// @name         Morioh - Removes the adblock detector on site morioh
// @namespace    https://morioh.com/
// @version      0.2
// @description  Remove all Ad block detectors
// @author       TheSnegok
// @match        https://morioh.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=morioh.com
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/481135/Morioh%20-%20Removes%20the%20adblock%20detector%20on%20site%20morioh.user.js
// @updateURL https://update.greasyfork.org/scripts/481135/Morioh%20-%20Removes%20the%20adblock%20detector%20on%20site%20morioh.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const html = document.querySelector('html');
    const observer = new MutationObserver(() => {
        for (const element of document.body.querySelectorAll("*")) {
            const zIndex = window.getComputedStyle(element).zIndex;

            const onlyNumbers = zIndex.match(/[0-9]/);
            if (onlyNumbers !== null && zIndex >= 9) {
                element.style.display = 'none';
                html.style.overflow = 'auto';
                document.body.style.overflow = 'auto';
            }
        }
    });
    observer.observe(document.body, { attributes: true, childList: true, subtree: true });
})();