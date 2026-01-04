// ==UserScript==
// @name         NHentai Infinite Scroll (All Mirrors)
// @namespace    http://tampermonkey.net/
// @version      1.5
// @description  Enables infinite scrolling for NHentai and its mirrors
// @author       You
// @license      MIT
// @match        *://nhentai.net/g/*/*/
// @match        *://nhentai.xxx/g/*/*/
// @match        *://nhentai.to/g/*/*/
// @match        *://nhentai.website/g/*/*/
// @match        *://nhentai.moe/g/*/*/
// @match        *://nhentai.ink/g/*/*/
// @match        *://nhentai.rocks/g/*/*/
// @match        *://*.nhentai.net/g/*/*/
// @match        *://*.nhentai.xxx/g/*/*/
// @match        *://*.nhentai.to/g/*/*/
// @match        *://*.nhentai.website/g/*/*/
// @match        *://*.nhentai.moe/g/*/*/
// @match        *://*.nhentai.ink/g/*/*/
// @match        *://*.nhentai.rocks/g/*/*/
// @grant        GM_xmlhttpRequest
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/531664/NHentai%20Infinite%20Scroll%20%28All%20Mirrors%29.user.js
// @updateURL https://update.greasyfork.org/scripts/531664/NHentai%20Infinite%20Scroll%20%28All%20Mirrors%29.meta.js
// ==/UserScript==

/*
MIT License

Copyright (c) 2025 You

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
*/

(function() {
    'use strict';

    let currentPage = parseInt(location.pathname.split('/').slice(-2, -1)[0]); // Get current page number
    let galleryBaseURL = location.pathname.match(/\/g\/\d+\//)[0]; // Extract gallery URL
    let loading = false;

    function loadNextPage() {
        if (loading) return;
        loading = true;
        
        let nextPage = currentPage + 1;
        let nextPageUrl = `${galleryBaseURL}${nextPage}/`;

        GM_xmlhttpRequest({
            method: "GET",
            url: nextPageUrl,
            onload: function(response) {
                let parser = new DOMParser();
                let doc = parser.parseFromString(response.responseText, "text/html");

                let imageElement = doc.querySelector('#image-container img'); // Get the next image
                if (imageElement) {
                    let newImg = document.createElement('img');
                    newImg.src = imageElement.src;
                    newImg.className = imageElement.className; // Apply NHentai's default image styles
                    newImg.style.maxWidth = '100%'; // Ensure it resizes properly
                    newImg.style.height = 'auto';
                    newImg.style.display = 'block';
                    newImg.style.margin = '10px auto';

                    document.querySelector('#image-container').appendChild(newImg);
                    currentPage++;
                    loading = false;
                }
            }
        });
    }

    window.addEventListener('scroll', () => {
        if ((window.innerHeight + window.scrollY) >= document.body.offsetHeight - 300) {
            loadNextPage();
        }
    });
})();
