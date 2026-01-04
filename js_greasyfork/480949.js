// ==UserScript==
// @name         Show Youtube like/dislike ratios in video descriptions
// @license      MIT
// @namespace    https://github.com/2chen
// @version      1.15
// @description  Add (dis)like percentage to Youtube video descriptions. Dislike count is provided by https://www.returnyoutubedislike.com/
// @author       Yichen
// @icon         https://www.google.com/s2/favicons?sz=64&domain=greasyfork.org
// @match        https://*.youtube.com/*
// @grant        unsafeWindow
// @run-at       document-end
// @connect      returnyoutubedislikeapi.com
// @downloadURL https://update.greasyfork.org/scripts/480949/Show%20Youtube%20likedislike%20ratios%20in%20video%20descriptions.user.js
// @updateURL https://update.greasyfork.org/scripts/480949/Show%20Youtube%20likedislike%20ratios%20in%20video%20descriptions.meta.js
// ==/UserScript==

(function() {
    'use strict';

    console.info("YICHEN's super cool rating script");

    let shouldBackOff = false;
    const API_RATE_LIMIT_PER_MINUTE = 100;
    const counts = { msgs: 0, errors: 0 };
    const getRating = async (id) => {
        // we can't be above this limit, so assume caching
        if (counts.msgs < API_RATE_LIMIT_PER_MINUTE) {
            counts.msgs++;
        }
        setTimeout(() => {
            counts.msgs = Math.max(0, counts.msgs - 1);
        }, 60_000);

        let response;
        try {
            response = await fetch(`https://returnyoutubedislikeapi.com/votes?videoId=${id}`, {cache: "force-cache"});
            const { likes, dislikes } = await response.json();
            counts.errors = Math.max(0, counts.errors - 1);
            const percent = 100 * likes / (likes + dislikes);
            return { likes, dislikes, percent };
        } catch (e) {
            console.debug("YICHEN error in getRating", ++counts.errors, response, e);
            shouldBackOff = true;
            counts.msgs = 100;
        }
    }

    const TYPES = {homepage: "homepage", shorts: "shorts", channel: "channel", theater: "theater", search: "search"};
    const LOADING_ID = "loading!";
    const LOADING_TEXT = "??.?% · ";
    const handleNode = async (type, videoNode, descriptionEl, videoId) => {
        try {
            if (videoId == null) {
                console.error("YICHEN videoId null for type {} node {}. this is an error with the application)", type, videoNode);
                return;
            }
            if (descriptionEl == null) {
                // remove stale rating el
                videoNode.parentElement.parentElement.querySelector(".yichen-rating")?.remove();
                return;
            }

            let ratingEl = descriptionEl.parentElement.getElementsByClassName("yichen-rating")[0];
            // set loading state
            if (ratingEl == null) {
                ratingEl = document.createElement("span");
                ratingEl.className = "yichen-rating yt-core-attributed-string yt-content-metadata-view-model-wiz__metadata-text yt-core-attributed-string--white-space-pre-wrap yt-core-attributed-string--link-inherit-color";
                ratingEl.dataset.videoId = LOADING_ID;
                ratingEl.innerText = LOADING_TEXT;
                descriptionEl.parentElement.insertBefore(ratingEl, descriptionEl);

                // hackily remove "streamed"
                const ageNode = descriptionEl.parentElement.querySelector("span:last-of-type");
                let ageText = undefined;
                if (ageNode != null) {
                    // avoid overflows
                    if (ageNode.parentElement.style.fontSize === "1.2em") {
                        ageNode.parentElement.style.fontSize = "1.1em";
                    }
                    ageText = ageNode.textContent;
                    const numIndex = ageText.match("[0-9]")?.index;
                    ageText = !numIndex ? undefined : ageText.substring(numIndex);
                }
                if (ageText != null) {
                    const streamIconDiv = '<div style="width: 20px; height: 100%; fill: gray"><svg xmlns="http://www.w3.org/2000/svg" height="16" viewBox="0 0 16 16" width="16" focusable="false" style="pointer-events: none; display: block; width: 100%; height: 100%;"><path d="M9 8c0 .55-.45 1-1 1s-1-.45-1-1 .45-1 1-1 1 .45 1 1Zm1.11 2.13.71.71C11.55 10.11 12 9.11 12 8c0-1.11-.45-2.11-1.18-2.84l-.71.71c.55.55.89 1.3.89 2.13 0 .83-.34 1.58-.89 2.13Zm-4.93.71.71-.71C5.34 9.58 5 8.83 5 8c0-.83.34-1.58.89-2.13l-.71-.71C4.45 5.89 4 6.89 4 8c0 1.11.45 2.11 1.18 2.84Zm7.05 1.41.71.71C14.21 11.69 15 9.94 15 8s-.79-3.69-2.06-4.96l-.71.71C13.32 4.84 14 6.34 14 8c0 1.66-.68 3.16-1.77 4.25Zm-9.17.71.71-.71C2.68 11.16 2 9.66 2 8c0-1.66.68-3.16 1.77-4.25l-.71-.71C1.79 4.31 1 6.06 1 8s.79 3.69 2.06 4.96Z"></path></svg></div>';
                    ageNode.innerHTML = `<div style="display: inline-flex"><span>&ZeroWidthSpace;</span>${streamIconDiv}<span>&nbsp;${ageText}</span></div>`;
                    // we don't want ellpsis
                    if (type === TYPES.theater) {
                        ageNode.parentElement.style.whiteSpace = "nowrap";
                    }
                }
            } else if (ratingEl.dataset.videoId === videoId) {
                return;
            } else if (ratingEl.dataset.videoId !== LOADING_ID) {
                ratingEl.dataset.videoId = LOADING_ID;
                ratingEl.innerText = LOADING_TEXT;
            }

            if (shouldBackOff) return;
            const ratings = await getRating(videoId);
            if (ratings == null) return;

            const { likes, dislikes, percent } = ratings;
            ratingEl.removeChild(ratingEl.firstChild);
            ratingEl.title = `${likes} / ${dislikes}`;
            ratingEl.innerText = `${percent.toFixed(1)}% · `;
            ratingEl.dataset.videoId = videoId;
        } catch (e) {
            console.error("YICHEN unexpected error in handleNode", e);
        }
    };

    let logCounter = 0;
    let backOffTimeout;
    unsafeWindow.addEventListener('load', () => {
        if (unsafeWindow.location.href.startsWith("https://accounts.youtube")) {
            return;
        }

        console.info(`YICHEN starting main loop for href {}`, unsafeWindow.location.href);
        setInterval(() => {
            if (++logCounter % 5 === 0) {
                console.debug("YICHEN messages in last min", counts.msgs);
            }
            if (shouldBackOff && backOffTimeout == null) {
                const backoffSeconds = 2**Math.min(5,counts.errors);
                console.warn("YICHEN backing off for {} seconds due to {} errors", backoffSeconds, counts.errors);
                counts.errors = 0;
                backOffTimeout = setTimeout(() => {
                    shouldBackOff = false;
                    backOffTimeout = undefined;
                }, backoffSeconds * 1_000);
            }

            let videoNodes = document.querySelectorAll(".yt-lockup-metadata-view-model-wiz__text-container");
            videoNodes.forEach(videoNode => handleNode(
                TYPES.homepage,
                videoNode,
                videoNode.querySelector("div.yt-content-metadata-view-model-wiz__metadata-row").nextSibling.firstChild,
                videoNode.querySelector("a").href.substring(32, 32+11))
            );
            videoNodes = document.querySelectorAll("ytd-rich-grid-slim-media");
            videoNodes.forEach(videoNode => handleNode(
                TYPES.shorts,
                videoNode,
                videoNode.querySelector("#metadata span.ytd-video-meta-block"),
                videoNode.querySelector("a").href.substring(31, 31+11))
            );

            videoNodes = document.querySelectorAll("div#meta.style-scope.ytd-rich-grid-media");
            videoNodes.forEach(videoNode => handleNode(
                TYPES.channel,
                videoNode,
                videoNode.querySelector("#metadata-line").firstChild,
                videoNode.querySelector("a").href.substring(32, 32+11))
            );

            videoNodes = document.querySelectorAll("ytd-compact-video-renderer");
            videoNodes.forEach(videoNode => handleNode(
                TYPES.theater,
                videoNode,
                videoNode.querySelector("#metadata-line span.inline-metadata-item"),
                videoNode.querySelector("a").href.substring(32, 32+11))
            );

            videoNodes = document.querySelectorAll("a#video-title.ytd-video-renderer");
            videoNodes.forEach(videoNode => handleNode(
                TYPES.search,
                videoNode,
                videoNode.parentElement.parentElement.parentElement.querySelector(".inline-metadata-item"),
                videoNode.href.substring(32, 32+11))
            );
        }, 1_000);
    });
})();