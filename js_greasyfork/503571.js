// ==UserScript==
// @name         TwichVODLinker
// @version      1.0
// @description  This script allows you to easily obtain the URL of the current live Twitch stream and its VOD with the exact timestamp
// @author       alejandroxv
// @match        *://*.twitch.tv/*
// @grant        none
// @require      https://code.jquery.com/jquery-3.6.0.min.js
// @namespace https://greasyfork.org/users/1351311
// @downloadURL https://update.greasyfork.org/scripts/503571/TwichVODLinker.user.js
// @updateURL https://update.greasyfork.org/scripts/503571/TwichVODLinker.meta.js
// ==/UserScript==

(function() {
    'use strict';

    let videoId = null;

    // Recursive function to find the video ID
    function findVideoId(obj) {
        if (typeof obj !== 'object' || obj === null) return null;

        if (obj.user && obj.user.videos && obj.user.videos.edges && obj.user.videos.edges[0] && obj.user.videos.edges[0].node) {
            return obj.user.videos.edges[0].node.id;
        }

        for (let key in obj) {
            if (obj.hasOwnProperty(key)) {
                let result = findVideoId(obj[key]);
                if (result) return result;
            }
        }

        return null;
    }

    // Save the original fetch function
    const originalFetch = window.fetch;

    // Override the fetch function
    window.fetch = function() {
        const args = arguments;

        if (args[0].includes('https://gql.twitch.tv/gql')) {
            const requestBody = args[1]?.body;

            if (requestBody && requestBody.includes("ChannelRoot_AboutPanel")) {
                return originalFetch.apply(this, arguments).then(response => {
                    const clonedResponse = response.clone();

                    clonedResponse.json().then(data => {
                        videoId = findVideoId(data);
                        if (videoId) {
                            console.log("Video ID found: ", videoId);
                        } else {
                            console.log("No video ID found in the response.");
                        }
                    });

                    return response;
                });
            }
        }

        return originalFetch.apply(this, arguments);
    };

    // Function to show the modal with the URL
    function showModal(url) {
        const modalHtml = `
            <div id="videoUrlModal" style="position: fixed; top: 50%; left: 50%; transform: translate(-50%, -50%);
                background-color: white; padding: 20px; box-shadow: 0 0 10px rgba(0,0,0,0.5); z-index: 10000;">
                <h3>Video URL</h3>
                <input type="text" value="${url}" style="width: 100%;" readonly>
                <button id="closeModal" style="margin-top: 10px;">Close</button>
            </div>
        `;
        $('body').append(modalHtml);
        $('#closeModal').on('click', function() {
            $('#videoUrlModal').remove();
        });
    }

    // Function to transform live-time elements
    function transformLiveTime() {
        $('.live-time').each(function() {
            const $this = $(this);
            if (!$this.data('transformed')) {
                $this.css('cursor', 'pointer');
                $this.attr('title', 'Click to show video URL');
                $this.data('transformed', true);
                $this.on('click', function() {
                    if (videoId) {
                        const timeParts = $this.text().split(':');
                        const hours = timeParts.length === 3 ? timeParts[0] : '00';
                        const minutes = timeParts.length >= 2 ? timeParts[timeParts.length - 2] : '00';
                        const seconds = timeParts[timeParts.length - 1];
                        const url = `https://www.twitch.tv/videos/${videoId}?t=${hours}h${minutes}m${seconds}s`;
                        showModal(url);
                    } else {
                        alert('No video ID found to display.');
                    }
                });
            }
        });
    }

    // Mutation observer to detect DOM changes
    const observer = new MutationObserver(transformLiveTime);
    observer.observe(document.body, { childList: true, subtree: true });

    // Call the function initially
    $(document).ready(transformLiveTime);
})();