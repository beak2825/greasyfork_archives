// ==UserScript==
// @name         DH3 Combat Shortcut Improvement
// @namespace    com.anwinity.dh3
// @version      1.0.0
// @description  Adds some things (like castle) to the new combat shortcut dialogue.
// @author       Anwinity
// @match        dh3.diamondhunt.co
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/418950/DH3%20Combat%20Shortcut%20Improvement.user.js
// @updateURL https://update.greasyfork.org/scripts/418950/DH3%20Combat%20Shortcut%20Improvement.meta.js
// ==/UserScript==

(function() {
    'use strict';

    function addCastleRow(n) {


        $("#dialogue-combat-shortcut tbody").append(`
          <tr id="dialogue-combat-shortcut-castle-row" style="background-image:url(images/dungeon_background.png);background-size:100% 100%;" class="tr-combat-shortcut"><td style="font-size:20pt;">CASTLE</td>
            <td>
              <img src="images/knight5_monster_idle_0.png" style="height: 90px;" />
            </td>
            <td style="color:white">
              <img src="images/castleChest.png" class="img-30" style="cursor: pointer" onclick="clicksCastleChest()">
              <br/>
              <span>${formatNumber(parseInt(window.var_castlePoints||"0"))}</span>
            </td>
            <td style="color:white">

            </td>
            <td class="td-combat-shortcut-button">
              <span onclick="changeCombatMap(14);closeDialogue(&quot;dialogue-combat-shortcut&quot;);" class="combat-shortcut-button">MAP</span>
            </td>
            <td class="td-combat-shortcut-button">
              <span onclick="sendBytes('FIGHT_SOLDIERS');closeDialogue(&quot;dialogue-combat-shortcut&quot;);" class="combat-shortcut-button">FIGHT</span>
            </td>
          </tr>
          `);
    }

    function init() {
        if(!window.var_username) {
            setTimeout(init, 1000);
            return;
        }

        $("#dialogue-confirm2").css("z-index", "9999");

        const original_openCombatShortcut = window.openCombatShortcut;
        window.openCombatShortcut = function() {
            original_openCombatShortcut.apply(this, arguments);
            addCastleRow();
        }
    }

    $(init);

})();
