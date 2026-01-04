// ==UserScript==
// @name         Drawaria Advanced Moderation (English)
// @namespace    https://greasyfork.org
// @version      1.0
// @description  Helps host auto-detect offensive words, AFK players, and trolls in Drawaria
// @match        *://drawaria.online/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/541682/Drawaria%20Advanced%20Moderation%20%28English%29.user.js
// @updateURL https://update.greasyfork.org/scripts/541682/Drawaria%20Advanced%20Moderation%20%28English%29.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const bannedWords = ["badword1", "badword2", "spam", "idiot"]; // Add more if needed
    const afkTime = 90000; // 90 seconds of no activity

    let players = {}; // Track player activity

    // Observe chat for banned words
    const chatObserver = new MutationObserver((mutations) => {
        mutations.forEach((mutation) => {
            mutation.addedNodes.forEach((node) => {
                if (node.nodeType === Node.ELEMENT_NODE) {
                    const message = node.textContent.toLowerCase();
                    const name = node.querySelector("b")?.textContent || "Unknown";

                    for (let word of bannedWords) {
                        if (message.includes(word)) {
                            node.style.background = "red";
                            node.style.color = "white";
                            alert(`⚠️ Player ${name} used a banned word:\n"${message}"`);
                        }
                    }

                    // Update player activity
                    if (!players[name]) players[name] = {};
                    players[name].lastMessage = Date.now();
                }
            });
        });
    });

    // Detect AFK players
    setInterval(() => {
        const now = Date.now();
        for (let name in players) {
            const last = players[name].lastMessage || 0;
            if (now - last > afkTime) {
                console.warn(`Player ${name} might be AFK.`);
                alert(`🕒 Player ${name} has been inactive for more than ${afkTime / 1000} seconds.`);
                players[name].lastMessage = now; // Reset timer to prevent repeat alerts
            }
        }
    }, 30000); // Check every 30 seconds

    // Simple troll detection (no drawing)
    const canvas = document.querySelector("canvas");
    if (canvas) {
        const ctx = canvas.getContext("2d");
        let previousImage = ctx.getImageData(0, 0, canvas.width, canvas.height).data;

        setInterval(() => {
            const currentImage = ctx.getImageData(0, 0, canvas.width, canvas.height).data;
            let changes = 0;

            for (let i = 0; i < currentImage.length; i += 4) {
                if (currentImage[i] !== previousImage[i]) {
                    changes++;
                }
            }

            if (changes < 1000) { // Minimal drawing
                console.warn("👻 Possible troll: very little drawing detected.");
                alert("🎨 Warning: the current drawer may be trolling (very minimal drawing).");
            }

            previousImage = currentImage;
        }, 15000); // Check every 15 seconds
    }

    // Start chat observer
    const chat = document.querySelector(".chat-box") || document.querySelector(".chat");
    if (chat) {
        chatObserver.observe(chat, { childList: true, subtree: true });
    }
})();