// ==UserScript==
// @name         B站转YouTube
// @namespace    http://tampermonkey.net/
// @version      v2.0
// @description  B站快速携带标题搜索Youtube
// @author       SJ
// @match        *://www.bilibili.com/video/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=youtube.com
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/499459/B%E7%AB%99%E8%BD%ACYouTube.user.js
// @updateURL https://update.greasyfork.org/scripts/499459/B%E7%AB%99%E8%BD%ACYouTube.meta.js
// ==/UserScript==

(function() {
    'use strict';

    function createYouTubeButton(title) {
        const link = document.createElement('a');
        link.href = `https://www.youtube.com/results?search_query=${encodeURIComponent(title)}`;
        link.target = '_blank';
        link.title = `在YouTube搜索：${title}`;
        link.style.display = 'inline-flex';
        link.style.alignItems = 'center';
        link.style.transition = 'transform 0.2s ease';

        link.addEventListener('mouseenter', () => {
            link.style.transform = 'scale(1.1)';
        });
        link.addEventListener('mouseleave', () => {
            link.style.transform = 'scale(1)';
        });

        const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
        svg.setAttribute("viewBox", "0 0 1024 1024");
        svg.setAttribute("width", "30");
        svg.setAttribute("height", "30");
        svg.style.marginRight = "5px";

        const path1 = document.createElementNS("http://www.w3.org/2000/svg", "path");
        path1.setAttribute("d", "M941.3 296.1c-10.3-38.6-40.7-69-79.2-79.3C792.2 198 512 198 512 198s-280.2 0-350.1 18.7C123.3 227 93 257.4 82.7 296 64 366 64 512 64 512s0 146 18.7 215.9c10.3 38.6 40.7 69 79.2 79.3C231.8 826 512 826 512 826s280.2 0 350.1-18.8c38.6-10.3 68.9-40.7 79.2-79.3C960 658 960 512 960 512s0-146-18.7-215.9zM423 646V378l232 133-232 135z");
        path1.setAttribute("fill", "#d81e06");

        svg.appendChild(path1);
        link.appendChild(svg);

        return link;
    }

    function injectButtonToTitle() {
        const titleContainer = document.querySelector(".video-info-title-inner");
        if (!titleContainer) return;

        const h1Element = titleContainer.querySelector("h1");
        if (!h1Element) return;
        const title = h1Element.innerText.trim();
        if (!title) return;

        if (titleContainer.querySelector(".youtube-search-button")) return;

        const youTubeButton = createYouTubeButton(title);
        youTubeButton.className = "youtube-search-button";

        titleContainer.insertBefore(youTubeButton, h1Element);
    }

    function observeTitleArea() {
        const observer = new MutationObserver((mutations) => {
            for (const mutation of mutations) {
                if (mutation.type === 'childList' && mutation.addedNodes.length > 0) {
                    injectButtonToTitle();
                }
            }
        });

        const titleArea = document.querySelector(".video-info-title") || document.body;
        observer.observe(titleArea, { childList: true, subtree: true });
    }


    window.addEventListener('load', () => {
        setTimeout(() => {
            injectButtonToTitle();
            observeTitleArea();
        }, 1000);
    });
})();
