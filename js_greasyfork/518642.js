// ==UserScript==
// @name         Reddit - Auto-Translation Bypass / Redirect back to original post 
// @namespace    https://nemeth.it/
// @version      0.2
// @description  Bypasses translated pages by removing "tl" parameter after 5 seconds and redirecting towards it (cancel option available)
// @license      MIT
// @author       nemeth.it
// @match        *://*.reddit.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/518642/Reddit%20-%20Auto-Translation%20Bypass%20%20Redirect%20back%20to%20original%20post.user.js
// @updateURL https://update.greasyfork.org/scripts/518642/Reddit%20-%20Auto-Translation%20Bypass%20%20Redirect%20back%20to%20original%20post.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Function to check if the "tl" parameter exists in the URL
    function hasParameter(name) {
        return new URL(window.location.href).searchParams.has(name);
    }

    // Removes the "tl" parameter from the URL and reloads the page
    function reloadWithoutParameter() {
        const url = new URL(window.location.href);
        url.searchParams.delete("tl");
        window.location.href = url.toString();
    }

    // Displays the notice with a cancel button
    function showNotice() {
        // Create the notice element
        const notice = document.createElement("div");
        notice.style.position = "fixed";
        notice.style.bottom = "20px";
        notice.style.right = "20px";
        notice.style.padding = "15px";
        notice.style.backgroundColor = "#000000";
        notice.style.color = "#ffffff";
        notice.style.border = "1px solid #333333";
        notice.style.borderRadius = "5px";
        notice.style.boxShadow = "0px 4px 8px rgba(0, 0, 0, 0.5)";
        notice.style.zIndex = "10000";
        notice.style.fontFamily = "Arial, sans-serif";
        notice.innerHTML = "This page will reload in 5 seconds without the 'tl' parameter.";

        // Countdown timer
        let countdown = 5;
        const countdownText = document.createElement("span");
        countdownText.style.marginRight = "10px";
        countdownText.innerText = ` (${countdown}s)`;
        notice.appendChild(countdownText);

        // Cancel button
        const cancelButton = document.createElement("button");
        cancelButton.innerText = "Cancel";
        cancelButton.style.padding = "5px 10px";
        cancelButton.style.marginLeft = "10px";
        cancelButton.style.border = "none";
        cancelButton.style.backgroundColor = "#d32f2f";
        cancelButton.style.color = "#ffffff";
        cancelButton.style.borderRadius = "3px";
        cancelButton.style.cursor = "pointer";
        cancelButton.style.fontSize = "14px";
        cancelButton.style.textAlign = "center";
        cancelButton.style.display = "inline-flex";
        cancelButton.style.alignItems = "center";
        cancelButton.onclick = function() {
            clearInterval(timer);
            document.body.removeChild(notice);
        };
        notice.appendChild(cancelButton);

        document.body.appendChild(notice);

        // Countdown and automatic reload
        const timer = setInterval(function() {
            countdown -= 1;
            countdownText.innerText = ` (${countdown}s)`;

            if (countdown <= 0) {
                clearInterval(timer);
                reloadWithoutParameter();
            }
        }, 1000);

        // Watch for AJAX removal of the "tl" parameter
        const ajaxCheckInterval = setInterval(() => {
            if (!hasParameter("tl")) {
                clearInterval(ajaxCheckInterval);
                setTimeout(() => {
                    if (document.body.contains(notice)) {
                        document.body.removeChild(notice);
                    }
                }, 1000); // Remove notice after a 1-second delay
            }
        }, 500); // Check every 0.5 seconds
    }

    // Script logic: Check if "tl" parameter exists and show the notice
    if (hasParameter("tl")) {
        showNotice();
    }
})();