// ==UserScript==
// @name         JSON Formatter for WordPress Textarea box with Zoom and Copy
// @namespace    http://tampermonkey.net/
// @version      1.13
// @description  Format JSON content in a textarea to be readable, stylish, zoomable, and copyable
// @author       attila.virag@centralmediacsoport.hu
// @icon         https://www.google.com/s2/favicons?sz=64&domain=wordpress.com
// @match        */wp-admin/post.php?post=*
// @grant        none
// @license      startlap.hu
// @downloadURL https://update.greasyfork.org/scripts/486671/JSON%20Formatter%20for%20WordPress%20Textarea%20box%20with%20Zoom%20and%20Copy.user.js
// @updateURL https://update.greasyfork.org/scripts/486671/JSON%20Formatter%20for%20WordPress%20Textarea%20box%20with%20Zoom%20and%20Copy.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Először ellenőrizzük, hogy létezik-e a kívánt div elem
    var requiredDiv = document.getElementById('podcast_body_json');
    if (!requiredDiv) {
        console.error("Required div #podcast_body_json not found. Script will not execute.");
        return; // Ne folytassuk, ha nem található a div
    }

    // Function to format JSON
    function formatJSON(input) {
        if (typeof input !== 'string') {
            console.error("Invalid input for JSON parsing:", input);
            return ''; // Return an empty string if the input is not a string
        }

        try {
            var json = JSON.parse(input);
            var formatted = JSON.stringify(json, null, 4);
            return formatted;
        } catch (e) {
            console.error("JSON parsing error:", e);
            return input; // Return the original input if the JSON is not valid
        }
    }

    // Function to apply formatting
    function applyFormatting(event) {
        if (event) event.preventDefault();
        if (textarea && textarea.value) {
            textarea.value = formatJSON(textarea.value);
            styleTextarea(textarea); // Apply CSS styles to the textarea
        } else {
            console.error("Textarea not found or empty");
        }
    }

    // Function to apply CSS styles to the textarea
    function styleTextarea(textarea) {
        textarea.style.backgroundColor = "#f9f9f9";
        textarea.style.color = "#333";
        textarea.style.fontFamily = "Monaco, 'Lucida Console', monospace";
        textarea.style.fontSize = "11px";
        textarea.style.border = "1px solid #ccc";
        textarea.style.boxShadow = "inset 0 1px 1px rgba(0,0,0,.075)";
        textarea.style.padding = "2px 4px";
    }

    // Function to copy JSON to clipboard
    function copyToClipboard() {
        if (textarea && textarea.value) {
            navigator.clipboard.writeText(textarea.value).then(() => {
                console.log('JSON copied to clipboard successfully.');
            }).catch(err => {
                console.error('Error in copying text: ', err);
            });
        }
    }

    var textarea = document.querySelector('textarea[name="podcast_body_json"]');

    // Function to add CSS styles dynamically
    function addCustomStyles() {
        const style = document.createElement('style');
        style.type = 'text/css';
        style.innerHTML = `
        .podcast-body-json-box { text-align: right; }
        .podcast-body-json-box .button { margin-left: 5px; }
    `;
        document.head.appendChild(style);
    }

    addCustomStyles(); // Call the function to add the styles

    // Toggle Zoom functionality
    function toggleZoom() {
        var div = document.querySelector('div#podcast_body_json');
        if (div && textarea) {
            if (div.style.position === 'absolute') {
                // Reset styles to default for the div
                div.style.position = 'relative';
                div.style.zIndex = 'inherit';
                div.style.top = 'unset';
                div.style.left = 'unset';
                div.style.right = 'unset';
                div.style.height = '280px';
                div.style.background = 'inherit';
                // Reset the textarea height to default
                textarea.style.height = '200px';
            } else {
                // Apply zoom styles to the div
                div.style.position = 'absolute';
                div.style.zIndex = '999999';
                div.style.top = '10px';
                div.style.left = '10px';
                div.style.right = '30px';
                div.style.height = '500px';
                div.style.background = 'cornflowerblue';
                // Apply custom height to the textarea
                textarea.style.height = '418px';
            }
        }
    }

    // Create a button to trigger formatting manually
    var formatButton = document.createElement('button');
    formatButton.textContent = 'Format';
    formatButton.type = 'button';
    formatButton.className = 'button';
    formatButton.addEventListener('click', applyFormatting);

    // Create a button to toggle zoom
    var zoomButton = document.createElement('button');
    zoomButton.textContent = 'Zoom';
    zoomButton.type = 'button';
    zoomButton.className = 'button';
    zoomButton.addEventListener('click', toggleZoom);

    // Create a button to copy JSON to clipboard
    var copyButton = document.createElement('button');
    copyButton.textContent = 'Copy';
    copyButton.type = 'button';
    copyButton.className = 'button';
    copyButton.addEventListener('click', copyToClipboard);

    if (textarea) {
        // Add buttons next to the textarea
        textarea.parentNode.insertBefore(formatButton, textarea.nextSibling);
        textarea.parentNode.insertBefore(zoomButton, formatButton.nextSibling);
        textarea.parentNode.insertBefore(copyButton, zoomButton.nextSibling);
        styleTextarea(textarea); // Apply CSS styles to the textarea immediately
    } else {
        // Fallback if textarea is not found
        document.body.appendChild(formatButton);
        document.body.appendChild(zoomButton);
        document.body.appendChild(copyButton);
    }
})();