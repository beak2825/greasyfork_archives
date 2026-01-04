// ==UserScript==
// @name         IdlePixel Keybinds - TheeMarcel Fork
// @namespace    com.godofnades.idlepixel
// @version      1.2.2
// @description  Adds customizable keybinds for panel switching, casting spells in combat, starting combat in the different areas and more.
// @author       Original Author: Anwinity || Modded By: GodofNades/TheeMarcel
// @license      MIT
// @match        *://idle-pixel.com/login/play*
// @grant        none
// @require      https://greasyfork.org/scripts/441206-idlepixel/code/IdlePixel+.js?anticache=20220905
// @downloadURL https://update.greasyfork.org/scripts/541042/IdlePixel%20Keybinds%20-%20TheeMarcel%20Fork.user.js
// @updateURL https://update.greasyfork.org/scripts/541042/IdlePixel%20Keybinds%20-%20TheeMarcel%20Fork.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const SPELLS = Object.keys(Magic.spell_info);
    const PANELS = ["keyitems", "mining", "crafting", "gathering", "farming", "brewing", "woodcutting", "cooking", "fishing", "breeding", "invention", "combat", "combat-canvas", "combat-canvas-raids", "shop", "player-market", "donor-shop", "criptoe-market", "quests", "achievements", "collection-log", "history", "friends", "database", "idlepixelplus", "settings", "events-seed_piles", "events-yeti_boss"];
    const COMBAT = ["field", "forest", "cave", "volcano", "northern_field", "mansion", "beach", "blood_field", "blood_forest", "blood_cave", "blood_volcano"];
    const POTION = ["combat_loot_potion", "rain_potion", "rare_monster_potion", "super_rare_monster_potion", "magic_shiny_crystal_ball_potion", "magic_crystal_ball_potion", "raids_hp_potion", "raids_mana_potion", "raids_crits_potion"];
    const SEED_PILE = ["1", "20", "40", "60", "80", "100", "random", "x2", "x3", "extra_points"];

    let SPELL_MAPPING = {};
    let PANEL_MAPPING = {};
    let COMBAT_MAPPING = {};
    let POTION_MAPPING = {};
    let SEED_PILE_MAPPING = {};

    class KeyBindPlugin extends IdlePixelPlusPlugin {
        constructor() {
            super("keybinds", {
                about: {
                    name: GM_info.script.name + " (ver: " + GM_info.script.version + ")",
                    version: GM_info.script.version,
                    author: GM_info.script.author,
                    description: GM_info.script.description + `<br />In general, lowercase letters map to their respective keys. For other keys, check out <a href="https://developer.mozilla.org/en-US/docs/Web/API/UI_Events/Keyboard_event_key_values">this page</a>. Note that this does NOT use KeyboardEvent.keyCode, it uses KeyboardEvent.key.`
                },
                config: [
                    {
                        label: "Combat Areas",
                        type: "label"
                    },
                    ... COMBAT.map(combat => {
                        return {
                            id: combat,
                            label: combat,
                            type: "string",
                            default: ""
                        }
                    }),
                    {
                        label: "Combat Spells",
                        type: "label"
                    },
                    ... SPELLS.map(spell => {
                        return {
                            id: spell,
                            label: spell,
                            type: "string",
                            default: ""
                        }
                    }),{
                        label: "Potions",
                        type: "label"
                    },
                    ... POTION.map(potion => {
                        return {
                            id: potion,
                            label: potion,
                            type: "string",
                            default: ""
                        }
                    }),
                    {
                        id: "selectMonster",
                        label: "Monster for Select Potion (Direct Trigger)",
                        type: "select",
                        default: "default",
                        options: [
                            {value: "default", label: "Select Monster"},
                            {value: "chicken", label: "Chicken (Fields)"},
                            {value: "rat", label: "Rat (Fields)"},
                            {value: "spider", label: "Spider (Fields)"},
                            {value: "bee", label: "Bee (Fields)"},
                            {value: "lizard", label: "Lizard (Fields)"},
                            {value: "snake", label: "Snake (Forest)"},
                            {value: "ants", label: "Ants (Forest)"},
                            {value: "wolf", label: "Wolf (Forest)"},
                            {value: "thief", label: "Thief (Forest)"},
                            {value: "forest_ent", label: "Forest Ent (Forest)"},
                            {value: "bear", label: "Bear (Cave)"},
                            {value: "goblin", label: "Goblin (Cave)"},
                            {value: "bat", label: "Bat (Cave)"},
                            {value: "skeleton", label: "Skeleton (Cave)"},
                            {value: "fire_hawk", label: "Fire Hawk (Volcano)"},
                            {value: "fire_snake", label: "Fire Snake (Volcano)"},
                            {value: "fire_golem", label: "Fire Golem (Volcano)"},
                            {value: "fire_witch", label: "Fire Witch (Volcano)"}
                        ]
                    },
                    {
                        id: "selectPlusMonster",
                        label: "Monster for Select Plus Potion (Direct Trigger)",
                        type: "select",
                        default: "default",
                        options: [
                            {value: "default", label: "Select Monster"},
                            {value: "ice_hawk", label: "Ice Hawk (Northern Fields)"},
                            {value: "ice_golem", label: "Ice Golem (Northern Fields)"},
                            {value: "ice_witch", label: "Ice Witch (Northern Fields)"},
                            {value: "yeti", label: "Yeti (Northern Fields)"},
                            {value: "ghost", label: "Ghost (Haunted Mansion)"},
                            {value: "grandma", label: "Grandma (Haunted Mansion)"},
                            {value: "exorcist", label: "Exorcist (Haunted Mansion)"},
                            {value: "reaper", label: "Reaper (Haunted Mansion)"},
                            {value: "shark", label: "Shark (Beach)"},
                            {value: "sea_soldier", label: "Shark (Beach)"},
                            {value: "puffer_fish", label: "Puffer Fish (Beach)"},
                            {value: "saltwater_crocodile", label: "Crocodile (Beach)"}
                        ]
                    },
                    {
                        label: "Panel Switching",
                        type: "label"
                    },
                    ... PANELS.map(panel => {
                        return {
                            id: panel,
                            label: panel,
                            type: "string",
                            default: ""
                        }
                    }),
                    {
                        label: "Seed Pile",
                        type: "label"
                    },
                    ... SEED_PILE.map(seed_pile => {
                        return {
                            id: seed_pile,
                            label: seed_pile,
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
            COMBAT_MAPPING = {};
            POTION_MAPPING = {};
            SEED_PILE_MAPPING = {};

            COMBAT.forEach(combat => {
                let key = this.getConfig(combat);
                if(key) {
                    COMBAT_MAPPING[key] = combat;
                }
            });

            SPELLS.forEach(spell => {
                let key = this.getConfig(spell);
                if(key) {
                    SPELL_MAPPING[key] = spell;
                }
            });

            POTION.forEach(potion => {
                let key = this.getConfig(potion);
                if(key) {
                    POTION_MAPPING[key] = potion;
                }
            });

            PANELS.forEach(panel => {
                let key = this.getConfig(panel);
                if(key) {
                    PANEL_MAPPING[key] = panel;
                }
            });

            SEED_PILE.forEach(seed_pile => {
                let key = this.getConfig(seed_pile);
                if(key) {
                    SEED_PILE_MAPPING[key] = seed_pile;
                }
            });
        }

        handleKeyEvent(event) {
            if(event.key in COMBAT_MAPPING) {
                if(Globals.currentPanel == "panel-combat") {
                    const combat = COMBAT_MAPPING[event.key];
                    Combat.quickFight(combat);
                    event.stopPropagation();
                }
            }
            if(event.key in SPELL_MAPPING) {
                const spell = SPELL_MAPPING[event.key];
                if(Globals.currentPanel == "panel-combat-canvas") {
                    IdlePixelPlus.sendMessage(`SPELL=${spell}`);
                }else if(Globals.currentPanel == "panel-combat-canvas-raids") {
                    IdlePixelPlus.sendMessage(`CAST_RAID_SPELL=${spell}`);
                }else if (Globals.currentPanel == "panel-events-yeti_boss") {
                    if (spell == "heal" || spell == "fire") {
                        IdlePixelPlus.sendMessage(`EVENT_INPUT=YETI_BOSS~${spell}`);
                    }
                }
            }
            if(event.key in POTION_MAPPING) {
                if(Globals.currentPanel == "panel-combat-canvas" && ["combat_loot_potion", "rain_potion", "magic_shiny_crystal_ball_potion", "magic_crystal_ball_potion"].includes(POTION_MAPPING[event.key])) {
                    const potion = POTION_MAPPING[event.key];
                    if(potion == "combat_loot_potion") {
                        websocket.send('BREWING_DRINK_COMBAT_LOOT_POTION');
                    } else {
                        websocket.send(`DRINK=${potion}`);
                    }
                } else if(Globals.currentPanel == "panel-combat-canvas-raids" && ["raids_hp_potion", "raids_mana_potion", "raids_crits_potion"].includes(POTION_MAPPING[event.key])) {
                    const potion = POTION_MAPPING[event.key];
                    Raids.drinkPotion(potion);
                } else if(Globals.currentPanel == "panel-combat" && POTION_MAPPING[event.key] == "rare_monster_potion") {
                    var monsterSelect = this.getConfig("selectMonster");
                    if(monsterSelect != "default") {
                        websocket.send('DRINK_SELECT_POTION=' + monsterSelect)
                    } else {
                        Modals.clicks_rare_monster_potion();
                    }
                } else if(Globals.currentPanel == "panel-combat" && POTION_MAPPING[event.key] == "super_rare_monster_potion") {
                    var monsterSelectPlus = this.getConfig("selectPlusMonster");
                    if(monsterSelectPlus != "default") {
                        websocket.send('DRINK_SUPER_SELECT_POTION=' + monsterSelectPlus);
                    } else {
                        Modals.clicks_super_rare_monster_potion();
                    }
                }
            }
            if(event.key in PANEL_MAPPING) {
                const panel = PANEL_MAPPING[event.key];
                const in_raid = IdlePixelPlus.getVarOrDefault("in_raids", 0, "int");
                if(panel == "combat-canvas" && Combat.in_combat()) {
                    IdlePixelPlus.setPanel(panel);
                } else if(panel == "combat-canvas-raids" && in_raid) {
                    IdlePixelPlus.setPanel(panel)
                } else {
                    IdlePixelPlus.setPanel(panel);
                }
            }
            if(event.key in SEED_PILE_MAPPING) {
                const pile = SEED_PILE_MAPPING[event.key];
                if (Globals.currentPanel == "panel-events-seed_piles") {
                    if (["1", "20", "40", "60", "80", "100"].includes(pile)) {
                        websocket.send(`EVENT_INPUT=seed_piles~${pile}`);
                    } else if(["random", "extra_points"].includes(pile)) {
                        const visibility_number = [...document.getElementsByClassName(`event-entry-${pile.replace("_","-")}`)]
                                                  .map(function(e){return e.checkVisibility()})
                                                  .reduce((a, b) => a + b, 0);
                        if (visibility_number) {
                            websocket.send(`EVENT_INPUT=seed_piles~${pile}`);
                        }
                    } else {
                        const visibility_number = document.getElementById(`event-seed-piles-img-points-${pile}`)
                                                  .checkVisibility();
                        if (visibility_number) {
                            websocket.send(`EVENT_INPUT=seed_piles~${pile}`);
                        }
                    }
                }
            }
        }

        onLogin() {
            const self = this;

            document.addEventListener("keyup", (e) => {
                const focused = document.activeElement;
                if(focused && (focused.tagName == 'INPUT' || focused.tagName == 'TEXTAREA' || focused.isContentEditable)) {
                    return; // Early exit if text area is focused
                }
                this.handleKeyEvent(e);
            });

            this.onConfigsChanged();
        }

    }

    const plugin = new KeyBindPlugin();
    IdlePixelPlus.registerPlugin(plugin);

})();