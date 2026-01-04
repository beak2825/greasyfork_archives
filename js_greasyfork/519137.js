// ==UserScript==
// @name         Dino Game Hack - Ultimate Mod Menu with Show/Hide Button
// @namespace    http://tampermonkey.net/
// @version      5.3
// @description  Fully functional mods with a show/hide button and sound effects for Chrome Dino Game
// @author       Your Name
// @match        https://chromedino.com/*
// @include      https://trex-runner.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/519137/Dino%20Game%20Hack%20-%20Ultimate%20Mod%20Menu%20with%20ShowHide%20Button.user.js
// @updateURL https://update.greasyfork.org/scripts/519137/Dino%20Game%20Hack%20-%20Ultimate%20Mod%20Menu%20with%20ShowHide%20Button.meta.js
// ==/UserScript==

(function () {
    'use strict';

    // Sound effects
    const hideMenuSoundUrl = "https://www.myinstants.com/media/sounds/windows-xp-shutdown.mp3";
    const showMenuSoundUrl = "https://www.myinstants.com/media/sounds/windows-10-usb-connect-38512.mp3";
    const achievementSoundUrl = "https://www.myinstants.com/media/sounds/xbox-one-rare-achievement-45050.mp3";

    // Wait for the game to load
    const waitForGame = setInterval(() => {
        if (window.Runner) {
            clearInterval(waitForGame);
            initHackMenu();
        }
    }, 100);

    function playSound(url) {
        const audio = new Audio(url);
        audio.volume = 0.5;
        audio.play().catch(() => {
            console.warn("Sound playback blocked.");
        });
    }

    function initHackMenu() {
        const runnerInstance = Runner.instance_;

        // Create the menu container
        const menu = document.createElement('div');
        menu.style.position = 'fixed';
        menu.style.top = '10px';
        menu.style.left = '10px';
        menu.style.padding = '20px';
        menu.style.background = 'linear-gradient(135deg, #001f3f, #0074d9)';
        menu.style.color = '#ffffff';
        menu.style.fontFamily = '"Franklin Gothic", Arial, sans-serif';
        menu.style.zIndex = '9999';
        menu.style.border = '2px solid #00d9ff';
        menu.style.borderRadius = '15px';
        menu.style.boxShadow = '0 10px 20px rgba(0, 0, 0, 0.5)';
        document.body.appendChild(menu);

        // Add content to the menu
        menu.innerHTML = `
            <h3 style="text-align:center; color:#00d9ff; font-size:24px;">Dino Hack Menu</h3>
            <hr style="border-color:#00d9ff;">
            <div style="margin-bottom:15px;">
                <strong>Invincibility:</strong>
                <label class="switch">
                    <input type="checkbox" id="invincible">
                    <span class="slider"></span>
                </label>
            </div>
            <div style="margin-bottom:15px;">
                <strong>Speed:</strong>
                <input type="number" id="speed" value="1" step="0.1" min="0.1" style="width:60px;">
            </div>
            <div style="margin-bottom:15px;">
                <strong>Jump Height:</strong>
                <input type="number" id="jumpHeight" value="10" step="1" min="1" style="width:60px;">
            </div>
            <button id="applyChanges" style="width:100%; background-color:#00d9ff; color:white; border:none; padding:12px; border-radius:8px; cursor:pointer; font-size:16px; transition: transform 0.2s ease;">Apply Changes</button>
            <hr style="border-color:#00d9ff;">
            <button id="hideMenu" style="width:100%; background-color:#ff4d4d; color:white; border:none; padding:10px; border-radius:8px; cursor:pointer;">Hide Menu</button>
        `;

        // Create Show Menu button (initially hidden)
        const showMenuButton = document.createElement('button');
        showMenuButton.id = 'showMenu';
        showMenuButton.style.position = 'fixed';
        showMenuButton.style.top = '10px';
        showMenuButton.style.right = '10px';
        showMenuButton.style.backgroundColor = '#4CAF50';
        showMenuButton.style.color = 'white';
        showMenuButton.style.border = 'none';
        showMenuButton.style.padding = '12px 20px';
        showMenuButton.style.borderRadius = '8px';
        showMenuButton.style.cursor = 'pointer';
        showMenuButton.innerText = 'Show Menu';
        showMenuButton.style.display = 'none'; // Hidden by default
        document.body.appendChild(showMenuButton);

        // Hide and Show buttons functionality
        const hideMenuButton = document.getElementById("hideMenu");

        hideMenuButton.addEventListener("click", () => {
            // Play the sound first, then hide the menu after sound plays
            playSound(hideMenuSoundUrl);
            menu.style.display = "none"; // Hide the menu
            showMenuButton.style.display = "block"; // Show the "Show Menu" button
        });

        showMenuButton.addEventListener("click", () => {
            // Play the sound first, then show the menu after sound plays
            playSound(showMenuSoundUrl);
            menu.style.display = "block"; // Show the menu
            showMenuButton.style.display = "none"; // Hide the "Show Menu" button
        });

        // Invincibility toggle
        const invincibleCheckbox = document.getElementById("invincible");
        invincibleCheckbox.addEventListener("change", () => {
            if (invincibleCheckbox.checked) {
                runnerInstance.gameOver = function () {}; // Disable game over
            } else {
                runnerInstance.gameOver = Runner.prototype.gameOver; // Restore original
            }
        });

        // Apply changes button functionality
        const applyChangesButton = document.getElementById("applyChanges");

        // Disable the button when clicked and re-enable after animation
        applyChangesButton.addEventListener("click", () => {
            applyChangesButton.disabled = true; // Disable the button

            const speedMultiplier = parseFloat(document.getElementById("speed").value);
            const jumpHeight = parseFloat(document.getElementById("jumpHeight").value);

            runnerInstance.setSpeed(speedMultiplier); // Change game speed
            runnerInstance.tRex.setJumpVelocity(jumpHeight); // Change jump height

            // Button scale animation after clicking
            applyChangesButton.style.transform = "scale(0.9)";
            setTimeout(() => {
                applyChangesButton.style.transform = "scale(1)";
                applyChangesButton.disabled = false; // Re-enable the button after animation
            }, 200);
        });

        // Achievement sound for milestones
        let lastMilestone = 0;
        setInterval(() => {
            const score = Math.floor(runnerInstance.distanceRan / 10);
            if (score >= 100 && score !== lastMilestone && score % 500 === 0) {
                playSound(achievementSoundUrl);
                lastMilestone = score;
            }
        }, 1000);
    }
})();
