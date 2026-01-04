// ==UserScript==
// @name         MWICommon
// @namespace    http://tampermonkey.net/
// @version      0.8
// @description  Common API for MWIScript
// @author       Lhiok
// @license      MIT
// @match        https://www.milkywayidle.com/*
// @match        https://test.milkywayidle.com/*
// @icon         https://www.milkywayidle.com/favicon.svg
// @supportURL   https://github.com/Lhiok/MWIScript/
// @grant        none
// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/538698/MWICommon.user.js
// @updateURL https://update.greasyfork.org/scripts/538698/MWICommon.meta.js
// ==/UserScript==

(function() {
    "use strict";

    const selfSpace = "mwi_common";

    if (window[selfSpace]) return;

    let mwi_common = window[selfSpace] = {
        
        /**************************************** Public ****************************************/

        eventNames: null, // 事件名称

        injected: false, // 是否注入完成 完成触发document的mwi_common_injected事件
        marketDataLoaded: false, // 市场数据是否加载完成
        isZh: false, // 是否中文

        handleGameAPI: null, // 调用游戏API

        addNotification: null, // 添加通知
        openItemDictionary: null, // 打开物品字典
        openItemToolTip: null, // 打开物品提示
        closeItemToolTip: null, // 关闭物品提示
        gotoMarket: null, // 打开市场
        goToAction: null, // 前往行动
        goToMonster: null, // 前往打怪

        getItemNameByHrid: null, // 通过物品ID获取名称
        getItemHridByName: null, // 通过名称获取物品ID
        getActionHridByName: null, // 通过名称获取行动ID
        getMonsterHridByName: null, // 通过名称获取怪物ID

        getCharacterId: null, // 获取角色ID
        getEquipmentByLocationHrid: null, // 通过位置获取装备
        getItemNumByHrid: null, // 通过物品ID获取数量
        getItemPriceByHrid: null, // 通过物品ID获取价格
        getItemPriceYesterdayByHrid: null, // 通过物品ID获取昨日价格

        /**************************************** Private ****************************************/

        game: null, // 游戏对象
        lang: null, // 语言翻译对象

        itemNameToHrid: null, // 名称到物品ID
        marketData: null, // 市场数据
        marketDataYesterday: null, // 市场数据昨日
        marketDataInvalidTime: 0, // 市场数据失效时间
    };

    /**************************************** Log ****************************************/
    
    function info(info) {
        console.info('[MWI_Common]: ' + info);
    }

    function warn(info) {
        console.warn('[MWI_Common]: ' + info);
    }

    function error(info) {
        console.error('[MWI_Common]: ' + info);
    }
    
    /**************************************** Private ****************************************/
    
    let marketDataRetryTimeoutId = 0;
    const marketDataUrl = "https://www.milkywayidle.com/game_data/marketplace.json";
    const marketDataYesterdayUrl = "https://raw.githubusercontent.com/Lhiok/MWIScript/json/marketplace_yesterday.json";
    const langDataUrl = "https://raw.githubusercontent.com/Lhiok/MWIScript/main/lang.json";

    const marketDataStorageKey = "mwi_common_market_data";
    const marketDataInvalidTimeStorageKey = "mwi_common_market_data_invalid_time";
    
    const eventNames = mwi_common.eventNames = {
        injected: "mwi_common_injected", // 注入完成
        langDataLoaded: "mwi_common_lang_data_loaded", // lang数据加载完成
        marketDataLoaded: "mwi_common_market_data_loaded", // 市场数据加载完成
        marketDataUpdate: "mwi_common_market_data_update", // 市场数据更新
        login: "mwi_common_login", // 登录
        actionUpdate : "mwi_common_action_update", // 行动队列变更
        actionComplete: "mwi_common_action_complete", // 完成一次行动
        taskUpdate: "mwi_common_task_update", // 任务变更
        itemUpdate: "mwi_common_item_update", // 物品变更
        skillUpdate: "mwi_common_skill_update", // 技能变更 (更换技能&使用技能书)
        lootOpened: "mwi_common_loot_opened", // 打开宝箱
        marketListingsUpdate: "mwi_common_market_listings_update", // 市场挂牌更新 (上下架&成功交易&提取金币)
        equipmentUpdate: "mwi_common_equipment_update", // 装备变更
        consumableUpdate: "mwi_common_consumable_update", // 消耗品变更 (更换&持续时间更新)
        battleConditionUpdate: "mwi_common_battle_condition_update", // 更改战斗条件预设
        loadoutsUpdate: "mwi_common_loadouts_update", // 装配方案更新
        houseRoomsUpdate: "mwi_common_house_rooms_update", // 房屋更新
        actionBuffUpdate: "mwi_common_action_buff_update", // 行动加成更新
        newBattle: "mwi_common_new_battle", // 新一轮战斗 单个EPH算一轮
        gotoMarket: "mwi_common_goto_market", // 前往市场
        marketItemUpdate: "mwi_common_market_item_update", // 市场物品变更
    };

    // API调用事件
    const gameAPICallEvents = {
        ["handleMessageInitCharacterData"]: [eventNames.login],
        ["handleMessageActionsUpdated"]: [eventNames.actionUpdate],
        ["handleMessageActionCompleted"]: [eventNames.actionComplete],
        ["handleMessageQuestsUpdated"]: [eventNames.taskUpdate],
        ["handleMessageItemsUpdated"]: [eventNames.itemUpdate],
        ["handleMessageAbilitiesUpdated"]: [eventNames.skillUpdate],
        ["handleMessageLootOpened"]: [eventNames.lootOpened],
        ["handleMessageMarketListingsUpdated"]: [eventNames.marketListingsUpdate],
        ["handleMessageCharacterStatsUpdated"]: [eventNames.equipmentUpdate],
        ["handleMessageActionTypeConsumableSlotsUpdated"]: [eventNames.consumableUpdate],
        ["handleMessageAllCombatTriggersUpdated"]: [eventNames.battleConditionUpdate],
        ["handleMessageCombatTriggersUpdated"]: [eventNames.battleConditionUpdate],
        ["handleMessageLoadoutsUpdated"]: [eventNames.loadoutsUpdate],
        ["handleMessageHouseRoomsUpdated"]: [eventNames.houseRoomsUpdate],
        ["handleMessageCommunityBuffsUpdated"]: [eventNames.actionBuffUpdate],
        ["handleMessageConsumableBuffsUpdated"]: [eventNames.actionBuffUpdate],
        ["handleMessageEquipmentBuffsUpdated"]: [eventNames.actionBuffUpdate],
        ["handleMessageNewBattle"]: [eventNames.newBattle],
        ["handleGoToMarketplace"]: [eventNames.gotoMarket],
        ["handleMessageMarketItemOrderBooksUpdated"]: [eventNames.marketItemUpdate],
    };

    /**
     * 检测对象是否注入
     * @param {string} objName 
     * @returns 
     */
    function checkObjectInjected(objName) {
        if (!mwi_common.injected) {
            warn("not injected");
            return false;
        }
        if (!mwi_common[objName]) {
            warn(objName + " injected failed");
            return false;
        }
        return true;
    }

    /**
     * 监听游戏API调用
     * @param {string} apiName 
     * @param {string} eventBefore 调用前执行事件
     * @param {string} eventAfter 调用后执行事件
     */
    function hookGameAPICall(apiName, ...events) {
        if (!checkObjectInjected("game")) return;
        const api = mwi_common.game[apiName];
        if (!api) {
            error("game api not found: " + apiName);
            return;
        }
        mwi_common.game[apiName] = function(...args) {
            api.apply(this, args);
            events.forEach(event => document.dispatchEvent(new CustomEvent(event, { detail: args })));
        }
    }

    async function loadMarketData() {
        info("loading market data");
        const marketData = await fetch(marketDataUrl);
        if (!marketData.ok) {
            error("failed to load market data");
            return false;
        }

        const marketJson = await marketData.json();
        if (!marketJson || !marketJson.marketData || !marketJson.timestamp) {
            error("failed to parse market data");
            return false;
        }

        mwi_common.marketData = marketJson.marketData;
        mwi_common.marketDataInvalidTime = marketJson.timestamp + 6 * 60 * 60;
        localStorage.setItem(marketDataStorageKey, JSON.stringify(mwi_common.marketData));
        localStorage.setItem(marketDataInvalidTimeStorageKey, mwi_common.marketDataInvalidTime);

        info("market data loaded");
        return true;
    }

    async function loadMarketDataYesterday() {
        info("loading market data yesterday");
        const marketDataYesterday = await fetch(marketDataYesterdayUrl);
        if (!marketDataYesterday.ok) {
            error("failed to load market data yesterday");
            return false;
        }

        const marketJsonYesterday = await marketDataYesterday.json();
        if (!marketJsonYesterday || !marketJsonYesterday.marketData) {
            error("failed to parse market data yesterday");
            return false;
        }

        mwi_common.marketDataYesterday = marketJsonYesterday.marketData;
        info("market data yesterday loaded");
        return true;
    }

    async function updateMarketData() {
        // 重试中取消更新
        if (marketDataRetryTimeoutId) {
            return;
        }

        const currentSec = Date.now() / 1000;
        if (mwi_common.marketDataInvalidTime && currentSec < mwi_common.marketDataInvalidTime) return;

        // 防止同时间多次请求
        mwi_common.marketDataInvalidTime = currentSec + 5 * 60;

        // 昨日数据不是特别重要 拉取今日数据时顺带加载
        loadMarketDataYesterday();

        info("updating market data");
        if (!await loadMarketData()) {
            error("failed to update market data");
            return;
        }

        if (!mwi_common.marketDataLoaded) {
            info("market data loaded");
            mwi_common.marketDataLoaded = true;
            mwi_common.addNotification(mwi_common.isZh? "市场数据已加载": "Market data loaded", false);
            document.dispatchEvent(new CustomEvent(eventNames.marketDataLoaded));
            return;
        }

        // 市场数据更新存在随机性 未更新推迟15分钟
        if (mwi_common.marketDataInvalidTime <= currentSec) {
            info("market data update delayed");
            mwi_common.marketDataInvalidTime = currentSec + 15 * 60;
            localStorage.setItem(marketDataInvalidTimeStorageKey, mwi_common.marketDataInvalidTime);
            return;
        }
        
        mwi_common.addNotification(mwi_common.isZh? "市场数据已更新": "Market data updated", false);
        document.dispatchEvent(new CustomEvent(eventNames.marketDataUpdate));
    }

    document.addEventListener(eventNames.marketItemUpdate, (evt) => {
        if (!mwi_common.marketDataLoaded || !mwi_common.marketData) {
            return;
        }
        
        if (!evt || !evt.detail || !evt.detail[0]) {
            return;
        }

        const marketItemOrderBooks = evt.detail[0].marketItemOrderBooks;
        if (!marketItemOrderBooks) {
            return;
        }

        const itemHrid = marketItemOrderBooks.itemHrid;
        const orderBooks = marketItemOrderBooks.orderBooks;
        if (!itemHrid || itemHrid === "" || !orderBooks || !orderBooks.length) {
            return;
        }

        let itemMarketData = mwi_common.marketData[itemHrid];
        if (!itemMarketData) {
            itemMarketData = {};
            mwi_common.marketData[itemHrid] = itemMarketData;
        }

        orderBooks.forEach((orderBook, level) => {
            let itemLevelMarketData = itemMarketData[level];
            if (!itemLevelMarketData) {
                itemLevelMarketData = { a: -1, b: -1 };
                itemMarketData[level] = itemLevelMarketData;
            }
            orderBook.asks && orderBook.asks[0] && (itemLevelMarketData.a = orderBook.asks[0].price);
            orderBook.bids && orderBook.bids[0] && (itemLevelMarketData.b = orderBook.bids[0].price);
        });

        localStorage.setItem(marketDataStorageKey, JSON.stringify(mwi_common.marketData));
        document.dispatchEvent(new CustomEvent(eventNames.marketDataUpdate));
    });

    /**************************************** Public ****************************************/

    if (localStorage.getItem("i18nextLng") && localStorage.getItem("i18nextLng").startsWith("zh")) {
        mwi_common.isZh = true;
    }

    /**
     * 调用游戏API
     * @param {string} apiName 
     * @param  {...any} args 
     * @returns 
     */
    mwi_common.handleGameAPI = function(apiName, ...args) {
        if (!checkObjectInjected("game")) return;
        if (!mwi_common.game[apiName]) {
            error("game api not found: " + apiName);
            return;
        }
        mwi_common.game[apiName](...args);
    }

    /**
     * 添加通知
     * @param {string} msg 消息
     * @param {boolean} isError 是否错误提示
     */
    mwi_common.addNotification = (msg, isError) => mwi_common.handleGameAPI("updateNotifications", isError? "error": "info", msg);

    /**
     * 打开物品字典
     * @param {string} itemHrid 物品ID
     */
    mwi_common.openItemDictionary = (itemHrid) => mwi_common.handleGameAPI("handleOpenItemDictionary", itemHrid);

    /**
     * 打开物品提示
     * @param {string} itemHrid 物品ID
     * @param {number} itemLevel 物品等级
     * @param {number} itemCount 物品数量
     * @param {number} left
     * @param {number} top
     * @returns div-node
     */
    mwi_common.openItemToolTip = function(itemHrid, itemLevel, itemCount, left, top) {
        const div = document.createElement("div");
        div.role = "tooltip";
        div.setAttribute("id", `mwiCommonItemToolTip${itemHrid}`);
        div.setAttribute("class", "MuiPopper-root MuiTooltip-popper css-112l0a2");
        div.style.position = "absolute";
        div.style.inset = "0px auto auto 0px";
        div.style.margin = "0px";
        div.style.transform = `translate3d(${left}px, ${top}px, 0px)`;
        div.setAttribute("data-popper-placement", "top");
        div.innerHTML = `<div class="MuiTooltip-tooltip MuiTooltip-tooltipPlacementTop css-1spb1s5" style="opacity: 1; transition: opacity cubic-bezier(0.4, 0, 0.2, 1);"
            <div class="ItemTooltipText_itemTooltipText__zFq3A">
                <div class="ItemTooltipText_name__2JAHA">
                    <span>${mwi_common.getItemNameByHrid(itemHrid, mwi_common.isZh)}</span>
                </div>
                <div>
                    <span>${mwi_common.isZh? "数量": "Count"}: ${itemCount}</span>
                </div><div></div>
                <div class="ItemTooltipText_consumableDetail__2_42s"></div>
            </div>
        </div>`;
        document.body.appendChild(div);
        return div;
    }

    /**
     * 关闭物品提示
     * @param {string} itemHrid 物品ID
     */
    mwi_common.closeItemToolTip = function(itemHrid) {
        const div = document.getElementById(`mwiCommonItemToolTip${itemHrid}`);
        if (div) div.remove();
    }

    /**
     * 前往市场
     * @param {string} itemHrid 物品ID
     * @param {number} itemLevel 物品等级
     */
    mwi_common.gotoMarket = (itemHrid, itemLevel) => mwi_common.handleGameAPI("handleGoToMarketplace", itemHrid, itemLevel);

    /**
     * 前往行动
     * @param {string} actionHrid 行动ID 
     * @param {number} actionCount 行动次数
     */
    mwi_common.goToAction = (actionHrid, actionCount) => mwi_common.handleGameAPI("handleGoToAction", actionHrid, actionCount);

    /**
     * 前往打怪
     * @param {string} monsterHrid 怪物ID
     * @param {number} actionCount 行动次数
     */
    mwi_common.goToMonster = (monsterHrid, actionCount) => mwi_common.handleGameAPI("handleGoToMonster", monsterHrid, actionCount);

    /**
     * 通过物品ID获取名称
     * @param {string} itemHrid 物品ID
     * @param {boolean} isZh 是否中文
     * @returns 物品名称
     */
    mwi_common.getItemNameByHrid = function(itemHrid, isZh) {
        if (!mwi_common.lang) return "";
        return (isZh? mwi_common.lang.zh: mwi_common.lang.en).itemNames[itemHrid];
    }

    /**
     * 通过名称获取物品ID
     * @param {string} itemName 物品名称
     * @returns 物品ID
     */
    mwi_common.getItemHridByName = function(itemName) {
        if (mwi_common.itemNameToHrid) return mwi_common.itemNameToHrid[itemName];
        if (!mwi_common.lang) return "";

        const itemNameToHrid = mwi_common.itemNameToHrid = {};
        const enItemNames = mwi_common.lang.en.itemNames;
        const zhItemNames = mwi_common.lang.zh.itemNames;
        for (const itemHrid in enItemNames) itemNameToHrid[enItemNames[itemHrid]] = itemHrid;
        for (const itemHrid in zhItemNames) itemNameToHrid[zhItemNames[itemHrid]] = itemHrid;
        return itemNameToHrid[itemName];
    }

    /**
     * 通过名称获取行动ID
     * @param {string} actionName 行动名称
     * @param {boolean} isZh 是否中文
     * @returns 行动ID
     */
    mwi_common.getActionHridByName = function(actionName, isZh) {
        if (!mwi_common.lang) return "";

        const autionNames = (isZh? mwi_common.lang.zh: mwi_common.lang.en).actionNames;
        for (const actionHrid in autionNames) if (autionNames[actionHrid] === actionName) return actionHrid;

        error("action name not found: " + actionName);
        return "";
    }

    /**
     * 通过名称获取怪物ID
     * @param {string} monsterName 怪物名称
     * @param {boolean} isZh 是否中文
     * @returns 怪物ID
     */
    mwi_common.getMonsterHridByName = function(monsterName, isZh) {
        if (!mwi_common.lang) return "";

        const autionNames = (isZh? mwi_common.lang.zh: mwi_common.lang.en).monsterNames;
        for (const monsterHrid in autionNames) if (autionNames[monsterHrid] === monsterName) return monsterHrid;

        error("monster name not found: " + monsterName);
        return "";
    }

    /**
     * 获取角色ID
     * @returns 角色ID
     */
    mwi_common.getCharacterId = function() {
        if (!checkObjectInjected("game")) return 0;
        if (!mwi_common.game.state || !mwi_common.game.state.character) {
            error("character not found");
            return 0;
        }
        return mwi_common.game.state.character.id;
    }

    /**
     * 通过位置ID获取装备ID
     * @param {string} locationHrid 装备位置ID "/item_locations/body"
     * @returns 装备信息 获取失败返回null
     */
    mwi_common.getEquipmentByLocationHrid = function(locationHrid) {
        if (!checkObjectInjected("game")) return null;
        if (!mwi_common.game.state || !mwi_common.game.state.characterItemByLocationMap) {
            error("characterItemByLocationMap not found");
            return null;
        }
        return mwi_common.game.state.characterItemByLocationMap.get(locationHrid);
    }

    /**
     * 通过物品ID获取物品数量
     * @param {string} itemHrid 物品ID
     * @param {number} itemLevel 物品等级
     * @returns 物品数量
     */
    mwi_common.getItemNumByHrid = function(itemHrid, itemLevel) {
        if (!checkObjectInjected("game")) return 0;
        if (!mwi_common.game.state || !mwi_common.game.state.characterItemMap) {
            error("characterItemMap not found");
            return 0;
        }
        const key = `${mwi_common.getCharacterId()}::/item_locations/inventory::${itemHrid}::${itemLevel}`;
        const item = mwi_common.game.state.characterItemMap.get(key);
        return item? item.count: 0;
    }

    /**
     * 获取物品价格
     * @param {string} itemHrid 
     * @param {"ask" | "bid"} type
     * @returns 查询失败返回-1
     */
    mwi_common.getItemPriceByHrid = function(itemHrid, itemLevel, type) {
        // 调用时自动更新
        updateMarketData();

        if (!mwi_common.marketDataLoaded || !mwi_common.marketData) {
            warn("market data not loaded");
            return -1;
        }
        
        const itemPrices = mwi_common.marketData[itemHrid];
        if (itemPrices === undefined) {
            warn("item not found in market data: " + itemHrid);
            return -1;
        }

        const targetLevelPrice = itemPrices[itemLevel];
        if (targetLevelPrice === undefined) return -1;

        if (type === "ask") {
            if (targetLevelPrice.a === undefined) return -1;
            return targetLevelPrice.a;
        }

        if (type === "bid") {
            if (targetLevelPrice.b === undefined) return -1;
            return targetLevelPrice.b;
        }

        warn("invalid type: " + type);
        return -1;
    }

    mwi_common.getItemPriceYesterdayByHrid = function(itemHrid, itemLevel, type) {
        if (!mwi_common.marketDataYesterday) {
            warn("market data yesterday not loaded");
            return -1;
        }
        
        const itemPrices = mwi_common.marketDataYesterday[itemHrid];
        if (itemPrices === undefined) {
            warn("item not found in market data yesterday: " + itemHrid);
            return -1;
        }

        const targetLevelPrice = itemPrices[itemLevel];
        if (targetLevelPrice === undefined) return -1;

        if (type === "ask") {
            if (targetLevelPrice.a === undefined) return -1;
            return targetLevelPrice.a;
        }

        if (type === "bid") {
            if (targetLevelPrice.b === undefined) return -1;
            return targetLevelPrice.b;
        }

        warn("invalid type: " + type);
        return -1;
    }

    /**************************************** MutationObserver注入 ****************************************/

    const mooketSpace = "mwi";
    const mooketInjectedEventName = "MWICoreInitialized";

    function onInjected() {
        info("injected");
        mwi_common.injected = true;

        info("hooking game api");
        for (let key in gameAPICallEvents) hookGameAPICall(key, ...gameAPICallEvents[key]);
        
        info("dispatch injected event");
        mwi_common.addNotification(mwi_common.isZh? "已注入": "Injected", false);
        document.dispatchEvent(new CustomEvent(eventNames.injected));

        // 市场数据先加载完成补提示
        mwi_common.marketDataLoaded && mwi_common.addNotification(mwi_common.isZh? "市场数据已加载": "Market data loaded", false);
    }

    function initWithMooket() {
        info("init with mooket");
        mwi_common.game = window[mooketSpace].game;
        onInjected();
    }

    async function injectedScriptNode(node) {
        info("patching script: " + node.src);

        try {
            // 移除原始脚本
            const scriptUrl = node.src;
            const nodeParent = node.parentNode;
            node.remove();
            // 注入脚本文件
            const response = await fetch(scriptUrl);
            if (!response.ok) throw new Error(response.status);
            let sourceCode = await response.text();
            const injectionPoints = [
                {
                    name: "game",
                    pattern: "this.sendPing=",
                    replacement: `window.${selfSpace}.game=this,this.sendPing=`,
                }
            ];
            injectionPoints.forEach(injectionPoint => {
                if (sourceCode.includes(injectionPoint.pattern)) {
                    sourceCode = sourceCode.replace(injectionPoint.pattern, injectionPoint.replacement);
                    info(`${injectionPoint.name} injected successfully`);
                }
                else {
                    error(`${injectionPoint.name} injection failed`);
                }
            });
            // 替换脚本
            const newNode = document.createElement('script');
            newNode.textContent = sourceCode;
            document.body.appendChild(newNode);
            info("script patched successfully");
            onInjected();
        } catch (error) {
            error("patching failed: " + error);
        }
    }

    new MutationObserver(async (mutationsList, obs) => {
        // 兼容mooket插件
        if (window[mooketSpace]) {
            info("mooket detected");
            if (window[mooketSpace].MWICoreInitialized) {
                info("mooket core initialized");
                initWithMooket();
            }
            else {
                info("waiting for mooket core");
                window.addEventListener(mooketInjectedEventName, initWithMooket);
            }
            obs.disconnect();
            return;
        }
        for (let idx = mutationsList.length - 1; ~idx; --idx) {
            const mutationRecord = mutationsList[idx];
            for (let idx2 = mutationRecord.addedNodes.length - 1; ~idx2; --idx2) {
                const node = mutationRecord.addedNodes[idx2];
                if (node.tagName === "SCRIPT" && node.src && node.src.search(/.*main\..*\.chunk.js/) === 0) {
                    obs.disconnect();
                    await injectedScriptNode(node);
                    idx = 0;
                    break;
                }
            }
        }
    }).observe(document, { childList: true, subtree: true });
    
    /**************************************** 初始化lang ****************************************/

    async function initLangData(retryCount = 0) {
        info(retryCount? `retry to init lang data ${retryCount}`: "init lang data");
        
        const langData = await fetch(langDataUrl);
        if (!langData.ok) {
            error("failed to load lang data");
            if (retryCount <= 3) {
                setTimeout(initLangData, 3000, ++retryCount);
            }
            return;
        }

        const langJson = await langData.json();
        if (!langJson) {
            error("failed to parse lang data");
            return;
        }
        
        info("lang data initialized");
        mwi_common.lang = langJson;
        mwi_common.addNotification(mwi_common.isZh? "Lang数据已加载": "Lang data loaded", false);
        document.dispatchEvent(new CustomEvent(eventNames.langDataLoaded));
    }

    initLangData();
    
    /**************************************** 初始化官方市场数据 ****************************************/

    async function requestMarketData(retryCount = 0) {
        retryCount && info(`retry to request market data ${retryCount}`);
        marketDataRetryTimeoutId = 0;

        if (!await loadMarketData()) {
            error("failed to init market data");
            if (retryCount <= 3) {
                marketDataRetryTimeoutId = setTimeout(initMarketData, 3000, ++retryCount);
            }
            return;
        }

        info("market data initialized");
        mwi_common.marketDataLoaded = true;
        mwi_common.addNotification(mwi_common.isZh? "市场数据已加载": "Market data loaded", false);
        document.dispatchEvent(new CustomEvent(eventNames.marketDataLoaded));
    }

    async function initMarketData() {
        try {
            info("init market data");

            const storageInvalidTime = localStorage.getItem(marketDataInvalidTimeStorageKey);
            const marketDataInvalidTime = storageInvalidTime? parseInt(storageInvalidTime): 0;
            if (!marketDataInvalidTime || Date.now() / 1000 >= marketDataInvalidTime) {
                requestMarketData();
                return;
            }

            const storageMarketData = localStorage.getItem(marketDataStorageKey);
            const marketData = storageMarketData? JSON.parse(storageMarketData): null;
            if (!marketData) {
                requestMarketData();
                return;
            }

            mwi_common.marketData = marketData;
            mwi_common.marketDataInvalidTime = marketDataInvalidTime;
            mwi_common.marketDataLoaded = true;
            mwi_common.addNotification(mwi_common.isZh? "市场数据已加载": "Market data loaded", false);
            document.dispatchEvent(new CustomEvent(eventNames.marketDataLoaded));
        }
        catch (err) {
            error("failed to init market data: " + err);
            requestMarketData();
        }
    }

    initMarketData();
    
    /**************************************** 初始化昨日市场数据 ****************************************/

    async function initMarketDataYesterday(retryCount = 0) {
        info(retryCount? `retry to init market data yesterday ${retryCount}`: "init market data yesterday");

        if (!await loadMarketDataYesterday()) {
            error("failed to init market data yesterday");
            if (retryCount <= 3) {
                setTimeout(initMarketDataYesterday, 3000, ++retryCount);
            }
            return;
        }

        info("market data yesterday initialized");
    }

    initMarketDataYesterday();

    info("initialized");
})();