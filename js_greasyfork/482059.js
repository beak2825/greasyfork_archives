// ==UserScript==
// @name            Scrolller.com Autoplay Feed
// @name:de         Scrolller.com Automatische Wiedergabe im Feed
// @version         1.0.7
// @description     Autoplay Videos in Feed on Scrolller.com
// @description:de  Spiele Videos im Feed automatisch ab auf Scrolller.com
// @icon            https://scrolller.com/assets/favicon-16x16.png
// @author          TalkLounge (https://github.com/TalkLounge)
// @namespace       https://github.com/TalkLounge/scrolller.com-autoplay-feed
// @license         MIT
// @match           https://scrolller.com/*
// @grant           none
// @run-at          document-start
// @downloadURL https://update.greasyfork.org/scripts/482059/Scrolllercom%20Autoplay%20Feed.user.js
// @updateURL https://update.greasyfork.org/scripts/482059/Scrolllercom%20Autoplay%20Feed.meta.js
// ==/UserScript==

(function () {
    'use strict';

    let interval;
    let muted = true;
    let cooldown = Date.now();
    let MEDIASOURCES = {};

    const SELECTOR_FEED_HAS_IMG = "[class*=columnsContainer] [class*=galleryColumn] [class*=galleryItemHandler] img";
    const SELECTOR_FEED_ALL_PARENT_PLAY = "[class*=columnsContainer] [class*=galleryColumn] [class*=galleryItemHandler]:has([class*=postCard] [class*=videoHandler])";
    const SELECTOR_FEED_ALL_VIDEOS = "[class*=columnsContainer] [class*=galleryColumn] [class*=galleryItemHandler]:has([class*=postCard]) video";
    const SELECTOR_PARENT_PLAY = "[class*=videoHandler]";
    const SELECTOR_PLAY = "[class*=videoHandler]>svg";

    function video2SVGParent(video) {
        const parent = video.parentNode.parentNode.parentNode;
        //console.log(`video2SVGParent():`, video, "Return:", parent);
        return parent;
    }

    function insertSound(parent, mute) {
        if (!parent || [...parent.querySelector("div").classList].includes("noaudio")) {
            return;
        }
        //console.log(`insertSound():`, parent, mute);

        parent.querySelector(".sound")?.remove();

        let html;
        if (mute) {
            html = `
            <svg class="sound muted" viewBox="0 0 512 512" style="fill: grey; position: absolute; z-index: 2; width: 1.5em; cursor: pointer; margin-left: 0.2em">
                <path d="M232 416a23.88 23.88 0 01-14.2-4.68 8.27 8.27 0 01-.66-.51L125.76 336H56a24 24 0 01-24-24V200a24 24 0 0124-24h69.75l91.37-74.81a8.27 8.27 0 01.66-.51A24 24 0 01256 120v272a24 24 0 01-24 24zm-106.18-80zm-.27-159.86zM320 336a16 16 0 01-14.29-23.19c9.49-18.87 14.3-38 14.3-56.81 0-19.38-4.66-37.94-14.25-56.73a16 16 0 0128.5-14.54C346.19 208.12 352 231.44 352 256c0 23.86-6 47.81-17.7 71.19A16 16 0 01320 336z"></path>
                <path d="M368 384a16 16 0 01-13.86-24C373.05 327.09 384 299.51 384 256c0-44.17-10.93-71.56-29.82-103.94a16 16 0 0127.64-16.12C402.92 172.11 416 204.81 416 256c0 50.43-13.06 83.29-34.13 120a16 16 0 01-13.87 8z"></path>
                <path d="M416 432a16 16 0 01-13.39-24.74C429.85 365.47 448 323.76 448 256c0-66.5-18.18-108.62-45.49-151.39a16 16 0 1127-17.22C459.81 134.89 480 181.74 480 256c0 64.75-14.66 113.63-50.6 168.74A16 16 0 01416 432z"></path>
            </svg>`;
        } else {
            html = `
            <svg class="sound volume" viewBox="0 0 512 512" style="fill: white; position: absolute; z-index: 2; width: 1.5em; cursor: pointer; margin-left: 0.2em">
                <path d="M232 416a23.88 23.88 0 01-14.2-4.68 8.27 8.27 0 01-.66-.51L125.76 336H56a24 24 0 01-24-24V200a24 24 0 0124-24h69.75l91.37-74.81a8.27 8.27 0 01.66-.51A24 24 0 01256 120v272a24 24 0 01-24 24zm-106.18-80zm-.27-159.86zM320 336a16 16 0 01-14.29-23.19c9.49-18.87 14.3-38 14.3-56.81 0-19.38-4.66-37.94-14.25-56.73a16 16 0 0128.5-14.54C346.19 208.12 352 231.44 352 256c0 23.86-6 47.81-17.7 71.19A16 16 0 01320 336z"></path>
                <path d="M368 384a16 16 0 01-13.86-24C373.05 327.09 384 299.51 384 256c0-44.17-10.93-71.56-29.82-103.94a16 16 0 0127.64-16.12C402.92 172.11 416 204.81 416 256c0 50.43-13.06 83.29-34.13 120a16 16 0 01-13.87 8z"></path>
                <path d="M416 432a16 16 0 01-13.39-24.74C429.85 365.47 448 323.76 448 256c0-66.5-18.18-108.62-45.49-151.39a16 16 0 1127-17.22C459.81 134.89 480 181.74 480 256c0 64.75-14.66 113.63-50.6 168.74A16 16 0 01416 432z"></path>
            </svg>`;
        }
        html = html.replace(/>\s+</g, '><').trim(); // Clean up formatted html, Thanks to https://stackoverflow.com/a/27841683
        const child = new DOMParser().parseFromString(html, "text/html");

        child.body.firstChild.addEventListener("click", (e) => {
            e.stopPropagation();

            const svg = e.target.closest(".sound");
            //console.log("Clicked Sound Button", svg);

            document.querySelectorAll(SELECTOR_FEED_ALL_VIDEOS).forEach(video => {
                if (!video.muted) {
                    insertSound(video2SVGParent(video), true);
                }

                video.muted = true;
            });

            if ([...svg.classList].includes("muted")) {
                //console.log("Muted");
                muted = false;

                parent.querySelector("video").muted = false;

                insertSound(parent);
            } else {
                //console.log("Unmuted");
                muted = true;

                insertSound(parent, true);
            }
        });

        parent.insertBefore(child.body.firstChild, parent.firstChild);
    }

    function extractMediaSourceFromVideoTag(data) {
        return [...data.querySelectorAll("video source")].map(item => item.src);
    }

    function extractMediaSourceFromScriptTags(data, url) {
        const initialData = data;
        data = [...data.querySelectorAll("script")];
        data = data.find(item => item.innerText.includes("mediaSources") && item.innerText.includes("blurredMediaSources"));

        if (!data) {
            console.error(`[ERROR]: extractMediaSourceFromScriptTags(): Couldn't load url scripts for ${url}`, initialData);
            return;
        }

        data = data.innerText.match(/https?:\/\/[^\s"'\\]+/g);
        data = data.filter(item => (item.endsWith(".mp4") || item.endsWith(".webm")) && !item.includes("/scrolller/"));
        data = [...new Set(data)]; // Remove duplicates

        return data;
    }

    async function loadMediaSources(url) {
        if (MEDIASOURCES[url]) {
            return MEDIASOURCES[url];
        }

        //console.log("loadMediaSources()", url);

        let data;
        for (let i = 1; i <= 8; i++) { // Try 8 times in case of HTTP Code 500
            try {
                data = await fetch(url);

                if (data.ok) {
                    break;
                }
            } catch (e) { }

            if (i == 8) {
                console.error(`[ERROR]: loadMediaSources(): GET failed 8 times for ${url}`);
                return;
            } else {
                await new Promise(r => setTimeout(r, Math.floor(Math.random() * 501) + 500)); // Cooldown between 500 - 1000 ms
            }
        }

        data = await data.text();
        data = new DOMParser().parseFromString(data, "text/html");

        let mediaSources;
        try {
            mediaSources = extractMediaSourceFromVideoTag(data);
        } catch (e) { }

        if (!mediaSources || !mediaSources.length) {
            try {
                mediaSources = extractMediaSourceFromScriptTags(data, url);
            } catch (e) { }
        }

        if (!mediaSources || !mediaSources.length) {
            console.error(`[ERROR]: loadMediaSources(): Extraction failed for ${url}`);
            return;
        }

        MEDIASOURCES[url] = mediaSources;

        return mediaSources;
    }

    async function loadVideo(parent) {
        if ([...parent.querySelector("div").classList].includes("loaded")) {
            return;
        }
        //console.log(`loadVideo():`, parent);

        parent.querySelector("div").classList.add("loaded");
        parent.querySelector(SELECTOR_PLAY).remove();

        const url = parent.querySelector("a").href;
        const mediaSources = await loadMediaSources(url);

        if (!mediaSources || !mediaSources.length || !parent.querySelector(SELECTOR_PARENT_PLAY)) {
            return;
        }

        const video = document.createElement("video");
        video.autoplay = true;
        video.muted = true;
        video.loop = true;
        video.style.height = "100%";
        video.style.position = "absolute";
        video.addEventListener("loadeddata", () => {
            if (!parent.querySelector(SELECTOR_PARENT_PLAY)) {
                return; // Already unloaded
            }

            parent.querySelector(SELECTOR_PARENT_PLAY).remove();

            const hasAudio = video.mozHasAudio || Boolean(video.webkitAudioDecodedByteCount) || Boolean(video.audioTracks && video.audioTracks.length);

            if (!hasAudio) {
                parent.querySelector("div").classList.add("noaudio");
            }

            insertSound(parent, true);
        });

        for (const src of mediaSources) {
            const source = document.createElement("source");
            source.src = src;
            video.append(source);
        }

        parent.querySelector("a").append(video);
    }

    function loadVideos() {
        const items = document.querySelectorAll(SELECTOR_FEED_ALL_PARENT_PLAY);

        for (const item of items) {
            loadVideo(item);
        }
    }

    async function init() {
        if (!document.querySelector(SELECTOR_FEED_HAS_IMG)) {
            return;
        }

        window.clearInterval(interval);

        window.setInterval(loadVideos, 500);

        document.body.onscroll = function () {
            if (muted) {
                return;
            }

            if (Date.now() - cooldown < 250) {
                return;
            }
            cooldown = Date.now();

            //console.log("Scroll");
            let diffMin = 1000000;
            let nearest;
            let middle = window.innerHeight / 2;

            document.querySelectorAll(SELECTOR_FEED_ALL_VIDEOS).forEach(video => {
                const loud = video2SVGParent(video).querySelector(".sound:not(.muted)");
                if (loud) {
                    insertSound(video2SVGParent(video), true);
                }
                video.muted = true;
                const rect = video.getBoundingClientRect();
                const elemMiddle = rect.y + (rect.height / 2);
                const diff = Math.abs(middle - elemMiddle);
                if (diff < diffMin) {
                    diffMin = diff;
                    nearest = video;
                }
            });

            if (!nearest || diffMin > middle || video2SVGParent(nearest).querySelector(".sound:not(.muted)")) {
                return;
            }

            nearest.muted = false;

            insertSound(video2SVGParent(nearest));
        }
    }

    interval = window.setInterval(init, 500);
})();
