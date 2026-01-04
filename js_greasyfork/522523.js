// ==UserScript==
// @name         Remove Mobalytics Become a Creator Banner
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Remove the 'Become a Creator' banner on Mobalytics.
// @author       Anonymous
// @match        https://mobalytics.gg/*
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/522523/Remove%20Mobalytics%20Become%20a%20Creator%20Banner.user.js
// @updateURL https://update.greasyfork.org/scripts/522523/Remove%20Mobalytics%20Become%20a%20Creator%20Banner.meta.js
// ==/UserScript==

(function() {
    'use strict';

    function removeBanner() {
        const sections = document.querySelectorAll('section');
        if (sections.length > 0) {
            sections.forEach(sec => {
                const text1 = sec.querySelector('p')?.textContent.trim();
                const button = sec.querySelector('button')?.textContent.trim();

                if (
                    text1 === 'Become a Creator' &&
                    button === 'Join Creator Program'
                ) {
                    // Remove the entire section
                    sec.remove();
                }
            });
        }
    }

    window.addEventListener('load', () => {
        removeBanner();
        const observer = new MutationObserver(removeBanner);
        observer.observe(document.body, { childList: true, subtree: true });
    });
})();
