// ==UserScript==
// @name         DH3 Super Duper Preset Switcher
// @namespace    com.anwinity.dh3
// @version      1.0.6
// @description  Adds the ability to switch to ALL of your presets in combat.
// @author       Anwinity
// @match        dh3.diamondhunt.co
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/413716/DH3%20Super%20Duper%20Preset%20Switcher.user.js
// @updateURL https://update.greasyfork.org/scripts/413716/DH3%20Super%20Duper%20Preset%20Switcher.meta.js
// ==/UserScript==

(function() {
    'use strict';

    function initUI() {
        const container = $("#fighting-screen-presets-area > .fighting-screen-combat-area");
        container.empty();
        container.append(`
        <style>
        .dh3-sdps-preset-button {
          display: inline-block;
          opacity: 1;
          margin-top: 0.125em;
          margin-bottom: 0.125em;
          cursor: pointer;
        }
        .dh3-sdps-preset-row {
          padding-top: 0.125em;
        }
        .dh3-sdps-preset-row.active {
          background-color: rgba(71, 71, 91, 0.85);
        }
        .dh3-sdps-preset-button:first-child {
          margin-right: 4px;
        }
        .dh3-sdps-preset-button:hover {
          opacity: 0.6;
        }
        .dh3-sdps-preset-button > img {
          width: 26px;
          height: 26px;
        }
        </style>
        `);
        for(let presetSet = 0; presetSet<5; presetSet++) {
            container.append(`
            <div class="dh3-sdps-preset-row">
              <div onclick="sendBytes('CHANGE_PRESET_SET=${presetSet}')" class="dh3-sdps-preset-button">
                <img src="images/combatPresetsIcon.png">
              </div>
              <div onclick="usePreset(${5*presetSet + 1})" class="dh3-sdps-preset-button">
                <img src="images/combatPresetsRed.png">
              </div>
              <div onclick="usePreset(${5*presetSet + 2})" class="dh3-sdps-preset-button">
                <img src="images/combatPresetsGreen.png">
              </div>
              <div onclick="usePreset(${5*presetSet + 3})" class="dh3-sdps-preset-button">
                <img src="images/combatPresetsBlue.png">
              </div>
              <div onclick="usePreset(${5*presetSet + 4})" class="dh3-sdps-preset-button">
                <img src="images/combatPresetsYellow.png">
              </div>
              <div onclick="usePreset(${5*presetSet + 5})" class="dh3-sdps-preset-button">
                <img src="images/combatPresetsPurple.png">
              </div>
            </div>
            `);
        }
    }

    function init() {
        if(!window.var_username) {
            setTimeout(init, 1000);
            return;
        }

        initUI();

        let original_setItems = window.setItems;
        window.setItems = function(a) {
            original_setItems.apply(this, arguments);
            if(a.includes("presetsSetIndex")) {
                let index = parseInt(window.var_presetsSetIndex);
                $(".dh3-sdps-preset-row.active").removeClass("active");
                $(`.dh3-sdps-preset-row:nth-child(${index+2})`).addClass("active");
            }
        }

        let original_onkeyup = document.onkeyup;
        document.onkeyup = function(e) {
            if(!$("#chat-area-input").is(":focus") && $("#navigation-right-combat-fighting").is(":visible")) {
                switch(e.keyCode) {
                    case 54: sendBytes("CHANGE_PRESET_SET=0"); break;
                    case 55: sendBytes("CHANGE_PRESET_SET=1"); break;
                    case 56: sendBytes("CHANGE_PRESET_SET=2"); break;
                    case 57: sendBytes("CHANGE_PRESET_SET=3"); break;
                    case 48: sendBytes("CHANGE_PRESET_SET=4"); break;
                    default: {
                        if(typeof original_onkeyup === "function") {
                            original_onkeyup.apply(this, arguments);
                        }
                        break;
                    }
                }
            }
            else {
                if(typeof original_onkeyup === "function") {
                    original_onkeyup.apply(this, arguments);
                }
            }
        }
        $(`.dh3-sdps-preset-row:nth-child(${parseInt(var_presetsSetIndex||"0")+2})`).addClass("active");
    }
    $(init);

})();