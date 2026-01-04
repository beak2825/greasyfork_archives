// ==UserScript==
// @name         Hide Youtube Player When Paused
// @namespace    PlanetXX2
// @version      2024-11-13.1
// @description  Automatically hide the player when video is paused and mouse not hovering, as if the video is playing
// @license      MIT
// @author       PlanetXX2
// @match        https://*.youtube.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=youtube.com
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/516653/Hide%20Youtube%20Player%20When%20Paused.user.js
// @updateURL https://update.greasyfork.org/scripts/516653/Hide%20Youtube%20Player%20When%20Paused.meta.js
// ==/UserScript==

(function () {
    'use strict';

    let player = null;
    let playerParent = null;
    let isListening = false;
    let waitForReadyInterval = null;
    let lastState = "paused"; // paused, playing

    const eventListenerMouseOver = () => {
        setTimeout(() => {
            player.classList.remove("ytp-autohide");
        }, 50);
    }
    const eventListenerMouseLeave = () => {
        setTimeout(() => {
            player.classList.add("ytp-autohide");
        }, 50);
    }

    function playerStateChanged() {
        if (player.classList.contains("paused-mode") && !isListening) {
            isListening = true;
            playerParent.addEventListener("mouseover", eventListenerMouseOver);
            playerParent.addEventListener("mouseleave", eventListenerMouseLeave);
        } else if (isListening) {
            isListening = false;
            playerParent.removeEventListener("mouseover", eventListenerMouseOver);
            playerParent.removeEventListener("mouseleave", eventListenerMouseLeave);
        }
    }

    function playerReady() {
        let ob = new MutationObserver(() => {
            if (player.classList.contains("paused-mode")) {
                if (lastState === "playing") {
                    lastState = "paused";
                    playerStateChanged();
                }
            } else {
                if (lastState === "paused") {
                    lastState = "playing";
                    playerStateChanged();
                }
            }
        });
        ob.observe(player, {
            attributes: true,
            attributeFilter: ["class"]
        });
    }

    // Wait for the player to be ready
    function waitForReady() {
        waitForReadyInterval = setInterval(function () {
            player = document.getElementById("movie_player");
            if (player) {
                console.log(player)
                playerParent = player.parentElement;

                clearInterval(waitForReadyInterval);
                playerReady();
                console.log("Player ready");
            }
        }, 500);
    }

    // reset the state when page navigate
    window.navigation.addEventListener("navigate", (e) => {
        console.log("BBB",e)
        console.log("AAA", window.location.pathname);
        playerParent && playerParent.removeEventListener("mouseover", eventListenerMouseOver);
        playerParent && playerParent.removeEventListener("mouseleave", eventListenerMouseLeave);
        player = null;
        playerParent = null;
        isListening = false;
        lastState = "paused";
        clearInterval(waitForReadyInterval)

        if(e.destination.url.includes("/watch") || e.destination.url.includes("/live")){
            waitForReady();
        }
    });

    if(window.location.pathname.includes("/watch") || window.location.pathname.includes("/live")){
        waitForReady();
    }

})();