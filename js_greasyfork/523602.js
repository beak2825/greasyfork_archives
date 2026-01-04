// ==UserScript==
// @name         StumbleTube
// @namespace    StumbleTube
// @version      1.0
// @description  Play youtube videos from the chat box on StumbleChat
// @author       Goji
// @match        https://stumblechat.com/room/*
// @downloadURL https://update.greasyfork.org/scripts/523602/StumbleTube.user.js
// @updateURL https://update.greasyfork.org/scripts/523602/StumbleTube.meta.js
// ==/UserScript==

(function () {
    // Save the original WebSocket send method to allow overriding
    WebSocket.prototype._send = WebSocket.prototype.send;

    // Override the WebSocket send method to attach a custom message handler
    WebSocket.prototype.send = function (data) {
        this._send(data); // Call the original send method

        // Ensure the message handler is added only once per WebSocket instance
        if (!this._messageHandlerAdded) {
            this.addEventListener('message', handleMessage.bind(this), false);
            this._messageHandlerAdded = true;
        }
    };

    /**
     * Handles incoming WebSocket messages to process YouTube-related commands.
     * @param {MessageEvent} msg - The incoming WebSocket message.
     */
    function handleMessage(msg) {
        // Safely parse the incoming message data as JSON
        const wsmsg = safeJSONParse(msg.data);

        // If the message is not valid JSON, log an error and exit
        if (!wsmsg) {
            console.error('Invalid JSON message received:', msg.data);
            return;
        }

        // Define an array of keywords to detect YouTube-related commands
        var keywords = ['.youtube', '.video', '.play', '.yt'];

        /**
         * Converts various YouTube URL formats into a standard format.
         * @param {string} url - The YouTube URL to be converted.
         * @returns {string|null} - The standardized YouTube link or null if invalid.
         */
        function convertToRegularYouTubeLink(url) {
            // Regular expression to extract the video ID from different YouTube URL formats
            var videoIdRegex = /(?:https?:\/\/)?(?:www\.)?(?:youtu\.be\/|youtube\.com\/(?:watch\?v=|embed\/|v\/|shorts\/|.*[?&]v=))([\w-]+)/;
            var match = url.match(videoIdRegex);

            // If a video ID is found, return the standardized link
            if (match && match[1]) {
                return 'https://www.youtube.com/watch?v=' + match[1];
            }

            // Return null if the URL does not match the expected formats
            return null;
        }

        // Loop through the defined keywords to check for a match in the message text
        for (var i = 0; i < keywords.length; i++) {
            // Check if the "text" property of the message starts with a keyword
            if (wsmsg['text'].startsWith(keywords[i])) {
                // Extract the query part of the message after the keyword
                var query = wsmsg['text'].substring(keywords[i].length).trim();

                // Ensure the query is not empty before proceeding
                if (query) {
                    // Attempt to convert the query into a standardized YouTube link
                    var regularLink = convertToRegularYouTubeLink(query);

                    // If the query is a valid YouTube link, send it in a formatted message
                    if (regularLink) {
                        this._send('{"stumble": "youtube","type": "add","id": "' + regularLink + '","time": 0}');
                    } else {
                        // For non-URL queries, treat them as search terms and send as is
                        this._send('{"stumble": "youtube","type": "add","id": "' + query + '","time": 0}');
                    }
                }

                // Exit the loop once the query has been processed
                break;
            }
        }
    }

    /**
     * Safely parses a JSON string, logging an error if parsing fails.
     * @param {string} jsonString - The JSON string to parse.
     * @returns {Object|null} - The parsed JSON object or null if parsing fails.
     */
    function safeJSONParse(jsonString) {
        try {
            return JSON.parse(jsonString);
        } catch (error) {
            console.error('Error parsing JSON:', error);
            return null;
        }
    }
})();
