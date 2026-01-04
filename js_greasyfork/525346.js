// ==UserScript==
// @name         Sniffies Saved Phrases
// @version      1.4
// @description  Adds an overlay for quick phrase selection and user blocking on Sniffies.com
// @author       LiveCamShow
// @match        *://sniffies.com/*
// @grant        GM_xmlhttpRequest
// @homepageURL  https://gitlab.com/livecamshow/UserScripts
// @namespace    LiveCamShow.scripts
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/525346/Sniffies%20Saved%20Phrases.user.js
// @updateURL https://update.greasyfork.org/scripts/525346/Sniffies%20Saved%20Phrases.meta.js
// ==/UserScript==


(function () {
    'use strict';

    const phrases = [
        "Hey man, what's up?",
        "Hey man, looking good!",
        "Wanna hang out?",
        "I'm into...."
    ];

    let currentIndex = 0;
    let overlayVisible = false;

    const overlay = document.createElement("div");
    overlay.id = "phraseOverlay";
    const style = document.createElement("style");
    style.textContent = `
        #phraseOverlay {
            position: absolute;
            width: 320px;
            max-height: 90%;
            background: #0f1e35;
            border-radius: 8px;
            padding: 12px;
            box-shadow: 0 4px 12px rgba(14, 22, 33, .25);
            color: #d4d9e4;
            border-top: 4px solid #4b84e6;
            border-bottom: 4px solid #4b84e6;
            font-family: "Arial", sans-serif;
            z-index: 9999;
            display: none;
            animation: fadeIn 0.25s cubic-bezier(.165, .84, .44, 1);
            overflow-y: auto;
        }

        #phraseOverlay ul {
            padding: 0;
            margin: 0;
            list-style: none;
        }

        #phraseOverlay li {
            padding: 8px;
            cursor: pointer;
            background-color: #2e3d51;
            color: #d4d9e4;
            border-radius: 4px;
            margin-bottom: 4px;
        }

        #phraseOverlay li:hover {
            background-color: #3c5f9c;
        }

        #phraseOverlay li.active {
            background-color: #4b84e6;
            color: #ffffff;
        }

        @keyframes fadeIn {
            from {
                opacity: 0;
                transform: translateY(-10px);
            }
            to {
                opacity: 1;
                transform: translateY(0);
            }
        }
    `;
    document.head.appendChild(style);
    document.body.appendChild(overlay);

    const phraseList = document.createElement("ul");
    phrases.forEach((phrase, index) => {
        const listItem = document.createElement("li");
        listItem.textContent = phrase;
        listItem.classList.toggle("active", index === currentIndex);
        listItem.addEventListener("click", () => selectPhrase(index));
        phraseList.appendChild(listItem);
    });
    overlay.appendChild(phraseList);

    // Helper function to update the overlay display
    function updateOverlay() {
        const listItems = Array.from(phraseList.children);
        listItems.forEach((li, index) => li.classList.toggle("active", index === currentIndex));
    }

    // Optimized positioning function
    function positionOverlay() {
        const chatInputPanel = document.getElementById("chat-input-panel");
        if (!chatInputPanel) return; // If panel doesn't exist, no need to position the overlay

        const chatInputRect = chatInputPanel.getBoundingClientRect();
        overlay.style.left = `${chatInputRect.left + (chatInputRect.width / 2) - (overlay.offsetWidth / 2)}px`;
        overlay.style.top = `${chatInputRect.top - overlay.offsetHeight}px`;
    }

    // Event listener to toggle the overlay visibility
    document.addEventListener("keydown", (e) => {
        if (e.shiftKey && e.ctrlKey && window.location.pathname.endsWith('/chat')) {
            overlayVisible = !overlayVisible;
            overlay.style.display = overlayVisible ? "block" : "none";
            if (overlayVisible) {
                currentIndex = 0;
                updateOverlay();
                positionOverlay(); // Only update position when overlay is visible
            }
        }

        if (overlayVisible) {
            if (e.key === "ArrowDown") {
                currentIndex = (currentIndex + 1) % phrases.length;
                updateOverlay();
                e.preventDefault();
            } else if (e.key === "ArrowUp") {
                currentIndex = (currentIndex - 1 + phrases.length) % phrases.length;
                updateOverlay();
                e.preventDefault();
            } else if (e.key === "Enter") {
                selectPhrase(currentIndex);
                e.preventDefault();
            }
        }
    });

    // Function to handle the phrase selection
    function selectPhrase(index) {
        const selectedPhrase = phrases[index];
        overlay.style.display = "none";
        overlayVisible = false;

        const inputField = document.querySelector("input[type='text'], textarea");
        const submitButton = document.querySelector('#chat-input-send-text-or-saved-photo');

        if (inputField) {
            inputField.value = selectedPhrase;
            inputField.dispatchEvent(new Event("input", { bubbles: true }));
            if (submitButton) {
                submitButton.click();
            }
        }
    }

    // Mutation observer to handle removal of the chat input panel
    const observer = new MutationObserver(() => {
        if (!document.getElementById("chat-input-panel")) {
            overlay.style.display = "none";
            overlayVisible = false;
        }
    });
    observer.observe(document.body, { childList: true, subtree: true });

    // Ensure overlay is positioned correctly when the page is loaded
    window.addEventListener('load', positionOverlay);
})();
