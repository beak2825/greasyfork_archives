// ==UserScript==
// @name         SpicyChat.AI Utilities
// @version      0.0.3
// @namespace    skibidi
// @description  Unlock queue & a maybe working model changer.
// @author       xin
// @license      MIT
// @match        *://*.spicychat.ai/*
// @grant        GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/499615/SpicyChatAI%20Utilities.user.js
// @updateURL https://update.greasyfork.org/scripts/499615/SpicyChatAI%20Utilities.meta.js
// ==/UserScript==

// if you could please report the github account @u6f, i lost it due to an infostealer :(

(function() {
    'use strict';

    // ChatGPT Overlay!
    const overlay = document.createElement("div")
    overlay.style = "top:25%;right:75%;position:fixed;padding:10px;border:1px solid black;border-radius:15px;background:white"
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

    const title = document.createElement("h3")
    title.textContent = "spicychat.ai utilities"
    title.style = "color:black"

    overlay.appendChild(title)
    overlay.appendChild(selectElement)
    document.body.appendChild(overlay)
    // ChatGPT Overlay!

    XMLHttpRequest.prototype.realSend = XMLHttpRequest.prototype.send
    XMLHttpRequest.prototype.send = function(data) {
        this.addEventListener('readystatechange', function() {
            if (this.responseURL.includes("queue")) { // Queue bypass
                if (this.response != "") {
                    console.log(''.concat(this.response, " > \{\"status\"\:\"access\"\}"))
                }
                Object.defineProperty(this, "responseText", {writable: true});
                this.responseText = '{"status":"access"}';
            };
        });
        this.realSend(data)
    };
})();