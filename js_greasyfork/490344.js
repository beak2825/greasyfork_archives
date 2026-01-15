// ==UserScript==
// @name         Beans
// @namespace    http://tampermonkey.net/
// @version      0.9.12
// @description  eat it!
// @author       You
// @match        https://*.the-west.ru.com/game.php
// @match        https://www.the-west.ru.com/*
// @match        https://*.beta.the-west.net/*
// @match        https://*.the-west.*/index.php?page=logout
// @icon         https://westru.innogamescdn.com/images/items/yield/baked_beans.png
// @grant        none
// @license MIT 
// @downloadURL https://update.greasyfork.org/scripts/490344/Beans.user.js
// @updateURL https://update.greasyfork.org/scripts/490344/Beans.meta.js
// ==/UserScript==

(function () {
    const SCRIPT_VERSION = '0.9.12';

    (function AutoFortRegistration() {
        const DEFENCE_SIDE = 0;
        const ATTACK_SIDE = 1;
        const SMALL_FORT_TYPE = 0;

        const COORDINATES = {
            adventurer: [
                178, 179, 180,
                212, 213, 214,
                246, 247, 248
            ],
            duelist: [
                193, 194, 195,
                227, 228, 229,
                261, 262, 263
            ],
            soldier: [
                450, 451, 452,
                484, 485, 486,
                518, 519, 520
            ],
            worker: [
                465, 466, 467,
                499, 500, 501,
                533, 534, 535
            ],
            walls: [
                215, 216, 217, 218, 219, 220, 221, 222, 223, 224, 225, 226, // top wall
                487, 488, 489, 490, 491, 492, 493, 494, 495, 496, 497, 498, // bottom wall
                281, 315, 349, 383, 417, // left wall
                296, 330, 364, 398, 432  // right wall
            ],
            tankPositions: [
                178, 212, 246, // adventurer tower
                195, 229, 263, // duelist tower
                450, 484, 518, // soldier tower
                467, 501, 535  // worker tower
            ]
        }

        const ATTACK_COORDINATES = {
            corners: [
                0, 782, 815, 33
            ],
            cornersGroup: [
                // top-left
                0, 1, 2,
                34, 35, 36,
                68, 69, 70,

                // bottom-left
                714, 715, 716,
                748, 749, 750,
                782, 783, 784,

                // bottom-right
                745, 746, 747,
                779, 780, 781,
                813, 814, 815,

                // top-right
                31, 32, 33,
                65, 66, 67,
                99, 100, 101,
            ],
        };

        async function init(preferAttack) {
            // own array to store joined forts in this session
            Character.joinedForts = Character.joinedForts || [];
            const activeForts = await getActiveForts();

            const notJoinedForts = activeForts.filter(fortId => !Character.joinedForts.includes(fortId));
            console.log('AutoFortRegistration: notJoinedForts', notJoinedForts);

            for (let i = 0; i < notJoinedForts.length; i++) {
                await GameMap.AjaxAsync.wait(2000);

                const fortId = notJoinedForts[i].id;
                const fortType = await getFortType(notJoinedForts[i].x, notJoinedForts[i].y);
                const canRegister = fortType === SMALL_FORT_TYPE && await canRegisterOnFort(fortId);
                console.log('AutoFortRegistration: fortId', fortId, 'fortType', fortType, 'canRegister', canRegister);

                if (canRegister) {
                    const isAttack = (preferAttack && !canRegister.mustDefend) || canRegister.mustAttack;
                    console.log('AutoFortRegistration: registering on fort', fortId);
                    const isRegistrationSuccess = await registerOnFort(fortId, isAttack);

                    if (isRegistrationSuccess) {
                        console.log('AutoFortRegistration: Registration Successful!');
                        Character.joinedForts.push(fortId);
                        await GameMap.AjaxAsync.wait(2000);
                        await findAndSetPosition(fortId, isAttack);
                    }
                }
            }
        }

        async function findAndSetPosition(fortId, isAttack) {
            const occupiedPositions = await getOccupiedPositions(fortId);

            const positions = isAttack ? getAttackPositions(occupiedPositions) : await getDefencePositions(occupiedPositions);
            const randomPosition = getRandomArrayItem(positions);
            await setPosition(fortId, randomPosition);
        }

        function getAttackPositions(occupiedPositions) {
            const cornersPositions = ATTACK_COORDINATES.corners.filter(position => !occupiedPositions.includes(position));
            console.log('AutoFortRegistration: cornersPositions', cornersPositions);
            if (cornersPositions.length > 0) {
                return cornersPositions;
            }

            const cornersGroupPositions = ATTACK_COORDINATES.cornersGroup.filter(position => !occupiedPositions.includes(position));
            console.log('AutoFortRegistration: cornersGroupPositions', cornersGroupPositions);
            if (cornersGroupPositions.length > 0) {
                return cornersGroupPositions;
            }

            return [];
        }

        async function getDefencePositions(occupiedPositions) {
            // try to set position on the tower of your class
            const classTowerPositions = (await getPositionsByRole(COORDINATES[Character.charClass]))
                .filter(pos => !occupiedPositions.includes(pos));
            console.log('AutoFortRegistration: classTowerPositions', classTowerPositions);
            if (classTowerPositions.length > 0) {
                return classTowerPositions;
            }

            // if all positions on your class tower are occupied, try to set position on any tower
            const allTowers = [].concat(
                COORDINATES['adventurer'],
                COORDINATES['duelist'],
                COORDINATES['soldier'],
                COORDINATES['worker']
            );
            const towersPositions = (await getPositionsByRole(allTowers))
                .filter(pos => !occupiedPositions.includes(pos));
            console.log('AutoFortRegistration: towersPositions', towersPositions);
            if (towersPositions.length > 0) {
                return towersPositions;
            }

            // if all tower positions are occupied, try to set position on walls
            const wallPositions = (await getPositionsByRole(COORDINATES['walls']))
                .filter(pos => !occupiedPositions.includes(pos));
            console.log('AutoFortRegistration: wallPositions', wallPositions);
            if (wallPositions.length > 0) {
                return wallPositions;
            }

            // if all walls and towers are occupied, fuck it, set position on any spot
            return await getPositionsByRole([...allTowers, ...COORDINATES['walls']]);
        }

        async function setPosition(fortId, position) {
            const data = {
                command: 'set_pos',
                fort_id: fortId,
                selfpos: position,
                selftarget: position
            };
            await GameMap.AjaxAsync.remoteCall('fort_battlepage', 'updatechars', data);
        }

        async function getOccupiedPositions(fortId) {
            const resp = await GameMap.AjaxAsync.remoteCallMode('fort_battlepage', 'index', { fort_id: fortId });

            return resp.playerlist.filter(player => player.name !== Character.name).map(player => player.idx);
        }

        async function getFortType(x, y) {
            const resp = await GameMap.AjaxAsync.remoteCallMode('fort', 'display', { x, y });

            return resp.data.type;
        }

        async function registerOnFort(fortId, isAttack) {
            const side = isAttack ? ATTACK_SIDE : DEFENCE_SIDE;
            const resp = await GameMap.AjaxAsync.remoteCall('fort_battlepage', 'joinBattle', { fort_id: fortId, side: side });

            return !!resp.success;
        }

        async function canRegisterOnFort(fortId) {
            const resp = await GameMap.AjaxAsync.remoteCallMode('fort_battlepage', 'index', { fort_id: fortId });

            // mustAttack or mustDefend be true means you have only one option
            const { couldJoin, joined, mustAttack, mustDefend } = resp;
            if (joined === true) return false; // already joined
            return couldJoin ? ({ mustAttack, mustDefend }) : false;
        }

        async function getActiveForts() {
            const resp = await GameMap.AjaxAsync.remoteCall('fort_overview', '', {
                offset: 0,
            });

            if (resp.js) {
                return resp.js
                    .filter(data => data[3] === true) // is under attack
                    .map(data => ({
                        id: data[0],
                        x: data[1],
                        y: data[2],
                        underAttack: data[3],
                        attacker: data[4],
                        attackerTown: data[5],
                    }));
            } else {
                return [];
            }
        }

        function getRandomArrayItem(arr) {
            return arr[Math.floor(Math.random() * arr.length)];
        }

        async function getPositionsByRole(positions) {
            const canTank = await isTank();
            const excludedPositions = !canTank ? COORDINATES['tankPositions'] : [];
            return positions.filter(position => !excludedPositions.includes(position));
        }

        // if it has skill 'health' more than half of all skills
        async function isTank() {
            const cachedSkills = sessionStorage.getItem('CharacterSkills');
            if (cachedSkills) {
                CharacterSkills.usedSkills = JSON.parse(cachedSkills).usedSkills;
                CharacterSkills.usedAttributes = JSON.parse(cachedSkills).usedAttributes;
            }
            if (CharacterSkills.usedSkills === 0 || CharacterSkills.usedAttributes === 0) {
                const resp = await GameMap.AjaxAsync.remoteCallMode('skill', 'overview', {});
                CharacterSkills.usedSkills = resp.usedSkills;
                CharacterSkills.usedAttributes = resp.usedAttributes;
                sessionStorage.setItem('CharacterSkills', JSON.stringify({
                    usedSkills: CharacterSkills.usedSkills,
                    usedAttributes: CharacterSkills.usedAttributes
                }));
            }
            return CharacterSkills.getSkill("health").points - CharacterSkills.usedAttributes > CharacterSkills.usedSkills / 2
        }

        const AutoFortRegistration = {
            init: init
        }

        if (typeof GameMap !== 'undefined') {
            GameMap.AutoFortRegistration = AutoFortRegistration;
        }
    })()
    


///////////////////////////// helper fuctions /////////////////////////////

const at = function(x, y) { return x == Character.position.x && y == Character.position.y };
const atHome = function() { return Character.homeTown.x == Character.position.x && Character.homeTown.y == Character.position.y };
const hasTask = function() { return TaskQueue.queue.length > 0; };
const hasTown = function() { return Character.homeTown.town_id != 0; };
const task = function() { return TaskQueue.queue[0]; };
const lastTask = function() { return TaskQueue.queue[TaskQueue.queue.length - 1]; };
const executeWithProbability = function(probability, func) { if (Math.random() < probability) { func(); }};
const getMissedEnergy = function () { return 100 - Character.energy / Character.maxEnergy * 100; };
const getMissedHealth = function () { return 100 - Character.health / Character.maxHealth * 100; };

///////////////////////////////////////////////////////////////////////////


    let Beans = {
        oneshot: {},
        buff: {
            beans: 1943000,
            bagMotivation: 2484000,
            bagEnergy: 2485000,
            juice: 52869000,
            coffee: 2128000,
            eggs: 185203000,
            pranik15: 12704000,
            bags: 1952000,
            cakes: 53336000,           // hp 50%
            tea: 2130000,
            guarana: 2129000,
            coffee: 2128000,
            bottlePlug: 52871000,
            topper: 53338000,
            fruitJuice: 52869000,      // 10% motivation, 20% energy
            
            cigarettes: 1939000,
            cakeDecorations: 53339000, // 25% energy/motivation
            sweetBase: 52868000,
            soapWater25: 2268000,
            tobacco25: 1891000,
            motivationEgg15: 185200000,
            lacric15: 12701000,
            krendel15: 2353000,
            fireworks15: 2291000,
            tomato15: 13701000,
            
            vizier: 51592000,
            mine: 51588000,
            saddle: 53940000,
            fortMedicine: 54382000,
            

            characterPrem: 21340000,


            fullRecoverBuff: [
                17028000, // beans
                1997000,  // turkey
                53505000, // cacaoChili
                52287000, // pudding
                52292000, // domik
                52872000, // birthdayDrink
                51594000, // tonicPeddlerTincture
            ],

            fullEnergyBuff: [
                2130000,  // mate
                51356000, // sugarBag
                51782000, // pumpkinSoup
                52362000, // heart
            ],
        },
        images: {
            green: "https://westru.innogamescdn.com/images/items/yield/2017_xmas_green.png?5",
            red: "https://westru.innogamescdn.com/images/items/yield/baked_beans.png?5",
        },
        states: {
            none: null,
            sleep: 'sleep',
            defend: 'defend',
            working: 'working',
        },
        whiteList: {
            'EnergyStriker': true,
            'Raistlin Majere': true,
            'w1zard': true,
            'Noob4eg': true,
            'Gigant1': true,
            '3ак': true,
            'Naval': true,
            'Андрей Улитин': true,
            'cerf': true,
        },
        durationByEnergyMap: { 3600: 12, 1800: 6, 900: 3, 600: 5, 15: 1 },
        motivationByDurationMap: { 3600: 12, 600: 5, 15: 1 },
        timeoutIds: {},
        isRunning: false,
        bagIds: [
            // 50691000,
            2665000,     // DoD
            2666000,
            2482000,  // nuggets
            // 2557000,  // hearts small
            // 2558000,  // hearts big
            // 2698000,  // eggs big
            // 51482000, // fireworks small
            // 51483000, // fireworks big
            50691000, // oktober big
        ],
        isMain: Game.worldName == "Ганнисон",
        maxJobs: 4,
        botToken: "7194106399:AAGjLzzqlccDHlrDwEdQRhBi5Q4Cx6GH_7U",
        // chatId: 1005292580,
        chatId: -732543551,

        createMenuIcon: function () {
            let div = $('<div class="ui_menucontainer" id="beans"/>');
            let link = $('<div id="Menu" class="menulink" onclick=GameMap.Beans.run(event); onauxclick=GameMap.Beans.logout(event); oncontextmenu=GameMap.Beans.openSettings(event); title="Beans" />')
                .css('background-image', `url(${Beans.images.red})`)
                .css('background-size', 'contain');
            $('#ui_menubar').append((div).append(link).append('<div class="menucontainer_bottom" />'))
        },
        hasSetting: function (name) { return Beans.settings[name]; },
        trueCondition: function () { return true; },
        settingsCondition: function (setting) { return function() { return Beans.hasSetting(setting); }; },
        oneOfsettingsCondition: function (...settings) { 
            return function() { 
                for (let i = 0; i < settings.length; i++) {
                  if (Beans.hasSetting(settings[i])) return true;
                }
                return false;
              }; 
        },
        allSettingsCondition: function (...settings) { 
            return function() { 
                for (let i = 0; i < settings.length; i++) {
                  if (!Beans.hasSetting(settings[i])) return false;
                }
                return true;
              }; 
        },
        revertSettingsCondition: function (setting) { return function() { return !Beans.hasSetting(setting); }; },
        TWDSCondition: function() { return typeof GameMap.TWDS != 'undefined' },
        TWDSAndTownCondition: function() { return hasTown() && TWDSCondition() },
        eventCondition: function () { return !!Beans.currentEvent; },

        run: function (e) {
            if (this.isRunning) {
                this.isRunning = this.settings.isRunning = false;
                Beans.setState(Beans.states.none); // save there
                document.getElementsByClassName('ui_menucontainer').beans.children.Menu.style
                    .backgroundImage=`url(${Beans.images.red})`
                Object.values(Beans.timeoutIds).forEach(timeoutId => {
                    clearTimeout(timeoutId);
                });
                Beans.timeoutIds = {};
                new UserMessage("Закончил работать", UserMessage.TYPE_HINT).show();
                return;
            }

            document.getElementsByClassName('ui_menucontainer').beans.children.Menu.style
                .backgroundImage=`url(${Beans.images.green})`


            if (!WestUi.FriendsBar.friendsBarUi && Beans.eventCondition) {
                WestUi.FriendsBar.toggle();
            }

            Beans.functionsToRepeat.forEach(Beans.runTask);
            this.isRunning = this.settings.isRunning = true;
            this.saveSettings();
            new UserMessage("Поррработаем!", UserMessage.TYPE_SUCCESS).show();
        },

        initTask: async function(task, index) {
            runTask(task, index);
            await GameMap.AjaxAsync.wait(300);
        },

        runTask: function(task, index) {
            if (!task.condition() || !Beans.hasSetting(task.name)) return;
            Beans.setRandomInterval(task.name, task.min, task.max, !task.notRunOnStart, task.allowBeforeFort, !task.oneShot, task.isDynamic);
        },

        setRandomInterval: async function (func, min, max, runNow, allowBeforeFort, doInterval, isDynamic) {
            const allowedTimeToFort = 15 * 60;

            if (isDynamic) {
                if (hasTask()) {
                    const lastTask = TaskQueue.queue[TaskQueue.queue.length - 1];
                    const lastTaskEndTime = lastTask.data?.date_done || Date.now();
                    const remainingMinutes = Math.max(0, (lastTaskEndTime - Date.now()) / (1000 * 60));
                    
                    console.log('Queue ends in:', remainingMinutes, 'minutes');
                    
                    if (remainingMinutes * 60 > 135 || Beans.hasSetting('farm15sec') && !Beans.hasSetting('equipBest')) { 
                        max = remainingMinutes;
                        min = max / 2;
                    } else {
                        min = remainingMinutes;
                        max = min * 1.3;
                    }
                    
                } else {
                    min = 1;
                    max = 3;
                }
            }

            let minMs = min * 60 * 1000;
            let maxMs = max * 60 * 1000;
            let rand = Math.round(Math.random() * (maxMs - minMs)) + minMs; // min-max min
            if (runNow && (allowBeforeFort || Beans.getCurrentBattleTimer() > allowedTimeToFort)) {
                console.log(`doing ${func}`);
                await Beans[func]();
            }
            if (!doInterval) return
            console.log(`planning ${func} in ${rand / 1000} seconds`);
            Beans.timeoutIds[func] = setTimeout(async function () {
                if (!Beans.isRunning) return;
                console.log(func);
                if (allowBeforeFort || Beans.getCurrentBattleTimer() > allowedTimeToFort) {
                    await Beans[func]();
                }

                Beans.setRandomInterval(func, min, max, false, allowBeforeFort, true, isDynamic);
            }, rand);
        },

        tryUseBag: async function () {
            for (const itemId of this.bagIds) {

                if (!Bag.getItemByItemId(itemId) || Date.now() < Bag.itemCooldown[itemId] * 1000) continue;
                
                let res = await GameMap.AjaxAsync.remoteCall("itemuse", "use_item", {
                    item_id: itemId,
                    lastInvId: Bag.getLastInvId()
                });
                if (res.error) {
                    if (res.error_data && res.error_data.usedup) {
                        delete Bag.itemCooldown[itemId];
                        EventHandler.signal('cooldown_changed');
                        EventHandler.signal('inventory_changed');
                        EventHandler.signal('item_lifetime_changed', [itemId, null]);
                    }
                    new UserMessage(res.msg, UserMessage.TYPE_ERROR).show();
                }
                if (res.msg.itemCooldown) {
                    Bag.itemCooldown[itemId] = res.msg.itemCooldown;
                    EventHandler.signal("cooldown_changed");
                }
                if (res.msg.itemLifetime) {
                    EventHandler.signal('item_lifetime_changed', [itemId, res.msg.itemLifetime]);
                }
            }
        },

        tryEat: async function () {
            if (Date.now() < Character.cooldown * 1000) return;
            if (Beans.hasSetting('farm15sec')) return;
            if (Character.energy > 12 && Beans.getCurrentBattleTimer() < 60 * 60 * 4) return;
            let tasksCount = TaskQueue.queue.length;

            let beans = Bag.getItemByItemId(this.buff.beans);
            let energy = Character.energy;
            if (tasksCount > 0 /*&& !Beans.settings.overRegeneration*/) {                
                const lastTask = hasTask() ? TaskQueue.queue[tasksCount - 1]
                                           : Beans.settings.lastJob;
                const duration = (lastTask.data.date_done - lastTask.data.date_start) / 1000;
                const jobEnergy = Beans.durationByEnergyMap[duration] || 12;
                energy += tasksCount * jobEnergy; 
                if (Character.energy > 5 && Beans.getCurrentBattleTimer() < 60 * 20) return;
                if (!Beans.hasSetting('overRegeneration') && energy >= jobEnergy * Beans.maxJobs) return;
            }


            var missedEnergyPercents = 100 - energy / Character.maxEnergy * 100;
            var buff;
            if (missedEnergyPercents > 10 && Bag.getItemByItemId(this.buff.bagEnergy) && Date.now() > Bag.itemCooldown[this.buff.bagEnergy] * 1000) {
                buff = Bag.getItemByItemId(this.buff.bagEnergy);
            }
            if (!buff && missedEnergyPercents > 10) buff = beans;
            if (!buff && missedEnergyPercents > 15) buff = Bag.getItemByItemId(this.buff.eggs);
            if (!buff && missedEnergyPercents > 25) buff = Bag.getItemByItemId(this.buff.coffee);
            if (!buff && missedEnergyPercents > 50) buff = Bag.getItemByItemId(this.buff.guarana);
            if (!buff && missedEnergyPercents > 15) buff = Bag.getItemByItemId(this.buff.juice);

            if (buff == null || buff.obj == null) return;

            await Beans.drink(buff.obj.item_id);
        },

        findFirstAvailableItem: function(...itemIds) {
            for (const itemId of itemIds) {
              const item = Bag.getItemByItemId(itemId);
              if (item) {
                return item;
              }
            }
            return null;
          },

        churchMotivation: async function () {
            if (Date.now() < Character.cooldown * 1000) return;
            let tasksCount = TaskQueue.queue.length;
            const lastTask = tasksCount > 0 ? TaskQueue.queue[tasksCount - 1]
                                            : Beans.settings.lastJob;
            if (!(Beans.hasSetting('build') || lastTask.type == 'build')) return;

            let motivationBuff = null;
            let churchResponse = await GameMap.AjaxAsync.remoteCallMode('cityhall_build', 'build', 
                {x: Character.homeTown.x, y: Character.homeTown.y, building: 'church'});
            let motivation = churchResponse.motivation;

            if (motivation < 0.95 && Bag.getItemByItemId(this.buff.bagMotivation) && (Bag.itemCooldown[this.buff.bagMotivation] === undefined || Date.now() > Bag.itemCooldown[this.buff.bagMotivation] * 1000)) {
                motivationBuff = Beans.findFirstAvailableItem(this.buff.bagMotivation);
            }

            if (!motivationBuff && Beans.settings.cinema && motivation < 0.97)
                if ((await Beans.viewMovie(motivation))) return;

            if (!motivationBuff && motivation < 0.81) motivationBuff = Beans.findFirstAvailableItem(
                this.buff.soapWater25,
                this.buff.tobacco25,
                this.buff.sweetBase
            );

            if (!motivationBuff && motivation < 0.91) motivationBuff = Beans.findFirstAvailableItem(
                this.buff.saddle,
                this.buff.motivationEgg15,
                this.buff.lacric15,
                this.buff.krendel15,
                this.buff.fireworks15,
                this.buff.tomato15
            );
            if (!motivationBuff && motivation < 0.95) motivationBuff = Beans.findFirstAvailableItem(
                this.buff.cigarettes
            );
            if (!motivationBuff  && motivation < 0.81) Beans.sendTgNotification(`[${Game.worldName}] У ${Character.name} закончились бафы на мотиву`);

            if (motivationBuff == null || motivationBuff.obj == null) return;

            await Beans.drink(motivationBuff.obj.item_id);

        },

        drink: async function(itemId) {
            if (!itemId) return false;
            let res = await GameMap.AjaxAsync.remoteCall("itemuse", "use_item", {
                item_id: itemId,
                lastInvId: Bag.getLastInvId()
            });

            console.log(`Хочу подбухнуть ${ItemManager.get(itemId).name}`);

            if (res.error) {
                if (res.error_data && res.error_data.usedup) {
                    delete Bag.itemCooldown[itemId];
                    EventHandler.signal('cooldown_changed');
                    EventHandler.signal('inventory_changed');
                    EventHandler.signal('item_lifetime_changed', [itemId, null]);
                }
                return new UserMessage(res.msg,UserMessage.TYPE_ERROR).show();
            }
            var i,m;
            if (Character.cooldown != res.msg.cooldown) {
                Character.cooldown = res.msg.cooldown;
                EventHandler.signal("cooldown_changed");
            }
            if (res.msg.itemCooldown) {
                Bag.itemCooldown[itemId] = res.msg.itemCooldown;
                EventHandler.signal("cooldown_changed");
            }
            if (res.msg.itemLifetime) {
                EventHandler.signal('item_lifetime_changed', [itemId, res.msg.itemLifetime]);
            }
            Bag.updateChanges(res.msg.changes || {});
            for (i = 0; i < res.msg.effects.length; i += 1) {
                m = res.msg.effects[i];
                switch (m.type) {
                case 'hitpoints':
                    Character.setHealth(m.hitpoints);
                    break;
                case 'duel_motivation':
                    if (m.duelmotivation_npc) {
                        Character.setNPCDuelMotivation(m.duelmotivation_npc);
                    }
                    Character.setDuelMotivation(m.duelmotivation);
                    break;
                case 'work_motivation':
                    EventHandler.signal('jobmotivation_change');
                    break;
                case 'hitpoints':
                    Character.setHealth(m.hitpoints);
                    break;
                case 'buff':
                    Character.setSpeed(m.char_speed);
                    WearSet.setWorkPointBonus(m.workPointBonus);
                    CharacterSkills.setBuffs(m.all);
                    CharacterSkills.updateAllBonuspoints(m.bonus.allBonuspoints);
                    break;
                case 'energy':
                    Character.setEnergy(m.energy);
                    break;
                }
            }
            EventHandler.signal('item_used', [itemId]);

            return true;
        },

        increaseMotivation: function(itemId) {
            let item = ItemManager.get(itemId);
            if (!item.usebonus) return;
            // console.log(`increaseMotivation: used ${item.name}`);
            const motivationBonusStr = item.usebonus.find(bonus => bonus.includes('отивация к работе'));
            if (!motivationBonusStr) return;
            let bonus = parseInt(motivationBonusStr.match(/\+?(\d+)%?/)[1]);
            // console.log(`motivation: ${Beans.farmJob.motivation}`)
            Beans.farmJob.motivation = Math.min(100, Beans.farmJob.motivation + bonus);
            // console.log(`motivation increased: ${Beans.farmJob.motivation}`)
        },

        walkToJob: async function(groupId, x, y) {
            await Beans.equipSpeedSet();
            let lowLvlJob = JobList
                .getJobsByGroupId(groupId)
                .sort((a, b) => a.level - b.level)[0];
            TaskQueue.add(new TaskJob(lowLvlJob.id, x, y, 15));
            await GameMap.AjaxAsync.wait(Beans.getRandMs(1.5,4.3));
        },

        walkToHome: async function() {
            await Beans.equipSpeedSet();
            TaskQueue.add(new TaskWalk(Character.homeTown.town_id, 'town'));
            await GameMap.AjaxAsync.wait(Beans.getRandMs(1.5,4.3));
        },

        build: async function () {
            if (Character.homeTown.id == 0) return;
            let isGoing = false;
            if (!atHome()) {
                await Beans.walkToHome();
                await GameMap.AjaxAsync.wait(Beans.getRandMs(1.5,4.3));
                isGoing = true;
            }
            let duration = Beans.eventCondition() ? 900 : 3600;
            let jobEnergy = Beans.durationByEnergyMap[duration] || 12;
            let jobsCount = Math.min(Math.floor(Character.energy / jobEnergy), Beans.maxJobs - TaskQueue.queue.length);
            let taskData = {x: Character.homeTown.x, y: Character.position.y, building: "church", townDeposit: true};
            await Beans.repeatBuild(taskData, jobsCount, duration, isGoing);
        },

        setJobs: async function () {
            let tasksCount = TaskQueue.queue.length;
            if (Beans.maxJobs == tasksCount || tasksCount == 0 && !Beans.settings.lastJob) return;
            let lastTask = tasksCount > 0 ? TaskQueue.queue[tasksCount - 1]
                                          : Beans.settings.lastJob;

            let isGoing = false;
            
            if (tasksCount == 0 && Character.position.x != lastTask.data.x && Character.position.y != lastTask.data.y) {
                if (Character.energy < 13) return;

                if (lastTask.type == "build") await Beans.walkToHome();
                else if (lastTask.type == "job") await Beans.walkToJob(lastTask.data.job.groupid, lastTask.data.x, lastTask.data.y);
                isGoing = true;

                tasksCount++;
            }

            if (lastTask.type != 'job' && lastTask.type != 'build') return;
            let savedJob = Beans.settings.lastJob;
            let churchDurationChanged = savedJob 
                && lastTask.type == 'build' 
                && savedJob.type == 'build'
                && (savedJob.data.date_done - savedJob.data.date_start != lastTask.data.date_done - lastTask.data.date_start);
            let jobChanged = savedJob
                && savedJob.data.job 
                && lastTask.data.job 
                && (savedJob.data.job.id != lastTask.data.job.id 
                    || savedJob.data.x != lastTask.data.x 
                    || savedJob.data.y != lastTask.data.y
                    || savedJob.data.duration != lastTask.data.duration);
            // build has not job field
            if (!savedJob  // no lastJob saved
                || savedJob.type != lastTask.type // job <-> build change
                || churchDurationChanged
                || jobChanged) { 
                console.log('saving new job:');
                console.log(lastTask);
                console.log('old was:');
                console.log(Beans.settings.lastJob);
                Beans.settings.lastJob = lastTask;
                Beans.settings.namedTOSet = null;
                await Beans.setWorkingSet();
                Beans.saveSettings();
            }

            let duration = (lastTask.data.date_done - lastTask.data.date_start) / 1000;
            let jobEnergy = Beans.durationByEnergyMap[duration] || 12;
            if (Character.energy < jobEnergy) return;

            let jobsCount = Math.min(Math.floor(Character.energy / jobEnergy), Beans.maxJobs - tasksCount);
            switch(lastTask.type) {
                case "job":
                    await Beans.repeatJob(lastTask.data, jobsCount, duration, isGoing);
                    break;
                case "build": 
                    await Beans.repeatBuild(lastTask.data, jobsCount, duration, isGoing);
                    break;
                }
        },

        setWorkingSet: async function() {
            let namedSet = await Beans.findCurrentSet();
            Beans.settings.namedWorkingSet = namedSet.found ? namedSet.setName 
                                                                : null;
            Beans.settings.workingSet = Object.values(Wear.wear).map(w => w.obj.item_id);
        },

        equipWorkingSet: async function() {
            if (Beans.settings.namedWorkingSet && (await Beans.equipNamedSet(Beans.settings.namedWorkingSet))) return;
            await Beans.equipSet(Beans.settings.workingSet);
        },

        equipSpeedSet: async function() {
            if (Beans.namedSpeedSet && (await Beans.equipNamedSet(Beans.namedSpeedSet))) return;
            else if (Beans.speedSet) {
                await Beans.equipSet(Beans.speedSet);
                return;
            }

            Beans.speedSet = GameMap.TWDS.speedcalc.doit(1, 0);
            await Beans.equipSet(Beans.speedSet);
            let namedSet = await Beans.findCurrentSet();
            if (namedSet.found) Beans.namedSpeedSet = namedSet.setName;
        },

        equipBest: async function(workId) {
            if (Beans.settings.namedTOSet && (await Beans.equipNamedSet(Beans.settings.namedTOSet))) return;

            await Beans.equipSet(Beans.getBestGear(workId));
            let namedSet = await Beans.findCurrentSet();
            if (namedSet.found) {
                Beans.settings.namedTOSet = namedSet.setName;
                Beans.saveSettings();
            }
        },

        repeatJob: async function (taskData, count, duration, isGoing) {
            var tasks = [];
            for (var i = 0; i < count; i++) {
                tasks.push(new TaskJob(taskData.job.id, taskData.x, taskData.y, duration));
            }
            // if (!Beans.settings.workingSet) await setWorkingSet();

            if (Beans.hasSetting('equipBest')) {
                await Beans.equipBest(taskData.job.id);
                await GameMap.AjaxAsync.wait(Beans.getRandMs(1.2, 3.5));
            }
            else await Beans.equipWorkingSet();

            if (isGoing // if character already on point, cancel tmp 15 sec job immediatly
                && Character.position.x == taskData.x 
                && Character.position.y == taskData.y 
                && hasTask()
                && task().data.duration == 15) {

                isGoing = false;
                TaskQueue.cancel(0);
                tasks.push(new TaskJob(taskData.job.id, taskData.x, taskData.y, duration));
                await GameMap.AjaxAsync.wait(Beans.getRandMs(2.7, 5.4));
            }

            TaskQueue.add(tasks);
            await GameMap.AjaxAsync.wait(Beans.getRandMs(2.7, 5.4));
            if (isGoing) {
                TaskQueue.cancel(0);
                await GameMap.AjaxAsync.wait(Beans.getRandMs(2.7, 5.4));
                Beans.repeatJob(taskData, 1, duration);
                return;
            }
            await Beans.equipWorkingSet()
        },

        repeatBuild: async function (taskData, count, duration, isGoing) {
            if (TaskQueue.queue.length == 0 || TaskQueue.queue.length == 1 && task().type == 'walk') 
                // иначе бывает переодевается из хорошего шмота в шмот немного хуже
                if (!(await Beans.equipNamedSet('стройка', { job_1000: 1, joball: 1 }, { build: 3, repair: 1, leadership: 1, joball: 1, job_1000: 1 })))
                    await Beans.equipWorkingSet();
            var tasks = [];
            for (var i = 0; i < count; i++) {
                tasks.push(new TaskBuild(taskData.x, taskData.y, taskData.building, duration, taskData.townDeposit ? "town" : "player"));
            }
            TaskQueue.add(tasks);
            await GameMap.AjaxAsync.wait(Beans.getRandMs(2.7, 5.4));
            if (isGoing) {
                if (hasTask() && task().type == 'walk') {
                    TaskQueue.cancel(0);
                    await GameMap.AjaxAsync.wait(Beans.getRandMs(2.7, 5.4));
                }
                Beans.repeatBuild(taskData, 1, duration);
            }
        },

        getBestGear: function (jobid) {
            var modelId = function (jobid) {
                for (var i = 0; i < JobsModel.Jobs.length; i++) {
                    if (JobsModel.Jobs[i].id == jobid)
                        return i;
                }
                return -1;
            }
            var model = JobsModel.Jobs[modelId(jobid)];
    
            var set = west.item.Calculator.getBestSet(model.get('skills'), jobid),
                items = set && set.getItems() || [],
                invItems = Bag.getItemsByItemIds(items),
                bestItems = [], i, invItem, wearItem;
            for (i = 0; i < invItems.length; i++) {
                invItem = invItems[i];
                wearItem = Wear.get(invItem.getType());
                if (!wearItem || (wearItem && (wearItem.getItemBaseId() !== invItem.getItemBaseId() || wearItem.getItemLevel() < invItem.getItemLevel()))) {
                    bestItems.push(invItem.obj.item_id);
                }
            }
    
            return bestItems;
        },

        getEventCurrencyToFullPlay: function(stages) {
            return stages.reduce((partial, el) => partial + (el +8) * 60, 0);
        },

        doEvent: async function () {
            await Beans.play[Beans.currentEvent]();
        },

        play: {
            DayOfDead: async function () {
                let container = document.querySelector('#ui_notibar div:nth-child(1) > div:nth-child(3)');
                let element = container?.querySelector('.image.dayofdeadwof')?.parentElement;
                const freeLabel = element?.querySelector('span')?.textContent;
                if (freeLabel != "free") return; 

                const wofid = 51 + (new Date().getFullYear() - 2024) * 5;
                let init = await GameMap.AjaxAsync.remoteCallMode("wheeloffortune", "init", { "wofid": wofid });
                if (init.mode.game.free_games == 0) return;
                await GameMap.AjaxAsync.remoteCall("wheeloffortune", "gamble", { "action": "open", "wofid": wofid });

                for (let i = 0; i < 5; i++) {
                    let result = await GameMap.AjaxAsync.remoteCall("wheeloffortune", "gamble", { "action": "gamble", "wofid": wofid, "card": Math.floor(Math.random() * 3) });
                    if (result.game.status == "lost") {
                        await GameMap.AjaxAsync.remoteCall("wheeloffortune", "gamble", { "action": "end", "wofid": wofid });
                        break;
                    }
                    const itemId = result.stages[i].rewards.item;
                    let item = ItemManager.get(itemId);

                    if (i == 4 || item.set && ((item.type === 'head' || item.type === 'neck') !== !!Beans.settings.play9k) ) {
                        result = await GameMap.AjaxAsync.remoteCall("wheeloffortune", "gamble", { "action": "end", "wofid": wofid });
                        Beans.sendTgNotification(`[${Game.worldName}] ${Character.name} залутал ${item.name}!`);
                        break;
                    }

                    await GameMap.AjaxAsync.remoteCall("wheeloffortune", "gamble", { "action": "continue", "wofid": wofid });
                    await GameMap.AjaxAsync.wait(5000);
                }
                EventHandler.signal('inventory_changed');
                await Beans.play["DayOfDead"]();

                element.querySelectorAll('.free').forEach(el => el.remove());
            }, 

            Easter: async function() {
                const payid = 16, wofid = 48 + (new Date().getFullYear() - 2024) * 5, ms = 970, enhance = 25, bribe = 8, reset = 12;

                let changeSetAndGetWeared = async function () {
                    let currentSet = Object.values(Wear.wear).map(w => w.obj.item_id);
                    Beans.sets = Beans.sets || await Beans.getEquipSets();
                    let duelSet = Beans.sets.filter(s => s.name == 'дуэль');
                    if (duelSet.length == 0) {
                        console.warn('Duel set not found');
                        return null;
                    }
                    EquipManager.switchEquip(duelSet[0].equip_manager_id);
                    await Beans.waitEquip(Beans.getSetItemArray(duelSet[0]))
                    return currentSet;
                };

                let resetIfHasEggs = async function() {
                    if (Character.ses_currency.easter / 60 < enhance + bribe + reset) return false;
                    await GameMap.AjaxAsync.remoteCall('wheeloffortune', 'gamble', { 
                        payid: payid, 
                        action: 'reset', 
                        wofid: wofid 
                    });
        
                    return true;
                };

                let playEasterEvent = async function (enhance) {
                    let enhanceWithBribe = enhance + bribe;
        
                    if (Character.ses_currency.easter / 60 < enhanceWithBribe) {
                        return;
                    }
        
                    let response = await GameMap.AjaxAsync.remoteCall('wheeloffortune', 'gamble', {
                        payid: payid,
                        action: 'main',
                        wofid: wofid,
                        enhance: enhance
                    });
        
                    if (response.error) {
                        new UserMessage(response.msg, UserMessage.TYPE_ERROR).show();
                        return;
                    }
                    if (undefined !== response.nuggets) {
                        Character.setNuggets(parseInt(response.nuggets));
                    }
                    Character.ses_currency[Beans.currentEvent.toLowerCase()] -= enhance * 60;
        
        
                    await GameMap.AjaxAsync.wait(ms);
        
                    if (!response.outcome) {
                        response = await GameMap.AjaxAsync.remoteCall('wheeloffortune', 'gamble', {
                            payid: payid,
                            action: 'bribe',
                            wofid: wofid
                        });
                        Character.ses_currency[Beans.currentEvent.toLowerCase()] -= 8 * 60;
                        await GameMap.AjaxAsync.wait(ms);
                    }
        
                    let itemName = ItemManager.get(response.outcome.itemId).name;
        
                    EventHandler.signal('inventory_changed');
                    if (response.outcome.itemEnhance > 0) {
                        Beans.sendTgNotification(`[${Game.worldName}] ${Character.name} залутал ${itemName}!`);
                    }
                };

                let response = await GameMap.AjaxAsync.remoteCallMode('wheeloffortune', 'init', { wofid: wofid });

                if ((Array.isArray(response.mode.cooldowns) && response.mode.cooldowns.length > 0
                    || !Array.isArray(response.mode.cooldowns) && Object.keys(response.mode.cooldowns).length > 0)
                    && response.mode.cooldowns[0].cdstamp * 1000 > Date.now())
                    return;
                let currentSet = await changeSetAndGetWeared();
                if (!currentSet) return;

                do {
                    await GameMap.AjaxAsync.wait(ms);
                    await playEasterEvent(0);
                    await GameMap.AjaxAsync.wait(ms);

                    if (Beans.settings.play25) { 
                        await playEasterEvent(25);
                        await GameMap.AjaxAsync.wait(ms);
                    }
                    if (Beans.settings.play9k) { 
                        await playEasterEvent(150);
                        await GameMap.AjaxAsync.wait(ms);
                    }
                } while (Beans.settings.reduce && (await resetIfHasEggs()));

                await Beans.equipSet(currentSet);
            },

            Independence: async function() {
                const payid = 16, wofid = 49 + (new Date().getFullYear() - 2024) * 5, ms = 970, bribe = 8;
                let stages = [0, 25];
                if (Beans.settings.play9k) stages = [0, 25, 150]
                let response = await GameMap.AjaxAsync.remoteCallMode('wheeloffortune', 'init', { wofid: wofid });
                let states = response.mode.states;
                let needReduce = Beans.settings.reduce;
                for (const st of stages) {
                    const current = states[st];
                    if (current.being_built) {
                        needReduce = needReduce && (response.mode.states[0].finish_date * 1000 - Date.now()) / 1000 / 60 > 120;
                        continue;
                    }
                    if (!current.collected) {
                        let response = await GameMap.AjaxAsync.remoteCall('wheeloffortune', 'gamble', { wofid: wofid, action: 'collect', enhance: st});
                        await GameMap.AjaxAsync.wait(ms);
            
                        let itemName = ItemManager.get(response.outcome.itemId).name;
            
                        EventHandler.signal('inventory_changed');
                        if (response.outcome.itemEnhance > 25) {
                            Beans.sendTgNotification(`[${Game.worldName}] ${Character.name} залутал ${itemName} за ${st * 60}!`);
                        }
                    }
                    if (Character.ses_currency[Beans.currentEvent.toLowerCase()] / 60 < st) {
                        return;
                    }
        
                    response = await GameMap.AjaxAsync.remoteCall('wheeloffortune', 'gamble', {
                        payid: payid,
                        action: 'main',
                        wofid: wofid,
                        enhance: st
                    });
        
                    if (response.error) {
                        new UserMessage(response.msg, UserMessage.TYPE_ERROR).show();
                        return;
                    }
                    if (undefined !== response.nuggets) {
                        Character.setNuggets(parseInt(response.nuggets));
                    }
                    Character.ses_currency[Beans.currentEvent.toLowerCase()] -= st * 60;
                }
                needReduce = needReduce && Character.ses_currency[Beans.currentEvent.toLowerCase()] < Beans.getEventCurrencyToFullPlay(stages);
                while (needReduce) {
                    response = await GameMap.AjaxAsync.remoteCallMode('wheeloffortune', 'gamble', { wofid: wofid, action: 'reset', payid: payid});
                    let states = response.states;
                    for (const st of stages) {
                        const current = states[st];
                        needReduce = needReduce && (response.mode.states[0].finish_date * 1000 - Date.now()) / 1000 / 60 > 120;
                    }
                    needReduce = needReduce && Character.ses_currency[Beans.currentEvent.toLowerCase()] < Beans.getEventCurrencyToFullPlay(stages) ;
                }
            },

            Octoberfest: async function () {
                const payid = 16, wofid = 50 + (new Date().getFullYear() - 2024) * 5, bribe = 8, reset = 8, ms = 900;

                let stages = [0, 25];
                if (Beans.settings.play9k) stages = [0, 25, 150]
                let response = await GameMap.AjaxAsync.remoteCallMode('wheeloffortune', 'init', { wofid: wofid });
                let states = response.mode.states;
                let needReduce = Beans.settings.reduce;
                for (const st of stages) {
                    const current = states[st];
                    if (current && current.being_built) {
                        needReduce = needReduce && (current.finish_date * 1000 - Date.now()) / 1000 / 60 > 119;
                        continue;
                    }
                    if (Character.ses_currency[Beans.currentEvent.toLowerCase()] / 60 < st + bribe) {
                        continue;
                    }

                    response = await GameMap.AjaxAsync.remoteCall('wheeloffortune', 'gamble', {
                        payid: payid,
                        action: 'main',
                        wofid: wofid,
                        enhance: st
                    });

                    if (response.error) {
                        new UserMessage(response.msg, UserMessage.TYPE_ERROR).show();
                        continue;
                    }
                    if (undefined !== response.nuggets) {
                        Character.setNuggets(parseInt(response.nuggets));
                    }
                    Character.ses_currency[Beans.currentEvent.toLowerCase()] -= st * 60;

                    if (response.failed) {
                        response = await GameMap.AjaxAsync.remoteCall('wheeloffortune', 'gamble', {
                            payid: payid,
                            action: 'bribe',
                            wofid: wofid
                        });
                        Character.ses_currency[Beans.currentEvent.toLowerCase()] -= bribe * 60;
                        await GameMap.AjaxAsync.wait(ms);
                    }

                    let itemId = response.itemId || response.outcome.itemId;
                    let itemName = ItemManager.get(itemId).name;

                    EventHandler.signal('inventory_changed');
                    if (response.itemEnhance > 25 || response.itemEnhance != 0 && response.outcome && response.outcome.itemEnhance > 25) {
                        Beans.sendTgNotification(`[${Game.worldName}] ${Character.name} залутал ${itemName} за ${st * 60}!`);
                    }
                }
                needReduce = needReduce && Character.ses_currency[Beans.currentEvent.toLowerCase()] > Beans.getEventCurrencyToFullPlay(stages) + reset * 60;
                while (needReduce) {
                    response = await GameMap.AjaxAsync.remoteCall('wheeloffortune', 'gamble', { wofid: wofid, action: 'reset', payid: payid });
                    let states = response.stamps;
                    for (const st of stages) {
                        const current = states[st];
                        needReduce = needReduce && (current.finish_date * 1000 - Date.now()) / 1000 / 60 > 119;
                    }
                    needReduce = needReduce && Character.ses_currency[Beans.currentEvent.toLowerCase()] > Beans.getEventCurrencyToFullPlay(stages) + reset * 60;
                }
            },
        },

        getSetItemArray: function (set) {
            var items = [];
            ['head', 'neck', 'body', 'right_arm', 'left_arm', 'belt', 'foot', 'animal', 'yield', 'pants'].forEach(item => {
                if (set[item] != null) items.push(set[item]);
            });
            return items;
        },

        waitEquip: async function (items) {
            while (true) {
                if (Beans.isGearEquiped(items)) break;
                await GameMap.AjaxAsync.wait(10);
            }

            return Promise.resolve(true);
        },

        equipSet: async function (items) {
            for (var i = 0; i < items.length; i++) {
                if (!Beans.isWearing(items[i])) {
                    let item = Bag.getItemByItemId(items[i]);
                    if (item) Wear.carry(item);
                }
            }
            await Beans.waitEquip(items);
        },

        isWearing: function (itemId) {
            let type = ItemManager.get(itemId).type;
            if (Wear.wear[type] == undefined) return false;
            return Wear.wear[type].obj.item_id == itemId;
        },

        isGearEquiped: function (items) {
            for (var i = 0; i < items.length; i++) {
                if (!Beans.isWearing(items[i])) return false;
            }
            return true;
        },

        disableSetting: function(action) {
            if (!Beans.hasSetting(action)) return;
            Beans.settings[action] = false;

            switch (action) {
                case 'fort': 
                    EventHandler.unlisten("fort_battle_joined", Beans.updateFortBattle);
                    EventHandler.unlisten("fort_battle_end", Beans.onBattleEnd);
                    break;
                case 'farm15sec':
                    Beans.stopFarm();
                    break;
                case 'alwaysOffline': 
                    Chat.Router.connect();
                    break;

                default:
                    break;
            }

            if (!Beans.isRunning) return;
            clearTimeout(Beans.timeoutIds[action]);
            delete Beans.timeoutIds[action];
        },

        enableSetting: function(action) {
            if (Beans.hasSetting(action)) return;
            Beans.settings[action] = true;

            switch (action) {
                case 'farm15sec':
                    Beans.disableSetting('setJobs');
                    Beans.disableSetting('build');
                    break;
                case 'setJobs':
                    Beans.disableSetting('farm15sec');
                    Beans.disableSetting('build');
                    break;
                case 'build':
                    Beans.disableSetting('setJobs');
                    Beans.disableSetting('farm15sec');
                    break;
                case 'fort': 
                    EventHandler.listen("fort_battle_joined", Beans.updateFortBattle);
                    EventHandler.listen("fort_battle_end", Beans.onBattleEnd);
                    break;
                case 'alwaysOffline': 
                    Chat.Router.disconnect();
                    break;
                    
                default:
                    break;
            }

            if (!Beans.isRunning) return;
            let task = Beans.functionsToRepeat.filter(t => t.name == action)[0];
            if (!task || !Beans.isRunning) return;
            Beans.runTask(task);
        },

        switchSetting: function(action) {
            if (Beans.settings[action]) Beans.disableSetting(action);
            else Beans.enableSetting(action);

            return Beans.hasSetting(action);
        },

        openSettings: function (e) {
            e.preventDefault();
            let pos = $('#beans').offset();
            pos = {
              clientX: pos.left,
              clientY: pos.top
            };
            let listener = function (action) {
                Beans.switchSetting(action);
                Beans.saveSettings();
                new UserMessage("Сохранено!", UserMessage.TYPE_SUCCESS).show();
            };
            const selectBox = new west.gui.Selectbox().setWidth(200)
                .addListener(listener);

            Beans.functionsToRepeat.forEach(task => {
                if (!task.condition()) return;
                if (!(task.name in Beans.settings)) {
                    Beans.settings[task.name] = !task.noDefault;
                    Beans.saveSettings();
                }

                let icon = task.name in Beans.settings && Beans.settings[task.name] ? '✅' : '🟩';
                let txt = `${icon} ${task.description}`;
                
                selectBox.addItem(task.name, txt, task.hint);
            });

            Beans.additionalSettings.forEach(s => {
                if (!s.condition()) return;
                if (!(s.name in Beans.settings)) {
                    Beans.settings[s.name] = s.defaultValue;
                    Beans.saveSettings();
                }

                let icon = Beans.settings[s.name] ? '✅' : '🟩'
                let txt = `${icon} ${s.description}`
                
                selectBox.addItem(s.name, txt, s.hint);
            });

            selectBox.show(pos)
            return false;
        },

        sendEventCurrency: async function () {
            WestUi.FriendsBar.friendsBarUi.refresh_();
            WestUi.FriendsBar.friendsBarUi.friendsBar.setSearchType("ses", Beans.currentEvent);
            await GameMap.AjaxAsync.wait(3000);
            hasFriendsToSend = WestUi.FriendsBar.friendsBarUi.friendsBar.result_.players &&
                WestUi.FriendsBar.friendsBarUi.friendsBar.result_.players.length > 0;
            if (hasFriendsToSend) {
                let response = await GameMap.AjaxAsync.remoteCall('friendsbar', 'event_all', { event: Beans.currentEvent });
            }
        },

        logout: function(e) {
            if (e && e.which != 2) return;
            let world = Game.gameURL.replace(/\D/g, '');
            window.history.pushState("object or string", "Title", `/#loginWorld${world}`);
            setTimeout(function() {
                window.history.go()
            }, 3000);
        },

        sendTgNotification: function(message) {
            fetch(`https://api.telegram.org/bot${Beans.botToken}/sendMessage?chat_id=${Beans.chatId}&text=${message}`);
        },

        loadSettings: function() {
            let settings;
            if (localStorage.beans) {
                settings = JSON.parse(localStorage.beans);
                if (typeof settings == 'object') {
                    Beans.settings = settings;
                    return;
                }
            }

            Beans.setDefaultSettings();
        },

        setDefaultSettings: function() {
            settings = {
                isRunning: false, 
            };

            Beans.functionsToRepeat.forEach(task => {
                settings[task.name] = !task.noDefault;
            });
            Beans.additionalSettings.forEach(s => {
                settings[s.name] = s.defaultValue;
            });
            Beans.settings = settings;
            Beans.saveSettings();
        },

        saveSettings: function() {
            localStorage.beans = JSON.stringify(Beans.settings);
        },

        runAway: async function() {
            if (Character.isDuelProtected() || !Character.homeTown) 
                return;

            let response = await GameMap.AjaxAsync.remoteCall('duel', 'search_op', {});
            let isDanger = false;
            let players = response.oplist.pclist;
            let isSleeping = hasTask() && task().type == 'sleep';
            for (let i = 0; i < players.length; i++) {
                if (Beans.whiteList[players[i].player_name]) continue;

                if (players[i].class == 'duelist') {
                    if (Beans.isMain && !isSleeping) 
                        Beans.sendTgNotification(`${players[i].player_name} зашелестел в кустах. ${Character.name} сваливает`);
                    isDanger = true;
                    break;
                }

                if (players[i].dx == 0 && players[i].dy == 0) {
                    if (Beans.isMain && !isSleeping) 
                        Beans.sendTgNotification(`${players[i].player_name} выпрыгивает из кустов. ${Character.name} сваливает`);
                    isDanger = true;
                    break;
                }
            }
            if (isDanger && !isSleeping) await Beans.goSleep();
            if (!isDanger && Beans.settings.state == Beans.states.sleep) await Beans.awake();
        },

        awake: async function() {
            await Beans.cancelJobs();
            await Beans.returnToWork();
        },

        sleep: async function() {
            if (Character.energy < 12 && TaskQueue.queue.length == 0) {
                await Beans.goSleep();
                return;
            }

            if (TaskQueue.queue.length == 0 || hasTask() && task().type != 'sleep')
                return;

            // character already sleeping
            if (Beans.settings.state != Beans.states.sleep)
            {
                await Beans.equipSet(GameMap.TWDS.genCalc({regen:1}, {}));
                Beans.setState(Beans.states.sleep);
            }

            if (Character.energy >= 12 && Beans.settings.minimalRegeneration || Character.energy == Character.maxEnergy) {
                TaskQueue.cancel(0);
                await GameMap.AjaxAsync.wait(3000);
                let action;
                if (Beans.hasSetting('setJobs')) action = 'setJobs';
                else if (Beans.hasSetting('build')) action = 'build';
                else if (Beans.hasSetting('farm15sec')) action = 'farm15sec';

                if (action) {
                    let task = Beans.functionsToRepeat.filter(t => t.name == action)[0];
                    if (!task || !Beans.isRunning) return;
                    Beans.runTask(task);
                }
            }
        },

        setState: function(state) {
            Beans.settings.state = state;
            Beans.saveSettings();
        },

        viewMovie: async function(motivation) {
            if (Beans.noMoreVideos) return false;
            if (!Character.homeTown || Character.homeTown.town_id == 0) return false;

            let videos = await Ajax.remoteCallMode('building_cinema', 'index', { town_id: Character.homeTown.town_id } );
            if (videos.videos_left == 0) {
                Beans.noMoreVideos = true; 
                return false;
            }

            const motivationPerVideo = 0.03;
            const motivationNeeded = 1 - motivation;
            const videosNeeded = Math.floor(motivationNeeded / motivationPerVideo);
            const videosToWatch = Math.min(videosNeeded, videos.videos_left);


            CinemaWindow.open(Character.homeTown.town_id);
            await GameMap.AjaxAsync.wait(5000);

            for (let i = 0; i < videosToWatch; i++) {
                CinemaWindow.controller('video');
                await GameMap.AjaxAsync.wait(16000);
                CinemaWindow.controller('rewards');
                await GameMap.AjaxAsync.wait(3000);
                document.evaluate('//*[@id="cinema-canvas"]/div[3]/div/div[3]', // click motivation
                                    document, 
                                    null, 
                                    XPathResult.FIRST_ORDERED_NODE_TYPE, 
                                    null)
                .singleNodeValue
                .click();

                if (i < videosToWatch - 1) {
                    await GameMap.AjaxAsync.wait(2000);
                }
            }
        
            return true;
        },

        getNearestTown: async function () {
            let response = await GameMap.AjaxAsync.get("map", "get_minimap");
            if (response.error) return new UserMessage(response.msg).show();
            var towns = [];
            for (var town in response.towns) if (response.towns[town].member_count && response.towns[town].town_points > 50000) towns.push(response.towns[town]);
            var position = Character.getPosition();
            for (var t = 0; t < towns.length; t++) towns[t].distance = GameMap.calcWayTime(position, towns[t]);
            towns.sort(function (e, t) { return e.distance - t.distance; });
            return towns[0];
        },

        goSleep: async function() {
            await Beans.cancelJobs();

            let town = Character.homeTown.town_id == 0 ? await Beans.getNearestTown() : Character.homeTown;
            let isCharacterInTown = Character.position.x == town.x && Character.position.y == town.y;
            Beans.settings.workingSet = Object.values(Wear.wear).map(w => w.obj.item_id);
            
            if (!isCharacterInTown) await Beans.equipSpeedSet();

            TaskQueue.add(new TaskSleep(town.town_id, 'luxurious_apartment'));

            await GameMap.AjaxAsync.wait(10000);
            let regenSet = GameMap.TWDS.genCalc({regen:1}, {});
            await Beans.equipSet(regenSet);

            Beans.setState(Beans.states.sleep)
        },

        goWork: async function() {
            // let toActivate = ["tryEat", "setJobs"];
            // toActivate.forEach(action => { Beans.enableSetting(action); });
            // Beans.saveSettings();
            if (!Beans.isRunning) Beans.run();            
        },

        cancelJobs: async function () {
            if (TaskQueue.queue.length == 0)  return;

            let endTaskMs = task().getEndDate() - Date.now();
            let length = TaskQueue.queue.length;
            if (length > 1 && endTaskMs < 1500) await GameMap.AjaxAsync.wait(3000);
            else if (length == 1 && endTaskMs < 1500) await GameMap.AjaxAsync.wait(7000);
            TaskQueue.cancelAll();
            await Beans.waitJobsAsync();            
        },

        waitJobsAsync: async function() {
            while (hasTask()) await new Promise(resolve => setTimeout(resolve, 200));
        },

        defend: async function() {
            if (Character.isDuelProtected() 
                || !Character.homeTown 
                || (hasTask() && task().type == 'sleep')) 
                    return;

            let response = await GameMap.AjaxAsync.remoteCall('duel', 'search_op', {});
            let isDanger = false;
            let players = response.oplist.pclist;
            let dangerPlayer;
            for (let i = 0; i < players.length; i++) {
                if (Beans.whiteList[players[i].player_name]) continue;

                if (players[i].class == 'duelist') {
                    isDanger = true;
                    dangerPlayer = players[i].player_name;
                    break;
                }

                if (players[i].dx == 0 && players[i].dy == 0) {
                    isDanger = true;
                    dangerPlayer = players[i].player_name;
                    break;
                }
            }

            if (isDanger && Beans.settings.state != Beans.states.defend) {
                Beans.settings.workingSet = Object.values(Wear.wear).map(w => w.obj.item_id);
                Beans.setState(Beans.states.defend);
                if (Beans.isMain) 
                    Beans.sendTgNotification(`${dangerPlayer} задумал недоброе. ${Character.name} переходит в оборонительную стойку`);
                await Beans.equipNamedSet('дуэль деф', {punch:0,tough:1,health:1,reflex:1,dodge:12,aim:9,shot:3,appearance:0,tactic:12,type:'duel',range:1});
            } 
            
            if (!isDanger && Beans.settings.state == Beans.states.defend) {
                await Beans.returnToWork();
            }
        },

        returnToWork: async function() {
            if (Beans.settings.workingSet) {
                Beans.equipSet(Beans.settings.workingSet);
            }
            Beans.setState(Beans.states.working);
            if (Beans.isMain) 
                Beans.sendTgNotification(`${Character.name} возвращается к работе`);
            await Beans.setJobs();
        },

        getEquipSets: async function (cached = true) {
            try {
                if (cached && Beans.sets) {
                    return Beans.sets;
                }
                Beans.sets = (await GameMap.AjaxAsync.remoteCallMode('inventory', 'show_equip', {})).data;
                return Beans.sets;
            } catch (error) {
                console.error('Ошибка получения списка сетов:', error);
                return [];
            }
        },

        findCurrentSet: async function () {
            let currentSet = Object.values(Wear.wear).map(w => w.obj.item_id);
            return Beans.findSet(currentSet);
        },

        findSet: async function(currentSet) {
            const equipSets = await Beans.getEquipSets();
            currentSet = currentSet.sort((a, b) => a - b);
            
            for (let set of equipSets) {
                let setItems = ['head', 'neck', 'body', 'right_arm', 'left_arm', 'animal', 'pants', 'belt', 'yield', 'foot']
                    .map(slot => set[slot])
                    .filter(item => item !== null)
                    .sort((a, b) => a - b);
                
                if (currentSet.length === setItems.length && 
                    currentSet.every((item, index) => item === setItems[index])) {
                    return { found: true, setName: set.name };
                }
            }
            return { found: false };
        },

        equipNamedSet: async function (setName, skills, data) {
            let set = (await Beans.getEquipSets(false)).filter(s => s.name == setName);
            await GameMap.AjaxAsync.wait(Beans.getRandMs(0.5, 3));
            if (set.length == 0) {
                console.warn(`${setName} set not found`);
                if (Beans.TWDSCondition() && skills) {
                    let calcSet = GameMap.TWDS.genCalc(skills, data || {}) || [];

                    let invItems = Bag.getItemsByItemIds(calcSet),
                    bestItems = [], i, invItem, wearItem;
                    for (i = 0; i < invItems.length; i++) {
                        invItem = invItems[i];
                        wearItem = Wear.get(invItem.getType());
                        if (!wearItem || (wearItem && (wearItem.getItemBaseId() !== invItem.getItemBaseId() || wearItem.getItemLevel() < invItem.getItemLevel()))) {
                            bestItems.push(invItem.obj.item_id);
                        }
                    }

                    await Beans.equipSet(bestItems);
                    return true;
                }
                return false;
            }
            EquipManager.switchEquip(set[0].equip_manager_id);
            await Beans.waitEquip(Beans.getSetItemArray(set[0]));
            return true;
        },

        fort: async function () {
            let timeToBattle = Beans.getCurrentBattleTimer();
            if (timeToBattle > 600 || timeToBattle < 0) return;

            if (!at(Beans.battle.x, Beans.battle.y) && hasTask() && task().x != Beans.battle.x && task().y != Beans.battle.y) 
                await Beans.cancelJobs();
            let currentFort = (await GameMap.AjaxAsync.remoteCallMode("fort", "display", {
                x: Beans.battle.x,
                y: Beans.battle.y,
            })).data;
            
            if (Character.position.x != Beans.battle.x || Character.position.y != Beans.battle.y) {
                await Beans.equipSpeedSet();
                Guidepost.start_walk(Beans.battle.fortId, 'fort');
            }

            await GameMap.AjaxAsync.wait(7000);
            let eq = Beans.equipNamedSet;
            let equipped = Beans.battle.defense ? await eq('защита') || await eq('деф')  || await eq('ливен') || await eq('ливенворт') || await eq('форт деф') || await eq('лэнг')
                                                : await eq('атака') || await eq('гроза') || await eq('форт атака') || await eq('соуза');
            equipped = equipped || await eq('форт') || await eq('fort') || await eq('стрелок') || await eq('гроза');
            if (!equipped) {
                Beans.sendTgNotification(`${Character.name}: нет сета для форта (атака/защита/деф/форт/fort)`);
                return;
            }

            while (Date.now() < Character.cooldown * 1000) await GameMap.AjaxAsync.wait(3000);

            let isTank = Character.maxHealth > 9000;
            let buff, isPremUsed = false;

            
            if (Beans.settings.fortBuff) {
                if (!Premium.hasBonus('character')) {
                    buff = Bag.getItemByItemId(this.buff.characterPrem);
                    if (buff == null || buff.obj == null) 
                        Beans.sendTgNotification(`${Character.name}: нет фортового према и медалей`);
                    else {
                        await Beans.drink(buff.obj.item_id);
                        isPremUsed = true;
                    }
                }
                if (isTank) {
                    buff = Bag.getItemByItemId(this.buff.fortMedicine);
                    if (buff == null || buff.obj == null) 
                        Beans.sendTgNotification(`${Character.name}: нет лекарства`);
                    else if (Character.health/Character.maxHealth < 0.9)
                        await Beans.drink(buff.obj.item_id);
                    buff = Bag.getItemByItemId(this.buff.mine);
                    if (buff == null || buff.obj == null) 
                        Beans.sendTgNotification(`${Character.name}: нет мин`);
                    else if (!BuffList.items) 
                        await Beans.drink(buff.obj.item_id);
                } else {
                    buff = Bag.getItemByItemId(this.buff.saddle);
                    if (buff == null || buff.obj == null) 
                        Beans.sendTgNotification(`${Character.name}: нет седел`);
                    else if (!BuffList.character)
                        await Beans.drink(buff.obj.item_id);
                    buff = Bag.getItemByItemId(this.buff.vizier);
                    if (buff == null || buff.obj == null) 
                        Beans.sendTgNotification(`${Character.name}: нет визиров`);
                    else if (!BuffList.items)
                        await Beans.drink(buff.obj.item_id);
                }
            }

            if (isPremUsed) {
                location.reload();
            }

            if (currentFort.ismember) { 
                TaskQueue.add(new TaskFortSleep(Beans.battle.fortId, Beans.battle.x, Beans.battle.y));
            }

            if (Beans.isRunning) Beans.run(); // off

            if (Beans.hasSetting('fortOnline') && !Beans.hasSetting('alwaysOffline')) west.notification.fortBattle.openFort(Beans.battle.fortId);
        },

        getCurrentBattleTimer: function () {
            if (!Beans.battle) {
                return 1000000;
            }
            const timeUntilBattle = Math.floor((Beans.battle.start + Game.clientTimedrift - new Date().getTime()) / 1000);
            return Math.min(timeUntilBattle, 1000000);
        },
        updateFortBattle:  function () {
            const battleRooms = Beans.getBattleRooms();
            const activeBattles = battleRooms.filter(room => !room.battleData.isFinished);
            
            if (activeBattles.length == 0) {
                Beans.battle = null;
                return;
            }

            const nearestBattle = activeBattles.reduce((nearest, current) => {
            return !nearest || current.battleData.start < nearest.battleData.start ? current : nearest;
            });
            
            Beans.battle = {
                title: nearestBattle.title,
                fortId: nearestBattle.fortId,
                ...nearestBattle.battleData
            };

            if (Beans.getCurrentBattleTimer() < 0) west.notification.fortBattle.openFort(Beans.battle.fortId);

        },
        getBattleRooms: function () {
            const allRooms = Chat.Resource.Manager.getRooms();
            const battleRooms = [];
            for (let roomId in allRooms) {
                const room = allRooms[roomId];
                if (room instanceof Chat.Resource.RoomFortBattle) {
                    battleRooms.push(room);
                }
            }
            battleRooms.sort((roomA, roomB) => roomA.battleData.start - roomB.battleData.start);
            return battleRooms;
        },
        onBattleEnd: function (fortId) {
            if (fortId != Beans.battle.fortId) return false;
            if (!Beans.hasSetting("fort")) return false;

            function closeBattleWindows() {
                const cemeteryClose = document.querySelector(".cemetery .tw2gui_window_buttons_close");
                const fortBattleSelector = ".fortbattle-" + Beans.battle.fortId + " .tw2gui_window_buttons_close";
                const fortBattleClose = document.querySelector(fortBattleSelector);
                if (fortBattleClose) {
                  fortBattleClose.click();
                }
                if (cemeteryClose) {
                  cemeteryClose.click();
                }
            }
            setTimeout(async function () {
                if (!atHome()) await Beans.cancelJobs();
                Beans.updateFortBattle();
                Beans.goWork(); 
            }, 5000);
            closeBattleWindows();
        },
        fortRegistration: async function () {
            await GameMap.AjaxAsync.wait(Beans.getRandMs(50, 270));
            await GameMap.AutoFortRegistration.init(Beans.settings.registerFortAttack);
        },
        getRandMs: function(min, max) {
            const minMs = min * 1000;
            const maxMs = max * 1000;
            const rand = Math.round(Math.random() * (maxMs - minMs)) + minMs;
    
            return rand;
        },

        getJobInfo: async function(jobId, x, y) {
            const job = await GameMap.AjaxAsync.remoteCallMode("job", "job", { jobId: jobId, x, y });
            return job;
        },

        onMotivationChanged: function(data) {
            if (!data) return; // get undefined when motivation increased
            if (Beans.farmJob.id != data.job.id) return;
            Beans.farmJob.motivation = Beans.farmJob.motivation - Beans.motivationByDurationMap[data.duration];
        },

        startFarm: async function() {
            if (TaskQueue.queue.length === 0 || lastTask().type != 'job') {
                new UserMessage("Поставь нужную работу в шмоте на бонус", UserMessage.TYPE_HINT).show();
                return;
            }

            let task = lastTask().data;
            let job = await Beans.getJobInfo(task.job.id, task.x, task.y);
            let TOset = Beans.getBestGear(task.job.id).sort((a, b) => a - b);

            Beans.farmJob = {
                id: task.job.id,
                groupid: task.job.groupid,
                x: task.x,
                y: task.y,
                motivation: job.motivation * 100,
                TOset: TOset,
                namedTOSet: (await Beans.findSet(TOset)).setName,
                workingSet: Object.values(Wear.wear).map(w => w.obj.item_id).sort((a, b) => a - b),
                namedWorkingSet: (await Beans.findCurrentSet()).setName,
            };

            EventHandler.listen("jobmotivation_change", Beans.onMotivationChanged);
            EventHandler.listen("item_used", Beans.increaseMotivation);

            await Beans.cancelJobs();
        },
        
        stopFarm: function() {
            Beans.farmJob = null;
            EventHandler.unlisten("jobmotivation_change", Beans.onMotivationChanged);
            EventHandler.unlisten("item_used", Beans.increaseMotivation);
        },
        
        farm15sec: async function() {
            if (!navigator.onLine) return;
            if (!Beans.farmJob) await Beans.startFarm();
            await Beans.drink15sec();
            if (getMissedHealth() > 88) {
                return;
            } 
            let job = Beans.farmJob;
            if (!at(job.x, job.y)) {
                await Beans.walkToJob(job.groupid, job.x, job.y);
                await GameMap.AjaxAsync.WaitJobsAsync();
            } 
            if (Beans.hasSetting('equipBest') && hasTask()) return;
            
            let currentMaxTasks = Beans.maxJobs - TaskQueue.queue.length;
            let maxByMotivation = Math.max(job.motivation - 75 - TaskQueue.queue.length, 0);
            let jobsCount = Math.min(currentMaxTasks, maxByMotivation, Character.energy); 
            if (jobsCount == 0) return;

            var tasks = [];
            for (var i = 0; i < jobsCount; i++) {
                tasks.push(new TaskJob(job.id, job.x, job.y, 15));
            }
            
            if (Beans.hasSetting('equipBest')) {
                await Beans.equipTOset();
                await GameMap.AjaxAsync.wait(Beans.getRandMs(1.2, 3.5));
            }

            TaskQueue.add(tasks);            
            if (Beans.hasSetting('equipBest')) {
                await GameMap.AjaxAsync.wait(Beans.getRandMs(1.2, 3.5));
            }
            await Beans.equipFarmingSet();
            
            try {
                executeWithProbability(0.1, Beans.getJobInfo);
                executeWithProbability(0.1, function() { MessagesWindow.open('report') });
                executeWithProbability(0.02, RankingWindow.open);
                executeWithProbability(0.03, MarketWindow.open);
                if (hasTown()) executeWithProbability(0.04, function() { TownWindow.open(Character.homeTown.town_id) } );
            } catch{}
        },

        alreadyEquipped: function(sortedSet) {
            let weared = Object.values(Wear.wear).map(w => w.obj.item_id).sort((a, b) => a - b);
            return sortedSet.length === weared.length && sortedSet.every((item, index) => item === weared[index]);
        },

        equipFarmingSet: async function() {
            if (Beans.alreadyEquipped(Beans.farmJob.workingSet)) return;
            if (Beans.farmJob.namedWorkingSet && (await Beans.equipNamedSet(Beans.farmJob.namedWorkingSet))) return;
            await Beans.equipSet(Beans.farmJob.workingSet);
        },

        equipTOset: async function() {
            if (Beans.farmJob.namedTOSet && (await Beans.equipNamedSet(Beans.farmJob.namedTOSet))) return;
            await Beans.equipSet(Beans.farmJob.TOset);
        },

        drink15sec: async function() {
            if (Date.now() < Character.cooldown * 1000 || !Beans.farmJob) return;

            const missedEnergyPercents = getMissedEnergy();
            const missedHealthPercents = getMissedHealth();
            
            console.log(`[Drink] Energy: ${100 - missedEnergyPercents}% (missing ${missedEnergyPercents}%)`);
            console.log(`[Drink] Health: ${100 - missedHealthPercents}% (missing ${missedHealthPercents}%)`);
            console.log(`[Drink] Motivation: ${Beans.farmJob.motivation}%`);
            
            const buffConditions = [
                {
                    name: 'Full Recovery',
                    condition: () => missedEnergyPercents > 80 && missedHealthPercents > 80,
                    items: () => [...Beans.buff.fullRecoverBuff],
                },
                {
                    name: 'Health Recovery',
                    condition: () => missedHealthPercents > 80,
                    items: () => [Beans.buff.bottlePlug],
                },
                {
                    name: 'Full Energy',
                    condition: () => missedEnergyPercents > 95,
                    items: () => [...Beans.buff.fullEnergyBuff],
                },
                {
                    name: 'Cake Decorations',
                    condition: () => Beans.farmJob.motivation < 76 && missedEnergyPercents > 25,
                    items: () => [Beans.buff.cakeDecorations],
                },
                {
                    name: 'Motivation Buffs',
                    condition: () => Beans.farmJob.motivation < 76,
                    items: () => [Beans.buff.sweetBase, Beans.buff.soapWater25, Beans.buff.tobacco25],
                },
                {
                    name: 'Guarana',
                    condition: () => missedEnergyPercents > 50,
                    items: () => [Beans.buff.guarana],
                }
            ];
            
            for (const buffConfig of buffConditions) {
                if (!buffConfig.condition()) continue;
                
                console.log(`[Drink] Checking ${buffConfig.name}...`);
                
                const items = buffConfig.items();
                const foundItem = Beans.findFirstAvailableItem(...items);
                    
                if (!foundItem) {
                    console.log(`[Drink] ${buffConfig.name}: No items found`);
                    continue;
                }
                
                const buffId = foundItem?.obj?.item_id;
                    
                if (!buffId) {
                    console.log(`[Drink] ${buffConfig.name}: Item found but no buff ID`);
                    continue;
                }

                console.log(`[Drink] Using ${buffConfig.name} (ID: ${buffId})`);
                
                if (await Beans.drink(buffId)) {
                    console.log(`[Drink] Successfully used ${buffConfig.name}`);
                    return;
                } else {
                    console.log(`[Drink] Failed to use ${buffConfig.name}`);
                }
            }
            
            console.log('[Drink] No suitable buffs found or used');
        },

        fair: async function() {
            await GameMap.AjaxAsync.wait(Beans.getRandMs(50, 270));
            let container = document.querySelector('#ui_notibar div:nth-child(1) > div:nth-child(3)');
            let element = container?.querySelector('.image.fairwof')?.parentElement;
            const freeLabel = element?.querySelector('span')?.textContent;
            if (freeLabel != "free") return; 
            const games = ['horse_race','shell_game','wheel_of_fortune','choose_card_game']
            let count = document.querySelectorAll('.first-purchase').length == 0 ? 2 : 1;

            for (let i = 0; i < count; i++) {
                let response = await GameMap.AjaxAsync.remoteCallMode('wheeloffortune', 'init', { wofid: 1 });
                await GameMap.AjaxAsync.wait(Beans.getRandMs(1, 7));
                
                response = await GameMap.AjaxAsync.remoteCall('wheeloffortune', 'gamble', {
                    payid: 0,
                    action: 'main',
                    wofid: 1,
                    gametype: games[Math.floor(Math.random() * games.length)],
                    cardid: Math.floor(Math.random() * 5),
                });
                EventHandler.signal('inventory_changed'); 
                if (response.picked && response.picked[1] > 1) {
                    Beans.sendTgNotification(`[${Game.worldName}] ${Character.name} залутал ${ItemManager.get(response.picked[0]).name}!`);
                }
            }

            element.querySelectorAll('.free').forEach(el => el.remove());
        },

        doQuests: async function() {
            await GameMap.AjaxAsync.wait(Beans.getRandMs(50, 270));

            await GameMap.AjaxAsync.remoteCallMode('building_quest')
            await GameMap.AjaxAsync.wait(Beans.getRandMs(1, 15));

            const questsToExclude = [
                'Простое дело',
                'Обычное дело'
            ];

            const questsToApply = [
                'Афиша',
                'Фортовая битва',
                'Выиграть битву',
            ];
            let acceptQuest = async function(questId) {
                console.log(`applying quest ${questId}`)
                await GameMap.AjaxAsync.wait(Beans.getRandMs(1, 4));
                await GameMap.AjaxAsync.remoteCall('quest', 'accept_quest', {quest_id: questId.toString()});
                EventHandler.signal('questemployer_changed', ['accepted', questId]);
                await GameMap.AjaxAsync.remoteCallMode('building_quest');
            }
            let finishQuest = async function(questId) {
                console.log(`finishing quest ${questId}`)
                await GameMap.AjaxAsync.wait(Beans.getRandMs(1, 4));
                await GameMap.AjaxAsync.remoteCall('quest', 'finish_quest', {quest_id: questId.toString()});
                EventHandler.signal('questemployer_changed', ['finished', questId]);
                EventHandler.signal('inventory_changed');
                await GameMap.AjaxAsync.remoteCallMode('building_quest');
                return (await GameMap.AjaxAsync.remoteCallMode('quest_employer', null, {employer: "paper"})).employer.open;
            }
            let quests = (await GameMap.AjaxAsync.remoteCallMode('quest_employer', null, {employer: "paper"})).employer.open;
            let finishableQuests = quests.filter(quest => quest.finishable === true);

            for (let quest of finishableQuests) quests = await finishQuest(quest.id);

            let questsToAccept = quests.filter(quest => 
                questsToApply.includes(quest.soloTitle) && 
                quest.accepted === false
            );
            
            for (let quest of questsToAccept) await acceptQuest(quest.id);

            let availableQuests = quests.filter(quest => 
                quest.requirements.every(req => req.solved) && 
                !questsToExclude.includes(quest.soloTitle)
            );

            for (let quest of availableQuests) {
                await acceptQuest(quest.id);
                quests = await finishQuest(quest.id);
            }
        },
};

setInterval(function() {
    var sessao = $('.tw2gui_dialog .tw2gui_dialog_text').text().slice(-15);

    if (sessao == "Сеанс завершён.") {
        let world = Game.gameURL.replace(/\D/g, '');
        window.location.replace(`/#loginWorld${world}`);
        Beans.sendTgNotification(`[${Game.worldName}] ${Character.name}: неожиданное завершение сессии`);
    }
}, 300000);

if (window.GameMap) {
    Map = GameMap;
    GameMap.Beans = Beans;
    Config.set("classchoose.seen", true);
    Premium.checkForEnergyPremium = function() {}
    Premium.checkForAutomationPremium = function(callback, failCallback) {if (typeof failCallback !== 'undefined') return failCallback();}
}

if (window.GrafanaFaroWebSdk && window.GrafanaFaroWebSdk.faro) {
    window.GrafanaFaroWebSdk.faro.pause();
    XMLHttpRequest.prototype.send = XMLHttpRequest.prototype.send.__original;
    fetch = fetch.__original;
    console.log('Faro data collection disabled');
}

Beans.functionsToRepeat = [
    { name: "tryEat", min: 6, max: 15, condition: Beans.trueCondition, allowBeforeFort: false, description: "Подбухивать" },
    { name: "tryUseBag", min: 1, max: 10, condition: Beans.trueCondition, allowBeforeFort: true, description: "Открывать мешок",
        hint: "Раз в 1-10 минут пытается открыть ивентовый мешок и мешок с самородками"
     },
    { name: "setJobs", min: 5, max: 10, condition: Beans.trueCondition, allowBeforeFort: false, description: "Повторять работу", isDynamic: true,
        hint: "Повторяет последнюю работу (работа 10 мин или час; любая стройка)"
     },
    { name: "build", min: 7, max: 15, condition: hasTown, allowBeforeFort: false, description: "Строить церковь", noDefault: true, isDynamic: true,
        hint: "Строит церковь. В ивент по 15 минут, остальное время по часу"
     },
    { name: 'farm15sec', min: 0.145, max: 0.275, condition: Beans.trueCondition, allowBeforeFort: false, description: "Фарм 15 сек", noDefault: true, isDynamic: true,
        hint: 'Фармит одну работу по 15 сек. Ест украшения для тортов/пробки/табак/мыло/основу/гуарану/бафы на +100%'
     },
    // { name: "drink15sec", min: 1, max: 2, condition: Beans.settingsCondition('farm15sec'), allowBeforeFort: false, description: "Подбухивать 15 сек" },
    { name: "doEvent", min: 1, max: 10, condition: Beans.eventCondition, allowBeforeFort: true, description: "Делать ивент" },
    // { name: "runAway", min: 5, max: 7, condition: Beans.TWDSAndTownCondition, description: "Побег" },
    // { name: "defend", min: 6, max: 10, condition: Beans.TWDSAndTownCondition, description: "Защищаться" },
    { name: "logout", min: 240, max: 480, condition: Beans.trueCondition, notRunOnStart: true, allowBeforeFort: false, description: "Автовыход",
        hint: "Перезаходит в игру каждые 4-8 часов"
     },
    { name: "sleep", min: 1, max: 10, condition: Beans.trueCondition, allowBeforeFort: false, description: "Спать", 
        hint: "Идет спать если осталось меньше 12 энергии и нет работ"
     },
    { name: "sendEventCurrency", min: 10, max: 30, condition: Beans.eventCondition, allowBeforeFort: true, description: "Отправлять друзьям" },
    { name: 'churchMotivation', min: 30, max: 90, condition: Beans.oneOfsettingsCondition('setJobs', 'build'), allowBeforeFort: false, description: "Мотива на церковь",
        hint: "Раз в 0.5-2 часа смотрит на мотиву и подбухивает ивентовые бафы на 15%/помидоры/мыльную воду/сладкую основу/жевательный табак"
     },
    { name: "fort", min: 3, max: 5, condition: Beans.trueCondition, allowBeforeFort: true, description: "Фортить",
        hint: "Идет на форт за 10 минут до начала"
     },
    { name: "fortRegistration", min: 5, max: 7, condition: Beans.settingsCondition('fort'), allowBeforeFort: true, oneShot: true, description: "Регаться на форт", noDefault: true },
    { name: "fair", min: 5, max: 7, condition: Beans.trueCondition, allowBeforeFort: true, oneShot: true, description: "Ярмарка" },
    { name: "doQuests", min: 5, max: 7, condition: Beans.trueCondition, allowBeforeFort: true, oneShot: true, description: "Делать квесты", noDefault: true,
        hint: "Сдает все доступные ресурсы по квестам на доске, берет квесты на форты и афишу" },
    // { name: "craft", min: 5, max: 7, condition: Beans.trueCondition, allowBeforeFort: true, oneShot: true, description: "Крафт", noDefault: true },
];

Beans.additionalSettings = [
    { name: 'registerFortAttack', description: 'Регаться в атаку', defaultValue: false, condition: Beans.allSettingsCondition('fort', 'fortRegistration'),
        hint: 'Записывается приоритетно в атаку, если выключено - в защиту'
     },
     { name: 'fortOnline', description: 'Онлайн на форте', defaultValue: true, condition: Beans.settingsCondition('fort'),
        hint: 'Открывать окно боя перед началом сражения'
     },
     { name: 'fortBuff', description: 'Бафаться на форт', defaultValue: true, condition: Beans.settingsCondition('fort'),
         hint: 'Танки - мина и лекарство, ручники - визир и седло. Медаль "персонаж", если нет према'
      },
    { name: 'fortBuffSpam', description: 'Баф только в прайм', defaultValue: true, condition: Beans.settingsCondition('fortBuff'),
        hint: 'Бафается только с 21:01 по 23:00'
     },
    { name: 'autorun', description: 'Автозапуск', defaultValue: true, condition: Beans.trueCondition,
        hint: 'Стартует бобы при входе в игру, если они были включены при выходе'
     },
    { name: 'play9k', description: 'Играть за 9к', defaultValue: true, condition: Beans.eventCondition,
        hint: 'Для DoD с этой настройкой пропускает шапки и галстуки' },
    { name: 'play25', description: 'Играть за 1.5к', defaultValue: true, condition: Beans.eventCondition,
        hint: 'Сокращает полные часы категорий, в которых играет, если валюты достаточно для полного круга'
     },
    { name: 'reduce', description: 'Сокращать время', defaultValue: false, condition: Beans.eventCondition,
        hint: 'Сокращает полные часы категорий, в которых играет, если валюты достаточно для полного круга'
     },
     { name: 'overRegeneration', description: 'Оверреген', defaultValue: false, condition: Beans.settingsCondition('tryEat'),
        hint: 'Ест бобы даже когда задана полная очередь работ'
    },
    { name: 'equipBest', description: 'Переодеваться', defaultValue: true, condition: Beans.oneOfsettingsCondition('setJobs', 'farm15sec'),
        hint: 'Одевается в ТО перед тем как поставить работу'
    },
    { name: "cinema", description: "Кино", defaultValue: true, condition: hasTown,
        hint: 'Восстанавливает мотиву на церковь в кинотеатре'
    },
    { name: 'minimalRegeneration', description: 'Мин реген', defaultValue: false, condition: Beans.settingsCondition('sleep'),
        hint: 'Прерывает сон как только есть 12 энергии'
    },
    { name: 'commonChat', description: 'Общий чат', defaultValue: false, condition: Beans.trueCondition,
        hint: 'Доступ в запароленный чат бобов'
    },
    { name: 'quitChat', description: 'Выходить из чатов', defaultValue: true, condition: Beans.trueCondition,
        hint: 'Выходит из всех чатов, кроме фортовых'
    },
    { name: 'monitoring', description: 'Мониторинг', defaultValue: true, condition: Beans.trueCondition,
        hint: 'Отсылать метрики в прометеус'
     },
     { name: 'alwaysOffline', description: 'Оффлайн', defaultValue: false, condition: Beans.trueCondition,
        hint: 'Делает себя оффлайн в списке друзей, могут быть баги с обработкой событий веста'
     },
];

///////////// metrics ///////////
let getItemStat = function(itemId) {
    let item = Bag.getItemByItemId(itemId);
    if (!item) return `{buff="${ItemManager.get(itemId).name}"} 0`;
    return `{buff="${item.obj.name}"} ${item.count}`;
};

let getMetrics = function() {
    return `# TYPE experience counter
experience ${Character.experience}
# TYPE fingerprint gauge
fingerprint {fingerprint="${fingerprint}"} 1
# TYPE duel_motivation gauge
duel_motivation ${Character.duelMotivation}
# TYPE beans_version gauge
beans_version {version="${SCRIPT_VERSION}"} 1
# TYPE energy gauge
energy ${Character.energy}
# TYPE health gauge
health ${Character.health}
# TYPE is_tank gauge
is_tank ${Character.maxHealth > 9000 ? 1 : 0}
# TYPE battle_registred gauge
battle_registred ${!Beans.battle ? 0 : 1}
# TYPE beans_is_running gauge
beans_is_running ${!Beans.isRunning ? 0 : 1}
# TYPE bonds gauge
bonds ${Character.upb}
# TYPE money gauge
money ${Character.money}
# TYPE duels_win_count counter
duels_win_count ${Character.duelWins}
# TYPE duels_lost_count gauge
duels_lost_count ${Character.duelLosts}
# TYPE duels_protection gauge
duels_protection ${(Character.isDuelProtected() || !Character.homeTown) ? 1 : 0}
# TYPE npc_duels_difficult gauge
npc_duels_difficult ${Character.npcDifficult ?? 0}
# TYPE task_queue_count gauge
task_queue_count ${TaskQueue?.queue?.length ?? 0}
# TYPE buffs gauge
buffs${getItemStat(Beans.buff.beans)}
buffs${getItemStat(Beans.buff.cakes)}
buffs${getItemStat(Beans.buff.bags)}
buffs${getItemStat(Beans.buff.coffee)}
buffs${getItemStat(Beans.buff.tea)}
buffs${getItemStat(Beans.buff.guarana)}
buffs${getItemStat(Beans.buff.bottlePlug)}
buffs${getItemStat(Beans.buff.topper)}
buffs${getItemStat(Beans.buff.fruitJuice)}
buffs${getItemStat(Beans.buff.cakeDecorations)}
buffs${getItemStat(Beans.buff.sweetBase)}
buffs${getItemStat(Beans.buff.fortMedicine)}
buffs${getItemStat(Beans.buff.saddle)}
buffs${getItemStat(Beans.buff.vizier)}
buffs${getItemStat(Beans.buff.mine)}
`;
};

let basicAuth =  `Basic ${btoa("user:Biph[oseften5")}`
let url;
let fingerprint;
let setMirror = function() {
    url = `https://pushgateway-mirror.cthaeh.ru:8443/metrics/job/the-west/world/${Game.worldName}/player/${Character.name}`
};
let pushGateway = function() {
    fetch(url, {method:'POST',
        headers: {
            'Authorization': basicAuth,
            'Content-Type': 'text/plain'
        },
        body: getMetrics()
        }).catch(e => {
            setMirror();
        })
};

    $(document).ready(function () {
        try {
            if (location.href.includes('index.php?page=logout')) {
                location.href = '/';
                return;
              } 
            if (location.hash.includes('loginWorld')) {
                setTimeout(function () {
                    $('#loginButton').click();
                    let val = setInterval(function () {
                      let u = Worlds.playerWorlds;
                      if (Object.keys(u).length !== 0) {
                        clearInterval(val);
                        Auth.login(u[parseFloat(location.hash.replace(/\D/g, ''))]);
                      }
                    }, 500);
                  }, 1000);
                return;
            }

            Beans.maxJobs = Premium.hasBonus('automation') ? Beans.maxJobs = 9 : Beans.maxJobs = 4;
            let events = Game.sesData && Object.keys(Game.sesData);
            if (events && events.length > 0) {
                Beans.currentEvent = events[0];
                Beans.eventCooldown = Game.sesData[Beans.currentEvent].friendsbar.cooldown * 1000;
            }

            if (typeof TWDS != 'undefined') GameMap.TWDS = TWDS;
            
            Beans.loadSettings();
            EventHandler.listen("chat_init", async function () {
                await GameMap.AjaxAsync.wait(1000);
                if (Beans.settings.quitChat) {
                    for (const r in Chat.MyClient.rooms) {
                        if (r.startsWith('room_fortbattle')) continue;
                        if (Chat.MyClient.rooms[r])
                            Chat.Request.SetOnlineState(r, false)
                    }
                }
                if (Beans.settings.commonChat) Chat.Request.JoinCustom('beans (WamKeljuc;orc1)');
            });

            if (Beans.hasSetting('fort')) {
                EventHandler.listen("fort_battle_joined", Beans.updateFortBattle);
                EventHandler.listen("fort_battle_end", Beans.onBattleEnd);
            }

            Beans.createMenuIcon();

            if (Beans.hasSetting('monitoring')) {
                var options = {
                    excludeDoNotTrack: true,
                    excludeUserAgent: true,
                    excludeHasLiedOs: true,
                    excludePlugins: true
                };
                new Fingerprint2(options).get(function(fp) { 
                    fingerprint = fp;
                    url = `https://pushgateway.cthaeh.ru/metrics/job/the-west/world/${Game.worldName}/player/${Character.name}`
                });
                setInterval(pushGateway, 30000);
            };

            if (Beans.settings.isRunning) setTimeout(function() {
                let bonusBtns = document.getElementsByClassName('collect-btn');
                
                if (Beans.hasSetting('alwaysOffline')) Chat.Router.disconnect();
                if (bonusBtns.length > 0) bonusBtns[0].click();
                if (!Beans.isRunning && Beans.settings.autorun) Beans.run();
            }, 20000);

        } catch (e) {
        }
    });

    GameMap.AjaxAsync = function() {
        jQuery.ajaxSetup({
            type: 'POST',
            dataType: 'json'
        });
        var makeUrl = function(options) {
            var url = 'game.php'
              , params = [];
            if (options.window)
                params.push('window=' + options.window);
            if (options.action)
                params.push('action=' + options.action, 'h=' + Player.h);
            if (options.ajax)
                params.push('ajax=' + options.ajax);
            if (options.mode)
                params.push('mode=' + options.mode);
            return url + params.length ? '?' + params.join('&') : '';
        };
        var onFinish = function(window) {
            return function() {
                if (window && window.hideLoader)
                    window.hideLoader();
                else if (window && window.hasOwnProperty('window'))
                    window.window.hideLoader();
            };
        };
        var request = async function(options) {
            var url = options.url || makeUrl(options);
            return await jQuery.ajax(url, options);
        };
        var defaultRequest = async function(options, window) {
            if (window && window.showLoader)
                window.showLoader();
            else if (window && window.hasOwnProperty('window'))
                window.window.showLoader();
            var result = await request(options);
            onFinish(window)();
            return result;
        };
        return {
            remoteCall: async function(window, action, param, view) {
                return await defaultRequest({
                    window: window,
                    action: action,
                    data: param
                }, view);
            },
            remoteCallMode: async function(window, mode, param, view) {
                return await defaultRequest({
                    window: window,
                    mode: mode,
                    data: param
                }, view);
            },
            get: async function(window, ajax, param, view) {
                return await defaultRequest({
                    window: window,
                    ajax: ajax,
                    data: param
                }, view);
            },
            gameServiceRequest: async function(method, urlparam, post) {
                return await defaultRequest({
                    url: Game.serviceURL + '/' + method + '/' + urlparam,
                    data: post
                });
            },
            request: request,
            wait: function (ms) {
                return new Promise(resolve => setTimeout(resolve, ms));
            },
            WaitJobsAsync: async function () {
                do {
                    await GameMap.AjaxAsync.wait(400);
                } while (hasTask());
            },
        
        }
    }();

})();




