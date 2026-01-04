// ==UserScript==
// @name         Discord Image NSFW Mask
// @namespace    http://tampermonkey.net/
// @version      0.4
// @description  Add NSFW mask over images in Discord Web, reveal on hover. Ignore emoji-sized images.
// @match        https://discord.com/*
// @grant        none
// @author       chatgpt
// @license      WTFPL
// @downloadURL https://update.greasyfork.org/scripts/539957/Discord%20Image%20NSFW%20Mask.user.js
// @updateURL https://update.greasyfork.org/scripts/539957/Discord%20Image%20NSFW%20Mask.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const MIN_WIDTH = 50;
    const MIN_HEIGHT = 50;

    const style = document.createElement("style");
    style.textContent = `
        .nsfw-mask {
            position: relative;
            display: block;
            width: 100%;
            height: 100%;
            overflow: hidden;
        }
        .nsfw-mask img {
            filter: blur(8px);
            transition: filter 0.3s ease-in-out;
            display: block;
            width: 100%;
            height: 100%;
            object-fit: cover;
        }
        .nsfw-overlay {
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0, 0, 0, 0.65);
            color: white;
            display: flex;
            justify-content: center;
            align-items: center;
            font-weight: bold;
            font-size: 12px;
            text-align: center;
            pointer-events: none;
            opacity: 1;
            transition: opacity 0.3s ease-in-out;
            border-radius: 3px;
            box-sizing: border-box;
        }

        div[class*="clickableWrapper"]:hover .nsfw-mask img,
        div[class*="imageWrapper"]:hover .nsfw-mask img {
            filter: none;
        }

        div[class*="clickableWrapper"]:hover .nsfw-mask .nsfw-overlay,
        div[class*="imageWrapper"]:hover .nsfw-mask .nsfw-overlay {
            opacity: 0;
        }
    `;
    document.head.appendChild(style);

    function processImage(img) {
        if (img.closest('.nsfw-mask')) return;

        const imageParent = img.parentNode;
        if (!imageParent) return;

        const wrapper = document.createElement('div');
        wrapper.className = 'nsfw-mask';

        const overlay = document.createElement('div');
        overlay.className = 'nsfw-overlay';
        overlay.textContent = 'NSFW - Hover';

        imageParent.insertBefore(wrapper, img);
        wrapper.appendChild(img);
        wrapper.appendChild(overlay);
    }

    function shouldProcess(img) {
        return !img.closest('.nsfw-mask') &&
            img.src &&
            (img.src.includes('/attachments/') || img.src.includes('cdn.discordapp.com/ephemeral-attachments/')) &&
            !img.closest('a[href^="/channels/"][href*="/users/"]') &&
            !img.classList.contains('emoji') &&
            !img.closest('[class*="avatar"]') &&
            !img.closest('[class*="reaction"]') &&
            img.offsetWidth >= MIN_WIDTH && img.offsetHeight >= MIN_HEIGHT;
    }

    const observer = new MutationObserver((mutationsList) => {
        for (const mutation of mutationsList) {
            if (mutation.type === 'childList' && mutation.addedNodes.length > 0) {
                mutation.addedNodes.forEach(node => {
                    if (node.nodeType === Node.ELEMENT_NODE) {
                        const images = [];
                        if (node.tagName === 'IMG') {
                            images.push(node);
                        } else {
                            node.querySelectorAll('img').forEach(img => images.push(img));
                        }

                        images.forEach(img => {
                            if (shouldProcess(img)) {
                                if (img.complete || (img.offsetWidth > 0 && img.offsetHeight > 0)) {
                                    processImage(img);
                                } else {
                                    img.onload = () => processImage(img);
                                    setTimeout(() => {
                                        if (!img.closest('.nsfw-mask')) processImage(img);
                                    }, 300);
                                }
                            }
                        });
                    }
                });
            }
        }
    });

    observer.observe(document.body, { childList: true, subtree: true });

    setTimeout(() => {
        document.querySelectorAll('img').forEach(img => {
            if (shouldProcess(img)) {
                processImage(img);
            }
        });
    }, 1000);

})();