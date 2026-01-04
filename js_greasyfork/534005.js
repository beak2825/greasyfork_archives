// ==UserScript==
// @name         ShellShock.io Custom Theme + Techno Weapons + Buck Melee
// @namespace    http://tampermonkey.net/
// @version      1.2
// @description  Custom background, custom scope colors, killfeed mod, Techno weapons, and Buck Melee unlocked visually | ShellShock.io 2025 Update | ESLint clean version without fake clan hats | FINAL CLEAN VERSION
// @author       YourName
// @match        *://shellshock.io/*
// @license      MIT
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/534005/ShellShockio%20Custom%20Theme%20%2B%20Techno%20Weapons%20%2B%20Buck%20Melee.user.js
// @updateURL https://update.greasyfork.org/scripts/534005/ShellShockio%20Custom%20Theme%20%2B%20Techno%20Weapons%20%2B%20Buck%20Melee.meta.js
// ==/UserScript==

(function() {
    'use strict';

    console.log("✅ ShellShock Custom Theme Script Loaded");

    // === Apply Custom Styles ===
    const css = `
        body {
            background: url("https://chat.openai.com/mnt/data/b066146c-10ab-49e4-adfb-28edddc6c0fa.png") no-repeat center center fixed !important;
            background-size: cover !important;
            color: #ffffff !important;
        }
        .navbar, .footer, .inventory, .menu {
            background-color: rgba(0, 0, 0, 0.6) !important;
            border-radius: 12px;
            color: white !important;
        }
        .button, .btn-primary {
            background-color: #8b0000 !important;
            color: #fff !important;
            border-radius: 8px;
        }
        .scope-freeranger, .scope-crackshot {
            border: 4px solid #8b0000 !important;
            background-color: rgba(0, 0, 0, 0.85) !important;
            box-shadow: 0 0 12px #8b0000;
        }
        .scope-freeranger::before, .scope-crackshot::before {
            content: '';
            position: absolute;
            top: 50%;
            left: 50%;
            width: 2px;
            height: 100%;
            background: #8b0000;
            transform: translate(-50%, -50%);
        }
        .scope-freeranger::after, .scope-crackshot::after {
            content: '';
            position: absolute;
            top: 50%;
            left: 50%;
            width: 100%;
            height: 2px;
            background: #8b0000;
            transform: translate(-50%, -50%);
        }
    `;
    const style = document.createElement('style');
    style.textContent = css;
    document.head.appendChild(style);

    console.log("🎨 Custom CSS Theme Applied");

    // === Modify Killfeed Text ===
    const changeKillText = () => {
        const observer = new MutationObserver(mutations => {
            for (const mutation of mutations) {
                for (const node of mutation.addedNodes) {
                    if (node.nodeType === 1 && node.innerText && node.innerText.includes("You killed")) {
                        node.innerText = node.innerText.replace("You killed", "You just shit on");
                    }
                }
            }
        });
        observer.observe(document.body, { childList: true, subtree: true });
    };

    // === Fake Unlock Techno Weapons + Buck Melee ===
    const unlockTechnoAndBuck = () => {
        let interval = setInterval(() => {
            if (typeof window.shellshock !== 'undefined' && typeof window.shellshock.user !== 'undefined') {
                clearInterval(interval);
                try {
                    console.log("🔫 Unlocking Techno Weapons + Buck Melee...");

                    const skinsToUnlock = [
                        "AK47-TECHNO", // Techno AK
                        "SHOTGUN-TECHNO", // Techno Shotgun
                        "SNIPER-TECHNO", // Techno Sniper (Crackshot)
                        "P90-TECHNO", // Techno P90
                        "PISTOL-TECHNO", // Techno Pistol
                        "MELEE-BUCK" // Buck Melee
                    ];

                    skinsToUnlock.forEach(skin => {
                        if (!window.shellshock.user.inventory.skins.includes(skin)) {
                            window.shellshock.user.inventory.skins.push(skin);
                        }
                    });

                    if (typeof window.shellshock.ui !== 'undefined' && typeof window.shellshock.ui.inventory !== 'undefined') {
                        window.shellshock.ui.inventory.reload();
                        console.log("♻️ Inventory UI reloaded to show Techno Weapons + Buck Melee.");
                    }

                    console.log("✅ Techno Weapons + Buck Melee Visually Unlocked!");
                } catch (e) {
                    console.error("❌ Failed to unlock Techno Weapons + Buck Melee:", e);
                }
            }
        }, 500);
    };

    // === Execute functions when page loads
    window.addEventListener('load', () => {
        console.log("⏳ Waiting for ShellShock.io to fully load...");
        setTimeout(() => {
            unlockTechnoAndBuck();
            changeKillText();
        }, 2500);
    });

})();
