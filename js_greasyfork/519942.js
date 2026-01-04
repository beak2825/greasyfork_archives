// ==UserScript==
// @name         Rule34 Combined Script
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Combines functionality: Open all links in a div and download highest resolution MP4 video.
// @author       Your Name
// @match        *://*rule34*/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/519942/Rule34%20Combined%20Script.user.js
// @updateURL https://update.greasyfork.org/scripts/519942/Rule34%20Combined%20Script.meta.js
// ==/UserScript==

(function () {
    'use strict';

    // ---------------------------
    // Functionality 1: Open all links in a specific div
    // ---------------------------
    const targetDivSelector = '.thumbs.clearfix'; // CSS 선택자

    document.addEventListener('keydown', (event) => {
        if (event.key === '`') {
            const targetDiv = document.querySelector(targetDivSelector);
            if (!targetDiv) {
                alert('대상 div를 찾을 수 없습니다.');
                return;
            }

            const links = targetDiv.querySelectorAll('a[href]');
            if (links.length === 0) {
                alert('열 URL이 없습니다.');
                return;
            }

            links.forEach(link => {
                const url = link.href;
                if (url) window.open(url, '_blank');
            });
        }
    });

    // ---------------------------
    // Functionality 2: Download the highest resolution MP4 from rule34video.com
    // ---------------------------
    if (window.location.href.startsWith('https://rule34video.com/video')) {
        window.addEventListener('load', () => {
            const links = document.querySelectorAll('a.tag_item');

            if (!links || links.length === 0) {
                console.log("No video links found.");
                return;
            }

            let bestLink = null;
            let bestResolution = 0;

            links.forEach(link => {
                const text = link.textContent.trim();
                if (text.includes('MP4')) {
                    const resolutionMatch = text.match(/(\d+)p/);
                    if (resolutionMatch) {
                        const resolution = parseInt(resolutionMatch[1], 10);
                        if (resolution > bestResolution) {
                            bestResolution = resolution;
                            bestLink = link;
                        }
                    }
                }
            });

            if (bestLink) {
                const downloadUrl = bestLink.href;
                console.log(`Best video found: ${downloadUrl}`);
                const anchor = document.createElement('a');
                anchor.href = downloadUrl;
                anchor.download = '';
                document.body.appendChild(anchor);
                anchor.click();
                document.body.removeChild(anchor);
            } else {
                console.log("No suitable MP4 video found.");
            }
        });
    }
})();
