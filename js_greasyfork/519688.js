// ==UserScript==
// @name         Creator Presence Checker with Auth and Overlay
// @namespace    http://tampermonkey.net/
// @version      0.71
// @description  Check API for creator presence on supported websites with authentication via api.example.com cookies
// @author       You
// @match        *://*.onlyfans.com/*
// @match        *://*.fansly.com/*
// @connect      coomer.su
// @connect      *
// @grant        GM_xmlhttpRequest
// @run-at       document-idle
// @downloadURL https://update.greasyfork.org/scripts/519688/Creator%20Presence%20Checker%20with%20Auth%20and%20Overlay.user.js
// @updateURL https://update.greasyfork.org/scripts/519688/Creator%20Presence%20Checker%20with%20Auth%20and%20Overlay.meta.js
// ==/UserScript==
(function() {
    'use strict';

    // Create and add styles for the overlay
    const style = document.createElement('style');
    style.textContent = `
        .creator-check-overlay {
            position: fixed;
            top: 10px;
            left: 10px;
            background-color: rgba(0, 0, 0, 0.8);
            color: white;
            padding: 10px 15px;
            border-radius: 5px;
            font-size: 14px;
            z-index: 9999;
            max-width: 300px;
            opacity: 1;
            transition: opacity 0.3s ease-in-out;
            font-family: Arial, sans-serif;
        }
        .creator-check-overlay.success {
            background-color: rgba(40, 167, 69, 0.9);
        }
        .creator-check-overlay.error {
            background-color: rgba(220, 53, 69, 0.9);
        }
        .creator-check-overlay .close-button {
            position: absolute;
            right: 5px;
            top: 5px;
            cursor: pointer;
            opacity: 0.7;
        }
        .creator-check-overlay .close-button:hover {
            opacity: 1;
        }
        .creator-check-overlay a {
            color: #ffffff;
            text-decoration: underline;
            margin-left: 5px;
        }
        .creator-check-overlay a:hover {
            text-decoration: none;
        }
    `;
    document.head.appendChild(style);

    // Function to create and show overlay
    function showOverlay(message, isSuccess = true, creatorID = null, service = null) {
        // Remove any existing overlay
        const existingOverlay = document.querySelector('.creator-check-overlay');
        if (existingOverlay) {
            existingOverlay.remove();
        }

        // Create new overlay
        const overlay = document.createElement('div');
        overlay.className = `creator-check-overlay ${isSuccess ? 'success' : 'error'}`;

        // Add close button
        const closeButton = document.createElement('span');
        closeButton.className = 'close-button';
        closeButton.innerHTML = '✕';
        closeButton.onclick = () => {
            overlay.style.opacity = '0';
            setTimeout(() => overlay.remove(), 300);
        };

        // Create message container
        const messageContainer = document.createElement('span');
        messageContainer.textContent = message;

        // Add profile link if available
        if (isSuccess && creatorID && service) {
            const link = document.createElement('a');
            link.href = `https://coomer.su/${service.toLowerCase()}/user/${creatorID}`;
            link.textContent = 'View Profile';
            link.target = '_blank';
            messageContainer.appendChild(link);
        }

        overlay.appendChild(closeButton);
        overlay.appendChild(messageContainer);
        document.body.appendChild(overlay);

        // Auto-hide after 5 seconds
        setTimeout(() => {
            overlay.style.opacity = '0';
            setTimeout(() => overlay.remove(), 300);
        }, 5000);
    }

    let creatorID = null;
    let service = null;

    // Check if we are on onlyfans.com
    if (window.location.hostname.includes('onlyfans.com')) {
        const pathParts = window.location.pathname.split('/');
        creatorID = pathParts[pathParts.length - 1];
        service = 'onlyfans';
    }
    // Check if we are on fansly.com
    else if (window.location.hostname.includes('fansly.com')) {
        const pathParts = window.location.pathname.split('/');
        if (pathParts.length > 1 && pathParts[1] !== "posts") {
            creatorID = pathParts[1];
            service = 'fansly-service';
        }
    }

    // If a creatorID was found, call the API
    if (creatorID && service) {
        const apiUrl = `https://coomer.su/api/v1/${service}/user/${creatorID}/profile`;
        console.log('Requesting URL:', apiUrl);

        GM_xmlhttpRequest({
            method: 'GET',
            url: apiUrl,
            onload: function(response) {
                console.log('Response Status:', response.status);
                console.log('Response Headers:', response.responseHeaders);
                console.log('Raw Response:', response.responseText);

                try {
                    const data = JSON.parse(response.responseText);
                    if (data && data.id) {
                        showOverlay(`Creator ${data.name} exists on ${service}`, true, creatorID, service);
                    } else {
                        showOverlay('Creator not found.', false);
                    }
                } catch (error) {
                    showOverlay(`Error parsing response: ${error.message}`, false);
                    console.error('Parse error details:', {
                        error: error,
                        responseText: response.responseText
                    });
                }
            },
            onerror: function(error) {
                console.error('Request error:', error);
                showOverlay('Error checking API', false);
            }
        });
    } else {
        console.log('No creator ID found on this page.');
    }
})();