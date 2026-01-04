// ==UserScript==
// @name         Chess.com Board Changer, Changes so it has notations! (CORS Fix)
// @namespace    http://tampermonkey.net/
// @version      v3.193.13.6-7
// @description  Replace Chess.com's 200.png with custom image *it has notations on it for white and black!*
// @description   Uppercase are for white lowercase Are for black!
// @author       NotYou
// @match        https://*.chess.com/*
// @grant        GM_xmlhttpRequest
// @grant        GM_addStyle
// @connect      cdn.discordapp.com
// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/533075/Chesscom%20Board%20Changer%2C%20Changes%20so%20it%20has%20notations%21%20%28CORS%20Fix%29.user.js
// @updateURL https://update.greasyfork.org/scripts/533075/Chesscom%20Board%20Changer%2C%20Changes%20so%20it%20has%20notations%21%20%28CORS%20Fix%29.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Your Discord image URL
    const discordImageUrl = 'https://i.imgur.com/zhMb2U4_d.webp?maxwidth=760&fidelity=grand';

    // We'll use a data URL to avoid CORS issues
    // This will be populated once we fetch and convert the image
    let dataUrl = '';

    // Fetch the image and convert it to a data URL to avoid CORS issues
    GM_xmlhttpRequest({
        method: 'GET',
        url: discordImageUrl,
        responseType: 'blob',
        onload: function(response) {
            const blob = response.response;
            const reader = new FileReader();
            reader.onloadend = function() {
                dataUrl = reader.result;
                console.log('Image converted to data URL');

                // Now apply the replacement with our data URL
                applyReplacement();
            };
            reader.readAsDataURL(blob);
        },
        onerror: function(error) {
            console.error('Failed to fetch image:', error);
        }
    });

    function applyReplacement() {
        // Add CSS to replace all instances of 200.png
        GM_addStyle(`
            /* Target background images */
            [style*="200.png"] {
                background-image: url('${dataUrl}') !important;
            }

            /* Target image elements */
            img[src*="200.png"] {
                content: url('${dataUrl}') !important;
            }
        `);

        // Replace existing images
        function replaceExistingImages() {
            // Skip if data URL is not ready yet
            if (!dataUrl) return;

            // Replace image src attributes
            document.querySelectorAll('img[src*="200.png"]').forEach(img => {
                img.src = dataUrl;
            });

            // Replace background images
            document.querySelectorAll('*').forEach(el => {
                const computedStyle = getComputedStyle(el);
                if (computedStyle.backgroundImage.includes('200.png')) {
                    el.style.backgroundImage = `url('${dataUrl}')`;
                }
            });
        }

        // Run once and then periodically
        replaceExistingImages();
        setInterval(replaceExistingImages, 2000);

        // Observe DOM changes
        const observer = new MutationObserver(replaceExistingImages);
        observer.observe(document.body || document.documentElement, {
            childList: true,
            subtree: true,
            attributes: true,
            attributeFilter: ['style', 'src']
        });

        console.log('Chess.com board replacement active with data URL');
    }
})();