// ==UserScript==
// @name         MilkyWayIdleCombatSim
// @namespace    TheVoid...
// @version      0.0.4
// @description  Milky Way Idle Combat Simulator
// @author       TheVoid
// @match        *://*www.milkywayidle.com/*
// @match        *://*test.milkywayidle.com/*
// @icon         https://static.miraheze.org/milkywayidlewiki/a/a3/Power.svg
// @grant        unsafeWindow
// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/501447/MilkyWayIdleCombatSim.user.js
// @updateURL https://update.greasyfork.org/scripts/501447/MilkyWayIdleCombatSim.meta.js
// ==/UserScript==

const simulatedHours = 2;
const ONE_SECOND = 1e9;
const ONE_HOUR = 60 * 60 * ONE_SECOND;
const maxTries = 100;
var tries = 0;
var monsterData;
var abilityData;
var itemData;
var zoneData;
var combatTriggerDependencyDetailMap;
var zoneHrids = {};
var simResults = {};
var allCombatZones;
var playerCombatData;
var playerHouseRooms;
var houseRoomDetailMap;
var playerCombatTriggers = [];
var playerAbilities = [{}, {}, {}, {}, {}];
var playerDrinks = [{}, {}, {}, {}];
var playerFood = [{}, {}, {}, {}];
var simulationRunning = false;
var shouldSim = true;
var playerConsumableTriggers;
var playerDTO = {};
var combatTabPanelContainer;
var testin = true;

