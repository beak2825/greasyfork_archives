// ==UserScript==
// @name         Remove 'Posts on X' section from Google News
// @namespace    https://www.gptgames.dev/
// @version      1.3
// @description  Removes the 'Posts on X' section from Google News pages in multiple languages
// @author       Your Name
// @match        *://news.google.com/*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/482050/Remove%20%27Posts%20on%20X%27%20section%20from%20Google%20News.user.js
// @updateURL https://update.greasyfork.org/scripts/482050/Remove%20%27Posts%20on%20X%27%20section%20from%20Google%20News.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Translations for 'Posts on X' in different languages
    const translations = [
        'Posts auf X', // German
        '帖子在X上', // Mandarin
        'Posts en X', // Spanish
        'Posts on X', // English
        'X पर पोस्ट', // Hindi
        'X এ পোস্ট', // Bengali
        'منشورات على X', // Modern Standard Arabic
        'Publicações no X', // Portuguese
        'Посты на X', // Russian
        'Xでの投稿', // Japanese
        'X ਤੇ ਪੋਸਟਾਂ', // Western Punjabi
        'X वर पोस्ट', // Marathi
        'X پر اشاعتیں', // Urdu
    ];

    // Function to remove the 'Posts on X' section
    function removePostsOnX() {
        document.querySelectorAll('h3').forEach((section) => {
            translations.forEach((translation) => {
                if (section.textContent.includes(translation)) {
                    let parentSection = section.closest('c-wiz');
                    if (parentSection) {
                        parentSection.style.display = 'none';
                    }
                }
            });
        });
    }

    // Throttle function to improve performance
    let timer;
    function throttle(func, limit) {
        return function() {
            let context = this, args = arguments;
            if (!timer) {
                func.apply(context, args);
                timer = setTimeout(() => {
                    timer = undefined;
                }, limit);
            }
        };
    }

    // Observer for DOM changes
    let observer = new MutationObserver(throttle(removePostsOnX, 500));

    // Start observing
    observer.observe(document, { childList: true, subtree: true });

    // Initial execution on page load
    removePostsOnX();
})();
