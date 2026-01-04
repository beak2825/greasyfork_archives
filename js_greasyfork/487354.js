// ==UserScript==
// @name Bing Tab Title Changer
// @namespace https://tampermonkey.net/
// @version 0.2
// @description Change the tab title to the keys you type on Bing search pages
// @author perXautomatik
// @match https://www.bing.com/search?q=*
// @grant none
// @license MIT 
// @downloadURL https://update.greasyfork.org/scripts/487354/Bing%20Tab%20Title%20Changer.user.js
// @updateURL https://update.greasyfork.org/scripts/487354/Bing%20Tab%20Title%20Changer.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Create an array to store the buffered keys
    var buffer = [];

    // Create a variable to store the prefix
    var prefix = "Bing ChatGPT: ";

    // Add a keydown event listener to the document
    document.addEventListener("keydown", function(event) {
        // Check if the key is Enter
        if (event.key === "Enter") {
            // Set the tab title to the prefix and the buffered keys joined as a string
            document.title = prefix + buffer.join("");
            // Clear the buffer
            buffer = [];
        } else if (event.key === "Backspace" || event.key === "Delete") {
            // Remove the last key from the buffer
            buffer.pop();
        } else {
            // Check if the key is an arrow key
            if (event.key !== "ArrowUp" && event.key !== "ArrowDown") {
                // Push the key to the buffer
                buffer.push(event.key);
            }
        }
    });
})();
