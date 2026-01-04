// ==UserScript==
// @name         FlatMMO Stop Wasting Potions
// @namespace    com.dounford.flatmmo.swp
// @version      1.0.0
// @description  Block potion usage if it will waste it
// @author       Dounford
// @license      MIT
// @match        *://flatmmo.com/play.php*
// @grant        none
// @require      https://update.greasyfork.org/scripts/544062/FlatMMOPlus.js
// @downloadURL https://update.greasyfork.org/scripts/546009/FlatMMO%20Stop%20Wasting%20Potions.user.js
// @updateURL https://update.greasyfork.org/scripts/546009/FlatMMO%20Stop%20Wasting%20Potions.meta.js
// ==/UserScript==
 
(function() {
    'use strict';
 
    class stopWastingPotionsPlugin extends FlatMMOPlusPlugin {
        constructor() {
            super("stopWastingPotions", {
                about: {
                    name: GM_info.script.name,
                    version: GM_info.script.version,
                    author: GM_info.script.author,
                    description: GM_info.script.description
                },
                config: [
                    {
                        id: "shouldStack",
                        label: "Stack Potions (requires donor perk)",
                        type: "boolean",
                        default: false
                    }
                ]
                
            });
            this.isPremium = false;
        }
     
        onLogin() {
            switch_panels("donor-shop");
            switch_panels("inventory");
            setTimeout(() => {
                if(document.getElementById("ui-panel-donor-shop-silver-timer").innerHTML !== "Not Active" || document.getElementById("ui-panel-donor-shop-gold-timer").innerHTML !== "Not Active") {
                    FlatMMOPlus.plugins.stopWastingPotions.isPremium = true;
                }
            },5000)

            const originalClick = window.clicks_inventory_item;
			window.clicks_inventory_item = function(ele, item, current_amount, index) {
				if(item.includes("potion") && potions_active[item]) {
                    const potionDuration = (300 + (get_level(var_brewing_xp) * 30)) * 2;
                    //f2p will always return
                    //You can choose to never stack
                    //Max stack is 2 potions
                    //300 is the default, each level adds 30 seconds and ticks are half a second
                    if(FlatMMOPlus.plugins.stopWastingPotions.isPremium === false || FlatMMOPlus.plugins.stopWastingPotions.config["shouldStack"] === false || potions_active[item] > potionDuration) {
                        return
                    }
                }
				originalClick(ele, item, current_amount, index)
			}
        }
    }
 
    const plugin = new stopWastingPotionsPlugin();
    FlatMMOPlus.registerPlugin(plugin);
 
})();