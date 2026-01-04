// ==UserScript==
// @name         Vortex v5.6.1 Advanced Auto Bot
// @version      1.6
// @description  Simulates bot
// @author       BUNNY
// @match        https://www.pokemon-vortex.com/map/live
// @grant        none
// @license MIT
// @namespace https://pokemon-vortex.com/
// @downloadURL https://update.greasyfork.org/scripts/539084/Vortex%20v561%20Advanced%20Auto%20Bot.user.js
// @updateURL https://update.greasyfork.org/scripts/539084/Vortex%20v561%20Advanced%20Auto%20Bot.meta.js
// ==/UserScript==

(function () {
    'use strict';

    // Customize settings
    const wanted = [
        "Pichu", "Zygarde", "Necrozma", "Dark", "Shiny", "Mystic", "Shadow", "Metallic"
    ];
    const enableXPBot = true; // Will fight all Pokémon for XP
    const enableCatchMode = true;
    const catchPriority = ["Master Ball", "Ultra Ball", "Pokéball"];
    const healUrl = "https://www.pokemon-vortex.com/pokemoncentre.php";

    const moveDirections = ['up', 'down', 'left', 'right'];
    let isRunning = true;
    let stepsSinceLastCheck = 0;

    function sleep(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    async function autoMove() {
        while (isRunning) {
            const dir = moveDirections[Math.floor(Math.random() * moveDirections.length)];
            moveTrainer(dir);
            stepsSinceLastCheck++;

            await sleep(400 + Math.random() * 500);

            if (document.querySelector('.wild-pokemon-image')) {
                await handleEncounter();
            }

            // Every 30 steps, check if we need to heal
            if (stepsSinceLastCheck % 30 === 0) {
                const fainted = document.querySelector('.sidebar .pokemon .hp-bar.fainted');
                if (fainted) {
                    console.warn("[BOT] Pokémon fainted — going to heal.");
                    window.location.href = healUrl;
                    return;
                }
            }
        }
    }

    async function handleEncounter() {
        const nameEl = document.querySelector('.wild-pokemon-name');
        const name = nameEl ? nameEl.textContent.trim() : '';
        const isWanted = wanted.some(mon => name.includes(mon));

        if (isWanted || enableXPBot) {
            document.querySelector('.wild-pokemon-image').click();
            await sleep(800);

            const battleBtn = document.querySelector('button.battleButton');
            if (battleBtn) {
                battleBtn.click();
                console.log(`[BOT] Battling ${name}`);
            }

            await sleep(1800);

            if (enableCatchMode) {
                await tryCatch();
            }
        } else {
            // Close encounter popup
            const closeBtn = document.querySelector('.closeWild');
            if (closeBtn) closeBtn.click();
        }
    }

    async function tryCatch() {
        const bagBtn = document.querySelector('#useItem');
        if (bagBtn) {
            bagBtn.click();
            await sleep(800);

            for (const type of catchPriority) {
                const ball = document.querySelector(`img[src*="Item-${type.replace(" ", "")}.png"]`);
                if (ball) {
                    ball.click();
                    console.log(`[BOT] Threw ${type}`);
                    return;
                }
            }

            console.warn("[BOT] No Pokéballs available.");
        }
    }

    // Stop after 10 mins to avoid infinite loop (for testing)
    setTimeout(() => {
        isRunning = false;
        console.warn('[BOT] Auto script stopped after 10 minutes.');
    }, 10 * 60 * 1000);

    console.log('[BOT] Auto script running...');
    autoMove();
})();
