// ==UserScript==
// @name         Bonk.io Ultimate Enhanced Script
// @namespace    http://tampermonkey.net/
// @version      18.7
// @description  Adds rainbow styles, custom skins, and auto-join functionality to Bonk.io. Activated via commands.
// @author       YourActualName
// @match        https://bonk.io/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/520932/Bonkio%20Ultimate%20Enhanced%20Script.user.js
// @updateURL https://update.greasyfork.org/scripts/520932/Bonkio%20Ultimate%20Enhanced%20Script.meta.js
// ==/UserScript==

(function () {
    'use strict';

    // States for various features
    let isRainbowActive = false;
    let isAutoJoinActive = false;
    let customSkinColor = null;

    let hue = 0; // For rainbow style

    /**
     * Command listener
     * Listens for commands typed in the chat and executes the associated functionality.
     */
    function setupCommandListener() {
        const chatInput = document.querySelector('#chatinput');
        if (!chatInput) return;

        chatInput.addEventListener('keydown', (e) => {
            if (e.key === 'Enter') {
                const command = chatInput.value.trim().toLowerCase();
                chatInput.value = ''; // Clear input after processing

                switch (command) {
                    case '/rainbowstyle':
                        isRainbowActive = !isRainbowActive;
                        console.log(`Rainbow Style: ${isRainbowActive ? 'Enabled' : 'Disabled'}`);
                        break;

                    case '/autojoin':
                        isAutoJoinActive = !isAutoJoinActive;
                        console.log(`Auto-Join: ${isAutoJoinActive ? 'Enabled' : 'Disabled'}`);
                        break;

                    case '/setskin':
                        setCustomSkin();
                        break;

                    default:
                        console.log(`Unknown command: ${command}`);
                }
            }
        });
    }

    /**
     * Rainbow effect for rectangle
     * Continuously updates the rectangle color and applies opposite colors to level and name.
     */
    function applyRainbowEffect() {
        function updateRainbow() {
            if (!isRainbowActive) return;

            hue = (hue + 5) % 360; // Increment hue for a smooth rainbow effect
            const rectangleColor = `hsl(${hue}, 100%, 50%)`;
            const oppositeColor = `hsl(${(hue + 180) % 360}, 100%, 50%)`;

            try {
                // Update rectangle colors
                if (window.bonkHost && window.bonkHost.p) {
                    window.bonkHost.p.color = rectangleColor;
                    window.bonkHost.p.outline = rectangleColor;
                }

                // Update name and level colors
                const playerName = document.querySelector('.playerName');
                const levelText = document.querySelector('.levelText');
                if (playerName) playerName.style.color = oppositeColor;
                if (levelText) levelText.style.color = oppositeColor;

            } catch (e) {
                console.error('Error applying rainbow effect:', e);
            }

            requestAnimationFrame(updateRainbow);
        }

        updateRainbow();
    }

    /**
     * Auto-join games
     * Automatically joins available games when the feature is enabled.
     */
    function autoJoinGames() {
        function checkJoinButton() {
            if (!isAutoJoinActive) return;

            try {
                const joinButton = document.querySelector('.joinGameButton');
                if (joinButton && joinButton.disabled === false) {
                    joinButton.click();
                    console.log('Auto-Joined a game!');
                }
            } catch (e) {
                console.error('Error with Auto-Join:', e);
            }

            setTimeout(checkJoinButton, 1000);
        }

        checkJoinButton();
    }

    /**
     * Set custom skin color
     * Prompts the user to enter a hex code for their rectangle color.
     */
    function setCustomSkin() {
        const inputColor = prompt('Enter a hex color for your skin (e.g., #ff0000):');
        if (inputColor && /^#([0-9A-F]{3}|[0-9A-F]{6})$/i.test(inputColor)) {
            customSkinColor = inputColor;
            applyCustomSkin();
        } else {
            alert('Invalid hex color! Please try again.');
        }
    }

    /**
     * Apply custom skin color
     * Applies the custom skin color to the game elements.
     */
    function applyCustomSkin() {
        if (window.bonkHost && window.bonkHost.p) {
            window.bonkHost.p.color = customSkinColor;
            window.bonkHost.p.outline = customSkinColor;
            console.log(`Custom skin set to: ${customSkinColor}`);
        } else {
            // If game elements are not yet available, wait and try again
            setTimeout(applyCustomSkin, 100);
        }
    }

    /**
     * Initialize the script
     * Waits for Bonk.io to load before activating features.
     */
    const waitForGame = setInterval(() => {
        if (typeof window.bonkHost !== 'undefined' && window.bonkHost.p !== undefined) {
            clearInterval(waitForGame); // Stop checking once the game is ready
            setupCommandListener(); // Set up commands
            applyRainbowEffect(); // Apply rainbow effects if toggled
            autoJoinGames(); // Auto-join games if toggled
        }
    }, 100);
})();
