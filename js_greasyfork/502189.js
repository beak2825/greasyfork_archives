// ==UserScript==
// @name        Bodega Bot Green Room Magnifier
// @version     1.0
// @author      Bort
// @description Adds magnifying buttons to green room cameras on Tinychat
// @match       https://tinychat.com/room/*
// @match       https://tinychat.com/*
// @grant       none
// @run-at      document-end
// @namespace   https://greasyfork.org/users/1024912
// @downloadURL https://update.greasyfork.org/scripts/502189/Bodega%20Bot%20Green%20Room%20Magnifier.user.js
// @updateURL https://update.greasyfork.org/scripts/502189/Bodega%20Bot%20Green%20Room%20Magnifier.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Function to add magnify buttons to green room cameras
    function addMagnifyButtons() {
        // Select all camera elements in the green room
        const cameras = document.querySelectorAll(".green-room-camera"); // Adjust the selector based on actual class/ID

        cameras.forEach(camera => {
            // Create magnify button
            const magnifyButton = document.createElement("button");
            magnifyButton.innerText = "🔍";
            magnifyButton.style.position = "absolute";
            magnifyButton.style.top = "10px";
            magnifyButton.style.right = "10px";
            magnifyButton.style.zIndex = "1000";
            magnifyButton.style.backgroundColor = "#fff";
            magnifyButton.style.border = "1px solid #ccc";
            magnifyButton.style.borderRadius = "5px";
            magnifyButton.style.cursor = "pointer";
            magnifyButton.onclick = () => {
                // Toggle magnify effect
                if (camera.style.transform === "scale(2)") {
                    camera.style.transform = "scale(1)";
                } else {
                    camera.style.transform = "scale(2)";
                }
            };

            // Append magnify button to the camera element
            camera.style.position = "relative"; // Ensure the camera element is positioned relatively
            camera.appendChild(magnifyButton);
        });
    }

    // Run the function to add magnify buttons after the page loads
    window.addEventListener('load', addMagnifyButtons);

    // Re-run the function if cameras are dynamically added to the DOM
    const observer = new MutationObserver(addMagnifyButtons);
    observer.observe(document.body, { childList: true, subtree: true });

})();
