// ==UserScript==
// @name         GitHub File Downloader
// @description  Allows you to download individual files directly from GitHub repository pages.
// @icon         https://github.githubassets.com/favicons/favicon-dark.svg
// @version      1.3
// @author       afkarxyz
// @namespace    https://github.com/afkarxyz/userscripts/
// @supportURL   https://github.com/afkarxyz/userscripts/issues
// @license      MIT
// @match        https://github.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/520209/GitHub%20File%20Downloader.user.js
// @updateURL https://update.greasyfork.org/scripts/520209/GitHub%20File%20Downloader.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const style = document.createElement('style');
    style.textContent = `
        .github-icon-replacer-hover {
            cursor: pointer;
            transition: transform 0.1s ease;
        }
        .github-icon-replacer-hover:hover {
            transform: scale(1.1);
        }
    `;
    document.head.appendChild(style);

    async function downloadFile(url, fileName) {
        try {
            const response = await fetch(url);
            const blob = await response.blob();
            const link = document.createElement('a');
            link.href = window.URL.createObjectURL(blob);
            link.download = fileName;
            link.style.display = 'none';
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        } catch (error) {
            console.error('Download failed:', error);
        }
    }

    function replaceIcons() {
        const directoryRows = document.querySelectorAll('tr.react-directory-row');
        directoryRows.forEach(row => {
            const svgIcons = row.querySelectorAll('.react-directory-filename-column svg.color-fg-muted');
            svgIcons.forEach(svg => {
                if (!svg.dataset.replaced) {
                    const wrapper = document.createElement('div');
                    wrapper.style.display = 'inline-block';
                    
                    svg.innerHTML = `
                        <g>
                            <path d="M14.5,3.4l-2.9-2.9C11.2,0.2,10.8,0,10.3,0H3.8C2.8,0,2,0.8,2,1.8v12.5c0,1,0.8,1.8,1.8,1.8h9.5c1,0,1.8-0.8,1.8-1.8V4.7
                                C15,4.2,14.8,3.8,14.5,3.4z M10.5,1.6L10.5,1.6l2.9,2.9l0,0h-2.7c-0.1,0-0.2-0.1-0.2-0.2V1.6z M13.5,14.2c0,0.1-0.1,0.2-0.2,0.2
                                H3.8c-0.1,0-0.2-0.1-0.2-0.2V1.8c0-0.1,0.1-0.2,0.2-0.2H9v2.8C9,5.2,9.8,6,10.8,6h2.8V14.2z"/>
                            <path d="M9.1,10.6V7.3c0-0.3-0.3-0.6-0.6-0.6S7.9,7,7.9,7.3v3.3L6.5,9.3C6.3,9,5.9,9,5.7,9.3c-0.2,0.2-0.2,0.6,0,0.8l2.4,2.4
                                c0.2,0.2,0.6,0.2,0.8,0h0l2.4-2.4c0.2-0.2,0.2-0.6,0-0.8c-0.2-0.2-0.6-0.2-0.8,0L9.1,10.6z"/>
                        </g>
                    `;
                    svg.setAttribute('viewBox', '0 0 16 16');
                    svg.classList.add('github-icon-replacer-hover');
                    svg.dataset.replaced = 'true';

                    const fileLink = row.querySelector('a[href]');
                    if (fileLink) {
                        const downloadUrl = fileLink.href
                            .replace('github.com', 'raw.githubusercontent.com')
                            .replace('/blob/', '/');
                        const fileName = fileLink.textContent.trim();

                        svg.addEventListener('click', (e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            downloadFile(downloadUrl, fileName);
                        });
                    }
                }
            });
        });
    }

    const observer = new MutationObserver((mutations) => {
        for (let mutation of mutations) {
            if (mutation.type === 'childList') {
                replaceIcons();
            }
        }
    });

    observer.observe(document.body, { childList: true, subtree: true });

    replaceIcons();
})();