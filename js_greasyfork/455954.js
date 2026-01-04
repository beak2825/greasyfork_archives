// ==UserScript==
// @name         Rare Potion in combat tab
// @namespace    namespaceuniquetome
// @version      1.13
// @description  lol
// @author       shtos
// @license      MIT
// @match        *://idle-pixel.com/login/play*
// @grant        none
// @require https://greasyfork.org/scripts/441206-idlepixel/code/IdlePixel+.js
// @downloadURL https://update.greasyfork.org/scripts/455954/Rare%20Potion%20in%20combat%20tab.user.js
// @updateURL https://update.greasyfork.org/scripts/455954/Rare%20Potion%20in%20combat%20tab.meta.js
// ==/UserScript==

(function() {
    'use strict';
    let loaded = false;
    class RarePotionInCombatTabPlugin extends IdlePixelPlusPlugin {
        constructor() {
            super("RarePotionInCombatTab", { // unique plugin id, "sample"
                about: { // optional, but highly recommended
                    name: GM_info.script.name,
                    version: GM_info.script.version,
                    author: GM_info.script.author,
                    description: GM_info.script.description
                }
            });
        }
		onLogin(){
            $('head').append(`
               <style id="rare-potion-in-combat-styles">
               .fighting-monster-loot-potion{
                   background-color: rgba(32, 36, 33, 0.67);
                   border-color: rgb(255, 255, 255) rgb(255, 255, 255) rgb(255, 255, 255) rgb(255, 255, 255);
                   color: rgb(232, 230, 227);
                   border: 1px solid black;
  border-top-color: black;
  border-top-style: solid;
  border-top-width: 1px;
  border-right-color: black;
  border-bottom-color: black;
  border-bottom-style: solid;
  border-bottom-width: 1px;
  border-left-color: black;
  border-left-style: solid;
  border-left-width: 1px;
padding: 10px;
color: white;
border-bottom-right-radius: 5px;
border-top-right-radius: 5px;
margin-right: -3px;
margin-top: 20px;
               }
                              .fighting-monster-rain-potion{
                   background-color: rgba(38, 115, 153, 0.67);
                   border-color: rgb(33, 207, 247);
                   color: rgb(232, 230, 227);
                   border: 1px solid black;
  border-top-color: black;
  border-top-style: solid;
  border-top-width: 1px;
  border-right-color: black;
  border-bottom-color: black;
  border-bottom-style: solid;
  border-bottom-width: 1px;
  border-left-color: black;
  border-left-style: solid;
  border-left-width: 1px;
padding: 10px;
color: white;
border-bottom-right-radius: 5px;
border-top-right-radius: 5px;
margin-right: -3px;
margin-top: 20px;
               }


               </style>
            `);
            $('#game-panels-combat-items-area .itembox-fight').first().after(`
            <div id="rare-monster-pot-in-combat-tab" class="itembox-fight" data-tooltip="fight">
               <div class="center" style="margin-top: 0.55rem;"><img src="https://d1xsc8x7nc5q8t.cloudfront.net/images/rare_monster_potion.png" title="fight"></div>
               <div class="center" style="display: flex; justify-content: center;">
                  <div id="rare_monster_potion-brew" class="hover" style="padding: 3px; width: 50px;" onclick="IdlePixelPlus.plugins.slapchop.quickBrew('rare_monster_potion')">BREW</div>
                  <div id="rare_monster_potion-use" class="hover" style="padding: 3px; width: 50px;" onclick="websocket.send('DRINK=rare_monster_potion')">USE</div>
               </div>
            </div>
      `)
$('#rare-monster-pot-in-combat-tab').after(`
<div id="super_rare-monster-pot-in-combat-tab" class="itembox-fight" data-tooltip="fight">
               <div class="center" style="margin-top: 0.55rem;"><img src="https://d1xsc8x7nc5q8t.cloudfront.net/images/super_rare_monster_potion.png" title="fight"></div>
               <div class="center" style="display: flex; justify-content: center;">
                  <div id="super_rare_monster_potion-brew" class="hover" style="padding: 3px; width: 50px;" onclick="IdlePixelPlus.plugins.slapchop.quickBrew('super_rare_monster_potion')">BREW</div>
                  <div id="super_rare_monster_potion-use" class="hover" style="padding: 3px; width: 50px;" onclick="websocket.send('DRINK=super_rare_monster_potion')">USE</div>
               </div>
            </div>
`)
            $('.fight-left-border .td-combat-bottom-panel').after(`
            <div style="" id="fighting-combat_loot_potion" onclick="websocket.send('BREWING_DRINK_COMBAT_LOOT_POTION')" class="fighting-monster-loot-potion hover shadow">
               <img src="https://idlepixel.s3.us-east-2.amazonaws.com/images/combat_loot_potion.png" title="combat_loot_potion_icon">
               <span id="combat_loot_potion-label" style="color: white;">Loot Potions: 0</span>
            </div>`)
                        $('.fight-left-border #fighting-combat_loot_potion').after(`
            <div style="" id="fighting-rain_potion" onclick="websocket.send('DRINK=rain_potion')" class="fighting-monster-rain-potion hover shadow">
               <img src="https://idlepixel.s3.us-east-2.amazonaws.com/images/rain_potion.png" title="rain_potion_in_combat_icon">
               <span id="rain_potion-in-combat-label" style="color: white;">Rain Potions: 0</span>
            </div>`)
            loaded = true;
        }
        updateButtons(){
           let potions = ['rare_monster_potion', 'super_rare_monster_potion']
           potions.forEach(potion=>{
              let useButton = document.getElementById(`${potion}-use`)
              let brewButton = document.getElementById(`${potion}-brew`)
              IdlePixelPlus.getVarOrDefault(potion, 0, 'int') ? useButton.style.color = 'white' : useButton.style.color = 'red'
              this.canBrew(potion) ? brewButton.style.color = 'white' : brewButton.style.color = 'red'
           })
           let combatLootPotionsAmount = document.getElementById('combat_loot_potion-label');
           combatLootPotionsAmount.textContent = IdlePixelPlus.getVarOrDefault('combat_loot_potion_timer', 0, 'int') == 0 ?
               'Loot Potions: ' + IdlePixelPlus.getVarOrDefault('combat_loot_potion', 0, 'int') :
               format_time(IdlePixelPlus.getVarOrDefault('combat_loot_potion_timer', 0, 'int'));
                       let rainPotionsAmount = document.getElementById('rain_potion-in-combat-label');
           rainPotionsAmount.textContent = IdlePixelPlus.getVarOrDefault('rain_potion_timer', 0, 'int') == 0 ?
               'Rain Potions: ' + IdlePixelPlus.getVarOrDefault('rain_potion', 0, 'int') :
               format_time(IdlePixelPlus.getVarOrDefault('rain_potion_timer', 0, 'int'));
        }
        canBrew(potion){
            let ingredients = Brewing.get_ingredients(potion);
            for (let i=0; i<ingredients.length; i+=2){
                if (IdlePixelPlus.getVarOrDefault(ingredients[i], 0, 'int') < ingredients[i+1]) return false;
            }
            return true;
        }

        onVariableSet(key, valueBefore, valueAfter) {
            if (!loaded){
                this.delay()
                return
            }
            let variables = ['dotted_green_leaf', 'strange_leaf', 'red_mushroom', 'rare_monster_potion', 'super_rare_monster_potion', 'combat_loot_potion', 'combat_loot_potion_timer', 'rain_potion', 'rain_potion_timer'];
            //if (key == 'combat_loot_potion_timer' && valueAfter != 0) return;
            if (variables.includes(key)){
                this.updateButtons();
            }
        }
        delay(){
            if (!loaded){
                setTimeout(()=>{this.delay()}, 1000)
                return
            }
            this.updateButtons();
        }
    }


    const plugin = new RarePotionInCombatTabPlugin();
    IdlePixelPlus.registerPlugin(plugin); // register the plugin

})();