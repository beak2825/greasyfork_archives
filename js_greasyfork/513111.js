// ==UserScript==
// @name         Stop Scrolling Instagram
// @namespace    http://tampermonkey.net/
// @version      1.3
// @description  Simple script to prevent scrolling beyond "You've completely caught up" element and hide suggested posts reliably.
// @author       Ulysses
// @match        https://www.instagram.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=instagram.com
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/513111/Stop%20Scrolling%20Instagram.user.js
// @updateURL https://update.greasyfork.org/scripts/513111/Stop%20Scrolling%20Instagram.meta.js
// ==/UserScript==

(function () {
    'use strict';

    function hideElement(selector) {
        const elements = document.querySelectorAll(selector);
        elements.forEach(el => el.style.display = 'none');
    }

    function hideSpecificElements() {
        // Mobile selectors
        hideElement("div:nth-of-type(3) > .x1qrby5j.x7ja8zs ..."); // Keep your original selectors
        hideElement("div.x1nhvcw1.x1oa3qoh.x1qjc9v5...");
        hideElement(".xl56j7k.x1oa3qoh.x6s0dn4...");
        // Desktop selectors
        hideElement("div:nth-of-type(4) > .x1qrby5j.x7ja8zs ...");
        hideElement("div:nth-of-type(4) > .x1qrby5j.x7ja8zs ... > .x1n2onr6");
    }

    // --- Updated method: Find "You've completely caught up" by text ---
    function findCaughtUpElement() {
        const textMatch = "You've completely caught up";
        const spans = document.querySelectorAll('span');
        for (const span of spans) {
            if (span.textContent.trim().includes(textMatch)) {
                return span.closest('div.xvbhtw8') || span.parentElement;
            }
        }
        return null;
    }

    function disableScroll(target) {
        target.style.marginBottom = '900px';

        window.onscroll = function () {
            const rect = target.getBoundingClientRect();
            if (rect.bottom < window.innerHeight) {
                const scrollTop = window.scrollY;
                const limit = rect.bottom + scrollTop - window.innerHeight;
                window.scrollTo(0, limit);
            }
        };
    }

    function enableScroll() {
        window.onscroll = function () {};
    }

    function stopAtCaughtUp() {
        const element = findCaughtUpElement();
        if (element) {
            disableScroll(element);
        } else {
            enableScroll();
        }
    }

    // Observe DOM changes for dynamic loading
    const observer = new MutationObserver(() => {
        stopAtCaughtUp();
        hideSpecificElements();
    });

    observer.observe(document.body, { childList: true, subtree: true });

    // Initial run
    stopAtCaughtUp();
    hideSpecificElements();
})();
