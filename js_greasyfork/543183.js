// ==UserScript==
// @name         Discord Quick Send Button (iOS)
// @namespace    hi
// @version      1.0
// @description  Adds a floating button to send a custom message in the current channel on Discord Web (iOS).
// @match        https://discord.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/543183/Discord%20Quick%20Send%20Button%20%28iOS%29.user.js
// @updateURL https://update.greasyfork.org/scripts/543183/Discord%20Quick%20Send%20Button%20%28iOS%29.meta.js
// ==/UserScript==

(function() {
    'use strict';

    function createButton() {
        if (document.getElementById("sendButtonDiscord")) return;

        const btn = document.createElement("button");
        btn.id = "sendButtonDiscord";
        btn.innerText = "✉️ Send";
        btn.style.position = "fixed";
        btn.style.top = "10px";
        btn.style.right = "10px";
        btn.style.zIndex = "9999";
        btn.style.padding = "10px 15px";
        btn.style.background = "#5865F2";
        btn.style.color = "white";
        btn.style.border = "none";
        btn.style.borderRadius = "5px";
        btn.style.fontSize = "16px";
        btn.style.cursor = "pointer";
        btn.style.boxShadow = "0 4px 8px rgba(0,0,0,0.2)";
        btn.addEventListener("click", async () => {
            const msg = prompt("Enter message to send:");
            if (!msg) return;

            const textbox = document.querySelector('[role="textbox"]');
            if (!textbox) {
                alert("Textbox not found. Try refreshing.");
                return;
            }

            // Simulate user typing
            textbox.focus();
            textbox.textContent = msg;
            textbox.dispatchEvent(new InputEvent("input", { bubbles: true }));

            // Simulate Enter key
            textbox.dispatchEvent(new KeyboardEvent("keydown", {
                bubbles: true,
                cancelable: true,
                key: "Enter",
                code: "Enter",
                keyCode: 13,
                which: 13
            }));
        });

        document.body.appendChild(btn);
    }

    // Wait until page loads
    const observer = new MutationObserver(() => {
        if (document.querySelector('[role="textbox"]')) {
            createButton();
            observer.disconnect();
        }
    });

    observer.observe(document, { childList: true, subtree: true });
})();