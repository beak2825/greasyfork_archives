// ==UserScript==
// @name         TikTok video downloader (broken)
// @namespace    http://tampermonkey.net/
// @version      0.4
// @description  Downloads videos from TikTok without the watermark.
// @author       You
// @match        https://www.tiktok.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=tiktok.com
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/481188/TikTok%20video%20downloader%20%28broken%29.user.js
// @updateURL https://update.greasyfork.org/scripts/481188/TikTok%20video%20downloader%20%28broken%29.meta.js
// ==/UserScript==

(function() {
    setInterval(function() {
        const videoId = getVideoIdFromUrl() || getVideoIdFromPlayer();

        console.log(videoId);

        const targetElements = document.querySelectorAll(".css-1cifsuk-DivActionItemContainer.e1whjx9o0, .css-1npmxy5-DivActionItemContainer.er2ywmz0, .css-1d39a26-DivFlexCenterRow.ehlq8k31");

        if (targetElements.length > 0 && videoId) {
            targetElements.forEach(function(targetElement) {
                if (!isOurButtonAlreadyAdded(targetElement)) {
                    const button = createDownloadButton();

                    try {
                        document.querySelector(".css-z6mz7r-DivVideoSwitchWrapper.e1djgv9u0").style.top = "180px";
                    } catch {
                        console.log("Different viewing method");
                    }

                    button.addEventListener("click", function() {
                        const videoId = getVideoIdFromUrl() || getVideoIdFromPlayer();
                        downloadVideo(videoId);
                    });

                    targetElement.appendChild(button);
                }
            });
        } else {
            console.error("Elements not found with the specified class or Video ID not found");
        }
    }, 2000);

    function isOurButtonAlreadyAdded(element) {
        return element.getAttribute("data-e2e") || element.querySelector('#downloadButton') !== null;
    }

    function getVideoIdFromUrl() {
        const videoUrl = window.location.href;
        const videoIdMatch = videoUrl.match(/\/video\/(\d+)/);
        return videoIdMatch ? videoIdMatch[1] : null;
    }

    function getVideoIdFromPlayer() {
        const playerElement = document.querySelector(".tiktok-web-player.no-controls");
        return playerElement ? extractIdFromPlayerId(playerElement.id) : null;
    }

    function extractIdFromPlayerId(playerId) {
        const playerIdMatch = playerId.match(/-(\d+)$/);
        return playerIdMatch ? playerIdMatch[1] : null;
    }

    function rgbToHex(r, g, b) {
        return "#" + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1);
    }

    function createDownloadButton() {
        const button = document.createElement("button");
        const arrowSpan = document.createElement("span");
        const textParagraph = document.createElement("p");
        let textColor;

        try {
            const firstButton = document.querySelector('.css-1d39a26-DivFlexCenterRow.ehlq8k31 button strong') ||
                                document.querySelector('.css-1npmxy5-DivActionItemContainer.er2ywmz0 button strong') || document.querySelector('.css-j2a19r-SpanText');
            console.log(firstButton);

            if(firstButton){textColor = getComputedStyle(firstButton).color};
        } catch (error) {
            console.error("An error occurred:", error);
        }

        arrowSpan.innerHTML = "🠳";
        textParagraph.style.fontSize = "12px";
        textParagraph.textContent = "Download";
        button.id = "downloadButton";
        button.appendChild(arrowSpan);
        button.appendChild(textParagraph);

        button.setAttribute("data-identifier", "downloadButton");
        button.style.cssText = `
            border: none;
            background: none;
            outline: none;
            padding: 0px;
            margin-right: 0px;
            position: relative;
            display: flex;
            -webkit-box-align: center;
            align-items: center;
            cursor: pointer;
            margin-bottom: 8px;
            flex-direction: column;
            font-size: 28px;
        `;


        console.log(rgbToHex(...textColor.match(/\d+/g).map(Number)));
        button.style.color = rgbToHex(...textColor.match(/\d+/g).map(Number));
        return button;
    }

    function downloadVideo(videoId) {
        fetch(`https://api16-normal-c-useast1a.tiktokv.com/aweme/v1/feed/?aweme_id=${videoId}`)
            .then(response => response.json())
            .then(data => {
                if (data && data.aweme_list && data.aweme_list.length > 0) {
                    const playAddr = data.aweme_list[0].video.play_addr.url_list[0];
                    return fetch(playAddr);
                } else {
                    console.error("Invalid API response format");
                }
            })
            .then(response => response.blob())
            .then(blob => {
                const blobUrl = URL.createObjectURL(blob);
                const downloadLink = document.createElement("a");

                downloadLink.href = blobUrl;
                downloadLink.download = `tiktok_video_${videoId}.mp4`;

                downloadLink.click();
            })
            .catch(error => console.error("Error fetching data:", error));
    }
})();
