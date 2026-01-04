// ==UserScript==
// @name		Melvor ETA
// @namespace	http://tampermonkey.net/
// @version		0.11.5
// @description	Shows xp/h and mastery xp/h, and the time remaining until certain targets are reached. Takes into account Mastery Levels and other bonuses.
// @description	Please report issues on https://github.com/gmiclotte/melvor-scripts/issues or message TinyCoyote#1769 on Discord
// @description	The last part of the version number is the most recent version of Melvor that was tested with this script. More recent versions might break the script.
// @description	Forked from Breindahl#2660's Melvor TimeRemaining script v0.6.2.2., originally developed by Breindahl#2660, Xhaf#6478 and Visua#9999
// @author		GMiclotte
// @include		https://melvoridle.com/*
// @include		https://*.melvoridle.com/*
// @exclude		https://melvoridle.com/index.php
// @exclude		https://*.melvoridle.com/index.php
// @exclude		https://wiki.melvoridle.com/*
// @exclude		https://*.wiki.melvoridle.com/*
// @inject-into page
// @noframes
// @grant		none
// @downloadURL https://update.greasyfork.org/scripts/415592/Melvor%20ETA.user.js
// @updateURL https://update.greasyfork.org/scripts/415592/Melvor%20ETA.meta.js
// ==/UserScript==

