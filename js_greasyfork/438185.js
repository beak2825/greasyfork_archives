// ==UserScript==
// @name         Evolvenooo
// @namespace    http://tampermonkey.net/
// @version      3.3.1.92
// @description  try to play hte game
// @downloadURL  https://gitee.com/by22dgb/evolvescript/raw/master/evolve_automation.user.js
// @author       Fafnir
// @author       TMVictor
// @author       Vollch
// @match        https://likexia.gitee.io/evolve/
// @match        https://pmotschmann.github.io/Evolve/
// @grant        none
// @require      https://code.jquery.com/jquery-3.6.0.min.js
// @require      https://code.jquery.com/ui/1.12.1/jquery-ui.min.js
// ==/UserScript==
//
// This script forked from TMVictor's script version 3.3.1. Original script: https://gist.github.com/TMVictor/3f24e27a21215414ddc68842057482da
// Removed downloadURL in case that script got screwed up. Original downloadURL: @downloadURL  https://gist.github.com/Vollch/b1a5eec305558a48b7f4575d317d7dd1/raw/evolve_automation.user.js
//
// Most of script options have tooltips, explaining what they do, read them if you have a questions.
//
// Here's some tips about non-intuitive features:
//   Ctrl+Click on almost any script option brings up advanced configurations, which allows to overide setting under certain conditions and set more advanced logic.
//     Triggers, evolution queue, log filters, smart powering for interlinked buildings(like transport and bireme), priorities(draggables), and overrides itself - cannot be overridden.
//     Overrides affects only script behaviour, GUI(outside of overrides modal) always show and changes default values.
//   autoMarket, autoGalaxyMarket, autoFactory, and autoMiningDroid use weightings and priorities to determine their tasks. Resources split by groups of same priority, and then resources within group having the best priority distributed according to their weights. If there's still some more unused routes\factories\drones after assigning, script moves to next group with lower priority, etc. In most cases only one group with highest priority is active and working, while other groups serve as fallback for cases when all resources with better priority are either capped, or, in case of factory, unaffordable. There's few special values for finer configuration:
//     Prioritization(queue, trigger, etc) does temporarily change priority of resource to 100, thus resources with priority above 100 won't be affected by prioritization.
//       You can also disable prioritization under General Settings, if you can't cope with it.
//     Priority of -1 it's special supplementary value meaning "same as current highest". Resources with this value will always be crafted among with whatever currently have highest priority, without disabling them.
//     Resources with 0 priority won't be crafted during normal workflow, unless prioritized(which increases priority).
//     Resources with 0 weighting won't ever be crafted, regardless of configured priority or prioritization.
//     autoMarket and autoFactory also have separate global checkboxes per resources, when they disabled(both buying and selling in case of autoMarket) - script won't touch them, leaving with whatever was manually set.
//   Added numbers in Mech Labs represents: design efficiency, real mech damage affected by most factors, and damage per used space, respectively. For all three - bigger numbers are better. Collectors show their supply collect rate.
//   Buildings\researches queue, triggers, and available researches prioritize missing resources, overiding other script settings. If you have issues with factories producing not what you want, market buying not what you want, and such - you can disable this feature under general settings.
//     Alternatively you may try to tweak options of producing facilities: resources with 0 weighting won't ever be produced, even when script tries to prioritize it. And resources with priority -1 will always have highest available priority, even when facility prioritizing something else. But not all facilities can be configured in that way.
//   Auto Storage assigns crates\containers to make enough storage to build all buildings with enabled Auto Build.
//     If some storage grew too high, taking all crates, you can disable expensive building, and Auto Storage won't try to fullfil its demands anymore. If you want to expand storage to build something manually, you can limit maximum level of building to 0, thus while it technically have auto build enabled, it won't ever be autobuilded, but you'll have needed storage.
//   Order in which buildings receive power depends on order in buildings settings, you can drag and drop them to adjust priorities.
//     Filtering works with names, some settings, and resource cost. E.g. you can filter for "build==on", "power==off", "weight<100", "soul gem>0", "iron>=1G" and such.
//     By default Ascension Trigger placed where it can be activated as soon as possible without killing soldiers or population, and reducing prestige rewards. But it still can hurt production badly. If you're planning to ascend at very first opportunity(i.e. not planning to go for pillar or such), you may enable auto powering it. Otherwise you may want to delay with it till the moment when you'll be ready. (Or you can just move it where it will be less impacting on production, but that also means it'll take longer to get enough power)
//     Auto Power have two toggles, first one enables basic management for building: based on priority, available power, support, and fuel. Logic behind second toggle is individual per building, but generally it tries to behave smart and save resources when it's enabled.
//   Evolution Queue can change any script settings, not only those which you have after adding new task, you can append any variables and their values manually, if you're capable to read code, and can find internal names and acceptable values of those variables. Settings applied at the moment when new evolution starts. (Or right before reset in case of Cataclysm)
//     Unavailable tasks in evolution queue will be ignored, so you can queue something like salamander and balorg, one after another, and configure script to pick either volcano or hellscape after bioseed. And, assuming you'll get either of these planets, it'll go for one of those two races. (You can configure more options to pick from, if you want)
//   Auto Smelter does adjust rate of Inferno fuel and Oil for best cost and efficiency, but only when Inferno directly above oil.
//   All settings can be reset to default at once by importing {} as script settings.
//   Autoclicker can trivialize many aspects of the game, and ruin experience. Spoil your game at your own risk!

(function($) {
    'use strict';
    var translateFinish = false;
    var settingsRaw = JSON.parse(localStorage.getItem('settings')) ?? {};
    var settings = {};
    var game = null;
    var win = null;

    var checkActions = false;

    // Class definitions

    class Job {
        constructor(id, name) {
            this._originalId = id;
            this._originalName = name;
            this._vueBinding = "civ-" + this._originalId;
        }

        get autoJobEnabled() { return settings['job_' + this._originalId] }
        get priority() { return settingsRaw['job_p_' + this._originalId] }
        getBreakpoint(n) { return settings[`job_b${n+1}_${this._originalId}`] }

        get definition() {
            return game.global.civic[this._originalId];
        }

        get id() {
            return this.definition.job;
        }

        get name() {
            return this.definition.name;
        }

        isUnlocked() {
            return this.definition.display;
        }

        isManaged() {
            if (!this.isUnlocked()) {
                return false;
            }

            return this.autoJobEnabled;
        }

        isUnlimited() {
            return unlimitedJobs.includes(this._originalId);
        }

        get count() {
            return this.definition.workers;
        }

        get max() {
            if (this.definition.max === -1) {
                return Number.MAX_SAFE_INTEGER;
            }

            return this.definition.max;
        }

        breakpointEmployees(breakpoint) {
            let breakpointActual = this.getBreakpoint(breakpoint);

            // -1 equals unlimited up to the maximum available jobs for this job
            if (breakpointActual === -1) {
                breakpointActual = Number.MAX_SAFE_INTEGER;
            }

            // return the actual workers required for this breakpoint (either our breakpoint or our max, whichever is lower)
            return Math.min(breakpointActual, this.max);
        }

        addWorkers(count) {
            if (!this.isUnlocked() || this.isDefault()) {
                return false;
            }
            if (count < 0) {
                this.removeWorkers(-1 * count);
            }

            let vue = getVueById(this._vueBinding);
            if (vue === undefined) { return false; }

            resetMultiplier();
            for (let i = 0; i < count; i++) {
                vue.add();
            }
        }

        removeWorkers(count) {
            if (!this.isUnlocked() || this.isDefault()) {
                return false;
            }
            if (count < 0) {
                this.addWorkers(-1 * count);
            }

            let vue = getVueById(this._vueBinding);
            if (vue === undefined) { return false; }

            resetMultiplier();
            for (let i = 0; i < count; i++) {
                vue.sub();
            }
        }

        isDefault() {
            return game.global.civic.d_job === this.id;
        }

        setAsDefault() {
            if (this.definition.max === -1) {
                getVueById(this._vueBinding)?.setDefault(this.id);
            }
        }
    }

    class CraftingJob extends Job {
        constructor(id, name, resource) {
            super(id, name);

            this._vueBinding = "foundry";
            this.resource = resource;
        }

        get definition() {
            return game.global.civic['craftsman'];
        }

        get id() {
            return this.resource.id;
        }

        isUnlocked() {
            return game.global.resource[this._originalId].display;
        }

        get count() {
            return game.global.city.foundry[this._originalId];
        }

        get max() {
            return game.global.civic.craftsman.max;
        }

        addWorkers(count) {
            if (!this.isUnlocked()) {
                return false;
            }
            if (count < 0) {
                this.removeWorkers(-1 * count);
            }

            let vue = getVueById(this._vueBinding);
            if (vue === undefined) { return false; }

            resetMultiplier();
            for (let i = 0; i < count; i++) {
                vue.add(this._originalId);
            }
        }

        removeWorkers(count) {
            if (!this.isUnlocked()) {
                return false;
            }
            if (count < 0) {
                this.addWorkers(-1 * count);
            }

            let vue = getVueById(this._vueBinding);
            if (vue === undefined) { return false; }

            resetMultiplier();
            for (let i = 0; i < count; i++) {
                vue.sub(this._originalId);
            }
        }
    }

    class Resource {
        constructor(name, id) {
            this.name = name;
            this._id = id;

            this.currentQuantity = 0;
            this.maxQuantity = 0;
            this.rateOfChange = 0;
            this.rateMods = {};
            this.tradeBuyPrice = 0;
            this.tradeSellPrice = 0;
            this.tradeRoutes = 0;
            this.incomeAdusted = false;

            this.storageRequired = 1;
            this.requestedQuantity = 0;
            this.cost = {};

            this._vueBinding = "res" + id;
            this._stackVueBinding = "stack-" + id;
            this._marketVueBinding = "market-" + id;
        }

        get autoCraftEnabled() { return settings['craft' + this.id] }
        get craftWeighting() { return settings['foundry_w_' + this.id] }
        get craftPreserve() { return settings['foundry_p_' + this.id] }
        get autoStorageEnabled() { return settings['res_storage' + this.id] }
        get storagePriority() { return settingsRaw['res_storage_p_' + this.id] }
        get storeOverflow() { return settings['res_storage_o_' + this.id] }
        get _autoCratesMax() { return settings['res_crates_m_' + this.id] }
        get _autoContainersMax() { return settings['res_containers_m_' + this.id] }
        get marketPriority() { return settingsRaw['res_buy_p_' + this.id] }
        get autoBuyEnabled() { return settings['buy' + this.id] }
        get autoBuyRatio() { return settings['res_buy_r_' + this.id] }
        get autoSellEnabled() { return settings['sell' + this.id] }
        get autoSellRatio() { return settings['res_sell_r_' + this.id] }
        get autoTradeBuyEnabled() { return settings['res_trade_buy_' + this.id] }
        get autoTradeSellEnabled() { return settings['res_trade_sell_' + this.id] }
        get autoTradeWeighting() { return settings['res_trade_w_' + this.id] }
        get autoTradePriority() { return settings['res_trade_p_' + this.id] }
        get galaxyMarketWeighting() { return settings['res_galaxy_w_' + this.id] }
        get galaxyMarketPriority() { return settings['res_galaxy_p_' + this.id] }

        get title() {
            return this.instance?.name || this.name;
        }

        get instance() {
            return game.global.resource[this.id];
        }

        get id() {
            return this._id;
        }

        get currentCrates() {
            return this.instance.crates;
        }

        get currentContainers() {
            return this.instance.containers;
        }

        updateData() {
            if (!this.isUnlocked()) {
                return;
            }

            let instance = this.instance;
            this.currentQuantity = instance.amount;
            this.maxQuantity = instance.max >= 0 ? instance.max : Number.MAX_SAFE_INTEGER;
            this.rateOfChange = instance.diff;
            this.rateMods = {};
            this.incomeAdusted = false;
        }

        finalizeData() {
            if (!this.isUnlocked() || this.constructor !== Resource) { // Only needed for base resources
                return;
            }

            // When routes are managed - we're excluding trade diff from operational rate of change.
            if (settings.autoMarket && this.isTradable()) {
                this.tradeRoutes = this.instance.trade;
                this.tradeBuyPrice = game.tradeBuyPrice(this._id);
                this.tradeSellPrice = game.tradeSellPrice(this._id);
                let tradeDiff = game.breakdown.p.consume[this._id].Trade || 0;
                if (tradeDiff > 0) {
                    this.rateMods['buy'] = tradeDiff * -1;
                } else if (tradeDiff < 0) {
                    this.rateMods['sell'] = tradeDiff * -1;
                    this.rateOfChange += this.rateMods['sell'];
                }
            }

            // Restore decayed rate
            if (game.global.race['decay'] && this.tradeRouteQuantity > 0 && this.currentQuantity >= 50) {
                this.rateMods['decay'] = (this.currentQuantity - 50) * (0.001 * this.tradeRouteQuantity);
                this.rateOfChange += this.rateMods['decay'];
            }
        }

        calculateRateOfChange(apply) {
            let value = this.rateOfChange;
            for (let mod in this.rateMods) {
                if (apply[mod] ?? apply.all) {
                    value -= this.rateMods[mod];
                }
            }
            return value;
        }

        isDemanded() {
            return this.requestedQuantity > this.currentQuantity;
        }

        get spareQuantity() {
            return this.currentQuantity - this.requestedQuantity;
        }

        get spareMaxQuantity() {
            return this.maxQuantity - this.requestedQuantity;
        }

        isUnlocked() {
            return this.instance?.display ?? false;
        }

        isRoutesUnlocked() {
            return this.isUnlocked() && (!game.global.race['artifical'] || this !== resources.Food) && ((game.global.race['banana'] && this === resources.Food) || (game.global.tech['trade'] && !game.global.race['terrifying']));
        }

        isManagedStorage() {
            return this.hasStorage() && this.autoStorageEnabled;
        }

        get atomicMass() {
            return game.atomic_mass[this.id] ?? 0;
        }

        isUseful() {
            // Spending accumulated resources
            if (!this.storeOverflow && this.currentQuantity > this.storageRequired && this.currentCrates + this.currentContainers > 0 && this.calculateRateOfChange({buy: false, all: true}) < 0) {
                return false;
            }
            return this.storageRatio < 0.99 || this.isDemanded() || this.rateMods['eject'] > 0 || this.rateMods['supply'] > 0 || (this.storeOverflow && (this.currentCrates < this.autoCratesMax || this.currentContainers < this.autoContainersMax));
        }

        getProduction(source, locArg) {
            let produced = 0;
            let labelFound = false;
            for (let [label, value] of Object.entries(game.breakdown.p[this._id])) {
                if (value.indexOf("%") === -1) {
                    if (labelFound) {
                        break;
                    } else if (label === poly.loc(source, locArg)) {
                        labelFound = true;
                        produced += parseFloat(value) || 0;
                    }
                } else if (labelFound) {
                    produced *= 1 + (parseFloat(value) || 0) / 100;
                }
            }
            return produced * state.globalProductionModifier;
        }

        getBusyWorkers(workersSource, workersCount, locArg) {
            if (this.incomeAdusted) { // Don't reduce workers of same resource more than once per tick to avoid flickering
                return workersCount;
            }

            let newWorkers = 0;
            if (workersCount > 0) {
                let totalIncome = this.getProduction(workersSource, locArg);
                let resPerWorker = totalIncome / workersCount;
                let usedIncome = totalIncome - this.calculateRateOfChange({buy: false, all: true});
                if (usedIncome > 0) {
                    newWorkers = Math.ceil(usedIncome / resPerWorker);
                }
            } else if (this.calculateRateOfChange({buy: false, all: true}) < 0) {
                newWorkers = 1;
            }
            this.incomeAdusted = newWorkers !== workersCount;

            return newWorkers;
        }

        isTradable() {
            return game.tradeRatio.hasOwnProperty(this.id) && (this.instance?.hasOwnProperty("trade") ?? false);
        }

        isCraftable() {
            return game.craftCost.hasOwnProperty(this.id);
        }

        hasStorage() {
            return this.instance?.stackable ?? false;
        }

        get tradeRouteQuantity() {
            return game.tradeRatio[this.id] || -1;
        }

        get storageRatio() {
            return this.maxQuantity > 0 ? this.currentQuantity / this.maxQuantity : 1;
        }

        isCapped() {
            return this.maxQuantity > 0 ? this.currentQuantity + (this.rateOfChange / ticksPerSecond()) >= this.maxQuantity : true;
        }

        get usefulRatio() {
            return this.maxQuantity > 0 && this.storageRequired > 0 ? this.currentQuantity / Math.min(this.maxQuantity, this.storageRequired) : 1;
        }

        get timeToFull() {
            if (this.storageRatio > 0.98) {
                return Number.MIN_SAFE_INTEGER; // Already full.
            }
            let totalRateOfCharge = this.calculateRateOfChange({buy: false, all: true});
            if (totalRateOfCharge <= 0) {
                return Number.MAX_SAFE_INTEGER; // Won't ever fill with current rate.
            }
            return (this.maxQuantity - this.currentQuantity) / totalRateOfCharge;
        }

        get timeToRequired() {
            if (this.storageRatio > 0.98) {
                return Number.MIN_SAFE_INTEGER; // Already full.
            }
            if (this.storageRequired <= 1) {
                return 0;
            }
            let totalRateOfCharge = this.calculateRateOfChange({buy: false, all: true});
            if (totalRateOfCharge <= 0) {
                return Number.MAX_SAFE_INTEGER; // Won't ever fill with current rate.
            }
            return (Math.min(this.maxQuantity, this.storageRequired) - this.currentQuantity) / totalRateOfCharge;
        }

        get autoCratesMax() {
            return this._autoCratesMax < 0 ? Number.MAX_SAFE_INTEGER : this._autoCratesMax;
        }

        get autoContainersMax() {
            return this._autoContainersMax < 0 ? Number.MAX_SAFE_INTEGER : this._autoContainersMax;
        }

        tryCraftX(count) {
            let vue = getVueById(this._vueBinding);
            if (vue === undefined) { return false; }

            resetMultiplier();
            vue.craft(this.id, count);
        }
    }

    class Supply extends Resource {
        updateData() {
            if (!this.isUnlocked()) {
                return;
            }

            this.currentQuantity = game.global.portal.purifier.supply;
            this.maxQuantity = game.global.portal.purifier.sup_max;
            this.rateOfChange = game.global.portal.purifier.diff;
        }

        isUnlocked() {
            return game.global.portal.hasOwnProperty('purifier');
        }
    }

    class Power extends Resource {
        updateData() {
            if (!this.isUnlocked()) {
                return;
            }

            this.currentQuantity = game.global.city.power;
            let missingPopEnergy = (resources.Population.maxQuantity - resources.Population.currentQuantity) * traitVal('powered', 0);
            this.maxQuantity = Object.values(buildings).reduce((net, b) => net + (b === buildings.NeutronCitadel ? getCitadelConsumption(b.count) - getCitadelConsumption(b.stateOnCount) : b.stateOffCount * b.powered), missingPopEnergy);
            this.rateOfChange = game.global.city.power;
        }

        get usefulRatio() { // Could be useful for satisfied check in override
            return this.currentQuantity >= this.maxQuantity ? 1 : 0;
        }

        isUnlocked() {
            return game.global.city.powered;
        }
    }

    class Support extends Resource {
        // This isn't really a resource but we're going to make a dummy one so that we can treat it like a resource
        constructor(name, id, region, inRegionId) {
            super(name, id);

            this._region = region;
            this._inRegionId = inRegionId;
        }

        updateData() {
            if (!this.isUnlocked()) {
                return;
            }

            this.maxQuantity = game.global[this._region][this.supportId].s_max;
            this.currentQuantity = game.global[this._region][this.supportId].support;
            this.rateOfChange = this.maxQuantity - this.currentQuantity;
        }

        get supportId() {
            return game.actions[this._region][this._inRegionId].info.support;
        }

        get storageRatio() {
            return this.maxQuantity > 0 ? (this.maxQuantity - this.currentQuantity) / this.maxQuantity : 1;
        }

        isUnlocked() {
            return game.global[this._region][this.supportId] !== undefined;
        }
    }

    class BeltSupport extends Support {
        // Unlike other supports this one takes in account available workers
        updateData() {
            if (!this.isUnlocked()) {
                return;
            }

            let maxStations = settings.autoPower && buildings.BeltSpaceStation.autoStateEnabled ? buildings.BeltSpaceStation.count : buildings.BeltSpaceStation.stateOnCount;
            let maxWorkers = settings.autoJobs && jobs.SpaceMiner.autoJobEnabled ? state.maxSpaceMiners : jobs.SpaceMiner.count;
            this.maxQuantity = Math.min(maxStations * 3, maxWorkers);
            this.currentQuantity = game.global[this._region][this.supportId].support;
            this.rateOfChange = this.maxQuantity - this.currentQuantity;
        }
    }

    class ElectrolysisSupport extends Support {
        updateData() {
            if (!this.isUnlocked()) {
                return;
            }

            this.maxQuantity = buildings.TitanElectrolysis.stateOnCount;
            this.currentQuantity = buildings.TitanHydrogen.stateOnCount;
            this.rateOfChange = this.maxQuantity - this.currentQuantity;
        }

        isUnlocked() {
            return game.global.race['truepath'] ? true : false;
        }
    }

    class SpecialResource extends Resource {
        updateData() {
            this.currentQuantity = game.global.race[this.id].count;
            this.maxQuantity = Number.MAX_SAFE_INTEGER;
        }

        isUnlocked() {
            return true;
        }
    }

    class AntiPlasmid extends Resource {
        updateData() {
            this.currentQuantity = game.global.race.Plasmid.anti;
            this.maxQuantity = Number.MAX_SAFE_INTEGER;
        }

        isUnlocked() {
            return true;
        }
    }

    class Population extends Resource {
        get id() {
            // The population node is special and its id will change to the race name
            return game.global.race.species;
        }
    }

    class StarPower extends Resource {
        updateData() {
            if (!this.isUnlocked()) {
                return;
            }

            this.currentQuantity = game.global.city.smelter.Star;
            this.maxQuantity = game.global.city.smelter.StarCap;
            this.rateOfChange = this.maxQuantity - this.currentQuantity;
        }

        isUnlocked() {
            return haveTech("star_forge", 2);
        }
    }

    class Morale extends Resource {
        updateData() {
            this.currentQuantity = game.global.city.morale.current;
            this.maxQuantity = game.global.city.morale.cap;
            this.rateOfChange = game.global.city.morale.potential;
            this.incomeAdusted = false;
        }

        isUnlocked() {
            return true;
        }
    }

    class ResourceProductionCost {
        constructor(resource, quantity, minRateOfChange) {
            this.resource = resource;
            this.quantity = quantity;
            this.minRateOfChange = minRateOfChange;
        }
    }

    class Action {
        constructor(name, tab, id, location, flags) {
            this.name = name;
            this._tab = tab;
            this._id = id;
            this._location = location;
            this.gameMax = Number.MAX_SAFE_INTEGER;
            this._vueBinding = this._tab + "-" + this.id;
            this.weighting = 0;
            this.extraDescription = "";
            this.consumption = [];
            this.cost = {};
            this.overridePowered = undefined;

            // Additional flags
            this.is = normalizeProperties(flags) ?? {};
        }

        get autoBuildEnabled() { return settings['bat' + this._vueBinding] }
        get autoStateEnabled() { return settings['bld_s_' + this._vueBinding] }
        get autoStateSmart() { return settings['bld_s2_' + this._vueBinding] }
        get priority() { return settingsRaw['bld_p_' + this._vueBinding] }
        get _weighting() { return settings['bld_w_' + this._vueBinding] }
        get _autoMax() { return settings['bld_m_' + this._vueBinding] }

        get definition() {
            if (this._location !== "") {
                return game.actions[this._tab][this._location][this._id];
            } else {
                return game.actions[this._tab][this._id];
            }
        }

        get instance() {
            return game.global[this._tab][this._id];
        }

        get id() {
            return this._id;
        }

        get title() {
            let def = this.definition;
            return def ? typeof def.title === 'function' ? def.title() : def.title : this.name;
        }

        get desc() {
            let def = this.definition;
            return def ? typeof def.desc === 'function' ? def.desc() : def.desc : this.name;
        }

        get vue() {
            return getVueById(this._vueBinding);
        }

        get autoMax() {
            // There is a game max. eg. world collider can only be built 1859 times
            return this._autoMax >= 0 && this._autoMax <= this.gameMax ? this._autoMax : this.gameMax;
        }

        isUnlocked() {
            return document.getElementById(this._vueBinding) !== null;
        }

        isSwitchable() {
            return this.definition.hasOwnProperty("powered") || this.definition.hasOwnProperty("switchable");
        }

        isMission() {
            return this.definition.hasOwnProperty("grant");
        }

        isComplete() {
            return haveTech(this.definition.grant[0], this.definition.grant[1]);
        }

        isSmartManaged() {
            return settings.autoPower && this.isUnlocked() && this.autoStateEnabled && this.autoStateSmart;
        }

        isAutoBuildable() {
            return settings.autoBuild && this.isUnlocked() && this.autoBuildEnabled && this._weighting > 0 && this.count < this.autoMax;
        }

        // export function checkPowerRequirements(c_action) from actions.js
        checkPowerRequirements() {
            for (let [tech, value] of Object.entries(this.definition.power_reqs ?? {})) {
                if (!haveTech(tech, value)){
                    return false;
                }
            }
            return true;
        }

        get powered() {
            if (this.overridePowered !== undefined) {
                return this.overridePowered;
            }

            if (!this.definition.hasOwnProperty("powered") || !this.checkPowerRequirements()) {
                return 0;
            }

            return this.definition.powered();
        }

        updateResourceRequirements() {
            if (!this.isUnlocked()) {
                return;
            }

            this.cost = {};
            let adjustedCosts = poly.adjustCosts(this.definition);
            for (let resourceName in adjustedCosts) {
                if (resources[resourceName]) {
                    let resourceAmount = Number(adjustedCosts[resourceName]());
                    if (resourceAmount > 0) {
                        this.cost[resourceName] = resourceAmount;
                    }
                }
            }
        }

        isAffordable(max = false) {
            return game.checkAffordable(this.definition, max);
        }

        // Whether the action is clickable is determined by whether it is unlocked, affordable and not a "permanently clickable" action
        isClickable() {
            return this.isUnlocked() && this.isAffordable() && this.count < this.gameMax;
        }

        // This is a "safe" click. It will only click if the container is currently clickable.
        // ie. it won't bypass the interface and click the node if it isn't clickable in the UI.
        click() {
            if (!this.isClickable()) {
                return false
            }

            for (let res in this.cost) {
                resources[res].currentQuantity -= this.cost[res];
            }

            // Don't log evolution actions and gathering actions
            if (game.global.race.species !== "protoplasm" && !logIgnore.includes(this.id)) {
                if (this.gameMax < Number.MAX_SAFE_INTEGER && this.count + 1 < this.gameMax) {
                    GameLog.logSuccess("multi_construction", poly.loc('build_success', [`${this.title} (${this.count + 1})`]), ['queue', 'building_queue']);
                } else {
                    GameLog.logSuccess("construction", poly.loc('build_success', [this.title]), ['queue', 'building_queue']);
                }
            }

            resetMultiplier();

            // Hide active popper from action, so it won't rewrite it
            let popper = $('#popper');
            if (popper.length > 0 && popper.data('id').indexOf(this._vueBinding) === -1) {
                popper.attr('id', 'TotallyNotAPopper');
                this.vue.action();
                popper.attr('id', 'popper');
            } else {
                this.vue.action();
            }

            return true;
        }

        addResourceConsumption(resource, rate) {
            this.consumption.push(normalizeProperties({ resource: resource, rate: rate }));
        }

        getMissingConsumption() {
            for (let j = 0; j < this.consumption.length; j++) {
                let resource = this.consumption[j].resource;
                if (resource instanceof Support) {
                    continue;
                }

                // Food fluctuate a lot, ignore it, assuming we always can get more
                if (resource === resources.Food && settings.autoJobs && (jobs.Farmer.autoJobEnabled || jobs.Hunter.autoJobEnabled)) {
                    continue;
                }

                // Adjust fuel
                let consumptionRate = this.consumption[j].rate;
                if (this._tab === "space" && (resource === resources.Oil || resource === resources.Helium_3)) {
                    consumptionRate = game.fuel_adjust(consumptionRate, true);
                }
                if (this._tab === "interstellar" && (resource === resources.Deuterium || resource === resources.Helium_3) && this !== buildings.AlphaFusion) {
                    consumptionRate = game.int_fuel_adjust(consumptionRate);
                }

                // Now let's actually check it, bought resources excluded from rateOfChange, to prevent losing resources after switching routes
                if (resource.storageRatio < 0.95 && consumptionRate > 0 && resource.calculateRateOfChange({buy: true}) < consumptionRate) {
                    return resource;
                }
            }
            return null;
        }

        getMissingSupport() {
            // We're going to build Spire things with no support, to enable them later
            if ((this === buildings.SpirePort || this === buildings.SpireBaseCamp || this === buildings.SpireMechBay) && this.autoStateSmart) {
                return null;
            }

            for (let j = 0; j < this.consumption.length; j++) {
                let resource = this.consumption[j].resource;
                let rate = this.consumption[j].rate;
                if (!(resource instanceof Support) || rate <= 0) {
                    continue;
                }

                // We don't have spare support for this
                if (resource.rateOfChange < rate) {
                    return resource;
                }
            }
            return null;
        }

        getUselessSupport() {
            // Starbase and Habitats are exceptions, they're always useful
            if (this === buildings.GatewayStarbase || this === buildings.AlphaHabitat) {
                return null;
            }

            let uselessSupports = [];
            for (let j = 0; j < this.consumption.length; j++) {
                let resource = this.consumption[j].resource;
                let rate = this.consumption[j].rate;
                if (!(resource instanceof Support) || rate >= 0) {
                    continue;
                }
                let minSupport = resource == resources.Belt_Support ? 2 : resource == resources.Gateway_Support ? 5 : 1;

                if (resource.rateOfChange >= minSupport) {
                    uselessSupports.push(resource);
                } else {
                    // If we have something useful - stop here, we care only about buildings with all suppors useless
                    return null;
                }
            }
            return uselessSupports[0] ?? null;
        }

        get count() {
            if (!this.isUnlocked()) {
                return 0;
            }

            return this.instance?.count ?? 0;
        }

        hasState() {
            if (!this.isUnlocked()) {
                return false;
            }

            return (this.definition.powered && haveTech("high_tech", 2) && this.checkPowerRequirements()) || this.definition.switchable?.() || false;
        }

        get stateOnCount() {
            if (!this.hasState() || this.count < 1) {
                return 0;
            }

            return this.instance.on;
        }

        get stateOffCount() {
            if (!this.hasState() || this.count < 1) {
                return 0;
            }

            return this.instance.count - this.instance.on;
        }

        tryAdjustState(adjustCount) {
            if (adjustCount === 0 || !this.hasState()) {
                return false;
            }

            let vue = this.vue;

            if (adjustCount > 0) {
                resetMultiplier();
                for (let i = 0; i < adjustCount; i++) {
                    vue.power_on();
                }
                return true;
            }

            if (adjustCount < 0) {
                resetMultiplier();
                for (let i = 0; i > adjustCount; i--) {
                    vue.power_off();
                }
                return true;
            }
        }
    }

    class ForgeHorseshoe extends Action {
        get count() {
            return resources.Horseshoe.currentQuantity;
        }
    }

    class Assembly extends Action {
        get count() {
            return resources.Population.currentQuantity;
        }
    }

    class EvolutionAction extends Action {
        isUnlocked() {
            let node = document.getElementById(this._vueBinding);
            return node !== null && !node.classList.contains('is-hidden');
        }
    }

    class SpaceDock extends Action {
        isOptionsCached() {
            if (this.count < 1 || game.global.tech['genesis'] < 4) {
                // It doesn't have options yet so I guess all "none" of them are cached!
                // Also return true if we don't have the required tech level yet
                return true;
            }

            // If our tech is unlocked but we haven't cached the vue the the options aren't cached
            if (!buildings.GasSpaceDockProbe.isOptionsCached()
                || game.global.tech['genesis'] >= 5 && !buildings.GasSpaceDockShipSegment.isOptionsCached()
                || game.global.tech['genesis'] === 6 && !buildings.GasSpaceDockPrepForLaunch.isOptionsCached()
                || game.global.tech['genesis'] >= 7 && !buildings.GasSpaceDockLaunch.isOptionsCached()) {
                return false;
            }

            return true;
        }

        cacheOptions() {
            if (this.count < 1 || WindowManager.isOpen()) {
                return false;
            }

            let optionsNode = document.querySelector("#space-star_dock .special");
            let title = typeof game.actions.space.spc_gas.star_dock.title === 'function' ? game.actions.space.spc_gas.star_dock.title() : game.actions.space.spc_gas.star_dock.title;
            WindowManager.openModalWindowWithCallback(optionsNode, title, () => {
                buildings.GasSpaceDockProbe.cacheOptions();
                buildings.GasSpaceDockShipSegment.cacheOptions();
                buildings.GasSpaceDockPrepForLaunch.cacheOptions();
                buildings.GasSpaceDockLaunch.cacheOptions();
            });
            return true;
        }
    }

    class ModalAction extends Action {
        constructor(...args) {
            super(...args);

            this._vue = undefined;
        }

        get vue() {
            return this._vue;
        }

        isOptionsCached() {
            return this.vue !== undefined;
        }

        cacheOptions() {
            this._vue = getVueById(this._vueBinding);
        }

        isUnlocked() {
            // We have to override this as there won't be an element unless the modal window is open
            return this._vue !== undefined;
        }
    }

    class Project extends Action {
        constructor(name, id) {
            super(name, "arpa", id, "");
            this._vueBinding = "arpa" + this.id;
            this.currentStep = 1;
        }

        get autoBuildEnabled() { return settings['arpa_' + this._id] }
        get priority() { return settingsRaw['arpa_p_' + this._id] }
        get _autoMax() { return settings['arpa_m_' + this._id] }
        get _weighting() { return settings['arpa_w_' + this._id] }

        updateResourceRequirements() {
            if (!this.isUnlocked()) {
                return;
            }

            this.cost = {};
            let maxStep = Math.min(100 - this.progress, state.triggerTargets.includes(this) ? 100 : settings.arpaStep);

            let adjustedCosts = poly.arpaAdjustCosts(this.definition.cost);
            for (let resourceName in adjustedCosts) {
                if (resources[resourceName]) {
                    let resourceAmount = Number(adjustedCosts[resourceName]());
                    if (resourceAmount > 0) {
                        this.cost[resourceName] = resourceAmount / 100;
                        maxStep = Math.min(maxStep, resources[resourceName].maxQuantity / this.cost[resourceName]);
                    }
                }
            }

            this.currentStep = Math.max(Math.floor(maxStep), 1);
            if (this.currentStep > 1) {
                for (let res in this.cost) {
                    this.cost[res] *= this.currentStep;
                }
            }
        }

        get count() {
            return this.instance?.rank ?? 0;
        }

        get progress() {
            return this.instance?.complete ?? 0;
        }

        isAffordable(max = false) {
            // We can't use exposed checkAffordable with projects, so let's write it. Luckily project need only basic resources
            let check = max ? "maxQuantity" : "currentQuantity";
            for (let res in this.cost) {
                if (resources[res][check] < this.cost[res]) {
                    return false;
                }
            }
            return true;
        }

        isClickable() {
            return this.isUnlocked() && this.isAffordable(false);
        }

        click() {
            if (!this.isClickable()) {
                return false
            }

            for (let res in this.cost) {
                resources[res].currentQuantity -= this.cost[res];
            }

            if (this.progress + this.currentStep < 100) {
                GameLog.logSuccess("arpa", poly.loc('build_success', [`${this.title} (${this.progress + this.currentStep}%)`]), ['queue', 'building_queue']);
            } else {
                GameLog.logSuccess("construction", poly.loc('build_success', [this.title]), ['queue', 'building_queue']);
            }

            resetMultiplier();
            getVueById(this._vueBinding).build(this.id, this.currentStep);
            return true;
        }
    }

    class Technology {
        constructor(id) {
            this._id = id;

            this._vueBinding = "tech-" + id;

            this.cost = {};
        }

        get id() {
            return this._id;
        }

        isUnlocked() {
            // vue of researched techs still can be found in #oldTech
            return document.querySelector("#" + this._vueBinding + " > a") !== null && getVueById(this._vueBinding) !== undefined;
        }

        get definition() {
            return game.actions.tech[this._id];
        }

        get title() {
            return typeof this.definition.title === 'function' ? this.definition.title() : this.definition.title;
        }

        get name() {
            return this.title;
        }

        isAffordable(max = false) {
            return game.checkAffordable(this.definition, max);
        }

        // Whether the action is clickable is determined by whether it is unlocked, affordable and not a "permanently clickable" action
        isClickable() {
            return this.isUnlocked() && this.isAffordable();
        }

        // This is a "safe" click. It will only click if the container is currently clickable.
        // ie. it won't bypass the interface and click the node if it isn't clickable in the UI.
        click() {
            if (!this.isClickable()) {
                return false
            }

            for (let res in this.cost) {
                resources[res].currentQuantity -= this.cost[res];
            }

            getVueById(this._vueBinding).action();
            GameLog.logSuccess("research", poly.loc('research_success', [techIds[this.definition.id].title]), ['queue', 'research_queue']);
            return true;
        }

        isResearched() {
            return document.querySelector("#tech-" + this.id + " .oldTech") !== null;
        }

        updateResourceRequirements() {
            if (!this.isUnlocked()) {
                return;
            }

            this.cost = {};

            let adjustedCosts = poly.adjustCosts(this.definition);
            for (let resourceName in adjustedCosts) {
                if (resources[resourceName]) {
                    let resourceAmount = Number(adjustedCosts[resourceName]());
                    if (resourceAmount > 0) {
                        this.cost[resourceName] = resourceAmount;
                    }
                }
            }
        }
    }

    class Race {
        constructor(id) {
            this.id = id;
            this.evolutionTree = [];
        }

        get name() {
            return game.races[this.id].name ?? "Custom";
        }

        get desc() {
            let nameRef = game.races[this.id].desc;
            return typeof nameRef === "function" ? nameRef() :
                   typeof nameRef === "string" ? nameRef :
                   "Custom"; // Nonexistent custom
        }

        get genus() {
            return game.races[this.id].type;
        }

        getWeighting() {
            // Locked races always have zero weighting
            let habitability = this.getHabitability();
            if (habitability <= 0) {
                return 0;
            }

            let weighting = 0;
            let starLevel = getStarLevel(settings);
            const checkAchievement = (baseWeight, id) => {
                weighting += baseWeight * Math.max(0, starLevel - getAchievementStar(id));
                if (game.global.race.universe !== "micro" && game.global.race.universe !== "standard") {
                    weighting += baseWeight * Math.max(0, starLevel - getAchievementStar(id, "standard"));
                }
            }

            // Check pillar
            if (game.global.race.universe !== "micro" && resources.Harmony.currentQuantity >= 1 && ((settings.prestigeType === "ascension" && settings.prestigeAscensionPillar) || settings.prestigeType === "demonic")) {
                weighting += 1000 * Math.max(0, starLevel - (game.global.pillars[this.id] ?? 0));
                // Check genus pillar for Enlightenment
                if (this.id !== "custom" && this.id !== "junker") {
                    let genusPillar = Math.max(...Object.values(races)
                      .filter(r => r.id !== "custom" && r.id !== "junker")
                      .map(r => (game.global.pillars[r.id] ?? 0)));
                    weighting += 10000 * Math.max(0, starLevel - genusPillar);
                }
            }

            // Check greatness\extinction achievement
            if (settings.prestigeType === "bioseed" || settings.prestigeType === "ascension") {
                checkAchievement(100, "genus_" + this.genus);
            }  else {
                checkAchievement(100, "extinct_" + this.id);
            }

            // Blood War
            if (this.genus === "demonic" && settings.prestigeType !== "mad" && settings.prestigeType !== "bioseed") {
                checkAchievement(50, "blood_war");
            }

            // Sharks with Lasers
            if (this.id === "sharkin" && settings.prestigeType !== "mad") {
                checkAchievement(50, "laser_shark");
            }

            // Macro Universe and Arquillian Galaxy
            if (game.global.race.universe === "micro" && settings.prestigeType === "bioseed") {
                let smallRace = (this.genus === "small" || game.races[this.id].traits.compact);
                checkAchievement(50, smallRace ? "macro" : "marble");
            }

            // You Shall Pass
            if (this.id === "balorg" && game.global.race.universe === "magic" && settings.prestigeType === "vacuum") {
                checkAchievement(50, "pass");
            }

            // Madagascar Tree, Godwin's law, Infested Terrans - Achievement race
            for (let set of fanatAchievements) {
                if (this.id === set.race && game.global.race.gods === set.god) {
                    checkAchievement(150, set.achieve);
                }
            }

            // Increase weight for suited conditional races with achievements
            if (weighting > 0 && habitability === 1 && this.getCondition() !== '' && this.id !== "junker") {
                weighting += 500;
            }

            // Same race for Second Evolution
            if (this.id === game.global.race.gods) {
                checkAchievement(10, "second_evolution");
            }

            // Madagascar Tree, Godwin's law, Infested Terrans - God race
            // This races shouldn't benefit from suited planet, to avoid prep -> prep loops
            for (let set of fanatAchievements) {
                if (this.id === set.god) {
                    checkAchievement(5, set.achieve);
                }
            }

            // Feats, lowest weight - go for them only if there's nothing better
            if (game.global.race.universe !== "micro") {
                const checkFeat = (id) => {
                    weighting += 1 * Math.max(0, starLevel - (game.global.stats.feat[id] ?? 0));
                }

                // Take no advice, Ill Advised
                if (game.global.city.biome === "hellscape" && this.genus !== "demonic") {
                    switch (settings.prestigeType) {
                        case "mad":
                        case "cataclysm":
                            checkFeat("take_no_advice");
                            break;
                        case "bioseed":
                            checkFeat("ill_advised");
                            break;
                    }
                }

                // Organ Harvester, The Misery, Garbage Pie
                if (this.id === "junker") {
                    switch (settings.prestigeType) {
                        case "bioseed":
                            checkFeat("organ_harvester");
                            break;
                        case "ascension":
                        case "demonic":
                            checkFeat("garbage_pie");
                        case "whitehole":
                        case "vacuum":
                        case "apocalypse":
                            checkFeat("the_misery");
                            break;
                    }
                }

                // Nephilim
                if (settings.prestigeType === "whitehole" && game.global.race.universe === "evil" && this.genus === "angelic") {
                    checkFeat("nephilim");
                }

                // Twisted
                if (settings.prestigeType === "demonic" && this.genus === "angelic") {
                    checkFeat("twisted");
                }
            }

            // Ignore Valdi on low star, and decrease weight on any other star
            if (this.id === "junker") {
                weighting *= starLevel < 5 ? 0 : 0.01;
            }

            // Scale down weight of unsuited races
            weighting *= habitability;

            return weighting;
        }

        getHabitability() {
            if (this.id === "junker") {
                return game.global.genes.challenge ? 1 : 0;
            }

            switch (this.genus) {
                case "aquatic":
                    return game.global.city.biome === 'oceanic' ? 1 : getUnsuitedMod();
                case "fey":
                    return game.global.city.biome === 'forest' ? 1 : getUnsuitedMod();
                case "sand":
                    return game.global.city.biome === 'desert' ? 1 : getUnsuitedMod();
                case "heat":
                    return game.global.city.biome === 'volcanic' ? 1 : getUnsuitedMod();
                case "polar":
                    return game.global.city.biome === 'tundra' ? 1 : getUnsuitedMod();
                case "demonic":
                    return game.global.city.biome === 'hellscape' ? 1 : game.global.blood.unbound >= 3 ? getUnsuitedMod() : 0;
                case "angelic":
                    return game.global.city.biome === 'eden' ? 1 : game.global.blood.unbound >= 3 ? getUnsuitedMod() : 0;
                case "synthetic":
                    return game.global.stats.achieve[`obsolete`]?.l >= 5 ? 1 : 0;
                case undefined: // Nonexistent custom
                    return 0;
                default:
                    return 1;
            }
        }

        getCondition() {
            if (this.id === "junker") {
                return "Challenge genes unlocked";
            }

            switch (this.genus) {
                case "aquatic":
                    return "海洋星球";
                case "fey":
                    return "森林星球";
                case "sand":
                    return "沙漠星球";
                case "heat":
                    return "火山星球";
                case "polar":
                    return "苔原星球";
                case "demonic":
                    return "地狱星球";
                case "angelic":
                    return "伊甸园星球";
                case "synthetic":
                    return game.loc('achieve_obsolete_desc');
                case undefined: // Nonexistent custom
                    return game.loc('achieve_ascended_desc');
                default:
                    return "";
            }
        }
    }

    class Trigger {
        constructor(seq, priority, requirementType, requirementId, requirementCount, actionType, actionId, actionCount) {
            this.seq = seq;
            this.priority = priority;

            this.requirementType = requirementType;
            this.requirementId = requirementId;
            this.requirementCount = requirementCount;

            this.actionType = actionType;
            this.actionId = actionId;
            this.actionCount = actionCount;

            this.complete = false;
        }

        cost() {
            if (this.actionType === "research") {
                return techIds[this.actionId].definition.cost;
            }
            if (this.actionType === "build") {
                return buildingIds[this.actionId].definition.cost;
            }
            if (this.actionType === "arpa") {
                return arpaIds[this.actionId].definition.cost;
            }
            return {};
        }

        isActionPossible() {
            // check against MAX as we want to know if it is possible...
            let obj = null;
            if (this.actionType === "research") {
                obj = techIds[this.actionId];
            }
            if (this.actionType === "build") {
                obj = buildingIds[this.actionId];
            }
            if (this.actionType === "arpa") {
                obj = arpaIds[this.actionId];
            }
            return obj && obj.isUnlocked() && obj.isAffordable(true);
        }

        updateComplete() {
            if (this.complete) {
                return false;
            }

            if (this.actionType === "research" && techIds[this.actionId].isResearched()) {
                this.complete = true;
                return true;
            }
            if (this.actionType === "build" && buildingIds[this.actionId].count >= this.actionCount) {
                this.complete = true;
                return true;
            }
            if (this.actionType === "arpa" && arpaIds[this.actionId].count >= this.actionCount) {
                this.complete = true;
                return true;
            }
            return false;
        }

        areRequirementsMet() {
            if (this.requirementType === "unlocked" && techIds[this.requirementId].isUnlocked()) {
                return true;
            }
            if (this.requirementType === "researched" && techIds[this.requirementId].isResearched()) {
                return true;
            }
            if (this.requirementType === "built" && (buildingIds[this.requirementId].isMission() ? Number(buildingIds[this.requirementId].isComplete()) : buildingIds[this.requirementId].count) >= this.requirementCount) {
                return true;
            }
            return false;
        }

        updateRequirementType(requirementType) {
            if (requirementType === this.requirementType) {
                return;
            }

            let oldType = this.requirementType;
            this.requirementType = requirementType;
            this.complete = false;

            if ((this.requirementType === "unlocked" || this.requirementType === "researched") &&
                (oldType === "unlocked" || oldType === "researched")) {
                return; // Both researches, old ID is still valid, and preserved.
            }

            if (this.requirementType === "unlocked" || this.requirementType === "researched") {
                this.requirementId = "tech-club";
                this.requirementCount = 0;
                return;
            }

            if (this.requirementType === "built") {
                this.requirementId = "city-basic_housing";
                this.requirementCount = 1;
                return;
            }
        }

        updateRequirementId(requirementId) {
            if (requirementId === this.requirementId) {
                return;
            }

            this.requirementId = requirementId;
            this.complete = false;
        }

        updateRequirementCount(requirementCount) {
            if (requirementCount === this.requirementCount) {
                return;
            }

            this.requirementCount = requirementCount;
            this.complete = false;
        }

        updateActionType(actionType) {
            if (actionType === this.actionType) {
                return;
            }

            this.actionType = actionType;
            this.complete = false;

            if (this.actionType === "research") {
                this.actionId = "tech-club";
                this.actionCount = 0;
                return;
            }
            if (this.actionType === "build") {
                this.actionId = "city-basic_housing";
                this.actionCount = 1;
                return;
            }
            if (this.actionType === "arpa") {
                this.actionId = "arpalhc";
                this.actionCount = 1;
                return;
            }
        }

        updateActionId(actionId) {
            if (actionId === this.actionId) {
                return;
            }

            this.actionId = actionId;
            this.complete = false;
        }

        updateActionCount(actionCount) {
            if (actionCount === this.actionCount) {
                return;
            }

            this.actionCount = actionCount;
            this.complete = false;
        }
    }

    class MinorTrait {
        constructor(traitName) {
            this.traitName = traitName;
        }

        get enabled() { return settings['mTrait_' + this.traitName] }
        get priority() { return settingsRaw['mTrait_p_' + this.traitName] }
        get weighting() { return settings['mTrait_w_' + this.traitName] }

        isUnlocked() {
            return game.global.settings.mtorder.includes(this.traitName);
        }

        geneCount() {
            return game.global.race.minor[this.traitName] ?? 0;
        }

        phageCount() {
            return game.global.genes.minor[this.traitName] ?? 0;
        }

        totalCount() {
            return game.global.race[this.traitName] ?? 0;
        }

        geneCost() {
            return this.traitName === 'mastery' ? Fibonacci(this.geneCount()) * 5 : Fibonacci(this.geneCount());
        }
    }

    // Script constants

    // Fibonacci numbers starting from "5"
    const Fibonacci = ((m) => (n) => m[n] ?? (m[n] = Fibonacci(n-1) + Fibonacci(n-2)))([5,8]);

    const numberSuffix = {
        K: 1000,
        M: 1000000,
        G: 1000000000,
        T: 1000000000000,
        P: 1000000000000000,
        E: 1000000000000000000,
        Z: 1000000000000000000000,
        Y: 1000000000000000000000000,
    }

    const universes = ['standard','heavy','antimatter','evil','micro','magic'];

    // Biomes, traits and geologies in natural order
    const biomeList = ['grassland', 'oceanic', 'forest', 'desert', 'volcanic', 'tundra', 'hellscape', 'eden'];
    const traitList = ['none', 'toxic', 'mellow', 'rage', 'stormy', 'ozone', 'magnetic', 'trashed', 'elliptical', 'flare', 'dense', 'unstable'];
    const extraList = ['Achievement', 'Copper', 'Iron', 'Aluminium', 'Coal', 'Oil', 'Titanium', 'Uranium', 'Iridium'];

    // Biomes and traits sorted by habitability
    const planetBiomes = ["eden", "volcanic", "tundra", "oceanic", "forest", "grassland", "desert", "hellscape"];
    const planetTraits = ["elliptical", "magnetic", "rage", "none", "stormy", "toxic", "trashed", "dense", "unstable", "ozone", "mellow", "flare"];
    const planetBiomeGenus = {hellscape: "demonic", eden: "angelic", oceanic: "aquatic", forest: "fey", desert: "sand", volcanic: "heat", tundra: "polar"};
    const fanatAchievements = [{god: 'sharkin', race: 'entish', achieve: 'madagascar_tree'},
                               {god: 'sporgar', race: 'human', achieve: 'infested'},
                               {god: 'shroomi', race: 'troll', achieve: 'godwin'}];

    const challenges = [
        [{id:"plasmid", trait:"no_plasmid"},
         {id:"mastery", trait:"weak_mastery"},
         {id:"nerfed", trait:"nerfed"}],
        [{id:"crispr", trait:"no_crispr"},
         {id:"badgenes", trait:"badgenes"}],
        [{id:"trade", trait:"no_trade"}],
        [{id:"craft", trait:"no_craft"}],
        [{id:"joyless", trait:"joyless"}],
        [{id:"steelen", trait:"steelen"}],
        [{id:"decay", trait:"decay"}],
        [{id:"emfield", trait:"emfield"}],
        [{id:"inflation", trait:"inflation"}],
        [{id:"junker", trait:"junker"}],
        [{id:"cataclysm", trait:"cataclysm"}],
        [{id:"banana", trait:"banana"}],
        [{id:"truepath", trait:"truepath"}],
    ];
    const governors = ["soldier", "criminal", "entrepreneur", "educator", "spiritual", "bluecollar", "noble", "media", "sports", "bureaucrat"];
    const evolutionSettingsToStore = ["userEvolutionTarget", "prestigeType", ...challenges.map(c => "challenge_" + c[0].id)];
    const prestigeNames = {mad: "核弹重置", bioseed: "播种重置", cataclysm: "大灾变重置", vacuum: "真空坍缩", whitehole: "黑洞重置", apocalypse: "人工智能觉醒", ascension: "飞升重置", demonic: "恶魔灌注"};
    const logIgnore = ["food", "lumber", "stone", "chrysotile", "slaughter", "s_alter", "slave_market", "horseshoe", "assembly"];
    const galaxyRegions = ["gxy_stargate", "gxy_gateway", "gxy_gorddon", "gxy_alien1", "gxy_alien2", "gxy_chthonian"];
    const settingsSections = ["general", "prestige", "evolution", "research", "market", "storage", "production", "war", "hell", "fleet", "job", "building", "project", "government", "logging", "minorTrait", "weighting", "ejector", "planet", "mech", "magic"];
    const unlimitedJobs = ["unemployed", "hunter", "farmer", "lumberjack", "quarry_worker", "crystal_miner", "scavenger", "forager"]; // this.definition.max holds zero at evolution stage, and that can mess with settings gui

    // Lookup tables, will be filled on init
    var techIds = {};
    var buildingIds = {};
    var arpaIds = {};
    var jobIds = {};
    var evolutions = {};
    var races = {};
    var craftablesList = [];
    var foundryList = [];

    // State variables
    var state = {
        forcedUpdate: false,
        scriptTick: 1,
        multiplierTick: 0,
        buildingToggles: 0,
        evolutionAttempts: 0,
        tabHash: 0,

        lastWasteful: null,
        lastPopulationCount: 0,
        lastFarmerCount: 0,

        warnDebug: true,
        warnPreload: true,

        // We need to keep them separated, as we *don't* want to click on queue targets. Game will handle that. We're just managing resources for them.
        queuedTargets: [],
        queuedTargetsAll: [],
        triggerTargets: [],
        unlockedTechs: [],
        unlockedBuildings: [],
        conflictTargets: [],

        maxSpaceMiners: Number.MAX_SAFE_INTEGER,
        globalProductionModifier: 1,
        moneyIncomes: new Array(11).fill(0),
        moneyMedian: 0,
        soulGemIncomes: [{sec: 0, gems: 0}],
        soulGemLast: Number.MAX_SAFE_INTEGER,

        knowledgeRequiredByTechs: 0,

        goal: "Standard",

        missionBuildingList: [],
        filterRegExp: null,
        evolutionTarget: null,
    };

    // Class instances
    var resources = { // Resources order follow game order, and used to initialize priorities
        // Evolution resources
        RNA: new Resource("RNA", "RNA"),
        DNA: new Resource("DNA", "DNA"),

        // Base resources
        Money: new Resource("Money", "Money"),
        Population: new Population("人口", "Population"), // We can't store the full elementId because we don't know the name of the population node until later
        Slave: new Resource("Slave", "Slave"),
        Mana: new Resource("Mana", "Mana"),
        Knowledge: new Resource("Knowledge", "Knowledge"),
        Zen: new Resource("Zen", "Zen"),
        Crates: new Resource("Crates", "Crates"),
        Containers: new Resource("Containers", "Containers"),

        // Basic resources (can trade for these)
        Food: new Resource("Food", "Food"),
        Lumber: new Resource("Lumber", "Lumber"),
        Chrysotile: new Resource("Chrysotile", "Chrysotile"),
        Stone: new Resource("Stone", "Stone"),
        Crystal: new Resource("Crystal", "Crystal"),
        Furs: new Resource("Furs", "Furs"),
        Copper: new Resource("Copper", "Copper"),
        Iron: new Resource("Iron", "Iron"),
        Aluminium: new Resource("Aluminium", "Aluminium"),
        Cement: new Resource("Cement", "Cement"),
        Coal: new Resource("Coal", "Coal"),
        Oil: new Resource("Oil", "Oil"),
        Uranium: new Resource("Uranium", "Uranium"),
        Steel: new Resource("Steel", "Steel"),
        Titanium: new Resource("Titanium", "Titanium"),
        Alloy: new Resource("Alloy", "Alloy"),
        Polymer: new Resource("Polymer", "Polymer"),
        Iridium: new Resource("Iridium", "Iridium"),
        Helium_3: new Resource("Helium-3", "Helium_3"),

        // Advanced resources
        Water: new Resource("Water", "Water"),
        Deuterium: new Resource("Deuterium", "Deuterium"),
        Neutronium: new Resource("Neutronium", "Neutronium"),
        Adamantite: new Resource("Adamantite", "Adamantite"),
        Infernite: new Resource("Infernite", "Infernite"),
        Elerium: new Resource("Elerium", "Elerium"),
        Nano_Tube: new Resource("Nano Tube", "Nano_Tube"),
        Graphene: new Resource("Graphene", "Graphene"),
        Stanene: new Resource("Stanene", "Stanene"),
        Bolognium: new Resource("Bolognium", "Bolognium"),
        Vitreloy: new Resource("Vitreloy", "Vitreloy"),
        Orichalcum: new Resource("Orichalcum", "Orichalcum"),

        Horseshoe: new Resource("Horseshoe", "Horseshoe"),
        Nanite: new Resource("Nanite", "Nanite"),
        Genes: new Resource("Genes", "Genes"),
        Soul_Gem: new Resource("Soul Gem", "Soul_Gem"),

        // Craftable resources
        Plywood: new Resource("Plywood", "Plywood"),
        Brick: new Resource("Brick", "Brick"),
        Wrought_Iron: new Resource("Wrought Iron", "Wrought_Iron"),
        Sheet_Metal: new Resource("Sheet Metal", "Sheet_Metal"),
        Mythril: new Resource("Mythril", "Mythril"),
        Aerogel: new Resource("Aerogel", "Aerogel"),
        Nanoweave: new Resource("Nanoweave", "Nanoweave"),
        Scarletite: new Resource("Scarletite", "Scarletite"),
        Quantium: new Resource("Quantium", "Quantium"),

        // Special resources
        Corrupt_Gem: new Resource("Corrupt Gem", "Corrupt_Gem"),
        Codex: new Resource("Codex", "Codex"),
        Cipher: new Resource("Encrypted Data", "Cipher"),
        Demonic_Essence: new Resource("Demonic Essence", "Demonic_Essence"),

        // Prestige resources
        Blood_Stone: new Resource("Blood Stone", "Blood_Stone"),
        Artifact: new Resource("Artifact", "Artifact"),
        Plasmid: new SpecialResource("Plasmid", "Plasmid"),
        Antiplasmid: new AntiPlasmid("反质粒", "Antiplasmid"),
        Phage: new SpecialResource("Phage", "Phage"),
        Dark: new SpecialResource("Dark", "Dark"),
        Harmony: new SpecialResource("Harmony", "Harmony"),
        AICore: new SpecialResource("AI Core", "AICore"),

        // Special not-really-resources-but-we'll-treat-them-like-resources resources
        Supply: new Supply("Supplies", "Supply"),
        Power: new Power("电力", "Power"),
        StarPower: new StarPower("星辰", "StarPower"),
        Morale: new Morale("士气", "Morale"),
        Moon_Support: new Support("月球支持", "Moon_Support", "space", "spc_moon"),
        Red_Support: new Support("红色行星支持", "Red_Support", "space", "spc_red"),
        Sun_Support: new Support("蜂群支持", "Sun_Support", "space", "spc_sun"),
        Belt_Support: new BeltSupport("小行星带支持", "Belt_Support", "space", "spc_belt"),
        Titan_Support: new Support("最大卫星支持", "Titan_Support", "space", "spc_titan"),
        Electrolysis_Support: new ElectrolysisSupport("电解工厂", "Electrolysis_Support", "", ""),
        Enceladus_Support: new Support("第六大卫星支持", "Enceladus_Support", "space", "spc_enceladus"),
        Eris_Support: new Support("矮行星支持", "Eris_Support", "space", "spc_eris"),
        Alpha_Support: new Support("半人马座α星系支持", "Alpha_Support", "interstellar", "int_alpha"),
        Nebula_Support: new Support("螺旋星云支持", "Nebula_Support", "interstellar", "int_nebula"),
        Gateway_Support: new Support("星门支持", "Gateway_Support", "galaxy", "gxy_gateway"),
        Alien_Support: new Support("第五星系支持", "Alien_Support", "galaxy", "gxy_alien2"),
        Lake_Support: new Support("湖泊支持", "Lake_Support", "portal", "prtl_lake"),
        Spire_Support: new Support("尖塔支持", "Spire_Support", "portal", "prtl_spire"),
    }

    var jobs = {
        Unemployed: new Job("unemployed", "失业人口"),
        Hunter: new Job("hunter", "猎人"),
        Farmer: new Job("farmer", "农民"),
        //Forager: new Job("forager", "Forager"),
        Lumberjack: new Job("lumberjack", "伐木工人"),
        QuarryWorker: new Job("quarry_worker", "石工"),
        CrystalMiner: new Job("crystal_miner", "水晶矿工"),
        Scavenger: new Job("scavenger", "清道夫"),

        Colonist: new Job("colonist", "行星居民"),
        TitanColonist: new Job("titan_colonist", "卫星行星居民"),
        Miner: new Job("miner", "矿工"),
        CoalMiner: new Job("coal_miner", "煤矿工人"),
        CementWorker: new Job("cement_worker", "水泥工人"),
        Professor: new Job("professor", "教授"),
        Scientist: new Job("scientist", "科学家"),
        Entertainer: new Job("entertainer", "艺人"),
        HellSurveyor: new Job("hell_surveyor", "勘探者"),
        SpaceMiner: new Job("space_miner", "太空矿工"),
        Archaeologist: new Job("archaeologist", "考古学家"),
        Banker: new Job("banker", "银行家"),
        Priest: new Job("priest", "牧师"),

        // Crafting jobs
        Plywood: new CraftingJob("Plywood", "胶合板工匠", resources.Plywood),
        Brick: new CraftingJob("Brick", "砌砖工匠", resources.Brick),
        WroughtIron: new CraftingJob("Wrought_Iron", "锻铁工匠", resources.Wrought_Iron),
        SheetMetal: new CraftingJob("Sheet_Metal", "金属板工匠", resources.Sheet_Metal),
        Mythril: new CraftingJob("Mythril", "秘银工匠", resources.Mythril),
        Aerogel: new CraftingJob("Aerogel", "气凝胶工匠", resources.Aerogel),
        Nanoweave: new CraftingJob("Nanoweave", "纳米织物工匠", resources.Nanoweave),
        Scarletite: new CraftingJob("Scarletite", "绯绯色金工匠", resources.Scarletite),
        Quantium: new CraftingJob("Quantium", "量子工匠", resources.Quantium),
    }

    var buildings = {
        Food: new Action("Food", "city", "food", ""),
        Lumber: new Action("Lumber", "city", "lumber", ""),
        Stone: new Action("Stone", "city", "stone", ""),
        Chrysotile: new Action("Chrysotile", "city", "chrysotile", ""),
        Slaughter: new Action("Slaughter", "city", "slaughter", ""),
        ForgeHorseshoe: new ForgeHorseshoe("Horseshoe", "city", "horseshoe", "", {housing: true, garrison: true}),
        SlaveMarket: new Action("Slave Market", "city", "slave_market", ""),
        SacrificialAltar: new Action("Sacrificial Altar", "city", "s_alter", ""),
        House: new Action("Cabin", "city", "basic_housing", "", {housing: true}),
        Cottage: new Action("Cottage", "city", "cottage", "", {housing: true}),
        Apartment: new Action("Apartment", "city", "apartment", "", {housing: true}),
        Lodge: new Action("Lodge", "city", "lodge", "", {housing: true}),
        Smokehouse: new Action("Smokehouse", "city", "smokehouse", ""),
        SoulWell: new Action("Soul Well", "city", "soul_well", ""),
        SlavePen: new Action("Slave Pen", "city", "slave_pen", ""),
        Transmitter: new Action("Transmitter", "city", "transmitter", "", {housing: true}),
        Farm: new Action("Farm", "city", "farm", "", {housing: true}),
        CompostHeap: new Action("Compost Heap", "city", "compost", ""),
        Mill: new Action("Windmill", "city", "mill", "", {smart: true}),
        Windmill: new Action("Windmill (Evil)", "city", "windmill", ""),
        Silo: new Action("Grain Silo", "city", "silo", ""),
        Assembly: new Assembly("Assembly", "city", "assembly", "", {housing: true}),
        Barracks: new Action("Barracks", "city", "garrison", "", {garrison: true, smart: true}),
        Hospital: new Action("Hospital", "city", "hospital", ""),
        BootCamp: new Action("Boot Camp", "city", "boot_camp", ""),
        Shed: new Action("Shed", "city", "shed", ""),
        StorageYard: new Action("Freight Yard", "city", "storage_yard", ""),
        Warehouse: new Action("Container Port", "city", "warehouse", ""),
        Bank: new Action("Bank", "city", "bank", ""),
        Pylon: new Action("Pylon", "city", "pylon", ""),
        Graveyard: new Action ("Graveyard", "city", "graveyard", ""),
        LumberYard: new Action("Lumber Yard", "city", "lumber_yard", ""),
        Sawmill: new Action("Sawmill", "city", "sawmill", ""),
        RockQuarry: new Action("Rock Quarry", "city", "rock_quarry", ""),
        CementPlant: new Action("Cement Plant", "city", "cement_plant", "", {smart: true}),
        Foundry: new Action("Foundry", "city", "foundry", ""),
        Factory: new Action("Factory", "city", "factory", ""),
        NaniteFactory: new Action("Nanite Factory", "city", "nanite_factory", ""),
        Smelter: new Action("Smelter", "city", "smelter", ""),
        MetalRefinery: new Action("Metal Refinery", "city", "metal_refinery", ""),
        Mine: new Action("Mine", "city", "mine", "", {smart: true}),
        CoalMine: new Action("Coal Mine", "city", "coal_mine", "", {smart: true}),
        OilWell: new Action("Oil Derrick", "city", "oil_well", ""),
        OilDepot: new Action("Fuel Depot", "city", "oil_depot", ""),
        Trade: new Action("Trade Post", "city", "trade", ""),
        Wharf: new Action("Wharf", "city", "wharf", ""),
        TouristCenter: new Action("Tourist Center", "city", "tourist_center", "", {smart: true}),
        Amphitheatre: new Action("Amphitheatre", "city", "amphitheatre", ""),
        Casino: new Action("Casino", "city", "casino", ""),
        Temple: new Action("Temple", "city", "temple", ""),
        Shrine: new Action ("Shrine", "city", "shrine", ""),
        MeditationChamber: new Action("Meditation Chamber", "city", "meditation", ""),
        University: new Action("University", "city", "university", "", {knowledge: true}),
        Library: new Action("Library", "city", "library", "", {knowledge: true}),
        Wardenclyffe: new Action("Wardenclyffe", "city", "wardenclyffe", "", {knowledge: true}),
        BioLab: new Action("Bioscience Lab", "city", "biolab", "", {knowledge: true}),
        CoalPower: new Action("Coal Powerplant", "city", "coal_power", ""),
        OilPower: new Action("Oil Powerplant", "city", "oil_power", ""),
        FissionPower: new Action("Fission Reactor", "city", "fission_power", ""),
        MassDriver: new Action("Mass Driver", "city", "mass_driver", "", {knowledge: () => haveTech("mass", 2)}),

        SpaceTestLaunch: new Action("Space Test Launch", "space", "test_launch", "spc_home"),
        SpaceSatellite: new Action("Space Satellite", "space", "satellite", "spc_home", {knowledge: true}),
        SpaceGps: new Action("Space Gps", "space", "gps", "spc_home"),
        SpacePropellantDepot: new Action("Space Propellant Depot", "space", "propellant_depot", "spc_home"),
        SpaceNavBeacon: new Action("Space Navigation Beacon", "space", "nav_beacon", "spc_home"),

        MoonMission: new Action("Moon Mission", "space", "moon_mission", "spc_moon"),
        MoonBase: new Action("Moon Base", "space", "moon_base", "spc_moon"),
        MoonIridiumMine: new Action("Moon Iridium Mine", "space", "iridium_mine", "spc_moon"),
        MoonHeliumMine: new Action("Moon Helium-3 Mine", "space", "helium_mine", "spc_moon"),
        MoonObservatory: new Action("Moon Observatory", "space", "observatory", "spc_moon", {knowledge: true}),

        RedMission: new Action("Red Mission", "space", "red_mission", "spc_red"),
        RedSpaceport: new Action("Red Spaceport", "space", "spaceport", "spc_red"),
        RedTower: new Action("Red Space Control", "space", "red_tower", "spc_red"),
        RedAssembly: new Assembly("Red Assembly (Cataclysm)", "space", "assembly", "spc_red", {housing: true}),
        RedLivingQuarters: new Action("Red Living Quarters", "space", "living_quarters", "spc_red", {housing: true}),
        RedPylon: new Action("Red Pylon (Cataclysm)", "space", "pylon", "spc_red"),
        RedVrCenter: new Action("Red VR Center", "space", "vr_center", "spc_red"),
        RedGarage: new Action("Red Garage", "space", "garage", "spc_red"),
        RedMine: new Action("Red Mine", "space", "red_mine", "spc_red"),
        RedFabrication: new Action("Red Fabrication", "space", "fabrication", "spc_red"),
        RedFactory: new Action("Red Factory", "space", "red_factory", "spc_red"),
        RedNaniteFactory: new Action("Red Nanite Factory (Cataclysm)", "space", "nanite_factory", "spc_red"),
        RedBiodome: new Action("Red Biodome", "space", "biodome", "spc_red"),
        RedExoticLab: new Action("Red Exotic Materials Lab", "space", "exotic_lab", "spc_red", {knowledge: true}),
        RedZiggurat: new Action("Red Ziggurat", "space", "ziggurat", "spc_red"),
        RedSpaceBarracks: new Action("Red Marine Barracks", "space", "space_barracks", "spc_red", {garrison: true}),
        RedForgeHorseshoe: new ForgeHorseshoe("Red Horseshoe (Cataclysm)", "space", "horseshoe", "spc_red", {housing: true, garrison: true}),

        HellMission: new Action("Hell Mission", "space", "hell_mission", "spc_hell"),
        HellGeothermal: new Action("Hell Geothermal Plant", "space", "geothermal", "spc_hell"),
        HellSmelter: new Action("Hell Smelter", "space", "hell_smelter", "spc_hell"),
        HellSpaceCasino: new Action("Hell Space Casino", "space", "spc_casino", "spc_hell"),
        HellSwarmPlant: new Action("Hell Swarm Plant", "space", "swarm_plant", "spc_hell"),

        SunMission: new Action("Sun Mission", "space", "sun_mission", "spc_sun"),
        SunSwarmControl: new Action("Sun Control Station", "space", "swarm_control", "spc_sun"),
        SunSwarmSatellite: new Action("Sun Swarm Satellite", "space", "swarm_satellite", "spc_sun"),

        GasMission: new Action("Gas Mission", "space", "gas_mission", "spc_gas"),
        GasMining: new Action("Gas Helium-3 Collector", "space", "gas_mining", "spc_gas", {smart: true}),
        GasStorage: new Action("Gas Fuel Depot", "space", "gas_storage", "spc_gas"),
        GasSpaceDock: new SpaceDock("Gas Space Dock", "space", "star_dock", "spc_gas"),
        GasSpaceDockProbe: new ModalAction("Space Dock Probe", "starDock", "probes", ""),
        GasSpaceDockShipSegment: new ModalAction("Space Dock Bioseeder Ship", "starDock", "seeder", ""),
        GasSpaceDockPrepForLaunch: new ModalAction("Space Dock Prep Ship", "starDock", "prep_ship", ""),
        GasSpaceDockLaunch: new ModalAction("Space Dock Launch Ship", "starDock", "launch_ship", ""),

        GasMoonMission: new Action("Gas Moon Mission", "space", "gas_moon_mission", "spc_gas_moon"),
        GasMoonOutpost: new Action("Gas Moon Mining Outpost", "space", "outpost", "spc_gas_moon"),
        GasMoonDrone: new Action("Gas Moon Mining Drone", "space", "drone", "spc_gas_moon"),
        GasMoonOilExtractor: new Action("Gas Moon Oil Extractor", "space", "oil_extractor", "spc_gas_moon", {smart: true}),

        BeltMission: new Action("Belt Mission", "space", "belt_mission", "spc_belt"),
        BeltSpaceStation: new Action("Belt Space Station", "space", "space_station", "spc_belt", {smart: true}),
        BeltEleriumShip: new Action("Belt Elerium Mining Ship", "space", "elerium_ship", "spc_belt", {smart: true}),
        BeltIridiumShip: new Action("Belt Iridium Mining Ship", "space", "iridium_ship", "spc_belt", {smart: true}),
        BeltIronShip: new Action("Belt Iron Mining Ship", "space", "iron_ship", "spc_belt", {smart: true}),

        DwarfMission: new Action("Dwarf Mission", "space", "dwarf_mission", "spc_dwarf"),
        DwarfEleriumContainer: new Action("Dwarf Elerium Storage", "space", "elerium_contain", "spc_dwarf"),
        DwarfEleriumReactor: new Action("Dwarf Elerium Reactor", "space", "e_reactor", "spc_dwarf"),
        DwarfWorldCollider: new Action("Dwarf World Collider", "space", "world_collider", "spc_dwarf"),
        DwarfWorldController: new Action("Dwarf World Collider (Complete)", "space", "world_controller", "spc_dwarf", {knowledge: true}),
        DwarfShipyard: new Action("Dwarf Ship Yard", "space", "shipyard", "spc_dwarf"),
        DwarfMassRelay: new Action("Dwarf Mass Relay", "space", "mass_relay", "spc_dwarf"),
        DwarfMassRelayComplete: new Action("Dwarf Mass Relay (Complete)", "space", "m_relay", "spc_dwarf"),

        TitanMission: new Action("Titan Mission", "space", "titan_mission", "spc_titan"),
        TitanSpaceport: new Action("Titan Spaceport", "space", "titan_spaceport", "spc_titan"),
        TitanElectrolysis: new Action("Titan Electrolysis", "space", "electrolysis", "spc_titan"),
        TitanHydrogen: new Action("Titan Hydrogen Plant", "space", "hydrogen_plant", "spc_titan"),
        TitanQuarters: new Action("Titan Habitat", "space", "titan_quarters", "spc_titan"),
        TitanMine: new Action("Titan Mine", "space", "titan_mine", "spc_titan"),
        TitanStorehouse: new Action("Titan Storehouse", "space", "storehouse", "spc_titan"),
        TitanBank: new Action("Titan Bank", "space", "titan_bank", "spc_titan"),
        TitanGraphene: new Action("Titan Graphene Plant", "space", "g_factory", "spc_titan"),
        TitanSAM: new Action("Titan SAM Site", "space", "sam", "spc_titan"),
        TitanDecoder: new Action("Titan Decoder", "space", "decoder", "spc_titan"),
        TitanAI: new Action("Titan AI Core", "space", "ai_core", "spc_titan"),
        TitanAIComplete: new Action("Titan AI Core (Complete)", "space", "ai_core2", "spc_titan"),
        TitanAIColonist: new Action("Titan AI Colonist", "space", "ai_colonist", "spc_titan"),
        EnceladusMission: new Action("Enceladus Mission", "space", "enceladus_mission", "spc_enceladus"),
        EnceladusWaterFreighter: new Action("Enceladus Water Freighter", "space", "water_freighter", "spc_enceladus", {smart: true}),
        EnceladusZeroGLab: new Action("Enceladus Zero Gravity Lab", "space", "zero_g_lab", "spc_enceladus"),
        EnceladusBase: new Action("Enceladus Operational Base", "space", "operating_base", "spc_enceladus"),
        EnceladusMunitions: new Action("Enceladus Munitions Depot", "space", "munitions_depot", "spc_enceladus"),
        TritonMission: new Action("Triton Mission", "space", "triton_mission", "spc_triton"),
        TritonFOB: new Action("Triton Forward Base", "space", "fob", "spc_triton"),
        TritonLander: new Action("Triton Troop Lander", "space", "lander", "spc_triton", {smart: true}),
        TritonCrashedShip: new Action("Triton Derelict Ship", "space", "crashed_ship", "spc_triton"),
        KuiperMission: new Action("Kuiper Mission", "space", "kuiper_mission", "spc_kuiper"),
        KuiperOrichalcum: new Action("Kuiper Orichalcum Mine", "space", "orichalcum_mine", "spc_kuiper", {smart: true}),
        KuiperUranium: new Action("Kuiper Uranium Mine", "space", "uranium_mine", "spc_kuiper", {smart: true}),
        KuiperNeutronium: new Action("Kuiper Neutronium Mine", "space", "neutronium_mine", "spc_kuiper", {smart: true}),
        KuiperElerium: new Action("Kuiper Elerium Mine", "space", "elerium_mine", "spc_kuiper", {smart: true}),
        ErisMission: new Action("Eris Mission", "space", "eris_mission", "spc_eris"),
        ErisDrone: new Action("Eris Control Relay", "space", "drone_control", "spc_eris"),
        ErisTrooper: new Action("Eris Android Trooper", "space", "shock_trooper", "spc_eris"),
        ErisTank: new Action("Eris Tank", "space", "tank", "spc_eris"),
        ErisDigsite: new Action("Eris Digsite", "space", "digsite", "spc_eris"),

        AlphaMission: new Action("Alpha Centauri Mission", "interstellar", "alpha_mission", "int_alpha"),
        AlphaStarport: new Action("Alpha Starport", "interstellar", "starport", "int_alpha"),
        AlphaHabitat: new Action("Alpha Habitat", "interstellar", "habitat", "int_alpha", {housing: true}),
        AlphaMiningDroid: new Action("Alpha Mining Droid", "interstellar", "mining_droid", "int_alpha"),
        AlphaProcessing: new Action("Alpha Processing Facility", "interstellar", "processing", "int_alpha"),
        AlphaFusion: new Action("Alpha Fusion Reactor", "interstellar", "fusion", "int_alpha"),
        AlphaLaboratory: new Action("Alpha Laboratory", "interstellar", "laboratory", "int_alpha", {knowledge: true}),
        AlphaExchange: new Action("Alpha Exchange", "interstellar", "exchange", "int_alpha"),
        AlphaGraphenePlant: new Action("Alpha Graphene Plant", "interstellar", "g_factory", "int_alpha"),
        AlphaWarehouse: new Action("Alpha Warehouse", "interstellar", "warehouse", "int_alpha"),
        AlphaMegaFactory: new Action("Alpha Mega Factory", "interstellar", "int_factory", "int_alpha"),
        AlphaLuxuryCondo: new Action("Alpha Luxury Condo", "interstellar", "luxury_condo", "int_alpha", {housing: true}),
        AlphaExoticZoo: new Action("Alpha Exotic Zoo", "interstellar", "zoo", "int_alpha"),

        ProximaMission: new Action("Proxima Mission", "interstellar", "proxima_mission", "int_proxima"),
        ProximaTransferStation: new Action("Proxima Transfer Station", "interstellar", "xfer_station", "int_proxima"),
        ProximaCargoYard: new Action("Proxima Cargo Yard", "interstellar", "cargo_yard", "int_proxima"),
        ProximaCruiser: new Action("Proxima Patrol Cruiser", "interstellar", "cruiser", "int_proxima", {garrison: true}),
        ProximaDyson: new Action("Proxima Dyson Sphere (Adamantite)", "interstellar", "dyson", "int_proxima"),
        ProximaDysonSphere: new Action("Proxima Dyson Sphere (Bolognium)", "interstellar", "dyson_sphere", "int_proxima"),
        ProximaOrichalcumSphere: new Action("Proxima Dyson Sphere (Orichalcum)", "interstellar", "orichalcum_sphere", "int_proxima"),

        NebulaMission: new Action("Nebula Mission", "interstellar", "nebula_mission", "int_nebula"),
        NebulaNexus: new Action("Nebula Nexus", "interstellar", "nexus", "int_nebula"),
        NebulaHarvester: new Action("Nebula Harvester", "interstellar", "harvester", "int_nebula", {smart: true}),
        NebulaEleriumProspector: new Action("Nebula Elerium Prospector", "interstellar", "elerium_prospector", "int_nebula"),

        NeutronMission: new Action("Neutron Mission", "interstellar", "neutron_mission", "int_neutron"),
        NeutronMiner: new Action("Neutron Miner", "interstellar", "neutron_miner", "int_neutron"),
        NeutronCitadel: new Action("Neutron Citadel Station", "interstellar", "citadel", "int_neutron"),
        NeutronStellarForge: new Action("Neutron Stellar Forge", "interstellar", "stellar_forge", "int_neutron"),

        Blackhole: new Action("Blackhole Mission", "interstellar", "blackhole_mission", "int_blackhole"),
        BlackholeFarReach: new Action("Blackhole Farpoint", "interstellar", "far_reach", "int_blackhole", {knowledge: true}),
        BlackholeStellarEngine: new Action("Blackhole Stellar Engine", "interstellar", "stellar_engine", "int_blackhole"),
        BlackholeMassEjector: new Action("Blackhole Mass Ejector", "interstellar", "mass_ejector", "int_blackhole"),

        BlackholeJumpShip: new Action("Blackhole Jump Ship", "interstellar", "jump_ship", "int_blackhole"),
        BlackholeWormholeMission: new Action("Blackhole Wormhole Mission", "interstellar", "wormhole_mission", "int_blackhole"),
        BlackholeStargate: new Action("Blackhole Stargate", "interstellar", "stargate", "int_blackhole"),
        BlackholeStargateComplete: new Action("Blackhole Stargate (Complete)", "interstellar", "s_gate", "int_blackhole"),

        SiriusMission: new Action("Sirius Mission", "interstellar", "sirius_mission", "int_sirius"),
        SiriusAnalysis: new Action("Sirius B Analysis", "interstellar", "sirius_b", "int_sirius"),
        SiriusSpaceElevator: new Action("Sirius Space Elevator", "interstellar", "space_elevator", "int_sirius"),
        SiriusGravityDome: new Action("Sirius Gravity Dome", "interstellar", "gravity_dome", "int_sirius"),
        SiriusAscensionMachine: new Action("Sirius Ascension Machine", "interstellar", "ascension_machine", "int_sirius"),
        SiriusAscensionTrigger: new Action("Sirius Ascension Machine (Complete)", "interstellar", "ascension_trigger", "int_sirius", {smart: true}),
        SiriusAscend: new Action("Sirius Ascend", "interstellar", "ascend", "int_sirius"),
        SiriusThermalCollector: new Action("Sirius Thermal Collector", "interstellar", "thermal_collector", "int_sirius"),

        GatewayMission: new Action("Gateway Mission", "galaxy", "gateway_mission", "gxy_gateway"),
        GatewayStarbase: new Action("Gateway Starbase", "galaxy", "starbase", "gxy_gateway", {garrison: true}),
        GatewayShipDock: new Action("Gateway Ship Dock", "galaxy", "ship_dock", "gxy_gateway"),

        BologniumShip: new Action("Gateway Bolognium Ship", "galaxy", "bolognium_ship", "gxy_gateway", {ship: true, smart: true}),
        ScoutShip: new Action("Gateway Scout Ship", "galaxy", "scout_ship", "gxy_gateway", {ship: true, smart: true}),
        CorvetteShip: new Action("Gateway Corvette Ship", "galaxy", "corvette_ship", "gxy_gateway", {ship: true, smart: true}),
        FrigateShip: new Action("Gateway Frigate Ship", "galaxy", "frigate_ship", "gxy_gateway", {ship: true}),
        CruiserShip: new Action("Gateway Cruiser Ship", "galaxy", "cruiser_ship", "gxy_gateway", {ship: true}),
        Dreadnought: new Action("Gateway Dreadnought", "galaxy", "dreadnought", "gxy_gateway", {ship: true}),

        StargateStation: new Action("Stargate Station", "galaxy", "gateway_station", "gxy_stargate"),
        StargateTelemetryBeacon: new Action("Stargate Telemetry Beacon", "galaxy", "telemetry_beacon", "gxy_stargate", {knowledge: true}),
        StargateDepot: new Action("Stargate Depot", "galaxy", "gateway_depot", "gxy_stargate"),
        StargateDefensePlatform: new Action("Stargate Defense Platform", "galaxy", "defense_platform", "gxy_stargate"),

        GorddonMission: new Action("Gorddon Mission", "galaxy", "gorddon_mission", "gxy_gorddon"),
        GorddonEmbassy: new Action("Gorddon Embassy", "galaxy", "embassy", "gxy_gorddon", {housing: true}),
        GorddonDormitory: new Action("Gorddon Dormitory", "galaxy", "dormitory", "gxy_gorddon", {housing: true}),
        GorddonSymposium: new Action("Gorddon Symposium", "galaxy", "symposium", "gxy_gorddon", {knowledge: true}),
        GorddonFreighter: new Action("Gorddon Freighter", "galaxy", "freighter", "gxy_gorddon", {ship: true}),

        Alien1Consulate: new Action("Alien 1 Consulate", "galaxy", "consulate", "gxy_alien1", {housing: true}),
        Alien1Resort: new Action("Alien 1 Resort", "galaxy", "resort", "gxy_alien1"),
        Alien1VitreloyPlant: new Action("Alien 1 Vitreloy Plant", "galaxy", "vitreloy_plant", "gxy_alien1", {smart: true}),
        Alien1SuperFreighter: new Action("Alien 1 Super Freighter", "galaxy", "super_freighter", "gxy_alien1", {ship: true}),

        Alien2Mission: new Action("Alien 2 Mission", "galaxy", "alien2_mission", "gxy_alien2"),
        Alien2Foothold: new Action("Alien 2 Foothold", "galaxy", "foothold", "gxy_alien2"),
        Alien2ArmedMiner: new Action("Alien 2 Armed Miner", "galaxy", "armed_miner", "gxy_alien2", {ship: true, smart: true}),
        Alien2OreProcessor: new Action("Alien 2 Ore Processor", "galaxy", "ore_processor", "gxy_alien2"),
        Alien2Scavenger: new Action("Alien 2 Scavenger", "galaxy", "scavenger", "gxy_alien2", {knowledge: true, ship: true}),

        ChthonianMission: new Action("Chthonian Mission", "galaxy", "chthonian_mission", "gxy_chthonian"),
        ChthonianMineLayer: new Action("Chthonian Mine Layer", "galaxy", "minelayer", "gxy_chthonian", {ship: true, smart: true}),
        ChthonianExcavator: new Action("Chthonian Excavator", "galaxy", "excavator", "gxy_chthonian", {smart: true}),
        ChthonianRaider: new Action("Chthonian Raider", "galaxy", "raider", "gxy_chthonian", {ship: true, smart: true}),

        PortalTurret: new Action("Portal Laser Turret", "portal", "turret", "prtl_fortress"),
        PortalCarport: new Action("Portal Surveyor Carport", "portal", "carport", "prtl_fortress"),
        PortalWarDroid: new Action("Portal War Droid", "portal", "war_droid", "prtl_fortress"),
        PortalRepairDroid: new Action("Portal Repair Droid", "portal", "repair_droid", "prtl_fortress"),

        BadlandsPredatorDrone: new Action("Badlands Predator Drone", "portal", "war_drone", "prtl_badlands"),
        BadlandsSensorDrone: new Action("Badlands Sensor Drone", "portal", "sensor_drone", "prtl_badlands"),
        BadlandsAttractor: new Action("Badlands Attractor Beacon", "portal", "attractor", "prtl_badlands", {smart: true}),

        PitMission: new Action("Pit Mission", "portal", "pit_mission", "prtl_pit"),
        PitAssaultForge: new Action("Pit Assault Forge", "portal", "assault_forge", "prtl_pit"),
        PitSoulForge: new Action("Pit Soul Forge", "portal", "soul_forge", "prtl_pit"),
        PitGunEmplacement: new Action("Pit Gun Emplacement", "portal", "gun_emplacement", "prtl_pit"),
        PitSoulAttractor: new Action("Pit Soul Attractor", "portal", "soul_attractor", "prtl_pit"),

        RuinsMission: new Action("Ruins Mission", "portal", "ruins_mission", "prtl_ruins"),
        RuinsGuardPost: new Action("Ruins Guard Post", "portal", "guard_post", "prtl_ruins", {smart: true}),
        RuinsVault: new Action("Ruins Vault", "portal", "vault", "prtl_ruins"),
        RuinsArchaeology: new Action("Ruins Archaeology", "portal", "archaeology", "prtl_ruins"),
        RuinsArcology: new Action("Ruins Arcology", "portal", "arcology", "prtl_ruins"),
        RuinsHellForge: new Action("Ruins Infernal Forge", "portal", "hell_forge", "prtl_ruins"),
        RuinsInfernoPower: new Action("Ruins Inferno Reactor", "portal", "inferno_power", "prtl_ruins"),
        RuinsAncientPillars: new Action("Ruins Ancient Pillars", "portal", "ancient_pillars", "prtl_ruins"),

        GateMission: new Action("Gate Mission", "portal", "gate_mission", "prtl_gate"),
        GateEastTower: new Action("Gate East Tower", "portal", "east_tower", "prtl_gate"),
        GateWestTower: new Action("Gate West Tower", "portal", "west_tower", "prtl_gate"),
        GateTurret: new Action("Gate Turret", "portal", "gate_turret", "prtl_gate"),
        GateInferniteMine: new Action("Gate Infernite Mine", "portal", "infernite_mine", "prtl_gate"),

        LakeMission: new Action("Lake Mission", "portal", "lake_mission", "prtl_lake"),
        LakeHarbour: new Action("Lake Harbour", "portal", "harbour", "prtl_lake", {smart: true}),
        LakeCoolingTower: new Action("Lake Cooling Tower", "portal", "cooling_tower", "prtl_lake", {smart: true}),
        LakeBireme: new Action("Lake Bireme Warship", "portal", "bireme", "prtl_lake", {smart: true}),
        LakeTransport: new Action("Lake Transport", "portal", "transport", "prtl_lake", {smart: true}),

        SpireMission: new Action("Spire Mission", "portal", "spire_mission", "prtl_spire"),
        SpirePurifier: new Action("Spire Purifier", "portal", "purifier", "prtl_spire", {smart: true}),
        SpirePort: new Action("Spire Port", "portal", "port", "prtl_spire", {smart: true}),
        SpireBaseCamp: new Action("Spire Base Camp", "portal", "base_camp", "prtl_spire", {smart: true}),
        SpireBridge: new Action("Spire Bridge", "portal", "bridge", "prtl_spire"),
        SpireSphinx: new Action("Spire Sphinx", "portal", "sphinx", "prtl_spire"),
        SpireBribeSphinx: new Action("Spire Bribe Sphinx", "portal", "bribe_sphinx", "prtl_spire"),
        SpireSurveyTower: new Action("Spire Survey Tower", "portal", "spire_survey", "prtl_spire"),
        SpireMechBay: new Action("Spire Mech Bay", "portal", "mechbay", "prtl_spire", {smart: true}),
        SpireTower: new Action("Spire Tower", "portal", "spire", "prtl_spire"),
        SpireWaygate: new Action("Spire Waygate", "portal", "waygate", "prtl_spire", {smart: true}),
    }

    var linkedBuildings = [
        [buildings.LakeTransport, buildings.LakeBireme],
        [buildings.SpirePort, buildings.SpireBaseCamp],
    ]

    var projects = {
        LaunchFacility: new Project("Launch Facility", "launch_facility"),
        SuperCollider: new Project("Supercollider", "lhc"),
        StockExchange: new Project("Stock Exchange", "stock_exchange"),
        Monument: new Project("Monument", "monument"),
        Railway: new Project("Railway", "railway"),
        Nexus: new Project("Nexus", "nexus"),
        RoidEject: new Project("Asteroid Redirect", "roid_eject"),
        ManaSyphon: new Project("Mana Syphon", "syphon"),
        Depot: new Project("Depot", "tp_depot"),
    }

    const wrGlobalCondition = 0; // Generic condition will be checked once per tick. Takes nothing and return bool - whether following rule is applicable, or not
    const wrIndividualCondition = 1; // Individual condition, checks every building, and return any value; if value casts to true - rule aplies
    const wrDescription = 2; // Description displayed in tooltip when rule applied, takes return value of individual condition, and building
    const wrMultiplier = 3; // Weighting mulptiplier. Called first without any context; rules returning x1 also won't be checked
    var weightingRules = [[
          () => !settings.autoBuild,
          () => true,
          () => "",
          () => 0 // Set weighting to zero right away, and skip all checks if autoBuild is disabled
      ],[
          () => !game.global.settings.showCity,
          (building) => building._tab === "city",
          () => "未解锁",
          () => 0
      ],[
          () => !game.global.settings.showSpace && !game.global.settings.showOuter,
          (building) => building._tab === "space",
          () => "未解锁",
          () => 0
      ],[
          () => !game.global.settings.showDeep,
          (building) => building._tab === "interstellar",
          () => "未解锁",
          () => 0
      ],[
          () => !game.global.settings.showPortal,
          (building) => building._tab === "portal",
          () => "未解锁",
          () => 0
      ],[
          () => !game.global.settings.showGalactic,
          (building) => building._tab === "galaxy",
          () => "未解锁",
          () => 0
      ],[
          () => true,
          (building) => !building.isUnlocked(),
          () => "未解锁",
          () => 0 // Should always be on top, processing locked building may lead to issues
      ],[
          () => true,
          (building) => state.queuedTargets.includes(building),
          () => "处理建筑队列……",
          () => 0
      ],[
          () => true,
          (building) => state.triggerTargets.includes(building),
          () => "处理触发器……",
          () => 0
      ],[
          () => true,
          (building) => !building.autoBuildEnabled,
          () => "自动建筑已关闭",
          () => 0
      ],[
          () => true,
          (building) => building.count >= building.autoMax,
          () => "已达建造上限",
          () => 0
      ],[
          () => true,
          (building) => !building.isAffordable(true),
          () => "",
          () => 0 // Red buildings need to be filtered out, so they won't prevent affordable buildings with lower weight from building
      ],[
          () => game.global.race['truepath'] && buildings.SpaceTestLaunch.isUnlocked() && !haveTech('world_control'),
          (building) => {
              if (building === buildings.SpaceTestLaunch) {
                  let sabotage = 1;
                  for (let i = 0; i < 3; i++){
                      let gov = game.global.civic.foreign[`gov${i}`];
                      if (!gov.occ && !gov.anx && !gov.buy) {
                          sabotage++;
                      }
                  }
                  return 1 / (sabotage + 1);
              }
          },
          (chance) => `发射成功率为 ${Math.round(chance*100)}%`,
          (chance) => chance < 0.5 ? chance : 0
      ],[
          () => settings.jobDisableMiners && buildings.GatewayStarbase.count > 0,
          (building) => building === buildings.Mine || building === buildings.CoalMine,
          () => "到达仙女座星云后禁用矿工",
          () => 0
      ],[
          () => game.global.tech.piracy,
          (building) => building === buildings.StargateDefensePlatform && buildings.StargateDefensePlatform.count * 20 >= (game.global.race['instinct'] ? 0.09 : 0.1) * game.global.tech.piracy,
          () => "海盗活动已肃清",
          () => 0
      ],[
          () => settings.autoMech && settings.mechBuild !== "none" && settings.buildingMechsFirst && buildings.SpireMechBay.count > 0 && buildings.SpireMechBay.stateOffCount === 0,
          (building) => {
              if (building.cost["Supply"]) {
                  if (MechManager.isActive) {
                      return "正在建造机甲……";
                  }
                  let mechBay = game.global.portal.mechbay;
                  let newSize = !haveTask("mech") ? settings.mechBuild === "random" ? MechManager.getPreferredSize()[0] : mechBay.blueprint.size : "titan";
                  let [newGems, newSupply, newSpace] = MechManager.getMechCost({size: newSize});
                  if (newSpace <= mechBay.max - mechBay.bay && newSupply <= resources.Supply.maxQuantity && newGems <= resources.Soul_Gem.currentQuantity) {
                      return "为下一层建造机甲而保留补给";
                  }
              }
          },
          (note) => note,
          () => 0
      ],[
          () => buildings.GateEastTower.isUnlocked() && buildings.GateWestTower.isUnlocked() && poly.hellSupression("gate").supress < settings.buildingTowerSuppression / 100,
          (building) => building === buildings.GateEastTower || building === buildings.GateWestTower,
          () => "安全指数不足",
          () => 0
      ],[
          () => settings.prestigeType === "whitehole" && settings.prestigeWhiteholeSaveGems,
          (building) => {
              if (building.cost["Soul_Gem"] > resources.Soul_Gem.currentQuantity - 10) {
                  return true;
              }
          },
          () => "为重置而保留灵魂宝石",
          () => 0
      ],[
          () => {
              return buildings.LakeBireme.isAutoBuildable() && buildings.LakeBireme.isAffordable(true) &&
                     buildings.LakeTransport.isAutoBuildable() && buildings.LakeTransport.isAffordable(true) &&
                     resources.Lake_Support.rateOfChange <= 1; // Build any if there's spare support
          },
          (building) => {
              if (building === buildings.LakeBireme || building === buildings.LakeTransport) {
                  let biremeCount = buildings.LakeBireme.count;
                  let transportCount = buildings.LakeTransport.count;
                  let rating = game.global.blood['spire'] && game.global.blood.spire >= 2 ? 0.8 : 0.85;
                  let nextBireme = (1 - (rating ** (biremeCount + 1))) * (transportCount * 5);
                  let nextTransport = (1 - (rating ** biremeCount)) * ((transportCount + 1) * 5);
                  if (building === buildings.LakeBireme && nextBireme < nextTransport) {
                      return buildings.LakeTransport;
                  }
                  if (building === buildings.LakeTransport && nextTransport < nextBireme) {
                      return buildings.LakeBireme;
                  }
              }
          },
          (other) => `${other.title}可以提供更多补给`,
          () => 0 // Find what's better - Bireme or Transport
      ],[
          () => {
              return buildings.SpirePort.isAutoBuildable() && buildings.SpirePort.isAffordable(true) &&
                     buildings.SpireBaseCamp.isAutoBuildable() && buildings.SpireBaseCamp.isAffordable(true);
          },
          (building) => {
              if (building === buildings.SpirePort || building === buildings.SpireBaseCamp) {
                  let portCount = buildings.SpirePort.count;
                  let baseCount = buildings.SpireBaseCamp.count;
                  let nextPort = (portCount + 1) * (1 + baseCount * 0.4);
                  let nextBase = portCount * (1 + (baseCount + 1) * 0.4);
                  if (building === buildings.SpirePort && nextPort < nextBase) {
                      return buildings.SpireBaseCamp;
                  }
                  if (building === buildings.SpireBaseCamp && nextBase < nextPort) {
                      return buildings.SpirePort;
                  }
              }
          },
          (other) => `${other.title}可以提供更多补给上限`,
          () => 0 // Find what's better - Port or Base
      ],[
          () => buildings.SpireWaygate.isUnlocked() && haveTech("waygate", 2),
          (building) => building === buildings.SpireWaygate,
          () => "",
          () => 0 // We can't limit waygate using gameMax, as max here doesn't constant. It's start with 10, but after building count reduces down to 1
      ],[
          () => buildings.SpireSphinx.isUnlocked() && haveTech("hell_spire", 8),
          (building) => building === buildings.SpireSphinx,
          () => "",
          () => 0 // Sphinx not usable after solving
      ],[
          () => buildings.RuinsAncientPillars.isUnlocked() && (game.global.tech.pillars !== 1 || game.global.race.universe === 'micro'),
          (building) => building === buildings.RuinsAncientPillars,
          () => "",
          () => 0 // Pillars can't be activated in micro, and without tech.
      ],[
          () => game.global.race['artifical'],
          (building) => building instanceof Assembly && resources.Population.storageRatio === 1,
          () => "",
          () => 0 // No empty housings
      ],[
          () => buildings.GorddonEmbassy.count === 0 && resources.Knowledge.maxQuantity < settings.fleetEmbassyKnowledge,
          (building) => building === buildings.GorddonEmbassy,
          () => `知识上限需要到达 ${getNumberString(settings.fleetEmbassyKnowledge)}`,
          () => 0
      ],[
          () => game.global.race['magnificent'] && settings.buildingShrineType !== "any",
          (building) => {
              if (building === buildings.Shrine) {
                  let bonus = null;
                  if (game.global.city.calendar.moon > 0 && game.global.city.calendar.moon < 7){
                      bonus = "morale";
                  } else if (game.global.city.calendar.moon > 7 && game.global.city.calendar.moon < 14){
                      bonus = "metal";
                  } else if (game.global.city.calendar.moon > 14 && game.global.city.calendar.moon < 21){
                      bonus = "know";
                  } else if (game.global.city.calendar.moon > 21){
                      bonus = "tax";
                  } else {
                      return true;
                  }
                  if (settings.buildingShrineType === "equally") {
                      let minShrine = Math.min(game.global.city.shrine.morale, game.global.city.shrine.metal, game.global.city.shrine.know, game.global.city.shrine.tax);
                      return game.global.city.shrine[bonus] !== minShrine;
                  } else {
                      return settings.buildingShrineType !== bonus;
                  }
              }
          },
          () => "圣地月相不符",
          () => 0
      ],[
          () => game.global.race['slaver'],
          (building) => {
              if (building === buildings.SlaveMarket) {
                  if (resources.Slave.currentQuantity >= resources.Slave.maxQuantity) {
                      return "奴隶围栏已满";
                  }
                  if (resources.Money.currentQuantity + resources.Money.rateOfChange < resources.Money.maxQuantity && resources.Money.rateOfChange < 25000){
                      return "只使用多余的资金购买奴隶";
                  }
              }
          },
          (note) => note,
          () => 0 // Slave Market
      ],[
          () => game.global.race['cannibalize'],
          (building) => {
              if (building === buildings.SacrificialAltar && building.count > 0) {
                  if (resources.Population.currentQuantity < 1) {
                      return "市民太少";
                  }
                  if (resources.Population.currentQuantity !== resources.Population.maxQuantity) {
                    return "只在市民达到上限时献祭市民";
                }
                if (game.global.race['parasite'] && game.global.city.calendar.wind === 0) {
                    return "拥有寄生虫特质的种族只在有风时献祭";
                }
                if (game.global.civic[game.global.civic.d_job].workers < 1) {
                    return "默认工作没有可献祭的市民";
                }

                if (game.global.city.s_alter.rage >= 3600 && game.global.city.s_alter.regen >= 3600 &&
                    game.global.city.s_alter.mind >= 3600 && game.global.city.s_alter.mine >= 3600 &&
                    (!isLumberRace() || game.global.city.s_alter.harvest >= 3600)){
                    return "献祭加成已经足够高了";
                  }
              }
          },
          (note) => note,
          () => 0 // Sacrificial Altar
      ],[
          () => true,
          (building) => building.getMissingConsumption(),
          (resource) => `缺少${resource.title}，无法运作`,
          () => settings.buildingWeightingMissingSupply
      ],[
          () => true,
          (building) => building.getMissingSupport(),
          (support) => `缺少${support.name}，无法运作`,
          () => settings.buildingWeightingMissingSupport
      ],[
          () => true,
          (building) => building.getUselessSupport(),
          (support) => `暂时不需要提供${support.name}`,
          () => settings.buildingWeightingUselessSupport
      ],[
          () => true,
          (building) => building._tab === "city" && building !== buildings.Mill && building.stateOffCount > 0,
          () => "存在未供能的建筑",
          () => settings.buildingWeightingNonOperatingCity
      ],[
          () => true,
          (building) => {
              if (building._tab !== "city" && building.stateOffCount > 0) {
                  if (building === buildings.RuinsGuardPost && building.isSmartManaged() && !isHellSupressUseful()
                    && building.count < Math.ceil(5000 / (game.armyRating(1, "hellArmy", 0) * traitVal('holy', 1, '+')))) { return false; }
                  if (building === buildings.BadlandsAttractor && building.isSmartManaged()) { return false; }
                  if (building === buildings.SpireMechBay && building.isSmartManaged()) { return false; }
                  let supplyIndex = building === buildings.SpirePort ? 1 : building === buildings.SpireBaseCamp ? 2 : -1;
                  if ((supplyIndex > 0 && (buildings.SpireMechBay.isSmartManaged() || buildings.SpirePurifier.isSmartManaged()))
                    && (building.count < getBestSupplyRatio(resources.Spire_Support.maxQuantity, buildings.SpirePort.autoMax, buildings.SpireBaseCamp.autoMax)[supplyIndex])) { return false; }
                  return true;
              };
          },
          () => "存在未供能的建筑",
          () => settings.buildingWeightingNonOperating
      ],[
          () => settings.prestigeBioseedConstruct && settings.prestigeType !== "bioseed",
          (building) => building === buildings.GasSpaceDock || building === buildings.GasSpaceDockShipSegment || building === buildings.GasSpaceDockProbe,
          () => "当前重置类型不需要建造",
          () => 0
      ],[
          () => settings.prestigeBioseedConstruct && settings.prestigeType === "bioseed",
          (building) => building === buildings.DwarfWorldCollider || building === buildings.TitanMission,
          () => "播种重置不需要建造",
          () => 0
      ],[
          () => settings.prestigeBioseedConstruct && settings.prestigeType === "whitehole",
          (building) => building === buildings.BlackholeJumpShip,
          () => "黑洞重置不需要建造",
          () => 0
      ],[
          () => settings.prestigeBioseedConstruct && settings.prestigeType === "vacuum",
          (building) => building === buildings.BlackholeStellarEngine,
          () => "真空坍缩不需要建造",
          () => 0
      ],[
          () => settings.prestigeBioseedConstruct && settings.prestigeType === "ascension" && isPillarFinished(),
          (building) => building === buildings.PitMission || building === buildings.RuinsMission,
          () => "飞升重置不需要建造",
          () => 0
      ],[
          () => settings.prestigeType === "mad" && (haveTech("mad") || (techIds['tech-mad'].isUnlocked() && techIds['tech-mad'].isAffordable(true))),
          (building) => !building.is.housing && !building.is.garrison && !building.cost["Knowledge"] && (building !== buildings.OilWell || !game.global.race.terrifying), // Terrifying can't buy oil, keep building rigs
          () => "等待核爆重置",
          () => settings.buildingWeightingMADUseless
      ],[
          () => true,
          (building) => building !== buildings.ForgeHorseshoe && building !== buildings.RedForgeHorseshoe && building.count === 0,
          () => "新解锁建筑",
          () => settings.buildingWeightingNew
      ],[
          () => resources.Power.isUnlocked() && resources.Power.currentQuantity < resources.Power.maxQuantity,
          (building) => building === buildings.LakeCoolingTower || building.powered < 0,
          () => "需要更多电力",
          () => settings.buildingWeightingNeedfulPowerPlant
      ],[
          () => resources.Power.isUnlocked() && resources.Power.currentQuantity > resources.Power.maxQuantity,
          (building) => building !== buildings.Mill && (building === buildings.LakeCoolingTower || building.powered < 0),
          () => "无需更多电力",
          () => settings.buildingWeightingUselessPowerPlant
      ],[
          () => resources.Power.isUnlocked(),
          (building) => building !== buildings.LakeCoolingTower && building.powered > 0 && (building === buildings.NeutronCitadel ? getCitadelConsumption(building.count+1) - getCitadelConsumption(building.count) : building.powered) > resources.Power.currentQuantity,
          () => "电力不足",
          () => settings.buildingWeightingUnderpowered
      ],[
          () => state.knowledgeRequiredByTechs < resources.Knowledge.maxQuantity,
          (building) => building.is.knowledge && building !== buildings.Wardenclyffe, // We want Wardenclyffe for morale
          () => "无需更多知识上限",
          () => settings.buildingWeightingUselessKnowledge
      ],[
          () => state.knowledgeRequiredByTechs > resources.Knowledge.maxQuantity,
          (building) => building.is.knowledge,
          () => "需要更多知识上限",
          () => settings.buildingWeightingNeedfulKnowledge
      ],[
          () => buildings.BlackholeMassEjector.count > 0 && buildings.BlackholeMassEjector.count * 1000 - game.global.interstellar.mass_ejector.total > 100,
          (building) => building === buildings.BlackholeMassEjector,
          () => "存在未供能的喷射器",
          () => settings.buildingWeightingUnusedEjectors
      ],[
          () => resources.Crates.storageRatio < 1 || resources.Containers.storageRatio < 1,
          (building) => building === buildings.StorageYard || building === buildings.Warehouse || building === buildings.EnceladusMunitions,
          () => "存在未使用的箱子",
          () => settings.buildingWeightingCrateUseless
      ],[
          () => resources.Oil.maxQuantity < resources.Oil.requestedQuantity && buildings.OilWell.count <= 0 && buildings.GasMoonOilExtractor.count <= 0,
          (building) => building === buildings.OilWell || building === buildings.GasMoonOilExtractor,
          () => "需要更多燃料",
          () => settings.buildingWeightingMissingFuel
      ],[
          () => resources.Helium_3.maxQuantity < resources.Helium_3.requestedQuantity || resources.Oil.maxQuantity < resources.Oil.requestedQuantity,
          (building) => building === buildings.OilDepot || building === buildings.SpacePropellantDepot || building === buildings.GasStorage,
          () => "需要更多燃料",
          () => settings.buildingWeightingMissingFuel
      ],[
          () => game.global.race.hooved && resources.Horseshoe.spareQuantity >= resources.Horseshoe.storageRequired,
          (building) => building === buildings.ForgeHorseshoe || building === buildings.RedForgeHorseshoe,
          () => "无需更多马蹄铁",
          () => settings.buildingWeightingHorseshoeUseless
      ],[
          () => game.global.race.calm && resources.Zen.currentQuantity < resources.Zen.maxQuantity,
          (building) => building === buildings.MeditationChamber,
          () => "无需更多禅冥想空间",
          () => settings.buildingWeightingZenUseless
      ],[
          () => buildings.GateTurret.isUnlocked() && poly.hellSupression("gate").rating >= 7500,
          (building) => building === buildings.GateTurret,
          () => "恶魔活动已肃清",
          () => settings.buildingWeightingGateTurret
      ],[
          () => (resources.Containers.isUnlocked() || resources.Crates.isUnlocked()) && resources.Containers.storageRatio === 1 && resources.Crates.storageRatio === 1,
          (building) => building === buildings.Shed || building === buildings.RedGarage || building === buildings.AlphaWarehouse || building === buildings.ProximaCargoYard || building === buildings.TitanStorehouse,
          () => "需要构建更多箱子",
          () => settings.buildingWeightingNeedStorage
      ],[
          () => resources.Population.maxQuantity > 50 && resources.Population.storageRatio < 0.9,
          (building) => building.is.housing && building instanceof Assembly,
          () => "无需更多住房",
          () => settings.buildingWeightingUselessHousing
    ]];

    // Singleton manager objects
    var MinorTraitManager = {
        priorityList: [],
        _traitVueBinding: "geneticBreakdown",

        isUnlocked() {
            return haveTech("genetics", 3);
        },

        sortByPriority() {
            this.priorityList.sort((a, b) => a.priority - b.priority);
        },

        managedPriorityList() {
            return this.priorityList.filter(trait => trait.enabled && trait.isUnlocked());
        },

        buyTrait(traitName) {
            getVueById(this._traitVueBinding)?.gene(traitName);
        }
    }

    var QuarryManager = {
        _industryVueBinding: "iQuarry",
        _industryVue: undefined,

        initIndustry() {
            if (!game.global.race['smoldering'] || buildings.RockQuarry.count < 1) {
                return false;
            }

            this._industryVue = getVueById(this._industryVueBinding);
            if (this._industryVue === undefined) {
                return false;
            }

            return true;
        },

        currentAsbestos() {
            return game.global.city.rock_quarry.asbestos;
        },

        increaseAsbestos(count) {
            if (count === 0) {
                return false;
            }
            if (count < 0) {
                return this.decreaseAsbestos(count * -1);
            }

            resetMultiplier();
            for (let i = 0; i < count; i++) {
                this._industryVue.add();
            }
        },

        decreaseAsbestos(count) {
            if (count === 0) {
                return false;
            }
            if (count < 0) {
                return this.increaseAsbestos(count * -1);
            }

            resetMultiplier();
            for (let i = 0; i < count; i++) {
                this._industryVue.sub();
            }
        }
    }

    var NaniteManager = {
        _industryVueBinding: "iNFactory",
        _industryVue: undefined,
        storageShift: 1.005,
        priorityList: [],

        // export const nf_resources from industry.js
        Resources: [
            'Lumber', 'Chrysotile', 'Stone', 'Crystal', 'Furs', 'Copper', 'Iron', 'Aluminium',
            'Cement', 'Coal', 'Oil', 'Uranium', 'Steel', 'Titanium', 'Alloy', 'Polymer',
            'Iridium', 'Helium_3', 'Water', 'Deuterium', 'Neutronium', 'Adamantite', 'Bolognium', 'Orichalcum',
        ],

        resEnabled: (id) => settings['res_nanite' + id],

        isUnlocked() {
            return game.global.race['deconstructor'] && (buildings.NaniteFactory.count > 0 || buildings.RedNaniteFactory.count > 0);
        },

        isUseful() {
            return resources.Nanite.storageRatio < 1;
        },

        initIndustry() {
            if (!this.isUnlocked()) {
                return false;
            }

            this._industryVue = getVueById(this._industryVueBinding);
            if (this._industryVue === undefined) {
                return false;
            }

            return true;
        },

        isConsumable(res) {
            return this.Resources.includes(res.id);
        },

        updateResources() {
            if (!this.isUnlocked() || !settings.autoNanite) {
                return;
            }
            for (let resource of this.priorityList) {
                if (resource.isUnlocked()) {
                    resource.rateMods['nanite'] = this.currentConsume(resource.id);
                    resource.rateOfChange += resource.rateMods['nanite'];
                }
            }
        },

        managedPriorityList() {
            return this.priorityList;
        },

        maxConsume() {
            return game.global.city.nanite_factory.count * 50;
        },

        currentConsume(id) {
            return game.global.city.nanite_factory[id];
        },

        useRatio() {
            switch (settings.naniteMode) {
                case "cap":
                    return [0.965];
                case "excess":
                    return [-1];
                case "all":
                    return [0.035];
                case "mixed":
                    return [0.965, -1];
                case "full":
                    return [0.965, -1, 0.035];
                default:
                    return [];
            }
        },

        maxConsumeCraftable(resource) {
            return resource.currentQuantity - (resource.storageRequired * this.storageShift);
        },

        maxConsumeForRatio(resource, keepRatio) {
            let extraIncome = resource.rateOfChange;
            let extraStore = (resource.storageRatio - keepRatio) * resource.maxQuantity;
            return Math.max(extraIncome, extraStore);
        },

        consumeMore(id, count) {
            resources[id].rateMods['nanite'] += count;

            resetMultiplier();
            for (let i = 0; i < count; i++) {
                this._industryVue.addItem(id);
            }
        },

        consumeLess(id, count) {
            resources[id].rateMods['nanite'] -= count;

            resetMultiplier();
            for (let i = 0; i < count; i++) {
                this._industryVue.subItem(id);
            }
        }
    }

    var SupplyManager = {
        _supplyVuePrefix: "supply",
        storageShift: 1.010,
        priorityList: [],

        resEnabled: (id) => settings['res_supply' + id],

        isUnlocked() {
            return buildings.LakeTransport.isUnlocked();
        },

        isUseful() {
            return resources.Supply.storageRatio < 1 && buildings.LakeTransport.stateOnCount > 0 && buildings.LakeBireme.stateOnCount > 0;
        },

        initIndustry() {
            return this.isUnlocked();
        },

        isConsumable(res) {
            return poly.supplyValue.hasOwnProperty(res.id);
        },

        updateResources() {
            if (!this.isUnlocked() || !settings.autoSupply) {
                return;
            }
            for (let resource of this.priorityList) {
                if (resource.isUnlocked()) {
                    resource.rateMods['supply'] = this.currentConsume(resource.id) * this.supplyOut(resource.id);
                    resource.rateOfChange += resource.rateMods['supply'];
                }
            }
        },

        supplyIn(id) {
            return poly.supplyValue[id]?.in ?? 0;
        },

        supplyOut(id) {
            return poly.supplyValue[id]?.out ?? 0;
        },

        managedPriorityList() {
            return this.priorityList;
        },

        maxConsume() {
            return game.global.portal.transport.cargo.max;
        },

        currentConsume(id) {
            return game.global.portal.transport.cargo[id];
        },

        useRatio() {
            switch (settings.supplyMode) {
                case "cap":
                    return [0.975];
                case "excess":
                    return [-1];
                case "all":
                    return [0.045];
                case "mixed":
                    return [0.975, -1];
                case "full":
                    return [0.975, -1, 0.045];
                default:
                    return [];
            }
        },

        maxConsumeCraftable(resource) {
            return (resource.currentQuantity - (resource.storageRequired * this.storageShift)) / this.supplyOut(resource.id);
        },

        maxConsumeForRatio(resource, keepRatio) {
            let extraIncome = resource.calculateRateOfChange({buy: false, nanite: true}) / this.supplyOut(resource.id);
            let extraStore = (resource.storageRatio - keepRatio) * resource.maxQuantity / this.supplyOut(resource.id);
            return Math.max(extraIncome, extraStore);
        },

        consumeMore(id, count) {
            let vue = getVueById(this._supplyVuePrefix + id);
            if (vue === undefined) { return false; }

            resources[id].rateMods['supply'] += (count * this.supplyOut(id));

            resetMultiplier();
            for (let i = 0; i < count; i++) {
                vue.supplyMore(id);
            }
        },

        consumeLess(id, count) {
            let vue = getVueById(this._supplyVuePrefix + id);
            if (vue === undefined) { return false; }

            resources[id].rateMods['supply'] -= (count * this.supplyOut(id));

            resetMultiplier();
            for (let i = 0; i < count; i++) {
                vue.supplyLess(id);
            }
        }
    }

    var EjectManager = {
        _ejectVuePrefix: "eject",
        storageShift: 1.015,
        priorityList: [],

        resEnabled: (id) => settings['res_eject' + id],

        isUnlocked() {
            return buildings.BlackholeMassEjector.count > 0;
        },

        isUseful() {
            return true; // Never stop ejecting
        },

        initIndustry() {
            return this.isUnlocked() && !haveTask("trash");
        },

        isConsumable(res) {
            return game.atomic_mass.hasOwnProperty(res.id);
        },

        updateResources() {
            if (!this.isUnlocked() || (!settings.autoEject && !haveTask("trash"))) {
                return;
            }
            for (let resource of this.priorityList) {
                if (resource.isUnlocked()) {
                    resource.rateMods['eject'] = this.currentConsume(resource.id);
                    resource.rateOfChange += resource.rateMods['eject'];
                }
            }
        },

        managedPriorityList() {
            return !game.global.race['artifical'] ? this.priorityList
              : this.priorityList.filter(r => r !== resources.Food);
        },

        maxConsume() {
            return game.global.interstellar.mass_ejector.on * 1000;
        },

        currentConsume(id) {
            return game.global.interstellar.mass_ejector[id];
        },

        useRatio() {
            switch (settings.ejectMode) {
                case "cap":
                    return [0.985];
                case "excess":
                    return [-1];
                case "all":
                    return [0.055];
                case "mixed":
                    return [0.985, -1];
                case "full":
                    return [0.985, -1, 0.055];
                default:
                    return [];
            }
        },

        maxConsumeCraftable(resource) {
            return resource.currentQuantity - (resource.storageRequired * this.storageShift);
        },

        maxConsumeForRatio(resource, keepRatio) {
            let extraIncome = resource.calculateRateOfChange({buy: false, supply: true, nanite: true});
            let extraStore = (resource.storageRatio - keepRatio) * resource.maxQuantity;
            return Math.max(extraIncome, extraStore);
        },

        consumeMore(id, count) {
            let vue = getVueById(this._ejectVuePrefix + id);
            if (vue === undefined) { return false; }

            resources[id].rateMods['eject'] += count;

            resetMultiplier();
            for (let i = 0; i < count; i++) {
                vue.ejectMore(id);
            }
        },

        consumeLess(id, count) {
            let vue = getVueById(this._ejectVuePrefix + id);
            if (vue === undefined) { return false; }

            resources[id].rateMods['eject'] -= count;

            resetMultiplier();
            for (let i = 0; i < count; i++) {
                vue.ejectLess(id);
            }
        }
    }

    var AlchemyManager = {
        _alchemyVuePrefix: "alchemy",
        priorityList: [],

        resEnabled: id => settings['res_alchemy_' + id],
        resWeighting: id => settings['res_alchemy_w_' + id],

        isUnlocked() {
            return haveTech('alchemy');
        },

        managedPriorityList() {
            return this.priorityList.filter(res => this.resEnabled(res.id) && res.isUnlocked() && this.transmuteTier(res) <= game.global.tech.alchemy && (!game.global.race['artifical'] || res !== resources.Food));
        },

        transmuteTier(res) {
            return !game.tradeRatio.hasOwnProperty(res.id) || res === resources.Crystal ? 0 :
                   res.instance?.hasOwnProperty("trade") ? 1 : 2;
        },

        currentCount(id) {
            return game.global.race.alchemy[id];
        },

        transmuteMore(id, count) {
            let vue = getVueById(this._alchemyVuePrefix + id);
            if (vue === undefined) { return false; }

            resources.Mana.rateOfChange -= count * 1;
            resources.Crystal.rateOfChange -= count * 0.5;

            resetMultiplier();
            for (let i = 0; i < count; i++) {
                vue.addSpell(id);
            }
        },

        transmuteLess(id, count) {
            let vue = getVueById(this._alchemyVuePrefix + id);
            if (vue === undefined) { return false; }

            resources.Mana.rateOfChange += count * 1;
            resources.Crystal.rateOfChange += count * 0.5;

            resetMultiplier();
            for (let i = 0; i < count; i++) {
                vue.subSpell(id);
            }
        }
    }

    var RitualManager = {
        _industryVueBinding: "iPylon",
        _industryVue: undefined,

        Productions: addProps({
            Farmer: {id: 'farmer', isUnlocked: () => !game.global.race['cataclysm'] && !game.global.race['carnivore'] && !game.global.race['soul_eater'] && !game.global.race['artifical']},
            Miner: {id: 'miner', isUnlocked: () => !game.global.race['cataclysm']},
            Lumberjack: {id: 'lumberjack', isUnlocked: () => !game.global.race['cataclysm'] && isLumberRace() && !game.global.race['evil']},
            Science: {id: 'science', isUnlocked: () => true},
            Factory: {id: 'factory', isUnlocked: () => true},
            Army: {id: 'army', isUnlocked: () => true},
            Hunting: {id: 'hunting', isUnlocked: () => true},
            Crafting: {id: 'crafting', isUnlocked: () => haveTech("magic", 4)},
        }, (s) => s.id, [{s: 'spell_w_', p: "weighting"}]),

        initIndustry() {
            if ((buildings.Pylon.count < 1 && buildings.RedPylon.count < 1) || !game.global.race['casting']) {
                return false;
            }

            this._industryVue = getVueById(this._industryVueBinding);
            if (this._industryVue === undefined) {
                return false;
            }

            return true;
        },

        currentSpells(spell) {
            return game.global.race.casting[spell.id];
        },

        spellCost(spell) {
            return this.manaCost(this.currentSpells(spell));
        },

        costStep(level) {
            if (level === 0) {
                return 0.0025;
            }
            let cost = this.manaCost(level);
            return ((cost / level * 1.0025 + 0.0025) * (level + 1)) - cost;
        },

        // export function manaCost(spell,rate) from industry.js
        manaCost(level) {
            return level * ((1.0025) ** level - 1);
        },

        increaseRitual(spell, count) {
            if (count === 0 || !spell.isUnlocked()) {
                return false;
            }
            if (count < 0) {
                return this.decreaseRitual(spell, count * -1);
            }

            resetMultiplier();
            for (let i = 0; i < count; i++) {
                this._industryVue.addSpell(spell.id);
            }
        },

        decreaseRitual(spell, count) {
            if (count === 0 || !spell.isUnlocked()) {
                return false;
            }
            if (count < 0) {
                return this.increaseRitual(count * -1);
            }

            resetMultiplier();
            for (let i = 0; i < count; i++) {
                this._industryVue.subSpell(spell.id);
            }
        }
    }

    var SmelterManager = {
        _industryVueBinding: "iSmelter",
        _industryVue: undefined,

        Productions: normalizeProperties({
            Iron: {id: "Iron", unlocked: () => true, resource: resources.Iron, cost: []},
            Steel: {id: "Steel", unlocked: () => resources.Steel.isUnlocked() && haveTech("smelting", 2), resource: resources.Steel,
                    cost: [new ResourceProductionCost(resources.Coal, 0.25, 1.25), new ResourceProductionCost(resources.Iron, 2, 6)]},
            Iridium: {id: "Iridium", unlocked: () => resources.Iridium.isUnlocked() && (haveTech("m_smelting", 2) || haveTech("irid_smelting")), resource: resources.Iridium, cost: []},
        }, [ResourceProductionCost]),

        Fuels: addProps(normalizeProperties({
            Oil: {id: "Oil", unlocked: () => game.global.resource.Oil.display, cost: [new ResourceProductionCost(resources.Oil, 0.35, 2)]},
            Coal: {id: "Coal", unlocked: () => game.global.resource.Coal.display, cost: [new ResourceProductionCost(resources.Coal, () => !isLumberRace() ? 0.15 : 0.25, 2)]},
            Wood: {id: "Wood", unlocked: () => isLumberRace() || game.global.race['evil'], cost: [new ResourceProductionCost(() => game.global.race['evil'] ? game.global.race['soul_eater'] && game.global.race.species !== 'wendigo' ? resources.Food : resources.Furs : resources.Lumber, () => game.global.race['evil'] && !game.global.race['soul_eater'] || game.global.race.species === 'wendigo' ? 1 : 3, 6)]},
            Star: {id: "Star", unlocked: () => haveTech("star_forge", 2), cost: [new ResourceProductionCost(resources.StarPower, 1, 0)]},
            Inferno: {id: "Inferno", unlocked: () => haveTech("smelting", 8), cost: [new ResourceProductionCost(resources.Coal, 50, 50), new ResourceProductionCost(resources.Oil, 35, 50), new ResourceProductionCost(resources.Infernite, 0.5, 50)]},
        }, [ResourceProductionCost]), (f) => f.id, [{s: "smelter_fuel_p_", p: "priority"}]),

        initIndustry() {
            if (buildings.Smelter.count < 1 && !game.global.race['cataclysm']) {
                return false;
            }

            this._industryVue = getVueById(this._industryVueBinding);
            if (this._industryVue === undefined) {
                return false;
            }

            return true;
        },

        managedFuelPriorityList() {
            return Object.values(this.Fuels).sort((a, b) => a.priority - b.priority);
        },

        fueledCount(fuel) {
            if (!fuel.unlocked) {
                return 0;
            }

            return game.global.city.smelter[fuel.id];
        },

        smeltingCount(production) {
            if (!production.unlocked) {
                return 0;
            }

            return game.global.city.smelter[production.id];
        },

        increaseFuel(fuel, count) {
            if (count === 0 || !fuel.unlocked) {
                return false;
            }
            if (count < 0) {
                return this.decreaseFuel(fuel, count * -1);
            }

            resetMultiplier();
            for (let i = 0; i < count; i++) {
                this._industryVue.addFuel(fuel.id);
            }
        },

        decreaseFuel(fuel, count) {
            if (count === 0 || !fuel.unlocked) {
                return false;
            }
            if (count < 0) {
                return this.increaseFuel(fuel, count * -1);
            }

            resetMultiplier();
            for (let i = 0; i < count; i++) {
                this._industryVue.subFuel(fuel.id);
            }
        },

        increaseSmelting(id, count) {
            if (count === 0 || !this.Productions[id].unlocked) {
                return false;
            }
            if (count < 0) {
                return this.decreaseSmelting(id, count * -1);
            }

            resetMultiplier();
            for (let i = 0; i < count; i++) {
                this._industryVue.addMetal(id);
            }
        },

        decreaseSmelting(id, count) {
            if (count === 0 || !this.Productions[id].unlocked) {
                return false;
            }
            if (count < 0) {
                return this.increaseSmelting(id, count * -1);
            }

            resetMultiplier();
            for (let i = 0; i < count; i++) {
                this._industryVue.subMetal(id);
            }
        },

        maxOperating() {
            return game.global.city.smelter.cap;
        },

        currentFueled() {
            return this._industryVue.$options.filters.on();
        }
    }

    var FactoryManager = {
        _industryVueBinding: "iFactory",
        _industryVue: undefined,

        Productions: addProps(normalizeProperties({
            LuxuryGoods:          {id: "Lux", resource: resources.Money, unlocked: () => true,
                                   cost: [new ResourceProductionCost(resources.Furs, () => FactoryManager.f_rate("Lux", "fur"), 5)]},
            Furs:                 {id: "Furs", resource: resources.Furs, unlocked: () => haveTech("synthetic_fur"),
                                   cost: [new ResourceProductionCost(resources.Money, () => FactoryManager.f_rate("Furs", "money"), 1000),
                                          new ResourceProductionCost(resources.Polymer, () => FactoryManager.f_rate("Furs", "polymer"), 10)]},
            Alloy:                {id: "Alloy", resource: resources.Alloy, unlocked: () => true,
                                   cost: [new ResourceProductionCost(resources.Copper, () => FactoryManager.f_rate("Alloy", "copper"), 5),
                                          new ResourceProductionCost(resources.Aluminium, () => FactoryManager.f_rate("Alloy", "aluminium"), 5)]},
            Polymer:              {id: "Polymer", resource: resources.Polymer, unlocked: () => haveTech("polymer"),
                                   cost: function(){ return !isLumberRace() ? this.cost_kk : this.cost_normal},
                                   cost_kk:       [new ResourceProductionCost(resources.Oil, () => FactoryManager.f_rate("Polymer", "oil_kk"), 2)],
                                   cost_normal:   [new ResourceProductionCost(resources.Oil, () => FactoryManager.f_rate("Polymer", "oil"), 2),
                                                   new ResourceProductionCost(resources.Lumber, () => FactoryManager.f_rate("Polymer", "lumber"), 50)]},
            NanoTube:             {id: "Nano", resource: resources.Nano_Tube, unlocked: () => haveTech("nano"),
                                   cost: [new ResourceProductionCost(resources.Coal, () => FactoryManager.f_rate("Nano_Tube", "coal"), 15),
                                          new ResourceProductionCost(resources.Neutronium, () => FactoryManager.f_rate("Nano_Tube", "neutronium"), 0.2)]},
            Stanene:              {id: "Stanene", resource: resources.Stanene, unlocked: () => haveTech("stanene"),
                                   cost: [new ResourceProductionCost(resources.Aluminium, () => FactoryManager.f_rate("Stanene", "aluminium"), 50),
                                          new ResourceProductionCost(resources.Nano_Tube, () => FactoryManager.f_rate("Stanene", "nano"), 5)]},
        }, [ResourceProductionCost]), (p) => p.resource.id,
          [{s: 'production_', p: "enabled"},
           {s: 'production_w_', p: "weighting"},
           {s: 'production_p_', p: "priority"}]),

        initIndustry() {
            if (buildings.Factory.count < 1 && buildings.RedFactory.count < 1) {
                return false;
            }

            this._industryVue = getVueById(this._industryVueBinding);
            if (this._industryVue === undefined) {
                return false;
            }
            return true;
        },

        f_rate(production, resource) {
            return game.f_rate[production][resource][game.global.tech['factory'] || 0];
        },

        currentOperating() {
            let total = 0;
            for (let key in this.Productions){
                let production = this.Productions[key];
                total += game.global.city.factory[production.id];
            }
            return total;
        },

        maxOperating() {
            let max = buildings.Factory.stateOnCount + buildings.RedFactory.stateOnCount + buildings.AlphaMegaFactory.stateOnCount * 2;
            for (let key in this.Productions){
                let production = this.Productions[key];
                if (production.unlocked && !production.enabled) {
                    max -= game.global.city.factory[production.id];
                }
            }
            return max;
        },

        currentProduction(production) {
            return production.unlocked ? game.global.city.factory[production.id] : 0;
        },

        increaseProduction(production, count) {
            if (count === 0 || !production.unlocked) {
                return false;
            }
            if (count < 0) {
                return this.decreaseProduction(production, count * -1);
            }

            resetMultiplier();
            for (let i = 0; i < count; i++) {
                this._industryVue.addItem(production.id);
            }
        },

        decreaseProduction(production, count) {
            if (count === 0 || !production.unlocked) {
                return false;
            }
            if (count < 0) {
                return this.increaseProduction(production, count * -1);
            }

            resetMultiplier();
            for (let i = 0; i < count; i++) {
                this._industryVue.subItem(production.id);
            }
        }
    }

    var DroidManager = {
        _industryVueBinding: "iDroid",
        _industryVue: undefined,

        Productions: addProps({
            Adamantite: {id: "adam", resource: resources.Adamantite},
            Uranium: {id: "uran", resource: resources.Uranium},
            Coal: {id: "coal", resource: resources.Coal},
            Aluminium: {id: "alum", resource: resources.Aluminium},
        }, (p) => p.resource.id,
          [{s: 'droid_w_', p: "weighting"},
           {s: 'droid_pr_', p: "priority"}]),

        initIndustry() {
            if (buildings.AlphaMiningDroid.count < 1) {
                return false;
            }

            this._industryVue = getVueById(this._industryVueBinding);
            if (this._industryVue === undefined) {
                return false;
            }

            return true;
        },

        currentOperating() {
            let total = 0;
            for (let key in this.Productions){
                let production = this.Productions[key];
                total += game.global.interstellar.mining_droid[production.id];
            }
            return total;
        },

        maxOperating() {
            return game.global.interstellar.mining_droid.on;
        },

        currentProduction(production) {
            return game.global.interstellar.mining_droid[production.id];
        },

        increaseProduction(production, count) {
            if (count === 0) {
                return false;
            }
            if (count < 0) {
                return this.decreaseProduction(production, count * -1);
            }

            resetMultiplier();
            for (let i = 0; i < count; i++) {
                this._industryVue.addItem(production.id);
            }
        },

        decreaseProduction(production, count) {
            if (count === 0) {
                return false;
            }
            if (count < 0) {
                return this.increaseProduction(production, count * -1);
            }

            resetMultiplier();
            for (let i = 0; i < count; i++) {
                this._industryVue.subItem(production.id);
            }
        }
    }

    var GrapheneManager = {
        _industryVueBinding: "iGraphene",
        _industryVue: undefined,
        _graphPlant: null,

        Fuels: {
            Lumber: {id: "Lumber", cost: new ResourceProductionCost(resources.Lumber, 350, 100), add: "addWood", sub: "subWood"},
            Coal: {id: "Coal", cost: new ResourceProductionCost(resources.Coal, 25, 10), add: "addCoal", sub: "subCoal"},
            Oil: {id: "Oil", cost: new ResourceProductionCost(resources.Oil, 15, 10), add: "addOil", sub: "subOil"},
        },

        initIndustry() {
            this._graphPlant = game.global.race['truepath'] ? buildings.TitanGraphene : buildings.AlphaGraphenePlant;
            if (this._graphPlant.count < 1) {
                return false;
            }

            this._industryVue = getVueById(this._industryVueBinding);
            if (this._industryVue === undefined) {
                return false;
            }

            return true;
        },

        maxOperating() {
            return this._graphPlant.instance.on;
        },

        fueledCount(fuel) {
            return this._graphPlant.instance[fuel.id];
        },

        increaseFuel(fuel, count) {
            if (count === 0 || !fuel.cost.resource.isUnlocked()) {
                return false;
            }
            if (count < 0) {
                return this.decreaseFuel(fuel, count * -1);
            }

            resetMultiplier();
            for (let i = 0; i < count; i++) {
                this._industryVue[fuel.add]();
            }
        },

        decreaseFuel(fuel, count) {
            if (count === 0 || !fuel.cost.resource.isUnlocked()) {
                return false;
            }
            if (count < 0) {
                return this.increaseFuel(fuel, count * -1);
            }

            resetMultiplier();
            for (let i = 0; i < count; i++) {
                this._industryVue[fuel.sub]();
            }
        }
    }

    var GalaxyTradeManager = {
        _industryVueBinding: "galaxyTrade",
        _industryVue: undefined,

        initIndustry() {
            if (buildings.GorddonFreighter.count + buildings.Alien1SuperFreighter.count < 1) {
                return false;
            }

            this._industryVue = getVueById(this._industryVueBinding);
            if (this._industryVue === undefined) {
                return false;
            }

            return true;
        },

        currentOperating() {
            return game.global.galaxy.trade.cur;
        },

        maxOperating() {
            return game.global.galaxy.trade.max;
        },

        currentProduction(production) {
            return game.global.galaxy.trade["f" + production];
        },

        zeroProduction(production) {
            this._industryVue.zero(production);
        },

        increaseProduction(production, count) {
            if (count === 0) {
                return false;
            }
            if (count < 0) {
                return this.decreaseProduction(production, count * -1);
            }

            resetMultiplier();
            for (let i = 0; i < count; i++) {
                this._industryVue.more(production);
            }
        },

        decreaseProduction(production, count) {
            if (count === 0) {
                return false;
            }
            if (count < 0) {
                return this.increaseProduction(production, count * -1);
            }

            resetMultiplier();
            for (let i = 0; i < count; i++) {
                this._industryVue.less(production);
            }
        }
    }

    var GovernmentManager = {
        Types: {
            anarchy: {id: "anarchy", isUnlocked: () => false}, // Special - should not be shown to player
            autocracy: {id: "autocracy", isUnlocked: () => true},
            democracy: {id: "democracy", isUnlocked: () => true},
            oligarchy: {id: "oligarchy", isUnlocked: () => true},
            theocracy: {id: "theocracy", isUnlocked: () => haveTech("gov_theo")},
            republic: {id: "republic", isUnlocked: () => haveTech("govern", 2)},
            socialist: {id: "socialist", isUnlocked: () => haveTech("gov_soc")},
            corpocracy: {id: "corpocracy", isUnlocked: () => haveTech("gov_corp")},
            technocracy: {id: "technocracy", isUnlocked: () => haveTech("govern", 3)},
            federation: {id: "federation", isUnlocked: () => haveTech("gov_fed")},
            magocracy: {id: "magocracy", isUnlocked: () => haveTech("gov_mage")},
        },

        isUnlocked() {
            let node = document.getElementById("govType");
            return node !== null && node.style.display !== "none";
        },

        isEnabled() {
            let node = document.querySelector("#govType button");
            return this.isUnlocked() && node !== null && node.getAttribute("disabled") !== "disabled";
        },

        currentGovernment() {
            return game.global.civic.govern.type;
        },

        setGovernment(government) {
            // Don't try anything if chosen government already set, or modal window is already open
            if (this.currentGovernment() === government || WindowManager.isOpen()) {
                return;
            }

            let optionsNode = document.querySelector("#govType button");
            let title = game.loc('civics_government_type');
            WindowManager.openModalWindowWithCallback(optionsNode, title, () => {
                GameLog.logSuccess("special", `发生革命！社会体制切换为 ${game.loc("govern_" + government)} 。`, ['events', 'major_events']);
                getVueById('govModal')?.setGov(government);
            });
        },
    }

    var MarketManager = {
        priorityList: [],
        multiplier: 0,

        updateData() {
            if (game.global.city.market) {
                this.multiplier = game.global.city.market.qty;
            }
        },

        isUnlocked() {
            return haveTech("currency", 2);
        },

        sortByPriority() {
            this.priorityList.sort((a, b) => a.marketPriority - b.marketPriority);
        },

        isBuySellUnlocked(resource) {
            return document.querySelector("#market-" + resource.id + " .order") !== null;
        },

        setMultiplier(multiplier) {
            this.multiplier = Math.min(Math.max(1, multiplier), this.getMaxMultiplier());

            getVueById("market-qty").qty = this.multiplier;
        },

        getMaxMultiplier(){
            return getVueById("market-qty")?.limit() ?? 1;
        },

        getUnitBuyPrice(resource) {
            // marketItem > vBind > purchase from resources.js
            let price = game.global.resource[resource.id].value;

            price *= traitVal('arrogant', 0, '+');
            price *= traitVal('conniving', 0, '-');

            return price;
        },

        getUnitSellPrice(resource) {
            // marketItem > vBind > sell from resources.js
            let divide = 4;

            divide *= traitVal('merchant', 0, '-');
            divide *= traitVal('asymmetrical', 0, '+');
            divide *= traitVal('conniving', 1, '-');

            return game.global.resource[resource.id].value / divide;
        },

        buy(resource) {
            let vue = getVueById(resource._marketVueBinding);
            if (vue === undefined) { return false; }

            let price = this.getUnitBuyPrice(resource) * this.multiplier;
            if (resources.Money.currentQuantity < price) { return false; }

            resources.Money.currentQuantity -= this.multiplier * this.getUnitBuyPrice(resource);
            resource.currentQuantity += this.multiplier;

            vue.purchase(resource.id);
        },

        sell(resource) {
            let vue = getVueById(resource._marketVueBinding);
            if (vue === undefined) { return false; }

            if (resource.currentQuantity < this.multiplier) { return false; }

            resources.Money.currentQuantity += this.multiplier * this.getUnitSellPrice(resource);
            resource.currentQuantity -= this.multiplier;

            vue.sell(resource.id);
        },

        getImportRouteCap() {
            if (haveTech("currency", 6)){
                return 1000000;
            } else if (haveTech("currency", 4)){
                return 100;
            } else {
                return 25;
            }
        },

        getExportRouteCap() {
            if (!game.global.race['banana']){
                return this.getImportRouteCap();
            } else if (haveTech("currency", 6)){
                return 1000000;
            } else if (haveTech("currency", 4)){
                return 25;
            } else {
                return 10;
            }
        },

        getMaxTradeRoutes() {
            let max = game.global.city.market.mtrade;
            let unmanaged = 0;
            for (let i = 0; i < this.priorityList.length; i++) {
                let resource = this.priorityList[i];
                if (!resource.autoTradeBuyEnabled && !resource.autoTradeSellEnabled) {
                    max -= Math.abs(resource.tradeRoutes);
                    unmanaged += resource.tradeRoutes;
                }
            }
            return [max, unmanaged];
        },

        zeroTradeRoutes(resource) {
            getVueById(resource._marketVueBinding)?.zero(resource.id);
        },

        addTradeRoutes(resource, count) {
            if (!resource.isUnlocked()) { return false; }

            let vue = getVueById(resource._marketVueBinding);
            if (vue === undefined) { return false; }

            resetMultiplier();
            for (let i = 0; i < count; i++) {
                vue.autoBuy(resource.id);
            }
        },

        removeTradeRoutes(resource, count) {
            if (!resource.isUnlocked()) { return false; }

            let vue = getVueById(resource._marketVueBinding);
            if (vue === undefined) { return false; }

            resetMultiplier();
            for (let i = 0; i < count; i++) {
                vue.autoSell(resource.id);
            }
        }
    }

    var StorageManager = {
        priorityList: [],
        _storageVueBinding: "createHead",
        _storageVue: undefined,

        initStorage() {
            if (!this.isUnlocked) {
                return false;
            }

            this._storageVue = getVueById(this._storageVueBinding);
            if (this._storageVue === undefined) {
                return false;
            }

            return true;
        },

        isUnlocked() {
            return haveTech("container");
        },

        sortByPriority() {
            this.priorityList.sort((a, b) => a.storagePriority - b.storagePriority);
        },

        constructCrate(count) {
            if (count <= 0) {
                return;
            }
            resetMultiplier();
            for (let i = 0; i < count; i++) {
                this._storageVue.crate();
            }
        },

        constructContainer(count) {
            if (count <= 0) {
                return;
            }
            resetMultiplier();
            for (let i = 0; i < count; i++) {
                this._storageVue.container();
            }
        },

        assignCrate(resource, count) {
            let vue = getVueById(resource._stackVueBinding);
            if (vue === undefined) { return false; }

            resetMultiplier();
            for (let i = 0; i < count; i++) {
                vue.addCrate(resource.id);
            }
        },

        unassignCrate(resource, count) {
            let vue = getVueById(resource._stackVueBinding);
            if (vue === undefined) { return false; }

            resetMultiplier();
            for (let i = 0; i < count; i++) {
                vue.subCrate(resource.id);
            }
        },

        assignContainer(resource, count) {
            let vue = getVueById(resource._stackVueBinding);
            if (vue === undefined) { return false; }

            resetMultiplier();
            for (let i = 0; i < count; i++) {
                vue.addCon(resource.id);
            }
        },

        unassignContainer(resource, count) {
            let vue = getVueById(resource._stackVueBinding);
            if (vue === undefined) { return false; }

            resetMultiplier();
            for (let i = 0; i < count; i++) {
                vue.subCon(resource.id);
            }
        }
    }

    var SpyManager = {
        _foreignVue: undefined,

        purchaseMoney: 0,
        purchaseForeigngs: [],
        foreignActive: [],
        foreignTarget: null,

        Types: {
            Influence: {id: "influence"},
            Sabotage: {id: "sabotage"},
            Incite: {id: "incite"},
            Annex: {id: "annex"},
            Purchase: {id: "purchase"},
        },

        spyCost(govIndex, spy) {
            let gov = game.global.civic.foreign[`gov${govIndex}`];
            spy = spy ?? gov.spy + 1;

            let base = Math.max(50, Math.round((gov.mil / 2) + (gov.hstl / 2) - gov.unrest) + 10);
            if (game.global.race['infiltrator']){
                base /= 3;
            }
            return Math.round(base ** spy) + 500;
        },

        updateForeigns() {
            this.purchaseMoney = 0;
            this.purchaseForeigngs = [];
            this._foreignVue = getVueById("foreign");
            let foreignUnlocked = this._foreignVue?.vis();
            if (foreignUnlocked) {
                let currentTarget = null;
                let controlledForeigns = 0;

                let unlockedForeigns = [];
                if (!haveTech("world_control")) {
                    unlockedForeigns.push(0, 1, 2);
                }
                if (haveTech("rival")) {
                    unlockedForeigns.push(3);
                }

                let activeForeigns = unlockedForeigns.map(i => ({id: i, gov: game.global.civic.foreign[`gov${i}`]}));

                // Init foreigns
                for (let foreign of activeForeigns) {
                    let rank = foreign.id === 3 ? "Rival" :
                      getGovPower(foreign.id) <= settings.foreignPowerRequired ? "Inferior" :
                      "Superior";

                    foreign.policy = settings[`foreignPolicy${rank}`];

                    if ((foreign.gov.anx && foreign.policy === "Annex") ||
                        (foreign.gov.buy && foreign.policy === "Purchase") ||
                        (foreign.gov.occ && foreign.policy === "Occupy")) {
                        controlledForeigns++;
                    }

                    if (!settings.foreignPacifist && !foreign.gov.anx && !foreign.gov.buy && rank === "Inferior") {
                        currentTarget = foreign;
                    }
                }

                // Adjust for fight
                if (activeForeigns.length > 0 && !settings.foreignPacifist) {
                    // Try to attacks last uncontrolled inferior, or first occupied, or just first, in this order.
                    currentTarget = currentTarget ?? activeForeigns.find(f => f.gov.occ) ?? activeForeigns[0];

                    let readyToUnify = settings.foreignUnification && controlledForeigns >= 2 && game.global.tech['unify'] === 1;

                    // Don't annex or purchase our farm target, unless we're ready to unify
                    if (!readyToUnify && ["Annex", "Purchase"].includes(currentTarget.policy) && SpyManager.isEspionageUseful(currentTarget.id, SpyManager.Types[currentTarget.policy].id)) {
                        currentTarget.policy = "Ignore";
                    }

                    // Force sabotage, if needed, and we know it's useful
                    if (!readyToUnify && settings.foreignForceSabotage && currentTarget.id !== 3 && SpyManager.isEspionageUseful(currentTarget.id, SpyManager.Types.Sabotage.id)) {
                        currentTarget.policy = "Sabotage";
                    }

                    // Set last foreign to sabotage only, and then switch to occupy once we're ready to unify
                    if (settings.foreignUnification && settings.foreignOccupyLast && !haveTech('world_control')) {
                        let lastTarget = ["Occupy", "Sabotage"].includes(settings.foreignPolicySuperior) ? 2 : currentTarget.id;
                        activeForeigns[lastTarget].policy = readyToUnify ? "Occupy" : "Sabotage";
                    }

                    // Do not attack if policy set to influence, or we're ready to unify
                    if (currentTarget.policy === "Influence" || (readyToUnify && currentTarget.policy !== "Occupy")) {
                        currentTarget = null;
                    }
                }

                // Request money for unify, make sure we have autoFight and autoResearch
                if (game.global.tech['unify'] === 1 && settings.foreignUnification && settings.autoFight) {
                    for (let foreign of activeForeigns) {
                        if (foreign.policy === "Purchase" && !foreign.gov.buy && foreign.gov.act !== "purchase") {
                            let moneyNeeded = Math.max(poly.govPrice(foreign.id), (foreign.gov.spy < 3 ? this.spyCost(foreign.id, 3) : 0));
                            if (moneyNeeded <= resources.Money.maxQuantity) {
                                this.purchaseForeigngs.push(foreign.id);
                                this.purchaseMoney = Math.max(moneyNeeded, this.purchaseMoney);
                            }
                        }
                    }
                }

                this.foreignTarget = currentTarget;
                this.foreignActive = activeForeigns;
            } else {
                this._foreignVue = undefined;
            }
        },

        performEspionage(govIndex, espionageId, influenceAllowed) {
            if (WindowManager.isOpen()) { return; } // Don't try anything if a window is already open

            let optionsSpan = document.querySelector(`#gov${govIndex} div span:nth-child(3)`);
            if (optionsSpan.style.display === "none") { return; }

            let optionsNode = document.querySelector(`#gov${govIndex} div span:nth-child(3) button`);
            if (optionsNode === null || optionsNode.getAttribute("disabled") === "disabled") { return; }

            let espionageToPerform = null;
            if (espionageId === this.Types.Annex.id || espionageId === this.Types.Purchase.id) {
                // Occupation routine
                if (this.isEspionageUseful(govIndex, espionageId)) {
                    // If we can annex\purchase right now - do it
                    espionageToPerform = espionageId;
                } else if (this.isEspionageUseful(govIndex, this.Types.Influence.id) && influenceAllowed) {
                    // Influence goes second, as it always have clear indication when HSTL already at zero
                    espionageToPerform = this.Types.Influence.id;
                } else if (this.isEspionageUseful(govIndex, this.Types.Incite.id)) {
                    // And now incite
                    espionageToPerform = this.Types.Incite.id;
                }
            } else if (this.isEspionageUseful(govIndex, espionageId)) {
                // User specified spy operation. If it is not already at miximum effect then proceed with it.
                espionageToPerform = espionageId;
            }

            if (espionageToPerform !== null) {
                if (espionageToPerform === this.Types.Purchase.id) {
                    resources.Money.currentQuantity -= poly.govPrice(govIndex);
                }
                let title = game.loc('civics_espionage_actions');
                WindowManager.openModalWindowWithCallback(optionsNode, title, () => {
                    GameLog.logSuccess("spying", `对${getGovName(govIndex)}进行"${game.loc("civics_spy_" + espionageToPerform)}"隐秘行动。`, ['spy']);
                    getVueById('espModal')?.[espionageToPerform]?.(govIndex);
                });
            }
        },

        isEspionageUseful(govIndex, espionageId) {
            let gov = game.global.civic.foreign["gov" + govIndex];

            // Return true when requested task is useful, or when we don't have enough spies prove it's not
            switch (espionageId) {
                case this.Types.Influence.id:
                    return gov.hstl > (gov.spy > 0 ? 0 : 10);
                case this.Types.Sabotage.id:
                    return gov.spy < 1 || gov.mil > (gov.spy > 1 ? 50 : 74);
                case this.Types.Incite.id:
                    return gov.spy < 3 || gov.unrest < (gov.spy > 3 ? 100 : 76);
                case this.Types.Annex.id:
                    return gov.hstl <= 50 && gov.unrest >= 50 && resources.Morale.currentQuantity >= (200 + gov.hstl - gov.unrest);
                case this.Types.Purchase.id:
                    return gov.spy >= 3 && resources.Money.currentQuantity >= poly.govPrice(govIndex);
            }
            return false;
        },
    }

    var WarManager = {
        _garrisonVue: undefined,
        _hellVue: undefined,

        workers: 0,
        wounded: 0,
        raid: 0,
        max: 0,
        m_use: 0,
        crew: 0,
        hellSoldiers: 0,
        hellPatrols: 0,
        hellPatrolSize: 0,
        hellAssigned: 0,
        hellReservedSoldiers: 0,

        updateGarrison() {
            let garrison = game.global.civic.garrison;
            if (garrison) {
                this.workers = garrison.workers;
                this.wounded = garrison.wounded;
                this.raid = garrison.raid;
                this.max = garrison.max;
                this.m_use = garrison.m_use;
                this.crew = garrison.crew;
                this._garrisonVue = getVueById("garrison");
            } else {
                this._garrisonVue = undefined;
            }
        },

        updateHell() {
            let fortress = game.global.portal.fortress;
            if (fortress) {
                this.hellSoldiers = fortress.garrison;
                this.hellPatrols = fortress.patrols;
                this.hellPatrolSize = fortress.patrol_size;
                this.hellAssigned = fortress.assigned;
                this.hellReservedSoldiers = this.getHellReservedSoldiers();
                this._hellVue = getVueById("fort");
            } else {
                this._hellVue = undefined;
            }
        },

        get currentSoldiers() {
            return this.workers - this.crew;
        },

        get maxSoldiers() {
            return this.max - this.crew;
        },

        get deadSoldiers() {
            return this.max - this.workers;
        },

        get currentCityGarrison() {
            return this.currentSoldiers - this.hellSoldiers - (game.global.space.fob?.troops ?? 0);
        },

        get maxCityGarrison() {
            return this.maxSoldiers - this.hellSoldiers;
        },

        get availableGarrison() {
            return this.currentCityGarrison - this.wounded;
        },

        get hellGarrison()  {
            return this.hellSoldiers - this.hellPatrolSize * this.hellPatrols - this.hellReservedSoldiers;
        },

        launchCampaign(govIndex) {
            this._garrisonVue.campaign(govIndex);
        },

        release(govIndex) {
            if (game.global.civic.foreign["gov" + govIndex].occ) {
                let occSoldiers = getOccCosts();
                this.workers += occSoldiers;
                this.max += occSoldiers;
            }
            this._garrisonVue.campaign(govIndex);
        },

        isMercenaryUnlocked() {
            return game.global.civic.garrison.mercs;
        },

        // function mercCost from civics.js
        getMercenaryCost() {
            let cost = Math.round((1.24 ** this.workers) * 75) - 50;
            if (cost > 25000){
                cost = 25000;
            }
            if (this.m_use > 0){
                cost *= 1.1 ** this.m_use;
            }
            cost *= traitVal('brute', 0, '-');
            if (game.global.race['inflation']){
                cost *= 1 + (game.global.race.inflation / 500);
            }
            return Math.round(cost);
        },

        hireMercenary() {
            let cost = this.getMercenaryCost();
            if (this.workers >= this.max || resources.Money.currentQuantity < cost){
                return false;
            }

            resetMultiplier();
            this._garrisonVue.hire();

            resources.Money.currentQuantity -= cost;
            this.workers++;
            this.m_use++;

            return true;
        },

        getHellReservedSoldiers(){
            let soldiers = 0;

            // Assign soldiers to assault forge once other requirements are met
            if (buildings.PitAssaultForge.isUnlocked() && buildings.PitAssaultForge.isAutoBuildable()) {
                let missingRes = Object.entries(buildings.PitAssaultForge.cost).find(([id, amount]) => resources[id].currentQuantity < amount);
                if (!missingRes) {
                    soldiers = Math.round(650 / game.armyRating(1, "hellArmy"));
                }
            }

            // Reserve soldiers operating forge
            if (buildings.PitSoulForge.count > 0) {
                // export function soulForgeSoldiers() from portal.js
                soldiers = Math.round(650 / game.armyRating(1, "hellArmy"));
                if (game.global.portal.gun_emplacement) {
                    soldiers -= game.global.portal.gun_emplacement.on * (game.global.tech.hell_gun >= 2 ? 2 : 1);
                    if (soldiers < 0){
                        soldiers = 0;
                    }
                }
            }

            // Guardposts need at least one soldier free so lets just always keep one handy
            if (buildings.RuinsGuardPost.count > 0) {
                soldiers += buildings.RuinsGuardPost.stateOnCount + 1;
            }
            return soldiers;
        },

        setTactic(newTactic){
            let currentTactic = game.global.civic.garrison.tactic;
            for (let i = currentTactic; i < newTactic; i++) {
                this._garrisonVue.next();
            }
            for (let i = currentTactic; i > newTactic; i--) {
                this._garrisonVue.last();
            }
        },

        getCampaignTitle(tactic) {
            return this._garrisonVue.$options.filters.tactics(tactic);
        },

        addBattalion(count) {
            resetMultiplier();
            for (let i = 0; i < count; i++) {
                this._garrisonVue.aNext();
            }

            this.raid = Math.min(this.raid + count, this.currentCityGarrison);
        },

        removeBattalion(count) {
            resetMultiplier();
            for (let i = 0; i < count; i++) {
                this._garrisonVue.aLast();
            }

            this.raid = Math.max(this.raid - count, 0);
        },

        getGovArmy(tactic, govIndex) { // function battleAssessment(gov)
            let enemy = [5, 27.5, 62.5, 125, 300][tactic];
            if (game.global.race['banana']) {
                enemy *= 2;
            }
            return enemy * getGovPower(govIndex) / 100;
        },

        getAdvantage(army, tactic, govIndex) {
            return (1 - (this.getGovArmy(tactic, govIndex) / army)) * 100;
        },

        getRatingForAdvantage(adv, tactic, govIndex) {
            return this.getGovArmy(tactic, govIndex) / (1 - (adv/100));
        },

        getSoldiersForAdvantage(advantage, tactic, govIndex) {
            return this.getSoldiersForAttackRating(this.getRatingForAdvantage(advantage, tactic, govIndex));
        },

        // Calculates the required soldiers to reach the given attack rating, assuming everyone is healthy.
        getSoldiersForAttackRating(targetRating) {
            if (!targetRating || targetRating <= 0) {
                return 0;
            }
            // Getting the rating for 10 soldiers and dividing it by number of soldiers, to get more accurate value after rounding
            let singleSoldierAttackRating = game.armyRating(10, "army", 0) / 10;
            let maxSoldiers = Math.ceil(targetRating / singleSoldierAttackRating);
            if (!game.global.race['hivemind']) {
                return maxSoldiers;
            }

            // Ok, we've done no hivemind. Hivemind is trickier because each soldier gives attack rating and a bonus to all other soldiers.
            // I'm sure there is an exact mathematical calculation for this but...
            // Just loop through and remove 1 at a time until we're under the max rating.
            // At 10 soldiers there's no hivemind bonus or malus, and the malus gets up to 50%, so start with up to 2x soldiers below 10

            let hiveSize = traitVal('hivemind', 0);
            if (maxSoldiers < hiveSize) {
                maxSoldiers = Math.min(hiveSize, maxSoldiers / (1 - (hiveSize * 0.05)));
            }

            while (maxSoldiers > 1 && game.armyRating(maxSoldiers - 1, "army", 0) > targetRating) {
                maxSoldiers--;
            }

            return maxSoldiers;
        },

        addHellGarrison(count) {
            resetMultiplier();
            for (let i = 0; i < count; i++) {
                this._hellVue.aNext();
            }

            this.hellSoldiers = Math.min(this.hellSoldiers + count, this.workers);
            this.hellAssigned = this.hellSoldiers;
        },

        removeHellGarrison(count) {
            resetMultiplier();
            for (let i = 0; i < count; i++) {
                this._hellVue.aLast();
            }

            let min = this.hellPatrols * this.hellPatrolSize + this.hellReservedSoldiers;
            this.hellSoldiers = Math.max(this.hellSoldiers - count, min);
            this.hellAssigned = this.hellSoldiers;
        },

        addHellPatrol(count) {
            resetMultiplier();
            for (let i = 0; i < count; i++) {
                this._hellVue.patInc();
            }

            if (this.hellPatrols * this.hellPatrolSize < this.hellSoldiers){
                this.hellPatrols += count;
                if (this.hellSoldiers < this.hellPatrols * this.hellPatrolSize){
                    this.hellPatrols = Math.floor(this.hellSoldiers / this.hellPatrolSize);
                }
            }
        },

        removeHellPatrol(count) {
            resetMultiplier();
            for (let i = 0; i < count; i++) {
                this._hellVue.patDec();
            }

            this.hellPatrols = Math.max(this.hellPatrols - count, 0);
        },

        addHellPatrolSize(count) {
            resetMultiplier();
            for (let i = 0; i < count; i++) {
                this._hellVue.patSizeInc();
            }

            if (this.hellPatrolSize < this.hellSoldiers){
                this.hellPatrolSize += count;
                if (this.hellSoldiers < this.hellPatrols * this.hellPatrolSize){
                    this.hellPatrols = Math.floor(this.hellSoldiers / this.hellPatrolSize);
                }
            }
        },

        removeHellPatrolSize(count) {
            resetMultiplier();
            for (let i = 0; i < count; i++) {
                this._hellVue.patSizeDec();
            }

            this.hellPatrolSize = Math.max(this.hellPatrolSize - count, 1);
        }
    }

    var FleetManagerOuter = {
        _fleetVueBinding: "shipPlans",
        _fleetVue: undefined,

        nextShipCost: null,
        nextShipAffordable: false,
        nextShipExpandable: false,

        WeaponPower: {railgun: 36, laser: 64, p_laser: 54, plasma: 90, phaser: 114, disruptor: 156},
        SensorRange: {visual: 1, radar: 20, lidar: 35, quantum: 60},
        ClassPower: {corvette: 1, frigate: 1.5, destroyer: 2.75, cruiser: 5.5, battlecruiser: 10, dreadnought: 22},
        ClassCrew: {corvette: 2, frigate: 3, destroyer: 4, cruiser: 6, battlecruiser: 8, dreadnought: 10},

        // spc_dwarf is ignored, never having any syndicate
        Regions: ["spc_moon", "spc_red", "spc_gas", "spc_gas_moon", "spc_belt", "spc_titan", "spc_enceladus", "spc_triton", "spc_kuiper", "spc_eris"],

        ShipConfig: {
            class: ['corvette','frigate','destroyer','cruiser','battlecruiser','dreadnought'],
            power: ['solar','diesel','fission','fusion','elerium'],
            weapon: ['railgun','laser','p_laser','plasma','phaser','disruptor'],
            armor : ['steel','alloy','neutronium'],
            engine: ['ion','tie','pulse','photon','vacuum'],
            sensor: ['visual','radar','lidar','quantum'],
        },

        getWeighting(id) {
            return settings["fleet_outer_pr_" + id];
        },

        isUnlocked(id) {
            return game.actions.space[id].info.syndicate?.() ?? false;
        },

        updateShipCost() {
            if (game.global.space.shipyard?.hasOwnProperty('blueprint')) {
                let cost = poly.shipCosts(game.global.space.shipyard.blueprint);
                this.nextShipCost = cost;
                this.nextShipAffordable = true;
                this.nextShipExpandable = true;
                for (let res in cost) {
                    if (resources[res].maxQuantity < cost[res]) {
                        this.nextShipAffordable = false;
                        if (!resources[res].hasStorage()) {
                            this.nextShipExpandable = false;
                        }
                    }
                }
            } else {
                this.nextShipCost = null;
                this.nextShipAffordable = null;
                this.nextShipExpandable = null;
            }
        },

        initFleet() {
            if (!game.global.tech.syndicate || !game.global.space.shipyard?.hasOwnProperty('blueprint')) {
                return false;
            }

            this._fleetVue = getVueById(this._fleetVueBinding);
            if (this._fleetVue === undefined) {
                return false;
            }

            return true;
        },

        getBlueprint() {
            return Object.fromEntries(Object.keys(this.ShipConfig).map(type => ([type, settings["fleet_outer_" + type]])));
        },

        isShipAffordable(ship) {
            let cost = poly.shipCosts(ship);
            for (let res in cost) {
                if (resources[res].currentQuantity < cost[res]) {
                    return false;
                }
            }
            return true;
        },

        build(ship, region) {
            let yard = game.global.space.shipyard;
            for (let [type, part] of Object.entries(ship)) {
                if (type !== 'name' && yard.blueprint[type] !== part) {
                    if (this._fleetVue.avail(type, this.ShipConfig[type].indexOf(part))) {
                        this._fleetVue.setVal(type, part);
                    } else {
                        return false;
                    }
                }
            }
            if (this._fleetVue.powerText().includes("danger")) {
                return false;
            }

            let cost = poly.shipCosts(ship);
            for (let res in cost) {
                resources[res].currentQuantity -= cost[res];
            }

            if (yard.sort) {
                $("#shipPlans .b-checkbox").eq(1).click()
                this._fleetVue.build();
                getVueById('shipReg0')?.setLoc(region, yard.ships.length);
                $("#shipPlans .b-checkbox").eq(1).click()
            } else {
                this._fleetVue.build();
                getVueById('shipReg0')?.setLoc(region, yard.ships.length);
            }
            return true;
        },

        getShipAttackPower(ship) {
            return Math.round(this.WeaponPower[ship.weapon] * this.ClassPower[ship.class]);
        },

        // export function syndicate(region,extra) from truepath.js
        syndicate(region, extra, all) {
            if (!game.global.tech['syndicate'] || !game.global.race['truepath'] || !game.global.space.syndicate?.hasOwnProperty(region)){
                return extra ? {p: 1, r: 0, s: 0} : 1;
            }
            let rivalRel = game.global.civic.foreign.gov3.hstl;
            let rival = rivalRel < 10 ? (250 - (25 * rivalRel)) :
                        rivalRel > 60 ? (-13 * (rivalRel - 60)) : 0;

            let divisor = 1000;
            switch (region){
                case 'spc_home':
                case 'spc_moon':
                case 'spc_red':
                case 'spc_hell':
                    divisor = 1250 + rival;
                    break;
                case 'spc_gas':
                case 'spc_gas_moon':
                case 'spc_belt':
                    divisor = 1020 + rival;
                    break;
                case 'spc_titan':
                case 'spc_enceladus':
                    divisor = !haveTech('triton') ? 600 :
                      game.actions.space[region].info.syndicate_cap();
                    break;
                case 'spc_triton':
                case 'spc_kuiper':
                case 'spc_eris':
                    divisor = game.actions.space[region].info.syndicate_cap();
                    break;
            }

            let piracy = game.global.space.syndicate[region];
            let patrol = 0;
            let sensor = 0;
            if (game.global.space.shipyard?.hasOwnProperty('ships')){
                for (let ship of game.global.space.shipyard.ships) {
                    if (ship.location === region && ((ship.transit === 0 && ship.fueled) || all)){
                        let rating = this.getShipAttackPower(ship);
                        patrol += ship.damage > 0 ? Math.round(rating * (100 - ship.damage) / 100) : rating;
                        sensor += this.SensorRange[ship.sensor];
                    }
                }

                if (region === 'spc_enceladus'){
                    patrol += buildings.EnceladusBase.stateOnCount * 50;
                } else if (region === 'spc_titan'){
                    patrol += buildings.TitanSAM.stateOnCount * 25;
                } else if (region === 'spc_triton' && buildings.TritonFOB.stateOnCount > 0){
                    patrol += 500;
                    sensor += 10;
                }

                if (sensor > 100){
                    sensor = Math.round((sensor - 100) / ((sensor - 100) + 200) * 100) + 100;
                }

                patrol = Math.round(patrol * ((sensor + 25) / 125));
                piracy = piracy - patrol > 0 ? piracy - patrol : 0;
            }
            if (extra) {
                return {
                    p: 1 - +(piracy / divisor).toFixed(4),
                    r: piracy,
                    s: sensor
                };
            } else {
                return 1 - +(piracy / divisor).toFixed(4);
            }
        }
    }

    var FleetManager = {
        _fleetVueBinding: "fleet",
        _fleetVue: undefined,

        initFleet() {
            if (!game.global.tech.piracy) {
                return false;
            }

            this._fleetVue = getVueById(this._fleetVueBinding);
            if (this._fleetVue === undefined) {
                return false;
            }

            return true;
        },

        addShip(region, ship, count) {
            resetMultiplier();
            for (let i = 0; i < count; i++) {
                this._fleetVue.add(region, ship);
            }
        },

        subShip(region, ship, count) {
            resetMultiplier();
            for (let i = 0; i < count; i++) {
                this._fleetVue.sub(region, ship);
            }
        }
    }

    var MechManager = {
        _assemblyVueBinding: "mechAssembly",
        _assemblyVue: undefined,
        _listVueBinding: "mechList",
        _listVue: undefined,

        activeMechs: [],
        inactiveMechs: [],
        mechsPower: 0,
        mechsPotential: 0,
        isActive: false,
        saveSupply: false,

        stateHash: 0,
        bestSize: [],
        bestGems: [],
        bestSupply: [],
        bestMech: {},
        bestBody: {},
        bestWeapon: [],

        Size: ['small','medium','large','titan','collector'],
        Chassis: ['wheel','tread','biped','quad','spider','hover'],
        Weapon: ['laser','kinetic','shotgun','missile','flame','plasma','sonic','tesla'],
        Equip: ['special','shields','sonar','grapple','infrared','flare','radiator','coolant','ablative','stabilizer','seals'],

        SizeSlots: {small: 0, medium: 1, large: 2, titan: 4, collector: 2},
        SizeWeapons: {small: 1, medium: 1, large: 2, titan: 4, collector: 0},
        SmallChassisMod: {
            wheel:  { sand: 0.9,  swamp: 0.35, forest: 1,    jungle: 0.92, rocky: 0.65, gravel: 1,    muddy: 0.85, grass: 1.3,  brush: 0.9,  concrete: 1.1},
            tread:  { sand: 1.15, swamp: 0.55, forest: 1,    jungle: 0.95, rocky: 0.65, gravel: 1.3,  muddy: 0.88, grass: 1,    brush: 1,    concrete: 1},
            biped:  { sand: 0.78, swamp: 0.68, forest: 1,    jungle: 0.82, rocky: 0.48, gravel: 1,    muddy: 0.85, grass: 1.25, brush: 0.92, concrete: 1},
            quad:   { sand: 0.86, swamp: 0.58, forest: 1.25, jungle: 1,    rocky: 0.95, gravel: 0.9,  muddy: 0.68, grass: 1,    brush: 0.95, concrete: 1},
            spider: { sand: 0.75, swamp: 0.9,  forest: 0.82, jungle: 0.77, rocky: 1.25, gravel: 0.86, muddy: 0.92, grass: 1,    brush: 1,    concrete: 1},
            hover:  { sand: 1,    swamp: 1.35, forest: 0.65, jungle: 0.55, rocky: 0.82, gravel: 1,    muddy: 1.15, grass: 1,    brush: 0.78, concrete: 1}
        },
        LargeChassisMod: {
            wheel:  { sand: 0.85, swamp: 0.18, forest: 1,    jungle: 0.85, rocky: 0.5,  gravel: 0.95, muddy: 0.58, grass: 1.2,  brush: 0.8,  concrete: 1},
            tread:  { sand: 1.1,  swamp: 0.4,  forest: 0.95, jungle: 0.9,  rocky: 0.5,  gravel: 1.2,  muddy: 0.72, grass: 1,    brush: 1,    concrete: 1},
            biped:  { sand: 0.65, swamp: 0.5,  forest: 0.95, jungle: 0.7,  rocky: 0.4,  gravel: 1,    muddy: 0.7,  grass: 1.2,  brush: 0.85, concrete: 1},
            quad:   { sand: 0.75, swamp: 0.42, forest: 1.2,  jungle: 1,    rocky: 0.9,  gravel: 0.8,  muddy: 0.5,  grass: 0.95, brush: 0.9,  concrete: 1},
            spider: { sand: 0.65, swamp: 0.78, forest: 0.75, jungle: 0.65, rocky: 1.2,  gravel: 0.75, muddy: 0.82, grass: 1,    brush: 0.95, concrete: 1},
            hover:  { sand: 1,    swamp: 1.2,  forest: 0.48, jungle: 0.35, rocky: 0.68, gravel: 1,    muddy: 1.08, grass: 1,    brush: 0.7,  concrete: 1}
        },
        StatusMod: {
            freeze: (mech) => !mech.equip.includes('radiator') ? 0.25 : 1,
            hot: (mech) => !mech.equip.includes('coolant') ? 0.25 : 1,
            corrosive: (mech) => !mech.equip.includes('ablative') ? mech.equip.includes('shields') ? 0.75 : 0.25 : 1,
            humid: (mech) => !mech.equip.includes('seals') ? 0.75 : 1,
            windy: (mech) => mech.chassis === 'hover' ? 0.5 : 1,
            hilly: (mech) => mech.chassis !== 'spider' ? 0.75 : 1,
            mountain: (mech) => mech.chassis !== 'spider' && !mech.equip.includes('grapple') ? mech.equip.includes('flare') ? 0.75 : 0.5 : 1,
            radioactive: (mech) => !mech.equip.includes('shields') ? 0.5 : 1,
            quake: (mech) => !mech.equip.includes('stabilizer') ? 0.25 : 1,
            dust: (mech) => !mech.equip.includes('seals') ? 0.5 : 1,
            river: (mech) => mech.chassis !== 'hover' ? 0.65 : 1,
            tar: (mech) => mech.chassis !== 'quad' ? mech.chassis === 'tread' || mech.chassis === 'wheel' ? 0.5 : 0.75 : 1,
            steam: (mech) => !mech.equip.includes('shields') ? 0.75 : 1,
            flooded: (mech) => mech.chassis !== 'hover' ? 0.35 : 1,
            fog: (mech) => !mech.equip.includes('sonar') ? 0.2 : 1,
            rain: (mech) => !mech.equip.includes('seals') ? 0.75 : 1,
            hail: (mech) => !mech.equip.includes('ablative') && !mech.equip.includes('shields') ? 0.75 : 1,
            chasm: (mech) => !mech.equip.includes('grapple') ? 0.1 : 1,
            dark: (mech) => !mech.equip.includes('infrared') ? mech.equip.includes('flare') ? 0.25 : 0.1 : 1,
            gravity: (mech) => mech.size === 'titan' ? 0.25 : mech.size === 'large' ? 0.45 : mech.size === 'medium' ? 0.8 : 1,
        },

        get collectorValue() {
            // Collectors power mod. Higher number - more often they'll be scrapped. Default value derieved from scout: 20000 = collectorBaseIncome / (scoutPower / scoutSize), to equalize relative values of collectors and combat mechs with same efficiency.
            return 20000 / Math.max(settings.mechCollectorValue, 0.000001);
        },

        mechObserver: new MutationObserver(() => {
            updateDebugData(); // Observer can be can be called at any time, make sure we have actual data
            createMechInfo();
        }),

        updateSpire() {
            let oldHash = this.stateHash;
            this.stateHash = 0
              + game.global.portal.spire.count
              + game.global.blood.prepared
              + game.global.blood.wrath
              + game.global.portal.mechbay.scouts * 1e7
              + (settings.mechSpecial ? 1e14 : 0)
              + (settings.mechInfernalCollector ? 1e15 : 0);

              return this.stateHash !== oldHash;
        },

        initLab() {
            if (buildings.SpireMechBay.count < 1) {
                return false;
            }
            this._assemblyVue = getVueById(this._assemblyVueBinding);
            if (this._assemblyVue === undefined) {
                return false;
            }
            this._listVue = getVueById(this._listVueBinding);
            if (this._listVue === undefined) {
                return false;
            }

            this.activeMechs = [];
            this.inactiveMechs = [];
            this.mechsPower = 0;

            let mechBay = game.global.portal.mechbay;
            for (let i = 0; i < mechBay.mechs.length; i++) {
                let mech = {id: i, ...mechBay.mechs[i], ...this.getMechStats(mechBay.mechs[i])};
                if (i < mechBay.active) {
                    this.activeMechs.push(mech);
                    if (mech.size !== 'collector') {
                        this.mechsPower += mech.power;
                    }
                } else {
                    this.inactiveMechs.push(mech);
                }
            }

            if (this.updateSpire()) {
                this.isActive = true;

                this.updateBestWeapon();
                this.Size.forEach(size => {
                    this.updateBestBody(size);
                    this.bestMech[size] = this.getRandomMech(size);
                });
                let sortBy = (prop) => Object.values(this.bestMech)
                  .filter(m => m.size !== 'collector')
                  .sort((a, b) => b[prop] - a[prop])
                  .map(m => m.size);

                this.bestSize = sortBy('efficiency');
                this.bestGems = sortBy('gems_eff');
                this.bestSupply = sortBy('supply_eff');

                // Redraw added label of Mech Lab after change of floor
                createMechInfo();
            }

            let bestMech = this.bestMech[this.bestSize[0]];
            this.mechsPotential = this.mechsPower / (buildings.SpireMechBay.count * 25 / this.getMechSpace(bestMech) * bestMech.power) || 0;

            return true;
        },

        getBodyMod(mech) {
            let floor = game.global.portal.spire;
            let terrainFactor = mech.size === 'small' || mech.size === 'medium' ?
                this.SmallChassisMod[mech.chassis][floor.type]:
                this.LargeChassisMod[mech.chassis][floor.type];

            let rating = poly.terrainRating(mech, terrainFactor, Object.keys(floor.status));
            for (let effect in floor.status) {
                rating *= this.StatusMod[effect](mech);
            }
            return rating;
        },

        getWeaponMod(mech) {
            let weapons = poly.monsters[game.global.portal.spire.boss].weapon;
            let rating = 0;
            for (let i = 0; i < mech.hardpoint.length; i++){
                rating += poly.weaponPower(mech, weapons[mech.hardpoint[i]]);
            }
            return rating;
        },

        getSizeMod(mech, concrete) {
            let isConcrete = concrete ?? game.global.portal.spire.type === 'concrete';
            switch (mech.size){
                case 'small':
                    return 0.0025 * (isConcrete ? 0.92 : 1);
                case 'medium':
                    return 0.0075 * (isConcrete ? 0.95 : 1);
                case 'large':
                    return 0.01;
                case 'titan':
                    return 0.012 * (isConcrete ? 1.25 : 1);
                case 'collector': // For collectors we're calculating supply rate
                    return 25 / this.collectorValue;
            }
            return 0;
        },

        getProgressMod() {
            let mod = 1;
            if (game.global.stats.achieve.gladiator?.l > 0) {
                mod *= 1 + game.global.stats.achieve.gladiator.l * 0.2;
            }
            if (game.global.blood['wrath']){
                mod *= 1 + (game.global.blood.wrath / 20);
            }
            mod /= game.global.portal.spire.count;

            return mod;
        },

        getPreferredSize() {
            let mechBay = game.global.portal.mechbay;
            if (settings.mechFillBay && mechBay.max % 1 === 0 && (game.global.blood.prepared >= 2 ? mechBay.bay % 2 !== mechBay.max % 2 : mechBay.max - mechBay.bay === 1)) {
                return ['collector', true]; // One collector to fill odd bay
            }

            if (resources.Supply.storageRatio < 0.9 && resources.Supply.rateOfChange < settings.mechMinSupply) {
                let collectorsCount = this.activeMechs.filter(mech => mech.size === 'collector').length;
                if (collectorsCount / mechBay.max < settings.mechMaxCollectors) {
                    return ['collector', true]; // Bootstrap income
                }
            }

            if (mechBay.scouts * 2 / mechBay.max < settings.mechScouts) {
                return ['small', true]; // Build scouts up to configured ratio
            }

            let floorSize = game.global.portal.spire.status.gravity ? settings.mechSizeGravity : settings.mechSize;
            if (this.Size.includes(floorSize) && (!settings.mechFillBay || poly.mechCost(floorSize).c <= resources.Supply.maxQuantity)) {
                return [floorSize, false]; // This floor have configured size
            }
            let mechPriority = floorSize === "gems" ? this.bestGems :
                               floorSize === "supply" ? this.bestSupply :
                               this.bestSize;

            for (let i = 0; i < mechPriority.length; i++) {
                let mechSize = mechPriority[i];
                let {s, c} = poly.mechCost(mechSize);
                if (resources.Soul_Gem.spareQuantity >= s && resources.Supply.maxQuantity >= c) {
                    return [mechSize, false]; // Affordable mech for auto size
                }
            }

            return ['titan', false]; // Just a stub, if auto size couldn't pick anything
        },

        getMechStats(mech) {
            let rating = this.getBodyMod(mech);
            if (mech.size !== 'collector') { // Collectors doesn't have weapons
                rating *= this.getWeaponMod(mech);
            }
            let power = rating * this.getSizeMod(mech) * (mech.infernal ? 1.25 : 1);
            let [gem, supply, space] = this.getMechCost(mech);
            let [gemRef, supplyRef] = this.getMechRefund(mech);
            return {power: power, efficiency: power / space, gems_eff: power / (gem - gemRef), supply_eff: power / (supply - supplyRef)};
        },

        getTimeToClear() {
            return this.mechsPower > 0 ? (100 - game.global.portal.spire.progress) / (this.mechsPower * this.getProgressMod()) : Number.MAX_SAFE_INTEGER;
        },

        updateBestBody(size) {
            let currentBestBodyMod = 0;
            let currentBestBodyList = [];

            let equipmentSlots = this.SizeSlots[size] + (game.global.blood.prepared ? 1 : 0) - (settings.mechSpecial === "always" ? 1 : 0);
            let equipOptions = settings.mechSpecial === "always" || settings.mechSpecial === "never" ? this.Equip.slice(1) : this.Equip;
            let infernal = settings.mechInfernalCollector && size === 'collector' && game.global.blood.prepared >= 3;

            k_combinations(equipOptions, equipmentSlots).forEach((equip) => {
                this.Chassis.forEach(chassis => {
                    let mech = {size: size, chassis: chassis, equip: equip, infernal: infernal};
                    let mechMod = this.getBodyMod(mech);
                    if (mechMod > currentBestBodyMod) {
                        currentBestBodyMod = mechMod;
                        currentBestBodyList = [mech];
                    } else if (mechMod === currentBestBodyMod) {
                        currentBestBodyList.push(mech);
                    }
                });
            });

            if (settings.mechSpecial === "always" && equipmentSlots >= 0) {
                currentBestBodyList.forEach(mech => mech.equip.unshift('special'));
            }
            if (settings.mechSpecial === "prefered") {
                let specialEquip = currentBestBodyList.filter(mech => mech.equip.includes("special"));
                if (specialEquip.length > 0) {
                    currentBestBodyList = specialEquip;
                }
            }
            /* TODO: Not really sure how to utilize it for good: it does find good and bad mech compositions, but using only good ones can backfire on some floors, and there won't big enough amount of mech to use weighted random
            currentBestBodyList.forEach(mech => {
                mech.weigthing = Object.values(this.StatusMod)
                  .reduce((sum, mod) => sum + mod(mech), 0);
            });
            */
            this.bestBody[size] = currentBestBodyList;
        },

        updateBestWeapon() {
            let bestMod = 0;
            let list = poly.monsters[game.global.portal.spire.boss].weapon;
            for (let weapon in list) {
                let mod = list[weapon];
                if (mod > bestMod) {
                    bestMod = mod;
                    this.bestWeapon = [weapon];
                } else if (mod === bestMod) {
                    this.bestWeapon.push(weapon);
                }
            }
        },

        getRandomMech(size) {
            let randomBody = this.bestBody[size][Math.floor(Math.random() * this.bestBody[size].length)];
            let randomWeapon = this.bestWeapon[Math.floor(Math.random() * this.bestWeapon.length)];
            let weaponsAmount = this.SizeWeapons[size];
            let mech = {hardpoint: new Array(weaponsAmount).fill(randomWeapon), ...randomBody};
            return {...mech, ...this.getMechStats(mech)};
        },

        getMechSpace(mech, prep) {
            switch (mech.size){
                case 'small':
                    return 2;
                case 'medium':
                    return (prep ?? game.global.blood.prepared) >= 2 ? 4 : 5;
                case 'large':
                    return (prep ?? game.global.blood.prepared) >= 2 ? 8 : 10;
                case 'titan':
                    return (prep ?? game.global.blood.prepared) >= 2 ? 20 : 25;
                case 'collector':
                    return 1;
            }
            return Number.MAX_SAFE_INTEGER;
        },

        getMechCost(mech, prep) {
            let {s, c} = poly.mechCost(mech.size, mech.infernal, prep);
            return [s, c, this.getMechSpace(mech, prep)];
        },

        getMechRefund(mech, prep) {
            let {s, c} = poly.mechCost(mech.size, mech.infernal, prep);
            return [Math.floor(s / 2), Math.floor(c / 3)];
        },

        mechDesc(mech) {
            // (${mech.hardpoint.map(id => game.loc("portal_mech_weapon_" + id)).join(", ")}) [${mech.equip.map(id => game.loc("portal_mech_equip_" + id)).join(", ")}]
            let rating = mech.power / this.bestMech[mech.size].power;
            return `${game.loc("portal_mech_size_" + mech.size)} ${game.loc("portal_mech_chassis_" + mech.chassis)} (${Math.round(rating * 100)}%)`;
        },

        buildMech(mech) {
            this._assemblyVue.b.infernal = mech.infernal;
            this._assemblyVue.setSize(mech.size);
            this._assemblyVue.setType(mech.chassis);
            for (let i = 0; i < mech.hardpoint.length; i++) {
                this._assemblyVue.setWep(mech.hardpoint[i], i);
            }
            for (let i = 0; i < mech.equip.length; i++) {
                this._assemblyVue.setEquip(mech.equip[i], i);
            }
            this._assemblyVue.build();
            GameLog.logSuccess("mech_build", `${this.mechDesc(mech)} 机甲已建造。`, ['hell']);
        },

        scrapMech(mech) {
            this._listVue.scrap(mech.id);
        },

        dragMech(oldId, newId) {
            if (typeof unsafeWindow !== 'undefined') { // Yet another FF fix
                win.Sortable.get(this._listVue.$el).options.onEnd(cloneInto({oldDraggableIndex: oldId, newDraggableIndex: newId, from: {querySelectorAll: () => [], insertBefore: () => false}}, unsafeWindow, {cloneFunctions: true}));
            } else {
                Sortable.get(this._listVue.$el).options.onEnd({oldDraggableIndex: oldId, newDraggableIndex: newId, from: {querySelectorAll: () => [], insertBefore: () => false}});
            }
        }
    }

    var JobManager = {
        priorityList: [],
        craftingJobs: [],

        isUnlocked() {
            return jobs.Unemployed.isUnlocked();
        },

        addCraftingJob(job) {
            this.craftingJobs.push(job);
        },

        sortByPriority() {
            this.priorityList.sort((a, b) => a.priority - b.priority);
        },

        managedPriorityList() {
            return this.priorityList.filter(job => job.isManaged() && (!(job instanceof CraftingJob) || settings.autoCraftsmen));
        },

        isFoundryUnlocked() {
            let containerNode = document.getElementById("foundry");
            return containerNode !== null && containerNode.style.display !== "none" && containerNode.children.length > 0 && this.maxCraftsmen() > 0;
        },

        maxCraftsmen() {
            return game.global.civic.craftsman.max;
        },

        craftingMax() {
            if (!this.isFoundryUnlocked()) {
                return 0;
            }

            let max = this.maxCraftsmen();
            for (let i = 0; i < this.craftingJobs.length; i++) {
                const job = this.craftingJobs[i];

                if (!settings['craft' + job.resource.id] || !job.isManaged()) {
                    max -= job.count;
                }
            }
            max -= game.global.city.foundry?.Thermite ?? 0;
            return max;
        }
    }

    var BuildingManager = {
        priorityList: [],
        statePriorityList: [],

        updateBuildings() {
            for (let i = 0; i < this.priorityList.length; i++){
                let building = this.priorityList[i];
                building.updateResourceRequirements();
                building.extraDescription = "";
            }
        },

        updateWeighting() {
             // Check generic conditions, and multiplier - x1 have no effect, so skip them too.
            let activeRules = weightingRules.filter(rule => rule[wrGlobalCondition]() && rule[wrMultiplier]() !== 1);

            // Iterate over buildings
            for (let i = 0; i < this.priorityList.length; i++){
                let building = this.priorityList[i];
                building.weighting = building._weighting;

                // Apply weighting rules
                for (let j = 0; j < activeRules.length; j++) {
                    let result = activeRules[j][wrIndividualCondition](building);
                    // Rule passed
                    if (result) {
                        let note = activeRules[j][wrDescription](result, building);
                        if (note !== "") {
                            building.extraDescription += note + "<br>";
                        }
                        building.weighting *= activeRules[j][wrMultiplier](result);


                        // Last rule disabled building, no need to check the rest
                        if (building.weighting <= 0) {
                            break;
                        }
                    }
                }
                if (building.weighting > 0) {
                    building.weighting = Math.max(Number.MIN_VALUE, building.weighting - 1e-7 * building.count);
                    building.extraDescription = "自动建造权重：" + getNiceNumber(building.weighting) + "<br>" + building.extraDescription;
                }
            }
        },

        sortByPriority() {
            this.priorityList.sort((a, b) => a.priority - b.priority);
            this.statePriorityList.sort((a, b) => a.priority - b.priority);
        },

        managedPriorityList() {
            return this.priorityList.filter(building => building.weighting > 0);
        },

        managedStatePriorityList() {
            return this.statePriorityList.filter(building => (building.hasState() && building.autoStateEnabled));
        }
    }

    var ProjectManager = {
        priorityList: [],

        updateProjects() {
            for (let i = 0; i < this.priorityList.length; i++){
                let project = this.priorityList[i];
                project.updateResourceRequirements();
                project.extraDescription = "";
            }
        },

        updateWeighting() {
            // Iterate over projects
            for (let i = 0; i < this.priorityList.length; i++){
                let project = this.priorityList[i];
                project.weighting = project._weighting * project.currentStep;

                if (!project.isUnlocked()) {
                    project.weighting = 0;
                    project.extraDescription = "未解锁<br>";
                }
                if (!project.autoBuildEnabled || !settings.autoARPA) {
                    project.weighting = 0;
                    project.extraDescription = "未启用自动建造<br>";
                }
                if (project.count >= project.autoMax && (project !== projects.ManaSyphon || settings.prestigeType !== 'vacuum')) {
                    project.weighting = 0;
                    project.extraDescription = "已达建造上限<br>";
                }
                if (settings.prestigeMADIgnoreArpa && !haveTech("mad") && !haveTech("rival") && !game.global.race['cataclysm']) {
                    project.weighting = 0;
                    project.extraDescription = "核爆重置阶段之前忽略项目<br>";
                }
                if (state.queuedTargets.includes(project)) {
                    project.weighting = 0;
                    project.extraDescription = "处理建筑队列中的项目……<br>";
                }
                if (state.triggerTargets.includes(project)) {
                    project.weighting = 0;
                    project.extraDescription = "处理触发器中的项目……<br>";
                }

                if (settings.arpaScaleWeighting) {
                    project.weighting /= 1 - (0.01 * project.progress);
                }
                if (project.weighting > 0) {
                    project.extraDescription = `自动ARPA权重：${getNiceNumber(project.weighting)} (${project.currentStep}%)<br>${project.extraDescription}`;
                }
            }
        },

        sortByPriority() {
            this.priorityList.sort((a, b) => a.priority - b.priority);
        },

        managedPriorityList() {
            return this.priorityList.filter(project => project.weighting > 0);
        }
    }

    var TriggerManager = {
        priorityList: [],
        targetTriggers: [],

        resetTargetTriggers() {
            this.targetTriggers = [];
            for (let i = 0; i < this.priorityList.length; i++) {
                let trigger = this.priorityList[i];
                trigger.updateComplete();
                if ((settings.autoResearch || trigger.actionType !== "research") && (settings.autoBuild || trigger.actionType !== "build") && !trigger.complete && trigger.areRequirementsMet() && trigger.isActionPossible() && !this.actionConflicts(trigger)) {
                    this.targetTriggers.push(trigger);
                }
            }
        },

        getTrigger(seq) {
            return this.priorityList.find(trigger => trigger.seq === seq);
        },

        sortByPriority() {
            this.priorityList.sort((a, b) => a.priority - b.priority);
        },

        AddTrigger(requirementType, requirementId, requirementCount, actionType, actionId, actionCount) {
            let trigger = new Trigger(this.priorityList.length, this.priorityList.length, requirementType, requirementId, requirementCount, actionType, actionId, actionCount);
            this.priorityList.push(trigger);
            return trigger;
        },

        AddTriggerFromSetting(raw) {
            let existingSequence = this.priorityList.some(trigger => trigger.seq === raw.seq);
            if (!existingSequence) {
                let trigger = new Trigger(raw.seq, raw.priority, raw.requirementType, raw.requirementId, raw.requirementCount, raw.actionType, raw.actionId, raw.actionCount);
                this.priorityList.push(trigger);
            }
        },

        RemoveTrigger(seq) {
            let indexToRemove = this.priorityList.findIndex(trigger => trigger.seq === seq);

            if (indexToRemove === -1) {
                return;
            }

            this.priorityList.splice(indexToRemove, 1);

            for (let i = 0; i < this.priorityList.length; i++) {
                let trigger = this.priorityList[i];
                trigger.seq = i;
            }
        },

        // This function only checks if two triggers use the same resource, it does not check storage
        actionConflicts(trigger) {
            for (let i = 0; i < this.targetTriggers.length; i++) {
                let targetTrigger = this.targetTriggers[i];

                if (Object.keys(targetTrigger.cost()).some(cost => Object.keys(trigger.cost()).includes(cost))) {
                    return true;
                }
            }

            return false;
        },
    }

    var WindowManager = {
        openedByScript: false,
        _callbackWindowTitle: "",
        _callbackFunction: null,

        currentModalWindowTitle() {
            let modalTitleNode = document.getElementById("modalBoxTitle");
            if (modalTitleNode === null) {
                return "";
            }

            // Modal title will either be a single name or a combination of resource and storage
            // eg. single name "Smelter" or "Factory"
            // eg. combination "Iridium - 26.4K/279.9K"
            let indexOfDash = modalTitleNode.textContent.indexOf(" - ");
            if (indexOfDash === -1) {
                return modalTitleNode.textContent;
            } else {
                return modalTitleNode.textContent.substring(0, indexOfDash);
            }
        },

        openModalWindowWithCallback(elementToClick, callbackWindowTitle, callbackFunction) {
            if (this.isOpen()) {
                return;
            }

            this.openedByScript = true;
            this._callbackWindowTitle = callbackWindowTitle;
            this._callbackFunction = callbackFunction;
            elementToClick.click()
        },

        isOpen() {
            // Checks both the game modal window and our script modal window
            // game = modalBox
            // script = scriptModal
            return this.openedByScript || document.getElementById("modalBox") !== null || document.getElementById("scriptModal")?.style.display === "block";
        },

        checkCallbacks() {
            // We only care if the script itself opened the modal. If the user did it then ignore it.
            // There must be a call back function otherwise there is nothing to do.
            if (WindowManager.currentModalWindowTitle() === WindowManager._callbackWindowTitle &&
                    WindowManager.openedByScript && WindowManager._callbackFunction) {

                WindowManager._callbackFunction();

                let modalCloseBtn = document.querySelector('.modal .modal-close');
                if (modalCloseBtn !== null) {
                    modalCloseBtn.click();
                }
            } else {
                // If we hid users's modal - show it back
                let modal = document.querySelector('.modal');
                if (modal !== null) {
                    modal.style.display = "";
                }
            }

            WindowManager.openedByScript = false;
            WindowManager._callbackWindowTitle = "";
            WindowManager._callbackFunction = null;
        }
    }

    var GameLog = {
        Types: {
            special: "特殊",
            construction: "建造",
            multi_construction: "分项工程",
            arpa: "ARPA项目",
            research: "研究",
            spying: "间谍",
            attack: "进攻",
            mercenary: "雇佣兵",
            mech_build: "制造机甲",
            mech_scrap: "解体机甲",
            outer_fleet: "智械黎明舰队"
        },

        logSuccess(loggingType, text, tags) {
            if (!settings.logEnabled || !settings["log_" + loggingType]) {
                return;
            }

            poly.messageQueue(text, "success", false, tags);
        },

        logWarning(loggingType, text, tags) {
            if (!settings.logEnabled || !settings["log_" + loggingType]) {
                return;
            }

            poly.messageQueue(text, "warning", false, tags);
        },

        logDanger(loggingType, text, tags) {
            if (!settings.logEnabled || !settings["log_" + loggingType]) {
                return;
            }

            poly.messageQueue(text, "danger", false, tags);
        },
    }

    function updateCraftCost() {
        if (state.lastWasteful === game.global.race.wasteful) {
            return;
        }
        // Construct craftable resource list
        craftablesList = [];
        foundryList = [];
        for (let [name, costs] of Object.entries(game.craftCost)) {
            if (resources[name]) { // Ignore resources missed in script
                resources[name].cost = {};
                for (let i = 0; i < costs.length; i++) {
                    resources[name].cost[costs[i].r] = costs[i].a;
                }
                craftablesList.push(resources[name]);
                if (name !== "Scarletite" && name !== "Quantium") {
                    foundryList.push(resources[name]);
                }
            }
        }
        state.lastWasteful = game.global.race.wasteful;
    }

    // Gui & Init functions
    function initialiseState() {
        updateCraftCost();
        updateTabs();

        // Lets set our crate / container resource requirements
        Object.defineProperty(resources.Crates, "cost", {get: () => isLumberRace() ? {Plywood: 10} : {Stone: 200}});
        resources.Containers.cost["Steel"] = 125;

        JobManager.addCraftingJob(jobs.Quantium); // Non-foundry should be on top
        JobManager.addCraftingJob(jobs.Scarletite);
        JobManager.addCraftingJob(jobs.Plywood);
        JobManager.addCraftingJob(jobs.Brick);
        JobManager.addCraftingJob(jobs.WroughtIron);
        JobManager.addCraftingJob(jobs.SheetMetal);
        JobManager.addCraftingJob(jobs.Mythril);
        JobManager.addCraftingJob(jobs.Aerogel);
        JobManager.addCraftingJob(jobs.Nanoweave);

        // Construct city builds list
        //buildings.SacrificialAltar.gameMax = 1; // Although it is technically limited to single altar, we don't care about that, as we're going to click it to make sacrifices
        buildings.GasSpaceDock.gameMax = 1;
        buildings.DwarfWorldController.gameMax = 1;
        buildings.GasSpaceDockShipSegment.gameMax = 100;
        buildings.ProximaDyson.gameMax = 100;
        buildings.BlackholeStellarEngine.gameMax = 100;
        buildings.DwarfWorldCollider.gameMax = 1859;
        buildings.DwarfShipyard.gameMax = 1;
        buildings.DwarfMassRelayComplete.gameMax = 1;
        buildings.TitanAIComplete.gameMax = 1;
        buildings.TritonFOB.gameMax = 1;

        buildings.ProximaDysonSphere.gameMax = 100;
        buildings.ProximaOrichalcumSphere.gameMax = 100;
        buildings.BlackholeStargate.gameMax = 200;
        buildings.BlackholeStargateComplete.gameMax = 1;
        buildings.SiriusSpaceElevator.gameMax = 100;
        buildings.SiriusGravityDome.gameMax = 100;
        buildings.SiriusAscensionMachine.gameMax = 100;
        buildings.SiriusAscensionTrigger.gameMax = 1;
        buildings.SiriusAscend.gameMax = 1;
        buildings.PitSoulForge.gameMax = 1;
        buildings.GateEastTower.gameMax = 1;
        buildings.GateWestTower.gameMax = 1;
        buildings.RuinsVault.gameMax = 2;
        buildings.SpireBridge.gameMax = 10;
        buildings.GorddonEmbassy.gameMax = 1;
        buildings.Alien1Consulate.gameMax = 1;
        projects.LaunchFacility.gameMax = 1;
        projects.ManaSyphon.gameMax = 80;

        buildings.CoalPower.addResourceConsumption(() => game.global.race.universe === "magic" ? resources.Mana : resources.Coal, () => game.global.race['environmentalist'] ? 0 : game.global.race.universe === "magic" ? 0.05 : 0.65);
        buildings.OilPower.addResourceConsumption(resources.Oil, () => game.global.race['environmentalist'] ? 0 : 0.65);
        buildings.FissionPower.addResourceConsumption(resources.Uranium, 0.1);
        buildings.TouristCenter.addResourceConsumption(resources.Food, 50);

        // Construct space buildings list
        buildings.SpaceNavBeacon.addResourceConsumption(resources.Moon_Support, -1);
        buildings.SpaceNavBeacon.addResourceConsumption(resources.Red_Support, () => haveTech("luna", 3) ? -1 : 0);
        buildings.MoonBase.addResourceConsumption(resources.Moon_Support, -2);
        buildings.MoonBase.addResourceConsumption(resources.Oil, 2);
        buildings.MoonIridiumMine.addResourceConsumption(resources.Moon_Support, 1);
        buildings.MoonHeliumMine.addResourceConsumption(resources.Moon_Support, 1);
        buildings.MoonObservatory.addResourceConsumption(resources.Moon_Support, 1);
        buildings.RedSpaceport.addResourceConsumption(resources.Red_Support, () => game.actions.space.spc_red.spaceport.support() * -1);
        buildings.RedSpaceport.addResourceConsumption(resources.Helium_3, 1.25);
        buildings.RedSpaceport.addResourceConsumption(resources.Food, () => game.global.race['cataclysm'] ? 2 : 25);
        buildings.RedTower.addResourceConsumption(resources.Red_Support, () => game.global.race['cataclysm'] ? -2 : -1);
        buildings.RedLivingQuarters.addResourceConsumption(resources.Red_Support, 1);
        buildings.RedMine.addResourceConsumption(resources.Red_Support, 1);
        buildings.RedFabrication.addResourceConsumption(resources.Red_Support, 1);
        buildings.RedFactory.addResourceConsumption(resources.Helium_3, 1);
        buildings.RedBiodome.addResourceConsumption(resources.Red_Support, 1);
        buildings.RedExoticLab.addResourceConsumption(resources.Red_Support, 1);
        buildings.RedSpaceBarracks.addResourceConsumption(resources.Oil, 2);
        buildings.RedSpaceBarracks.addResourceConsumption(resources.Food, () => game.global.race['cataclysm'] ? 0 : 10);
        buildings.RedVrCenter.addResourceConsumption(resources.Red_Support, 1);
        buildings.HellGeothermal.addResourceConsumption(resources.Helium_3, 0.5);
        buildings.SunSwarmControl.addResourceConsumption(resources.Sun_Support, () => game.actions.space.spc_sun.swarm_control.support() * -1);
        buildings.SunSwarmSatellite.addResourceConsumption(resources.Sun_Support, 1);
        buildings.GasMoonOutpost.addResourceConsumption(resources.Oil, 2);
        buildings.BeltSpaceStation.addResourceConsumption(resources.Belt_Support, -3);
        buildings.BeltSpaceStation.addResourceConsumption(resources.Food, () => game.global.race['cataclysm'] ? 1 : 10);
        buildings.BeltSpaceStation.addResourceConsumption(resources.Helium_3, 2.5);
        buildings.BeltEleriumShip.addResourceConsumption(resources.Belt_Support, 2);
        buildings.BeltIridiumShip.addResourceConsumption(resources.Belt_Support, 1);
        buildings.BeltIronShip.addResourceConsumption(resources.Belt_Support, 1);
        buildings.DwarfEleriumReactor.addResourceConsumption(resources.Elerium, 0.05);

        buildings.AlphaStarport.addResourceConsumption(resources.Alpha_Support, -5);
        buildings.AlphaStarport.addResourceConsumption(resources.Food, 100);
        buildings.AlphaStarport.addResourceConsumption(resources.Helium_3, 5);
        buildings.AlphaHabitat.addResourceConsumption(resources.Alpha_Support, -1);
        buildings.AlphaMiningDroid.addResourceConsumption(resources.Alpha_Support, 1);
        buildings.AlphaProcessing.addResourceConsumption(resources.Alpha_Support, 1);
        buildings.AlphaFusion.addResourceConsumption(resources.Alpha_Support, 1);
        buildings.AlphaFusion.addResourceConsumption(resources.Deuterium, 1.25);
        buildings.AlphaLaboratory.addResourceConsumption(resources.Alpha_Support, 1);
        buildings.AlphaExchange.addResourceConsumption(resources.Alpha_Support, 1);
        buildings.AlphaGraphenePlant.addResourceConsumption(resources.Alpha_Support, 1);
        buildings.AlphaExoticZoo.addResourceConsumption(resources.Alpha_Support, 1);
        buildings.AlphaExoticZoo.addResourceConsumption(resources.Food, 12000);
        buildings.AlphaMegaFactory.addResourceConsumption(resources.Deuterium, 5);

        buildings.ProximaTransferStation.addResourceConsumption(resources.Alpha_Support, -1);
        buildings.ProximaTransferStation.addResourceConsumption(resources.Uranium, 0.28);
        buildings.ProximaCruiser.addResourceConsumption(resources.Helium_3, 6);

        buildings.NebulaNexus.addResourceConsumption(resources.Nebula_Support, -2);
        buildings.NebulaHarvester.addResourceConsumption(resources.Nebula_Support, 1);
        buildings.NebulaEleriumProspector.addResourceConsumption(resources.Nebula_Support, 1);

        buildings.NeutronMiner.addResourceConsumption(resources.Helium_3, 3);

        buildings.GatewayStarbase.addResourceConsumption(resources.Gateway_Support, -2);
        buildings.GatewayStarbase.addResourceConsumption(resources.Helium_3, 25);
        buildings.GatewayStarbase.addResourceConsumption(resources.Food, 250);
        buildings.GatewayShipDock.addResourceConsumption(resources.Gateway_Support, () => buildings.GatewayStarbase.stateOnCount * -0.25);

        buildings.BologniumShip.addResourceConsumption(resources.Gateway_Support, 1);
        buildings.BologniumShip.addResourceConsumption(resources.Helium_3, 5);
        buildings.ScoutShip.addResourceConsumption(resources.Gateway_Support, 1);
        buildings.ScoutShip.addResourceConsumption(resources.Helium_3, 6);
        buildings.CorvetteShip.addResourceConsumption(resources.Gateway_Support, 1);
        buildings.CorvetteShip.addResourceConsumption(resources.Helium_3, 10);
        buildings.FrigateShip.addResourceConsumption(resources.Gateway_Support, 2);
        buildings.FrigateShip.addResourceConsumption(resources.Helium_3, 25);
        buildings.CruiserShip.addResourceConsumption(resources.Gateway_Support, 3);
        buildings.CruiserShip.addResourceConsumption(resources.Deuterium, 25);
        buildings.Dreadnought.addResourceConsumption(resources.Gateway_Support, 5);
        buildings.Dreadnought.addResourceConsumption(resources.Deuterium, 80);

        buildings.StargateStation.addResourceConsumption(resources.Gateway_Support, -0.5);
        buildings.StargateTelemetryBeacon.addResourceConsumption(resources.Gateway_Support, -0.75);

        buildings.GorddonEmbassy.addResourceConsumption(resources.Food, 7500);
        buildings.GorddonFreighter.addResourceConsumption(resources.Helium_3, 12);

        buildings.Alien1VitreloyPlant.addResourceConsumption(resources.Bolognium, 2.5);
        buildings.Alien1VitreloyPlant.addResourceConsumption(resources.Stanene, 1000);
        buildings.Alien1VitreloyPlant.addResourceConsumption(resources.Money, 50000);
        buildings.Alien1SuperFreighter.addResourceConsumption(resources.Helium_3, 25);

        buildings.Alien2Foothold.addResourceConsumption(resources.Alien_Support, -4);
        buildings.Alien2Foothold.addResourceConsumption(resources.Elerium, 2.5);
        buildings.Alien2ArmedMiner.addResourceConsumption(resources.Alien_Support, 1);
        buildings.Alien2ArmedMiner.addResourceConsumption(resources.Helium_3, 10);
        buildings.Alien2OreProcessor.addResourceConsumption(resources.Alien_Support, 1);
        buildings.Alien2Scavenger.addResourceConsumption(resources.Alien_Support, 1);
        buildings.Alien2Scavenger.addResourceConsumption(resources.Helium_3, 12);

        buildings.ChthonianMineLayer.addResourceConsumption(resources.Helium_3, 8);
        buildings.ChthonianRaider.addResourceConsumption(resources.Helium_3, 18);

        buildings.RuinsInfernoPower.addResourceConsumption(resources.Infernite, 5);
        buildings.RuinsInfernoPower.addResourceConsumption(resources.Coal, 100);
        buildings.RuinsInfernoPower.addResourceConsumption(resources.Oil, 80);

        buildings.LakeHarbour.addResourceConsumption(resources.Lake_Support, -1);
        buildings.LakeBireme.addResourceConsumption(resources.Lake_Support, 1);
        buildings.LakeTransport.addResourceConsumption(resources.Lake_Support, 1);

        buildings.SpirePurifier.addResourceConsumption(resources.Spire_Support, () => haveTech("b_stone", 3) ? -1.25 : -1);
        buildings.SpirePort.addResourceConsumption(resources.Spire_Support, 1);
        buildings.SpireBaseCamp.addResourceConsumption(resources.Spire_Support, 1);
        buildings.SpireMechBay.addResourceConsumption(resources.Spire_Support, 1);

        buildings.TitanSpaceport.addResourceConsumption(resources.Enceladus_Support, -2);
        buildings.TitanElectrolysis.addResourceConsumption(resources.Titan_Support, () => haveTech("titan_ai_core", 2) && buildings.TitanAIComplete.stateOnCount > 0 ? -3 : -2);

        buildings.TitanElectrolysis.addResourceConsumption(resources.Water, 35);
        buildings.TitanElectrolysis.addResourceConsumption(resources.Electrolysis_Support, -1);
        buildings.TitanHydrogen.addResourceConsumption(resources.Titan_Support, -2);
        buildings.TitanHydrogen.addResourceConsumption(resources.Electrolysis_Support, 1);
        buildings.TitanQuarters.addResourceConsumption(resources.Titan_Support, 1);
        buildings.TitanQuarters.addResourceConsumption(resources.Water, 12);
        buildings.TitanQuarters.addResourceConsumption(resources.Food, 500);
        buildings.TitanMine.addResourceConsumption(resources.Titan_Support, 1);
        buildings.TitanGraphene.addResourceConsumption(resources.Titan_Support, 1);
        buildings.TitanDecoder.addResourceConsumption(resources.Titan_Support, 1);
        buildings.TitanDecoder.addResourceConsumption(resources.Cipher, 0.06);
        buildings.TitanAIComplete.addResourceConsumption(resources.Water, 1000);

        buildings.EnceladusWaterFreighter.addResourceConsumption(resources.Enceladus_Support, 1);
        buildings.EnceladusWaterFreighter.addResourceConsumption(resources.Helium_3, 5);
        buildings.EnceladusZeroGLab.addResourceConsumption(resources.Enceladus_Support, 1);
        buildings.EnceladusBase.addResourceConsumption(resources.Enceladus_Support, 1);

        buildings.TritonFOB.addResourceConsumption(resources.Helium_3, 125);
        buildings.TritonLander.addResourceConsumption(resources.Oil, 50);

        buildings.KuiperOrichalcum.addResourceConsumption(resources.Oil, 200);
        buildings.KuiperUranium.addResourceConsumption(resources.Oil, 60);
        buildings.KuiperNeutronium.addResourceConsumption(resources.Oil, 60);
        buildings.KuiperElerium.addResourceConsumption(resources.Oil, 125);

        buildings.ErisDrone.addResourceConsumption(resources.Eris_Support, -5);
        buildings.ErisDrone.addResourceConsumption(resources.Uranium, 5);
        buildings.ErisTrooper.addResourceConsumption(resources.Eris_Support, 1);
        buildings.ErisTank.addResourceConsumption(resources.Eris_Support, 1);

        // These are buildings which are specified as powered in the actions definition game code but aren't actually powered in the main.js powered calculations
        Object.values(buildings).forEach(building => {
            if (building.powered > 0) {
                let powerId = (building._location || building._tab) + ":" + building.id;
                if (game.global.power.indexOf(powerId) === -1) {
                    building.overridePowered = 0;
                }
            }
        });
        //Object.defineProperty(buildings.Assembly, "overridePowered", {get: () => traitVal('powered', 0)});
        //Object.defineProperty(buildings.RedAssembly, "overridePowered", {get: () => traitVal('powered', 0)});
        buildings.Windmill.overridePowered = -1;
        buildings.SunSwarmSatellite.overridePowered = -0.35;
        buildings.ProximaDyson.overridePowered = -1.25;
        buildings.ProximaDysonSphere.overridePowered = -5;
        buildings.ProximaOrichalcumSphere.overridePowered = -8;
        // Numbers aren't exactly correct. That's fine - it won't mess with calculations - it's not something we can turn off and on. We just need to know that they *are* power generators, for autobuild, and that's enough for us.
        // And it doesn't includes Stellar Engine at all. It can generate some power... But only when fully built, and you don't want to build 100 levels of engine just to generate 20MW.
    }

    function initialiseRaces() {
        for (let id in game.actions.evolution) {
            evolutions[id] = new EvolutionAction("", "evolution", id, "");
        }
        let e = evolutions;

        let bilateralSymmetry = [e.bilateral_symmetry, e.multicellular, e.phagocytosis, e.sexual_reproduction];
        let mammals = [e.mammals, ...bilateralSymmetry];

        let genusEvolution = {
            aquatic: [e.sentience, e.aquatic, ...bilateralSymmetry],
            insectoid: [e.sentience, e.athropods, ...bilateralSymmetry],
            humanoid: [e.sentience, e.humanoid, ...mammals],
            giant: [e.sentience, e.gigantism, ...mammals],
            small: [e.sentience, e.dwarfism, ...mammals],
            carnivore: [e.sentience, e.carnivore, e.animalism, ...mammals],
            herbivore: [e.sentience, e.herbivore, e.animalism, ...mammals],
            //omnivore: [e.sentience, e.omnivore, e.animalism, ...mammals],
            demonic: [e.sentience, e.demonic, ...mammals],
            angelic: [e.sentience, e.celestial, ...mammals],
            fey: [e.sentience, e.fey, ...mammals],
            heat: [e.sentience, e.heat, ...mammals],
            polar: [e.sentience, e.polar, ...mammals],
            sand: [e.sentience, e.sand, ...mammals],
            avian: [e.sentience, e.endothermic, e.eggshell, ...bilateralSymmetry],
            reptilian: [e.sentience, e.ectothermic, e.eggshell, ...bilateralSymmetry],
            plant: [e.sentience, e.bryophyte, e.poikilohydric, e.multicellular, e.chloroplasts, e.sexual_reproduction],
            fungi: [e.sentience, e.bryophyte, e.spores, e.multicellular, e.chitin, e.sexual_reproduction],
            synthetic: [e.sentience, e.exterminate, e.sexual_reproduction],
        }

        for (let id in game.races) {
            // We don't care about protoplasm
            if (id === "protoplasm") {
                continue;
            }

            races[id] = new Race(id);
            // Use fungi as default Valdi genus
            let evolutionPath = id === "junker" ? genusEvolution.fungi : genusEvolution[races[id].genus];
            races[id].evolutionTree = [e.bunker, e[id], ...(evolutionPath ?? [])];
        }
    }

    function initBuildingState() {
        let priorityList = [];

        priorityList.push(buildings.Windmill);
        priorityList.push(buildings.Mill);
        priorityList.push(buildings.CoalPower);
        priorityList.push(buildings.OilPower);
        priorityList.push(buildings.FissionPower);

        priorityList.push(buildings.RuinsHellForge);
        priorityList.push(buildings.RuinsInfernoPower);

        priorityList.push(buildings.TitanElectrolysis);
        priorityList.push(buildings.TitanHydrogen);
        priorityList.push(buildings.TitanQuarters);

        priorityList.push(buildings.DwarfMassRelayComplete);
        priorityList.push(buildings.RuinsArcology);
        priorityList.push(buildings.Apartment);
        priorityList.push(buildings.Barracks);
        priorityList.push(buildings.TouristCenter);
        priorityList.push(buildings.University);
        priorityList.push(buildings.Smelter);
        priorityList.push(buildings.Temple);
        priorityList.push(buildings.OilWell);
        priorityList.push(buildings.StorageYard);
        priorityList.push(buildings.Warehouse);
        priorityList.push(buildings.Bank);
        priorityList.push(buildings.Hospital);
        priorityList.push(buildings.BootCamp);
        priorityList.push(buildings.House);
        priorityList.push(buildings.Cottage);
        priorityList.push(buildings.Farm);
        priorityList.push(buildings.Silo);
        priorityList.push(buildings.Shed);
        priorityList.push(buildings.LumberYard);
        priorityList.push(buildings.Foundry);
        priorityList.push(buildings.OilDepot);
        priorityList.push(buildings.Trade);
        priorityList.push(buildings.Amphitheatre);
        priorityList.push(buildings.Library);
        priorityList.push(buildings.Wharf);
        priorityList.push(buildings.NaniteFactory); // Deconstructor trait
        priorityList.push(buildings.RedNaniteFactory); // Deconstructor trait & Cataclysm only
        priorityList.push(buildings.Transmitter); // Artifical trait
        priorityList.push(buildings.Assembly); // Artifical trait
        priorityList.push(buildings.RedAssembly); // Artifical trait & Cataclysm only
        priorityList.push(buildings.Lodge); // Carnivore/Detritivore/Soul Eater trait
        priorityList.push(buildings.Smokehouse); // Carnivore trait
        priorityList.push(buildings.SoulWell); // Soul Eater trait
        priorityList.push(buildings.SlavePen); // Slaver trait
        priorityList.push(buildings.SlaveMarket); // Slaver trait
        priorityList.push(buildings.Graveyard); // Evil trait
        priorityList.push(buildings.Shrine); // Magnificent trait
        priorityList.push(buildings.CompostHeap); // Detritivore trait
        priorityList.push(buildings.Pylon); // Magic Universe only
        priorityList.push(buildings.RedPylon); // Magic Universe & Cataclysm only
        priorityList.push(buildings.ForgeHorseshoe); // Hooved trait
        priorityList.push(buildings.RedForgeHorseshoe); // Hooved trait
        priorityList.push(buildings.SacrificialAltar); // Cannibalize trait
        priorityList.push(buildings.MeditationChamber); // Calm trait

        priorityList.push(buildings.DwarfMission);
        priorityList.push(buildings.DwarfEleriumReactor);
        priorityList.push(buildings.DwarfWorldCollider);

        priorityList.push(buildings.HellMission);
        priorityList.push(buildings.HellGeothermal);
        priorityList.push(buildings.HellSwarmPlant);

        priorityList.push(buildings.ProximaTransferStation);
        priorityList.push(buildings.ProximaMission);
        priorityList.push(buildings.ProximaCargoYard);
        priorityList.push(buildings.ProximaCruiser);
        priorityList.push(buildings.ProximaDyson);
        priorityList.push(buildings.ProximaDysonSphere);
        priorityList.push(buildings.ProximaOrichalcumSphere);

        priorityList.push(buildings.AlphaMission);
        priorityList.push(buildings.AlphaStarport);
        priorityList.push(buildings.AlphaFusion);
        priorityList.push(buildings.AlphaHabitat);
        priorityList.push(buildings.AlphaLuxuryCondo);
        priorityList.push(buildings.AlphaMiningDroid);
        priorityList.push(buildings.AlphaProcessing);
        priorityList.push(buildings.AlphaLaboratory);
        priorityList.push(buildings.AlphaExoticZoo);
        priorityList.push(buildings.AlphaExchange);
        priorityList.push(buildings.AlphaGraphenePlant);
        priorityList.push(buildings.AlphaWarehouse);

        priorityList.push(buildings.SpaceTestLaunch);
        priorityList.push(buildings.SpaceSatellite);
        priorityList.push(buildings.SpaceGps);
        priorityList.push(buildings.SpacePropellantDepot);
        priorityList.push(buildings.SpaceNavBeacon);

        priorityList.push(buildings.RedMission);
        priorityList.push(buildings.RedTower);
        priorityList.push(buildings.RedSpaceport);
        priorityList.push(buildings.RedLivingQuarters);
        priorityList.push(buildings.RedBiodome);
        priorityList.push(buildings.RedSpaceBarracks);
        priorityList.push(buildings.RedExoticLab);
        priorityList.push(buildings.RedFabrication);
        priorityList.push(buildings.RedMine);
        priorityList.push(buildings.RedVrCenter);
        priorityList.push(buildings.RedZiggurat);
        priorityList.push(buildings.RedGarage);

        priorityList.push(buildings.MoonMission);
        priorityList.push(buildings.MoonBase);
        priorityList.push(buildings.MoonObservatory);
        priorityList.push(buildings.MoonHeliumMine);
        priorityList.push(buildings.MoonIridiumMine);

        priorityList.push(buildings.SunMission);
        priorityList.push(buildings.SunSwarmControl);
        priorityList.push(buildings.SunSwarmSatellite);

        priorityList.push(buildings.GasMission);
        priorityList.push(buildings.GasStorage);
        priorityList.push(buildings.GasSpaceDock);
        priorityList.push(buildings.GasSpaceDockProbe);
        priorityList.push(buildings.GasSpaceDockShipSegment);

        priorityList.push(buildings.GasMoonMission);
        priorityList.push(buildings.GasMoonDrone);

        priorityList.push(buildings.Blackhole);
        priorityList.push(buildings.BlackholeStellarEngine);
        priorityList.push(buildings.BlackholeJumpShip);
        priorityList.push(buildings.BlackholeWormholeMission);
        priorityList.push(buildings.BlackholeStargate);

        priorityList.push(buildings.SiriusMission);
        priorityList.push(buildings.SiriusAnalysis);
        priorityList.push(buildings.SiriusSpaceElevator);
        priorityList.push(buildings.SiriusGravityDome);
        priorityList.push(buildings.SiriusThermalCollector);
        priorityList.push(buildings.SiriusAscensionMachine);
        //priorityList.push(buildings.SiriusAscend); // This is performing the actual ascension. We'll deal with this in prestige automation

        priorityList.push(buildings.BlackholeStargateComplete); // Should be powered before Andromeda

        priorityList.push(buildings.GatewayMission);
        priorityList.push(buildings.GatewayStarbase);
        priorityList.push(buildings.GatewayShipDock);

        priorityList.push(buildings.StargateStation);
        priorityList.push(buildings.StargateTelemetryBeacon);

        priorityList.push(buildings.Dreadnought);
        priorityList.push(buildings.CruiserShip);
        priorityList.push(buildings.FrigateShip);
        priorityList.push(buildings.BologniumShip);
        priorityList.push(buildings.CorvetteShip);
        priorityList.push(buildings.ScoutShip);

        priorityList.push(buildings.GorddonMission);
        priorityList.push(buildings.GorddonEmbassy);
        priorityList.push(buildings.GorddonDormitory);
        priorityList.push(buildings.GorddonSymposium);
        priorityList.push(buildings.GorddonFreighter);

        priorityList.push(buildings.SiriusAscensionTrigger); // This is the 10,000 power one, buildings below this one should be safe to underpower for ascension. Buildings above this either provides, or support population
        priorityList.push(buildings.BlackholeMassEjector); // Top priority of safe buildings, disable *only* for ascension, otherwise we want to have them on at any cost, to keep pumping black hole

        priorityList.push(buildings.Alien1Consulate);
        priorityList.push(buildings.Alien1Resort);
        priorityList.push(buildings.Alien1VitreloyPlant);
        priorityList.push(buildings.Alien1SuperFreighter);

        //priorityList.push(buildings.Alien2Mission);
        priorityList.push(buildings.Alien2Foothold);
        priorityList.push(buildings.Alien2Scavenger);
        priorityList.push(buildings.Alien2ArmedMiner);
        priorityList.push(buildings.Alien2OreProcessor);

        //priorityList.push(buildings.ChthonianMission);
        priorityList.push(buildings.ChthonianMineLayer);
        priorityList.push(buildings.ChthonianExcavator);
        priorityList.push(buildings.ChthonianRaider);

        priorityList.push(buildings.Wardenclyffe);
        priorityList.push(buildings.BioLab);
        priorityList.push(buildings.DwarfWorldController);
        priorityList.push(buildings.BlackholeFarReach);

        priorityList.push(buildings.NebulaMission);
        priorityList.push(buildings.NebulaNexus);
        priorityList.push(buildings.NebulaHarvester);
        priorityList.push(buildings.NebulaEleriumProspector);

        priorityList.push(buildings.BeltMission);
        priorityList.push(buildings.BeltSpaceStation);
        priorityList.push(buildings.BeltEleriumShip);
        priorityList.push(buildings.BeltIridiumShip);
        priorityList.push(buildings.BeltIronShip);

        priorityList.push(buildings.CementPlant);
        priorityList.push(buildings.Factory);
        priorityList.push(buildings.GasMoonOutpost);
        priorityList.push(buildings.StargateDefensePlatform);
        priorityList.push(buildings.RedFactory);
        priorityList.push(buildings.AlphaMegaFactory);

        priorityList.push(buildings.PortalTurret);
        priorityList.push(buildings.BadlandsSensorDrone);
        priorityList.push(buildings.PortalWarDroid);
        priorityList.push(buildings.BadlandsPredatorDrone);
        priorityList.push(buildings.BadlandsAttractor);
        priorityList.push(buildings.PortalCarport);
        priorityList.push(buildings.PitSoulForge);
        priorityList.push(buildings.PitGunEmplacement);
        priorityList.push(buildings.PitSoulAttractor);
        priorityList.push(buildings.PortalRepairDroid);
        priorityList.push(buildings.PitMission);
        priorityList.push(buildings.PitAssaultForge);
        priorityList.push(buildings.RuinsAncientPillars);

        priorityList.push(buildings.RuinsMission);
        priorityList.push(buildings.RuinsGuardPost);
        priorityList.push(buildings.RuinsVault);
        priorityList.push(buildings.RuinsArchaeology);

        priorityList.push(buildings.GateMission);
        priorityList.push(buildings.GateEastTower);
        priorityList.push(buildings.GateWestTower);
        priorityList.push(buildings.GateTurret);
        priorityList.push(buildings.GateInferniteMine);

        priorityList.push(buildings.SpireMission);
        priorityList.push(buildings.SpireMechBay);
        priorityList.push(buildings.SpireBaseCamp);
        priorityList.push(buildings.SpirePort);
        priorityList.push(buildings.SpirePurifier);
        priorityList.push(buildings.SpireBridge);
        priorityList.push(buildings.SpireSphinx);
        priorityList.push(buildings.SpireBribeSphinx);
        priorityList.push(buildings.SpireSurveyTower);
        priorityList.push(buildings.SpireWaygate);

        priorityList.push(buildings.LakeMission);
        priorityList.push(buildings.LakeCoolingTower);
        priorityList.push(buildings.LakeHarbour);
        priorityList.push(buildings.LakeBireme);
        priorityList.push(buildings.LakeTransport);

        priorityList.push(buildings.HellSmelter);
        priorityList.push(buildings.DwarfShipyard);
        priorityList.push(buildings.DwarfMassRelay);
        priorityList.push(buildings.TitanMission);
        priorityList.push(buildings.TitanSpaceport);

        priorityList.push(buildings.TitanAIColonist);
        priorityList.push(buildings.TitanMine);
        priorityList.push(buildings.TitanSAM);
        priorityList.push(buildings.TitanGraphene);
        priorityList.push(buildings.TitanStorehouse);
        priorityList.push(buildings.TitanBank);
        priorityList.push(buildings.TitanAI);
        priorityList.push(buildings.TitanAIComplete);
        priorityList.push(buildings.TitanDecoder);
        priorityList.push(buildings.EnceladusMission);
        priorityList.push(buildings.EnceladusWaterFreighter);
        priorityList.push(buildings.EnceladusBase);
        priorityList.push(buildings.EnceladusZeroGLab);
        priorityList.push(buildings.EnceladusMunitions);
        priorityList.push(buildings.TritonMission);
        priorityList.push(buildings.TritonFOB);
        priorityList.push(buildings.TritonLander);
        //priorityList.push(buildings.TritonCrashedShip);
        priorityList.push(buildings.KuiperMission);
        priorityList.push(buildings.KuiperOrichalcum);
        priorityList.push(buildings.KuiperUranium);
        priorityList.push(buildings.KuiperNeutronium);
        priorityList.push(buildings.KuiperElerium);
        priorityList.push(buildings.ErisMission);
        priorityList.push(buildings.ErisDrone);
        priorityList.push(buildings.ErisTrooper);
        priorityList.push(buildings.ErisTank);
        //priorityList.push(buildings.ErisDigsite);

        priorityList.push(buildings.StargateDepot);
        priorityList.push(buildings.DwarfEleriumContainer);

        priorityList.push(buildings.GasMoonOilExtractor);
        priorityList.push(buildings.NeutronMission);
        priorityList.push(buildings.NeutronStellarForge);
        priorityList.push(buildings.NeutronMiner);

        priorityList.push(buildings.MassDriver);
        priorityList.push(buildings.MetalRefinery);
        priorityList.push(buildings.Casino);
        priorityList.push(buildings.HellSpaceCasino);
        priorityList.push(buildings.RockQuarry);
        priorityList.push(buildings.Sawmill);
        priorityList.push(buildings.GasMining);
        priorityList.push(buildings.NeutronCitadel);
        priorityList.push(buildings.Mine);
        priorityList.push(buildings.CoalMine);

        BuildingManager.priorityList = priorityList;
        BuildingManager.statePriorityList = priorityList.filter(b => b.isSwitchable());
    }

    function resetWarSettings(reset) {
        let def = {
            autoFight: false,
            foreignAttackLivingSoldiersPercent: 90,
            foreignAttackHealthySoldiersPercent: 90,
            foreignHireMercMoneyStoragePercent: 90,
            foreignHireMercCostLowerThanIncome: 1,
            foreignHireMercDeadSoldiers: 1,
            foreignMinAdvantage: 40,
            foreignMaxAdvantage: 50,
            foreignMaxSiegeBattalion: 10,
            foreignProtect: "auto",
            foreignPacifist: false,
            foreignUnification: true,
            foreignForceSabotage: true,
            foreignOccupyLast: true,
            foreignTrainSpy: true,
            foreignSpyMax: 2,
            foreignPowerRequired: 75,
            foreignPolicyInferior: "Annex",
            foreignPolicySuperior: "Sabotage",
            foreignPolicyRival: "Influence",
        }

        applySettings(def, reset);
    }

    function resetHellSettings(reset) {
        let def = {
            autoHell: false,
            hellHomeGarrison: 10,
            hellMinSoldiers: 20,
            hellMinSoldiersPercent: 90,
            hellTargetFortressDamage: 100,
            hellLowWallsMulti: 3,
            hellHandlePatrolSize: true,
            hellPatrolMinRating: 30,
            hellPatrolThreatPercent: 8,
            hellPatrolDroneMod: 5,
            hellPatrolDroidMod: 5,
            hellPatrolBootcampMod: 0,
            hellBolsterPatrolPercentTop: 50,
            hellBolsterPatrolPercentBottom: 20,
            hellBolsterPatrolRating: 300,
            hellAttractorTopThreat: 3000,
            hellAttractorBottomThreat: 1300,
        }

        applySettings(def, reset);
    }

    function resetGeneralSettings(reset) {
        let def = {
            masterScriptToggle: true,
            showSettings: true,
            tickRate: 4,
            autoAssembleGene: false,
            researchRequest: true,
            researchRequestSpace: false,
            missionRequest: true,
            useDemanded: true,
            prioritizeTriggers: "savereq",
            prioritizeQueue: "savereq",
            prioritizeUnify: "savereq",
            prioritizeOuterFleet: "ignore",
            buildingAlwaysClick: false,
            buildingClickPerTick: 50,
        }

        applySettings(def, reset);
    }

    function resetPrestigeSettings(reset) {
        let def = {
            prestigeType: "none",
            prestigeMADIgnoreArpa: true,
            prestigeMADWait: true,
            prestigeMADPopulation: 1,
            prestigeWaitAT: true,
            prestigeBioseedConstruct: true,
            prestigeEnabledBarracks: 100,
            prestigeBioseedProbes: 3,
            prestigeWhiteholeSaveGems: true,
            prestigeWhiteholeMinMass: 8,
            prestigeAscensionSkipCustom: false,
            prestigeAscensionPillar: true,
            prestigeDemonicFloor: 100,
            prestigeDemonicPotential: 0.4,
            prestigeDemonicBomb: false,
        }

        applySettings(def, reset);
    }

    function resetGovernmentSettings(reset) {
        let def = {
            autoTax: false,
            govManage: false,
            generalMinimumTaxRate: 20,
            generalMinimumMorale: 105,
            generalMaximumMorale: 500,
            govInterim: GovernmentManager.Types.democracy.id,
            govFinal: GovernmentManager.Types.technocracy.id,
            govSpace: GovernmentManager.Types.corpocracy.id,
            govGovernor: "none",
        }

        applySettings(def, reset);
    }

    function resetEvolutionSettings(reset) {
        let def = {
            autoEvolution: false,
            userUniverseTargetName: "none",
            userPlanetTargetName: "none",
            userEvolutionTarget: "auto",
            evolutionQueue: [],
            evolutionQueueEnabled: false,
            evolutionQueueRepeat: false,
            evolutionBackup: false,
        }
        challenges.forEach(set => def["challenge_" + set[0].id] = false);

        applySettings(def, reset);
    }

    function resetResearchSettings(reset) {
        let def = {
            autoResearch: false,
            userResearchTheology_1: "auto",
            userResearchTheology_2: "auto",
            researchIgnore: ["tech-purify"],
        }

        applySettings(def, reset);
    }

    function resetMarketSettings(reset) {
        MarketManager.priorityList = Object.values(resources).filter(r => r.isTradable()).reverse();
        let def = {
            autoMarket: false,
            autoGalaxyMarket: false,
            tradeRouteMinimumMoneyPerSecond: 500,
            tradeRouteMinimumMoneyPercentage: 50,
            tradeRouteSellExcess: true,
            minimumMoney: 0,
            minimumMoneyPercentage: 0,
            marketMinIngredients: 0.001,
        }

        for (let i = 0; i < MarketManager.priorityList.length; i++) {
            let resource = MarketManager.priorityList[i];
            let id = resource.id;

            def['res_buy_p_' + id] = i; // marketPriority
            def['buy' + id] = false; // autoBuyEnabled
            def['res_buy_r_' + id] = 0.5; // autoBuyRatio
            def['sell' + id] = false; // autoSellEnabled
            def['res_sell_r_' + id] = 0.9; // autoSellRatio
            def['res_trade_buy_' + id] = true; // autoTradeBuyEnabled
            def['res_trade_sell_' + id] = true; // autoTradeSellEnabled
            def['res_trade_w_' + id] = 1; // autoTradeWeighting
            def['res_trade_p_' + id] = 1; // autoTradePriority
        }

        const setTradePriority = (priority, items) =>
          items.forEach(id => def['res_trade_p_' + id] = priority);

        setTradePriority(1, ["Food"]);
        setTradePriority(2, ["Helium_3", "Uranium", "Oil", "Coal"]);
        setTradePriority(3, ["Stone", "Chrysotile", "Lumber"]);
        setTradePriority(4, ["Aluminium", "Iron", "Copper"]);
        setTradePriority(5, ["Furs"]);
        setTradePriority(6, ["Cement"]);
        setTradePriority(7, ["Steel"]);
        setTradePriority(8, ["Titanium"]);
        setTradePriority(9, ["Iridium", "Polymer", "Alloy"]);
        setTradePriority(-1, ["Crystal"]);

        for (let i = 0; i < poly.galaxyOffers.length; i++) {
            let resource = resources[poly.galaxyOffers[i].buy.res];
            let id = resource.id;

            def['res_galaxy_w_' + id] = 1; // galaxyMarketWeighting
            def['res_galaxy_p_' + id] = i+1; // galaxyMarketPriority
        }

        applySettings(def, reset);
        MarketManager.sortByPriority();
    }

    function resetStorageSettings(reset) {
        StorageManager.priorityList = Object.values(resources).filter(r => r.hasStorage()).reverse();
        let def = {
            autoStorage: false,
            storageLimitPreMad: true,
            storageSafeReassign: true,
            storageAssignExtra: true,
            storagePrioritizedOnly: true,
        }

        for (let i = 0; i < StorageManager.priorityList.length; i++) {
            let resource = StorageManager.priorityList[i];
            let id = resource.id;

            def['res_storage' + id] = true; // autoStorageEnabled
            def['res_storage_p_' + id] = i; // storagePriority
            def['res_storage_o_' + id] = false; // storeOverflow
            def['res_crates_m_' + id] = -1; // _autoCratesMax
            def['res_containers_m_' + id] = -1; // _autoContainersMax
        }

        // Enable overflow for endgame resources
        def['res_storage_o_' + resources.Orichalcum.id] = true;
        def['res_storage_o_' + resources.Vitreloy.id] = true;
        def['res_storage_o_' + resources.Bolognium.id] = true;

        applySettings(def, reset);
        StorageManager.sortByPriority();
    }

    function resetMinorTraitSettings(reset) {
        MinorTraitManager.priorityList = Object.entries(game.traits)
          .filter(([id, trait]) => trait.type === 'minor' || id === 'mastery' || id === 'fortify')
          .map(([id, trait]) => new MinorTrait(id));

        let def = {
            autoMinorTrait: false,
            shifterGenus: "ignore",
        };

        for (let i = 0; i < MinorTraitManager.priorityList.length; i++) {
            let trait = MinorTraitManager.priorityList[i];
            let id = trait.traitName;

            def['mTrait_' + id] = true; // enabled
            def['mTrait_p_' + id] = i; // priority
            def['mTrait_w_' + id] = 1; // weighting
        }

        applySettings(def, reset);
        MinorTraitManager.sortByPriority();
    }

    function resetJobSettings(reset) {
        JobManager.priorityList = Object.values(jobs);
        let def = {
            autoJobs: false,
            autoCraftsmen: false,
            jobSetDefault: true,
            jobLumberWeighting: 50,
            jobQuarryWeighting: 50,
            jobCrystalWeighting: 50,
            jobScavengerWeighting: 50,
            jobDisableMiners: true,
            jobDisableCraftsmans: true,
        }

        for (let i = 0; i < JobManager.priorityList.length; i++) {
            let job = JobManager.priorityList[i];
            let id = job._originalId;

            def['job_' + id] = true; // autoJobEnabled
            def['job_p_' + id] = i; // priority
        }

        const setBreakpoints = (job, b1, b2, b3) => { // breakpoins
            def['job_b1_' + job._originalId] = b1;
            def['job_b2_' + job._originalId] = b2;
            def['job_b3_' + job._originalId] = b3;
        };
        setBreakpoints(jobs.Unemployed, 0, 0, 0);
        setBreakpoints(jobs.Hunter, 0, 0, 0);
        setBreakpoints(jobs.Farmer, 0, 0, 0);
        //setBreakpoints(jobs.Forager, 4, 10, 0);
        setBreakpoints(jobs.Lumberjack, 4, 10, 0);
        setBreakpoints(jobs.QuarryWorker, 4, 10, 0);
        setBreakpoints(jobs.CrystalMiner, 2, 5, 0);
        setBreakpoints(jobs.Scavenger, 0, 0, 0);

        setBreakpoints(jobs.Colonist, -1, -1, -1);
        setBreakpoints(jobs.TitanColonist, -1, -1, -1);
        setBreakpoints(jobs.Miner, 3, 5, -1);
        setBreakpoints(jobs.CoalMiner, 2, 4, -1);
        setBreakpoints(jobs.CementWorker, 4, 8, -1);
        setBreakpoints(jobs.Professor, 6, 10, -1);
        setBreakpoints(jobs.Scientist, 3, 6, -1);
        setBreakpoints(jobs.Entertainer, 2, 5, -1);
        setBreakpoints(jobs.HellSurveyor, 0, 0, -1);
        setBreakpoints(jobs.SpaceMiner, 0, 0, -1);
        setBreakpoints(jobs.Archaeologist, 0, 0, -1);
        setBreakpoints(jobs.Banker, 3, 5, -1);
        setBreakpoints(jobs.Priest, 0, 0, -1);

        applySettings(def, reset);
        JobManager.sortByPriority();
    }

    function resetWeightingSettings(reset) {
        let def = {
            buildingBuildIfStorageFull: false,
            buildingWeightingNew: 3,
            buildingWeightingUselessPowerPlant: 0.01,
            buildingWeightingNeedfulPowerPlant: 3,
            buildingWeightingUnderpowered: 0.8,
            buildingWeightingUselessKnowledge: 0.01,
            buildingWeightingNeedfulKnowledge: 5,
            buildingWeightingMissingFuel: 10,
            buildingWeightingNonOperatingCity: 0.2,
            buildingWeightingNonOperating: 0,
            buildingWeightingMissingSupply: 0,
            buildingWeightingMissingSupport: 0,
            buildingWeightingUselessSupport: 0.01,
            buildingWeightingMADUseless: 0,
            buildingWeightingUnusedEjectors: 0.1,
            buildingWeightingCrateUseless: 0.01,
            buildingWeightingHorseshoeUseless: 0.1,
            buildingWeightingZenUseless: 0.01,
            buildingWeightingGateTurret: 0.01,
            buildingWeightingNeedStorage: 1,
            buildingWeightingUselessHousing: 1,
        }

        applySettings(def, reset);
    }

    function resetBuildingSettings(reset) {
        initBuildingState();
        let def = {
            autoBuild: false,
            autoPower: false,
            buildingsIgnoreZeroRate: false,
            buildingsLimitPowered: false,
            buildingShrineType: "know",
            buildingTowerSuppression: 100,
            buildingEnabledAll: true,
            buildingStateAll: true
        }

        for (let i = 0; i < BuildingManager.priorityList.length; i++) {
            let building = BuildingManager.priorityList[i];
            let id = building._vueBinding;

            def['bat' + id] = true; // autoBuildEnabled
            def['bld_p_' + id] = i; // priority
            def['bld_m_' + id] = -1; // _autoMax
            def['bld_w_' + id] = 100; // _weighting

            if (building.isSwitchable()) {
                def['bld_s_' + id] = true; // autoStateEnabled
            }
            if (building.is.smart) {
                def['bld_s2_' + id] = true; // autoStateSmart
            }
        }

        // AutoBuild disabled by default for early(ish) buildings consuming Soul Gems and Blood Stones
        ["RedVrCenter", "NeutronCitadel", "PortalWarDroid", "BadlandsPredatorDrone", "PortalRepairDroid", "SpireWaygate"]
          .forEach(b => def['bat' + buildings[b]._vueBinding] = false);

        // Limit max for belt ships, and horseshoes
        def['bld_m_' + buildings.ForgeHorseshoe._vueBinding] = 20;
        def['bld_m_' + buildings.RedForgeHorseshoe._vueBinding] = 20;
        def['bld_m_' + buildings.BeltEleriumShip._vueBinding] = 15;
        def['bld_m_' + buildings.BeltIridiumShip._vueBinding] = 15;

        applySettings(def, reset);
        BuildingManager.sortByPriority();
    }

    function resetProjectSettings(reset) {
        ProjectManager.priorityList = Object.values(projects);
        let def = {
            autoARPA: false,
            arpaScaleWeighting: true,
            arpaStep: 5,
        }

        let projectPriority = 0;
        const setProject = (item, autoBuildEnabled, _autoMax, _weighting) => {
            let id = projects[item].id;
            def['arpa_' + id] = autoBuildEnabled;
            def['arpa_p_' + id] = projectPriority++;
            def['arpa_m_' + id] = _autoMax;
            def['arpa_w_' + id] = _weighting;
        };
        setProject("LaunchFacility", true, -1, 100);
        setProject("SuperCollider", true, -1, 5);
        setProject("StockExchange", true, -1, 0.5);
        setProject("Monument", true, -1, 1);
        setProject("Railway", true, -1, 0.1);
        setProject("Nexus", true, -1, 1);
        setProject("RoidEject", true, -1, 1);
        setProject("ManaSyphon", false, 79, 1);
        setProject("Depot", true, -1, 1);

        applySettings(def, reset);
        ProjectManager.sortByPriority();
    }

    function resetMagicSettings(reset) {
        AlchemyManager.priorityList = Object.values(resources).filter(r => AlchemyManager.transmuteTier(r) > 0);
        let def = {
            autoAlchemy: false,
            autoPylon: false,
            magicAlchemyManaUse: 0.5,
            productionRitualManaUse: 0.5,
        }

        // Alchemy
        for (let i = 0; i < AlchemyManager.priorityList.length; i++) {
            let resource = AlchemyManager.priorityList[i];
            let id = resource.id;

            def['res_alchemy_' + id] = true; // resEnabled
            def['res_alchemy_w_' + id] = 0; // resWeighting
        }

        // Pylon
        for (let spell of Object.values(RitualManager.Productions)) {
            def['spell_w_' + spell.id] = 100; // weighting
        }
        def['spell_w_hunting'] = 10;
        def['spell_w_farmer'] = 1;

        applySettings(def, reset);
    }

    function resetProductionSettings(reset) {
        let def = {
            autoQuarry: false,
            autoGraphenePlant: false,
            autoSmelter: false,
            autoCraft: false,
            autoFactory: false,
            autoMiningDroid: false,
            productionChrysotileWeight: 2,
            productionFoundryWeighting: "demanded",
            productionSmelting: "required",
            productionSmeltingIridium: 0.5,
            productionFactoryMinIngredients: 0.001,
        }

        // Foundry
        const setFoundryProduct = (item, autoCraftEnabled, craftWeighting, craftPreserve) => {
            let id = resources[item].id;
            def['craft' + id] = autoCraftEnabled;
            def['foundry_w_' + id] = craftWeighting;
            def['foundry_p_' + id] = craftPreserve;
        };
        setFoundryProduct("Plywood", true, 1, 0);
        setFoundryProduct("Brick", true, 1, 0);
        setFoundryProduct("Wrought_Iron", true, 1, 0);
        setFoundryProduct("Sheet_Metal", true, 2, 0);
        setFoundryProduct("Mythril", true, 3, 0);
        setFoundryProduct("Aerogel", true, 3, 0);
        setFoundryProduct("Nanoweave", true, 10, 0);
        setFoundryProduct("Scarletite", true, 1, 0);
        setFoundryProduct("Quantium", true, 1, 0);

        // Smelter
        Object.values(SmelterManager.Fuels).forEach((fuel, i) => {
            def["smelter_fuel_p_" + fuel.id] = i; // priority
        });

        // Factory
        const setFactoryProduct = (item, enabled, weighting, priority) => {
            let id = FactoryManager.Productions[item].resource.id;
            def['production_' + id] = enabled;
            def['production_w_' + id] = weighting;
            def['production_p_' + id] = priority;
        };
        setFactoryProduct("LuxuryGoods", true, 1, 2);
        setFactoryProduct("Furs", true, 1, 1);
        setFactoryProduct("Alloy", true, 1, 3);
        setFactoryProduct("Polymer", true, 1, 3);
        setFactoryProduct("NanoTube", true, 4, 3);
        setFactoryProduct("Stanene", true, 4, 3);

        // Mining Droids
        const setDroidProduct = (item, weighting, priority) => {
            let id = DroidManager.Productions[item].resource.id;
            def['droid_w_' + id] = weighting;
            def['droid_pr_' + id] = priority;
        };
        setDroidProduct("Adamantite", 10, 1);
        setDroidProduct("Aluminium", 1, 1);
        setDroidProduct("Uranium", 10, -1);
        setDroidProduct("Coal", 10, -1);

        applySettings(def, reset);
    }

    function resetTriggerState() {
        TriggerManager.priorityList = [];
    }

    function resetTriggerSettings(reset) {
        let def = {
            autoTrigger: false,
        }

        applySettings(def, reset);
    }

    function resetLoggingSettings(reset) {
        let def = {
            hellTurnOffLogMessages: true,
            logFilter: "",
            logEnabled: true,
        }
        Object.keys(GameLog.Types).forEach(id => def["log_" + id] = true);
        def["log_mercenary"] = false;
        def["log_multi_construction"] = false;

        applySettings(def, reset);
    }

    function resetPlanetSettings(reset) {
        let def = {};
        biomeList.forEach(biome => def["biome_w_" + biome] = (planetBiomes.length - planetBiomes.indexOf(biome)) * 10);
        traitList.forEach(trait => def["trait_w_" + trait] = (planetTraits.length - planetTraits.indexOf(trait)) * 10);
        extraList.forEach(extra => def["extra_w_" + extra] = 0);
        def["extra_w_Achievement"] = 1000;

        applySettings(def, reset);
    }

    function resetFleetSettings(reset) {
        let def = {
            autoFleet: false,
            fleetOuterCrew: 30,
            fleetOuterShips: "custom",
            fleetOuterMinSyndicate: 0.1,
            fleetMaxCover: true,
            fleetEmbassyKnowledge: 6000000,
            fleetAlienGiftKnowledge: 6500000,
            fleetAlien2Knowledge: 8500000,
            fleetChthonianLoses: "low",

            // Default outer regions weighting
            fleet_outer_pr_spc_moon: 1, // Iridium
            fleet_outer_pr_spc_red: 3, // Titanium
            fleet_outer_pr_spc_gas: 0,
            fleet_outer_pr_spc_gas_moon: 0,
            fleet_outer_pr_spc_belt: 1, // Iridium
            fleet_outer_pr_spc_titan: 5, // Adamantite
            fleet_outer_pr_spc_enceladus: 3, // Quantium
            fleet_outer_pr_spc_triton: 10, // Encrypted data
            fleet_outer_pr_spc_kuiper: 5, // Orichalcum
            fleet_outer_pr_spc_eris: 0,

            // Default outer ship
            fleet_outer_class: 'corvette',
            fleet_outer_armor: 'neutronium',
            fleet_outer_weapon: 'plasma',
            fleet_outer_engine: 'ion',
            fleet_outer_power: 'fission',
            fleet_outer_sensor: 'lidar',

            // Default andromeda regions priority
            fleet_pr_gxy_stargate: 0,
            fleet_pr_gxy_alien2: 1,
            fleet_pr_gxy_alien1: 2,
            fleet_pr_gxy_chthonian: 3,
            fleet_pr_gxy_gateway: 4,
            fleet_pr_gxy_gorddon: 5,
        }

        applySettings(def, reset);
    }

    function resetMechSettings(reset) {
        let def = {
            autoMech: false,
            mechScrap: "mixed",
            mechScrapEfficiency: 1.5,
            mechCollectorValue: 0.5,
            mechBuild: "random",
            mechSize: "titan",
            mechSizeGravity: "auto",
            mechFillBay: true,
            mechScouts: 0.05,
            mechScoutsRebuild: false,
            mechMinSupply: 1000,
            mechMaxCollectors: 0.5,
            mechInfernalCollector: true,
            mechSpecial: "prefered",
            mechSaveSupplyRatio: 1,
            buildingMechsFirst: true,
            mechBaysFirst: true,
            mechWaygatePotential: 0.4,
        }

        applySettings(def, reset);
    }

    function resetEjectorSettings(reset) {
        if (game.global.race.universe === "magic") {
            EjectManager.priorityList = Object.values(resources)
              .filter(r => EjectManager.isConsumable(r))
              .sort((a, b) => b.atomicMass - a.atomicMass);
        } else {
            EjectManager.priorityList = Object.values(resources)
              .filter(r => EjectManager.isConsumable(r) && r !== resources.Elerium && r !== resources.Infernite)
              .sort((a, b) => b.atomicMass - a.atomicMass);
            EjectManager.priorityList.unshift(resources.Infernite);
            EjectManager.priorityList.unshift(resources.Elerium);
        }

        SupplyManager.priorityList = Object.values(resources)
          .filter(r => SupplyManager.isConsumable(r))
          .sort((a, b) => SupplyManager.supplyIn(b.id) - SupplyManager.supplyIn(a.id));

        NaniteManager.priorityList = Object.values(resources)
          .filter(r => NaniteManager.isConsumable(r))
          .sort((a, b) => b.atomicMass - a.atomicMass);

        let def = {
            autoEject: false,
            autoSupply: false,
            autoNanite: false,
            ejectMode: "cap",
            supplyMode: "mixed",
            naniteMode: "full",
            prestigeWhiteholeStabiliseMass: true,
        }

        for (let resource of EjectManager.priorityList) {
            def['res_eject' + resource.id] = resource.isTradable();
        }
        for (let resource of SupplyManager.priorityList) {
            def['res_supply' + resource.id] = resource.isTradable();
        }
        for (let resource of NaniteManager.priorityList) {
            def['res_nanite' + resource.id] = resource.isTradable();
        }

        def['res_eject' + resources.Elerium.id] = true;
        def['res_eject' + resources.Infernite.id] = true;

        applySettings(def, reset);
    }

    function updateStateFromSettings() {
        TriggerManager.priorityList = [];
        settingsRaw.triggers.forEach(trigger => TriggerManager.AddTriggerFromSetting(trigger));
    }

    function updateSettingsFromState() {
        settingsRaw.triggers = JSON.parse(JSON.stringify(TriggerManager.priorityList));

        localStorage.setItem('settings', JSON.stringify(settingsRaw));
    }

    function applySettings(def, reset) {
        if (reset) {
            // There's no default overrides, just wipe them all on reset
            for (let key in def) {
                delete settingsRaw.overrides[key];
            }
            Object.assign(settingsRaw, def);
        } else {
            for (let key in def) {
                if (!settingsRaw.hasOwnProperty(key)) {
                    settingsRaw[key] = def[key];
                } else {
                    // Validate settings types, and fix if needed
                    if (typeof settingsRaw[key] === "string" && typeof def[key] === "number") {
                        settingsRaw[key] = Number(settingsRaw[key]);
                    }
                    if (typeof settingsRaw[key] === "number" && typeof def[key] === "string") {
                        settingsRaw[key] = String(settingsRaw[key]);
                    }
                }
            }
        }
    }

    function updateStandAloneSettings() {
        let def = {
            scriptName: "TMVictor",
            overrides: {},
            triggers: [],
        }
        settingsSections.forEach(id => def[id + "SettingsCollapsed"] = true);
        applySettings(def, false); // For non-overridable settings only

        resetEvolutionSettings(false);
        resetWarSettings(false);
        resetHellSettings(false);
        resetMechSettings(false);
        resetFleetSettings(false);
        resetGovernmentSettings(false);
        resetBuildingSettings(false);
        resetWeightingSettings(false);
        resetMarketSettings(false);
        resetResearchSettings(false);
        resetProjectSettings(false);
        resetJobSettings(false);
        resetMagicSettings(false);
        resetProductionSettings(false);
        resetStorageSettings(false);
        resetGeneralSettings(false);
        resetPrestigeSettings(false);
        resetEjectorSettings(false);
        resetPlanetSettings(false);
        resetLoggingSettings(false);
        resetTriggerSettings(false);
        resetMinorTraitSettings(false);

        // Validate overrides types, and fix if needed
        for (let key in settingsRaw.overrides) {
            for (let i = 0; i < settingsRaw.overrides[key].length; i++) {
                let override = settingsRaw.overrides[key][i];
                if (typeof settingsRaw[key] === "string" && typeof override.ret === "number") {
                    override.ret = String(override.ret);
                }
                if (typeof settingsRaw[key] === "number" && typeof override.ret === "string") {
                    override.ret = Number(override.ret);
                }
            }
        }
        // Migrate pre-overrides settings
        settingsRaw.triggers.forEach(t => {
            if (techIds["tech-" + t.actionId]) { t.actionId = "tech-" + t.actionId; }
            if (techIds["tech-" + t.requirementId]) { t.requirementId = "tech-" + t.requirementId; }
        });
        if (settingsRaw.hasOwnProperty("productionPrioritizeDemanded")) { // Replace checkbox with list
            settingsRaw.productionFoundryWeighting = settingsRaw.productionPrioritizeDemanded ? "demanded" : "none";
        }
        settingsRaw.challenge_plasmid = settingsRaw.challenge_mastery || settingsRaw.challenge_plasmid; // Merge challenge settings
        if (settingsRaw.hasOwnProperty("res_trade_buy_mtr_Food")) { // Reset default market settings for pre-rework configs
            MarketManager.priorityList.forEach(res => settingsRaw['res_trade_buy_' + res.id] = true);
        }
        if (settingsRaw.hasOwnProperty("arpa")) { // Move arpa from object to strings
            Object.entries(settingsRaw.arpa).forEach(([id, enabled]) => settingsRaw["arpa_" + id] = enabled);
        }
        // Remove deprecated pre-overrides settings
        ["buildingWeightingTriggerConflict", "researchAlienGift", "arpaBuildIfStorageFullCraftableMin", "arpaBuildIfStorageFullResourceMaxPercent", "arpaBuildIfStorageFull", "productionMoneyIfOnly", "autoAchievements", "autoChallenge", "autoMAD", "autoSpace", "autoSeeder", "foreignSpyManage", "foreignHireMercCostLowerThan", "userResearchUnification", "btl_Ambush", "btl_max_Ambush", "btl_Raid", "btl_max_Raid", "btl_Pillage", "btl_max_Pillage", "btl_Assault", "btl_max_Assault", "btl_Siege", "btl_max_Siege", "smelter_fuel_Oil", "smelter_fuel_Coal", "smelter_fuel_Lumber", "planetSettingsCollapser", "buildingManageSpire", "hellHandleAttractors", "researchFilter", "challenge_mastery", "hellCountGems", "productionPrioritizeDemanded", "fleetChthonianPower", "productionWaitMana", "arpa", "autoLogging"]
          .forEach(id => delete settingsRaw[id]);
        ["foreignAttack", "foreignOccupy", "foreignSpy", "foreignSpyMax", "foreignSpyOp"]
          .forEach(id => [0, 1, 2].forEach(index => delete settingsRaw[id + index]));
        ["res_storage_w_", "res_trade_buy_mtr_", "res_trade_sell_mps_"]
          .forEach(id => Object.values(resources).forEach(resource => delete settingsRaw[id + resource.id]));
        Object.values(projects).forEach(project => delete settingsRaw['arpa_ignore_money_' + project.id]);
        Object.values(buildings).filter(building => !building.isSwitchable()).forEach(building => delete settingsRaw['bld_s_' + building._vueBinding]);
        // Migrate post-overrides settings
        migrateSetting("prestigeWhiteholeEjectEnabled", "autoEject", (v) => v);
        migrateSetting("mechSaveSupply", "mechSaveSupplyRatio", (v) => v ? 1 : 0);
        migrateSetting("foreignProtectSoldiers", "foreignProtect", (v) => v ? "always" : "never");
        migrateSetting("prestigeWhiteholeEjectExcess", "ejectMode", (v) => v ? "mixed" : "cap");
        migrateSetting("hellHandlePatrolCount", "autoHell", (v) => v, true);
        migrateSetting("unificationRequest", "prioritizeUnify", (v) => v ? "savereq" : "ignore");
        migrateSetting("queueRequest", "prioritizeQueue", (v) => v ? "savereq" : "ignore");
        migrateSetting("triggerRequest", "prioritizeTriggers", (v) => v ? "savereq" : "ignore");
        // Migrate setting as override, in case if someone actualy use it
        if (settingsRaw.hasOwnProperty("genesAssembleGeneAlways")) {
            if (settingsRaw.overrides.genesAssembleGeneAlways) {
                settingsRaw.overrides.autoAssembleGene = settingsRaw.overrides.genesAssembleGeneAlways.concat(settingsRaw.overrides.autoAssembleGene ?? []);
            }
            if (!settingsRaw.genesAssembleGeneAlways) {
                settingsRaw.overrides.autoAssembleGene = settingsRaw.overrides.autoAssembleGene ?? [];
                settingsRaw.overrides.autoAssembleGene.push({"type1":"ResearchComplete","arg1":"tech-dna_sequencer","type2":"Boolean","arg2":true,"cmp":"==","ret":false});
            }
        }
        if (settingsRaw.hasOwnProperty("prestigeWhiteholeEjectAllCount") && settingsRaw.prestigeWhiteholeEjectAllCount <= 20) {
            settingsRaw.overrides.ejectMode = settingsRaw.overrides.ejectMode ?? [];
            settingsRaw.overrides.ejectMode.push({"type1":"BuildingCount","arg1":"interstellar-mass_ejector","type2":"Number","arg2":settingsRaw.prestigeWhiteholeEjectAllCount,"cmp":">=","ret":"all"});
        }
        // Remove deprecated post-overrides settings
        ["prestigeWhiteholeEjectAllCount", "prestigeWhiteholeDecayRate", "genesAssembleGeneAlways", "buildingsConflictQueue", "buildingsConflictRQueue", "buildingsConflictPQueue", "fleet_outer_pr_spc_hell", "fleet_outer_pr_spc_dwarf"]
          .forEach(id => { delete settingsRaw[id], delete settingsRaw.overrides[id] });
    }

    function migrateSetting(oldSetting, newSetting, mapCb, keepOldValue) {
        if (settingsRaw.hasOwnProperty(oldSetting)) {
            if (!keepOldValue) {
                settingsRaw[newSetting] = mapCb(settingsRaw[oldSetting]);
            }
            delete settingsRaw[oldSetting];
        }
        if (settingsRaw.overrides.hasOwnProperty(oldSetting)) {
            settingsRaw.overrides[oldSetting].forEach(o => o.ret = mapCb(o.ret));
            settingsRaw.overrides[newSetting] = (settingsRaw.overrides[newSetting] ?? []).concat(settingsRaw.overrides[oldSetting]);
            delete settingsRaw.overrides[oldSetting];
        }
    }

    function getStarLevel(context) {
        let a_level = 1;
        if (context.challenge_plasmid) { a_level++; }
        if (context.challenge_trade) { a_level++; }
        if (context.challenge_craft) { a_level++; }
        if (context.challenge_crispr) { a_level++; }
        return a_level;
    }

    function getAchievementStar(id, universe) {
        return game.global.stats.achieve[id]?.[poly.universeAffix(universe)] ?? 0;
    }

    function isAchievementUnlocked(id, level, universe) {
        return getAchievementStar(id, universe) >= level;
    }

    function loadQueuedSettings() {
        if (settings.evolutionQueueEnabled && settingsRaw.evolutionQueue.length > 0) {
            state.evolutionAttempts++;
            let queuedEvolution = settingsRaw.evolutionQueue.shift();
            for (let [settingName, settingValue] of Object.entries(queuedEvolution)) {
                if (typeof settingsRaw[settingName] === typeof settingValue) {
                    settingsRaw[settingName] = settingValue;
                } else {
                    GameLog.logDanger("special", `Type mismatch during loading queued settings: settingsRaw.${settingName} type: ${typeof settingsRaw[settingName]}, value: ${settingsRaw[settingName]}; queuedEvolution.${settingName} type: ${typeof settingValue}, value: ${settingValue};`, ['events', 'major_events']);
                }
            }
            updateOverrides();
            if (settings.evolutionQueueRepeat) {
                settingsRaw.evolutionQueue.push(queuedEvolution);
            }
            updateStandAloneSettings();
            updateStateFromSettings();
            updateSettingsFromState();
            if (settings.showSettings) {
                removeScriptSettings();
                buildScriptSettings();
            }
        }
    }

    function autoEvolution() {
        if (game.global.race.species !== "protoplasm") {
            return;
        }

        autoUniverseSelection();
        autoPlanetSelection();

        // Wait for universe and planet, we don't want to run auto achievement until we'll land somewhere
        if (game.global.race.universe === 'bigbang' || (game.global.race.seeded && !game.global.race['chose'])) {
            return;
        }

        if (state.evolutionTarget === null) {
            loadQueuedSettings();

            // Try to pick race for achievement first
            if (settings.userEvolutionTarget === "auto") {
                let raceByWeighting = Object.values(races).sort((a, b) => b.getWeighting() - a.getWeighting());

                if (game.global.stats.achieve['mass_extinction']) {
                    // With Mass Extinction we can pick any race, go for best one
                    state.evolutionTarget = raceByWeighting[0];
                } else {
                    // Otherwise go for genus having most weight
                    let genusList = Object.values(races).map(r => r.genus).filter((v, i, a) => a.indexOf(v) === i);
                    let genusWeights = genusList.map(g => [g, Object.values(races).filter(r => r.genus === g).map(r => r.getWeighting()).reduce((sum, next) => sum + next)]);
                    let bestGenus = genusWeights.sort((a, b) => b[1] - a[1])[0][0];
                    state.evolutionTarget = raceByWeighting.find(r => r.genus === bestGenus);
                }
            }

            // Auto Achievements disabled, checking user specified race
            if (settings.userEvolutionTarget !== "auto") {
                let userRace = races[settings.userEvolutionTarget];
                if (userRace && userRace.getHabitability() > 0){
                    // Race specified, and condition is met
                    state.evolutionTarget = userRace
                }
            }

            // Try to pull next race from queue
            if (state.evolutionTarget === null && settings.evolutionQueueEnabled && settingsRaw.evolutionQueue.length > 0 && (!settings.evolutionQueueRepeat || state.evolutionAttempts < settingsRaw.evolutionQueue.length)) {
                return;
            }

            // Still no target. Fallback to custom, or ent.
            if (state.evolutionTarget === null) {
                state.evolutionTarget = races.custom.getHabitability() > 0 ? races.custom : races.entish;
            }
            GameLog.logSuccess("special", `尝试进化为${state.evolutionTarget.name}。`, ['progress']);
        }

        // Apply challenges
        for (let i = 0; i < challenges.length; i++) {
            if (settings["challenge_" + challenges[i][0].id]) {
                for (let j = 0; j < challenges[i].length; j++) {
                    let {id, trait} = challenges[i][j];
                    if (game.global.race[trait] !== 1 && evolutions[id].click() && id === "junker") {
                        return; // Give game time to update state after activating junker
                    }
                }
            }
        }

        // Calculate the maximum RNA and DNA required to evolve and don't build more than that
        let maxRNA = 0;
        let maxDNA = 0;

        for (let i = 0; i < state.evolutionTarget.evolutionTree.length; i++) {
            let evolution = state.evolutionTarget.evolutionTree[i];
            let costs = poly.adjustCosts(evolution.definition);

            maxRNA = Math.max(maxRNA, Number(costs["RNA"]?.() ?? 0));
            maxDNA = Math.max(maxDNA, Number(costs["DNA"]?.() ?? 0));
        }

        // Gather some resources and evolve
        let DNAForEvolution = Math.min(maxDNA - resources.DNA.currentQuantity, resources.DNA.maxQuantity - resources.DNA.currentQuantity, resources.RNA.maxQuantity / 2);
        let RNAForDNA = Math.min(DNAForEvolution * 2 - resources.RNA.currentQuantity, resources.RNA.maxQuantity - resources.RNA.currentQuantity);
        let RNARemaining = resources.RNA.currentQuantity + RNAForDNA - DNAForEvolution * 2;
        let RNAForEvolution = Math.min(maxRNA - RNARemaining, resources.RNA.maxQuantity - RNARemaining);

        let rna = game.actions.evolution.rna;
        let dna = game.actions.evolution.dna;
        for (let i = 0; i < RNAForDNA; i++) { rna.action(); }
        for (let i = 0; i < DNAForEvolution; i++) { dna.action(); }
        for (let i = 0; i < RNAForEvolution; i++) { rna.action(); }

        resources.RNA.currentQuantity = RNARemaining + RNAForEvolution;
        resources.DNA.currentQuantity = resources.DNA.currentQuantity + DNAForEvolution;

        // Lets go for our targeted evolution
        for (let i = 0; i < state.evolutionTarget.evolutionTree.length; i++) {
            let action = state.evolutionTarget.evolutionTree[i];
            if (action.isUnlocked()) {
                // Don't click challenges which already active
                let challenge = challenges.flat().find(c => c.id === action.id);
                if (challenge && game.global.race[challenge.trait]) {
                    continue;
                }
                if (action.click()) {
                    // If we successfully click the action then return to give the ui some time to refresh
                    return;
                } else {
                    // Our path is unlocked but we can't click it yet
                    break;
                }
            }
        }

        if (evolutions.mitochondria.count < 1 || resources.RNA.maxQuantity < maxRNA || resources.DNA.maxQuantity < maxDNA) {
            evolutions.mitochondria.click();
        }
        if (evolutions.eukaryotic_cell.count < 1 || resources.DNA.maxQuantity < maxDNA) {
            evolutions.eukaryotic_cell.click();
        }
        if (resources.RNA.maxQuantity < maxRNA) {
            evolutions.membrane.click();
        }
        if (evolutions.nucleus.count < 10) {
            evolutions.nucleus.click();
        }
        if (evolutions.organelles.count < 10) {
            evolutions.organelles.click();
        }
    }

    function autoUniverseSelection() {
        if (!game.global.race['bigbang']) { return; }
        if (game.global.race.universe !== 'bigbang') { return; }
        if (settings.userUniverseTargetName === 'none') { return; }

        var action = document.getElementById(`uni-${settings.userUniverseTargetName}`);

        if (action !== null) {
            action.children[0].click();
        }
    }

    // function setPlanet from actions.js
    // Produces same set of planets, accurate for v1.0.29
    function generatePlanets() {
        let seed = game.global.race.seed;
        let seededRandom = function(min = 0, max = 1) {
            seed = (seed * 9301 + 49297) % 233280;
            let rnd = seed / 233280;
            return min + rnd * (max - min);
        }

        let biomes = ['grassland', 'oceanic', 'forest', 'desert', 'volcanic', 'tundra', game.global.race.universe === 'evil' ? 'eden' : 'hellscape'];
        let traits = ['toxic', 'mellow', 'rage', 'stormy', 'ozone', 'magnetic', 'trashed', 'elliptical', 'flare', 'dense', 'unstable', 'none', 'none', 'none', 'none', 'none'];
        let geologys = ['Copper', 'Iron', 'Aluminium', 'Coal', 'Oil', 'Titanium', 'Uranium'];
        if (game.global.stats.achieve['whitehole']) {
            geologys.push('Iridium');
        }

        let planets = [];
        let hell = false;
        let maxPlanets = Math.max(1, game.global.race.probes);
        for (let i = 0; i < maxPlanets; i++){
            let planet = {geology: {}};
            let max_bound = !hell && game.global.stats.portals >= 1 ? 7 : 6;
            planet.biome = biomes[Math.floor(seededRandom(0, max_bound))];
            planet.trait = traits[Math.floor(seededRandom(0, 16))];

            let max = Math.floor(seededRandom(0,3));
            let top = planet.biome === 'eden' ? 35 : 30;
            if (game.global.stats.achieve['whitehole']){
                max += game.global.stats.achieve['whitehole'].l;
                top += game.global.stats.achieve['whitehole'].l * 5;
            }

            for (let i = 0; i < max; i++){
                let index = Math.floor(seededRandom(0, 10));
                if (geologys[index]) {
                    planet.geology[geologys[index]] = ((Math.floor(seededRandom(0, top)) - 10) / 100);
                }
            }

            let id = planet.biome + Math.floor(seededRandom(0,10000));
            planet.id = id.charAt(0).toUpperCase() + id.slice(1);

            if (planet.biome !== 'hellscape' && planet.biome !== 'eden') {
                seededRandom(); // We don't need orbit. Call it just to sync seed with game math.
            } else {
                hell = true;
            }
            planets.push(planet);
        }
        return planets;
    }

    function autoPlanetSelection() {
        if (game.global.race.universe === 'bigbang') { return; }
        if (!game.global.race.seeded || game.global.race['chose']) { return; }
        if (settings.userPlanetTargetName === 'none') { return; }

        let planets = generatePlanets();

        // Let's try to calculate how many achievements we can get here
        let alevel = getStarLevel(settings);
        for (let i = 0; i < planets.length; i++){
            let planet = planets[i];
            planet.achieve = 0;

            if (!isAchievementUnlocked("biome_" + planet.biome, alevel)) {
                planet.achieve++;
            }
            if (planet.trait !== "none" && !isAchievementUnlocked("atmo_" + planet.trait, alevel)) {
                planet.achieve++;
            }
            if (planetBiomeGenus[planet.biome]) {
                for (let id in races) {
                    if (races[id].genus === planetBiomeGenus[planet.biome] && !isAchievementUnlocked("extinct_" + id, alevel)) {
                        planet.achieve++;
                    }
                }
                // All races have same genus, no need to check both
                if (!isAchievementUnlocked("genus_" + planetBiomeGenus[planet.biome], alevel)) {
                    planet.achieve++;
                }
            }
        }

        // Now calculate weightings
        for (let i = 0; i < planets.length; i++){
            let planet = planets[i];
            planet.weighting = 0;

            planet.weighting += settings["biome_w_" + planet.biome];
            planet.weighting += settings["trait_w_" + planet.trait];

            planet.weighting += planet.achieve * settings["extra_w_Achievement"];

            let numShow = game.global.stats.achieve['miners_dream'] ? game.global.stats.achieve['miners_dream'].l >= 4 ? game.global.stats.achieve['miners_dream'].l * 2 - 3 : game.global.stats.achieve['miners_dream'].l : 0;
            for (let id in planet.geology) {
                if (planet.geology[id] === 0) {
                    continue;
                }
                if (numShow-- > 0) {
                    planet.weighting += (planet.geology[id] / 0.01) * settings["extra_w_" + id];
                } else {
                    planet.weighting += (planet.geology[id] > 0 ? 1 : -1) * settings["extra_w_" + id];
                }
            }
        }

        if (settings.userPlanetTargetName === "weighting") {
            planets.sort((a, b) => b.weighting - a.weighting);
        }

        if (settings.userPlanetTargetName === "habitable") {
            planets.sort((a, b) => (planetBiomes.indexOf(a.biome) + planetTraits.indexOf(a.trait)) -
                                   (planetBiomes.indexOf(b.biome) + planetTraits.indexOf(b.trait)));
        }

        if (settings.userPlanetTargetName === "achieve") {
            planets.sort((a, b) => a.achieve !== b.achieve ? b.achieve - a.achieve :
                                   (planetBiomes.indexOf(a.biome) + planetTraits.indexOf(a.trait)) -
                                   (planetBiomes.indexOf(b.biome) + planetTraits.indexOf(b.trait)));
        }

        let selectedPlanet = document.getElementById(planets[0].id);
        if (selectedPlanet) {
            selectedPlanet.children[0].click();
        }
    }

    function autoCraft() {
        if (!resources.Population.isUnlocked()) { return; }
        if (game.global.race['no_craft']) { return; }

        craftLoop:
        for (let i = 0; i < foundryList.length; i++) {
            let craftable = foundryList[i];
            if (!craftable.isUnlocked() || !craftable.autoCraftEnabled) {
                continue;
            }

            let afforableAmount = Number.MAX_SAFE_INTEGER;
            for (let res in craftable.cost) {
                let resource = resources[res];
                let quantity = craftable.cost[res];

                if (craftable.isDemanded()) { // Craftable demanded, get as much as we can
                    afforableAmount = Math.min(afforableAmount, resource.spareQuantity / quantity);
                } else if (resource.isDemanded() || (!resource.isCapped() && resource.usefulRatio < craftable.usefulRatio)) { // Don't use demanded resources
                    continue craftLoop;
                } else if (craftable.currentQuantity < craftable.storageRequired) { // Craftable is required, use all spare resources
                    afforableAmount = Math.min(afforableAmount, resource.spareQuantity / quantity);
                } else if (resource.currentQuantity >= resource.storageRequired || resource.isCapped()) { // Resource not required - consume income
                    afforableAmount = Math.min(afforableAmount, Math.ceil(resource.rateOfChange / ticksPerSecond() / quantity));
                } else { // Resource is required, and craftable not required. Don't craft anything.
                    continue craftLoop;
                }
            }
            afforableAmount = Math.floor(afforableAmount);
            if (afforableAmount >= 1) {
                craftable.tryCraftX(afforableAmount);
                for (let res in craftable.cost) {
                    resources[res].currentQuantity -= craftable.cost[res] * afforableAmount;
                }
            }
        }
    }

    function manageGovernment() {
        // Change government
        if (GovernmentManager.isEnabled()) {
            if (haveTech("q_factory") && GovernmentManager.Types[settings.govSpace].isUnlocked()) {
                GovernmentManager.setGovernment(settings.govSpace);
            } else if (GovernmentManager.Types[settings.govFinal].isUnlocked()) {
                GovernmentManager.setGovernment(settings.govFinal);
            } else if (GovernmentManager.Types[settings.govInterim].isUnlocked()) {
                GovernmentManager.setGovernment(settings.govInterim);
            }
        }

        // Appoint governor
        if (haveTech("governor") && settings.govGovernor !== "none" && getGovernor() === "none") {
            let candidates = game.global.race.governor?.candidates ?? [];
            for (let i = 0; i < candidates.length; i++) {
                if (candidates[i].bg === settings.govGovernor) {
                    getVueById("candidates")?.appoint(i);
                    break;
                }
            }
        }
    }

    function autoMerc() {
        let m = WarManager;
        if (!m._garrisonVue || !m.isMercenaryUnlocked() || m.maxCityGarrison <= 0) {
            return;
        }

        if (!haveTask("merc")) {
            let mercenaryCost = m.getMercenaryCost();
            let mercenariesHired = 0;
            let mercenaryMax = m.maxSoldiers - settings.foreignHireMercDeadSoldiers;
            let maxCost = state.moneyMedian * settings.foreignHireMercCostLowerThanIncome;
            let minMoney = Math.max(resources.Money.maxQuantity * settings.foreignHireMercMoneyStoragePercent / 100, Math.min(resources.Money.maxQuantity - maxCost, (settings.storageAssignExtra ? resources.Money.storageRequired / 1.03 : resources.Money.storageRequired)));
            if (state.goal === "Reset") { // Get as much as possible before reset
                mercenaryMax = m.maxSoldiers;
                minMoney = 0;
                maxCost = Number.MAX_SAFE_INTEGER;
            }
            while (m.currentSoldiers < mercenaryMax && resources.Money.spareQuantity >= mercenaryCost &&
                  (resources.Money.currentQuantity - mercenaryCost > minMoney || mercenaryCost < maxCost) &&
                m.hireMercenary()) {
                mercenariesHired++;
                mercenaryCost = m.getMercenaryCost();
            }

            // Log the interaction
            if (mercenariesHired === 1) {
                GameLog.logSuccess("mercenary", `雇佣了 1 名雇佣兵。`, ['combat']);
            } else if (mercenariesHired > 1) {
                GameLog.logSuccess("mercenary", `雇佣了 ${mercenariesHired} 名雇佣兵。`, ['combat']);
            }
        }
    }

    function autoSpy() {
        let m = SpyManager;
        if (!m._foreignVue || haveTask("spyop") || !haveTech("spy")) {
            return;
        }

        // Have no excess money, nor ability to use spies
        if (!haveTech("spy", 2) && resources.Money.storageRatio < 0.9) {
            return;
        }

        // Train spies
        if (settings.foreignTrainSpy) {
            for (let foreign of m.foreignActive) {
                // Spy already in training, or can't be afforded, or foreign is under control
                if (m._foreignVue.spy_disabled(foreign.id) || foreign.gov.occ || foreign.gov.anx || foreign.gov.buy) {
                    continue;
                }

                let spiesRequired = settings.foreignSpyMax >= 0 ? settings.foreignSpyMax : Number.MAX_SAFE_INTEGER;
                if (spiesRequired < 1 && foreign.policy !== "Occupy" && foreign.policy !== "Ignore") {
                    spiesRequired = 1;
                }
                // We need 3 spies to purchase, but only if we have enough money cap to purchase
                if (spiesRequired < 3 && foreign.policy === "Purchase" && resources.Money.maxQuantity >= poly.govPrice(foreign.id)) {
                    spiesRequired = 3;
                }

                // We reached the max number of spies allowed
                if (foreign.gov.spy >= spiesRequired || (m.purchaseMoney > 0 && foreign.policy !== "Purchase" && foreign.gov.spy > 0)){
                    continue;
                }

                GameLog.logSuccess("spying", `针对${getGovName(foreign.id)}训练一名间谍。`, ['spy']);
                m._foreignVue.spy(foreign.id);
            }
        }

        // We can't use our spies yet
        if (!haveTech("spy", 2)) {
            return;
        }

        // Perform espionage
        for (let foreign of m.foreignActive) {
            // Spy is missing, busy, or have nosthing to do
            if (foreign.gov.spy < 1 || foreign.gov.sab !== 0 || foreign.policy === "None") {
                continue;
            }

            let espionageMission = m.Types[foreign.policy === "Occupy" ? "Sabotage" : foreign.policy];
            if (!espionageMission) {
                continue;
            }

            // Don't kill spies doing other things if we already can purchase
            if (m.purchaseMoney > 0 && m.purchaseForeigngs.includes(foreign.id) && espionageMission === m.Types.Purchase && foreign.gov.spy < 3 && !game.global.race['elusive']) {
                continue;
            }

            // Unoccupy power if it's controlled, but we want something different
            if ((foreign.gov.anx && foreign.policy !== "Annex") ||
                (foreign.gov.buy && foreign.policy !== "Purchase") ||
                (foreign.gov.occ && foreign.policy !== "Occupy")){
                WarManager.release(foreign.id);
                foreign.released = true;
            } else if (!foreign.gov.anx && !foreign.gov.buy && !foreign.gov.occ) {
                m.performEspionage(foreign.id, espionageMission.id, foreign !== m.foreignTarget);
            }
        }
    }

    function autoBattle() {
        let sm = SpyManager;
        let m = WarManager;
        if (!m._garrisonVue || !sm._foreignVue || m.maxCityGarrison <= 0 || state.goal === "Reset" || settings.foreignPacifist) {
            return;
        }


        // If we are not fully ready then return
        let healthyMin = settings.foreignAttackHealthySoldiersPercent / 100;
        let livingMin = settings.foreignAttackLivingSoldiersPercent / 100;
        if ((m.wounded > (1 - healthyMin) * m.maxCityGarrison) ||
            (m.currentCityGarrison < livingMin * m.maxCityGarrison)) {
            return;
        }

        // Calculating safe size of battalions, if needed
        let protectSoldiers = settings.foreignProtect === "always" ? true : false;
        if (settings.foreignProtect === "auto") {
            let garrison = game.global.civic.garrison;
            let timeToRecruit = (m.deadSoldiers * 100 - garrison.progress) / (garrison.rate * 4) // Recruitmen ticks in short loop - 4 times per second
            let timeToHeal = m.wounded / getHealingRate() * 5; // Heal tick in long loop - once per 5 seconds
            protectSoldiers = timeToRecruit > timeToHeal;
        }

        // TODO: Configurable max
        let maxBattalion = new Array(5).fill(m.availableGarrison);
        let requiredBattalion = m.maxCityGarrison;
        if (protectSoldiers) {
            let armor = (traitVal('scales', 0) + (game.global.tech.armor ?? 0)) / traitVal('armored', 0, '-') - traitVal('frail', 0);
            let protectedBattalion = [5, 10, 25, 50, 999].map((cap, tactic) => (armor >= cap ? Number.MAX_SAFE_INTEGER : ((5 - tactic) * (armor + (game.global.city.ptrait === 'rage' ? 1 : 2)) - 1)));
            maxBattalion = protectedBattalion.map(soldiers => Math.min(soldiers, m.availableGarrison));
            requiredBattalion = 0;
        }
        maxBattalion[4] = Math.min(maxBattalion[4], settings.foreignMaxSiegeBattalion);

        let requiredTactic = 0;

        // Check if there's something that we want and can occupy, and switch to that target if found
        let currentTarget = sm.foreignTarget;
        for (let foreign of sm.foreignActive) {
            if (foreign.policy === "Occupy" && !foreign.gov.occ) {
                let soldiersMin = m.getSoldiersForAdvantage(settings.foreignMinAdvantage, 4, foreign.id);
                if (soldiersMin <= m.maxCityGarrison) {
                    currentTarget = foreign;
                    requiredBattalion = Math.max(soldiersMin, Math.min(m.availableGarrison, m.getSoldiersForAdvantage(settings.foreignMaxAdvantage, 4, foreign.id) - 1));
                    requiredTactic = 4;
                    break;
                }
            }
        }

        // Nothing to attack, or we want to occupy, and need more soldiers
        if (!currentTarget || (requiredTactic === 4 && m.availableGarrison < getOccCosts() * 2 && m.availableGarrison < m.maxCityGarrison)) {
            return;
        }

        if (requiredTactic !== 4) {
            // If we don't need to occupy our target, then let's find best tactic for plundering
            // Never try siege if it can mess with unification
            for (let i = !settings.foreignUnification || settings.foreignOccupyLast ? 4 : 3; i >= 0; i--) {
                let soldiersMin = m.getSoldiersForAdvantage(settings.foreignMinAdvantage, i, currentTarget.id);
                if (soldiersMin <= maxBattalion[i]) {
                    requiredBattalion = Math.max(soldiersMin, Math.min(maxBattalion[i], m.availableGarrison, m.getSoldiersForAdvantage(settings.foreignMaxAdvantage, i, currentTarget.id) - 1));
                    requiredTactic = i;
                    break;
                }
            }
        }

        // Not enough healthy soldiers, keep resting
        if (!requiredBattalion || requiredBattalion > m.availableGarrison) {
            return;
        }

        // Occupy can pull soldiers from ships, let's make sure it won't happen
        if (!currentTarget.released && (currentTarget.gov.anx || currentTarget.gov.buy || currentTarget.gov.occ)) {
            // If it occupied currently - we'll get enough soldiers just by unoccupying it
            m.release(currentTarget.id);
        }
        if (requiredTactic === 4 && m.crew > 0) {
            let missingSoldiers = getOccCosts() - (m.currentCityGarrison - requiredBattalion);
            if (missingSoldiers > 0) {
                // Not enough soldiers in city, let's try to pull them from hell
                if (!settings.autoHell || !m._hellVue || m.hellSoldiers - m.hellReservedSoldiers < missingSoldiers) {
                    return;
                }
                let patrolsToRemove = Math.ceil((missingSoldiers - m.hellGarrison) / m.hellPatrolSize);
                if (patrolsToRemove > 0) {
                    m.removeHellPatrol(patrolsToRemove);
                }
                m.removeHellGarrison(missingSoldiers);
            }
        }

        // Set attack type
        m.setTactic(requiredTactic);

        // Now adjust our battalion size to fit between our campaign attack rating ranges
        let deltaBattalion = requiredBattalion - m.raid;
        if (deltaBattalion > 0) {
            m.addBattalion(deltaBattalion);
        }
        if (deltaBattalion < 0) {
            m.removeBattalion(deltaBattalion * -1);
        }

        // Log the interaction
        let campaignTitle = m.getCampaignTitle(requiredTactic);
        let battalionRating = game.armyRating(m.raid, "army");
        let advantagePercent = m.getAdvantage(battalionRating, requiredTactic, currentTarget.id).toFixed(1);
        GameLog.logSuccess("attack", `对${getGovName(currentTarget.id)}发动${campaignTitle}战役，拥有${currentTarget.gov.spy < 1 ? "约" : ""}${advantagePercent}%优势。`, ['combat']);

        m.launchCampaign(currentTarget.id);
    }

    function autoHell() {
        let m = WarManager;
        if (!m._garrisonVue || !m._hellVue) {
            return;
        }

        // Determine Patrol size and count
        let targetHellSoldiers = 0;
        let targetHellPatrols = 0;
        let targetHellPatrolSize = 0;
        // First handle not having enough soldiers, then handle patrols
        // Only go into hell at all if soldiers are close to full, or we are already there
        if (m.maxSoldiers > settings.hellHomeGarrison + settings.hellMinSoldiers &&
           (m.hellSoldiers > settings.hellMinSoldiers || (m.currentSoldiers >= m.maxSoldiers * settings.hellMinSoldiersPercent / 100))) {
            targetHellSoldiers = Math.min(m.currentSoldiers, m.maxSoldiers) - settings.hellHomeGarrison; // Leftovers from an incomplete patrol go to hell garrison
            let availableHellSoldiers = targetHellSoldiers - m.hellReservedSoldiers;

            // Determine target hell garrison size
            // Estimated average damage is roughly 35 * threat / defense, so required defense = 35 * threat / targetDamage
            // But the threat hitting the fortress is only an intermediate result in the bloodwar calculation, it happens after predators and patrols but before repopulation,
            // So siege threat is actually lower than what we can see. Patrol and drone damage is wildly swingy and hard to estimate, so don't try to estimate the post-fight threat.
            // Instead base the defense on the displayed threat, and provide an option to bolster defenses when the walls get low. The threat used in the calculation
            // ranges from 1 * threat for 100% walls to the multiplier entered in the settings at 0% walls.
            let hellWallsMulti = settings.hellLowWallsMulti * (1 - game.global.portal.fortress.walls / 100); // threat modifier from damaged walls = 1 to lowWallsMulti
            let hellTargetFortressDamage = game.global.portal.fortress.threat * 35 / settings.hellTargetFortressDamage; // required defense to meet target average damage based on current threat
            let hellTurretPower = buildings.PortalTurret.stateOnCount * (game.global.tech['turret'] ? (game.global.tech['turret'] >= 2 ? 70 : 50) : 35); // turrets count and power
            let hellGarrison = m.getSoldiersForAttackRating(Math.max(0, hellWallsMulti * hellTargetFortressDamage - hellTurretPower)); // don't go below 0

            // Always have at least half our hell contingent available for patrols, and if we cant defend properly just send everyone
            if (availableHellSoldiers < hellGarrison) {
                hellGarrison = 0; // If we cant defend adequately, send everyone out on patrol
            } else if (availableHellSoldiers < hellGarrison * 2) {
                hellGarrison = Math.floor(availableHellSoldiers / 2); // Always try to send out at least half our people
            }

            // Determine the patrol attack rating
            if (settings.hellHandlePatrolSize) {
                let patrolRating = game.global.portal.fortress.threat * settings.hellPatrolThreatPercent / 100;

                // Now reduce rating based on drones, droids and bootcamps
                if (game.global.portal.war_drone) {
                    patrolRating -= settings.hellPatrolDroneMod * game.global.portal.war_drone.on * (game.global.tech['portal'] >= 7 ? 1.5 : 1);
                }
                if (game.global.portal.war_droid) {
                    patrolRating -= settings.hellPatrolDroidMod * game.global.portal.war_droid.on * (game.global.tech['hdroid'] ? 2 : 1);
                }
                if (game.global.city.boot_camp) {
                    patrolRating -= settings.hellPatrolBootcampMod * game.global.city.boot_camp.count;
                }

                // In the end, don't go lower than the minimum...
                patrolRating = Math.max(patrolRating, settings.hellPatrolMinRating);

                // Increase patrol attack rating if alive soldier count is low to reduce patrol losses
                if (settings.hellBolsterPatrolRating > 0 && settings.hellBolsterPatrolPercentTop > 0) { // Check if settings are on
                    const homeGarrisonFillRatio = m.currentCityGarrison / m.maxCityGarrison;
                    if (homeGarrisonFillRatio <= settings.hellBolsterPatrolPercentTop / 100) { // If less than top
                        if (homeGarrisonFillRatio <= settings.hellBolsterPatrolPercentBottom / 100) { // and less than bottom
                            patrolRating += settings.hellBolsterPatrolRating; // add full rating
                        } else if (settings.hellBolsterPatrolPercentBottom < settings.hellBolsterPatrolPercentTop) { // If between bottom and top
                            patrolRating += settings.hellBolsterPatrolRating * (settings.hellBolsterPatrolPercentTop / 100 - homeGarrisonFillRatio) // add rating proportional to where in the range we are
                                              / (settings.hellBolsterPatrolPercentTop - settings.hellBolsterPatrolPercentBottom) * 100;
                        }
                    }
                }

                // Patrol size
                targetHellPatrolSize = m.getSoldiersForAttackRating(patrolRating);

                // If patrol size is larger than available soldiers, send everyone available instead of 0
                targetHellPatrolSize = Math.min(targetHellPatrolSize, availableHellSoldiers - hellGarrison);
            } else {
                targetHellPatrolSize = m.hellPatrolSize;
            }

            // Determine patrol count
            targetHellPatrols = Math.floor((availableHellSoldiers - hellGarrison) / targetHellPatrolSize);

            // Special logic for small number of patrols
            if (settings.hellHandlePatrolSize && targetHellPatrols === 1) {
                // If we could send 1.5 patrols, send 3 half-size ones instead
                if ((availableHellSoldiers - hellGarrison) >= 1.5 * targetHellPatrolSize) {
                    targetHellPatrolSize = Math.floor((availableHellSoldiers - hellGarrison) / 3);
                    targetHellPatrols = Math.floor((availableHellSoldiers - hellGarrison) / targetHellPatrolSize);
                }
            }
        } else {
            // Try to leave hell if any soldiers are still assigned so the game doesn't put miniscule amounts of soldiers back
            if (m.hellAssigned > 0) {
                m.removeHellPatrolSize(m.hellPatrolSize);
                m.removeHellPatrol(m.hellPatrols);
                m.removeHellGarrison(m.hellSoldiers);
                return;
            }
        }

        // Adjust values ingame
        // First decrease patrols, then put hell soldiers to the right amount, then increase patrols, to make sure all actions go through
        if (settings.hellHandlePatrolSize && m.hellPatrolSize > targetHellPatrolSize) m.removeHellPatrolSize(m.hellPatrolSize - targetHellPatrolSize);
        if (m.hellPatrols > targetHellPatrols) m.removeHellPatrol(m.hellPatrols - targetHellPatrols);
        if (m.hellSoldiers > targetHellSoldiers) m.removeHellGarrison(m.hellSoldiers - targetHellSoldiers);
        if (m.hellSoldiers < targetHellSoldiers) m.addHellGarrison(targetHellSoldiers - m.hellSoldiers);
        if (settings.hellHandlePatrolSize && m.hellPatrolSize < targetHellPatrolSize) m.addHellPatrolSize(targetHellPatrolSize - m.hellPatrolSize);
        if (m.hellPatrols < targetHellPatrols) m.addHellPatrol(targetHellPatrols - m.hellPatrols);
    }

    // TODO: Assign jobs in one loop, so colonists and entertaines could be put above hunters
    function autoJobs() {
        let jobList = JobManager.managedPriorityList();

        // No jobs unlocked yet
        if (jobList.length === 0) {
            return;
        }

        let farmerIndex = Math.max(jobList.indexOf(jobs.Hunter), jobList.indexOf(jobs.Farmer));
        let lumberjackIndex = isDemonRace() && isLumberRace() ? farmerIndex : jobList.indexOf(jobs.Lumberjack);
        let quarryWorkerIndex = jobList.indexOf(jobs.QuarryWorker);
        let crystalMinerIndex = jobList.indexOf(jobs.CrystalMiner);
        let scavengerIndex = jobList.indexOf(jobs.Scavenger);

        let availableEmployees = jobList.reduce((total, job) => total + job.count, 0);
        let availableCraftsmen = JobManager.craftingMax();

        let crewMissing = game.global.civic.crew.max - game.global.civic.crew.workers;
        let minDefault = crewMissing > 0 ? crewMissing + 1 : 0;

        let requiredJobs = [];
        let jobAdjustments = [];

        // First figure out how many farmers are required
        let minFarmers = 0;
        if (farmerIndex !== -1) {
            let foodRateOfChange = resources.Food.rateOfChange;
            let minFoodStorage = resources.Food.maxQuantity * 0.2;
            let maxFoodStorage = resources.Food.maxQuantity * 0.6;
            if (game.global.race['ravenous']) { // Ravenous hunger
                minFoodStorage = resources.Population.currentQuantity * 1.5;
                maxFoodStorage = resources.Population.currentQuantity * 3;
                foodRateOfChange += Math.max(resources.Food.currentQuantity / traitVal('ravenous', 1), 0);
            }
            if (game.global.race['carnivore']) { // Food spoilage
                minFoodStorage = resources.Population.currentQuantity;
                maxFoodStorage = resources.Population.currentQuantity * 2;
                if (resources.Food.currentQuantity > 10) {
                    foodRateOfChange += (resources.Food.currentQuantity - 10) * 0.5 * (0.9 ** buildings.Smokehouse.count);
                }
            }

            if (jobList.length === (jobList.indexOf(jobs.Unemployed) === -1 ? 1 : 2)) {
                // No other jobs are unlocked - everyone on farming!
                requiredJobs[farmerIndex] = availableEmployees;
            } else if (resources.Population.currentQuantity > state.lastPopulationCount) {
                let populationChange = resources.Population.currentQuantity - state.lastPopulationCount;
                let farmerChange = jobList[farmerIndex].count - state.lastFarmerCount;

                if (populationChange === farmerChange && foodRateOfChange > 0) {
                    requiredJobs[farmerIndex] = jobList[farmerIndex].count - populationChange;
                } else {
                    requiredJobs[farmerIndex] = jobList[farmerIndex].count;
                }
            } else if (resources.Food.isCapped()) {
                // Full food storage, remove all farmers instantly
                requiredJobs[farmerIndex] = 0;
            } else if (resources.Food.currentQuantity + foodRateOfChange / ticksPerSecond() < minFoodStorage) {
                // We want food to fluctuate between 0.2 and 0.6 only. We only want to add one per loop until positive
                if (jobList[farmerIndex].count === 0) { // We can't calculate production with no workers, assign one first
                    requiredJobs[farmerIndex] = 1;
                } else {
                    let foodPerWorker = resources.Food.getProduction("job_" + jobList[farmerIndex].id) / jobList[farmerIndex].count;
                    let missingWorkers = Math.ceil(foodRateOfChange / -foodPerWorker) || 0;
                    requiredJobs[farmerIndex] = Math.max(1, jobList[farmerIndex].count + missingWorkers);
                }
            } else if (resources.Food.currentQuantity > maxFoodStorage && foodRateOfChange > 0) {
                // We want food to fluctuate between 0.2 and 0.6 only. We only want to remove one per loop until negative
                requiredJobs[farmerIndex] = jobList[farmerIndex].count - 1;
            } else {
                // We're good; leave farmers as they are
                requiredJobs[farmerIndex] = jobList[farmerIndex].count;
            }

            requiredJobs[farmerIndex] = Math.min(requiredJobs[farmerIndex], availableEmployees);
            requiredJobs[farmerIndex] = Math.max(requiredJobs[farmerIndex], 0);

            jobAdjustments[farmerIndex] = requiredJobs[farmerIndex] - jobList[farmerIndex].count;
            availableEmployees -= requiredJobs[farmerIndex];
            minFarmers = requiredJobs[farmerIndex];
        }

        // We're only crafting when we have enough population to fill farmers, all foundries, and still have some employees for other work.
        if (settings.autoCraftsmen && availableEmployees > availableCraftsmen * 2) {
            availableEmployees -= availableCraftsmen;
        } else {
            availableCraftsmen = 0;
        }

        // Now assign crafters
        if (settings.autoCraftsmen){
            // Taken from game source, no idea what this "140" means.
            let speed = game.global.genes['crafty'] ? 2 : 1;
            let costMod = speed * traitVal('resourceful', 0, '-') / 140;

            // Get list of craftabe resources
            let availableJobs = [];
            for (let i = 0; i < JobManager.craftingJobs.length; i++) {
                let job = JobManager.craftingJobs[i];
                let resource = job.resource;
                // Check if we're allowed to craft this resource
                if (!job.isManaged() || !resource.autoCraftEnabled || (settings.jobDisableCraftsmans && !game.global.race['no_craft'] && job !== jobs.Scarletite && job !== jobs.Quantium)) {
                    continue;
                }
                // And have enough resources to craft it for at least 2 ticks
                let afforableAmount = availableCraftsmen;
                for (let res in resource.cost) {
                    let reqResource = resources[res];
                    if (!resource.isDemanded() && ((!settings.useDemanded && reqResource.isDemanded()) || reqResource.storageRatio < resource.craftPreserve)) {
                        afforableAmount = 0;
                        break;
                    } else {
                        afforableAmount = Math.min(afforableAmount, (resource.rateOfChange + reqResource.currentQuantity) / (resource.cost[res] * costMod) / 2 * ticksPerSecond());
                    }
                }

                // Assigning non-foundry crafters right now, so it won't be filtered out by priority checks below, as we want to have them always crafted among with regular craftables
                let craftBuilding = job === jobs.Scarletite ? buildings.RuinsHellForge :
                                    job === jobs.Quantium ? buildings.EnceladusZeroGLab :
                                    null;
                if (craftBuilding) {
                    let craftMax = craftBuilding.stateOnCount;
                    if (afforableAmount < craftMax) {
                        jobAdjustments[jobList.indexOf(job)] = 0 - job.count;
                    } else {
                        jobAdjustments[jobList.indexOf(job)] = craftMax - job.count;
                        availableCraftsmen -= craftMax;
                    }
                } else if (afforableAmount >= availableCraftsmen){
                    availableJobs.push(job);
                }
            }

            let requestedJobs = availableJobs.filter(job => job.resource.isDemanded());
            if (requestedJobs.length > 0) {
                availableJobs = requestedJobs;
            } else if (settings.productionFoundryWeighting === "demanded") {
                let usefulJobs = availableJobs.filter(job => job.resource.currentQuantity < job.resource.storageRequired);
                if (usefulJobs.length > 0) {
                    availableJobs = usefulJobs;
                }
            }

            if (settings.productionFoundryWeighting === "buildings" && state.unlockedBuildings.length > 0) {
                let scaledWeightings = Object.fromEntries(availableJobs.map(job => [job.id, (state.unlockedBuildings.find(building => building.cost[job.resource.id] > job.resource.currentQuantity)?.weighting ?? 0) * job.resource.craftWeighting]));
                availableJobs.sort((a, b) => (a.resource.currentQuantity / scaledWeightings[a.id]) - (b.resource.currentQuantity / scaledWeightings[b.id]));
            } else {
                availableJobs.sort((a, b) => (a.resource.currentQuantity / a.resource.craftWeighting) - (b.resource.currentQuantity / b.resource.craftWeighting));
            }

            for (let i = 0; i < JobManager.craftingJobs.length; i++) {
                let job = JobManager.craftingJobs[i];
                let jobIndex = jobList.indexOf(job);

                if (jobIndex === -1 || job === jobs.Scarletite || job === jobs.Quantium) {
                    continue;
                }

                // Having empty array and undefined availableJobs[0] is fine - we still need to remove other crafters.
                if (job === availableJobs[0]){
                    jobAdjustments[jobIndex] = availableCraftsmen - job.count;
                } else {
                    jobAdjustments[jobIndex] = 0 - job.count;
                }
            }

            // We didn't assigned crafter for some reason, return employees so we can use them somewhere else
            if (availableJobs[0] === undefined){
                availableEmployees += availableCraftsmen;
            }
        }

        let minersDisabled = settings.jobDisableMiners && buildings.GatewayStarbase.count > 0;
        let hoovedMiner = game.global.race.hooved && !isLumberRace() && !minersDisabled  && availableEmployees > 0 ? jobList.indexOf(jobs.Miner) : -1;

        // Make sure our hooved have miner for horseshoes
        if (hoovedMiner !== -1) {
            requiredJobs[hoovedMiner] = 1;
            jobAdjustments[hoovedMiner] = 1 - jobs.Miner.count;
            availableEmployees--;
        }

        state.maxSpaceMiners = 0;
        // And deal with the rest now
        for (let i = 0; i < 3; i++) {
            for (let j = 0; j < jobList.length; j++) {
                let job = jobList[j];

                // Don't assign 3rd breakpoints for jobs we're going to split, just first two to reserve some workers
                if (i === 2 && (j === lumberjackIndex || j === quarryWorkerIndex || j === crystalMinerIndex || j === scavengerIndex)) {
                    continue;
                }

                // We've already done with crafters
                if (job instanceof CraftingJob) {
                    continue;
                }

                let currentEmployees = requiredJobs[j] ?? 0;
                availableEmployees += currentEmployees;

                let minEmployees = job.isDefault() ? minDefault : 0;
                let currentBreakpoint = (job === jobs.Hunter && isDemonRace() && isLumberRace()) ? jobs.Lumberjack.breakpointEmployees(i) : job.breakpointEmployees(i);
                let jobsToAssign = Math.min(availableEmployees, Math.max(minEmployees, currentEmployees, currentBreakpoint));

                if (job === jobs.SpaceMiner) {
                    let maxBreakpoint = job.getBreakpoint(i);
                    state.maxSpaceMiners = Math.max(state.maxSpaceMiners, Math.min(availableEmployees, maxBreakpoint < 0 ? Number.MAX_SAFE_INTEGER : maxBreakpoint));
                    let minersNeeded = buildings.BeltEleriumShip.stateOnCount * 2 + buildings.BeltIridiumShip.stateOnCount + buildings.BeltIronShip.stateOnCount;
                    jobsToAssign = Math.min(jobsToAssign, minersNeeded);
                }

                if (job === jobs.Entertainer && !haveTech("superstar")) {
                    let taxBuffer = (settings.autoTax || haveTask("tax")) && game.global.civic.taxes.tax_rate < poly.taxCap(false) ? 1 : 0;
                    let entertainerMorale = (game.global.tech['theatre'] + traitVal('musical', 0)) * traitVal('emotionless', 0, '-');
                    let moraleExtra = resources.Morale.rateOfChange - resources.Morale.maxQuantity - taxBuffer;
                    let entertainersDelta = Math.floor(moraleExtra / entertainerMorale);
                    jobsToAssign = Math.min(jobsToAssign, job.count - entertainersDelta);
                }

                // TODO: Remove extra bankers when cap not needed
                // Don't assign bankers if our money is maxed and bankers aren't contributing to our money storage cap
                if (job === jobs.Banker && (resources.Money.isCapped() || game.global.civic.taxes.tax_rate <= 0) && !haveTech("banking", 7)) {
                    jobsToAssign = 0;
                }
                // Don't assign miners and Andromeda
                if ((job === jobs.Miner || job === jobs.CoalMiner) && minersDisabled) {
                    jobsToAssign = 0;
                }

                // Races with the Intelligent trait get bonus production based on the number of professors and scientists
                // Only unassign them when knowledge is max if the race is not intelligent
                // Once we've research shotgun sequencing we get boost and soon autoassemble genes so stop unassigning
                if (!game.global.race['intelligent'] && !haveTech("genetics", 5)) {
                    // Don't assign professors if our knowledge is maxed and professors aren't contributing to our temple bonus
                    if (job === jobs.Professor && resources.Knowledge.isCapped() && !haveTech("fanaticism", 2)) {
                        jobsToAssign = 0;
                    }

                    // Don't assign scientists if our knowledge is maxed and scientists aren't contributing to our knowledge cap
                    if (job === jobs.Scientist && resources.Knowledge.isCapped() && !haveTech("science", 5)) {
                        jobsToAssign = 0;
                    }
                }

                if (job === jobs.CrystalMiner && !resources.Crystal.isUseful()) {
                    jobsToAssign = Math.min(jobsToAssign, resources.Crystal.getBusyWorkers("job_crystal_miner", jobs.CrystalMiner.count));
                }
                if (job === jobs.CementWorker) {
                    let stoneRateOfChange = resources.Stone.rateOfChange + (job.count * 3) - 5;
                    if (game.global.race['smoldering'] && settings.autoQuarry) {
                        stoneRateOfChange += resources.Chrysotile.rateOfChange;
                    }
                    jobsToAssign = Math.min(jobsToAssign, Math.floor(stoneRateOfChange / 3));
                    if (!resources.Cement.isUseful()) {
                        jobsToAssign = Math.min(jobsToAssign, resources.Cement.getBusyWorkers("city_cement_plant_bd", jobs.CementWorker.count));
                    }
                }

                if (job === jobs.Surveyor && game.global.portal.fortress.threat > 9000 && resources.Population.storageRatio < 1) {
                    jobsToAssign = 0;
                }

                jobsToAssign = Math.max(0, jobsToAssign);
                requiredJobs[j] = jobsToAssign;
                jobAdjustments[j] = jobsToAssign - job.count;
                availableEmployees -= jobsToAssign;
            }

            // No more workers available
            if (availableEmployees <= 0) {
                break;
            }
        }

        // Avoid adjusting both tax and entertainers at same tick, it can cause flickering
        let entertainerIndex = jobList.indexOf(jobs.Entertainer);
        if (entertainerIndex !== -1 && jobAdjustments[entertainerIndex] !== 0) {
            resources.Morale.incomeAdusted = true;
        }

        let splitJobs = [];
        if (lumberjackIndex !== -1) splitJobs.push( { jobIndex: lumberjackIndex, job: jobs.Lumberjack, weighting: settings.jobLumberWeighting} );
        if (quarryWorkerIndex !== -1) splitJobs.push( { jobIndex: quarryWorkerIndex, job: jobs.QuarryWorker, weighting: settings.jobQuarryWeighting});
        if (crystalMinerIndex !== -1 && resources.Crystal.isUseful()) splitJobs.push( { jobIndex: crystalMinerIndex, job: jobs.CrystalMiner, weighting: settings.jobCrystalWeighting});
        if (scavengerIndex !== -1) splitJobs.push( { jobIndex: scavengerIndex, job: jobs.Scavenger, weighting: settings.jobScavengerWeighting});

        // Balance lumberjacks, quarry workers, crystal miners and scavengers if they are unlocked
        if (splitJobs.length > 0) {
            // Reduce jobs required down to minimum and add them to the available employee pool so that we can split them according to weightings
            splitJobs.forEach(jobDetails => {
                let minEmployees = 0;
                if (jobDetails.jobIndex === farmerIndex) {
                    minEmployees = Math.max(minEmployees, minFarmers);
                }
                if (jobList[jobDetails.jobIndex].isDefault()) {
                    minEmployees = Math.max(minEmployees, minDefault);
                }
                availableEmployees += requiredJobs[jobDetails.jobIndex] - minEmployees;
                requiredJobs[jobDetails.jobIndex] = minEmployees;
                jobAdjustments[jobDetails.jobIndex] = minEmployees - jobList[jobDetails.jobIndex].count;
            });

            // Bring them all up to required breakpoints, one each at a time
            let splitSorter = (a, b) => ((requiredJobs[a.jobIndex] / a.weighting) - (requiredJobs[b.jobIndex] / b.weighting)) || a.jobIndex - b.jobIndex;
            for (let b = 0; b < 3 && availableEmployees > 0; b++) {
                let remainingJobs = splitJobs.slice();
                while (availableEmployees > 0 && remainingJobs.length > 0) {
                    let jobDetails = remainingJobs.sort(splitSorter)[0];
                    if (b == 2 || requiredJobs[jobDetails.jobIndex] < jobDetails.job.breakpointEmployees(b)) {
                        requiredJobs[jobDetails.jobIndex]++;
                        jobAdjustments[jobDetails.jobIndex]++;
                        availableEmployees--;
                    } else {
                        remainingJobs.shift();
                    }
                }
            }
        } else {
            // No lumberjacks, quarry workers, crystal miners or scavengers...
            if (farmerIndex !== -1) {
                requiredJobs[farmerIndex] += availableEmployees;
                jobAdjustments[farmerIndex] += availableEmployees;
                availableEmployees = 0;
            }
        }

        for (let i = 0; i < jobAdjustments.length; i++) {
            let adjustment = jobAdjustments[i];
            if (adjustment < 0) {
                jobList[i].removeWorkers(-1 * adjustment);
            }
        }

        for (let i = 0; i < jobAdjustments.length; i++) {
            let adjustment = jobAdjustments[i];
            if (adjustment > 0) {
                jobList[i].addWorkers(adjustment);
            }
        }

        state.lastPopulationCount = resources.Population.currentQuantity;
        state.lastFarmerCount = jobList[farmerIndex]?.count ?? 0;

        // After reassignments adjust default job to something with workers, we need that for sacrifices.
        // Unless we're already assigning to default, and don't want it to be changed now
        if (settings.jobSetDefault && minDefault === 0) {
            /*if (jobs.Forager.isManaged() && requiredJobs[jobList.indexOf(jobs.Forager)] > 0) {
                jobs.Forager.setAsDefault();
            } else*/
            if (jobs.QuarryWorker.isManaged() && requiredJobs[quarryWorkerIndex] > 0) {
                jobs.QuarryWorker.setAsDefault();
            } else if (jobs.Lumberjack.isManaged() && requiredJobs[lumberjackIndex] > 0) {
                jobs.Lumberjack.setAsDefault();
            } else if (jobs.CrystalMiner.isManaged() && requiredJobs[crystalMinerIndex] > 0) {
                jobs.CrystalMiner.setAsDefault();
            } else if (jobs.Scavenger.isManaged() && requiredJobs[scavengerIndex] > 0) {
                jobs.Scavenger.setAsDefault();
            } else if (jobs.Farmer.isManaged()) {
                jobs.Farmer.setAsDefault();
            } else if (jobs.Hunter.isManaged()) {
                jobs.Hunter.setAsDefault();
            } else if (jobs.Unemployed.isManaged()) {
                jobs.Unemployed.setAsDefault();
            }
        }
    }

    function autoTax() {
        if (resources.Morale.incomeAdusted || haveTask("tax")) {
            return;
        }

        let taxVue = getVueById('tax_rates');
        if (taxVue === undefined || !game.global.civic.taxes.display) {
            return;
        }

        let currentTaxRate = game.global.civic.taxes.tax_rate;
        let currentMorale = resources.Morale.currentQuantity;
        let realMorale = resources.Morale.rateOfChange;
        let maxMorale = resources.Morale.maxQuantity;
        let minMorale = settings.generalMinimumMorale;

        let maxTaxRate = poly.taxCap(false);
        let minTaxRate = poly.taxCap(true);
        if (resources.Money.storageRatio < 0.9 && !game.global.race['banana']) {
            minTaxRate = Math.max(minTaxRate, settings.generalMinimumTaxRate);
        }

        let optimalTax = game.global.race['banana'] ? minTaxRate :
                         resources.Money.isDemanded() ? maxTaxRate :
                         Math.round((maxTaxRate - minTaxRate) * Math.max(0, 0.9 - resources.Money.storageRatio)) + minTaxRate;

        if (!game.global.race['banana']) {
            if (currentTaxRate < 20) { // Exposed morale cap includes bonus of current low taxes, roll it back
                maxMorale -= 10 - Math.floor(currentTaxRate / 2);
            }
            if (optimalTax < 20) {  // And add full bonus if we actually need it
                maxMorale += 10 - Math.floor(minTaxRate / 2);
            }
        }
        if (resources.Money.storageRatio < 0.9) {
            maxMorale = Math.min(maxMorale, settings.generalMaximumMorale);
        }

        if (currentTaxRate < maxTaxRate && currentMorale >= minMorale + 1 &&
              (currentTaxRate < optimalTax || currentMorale >= maxMorale + 1 || (realMorale >= currentMorale + 1 && optimalTax >= 20))) {
            resetMultiplier();
            taxVue.add();
            resources.Morale.incomeAdusted = true;
        }

        if (currentTaxRate > minTaxRate && currentMorale < maxMorale &&
              (currentTaxRate > optimalTax || currentMorale < minMorale)) {
            resetMultiplier();
            taxVue.sub();
            resources.Morale.incomeAdusted = true;
        }

    }

    function autoAlchemy() {
        let m = AlchemyManager;
        if (!m.isUnlocked()) {
            return;
        }

        let fullList = m.managedPriorityList();
        let adjustAlchemy = Object.fromEntries(fullList.map(res => [res.id, m.currentCount(res.id) * -1]));

        // Calculate required transmutations
        if (!resources.Crystal.isDemanded()) {
            let activeList = fullList.filter(res => m.resWeighting(res.id) > 0 && res.isUseful());
            let totalWeigthing = 0, currentTransmute = 0;
            for (let res of activeList) {
                totalWeigthing += m.resWeighting(res.id);
                currentTransmute += m.currentCount(res.id);
            }
            let manaAvailable = (currentTransmute + resources.Mana.rateOfChange) * settings.magicAlchemyManaUse;
            let crystalAvailable = currentTransmute / 2 + resources.Crystal.currentQuantity + resources.Crystal.rateOfChange;
            let maxTransmute = Math.floor(Math.min(manaAvailable, crystalAvailable * 2));
            activeList.forEach(res => adjustAlchemy[res.id] += Math.floor(maxTransmute * (m.resWeighting(res.id) / totalWeigthing)));
        }

        // Apply adjustment
        Object.entries(adjustAlchemy).forEach(([id, delta]) => delta < 0 && m.transmuteLess(id, delta * -1));
        Object.entries(adjustAlchemy).forEach(([id, delta]) => delta > 0 && m.transmuteMore(id, delta));
    }

    function autoPylon() {
        let m = RitualManager;
        // If not unlocked then nothing to do
        if (!m.initIndustry()) {
            return;
        }

        let spells = Object.values(m.Productions).filter(spell => spell.isUnlocked());

        // Init adjustment, and sort groups by priorities
        let pylonAdjustments = Object.fromEntries(spells.map(spell => [spell.id, 0]));
        let manaToUse = resources.Mana.rateOfChange * (resources.Mana.storageRatio > 0.99 ? 1 : settings.productionRitualManaUse);
        let usableMana = manaToUse;

        let spellSorter = (a, b) => ((pylonAdjustments[a.id] / a.weighting) - (pylonAdjustments[b.id] / b.weighting)) || b.weighting - a.weighting;
        let remainingSpells = spells.filter(spell => spell.weighting > 0 && (spell !== m.Productions.Factory || jobs.CementWorker.count > 0)).sort(spellSorter);
        spellsLoop:
        while(remainingSpells.length > 0) {
            let spell = remainingSpells.shift();
            let amount = pylonAdjustments[spell.id];
            let cost = m.costStep(amount);

            if (cost <= manaToUse) {
                pylonAdjustments[spell.id] = amount + 1;
                manaToUse -= cost;
                // Insert spell back to array keeping it sorted
                for (let i = remainingSpells.length - 1; i >= 0; i--) {
                    if (spellSorter(spell, remainingSpells[i]) > 0) {
                        remainingSpells.splice(i + 1, 0, spell);
                        continue spellsLoop;
                    }
                }
                remainingSpells.unshift(spell);
            }
        }
        resources.Mana.rateOfChange - (usableMana - manaToUse);

        let pylonDeltas = spells.map((spell) => pylonAdjustments[spell.id] - m.currentSpells(spell));

        spells.forEach((spell, index) => pylonDeltas[index] < 0 && m.decreaseRitual(spell, pylonDeltas[index] * -1));
        spells.forEach((spell, index) => pylonDeltas[index] > 0 && m.increaseRitual(spell, pylonDeltas[index]));
    }

    function autoQuarry() {
        // Nothing to do here with no quarry, or smoldering
        if (!QuarryManager.initIndustry()) {
            return;
        }

        let chrysotileWeigth = resources.Chrysotile.isDemanded() ? Number.MAX_SAFE_INTEGER : (100 - resources.Chrysotile.storageRatio * 100);
        let stoneWeigth = resources.Stone.isDemanded() ? Number.MAX_SAFE_INTEGER : (100 - resources.Stone.storageRatio * 100);
        if (buildings.MetalRefinery.count > 0) {
            stoneWeigth = Math.max(stoneWeigth, resources.Aluminium.isDemanded() ? Number.MAX_SAFE_INTEGER : (100 - resources.Aluminium.storageRatio * 100));
        }
        chrysotileWeigth *= settings.productionChrysotileWeight;

        let newAsbestos = Math.round(chrysotileWeigth / (chrysotileWeigth + stoneWeigth) * 100);

        if (newAsbestos !== QuarryManager.currentAsbestos()) {
            QuarryManager.increaseAsbestos(newAsbestos - QuarryManager.currentAsbestos());
        }
    }

    function autoSmelter() {
        // No smelter; no auto smelter. No soup for you.
        let m = SmelterManager;
        if (game.global.race['steelen'] || !m.initIndustry()) {
            return;
        }

        // Only adjust fuels if race does not have forge trait which means they don't require smelter fuel
        let totalSmelters = m.maxOperating();
        let fuelRemoved = 0;
        if (!game.global.race['forge']) {
            let remainingSmelters = totalSmelters;

            let fuels = m.managedFuelPriorityList();
            let fuelAdjust = {};
            for (let i = 0; i < fuels.length; i++) {
                let fuel = fuels[i];
                if (!fuel.unlocked) {
                    continue;
                }

                let maxAllowedUnits = remainingSmelters;

                // Adjust Inferno to Oil ratio for better efficiency and cost
                if (fuel === m.Fuels.Inferno && fuels[i+1] === m.Fuels.Oil && remainingSmelters > 75) {
                    maxAllowedUnits = Math.floor(0.5 * remainingSmelters + 37.5);
                }

                for (let productionCost of fuel.cost) {
                    let resource = productionCost.resource;
                    if (resource.storageRatio < 0.8 || resource === resources.StarPower){
                        let remainingRateOfChange = resource.rateOfChange + (m.fueledCount(fuel) * productionCost.quantity);
                        // No need to preserve minimum income when storage is full
                        if (resource.storageRatio < 0.98) {
                            remainingRateOfChange -= productionCost.minRateOfChange;
                        }

                        let affordableAmount = Math.max(0, Math.floor(remainingRateOfChange / productionCost.quantity));
                        maxAllowedUnits = Math.min(maxAllowedUnits, affordableAmount);
                    }
                }

                remainingSmelters -= maxAllowedUnits;
                fuelAdjust[fuel.id] = maxAllowedUnits - m.fueledCount(fuel);
            }

            for (let fuel of fuels) {
                if (fuelAdjust[fuel.id] < 0) {
                    fuelRemoved += fuelAdjust[fuel.id] * -1;
                    m.decreaseFuel(fuel, fuelAdjust[fuel.id] * -1);
                }
            }

            for (let fuel of fuels) {
                if (fuelAdjust[fuel.id] > 0) {
                    m.increaseFuel(fuel, fuelAdjust[fuel.id]);
                }
            }
            totalSmelters -= remainingSmelters;
        }

        let smelterIronCount = m.smeltingCount(m.Productions.Iron);
        let smelterSteelCount = m.smeltingCount(m.Productions.Steel);
        let smelterIridiumCount = m.smeltingCount(m.Productions.Iridium);

        let maxAllowedIridium = m.Productions.Iridium.unlocked && !resources.Iridium.isCapped()
          ? Math.floor(settings.productionSmeltingIridium * totalSmelters) : 0;
        let maxAllowedSteel = totalSmelters - smelterIridiumCount;

        let smeltAdjust = {
            Iridium: maxAllowedIridium - smelterIridiumCount,
            Steel: smelterIridiumCount - maxAllowedIridium,
        };

        // Adjusting fuel can move production from steel to iron, we need to account that
        if (fuelRemoved > smelterIronCount) {
            let steelRemoved = fuelRemoved - smelterIronCount;
            if (steelRemoved <= smelterSteelCount) {
                smeltAdjust.Steel += steelRemoved;
            } else {
                smeltAdjust.Steel += smelterSteelCount;
                smeltAdjust.Iridium += steelRemoved - smelterSteelCount;
            }
        }

        // We only care about steel. It isn't worth doing a full generic calculation here
        // Just assume that smelters will always be fueled so Iron smelting is unlimited
        // We want to work out the maximum steel smelters that we can have based on our resource consumption
        let steelSmeltingConsumption = m.Productions.Steel.cost;
        for (let productionCost of steelSmeltingConsumption) {
            let resource = productionCost.resource;
            if (resource.storageRatio < 0.8){
                let remainingRateOfChange = resource.rateOfChange + (smelterSteelCount * productionCost.quantity);
                // No need to preserve minimum income when storage is full
                if (resource.storageRatio < 0.98) {
                    remainingRateOfChange -= productionCost.minRateOfChange;
                }

                let affordableAmount = Math.max(0, Math.floor(remainingRateOfChange / productionCost.quantity));
                maxAllowedSteel = Math.min(maxAllowedSteel, affordableAmount);
            }
        }

        let ironWeighting = 0;
        let steelWeighting = 0;
        switch (settings.productionSmelting){
            case "iron":
                ironWeighting = resources.Iron.timeToFull;
                if (!ironWeighting) {
                    steelWeighting = resources.Steel.timeToFull;
                }
                break;
            case "steel":
                steelWeighting = resources.Steel.timeToFull;
                if (!steelWeighting) {
                    ironWeighting = resources.Iron.timeToFull;
                }
                break;
            case "storage":
                ironWeighting = resources.Iron.timeToFull;
                steelWeighting = resources.Steel.timeToFull;
                break;
            case "required":
                ironWeighting = resources.Iron.timeToRequired;
                steelWeighting = resources.Steel.timeToRequired;
                break;
        }

        if (resources.Iron.isDemanded()) {
            ironWeighting = Number.MAX_SAFE_INTEGER;
        }
        if (resources.Steel.isDemanded()) {
            steelWeighting = Number.MAX_SAFE_INTEGER;
        }

        // We have more steel than we can afford OR iron income is too low
        if (smelterSteelCount > maxAllowedSteel || smelterSteelCount > 0 && ironWeighting > steelWeighting) {
            smeltAdjust.Steel--;
        }

        // We can afford more steel AND either steel income is too low OR both steel and iron full, but we can use steel smelters to increase titanium income
        if (smelterSteelCount < maxAllowedSteel && smelterIronCount > 0 &&
             ((steelWeighting > ironWeighting) ||
              (steelWeighting === 0 && ironWeighting === 0 && resources.Titanium.storageRatio < 0.99 && haveTech("titanium")))) {
            smeltAdjust.Steel++;
        }

        smeltAdjust.Iron = totalSmelters - (smelterIronCount + smelterSteelCount + smeltAdjust.Steel + smelterIridiumCount + smeltAdjust.Iridium);
        Object.entries(smeltAdjust).forEach(([id, delta]) => delta < 0 && m.decreaseSmelting(id, delta * -1));
        Object.entries(smeltAdjust).forEach(([id, delta]) => delta > 0 && m.increaseSmelting(id, delta));
    }

    function autoFactory() {
        // No factory; no auto factory
        if (!FactoryManager.initIndustry()) {
            return;
        }

        let allProducts = Object.values(FactoryManager.Productions);

        // Init adjustment, and sort groups by priorities
        let priorityGroups = {};
        let factoryAdjustments = {};
        for (let i = 0; i < allProducts.length; i++) {
            let production = allProducts[i];
            if (production.unlocked && production.enabled) {
                if (production.weighting > 0) {
                    let priority = production.resource.isDemanded() ? Math.max(production.priority, 100) : production.priority;
                    if (priority !== 0) {
                        priorityGroups[priority] = priorityGroups[priority] ?? [];
                        priorityGroups[priority].push(production);
                    }
                }
                factoryAdjustments[production.id] = 0;
            }
        }
        let priorityList = Object.keys(priorityGroups).sort((a, b) => b - a).map(key => priorityGroups[key]);
        if (priorityGroups["-1"] && priorityList.length > 1) {
            priorityList.splice(priorityList.indexOf(priorityGroups["-1"], 1));
            priorityList[0].push(...priorityGroups["-1"]);
        }

        // Calculate amount of factories per product
        let remainingFactories = FactoryManager.maxOperating();
        for (let i = 0; i < priorityList.length && remainingFactories > 0; i++) {
            let products = priorityList[i].sort((a, b) => a.weighting - b.weighting);
            while (remainingFactories > 0) {
                let factoriesToDistribute = remainingFactories;
                let totalPriorityWeight = products.reduce((sum, production) => sum + production.weighting, 0);

                for (let j = products.length - 1; j >= 0 && remainingFactories > 0; j--) {
                    let production = products[j];

                    let calculatedRequiredFactories = Math.min(remainingFactories, Math.max(1, Math.floor(factoriesToDistribute / totalPriorityWeight * production.weighting)));
                    let actualRequiredFactories = calculatedRequiredFactories;

                    if (!production.resource.isUseful()) {
                        actualRequiredFactories = 0;
                    }

                    for (let resourceCost of production.cost) {
                        if (!resourceCost.resource.isUnlocked()) {
                            continue;
                        }
                        if (!production.resource.isDemanded() && ((!settings.useDemanded && resourceCost.resource.isDemanded()) || resourceCost.resource.storageRatio < settings.productionFactoryMinIngredients)) {
                            actualRequiredFactories = 0;
                            break;
                        }
                        if (resourceCost.resource.storageRatio < 0.8){
                            let previousCost = FactoryManager.currentProduction(production) * resourceCost.quantity;
                            let currentCost = factoryAdjustments[production.id] * resourceCost.quantity;
                            let rate = resourceCost.resource.rateOfChange + previousCost - currentCost;
                            if (resourceCost.resource.storageRatio < 0.98) {
                                rate -= resourceCost.minRateOfChange;
                            }
                            if (production.resource.isDemanded()) {
                                rate += resourceCost.resource.currentQuantity;
                            }
                            let affordableAmount = Math.floor(rate / resourceCost.quantity);
                            actualRequiredFactories = Math.min(actualRequiredFactories, affordableAmount);
                        }
                    }

                    // If we're going for bioseed - try to balance neutronium\nanotubes ratio
                    if (settings.prestigeBioseedConstruct && settings.prestigeType === "bioseed" && production === FactoryManager.Productions.NanoTube && resources.Neutronium.currentQuantity < (game.global.race['truepath'] ? 500 : 250)) {
                        actualRequiredFactories = 0;
                    }

                    if (actualRequiredFactories > 0){
                        remainingFactories -= actualRequiredFactories;
                        factoryAdjustments[production.id] += actualRequiredFactories;
                    }

                    // We assigned less than wanted, i.e. we either don't need this product, or can't afford it. In both cases - we're done with it.
                    if (actualRequiredFactories < calculatedRequiredFactories) {
                        products.splice(j, 1);
                    }
                }

                if (factoriesToDistribute === remainingFactories) {
                    break;
                }
            }
        }

        // First decrease any production so that we have room to increase others
        for (let production of allProducts) {
            if (factoryAdjustments[production.id] !== undefined) {
                let deltaAdjustments = factoryAdjustments[production.id] - FactoryManager.currentProduction(production);

                if (deltaAdjustments < 0) {
                    FactoryManager.decreaseProduction(production, deltaAdjustments * -1);
                }
            }
        }

        // Increase any production required (if they are 0 then don't do anything with them)
        for (let production of allProducts) {
            if (factoryAdjustments[production.id] !== undefined) {
                let deltaAdjustments = factoryAdjustments[production.id] - FactoryManager.currentProduction(production);

                if (deltaAdjustments > 0) {
                    FactoryManager.increaseProduction(production, deltaAdjustments);
                }
            }
        }
    }

    function autoMiningDroid() {
        // If not unlocked then nothing to do
        if (!DroidManager.initIndustry()) {
            return;
        }

        let allProducts = Object.values(DroidManager.Productions);

        // Init adjustment, and sort groups by priorities
        let priorityGroups = {};
        let factoryAdjustments = {};
        for (let i = 0; i < allProducts.length; i++) {
            let production = allProducts[i];
            if (production.weighting > 0) {
                let priority = production.resource.isDemanded() ? Math.max(production.priority, 100) : production.priority;
                if (priority !== 0) {
                    priorityGroups[priority] = priorityGroups[priority] ?? [];
                    priorityGroups[priority].push(production);
                }
            }
            factoryAdjustments[production.id] = 0;
        }
        let priorityList = Object.keys(priorityGroups).sort((a, b) => b - a).map(key => priorityGroups[key]);
        if (priorityGroups["-1"] && priorityList.length > 1) {
            priorityList.splice(priorityList.indexOf(priorityGroups["-1"], 1));
            priorityList[0].push(...priorityGroups["-1"]);
        }

        // Calculate amount of factories per product
        let remainingFactories = DroidManager.maxOperating();
        for (let i = 0; i < priorityList.length && remainingFactories > 0; i++) {
            let products = priorityList[i].sort((a, b) => a.weighting - b.weighting);
            while (remainingFactories > 0) {
                let factoriesToDistribute = remainingFactories;
                let totalPriorityWeight = products.reduce((sum, production) => sum + production.weighting, 0);

                for (let j = products.length - 1; j >= 0 && remainingFactories > 0; j--) {
                    let production = products[j];

                    let calculatedRequiredFactories = Math.min(remainingFactories, Math.max(1, Math.floor(factoriesToDistribute / totalPriorityWeight * production.weighting)));
                    let actualRequiredFactories = calculatedRequiredFactories;
                    if (!production.resource.isUseful()) {
                        actualRequiredFactories = 0;
                    }

                    if (actualRequiredFactories > 0){
                        remainingFactories -= actualRequiredFactories;
                        factoryAdjustments[production.id] += actualRequiredFactories;
                    }

                    // We assigned less than wanted, i.e. we either don't need this product, or can't afford it. In both cases - we're done with it.
                    if (actualRequiredFactories < calculatedRequiredFactories) {
                        products.splice(j, 1);
                    }
                }

                if (factoriesToDistribute === remainingFactories) {
                    break;
                }
            }
        }
        if (remainingFactories > 0) {
            return;
        }

        // First decrease any production so that we have room to increase others
        for (let production of allProducts) {
            if (factoryAdjustments[production.id] !== undefined) {
                let deltaAdjustments = factoryAdjustments[production.id] - DroidManager.currentProduction(production);

                if (deltaAdjustments < 0) {
                    DroidManager.decreaseProduction(production, deltaAdjustments * -1);
                }
            }
        }

        // Increase any production required (if they are 0 then don't do anything with them)
        for (let production of allProducts) {
            if (factoryAdjustments[production.id] !== undefined) {
                let deltaAdjustments = factoryAdjustments[production.id] - DroidManager.currentProduction(production);

                if (deltaAdjustments > 0) {
                    DroidManager.increaseProduction(production, deltaAdjustments);
                }
            }
        }
    }

    function autoGraphenePlant() {
        // If not unlocked then nothing to do
        if (!GrapheneManager.initIndustry()) {
            return;
        }

        let remainingPlants = GrapheneManager.maxOperating();

        let sortedFuel = Object.values(GrapheneManager.Fuels).sort((a, b) => b.cost.resource.storageRatio < 0.995 || a.cost.resource.storageRatio < 0.995 ? b.cost.resource.storageRatio - a.cost.resource.storageRatio : b.cost.resource.rateOfChange - a.cost.resource.rateOfChange);
        for (let fuel of sortedFuel) {
            if (remainingPlants === 0) {
                return;
            }

            let resource = fuel.cost.resource;
            if (!resource.isUnlocked()) {
                continue;
            }

            let currentFuelCount = GrapheneManager.fueledCount(fuel);
            let maxFueledForConsumption = remainingPlants;
            if (!resources.Graphene.isUseful()) {
                maxFueledForConsumption = 0;
            } else if (resource.storageRatio < 0.8){
                let rateOfChange = resource.rateOfChange + fuel.cost.quantity * currentFuelCount;
                if (resource.storageRatio < 0.98) {
                    rateOfChange -= fuel.cost.minRateOfChange;
                }
                let affordableAmount = Math.floor(rateOfChange / fuel.cost.quantity);
                maxFueledForConsumption = Math.max(Math.min(maxFueledForConsumption, affordableAmount), 0);
            }

            let deltaFuel = maxFueledForConsumption - currentFuelCount;
            if (deltaFuel !== 0) {
                GrapheneManager.increaseFuel(fuel, deltaFuel);
            }

            remainingPlants -= currentFuelCount + deltaFuel;
        }
    }

    // TODO: Allow configuring priorities between eject\supply\nanite
    function autoConsume(m) {
        if (!m.initIndustry()) {
            return;
        }

        let consumeList = m.managedPriorityList();
        let consumeAdjustments = Object.fromEntries(consumeList.map(res => [res.id, 0]));

        if (m.isUseful()) {
            let remaining = m.maxConsume();
            for (let consumeRatio of m.useRatio()) {
                for (let resource of consumeList) {
                    if (remaining <= 0) {
                        break;
                    }

                    if (!m.resEnabled(resource.id) || resource.isDemanded()) {
                        continue;
                    }

                    let keepRatio = consumeRatio;
                    if (keepRatio === -1) { // Excess resources
                        if (resource.storageRequired <= 1) { // Resource not used, can't determine excess
                            continue;
                        }
                        keepRatio = Math.max(keepRatio, resource.storageRequired / resource.maxQuantity * m.storageShift);
                    }
                    if (resource === resources.Food && !isHungryRace()) { // Preserve food
                        keepRatio = Math.max(keepRatio, 0.25);
                    }
                    keepRatio = Math.max(keepRatio, resource.requestedQuantity / resource.maxQuantity * m.storageShift);

                    let allowedConsume = consumeAdjustments[resource.id];
                    remaining += consumeAdjustments[resource.id];

                    if (resource.isCraftable()) {
                        if (resource.currentQuantity > (resource.storageRequired * m.storageShift)) {
                            let maxConsume = Math.floor(m.maxConsumeCraftable(resource));
                            allowedConsume = Math.max(0, allowedConsume, maxConsume);
                        }
                    } else {
                        if (resource.storageRatio > keepRatio + 0.01) {
                            let maxConsume = Math.ceil(m.maxConsumeForRatio(resource, keepRatio));
                            allowedConsume = Math.max(1, allowedConsume, maxConsume);
                        } else if (resource.storageRatio > keepRatio) {
                            let maxConsume = Math.floor(m.maxConsumeForRatio(resource, keepRatio));
                            allowedConsume = Math.max(0, allowedConsume, maxConsume);
                        }
                    }

                    consumeAdjustments[resource.id] = Math.min(remaining, allowedConsume);
                    remaining -= consumeAdjustments[resource.id];
                }
            }
        }

        Object.keys(consumeAdjustments).forEach((id) => consumeAdjustments[id] -= m.currentConsume(id));
        Object.entries(consumeAdjustments).forEach(([id, delta]) => delta < 0 && m.consumeLess(id, delta * -1));
        Object.entries(consumeAdjustments).forEach(([id, delta]) => delta > 0 && m.consumeMore(id, delta));
    }

    function autoPrestige() {
        if (settings.prestigeWaitAT && game.global.settings.at > 0) {
            return;
        }
        switch (settings.prestigeType) {
            case 'mad':
                let madVue = getVueById("mad");
                if (madVue?.display && haveTech("mad")) {
                    if (state.goal !== 'Reset') {
                        state.goal = 'Reset';
                        return;
                    }
                    if (madVue.armed) {
                        madVue.arm();
                    }

                    if (!settings.prestigeMADWait || (WarManager.currentSoldiers >= WarManager.maxSoldiers && resources.Population.currentQuantity >= resources.Population.maxQuantity && WarManager.currentSoldiers + resources.Population.currentQuantity >= settings.prestigeMADPopulation)) {
                        state.goal = "GameOverMan";
                        madVue.launch();
                    }
                }
                return;
            case 'bioseed':
                if (isBioseederPrestigeAvailable()) { // Ship completed and probe requirements met
                    if (state.goal !== 'Reset') {
                        state.goal = 'Reset';
                        return;
                    }
                    if (buildings.GasSpaceDockLaunch.isUnlocked()) {
                        state.goal = "GameOverMan";
                        buildings.GasSpaceDockLaunch.click();
                    } else if (buildings.GasSpaceDockPrepForLaunch.isUnlocked()) {
                        buildings.GasSpaceDockPrepForLaunch.click();
                    } else {
                        // Open the modal to update the options
                        buildings.GasSpaceDock.cacheOptions();
                    }
                }
                return;
            case 'cataclysm':
                if (isCataclysmPrestigeAvailable()) {
                    if (state.goal !== 'Reset') {
                        state.goal = 'Reset';
                        return;
                    }
                    if (settings.autoEvolution) {
                        loadQueuedSettings(); // Cataclysm doesnt't have evolution stage, so we need to load settings here, before reset
                    }
                    techIds["tech-dial_it_to_11"].click();
                }
                return;
            case 'vacuum':
                // Nothing required
                return;
            case 'whitehole':
                if (isWhiteholePrestigeAvailable()) { // Solar mass requirements met and research available
                    if (state.goal !== 'Reset') {
                        state.goal = 'Reset';
                        return;
                    }
                    ["tech-infusion_confirm", "tech-infusion_check", "tech-exotic_infusion"].forEach(id => techIds[id].click());
                }
                return;
            case 'apocalypse':
                if (isApocalypsePrestigeAvailable()) {
                    if (state.goal !== 'Reset') {
                        state.goal = 'Reset';
                        return;
                    }
                    ["tech-protocol66", "tech-protocol66a"].forEach(id => techIds[id].click());
                }
                return;
            case 'ascension':
                if (isAscensionPrestigeAvailable()) {
                    if (state.goal !== 'Reset') {
                        state.goal = 'Reset';
                        return;
                    }
                    buildings.SiriusAscend.click();
                }
                return;
            case 'demonic':
                if (isDemonicPrestigeAvailable()) {
                    techIds["tech-demonic_infusion"].click();
                }
                return;
        }
    }

    function isCataclysmPrestigeAvailable() {
        return techIds["tech-dial_it_to_11"].isUnlocked();
    }

    function isBioseederPrestigeAvailable() {
        return buildings.GasSpaceDock.count >= 1 && buildings.GasSpaceDockShipSegment.count >= 100 && buildings.GasSpaceDockProbe.count >= settings.prestigeBioseedProbes;
    }

    function isWhiteholePrestigeAvailable() {
        return getBlackholeMass() >= settings.prestigeWhiteholeMinMass && (techIds["tech-exotic_infusion"].isUnlocked() || techIds["tech-infusion_check"].isUnlocked() || techIds["tech-infusion_confirm"].isUnlocked());
    }

    function isApocalypsePrestigeAvailable() {
        return techIds["tech-protocol66"].isUnlocked() || techIds["tech-protocol66a"].isUnlocked();
    }

    function isAscensionPrestigeAvailable() {
        return settings.prestigeAscensionSkipCustom && buildings.SiriusAscend.isUnlocked() && isPillarFinished();
    }

    function isDemonicPrestigeAvailable() {
        return buildings.SpireTower.count > settings.prestigeDemonicFloor && haveTech("waygate", 3) && (!settings.autoMech || (!MechManager.isActive && MechManager.mechsPotential <= settings.prestigeDemonicPotential)) && techIds["tech-demonic_infusion"].isUnlocked();
    }

    function isPillarFinished() {
        return !settings.prestigeAscensionPillar || resources.Harmony.currentQuantity < 1 || game.global.race.universe === 'micro' || game.global.pillars[game.global.race.species] >= game.alevel();
    }

    function getBlackholeMass() {
        let engine = game.global.interstellar.stellar_engine;
        return engine ? engine.mass + engine.exotic : 0;
    }

    function autoShapeshift() {
        if (!game.global.race['shapeshifter'] || game.global.race.ss_genus === settings.shifterGenus) {
            return false;
        }

        getVueById('sshifter')?.setShape(settings.shifterGenus);
    }

    function autoAssembleGene() {
        // If we haven't got the assemble gene button or don't have full knowledge then return
        if (!haveTech("genetics", 6) || resources.Knowledge.currentQuantity < 200000 || resources.Knowledge.isDemanded()) {
            return;
        }

        let nextTickKnowledge = resources.Knowledge.currentQuantity + resources.Knowledge.rateOfChange / ticksPerSecond();
        let overflowKnowledge = nextTickKnowledge - resources.Knowledge.maxQuantity;
        if (overflowKnowledge < 0) {
            return;
        }

        let vue = getVueById("arpaSequence");
        if (vue === undefined) { return false; }


        let genesToAssemble = Math.ceil(overflowKnowledge / 200000);
        if (genesToAssemble > 0) {
            resetMultiplier();
            for (let i = 0; i < genesToAssemble; i++) {
                vue.novo();
                resources.Knowledge.currentQuantity -= 200000;
                resources.Genes.currentQuantity += 1;
            }
        }
    }

    function autoMarket(bulkSell, ignoreSellRatio) {
        if (!MarketManager.isUnlocked()) {
            return;
        }

        adjustTradeRoutes();

        // Manual trade disabled
        if (game.global.race['no_trade']) {
            return;
        }

        let minimumMoneyAllowed = Math.max(resources.Money.maxQuantity * settings.minimumMoneyPercentage / 100, settings.minimumMoney);

        let currentMultiplier = MarketManager.multiplier; // Save the current multiplier so we can reset it at the end of the function
        let maxMultiplier = MarketManager.getMaxMultiplier();

        for (let i = 0; i < MarketManager.priorityList.length; i++) {
            let resource = MarketManager.priorityList[i];

            if (!resource.isTradable() || !resource.isUnlocked() || !MarketManager.isBuySellUnlocked(resource)) {
                continue;
            }

            if (resource.autoSellEnabled && (ignoreSellRatio || resource.storageRatio >= resource.autoSellRatio)) {
                let maxAllowedTotalSellPrice = resources.Money.maxQuantity - resources.Money.currentQuantity;
                let unitSellPrice = MarketManager.getUnitSellPrice(resource);
                let maxAllowedUnits = Math.floor(maxAllowedTotalSellPrice / unitSellPrice); // only sell up to our maximum money

                if (resource.storageRatio > resource.autoSellRatio) {
                    maxAllowedUnits = Math.min(maxAllowedUnits, Math.floor(resource.currentQuantity - (resource.autoSellRatio * resource.maxQuantity))); // If not full sell up to our sell ratio
                } else {
                    maxAllowedUnits = Math.min(maxAllowedUnits, Math.floor(resource.calculateRateOfChange({buy: false, all: true}) * 2 / ticksPerSecond())); // If resource is full then sell up to 2 ticks worth of production
                }

                if (maxAllowedUnits <= maxMultiplier) {
                    // Our current max multiplier covers the full amount that we want to sell
                    MarketManager.setMultiplier(maxAllowedUnits);
                    MarketManager.sell(resource);
                } else {
                    // Our current max multiplier doesn't cover the full amount that we want to sell. Sell up to 5 batches.
                    let counter = Math.min(5, Math.floor(maxAllowedUnits / maxMultiplier)); // Allow up to 5 sales per script loop
                    MarketManager.setMultiplier(maxMultiplier);

                    for (let j = 0; j < counter; j++) {
                        MarketManager.sell(resource);
                    }
                }
            }

            if (bulkSell === true) {
                continue;
            }

            if (resource.autoBuyEnabled === true && resource.storageRatio < resource.autoBuyRatio && !resources.Money.isDemanded()) {
                let storableAmount = Math.floor((resource.autoBuyRatio - resource.storageRatio) * resource.maxQuantity);
                let affordableAmount = Math.floor((resources.Money.currentQuantity - minimumMoneyAllowed) / MarketManager.getUnitBuyPrice(resource));
                let maxAllowedUnits = Math.min(storableAmount, affordableAmount);
                if (maxAllowedUnits > 0) {
                    if (maxAllowedUnits <= maxMultiplier){
                        MarketManager.setMultiplier(maxAllowedUnits);
                        MarketManager.buy(resource);
                    } else {
                        let counter = Math.min(5, Math.floor(maxAllowedUnits / maxMultiplier));
                        MarketManager.setMultiplier(maxMultiplier);

                        for (let j = 0; j < counter; j++) {
                            MarketManager.buy(resource);
                        }
                    }
                }
            }
        }

        MarketManager.setMultiplier(currentMultiplier); // Reset multiplier
    }

    function autoGalaxyMarket() {
        // If not unlocked then nothing to do
        if (!GalaxyTradeManager.initIndustry()) {
            return;
        }

         // Init adjustment, and sort groups by priorities
        let priorityGroups = {};
        let tradeAdjustments = {};
        for (let i = 0; i < poly.galaxyOffers.length; i++) {
            let trade = poly.galaxyOffers[i];
            let buyResource = resources[trade.buy.res];
            if (buyResource.galaxyMarketWeighting > 0) {
                let priority = buyResource.isDemanded() ? Math.max(buyResource.galaxyMarketPriority, 100) : buyResource.galaxyMarketPriority;
                if (priority !== 0) {
                    priorityGroups[priority] = priorityGroups[priority] ?? [];
                    priorityGroups[priority].push(trade);
                }
            }
            tradeAdjustments[buyResource.id] = 0;
        }
        let priorityList = Object.keys(priorityGroups).sort((a, b) => b - a).map(key => priorityGroups[key]);
        if (priorityGroups["-1"] && priorityList.length > 1) {
            priorityList.splice(priorityList.indexOf(priorityGroups["-1"], 1));
            priorityList[0].push(...priorityGroups["-1"]);
        }

        // Calculate amount of factories per product
        let remainingFreighters = GalaxyTradeManager.maxOperating();
        for (let i = 0; i < priorityList.length && remainingFreighters > 0; i++) {
            let trades = priorityList[i].sort((a, b) => resources[a.buy.res].galaxyMarketWeighting - resources[b.buy.res].galaxyMarketWeighting);
            while (remainingFreighters > 0) {
                let freightersToDistribute = remainingFreighters;
                let totalPriorityWeight = trades.reduce((sum, trade) => sum + resources[trade.buy.res].galaxyMarketWeighting, 0);

                for (let j = trades.length - 1; j >= 0 && remainingFreighters > 0; j--) {
                    let trade = trades[j];
                    let buyResource = resources[trade.buy.res];
                    let sellResource = resources[trade.sell.res];

                    let calculatedRequiredFreighters = Math.min(remainingFreighters, Math.max(1, Math.floor(freightersToDistribute / totalPriorityWeight * buyResource.galaxyMarketWeighting)));
                    let actualRequiredFreighters = calculatedRequiredFreighters;
                    if (!buyResource.isUseful() || sellResource.isDemanded() || sellResource.storageRatio < settings.marketMinIngredients) {
                        actualRequiredFreighters = 0;
                    }

                    if (actualRequiredFreighters > 0){
                        remainingFreighters -= actualRequiredFreighters;
                        tradeAdjustments[buyResource.id] += actualRequiredFreighters;
                    }

                    // We assigned less than wanted, i.e. we either don't need this product, or can't afford it. In both cases - we're done with it.
                    if (actualRequiredFreighters < calculatedRequiredFreighters) {
                        trades.splice(j, 1);
                    }
                }

                if (freightersToDistribute === remainingFreighters) {
                    break;
                }
            }
        }

        let tradeDeltas = poly.galaxyOffers.map((trade, index) => tradeAdjustments[trade.buy.res] - GalaxyTradeManager.currentProduction(index));

        // TODO: Add GalaxyTradeManager.zeroProduction() to save some clicks.
        tradeDeltas.forEach((value, index) => value < 0 && GalaxyTradeManager.decreaseProduction(index, value * -1));
        tradeDeltas.forEach((value, index) => value > 0 && GalaxyTradeManager.increaseProduction(index, value));
    }

    function autoGatherResources() {
        // Don't spam click once we've got a bit of population going
        if (!settings.buildingAlwaysClick && resources.Population.currentQuantity > 15 && (buildings.RockQuarry.count > 0 || game.global.race['sappy'])) {
            return;
        }

        // Uses exposed action handlers, bypassing vue - they much faster, and that's important with a lot of calls
        let resPerClick = getResourcesPerClick();
        let amount = 0;
        if (buildings.Food.isClickable()){
            if (haveTech("conjuring", 1)) {
                amount = Math.floor(Math.min((resources.Food.maxQuantity - resources.Food.currentQuantity) / (resPerClick * 10), resources.Mana.currentQuantity, settings.buildingClickPerTick));
                resources.Mana.currentQuantity -= amount;
                resources.Food.currentQuantity += amount * resPerClick;
            } else {
                amount = Math.ceil(Math.min((resources.Food.maxQuantity - resources.Food.currentQuantity) / resPerClick, settings.buildingClickPerTick));
                resources.Food.currentQuantity = Math.min(resources.Food.currentQuantity + amount * resPerClick, resources.Food.maxQuantity);
            }
            let food = game.actions.city.food;
            for (let i = 0; i < amount; i++) {
                food.action();
            }
        }
        if (buildings.Lumber.isClickable()){
            if (haveTech("conjuring", 2)) {
                amount = Math.floor(Math.min((resources.Lumber.maxQuantity - resources.Lumber.currentQuantity) / (resPerClick * 10), resources.Mana.currentQuantity, settings.buildingClickPerTick));
                resources.Mana.currentQuantity -= amount;
                resources.Lumber.currentQuantity += amount * resPerClick;
            } else {
                amount = Math.ceil(Math.min((resources.Lumber.maxQuantity - resources.Lumber.currentQuantity) / resPerClick, settings.buildingClickPerTick));
                resources.Lumber.currentQuantity = Math.min(resources.Lumber.currentQuantity + amount * resPerClick, resources.Lumber.maxQuantity);
            }
            let lumber = game.actions.city.lumber;
            for (let i = 0; i < amount; i++) {
                lumber.action();
            }
        }
        if (buildings.Stone.isClickable()){
            if (haveTech("conjuring", 2)) {
                amount = Math.floor(Math.min((resources.Stone.maxQuantity - resources.Stone.currentQuantity) / (resPerClick * 10), resources.Mana.currentQuantity, settings.buildingClickPerTick));
                resources.Mana.currentQuantity -= amount;
                resources.Stone.currentQuantity += amount * resPerClick;
            } else {
                amount = Math.ceil(Math.min((resources.Stone.maxQuantity - resources.Stone.currentQuantity) / resPerClick, settings.buildingClickPerTick));
                resources.Stone.currentQuantity = Math.min(resources.Stone.currentQuantity + amount * resPerClick, resources.Stone.maxQuantity);
            }
            let stone = game.actions.city.stone;
            for (let i = 0; i < amount; i++) {
                stone.action();
            }
        }
        if (buildings.Chrysotile.isClickable()){
            if (haveTech("conjuring", 2)) {
                amount = Math.floor(Math.min((resources.Chrysotile.maxQuantity - resources.Chrysotile.currentQuantity) / (resPerClick * 10), resources.Mana.currentQuantity, settings.buildingClickPerTick));
                resources.Mana.currentQuantity -= amount;
                resources.Chrysotile.currentQuantity += amount * resPerClick;
            } else {
                amount = Math.ceil(Math.min((resources.Chrysotile.maxQuantity - resources.Chrysotile.currentQuantity) / resPerClick, settings.buildingClickPerTick));
                resources.Chrysotile.currentQuantity = Math.min(resources.Chrysotile.currentQuantity + amount * resPerClick, resources.Chrysotile.maxQuantity);
            }
            let chrysotile = game.actions.city.chrysotile;
            for (let i = 0; i < amount; i++) {
                chrysotile.action();
            }
        }
        if (buildings.Slaughter.isClickable()){
            amount = Math.min(Math.max(resources.Lumber.maxQuantity - resources.Lumber.currentQuantity, resources.Food.maxQuantity - resources.Food.currentQuantity, resources.Furs.maxQuantity - resources.Furs.currentQuantity) / resPerClick, settings.buildingClickPerTick);
            let slaughter = game.actions.city.slaughter;
            for (let i = 0; i < amount; i++) {
                slaughter.action();
            }
            resources.Lumber.currentQuantity = Math.min(resources.Lumber.currentQuantity + amount * resPerClick, resources.Lumber.maxQuantity);
            if (game.global.race['soul_eater'] && haveTech("primitive")){
                resources.Food.currentQuantity = Math.min(resources.Food.currentQuantity + amount * resPerClick, resources.Food.maxQuantity);
            }
            if (resources.Furs.isUnlocked()) {
                resources.Furs.currentQuantity = Math.min(resources.Furs.currentQuantity + amount * resPerClick, resources.Furs.maxQuantity);
            }
        }
    }

    function autoBuild() {
        BuildingManager.updateWeighting();
        ProjectManager.updateWeighting();

        let ignoredList = [...state.queuedTargets, ...state.triggerTargets];
        let buildingList = [...BuildingManager.managedPriorityList(), ...ProjectManager.managedPriorityList()];

        // Sort array so we'll have prioritized buildings on top. We'll need that below to avoid deathlocks, when building 1 waits for building 2, and building 2 waits for building 3. That's something we don't want to happen when building 1 and building 3 doesn't conflicts with each other.
        state.unlockedBuildings = buildingList.sort((a, b) => b.weighting - a.weighting);

        let estimatedTime = {};
        let affordableCache = {};
        const isAffordable = (building) => (affordableCache[building._vueBinding] ?? (affordableCache[building._vueBinding] = building.isAffordable()));

        // Loop through the auto build list and try to buy them
        buildingsLoop:
        for (let i = 0; i < buildingList.length; i++) {
            let building = buildingList[i];

            // Only go further if it's affordable building, and not current target
            if (ignoredList.includes(building) || !isAffordable(building)) {
                continue;
            }

            // Check queue and trigger conflicts
            let conflict = getCostConflict(building);
            if (conflict) {
                building.extraDescription += `与${conflict.obj.name}因${conflict.res.title}而冲突 (${conflict.obj.cause})<br>`;
                continue;
            }

            // Checks weights, if this building doesn't demands any overflowing resources(unless we ignoring overflowing)
            if (!settings.buildingBuildIfStorageFull || !Object.keys(building.cost).some(res => resources[res].storageRatio > 0.98)) {
                for (let j = 0; j < buildingList.length; j++) {
                    let other = buildingList[j];
                    let weightDiffRatio = other.weighting / building.weighting;

                    // Buildings sorted by weighting, so once we reached something with lower weighting - all remaining also lower, and we don't care about them
                    if (weightDiffRatio <= 1) {
                        break;
                    }
                    // And we don't want to process clickable buildings - all buildings with highter weighting should already been proccessed.
                    // If that thing is affordable, but wasn't bought - it means something block it, and it won't be builded soon anyway, so we'll ignore it's demands.
                    // Unless that thing have x10 weight, and we absolutely don't want to waste its resources
                    if (weightDiffRatio < 10 && isAffordable(other)){
                        continue;
                    }

                    // Calculate time to build for competing building, if it's not cached
                    let estimation = estimatedTime[other._vueBinding];
                    if (!estimation){
                        estimation = [];

                        for (let res in other.cost) {
                            let resource = resources[res];
                            let quantity = other.cost[res];

                            // Ignore locked
                            if (!resource.isUnlocked()) {
                                continue;
                            }

                            let totalRateOfCharge = resource.rateOfChange;
                            if (totalRateOfCharge > 0) {
                                estimation[resource.id] = (quantity - resource.currentQuantity) / totalRateOfCharge;
                            } else if (settings.buildingsIgnoreZeroRate && resource.storageRatio < 0.975 && resource.currentQuantity < quantity) {
                                estimation[resource.id] = Number.MAX_SAFE_INTEGER;
                            } else {
                                // Craftables and such, which not producing at this moment. We can't realistically calculate how much time it'll take to fulfil requirement(too many factors), so let's assume we can get it any any moment.
                                estimation[resource.id] = 0;
                            }
                        }
                        estimation.total = Math.max(0, ...Object.values(estimation));
                        estimatedTime[other._vueBinding] = estimation;
                    }

                    // Compare resource costs
                    for (let res in building.cost) {
                        let resource = resources[res];
                        let thisQuantity = building.cost[res];

                        // Ignore locked and capped resources
                        if (!resource.isUnlocked() || resource.storageRatio > 0.99){
                            continue;
                        }

                        // Check if we're actually conflicting on this resource
                        let otherQuantity = other.cost[res];
                        if (otherQuantity === undefined){
                            continue;
                        }

                        // We have enought resources for both buildings, no need to preserve it
                        if (resource.currentQuantity >= (otherQuantity + thisQuantity)) {
                            continue;
                        }

                        // We can use up to this amount of resources without delaying competing building
                        // Not very accurate, as income can fluctuate wildly for foundry, factory, and such, but should work as bottom line
                        if (thisQuantity <= (estimation.total - estimation[resource.id]) * resource.rateOfChange) {
                            continue;
                        }

                        // Check if cost difference is below weighting threshold, so we won't wait hours for 10x amount of resources when weight is just twice higher
                        let costDiffRatio = otherQuantity / thisQuantity;
                        if (costDiffRatio >= weightDiffRatio) {
                            continue;
                        }

                        // If we reached here - then we want to delay with our current building. Return all way back to main loop, and try to build something else
                        building.extraDescription += `与${other.title}因${resource.title}而冲突<br>`;
                        continue buildingsLoop;
                    }
                }
            }

            // Build building
            if (building.click()) {
                // Only one building with consumption per tick, so we won't build few red buildings having just 1 extra support, and such
                // Same for gems when we're saving them
                if (building.consumption.length > 0 || (building.cost["Soul_Gem"] && settings.prestigeType === "whitehole" && settings.prestigeWhiteholeSaveGems)) {
                    return;
                }
                // Mark all processed building as unaffordable for remaining loop, so they won't appear as conflicting
                for (let key in affordableCache) {
                    affordableCache[key] = false;
                }
            }
        }
    }

    function getTechConflict(tech) {
        let itemId = tech._vueBinding;

        // Skip ignored techs
        if (settings.researchIgnore.includes(itemId)) {
            return "研究已忽略";
        }

        // Save soul gems for reset
        if (settings.prestigeType === "whitehole" && settings.prestigeWhiteholeSaveGems &&
            tech.cost["Soul_Gem"] > resources.Soul_Gem.currentQuantity - 10) {
            return "为重置而保留灵魂宝石";
        }

        // Don't click any reset options without user consent... that would be a dick move, man.
        if (itemId === "tech-exotic_infusion" || itemId === "tech-infusion_check" || itemId === "tech-infusion_confirm" ||
            itemId === "tech-dial_it_to_11" || itemId === "tech-limit_collider" || itemId === "tech-demonic_infusion" ||
            itemId === "tech-protocol66" || itemId === "tech-protocol66a") {
            return "不触发重置";
        }

        // Don't use Dark Bomb if not enabled
        if (itemId == "tech-dark_bomb" && !settings.prestigeDemonicBomb) {
            return "不使用暗能量炸弹";
        }

        // Don't waste phage and plasmid on ascension techs if we're not going there
        if ((itemId === "tech-incorporeal" || itemId === "tech-tech_ascension") && settings.prestigeType !== "ascension") {
            return "当前重置类型不需要建造";
        }

        // Alien Gift
        if (itemId === "tech-xeno_gift" && resources.Knowledge.maxQuantity < settings.fleetAlienGiftKnowledge) {
            return `知识上限需要到达 ${getNumberString(settings.fleetAlienGiftKnowledge)}`;
        }

        // Unification
        if ((itemId === "tech-unification2" || itemId === "tech-unite") && !settings.foreignUnification) {
            return "不进行统一";
        }

        // If user wants to stabilize blackhole then do it, unless we're on blackhole run
        if (itemId === "tech-stabilize_blackhole") {
            if (!settings.prestigeWhiteholeStabiliseMass) {
                return "不稳定黑洞";
            }
            if (settings.prestigeType === "whitehole") {
                return "黑洞重置时不稳定黑洞";
            }
        }

        if (itemId !== settings.userResearchTheology_1) {
            const isFanatRace = () => Object.values(fanatAchievements).reduce((result, combo) => result || (game.global.race.species === combo.race && game.global.race.gods === combo.god && !isAchievementUnlocked(combo.achieve, game.alevel())), false);
            if (itemId === "tech-anthropology" && !(settings.userResearchTheology_1 === "auto" && settings.prestigeType === "mad" && !isFanatRace())) {
                return "不是想要的神学研究分支";
            }
            if (itemId === "tech-fanaticism" && !(settings.userResearchTheology_1 === "auto" && (settings.prestigeType !== "mad" || isFanatRace()))) {
                return "不是想要的神学研究分支";
            }
        }

        if (itemId !== settings.userResearchTheology_2) {
            if (itemId === "tech-deify" && !(settings.userResearchTheology_2 === "auto" && (settings.prestigeType === "ascension" || settings.prestigeType === "demonic"))) {
                return "不是想要的神学研究分支";
            }
            if (itemId === "tech-study" && !(settings.userResearchTheology_2 === "auto" && settings.prestigeType !== "ascension" && settings.prestigeType !== "demonic")) {
                return "不是想要的神学研究分支";
            }
        }
        return false;
    }

    function autoTrigger() {
        let triggerActive = false;
        for (let trigger of state.triggerTargets) {
            if (trigger.click()) {
                triggerActive = true;
            }
        }
        return triggerActive;
    }

    function autoResearch() {
        // Check if we have something researchable
        if (state.unlockedTechs.length === 0){
            return;
        }

        for (let tech of state.unlockedTechs) {
            if (tech.isAffordable() && !getCostConflict(tech) && tech.click()) {
                BuildingManager.updateBuildings(); // Cache cost if we just unlocked some building
                ProjectManager.updateProjects();
                return;
            }
        }
    }

    function getCitadelConsumption(amount) {
        return (30 + (amount - 1) * 2.5) * amount * (game.global.race['emfield'] ? 1.5 : 1);
    }

    function isHellSupressUseful() {
        return jobs.Archaeologist.count > 0 || jobs.Scarletite.count > 0 || buildings.RuinsArcology.stateOnCount > 0 || buildings.GateInferniteMine.stateOnCount > 0;
    }

    function autoPower() {
        // Only start doing this once power becomes available. Isn't useful before then
        if (!resources.Power.isUnlocked()) {
            return;
        }

        let buildingList = BuildingManager.managedStatePriorityList();

        // No buildings unlocked yet
        if (buildingList.length === 0) {
            return;
        }

        // Calculate the available power / resource rates of change that we have to work with
        let availablePower = resources.Power.currentQuantity;

        for (let i = 0; i < buildingList.length; i++) {
            let building = buildingList[i];

            availablePower += (building.powered * building.stateOnCount);

            for (let j = 0; j < building.consumption.length; j++) {
                let resourceType = building.consumption[j];

                // Fuel adjust
                let consumptionRate = resourceType.rate;
                if (building._tab === "space" && (resourceType.resource === resources.Oil || resourceType.resource === resources.Helium_3)) {
                    consumptionRate = game.fuel_adjust(consumptionRate, true);
                }
                if ((building._tab === "interstellar" || building._tab === "galaxy") && (resourceType.resource === resources.Deuterium || resourceType.resource === resources.Helium_3) && building !== buildings.AlphaFusion) {
                    consumptionRate = game.int_fuel_adjust(consumptionRate);
                }

                // Just like for power, get our total resources available
                if (building === buildings.BeltSpaceStation && resourceType.resource === resources.Belt_Support) {
                    resources.Belt_Support.rateOfChange -= resources.Belt_Support.maxQuantity;
                } else {
                    resourceType.resource.rateOfChange += consumptionRate * building.stateOnCount;
                }
            }
        }

        let manageTransport = buildings.LakeTransport.isSmartManaged() && buildings.LakeBireme.isSmartManaged();
        let manageSpire = buildings.SpirePort.isSmartManaged() && buildings.SpireBaseCamp.isSmartManaged();

        // Start assigning buildings from the top of our priority list to the bottom
        for (let i = 0; i < buildingList.length; i++) {
            let building = buildingList[i];
            let maxStateOn = building.count;
            let currentStateOn = building.stateOnCount;

            if (!game.global.settings.showGalactic && building._tab === "galaxy") {
                maxStateOn = 0;
            }
            if (settings.buildingsLimitPowered) {
                maxStateOn = Math.min(maxStateOn, building.autoMax);
            }

            // Max powered amount
            if (building === buildings.NeutronCitadel) {
                while (maxStateOn > 0) {
                    if (availablePower >= getCitadelConsumption(maxStateOn)) {
                        break;
                    } else {
                        maxStateOn--;
                    }
                }
            } else if (building.powered > 0) {
                maxStateOn = Math.min(maxStateOn, availablePower / building.powered);
            }

            // Ascension Trigger info
            if (building === buildings.SiriusAscensionTrigger && availablePower < building.powered) {
                building.extraDescription = `缺少${Math.ceil(building.powered - availablePower)}MW电力，无法启用<br>${building.extraDescription}`;
            }

            // Spire managed separately
            if (manageSpire && (building === buildings.SpirePort || building === buildings.SpireBaseCamp || building === buildings.SpireMechBay)) {
                continue;
            }
            // Lake transport managed separately
            if (manageTransport && (building === buildings.LakeTransport || building === buildings.LakeBireme)) {
                continue;
            }
            if (building.is.smart && building.autoStateSmart) {
                if (resources.Power.currentQuantity <= resources.Power.maxQuantity) { // Saving power, unless we can afford everything
                    // Disable Belt Space Stations with no workers
                    if (building === buildings.BeltSpaceStation && game.breakdown.c.Elerium) {
                        let stationStorage = parseFloat(game.breakdown.c.Elerium[game.loc("space_belt_station_title")] ?? 0);
                        let extraStations = Math.floor((resources.Elerium.maxQuantity - resources.Elerium.storageRequired) / stationStorage);
                        let minersNeeded = buildings.BeltEleriumShip.stateOnCount * 2 + buildings.BeltIridiumShip.stateOnCount + buildings.BeltIronShip.stateOnCount;
                        maxStateOn = Math.min(maxStateOn, Math.max(currentStateOn - extraStations, Math.ceil(minersNeeded / 3)));
                    }
                    if (building === buildings.CementPlant && jobs.CementWorker.count === 0) {
                        maxStateOn = 0;
                    }
                    if (building === buildings.Mine && jobs.Miner.count === 0) {
                        maxStateOn = 0;
                    }
                    if (building === buildings.CoalMine && jobs.CoalMiner.count === 0) {
                        maxStateOn = 0;
                    }
                    if (building === buildings.GasMining && !resources.Helium_3.isUseful()) {
                        maxStateOn = Math.min(maxStateOn, resources.Helium_3.getBusyWorkers("space_gas_mining_title", currentStateOn));
                    }
                    if (building === buildings.GasMoonOilExtractor  && !resources.Oil.isUseful()) {
                        maxStateOn = Math.min(maxStateOn, resources.Oil.getBusyWorkers("space_gas_moon_oil_extractor_title", currentStateOn));
                    }
                    // Enable cooling towers only if we can power at least two harbours
                    if (building === buildings.LakeCoolingTower && availablePower < (building.powered * maxStateOn + ((500 * 0.92 ** maxStateOn) * (game.global.race['emfield'] ? 1.5 : 1)).toFixed(2) * Math.min(2, buildings.LakeHarbour.count))) {
                        maxStateOn = 0;
                    }
                    // Don't bother powering harbour if we have power for only one
                    if (building === buildings.LakeHarbour && maxStateOn === 1 && building.count > 1) {
                        maxStateOn = 0;
                    }
                    // Kuiper Mines
                    if (building === buildings.KuiperOrichalcum && !resources.Orichalcum.isUseful()) {
                        maxStateOn = Math.min(maxStateOn, resources.Orichalcum.getBusyWorkers("space_kuiper_mine", currentStateOn, [resources.Orichalcum.title]));
                    }
                    if (building === buildings.KuiperUranium && !resources.Uranium.isUseful()) {
                        maxStateOn = Math.min(maxStateOn, resources.Uranium.getBusyWorkers("space_kuiper_mine", currentStateOn, [resources.Uranium.title]));
                    }
                    if (building === buildings.KuiperNeutronium && !resources.Neutronium.isUseful()) {
                        maxStateOn = Math.min(maxStateOn, resources.Neutronium.getBusyWorkers("space_kuiper_mine", currentStateOn, [resources.Neutronium.title]));
                    }
                    if (building === buildings.KuiperElerium && !resources.Elerium.isUseful()) {
                        maxStateOn = Math.min(maxStateOn, resources.Elerium.getBusyWorkers("space_kuiper_mine", currentStateOn, [resources.Elerium.title]));
                    }
                }
                // Limit lander to sustainable amount
                if (building === buildings.TritonLander) {
                    if (buildings.TritonFOB.stateOnCount < 1) { // Does not work with no FOB
                        maxStateOn = 0;
                    } else {
                        //let protectedSoldiers = (game.global.race['armored'] ? 1 : 0) + (game.global.race['scales'] ? 1 : 0) + (game.global.tech['armor'] ?? 0);
                        //let woundCap = Math.ceil((game.global.space.fob.enemy + (game.global.tech.outer >= 4 ? 75 : 62.5)) / 5) - protectedSoldiers;
                        //let maxLanders = getHealingRate() < woundCap ? Math.floor((getHealingRate() + protectedSoldiers) / 1.5) : Number.MAX_SAFE_INTEGER;
                        let healthySquads = Math.floor((WarManager.currentSoldiers - WarManager.wounded) / 3);
                        maxStateOn = Math.min(maxStateOn, healthySquads /*, maxLanders*/ );
                    }
                }
                // Do not enable Ascension Machine whire we're waiting for pillar
                if (building === buildings.SiriusAscensionTrigger && !isPillarFinished()) {
                    maxStateOn = 0;
                }
                // Disable barracks on bioseed run, if enabled
                if (building === buildings.Barracks && settings.prestigeEnabledBarracks < 100 && !SpyManager._foreignVue && buildings.GasSpaceDockShipSegment.count < 90 && buildings.DwarfWorldController.count < 1) {
                    maxStateOn = Math.ceil(maxStateOn * settings.prestigeEnabledBarracks / 100);
                }
                // Determine the number of powered attractors
                // The goal is to keep threat in the desired range
                // If threat is larger than the configured top value, turn all attractors off
                // If threat is lower than the bottom value, turn all attractors on
                // Linear in between
                if (building === buildings.BadlandsAttractor) {
                    let attractorsBest = 0;
                    if (game.global.portal.fortress.threat < settings.hellAttractorTopThreat && WarManager.hellAssigned > 0) {
                        if (game.global.portal.fortress.threat > settings.hellAttractorBottomThreat && settings.hellAttractorTopThreat > settings.hellAttractorBottomThreat) {
                            attractorsBest = Math.floor(maxStateOn * (settings.hellAttractorTopThreat - game.global.portal.fortress.threat) / (settings.hellAttractorTopThreat - settings.hellAttractorBottomThreat));
                        } else {
                            attractorsBest = maxStateOn;
                        }
                    }

                    maxStateOn = Math.min(maxStateOn, currentStateOn + 1, Math.max(currentStateOn - 1, attractorsBest));
                }
                // Disable tourist center with full money
                if (building === buildings.TouristCenter && !isHungryRace() && resources.Food.storageRatio < 0.7 && !resources.Money.isUseful()) {
                    maxStateOn = Math.min(maxStateOn, resources.Money.getBusyWorkers("tech_tourism", currentStateOn));
                }
                // Disable mills with surplus energy
                if (building === buildings.Mill && building.powered && resources.Food.storageRatio < 0.7 && (jobs.Farmer.count > 0 || jobs.Hunter.count > 0)) {
                    maxStateOn = Math.min(maxStateOn, currentStateOn - ((resources.Power.currentQuantity - 5) / (-building.powered)));
                }
                // Disable useless Mine Layers
                if (building === buildings.ChthonianMineLayer) {
                    if (buildings.ChthonianRaider.stateOnCount === 0 && buildings.ChthonianExcavator.stateOnCount === 0) {
                        maxStateOn = 0;
                    } else {
                        let mineAdjust = ((game.global.race['instinct'] ? 7000 : 7500) - poly.piracy("gxy_chthonian")) / game.actions.galaxy.gxy_chthonian.minelayer.ship.rating();
                        maxStateOn = Math.min(maxStateOn, currentStateOn + Math.ceil(mineAdjust));
                    }
                }
                // Disable useless Guard Post
                if (building === buildings.RuinsGuardPost) {
                    if (isHellSupressUseful()) {
                        let postRating = game.armyRating(1, "hellArmy", 0) * traitVal('holy', 1, '+');
                        // 1 extra power to compensate rounding errors, 100 extra to compensate heling drinf of rage races
                        let postAdjust = ((game.global.race['rage'] ? 5100 : 5001) - poly.hellSupression("ruins").rating) / postRating;
                        if (haveTech('hell_gate')) {
                            postAdjust = Math.max(postAdjust, ((game.global.race['rage'] ? 7600 : 7501) - poly.hellSupression("gate").rating) / postRating);
                        }
                        // We're reserving just one soldier for Guard Posts, so let's increase them by 1
                        maxStateOn = Math.min(maxStateOn, currentStateOn + 1, currentStateOn + Math.ceil(postAdjust));
                    } else {
                        maxStateOn = 0;
                    }
                }
                // Disable Waygate once it cleared, or if we're going to use bomb, or current potential is too hight
                if (building === buildings.SpireWaygate && ((settings.prestigeDemonicBomb && game.global.stats.spire[poly.universeAffix()]?.dlstr > 0) || haveTech("waygate", 3) || (settings.autoMech && MechManager.mechsPotential > settings.mechWaygatePotential && (settings.prestigeType !== "demonic" || buildings.SpireTower.count < settings.prestigeDemonicFloor)))) {
                      maxStateOn = 0;
                }
                // Once we unlocked Embassy - we don't need scouts and corvettes until we'll have piracy. Let's freeup support for more Bolognium ships
                if ((building === buildings.ScoutShip || building === buildings.CorvetteShip) && !game.global.tech.piracy && buildings.GorddonEmbassy.isUnlocked()) {
                    maxStateOn = 0;
                }
                // Production buildings with capped resources
                if (building === buildings.BeltEleriumShip && !resources.Elerium.isUseful()) {
                    maxStateOn = Math.min(maxStateOn, resources.Elerium.getBusyWorkers("job_space_miner", currentStateOn));
                }
                if (building === buildings.BeltIridiumShip && !resources.Iridium.isUseful()) {
                    maxStateOn = Math.min(maxStateOn, resources.Iridium.getBusyWorkers("job_space_miner", currentStateOn));
                }
                if (building === buildings.BeltIronShip && !resources.Iron.isUseful()) {
                    maxStateOn = Math.min(maxStateOn, resources.Iron.getBusyWorkers("job_space_miner", currentStateOn));
                }
                if (building === buildings.BologniumShip) {
                    if (buildings.GorddonMission.isAutoBuildable() && buildings.ScoutShip.count >= 2 && buildings.CorvetteShip.count >= 1) {
                        maxStateOn = Math.min(maxStateOn, resources.Gateway_Support.maxQuantity - (buildings.ScoutShip.count + buildings.CorvetteShip.count));
                    }
                    if (!resources.Bolognium.isUseful()) {
                        maxStateOn = Math.min(maxStateOn, resources.Bolognium.getBusyWorkers("galaxy_bolognium_ship", currentStateOn));
                    }
                }
                if (building === buildings.Alien1VitreloyPlant && !resources.Vitreloy.isUseful()) {
                    maxStateOn = Math.min(maxStateOn, resources.Vitreloy.getBusyWorkers("galaxy_vitreloy_plant_bd", currentStateOn));
                }
                if (building === buildings.Alien2ArmedMiner && !resources.Bolognium.isUseful() && !resources.Adamantite.isUseful() && !resources.Iridium.isUseful()) {
                    let minShips = Math.max(resources.Bolognium.getBusyWorkers("galaxy_armed_miner_bd", currentStateOn),
                                            resources.Adamantite.getBusyWorkers("galaxy_armed_miner_bd", currentStateOn),
                                            resources.Iridium.getBusyWorkers("galaxy_armed_miner_bd", currentStateOn));
                    maxStateOn = Math.min(maxStateOn, minShips);
                }
                if (building === buildings.ChthonianRaider && !resources.Vitreloy.isUseful() && !resources.Polymer.isUseful() && !resources.Neutronium.isUseful() && !resources.Deuterium.isUseful()) {
                    let minShips = Math.max(resources.Vitreloy.getBusyWorkers("galaxy_raider", currentStateOn),
                                            resources.Polymer.getBusyWorkers("galaxy_raider", currentStateOn),
                                            resources.Neutronium.getBusyWorkers("galaxy_raider", currentStateOn),
                                            resources.Deuterium.getBusyWorkers("galaxy_raider", currentStateOn));
                    maxStateOn = Math.min(maxStateOn, minShips);
                }
                if (building === buildings.ChthonianExcavator && !resources.Orichalcum.isUseful()) {
                    maxStateOn = Math.min(maxStateOn, resources.Orichalcum.getBusyWorkers("galaxy_excavator", currentStateOn));
                }
                if (building === buildings.EnceladusWaterFreighter && !resources.Water.isUseful()) {
                    maxStateOn = Math.min(maxStateOn, resources.Water.getBusyWorkers("space_water_freighter_title", currentStateOn));
                }
                if (building === buildings.NebulaHarvester && !resources.Deuterium.isUseful() && !resources.Helium_3.isUseful()) {
                    let minShips = Math.max(resources.Deuterium.getBusyWorkers("interstellar_harvester_title", currentStateOn),
                                            resources.Helium_3.getBusyWorkers("interstellar_harvester_title", currentStateOn));
                    maxStateOn = Math.min(maxStateOn, minShips);
                }
            }


            for (let j = 0; j < building.consumption.length; j++) {
                let resourceType = building.consumption[j];
                if (!resourceType.resource.isUnlocked()) {
                    maxStateOn = 0;
                    break;
                }

                // If resource rate is negative then we are gaining resources. So, only check if we are consuming resources
                if (resourceType.rate > 0) {

                    if (resourceType.resource === resources.Food) {
                        // Wendigo doesn't store food. Let's assume it's always available.
                        if (resourceType.resource.storageRatio > 0.05 || isHungryRace()) {
                            continue;
                        }
                    } else if (!(resourceType.resource instanceof Support) && resourceType.resource.storageRatio > 0.01) {
                        // If we have more than xx% of our storage then its ok to lose some resources.
                        // This check is mainly so that power producing buildings don't turn off when rate of change goes negative.
                        // That can cause massive loss of life if turning off space habitats :-)
                        continue;
                    }

                    maxStateOn = Math.min(maxStateOn, resourceType.resource.rateOfChange / resourceType.rate);
                }
            }

            // If this is a power producing structure then only turn off one at a time!
            if (building.powered < 0) {
                maxStateOn = Math.max(maxStateOn, currentStateOn - 1);
            }

            maxStateOn = Math.max(0, Math.floor(maxStateOn));

            // Now when we know how many buildings we need - let's take resources
            for (let k = 0; k < building.consumption.length; k++) {
                let resourceType = building.consumption[k];

                // Fuel adjust
                let consumptionRate = resourceType.rate;
                if (building._tab === "space" && (resourceType.resource === resources.Oil || resourceType.resource === resources.Helium_3)) {
                    consumptionRate = game.fuel_adjust(consumptionRate, true);
                }
                if ((building._tab === "interstellar" || building._tab === "galaxy") && (resourceType.resource === resources.Deuterium || resourceType.resource === resources.Helium_3) && building !== buildings.AlphaFusion) {
                    consumptionRate = game.int_fuel_adjust(consumptionRate);
                }

                if (building === buildings.BeltSpaceStation && resourceType.resource === resources.Belt_Support) {
                    resources.Belt_Support.rateOfChange += resources.Belt_Support.maxQuantity;
                } else {
                    resourceType.resource.rateOfChange -= consumptionRate * maxStateOn;
                }
            }

            building.tryAdjustState(maxStateOn - currentStateOn);

            if (building === buildings.NeutronCitadel) {
                availablePower -= getCitadelConsumption(maxStateOn);
            } else {
                availablePower -= building.powered * maxStateOn;
            }
        }

        if (manageTransport && resources.Lake_Support.rateOfChange > 0) {
            let lakeSupport = resources.Lake_Support.rateOfChange;
            let rating = game.global.blood['spire'] && game.global.blood.spire >= 2 ? 0.8 : 0.85;
            let bireme = buildings.LakeBireme;
            let transport = buildings.LakeTransport;
            let biremeCount = bireme.count;
            let transportCount = transport.count;
            while (biremeCount + transportCount > lakeSupport) {
                let nextBireme = (1 - (rating ** (biremeCount - 1))) * (transportCount * 5);
                let nextTransport = (1 - (rating ** biremeCount)) * ((transportCount - 1) * 5);
                if (nextBireme > nextTransport) {
                    biremeCount--;
                } else {
                    transportCount--;
                }
            }
            bireme.tryAdjustState(biremeCount - bireme.stateOnCount);
            transport.tryAdjustState(transportCount - transport.stateOnCount);
        }

        if (manageSpire && resources.Spire_Support.rateOfChange > 0) {
            // Try to prevent building bays when they won't have enough time to work out used supplies. It assumes that time to build new bay ~= time to clear floor.
            // Make sure we have some transports, so we won't stuck with 0 supply income after disabling collectors, and also let mech manager finish rebuilding after switching floor
            // And also let autoMech do minimum preparation, so we won't stuck with near zero potential
            let buildAllowed = (!settings.autoMech || !MechManager.isActive) && (settings.prestigeType !== "demonic" || settings.prestigeDemonicFloor - buildings.SpireTower.count > buildings.SpireMechBay.count);

            // Check is we allowed to build specific building, and have money for it
            const canBuild = (building, checkSmart) => buildAllowed && building.isAutoBuildable() && resources.Money.maxQuantity >= (building.cost["Money"] ?? 0) && (!checkSmart || building.isSmartManaged());

            let spireSupport = Math.floor(resources.Spire_Support.rateOfChange);
            let maxBay = Math.min(buildings.SpireMechBay.count, spireSupport);
            let currentPort = buildings.SpirePort.count;
            let currentCamp = buildings.SpireBaseCamp.count;
            let maxPorts = canBuild(buildings.SpirePort) ? buildings.SpirePort.autoMax : currentPort;
            let maxCamps = canBuild(buildings.SpireBaseCamp) ? buildings.SpireBaseCamp.autoMax : currentCamp;
            let nextMechCost = canBuild(buildings.SpireMechBay, true) ? buildings.SpireMechBay.cost["Supply"] : Number.MAX_SAFE_INTEGER;
            let nextPuriCost = canBuild(buildings.SpirePurifier, true) ? buildings.SpirePurifier.cost["Supply"] : Number.MAX_SAFE_INTEGER;
            let mechQueued = state.queuedTargetsAll.includes(buildings.SpireMechBay);
            let puriQueued = state.queuedTargetsAll.includes(buildings.SpirePurifier);

            let [bestSupplies, bestPort, bestBase] = getBestSupplyRatio(spireSupport, maxPorts, maxCamps);
            buildings.SpirePurifier.extraDescription = `提供补给：${Math.floor(bestSupplies)}<br>${buildings.SpirePurifier.extraDescription}`;

            let nextCost =
              mechQueued && nextMechCost <= bestSupplies ? nextMechCost :
              puriQueued && nextPuriCost <= bestSupplies ? nextPuriCost :
              Math.min(nextMechCost, nextPuriCost);
            MechManager.saveSupply = nextCost <= bestSupplies;

            let assignStorage = mechQueued || puriQueued;
            for (let targetMech = maxBay; targetMech >= 0; targetMech--) {
                let [targetSupplies, targetPort, targetCamp] = getBestSupplyRatio(spireSupport - targetMech, maxPorts, maxCamps);

                let missingStorage =
                    targetPort > currentPort ? buildings.SpirePort :
                    targetCamp > currentCamp ? buildings.SpireBaseCamp :
                    null;
                if (missingStorage) {
                    for (let i = maxBay; i >= 0; i--) {
                        let [storageSupplies, storagePort, storageCamp] = getBestSupplyRatio(spireSupport - i, currentPort, currentCamp);
                        if (storageSupplies >= missingStorage.cost["Supply"]) {
                            adjustSpire(i, storagePort, storageCamp);
                            break;
                        }
                    }
                    break;
                }

                if (resources.Supply.currentQuantity >= targetSupplies) {
                    assignStorage = true;
                }
                if (!assignStorage || bestSupplies < nextCost || targetSupplies >= nextCost) {
                    // TODO: Assign storage gradually while it fills, instead of dropping directly to target. That'll need better intregration with autoBuild, to make sure it won't spent supplies on wrong building seeing that target still unaffrodable, and not knowing that it's temporaly
                    adjustSpire(targetMech, targetPort, targetCamp);
                    break;
                }
            }
        }

        resources.Power.currentQuantity = availablePower;
        resources.Power.rateOfChange = availablePower;

        // Disable underpowered buildings, one at time. Unless it's ship - which may stay with warning until they'll get crew
        let warnBuildings = $("span.on.warn");
        for (let i = 0; i < warnBuildings.length; i++) {
            let building = buildingIds[warnBuildings[i].parentNode.id];
            if (building && building.autoStateEnabled && !building.is.ship) {
                if (((building === buildings.BeltEleriumShip || building === buildings.BeltIridiumShip || building === buildings.BeltIronShip) &&
                     (buildings.BeltEleriumShip.stateOnCount * 2 + buildings.BeltIridiumShip.stateOnCount + buildings.BeltIronShip.stateOnCount) <= resources.Belt_Support.maxQuantity) ||
                    ((building === buildings.LakeBireme || building === buildings.LakeTransport) &&
                     (buildings.LakeBireme.stateOnCount + buildings.LakeTransport.stateOnCount) <= resources.Lake_Support.maxQuantity)) {
                      continue;
                }
                building.tryAdjustState(-1);
                break;
            }
        }
    }

    function adjustSpire(mech, port, camp) {
        buildings.SpireMechBay.tryAdjustState(mech - buildings.SpireMechBay.stateOnCount);
        buildings.SpirePort.tryAdjustState(port - buildings.SpirePort.stateOnCount);
        buildings.SpireBaseCamp.tryAdjustState(camp - buildings.SpireBaseCamp.stateOnCount);
    }

    function getBestSupplyRatio(support, maxPorts, maxCamps) {
        let bestPort = 0;
        let bestCamp = 0;

        let optPort = Math.ceil(support / 2 + 1);
        let optCamp = Math.floor(support / 2 - 1);
        if (support <= 3 || optPort > maxPorts) {
            bestPort = Math.min(maxPorts, support);
            bestCamp = Math.min(maxCamps, support - bestPort);
        } else if (optCamp > maxCamps) {
            bestCamp = Math.min(maxCamps, support);
            bestPort = Math.min(maxPorts, support - bestCamp);
        } else if (optPort <= maxPorts && optCamp <= maxCamps) {
            bestPort = optPort;
            bestCamp = optCamp;
        }
        let supplies = Math.round(bestPort * (1 + bestCamp * 0.4) * 10000 + 100);
        return [supplies, bestPort, bestCamp];
    }

    function expandStorage(storageToBuild) {
        let missingStorage = storageToBuild;
        let numberOfCratesWeCanBuild = resources.Crates.maxQuantity - resources.Crates.currentQuantity;
        let numberOfContainersWeCanBuild = resources.Containers.maxQuantity - resources.Containers.currentQuantity;

        for (let res in resources.Crates.cost) {
            numberOfCratesWeCanBuild = Math.min(numberOfCratesWeCanBuild, resources[res].currentQuantity / resources.Crates.cost[res]);
        }
        for (let res in resources.Containers.cost) {
            numberOfContainersWeCanBuild = Math.min(numberOfContainersWeCanBuild, resources[res].currentQuantity / resources.Containers.cost[res]);
        }

        if (settings.storageLimitPreMad && !game.global.race['cataclysm'] && !haveTech("mad") && !haveTech("rival")) {
          // Only build pre-mad containers when steel storage is over 80%
          if (resources.Steel.storageRatio < 0.8) {
              numberOfContainersWeCanBuild = 0;
          }
          // Only build pre-mad crates when already have Plywood for next level of library
          if (isLumberRace() && buildings.Library.count < 20 && buildings.Library.cost["Plywood"] > resources.Plywood.currentQuantity && resources.Steel.maxQuantity >= resources.Steel.storageRequired) {
              numberOfCratesWeCanBuild = 0;
          }
        }

        // Build crates
        // This check needed for cases when there's still empty crates, but they can't be used die to limits.
        if (resources.Crates.currentQuantity === 0 || resources.Containers.storageRatio === 1) {
            let cratesToBuild = Math.min(Math.floor(numberOfCratesWeCanBuild), Math.ceil(missingStorage / poly.crateValue()));
            StorageManager.constructCrate(cratesToBuild);

            resources.Crates.currentQuantity += cratesToBuild;
            for (let res in resources.Crates.cost) {
                resources[res].currentQuantity -= resources.Crates.cost[res] * cratesToBuild;
            }
            missingStorage -= cratesToBuild * poly.crateValue();
        }

        // And containers, if still needed
        if (missingStorage > 0) {
            let containersToBuild = Math.min(Math.floor(numberOfContainersWeCanBuild), Math.ceil(missingStorage / poly.containerValue()));
            StorageManager.constructContainer(containersToBuild);

            resources.Containers.currentQuantity += containersToBuild;
            for (let res in resources.Containers.cost) {
                resources[res].currentQuantity -= resources.Containers.cost[res] * containersToBuild;
            }
            missingStorage -= containersToBuild * poly.containerValue();
        }
        return missingStorage < storageToBuild;
    }

    function autoStorageBuildings() {
        if (haveTask("bal_storage") || !StorageManager.initStorage()) {
            return;
        }

        let crateVolume = poly.crateValue();
        let containerVolume = poly.containerValue();
        if (crateVolume <= 0 || containerVolume <= 0) {
            return;
        }

        let storageList = StorageManager.priorityList.filter(r => r.isUnlocked() && r.isManagedStorage());
        if (storageList.length === 0) {
            return;
        }

        // Set storage multiplier for resources, for market goods, overflow, and buffer
        let resMods = {};
        let marketEnabled = !game.global.race['no_trade'] && settings.autoMarket;
        for (let resource of storageList){
            let res = resource.id;

            if (!settings.storageAssignExtra) {
                resMods[res] = resource.storeOverflow ? 1.03 : 1;
            } else {
                let sellAllowed = marketEnabled && resource.autoSellEnabled && resource.autoSellRatio > 0;
                resMods[res] = sellAllowed ? 1.03 / resource.autoSellRatio : 1.03;
            }
        }

        let buildingsList = [];
        const addList = list => {
            let resGroups = Object.fromEntries(storageList.map((res) => [res.id, []]));
            list.forEach(obj => storageList.find(res => obj.cost[res.id] && resGroups[res.id].push(obj)));
            Object.entries(resGroups).forEach(([res, list]) => list.sort((a, b) => b.cost[res] - a.cost[res]));
            buildingsList.push(...Object.values(resGroups).flat());
        }

        addList(state.queuedTargetsAll);
        addList(state.triggerTargets);
        if (FleetManagerOuter.nextShipExpandable && settings.prioritizeOuterFleet !== "ignore") {
            addList([{cost: FleetManagerOuter.nextShipCost}]);
        }
        addList(state.unlockedTechs);
        addList(ProjectManager.priorityList.filter(b => b.isUnlocked() && b.autoBuildEnabled));
        addList(BuildingManager.priorityList.filter(p => p.isUnlocked() && p.autoBuildEnabled));

        let totalCrates = resources.Crates.currentQuantity;
        let totalContainers = resources.Containers.currentQuantity;
        let storageAdjustments = {};
        for (let resource of storageList){
            let res = resource.id;

            // Overflow enables safe reassign for resource, otherwise all extra resources will be just dumped away
            if (settings.storageSafeReassign || resource.storeOverflow) {
                storageAdjustments[res] = {crate: resource.currentCrates, container: resource.currentContainers, amount: resource.maxQuantity};
                let freeStorage = resource.maxQuantity - resource.currentQuantity * resMods[res];
                // Check for minimum containers here
                if (resource.currentContainers > 0 && (freeStorage > containerVolume || resource.currentContainers > resource.autoContainersMax)){
                    let extraContainers = Math.max(resource.currentContainers - resource.autoContainersMax, Math.min(resource.currentContainers, Math.floor(freeStorage / containerVolume)));

                    storageAdjustments[res].amount -= extraContainers * containerVolume;
                    storageAdjustments[res].container -= extraContainers;
                    totalContainers += extraContainers;
                    freeStorage -= extraContainers * containerVolume;
                }
                // Check for minimum crates here
                if (resource.currentCrates > 0 && (freeStorage > crateVolume || resource.currentCrates > resource.autoCratesMax)){
                    let extraCrates = Math.max(resource.currentCrates - resource.autoCratesMax, Math.min(resource.currentCrates, Math.floor(freeStorage / crateVolume)));

                    storageAdjustments[res].amount -= extraCrates * crateVolume;
                    storageAdjustments[res].crate -= extraCrates;
                    totalCrates += extraCrates;
                }
            } else {
                storageAdjustments[res] = {crate: 0, container: 0, amount: resource.maxQuantity - (resource.currentCrates * crateVolume + resource.currentContainers * containerVolume)};
                totalCrates += resource.currentCrates;
                totalContainers += resource.currentContainers;
            }
        }

        let storageToBuild = 0;

        // Calculate required storages
        nextBuilding:
        for (let building of buildingsList) {
            let currentAssign = {};
            let remainingCrates = totalCrates;
            let remainingContainers = totalContainers;

            for (let res in building.cost) {
                let resource = resources[res];
                let quantity = building.cost[res];

                if (!storageAdjustments[res]) {
                    if (resource.maxQuantity >= quantity) {
                        // Non-expandable, storage met - we're good
                        continue;
                    } else {
                        // Non-expandable, storage not met - ignore building
                        continue nextBuilding;
                    }
                } else if (storageAdjustments[res].amount >= quantity * resMods[res]) {
                    // Expandable, storage met - we're good
                    continue;
                }
                // Expandable, storage not met - try to assign
                let missingStorage = quantity * resMods[res] - storageAdjustments[res].amount;
                currentAssign[res] = {crate: 0, container: 0};
                if (remainingCrates > 0) {
                    let assignCrates = Math.min(Math.ceil(missingStorage / crateVolume), remainingCrates, resource.autoCratesMax - storageAdjustments[res].crate);
                    remainingCrates -= assignCrates;
                    missingStorage -= assignCrates * crateVolume;
                    currentAssign[res].crate = assignCrates;
                }
                if (missingStorage > 0 && remainingContainers > 0) {
                    let assignContainer = Math.min(Math.ceil(missingStorage / containerVolume), remainingContainers, resource.autoContainersMax - storageAdjustments[res].container);
                    remainingContainers -= assignContainer;
                    missingStorage -= assignContainer * containerVolume;
                    currentAssign[res].container = assignContainer;
                }
                if (missingStorage > 0) {
                    // Not enough storage, skip building
                    if (storageAdjustments[res].crate < resource.autoCratesMax || storageAdjustments[res].container < resource.autoContainersMax) {
                        storageToBuild = Math.max(storageToBuild, missingStorage);
                    }
                    continue nextBuilding;
                }
            }
            // Building as affordable, record used storage
            for (let id in currentAssign) {
                storageAdjustments[id].crate += currentAssign[id].crate;
                storageAdjustments[id].container += currentAssign[id].container;
                storageAdjustments[id].amount += currentAssign[id].crate * crateVolume + currentAssign[id].container * containerVolume;
            }
            totalCrates = remainingCrates;
            totalContainers = remainingContainers;
        }

        for (let id in storageAdjustments) {
            let resource = resources[id];
            if (resource.storeOverflow && Math.max(1, resource.currentQuantity) * resMods[id] > storageAdjustments[id].amount) {
                let missingStorage = Math.max(1, resource.currentQuantity) * resMods[id] - storageAdjustments[id].amount;
                if (totalCrates > 0) {
                    let assignCrates = Math.min(Math.ceil(missingStorage / crateVolume), totalCrates, resource.autoCratesMax - storageAdjustments[id].crate);
                    totalCrates -= assignCrates;
                    missingStorage -= assignCrates * crateVolume;
                    storageAdjustments[id].crate += assignCrates;
                }
                if (missingStorage > 0 && totalContainers > 0) {
                    let assignContainer = Math.min(Math.ceil(missingStorage / containerVolume), totalContainers, resource.autoContainersMax - storageAdjustments[id].container);
                    totalContainers -= assignContainer;
                    missingStorage -= assignContainer * containerVolume;
                    storageAdjustments[id].container += assignContainer;
                }
                if (missingStorage > 0 && (storageAdjustments[id].crate < resource.autoCratesMax || storageAdjustments[id].container < resource.autoContainersMax)) {
                    storageToBuild = Math.max(storageToBuild, missingStorage);
                }
            }
        }

        // Missing storage, try to build more
        if (storageToBuild > 0 && expandStorage(storageToBuild)) {
            // Stop if we bought something, we'll continue in next tick, after re-calculation of required storage
            return;
        }

        // Go to clicking, unassign first
        for (let id in storageAdjustments) {
            let resource = resources[id];
            let crateDelta = storageAdjustments[id].crate - resource.currentCrates;
            let containerDelta = storageAdjustments[id].container - resource.currentContainers;
            if (crateDelta < 0) {
                StorageManager.unassignCrate(resource, crateDelta * -1);
                resource.maxQuantity += crateDelta * crateVolume;
                resources.Crates.currentQuantity -= crateDelta;
            }
            if (containerDelta < 0) {
                StorageManager.unassignContainer(resource, containerDelta * -1);
                resource.maxQuantity += containerDelta * containerVolume;
                resources.Containers.currentQuantity -= containerDelta;
            }
        }
        for (let id in storageAdjustments) {
            let resource = resources[id];
            let crateDelta = storageAdjustments[id].crate - resource.currentCrates;
            let containerDelta = storageAdjustments[id].container - resource.currentContainers;
            if (crateDelta > 0) {
                StorageManager.assignCrate(resource, crateDelta);
                resource.maxQuantity += crateDelta * crateVolume;
                resources.Crates.currentQuantity += crateDelta;
            }
            if (containerDelta > 0) {
                StorageManager.assignContainer(resource, containerDelta);
                resource.maxQuantity += containerDelta * containerVolume;
                resources.Containers.currentQuantity += containerDelta;
            }
        }
    }

    function autoStorage() {
        if (haveTask("bal_storage") || !StorageManager.initStorage()) {
            return;
        }

        let storageList = StorageManager.priorityList.filter(r => r.isUnlocked() && r.isManagedStorage() && (r !== resources.Food || !game.global.race['artifical']));
        if (storageList.length === 0) {
            return;
        }

        let crateVolume = poly.crateValue();
        let containerVolume = poly.containerValue();
        if (crateVolume <= 0 || containerVolume <= 0) {
            return;
        }
        let totalCrates = resources.Crates.currentQuantity;
        let totalContainers = resources.Containers.currentQuantity;
        let storageAdjustments = [];

        // Init storageAdjustments, we need to do it saparately, as loop below can jump to the and of array
        for (let i = 0; i < storageList.length; i++){
            storageAdjustments.push({resource: storageList[i], adjustCrates: 0, adjustContainers: 0});
        }

        let totalStorageMissing = 0;

        // Calculate storages
        for (let i = 0; i < storageList.length; i++){
            let resource = storageList[i];
            let adjustment = storageAdjustments[i];
            let calculatedCrates = resource.currentCrates + adjustment.adjustCrates;
            let calculatedContainers = resource.currentContainers + adjustment.adjustContainers;
            let cratesStorage = calculatedCrates * crateVolume;
            let containersStorage = calculatedContainers * containerVolume;
            let extraStorage = cratesStorage + containersStorage;
            let rawStorage = resource.maxQuantity - extraStorage;
            let freeStorage = resource.maxQuantity - resource.currentQuantity;
            let extraStorageRequired = resource.storageRequired - rawStorage;

            // If we're overflowing, and want to store more - just request one more crate volume
            if (resource.storeOverflow) {
                extraStorageRequired = Math.max(1, extraStorageRequired, resource.currentQuantity * 1.03 - rawStorage);
            }

            // We don't need any extra storage here, and don't care about wasting, just remove everything and go to next resource
            if (!settings.storageSafeReassign && extraStorageRequired <= 0){
                totalCrates += calculatedCrates;
                totalContainers += calculatedContainers;
                adjustment.adjustCrates = resource.currentCrates * -1;
                adjustment.adjustContainers = resource.currentContainers * -1;
                continue;
            }

            // Check if have extra containers here
            if (containersStorage > 0 && ((extraStorage - containerVolume) > extraStorageRequired || calculatedContainers > resource.autoContainersMax)){
                let removedContainers = Math.max(calculatedContainers - resource.autoContainersMax, Math.min(calculatedContainers, Math.floor((extraStorage - extraStorageRequired) / containerVolume)));

                if (settings.storageSafeReassign || resource.storeOverflow) {
                    let emptyContainers = Math.floor(freeStorage / containerVolume);
                    removedContainers = Math.min(removedContainers, emptyContainers);
                }

                totalContainers += removedContainers;
                adjustment.adjustContainers -= removedContainers;
                calculatedContainers -= removedContainers;
                extraStorage -= removedContainers * containerVolume;
                freeStorage -= removedContainers * containerVolume;
            }

            // Check if have extra crates here
            if (cratesStorage > 0 && ((extraStorage - crateVolume) > extraStorageRequired || calculatedCrates > resource.autoCratesMax)){
                let removedCrates = Math.max(calculatedCrates - resource.autoCratesMax, Math.min(calculatedCrates, Math.floor((extraStorage - extraStorageRequired) / crateVolume)));

                if (settings.storageSafeReassign || resource.storeOverflow) {
                    let emptyCrates = Math.floor(freeStorage / crateVolume);
                    removedCrates = Math.min(removedCrates, emptyCrates);
                }

                totalCrates += removedCrates;
                adjustment.adjustCrates -= removedCrates;
                extraStorage -= removedCrates * crateVolume;
                //freeStorage -= removedCrates * crateVolume;
            }

            let missingStorage = extraStorageRequired - extraStorage;

            // Check if we're missing storage on this resource
            if (missingStorage > 0){
                let maxCratesToUnassign = resource.autoCratesMax - calculatedCrates;
                let maxContainersToUnassign = resource.autoContainersMax - calculatedContainers;
                let availableStorage = Math.min(maxCratesToUnassign, totalCrates) * crateVolume + Math.min(maxContainersToUnassign, totalContainers) * containerVolume;

                // We don't have enough containers, let's try to unassign something less prioritized
                if (availableStorage < missingStorage){
                    for (let j = storageList.length-1; j > i; j--){
                        let otherFreeStorage = storageList[j].maxQuantity - storageList[j].currentQuantity + (storageAdjustments[j].adjustCrates * crateVolume) + (storageAdjustments[j].adjustContainers * containerVolume);
                        let otherCalculatedCrates = storageList[j].currentCrates + storageAdjustments[j].adjustCrates;
                        let otherCalculatedContainers = storageList[j].currentContainers + storageAdjustments[j].adjustContainers;

                        // Unassign crates
                        if (maxCratesToUnassign > 0 && otherCalculatedCrates > 0) {
                            let missingCrates = Math.ceil(missingStorage / crateVolume);
                            let cratesToUnassign = Math.min(otherCalculatedCrates, missingCrates, maxCratesToUnassign);

                            if (settings.storageSafeReassign || storageList[j].storeOverflow) {
                                let emptyCrates = Math.floor(otherFreeStorage / crateVolume);
                                cratesToUnassign = Math.min(cratesToUnassign, emptyCrates);
                            }

                            storageAdjustments[j].adjustCrates -= cratesToUnassign;
                            totalCrates += cratesToUnassign;
                            maxCratesToUnassign -= cratesToUnassign;
                            missingStorage -= cratesToUnassign * crateVolume;
                            otherFreeStorage -= cratesToUnassign * crateVolume;
                        }

                        // Unassign containers, if we still need them
                        if (maxContainersToUnassign > 0 && otherCalculatedContainers > 0 && missingStorage > 0){
                            let missingContainers = Math.ceil(missingStorage / containerVolume);
                            let containersToUnassign = Math.min(otherCalculatedContainers, missingContainers, maxContainersToUnassign);

                            if (settings.storageSafeReassign || storageList[j].storeOverflow) {
                                let emptyContainers = Math.floor(otherFreeStorage / containerVolume);
                                containersToUnassign = Math.min(containersToUnassign, emptyContainers);
                            }

                            storageAdjustments[j].adjustContainers -= containersToUnassign;
                            totalContainers += containersToUnassign;
                            maxContainersToUnassign -= containersToUnassign;
                            missingStorage -= containersToUnassign * containerVolume;
                            //otherFreeStorage -= containersToUnassign * containerVolume;
                        }

                        // If we got all we needed - get back to assigning
                        if (missingStorage <= 0){
                            break;
                        }
                    }
                }
                // Restore missing storage, in case if was changed during unassignment
                missingStorage = extraStorageRequired - extraStorage;

                // Add crates
                if (totalCrates > 0) {
                    let missingCrates = Math.ceil(missingStorage / crateVolume);
                    let allowedCrates = resource.autoCratesMax - calculatedCrates;
                    let addCrates = Math.min(totalCrates, allowedCrates, missingCrates);
                    totalCrates -= addCrates;
                    adjustment.adjustCrates += addCrates;
                    missingStorage -= addCrates * crateVolume;
                }

                // Add containers
                if (totalContainers > 0 && missingStorage > 0){
                    let missingContainers = Math.ceil(missingStorage / containerVolume);
                    let allowedContainers = resource.autoContainersMax - calculatedContainers;
                    let addContainers = Math.min(totalContainers, allowedContainers, missingContainers);
                    totalContainers -= addContainers;
                    adjustment.adjustContainers += addContainers;
                    missingStorage -= addContainers * containerVolume;
                }

                if (missingStorage > 0){
                    totalStorageMissing += missingStorage;
                }
            }
        }

        // Build more storage if we didn't had enough
        if (totalStorageMissing > 0){
            expandStorage(totalStorageMissing);
        }

        // Go to clicking, unassign first
        storageAdjustments.forEach(adjustment => {
            if (adjustment.adjustCrates < 0) {
                StorageManager.unassignCrate(adjustment.resource, adjustment.adjustCrates * -1);
                adjustment.resource.maxQuantity -= adjustment.adjustCrates * -1 * crateVolume;
                resources.Crates.currentQuantity += adjustment.adjustCrates * -1;
            }
            if (adjustment.adjustContainers < 0) {
                StorageManager.unassignContainer(adjustment.resource, adjustment.adjustContainers * -1);
                adjustment.resource.maxQuantity -= adjustment.adjustContainers * -1 * containerVolume;
                resources.Containers.currentQuantity += adjustment.adjustContainers * -1;
            }
        });

        // And now assign
        storageAdjustments.forEach(adjustment => {
            if (adjustment.adjustCrates > 0) {
                StorageManager.assignCrate(adjustment.resource, adjustment.adjustCrates);
                adjustment.resource.maxQuantity += adjustment.adjustCrates * crateVolume;
                resources.Crates.currentQuantity -= adjustment.adjustCrates;
            }
            if (adjustment.adjustContainers > 0) {
                StorageManager.assignContainer(adjustment.resource, adjustment.adjustContainers);
                adjustment.resource.maxQuantity += adjustment.adjustContainers * containerVolume;
                resources.Containers.currentQuantity -= adjustment.adjustContainers;
            }
        });
    }

    // TODO: Mutate out of nasty traits
    function autoMinorTrait() {
        let m = MinorTraitManager;
        if (!m.isUnlocked()) {
            return;
        }

        let traitList = m.managedPriorityList();
        if (traitList.length === 0) {
            return;
        }

        let totalWeighting = 0;
        let totalGeneCost = 0;

        traitList.forEach(trait => {
            totalWeighting += trait.weighting;
            totalGeneCost += trait.geneCost();
        });

        traitList.forEach(trait => {
            let traitCost = trait.geneCost();
            if (trait.weighting / totalWeighting >= traitCost / totalGeneCost && resources.Genes.currentQuantity >= traitCost) {
                m.buyTrait(trait.traitName);
                resources.Genes.currentQuantity -= traitCost;
            }
        });
    }

    function adjustTradeRoutes() {
        let tradableResources = MarketManager.priorityList
          .filter(r => r.isRoutesUnlocked() && (r.autoTradeBuyEnabled || r.autoTradeSellEnabled))
          .sort((a, b) => (b.storageRatio > 0.99 ? b.tradeSellPrice * 1000 : b.usefulRatio) - (a.storageRatio > 0.99 ? a.tradeSellPrice * 1000 : a.usefulRatio));
        let requiredTradeRoutes = {};
        let currentMoneyPerSecond = resources.Money.rateOfChange;
        let tradeRoutesUsed = 0;
        let importRouteCap = MarketManager.getImportRouteCap();
        let exportRouteCap = MarketManager.getExportRouteCap();
        let [maxTradeRoutes, unmanagedTradeRoutes] = MarketManager.getMaxTradeRoutes();

        // Fill trade routes with selling
        for (let i = 0; i < tradableResources.length; i++) {
            let resource = tradableResources[i];
            if (!resource.autoTradeSellEnabled) {
                continue;
            }
            requiredTradeRoutes[resource.id] = 0;

            if (tradeRoutesUsed >= maxTradeRoutes
                || (game.global.race['banana'] && tradeRoutesUsed > 0)
                || (settings.tradeRouteSellExcess
                  ? resource.usefulRatio < 1
                  : resource.storageRatio < 0.99)) {
                continue;
            }

            let routesToAssign = Math.min(exportRouteCap, maxTradeRoutes - tradeRoutesUsed, Math.floor(resource.rateOfChange / resource.tradeRouteQuantity));
            if (routesToAssign > 0) {
                tradeRoutesUsed += routesToAssign;
                requiredTradeRoutes[resource.id] -= routesToAssign;
                currentMoneyPerSecond += resource.tradeSellPrice * routesToAssign;
            }
        }
        let minimumAllowedMoneyPerSecond = Math.min(resources.Money.maxQuantity - resources.Money.currentQuantity, Math.max(settings.tradeRouteMinimumMoneyPerSecond, settings.tradeRouteMinimumMoneyPercentage / 100 * currentMoneyPerSecond));

        // Init adjustment, and sort groups by priorities
        let priorityGroups = {};
        for (let i = 0; i < tradableResources.length; i++) {
            let resource = tradableResources[i];
            if (!resource.autoTradeBuyEnabled) {
                continue;
            }
            requiredTradeRoutes[resource.id] = requiredTradeRoutes[resource.id] ?? 0;

            if (resource.autoTradeWeighting <= 0
                || (settings.tradeRouteSellExcess
                  ? resource.usefulRatio > 0.99
                  : resource.storageRatio > 0.98)) {
                continue;
            }

            let priority = resource.autoTradePriority;
            if (resource.isDemanded()) {
                priority = Math.max(priority, 100);
                if (!resources.Money.isDemanded()) {
                    // Resource demanded, money not demanded - ignore min money, and spend as much as possible
                    minimumAllowedMoneyPerSecond = 0;
                }
            } else if ((priority < 100 && priority !== -1) && resources.Money.isDemanded()) {
                // Don't buy resources with low priority when money is demanded
                continue;
            }

            if (priority !== 0) {
                priorityGroups[priority] = priorityGroups[priority] ?? [];
                priorityGroups[priority].push(resource);
            }
        }
        let priorityList = Object.keys(priorityGroups).sort((a, b) => b - a).map(key => priorityGroups[key]);
        if (priorityGroups["-1"] && priorityList.length > 1) {
            priorityList.splice(priorityList.indexOf(priorityGroups["-1"], 1));
            priorityList[0].push(...priorityGroups["-1"]);
        }

        // Calculate amount of routes per resource
        let resSorter = (a, b) => ((requiredTradeRoutes[a.id] / a.autoTradeWeighting) - (requiredTradeRoutes[b.id] / b.autoTradeWeighting)) || b.autoTradeWeighting - a.autoTradeWeighting;
        let remainingRoutes, unassignStep;
        if (getGovernor() === "entrepreneur") {
            remainingRoutes = tradeRoutesUsed - unmanagedTradeRoutes;
            unassignStep = 2;
        } else {
            remainingRoutes = maxTradeRoutes;
            unassignStep = 1;
        }
        outerLoop:
        for (let i = 0; i < priorityList.length && remainingRoutes > 0; i++) {
            let trades = priorityList[i].sort((a, b) => a.autoTradeWeighting - b.autoTradeWeighting);
            assignLoop:
            while(trades.length > 0 && remainingRoutes > 0) {
                let resource = trades.sort(resSorter)[0];
                // TODO: Fast assign for single resource

                if (requiredTradeRoutes[resource.id] >= importRouteCap) {
                    trades.shift();
                    continue;
                }
                // Stop if next route will lower income below allowed minimum
                if (currentMoneyPerSecond - resource.tradeBuyPrice < minimumAllowedMoneyPerSecond) {
                    break outerLoop;
                }

                if (tradeRoutesUsed < maxTradeRoutes) {
                    // Still have unassigned routes
                    currentMoneyPerSecond -= resource.tradeBuyPrice;
                    tradeRoutesUsed++;
                    remainingRoutes--;
                    requiredTradeRoutes[resource.id]++;
                } else {
                    // No free routes, remove selling
                    for (let otherId in requiredTradeRoutes) {
                        if (requiredTradeRoutes[otherId] === undefined) {
                            continue
                        }
                        let otherResource = resources[otherId];
                        let currentRequired = requiredTradeRoutes[otherId];
                        if (currentRequired >= 0 || resource === otherResource) {
                            continue;
                        }

                        if (currentMoneyPerSecond - otherResource.tradeSellPrice - resource.tradeBuyPrice > minimumAllowedMoneyPerSecond && remainingRoutes >= unassignStep) {
                            currentMoneyPerSecond -= otherResource.tradeSellPrice;
                            currentMoneyPerSecond -= resource.tradeBuyPrice;
                            requiredTradeRoutes[otherId]++;
                            requiredTradeRoutes[resource.id]++;
                            remainingRoutes -= unassignStep;
                            continue assignLoop;
                        }
                    }
                    // Couldn't remove route, stop asigning
                    break outerLoop;
                }
            }
        }

        // Adjust our trade routes - always adjust towards zero first to free up trade routes
        let adjustmentTradeRoutes = [];
        for (let i = 0; i < tradableResources.length; i++) {
            let resource = tradableResources[i];
            if (requiredTradeRoutes[resource.id] === undefined) {
                continue;
            }
            adjustmentTradeRoutes[i] = requiredTradeRoutes[resource.id] - resource.tradeRoutes;

            if (requiredTradeRoutes[resource.id] === 0 && resource.tradeRoutes !== 0) {
                MarketManager.zeroTradeRoutes(resource);
                adjustmentTradeRoutes[i] = 0;
            } else if (adjustmentTradeRoutes[i] > 0 && resource.tradeRoutes < 0) {
                MarketManager.addTradeRoutes(resource, adjustmentTradeRoutes[i]);
                adjustmentTradeRoutes[i] = 0;
            } else if (adjustmentTradeRoutes[i] < 0 && resource.tradeRoutes > 0) {
                MarketManager.removeTradeRoutes(resource, -1 * adjustmentTradeRoutes[i]);
                adjustmentTradeRoutes[i] = 0;
            }
        }

        // Adjust our trade routes - we've adjusted towards zero, now adjust the rest
        for (let i = 0; i < tradableResources.length; i++) {
            let resource = tradableResources[i];
            if (requiredTradeRoutes[resource.id] === undefined) {
                continue;
            }

            if (adjustmentTradeRoutes[i] > 0) {
                MarketManager.addTradeRoutes(resource, adjustmentTradeRoutes[i]);
            } else if (adjustmentTradeRoutes[i] < 0) {
                MarketManager.removeTradeRoutes(resource, -1 * adjustmentTradeRoutes[i]);
            }
        }
        // It does change rates of changes of resources, but we don't want to store this changes.
        // Sold resources can be easily reclaimed, and we want to be able to use it for production, ejecting, upkeep, etc, so let's pretend they're still here
        // And bought resources are dungerous to use - we don't want to end with negative income after recalculating trades
        resources.Money.rateOfChange = currentMoneyPerSecond;
    }

    function autoFleetOuter() {
        let m = FleetManagerOuter;
        if (!m.initFleet() || settings.fleetOuterShips === "none") {
            return;
        }

        let yard = game.global.space.shipyard
        let newShip = settings.fleetOuterShips === "user" ? yard.blueprint : m.getBlueprint();
        if (!m.isShipAffordable(newShip) || WarManager.availableGarrison - m.ClassCrew[newShip.class] < settings.fleetOuterCrew) {
            return;
        }

        let regionsToProtect = m.Regions
          .filter(reg => m.isUnlocked(reg) && m.getWeighting(reg) > 0 && m.syndicate(reg, false, true) < (1 - settings.fleetOuterMinSyndicate))
          .sort((a, b) => ((1 - m.syndicate(b, false, true)) * m.getWeighting(b))
                        - ((1 - m.syndicate(a, false, true)) * m.getWeighting(a)));
        if (regionsToProtect.length < 1) {
            return;
        }

        if (m.build(newShip, regionsToProtect[0])) {
            let name = game.loc(`outer_shipyard_class_${newShip.class}`);
            let targetRef = game.actions.space[regionsToProtect[0]].info.name;
            let targetName = typeof targetRef === 'function' ? targetRef() : targetRef;
            GameLog.logSuccess("outer_fleet", `${name}已建造，并派往${targetName}。`, ['combat']);
        }
    }

    function autoFleet() {
        if (!FleetManager.initFleet()) {
            return;
        }
        let def = game.global.galaxy.defense;

        // Init our current state
        let allRegions = [
            {name: "gxy_stargate", piracy: (game.global.race['instinct'] ? 0.09 : 0.1) * game.global.tech.piracy, armada: buildings.StargateDefensePlatform.stateOnCount * 20, useful: true},
            {name: "gxy_gateway", piracy: (game.global.race['instinct'] ? 0.09 : 0.1) * game.global.tech.piracy, armada: buildings.GatewayStarbase.stateOnCount * 25, useful: buildings.BologniumShip.stateOnCount > 0},
            {name: "gxy_gorddon", piracy: (game.global.race['instinct'] ? 720 : 800), armada: 0, useful: buildings.GorddonFreighter.stateOnCount > 0 || buildings.Alien1SuperFreighter.stateOnCount > 0 || buildings.GorddonSymposium.stateOnCount > 0},
            {name: "gxy_alien1", piracy: (game.global.race['instinct'] ? 900 : 1000), armada: 0, useful: buildings.Alien1VitreloyPlant.stateOnCount > 0},
            {name: "gxy_alien2", piracy: (game.global.race['instinct'] ? 2250 : 2500), armada: buildings.Alien2Foothold.stateOnCount * 50 + buildings.Alien2ArmedMiner.stateOnCount * game.actions.galaxy.gxy_alien2.armed_miner.ship.rating(), useful: buildings.Alien2Scavenger.stateOnCount > 0 || buildings.Alien2ArmedMiner.stateOnCount > 0},
            {name: "gxy_chthonian", piracy: (game.global.race['instinct'] ? 7000 : 7500), armada: buildings.ChthonianMineLayer.stateOnCount * game.actions.galaxy.gxy_chthonian.minelayer.ship.rating() + buildings.ChthonianRaider.stateOnCount * game.actions.galaxy.gxy_chthonian.raider.ship.rating(), useful: buildings.ChthonianExcavator.stateOnCount > 0 || buildings.ChthonianRaider.stateOnCount > 0},
        ];
        let allFleets = [
            {name: "scout_ship", count: 0, power: game.actions.galaxy.gxy_gateway.scout_ship.ship.rating()},
            {name: "corvette_ship", count: 0, power: game.actions.galaxy.gxy_gateway.corvette_ship.ship.rating()},
            {name: "frigate_ship", count: 0, power: game.actions.galaxy.gxy_gateway.frigate_ship.ship.rating()},
            {name: "cruiser_ship", count: 0, power: game.actions.galaxy.gxy_gateway.cruiser_ship.ship.rating()},
            {name: "dreadnought", count: 0, power: game.actions.galaxy.gxy_gateway.dreadnought.ship.rating()},
        ];
        let minPower = allFleets[0].power;

        // We can't rely on stateOnCount - it won't give us correct number of ships of some of them missing crew
        let fleetIndex = Object.fromEntries(allFleets.map((ship, index) => [ship.name, index]));
        Object.values(def).forEach(assigned => Object.entries(assigned).forEach(([ship, count]) => allFleets[fleetIndex[ship]].count += count));

        // Check if we can perform assault mission
        let assault = null;
        if (buildings.ChthonianMission.isUnlocked() && settings.fleetChthonianLoses !== "ignore") {
            let fleetReq, fleetWreck;
            if (settings.fleetChthonianLoses === "low") {
                fleetReq = 4500;
                fleetWreck = 80;
            } else if (settings.fleetChthonianLoses === "avg") {
                fleetReq = 2500;
                fleetWreck = 160;
            } else if (settings.fleetChthonianLoses === "high") {
                fleetReq = 1250;
                fleetWreck = 500;
            } else if (settings.fleetChthonianLoses === "dread") {
                if (allFleets[4].count > 0) {
                    assault = {ships: [0,0,0,0,1], region: "gxy_chthonian", mission: buildings.ChthonianMission};
                }
            } else if (settings.fleetChthonianLoses === "frigate") {
                let totalPower = allFleets.reduce((sum, ship) => sum + (ship.power >= allFleets[2].power ? ship.power * ship.count : 0), 0);
                if (totalPower >= 4500) {
                    assault = {ships: allFleets.map((ship, idx) => idx >= 2 ? ship.count : 0), region: "gxy_chthonian", mission: buildings.ChthonianMission};
                }
            }
            if (game.global.race['instinct']) {
                fleetWreck /= 2;
            }

            let availableShips = allFleets.map(ship => ship.count);
            let powerToReserve = fleetReq - fleetWreck;
            for (let i = availableShips.length - 1; i >= 0 && powerToReserve > 0; i--) {
                let reservedShips = Math.min(availableShips[i], Math.ceil(powerToReserve / allFleets[i].power));
                availableShips[i] -= reservedShips;
                powerToReserve -= reservedShips * allFleets[i].power;
            }
            if (powerToReserve <= 0) {
                let sets = availableShips.map((amount, idx) => [...Array(Math.min(amount, Math.floor((fleetWreck + (minPower - 0.1)) / allFleets[idx].power)) + 1).keys()]);
                for (let set of cartesian(...sets)) {
                    let powerMissing = fleetWreck - set.reduce((sum, amt, idx) => sum + amt * allFleets[idx].power, 0);
                    if (powerMissing <= 0 && powerMissing > minPower * -1) {
                        let lastShip = set.reduce((prev, val, cur) => val > 0 ? cur : prev, 0);
                        let team = allFleets.map((ship, idx) => idx >= lastShip ? ship.count : set[idx]);
                        assault = {ships: team, region: "gxy_chthonian", mission: buildings.ChthonianMission};
                        break;
                    }
                }
            }
        } else if (buildings.Alien2Mission.isUnlocked() && resources.Knowledge.maxQuantity >= settings.fleetAlien2Knowledge) {
            let totalPower = allFleets.reduce((sum, ship) => sum + (ship.power * ship.count), 0);
            if (totalPower >= 650) {
                assault = {ships: allFleets.map(ship => ship.count), region: "gxy_alien2", mission: buildings.Alien2Mission};
            }
        }
        if (assault) {
            // Unassign all ships from where there're assigned currently
            Object.entries(def).forEach(([region, assigned]) => Object.entries(assigned).forEach(([ship, count]) => FleetManager.subShip(region, ship, count)));
            // Assign to target region
            allFleets.forEach((ship, idx) => FleetManager.addShip(assault.region, ship.name, assault.ships[idx]));
            assault.mission.click();
            return; // We're done for now; lot of data was invalidated during attack, we'll manage remaining ships in next tick
        }

        let regionsToProtect = allRegions.filter(region => region.useful && region.piracy - region.armada > 0);

        for (let i = 0; i < allRegions.length; i++) {
            let region = allRegions[i];
            region.priority = settings["fleet_pr_" + region.name];
            region.assigned = {};
            for (let j = 0; j < allFleets.length; j++) {
                region.assigned[allFleets[j].name] = 0;
            }
        }

        // Calculate min allowed coverage, if we have more ships than we can allocate without overflowing.
        let missingDef = regionsToProtect.map(region => region.piracy - region.armada);
        for (let i = allFleets.length - 1; i >= 0; i--) {
            let ship = allFleets[i];
            let maxAllocate = missingDef.reduce((sum, def) => sum + Math.floor(def / ship.power), 0);
            if (ship.count > maxAllocate) {
                if (ship.count >= maxAllocate + missingDef.length) {
                    ship.cover = 0;
                } else {
                    let overflows = missingDef.map(def => def % ship.power).sort((a, b) => b - a);
                    ship.cover = overflows[ship.count - maxAllocate - 1];
                }
            } else {
                ship.cover = ship.power - (minPower - 0.1);
            }
            if (ship.count >= maxAllocate) {
                missingDef.forEach((def, idx, arr) => arr[idx] = def % ship.power);
                if (ship.count > maxAllocate) {
                    missingDef.sort((a, b) => b - a);
                    for (let j = 0; j < ship.count - maxAllocate; j++) {
                        missingDef[j] = 0;
                    }
                }
            }
        }
        for (let i = 0; i < allFleets.length; i++){
            if (allFleets[i].count > 0) {
                allFleets[i].cover = 0.1;
                break;
            }
        }

        // Calculate actual amount of ships per zone
        let priorityList = regionsToProtect.sort((a, b) => a.priority - b.priority);
        for (let i = 0; i < priorityList.length; i++) {
            let region = priorityList[i];
            let missingDef = region.piracy - region.armada;

            // First pass, try to assign ships without overuse (unless we have enough ships to overuse everything)
            for (let k = allFleets.length - 1; k >= 0 && missingDef > 0; k--) {
                let ship = allFleets[k];
                if (ship.cover <= missingDef) {
                    let shipsToAssign = Math.min(ship.count, Math.floor(missingDef / ship.power));
                    if (shipsToAssign < ship.count && shipsToAssign * ship.power + ship.cover <= missingDef) {
                        shipsToAssign++;
                    }
                    region.assigned[ship.name] += shipsToAssign;
                    ship.count -= shipsToAssign;
                    missingDef -= shipsToAssign * ship.power;
                }
            }

            if (settings.fleetMaxCover && missingDef > 0) {
                // Second pass, try to fill remaining gaps, if wasteful overuse is allowed
                let index = -1;
                while (missingDef > 0 && ++index < allFleets.length) {
                    let ship = allFleets[index];
                    if (ship.count > 0) {
                        let shipsToAssign = Math.min(ship.count, Math.ceil(missingDef / ship.power));
                        region.assigned[ship.name] += shipsToAssign;
                        ship.count -= shipsToAssign;
                        missingDef -= shipsToAssign * ship.power;
                    }
                }

                // If we're still missing defense it means we have no more ships to assign
                if (missingDef > 0) {
                    break;
                }

                // Third pass, retrive ships which not needed after second pass
                while (--index >= 0) {
                    let ship = allFleets[index];
                    if (region.assigned[ship.name] > 0 && missingDef + ship.power <= 0) {
                        let uselesShips = Math.min(region.assigned[ship.name], Math.floor(missingDef / ship.power * -1));
                        if (uselesShips > 0) {
                            region.assigned[ship.name] -= uselesShips;
                            ship.count += uselesShips;
                            missingDef += uselesShips * ship.power;
                        }
                    }
                }
            }
        }

        // Assign remaining ships to gorddon, to utilize Symposium
        if (buildings.GorddonSymposium.stateOnCount > 0) {
            allFleets.forEach(ship => allRegions[2].assigned[ship.name] += ship.count);
        }

        let shipDeltas = allRegions.map(region => Object.entries(region.assigned).map(([ship, count]) => [ship, count - def[region.name][ship]]));

        shipDeltas.forEach((ships, region) => ships.forEach(([ship, delta]) => delta < 0 && FleetManager.subShip(allRegions[region].name, ship, delta * -1)));
        shipDeltas.forEach((ships, region) => ships.forEach(([ship, delta]) => delta > 0 && FleetManager.addShip(allRegions[region].name, ship, delta)));
    }

    function autoMech() {
        let m = MechManager;
        if (!m.initLab() || $(`#mechList .mechRow[draggable=true]`).length > 0) {
            return;
        }
        let mechBay = game.global.portal.mechbay;
        let prolongActive = m.isActive;
        m.isActive = false;
        let savingSupply = m.saveSupply && settings.mechBaysFirst;
        m.saveSupply = false;

        // Rearrange mechs for best efficiency if some of the bays are disabled
        if (m.inactiveMechs.length > 0) {
            // Each drag redraw mechs list, do it just once per tick to reduce stress
            if (m.activeMechs.length > 0) {
                m.activeMechs.sort((a, b) => a.efficiency - b.efficiency);
                m.inactiveMechs.sort((a, b) => b.efficiency - a.efficiency);
                if (m.activeMechs[0].efficiency < m.inactiveMechs[0].efficiency) {
                    if (m.activeMechs.length > m.inactiveMechs.length) {
                        m.dragMech(m.activeMechs[0].id, mechBay.mechs.length - 1);
                    } else {
                        m.dragMech(m.inactiveMechs[0].id, 0);
                    }
                }
            }
            return; // Can't do much while having disabled mechs, without scrapping them all. And that's really bad idea. Just wait until bays will be enabled back.
        }

        if (haveTask("mech")) {
            return; // Do nothing except dragging if governor enabled
        }

        let newMech = {};
        let newSize, forceBuild;
        if (settings.mechBuild === "random") {
            [newSize, forceBuild] = m.getPreferredSize();
            newMech = m.getRandomMech(newSize);
        } else if (settings.mechBuild === "user") {
            newMech = {...mechBay.blueprint, ...m.getMechStats(mechBay.blueprint)};
        } else { // mechBuild === "none"
            return; // Mech build disabled, stop here
        }
        let [newGems, newSupply, newSpace] = m.getMechCost(newMech);

        if (!settings.mechFillBay && resources.Supply.spareMaxQuantity < newSupply) {
            return; // Not enough supply capacity, and smaller mechs are disabled, can't do anything
        }

        let baySpace = mechBay.max - mechBay.bay;
        let lastFloor = settings.prestigeType === "demonic" && buildings.SpireTower.count >= settings.prestigeDemonicFloor && haveTech("waygate", 3);
        if (lastFloor) {
            savingSupply = false;
        }

        // Save up supply for next floor
        if (settings.mechSaveSupplyRatio > 0 && !lastFloor && !forceBuild) {
            let missingSupplies = (resources.Supply.maxQuantity * settings.mechSaveSupplyRatio) - resources.Supply.currentQuantity;
            if (baySpace < newSpace) {
                missingSupplies -= m.getMechRefund({size: "titan"})[1];
            }
            let timeToFullSupplies = missingSupplies / resources.Supply.rateOfChange;
            if (m.getTimeToClear() <= timeToFullSupplies) {
                return; // Floor will be cleared before capping supplies, save them
            }
        }

        let canExpandBay = settings.mechBaysFirst && buildings.SpireMechBay.isAutoBuildable() && (buildings.SpireMechBay.isAffordable(true) || (buildings.SpirePurifier.isAutoBuildable() && buildings.SpirePurifier.isAffordable(true) && buildings.SpirePurifier.stateOffCount === 0));
        let mechScrap = settings.mechScrap;
        if (canExpandBay && resources.Supply.currentQuantity < resources.Supply.maxQuantity && !prolongActive && resources.Supply.rateOfChange >= settings.mechMinSupply) {
            // We can build purifier or bay once we'll have enough resources, do not rebuild old mechs
            // Unless floor just changed, and scrap income fall to low, so we need to rebuild them to fix it
            mechScrap = "none";
        } else if (settings.mechScrap === "mixed") {
            if (buildings.SpireWaygate.stateOnCount === 1) {
                // No mass scrapping during Demon Lord fight, all mechs equially good here - stay with full bay
                mechScrap = "single";
            } else {
                let mechToBuild = Math.floor(baySpace / newSpace);
                // If we're going to save up supplies we need to reserve time for it
                let supplyCost = (mechToBuild * newSupply) + (resources.Supply.maxQuantity * settings.mechSaveSupplyRatio);
                let timeToFullBay = Math.max((supplyCost - resources.Supply.currentQuantity) / resources.Supply.rateOfChange,
                              (mechToBuild * newGems - resources.Soul_Gem.currentQuantity) / resources.Soul_Gem.rateOfChange);
                // timeToClear changes drastically with new mechs, let's try to normalize it, scaling it with available power
                let estimatedTotalPower = m.mechsPower + mechToBuild * newMech.power;
                let estimatedTimeToClear = m.getTimeToClear() * (m.mechsPower / estimatedTotalPower);
                mechScrap = timeToFullBay > estimatedTimeToClear && !lastFloor ? "single" : "all";
            }
        }

        // Check if we need to scrap anything
        if (newSupply < resources.Supply.spareMaxQuantity && ((mechScrap === "single" && baySpace < newSpace) || (mechScrap === "all" && (baySpace < newSpace || resources.Supply.spareQuantity < newSupply || resources.Soul_Gem.spareQuantity < newGems)))) {
            let spaceGained = 0;
            let supplyGained = 0;
            let gemsGained = 0;
            let powerLost = 0;

            // Get list of inefficient mech
            let scrapEfficiency =
              (settings.mechFillBay ? baySpace === 0 : baySpace < newSpace) && resources.Supply.storageRatio > 0.9 && !savingSupply ? 0 :
              lastFloor ? Math.min(settings.mechScrapEfficiency, 1) :
              settings.mechScrapEfficiency;

            let badMechList = m.activeMechs.filter(mech => {
                if ((mech.infernal && mech.size !== 'collector') || mech.power >= m.bestMech[mech.size].power) {
                    return false;
                }
                if (forceBuild) { // Get everything that isn't infernal or 100% optimal for force rebuild
                    return true;
                }
                let [gemRefund, supplyRefund] = m.getMechRefund(mech);
                // Collector and scout does not refund gems. Let's pretend they're returning half of gem during filtering
                let costRatio = Math.min((gemRefund || 0.5) / newGems, supplyRefund / newSupply);
                let powerRatio = mech.power / newMech.power;
                return costRatio / powerRatio > scrapEfficiency;
            }).sort((a, b) => a.efficiency - b.efficiency);

            let extraScouts = settings.mechScoutsRebuild ? Number.MAX_SAFE_INTEGER : mechBay.scouts - (mechBay.max * settings.mechScouts / 2);

            // Remove worst mechs untill we have enough room for new mech
            let trashMechs = [];
            for (let i = 0; i < badMechList.length && (baySpace + spaceGained < newSpace || (mechScrap === "all" && (resources.Supply.spareQuantity + supplyGained < newSupply || resources.Soul_Gem.spareQuantity + gemsGained < newGems))); i++) {
                if (badMechList[i].size === 'small') {
                    if (extraScouts < 1) {
                        continue;
                    } else {
                        extraScouts--;
                    }
                }
                spaceGained += m.getMechSpace(badMechList[i]);
                supplyGained += m.getMechRefund(badMechList[i])[1];
                gemsGained += m.getMechRefund(badMechList[i])[0];
                powerLost += badMechList[i].power;
                trashMechs.push(badMechList[i]);
            }

            // Now go scrapping, if possible and benefical
            if (trashMechs.length > 0 && (forceBuild || powerLost / spaceGained < newMech.efficiency) && baySpace + spaceGained >= newSpace && resources.Supply.spareQuantity + supplyGained >= newSupply && resources.Soul_Gem.spareQuantity + gemsGained >= newGems) {
                trashMechs.sort((a, b) => b.id - a.id); // Goes from bottom to top of the list, so it won't shift IDs
                if (trashMechs.length > 1) {
                    let rating = average(trashMechs.map(mech => mech.power / m.bestMech[mech.size].power));
                    GameLog.logSuccess("mech_scrap", `${trashMechs.length}机甲(~${Math.round(rating * 100)}%)已解体。`, ['hell']);
                } else {
                    GameLog.logSuccess("mech_scrap", `${m.mechDesc(trashMechs[0])}机甲已解体。`, ['hell']);
                }
                trashMechs.forEach(mech => m.scrapMech(mech));
                resources.Supply.currentQuantity = Math.min(resources.Supply.currentQuantity + supplyGained, resources.Supply.maxQuantity);
                resources.Soul_Gem.currentQuantity += gemsGained;
                baySpace += spaceGained;
            } else if (baySpace + spaceGained >= newSpace) {
                return; // We have scrapable mechs, but don't want to scrap them right now. Waiting for more supplies for instant replace.
            }
        }

        // Try to squeeze smaller mech, if we can't fit preferred one
        if (settings.mechFillBay && !savingSupply && ((!canExpandBay && baySpace < newSpace) || resources.Supply.maxQuantity < newSupply)) {
            for (let i = m.Size.indexOf(newMech.size) - 1; i >= 0; i--) {
                [newGems, newSupply, newSpace] = m.getMechCost({size: m.Size[i]});
                if (newSpace <= baySpace && newSupply <= resources.Supply.maxQuantity) {
                    newMech = m.getRandomMech(m.Size[i]);
                    break;
                }
            }
        }

        // We have everything to get new mech
        if (resources.Soul_Gem.spareQuantity >= newGems && resources.Supply.spareQuantity >= newSupply && baySpace >= newSpace) {
            m.buildMech(newMech);
            resources.Supply.currentQuantity -= newSupply;
            resources.Soul_Gem.currentQuantity -= newGems;
            m.isActive = prolongActive;
            return;
        }
    }

    function updateScriptData() {
        for (let id in resources) {
            resources[id].updateData();
        }
        WarManager.updateGarrison();
        WarManager.updateHell();
        MarketManager.updateData();

        // Parse global production modifiers
        state.globalProductionModifier = 1;
        for (let mod of Object.values(game.breakdown.p.Global)) {
            state.globalProductionModifier *= 1 + (parseFloat(mod) || 0) / 100;
        }
    }

    function finalizeScriptData() {
        SpyManager.updateForeigns();
        FleetManagerOuter.updateShipCost();
        for (let id in resources) {
            resources[id].finalizeData();
        }
        EjectManager.updateResources();
        SupplyManager.updateResources();
        NaniteManager.updateResources();

        // Money is special. They aren't defined as tradable, but still affected by trades
        if (settings.autoMarket) {
            let tradeDiff = game.breakdown.p.consume["Money"].Trade || 0;
            if (tradeDiff > 0) {
                resources.Money.rateMods['buy'] = tradeDiff * -1;
            } else if (tradeDiff < 0) {
                resources.Money.rateMods['sell'] = tradeDiff * -1;
                resources.Money.rateOfChange += resources.Money.rateMods['sell'];
            }
        }
        if (settings.autoPylon && RitualManager.initIndustry()) {
            Object.values(RitualManager.Productions)
              .filter(spell => spell.isUnlocked())
              .forEach(spell => resources.Mana.rateOfChange += RitualManager.spellCost(spell));
        }

        // Add clicking to rate of change, so we can sell or eject it.
        if (settings.buildingAlwaysClick || (settings.autoBuild && (resources.Population.currentQuantity <= 15 || (buildings.RockQuarry.count < 1 && !game.global.race['sappy'])))) {
            let resPerClick = getResourcesPerClick() * ticksPerSecond();
            if (buildings.Food.isClickable()) {
                resources.Food.rateOfChange += resPerClick * settings.buildingClickPerTick * (haveTech("conjuring", 1) ? 10 : 1);
            }
            if (buildings.Lumber.isClickable()) {
                resources.Lumber.rateOfChange += resPerClick * settings.buildingClickPerTick  * (haveTech("conjuring", 2) ? 10 : 1);
            }
            if (buildings.Stone.isClickable()) {
                resources.Stone.rateOfChange += resPerClick * settings.buildingClickPerTick  * (haveTech("conjuring", 2) ? 10 : 1);
            }
            if (buildings.Chrysotile.isClickable()) {
                resources.Chrysotile.rateOfChange += resPerClick * settings.buildingClickPerTick  * (haveTech("conjuring", 2) ? 10 : 1);
            }
            if (buildings.Slaughter.isClickable()){
                resources.Lumber.rateOfChange += resPerClick * settings.buildingClickPerTick;
                if (game.global.race['soul_eater'] && haveTech("primitive", 2)){
                    resources.Food.rateOfChange += resPerClick * settings.buildingClickPerTick;
                }
                if (resources.Furs.isUnlocked()) {
                    resources.Furs.rateOfChange += resPerClick * settings.buildingClickPerTick;
                }
            }
        }
    }

    function requestStorageFor(list) {
        // Required amount increased by 3% from actual numbers, as other logic of script can and will try to prevent overflowing by selling\ejecting\building projects, and that might cause an issues if we'd need 100% of storage
        let bufferMult = settings.storageAssignExtra ? 1.03 : 1;
        listLoop:
        for (let i = 0; i < list.length; i++) {
            let obj = list[i];
            for (let res in obj.cost) {
                if (resources[res].maxQuantity < obj.cost[res] && !resources[res].hasStorage()) {
                    continue listLoop;
                }
            }
            for (let res in obj.cost) {
                resources[res].storageRequired = Math.max(obj.cost[res] * bufferMult, resources[res].storageRequired);
            }
        }
    }

    function calculateRequiredStorages() {
        // We need to preserve amount of knowledge required by techs only, while amount still not polluted
        // by buildings - wardenclyffe, labs, etc. This way we can determine what's our real demand is.
        // Otherwise they might start build up knowledge cap just to afford themselves, increasing required
        // cap further, so we'll need more labs, and they'll demand even more knowledge for next level and so on.
        state.knowledgeRequiredByTechs = Math.max(0, ...state.unlockedTechs.map(tech => tech.cost["Knowledge"] ?? 0));

        // Get list of all objects and techs, and find biggest numbers for each resource
        if (FleetManagerOuter.nextShipExpandable && settings.prioritizeOuterFleet !== "ignore") {
            requestStorageFor([{cost: FleetManagerOuter.nextShipCost}]);
        }
        requestStorageFor(state.unlockedTechs);
        requestStorageFor(state.queuedTargetsAll);
        requestStorageFor(BuildingManager.priorityList.filter((b) => b.isUnlocked() && b.autoBuildEnabled));
        requestStorageFor(ProjectManager.priorityList.filter((p) => p.isUnlocked() && p.autoBuildEnabled));

        // Increase storage for sellable resources, to make sure we'll have required amount before they'll be sold
        if (settings.storageAssignExtra && !game.global.race['no_trade'] && settings.autoMarket) {
            for (let id in resources) {
                if (resources[id].autoSellEnabled && resources[id].autoSellRatio > 0) {
                    resources[id].storageRequired /= resources[id].autoSellRatio;
                }
            }
        }
    }

    function prioritizeDemandedResources() {
        let prioritizedTasks = [];
        // Building and research queues
        if (settings.prioritizeQueue.includes("req")) {
            prioritizedTasks.push(...state.queuedTargets);
        }
        // Active triggers
        if (settings.prioritizeTriggers.includes("req")) {
            prioritizedTasks.push(...state.triggerTargets);
        }
        // Unlocked missions
        if (settings.missionRequest) {
            for (let i = state.missionBuildingList.length - 1; i >= 0; i--) {
                let mission = state.missionBuildingList[i];
                if (mission.isUnlocked() && mission.autoBuildEnabled && (mission !== buildings.BlackholeJumpShip || !settings.prestigeBioseedConstruct || settings.prestigeType !== "whitehole")) {
                    prioritizedTasks.push(mission);
                } else if (mission.isComplete()) { // Mission finished, remove it from list
                    state.missionBuildingList.splice(i, 1);
                }
            }
        }

        // Unlocked and affordable techs, but only if we don't have anything more important
        if (prioritizedTasks.length === 0 && ((game.global.race['cataclysm'] || haveTech("mad")) ? settings.researchRequestSpace : settings.researchRequest)) {
            prioritizedTasks = state.unlockedTechs.filter(t => t.isAffordable());
        }

        if (prioritizedTasks.length > 0) {
            for (let i = 0; i < prioritizedTasks.length; i++){
                let demandedObject = prioritizedTasks[i];
                for (let res in demandedObject.cost) {
                    let resource = resources[res];
                    let quantity = demandedObject.cost[res];
                    // Double request for project, to make it smoother
                    if (demandedObject instanceof Project && demandedObject.progress < 99) {
                        quantity *= 2;
                    }
                    resource.requestedQuantity = Math.max(resource.requestedQuantity, quantity);
                }
            }
        }

        // Request money for unification
        if (SpyManager.purchaseMoney && settings.prioritizeUnify.includes("req")) {
            resources.Money.requestedQuantity = Math.max(resources.Money.requestedQuantity, SpyManager.purchaseMoney);
        }

        if (FleetManagerOuter.nextShipAffordable && settings.prioritizeOuterFleet.includes("req")) {
            for (let res in FleetManagerOuter.nextShipCost) {
                let resource = resources[res];
                resource.requestedQuantity = Math.max(resource.requestedQuantity, FleetManagerOuter.nextShipCost[res]);
            }
        }

        // Prioritize material for craftables
        for (let id in resources) {
            let resource = resources[id];
            if (resource.isDemanded()) {
                // Only craftables stores their cost, no need for additional checks
                for (let res in resource.cost) {
                    let material = resources[res];
                    material.requestedQuantity = Math.max(material.requestedQuantity, material.maxQuantity * (resource.craftPreserve + 0.05));
                }
            }
        }

        // Prioritize some factory materials when needed
        let factoryThreshold = settings.productionFactoryMinIngredients + 0.01;
        if (resources.Stanene.isDemanded() && resources.Nano_Tube.storageRatio < factoryThreshold) {
            resources.Nano_Tube.requestedQuantity = Math.max(resources.Nano_Tube.requestedQuantity, resources.Nano_Tube.maxQuantity * factoryThreshold);
        }
        if (resources.Nano_Tube.isDemanded() && resources.Coal.storageRatio < factoryThreshold) {
            resources.Coal.requestedQuantity = Math.max(resources.Coal.requestedQuantity, resources.Coal.maxQuantity * factoryThreshold);
        }
        if (resources.Furs.isDemanded() && resources.Polymer.storageRatio < factoryThreshold) {
            resources.Polymer.requestedQuantity = Math.max(resources.Polymer.requestedQuantity, resources.Polymer.maxQuantity * factoryThreshold);
        }
        // TODO: Prioritize missing consumptions of buildings
        // Force crafting Stanene when there's less than minute worths of consumption, or 5%
        if (buildings.Alien1VitreloyPlant.count > 0 && resources.Stanene.currentQuantity < Math.min((buildings.Alien1VitreloyPlant.stateOnCount || 1) * 6000, resources.Stanene.maxQuantity * 0.05)) {
            resources.Stanene.requestedQuantity = resources.Stanene.maxQuantity;
        }
    }

    function updatePriorityTargets() {
        state.conflictTargets = [];
        state.queuedTargets = [];
        state.queuedTargetsAll = [];
        state.triggerTargets = [];
        state.unlockedTechs = [];
        state.unlockedBuildings = [];

        // Building and research queues
        let queueSave = settings.prioritizeQueue.includes("save");
        [{type: "queue", noorder: "qAny", map: (id) => buildingIds[id] || arpaIds[id]},
         {type: "r_queue", noorder: "qAny_res", map: (id) => techIds[id]}].forEach(queue => {
            if (game.global[queue.type].display) {
                for (let item of game.global[queue.type].queue) {
                    let obj = queue.map(item.id);
                    if (obj) {
                        state.queuedTargetsAll.push(obj);
                        if (obj.isAffordable(true)) {
                            state.queuedTargets.push(obj);
                            if (queueSave) {
                                state.conflictTargets.push({name: obj.title, cause: "队列", cost: obj.cost});
                            }
                        }
                    }
                    if (!game.global.settings[queue.noorder]) {
                        break;
                    }
                }
            }
        });

        if (SpyManager.purchaseMoney && settings.prioritizeUnify.includes("save")) {
            state.conflictTargets.push({name: techIds["tech-unification"].title, cause: "收购", cost: {Money: SpyManager.purchaseMoney}});
        }

        if (FleetManagerOuter.nextShipAffordable && settings.prioritizeOuterFleet.includes("save")) {
            state.conflictTargets.push({name: game.global.space.shipyard.blueprint.name ?? "无名舰船", cause: "舰船", cost: FleetManagerOuter.nextShipCost});
        }

        if (settings.autoTrigger) {
            TriggerManager.resetTargetTriggers();
            let triggerSave = settings.prioritizeTriggers.includes("save");

            // Fake trigger for Embassy, not same as real ones, but should be good enough
            if (buildings.GorddonEmbassy.isAutoBuildable() && resources.Knowledge.maxQuantity >= settings.fleetEmbassyKnowledge) {
                let obj = buildings.GorddonEmbassy;
                state.triggerTargets.push(obj);
                if (triggerSave) {
                    state.conflictTargets.push({name: obj.title, cause: "战舰", cost: obj.cost});
                }
            }

            // Active triggers
            for (let trigger of TriggerManager.targetTriggers) {
                let id = trigger.actionId;
                let obj = arpaIds[id] || buildingIds[id] || techIds[id];
                if (obj) {
                    state.triggerTargets.push(obj);
                    if (triggerSave) {
                        state.conflictTargets.push({name: obj.title, cause: "触发器", cost: obj.cost});
                    }
                }
            }
        }

        $("#tech .action").each(function() {
            let tech = techIds[this.id];
            if (!getTechConflict(tech) || state.triggerTargets.includes(tech) || state.queuedTargetsAll.includes(tech)) {
                tech.updateResourceRequirements();
                state.unlockedTechs.push(tech);
            }
        });
    }

    function checkEvolutionResult() {
        if (settings.autoEvolution && settings.evolutionBackup){
            let needReset = false;

            if (settings.userEvolutionTarget === "auto") {
                let newRace = races[game.global.race.species];

                if (newRace.getWeighting() <= 0) {
                    let bestWeighting = Math.max(...Object.values(races).map(r => r.getWeighting()));
                    if (bestWeighting > 0) {
                        GameLog.logDanger("special", `${newRace.name} have no unearned achievements for current prestige, soft resetting and trying again.`, ['progress', 'achievements']);
                        needReset = true;
                    } else {
                        GameLog.logWarning("special", `Can't pick a race with unearned achievements for current prestige. Continuing with ${newRace.name}.`, ['progress', 'achievements']);
                    }
                }
            } else if (settings.userEvolutionTarget !== game.global.race.species && races[settings.userEvolutionTarget].getHabitability() > 0) {
                GameLog.logDanger("special", `Wrong race, soft resetting and trying again.`, ['progress']);
                needReset = true;
            }

            if (needReset) {
                // Let's double check it's actually *soft* reset
                let resetButton = document.querySelector(".reset .button:not(.right)");
                if (resetButton.innerText === game.loc("reset_soft")) {
                    if (settings.evolutionQueueEnabled && settingsRaw.evolutionQueue.length > 0) {
                        if (!settings.evolutionQueueRepeat) {
                            addEvolutionSetting();
                        }
                        settingsRaw.evolutionQueue.unshift(settingsRaw.evolutionQueue.pop());
                    }
                    updateSettingsFromState();

                    state.goal = "GameOverMan";
                    resetButton.disabled = false;
                    resetButton.click();
                    return false;
                }
            }
        }
        return true;
    }

    function updateTabs() {
        let oldHash = state.tabHash;
        state.tabHash = 0 // Not really a hash, but it should never go down, that's enough to track unlocks. (Except market after mutation in terrifying, 1000 weight should prevent all possible issues)
          + (game.global.race['smoldering'] && $("#iQuarry").length === 0 ? buildings.RockQuarry.count : 0) // Chrysotile production
          + (game.global.race['shapeshifter'] ? 1 : 0) // Shifter UI
          + (game.global.settings.showMarket ? 1000 : 0) // Market tab unlocked
          + (game.global.galaxy.trade ? 1 : 0) // Galaxy trades unlocked
          + (game.global.settings.showEjector ? 1 : 0) // Ejector tab unlocked
          + (game.global.settings.showCargo ? 1 : 0) // Supply tab unlocked
          + (game.global.tech.alchemy ?? 0) // Basic & advanced transmutations
          + (game.global.tech.queue ? 1 : 0) // Queue unlocked
          + (game.global.tech.r_queue ? 1 : 0) // Research queue unlocked
          + (game.global.tech.govern ? 1 : 0) // Government unlocked
          + (game.global.tech.trade ? 1 : 0) // Trade Routes unlocked
          + (resources.Crates.isUnlocked() ? 1 : 0) // Crates in storage tab
          + (resources.Containers.isUnlocked() ? 1 : 0); // Containers in storage tab

        if (game.global.settings.showShipYard) { // TP Ship Yard
          state.tabHash += 1
            + (game.global.tech.syard_class ?? 0) // Tiers of unlocked components
            + (game.global.tech.syard_power ?? 0)
            + (game.global.tech.syard_weapon ?? 0)
            + (game.global.tech.syard_armor ?? 0)
            + (game.global.tech.syard_engine ?? 0)
            + (game.global.tech.syard_sensor ?? 0)
            + (haveTech('titan', 3) && haveTech('enceladus', 2) ? 1 : 0) // Enceladus syndicate
            + (haveTech('triton', 2) ? 1 : 0) // Triton syndicate
            + (haveTech('kuiper') ? 1 : 0) // Kuiper syndicate
            + (haveTech('eris') ? 1 : 0); // Eris syndicate
        }

        if (game.global.race['shapeshifter']){
            state.tabHash += (game.global.race.ss_genus ?? 'none').split('').reduce((a,b)=>{a=((a<<5)-a)+b.charCodeAt(0);return a&a},0);
        }

        return state.tabHash !== oldHash; // Return true if something changed since last check, and we need to redraw preloaded tabs
    }

    function updateState() {
        if (game.global.race.species === "protoplasm") {
            state.goal = "Evolution";
        } else if (state.goal === "Evolution") {
            // Check what we got after evolution
            if (!checkEvolutionResult()) {
                return;
            }
            state.goal = "Standard";
            if (settingsRaw.triggers.length > 0) { // We've moved from evolution to standard play. There are technology descriptions that we couldn't update until now.
                updateTriggerSettingsContent();
            }
        }

        // Redraw tabs once they unlocked
        if (updateTabs()) {
            let mainVue = $('#mainColumn > div:first-child')[0].__vue__;
            mainVue.s.civTabs = 7;
            $(".settings11").click().click();
            mainVue.s.civTabs = game.global.settings.civTabs;
        }

        // Reset required storage and prioritized resources
        for (let id in resources) {
            resources[id].storageRequired = 1;
            resources[id].requestedQuantity = 0;
        }
        updateCraftCost();
        updatePriorityTargets();  // Set queuedTargets and triggerTargets
        BuildingManager.updateBuildings(); // Set obj.cost
        ProjectManager.updateProjects(); // Set obj.cost, uses triggerTargets
        calculateRequiredStorages(); // Uses obj.cost
        prioritizeDemandedResources(); // Set res.requestedQuantity, uses queuedTargets and triggerTargets

        state.moneyIncomes.push(resources.Money.rateOfChange);
        state.moneyIncomes.shift();
        state.moneyMedian = average(state.moneyIncomes);

        // This comes from the "const towerSize = (function(){" in portal.js in the game code
        let towerSize = 1000;
        if (game.global.hasOwnProperty('pillars')){
            for (let pillar in game.global.pillars) {
                if (game.global.pillars[pillar]){
                    towerSize -= 12;
                }
            }
        }

        buildings.GateEastTower.gameMax = towerSize;
        buildings.GateWestTower.gameMax = towerSize;

        // Space dock is special and has a modal window with more buildings!
        if (!buildings.GasSpaceDock.isOptionsCached()) {
            buildings.GasSpaceDock.cacheOptions();
        }
    }

    function verifyGameActions() {
        // Check that actions that exist in game also exist in our script
        verifyGameActionsExist(game.actions.city, buildings, false);
        verifyGameActionsExist(game.actions.space, buildings, true);
        verifyGameActionsExist(game.actions.interstellar, buildings, true);
        verifyGameActionsExist(game.actions.portal, buildings, true);
        verifyGameActionsExist(game.actions.galaxy, buildings, true);
    }

    function verifyGameActionsExist(gameObject, scriptObject, hasSubLevels) {
        let scriptKeys = Object.keys(scriptObject);
        for (let gameActionKey in gameObject) {
            if (!hasSubLevels) {
                verifyGameActionExists(scriptKeys, scriptObject, gameActionKey, gameObject);
            } else {
                // This object has sub levels - iterate through them
                let gameSubObject = gameObject[gameActionKey];
                for (let gameSubActionKey in gameSubObject) {
                    verifyGameActionExists(scriptKeys, scriptObject, gameSubActionKey, gameSubObject);
                }
            }
        }
    }

    function verifyGameActionExists(scriptKeys, scriptObject, gameActionKey, gameObject) {
        // We know that we don't have the info objects defined in our script
        // gift is a special santa gift. Leave it to the player.
        // bonfire and firework belongs to seasonal events
        if (["info", "gift", "bonfire", "firework"].includes(gameActionKey)) {
            return;
        }

        let scriptActionFound = false;

        for (let i = 0; i < scriptKeys.length; i++) {
            const scriptAction = scriptObject[scriptKeys[i]];
            if (scriptAction.id === gameActionKey) {
                scriptActionFound = true;
                break;
            }
        }

        if (!scriptActionFound) {
            console.log("Game action key not found in script: " + gameActionKey + " (" + gameObject[gameActionKey].id + ")");
            console.log(gameObject[gameActionKey]);
        }
    }

    function initialiseScript() {
        // Init objects and lookup tables
        for (let [key, action] of Object.entries(game.actions.tech)) {
            techIds[action.id] = new Technology(key);
        }
        for (let building of Object.values(buildings)){
            buildingIds[building._vueBinding] = building;
            // Don't force building Jump Ship and Pit Assault, they're prety expensive at the moment when unlocked.
            if (building.isMission() && building !== buildings.BlackholeJumpShip && building !== buildings.PitAssaultForge) {
                state.missionBuildingList.push(building);
            }
        }
        for (let project of Object.values(projects)){
            arpaIds[project._vueBinding] = project;
        }
        for (let job of Object.values(jobs)){
            jobIds[job._originalId] = job;
        }

        updateStandAloneSettings();
        updateStateFromSettings();
        updateSettingsFromState();

        TriggerManager.priorityList.forEach(trigger => {
            trigger.complete = false;
        });

        // If debug logging is enabled then verify the game actions code is both correct and in sync with our script code
        if (checkActions) {
            verifyGameActions();
        }

        // Normal popups
        new MutationObserver(tooltipObserverCallback).observe(document.getElementById("main"), {childList: true});

        // Modals; check script callbacks and add Space Dock tooltips
        new MutationObserver(bodyMutations =>  bodyMutations.forEach(bodyMutation => bodyMutation.addedNodes.forEach(node => {
            if (node.nodeType === Node.ELEMENT_NODE && node.classList.contains("modal")) {
                if (WindowManager.openedByScript) {
                    node.style.display = "none"; // Hide splash
                    new MutationObserver(WindowManager.checkCallbacks).observe(document.getElementById("modalBox"), {childList: true});
                } else {
                    new MutationObserver(tooltipObserverCallback).observe(node, {childList: true});
                }
            }
        }))).observe(document.querySelector("body"), {childList: true});

        // Log filtering
        buildFilterRegExp();
        new MutationObserver(filterLog).observe(document.getElementById("msgQueueLog"), {childList: true});
    }

    function buildFilterRegExp() {
        let regexps = [];
        let validIds = [];
        let strings = settingsRaw.logFilter.split(/[^0-9a-z_]/g).filter(Boolean);
        for (let i = 0; i < strings.length; i++) {
            let id = strings[i];
            // Loot message built from multiple strings without tokens, let's fake one for regexp below
            let message = game.loc(id) + (id === "civics_garrison_gained" ? "%0" : "");
            if (message === id) {
                continue;
            }
            regexps.push(message.replace(/[.*+?^${}()|[\]\\]/g, "\\$&").replace(/%\d/g, ".*"));
            validIds.push(id);
        }
        if (regexps.length > 0) {
            state.filterRegExp = new RegExp("^(" + regexps.join("|") + ")$");
            settingsRaw.logFilter = validIds.join(", ");
        } else {
            state.filterRegExp = null;
            settingsRaw.logFilter = "";
        }
    }

    function filterLog(mutations) {
        if (!settings.masterScriptToggle || !state.filterRegExp) {
            return;
        }
        mutations.forEach(mutation => mutation.addedNodes.forEach(node => {
            if (state.filterRegExp.test(node.innerText)) {
                node.remove();
            }
        }));
    }

    function getTooltipInfo(obj) {
        let notes = [];
        if (obj === buildings.NeutronCitadel) {
            notes.push(`下次建造将多耗电 ${getCitadelConsumption(obj.stateOnCount+1) - getCitadelConsumption(obj.stateOnCount)} MW`);
        }
        if (obj === buildings.SpireMechBay && MechManager.initLab()) {
            notes.push(`当前机甲潜力：${getNiceNumber(MechManager.mechsPotential)}`);
            let supplyCollected = MechManager.activeMechs
              .filter(mech => mech.size === 'collector')
              .reduce((sum, mech) => sum + (mech.power * MechManager.collectorValue), 0);
            if (supplyCollected > 0) {
                notes.push(`补给获取：${getNiceNumber(supplyCollected)}/s`);
            }

        }

        if ((obj instanceof Technology || (!settings.autoARPA && obj._tab === "arpa") || (!settings.autoBuild && obj._tab !== "arpa")) && !state.queuedTargetsAll.includes(obj) && !state.triggerTargets.includes(obj)) {
            let conflict = getCostConflict(obj);
            if (conflict) {
                notes.push(`与${conflict.obj.name}因${conflict.res.title}而冲突 (${conflict.obj.cause})`);
            }
        }

        if (obj instanceof Technology) {
            if (state.queuedTargetsAll.includes(obj)) {
                notes.push("处理研究队列……");
            } else if (state.triggerTargets.includes(obj)) {
                notes.push("处理触发器中的研究……");
            } else {
                let conflict = getTechConflict(obj);
                if (conflict) {
                    notes.push(conflict);
                }
            }
        }

        if (obj === buildings.GorddonFreighter && haveTech('banking', 13)) {
            let count = obj.stateOnCount;
            let total = (((1 + ((count + 1) * 0.03)) / (1 + ((count) * 0.03))) - 1) * 100;
            let crew = total / 3;
            notes.push(`下次建造将使${buildings.AlphaExchange.title}的储量上限 +${getNiceNumber(total)}% (每名船员 +${getNiceNumber(crew)}%)`);
        }
        if (obj === buildings.Alien1SuperFreighter && haveTech('banking', 13)) {
            let count = obj.stateOnCount;
            let total = (((1 + ((count + 1) * 0.08)) / (1 + ((count) * 0.08))) - 1) * 100;
            let crew = total / 5;
            notes.push(`下次建造将使${buildings.AlphaExchange.title}的储量上限 +${getNiceNumber(total)}% (每名船员 +${getNiceNumber(crew)}%)`);
        }
        if (obj === buildings.Hospital) {
            let heal = 1 / (getHealingRate() / 5); // Long loop, once per 5 seconds
            notes.push(`约需要 ${getNiceNumber(heal)} 秒才能治愈一名伤兵`);
            let growth = 1 / (getGrowthRate() * 4); // Fast loop, 4 times per second
            notes.push(`约需要 ${getNiceNumber(growth)} 秒才能新增一位市民`);
        }
        if (obj === buildings.PortalCarport && jobs.HellSurveyor.count > 0) {
            let influx = 5 * (1 + (buildings.BadlandsAttractor.stateOnCount * 0.22));
            let demons = (influx * 10 + influx * 50) / 2;
            let divisor = getGovernor() === 'sports' ? 1100 : 1000;
            divisor *= traitVal('blurry', 0, '+');
            divisor *= traitVal('instinct', 0, '+');
            divisor += haveTech('infernite', 5) ? 250 : 0;
            let danger = demons / divisor;
            let risk = 10 - Math.min(10, jobs.HellSurveyor.count) / 2;
            let rate = (danger / 2 * Math.min(1, danger / risk));
            let wreck = 1 / (rate / 5); // Long loop, once per 5 seconds
            notes.push(`约 ${getNiceNumber(wreck)} 秒后有一辆勘探车损坏（假设已经完全压制）`);
        }
        if (obj === buildings.PortalRepairDroid) {
            let wallRepair = Math.round(200 * (0.95 ** obj.stateOnCount)) / 4;
            let carRepair = Math.round(180 * (0.95 ** obj.stateOnCount)) / 4;
            notes.push(`约需要 ${getNiceNumber(wallRepair)} 秒修复1%城墙耐久`);
            notes.push(`约需要 ${getNiceNumber(carRepair)} 秒修复一辆勘探车`);
        }
        if (obj === buildings.BadlandsAttractor) {
            let influx = 5 * (1 + (obj.stateOnCount * 0.22));
            let gem_chance = game.global.stats.achieve.technophobe?.l >= 5 ? 9000 : 10000;
            if (game.global.race.universe === 'evil' && resources.Dark.currentQuantity > 1){
                let de = resources.Dark.currentQuantity * (1 + resources.Harmony.currentQuantity * 0.01);
                gem_chance -= Math.round(Math.log2(de) * 2);
            }
            for (let i = obj.stateOnCount; i > 0; i--){
                gem_chance = Math.round(gem_chance * 0.92);
            }
            gem_chance = Math.round(gem_chance * traitVal('ghostly', 2, '-'));
            let drop = (1 / gem_chance) * 100;
            notes.push(`约 ${getNiceNumber(drop)}% 概率在遭遇恶魔时获得${resources.Soul_Gem.title}（忽略保底）`);
            notes.push(`每日约刷新 ${getNiceNumber(influx*10)}-${getNiceNumber(influx*50)} 名恶魔`);
        }
        if (obj === buildings.Smokehouse) {
            let spoilage = 50 * (0.9 ** obj.count);
            notes.push(`每秒消耗 ${getNiceNumber(spoilage)}% 的${resources.Food.title}储量`);
        }

        if (obj.extraDescription) {
            notes.push(obj.extraDescription);
        }
        return notes.join("<br>");
    }

    function tooltipObserverCallback(mutations) {
        if (!settings.masterScriptToggle) {
            return;
        }
        mutations.forEach(mutation => mutation.addedNodes.forEach(node => {
            if (node.id === "popper") {
                let popperObserver = new MutationObserver((popperMutations) => {
                    // Add tooltips once again when popper cleared
                    if (!node.querySelector(".script-tooltip")) {
                        popperObserver.disconnect();
                        addTooltip(node);
                        popperObserver.observe(node, {childList: true});
                    }
                })
                addTooltip(node);
                popperObserver.observe(node, {childList: true});
            }
        }));
    }

    const infusionStep = {"blood-lust": 15, "blood-illuminate": 12, "blood-greed": 16, "blood-hoarder": 14, "blood-artisan": 8, "blood-attract": 4, "blood-wrath": 2};
    function addTooltip(node) {
        $(node).append(`<span class="script-tooltip" hidden></span>`);
        let dataId = node.dataset.id;
        // Tooltips for things with no script objects
        if (dataId === 'powerStatus') {
            $(node).append(`<p class="modal_bd"><span>Disabled</span><span class="has-text-danger">${getNiceNumber(resources.Power.maxQuantity)}</span></p>`);
            return;
        } else if (infusionStep[dataId]) {
            $(node).find('.costList .res-Blood_Stone').append(` (+${infusionStep[dataId]})`);
            return;
        }

        let match = null;
        let obj = null;
        if (match = dataId.match(/^popArpa([a-z_-]+)\d*$/)) { // "popArpa[id-with-no-tab][quantity]" for projects
            obj = arpaIds["arpa" + match[1]];
        } else if (match = dataId.match(/^q([A-Za-z_-]+)\d*$/)) { // "q[id][order]" for buildings in queue
            obj = buildingIds[match[1]] || arpaIds[match[1]];
        } else { // "[id]" for buildings and researches
            obj = buildingIds[dataId] || techIds[dataId];
        }
        if (!obj || (obj instanceof Technology && obj.isResearched())) {
            return;
        }

        // Flair, added before other descriptions
        if (obj === buildings.BlackholeStellarEngine && buildings.BlackholeMassEjector.count > 0 && game.global.interstellar.stellar_engine.exotic < 0.025) {
            let massPerSec = (resources.Elerium.atomicMass * game.global.interstellar.mass_ejector.Elerium + resources.Infernite.atomicMass * game.global.interstellar.mass_ejector.Infernite) || -1;
            let missingExotics = (0.025 - game.global.interstellar.stellar_engine.exotic) * 1e10;
            $(node).append(`<div id="popTimer" class="flair has-text-advanced">Contaminated in [${poly.timeFormat(missingExotics / massPerSec)}]</div>`);
        }

        let description = getTooltipInfo(obj);
        if (description) {
            $(node).append(`<div style="border-top: solid .0625rem #999">${description}</div>`);
        }
    }

    function updateOverrides() {
        let xorLists = {};
        let overrides = {};
        for (let key in settingsRaw.overrides) {
            let conditions = settingsRaw.overrides[key];
            for (let i = 0; i < conditions.length; i++) {
                let check = conditions[i];
                try {
                    let var1 = checkTypes[check.type1].fn(check.arg1);
                    let var2 = checkTypes[check.type2].fn(check.arg2);
                    if (!checkCompare[check.cmp](var1, var2)) {
                        continue;
                    }

                    if (typeof settingsRaw[key] === typeof check.ret) {
                        // Override single value
                        overrides[key] = check.ret;
                        break;
                    } else if (typeof settingsRaw[key] === "object") {
                        // Xor lists
                        xorLists[key] = xorLists[key] ?? [];
                        xorLists[key].push(check.ret);
                    } else {
                        throw `Expected type: ${typeof settingsRaw[key]}; Override type: ${typeof check.ret}`;
                    }
                } catch (error) {
                    let msg = `Condition ${i+1} for setting ${key} invalid! Fix or remove it. (${error})`;
                    if (!WindowManager.isOpen() && !game.global.lastMsg.all.find(log => log.m === msg)) { // Don't spam with errors
                        GameLog.logDanger("special", msg, ['events', 'major_events']);
                    }
                    continue; // Some argument not valid, skip condition
                }
            }
        }

        // Apply overrides
        Object.assign(settings, settingsRaw, overrides);

        // Xor lists
        for (let key in xorLists) {
            settings[key] = settingsRaw[key].slice();
            for (let item of xorLists[key]) {
                let index = settings[key].indexOf(item);
                if (index > -1) {
                    settings[key].splice(index, 1);
                } else {
                    settings[key].push(item);
                }
            }
        }
    }

    function automateAscension() {
        let createCustom = document.querySelector("#celestialLab .create button");
        if (createCustom && settings.prestigeType === "ascension" && settings.prestigeAscensionSkipCustom && settings.masterScriptToggle) {
            state.goal = "GameOverMan";
            createCustom.click();
            return;
        }
    }

    function automate() {
        if (state.goal === "GameOverMan" || state.forcedUpdate) {
            return;
        }
        if (state.scriptTick < Number.MAX_SAFE_INTEGER) {
            state.scriptTick++;
        } else {
            state.scriptTick = 1;
        }
        if (state.scriptTick % (settings.tickRate * (game.global.settings.at ? 2 : 1)) !== 0) {
            return;
        }

        updateScriptData(); // Sync exposed data with script variables
        updateOverrides();  // Apply settings overrides as soon as possible
        finalizeScriptData(); // Second part of updating data, applying settings

        updateState();
        updateUI();

        // The user has turned off the master toggle. Stop taking any actions on behalf of the player.
        // We've still updated the UI etc. above; just not performing any actions.
        if (!settings.masterScriptToggle) { return; }

        if (state.goal === "Evolution") {
            if (settings.autoEvolution) {
                autoEvolution();
            }
            return;
        }

        if (settings.buildingAlwaysClick || settings.autoBuild){
            autoGatherResources();
        }
        if (settings.autoMarket) {
            autoMarket(); // Invalidates values of resources, changes are random and can't be predicted, but we won't need values anywhere else
        }
        if (settings.autoHell) {
            autoHell();
        }
        if (settings.autoGalaxyMarket) {
            autoGalaxyMarket();
        }
        if (settings.autoFactory) {
            autoFactory();
        }
        if (settings.autoMiningDroid) {
            autoMiningDroid();
        }
        if (settings.autoGraphenePlant) {
            autoGraphenePlant();
        }
        if (settings.autoAlchemy) {
            autoAlchemy();
        }
        if (settings.autoPylon) {
            autoPylon();
        }
        if (settings.autoQuarry) {
            autoQuarry();
        }
        if (settings.autoSmelter) {
            autoSmelter();
        }
        if (settings.autoStorage) {
            // Called before autoJobs, autoFleet and autoPower - so they wont mess with quantum
            if (settings.storagePrioritizedOnly) {
                autoStorageBuildings();
            } else {
                autoStorage();
            }
        }
        if (!settings.autoTrigger || !autoTrigger()) {
            if (settings.autoResearch) {
                autoResearch(); // Called before autoBuild and autoAssembleGene - knowledge goes to techs first
            }
            if (settings.autoBuild || settings.autoARPA) {
                autoBuild(); // Called after autoStorage to compensate fluctuations of quantum(caused by previous tick's adjustments) levels before weightings
            }
        }
        if (settings.autoJobs) {
            autoJobs();
        }
        if (settings.autoFleet) {
            if (game.global.race['truepath']) {
                autoFleetOuter();
            } else {
                autoFleet(); // Need to know Mine Layers stateOnCount, called before autoPower while it's still valid
            }
        }
        if (settings.autoMech) {
            autoMech(); // Called after autoBuild, to prevent stealing supplies from mechs
        }
        if (settings.autoAssembleGene) {
            autoAssembleGene(); // Called after autoBuild and autoResearch to prevent stealing knowledge from them
        }
        if (settings.autoMinorTrait) {
            autoMinorTrait(); // Called after auto assemble to utilize new genes right asap
        }
        if (settings.autoCraft) {
            autoCraft(); // Invalidates quantities of craftables, missing exposed craftingRatio to calculate craft result on script side
        }
        if (settings.autoFight) {
            autoMerc();
            autoSpy(); // Can unoccupy foreign power in rare occasions, without caching back new status, but such desync should not cause any harm
            autoBattle(); // Invalidates garrison, and adds unaccounted amount of resources after attack
        }
        if (settings.autoTax) {
            autoTax();
        }
        if (settings.govManage) {
            manageGovernment();
        }
        if (settings.autoNanite) {
            autoConsume(NaniteManager); // Purge remaining rateOfChange, should be called when it won't be needed anymore
        }
        if (settings.autoSupply) {
            autoConsume(SupplyManager);
        }
        if (settings.autoEject) {
            autoConsume(EjectManager);
        }
        if (settings.autoPower) { // Called after purging of rateOfChange, to know useless resources
            autoPower();
        }
        if (settings.prestigeType !== "none") {
            autoPrestige(); // Called after autoBattle to not launch attacks right before reset, killing soldiers
        }
        if (settings.shifterGenus !== "ignore") {
            autoShapeshift(); // Shifting genus can remove techs, bildings, resoruces, etc. Leaving roken preloaded buttons behind. This thing need to be at the very end, to prevent clicking anything before redrawing tabs
        }

        state.soulGemLast = resources.Soul_Gem.currentQuantity;
    }

    function mainAutoEvolveScript() {
        // This is a hack to check that the entire page has actually loaded. The queueColumn is one of the last bits of the DOM
        // so if it is there then we are good to go. Otherwise, wait a little longer for the page to load.
        if (document.getElementById("queueColumn") === null) {
            setTimeout(mainAutoEvolveScript, 100);
            return;
        }

        // We'll need real window to access vue objects
        if (typeof unsafeWindow !== 'undefined') {
            win = unsafeWindow;
        } else {
            win = window;
        }
        game = win.evolve;

        // Check if game exposing anything
        if (!game) {
            if (state.warnDebug) {
                state.warnDebug = false;
                alert("You need to enable Debug Mode in settings for script to work");
            }
            setTimeout(mainAutoEvolveScript, 100);
            return;
        }

        // Wait until exposed data fully initialized ('p' in fastLoop, 'c' in midLoop)
        if (!game.global?.race || !game.breakdown.p.consume) {
            setTimeout(mainAutoEvolveScript, 100);
            return;
        }

        // Now we can check setting. Ensure game tabs are preloaded
        if (!game.global.settings.tabLoad) {
            if (state.warnPreload) {
                state.warnPreload = false;
                alert("You need to enable Preload Tab Content in settings for script to work");
            }
            setTimeout(mainAutoEvolveScript, 100);
            return;
        }


        if(!translateFinish)
        {
            //建筑翻译注入
            let theKeys = Object.keys(buildings)
            let difList = {
                "Proxima Dyson Sphere (Orichalcum)": "奥利哈刚戴森球",
                "Windmill (Evil)": "风车（邪恶种群）",
                "Sirius Ascension Machine (Complete)":"飞升装置（已完成）",
                "Shed":"仓库",
                "Alpha Warehouse":"半人马座α星系仓库",
                "Titan Habitat":evolve.actions.space.spc_titan.info.name() + "定居点",
                "Alpha Habitat":"半人马座α星系定居点",
                "Red Mine":evolve.actions.space.spc_red.info.name() + "行星矿井",
                "Titan Mine":evolve.actions.space.spc_titan.info.name() + "行星矿井",
                "Dwarf Mass Relay":"质量中继器",
                "Dwarf Mass Relay (Complete)":"质量中继器（已完成）",
                "Hell Space Casino":"太空赌场",
                "Red Spaceport":evolve.actions.space.spc_red.info.name() + "太空港",
                "Titan Spaceport":evolve.actions.space.spc_titan.info.name() + "太空港",
                "Red Horseshoe (Cataclysm)":"锻造马蹄铁（大灾变）",
                "Red Nanite Factory (Cataclysm)":"纳米机器人工厂（大灾变）",
                "Red Assembly (Cataclysm)":"装配工厂（大灾变）",
                "Alpha Graphene Plant":"半人马座α星系石墨烯厂",
                "Titan Graphene Plant":evolve.actions.space.spc_titan.info.name() + "石墨烯厂",
                "Titan Bank":evolve.actions.space.spc_titan.info.name() + "银行",
                "Titan AI Core (Complete)":"AI超级核心（已完成）",
                '':'',
                '':'',
                '':'',
                '':'',
                '':'',
                '':'',
                '':'',
                '':'',
                '':''
            }
            for(let i = 0; i < theKeys.length; i++)
            {
                let buildObj = buildings[theKeys[i]]
                let tempTitle
                let tempB1 = buildObj._tab
                let tempB2 = buildObj._id

                if(Object.keys(difList).includes(buildObj.name)){
                    buildObj.name = difList[buildObj.name];
                    continue;
                }

                if(typeof(evolve.actions[tempB1][tempB2])  == "undefined")
                {
                    let tempSubObList = Object.keys(evolve.actions[tempB1]);
                    for(let j = 0; j < tempSubObList.length; j++)
                    {
                        if(!(typeof(evolve.actions[tempB1][tempSubObList[j]][tempB2])  == "undefined"))
                        {
                            tempTitle = evolve.actions[tempB1][tempSubObList[j]][tempB2].title;
                            break;
                        }
                    }
                }
                else
                {
                    tempTitle = evolve.actions[tempB1][tempB2].title
                }
                buildObj.name = (typeof(tempTitle) == "function") ? tempTitle() : tempTitle
            }
            //资源翻译注入
            theKeys = Object.keys(resources)
            for(let i = 0; i < theKeys.length; i++)
            {
                switch(resources[theKeys[i]].constructor.name)
                {
                    case "Resource":
                        resources[theKeys[i]].name = game.global.resource[resources[theKeys[i]]._id].name
                        break;
                    case "SpecialResource":
                    case "Supply":
                        resources[theKeys[i]].name = game.loc("resource_"+resources[theKeys[i]]._id+"_name")
                        break;
                    case "Support":
                    case "BeltSupport":
                    case "ElectrolysisSupport":
                        break;
                    default:
                        //console.log(resources[theKeys[i]].constructor.name)
                        break;
                }
            }
            //arpa翻译注入
            theKeys = Object.keys(projects)
            for(let i = 0; i < theKeys.length; i++)
            {
                let tempObj = game.actions.arpa[projects[theKeys[i]]._id].title
                projects[theKeys[i]].name = (typeof(tempObj) == "function") ?  tempObj() : tempObj
            }
            translateFinish = true
        }
        // Make sure we have jQuery UI even if script was injected without *monkey
        if (!jQuery.ui) {
            let el = document.createElement("script");
            el.src = "https://code.jquery.com/ui/1.12.1/jquery-ui.min.js";
            el.onload = mainAutoEvolveScript;
            el.onerror = () => alert("Can't load jQuery UI. Check browser console for details.");
            document.body.appendChild(el);
            return;
        }

        // Wrappers for firefox, with code to bypass script sandbox. If we're not on firefox - don't use it, call real functions instead
        if (typeof unsafeWindow !== "object" || typeof cloneInto !== "function") {
            poly.adjustCosts = game.adjustCosts;
            poly.loc = game.loc;
            poly.messageQueue = game.messageQueue;
        }

        addScriptStyle();
        initialiseState();
        initialiseRaces();
        initialiseScript();
        updateOverrides();

        // Hook to game loop, to allow script run at full speed in unfocused tab
        const setCallback = (fn) => (typeof unsafeWindow !== "object" || typeof exportFunction !== "function") ? fn : exportFunction(fn, unsafeWindow);
        let craftCost = game.craftCost;
        Object.defineProperty(game, 'craftCost', {
            get: setCallback(() => craftCost),
            set: setCallback(v => {
                craftCost = v;
                automate();
            })
        });
        // Game disables workers after ascension, we need to check that outside of debug hook
        setInterval(automateAscension, 2500);
    }

    function updateDebugData() {
        state.forcedUpdate = true;
        game.updateDebugData();
        state.forcedUpdate = false;
    }

    function addScriptStyle() {
        let styles = `
            .script-lastcolumn:after { float: right; content: "\\21c5"; }
            .script-refresh:after { float: right; content: "\\1f5d8"; }
            .script-draggable { cursor: move; cursor: grab; }
            .script-draggable:active { cursor: grabbing !important; }
            .ui-sortable-helper { display: table; cursor: grabbing !important; }

            .script-collapsible {
                background-color: #444;
                color: white;
                cursor: pointer;
                padding: 18px;
                width: 100%;
                border: none;
                text-align: left;
                outline: none;
                font-size: 15px;
            }

            .script-contentactive, .script-collapsible:hover {
                background-color: #333;
            }

            .script-collapsible:after {
                content: '\\002B';
                color: white;
                font-weight: bold;
                float: right;
                margin-left: 5px;
            }

            .script-contentactive:after {
                content: "\\2212";
            }

            .script-content {
                padding: 0 18px;
                display: none;
                //max-height: 0;
                overflow: hidden;
                //transition: max-height 0.2s ease-out;
                //background-color: #f1f1f1;
            }

            .script-searchsettings {
                width: 100%;
                margin-top: 20px;
                margin-bottom: 10px;
            }

            /* Open script options button */
            .s-options-button {
                padding-right: 2px;
                cursor: pointer;
            }

            /* The Modal (background) */
            .script-modal {
              display: none; /* Hidden by default */
              position: fixed; /* Stay in place */
              z-index: 100; /* Sit on top */
              left: 0;
              top: 0;
              width: 100%; /* Full width */
              height: 100%; /* Full height */
              background-color: rgb(0,0,0); /* Fallback color */
              background-color: rgba(10,10,10,.86); /* Blackish w/ opacity */
              overflow-y: auto; /* Allow scrollbar */
            }

            /* Modal Content/Box */
            .script-modal-content {
                position: relative;
                background-color: #1f2424;
                margin: auto;
                margin-top: 50px;
                margin-bottom: 50px;
                //margin-left: 10%;
                //margin-right: 10%;
                padding: 0px;
                //width: 80%;
                width: 900px;
                //max-height: 90%;
                border-radius: .5rem;
                text-align: center;
            }

            /* The Close Button */
            .script-modal-close {
              float: right;
              font-size: 28px;
              margin-top: 20px;
              margin-right: 20px;
            }

            .script-modal-close:hover,
            .script-modal-close:focus {
              cursor: pointer;
            }

            /* Modal Header */
            .script-modal-header {
              padding: 4px 16px;
              margin-bottom: .5rem;
              border-bottom: #ccc solid .0625rem;
              text-align: center;
            }

            /* Modal Body */
            .script-modal-body {
                padding: 2px 16px;
                text-align: center;
                overflow: auto;
            }

            /* Autocomplete styles */
            .ui-autocomplete {
                background-color: #000;
                position: absolute;
                top: 0;
                left: 0;
                cursor: default;
                z-index: 10000 !important;
            }
            .ui-helper-hidden-accessible {
                border: 0;
                clip: rect(0 0 0 0);
                height: 1px;
                margin: -1px;
                overflow: hidden;
                padding: 0;
                position: absolute;
                width: 1px;
            }

            .selectable span {
                -moz-user-select: text !important;
                -khtml-user-select: text !important;
                -webkit-user-select: text !important;
                -ms-user-select: text !important;
                user-select: text !important;
            }

            .ea-craft-toggle {
                max-width:75px;
                margin-top:4px;
                float:right;
                left:50%;
            }

            /* Reduce message log clutterness */
            .main #msgQueueFilters span:not(:last-child) {
                !important; margin-right: 0.25rem;
            }

            /* Fixes for game styles */
            .main .resources .resource :first-child { white-space: nowrap; }
            #popTimer { margin-bottom: 0.1rem }
            .barracks { white-space: nowrap; }
            .area { width: calc(100% / 6) !important; max-width: 8rem; }
            .offer-item { width: 15% !important; max-width: 7.5rem; }
            .tradeTotal { margin-left: 11.5rem !important; }
        `

        // Create style document
        var css = document.createElement('style');
        css.type = 'text/css';
        css.appendChild(document.createTextNode(styles));

        // Append style to html head
        document.getElementsByTagName("head")[0].appendChild(css);
    }

    function removeScriptSettings() {
        $("#script_settings").remove();
    }

    function buildScriptSettings() {
        let currentScrollPosition = document.documentElement.scrollTop || document.body.scrollTop;

        let scriptContentNode = $('#script_settings');
        if (scriptContentNode.length !== 0) {
            return;
        }

        scriptContentNode = $('<div id="script_settings" style="margin-top: 30px;"></div>');
        $(".settings").append(scriptContentNode);

        buildImportExport();
        buildPrestigeSettings(scriptContentNode, "");
        buildGeneralSettings();
        buildGovernmentSettings(scriptContentNode, "");
        buildEvolutionSettings();
        buildPlanetSettings();
        buildMinorTraitSettings();
        buildTriggerSettings();
        buildResearchSettings();
        buildWarSettings(scriptContentNode, "");
        buildHellSettings(scriptContentNode, "");
        buildMechSettings();
        buildFleetSettings(scriptContentNode, "");
        buildEjectorSettings();
        buildMarketSettings();
        buildStorageSettings();
        buildMagicSettings();
        buildProductionSettings();
        buildJobSettings();
        buildBuildingSettings();
        buildWeightingSettings();
        buildProjectSettings();
        buildLoggingSettings(scriptContentNode, "");

        let collapsibles = document.getElementsByClassName("script-collapsible");
        for (let i = 0; i < collapsibles.length; i++) {
            collapsibles[i].addEventListener("click", function() {
                this.classList.toggle("script-contentactive");
                let content = this.nextElementSibling;
                if (content.style.display === "block") {
                    settingsRaw[collapsibles[i].id] = true;
                    content.style.display = "none";

                    let search = content.getElementsByClassName("script-searchsettings");
                    if (search.length > 0) {
                        search[0].value = "";
                        filterBuildingSettingsTable();
                    }
                } else {
                    settingsRaw[collapsibles[i].id] = false;
                    content.style.display = "block";
                    content.style.height = null;
                    content.style.height = content.offsetHeight + "px";
                }

                updateSettingsFromState();
            });
        }

        document.documentElement.scrollTop = document.body.scrollTop = currentScrollPosition;
    }

    function buildImportExport() {
        let importExportNode = $(".importExport").last();
        if (importExportNode === null) {
            return;
        }

        if (document.getElementById("script_settingsImport") !== null) {
            return;
        }

        importExportNode.append(' <button id="script_settingsImport" class="button">导入脚本设置</button>');

        $('#script_settingsImport').on("click", function() {
            if ($('#importExport').val().length > 0) {
                //let saveState = JSON.parse(LZString.decompressFromBase64($('#importExport').val()));
                let saveState = JSON.parse($('#importExport').val());
                if (saveState && typeof saveState === "object" && (saveState.scriptName === "TMVictor" || $.isEmptyObject(saveState))) {
                    let evals = [];
                    Object.values(saveState.overrides ?? []).forEach(list => list.forEach(override => {
                        if (override.type1 === "Eval") {
                            evals.push(override.arg1);
                        }
                        if (override.type2 === "Eval") {
                            evals.push(override.arg2);
                        }
                    }));
                    if (evals.length > 0 && !confirm("Warning! Imported settings includes evaluated code, which will have full access to browser page, and can be potentially dangerous.\nOnly continue if you trust the source. Injected code:\n" + evals.join("\n"))) {
                        return;
                    }
                    console.log("Importing script settings");
                    settingsRaw = saveState;
                    resetTriggerState();
                    updateStandAloneSettings();
                    updateStateFromSettings();
                    updateSettingsFromState();
                    removeScriptSettings();
                    removeMechInfo();
                    removeStorageToggles();
                    removeMarketToggles();
                    removeArpaToggles();
                    removeCraftToggles();
                    removeBuildingToggles();
                    removeEjectToggles();
                    removeSupplyToggles();
                    $('#autoScriptContainer').remove();
                    updateUI();
                    buildFilterRegExp();
                    $('#importExport').val("");
                }
            }
        });

        importExportNode.append(' <button id="script_settingsExport" class="button">导出脚本设置</button>');

        $('#script_settingsExport').on("click", function() {
            //$('#importExport').val(LZString.compressToBase64(JSON.stringify(global)));
            console.log("Exporting script settings");
            $('#importExport').val(JSON.stringify(settingsRaw));
            $('#importExport').select();
            document.execCommand('copy');
        });
    }

    function buildSettingsSection(sectionId, sectionName, resetFunction, updateSettingsContentFunction) {
        $("#script_settings").append(`
          <div id="script_${sectionId}Settings" style="margin-top: 10px;">
            <h3 id="${sectionId}SettingsCollapsed" class="script-collapsible text-center has-text-success">${sectionName}设置</h3>
            <div class="script-content">
              <div style="margin-top: 10px;"><button id="script_reset${sectionId}" class="button">${sectionName}设置还原</button></div>
              <div style="margin-top: 10px; margin-bottom: 10px;" id="script_${sectionId}Content"></div>
            </div>
          </div>`);

        updateSettingsContentFunction();

        if (!settingsRaw[sectionId + "SettingsCollapsed"]) {
            let element = document.getElementById(sectionId + "SettingsCollapsed");
            element.classList.toggle("script-contentactive");
            element.nextElementSibling.style.display = "block";
        }

        $("#script_reset" + sectionId).on("click", genericResetFunction.bind(null, resetFunction, sectionName));
    }

    function buildSettingsSection2(parentNode, secondaryPrefix, sectionId, sectionName, resetFunction, updateSettingsContentFunction) {
        if (secondaryPrefix !== "") {
            parentNode.append(`<div style="margin-top: 10px; margin-bottom: 10px;" id="script_${secondaryPrefix + sectionId}Content"></div>`);
        } else {
            parentNode.append(`
              <div id="script_${sectionId}Settings" style="margin-top: 10px;">
                <h3 id="${sectionId}SettingsCollapsed" class="script-collapsible text-center has-text-success">${sectionName}设置</h3>
                <div class="script-content">
                  <div style="margin-top: 10px;"><button id="script_reset${sectionId}" class="button">${sectionName}设置还原</button></div>
                  <div style="margin-top: 10px; margin-bottom: 10px;" id="script_${sectionId}Content"></div>
                </div>
              </div>`);

            if (!settingsRaw[sectionId + "SettingsCollapsed"]) {
                let element = document.getElementById(sectionId + "SettingsCollapsed");
                element.classList.toggle("script-contentactive");
                element.nextElementSibling.style.display = "block";
            }

            $("#script_reset" + sectionId).on("click", genericResetFunction.bind(null, resetFunction, sectionName));
        }

        updateSettingsContentFunction(secondaryPrefix);
    }

    function genericResetFunction(resetFunction, sectionName) {
        if (confirm("Are you sure you wish to reset " + sectionName + " Settings?")) {
            resetFunction();
        }
    }

    function addStandardHeading(node, heading) {
        node.append('<div style="margin-top: 5px; width: 600px;"><span class="has-text-danger" style="margin-left: 10px;">' + heading + '</span></div>');
    }

    function addSettingsHeader1(node, headerText) {
        node.append(`<div style="margin: 4px; width: 100%; display: inline-block; text-align: left;"><span class="has-text-success" style="font-weight: bold;">${headerText}</span></div>`);
    }

    function addSettingsHeader2(node, headerText) {
        node.append(`<div style="margin: 2px; width: 90%; display: inline-block; text-align: left;"><span class="has-text-caution">${headerText}</span></div>`);
    }

    const prestigeOptions = buildSelectOptions([
        {val: "none", label: "无", hint: "不会自动重置"},
        {val: "mad", label: "核弹重置", hint: "当研究相互毁灭，且士兵全部存活时，进行核弹重置"},
        {val: "bioseed", label: "播种重置", hint: "当太空探测器数量达到指定值以后，进行播种重置"},
        {val: "cataclysm", label: "大灾变重置", hint: "自动研究把刻度盘拨到11，触发大灾变重置"},
        {val: "whitehole", label: "黑洞重置", hint: "自动选择奇异灌输，触发黑洞重置"},
        {val: "vacuum", label: "真空坍缩", hint: "自动建造法力虹吸，触发真空坍缩"},
        {val: "apocalypse", label: "人工智能觉醒", hint: "自动研究《第66号技术协议》，触发人工智能觉醒"},
        {val: "ascension", label: "飞升重置", hint: "允许研究无形存在和飞升。飞升装置由自动供能进行管理。仍然需要玩家手动触发飞升并创建自建种族。"},
        {val: "demonic", label: "恶魔灌注", hint: "注入恶魔之力，牺牲整个文明，成为恶魔领主"}]);

    const checkCompare = {
        "==": (a, b) => a == b,
        "!=": (a, b) => a != b,
        ">": (a, b) => a > b,
        "<": (a, b) => a < b,
        ">=": (a, b) => a >= b,
        "<=": (a, b) => a <= b,
        "===": (a, b) => a === b,
        "!==": (a, b) => a !== b,
        "AND": (a, b) => a && b,
        "OR": (a, b) => a || b,
        "NOR": (a, b) => !(a || b),
        "NAND": (a, b) => !(a && b),
        "XOR": (a, b) => !a != !b,
        "XNOR": (a, b) => !a == !b,
        "AND!": (a, b) => a && !b,
        "OR!": (a, b) => a || !b,
    }

    const argType = {
        building: {def: "city-farm", arg: "list", options: {list: buildingIds, name: "name", id: "_vueBinding"}},
        research: {def: "tech-mad", arg: "list", options: {list: techIds, name: "name", id: "_vueBinding"}},

        trait: {def: "kindling_kindred", arg: "list_cb", options: () =>
          Object.fromEntries(Object.entries(evolve.traits).map(([id, trait]) => [id, {name: trait.name, id: id}]))},

        genus: {def: "humanoid", arg: "select_cb", options: () =>
          [{val: "organism", label: game.loc(`race_protoplasm`)},
           ...Object.values(game.races).map(r => r.type).filter((g, i, a) => g && g !== "organism" && a.indexOf(g) === i).map(g =>
          ({val: g, label: game.loc(`genelab_genus_${g}`)}))]},
        genus_ss: {def: "humanoid", arg: "select_cb", options: () =>
          [{val: "none", label: game.loc(`genelab_genus_none`)},
           ...Object.values(game.races).map(r => r.type).filter((g, i, a) => g && g !== "organism" && g !== "synthetic" && a.indexOf(g) === i).map(g =>
          ({val: g, label: game.loc(`genelab_genus_${g}`)}))]},
        project: {def: "arpalaunch_facility", arg: "select_cb", options: () => Object.values(arpaIds).map(p =>
          ({val: p._vueBinding, label: p.name}))},
        job: {def: "unemployed", arg: "select_cb", options: () => Object.values(jobIds).map(j =>
          ({val: j._originalId, label: j._originalName}))},
        resource: {def: "Food", arg: "select_cb", options: () => Object.values(resources).map(r =>
          ({val: r._id, label: r.name}))},
        race: {def: "species", arg: "select_cb", options: () =>
          [{val: "species", label: "当前种族", hint: "当前种族"},
           {val: "gods", label: "狂热信仰种族", hint: "狂热信仰的种族"},
           {val: "old_gods", label: "神化先祖种族", hint: "神化先祖的种族"},
           {val: "protoplasm", label: "原生质", hint: "还未选择种族"},
           ...Object.values(races).map(race =>
          ({val: race.id, label: race.name, hint: race.desc}))]},
        challenge: {def: "junker", arg: "select_cb", options: () => challenges.flat().map(c =>
          ({val: c.trait, label: game.loc(`evo_challenge_${c.id}`), hint: game.loc(`evo_challenge_${c.id}_effect`)}))},
        universe: {def: "standard", arg: "select_cb", options: () =>
          [{val: "bigbang", label: "大爆炸", hint: "还未选择宇宙"},
           ...universes.map(u =>
          ({val: u, label: game.loc(`universe_${u}`), hint: game.loc(`universe_${u}_desc`)}))]},
        government: {def: "anarchy", arg: "select_cb", options: () => Object.keys(GovernmentManager.Types).map(g =>
          ({val: g, label: game.loc(`govern_${g}`), hint: game.loc(`govern_${g}_desc`)}))},
        governor: {def: "none", arg: "select_cb", options: () =>
          [{val: "none", label: "无", hint: "还未选择总督"},
           ...governors.map(id =>
          ({val: id, label: game.loc(`governor_${id}`), hint: game.loc(`governor_${id}_desc`)}))]},
        queue: {def: "queue", arg: "select_cb", options: () =>
          [{val: "queue", label: "建筑", hint: "建筑队列"},
           {val: "r_queue", label: "研究", hint: "研究队列"},
           {val: "evo", label: "进化", hint: "进化队列"}]},
        date: {def: "day", arg: "select_cb", options: () =>
          [{val: "day", label: "天数(年)", hint: "一年中的第几天"},
           {val: "moon", label: "天数(月)", hint: "一月中的第几天"},
           {val: "total", label: "天数(总)", hint: "本轮游戏天数"},
           {val: "year", label: "年数", hint: "本轮游戏年数"},
           {val: "orbit", label: "公转天数", hint: "行星公转的天数"}]},
        soldiers: {def: "workers", arg: "select_cb", options: () =>
          [{val: "workers", label: "士兵总数"},
           {val: "max", label: "士兵总上限"},
           {val: "currentCityGarrison", label: "非地狱维度士兵数"},
           {val: "maxCityGarrison", label: "非地狱维度士兵上限"},
           {val: "hellSoldiers", label: "地狱维度士兵数"},
           {val: "hellGarrison", label: "地狱维度驻扎士兵"},
           {val: "hellPatrols", label: "地狱维度巡逻队数量"},
           {val: "hellPatrolSize", label: "地狱维度巡逻队规模"},
           {val: "wounded", label: "伤兵数"},
           {val: "deadSoldiers", label: "士兵阵亡数"},
           {val: "crew", label: "船员数"}]},
        tab: {def: "civTabs1", arg: "select_cb", options: () =>
          [{val: "civTabs0", label: game.loc('tab_evolve')},
           {val: "civTabs1", label: game.loc('tab_civil')},
           {val: "civTabs2", label: game.loc('tab_civics')},
           {val: "civTabs3", label: game.loc('tab_research')},
           {val: "civTabs4", label:  game.loc('tab_resources')},
           {val: "civTabs5", label:  game.loc('tech_arpa')},
           {val: "civTabs6", label:  game.loc('mTabStats')},
           {val: "civTabs7", label:  game.loc('tab_settings')}]},
        biome: {def: "grassland", arg: "select_cb", options: () => biomeList.map(b =>
          ({val: b, label: game.loc(`biome_${b}_name`)}))},
        ptrait: {def: "", arg: "select_cb", options: () =>
          [{val: "", label: "None", hint: "Planet have no trait"},
           ...traitList.slice(1).map(t =>
          ({val: t, label: game.loc(`planet_${t}`)}))]},
    }
    const argMap = {
        race: (r) => r === "species" || r === "gods" || r === "old_gods" ? game.global.race[r] : r,
    }
    // TODO: Make trigger use all this checks, migration will be a bit tedius, but doable
    const checkTypes = {
        String: { fn: (v) => v, arg: "string", def: "none", desc: "返回字符串的值", title:"字符串" },
        Number: { fn: (v) => v, arg: "number", def: 0, desc: "返回数值的值", title:"数值" },
        Boolean: { fn: (v) => v, arg: "boolean", def: false, desc: "返回布尔值的值", title:"布尔值" },
        SettingDefault: { fn: (s) => settingsRaw[s], arg: "string", def: "masterScriptToggle", desc: "返回默认设置的值，数值类型可变", title:"默认设置" },
        SettingCurrent: { fn: (s) => settings[s], arg: "string", def: "masterScriptToggle", desc: "返回当前设置的值，数值类型可变", title:"当前设置" },
        Eval: { fn: (s) => eval(s), arg: "string", def: "Math.PI", desc: "返回代码求值后的值", title:"求值" },
        BuildingUnlocked: { fn: (b) => buildingIds[b].isUnlocked(), ...argType.building, desc: "如果建筑已解锁，则返回真值", title:"建筑是否解锁" },
        BuildingClickable: { fn: (b) => buildingIds[b].isClickable(), ...argType.building, desc: "如果建筑满足所有建造条件并可以建造，则返回真值", title:"建筑是否可点击" },
        BuildingAffordable: { fn: (b) => buildingIds[b].isAffordable(true), ...argType.building, desc: "如果建筑足够资源建造，则返回真值", title:"建筑是否足够资源建造" },
        BuildingCount: { fn: (b) => buildingIds[b].count, ...argType.building, desc: "以数值形式返回建筑数量", title:"建筑数量" },
        BuildingEnabled: { fn: (b) => buildingIds[b].stateOnCount, ...argType.building, desc: "以数值形式返回建筑已供能的数量", title:"建筑启用数量" },
        BuildingDisabled: { fn: (b) => buildingIds[b].stateOffCount, ...argType.building, desc: "以数值形式返回建筑未供能的数量", title:"建筑停用数量" },
        ProjectUnlocked: { fn: (p) => arpaIds[p].isUnlocked(), ...argType.project, desc: "如果ARPA项目已解锁，则返回真值", title:"ARPA项目是否解锁" },
        ProjectCount: { fn: (p) => arpaIds[p].count, ...argType.project, desc: "以数值形式返回ARPA项目数量", title:"ARPA项目数量" },
        ProjectProgress: { fn: (p) => arpaIds[p].progress, ...argType.project, desc: "以数值形式返回ARPA项目的进度", title:"ARPA项目进度" },
        JobUnlocked: { fn: (j) => jobIds[j].isUnlocked(), ...argType.job, desc: "如果工作已解锁，则返回真值", title:"工作是否解锁" },
        JobCount: { fn: (j) => jobIds[j].count, ...argType.job, desc: "以数值形式返回已分配的工人数量", title:"工作数量" },
        JobMax: { fn: (j) => jobIds[j].max, ...argType.job, desc: "以数值形式返回可分配的工人上限数量", title:"工作上限" },
        ResearchUnlocked:  { fn: (r) => techIds[r].isUnlocked(), ...argType.research, desc: "如果研究已解锁，则返回真值", title:"研究是否解锁" },
        ResearchComplete:  { fn: (r) => techIds[r].isResearched(), ...argType.research, desc: "如果研究已完成，则返回真值", title:"研究是否完成" },
        ResourceUnlocked: { fn: (r) => resources[r].isUnlocked(), ...argType.resource, desc: "如果资源已解锁，则返回真值", title:"资源是否解锁" },
        ResourceQuantity: { fn: (r) => resources[r].currentQuantity, ...argType.resource, desc: "以数值形式返回当前资源或支持的数量", title:"资源数量" },
        ResourceStorage: { fn: (r) => resources[r].maxQuantity, ...argType.resource, desc: "以数值形式返回资源或支持上限的数量", title:"资源上限" },
        ResourceIncome: { fn: (r) => resources[r].rateOfChange, ...argType.resource, desc: "以数值形式返回当前资源收入或未使用的支持的数量", title:"资源收入" }, // rateOfChange holds full diff of resource at the moment when overrides checked
        ResourceRatio: { fn: (r) => resources[r].storageRatio, ...argType.resource, desc: "以数值形式返回当前资源与上限比值的数量。0.5意味着资源到达了储量上限的50%，以此类推。", title:"资源比例" },
        ResourceSatisfied: { fn: (r) => resources[r].usefulRatio >= 1, ...argType.resource, desc: "如果当前资源超过了最大花费，则返回真值。", title:"资源是否满足" },
        ResourceDemanded: { fn: (r) => resources[r].isDemanded(), ...argType.resource, desc: "如果资源目前需要，则返回真值。例如，当前队列或者触发器的消耗包含此项资源。", title:"资源是否需要" },
        RaceId: { fn: (r) => argMap.race(r), ...argType.race, desc: "以字符串形式返回所选择种族的类别", title:"种族类别" },
        RacePillared: { fn: (r) => game.global.pillars[argMap.race(r)] >= game.alevel(), ...argType.race, desc: "如果当前种族已经在当前成就等级下在永恒立柱上嵌入水晶，则返回真值", title:"种族是否已嵌水晶" },
        RaceGenus: { fn: (g) => races[game.global.race.species]?.genus === g, ...argType.genus, desc: "如果当前种群为所选择的种群，则返回真值", title:"当前种群" },
        MimicGenus: { fn: (g) => (game.global.race.ss_genus ?? 'none') === g, ...argType.genus_ss, desc: "如果拟态特质选择的种群为所选择的种群，则返回真值", title:"拟态种群" },
        TraitLevel: { fn: (t) => game.global.race[t] ?? 0, ...argType.trait, desc: "以数值形式返回特质的等级", title:"特质等级" },
        ResetType: { fn: (r) => settings.prestigeType === r, arg: "select", options: prestigeOptions, def: "mad", desc: "如果正在进行所选择的重置类型，则返回真值", title:"重置类型" },
        Challenge: { fn: (c) => game.global.race[c] ? true : false, ...argType.challenge, desc: "如果当前游戏激活了相应的挑战，则返回真值", title:"挑战" },
        Universe: { fn: (u) => game.global.race.universe === u, ...argType.universe, desc: "如果当前宇宙为所选择的宇宙，则返回真值", title:"宇宙" },
        Government: { fn: (g) => game.global.civic.govern.type === g, ...argType.government, desc: "如果当前社会体制为所选择的社会体制，则返回真值", title:"社会体制" },
        Governor: { fn: (g) => getGovernor() === g, ...argType.governor, desc: "如果当前游戏激活了相应的总督，则返回真值", title:"总督" },
        Queue: { fn: (q) => q === "evo" ? settingsRaw.evolutionQueue.length : game.global[q].queue.length, ...argType.queue, desc: "以数值形式返回队列中内容的数量", title:"队列" },
        Date: { fn: (d) => d === "total" ? game.global.stats.days : game.global.city.calendar[d], ...argType.date, desc: "以数值形式返回游戏中天数的数量", title:"天数" },
        Soldiers: { fn: (s) => WarManager[s], ...argType.soldiers, desc: "以数值形式返回士兵的数量", title:"士兵数" },
        PlanetBiome: { fn: (b) => game.global.city.biome === b, ...argType.biome, desc: "如果当前行星的生物群系为所选择的生物群系，则返回真值", title:"行星生物群系" },
        PlanetTrait: { fn: (t) => game.global.city.ptrait === t, ...argType.ptrait, desc: "如果当前行星的星球特性为所选择的星球特性，则返回真值", title:"行星星球特性" },
    }

    function openOverrideModal(event) {
        if (event.ctrlKey) {
            event.preventDefault();
            openOptionsModal(event.data.label, function(modal) {
                modal.append(`<div style="margin-top: 10px; margin-bottom: 10px;" id="script_${event.data.name}Modal"></div>`);
                buildOverrideSettings(event.data.name, event.data.type, event.data.options);
            });
        }
    }

    function buildOverrideSettings(settingName, type, options) {
        const rebuild = () => buildOverrideSettings(settingName, type, options);
        let overrides = settingsRaw.overrides[settingName] ?? [];

        let currentNode = $(`#script_${settingName}Modal`);
        currentNode.empty().off("*");

        currentNode.append(`
          <table style="width:100%; text-align: left">
            <tr>
              <th class="has-text-warning" colspan="2">变量1</th>
              <th class="has-text-warning" colspan="1">运算</th>
              <th class="has-text-warning" colspan="2">变量2</th>
              <th class="has-text-warning" colspan="3">结果</th>
            </tr>
            <tr>
              <th class="has-text-warning" style="width:17%">类型</th>
              <th class="has-text-warning" style="width:16%">值</th>
              <th class="has-text-warning" style="width:10%"></th>
              <th class="has-text-warning" style="width:17%">类型</th>
              <th class="has-text-warning" style="width:16%">值</th>
              <th class="has-text-warning" style="width:15%"></th>
              <th style="width:9%"></th>
            </tr>
            <tbody id="script_${settingName}ModalTable"></tbody>
          </table>`);

        let note = typeof settingsRaw[settingName] === "object" ?
          "所有满足条件的数值将添加入列表，或者从列表中移除":
          "从上往下，首个条件满足时，将使用相应数值。默认值为：";

        let newTableBodyText = "";
        for (let i = 0; i < overrides.length; i++) {
            newTableBodyText += `<tr id="script_${settingName}_o${i}" value="${i}" class="script-draggable"><td style="width:17%"></td><td style="width:16%"></td><td style="width:10%"></td><td style="width:17%"></td><td style="width:16%"></td><td style="width:15%"></td><td style="width:9%"><span class="script-lastcolumn"></span></td></tr>`;
        }
        newTableBodyText += `
          <tr id="script_${settingName}_d" class="unsortable">
            <td style="width:76%" colspan="5">${note}</td>
            <td style="width:15%"></td>
            <td style="width:9%"><a class="button is-dark is-small"><span>+</span></a></td>
          </tr>`;
        let tableBodyNode = $(`#script_${settingName}ModalTable`);
        tableBodyNode.append($(newTableBodyText));

        // Default input
        if (typeof settingsRaw[settingName] !== "object") {
            $(`#script_${settingName}_d td:eq(1)`)
              .append(buildInputNode(type, options, settingsRaw[settingName], function(result) {
                  settingsRaw[settingName] = result;
                  updateSettingsFromState();

                  let retType = typeof result === "boolean" ? "checked" : "value";
                  $(".script_" + settingName).prop(retType, settingsRaw[settingName]);
              }));
        }

        // Add button
        $(`#script_${settingName}_d a`).on('click', function() {
            if (!settingsRaw.overrides[settingName]) {
                settingsRaw.overrides[settingName] = [];
                $(".script_bg_" + settingName).addClass("inactive-row");
            }
            settingsRaw.overrides[settingName].push({type1: "Boolean", arg1: true, type2: "Boolean", arg2: false, cmp: "==", ret: settingsRaw[settingName]})
            updateSettingsFromState();
            rebuild();
        });

        for (let i = 0; i < overrides.length; i++) {
            let override = overrides[i];
            let tableElement = $(`#script_${settingName}_o${i}`).children().eq(0);

            tableElement.append(buildConditionType(override, 1, rebuild));
            tableElement = tableElement.next();
            tableElement.append(buildConditionArg(override, 1));
            tableElement = tableElement.next();
            tableElement.append(buildConditionComparator(override));
            tableElement = tableElement.next();
            tableElement.append(buildConditionType(override, 2, rebuild));
            tableElement = tableElement.next();
            tableElement.append(buildConditionArg(override, 2));
            tableElement = tableElement.next();
            tableElement.append(buildConditionRet(override, type, options));
            tableElement = tableElement.next();
            tableElement.append(buildConditionRemove(settingName, i, rebuild));
        }

        tableBodyNode.sortable({
            items: "tr:not(.unsortable)",
            helper: sorterHelper,
            update: function() {
                let newOrder = tableBodyNode.sortable('toArray', {attribute: 'value'});
                settingsRaw.overrides[settingName] = newOrder.map((i) => settingsRaw.overrides[settingName][i]);

                updateSettingsFromState();
                rebuild();
            },
        });
    }

    function buildInputNode(type, options, value, callback) {
        switch (type) {
            case "string":
                return $(`
                  <input type="text" class="input is-small" style="height: 22px; width:100%"/>`)
                .val(value).on('change', function() {
                    callback(this.value);
                });
            case "number":
                return $(`
                  <input type="text" class="input is-small" style="height: 22px; width:100%"/>`)
                .val(value).on('change', function() {
                    let parsedValue = getRealNumber(this.value);
                    if (isNaN(parsedValue)) {
                        parsedValue = value;
                    }
                    this.value = parsedValue;
                    callback(parsedValue);
                })
            case "boolean":
                return $(`
                  <label tabindex="0" class="switch" style="position:absolute; margin-top: 8px; margin-left: 10px;">
                    <input type="checkbox">
                    <span class="check" style="height:5px; max-width:15px"></span><span style="margin-left: 20px;"></span>
                  </label>`)
                .find('input').prop('checked', value).on('change', function() {
                    callback(this.checked);
                })
                .end();
            case "select":
                return $(`
                  <select style="width: 100%">${options}</select>`)
                .val(value).on('change', function() {
                    callback(this.value);
                });
            case "select_cb":
                return $(`
                  <select style="width: 100%">${buildSelectOptions(options())}</select>`)
                .val(value).on('change', function() {
                    callback(this.value);
                });
            case "list":
                return buildObjectListInput(options.list, options.name, options.id, value, callback);
            case "list_cb":
                return buildObjectListInput(options(), "name", "id", value, callback);
            default:
                return "";
        }
    }

    function buildConditionType(override, num, rebuild) {
        let types = Object.entries(checkTypes).map(([id, type]) => `<option value="${id}" title="${type.desc}">${type.title}</option>`).join();
        return $(`<select style="width: 100%">${types}</select>`)
        .val(override["type" + num])
        .on('change', function() {
            override["type" + num] = this.value;
            override["arg" + num] = checkTypes[this.value].def;
            updateSettingsFromState();
            rebuild();
        });
    }

    function buildConditionArg(override, num) {
        let check = checkTypes[override["type" + num]];
        return check ? buildInputNode(check.arg, check.options, override["arg" + num], function(result){
            override["arg" + num] = result;
            updateSettingsFromState();
        }) : "";
    }

    function buildConditionComparator(override) {
        let translateCondition = {"AND":"与", "OR":"或", "NOR":"或非", "NAND":"与非", "XOR":"异或", "XNOR":"同或", "AND!":"与(变量2取非)", "OR!":"或(变量2取非)"}; let types = Object.entries(checkCompare).map(([id, fn]) => `<option value="${id}" title="${fn.toString().substr(10)}">${typeof(translateCondition[id])!="undefined"?translateCondition[id]:id}</option>`).join();
        return $(`<select style="width: 100%">${types}</select>`)
        .val(override.cmp)
        .on('change', function() {
            override.cmp = this.value;
            updateSettingsFromState();
        });
    }

    function buildConditionRemove(settingName, id, rebuild) {
        return $(`<a class="button is-dark is-small"><span>-</span></a>`)
        .on('click', function() {
            settingsRaw.overrides[settingName].splice(id, 1);
            if (settingsRaw.overrides[settingName].length === 0) {
                delete settingsRaw.overrides[settingName];
                $(".script_bg_" + settingName).removeClass("inactive-row");
            }
            updateSettingsFromState();
            rebuild();
        });
    }

    function buildConditionRet(override, type, options) {
        return buildInputNode(type, options, override.ret, function(result) {
            override.ret = result;
            updateSettingsFromState();
        });
    }

    function buildObjectListInput(list, name, id, value, callback) {
        let listNode = $(`<input type="text" style="width:100%"></input>`);

        // Event handler
        let onChange = function(event, ui) {
            event.preventDefault();

            // If it wasn't selected from list
            if(ui.item === null){
                let foundItem = Object.values(list).find(obj => obj[name] === this.value);
                if (foundItem !== undefined){
                    ui.item = {label: this.value, value: foundItem[id]};
                }
            }

            if (ui.item !== null && Object.values(list).some(obj => obj[id] === ui.item.value)) {
                // We have an item to switch
                this.value = ui.item.label;
                callback(ui.item.value);
            } else if (list.hasOwnProperty(value)) {
                // Or try to restore old valid value
                this.value = list[value][name];
                callback(value);
            } else {
                // No luck, set it empty
                this.value = "";
                callback(null);
            }
        };

        listNode.autocomplete({
            minLength: 2,
            delay: 0,
            source: function(request, response) {
                let matcher = new RegExp($.ui.autocomplete.escapeRegex(request.term), "i");
                response(Object.values(list)
                  .filter(item => matcher.test(item[name]))
                  .map(item => ({label: item[name], value: item[id]})));
            },
            select: onChange, // Dropdown list click
            focus: onChange, // Arrow keys press
            change: onChange // Keyboard type
        });

        if (Object.values(list).some(obj => obj[id] === value)) {
            listNode.val(list[value][name]);
        }

        return listNode;
    }

    function addSettingsToggle(node, settingName, labelText, hintText) {
        return $(`
          <div class="script_bg_${settingName}" style="margin-top: 5px; width: 90%; display: inline-block; text-align: left;">
            <label title="${hintText}" tabindex="0" class="switch">
              <input class="script_${settingName}" type="checkbox" ${settingsRaw[settingName] ? " checked" : ""}><span class="check"></span>
              <span style="margin-left: 10px;">${labelText}</span>
            </label>
          </div>`)
        .toggleClass('inactive-row', Boolean(settingsRaw.overrides[settingName]))
        .on('change', 'input', function() {
            settingsRaw[settingName] = this.checked;
            updateSettingsFromState();

            $(".script_" + settingName).prop('checked', settingsRaw[settingName]);
        })
        .on('click', {label: `${labelText} (${settingName})`, name: settingName, type: "boolean"}, openOverrideModal)
        .appendTo(node);
    }

    function addSettingsNumber(node, settingName, labelText, hintText) {
        return $(`
          <div class="script_bg_${settingName}" style="margin-top: 5px; display: inline-block; width: 90%; text-align: left;">
            <label title="${hintText}" tabindex="0">
              <span>${labelText}</span>
              <input class="script_${settingName}" type="text" style="text-align: right; height: 18px; width: 150px; float: right;" value="${settingsRaw[settingName]}"></input>
            </label>
          </div>`)
        .toggleClass('inactive-row', Boolean(settingsRaw.overrides[settingName]))
        .on('change', 'input', function() {
            let parsedValue = getRealNumber(this.value);
            if (!isNaN(parsedValue)) {
                settingsRaw[settingName] = parsedValue;
                updateSettingsFromState();
            }
            $(".script_" + settingName).val(settingsRaw[settingName]);
        })
        .on('click', {label: `${labelText} (${settingName})`, name: settingName, type: "number"}, openOverrideModal)
        .appendTo(node);
    }

    function buildSelectOptions(optionsList) {
        return optionsList.map(item => `<option value="${item.val}" title="${item.hint ?? ""}">${item.label}</option>`).join();
    }

    function addSettingsSelect(node, settingName, labelText, hintText, optionsList) {
        let options = buildSelectOptions(optionsList);
        return $(`
          <div class="script_bg_${settingName}" style="margin-top: 5px; display: inline-block; width: 90%; text-align: left;">
            <label title="${hintText}" tabindex="0">
              <span>${labelText}</span>
              <select class="script_${settingName}" style="width: 150px; float: right;">
                ${options}
              </select>
            </label>
          </div>`)
        .toggleClass('inactive-row', Boolean(settingsRaw.overrides[settingName]))
        .find('select')
          .val(settingsRaw[settingName])
          .on('change', function() {
            settingsRaw[settingName] = this.value;
            updateSettingsFromState();

            $(".script_" + settingName).val(settingsRaw[settingName]);
          })
        .end()
        .on('click', {label: `${labelText} (${settingName})`, name: settingName, type: "select", options: options}, openOverrideModal)
        .appendTo(node);
    }

    function addSettingsList(node, settingName, labelText, hintText, list) {
        let listBlock = $(`
          <div class="script_bg_${settingName}" style="display: inline-block; width: 90%; margin-top: 6px;">
            <label title="${hintText}" tabindex="0">
              <span>${labelText}</span>
              <input type="text" style="height: 25px; width: 150px; float: right;" placeholder="研究……">
              <button class="button" style="height: 25px; float: right; margin-right: 4px; margin-left: 4px;">移除</button>
              <button class="button" style="height: 25px; float: right;">增加</button>
            </label>
            <br>
            <textarea class="script_${settingName} textarea" style="margin-top: 12px" readonly></textarea>
          </div>`)
        .toggleClass('inactive-row', Boolean(settingsRaw.overrides[settingName]))
        .on('click', {label: `Add or Remove (${settingName})`, name: settingName, type: "list", options: {list: list, name: "name", id: "_vueBinding"}}, openOverrideModal)
        .appendTo(node);

        let selectedItem = "";

        let updateList = function() {
            let techsString = settingsRaw[settingName].map(id => Object.values(list).find(obj => obj._vueBinding === id).name).join(', ');
            $(".script_" + settingName).val(techsString);
        }

        let onChange = function(event, ui) {
            event.preventDefault();

            // If it wasn't selected from list
            if(ui.item === null){
                let typedName = Object.values(list).find(obj => obj.name === this.value);
                if (typedName !== undefined){
                    ui.item = {label: this.value, value: typedName._vueBinding};
                }
            }

            // We have an item to switch
            if (ui.item !== null && list.hasOwnProperty(ui.item.value)) {
                this.value = ui.item.label;
                selectedItem = ui.item.value;
            } else {
                this.value = "";
                selectedItem = null;
            }
        };

        listBlock.find('input').autocomplete({
            minLength: 2,
            delay: 0,
            source: function(request, response) {
                let matcher = new RegExp($.ui.autocomplete.escapeRegex(request.term), "i");
                response(Object.values(list)
                  .filter(item => matcher.test(item.name))
                  .map(item => ({label: item.name, value: item._vueBinding})));
            },
            select: onChange, // Dropdown list click
            focus: onChange, // Arrow keys press
            change: onChange // Keyboard type
        });

        listBlock.on('click', 'button:eq(1)', function() {
            if (selectedItem && !settingsRaw[settingName].includes(selectedItem)) {
                settingsRaw[settingName].push(selectedItem);
                settingsRaw[settingName].sort();
                updateSettingsFromState();
                updateList();
            }
        });

        listBlock.on('click', 'button:eq(0)', function() {
            if (selectedItem && settingsRaw[settingName].includes(selectedItem)) {
                settingsRaw[settingName].splice(settingsRaw[settingName].indexOf(selectedItem), 1);
                settingsRaw[settingName].sort();
                updateSettingsFromState();
                updateList();
            }
        });

        updateList();
    }

    function addInputCallbacks(node, settingKey) {
        return node
        .on('change', function() {
            let parsedValue = getRealNumber(this.value);
            if (!isNaN(parsedValue)) {
                settingsRaw[settingKey] = parsedValue;
                updateSettingsFromState();
            }
            $(".script_" + settingKey).val(settingsRaw[settingKey]);
        })
        .on('click', {label: `Number (${settingKey})`, name: settingKey, type: "number"}, openOverrideModal);
    }

    function addTableInput(node, settingKey) {
        node.addClass("script_bg_" + settingKey + (settingsRaw.overrides[settingKey] ? " inactive-row" : ""))
            .append(addInputCallbacks($(`<input class="script_${settingKey}" type="text" class="input is-small" style="height: 25px; width:100%" value="${settingsRaw[settingKey]}"/>`), settingKey));
    }

    function addToggleCallbacks(node, settingKey) {
        return node
        .on('change', 'input', function() {
            settingsRaw[settingKey] = this.checked;
            updateSettingsFromState();

            $(".script_" + settingKey).prop('checked', settingsRaw[settingKey]);
        })
        .on('click', {label: `Toggle (${settingKey})`, name: settingKey, type: "boolean"}, openOverrideModal);
    }

    function addTableToggle(node, settingKey) {
        node.addClass("script_bg_" + settingKey + (settingsRaw.overrides[settingKey] ? " inactive-row" : ""))
            .append(addToggleCallbacks($(`
          <label tabindex="0" class="switch" style="position:absolute; margin-top: 8px; margin-left: 10px;">
            <input class="script_${settingKey}" type="checkbox"${settingsRaw[settingKey] ? " checked" : ""}>
            <span class="check" style="height:5px; max-width:15px"></span>
            <span style="margin-left: 20px;"></span>
          </label>`), settingKey));
    }

    function buildTableLabel(note, title = "", color = "has-text-info") {
        return $(`<span class="${color}" title="${title}" >${note}</span>`);
    }

    function resetCheckbox() {
        Array.from(arguments).forEach(item => $(".script_" + item).prop('checked', settingsRaw[item]));
    }

    function buildGeneralSettings() {
        let sectionId = "general";
        let sectionName = "常规";

        let resetFunction = function() {
            resetGeneralSettings(true);
            updateSettingsFromState();
            updateGeneralSettingsContent();

            resetCheckbox("masterScriptToggle", "showSettings", "autoAssembleGene");
            // No need to call showSettings callback, it enabled if button was pressed, and will be still enabled on default settings
        };

        buildSettingsSection(sectionId, sectionName, resetFunction, updateGeneralSettingsContent);
    }

    function updateGeneralSettingsContent() {
        let currentScrollPosition = document.documentElement.scrollTop || document.body.scrollTop;

        let currentNode = $('#script_generalContent');
        currentNode.empty().off("*");

        addSettingsNumber(currentNode, "tickRate", "脚本运算频率", "每达到相应时刻后脚本就进行一次运算。游戏每250毫秒达到一个时刻，因此设为4以后脚本将每秒运算一次。您可以将此值调低以使脚本更快运行，也可以将此值调高来避免卡顿。时刻数值需要为正整数。");

        addSettingsHeader1(currentNode, "优先级");
        let priority = [{val: "ignore", label: "忽略", hint: "什么都不做"},
                        {val: "save", label: "保留", hint: "缺失的资源保留下来不使用。"},
                        {val: "req", label: "请求", hint: "优先生产和购买缺失的资源。"},
                        {val: "savereq", label: "保留及请求", hint: "优先生产和购买缺失的资源，并保留它们不使用。"}];

        addSettingsToggle(currentNode, "useDemanded", "允许使用优先生产和购买的资源进行锻造和生产", "如果关闭此项，则脚本不会使用优先的资源来制造锻造物和工厂产品。");
        addSettingsToggle(currentNode, "researchRequest", "资源是否优先分配给相互毁灭前的研究", "将贸易路线和生产资源调整为已解锁且上限足够的研究所需要的资源。只在触发器和队列中没有内容激活时生效。缺少的资源对于自动贸易、自动银河贸易、自动工厂和自动采矿机器人来说权重为100，对于自动税率、自动锻造、自动温石棉控制、自动冶炼来说为最高优先级。");
        addSettingsToggle(currentNode, "researchRequestSpace", "资源是否优先分配给太空后的研究", "将贸易路线和生产资源调整为已解锁且上限足够的研究所需要的资源。只在触发器和队列中没有内容激活时生效。缺少的资源对于自动贸易、自动银河贸易、自动工厂和自动采矿机器人来说权重为100，对于自动税率、自动锻造、自动温石棉控制、自动冶炼来说为最高优先级。");
        addSettingsToggle(currentNode, "missionRequest", "资源是否优先分配给任务", "将贸易路线和生产资源调整为已解锁且上限足够的任务所需要的资源。缺少的资源对于自动贸易、自动银河贸易、自动工厂和自动采矿机器人来说权重为100，对于自动税率、自动锻造、自动温石棉控制、自动冶炼来说为最高优先级。");

        addSettingsSelect(currentNode, "prioritizeQueue", "队列", "调整脚本处理队列中项目的方式，优先缺失的资源。", priority);
        addSettingsSelect(currentNode, "prioritizeTriggers", "触发器", "调整脚本处理触发器中项目的方式，优先缺失的资源。", priority);
        addSettingsSelect(currentNode, "prioritizeUnify", "统一", "调整脚本处理统一的方式，优先使用资金来收购周边国家。", priority);
        addSettingsSelect(currentNode, "prioritizeOuterFleet", "外域船坞(智械黎明模式)", "调整脚本分配舰队建筑的方式，优先舰船缺失的资源。", priority);

        addSettingsHeader1(currentNode, "自动点击");
        addSettingsToggle(currentNode, "buildingAlwaysClick", "是否总是自动收集资源", "默认情况下脚本只在游戏初期自动收集资源，开启此项后将一直自动收集资源");
        addSettingsNumber(currentNode, "buildingClickPerTick", "每时刻最高点击次数", "每时刻自动收集资源的点击次数。只在库存未满的范围内有效。");

        document.documentElement.scrollTop = document.body.scrollTop = currentScrollPosition;
    }

    function buildPrestigeSettings(parentNode, secondaryPrefix) {
        let sectionId = "prestige";
        let sectionName = "威望重置";

        let resetFunction = function() {
            resetPrestigeSettings(true);
            updateSettingsFromState();
            updatePrestigeSettingsContent(secondaryPrefix);
        };

        buildSettingsSection2(parentNode, secondaryPrefix, sectionId, sectionName, resetFunction, updatePrestigeSettingsContent);
    }

    function updatePrestigeSettingsContent(secondaryPrefix) {
        let currentScrollPosition = document.documentElement.scrollTop || document.body.scrollTop;

        let currentNode = $(`#script_${secondaryPrefix}prestigeContent`);
        currentNode.empty().off("*");

        currentNode.append(`
          <div style="display: inline-block; width: 90%; text-align: left; margin-bottom: 10px;">
            <label>
              <span>威望重置类型：</span>
              <select class="script_prestigeType" style="height: 18px; width: 150px; float: right;">
                ${prestigeOptions}
              </select>
            </label>
          </div>`);

        currentNode.find('.script_prestigeType')
          .val(settingsRaw.prestigeType)
          .on('change', function() {
            // Special processing for prestige options. If they are ready to prestige then warn the user about enabling them.
            let confirmationText = "";
            if (this.value === "mad" && haveTech("mad")) {
                confirmationText = "相互毁灭已研究。选择此项后可能会立刻进行核爆重置。您确定要这么做吗？";
            } else if (this.value === "bioseed" && isBioseederPrestigeAvailable()) {
                confirmationText = "生命播种飞船已经就绪，选择此项后可能会立刻进行播种重置。您确定要这么做吗？";
            } else if (this.value === "cataclysm" && isCataclysmPrestigeAvailable()) {
                confirmationText = "把刻度盘拨到11已经就绪，选择此项后可能会立刻进行大灾变重置。您确定要这么做吗？";
            } else if (this.value === "whitehole" && isWhiteholePrestigeAvailable()) {
                confirmationText = "奇异灌输已经可以研究了，选择此项后可能会立刻进行黑洞重置。您确定要这么做吗？";
            } else if (this.value === "apocalypse" && isApocalypsePrestigeAvailable()) {
                confirmationText = "《第66号技术协议》已经可以研究了，选择此项后可能会立刻进行人工智能觉醒。您确定要这么做吗？";
            } else if (this.value === "ascension" && isAscensionPrestigeAvailable()) {
                confirmationText = "飞升装置已经建造并供能，不会对自建种族进行任何操作。选择此项后可能会立刻进行飞升重置。您确定要这么做吗？";
            } else if (this.value === "demonic" && isDemonicPrestigeAvailable()) {
                confirmationText = "已经到达了设定的楼层，且已击杀恶魔领主，选择此项后可能会立刻进行恶魔灌注。您确定要这么做吗？";
            }
            if (confirmationText !== "" && !confirm(confirmationText)) {
                this.value = "none";
            }
            settingsRaw.prestigeType = this.value;
            $(".script_prestigeType").val(settingsRaw.prestigeType);

            state.goal = "Standard";
            updateSettingsFromState();
        })
        .on('click', {label: "Prestige Type (prestigeType)", name: "prestigeType", type: "select", options: prestigeOptions}, openOverrideModal);

        addSettingsToggle(currentNode, "prestigeWaitAT", "是否在重置前用完所有的加速时间", "直到用完所有的加速时间才进行重置");
        addSettingsToggle(currentNode, "prestigeBioseedConstruct", "忽略无用的建筑", "只在需要进行播种重置时建造星际船坞、生命播种飞船和星际探测器，并且不建造世界超级对撞机。进行黑洞重置时不建造跃迁飞船。进行真空坍缩时不建造恒星引擎。");
        addSettingsNumber(currentNode, "prestigeEnabledBarracks", "研究统一后的兵营比例", "研究统一后进行供能的兵营比例，取消供能可以提升士气。当生命播种飞船达到90段分项工程，或者是建造世界超级对撞机后，所有兵营将全部恢复供能。");

        // MAD
        addSettingsHeader1(currentNode, "核弹重置");
        addSettingsToggle(currentNode, "prestigeMADIgnoreArpa", "特定时期之前不建造ARPA项目", "研究相互毁灭或竞争国家出现之前，不建造ARPA项目");
        addSettingsToggle(currentNode, "prestigeMADWait", "是否等待人口达到最大", "等待市民和士兵达到最大以后再进行重置，以尽可能多地获得质粒");
        addSettingsNumber(currentNode, "prestigeMADPopulation", "人口阈值", "达到相应数量的市民和士兵后，才进行核弹重置");

        // Bioseed
        addSettingsHeader1(currentNode, "播种重置");
        addSettingsNumber(currentNode, "prestigeBioseedProbes", "播种前至少需要的太空探测器数量", "达到太空探测器所需数量后，才进行播种重置");

        // Whitehole
        addSettingsHeader1(currentNode, "黑洞重置");
        addSettingsToggle(currentNode, "prestigeWhiteholeSaveGems", "是否保留重置所需数量的灵魂宝石", "保留重置所需数量的灵魂宝石，只使用超过相应数量的灵魂宝石。不影响触发器。");
        addSettingsNumber(currentNode, "prestigeWhiteholeMinMass", "太阳质量阈值，达到后才会进行黑洞重置", "达到太阳质量阈值后，才进行黑洞重置。脚本不会在威望重置类型为黑洞重置时稳定黑洞，需要自然达到此质量");

        // Ascension
        addSettingsHeader1(currentNode, "飞升重置");
        addSettingsToggle(currentNode, "prestigeAscensionSkipCustom", "是否忽略自建种族", "不对自建种族进行任何修改就进行重置。只有开启此项才能自动进行飞升重置。");
        addSettingsToggle(currentNode, "prestigeAscensionPillar", "是否等待永恒之柱", "直到永恒之柱上嵌入水晶后才进行重置");

        // Demonic Infusion
        addSettingsHeader1(currentNode, "恶魔灌注");
        addSettingsNumber(currentNode, "prestigeDemonicFloor", "进行恶魔灌注的层数阈值", "到达相应层数后才进行恶魔灌注");
        addSettingsNumber(currentNode, "prestigeDemonicPotential", "进行恶魔灌注的最大机甲潜力", "只在当前机甲潜力低于相应数值后才进行恶魔灌注。机甲舱充满最好设计的机甲时潜力为1。这样就可以在机甲战斗力还较高的时候延迟恶魔灌注，同时也可以更快地通过一些楼层。");
        addSettingsToggle(currentNode, "prestigeDemonicBomb", "是否使用暗能量炸弹", "用暗能量炸弹送恶魔领主上西天");

        document.documentElement.scrollTop = document.body.scrollTop = currentScrollPosition;
    }

    function buildGovernmentSettings(parentNode, secondaryPrefix) {
        let sectionId = "government";
        let sectionName = "政府";

        let resetFunction = function() {
            resetGovernmentSettings(true);
            updateSettingsFromState();
            updateGovernmentSettingsContent(secondaryPrefix);

            resetCheckbox("autoTax");
        };

        buildSettingsSection2(parentNode, secondaryPrefix, sectionId, sectionName, resetFunction, updateGovernmentSettingsContent);
    }

    function updateGovernmentSettingsContent(secondaryPrefix) {
        let currentScrollPosition = document.documentElement.scrollTop || document.body.scrollTop;

        let currentNode = $(`#script_${secondaryPrefix}governmentContent`);
        currentNode.empty().off("*");

        addSettingsNumber(currentNode, "generalMinimumTaxRate", "最低允许税率", "自动税率使用的最低税率。如果资金满了，将可能低于此数值。");
        addSettingsNumber(currentNode, "generalMinimumMorale", "最低允许士气", "设置最低允许的士气。少于100%士气可能引起税收抵制，请尽量不要设置到100%以下。另外请记得天气的影响");
        addSettingsNumber(currentNode, "generalMaximumMorale", "最高允许士气", "设置最高允许的士气。如果士气超过此数值，将提高税率");

        addSettingsToggle(currentNode, "govManage", "是否管理社会体制变化", "当可能的时候，自动改变社会体制");

        let governmentOptions = Object.keys(GovernmentManager.Types).filter(id => id !== "anarchy").map(id => ({val: id, label: game.loc(`govern_${id}`), hint: game.loc(`govern_${id}_desc`)}));
        addSettingsSelect(currentNode, "govInterim", "临时社会体制", "当研究其他社会体制之前，用于过渡的临时社会体制", governmentOptions);
        addSettingsSelect(currentNode, "govFinal", "第二社会体制", "第二社会体制，当此社会体制可用后立刻进行切换。可以与上面的社会体制相同。", governmentOptions);
        addSettingsSelect(currentNode, "govSpace", "太空社会体制", "用于播种之后的社会体制，当研究量子制造以后立刻进行切换。可以与上面的社会体制相同。", governmentOptions);

        let governorsOptions = [{val: "none", label: "无", hint: "不选择总督"}, ...governors.map(id => ({val: id, label: game.loc(`governor_${id}`), hint: game.loc(`governor_${id}_desc`)}))];
        addSettingsSelect(currentNode, "govGovernor", "总督", "将使用选中的总督。", governorsOptions);

        document.documentElement.scrollTop = document.body.scrollTop = currentScrollPosition;
    }

    function buildEvolutionSettings() {
        let sectionId = "evolution";
        let sectionName = "进化";

        let resetFunction = function() {
            resetEvolutionSettings(true);
            updateSettingsFromState();
            updateEvolutionSettingsContent();

            resetCheckbox("autoEvolution");
        };

        buildSettingsSection(sectionId, sectionName, resetFunction, updateEvolutionSettingsContent);
    }

    function updateRaceWarning() {
        let race = races[settingsRaw.userEvolutionTarget];
        if (race && race.getCondition() !== '') {
            let suited = race.getHabitability();
            if (suited === 1) {
                $("#script_race_warning").html(`<span class="has-text-success">此种族的特殊要求为： ${race.getCondition()}。当前满足此条件。</span>`);
            } else if (suited === 0) {
                $("#script_race_warning").html(`<span class="has-text-danger">警告！此种族的特殊要求为： ${race.getCondition()}。当前不满足此条件。</span>`);
            } else {
                $("#script_race_warning").html(`<span class="has-text-warning">警告！此种族的特殊要求为： ${race.getCondition()}。当前可使用此种族，但受到 ${100 - suited * 100}% 的产量惩罚。</span>`);
            }
        } else {
            $("#script_race_warning").empty();
        }
    }

    function updateEvolutionSettingsContent() {
        let currentScrollPosition = document.documentElement.scrollTop || document.body.scrollTop;

        let currentNode = $('#script_evolutionContent');
        currentNode.empty().off("*");

        // Target universe
        let universeOptions = [{val: "none", label: "无", hint: "等待玩家选择"},
                               ...universes.map(id => ({val: id, label: game.loc(`universe_${id}`), hint: game.loc(`universe_${id}_desc`)}))];
        addSettingsSelect(currentNode, "userUniverseTargetName", "欲选择的宇宙", "在特定重置后自动选择相应的宇宙", universeOptions);

        // Target planet
        let planetOptions = [{val: "none", label: "无", hint: "等待玩家选择"},
                             {val: "habitable", label: "最宜居", hint: "根据生物群系和星球特性，选择最佳的星球"},
                             {val: "achieve", label: "最多成就", hint: "选择可以尽可能多完成成就的星球。将考虑毁灭类成就中星球特有的种族，以及伟大类成就中生物群系，星球特征和特有的种群。"},
                             {val: "weighting", label: "最高权重", hint: "选择星球权重最高的星球。可以在下面的星球权重设置中进行更进一步的设置。"}];
        addSettingsSelect(currentNode, "userPlanetTargetName", "欲选择的星球", "在特定重置后自动选择相应的星球", planetOptions);

        // Target evolution
        let raceOptions = [{val: "auto", label: "自动完成成就", hint: "优先选择可以获得更多成就的种族，会将所有种族和种群限定，或是重置方式限定的成就纳入考虑。生物群系特有的种族如果可以选择，将优先进行选择。"},
                           ...Object.values(races).map(race => (
                           {val: race.id, label: race.name, hint: race.desc}))];
        addSettingsSelect(currentNode, "userEvolutionTarget", "欲进化的种族", "下个进化阶段自动选择相应的种族", raceOptions)
          .on('change', 'select', function() {
            state.evolutionTarget = null;
            updateRaceWarning();

            let content = document.querySelector('#script_evolutionSettings .script-content');
            content.style.height = null;
            content.style.height = content.offsetHeight + "px"
        });

        currentNode.append(`<div><span id="script_race_warning"></span></div>`);
        updateRaceWarning();

        addSettingsToggle(currentNode, "evolutionBackup", "是否进行软重置", "直到选中想要选择的种族之前一直进行软重置。在获得大灭绝特权后就没有必要选择了。");

        // Challenges
        for (let i = 0; i < challenges.length; i++) {
            let set = challenges[i];
            addSettingsToggle(currentNode, `challenge_${set[0].id}`,
              set.map(c => game.loc(`evo_challenge_${c.id}`)).join(" | "),
              set.map(c => game.loc(`evo_challenge_${c.id}_effect`)).join("&#xA;"));
        }

        addStandardHeading(currentNode, "进化队列");
        addSettingsToggle(currentNode, "evolutionQueueEnabled", "是否开启进化队列", "按照队列从上至下进行进化。队列中有项目存在时，优先于脚本的进化设置生效。在完成进化后，相应的队列项目将被移除。");
        addSettingsToggle(currentNode, "evolutionQueueRepeat", "是否重复队列", "开启后，队列中的项目在完成进化后将回到队列末尾，而不是被移除");


        currentNode.append(`
          <div style="margin-top: 5px; display: inline-block; width: 90%; text-align: left;">
            <label for="script_evolution_prestige">新一轮进化使用的威望重置类型：</label>
            <select id="script_evolution_prestige" style="height: 18px; width: 150px; float: right;">
              <option value = "auto" title = "与当前的威望重置类型一致">当前的威望重置类型</option>
              ${prestigeOptions}
            </select>
          </div>
          <div style="margin-top: 10px;">
            <button id="script_evlution_add" class="button">添加进化队列</button>
          </div>`);

        $("#script_evlution_add").on("click", addEvolutionSetting);
        currentNode.append(`
          <table style="width:100%">
            <tr>
              <th class="has-text-warning" style="width:25%">种族</th>
              <th class="has-text-warning" style="width:70%" title="进化之前生效的设置。不仅限于模板，您还可以将其他的脚本设置以JSON形式输入。">设置</th>
              <th style="width:5%"></th>
            </tr>
            <tbody id="script_evolutionQueueTable"></tbody>
          </table>`);

        let tableBodyNode = $('#script_evolutionQueueTable');
        for (let i = 0; i < settingsRaw.evolutionQueue.length; i++) {
            tableBodyNode.append(buildEvolutionQueueItem(i));
        }

        tableBodyNode.sortable({
            items: "tr:not(.unsortable)",
            helper: sorterHelper,
            update: function() {
                let newOrder = tableBodyNode.sortable('toArray', {attribute: 'value'});
                settingsRaw.evolutionQueue = newOrder.map((i) => settingsRaw.evolutionQueue[i]);

                updateSettingsFromState();
                updateEvolutionSettingsContent();
            },
        } );

        document.documentElement.scrollTop = document.body.scrollTop = currentScrollPosition;
    }

    function buildEvolutionQueueItem(id) {
        let queuedEvolution = settingsRaw.evolutionQueue[id];

        let raceName = "";
        let raceClass = "";
        let prestigeName = "";
        let prestigeClass = "";

        let race = races[queuedEvolution.userEvolutionTarget];
        if (race) {
            raceName = race.name;

            // Check if we can evolve intro it
            let suited = race.getHabitability();
            if (suited === 1) {
                raceClass = "has-text-info";
            } else if (suited === 0) {
                raceClass = "has-text-danger";
            } else {
                raceClass = "has-text-warning";
            }
        } else if (queuedEvolution.userEvolutionTarget === "auto") {
            raceName = "Auto Achievements";
            raceClass = "has-text-advanced";
        } else {
            raceName = "Unrecognized race!";
            raceClass = "has-text-danger";
        }

        let star = $(`#settings a.dropdown-item:contains("${game.loc(game.global.settings.icon)}") svg`).clone();
        star.removeClass();
        star.addClass("star" + getStarLevel(queuedEvolution));

        if (queuedEvolution.prestigeType !== "none") {
            if (prestigeNames[queuedEvolution.prestigeType]) {
                prestigeName = `(${prestigeNames[queuedEvolution.prestigeType]})`;
                prestigeClass = "has-text-info";
            } else {
                prestigeName = "威望重置类型无法识别！";
                prestigeClass = "has-text-danger";
            }
        }

        let queueNode = $(`
          <tr id="script_evolution_${id}" value="${id}" class="script-draggable">
            <td style="width:25%"><span class="${raceClass}">${raceName}</span> <span class="${prestigeClass}">${prestigeName}</span> ${star.prop('outerHTML') ?? (getStarLevel(queuedEvolution)-1) + "*"}</td>
            <td style="width:70%"><textarea class="textarea">${JSON.stringify(queuedEvolution, null, 4)}</textarea></td>
            <td style="width:5%"><a class="button is-dark is-small"><span>X</span></a></td>
          </tr>`);

        // Delete button
        queueNode.find(".button").on('click', function() {
            settingsRaw.evolutionQueue.splice(id, 1);
            updateSettingsFromState();
            updateEvolutionSettingsContent();

            let content = document.querySelector('#script_evolutionSettings .script-content');
            content.style.height = null;
            content.style.height = content.offsetHeight + "px"
        });


        // Settings textarea
        queueNode.find(".textarea").on('change', function() {
            try {
                let queuedEvolution = JSON.parse(this.value);
                settingsRaw.evolutionQueue[id] = queuedEvolution;
                updateSettingsFromState();
                updateEvolutionSettingsContent();
            } catch (error) {
                queueNode.find('td:eq(0)').html(`<span class="has-text-danger">${error}</span>`);
            }

            let content = document.querySelector('#script_evolutionSettings .script-content');
            content.style.height = null;
            content.style.height = content.offsetHeight + "px"
        });

        return queueNode;
    }

    function addEvolutionSetting() {
        let queuedEvolution = {};
        for (let i = 0; i < evolutionSettingsToStore.length; i++){
            let settingName = evolutionSettingsToStore[i];
            let settingValue = settingsRaw[settingName];
            queuedEvolution[settingName] = settingValue;
        }

        let overridePrestige = $("#script_evolution_prestige").first().val();
        if (overridePrestige && overridePrestige !== "auto") {
            queuedEvolution.prestigeType = overridePrestige;
        }

        let queueLength = settingsRaw.evolutionQueue.push(queuedEvolution);
        updateSettingsFromState();

        let tableBodyNode = $('#script_evolutionQueueTable');
        tableBodyNode.append(buildEvolutionQueueItem(queueLength-1));

        let content = document.querySelector('#script_evolutionSettings .script-content');
        content.style.height = null;
        content.style.height = content.offsetHeight + "px"
    }

    function buildPlanetSettings() {
        let sectionId = "planet";
        let sectionName = "星球权重";

        let resetFunction = function() {
            resetPlanetSettings(true);
            updateSettingsFromState();
            updatePlanetSettingsContent();
        };

        buildSettingsSection(sectionId, sectionName, resetFunction, updatePlanetSettingsContent);
    }

    function updatePlanetSettingsContent() {
        let currentScrollPosition = document.documentElement.scrollTop || document.body.scrollTop;

        let currentNode = $('#script_planetContent');
        currentNode.empty().off("*");

        currentNode.append(`
          <span>星球权重 = 群系权重 + 特性权重 + (其他项数值 * 其他项权重)</span>
          <table style="width:100%">
            <tr>
              <th class="has-text-warning" style="width:20%">群系</th>
              <th class="has-text-warning" style="width:calc(40% / 3)">权重</th>
              <th class="has-text-warning" style="width:20%">特性</th>
              <th class="has-text-warning" style="width:calc(40% / 3)">权重</th>
              <th class="has-text-warning" style="width:20%">其他</th>
              <th class="has-text-warning" style="width:calc(40% / 3)">权重</th>
            </tr>
            <tbody id="script_planetTableBody"></tbody>
          </table>`);

        let tableBodyNode = $('#script_planetTableBody');
        let newTableBodyText = "";

        let tableSize = Math.max(biomeList.length, traitList.length, extraList.length);
        for (let i = 0; i < tableSize; i++) {
            newTableBodyText += `<tr><td id="script_planet_${i}" style="width:20%"></td><td style="width:calc(40% / 3);border-right-width:1px"></td><td style="width:20%"></td><td style="width:calc(40% / 3);border-right-width:1px"></td><td style="width:20%"></td><td style="width:calc(40% / 3)"></td>/tr>`;
        }
        tableBodyNode.append($(newTableBodyText));

        for (let i = 0; i < tableSize; i++) {
            let tableElement = $('#script_planet_' + i);

            if (i < biomeList.length) {
                tableElement.append(buildTableLabel(game.loc("biome_" +  biomeList[i] + "_name")));
                tableElement = tableElement.next();
                addTableInput(tableElement, "biome_w_" + biomeList[i]);
            } else {
                tableElement = tableElement.next();
            }
            tableElement = tableElement.next();

            if (i < traitList.length) {
                tableElement.append(buildTableLabel(i == 0 ? "无" : game.loc("planet_" + traitList[i])));
                tableElement = tableElement.next();
                addTableInput(tableElement, "trait_w_" + traitList[i]);
            } else {
                tableElement = tableElement.next();
            }
            tableElement = tableElement.next();

            if (i < extraList.length) {
                tableElement.append(buildTableLabel(i == 0 ? "成就" : game.loc("resource_" + extraList[i] + "_name")));
                tableElement = tableElement.next();
                addTableInput(tableElement, "extra_w_" + extraList[i]);
            }
        }

        document.documentElement.scrollTop = document.body.scrollTop = currentScrollPosition;
    }

    function buildTriggerSettings() {
        let sectionId = "trigger";
        let sectionName = "触发器";

        let resetFunction = function() {
            resetTriggerSettings(true);
            resetTriggerState();
            updateSettingsFromState();
            updateTriggerSettingsContent();

            resetCheckbox("autoTrigger");
        };

        buildSettingsSection(sectionId, sectionName, resetFunction, updateTriggerSettingsContent);
    }

    function updateTriggerSettingsContent() {
        let currentScrollPosition = document.documentElement.scrollTop || document.body.scrollTop;

        let currentNode = $('#script_triggerContent');
        currentNode.empty().off("*");

        currentNode.append('<div style="margin-top: 10px;"><button id="script_trigger_add" class="button">添加新触发器</button></div>');
        $("#script_trigger_add").on("click", addTriggerSetting);

        currentNode.append(`
          <table style="width:100%">
            <tr>
              <th class="has-text-warning" colspan="3">需求</th>
              <th class="has-text-warning" colspan="5">行动</th>
            </tr>
            <tr>
              <th class="has-text-warning" style="width:16%">类型</th>
              <th class="has-text-warning" style="width:18%">Id</th>
              <th class="has-text-warning" style="width:11%">计数</th>
              <th class="has-text-warning" style="width:16%">类型</th>
              <th class="has-text-warning" style="width:18%">Id</th>
              <th class="has-text-warning" style="width:11%">计数</th>
              <th style="width:5%"></th>
              <th style="width:5%"></th>
            </tr>
            <tbody id="script_triggerTableBody"></tbody>
          </table>`);

        let tableBodyNode = $('#script_triggerTableBody');
        let newTableBodyText = "";

        for (let i = 0; i < TriggerManager.priorityList.length; i++) {
            const trigger = TriggerManager.priorityList[i];
            newTableBodyText += `<tr id="script_trigger_${trigger.seq}" value="${trigger.seq}" class="script-draggable"><td style="width:16%"></td><td style="width:18%"></td><td style="width:11%"></td><td style="width:16%"></td><td style="width:18%"></td><td style="width:11%"></td><td style="width:5%"></td><td style="width:5%"><span class="script-lastcolumn"></span></td></tr>`;
        }
        tableBodyNode.append($(newTableBodyText));

        for (let i = 0; i < TriggerManager.priorityList.length; i++) {
            const trigger = TriggerManager.priorityList[i];

            buildTriggerRequirementType(trigger);
            buildTriggerRequirementId(trigger);
            buildTriggerRequirementCount(trigger);

            buildTriggerActionType(trigger);
            buildTriggerActionId(trigger);
            buildTriggerActionCount(trigger);

            buildTriggerSettingsColumn(trigger);
        }

        tableBodyNode.sortable({
            items: "tr:not(.unsortable)",
            helper: sorterHelper,
            update: function() {
                let triggerIds = tableBodyNode.sortable('toArray', {attribute: 'value'});
                for (let i = 0; i < triggerIds.length; i++) {
                    TriggerManager.getTrigger(parseInt(triggerIds[i])).priority = i;
                }

                TriggerManager.sortByPriority();
                updateSettingsFromState();
            },
        });

        document.documentElement.scrollTop = document.body.scrollTop = currentScrollPosition;
    }

    function addTriggerSetting() {
        let trigger = TriggerManager.AddTrigger("unlocked", "tech-club", 0, "research", "tech-club", 0);
        updateSettingsFromState();

        let tableBodyNode = $('#script_triggerTableBody');
        let newTableBodyText = "";

        newTableBodyText += `<tr id="script_trigger_${trigger.seq}" value="${trigger.seq}" class="script-draggable"><td style="width:16%"></td><td style="width:18%"></td><td style="width:11%"></td><td style="width:16%"></td><td style="width:18%"></td><td style="width:11%"></td><td style="width:5%"></td><td style="width:5%"><span class="script-lastcolumn"></span></td></tr>`;

        tableBodyNode.append($(newTableBodyText));

        buildTriggerRequirementType(trigger);
        buildTriggerRequirementId(trigger);
        buildTriggerRequirementCount(trigger);

        buildTriggerActionType(trigger);
        buildTriggerActionId(trigger);
        buildTriggerActionCount(trigger);

        buildTriggerSettingsColumn(trigger);

        let content = document.querySelector('#script_triggerSettings .script-content');
        content.style.height = null;
        content.style.height = content.offsetHeight + "px"
    }

    function buildTriggerRequirementType(trigger) {
        let triggerElement = $('#script_trigger_' + trigger.seq).children().eq(0);
        triggerElement.empty().off("*");

        // Requirement Type
        let typeSelectNode = $(`
          <select>
            <option value = "unlocked" title = "当相应研究解锁后，视为满足条件">解锁时</option>
            <option value = "researched" title = "当进行相应研究后，视为满足条件">研究后</option>
            <option value = "built" title = "当相应建筑的数量达到相应数值后，视为满足条件">建造时</option>
          </select>`);
        typeSelectNode.val(trigger.requirementType);

        triggerElement.append(typeSelectNode);

        typeSelectNode.on('change', function() {
            trigger.updateRequirementType(this.value);

            buildTriggerRequirementId(trigger);
            buildTriggerRequirementCount(trigger);

            buildTriggerActionType(trigger);
            buildTriggerActionId(trigger);
            buildTriggerActionCount(trigger);

            updateSettingsFromState();
        });

        return;
    }

    function buildTriggerRequirementId(trigger) {
        let triggerElement = $('#script_trigger_' + trigger.seq).children().eq(1);
        triggerElement.empty().off("*");

        if (trigger.requirementType === "researched" || trigger.requirementType === "unlocked") {
            triggerElement.append(buildTriggerListInput(techIds, trigger, "requirementId"));
        }
        if (trigger.requirementType === "built") {
            triggerElement.append(buildTriggerListInput(buildingIds, trigger, "requirementId"));
        }
    }

    function buildTriggerRequirementCount(trigger) {
        let triggerElement = $('#script_trigger_' + trigger.seq).children().eq(2);
        triggerElement.empty().off("*");

        if (trigger.requirementType === "built") {
            triggerElement.append(buildTriggerCountInput(trigger, "requirementCount"));
        }
    }

    function buildTriggerActionType(trigger) {
        let triggerElement = $('#script_trigger_' + trigger.seq).children().eq(3);
        triggerElement.empty().off("*");

        // Action Type
        let typeSelectNode = $(`
          <select>
            <option value = "research" title = "进行相应研究">研究</option>
            <option value = "build" title = "建造建筑，数量上限为计数">建造</option>
            <option value = "arpa" title = "建造ARPA项目，数量上限为计数">A.R.P.A.</option>
          </select>`);
        typeSelectNode.val(trigger.actionType);

        triggerElement.append(typeSelectNode);

        typeSelectNode.on('change', function() {
            trigger.updateActionType(this.value);

            buildTriggerActionId(trigger);
            buildTriggerActionCount(trigger);

            updateSettingsFromState();
        });

        return;
    }

    function buildTriggerActionId(trigger) {
        let triggerElement = $('#script_trigger_' + trigger.seq).children().eq(4);
        triggerElement.empty().off("*");

        if (trigger.actionType === "research") {
            triggerElement.append(buildTriggerListInput(techIds, trigger, "actionId"));
        }
        if (trigger.actionType === "build") {
            triggerElement.append(buildTriggerListInput(buildingIds, trigger, "actionId"));
        }
        if (trigger.actionType === "arpa") {
            triggerElement.append(buildTriggerListInput(arpaIds, trigger, "actionId"));
        }
    }

    function buildTriggerActionCount(trigger) {
        let triggerElement = $('#script_trigger_' + trigger.seq).children().eq(5);
        triggerElement.empty().off("*");

        if (trigger.actionType === "build" || trigger.actionType === "arpa") {
            triggerElement.append(buildTriggerCountInput(trigger, "actionCount"));
        }
    }

    function buildTriggerSettingsColumn(trigger) {
        let triggerElement = $('#script_trigger_' + trigger.seq).children().eq(6);
        triggerElement.empty().off("*");

        let deleteTriggerButton = $('<a class="button is-dark is-small"><span>X</span></a>');
        triggerElement.append(deleteTriggerButton);
        deleteTriggerButton.on('click', function() {
            TriggerManager.RemoveTrigger(trigger.seq);
            updateSettingsFromState();
            updateTriggerSettingsContent();

            let content = document.querySelector('#script_triggerSettings .script-content');
            content.style.height = null;
            content.style.height = content.offsetHeight + "px"
        });
    }

    function buildTriggerListInput(list, trigger, property){
        let typeSelectNode = $('<input style="width:100%"></input>');

        // Event handler
        let onChange = function(event, ui) {
            event.preventDefault();

            // If it wasn't selected from list
            if(ui.item === null){
                let typedName = Object.values(list).find(obj => obj.name === this.value);
                if (typedName !== undefined){
                    ui.item = {label: this.value, value: typedName._vueBinding};
                }
            }

            // We have an item to switch
            if (ui.item !== null && list.hasOwnProperty(ui.item.value)) {
                if (trigger[property] === ui.item.value) {
                    return;
                }

                trigger[property] = ui.item.value;
                trigger.complete = false;

                updateSettingsFromState();

                this.value = ui.item.label;
                return;
            }

            // No building selected, don't change trigger, just restore old name in text field
            if (list.hasOwnProperty(trigger[property])) {
                this.value = list[trigger[property]].name;
                return;
            }
        };

        typeSelectNode.autocomplete({
            minLength: 2,
            delay: 0,
            source: function(request, response) {
                let matcher = new RegExp($.ui.autocomplete.escapeRegex(request.term), "i");
                response(Object.values(list)
                  .filter(item => matcher.test(item.name))
                  .map(item => ({label: item.name, value: item._vueBinding})));
            },
            select: onChange, // Dropdown list click
            focus: onChange, // Arrow keys press
            change: onChange // Keyboard type
        });

        if (list.hasOwnProperty(trigger[property])) {
            typeSelectNode.val(list[trigger[property]].name);
        }

        return typeSelectNode;
    }

    function buildTriggerCountInput(trigger, property) {
        let textBox = $('<input type="text" class="input is-small" style="width:100%"/>');
        textBox.val(trigger[property]);

        textBox.on('change', function() {
            let parsedValue = getRealNumber(textBox.val());
            if (!isNaN(parsedValue)) {
                trigger[property] = parsedValue;
                trigger.complete = false;

                updateSettingsFromState();
            }
            textBox.val(trigger[property]);
        });

        return textBox;
    }

    function buildResearchSettings() {
        let sectionId = "research";
        let sectionName = "研究";

        let resetFunction = function() {
            resetResearchSettings(true);
            updateSettingsFromState();
            updateResearchSettingsContent();

            resetCheckbox("autoResearch");
        };

        buildSettingsSection(sectionId, sectionName, resetFunction, updateResearchSettingsContent);
    }

    function updateResearchSettingsContent() {
        let currentScrollPosition = document.documentElement.scrollTop || document.body.scrollTop;

        let currentNode = $('#script_researchContent');
        currentNode.empty().off("*");

        // Theology 1
        let theology1Options = [{val: "auto", label: "由脚本管理", hint: "进行核弹重置时选择人类学，其余情况下选择狂热信仰。需要狂热信仰祖先才能完成成就时例外，此时将一直选择狂热信仰。"},
                                {val: "tech-anthropology", label: game.loc('tech_anthropology'), hint: game.loc('tech_anthropology_effect')},
                                {val: "tech-fanaticism", label: game.loc('tech_fanaticism'), hint: game.loc('tech_fanaticism_effect')}];
        addSettingsSelect(currentNode, "userResearchTheology_1", "神学研究分支1", "神学研究分支1的选择，获得超越特权以后失效", theology1Options);

        // Theology 2
        let theology2Options = [{val: "auto", label: "由脚本管理", hint: "进行飞升重置时选择神化先祖，其余情况下选择研究先祖"},
                                {val: "tech-study", label: game.loc('tech_study'), hint: game.loc('tech_study_desc')},
                                {val: "tech-deify", label: game.loc('tech_deify'), hint: game.loc('tech_deify_desc')}];
        addSettingsSelect(currentNode, "userResearchTheology_2", "神学研究分支2", "神学研究分支2的选择", theology2Options);

        addSettingsList(currentNode, "researchIgnore", "忽略的研究", "脚本将不会进行相应的自动研究。部分特殊研究同样不会自动进行，例如限制对撞机，暗能量炸弹和奇异灌输等。", techIds);

        document.documentElement.scrollTop = document.body.scrollTop = currentScrollPosition;
    }

    function buildWarSettings(parentNode, secondaryPrefix) {
        let sectionId = "war";
        let sectionName = "外交事务";

        let resetFunction = function() {
            resetWarSettings(true);
            updateSettingsFromState();
            updateWarSettingsContent(secondaryPrefix);

            resetCheckbox("autoFight");
        };

        buildSettingsSection2(parentNode, secondaryPrefix, sectionId, sectionName, resetFunction, updateWarSettingsContent);
    }

    function updateWarSettingsContent(secondaryPrefix) {
        let currentScrollPosition = document.documentElement.scrollTop || document.body.scrollTop;

        let currentNode = $(`#script_${secondaryPrefix}warContent`);
        currentNode.empty().off("*");

        addSettingsHeader1(currentNode, "外国势力相关");
        addSettingsToggle(currentNode, "foreignPacifist", "是否为和平主义者", "是否进攻敌国");

        addSettingsToggle(currentNode, "foreignUnification", "是否进行统一", "是否在控制了三个敌对国家后进行统一。需要开启自动研究后此项才能生效。");
        addSettingsToggle(currentNode, "foreignOccupyLast", "是否占领最后一个未占领的国家", "当控制其他两个国家并研究统一后，自动占领最后一个国家。它可以加速统一。除非您是要做统一方式相关的成就，否则不建议关闭此项。");
        addSettingsToggle(currentNode, "foreignForceSabotage", "在有必要的时候对敌对国家进行破坏活动", "在有需要的时候(军事力量大于50)，对当前的目标进行破坏活动。将无视下方选项的相应设置。");
        addSettingsToggle(currentNode, "foreignTrainSpy", "派遣间谍", "训练间谍用于在外国势力执行任务");
        addSettingsNumber(currentNode, "foreignSpyMax", "最大间谍数", "每个敌对国家最多训练的间谍数");

        addSettingsNumber(currentNode, "foreignPowerRequired", "改变目标至少需要的军事力量", "当一个国家的军事实力低于此数值时，转为攻击它。如果确切数字无法看到，则脚本会尝试进行估计。");

        let policyOptions = [{val: "Ignore", label: "忽略", hint: ""},
                             ...Object.entries(SpyManager.Types).map(([name, task]) => (
                             {val: name, label: game.loc("civics_spy_" + task.id), hint: ""})),
                             {val: "Occupy", label: "占领", hint: ""}];
        addSettingsSelect(currentNode, "foreignPolicyInferior", "对较弱小的国家进行的间谍活动", "对较弱小的国家进行的间谍活动类型，较弱小指军事力量不高于上方数值的国家。复杂的活动将首先进行相应的准备——吞并和收购将先进行煽动和亲善，占领将先进行破坏，直到相应的选项可用为止。", policyOptions);
        addSettingsSelect(currentNode, "foreignPolicySuperior", "对较强大的国家进行的间谍活动", "对较强大的国家进行的间谍活动类型，较强大指军事力量高于上方数值的国家。复杂的活动将首先进行相应的准备——吞并和收购将先进行煽动和亲善，占领将先进行破坏，直到相应的选项可用为止。", policyOptions);

        let rivalOptions = [{val: "Ignore", label: "忽略", hint: ""},
                            {val: "Influence", label: "联盟", hint: ""},
                            {val: "Sabotage", label: "战斗", hint: ""}];
        addSettingsSelect(currentNode, "foreignPolicyRival", "竞争国家(智械黎明模式)", "对竞争国家进行的间谍活动类型。", rivalOptions);

        // Campaign panel
        addSettingsHeader1(currentNode, "战役相关");
        addSettingsNumber(currentNode, "foreignAttackLivingSoldiersPercent", "只在士兵生存人数大于此比例时进攻", "下方的未受伤士兵比例也会生效，因此只在未让所有士兵进攻时生效");
        addSettingsNumber(currentNode, "foreignAttackHealthySoldiersPercent", "只在未受伤士兵人数大于此比例时进攻", "合理设置为某个低于100的值，可以有效利用游戏内的自然愈合机制");
        addSettingsNumber(currentNode, "foreignHireMercMoneyStoragePercent", "如果资金存量大于此比例，则聘请雇佣兵", "如果聘请后剩余资金大于此比例，则聘请雇佣兵");
        addSettingsNumber(currentNode, "foreignHireMercCostLowerThanIncome", "或者聘请花费小于此秒数的资金产量，则聘请雇佣兵", "结合剩余资金比例，可以管理聘请雇佣兵的时机");
        addSettingsNumber(currentNode, "foreignHireMercDeadSoldiers", "并且需要阵亡士兵数量大于此数值，才会聘请雇佣兵", "只在阵亡士兵数量超过此数值时聘请雇佣兵");

        addSettingsNumber(currentNode, "foreignMinAdvantage", "最低优势", "进行相应战役类型最少需要的优势。进行伏击时忽略此项。大概在75%优势(受特质和战役类型影响)附近可以做到100%胜率。");
        addSettingsNumber(currentNode, "foreignMaxAdvantage", "最高优势", "当选择相应战役类型后，参加战斗的士兵数将限制在尽可能接近此优势的数量，以减少损失");
        addSettingsNumber(currentNode, "foreignMaxSiegeBattalion", "最高围城士兵数", "进行围城的最大士兵数。只在此数值的士兵数量可以进行围城时这么做。围城的损失通常很大，如果需要大量士兵才能进行的话，收益将无法弥补损失。此项不影响统一时的围城士兵数。");

        let protectOptions = [{val: "never", label: "永不", hint: "不限制参加战斗的士兵数。永远尽可能使用最高优势对应的士兵数。"},
                              {val: "always", label: "常时", hint: "将参加战斗的士兵数限制为战斗胜利后不损失任何士兵的数值。战败则仍然可能损失士兵，此时提升最低优势可以增加胜率。此项是供有装甲相关特质的种族优化进攻频率使用，如果设置不当，可能会导致士兵永远不进攻。"},
                              {val: "auto", label: "自动", hint: "尽可能增加战斗总次数，根据士兵情况，自动在前两个选项之间切换，以优化战斗结果。"}];
        addSettingsSelect(currentNode, "foreignProtect", "是否保护士兵", "设置士兵攻击的烈度。此项不影响统一时的围城士兵数。", protectOptions);

        document.documentElement.scrollTop = document.body.scrollTop = currentScrollPosition;
    }

    function buildHellSettings(parentNode, secondaryPrefix) {
        let sectionId = "hell";
        let sectionName = "地狱维度";

        let resetFunction = function() {
            resetHellSettings(true);
            updateSettingsFromState();
            updateHellSettingsContent(secondaryPrefix);

            resetCheckbox("autoHell");
        };

        buildSettingsSection2(parentNode, secondaryPrefix, sectionId, sectionName, resetFunction, updateHellSettingsContent);
    }

    function updateHellSettingsContent(secondaryPrefix) {
        let currentScrollPosition = document.documentElement.scrollTop || document.body.scrollTop;

        let currentNode = $(`#script_${secondaryPrefix}hellContent`);
        currentNode.empty().off("*");

        // Entering Hell
        addSettingsHeader1(currentNode, "进入地狱维度");
        addSettingsNumber(currentNode, "hellHomeGarrison", "不进入地狱维度的士兵人数", "驻军上限");
        addSettingsNumber(currentNode, "hellMinSoldiers", "进入地狱维度最少士兵总数(低于此值时撤出)", "如果士兵不足，不进入地狱维度，如果已经进入，则撤出所有士兵");
        addSettingsNumber(currentNode, "hellMinSoldiersPercent", "进入地狱维度需拥有生存士兵的比例", "如果阵亡士兵过多，不进入地狱维度，但不会撤出士兵");

        // Hell Garrison
        addSettingsHeader1(currentNode, "地狱维度驻扎士兵");
        addSettingsNumber(currentNode, "hellTargetFortressDamage", "围攻后城墙耐久减少为相应数值(尽量高估威胁)", "实际上由于有巡逻队和机器人，耐久不会减少那么多");
        addSettingsNumber(currentNode, "hellLowWallsMulti", "受损城墙驻扎士兵增援因子", "当城墙剩余耐久接近0时，将堡垒防御评级增强到乘以此因子的数值，城墙剩余耐久为一半时，增强到乘以此因子一半的数值");

        // Patrol size
        addSettingsHeader1(currentNode, "巡逻队规模");
        addSettingsToggle(currentNode, "hellHandlePatrolSize", "自动调整巡逻队规模", "根据当前恶魔生物数量调整巡逻队规模，建筑作用下将减少之，低于最低战斗评级及士兵阵亡时将增加之。必须开启调整巡逻队数量。");
        addSettingsNumber(currentNode, "hellPatrolMinRating", "单支巡逻队最低战斗评级", "不会低于此数值");
        addSettingsNumber(currentNode, "hellPatrolThreatPercent", "恶魔生物基础评级与数量比例", "作为参考，每次激战的恶魔评级为当前恶魔数量的2%至10%");
        addSettingsNumber(currentNode, "hellPatrolDroneMod", "&emsp;每个掠食者无人机减少恶魔生物评级", "掠食者无人机在巡逻队战斗前就减少恶魔生物数量");
        addSettingsNumber(currentNode, "hellPatrolDroidMod", "&emsp;每个战斗机器人减少恶魔生物评级", "根据研究情况，战斗机器人可以增加1至2名士兵的巡逻队战斗评级");
        addSettingsNumber(currentNode, "hellPatrolBootcampMod", "&emsp;每个新兵训练营减少恶魔生物评级", "新兵训练营使士兵更快完成训练");
        addSettingsNumber(currentNode, "hellBolsterPatrolRating", "士兵阵亡时增加巡逻队战斗评级至此数值", "更大的巡逻队效率更低，但阵亡也更少");
        addSettingsNumber(currentNode, "hellBolsterPatrolPercentTop", "&emsp;当驻军到达此比例时开始增加巡逻队战斗评级", "较高数值");
        addSettingsNumber(currentNode, "hellBolsterPatrolPercentBottom", "&emsp;当驻军低于此比例时将巡逻队战斗评级增加到最大", "较低数值");

        // Attractors
        addSettingsHeader1(currentNode, "吸引器信标");
        addSettingsNumber(currentNode, "hellAttractorBottomThreat", "&emsp;恶魔生物数量低于此数值时开启所有吸引器信标", "越接近最大恶魔数量，关闭越多吸引器信标。需要开启自动供能此项才能生效。");
        addSettingsNumber(currentNode, "hellAttractorTopThreat", "&emsp;恶魔生物数量高于此数值时关闭所有吸引器信标", "越接近最大恶魔数量，关闭越多吸引器信标。需要开启自动供能此项才能生效。");

        document.documentElement.scrollTop = document.body.scrollTop = currentScrollPosition;
    }

    function buildFleetSettings(parentNode, secondaryPrefix) {
        let sectionId = "fleet";
        let sectionName = "舰队";

        let resetFunction = function() {
            resetFleetSettings(true);
            updateSettingsFromState();
            updateFleetSettingsContent(secondaryPrefix);

            resetCheckbox("autoFleet");
        };

        buildSettingsSection2(parentNode, secondaryPrefix, sectionId, sectionName, resetFunction, updateFleetSettingsContent);
    }

    function updateFleetSettingsContent(secondaryPrefix) {
        let currentScrollPosition = document.documentElement.scrollTop || document.body.scrollTop;

        let currentNode = $(`#script_${secondaryPrefix}fleetContent`);
        currentNode.empty().off("*");

        updateFleetAndromeda(currentNode, secondaryPrefix);
        updateFleetOuter(currentNode, secondaryPrefix);

        document.documentElement.scrollTop = document.body.scrollTop = currentScrollPosition;
    }

    function updateFleetOuter(currentNode, secondaryPrefix) {
        addStandardHeading(currentNode, "太阳系外围");
        addSettingsNumber(currentNode, "fleetOuterCrew", "空闲士兵下限", "只在空闲士兵数量(不包括伤兵)大于此数值时建造舰船。");
        addSettingsNumber(currentNode, "fleetOuterMinSyndicate", "辛迪加战力下限", "只对辛迪加战力超过相应数值的区域派遣舰船。");

        let shipOptions = [{val: "none", label: "无", hint: "不建造舰船"},
                           {val: "user", label: "当前设计", hint: "按照船坞当前的设计来建造舰船"},
                           {val: "custom", label: "预设", hint: "按照下方的组件配置来建造舰船。所有的组件必须都解锁了，而且最终设计的动力必须足够"}];
        addSettingsSelect(currentNode, "fleetOuterShips", "舰船建造类型", "当舰船可以建造时，脚本将按照选项建造舰船，并派往 敌人战力*权重 最高的地区", shipOptions);
        for (let [type, parts] of Object.entries(FleetManagerOuter.ShipConfig)) {
            let partOptions = parts.map(id => ({val: id, label: game.loc(`outer_shipyard_${type}_${id}`)}));
            addSettingsSelect(currentNode, `fleet_outer_${type}`, game.loc(`outer_shipyard_${type}`), "Preset ship component", partOptions);
        }

        currentNode.append(`
          <table style="width:100%">
            <tr>
              <th class="has-text-warning" style="width:55%">地区</th>
              <th class="has-text-warning" style="width:20%">权重</th>
              <th style="width:25%"></th>
            </tr>
            <tbody id="script_${secondaryPrefix}fleetOuterTable"></tbody>
          </table>`);

        let tableBodyNode = $(`#script_${secondaryPrefix}fleetOuterTable`);
        let newTableBodyText = "";

        for (let reg of FleetManagerOuter.Regions) {
            newTableBodyText += `<tr><td id="script_fleet_${reg}" style="width:55%"></td><td style="width:20%"></td><td style="width:25%"></td></tr>`;
        }
        tableBodyNode.append($(newTableBodyText));

        // Build all other productions settings rows
        for (let reg of FleetManagerOuter.Regions) {
            let fleetElement = $('#script_fleet_' + reg);

            let nameRef = game.actions.space[reg].info.name;
            let gameName = typeof nameRef === 'function' ? nameRef() : nameRef;
            let label = reg.split("_").slice(1)
              .map(n => n.charAt(0).toUpperCase() + n.slice(1)).join(" ");
            if (label !== gameName) {
                label = `${gameName}`;  //label += ` (${gameName})`;
            }

            fleetElement.append(buildTableLabel(label));

            fleetElement = fleetElement.next();
            addTableInput(fleetElement, "fleet_outer_pr_" + reg);
        }
    }

    function updateFleetAndromeda(currentNode, secondaryPrefix) {
        addStandardHeading(currentNode, "仙女座星云");
        addSettingsToggle(currentNode, "fleetMaxCover", "优先级高的地区尽可能最大化保护", "会优先分配舰船给优先级高的地区以完全压制相应地区的海盗活动。可能会在大船较多小船较少时浪费舰船。即使不开启此项，无畏舰仍然会正常进行分配。");
        addSettingsNumber(currentNode, "fleetEmbassyKnowledge", "建造大使馆的知识阈值", "建造大使馆后，海盗的活动会更加剧烈，因此脚本只会在到达相应数值的知识上限时进行建造。");
        addSettingsNumber(currentNode, "fleetAlienGiftKnowledge", "研究外星礼物的知识阈值", "研究外星礼物后，海盗的活动会更加剧烈，因此脚本只会在到达相应数值的知识上限时进行研究。");
        addSettingsNumber(currentNode, "fleetAlien2Knowledge", "进行第五星系任务的知识阈值", "进行第五星系任务后，海盗的活动会更加剧烈，因此脚本只会在到达相应数值的知识上限时进行研究。另外，除非您能够无损伤地完成任务，否则脚本也不会自动进行此任务。");

        let assaultOptions = [{val: "ignore", label: "不自动进行", hint: "不会自动进行幽冥星系任务"},
                              {val: "high", label: "严重损失", hint: "使用混合舰队进行幽冥星系任务，损失极大(1250以上总战力，损失500左右战力的舰队)"},
                              {val: "avg", label: "一般损失", hint: "使用混合舰队进行幽冥星系任务，损失一般(2500以上总战力，损失160左右战力的舰队)"},
                              {val: "low", label: "低损失", hint: "使用混合舰队进行幽冥星系任务，损失低(4500以上总战力，损失80左右战力的舰队)"},
                              {val: "frigate", label: "损失大型护卫舰", hint: "只损失大型护卫舰进行幽冥星系任务(4500以上总战力，对于香蕉共和国挑战或直觉特质的种族更好一些)"},
                              {val: "dread", label: "损失无畏舰", hint: "看着无畏舰燃烧吧"}];
        addSettingsSelect(currentNode, "fleetChthonianLoses", "幽冥星系任务条件", "当满足任务条件时自动进行幽冥星系任务。会尽可能少损失舰队，同时会考虑特权和挑战来调整舰队。", assaultOptions);

        currentNode.append(`
          <table style="width:100%; text-align: left">
            <tr>
              <th class="has-text-warning" style="width:95%">地区</th>
              <th style="width:5%"></th>
            </tr>
            <tbody id="script_${secondaryPrefix}fleetTableBody"></tbody>
          </table>`);

        let tableBodyNode = $(`#script_${secondaryPrefix}fleetTableBody`);
        let newTableBodyText = "";

        let priorityRegions = galaxyRegions.slice().sort((a, b) => settingsRaw["fleet_pr_" + a] - settingsRaw["fleet_pr_" + b]);
        for (let i = 0; i < priorityRegions.length; i++) {
            newTableBodyText += `<tr value="${priorityRegions[i]}" class="script-draggable"><td id="script_${secondaryPrefix}fleet_${priorityRegions[i]}" style="width:95%"><td style="width:5%"><span class="script-lastcolumn"></span></td></tr>`;
        }
        tableBodyNode.append($(newTableBodyText));

        // Build all other productions settings rows
        for (let i = 0; i < galaxyRegions.length; i++) {
            let fleetElement = $(`#script_${secondaryPrefix}fleet_${galaxyRegions[i]}`);
            let nameRef = galaxyRegions[i] === "gxy_alien1" ? "第四星系"
                        : galaxyRegions[i] === "gxy_alien2" ? "第五星系"
                        : game.actions.galaxy[galaxyRegions[i]].info.name;

            fleetElement.append(buildTableLabel(typeof nameRef === "function" ? nameRef() : nameRef));
        }

        tableBodyNode.sortable({
            items: "tr:not(.unsortable)",
            helper: sorterHelper,
            update: function() {
                let regionIds = tableBodyNode.sortable('toArray', {attribute: 'value'});
                for (let i = 0; i < regionIds.length; i++) {
                    settingsRaw["fleet_pr_" + regionIds[i]] = i;
                }

                updateSettingsFromState();
                if (settings.showSettings && secondaryPrefix) {
                    updateFleetSettingsContent('');
                }
            },
        });
    }

    function buildMechSettings() {
        let sectionId = "mech";
        let sectionName = "机甲及尖塔";

        let resetFunction = function() {
            resetMechSettings(true);
            updateSettingsFromState();
            updateMechSettingsContent();

            resetCheckbox("autoMech");
            removeMechInfo();
        };

        buildSettingsSection(sectionId, sectionName, resetFunction, updateMechSettingsContent);
    }

    function updateMechSettingsContent() {
        let currentScrollPosition = document.documentElement.scrollTop || document.body.scrollTop;

        let currentNode = $('#script_mechContent');
        currentNode.empty().off("*");

        let scrapOptions = [{val: "none", label: "无", hint: "不自动解体机甲"},
                            {val: "single", label: "机甲满舱", hint: "只在机甲舱满且需要更多机舱空间的时候解体机甲"},
                            {val: "all", label: "所有低效", hint: "解体所有效率低的机甲，并更换为更好的机甲。"},
                            {val: "mixed", label: "超过低效", hint: "在保留差不多刚好能够到达下一层的机甲前提下，尽可能解体所有低效的机甲"}];
        addSettingsSelect(currentNode, "mechScrap", "解体机甲", "设置解体机甲的情况。不会解体地狱化的机甲。", scrapOptions);
        addSettingsNumber(currentNode, "mechScrapEfficiency", "解体效率", "只在(旧机甲返还资源/新机甲资源花费)/(旧机甲攻击力/新机甲攻击力)超过相应数字时解体机甲。.");
        addSettingsNumber(currentNode, "mechCollectorValue", "搜集机甲价值", "搜集机甲没有战斗力，所以无法直接与其他机甲进行比较。脚本将以设定的比例来衡量搜集机甲的价值。如果您觉得脚本不太愿意解体旧的搜集机甲，您可以降低此数值，反之也可以提高此数值。设为1的情况下视为与侦察机甲等同战斗力，设为0.5则视为一半，设为2则视为两倍，以此类推。");

        let buildOptions = [{val: "none", label: "无", hint: "不自动制造机甲"},
                            {val: "random", label: "最佳设计", hint: "制造大小为下方选择的，效率最高的机甲"},
                            {val: "user", label: "当前设计", hint: "按照机甲实验室当前的设计来制造机甲"}];
        addSettingsSelect(currentNode, "mechBuild", "制造机甲", "设置制造机甲的情况。不会制造地狱化的机甲。", buildOptions);

        // TODO: Make auto truly auto - some way to pick best "per x", depends on current bottleneck
        let sizeOptions = [{val: "auto", label: "每空间战斗力", hint: "根据当前层的每空间战斗力，尽可能选择最佳的机甲"},
                           {val: "gems", label: "每宝石战斗力", hint: "根据当前层的每宝石战斗力，尽可能选择最佳的机甲"},
                           {val: "supply", label: "每补给战斗力", hint: "根据当前层的每补给战斗力，尽可能选择最佳的机甲"},
                            ...MechManager.Size.map(id => ({val: id, label: game.loc(`portal_mech_size_${id}`), hint: game.loc(`portal_mech_size_${id}_desc`)}))];
        addSettingsSelect(currentNode, "mechSize", "偏好的机甲尺寸", "最佳设计的机甲尺寸", sizeOptions);
        addSettingsSelect(currentNode, "mechSizeGravity", "重力环境下的机甲尺寸", "重力环境下自动制造的机甲尺寸", sizeOptions);

        let specialOptions = [{val: "always", label: "常时", hint: "所有机甲都使用特殊装备"},
                              {val: "prefered", label: "偏好", hint: "当特殊装备不降低当前层效率时使用特殊装备"},
                              {val: "random", label: "随机", hint: "所有特殊装备都可能使用"},
                              {val: "never", label: "永不", hint: "永不使用特殊装备"}];
        addSettingsSelect(currentNode, "mechSpecial", "特殊装备", "设置特殊装备", specialOptions);
        addSettingsNumber(currentNode, "mechWaygatePotential", "进入地狱之门的机甲潜力阈值", "只在机甲潜力低于相应数值时与恶魔领主进行战斗。机甲舱充满最好设计的机甲时潜力为1。恶魔领主的强度不受楼层和武器装备影响，所以在普通敌人需要时间太久时转为攻击恶魔领主会更有效率。需要开启自动供能此项才能生效。");
        addSettingsNumber(currentNode, "mechMinSupply", "最低补给收入", "如果当前补给收入低于相应数字，则开始建造搜集机甲");
        addSettingsNumber(currentNode, "mechMaxCollectors", "搜集机甲最高比例", "限制上方选项的搜集机甲数量。");
        addSettingsNumber(currentNode, "mechSaveSupplyRatio", "为下一层提前积攒补给的比例", "为下一层保留的补给比例。脚本将估计您在这一层剩余的时间，如果通过这一层时补给会低于这个比例，则将开始保留补给。这样您就可以在进入新一层时立刻建造最佳的机甲了。设为1则将以满补给进入下一层，设为0.5则将以一半补给进入下一层，设为0则将无视此项，以此类推。");
        addSettingsNumber(currentNode, "mechScouts", "侦察机甲最低比例", "侦察机甲可以抵消楼层生态对机甲的惩罚。以此比例建造它们。");
        addSettingsToggle(currentNode, "mechInfernalCollector", "是否建造地狱化搜集机甲", "地狱化搜集机甲需要花费更多补给，但收益也更高，如果建造完以后可以持续30分钟左右运行，则净收益将超过普通搜集机甲。");
        addSettingsToggle(currentNode, "mechScoutsRebuild", "是否重新建造侦察机甲", "侦察机甲即使在效率下降时，对其他机甲的加成也不会受到影响，此项可以阻止脚本重新建造侦察机甲，以节省资源。");
        addSettingsToggle(currentNode, "mechFillBay", "当无法再建造偏好机甲时建造尺寸更小的机甲", "当机舱空间不足或补给上限不足，无法制造偏好尺寸的机甲时，制造尺寸更小的机甲");
        addSettingsToggle(currentNode, "buildingMechsFirst", "是否在建造尖塔建筑之前先填满剩余的机舱空间", "在花费资源建造尖塔建筑之前，先建造机甲填满剩余的机舱空间");
        addSettingsToggle(currentNode, "mechBaysFirst", "是否在解体机甲之前先最大化建造机甲舱", "只在无法建造机甲舱和空气净化器时解体机甲");

        addStandardHeading(currentNode, "机甲属性计算");
        let statsControls = $(`<div style="margin-top: 5px; display: inline-flex;"></div>`);
        Object.entries({Compact: true, Efficient: true, Special: true, Gravity: false}).forEach(([option, value]) => {
            statsControls.append(`
              <label class="switch" title="用于下方计算">
                <input id="script_mechStats${option}" type="checkbox"${value ? " checked" : ""}>
                <span class="check"></span><span style="margin-left: 10px;">${{Compact: "小型化", Efficient: "补给中", Special: "特殊", Gravity: "重力"}[option]}</span>
              </label>`);
        });
        statsControls.append(`
          <label class="switch" title="用于下方计算">
            <input id="script_mechStatsScouts" class="input is-small" style="height: 25px; width: 50px" type="text" value="0">
            <span style="margin-left: 10px;">侦察机甲</span>
          </label>`);
        statsControls.on('input', calculateMechStats);
        currentNode.append(statsControls);
        currentNode.append(`<table class="selectable"><tbody id="script_mechStatsTable"><tbody></table>`);
        calculateMechStats();

        document.documentElement.scrollTop = document.body.scrollTop = currentScrollPosition;
    }

    function calculateMechStats() {
        let cellInfo = '<td><span class="has-text-info">';
        let cellWarn = '<td><span class="has-text-warning">';
        let cellAdv = '<td><span class="has-text-advanced">';
        let cellEnd = '</span></td>';
        let content = "";

        let special = document.getElementById('script_mechStatsSpecial').checked;
        let gravity = document.getElementById('script_mechStatsGravity').checked;
        let efficient = document.getElementById('script_mechStatsEfficient').checked;
        let scouts = parseInt(document.getElementById("script_mechStatsScouts").value) || 0;
        let prepared = document.getElementById('script_mechStatsCompact').checked ? 2 : 0;

        let smallFactor = efficient ? 1 : average(Object.values(MechManager.SmallChassisMod).reduce((list, mod) => list.concat(Object.values(mod)), []));
        let largeFactor = efficient ? 1 : average(Object.values(MechManager.LargeChassisMod).reduce((list, mod) => list.concat(Object.values(mod)), []));
        let weaponFactor = efficient ? 1 : average(Object.values(poly.monsters).reduce((list, mod) => list.concat(Object.values(mod.weapon)), []));

        let rows = [[""], ["每空间战斗力"], ["每补给战斗力(新)"], ["每宝石战斗力(新)"], ["每补给战斗力(重新制造)"], ["每宝石战斗力(重新制造)"]];
        for (let i = 0; i < MechManager.Size.length - 1; i++) { // Exclude collectors
            let mech = {size: MechManager.Size[i], equip: special ? ['special'] : []};

            let basePower = MechManager.getSizeMod(mech, false);
            let statusMod = gravity ? MechManager.StatusMod.gravity(mech) : 1;
            let terrainMod = poly.terrainRating(mech, i < 2 ? smallFactor : largeFactor, gravity ? ['gravity'] : [], scouts);
            let weaponMod = poly.weaponPower(mech, weaponFactor) * MechManager.SizeWeapons[mech.size];
            let power = basePower * statusMod * terrainMod * weaponMod;

            let [gems, cost, space] = MechManager.getMechCost(mech, prepared);
            let [gemsRef, costRef] = MechManager.getMechRefund(mech, prepared);

            rows[0].push(game.loc("portal_mech_size_" + mech.size));
            rows[1].push((power / space * 100).toFixed(4));
            rows[2].push((power / (cost / 100000) * 100).toFixed(4));
            rows[3].push((power / gems * 100).toFixed(4));
            rows[4].push((power / ((cost - costRef) / 100000) * 100).toFixed(4));
            rows[5].push((power / (gems - gemsRef) * 100).toFixed(4));
        }
        rows.forEach((line, index) => content += "<tr>" + (index === 0 ? cellWarn : cellAdv) + line.join("&nbsp;" + cellEnd + (index === 0 ? cellAdv : cellInfo)) + cellEnd + "</tr>");
        $("#script_mechStatsTable").html(content);
    }

    function buildEjectorSettings() {
        let sectionId = "ejector";
        let sectionName = "质量喷射、补给及纳米体";

        let resetFunction = function() {
            resetEjectorSettings(true);
            updateSettingsFromState();
            updateEjectorSettingsContent();

            resetCheckbox("autoEject", "autoSupply", "autoNanite");
            removeEjectToggles();
            removeSupplyToggles();
        };

        buildSettingsSection(sectionId, sectionName, resetFunction, updateEjectorSettingsContent);
    }

    function updateEjectorSettingsContent() {
        let currentScrollPosition = document.documentElement.scrollTop || document.body.scrollTop;

        let currentNode = $('#script_ejectorContent');
        currentNode.empty().off("*");

        let spendOptions = [{val: "cap", label: "达到上限", hint: "使用达到上限的资源"},
                            {val: "excess", label: "多余", hint: "使用多余的资源"},
                            {val: "all", label: "所有", hint: "使用所有的资源。使用此项后可能会导致脚本进度卡顿，请谨慎使用。"},
                            {val: "mixed", label: "上限 > 多余", hint: "首先使用达到上限的资源，如果资源不足，再使用多余的资源。"},
                            {val: "full", label: "上限 > 多余 > 所有", hint: "首先使用达到上限的资源，然后使用多余的资源，最后再使用所有的资源。请注意使用此项带来的风险。"}];
        let spendDesc = "设置脚本使用资源的阈值。无论使用什么选项，脚本都会优先考虑价值最高的资源。若选择的是锻造物，则阈值永远为多余模式，因为它们没有上限。";
        addSettingsSelect(currentNode, "ejectMode", "质量喷射模式", spendDesc, spendOptions);
        addSettingsSelect(currentNode, "supplyMode", "补给模式", spendDesc, spendOptions);
        addSettingsSelect(currentNode, "naniteMode", "纳米体模式", spendDesc, spendOptions);
        addSettingsToggle(currentNode, "prestigeWhiteholeStabiliseMass", "是否稳定黑洞", "一直选择稳定黑洞，进行黑洞重置时无效");

        currentNode.append(`
          <table style="width:100%">
            <tr>
              <th class="has-text-warning" style="width:20%">资源名称</th>
              <th class="has-text-warning" style="width:20%">原子质量</th>
              <th class="has-text-warning" style="width:10%">允许喷射</th>
              <th class="has-text-warning" style="width:10%">纳米体用</th>
              <th class="has-text-warning" style="width:30%">补给价值</th>
              <th class="has-text-warning" style="width:10%">允许补给</th>
            </tr>
            <tbody id="script_ejectorTableBody"></tbody>
          </table>`);

        let tableBodyNode = $('#script_ejectorTableBody');
        let newTableBodyText = "";

        let tabResources = [];
        for (let id in resources) {
            let resource = resources[id];
            if (EjectManager.isConsumable(resource) || SupplyManager.isConsumable(resource) || NaniteManager.isConsumable(resource)) {
                tabResources.push(resource);
                newTableBodyText += `<tr><td id="script_eject_${resource.id}" style="width:20%"></td><td style="width:20%"></td><td style="width:10%"></td><td style="width:10%"></td><td style="width:30%"></td><td style="width:10%"></td></tr>`;
            }
        }

        tableBodyNode.append($(newTableBodyText));

        for (let i = 0; i < tabResources.length; i++) {
            let resource = tabResources[i];
            let ejectElement = $('#script_eject_' + resource.id);

            let color = (resource === resources.Elerium || resource === resources.Infernite) ? "has-text-caution" :
                resource.isCraftable() ? "has-text-danger" :
                !resource.isTradable() ? "has-text-advanced" :
                "has-text-info";

            ejectElement.append(buildTableLabel(resource.name, "", color));
            ejectElement = ejectElement.next();

            if (resource.atomicMass > 0) {
                ejectElement.append(`<span class="mass"><span class="has-text-warning">${resource.atomicMass}</span> kt</span>`);
            }
            ejectElement = ejectElement.next();

            if (EjectManager.isConsumable(resource)) {
                addTableToggle(ejectElement, "res_eject" + resource.id);
            }
            ejectElement = ejectElement.next();

            if (NaniteManager.isConsumable(resource)) {
                addTableToggle(ejectElement, "res_nanite" + resource.id);
            }

            if (SupplyManager.isConsumable(resource)) {
                ejectElement = ejectElement.next();
                ejectElement.append(`<span class="mass">使用<span class="has-text-caution">${SupplyManager.supplyOut(resource.id)}</span>，获得<span class="has-text-success">${SupplyManager.supplyIn(resource.id)}</span></span>`);

                ejectElement = ejectElement.next();
                addTableToggle(ejectElement, "res_supply" + resource.id);
            }
        }

        document.documentElement.scrollTop = document.body.scrollTop = currentScrollPosition;
    }

    function buildMarketSettings() {
        let sectionId = "market";
        let sectionName = "市场";

        let resetFunction = function() {
            resetMarketSettings(true);
            updateSettingsFromState();
            updateMarketSettingsContent();

            resetCheckbox("autoMarket", "autoGalaxyMarket");
            removeMarketToggles();
        };

        buildSettingsSection(sectionId, sectionName, resetFunction, updateMarketSettingsContent);
    }

    function updateMarketSettingsContent() {
        let currentScrollPosition = document.documentElement.scrollTop || document.body.scrollTop;

        let currentNode = $('#script_marketContent');
        currentNode.empty().off("*");

        addSettingsNumber(currentNode, "minimumMoney", "手动贸易保留的资金数量", "批量购买后至少保留相应的资金数量");
        addSettingsNumber(currentNode, "minimumMoneyPercentage", "手动贸易保留的资金比例", "批量购买后至少保留相应的资金比例");
        addSettingsNumber(currentNode, "tradeRouteMinimumMoneyPerSecond", "贸易允许的每秒资金收入最低值", "两项中较高的数值生效。达到每秒资金收入最低值后，才会购买资源");
        addSettingsNumber(currentNode, "tradeRouteMinimumMoneyPercentage", "贸易允许的每秒资金收入最低比例", "两项中较高的数值生效。达到每秒资金收入最低比例后，才会购买资源");
        addSettingsToggle(currentNode, "tradeRouteSellExcess", "是否出售多余的资源", "开启后将在建造或研究不需要的时候出售相应的资源，否则只会在接近上限时出售。同时，购买相应资源时也有会类似限制，以避免进入购买-出售的死循环。");

        currentNode.append(`
          <table style="width:100%">
            <tr>
              <th class="has-text-warning" colspan="1"></th>
              <th class="has-text-warning" colspan="4">手动贸易</th>
              <th class="has-text-warning" colspan="4">贸易路线</th>
              <th class="has-text-warning" colspan="1"></th>
            </tr>
            <tr>
              <th class="has-text-warning" style="width:15%">资源名称</th>
              <th class="has-text-warning" style="width:10%">购买</th>
              <th class="has-text-warning" style="width:10%">比例</th>
              <th class="has-text-warning" style="width:10%">出售</th>
              <th class="has-text-warning" style="width:10%">比例</th>
              <th class="has-text-warning" style="width:10%">购买用路线数</th>
              <th class="has-text-warning" style="width:10%">出售用路线数</th>
              <th class="has-text-warning" style="width:10%">权重</th>
              <th class="has-text-warning" style="width:10%">优先级</th>
              <th style="width:5%"></th>
            </tr>
            <tbody id="script_marketTableBody"></tbody>
          </table>`);

        let tableBodyNode = $('#script_marketTableBody');
        let newTableBodyText = "";

        for (let i = 0; i < MarketManager.priorityList.length; i++) {
            const resource = MarketManager.priorityList[i];
            newTableBodyText += `<tr value="${resource.id}" class="script-draggable"><td id="script_market_${resource.id}" style="width:15%"></td><td style="width:10%"></td><td style="width:10%"></td><td style="width:10%"></td><td style="width:10%"></td><td style="width:10%"></td><td style="width:10%"></td><td style="width:10%"></td><td style="width:10%"></td><td style="width:5%"><span class="script-lastcolumn"></span></td></tr>`;
        }
        tableBodyNode.append($(newTableBodyText));

        // Build all other markets settings rows
        for (let i = 0; i < MarketManager.priorityList.length; i++) {
            const resource = MarketManager.priorityList[i];
            let marketElement = $('#script_market_' + resource.id);

            marketElement.append(buildTableLabel(resource.name));

            marketElement = marketElement.next();
            addTableToggle(marketElement, "buy" + resource.id);

            marketElement = marketElement.next();
            addTableInput(marketElement, "res_buy_r_" + resource.id);

            marketElement = marketElement.next();
            addTableToggle(marketElement, "sell" + resource.id);

            marketElement = marketElement.next();
            addTableInput(marketElement, "res_sell_r_" + resource.id);

            marketElement = marketElement.next();
            addTableToggle(marketElement, "res_trade_buy_" + resource.id);

            marketElement = marketElement.next();
            addTableToggle(marketElement, "res_trade_sell_" + resource.id);

            marketElement = marketElement.next();
            addTableInput(marketElement, "res_trade_w_" + resource.id);

            marketElement = marketElement.next();
            addTableInput(marketElement, "res_trade_p_" + resource.id);
        }

        tableBodyNode.sortable({
            items: "tr:not(.unsortable)",
            helper: sorterHelper,
            update: function() {
                let marketIds = tableBodyNode.sortable('toArray', {attribute: 'value'});
                for (let i = 0; i < marketIds.length; i++) {
                    settingsRaw["res_buy_p_" + marketIds[i]] = i;
                }

                MarketManager.sortByPriority();
                updateSettingsFromState();
            },
        });

        addStandardHeading(currentNode, "星际贸易");
        addSettingsNumber(currentNode, "marketMinIngredients", "原料保底产量", "星际贸易只在所有出售的材料都高于保底产量时购买相应资源");

        currentNode.append(`
          <table style="width:100%">
            <tr>
              <th class="has-text-warning" style="width:30%">购买</th>
              <th class="has-text-warning" style="width:30%">出售</th>
              <th class="has-text-warning" style="width:20%">权重</th>
              <th class="has-text-warning" style="width:20%">优先级</th>
            </tr>
            <tbody id="script_marketGalaxyTableBody"></tbody>
          </table>`);

        tableBodyNode = $('#script_marketGalaxyTableBody');
        newTableBodyText = "";

        for (let i = 0; i < poly.galaxyOffers.length; i++) {
            newTableBodyText += `<tr><td id="script_market_galaxy_${i}" style="width:30%"><td style="width:30%"></td></td><td style="width:20%"></td><td style="width:20%"></td></tr>`;
        }
        tableBodyNode.append($(newTableBodyText));

        // Build all other productions settings rows
        for (let i = 0; i < poly.galaxyOffers.length; i++) {
            let trade = poly.galaxyOffers[i];
            let buyResource = resources[trade.buy.res];
            let sellResource = resources[trade.sell.res];
            let marketElement = $('#script_market_galaxy_' + i);

            marketElement.append(buildTableLabel(buyResource.name, "has-text-success"));

            marketElement = marketElement.next();
            marketElement.append(buildTableLabel(sellResource.name, "has-text-danger"));

            marketElement = marketElement.next();
            addTableInput(marketElement, "res_galaxy_w_" + buyResource.id);

            marketElement = marketElement.next();
            addTableInput(marketElement, "res_galaxy_p_" + buyResource.id);
       }

        document.documentElement.scrollTop = document.body.scrollTop = currentScrollPosition;
    }

    function buildStorageSettings() {
        let sectionId = "storage";
        let sectionName = "存储";

        let resetFunction = function() {
            resetStorageSettings(true);
            updateSettingsFromState();
            updateStorageSettingsContent();

            resetCheckbox("autoStorage");
            removeStorageToggles();
        };

        buildSettingsSection(sectionId, sectionName, resetFunction, updateStorageSettingsContent);
    }

    function updateStorageSettingsContent() {
        let currentScrollPosition = document.documentElement.scrollTop || document.body.scrollTop;

        let currentNode = $('#script_storageContent');
        currentNode.empty().off("*");

        addSettingsToggle(currentNode, "storageLimitPreMad", "限制核弹重置之前阶段的存储", "限制核弹重置之前阶段的存储来节省资源和相应时间");
        addSettingsToggle(currentNode, "storageSafeReassign", "只在板条箱或集装箱有空余时进行重新分配", "直到相应的板条箱或集装箱未装有相应资源时才考虑将它重新分配给其他资源，以防止资源溢出浪费");
        addSettingsToggle(currentNode, "storageAssignExtra", "是否分配缓冲用的存储", "以超过需要数值的3%进行分配，以保证能达到所需要的数值，以避免脚本其他功能的干扰。");
        addSettingsToggle(currentNode, "storagePrioritizedOnly", "根据每种建筑分配存储", "根据启用的建筑每一个的花费来分配存储，而不是考虑总量来分配。可以优先对触发器或队列等所需要的资源分配存储，并可以跳过超过储量上限的建筑。实验性的功能。");

        currentNode.append(`
          <table style="width:100%">
            <tr>
              <th class="has-text-warning" style="width:35%">资源名称</th>
              <th class="has-text-warning" style="width:15%">是否启用</th>
              <th class="has-text-warning" style="width:15%">是否对溢出部分分配存储</th>
              <th class="has-text-warning" style="width:15%">最大板条箱</th>
              <th class="has-text-warning" style="width:15%">最大集装箱</th>
              <th style="width:5%"></th>
            </tr>
            <tbody id="script_storageTableBody"></tbody>
          </table>`);

        let tableBodyNode = $('#script_storageTableBody');
        let newTableBodyText = "";

        for (let i = 0; i < StorageManager.priorityList.length; i++) {
            const resource = StorageManager.priorityList[i];
            newTableBodyText += `<tr value="${resource.id}" class="script-draggable"><td id="script_storage_${resource.id}" style="width:35%"></td><td style="width:15%"></td><td style="width:15%"></td><td style="width:15%"></td><td style="width:15%"></td><td style="width:5%"><span class="script-lastcolumn"></span></td></tr>`;
        }
        tableBodyNode.append($(newTableBodyText));

        // Build all other storages settings rows
        for (let i = 0; i < StorageManager.priorityList.length; i++) {
            const resource = StorageManager.priorityList[i];
            let storageElement = $('#script_storage_' + resource.id);

            storageElement.append(buildTableLabel(resource.name));

            storageElement = storageElement.next();
            addTableToggle(storageElement, "res_storage" + resource.id);

            storageElement = storageElement.next();
            addTableToggle(storageElement, "res_storage_o_" + resource.id);

            storageElement = storageElement.next();
            addTableInput(storageElement, "res_crates_m_" + resource.id);

            storageElement = storageElement.next();
            addTableInput(storageElement, "res_containers_m_" + resource.id);
        }

        tableBodyNode.sortable({
            items: "tr:not(.unsortable)",
            helper: sorterHelper,
            update: function() {
                let storageIds = tableBodyNode.sortable('toArray', {attribute: 'value'});
                for (let i = 0; i < storageIds.length; i++) {
                    settingsRaw['res_storage_p_' + storageIds[i]] = i;
                }

                StorageManager.sortByPriority();
                updateSettingsFromState();
            },
        });

        document.documentElement.scrollTop = document.body.scrollTop = currentScrollPosition;
    }

    function buildMinorTraitSettings() {
        let sectionId = "minorTrait";
        let sectionName = "次要特质";

        let resetFunction = function() {
            resetMinorTraitSettings(true);
            updateSettingsFromState();
            updateMinorTraitSettingsContent();

            resetCheckbox("autoMinorTrait");
        };

        buildSettingsSection(sectionId, sectionName, resetFunction, updateMinorTraitSettingsContent);
    }

    function updateMinorTraitSettingsContent() {
        let currentScrollPosition = document.documentElement.scrollTop || document.body.scrollTop;

        let currentNode = $('#script_minorTraitContent');
        currentNode.empty().off("*");

        let genusOptions = [{val: "ignore", label: "忽略", hint: "不变换种群"},
                            {val: "none", label: game.loc(`genelab_genus_none`)},
                            ...Object.values(game.races).map(r => r.type).filter((g, i, a) => g && g !== "organism" && g !== "synthetic" && a.indexOf(g) === i).map(g => (
                            {val: g, label: game.loc(`genelab_genus_${g}`)}))];
        addSettingsSelect(currentNode, "shifterGenus", "拟态种群", "拟态特质选择相应种群。如果您想要对此项进行进阶设置，请注意切换拟态特质将刷新游戏页面，切换过于频繁将影响游戏运行。", genusOptions);

        currentNode.append(`
          <table style="width:100%">
            <tr>
              <th class="has-text-warning" style="width:20%">次要特质</th>
              <th class="has-text-warning" style="width:20%">是否启用</th>
              <th class="has-text-warning" style="width:20%">权重</th>
              <th class="has-text-warning" style="width:40%"></th>
            </tr>
            <tbody id="script_minorTraitTableBody"></tbody>
          </table>`);

        let tableBodyNode = $('#script_minorTraitTableBody');
        let newTableBodyText = "";

        for (let i = 0; i < MinorTraitManager.priorityList.length; i++) {
            const trait = MinorTraitManager.priorityList[i];
            newTableBodyText += `<tr value="${trait.traitName}" class="script-draggable"><td id="script_minorTrait_${trait.traitName}" style="width:20%"></td><td style="width:20%"></td><td style="width:20%"></td><td style="width:40%"><span class="script-lastcolumn"></span></td></tr>`;
        }
        tableBodyNode.append($(newTableBodyText));

        // Build all other minorTraits settings rows
        for (let i = 0; i < MinorTraitManager.priorityList.length; i++) {
            const trait = MinorTraitManager.priorityList[i];
            let minorTraitElement = $('#script_minorTrait_' + trait.traitName);

            minorTraitElement.append(buildTableLabel(game.loc("trait_" + trait.traitName + "_name"), game.loc("trait_" + trait.traitName)));

            minorTraitElement = minorTraitElement.next();
            addTableToggle(minorTraitElement, "mTrait_" + trait.traitName);

            minorTraitElement = minorTraitElement.next();
            addTableInput(minorTraitElement, "mTrait_w_" + trait.traitName);
        }

        tableBodyNode.sortable({
            items: "tr:not(.unsortable)",
            helper: sorterHelper,
            update: function() {
                let minorTraitNames = tableBodyNode.sortable('toArray', {attribute: 'value'});
                for (let i = 0; i < minorTraitNames.length; i++) {
                    settingsRaw['mTrait_p_' + minorTraitNames[i]] = i;
                }

                MinorTraitManager.sortByPriority();
                updateSettingsFromState();
            },
        });

        document.documentElement.scrollTop = document.body.scrollTop = currentScrollPosition;
    }

    function buildMagicSettings() {
        let sectionId = "magic";
        let sectionName = "魔法";

        let resetFunction = function() {
            resetMagicSettings(true);
            updateSettingsFromState();
            updateMagicSettingsContent();

            resetCheckbox("autoAlchemy", "autoPylon");
        };

        buildSettingsSection(sectionId, sectionName, resetFunction, updateMagicSettingsContent);
    }

    function updateMagicSettingsContent() {
        let currentScrollPosition = document.documentElement.scrollTop || document.body.scrollTop;

        let currentNode = $('#script_magicContent');
        currentNode.empty().off("*");

        updateMagicAlchemy(currentNode);
        updateMagicPylon(currentNode);

        document.documentElement.scrollTop = document.body.scrollTop = currentScrollPosition;
    }

    function updateMagicAlchemy(currentNode) {
        addStandardHeading(currentNode, "炼金术");
        addSettingsNumber(currentNode, "magicAlchemyManaUse", "法力产量使用的比例", "炼金术使用的法力产量比例。不建议设为1。剩余的法力将用于仪式。");

        currentNode.append(`
          <table style="width:100%">
            <tr>
              <th class="has-text-warning" style="width:20%">资源名称</th>
              <th class="has-text-warning" style="width:20%">是否启用</th>
              <th class="has-text-warning" style="width:20%">权重</th>
              <th class="has-text-warning" style="width:40%"></th>
            </tr>
            <tbody id="script_alchemyTableBody"></tbody>
          </table>`);

        let tableBodyNode = $('#script_alchemyTableBody');
        let newTableBodyText = "";

        for (let resource of AlchemyManager.priorityList) {
            newTableBodyText += `<tr><td id="script_alchemy_${resource.id}" style="width:20%"></td><td style="width:20%"></td><td style="width:20%"></td><td style="width:40%"></td></tr>`;
        }
        tableBodyNode.append($(newTableBodyText));

        for (let resource of AlchemyManager.priorityList) {
            let node = $('#script_alchemy_' + resource.id);

            let color = AlchemyManager.transmuteTier(resource) > 1 ? "has-text-advanced" : "has-text-info";
            node.append(buildTableLabel(resource.name, "", color));

            node = node.next();
            addTableToggle(node, "res_alchemy_" + resource.id);

            node = node.next();
            addTableInput(node, "res_alchemy_w_" + resource.id);
        }
    }

    function buildProductionSettings() {
        let sectionId = "production";
        let sectionName = "生产";

        let resetFunction = function() {
            resetProductionSettings(true);
            updateSettingsFromState();
            updateProductionSettingsContent();

            resetCheckbox("autoQuarry", "autoGraphenePlant", "autoSmelter", "autoCraft", "autoFactory", "autoMiningDroid");
            removeCraftToggles();
        };

        buildSettingsSection(sectionId, sectionName, resetFunction, updateProductionSettingsContent);
    }

    function updateProductionSettingsContent() {
        let currentScrollPosition = document.documentElement.scrollTop || document.body.scrollTop;

        let currentNode = $('#script_productionContent');
        currentNode.empty().off("*");

        addSettingsNumber(currentNode, "productionChrysotileWeight", "温石棉权重", "自动温石棉控制使用的权重，根据当前的石头和温石棉差值来应用权重");
        updateProductionTableSmelter(currentNode);
        updateProductionTableFoundry(currentNode);
        updateProductionTableFactory(currentNode);
        updateProductionTableMiningDrone(currentNode);

        document.documentElement.scrollTop = document.body.scrollTop = currentScrollPosition;
    }

    function updateProductionTableSmelter(currentNode) {
        addStandardHeading(currentNode, "冶炼厂");

        let smelterOptions = [{val: "iron", label: "优先熔炼铁", hint: "只冶炼铁，直到铁达到存储上限，再切换为冶炼钢"},
                              {val: "steel", label: "优先熔炼钢", hint: "只冶炼钢，直到钢达到存储上限，再切换为冶炼铁"},
                              {val: "storage", label: "直到达到上限", hint: "以一定的比例同时冶炼铁和钢，保证它们同时达到存储上限"},
                              {val: "required", label: "直到达到需求数量", hint: "以一定的比例同时冶炼铁和钢，保证它们同时达到建筑的需求"}];
        addSettingsSelect(currentNode, "productionSmelting", "冶炼厂生产", "冶炼厂冶炼铁和钢的方式", smelterOptions);
        addSettingsNumber(currentNode, "productionSmeltingIridium", "铱冶炼比例(智械黎明模式)", "用于冶炼铱的比例");

        currentNode.append(`
          <table style="width:100%">
            <tr>
              <th class="has-text-warning" style="width:95%">燃料使用顺序</th>
              <th style="width:5%"></th>
            </tr>
            <tbody id="script_productionTableBodySmelter"></tbody>
          </table>`);

        let tableBodyNode = $('#script_productionTableBodySmelter');
        let newTableBodyText = "";

        let smelterFuels = SmelterManager.managedFuelPriorityList();

        for (let i = 0; i < smelterFuels.length; i++) {
            let fuel = smelterFuels[i];
            newTableBodyText += `<tr value="${fuel.id}" class="script-draggable"><td id="script_smelter_${fuel.id}" style="width:95%"></td><td style="width:5%"><span class="script-lastcolumn"></span></td></tr>`;
        }
        tableBodyNode.append($(newTableBodyText));

        // Build all other productions settings rows
        for (let i = 0; i < smelterFuels.length; i++) {
            let fuel = smelterFuels[i];
            let productionElement = $('#script_smelter_' + fuel.id);

            productionElement.append(buildTableLabel({"Oil":"石油","Coal":"煤","Wood":"木材","Star":"星辰","Inferno":"地狱燃料"}[fuel.id]));
        }

        tableBodyNode.sortable({
            items: "tr:not(.unsortable)",
            helper: sorterHelper,
            update: function() {
                let fuelIds = tableBodyNode.sortable('toArray', {attribute: 'value'});
                for (let i = 0; i < fuelIds.length; i++) {
                    settingsRaw["smelter_fuel_p_" + fuelIds[i]] = i;
                }

                updateSettingsFromState();
            },
        });
    }

    function updateProductionTableFactory(currentNode) {
        addStandardHeading(currentNode, "工厂");
        addSettingsNumber(currentNode, "productionFactoryMinIngredients", "原料保底产量", "工厂只在所有需要的材料都高于保底产量时制造相应产品");

        currentNode.append(`
          <table style="width:100%">
            <tr>
              <th class="has-text-warning" style="width:35%">资源名称</th>
              <th class="has-text-warning" style="width:20%">是否启用</th>
              <th class="has-text-warning" style="width:20%">权重</th>
              <th class="has-text-warning" style="width:20%">优先级</th>
              <th style="width:5%"></th>
            </tr>
            <tbody id="script_productionTableBodyFactory"></tbody>
          </table>`);

        let tableBodyNode = $('#script_productionTableBodyFactory');
        let newTableBodyText = "";

        let productionSettings = Object.values(FactoryManager.Productions);

        for (let i = 0; i < productionSettings.length; i++) {
            let production = productionSettings[i];
            newTableBodyText += `<tr><td id="script_factory_${production.resource.id}" style="width:35%"></td><td style="width:20%"></td><td style="width:20%"></td><td style="width:20%"></td><td style="width:5%"></td></tr>`;
        }
        tableBodyNode.append($(newTableBodyText));

        // Build all other productions settings rows
        for (let i = 0; i < productionSettings.length; i++) {
            let production = productionSettings[i];
            let productionElement = $('#script_factory_' + production.resource.id);

            productionElement.append(buildTableLabel(production.resource.name));

            productionElement = productionElement.next();
            addTableToggle(productionElement, "production_" + production.resource.id);

            productionElement = productionElement.next();
            addTableInput(productionElement, "production_w_" + production.resource.id);

            productionElement = productionElement.next();
            addTableInput(productionElement, "production_p_" + production.resource.id);
        }
    }

    function updateProductionTableFoundry(currentNode) {
        addStandardHeading(currentNode, "铸造厂");
        let weightingOptions = [{val: "none", label: "None", hint: "按照正常的权重制造。2倍权重的锻造物将比1倍权重的锻造物多制造1倍，以此类推。"},
                                {val: "demanded", label: "优先制造需要的", hint: "当锻造物储量超过花费最高的建筑时忽略相应锻造物，直到所有锻造物都超过了相应数值。之后与上方“无”选项效果相同。"},
                                {val: "buildings", label: "按建筑权重", hint: "使用需要锻造物建筑的权重，计入锻造物的权重。需要开启自动建筑此项才能生效。"}];
        addSettingsSelect(currentNode, "productionFoundryWeighting", "锻造物权重", "控制锻造物与其他资源相比的权重", weightingOptions);

        currentNode.append(`
          <table style="width:100%">
            <tr>
              <th class="has-text-warning" style="width:35%">资源名称</th>
              <th class="has-text-warning" style="width:20%">是否启用</th>
              <th class="has-text-warning" style="width:20%" title="Ratio between resources. Script assign craftsmans to resource with lowest 'amount / weighting'. Ignored by manual crafting.">权重</th>
              <th class="has-text-warning" style="width:20%" title="Only craft resource when storage ratio of all required materials above given number. E.g. bricks with 0.1 min materials will be crafted only when cement storage at least 10% filled.">Min Materials</th>
              <th style="width:5%"></th>
            </tr>
            <tbody id="script_productionTableBodyFoundry"></tbody>
          </table>`);

        let tableBodyNode = $('#script_productionTableBodyFoundry');
        let newTableBodyText = "";

        for (let i = 0; i < craftablesList.length; i++) {
            let resource = craftablesList[i];
            newTableBodyText += `<tr><td id="script_foundry_${resource.id}" style="width:35%"></td><td style="width:20%"></td><td style="width:20%"></td><td style="width:20%"></td><td style="width:5%"></td></tr>`;
        }
        tableBodyNode.append($(newTableBodyText));

        // Build all other productions settings rows
        for (let i = 0; i < craftablesList.length; i++) {
            let resource = craftablesList[i];
            let productionElement = $('#script_foundry_' + resource.id);

            productionElement.append(buildTableLabel(resource.name));

            // TODO: Make two toggles, for manual craft and foundry
            productionElement = productionElement.next();
            addTableToggle(productionElement, "craft" + resource.id);

            productionElement = productionElement.next();
            if (resource === resources.Scarletite || resource === resources.Quantium) {
                productionElement.append('<span>脚本自动管理</span>');
            } else {
                addTableInput(productionElement, "foundry_w_" + resource.id);
            }

            productionElement = productionElement.next();
            addTableInput(productionElement, "foundry_p_" + resource.id);
        }
    }

    function updateProductionTableMiningDrone(currentNode) {
        addStandardHeading(currentNode, "采矿机器人");

        currentNode.append(`
          <table style="width:100%">
            <tr>
              <th class="has-text-warning" style="width:35%">资源名称</th>
              <th class="has-text-warning" style="width:20%"></th>
              <th class="has-text-warning" style="width:20%">权重</th>
              <th class="has-text-warning" style="width:20%">优先级</th>
              <th style="width:5%"></th>
            </tr>
            <tbody id="script_productionTableBodyMiningDrone"></tbody>
          </table>`);

        let tableBodyNode = $('#script_productionTableBodyMiningDrone');
        let newTableBodyText = "";

        let droidProducts = Object.values(DroidManager.Productions);

        for (let i = 0; i < droidProducts.length; i++) {
            let production = droidProducts[i];
            newTableBodyText += `<tr><td id="script_droid_${production.resource.id}" style="width:35%"><td style="width:20%"></td><td style="width:20%"></td></td><td style="width:20%"></td><td style="width:5%"></td></tr>`;
        }
        tableBodyNode.append($(newTableBodyText));

        // Build all other productions settings rows
        for (let i = 0; i < droidProducts.length; i++) {
            let production = droidProducts[i];
            let productionElement = $('#script_droid_' + production.resource.id);

            productionElement.append(buildTableLabel(production.resource.name));

            productionElement = productionElement.next().next();
            addTableInput(productionElement, "droid_w_" + production.resource.id);

            productionElement = productionElement.next();
            addTableInput(productionElement, "droid_pr_" + production.resource.id);
        }
    }

    function updateMagicPylon(currentNode) {
        addStandardHeading(currentNode, "水晶塔");
        addSettingsNumber(currentNode, "productionRitualManaUse", "法力产量使用的比例", "仪式使用的法力产量比例。不建议设为1，这样会使法力产量为零。只在法力未达到上限时生效，达到上限后将使用所有法力产量。");

        currentNode.append(`
          <table style="width:100%">
            <tr>
              <th class="has-text-warning" style="width:55%">仪式</th>
              <th class="has-text-warning" style="width:20%">权重</th>
              <th style="width:25%"></th>
            </tr>
            <tbody id="script_magicTableBodyPylon"></tbody>
          </table>`);

        let tableBodyNode = $('#script_magicTableBodyPylon');
        let newTableBodyText = "";

        let pylonProducts = Object.values(RitualManager.Productions);

        for (let i = 0; i < pylonProducts.length; i++) {
            let production = pylonProducts[i];
            newTableBodyText += `<tr><td id="script_pylon_${production.id}" style="width:55%"></td><td style="width:20%"></td><td style="width:25%"></td></tr>`;
        }
        tableBodyNode.append($(newTableBodyText));

        // Build all other productions settings rows
        for (let i = 0; i < pylonProducts.length; i++) {
            let production = pylonProducts[i];
            let productionElement = $('#script_pylon_' + production.id);

            productionElement.append(buildTableLabel(game.loc(`modal_pylon_spell_${production.id}`)));

            productionElement = productionElement.next();
            addTableInput(productionElement, "spell_w_" + production.id);
        }
    }

    function buildJobSettings() {
        let sectionId = "job";
        let sectionName = "工作";

        let resetFunction = function() {
            resetJobSettings(true);
            updateSettingsFromState();
            updateJobSettingsContent();

            resetCheckbox("autoJobs", "autoCraftsmen");
        };

        buildSettingsSection(sectionId, sectionName, resetFunction, updateJobSettingsContent);
    }

    function updateJobSettingsContent() {
        let currentScrollPosition = document.documentElement.scrollTop || document.body.scrollTop;

        let currentNode = $('#script_jobContent');
        currentNode.empty().off("*");

        addSettingsToggle(currentNode, "jobSetDefault", "设置默认工作", "自动以石工->伐木工人->水晶矿工->清道夫->猎人->农民的顺序设置默认工作");
        addSettingsNumber(currentNode, "jobLumberWeighting", "最终伐木工人权重", "用于分配伐木工人，石工，水晶矿工和清道夫的数量");
        addSettingsNumber(currentNode, "jobQuarryWeighting", "最终石工权重", "用于分配伐木工人，石工，水晶矿工和清道夫的数量");
        addSettingsNumber(currentNode, "jobCrystalWeighting", "最终水晶矿工权重", "用于分配伐木工人，石工，水晶矿工和清道夫的数量");
        addSettingsNumber(currentNode, "jobScavengerWeighting", "最终清道夫权重", "用于分配伐木工人，石工，水晶矿工和清道夫的数量");
        addSettingsToggle(currentNode, "jobDisableMiners", "到达仙女座星系以后禁用矿工", "到达仙女座星系以后禁用矿工和煤矿工人");
        addSettingsToggle(currentNode, "jobDisableCraftsmans", "如果可以的话，手动进行锻造", "如果可以手动进行锻造，则禁用可手动锻造资源的所有工匠");

        currentNode.append(`
          <table style="width:100%">
            <tr>
              <th class="has-text-warning" style="width:35%">工作</th>
              <th class="has-text-warning" style="width:20%">第一阈值</th>
              <th class="has-text-warning" style="width:20%">第二阈值</th>
              <th class="has-text-warning" style="width:20%">最终阈值</th>
              <th style="width:5%"></th>
            </tr>
            <tbody id="script_jobTableBody"></tbody>
          </table>`);

        let tableBodyNode = $('#script_jobTableBody');
        let newTableBodyText = "";

        for (let i = 0; i < JobManager.priorityList.length; i++) {
            const job = JobManager.priorityList[i];
            let classAttribute = (job === jobs.Farmer || job === jobs.Hunter || job === jobs.Unemployed) ? ' class="unsortable"' : ' class="script-draggable"';
            newTableBodyText += `<tr value="${job._originalId}"${classAttribute}><td id="script_${job._originalId}" style="width:35%"></td><td style="width:20%"></td><td style="width:20%"></td><td style="width:20%"></td><td style="width:5%"></td></tr>`;
        }
        tableBodyNode.append($(newTableBodyText));

        for (let i = 0; i < JobManager.priorityList.length; i++) {
            const job = JobManager.priorityList[i];
            let jobElement = $('#script_' + job._originalId);

            buildJobSettingsToggle(jobElement, job);
            jobElement = jobElement.next();
            buildJobSettingsInput(jobElement, job, 1);
            jobElement = jobElement.next();
            buildJobSettingsInput(jobElement, job, 2);
            jobElement = jobElement.next();
            buildJobSettingsInput(jobElement, job, 3);

            if (i >= 3) {
                jobElement = jobElement.next();
                jobElement.append($('<span class="script-lastcolumn"></span>'));
            }
        }

        tableBodyNode.sortable({
            items: "tr:not(.unsortable)",
            helper: sorterHelper,
            update: function() {
                let sortedIds = tableBodyNode.sortable('toArray', {attribute: 'value'});
                for (let i = 0; i < sortedIds.length; i++) {
                    settingsRaw['job_p_' + sortedIds[i]] = i + 3; // farmers, hunters, and unemployed are always on top
                }

                JobManager.sortByPriority();
                updateSettingsFromState();
            },
        });

        document.documentElement.scrollTop = document.body.scrollTop = currentScrollPosition;
    }

    function buildJobSettingsToggle(node, job) {
        let settingKey = "job_" + job._originalId;
        let color = job === jobs.Unemployed ? 'warning' : job instanceof CraftingJob ? 'danger' : job.isUnlimited() ? 'info' : 'advanced';
        node.addClass("script_bg_" + settingKey + (settingsRaw.overrides[settingKey] ? " inactive-row" : ""))
            .append(addToggleCallbacks($(`
          <label tabindex="0" class="switch" style="margin-top:4px; margin-left:10px;">
            <input class="script_${settingKey}" type="checkbox"${settingsRaw[settingKey] ? " checked" : ""}>
            <span class="check" style="height:5px; max-width:15px"></span>
            <span class="has-text-${color}" style="margin-left: 20px;">${job._originalName}</span>
          </label>`), settingKey));
    }

    function buildJobSettingsInput(node, job, breakpoint) {
        if (job === jobs.Farmer || job === jobs.Hunter || job instanceof CraftingJob || (job !== jobs.Unemployed && breakpoint === 3 && job.isUnlimited())) {
            node.append(`<span>脚本自动管理</span>`);
        } else {
            addTableInput(node, `job_b${breakpoint}_${job._originalId}`);
        }
    }

    function buildWeightingSettings() {
        let sectionId = "weighting";
        let sectionName = "自动建筑权重";

        let resetFunction = function() {
            resetWeightingSettings(true);
            updateSettingsFromState();
            updateWeightingSettingsContent();
        };

        buildSettingsSection(sectionId, sectionName, resetFunction, updateWeightingSettingsContent);
    }

    function updateWeightingSettingsContent() {
        let currentScrollPosition = document.documentElement.scrollTop || document.body.scrollTop;

        let currentNode = $('#script_weightingContent');
        currentNode.empty().off("*");

        addSettingsToggle(currentNode, "buildingBuildIfStorageFull", "如果任意相关资源存储已满，则忽略权重进行建造", "如果建筑所使用的任意一项资源超过上限，则忽略权重立刻进行建造，以避免浪费资源。权重仍然需要设为正数(大于0)后此项才能生效。");

        currentNode.append(`
          <table style="width:100%">
            <tr>
              <th class="has-text-warning" style="width:30%">目标</th>
              <th class="has-text-warning" style="width:60%">条件</th>
              <th class="has-text-warning" style="width:10%">倍率</th>
            </tr>
            <tbody id="script_weightingTableBody"></tbody>
          </table>`);

        let tableBodyNode = $('#script_weightingTableBody');

        addWeightingRule(tableBodyNode, "任意类型", "新建筑", "buildingWeightingNew");
        addWeightingRule(tableBodyNode, "用电建筑", "电力不足", "buildingWeightingUnderpowered");
        addWeightingRule(tableBodyNode, "发电厂", "电力不足", "buildingWeightingNeedfulPowerPlant");
        addWeightingRule(tableBodyNode, "发电厂", "电力过剩", "buildingWeightingUselessPowerPlant");
        addWeightingRule(tableBodyNode, "知识上限建筑", "存在因知识上限不足而无法进行的研究", "buildingWeightingNeedfulKnowledge");
        addWeightingRule(tableBodyNode, "知识上限建筑", "不存在因知识上限不足而无法进行的研究", "buildingWeightingUselessKnowledge");
        addWeightingRule(tableBodyNode, "需要调整供能的建筑(地面)", "并非所有建筑都在正常供能", "buildingWeightingNonOperatingCity");
        addWeightingRule(tableBodyNode, "需要调整供能的建筑(太空)", "并非所有建筑都在正常供能", "buildingWeightingNonOperating");
        addWeightingRule(tableBodyNode, "供能物资不足的建筑", "缺少供能物资，无法正常运转", "buildingWeightingMissingSupply");
        addWeightingRule(tableBodyNode, "需要花费支持的建筑", "缺少支持，无法正常运转", "buildingWeightingMissingSupport");
        addWeightingRule(tableBodyNode, "提供支持的建筑", "提供的支持超过了目前的需求", "buildingWeightingUselessSupport");
        addWeightingRule(tableBodyNode, "所有燃料存储", "进行研究或任务需要的石油或氦-3超过存储上限", "buildingWeightingMissingFuel");
        addWeightingRule(tableBodyNode, "提升人口、士兵、石油或知识上限以外的建筑", "进行核爆重置，且已研究相互毁灭", "buildingWeightingMADUseless");
        addWeightingRule(tableBodyNode, "质量喷射器", "存在未完全运作的质量喷射器", "buildingWeightingUnusedEjectors");
        addWeightingRule(tableBodyNode, "货场、集装箱港口与弹药库", "有未使用的板条箱或集装箱", "buildingWeightingCrateUseless");
        addWeightingRule(tableBodyNode, "马蹄铁", "暂时不需要马蹄铁", "buildingWeightingHorseshoeUseless");
        addWeightingRule(tableBodyNode, "冥想室", "暂时不需要冥想室", "buildingWeightingZenUseless");
        addWeightingRule(tableBodyNode, "远古之门炮塔", "远古之门的恶魔已经完全压制", "buildingWeightingGateTurret");
        addWeightingRule(tableBodyNode, "仓库，格纳库，星际货仓，卫星仓库", "需要更多提供储量上限的建筑", "buildingWeightingNeedStorage");
        addWeightingRule(tableBodyNode, "住房", "有市民居住的住房没有超过90%", "buildingWeightingUselessHousing");

        document.documentElement.scrollTop = document.body.scrollTop = currentScrollPosition;
    }

    function addWeightingRule(table, targetName, conditionDesc, settingKey){
        let ruleNode = $(`
          <tr>
            <td style="width:30%"><span class="has-text-info">${targetName}</span></td>
            <td style="width:60%"><span class="has-text-info">${conditionDesc}</span></td>
            <td style="width:10%"></td>
          </tr>`);
        addTableInput(ruleNode.find('td:eq(2)'), settingKey);
        table.append(ruleNode);
    }

    function buildBuildingSettings() {
        let sectionId = "building";
        let sectionName = "建筑";

        let resetFunction = function() {
            resetBuildingSettings(true);
            updateSettingsFromState();
            updateBuildingSettingsContent();

            resetCheckbox("autoBuild", "autoPower");
            removeBuildingToggles();
        };

        buildSettingsSection(sectionId, sectionName, resetFunction, updateBuildingSettingsContent);
    }

    function updateBuildingSettingsContent() {
        let currentScrollPosition = document.documentElement.scrollTop || document.body.scrollTop;

        let currentNode = $('#script_buildingContent');
        currentNode.empty().off("*");

        addSettingsToggle(currentNode, "buildingsIgnoreZeroRate", "忽略无产量的资源", "权重将忽略无产量的资源(例如锻造物，未进行生产的产物等)，如果有相应的建筑物需要这些资源，则不会因此影响其他建筑的建造。");
        addSettingsToggle(currentNode, "buildingsLimitPowered", "限制需要供能的建筑数量", "开启此项后，脚本只会对建造上限数量的建筑进行供能，超出部分不进行供能。可以用来限制以其他方式建造的建筑供能上限。");
        addSettingsNumber(currentNode, "buildingTowerSuppression", "巨塔安全指数阈值", "达到相应安全指数以后，才会开始建造西侧巨塔和东侧巨塔");

        let shrineOptions = [{val: "any", label: "任意类型", hint: "只要资源足够就建造圣地"},
                             {val: "equally", label: "平均分配", hint: "平均建造所有类型的圣地"},
                             {val: "morale", label: "士气", hint: "只建造提升士气的圣地"},
                             {val: "metal", label: "金属", hint: "只建造提升金属产量的圣地"},
                             {val: "know", label: "知识", hint: "只建造提升知识的圣地"},
                             {val: "tax", label: "税收", hint: "只建造提升税收的圣地"}];
        addSettingsSelect(currentNode, "buildingShrineType", "圣地种类偏好", "只在对应月相时建造相应的圣地", shrineOptions);

        currentNode.append(`
          <div><input id="script_buildingSearch" class="script-searchsettings" type="text" placeholder="搜索建筑……"></div>
          <table style="width:100%">
            <tr>
              <th class="has-text-warning" style="width:35%">建筑物</th>
              <th class="has-text-warning" style="width:15%" title="开启自动建造。触发器无视此选项。">是否自动建造</th>
              <th class="has-text-warning" style="width:15%" title="建造上限。触发器无视此选项。开启上方相应选项以后还可以用来限制供能的建筑数量。">建造上限</th>
              <th class="has-text-warning" style="width:15%" title="Script will try to spend 2x amount of resources on building having 2x weighting, and such.">权重</th>
              <th class="has-text-warning" style="width:20%" title="第一个开关会根据优先级，供能情况，支持，和消耗情况来控制供能。第二个开关可以更好地根据当前情况控制特定建筑的供能。">是否自动供能</th>
            </tr>
            <tbody id="script_buildingTableBody"></tbody>
          </table>`);

        let tableBodyNode = $('#script_buildingTableBody');

        $("#script_buildingSearch").on("keyup", filterBuildingSettingsTable); // Add building filter

        // Add in a first row for switching "All"
        let newTableBodyText = '<tr value="All" class="unsortable"><td id="script_bldallToggle" style="width:35%"></td><td style="width:15%"></td><td style="width:15%"></td><td style="width:15%"></td><td style="width:20%"><span id="script_resetBuildingsPriority" class="script-refresh"></span></td></tr>';

        for (let i = 0; i < BuildingManager.priorityList.length; i++) {
            let building = BuildingManager.priorityList[i];
            newTableBodyText += `<tr value="${building._vueBinding}" class="script-draggable"><td id="script_${building._vueBinding}" style="width:35%"></td><td style="width:15%"></td><td style="width:15%"></td><td style="width:15%"></td><td style="width:20%"></td></tr>`;
        }
        tableBodyNode.append($(newTableBodyText));

        // Build special "All Buildings" top row
        let buildingElement = $('#script_bldallToggle');
        buildingElement.append('<span class="has-text-warning" style="margin-left: 20px;">所有建筑物</span>');

        // enabled column
        buildingElement = buildingElement.next();
        buildingElement.append(buildAllBuildingEnabledSettingsToggle());

        // state column
        buildingElement = buildingElement.next().next().next();
        buildingElement.append(buildAllBuildingStateSettingsToggle());

        $('#script_resetBuildingsPriority').on("click", function(){
            if (confirm("Are you sure you wish to reset buildings priority?")) {
                initBuildingState();
                for (let i = 0; i < BuildingManager.priorityList.length; i++) {
                    let id = BuildingManager.priorityList[i]._vueBinding;
                    settingsRaw['bld_p_' + id] = i;
                }
                updateSettingsFromState();
                updateBuildingSettingsContent();
            }
        });

        // Build all other buildings settings rows
        for (let i = 0; i < BuildingManager.priorityList.length; i++) {
            let building = BuildingManager.priorityList[i];
            let buildingElement = $('#script_' + building._vueBinding);

            let color = (building._tab === "space" || building._tab === "starDock") ? "has-text-danger" :
                        building._tab === "galaxy" ? "has-text-advanced" :
                        building._tab === "interstellar" ? "has-text-special" :
                        building._tab === "portal" ? "has-text-warning" :
                        "has-text-info";

            buildingElement.append(buildTableLabel(building.name, "", color));

            buildingElement = buildingElement.next();
            addTableToggle(buildingElement, "bat" + building._vueBinding);

            buildingElement = buildingElement.next();
            addTableInput(buildingElement, "bld_m_" + building._vueBinding);

            buildingElement = buildingElement.next();
            addTableInput(buildingElement, "bld_w_" + building._vueBinding);

            buildingElement = buildingElement.next();
            buildBuildingStateSettingsToggle(buildingElement, building);
        }

        tableBodyNode.sortable({
            items: "tr:not(.unsortable)",
            helper: sorterHelper,
            update: function() {
                let buildingElements = tableBodyNode.sortable('toArray', {attribute: 'value'});
                for (let i = 0; i < buildingElements.length; i++) {
                    settingsRaw['bld_p_' + buildingElements[i]] = i;
                }

                BuildingManager.sortByPriority();
                updateSettingsFromState();
            },
        });

        document.documentElement.scrollTop = document.body.scrollTop = currentScrollPosition;
    }

    function filterBuildingSettingsTable() {
        // Declare variables
        let filter = document.getElementById("script_buildingSearch").value.toUpperCase();
        let trs = document.getElementById("script_buildingTableBody").getElementsByTagName("tr");

        let filterChecker = null;
        let reg = filter.match(/^(.+)(<=|>=|===|==|<|>|!==|!=)(.+)$/);
        if (reg?.length === 4) {
            let buildingValue = null;
            switch (reg[1].trim()) {
                case "BUILD":
                case "AUTOBUILD":
                    buildingValue = (b) => b.autoBuildEnabled;
                    break;
                case "POWER":
                case "AUTOPOWER":
                    buildingValue = (b) => b.autoStateEnabled;
                    break;
                case "WEIGHT":
                case "WEIGHTING":
                    buildingValue = (b) => b._weighting;
                    break;
                case "MAX":
                case "MAXBUILD":
                    buildingValue = (b) => b._autoMax;
                    break;
                case "POWERED":
                    buildingValue = (b) => b.powered;
                    break;
                case "KNOW":
                case "KNOWLEDGE":
                    buildingValue = (b) => b.is.knowledge;
                    break;
                default: // Cost check, get resource quantity by part of name
                    buildingValue = (b) => Object.entries(b.cost).find(([res, qnt]) => resources[res].title.toUpperCase().indexOf(reg[1].trim()) > -1)?.[1] ?? 0;
            }
            let testValue = null;
            switch (reg[3].trim()) {
                case "ON":
                case "TRUE":
                    testValue = true;
                    break;
                case "OFF":
                case "FALSE":
                    testValue = false;
                    break;
                default:
                    testValue = getRealNumber(reg[3].trim());
                    break;
            }
            filterChecker = (building) => checkCompare[reg[2]](buildingValue(building), testValue);
        }

        // Loop through all table rows, and hide those who don't match the search query
        for (let i = 0; i < trs.length; i++) {
            let td = trs[i].getElementsByTagName("td")[0];
            if (td) {
                if (filterChecker) {
                    let building = buildingIds[td.id.match(/^script_(.*)$/)[1]];
                    if (building && filterChecker(building)) {
                        trs[i].style.display = "";
                    } else {
                        trs[i].style.display = "none";
                    }
                } else if (td.textContent.toUpperCase().indexOf(filter) > -1) {
                    trs[i].style.display = "";
                } else {
                    trs[i].style.display = "none";
                }
            }
        }

        let content = document.querySelector('#script_buildingSettings .script-content');
        content.style.height = null;
        content.style.height = content.offsetHeight + "px"
    }

    function buildAllBuildingEnabledSettingsToggle() {
        return $(`
          <label tabindex="0" class="switch" style="position:absolute; margin-top: 8px; margin-left: 10px;">
            <input class="script_buildingEnabledAll" type="checkbox"${settingsRaw.buildingEnabledAll ? " checked" : ""}>
            <span class="check" style="height:5px; max-width:15px"></span>
            <span style="margin-left: 20px;"></span>
          </label>`)
        .on('change', 'input', function() {
            settingsRaw.buildingEnabledAll = this.checked;
            for (let i = 0; i < BuildingManager.priorityList.length; i++) {
                let id = BuildingManager.priorityList[i]._vueBinding;
                settingsRaw['bat' + id] = this.checked;
            }
            $('[class^="script_bat"]').prop('checked', this.checked);

            updateSettingsFromState();
        })
        .on('click', function(event){
            if (event.ctrlKey) {
                event.preventDefault();
            }
        });
    }

    function buildBuildingStateSettingsToggle(node, building) {
        let stateKey = 'bld_s_' + building._vueBinding;
        let smartKey = 'bld_s2_' + building._vueBinding;

        if (building.isSwitchable()) {
            addToggleCallbacks($(`
              <label tabindex="0" class="switch" style="position:absolute; margin-top: 8px; margin-left: 10px;">
                <input class="script_${stateKey}" type="checkbox"${settingsRaw[stateKey] ? " checked" : ""}>
                <span class="check" style="height:5px; max-width:15px"></span>
                <span style="margin-left: 20px;"></span>
              </label>`), stateKey)
            .appendTo(node);
            node.addClass("script_bg_" + stateKey);
        }

        if (building.is.smart) {
            let smartNode = $(`
              <label tabindex="0" class="switch" style="position:absolute; margin-top: 8px; margin-left: 35px;">
                <input class="script_${smartKey}" type="checkbox"${settingsRaw[smartKey] ? " checked" : ""}>
                <span class="check" style="height:5px; max-width:15px"></span>
                <span style="margin-left: 20px;"></span>
              </label>`);

            let set = linkedBuildings.find(set => set.includes(building));
            if (set) {
                smartNode.on('change', 'input', function() {
                    set.forEach(building => {
                        let linkedId = 'bld_s2_' + building._vueBinding;
                        settingsRaw[linkedId] = this.checked;
                        $(".script_" + linkedId).prop('checked', this.checked);
                    });
                    updateSettingsFromState();
                });
            } else {
                addToggleCallbacks(smartNode, smartKey);
            }
            node.append(smartNode);
            node.addClass("script_bg_" + smartKey);
        }

        node.append(`<span class="script-lastcolumn"></span>`);
        node.toggleClass('inactive-row', Boolean(settingsRaw.overrides[stateKey] || settingsRaw.overrides[smartKey]));
    }

    function buildAllBuildingStateSettingsToggle() {
        return $(`
          <label tabindex="0" class="switch" style="position:absolute; margin-top: 8px; margin-left: 10px;">
            <input class="script_buildingStateAll" type="checkbox"${settingsRaw.buildingStateAll ? " checked" : ""}>
            <span class="check" style="height:5px; max-width:15px"></span>
            <span style="margin-left: 20px;"></span>
          </label>`)
        .on('change', 'input', function(e) {
            settingsRaw.buildingStateAll = this.checked;
            for (let i = 0; i < BuildingManager.priorityList.length; i++) {
                let id = BuildingManager.priorityList[i]._vueBinding;
                settingsRaw['bld_s_' + id] = this.checked;
            }
            $('[class^="script_bld_s_"]').prop('checked', this.checked);

            updateSettingsFromState();
        })
        .on('click', function(event){
            if (event.ctrlKey) {
                event.preventDefault();
            }
        });
    }

    function buildProjectSettings() {
        let sectionId = "project";
        let sectionName = "ARPA";

        let resetFunction = function() {
            resetProjectSettings(true);
            updateSettingsFromState();
            updateProjectSettingsContent();

            resetCheckbox("autoARPA");
        };

        buildSettingsSection(sectionId, sectionName, resetFunction, updateProjectSettingsContent);
    }

    function updateProjectSettingsContent() {
        let currentScrollPosition = document.documentElement.scrollTop || document.body.scrollTop;

        let currentNode = $('#script_projectContent');
        currentNode.empty().off("*");

        addSettingsToggle(currentNode, "arpaScaleWeighting", "进度权重", "随着项目接近完成而提高权重，使脚本更优先进行接近完成的项目。");
        addSettingsNumber(currentNode, "arpaStep", "每次建造进度百分比", "每次建造时建造相应百分比的项目。触发器永远使用100%的百分比。");

        currentNode.append(`
          <table style="width:100%">
            <tr>
              <th class="has-text-warning" style="width:25%">项目</th>
              <th class="has-text-warning" style="width:25%">是否自动建造</th>
              <th class="has-text-warning" style="width:25%">建造上限</th>
              <th class="has-text-warning" style="width:25%">权重</th>
            </tr>
            <tbody id="script_projectTableBody"></tbody>
          </table>`);

        let tableBodyNode = $('#script_projectTableBody');
        let newTableBodyText = "";

        for (let i = 0; i < ProjectManager.priorityList.length; i++) {
            const project = ProjectManager.priorityList[i];
            newTableBodyText += `<tr value="${project.id}" class="script-draggable"><td id="script_${project.id}" style="width:25%"></td><td style="width:25%"></td><td style="width:25%"></td><td style="width:25%"></td><td style="width:25%"></td></tr>`;
        }
        tableBodyNode.append($(newTableBodyText));

        // Build all other projects settings rows
        for (let i = 0; i < ProjectManager.priorityList.length; i++) {
            const project = ProjectManager.priorityList[i];
            let projectElement = $('#script_' + project.id);

            projectElement.append(buildTableLabel(project.name));

            projectElement = projectElement.next();
            addTableToggle(projectElement, "arpa_" + project.id);

            projectElement = projectElement.next();
            addTableInput(projectElement, "arpa_m_" + project.id);

            projectElement = projectElement.next();
            addTableInput(projectElement, "arpa_w_" + project.id);

        }

        tableBodyNode.sortable({
            items: "tr:not(.unsortable)",
            helper: sorterHelper,
            update: function() {
                let projectIds = tableBodyNode.sortable('toArray', {attribute: 'value'});
                for (let i = 0; i < projectIds.length; i++) {
                    settingsRaw["arpa_p_" + projectIds[i]] = i;
                }

                ProjectManager.sortByPriority();
                updateSettingsFromState();
            },
        });

        document.documentElement.scrollTop = document.body.scrollTop = currentScrollPosition;
    }

    function buildLoggingSettings(parentNode, secondaryPrefix) {
        let sectionId = "logging";
        let sectionName = "日志";

        let resetFunction = function() {
            resetLoggingSettings(true);
            updateSettingsFromState();
            updateLoggingSettingsContent(secondaryPrefix);
            buildFilterRegExp();
        };

        buildSettingsSection2(parentNode, secondaryPrefix, sectionId, sectionName, resetFunction, updateLoggingSettingsContent);
    }

    function updateLoggingSettingsContent(secondaryPrefix) {
        let currentScrollPosition = document.documentElement.scrollTop || document.body.scrollTop;

        let currentNode = $(`#script_${secondaryPrefix}loggingContent`);
        currentNode.empty().off("*");

        addSettingsHeader1(currentNode, "脚本信息");
        addSettingsToggle(currentNode, "logEnabled", "是否启用日志，下方设置为相关日志类型", "日志记录的主开关");
        Object.entries(GameLog.Types).forEach(([id, label]) => addSettingsToggle(currentNode, "log_" + id, label, `启用后，记录${label}操作`));

        addSettingsHeader1(currentNode, "游戏信息");
        addSettingsToggle(currentNode, "hellTurnOffLogMessages", "关闭巡逻队和勘探者相关的日志", "自动关闭巡逻队和勘探者相关的日志");
        let stringsUrl = `strings/strings${game.global.settings.locale === "en-US" ? "" : "." + game.global.settings.locale}.json`
        currentNode.append(`
          <div>
            <span>下方输入需要屏蔽的信息ID，ID列表如下：<a href="${stringsUrl}" target="_blank">点击此处</a>。</span><br>
            <textarea id="script_logFilter" class="textarea" style="margin-top: 4px;">${settingsRaw.logFilter}</textarea>
          </div>`);

        // Settings textarea
        $("#script_logFilter").on('change', function() {
            settingsRaw.logFilter = this.value;
            buildFilterRegExp();
            this.value = settingsRaw.logFilter;
            updateSettingsFromState();
        });

        document.documentElement.scrollTop = document.body.scrollTop = currentScrollPosition;
    }

    function createQuickOptions(node, optionsElementId, optionsDisplayName, buildOptionsFunction) {
        let optionsDiv = $(`<div style="cursor: pointer;" id="${optionsElementId}">${optionsDisplayName}选项</div>`);
        node.append(optionsDiv);

        addOptionUI(optionsElementId + "_btn", `#${optionsElementId}`, optionsDisplayName, buildOptionsFunction);
        optionsDiv.on('click', function() {
            openOptionsModal(optionsDisplayName, buildOptionsFunction);
        });
    }

    function createSettingToggle(node, settingKey, label, title, enabledCallBack, disabledCallBack) {
        let toggle = $(`
          <label class="switch script_bg_${settingKey}" tabindex="0" title="${title}">
            <input class="script_${settingKey}" type="checkbox"${settingsRaw[settingKey] ? " checked" : ""}/>
            <span class="check"></span><span>${label}</span>
          </label><br>`)
        .toggleClass('inactive-row', Boolean(settingsRaw.overrides[settingKey]));

        if (settingsRaw[settingKey] && enabledCallBack) {
            enabledCallBack();
        }

        toggle.on('change', 'input', function() {
            settingsRaw[settingKey] = this.checked;
            updateSettingsFromState();
            if (settingsRaw[settingKey] && enabledCallBack) {
                enabledCallBack();
            }
            if (!settingsRaw[settingKey] && disabledCallBack) {
                disabledCallBack();
            }
        });
        toggle.on('click', {label: `Toggle (${settingKey})`, name: settingKey, type: "boolean"}, openOverrideModal);

        node.append(toggle);
    }

    function updateOptionsUI() {
        // Build secondary options buttons if they don't currently exist
        addOptionUI("s-government-options", "#government .tabs ul", "Government", buildGovernmentSettings);
        addOptionUI("s-foreign-options", "#garrison div h2", "Foreign Affairs", buildWarSettings);
        addOptionUI("s-foreign-options2", "#c_garrison div h2", "Foreign Affairs", buildWarSettings);
        addOptionUI("s-hell-options", "#gFort div h3", "Hell", buildHellSettings);
        addOptionUI("s-hell-options2", "#prtl_fortress div h3", "Hell", buildHellSettings);
        addOptionUI("s-fleet-options", "#hfleet h3", "Fleet", buildFleetSettings);
    }

    function addOptionUI(optionsId, querySelectorText, modalTitle, buildOptionsFunction) {
        if (document.getElementById(optionsId) !== null) { return; } // We've already built the options UI

        let sectionNode = $(querySelectorText);

        if (sectionNode.length === 0) { return; } // The node that we want to add it to doesn't exist yet

        let newOptionNode = $(`<span id="${optionsId}" class="s-options-button has-text-success" style="margin-right:0px">+</span>`);
        sectionNode.prepend(newOptionNode);
        newOptionNode.on('click', function() {
            openOptionsModal(modalTitle, buildOptionsFunction);
        });
    }

    function openOptionsModal(modalTitle, buildOptionsFunction) {
        // Build content
        let modalHeader = $('#scriptModalHeader');
        modalHeader.empty().off("*");
        modalHeader.append(`<span>${modalTitle}</span>`);

        let modalBody = $('#scriptModalBody');
        modalBody.empty().off("*");
        buildOptionsFunction(modalBody, "c_");

        // Show modal
        let modal = document.getElementById("scriptModal");
        $("html").css('overflow', 'hidden');
        modal.style.display = "block";
    }

    function createOptionsModal() {
        if (document.getElementById("scriptModal") !== null) {
            return;
        }

        // Append the script modal to the document
        $(document.body).append(`
          <div id="scriptModal" class="script-modal content">
            <span id="scriptModalClose" class="script-modal-close">&times;</span>
            <div class="script-modal-content">
              <div id="scriptModalHeader" class="script-modal-header has-text-warning">
                <p>You should never see this modal header...</p>
              </div>
              <div id="scriptModalBody" class="script-modal-body">
                <p>You should never see this modal body...</p>
              </div>
            </div>
          </div>`);

        // Add the script modal close button action
        $('#scriptModalClose').on("click", function() {
            $("#scriptModal").css('display', 'none');
            $("html").css('overflow-y', 'scroll');
        });

        // If the user clicks outside the modal then close it
        $(window).on("click", function(event) {
            if (event.target.id === "scriptModal") {
                $("#scriptModal").css('display', 'none');
                $("html").css('overflow-y', 'scroll');
            }
        });
    }

    function updateUI() {
        let resetScrollPositionRequired = false;
        let currentScrollPosition = document.documentElement.scrollTop || document.body.scrollTop;

        createOptionsModal();
        updateOptionsUI();

        let scriptNode = $('#autoScriptContainer');
        if (scriptNode.length === 0) {
            scriptNode = $('<div id="autoScriptContainer"></div>');
            $('#resources').append(scriptNode);
            resetScrollPositionRequired = true;

            scriptNode.append(`<label id="autoScriptInfo">设置选项卡中可以进行更详细的设置<br>按住Ctrl键再点击选项，可以开启<span class="inactive-row">进阶设置</span></label><br>`);

            createSettingToggle(scriptNode, 'masterScriptToggle', '启用脚本', '在玩家需要的时候，停止所有脚本的活动。');

            // Dirty performance patch. Settings have a lot of elements, and they stress JQuery selectors way too much. This toggle allow to remove them from DOM completely, when they aren't needed.
            // It doesn't have huge impact anymore, after all script and game changes, but still won't hurt to have an option to increase performance a tiny bit more
            createSettingToggle(scriptNode, 'showSettings', '显示设置', '在设置选项卡中是否显示脚本相关设置。可能略微提升游戏速度。', buildScriptSettings, removeScriptSettings);

            createSettingToggle(scriptNode, 'autoEvolution', '自动进化', '自动进行进化阶段。如果选择自动完成成就，则会优先考虑还未完成过毁灭类成就或者伟大类成就的种族。');
            createSettingToggle(scriptNode, 'autoFight', '自动战斗', '当士兵已满员且没有伤兵时让他们进行战斗。当战斗评级足够以后，会自动切换战役类型。');
            createSettingToggle(scriptNode, 'autoHell', '自动地狱维度', '将士兵派往地狱维度并自动分配巡逻队。根据恶魔生物数量自动调节吸引器信标的数量。');
            createSettingToggle(scriptNode, 'autoMech', '自动机甲', '建造效率最高的大型机甲。将根据当前的情况调整机甲配置。', createMechInfo, removeMechInfo);
            createSettingToggle(scriptNode, 'autoFleet', '自动仙女座舰队', '自动分配仙女座星系的舰队以压制海盗活动');
            createSettingToggle(scriptNode, 'autoTax', '自动税率', '如果当前的士气高于上限，则会自动调整税率。会尽可能将士气保持在100%以上。');
            createSettingToggle(scriptNode, 'autoCraft', '自动锻造', '自动将资源转换为锻造物，进行转换的阈值根据当前需求和储量而定。', createCraftToggles, removeCraftToggles);
            createSettingToggle(scriptNode, 'autoTrigger', '自动触发器', '满足条件时，购买相应的建筑，项目或者研究');
            createSettingToggle(scriptNode, 'autoBuild', '自动建筑', '根据玩家设置的权重自动建造建筑，同时需要满足一定条件(例如：不会在支持不够时建造消耗相应支持的建筑)', createBuildingToggles, removeBuildingToggles);
            createSettingToggle(scriptNode, 'autoARPA', '自动ARPA', '自动建造玩家允许建造的ARPA项目。', createArpaToggles, removeArpaToggles);
            createSettingToggle(scriptNode, 'autoPower', '自动供能', '根据建筑的优先级自动管理供能。同时会自动关闭无用的建筑，以节省资源。');
            createSettingToggle(scriptNode, 'autoStorage', '自动存储', '自动分配箱子来管理自动建造、队列中的建筑、研究、以及ARPA项目所需的资源存储。', createStorageToggles, removeStorageToggles);
            createSettingToggle(scriptNode, 'autoMarket', '自动市场', '当资源到达某个比例以后自动买卖相应资源。也可以设置自动使用贸易路线进行交易，并且可以设置交易时最小的资金收入。将尽可能使用所有的贸易路线。', createMarketToggles, removeMarketToggles);
            createSettingToggle(scriptNode, 'autoGalaxyMarket', '自动星际贸易', '自动管理星际贸易路线');
            createSettingToggle(scriptNode, 'autoResearch', '自动研究', '当满足相应条件时自动进行研究。');
            createSettingToggle(scriptNode, 'autoJobs', '自动工作', '以相应优先级和多个阈值来自动分配工作。将先满足第一阈值后，再考虑第二阈值，然后再考虑最终阈值。在考虑其他工作前会先考虑伐木工人和石工数量。');
            createSettingToggle(scriptNode, 'autoCraftsmen', '自动工匠', '自动分配工匠。');
            createSettingToggle(scriptNode, 'autoAlchemy', '自动炼金术', '自动管理炼金术转化');
            createSettingToggle(scriptNode, 'autoPylon', '自动水晶塔', '自动管理水晶塔符文');
            createSettingToggle(scriptNode, 'autoQuarry', '自动温石棉控制', '烈焰种族自动管理石头和温石棉的比例');
            createSettingToggle(scriptNode, 'autoSmelter', '自动冶炼', '自动管理冶炼厂的生产。');
            createSettingToggle(scriptNode, 'autoFactory', '自动工厂', '自动管理工厂的生产。');
            createSettingToggle(scriptNode, 'autoMiningDroid', '自动采矿机器人', '自动管理采矿机器人的生产。');
            createSettingToggle(scriptNode, 'autoGraphenePlant', '自动石墨烯厂', '自动管理石墨烯厂的燃料。无法手动控制，会自动使用需求最少的燃料。');
            createSettingToggle(scriptNode, 'autoAssembleGene', '自动组装基因', '当知识满了以后，自动进行基因重组。进行首次测序时不生效。');
            createSettingToggle(scriptNode, 'autoMinorTrait', '自动次要基因', '根据相应的权重，自动使用基因购买次要特质。');
            createSettingToggle(scriptNode, 'autoEject', '自动质量喷射', '将多余的资源用于黑洞质量喷射。普通资源将在接近上限时用于喷射，锻造物将在超过需求时用于喷射。', createEjectToggles, removeEjectToggles);
            createSettingToggle(scriptNode, 'autoSupply', '自动补给', '将多余的资源用于补给。普通资源将在接近上限时用于补给，锻造物将在超过需求时用于补给。优先级高于质量喷射器。', createSupplyToggles, removeSupplyToggles);
            createSettingToggle(scriptNode, 'autoNanite', '自动纳米体', '将资源转化为纳米体。普通资源将在接近上限时用于转化，锻造物将在超过需求时用于转化。优先级高于补给和质量喷射器。');

            createQuickOptions(scriptNode, "s-quick-prestige-options", "威望重置", buildPrestigeSettings);

            scriptNode.append('<a class="button is-dark is-small" id="bulk-sell"><span>Bulk Sell</span></a>');
            $("#bulk-sell").on('mouseup', function() {
                updateDebugData();
                updateScriptData();
                finalizeScriptData();
                autoMarket(true, true);
            });
        }

        if (scriptNode.next().length) {
            resetScrollPositionRequired = true;
            scriptNode.parent().append(scriptNode);
        }

        if (settingsRaw.showSettings && $("#script_settings").length === 0) {
            buildScriptSettings();
        }
        if (settingsRaw.autoCraft && $('#resources .ea-craft-toggle').length === 0) {
            createCraftToggles();
        }
        // Building toggles added to different tabs, game can redraw just one tab, destroying toggles there, and we still have total number of toggles above zero; we'll remember amount of toggle, and redraw it when number differ from what we have in game
        let currentBuildingToggles = $('#mTabCivil .ea-building-toggle').length;
        if (settingsRaw.autoBuild && (currentBuildingToggles === 0 || currentBuildingToggles !== state.buildingToggles)) {
            createBuildingToggles();
        }
        if (settingsRaw.autoStorage && game.global.settings.showStorage && $('#resStorage .ea-storage-toggle').length === 0) {
            createStorageToggles();
        }
        if (settingsRaw.autoMarket && game.global.settings.showMarket && $('#market .ea-market-toggle').length === 0) {
            createMarketToggles();
        }
        if (settingsRaw.autoEject && game.global.settings.showEjector && $('#resEjector .ea-eject-toggle').length === 0) {
            createEjectToggles();
        }
        if (settingsRaw.autoSupply && game.global.settings.showCargo && $('#resCargo .ea-supply-toggle').length === 0) {
            createSupplyToggles();
        }
        if (settingsRaw.autoARPA && game.global.settings.showGenetics && $('#arpaPhysics .ea-arpa-toggle').length === 0) {
            createArpaToggles();
        }

        if (settingsRaw.autoMech && game.global.settings.showMechLab && $('#mechList .ea-mech-info').length < $('#mechList .mechRow').length) {
            createMechInfo();
        }

        // Hell messages
        if (settings.hellTurnOffLogMessages) {
            if (game.global.portal.fortress?.notify === "Yes") {
                $("#fort .b-checkbox").eq(0).click();
            }
            if (game.global.portal.fortress?.s_ntfy === "Yes") {
                $("#fort .b-checkbox").eq(1).click();
            }
        }

        // Soul Gems income rate
        if (resources.Soul_Gem.isUnlocked()) {
            let currentSec = Math.floor(state.scriptTick / 4);
            if (resources.Soul_Gem.currentQuantity > state.soulGemLast) {
                state.soulGemIncomes.push({sec: currentSec, gems: resources.Soul_Gem.currentQuantity - state.soulGemLast})
                state.soulGemLast = resources.Soul_Gem.currentQuantity;
            }
            let gems = 0;
            let i = state.soulGemIncomes.length;
            while (--i >= 0) {
                let income = state.soulGemIncomes[i];
                // Get all gems gained in last hour, or at least 10 last gems in any time frame, if rate is low
                if (currentSec - income.sec > 3600 && gems > 10) {
                    break;
                } else {
                    gems += income.gems;
                }
            }
            // If loop was broken prematurely - clean up old records which we don't need anymore
            if (i >= 0) {
                state.soulGemIncomes = state.soulGemIncomes.splice(i+1);
            }
            let timePassed = currentSec - state.soulGemIncomes[0].sec;
            resources.Soul_Gem.rateOfChange = gems / timePassed;
            $("#resSoul_Gem span:eq(2)").text(`${getNiceNumber(gems / timePassed * 3600)} /h`);
        }

        // Previous game stats
        if ($("#statsPanel .cstat").length === 1) {
            let backupString = win.LZString.decompressFromUTF16(localStorage.getItem('evolveBak'));
            if (backupString) {
                let oldStats = JSON.parse(backupString).stats;
                let statsData = {knowledge_spent: oldStats.know, starved_to_death: oldStats.starved, died_in_combat: oldStats.died, attacks_made: oldStats.attacks, game_days_played: oldStats.days};
                if (oldStats.dkills > 0) {
                    statsData.demons_kills = oldStats.dkills;
                }
                if (oldStats.sac > 0) {
                    statsData.sacrificed = oldStats.sac;
                }
                let statsString = `<div class="cstat"><span class="has-text-success">上周目数据</span></div>`;
                for (let [label, value] of Object.entries(statsData)) {
                    statsString += `<div><span class="has-text-warning">${game.loc("achieve_stats_" + label)}</span> ${value.toLocaleString()}</div>`;
                }
                $("#statsPanel").append(statsString);
            }
        }

        if (resetScrollPositionRequired) {
            // Leave the scroll position where it was before all our updates to the UI above
            document.documentElement.scrollTop = document.body.scrollTop = currentScrollPosition;
        }
    }

    function createMechInfo() {
        if ((settings.masterScriptToggle && MechManager.isActive) || $(`#mechList .mechRow[draggable=true]`).length > 0) {
            return;
        }
        if (MechManager.initLab()) {
            MechManager.mechObserver.disconnect();
            let list = getVueById("mechList");
            for (let i = 0; i < list._vnode.children.length; i++) {
                let mech = game.global.portal.mechbay.mechs[i];
                let stats = MechManager.getMechStats(mech);
                let rating = stats.power / MechManager.bestMech[mech.size].power;
                let info = (mech.size === 'collector' ?
                  `${Math.round(rating*100)}%, ${getNiceNumber(stats.power*MechManager.collectorValue)} /s`:
                  `${Math.round(rating*100)}%, ${getNiceNumber(stats.power*100)}, ${getNiceNumber(stats.efficiency*100)}`)
                  + " | ";

                let mechNode = list._vnode.children[i].elm;
                let firstNode = $(mechNode.childNodes[0]);
                if (firstNode.hasClass("ea-mech-info")) {
                    if (firstNode.text() !== "info") {
                        firstNode.text(info);
                    }
                } else {
                    $(mechNode).prepend(`<span class="ea-mech-info">${info}</span>`);
                }
            }
            MechManager.mechObserver.observe(document.getElementById("mechList"), {childList: true});
        }
    }

    function removeMechInfo() {
        MechManager.mechObserver.disconnect();
        $('#mechList .ea-mech-info').remove();
    }

    function createArpaToggles() {
        removeArpaToggles();

        for (let i = 0; i < ProjectManager.priorityList.length; i++) {
            let project = ProjectManager.priorityList[i];
            let projectElement = $('#arpa' + project.id + ' .head');
            if (projectElement.length) {
                let settingKey = "arpa_" + project.id;
                projectElement.append(addToggleCallbacks($(`
                  <label tabindex="0" class="switch ea-arpa-toggle" style="position:relative; max-width:75px; margin-top:-36px; left:59%; float:left;">
                    <input class="script_${settingKey}" type="checkbox"${settingsRaw[settingKey] ? " checked" : ""}>
                    <span class="check" style="height:5px;"></span>
                  </label>`), settingKey));
            }
        }
    }

    function removeArpaToggles() {
        $('#arpaPhysics .ea-arpa-toggle').remove();
    }

    function createCraftToggles() {
        removeCraftToggles();

        for (let i = 0; i < craftablesList.length; i++) {
            let craftable = craftablesList[i];
            let craftableElement = $('#res' + craftable.id + ' h3');
            if (craftableElement.length) {
                let settingKey = "craft" + craftable.id;
                craftableElement.prepend(addToggleCallbacks($(`
                  <label tabindex="0" class="switch ea-craft-toggle">
                    <input class="script_${settingKey}" type="checkbox"${settingsRaw[settingKey] ? " checked" : ""}/>
                    <span class="check" style="height:5px;"></span>
                  </label>`), settingKey));
            }
        }
    }

    function removeCraftToggles() {
        $('#resources .ea-craft-toggle').remove();
    }

    function createBuildingToggles() {
        removeBuildingToggles();

        for (let i = 0; i < BuildingManager.priorityList.length; i++) {
            let building = BuildingManager.priorityList[i];
            let buildingElement = $('#' + building._vueBinding);
            if (buildingElement.length) {
                let settingKey = "bat" + building._vueBinding;
                buildingElement.append(addToggleCallbacks($(`
                  <label tabindex="0" class="switch ea-building-toggle" style="position:absolute; margin-top: 24px; left:10%;">
                    <input class="script_${settingKey}" type="checkbox"${settingsRaw[settingKey] ? " checked" : ""}/>
                    <span class="check" style="height:5px; max-width:15px"></span>
                  </label>`), settingKey));
                state.buildingToggles++;
            }
        }
    }

    function removeBuildingToggles() {
        $('#mTabCivil .ea-building-toggle').remove();
        state.buildingToggles = 0;
    }

    function createEjectToggles() {
        removeEjectToggles();

        $('#eject').append('<span id="script_eject_top_row" style="margin-left: auto; margin-right: 0.2rem; float: right;" class="has-text-danger">是否自动喷射</span>');
        for (let resource of EjectManager.priorityList) {
            let ejectElement = $('#eject' + resource.id);
            if (ejectElement.length) {
                let settingKey = 'res_eject' + resource.id;
                ejectElement.append(addToggleCallbacks($(`
                  <label tabindex="0" title="允许喷射此项资源。进行喷射的时机在威望重置设置下。" class="switch ea-eject-toggle" style="margin-left:auto; margin-right:0.2rem;">
                    <input class="script_${settingKey}" type="checkbox"${settingsRaw[settingKey] ? " checked" : ""}>
                    <span class="check" style="height:5px;"></span>
                    <span class="state"></span>
                  </label>`), settingKey));
            }
        }
    }

    function removeEjectToggles() {
        $('#resEjector .ea-eject-toggle').remove();
        $("#script_eject_top_row").remove();
    }

    function createSupplyToggles() {
        removeSupplyToggles();

        $('#spireSupply').append('<span id="script_supply_top_row" style="margin-left: auto; margin-right: 0.2rem; float: right;" class="has-text-danger">是否自动补给</span>');
        for (let resource of SupplyManager.priorityList) {
            let supplyElement = $('#supply' + resource.id);
            if (supplyElement.length) {
                let settingKey = 'res_supply' + resource.id;
                supplyElement.append(addToggleCallbacks($(`
                  <label tabindex="0" title="允许使用此项资源进行补给。"  class="switch ea-supply-toggle" style="margin-left:auto; margin-right:0.2rem;">
                    <input class="script_${settingKey}" type="checkbox"${settingsRaw[settingKey] ? " checked" : ""}>
                    <span class="check" style="height:5px;"></span>
                    <span class="state"></span>
                  </label>`), settingKey));
            }
        }
    }

    function removeSupplyToggles() {
        $('#resCargo .ea-supply-toggle').remove();
        $("#script_supply_top_row").remove();
    }

    function createMarketToggles() {
        removeMarketToggles();

        if (!game.global.race['no_trade']) {
            $("#market .market-item[id] .res").width("5rem");
            $("#market .market-item[id] .buy span").text("买");
            $("#market .market-item[id] .sell span").text("卖");
            $("#market .market-item[id] .trade > :first-child").text("线");
            $("#market .market-item[id] .trade .zero").text("×");
        }

        $("#market-qty").after(`
          <div class="market-item vb" id="script_market_top_row" style="overflow:hidden">
            <span style="margin-left: auto; margin-right: 0.2rem; float:right;">
              ${!game.global.race['no_trade']?`
              <span class="has-text-success" style="width: 2.75rem; margin-right: 0.3em; display: inline-block; text-align: center;">买</span>
              <span class="has-text-danger" style="width: 2.75rem; margin-right: 0.3em; display: inline-block; text-align: center;">卖</span>`:''}
              <span class="has-text-warning" style="width: 2.75rem; margin-right: 0.3em; display: inline-block; text-align: center;">线买</span>
              <span class="has-text-warning" style="width: 2.75rem; display: inline-block; text-align: center;">线卖</span>
            </span>
          </div>`);

        for (let resource of MarketManager.priorityList) {
            if (resource === resources.Food && game.global.race['artifical']) {
                continue;
            }
            let marketElement = $('#market-' + resource.id);
            if (marketElement.length > 0) {
                let marketRow = $('<span class="ea-market-toggle" style="margin-left: auto; margin-right: 0.2rem; float:right;"></span>');

                if (!game.global.race['no_trade']) {
                    let buyKey = 'buy' + resource.id;
                    let sellKey = 'sell' + resource.id;
                    marketRow.append(
                      addToggleCallbacks($(`<label tabindex="0" title="允许购买此项资源。" class="switch"><input class="script_${buyKey}" type="checkbox"${settingsRaw[buyKey] ? " checked" : ""}><span class="check" style="height:5px;"></span><span class="state"></span></label>`), buyKey),
                      addToggleCallbacks($(`<label tabindex="0" title="允许出售此项资源。" class="switch"><input class="script_${sellKey}" type="checkbox"${settingsRaw[sellKey] ? " checked" : ""}><span class="check" style="height:5px;"></span><span class="state"></span></label>`), sellKey));
                }

                let tradeBuyKey = 'res_trade_buy_' + resource.id;
                let tradeSellKey = 'res_trade_sell_' + resource.id;
                marketRow.append(
                  addToggleCallbacks($(`<label tabindex="0" title="允许使用贸易路线购买此项资源。" class="switch"><input class="script_${tradeBuyKey}" type="checkbox"${settingsRaw[tradeBuyKey] ? " checked" : ""}><span class="check" style="height:5px;"></span><span class="state"></span></label>`), tradeBuyKey),
                  addToggleCallbacks($(`<label tabindex="0" title="允许使用贸易路线出售此项资源。" class="switch"><input class="script_${tradeSellKey}" type="checkbox"${settingsRaw[tradeSellKey] ? " checked" : ""}><span class="check" style="height:5px;"></span><span class="state"></span></label>`), tradeSellKey));

                marketRow.appendTo(marketElement);
            }
        }
    }

    function removeMarketToggles() {
        $('#market .ea-market-toggle').remove();
        $("#script_market_top_row").remove();

        if (!game.global.race['no_trade']) {
            $("#market .market-item[id] .res").width("7.5rem");
            $("#market .market-item[id] .buy span").text(game.loc('resource_market_buy'));
            $("#market .market-item[id] .sell span").text(game.loc('resource_market_sell'));
            $("#market .market-item[id] .trade > :first-child").text(game.loc('resource_market_routes'));
            $("#market .market-item[id] .trade .zero").text(game.loc('cancel_routes'));
        }
    }

    function createStorageToggles() {
        removeStorageToggles();

        $("#createHead").after(`
          <div class="market-item vb" id="script_storage_top_row" style="overflow:hidden">
            <span style="margin-left: auto; margin-right: 0.2rem; float:right;">
            <span class="has-text-warning" style="width: 2.75rem; margin-right: 0.3em; display: inline-block; text-align: center;">自动</span>
            <span class="has-text-warning" style="width: 2.75rem; display: inline-block; text-align: center;">溢出</span>
            </span>
          </div>`);

        for (let resource of StorageManager.priorityList) {
            let storageElement = $('#stack-' + resource.id);
            if (storageElement.length > 0) {
                let storeKey = "res_storage" + resource.id;
                let overKey = "res_storage_o_" + resource.id;
                $(`<span class="ea-storage-toggle" style="margin-left: auto; margin-right: 0.2rem; float:right;"></span>`)
                  .append(
                    addToggleCallbacks($(`<label tabindex="0" title="允许此项资源的存储分配。" class="switch"><input class="script_${storeKey}" type="checkbox"${settingsRaw[storeKey] ? " checked" : ""}><span class="check" style="height:5px;"></span><span class="state"></span></label>`), storeKey),
                    addToggleCallbacks($(`<label tabindex="0" title="允许此项资源对溢出部分的存储分配。" class="switch"><input class="script_${overKey}" type="checkbox"${settingsRaw[overKey] ? " checked" : ""}><span class="check" style="height:5px;"></span><span class="state"></span></label>`), overKey))
                  .appendTo(storageElement);
            }
        }
    }

    function removeStorageToggles() {
        $('#resStorage .ea-storage-toggle').remove();
        $("#script_storage_top_row").remove();
    }

    function sorterHelper(event, ui) {
        let clone = $(ui).clone();
        clone.css('position','absolute');
        return clone.get(0);
    }

    // Util functions
    // https://gist.github.com/axelpale/3118596
    function k_combinations(set, k) {
        if (k > set.length || k <= 0) {
            return [[]];
        }
        if (k == set.length) {
            return [set];
        }
        if (k == 1) {
            return set.map(i => [i]);
        }
        let combs = [];
        let tailcombs = [];
        for (let i = 0; i < set.length - k + 1; i++) {
            tailcombs = k_combinations(set.slice(i + 1), k - 1);
            for (let j = 0; j < tailcombs.length; j++) {
                combs.push([set[i], ...tailcombs[j]])
            }
        }
        return combs;
    }

    // https://stackoverflow.com/a/44012184
    function* cartesian(head, ...tail) {
        let remainder = tail.length > 0 ? cartesian(...tail) : [[]];
        for (let r of remainder) for (let h of head) yield [h, ...r];
    }

    function average(arr) {
        return arr.reduce((sum, val) => sum + val) / arr.length;
    }

    function getUnsuitedMod() {
        return !game.global.blood.unbound ? 0 : game.global.blood.unbound >= 4 ? 0.95 : game.global.blood.unbound >= 2 ? 0.9 : 0.8;
    }

    // Script hooked to fastTick fired 4 times per second
    function ticksPerSecond() {
        return 4 / settings.tickRate / (game.global.settings.at ? 2 : 1);
    }

    // main.js -> Soldier Healing
    function getHealingRate() {
        let hc = game.global.race['artifical']
          ? buildings.BootCamp.count
          : buildings.Hospital.count;
        hc *= game.global.tech['medic'] || 1;
        hc += (game.global.race['fibroblast'] * 2) || 0;
        if (game.global.city.s_alter?.regen > 0){
            if (hc >= 20) {
                hc *= traitVal("cannibalize", 0, '+');
            } else {
                hc += Math.floor(traitVal("cannibalize", 0) / 5);
            }
        }
        if (getGovernor() === 'sports') {
            hc *= 1.5;
        }
        let max_bound = 20 * traitVal('slow_regen', 0, '+');

        return traitVal('regenerative', 0, 1) + Math.round(hc) / max_bound;
    }

    // main.js -> Citizen Growth
    function getGrowthRate() {
        if (game.global.race['artifical'] || (game.global.race['spongy'] && game.global.city.calendar.weather === 0) ||
           (game.global.race['parasite'] && game.global.city.calendar.wind === 0 && !game.global.race['cataclysm'])) {
            return 0;
        }
        let date = new Date();
        let lb = game.global.tech['reproduction'] ?? 0;
        if (haveTech('reproduction') && date.getMonth() === 1 && date.getDate() === 14) {
            lb += 5;
        }
        lb *= traitVal('fast_growth', 0, 1);
        lb += traitVal('fast_growth', 1, 0);
        if (game.global.race['spores'] && game.global.city.calendar.wind === 1){
            if (game.global.race['parasite']) {
                lb += traitVal('spores', 2);
            } else {
                lb += traitVal('spores', 0);
                lb *= traitVal('spores', 1);
            }
        }
        lb += buildings.Hospital.count * (haveTech('reproduction', 2) ? 1 : 0);
        lb += game.global.genes['birth'] ?? 0;
        lb += game.global.race['promiscuous'] ?? 0;
        let base = resources.Population.currentQuantity * (game.global.city.ptrait === 'toxic' ? 1.25 : 1);
        if (game.global.race['parasite'] && game.global.race['cataclysm']){
            lb = Math.round(lb / 5);
            base *= 3;
        }
        return lb / (base * 1.810792884997279 / 2);
    }

    function getResourcesPerClick() {
        return traitVal('strong', 0, 1) * (game.global.genes['enhance'] ? 2 : 1);
    }

    function getCostConflict(action) {
        for (let priorityTarget of state.conflictTargets) {
            let blockKnowledge = true;
            for (let res in priorityTarget.cost) {
                if (res !== "Knowledge" && resources[res].currentQuantity < priorityTarget.cost[res]) {
                    blockKnowledge = false;
                    break;
                }
            }
            for (let res in priorityTarget.cost) {
                if ((res !== "Knowledge" || blockKnowledge) && priorityTarget.cost[res] > resources[res].currentQuantity - action.cost[res]) {
                    return {res: resources[res], obj: priorityTarget};
                }
            }
        }
        return null;
    }

    function resetMultiplier() {
        // Make sure no multipliers keys are pressed, having them on while script clicking buttons may lead to nasty consequences, including loss of resources(if auto storage remove 25000 crates instead of 1)
        if (state.multiplierTick !== state.scriptTick && game.global.settings.mKeys) {
            state.multiplierTick = state.scriptTick;
            document.dispatchEvent(new KeyboardEvent("keyup", {key: game.global.settings.keyMap.x10}));
            document.dispatchEvent(new KeyboardEvent("keyup", {key: game.global.settings.keyMap.x25}));
            document.dispatchEvent(new KeyboardEvent("keyup", {key: game.global.settings.keyMap.x100}));
        }
    }

    function getRealNumber(amountText) {
        if (amountText === "") { return 0; }

        let numericPortion = parseFloat(amountText);
        let lastChar = amountText[amountText.length - 1];

        if (numberSuffix[lastChar] !== undefined) {
            numericPortion *= numberSuffix[lastChar];
        }

        return numericPortion;
    }

    function getNumberString(amountValue) {
        let suffixes = Object.keys(numberSuffix);
        for (let i = suffixes.length - 1; i >= 0; i--) {
            if (amountValue > numberSuffix[suffixes[i]]) {
                return (amountValue / numberSuffix[suffixes[i]]).toFixed(1) + suffixes[i];
            }
        }
        return Math.ceil(amountValue);
    }

    function getNiceNumber(amountValue) {
        return parseFloat(amountValue < 1 ? amountValue.toPrecision(2) : amountValue.toFixed(2));
    }

    function getGovernor() {
        return game.global.race.governor?.g?.bg ?? "none";
    }

    function haveTask(task) {
        return Object.values(game.global.race.governor?.tasks ?? {}).includes(task);
    }

    function haveTech(research, level = 1) {
        return game.global.tech[research] && game.global.tech[research] >= level;
    }

    function isHungryRace() {
        return (game.global.race['carnivore'] && !game.global.race['herbivore'] && !game.global.race['artifical']) || game.global.race['ravenous'];
    }

    function isDemonRace() {
        return game.global.race['soul_eater'] && game.global.race['evil'] && game.global.race.species !== 'wendigo';
    }

    function isLumberRace() {
        return !game.global.race['kindling_kindred'] && !game.global.race['smoldering'];
    }

    function getOccCosts() {
        return game.global.civic.govern.type === "federation" ? 15 : 20;
    }

    function getGovName(govIndex) {
        let foreign = game.global.civic.foreign["gov" + govIndex];
        if (!foreign.name) {
            return "foreign power " + (govIndex + 1);
        }

        return poly.loc("civics_gov" + foreign.name.s0, [foreign.name.s1]) + ` (${govIndex + 1})`;
    }

    function getGovPower(govIndex) {
        // This function is full of hacks. But all that can be accomplished by wise player without peeking inside game variables
        // We really need to know power as accurate as possible, otherwise script becomes wonky when spies dies on mission
        let gov = game.global.civic.foreign["gov" + govIndex];
        if (gov.spy > 0) {
            // With 2+ spies we know exact number, for 1 we're assuming trick with advantage
            // We can see ambush advantage with a single spy, and knowing advantage we can calculate power
            // Proof of concept: military_power = army_offence / (5 / (1-advantage))
            // I'm not going to waste time parsing tooltips, and take that from internal variable instead
            return gov.mil;
        } else {
            // We're going to use another trick here. We know minimum and maximum power for gov
            // If current power is below minimum, that means we sabotaged it already, but spy died since that
            // We know we seen it for sure, so let's just peek inside, imitating memory
            // We could cache those values, but making it persistent in between of page reloads would be a pain
            // Especially considering that player can not only reset, but also import different save at any moment
            let minPower = [75, 125, 200, 650, 300];
            let maxPower = [125, 175, 300, 750, 300];
            if (game.global.race['truepath']) {
                [1.5, 1.4, 1.25].forEach((mod, idx) => {
                    minPower[idx] *= mod;
                    maxPower[idx] *= mod;
                });
            }

            if (gov.mil < minPower[govIndex]) {
                return gov.mil;
            } else {
                // Above minimum. Even if we ever sabotaged it, unfortunately we can't prove it. Not peeking inside, and assuming worst.
                return maxPower[govIndex];
            }
        }
    }

    function getVueById(elementId) {
        let element = win.document.getElementById(elementId);
        if (element === null || !element.__vue__) {
            return undefined;
        }

        return element.__vue__;
    }

    // Recursively traverse through object, wrapping all functions in getters
    function normalizeProperties(object, proto = []) {
        for (let key in object) {
            if (typeof object[key] === "object" && (object[key].constructor === Object || object[key].constructor === Array || proto.indexOf(object[key].constructor) !== -1)) {
                object[key] = normalizeProperties(object[key], proto);
            }
            if (typeof object[key] === "function") {
                let fn = object[key].bind(object);
                Object.defineProperty(object, key, {configurable: true, enumerable: true, get: () => fn()});
            }
        }
        return object;
    }

    // Add getters for setting properties
    function addProps(list, id, props) {
        for (let item of Object.values(list)) {
            for (let i = 0; i < props.length; i++) {
                let settingKey = props[i].s + id(item);
                let propertyKey = props[i].p;
                Object.defineProperty(item, propertyKey, {configurable: true, enumerable: true, get: () => settings[settingKey]});
            }
        }
        return list;
    }

    function traitVal(trait, idx, opt) {
        if (game.global.race[trait]) {
            let val = game.traits[trait].vars()[idx];
            if (opt === "-") {
                return 1 - val / 100;
            } else if (opt === "+") {
                return 1 + val / 100;
            } else {
                return val;
            }
        } else if (opt === '+' || opt === '-') {
            return 1;
        } else {
            return opt ?? 0;
        }
    }

    var poly = {
    // Taken directly from game code with no functional changes, and minified.
        // export function arpaAdjustCosts(costs) from arpa.js
        arpaAdjustCosts: function(t){return t=function(t){var r=traitVal('creative',1,'-');if(r<1){var a={};return Object.keys(t).forEach(function(e){a[e]=function(){return t[e]()*r}}),a}return t}(t),poly.adjustCosts({cost:t})},
        // function govPrice(gov) from civics.js
        govPrice: function(e){let o=game.global.civic.foreign[`gov${e}`],i=15384*o.eco;return i*=1+1.6*o.hstl/100,+(i*=1-.25*o.unrest/100).toFixed(0)},
        // export const galaxyOffers from resources.js
        // This one does *not* work exactly like in game: game's function is bugged, and doesn't track mutation out of kindling kindred, here it's fixed, and change of trait will take immediate effect, without reloading page. Reimplementing this bug would require additional efforts, as polyfills initialized before we have access to game state, and we don't know traits at this time. Players doesn't mutate out of kindled kindered daily, and even if someone will - he will also need to fix game bug by reloading, and that will also sync return values of this poly with game implementation again, so no big deal...
        galaxyOffers: normalizeProperties([{buy:{res:"Deuterium",vol:5},sell:{res:"Helium_3",vol:25}},{buy:{res:"Neutronium",vol:2.5},sell:{res:"Copper",vol:200}},{buy:{res:"Adamantite",vol:3},sell:{res:"Iron",vol:300}},{buy:{res:"Elerium",vol:1},sell:{res:"Oil",vol:125}},{buy:{res:"Nano_Tube",vol:10},sell:{res:"Titanium",vol:20}},{buy:{res:"Graphene",vol:25},sell:{res:()=>game.global.race.kindling_kindred||game.global.race.smoldering?game.global.race.smoldering?"Chrysotile":"Stone":"Lumber",vol:1e3}},{buy:{res:"Stanene",vol:40},sell:{res:"Aluminium",vol:800}},{buy:{res:"Bolognium",vol:.75},sell:{res:"Uranium",vol:4}},{buy:{res:"Vitreloy",vol:1},sell:{res:"Infernite",vol:1}}]),
        // export const supplyValue from resources.js
        supplyValue: {Lumber:{in:.5,out:25e3},Chrysotile:{in:.5,out:25e3},Stone:{in:.5,out:25e3},Crystal:{in:3,out:25e3},Furs:{in:3,out:25e3},Copper:{in:1.5,out:25e3},Iron:{in:1.5,out:25e3},Aluminium:{in:2.5,out:25e3},Cement:{in:3,out:25e3},Coal:{in:1.5,out:25e3},Oil:{in:2.5,out:12e3},Uranium:{in:5,out:300},Steel:{in:3,out:25e3},Titanium:{in:3,out:25e3},Alloy:{in:6,out:25e3},Polymer:{in:6,out:25e3},Iridium:{in:8,out:25e3},Helium_3:{in:4.5,out:12e3},Deuterium:{in:4,out:1e3},Neutronium:{in:15,out:1e3},Adamantite:{in:12.5,out:1e3},Infernite:{in:25,out:250},Elerium:{in:30,out:250},Nano_Tube:{in:6.5,out:1e3},Graphene:{in:5,out:1e3},Stanene:{in:4.5,out:1e3},Bolognium:{in:18,out:1e3},Vitreloy:{in:14,out:1e3},Orichalcum:{in:10,out:1e3},Plywood:{in:10,out:250},Brick:{in:10,out:250},Wrought_Iron:{in:10,out:250},Sheet_Metal:{in:10,out:250},Mythril:{in:12.5,out:250},Aerogel:{in:16.5,out:250},Nanoweave:{in:18,out:250},Scarletite:{in:35,out:250}},
        // export const monsters from portal.js
        monsters: {fire_elm:{weapon:{laser:1.05,flame:0,plasma:.25,kinetic:.5,missile:.5,sonic:1,shotgun:.75,tesla:.65},nozone:{freeze:!0,flooded:!0},amp:{hot:1.75,humid:.8,steam:.9}},water_elm:{weapon:{laser:.65,flame:.5,plasma:1,kinetic:.2,missile:.5,sonic:.5,shotgun:.25,tesla:.75},nozone:{hot:!0,freeze:!0},amp:{steam:1.5,river:1.1,flooded:2,rain:1.75,humid:1.25}},rock_golem:{weapon:{laser:1,flame:.5,plasma:1,kinetic:.65,missile:.95,sonic:.75,shotgun:.35,tesla:0},nozone:{},amp:{}},bone_golem:{weapon:{laser:.45,flame:.35,plasma:.55,kinetic:1,missile:1,sonic:.75,shotgun:.75,tesla:.15},nozone:{},amp:{}},mech_dino:{weapon:{laser:.85,flame:.05,plasma:.55,kinetic:.45,missile:.5,sonic:.35,shotgun:.5,tesla:1},nozone:{},amp:{}},plant:{weapon:{laser:.42,flame:1,plasma:.65,kinetic:.2,missile:.25,sonic:.75,shotgun:.35,tesla:.38},nozone:{},amp:{}},crazed:{weapon:{laser:.5,flame:.85,plasma:.65,kinetic:1,missile:.35,sonic:.15,shotgun:.95,tesla:.6},nozone:{},amp:{}},minotaur:{weapon:{laser:.32,flame:.5,plasma:.82,kinetic:.44,missile:1,sonic:.15,shotgun:.2,tesla:.35},nozone:{},amp:{}},ooze:{weapon:{laser:.2,flame:.65,plasma:1,kinetic:0,missile:0,sonic:.85,shotgun:0,tesla:.15},nozone:{},amp:{}},zombie:{weapon:{laser:.35,flame:1,plasma:.45,kinetic:.08,missile:.8,sonic:.18,shotgun:.95,tesla:.05},nozone:{},amp:{}},raptor:{weapon:{laser:.68,flame:.55,plasma:.85,kinetic:1,missile:.44,sonic:.22,shotgun:.33,tesla:.66},nozone:{},amp:{}},frost_giant:{weapon:{laser:.9,flame:.82,plasma:1,kinetic:.25,missile:.08,sonic:.45,shotgun:.28,tesla:.5},nozone:{hot:!0},amp:{freeze:2.5,hail:1.65}},swarm:{weapon:{laser:.02,flame:1,plasma:.04,kinetic:.01,missile:.08,sonic:.66,shotgun:.38,tesla:.45},nozone:{},amp:{}},dragon:{weapon:{laser:.18,flame:0,plasma:.12,kinetic:.35,missile:1,sonic:.22,shotgun:.65,tesla:.15},nozone:{},amp:{}},mech_dragon:{weapon:{laser:.84,flame:.1,plasma:.68,kinetic:.18,missile:.75,sonic:.22,shotgun:.28,tesla:1},nozone:{},amp:{}},construct:{weapon:{laser:.5,flame:.2,plasma:.6,kinetic:.34,missile:.9,sonic:.08,shotgun:.28,tesla:1},nozone:{},amp:{}},beholder:{weapon:{laser:.75,flame:.15,plasma:1,kinetic:.45,missile:.05,sonic:.01,shotgun:.12,tesla:.3},nozone:{},amp:{}},worm:{weapon:{laser:.55,flame:.38,plasma:.45,kinetic:.2,missile:.05,sonic:1,shotgun:.02,tesla:.01},nozone:{},amp:{}},hydra:{weapon:{laser:.85,flame:.75,plasma:.85,kinetic:.25,missile:.45,sonic:.5,shotgun:.6,tesla:.65},nozone:{},amp:{}},colossus:{weapon:{laser:1,flame:.05,plasma:.75,kinetic:.45,missile:1,sonic:.35,shotgun:.35,tesla:.5},nozone:{},amp:{}},lich:{weapon:{laser:.1,flame:.1,plasma:.1,kinetic:.45,missile:.75,sonic:.35,shotgun:.75,tesla:.5},nozone:{},amp:{}},ape:{weapon:{laser:1,flame:.95,plasma:.85,kinetic:.5,missile:.5,sonic:.05,shotgun:.35,tesla:.68},nozone:{},amp:{}},bandit:{weapon:{laser:.65,flame:.5,plasma:.85,kinetic:1,missile:.5,sonic:.25,shotgun:.75,tesla:.25},nozone:{},amp:{}},croc:{weapon:{laser:.65,flame:.05,plasma:.6,kinetic:.5,missile:.5,sonic:1,shotgun:.2,tesla:.75},nozone:{},amp:{}},djinni:{weapon:{laser:0,flame:.35,plasma:1,kinetic:.15,missile:0,sonic:.65,shotgun:.22,tesla:.4},nozone:{},amp:{}},snake:{weapon:{laser:.5,flame:.5,plasma:.5,kinetic:.5,missile:.5,sonic:.5,shotgun:.5,tesla:.5},nozone:{},amp:{}},centipede:{weapon:{laser:.5,flame:.85,plasma:.95,kinetic:.65,missile:.6,sonic:0,shotgun:.5,tesla:.01},nozone:{},amp:{}},spider:{weapon:{laser:.65,flame:1,plasma:.22,kinetic:.75,missile:.15,sonic:.38,shotgun:.9,tesla:.18},nozone:{},amp:{}},manticore:{weapon:{laser:.05,flame:.25,plasma:.95,kinetic:.5,missile:.15,sonic:.48,shotgun:.4,tesla:.6},nozone:{},amp:{}},fiend:{weapon:{laser:.75,flame:.25,plasma:.5,kinetic:.25,missile:.75,sonic:.25,shotgun:.5,tesla:.5},nozone:{},amp:{}},bat:{weapon:{laser:.16,flame:.18,plasma:.12,kinetic:.25,missile:.02,sonic:1,shotgun:.9,tesla:.58},nozone:{},amp:{}},medusa:{weapon:{laser:.35,flame:.1,plasma:.3,kinetic:.95,missile:1,sonic:.15,shotgun:.88,tesla:.26},nozone:{},amp:{}},ettin:{weapon:{laser:.5,flame:.35,plasma:.8,kinetic:.5,missile:.25,sonic:.3,shotgun:.6,tesla:.09},nozone:{},amp:{}},faceless:{weapon:{laser:.6,flame:.28,plasma:.6,kinetic:0,missile:.05,sonic:.8,shotgun:.15,tesla:1},nozone:{},amp:{}},enchanted:{weapon:{laser:1,flame:.02,plasma:.95,kinetic:.2,missile:.7,sonic:.05,shotgun:.65,tesla:.01},nozone:{},amp:{}},gargoyle:{weapon:{laser:.15,flame:.4,plasma:.3,kinetic:.5,missile:.5,sonic:.85,shotgun:1,tesla:.2},nozone:{},amp:{}},chimera:{weapon:{laser:.38,flame:.6,plasma:.42,kinetic:.85,missile:.35,sonic:.5,shotgun:.65,tesla:.8},nozone:{},amp:{}},gorgon:{weapon:{laser:.65,flame:.65,plasma:.65,kinetic:.65,missile:.65,sonic:.65,shotgun:.65,tesla:.65},nozone:{},amp:{}},kraken:{weapon:{laser:.75,flame:.35,plasma:.75,kinetic:.35,missile:.5,sonic:.18,shotgun:.05,tesla:.85},nozone:{},amp:{}},homunculus:{weapon:{laser:.05,flame:1,plasma:.1,kinetic:.85,missile:.65,sonic:.5,shotgun:.75,tesla:.2},nozone:{},amp:{}}},
        // export function hellSupression(area, val) from portal.js
        hellSupression: function(t,e){switch(t){case"ruins":{let t=e||buildings.RuinsGuardPost.stateOnCount,r=75*buildings.RuinsArcology.stateOnCount,a=game.armyRating(t,"hellArmy",0);game.global.race.holy&&(a*=1.25);let l=(a+r)/5e3;return{supress:l>1?1:l,rating:a+r}}case"gate":{let t=poly.hellSupression("ruins",e),r=100*buildings.GateTurret.stateOnCount;game.global.race.holy&&(r*=1.25);let a=(t.rating+r)/7500;return{supress:a>1?1:a,rating:t.rating+r}}default:return 0}},
        // function taxCap(min) from civics.js
        taxCap: function(e){let a=(haveTech("currency",5)||game.global.race.terrifying)&&!game.global.race.noble;if(e)return a?0:traitVal("noble",0,10);{let e=traitVal("noble",1,30);return a&&(e+=20),"oligarchy"===game.global.civic.govern.type&&(e+=20),"noble"===getGovernor()&&(e+=10),e}},
        // export function mechCost(size,infernal) from portal.js
        mechCost: function(e,a,x){let l=9999,r=1e7;switch(e){case"small":{let e=(x??game.global.blood.prepared)>=2?5e4:75e3;r=a?2.5*e:e,l=a?20:1}break;case"medium":r=a?45e4:18e4,l=a?100:4;break;case"large":r=a?925e3:375e3,l=a?500:20;break;case"titan":r=a?15e5:75e4,l=a?1500:75;break;case"collector":{let e=(x??game.global.blood.prepared)>=2?8e3:1e4;r=a?2.5*e:e,l=1}}return{s:l,c:r}},
        // function terrainRating(mech,rating,effects) from portal.js
        terrainRating: function(e,i,s,x){return!e.equip.includes("special")||"small"!==e.size&&"medium"!==e.size&&"collector"!==e.size||i<1&&(i+=(1-i)*(s.includes("gravity")?.1:.2)),"small"!==e.size&&i<1&&(i+=(s.includes("fog")||s.includes("dark")?.005:.01)*(x??game.global.portal.mechbay.scouts))>1&&(i=1),i},
        // function weaponPower(mech,power) from portal.js
        weaponPower: function(e,i){return i<1&&0!==i&&e.equip.includes("special")&&"titan"===e.size&&(i+=.25*(1-i)),e.equip.includes("special")&&"large"===e.size&&(i*=1.02),i},
        // export function timeFormat(time) from functions.js
        timeFormat: function(e){let i;if(e<0)i=game.loc("time_never");else if((e=+e.toFixed(0))>60){let l=e%60,s=(e-l)/60;if(s>=60){let e=s%60,l=(s-e)/60;if(l>24){i=`${(l-(e=l%24))/24}d ${e}h`}else i=`${l}h ${e=("0"+e).slice(-2)}m`}else i=`${s=("0"+s).slice(-2)}m ${l=("0"+l).slice(-2)}s`}else i=`${e=("0"+e).slice(-2)}s`;return i},
        // export universeAffix(universe) from achieve.js
        universeAffix: function(e){switch(e=e||game.global.race.universe){case"evil":return"e";case"antimatter":return"a";case"heavy":return"h";case"micro":return"m";case"magic":return"mg";default:return"l"}},
        // function shipCosts(bp) from truepath.js
        shipCosts: function(e){let a={},r=1,u=1,n=1;switch(e.class){case"corvette":a.Money=25e5,a.Aluminium=5e5,r=1,u=1,n=2;break;case"frigate":a.Money=5e6,a.Aluminium=125e4,r=1.1,u=1.09,n=1.5;break;case"destroyer":a.Money=15e6,a.Aluminium=35e5,r=1.2,u=1.18,n=1.2;break;case"cruiser":a.Money=5e7,a.Adamantite=1e6,r=1.3,u=1.25;break;case"battlecruiser":a.Money=125e6,a.Adamantite=26e5,r=1.35,u=1.3,n=.8;break;case"dreadnought":a.Money=5e8,a.Adamantite=8e6,r=1.4,u=1.35,n=.5}switch(e.armor){case"steel":a.Steel=Math.round(35e4**r);break;case"alloy":a.Alloy=Math.round(25e4**r);break;case"neutronium":a.Neutronium=Math.round(1e4**r)}switch(e.engine){case"ion":a.Titanium=Math.round(75e3**u);break;case"tie":a.Titanium=Math.round(15e4**u);break;case"pulse":a.Titanium=Math.round(125e3**u);break;case"photon":a.Titanium=Math.round(21e4**u);break;case"vacuum":a.Titanium=Math.round(3e5**u)}switch(e.power){case"solar":case"diesel":a["dreadnought"===e.class?"Orichalcum":"Copper"]=Math.round(4e4**r),a.Iridium=Math.round(15e3**u);break;case"fission":a["dreadnought"===e.class?"Orichalcum":"Copper"]=Math.round(5e4**r),a.Iridium=Math.round(3e4**u);break;case"fusion":a["dreadnought"===e.class?"Orichalcum":"Copper"]=Math.round(5e4**r),a.Iridium=Math.round(4e4**u);break;case"elerium":a["dreadnought"===e.class?"Orichalcum":"Copper"]=Math.round(6e4**r),a.Iridium=Math.round(55e3**u)}switch(e.sensor){case"radar":a.Money=Math.round(a.Money**1.05);break;case"lidar":a.Money=Math.round(a.Money**1.12);break;case"quantum":a.Money=Math.round(a.Money**1.25)}switch(e.weapon){case"railgun":a.Iron=Math.round(25e3**r);break;case"laser":a.Iridium=Math.round(a.Iridium**1.05),a.Nano_Tube=Math.round(12e3**r);break;case"p_laser":a.Iridium=Math.round(a.Iridium**1.035),a.Nano_Tube=Math.round(12e3**r);break;case"plasma":a.Iridium=Math.round(a.Iridium**1.1),a.Nano_Tube=Math.round(2e4**r);break;case"phaser":a.Iridium=Math.round(a.Iridium**1.15),a.Quantium=Math.round(18e3**r);break;case"disruptor":a.Iridium=Math.round(a.Iridium**1.2),a.Quantium=Math.round(35e3**r)}let i=0;game.global.space.shipyard.ships.forEach(function(a){a.class===e.class&&i++});let o=1+(i-2)/25*n;return Object.keys(a).forEach(function(e){i<2?a[e]=Math.ceil(a[e]*(0===i?.75:.9)):i>2&&(a[e]=Math.ceil(a[e]*o))}),a},

    // Reimplemented:
        // export function crateValue() from resources.js
        crateValue: () => Number(getVueById("createHead")?.buildCrateDesc().match(/(\d+)/g)[1] ?? 0),
        // export function containerValue() from resources.js
        containerValue: () => Number(getVueById("createHead")?.buildContainerDesc().match(/(\d+)/g)[1] ?? 0),
        // export function piracy(region, true, true) from space.js
        piracy: region => Number(getVueById(region)?.$options.filters.defense(region) ?? 0),

    // Firefox compatibility:
        adjustCosts: (c_action, wiki) => game.adjustCosts(cloneInto(c_action, unsafeWindow, {cloneFunctions: true}), wiki),
        loc: (key, variables) => game.loc(key, cloneInto(variables, unsafeWindow)),
        messageQueue: (msg, color, dnr, tags) => game.messageQueue(msg, color, dnr, cloneInto(tags, unsafeWindow)),
    };

    $().ready(mainAutoEvolveScript);

})($);