(function() {
    'use strict';

    const observer = new MutationObserver(mutationsList => {
        for (let mutation of mutationsList) {
            if (mutation.type === 'childList' && mutation.target.textContent.startsWith("Smelly Planet")) {
                findAndUpdateCombatZones();
            }
        }
    });

    const config = { attributes: true, childList: true, subtree: true, attributeFilter: ['style'] };

    function updateAdditionalTextBoxText(additionalTextBox, zoneName) {
        const spawnInfo = zoneData[zoneHrids[zoneName]]?.combatZoneInfo?.fightInfo?.randomSpawnInfo?.spawns;
        const kills = simResults[zoneName]?.kills;
        const deaths = simResults[zoneName]?.deaths;
        const totalExperience = simResults[zoneName]?.totalExperience;
        const attackExperience = simResults[zoneName]?.attackExperience;
        const defenseExperience = simResults[zoneName]?.defenseExperience;
        const intelligenceExperience = simResults[zoneName]?.intelligenceExperience;
        const magicExperience = simResults[zoneName]?.magicExperience;
        const powerExperience = simResults[zoneName]?.powerExperience;
        const rangedExperience = simResults[zoneName]?.rangedExperience;
        const staminaExperience = simResults[zoneName]?.staminaExperience;

        let text;

        if (spawnInfo) {
            if (kills !== null || deaths !== null || totalExperience !== null) {
                text = `PER HOUR:\nkills: ${kills}\ndeaths: ${deaths}\nExp: ${totalExperience}\nStam: ${staminaExperience}\nDef: ${defenseExperience}\nInt: ${intelligenceExperience}\nAtt: ${attackExperience}\nPow: ${powerExperience}\nMage: ${magicExperience}\nRange: ${rangedExperience}`;
            } else {
                text = 'Sim processing...';
            }
        } else {
            text = 'No Sim Data';
        }

        additionalTextBox.style.textAlign = 'left';
        additionalTextBox.style.position = 'relative';
        additionalTextBox.style.zIndex = '99';
        additionalTextBox.innerText = text;
        additionalTextBox.style.backgroundColor = 'rgba(0, 0, 0, 0.5)';
        additionalTextBox.style.whiteSpace = 'nowrap';
        additionalTextBox.style.overflow = 'auto';
        additionalTextBox.style.padding = '10px';
        additionalTextBox.style.maxWidth = '100%';
        additionalTextBox.style.maxHeight = '80%';
    }

    function addOrUpdateAdditionalTextBox(zone) {
        var zoneElement = zone.querySelector('.SkillAction_name__2VPXa');
        if (zoneElement) {
            const zoneName = zoneElement.innerText.trim();

            let additionalTextBox = zone.querySelector('.additional-text-box');

            if (!additionalTextBox) {
                additionalTextBox = document.createElement('div');
                additionalTextBox.classList.add('additional-text-box');
                zone.appendChild(additionalTextBox);
            } else if (!zone.contains(additionalTextBox)) {
                zone.appendChild(additionalTextBox);
                //console.log('additional-text-box reattached for zone:', zoneName);
            }
            updateAdditionalTextBoxText(additionalTextBox, zoneName);
        }
    }

    function handleCombatPanelVisibility() {
        const combatPanel = document.querySelector('.CombatPanel_combatPanel__QylPo');
        if (!combatPanel) {
            setTimeout(handleCombatPanelVisibility, 1000);
            return;
        }
        combatTabPanelContainer = combatPanel.querySelector('.TabsComponent_tabPanelsContainer__26mzo');
        try {
            findAndUpdateCombatZones();
        } catch(e) {
        }
        observer.observe(combatTabPanelContainer, config);
    }

    function findAndUpdateCombatZones() {
        const combatTabPanel = combatTabPanelContainer.querySelector('.TabPanel_tabPanel__tXMJF');
        const combatZonesSection = combatTabPanel.querySelector('.CombatZones_combatZones__6VliY');
        allCombatZones = combatZonesSection.querySelectorAll('.SkillAction_skillAction__1esCp');
        refreshSimData();
    }

        function clearSimData() {
            for (const zoneName in simResults) {
                if (Object.prototype.hasOwnProperty.call(simResults, zoneName)) {
                    simResults[zoneName].kills = null;
                    simResults[zoneName].deaths = null;
                    simResults[zoneName].attackExperience = null;
                    simResults[zoneName].powerExperience = null;
                    simResults[zoneName].defenceExperience = null;
                    simResults[zoneName].rangedExperience = null;
                    simResults[zoneName].magicExperience = null;
                    simResults[zoneName].staminaExperience = null;
                    simResults[zoneName].intelligenceExperience = null;
                    simResults[zoneName].totalExperience = null;
                }
            }
        }

    function refreshSimData() {
        allCombatZones.forEach(function(zone) {
            addOrUpdateAdditionalTextBox(zone);
        });
    }

    document.addEventListener('DOMContentLoaded', function() {
        handleCombatPanelVisibility();
    });

    //Changed hook logic to function similarly to MWITools because it was interfering with it previously
    function hookWS() {
        const dataProperty = Object.getOwnPropertyDescriptor(MessageEvent.prototype, "data");
        const oriGet = dataProperty.get;

        dataProperty.get = hookedGet;
        Object.defineProperty(MessageEvent.prototype, "data", dataProperty);

        function hookedGet() {
            const socket = this.currentTarget;
            if (!(socket instanceof WebSocket)) {
                return oriGet.call(this);
            }
            if (socket.url.indexOf("api.milkywayidle.com/ws") <= -1 && socket.url.indexOf("api-test.milkywayidle.com/ws") <= -1) {
                return oriGet.call(this);
            }

            const message = oriGet.call(this);
            Object.defineProperty(this, "data", { value: message }); // Anti-loop

            return handleMessage(message);
        }
    }

    function handleMessage(message) {
            const msg = JSON.parse(message);
            if (msg.type === 'init_client_data') {
                zoneData = msg.actionDetailMap;
                for (var key in zoneData) {
                    if (key.startsWith("/actions/combat")) {
                        var zone = zoneData[key];
                        zoneHrids[zone.name] = zone.hrid;
                        simResults[zone.name] = {
                            kills: null,
                            deaths: null,
                            exp: null
                        };
                    }
                }
                abilityData = msg.abilityDetailMap;
                itemData = msg.itemDetailMap;
                combatTriggerDependencyDetailMap = msg.combatTriggerDependencyDetailMap;
                houseRoomDetailMap = msg.houseRoomDetailMap;
                monsterData = msg.combatMonsterDetailMap;
            } else if (msg.type === 'init_character_data') {
                for (let i = 0; i < msg.characterAbilities.length; i++) {
                    if(msg.characterAbilities[i].slotNumber !== 0)
                        playerAbilities[msg.characterAbilities[i].slotNumber - 1] = msg.characterAbilities[i];
                }
                for (let i = 0; i < msg.actionTypeDrinkSlotsMap['/action_types/combat'].length; i++) {
                    playerDrinks[i] = msg.actionTypeDrinkSlotsMap['/action_types/combat'][i];
                }
                for (let i = 0; i < msg.actionTypeFoodSlotsMap['/action_types/combat'].length; i++) {
                    playerFood[i] = msg.actionTypeFoodSlotsMap['/action_types/combat'][i];
                }
                playerHouseRooms = msg.characterHouseRoomMap;
                playerCombatTriggers = msg.abilityCombatTriggersMap;
                playerConsumableTriggers = msg.consumableCombatTriggersMap;
                playerCombatData = msg.combatUnit;
            } else if (msg.type === 'character_stats_updated') {
                playerCombatData = msg.combatUnit;
                if (!shouldSim)
                    shouldSim = true;
            } else if (msg.type === 'combat_triggers_updated') {
                if(msg.combatTriggerTypeHrid === '/combat_trigger_types/consumable') {
                    playerConsumableTriggers[msg.itemHrid] = msg.combatTriggers;
                } else if(msg.combatTriggerTypeHrid === '/combat_trigger_types/ability') {
                    playerCombatTriggers[msg.abilityHrid] = msg.combatTriggers;
                }
                if (!shouldSim)
                    shouldSim = true;
            } else if (msg.type === 'abilities_updated') {
                if(msg.endCharacterAbilities.length === 1) {
                    if(msg.endCharacterAbilities[0].slotNumber === 0) {
                        const indexToRemove = playerAbilities.findIndex(item => item.abilityHrid === msg.endCharacterAbilities[0].abilityHrid);
                        if (indexToRemove !== -1) {
                            playerAbilities[indexToRemove] = {};
                            if (!shouldSim)
                                shouldSim = true;
                        }
                    } else {
                            playerAbilities[msg.endCharacterAbilities[0].slotNumber - 1] = msg.endCharacterAbilities[0];
                    }
                } else {
                    var indexToUpdate;
                    if(msg.endCharacterAbilities[0].slotNumber !== 0) {
                        indexToUpdate = msg.endCharacterAbilities[0].slotNumber - 1;
                        playerAbilities[indexToUpdate] = msg.endCharacterAbilities[0];
                    } else {
                        indexToUpdate = msg.endCharacterAbilities[1].slotNumber - 1;
                        playerAbilities[indexToUpdate] = msg.endCharacterAbilities[1];
                    }
                }
            } else if (msg.type === 'action_type_consumable_slots_updated') {
                for (let i = 0; i < msg.actionTypeDrinkSlotsMap['/action_types/combat'].length; i++) {
                    playerDrinks[i] = msg.actionTypeDrinkSlotsMap['/action_types/combat'][i];
                }
                for (let i = 0; i < msg.actionTypeFoodSlotsMap['/action_types/combat'].length; i++) {
                    playerFood[i] = msg.actionTypeFoodSlotsMap['/action_types/combat'][i];
                }
            }
            if(!simulationRunning && playerCombatData && monsterData && shouldSim) {
                simulationRunning = true;
                shouldSim = false;
                generateSimulation();
            }
            return message;
    }

    function updatePlayerFood() {
        for (let i = 0; i < playerFood.length; i++) {
            let obj = playerFood[i];
            if (obj && obj.itemHrid && playerConsumableTriggers[obj.itemHrid]) {
                obj.triggers = playerConsumableTriggers[obj.itemHrid];
            }
        }
    }

    function updatePlayerDrinks() {
        for (let i = 0; i < playerDrinks.length; i++) {
            let obj = playerDrinks[i];
            if (obj && obj.itemHrid && playerConsumableTriggers[obj.itemHrid]) {
                obj.triggers = playerConsumableTriggers[obj.itemHrid];
            }
        }
    }

    function updatePlayerAbilities() {
        for (let i = 0; i < playerAbilities.length; i++) {
            let obj = playerAbilities[i];
            if (obj && obj.abilityHrid && playerCombatTriggers[obj.abilityHrid]) {
                obj.triggers = playerCombatTriggers[obj.abilityHrid];
            }
        }
    }

    //Using updated Sim logic from MWISim
    const workerScript = `
    const ONE_SECOND = 1e9;
    const ONE_HOUR = 60 * 60 * ONE_SECOND;
    const HOT_TICK_INTERVAL = 5 * ONE_SECOND;
    const DOT_TICK_INTERVAL = 5 * ONE_SECOND;
    const REGEN_TICK_INTERVAL = 10 * ONE_SECOND;
    const ENEMY_RESPAWN_INTERVAL = 3 * ONE_SECOND;
    const PLAYER_RESPAWN_INTERVAL = 150 * ONE_SECOND;
    var houseRoomDetailMap;
    var itemData;
    var monsterData;
    var abilityData;
    var playerHouseRooms;
    var zoneData;
    var zoneHrids;
    var player;
    var simulationTimeLimit;
    var simulatedHours;
    var combatTriggerDependencyDetailMap;
    var simResults;

class SimulationManager {
        constructor() {
            this.simulations = [];
        }

        addSimulation(sim) {
            this.simulations.push(sim);
        }

        async startSimulations() {
            const simulationPromises = this.simulations.map(simulation => simulation.simulate(simulationTimeLimit));
            await Promise.all(simulationPromises);
            console.log('All simulations completed.');
        }
}

class Buff {
    startTime;

    constructor(buff, level = 1) {
        this.uniqueHrid = buff.uniqueHrid;
        this.typeHrid = buff.typeHrid;
        this.ratioBoost = buff.ratioBoost + (level - 1) * buff.ratioBoostLevelBonus;
        this.flatBoost = buff.flatBoost + (level - 1) * buff.flatBoostLevelBonus;
        this.duration = buff.duration;
    }
}

class CombatUnit {
    isPlayer;
    isStunned = false;
    stunExpireTime = null;
    isBlinded = false;
    blindExpireTime = null;
    isSilenced = false;
    silenceExpireTime = null;
    curseExpiretime = null;

    // Base levels which don't change after initialization
    staminaLevel = 1;
    intelligenceLevel = 1;
    attackLevel = 1;
    powerLevel = 1;
    defenseLevel = 1;
    rangedLevel = 1;
    magicLevel = 1;

    abilities = [null, null, null, null];
    food = [null, null, null];
    drinks = [null, null, null];
    houseRooms = [];
    dropTable = [];
    rareDropTable = [];
    abilityManaCosts = new Map();

    // Calculated combat stats including temporary buffs
    combatDetails = {
        staminaLevel: 1,
        intelligenceLevel: 1,
        attackLevel: 1,
        powerLevel: 1,
        defenseLevel: 1,
        rangedLevel: 1,
        magicLevel: 1,
        maxHitpoints: 110,
        currentHitpoints: 110,
        maxManapoints: 110,
        currentManapoints: 110,
        stabAccuracyRating: 11,
        slashAccuracyRating: 11,
        smashAccuracyRating: 11,
        rangedAccuracyRating: 11,
        magicAccuracyRating: 11,
        stabMaxDamage: 11,
        slashMaxDamage: 11,
        smashMaxDamage: 11,
        rangedMaxDamage: 11,
        magicMaxDamage: 11,
        stabEvasionRating: 11,
        slashEvasionRating: 11,
        smashEvasionRating: 11,
        rangedEvasionRating: 11,
        magicEvasionRating: 11,
        totalArmor: 0.2,
        totalWaterResistance: 0.4,
        totalNatureResistance: 0.4,
        totalFireResistance: 0.4,
        abilityHaste: 0,
        tenacity: 0,
        totalThreat: 100,
        combatStats: {
            combatStyleHrid: "/combat_styles/smash",
            damageType: "/damage_types/physical",
            attackInterval: 3000000000,
            autoAttackDamage: 0,
            criticalRate: 0,
            criticalDamage: 0,
            stabAccuracy: 0,
            slashAccuracy: 0,
            smashAccuracy: 0,
            rangedAccuracy: 0,
            magicAccuracy: 0,
            stabDamage: 0,
            slashDamage: 0,
            smashDamage: 0,
            rangedDamage: 0,
            magicDamage: 0,
            taskDamage: 100,
            physicalAmplify: 0,
            waterAmplify: 0,
            natureAmplify: 0,
            fireAmplify: 0,
            healingAmplify: 0,
            physicalReflectPower: 0,
            maxHitpoints: 0,
            maxManapoints: 0,
            stabEvasion: 0,
            slashEvasion: 0,
            smashEvasion: 0,
            rangedEvasion: 0,
            magicEvasion: 0,
            armor: 0,
            waterResistance: 0,
            natureResistance: 0,
            fireResistance: 0,
            lifeSteal: 0,
            HPRegen: 0.01,
            MPRegen: 0.01,
            combatDropRate: 0,
            combatDropQuantity: 0,
            combatRareFind: 0,
            combatExperience: 0,
            foodSlots: 1,
            drinkSlots: 1,
            armorPenetration: 0,
            waterPenetration: 0,
            naturePenetration: 0,
            firePenetration: 0,
            manaLeech: 0,
            castSpeed: 0,
            threat: 100,
            parry: 0,
            mayhem: 0,
            pierce: 0,
            curse: 0,
            damageTaken: 0,
            attackSpeed: 0
        },
    };
    combatBuffs = {};
    permanentBuffs = {};
    zoneBuffs = null;

    constructor() { }

    updateCombatDetails() {

        ["stamina", "intelligence", "attack", "power", "defense", "ranged", "magic"].forEach((stat) => {
            this.combatDetails[stat + "Level"] = this[stat + "Level"];
            let boosts = this.getBuffBoosts("/buff_types/" + stat + "_level");
            boosts.forEach((buff) => {
                this.combatDetails[stat + "Level"] += Math.floor(this[stat + "Level"] * buff.ratioBoost);
                this.combatDetails[stat + "Level"] += buff.flatBoost;
            });
        });
        this.combatDetails.maxHitpoints =
            10 * (10 + this.combatDetails.staminaLevel) + this.combatDetails.combatStats.maxHitpoints;
        this.combatDetails.maxManapoints =
            10 * (10 + this.combatDetails.intelligenceLevel) + this.combatDetails.combatStats.maxManapoints;

        let accuracyRatioBoost = this.getBuffBoost("/buff_types/accuracy").ratioBoost;
        let damageRatioBoost = this.getBuffBoost("/buff_types/damage").ratioBoost;

        ["stab", "slash", "smash"].forEach((style) => {
            this.combatDetails[style + "AccuracyRating"] =
                (10 + this.combatDetails.attackLevel) *
                (1 + this.combatDetails.combatStats[style + "Accuracy"]) *
                (1 + accuracyRatioBoost);
            this.combatDetails[style + "MaxDamage"] =
                (10 + this.combatDetails.powerLevel) *
                (1 + this.combatDetails.combatStats[style + "Damage"]) *
                (1 + damageRatioBoost);
            let baseEvasion = (10 + this.combatDetails.defenseLevel) * (1 + this.combatDetails.combatStats[style + "Evasion"]);
            this.combatDetails[style + "EvasionRating"] = baseEvasion;
            let evasionBoosts = this.getBuffBoosts("/buff_types/evasion");
            for (const boost of evasionBoosts) {
                this.combatDetails[style + "EvasionRating"] += boost.flatBoost;
                this.combatDetails[style + "EvasionRating"] += baseEvasion * boost.ratioBoost;
            }
        });

        this.combatDetails.rangedAccuracyRating =
            (10 + this.combatDetails.rangedLevel) *
            (1 + this.combatDetails.combatStats.rangedAccuracy) *
            (1 + accuracyRatioBoost);
        this.combatDetails.rangedMaxDamage =
            (10 + this.combatDetails.rangedLevel) *
            (1 + this.combatDetails.combatStats.rangedDamage) *
            (1 + damageRatioBoost);

        let baseRangedEvasion = (10 + this.combatDetails.defenseLevel) * (1 + this.combatDetails.combatStats.rangedEvasion);
        this.combatDetails.rangedEvasionRating = baseRangedEvasion;
        let evasionBoosts = this.getBuffBoosts("/buff_types/evasion");
        for (const boost of evasionBoosts) {
            this.combatDetails.rangedEvasionRating += boost.flatBoost;
            this.combatDetails.rangedEvasionRating += baseRangedEvasion * boost.ratioBoost;
        }

        this.combatDetails.magicAccuracyRating =
            (10 + this.combatDetails.magicLevel) *
            (1 + this.combatDetails.combatStats.magicAccuracy) *
            (1 + accuracyRatioBoost);
        this.combatDetails.magicMaxDamage =
            (10 + this.combatDetails.magicLevel) *
            (1 + this.combatDetails.combatStats.magicDamage) *
            (1 + damageRatioBoost);

        let baseMagicEvasion = (10 + (this.combatDetails.defenseLevel * 0.75 + this.combatDetails.rangedLevel * 0.25)) * (1 + this.combatDetails.combatStats.magicEvasion);
        this.combatDetails.magicEvasionRating = baseMagicEvasion;
        for (const boost of evasionBoosts) {
            this.combatDetails.magicEvasionRating += boost.flatBoost;
            this.combatDetails.magicEvasionRating += baseMagicEvasion * boost.ratioBoost;
        }

        this.combatDetails.combatStats.physicalAmplify += this.getBuffBoost("/buff_types/physical_amplify").flatBoost;
        this.combatDetails.combatStats.waterAmplify += this.getBuffBoost("/buff_types/water_amplify").flatBoost;
        this.combatDetails.combatStats.natureAmplify += this.getBuffBoost("/buff_types/nature_amplify").flatBoost;
        this.combatDetails.combatStats.fireAmplify += this.getBuffBoost("/buff_types/fire_amplify").flatBoost;

        if (this.isPlayer) {
            this.combatDetails.combatStats.attackInterval /= (1 + (this.combatDetails.attackLevel / 2000));
        }
        let baseAttackSpeed = this.combatDetails.combatStats.attackSpeed;
        let attackIntervalBoosts = this.getBuffBoosts("/buff_types/attack_speed");
        let attackIntervalRatioBoost = attackIntervalBoosts
            .map((boost) => boost.ratioBoost)
            .reduce((prev, cur) => prev + cur, 0);
        this.combatDetails.combatStats.attackInterval /= (1 + (baseAttackSpeed + attackIntervalRatioBoost));

        let baseArmor = 0.2 * this.combatDetails.defenseLevel + this.combatDetails.combatStats.armor;
        this.combatDetails.totalArmor = baseArmor;
        let armorBoosts = this.getBuffBoosts("/buff_types/armor");
        for (const boost of armorBoosts) {
            this.combatDetails.totalArmor += boost.flatBoost;
            this.combatDetails.totalArmor += baseArmor * boost.ratioBoost;
        }

        let baseWaterResistance =
            0.1 * (this.combatDetails.defenseLevel + this.combatDetails.magicLevel) +
            this.combatDetails.combatStats.waterResistance;
        this.combatDetails.totalWaterResistance = baseWaterResistance;
        let waterResistanceBoosts = this.getBuffBoosts("/buff_types/water_resistance");
        for (const boost of waterResistanceBoosts) {
            this.combatDetails.totalWaterResistance += boost.flatBoost;
            this.combatDetails.totalWaterResistance += baseWaterResistance * boost.ratioBoost;
        }

        let baseNatureResistance =
            0.1 * (this.combatDetails.defenseLevel + this.combatDetails.magicLevel) +
            this.combatDetails.combatStats.natureResistance;
        this.combatDetails.totalNatureResistance = baseNatureResistance;
        let natureResistanceBoosts = this.getBuffBoosts("/buff_types/nature_resistance");
        for (const boost of natureResistanceBoosts) {
            this.combatDetails.totalNatureResistance += boost.flatBoost;
            this.combatDetails.totalNatureResistance += baseNatureResistance * boost.ratioBoost;
        }

        let baseFireResistance =
            0.1 * (this.combatDetails.defenseLevel + this.combatDetails.magicLevel) +
            this.combatDetails.combatStats.fireResistance;
        this.combatDetails.totalFireResistance = baseFireResistance;
        let fireResistanceBoosts = this.getBuffBoosts("/buff_types/fire_resistance");
        for (const boost of fireResistanceBoosts) {
            this.combatDetails.totalFireResistance += boost.flatBoost;
            this.combatDetails.totalFireResistance += baseFireResistance * boost.ratioBoost;
        }

        let hpRegenBoosts = this.getBuffBoost("/buff_types/hp_regen");
        this.combatDetails.combatStats.HPRegen += this.combatDetails.combatStats.HPRegen * hpRegenBoosts.ratioBoost;
        this.combatDetails.combatStats.HPRegen += hpRegenBoosts.flatBoost;

        let mpRegenBoosts = this.getBuffBoost("/buff_types/mp_regen");
        this.combatDetails.combatStats.MPRegen += this.combatDetails.combatStats.MPRegen * mpRegenBoosts.ratioBoost;
        this.combatDetails.combatStats.MPRegen += mpRegenBoosts.flatBoost;

        this.combatDetails.combatStats.lifeSteal += this.getBuffBoost("/buff_types/life_steal").flatBoost;
        this.combatDetails.combatStats.physicalReflectPower += this.getBuffBoost(
            "/buff_types/physical_reflect_power"
        ).flatBoost;
        this.combatDetails.combatStats.combatExperience += this.getBuffBoost("/buff_types/wisdom").flatBoost;
        this.combatDetails.combatStats.criticalRate += this.getBuffBoost("/buff_types/critical_rate").flatBoost;
        this.combatDetails.combatStats.criticalDamage += this.getBuffBoost("/buff_types/critical_damage").flatBoost;
        this.combatDetails.combatStats.castSpeed += this.getBuffBoost("/buff_types/cast_speed").flatBoost;

        let combatDropRateBoosts = this.getBuffBoost("/buff_types/combat_drop_rate");
        this.combatDetails.combatStats.combatDropRate += (1 + this.combatDetails.combatStats.combatDropRate) * combatDropRateBoosts.ratioBoost;
        this.combatDetails.combatStats.combatDropRate += combatDropRateBoosts.flatBoost;
        let combatRareFindBoosts = this.getBuffBoost("/buff_types/rare_find");
        this.combatDetails.combatStats.combatRareFind += (1 + this.combatDetails.combatStats.combatRareFind) * combatRareFindBoosts.ratioBoost;
        this.combatDetails.combatStats.combatRareFind += combatRareFindBoosts.flatBoost;

        let baseThreat = 100 + this.combatDetails.combatStats.threat;
        this.combatDetails.totalThreat = baseThreat;
        let threatBoosts = this.getBuffBoost("/buff_types/threat");
        this.combatDetails.combatStats.threat += baseThreat * threatBoosts.ratioBoost;
        this.combatDetails.combatStats.threat += threatBoosts.flatBoost;
    }

    addBuff(buff, currentTime) {
        buff.startTime = currentTime;
        this.combatBuffs[buff.uniqueHrid] = buff;

        this.updateCombatDetails();
    }

    addPermanentBuff(buff) {
        if (this.permanentBuffs[buff.typeHrid]) {
            this.permanentBuffs[buff.typeHrid].flatBoost += buff.flatBoost;
            this.permanentBuffs[buff.typeHrid].ratioBoost += buff.ratioBoost;
        } else {
            this.permanentBuffs[buff.typeHrid] = buff;
        }
    }

    generatePermanentBuffs() {
        for (let i = 0; i < this.houseRooms.length; i++) {
            const houseRoom = this.houseRooms[i];
            houseRoom.buffs.forEach(buff => {
                this.addPermanentBuff(buff);
            });
        }
        if (this.zoneBuffs) {
            this.zoneBuffs.forEach(buff => {
                this.addPermanentBuff(buff);
            });
        }
    }

    removeExpiredBuffs(currentTime) {
        let expiredBuffs = Object.values(this.combatBuffs).filter(
            (buff) => buff.startTime + buff.duration <= currentTime
        );
        expiredBuffs.forEach((buff) => {
            delete this.combatBuffs[buff.uniqueHrid];
        });
        this.updateCombatDetails();
    }

    clearBuffs() {
        this.combatBuffs = structuredClone(this.permanentBuffs);
        this.updateCombatDetails();
    }

    clearCCs() {
        this.isStunned = false;
        this.stunExpireTime = null;
        this.isSilenced = false;
        this.silenceExpireTime = null;
        this.isBlinded = false;
        this.blindExpireTime = null;
        this.combatDetails.combatStats.damageTaken = 0;
        this.curseExpireTime = null;
    }

    getBuffBoosts(type) {
        let boosts = [];
        Object.values(this.combatBuffs)
            .filter((buff) => buff.typeHrid == type)
            .forEach((buff) => {
                boosts.push({ ratioBoost: buff.ratioBoost, flatBoost: buff.flatBoost });
            });

        return boosts;
    }

    getBuffBoost(type) {
        let boosts = this.getBuffBoosts(type);

        let boost = {
            ratioBoost: 0,
            flatBoost: 0,
        };

        for (let i = 0; i < boosts.length; i++) {
            boost.ratioBoost += boosts[i]?.ratioBoost ?? 0;
            boost.flatBoost += boosts[i]?.flatBoost ?? 0;
        }

        return boost;
    }

    reset(currentTime = 0) {
        this.clearCCs();
        this.clearBuffs();
        this.updateCombatDetails();
        this.resetCooldowns(currentTime);
        this.combatDetails.currentHitpoints = this.combatDetails.maxHitpoints;
        this.combatDetails.currentManapoints = this.combatDetails.maxManapoints;
    }

    resetCooldowns(currentTime = 0) {
        this.food.filter((food) => food != null).forEach((food) => (food.lastUsed = Number.MIN_SAFE_INTEGER));
        this.drinks.filter((drink) => drink != null).forEach((drink) => (drink.lastUsed = Number.MIN_SAFE_INTEGER));

        let haste = this.combatDetails.combatStats.abilityHaste;

        this.abilities
            .filter((ability) => ability != null)
            .forEach((ability) => {
                if (this.isPlayer) {
                    ability.lastUsed = Number.MIN_SAFE_INTEGER;
                } else {
                    let cooldownDuration = ability.cooldownDuration;
                    if (haste > 0) {
                        cooldownDuration = cooldownDuration * 100 / (100 + haste);
                    }
                    ability.lastUsed = currentTime - Math.floor(cooldownDuration * 0.5) + Math.floor(Math.random() * cooldownDuration * 0.5);
                }
            });
    }

    addHitpoints(hitpoints) {
        let hitpointsAdded = 0;

        if (this.combatDetails.currentHitpoints >= this.combatDetails.maxHitpoints) {
            return hitpointsAdded;
        }

        let newHitpoints = Math.min(this.combatDetails.currentHitpoints + hitpoints, this.combatDetails.maxHitpoints);
        hitpointsAdded = newHitpoints - this.combatDetails.currentHitpoints;
        this.combatDetails.currentHitpoints = newHitpoints;
        return hitpointsAdded;
    }

    addManapoints(manapoints) {
        let manapointsAdded = 0;

        if (this.combatDetails.currentManapoints >= this.combatDetails.maxManapoints) {
            return manapointsAdded;
        }

        let newManapoints = Math.min(
            this.combatDetails.currentManapoints + manapoints,
            this.combatDetails.maxManapoints
        );
        manapointsAdded = newManapoints - this.combatDetails.currentManapoints;
        this.combatDetails.currentManapoints = newManapoints;

        return manapointsAdded;
    }
}

class Monster extends CombatUnit {

    eliteTier = 0;

    constructor(hrid, eliteTier = 0) {
        super();

        this.isPlayer = false;
        this.hrid = hrid;
        this.eliteTier = eliteTier;

        let gameMonster = monsterData[this.hrid];
        if (!gameMonster) {
            throw new Error("No monster found for hrid: " + this.hrid);
        }

        for (let i = 0; i < gameMonster.abilities.length; i++) {
            if (gameMonster.abilities[i].minEliteTier > this.eliteTier) {
                continue;
            }
            this.abilities[i] = new Ability(gameMonster.abilities[i].abilityHrid, gameMonster.abilities[i].level);
        }
    }

    updateCombatDetails() {
        let gameMonster = monsterData[this.hrid];

        switch (this.eliteTier) {
            case 2:
                this.staminaLevel = gameMonster.elite2CombatDetails.staminaLevel;
                this.intelligenceLevel = gameMonster.elite2CombatDetails.intelligenceLevel;
                this.attackLevel = gameMonster.elite2CombatDetails.attackLevel;
                this.powerLevel = gameMonster.elite2CombatDetails.powerLevel;
                this.defenseLevel = gameMonster.elite2CombatDetails.defenseLevel;
                this.rangedLevel = gameMonster.elite2CombatDetails.rangedLevel;
                this.magicLevel = gameMonster.elite2CombatDetails.magicLevel;

                this.combatDetails.combatStats.combatStyleHrid = gameMonster.elite2CombatDetails.combatStats.combatStyleHrids[0];

                for (const [key, value] of Object.entries(gameMonster.elite2CombatDetails.combatStats)) {
                    this.combatDetails.combatStats[key] = value;
                }

                this.combatDetails.combatStats.attackInterval = gameMonster.elite2CombatDetails.attackInterval;
                break;
            case 1:
                this.staminaLevel = gameMonster.elite1CombatDetails.staminaLevel;
                this.intelligenceLevel = gameMonster.elite1CombatDetails.intelligenceLevel;
                this.attackLevel = gameMonster.elite1CombatDetails.attackLevel;
                this.powerLevel = gameMonster.elite1CombatDetails.powerLevel;
                this.defenseLevel = gameMonster.elite1CombatDetails.defenseLevel;
                this.rangedLevel = gameMonster.elite1CombatDetails.rangedLevel;
                this.magicLevel = gameMonster.elite1CombatDetails.magicLevel;

                this.combatDetails.combatStats.combatStyleHrid = gameMonster.elite1CombatDetails.combatStats.combatStyleHrids[0];

                for (const [key, value] of Object.entries(gameMonster.elite1CombatDetails.combatStats)) {
                    this.combatDetails.combatStats[key] = value;
                }

                this.combatDetails.combatStats.attackInterval = gameMonster.elite1CombatDetails.attackInterval;
                break;
            default:
                this.staminaLevel = gameMonster.combatDetails.staminaLevel;
                this.intelligenceLevel = gameMonster.combatDetails.intelligenceLevel;
                this.attackLevel = gameMonster.combatDetails.attackLevel;
                this.powerLevel = gameMonster.combatDetails.powerLevel;
                this.defenseLevel = gameMonster.combatDetails.defenseLevel;
                this.rangedLevel = gameMonster.combatDetails.rangedLevel;
                this.magicLevel = gameMonster.combatDetails.magicLevel;

                this.combatDetails.combatStats.combatStyleHrid = gameMonster.combatDetails.combatStats.combatStyleHrids[0];

                for (const [key, value] of Object.entries(gameMonster.combatDetails.combatStats)) {
                    this.combatDetails.combatStats[key] = value;
                }

                this.combatDetails.combatStats.attackInterval = gameMonster.combatDetails.attackInterval;
                break;
        }

        super.updateCombatDetails();
    }
}

class HouseRoom {
    constructor(hrid, level) {
        this.hrid = hrid;
        this.level = level;
        let gameHouseRoom = houseRoomDetailMap[this.hrid];
        if (!gameHouseRoom) {
            throw new Error("No house room found for hrid: " + this.hrid);
        }

        this.buffs = [];
        if (gameHouseRoom.actionBuffs) {
            for (const actionBuff of gameHouseRoom.actionBuffs) {
                let buff = new Buff(actionBuff, level);
                this.buffs.push(buff);
            }
        }
        if (gameHouseRoom.globalBuffs) {
            for (const globalBuff of gameHouseRoom.globalBuffs) {
                let buff = new Buff(globalBuff, level);
                this.buffs.push(buff);
            }
        }
    }
}

class CombatUtilities {
    static getTarget(enemies) {
        if (!enemies) {
            return null;
        }
        let target = enemies.find((enemy) => enemy.combatDetails.currentHitpoints > 0);

        return target ?? null;
    }

    static randomInt(min, max) {
        if (max < min) {
            let temp = min;
            min = max;
            max = temp;
        }

        let minCeil = Math.ceil(min);
        let maxFloor = Math.floor(max);

        if (Math.floor(min) == maxFloor) {
            return Math.floor((min + max) / 2 + Math.random());
        }

        let minTail = -1 * (min - minCeil);
        let maxTail = max - maxFloor;

        let balancedWeight = 2 * minTail + (maxFloor - minCeil);
        let balancedAverage = (maxFloor + minCeil) / 2;
        let average = (max + min) / 2;
        let extraTailWeight = (balancedWeight * (average - balancedAverage)) / (maxFloor + 1 - average);
        let extraTailChance = Math.abs(extraTailWeight / (extraTailWeight + balancedWeight));

        if (Math.random() < extraTailChance) {
            if (maxTail > minTail) {
                return Math.floor(maxFloor + 1);
            } else {
                return Math.floor(minCeil - 1);
            }
        }

        if (maxTail > minTail) {
            return Math.floor(min + Math.random() * (maxFloor + minTail - min + 1));
        } else {
            return Math.floor(minCeil - maxTail + Math.random() * (max - (minCeil - maxTail) + 1));
        }
    }

    static processAttack(source, target, abilityEffect = null) {
        let combatStyle = abilityEffect
            ? abilityEffect.combatStyleHrid
            : source.combatDetails.combatStats.combatStyleHrids;
        let damageType = abilityEffect ? abilityEffect.damageType : source.combatDetails.combatStats.damageType;

        let sourceAccuracyRating = 1;
        let sourceAutoAttackMaxDamage = 1;
        let targetEvasionRating = 1;
        combatStyle = String(combatStyle);
        switch (combatStyle) {
            case "/combat_styles/stab":
                sourceAccuracyRating = source.combatDetails.stabAccuracyRating;
                sourceAutoAttackMaxDamage = source.combatDetails.stabMaxDamage;
                targetEvasionRating = target.combatDetails.stabEvasionRating;
                break;
            case "/combat_styles/slash":
                sourceAccuracyRating = source.combatDetails.slashAccuracyRating;
                sourceAutoAttackMaxDamage = source.combatDetails.slashMaxDamage;
                targetEvasionRating = target.combatDetails.slashEvasionRating;
                break;
            case "/combat_styles/smash":
                sourceAccuracyRating = source.combatDetails.smashAccuracyRating;
                sourceAutoAttackMaxDamage = source.combatDetails.smashMaxDamage;
                targetEvasionRating = target.combatDetails.smashEvasionRating;
                break;
            case "/combat_styles/ranged":
                sourceAccuracyRating = source.combatDetails.rangedAccuracyRating;
                sourceAutoAttackMaxDamage = source.combatDetails.rangedMaxDamage;
                targetEvasionRating = target.combatDetails.rangedEvasionRating;
                break;
            case "/combat_styles/magic":
                sourceAccuracyRating = source.combatDetails.magicAccuracyRating;
                sourceAutoAttackMaxDamage = source.combatDetails.magicMaxDamage;
                targetEvasionRating = target.combatDetails.magicEvasionRating;
                break;
            default:
                throw new Error("Unknown combat style: " + combatStyle);
        }

        let sourceDamageMultiplier = 1;
        let sourceResistance = 0;
        let sourcePenetration = 0;
        let targetResistance = 0;
        let targetReflectPower = 0;
        let targetPenetration = 0;

        switch (damageType) {
            case "/damage_types/physical":
                sourceDamageMultiplier = 1 + source.combatDetails.combatStats.physicalAmplify;
                sourceResistance = source.combatDetails.totalArmor;
                sourcePenetration = source.combatDetails.combatStats.armorPenetration;
                targetResistance = target.combatDetails.totalArmor;
                targetReflectPower = target.combatDetails.combatStats.physicalReflectPower;
                targetPenetration = target.combatDetails.combatStats.armorPenetration;
                break;
            case "/damage_types/water":
                sourceDamageMultiplier = 1 + source.combatDetails.combatStats.waterAmplify;
                sourceResistance = source.combatDetails.totalWaterResistance;
                sourcePenetration = source.combatDetails.combatStats.waterPenetration;
                targetResistance = target.combatDetails.totalWaterResistance;
                break;
            case "/damage_types/nature":
                sourceDamageMultiplier = 1 + source.combatDetails.combatStats.natureAmplify;
                sourceResistance = source.combatDetails.totalNatureResistance;
                sourcePenetration = source.combatDetails.combatStats.naturePenetration;
                targetResistance = target.combatDetails.totalNatureResistance;
                break;
            case "/damage_types/fire":
                sourceDamageMultiplier = 1 + source.combatDetails.combatStats.fireAmplify;
                sourceResistance = source.combatDetails.totalFireResistance;
                sourcePenetration = source.combatDetails.combatStats.firePenetration;
                targetResistance = target.combatDetails.totalFireResistance;
                break;
            default:
                throw new Error("Unknown damage type: " + damageType);
        }

        let hitChance = 1;
        let critChance = 0;
        let bonusCritChance = source.combatDetails.combatStats.criticalRate;
        let bonusCritDamage = source.combatDetails.combatStats.criticalDamage;

        if (abilityEffect) {
            sourceAccuracyRating *= (1 + abilityEffect.bonusAccuracyRatio);
        }

        hitChance =
            Math.pow(sourceAccuracyRating, 1.4) /
            (Math.pow(sourceAccuracyRating, 1.4) + Math.pow(targetEvasionRating, 1.4));

        if (combatStyle == "/combat_styles/ranged") {
            critChance = 0.3 * hitChance;
        }

        critChance = critChance + bonusCritChance;

        let baseDamageFlat = abilityEffect ? abilityEffect.damageFlat : 0;
        let baseDamageRatio = abilityEffect ? abilityEffect.damageRatio : 1;

        let sourceMinDamage = sourceDamageMultiplier * (1 + baseDamageFlat);
        let sourceMaxDamage = sourceDamageMultiplier * (baseDamageRatio * sourceAutoAttackMaxDamage + baseDamageFlat);

        if (Math.random() < critChance) {
            sourceMaxDamage = sourceMaxDamage * (1 + bonusCritDamage);
            sourceMinDamage = sourceMaxDamage;
        }

        let damageRoll = CombatUtilities.randomInt(sourceMinDamage, sourceMaxDamage);
        damageRoll *= (1 + source.combatDetails.combatStats.taskDamage);
        damageRoll *= (1 + target.combatDetails.combatStats.damageTaken);
        if (!abilityEffect) {
            damageRoll += damageRoll * source.combatDetails.combatStats.autoAttackDamage;
        }
        let maxPremitigatedDamage = Math.min(damageRoll, target.combatDetails.currentHitpoints);

        let damageDone = 0;
        let reflectDamage = 0;
        let mitigatedReflectDamage = 0;
        let reflectDamageDone = 0;

        let didHit = false;
        if (Math.random() < hitChance) {
            didHit = true;
            let penetratedTargetResistance = targetResistance;
            if (sourcePenetration > 0 && targetResistance > 0) {
                penetratedTargetResistance = targetResistance / (1 + sourcePenetration);
            }

            let targetDamageTakenRatio = 100 / (100 + penetratedTargetResistance);
            if (penetratedTargetResistance < 0) {
                targetDamageTakenRatio = (100 - penetratedTargetResistance) / 100;
            }

            let mitigatedDamage = Math.ceil(targetDamageTakenRatio * damageRoll);
            damageDone = Math.min(mitigatedDamage, target.combatDetails.currentHitpoints);
            target.combatDetails.currentHitpoints -= damageDone;
        }

        if (targetReflectPower > 0 && targetResistance > 0) {
            let penetratedSourceResistance = sourceResistance

            if (targetPenetration > 0 && sourceResistance > 0) {
                penetratedSourceResistance = sourceResistance / (1 + targetPenetration);
            }

            let sourceDamageTakenRatio = 100 / (100 + penetratedSourceResistance);
            if (penetratedSourceResistance < 0) {
                sourceDamageTakenRatio = (100 - penetratedSourceResistance) / 100;
            }

            reflectDamage = Math.ceil(targetReflectPower * targetResistance);
            mitigatedReflectDamage = Math.ceil(sourceDamageTakenRatio * reflectDamage);
            reflectDamageDone = Math.min(mitigatedReflectDamage, source.combatDetails.currentHitpoints);
            source.combatDetails.currentHitpoints -= reflectDamageDone;
        }

        let lifeStealHeal = 0;
        if (!abilityEffect && didHit && source.combatDetails.combatStats.lifeSteal > 0) {
            lifeStealHeal = source.addHitpoints(Math.floor(source.combatDetails.combatStats.lifeSteal * damageDone));
        }

        let manaLeechMana = 0;
        if (!abilityEffect && didHit && source.combatDetails.combatStats.manaLeech > 0) {
            manaLeechMana = source.addManapoints(Math.floor(source.combatDetails.combatStats.manaLeech * damageDone));
        }

        let experienceGained = {
            source: {
                attack: 0,
                power: 0,
                ranged: 0,
                magic: 0,
            },
            target: {
                defense: 0,
                stamina: 0,
            },
        };

        let damagePrevented = maxPremitigatedDamage - damageDone;

        if (damagePrevented < 0) {
            damagePrevented = 0;
        }

        switch (combatStyle) {
            case "/combat_styles/stab":
            case "/combat_styles/slash":
            case "/combat_styles/smash":
                experienceGained.source.attack = this.calculateAttackExperience(damageDone, damagePrevented, combatStyle);
                experienceGained.source.power = this.calculatePowerExperience(damageDone, damagePrevented, combatStyle);
                break;
            case "/combat_styles/ranged":
                experienceGained.source.ranged = this.calculateRangedExperience(damageDone, damagePrevented);
                break;
            case "/combat_styles/magic":
                experienceGained.source.magic = this.calculateMagicExperience(damageDone, damagePrevented);
                break;
        }

        experienceGained.target.defense = this.calculateDefenseExperience(damagePrevented);
        experienceGained.target.stamina = this.calculateStaminaExperience(damagePrevented, damageDone);

        if (mitigatedReflectDamage > 0) {
            experienceGained.target.defense += this.calculateDefenseExperience(mitigatedReflectDamage);

            let reflectDamagePrevented = reflectDamage - reflectDamageDone;

            experienceGained.source.defense = this.calculateDefenseExperience(reflectDamagePrevented);
            experienceGained.source.stamina = this.calculateStaminaExperience(reflectDamagePrevented, reflectDamageDone);
        }

        return { damageDone, didHit, reflectDamageDone, lifeStealHeal, manaLeechMana, experienceGained };
    }

    static processHeal(source, abilityEffect, target) {
        if (abilityEffect.combatStyleHrid != "/combat_styles/magic") {
            throw new Error("Heal ability effect not supported for combat style: " + abilityEffect.combatStyleHrid);
        }

        let healingAmplify = 1 + source.combatDetails.combatStats.healingAmplify;
        let magicMaxDamage = source.combatDetails.magicMaxDamage;

        let baseHealFlat = abilityEffect.damageFlat;
        let baseHealRatio = abilityEffect.damageRatio;

        let minHeal = healingAmplify * (1 + baseHealFlat);
        let maxHeal = healingAmplify * (baseHealRatio * magicMaxDamage + baseHealFlat);

        let heal = this.randomInt(minHeal, maxHeal);
        let amountHealed = target.addHitpoints(heal);

        return amountHealed;
    }

    static processRevive(source, abilityEffect, target) {
        if (abilityEffect.combatStyleHrid != "/combat_styles/magic") {
            throw new Error("Heal ability effect not supported for combat style: " + abilityEffect.combatStyleHrid);
        }

        let healingAmplify = 1 + source.combatDetails.combatStats.healingAmplify;
        let magicMaxDamage = source.combatDetails.magicMaxDamage;

        let baseHealFlat = abilityEffect.damageFlat;
        let baseHealRatio = abilityEffect.damageRatio;

        let minHeal = healingAmplify * (1 + baseHealFlat);
        let maxHeal = healingAmplify * (baseHealRatio * magicMaxDamage + baseHealFlat);

        let heal = this.randomInt(minHeal, maxHeal);
        let amountHealed = target.addHitpoints(heal);
        target.combatDetails.currentManapoints = target.combatDetails.maxManapoints;
        target.clearCCs();
        target.clearBuffs();

        return amountHealed;
    }

    static processSpendHp(source, abilityEffect) {
        let currentHp = source.combatDetails.currentHitpoints;
        let spendHpRatio = abilityEffect.spendHpRatio;

        let spentHp = Math.floor(currentHp * spendHpRatio);

        source.combatDetails.currentHitpoints -= spentHp;

        return spentHp;
    }

    static calculateTickValue(totalValue, totalTicks, currentTick) {
        let currentSum = Math.floor((currentTick * totalValue) / totalTicks);
        let previousSum = Math.floor(((currentTick - 1) * totalValue) / totalTicks);

        return currentSum - previousSum;
    }

    static calculateStaminaExperience(damagePrevented, damageTaken) {
        return 0.03 * damagePrevented + 0.3 * damageTaken;
    }

    static calculateIntelligenceExperience(manaUsed) {
        return 0.3 * manaUsed;
    }

    static calculateAttackExperience(damage, damagePrevented, combatStyle) {
        switch (combatStyle) {
            case "/combat_styles/stab":
                return 0.54 + 0.1125 * (damage + 0.35 * damagePrevented);
            case "/combat_styles/slash":
                return 0.3 + 0.0625 * (damage + 0.35 * damagePrevented)
            case "/combat_styles/smash":
                return 0.06 + 0.0125 * (damage + 0.35 * damagePrevented)
            default:
                return 0;
        }
    }

    static calculatePowerExperience(damage, damagePrevented, combatStyle) {
        switch (combatStyle) {
            case "/combat_styles/stab":
                return 0.06 + 0.0125 * (damage + 0.35 * damagePrevented)
            case "/combat_styles/slash":
                return 0.3 + 0.0625 * (damage + 0.35 * damagePrevented)
            case "/combat_styles/smash":
                return 0.54 + 0.1125 * (damage + 0.35 * damagePrevented);
            default:
                return 0;
        }
    }

    static calculateDefenseExperience(damagePrevented) {
        return 0.4 + 0.1 * damagePrevented;
    }

    static calculateRangedExperience(damage, damagePrevented) {
        return 0.4 + 0.083375 * (damage + 0.35 * damagePrevented)
    }

    static calculateMagicExperience(damage, damagePrevented) {
        return 0.4 + 0.083375 * (damage + 0.35 * damagePrevented)
    }

    static calculateHealingExperience(healed) {
        return CombatUtilities.calculateMagicExperience(healed, 0) * 2;
    }
}

class Consumable {
    constructor(hrid, triggers = null) {
        this.hrid = hrid;
        let gameConsumable = itemData[this.hrid];
        if (!gameConsumable) {
            throw new Error("No consumable found for hrid: " + this.hrid);
        }

        this.cooldownDuration = gameConsumable.consumableDetail.cooldownDuration;
        this.hitpointRestore = gameConsumable.consumableDetail.hitpointRestore;
        this.manapointRestore = gameConsumable.consumableDetail.manapointRestore;
        this.recoveryDuration = gameConsumable.consumableDetail.recoveryDuration;

        this.buffs = [];
        if (gameConsumable.consumableDetail.buffs) {
            for (const consumableBuff of gameConsumable.consumableDetail.buffs) {
                let buff = new Buff(consumableBuff);
                this.buffs.push(buff);
            }
        }

        if (triggers) {
            this.triggers = triggers;
        } else {
            this.triggers = [];
            for (const defaultTrigger of gameConsumable.consumableDetail.defaultCombatTriggers) {
                let trigger = new Trigger(
                    defaultTrigger.dependencyHrid,
                    defaultTrigger.conditionHrid,
                    defaultTrigger.comparatorHrid,
                    defaultTrigger.value
                );
                this.triggers.push(trigger);
            }
        }

        this.lastUsed = Number.MIN_SAFE_INTEGER;
    }

    static createFromDTO(dto) {
        let triggers = dto.triggers.map((trigger) => Trigger.createFromDTO(trigger));
        let consumable = new Consumable(dto.itemHrid, triggers);

        return consumable;
    }

    shouldTrigger(currentTime, source, target, friendlies, enemies) {
        if (source.isStunned) {
            return false;
        }

        if (this.lastUsed + this.cooldownDuration > currentTime) {
            return false;
        }

        if (this.triggers.length == 0) {
            return true;
        }

        let shouldTrigger = true;
        for (const trigger of this.triggers) {
            if (!trigger.isActive(source, target, friendlies, enemies, currentTime)) {
                shouldTrigger = false;
            }
        }

        return shouldTrigger;
    }
}

class Trigger {
    constructor(dependencyHrid, conditionHrid, comparatorHrid, value = 0) {
        this.dependencyHrid = dependencyHrid;
        this.conditionHrid = conditionHrid;
        this.comparatorHrid = comparatorHrid;
        this.value = value;
    }

    static createFromDTO(dto) {
        let trigger = new Trigger(dto.dependencyHrid, dto.conditionHrid, dto.comparatorHrid, dto.value);

        return trigger;
    }

    isActive(source, target, friendlies, enemies, currentTime) {
        if (combatTriggerDependencyDetailMap[this.dependencyHrid].isSingleTarget) {
            return this.isActiveSingleTarget(source, target, currentTime);
        } else {
            return this.isActiveMultiTarget(friendlies, enemies, currentTime);
        }
    }

    isActiveSingleTarget(source, target, currentTime) {
        let dependencyValue;
        switch (this.dependencyHrid) {
            case "/combat_trigger_dependencies/self":
                dependencyValue = this.getDependencyValue(source, currentTime);
                break;
            case "/combat_trigger_dependencies/targeted_enemy":
                if (!target) {
                    return false;
                }
                dependencyValue = this.getDependencyValue(target, currentTime);
                break;
            default:
                throw new Error("Unknown dependencyHrid in trigger: " + this.dependencyHrid);
        }

        return this.compareValue(dependencyValue);
    }

    isActiveMultiTarget(friendlies, enemies, currentTime) {
        let dependency;
        switch (this.dependencyHrid) {
            case "/combat_trigger_dependencies/all_allies":
                dependency = friendlies;
                break;
            case "/combat_trigger_dependencies/all_enemies":
                if (!enemies) {
                    return false;
                }
                dependency = enemies;
                break;
            default:
                throw new Error("Unknown dependencyHrid in trigger: " + this.dependencyHrid);
        }

        let dependencyValue;
        switch (this.conditionHrid) {
            case "/combat_trigger_conditions/number_of_active_units":
                dependencyValue = dependency.filter((unit) => unit.combatDetails.currentHitpoints > 0).length;
                break;
            case "/combat_trigger_conditions/number_of_dead_units":
                dependencyValue = dependency.filter((unit) => unit.combatDetails.currentHitpoints <= 0).length;
                break;
            case "/combat_trigger_conditions/lowest_hp_percentage":
                dependencyValue = dependency.reduce((prev, curr) => {
                    let currentHpPercentage = curr.combatDetails.currentHitpoints / curr.combatDetails.maxHitpoints;
                    return currentHpPercentage < prev ? currentHpPercentage : prev;
                }, 2) * 100;
                break;
            default:
                dependencyValue = dependency
                    .map((unit) => this.getDependencyValue(unit, currentTime))
                    .reduce((prev, cur) => prev + cur, 0);
                break;
        }

        return this.compareValue(dependencyValue);
    }

    getDependencyValue(source, currentTime) {
        switch (this.conditionHrid) {
            case "/combat_trigger_conditions/berserk":
            case "/combat_trigger_conditions/elemental_affinity_fire_amplify":
            case "/combat_trigger_conditions/elemental_affinity_nature_amplify":
            case "/combat_trigger_conditions/elemental_affinity_water_amplify":
            case "/combat_trigger_conditions/frenzy":
            case "/combat_trigger_conditions/precision":
            case "/combat_trigger_conditions/spike_shell":
            case "/combat_trigger_conditions/toughness_armor":
            case "/combat_trigger_conditions/toughness_fire_resistance":
            case "/combat_trigger_conditions/toughness_nature_resistance":
            case "/combat_trigger_conditions/toughness_water_resistance":
            case "/combat_trigger_conditions/vampirism":
            case "/combat_trigger_conditions/attack_coffee":
            case "/combat_trigger_conditions/defense_coffee":
            case "/combat_trigger_conditions/intelligence_coffee_max_mp":
            case "/combat_trigger_conditions/intelligence_coffee_mp_regen":
            case "/combat_trigger_conditions/lucky_coffee":
            case "/combat_trigger_conditions/magic_coffee":
            case "/combat_trigger_conditions/power_coffee":
            case "/combat_trigger_conditions/ranged_coffee":
            case "/combat_trigger_conditions/stamina_coffee_hp_regen":
            case "/combat_trigger_conditions/stamina_coffee_max_hp":
            case "/combat_trigger_conditions/swiftness_coffee":
            case "/combat_trigger_conditions/critical_coffee_damage":
            case "/combat_trigger_conditions/critical_coffee_rate":
            case "/combat_trigger_conditions/wisdom_coffee":
            case "/combat_trigger_conditions/ice_spear":
            case "/combat_trigger_conditions/toxic_pollen_armor":
            case "/combat_trigger_conditions/toxic_pollen_fire_resistance":
            case "/combat_trigger_conditions/toxic_pollen_nature_resistance":
            case "/combat_trigger_conditions/toxic_pollen_water_resistance":
            case "/combat_trigger_conditions/puncture":
            case "/combat_trigger_conditions/frost_surge":
            case "/combat_trigger_conditions/elusiveness":
            case "/combat_trigger_conditions/channeling_coffee":
            case "/combat_trigger_conditions/aqua_aura_water_amplify":
            case "/combat_trigger_conditions/aqua_aura_water_resistance":
            case "/combat_trigger_conditions/critical_aura":
            case "/combat_trigger_conditions/fierce_aura_armor":
            case "/combat_trigger_conditions/fierce_aura_physical_amplify":
            case "/combat_trigger_conditions/flame_aura_fire_amplify":
            case "/combat_trigger_conditions/flame_aura_fire_resistance":
            case "/combat_trigger_conditions/insanity_attack_speed":
            case "/combat_trigger_conditions/insanity_cast_speed":
            case "/combat_trigger_conditions/insanity_damage":
            case "/combat_trigger_conditions/invincible_armor":
            case "/combat_trigger_conditions/invincible_fire_resistance":
            case "/combat_trigger_conditions/invincible_nature_resistance":
            case "/combat_trigger_conditions/invincible_water_resistance":
            case "/combat_trigger_conditions/provoke":
            case "/combat_trigger_conditions/speed_aura_attack_speed":
            case "/combat_trigger_conditions/speed_aura_cast_speed":
            case "/combat_trigger_conditions/sylvan_aura_healing_amplify":
            case "/combat_trigger_conditions/sylvan_aura_nature_amplify":
            case "/combat_trigger_conditions/sylvan_aura_nature_resistance":
            case "/combat_trigger_conditions/taunt":
            case "/combat_trigger_conditions/crippling_slash":
            case "/combat_trigger_conditions/mana_spring":
            case "/combat_trigger_conditions/pestilent_shot_hp_regen":
            case "/combat_trigger_conditions/pestilent_shot_mp_regen":
            case "/combat_trigger_conditions/smoke_burst":
                let buffHrid = "/buff_uniques";
                buffHrid += this.conditionHrid.slice(this.conditionHrid.lastIndexOf("/"));
                return source.combatBuffs[buffHrid];
            case "/combat_trigger_conditions/current_hp":
                return source.combatDetails.currentHitpoints;
            case "/combat_trigger_conditions/current_mp":
                return source.combatDetails.currentManapoints;
            case "/combat_trigger_conditions/missing_hp":
                return source.combatDetails.maxHitpoints - source.combatDetails.currentHitpoints;
            case "/combat_trigger_conditions/missing_mp":
                return source.combatDetails.maxManapoints - source.combatDetails.currentManapoints;
            case "/combat_trigger_conditions/stun_status":
                // Replicate the game's behaviour of "stun status active" triggers activating
                // immediately after the stun has worn off
                return source.isStunned || source.stunExpireTime == currentTime;
            case "/combat_trigger_conditions/blind_status":
                return source.isBlinded || source.blindExpireTime == currentTime;
            case "/combat_trigger_conditions/silence_status":
                return source.isSilenced || source.silenceExpireTime == currentTime;
            case "/combat_trigger_conditions/curse":
                return source.combatDetails.combatStats.damageTaken > 0 || source.curseExpireTime == currentTime;
            default:
                throw new Error("Unknown conditionHrid in trigger: " + this.conditionHrid);
        }
    }

    compareValue(dependencyValue) {
        switch (this.comparatorHrid) {
            case "/combat_trigger_comparators/greater_than_equal":
                return dependencyValue >= this.value;
            case "/combat_trigger_comparators/less_than_equal":
                return dependencyValue <= this.value;
            case "/combat_trigger_comparators/is_active":
                return !!dependencyValue;
            case "/combat_trigger_comparators/is_inactive":
                return !dependencyValue;
            default:
                throw new Error("Unknown comparatorHrid in trigger: " + this.comparatorHrid);
        }
    }
}

class Ability {
    constructor(hrid, level, triggers = null) {
        this.hrid = hrid;
        this.level = level;

        let gameAbility = abilityData[hrid];
        if (!gameAbility) {
            throw new Error("No ability found for hrid: " + this.hrid);
        }

        this.manaCost = gameAbility.manaCost;
        this.cooldownDuration = gameAbility.cooldownDuration;
        this.castDuration = gameAbility.castDuration;
        this.isSpecialAbility = gameAbility.isSpecialAbility;

        this.abilityEffects = [];

        for (const effect of gameAbility.abilityEffects) {
            let abilityEffect = {
                targetType: effect.targetType,
                effectType: effect.effectType,
                combatStyleHrid: effect.combatStyleHrid,
                damageType: effect.damageType,
                damageFlat: effect.baseDamageFlat + (this.level - 1) * effect.baseDamageFlatLevelBonus,
                damageRatio: effect.baseDamageRatio + (this.level - 1) * effect.baseDamageRatioLevelBonus,
                bonusAccuracyRatio: effect.bonusAccuracyRatio + (this.level - 1) * effect.bonusAccuracyRatioLevelBonus,
                damageOverTimeRatio: effect.damageOverTimeRatio,
                damageOverTimeDuration: effect.damageOverTimeDuration,
                pierceChance: effect.pierceChance,
                blindChance: effect.blindChance,
                blindDuration: effect.blindDuration,
                silenceChance: effect.silenceChance,
                silenceDuration: effect.silenceDuration,
                stunChance: effect.stunChance,
                stunDuration: effect.stunDuration,
                spendHpRatio: effect.spendHpRatio,
                buffs: null,
            };
            if (effect.buffs) {
                abilityEffect.buffs = [];
                for (const buff of effect.buffs) {
                    abilityEffect.buffs.push(new Buff(buff, this.level));
                }
            }
            this.abilityEffects.push(abilityEffect);
        }

        if (triggers) {
            this.triggers = triggers;
        } else {
            this.triggers = [];
            for (const defaultTrigger of gameAbility.defaultCombatTriggers) {
                let trigger = new Trigger(
                    defaultTrigger.dependencyHrid,
                    defaultTrigger.conditionHrid,
                    defaultTrigger.comparatorHrid,
                    defaultTrigger.value
                );
                this.triggers.push(trigger);
            }
        }

        this.lastUsed = Number.MIN_SAFE_INTEGER;
    }

    static createFromDTO(dto) {
        let triggers = dto.triggers.map((trigger) => Trigger.createFromDTO(trigger));
        let ability = new Ability(dto.abilityHrid, dto.level, triggers);

        return ability;
    }

    shouldTrigger(currentTime, source, target, friendlies, enemies) {
        if (source.isStunned) {
            return false;
        }

        if (source.isSilenced) {
            return false;
        }

        let haste = source.combatDetails.combatStats.abilityHaste;
        let cooldownDuration = this.cooldownDuration;
        if (haste > 0) {
            cooldownDuration = cooldownDuration * 100 / (100 + haste);
        }

        if (this.lastUsed + cooldownDuration > currentTime) {
            return false;
        }

        if (this.triggers.length == 0) {
            return true;
        }

        let shouldTrigger = true;
        for (const trigger of this.triggers) {
            if (!trigger.isActive(source, target, friendlies, enemies, currentTime)) {
                shouldTrigger = false;
            }
        }

        return shouldTrigger;
    }
}

class Zone {
    constructor(hrid) {
        this.hrid = hrid;

        let gameZone = zoneData[this.hrid];
        this.name = gameZone.name;
        this.monsterSpawnInfo = gameZone.combatZoneInfo.fightInfo;
        this.encountersKilled = 0;
        this.monsterSpawnInfo.battlesPerBoss = 10;
        this.buffs = gameZone.buffs;
    }

    getRandomEncounter() {

        if (this.monsterSpawnInfo.bossSpawns && this.encountersKilled == this.monsterSpawnInfo.battlesPerBoss) {
            this.encountersKilled = 1;
            return this.monsterSpawnInfo.bossSpawns.map((monster) => new Monster(monster.combatMonsterHrid, monster.eliteTier));
        }
        let totalWeight = this.monsterSpawnInfo.randomSpawnInfo.spawns.reduce((prev, cur) => prev + cur.rate, 0);

        let encounterHrids = [];
        let totalStrength = 0;

        outer: for (let i = 0; i < this.monsterSpawnInfo.randomSpawnInfo.maxSpawnCount; i++) {
            let randomWeight = totalWeight * Math.random();
            let cumulativeWeight = 0;

            for (const spawn of this.monsterSpawnInfo.randomSpawnInfo.spawns) {
                cumulativeWeight += spawn.rate;
                if (randomWeight <= cumulativeWeight) {
                    totalStrength += spawn.strength;

                    if (totalStrength <= this.monsterSpawnInfo.randomSpawnInfo.maxTotalStrength) {
                        encounterHrids.push({ 'hrid': spawn.combatMonsterHrid, 'eliteTier': spawn.eliteTier });
                    } else {
                        break outer;
                    }
                    break;
                }
            }
        }
        this.encountersKilled++;
        return encounterHrids.map((hrid) => new Monster(hrid.hrid, hrid.eliteTier));
    }
}

class SimResult {
    constructor() {
        this.deaths = {};
        this.experienceGained = {};
        this.encounters = 0;
        this.attacks = {};
        this.consumablesUsed = {};
        this.hitpointsGained = {};
        this.manapointsGained = {};
        this.dropRateMultiplier = 1;
        this.rareFindMultiplier = 1;
        this.playerRanOutOfMana = false;
        this.manaUsed = {};
        this.timeSpentAlive = [];
        this.bossSpawns = [];
        this.eliteTier = 0;
        this.hitpointsSpent = {};
    }

    addDeath(unit) {
        if (!this.deaths[unit.hrid]) {
            this.deaths[unit.hrid] = 0;
        }

        this.deaths[unit.hrid] += 1;
    }

    updateTimeSpentAlive(name, alive, time) {
        const i = this.timeSpentAlive.findIndex(e => e.name === name);
        if (alive) {
            if (i !== -1) {
                this.timeSpentAlive[i].alive = true;
                this.timeSpentAlive[i].spawnedAt = time;
            } else {
                this.timeSpentAlive.push({ name: name, timeSpentAlive: 0, spawnedAt: time, alive: true });
            }
        } else {
            const timeAlive = time - this.timeSpentAlive[i].spawnedAt;
            this.timeSpentAlive[i].alive = false;
            this.timeSpentAlive[i].timeSpentAlive += timeAlive;
        }
    }

    addExperienceGain(unit, type, experience) {
        if (!unit.isPlayer) {
            return;
        }

        if (!this.experienceGained[unit.hrid]) {
            this.experienceGained[unit.hrid] = {
                stamina: 0,
                intelligence: 0,
                attack: 0,
                power: 0,
                defense: 0,
                ranged: 0,
                magic: 0,
            };
        }

        this.experienceGained[unit.hrid][type] += experience * (1 + unit.combatDetails.combatStats.combatExperience);
    }

    addEncounterEnd() {
        this.encounters++;
    }

    addAttack(source, target, ability, hit) {
        if (!this.attacks[source.hrid]) {
            this.attacks[source.hrid] = {};
        }
        if (!this.attacks[source.hrid][target.hrid]) {
            this.attacks[source.hrid][target.hrid] = {};
        }
        if (!this.attacks[source.hrid][target.hrid][ability]) {
            this.attacks[source.hrid][target.hrid][ability] = {};
        }

        if (!this.attacks[source.hrid][target.hrid][ability][hit]) {
            this.attacks[source.hrid][target.hrid][ability][hit] = 0;
        }

        this.attacks[source.hrid][target.hrid][ability][hit] += 1;
    }

    addConsumableUse(unit, consumable) {
        if (!this.consumablesUsed[unit.hrid]) {
            this.consumablesUsed[unit.hrid] = {};
        }
        if (!this.consumablesUsed[unit.hrid][consumable.hrid]) {
            this.consumablesUsed[unit.hrid][consumable.hrid] = 0;
        }

        this.consumablesUsed[unit.hrid][consumable.hrid] += 1;
    }

    addHitpointsGained(unit, source, amount) {
        if (!this.hitpointsGained[unit.hrid]) {
            this.hitpointsGained[unit.hrid] = {};
        }
        if (!this.hitpointsGained[unit.hrid][source]) {
            this.hitpointsGained[unit.hrid][source] = 0;
        }

        this.hitpointsGained[unit.hrid][source] += amount;
    }

    addManapointsGained(unit, source, amount) {
        if (!this.manapointsGained[unit.hrid]) {
            this.manapointsGained[unit.hrid] = {};
        }
        if (!this.manapointsGained[unit.hrid][source]) {
            this.manapointsGained[unit.hrid][source] = 0;
        }

        this.manapointsGained[unit.hrid][source] += amount;
    }

    setDropRateMultipliers(unit) {
        this.dropRateMultiplier = 1 + unit.combatDetails.combatStats.combatDropRate;
        this.rareFindMultiplier = 1 + unit.combatDetails.combatStats.combatRareFind;
    }

    setManaUsed(unit) {
        for (let [key, value] of unit.abilityManaCosts.entries()) {
            this.manaUsed[key] = value;
        }
    }

    addHitpointsSpent(unit, source, amount) {
        if (!this.hitpointsSpent[unit.hrid]) {
            this.hitpointsSpent[unit.hrid] = {};
        }
        if (!this.hitpointsSpent[unit.hrid][source]) {
            this.hitpointsSpent[unit.hrid][source] = 0;
        }

        this.hitpointsSpent[unit.hrid][source] += amount;
    }
}

class CombatEvent {
    constructor(type, time) {
        this.type = type;
        this.time = time;
    }
}

class AutoAttackEvent extends CombatEvent {
    static type = "autoAttack";

    constructor(time, source) {
        super(AutoAttackEvent.type, time);

        this.source = source;
    }
}

class AbilityCastEndEvent extends CombatEvent {
    static type = "abilityCastEndEvent";

    constructor(time, source, ability) {
        super(AbilityCastEndEvent.type, time);

        this.source = source;
        this.ability = ability;
    }
}

class AwaitCooldownEvent extends CombatEvent {
    static type = "awaitCooldownEvent";

    constructor(time, source) {
        super(AwaitCooldownEvent.type, time);

        this.source = source;
    }
}

class BlindExpirationEvent extends CombatEvent {
    static type = "blindExpiration";

    constructor(time, source) {
        super(BlindExpirationEvent.type, time);

        this.source = source;
    }
}

class CheckBuffExpirationEvent extends CombatEvent {
    static type = "checkBuffExpiration";

    constructor(time, source) {
        super(CheckBuffExpirationEvent.type, time);

        this.source = source;
    }
}

class CombatStartEvent extends CombatEvent {
    static type = "combatStart";

    constructor(time) {
        super(CombatStartEvent.type, time);
    }
}

class ConsumableTickEvent extends CombatEvent {
    static type = "consumableTick";

    constructor(time, source, consumable, totalTicks, currentTick) {
        super(ConsumableTickEvent.type, time);

        this.source = source;
        this.consumable = consumable;
        this.totalTicks = totalTicks;
        this.currentTick = currentTick;
    }
}

class CooldownReadyEvent extends CombatEvent {
    static type = "cooldownReady";

    constructor(time) {
        super(CooldownReadyEvent.type, time);
    }
}

class CurseExpirationEvent extends CombatEvent {
    static type = "curseExpiration";

    constructor(time, source) {
        super(CurseExpirationEvent.type, time);

        this.source = source;
    }
}

class DamageOverTimeEvent extends CombatEvent {
    static type = "damageOverTime";

    constructor(time, sourceRef, target, damage, totalTicks, currentTick, combatStyleHrid) {
        super(DamageOverTimeEvent.type, time);

        // Calling it 'source' would wrongly clear Damage Over Time when the source dies
        this.sourceRef = sourceRef;
        this.target = target;
        this.damage = damage;
        this.totalTicks = totalTicks;
        this.currentTick = currentTick;
        this.combatStyleHrid = combatStyleHrid;
    }
}

class EnemyRespawnEvent extends CombatEvent {
    static type = "enemyRespawn";

    constructor(time) {
        super(EnemyRespawnEvent.type, time);
    }
}

class PlayerRespawnEvent extends CombatEvent {
    static type = "playerRespawn";

    constructor(time) {
        super(PlayerRespawnEvent.type, time);
    }
}

class RegenTickEvent extends CombatEvent {
    static type = "regenTick";

    constructor(time) {
        super(RegenTickEvent.type, time);
    }
}

class SilenceExpirationEvent extends CombatEvent {
    static type = "silenceExpiration";

    constructor(time, source) {
        super(SilenceExpirationEvent.type, time);

        this.source = source;
    }
}

class StunExpirationEvent extends CombatEvent {
    static type = "stunExpiration";

    constructor(time, source) {
        super(StunExpirationEvent.type, time);

        this.source = source;
    }
}

class EventQueue {
    constructor() {
        this.heap = [];
        this.compare = (a, b) => a.time - b.time;
    }

    addEvent(event) {
        this.heap.push(event);
        this.heapifyUp(this.heap.length - 1);
    }

    getNextEvent() {
        if (this.heap.length === 0) return null;

        const root = this.heap[0];
        const lastNode = this.heap.pop();

        if (this.heap.length > 0) {
            this.heap[0] = lastNode;
            this.heapifyDown(0);
        }

        return root;
    }

    containsEventOfType(type) {
        return this.heap.some(event => event.type === type);
    }

    clear() {
        this.heap = [];
    }

    clearEventsForUnit(unit) {
        this.clearMatching(event => event.source === unit || event.target === unit);
    }

    clearEventsOfType(type) {
        this.clearMatching(event => event.type === type);
    }

    clearMatching(fn) {
        this.heap = this.heap.filter(event => !fn(event));
        // Rebuild heap from scratch after filtering
        if (this.heap.length > 1) {
            for (let i = Math.floor(this.heap.length / 2) - 1; i >= 0; i--) {
                this.heapifyDown(i);
            }
        }
    }

    heapifyUp(index) {
        let currentIndex = index;
        while (currentIndex > 0) {
            const parentIndex = Math.floor((currentIndex - 1) / 2);
            if (this.compare(this.heap[currentIndex], this.heap[parentIndex]) >= 0) break;
            this.swap(currentIndex, parentIndex);
            currentIndex = parentIndex;
        }
    }

    heapifyDown(index) {
        let currentIndex = index;
        const lastIndex = this.heap.length - 1;

        while (true) {
            let leftChildIndex = currentIndex * 2 + 1;
            let rightChildIndex = currentIndex * 2 + 2;
            let smallestChildIndex = currentIndex;

            if (leftChildIndex <= lastIndex && this.compare(this.heap[leftChildIndex], this.heap[smallestChildIndex]) < 0) {
                smallestChildIndex = leftChildIndex;
            }

            if (rightChildIndex <= lastIndex && this.compare(this.heap[rightChildIndex], this.heap[smallestChildIndex]) < 0) {
                smallestChildIndex = rightChildIndex;
            }

            if (smallestChildIndex === currentIndex) break;

            this.swap(currentIndex, smallestChildIndex);
            currentIndex = smallestChildIndex;
        }
    }

    swap(i, j) {
        [this.heap[i], this.heap[j]] = [this.heap[j], this.heap[i]];
    }
}

class CombatSimulator extends EventTarget {
    constructor(player, zone) {
        super();
        this.players = [player];
        this.zone = zone;
        this.eventQueue = new EventQueue();
        this.simResult = new SimResult();
    }

    async simulate() {
        this.reset();

        let ticks = 0;

        let combatStartEvent = new CombatStartEvent(0);
        this.eventQueue.addEvent(combatStartEvent);
        while (this.simulationTime < simulationTimeLimit) {
            let nextEvent = this.eventQueue.getNextEvent();
            await this.processEvent(nextEvent);

        }
        this.simResult.simulatedTime = this.simulationTime;
        if (this.zone.monsterSpawnInfo.bossSpawns) {
            for (const boss of this.zone.monsterSpawnInfo.bossSpawns) {
                this.simResult.bossSpawns.push(boss.combatMonsterHrid);
            }
        }

        this.simResult.eliteTier = this.zone.monsterSpawnInfo.randomSpawnInfo.spawns[0].eliteTier;

        simResults[this.zone.name].kills = Math.round(this.simResult.encounters / simulatedHours);
        simResults[this.zone.name].deaths = this.simResult.deaths["player"] ? Math.round(this.simResult.deaths["player"] / simulatedHours): 0;
        simResults[this.zone.name].totalExperience = Math.round((Object.values(this.simResult.experienceGained["player"]).reduce((acc, val) => acc + val, 0) / simulatedHours));
        simResults[this.zone.name].attackExperience =  Math.round(this.simResult.experienceGained["player"].attack/ simulatedHours);
        simResults[this.zone.name].powerExperience =  Math.round(this.simResult.experienceGained["player"].power/ simulatedHours);
        simResults[this.zone.name].defenseExperience =  Math.round(this.simResult.experienceGained["player"].defense/ simulatedHours);
        simResults[this.zone.name].intelligenceExperience =  Math.round(this.simResult.experienceGained["player"].intelligence/ simulatedHours);
        simResults[this.zone.name].magicExperience =  Math.round(this.simResult.experienceGained["player"].magic/ simulatedHours);
        simResults[this.zone.name].rangedExperience =  Math.round(this.simResult.experienceGained["player"].ranged/ simulatedHours);
        simResults[this.zone.name].staminaExperience =  Math.round(this.simResult.experienceGained["player"].stamina/ simulatedHours);
        //console.log(this.players[0]);
        return this.simResult;
    }

    reset() {
        this.simulationTime = 0;
        this.eventQueue.clear();
        this.simResult = new SimResult();
    }

    async processEvent(event) {
        this.simulationTime = event.time;

        // console.log(this.simulationTime / 1e9, event.type, event);

        switch (event.type) {
            case CombatStartEvent.type:
                this.processCombatStartEvent(event);
                break;
            case PlayerRespawnEvent.type:
                this.processPlayerRespawnEvent(event);
                break;
            case EnemyRespawnEvent.type:
                this.processEnemyRespawnEvent(event);
                break;
            case AutoAttackEvent.type:
                this.processAutoAttackEvent(event);
                break;
            case ConsumableTickEvent.type:
                this.processConsumableTickEvent(event);
                break;
            case DamageOverTimeEvent.type:
                this.processDamageOverTimeTickEvent(event);
                break;
            case CheckBuffExpirationEvent.type:
                this.processCheckBuffExpirationEvent(event);
                break;
            case RegenTickEvent.type:
                this.processRegenTickEvent(event);
                break;
            case StunExpirationEvent.type:
                this.processStunExpirationEvent(event);
                break;
            case BlindExpirationEvent.type:
                this.processBlindExpirationEvent(event);
                break;
            case SilenceExpirationEvent.type:
                this.processSilenceExpirationEvent(event);
                break;
            case CurseExpirationEvent.type:
                this.processCurseExpirationEvent(event);
                break;
            case AbilityCastEndEvent.type:
                this.tryUseAbility(event.source, event.ability);
                break;
            case AwaitCooldownEvent.type:
                // console.log("Await CD " + (this.simulationTime / 1000000000));
                this.addNextAttackEvent(event.source);
                break;
            case CooldownReadyEvent.type:
                // Only used to check triggers
                break;
        }

        this.checkTriggers();
    }

    processCombatStartEvent(event) {
        this.players[0].generatePermanentBuffs();
        this.players[0].reset(this.simulationTime);
        let regenTickEvent = new RegenTickEvent(this.simulationTime + REGEN_TICK_INTERVAL);
        this.eventQueue.addEvent(regenTickEvent);
        this.startNewEncounter();
    }

    processPlayerRespawnEvent(event) {
        this.players[0].combatDetails.currentHitpoints = this.players[0].combatDetails.maxHitpoints;
        this.players[0].combatDetails.currentManapoints = this.players[0].combatDetails.maxManapoints;
        this.players[0].combatDetails = structuredClone(player).combatDetails;
        this.players[0].clearBuffs();
        this.players[0].clearCCs();
        this.players[0].updateCombatDetails();
        this.startAttacks();
    }

    processEnemyRespawnEvent(event) {
        this.startNewEncounter();
    }

    startNewEncounter() {
        this.enemies = this.zone.getRandomEncounter();

        this.enemies.forEach((enemy) => {
            enemy.reset(this.simulationTime);
            this.simResult.updateTimeSpentAlive(enemy.hrid, true, this.simulationTime);
            // console.log(enemy.hrid, "spawned");
        });
        this.startAttacks();
    }

    startAttacks() {
        let units = [this.players[0]];
        if (this.enemies) {
            units.push(...this.enemies);
        }

        for (const unit of units) {
            if (unit.combatDetails.currentHitpoints <= 0) {
                continue;
            }

            /*-if (unit.isPlayer) {
                // console.log("Start Attacks " + (this.simulationTime / 1000000000));
            }*/
            this.addNextAttackEvent(unit);
        }
    }

    processAutoAttackEvent(event) {
        // console.log("source:", event.source.hrid);
        // console.log("aa " + (this.simulationTime / 1000000000));

        let targets = event.source.isPlayer ? this.enemies : this.players;

        if (!targets) {
            return;
        }

        const aliveTargets = targets.filter((unit) => unit && unit.combatDetails.currentHitpoints > 0);

        for (let i = 0; i < aliveTargets.length; i++) {
            let target = aliveTargets[i];
            let source = event.source;

            if (target.combatDetails.combatStats.parry > Math.random()) {
                let temp = source;
                source = target;
                target = temp;
            }

            let attackResult = CombatUtilities.processAttack(source, target);

            let mayhem = source.combatDetails.combatStats.mayhem > Math.random();

            if (attackResult.didHit && source.combatDetails.combatStats.curse > 0) {
                target.curseExpireTime = this.simulationTime + 15000000000;
                if (target.combatDetails.combatStats.damageTaken < 0.1) {
                    target.combatDetails.combatStats.damageTaken += 0.01;
                }
                this.eventQueue.clearMatching((event) => event.type == CurseExpirationEvent.type && event.source == target)
                let curseExpirationEvent = new CurseExpirationEvent(target.curseExpireTime, target);
                this.eventQueue.addEvent(curseExpirationEvent);
            }

            if (!mayhem || (mayhem && attackResult.didHit) || (mayhem && i == (aliveTargets.length - 1))) {
                this.simResult.addAttack(
                    source,
                    target,
                    "autoAttack",
                    attackResult.didHit ? attackResult.damageDone : "miss"
                );
            }

            if (attackResult.lifeStealHeal > 0) {
                this.simResult.addHitpointsGained(source, "lifesteal", attackResult.lifeStealHeal);
            }

            if (attackResult.manaLeechMana > 0) {
                this.simResult.addManapointsGained(source, "manaLeech", attackResult.manaLeechMana);
            }

            if (attackResult.reflectDamageDone > 0) {
                this.simResult.addAttack(target, source, "physicalReflect", attackResult.reflectDamageDone);
            }

            if (mayhem && !attackResult.didHit && i < (aliveTargets.length - 1)) {
                attackResult.experienceGained.source = {
                    attack: 0,
                    power: 0,
                    ranged: 0,
                    magic: 0
                }
            }

            for (const [skill, xp] of Object.entries(attackResult.experienceGained.source)) {
                this.simResult.addExperienceGain(source, skill, xp);
            }
            for (const [skill, xp] of Object.entries(attackResult.experienceGained.target)) {
                this.simResult.addExperienceGain(target, skill, xp);
            }

            if (target.combatDetails.currentHitpoints == 0) {
                this.eventQueue.clearEventsForUnit(target);
                this.simResult.addDeath(target);
                if (!target.isPlayer) {
                    this.simResult.updateTimeSpentAlive(target.hrid, false, this.simulationTime);
                }
                // console.log(target.hrid, "died");
            }

            // Could die from reflect damage
            if (source.combatDetails.currentHitpoints == 0 && attackResult.reflectDamageDone != 0) {
                this.eventQueue.clearEventsForUnit(source);
                this.simResult.addDeath(source);
                if (!source.isPlayer) {
                    this.simResult.updateTimeSpentAlive(source.hrid, false, this.simulationTime);
                }
                break;
            }

            if (mayhem && !attackResult.didHit) {
                continue;
            }

            if (!attackResult.didHit || source.combatDetails.combatStats.pierce <= Math.random()) {
                break;
            }
        }
        if (!this.checkEncounterEnd()) {
            // console.log("!EncounterEnd " + (this.simulationTime / 1000000000));
            this.addNextAttackEvent(event.source);
        }
    }

    checkEncounterEnd() {
        let encounterEnded = false;
        if (this.enemies && !this.enemies.some((enemy) => enemy.combatDetails.currentHitpoints > 0)) {
            this.eventQueue.clearEventsOfType(AutoAttackEvent.type);
            this.eventQueue.clearEventsOfType(AbilityCastEndEvent.type);
            let enemyRespawnEvent = new EnemyRespawnEvent(this.simulationTime + ENEMY_RESPAWN_INTERVAL);
            this.eventQueue.addEvent(enemyRespawnEvent);
            this.enemies = null;

            this.simResult.addEncounterEnd();
            //console.log("All enemies died");

            encounterEnded = true;
            // console.log("encounter end " + (this.simulationTime / 1000000000))
        }

        if (
            !this.players.some((player) => player.combatDetails.currentHitpoints > 0) &&
            !this.eventQueue.containsEventOfType(PlayerRespawnEvent.type)
        ) {
            this.eventQueue.clearEventsOfType(AutoAttackEvent.type);
            this.eventQueue.clearEventsOfType(AbilityCastEndEvent.type);
            // 120 seconds respawn and 30 seconds traveling to battle
            let playerRespawnEvent = new PlayerRespawnEvent(this.simulationTime + PLAYER_RESPAWN_INTERVAL);
            this.eventQueue.addEvent(playerRespawnEvent);
            // console.log("Player died");

            encounterEnded = true;
        }

        return encounterEnded;
    }

    addNextAttackEvent(source) {
        let target;
        let friendlies;
        let enemies;
        if (source.isPlayer) {
            target = CombatUtilities.getTarget(this.enemies);
            friendlies = this.players;
            enemies = this.enemies;
        } else {
            target = CombatUtilities.getTarget(this.players);
            friendlies = this.enemies;
            enemies = this.players;
        }

        let usedAbility = false;

        source.abilities
            .filter((ability) => ability != null)
            .forEach((ability) => {
                if (!usedAbility && ability.shouldTrigger(this.simulationTime, source, target, friendlies, enemies) && this.canUseAbility(source, ability, true)) {
                    let castDuration = ability.castDuration;
                    castDuration /= (1 + source.combatDetails.combatStats.castSpeed)
                    let abilityCastEndEvent = new AbilityCastEndEvent(this.simulationTime + castDuration, source, ability);
                    this.eventQueue.addEvent(abilityCastEndEvent);
                    /*-if (source.isPlayer) {
                        let haste = source.combatDetails.combatStats.abilityHaste;
                        let cooldownDuration = ability.cooldownDuration;
                        if (haste > 0) {
                            cooldownDuration = cooldownDuration * 100 / (100 + haste);
                        }
                        //console.log((this.simulationTime / 1000000000) + " Casting " + ability.hrid + " Cast time " + (castDuration / 1e9) + " Off CD at " + ((this.simulationTime + cooldownDuration + castDuration) / 1e9) + " CD " + ((cooldownDuration) / 1e9));
                    }*/
                    usedAbility = true;
                }
            });

        if (usedAbility) {
            return;
        }


        if (!source.isBlinded) {
            let autoAttackEvent = new AutoAttackEvent(
                this.simulationTime + source.combatDetails.combatStats.attackInterval,
                source
            );
            /*-if (source.isPlayer) {
                // console.log("next attack " + ((this.simulationTime + source.combatDetails.combatStats.attackInterval) / 1e9))
            }*/
            this.eventQueue.addEvent(autoAttackEvent);
        } else {
            let nextCast = Number.MAX_SAFE_INTEGER;
            source.abilities
                .filter((ability) => ability != null)
                .forEach((ability) => {
                    // TODO account for regen tick
                    if (this.canUseAbility(source, ability, false)) {
                        let haste = source.combatDetails.combatStats.abilityHaste;
                        let cooldownDuration = ability.cooldownDuration;
                        if (haste > 0) {
                            cooldownDuration = cooldownDuration * 100 / (100 + haste);
                        }

                        let abilityNextCastTime = ability.lastUsed + cooldownDuration;

                        if (abilityNextCastTime <= source.blindExpireTime && abilityNextCastTime < nextCast) {
                            if (ability.shouldTrigger(abilityNextCastTime, source, target, friendlies, enemies)) {
                                nextCast = abilityNextCastTime;
                            }
                        }
                    }
                });

            if (nextCast > source.blindExpireTime) {
                let autoAttackEvent = new AutoAttackEvent(
                    source.blindExpireTime + source.combatDetails.combatStats.attackInterval,
                    source
                );
                /*-if (source.isPlayer) {
                    // console.log("next attack " + ((source.blindExpireTime + source.combatDetails.combatStats.attackInterval) / 1e9))
                }*/
                this.eventQueue.addEvent(autoAttackEvent);
            } else {
                let awaitCooldownEvent = new AwaitCooldownEvent(
                    nextCast,
                    source
                );
                this.eventQueue.addEvent(awaitCooldownEvent);
            }
        }
    }

    processConsumableTickEvent(event) {
        if (event.consumable.hitpointRestore > 0) {
            let tickValue = CombatUtilities.calculateTickValue(
                event.consumable.hitpointRestore,
                event.totalTicks,
                event.currentTick
            );
            let hitpointsAdded = event.source.addHitpoints(tickValue);
            this.simResult.addHitpointsGained(event.source, event.consumable.hrid, hitpointsAdded);
            // console.log("Added hitpoints:", hitpointsAdded);
        }

        if (event.consumable.manapointRestore > 0) {
            let tickValue = CombatUtilities.calculateTickValue(
                event.consumable.manapointRestore,
                event.totalTicks,
                event.currentTick
            );
            let manapointsAdded = event.source.addManapoints(tickValue);
            this.simResult.addManapointsGained(event.source, event.consumable.hrid, manapointsAdded);
            // console.log("Added manapoints:", manapointsAdded);
        }

        if (event.currentTick < event.totalTicks) {
            let consumableTickEvent = new ConsumableTickEvent(
                this.simulationTime + HOT_TICK_INTERVAL,
                event.source,
                event.consumable,
                event.totalTicks,
                event.currentTick + 1
            );
            this.eventQueue.addEvent(consumableTickEvent);
        }
    }

    processDamageOverTimeTickEvent(event) {
        let tickDamage = CombatUtilities.calculateTickValue(event.damage, event.totalTicks, event.currentTick);
        let damage = Math.min(tickDamage, event.target.combatDetails.currentHitpoints);

        event.target.combatDetails.currentHitpoints -= damage;
        this.simResult.addAttack(event.sourceRef, event.target, "damageOverTime", damage);

        let targetStaminaExperience = CombatUtilities.calculateStaminaExperience(0, damage);
        this.simResult.addExperienceGain(event.target, "stamina", targetStaminaExperience);
        // console.log(event.target.hrid, "bleed for", damage);

        switch (event.combatStyleHrid) {
            case "/combat_styles/magic":
                let sourceMagicExperience = CombatUtilities.calculateMagicExperience(damage, 0);
                this.simResult.addExperienceGain(event.sourceRef, "magic", sourceMagicExperience);
                break;
            case "/combat_styles/slash":
                let sourceAttackExperience = CombatUtilities.calculateAttackExperience(damage, 0, "/combat_styles/slash");
                this.simResult.addExperienceGain(event.sourceRef, "attack", sourceAttackExperience);
                let sourcePowerExperience = CombatUtilities.calculatePowerExperience(damage, 0, "/combat_styles/slash");
                this.simResult.addExperienceGain(event.sourceRef, "power", sourcePowerExperience);
                break;
        }

        if (event.currentTick < event.totalTicks) {
            let damageOverTimeTickEvent = new DamageOverTimeEvent(
                this.simulationTime + DOT_TICK_INTERVAL,
                event.sourceRef,
                event.target,
                event.damage,
                event.totalTicks,
                event.currentTick + 1,
                event.combatStyleHrid
            );
            this.eventQueue.addEvent(damageOverTimeTickEvent);
        }

        if (event.target.combatDetails.currentHitpoints == 0) {
            this.eventQueue.clearEventsForUnit(event.target);
            this.simResult.addDeath(event.target);
            if (!event.target.isPlayer) {
                this.simResult.updateTimeSpentAlive(event.target.hrid, false, this.simulationTime);
            }
        }

        this.checkEncounterEnd();
    }

    processRegenTickEvent(event) {
        let units = [...this.players];
        if (this.enemies) {
            units.push(...this.enemies);
        }

        for (const unit of units) {
            if (unit.combatDetails.currentHitpoints <= 0) {
                continue;
            }

            let hitpointRegen = Math.floor(unit.combatDetails.maxHitpoints * unit.combatDetails.combatStats.HPRegen);
            let hitpointsAdded = unit.addHitpoints(hitpointRegen);
            this.simResult.addHitpointsGained(unit, "regen", hitpointsAdded);

            let manapointRegen = Math.floor(unit.combatDetails.maxManapoints * unit.combatDetails.combatStats.MPRegen);
            let manapointsAdded = unit.addManapoints(manapointRegen);
            this.simResult.addManapointsGained(unit, "regen", manapointsAdded);
        }

        let regenTickEvent = new RegenTickEvent(this.simulationTime + REGEN_TICK_INTERVAL);
        this.eventQueue.addEvent(regenTickEvent);
    }

    processCheckBuffExpirationEvent(event) {
        event.source.removeExpiredBuffs(this.simulationTime);
    }

    processStunExpirationEvent(event) {
        event.source.isStunned = false;
        // console.log("Stun " + (this.simulationTime / 1000000000));
        this.addNextAttackEvent(event.source);
    }

    processBlindExpirationEvent(event) {
        event.source.isBlinded = false;
        this.addNextAttackEvent(event.source);
    }

    processSilenceExpirationEvent(event) {
        event.source.isSilenced = false;
        this.addNextAttackEvent(event.source);
    }

    processCurseExpirationEvent(event) {
        event.source.damageTaken = 0;
    }

    checkTriggers() {
        let triggeredSomething;

        do {
            triggeredSomething = false;

            this.players
                .filter((player) => player.combatDetails.currentHitpoints > 0)
                .forEach((player) => {
                    if (this.checkTriggersForUnit(player, this.players, this.enemies)) {
                        triggeredSomething = true;
                    }
                });

            if (this.enemies) {
                this.enemies
                    .filter((enemy) => enemy.combatDetails.currentHitpoints > 0)
                    .forEach((enemy) => {
                        if (this.checkTriggersForUnit(enemy, this.enemies, this.players)) {
                            triggeredSomething = true;
                        }
                    });
            }
        } while (triggeredSomething);
    }

    checkTriggersForUnit(unit, friendlies, enemies) {
        if (unit.combatDetails.currentHitpoints <= 0) {
            throw new Error("Checking triggers for a dead unit");
        }

        let triggeredSomething = false;
        let target = CombatUtilities.getTarget(enemies);

        for (const food of unit.food) {
            if (food && food.shouldTrigger(this.simulationTime, unit, target, friendlies, enemies)) {
                let result = this.tryUseConsumable(unit, food);
                if (result) {
                    triggeredSomething = true;
                }
            }
        }

        for (const drink of unit.drinks) {
            if (drink && drink.shouldTrigger(this.simulationTime, unit, target, friendlies, enemies)) {
                let result = this.tryUseConsumable(unit, drink);
                if (result) {
                    triggeredSomething = true;
                }
            }
        }

        return triggeredSomething;
    }

    tryUseConsumable(source, consumable) {
        //console.log("Consuming:", consumable);

        if (source.combatDetails.currentHitpoints <= 0) {
            return false;
        }

        consumable.lastUsed = this.simulationTime;
        let cooldownReadyEvent = new CooldownReadyEvent(this.simulationTime + consumable.cooldownDuration);
        this.eventQueue.addEvent(cooldownReadyEvent);
        this.simResult.addConsumableUse(source, consumable);

        if (consumable.recoveryDuration == 0) {
            if (consumable.hitpointRestore > 0) {
                let hitpointsAdded = source.addHitpoints(consumable.hitpointRestore);
                this.simResult.addHitpointsGained(source, consumable.hrid, hitpointsAdded);
                // console.log("Added hitpoints:", hitpointsAdded);
            }

            if (consumable.manapointRestore > 0) {
                let manapointsAdded = source.addManapoints(consumable.manapointRestore);
                this.simResult.addManapointsGained(source, consumable.hrid, manapointsAdded);
                // console.log("Added manapoints:", manapointsAdded);
            }
        } else {
            let consumableTickEvent = new ConsumableTickEvent(
                this.simulationTime + HOT_TICK_INTERVAL,
                source,
                consumable,
                consumable.recoveryDuration / HOT_TICK_INTERVAL,
                1
            );
            this.eventQueue.addEvent(consumableTickEvent);
        }

        for (const buff of consumable.buffs) {
            source.addBuff(buff, this.simulationTime);
            // console.log("Added buff:", buff);
            let checkBuffExpirationEvent = new CheckBuffExpirationEvent(this.simulationTime + buff.duration, source);
            this.eventQueue.addEvent(checkBuffExpirationEvent);
        }

        return true;
    }

    canUseAbility(source, ability, oomCheck) {
        if (source.combatDetails.currentHitpoints <= 0) {
            return false;
        }

        if (source.combatDetails.currentManapoints < ability.manaCost) {
            if (source.isPlayer && oomCheck) {
                this.simResult.playerRanOutOfMana = true;
            }
            return false;
        }
        return true;
    }

    tryUseAbility(source, ability) {

        if (!this.canUseAbility(source, ability, true)) {
            // console.log("Falseeeeeee");
            return false;
        }

        // console.log("Casting:", ability);

        if (source.isPlayer) {
            if (source.abilityManaCosts.has(ability.hrid)) {
                source.abilityManaCosts.set(ability.hrid, source.abilityManaCosts.get(ability.hrid) + ability.manaCost);
            } else {
                source.abilityManaCosts.set(ability.hrid, ability.manaCost);
            }
        }

        source.combatDetails.currentManapoints -= ability.manaCost;

        let sourceIntelligenceExperience = CombatUtilities.calculateIntelligenceExperience(ability.manaCost);
        this.simResult.addExperienceGain(source, "intelligence", sourceIntelligenceExperience);

        ability.lastUsed = this.simulationTime;

        let haste = source.combatDetails.combatStats.abilityHaste;
        let cooldownDuration = ability.cooldownDuration;
        if (haste > 0) {
            cooldownDuration = cooldownDuration * 100 / (100 + haste);
        }

        /*-if (source.isPlayer) {
            let castDuration = ability.castDuration;
            castDuration /= (1 + source.combatDetails.combatStats.castSpeed)
            // console.log((this.simulationTime / 1000000000) + " Used ability " + ability.hrid + " Cast time " + (castDuration / 1e9));
        }*/
        this.addNextAttackEvent(source);

        for (const abilityEffect of ability.abilityEffects) {
            switch (abilityEffect.effectType) {
                case "/ability_effect_types/buff":
                    this.processAbilityBuffEffect(source, ability, abilityEffect);
                    break;
                case "/ability_effect_types/damage":
                    this.processAbilityDamageEffect(source, ability, abilityEffect);
                    break;
                case "/ability_effect_types/heal":
                    this.processAbilityHealEffect(source, ability, abilityEffect);
                    break;
                case "/ability_effect_types/spend_hp":
                    this.processAbilitySpendHpEffect(source, ability, abilityEffect);
                    break;
                case "/ability_effect_types/revive":
                    this.processAbilityReviveEffect(source, ability, abilityEffect);
                    break;
                default:
                    throw new Error("Unsupported effect type for ability: " + ability.hrid + " effectType: " + abilityEffect.effectType);
            }
        }

        // Could die from reflect damage
        if (source.combatDetails.currentHitpoints == 0) {
            this.eventQueue.clearEventsForUnit(source);
            this.simResult.addDeath(source);
            if (!source.isPlayer) {
                this.simResult.updateTimeSpentAlive(source.hrid, false, this.simulationTime);
            }
        }

        this.checkEncounterEnd();

        return true;
    }

    processAbilityBuffEffect(source, ability, abilityEffect) {
        if (abilityEffect.targetType == "all allies") {
            let targets = source.isPlayer ? this.players : this.enemies;
            for (const target of targets.filter((unit) => unit && unit.combatDetails.currentHitpoints > 0)) {
                for (const buff of abilityEffect.buffs) {
                    target.addBuff(buff, this.simulationTime);
                    let checkBuffExpirationEvent = new CheckBuffExpirationEvent(this.simulationTime + buff.duration, target);
                    this.eventQueue.addEvent(checkBuffExpirationEvent);
                }
            }
            return;
        }

        if (abilityEffect.targetType != "self") {
            throw new Error("Unsupported target type for buff ability effect: " + ability.hrid);
        }

        for (const buff of abilityEffect.buffs) {
            source.addBuff(buff, this.simulationTime);
            // console.log("Added buff:", abilityEffect.buff);
            let checkBuffExpirationEvent = new CheckBuffExpirationEvent(this.simulationTime + buff.duration, source);
            this.eventQueue.addEvent(checkBuffExpirationEvent);
        }
    }

    processAbilityDamageEffect(source, ability, abilityEffect) {
        let targets;
        switch (abilityEffect.targetType) {
            case "enemy":
            case "all enemies":
                targets = source.isPlayer ? this.enemies : this.players;
                break;
            default:
                throw new Error("Unsupported target type for damage ability effect: " + ability.hrid);
        }

        for (const target of targets.filter((unit) => unit && unit.combatDetails.currentHitpoints > 0)) {
            if (target.combatDetails.combatStats.parry > Math.random()) {
                let tempTarget = source;
                let tempSource = target;

                let attackResult = CombatUtilities.processAttack(tempSource, tempTarget);

                this.simResult.addAttack(
                    tempSource,
                    tempTarget,
                    "autoAttack",
                    attackResult.didHit ? attackResult.damageDone : "miss"
                );

                if (attackResult.lifeStealHeal > 0) {
                    this.simResult.addHitpointsGained(tempSource, "lifesteal", attackResult.lifeStealHeal);
                }

                if (attackResult.manaLeechMana > 0) {
                    this.simResult.addManapointsGained(tempSource, "manaLeech", attackResult.manaLeechMana);
                }

                if (attackResult.reflectDamageDone > 0) {
                    this.simResult.addAttack(tempTarget, tempSource, "physicalReflect", attackResult.reflectDamageDone);
                }

                for (const [skill, xp] of Object.entries(attackResult.experienceGained.source)) {
                    this.simResult.addExperienceGain(tempSource, skill, xp);
                }
                for (const [skill, xp] of Object.entries(attackResult.experienceGained.target)) {
                    this.simResult.addExperienceGain(tempTarget, skill, xp);
                }

                if (tempTarget.combatDetails.currentHitpoints == 0) {
                    this.eventQueue.clearEventsForUnit(tempTarget);
                    this.simResult.addDeath(tempTarget);
                    if (!tempTarget.isPlayer) {
                        this.simResult.updateTimeSpentAlive(tempTarget.hrid, false, this.simulationTime);
                    }
                    //console.log(tempTarget.hrid, "died");
                }

                // Could die from reflect damage
                if (tempSource.combatDetails.currentHitpoints == 0 && attackResult.reflectDamageDone != 0) {
                    this.eventQueue.clearEventsForUnit(tempSource);
                    this.simResult.addDeath(tempSource);
                    if (!tempSource.isPlayer) {
                        this.simResult.updateTimeSpentAlive(tempSource.hrid, false, this.simulationTime);
                    }
                }
            } else {
                let attackResult = CombatUtilities.processAttack(source, target, abilityEffect);

                if (attackResult.didHit && abilityEffect.buffs) {
                    for (const buff of abilityEffect.buffs) {
                        target.addBuff(buff, this.simulationTime);
                        let checkBuffExpirationEvent = new CheckBuffExpirationEvent(
                            this.simulationTime + buff.duration,
                            target
                        );
                        this.eventQueue.addEvent(checkBuffExpirationEvent);
                    }
                }

                if (abilityEffect.damageOverTimeRatio > 0 && attackResult.damageDone > 0) {
                    let damageOverTimeEvent = new DamageOverTimeEvent(
                        this.simulationTime + DOT_TICK_INTERVAL,
                        source,
                        target,
                        attackResult.damageDone * abilityEffect.damageOverTimeRatio,
                        abilityEffect.damageOverTimeDuration / DOT_TICK_INTERVAL,
                        1, abilityEffect.combatStyleHrid
                    );
                    this.eventQueue.addEvent(damageOverTimeEvent);
                }

                if (attackResult.didHit && abilityEffect.stunChance > 0 && Math.random() < (abilityEffect.stunChance * 100 / (100 + target.combatDetails.combatStats.tenacity))) {
                    target.isStunned = true;
                    target.stunExpireTime = this.simulationTime + abilityEffect.stunDuration;
                    this.eventQueue.clearMatching((event) => (event.type == AutoAttackEvent.type || event.type == AbilityCastEndEvent.type || event.type == StunExpirationEvent.type) && event.source == target);
                    let stunExpirationEvent = new StunExpirationEvent(target.stunExpireTime, target);
                    this.eventQueue.addEvent(stunExpirationEvent);
                }

                if (attackResult.didHit && abilityEffect.blindChance > 0 && Math.random() < (abilityEffect.blindChance * 100 / (100 + target.combatDetails.combatStats.tenacity))) {
                    target.isBlinded = true;
                    target.blindExpireTime = this.simulationTime + abilityEffect.blindDuration;
                    this.eventQueue.clearMatching((event) => event.type == BlindExpirationEvent.type && event.source == target)
                    if (this.eventQueue.clearMatching((event) => event.type == AutoAttackEvent.type && event.source == target)) {
                        // console.log("Blind " + (this.simulationTime / 1000000000));
                        this.addNextAttackEvent(target);
                    }
                    let blindExpirationEvent = new BlindExpirationEvent(target.blindExpireTime, target);
                    this.eventQueue.addEvent(blindExpirationEvent);
                }

                if (attackResult.didHit && abilityEffect.silenceChance > 0 && Math.random() < (abilityEffect.silenceChance * 100 / (100 + target.combatDetails.combatStats.tenacity))) {
                    target.isSilenced = true;
                    target.silenceExpireTime = this.simulationTime + abilityEffect.silenceDuration;
                    this.eventQueue.clearMatching((event) => event.type == SilenceExpirationEvent.type && event.source == target)
                    if (this.eventQueue.clearMatching((event) => event.type == AbilityCastEndEvent.type && event.source == target)) {
                        // console.log("Silence " + (this.simulationTime / 1000000000));
                        this.addNextAttackEvent(target);
                    }
                    let silenceExpirationEvent = new SilenceExpirationEvent(target.silenceExpireTime, target);
                    this.eventQueue.addEvent(silenceExpirationEvent);
                }

                if (attackResult.didHit && source.combatDetails.combatStats.curse > 0 && Math.random() < (100 / (100 + target.combatDetails.combatStats.tenacity))) {
                    target.curseExpireTime = this.simulationTime + 15000000000;
                    if (target.combatDetails.combatStats.damageTaken < 0.1) {
                        target.combatDetails.combatStats.damageTaken += 0.01;
                    }
                    this.eventQueue.clearMatching((event) => event.type == CurseExpirationEvent.type && event.source == target)
                    let curseExpirationEvent = new CurseExpirationEvent(target.curseExpireTime, target);
                    this.eventQueue.addEvent(curseExpirationEvent);
                }

                this.simResult.addAttack(
                    source,
                    target,
                    ability.hrid,
                    attackResult.didHit ? attackResult.damageDone : "miss"
                );

                if (attackResult.reflectDamageDone > 0) {
                    this.simResult.addAttack(target, source, "physicalReflect", attackResult.reflectDamageDone);
                }

                for (const [skill, xp] of Object.entries(attackResult.experienceGained.source)) {
                    this.simResult.addExperienceGain(source, skill, xp);
                }
                for (const [skill, xp] of Object.entries(attackResult.experienceGained.target)) {
                    this.simResult.addExperienceGain(target, skill, xp);
                }

                if (target.combatDetails.currentHitpoints == 0) {
                    this.eventQueue.clearEventsForUnit(target);
                    this.simResult.addDeath(target);
                    if (!target.isPlayer) {
                        this.simResult.updateTimeSpentAlive(target.hrid, false, this.simulationTime);
                    }
                    //console.log(target.hrid, "died");
                }

                if (attackResult.didHit && abilityEffect.pierceChance > Math.random()) {
                    continue;
                }
            }

            if (abilityEffect.targetType == "enemy") {
                break;
            }
        }
    }

    processAbilityHealEffect(source, ability, abilityEffect) {

        if (abilityEffect.targetType == "all allies") {
            let targets = source.isPlayer ? this.players : this.enemies;
            for (const target of targets.filter((unit) => unit && unit.combatDetails.currentHitpoints > 0)) {
                let amountHealed = CombatUtilities.processHeal(source, abilityEffect, target);
                let experienceGained = CombatUtilities.calculateHealingExperience(amountHealed);

                this.simResult.addHitpointsGained(target, ability.hrid, amountHealed);
                this.simResult.addExperienceGain(source, "magic", experienceGained);
            }
            return;
        }

        if (abilityEffect.targetType == "lowest HP ally") {
            let targets = source.isPlayer ? this.players : this.enemies;
            let healTarget;
            for (const target of targets.filter((unit) => unit && unit.combatDetails.currentHitpoints > 0)) {
                if (!healTarget) {
                    healTarget = target;
                    continue;
                }
                if (target.combatDetails.currentHitpoints < healTarget.combatDetails.currentHitpoints) {
                    healTarget = target;
                }
            }

            if (healTarget) {
                let amountHealed = CombatUtilities.processHeal(source, abilityEffect, healTarget);
                let experienceGained = CombatUtilities.calculateHealingExperience(amountHealed);

                this.simResult.addHitpointsGained(healTarget, ability.hrid, amountHealed);
                this.simResult.addExperienceGain(source, "magic", experienceGained);
            }
            return;
        }

        if (abilityEffect.targetType != "self") {
            throw new Error("Unsupported target type for heal ability effect: " + ability.hrid);
        }

        let amountHealed = CombatUtilities.processHeal(source, abilityEffect, source);
        let experienceGained = CombatUtilities.calculateHealingExperience(amountHealed);

        this.simResult.addHitpointsGained(source, ability.hrid, amountHealed);
        this.simResult.addExperienceGain(source, "magic", experienceGained);
    }

    processAbilityReviveEffect(source, ability, abilityEffect) {
        if (abilityEffect.targetType != "a dead ally") {
            throw new Error("Unsupported target type for revive ability effect: " + ability.hrid);
        }

        let targets = source.isPlayer ? this.players : this.enemies;
        let reviveTarget = targets.find((unit) => unit && unit.combatDetails.currentHitpoints <= 0);

        if (reviveTarget) {
            let amountHealed = CombatUtilities.processRevive(source, abilityEffect, reviveTarget);
            let experienceGained = CombatUtilities.calculateHealingExperience(amountHealed);

            this.simResult.addHitpointsGained(reviveTarget, ability.hrid, amountHealed);
            this.simResult.addExperienceGain(source, "magic", experienceGained);

            this.addNextAttackEvent(reviveTarget);

            if (!source.isPlayer) {
                this.simResult.updateTimeSpentAlive(reviveTarget.hrid, true, this.simulationTime);
            }

            // console.log(source.hrid + " revived " + reviveTarget.hrid + " with " + amountHealed + " HP.");
        }
        return;
    }

    processAbilitySpendHpEffect(source, ability, abilityEffect) {
        if (abilityEffect.targetType != "self") {
            throw new Error("Unsupported target type for spend hp ability effect: " + ability.hrid);
        }

        let hpSpent = CombatUtilities.processSpendHp(source, abilityEffect);
        let experienceGained = CombatUtilities.calculateStaminaExperience(0, hpSpent);

        this.simResult.addHitpointsSpent(source, ability.hrid, hpSpent);
        this.simResult.addExperienceGain(source, "stamina", experienceGained);
    }
}

class Player extends CombatUnit {

    constructor() {
        super();

        this.isPlayer = true;
        this.hrid = "player";
    }

    static createFromDTO(dto) {
        let player = new Player();
        dto.abilities = dto.abilities.map((item) => {
            return Object.keys(item).length > 0 ? item : null;
        });

        player.food = dto.food.map((food) => (food ? Consumable.createFromDTO(food) : null));
        player.drinks = dto.drinks.map((drink) => (drink ? Consumable.createFromDTO(drink) : null));
        player.abilities = dto.abilities.map((ability) => (ability ? Ability.createFromDTO(ability) : null));
        for (const room in playerHouseRooms) {
            const roomObject = playerHouseRooms[room];
            player.houseRooms.push(new HouseRoom(roomObject.houseRoomHrid, roomObject.level));
        }

        for (const [key, value] of Object.entries(dto.combatDetails)) {
            player.combatDetails[key] = value;
        }
        player.staminaLevel = dto.combatDetails.staminaLevel;
        player.intelligenceLevel = dto.combatDetails.intelligenceLevel;
        player.attackLevel = dto.combatDetails.attackLevel;
        player.powerLevel = dto.combatDetails.powerLevel;
        player.defenseLevel = dto.combatDetails.defenseLevel;
        player.rangedLevel = dto.combatDetails.rangedLevel;
        player.magicLevel = dto.combatDetails.magicLevel;
        return player;
    }

    updateCombatDetails() {
        let currentHP = this.combatDetails.currentHitpoints;
        let currentMP = this.combatDetails.currentManapoints;
        this.combatDetails = structuredClone(player.combatDetails);
        this.combatDetails.currentHitpoints = currentHP;
        this.combatDetails.currentManapoints = currentMP;
        super.updateCombatDetails();
    }
}

    self.onmessage = async function (event) {
        switch (event.data.type) {
            case "start_simulation":
                const simManager = new SimulationManager();
                itemData = event.data.itemData;
                monsterData = event.data.monsterData;
                abilityData = event.data.abilityData;
                playerHouseRooms = event.data.playerHouseRooms;
                houseRoomDetailMap = event.data.houseRoomDetailMap;
                zoneData = event.data.zoneData;
                zoneHrids = event.data.zoneHrids;
                simulatedHours = event.data.simulatedHours;
                simulationTimeLimit = simulatedHours * ONE_HOUR;
                combatTriggerDependencyDetailMap = event.data.combatTriggerDependencyDetailMap;
                player = event.data.player;
                simResults = event.data.simResults;

                for (let zoneName in zoneHrids) {
                    const zone = new Zone(zoneHrids[zoneName]);
                    if (zone.monsterSpawnInfo.randomSpawnInfo.spawns) {
                        const clonedPlayerDTO = structuredClone(player);
                        var newPlayer = Player.createFromDTO(clonedPlayerDTO);
                        newPlayer.zoneBuffs = zone.buffs;
                        const simulation = new CombatSimulator(newPlayer, zone);
                        simManager.addSimulation(simulation);
                    }
                }

                try {
                await simManager.startSimulations();
                    this.postMessage({ type: "simulation_result", simResults: simResults });
                } catch (e) {
                    console.log(e);
                    this.postMessage({ type: "simulation_error", error: e });
                }
                break;
        }
    };
    `;

    const blob = new Blob([workerScript], { type: 'application/javascript' });

    const workerScriptURL = URL.createObjectURL(blob);

    const worker = new Worker(workerScriptURL);

    worker.onmessage = function (event) {
        switch (event.data.type) {
            case "simulation_result":
                //console.log(event.data.simResults);
                simResults = event.data.simResults;
                simulationRunning = false;
                handleCombatPanelVisibility();
                break;
            case "simulation_error":
                console.log(event.data.error.toString());
                break;
        }
    };

    function generateSimulation() {
        console.log("Generating sim..");
        clearSimData();
        handleCombatPanelVisibility();
        updatePlayerAbilities();
        updatePlayerFood();
        updatePlayerDrinks();
        playerDTO.food = playerFood;
        playerDTO.drinks = playerDrinks;
        playerDTO.abilities = playerAbilities;
        playerDTO.combatDetails = playerCombatData.combatDetails;

        let workerMessage = {
            type: "start_simulation",
            itemData: itemData,
            houseRoomDetailMap: houseRoomDetailMap,
            combatTriggerDependencyDetailMap: combatTriggerDependencyDetailMap,
            monsterData: monsterData,
            playerHouseRooms: playerHouseRooms,
            abilityData: abilityData,
            zoneData: zoneData,
            player: playerDTO,
            zoneHrids: zoneHrids,
            simResults: simResults,
            simulatedHours: simulatedHours,
        };
        worker.postMessage(workerMessage);
    }

    hookWS();
})();