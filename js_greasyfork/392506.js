// ==UserScript==
// @name ADR Cheats
// @namespace ew0345
// @author Ew0345, NightSpaceC
// @description Javascript based cheats for A Dark Room
// @version 3.1
// @homepage https://youtube.com/user/ew0345
// @icon https://i.imgur.com/iRck696.png
// @match https://adarkroom.doublespeakgames.com/
// @match https://doublespeakgames.github.io/adarkroom/
// @grant none
// @downloadURL https://update.greasyfork.org/scripts/392506/ADR%20Cheats.user.js
// @updateURL https://update.greasyfork.org/scripts/392506/ADR%20Cheats.meta.js
// ==/UserScript==

/*
* Updates:
*   - 3.1:
*         Thanks to NightSpaceC: Added new resources, added auto-attacking.
*/

var CheatMain = {
    vars: {
        amountToAdd: 10000,
        amountToHeal: 50000,
        amountOfBaseHP: 999999,
        amountOfBagSpace: 999999,
        amountOfMedsToAdd: 100,
        resources: ['glowstone', 'hypo', 'stim', 'alien alloy', 'bullets', 'cloth', 'wood', 'fur', 'torch', 'coal', 'cured meat', 'teeth', 'leather', 'sulphur', 'charm', 'meat', 'energy cell', 'medicine', 'bait', 'compass', 'steel', 'iron', 'scales'],
        weapons: ['disruptor', 'energy blade', 'plasma rifle', 'bayonet', 'bolas', 'grenade', 'rifle', 'laser rifle', 'steel sword', 'iron sword', 'bone spear'],
        perks: ['barbarian', 'boxer', 'desert rat', 'evasive', 'gastronome', 'martial artist', 'scout', 'slow metabolism', 'stealthy', 'unarmed master'],
        blueprints: ['energy blade', 'fluid recycler', 'cargo drone', 'kinetic armour', 'disruptor', 'hypo', 'stim', 'plasma rifle', 'glowstone'],
        noCostAttackButtons: ['fists', 'bone-spear', 'iron-sword', 'steel-sword', 'bayonet', 'energy-blade', 'disruptor'],
        haveCostAttackButtons: ['rifle', 'laser-rifle', 'grenade', 'bolas', 'plasma-rifle'],
        healButtons: ['eat', 'meds', 'hypo', 'use-stim', 'shld'],
        automate: {
            stoke: false,
            gather: false,
            check: false,
            noCostAttack: false,
            attack: false,
            heal: false,
            ship: false
        },
        stokeInterval: null,
        gatherInterval: null,
        trapInterval: null,
        noCostAttackInterval: null,
        attackInterval: null,
        healInterval: null,
        shipInterval: null,
        modifiedVars: {
            MOVES_PER_FOOD: 0,
            MOVES_PER_WATER: 0,
            MEAT_HEAL: 0,
            MEDS_HEAL: 0,
            BASE_HEALTH: 0,
            DEFAULT_BAG_SPACE: 0
        }
    },
    adrStoke: function() {
        if ($SM.get('game.fire.value') == 0) lightButton.click();

        if (!CheatMain.vars.automate.stoke) {
            CheatMain.vars.stokeInterval = setInterval(function() {
                if ($SM.get('stores.wood') == undefined) {
                    stokeButton.click();
                } else if ($SM.get('stores.wood') > 0) {
                    stokeButton.click();
                }
            }, 100);
            CheatMain.vars.automate.stoke = true;
            Notifications.printMessage('Enabled Auto Fire Stoking.');
        } else if (CheatMain.vars.automate.stoke) {
            clearInterval(CheatMain.vars.stokeInterval);
            CheatMain.vars.automate.stoke = false;
            Notifications.printMessage('Disabled Auto Fire Stoking.');
        }
    },
    adrGather: function() {
        if ($SM.get('stores.wood') !== undefined) {
            if (!CheatMain.vars.automate.gather) {
                CheatMain.vars.gatherInterval = setInterval(function() { gatherButton.click(); }, 100);
                CheatMain.vars.automate.gather = true;
                Notifications.printMessage("Enabled Auto Wood Gathering.");
            } else if (CheatMain.vars.automate.gather) {
                clearInterval(CheatMain.vars.gatherInterval);
                CheatMain.vars.automate.gather = false;
                Notifications.printMessage("Disabled Auto Wood Gathering.");
            }
        } else {
            Events.startEvent({
                title: _('Forest Not Unlocked'),
                scenes: {
                    start: {
                        text: [_('Silent Forest is not unlocked.')],
                        buttons: {
                            'okay': {
                                text: _('Okay'),
                                nextScene: 'end'
                            }
                        }
                    }
                }
            });
        }
    },
    adrCheckTraps: function() {
       if ($SM.get('game.buildings.trap', true) > 0) {
            if (!CheatMain.vars.automate.check) {
                CheatMain.vars.trapInterval = setInterval(function() {
                    if($SM.get('game.buildings.trap', true) == 0) {
                        Notifications.printMessage('No traps found; Building a trap.');
                        build_trap.click();
                    }
                    trapsButton.click();
                }, 100);
                CheatMain.vars.automate.check = true;
                Notifications.printMessage('Enabled Auto Trap Checking & Building.');
            } else if (CheatMain.vars.automate.check) {
                clearInterval(CheatMain.vars.trapInterval);
                CheatMain.vars.automate.check = false;
                Notifications.printMessage('Disabled Auto Trap Checking & Building.');
            }
       } else {
            Events.startEvent({
                title: _('No Traps'),
                scenes: {
                    start: {
                        text: [_('No traps built.'), _('Please build a trap first.')],
                        buttons: {
                            'okay': {
                                text: _('Okay'),
                                nextScene: 'end'
                            }
                        }
                    }
                }
            });
       }
    },
    adrDustPathUnlocked: function() {
        if ($SM.get('stores.compass') < 1 || $SM.get('stores.compass') === undefined) {
            Events.startEvent({
                title: _('Lacking Compass'),
                scenes: {
                    start: {
                        text: [_('Dusty Path is not unlocked.'), _('A compass is requied.')],
                        buttons: {
                            'okay': {
                                text: _('Okay'),
                                nextScene: 'end'
                            }
                        }
                    }
                }
            });
            return false;
        } else {
            return true;
        }
    },
    adrNoCostAttack: function() {
        if(CheatMain.adrDustPathUnlocked()) {
            if (!CheatMain.vars.automate.noCostAttack) {
                CheatMain.vars.noCostAttackInterval = setInterval(function() {
                    for(var i = 0; i < CheatMain.vars.noCostAttackButtons.length; i++) {
                        var element = document.getElementById('attack_' + CheatMain.vars.noCostAttackButtons[i]);
                        if (element == null) {
                            continue;
                        }
                        element.click();
                    }
                }, 100);
                CheatMain.vars.automate.noCostAttack = true;
                Notifications.printMessage('Enabled Auto No Cost Attack.');
            } else if (CheatMain.vars.automate.noCostAttack) {
                clearInterval(CheatMain.vars.noCostAttackInterval);
                CheatMain.vars.automate.noCostAttack = false;
                Notifications.printMessage('Disabled Auto No Cost Attack.');
            }
        }
    },
    adrAttack: function() {
        if(CheatMain.adrDustPathUnlocked()) {
            if (!CheatMain.vars.automate.attack) {
                CheatMain.vars.attackInterval = setInterval(function() {
                    var attackButtons = [...CheatMain.vars.noCostAttackButtons, ...CheatMain.vars.haveCostAttackButtons];
                    for(var i = 0; i < attackButtons.length; i++) {
                        var element = document.getElementById('attack_' + attackButtons[i]);
                        if (element == null) {
                            continue;
                        }
                        element.click();
                    }
                }, 100);
                CheatMain.vars.automate.attack = true;
                Notifications.printMessage('Enabled Auto Attack.');
            } else if (CheatMain.vars.automate.attack) {
                clearInterval(CheatMain.vars.attackInterval);
                CheatMain.vars.automate.attack = false;
                Notifications.printMessage('Disabled Auto Attack.');
            }
        }
    },
    adrHeal: function() {
        if(CheatMain.adrDustPathUnlocked()) {
            if (!CheatMain.vars.automate.heal) {
                CheatMain.vars.healInterval = setInterval(function() {
                    for(var i = 0; i < CheatMain.vars.healButtons.length; i++) {
                        var element = document.getElementById(CheatMain.vars.healButtons[i]);
                        if (element == null) {
                            continue;
                        }
                        element.click();
                    }
                }, 100);
                CheatMain.vars.automate.heal = true;
                Notifications.printMessage('Enabled Auto Heal.');
            } else if (CheatMain.vars.automate.heal) {
                clearInterval(CheatMain.vars.healInterval);
                CheatMain.vars.automate.heal = false;
                Notifications.printMessage('Disabled Auto Heal.');
            }
        }
    },
    adrGiveResources: function() {
        for (var i = 0; i < CheatMain.vars.resources.length; i++) {
            $SM.add('stores["'+CheatMain.vars.resources[i]+'"]', CheatMain.vars.amountToAdd);
            $SM.set('stores.compass', 1);
            $SM.set('stores["fleet beacon"]', 1);
        }

        Notifications.printMessage('Gave '+CheatMain.vars.amountToAdd+' resources.');
    },
    adrGiveWeapons: function() {
        for (var i = 0; i < CheatMain.vars.weapons.length; i++) {
            $SM.add('stores["'+CheatMain.vars.weapons[i]+'"]', CheatMain.vars.amountToAdd);
        }

        Notifications.printMessage('Gave '+CheatMain.vars.amountToAdd+' weapons.');
    },
    adrGiveBlueprints: function() {
        for (var i = 0; i < CheatMain.vars.blueprints.length; i++) {
            $SM.set('character.blueprints["'+CheatMain.vars.blueprints[i]+'"]', true);
        }

        Notifications.printMessage('Gave All Blueprints.');
    },
    adrGiveAllPerks: function() {
        for (var i = 0; i < CheatMain.vars.perks.length; i++) {
            $SM.set('character.perks["'+CheatMain.vars.perks[i]+'"]', true);
        }

        Notifications.printMessage('Gave All Perks.');
    },
    adrNoWaterOrFood: function() {
        if (CheatMain.adrDustPathUnlocked()) {
            if (CheatMain.vars.modifiedVars.MOVES_PER_FOOD != World.MOVES_PER_FOOD && CheatMain.vars.modifiedVars.MOVES_PER_FOOD < $SM.MAX_STORE && CheatMain.vars.modifiedVars.MOVES_PER_FOOD != 0) {
                World.MOVES_PER_FOOD = CheatMain.vars.modifiedVars.MOVES_PER_FOOD;
                World.MOVES_PER_WATER = CheatMain.vars.modifiedVars.MOVES_PER_WATER;

                Notifications.printMessage('Moves per food and water reset to original values.');
            } else {
                CheatMain.vars.modifiedVars.MOVES_PER_FOOD = World.MOVES_PER_FOOD;
                CheatMain.vars.modifiedVars.MOVES_PER_WATER = World.MOVES_PER_WATER;
                World.MOVES_PER_FOOD = $SM.MAX_STORE;
                World.MOVES_PER_WATER = $SM.MAX_STORE;

                Notifications.printMessage('Moves per food and water set to: '+$SM.MAX_STORE+'.');
            }
        }
    },
    adrHighHealing: function() {
        if (CheatMain.adrDustPathUnlocked()) {
            if (CheatMain.vars.modifiedVars.MEAT_HEAL != World.MEAT_HEAL && CheatMain.vars.modifiedVars.MEAT_HEAL < CheatMain.vars.amountToHeal && CheatMain.vars.modifiedVars.MEAT_HEAL != 0) {
                World.MEAT_HEAL = CheatMain.vars.modifiedVars.MEAT_HEAL;
                World.MEDS_HEAL = CheatMain.vars.modifiedVars.MEDS_HEAL;

                clearInterval(CheatMain.vars.healInterval);

                Notifications.printMessage('Heal values of Meat & Meds reset to original values.');
            } else {
                CheatMain.vars.modifiedVars.MEAT_HEAL = World.MEAT_HEAL;
                CheatMain.vars.modifiedVars.MEDS_HEAL = World.MEDS_HEAL;

                // Seemed to reset under unknown circumstances so had to add this
                CheatMain.vars.healInterval = setInterval(function () {
                    World.MEAT_HEAL = CheatMain.vars.amountToHeal;
                    World.MEDS_HEAL = CheatMain.vars.amountToHeal;
                }, 1000);

                Notifications.printMessage('Heal values of Meat & Meds set to: '+CheatMain.vars.amountToHeal+'.');
            }
        }
    },
    adrLotsOfHP: function() {
        if (CheatMain.adrDustPathUnlocked()) {
            if (CheatMain.vars.modifiedVars.BASE_HEALTH != World.BASE_HEALTH && CheatMain.vars.modifiedVars.BASE_HEALTH < CheatMain.vars.amountOfBaseHP && CheatMain.vars.modifiedVars.BASE_HEALTH != 0) {
                World.BASE_HEALTH = CheatMain.vars.modifiedVars.BASE_HEALTH;
                World.health = World.getMaxHealth();

                Notifications.printMessage('Base health has been reset to original value.');
            } else {
                CheatMain.vars.modifiedVars.BASE_HEALTH = World.BASE_HEALTH;

                World.BASE_HEALTH = CheatMain.vars.amountOfBaseHP;
                World.health = World.getMaxHealth();

                Notifications.printMessage('Base health has been set to: '+CheatMain.vars.amountOfBaseHP+'.');
            }
        }
    },
    adrLotsOfStorage: function() {
        if (CheatMain.adrDustPathUnlocked()) {
            if (CheatMain.vars.modifiedVars.amountOfBagSpace != Path.DEFAULT_BAG_SPACE && CheatMain.vars.modifiedVars.amountOfBagSpace < CheatMain.vars.amountOfBagSpace && CheatMain.vars.modifiedVars.amountOfBagSpace != 0) {
                Path.DEFAULT_BAG_SPACE = CheatMain.vars.modifiedVars.amountOfBagSpace;

                Notifications.printMessage('Default bag space reset to original value.');
            } else {
                CheatMain.vars.modifiedVars.amountOfBagSpace = Path.DEFAULT_BAG_SPACE;

                Path.DEFAULT_BAG_SPACE = CheatMain.vars.amountOfBagSpace;

                Notifications.printMessage('Default bag space set to: '+CheatMain.vars.amountOfBagSpace+'.');
            }
        }
    },
    adrAddMeds: function() {
        if (CheatMain.adrDustPathUnlocked()) {
            Path.outfit["cured meat"] = CheatMain.amountOfMedsToAdd;
            Path.outfit["medicine"] = CheatMain.amountOfMedsToAdd;

            Notifications.printMessage('Added '+CheatMain.amountToAdd+' of Cured Meat & Medicine to rucksack.');
        }
    },
    adrResetDeathCooldown: function() {
        if (CheatMain.adrDustPathUnlocked()) {
            Button.clearCooldown($('#embarkButton'));
            Notifications.printMessage('Death Cooldown reset.');
        }
    },
    adrAutoUpgradeShip: function() {
        if ($SM.get('features.location.spaceShip')) {
            if (!CheatMain.vars.automate.ship) {
                CheatMain.vars.shipInterval = setInterval(function() {
                    if ('alien alloy' in $SM.get('stores')) {
                        reinforceButton.click();
                        engineButton.click();
                    }
                }, 10);

                CheatMain.vars.automate.ship = true;
                Notifications.printMessage('Auto Reinforce and Upgrade for ship enabled.');
            } else if (CheatMain.vars.automate.ship) {
                clearInterval(CheatMain.vars.shipInterval);

                CheatMain.vars.automate.ship = false;
                Notifications.printMessage('Auto Reinforce and Upgrade for ship disabled.');
            }
        } else {
            Events.startEvent({
                title: _('Ship Not Unlocked'),
                scenes: {
                    start: {
                        text: [_('You need to find the ship on the world map.')],
                        buttons: {
                            'okay': {
                                text: _('Okay'),
                                nextScene: 'end'
                            }
                        }
                    }
                }
            });
        }
    },
    buildCheatMenu: function() {
        // build cheat menu
        var cMenu = $('<div>')
            .addClass('cMenu')
            .text('==Cheat Menu== | ')
            .css('text-align', 'center')
            .prependTo('body');
        $('<button>')
            .text(_('Auto Stoke'))
            .css('cursor', 'pointer')
            .click(() => CheatMain.adrStoke())
            .appendTo(cMenu);
        $('<button>')
            .text(_('Auto Gather'))
            .css('cursor', 'pointer')
            .click(() => CheatMain.adrGather())
            .appendTo(cMenu);
        $('<button>')
            .text(_('Auto Check Traps'))
            .css('cursor', 'pointer')
            .click(() => CheatMain.adrCheckTraps())
            .appendTo(cMenu);
        $('<button>')
            .text(_('Auto No Cost Attack'))
            .css('cursor', 'pointer')
            .click(() => CheatMain.adrNoCostAttack())
            .appendTo(cMenu);
        $('<button>')
            .text(_('Auto Attack'))
            .css('cursor', 'pointer')
            .click(() => CheatMain.adrAttack())
            .appendTo(cMenu);
        $('<button>')
            .text(_('Auto Heal'))
            .css('cursor', 'pointer')
            .click(() => CheatMain.adrHeal())
            .appendTo(cMenu);
        $('<button>')
            .text(_('Give All Resources'))
            .css('cursor', 'pointer')
            .click(() => CheatMain.adrGiveResources())
            .appendTo(cMenu);
        $('<button>')
            .text(_('Give All Weapons'))
            .css('cursor', 'pointer')
            .click(() => CheatMain.adrGiveWeapons())
            .appendTo(cMenu);
        $('<button>')
            .text(_('Give All Blueprints'))
            .css('cursor', 'pointer')
            .click(() => CheatMain.adrGiveBlueprints())
            .appendTo(cMenu);
        $('<button>')
            .text(_('Give All Perks'))
            .css('cursor', 'pointer')
            .click(() => CheatMain.adrGiveAllPerks())
            .appendTo(cMenu);
        $('<button>')
            .text(_('No Water/Food Use'))
            .css('cursor', 'pointer')
            .click(() => CheatMain.adrNoWaterOrFood())
            .appendTo(cMenu);
        $('<button>')
            .text(_('More Health from Food/Meds'))
            .css('cursor', 'pointer')
            .click(() => CheatMain.adrHighHealing())
            .appendTo(cMenu);
        $('<button>')
            .text(_('More Base HP'))
            .css('cursor', 'pointer')
            .click(() => CheatMain.adrLotsOfHP())
            .appendTo(cMenu);
        $('<button>')
            .text(_('More Base Bag Space'))
            .css('cursor', 'pointer')
            .click(() => CheatMain.adrLotsOfStorage())
            .appendTo(cMenu);
        $('<button>')
            .text(_('Reset Death Cooldown'))
            .css('cursor', 'pointer')
            .click(() => CheatMain.adrResetDeathCooldown())
            .appendTo(cMenu);
        $('<button>')
            .text(_('Auto Upgrade Ship'))
            .css('cursor', 'pointer')
            .click(() => CheatMain.adrAutoUpgradeShip())
            .appendTo(cMenu);

        // style buttons
        $('<style>')
            .html(".cMenu button{position: relative; text-align: center; border: 1px solid black;margin-bottom: 5px;padding: 5px 10px;cursor: pointer;-webkit-touch-callout: none;-webkit-user-select: none;-khtml-user-select: none;-moz-user-select: none;-ms-user-select: none;user-select: none;} .cMenu button:hover{text-decoration:underline;} .cMenu.dark button{border:1px solid #EEE;background-color:#272823;color:#EEE;} .cMenu.dark{background-color:#272823;color:#EEE}")
            .appendTo(document.head);

        setInterval(function() {
            // check for light off/light on
            if ($SM.get("config.lightsOff")) {
                cMenu.addClass('dark');
            } else {
                cMenu.removeClass('dark');
            }
        }, 100);
    }
}

// wait for page to be fully loaded
if (document.readyState !== 'loading') {
    setTimeout(CheatMain.buildCheatMenu, 0);
} else {
    window.addEventListener('DOMContentLoaded', function () {
        setTimeout(CheatMain.buildCheatMenu, 0);
    });
}
