// ==UserScript==
// @name         GitHub Folder Downloader
// @description  Allows you to download subfolders from GitHub repository pages.
// @icon         https://github.githubassets.com/favicons/favicon-dark.svg
// @version      1.2
// @author       afkarxyz
// @namespace    https://github.com/afkarxyz/userscripts/
// @supportURL   https://github.com/afkarxyz/userscripts/issues
// @license      MIT
// @match        https://github.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/520237/GitHub%20Folder%20Downloader.user.js
// @updateURL https://update.greasyfork.org/scripts/520237/GitHub%20Folder%20Downloader.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const style = document.createElement('style');
    style.textContent = `
        .github-subfolder-download-icon {
            cursor: pointer;
            transition: transform 0.1s ease;
        }
        .github-subfolder-download-icon:hover {
            transform: scale(1.1);
        }
    `;
    document.head.appendChild(style);

    function replaceFolderIcons() {
        const directoryRows = document.querySelectorAll('tr.react-directory-row');
        directoryRows.forEach(row => {
            const svgIcons = row.querySelectorAll('.react-directory-filename-column svg.icon-directory');
            svgIcons.forEach(svg => {
                if (!svg.dataset.replaced) {
                    svg.innerHTML = `
                        <path d="M14.2,3H7.5C7.4,3,7.3,3,7.3,2.9L6.4,1.7C6.1,1.3,5.5,1,5,1H1.8C0.8,1,0,1.8,0,2.8v10.5c0,1,0.8,1.8,1.8,1.8h12.5
                            c1,0,1.8-0.8,1.8-1.8V4.8C16,3.8,15.2,3,14.2,3z M10.8,9.8l-2.4,2.4c-0.2,0.2-0.6,0.2-0.8,0L5.2,9.8C5,9.6,5,9.2,5.2,9
                            C5.3,8.7,5.8,8.7,6,9l1.4,1.3V7c0-0.3,0.3-0.6,0.6-0.6S8.5,6.7,8.5,7v3.3L10,9c0.2-0.2,0.6-0.2,0.8,0C11,9.2,11,9.6,10.8,9.8z"/>
                    `;
                    
                    svg.classList.add('github-subfolder-download-icon');
                    svg.dataset.replaced = 'true';

                    const folderLink = row.querySelector('a[href*="/tree/"]');
                    if (folderLink) {
                        const fullUrl = folderLink.href;
                        const downloadUrl = `https://downgit.evecalm.com/#/home?url=${encodeURIComponent(fullUrl)}`;

                        svg.addEventListener('click', (e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            window.open(downloadUrl, '_blank');
                        });
                    }
                }
            });
        });
    }

    const observer = new MutationObserver((mutations) => {
        for (let mutation of mutations) {
            if (mutation.type === 'childList') {
                replaceFolderIcons();
            }
        }
    });

    observer.observe(document.body, { childList: true, subtree: true });

    replaceFolderIcons();
})();