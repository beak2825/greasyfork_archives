// ==UserScript==
// @name         Pinterest - Open Raw Image/Video
// @namespace    http://tampermonkey.net/
// @version      2025-08-04
// @description  Adds a button next to Pinterest pins, which opens the raw image or video of the pin in a new tab.
// @license      MIT
// @author       provigz (Vankata453)
// @match        http*://www.pinterest.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=pinterest.com
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/544531/Pinterest%20-%20Open%20Raw%20ImageVideo.user.js
// @updateURL https://update.greasyfork.org/scripts/544531/Pinterest%20-%20Open%20Raw%20ImageVideo.meta.js
// ==/UserScript==

(function() {
    'use strict';

    function addOpenRawButton() {
        if (!location.pathname.startsWith("/pin/")) return;

        let openRawButton = document.querySelector("a#openRawButton");
        if (openRawButton) return;

        let srcURL;
        const closeupContainer = document.querySelector("div[data-test-id='closeup-container']");
        if (closeupContainer) {
            const images = closeupContainer.querySelectorAll("img");
            if (images.length <= 0) return;

            let bestResImage = null;
            let maxImageArea = -1;
            for (const img of images) {
                const area = img.naturalWidth * img.naturalHeight;
                if (area > maxImageArea) {
                    maxImageArea = area;
                    bestResImage = img;
                }
            }
            srcURL = bestResImage.getAttribute("src");
        } else {
            const videoSnippetScript = document.querySelector("script[data-test-id='video-snippet']");
            if (!videoSnippetScript) return;

            try {
                const videoData = JSON.parse(videoSnippetScript.textContent);
                srcURL = videoData.contentUrl;
                if (!srcURL) return;
            } catch (err) {
                console.error('Failed to parse "video-snippet" JSON:', err);
                return;
            }
        }

        const shareButton = document.querySelector("div[data-test-id='share-button']");
        if (!shareButton) return;

        openRawButton = document.createElement("a");
        for (const attr of shareButton.attributes) {
            openRawButton.setAttribute(attr.name, attr.value);
        }
        openRawButton.appendChild(shareButton.firstChild.cloneNode(true));

        openRawButton.id = "openRawButton";
        openRawButton.removeAttribute("data-test-id");
        openRawButton.setAttribute("href", srcURL);
        openRawButton.setAttribute("target", "_blank");

        const iconSvg = openRawButton.querySelector("svg");
        const iconDiv = iconSvg.parentNode;
        iconDiv.addEventListener("mouseenter", () => {
            iconDiv.style.backgroundColor = "rgba(239, 239, 235, 0.5)";

            const tooltip = document.createElement("div");
            tooltip.textContent = "Open Raw";
            tooltip.style.position = "absolute";
            tooltip.style.backgroundColor = "black";
            tooltip.style.color = "white";
            tooltip.style.padding = "10px 8px";
            tooltip.style.borderRadius = "8px";
            tooltip.style.boxShadow = "rgba(0, 0, 0, 0.2) 0px 3px 12px 0px";
            tooltip.style.whiteSpace = "nowrap";
            tooltip.style.transform = "translateX(-50%)";
            tooltip.style.pointerEvents = "none";
            tooltip.style.zIndex = "1000";

            const rect = iconDiv.getBoundingClientRect();
            tooltip.style.left = `${rect.left + rect.width / 2 + window.scrollX || window.pageXOffset}px`;
            tooltip.style.top = `${rect.bottom + 8 + window.scrollY || window.pageYOffset}px`;

            iconDiv._tooltip = tooltip;
            document.body.appendChild(tooltip);
        });
        iconDiv.addEventListener("mouseleave", () => {
            iconDiv.style.backgroundColor = "white";
            if (iconDiv._tooltip) {
                iconDiv._tooltip.remove();
                iconDiv._tooltip = null;
            }
        });

        const iconImg = document.createElement("img");
        iconImg.setAttribute("src", "https://static.thenounproject.com/png/open-icon-2392341-512.png");
        iconImg.style.width = "55%";
        iconImg.style.height = "55%";
        iconDiv.replaceChild(iconImg, iconSvg);

        shareButton.after(openRawButton);
    }

    const observer = new MutationObserver(addOpenRawButton);
    observer.observe(document.body, { childList: true });
})();