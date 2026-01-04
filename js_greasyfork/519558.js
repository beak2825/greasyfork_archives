// ==UserScript==
// @name         ZJU Course PDF downloader
// @namespace    https://github.com/pyraxo
// @version      0.0.3
// @description  Downloads PDFs from courses.zju.edu.cn
// @author       pyraxo
// @match        *://courses.zju.edu.cn/course/*
// @icon         data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAMAAAAoLQ9TAAAAolBMVEVHcEzSUCUQYHR6HErGXSl1gn8FZXUKY3WCYFVxoTp0e3rEdRF1eHl1eXoWYXN5G0p4Jk1ynjx4JU0UY3MNXHcQX3ShQTlznzp0oDlwoTsXYnNzens+Ll14H0t3Jk5xnTwXYnNqoj3MVibGXSnGXSgXYnN1eHl1eHkXYnNzeHpynjxynjx1gH1ynjx1KE91IUx+IEt6pTJ7I0x1KlAWYnN1eHnrkDrOAAAAM3RSTlMAOogm+x50agZ4ahjLqq8+m96xgEiUE7GTfsiHG2LHNOBOSoSh2V/14ZnEX0j35oZTZXyEMjMpAAAAk0lEQVQYlU2P6RaCIBBGQSMBBRS1UlPb9516/1cLhZL7a+aeme/MANBxTpLkegID4ZPMpoWpF9uy5Dz3gmyOe/F2OPA0A4FlrEk9L++GZCPj+FU/hG9ShPoT98JX6tbIey1sqjYTjNCFVoxZQT8/kBFoR6sji6J95JzareOhX480G/eXFYQwdARYFoS4PWj1tybiCyC2DngLtx6dAAAAAElFTkSuQmCC
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/519558/ZJU%20Course%20PDF%20downloader.user.js
// @updateURL https://update.greasyfork.org/scripts/519558/ZJU%20Course%20PDF%20downloader.meta.js
// ==/UserScript==

(function() {
    'use strict';
    //const $ = window.jQuery;

    console.log("ZJU Downloader loaded!");

    // First inject the CSS styles
    const styles = `
        #zju-pdf-downloader {
            position: fixed;
            top: 5px;
            left: 50%;
            transform: translateX(-50%);
            padding: 8px 16px;
            background: white;
            border: 1px solid #ddd;
            border-radius: 4px;
            cursor: pointer;
            display: flex;
            align-items: center;
            gap: 8px;
            font-family: Arial, sans-serif;
            font-size: 14px;
            color: #333;
            z-index: 9999;
            box-shadow: 0 2px 4px rgba(0,0,0,0.1);
            transition: all 0.2s ease-in-out;
        }

        #zju-pdf-downloader:hover {
            background-color: #f0f0f0;
            box-shadow: 0 4px 8px rgba(0,0,0,0.15);
            transform: translateX(-50%)
        }

        #zju-pdf-downloader svg {
            width: 16px;
            height: 16px;
        }
    `;

    // Inject CSS
    const styleSheet = document.createElement("style");
    styleSheet.textContent = styles;
    document.head.appendChild(styleSheet);

    const buttonId = 'zju-pdf-downloader';

    function appendDownloadButton() {
        const $pdfContainer = $('.pdf-container');
        if (!$pdfContainer.length || $('#zju-pdf-downloader').length) {
            return;
        }

        // Create button container
        const button = document.createElement('div');
        button.id = buttonId;

        // Create text content
        const text = document.createElement('span');
        text.textContent = 'Download PDF';

        // Create SVG icon
        const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
        svg.setAttribute('viewBox', '0 0 24 24');
        svg.setAttribute('fill', 'none');
        svg.setAttribute('stroke', 'currentColor');
        svg.setAttribute('stroke-width', '2');
        svg.setAttribute('stroke-linecap', 'round');
        svg.setAttribute('stroke-linejoin', 'round');

        svg.innerHTML = `
            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
            <polyline points="7 10 12 15 17 10"></polyline>
            <line x1="12" y1="15" x2="12" y2="3"></line>
        `;

        // Assemble the button
        button.appendChild(text);
        button.appendChild(svg);

        // Add click handler
        button.addEventListener('click', function() {
            console.log("Download button clicked!");
            const pdfViewer = document.getElementById('pdf-viewer');
            if (pdfViewer) {
                const ngSrc = pdfViewer.getAttribute('ng-src');
                console.log("PDF Viewer ng-src:", ngSrc);
                const url = ngSrc.replace("/note-bene/pdf-viewer?file=", "");
                const decodedUrl = decodeURIComponent(url);
                console.log("Decoded URL:", decodedUrl);
                window.open(decodedUrl, "_blank");
            } else {
                console.log("PDF Viewer iframe not found");
            }
        });

        document.body.appendChild(button);
    }

    window.addEventListener('load', () => {
        const targetDivSelector = '.pdf-container';

        // MutationObserver to watch for changes in the DOM
        const observer = new MutationObserver((mutationsList) => {
            for (let mutation of mutationsList) {
                const targetDiv = document.querySelector(targetDivSelector);
                if (mutation.addedNodes.length) {
                    if (targetDiv) {
                        appendDownloadButton();
                        console.log("Download button appended successfully");
                    }
                } else if (!targetDiv) {
                    const buttonDiv = document.querySelector('#' + buttonId);
                    if (buttonDiv) {
                        buttonDiv.remove();
                        console.log("Download button appended successfully");
                    }
                }
            }
        });

        // Start observing the entire body for DOM changes
        observer.observe(document.body, { childList: true, subtree: true });
    });
})();