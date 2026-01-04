// ==UserScript==
// @name        Upload your own themes
// @description  This script allows you to upload your own themes to Discord.
// @version      1.0
// @author       Midnight
// @namespace    https://google.com
// @match        *://*/*
// @run-at       document-start
// @grant        none
// @license      MIT License
// @downloadURL https://update.greasyfork.org/scripts/467188/Upload%20your%20own%20themes.user.js
// @updateURL https://update.greasyfork.org/scripts/467188/Upload%20your%20own%20themes.meta.js
// ==/UserScript==

(function() {
    "use strict";

    function uploadTheme(url) {
        // Get the Discord window.
        const discordWindow = window.opener || window.parent;

        // Create a new XMLHttpRequest object.
        const xhr = new XMLHttpRequest();

        // Set the request method to "POST".
        xhr.open("POST", url);

        // Set the request headers.
        xhr.setRequestHeader("Content-Type", "application/json");

        // Send the request.
        xhr.send(JSON.stringify({
            "theme": {
                "name": "My Theme",
                "css": ""
            }
        }));

        // Handle the response.
        xhr.onload = function() {
            if (xhr.status === 200) {
                // The theme was uploaded successfully.
                alert("Theme uploaded successfully!");
            } else {
                // The theme could not be uploaded.
                alert("Error uploading theme: " + xhr.status);
            }
        };
    }

    // Get the URL of the theme that the user wants to upload.
    const themeUrl = prompt("Enter the URL of the theme that you want to upload:");

    // Upload the theme.
    uploadTheme(themeUrl);
})();
