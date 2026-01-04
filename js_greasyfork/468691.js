// ==UserScript==
// @name         Tildes with Youtube embeds
// @namespace    mitigd
// @version      0.1
// @description  Tildes with the ability to view Youtube videos inline.
// @author       mitigd
// @match        https://tildes.net/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=tildes.net
// @grant        GM_addStyle
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/468691/Tildes%20with%20Youtube%20embeds.user.js
// @updateURL https://update.greasyfork.org/scripts/468691/Tildes%20with%20Youtube%20embeds.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const currentPage = window.location.href;
    console.log(currentPage);

    const pathRegex = /\/~([^/]+)/;
    const matches = currentPage.match(pathRegex);

    if (matches !== null) {
        const pageAfterTilde = matches[1];
        console.log("Tilde found in the link. Page after tilde:", pageAfterTilde);

        const topicLink = document.querySelector(".topic-full-link");

        if (topicLink) {
            const aTag = topicLink.querySelector("a");

            if (aTag.href.includes("https://www.youtube.com")) {
                console.log("YouTube link found");

                const buttonEmbed = document.createElement("button");
                buttonEmbed.type = "button";
                buttonEmbed.classList.add('fas', 'fa-arrow-right', 'btn');
                buttonEmbed.style.width = "20px";
                buttonEmbed.style.height = "20px";
                buttonEmbed.style.display = 'flex';
                buttonEmbed.style.justifyContent = 'center';
                buttonEmbed.style.alignItems = 'center';
                buttonEmbed.style.marginRight = "10px";
                buttonEmbed.style.marginTop = "5px";

                let iframeDisplayed = false;

                buttonEmbed.onclick = function () {
                    if (iframeDisplayed) {
                        const embeddedVideo = topicLink.nextSibling;
                        if (embeddedVideo && embeddedVideo.tagName === "IFRAME") {
                            embeddedVideo.parentNode.removeChild(embeddedVideo);
                        }
                        iframeDisplayed = false;
                    } else {
                        const videoLink = topicLink.querySelector('a').href;
                        const videoID = videoLink.split('v=')[1];

                        const embeddedVideo = document.createElement("iframe");
                        embeddedVideo.src = "https://www.youtube.com/embed/" + videoID;
                        embeddedVideo.width = "560";
                        embeddedVideo.height = "315";
                        embeddedVideo.allowFullscreen = true;

                        topicLink.parentNode.insertBefore(embeddedVideo, topicLink.nextSibling);

                        iframeDisplayed = true;
                    }
                };

                topicLink.prepend(buttonEmbed);
            }
        }
    } else {
        console.log("Tilde not found in the link or not in the desired position");

        const listPosts = document.querySelectorAll('.topic');

        for (let i = 0; i < listPosts.length; i++) {
            const hasMatch = listPosts[i];
            const aTag = hasMatch.querySelector("a").href;

            console.log(aTag);

            const titleElement = listPosts[i].querySelector("h1");
            const linkGroup = listPosts[i].querySelector('.link-group');

            if (aTag.includes("https://www.youtube.com") && titleElement && titleElement.parentNode) {
                const buttonEmbed = document.createElement("button");
                buttonEmbed.type = "button";
                buttonEmbed.classList.add('fas', 'fa-arrow-right', 'btn');
                buttonEmbed.style.width = "20px";
                buttonEmbed.style.height = "20px";
                buttonEmbed.style.display = 'flex';
                buttonEmbed.style.justifyContent = 'center';
                buttonEmbed.style.alignItems = 'center';
                buttonEmbed.style.marginRight = "10px";
                buttonEmbed.style.marginTop = "5px";

                let iframeDisplayed = false;

                buttonEmbed.onclick = function () {
                    if (iframeDisplayed) {
                        const embeddedVideo = listPosts[i].nextSibling;
                        if (embeddedVideo && embeddedVideo.tagName === "IFRAME") {
                            embeddedVideo.parentNode.removeChild(embeddedVideo);
                        }
                        iframeDisplayed = false;
                    } else {
                        const videoLink = listPosts[i].querySelector('a').href;
                        const videoID = videoLink.split('v=')[1];

                        const embeddedVideo = document.createElement("iframe");
                        embeddedVideo.src = "https://www.youtube.com/embed/" + videoID;
                        embeddedVideo.width = "560";
                        embeddedVideo.height = "315";
                        embeddedVideo.allowFullscreen = true;

                        listPosts[i].parentNode.insertBefore(embeddedVideo, listPosts[i].nextSibling);

                        iframeDisplayed = true;
                    }
                };

                linkGroup.parentNode.insertBefore(buttonEmbed, linkGroup.nextSibling);
            }
        }
    }

    GM_addStyle(`
        @import url('https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.15.3/css/all.min.css');
    `);
})();
