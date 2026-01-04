// ==UserScript==
// @name         Spotify to YouTube Redirector
// @namespace    http://tampermonkey.net/
// @version      1.3
// @description  Redirects Spotify track links to YouTube, using the omijn/yt2spotify converter endpoint.
// @author       CL Using backend from ytm2spotify by omijn
// @match        *://*/*
// @grant        GM_xmlhttpRequest
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        GM_registerMenuCommand
// @connect      *
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/538249/Spotify%20to%20YouTube%20Redirector.user.js
// @updateURL https://update.greasyfork.org/scripts/538249/Spotify%20to%20YouTube%20Redirector.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // --- Configuration ---
    // Default API URL for the yt2spotify converter service.
    // This points to the '/convert' endpoint.
    const DEFAULT_CONVERTER_API_URL = 'https://ytm2spotify.com//convert'; // Updated API URL to include /convert

    let converterApiUrl = GM_getValue('converterApiUrl', DEFAULT_CONVERTER_API_URL);

    // --- Helper Functions ---

    function showNotification(message, isError = false) {
        const notificationId = 'spotify-yt-redirector-notification';
        let notificationElement = document.getElementById(notificationId);

        if (!notificationElement) {
            notificationElement = document.createElement('div');
            notificationElement.id = notificationId;
            Object.assign(notificationElement.style, {
                position: 'fixed',
                top: '20px',
                right: '20px',
                padding: '15px 20px',
                borderRadius: '8px',
                color: 'white',
                zIndex: '99999',
                fontSize: '16px',
                boxShadow: '0 4px 12px rgba(0,0,0,0.2)',
                opacity: '0',
                transition: 'opacity 0.5s ease-in-out, transform 0.3s ease-in-out',
                transform: 'translateX(100%)',
                fontFamily: 'Arial, sans-serif'
            });
            document.body.appendChild(notificationElement);
        }

        notificationElement.textContent = message;
        notificationElement.style.backgroundColor = isError ? '#e74c3c' : '#2ecc71'; // Red for error, Green for success

        // Animate in
        setTimeout(() => {
            notificationElement.style.opacity = '1';
            notificationElement.style.transform = 'translateX(0)';
        }, 50);

        // Automatically hide after some time
        setTimeout(() => {
            notificationElement.style.opacity = '0';
            notificationElement.style.transform = 'translateX(100%)';
        }, isError ? 7000 : 4000);
    }


    function getYouTubeLink(spotifyUrl, callback) {
        if (!converterApiUrl) {
            showNotification('Converter API URL is not configured. Please set it via the script menu if the default is incorrect.', true);
            console.error('Spotify to YouTube Redirector: Converter API URL not configured or empty.');
            callback(null, 'Configuration error: Converter API URL not set.');
            return;
        }

        showNotification('Converting Spotify link to YouTube...');
        console.log(`Attempting to convert Spotify URL: ${spotifyUrl} using API: ${converterApiUrl}`);

        // Construct the API request URL
        // The backend expects 'to_service=youtube_ytm' for YouTube conversion.
        const apiUrl = `${converterApiUrl}?url=${encodeURIComponent(spotifyUrl)}&to_service=youtube_ytm`;

        GM_xmlhttpRequest({
            method: 'GET',
            url: apiUrl,
            timeout: 15000,
            onload: function(response) {
                try {
                    if (response.status >= 200 && response.status < 300) {
                        const data = JSON.parse(response.responseText);
                        if (data && data.results && data.results.length > 0 && data.results[0].url) {
                            console.log('Conversion successful. YouTube URL:', data.results[0].url);
                            callback(data.results[0].url, null);
                        } else if (data && data.manual_search_link) {
                            console.log('Direct link not found, using manual search link:', data.manual_search_link);
                            callback(data.manual_search_link, null);
                        }
                        else {
                            console.error('Conversion failed: Invalid response structure from API. Expected "results[0].url" or "manual_search_link". Response:', data);
                            callback(null, 'Invalid response structure from converter API.');
                        }
                    } else {
                        console.error(`Conversion failed: API request error. Status: ${response.status}`, response.responseText);
                        callback(null, `Converter API request failed (Status: ${response.status}). Check API endpoint.`);
                    }
                } catch (e) {
                    console.error('Conversion failed: Error parsing API response. Is it valid JSON?', e, response.responseText);
                    callback(null, 'Error parsing converter API response.');
                }
            },
            onerror: function(error) {
                console.error('Conversion failed: Network error or CORS issue with API. Ensure the API URL is correct and allows cross-origin requests if necessary.', error);
                callback(null, 'Network error or CORS issue with converter API.');
            },
            ontimeout: function() {
                console.error('Conversion failed: API request timed out.');
                callback(null, 'Converter API request timed out.');
            }
        });
    }

    // --- Event Listener ---
    document.addEventListener('click', function(event) {
        let targetElement = event.target;
        while (targetElement && targetElement.tagName !== 'A') {
            targetElement = targetElement.parentElement;
        }

        if (targetElement && targetElement.href) {
            const url = targetElement.href;
            // Regex to identify Spotify track links
            // Example: https://open.spotify.com/track/TRACK_ID_HERE
            const spotifyTrackRegex = /^https?:\/\/open\.spotify\.com\/(?:[a-zA-Z]{2}-[a-zA-Z]{2}\/)?track\/([a-zA-Z0-9]+)/;

            if (spotifyTrackRegex.test(url)) {
                event.preventDefault();
                event.stopPropagation();

                console.log('Spotify track link clicked:', url);

                getYouTubeLink(url, function(youtubeLink, error) {
                    if (youtubeLink) {
                        showNotification(`Redirecting to YouTube: ${youtubeLink}`);
                        window.location.href = youtubeLink;
                    } else {
                        showNotification(`Error: ${error || 'Could not convert link.'} Opening original Spotify link.`, true);
                        setTimeout(() => {
                             window.open(url, '_blank');
                        }, 2000);
                    }
                });
            }
        }
    }, true); // Use capture phase

    // --- Configuration Menu ---
    GM_registerMenuCommand('Set Converter API URL', function() {
        const newUrl = prompt('Enter the full URL for your converter API (e.g., https://ytm2spotify.com//convert):', GM_getValue('converterApiUrl', DEFAULT_CONVERTER_API_URL));
        if (newUrl === null) return; // User cancelled

        if (newUrl.trim() === '') {
            GM_setValue('converterApiUrl', DEFAULT_CONVERTER_API_URL);
            converterApiUrl = DEFAULT_CONVERTER_API_URL;
            showNotification(`Converter API URL reset to default: ${DEFAULT_CONVERTER_API_URL}`);
        } else {
            converterApiUrl = newUrl.trim();
            GM_setValue('converterApiUrl', converterApiUrl);
            showNotification(`Converter API URL updated to: ${converterApiUrl}`);
        }
    });

    // Initial check and notification
    console.log('Spotify to YouTube Redirector script loaded (v1.3).');
    if (GM_getValue('converterApiUrl', DEFAULT_CONVERTER_API_URL) === 'http://localhost/your_converter_path/convert') {
         showNotification('Spotify Redirector: API URL might be an old placeholder. Current default is for yt2spotify. Configure via script menu if needed.', true);
    } else {
         showNotification('Spotify to YouTube Redirector active.');
    }

})();
