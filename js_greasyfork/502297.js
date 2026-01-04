// ==UserScript==
// @name         4chan Thumbnail Grid Generator
// @license      GNU GPLv3
// @namespace    later
// @version      1
// @description  Generate a page with all images from every thread on current board page
// @match        https://boards.4chan.org/*
// @grant        GM_xmlhttpRequest
// @grant        GM_openInTab
// @require      https://cdnjs.cloudflare.com/ajax/libs/jquery/3.6.0/jquery.min.js
// @downloadURL https://update.greasyfork.org/scripts/502297/4chan%20Thumbnail%20Grid%20Generator.user.js
// @updateURL https://update.greasyfork.org/scripts/502297/4chan%20Thumbnail%20Grid%20Generator.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Add a button to the page
    const button = $('<button>')
        .text('Generate Thumbnails')
        .css({
            'position': 'fixed',
            'bottom': '10px',
            'right': '10px',
            'z-index': '1000'
        })
        .on('click', async function() {
            console.log('Button clicked');
            $(this).text('Generating...'); // Feedback during processing

            // Get the current page URL
            const currentPageUrl = window.location.href;
            console.log('Current page URL:', currentPageUrl);

            const threadUrls = [];
            $('a.replylink').each(function() {
                const href = $(this).attr('href');
                console.log('Found thread URL:', href);
                threadUrls.push(href);
            });

            const fetchThumbnails = (url) => {
                console.log('Fetching thumbnails from:', url);
                return new Promise((resolve) => {
                    GM_xmlhttpRequest({
                        method: 'GET',
                        url: url,
                        onload: function(response) {
                            console.log('Response received from:', url);
                            const doc = new DOMParser().parseFromString(response.responseText, 'text/html');
                            const thumbnails = [];
                            console.log('HTML Content:', response.responseText); // Log raw HTML content
                            doc.querySelectorAll('a.fileThumb').forEach(a => {
                                const fullImageUrl = a.getAttribute('href');
                                const thumbnailUrl = a.querySelector('img').getAttribute('src');
                                thumbnails.push([thumbnailUrl, fullImageUrl]);
                                console.log('Thumbnail found:', thumbnailUrl, fullImageUrl);
                            });
                            console.log('Thumbnails:', thumbnails); // Log thumbnails array
                            resolve(thumbnails);
                        },
                        onerror: function() {
                            console.error('Failed to fetch thread:', url);
                            alert('Failed to fetch thread: ' + url);
                            resolve([]); // Resolve with empty array on error
                        }
                    });
                });
            };

            const generateHtml = (thumbnails) => {
              console.log('Generating HTML...');
              let html = "<html><body><h1>4chan Thumbnails</h1><div style='display: flex; flex-wrap: wrap;'>";
              thumbnails.forEach(([thumb, fullImage]) => {
                  // Ensure URLs are absolute
                  const absoluteThumb = thumb.startsWith('//') ? 'https:' + thumb : thumb;
                  const absoluteFullImage = fullImage.startsWith('//') ? 'https:' + fullImage : fullImage;

                  html += `<div style='margin: 5px;'><a href='${absoluteFullImage}' target='_blank'><img src='${absoluteThumb}' style='width: 150px; height: auto;'></a></div>`;
              });
              html += "</div></body></html>";
              console.log('Generated HTML:', html); // Log generated HTML
                const blob = new Blob([html], { type: 'text/html' });
                const url = URL.createObjectURL(blob);
                console.log('Generated HTML Blob URL:', url);

                // Fallback method: Create a temporary link and click it
                try {
                    const link = document.createElement('a');
                    link.href = url;
                    link.target = '_blank';
                    link.click();
                    console.log('HTML opened in new tab via fallback method');
                } catch (error) {
                    console.error('Error opening HTML:', error);
                }

                $(button).text('Generated!'); // Feedback after completion
            };

            try {
                const allThumbnails = [];
                for (const threadUrl of threadUrls) {
                    const fullUrl = new URL(threadUrl, currentPageUrl).href; // Resolve relative URLs
                    const thumbnails = await fetchThumbnails(fullUrl);
                    allThumbnails.push(...thumbnails);
                }
                console.log('All thumbnails:', allThumbnails); // Log all thumbnails
                generateHtml(allThumbnails);
            } catch (error) {
                console.error('Error:', error);
                $(button).text('Error'); // Feedback on error
            }
        });

    $('body').append(button);
})();
