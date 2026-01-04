// ==UserScript==
// @name         IdlePixel Keybinds
// @namespace    com.anwinity.idlepixel
// @version      1.0.0
// @description  Adds customizable keybinds for panel switching and casting spells in combat.
// @author       Anwinity
// @license      MIT
// @match        *://idle-pixel.com/login/play*
// @grant        none
// @require      https://greasyfork.org/scripts/441206-idlepixel/code/IdlePixel+.js?anticache=20220905
// @downloadURL https://update.greasyfork.org/scripts/452390/IdlePixel%20Keybinds.user.js
// @updateURL https://update.greasyfork.org/scripts/452390/IdlePixel%20Keybinds.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const SPELL_DEFAULTS = {
        heal: "h",
        fire: "f",
        reflect: "r",
        invisibility: "i"
    };
    const SPELLS = Object.keys(Magic.spell_info);
    const PANELS = ["keyitems", "mining", "crafting", "gathering", "farming", "brewing", "woodcutting", "cooking", "fishing", "combat", "combat-canvas", "quests", "settings", "shop", "player-market", "donor-shop", "achievements", "idlepixelplus"];

    let SPELL_MAPPING = {};
    let PANEL_MAPPING = {};

    class KeyBindPlugin extends IdlePixelPlusPlugin {
        constructor() {
            super("keybinds", {
                about: {
                    name: GM_info.script.name,
                    version: GM_info.script.version,
                    author: GM_info.script.author,
                    description: GM_info.script.description + `<br />In general, lowercase letters map to their respective keys. For other keys, check out <a href="https://developer.mozilla.org/en-US/docs/Web/API/UI_Events/Keyboard_event_key_values">this page</a>. Note that this does NOT use KeyboardEvent.keyCode, it uses KeyboardEvent.key.`
                },
                config: [
                    {
                        label: "Combat Spells",
                        type: "label"
                    },
                    ... SPELLS.map(spell => {
                        return {
                            id: spell,
                            label: spell,
                            type: "string",
                            default: SPELL_DEFAULTS[spell]||""
                        }
                    }),
                    {
                        label: "Panel Switching",
                        type: "label"
                    },
                    ...PANELS.map(panel => {
                         return {
                            id: panel,
                            label: panel,
                            type: "string",
                            default: ""
                        }
                    })
                ]
            });
        }

        onConfigsChanged() {
            SPELL_MAPPING = {};
            PANEL_MAPPING = {};

            SPELLS.forEach(spell => {
                let key = this.getConfig(spell);
                if(key) {
                    SPELL_MAPPING[key] = spell;
                }
            });

            PANELS.forEach(panel => {
                let key = this.getConfig(panel);
                if(key) {
                    PANEL_MAPPING[key] = panel;
                }
            });
        }

        handleKeyEvent(event) {
            if(event.key in SPELL_MAPPING) {
                if(Globals.currentPanel == "panel-combat-canvas") {
                    const spell = SPELL_MAPPING[event.key];
                    IdlePixelPlus.sendMessage(`SPELL=${spell}`);
                }
            }
            if(event.key in PANEL_MAPPING) {
                const focused = document.activeElement;
                if(!focused || !["INPUT", "SELECT"].includes((focused.tagName||"").toUpperCase())) {
                    const panel = PANEL_MAPPING[event.key];
                    if(panel == "combat-canvas") {
                        if(Combat.in_combat()) {
                            IdlePixelPlus.setPanel(panel);
                        }
                    }
                    else {
                        IdlePixelPlus.setPanel(panel);
                    }
                }
            }
        }

        onLogin() {
            const self = this;

            document.addEventListener("keyup", e => {
                this.handleKeyEvent(e);
            });

            this.onConfigsChanged();
        }

    }

    const plugin = new KeyBindPlugin();
    IdlePixelPlus.registerPlugin(plugin);

})();