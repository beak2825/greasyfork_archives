// ==UserScript==
// @name         Youtube Video Downloader | MP3,MP4
// @name:pt-BR   Youtube Video Downloader | MP3,MP4
// @name:es      Youtube Video Downloader | MP3,MP4
// @namespace    http://tampermonkey.net/
// @version      2022.08.12.1
// @description  A basic youtube video downloader using y2mate, faster, a single click!
// @description:pt-BR Um downloader básico de vídeo do youtube usando y2mate, mais rápido, um único clique!
// @description:es ¡Un descargador básico de videos de YouTube usando y2mate, más rápido, con un solo clic!
// @author       misteregis
// @match        *://www.youtube.com/*
// @icon         https://www.google.com/s2/favicons?domain=youtube.com
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/444069/Youtube%20Video%20Downloader%20%7C%20MP3%2CMP4.user.js
// @updateURL https://update.greasyfork.org/scripts/444069/Youtube%20Video%20Downloader%20%7C%20MP3%2CMP4.meta.js
// ==/UserScript==

/* jshint esversion:6 */

(function () {
    'use strict';

    const downloadButton = document.createElement("div");

    downloadButton.innerHTML = "<b>&#x2913;</b>";
    downloadButton.style.backgroundColor = "var(--yt-spec-brand-button-background)";
    downloadButton.style.borderRadius = "2px";
    downloadButton.style.position = "absolute";
    downloadButton.style.right = 0;
    downloadButton.style.color = "var(--yt-spec-static-brand-white)";
    downloadButton.style.padding = "6px 14px";
    downloadButton.style.marginTop = "10px";
    downloadButton.style.userSelect = "none";
    downloadButton.style.fontSize = "2rem";
    downloadButton.style.fontWeight = "var(--ytd-tab-system-font-weight)";
    downloadButton.style.letterSpacing = "var(--ytd-tab-system-letter-spacing)";
    downloadButton.style.textTransform = "var(--ytd-tab-system-text-transform)";
    downloadButton.style.cursor = "pointer";
    downloadButton.style.zIndex = 999;

    const createButton = (target, callback) => {
        const btn = downloadButton.cloneNode(true);
        const content = document.createElement("div");
        const tooltip = document.createElement("tp-yt-paper-tooltip");

        tooltip.setAttribute("offset", 4);
        tooltip.textContent = "Download Video";

        content.style.position = "absolute";
        content.style.width = "200px";
        content.style.right = 0;

        content.appendChild(btn);
        content.appendChild(tooltip);
        target.appendChild(content);

        btn.onclick = () => callback();
    };

    const waitForElement = (selector, callback) => {
        const element = document.querySelector(selector);

        if (element) return callback(element);

        return window.requestAnimationFrame(() => {
            waitForElement(selector, callback);
        });
    };

    const dl = (url) => {
        const videoId = new URL(url || window.location).searchParams.get("v");
        const api = `https://saveanyvideo.com/#url=https://youtu.be/${videoId}`;

        const win = window.open(api, "_blank");
        const video = document.querySelector("video");

        video.pause();

        const timer = setInterval(() => {
            if (win.closed) {
                clearInterval(timer);
                video.play();
            }
        }, 400);
    }

    const selector = [
        "ytd-player#ytd-player:not([data-has-download-button])",
        "ytd-rich-grid-media a#thumbnail:not([data-has-download-button])",
        "ytd-rich-grid-slim-media a#thumbnail:not([data-has-download-button])",
        // "ytd-compact-video-renderer a#thumbnail:not([data-has-download-button])",
    ];

    const addButtons = () => {
        document.querySelectorAll(selector).forEach((element) => {
            const localName = element.closest("ytd-rich-grid-slim-media")?.localName;
            const target = element.parentElement;
            let url = element.href;

            if (localName === "ytd-rich-grid-slim-media") {
                url += `?v=${url.split("/").pop()}`;
            }

            element.dataset.hasDownloadButton = true;

            createButton(target, () => dl(url));
        });
    };

    window.onload = () => {
        addButtons();

        const elementNext = document.querySelector("ytd-watch-next-secondary-results-renderer");
        const elementBrowse = document.querySelector("ytd-browse");
        const element = elementBrowse ? elementBrowse : elementNext;

        if (element) {
            let mutationTimeout = null;

            element.addEventListener("DOMNodeInserted", (e) => {
                if (e.target.localName !== "ytd-rich-grid-row") return;

                clearTimeout(mutationTimeout);

                mutationTimeout = setTimeout(addButtons, 750);
            });
        }
    };
})();