// ==UserScript==
// @name         The Wall Street Journal Reader Mode with Screenshot
// @namespace    http://tampermonkey.net/
// @version      1.2
// @description  reader mode for the Wall street journal, with screenshot functionality
// @author       Pika
// @match        *://*.wsj.com/*
// @match        *://wsj.com/*
// @grant        none
// @require      https://cdnjs.cloudflare.com/ajax/libs/html2canvas/1.4.1/html2canvas.min.js
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/508985/The%20Wall%20Street%20Journal%20Reader%20Mode%20with%20Screenshot.user.js
// @updateURL https://update.greasyfork.org/scripts/508985/The%20Wall%20Street%20Journal%20Reader%20Mode%20with%20Screenshot.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Function to hide specific elements and apply reader mode styles
    function enhanceReadingExperience() {
        // Hide specific divs
        const divs = document.querySelectorAll('div[aria-label="Most Popular News"]');
        const divb = document.querySelectorAll('div[aria-label="What to Read Next"]');
        const footerWrappers = document.querySelectorAll('.desktop.css-1md89ke-FooterWrapper.ei5oymj3');

        divs.forEach(div => div.style.display = 'none');
        divb.forEach(div => div.style.display = 'none');
        footerWrappers.forEach(footer => footer.style.display = 'none');

        // Hide other common unrelated elements (ads, related articles, etc.)
        const selectors = [
            '.ad-container',            // Example class for ads
            '.related-articles',        // Example class for related articles
            '.subscription-banner',     // Example class for subscription banners
            '#newsletter-signup',       // Example id for newsletter signups
            '.social-share-buttons',    // Example class for social share buttons
        ];

        selectors.forEach(selector => {
            const elements = document.querySelectorAll(selector);
            elements.forEach(el => el.style.display = 'none');
        });

        // Avoid adding duplicate styles
        if (!document.getElementById('wsj-reader-mode-style')) {
            // Apply CSS styles to center the main content with equal left and right margins
            const style = document.createElement('style');
            style.id = 'wsj-reader-mode-style';
            style.textContent = `
                body {
                    margin: 0;
                    padding: 0;
                    display: flex;
                    justify-content: center;
                    align-items: flex-start;
                    flex-direction: column;
                    max-width: 100%;
                    overflow-x: hidden;
                }
                .article-container.css-e98gkk.ejl518w17 {
                    max-width: 800px; /* Adjust the max width as needed */
                    margin-left: auto;
                    margin-right: auto;
                    padding: 20px;
                    box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
                    background-color: #fff;
                }
                @media (min-width: 1024px) {
                    .article-container.css-e98gkk.ejl518w17 {
                        padding-left: 60px;
                        padding-right: 40px;
                    }
                }
            `;
            document.head.appendChild(style);
        }
    }

    // Function to capture the article content as an image
    function captureArticleScreenshot() {
        const article = document.querySelector('.article-container.css-e98gkk.ejl518w17');
        const headline = document.querySelector('.css-1lvqw7f-StyledHeadline.e1ipbpvp0');
        let fileName = 'article_screenshot.png'; // Default file name

        if (headline) {
            // Use the headline text as the file name, replacing spaces with underscores and limiting the length
            fileName = headline.textContent.trim().replace(/\s+/g, '_').substring(0, 50) + '.png';
        }

        if (article) {
            html2canvas(article, { useCORS: true }).then(canvas => {
                // Convert canvas to image
                const img = canvas.toDataURL("image/png");
                // Create a download link
                const link = document.createElement('a');
                link.href = img;
                link.download = fileName; // Use dynamic file name
                link.click();
            });
        } else {
            alert('Article content not found!');
        }
    }

    // Add a screenshot button to the page
    function addScreenshotButton() {
        const button = document.createElement('button');
        button.textContent = '一键截图';
        button.style.position = 'fixed';
        button.style.bottom = '20px';
        button.style.right = '20px';
        button.style.zIndex = '1000';
        button.style.padding = '10px';
        button.style.backgroundColor = '#000000';
        button.style.color = '#fff';
        button.style.border = 'none';
        button.style.borderRadius = '5px';
        button.style.cursor = 'pointer';
        button.addEventListener('click', captureArticleScreenshot);
        document.body.appendChild(button);
    }

    // Run the function immediately
    enhanceReadingExperience();
    addScreenshotButton();

    // Optional: Observe changes in the DOM to apply styles and hide new elements dynamically
    const observer = new MutationObserver(enhanceReadingExperience);
    observer.observe(document.body, { childList: true, subtree: true });

})();