// ==UserScript==
// @name         Send YouTube Video to JDownloader
// @namespace    Violentmonkey Scripts
// @version      1.0
// @description  Adds a button to send YouTube video to JDownloader via CNL2 with success and error toast notifications
// @author       MonkCanatella
// @match        https://www.youtube.com/watch*
// @grant        GM_xmlhttpRequest
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/513212/Send%20YouTube%20Video%20to%20JDownloader.user.js
// @updateURL https://update.greasyfork.org/scripts/513212/Send%20YouTube%20Video%20to%20JDownloader.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Function to show toast
    function showToast(message, type = 'success') {
        const toast = document.createElement('div');
        toast.textContent = message;
        toast.style.position = 'fixed';
        toast.style.bottom = '20px';
        toast.style.right = '20px';
        toast.style.padding = '15px';
        toast.style.backgroundColor = type === 'success' ? '#28a745' : '#dc3545'; // Green for success, red for error
        toast.style.color = 'white';
        toast.style.borderRadius = '5px';
        toast.style.zIndex = '10000';
        toast.style.fontFamily = 'Arial, sans-serif';
        toast.style.boxShadow = '0 4px 8px rgba(0, 0, 0, 0.1)';
        toast.style.opacity = '0';
        toast.style.transition = 'opacity 0.5s ease';

        // Append to body
        document.body.appendChild(toast);

        // Fade in
        setTimeout(() => {
            toast.style.opacity = '1';
        }, 100);

        // Auto-remove after 3 seconds
        setTimeout(() => {
            toast.style.opacity = '0';
            setTimeout(() => document.body.removeChild(toast), 500);
        }, 3000);
    }

    function sendToJDownloader() {
        const videoUrl = window.location.href;  // Get the current video URL

        GM_xmlhttpRequest({
            method: "POST",
            url: "http://127.0.0.1:9666/flash/add",
            headers: {
                "Content-Type": "application/x-www-form-urlencoded"
            },
            data: `source=${encodeURIComponent(window.location.href)}&urls=${encodeURIComponent(videoUrl)}`,
            onload: function(response) {
                if (response.status === 200) {
                    showToast("Video URL sent to JDownloader!", 'success');
                } else {
                    showToast("Failed to send URL to JDownloader.", 'error');
                }
            },
            onerror: function() {
                showToast("Could not connect to JDownloader. Make sure it's running!", 'error');
            }
        });
    }

    // Add a button to the page
    const button = document.createElement('button');
    button.textContent = 'Send to JDownloader';
    button.style.position = 'fixed';
    button.style.bottom = '10px';
    button.style.right = '10px';
    button.style.zIndex = 1000;
    button.style.padding = '10px';
    button.style.backgroundColor = '#007BFF';
    button.style.color = 'white';
    button.style.border = 'none';
    button.style.borderRadius = '5px';
    button.style.cursor = 'pointer';

    // Add click event to send the current URL to JDownloader
    button.addEventListener('click', sendToJDownloader);

    // Append the button to the page
    document.body.appendChild(button);

})();
