// ==UserScript==
// @name         DH3 Tools One Click
// @namespace    com.anwinity.dh3
// @version      1.4.3
// @description  Open Anwinity's DH3 Tools and load data automatically. This works by passing a url parameter with all of your stats and tool information.
// @author       Anwinity
// @match        dh3.diamondhunt.co
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/406843/DH3%20Tools%20One%20Click.user.js
// @updateURL https://update.greasyfork.org/scripts/406843/DH3%20Tools%20One%20Click.meta.js
// ==/UserScript==

(function() {
    'use strict';

    function getGem(tool) {
        let result = null;
        ["diamond", "ruby", "emerald", "sapphire"].some(gem => {
            if(window[`var_${gem}${tool}`]) {
                result = gem;
                return true;
            }
        });
        return result || "none";
    }

    const OneClick = {
        init: function() {
            window.openAnwinitysTools = function(event) {
                event.preventDefault();
                let pdata = {
                    skills: {
                        combat: window.var_combatXp||0,
                        magic: window.var_magicXp||0,
                        mining: window.var_miningXp||0,
                        crafting: window.var_craftingXp||0,
                        woodcutting: window.var_woodcuttingXp||0,
                        farming: window.var_farmingXp||0,
                        brewing: window.var_brewingXp||0,
                        fishing: window.var_fishingXp||0,
                        cooking: window.var_cookingXp||0
                    },
                    tools: {
                        axe: getGem("Axe"),
                        brewingKit: getGem("BrewingKit"),
                        fishingRod: getGem("FishingRod"),
                        hammer: getGem("StardustHammer"),
                        pickaxe: getGem("StardustPickaxe"),
                        rake: getGem("Rake"),
                        shovel: getGem("Shovel"),
                        bonemealBin: getGem("BonemealBin"),
                        harpoon: getGem("Harpoon"),
                        smallNet: getGem("SmallFishingNet"),
                        chisel: getGem("Chisel"),
                        chainsaw: getGem("Chainsaw"),
                        trowel: getGem("Trowel"),
                        watch: getGem("Watch")
                    },
                    inventory: {
                        dottedGreenLeaf: window.var_dottedGreenLeaf||0,
                        greenLeaf: window.var_greenLeaf||0,
                        limeLeaf: window.var_limeLeaf||0,
                        goldLeaf: window.var_goldLeaf||0,
                        strangeLeaf: window.var_strangeLeafFix||0,
                        bronzeBar: window.var_bronzeBars||0,
                        ironBar: window.var_ironBars||0,
                        silverBar: window.var_silverBars||0,
                        goldBar: window.var_goldBars||0,
                        promethiumBar: window.var_promethiumBars||0,
                        redMushroom: window.var_redMushroom||0,
                        bones: window.var_bones||0,
                        oil: window.var_oil||0,
                        logs: window.var_logs||0,
                        vial: window.var_vial||0,
                        largeVial: window.var_largeVial||0
                    },
                    machines: {
                        drills: window.var_drills||0,
                        crushers: window.var_crushers||0,
                        giantDrills: window.var_giantDrills||0,
                        excavators: window.var_excavators||0
                    },
                    username: window.var_username,
                    stardust: window.var_stardust||0,
                    donorBonus: !!(window.var_bonusXp),
                    oilIncome: window.var_oilIn||0,
                    mana: window.var_heroMaxMana||0
                };

                console.log(pdata);
                pdata = btoa(JSON.stringify(pdata));

                window.open("https://anwinity.com/dh3/#pdata="+pdata, "_blank");
            };

            $("div.top-top-bar > div:nth-child(10)").after(`
              <div class="top-top-bar-inner">
                <a href="#" style="text-decoration:none;color:rgb(42,200,200)" onclick="openAnwinitysTools(event)" onauxclick="openAnwinitysTools(event)">Anwinity's Tools</a>
              </div>
              <div style="color:grey" class="top-top-bar-inner">|</div>
            `);
        }
    };

    OneClick.init();
})();