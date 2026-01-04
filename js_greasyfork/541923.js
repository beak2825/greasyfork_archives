// ==UserScript==
// @name         Remove Ad and Scroll to Top
// @namespace    http://tampermonkey.net/
// @version      1.0
// @author       Shahin
// @match        https://twitter.com/*
// @match        https://x.com/*
// @match        https://mobile.twitter.com/*
// @license      MIT
// @icon         https://www.google.com/s2/favicons?sz=64&domain=x.com
// @grant        none
// @description  I wrote a simple script for scrolling to the top that activates on Twitter (X) and I put it in Tampermonkey. I also included a piece that hides ads.
// @downloadURL https://update.greasyfork.org/scripts/541923/Remove%20Ad%20and%20Scroll%20to%20Top.user.js
// @updateURL https://update.greasyfork.org/scripts/541923/Remove%20Ad%20and%20Scroll%20to%20Top.meta.js
// ==/UserScript==

(function() {
    'use strict';
    const hideAds = () => {
        const articleTags = document.getElementsByTagName('article');
        for (const articleTag of articleTags) {
            // Check if the article contains a <span> with the exact text "Ad"
            const adSpan = Array.from(articleTag.getElementsByTagName('span')).find(span => span.textContent.trim() === 'Ad');
            if (adSpan) {
                articleTag.style.opacity = '0';
                articleTag.style.setProperty('height', '10px', 'important');
            }
        }
    };
    hideAds();
    setInterval(hideAds, 2000);
})();




(function () {
    'use strict';

    // Wait for the DOM to fully load
    window.addEventListener('load', () => {
        // Add an ID to the <body> element
        const bodyElement = document.body;
        bodyElement.id = 'page-body'; // Set the ID to "page-body"

        // Create a "Scroll to Top" button
        const scrollToTopButton = document.createElement('button');
        scrollToTopButton.style.position = 'fixed';
        scrollToTopButton.style.bottom = '20px';
        scrollToTopButton.style.left = '20px';
        scrollToTopButton.style.zIndex = '9999';
        scrollToTopButton.style.padding = '10px';
        scrollToTopButton.style.backgroundColor = '#1d1d1d';
        scrollToTopButton.style.border = 'none';
        scrollToTopButton.style.borderRadius = '50%';
        scrollToTopButton.style.cursor = 'pointer';
        scrollToTopButton.style.display = 'none'; // Initially hidden
        scrollToTopButton.style.width = '50px';
        scrollToTopButton.style.height = '50px';
        scrollToTopButton.style.display = 'flex';
        scrollToTopButton.style.alignItems = 'center';
        scrollToTopButton.style.justifyContent = 'center';

        // Add the SVG icon to the button
        scrollToTopButton.innerHTML = `
            <svg xmlns="http://www.w3.org/2000/svg" id="Outline" viewBox="0 0 24 24" width="24" height="24">
                <path d="M17.71,9.88l-4.3-4.29a2,2,0,0,0-2.82,0L6.29,9.88a1,1,0,0,0,0,1.41,1,1,0,0,0,1.42,0L11,8V19a1,1,0,0,0,2,0V8l3.29,3.29a1,1,0,1,0,1.42-1.41Z" fill="#fff"/>
            </svg>
        `;

        // Append the button to the body
        document.body.appendChild(scrollToTopButton);

        // Show the button when the user scrolls down
        window.addEventListener('scroll', () => {
            if (window.scrollY > 300) {
                scrollToTopButton.style.display = 'flex'; // Show button
            } else {
                scrollToTopButton.style.display = 'none'; // Hide button
            }
        });

        // Add click event listener to scroll to the top
        scrollToTopButton.addEventListener('click', () => {
            bodyElement.scrollIntoView({
                behavior: 'smooth', // Smooth scrolling effect
                block: 'start' // Scroll to the top
            });
        });
    });
})();
