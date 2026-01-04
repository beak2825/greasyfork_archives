// ==UserScript==
// @name         Krunker.io Mod Menu
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  A stunning mod menu that ruins the cheater's experience with cheats and beautiful pop-ups
// @author       You
// @match        ://krunker.io/
// @grant        GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/528291/Krunkerio%20Mod%20Menu.user.js
// @updateURL https://update.greasyfork.org/scripts/528291/Krunkerio%20Mod%20Menu.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // HTML for the stunning mod menu
    const menuHTML = `
        <div id="modMenu" class="mod-menu">
            <div class="menu-header">
                <h1>Krunker.io Mod Menu</h1>
                <button id="closeMenu" class="close-btn">X</button>
            </div>
            <div class="options">
                <button id="aimbot" class="option-btn">Activate Aimbot</button>
                <button id="speedHack" class="option-btn">Activate Speed Hack</button>
                <button id="wallHack" class="option-btn">Activate Wall Hack</button>
            </div>
        </div>
    `;

    // Add the mod menu HTML to the page
    document.body.insertAdjacentHTML('beforeend', menuHTML);

    // CSS for styling the mod menu
    GM_addStyle(`
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }

        body {
            font-family: 'Arial', sans-serif;
        }

        /* Mod Menu Styles */
        .mod-menu {
            position: fixed;
            top: 15%;
            left: 50%;
            transform: translateX(-50%);
            background: linear-gradient(145deg, #4a4e69, #2a2d3e);
            padding: 25px;
            border-radius: 20px;
            box-shadow: 0 20px 50px rgba(0, 0, 0, 0.5);
            width: 300px;
            z-index: 9999;
            opacity: 0;
            animation: slideIn 1s ease-out forwards;
        }

        @keyframes slideIn {
            from {
                transform: translateX(-50%) scale(0);
                opacity: 0;
            }
            to {
                transform: translateX(-50%) scale(1);
                opacity: 1;
            }
        }

        .menu-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 20px;
        }

        .menu-header h1 {
            font-size: 22px;
            font-weight: bold;
            color: #f8f9fa;
        }

        .close-btn {
            background-color: #f04e23;
            color: white;
            border: none;
            padding: 8px 16px;
            border-radius: 50%;
            cursor: pointer;
            transition: background-color 0.3s ease;
        }

        .close-btn:hover {
            background-color: #d43f1b;
        }

        .options {
            display: flex;
            flex-direction: column;
            gap: 15px;
        }

        .option-btn {
            padding: 12px 18px;
            background: linear-gradient(145deg, #f8b400, #f8a300);
            border: none;
            border-radius: 50px;
            color: white;
            font-size: 16px;
            cursor: pointer;
            transition: transform 0.3s ease, background-color 0.3s ease;
        }

        .option-btn:hover {
            background-color: #f89800;
            transform: scale(1.05);
        }

        .option-btn:active {
            transform: scale(0.95);
        }

        /* Cheat Pop-up Styles */
        .popup {
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            background: rgba(0, 0, 0, 0.8);
            color: #fff;
            padding: 20px 30px;
            border-radius: 10px;
            font-size: 18px;
            display: none;
            z-index: 10000;
            box-shadow: 0 15px 30px rgba(0, 0, 0, 0.7);
            animation: popupAnim 1s ease-out forwards;
        }

        @keyframes popupAnim {
            from {
                transform: translate(-50%, -50%) scale(0);
                opacity: 0;
            }
            to {
                transform: translate(-50%, -50%) scale(1);
                opacity: 1;
            }
        }

        .popup.show {
            display: block;
        }
    `);

    // Create the popup element to show when a cheat is activated
    const popup = document.createElement('div');
    popup.classList.add('popup');
    document.body.appendChild(popup);

    // JavaScript to simulate fake cheats (anti-cheat ruining gameplay)
    function showPopup(message) {
        popup.textContent = message;
        popup.classList.add('show');
        setTimeout(() => {
            popup.classList.remove('show');
        }, 2000);  // Show the popup for 2 seconds
    }

    // Activate Aimbot (Fake)
    function activateAimbot() {
        showPopup("Aimbot Activated! Your aim is now uncontrollable!");
        console.log("Fake aimbot running - aim is going crazy.");
        // Add fake aimbot effect (e.g., make the aim jitter uncontrollably)
    }

    // Activate Speed Hack (Fake)
    function activateSpeedHack() {
        showPopup("Speed Hack Activated! You're moving too fast!");
        console.log("Speed hack running - player moves uncontrollably fast.");
        // Add fake speed hack effect (e.g., player moves uncontrollably fast)
    }

    // Activate Wall Hack (Fake)
    function activateWallHack() {
        showPopup("Wall Hack Activated! Visuals are glitching!");
        console.log("Wall hack running - causing visual glitches.");
        // Add fake wall hack effect (e.g., cause broken textures, see through walls)
    }

    // Event Listeners for each cheat
    document.getElementById('aimbot').addEventListener('click', function() {
        activateAimbot();
    });

    document.getElementById('speedHack').addEventListener('click', function() {
        activateSpeedHack();
    });

    document.getElementById('wallHack').addEventListener('click', function() {
        activateWallHack();
    });

    // Close the mod menu
    document.getElementById('closeMenu').addEventListener('click', function() {
        document.getElementById('modMenu').style.display = 'none';
    });
})();