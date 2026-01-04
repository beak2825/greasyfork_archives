// ==UserScript==
// @name         [MWI] Realtime Import Of Battle Simulation
// @name:zh-CN   [银河奶牛]战斗模拟实时导入
// @namespace    http://tampermonkey.net/
// @version      0.3.6
// @description  Battle simulation imports the realtime configuration of the current character.
// @description:zh-CN  战斗模拟辅助工具，实时监听角色配置变化，导入当前角色实时配置
// @icon         https://www.milkywayidle.com/favicon.svg
// @author       Yannis
// @license      CC-BY-NC-SA-4.0
// @match        https://www.milkywayidle.com/*
// @match        https://www.milkywayidlecn.com/*
// @match        https://test.milkywayidle.com/*
// @match        https://*/MWICombatSimulatorTest/*
// @grant        GM_xmlhttpRequest
// @grant        GM_getValue
// @grant        GM_setValue
// @connect      textdb.online
// @require      https://cdnjs.cloudflare.com/ajax/libs/blueimp-md5/2.19.0/js/md5.min.js
// @require      https://cdn.jsdelivr.net/npm/lz-string@1.5.0/libs/lz-string.min.js
// @downloadURL https://update.greasyfork.org/scripts/539672/%5B%E9%93%B6%E6%B2%B3%E5%A5%B6%E7%89%9B%5D%E6%88%98%E6%96%97%E6%A8%A1%E6%8B%9F%E5%AE%9E%E6%97%B6%E5%AF%BC%E5%85%A5.user.js
// @updateURL https://update.greasyfork.org/scripts/539672/%5B%E9%93%B6%E6%B2%B3%E5%A5%B6%E7%89%9B%5D%E6%88%98%E6%96%97%E6%A8%A1%E6%8B%9F%E5%AE%9E%E6%97%B6%E5%AF%BC%E5%85%A5.meta.js
// ==/UserScript==

// 感谢 'MWITool' 为本脚本提供的技术参考，本脚本部分代码来源于 MWITool，请勿删除本版权声明
// 本脚本若有任何问题，欢迎随时与开发者联系与反馈，感谢使用
// Thanks 'MWITool' for the technical reference provided for this script.
// Some of the code in this script is sourced from MWITool.
// Please do not delete this copyright notice.
//
// https://greasyfork.org/en/scripts/494467-mwitools

