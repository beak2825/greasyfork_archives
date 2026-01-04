// ==UserScript==
// @name         ChatGPT UI Enhancer
// @namespace    http://yournamespace.example.com
// @version      1.0
// @description  Enhance ChatGPT interface with better UI features
// @author       YourName
// @match        https://chat.openai.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/519572/ChatGPT%20UI%20Enhancer.user.js
// @updateURL https://update.greasyfork.org/scripts/519572/ChatGPT%20UI%20Enhancer.meta.js
// ==/UserScript==

(function () {
    'use strict';

    // Auto Dark Mode
    function enableDarkMode() {
        const body = document.body;
        if (!body.classList.contains("dark-mode")) {
            body.classList.add("dark-mode");
        }
    }

    function disableDarkMode() {
        const body = document.body;
        body.classList.remove("dark-mode");
    }

    // Add Export Button
    function addExportButton() {
        if (document.querySelector("#export-conversation")) return;

        const button = document.createElement("button");
        button.id = "export-conversation";
        button.textContent = "Export Conversation";
        button.style.cssText =
            "position: fixed; bottom: 20px; right: 20px; z-index: 9999; background-color: #4CAF50; color: white; padding: 10px; border: none; border-radius: 5px; cursor: pointer;";

        button.onclick = function () {
            const messages = Array.from(
                document.querySelectorAll(".flex-col .prose p")
            ).map((p) => p.textContent);
            const text = messages.join("\n\n");
            const blob = new Blob([text], { type: "text/plain" });
            const a = document.createElement("a");
            a.href = URL.createObjectURL(blob);
            a.download = "conversation.txt";
            a.click();
        };

        document.body.appendChild(button);
    }

    // Auto Resize Text Area
    function autoResizeTextArea() {
        const textArea = document.querySelector("textarea");
        if (!textArea) return;

        textArea.style.height = "auto";
        textArea.style.overflowY = "hidden";
        textArea.addEventListener("input", function () {
            this.style.height = "auto";
            this.style.height = this.scrollHeight + "px";
        });
    }

    // Observe and Apply Changes
    const observer = new MutationObserver(() => {
        addExportButton();
        autoResizeTextArea();
    });

    observer.observe(document.body, {
        childList: true,
        subtree: true,
    });

    // Toggle Dark Mode
    enableDarkMode();
})();
