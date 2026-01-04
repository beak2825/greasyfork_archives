// ==UserScript==
// @name         MWIAlchemyCalc

// @namespace    http://tampermonkey.net/
// @version      20251106.1
// @description  显示炼金收益和产出统计 milkywayidle 银河奶牛放置

// @author       IOMisaka
// @match        https://www.milkywayidle.com/*
// @match        https://www.milkywayidlecn.com/*
// @icon         https://www.milkywayidle.com/favicon.svg
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/530757/MWIAlchemyCalc.user.js
// @updateURL https://update.greasyfork.org/scripts/530757/MWIAlchemyCalc.meta.js
// ==/UserScript==

(function () {
    'use strict';
    if (!window.mwi) {
        console.error("MWIAlchemyCalc需要安装mooket才能使用");
        return;
    }

    ////////////////code//////////////////
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
            if (socket.url.indexOf("api.milkywayidle.com/ws") <= -1 &&
                socket.url.indexOf("api.milkywayidlecn.com/ws") <= -1) {
                return oriGet.call(this);
            }
            const message = oriGet.call(this);
            Object.defineProperty(this, "data", { value: message }); // Anti-loop
            handleMessage(message);
            return message;
        }
    }

    let characterData = null;
    let alchemyActionIndex = 0;
    function handleMessage(message) {
        let obj = JSON.parse(message);
        if (obj) {
            if (obj.type === "init_character_data") {
                characterData = obj;
            } else if (obj.type === "action_type_consumable_slots_updated") {//更新饮料和食物槽数据
                characterData.actionTypeDrinkSlotsMap = obj.actionTypeDrinkSlotsMap;
                characterData.actionTypeFoodSlotsMap = obj.actionTypeFoodSlotsMap;

                handleAlchemyDetailChanged();
            } else if (obj.type === "consumable_buffs_updated") {
                characterData.consumableActionTypeBuffsMap = obj.consumableActionTypeBuffsMap;
                handleAlchemyDetailChanged();
            } else if (obj.type === "community_buffs_updated") {
                characterData.communityActionTypeBuffsMap = obj.communityActionTypeBuffsMap;
                handleAlchemyDetailChanged();
            } else if (obj.type === "equipment_buffs_updated") {//装备buff
                characterData.equipmentActionTypeBuffsMap = obj.equipmentActionTypeBuffsMap;
                characterData.equipmentTaskActionBuffs = obj.equipmentTaskActionBuffs;
                handleAlchemyDetailChanged();
            } else if (obj.type === "house_rooms_updated") {//房屋更新
                characterData.characterHouseRoomMap = obj.characterHouseRoomMap;
                characterData.houseActionTypeBuffsMap = obj.houseActionTypeBuffsMap;
            }
            else if (obj.type === "actions_updated") {
                //延迟检测
                setTimeout(() => {
                    let firstAction = mwi.game?.state?.characterActions[0];
                    if (firstAction && firstAction.actionHrid.startsWith("/actions/alchemy")) {
                        updateAlchemyAction(firstAction);
                    }
                }, 100);


            }
            else if (obj.type === "action_completed") {//更新技能等级和经验
                if (obj.endCharacterItems) {//道具更新
                    //炼金统计
                    try {
                        if (obj.endCharacterAction.actionHrid.startsWith("/actions/alchemy")) {//炼金统计
                            updateAlchemyAction(obj.endCharacterAction);

                            let outputHashCount = {};
                            let inputHashCount = {};
                            let tempItems = {};
                            obj.endCharacterItems.forEach(
                                item => {

                                    let existItem = tempItems[item.id] || characterData.characterItems.find(x => x.id === item.id);

                                    //console.log("炼金(old):",existItem.id,existItem.itemHrid, existItem.count);
                                    //console.log("炼金(new):", item.id,item.itemHrid, item.count);

                                    let delta = (item.count - (existItem?.count || 0));//计数
                                    if (delta < 0) {//数量减少
                                        inputHashCount[item.hash] = (inputHashCount[item.hash] || 0) + delta;//可能多次发送同一个物品
                                        tempItems[item.id] = item;//替换旧的物品计数
                                    } else if (delta > 0) {//数量增加
                                        outputHashCount[item.hash] = (outputHashCount[item.hash] || 0) + delta;//可能多次发送同一个物品
                                        tempItems[item.id] = item;//替换旧的物品计数
                                    } else {
                                        console.log("炼金统计出错?不应该为0", item);
                                    }
                                }
                            );
                            let index = [
                                "/actions/alchemy/coinify",
                                "/actions/alchemy/decompose",
                                "/actions/alchemy/transmute"
                            ].findIndex(x => x === obj.endCharacterAction.actionHrid);
                            countAlchemyOutput(inputHashCount, outputHashCount, index);
                        } else {
                            alchemyActionIndex = -1;//不是炼金
                        }
                    } catch (e) { }

                    let newIds = obj.endCharacterItems.map(i => i.id);
                    characterData.characterItems = characterData.characterItems.filter(e => !newIds.includes(e.id));//移除存在的物品
                    characterData.characterItems.push(...mergeObjectsById(obj.endCharacterItems));//放入新物品
                }
                if (obj.endCharacterSkills) {
                    for (let newSkill of obj.endCharacterSkills) {
                        let oldSkill = characterData.characterSkills.find(skill => skill.skillHrid === newSkill.skillHrid);

                        oldSkill.level = newSkill.level;
                        oldSkill.experience = newSkill.experience;
                    }
                }
            } else if (obj.type === "items_updated") {
                if (obj.endCharacterItems) {//道具更新
                    let newIds = obj.endCharacterItems.map(i => i.id);
                    characterData.characterItems = characterData.characterItems.filter(e => !newIds.includes(e.id));//移除存在的物品
                    characterData.characterItems.push(...mergeObjectsById(obj.endCharacterItems));//放入新物品
                }
            }
        }
        return message;
    }
    function mergeObjectsById(list) {
        return Object.values(list.reduce((acc, obj) => {
            const id = obj.id;
            acc[id] = { ...acc[id], ...obj }; // 后面的对象会覆盖前面的
            return acc;
        }, {}));
    }
    /////////辅助函数,角色动态数据///////////
    // skillHrid = "/skills/alchemy"
    function getSkillLevel(skillHrid, withBuff = false) {
        let skill = characterData.characterSkills.find(skill => skill.skillHrid === skillHrid);
        let level = skill?.level || 0;

        if (withBuff) {//计算buff加成
            level += getBuffValueByType(
                skillHrid.replace("/skills/", "/action_types/"),
                skillHrid.replace("/skills/", "/buff_types/") + "_level"
            );
        }
        return level;
    }

    /// actionTypeHrid = "/action_types/alchemy"
    /// buffTypeHrid = "/buff_types/alchemy_level"
    function getBuffValueByType(actionTypeHrid, buffTypeHrid) {
        let returnValue = 0;
        //社区buff

        for (let buff of characterData.communityActionTypeBuffsMap[actionTypeHrid] || []) {
            if (buff.typeHrid === buffTypeHrid) returnValue += buff.flatBoost;
        }
        //装备buff
        for (let buff of characterData.equipmentActionTypeBuffsMap[actionTypeHrid] || []) {
            if (buff.typeHrid === buffTypeHrid) returnValue += buff.flatBoost;
        }
        //房屋buff
        for (let buff of characterData.houseActionTypeBuffsMap[actionTypeHrid] || []) {
            if (buff.typeHrid === buffTypeHrid) returnValue += buff.flatBoost;
        }
        //茶饮buff
        for (let buff of characterData.consumableActionTypeBuffsMap[actionTypeHrid] || []) {
            if (buff.typeHrid === buffTypeHrid) returnValue += buff.flatBoost;
        }
        return returnValue;
    }
    /**
     * 获取角色ID
     *
     * @returns {string|null} 角色ID，如果不存在则返回null
     */
    function getCharacterId() {
        return characterData?.character.id;
    }
    /**
     * 获取指定物品的数量
     *
     * @param itemHrid 物品的唯一标识
     * @param enhancementLevel 物品强化等级，默认为0
     * @returns 返回指定物品的数量，如果未找到该物品则返回0
     */
    function getItemCount(itemHrid, enhancementLevel = 0) {
        return characterData.characterItems.find(item => item.itemHrid === itemHrid && item.itemLocationHrid === "/item_locations/inventory" && item.enhancementLevel === enhancementLevel)?.count || 0;//背包里面的物品
    }
    //获取饮料状态，传入类型/action_types/brewing,返回列表

    function getDrinkSlots(actionTypeHrid) {
        return characterData.actionTypeDrinkSlotsMap[actionTypeHrid]
    }
    /////////游戏静态数据////////////
    //中英文都有可能
    function getItemHridByShowName(showName) {
        return window.mwi.ensureItemHrid(showName)
    }
    //类似这样的名字/items/blackberry_donut,/items/knights_ingot
    function getItemDataByHrid(itemHrid) {
        return mwi.initClientData.itemDetailMap[itemHrid];
    }
    function getOpenableItems(itemHrid) {
        let items = [];
        for (let openItem of mwi.initClientData.openableLootDropMap[itemHrid]) {
            items.push({
                itemHrid: openItem.itemHrid,
                count: (openItem.minCount + openItem.maxCount) / 2 * openItem.dropRate
            });
        }
        return items;
    }
    ////////////观察节点变化/////////////
    function observeNode(nodeSelector, rootSelector, addFunc = null, updateFunc = null, removeFunc = null) {
        const rootNode = document.querySelector(rootSelector);
        if (!rootNode) {
            //console.error(`Root node with selector "${rootSelector}" not found.wait for 1s to try again...`);
            setTimeout(() => observeNode(nodeSelector, rootSelector, addFunc, updateFunc, removeFunc), 1000);
            return;
        }
        console.info(`observing "${rootSelector}"`);

        function delayCall(func, observer, delay = 200) {
            //判断func是function类型
            if (typeof func !== 'function') return;
            // 延迟执行，如果再次调用则在原有基础上继续延时
            func.timeout && clearTimeout(func.timeout);
            func.timeout = setTimeout(() => func(observer), delay);
        }

        const observer = new MutationObserver((mutationsList, observer) => {

            mutationsList.forEach((mutation) => {
                mutation.addedNodes.forEach((addedNode) => {
                    if (addedNode.matches && addedNode.matches(nodeSelector)) {
                        addFunc?.(observer);
                    }
                });

                mutation.removedNodes.forEach((removedNode) => {
                    if (removedNode.matches && removedNode.matches(nodeSelector)) {
                        removeFunc?.(observer);
                    }
                });

                // 处理子节点变化
                if (mutation.type === 'childList') {
                    let node = mutation.target?.matches(nodeSelector) ? mutation.target : mutation.target.closest(nodeSelector);
                    if (node) {
                        delayCall(updateFunc, observer); // 延迟 100ms 合并变动处理，避免频繁触发
                    }

                } else if (mutation.type === 'characterData') {
                    // 文本内容变化（如文本节点修改）
                    let node = document.querySelector(nodeSelector);
                    let targetNode = mutation.target;
                    while (targetNode) {
                        if (targetNode == node) {
                            delayCall(updateFunc, observer);
                            break;
                        }
                        targetNode = targetNode.parentNode;
                    }
                }
            });
        });


        const config = {
            childList: true,
            subtree: true,
            characterData: true
        };
        observer.reobserve = function () {
            observer.observe(rootNode, config);
        }//重新观察
        observer.observe(rootNode, config);
        return observer;
    }
    hookWS();//hook收到角色信息
    //返回[买,卖]
    function getPrice(itemHrid, enhancementLevel = 0) {
        return mwi.coreMarket.getItemPrice(itemHrid, enhancementLevel);
    }
    let includeRare = false;
    let priceMode = "ab";//左买右卖
    //计算每次的收益
    function calculateProfit(data, isIroncow = false, isCoinify = false) {
        let profit = 0;
        let input = 0;
        let output = 0;
        let essence = 0;
        let rare = 0;
        let tea = 0;
        let catalyst = 0;
        let tax = isIroncow ? 1 : 0.98;//铁牛不扣税

        const mode = {
            "ab": ["ask", "bid"],
            "ba": ["bid", "ask"],
            "aa": ["ask", "ask"],
            "bb": ["bid", "bid"],
        };
        let [buyPrice, sellPrice] = mode[priceMode];

        for (let item of data.inputItems) {//消耗物品每次必定消耗

            input -= getPrice(item.itemHrid, item.enhancementLevel)[buyPrice] * item.count;//买入材料价格*数量

        }
        for (let item of data.teaUsage) {//茶每次必定消耗
            tea -= getPrice(item.itemHrid)[buyPrice] * item.count;//买入材料价格*数量
        }

        for (let item of data.outputItems) {//产出物品每次不一定产出，需要计算成功率
            output += getPrice(item.itemHrid)[sellPrice] * item.count * data.successRate * tax;//卖出产出价格*数量*成功率*税后

        }
        if (data.inputItems[0].itemHrid !== "/items/task_crystal") {//任务水晶有问题，暂时不计算
            for (let item of data.essenceDrops) {//精华和宝箱与成功率无关 消息id,10211754失败出精华！
                essence += getPrice(item.itemHrid)[sellPrice] * item.count * tax;//采集数据的地方已经算进去了
            }
            if (includeRare) {//排除宝箱，因为几率过低，严重影响收益显示
                for (let item of data.rareDrops) {//宝箱也是按自己的几率出！
                    // getOpenableItems(item.itemHrid).forEach(openItem => {
                    //     rare += getPrice(openItem.itemHrid).bid * openItem.count * item.count;//已折算
                    // });
                    rare += getPrice(item.itemHrid)[sellPrice] * item.count * tax;//失败要出箱子，消息id，2793104转化，工匠茶失败出箱子了
                }
            }
        }
        //催化剂
        for (let item of data.catalystItems) {//催化剂,成功才会用
            catalyst -= getPrice(item.itemHrid)[buyPrice] * item.count * data.successRate;//买入材料价格*数量
        }

        let description = "";
        if (isIroncow && isCoinify) {//铁牛点金不计算输入
            profit = tea + output + essence + rare + catalyst;
            description = `
(${mwi.isZh ? "税" : "tax"}${isIroncow ? "0" : "2%"})
(${mwi.isZh ? "效率" : "effeciency"}+${(data.effeciency * 100).toFixed(2)}%)
${mwi.isZh ? "每次收益" : "each"}:${profit}=
\t${mwi.isZh ? "材料" : "material"}(${input})[${mwi.isZh ? "铁牛点金不计入" : "not included for ironcowinify"}]
\t${mwi.isZh ? "茶" : "tea"}(${tea})
\t${mwi.isZh ? "催化剂" : "catalyst"}(${catalyst})
\t${mwi.isZh ? "产出" : "output"}(${output})
\t${mwi.isZh ? "精华" : "essence"}(${essence})
\t${mwi.isZh ? "稀有" : "rare"}(${rare})`;

        } else {
            profit = input + tea + output + essence + rare + catalyst;
            description = `
(${mwi.isZh ? "税" : "tax"}${isIroncow ? "0" : "2%"})
(${mwi.isZh ? "效率" : "effeciency"}+${(data.effeciency * 100).toFixed(2)}%)
${mwi.isZh ? "每次收益" : "each"}:${profit}=
\t${mwi.isZh ? "材料" : "material"}(${input})
\t${mwi.isZh ? "茶" : "tea"}(${tea})
\t${mwi.isZh ? "催化剂" : "catalyst"}(${catalyst})
\t${mwi.isZh ? "产出" : "output"}(${output})
\t${mwi.isZh ? "精华" : "essence"}(${essence})
\t${mwi.isZh ? "稀有" : "rare"}(${rare})`;
        }

        //console.info(description);
        return [profit, description];//再乘以次数
    }

    function showNumber(num) {
        if (isNaN(num)) return num;
        if (num === 0) return "0";// 单独处理0的情况

        const sign = num > 0 ? '+' : '';
        const absNum = Math.abs(num);

        return absNum >= 1e10 ? `${sign}${(num / 1e9).toFixed(1)}B` :
            absNum >= 1e7 ? `${sign}${(num / 1e6).toFixed(1)}M` :
                absNum >= 1e5 ? `${sign}${Math.floor(num / 1e3)}K` :
                    `${sign}${Math.floor(num)}`;
    }
    function parseNumber(str) {
        return parseInt(str.replaceAll("/", "").replaceAll(",", "").replaceAll(" ", ""));
    }
    let predictPerDay = {};
    function handleAlchemyDetailChanged(observer) {
        let inputItems = [];
        let outputItems = [];
        let essenceDrops = [];
        let rareDrops = [];
        let teaUsage = [];
        let catalystItems = [];

        let costNodes = document.querySelector(".AlchemyPanel_skillActionDetailContainer__o9SsW .SkillActionDetail_itemRequirements__3SPnA");
        if (!costNodes) return;//没有炼金详情就不处理

        let itemContainers = costNodes.querySelectorAll(".Item_itemContainer__x7kH1");
        itemContainers.forEach(container => {
            // 找到包含“/ 数量”字样的节点（材料需求量）
            let inputCountNode = container.previousElementSibling;
            while (inputCountNode && !inputCountNode.classList.contains("SkillActionDetail_inputCount__1rdrn")) {
                inputCountNode = inputCountNode.previousElementSibling;
            }

            if (!inputCountNode) return; // 跳过无效结构

            let need = parseNumber(inputCountNode.textContent);

            // 获取名称
            let nameNode = container.querySelector(".Item_name__2C42x");
            if (!nameNode) return;

            let nameArr = nameNode.textContent.split("+");
            let itemHrid = getItemHridByShowName(nameArr[0]);
            let enhancementLevel = nameArr.length > 1 ? parseNumber(nameArr[1]) : 0;

            inputItems.push({
                itemHrid: itemHrid,
                enhancementLevel: enhancementLevel,
                count: need
            });
        });

        //炼金输出
        for (let line of document.querySelectorAll(".SkillActionDetail_alchemyOutput__6-92q .SkillActionDetail_drop__26KBZ")) {
            let count = parseFloat(line.children[0].textContent.replaceAll(",", ""));
            let itemName = line.children[1].textContent;
            let rate = line.children[2].textContent ? parseFloat(line.children[2].textContent.substring(1, line.children[2].textContent.length - 1) / 100.0) : 1;//默认1
            outputItems.push({ itemHrid: getItemHridByShowName(itemName), count: count * rate });
        }
        //精华输出
        for (let line of document.querySelectorAll(".SkillActionDetail_essenceDrops__2skiB .SkillActionDetail_drop__26KBZ")) {
            let count = parseFloat(line.children[0].textContent);
            let itemName = line.children[1].textContent;
            let rate = line.children[2].textContent ? parseFloat(line.children[2].textContent.substring(1, line.children[2].textContent.length - 1) / 100.0) : 1;//默认1
            essenceDrops.push({ itemHrid: getItemHridByShowName(itemName), count: count * rate });
        }
        //稀有输出
        for (let line of document.querySelectorAll(".SkillActionDetail_rareDrops__3OTzu .SkillActionDetail_drop__26KBZ")) {
            let count = parseFloat(line.children[0].textContent);
            let itemName = line.children[1].textContent;
            let rate = line.children[2].textContent ? parseFloat(line.children[2].textContent.substring(1, line.children[2].textContent.length - 1) / 100.0) : 1;//默认1
            rareDrops.push({ itemHrid: getItemHridByShowName(itemName), count: count * rate });
        }
        //成功率
        let successRateStr = document.querySelector(".SkillActionDetail_successRate__2jPEP .SkillActionDetail_value__dQjYH").textContent;
        let successRate = parseFloat(successRateStr.substring(0, successRateStr.length - 1)) / 100.0;

        //消耗时间
        let costTimeStr = document.querySelector(".SkillActionDetail_timeCost__1jb2x .SkillActionDetail_value__dQjYH").textContent;
        let costSeconds = parseFloat(costTimeStr.substring(0, costTimeStr.length - 1));//秒，有分再改



        //催化剂
        let catalystItem = document.querySelector(".SkillActionDetail_catalystItemInput__2ERjq .Icon_icon__2LtL_") || document.querySelector(".SkillActionDetail_catalystItemInputContainer__5zmou .Item_iconContainer__5z7j4 .Icon_icon__2LtL_");//过程中是另一个框
        if (catalystItem) {
            catalystItems = [{ itemHrid: getItemHridByShowName(catalystItem.getAttribute("aria-label")), count: 1 }];
        }

        //计算效率
        let effeciency = getBuffValueByType("/action_types/alchemy", "/buff_types/efficiency");
        let skillLevel = getSkillLevel("/skills/alchemy", true);
        let mainItem = getItemDataByHrid(inputItems[0].itemHrid);
        if (mainItem.itemLevel) {
            effeciency += Math.max(0, skillLevel - mainItem.itemLevel) / 100;//等级加成
        }

        //costSeconds = costSeconds * (1 - effeciency);//效率，相当于减少每次的时间
        costSeconds = costSeconds / (1 + effeciency);
        //茶饮，茶饮的消耗就减少了
        let teas = getDrinkSlots("/action_types/alchemy");//炼金茶配置
        for (let tea of teas) {
            if (tea) {//有可能空位
                teaUsage.push({ itemHrid: tea.itemHrid, count: costSeconds / 300 });//300秒消耗一个茶
            }
        }
        //console.info("效率", effeciency);


        //返回结果
        let ret = {
            inputItems: inputItems,
            outputItems: outputItems,
            essenceDrops: essenceDrops,
            rareDrops: rareDrops,
            successRate: successRate,
            costTime: costSeconds,
            teaUsage: teaUsage,
            catalystItems: catalystItems,
            effeciency: effeciency,
        }
        const buttons = document.querySelectorAll(".AlchemyPanel_tabsComponentContainer__1f7FY .MuiButtonBase-root.MuiTab-root.MuiTab-textColorPrimary.css-1q2h7u5");
        const selectedIndex = Array.from(buttons).findIndex(button =>
            button.classList.contains('Mui-selected')
        );
        let isCowinify = (selectedIndex == 0 || (selectedIndex == 3 && alchemyActionIndex == 0));//点金模式

        //次数,收益
        let result = calculateProfit(ret, mwi.character?.gameMode === "ironcow", isCowinify);
        let profit = result[0];
        let desc = result[1];

        let timesPerHour = 3600 / costSeconds;//加了效率相当于增加了次数
        let profitPerHour = profit * timesPerHour;

        let timesPerDay = 24 * timesPerHour;
        let profitPerDay = profit * timesPerDay;

        predictPerDay[selectedIndex] = profitPerDay;//记录第几个对应的每日收益

        observer?.disconnect();//断开观察

        //显示位置
        let showParent = document.querySelector(".SkillActionDetail_notes__2je2F");
        let label = showParent.querySelector("#alchemoo");
        if (!label) {
            label = document.createElement("div");
            label.id = "alchemoo";
            showParent.appendChild(label);
        }

        let color = "white";
        if (profitPerHour > 0) {
            color = "lime";
        } else if (profitPerHour < 0) {
            color = "red";
        }
        label.innerHTML = `
        <div id="alchemoo" style="color: ${color};">
            <div>
                <span title="${desc}">${mwi.isZh ? "预估收益" : "Profit"}ℹ️：</span><input type="checkbox" id="alchemoo_includeRare"/><label for="alchemoo_includeRare">${mwi.isZh ? "稀有" : "Rares"}</label>
                <select id="alchemoo_selectMode">
                    <option value="ab">${mwi.isZh ? "左买右卖" : "ask in,bid out"}</option>
                    <option value="ba">${mwi.isZh ? "右买左卖" : "bid in,ask out"}</option>
                    <option value="aa">${mwi.isZh ? "左买左卖" : "ask in,ask out"}</option>
                    <option value="bb">${mwi.isZh ? "右买右卖" : "bid in,bid out"}</option>
                </select>
            </div>
            <div>
                <svg width="14px" height="14px" style="display:inline-block"><use href="/static/media/items_sprite.6d12eb9d.svg#coin"></use></svg>
                <span>${showNumber(profit)}/${mwi.isZh ? "次" : "each"}</span>
            </div>
            <div>
                <svg width="14px" height="14px" style="display:inline-block"><use href="/static/media/items_sprite.6d12eb9d.svg#coin"></use></svg>
                <span title="${showNumber(timesPerHour)}${mwi.isZh ? "次" : "times"}">${showNumber(profitPerHour)}/${mwi.isZh ? "时" : "hour"}</span>
            </div>
            <div>
                <svg width="14px" height="14px" style="display:inline-block"><use href="/static/media/items_sprite.6d12eb9d.svg#coin"></use></svg>
                <span title="${showNumber(timesPerDay)}${mwi.isZh ? "次" : "times"}">${showNumber(profitPerDay)}/${mwi.isZh ? "天" : "day"}</span>
            </div>
        </div>`;
        document.querySelector("#alchemoo_includeRare").checked = includeRare;
        document.querySelector("#alchemoo_includeRare").onchange = function () {
            includeRare = this.checked;
            handleAlchemyDetailChanged();//重新计算
        };
        document.querySelector("#alchemoo_selectMode").value = priceMode;
        document.querySelector("#alchemoo_selectMode").onchange = function () {
            priceMode = this.value;
            handleAlchemyDetailChanged();//重新计算
        };

        //console.log(ret);
        observer?.reobserve();
    }

    observeNode(".SkillActionDetail_alchemyComponent__1J55d", "body", handleAlchemyDetailChanged, handleAlchemyDetailChanged);

    let alchemyStartTime = Date.now();
    let lastAction = null;
    let alchemyHistory = [];//历史记录
    let alchemyIndex = 0;//第几次炼金
    //统计功能
    function countAlchemyOutput(inputHashCount, outputHashCount, index) {
        let currentInput = alchemyHistory[alchemyHistory.length - 1].input;
        let currentOutput = alchemyHistory[alchemyHistory.length - 1].output;
        alchemyActionIndex = index;
        for (let itemHash in inputHashCount) {
            currentInput[itemHash] = (currentInput[itemHash] || 0) + inputHashCount[itemHash];
        }
        for (let itemHash in outputHashCount) {
            currentOutput[itemHash] = (currentOutput[itemHash] || 0) + outputHashCount[itemHash];
        }
        showOutput();
    }

    function updateAlchemyAction(action) {
        if ((!lastAction) || (lastAction.id != action.id)) {//新动作，重置统计信息
            alchemyHistory.push({//记录新动作
                input: {},
                output: {},
            });
            alchemyIndex = alchemyHistory.length - 1;
            lastAction = action;
            alchemyStartTime = Date.now();//重置开始时间
        }

        showOutput();
    }
    function calcChestPrice(itemHrid) {
        let total = 0;
        const mode = {
            "ab": ["ask", "bid"],
            "ba": ["bid", "ask"],
            "aa": ["ask", "ask"],
            "bb": ["bid", "bid"],
        };
        let [buyPrice, sellPrice] = mode[priceMode];

        getOpenableItems(itemHrid).forEach(openItem => {

            total += getPrice(openItem.itemHrid)[sellPrice] * openItem.count;
        });
        return total;
    }
    function calcPrice(items, buy) {
        let total = 0;
        const mode = {
            "ab": ["ask", "bid"],
            "ba": ["bid", "ask"],
            "aa": ["ask", "ask"],
            "bb": ["bid", "bid"],
        };
        let [buyPrice, sellPrice] = mode[priceMode];
        let priceType = buy ? buyPrice : sellPrice;

        for (let item of items) {

            if (item.itemHrid === "/items/task_crystal") {//任务水晶有问题，暂时不计算
            }
            else if (getItemDataByHrid(item.itemHrid)?.categoryHrid === "/item_categories/loot") {//箱子必定是卖
                total += calcChestPrice(item.itemHrid) * item.count * 0.98;//税
            } else {

                total += getPrice(item.itemHrid, item.enhancementLevel ?? 0)[priceType] * item.count * (buy ? 1 : 0.98);//买入材料价格*数量
            }

        }
        return total;
    }
    function itemHashToItem(itemHash) {
        let item = {};
        let arr = itemHash.split("::");
        item.itemHrid = arr[2];
        item.enhancementLevel = arr[3];
        return item;
    }
    function getItemNameByHrid(itemHrid) {
        return mwi.isZh ?
            mwi.lang.zh.translation.itemNames[itemHrid] : mwi.lang.en.translation.itemNames[itemHrid];
    }
    function secondsToHms(seconds) {
        seconds = Number(seconds);
        const h = Math.floor(seconds / 3600);
        const m = Math.floor((seconds % 3600) / 60);
        const s = Math.floor(seconds % 60);

        return [
            h.toString().padStart(2, '0'),
            m.toString().padStart(2, '0'),
            s.toString().padStart(2, '0')
        ].join(':');
    }
    function showOutput() {
        let alchemyContainer = document.querySelector(".SkillActionDetail_alchemyComponent__1J55d");
        if (!alchemyContainer) return;

        if (!document.querySelector("#alchemoo_result")) {
            let outputContainer = document.createElement("div");
            outputContainer.id = "alchemoo_result";
            outputContainer.style.fontSize = "13px";
            outputContainer.style.lineHeight = "16px";
            outputContainer.style.maxWidth = "220px";
            outputContainer.innerHTML = `
            <div id="alchemoo_title" style="font-weight: bold; margin-bottom: 10px; text-align: center; color: var(--color-space-300);">${mwi.isZh ? "炼金统计" : "Alchemy Result"}</div>
            <div>
            <select id="alchemoo_current">
            </select>
            </div>
            <div id="alchemoo_cost" style="display: flex; flex-wrap: wrap; gap: 4px;"></div>
            <div id="alchemoo_rate"></div>
            <div id="alchemoo_output" style="display: flex; flex-wrap: wrap; gap: 4px;"></div>
            <div id="alchemoo_essence"></div>
            <div id="alchemoo_rare"></div>
            <div id="alchemoo_exp"></div>
            <div id="alchemoo_time"></div>
            <div id="alchemoo_total" style="font-weight:bold;font-size:16px;border:1px solid var(--color-space-300);border-radius:4px;padding:1px 5px;display: flex; flex-direction: column; align-items: flex-start; gap: 4px;"></div>
            `;
            outputContainer.style.flex = "0 0 auto";
            alchemyContainer.appendChild(outputContainer);
        }
        let selector = document.querySelector("#alchemoo_current");
        selector.innerHTML = "";
        for (let i = 0; i < alchemyHistory.length; i++) {
            let option = document.createElement("option");
            option.value = i;
            option.text = (i == alchemyHistory.length - 1) ? (mwi.isZh ? "当前" : "current") : `#${i + 1}`;
            selector.add(option);
        }
        selector.selectedIndex = alchemyIndex;
        selector.onchange = function () {
            alchemyIndex = this.selectedIndex;
            showOutput();
        };

        let currentInput = alchemyHistory[alchemyIndex].input;
        let currentOutput = alchemyHistory[alchemyIndex].output;

        let cost = calcPrice(Object.entries(currentInput).map(
            ([itemHash, count]) => {
                let arr = itemHash.split("::");
                return { "itemHrid": arr[2], "enhancementLevel": parseInt(arr[3]), "count": count }
            })
            , true);
        let gain = calcPrice(Object.entries(currentOutput).map(
            ([itemHash, count]) => {
                let arr = itemHash.split("::");
                return { "itemHrid": arr[2], "enhancementLevel": parseInt(arr[3]), "count": count }
            })
            , false);
        if (alchemyActionIndex == 0 && mwi.character?.gameMode === "ironcow") { cost = 0 };//铁牛点金，不计算成本
        let total = cost + gain;
        const mode = {
            "ab": ["ask", "bid"],
            "ba": ["bid", "ask"],
            "aa": ["ask", "ask"],
            "bb": ["bid", "bid"],
        };
        let [buyPrice, sellPrice] = mode[priceMode];

        let text = "";
        //消耗
        Object.entries(currentInput).forEach(([itemHash, count]) => {
            let item = itemHashToItem(itemHash);
            let price = getPrice(item.itemHrid);
            text += `
            <div title="in:${price[buyPrice]}" style="display: inline-flex;border:1px solid var(--color-space-300);border-radius:4px;padding:1px 5px;">
            <svg width="14px" height="14px" style="display:inline-block"><use href="/static/media/items_sprite.6d12eb9d.svg#${item.itemHrid.replace("/items/", "")}"></use></svg>
            <span style="display:inline-block">${getItemNameByHrid(item.itemHrid)}</span>
            <span style="color:red;display:inline-block;font-size:14px;">${showNumber(count).replace("-", "*")}</span>
            </div>
            `;
        });
        if (cost < 0) {//0不显示.已经是负数了
            text += `<div style="display: inline-block;border:1px solid var(--color-space-300);border-radius:4px;padding:1px 5px;"><span style="color:red;font-size:16px;">${showNumber(cost)}</span></div>`;
        }
        document.querySelector("#alchemoo_cost").innerHTML = text;

        document.querySelector("#alchemoo_rate").innerHTML = `<br/>`;//成功率

        text = "";
        Object.entries(currentOutput).forEach(([itemHash, count]) => {
            let item = itemHashToItem(itemHash);
            let price = getPrice(item.itemHrid);
            text += `
            <div title="out:${price[sellPrice]}" style="display: inline-flex;border:1px solid var(--color-space-300);border-radius:4px;padding:1px 5px;">
            <svg width="14px" height="14px" style="display:inline-block"><use href="/static/media/items_sprite.6d12eb9d.svg#${item.itemHrid.replace("/items/", "")}"></use></svg>
            <span style="display:inline-block">${getItemNameByHrid(item.itemHrid)}</span>
            <span style="color:lime;display:inline-block;font-size:14px;">${showNumber(count).replace("+", "*")}</span>
            </div>
            `;
        });
        if (gain > 0) {//0不显示
            text += `<div style="display: inline-block;border:1px solid var(--color-space-300);border-radius:4px;padding:1px 5px;"><span style="color:lime;font-size:16px;">${showNumber(gain)}</span></div>`;
        }
        document.querySelector("#alchemoo_output").innerHTML = text;//产出

        //document.querySelector("#alchemoo_essence").innerHTML = `<br/>`;//精华
        //document.querySelector("#alchemoo_rare").innerHTML = `<br/>`;//稀有
        document.querySelector("#alchemoo_exp").innerHTML = `<br/>`;//经验
        let time = (Date.now() - alchemyStartTime) / 1000;
        //document.querySelector("#alchemoo_time").innerHTML = `<span>耗时:${secondsToHms(time)}</span>`;//时间
        let perDay = (86400 / time) * total;

        let profitPerDay = predictPerDay[alchemyActionIndex] || 0;

        let timeElapsedStr = `<span>${mwi.isZh ? "耗时" : "Time Elapsed"}:${secondsToHms(time)}</span>`;
        let totalProfitStr = `<div>${mwi.isZh ? "累计收益" : "Gain"}:<span style="color:${total > 0 ? "lime" : "red"}">${showNumber(total)}</span></div>`;
        let perdayProfitStr = `<div>${mwi.isZh ? "每日收益" : "Daily"}:<span style="color:${perDay > profitPerDay ? "lime" : "red"}">${showNumber(total * (86400 / time)).replace("+", "")}</span></div>`

        let totalStr = "";
        if (alchemyIndex == alchemyHistory.length - 1) {
            totalStr += timeElapsedStr;
            totalStr += totalProfitStr;
            totalStr += perdayProfitStr;
        } else {
            totalStr += totalProfitStr;
        }

        //总收益
        document.querySelector("#alchemoo_total").innerHTML = totalStr;
    }
    //mwi.hookMessage("action_completed", countAlchemyOutput);
    //mwi.hookMessage("action_updated", updateAlchemyAction)
})();