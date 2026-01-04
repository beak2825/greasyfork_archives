// ==UserScript==
// @name        Majorgeeks gallery view
// @namespace   Violentmonkey Scripts
// @match       *://www.majorgeeks.com/*
// @grant       GM_addStyle
// @grant       GM_xmlhttpRequest
// @grant       unsafeWindow
// @grant       GM_openInTab
// @connect      self
// @version      1.0.2
// @author       Wizzergod
// @run-at       document-idle
// @inject-into  document-auto
// @license MIT
// @icon         https://www.google.com/s2/favicons?sz=64&domain=www.majorgeeks.com
// @description  Replace arrow images with actual thumbnails from the linked pages, and render in grid gallery links view and resize image when cursor on it.
// @downloadURL https://update.greasyfork.org/scripts/497721/Majorgeeks%20gallery%20view.user.js
// @updateURL https://update.greasyfork.org/scripts/497721/Majorgeeks%20gallery%20view.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Add custom styles for the images and layout
    GM_addStyle(`
        .geekytitle img.replacement {
            width: 190px;
            height: 190px;
            margin: 5px;
            transition: transform 0.4s, box-shadow 0.3s;
            box-shadow: 0px 0px 10px rgba(0, 0, 0, 0.5);
            cursor: pointer;
            border-radius: 6px;
        }
        .geekytitle img.replacement:hover {
            transform: scale(2.2);
            box-shadow: 0px 0px 20px rgba(0, 0, 0, 0.7);
            width: scale(2.2);
            height: scale(2.2);
            position: absolute;
            z-index: 100000;
        }
        .geekyinsidecontent {
            display: none;
        }
        .mainpage .geekycontent, .altmainpage .geekycontent {
            display: flex;
            flex-wrap: wrap;
            justify-content: space-evenly;
        }
        .geekytitle-container {
            display: flex;
            flex-wrap: wrap;
            justify-content: space-evenly;
        }
        .geekytitle {
            flex: 1 1 200px;
            box-sizing: border-box;
            margin: 0px;
            padding: 0px;
            border: 0px solid #ccc;
            background-color: #f9f9f9;
        }
    `);

    // Function to fetch the image URL from the detail page
    function fetchImageUrl(detailPageUrl, callback) {
        GM_xmlhttpRequest({
            method: 'GET',
            url: detailPageUrl,
            onload: function(response) {
                const parser = new DOMParser();
                const doc = parser.parseFromString(response.responseText, 'text/html');
                const img = doc.querySelector('div#gallery img');
                if (img) {
                    const imgUrl = img.src.replace(/&amp;/g, '&');
                    callback(imgUrl);
                } else {
                    callback(null);
                }
            }
        });
    }

    // Process geeky titles
    function processGeekyTitles() {
        const geekyTitles = document.querySelectorAll('.geekytitle');
        let pendingRequests = geekyTitles.length;

        geekyTitles.forEach((geekyTitle) => {
            const link = geekyTitle.querySelector('a[href^="files/details/"]');
            if (link) {
                const detailPageUrl = link.href;

                // Fetch the image URL from the detail page
                fetchImageUrl(detailPageUrl, (imgUrl) => {
                    if (imgUrl) {
                        const img = document.createElement('img');
                        img.classList.add('replacement');
                        img.src = imgUrl;
                        img.dataset.srcHover = imgUrl.replace('action=thumb', 'action=file');

                        // Add event listener for hover effect
                        img.addEventListener('mouseenter', function() {
                            this.src = this.dataset.srcHover;
                        });
                        img.addEventListener('mouseleave', function() {
                            this.src = imgUrl;
                        });

                        // Replace geekyTitle content with the new image
                        geekyTitle.innerHTML = ''; // Clear previous content
                        const newLink = document.createElement('a');
                        newLink.href = detailPageUrl;
                        newLink.appendChild(img);
                        newLink.appendChild(document.createTextNode(link.textContent));
                        geekyTitle.appendChild(newLink);
                    }
                    pendingRequests--;

                    // If all requests are done, reprocess if needed
                    if (pendingRequests === 0) {
                        setTimeout(processGeekyTitles, 300); // Retry after a delay
                    }
                });
            }
        });
    }

    // Initial processing of geeky titles
    processGeekyTitles();
})();
