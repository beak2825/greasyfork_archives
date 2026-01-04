// ==UserScript==
// @name         Vimeo Video Downloader
// @namespace    http://tampermonkey.net/
// @version      1.2
// @description  Provides buttons to extract the video
// @author       Tristan Reeves
// @match        *://*/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/502162/Vimeo%20Video%20Downloader.user.js
// @updateURL https://update.greasyfork.org/scripts/502162/Vimeo%20Video%20Downloader.meta.js
// ==/UserScript==

(function() {
    'use strict';

    let baseUrl = '';
    let finalUrl = '';

    // Function to handle the URL and response
    async function handleUrl(url, responseText) {
        if (url.includes("playlist.json")) {
            // Extract the base URL up to "/v2"
            baseUrl = url.split('/v2')[0];

            // Parse the JSON response to extract the audio ID
            try {
                const data = JSON.parse(responseText);

                // Extract and log video resolutions
                if (data.video) {
                    for (let key in data.video) {
                        if (data.video[key] && data.video[key].height) {
                            let height = data.video[key].height;
                            let id = data.video[key].id || 'No ID';

                            let resolution = height === 240 ? '240px' : `${height}px`;
                            const RESurl = `${baseUrl}/parcel/video/${id}.mp4`;
                            console.log(`Resolution: ${resolution}, url: ${RESurl}`);

                            // Save resolution data for use
                            if (!window.resolutions) {
                                window.resolutions = {};
                            }
                            window.resolutions[id] = resolution;
                        }
                    }
                }

                if (data.audio && data.audio.length > 0) {
                    for (let audioItem of data.audio) {
                        if (audioItem.id) {
                            let audioId = audioItem.id;

                            // Construct the final URL
                            finalUrl = `${baseUrl}/parcel/video/${audioId}.mp4`;
                            console.log("Audio+ URL: ", finalUrl);

                            // Create or update the MP4 button
                            createMp4Button(finalUrl);

                            break; // Stop after the first valid audio ID
                        }
                    }
                }
            } catch (e) {
                console.error("Error parsing JSON response:", e);
            }
        }
    }

    function createMp4Button(finalUrl) {
        // Remove any existing buttons to avoid duplicates
        removeExistingButtons();

        // Create the MP4 button
        const mp4Button = document.createElement('button');
        mp4Button.id = 'vimeo-mp4-button';
        mp4Button.textContent = 'Mp4';
        mp4Button.style.position = 'fixed';
        mp4Button.style.top = '20px';
        mp4Button.style.right = '20px';
        mp4Button.style.padding = '8px 12px';
        mp4Button.style.backgroundColor = 'rgba(0, 123, 255, 0.2)'; // Transparent blue
        mp4Button.style.color = 'rgba(255, 255, 255, 0.7)'; // Semi-transparent text
        mp4Button.style.border = 'none';
        mp4Button.style.borderRadius = '12px';
        mp4Button.style.boxShadow = '0 4px 8px rgba(0, 0, 0, 0.2)';
        mp4Button.style.cursor = 'pointer';
        mp4Button.style.zIndex = '9999';
        mp4Button.style.fontSize = '14px';
        mp4Button.style.fontWeight = 'bold';
        mp4Button.style.transition = 'background-color 0.3s ease, color 0.3s ease, transform 0.2s ease';
        mp4Button.style.opacity = '0.3'; // Default opacity

        // Add hover effect
        mp4Button.addEventListener('mouseover', () => {
            mp4Button.style.backgroundColor = 'rgba(0, 123, 255, 0.5)'; // Semi-transparent blue on hover
            mp4Button.style.color = 'rgba(255, 255, 255, 1)'; // Full opacity text
            mp4Button.style.transform = 'scale(1.05)';
            mp4Button.style.opacity = '1'; // Full opacity
            triangle.style.opacity = '0'; // Reduced opacity

        });

        mp4Button.addEventListener('mouseout', () => {
            mp4Button.style.backgroundColor = 'rgba(0, 123, 255, 0.2)'; // Transparent blue
            mp4Button.style.color = 'rgba(255, 255, 255, 0.7)'; // Semi-transparent text
            mp4Button.style.transform = 'scale(1)';
            mp4Button.style.opacity = '0.3'; // Reduced opacity
            triangle.style.opacity = '0.2'; // Reduced opacity
        });

        // Append MP4 button to the document body
        document.body.appendChild(mp4Button);

        // Add click event to the MP4 button
        mp4Button.addEventListener('click', function() {
            window.open(finalUrl, '_blank', 'noopener,noreferrer');
        });

        // Create the Video button
        const videoButton = document.createElement('button');
        videoButton.id = 'vimeo-video-button';
        videoButton.textContent = 'Video';
        videoButton.style.position = 'fixed';
        videoButton.style.top = '55px';
        videoButton.style.right = '20px';
        videoButton.style.padding = '8px 12px';
        videoButton.style.backgroundColor = 'rgba(40, 167, 69, 0.2)'; // Transparent green
        videoButton.style.color = 'rgba(255, 255, 255, 0.7)'; // Semi-transparent text
        videoButton.style.border = 'none';
        videoButton.style.borderRadius = '12px';
        videoButton.style.boxShadow = '0 4px 8px rgba(0, 0, 0, 0.2)';
        videoButton.style.cursor = 'pointer';
        videoButton.style.zIndex = '9999';
        videoButton.style.fontSize = '14px';
        videoButton.style.fontWeight = 'bold';
        videoButton.style.transition = 'background-color 0.3s ease, color 0.3s ease, transform 0.2s ease';
        videoButton.style.opacity = '0.3'; // Default opacity

        // Add hover effect
        videoButton.addEventListener('mouseover', () => {
            videoButton.style.backgroundColor = 'rgba(40, 167, 69, 0.5)'; // Semi-transparent green on hover
            videoButton.style.color = 'rgba(255, 255, 255, 1)'; // Full opacity text
            videoButton.style.transform = 'scale(1.05)';
            videoButton.style.opacity = '1'; // Full opacity
            triangle.style.opacity = '0'; // Reduced opacity
        });

        videoButton.addEventListener('mouseout', () => {
            videoButton.style.backgroundColor = 'rgba(40, 167, 69, 0.2)'; // Transparent green
            videoButton.style.color = 'rgba(255, 255, 255, 0.7)'; // Semi-transparent text
            videoButton.style.transform = 'scale(1)';
            videoButton.style.opacity = '0.3'; // Reduced opacity
            triangle.style.opacity = '0.2'; // Reduced opacity
        });

        // Append Video button to the document body
        document.body.appendChild(videoButton);

        // Add click event to the Video button
        videoButton.addEventListener('click', function() {
            // Toggle visibility of resolution buttons
            const resolutionButtons = document.querySelectorAll('.vimeo-resolution-button');
            const isVisible = resolutionButtons.length > 0;
            if (isVisible) {
                resolutionButtons.forEach(button => button.remove());
            } else {
                createResolutionButtons();
            }
        });

        // Create the triangle above the MP4 button
        const triangle = document.createElement('div');
        triangle.id = 'vimeo-triangle';
        triangle.style.position = 'fixed';
        triangle.style.top = '8px';
        triangle.style.right = '40px';
        triangle.style.width = '0';
        triangle.style.height = '0';
        triangle.style.borderLeft = '8px solid transparent';
        triangle.style.borderRight = '8px solid transparent';
        triangle.style.borderTop = '8px solid black'; // Inverted triangle (downward-pointing)
        triangle.style.opacity = '0.7';
        triangle.style.transition = 'opacity 0.2s ease';
        document.body.appendChild(triangle);
    }

    function createResolutionButtons() {
        // Remove any existing resolution buttons
        const existingResolutionButtons = document.querySelectorAll('.vimeo-resolution-button');
        existingResolutionButtons.forEach(button => button.remove());

        // Get the video button's position
        const videoButton = document.getElementById('vimeo-video-button');
        const videoButtonRect = videoButton.getBoundingClientRect();
        const videoButtonTop = videoButtonRect.bottom;

        // Get all resolution IDs
        let currentTop = videoButtonTop + 10; // Initial vertical offset

        for (let id in window.resolutions) {
            if (window.resolutions.hasOwnProperty(id)) {
                const resolution = window.resolutions[id];

                // Create a resolution button
                const button = document.createElement('button');
                button.textContent = resolution;
                button.className = 'vimeo-resolution-button';
                button.style.position = 'fixed';
                button.style.top = `${currentTop}px`; // Adjust position to align with the video button
                button.style.right = '20px';
                button.style.padding = '8px 12px';
                button.style.backgroundColor = 'rgba(40, 147, 89, 0.8)'; // Slightly different green
                button.style.color = 'rgba(255, 255, 255, 0.7)'; // Semi-transparent text
                button.style.border = 'none';
                button.style.borderRadius = '12px';
                button.style.boxShadow = '0 4px 8px rgba(0, 0, 0, 0.2)';
                button.style.cursor = 'pointer';
                button.style.zIndex = '9999';
                button.style.fontSize = '12px';
                button.style.fontWeight = 'bold';
                button.style.marginBottom = '4px'; // Space between buttons
                button.style.display = 'block'; // Stack vertically

                // Add click event to the resolution button
                button.addEventListener('click', function() {
                    const url = `${baseUrl}/parcel/video/${id}.mp4`;
                    window.open(url, '_blank', 'noopener,noreferrer');
                });

                // Append button to the document body
                document.body.appendChild(button);

                // Update the position for the next button
                currentTop += button.offsetHeight + 4; // Add space between buttons
            }
        }
    }

    function removeExistingButtons() {
        const buttonsToRemove = [
            'vimeo-mp4-button',
            'vimeo-video-button',
            'vimeo-triangle'
        ];
        buttonsToRemove.forEach(id => {
            const button = document.getElementById(id);
            if (button) {
                button.remove();
            }
        });
    }

    // Intercept XMLHttpRequests
    (function(open, send) {
        XMLHttpRequest.prototype.open = function(method, url, async, user, password) {
            this._url = url;
            open.call(this, method, url, async, user, password);
        };
        XMLHttpRequest.prototype.send = function(body) {
            this.addEventListener('load', function() {
                if (this.responseType === 'text' || this.responseType === '') {
                    handleUrl(this._url, this.responseText);
                }
            });
            send.call(this, body);
        };
    })(XMLHttpRequest.prototype.open, XMLHttpRequest.prototype.send);

    // Intercept Fetch API calls
    (function(fetch) {
        window.fetch = function() {
            return fetch.apply(this, arguments).then(response => {
                let url = response.url;
                if (response.headers.get('Content-Type') === 'application/json' || response.headers.get('Content-Type') === null) {
                    return response.text().then(text => {
                        handleUrl(url, text);
                    });
                }
                return response;
            });
        };
    })(window.fetch);

})();
