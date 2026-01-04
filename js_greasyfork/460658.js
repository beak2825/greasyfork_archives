// ==UserScript==
// @name         Dropchance Combat
// @namespace    com.anwinity.idlepixel.sample
// @version      1.0.1
// @description  Adds dropchance
// @author       LordHC
// @license      MIT
// @match        *://idle-pixel.com/login/play*
// @grant        none
// @require https://greasyfork.org/scripts/441206-idlepixel/code/IdlePixel+.js
// @downloadURL https://update.greasyfork.org/scripts/460658/Dropchance%20Combat.user.js
// @updateURL https://update.greasyfork.org/scripts/460658/Dropchance%20Combat.meta.js
// ==/UserScript==
(function() {
    'use strict';

    class dropChanceCombat extends IdlePixelPlusPlugin {
        constructor() {
            super("dropChanceCombat", { // unique plugin id, "sample"
                about: { // optional, but highly recommended
                    name: GM_info.script.name,
                    version: GM_info.script.version,
                    author: GM_info.script.author,
                    description: GM_info.script.description
                }
            });
        }


        onMessageReceived(data) {
            if (data.startsWith("COMBAT_LOG=")) {
                // Removes all charachters except numbers
                function removeText(text) {
                    var num = text.replace(/[^0-9]/g, '');
                    return num;
                }
                // Checking if the its a string and not undefined
                function checking(string) {
                    if (string) {
                        return removeText(string.innerHTML);
                    }
                }
                // Adding % of chance of item
                var calculatePrecentage = function(drops, kills) {
                    var num = Math.round(drops / kills * 100 * 100) / 100;
                    if (num > 100) {
                        if (num > 999) {
                            const firstTwoNumbers = String(num).substring(0, 2);
                            const dottedNum = firstTwoNumbers.slice(0, 2) + "." + firstTwoNumbers.slice(1, 2);
                            return dottedNum + "x";
                        } else {
                            const firstTwoNumbers = String(num).substring(0, 2);
                            const dottedNum = firstTwoNumbers.slice(0, 1) + "." + firstTwoNumbers.slice(1, 2);
                            return dottedNum + "x";
                        }
                    }
                    return num + "%"
                };

                function addingMonsterDropAverage() {
                    const monsters = $("[id^='combat-log-table-']").toArray().map(el => el.getAttribute("id"));
                    // Adds the precentage on every item
                    monsters.forEach(createPrecentageItem);

                    function createPrecentageItem(item) {
                        var idCombatLogMonster = document.getElementById(item).childNodes[0]
                        var monsterKills = removeText(document.getElementById(item).childNodes[0].rows[0].childNodes[3].innerHTML);

                        for (var i = 2, row; row = idCombatLogMonster.rows[i]; i++) {
                            //iterate through rows
                            var combatLogMonsterRow = row.childNodes[2];
                            var dropsHTML = row.childNodes[3].childNodes[3]
                            var dropsRaw = checking(dropsHTML);
                            var drops = (dropsRaw = dropsRaw ?? "0");

                            var dateSpan = document.createElement('span')
                            var br = document.createElement("br");
                            dateSpan.innerHTML = calculatePrecentage(drops, monsterKills);
                            dateSpan.className = "color-grey font-small";
                            combatLogMonsterRow.appendChild(br);
                            var br2 = br.cloneNode(true);
                            combatLogMonsterRow.appendChild(br2);
                            combatLogMonsterRow.appendChild(dateSpan);
                        }
                    }

                }
                addingMonsterDropAverage();




            }

        }



    }

    const plugin = new dropChanceCombat();
    IdlePixelPlus.registerPlugin(plugin); // register the plugin

})();