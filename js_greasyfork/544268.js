// ==UserScript==
// @name         Alt Click To Download Image
// @namespace    http://tampermonkey.net/
// @version      2.1
// @description  Hold Alt key and click any image to download. Uses a robust method to bypass common download issues. Uses original filename and original download location.
// @author       BerkeA111
// @match        https://*/*
// @match        http://*/*
// @grant        GM_xmlhttpRequest
// @grant        GM_notification
// @connect      *
// @icon         data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABgAAAAYCAYAAADgdz34AAAAAXNSR0IArs4c6QAAARNJREFUWEft1rFKA0EQxvFfEa4cFA9gL2An2OotYGFjL7GysxAsrLQTfIAgsVew8wewV7CwshCwsNAFiZcll2RyU5lF9sPDu++3/2RyMhLxPw48B16AngvwDgwCg/gC7IA+6BWE5wBwAaeYyX8h2IEVcF2g8ACwAitA83sBvgENwAuwC5w3C+Cn4Y+Ab+AV+AnAZAhPgXvgvbi+/YFPwDXgBziFw4BTOgRk8gQcA9q+vrzYUsVg6ekEuhG4rG8C3gK/EWhz8AIsK78DrwEPQN84nAXwA3wDPls/gJNxHPgGfAI2gfPANOAfMJI3gc/AEPAV2AZuAA/gI3AEvAY+Ad8BbwQ2s213wBfAG7DWBCLa/g/yB3f90lY2grRFAAAAAElFTkSuQmCC
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/544268/Alt%20Click%20To%20Download%20Image.user.js
// @updateURL https://update.greasyfork.org/scripts/544268/Alt%20Click%20To%20Download%20Image.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // --- CONFIGURATION ---
    const MODIFIER_KEY = 'altKey'; // Change to 'ctrlKey' or 'shiftKey' if you prefer.

    document.addEventListener('click', function(event) {

        // Check if the correct modifier key was held and if the clicked element is an image.
        if (event[MODIFIER_KEY] && event.target.tagName === 'IMG') {

            // Stop the browser's default action (e.g., navigating to the image).
            event.preventDefault();
            event.stopPropagation();

            const imageUrl = event.target.src;

            if (!imageUrl) {
                notify('Download Failed', 'Could not find the source URL for the clicked image.');
                return;
            }

            // This is a more powerful download method that helps bypass cross-origin security issues.
            // It fetches the image data first, then triggers a download from your browser's memory.
            GM_xmlhttpRequest({
                method: "GET",
                url: imageUrl,
                responseType: "blob", // We want the raw image data as a 'blob'.
                onload: function(response) {
                    // Get the final URL after any redirects.
                    const finalUrl = response.finalUrl || imageUrl;

                    // --- FILENAME LOGIC: Use the original name ---
                    // It will not be modified. We derive it from the last part of the URL path.
                    // This is the most reliable way to get a file's name without server headers.
                    let filename = finalUrl.substring(finalUrl.lastIndexOf('/') + 1).split('?')[0];
                    if (!filename) {
                        filename = "downloaded-image"; // Fallback name if URL ends in '/'
                    }

                    // Create a temporary link in memory to trigger the download.
                    const link = document.createElement('a');
                    link.href = URL.createObjectURL(response.response);
                    link.download = filename;

                    // Trigger the download and then clean up.
                    link.click();
                    URL.revokeObjectURL(link.href); // Free up memory.

                    notify('Download Started', `Downloading: ${filename}`);
                },
                onerror: function(error) {
                    console.error("Direct Downloader Error:", error);
                    notify('Download Failed', 'Could not fetch image. The server may be blocking it.');
                }
            });
        }
    }, true);

    // Helper function for showing notifications.
    function notify(title, text) {
        GM_notification({
            title: title,
            text: text,
            timeout: 4000
        });
    }
})();