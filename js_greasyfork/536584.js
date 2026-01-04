// ==UserScript==
// @name         Scroll to Nearest Paragraph (← → keys) - No Skips
// @namespace    http://tampermonkey.net/
// @version      1.8
// @description  Scroll to nearest paragraph using ← and → keys, never skips paragraphs
// @author       Işık Barış Fidaner + ChatGPT Fix
// @match        *://zizekanalysis.wordpress.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/536584/Scroll%20to%20Nearest%20Paragraph%20%28%E2%86%90%20%E2%86%92%20keys%29%20-%20No%20Skips.user.js
// @updateURL https://update.greasyfork.org/scripts/536584/Scroll%20to%20Nearest%20Paragraph%20%28%E2%86%90%20%E2%86%92%20keys%29%20-%20No%20Skips.meta.js
// ==/UserScript==

(function () {
    'use strict';

    let paragraphs = [];
    let current = 0;
    let initialized = false;
    const offset = 50;

    function init() {
        paragraphs = Array.from(document.querySelectorAll('p'))
            .filter(p => p.offsetHeight > 0 && p.offsetParent !== null);
        setInitialIndex();
        initialized = true;
    }

    function setInitialIndex() {
        // Find the paragraph closest (but not below) current scroll position
        const viewportTop = window.scrollY;
        let found = false;
        for (let i = 0; i < paragraphs.length; i++) {
            const rect = paragraphs[i].getBoundingClientRect();
            const paragraphTop = window.scrollY + rect.top - offset;
            if (paragraphTop >= viewportTop - 1) {
                current = i;
                found = true;
                break;
            }
        }
        if (!found) current = paragraphs.length - 1;
    }

    function scrollToParagraph(index) {
        if (index >= 0 && index < paragraphs.length) {
            const rect = paragraphs[index].getBoundingClientRect();
            const scrollY = window.scrollY + rect.top - offset;
            window.scrollTo({
                top: Math.max(scrollY, 0),
                behavior: 'smooth'
            });
            current = index;
        }
    }

    // Only update index after a manual scroll, *not* after script scroll
    let manualScroll = true;
    let scrollTimeout;
    window.addEventListener('scroll', () => {
        if (!initialized) init();
        if (manualScroll) {
            clearTimeout(scrollTimeout);
            scrollTimeout = setTimeout(() => {
                setInitialIndex();
            }, 100);
        }
        manualScroll = true;
    });

    document.addEventListener('keydown', (e) => {
        // Ignore keypresses in input fields or editable areas
        const target = e.target;
        if (
            target.tagName === 'INPUT' ||
            target.tagName === 'TEXTAREA' ||
            target.isContentEditable
        ) {
            return;
        }

        if (!initialized) init();

        if (e.key === 'ArrowRight') {
            e.preventDefault();
            if (current < paragraphs.length - 1) {
                manualScroll = false;
                scrollToParagraph(current + 1);
            }
        } else if (e.key === 'ArrowLeft') {
            e.preventDefault();
            if (current > 0) {
                manualScroll = false;
                scrollToParagraph(current - 1);
            }
        } else if (e.key === 'ArrowUp' || e.key === 'ArrowDown') {
            setTimeout(() => setInitialIndex(), 0);
        }
    });
})();
