// ==UserScript==
// @name         Return YouTube Dislike
// @namespace    http://tampermonkey.net/
// @version      3.1
// @description  Display and interact with dislikes on YouTube videos
// @author       MrBlankCoding
// @match        https://www.youtube.com/**
// @match        *://*.youtube.com/*
// @match        *://www.youtube.com/watch**
// @license MIT
// @grant        GM_xmlhttpRequest
// @grant        GM_setValue
// @grant        GM_getValue
// @run-at       document-end
// @connect      returnyoutubedislikeapi.com
// @downloadURL https://update.greasyfork.org/scripts/510637/Return%20YouTube%20Dislike.user.js
// @updateURL https://update.greasyfork.org/scripts/510637/Return%20YouTube%20Dislike.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const styles = `
        .dislike-count {
            display: inline-flex;
            align-items: center;
            margin-left: 6px;
            font-size: 14px;
            font-family: "YouTube Sans", Roboto, sans-serif;
            transition: all 0.2s ease;
        }

        .dislike-active {
            color: #ff0000 !important;
            font-weight: 500;
        }

        .dislike-count-wrapper {
            display: flex;
            align-items: center;
            gap: 4px;
        }

        .dislike-animation {
            animation: pulse 0.3s ease-in-out;
        }

        @keyframes pulse {
            0% { transform: scale(1); }
            50% { transform: scale(1.2); }
            100% { transform: scale(1); }
        }

        .yt-spec-button-shape-next__icon {
            transition: opacity 0.2s ease;
        }
    `;

    // Add styles to document
    const styleSheet = document.createElement("style");
    styleSheet.textContent = styles;
    document.head.appendChild(styleSheet);

    // Store disliked videos
    const getDislikedVideos = () => GM_getValue('dislikedVideos', {});
    const setDislikedVideos = (videos) => GM_setValue('dislikedVideos', videos);

    let originalIconHTML = null;

    window.addEventListener('yt-navigate-finish', fetchDislikeData);

    function fetchDislikeData() {
        const videoId = new URL(window.location.href).searchParams.get("v");
        if (!videoId) return;

        const apiUrl = `https://returnyoutubedislikeapi.com/votes?videoId=${videoId}`;
        GM_xmlhttpRequest({
            method: "GET",
            url: apiUrl,
            onload: function(response) {
                try {
                    const data = JSON.parse(response.responseText);
                    if (data && data.dislikes !== undefined) {
                        displayDislikeCount(data.dislikes, videoId);
                        setupStateChangeListeners(videoId);
                    }
                } catch (error) {
                    console.error('Error parsing API response:', error);
                }
            },
            onerror: function(error) {
                console.error('Error fetching data from API:', error);
            }
        });
    }

    function displayDislikeCount(dislikes, videoId) {
        const dislikeButton = document.querySelector('dislike-button-view-model');
        if (!dislikeButton) return;

        const button = dislikeButton.querySelector('button');
        if (!button) return;

        // Store original icon if not already stored
        const iconElement = button.querySelector('.yt-spec-button-shape-next__icon');
        if (iconElement && !originalIconHTML) {
            originalIconHTML = iconElement.innerHTML;
        }

        // Remove any existing dislike count
        const existingCount = button.querySelector('.dislike-count');
        if (existingCount) {
            existingCount.remove();
        }

        // Create wrapper for better organization
        const wrapper = document.createElement('div');
        wrapper.className = 'dislike-count-wrapper';

        // Create dislike count element
        const dislikeCountElement = document.createElement('span');
        dislikeCountElement.className = 'dislike-count';
        dislikeCountElement.innerText = roundNumber(dislikes);

        // Check if video is disliked
        const dislikedVideos = getDislikedVideos();
        if (dislikedVideos[videoId]) {
            dislikeCountElement.classList.add('dislike-active');
            if (iconElement) {
                iconElement.style.opacity = '0';
            }
        }

        wrapper.appendChild(dislikeCountElement);
        button.appendChild(wrapper);

        // Add click handler
        button.addEventListener('click', () => handleDislikeClick(videoId, dislikeCountElement, dislikes));
    }

    function setupStateChangeListeners(videoId) {
        // Watch for like button clicks to reset dislike state
        const likeButton = document.querySelector('like-button-view-model button');
        if (likeButton) {
            likeButton.addEventListener('click', () => {
                const dislikedVideos = getDislikedVideos();
                if (dislikedVideos[videoId]) {
                    delete dislikedVideos[videoId];
                    setDislikedVideos(dislikedVideos);
                    resetDislikeUI();
                }
            });
        }
    }

    function handleDislikeClick(videoId, countElement, currentDislikes) {
        const dislikedVideos = getDislikedVideos();
        const isDisliked = dislikedVideos[videoId];

        if (isDisliked) {
            // Undislike
            delete dislikedVideos[videoId];
            resetDislikeUI();
        } else {
            // New dislike
            dislikedVideos[videoId] = true;
            countElement.classList.add('dislike-active');
            countElement.classList.add('dislike-animation');

            const iconElement = document.querySelector('.yt-spec-button-shape-next__icon');
            if (iconElement) {
                iconElement.style.opacity = '0';
            }

            // Remove animation class after it completes
            setTimeout(() => {
                countElement.classList.remove('dislike-animation');
            }, 300);
        }

        setDislikedVideos(dislikedVideos);
    }

    function resetDislikeUI() {
        const countElement = document.querySelector('.dislike-count');
        const iconElement = document.querySelector('.yt-spec-button-shape-next__icon');

        if (countElement) {
            countElement.classList.remove('dislike-active');
        }

        if (iconElement && originalIconHTML) {
            iconElement.style.opacity = '1';
            iconElement.innerHTML = originalIconHTML;
        }
    }

    function roundNumber(num) {
        if (num >= 1000000) {
            return (num / 1000000).toFixed(1) + "M";
        } else if (num >= 1000) {
            return (num / 1000).toFixed(1) + "K";
        }
        return num.toLocaleString();
    }
})();