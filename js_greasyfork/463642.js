// ==UserScript==
// @name         Edge's TikTok VideoID Grabber
// @version      1.0
// @description  VideoID Downloader for Edge's TikTok Downloader
// @author       Edge
// @match        https://www.tiktok.com/*
// @grant        none
// @namespace https://greasyfork.org/users/1044768
// @downloadURL https://update.greasyfork.org/scripts/463642/Edge%27s%20TikTok%20VideoID%20Grabber.user.js
// @updateURL https://update.greasyfork.org/scripts/463642/Edge%27s%20TikTok%20VideoID%20Grabber.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Wait until the page is fully loaded before running
    window.addEventListener('load', () => {
        const styleBlock = document.createElement('style');
        styleBlock.innerHTML = `
        button.download-tiktok-videos {
            background: linear-gradient(#231E3C, #231E3C) padding-box,
            	linear-gradient(to right, #08E2D8, #3D18BB) border-box !important;
            border: 1px solid transparent !important;
            color: #fff !important;
            padding: 10px 20px !important;
            font-size: 16px !important;
            font-weight: 600 !important;
            border-radius: 30px !important;
            margin: 10px 0 !important;
            cursor: pointer;
            transition: all 0.3s ease;
        }

        button.download-tiktok-videos:hover {
            opacity: 0.8;
        }
    `;
    document.head.appendChild(styleBlock);
        // Add a button after the <div data-e2e="user-more"> element
        const userMoreDiv = document.querySelector('div[data-e2e="user-more"]');
        const button = document.createElement('button');
        button.textContent = 'Download All Video IDs';
        button.classList.add('download-tiktok-videos');
        userMoreDiv.parentNode.insertBefore(button, userMoreDiv.nextSibling);

        // Add an event listener to the button to trigger the video download process
        button.addEventListener('click', async function() {
            // Scroll to the bottom of the page until it can't scroll anymore
            let previousScrollHeight = 0;
            let currentScrollHeight = document.body.scrollHeight;

            while (previousScrollHeight !== currentScrollHeight) {
                window.scrollTo(0, currentScrollHeight);
                await new Promise(resolve => setTimeout(resolve, 1000));
                previousScrollHeight = currentScrollHeight;
                currentScrollHeight = document.body.scrollHeight;
            }

            // Get all <a> tags on the page
            const links = document.querySelectorAll("a");

            // Loop through each <a> tag
            const videoIds = [];
            for (const link of links) {
                // Check if the link matches the TikTok video URL pattern
                const regex = /^https?:\/\/www\.tiktok\.com\/@[^/]+\/video\/(\d+)/i;
                const match = link.href.match(regex);

                // If the link matches, add the video ID to the list
                if (match) {
                    videoIds.push(match[1]);
                }
            }

            // Create a blob from the video IDs and save it to a text file
            const blob = new Blob([videoIds.join('\n')], { type: 'text/plain' });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = 'tiktok_video_ids.txt';
            a.textContent = 'Download TikTok Video IDs';
            document.body.appendChild(a);
            a.click();
            a.remove();
        });
    });
})();