(function () {
    'use strict';

    const debug = console.log.bind(null, '%c[BatSync]%c', 'color:green', 'color:black');
    const info = console.log.bind(null, '%c[BatSync]%c', 'color:cyan', 'color:black');
    const error = console.log.bind(null, '%c[BatSync]%c', 'color:red', 'color:black');

    // 语言设定
    const isZHInGameSetting = localStorage.getItem("i18nextLng")?.toLowerCase()?.startsWith("zh");
    let isZH = isZHInGameSetting;

    let playerId;
    let firstImport = true;
    let clientData = {};

    // #region Utils

    /**
     * 解压缩数据
     * @param {string} compressed - 偏移后的压缩数据
     * @returns {string} 解压后的原始数据
     */
    function decompressData(compressed) {
        if (!compressed || compressed === "") return "";

        try {
            // 使用标准库解压
            return LZString.decompressFromUTF16(compressed);
        } catch (e) {
            error("解压失败:", e);
            return "";
        }
    }

    // #endregion

    // #region TextDB

    // 从TextDB获取数据
    async function getDataFromTextDB(key) {
        // info(`Get data from TextDB: ${key}`);

        const response = await new Promise((resolve) => {
            GM_xmlhttpRequest({
                method: 'GET',
                url: `https://textdb.online/${key}`,
                timeout: 5000,
                onload: resolve,
                ontimeout: (e) => resolve({ status: 504, error: "timeout" }),
                onerror: (e) => resolve({ status: 500, error: e })
            })
        });
        if (response.status !== 200) {
            error(`Error get from TextDB`, {
                key: key,
                status: response.status,
                error: response.error
            });
        } else {
            info(`Get data from TextDB`, {
                key: key,
                data: response.responseText
            });
        }

        return response.responseText;
    }

    // 保存数据到TextDB
    async function saveDataToTextDB(key, data) {
        // info("保存TextDB数据", {
        //     key: key,
        //     data: data
        // });

        const params = new URLSearchParams();
        params.append('key', key);
        params.append('value', data.toString());

        const response = await new Promise((resolve) => {
            GM_xmlhttpRequest({
                method: 'POST',
                url: 'https://api.textdb.online/update/',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                },
                data: params,
                onload: resolve,
                onerror: function (e) {
                    error("Error saving to TextDB:", e);
                    reject(e);
                }
            });
        });

        if (response.status !== 200) {
            error('Failed saving to TextDB:', response);
        } else {
            info(`Save data to TextDB success, key: ${key}`)
        }
    }

    // 生成玩家唯一Key(MD5)
    function getPlayerUniqueKey(characterId) {
        return `mwi_${characterId}_${md5(md5(characterId))}`;
    }

    // #endregion

    // #region 角色数据

    // 获取客户端初始化数据
    function getInitClientData() {
        const compressed = GM_getValue("init_client_data", "");
        return JSON.parse(decompressData(compressed));
    }

    // 获取当前角色数据
    function getCurrentPlayerData() {
        let playerId = GM_getValue("current_character_id", null);
        if (playerId) {
            return getPlayerData(playerId);
        } else {
            return;
        }
    }

    // 获取角色数据
    function getPlayerData(id) {
        let playersDataStr = GM_getValue("mwi_players_data", null) || JSON.stringify(new Array());
        let playersData = JSON.parse(playersDataStr);
        const pIndex = playersData.findIndex(obj => obj.character.id === id);
        if (pIndex !== -1) {
            return playersData[pIndex];
        } else {
            return;
        }
    }

    // 保存角色数据
    function saveCharacterData(obj) {
        let playersDataStr = GM_getValue("mwi_players_data", null) || JSON.stringify(new Array());
        let playersData = JSON.parse(playersDataStr);
        playersData = playersData.filter(e => e.character.id !== obj.character.id);
        playersData.unshift(obj);
        if (playersData.length > 20) {
            playersData.pop();
        }
        GM_setValue("mwi_players_data", JSON.stringify(playersData));
    }

    // #endregion

    // #region HookMessage

    // 监听WebSocket
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
            if (socket.url.indexOf("api.milkywayidle.com/ws") <= -1 && socket.url.indexOf("api.milkywayidlecn.com/ws") <= -1 && socket.url.indexOf("api-test.milkywayidle.com/ws") <= -1) {
                return oriGet.call(this);
            }

            const message = oriGet.call(this);
            Object.defineProperty(this, "data", { value: message }); // Anti-loop

            try {
                handleMessage(message);
            } catch (e) {
                error(`处理消息协议时出错: ${e}`);
                console.log(e.stack);
            }
            return message;
        }
    }

    // 消息处理
    function handleMessage(message) {
        let obj = JSON.parse(message);
        if (!obj) {
            return;
        }
        switch (obj.type) {
            case 'pong': {
                // ping-pong
                break;
            }
            case 'active_player_count_updated': {
                // 活跃人数更新
                break;
            }
            case 'init_client_data': {
                // 客户端数据
                clientData.actionDetailMap = obj.actionDetailMap;
                clientData.levelExperienceTable = obj.levelExperienceTable;
                clientData.itemDetailMap = obj.itemDetailMap;
                clientData.actionCategoryDetailMap = obj.actionCategoryDetailMap;
                clientData.abilityDetailMap = obj.abilityDetailMap;
                break;
            }
            case 'init_character_data': {
                playerId = obj.character.id;
                // 初始化信息
                GM_setValue("init_character_data", message);
                GM_setValue("current_character_id", playerId);
                let player = getPlayerData(playerId);
                if (player) {
                    obj.abilityCombatTriggersMap = { ...player.abilityCombatTriggersMap, ...obj.abilityCombatTriggersMap }
                    obj.consumableCombatTriggersMap = { ...player.consumableCombatTriggersMap, ...obj.consumableCombatTriggersMap }
                }
                obj.battleObj = buildBattleObjFromPlayer(obj, true);
                saveCharacterData(obj);
                saveDataToTextDB(getPlayerUniqueKey(playerId), JSON.stringify(obj.battleObj));
                break;
            }
            case 'profile_shared': {
                // 角色详情
                let player = getPlayerData(obj.profile.characterSkills[0].characterID)
                let battleObj = buildBattleObjFromProfileShared(player, obj);
                if (!player) {
                    // 不是本角色
                    player = {}
                    player.character = {}
                    player.character.id = battleObj.character.id
                    player.character.name = battleObj.character.name
                }
                player.battleObj = battleObj;
                saveCharacterData(player);
                let playerUniqueKey = getPlayerUniqueKey(player.character.id);
                info(`Player Uniquekey: `, {
                    playerId: player.character.id,
                    playerName: player.character.name,
                    playerUniqueKey: playerUniqueKey,
                    textDBUrl: `https://textdb.online/${playerUniqueKey}`
                });

                addExportButton(player.character.id);
                break;
            }
            case 'new_battle': {
                // 战斗更新
                for (const battlePlayer of obj.players) {
                    let player = getPlayerData(battlePlayer.character.id);
                    let battleObj = buildBattleObjFromNewBattle(player, battlePlayer);
                    if (!player) {
                        // 不是本角色
                        player = {}
                        player.character = {}
                        player.character.id = battleObj.character.id
                        player.character.name = battleObj.character.name
                    }
                    player.battleObj = battleObj;
                    saveCharacterData(player);
                }
                break;
            }
            case 'items_updated': {
                // 物品更新
                let player = getPlayerData(playerId);
                if (!player) {
                    break;
                }
                let update = false;
                if (obj.endCharacterItems) {
                    for (const item of Object.values(obj.endCharacterItems)) {
                        if (item.itemLocationHrid !== "/item_locations/inventory" && item.count > 0) {
                            // 装备更新
                            let equipment = player.battleObj.player.equipment;
                            equipment = equipment.filter(e => e.itemLocationHrid !== item.itemLocationHrid);
                            equipment.push({
                                itemLocationHrid: item.itemLocationHrid,
                                itemHrid: item.itemHrid,
                                enhancementLevel: item.enhancementLevel,
                            })
                            player.battleObj.player.equipment = equipment;
                            update = true;
                        }
                    }
                }
                if (update) {
                    saveCharacterData(player);
                }
                break;
            }
            case 'action_type_consumable_slots_updated': {
                // 消耗栏更新
                let player = getPlayerData(playerId);
                if (!player) {
                    break;
                }
                player.actionTypeDrinkSlotsMap = obj.actionTypeDrinkSlotsMap;
                player.actionTypeFoodSlotsMap = obj.actionTypeFoodSlotsMap;
                player.battleObj = buildBattleObjFromPlayer(player, false);
                saveCharacterData(player);
                break;
            }
            case 'abilities_updated': {
                // 技能更新
                let player = getPlayerData(playerId);
                let equippedAbilities = [];
                for (let i = equippedAbilities.length; i < 5; i++) {
                    equippedAbilities.push({})
                }
                if (obj.endCharacterAbilities) {
                    // 更新技能详情
                    for (const ability of obj.endCharacterAbilities) {
                        const aDetail = player.characterAbilities.find(e => e.abilityHrid === ability.abilityHrid);
                        if (aDetail) {
                            aDetail.slotNumber = ability.slotNumber;
                        }
                    }
                    // 更新技能列表
                    const slotAbilities = player.characterAbilities.filter(e => e.slotNumber > 0);
                    for (const ability of slotAbilities) {
                        equippedAbilities[ability.slotNumber - 1] = {
                            abilityHrid: ability.abilityHrid,
                            level: ability.level,
                            experience: ability.experience,
                            availableTime: ability.updatedAt
                        }
                    }
                }
                player.combatUnit.combatAbilities = equippedAbilities.filter(e => e.abilityHrid && e.abilityHrid.length > 0);
                player.battleObj = buildBattleObjFromPlayer(player, false);
                saveCharacterData(player);
                break;
            }
            case 'combat_triggers_updated': {
                let player = getPlayerData(playerId);
                if (!player) {
                    break;
                }
                if (obj.combatTriggerTypeHrid === '/combat_trigger_types/ability') {
                    // 技能栏 Trigger 更新
                    player.abilityCombatTriggersMap[obj.abilityHrid] = obj.combatTriggers;
                } else if (obj.combatTriggerTypeHrid === '/combat_trigger_types/consumable') {
                    // 消耗栏 Trigger 更新
                    player.consumableCombatTriggersMap[obj.itemHrid] = obj.combatTriggers;
                } else {
                    break;
                }
                player.battleObj = buildBattleObjFromPlayer(player, false);
                saveCharacterData(player);
                saveDataToTextDB(getPlayerUniqueKey(playerId), JSON.stringify(player.battleObj));
                break;
            }
            case 'all_combat_triggers_updated': {
                // 所有 Triggers 更新
                let player = getPlayerData(playerId);
                if (!player) {
                    break;
                }
                player.abilityCombatTriggersMap = { ...player.abilityCombatTriggersMap, ...obj.abilityCombatTriggersMap };
                player.consumableCombatTriggersMap = { ...player.consumableCombatTriggersMap, ...obj.consumableCombatTriggersMap };
                player.battleObj = buildBattleObjFromPlayer(player, false);
                saveCharacterData(player);
                saveDataToTextDB(getPlayerUniqueKey(playerId), JSON.stringify(player.battleObj));
                break;
            }
            case 'party_updated': {
                // 队伍更新
                let player = getPlayerData(playerId);
                if (!player) {
                    break;
                }
                player.partyInfo = obj.partyInfo;
                saveCharacterData(player);
                break;
            }
            case 'chat_message_received': {
                // 聊天消息
                break;
            }
            case 'action_completed': {
                // 行动完成
                break;
            }
            default: {
                // info(obj);
            }
        }
    }

    // #endregion

    // #region Builders

    // 构建战斗模拟信息(InitData)
    function buildBattleObjFromPlayer(obj, init) {
        let battleObj = init ? {} : obj.battleObj;
        // Base
        battleObj.character = {}
        battleObj.character.id = obj.character.id;
        battleObj.character.name = obj.character.name;
        battleObj.character.gameMode = obj.character.gameMode;
        battleObj.timestamp = Date.now();
        battleObj.valid = true;
        if (init) {
            // Levels
            battleObj.player = {}
            for (const skill of obj.characterSkills) {
                if (skill.skillHrid.includes("stamina")) {
                    battleObj.player.staminaLevel = skill.level;
                } else if (skill.skillHrid.includes("intelligence")) {
                    battleObj.player.intelligenceLevel = skill.level;
                } else if (skill.skillHrid.includes("attack")) {
                    battleObj.player.attackLevel = skill.level;
                } else if (skill.skillHrid.includes("melee")) {
                    battleObj.player.meleeLevel = skill.level;
                } else if (skill.skillHrid.includes("defense")) {
                    battleObj.player.defenseLevel = skill.level;
                } else if (skill.skillHrid.includes("ranged")) {
                    battleObj.player.rangedLevel = skill.level;
                } else if (skill.skillHrid.includes("magic")) {
                    battleObj.player.magicLevel = skill.level;
                }
            }
            // Equipments
            battleObj.player.equipment = [];
            if (obj.characterItems) {
                for (const item of obj.characterItems) {
                    if (!item.itemLocationHrid.includes("/item_locations/inventory")) {
                        battleObj.player.equipment.push({
                            itemLocationHrid: item.itemLocationHrid,
                            itemHrid: item.itemHrid,
                            enhancementLevel: item.enhancementLevel,
                        });
                    }
                }
            }
        }
        // Food
        battleObj.food = {}
        battleObj.food["/action_types/combat"] = [];
        if (obj.actionTypeFoodSlotsMap["/action_types/combat"]) {
            for (const food of obj.actionTypeFoodSlotsMap["/action_types/combat"]) {
                if (food) {
                    battleObj.food["/action_types/combat"].push({
                        itemHrid: food.itemHrid,
                    });
                } else {
                    battleObj.food["/action_types/combat"].push({
                        itemHrid: "",
                    });
                }
            }
        }
        // Drinks
        battleObj.drinks = {}
        battleObj.drinks["/action_types/combat"] = [];
        if (obj.actionTypeDrinkSlotsMap["/action_types/combat"]) {
            for (const drink of obj.actionTypeDrinkSlotsMap["/action_types/combat"]) {
                if (drink) {
                    battleObj.drinks["/action_types/combat"].push({
                        itemHrid: drink.itemHrid,
                    });
                } else {
                    battleObj.drinks["/action_types/combat"].push({
                        itemHrid: "",
                    });
                }
            }
        }
        // Abilities
        battleObj.abilities = [];
        for (let i = 0; i < 5; i++) {
            battleObj.abilities.push({
                abilityHrid: "",
                level: "1",
            })
        }
        if (obj.combatUnit.combatAbilities) {
            for (const ability of obj.combatUnit.combatAbilities) {
                const aDetail = obj.characterAbilities.find(e => e.abilityHrid === ability.abilityHrid);
                if (aDetail) {
                    battleObj.abilities[aDetail.slotNumber - 1] = {
                        abilityHrid: ability.abilityHrid,
                        level: ability.level,
                        experience: ability.experience,
                        availableTime: ability.updatedAt
                    };
                }
            }
        }
        // TriggerMap
        battleObj.triggerMap = { ...obj.abilityCombatTriggersMap, ...obj.consumableCombatTriggersMap };
        // HouseRooms
        battleObj.houseRooms = {};
        if (obj.characterHouseRoomMap) {
            for (const house of Object.values(obj.characterHouseRoomMap)) {
                battleObj.houseRooms[house.houseRoomHrid] = house.level;
            }
        }
        return battleObj;
    }

    // 构建战斗模拟信息(ProfileShared)
    function buildBattleObjFromProfileShared(player, obj) {
        let battleObj = {};
        // Base
        battleObj.character = {}
        battleObj.character.id = player ? player.character.id : obj.profile.characterSkills[0].characterID;
        battleObj.character.name = obj.profile.sharableCharacter.name;
        battleObj.character.gameMode = obj.profile.sharableCharacter.gameMode;
        battleObj.timestamp = Date.now();
        battleObj.valid = true;
        // Levels
        battleObj.player = {}
        for (const skill of obj.profile.characterSkills) {
            if (skill.skillHrid.includes("stamina")) {
                battleObj.player.staminaLevel = skill.level;
            } else if (skill.skillHrid.includes("intelligence")) {
                battleObj.player.intelligenceLevel = skill.level;
            } else if (skill.skillHrid.includes("attack")) {
                battleObj.player.attackLevel = skill.level;
            } else if (skill.skillHrid.includes("melee")) {
                battleObj.player.meleeLevel = skill.level;
            } else if (skill.skillHrid.includes("defense")) {
                battleObj.player.defenseLevel = skill.level;
            } else if (skill.skillHrid.includes("ranged")) {
                battleObj.player.rangedLevel = skill.level;
            } else if (skill.skillHrid.includes("magic")) {
                battleObj.player.magicLevel = skill.level;
            }
        }
        // Equipments
        battleObj.player.equipment = [];
        if (obj.profile.wearableItemMap) {
            for (const key in obj.profile.wearableItemMap) {
                const item = obj.profile.wearableItemMap[key];
                battleObj.player.equipment.push({
                    itemLocationHrid: item.itemLocationHrid,
                    itemHrid: item.itemHrid,
                    enhancementLevel: item.enhancementLevel,
                });
            }
        }
        // Food and Drinks
        battleObj.food = {}
        battleObj.food["/action_types/combat"] = [];
        battleObj.drinks = {}
        battleObj.drinks["/action_types/combat"] = [];
        let wearableItemMap = obj.profile.wearableItemMap;
        let weapon = null;
        if (wearableItemMap) {
            weapon = wearableItemMap["/item_locations/main_hand"]?.itemHrid ||
                wearableItemMap["/item_locations/two_hand"]?.itemHrid;
        }
        if (player) {
            battleObj.food = player.battleObj.food;
            battleObj.drinks = player.battleObj.drinks;
        } else if (weapon) {
            if (weapon.includes("shooter") || weapon.includes("bow")) {
                // 远程
                battleObj.food["/action_types/combat"] = [
                    // 2红1蓝
                    { itemHrid: "/items/spaceberry_donut" },
                    { itemHrid: "/items/spaceberry_cake" },
                    { itemHrid: "/items/star_fruit_yogurt" }
                ]
                battleObj.drinks["/action_types/combat"] = [
                    // 经验.超远.暴击
                    { itemHrid: "/items/wisdom_coffee" },
                    { itemHrid: "/items/super_ranged_coffee" },
                    { itemHrid: "/items/critical_coffee" }
                ]
            } else if (weapon.includes("boomstick") || weapon.includes("staff") || weapon.includes("trident")) {
                // 法师
                battleObj.food["/action_types/combat"] = [
                    // 1红2蓝
                    { itemHrid: "/items/spaceberry_cake" },
                    { itemHrid: "/items/star_fruit_gummy" },
                    { itemHrid: "/items/star_fruit_yogurt" }
                ]
                battleObj.drinks["/action_types/combat"] = [
                    // 经验.超魔.吟唱
                    { itemHrid: "/items/wisdom_coffee" },
                    { itemHrid: "/items/super_magic_coffee" },
                    { itemHrid: "/items/channeling_coffee" }
                ]
            } else if (weapon.includes("bulwark")) {
                // 双手盾
                battleObj.food["/action_types/combat"] = [
                    // 2红1蓝
                    { itemHrid: "/items/spaceberry_donut" },
                    { itemHrid: "/items/spaceberry_cake" },
                    { itemHrid: "/items/star_fruit_yogurt" }
                ]
                battleObj.drinks["/action_types/combat"] = [
                    // 经验.超防.超耐
                    { itemHrid: "/items/wisdom_coffee" },
                    { itemHrid: "/items/super_defense_coffee" },
                    { itemHrid: "/items/super_stamina_coffee" }
                ]
            } else {
                // 近战
                battleObj.food["/action_types/combat"] = [
                    // 2红1蓝
                    { itemHrid: "/items/spaceberry_donut" },
                    { itemHrid: "/items/spaceberry_cake" },
                    { itemHrid: "/items/star_fruit_yogurt" }
                ]
                battleObj.drinks["/action_types/combat"] = [
                    // 经验.超力.迅捷
                    { itemHrid: "/items/wisdom_coffee" },
                    { itemHrid: "/items/super_power_coffee" },
                    { itemHrid: "/items/swiftness_coffee" }
                ]
            }
        }
        // Abilities
        battleObj.abilities = [];
        for (let i = 0; i < 5; i++) {
            battleObj.abilities.push({
                abilityHrid: "",
                level: "1",
            })
        }
        if (obj.profile.equippedAbilities) {
            let index = 1;
            for (const ability of obj.profile.equippedAbilities) {
                if (ability && clientData.abilityDetailMap[ability.abilityHrid].isSpecialAbility) {
                    battleObj.abilities[0] = {
                        abilityHrid: ability.abilityHrid,
                        level: ability.level,
                        experience: ability.experience,
                        availableTime: ability.updatedAt
                    };
                } else if (ability) {
                    battleObj.abilities[index++] = {
                        abilityHrid: ability.abilityHrid,
                        level: ability.level,
                        experience: ability.experience,
                        availableTime: ability.updatedAt
                    };
                }
            }
        }
        // TriggerMap
        if (player) {
            battleObj.triggerMap = player.battleObj.triggerMap;
        }
        // HouseRooms
        battleObj.houseRooms = {};
        for (const house of Object.values(obj.profile.characterHouseRoomMap)) {
            battleObj.houseRooms[house.houseRoomHrid] = house.level;
        }
        return battleObj;
    }

    // 构建战斗模拟信息(NewBattle)
    function buildBattleObjFromNewBattle(player, obj) {
        let battleObj = {};
        if (player) {
            battleObj = player.battleObj;
        }
        // Base
        battleObj.character = battleObj.character ?? {};
        battleObj.character.id = obj.character.id;
        battleObj.character.name = obj.character.name;
        battleObj.character.gameMode = obj.character.gameMode;
        battleObj.timestamp = Date.now();
        battleObj.valid = battleObj.valid;
        // Levels
        battleObj.player = battleObj.player ?? {};
        battleObj.player.staminaLevel = battleObj.player.staminaLevel ?? 1;
        battleObj.player.intelligenceLevel = battleObj.player.intelligenceLevel ?? 1;
        battleObj.player.attackLevel = battleObj.player.attackLevel ?? 1;
        battleObj.player.meleeLevel = battleObj.player.meleeLevel ?? 1;
        battleObj.player.defenseLevel = battleObj.player.defenseLevel ?? 1;
        battleObj.player.rangedLevel = battleObj.player.rangedLevel ?? 1;
        battleObj.player.magicLevel = battleObj.player.magicLevel ?? 1;
        // Equipments
        battleObj.player.equipment = battleObj.player.equipment ?? [];
        // Food and Drinks
        battleObj.food = {};
        battleObj.food["/action_types/combat"] = [];
        battleObj.drinks = {};
        battleObj.drinks["/action_types/combat"] = [];
        if (obj.combatConsumables) {
            for (const consumable of obj.combatConsumables) {
                if (consumable.itemHrid.includes("coffee")) {
                    battleObj.drinks["/action_types/combat"].push({
                        itemHrid: consumable.itemHrid
                    })
                } else {
                    battleObj.food["/action_types/combat"].push({
                        itemHrid: consumable.itemHrid
                    })
                }
            }
        }
        // Abilities
        battleObj.abilities = [];
        for (let i = 0; i < 5; i++) {
            battleObj.abilities.push({
                abilityHrid: "",
                level: "1",
            })
        }
        if (obj.combatAbilities) {
            let index = 1;
            for (const ability of obj.combatAbilities) {
                if (ability && clientData.abilityDetailMap[ability.abilityHrid].isSpecialAbility) {
                    battleObj.abilities[0] = {
                        abilityHrid: ability.abilityHrid,
                        level: ability.level,
                        experience: ability.experience,
                        availableTime: ability.updatedAt
                    };
                } else if (ability) {
                    battleObj.abilities[index++] = {
                        abilityHrid: ability.abilityHrid,
                        level: ability.level,
                        experience: ability.experience,
                        availableTime: ability.updatedAt
                    };
                }
            }
        }
        // TriggerMap
        battleObj.triggerMap = { ...battleObj.triggerMap };
        // HouseRooms
        battleObj.houseRooms = { ...battleObj.houseRooms };
        return battleObj;
    }

    // #endregion

    // #region Battle Simulater

    // 添加个人资料导出
    function addExportButton(characterId) {
        const checkElem = () => {
            const selectedElement = document.querySelector(`div.SharableProfile_overviewTab__W4dCV`);
            if (selectedElement) {
                clearInterval(timer);
                const button = document.createElement("button");
                selectedElement.appendChild(button);
                button.textContent = isZH ? "查看云模拟数据" : "View Cloud Data";
                button.style.borderRadius = "5px";
                button.style.height = "30px";
                button.style.backgroundColor = "orange";
                button.style.color = "black";
                button.style.boxShadow = "none";
                button.style.border = "0px";
                button.onclick = function () {
                    window.open(`https://textdb.online/${getPlayerUniqueKey(characterId)}`)
                    return false;
                };
                return false;
            }
        };
        let timer = setInterval(checkElem, 200);
    }

    function refreshLoadoutOptions(selectBox, loadouts) {
        if (!selectBox) {
            return;
        }
        selectBox.options.length = 0;
        selectBox.disabled = true;

        let defaultOption = document.createElement("option");
        defaultOption.textContent = isZH ? "选择游戏内配装" : "Select Game Loadout";
        defaultOption.selected = true;
        defaultOption.disabled = true;
        defaultOption.hidden = true;
        selectBox.appendChild(defaultOption);
        if (loadouts) {
            for (const loadout of loadouts) {
                selectBox.options.add(new Option(loadout.name, loadout.id));
                let option = document.createElement("option");
                option.textContent = loadout.name;
                option.value = loadout.id;
            }
        }
    }

    // 添加实时导入按钮
    function addImportButtonForMWICombatSimulate() {
        const checkElem = () => {
            clearInterval(timer);

            const equipCol = document.querySelector(`.container-fluid`)?.querySelector(`.col-md-5`);
            if (equipCol) {
                let loadoutDiv = document.createElement("div");
                loadoutDiv.className = "row mb-3";
                equipCol.insertBefore(loadoutDiv, equipCol.firstChild);

                // 配装导入按钮selectBox
                let selectBoxDiv = document.createElement("div");
                loadoutDiv.appendChild(selectBoxDiv);
                selectBoxDiv.className = "col-md-6";

                let selectBox = document.createElement("select");
                selectBoxDiv.appendChild(selectBox);
                selectBox.id = "selectLoadout"
                selectBox.className = "form-select";
                refreshLoadoutOptions(selectBox);

                let selectBoxBtn = document.createElement("button");
                loadoutDiv.appendChild(selectBoxBtn);
                selectBoxBtn.textContent = isZH ? "使用配装(施工中)" : "Use Loadout";
                selectBoxBtn.className = "btn btn-warning";
                selectBoxBtn.style = `width: 120px`;
                selectBoxBtn.disabled = true;
                selectBoxBtn.onclick = function () {
                };
                // characterLoadoutMap

                document.querySelector(`.container-fluid`)
            }

            const btnEquipSets = document.querySelector(`button#buttonEquipmentSets`);
            if (btnEquipSets) {
                let divRow = document.createElement("div");
                divRow.className = "row";
                btnEquipSets.parentElement.parentElement.prepend(divRow);

                // 导入按钮
                let div1 = document.createElement("div");
                div1.className = "mb-3 pt-2";
                divRow.append(div1);
                let button1 = document.createElement("button");
                div1.append(button1);
                button1.textContent = isZH ? "实时导入本地数据" : "Real-time Import From Local";
                button1.className = "btn btn-warning";
                button1.onclick = function () {
                    const btnGetPrice = document.querySelector(`button#buttonGetPrices`);
                    if (btnGetPrice) {
                        btnGetPrice.click();
                    }
                    importDataForMWICombatSimulate(button1, false);
                    return false;
                };

                // 网络导入按钮
                let div2 = document.createElement("div");
                div2.className = "mb-3 pt-1";
                divRow.append(div2);
                let button2 = document.createElement("button");
                div2.append(button2);
                button2.textContent = isZH ? "实时导入网络云数据" : "Real-time Import From Network";
                button2.className = "btn btn-warning";
                button2.onclick = function () {
                    const btnGetPrice = document.querySelector(`button#buttonGetPrices`);
                    if (btnGetPrice) {
                        btnGetPrice.click();
                    }
                    importDataForMWICombatSimulate(button2, true);
                    return false;
                };
            }
        };
        let timer = setInterval(checkElem, 200);
    }

    // 导入数据
    async function importDataForMWICombatSimulate(button, readCloudData = false) {
        if (!firstImport) {
            let userConfirm = window.confirm(isZH ? "是否要覆盖当前数据" : "Do you want to overwrite the current data?");
            if (!userConfirm) {
                return;
            }
        }
        firstImport = false;

        let preTextContent = button.textContent;
        let preClassName = button.className;
        button.textContent = isZH ? "正在导入数据..." : "Importing...";
        button.className = "btn btn-warning";
        button.disabled = true;

        clientData = getInitClientData();
        let player = getCurrentPlayerData();

        const BLANK_PLAYER_JSON_STR = `{\"player\":{\"attackLevel\":1,\"meleeLevel\":1,\"magicLevel\":1,\"rangedLevel\":1,\"defenseLevel\":1,\"staminaLevel\":1,\"intelligenceLevel\":1,\"equipment\":[]},\"food\":{\"/action_types/combat\":[{\"itemHrid\":\"\"},{\"itemHrid\":\"\"},{\"itemHrid\":\"\"}]},\"drinks\":{\"/action_types/combat\":[{\"itemHrid\":\"\"},{\"itemHrid\":\"\"},{\"itemHrid\":\"\"}]},\"abilities\":[{\"abilityHrid\":\"\",\"level\":\"1\"},{\"abilityHrid\":\"\",\"level\":\"1\"},{\"abilityHrid\":\"\",\"level\":\"1\"},{\"abilityHrid\":\"\",\"level\":\"1\"},{\"abilityHrid\":\"\",\"level\":\"1\"}],\"triggerMap\":{},\"zone\":\"/actions/combat/fly\",\"simulationTime\":\"100\",\"houseRooms\":{\"/house_rooms/dairy_barn\":0,\"/house_rooms/garden\":0,\"/house_rooms/log_shed\":0,\"/house_rooms/forge\":0,\"/house_rooms/workshop\":0,\"/house_rooms/sewing_parlor\":0,\"/house_rooms/kitchen\":0,\"/house_rooms/brewery\":0,\"/house_rooms/laboratory\":0,\"/house_rooms/observatory\":0,\"/house_rooms/dining_room\":0,\"/house_rooms/library\":0,\"/house_rooms/dojo\":0,\"/house_rooms/gym\":0,\"/house_rooms/armory\":0,\"/house_rooms/archery_range\":0,\"/house_rooms/mystical_study\":0}}`;

        const players = {};
        let isParty = false;
        let zone = "/actions/combat/fly";
        let isZoneDungeon = false;
        let difficultyTier = 0;

        if (!player?.partyInfo?.partySlotMap) {
            // 个人
            players[1] = {
                name: player.character.name,
                imported: true,
                cloudData: false,
                battleData: JSON.stringify(player.battleObj),
            };
            // Zone
            for (const action of player.characterActions) {
                if (action && action.actionHrid.includes("/actions/combat/")) {
                    zone = action.actionHrid;
                    difficultyTier = action.difficultyTier;
                    isZoneDungeon = clientData.actionDetailMap[action.actionHrid]?.combatZoneInfo?.isDungeon;
                    break;
                }
            }
        } else {
            // 队伍
            isParty = true;
            let i = 0;
            for (const member of Object.values(player.partyInfo.partySlotMap)) {
                i++;
                if (member.characterID) {
                    if (member.characterID === player.character.id) {
                        players[i] = {
                            name: player.character.name,
                            imported: true,
                            cloudData: false,
                            battleData: JSON.stringify(player.battleObj),
                        };
                    } else {
                        let memberData = getPlayerData(member.characterID);
                        let battleObj = memberData?.battleObj;

                        if (readCloudData) {
                            // 读取共享Trigger数据
                            let sharedTextDBStr = await getDataFromTextDB(getPlayerUniqueKey(member.characterID));
                            if (sharedTextDBStr) {
                                let sharedTextDB = JSON.parse(sharedTextDBStr);
                                if (battleObj) {
                                    battleObj.triggerMap = {
                                        ...battleObj.triggerMap,
                                        ...sharedTextDB.triggerMap
                                    }
                                } else {
                                    battleObj = sharedTextDB;
                                }
                            } else {
                                readCloudData = false;
                            }
                        }

                        if (battleObj && battleObj.valid) {
                            players[i] = {
                                name: battleObj.character.name,
                                imported: true,
                                cloudData: readCloudData,
                                battleData: JSON.stringify(battleObj),
                            };
                        } else {
                            players[i] = {
                                name: isZH ? "需要点开个人资料" : "Open profile in game",
                                imported: true,
                                cloudData: false,
                                battleData: BLANK_PLAYER_JSON_STR,
                            };
                        }
                    }
                }
            }
            // Zone
            zone = player.partyInfo?.party?.actionHrid;
            difficultyTier = player.partyInfo?.party?.difficultyTier;
            isZoneDungeon = clientData.actionDetailMap[zone]?.combatZoneInfo?.isDungeon;
        }

        // Select zone or dungeon
        if (zone) {
            document.querySelector(`input#simDungeonToggle`).checked = isZoneDungeon;
            document.querySelector(`input#simDungeonToggle`).dispatchEvent(new Event("change"));
            let elementZone = isZoneDungeon ? document.querySelector(`select#selectDungeon`) : document.querySelector(`select#selectZone`);
            if (elementZone.selectedIndex <= 0) {
                for (let i = 0; i < elementZone.options.length; i++) {
                    if (elementZone.options[i].value === zone) {
                        elementZone.options[i].selected = true;
                        break;
                    }
                }
            }
        }

        // Select difficultyTier
        let elementDifficulty = document.querySelector(`select#selectDifficulty`);
        if (elementDifficulty.selectedIndex <= 0) {
            for (let i = 0; i < elementDifficulty.options.length; i++) {
                if (elementDifficulty.options[i].value == difficultyTier) {
                    elementDifficulty.options[i].selected = true;
                    break;
                }
            }
        }

        for (let i = 1; i <= 5; i++) {
            if (!players[i]) {
                players[i] = {
                    name: `Player ${i}`,
                    imported: false,
                    cloudData: false,
                    battleData: BLANK_PLAYER_JSON_STR,
                };
            }
            let aTab = document.querySelector(`a#player${i}-tab`);
            aTab.textContent = players[i].name;
            aTab.style.cssText = ''
            if (players[i].cloudData) {
                aTab.style.backgroundImage = "linear-gradient(-20deg, #00cdac 0%, #8ddad5 100%)";
                aTab.style.color = "black";
            }
            let checkbox = document.querySelector(`input#player${i}.form-check-input.player-checkbox`);
            if (checkbox) {
                checkbox.checked = players[i].imported;
                checkbox.dispatchEvent(new Event("change"));
            }
        }

        document.querySelector(`a#group-combat-tab`).click();
        const editImport = document.querySelector(`input#inputSetGroupCombatAll`);
        editImport.value = JSON.stringify(Object.keys(players).reduce((acc, key) => {
            acc[key] = players[key].battleData;
            return acc;
        }, {}));
        document.querySelector(`button#buttonImportSet`).click();

        // 模拟时长
        document.querySelector(`input#inputSimulationTime`).value = 24;

        button.textContent = isZH ? "成功导入数据" : "Imported Successful";
        button.className = "btn btn-success";
        button.disabled = false;
        setTimeout(() => {
            button.textContent = preTextContent;
            button.className = preClassName;
        }, 1500);

        if (!isParty) {
            setTimeout(() => {
                document.querySelector(`button#buttonStartSimulation`).click();
            }, 500);
        }
    }

    // 监听模拟结果
    async function observeResultsForMWICombatSimulate() {
        let resultDiv = document.querySelector(`div.row`)?.querySelectorAll(`div.col-md-5`)?.[2]?.querySelector(`div.row > div.col-md-5`);
        while (!resultDiv) {
            await new Promise((resolve) => setTimeout(resolve, 100));
            resultDiv = document.querySelector(`div.row`)?.querySelectorAll(`div.col-md-5`)?.[2]?.querySelector(`div.row > div.col-md-5`);
        }

        const deathDiv = document.querySelector(`div#simulationResultPlayerDeaths`);
        const expDiv = document.querySelector(`div#simulationResultExperienceGain`);
        const consumeDiv = document.querySelector(`div#simulationResultConsumablesUsed`);
        deathDiv.style.backgroundColor = "#FFEAE9";
        deathDiv.style.color = "black";
        expDiv.style.backgroundColor = "#CDFFDD";
        expDiv.style.color = "black";
        consumeDiv.style.backgroundColor = "#F0F8FF";
        consumeDiv.style.color = "black";

        let div = document.createElement("div");
        div.id = "tillLevel";
        div.style.backgroundColor = "#FFFFE0";
        div.style.color = "black";
        div.textContent = "";
        resultDiv.append(div);
    }

    // #endregion

    // #region Main Logic

    // ==================================================
    // Script Start
    // ==================================================

    if (localStorage.getItem("initClientData")) {
        const compressed = localStorage.getItem("initClientData");
        const obj = JSON.parse(decompressData(compressed));
        GM_setValue("init_client_data", compressed);

        clientData.actionDetailMap = obj.actionDetailMap;
        clientData.levelExperienceTable = obj.levelExperienceTable;
        clientData.itemDetailMap = obj.itemDetailMap;
        clientData.actionCategoryDetailMap = obj.actionCategoryDetailMap;
        clientData.abilityDetailMap = obj.abilityDetailMap;
    }

    if (document.URL.includes("/MWICombatSimulatorTest/")) {
        addImportButtonForMWICombatSimulate();
        observeResultsForMWICombatSimulate();
    }

    hookWS();

    // #endregion

})();