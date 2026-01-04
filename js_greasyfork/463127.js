// ==UserScript==
// @name         IdlePixel Rain and Combat loot potions from combat tab
// @namespace    com.idlepixel
// @version      1.0.1
// @description  Rain and Combat potions from combat tab
// @author       Apkhoil
// @license      MIT
// @match        *://idle-pixel.com/login/play*
// @grant        none
// @require      https://greasyfork.org/scripts/441206-idlepixel/code/IdlePixel+.js?anticache=20230402
// @downloadURL https://update.greasyfork.org/scripts/463127/IdlePixel%20Rain%20and%20Combat%20loot%20potions%20from%20combat%20tab.user.js
// @updateURL https://update.greasyfork.org/scripts/463127/IdlePixel%20Rain%20and%20Combat%20loot%20potions%20from%20combat%20tab.meta.js
// ==/UserScript==

(function() {
    'use strict';

    class QuickPotionsFromCombatPlugin extends IdlePixelPlusPlugin {
        constructor() {
            super("quickPotionsFromCombat", {
                about: {
                    name: GM_info.script.name,
                    version: GM_info.script.version,
                    author: GM_info.script.author,
                    description: GM_info.script.description
                },
            });
        }


        onLogin() {
            this.addQuickButtons();
        }

        addQuickButtons() {
            const combatCanvas = $("#panel-combat-canvas");
            combatCanvas.prepend(`
               <button type="button" class="hover float-end" style="margin-right:0.5rem;" onclick="IdlePixelPlus.plugins.quickPotionsFromCombat.drinkRain()">Rain</button>
            `);
            combatCanvas.prepend(`
               <button type="button" class="hover float-end" style="margin-right:0.5rem;" onclick="IdlePixelPlus.plugins.quickPotionsFromCombat.drinkCombatLoot()">Loot</button>
            `);
        }

        drinkRain() {
                IdlePixelPlus.sendMessage(`DRINK=rain_potion`);
        }
        drinkCombatLoot() {
                IdlePixelPlus.sendMessage(`BREWING_DRINK_COMBAT_LOOT_POTION`);
        }
    }

    const plugin = new QuickPotionsFromCombatPlugin();
    IdlePixelPlus.registerPlugin(plugin);
})();