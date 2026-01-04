// ==UserScript==
// @name         neustudydl Change playStatus to 3
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Intercept and modify XMLHttpRequest to change playStatus to 3
// @author       Your Name
// @match        https://neustudydl.neumooc.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/535209/neustudydl%20Change%20playStatus%20to%203.user.js
// @updateURL https://update.greasyfork.org/scripts/535209/neustudydl%20Change%20playStatus%20to%203.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Keep track of whether the interception has already been triggered
    let triggered = false;

    // Save the original XMLHttpRequest send method
    const originalSend = XMLHttpRequest.prototype.send;

    // Overwrite the send method
    XMLHttpRequest.prototype.send = function(body) {
        // Check if the request URL matches
        if (this._url.includes('/web-api/teachmanager/teach-course-res-stu-record/studyForAudioOrVideo') && !triggered) {
            // Parse the body as JSON
            let requestBody = JSON.parse(body);

            // Modify the playStatus to 3
            requestBody.playStatus = 3;

            // Convert it back to JSON string
            body = JSON.stringify(requestBody);

            // Set the triggered flag to true
            triggered = true;
        }

        // Call the original send method with the modified body
        originalSend.call(this, body);
    };

    // Save the original XMLHttpRequest open method
    const originalOpen = XMLHttpRequest.prototype.open;

    // Overwrite the open method to store the request URL
    XMLHttpRequest.prototype.open = function(method, url) {
        this._url = url; // Store the URL
        originalOpen.apply(this, arguments); // Call the original open method
    };
})();