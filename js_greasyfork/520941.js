// ==UserScript==
// @name         Buttons Modifier for ios.codevn.net
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Always shows scroll-to-top button and adds a new scroll-to-download button
// @author       Aligator
// @match        https://ios.codevn.net/*
// @grant        none
// @license      GNU GPLv3
// @downloadURL https://update.greasyfork.org/scripts/520941/Buttons%20Modifier%20for%20ioscodevnnet.user.js
// @updateURL https://update.greasyfork.org/scripts/520941/Buttons%20Modifier%20for%20ioscodevnnet.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Modify existing top button
    const existingTopBtn = document.querySelector('#top-btn');
    if (existingTopBtn) {
        existingTopBtn.style.opacity = '1';
        existingTopBtn.style.bottom = '4.4rem';
        existingTopBtn.style.visibility = 'visible';
    }

    // Create new scroll-to-download button
    const newBtn = document.createElement('a');
    newBtn.href = 'javascript:void(0);';
    newBtn.className = 'bottom-btn hidden-sm-down';
    newBtn.id = 'top-btn';
    newBtn.innerHTML = '<i aria-hidden="true" class="fa fa-arrow-up"></i>';
    newBtn.style.opacity = '1';
    newBtn.style.bottom = '0.9rem';
    newBtn.style.visibility = 'visible';
    newBtn.style.rotate = '180deg';

    // Add click event to scroll to download section
    newBtn.addEventListener('click', function() {
        const downloadSection = document.getElementById('download');
        if (downloadSection) {
            const downloadBottom = downloadSection.getBoundingClientRect().bottom;
            const windowHeight = window.innerHeight;
            const scrollTo = window.pageYOffset + downloadBottom - windowHeight;
            window.scrollTo({
                top: scrollTo,
                behavior: 'smooth'
            });
        }
    });

    // Insert the new button after the existing top button
    if (existingTopBtn) {
        existingTopBtn.parentNode.insertBefore(newBtn, existingTopBtn.nextSibling);
    }
})();
