// ==UserScript==
// @name         NHentai.xxx Image Viewer
// @namespace    http://tampermonkey.net/
// @version      1.1
// @description  Load all images on a single page for nhentai.xxx, currenty not work on other variant of nhentai.
// @author       You
// @match        https://nhentai.xxx/g/*/
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/518687/NHentaixxx%20Image%20Viewer.user.js
// @updateURL https://update.greasyfork.org/scripts/518687/NHentaixxx%20Image%20Viewer.meta.js
// ==/UserScript==

/*
MIT License

Copyright (c) 2024 drcode

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

    // At the top of the script, after the userscript header
    // Add JSZip library
    const loadJSZip = async () => {
        return new Promise((resolve, reject) => {
            const script = document.createElement('script');
            script.src = 'https://cdnjs.cloudflare.com/ajax/libs/jszip/3.10.1/jszip.min.js';
            script.onload = () => resolve(window.JSZip);
            script.onerror = reject;
            document.head.appendChild(script);
        });
    };

    // Add collection of image URLs
    const imageUrls = new Map(); // Map to store page number -> image URL

    // Add page loading tracker
    const pageLoadStatus = {
        totalPages: 0,
        loadedPages: 0,
        downloadButton: null
    };

    // Create container for iframes
    const createContainer = () => {
        const container = document.createElement('div');
        container.id = 'all-pages-container';
        container.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background: #1a1a1a;
            z-index: 9999;
            overflow-y: scroll;
            overflow-x: hidden;
            padding: 20px;
            scroll-behavior: smooth;
            -webkit-overflow-scrolling: touch;
        `;

        // Add inner container for better scroll handling
        const innerContainer = document.createElement('div');
        innerContainer.style.cssText = `
            max-width: 1200px;
            margin: 0 auto;
            padding: 20px;
            display: flex;
            flex-direction: column;
            align-items: center;
            gap: 30px;
        `;

        container.appendChild(innerContainer);
        return { container, innerContainer };
    };

    // Extract page URLs from thumbs with "Show All" handling
    const getPageUrls = async () => {
        // Try to find and click "Show All" button first
        const showAllButton = document.querySelector('a.show-all');
        if (showAllButton) {
            showAllButton.click();
            // Wait for new thumbnails to load
            await new Promise(resolve => setTimeout(resolve, 1000));
        }

        const thumbsContainer = document.getElementById('thumbs_append');
        if (!thumbsContainer) return [];

        const links = thumbsContainer.getElementsByTagName('a');
        return Array.from(links).map(link => link.href);
    };

    // Create iframe for a page
    const createIframe = (pageUrl, index) => {
        const wrapper = document.createElement('div');
        wrapper.style.cssText = `
            width: 100%;
            position: relative;
            border: 1px solid #333;
            background: #1a1a1a;
            margin-bottom: 30px;
            display: block;
            clear: both;
            overflow: hidden;
        `;

        const label = document.createElement('div');
        label.textContent = `Page ${index + 1}`;
        label.style.cssText = `
            color: white;
            position: absolute;
            top: 5px;
            left: 5px;
            background: rgba(0,0,0,0.5);
            padding: 5px;
            border-radius: 3px;
            z-index: 1;
        `;
        wrapper.appendChild(label);

        const loading = document.createElement('div');
        loading.textContent = 'Loading...';
        loading.style.cssText = `
            color: white;
            text-align: center;
            padding: 20px;
        `;
        wrapper.appendChild(loading);

        const iframe = document.createElement('iframe');
        iframe.id = `page-frame-${index}`;
        iframe.style.cssText = `
            width: 100%;
            border: none;
            background: #1a1a1a;
            overflow: hidden;
            scrolling: no;
        `;
        iframe.scrolling = 'no'; // Disable scrolling

        $(iframe).on('load', function() {
            loading.remove();
            try {
                const iframeDoc = this.contentWindow.document;
                const currentIframe = this;
                const currentWrapper = wrapper;

                iframeDoc.documentElement.style.overflow = 'hidden';
                iframeDoc.body.style.overflow = 'hidden';

                const img = iframeDoc.querySelector('#fimg.lazy');

                if (img) {
                    const updateThisIframe = () => {
                        const imgHeight = img.naturalHeight || img.height;
                        const imgWidth = img.naturalWidth || img.width;

                        currentIframe.style.height = `${imgHeight}px`;
                        currentIframe.style.width = `${imgWidth}px`;

                        currentWrapper.style.height = `${imgHeight}px`;
                        currentWrapper.style.width = `${imgWidth}px`;
                        currentWrapper.style.padding = '0';

                        iframeDoc.body.style.margin = '0';
                        iframeDoc.body.style.padding = '0';
                        iframeDoc.body.style.height = `${imgHeight}px`;
                        iframeDoc.body.style.width = `${imgWidth}px`;
                        iframeDoc.body.style.overflow = 'hidden';
                        iframeDoc.documentElement.style.overflow = 'hidden';
                    };

                    if (img.dataset.src && img.src !== img.dataset.src) {
                        img.src = img.dataset.src;
                    }

                    img.onload = updateThisIframe;

                    Array.from(iframeDoc.body.children).forEach(element => {
                        if (!element.contains(img)) {
                            element.style.display = 'none';
                        }
                    });

                    if (img.complete) {
                        updateThisIframe();
                    }

                    iframeDoc.body.style.background = '#1a1a1a';
                    currentIframe.style.border = 'none';
                    currentWrapper.style.border = '1px solid #333';
                    currentWrapper.style.background = '#1a1a1a';
                }
            } catch (error) {
                console.error('Error in iframe load:', error);
            }
        });

        iframe.src = pageUrl;
        wrapper.appendChild(iframe);

        return wrapper;
    };

    // Add about dialog creation
    const createAboutDialog = () => {
        const dialog = document.createElement('div');
        dialog.style.cssText = `
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            background: #2a2a2a;
            padding: 20px;
            border-radius: 8px;
            box-shadow: 0 0 20px rgba(0,0,0,0.5);
            z-index: 10002;
            max-width: 400px;
            width: 90%;
        `;

        const title = document.createElement('h2');
        title.textContent = 'About NHentai Image Viewer';
        title.style.cssText = `
            color: white;
            margin: 0 0 15px 0;
            font-size: 1.5em;
        `;

        const content = document.createElement('div');
        content.style.cssText = `
            color: #ddd;
            margin-bottom: 20px;
            line-height: 1.5;
        `;
        content.innerHTML = `
            <p>This viewer helps you read and download manga more easily.</p>
            <p>If you find this tool useful, please consider supporting the developer:</p>
        `;

        const kofiButton = document.createElement('a');
        kofiButton.href = 'https://ko-fi.com/drcode';
        kofiButton.target = '_blank';
        kofiButton.style.cssText = `
            display: block;
            background: #FF5E5B;
            color: white;
            text-decoration: none;
            padding: 10px 20px;
            border-radius: 4px;
            text-align: center;
            margin: 15px 0;
            font-weight: bold;
            transition: background 0.2s;
        `;
        kofiButton.textContent = 'Support on Ko-fi';
        kofiButton.onmouseover = () => kofiButton.style.background = '#FF7674';
        kofiButton.onmouseout = () => kofiButton.style.background = '#FF5E5B';

        const closeButton = document.createElement('button');
        closeButton.textContent = 'Close';
        closeButton.style.cssText = `
            display: block;
            width: 100%;
            padding: 8px;
            background: #444;
            color: white;
            border: none;
            border-radius: 4px;
            cursor: pointer;
            margin-top: 15px;
            transition: background 0.2s;
        `;
        closeButton.onmouseover = () => closeButton.style.background = '#555';
        closeButton.onmouseout = () => closeButton.style.background = '#444';
        closeButton.onclick = () => dialog.remove();

        dialog.appendChild(title);
        dialog.appendChild(content);
        dialog.appendChild(kofiButton);
        dialog.appendChild(closeButton);

        return dialog;
    };

    // Main function
    const init = async () => {
        const { container, innerContainer } = createContainer();
        document.body.appendChild(container);

        // Create buttons container
        const buttonsContainer = document.createElement('div');
        buttonsContainer.style.cssText = `
            position: fixed;
            top: 10px;
            right: 10px;
            display: flex;
            gap: 10px;
            z-index: 10000;
        `;

        // About button
        const aboutButton = document.createElement('button');
        aboutButton.textContent = 'About';
        aboutButton.style.cssText = `
            padding: 10px;
            background: #4CAF50;
            color: white;
            border: none;
            cursor: pointer;
            border-radius: 3px;
            transition: background 0.2s;
        `;
        aboutButton.onmouseover = () => aboutButton.style.background = '#45a049';
        aboutButton.onmouseout = () => aboutButton.style.background = '#4CAF50';
        aboutButton.onclick = () => document.body.appendChild(createAboutDialog());

        // Close button
        const closeButton = document.createElement('button');
        closeButton.textContent = 'Close Viewer';
        closeButton.style.cssText = `
            padding: 10px;
            background: #333;
            color: white;
            border: none;
            cursor: pointer;
            border-radius: 3px;
            transition: background 0.2s;
        `;
        closeButton.onmouseover = () => closeButton.style.background = '#444';
        closeButton.onmouseout = () => closeButton.style.background = '#333';
        closeButton.onclick = () => container.remove();

        buttonsContainer.appendChild(aboutButton);
        buttonsContainer.appendChild(closeButton);
        container.appendChild(buttonsContainer);

        const pageUrls = await getPageUrls();
        pageUrls.forEach((url, index) => {
            const iframeWrapper = createIframe(url, index);
            innerContainer.appendChild(iframeWrapper);
        });
    };

    // Add viewer button
    const addViewerButton = () => {
        const button = document.createElement('button');
        button.textContent = 'View All Pages';
        button.style.cssText = `
            position: fixed;
            bottom: 20px;
            right: 20px;
            padding: 10px 20px;
            background: #ed2553;
            color: white;
            border: none;
            border-radius: 5px;
            cursor: pointer;
            z-index: 9998;
        `;
        button.onclick = () => init();
        document.body.appendChild(button);
    };

    // Start the script
    addViewerButton();
})();
