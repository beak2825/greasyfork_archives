// ==UserScript==
// @name         Infinite Scroll
// @namespace    http://tampermonkey.net/
// @version      1.1
// @description  Load nhentai gallery images vertically with API + fallback extension support, fixed fallback logic
// @author       Duc Anh
// @match        https://nhentai.net/g/*/
// @require      https://code.jquery.com/jquery-3.5.1.min.js
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/543232/Infinite%20Scroll.user.js
// @updateURL https://update.greasyfork.org/scripts/543232/Infinite%20Scroll.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const bigcontainer = $('.thumbs');
    if (!bigcontainer.length) return;

    function getBaseURL() {
        let start = "https://i";
        let maxI = 4;
        let randomI = Math.floor(Math.random() * maxI) + 1;
        let end = ".nhentai.net/galleries/";
        return start + randomI + end;
    }

    let id = location.pathname.split("/")[2];
    fetch("https://nhentai.net/api/gallery/" + id)
        .then(response => {
            if (!response.ok) {
                throw new Error("Could not get page's data!");
            }
            return response.json();
        })
        .then(jsonData => {
            let mediaCode = jsonData.media_id;
            let numPages = jsonData.num_pages;

            let baseUrl = getBaseURL() + mediaCode + "/";

            // Clear old grid
            bigcontainer.empty();
            bigcontainer.css({
                'display': 'flex',
                'flex-direction': 'column',
                'align-items': 'center',
                'gap': '20px',
                'padding': '20px',
                'background': '#111'
            });

            // Insert images one by one
            for (let i = 1; i <= numPages; i++) {
                let img = document.createElement('img');

                let fallbacks = [
                    baseUrl + i + ".webp",
                    baseUrl + i + ".jpg",
                    baseUrl + i + ".png",
                    baseUrl + i + ".gif"
                ];

                let fallbackIndex = 0;

                img.onerror = function() {
                    fallbackIndex++;
                    if (fallbackIndex < fallbacks.length) {
                        this.src = fallbacks[fallbackIndex];
                    }
                };

                // Append BEFORE setting src to ensure it shows even if first fails
                bigcontainer.append(img);

                // Set the initial src AFTER appending and onerror
                img.src = fallbacks[fallbackIndex];

                img.style.maxWidth = '90%';
                img.style.boxShadow = '0 0 10px rgba(0,0,0,0.5)';
                img.loading = 'lazy';
            }
        })
        .catch(error => {
            console.error("nHentai Vertical Scroll: ", error);
        });
})();
