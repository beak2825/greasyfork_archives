// ==UserScript==
// @name         Watch History for Viva+
// @namespace    http://tampermonkey.net/
// @version      2024-09-18
// @description  Display watch history/video progress on videos dynamically loaded on the page when scrolling
// @author       BattleEye
// @license      MIT
// @match        https://vivaplus.tv/supporters/videos/series/*
// @match        https://vivaplus.tv/supporters/videos/all
// @icon         https://www.google.com/s2/favicons?sz=64&domain=vivaplus.tv
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/509086/Watch%20History%20for%20Viva%2B.user.js
// @updateURL https://update.greasyfork.org/scripts/509086/Watch%20History%20for%20Viva%2B.meta.js
// ==/UserScript==

(async function() {
    'use strict';

    // Function to convert timestamp to seconds
    const convertTimestampToSeconds = (timestamp) => {
        const parts = timestamp.split(':').map(Number);
        let seconds = 0;
        if (parts.length === 3) {
            // HH:MM:SS
            seconds = parts[0] * 3600 + parts[1] * 60 + parts[2];
        } else if (parts.length === 2) {
            // MM:SS
            seconds = parts[0] * 60 + parts[1];
        }
        return seconds;
    };

    // Function to fetch and process data from each URL
    const fetchDataFromUrl = async (url) => {
        try {
            const response = await fetch(url);
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            const text = await response.text();
            const parser = new DOMParser();
            const doc = parser.parseFromString(text, 'text/html');
            // Extract the mux-player element and its start-time attribute
            const muxPlayer = doc.querySelector('mux-player');
            if (muxPlayer) {
                const startTimeStr = muxPlayer.getAttribute('start-time');
                let startTime = parseInt(startTimeStr, 10);
                if (isNaN(startTime)) {
                    startTime = 0;
                }
                return startTime;
            } else {
                console.log(`mux-player not found in ${url}`);
                return 0;
            }
        } catch (error) {
            console.error('Fetch error:', error);
            return 0;
        }
    };

    // Function to process video links
    const processVideoLinks = async (videoLinks) => {
        const promiseAll = [];
        for (const link of videoLinks) {
            promiseAll.push(loadVideoData(link));
        }
        const videoData = await Promise.all(promiseAll);
        for (const video of videoData) {
            // Construct the href selector
            const hrefSelector = `a.video[href*="/supporters/videos/${video.id}"]`;

            // Locate the <a> element with the constructed href
            const videoLink = document.querySelector(hrefSelector);

            if (videoLink) {
                // Find the div with the class video__time within the located <a> element
                const videoTimeDiv = videoLink.querySelector('div.video__time');

                if (videoTimeDiv) {
                    videoTimeDiv.style.bottom = '10px';
                    // HTML content to be inserted
                    const timeStampHtml = `
                        <div class="video__progress-overlay"></div>
                        <div class="video__progress" style="
                        ${(video.watched == 0)?'height:1px':''}
                        ">
                            <div class="video__progress-bar" style="
                            width: ${video.watched}%;
                            ${(video.watched >= 95)?'background-color:green;':''}
                            ">
                            </div>
                        </div>`;

                    // Insert the HTML content directly after the videoTimeDiv
                    videoTimeDiv.insertAdjacentHTML('afterend', timeStampHtml);
                } else {
                    console.log(`video__time not found in ${hrefSelector}`);
                }
            } else {
                console.log(`Video link not found for ${hrefSelector}`);
            }
        }
    };

    // Function to load video data
    const loadVideoData = async (link) => {
        const videoTimeDiv = link.querySelector('div.video__time');
        if (videoTimeDiv) {
            const timestamp = videoTimeDiv.textContent.trim();
            const seconds = convertTimestampToSeconds(timestamp);

            const url = link.href;
            const videoId = url.split('/').pop();
            let lastTime = await fetchDataFromUrl(url);
            if (lastTime < 0) lastTime = 0;
            const percentageWatched = (lastTime / seconds) * 100;

            return { id: videoId, watched: percentageWatched, lastTime: lastTime, length: seconds, url: url };
        }
        return null;
    };

    const processedLinks = new Set();
    // Function to check for new video links
    const checkForNewVideoLinks = async () => {
        const videoLinks = document.querySelectorAll('a.video[href*="/supporters/videos/"]');
        console.log("Found " + videoLinks.length + " video links");
        const newVideoLinks = [];
        videoLinks.forEach(link => {
            if (!processedLinks.has(link.href)) {
                processedLinks.add(link.href);
                newVideoLinks.push(link);
            }
        });
        if (newVideoLinks.length > 0) {
            await processVideoLinks(newVideoLinks);
        }
    };

    // Initial processing of video links
    await checkForNewVideoLinks()

    const debounce = (func, delay) => {
        let timeoutId;
        return (...args) => {
            if (timeoutId) {
                clearTimeout(timeoutId);
            }
            timeoutId = setTimeout(() => {
                func(...args);
            }, delay);
        };
    };

    // Add scroll event listener to check for new video links
    window.addEventListener('scroll', debounce(checkForNewVideoLinks, 500));
})();