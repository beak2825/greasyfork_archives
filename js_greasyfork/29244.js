// ==UserScript==
// @name         Kittens tools
// @namespace    http://bloodrizer.ru/games/kittens/
// @version      1.226
// @description  Kittens tools (visual)
// @author       Anton
// @match        http://bloodrizer.ru/games/kittens/
// @require      https://cdnjs.cloudflare.com/ajax/libs/cytoscape/3.2.22/cytoscape.min.js
// @downloadURL https://update.greasyfork.org/scripts/29244/Kittens%20tools.user.js
// @updateURL https://update.greasyfork.org/scripts/29244/Kittens%20tools.meta.js
// ==/UserScript==

(function() {
	'use strict';

	var $ = jQuery, _br = '<br/>';

	var _Core = {
        secondsToTimeStr: function (seconds) {
            seconds = parseInt(seconds);
            if (seconds > 0) {
                var hours = parseInt(seconds / 3600);
                var minutes = parseInt((seconds - 3600 * hours) / 60);
                var sec = seconds - 3600 * hours - 60 * minutes;
                var _lz = function(x) { return (x < 10 ? '0' + x : x); };
                return _lz(hours) + ':' + _lz(minutes) + ':' + _lz(sec);
            }
            return '00:00:00';
        },
        clone: function (obj) {
            var copy;

            // Handle the 3 simple types, and null or undefined
            if (null == obj || 'object' != typeof obj) return obj;

            // Handle Date
            if (obj instanceof Date) {
                copy = new Date();
                copy.setTime(obj.getTime());
                return copy;
            }

            // Handle Array
            if (obj instanceof Array) {
                copy = [];
                for (var i = 0, len = obj.length; i < len; i++) {
                    copy[i] = _Core.clone(obj[i]);
                }
                return copy;
            }

            // Handle Object
            if (obj instanceof Object) {
                copy = {};
                for (var attr in obj) {
                    if (obj.hasOwnProperty(attr)) copy[attr] = _Core.clone(obj[attr]);
                }
                return copy;
            }

            throw new Error('Unable to copy obj! Its type isn\'t supported.');
        },
        getBotVersion: function () {
            return typeof GM_info == 'function' ? GM_info().script.version :
                (typeof GM_info == 'object' ? GM_info.script.version : '?');
        },
        getCurrentDateTimeStr: function () {
            var d = new Date();
            var getPaddedComp = function (comp) {
                return ((parseInt(comp) < 10) ? ('0' + comp) : comp)
            };
            var date = getPaddedComp(d.getDate()) + '.' + getPaddedComp(d.getMonth() + 1) + '.' + d.getFullYear();
            var time = getPaddedComp(d.getHours()) + ':' + getPaddedComp(d.getMinutes());
            return (date + " " + time);
        },
        floatToStr: function (num, maxDigits) {
            var resultStr = 0;
            num = parseFloat(num);
            var sign = num >= 0 ? 1 : -1;
            num = Math.abs(num);
            if (num >= 0.01) {
                if (typeof maxDigits === 'undefined') maxDigits = 2;
                resultStr = num.toFixed(maxDigits);
            } else if (num >= 0.001) {
                if (typeof maxDigits === 'undefined') maxDigits = 3;
                resultStr = num.toFixed(maxDigits);
            } else if (num >= 0.0001) {
                if (typeof maxDigits === 'undefined') maxDigits = 4;
                resultStr = num.toFixed(maxDigits);
            } else if (num >= 0.00001) {
                if (typeof maxDigits === 'undefined') maxDigits = 5;
                resultStr = num.toFixed(maxDigits);
            } else if (num >= 0.1) {
                if (typeof maxDigits === 'undefined') maxDigits = 1;
                resultStr = num.toFixed(maxDigits);
            } else {
                resultStr = num > 1 ? num.toFixed(0) : '0+';
            }
            return sign > 0 ? resultStr : '-' + resultStr;
        },
        percentToStr: function(chanceInPercent) {
            return _Core.floatToStr(chanceInPercent) + '%';
        },
        chanceToStr: function(chance) {
            return _Core.percentToStr(parseFloat(chance) * 100);
        }
    };

    var _Helpers = {
        _spaceBuildings: undefined,
        isGameReady: function() {
            return $('#game').css('display') === 'block';
        },
        isResourceUnlocked: function(res) {
            var r = game.resPool.get(res);
            if (r.unlocked || (r.visible && r.craftable && !r.isHidden)) {
                return true;
            } else {
                var workshop = game.workshop.crafts;
                for (var i in workshop) {
                    if (workshop.hasOwnProperty(i)) {
                        if (workshop[i].name === res && workshop[i].unlocked) {
                            return true;
                        }
                    }
                }
            }
            return false;
        },
        getMinCraft: function(res) {
            // craft no more than 2% of possible craft
            var allCount = game.workshop.getCraftAllCount(res);
            var craftLevel = _BotSettings.getCraftLevel();
            var ratioCount = Math.floor(allCount * craftLevel / 100);
            return ratioCount < 1 ? 1 : ratioCount;
        },
        getPricesForModel: function(model, isReligion, isSpace) {
            var ratio = model.priceRatio || (isSpace ? 1.15 : 1);
            var prices = _Core.clone(model.prices);
            if (isReligion) {
                prices = game.village.getEffectLeader('wise', prices);
            }
            for (var i = 0; i < prices.length; i++){
                if (isSpace && prices[i].name === "oil"){
                    prices[i].val = prices[i].val * Math.pow(1.05, model.val);
                    var reductionRatio = game.getHyperbolicEffect(game.getEffect("oilReductionRatio"), 0.75);
                    prices[i].val *= (1 - reductionRatio);
                } else {
                    prices[i].val = prices[i].val * Math.pow(ratio, model.val);
                }
            }
            return prices;
        },
        canBuyBuilding: function(bldName) {
            var prices = game.bld.getPrices(bldName);
            return _Helpers.isEnoughResourcesForPrice(prices);
        },
        isEnoughResourcesForPrice: function(prices) {
            if (isNaN(prices.length)) {
                return false; // if it is not an array
            }
            for (var x in prices) {
                if (prices.hasOwnProperty(x)) {
                    var resName = prices[x].name;
                    if (prices[x].val > game.resPool.get(resName).value) {
                        return false;
                    }
                    if (resName === 'catnip') {
                        if (!_Helpers.canSpendMint(prices[x].val)) {
                            return false;
                        }
                    }
                    if (_BotSettings.isCheckedResSetting(resName)) {
                        return false;
                    }
                }
            }
            return true;
        },
        getPromoteInfo: function(kitten, rank, doNotCheckGold) {
            if (doNotCheckGold) {
                var currentGold = parseFloat('+Infinity')
            } else {
                currentGold = game.resPool.get('gold').value;
            }

            var sim = game.village.sim;
            var kittenRank = kitten.rank;
            if (typeof(rank) == 'undefined') {
                rank = kitten.rank + 1;
            }
            var rankDiff = rank - kittenRank;
            var expToPromote = 0;
            var goldToPromote = 0;
            if (rankDiff > 0) {
                expToPromote = sim.expToPromote(kittenRank, rank, kitten.exp);
                goldToPromote = sim.goldToPromote(kittenRank, rank, currentGold);
            }
            return {
                rankDiff: rankDiff,
                exp: expToPromote,
                gold: goldToPromote
            };
        },
        canPromoteKitten: function(kitten, rank, doNotCheckGold) {
            var promoteInfo = _Helpers.getPromoteInfo(kitten, rank, doNotCheckGold);
            var canPromote = false;

            if (promoteInfo.rankDiff > 0) {
                if (promoteInfo.exp[0] && (promoteInfo.gold[0] || doNotCheckGold === true)) {
                    canPromote = true;
                } else if (promoteInfo.rankDiff > 1) { // If rank is unreachable, try one rank
                    return _Helpers.canPromoteKitten(kitten, undefined, doNotCheckGold);
                }
            }

            return {
                promoteInfo: promoteInfo,
                canPromote: canPromote
            };
        },
        getKittensForPromoteInfo: function(doNotCheckGold) {
            var promotedKittens = [];

            for (var i = 0; i < game.village.sim.kittens.length; i++) {
                var done = false;
                if(game.village.sim.kittens[i].engineerSpeciality != null) {
                    var tier = game.workshop.getCraft(game.village.sim.kittens[i].engineerSpeciality).tier;
                    if (game.village.sim.kittens[i].rank < tier) {
                        promotedKittens.push({'kitten': game.village.sim.kittens[i], 'rank': tier});
                        done = true;
                    }
                }
                if (!done) {
                    promotedKittens.push({'kitten': game.village.sim.kittens[i]});
                }
            }

            var promotedKittensCount = 0;
            var totalGoldNeeded = 0;
            if(promotedKittens.length) {
                for (i = 0; i < promotedKittens.length; i++) {
                    if (typeof(promotedKittens[i].rank) == 'number') {
                        var promoteInfo = _Helpers.canPromoteKitten(promotedKittens[i].kitten, promotedKittens[i].rank, doNotCheckGold);
                        promotedKittensCount += promoteInfo.canPromote ? 1 : 0;
                        totalGoldNeeded += promoteInfo.canPromote ? promoteInfo.promoteInfo.gold[1] : 0;
                    } else {
                        promoteInfo = _Helpers.canPromoteKitten(promotedKittens[i].kitten, undefined, doNotCheckGold);
                        promotedKittensCount += promoteInfo.canPromote ? 1 : 0;
                        totalGoldNeeded += promoteInfo.canPromote ? promoteInfo.promoteInfo.gold[1] : 0;
                    }
                }
            }

            return {
                count: promotedKittensCount,
                gold: totalGoldNeeded
            };
        },
        getZebraTitanium: function () {
            if (game.diplomacy.get('zebras').unlocked) {
                var shipVal = game.resPool.get('ship').value;
                var shipRate = shipVal * 0.35; //0.35% per ship to get titanium
                var titaniumAmt = 1.5;
                titaniumAmt += titaniumAmt * (shipVal / 100) * 2;	//2% more titanium per ship
                return {percent: shipRate + 15, value: titaniumAmt};
            }
            return {percent: 0, value: 0};
        },
        getGameStandingRatio: function () {
            var standingRatio = game.getEffect('standingRatio');
            standingRatio = standingRatio ? standingRatio : 0;
            if (game.prestige.getPerk('diplomacy').researched){
                standingRatio += 10;
            }
            return standingRatio;
        },
        getBuildingTitle: function (building_type) {
            var bld = game.bld.get(building_type);
            return bld.stages && bld.stages.length > 0 ? bld.stages[bld.stage].label : bld.label;
        },
        getResourceTitle: function (resId) {
            if (typeof game.resPool.resourceMap[resId] === 'object') {
                return game.resPool.resourceMap[resId].title;
            }
            return resId;
        },
        canSpendMint: function (mintAmount) {
            var calendar = game.calendar,
                winterDays = calendar.daysPerSeason -
                    (calendar.getCurSeason().name === 'winter' ? calendar.day : 0);
            var catnipPerTick = game.calcResourcePerTick('catnip', { modifiers:{
                    'catnip' : 0.25
                }});	//calculate estimate winter per tick for catnip;

            return (game.resPool.get('catnip').value - mintAmount + (winterDays * catnipPerTick / calendar.dayPerTick)) > 0;
        },
        getMagnetoBonus: function (addSteamwork, addMagneto) {
            if (typeof addSteamwork === 'undefined') addSteamwork = 0;
            if (typeof addMagneto === 'undefined') addMagneto = 0;

            var steamworks = game.bld.get('steamworks');
            var steamworksOn = steamworks.on + addSteamwork;
            var magnetoOn = game.bld.get('magneto').effects.magnetoRatio * addMagneto;
            var swRatio = steamworksOn > 0 ? (1+ steamworks.effects['magnetoBoostRatio'] * steamworksOn) : 1;
            return (game.getEffect('magnetoRatio') + magnetoOn) * swRatio;
        },
        getBuildingPrice: function (building_type) {
            return game.bld.getPrices(building_type);
        },
        isBuildingUnlocked: function(building_type) {
            return game.bld.isUnlocked(game.bld.get(building_type));
        },
        canBuildNow: function (building_type) {
            if (_Helpers.isBuildingUnlocked(building_type)) {
                var prices = _Helpers.getBuildingPrice(building_type);
                for (var i in prices) {
                    if (prices.hasOwnProperty(i)) {
                        var resName = prices[i].name;
                        var resVal = prices[i].val;
                        var res = game.resPool.get(resName);

                        if (!res.unlocked) return false;
                        if (res.maxValue > 0 && res.maxValue < resVal) return false;
                    }
                }
                return true;
            }
            return false;
        },
        getMaximumScienceResourcesToKeep: function () {
            var maxCompediums = 0;
            var maxParchment = 0;
            for (var i in game.science.techs) {
                if (game.science.techs.hasOwnProperty(i)) {
                    var tech = game.science.techs[i];
                    if (tech.unlocked && !tech.researched) {
                        var prices = tech.prices;
                        for (var p in prices) {
                            if (prices.hasOwnProperty(p)) {
                                if (prices[p].name === 'compedium') {
                                   if (prices[p].val > maxCompediums) {
                                       maxCompediums = prices[p].val;
                                   }
                                } else if (prices[p].name === 'parchment') {
                                    if (prices[p].val > maxParchment) {
                                        maxParchment = prices[p].val;
                                    }
                                }
                            }
                        }
                    }
                }
            }
            return {
                maxCompediums: maxCompediums,
                maxParchment: maxParchment
            };
        },
        getMaximumScienceResourcesForBuildings: function() {
            var maxParchments = 0, maxManuscript = 0;
            var currentSettingBuys = _BotSettings.settings[_BotSettings.settingIdx].buys;
            for (var bldName in currentSettingBuys) {
                if (currentSettingBuys.hasOwnProperty(bldName)) {
                    if (currentSettingBuys[bldName] === true) {
                        var bld = game.bld.get(bldName);
                        if (bld.unlocked && _Helpers.canBuildNow(bldName)) {
                            var prices = _Helpers.getBuildingPrice(bldName);
                            for (var x in prices) {
                                if (prices.hasOwnProperty(x)) {
                                    if (prices[x].name === 'parchment' && prices[x].val > maxParchments) {
                                        maxParchments = prices[x].val;
                                    }
                                    if (prices[x].name === 'manuscript' && prices[x].val > maxManuscript) {
                                        maxManuscript = prices[x].val;
                                    }
                                }
                            }
                        }
                    }
                }
            }
            return {
                maxManuscript: maxManuscript,
                maxParchment: maxParchments
            };
        },
        getUnicornRiftChance: function () {
            var unicornChanceRatio = 1;
            if (game.prestige.getPerk('unicornmancy').researched){
                unicornChanceRatio = 1.1;
            }
            unicornChanceRatio *= (1 + game.getEffect('timeRatio') * 0.25);
            var riftChance = game.getEffect('riftChance');	//5 OPTK
            return (riftChance * unicornChanceRatio) / 10000;
        },
        getAlicornChance: function () {
            var aliChance = game.getEffect('alicornChance');	//0.2 OPTK
            return aliChance / 100000;
        },
        getAstronomyChance: function () {
            var chanceRatio = 1;

            if (game.prestige.getPerk('chronomancy').researched){
                chanceRatio = 1.1;
            }

            chanceRatio *= (1 + game.getEffect('timeRatio') * 0.25);

            var chance = 25;									//25 OPTK of event per day	(0.25%)
            chance += (game.getEffect('starEventChance') * 10000);
            chance *= chanceRatio;

            if (game.prestige.getPerk('astromancy').researched){
                chance *= 2;
            }

            return chance / 10000;
        },
        getCorruptionSpeed: function () {
            var sorrow = game.resPool.get('sorrow').value * 0.1;
            var alicorns = game.resPool.get('alicorn');
            var corruption = 0;
            if (alicorns.value > 0){
                corruption =
                    (
                        game.getEffect('corruptionRatio') *
                        (1 + Math.sqrt( sorrow * game.getEffect('blsCorruptionRatio') ))
                    )
                    * (game.resPool.get('necrocorn').value > 0 ?
                    0.25 * (1 + game.getEffect('corruptionBoostRatio')) :	 //75% penalty
                    1);
            }
            return corruption;
        },
        getSecondsForOneCorruption: function () {
            if (game.religion.corruption < 1) {
                var corruptionSpeed = _Helpers.getCorruptionSpeed();
                if (corruptionSpeed > 0) {
                    return Math.floor((1 - game.religion.corruption) / corruptionSpeed / game.getRateUI());
                }
            }
            return 0;
        },
        getAlicornsPerSecond: function () {
            return game.getEffect('alicornPerTick') * game.getRateUI();
        },
        getEldersChance: function () {
            var pyramidVal = game.religion.getZU('blackPyramid').val;
            if ( pyramidVal > 0 ){
                var markerVal = game.religion.getZU('marker').val;
                var eldersChance = 35 * pyramidVal * (1 + 0.1 * markerVal);
                return eldersChance / 1000;
            }
            return 0;
        },
        getDiplomacyTradeValues: function (race) {
            var boughtResourceCollection = {},
                tradeRatio = 1 + game.diplomacy.getTradeRatio(),
                raceRatio = race.name === "leviathans" ? (1 + 0.02 * race.energy) : 1,
                currentSeason = game.calendar.getCurSeason().name;

            for(var i = 0; i < race.sells.length; i++){
                var sellResource = race.sells[i];
                var resourceSeasonTradeRatio = sellResource.seasons[currentSeason];
                var minBoughtAmount = (1 - sellResource.delta / 2);
                var maxBoughtAmount = (1 - sellResource.delta / 2) + sellResource.delta;

                var boughtAmountMin = minBoughtAmount * sellResource.value * resourceSeasonTradeRatio * tradeRatio * raceRatio;
                var boughtAmountMax = maxBoughtAmount * sellResource.value * resourceSeasonTradeRatio * tradeRatio * raceRatio;

                boughtResourceCollection[sellResource.name] = {
                    min: boughtAmountMin,
                    max: boughtAmountMax,
                    chance: sellResource.chance / 100
                };
            }

            return boughtResourceCollection;
        },
        getSolarPanelEnergyProductionDifference: function (seasonId, panelsCount) {
            var energyProduction = 2;
            var energyProductionDifference = 0;
            if (typeof seasonId === 'undefined') seasonId = game.calendar.season;
            if (typeof panelsCount === 'undefined') panelsCount = 1;
            energyProduction *= 1 + game.getEffect('solarFarmRatio');
            if (parseInt(seasonId) === 3) { // winter
                //energyProduction *= 0.75;
                energyProductionDifference = -energyProduction * 0.25 * panelsCount;
            } else if (parseInt(seasonId) === 1) { // summer
                //energyProduction /= 0.75;
                energyProductionDifference = energyProduction / 3 * panelsCount;
            }
            return energyProductionDifference;
        },
        getEnergyProduction: function (seasonId) {
            var energy = game.resPool.energyProd;
            var solarFarm = game.bld.get('pasture');
            if (parseInt(solarFarm.stage) === 1 && solarFarm.on > 0) {
                if (typeof seasonId === 'undefined') seasonId = game.calendar.season;
                if (parseInt(seasonId) !== parseInt(game.calendar.season)) {
                    var solarEnergyBonus = _Helpers.getSolarPanelEnergyProductionDifference(undefined, solarFarm.on);
                    var solarBonusForSeason = _Helpers.getSolarPanelEnergyProductionDifference(seasonId, solarFarm.on);

                    return energy - solarEnergyBonus + solarBonusForSeason;
                }
            }
            return energy;
        },
        getEnergyReserve: function (seasonId) {
            return _Helpers.getEnergyProduction(seasonId) - game.resPool.energyCons;
        },
        getEnergyReserves: function () {
            var result = [];
            for (var i in game.calendar.seasons) {
                if (game.calendar.seasons.hasOwnProperty(i)) {
                    var season = game.calendar.seasons[i];
                    result.push({
                        name: season.name,
                        title: season.title,
                        reserve: _Helpers.getEnergyReserve(i)
                    });
                }
            }
            return result;
        },
        getFaithRatio: function (withReset) {
            if (withReset) {
                return game.religion.faithRatio + game.religion.getApocryphaResetBonus(1.01);
            }
            return game.religion.faithRatio;
        },
        getFaithBonus: function (withReset) {
            var ratio = _Helpers.getFaithRatio(withReset);
            return game.getTriValue(ratio, 0.1) * 0.1;
        },
        getProductionBonus: function(isAtMaximum, addTranscendence, addObelisk) {
            if (typeof addTranscendence === 'undefined') addTranscendence = 0;
            if (typeof addObelisk === 'undefined') addObelisk = 0;
            var rate = game.religion.getRU("solarRevolution").on ? game.getTriValue(game.religion.faith, 1000) : 0;
            var atheismBonus = game.challenges.getChallenge("atheism").researched ? game.religion.getTranscendenceLevel() * 0.1 : 0;
            var blackObeliskBonus = (game.religion.getTranscendenceLevel() + addTranscendence) *
                (game.religion.getTU("blackObelisk").val + addObelisk) * 0.005;
            var baseRate = isAtMaximum ? 1000 : game.getHyperbolicEffect(rate, 1000);
            rate = baseRate * (1 + atheismBonus + blackObeliskBonus);
            return rate;
        },
        getNextTranscendPrice: function () {
            var tclevel = game.religion.getTranscendenceLevel();
            return game.religion.getTranscendenceRatio(tclevel + 1) - game.religion.getTranscendenceRatio(tclevel);
        },
        getGflopsValue: function () {
            return game.resPool.get('gflops').value;
        },
        getGflopsConsumption: function () {
            var bld = game.space.getBuilding('entangler');
            if (bld.on > 0) {
                return bld.effects['gflopsConsumption'] * game.getRateUI() * bld.on;
            }
            return 0;
        },
        getGflopsProduction: function () {
            var bld = game.bld.get('aiCore');
            if (bld.on > 0) {
                return bld.effects['gflopsPerTickBase'] * bld.on * game.getRateUI();
            }
            return 0;
        },
        getMaxBcoinPriceChangePerSecond: function () {
            return game.calendar.cryptoPrice * 0.01 / 400;
        },
        getVoidPerDay: function() {
            // -1, 0, 1, 2, 3 at start, 1 on average
            var maxPerDay = 2 + game.getEffect('temporalParadoxVoid');
            return {
                max: maxPerDay,
                min: -1,
                average: (maxPerDay - 1) / 2
            };
        },
        getDaysInParadox: function () {
            return 10 + game.getEffect('temporalParadoxDay');
        },
        getSpaceBuildings: function () {
            if (typeof _Helpers._spaceBuildings === 'undefined') {
                _Helpers._spaceBuildings = [];
                for (var i = game.space.planets.length - 1; i >= 0; i--) {
                    var planet = game.space.planets[i];
                    if (planet.buildings) {
                        for (var j = planet.buildings.length - 1; j >= 0; j--) {
                            var bld = planet.buildings[j];
                            _Helpers._spaceBuildings.push(bld);
                        }
                    }
                }
            }
            return _Helpers._spaceBuildings;
        }
    };

    var _Statistics = {
        _statTitle: 'Bot statistics',
        _collector: {
            crafts: {},
            craftsCount: {},
            counters: {},
            diplomacyCount: {}
        },
        addStatistics: function (group, name, value) {
            if (!_Statistics._collector[group].hasOwnProperty(name)) {
                _Statistics._collector[group][name] = parseFloat(value);
            } else {
                _Statistics._collector[group][name] += parseFloat(value);
            }
        },
        addCraft: function (name, value) {
            _Statistics.addStatistics('crafts', name, value);
        },
        addCraftCount: function (name, value) {
            _Statistics.addStatistics('craftsCount', name, value);
        },
        addCounter: function (name, value) {
            _Statistics.addStatistics('counters', name, value);
        },
        getStatsGroup: function () {
            var result = {
                group: [],
                title: _Statistics._statTitle
            };

            for (var statGrp in _Statistics._collector) {
                if (_Statistics._collector.hasOwnProperty(statGrp)) {
                    var groupName = statGrp;
                    var statItems = _Statistics._collector[statGrp];
                    for (var statItemIdx in statItems) {
                        if (statItems.hasOwnProperty(statItemIdx)) {
                            var item = statItems[statItemIdx];
                            result.group.push({
                                name: groupName + ': ' + statItemIdx,
                                title: groupName + ': ' + statItemIdx,
                                val: item,
                                unlocked: true
                            });
                        }
                    }
                }
            }

            return result;
        }
    };

    var _Logs = {
        _logs: {
            log2: [],
            hunt: [],
            wrkshp: [],
            trade: [],
            build: [],
            craft: []
        },
        mainLog: function(message) {
            var mes = 'BOT: ' + message;
            if (game && game.msg && game.ui) {
                game.msg(mes, 'msg');
                game.ui.renderConsoleLog();
            }
        },
        buildLog: function(message) {
            _Logs.logCustom('build', message, true);
        },
        log2: function(message) {
            _Logs.logCustom('log2', message);
        },
        logCustom: function(logName, message, withDateTime) {
            while (_Logs._logs[logName].length >= 100) {
                _Logs._logs[logName].shift();
            }
            if (withDateTime === true) {
                message = '[' + _Core.getCurrentDateTimeStr() + '] ' + message;
            }
            _Logs._logs[logName].push(message);

            if (_BotUI.currentPage === logName) {
                _BotUI.initCustomLogPage(logName);
            }
        },
        console: function(message) {
            if (console) console.log(message);
        },
        getCustomLogItem: function(logName, index) {
            if (_Logs._logs[logName].hasOwnProperty(index)) {
                return _Logs._logs[logName][index];
            }
            return '';
        },
        getCustomLogSize: function(logName) {
            return _Logs._logs[logName].length
        },
        clearCustomLog: function (logName) {
            _Logs._logs[logName] = [];
        },
        logTrade: function (message) {
            _Logs.logCustom('trade', message);
        },
        logCraft: function (message) {
            _Logs.logCustom('craft', message);
        }
    };

    var _BotSetting = {
	    auto: {
            Buy: false,
            PromoteKittens: true,
            CollectFaith: true,
            CreateSteel: true,
            CreatePlates: true,
            SendHunters: true,
            CreateManuscript: true,
            CreateWood: true,
            CreateBeams: true,
            CreateSlabs: true,
            CreateCompedium: true,
            CreateBlueprints: true,
            Trade: false,
            CreateKerosene: true,
            CreateThorium: true,
            CreateEludium: true,
            BuyReligion: true,
            FeedElders: false,
            TradeBcoins: true,
            CreateAlloy: false,
            BuySpace: true
        },
        craftLevel: 2,
        buys: {},
        space: {},
        keeps: {}
    };
	var zeroSetting = _Core.clone(_BotSetting);

	// noinspection JSUnusedGlobalSymbols
    var _BotSettingsMigrator = {
	    currentVersion: 11,
        migrate1to2: function() {
            for (var i in _BotSettings.settings) {
                if (_BotSettings.settings.hasOwnProperty(i)) {
                    if (typeof _BotSettings.settings[i].auto.CreateBlueprints === 'undefined') {
                        _BotSettings.settings[i].auto.CreateBlueprints = true;
                    }
                    if (typeof _BotSettings.settings[i].auto.CreateCompedium === 'undefined') {
                        if (typeof _BotSettings.settings[i].auto['CreateCompendium'] !== 'undefined') {
                            _BotSettings.settings[i].auto.CreateCompedium = _BotSettings.settings[i].auto['CreateCompendium'];
                            delete _BotSettings.settings[i].auto['CreateCompendium'];
                        } else {
                            _BotSettings.settings[i].auto.CreateCompedium = true;
                        }
                    }
                }
            }
            _BotSettings.version = 2;
            _BotSettings.storeSetting();
        },
        migrate2to3: function() {
            for (var i in _BotSettings.settings) {
                if (_BotSettings.settings.hasOwnProperty(i)) {
                    if (typeof _BotSettings.settings[i].auto.CreateKerosene === 'undefined') {
                        _BotSettings.settings[i].auto.CreateKerosene = true;
                    }
                }
            }
            _BotSettings.version = 3;
            _BotSettings.storeSetting();
        },
        migrate3to4: function() {
            for (var i in _BotSettings.settings) {
                if (_BotSettings.settings.hasOwnProperty(i)) {
                    if (typeof _BotSettings.settings[i].auto.CreateThorium === 'undefined') {
                        _BotSettings.settings[i].auto.CreateThorium = true;
                    }
                }
            }
            _BotSettings.version = 4;
            _BotSettings.storeSetting();
        },
        migrate4to5: function() {
            for (var i in _BotSettings.settings) {
                if (_BotSettings.settings.hasOwnProperty(i)) {
                    if (typeof _BotSettings.settings[i].auto.CreateEludium === 'undefined') {
                        _BotSettings.settings[i].auto.CreateEludium = true;
                    }
                }
            }
            _BotSettings.version = 5;
            _BotSettings.storeSetting();
        },
        migrate5to6: function() {
            for (var i in _BotSettings.settings) {
                if (_BotSettings.settings.hasOwnProperty(i)) {
                    if (typeof _BotSettings.settings[i].auto.BuyReligion === 'undefined') {
                        _BotSettings.settings[i].auto.BuyReligion = true;
                    }
                }
            }
            _BotSettings.version = 6;
            _BotSettings.storeSetting();
        },
        migrate6to7: function() {
            for (var i in _BotSettings.settings) {
                if (_BotSettings.settings.hasOwnProperty(i)) {
                    if (typeof _BotSettings.settings[i].craftLevel === 'undefined') {
                        _BotSettings.settings[i].craftLevel = 2;
                    }
                }
            }
            _BotSettings.version = 7;
            _BotSettings.storeSetting();
        },
        migrate7to8: function() {
            for (var i in _BotSettings.settings) {
                if (_BotSettings.settings.hasOwnProperty(i)) {
                    if (typeof _BotSettings.settings[i].auto.FeedElders === 'undefined') {
                        _BotSettings.settings[i].auto.FeedElders = false;
                    }
                }
            }
            _BotSettings.version = 8;
            _BotSettings.storeSetting();
        },
        migrate8to9: function() {
            for (var i in _BotSettings.settings) {
                if (_BotSettings.settings.hasOwnProperty(i)) {
                    if (typeof _BotSettings.settings[i].auto.TradeBcoins === 'undefined') {
                        _BotSettings.settings[i].auto.TradeBcoins = true;
                    }
                }
            }
            _BotSettings.version = 9;
            _BotSettings.storeSetting();
        },
        migrate9to10: function() {
            for (var i in _BotSettings.settings) {
                if (_BotSettings.settings.hasOwnProperty(i)) {
                    if (typeof _BotSettings.settings[i].auto.CreateAlloy === 'undefined') {
                        _BotSettings.settings[i].auto.CreateAlloy = false;
                    }
                }
            }
            _BotSettings.version = 10;
            _BotSettings.storeSetting();
        },
        migrate10to11: function() {
            for (var i in _BotSettings.settings) {
                if (_BotSettings.settings.hasOwnProperty(i)) {
                    if (typeof _BotSettings.settings[i].auto.BuySpace === 'undefined') {
                        _BotSettings.settings[i].auto.BuySpace = true;
                    }
                    if (typeof _BotSettings.settings[i].space !== 'object') {
                        _BotSettings.settings[i].space = {};
                    }
                }
            }
            _BotSettings.version = 11;
            _BotSettings.storeSetting();
        },
        migrateAll: function () {
	        for (var i = 1; i < _BotSettingsMigrator.currentVersion; i++) {
                if (_BotSettings.version === i) {
                    _BotSettingsMigrator['migrate' + i + 'to' + (i + 1)]();
                    _Logs.console('BOT: Migrated from ' + i + ' to ' + (i + 1));
                }
            }
        }
    };

    var _BotSettings = {
	    version: _BotSettingsMigrator.currentVersion,
        speed: 2000,
        settingIdx: 0,
	    settings: [zeroSetting],
	    init: function () {
	        for (var i = 1; i < 5; i++) {
                var newZeroSetting = _Core.clone(_BotSetting);
	            _BotSettings.settings.push(newZeroSetting);
            }
            _BotUI.initSettingsLink();
            _BotUI.initSettingsPage();
            _BotSettings.restoreAll();
        },
        toggleSetting: function (settingName) {
            var currentSettingAuto = _BotSettings.settings[_BotSettings.settingIdx].auto;
            if (typeof currentSettingAuto[settingName] === 'boolean') {
                currentSettingAuto[settingName] = !currentSettingAuto[settingName];
                _BotUI.initSettingsPage();
                _BotSettings.storeSetting();
            }
            return false;
        },
        toggleBuySetting: function (name) {
            var currentSettingBuys = _BotSettings.settings[_BotSettings.settingIdx].buys;
            if (typeof currentSettingBuys[name] === 'boolean') {
                currentSettingBuys[name] = !currentSettingBuys[name];
                _BotUI.initSettingsPage();
                _BotSettings.storeSetting();
            } else {
                currentSettingBuys[name] = true;
                _BotUI.initSettingsPage();
                _BotSettings.storeSetting();
            }
            return false;
        },
        toggleSpaceSetting: function (name) {
            var currentSettingSpace = _BotSettings.settings[_BotSettings.settingIdx].space;
            if (typeof currentSettingSpace[name] === 'boolean') {
                currentSettingSpace[name] = !currentSettingSpace[name];
                _BotUI.initSettingsPage();
                _BotSettings.storeSetting();
            } else {
                currentSettingSpace[name] = true;
                _BotUI.initSettingsPage();
                _BotSettings.storeSetting();
            }
            return false;
        },
        toggleResSetting: function (name) {
            var currentSettingKeeps = _BotSettings.settings[_BotSettings.settingIdx].keeps;
            if (typeof currentSettingKeeps[name] === 'boolean') {
                currentSettingKeeps[name] = !currentSettingKeeps[name];
                _BotUI.initSettingsPage();
                _BotSettings.storeSetting();
            } else {
                currentSettingKeeps[name] = true;
                _BotUI.initSettingsPage();
                _BotSettings.storeSetting();
            }
            return false;
        },
        restoreBuySettingOld: function() {
	        var data = _BotSettings.restore('buy', false);
            var currentSetting = _BotSettings.settings[_BotSettings.settingIdx];
	        if (typeof data === 'string') {
                currentSetting.buys = JSON.parse(data);
            } else {
                currentSetting.buys = {};
            }
        },
        restoreResSettingOld: function() {
	        var data = _BotSettings.restore('keeps', false);
            var currentSetting = _BotSettings.settings[_BotSettings.settingIdx];
	        if (typeof data === 'string') {
                currentSetting.keeps = JSON.parse(data);
            } else {
                currentSetting.keeps = {};
            }
        },
        store: function(name, value) {
            if (typeof(Storage) !== 'undefined') localStorage.setItem(name, value);
        },
        restore: function(name, asBool) {
            if (typeof asBool === 'undefined') asBool = false;
            if (typeof(Storage) !== 'undefined') {
                var aValue = localStorage.getItem(name);
                if (asBool && aValue !== null) {
                    return (aValue === 'true' || aValue === true);
                } else {
                    return aValue;
                }
            }
            else return null;
        },
        restoreAllNew: function() {
            var data = _BotSettings.restore('settings', data);
            if (data) {
                _BotSettings.settings = JSON.parse(data);
            }
            var settingIdx = _BotSettings.restore('settingsIdx');
            if (settingIdx) {
                _BotSettings.settingIdx = parseInt(settingIdx);
            }
            var version = _BotSettings.restore('version');
            if (version) {
                _BotSettings.version = parseInt(version);
            }
            var speed = _BotSettings.restore('speed');
            if (speed) {
                _BotSettings.speed = parseInt(speed);
            }

            _BotSettingsMigrator.migrateAll();
        },
        storeSetting: function() {
            var data = JSON.stringify(_BotSettings.settings);
            _BotSettings.store('settings', data);
            _BotSettings.store('settingsIdx', _BotSettings.settingIdx);
            _BotSettings.store('version', _BotSettings.version);
            _BotSettings.store('speed', _BotSettings.speed);
        },
        restoreAllOld: function() {
	        var autos = _BotSetting.auto;
	        var currentSetting = _BotSettings.settings[_BotSettings.settingIdx];
            for (var x in autos) {
                if (autos.hasOwnProperty(x)) {
                    var oldValue = _BotSettings.restore('auto' + x, true);
                    if (oldValue !== null) {
                        currentSetting.auto[x] = oldValue;
                    }
                }
            }

            _BotSettings.restoreBuySettingOld();
            _BotSettings.restoreResSettingOld();
        },
        removeOldSettings: function() {
            if (typeof(Storage) === 'undefined') return;

            var autos = _BotSetting.auto;
            for (var x in autos) {
                if (autos.hasOwnProperty(x)) {
                    localStorage.removeItem('auto' + x);
                }
            }

            localStorage.removeItem('buys');
            localStorage.removeItem('keeps');
        },
        restoreAll: function () {
	        if (_BotSettings.restore('version') === null) {
	            _BotSettings.restoreAllOld();
	            _BotSettings.removeOldSettings();
	            _BotSettings.storeSetting()
            } else {
                _BotSettings.restoreAllNew();
            }
        },
        isCheckedBuySetting: function (bld) {
            var currentSettingBuys = _BotSettings.settings[_BotSettings.settingIdx].buys;
            if (typeof currentSettingBuys[bld] !== 'undefined') {
                return currentSettingBuys[bld] === true;
            }
            return false;
        },
        isCheckedSpaceSetting: function (bld) {
            var currentSettingSpace = _BotSettings.settings[_BotSettings.settingIdx].space;
            if (typeof currentSettingSpace[bld] !== 'undefined') {
                return currentSettingSpace[bld] === true;
            }
            return false;
        },
        isCheckedResSetting: function (res) {
            var currentSettingKeeps = _BotSettings.settings[_BotSettings.settingIdx].keeps;
            if (typeof currentSettingKeeps[res] !== 'undefined') {
                return currentSettingKeeps[res] === true;
            }
            return false;
        },
        isAuto: function (autoSetting) {
            var currentSetting = _BotSettings.settings[_BotSettings.settingIdx];
            var r = currentSetting.auto[autoSetting];
            return typeof r !== 'undefined' && r;
        },
        getCraftLevel: function () {
            var currentSetting = _BotSettings.settings[_BotSettings.settingIdx];
            return currentSetting.craftLevel;
        },
        setCraftLevel: function (newLevel) {
            var currentSetting = _BotSettings.settings[_BotSettings.settingIdx].craftLevel;
            newLevel = parseInt(newLevel);
            if (newLevel > 0 && newLevel <= 100 && currentSetting !== newLevel) {
                _BotSettings.settings[_BotSettings.settingIdx].craftLevel = newLevel;
                _BotUI.initSettingsPage();
                _BotSettings.storeSetting();
            }
        }
    };

	var _BotActions = {
        craftAll: function(res) {
            if (_Helpers.isResourceUnlocked(res)) {
                _Logs.log2('Crafting ' + res);
                var minAmt = game.workshop.getCraftAllCount(res);
                if (minAmt > 0 && minAmt < Number.MAX_VALUE) {
                    var craftRatio = game.getResCraftRatio({name: res});
                    var bonus = minAmt * craftRatio;
                    _Statistics.addCraft(res, minAmt + bonus);

                    game.craftAll(res);
                    _Statistics.addCraftCount(res, minAmt);
                }
            }
        },
        craft: function(res, amount) {
            var craftRatio = game.getResCraftRatio({name: res});
            var bonus = amount * craftRatio;
            _Statistics.addCraft(res, amount + bonus);

            game.craft(res, amount);
            _Statistics.addCraftCount(res, amount);
        },
        collectAstronomy: function() {
            if (game.calendar.observeRemainingTime > 0) {
                if (typeof game.calendar.observeHandler === 'function') {
                    game.calendar.observeHandler();
                    _Statistics.addCounter('astronomy', 1);
                }
            }
        },
        catnipToWood: function() {
            var catnip = game.resPool.get('catnip');
            if (catnip.value >= catnip.maxValue) {
                var minWood = _Helpers.getMinCraft('wood');
                var wood = game.resPool.get('wood');
                if (wood.value + minWood <= wood.maxValue) {
                    _Logs.log2('Catnip to Wood x ' + minWood);

                    _BotActions.craft('wood', minWood);
                    _Statistics.addCraftCount('wood', minWood);
                }
            }
        },
        collectFaith: function() {
            var faith = game.resPool.get('faith');
            if (faith.value >= faith.maxValue) {
                _Logs.log2('Praise');

                game.religion.praise();
                _Statistics.addCounter('praise', 1);
            }
        },
        sendAllHunters: function() {
            var manpower = game.resPool.get('manpower');
            if (manpower.value >= manpower.maxValue) {
                _Logs.log2('Sending hunters');

                game.village.huntAll();
                _Statistics.addCounter('hunt', 1);

                _BotActions.craftAll('parchment');
            }
        },
        ironToSteel: function() {
            if (_Helpers.isResourceUnlocked('steel')) {
                var iron = game.resPool.get('iron');
                var coal = game.resPool.get('coal');
                if (iron.value >= iron.maxValue || coal.value >= coal.maxValue) {
                    if (coal.value >= 100 && iron.value >= 100) {
                        _Logs.log2('Iron to Steel x ALL');

                        _BotActions.craftAll('steel');
                    }
                }
            }
        },
        ironToPlates: function() {
            var iron = game.resPool.get('iron');
            var minPlate = _Helpers.getMinCraft('plate');
            if (iron.value >= (125 * minPlate) && _Helpers.isResourceUnlocked('plate')) {
                _Logs.log2('Iron to Plate x ' + minPlate);
                _BotActions.craft('plate', minPlate);
            }
        },
        woodToBeams: function() {
            var wood = game.resPool.get('wood');
            if (wood.value >= wood.maxValue && _Helpers.isResourceUnlocked('beam')) {
                var minVal = _Helpers.getMinCraft('beam');
                _Logs.log2('Wood to Beam x ' + minVal);
                _BotActions.craft('beam', minVal);
            }
        },
        mineralsToSlabs: function() {
            var minerals = game.resPool.get('minerals');
            if (minerals.value >= minerals.maxValue && _Helpers.isResourceUnlocked('slab')) {
                var minVal = _Helpers.getMinCraft('slab');
                _Logs.log2('Minerals to Slab x ' + minVal);
                _BotActions.craft('slab', minVal);
            }
        },
        oilToKerosene: function() {
            var oil = game.resPool.get('oil');
            if (oil.value >= oil.maxValue && _Helpers.isResourceUnlocked('kerosene')) {
                var minVal = _Helpers.getMinCraft('kerosene');
                _Logs.log2('Oil to Kerosene x ' + minVal);
                _BotActions.craft('kerosene', minVal);
            }
        },
        uraniumToThorium: function() {
            var uranium = game.resPool.get('uranium');
            if (uranium.value >= uranium.maxValue && _Helpers.isResourceUnlocked('thorium')) {
                var minVal = _Helpers.getMinCraft('thorium');
                _Logs.log2('Uranium to Thorium x ' + minVal);
                _BotActions.craft('thorium', minVal);
            }
        },
        cultureToManuscript: function() {
            var culture = game.resPool.get('culture');
            var parchment = game.resPool.get('parchment');
            var minVal = _Helpers.getMinCraft('manuscript');
            if (culture.value >= culture.maxValue && _Helpers.isResourceUnlocked('manuscript') && culture.value >= (400 * minVal) && parchment.value >= (25 * minVal)) {
                _Logs.log2('Culture to Manuscript x ' + minVal);
                _BotActions.craft('manuscript', minVal);
            }
        },
        makeABuy: function(itemName) {
            var btn = $('.bldGroupContainer').find('div.btnContent').find('span').filter(function(){
                var t = $(this).text();
                return t.indexOf(itemName + ' (') === 0 || t === itemName;
            });
            if (btn&& btn.length === 1) {
                _Logs.mainLog('Autobuy ' + itemName);
                _Logs.buildLog(itemName);
                btn.click();
            }
        },
        promoteKittens: function() {
            var gold = game.resPool.get('gold');
            if (!gold.unlocked) return;
            if (gold.value >= 15 && gold.value >= gold.maxValue && _Helpers.getKittensForPromoteInfo().count > 0) {
                game.village.promoteKittens();

                _Statistics.addCounter('promote', 1);
            }
        },
        scienceToCompedium: function() {
            var science = game.resPool.get('science');
            var manuscript = game.resPool.get('manuscript');
            var minVal = _Helpers.getMinCraft('compedium');
            if (science.value >= science.maxValue && _Helpers.isResourceUnlocked('compedium') && manuscript.value >= (50 * minVal) && science.value >= (10000 * minVal)) {
                _Logs.log2('Science/Manuscript to Compedium x ' + minVal);
                _BotActions.craft('compedium', minVal);
            }
        },
        scienceToBlueprints: function() {
            var science = game.resPool.get('science');
            var compediums = game.resPool.get('compedium');
            var minVal = _Helpers.getMinCraft('blueprint');
            if (science.value >= science.maxValue && _Helpers.isResourceUnlocked('blueprint') && compediums.value >= (25 * minVal) && science.value >= (25000 * minVal)) {
                _Logs.log2('Science/Compedium to Blueprint x ' + minVal);
                _BotActions.craft('blueprint', minVal);
            }
        },
        sendZebraCaravan: function () {
            var zebras = game.diplomacy.get('zebras');
            if (zebras.unlocked) {
                var titanium = game.resPool.get('titanium');
                if (titanium.value < titanium.maxValue) {
                    var gold = game.resPool.get('gold');
                    var power = game.resPool.get('manpower');
                    var slab = game.resPool.get('slab');
                    if (gold.value >= gold.maxValue && power.value >= 50 && slab.value >= 50) {
                        _Logs.logTrade('[Zebra trade] x 1');
                        game.diplomacy.tradeMultiple(zebras, 1);

                        _Statistics.addStatistics('diplomacyCount', 'zebras', 1);
                    }
                }
            }
        },
        sendNagasCaravan: function () {
            var nagas = game.diplomacy.get('nagas');
            if (nagas.unlocked) {
                var ivory = game.resPool.get('ivory');
                var gold = game.resPool.get('gold');
                if (ivory.value > 500 && ivory.perTickCached > 0 && gold.value >= gold.maxValue) {
                    var minerals = game.resPool.get('minerals');
                    var power = game.resPool.get('manpower');
                    if (minerals.value < minerals.maxValue && power.value >= 50) {
                        _Logs.logTrade('[Nagas trade] x 1');
                        game.diplomacy.tradeMultiple(nagas, 1);

                        _Statistics.addStatistics('diplomacyCount', 'nagas', 1);
                    }
                }
            }
        },
        sendDragonsCaravan: function () {
            var dragons = game.diplomacy.get('dragons');
            if (dragons.unlocked) {
                var uranium = game.resPool.get('uranium');
                if (uranium.unlocked && uranium.value < uranium.maxValue) {
                    var titanium = game.resPool.get('titanium');
                    var gold = game.resPool.get('gold');
                    var power = game.resPool.get('manpower');
                    if (titanium.value >= titanium.maxValue && titanium.value >= 250 && gold.value >= gold.maxValue && power.value >= 50) {
                        _Logs.logTrade('[Dragons trade] x 1');
                        game.diplomacy.tradeMultiple(dragons, 1);

                        _Statistics.addStatistics('diplomacyCount', 'dragons', 1);
                    }
                }
            }
        },
        turnOffMoonOutpost: function () {
            var bld = game.space.getBuilding('moonOutpost');
            if (bld.val > 0 && bld.on > 0) {
                _Logs.mainLog('No uranium: Turn Off MoonOutpost');
                bld.on--;
            }
        },
        unobtainiumToEludium: function () {
            var unobtainium = game.resPool.get('unobtainium');
            if (unobtainium.value >= unobtainium.maxValue && _Helpers.isResourceUnlocked('eludium')) {
                var alloy = game.resPool.get('alloy');
                if (unobtainium.value >= 1000 && alloy.value >= 2500) {
                    var minVal = _Helpers.getMinCraft('eludium');
                    _Logs.log2('Unobtainium to Eludium x ' + minVal);
                    _BotActions.craft('eludium', minVal);
                }
            }
        },
        buyModelBuilding: function(bld, isReligion, isSpace) {
            var prices = _Helpers.getPricesForModel(bld, isReligion, isSpace);
            if (_Helpers.isEnoughResourcesForPrice(prices)) {
                if (bld.breakIronWill) {
                    game.ironWill = false;
                }

                game.resPool.payPrices(prices);
                bld.val++;
                bld.on++;

                if (bld.unlocks) {
                    game.unlock(bld.unlocks);
                }

                if (bld.upgrades) {
                    game.upgrade(bld.upgrades);
                }

                _Logs.mainLog('Autobuy ' + bld.label);

                if (isReligion) {
                    _Logs.buildLog('Religion: ' + bld.label);
                    _Statistics.addCounter('buyReligion', 1);
                } else if (isSpace) {
                    _Logs.buildLog('Space: ' + bld.label);
                    _Statistics.addCounter('buySpace', 1);
                } else {
                    _Statistics.addCounter('buyModel', 1);
                }
            }
        },
        buyReligion: function () {
            if (game.religionTab.visible) {
                var blds = game.religion.religionUpgrades;
                for (var i in blds) {
                    if (blds.hasOwnProperty(i)) {
                        var bld = blds[i];
                        var isVisible = bld.faith <= game.religion.faith;
                        var needBuy = !bld.noStackable || bld.val < 1;
                        if (isVisible && needBuy) {
                            _BotActions.buyModelBuilding(bld, true);
                        }
                    }
                }
            }
        },
        craftResource: function(resName, minimumAmountInStorage) {
            var res = game.resPool.get(resName);
            if (res.value < minimumAmountInStorage && _Helpers.isResourceUnlocked(resName)) {
                var craftRatio = game.getResCraftRatio({name: resName});
                var craftAmt = 1 + craftRatio;
                var needCrafts = Math.ceil((minimumAmountInStorage - res.value) / craftAmt);
                _Logs.log2('"' + resName + '" craft x ' + needCrafts);
                _BotActions.craft(resName, needCrafts);
            }
        },
        feedElders: function () {
            var ncorns = game.resPool.get('necrocorn');
            if (ncorns.value >= 1) {
                var elders = game.diplomacy.get('leviathans');
                var markerCap = game.religion.getZU('marker').val * 5 + 5;
                if (elders.unlocked && elders.energy < markerCap) {
                    _Logs.mainLog('Feeding Elders');
                    _Logs.log2('Feeding Elders');
                    game.diplomacy.feedElders();
                }
            }
        },
        sellBcoins: function () {
            if (game.diplomacy.get("leviathans").unlocked) {
                if (game.science.get('blackchain').researched && game.resPool.get('blackcoin').value > 0) {
                    _Logs.log2('Sell all B-Coins');
                    game.diplomacy.sellEcoin();
                }
            }
        },
        buyBcoins: function () {
            if (game.diplomacy.get("leviathans").unlocked) {
                if (game.science.get('blackchain').researched && game.resPool.get('relic').value > 0) {
                    _Logs.log2('Buy B-Coins');
                    game.diplomacy.buyEcoin();
                }
            }
        },
        titaniumToAlloy: function () {
            var titanium = game.resPool.get('titanium');
            var steel = game.resPool.get('steel');
            if (titanium.value >= titanium.maxValue && steel.value > 75 && titanium.value > 10 && _Helpers.isResourceUnlocked('alloy')) {
                var minVal = _Helpers.getMinCraft('alloy');
                _Logs.log2('Titanium to Alloy x ' + minVal);
                _BotActions.craft('alloy', minVal);
            }
        }
	};

	var _Cytoscape = {
        cy: undefined,
        cyElements: undefined,
        $scienceLegend: undefined,
        $scienceLegendTitle: undefined,
        $scienceLegendDescr: undefined,
        $scienceLegendPrice: undefined,
        $scienceLegendUnlock: undefined,
        isCyInited: function() {
            return typeof _Cytoscape.cy !== 'undefined';
        },
        initCy: function() {
            var el = document.getElementById('scienceTree');
            if (!_Cytoscape.isCyInited() && typeof cytoscape !== 'undefined' && el !== null) {
                var elems = [], elemsPositions = {};

                var _addNode = function (name, connectTo, dx ,dy) {
                    var t = game.science.get(name);
                    if (!t) return;
                    while (typeof elemsPositions[dx + '_' + dy] !== 'undefined') {
                        dy += 100;
                    }
                    elemsPositions[dx + '_' + dy] = 1;
                    var nodeData = {
                        group: 'nodes',
                        data: {
                            id: t.name,
                            researched: t.researched,
                            unlocked: t.unlocked
                        },
                        position: {
                            x: dx,
                            y: dy
                        },
                        grabbable: false,
                        locked: false
                    };
                    /*if (typeof connectTo !== 'undefined') {
                        nodeData.data.parent = connectTo;
                    }*/
                    elems.push(nodeData);
                    if (typeof connectTo !== 'undefined') {
                        var linkName = t.name + '_' + connectTo;
                        elems.push({
                            group: 'edges',
                            data: {
                                id: linkName,
                                source: connectTo,
                                target: t.name
                            }
                        });
                    }
                    if (typeof t.unlocks !== 'undefined' && typeof t.unlocks.tech === 'object') {
                        var offsetY = 0;
                        for (var x in t.unlocks.tech) {
                            if (t.unlocks.tech.hasOwnProperty(x)) {
                                _addNode(t.unlocks.tech[x], name, dx + 150, dy + offsetY);
                                offsetY += 100;
                            }
                        }
                    }
                };
                _addNode('calendar', undefined, 100, 100);

                _Cytoscape.cyElements = elems;

                _Cytoscape.cy = cytoscape({
                    container: el, // container to render in
                    zoom: 0.5,
                    wheelSensitivity: 0.25,
                    style: [
                        {
                            selector: 'node',
                            style: {
                                'label': 'data(id)',
                                'background-color': function( ele ) {
                                    var unlocked = ele.data('unlocked');
                                    var researched = ele.data('researched');
                                    return researched ? 'green' : (unlocked ? 'lightblue' : 'gray');
                                }
                            }
                        },
                        {
                            selector: ':selected',
                            style: {
                                'background-color': 'white',
                                'border-width': '2px',
                                'border-style': 'solid',
                                'border-color': 'red'
                            }
                        }
                    ]
                });

                _Cytoscape.cy.add(_Cytoscape.cyElements);

                _Cytoscape.cy.on('click', _Cytoscape.onScienceNodeClick);
            }
        },
        openPanel: function () {
            if (_Cytoscape.isCyInited()) {
                $('#scienceTree').show();
            } else {
                _Cytoscape.initCy();
            }
        },
        onOpenScienceTreeClick: function () {
            _Cytoscape.openPanel();
        },
        onCloseScienceTreeClick: function() {
            $('#scienceTree').hide();
        },
        onScienceNodeClick: function (e) {
            var clickedNode = e.target;
            var data = clickedNode.hasOwnProperty('0') ? clickedNode[0]._private.data : undefined;
            if (typeof data !== 'undefined') {
                var techName = data.id;
                if (techName.indexOf('_') === -1) {
                    var tech = game.science.get(techName);
                    _Cytoscape.initScienceLabel(tech);
                    _Cytoscape.$scienceLegend.show();
                } else {
                    _Cytoscape.$scienceLegend.hide();
                }
            } else {
                _Cytoscape.$scienceLegend.hide();
            }
        },
        getTechPriceTableHtml: function(tech) {
            var prices = game.science.getPrices(tech);
            var priceTable = '<table border="0" cellpadding="0" cellspacing="0">';
            for (var pid in prices) {
                if (prices.hasOwnProperty(pid)) {
                    var price = prices[pid];
                    var resName = $I('resources.' + price.name + '.title');
                    var value = game.getDisplayValueExt(parseInt(price.val));
                    priceTable += '<tr><td>' + resName + '</td><td>' + value + '</td></tr>';
                }
            }
            priceTable += '</table>';

            return priceTable;
        },
        getSpaceUnlockedByTech: function(tech) {
            var unlockedSpace = [];
            var allSpacePrograms = game.space.metaCache;
            for (var i in allSpacePrograms) {
                if (allSpacePrograms.hasOwnProperty(i)) {
                    var program = allSpacePrograms[i];
                    if (typeof program.requiredTech !== 'undefined') {
                        for (var x in program.requiredTech) {
                            if (program.requiredTech.hasOwnProperty(x)) {
                                var unl = program.requiredTech[x];
                                if (unl === tech.name) {
                                    unlockedSpace.push({
                                        label: program.label
                                    });
                                }
                            }
                        }
                    }
                }
            }
            return unlockedSpace;
        },
        getTechUnlocksTableHtml: function(tech) {
            var br = '<br/>', hr = '<hr/>';
            var unlocksTable = '<table border="0" cellpadding="0" cellspacing="0"><tr>';
            var _addToUnlocksTable = function (title, techUnlocksUid, nameCallback) {
                var unlockArr = tech.unlocks[techUnlocksUid];
                if (typeof unlockArr === 'undefined') return;
                unlocksTable += '<td>' + title + ':' + hr;
                for (var iid in unlockArr) {
                    if (unlockArr.hasOwnProperty(iid)) {
                        var aName = nameCallback(unlockArr[iid]);
                        unlocksTable += aName + br;
                    }
                }
                unlocksTable += '</td>';
            };
            var _translate = function(key, defValue) {
                return i18nLang.messages[key] ? $I(key) : defValue;
            };

            _addToUnlocksTable( $I('tab.name.workshop'), 'crafts', function(name) {
                return $I('resources.' + name + '.title');
            });

            _addToUnlocksTable( $I('tab.name.science'), 'tech', function(name) {
                return game.science.get(name).label;
            });

            _addToUnlocksTable( $I('workshop.upgradePanel.label'), 'upgrades', function(name) {
                return _translate('workshop.' + name + '.label', name);
            });

            _addToUnlocksTable( 'Buildings', 'buildings', function(name) {
                return _translate('buildings.' + name + '.label', name);
            });

            _addToUnlocksTable( 'Jobs', 'jobs', function(name) {
                return $I('village.job.' + name);
            });

            _addToUnlocksTable( 'Tabs', 'tabs', function(name) {
                return $I('tab.name.' + name);
            });

            _addToUnlocksTable( 'Chronoforge', 'chronoforge', function(name) {
                return _translate('time.cfu.' + name + '.label', name);
            });

            _addToUnlocksTable( 'Void Space', 'voidSpace', function(name) {
                return _translate('time.vsu.' + name + '.label', name);
            });

            _addToUnlocksTable( $I('challendge.panel.label'), 'challenges', function(name) {
                return _translate('challendge.' + name + '.label', name);
            });

            _addToUnlocksTable( 'Stages', 'stages', function(name) {
                if (typeof name === 'object') {
                    if (name.bld && typeof name.stage !== 'undefined') {
                        var bld = game.bld.get(name.bld);
                        var newName = name.stage;
                        if (bld.stages && bld.stages[name.stage]) {
                            newName = bld.stages[name.stage].label;
                        }
                        return _translate('buildings.' + name.bld + '.label', name.bld) + ' (' + newName + ')';
                    } else {
                        return JSON.stringify(name);
                    }
                }
                return name;
            });

            var spaceUnlocked = _Cytoscape.getSpaceUnlockedByTech(tech);
            if (spaceUnlocked.length > 0) {
                unlocksTable += '<td>' + $I('tab.name.space') + ':' + hr;
                for (var i in spaceUnlocked) {
                    if (spaceUnlocked.hasOwnProperty(i)) {
                        unlocksTable += spaceUnlocked[i].label + br;
                    }
                }
                unlocksTable += '</td>';
            }

            unlocksTable += '</tr></table>';

            return unlocksTable;
        },
        initScienceLabel: function (tech) {
            _Cytoscape.$scienceLegendTitle.text(tech.label);
            _Cytoscape.$scienceLegendDescr.text(tech.description);

            var priceTable = _Cytoscape.getTechPriceTableHtml(tech);
            _Cytoscape.$scienceLegendPrice.html(priceTable);

            if (tech.unlocks) {
                var unlocksTable = _Cytoscape.getTechUnlocksTableHtml(tech);
                _Cytoscape.$scienceLegendUnlock.html(unlocksTable).show();
            } else {
                _Cytoscape.$scienceLegendUnlock.hide();
            }
        },
        initScienceLegend: function() {
            var header = '<div id="scienceLegendTitle" class="legendBlock">Название</div>';
            var descr = '<div id="scienceLegendDescr" class="legendBlock">Описание длинное</div>';
            var prices = '<div id="scienceLegendPrice" class="legendBlock">Цена: 1 crystal</div>';
            var unlocks = '<div id="scienceLegendUnlock" class="legendBlock">Открывает: Religion</div>';
            var blocks = header + descr + prices + unlocks;
            var inner = '<div id="scienceLegendInner">' + blocks + '</div>';
            var scienceDiv = '<div id="scienceLegend" style="display:none">' + inner + '</div>';
            $('#scienceTree').prepend(scienceDiv);
            _Cytoscape.$scienceLegend = $('#scienceLegend');
            _Cytoscape.$scienceLegendTitle = $('#scienceLegendTitle');
            _Cytoscape.$scienceLegendDescr = $('#scienceLegendDescr');
            _Cytoscape.$scienceLegendPrice = $('#scienceLegendPrice');
            _Cytoscape.$scienceLegendUnlock = $('#scienceLegendUnlock');
        },
        initScienceTree: function() {
            var closeDivButton = '<a href="#" id="closeScienceTree" onclick="KittenTools.CY.onCloseScienceTreeClick()">X</a>';
            var scienceDiv = '<div id="scienceTree" style="display:none">' + closeDivButton + '</div>';
            $('#gamePageContainer').prepend(scienceDiv);
        },
        init: function () {
            _Cytoscape.initScienceTree();
            _Cytoscape.initScienceLegend();
        }
    };

	var _Wiki = {
	    $wikiPopup: undefined,
        _wikiUrl: 'http://bloodrizer.ru/games/kittens/wiki/index.php?page=',
        wikiPages: [
            'Main page',
            'Resources',
            'Technologies',
            'Paragon',
            'Metaphysics',
            'Religion',
            'Space',
            'Time',
            'Achievements'
        ],
        getWikiPageLinksHtml: function() {
	        var result = [];
	        result.push('<div class="linkBlock">');
	        for (var i in _Wiki.wikiPages) {
	            if (_Wiki.wikiPages.hasOwnProperty(i)) {
	                var name = _Wiki.wikiPages[i];
	                var nameUrl = name.replace(' ', '+');
	                result.push('<a href="#" onclick="KittenTools.Wiki.onWikiClick(\'' + nameUrl + '\')">' + name + '</a>');
                }
            }
	        result.push('</div>');
	        return result.join('');
        },
	    init: function() {
            var closeDivButton = '<a href="#" id="closeWikiPopup" onclick="KittenTools.Wiki.onCloseWikiClick()">X</a>';
            var pageLinks = _Wiki.getWikiPageLinksHtml();
            var inner = '<iframe id="wikiFrame"></iframe>';
            var scienceDiv = '<div id="wikiPopup" style="display:none">' + closeDivButton + pageLinks + inner + '</div>';
            $('#gamePageContainer').prepend(scienceDiv);
            _Wiki.$wikiPopup = $('#wikiPopup');
        },
	    onOpenWikiClick: function () {
            _Wiki.$wikiPopup.show();
            return false;
        },
        onCloseWikiClick: function () {
            _Wiki.$wikiPopup.hide();
        },
        onWikiClick: function (pageName) {
            document.getElementById('wikiFrame').src = _Wiki._wikiUrl + pageName;
        }
    };

	var _BotInfoPage = {
        _oldEnergyReserves: undefined,
	    getButtonsHtml: function() {
	        var inner = '<a href="#" onclick="KittenTools.CY.onOpenScienceTreeClick()">Show Tech tree</a>';
            inner += ' | ';
            inner += '<a href="#" onclick="KittenTools.Wiki.onOpenWikiClick()">Wiki</a>' + _br;
            return inner;

        },
        getMainBlockHtml: function() {
            var inner = '';
            var kittensPromoteInfo = _Helpers.getKittensForPromoteInfo();
            inner += '- Need promote: ' + kittensPromoteInfo.count + _br;
            if (kittensPromoteInfo.count) {
                inner += '- Gold for promote: ' + kittensPromoteInfo.gold + _br;
            }
            inner += '- Rift chance: ' + _Core.chanceToStr(_Helpers.getUnicornRiftChance()) + _br;
            inner += '- Astronomy chance: ' + _Core.chanceToStr(_Helpers.getAstronomyChance()) + _br;
            var timeForCorruption = _Core.secondsToTimeStr(_Helpers.getSecondsForOneCorruption());
            inner += '- To Corruption: ' + timeForCorruption + _br;
            inner += '- Alicorn chance: ' + _Core.chanceToStr(_Helpers.getAlicornChance()) + _br;
            var alicornsPerSecond = _Helpers.getAlicornsPerSecond();
            inner += '- Alicorn/sec: ' + _Core.floatToStr(alicornsPerSecond, 5) + _br;
            var timeCrystalRatio = 1 + game.getEffect('tcRefineRatio');
            inner += '- Time crytals/sac: ' + _Core.floatToStr(timeCrystalRatio, 3) + _br;
            var eldersChance = _Helpers.getEldersChance();
            inner += '- Leviathans chance/year: ' + _Core.chanceToStr(eldersChance) + _br;

            return inner;

        },
        getChronoBlockHtml: function() {
            if (!game.bld.get('chronosphere').on) return null;

            var inner = '- Seasons to TemporalParadox: ' + game.calendar.futureSeasonTemporalParadox + _br;
            inner += '- Days in paradox: ' + _Helpers.getDaysInParadox() + _br;
            var voidInDay = _Helpers.getVoidPerDay();
            inner += '- Void/day: ' + voidInDay.min + '..' + voidInDay.max + ' (' + voidInDay.average + ' avg.)' + _br;
            inner += '- Void/paradox: ' + (_Helpers.getDaysInParadox() * voidInDay.average) + ' avg.' + _br;
            if (_BotUI.lastVoidGain) {
                inner += '- Last void gain: ' + _BotUI.lastVoidGain + _br;
            }
            return inner;
        },
        getAiCoreBlockHtml: function() {
            var gflops = game.resPool.get('gflops').value;
            if (gflops <= 0) return null;

            var inner = '';
            var gflopsProd = _Helpers.getGflopsProduction();
            var gflopsCons = _Helpers.getGflopsConsumption();
            inner += '- Gflops: ' + game.getDisplayValueExt(_Helpers.getGflopsValue(), false, false, 3) + _br;
            if (gflopsProd > 0) {
                inner += '- Gflops prod.: ' + game.getDisplayValueExt(gflopsProd, '+', false, 2) + _br;
            }
            if (gflopsCons > 0) {
                inner += '- Gflops cons.: -' + game.getDisplayValueExt(gflopsCons, false, false, 2) + _br;
            }
            if (gflopsProd > gflopsCons) {
                var maxGflops = Math.exp(15);
                if (gflops < maxGflops) {
                    var timeToAI = (maxGflops - gflops) / (gflopsProd - gflopsCons);
                    inner += '- Apocalypse in: ' + game.toDisplaySeconds(timeToAI) + _br;
                }
            } else if (gflopsProd < gflopsCons) {
                var timeToZero = gflops / (gflopsCons - gflopsProd);
                inner += '- Gflops to zero: ' + game.toDisplaySeconds(timeToZero) + _br;
            }
            return inner;
        },
        getEnergyBlockHtml: function() {
            var inner = '';
            if (typeof _BotInfoPage._oldEnergyReserves !== 'undefined' && game.calendar.day <= 1) {
                var reserves = _BotInfoPage._oldEnergyReserves;
            } else {
                reserves = _Helpers.getEnergyReserves();
                _BotInfoPage._oldEnergyReserves = reserves;
            }
            for (var i in reserves) {
                if (reserves.hasOwnProperty(i)) {
                    var reserve = reserves[i];
                    var energyStr = _Core.floatToStr(reserve.reserve, 3);
                    if (reserve.reserve < 0) {
                        energyStr = '<span style="color:red">' + energyStr + '</span>';
                    }
                    inner += '- ' + reserve.title + ': ' + energyStr + _br;
                }
            }
	        return inner;
        },
        getBcoinBlockHtml: function() {
            var inner = '';
            if (game.science.get('blackchain').researched || game.resPool.get('blackcoin').value > 0) {
                var bcoinPerSec = _Helpers.getMaxBcoinPriceChangePerSecond();
                inner += '- Max change/sec: ' + _Core.floatToStr(bcoinPerSec, 2) + _br;
                if (bcoinPerSec > 0) {
                    inner += '- Min value: ' + _Core.floatToStr(game.calendar.cryptoPriceMax * 0.7, 2) + _br;
                    var curValue = _Core.floatToStr(game.calendar.cryptoPrice, 2);
                    if ((game.calendar.cryptoPriceMax - game.calendar.cryptoPrice) / bcoinPerSec < 1000) {
                        curValue = '<span style="color:red">' + curValue + '</span>';
                    }
                    inner += '- Current value: ' + curValue + _br;
                    inner += '- Max value: ' + _Core.floatToStr(game.calendar.cryptoPriceMax, 2) + _br;
                    var timeToMax = (game.calendar.cryptoPriceMax - game.calendar.cryptoPrice) / (bcoinPerSec * 0.3 * 0.5) * 2; // 0.3 - chance to increase, 0.5 - random chance, 2 - seconds/game day
                    inner += '- To max: ' + game.toDisplaySeconds(timeToMax) + _br;
                    if (_BotSettings.isAuto('TradeBcoins')) {
                        inner += '- Auto sell: ' + _Core.floatToStr(game.calendar.cryptoPriceMax - 10 * bcoinPerSec, 2) + _br;
                    }
                }
            }
	        return inner;
        },
        getFaithBlockHtml: function() {
	        var inner = '';
            var faithBonusBeforeReset = _Helpers.getFaithBonus(false);
            var faithBonusAfterReset = _Helpers.getFaithBonus(true);
            inner += '- Faith reset: ' + game.getDisplayValueExt((faithBonusAfterReset - faithBonusBeforeReset) * 100, '+', false, 1) + '%' + _br;
            var needNextLevel = _Helpers.getNextTranscendPrice();
            inner += '- Faith ratio: ' + game.getDisplayValueExt(game.religion.faithRatio, false, false, 1) + _br;
            inner += '- Faith ratio on reset: ' + game.getDisplayValueExt(_Helpers.getFaithRatio(true), false, false, 1) + _br;
            inner += '- Transcend price: ' + game.getDisplayValueExt(needNextLevel, false, false, 1) + _br;
            if (game.religion.faithRatio < needNextLevel) {
                var progressPercentage = game.toDisplayPercentage(game.religion.faithRatio / needNextLevel, 2, true);
                inner += '- Transcend progress: ' + progressPercentage + '%' + _br;
            } else {
                var newRatio = game.religion.faithRatio - needNextLevel;
                var newFaithBonus = game.religion.getTriValueReligion(newRatio);
                inner += '- Transcend new bonus: ' + game.toDisplayPercentage(newFaithBonus, 2, true) + _br;
            }
	        return inner;
        },
        getProductionBonusBlockHtml: function() {
            var inner = '';
            var productionBonus = _Helpers.getProductionBonus();
            var productionBonusMax = _Helpers.getProductionBonus(true);
            var productionBonusAddTranscedence = _Helpers.getProductionBonus(true, 1, 0);
            var productionBonusAddObelisk = _Helpers.getProductionBonus(true, 0, 1);
            inner += '- Bonus: ' + game.toDisplayPercentage(productionBonus / 100, 2, true) + '%' + _br;
            inner += '- Max bonus: ' + game.toDisplayPercentage(productionBonusMax / 100, 2, true) + '%' + _br;
            inner += '- On +1 Transcend: ' + game.toDisplayPercentage(productionBonusAddTranscedence / 100, 2, true) + '%' + _br;
            inner += '- On +1 Obelisk: ' + game.toDisplayPercentage(productionBonusAddObelisk / 100, 2, true) + '%' + _br;
            return inner;
        },
        getTradesBlockHtml: function() {
            var tradeRatio = game.diplomacy.getTradeRatio();
            var spiceMax = 25 + 49 + 49 * tradeRatio;
            var inner = '- Blueprint chance: 10% (fixed)' + _br;
            inner += '- Spice chance: 35% (fixed)' + _br;
            inner += '- Spice amount max: ' + parseFloat(spiceMax).toFixed(2) + _br;
            inner += '- Trade ratio: ' + _Core.chanceToStr(tradeRatio + 1) + _br;
	        return inner;
        },
        getFriendlyTradesBlockHtml: function() {
	        var inner = '';
            var gameStanding = _Helpers.getGameStandingRatio();
            for (var rid in game.diplomacy.races) {
                if (game.diplomacy.races.hasOwnProperty(rid)) {
                    var r = game.diplomacy.races[rid];
                    if (r.attitude === 'friendly' && r.standing) {
                        var rStanding = r.standing * 100 + gameStanding/2;
                        inner += '- ' + r.title +': ' + _Core.percentToStr(rStanding) + _br;
                    }
                }
            }
	        return inner;
        },
        getHostileTradesBlockHtml: function() {
	        var inner = '';
            var gameStanding = _Helpers.getGameStandingRatio();
            for (var rid in game.diplomacy.races) {
                if (game.diplomacy.races.hasOwnProperty(rid)) {
                    var r = game.diplomacy.races[rid];
                    if (r.attitude === 'hostile' && r.standing) {
                        var rStanding = r.standing * 100 + gameStanding;
                        inner += '- ' + r.title +': ' + _Core.percentToStr(rStanding) + _br;
                    }
                }
            }
	        return inner;
        },
        getNeutralTradesBlockHtml: function() {
            var tradeRatio = game.diplomacy.getTradeRatio();
            var dragons = game.diplomacy.get('dragons');
            var dragonsUranium = dragons.sells[0];
            var minDragonsUranium = (1 - dragonsUranium.delta / 2) * (1 + tradeRatio);
            var maxDragonsUranium = (1 + dragonsUranium.delta / 2) * (1 + tradeRatio);
            var inner = '- ' + dragons.title +' uranium: ' + parseFloat(minDragonsUranium).toFixed(2)
                + ' - ' + parseFloat(maxDragonsUranium).toFixed(2) + _br;
            inner += '- ' + dragons.title +' trade chance: 95%' + _br;
	        return inner;
        },
        getZebrasTradeBlockHtml: function() {
            var zebraTitanium = _Helpers.getZebraTitanium();
            var inner = '- Titan chance: ' + _Core.percentToStr(zebraTitanium.percent)+ _br;
            inner += '- Titan amount: ' + parseFloat(zebraTitanium.value).toFixed(2) + _br;
	        return inner;
        },
        getMagnetoBlockHtml: function() {
            var magnetoBonus = _Helpers.getMagnetoBonus();
            var magnetoBonusAddSteam = _Helpers.getMagnetoBonus(1);
            var magnetoBonusAddMagneto = _Helpers.getMagnetoBonus(0, 1);
            var inner = '- Current: ' + _Core.chanceToStr(magnetoBonus) + _br;
            inner += '- On +1 Steam: ' + _Core.chanceToStr(magnetoBonusAddSteam) + _br;
            inner += '- On +1 Magneto: ' + _Core.chanceToStr(magnetoBonusAddMagneto) + _br;
	        return inner;
        },
        getEldersTradeBlockHtml: function() {
	        var inner = '';
            var elders = game.diplomacy.get('leviathans');
            var pyramidVal = game.religion.getZU('blackPyramid').val;
            if (pyramidVal > 0 || elders.unlocked) {
                var items = _Helpers.getDiplomacyTradeValues(elders);
                for (var i in items) {
                    if (items.hasOwnProperty(i)) {
                        var item = items[i];
                        var minStr = _Core.floatToStr(item.min, 2);
                        var maxStr = _Core.floatToStr(item.max, 2);
                        var title = _Helpers.getResourceTitle(i);
                        var chanceStr = _Core.chanceToStr(item.chance);
                        if (minStr !== maxStr) {
                            inner += '- ' + title + ': ' + minStr + ' - ' + maxStr + ' (' + chanceStr + ')' + _br;
                        } else {
                            inner += '- ' + title + ': ' + minStr + ' (' + chanceStr + ')' + _br;
                        }
                    }
                }
            }
	        return inner;
        },
        getBlockHtml: function(blockTitle, blockFunction) {
            if (typeof blockFunction === 'function') {
                var block = blockFunction();
                if (block !== '' && typeof block !== 'undefined' && block !== null) {
                    var inner = _br;
                    inner += blockTitle + ':' + _br;
                    inner += block;
                    return inner;
                }
            }
            return '';
        },
	    initInfoPage: function () {
            var inner = '';

            inner += _BotInfoPage.getButtonsHtml();

            inner += _BotInfoPage.getBlockHtml('Main', _BotInfoPage.getMainBlockHtml);
            inner += _BotInfoPage.getBlockHtml('Void TemporalParadox', _BotInfoPage.getChronoBlockHtml);
            inner += _BotInfoPage.getBlockHtml('AI Cores', _BotInfoPage.getAiCoreBlockHtml);
            inner += _BotInfoPage.getBlockHtml('Energy', _BotInfoPage.getEnergyBlockHtml);
            inner += _BotInfoPage.getBlockHtml('BCoin', _BotInfoPage.getBcoinBlockHtml);
            inner += _BotInfoPage.getBlockHtml('Faith', _BotInfoPage.getFaithBlockHtml);
            inner += _BotInfoPage.getBlockHtml('Production bonus', _BotInfoPage.getProductionBonusBlockHtml);
            inner += _BotInfoPage.getBlockHtml('Trades', _BotInfoPage.getTradesBlockHtml);
            inner += _BotInfoPage.getBlockHtml('Friendly trades (+25% res)', _BotInfoPage.getFriendlyTradesBlockHtml);
            inner += _BotInfoPage.getBlockHtml('Hostile trades chance', _BotInfoPage.getHostileTradesBlockHtml);
            inner += _BotInfoPage.getBlockHtml('Neutral trades', _BotInfoPage.getNeutralTradesBlockHtml);
            inner += _BotInfoPage.getBlockHtml('Zebras trade', _BotInfoPage.getZebrasTradeBlockHtml);
            inner += _BotInfoPage.getBlockHtml('Magneto bonus', _BotInfoPage.getMagnetoBlockHtml);
            inner += _BotInfoPage.getBlockHtml('Elders trade', _BotInfoPage.getEldersTradeBlockHtml);

            $('#IRCChatInner').html(inner);
        }
    };

	var _BotSettingsPage = {
	    getLabelForAutoSetting: function(x) {
	        switch (x) {
                case 'Buy': return $I('btn.build') + ' ' + $I('buildings.tabName');
                case 'BuyReligion': return $I('btn.build') + ' ' + $I('tab.name.religion');
                case 'BuySpace': return $I('btn.build') + ' ' + $I('tab.name.space');
                case 'PromoteKittens': return $I('village.btn.promote') + ' ' + $I('village.msg.kittens');
                case 'TradeBcoins': return $I('trade.buy.ecoin') + '/' + $I('trade.sell.ecoin');
                case 'CollectFaith': return $I('religion.praiseBtn.label');
                case 'SendHunters': return 'Send hunters';
                case 'FeedElders': return $I('trade.msg.elders.feed');
                case 'Trade': return $I('tab.name.trade');
                case 'CreateSteel': return $I('resources.coal.title') + ' → ' + $I('resources.steel.title');
                case 'CreatePlates': return $I('resources.iron.title') + ' → ' + $I('resources.plate.title');
                case 'CreateManuscript': return $I('resources.culture.title') + ' → ' + $I('resources.manuscript.title');
                case 'CreateWood': return $I('resources.catnip.title') + ' → ' + $I('resources.wood.title');
                case 'CreateBeams': return $I('resources.wood.title') + ' → ' + $I('resources.beam.title');
                case 'CreateSlabs': return $I('resources.minerals.title') + ' → ' + $I('resources.slab.title');
                case 'CreateCompedium': return $I('resources.science.title') + ' → ' + $I('resources.compedium.title');
                case 'CreateBlueprints': return $I('resources.science.title') + ' → ' + $I('resources.blueprint.title');
                case 'CreateKerosene': return $I('resources.oil.title') + ' → ' + $I('resources.kerosene.title');
                case 'CreateThorium': return $I('resources.uranium.title') + ' → ' + $I('resources.thorium.title');
                case 'CreateEludium': return $I('resources.unobtainium.title') + ' → ' + $I('resources.eludium.title');
                case 'CreateAlloy': return $I('resources.titanium.title') + ' → ' + $I('resources.alloy.title');
            }
	        return x;
        },
        getSettingsIndexSelectorHtml: function() {
            var inner = '<form><div class="radio-group">';
            for (var i = 0; i < _BotSettings.settings.length; i++) {
                var idx = 'option' + i;
                inner += '<input type="radio" id="' + idx + '" name="selector" '
                    + (i === _BotSettings.settingIdx ? 'checked="checked"' : '') + '>'+
                    '<label for="' + idx + '" onclick="KittenTools.UI.onChangeSettingIdxClick(' + i + ')">' + i + '</label>';
            }
            inner += '</div></form>';
            return inner;
        },
        getLogicBlockHtml: function() {
            var inner = '';
            var currentSettingAuto = _BotSettings.settings[_BotSettings.settingIdx].auto;
            for (var i = 1; i <= 3; i++) {
                for (var x in currentSettingAuto) {
                    if (currentSettingAuto.hasOwnProperty(x)) {
                        var isCreate = x.indexOf('Create') === 0;
                        var isBuy = x.indexOf('Buy') === 0;
                        if ((isBuy && i === 1) || (isCreate && i === 2) || (!isCreate && !isBuy && i === 3)) {
                            var isChecked = currentSettingAuto[x];
                            inner += '<a href="#" onclick="KittenTools.Settings.toggleSetting(\'' + x + '\')">'
                                + _BotSettingsPage.getLabelForAutoSetting(x) + '</a> : ' + (isChecked ? 'ON' : '-') + _br;
                        }
                    }
                }
                inner += _br;
            }
            return inner;
        },
        getBotSpeedBlockHtml: function() {
            var inner = '<form><div class="radio-group">';
            var speeds = [100, 250, 500, 1000, 2000, 5000];
            for (var i in speeds) {
                var label = parseFloat(speeds[i] / 1000).toFixed(speeds[i] < 1000 ? 2 : 0);
                var idx = 'botspeed' + speeds[i];
                inner += '<input type="radio" id="' + idx + '" name="botspeed" '
                    + (speeds[i] === _BotSettings.speed ? 'checked="checked"' : '') + '>' +
                    '<label for="' + idx + '" onclick="KittenTools.UI.onChangeBotSpeed(' + speeds[i] + ')">' + label + '</label>';
            }
            inner += '</div></form>';
            return inner;
        },
        getCraftSpeedBlockHtml: function() {
            var inner = '<form><div class="radio-group">';
            var currentCraftLevel = _BotSettings.getCraftLevel();
            var n1 = 1, n2 = 1;
            for (var i = 0; i < 8; i++) {
                var lvl = n1 + n2; n1 = n2; n2 = lvl; // Fibbonacci
                var idx = 'craftlevel' + lvl;
                inner += '<input type="radio" id="' + idx + '" name="craftlevel" '
                    + (lvl === currentCraftLevel ? 'checked="checked"' : '') + '>'+
                    '<label for="' + idx + '" onclick="KittenTools.UI.onChangeCraftLevel(' + lvl + ')">' + lvl + '</label>';
            }
            inner += '</div></form>';
            return inner;
        },
        getBuildingsBlockHtml: function() {
            var inner = '';
            var bg = game.bld.buildingGroups;
            for (var x in bg) {
                if (bg.hasOwnProperty(x)) {
                    inner += bg[x].title + _br;
                    for (var i in bg[x].buildings) {
                        if (bg[x].buildings.hasOwnProperty(i)) {
                            var b = bg[x].buildings[i];
                            var name = _Helpers.getBuildingTitle(b);
                            var isChecked = _BotSettings.isCheckedBuySetting(b);
                            inner += '<a href="#" onclick="KittenTools.Settings.toggleBuySetting(\'' + b + '\')">'
                                + name + '</a> : ' + (isChecked ? 'ON' : '-') + _br;
                        }
                    }
                    inner += _br;
                }
            }
            return inner;
        },
        getResourcesBlockHtml: function() {
            var inner = '';
            var rm = game.resPool.resourceMap;
            for (var r in rm) {
                if (rm.hasOwnProperty(r)) {
                    if (rm[r].unlocked) {
                        var name = rm[r].title;
                        var isChecked = _BotSettings.isCheckedResSetting(r);
                        inner += '<a href="#" onclick="KittenTools.Settings.toggleResSetting(\'' + r + '\')">'
                            + name + '</a> : ' + (isChecked ? 'ON' : '-') + _br;
                    }
                }
            }
            return inner;
        },
        getSpaceBuildBlockHtml: function() {
            var inner = '';
            var bg = _Helpers.getSpaceBuildings();
            for (var x in bg) {
                if (bg.hasOwnProperty(x)) {
                    var b = bg[x];
                    var isChecked = _BotSettings.isCheckedSpaceSetting(b.name);
                    inner += '<a href="#" onclick="KittenTools.Settings.toggleSpaceSetting(\'' + b.name + '\')">'
                        + b.label + '</a> : ' + (isChecked ? 'ON' : '-') + _br;
                }
            }
            return inner;
        },
        getSettingsBlock: function(title, getterFunction) {
            if (typeof getterFunction === 'function') {
                var result = getterFunction();
                if (result !== '' && result !== null && typeof result !== 'undefined') {
                    return title + '<hr/>' + result + _br;
                }
            }
            return null;
        },
        getHtml: function () {
            var inner = '';
            inner += _BotSettingsPage.getSettingsIndexSelectorHtml();
            inner += _BotSettingsPage.getSettingsBlock('Logic', _BotSettingsPage.getLogicBlockHtml);
            inner += _BotSettingsPage.getSettingsBlock('Bot speed (less = faster)', _BotSettingsPage.getBotSpeedBlockHtml);
            inner += _BotSettingsPage.getSettingsBlock('Craft speed (%)', _BotSettingsPage.getCraftSpeedBlockHtml);
            inner += _BotSettingsPage.getSettingsBlock('Autobuid', _BotSettingsPage.getBuildingsBlockHtml);
            inner += _BotSettingsPage.getSettingsBlock('Space build', _BotSettingsPage.getSpaceBuildBlockHtml);
            inner += _BotSettingsPage.getSettingsBlock('Keep resource', _BotSettingsPage.getResourcesBlockHtml);

            return inner;
        }
    };

	// noinspection JSUnusedGlobalSymbols
    var _BotUI = {
        currentPage: 'log',
        buildingsTranslations: {},
        voidBeforeParadox: undefined,
        lastVoidGain: undefined,
        initTranslations: function() {
            var bg = game.bld.buildingGroups;
            for (var x in bg) {
                if (bg.hasOwnProperty(x)) {
                    for (var i in bg[x].buildings) {
                        if (bg[x].buildings.hasOwnProperty(i)) {
                            var b = bg[x].buildings[i];
                            var name = _Helpers.getBuildingTitle(b);
                            _BotUI.buildingsTranslations[name] = b;
                        }
                    }
                }
            }
        },
        fixFontSize: function() {
            var $midColumn = $('#midColumn');
            var $rightColumn = $('#rightColumn');
            var fnt1 = $('#leftColumn').css('font-size');
            var fnt2 = $midColumn.css('font-size');
            var fnt3 = $rightColumn.css('font-size');
            if (fnt2 !== fnt1 || fnt3 !== fnt1) {
                _Logs.mainLog('Fixing font size');
                $midColumn.css('font-size', fnt1);
                $rightColumn.css('font-size', fnt1);
            }
        },
        fixStyles: function() {
            var style = '<style type="text/css">' +
                '.modern .btnContent, .btn.bldEnabled.modern div.btnContent, .btn.bldlackResConvert.modern div.btnContent {padding: 5px 0 5px 10px;} '+
                '.btn.modern a {padding: 5px 6px 5px 6px !important;margin:-5px 0;} '+
                '#rightTabLog {max-height: 75vh; overflow-y: scroll; padding-right: 4px;} ' +
                '#IRCChatInner {overflow-y: scroll; height: 75vh;} ' +
                '#IRCChatInner a {text-decoration: none; color: darkmagenta} ' +
                '#IRCChatInner a:hover {text-decoration: underline: color: magenta} ' +
                'span.msg:not(.type_date) {display: list-item; margin-left: 1.0em; list-style-type: circle;} ' +
                '.msg {opacity: 1 !important;} ' +
                '.right-tab-header a {padding: 0} ' +
                '#scienceTree, #wikiPopup {z-index:2;position:fixed;left:2vw;top:2vh;width:96vw;height:96vh;background:azure;border:1px solid;} ' +
                '#closeScienceTree, #closeWikiPopup {z-index:3;position:fixed;right:2vw;top:2vh;color:black;font-size:20px;padding:4px;border:1px solid;text-decoration:none;} ' +
                '#closeScienceTree:hover, #closeWikiPopup:hover {color:blue} ' +
                '.legendBlock {margin-bottom: 8px;padding: 0 8px 8px 8px;border-bottom: 1px solid gray;} ' +
                '#scienceLegend {z-index:4;position:fixed;left:3vw;top:50vh;width:47vw;height:47vh;background:whitesmoke;border:1px solid;} ' +
                '#scienceLegendInner {z-index:5;position:fixed;left:4vw;top:51vh;width:45vw;height:45vh;overflow-y:auto;} ' +
                '#scienceLegendTitle {text-align:center;margin-top:8px;font-size:140%;} ' +
                '#scienceLegendPrice td, #scienceLegendUnlock td {padding-right: 16px;vertical-align: top;} ' +
                '#scienceLegendUnlock {font-size: 90%;} ' +
                '.btn.nosel.modern.disabled.nochance {border-color: red;} ' +
                '#wikiPopup .linkBlock {padding: 4px; height: 5vh} ' +
                '#wikiPopup iframe {border: none; width: 100%; height: 90vh;} ' +
                '#wikiPopup a {display: inline-block; padding: 5px 6px; margin: 0 8px 4px 0;border: 1px solid} ' +

                '.radio-group input[type=radio] {position: absolute; visibility: hidden; display: none;}' +
                '.radio-group label {display: inline-block; cursor: pointer; font-weight: bold; padding: 4px 8px;}' +
                '.radio-group input[type=radio]:checked + label{background: #999}' +
                '.radio-group label + input[type=radio] + label {border-left: solid 1px;}' +
                '.radio-group {border: solid 1px; display: inline-block; border-radius: 10px; overflow: hidden;}' +

                '</style>';
            $('body').append($(style));
        },
        addColorsToBuildingsButtons: function() {
            var $buttons = $('.bldGroupContainer .btn.modern');
            if ($buttons.length) {
                var gatherMintCaption = $I('buildings.gatherCatnip.label');
                var pressMintCaption = $I('buildings.refineCatnip.label');
                for (var i = 0; i < $buttons.length; i++) {
                    var $btn = $buttons[i];
                    var isDisabled = $btn.className.indexOf('disabled') >= 0;
                    if (isDisabled) {
                        var btnText = $btn.innerText;
                        var isSpecial = btnText.indexOf(gatherMintCaption) === 0 || btnText.indexOf(pressMintCaption) === 0;
                        if (!isSpecial) {
                            var idx = btnText.indexOf(' (');
                            if (idx <= 0) {
                                var bldName = btnText;
                            } else {
                                bldName = btnText.substr(0, idx);
                            }
                            var building_type = _BotUI.buildingsTranslations[bldName];
                            if (typeof building_type !== 'undefined') {
                                var canBuild = _Helpers.canBuildNow(building_type);
                                if (!canBuild) {
                                    $($btn).addClass('nochance');
                                } else {
                                    $($btn).removeClass('nochance');
                                }
                            }
                        }
                    }
                }
            }
        },
        addColorsToBuildingsButtonsWithTimeout: function() {
            setTimeout(function() {
                KittenTools.UI.addColorsToBuildingsButtons();
            }, 700);
        },
        addBotButton: function () {
            var $a = $('<a href="#" id="botbutton">Bot (' + (_BotLogic.isAutoLogicStarted ? 'on' : 'off') + ')</a>');
            $a.on('click', function() {
                _BotLogic.isAutoLogicStarted = !_BotLogic.isAutoLogicStarted;
                _Logs.mainLog((_BotLogic.isAutoLogicStarted ? 'Started' : 'Stopped') + ' version ' + _Core.getBotVersion());
                $('#botbutton').text(_BotLogic.isAutoLogicStarted ? 'Bot (on)' : 'Bot (off)');
            });
            $('#headerLinks .links-block').append(' | ').append($a);
        },
        initSettingsLink: function () {
            $('a.chatLink').text('Bot settings').attr('onclick', 'KittenTools.UI.onSettingsButtonClick()');
        },
        initSettingsPage: function () {
            if (_BotUI.currentPage !== 'settings') return;

            var inner = _BotSettingsPage.getHtml();
            $('#IRCChatInner').html(inner);
        },
        initInfoButton: function () {
            $('.right-tab-header').append('&nbsp;| <a href="#" id="botinfobtn" onclick="KittenTools.UI.onInfoButtonClick()">Info</a>');
        },
        initCustomLogButton: function(logName, buttonTitle) {
            $('.right-tab-header').append('&nbsp;| <a href="#" id="_log' + logName + '" onclick="KittenTools.UI.onCustomLogButtonClick(\'' + logName + '\')">' + buttonTitle + '</a>');
        },
        initCustomLogPage: function(logName) {
            var inner = '';

            inner += '<a href="#" onclick="KittenTools.UI.onClearCustonLogClick(\'' + logName + '\')">Clear log</a>';
            if (logName === 'trade') {
                inner += ' | <a href="#" onclick="KittenTools.UI.onGetTitaniumClick()">Trade max Titan</a>';
            }
            inner += '<hr/>';

            var lastLogIndex = _Logs.getCustomLogSize(logName) - 1;
            for (var i = lastLogIndex; i >= 0; i--) {
                inner += '<span class="msg">' + _Logs.getCustomLogItem(logName, i) + '</span>';
            }

            $('#IRCChatInner').html(inner);
        },
        init: function () {
            _BotUI.fixStyles();
            _BotUI.addBotButton();
            _BotUI.initInfoButton();
            _BotUI.initCustomLogButton('log2', 'Log2');
            _BotUI.initCustomLogButton('trade', 'Trade');
            _BotUI.initCustomLogButton('hunt', 'Hunts');
            _BotUI.initCustomLogButton('wrkshp', 'Workshop');
            _BotUI.initCustomLogButton('build', 'Build');
            _BotUI.initCustomLogButton('craft', 'Craft');
            _Cytoscape.init();
            _BotUI.initTranslations();
            _BotUI.initLogLink();
            _Wiki.init();
            //_BotUI.addColorsToBuildingsButtonsWithTimeout();
            _BotUI.initInfoUpdateTimer();
        },
        initInfoUpdateTimer: function() {
            setInterval(function () {
                if (_BotUI.currentPage === 'info') {
                    _BotInfoPage.initInfoPage();
                }
            }, 1000);
        },
        onInfoButtonClick: function () {
            _BotUI.currentPage = 'info';
            _BotUI.switchToChatAndMakeLinkActive('botinfobtn');
            _BotInfoPage.initInfoPage();
        },
        switchToChatAndMakeLinkActive: function(linkId) {
            game.ui.loadChat();
            if (typeof linkId !== 'undefined') {
                $('.right-tab-header a.active').removeClass('active');
                $('#' + linkId).addClass('active');
            }
        },
        onSettingsButtonClick: function () {
            _BotUI.currentPage = 'settings';
            _BotUI.switchToChatAndMakeLinkActive();
            _BotUI.initSettingsPage();
        },
        onCustomLogButtonClick: function(logName) {
            _BotUI.currentPage = logName;
            _BotUI.switchToChatAndMakeLinkActive('_log' + logName);
            _BotUI.initCustomLogPage(logName);
        },
        initLogLink: function () {
            $('#logLink').attr('onclick', 'KittenTools.UI.onLogButtonClick()');
        },
        onLogButtonClick: function () {
            _BotUI.currentPage = 'log';
            $('.right-tab-header a.active').removeClass('active');
            game.ui.hideChat();
        },
        onClearCustonLogClick: function(logName) {
            _Logs.clearCustomLog(logName);
            _BotUI.initCustomLogPage(logName);
        },
        onChangeSettingIdxClick: function (newIndex) {
            newIndex = parseInt(newIndex);
            if (_BotSettings.settingIdx !== newIndex) {
                _BotSettings.settingIdx = newIndex;
                _BotSettings.store('settingsIdx', _BotSettings.settingIdx);
                _BotUI.initSettingsPage();
            }
        },
        initStatsPage: function () {
            for (var i in game.stats.statGroups) {
                if (game.stats.statGroups.hasOwnProperty(i)) {
                    var grp = game.stats.statGroups[i];
                    if (grp.title === _Statistics._statTitle) {
                        game.stats.statGroups[i] = _Statistics.getStatsGroup();
                        return;
                    }
                }
            }
            game.stats.statGroups.push(_Statistics.getStatsGroup());
        },
        onChangeCraftLevel: function (newLevel) {
            _BotSettings.setCraftLevel(newLevel);
        },
        onChangeBotSpeed: function (newSpeed) {
            newSpeed = parseInt(newSpeed);
            if (newSpeed !== _BotSettings.speed) {
                clearInterval(_BotLogic.tAutoLogic);
                _BotSettings.speed = newSpeed;
                _BotLogic.tAutoLogic = setInterval(_BotLogic.autoLogic, _BotSettings.speed);
                _BotSettings.store('speed', _BotSettings.speed);

                _Logs.mainLog('New Bot Timeout: ' + _BotSettings.speed);
                _Logs.console('BOT: KittenTools new timeout ' + _BotSettings.speed);
            }
        },
        checkVoidIncome: function () {
            if (game.bld.get('chronosphere').on) {
                if (typeof _BotUI.voidBeforeParadox === 'undefined' && parseInt(game.calendar.futureSeasonTemporalParadox) <= 0 && game.calendar.day > 90) {
                    _BotUI.voidBeforeParadox = game.resPool.get('void').value;
                } else if (typeof _BotUI.voidBeforeParadox !== 'undefined' && game.calendar.day < 10 && game.calendar.day > 0) {
                    var curVoid = game.resPool.get('void').value;
                    _BotUI.lastVoidGain = curVoid - _BotUI.voidBeforeParadox;
                    _Logs.mainLog('Void gained ' + _BotUI.lastVoidGain);
                    _BotUI.voidBeforeParadox = undefined;
                }
            }
        },
        onGetTitaniumClick: function () {
            var titanPerTrade = _Helpers.getZebraTitanium().value;
            if (titanPerTrade > 0) {
                var maxTrades_gold = Math.floor(game.resPool.get('gold').value / 15);
                var maxTrades_slab = Math.floor(game.resPool.get('slab').value / 50);
                var maxTrades_manpower = Math.floor(game.resPool.get('manpower').value / 50);
                var maxTrades = Math.min(maxTrades_gold, maxTrades_manpower, maxTrades_slab);
                var titanium = game.resPool.get('titanium');
                var needTrades = Math.ceil((titanium.maxValue - titanium.value) / titanPerTrade);
                var tradesCanDo = Math.min(needTrades, maxTrades) | 0;
                var zebras = game.diplomacy.get('zebras');

                _Logs.logTrade('[Zebra trade] x ' + tradesCanDo);
                game.diplomacy.tradeMultiple(zebras, tradesCanDo);
                _Statistics.addStatistics('diplomacyCount', 'zebras', tradesCanDo);
            }
            _Logs.console('hello');
        }
    };

	var _BotLogic = {
        tAutoLogic: undefined,
        isAutoLogicStarted: true,
        cryptoPriceOld: undefined,
        autoTradeBcoins: function() {
            if (_BotSettings.isAuto('TradeBcoins') && game.science.get('blackchain').researched) {
                if (game.resPool.get('blackcoin').value > 0) {
                    var bcoinPerSec = _Helpers.getMaxBcoinPriceChangePerSecond();
                    if (game.calendar.cryptoPriceMax - game.calendar.cryptoPrice < 10 * bcoinPerSec) {
                        _BotActions.sellBcoins();
                    }
                }
                if (game.resPool.get('relic').value > 0) {
                    var isPriceDecreased = _BotLogic.cryptoPriceOld > game.calendar.cryptoPrice;
                    var isNewPriceLow = game.calendar.cryptoPrice <= game.calendar.cryptoPriceMax * 0.8;
                    var isOldPriceHigh = _BotLogic.cryptoPriceOld > game.calendar.cryptoPriceMax * 0.9;
                    if (isPriceDecreased && isNewPriceLow && isOldPriceHigh) {
                        _BotActions.buyBcoins();
                    }
                }
                _BotLogic.cryptoPriceOld = game.calendar.cryptoPrice;
            }
        },
        autoBuyItem: function(bldName) {
            var bld = game.bld.get(bldName);
            if (bld.unlocked && _Helpers.canBuyBuilding(bldName)) {
                var itemName = bld.stages && bld.stages.length > 0 ? bld.stages[bld.stage].label : bld.label;
                _BotActions.makeABuy(itemName);
            }
        },
        autoBuyAll: function() {
            if (!_BotSettings.isAuto('Buy')) return;

            var currentSettingBuys = _BotSettings.settings[_BotSettings.settingIdx].buys;
            for (var x in currentSettingBuys) {
                if (currentSettingBuys.hasOwnProperty(x)) {
                    if (currentSettingBuys[x] === true) {
                        _BotLogic.autoBuyItem(x);
                    }
                }
            }
        },
        autoBuySpace: function(bldName) {
            var bld = game.space.getBuilding(bldName);
            if (bld.unlocked) {
                _BotActions.buyModelBuilding(bld, false, true);
            }
        },
        autoBuyAllSpace: function() {
            if (!_BotSettings.isAuto('BuySpace')) return;

            var currentSettingBuysSpace = _BotSettings.settings[_BotSettings.settingIdx].space;
            for (var x in currentSettingBuysSpace) {
                if (currentSettingBuysSpace.hasOwnProperty(x)) {
                    if (currentSettingBuysSpace[x] === true) {
                        _BotLogic.autoBuySpace(x);
                    }
                }
            }
        },
        autoClick: function() {
            var field = game.bld.get('field');
            if (field.on < 5) {
                game.bld.gatherCatnip()
            } else {
                var hut = game.bld.get('hut');
                var wood = game.resPool.get('wood');
                if (!hut.unlocked || wood.value < 10) {
                    var catnip = game.resPool.get('catnip');
                    if (catnip.value >= 100) {
                        game.bld.refineCatnip()
                    }
                }
            }
        },
        autoLogic: function() {
            _BotUI.fixFontSize();
            _BotUI.initStatsPage();
            _BotUI.checkVoidIncome();

            _BotActions.collectAstronomy();
            if (!_BotLogic.isAutoLogicStarted) return;
            _BotLogic.autoClick();
            _BotLogic.autoBuyAll();
            _BotLogic.autoBuyAllSpace();
            _BotLogic.promoteKittens();
            _BotLogic.collectFaith();
            _BotLogic.ironToSteelOrPlates();
            _BotLogic.sendAllHunters();
            _BotLogic.cultureToManuscript();
            _BotLogic.catnipToWood();
            _BotLogic.woodToBeams();
            _BotLogic.mineralsToSlabs();
            _BotLogic.oilToKerosene();
            _BotLogic.unobtainiumToEludium();
            _BotLogic.uraniumToThorium();
            _BotLogic.spendScience();
            _BotLogic.buyReligion();
            _BotLogic.turnOffBuildings();
            _BotLogic.feedElders();
            _BotLogic.autoTradeBcoins();
            _BotLogic.titaniumToAlloy();
            _BotLogic.autoTrade();
        },
        feedElders: function() {
            if (_BotSettings.isAuto('FeedElders')) _BotActions.feedElders();
        },
        turnOffBuildings: function() {
            _BotLogic.turnOffMoonOutpost();
        },
        turnOffMoonOutpost: function() {
            var uranium = game.resPool.get('uranium');
            if (uranium.unlocked && uranium.value <= 0 && game.getResourcePerTick('uranium', true) <= 0) {
                var bld = game.space.getBuilding('moonOutpost');
                if (bld.val > 0 && bld.on > 0) {
                    _BotActions.turnOffMoonOutpost();
                }
            }
        },
        autoTrade: function() {
            if (_BotSettings.isAuto('Trade')) {
                _BotActions.sendZebraCaravan();
                _BotActions.sendDragonsCaravan();
                _BotActions.sendNagasCaravan();
            }
        },
        promoteKittens: function () {
            if (_BotSettings.isAuto('PromoteKittens')) _BotActions.promoteKittens();
        },
        collectFaith: function () {
            if (_BotSettings.isAuto('CollectFaith')) _BotActions.collectFaith();
        },
        ironToSteelOrPlates: function() {
            var iron = game.resPool.get('iron');
            var coal = game.resPool.get('coal');
            if (iron.value >= iron.maxValue || coal.value >= coal.maxValue) {
                var minPlate = _Helpers.getMinCraft('plate');
                if (coal.value >= coal.maxValue && coal.value >= 100 && iron.value >= 100 && _Helpers.isResourceUnlocked('steel')) {
                    _BotLogic.ironToSteel();
                } else if (iron.value >= iron.maxValue && iron.value >= (125 * minPlate) && _Helpers.isResourceUnlocked('plate')) {
                    _BotLogic.ironToPlates();
                }
            }
        },
        oilToKerosene: function () {
            if (_BotSettings.isAuto('CreateKerosene')) _BotActions.oilToKerosene();
        },
        unobtainiumToEludium: function () {
            if (_BotSettings.isAuto('CreateEludium')) {
                if (_Helpers.isResourceUnlocked('eludium')) {
                    var unobtainium = game.resPool.get('unobtainium');
                    if (unobtainium.value >= unobtainium.maxValue && unobtainium.value >= 1000) {
                        _BotActions.craftResource('alloy', 2500);
                    }
                    _BotActions.unobtainiumToEludium();
                }
            }
        },
        uraniumToThorium: function () {
            if (_BotSettings.isAuto('CreateThorium')) _BotActions.uraniumToThorium();
        },
        titaniumToAlloy: function () {
            if (_BotSettings.isAuto('CreateAlloy')) _BotActions.titaniumToAlloy();
        },
        ironToSteel: function () {
            if (_BotSettings.isAuto('CreateSteel')) _BotActions.ironToSteel();
        },
        ironToPlates: function () {
            if (_BotSettings.isAuto('CreatePlates')) _BotActions.ironToPlates();
        },
        sendAllHunters: function () {
            if (_BotSettings.isAuto('SendHunters')) _BotActions.sendAllHunters();
        },
        cultureToManuscript: function () {
            if (_BotSettings.isAuto('CreateManuscript')) {
                var maxScienceResources = _Helpers.getMaximumScienceResourcesToKeep();
                var parchments = game.resPool.get('parchment');
                var minVal = _Helpers.getMinCraft('manuscript');
                if (maxScienceResources.maxParchment === 0) {
                    var maxParchmentsForBuildings = _Helpers.getMaximumScienceResourcesForBuildings();
                    if (maxParchmentsForBuildings.maxParchment === 0) {
                        _BotActions.cultureToManuscript();
                    } else if ((parchments.value - 25 * minVal) >= maxParchmentsForBuildings.maxParchment) {
                        _BotActions.cultureToManuscript();
                    }
                } else {
                    if ((parchments.value - 25 * minVal) >= maxScienceResources.maxParchment) {
                        _BotActions.cultureToManuscript();
                    }
                }
            }
        },
        catnipToWood: function () {
            if (_BotSettings.isAuto('CreateWood')) _BotActions.catnipToWood();
        },
        woodToBeams: function () {
            if (_BotSettings.isAuto('CreateBeams')) _BotActions.woodToBeams();
        },
        mineralsToSlabs: function () {
            if (_BotSettings.isAuto('CreateSlabs')) _BotActions.mineralsToSlabs();
        },
        spendScience: function() {
            var maxScienceResources = _Helpers.getMaximumScienceResourcesToKeep();
            var compediums = game.resPool.get('compedium');
            var minBlueprintCanCraft = _Helpers.getMinCraft('blueprint');
            if ((maxScienceResources.maxCompediums > 0 && compediums.value < maxScienceResources.maxCompediums) || (compediums.value < (25 * minBlueprintCanCraft))) {
                _BotLogic.scienceToCompedium();
            } else {
                _BotLogic.scienceToBlueprints();
                _BotLogic.scienceToCompedium();
            }
        },
        scienceToCompedium: function () {
            if (_BotSettings.isAuto('CreateCompedium')) {
                var maxManuscriptForBuildings = _Helpers.getMaximumScienceResourcesForBuildings();
                if (maxManuscriptForBuildings.maxManuscript === 0) {
                    _BotActions.scienceToCompedium();
                } else {
                    var minVal = _Helpers.getMinCraft('compedium');
                    var manuscripts = game.resPool.get('manuscript');
                    if ((manuscripts.value - 50 * minVal) >= maxManuscriptForBuildings.maxManuscript) {
                        _BotActions.scienceToCompedium();
                    }
                }
            }
        },
        scienceToBlueprints: function () {
            if (_BotSettings.isAuto('CreateBlueprints')) _BotActions.scienceToBlueprints();
        },
        buyReligion: function () {
            if (_BotSettings.isAuto('BuyReligion')) _BotActions.buyReligion();
        }
	};

	var _BotInjections = {
	    game: {
	        _oldMsg: undefined,
	        msg: function (message, type, tag, noBullet) {
                if (tag === 'astronomicalEvent' || tag === 'meteor') {
                    _Logs.log2(message);
                } else if (tag === 'trade') {
                    _Logs.logTrade(message);
                } else if (tag === 'hunt') {
                    _Logs.logCustom('hunt', message);
                } else if (tag === 'craft') {
                    _Logs.logCraft(message);
                } else if (tag === 'workshopAutomation') {
                    _Logs.logCustom('wrkshp', message);
                } else {
                    _BotInjections.game._oldMsg.call(game, message, type, tag, noBullet);
                }
            },
            tabs: {
	            _oldRenderActiveGroup: undefined,
                renderActiveGroup: function (groupContainer) {
                    _BotInjections.game.tabs._oldRenderActiveGroup.call(game.tabs[0], groupContainer);
                    KittenTools.UI.addColorsToBuildingsButtonsWithTimeout();
                }
            }
        },
        init: function () {
            if (game && game.msg) {
                _BotInjections.game._oldMsg = game.msg;
                game.msg = _BotInjections.game.msg;
            }
            /*if (game && game.tabs && game.tabs[0] && game.tabs[0].__proto__.renderActiveGroup) {
                _BotInjections.game.tabs._oldRenderActiveGroup = game.tabs[0].__proto__.renderActiveGroup;
                game.tabs[0].__proto__.renderActiveGroup = _BotInjections.game.tabs.renderActiveGroup;
            }*/
        }
    };

    var KittenTools = {
        Helpers: _Helpers,
        Actions: _BotActions,
        UI: _BotUI,
        CY: _Cytoscape,
        Settings: _BotSettings,
        Logic: _BotLogic,
        Logs: _Logs,
        Wiki: _Wiki
    };

    var _starter = function() {
        if (typeof game.KittenTools === 'undefined') {
            game.KittenTools = KittenTools;
        }
        if (typeof unsafeWindow !== 'undefined') {
            unsafeWindow.KittenTools = KittenTools;
            unsafeWindow.cytoscape = cytoscape;
        }

        _BotUI.init();
        _BotSettings.init();
        _BotInjections.init();

        _BotLogic.tAutoLogic = setInterval(_BotLogic.autoLogic, _BotSettings.speed);

        _Logs.mainLog('Started version ' + _Core.getBotVersion());
        _Logs.console('BOT: KittenTools version ' + _Core.getBotVersion() + ' started');

        _Logs.mainLog('Timeout: ' + _BotSettings.speed);
        _Logs.console('BOT: KittenTools timeout ' + _BotSettings.speed);
    };

    var _waiter = function() {
        if (_Helpers.isGameReady()) {
            _starter();
        } else {
            setTimeout(_waiter, 1000);
        }
    };

    _waiter();
})();