((main) => {
    const script = document.createElement('script');
    script.textContent = `try { (${main})(); } catch (e) { console.log(e); }`;
    document.body.appendChild(script).parentNode.removeChild(script);
})(() => {
    function startETASettings() {
        if (window.ETASettings === undefined) {
            createETASettings();
            // load settings from local storage
            if (window.localStorage['ETASettings'] !== undefined) {
                window.ETASettings.load();
                window.ETASettings.save();
            }
        }
    }

    function startETA() {
        if (window.ETA !== undefined) {
            ETA.error('ETA is already loaded!');
        } else {
            createETA();
            loadETA();
        }
    }

    function createETASettings() {
        // settings can be changed from the console, the default values here will be overwritten by the values in localStorage['ETASettings']
        window.ETASettings = {
            /*
                toggles
             */
            // true for 12h clock (AM/PM), false for 24h clock
            IS_12H_CLOCK: false,
            // true for short clock `xxhxxmxxs`, false for long clock `xx hours, xx minutes and xx seconds`
            IS_SHORT_CLOCK: true,
            // true for alternative main display with xp/h, mastery xp/h and action count
            SHOW_XP_RATE: true,
            // true to show action times
            SHOW_ACTION_TIME: false,
            // true to allow final pool percentage > 100%
            UNCAP_POOL: true,
            // true will show the current xp/h and mastery xp/h; false shows average if using all resources
            // does not affect anything if SHOW_XP_RATE is false
            CURRENT_RATES: true,
            // set to true to include mastery tokens in time until 100% pool
            USE_TOKENS: false,
            // set to true to show partial level progress in the ETA tooltips
            SHOW_PARTIAL_LEVELS: false,
            // set to true to hide the required resources in the ETA tooltips
            HIDE_REQUIRED: false,
            // set to true to include "potential" Summoning exp from created tablets
            USE_TABLETS: false,
            // set to true to play a sound when we run out of resources or reach a target
            DING_RESOURCES: true,
            DING_LEVEL: true,
            DING_MASTERY: true,
            DING_POOL: true,
            // change the ding sound level
            DING_VOLUME: 0.1,
            /*
                targets
             */
            // Default global target level / mastery / pool% is 99 / 99 / 100
            GLOBAL_TARGET_LEVEL: 99,
            GLOBAL_TARGET_MASTERY: 99,
            GLOBAL_TARGET_POOL: 100,
            // skill specific targets can be defined here, these override the global targets
            TARGET_LEVEL: {
                // [Skills.Firemaking]: 120,
            },
            TARGET_MASTERY: {
                // [Skills.Herblore]: 90,
            },
            TARGET_POOL: {
                // [Skills.Crafting]: 25,
            },
            // returns the appropriate target
            getNext: (current, list) => {
                if (list === undefined) {
                    return list
                }
                if (list.length !== undefined) {
                    for (let i = 0; i < list.length; i++) {
                        if (list[i] > current) {
                            return list[i];
                        }
                    }
                    return Math.max(list);
                }
                return list;
            },
            getTarget: (current, global, specific, defaultTarget, maxTarget) => {
                if (current !== null) {
                    global = ETASettings.getNext(current, global);
                    specific = ETASettings.getNext(current, specific);
                }
                let target = defaultTarget;
                if (Number.isInteger(global)) {
                    target = global;
                }
                if (Number.isInteger(specific)) {
                    target = specific;
                }
                if (target <= 0) {
                    target = defaultTarget;
                }
                if (target >= maxTarget) {
                    target = maxTarget;
                }
                return Math.ceil(target);
            },
            getTargetLevel: (skillID, currentLevel) => {
                return ETASettings.getTarget(currentLevel, ETASettings.GLOBAL_TARGET_LEVEL, ETASettings.TARGET_LEVEL[skillID], 99, 170);
            },
            getTargetMastery: (skillID, currentMastery) => {
                return ETASettings.getTarget(currentMastery, ETASettings.GLOBAL_TARGET_MASTERY, ETASettings.TARGET_MASTERY[skillID], 99, 170);
            },
            getTargetPool: (skillID, currentPool) => {
                return ETASettings.getTarget(currentPool, ETASettings.GLOBAL_TARGET_POOL, ETASettings.TARGET_POOL[skillID], 100, 100);
            },

            /*
                methods
             */
            // save settings to local storage
            save: () => {
                window.localStorage['ETASettings'] = window.JSON.stringify(window.ETASettings);
            },
            // load settings from local storage
            load: () => {
                const stored = window.JSON.parse(window.localStorage['ETASettings']);
                Object.getOwnPropertyNames(stored).forEach(x => {
                    window.ETASettings[x] = stored[x];
                });
            },
        };
    }

    function createETA() {
        // global object
        window.ETA = {};

        ETA.log = function (...args) {
            console.log("Melvor ETA:", ...args)
        }

        ETA.error = function (...args) {
            console.error("Melvor ETA:", ...args)
        }

        ETA.createSettingsMenu = () => {
            // check if combat sim methods are available
            if (window.MICSR === undefined || MICSR.TabCard === undefined) {
                ETA.menuCreationAttempts = (ETA.menuCreationAttempts || 0) + 1;
                if (ETA.menuCreationAttempts > 10) {
                    ETA.log('Failed to add settings menu! Melvor ETA will work fine without it. '
                        + 'Install the "Melvor Idle Combat Simulator Reloaded" extension to use the settings interface.');
                    ETA.log('Find it here: https://github.com/visua0/Melvor-Idle-Combat-Simulator-Reloaded');
                } else {
                    // try again in 50 ms
                    setTimeout(ETA.createSettingsMenu, 50);
                }
                return;
            }

            // set names
            ETA.modalID = 'etaModal';
            ETA.menuItemID = 'etaButton';

            // clean up in case elements already exist
            MICSR.destroyMenu(ETA.menuItemID, ETA.modalID);

            // create wrapper
            ETA.content = document.createElement('div');
            ETA.content.className = 'mcsTabContent';

            // add toggles card
            ETA.addToggles();

            // add global target card
            ETA.addGlobalTargetInputs();

            // add target card
            ETA.addTargetInputs();

            // create modal and access point
            ETA.modal = MICSR.addModal('ETA Settings', ETA.modalID, [ETA.content]);
            let style = document.createElement("style");
            document.head.appendChild(style);
            let sheet = style.sheet;
            sheet.insertRule('#etaModal.show { display: flex !important; }')
            sheet.insertRule('#etaModal .modal-dialog { max-width: 95%; display: inline-block; }')
            MICSR.addMenuItem('ETA Settings', 'assets/media/main/settings_header.svg', ETA.menuItemID, ETA.modalID);

            // log
            ETA.log('added settings menu!')
        }

        ETA.addToggles = () => {
            ETA.togglesCard = new MICSR.Card(ETA.content, '', '150px', true);
            const titles = {
                IS_12H_CLOCK: 'Use 12h clock',
                IS_SHORT_CLOCK: 'Use short time format',
                SHOW_XP_RATE: 'Show XP rates',
                SHOW_ACTION_TIME: 'Show action times',
                UNCAP_POOL: 'Show pool past 100%',
                CURRENT_RATES: 'Show current rates',
                USE_TOKENS: '"Use" Mastery tokens for final Pool %',
                SHOW_PARTIAL_LEVELS: 'Show partial levels',
                HIDE_REQUIRED: 'Hide required resources',
                DING_RESOURCES: 'Ding when out of resources',
                DING_LEVEL: 'Ding on level target',
                DING_MASTERY: 'Ding on mastery target',
                DING_POOL: 'Ding on pool target',
                USE_TABLETS: '"Use" all created Summoning Tablets',
            };
            Object.getOwnPropertyNames(titles).forEach(property => {
                const title = titles[property];
                ETA.togglesCard.addToggleRadio(
                    title,
                    property,
                    ETASettings,
                    property,
                    ETASettings[property],
                );
            });
        }

        ETA.addGlobalTargetInputs = () => {
            ETA.globalTargetsCard = new MICSR.Card(ETA.content, '', '150px', true);
            [
                {id: 'LEVEL', label: 'Global level targets', defaultValue: [99]},
                {id: 'MASTERY', label: 'Global mastery targets', defaultValue: [99]},
                {id: 'POOL', label: 'Global pool targets (%)', defaultValue: [100]},
            ].forEach(target => {
                const globalKey = 'GLOBAL_TARGET_' + target.id;
                ETA.globalTargetsCard.addNumberArrayInput(
                    target.label,
                    ETASettings,
                    globalKey,
                    target.defaultValue
                );
            });

        }

        ETA.addTargetInputs = () => {
            ETA.skillTargetCard = new MICSR.TabCard('EtaTarget', true, ETA.content, '', '150px', true);
            [
                Skills.Woodcutting,
                Skills.Fishing,
                Skills.Firemaking,
                Skills.Cooking,
                Skills.Mining,
                Skills.Smithing,
                Skills.Thieving,
                Skills.Fletching,
                Skills.Crafting,
                Skills.Runecrafting,
                Skills.Herblore,
                Skills.Agility,
                Skills.Summoning,
                Skills.Astrology,
                Skills.Magic,
            ].forEach(i => {
                const card = ETA.skillTargetCard.addTab(SKILLS[i].name, SKILLS[i].media, '', '150px', false);
                card.addSectionTitle(SKILLS[i].name + ' Targets');
                [
                    {id: 'LEVEL', label: 'Level targets'},
                    {id: 'MASTERY', label: 'Mastery targets'},
                    {id: 'POOL', label: 'Pool targets (%)'},
                ].forEach(target => {
                    const key = 'TARGET_' + target.id;
                    card.addNumberArrayInput(
                        target.label,
                        ETASettings[key],
                        i,
                    );
                });
            });
        }

        ////////
        //ding//
        ////////
        // Function to check if task is complete
        ETA.taskComplete = function () {
            const last = ETA.timeLeftLast;
            const current = ETA.timeLeftCurrent;
            if (last === undefined) {
                return;
            }
            if (last.skillID !== current.skillID) {
                // started a different skill, don't ding
                return;
            }
            if (last.action !== current.action) {
                // started a different action, don't ding
                return;
            }
            if (last.times.length !== current.times.length) {
                // ding settings were changed, don't ding
                return;
            }
            // ding if any targets were reached
            for (let i = 0; i < last.times.length; i++) {
                const lastTime = last.times[i];
                const currentTime = current.times[i];
                if (lastTime.current >= lastTime.target) {
                    // target already reached
                    continue;
                }
                if (currentTime.current >= lastTime.target) { // current level is higher than previous target
                    notifyPlayer(last.skillID, currentTime.msg, "danger");
                    ETA.log(currentTime.msg);
                    let ding = new Audio("https://www.myinstants.com/media/sounds/ding-sound-effect.mp3");
                    ding.volume = ETASettings.DING_VOLUME;
                    ding.play();
                    return;
                }
            }
        }

        ETA.time = (ding, target, current, msg) => {
            return {ding: ding, target: target, current: current, msg: msg};
        };

        ETA.setTimeLeft = function (initial, times) {
            // save previous
            ETA.timeLeftLast = ETA.timeLeftCurrent;
            // set current
            ETA.timeLeftCurrent = {
                skillID: initial.skillID,
                action: initial.currentAction.toString(),
                times: times.filter(x => x.ding),
            }
        }


        //////////////
        //containers//
        //////////////

        ETA.displayContainer = (id) => {
            const displayContainer = document.createElement('div');
            displayContainer.classList = "font-size-base font-w600 text-center text-muted";
            const display = document.createElement('small');
            display.id = id;
            display.classList = 'mb-2';
            display.style = 'display:block;clear:both;white-space:pre-line';
            display.dataToggle = 'tooltip';
            display.dataPlacement = 'top';
            display.dataHtml = 'true';
            display.title = '';
            display.dataOriginalTitle = '';
            displayContainer.appendChild(display);
            const displayAmt = document.createElement('small');
            displayAmt.id = `${id + '-YouHave'}`;
            displayAmt.classList = 'mb-2';
            displayAmt.style = 'display:block;clear:both;white-space:pre-line';
            displayContainer.appendChild(displayAmt);
            return displayContainer;
        }

        ETA.displays = {};

        ETA.createDisplay = (skillID, index) => {
            let displayID = `timeLeft${Skills[skillID]}`;
            if (index !== undefined) {
                displayID += `-${index}`;
            }
            ETA.displays[displayID] = true;
            let display = document.getElementById(displayID);
            if (display !== null) {
                // display already exists
                return display;
            }
            // standard processing container
            if ([
                Skills.Smithing,
                Skills.Fletching,
                Skills.Crafting,
                Skills.Runecrafting,
                Skills.Herblore,
                Skills.Summoning
            ].includes(skillID)) {
                const node = document.querySelector(`[aria-labelledBy=${Skills[skillID]}-artisan-menu-recipe-select]`).parentElement.parentElement.parentElement
                display = node.parentNode.insertBefore(ETA.displayContainer(displayID), node.nextSibling);
                return display ? display.firstChild : undefined;
            }
            // other containers
            let node = null;
            const wrapperID = `${displayID}Wrapper`;
            let wrapper = undefined;
            switch (skillID) {
                case Skills.Woodcutting:
                    if (index === undefined) {
                        node = document.getElementsByClassName('progress-bar bg-woodcutting')[0].parentNode;
                        display = node.parentNode.insertBefore(ETA.displayContainer(displayID), node.nextSibling);
                    } else {
                        node = document.getElementsByClassName('progress-bar bg-woodcutting')[index + 1].parentNode;
                        display = node.parentNode.insertBefore(ETA.displayContainer(displayID), node.nextSibling);
                    }
                    break;
                case Skills.Fishing:
                    node = document.getElementById('fishing-area-menu-container').children[1 + index].children[0].children[0].children[3].children[0].children[1].children[1];
                    display = node.appendChild(ETA.displayContainer(displayID));
                    break;
                case Skills.Firemaking:
                    node = document.getElementById('skill-fm-logs-selected-qty');
                    node = node.parentNode.parentNode.parentNode;
                    display = node.parentNode.insertBefore(ETA.displayContainer(displayID), node.nextSibling);
                    break;
                case Skills.Cooking:
                    node = document.getElementById(`cooking-menu-container`).children[index].firstChild.firstChild.firstChild.firstChild.children[4];
                    ETA.displays[wrapperID] = false;
                    wrapper = document.createElement('div');
                    wrapper.className = 'col-12';
                    wrapper.id = wrapperID;
                    wrapper.appendChild(ETA.displayContainer(displayID));
                    display = node.parentNode.appendChild(wrapper);
                    break;
                case Skills.Mining:
                    node = document.getElementById(`mining-ores-container`).children[(11 + index + 1) % 11].childNodes[1].childNodes[1].childNodes[1].childNodes[8];
                    display = node.parentNode.insertBefore(ETA.displayContainer(displayID), node);
                    break;
                case Skills.Thieving:
                    document.getElementById(`mastery-screen-skill-10-${index}`)
                        .parentElement
                        .parentElement
                        .parentElement
                        .parentElement
                        .parentElement
                        .parentElement
                        .children[0]
                        .appendChild(ETA.displayContainer(displayID));
                    break;
                case Skills.Agility:
                    if (index === undefined) {
                        document.getElementById('agility-breakdown-items').appendChild(ETA.displayContainer(displayID));
                    } else {
                        node = document.getElementById(`skill-content-container-20`).children[index].children[0].children[0].children[1].children[0];
                        display = node.insertBefore(ETA.displayContainer(displayID), node.children[4]);
                    }
                    break;
                case Skills.Astrology:
                    node = document.getElementById(`astrology-container-content`).children[index].children[0].children[0].children[5];
                    ETA.displays[wrapperID] = false;
                    wrapper = document.createElement('div');
                    wrapper.className = 'col-12';
                    wrapper.id = wrapperID;
                    node.parentNode.insertBefore(wrapper, node);
                    display = wrapper.appendChild(ETA.displayContainer(displayID));
                    break;
                case Skills.Magic:
                    node = document.getElementById('magic-screen-cast').children[0].children[1];
                    display = node.appendChild(ETA.displayContainer('timeLeftMagic'));
                    break;
            }
            return display ? display.firstChild : undefined;
        }

        ETA.createAllDisplays = function () {
            Woodcutting.trees.forEach((_, i) => {
                ETA.createDisplay(Skills.Woodcutting, i);
            });
            ETA.createDisplay(Skills.Woodcutting);
            Fishing.areas.forEach((_, i) => {
                ETA.createDisplay(Skills.Fishing, i);
            });
            ETA.createDisplay(Skills.Firemaking);
            for (let i = 0; i < 3; i++) {
                ETA.createDisplay(Skills.Cooking, i);
            }
            Mining.rockData.forEach((_, i) => {
                ETA.createDisplay(Skills.Mining, i);
            });
            ETA.createDisplay(Skills.Smithing);
            Thieving.npcs.forEach(npc => {
                ETA.createDisplay(Skills.Thieving, npc.id);
            });
            ETA.createDisplay(Skills.Fletching);
            ETA.createDisplay(Skills.Crafting);
            ETA.createDisplay(Skills.Runecrafting);
            ETA.createDisplay(Skills.Herblore);
            game.agility.builtObstacles.forEach(obstacle => {
                ETA.createDisplay(Skills.Agility, obstacle.category);
            });
            ETA.createDisplay(Skills.Agility);
            ETA.createDisplay(Skills.Summoning);
            Astrology.constellations.forEach((_, i) => {
                ETA.createDisplay(Skills.Astrology, i);
            });
            ETA.createDisplay(Skills.Magic);
        }

        ETA.removeAllDisplays = () => {
            for (const displayID in ETA.displays) {
                if (ETA.displays[displayID]) {
                    document.getElementById(displayID).parentNode.remove();
                } else {
                    document.getElementById(displayID).remove();
                }
            }
            ETA.displays = {};
        }

        ////////////////
        //main wrapper//
        ////////////////

        ETA.timeRemainingWrapper = function (skillID, checkTaskComplete) {
            // check if valid state
            switch (skillID) {
                case Skills.Firemaking:
                    if (game.firemaking.selectedRecipeID === -1) {
                        return;
                    }
                    break;
                case Skills.Smithing:
                    if (game.smithing.selectedRecipeID === -1) {
                        return;
                    }
                    break;
                case Skills.Fletching:
                    if (game.fletching.selectedRecipeID === -1) {
                        return;
                    }
                    break;
                case Skills.Crafting:
                    if (game.crafting.selectedRecipeID === -1) {
                        return;
                    }
                    break;
                case Skills.Runecrafting:
                    if (game.runecrafting.selectedRecipeID === -1) {
                        return;
                    }
                    break;
                case Skills.Magic:
                    if (game.altMagic.selectedSpellID === -1) {
                        return;
                    }
                    break;
                case Skills.Herblore:
                    if (game.herblore.selectedRecipeID === -1) {
                        return;
                    }
                    break;
                case Skills.Summoning:
                    if (game.summoning.selectedRecipeID === -1) {
                        return;
                    }
                    break;
            }
            // populate the main `time remaining` variables
            if (isGathering(skillID)) {
                gatheringWrapper(skillID, checkTaskComplete);
            } else {
                productionWrapper(skillID, checkTaskComplete);
            }
        }

        function gatheringWrapper(skillID, checkTaskComplete) {
            let data = [];
            // gathering skills
            switch (skillID) {
                case Skills.Mining:
                    data = Mining.rockData;
                    break;

                case Skills.Thieving:
                    data = Thieving.npcs;
                    break;

                case Skills.Woodcutting:
                    data = Woodcutting.trees;
                    break;

                case Skills.Fishing:
                    data = Fishing.areas;
                    break;

                case Skills.Agility:
                    data = [];
                    // only keep active chosen obstacles
                    for (let category = 0; category < 10; category++) {
                        const obstacle = game.agility.builtObstacles.get(category);
                        if (obstacle !== undefined) {
                            data.push(obstacle.id);
                        } else {
                            break;
                        }
                    }
                    break;
                case Skills.Astrology:
                    data = Astrology.constellations;
                    break;
            }
            if (data.length > 0) {
                if (skillID !== Skills.Agility) {
                    data.forEach((x, i) => {
                        if (skillID === Skills.Woodcutting
                            && game.woodcutting.activeTrees.size === 2
                            && game.woodcutting.activeTrees.has(Woodcutting.trees[i])) {
                            return;
                        }
                        let initial = initialVariables(skillID, checkTaskComplete);
                        if (initial.skillID === Skills.Fishing) {
                            initial.fish = game.fishing.selectedAreaFish.get(Fishing.areas[i]);
                            if (initial.fish === undefined) {
                                return;
                            }
                            initial.areaID = i;
                        }
                        initial.currentAction = i;
                        if (initial.skillID === Skills.Agility) {
                            initial.currentAction = x;
                            initial.agilityObstacles = data;
                        }
                        asyncTimeRemaining(initial);
                    });
                }
                if (skillID === Skills.Woodcutting) {
                    if (game.woodcutting.activeTrees.size === 2) {
                        // init first tree
                        let initial = initialVariables(skillID, checkTaskComplete);
                        initial.currentAction = [];
                        game.woodcutting.activeTrees.forEach(x => initial.currentAction.push(x.id));
                        initial.multiple = ETA.PARALLEL;
                        // run time remaining
                        asyncTimeRemaining(initial);
                    } else {
                        // wipe the display, there's no way of knowing which tree is being cut
                        const node = document.getElementById(`timeLeft${Skills[skillID]}`);
                        if (node) {
                            node.textContent = '';
                        }
                    }
                }
                if (skillID === Skills.Agility) {
                    // init first tree
                    let initial = initialVariables(skillID, checkTaskComplete);
                    initial.currentAction = data;
                    initial.agilityObstacles = data;
                    initial.multiple = ETA.SEQUENTIAL;
                    // run time remaining
                    asyncTimeRemaining(initial);
                }
            }
        }

        function productionWrapper(skillID, checkTaskComplete) {
            // production skills
            let initial = initialVariables(skillID, checkTaskComplete);
            if (skillID === Skills.Cooking) {
                game.cooking.selectedRecipes.forEach((recipe, i) => {
                    if (recipe === undefined) {
                        return;
                    }
                    let initial = initialVariables(skillID, checkTaskComplete);
                    initial.recipe = recipe;
                    initial.currentAction = recipe.masteryID;
                    initial.cookingCategory = i;
                    asyncTimeRemaining(initial);
                });
            }
            switch (initial.skillID) {
                case Skills.Smithing:
                    initial.currentAction = game.smithing.selectedRecipeID;
                    break;
                case Skills.Fletching:
                    initial.currentAction = game.fletching.selectedRecipeID;
                    break;
                case Skills.Runecrafting:
                    initial.currentAction = game.runecrafting.selectedRecipeID;
                    break;
                case Skills.Crafting:
                    initial.currentAction = game.crafting.selectedRecipeID;
                    break;
                case Skills.Herblore:
                    initial.currentAction = game.herblore.selectedRecipeID;
                    break;
                case Skills.Firemaking:
                    initial.currentAction = game.firemaking.selectedRecipeID;
                    break;
                case Skills.Magic:
                    initial.currentAction = game.altMagic.selectedSpellID;
                    break;
                case Skills.Summoning:
                    initial.currentAction = game.summoning.selectedRecipeID;
            }
            if (initial.currentAction === undefined) {
                return;
            }
            asyncTimeRemaining(initial);

        }

        function asyncTimeRemaining(initial) {
            setTimeout(
                function () {
                    timeRemaining(initial);
                },
                0,
            );
        }

        ////////////////////
        //internal methods//
        ////////////////////
        // Function to get unformatted number for Qty
        function getQtyOfItem(itemID) {
            if (itemID === -4) {
                return gp;
            }
            if (itemID === -5) {
                return player.slayercoins;
            }
            const bankID = getBankId(itemID);
            if (bankID === -1) {
                return 0;
            }
            return bank[bankID].qty;
        }

        // help function for time display
        function appendName(t, name, isShortClock) {
            if (t === 0) {
                return "";
            }
            if (isShortClock) {
                return t + name[0];
            }
            let result = t + " " + name;
            if (t === 1) {
                return result;
            }
            return result + "s";
        }

        // Convert milliseconds to hours/minutes/seconds and format them
        function msToHms(ms, isShortClock = ETASettings.IS_SHORT_CLOCK) {
            let seconds = Number(ms / 1000);
            // split seconds in days, hours, minutes and seconds
            let d = Math.floor(seconds / 86400)
            let h = Math.floor(seconds % 86400 / 3600);
            let m = Math.floor(seconds % 3600 / 60);
            let s = Math.floor(seconds % 60);
            // no comma in short form
            // ` and ` if hours and minutes or hours and seconds
            // `, ` if hours and minutes and seconds
            let dDisplayComma = " ";
            if (!isShortClock && d > 0) {
                let count = (h > 0) + (m > 0) + (s > 0);
                if (count === 1) {
                    dDisplayComma = " and ";
                } else if (count > 1) {
                    dDisplayComma = ", ";
                }
            }
            let hDisplayComma = " ";
            if (!isShortClock && h > 0) {
                let count = (m > 0) + (s > 0);
                if (count === 1) {
                    hDisplayComma = " and ";
                } else if (count > 1) {
                    hDisplayComma = ", ";
                }
            }
            // no comma in short form
            // ` and ` if minutes and seconds
            let mDisplayComma = " ";
            if (!isShortClock && m > 0) {
                if (s > 0) {
                    mDisplayComma = " and ";
                }
            }
            // append h/hour/hours etc depending on isShortClock, then concat and return
            return appendName(d, "day", isShortClock) + dDisplayComma
                + appendName(h, "hour", isShortClock) + hDisplayComma
                + appendName(m, "minute", isShortClock) + mDisplayComma
                + appendName(s, "second", isShortClock);
        }

        // Add seconds to date
        function addMSToDate(date, ms) {
            return new Date(date.getTime() + ms);
        }

        // Format date 24 hour clock
        function dateFormat(now, then, is12h = ETASettings.IS_12H_CLOCK) {
            let format = {weekday: "short", month: "short", day: "numeric"};
            let date = then.toLocaleString(undefined, format);
            if (date === now.toLocaleString(undefined, format)) {
                date = "";
            } else {
                date += " at ";
            }
            let hours = then.getHours();
            let minutes = then.getMinutes();
            // convert to 12h clock if required
            let amOrPm = '';
            if (is12h) {
                amOrPm = hours >= 12 ? 'pm' : 'am';
                hours = (hours % 12) || 12;
            } else {
                // only pad 24h clock hours
                hours = hours < 10 ? '0' + hours : hours;
            }
            // pad minutes
            minutes = minutes < 10 ? '0' + minutes : minutes;
            // concat and return remaining time
            return date + hours + ':' + minutes + amOrPm;
        }

        // Convert level to Xp needed to reach that level
        function convertLvlToXp(level) {
            if (level === Infinity) {
                return Infinity;
            }
            let xp = 0;
            if (level === 1) {
                return xp;
            }
            xp = ETA.lvlToXp[level] + 1;
            return xp;
        }

        // binary search for optimization
        function binarySearch(array, pred) {
            let lo = -1, hi = array.length;
            while (1 + lo < hi) {
                const mi = lo + ((hi - lo) >> 1);
                if (pred(array[mi])) {
                    hi = mi;
                } else {
                    lo = mi;
                }
            }
            return hi;
        }

        // Convert Xp value to level
        function convertXpToLvl(xp, noCap = false) {
            let level = binarySearch(ETA.lvlToXp, (t) => (xp <= t)) - 1;
            if (level < 1) {
                level = 1;
            } else if (!noCap && level > 99) {
                level = 99;
            }
            return level;
        }

        // Get Mastery Level of given Skill and Mastery ID
        function getMasteryLevel(skill, masteryID) {
            return convertXpToLvl(MASTERY[skill].xp[masteryID]);
        }

        // Progress in current level
        function getPercentageInLevel(currentXp, finalXp, type, bar = false) {
            let currentLevel = convertXpToLvl(currentXp, true);
            if (currentLevel >= 99 && (type === "mastery" || bar === true)) return 0;
            let currentLevelXp = convertLvlToXp(currentLevel);
            let nextLevelXp = convertLvlToXp(currentLevel + 1);
            let diffLevelXp = nextLevelXp - currentLevelXp;
            let currentLevelPercentage = (currentXp - currentLevelXp) / diffLevelXp * 100;
            if (bar === true) {
                let finalLevelPercentage = ((finalXp - currentXp) > (nextLevelXp - currentXp)) ? 100 - currentLevelPercentage : ((finalXp - currentXp) / diffLevelXp * 100).toFixed(4);
                return finalLevelPercentage;
            } else {
                return currentLevelPercentage;
            }
        }

        //Return the preservation for any mastery and pool
        masteryPreservation = (initial, masteryXp, poolXp) => {
            if (initial.skillID === Skills.Magic) {
                return initial.runePreservationChance;
            }
            if (!initial.hasMastery) {
                return 0;
            }
            const masteryLevel = convertXpToLvl(masteryXp);
            const itemID = initial.actions[0].itemID;
            // modifiers and base rhaelyx
            let preservationChance = initial.staticPreservation;
            // skill specific bonuses
            switch (initial.skillID) {
                case Skills.Cooking:
                    if (poolReached(initial, poolXp, 2)) {
                        preservationChance += 10;
                    }
                    break;
                case Skills.Smithing:
                    if (masteryLevel >= 99) {
                        preservationChance += 30;
                    } else if (masteryLevel >= 80) {
                        preservationChance += 20;
                    } else if (masteryLevel >= 60) {
                        preservationChance += 15;
                    } else if (masteryLevel >= 40) {
                        preservationChance += 10;
                    } else if (masteryLevel >= 20) {
                        preservationChance += 5;
                    }
                    if (poolReached(initial, poolXp, 1)) {
                        preservationChance += 5;
                    }
                    if (poolReached(initial, poolXp, 2)) {
                        preservationChance += 5;
                    }
                    if (initial.recipe.category === 7) {
                        preservationChance += player.modifiers.summoningSynergy_5_17;
                    }
                    break;
                case Skills.Fletching:
                    preservationChance += 0.2 * masteryLevel - 0.2;
                    if (masteryLevel >= 99) {
                        preservationChance += 5;
                    }
                    break;
                case Skills.Crafting:
                    preservationChance += 0.2 * masteryLevel - 0.2;
                    if (masteryLevel >= 99) {
                        preservationChance += 5;
                    }
                    if (poolReached(initial, poolXp, 1)) {
                        preservationChance += 5;
                    }
                    if (initial.recipe.category === CraftingCategory.Necklaces || initial.recipe.category === CraftingCategory.Rings) {
                        preservationChance += player.modifiers.summoningSynergy_16_17;
                    }
                    break;
                case Skills.Runecrafting:
                    if (game.runecrafting.isMakingRunes) {
                        preservationChance += player.modifiers.increasedRunecraftingEssencePreservation;
                    }
                    if (game.runecrafting.isMakingStaff) {
                        preservationChance += player.modifiers.summoningSynergy_3_10;
                    }
                    if (poolReached(initial, poolXp, 2)) {
                        preservationChance += 10;
                    }
                    break;
                case Skills.Herblore:
                    preservationChance += 0.2 * masteryLevel - 0.2;
                    if (masteryLevel >= 99) preservationChance += 5;
                    if (poolReached(initial, poolXp, 2)) {
                        preservationChance += 5;
                    }
                    break;
                case Skills.Summoning:
                    if (poolReached(initial, poolXp, 2)) {
                        preservationChance += 10;
                    }
                    break;
            }
            // rhaelyx is handled outside of this function

            // cap preservation to ub 80%
            if (preservationChance > 80) {
                preservationChance = 80;
            }
            // don't cap preservation to lb 0% at this point, still need to add charge stones
            return preservationChance;
        }

        function poolReached(initial, poolXp, idx) {
            if (initial.completionCape) {
                return true;
            }
            return poolXp >= initial.poolLim[idx];
        }

        // Adjust interval based on unlocked bonuses
        function intervalAdjustment(initial, poolXp, masteryXp, skillInterval) {
            let flatReduction = initial.flatIntervalReduction;
            let percentReduction = initial.percentIntervalReduction;
            let adjustedInterval = skillInterval;
            // compute mastery or pool dependent modifiers
            switch (initial.skillID) {
                case Skills.Woodcutting:
                    if (convertXpToLvl(masteryXp) >= 99) {
                        flatReduction += 200;
                    }
                    break;
                case Skills.Firemaking:
                    if (poolReached(initial, poolXp, 1)) {
                        percentReduction += 10;
                    }
                    percentReduction += convertXpToLvl(masteryXp) * 0.1;
                    break;
                case Skills.Mining:
                    if (poolReached(initial, poolXp, 2)) {
                        flatReduction += 200;
                    }
                    break;
                case Skills.Crafting:
                    if (poolReached(initial, poolXp, 2)) {
                        flatReduction += 200;
                    }
                    break;
                case Skills.Fletching:
                    if (poolReached(initial, poolXp, 3)) {
                        flatReduction += 200;
                    }
                    break;
                case Skills.Agility:
                    percentReduction += 3 * Math.floor(convertXpToLvl(masteryXp) / 10);
                    break;
                case Skills.Thieving:
                    if (initial.currentAction === ThievingNPCs.FISHERMAN) {
                        percentReduction -= player.modifiers.summoningSynergy_5_11;
                    }
                    if (convertXpToLvl(masteryXp) >= 50) {
                        flatReduction += 200;
                    }
                    if (poolReached(initial, poolXp, 1)) {
                        flatReduction += 200;
                    }
                    break;
                case Skills.Smithing:
                    flatReduction += player.modifiers.summoningSynergy_9_17;
                    break;
                case Skills.Cooking:
                    flatReduction += player.modifiers.summoningSynergy_9_17;
                    break;
            }
            // apply modifiers
            adjustedInterval *= 1 - percentReduction / 100;
            adjustedInterval -= flatReduction;
            adjustedInterval = Math.ceil(adjustedInterval);
            return Math.max(250, adjustedInterval);
        }

        // Adjust interval based on down time
        // This only applies to Mining, Thieving and Agility
        function intervalRespawnAdjustment(initial, currentInterval, skillXp, poolXp, masteryXp, agiLapTime) {
            let adjustedInterval = currentInterval;
            switch (initial.skillID) {
                case Skills.Mining:
                    // compute max rock HP
                    let rockHP = 5 /*base*/ + convertXpToLvl(masteryXp);
                    if (poolReached(initial, poolXp, 3)) {
                        rockHP += 10;
                    }
                    rockHP += player.modifiers.increasedMiningNodeHP - player.modifiers.decreasedMiningNodeHP;
                    // synergy 4 18
                    rockHP += player.modifiers.summoningSynergy_4_18;
                    // potions can preserve rock HP
                    let noDamageChance = player.modifiers.increasedChanceNoDamageMining - player.modifiers.decreasedChanceNoDamageMining;
                    if (noDamageChance >= 100) {
                        break;
                    }
                    rockHP /= (1 - noDamageChance / 100);
                    // compute average time per action
                    let spawnTime = Mining.rockData[initial.currentAction].baseRespawnInterval;
                    if (poolReached(initial, poolXp, 1)) {
                        spawnTime *= 0.9;
                    }
                    adjustedInterval = (adjustedInterval * rockHP + spawnTime) / rockHP;
                    break;

                case Skills.Thieving:
                    const successRate = getThievingSuccessRate(initial, currentInterval, skillXp, poolXp, masteryXp);
                    // stunTime = 3s + time of the failed action, since failure gives no xp or mxp
                    let stunTime = game.thieving.baseStunInterval + adjustedInterval;
                    // compute average time per action
                    adjustedInterval = adjustedInterval + stunTime / successRate - stunTime;
                    break;

                case Skills.Agility:
                    adjustedInterval = agiLapTime;
            }
            return Math.ceil(adjustedInterval);
        }

        function getStealthAgainstNPC(initial, npc, skillXp, poolXp, masteryXp) {
            const mastery = convertXpToLvl(masteryXp);
            const level = convertXpToLvl(skillXp)
            let stealth = level + mastery;
            if (mastery >= 99) {
                stealth += 75;
            }
            if (poolReached(initial, poolXp, 0)) {
                stealth += 30;
            }
            if (poolReached(initial, poolXp, 3)) {
                stealth += 100;
            }
            stealth += player.modifiers.increasedThievingStealth;
            stealth -= player.modifiers.decreasedThievingStealth;
            return stealth;
        }

        function getThievingSuccessRate(initial, currentInterval, skillXp, poolXp, masteryXp) {
            const npc = Thieving.npcs[initial.currentAction];
            const stealth = getStealthAgainstNPC(initial, npc, skillXp, poolXp, masteryXp);
            return Math.min(100, (100 * (100 + stealth)) / (100 + npc.perception)) / 100;
        }

        // Adjust skill Xp based on unlocked bonuses
        function skillXpAdjustment(initial, itemXp, itemID, poolXp, masteryXp) {
            let staticXpBonus = initial.staticXpBonus;
            switch (initial.skillID) {
                case Skills.Herblore:
                    if (poolReached(initial, poolXp, 1)) {
                        staticXpBonus += 0.03;
                    }
                    break;
                case Skills.Thieving:
                    if (poolReached(initial, poolXp, 0)) {
                        staticXpBonus += 0.03;
                    }
                    break;
            }
            let xpMultiplier = 1;
            switch (initial.skillID) {
                case Skills.Runecrafting:
                    if (poolReached(initial, poolXp, 1) && game.runecrafting.isMakingRunes) {
                        xpMultiplier += 1.5;
                    }
                    break;

                case Skills.Cooking: {
                    const burnChance = calcBurnChance(masteryXp);
                    const cookXp = itemXp * (1 - burnChance);
                    const burnXp = 1 * burnChance;
                    itemXp = cookXp + burnXp;
                    break;
                }

                case Skills.Fishing: {
                    const junkChance = calcJunkChance(initial, masteryXp, poolXp);
                    const fishXp = itemXp * (1 - junkChance);
                    const junkXp = 1 * junkChance;
                    itemXp = (fishXp + junkXp);
                    break;
                }

                case Skills.Summoning: {
                    if (ETASettings.USE_TABLETS) {
                        const qty = calcSummoningTabletQty(initial, poolXp, convertXpToLvl(masteryXp));
                        itemXp += qty * initial.useTabletXp;
                    }
                }
            }
            return itemXp * staticXpBonus * xpMultiplier;
        }

        // Calculate total number of unlocked items for skill based on current skill level
        ETA.msLevelMap = {};

        function calcTotalUnlockedItems(skillID, skillXp) {
            const currentSkillLevel = convertXpToLvl(skillXp);
            if (ETA.msLevelMap[skillID] === undefined) {
                ETA.msLevelMap[skillID] = MILESTONES[Skills[skillID]].map(x => x.level)
            }
            return binarySearch(ETA.msLevelMap[skillID], (t) => currentSkillLevel < t);
        }

        // compute average actions per mastery token
        function actionsPerToken(skillID, skillXp, masteryXp) {
            let actions = 20000 / calcTotalUnlockedItems(skillID, skillXp);
            if (player.equipment.slots.Amulet.item.id === Items.Clue_Chasers_Insignia) {
                actions *= ETA.insigniaModifier;
            }
            return actions;
        }

        function isGathering(skillID) {
            return [
                Skills.Woodcutting,
                Skills.Fishing,
                Skills.Mining,
                Skills.Thieving,
                Skills.Agility,
                Skills.Astrology,
            ].includes(skillID);
        }

        function initialVariables(skillID, checkTaskComplete) {
            let initial = {
                skillID: skillID,
                checkTaskComplete: checkTaskComplete,
                staticXpBonus: 1,
                flatIntervalReduction: 0,
                percentIntervalReduction: 0,
                skillReq: [], // Needed items for craft and their quantities
                itemQty: {}, // Initial amount of resources
                hasMastery: skillID !== Skills.Magic, // magic has no mastery, so we often check this
                multiple: ETA.SINGLE,
                completionCape: player.equipment.slots.Cape.item.id === Items.Cape_of_Completion,
                // gathering skills are treated differently, so we often check this
                isGathering: isGathering(skillID),
                // Generate default values for script
                // skill
                skillXp: skillXP[skillID],
                targetLevel: ETASettings.getTargetLevel(skillID, skillLevel[skillID]),
                skillLim: [], // Xp needed to reach next level
                skillLimLevel: [],
                // mastery
                masteryLim: [], // Xp needed to reach next level
                masteryLimLevel: [0],
                totalMasteryLevel: 0,
                // pool
                poolXp: 0,
                targetPool: 0,
                targetPoolXp: 0,
                poolLim: [], // Xp need to reach next pool checkpoint
                maxPoolXp: 0,
                tokens: 0,
                poolLimCheckpoints: [10, 25, 50, 95, 100, Infinity], //Breakpoints for mastery pool bonuses followed by Infinity
                // preservation
                staticPreservation: 0,
                runePreservationChance: game.altMagic.runePreservationChance,
                //////////////
                //DEPRECATED//
                //////////////
                masteryID: undefined,
                masteryXp: 0,
                skillInterval: 0,
                itemID: undefined,
                itemXp: 0,
            }
            // skill
            initial.targetXp = convertLvlToXp(initial.targetLevel);
            // Breakpoints for skill bonuses - default all levels starting at 2 to 99, followed by Infinity
            initial.skillLimLevel = Array.from({length: 98}, (_, i) => i + 2);
            initial.skillLimLevel.push(Infinity);
            // mastery
            // Breakpoints for mastery bonuses - default all levels starting at 2 to 99, followed by Infinity
            if (initial.hasMastery) {
                initial.masteryLimLevel = Array.from({length: 98}, (_, i) => i + 2);
            }
            initial.masteryLimLevel.push(Infinity);
            // static preservation
            initial.staticPreservation = player.modifiers.increasedGlobalPreservationChance;
            initial.staticPreservation -= player.modifiers.decreasedGlobalPreservationChance;
            initial.staticPreservation += getTotalFromModifierArray("increasedSkillPreservationChance", skillID);
            initial.staticPreservation -= getTotalFromModifierArray("decreasedSkillPreservationChance", skillID);
            if (player.equipment.slots.Helmet.item.id === Items.Crown_of_Rhaelyx
                && getBankQty(Items.Charge_Stone_of_Rhaelyx) > 0) {
                initial.staticPreservation -= ETA.rhaelyxChargePreservation; // Remove stone 15% chance from base
            }
            return initial;
        }

        function skillCapeEquipped(capeID) {
            return [
                capeID,
                Items.Max_Skillcape,
                Items.Cape_of_Completion,
            ].includes(player.equipment.slots.Cape.item.id);
        }

        function configureSmithing(initial) {
            initial.recipe = Smithing.recipes[initial.currentAction];
            initial.masteryID = initial.recipe.masteryID;
            initial.itemXp = initial.recipe.baseXP;
            initial.skillInterval = game.smithing.baseInterval;
            for (let i of initial.recipe.itemCosts) {
                const req = {...i};
                if (req.id === Items.Coal_Ore) {
                    if (skillCapeEquipped(Items.Smithing_Skillcape)) {
                        req.qty /= 2;
                    }
                    req.qty -= player.modifiers.summoningSynergy_17_19;
                    if (req.qty < 0) {
                        req.qty = 0;
                    }
                }
                initial.skillReq.push(req);
            }
            initial.masteryLimLevel = [20, 40, 60, 80, 99, Infinity]; // Smithing Mastery Limits
            return initial;
        }

        function configureFletching(initial) {
            initial.recipe = Fletching.recipes[initial.currentAction];
            initial.itemID = initial.recipe.itemID;
            initial.itemXp = initial.recipe.baseXP;
            initial.skillInterval = game.fletching.baseInterval;
            let costs = initial.recipe.itemCosts;
            if (initial.recipe.alternativeCosts !== undefined) {
                costs = initial.recipe.alternativeCosts[game.fletching.selectedAltRecipe].itemCosts;
            }
            for (let i of costs) {
                initial.skillReq.push(i);
            }
            return initial;
        }

        function configureRunecrafting(initial) {
            initial.recipe = Runecrafting.recipes[initial.currentAction];
            initial.itemID = initial.recipe.itemID;
            initial.itemXp = initial.recipe.baseXP;
            initial.skillInterval = game.runecrafting.baseInterval;
            for (let i of initial.recipe.itemCosts) {
                initial.skillReq.push(i);
            }
            initial.masteryLimLevel = [99, Infinity]; // Runecrafting has no Mastery bonus
            return initial;
        }

        function configureCrafting(initial) {
            initial.recipe = Crafting.recipes[initial.currentAction];
            initial.itemID = initial.recipe.itemID;
            initial.itemXp = initial.recipe.baseXP;
            initial.skillInterval = game.crafting.baseInterval;
            for (let i of initial.recipe.itemCosts) {
                let qty = i.qty;
                if (initial.recipe.category === CraftingCategory.Dragonhide) {
                    qty -= player.modifiers.summoningSynergy_9_16;
                }
                initial.skillReq.push({
                    ...i,
                    qty: Math.max(1, qty),
                });
            }

            return initial;
        }

        function configureHerblore(initial) {
            initial.recipe = Herblore.potions[initial.currentAction];
            initial.itemXp = initial.recipe.baseXP;
            initial.masteryID = initial.recipe.masteryID;
            initial.skillInterval = game.herblore.baseInterval;
            for (let i of initial.recipe.itemCosts) {
                initial.skillReq.push(i);
            }
            return initial;
        }

        function configureCooking(initial) {
            initial.itemID = initial.recipe.id;
            initial.masteryID = initial.recipe.masteryID;
            initial.itemXp = initial.recipe.baseXP;
            initial.skillInterval = initial.recipe.baseInterval;
            initial.skillReq = initial.recipe.itemCosts;
            initial.masteryLimLevel = [99, Infinity]; //Cooking has no Mastery bonus
            return initial;
        }

        function configureFiremaking(initial) {
            initial.recipe = Firemaking.recipes[initial.currentAction];
            initial.itemXp = initial.recipe.baseXP * (1 + initial.recipe.bonfireXPBonus / 100);
            initial.masteryID = initial.recipe.masteryID;
            initial.skillInterval = initial.recipe.baseInterval;
            initial.skillReq = [{id: initial.recipe.logID, qty: 1}];
            return initial;
        }

        function configureSummoning(initial) {
            initial.recipe = Summoning.marks[initial.currentAction];
            initial.altRecipeID = game.summoning.setAltRecipes.get(initial.recipe);
            initial.itemID = initial.recipe.itemID;
            initial.itemXp = initial.recipe.baseXP;
            initial.useTabletXp = Summoning.getTabletConsumptionXP(initial.currentAction, true);
            initial.skillInterval = game.summoning.baseInterval;
            // costs can change with increasing pool / mastery
            initial.skillReq = calcSummoningRecipeQty(initial, 0, 1);
            // add xp of owned tablets to initial xp
            if (ETASettings.USE_TABLETS) {
                const qty = getQtyOfItem(initial.itemID);
                initial.skillXp += qty * initial.useTabletXp;
                initial.targetSkillReached = initial.skillXp >= initial.targetXp;
            }
            initial.chanceToDouble = game.summoning.actionDoublingChance;
            return initial;
        }

        function configureMagic(initial) {
            initial.skillInterval = game.altMagic.baseInterval;
            initial.recipe = AltMagic.spells[initial.currentAction];
            initial.selectedConversionItem = game.altMagic.selectedConversionItem;
            initial.selectedSmithingRecipe = game.altMagic.selectedSmithingRecipe;
            //Find need runes for spell
            game.altMagic.getCurrentRecipeRuneCosts()._items.forEach((qty, itemID) => {
                if (itemID > -1) {
                    initial.skillReq.push({id: itemID, qty: qty});
                }
            });
            // Get Rune discount
            let capeMultiplier = 1;
            if (skillCapeEquipped(Items.Magic_Skillcape)) {
                // Add cape multiplier
                capeMultiplier = 2;
            }
            for (let i = 0; i < initial.skillReq.length; i++) {
                const weapon = player.equipment.slots.Weapon.item;
                if (weapon.providesRune !== undefined && weapon.providesRune.includes(initial.skillReq[i].id)) {
                    initial.skillReq[i].qty -= weapon.providesRuneQty * capeMultiplier;
                }
            }
            initial.skillReq = initial.skillReq.filter(item => item.qty > 0); // Remove all runes with 0 cost
            //Other items
            game.altMagic.getCurrentRecipeCosts()._items.forEach((qty, itemID) => {
                if (itemID > -1) {
                    initial.skillReq.push({id: itemID, qty: qty});
                }
            });
            //
            initial.masteryLimLevel = [Infinity]; //AltMagic has no Mastery bonus
            initial.itemXp = initial.recipe.baseExperience;
            return initial;
        }

        function configureGathering(initial) {
            initial.skillReq = [];
            initial.masteryID = initial.currentAction;
            return initial;
        }

        function configureMining(initial) {
            initial.itemID = Mining.rockData[initial.currentAction].oreID;
            initial.itemXp = Mining.rockData[initial.currentAction].baseExperience;
            initial.skillInterval = game.mining.baseInterval;
            return configureGathering(initial);
        }

        function configureThieving(initial) {
            initial.itemID = undefined;
            initial.itemXp = Thieving.npcs[initial.currentAction].xp;
            initial.skillInterval = game.thieving.baseInterval;
            return configureGathering(initial);
        }

        function configureWoodcutting(initial) {
            const wcAction = x => {
                return {
                    itemID: Woodcutting.trees[x].logID,
                    itemXp: Woodcutting.trees[x].baseExperience,
                    skillInterval: Woodcutting.trees[x].baseInterval,
                    masteryID: Woodcutting.trees[x].id,
                };
            }
            if (!isNaN(initial.currentAction)) {
                initial.actions = [wcAction(initial.currentAction)];
            } else {
                initial.actions = initial.currentAction.map(x => wcAction(x));
            }
            return configureGathering(initial);
        }

        function configureFishing(initial) {
            initial.itemID = initial.fish.itemID;
            initial.itemXp = initial.fish.baseXP;
            // base avg interval
            let avgRoll = 0.5;
            const max = initial.fish.baseMaxInterval;
            const min = initial.fish.baseMinInterval;
            initial.skillInterval = Math.floor(avgRoll * (max - min)) + min;
            initial.currentAction = initial.fish.masteryID;
            initial = configureGathering(initial);
            return initial
        }

        function configureAgility(initial) {
            const agiAction = x => {
                return {
                    itemXp: Agility.obstacles[x].completionBonuses.xp,
                    skillInterval: Agility.obstacles[x].interval,
                    masteryID: x,
                };
            }
            if (!isNaN(initial.currentAction)) {
                initial.actions = [agiAction(initial.currentAction)];
            } else {
                initial.actions = initial.currentAction.map(x => agiAction(x));
            }
            return configureGathering(initial);
        }

        function configureAstrology(initial) {
            initial.itemID = undefined;
            initial.itemXp = Astrology.constellations[initial.currentAction].provides.xp;
            initial.skillInterval = Astrology.baseInterval;
            return configureGathering(initial);
        }

        function calcShardReduction(initial, poolXp, masteryLevel) {
            let shardReduction = 0;
            // mastery shard reduction
            if (masteryLevel >= 50) {
                shardReduction++;
            }
            if (masteryLevel >= 99) {
                shardReduction++;
            }
            // pool shard reduction
            if (poolReached(initial, poolXp, 1) && initial.recipe.tier <= 2) {
                shardReduction++;
            } else if (poolReached(initial, poolXp, 3) && initial.recipe.tier === 3) {
                shardReduction++;
            }
            // modifier shard reduction
            shardReduction += player.modifiers.decreasedSummoningShardCost - player.modifiers.increasedSummoningShardCost;
            return shardReduction;
        }

        function calcSummoningRecipeQtyMap(initial, poolXp, masteryLevel) {
            const map = {};
            calcSummoningRecipeQty(initial, poolXp, masteryLevel).forEach(x => map[x.id] = x.qty);
            return map;
        }

        function calcSummoningRecipeQty(initial, poolXp, masteryLevel) {
            // shard costs
            const shardReduction = calcShardReduction(initial, poolXp, masteryLevel);
            const recipe = initial.recipe.itemCosts.map(x => {
                return {
                    id: x.id,
                    qty: Math.max(1, x.qty - shardReduction),
                }
            });

            // cost multiplier
            let nonShardCostReduction = 0;
            // Non-Shard Cost reduction that scales with mastery level
            nonShardCostReduction += Math.floor(masteryLevel / 10) * 5;
            // Level 99 Mastery: +5% Non Shard Cost Reduction
            if (masteryLevel >= 99) {
                nonShardCostReduction += 5;
            }
            const costMultiplier = 1 - nonShardCostReduction / 100;

            // currency cost
            if (initial.recipe.gpCost > 0) {
                recipe.push({
                    id: -4,
                    qty: Math.max(initial.recipe.gpCost * costMultiplier),
                });
            }
            if (initial.recipe.scCost > 0) {
                recipe.push({
                    id: -5,
                    qty: Math.max(initial.recipe.scCost * costMultiplier),
                });
            }

            // non-shard item cost
            if (initial.recipe.nonShardItemCosts.length > 0) {
                const itemID = initial.recipe.nonShardItemCosts[initial.altRecipeID ?? 0];
                const itemCost = Math.max(20, items[itemID].sellsFor);
                recipe.push({
                    id: itemID,
                    qty: Math.max(1, Math.floor(Summoning.recipeGPCost * costMultiplier / itemCost)),
                });
            }

            // return all costs
            return recipe;
        }

        function calcSummoningTabletQty(initial, poolXp, masteryLevel) {
            let qty = 25;
            if (poolReached(initial, poolXp, 3)) {
                qty += 10;
            }
            if (masteryLevel >= 99) {
                qty += 10;
            }
            return qty * (1 + initial.chanceToDouble / 100);
        }

        // Calculate mastery xp based on unlocked bonuses
        function calcMasteryXpToAdd(initial, totalMasteryLevel, skillXp, masteryXp, poolXp, timePerAction, masteryID) {
            const modifiedTimePerAction = getTimePerActionModifierMastery(initial.skillID, timePerAction, masteryID);
            let xpModifier = initial.staticMXpBonus;
            // General Mastery Xp formula
            let xpToAdd = ((calcTotalUnlockedItems(initial.skillID, skillXp) * totalMasteryLevel) / getTotalMasteryLevelForSkill(initial.skillID) + convertXpToLvl(masteryXp) * (getTotalItemsInSkill(initial.skillID) / 10)) * (modifiedTimePerAction / 1000) / 2;
            // Skill specific mastery pool modifier
            if (poolReached(initial, poolXp, 0)) {
                xpModifier += 0.05;
            }
            // Firemaking pool and log modifiers
            if (initial.skillID === Skills.Firemaking) {
                // If current skill is Firemaking, we need to apply mastery progression from actions and use updated poolXp values
                if (poolReached(initial, poolXp, 3)) {
                    xpModifier += 0.05;
                }
                for (let i = 0; i < MASTERY[Skills.Firemaking].xp.length; i++) {
                    // The logs you are not burning
                    if (initial.actions[0].masteryID !== i) {
                        if (getMasteryLevel(Skills.Firemaking, i) >= 99) {
                            xpModifier += 0.0025;
                        }
                    }
                }
                // The log you are burning
                if (convertXpToLvl(masteryXp) >= 99) {
                    xpModifier += 0.0025;
                }
            } else {
                // For all other skills, you use the game function to grab your FM mastery progression
                if (getMasteryPoolProgress(Skills.Firemaking) >= masteryCheckpoints[3]) {
                    xpModifier += 0.05;
                }
                for (let i = 0; i < MASTERY[Skills.Firemaking].xp.length; i++) {
                    if (getMasteryLevel(Skills.Firemaking, i) >= 99) {
                        xpModifier += 0.0025;
                    }
                }
            }
            // Combine base and modifiers
            xpToAdd *= xpModifier;
            // minimum 1 mastery xp per action
            if (xpToAdd < 1) {
                xpToAdd = 1;
            }
            // BurnChance affects average mastery Xp
            if (initial.skillID === Skills.Cooking) {
                let burnChance = calcBurnChance(masteryXp);
                xpToAdd *= (1 - burnChance);
            }
            // Fishing junk gives no mastery xp
            if (initial.skillID === Skills.Fishing) {
                let junkChance = calcJunkChance(initial, masteryXp, poolXp);
                xpToAdd *= (1 - junkChance);
            }
            // return average mastery xp per action
            return xpToAdd;
        }

        // Calculate pool Xp based on mastery Xp
        function calcPoolXpToAdd(skillXp, masteryXp) {
            if (convertXpToLvl(skillXp) >= 99) {
                return masteryXp / 2;
            } else {
                return masteryXp / 4;
            }
        }

        // Calculate burn chance based on mastery level
        function calcBurnChance(masteryXp) {
            // primary burn chance
            let primaryBurnChance = 30;
            primaryBurnChance += player.modifiers.summoningSynergy_4_9;
            primaryBurnChance -= player.modifiers.increasedChanceSuccessfulCook;
            primaryBurnChance += player.modifiers.decreasedChanceSuccessfulCook;
            primaryBurnChance -= (convertXpToLvl(masteryXp) - 1) * 0.6;
            if (primaryBurnChance < 0) {
                primaryBurnChance = 0;
            }
            // total burn chance
            return primaryBurnChance / 100;
        }

        // calculate junk chance
        function calcJunkChance(initial, masteryXp, poolXp) {
            // base
            let junkChance = Fishing.areas[initial.areaID].junkChance;
            // mastery turns 3% junk in 3% special
            let masteryLevel = convertXpToLvl(masteryXp);
            if (masteryLevel >= 50) {
                junkChance -= 3;
            }
            // no junk if mastery level > 65 or pool > 25%
            if (masteryLevel >= 65
                || junkChance < 0
                || poolReached(initial, poolXp, 1)) {
                junkChance = 0;
            }
            return junkChance / 100;
        }

        function perAction(masteryXp, targetMasteryXp) {
            return {
                // mastery
                masteryXp: masteryXp,
                targetMasteryReached: masteryXp >= targetMasteryXp,
                targetMasteryTime: 0,
                targetMasteryResources: {},
                // estimated number of actions taken so far
                actions: 0,
            }
        }

        function currentVariables(initial) {
            let current = {
                actionCount: 0,
                activeTotalTime: 0,
                sumTotalTime: 0,
                // skill
                skillXp: initial.skillXp,
                targetSkillReached: initial.skillXp >= initial.targetXp,
                targetSkillTime: 0,
                targetSkillResources: {},
                // pool
                poolXp: initial.poolXp,
                targetPoolReached: initial.poolXp >= initial.targetPoolXp,
                targetPoolTime: 0,
                targetPoolResources: {},
                totalMasteryLevel: initial.totalMasteryLevel,
                // items
                chargeUses: 0, // estimated remaining charge uses
                tokens: initial.tokens,
                // stats per action
                actions: initial.actions.map(x => perAction(x.masteryXp, x.targetMasteryXp)),
                // available resources
                itemQty: {...initial.itemQty},
                skillReqMap: {...initial.skillReqMap},
                used: {},
            };
            for (let id in current.itemQty) {
                current.used[id] = 0;
            }
            // Check for Crown of Rhaelyx
            if (player.equipment.slots.Helmet.item.id === Items.Crown_of_Rhaelyx && initial.hasMastery && !initial.isGathering) {
                let rhaelyxCharge = getQtyOfItem(Items.Charge_Stone_of_Rhaelyx);
                current.chargeUses = rhaelyxCharge * 1000; // average crafts per Rhaelyx Charge Stone
            }
            return current;
        }

        function gainPerAction(initial, current, averageActionTime) {
            return current.actions.map((x, i) => {
                const gain = {
                    xpPerAction: skillXpAdjustment(initial, initial.actions[i].itemXp, initial.actions[i].itemID, current.poolXp, x.masteryXp),
                    masteryXpPerAction: 0,
                    poolXpPerAction: 0,
                    tokensPerAction: 0,
                    tokenXpPerAction: 0,
                };

                if (initial.hasMastery) {
                    gain.masteryXpPerAction = calcMasteryXpToAdd(initial, current.totalMasteryLevel, current.skillXp, x.masteryXp, current.poolXp, averageActionTime[i], initial.actions[i].masteryID);
                    gain.poolXpPerAction = calcPoolXpToAdd(current.skillXp, gain.masteryXpPerAction);
                    gain.tokensPerAction = 1 / actionsPerToken(initial.skillID, current.skillXp, x.masteryXp);
                    gain.tokenXpPerAction = initial.maxPoolXp / 1000 * gain.tokensPerAction;
                }
                return gain;
            });
        }

        // Actions until limit
        function getLim(lims, xp, max) {
            const lim = lims.find(element => element > xp);
            if (xp < max && max < lim) {
                return Math.ceil(max);
            }
            return Math.ceil(lim);
        }

        function actionsToBreakpoint(initial, current, noResources = false) {
            // Adjustments
            const currentIntervals = current.actions.map((x, i) => intervalAdjustment(initial, current.poolXp, x.masteryXp, initial.actions[i].skillInterval));
            if (initial.skillID === Skills.Agility) {
                current.agiLapTime = currentIntervals.reduce((a, b) => a + b, 0);
            }
            const averageActionTimes = current.actions.map((x, i) => intervalRespawnAdjustment(initial, currentIntervals[i], current.skillXp, current.poolXp, x.masteryXp, current.agiLapTime));
            // Current Xp
            let gains = gainPerAction(initial, current, currentIntervals);
            current.gains = gains;

            // average gains
            const avgXpPerS = gains.map((x, i) => x.xpPerAction / averageActionTimes[i] * 1000).reduce((a, b) => a + b, 0);
            let avgPoolPerS = gains.map((x, i) => x.poolXpPerAction / averageActionTimes[i] * 1000).reduce((a, b) => a + b, 0);
            const masteryPerS = gains.map((x, i) => x.masteryXpPerAction / averageActionTimes[i] * 1000);
            const avgTokenXpPerS = gains.map((x, i) => x.tokenXpPerAction / averageActionTimes[i] * 1000).reduce((a, b) => a + b, 0);
            const avgTokensPerS = gains.map((x, i) => x.tokensPerAction / averageActionTimes[i] * 1000).reduce((a, b) => a + b, 0);
            // TODO rescale sequential gains ?

            // get time to next breakpoint
            // skill
            const skillXpToLimit = getLim(initial.skillLim, current.skillXp, initial.targetXp) - current.skillXp;
            const skillXpSeconds = skillXpToLimit / avgXpPerS;
            // mastery
            let masteryXpSeconds = Infinity;
            const allMasteryXpSeconds = [];
            if (initial.hasMastery) {
                initial.actions.forEach((x, i) => {
                    const masteryXpToLimit = getLim(initial.skillLim, current.actions[i].masteryXp, x.targetMasteryXp) - current.actions[i].masteryXp;
                    allMasteryXpSeconds.push(masteryXpToLimit / masteryPerS[i]);
                });
                masteryXpSeconds = Math.min(...allMasteryXpSeconds);
            }
            // pool
            let poolXpSeconds = Infinity;
            if (initial.hasMastery) {
                const poolXpToLimit = getLim(initial.poolLim, current.poolXp, initial.targetPoolXp) - current.poolXp;
                poolXpSeconds = poolXpToLimit / avgPoolPerS;
            }
            // resources
            let resourceSeconds = Infinity;
            const rawPreservation = masteryPreservation(initial, current.actions[0].masteryXp, current.poolXp) / 100;
            const totalChanceToUse = Math.min(1, 1 - rawPreservation);
            const totalChanceToUseWithCharges = Math.min(1, Math.max(0.2, 1 - rawPreservation - ETA.rhaelyxChargePreservation / 100));
            // update summoning costs
            if (initial.skillID === Skills.Summoning) {
                const masteryLevel = convertXpToLvl(current.actions[0].masteryXp);
                current.skillReqMap = calcSummoningRecipeQtyMap(initial, current.poolXp, masteryLevel);
            }
            // estimate actions remaining with current resources
            if (!noResources) {
                if (initial.actions.length > 1) {
                    ETA.log('Attempting to simulate multiple different production actions at once, this is not implemented!')
                }
                // estimate amount of actions possible with remaining resources
                // number of actions with rhaelyx charges
                const actionsWithCharge = Math.min(
                    current.chargeUses,
                    ...Object.getOwnPropertyNames(current.itemQty).map(id =>
                        current.itemQty[id] / current.skillReqMap[id] / totalChanceToUseWithCharges
                    ),
                );
                // remaining resources
                const resWithoutCharge = Math.max(
                    0,
                    Math.min(...Object.getOwnPropertyNames(current.itemQty).map(id =>
                        current.itemQty[id] / current.skillReqMap[id] - current.chargeUses * totalChanceToUseWithCharges
                    )),
                );
                const actionsWithoutCharge = resWithoutCharge / totalChanceToUse
                // add number of actions without rhaelyx charges
                const resourceActions = Math.ceil(actionsWithCharge + actionsWithoutCharge);
                resourceSeconds = resourceActions * averageActionTimes[0] / 1000;
            }

            // Minimum actions based on limits
            const rawExpectedS = Math.min(skillXpSeconds, masteryXpSeconds, poolXpSeconds, resourceSeconds);
            const expectedMS = Math.ceil(1000 * rawExpectedS);
            const expectedS = expectedMS / 1000;
            const expectedActions = averageActionTimes.map(x => expectedMS / x);
            // estimate total remaining actions
            if (!noResources) {
                current.actionCount += expectedActions[0];
            }

            // add token xp to pool xp if desired
            if (ETASettings.USE_TOKENS) {
                avgPoolPerS += avgTokenXpPerS;
            }

            // Take away resources based on expectedActions
            if (!initial.isGathering) {
                // Update remaining Rhaelyx Charge uses
                current.chargeUses -= expectedActions[0];
                if (current.chargeUses < 0) {
                    current.chargeUses = 0;
                }
                // Update remaining resources
                let resUsed;
                if (expectedActions[0] < current.chargeUses) {
                    // won't run out of charges yet
                    resUsed = expectedActions[0] * totalChanceToUseWithCharges;
                } else {
                    // first use charges
                    resUsed = current.chargeUses * totalChanceToUseWithCharges;
                    // remaining actions are without charges
                    resUsed += (expectedActions[0] - current.chargeUses) * totalChanceToUse;
                }
                for (let id in current.itemQty) {
                    const qty = Math.ceil(resUsed * current.skillReqMap[id]);
                    current.itemQty[id] -= qty;
                    current.used[id] += qty;
                }
            }

            // time for current iteration
            // gain tokens, unless we're using them
            if (!ETASettings.USE_TOKENS) {
                current.tokens += avgTokensPerS * expectedS;
            }
            // Update time and Xp
            switch (initial.multiple) {
                // active total time is number of actions * action time, number of actions is time spent / (action time + "respawn")
                case ETA.SINGLE:
                    current.activeTotalTime += expectedMS / averageActionTimes[0] * currentIntervals[0];
                    break;

                case ETA.PARALLEL:
                case ETA.SEQUENTIAL:
                    current.activeTotalTime += expectedMS
                        / averageActionTimes.reduce((a, b) => (a + b), 0)
                        * currentIntervals.reduce((a, b) => (a + b), 0);
                    break;
            }
            current.sumTotalTime += expectedMS;
            current.skillXp += avgXpPerS * expectedS;
            current.actions.forEach((x, i) => current.actions[i].masteryXp += gains[i].masteryXpPerAction * expectedActions[i]);
            current.poolXp += avgPoolPerS * expectedS;
            // Time for target skill level, 99 mastery, and 100% pool
            if (!current.targetSkillReached && initial.targetXp <= current.skillXp) {
                current.targetSkillTime = current.sumTotalTime;
                current.targetSkillReached = true;
                current.targetSkillResources = {...current.used};
            }
            current.actions.forEach((x, i) => {
                if (!x.targetMasteryReached && initial.actions[i].targetMasteryXp <= x.masteryXp) {
                    x.targetMasteryTime = current.sumTotalTime;
                    x.targetMasteryReached = true;
                    x.targetMasteryResources = {...current.used};
                }
            });
            if (!current.targetPoolReached && initial.targetPoolXp <= current.poolXp) {
                current.targetPoolTime = current.sumTotalTime;
                current.targetPoolReached = true;
                current.targetPoolResources = {...current.used};
            }
            // Update total mastery level
            current.totalMasteryLevel = initial.totalMasteryLevel;
            initial.actions.forEach((x, i) => {
                const y = current.actions[i];
                const masteryLevel = convertXpToLvl(y.masteryXp);
                if (x.masteryLevel !== masteryLevel) {
                    // increase total mastery
                    current.totalMasteryLevel += masteryLevel - x.masteryLevel;
                    if (masteryLevel === 99 && x.lastMasteryLevel !== 99) {
                        halveAgilityMasteryDebuffs(initial, initial.actions[i].masteryID);
                    }
                    x.lastMasteryLevel = masteryLevel;
                }
            });
            // return updated values
            return current;
        }

        function halveAgilityMasteryDebuffs(initial, id) {
            if (initial.skillID !== Skills.Agility) {
                return;
            }
            // check if we need to halve one of the debuffs
            const m = Agility.obstacles[id].modifiers;
            // xp
            initial.staticXpBonus += getBuff(m, 'decreasedGlobalSkillXP', 'decreasedSkillXP') / 100 / 2;
            // mxp
            initial.staticMXpBonus += getBuff(m, 'decreasedGlobalMasteryXP', 'decreasedMasteryXP') / 100 / 2;
            // interval
            initial.percentIntervalReduction += getBuff(m, 'increasedSkillIntervalPercent') / 2;
            initial.flatIntervalReduction += getBuff(m, 'increasedSkillInterval') / 2;
        }

        function getBuff(modifier, global, specific) {
            let change = 0;
            if (global && modifier[global]) {
                change += modifier[global];
            }
            if (specific && modifier[specific]) {
                modifier[specific].forEach(x => {
                    if (x[0] === Skills.Agility) {
                        change += x[1];
                    }
                });
            }
            return change;
        }

        function currentXpRates(initial) {
            let rates = {
                xpH: 0,
                masteryXpH: 0,
                poolH: 0,
                tokensH: 0,
                actionTime: 0,
                actionsH: 0,
            };
            initial.actions.forEach((x, i) => {
                const initialInterval = intervalAdjustment(initial, initial.poolXp, x.masteryXp, x.skillInterval);
                const initialAverageActionTime = intervalRespawnAdjustment(initial, initialInterval, initial.skillXp, initial.poolXp, x.masteryXp, initial.agiLapTime);
                rates.xpH += skillXpAdjustment(initial, x.itemXp, x.itemID, initial.poolXp, x.masteryXp) / initialAverageActionTime * 1000 * 3600;
                if (initial.hasMastery) {
                    // compute current mastery xp / h using the getMasteryXpToAdd from the game or the method from this script
                    // const masteryXpPerAction = getMasteryXpToAdd(initial.skillID, initial.masteryID, initialInterval);
                    const masteryXpPerAction = calcMasteryXpToAdd(initial, initial.totalMasteryLevel, initial.skillXp, x.masteryXp, initial.poolXp, initialInterval, x.masteryID);
                    const masteryXpH = masteryXpPerAction / initialAverageActionTime * 1000 * 3600
                    rates.masteryXpH += masteryXpH;
                    // pool percentage per hour
                    rates.poolH += calcPoolXpToAdd(initial.skillXp, masteryXpH) / initial.maxPoolXp;
                    rates.tokensH += 3600 * 1000 / initialAverageActionTime / actionsPerToken(initial.skillID, initial.skillXp, x.masteryXp);
                }
                rates.actionTime += initialInterval;
                rates.actionsH += 3600 * 1000 / initialAverageActionTime;
            });
            if (initial.multiple === ETA.PARALLEL) {
                rates.actionTime /= initial.actions.length;
            }
            if (initial.multiple === ETA.SEQUENTIAL) {
                rates.actionsH /= initial.actions.length;
            }
            // each token contributes one thousandth of the pool and then convert to percentage
            rates.poolH = (rates.poolH + rates.tokensH / 1000) * 100;
            return rates;
        }

        function resourcesLeft(itemQty, reqMap) {
            for (let id in itemQty) {
                if (itemQty[id] < reqMap[id]) {
                    return false;
                }
            }
            return true;
        }

        function getXpRates(initial, current) {
            // compute exp rates, either current or average until resources run out
            let rates = {};
            if (ETASettings.CURRENT_RATES || initial.isGathering || !resourcesLeft(initial.itemQty, initial.skillReqMap)) {
                // compute current rates
                rates = currentXpRates(initial);
            } else {
                // compute average rates until resources run out
                rates.xpH = (current.skillXp - initial.skillXp) * 3600 * 1000 / current.sumTotalTime;
                rates.masteryXpH = initial.actions.map((x, i) => (current.actions[i].masteryXp - x.masteryXp) * 3600 * 1000 / current.sumTotalTime);
                // average pool percentage per hour
                rates.poolH = (current.poolXp - initial.poolXp) * 3600 * 1000 / current.sumTotalTime / initial.maxPoolXp;
                rates.tokensH = (current.tokens - initial.tokens) * 3600 * 1000 / current.sumTotalTime;
                rates.actionTime = current.activeTotalTime / current.actionCount;
                rates.actionsH = 3600 * 1000 / current.sumTotalTime * current.actionCount;
                // each token contributes one thousandth of the pool and then convert to percentage
                rates.poolH = (rates.poolH + rates.tokensH / 1000) * 100;
            }
            return rates;
        }

        // Calculates expected time, taking into account Mastery Level advancements during the craft
        function calcExpectedTime(initial) {
            // initialize the expected time variables
            let current = currentVariables(initial);

            // loop until out of resources
            let sumTotalTime = current.sumTotalTime;
            while (!initial.isGathering && resourcesLeft(current.itemQty, current.skillReqMap)) {
                current = actionsToBreakpoint(initial, current, false);
                if (sumTotalTime === current.sumTotalTime || isNaN(current.sumTotalTime) || !isFinite(current.sumTotalTime)) {
                    ETA.log(sumTotalTime)
                    ETA.log(JSON.parse(JSON.stringify(initial)));
                    ETA.log(JSON.parse(JSON.stringify(current)));
                    break;
                }
                sumTotalTime = current.sumTotalTime;
            }

            // method to convert final pool xp to percentage
            const poolCap = ETASettings.UNCAP_POOL ? Infinity : 100
            const poolXpToPercentage = poolXp => Math.min((poolXp / initial.maxPoolXp) * 100, poolCap).toFixed(2);
            // create result object
            let expectedTime = {
                timeLeft: Math.round(current.sumTotalTime),
                actionCount: Math.floor(current.actionCount),
                finalSkillXp: current.skillXp,
                finalMasteryXp: current.actions.map(x => x.masteryXp),
                finalPoolXp: current.poolXp,
                finalPoolPercentage: poolXpToPercentage(current.poolXp),
                targetPoolTime: current.targetPoolTime,
                targetMasteryTime: current.actions.map(x => x.targetMasteryTime),
                targetSkillTime: current.targetSkillTime,
                rates: getXpRates(initial, current),
                tokens: current.tokens,
            };
            // continue calculations until time to all targets is found
            while (!current.targetSkillReached || (initial.hasMastery && (!current.actions.map(x => x.targetMasteryReached).reduce((a, b) => a && b, true) || !current.targetPoolReached))) {
                current = actionsToBreakpoint(initial, current, true);
                if (sumTotalTime === current.sumTotalTime || isNaN(current.sumTotalTime) || !isFinite(current.sumTotalTime)) {
                    ETA.log(JSON.parse(JSON.stringify(initial)));
                    ETA.log(JSON.parse(JSON.stringify(current)));
                    break;
                }
                sumTotalTime = current.sumTotalTime;
            }
            // if it is a gathering skill, then set final values to the values when reaching the final target
            if (initial.isGathering) {
                expectedTime.finalSkillXp = current.skillXp;
                expectedTime.finalMasteryXp = current.actions.map(x => x.masteryXp);
                expectedTime.finalPoolXp = current.poolXp;
                expectedTime.finalPoolPercentage = poolXpToPercentage(current.poolXp);
                expectedTime.tokens = current.tokens;
            }
            // set time to targets
            expectedTime.targetSkillTime = current.targetSkillTime;
            expectedTime.targetMasteryTime = current.actions.map(x => x.targetMasteryTime);
            expectedTime.targetPoolTime = current.targetPoolTime;
            // return the resulting data object
            expectedTime.current = current;
            return expectedTime;
        }

        function setupTimeRemaining(initial) {
            // Set current skill and pull matching variables from game with script
            switch (initial.skillID) {
                case Skills.Smithing:
                    initial = configureSmithing(initial);
                    break;
                case Skills.Fletching:
                    initial = configureFletching(initial);
                    break;
                case Skills.Runecrafting:
                    initial = configureRunecrafting(initial);
                    break;
                case Skills.Crafting:
                    initial = configureCrafting(initial);
                    break;
                case Skills.Herblore:
                    initial = configureHerblore(initial);
                    break;
                case Skills.Cooking:
                    initial = configureCooking(initial);
                    break;
                case Skills.Firemaking:
                    initial = configureFiremaking(initial);
                    break;
                case Skills.Magic:
                    initial = configureMagic(initial);
                    break;
                case Skills.Mining:
                    initial = configureMining(initial);
                    break;
                case Skills.Thieving:
                    initial = configureThieving(initial);
                    break;
                case Skills.Woodcutting:
                    initial = configureWoodcutting(initial);
                    break;
                case Skills.Fishing:
                    initial = configureFishing(initial);
                    break;
                case Skills.Agility:
                    initial = configureAgility(initial);
                    break;
                case Skills.Summoning:
                    initial = configureSummoning(initial);
                    break;
                case Skills.Astrology:
                    initial = configureAstrology(initial);
                    break;
            }
            // configure interval reductions
            initial.percentIntervalReduction += getTotalFromModifierArray("decreasedSkillIntervalPercent", initial.skillID);
            initial.percentIntervalReduction -= getTotalFromModifierArray("increasedSkillIntervalPercent", initial.skillID);
            initial.flatIntervalReduction += getTotalFromModifierArray("decreasedSkillInterval", initial.skillID);
            initial.flatIntervalReduction -= getTotalFromModifierArray("increasedSkillInterval", initial.skillID);
            if (initial.skillID === Skills.Agility) {
                // set initial lap time
                initial.agiLapTime = 0;
                if (initial.skillID === Skills.Agility) {
                    const poolXp = MASTERY[initial.skillID].pool;
                    initial.agilityObstacles.forEach(x => {
                        const masteryXp = MASTERY[initial.skillID].xp[x];
                        const interval = Agility.obstacles[x].interval;
                        initial.agiLapTime += intervalAdjustment(initial, poolXp, masteryXp, interval);
                    });
                }
            }
            // Configure initial mastery values for all skills with masteries
            if (initial.hasMastery) {
                // mastery
                initial.totalMasteryLevel = getCurrentTotalMasteryLevelForSkill(initial.skillID);
                // pool
                initial.poolXp = MASTERY[initial.skillID].pool;
                initial.maxPoolXp = getMasteryPoolTotalXP(initial.skillID);
                initial.targetPool = ETASettings.getTargetPool(initial.skillID, 100 * initial.poolXp / initial.maxPoolXp);
                initial.targetPoolXp = initial.maxPoolXp;
                if (initial.targetPool !== 100) {
                    initial.targetPoolXp = initial.maxPoolXp / 100 * initial.targetPool;
                }
                initial.tokens = getQtyOfItem(Items["Mastery_Token_" + Skills[initial.skillID]])
            }

            // convert single action skills to `actions` format
            // TODO: put it in this format straight away and remove the duplication
            if (initial.actions === undefined) {
                initial.actions = [{
                    itemID: initial.itemID,
                    itemXp: initial.itemXp,
                    skillInterval: initial.skillInterval,
                    masteryID: initial.masteryID, // this might still be undefined at this point
                }];
            }

            // further configure the `actions`
            initial.actions.forEach(x => {
                if (initial.hasMastery) {
                    if (!initial.isGathering) {
                        x.masteryID = initial.masteryID ?? items[x.itemID].masteryID[1];
                    }
                    x.masteryXp = MASTERY[initial.skillID].xp[x.masteryID];
                    x.masteryLevel = convertXpToLvl(x.masteryXp);
                    x.lastMasteryLevel = x.masteryLevel;
                    x.targetMastery = ETASettings.getTargetMastery(initial.skillID, convertXpToLvl(x.masteryXp));
                    x.targetMasteryXp = convertLvlToXp(x.targetMastery);
                }
            });

            // Get itemXp Bonuses from gear and pets
            initial.staticXpBonus = getStaticXPBonuses(initial.skillID);
            initial.staticMXpBonus = getStaticMXPBonuses(initial.skillID);

            // Populate masteryLim from masteryLimLevel
            for (let i = 0; i < initial.masteryLimLevel.length; i++) {
                initial.masteryLim[i] = convertLvlToXp(initial.masteryLimLevel[i]);
            }
            // Populate skillLim from skillLimLevel
            for (let i = 0; i < initial.skillLimLevel.length; i++) {
                initial.skillLim[i] = convertLvlToXp(initial.skillLimLevel[i]);
            }
            // Populate poolLim from masteryCheckpoints
            for (let i = 0; i < initial.poolLimCheckpoints.length; i++) {
                initial.poolLim[i] = initial.maxPoolXp * initial.poolLimCheckpoints[i] / 100;
            }

            // Get Item Requirements and Current Requirements
            initial.skillReqMap = {};
            for (let i = 0; i < initial.skillReq.length; i++) {
                let itemQty = getQtyOfItem(initial.skillReq[i].id);
                initial.itemQty[initial.skillReq[i].id] = itemQty;
                initial.skillReqMap[initial.skillReq[i].id] = initial.skillReq[i].qty;
            }
            return initial;
        }

        function getStaticXPBonuses(skill) {
            let xpMultiplier = 1;
            xpMultiplier += getTotalFromModifierArray("increasedSkillXP", skill) / 100;
            xpMultiplier -= getTotalFromModifierArray("decreasedSkillXP", skill) / 100;
            xpMultiplier += (player.modifiers.increasedGlobalSkillXP - player.modifiers.decreasedGlobalSkillXP) / 100;
            if (skill === Skills.Magic) {
                xpMultiplier += (player.modifiers.increasedAltMagicSkillXP - player.modifiers.decreasedAltMagicSkillXP) / 100;
            }
            // TODO: does not match the test-v0.21?980 implementation
            if (skill === Skills.Firemaking
                && player.modifiers.summoningSynergy_18_19
                && herbloreBonuses[8].bonus[0] === 0
                && herbloreBonuses[8].bonus[1] > 0) {
                xpMultiplier += 5 / 100;
            }
            return xpMultiplier;
        }

        function getStaticMXPBonuses(skill) {
            let xpMultiplier = 1;
            xpMultiplier += getTotalFromModifierArray("increasedMasteryXP", skill) / 100;
            xpMultiplier -= getTotalFromModifierArray("decreasedMasteryXP", skill) / 100;
            xpMultiplier += (player.modifiers.increasedGlobalMasteryXP - player.modifiers.decreasedGlobalMasteryXP) / 100;
            return xpMultiplier;
        }

        // Main function
        function timeRemaining(initial) {
            initial = setupTimeRemaining(initial);
            //Time left
            const results = calcExpectedTime(initial);
            const ms = {
                resources: Math.round(results.timeLeft),
                skill: Math.round(results.targetSkillTime),
                mastery: Math.round(results.targetMasteryTime),
                pool: Math.round(results.targetPoolTime),
            };
            //Inject timeLeft HTML
            const now = new Date();
            const timeLeftElement = injectHTML(initial, results, ms.resources, now);
            if (timeLeftElement !== null) {
                generateTooltips(initial, ms, results, timeLeftElement, now, {noMastery: initial.actions.length > 1});
            }
            if (initial.actions.length > 1) {
                const actions = [...initial.actions];
                const currentActions = [...initial.currentAction];
                actions.forEach((a, i) => {
                    initial.actions = [a];
                    initial.currentAction = currentActions[i];
                    const singleTimeLeftElement = injectHTML(initial, {rates: currentXpRates(initial)}, ms.resources, now, false);
                    if (singleTimeLeftElement !== null) {
                        const aux = {
                            finalMasteryXp: [results.finalMasteryXp[i]],
                            current: {actions: [{targetMasteryResources: {}}]},
                        }
                        generateTooltips(initial, {mastery: results.current.actions[i].targetMasteryTime}, aux, singleTimeLeftElement, now, {
                            noSkill: true,
                            noPool: true
                        });
                    }
                });
                //reset
                initial.actions = actions;
                initial.currentAction = currentActions;
            }

            // TODO fix this for woodcutting and agility
            if (initial.actions.length === 1) {
                // Set global variables to track completion
                let times = [];
                if (!initial.isGathering) {
                    times.push(ETA.time(ETASettings.DING_RESOURCES, 0, -ms.resources, "Processing finished."));
                }
                times.push(ETA.time(ETASettings.DING_LEVEL, initial.targetLevel, convertXpToLvl(initial.skillXp), "Target level reached."));
                if (initial.hasMastery) {
                    initial.actions.forEach((x, i) =>
                        times.push(ETA.time(ETASettings.DING_MASTERY, x.targetMastery, convertXpToLvl(x.masteryXp), "Target mastery reached."))
                    );
                    times.push(ETA.time(ETASettings.DING_POOL, initial.targetPool, 100 * initial.poolXp / initial.maxPoolXp, "Target pool reached."));
                }
                ETA.setTimeLeft(initial, times);
                if (initial.checkTaskComplete) {
                    ETA.taskComplete();
                }
                if (!initial.isGathering) {
                    generateProgressBars(initial, results, 0 /*TODO add proper action index here, usually it's 0 though*/);
                }
            }
        }

        function injectHTML(initial, results, msLeft, now) {
            let index = undefined;
            if (initial.actions.length === 1) {
                if (initial.skillID === Skills.Fishing) {
                    index = initial.areaID;
                } else if (initial.skillID === Skills.Agility) {
                    index = Agility.obstacles[initial.currentAction].category;
                } else if (initial.isGathering) {
                    index = initial.currentAction;
                } else if (initial.cookingCategory !== undefined) {
                    index = initial.cookingCategory;
                }
            }
            const timeLeftElement = ETA.createDisplay(initial.skillID, index);
            let finishedTime = addMSToDate(now, msLeft);
            timeLeftElement.textContent = "";
            if (ETASettings.SHOW_XP_RATE) {
                timeLeftElement.textContent = "Xp/h: " + formatNumber(Math.floor(results.rates.xpH));
                if (initial.hasMastery) {
                    timeLeftElement.textContent += "\r\nMXp/h: " + formatNumber(Math.floor(results.rates.masteryXpH))
                        + `\r\nPool/h: ${results.rates.poolH.toFixed(2)}%`
                }
            }
            if (ETASettings.SHOW_ACTION_TIME) {
                timeLeftElement.textContent += "\r\nAction time: " + formatNumber(Math.ceil(results.rates.actionTime) / 1000) + 's';
                timeLeftElement.textContent += "\r\nActions/h: " + formatNumber(Math.round(100 * results.rates.actionsH) / 100);
            }
            if (!initial.isGathering) {
                if (msLeft === 0) {
                    timeLeftElement.textContent += "\r\nNo resources!";
                } else {
                    timeLeftElement.textContent += "\r\nActions: " + formatNumber(results.actionCount)
                        + "\r\nTime: " + msToHms(msLeft)
                        + "\r\nETA: " + dateFormat(now, finishedTime);
                }
            }
            if (initial.actions.length === 1 && (initial.isGathering || initial.skillID === Skills.Cooking)) {
                const itemID = initial.actions[0].itemID;
                if (itemID !== undefined) {
                    const youHaveElementId = timeLeftElement.id + "-YouHave";
                    const perfectID = items[itemID].perfectItem;
                    const youHaveElement = document.getElementById(youHaveElementId);
                    while (youHaveElement.lastChild) {
                        youHaveElement.removeChild(youHaveElement.lastChild);
                    }
                    const span = document.createElement('span');
                    span.textContent = `You have: ${formatNumber(getQtyOfItem(itemID))}`;
                    youHaveElement.appendChild(span);
                    const img = document.createElement('img');
                    img.classList = 'skill-icon-xs mr-2';
                    img.src = items[itemID].media;
                    youHaveElement.appendChild(img);
                    if (perfectID !== undefined) {
                        const perfectSpan = document.createElement('span');
                        perfectSpan.textContent = `You have: ${formatNumber(getQtyOfItem(perfectID))}`;
                        youHaveElement.appendChild(perfectSpan);
                        const perfectImg = document.createElement('img');
                        perfectImg.classList = 'skill-icon-xs mr-2';
                        perfectImg.src = items[perfectID].media;
                        youHaveElement.appendChild(perfectImg);
                    }
                }
            }
            timeLeftElement.style.display = "block";
            if (timeLeftElement.textContent.length === 0) {
                timeLeftElement.textContent = "Melvor ETA";
            }
            return timeLeftElement;
        }

        function generateTooltips(initial, ms, results, timeLeftElement, now, flags = {}) {
            // Generate progression Tooltips
            if (!timeLeftElement._tippy) {
                tippy(timeLeftElement, {
                    allowHTML: true,
                    interactive: false,
                    animation: false,
                });
            }
            let tooltip = '';
            // level tooltip
            if (!flags.noSkill) {
                const finalLevel = convertXpToLvl(results.finalSkillXp, true)
                const levelProgress = getPercentageInLevel(results.finalSkillXp, results.finalSkillXp, "skill");
                tooltip += finalLevelElement(
                    'Final Level',
                    formatLevel(finalLevel, levelProgress) + ' / 99',
                    'success',
                ) + tooltipSection(initial, now, ms.skill, initial.targetLevel, results.current.targetSkillResources);
            }
            // mastery tooltip
            if (!flags.noMastery && initial.hasMastery) {
                // don't show mastery target when combining multiple actions
                const finalMastery = convertXpToLvl(results.finalMasteryXp[0]);
                const masteryProgress = getPercentageInLevel(results.finalMasteryXp[0], results.finalMasteryXp[0], "mastery");
                tooltip += finalLevelElement(
                    'Final Mastery',
                    formatLevel(finalMastery, masteryProgress) + ' / 99',
                    'info',
                ) + tooltipSection(initial, now, ms.mastery, initial.actions[0].targetMastery, results.current.actions[0].targetMasteryResources);
            }
            // pool tooltip
            if (!flags.noPool && initial.hasMastery) {
                tooltip += finalLevelElement(
                    'Final Pool XP',
                    results.finalPoolPercentage + '%',
                    'warning',
                )
                let prepend = ''
                const tokens = Math.round(results.tokens);
                if (tokens > 0) {
                    prepend += `Final token count: ${tokens}`;
                    if (ms.pool > 0) {
                        prepend += '<br>';
                    }
                }
                tooltip += tooltipSection(initial, now, ms.pool, `${initial.targetPool}%`, results.current.targetPoolResources, prepend);
            }
            // wrap and return
            timeLeftElement._tippy.setContent(`<div>${tooltip}</div>`);
        }

        function tooltipSection(initial, now, ms, target, resources, prepend = '') {
            // final level and time to target level
            if (ms > 0) {
                return wrapTimeLeft(
                    prepend + timeLeftToHTML(
                        initial,
                        target,
                        msToHms(ms),
                        dateFormat(now, addMSToDate(now, ms)),
                        resources,
                    ),
                );
            } else if (prepend !== '') {
                return wrapTimeLeft(
                    prepend,
                );
            }
            return '';
        }

        function finalLevelElement(finalName, finalTarget, label) {
            return ''
                + '<div class="row no-gutters">'
                + '  <div class="col-6" style="white-space: nowrap;">'
                + '    <h3 class="font-size-base m-1" style="color:white;" >'
                + `      <span class="p-1" style="text-align:center; display: inline-block;line-height: normal;color:white;">`
                + finalName
                + '      </span>'
                + '    </h3>'
                + '  </div>'
                + '  <div class="col-6" style="white-space: nowrap;">'
                + '    <h3 class="font-size-base m-1" style="color:white;" >'
                + `      <span class="p-1 bg-${label} rounded" style="text-align:center; display: inline-block;line-height: normal;width: 100px;color:white;">`
                + finalTarget
                + '      </span>'
                + '    </h3>'
                + '  </div>'
                + '</div>';
        }

        const timeLeftToHTML = (initial, target, time, finish, resources) => `Time to ${target}: ${time}<br>ETA: ${finish}` + resourcesLeftToHTML(initial, resources);

        const resourcesLeftToHTML = (initial, resources) => {
            if (ETASettings.HIDE_REQUIRED || initial.isGathering || resources === 0) {
                return '';
            }
            let req = Object.getOwnPropertyNames(resources).map(id => {
                    let src;
                    if (id === "-5") {
                        src = "assets/media/main/slayer_coins.svg"
                    }
                    if (id === "-4") {
                        src = "assets/media/main/coins.svg"
                    }
                    if (items[id] !== undefined) {
                        src = items[id].media;
                    }
                    return `<span>${formatNumber(resources[id])}</span><img class="skill-icon-xs mr-2" src="${src}">`
                }
            ).join('');
            return `<br/>Requires: ${req}`;
        }

        const wrapTimeLeft = (s) => {
            return ''
                + '<div class="row no-gutters">'
                + '	<span class="col-12 m-1" style="padding:0.5rem 1.25rem;min-height:2.5rem;font-size:0.875rem;line-height:1.25rem;text-align:center">'
                + s
                + '	</span>'
                + '</div>';
        }

        const formatLevel = (level, progress) => {
            if (!ETASettings.SHOW_PARTIAL_LEVELS) {
                return level;
            }
            progress = Math.floor(progress);
            if (progress !== 0) {
                level = (level + progress / 100).toFixed(2);
            }
            return level;
        }

        function generateProgressBars(initial, results, idx) {
            // skill
            const skillProgress = getPercentageInLevel(initial.skillXp, results.finalSkillXp, "skill", true);
            $(`#skill-progress-bar-end-${initial.skillID}`).css("width", skillProgress + "%");
            // mastery
            if (initial.hasMastery) {
                const masteryProgress = getPercentageInLevel(initial.actions[idx].masteryXp, results.finalMasteryXp[idx], "mastery", true);
                $(`#${initial.skillID}-mastery-pool-progress-end`).css("width", masteryProgress + "%");
                // pool
                const poolProgress = (results.finalPoolPercentage > 100) ?
                    100 - ((initial.poolXp / initial.maxPoolXp) * 100) :
                    (results.finalPoolPercentage - ((initial.poolXp / initial.maxPoolXp) * 100)).toFixed(4);
                $(`#mastery-pool-progress-end-${initial.skillID}`).css("width", poolProgress + "%");
            }
        }
    }

    function loadETA() {
        // Loading script
        ETA.log('loading...');

        // constants
        ETA.SINGLE = 0;
        ETA.PARALLEL = 1;
        ETA.SEQUENTIAL = 2;

        // data
        ETA.insigniaModifier = 1 - items[Items.Clue_Chasers_Insignia].increasedItemChance / 100;
        // rhaelyx goes from 10% to 25% with charge stones
        ETA.rhaelyxChargePreservation = conditionalModifiers.get(Items.Crown_of_Rhaelyx)[0].modifiers.increasedGlobalPreservationChance;

        // lvlToXp cache
        ETA.lvlToXp = Array.from({length: 200}, (_, i) => exp.level_to_xp(i));

        ETA.updateSkillWindowRef = updateSkillWindow;
        updateSkillWindow = function (skill) {
            try {
                ETA.timeRemainingWrapper(skill, false);
            } catch (e) {
                ETA.error(e);
            }
            ETA.updateSkillWindowRef(skill);
        };

        // update tick-based skills
        ETA.startActionTimer = (skillName, propName) => {
            if (game.loopStarted) {
                // call ETA if game loop is active, in particular do not call ETA when catching up
                try {
                    ETA.timeRemainingWrapper(Skills[skillName], false);
                } catch (e) {
                    ETA.error(e);
                }
            }
            // mimic Craftingskill.startActionTimer
            game[propName].actionTimer.start(game[propName].actionInterval);
            game[propName].renderQueue.progressBar = true;
        }

        ETA.selectRecipeOnClick = (skillName, propName, recipeID) => {
            if (recipeID !== game[propName].selectedRecipeID && game[propName].isActive && !game[propName].stop())
                return;
            game[propName].selectedRecipeID = recipeID;
            game[propName].renderQueue.selectedRecipe = true;
            game[propName].render();
            try {
                ETA.timeRemainingWrapper(Skills[skillName], false);
            } catch (e) {
                ETA.error(e);
            }
        }

        ETA.selectLog = (skillName, propName, recipeID) => {
            const recipeToSelect = Firemaking.recipes[recipeID];
            if (recipeToSelect.level > game[propName].level) {
                notifyPlayer(game[propName].id, getLangString('TOASTS', 'LEVEL_REQUIRED_TO_BURN'), 'danger');
            } else {
                if (game[propName].selectedRecipeID !== recipeID && game[propName].isActive && !game[propName].stop())
                    return;
                game[propName].selectedRecipeID = recipeID;
                game[propName].renderQueue.selectedLog = true;
                game[propName].renderQueue.logQty = true;
                try {
                    ETA.timeRemainingWrapper(Skills[skillName], false);
                } catch (e) {
                    ETA.error(e);
                }
            }
        }

        ETA.selectSpellOnClick = (skillName, propName, spellID) => {
            if (game[propName].selectedSpellID !== spellID) {
                if (game[propName].isActive && !game[propName].stop())
                    return;
                game[propName].selectedConversionItem = -1;
            }
            game[propName].selectedSpellID = spellID;
            game[propName].renderQueue.selectedSpellImage = true;
            game[propName].renderQueue.selectedSpellInfo = true;
            hideElement(altMagicItemMenu);
            showElement(altMagicMenu);
            game[propName].render();
            try {
                ETA.timeRemainingWrapper(Skills[skillName], false);
            } catch (e) {
                ETA.error(e);
            }
        }

        ETA.selectItemOnClick = (skillName, propName, itemID) => {
            if (game.isGolbinRaid)
                return;
            game[propName].selectedConversionItem = itemID;
            game[propName].renderQueue.selectedSpellInfo = true;
            hideElement(altMagicItemMenu);
            showElement(altMagicMenu);
            game[propName].render();
            altMagicMenu.setSpellImage(game[propName]);
            try {
                ETA.timeRemainingWrapper(Skills[skillName], false);
            } catch (e) {
                ETA.error(e);
            }
        }

        ETA.selectBarOnClick = (skillName, propName, recipe) => {
            if (game.isGolbinRaid)
                return;
            game[propName].selectedSmithingRecipe = recipe;
            game[propName].renderQueue.selectedSpellInfo = true;
            hideElement(altMagicItemMenu);
            showElement(altMagicMenu);
            game[propName].render();
            altMagicMenu.setSpellImage(game[propName]);
            try {
                ETA.timeRemainingWrapper(Skills[skillName], false);
            } catch (e) {
                ETA.error(e);
            }
        }

        ETA.onRecipeSelectionClick = (skillName, propName, recipe) => {
            const category = recipe.category;
            const existingRecipe = game[propName].selectedRecipes.get(category);
            if (game[propName].isActive) {
                if (category === game[propName].activeCookingCategory && recipe !== game[propName].activeRecipe && !game[propName].stop())
                    return;
                else if (game[propName].passiveCookTimers.has(category) && recipe !== existingRecipe && !game[propName].stopPassiveCooking(category))
                    return;
            }
            game[propName].selectedRecipes.set(category, recipe);
            game[propName].renderQueue.selectedRecipes.add(category);
            game[propName].renderQueue.recipeRates = true;
            game[propName].renderQueue.quantities = true;
            game[propName].render();
            try {
                ETA.timeRemainingWrapper(Skills[skillName], false);
            } catch (e) {
                ETA.error(e);
            }
        }

        ETA.selectAltRecipeOnClick = (skillName, propName, altID) => {
            if (altID !== game[propName].selectedAltRecipe && game[propName].isActive && !game[propName].stop())
                return;
            game[propName].setAltRecipes.set(game[propName].selectedRecipe, altID);
            game[propName].renderQueue.selectedRecipe = true;
            game[propName].render();
            try {
                ETA.timeRemainingWrapper(Skills[skillName], false);
            } catch (e) {
                ETA.error(e);
            }
        }

        ETA.onAreaFishSelection = (skillName, propName, area, fish) => {
            const previousSelection = game[propName].selectedAreaFish.get(area);
            if (area === game[propName].activeFishingArea && previousSelection !== fish && game[propName].isActive && !game[propName].stop())
                return;
            game[propName].selectedAreaFish.set(area, fish);
            game[propName].renderQueue.selectedAreaFish = true;
            game[propName].renderQueue.selectedAreaFishRates = true;
            game[propName].renderQueue.areaChances = true;
            game[propName].renderQueue.actionMastery.add(fish.masteryID);
            game[propName].render();
            try {
                ETA.timeRemainingWrapper(Skills[skillName], false);
            } catch (e) {
                ETA.error(e);
            }
        }

        // gathering, only override startActionTimer
        game.woodcutting.startActionTimer = () => ETA.startActionTimer('Woodcutting', 'woodcutting');
        game.fishing.startActionTimer = () => ETA.startActionTimer('Fishing', 'fishing');
        game.fishing.onAreaFishSelection = (area, fish) => ETA.onAreaFishSelection('Fishing', 'fishing', area, fish);
        game.mining.startActionTimer = () => {
            if (!game.mining.selectedRockActiveData.isRespawning) {
                ETA.startActionTimer('Mining', 'mining');
            }
        }
        game.thieving.startActionTimer = () => {
            if (!game.thieving.isStunned) {
                ETA.startActionTimer('Thieving', 'thieving');
            }
        }
        game.agility.startActionTimer = () => ETA.startActionTimer('Agility', 'agility');
        game.astrology.startActionTimer = () => ETA.startActionTimer('Astrology', 'astrology');

        // production, override startActionTimer and selectXOnClick
        game.firemaking.startActionTimer = () => ETA.startActionTimer('Firemaking', 'firemaking');
        game.firemaking.selectLog = (recipeID) => ETA.selectLog('Firemaking', 'firemaking', recipeID);
        game.cooking.startActionTimer = () => ETA.startActionTimer('Cooking', 'cooking');
        game.cooking.onRecipeSelectionClick = (recipe) => ETA.onRecipeSelectionClick('Cooking', 'cooking', recipe);
        game.smithing.startActionTimer = () => ETA.startActionTimer('Smithing', 'smithing');
        game.smithing.selectRecipeOnClick = (recipeID) => ETA.selectRecipeOnClick('Smithing', 'smithing', recipeID);
        game.fletching.startActionTimer = () => ETA.startActionTimer('Fletching', 'fletching');
        game.fletching.selectRecipeOnClick = (recipeID) => ETA.selectRecipeOnClick('Fletching', 'fletching', recipeID);
        game.fletching.selectAltRecipeOnClick = (altID) => ETA.selectAltRecipeOnClick('Fletching', 'fletching', altID);
        game.crafting.startActionTimer = () => ETA.startActionTimer('Crafting', 'crafting');
        game.crafting.selectRecipeOnClick = (recipeID) => ETA.selectRecipeOnClick('Crafting', 'crafting', recipeID);
        game.runecrafting.startActionTimer = () => ETA.startActionTimer('Runecrafting', 'runecrafting');
        game.runecrafting.selectRecipeOnClick = (recipeID) => ETA.selectRecipeOnClick('Runecrafting', 'runecrafting', recipeID);
        game.herblore.startActionTimer = () => ETA.startActionTimer('Herblore', 'herblore');
        game.herblore.selectRecipeOnClick = (recipeID) => ETA.selectRecipeOnClick('Herblore', 'herblore', recipeID);
        game.summoning.startActionTimer = () => ETA.startActionTimer('Summoning', 'summoning');
        game.summoning.selectRecipeOnClick = (recipeID) => ETA.selectRecipeOnClick('Summoning', 'summoning', recipeID);
        game.summoning.selectAltRecipeOnClick = (altID) => ETA.selectAltRecipeOnClick('Summoning', 'summoning', altID);
        game.altMagic.startActionTimer = () => ETA.startActionTimer('Magic', 'altMagic');
        game.altMagic.selectSpellOnClick = (recipeID) => ETA.selectSpellOnClick('Magic', 'altMagic', recipeID);
        game.altMagic.selectItemOnClick = (recipeID) => ETA.selectItemOnClick('Magic', 'altMagic', recipeID);
        game.altMagic.selectBarOnClick = (recipeID) => ETA.selectBarOnClick('Magic', 'altMagic', recipeID);

        // Create timeLeft containers
        ETA.createAllDisplays();

        // Mastery Pool progress
        for (let id in SKILLS) {
            if (SKILLS[id].hasMastery) {
                let bar = $(`#mastery-pool-progress-${id}`)[0];
                $(bar).after(`<div id="mastery-pool-progress-end-${id}" class="progress-bar bg-warning" role="progressbar" style="width: 0%; background-color: #e5ae679c !important;"></div>`);
            }
        }

        // Mastery Progress bars
        for (let id in SKILLS) {
            if (SKILLS[id].hasMastery) {
                let name = Skills[id].toLowerCase();
                let bar = $(`#${name}-mastery-progress`)[0];
                $(bar).after(`<div id="${id}-mastery-pool-progress-end" class="progress-bar bg-info" role="progressbar" style="width: 0%; background-color: #5cace59c !important;"></div>`);
            }
        }

        // Mastery Skill progress
        for (let id in SKILLS) {
            if (SKILLS[id].hasMastery) {
                let bar = $(`#skill-progress-bar-${id}`)[0];
                $(bar).after(`<div id="skill-progress-bar-end-${id}" class="progress-bar bg-info" role="progressbar" style="width: 0%; background-color: #5cace59c !important;"></div>`);
            }
        }
        //
        ETA.log('loaded!');
        setTimeout(ETA.createSettingsMenu, 50);

        // regularly save settings to local storage
        setInterval(window.ETASettings.save, 1000)
    }

    function loadScript() {
        if (typeof isLoaded !== typeof undefined) {
            startETASettings();
        }
        if (typeof isLoaded !== typeof undefined && isLoaded) {
            // Only load script after game has opened
            clearInterval(scriptLoader);
            startETA();
        }
    }

    const scriptLoader = setInterval(loadScript, 200);
});