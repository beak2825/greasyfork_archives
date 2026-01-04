// ==UserScript==
// @name         Softarchive - Udemy Course Image Fetcher with Debugging
// @namespace    https://greasyfork.org/en/users/807108-jeremy-r
// @run-at       document-end
// @author       JRem
// @version      1.1
// @description  Automatically fetch and display Udemy course images below links on softarchive.is video courses pages, with debug info.
// @match        https://softarchive.is/video-courses/*
// @grant        GM_xmlhttpRequest
// @connect      udemy.com
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/540464/Softarchive%20-%20Udemy%20Course%20Image%20Fetcher%20with%20Debugging.user.js
// @updateURL https://update.greasyfork.org/scripts/540464/Softarchive%20-%20Udemy%20Course%20Image%20Fetcher%20with%20Debugging.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Function to process all Udemy links
    function processUdemyLinks() {
        const links = document.querySelectorAll('a[href*="udemy.com/course/"]');
        console.log(`Found ${links.length} Udemy links.`);

        links.forEach(link => {
            if (link.dataset.processed) {
                console.log('Skipping already processed link:', link.href);
                return; // avoid duplicates
            }
            link.dataset.processed = 'true';

            // Fetch the Udemy page using GM_xmlhttpRequest
            console.log('Fetching Udemy page:', link.href);
            GM_xmlhttpRequest({
                method: 'GET',
                url: link.href,
                headers: { 'User-Agent': 'Mozilla/5.0' },
                onload: function(response) {
                    if (response.status >= 200 && response.status < 300) {
                        console.log('Successfully fetched:', link.href);
                        const parser = new DOMParser();
                        const doc = parser.parseFromString(response.responseText, 'text/html');

                        // Find the first <button> element; attempt to locate the <img> inside it
                        const courseButton = doc.querySelector('button[type="button"]');
                        if (courseButton) {
                            const img = courseButton.querySelector('img');
                            if (img) {
                                const imgSrc = img.src;
                                console.log('Found image src:', imgSrc);

                                // Check if image already exists below link to avoid duplicates
                                if (link.nextSibling && link.nextSibling.tagName === 'IMG') {
                                    console.log('Image already exists below link:', link.href);
                                    return;
                                }

                                // Insert the image below the link
                                const imgElem = document.createElement('img');
                                imgElem.src = imgSrc;
                                imgElem.style.maxWidth = '300px';
                                imgElem.style.display = 'block';
                                link.parentNode.insertBefore(imgElem, link.nextSibling);
                                console.log('Image inserted below:', link.href);
                            } else {
                                console.warn('No <img> inside the course button for:', link.href);
                                // Optional: create a placeholder or message
                                // const msg = document.createElement('div');
                                // msg.textContent = 'Image not found on Udemy page.';
                                // link.parentNode.insertBefore(msg, link.nextSibling);
                            }
                        } else {
                            console.warn('Unable to find course button on Udemy page:', link.href);
                        }
                    } else {
                        console.error('Failed to fetch Udemy page (status:', response.status, '):', link.href);
                    }
                },
                onerror: function() {
                    console.error('Error fetching Udemy page (possible CORS or network issue):', link.href);
                }
            });
        });
    }

    // Run after page load
    window.addEventListener('load', () => {
        console.log('Processing Udemy links...');
        processUdemyLinks();

        // Observe DOM mutations for dynamically added links
        const observer = new MutationObserver(() => {
            console.log('DOM changed, re-processing links...');
            processUdemyLinks();
        });
        observer.observe(document.body, { childList: true, subtree: true });
    });
})();