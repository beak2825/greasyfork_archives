// ==UserScript==
// @name         Trimps tools
// @namespace    trimps.github.io
// @version      1.282
// @description  Trimps tools (visual)
// @author       Anton
// @match        https://trimps.github.io
// @require      http://ajax.googleapis.com/ajax/libs/jquery/1.9.1/jquery.min.js
// @downloadURL https://update.greasyfork.org/scripts/28062/Trimps%20tools.user.js
// @updateURL https://update.greasyfork.org/scripts/28062/Trimps%20tools.meta.js
// ==/UserScript==

(function () {
    'use strict';

    var $ = jQuery;

    var _GameHelpers = {
        getBotVersion: function() {
            return typeof GM_info === 'function' ? GM_info().script.version :
                (typeof GM_info === 'object' ? GM_info.script.version : '?');
        },
        isPortal: function () {
            return portalWindowOpen;
        },
        getJobPrice: function (jobName, resource) {
            return game.jobs[jobName].cost[resource][0] * Math.pow(game.jobs[jobName].cost[resource][1], game.jobs[jobName].owned);
        },
        hasFormation: function(what) {
            what = parseInt(what);
            if (!game.global.preMapsActive && !game.global.lockTooltip) {
                if (game.upgrades.Formations.done && what === 0) return true;
                if (game.upgrades.Formations.done && what === 1) return true;
                if (game.upgrades.Dominance.done && what === 2) return true;
                if (game.upgrades.Barrier.done && what === 3) return true;
                if (game.upgrades.Formations.done && game.global.highestLevelCleared >= 180 && what === 4) return true;
            }
            return false;
        },
        getCurrentEnemyAttack: function() {
            var cellNum, cell;
            if (game.global.mapsActive) {
                cellNum = game.global.lastClearedMapCell + 1;
                cell = game.global.mapGridArray[cellNum];
            } else {
                cellNum = game.global.lastClearedCell + 1;
                cell = game.global.gridArray[cellNum];
            }
            return calculateDamage(cell.attack, false, false, false, cell);
        },
        getBreedingBaseSpeed: function () {
            if (game.global.challengeActive === "Trapper") return 0;
            var base = 0.0085;
            var currentCalc = _GameHelpers.getBreedingCount() * base;
            if (game.upgrades.Potency.done > 0) {
                currentCalc *= Math.pow(1.1, game.upgrades.Potency.done);
            }
            return currentCalc;
        },
        getBreedingTotalSpeed: function () {
            if (game.global.challengeActive === "Trapper") return 0;
            var trimps = game.resources.trimps;
            var base = 0.0085;
            //Add job count
            var breeding = trimps.owned - trimps.employed;
            var currentCalc = breeding * base;
            //Add Potency
            if (game.upgrades.Potency.done > 0){
                currentCalc *= Math.pow(1.1, game.upgrades.Potency.done);
            }
            //Add Nurseries
            if (game.buildings.Nursery.owned > 0){
                currentCalc *= Math.pow(1.01, game.buildings.Nursery.owned);
            }
            //Add Venimp
            if (game.unlocks.impCount.Venimp > 0){
                var venimpStrength = Math.pow(1.003, game.unlocks.impCount.Venimp);
                currentCalc *= (venimpStrength);
            }
            if (game.global.brokenPlanet){
                currentCalc /= 10;
            }
            //Add pheromones
            if (game.portal.Pheromones.level > 0){
                var PheromonesStrength = (game.portal.Pheromones.level * game.portal.Pheromones.modifier);
                currentCalc  *= (PheromonesStrength + 1);
            }
            //Add Geneticist
            if (game.jobs.Geneticist.owned > 0) {
                currentCalc *= Math.pow(.98, game.jobs.Geneticist.owned);
            }
            //Add quick trimps
            if (game.unlocks.quickTrimps){
                currentCalc *= 2;
            }
            if (game.global.challengeActive === "Daily"){
                var mult = 0;
                if (typeof game.global.dailyChallenge.dysfunctional !== 'undefined'){
                    mult = dailyModifiers.dysfunctional.getMult(game.global.dailyChallenge.dysfunctional.strength);
                    currentCalc *= mult;
                }
                if (typeof game.global.dailyChallenge.toxic !== 'undefined'){
                    mult = dailyModifiers.toxic.getMult(game.global.dailyChallenge.toxic.strength, game.global.dailyChallenge.toxic.stacks);
                    currentCalc *= mult;
                }
            }
            if (game.global.challengeActive === "Toxicity" && game.challenges.Toxicity.stacks > 0){
                currentCalc *= Math.pow(game.challenges.Toxicity.stackMult, game.challenges.Toxicity.stacks);
            }
            if (game.global.voidBuff === "slowBreed"){
                currentCalc *= 0.2;
            }
            var heirloomBonus = calcHeirloomBonus("Shield", "breedSpeed", 0, true);
            if (heirloomBonus > 0){
                currentCalc *= ((heirloomBonus / 100) + 1);
            }
            return currentCalc;
        },
        getMinimumBreeding: function () {
            var battleTrimps = (game.portal.Coordinated.level) ? game.portal.Coordinated.currentSend : game.resources.trimps.maxSoldiers;
            if (battleTrimps < 5) return 5; else return battleTrimps + 1;
        },
        getBreedingCount: function () {
            var trimps = game.resources.trimps;
            return game.global.challengeActive === "Trapper" ? 0 : trimps.owned - trimps.employed;
        },
        isMetalChallenge: function () {
            return game.global.challengeActive === "Metal";
        },
        canGatherMetal: function () {
            return document.getElementById('metal').style.visibility === 'visible';
        }
    };

    var _BotStrategy = {
        isStarted: false,
        _tPassiveWatcher: undefined,
        _tAutoBuy: undefined,
        middleGameStrategy: function() {
            if (game.global.world < 60) return;

            if (game.global.formation === 0) {
                if (_GameHelpers.hasFormation(1)) setFormation('1');
            }

            var enemy = _GameHelpers.getCurrentEnemyAttack();
            var me = game.global.soldierCurrentBlock + game.global.soldierHealthMax;
            if (enemy >= me && parseInt(game.global.formation) !== 1) {
                if (_GameHelpers.hasFormation(1)) setFormation('1');
            }

            if (parseInt(game.global.formation) !== 2 && _GameHelpers.hasFormation(2)) {
                var formation2health = game.global.soldierHealthMax / 8;
                var me2 = formation2health + game.global.soldierCurrentBlock;
                if (me2 > enemy) {
                    setFormation('2');
                }
            }
        },
        autoBuyStorage: function () {
            var packratLevel = (1 + game.portal.Packrat.level * (game.portal.Packrat.modifier * 100) / 100);
            var buildingsForResources = {
                food: "Barn",
                wood: "Shed",
                metal: "Forge"
            };

            for (var res in buildingsForResources) {
                if (buildingsForResources.hasOwnProperty(res)) {
                    var bldName = buildingsForResources[res];
                    if (game.resources[res].owned / (game.resources[res].max * packratLevel) >= 0.8) {
                        if (canAffordBuilding(bldName, false, false, false, true)) {
                            buyBuilding(bldName, true, true);
                            _Log.println('Building ' + bldName);
                        }
                    }
                }
            }
        },
        autoJobs: function() {
            _Job.autoJobs();
        },
        earlyGameStrategy: function (isPassive) {
            if (_GameHelpers.isPortal()) return;

            if (parseInt(game.global.eggLoc) !== -1) {
                _Log.println('Destroying Easter Egg');
                easterEggClicked();
            }

            _BotStrategy.autoBuyStorage();
            if (isPassive === false) {
                _BotStrategy.autoJobs();
            }

            var breeding = _GameHelpers.getBreedingCount();
            var unemployed = Math.ceil(game.resources.trimps.realMax() / 2) - game.resources.trimps.employed;

            if (game.buildings.Trap.owned >= 1 && game.resources.trimps.owned < game.resources.trimps.realMax() &&
                (breeding < _GameHelpers.getMinimumBreeding() || unemployed > 0) &&
                _GameHelpers.getBreedingBaseSpeed() < 1) {
                setGather('trimps');
                return;
            }

            var hasTrap = _Buildings.hasInQueue('Trap');
            var cnt = game.global.challengeActive === "Trapper" ? 100 : (breeding < unemployed ? 25 : 1);
            if (!hasTrap && game.buildings.Trap.owned < 1 && game.resources.food.owned >= 10 && game.resources.wood.owned >= 10) {
                buyBuilding('Trap', true, true, cnt);
                return;
            }

            if ((game.global.buildingsQueue.length > 0 && game.global.autoCraftModifier < 1) || (game.global.buildingsQueue.length > 5)) {
                setGather('buildings');
                return;
            }

            var playerStrength = getPlayerModifier();
            var minimumSpeedToHelp = 1 + playerStrength;

            if (getPsString('food', true) < minimumSpeedToHelp && game.resources.food.owned < 10) {
                setGather('food');
                return;
            }

            if (getPsString('wood', true) < minimumSpeedToHelp && game.resources.wood.owned < 10) {
                setGather('wood');
                return;
            }

            var canGetScience = game.global.challengeActive !== "Scientist";

            if (canGetScience && getPsString('science', true) < minimumSpeedToHelp && game.resources.science.owned < 10) {
                setGather('science');
                return;
            }

            var metalNeeded = _Upgrade.getUpgradePriceSumForRes('metal');
            if (getPsString('metal', true) < minimumSpeedToHelp && game.resources.metal.owned < Math.min(100, metalNeeded)) {
                setGather('metal');
                return;
            }

            var needScientists = game.upgrades.Scientists.done === 0 && game.upgrades.Scientists.allowed === 1;
            if (canGetScience && getPsString('science', true) < minimumSpeedToHelp && (game.resources.science.owned < 60 || needScientists)) {
                setGather('science');
                return;
            }

            if ((game.global.playerGathering === 'trimps' && (game.buildings.Trap.owned === 0 || _GameHelpers.getBreedingBaseSpeed() > 1)) ||
                (game.global.playerGathering === 'buildings' && game.global.buildingsQueue.length === 0)) {
                _Job.selectAutoJob();
            }
        },
        passiveWatcher: function () {
            if (_GameHelpers.isPortal()) return;

            _BotStrategy.earlyGameStrategy(true);
            _Buildings.buyTribute();
            _Buildings.buyGym();

            _BotStrategy.middleGameStrategy();
        },
        autoBuyEquipment: function () {
            _Equipment.autoBuyEquipment();
        },
        mapAttackStrategy: function () {
            _Map.mapAttackStrategy();
        },
        autoUpgrade: function() {
            _Upgrade.autoUpgrade();
        },
        autoBuy: function() {
            _Buildings.autoBuy();
        },
        auto: function () {
            if (_GameHelpers.isPortal()) return;
            _BotStrategy.earlyGameStrategy(false);

            _BotStrategy.autoUpgrade();
            _BotStrategy.autoBuy();
            _BotStrategy.autoBuyEquipment();
            _BotStrategy.mapAttackStrategy();

            _BotStrategy.middleGameStrategy();

            _Map.mapDeleter();
        },
        onStartButton: function () {
            if (_BotStrategy.isStarted) {
                _BotStrategy.stop();
                _Log.println('Stop.');
                _BotStrategy.isStarted = false;
            } else {
                _BotStrategy.start();
                _Log.println('Started!');
                _BotStrategy.isStarted = true;
            }
        },
        stop: function () {
            _Log.println('BOT stop');
            clearInterval(_BotStrategy._tAutoBuy);

            _BotStrategy._tPassiveWatcher = setInterval(_BotStrategy.passiveWatcher, 1000);
            _Log.println('Passive watcher started');

            $('#botStart').text('Bot start');
        },
        start: function () {
            _Log.println('Passive watcher stop');
            clearInterval(_BotStrategy._tPassiveWatcher);

            _Log.println('BOT start version ' + _GameHelpers.getBotVersion());
            _BotStrategy._tAutoBuy = setInterval(_BotStrategy.auto, 1000);

            $('#botStart').text('Bot stop');
        }
    };

    var _Equipment = {
        hasUpgradeForEquipment: function (equipName) {
            for (var item in game.upgrades) {
                if (game.upgrades.hasOwnProperty(item)) {
                    var upgrade = game.upgrades[item];
                    if (parseInt(upgrade.locked) === 1) continue;
                    if (typeof upgrade.prestiges !== 'undefined' && upgrade.prestiges === equipName) {
                        return true;
                    }
                }
            }
            return false;
        },
        getMetalNeededForEquipment: function (equipName) {
            var price = getBuildingItemPrice(game.equipment[equipName], 'metal', true, 1);
            var artMult = Math.pow(1 - game.portal.Artisanistry.modifier, game.portal.Artisanistry.level);
            if (game.global.challengeActive === "Daily" && typeof game.global.dailyChallenge.metallicThumb !== 'undefined'){
                artMult *= dailyModifiers.metallicThumb.getMult(game.global.dailyChallenge.metallicThumb.strength);
            }
            if (game.global.challengeActive === "Obliterated"){
                artMult = (artMult === -1) ? 1e12 : (1e12 * artMult);
            }
            price = Math.ceil(price * artMult);
            return price;
        },
        autoBuyEquipment: function () {
            var maxEquipLevel = game.global.challengeActive === 'Frugal' ? 10000 : 7;
            var isMetal = _GameHelpers.isMetalChallenge();
            for (var x in game.equipment) {
                if (game.equipment.hasOwnProperty(x) && game.equipment[x].locked === 0) {
                    if (_Equipment.hasUpgradeForEquipment(x)) continue;
                    var maxLevel = isMetal ? 1 :
                        (game.equipment[x].prestige > maxEquipLevel ? 1 : (maxEquipLevel + 1 - game.equipment[x].prestige) * 2);
                    if (x === 'Shield' && !game.equipment['Shield'].blockNow) {
                        maxLevel = 1;
                    }
                    if (game.equipment[x].level < maxLevel && canAffordBuilding(x, null, null, true)) {
                        if (game.equipment[x].cost.hasOwnProperty('metal')) {
                            // save metal for upgrades
                            var currentMetal = game.resources['metal'].owned;
                            var equipMetal = _Equipment.getMetalNeededForEquipment(x);
                            var upgradesMetal = _Upgrade.getUpgradePriceSumForRes('metal');
                            if (currentMetal >= (upgradesMetal + equipMetal)) {
                                buyEquipment(x, true, true);
                                _Log.println('Upgrading equipment ' + x);
                            }
                        } else {
                            buyEquipment(x, true, true);
                            _Log.println('Upgrading equipment ' + x);
                        }
                    }
                }
            }
        }
    };

    var _Job = {
        needFarmer: 25,
        needLumber: 25,
        needMiner: 25,
        needScientist: 1,
        selectAutoJob: function () {
            var canGetScience = game.global.challengeActive !== "Scientist";
            var upgradePrice = _Upgrade.getMaximumResourceUpgradePrice();
            var scienceNeeded = _Upgrade.getUpgradePriceSumForRes('science');
            var setBasic = function () {
                if (_GameHelpers.canGatherMetal() && _GameHelpers.isMetalChallenge()) {
                    setGather('metal');
                } else {
                    if (canGetScience && scienceNeeded > 0) {
                        setGather('science');
                    } else {
                        setGather('food');
                    }
                }
            };
            if (scienceNeeded > game.resources.science.owned && canGetScience) {
                setGather('science');
            } else {
                if (upgradePrice !== false) {
                    for (var x in upgradePrice) {
                        if (upgradePrice.hasOwnProperty(x)) {
                            if (x === 'wood' || x === 'metal' || x === 'science' || x === 'food') {
                                setGather(x);
                            } else {
                                setBasic();
                            }
                            break;
                        }
                    }
                } else {
                    setBasic();
                }
            }
        },
        buyJobs: function ($obj, unemployed, objName, jobId) {
            if ($obj.length > 0) {
                var needAllMax = _Job.needFarmer + _Job.needLumber + _Job.needMiner + _Job.needScientist;
                var breeding = _GameHelpers.getBreedingCount();
                var cnt = 1;
                var minBreeding = _GameHelpers.getMinimumBreeding();
                if (unemployed > needAllMax * 1000000000 && (breeding - 10000000000 > minBreeding)) {
                    game.global.buyAmt = 10000000000;
                    cnt = 10000000000;
                }
                else if (unemployed > needAllMax * 100000000 && (breeding - 1000000000 > minBreeding)) {
                    game.global.buyAmt = 1000000000;
                    cnt = 1000000000;
                }
                else if (unemployed > needAllMax * 10000000 && (breeding - 100000000 > minBreeding)) {
                    game.global.buyAmt = 100000000;
                    cnt = 100000000;
                }
                else if (unemployed > needAllMax * 1000000 && (breeding - 10000000 > minBreeding)) {
                    game.global.buyAmt = 10000000;
                    cnt = 10000000;
                }
                else if (unemployed > needAllMax * 100000 && (breeding - 1000000 > minBreeding)) {
                    game.global.buyAmt = 1000000;
                    cnt = 1000000;
                }
                else if (unemployed > needAllMax * 10000 && (breeding - 100000 > minBreeding)) {
                    game.global.buyAmt = 100000;
                    cnt = 100000;
                }
                else if (unemployed > needAllMax * 1000 && (breeding - 10000 > minBreeding)) {
                    game.global.buyAmt = 10000;
                    cnt = 10000;
                }
                else if (unemployed > needAllMax * 100 && (breeding - 1000 > minBreeding)) {
                    game.global.buyAmt = 1000;
                    cnt = 1000;
                }
                else if (unemployed > needAllMax * 10 && (breeding - 100 > minBreeding)) {
                    numTab(4);
                    cnt = 100;
                }
                else if (unemployed > needAllMax * 2.5 && (breeding - 25 > minBreeding)) {
                    numTab(3);
                    cnt = 25;
                }
                else if (unemployed > needAllMax && (breeding - 10 > minBreeding)) {
                    numTab(2);
                    cnt = 10;
                }
                else {
                    numTab(1);
                    cnt = 1;
                }
                buyJob(jobId, true, true); // confirmed, noTip
                numTab(1); // +1
                _Log.println('New ' + objName + (cnt > 1 ? " x" + cnt : ''), 'Combat');
                return cnt;
            } else {
                return 0;
            }
        },
        getJobsNeededCounts: function () {
            var maxTrimps = game.resources.trimps.realMax();
            var unemployed = Math.ceil(maxTrimps / 2) - game.resources.trimps.employed;
            var jobsTotal =
                unemployed +
                game.jobs.Farmer.owned +
                game.jobs.Lumberjack.owned +
                game.jobs.Miner.owned +
                game.jobs.Scientist.owned;
            var hasFarmer = game.jobs.Farmer.locked === 0;
            var hasLumber = game.jobs.Lumberjack.locked === 0;
            var hasMiner = game.jobs.Miner.locked === 0;
            var hasScientist = game.jobs.Scientist.locked === 0;
            var needAll =
                (hasFarmer ? _Job.needFarmer : 0) +
                (hasLumber ? _Job.needLumber : 0) +
                (hasMiner ? _Job.needMiner : 0) +
                (hasScientist ? _Job.needScientist : 0);
            if (needAll < 1) needAll = 1;
            var minOwned = Math.min(
                game.jobs.Farmer.owned,
                game.jobs.Lumberjack.owned,
                game.jobs.Miner.owned,
                Math.floor(jobsTotal * 0.25)
            );
            if (game.global.world < 20) minOwned = minOwned / 2;
            if (minOwned > 30) minOwned = 30; // for science
            if (minOwned < 1) minOwned = 1;
            var jobsWithoutScientists = jobsTotal - minOwned;

            return {
                Scientist: _Job.needScientist ? minOwned : -1,
                Farmer: _Job.needFarmer ? Math.floor(jobsWithoutScientists * _Job.needFarmer / needAll) : -1,
                Lumberjack: _Job.needLumber ? Math.floor(jobsWithoutScientists * _Job.needLumber / needAll) : -1,
                Miner: _Job.needMiner ? Math.floor(jobsWithoutScientists * _Job.needMiner / needAll) : -1
            };
        },
        autoJobs: function () {
            var breeding = game.resources.trimps.owned - game.resources.trimps.employed;
            if (breeding < (_GameHelpers.getMinimumBreeding() + 1) && game.global.challengeActive !== 'Trapper') return;

            var maxTrimps = game.resources.trimps.realMax();
            var unemployed = Math.ceil(maxTrimps / 2) - game.resources.trimps.employed;

            var trainerCost = _GameHelpers.getJobPrice('Trainer', 'food');
            if ((trainerCost < game.resources.food.owned) && unemployed <= 0 && game.jobs.Farmer.owned > 1 && game.jobs.Trainer.locked === 0) {
                _Log.println('Fire farmer, sorry. We need trainers.');
                game.global.firing = true;
                buyJob('Farmer', true, true);
                game.global.firing = false;
            }

            if (unemployed <= 0) return;

            if (trainerCost <= game.resources.food.owned && game.jobs.Trainer.locked === 0) {
                buyJob('Trainer', true, true);
                _Log.println('New trainer');
                return 1;
            }

            if (game.jobs.Geneticist.locked === 0 && _GameHelpers.getBreedingTotalSpeed() > maxTrimps * 2) {
                buyJob('Geneticist', true, true);
                _Log.println('New geneticist');
                return 1;
            }

            var cnt = 0;
            var $jobsBlock = $('#jobsHere');

            var $explorer = $jobsBlock.find('.thingColorCanAfford[id=Explorer]');
            if ($explorer.length > 0) {
                buyJob('Explorer', true, true);
                _Log.println('New explorer');
                return ++cnt;
            }

            var $farmer = $jobsBlock.find('.thingColorCanAfford[id=Farmer]');

            var toHire = _Job.getJobsNeededCounts();

            if (toHire.Farmer > 0 && game.jobs.Farmer.owned < toHire.Farmer) {
                cnt += _Job.buyJobs($farmer, unemployed, 'farmer', 'Farmer');
            } else if (toHire.Lumberjack > 0 && game.jobs.Lumberjack.owned < toHire.Lumberjack) {
                var $lumber = $jobsBlock.find('.thingColorCanAfford[id=Lumberjack]');
                cnt += _Job.buyJobs($lumber, unemployed, 'lumberjack', 'Lumberjack');
            } else if (toHire.Miner > 0 && game.jobs.Miner.owned < toHire.Miner) {
                var $miner = $jobsBlock.find('.thingColorCanAfford[id=Miner]');
                cnt += _Job.buyJobs($miner, unemployed, 'miner', 'Miner');
            } else if (toHire.Scientist > 0 && game.jobs.Scientist.owned < toHire.Scientist) {
                var $science = $jobsBlock.find('.thingColorCanAfford[id=Scientist]');
                cnt += _Job.buyJobs($science, unemployed, 'scientist', 'Scientist');
            }

            if (unemployed > 0 && cnt === 0) {
                cnt += _Job.buyJobs($farmer, unemployed, 'farmer', 'Farmer');
            }

            return cnt;
        }
    };

    var _Buildings = {
        buyTribute: function () {
            if (_GameHelpers.isMetalChallenge()) return;
            var canAfford = canAffordBuilding("Tribute", false, false, false, true);
            if (canAfford && game.buildings.Tribute.locked !== 1) {
                buyBuilding("Tribute", true, true);
                _Log.println('Building ' + "Tribute");
            }
        },
        buyGym: function () {
            var canAfford = canAffordBuilding("Gym", false, false, false, true);
            if (canAfford && game.buildings.Gym.locked !== 1) {
                buyBuilding("Gym", true, true);
                _Log.println('Building ' + "Gym");
            }
        },
        hasInQueue: function (item) {
            for (var x in game.global.buildingsQueue) {
                var queueItem = game.global.buildingsQueue[x].split('.')[0];
                if (queueItem === item) {
                    return true;
                }
            }
            return false;
        },
        autoBuy: function () {
            if (_GameHelpers.isMetalChallenge()) {
                _Buildings.buyGym();
                return;
            } // buy only Gym and Trainer
            var toBuy;
            for (var item in game.buildings) {
                if (item === 'Barn' || item === 'Shed' || item === 'Forge' || item === 'Wormhole' || item === 'Trap') continue;
                if (!game.buildings.Collector.locked &&
                    (item === 'Mansion' || item === 'Hotel' || item === 'Resort' || item === 'House' || item === 'Hut')) continue;
                if (game.upgrades.Gigastation.done >= 10 && item === 'Collector') continue;

                if (game.buildings.hasOwnProperty(item)) {
                    if (parseInt(game.buildings[item].locked) === 1) continue;
                    var canAfford = canAffordBuilding(item, false, false, false, true);
                    if (canAfford) {
                        if (item === 'Nursery') {
                            var isElectro = game.global.challengeActive === "Electricity";
                            var mult = game.global.brokenPlanet ? (game.global.world >= 80 ? 2 : 1.5) : 1;
                            var enoughNursery = (game.buildings.Nursery.owned >= (game.buildings.Tribute.owned * mult) ||
                                game.buildings.Nursery.owned >= (game.buildings.Gym.owned * mult));

                            if ((isElectro || !enoughNursery) && !_Buildings.hasInQueue('Nursery'))
                            {
                                toBuy = item;
                            }
                        } else {
                            toBuy = item;
                        }
                    }
                }
            }
            if (typeof toBuy !== 'undefined') {
                buyBuilding(toBuy, true, true);
                _Log.println('Building ' + toBuy);
            }
        }
    };

    var _Log = {
        println: function (mes, type) {
            if (typeof type === 'undefined') type = "Story";
            message("BOT: " + mes, type);
        },
        message: function (messageString, type, lootIcon, extraClass, extraTag, htmlPrefix) {
            if (type === 'Loot' && lootIcon === null) return;
            if (type === 'Combat' && (lootIcon === null || typeof lootIcon === 'undefined')) return;
            if (type === 'Loot' &&
                (messageString.indexOf('You just found') > -1 ||
                    messageString.indexOf('You found') > -1 ||
                    messageString.indexOf('That guy just left') > -1 ||
                    (messageString.indexOf(' dropped ') > -1 && messageString.indexOf('That ') > -1) ||
                    messageString.indexOf(' manage to ') > -1 ||
                    messageString.indexOf('Then he died') > -1 ||
                    messageString.indexOf(' popped out!') > -1 ||
                    messageString.indexOf('That Feyimp gave you') > -1 ||
                    messageString.indexOf('in that dead Tauntimp') > -1 ||
                    messageString.indexOf('fragments from that Flutimp') > -1 ||
                    messageString.indexOf('That Jestimp gave you') > -1 ||
                    messageString.indexOf('That Titimp made your Trimps super strong') > -1 ||
                    messageString.indexOf('You scored ') > -1 ||
                    messageString.indexOf('Hulking Mutimp ') > -1 ||
                    messageString.indexOf('Cubist art is your favorite!') > -1 ||
                    messageString.indexOf('Reward encountered: ') > -1 ||
                    messageString.indexOf('Findings: ') > -1 ||
                    messageString.indexOf('Salvage results: ') > -1 ||
                    messageString.indexOf('You hear nearby Kittimps ') > -1
                )) return;
            if (type === 'Story' && typeof lootIcon === 'undefined' &&
                messageString.indexOf('BOT: New ') > -1) return;
            var showTimestamps = parseInt(game.options.menu.timestamps.enabled) === 1;
            if (type === 'Notices' && messageString === 'Game Saved!') {
                var t = showTimestamps ? getCurrentTime() : updatePortalTimer(true);
                $('#saveIndicator').find('.autosaving').text(t);
                return;
            }
            if (messageString.indexOf('The ground up Venimp now increases your Trimps') > -1) {
                _BotUI.updateSuperTrimps();
                return;
            }
            if (messageString.indexOf('You killed a Magnimp! The strong magnetic forces now increase your loot by') > -1) {
                _BotUI.updateSuperTrimps();
                return;
            }
            if (messageString.indexOf('Seeing the Whipimps fall is causing all of your Trimps to work') > -1) {
                _BotUI.updateSuperTrimps();
                return;
            }

            var log = document.getElementById("log");
            var displayType = "block";
            var prefix = "";
            var addId = "";
            if (messageString === "Game Saved!" || extraClass === 'save') {
                addId = " id='saveGame'";
                if (document.getElementById('saveGame') !== null) {
                    log.removeChild(document.getElementById('saveGame'));
                }
            }
            if (game.options.menu.timestamps.enabled) {
                messageString = (showTimestamps ? getCurrentTime() : updatePortalTimer(true)) + " " + messageString;
            }
            if (!htmlPrefix) {
                if (lootIcon && lootIcon.charAt(0) === "*") {
                    lootIcon = lootIcon.replace("*", "");
                    prefix = "icomoon icon-";
                }
                else prefix = "glyphicon glyphicon-";
                if (type === "Story") messageString = "<span class='glyphicon glyphicon-star'></span> " + messageString;
                if (type === "Combat") messageString = "<span class='glyphicon glyphicon-flag'></span> " + messageString;
                if (type === "Loot" && lootIcon) messageString = "<span class='" + prefix + lootIcon + "'></span> " + messageString;
                if (type === "Notices") {
                    messageString = "<span class='glyphicon glyphicon-off'></span> " + messageString;
                }
            } else {
                messageString = htmlPrefix + " " + messageString;
            }
            var messageHTML = "<span" + addId + " class='" + type + "Message message" + " " + extraClass + "' style='display: " + displayType + "'>" + messageString + "</span>";
            pendingLogs.all.push(messageHTML);
            postMessages();

            var $allLogs = $('#log').find('span');
            $allLogs.slice(0, -30).remove();
        }
    };

    var _Map = {
        needAttackCurrentMap: function () {
            return _Map.isAbleToAttackMaps() && (typeof game.mapsAttacked[game.global.world] === 'undefined');
        },
        hasMapOfCurrentLevel: function () {
            for (var x in game.global.mapsOwnedArray) {
                if (game.global.mapsOwnedArray.hasOwnProperty(x)) {
                    var mapObj = game.global.mapsOwnedArray[x];
                    if (parseInt(mapObj.level) === parseInt(game.global.world)) return true;
                }
            }
            return false;
        },
        buyNewMapOfCurrentLevel: function () {
            if (!_Map.isSelectingMap()) {
                mapsClicked(true);
            }
            var money = game.resources.fragments.owned;
            if (money > 0) {
                var currentMapPrice = updateMapCost(true);
                if (money >= currentMapPrice) {
                    var result = buyMap();
                    if (result === 1) {
                        _Log.println('Bought new map level ' + game.global.world);
                    } else {
                        console.log('Buy map result = ' + result);
                    }
                } else {
                    console.log('No fragments (' + money + ') to buy map for ' + currentMapPrice);
                }
            }
        },
        attackMapOfCurrentLevel: function (knownMapId, isPrestige) {
            var x, mapObj;
            var breeding = _GameHelpers.getBreedingCount();

            game.global.lookingAtMap = '';
            if (typeof knownMapId === 'undefined') {
                for (x in game.global.mapsOwnedArray) {
                    if (game.global.mapsOwnedArray.hasOwnProperty(x)) {
                        mapObj = game.global.mapsOwnedArray[x];
                        var isVoid = mapObj.location === "Void";
                        if (isVoid && _GameHelpers.isMetalChallenge()) continue; // skip Void on Metal challenge
                        if (parseInt(mapObj.level) === parseInt(game.global.world)) {
                            game.global.lookingAtMap = mapObj.id;
                            break;
                        }
                    }
                }
            } else {
                game.global.lookingAtMap = knownMapId;
            }

            if (game.global.lookingAtMap !== '') {
                _Log.println('Attacking ' + (isPrestige ? 'prestige ' : '') + 'map ' + game.global.lookingAtMap);
                game.options.menu.alwaysAbandon.enabled = 1; // GO TO MAPS!
                mapsClicked(true);
                game.mapsAttacked[game.global.world] = true;
                game.global.repeatMap = true; // REPEAT
                repeatClicked(true);
                runMap();
                if (breeding < (_GameHelpers.getMinimumBreeding() + 1)) fightManual();
            } else {
                if (!_GameHelpers.isMetalChallenge()) console.log('where is my map?');
            }
        },
        getPrestigeMapToAttack: function () {
            for (var x in game.global.mapsOwnedArray) {
                if (game.global.mapsOwnedArray.hasOwnProperty(x)) {
                    var mapObj = game.global.mapsOwnedArray[x];
                    if (parseInt(mapObj.clears) === 0
                        && parseInt(mapObj.level) <= parseInt(game.global.world)
                        && mapObj.noRecycle) {
                        return mapObj.id;
                    }
                }
            }
            return -1;
        },
        attackCurrentMap: function () {
            document.getElementById("mapLevelInput").value = game.global.world;

            var prestigeMapToAttack = _Map.getPrestigeMapToAttack();
            if (prestigeMapToAttack !== -1) {
                _Map.attackMapOfCurrentLevel(prestigeMapToAttack, true);
                return;
            }

            if (!_Map.hasMapOfCurrentLevel()) {
                _Map.buyNewMapOfCurrentLevel();
            }

            if (_Map.hasMapOfCurrentLevel()) {
                _Map.attackMapOfCurrentLevel();
            } else {
                console.log('no map of current level ' + game.global.world);
            }
        },
        isAbleToAttackMaps: function() {
            return (game.global.world >= 6) && !game.global.preMapsActive;
        },
        isSelectingMap: function() {
            return document.getElementById("grid").style.display === 'none' &&
                document.getElementById("preMaps").style.display === 'block';
        },
        mapAttackStrategy: function () {
            if (!_Map.isAbleToAttackMaps()) return;

            if (game.global.pauseFight) {
                _Log.println('Enabling auto attack!');
                fightManual();
                game.global.pauseFight = false;
                pauseFight(true); // update only
            } else {
                if (_Map.needAttackCurrentMap()) {
                    _Map.attackCurrentMap();
                } else {
                    if (_Map.hasMapOfCurrentLevel() && game.global.currentMapId === '') {
                        game.global.lookingAtMap = '';
                        var map_id, map_name = '', isVoid;
                        for (var x in game.global.mapsOwnedArray) {
                            if (game.global.mapsOwnedArray.hasOwnProperty(x)) {
                                var mapObj = game.global.mapsOwnedArray[x];
                                isVoid = mapObj.location === "Void";
                                if (isVoid && _GameHelpers.isMetalChallenge()) continue; // skip Void on Metal challenge
                                if (mapObj.level <= game.global.world && mapObj.noRecycle === true && mapObj.clears === 0) {
                                    game.global.lookingAtMap = mapObj.id;
                                    map_id = x;
                                    map_name = mapObj.name;
                                    break;
                                }
                            }
                        }
                        if (game.global.lookingAtMap !== '' && typeof map_id !== 'undefined') {
                            isVoid = game.global.mapsOwnedArray[map_id].location === "Void";
                            if (isVoid) {
                                if (_GameHelpers.isMetalChallenge()) return;
                                if (game.global.lastClearedMapCell >= game.global.mapGridArray.length - 2) {
                                    _Log.println('Attacking Void map ' + map_name + ' level (' + game.global.mapsOwnedArray[map_id].level + ')');
                                } else {
                                    return;// attack Void only in last 2 cells
                                }
                            } else {
                                _Log.println('Attacking prestige map ' + map_name + ' level (' + game.global.mapsOwnedArray[map_id].level + ')');
                            }
                            game.options.menu.alwaysAbandon.enabled = 1; // GO TO MAPS!
                            mapsClicked(true);
                            game.global.repeatMap = true; // REPEAT
                            repeatClicked(true);
                            game.global.mapsOwnedArray[map_id].clears = 1;
                            runMap();
                            if (_GameHelpers.getBreedingCount() < (_GameHelpers.getMinimumBreeding() + 1)) fightManual();
                        }
                    } else {
                        if (game.global.currentMapId !== '') {
                            var lastMapCell = game.global.mapGridArray[game.global.mapGridArray.length - 1];
                            var specialGift = '';
                            if (lastMapCell.special !== '') {
                                specialGift = game.mapUnlocks[lastMapCell.special];
                            }
                            var needExitMap = (specialGift === '' || specialGift.prestige !== true) &&
                                lastMapCell.special !== 'Heirloom' &&
                                lastMapCell.name !== 'Warden' &&
                                lastMapCell.name !== 'Robotrimp' &&
                                specialGift.canRunOnce !== true;
                            if (needExitMap) {
                                _Log.println('Leaving map ' + game.global.currentMapId + '...');
                                mapsClicked(true); // go to maps
                                recycleMap(-1, true);
                                mapsClicked(); // go to world
                            }
                        } else if (_Map.isSelectingMap()) {
                            mapsClicked(); // go to world
                        }
                    }
                }
            }
        },
        mapDeleter: function() {
            if (game.global.currentMapId === '') {
                for (var x in game.global.mapsOwnedArray) {
                    var map = game.global.mapsOwnedArray[x];
                    if (map.level < (game.global.world - 10) && map.noRecycle !== true) {
                        game.global.lookingAtMap = map['id'];
                        _Log.println('Deleting map ' + map.name + ' (' + map.level + ')');
                        recycleMap(-1, true);
                        break;
                    }
                }
            }
        }
    };

    var _Upgrade = {
        autoUpgrade: function () {
            for (var item in game.upgrades) {
                if (game.upgrades.hasOwnProperty(item)) {
                    var upgrade = game.upgrades[item];
                    if (parseInt(upgrade.locked) === 1) continue;
                    var canAfford = canAffordTwoLevel(upgrade);
                    if (canAfford) {
                        if (item === "Coordination") {
                            if (!canAffordCoordinationTrimps()) continue;
                        }
                        if (item === "Gigastation") {
                            var minAddon = Math.floor(game.global.highestLevelCleared / 6);
                            var minWaprstation = Math.floor(game.global.world / 6) + minAddon + game.upgrades.Gigastation.done * 2;
                            if (minWaprstation < 6 + minAddon) minWaprstation = 6 + minAddon;
                            if (game.buildings.Warpstation.owned < minWaprstation) continue;
                        }
                        buyUpgrade(item, true, true);
                        _Log.println('Researching ' + item + ' level ' + parseInt(upgrade.done));
                        _Job.selectAutoJob();
                        return 1;
                    }
                }
            }
            return 0;
        },
        getUpgradePrice: function (upgradeObject) {
            var price, result = {};
            for (var cost in upgradeObject.cost) {
                if (upgradeObject.cost.hasOwnProperty(cost)) {
                    if (typeof upgradeObject.cost[cost] === 'object' && typeof upgradeObject.cost[cost][1] === 'undefined') {
                        var costItem = upgradeObject.cost[cost];
                        for (var item in costItem) {
                            if (costItem.hasOwnProperty(item)) {
                                price = costItem[item];
                                if (upgradeObject.prestiges && (item === "metal" || item === "wood")) {
                                    if (game.global.challengeActive === "Daily" && typeof game.global.dailyChallenge.metallicThumb !== 'undefined') {
                                        price *= dailyModifiers.metallicThumb.getMult(game.global.dailyChallenge.metallicThumb.strength);
                                    }
                                    price *= Math.pow(1 - game.portal.Artisanistry.modifier, game.portal.Artisanistry.level);
                                }
                                if (typeof price === 'function') price = price();
                                if (typeof price[1] !== 'undefined') price = resolvePow(price, upgradeObject);
                                result[item] = price;
                            }
                        }
                    }
                }
            }
            return result;
        },
        getAllUpgradePrice: function () {
            var totalPrice = {};
            for (var item in game.upgrades) {
                if (game.upgrades.hasOwnProperty(item)) {
                    var upgrade = game.upgrades[item];
                    if (parseInt(upgrade.locked) === 1) continue;
                    var price = _Upgrade.getUpgradePrice(upgrade);
                    for (var res in price) {
                        if (price.hasOwnProperty(res)) {
                            if (typeof totalPrice[res] === 'undefined') totalPrice[res] = 0;
                            totalPrice[res] += price[res];
                        }
                    }
                }
            }
            return totalPrice;
        },
        getUpgradePriceSumForRes: function (res) {
            var totalPrice = _Upgrade.getAllUpgradePrice();
            if (typeof totalPrice[res] !== 'undefined') {
                return totalPrice[res];
            } else {
                return 0;
            }
        },
        getMaximumResourceUpgradePrice: function () {
            var totalPrice = _Upgrade.getAllUpgradePrice(), maxPriceName = '', maxPrice = 0;
            for (var res in totalPrice) {
                if (totalPrice.hasOwnProperty(res)) {
                    if (totalPrice[res] > maxPrice) {
                        maxPrice = totalPrice[res];
                        maxPriceName = res;
                    }
                }
            }
            var result = {};
            if (maxPriceName !== '') {
                result[maxPriceName] = maxPrice;
                return result;
            } else {
                return false;
            }
        }
    };

    var _BotUI = {
        _logEnabled: true,
        _tTitimp: undefined,
        _tStyleFix: undefined,
        styleUpdate: function () {
            // remove counts
            //noinspection CssUnusedSymbol
            $('head').append($("<style type=\"text/css\">\n" +
                "span.thingName{font-size:85%;}\n"+
                ".queueItem,.btn{padding:0}\n" +
                ".thingColorCanNotAfford.upgradeThing{background-color:#530053;}\n" +
                "#battleSideTitle{padding:0}\n" +
                ".battleSideBtnContainer{margin-top:0;}\n" +
                "#logBtnGroup{display:none}\n" +
                "#log{height:100%;}\n" +
                ".glyphicon-apple{color:orangered;}\n" +
                ".glyphicon-tree-deciduous{color:limegreen;}\n"+
                ".icomoon.icon-cubes{color:silver;}\n"+
                ".icomoon.icon-diamond{color:white;}\n"+
                "#buildingsTitleDiv,#upgradesTitleDiv,#equipmentTitleDiv{display:none}\n"+
                "#buildingsQueue{height:30px}\n"+
                "#buyHere .alert.badge{display:none}\n"+
                '</style>'));

            // remove tabs
            $('#buyTabs').hide();
            filterTabs('all');
            // fix height
            $('#topRow,#queueContainer').css('margin-bottom', '0');
            $('#jobsTitleDiv').css('padding', '0').css('font-size', 'smaller');
            $('#buyHere').css('margin', '0').css('padding', '0').css('overflow-x', 'hidden');
            $('#queueContainer').css('height', '70px');
            $('#numTabs').css('margin', '0');
            $('#buyContainer').css('height', 'calc(99vh - 20vw - 96px)');
            // add button
            $('#settingsTable').find('tr').append('<td class="btn btn-info" id="botStart" title="' + _GameHelpers.getBotVersion() + '">Bot start</td>');
            $('#botStart').on('click', _BotStrategy.onStartButton);
            // add grid
            var $grid = $('<table style="width:100%;margin-top:4px;font-size:smaller;"><tr>' +
                '<td id="magnimp-cell"><span class="glyphicon glyphicon-magnet"></span><label style="margin-left:4px" title="Magimp">...</label></td>' +
                '<td id="venimp-cell"><span class="glyphicon glyphicon-glass"></span><label style="margin-left:4px" title="Venimp">...</label></td>' +
                '</tr><tr>' +
                '<td id="whipimp-cell"><span class="glyphicon glyphicon-star"></span><label style="margin-left:4px" title="Whipimp">...</label></td>' +
                '<td id="titimp-cell"><span class="icomoon icon-hammer"></span><label style="margin-left:4px" title="Titimp">' + prettify(game.global.titimpLeft) + '</label></td>' +
                '</tr></table>');
            $('#battleBtnsColumn').append($grid);
            _BotUI.updateSuperTrimps();
        },
        styleFix: function () {
            _BotUI.disableLog();

            var $buyBoxThings = $('.buyBox').find('.thing');
            $buyBoxThings.find('br').remove();
            $buyBoxThings.find('.thingOwned').css('margin-left', '4px');

            $('#buildingsTitleDiv,#upgradesTitleDiv,#equipmentTitleDiv').css('display', 'none');

            if (typeof game.passedMaps === 'undefined') game.passedMaps = {};
            if (typeof game.mapsAttacked === 'undefined') game.mapsAttacked = {};

            for (var x in game.passedMaps) if (x > game.global.world) {
                // Game restart?
                game.passedMaps = {};
                game.mapsAttacked = {};
                $('#venimp-cell').find('label').text('...');
                $('#magnimp-cell').find('label').text('...');
                $('#whipimp-cell').find('label').text('...');
                break;
            }

            var hasItem = false;
            if (typeof game.mapUnlocks === 'undefined') {
                clearInterval(_BotUI._tStyleFix);
                _BotUI._tStyleFix = setInterval(_BotUI.styleFix, 2000);
            } else {
                for (x in game.mapUnlocks) {
                    if (game.mapUnlocks.hasOwnProperty(x)) {
                        var notPass = game.mapUnlocks[x].startAt <= game.global.world && (typeof game.passedMaps[game.mapUnlocks[x].startAt] === 'undefined' || game.passedMaps[game.mapUnlocks[x].startAt] < 1);
                        if (notPass) {
                            $('#battleSideTitle').css('background-color', notPass ? '#A00' : '#600');
                            hasItem = true;
                            break;
                        }
                    }
                }
            }
            if (!hasItem) {
                $('#battleSideTitle').css('background-color', 'transparent');
            }
            game.passedMaps[game.global.world] = game.global.mapBonus;
            if (game.global.mapBonus > 0) {
                for (x in game.mapUnlocks) {
                    if (game.mapUnlocks.hasOwnProperty(x)) {
                        if (game.mapUnlocks[x].startAt < game.global.world) {
                            game.passedMaps[game.mapUnlocks[x].startAt] = 1;
                        }
                    }
                }
            }
        },
        disableLog: function () {
            if (_BotUI._logEnabled) {
                message = _Log.message;
                _BotUI._logEnabled = false;
            }
        },
        updateSuperTrimps: function () {
            var whipStrength = Math.pow(1.003, game.unlocks.impCount.Whipimp);
            whipStrength = prettify((whipStrength - 1) * 100) + "%";
            var magimpStrength = Math.pow(1.003, game.unlocks.impCount.Magnimp);
            magimpStrength = prettify((magimpStrength - 1) * 100) + "%";
            var venimpStrength = Math.pow(1.003, game.unlocks.impCount.Venimp);
            venimpStrength = prettify((venimpStrength - 1) * 100) + "%";

            var mag = $('#magnimp-cell').find('label');
            if (mag.text() !== magimpStrength) mag.text(magimpStrength);
            var whip = $('#whipimp-cell').find('label');
            if (whip.text() !== whipStrength) whip.text(whipStrength);
            var ven = $('#venimp-cell').find('label');
            if (ven.text() !== venimpStrength) ven.text(venimpStrength);
        },
        titimpUpdate: function () {
            $('#titimp-cell').find('label').text(prettify(game.global.titimpLeft > 0 ? game.global.titimpLeft : 0));
        },
        initTrimpsTools: function() {
            var TrimpsTools = {
                Helpers: _GameHelpers,
                Strategy: _BotStrategy,
                Equipment: _Equipment,
                Job: _Job,
                Buildings: _Buildings,
                Log: _Log,
                Map: _Map,
                Upgrade: _Upgrade,
                UI: _BotUI
            };

            if (typeof game.TrimpsTools === 'undefined') {
                game.TrimpsTools = TrimpsTools;
            }
            if (typeof unsafeWindow !== 'undefined') unsafeWindow.TrimpsTools = TrimpsTools;
        },
        init: function () {
            _BotUI._tStyleFix = setInterval(_BotUI.styleFix, 2000);
            _BotUI._tTitimp = setInterval(_BotUI.titimpUpdate, 500);

            _BotUI.styleUpdate();
            _BotUI.styleFix();
            _BotUI.disableLog();

            _BotUI.initTrimpsTools();
        }
    };

    setTimeout(function () {
        _Log.println('Trimps BOT version ' + _GameHelpers.getBotVersion());
        _BotUI.init();
        _BotStrategy.stop(); // start passive watcher
    }, 1000);

})();
