// ==UserScript==
// @name            Gota.io auto invite
// @name:ru         Gota.io авто инвайтер
// @namespace       Gota.io script by Madzal
// @author          Madzal
// @version         3
// @homepage        http://gota.io/web
// @supportURL      http://www.YouTube.com/user/madzal777
// @description     Script for auto add players to your party
// @description:ru  Скрипт для авто добавления игроков в твою команду
// @icon            data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZ
// @match           http://gota.io/web/
// @exclude         file://*
// @run-at          document-end
// @encoding        utf-8
// @grant           none
// @noframes
// @license         MIT //
// @downloadURL https://update.greasyfork.org/scripts/542043/Gotaio%20auto%20invite.user.js
// @updateURL https://update.greasyfork.org/scripts/542043/Gotaio%20auto%20invite.meta.js
// ==/UserScript==

(function() {
    'use strict'; // Enforce strict mode for cleaner code

    let observer = null; // To hold the MutationObserver instance

    function handlePlayerInvite(node) {
        // Check if the inserted node is a chat message containing a canvas
        // This assumes chat messages for player IDs are structured in a predictable way
        const canvas = node.querySelector("canvas[data-player-id]");
        if (canvas) {
            const playerid = canvas.getAttribute("data-player-id");
            const partyCanvas = document.getElementById("party-canvas");

            // Ensure partyCanvas exists and has the correct height before sending an invite
            if (partyCanvas && partyCanvas.height !== 205) {
                console.log('Sending invite to player - ' + playerid);
                // Ensure 'player' and 'Packet' objects are available in the page context.
                // If they are not, you might need to use 'unsafeWindow.player' or 'unsafeWindow.Packet'
                // However, since @grant none is used, the script runs in the page context by default.
                if (typeof player !== 'undefined' && typeof Packet !== 'undefined' && typeof Packet.sendPartyAction !== 'undefined') {
                    player.sendPacket(new Packet.sendPartyAction(0, playerid));
                } else {
                    console.warn("Gota.io game objects (player or Packet) not found. Cannot send invite.");
                }
            }
        }
    }

    function startAutoInvite() {
        const chatBody = document.getElementById("chat-body");
        if (!chatBody) {
            console.error("Chat body element not found. Auto invite cannot start.");
            return;
        }

        // Options for the observer (which mutations to observe)
        const config = { childList: true, subtree: true };

        // Callback function to execute when mutations are observed
        const callback = (mutationsList, observerInstance) => {
            for (const mutation of mutationsList) {
                if (mutation.type === 'childList') {
                    for (const addedNode of mutation.addedNodes) {
                        // Check if the added node is an element and not just text
                        if (addedNode.nodeType === 1) { // Node.ELEMENT_NODE
                            handlePlayerInvite(addedNode);
                        }
                    }
                }
            }
        };

        // Create a new MutationObserver instance
        observer = new MutationObserver(callback);

        // Start observing the target node for configured mutations
        observer.observe(chatBody, config);
        console.log("Auto invite started. Monitoring chat for new players.");

        // Disable the start button and enable the stop button
        document.getElementById("start_invite").disabled = true;
        document.getElementById("stop_invite").disabled = false;
    }

    function stopAutoInvite() {
        if (observer) {
            observer.disconnect(); // Stop observing
            observer = null;
            console.log("Auto invite stopped.");
        }
        // Disable the stop button and enable the start button
        document.getElementById("start_invite").disabled = false;
        document.getElementById("stop_invite").disabled = true;
    }

    // --- Script Initialization ---

    // Create buttons
    const startButton = document.createElement("input");
    startButton.className = "gota-btn";
    startButton.type = "button";
    startButton.value = "Start Auto Invite";
    startButton.id = "start_invite";
    startButton.addEventListener("click", startAutoInvite, false);

    const stopButton = document.createElement("input");
    stopButton.className = "gota-btn";
    stopButton.type = "button";
    stopButton.value = "Stop Script";
    stopButton.id = "stop_invite";
    stopButton.addEventListener("click", stopAutoInvite, false);
    stopButton.disabled = true; // Initially disabled until invite starts

    // Append buttons to the Gota.io UI
    const mainTop = document.getElementsByClassName("main-top")[0];
    if (mainTop) {
        const mydiv = document.createElement("div");
        mydiv.className = "main-version";
        mydiv.style.margin = "15px";
        mydiv.appendChild(startButton);
        mydiv.appendChild(stopButton);
        mainTop.appendChild(mydiv);
    } else {
        console.error("Could not find '.main-top' element to append buttons.");
    }
})();