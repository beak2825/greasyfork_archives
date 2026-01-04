// ==UserScript==
// @name         IdlePixel Quick Fight Buttons
// @namespace    com.anwinity.idlepixel
// @version      1.3.0
// @description  DEPRECATED - Added to SlapChop plugin
// @author       Anwinity
// @license      MIT
// @match        *://idle-pixel.com/login/play*
// @grant        none
// @require      https://greasyfork.org/scripts/441206-idlepixel/code/IdlePixel+.js?anticache=20220905
// @downloadURL https://update.greasyfork.org/scripts/444239/IdlePixel%20Quick%20Fight%20Buttons.user.js
// @updateURL https://update.greasyfork.org/scripts/444239/IdlePixel%20Quick%20Fight%20Buttons.meta.js
// ==/UserScript==

(function() {
    'use strict';

    class QuickFightButtonsPlugin extends IdlePixelPlusPlugin {
        constructor() {
            super("quickfight", {
                about: {
                    name: GM_info.script.name,
                    version: GM_info.script.version,
                    author: GM_info.script.author,
                    description: GM_info.script.description
                },
                config: [
                    {
                        id: "confirm",
                        label: "Show Confirm",
                        type: "boolean",
                        default: false
                    }
                ]
            });
        }

        quickFight(zoneId) {
            const confirm = this.getConfig("confirm");
            if(confirm) {
                if(window.confirm(`FIGHT: ${zoneId} ?`)) {
                    Combat.modal_area_last_selected = zoneId;
                    IdlePixelPlus.sendMessage(`START_FIGHT=${zoneId}`);
                }
            }
            else {
                Combat.modal_area_last_selected = zoneId;
                IdlePixelPlus.sendMessage(`START_FIGHT=${zoneId}`);
            }
        }

        refreshButtonStates() {
            const fp = IdlePixelPlus.getVarOrDefault("fight_points", 0, "int");
            const energy = IdlePixelPlus.getVarOrDefault("energy", 0, "int");
            Object.values(IdlePixelPlus.info.combatZones).forEach(zone => {
                let disabled = fp < zone.fightPointCost || energy < zone.energyCost;
                if(zone.id == "volcano" && IdlePixelPlus.getVar("volcano_unlocked")!="1") {
                    disabled = true;
                }
                else if(zone.id == "northern_field" && IdlePixelPlus.getVar("northern_field_unlocked")!="1") {
                    disabled = true;
                }
                $(`button#quickfight-${zone.id}`).prop("disabled", disabled);
            });
        }

        onVariableSet(key, valueBefore, valueAfter) {
            // fp increments every tick, so don't bother refreshing when energy changes
            if(["fight_points", "energy", "volcano_unlocked", "northern_field_unlocked"].includes(key)) {
                this.refreshButtonStates();
            }
        }

        onLogin() {
            let html = '<h5>Quick Fight:</h5><div style="display: flex; flex-direction: row">';
            Object.values(IdlePixelPlus.info.combatZones).forEach(zone => {
                html += `<button id="quickfight-${zone.id}" class="m-1" type="button" onclick="IdlePixelPlus.plugins.quickfight.quickFight('${zone.id}')">${zone.id}</button>`;
            });
            html += `</div><span style="color: red"><strong>Quick Fight DEPRECATED:</strong> Use <a href="https://greasyfork.org/en/scripts/448025-idlepixel-slap-chop" target="_blank">SlapChop Plugin</a> instead.</span><hr>`;
            $("#panel-combat hr").first().after(html);
            this.refreshButtonStates();
        }

    }

    const plugin = new QuickFightButtonsPlugin();
    IdlePixelPlus.registerPlugin(plugin);

})();