// ==UserScript==
// @name         DH3 Named Presets
// @namespace    com.anwinity.dh3
// @version      1.0.0
// @description  Name your combat presets for easy identification in combat.
// @author       Anwinity
// @match        dh3.diamondhunt.co
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/406966/DH3%20Named%20Presets.user.js
// @updateURL https://update.greasyfork.org/scripts/406966/DH3%20Named%20Presets.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const NamedPresets = {
        init: function() {
            window.savePresetName = function(color) {
                console.log(color);
                let key = `dh3.anwinity.presetName.${color}`;
                let value = $(`#preset-${color}-name`).val() || "";
                localStorage.setItem(key, value);
                $(`span#combat-preset-name-${color}`).text(value);
            };

            // remove normal stuff
            $(".fighting-screen-combat-area").empty();
            // add our stuff
            $(".fighting-screen-combat-area").append(`
             <div onclick="sendBytes('USE_PRESET=1')" style="text-align: left">
               <img src="images/combatPresetsRed.png" class="img-30" style="display: inline-block">
               <span style="color: white">1. <span id="combat-preset-name-red"></span></span>
             </div>
             <div onclick="sendBytes('USE_PRESET=2')" style="text-align: left">
               <img src="images/combatPresetsGreen.png" class="img-30" style="display: inline-block">
               <span style="color: white">2. <span id="combat-preset-name-green"></span></span>
             </div>
             <div onclick="sendBytes('USE_PRESET=3')" style="text-align: left">
               <img src="images/combatPresetsBlue.png" class="img-30" style="display: inline-block">
               <span style="color: white">3. <span id="combat-preset-name-blue"></span></span>
             </div>
             <div onclick="sendBytes('USE_PRESET=4')" style="text-align: left">
               <img src="images/combatPresetsYellow.png" class="img-30" style="display: inline-block">
               <span style="color: white">4. <span id="combat-preset-name-yellow"></span></span>
             </div>
             <div onclick="sendBytes('USE_PRESET=5')" style="text-align: left">
               <img src="images/combatPresetsPurple.png" class="img-30" style="display: inline-block">
               <span style="color: white">5. <span id="combat-preset-name-purple"></span></span>
             </div>
            `);

            for(let i = 1; i <= 5; i++) {
                let color = {1: "red", 2: "green", 3: "blue", 4: "yellow", 5: "purple"}[i];
                let el = $("#dialogue-combatPresets tbody tr:nth-child("+i+")");
                el.append(`
                  <td>
                    NAME
                    <br />
                    <input id="preset-${color}-name" name="preset-${color}-name" type="text" style="text-align: center">
                    <button type="button" onclick="savePresetName('${color}')" style="margin-top: 0.25em">Save Name</button>
                  </td>
                `);
                let key = "dh3.anwinity.presetName."+color;
                let value = localStorage.getItem(key);
                if(value) {
                    $(`#preset-${color}-name`).val(value);
                    $(`span#combat-preset-name-${color}`).text(value);
                }
            }
        }
    };
    $(function() {
        NamedPresets.init();
    });
})();