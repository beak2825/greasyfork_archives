// ==UserScript==
// @name         IdlePixel  - Breeding Slayerless Kill All
// @namespace    com.zlef.idlepixel
// @version      1.0.0
// @description  Kill all button - Only triggers if Slayerless orb is absorbed and will not permanently kill anything.
// @author       Zlef
// @license      MIT
// @match        *://idle-pixel.com/login/play*
// @grant        none
// @icon         https://cdn.idle-pixel.com/images/cow.png
// @require      https://greasyfork.org/scripts/441206-idlepixel/code/IdlePixel+.js?anticache=20220905
// @downloadURL https://update.greasyfork.org/scripts/539506/IdlePixel%20%20-%20Breeding%20Slayerless%20Kill%20All.user.js
// @updateURL https://update.greasyfork.org/scripts/539506/IdlePixel%20%20-%20Breeding%20Slayerless%20Kill%20All.meta.js
// ==/UserScript==

(function() {
    'use strict';

    class SlayerlessKillAll extends IdlePixelPlusPlugin {
        constructor() {
            super("slayerless_kill_all", {
                about: {
                    name: GM_info.script.name, 
                    version: GM_info.script.version,
                    author: GM_info.script.author,
                    description: GM_info.script.description
                }
            });

        }

        onLogin() {
            this.slayerlessOrbAbsorbed = IdlePixelPlus.getVarOrDefault(`green_breeding_slayless_orb_absorbed`, 0, "int");

            const killAllButton = document.createElement("button");
            killAllButton.id = "breeding-overhaul-kill-all";
            killAllButton.type = "button";
            killAllButton.textContent = "Kill all (Slayerless)";
            killAllButton.classList.add("button");
            killAllButton.addEventListener("click", this.killAllTriggered.bind(this));

            const wrapperDiv = document.createElement("div");
            wrapperDiv.appendChild(killAllButton);

            const xpArea = document.querySelector("#panel-breeding .panel-logo-xp-area");
            xpArea.parentElement.insertBefore(wrapperDiv, xpArea.nextSibling);

        }

        killAllTriggered() {
            // console.log("Kill All button pressed");

            const tables = document.querySelectorAll('#breeding-area table');
            // console.log(`Found ${tables.length} tables`);

            for (const table of tables) {
                const name = table.querySelector("td div")?.textContent.trim().toLowerCase();
                if (!name) continue;

                const onclick = table.getAttribute("onclick");
                if (!onclick) continue;

                const match = onclick.match(/clicksActivedAnimal\("(.+?)",\s*\d+,\s*\w+,\s*(\d+),/);

                const uuid = match[1];
                const xp = parseInt(match[2], 10);

                // console.log(`Parsed ${name}: UUID=${uuid}, XP=${xp}`);

                if (xp > 0 && this.slayerlessOrbAbsorbed === 1) {
                    console.log(`Killing ${name} with UUID ${uuid} (XP: ${xp})`);
                    IdlePixelPlus.sendMessage(`KILL_ANIMAL=${uuid}`);
                    // console.log(`Sent message KILL_ANIMAL=${uuid}`);
                }


            }
        }


    }

    // Update class initialiser
    const plugin = new SlayerlessKillAll();
    IdlePixelPlus.registerPlugin(plugin);

})();