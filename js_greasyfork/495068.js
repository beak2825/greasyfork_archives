// ==UserScript==
// @name         Website Warning with Exit Button
// @namespace    http://tampermonkey.net/
// @version      1.1
// @description  Display a warning upon opening any website with an exit button
// @author       helpful101
// @match        *
// @license      MIT
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/495068/Website%20Warning%20with%20Exit%20Button.user.js
// @updateURL https://update.greasyfork.org/scripts/495068/Website%20Warning%20with%20Exit%20Button.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Define the warning message
    var warningMessage = "Warning: Are you sure you want to be here?";

    // Create a div element for the warning message
    var warningDiv = document.createElement("div");
    warningDiv.style.position = "fixed";
    warningDiv.style.top = "50%";
    warningDiv.style.left = "50%";
    warningDiv.style.transform = "translate(-50%, -50%)";
    warningDiv.style.width = "70%";
    warningDiv.style.backgroundColor = "rgba(255, 0, 0, 0.8)";
    warningDiv.style.color = "white";
    warningDiv.style.padding = "20px";
    warningDiv.style.textAlign = "center";
    warningDiv.style.zIndex = "9999"; // Set a high z-index value
    warningDiv.textContent = warningMessage;

    // Create an exit button
    var exitButton = document.createElement("button");
    exitButton.textContent = "Exit";
    exitButton.style.marginTop = "10px";
    exitButton.style.backgroundColor = "white";
    exitButton.style.color = "black";
    exitButton.style.border = "none";
    exitButton.style.padding = "8px 16px";
    exitButton.style.cursor = "pointer";

    // Attach click event listener to exit button
    exitButton.addEventListener("click", function() {
        document.body.removeChild(warningDiv);
        document.body.removeChild(backgroundBlur);
    });

    // Append the exit button to the warning div
    warningDiv.appendChild(exitButton);

    // Create a div element for the background blur
    var backgroundBlur = document.createElement("div");
    backgroundBlur.style.position = "fixed";
    backgroundBlur.style.top = "0";
    backgroundBlur.style.left = "0";
    backgroundBlur.style.width = "100%";
    backgroundBlur.style.height = "100%";
    backgroundBlur.style.backgroundColor = "rgba(0, 0, 0, 0.5)";
    backgroundBlur.style.backdropFilter = "blur(5px)";
    backgroundBlur.style.zIndex = "9998"; // Set a z-index behind the warning div

    // Append the warning div and background blur to the body of the webpage
    document.body.appendChild(backgroundBlur);
    document.body.appendChild(warningDiv);
})();