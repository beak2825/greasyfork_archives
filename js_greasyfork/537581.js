// ==UserScript==
// @name         IPinfo Host.io Link Cleaner
// @namespace    http://tampermonkey.net/
// @version      1
// @description  Replaces host.io links with direct URLs on ipinfo.io pages.
// @author       nyuuzyou
// @license      CC0
// @match        https://ipinfo.io/*
// @grant        none
// @run-at       document-idle
// @downloadURL https://update.greasyfork.org/scripts/537581/IPinfo%20Hostio%20Link%20Cleaner.user.js
// @updateURL https://update.greasyfork.org/scripts/537581/IPinfo%20Hostio%20Link%20Cleaner.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const hostIoPrefix = "https://host.io/";

    function cleanLinks() {
        const links = document.querySelectorAll(`a[href^="${hostIoPrefix}"]`);

        links.forEach(link => {
            const oldHref = link.href;
            const targetDomainAndPath = oldHref.substring(hostIoPrefix.length);

            if (targetDomainAndPath) {
                const newHref = "https://" + targetDomainAndPath;
                link.href = newHref;
                const linkText = link.textContent.trim();
                if (linkText.startsWith("host.io/") && linkText.endsWith(targetDomainAndPath)) {
                    link.textContent = targetDomainAndPath;
                } else if (linkText === oldHref) {
                    link.textContent = newHref;
                }
            }
        });

    }

    cleanLinks();

    const observer = new MutationObserver((mutationsList, observer) => {
        for (const mutation of mutationsList) {
            if (mutation.type === 'childList' && mutation.addedNodes.length > 0) {
                // Check if any new links were added that need cleaning
                let newLinksFound = false;
                mutation.addedNodes.forEach(node => {
                    if (node.nodeType === Node.ELEMENT_NODE) { // Check if it's an element
                        if (node.matches(`a[href^="${hostIoPrefix}"]`) || node.querySelector(`a[href^="${hostIoPrefix}"]`)) {
                            newLinksFound = true;
                        }
                    }
                });
                if (newLinksFound) {
                    cleanLinks();
                    break;
                }
            }
        }
    });

    observer.observe(document.body, { childList: true, subtree: true });

})();