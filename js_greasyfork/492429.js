// ==UserScript==
// @name         Discord keklol Emoji Add-on without Nitro
// @version      1.0
// @description  Replaces ":keklol:" in messages with the kekw emoji link. Join my server for updates: https://discord.gg/kS7P7gRZcg
// @author       ∫(Ace)³dx
// @match        https://discord.com/*
// @icon         https://i.imgur.com/0CCc0Yr.png
// @grant        none
// @license MIT
// @namespace https://greasyfork.org/users/449798
// @downloadURL https://update.greasyfork.org/scripts/492429/Discord%20keklol%20Emoji%20Add-on%20without%20Nitro.user.js
// @updateURL https://update.greasyfork.org/scripts/492429/Discord%20keklol%20Emoji%20Add-on%20without%20Nitro.meta.js
// ==/UserScript==

// Function to modify the content according to the specified rules
function modifyContent(content) {
    // Replace ":keklol:" with the desired replacement
    content = content.replace(/:keklol:/g, '[‎឴᠍](https://i.imgur.com/0CCc0Yr.png)');

    return content;
}

// Function to intercept and modify the POST request
function interceptPostRequest() {
    // Save the original open function
    var originalOpen = window.XMLHttpRequest.prototype.open;

    // Intercept the open function
    window.XMLHttpRequest.prototype.open = function(method, url) {
        // Check if it's a POST request to the specified URL format
        if (method.toLowerCase() === 'post' && url.includes('https://discord.com/api/v9/channels/')) {
            // Save reference to XMLHttpRequest object
            var xhr = this;

            // Save the original send function
            var originalSend = xhr.send;

            // Intercept the send function
            xhr.send = function(data) {
                // Modify the data if it's JSON
                if (data && typeof data === 'string' && data.startsWith('{')) {
                    try {
                        var jsonData = JSON.parse(data);
                        if (jsonData.content) {
                            // Modify the content
                            jsonData.content = modifyContent(jsonData.content);
                            // Convert back to JSON string
                            data = JSON.stringify(jsonData);
                        }
                    } catch (error) {
                        console.error('Error parsing JSON data:', error);
                    }
                }

                // Call the original send function with modified data
                originalSend.apply(xhr, [data]);
            };
        }

        // Call the original open function
        originalOpen.apply(this, arguments);
    };
}

// Call the function to start intercepting POST requests
interceptPostRequest();
