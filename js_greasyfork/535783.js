// ==UserScript==
// @name        Scribd & SlideShare Viewer/Downloader
// @namespace   0b9
// @match       *://www.scribd.com/*
// @match       *://www.slideshare.net/slideshow/*
// @grant       none
// @version     1.1
// @author      0b9
// @description View or download from Scribd and SlideShare without an account
// @license     MIT
// @downloadURL https://update.greasyfork.org/scripts/535783/Scribd%20%20SlideShare%20ViewerDownloader.user.js
// @updateURL https://update.greasyfork.org/scripts/535783/Scribd%20%20SlideShare%20ViewerDownloader.meta.js
// ==/UserScript==

(function () {
    'use strict';

    const currentUrl = window.location.href;

    // ===== Scribd =====
    if (currentUrl.includes('scribd.com')) {
        sessionStorage.setItem('originalUrl', currentUrl);
        let originalUrl = null;

        function redirectToEmbed() {
            const currentUrl = window.location.href;
            sessionStorage.setItem('originalUrl', currentUrl);
            const regex = /https:\/\/www\.scribd\.com\/[^/]+\/([^/]+)\/[^/]+/;
            const match = currentUrl.match(regex);

            if (match) {
                const newUrl = `https://www.scribd.com/embeds/${match[1]}/content`;
                window.location.href = newUrl;
            } else {
                alert("Error: No match");
            }
        }

        function downloadContent() {
            const contentElements = document.querySelectorAll('.text_layer .a');
            let content = '';
            contentElements.forEach(element => {
                content += element.textContent + '\n';
            });

            const blob = new Blob([content], { type: 'text/plain' });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = 'scribd_content.txt';
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            URL.revokeObjectURL(url);
        }

        function downloadContentAsPDF() {
            const savedUrl = sessionStorage.getItem('originalUrl');
            if (!savedUrl) {
                alert('Error: Click the "View Full" button and try again');
                return;
            }

            const regex = /https:\/\/www\.scribd\.com\/(?:document|presentation)\/(\d+)\/([^\/?#]+)/;
            const match = savedUrl.match(regex);

            if (match) {
                const part1 = match[1];
                const part2 = match[2];
                const urls = [
                    `https://compress-pdf.vietdreamhouse.com/?fileurl=https://scribd.downloader.tips/pdownload/${part1}/${part2}&title=${part2}`,
                    `https://compress.tacz.info/?fileurl=https://scribd.vpdfs.com/pdownload/${part1}/${part2}&title=${part2}`
                ];
                const randomUrl = urls[Math.floor(Math.random() * urls.length)];
                window.location.href = randomUrl;
            } else {
                alert('Error: Invalid URL');
            }
        }

        function createButton(text, top, bgColor, onClick) {
            const btn = document.createElement('button');
            btn.textContent = text;
            btn.style.position = 'fixed';
            btn.style.top = top;
            btn.style.right = '10px';
            btn.style.zIndex = '1000';
            btn.style.padding = '10px';
            btn.style.backgroundColor = bgColor;
            btn.style.color = 'white';
            btn.style.border = 'none';
            btn.style.borderRadius = '5px';
            btn.style.cursor = 'pointer';
            btn.addEventListener('click', onClick);
            document.body.appendChild(btn);
        }

        createButton('View Full', '10px', '#4CAF50', redirectToEmbed);
        createButton('Download TXT', '50px', '#007BFF', downloadContent);
        createButton('Download PDF', '90px', '#FF5733', downloadContentAsPDF);
    }

    // ===== SlideShare =====
    if (currentUrl.includes('slideshare.net/slideshow/')) {
        const match = currentUrl.match(/https:\/\/www\.slideshare\.net\/slideshow\/([^/]+)\/(\d+)/);
        let downloadUrl;

        if (match) {
            // If the URL follows the old ID-at-end pattern
            downloadUrl = `https://slideshare.vpdfs.com/download/slideshow/${match[1]}/${match[2]}`;
        } else {
            // Generic fallback - re-use the pathname
            const path = window.location.pathname.replace('/slideshow/', '');
            downloadUrl = `https://slideshare.vpdfs.com/download/slideshow/${path}`;
        }

        const downloadSlideShareBtn = document.createElement('button');
        downloadSlideShareBtn.textContent = 'Download PDF';
        downloadSlideShareBtn.style.position = 'fixed';
        downloadSlideShareBtn.style.top = '10px';
        downloadSlideShareBtn.style.right = '10px';
        downloadSlideShareBtn.style.zIndex = '1000';
        downloadSlideShareBtn.style.padding = '10px';
        downloadSlideShareBtn.style.backgroundColor = '#6f42c1';
        downloadSlideShareBtn.style.color = 'white';
        downloadSlideShareBtn.style.border = 'none';
        downloadSlideShareBtn.style.borderRadius = '5px';
        downloadSlideShareBtn.style.cursor = 'pointer';

        downloadSlideShareBtn.addEventListener('click', () => {
            window.location.href = downloadUrl;
        });

        document.body.appendChild(downloadSlideShareBtn);
    }

})();
