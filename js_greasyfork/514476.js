// ==UserScript==
// @name         Spicychat.ai But Better
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Yes
// @author       Me
// @match        *://*.spicychat.ai/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=spicychat.ai
// @grant        GM_addStyle
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/514476/Spicychatai%20But%20Better.user.js
// @updateURL https://update.greasyfork.org/scripts/514476/Spicychatai%20But%20Better.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // ChatGPT Overlay!
    const overlay = document.createElement("div");
    // Use `left` instead of `right` for positioning
    overlay.style = "top:25%;left:25%;position:fixed;padding:10px;border:1px solid black;border-radius:15px;background:white;cursor:move;";

    const selectElement = document.createElement("select");
    const values = ["default", "thespice-8b", "stheno-8b", "spicy2-13b", "darkforest-20b", "command-r", "mixtral", "noromaid-45b", "vivian-70b", "airoboros-70b", "midnightrose-70b", "wizardlm2-8x22b"];
    for (const value of values) {
        const option = document.createElement("option");
        option.textContent = value;
        selectElement.appendChild(option);
    }

    selectElement.addEventListener("change", function() {
        localStorage.setItem(`inference_model_${localStorage.getItem("guest_user_id")}`, selectElement.value); // Thanks to LM2024 https://greasyfork.org/en/scripts/499615-spicychat-utilities/discussions/253397
    });

    const title = document.createElement("h3");
    title.textContent = "spicychat.ai utilities";
    title.style = "color:black";

    overlay.appendChild(title);
    overlay.appendChild(selectElement);
    document.body.appendChild(overlay);
    // ChatGPT Overlay!

    // Add Drag functionality
    let offsetX = 0, offsetY = 0, isDragging = false;

    overlay.addEventListener('mousedown', function(e) {
        isDragging = true;
        offsetX = e.clientX - overlay.getBoundingClientRect().left;
        offsetY = e.clientY - overlay.getBoundingClientRect().top;

        // Set `left` and `top` if they are not already set
        const rect = overlay.getBoundingClientRect();
        overlay.style.left = rect.left + 'px';
        overlay.style.top = rect.top + 'px';

        document.body.style.userSelect = 'none'; // Prevents text selection
    });

    document.addEventListener('mousemove', function(e) {
        if (isDragging) {
            overlay.style.left = (e.clientX - offsetX) + 'px';
            overlay.style.top = (e.clientY - offsetY) + 'px';
        }
    });

    document.addEventListener('mouseup', function() {
        isDragging = false;
        document.body.style.userSelect = ''; // Restore text selection
    });

    // Queue bypass functionality
    XMLHttpRequest.prototype.realSend = XMLHttpRequest.prototype.send;
    XMLHttpRequest.prototype.send = function(data) {
        this.addEventListener('readystatechange', function() {
            if (this.responseURL.includes("queue")) { // Queue bypass
                if (this.response != "") {
                    console.log(''.concat(this.response, " > {\"status\":\"access\"}"));
                }
                Object.defineProperty(this, "responseText", {writable: true});
                this.responseText = '{"status":"access"}';
            };
        });
        this.realSend(data);
    };
})();