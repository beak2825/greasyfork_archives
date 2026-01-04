// ==UserScript==
// @name         IdlePixel Chance2Hit
// @namespace    com.anwinity.idlepixel
// @version      1.2.6
// @description  Adds chance-to-hit indicators in combat.
// @author       Anwinity
// @license      MIT
// @match        *://idle-pixel.com/login/play*
// @grant        none
// @require      https://greasyfork.org/scripts/441206-idlepixel/code/IdlePixel+.js?anticache=20220905
// @downloadURL https://update.greasyfork.org/scripts/444585/IdlePixel%20Chance2Hit.user.js
// @updateURL https://update.greasyfork.org/scripts/444585/IdlePixel%20Chance2Hit.meta.js
// ==/UserScript==

(function() {
    'use strict';

    function hitChance(accuracy, defence) {
        if (defence % 2 == 0){
            return 1 / Math.max(1, defence/2 - accuracy + 1);
        }
        else {
            return ( hitChance(accuracy, defence-1) + hitChance(accuracy, defence+1) ) / 2;
        }
    }

    function formatPercent(n) {
        n *= 100;
        n = n.toFixed(1);
        if(n.endsWith(".0")) {
            n = n.substring(0, n.length - 2);
        }
        return `${n}%`;
    }

    const TRIGGER_ON_VARS = ["monster_name", "monster_accuracy", "monster_defence", "accuracy", "defence"];

    class Chance2HitPlugin extends IdlePixelPlusPlugin {
        constructor() {
            super("chance2hit", {
                about: {
                    name: GM_info.script.name,
                    version: GM_info.script.version,
                    author: GM_info.script.author,
                    description: GM_info.script.description
                }
            });
        }

        recalculateChances() {
            const monsterAccuracy = IdlePixelPlus.getVarOrDefault("monster_accuracy", 0, "int");
            const monsterDefence = IdlePixelPlus.getVarOrDefault("monster_defence", 0, "int");
            const playerAccuracy = IdlePixelPlus.getVarOrDefault("accuracy", 0, "int");
            const playerDefence = IdlePixelPlus.getVarOrDefault("defence", 0, "int");
            const monsterChanceToHit = formatPercent(hitChance(monsterAccuracy, playerDefence));
            const playerChanceToHit = formatPercent(hitChance(playerAccuracy, monsterDefence));
            $("#player-chance2hit").text(` ${monsterChanceToHit}`);
            $("#monster-chance2hit").text(` ${playerChanceToHit}`);
        }

        onMessageReceived(data) {
            if(data.startsWith("SET_ITEMS=")) {
                if(TRIGGER_ON_VARS.some(key => data.includes(`${key}~`))) {
                    this.recalculateChances();
                }
            }
        }

        onLogin() {
            $("#panel-combat-canvas #combat_hero_accuracy").parent().after(`
            <div class="td-combat-stat-entry">
              <img class="img-15" src="https://idlepixel.s3.us-east-2.amazonaws.com/images/accuracy_white.png">
              <span style="color:white">Chance:</span>
              <span id="monster-chance2hit"></span>
            </div>`);
            $("#panel-combat-canvas #combat_monster_accuracy").parent().after(`
            <div class="td-combat-stat-entry">
              <img class="img-15" src="https://idlepixel.s3.us-east-2.amazonaws.com/images/accuracy_white.png">
              <span style="color:white">Chance:</span>
              <span id="player-chance2hit"></span>
            </div>`);
        }

    }

    const plugin = new Chance2HitPlugin();
    IdlePixelPlus.registerPlugin(plugin);

})();