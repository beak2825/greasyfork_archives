// ==UserScript==
// @name         MWIdleWork
// @namespace    http://tampermonkey.net/
// @version      2.3.35
// @description  闲时工作队列 milky way idle 银河 奶牛
// @author       io
// @match        https://www.milkywayidle.com/*
// @match        https://www.milkywayidlecn.com/*
// @match        https://test.milkywayidle.com/*
// @match        https://test.milkywayidlecn.com/*
// @require      https://cdn.jsdelivr.net/npm/lz-string@1.5.0/libs/lz-string.min.js
// @grant        GM_notification
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/498630/MWIdleWork.user.js
// @updateURL https://update.greasyfork.org/scripts/498630/MWIdleWork.meta.js
// ==/UserScript==

(() => {
    "use strict";

    const icons = {
        "milking": "🐄",
        "foraging": "🍄",
        "woodcutting": "🌳",
        "cheesesmithing": "🧀",
        "crafting": "🖐️",
        "tailoring": "🧵",
        "cooking": "🧑‍🍳",
        "brewing": "🍵",
        "enhancing": "🛠️",
        "combat": "⚔️",
        "decompose": "⚛️",
        "coinify": "🪙",
        "transmute": "♻️",
    };

    let settings = {
        id: null,
        idleActionStr: null,
        idleOn: false,
        buffNotify: false,
        recordsDict: {},
        queue: []
    };
    let recording = false;
    let records = [];

    let idleSend = null;
    let lastActionStr = null;

    let clientQueueOn = false;
    let clientQueue = [];
    let clientQueueDecOn = false;//自动解析
    let currentActionsHridList = [];
    let currentCharacterItems = [];

    //静态数据
    let initData_itemDetailMap = null;
    let initData_actionDetailMap = null;
    let initData_houseRoomDetailMap = null;

    let clientData = localStorage.getItem("initClientData");
    if (clientData) {
        let decData = LZString.decompressFromUTF16(clientData);
        let obj = JSON.parse(decData);
        initData_actionDetailMap = obj.actionDetailMap;
        initData_itemDetailMap = obj.itemDetailMap;
        initData_houseRoomDetailMap = obj.houseRoomDetailMap;
    }
    //反查房子
    let houseRoomNames = {
        '/house_rooms/dairy_barn': '奶牛棚',
        '/house_rooms/garden': '花园',
        '/house_rooms/log_shed': '木棚',
        '/house_rooms/forge': '锻造台',
        '/house_rooms/workshop': '工作间',
        '/house_rooms/sewing_parlor': '缝纫室',
        '/house_rooms/kitchen': '厨房',
        '/house_rooms/brewery': '冲泡坊',
        '/house_rooms/laboratory': '实验室',
        '/house_rooms/observatory': '天文台',
        '/house_rooms/dining_room': '餐厅',
        '/house_rooms/library': '图书馆',
        '/house_rooms/dojo': '道场',
        '/house_rooms/gym': '健身房',
        '/house_rooms/armory': '军械库',
        '/house_rooms/archery_range': '射箭场',
        '/house_rooms/mystical_study': '神秘研究室'
    };

    let houseRoomDict = {};
    if (initData_houseRoomDetailMap) {

        for (const key in houseRoomNames) {
            if (houseRoomNames.hasOwnProperty(key)) {
                houseRoomDict[houseRoomNames[key]] = key;
            }
        }
        for (const key in houseRoomNames) {
            let enNames = initData_houseRoomDetailMap[key]["name"];
            houseRoomDict[enNames] = key
        }
    }
    //反查房子
    hookWS();
    hookSend();

    function transIcon(str) {
        let action = str.split("/")[2];
        return icons[action] ?? "🏀";
    }
    function sleep(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }
    function enqueue(data) {
        let div = document.querySelector("#script_idlediv");
        if (!div) {
            console.error("没有找到面板");
            return;
        }
        let obj = JSON.parse(data);

        if (!obj) return;
        if (obj.type === "new_character_action") {//加入待办队列
            let button = document.createElement("button");
            const { desc, icon, count } = getDescIconCountFromStr(data);
            button.innerText = icon + count;
            button.title = "左键前移，右键取消\n" + desc;
            button.style.display = "inline";

            div.appendChild(button);
            let ele = {
                button: button,
                data: data
            }
            button.addEventListener("contextmenu", (event) => { event.preventDefault(); removeQueue(ele); });
            button.onclick = () => { upQueue(ele) };
            clientQueue.push(ele);
            save();
        }
    }
    function upQueue(ele) {
        let div = document.querySelector("#script_idlediv");
        if (!div) {
            console.error("没有找到面板");
            return;
        }
        if (ele.button.previousElementSibling && ele.button.previousElementSibling.tagName === "BUTTON") {
            div.insertBefore(ele.button, ele.button.previousElementSibling);
            let index = clientQueue.indexOf(ele);
            if (index > 0) {
                clientQueue.splice(index, 1);
                clientQueue.splice(index - 1, 0, ele);
            }
        }
        save();
    }
    function removeQueue(ele) {
        clientQueue = clientQueue.filter(item => item !== ele);
        save();

        let div = document.querySelector("#script_idlediv");
        if (!div) {
            console.error("没有找到面板");
            return;
        }

        div.removeChild(ele.button);

    }
    //移除button 返回数据
    function dequeue() {
        let div = document.querySelector("#script_idlediv");
        if (!div) {
            console.error("没有找到面板");
            return null;
        }

        let ele = clientQueue.shift();
        div.removeChild(ele.button);
        save();
        return ele.data;
    }
    function hookSend() {
        var oriSend = WebSocket.prototype.send;
        var socket = null;
        WebSocket.prototype.send = function (data) {
            if (
                this.url.indexOf("api.milkywayidlecn.com/ws") <= -1
                && this.url.indexOf("api-test.milkywayidlecn.com/ws") <= -1
                && this.url.indexOf("api.milkywayidle.com/ws") <= -1
                && this.url.indexOf("api-test.milkywayidle.com/ws") <= -1
            ) {
                oriSend.call(this, data);
                return;
            }
            socket = this;
            idleSend = function (e) { oriSend.call(socket, e) }

            let obj = JSON.parse(data);
            if (obj.type === "ping") {//过滤ping
                oriSend.call(this, data);
                return;
            }
            if (data && data.indexOf("newCharacterActionData") > 0) {
                updateAction(data);
            }

            if (clientQueueOn) {
                if (clientQueueDecOn
                    && obj && obj.type === "new_character_action"
                    && obj.newCharacterActionData
                    && obj.newCharacterActionData.actionHrid
                    && initData_actionDetailMap?.[obj.newCharacterActionData.actionHrid]?.inputItems
                ) {
                    let outputItem = initData_actionDetailMap?.[obj.newCharacterActionData.actionHrid]?.outputItems[0];
                    let currentCount = getItemCount(outputItem.itemHrid);
                    let times = obj.newCharacterActionData.hasMaxCount ? obj.newCharacterActionData.maxCount : 1;//默认一个
                    let actions = costs2actions([{ itemHrid: outputItem.itemHrid, count: outputItem.count * times + currentCount }], obj.newCharacterActionData.characterLoadoutId);
                    actions.forEach(action => enqueue(JSON.stringify(action)));
                } else enqueue(data);
            } else oriSend.call(this, data);


            if (recording) {
                records.push(data);
                document.getElementById("script_buttonRecord").innerText = "⏹️停止(" + records.length + ")";
            }
        }
    }
    function updateAction(data) {
        if (data) lastActionStr = data;

        let idlediv = document.querySelector("#script_idlediv");
        if (idlediv) return;

        let div = document.createElement("div");
        div.id = "script_idlediv";
        div.style.border = "1px solid";
        div.style.borderColor = "grey";
        div.style.backgroundColor = "rgb(33 76 141)";
        div.style.color = "white";
        div.style.borderRadius = "2px";
        div.style.left = "0px";
        div.style.top = "0px";
        div.style.position = "fixed";
        div.style.zIndex = "9999";

        let txtSaved = document.createElement("span");

        const { desc, icon, count } = getDescIconCountFromStr(settings.idleActionStr);
        txtSaved.title = desc;
        txtSaved.innerText = icon + count;

        let checkBuff = document.createElement("input");
        checkBuff.type = "checkbox";
        checkBuff.checked = settings.buffNotify;
        checkBuff.onchange = () => {
            settings.buffNotify = checkBuff.checked;
            save();
        }
        let txtBuff = document.createElement("span");
        txtBuff.innerText = "🔔";
        checkBuff.title = txtBuff.title = txtBuff.title = "社区buff提醒";

        let checkIdle = document.createElement("input");
        checkIdle.type = "checkbox";
        checkIdle.checked = settings.idleOn;
        checkIdle.title = "闲时执行";
        checkIdle.onchange = () => {
            settings.idleOn = checkIdle.checked;
            save();
        }

        let buttonSave = document.createElement("button");
        buttonSave.innerText = "保存";
        buttonSave.style.display = "inline";
        buttonSave.title = "保存最后指令";
        buttonSave.onclick = () => {

            settings.idleActionStr = lastActionStr;
            const { desc, icon, count } = getDescIconCountFromStr(lastActionStr);
            txtSaved.title = desc;
            txtSaved.innerText = icon + count;

            checkIdle.checked = true;
            settings.idleOn = checkIdle.checked;
            save();
        };

        let clearQueue = document.createElement("button");
        clearQueue.innerText = "🧹清空队列->";
        clearQueue.onclick = () => {
            while (dequeue());
        }

        //隐藏button
        let hideButton = document.createElement("button");
        hideButton.innerText = "隐藏";
        hideButton.onclick = () => {
            if (hideButton.innerText === "显示") {
                hideButton.innerText = "隐藏";
                //显示所有
                let node = hideButton.nextElementSibling;
                while (node) {
                    node.style.display = "initial";
                    node = node.nextElementSibling;
                }
            } else {
                hideButton.innerText = "显示";
                //隐藏所有
                let node = hideButton.nextElementSibling;
                while (node) {
                    node.style.display = "none";
                    node = node.nextElementSibling;
                }
            }
        }
        div.appendChild(hideButton);
        //记录
        let recordsDiv = document.createElement("div");
        recordsDiv.id = "script_recordsDiv";
        recordsDiv.style.display = "inline";
        div.appendChild(recordsDiv);

        let buttonRecord = document.createElement("button");
        buttonRecord.id = "script_buttonRecord";
        buttonRecord.innerText = "⏺录制";
        buttonRecord.title = "录制一系列操作";
        buttonRecord.onclick = () => {
            if (recording) {
                recording = false;
                buttonRecord.innerText = "⏺录制";
                buttonRecord.title = "录制一系列操作";
                let name = prompt("保存名字", "操作" + Object.keys(settings.recordsDict).length);
                settings.recordsDict[name] = records;
                records = [];
                save();
                refreshRecords();
            } else {
                recording = true;
                buttonRecord.innerText = "⏹️停止";
                buttonRecord.title = "停止录制动作";
            }
        }
        div.appendChild(buttonRecord);
        //

        div.appendChild(checkBuff);
        div.appendChild(txtBuff);

        div.appendChild(checkIdle);
        div.appendChild(txtSaved);
        div.appendChild(buttonSave);

        div.appendChild(clearQueue);

        document.querySelector("body").appendChild(div);
        refreshRecords();
    }
    function refreshRecords() {
        let recordsDiv = document.getElementById("script_recordsDiv");
        recordsDiv.innerHTML = "";
        for (let key in settings.recordsDict) {
            let cmds = settings.recordsDict[key];
            let actButton = document.createElement("button");
            actButton.innerText = key;
            actButton.title = "左键执行，右键删除";
            actButton.onclick = () => {
                let index = 0;//delay
                actButton.disabled = true;
                for (let i = 0; i < cmds.length; i++) {
                    let obj = JSON.parse(cmds[i]);
                    let data = cmds[i];
                    actButton.innerText = `执行中(${cmds.length - i})`;
                    if (obj.type === "new_character_action") {//需要持续的操作放队列
                        enqueue(data);
                    } else {//立即执行的指令
                        setTimeout(() => idleSend(data), index * 500);//避免同时发太多
                        index++;
                    }
                }
                //恢复原状
                setTimeout(() => {
                    actButton.innerText = key;
                    actButton.disabled = false;
                }, index * 500);
            }
            actButton.addEventListener("contextmenu", (event) => {
                event.preventDefault();
                delete settings.recordsDict[key];
                recordsDiv.removeChild(actButton);
                save();
            })
            recordsDiv.appendChild(actButton);
        }
    }
    function getDescIconCountFromStr(str) {
        let desc = "动作";
        let icon = "";
        let count = "";
        if (!str) {
            return { desc, icon, count };
        }
        var obj = JSON.parse(str);
        if (!obj || obj.type !== "new_character_action") {
            return { desc, icon, count };
        }

        icon = transIcon(obj.newCharacterActionData.actionHrid);
        count = obj.newCharacterActionData.hasMaxCount ? obj.newCharacterActionData.maxCount : "♾️";
        desc = obj.newCharacterActionData.actionHrid;
        return { desc, icon, count };
    }
    let sendLimit = false;
    function doIdle() {
        if (clientQueue.length > 0) {//队列
            idleSend(dequeue());
        } else if (settings.idleOn && settings.idleActionStr && idleSend) {//空闲任务
            //关闭立即执行，防止无限循环
            let iao = JSON.parse(settings.idleActionStr);
            if (iao && iao.newCharacterActionData && iao.newCharacterActionData.shouldClearQueue == true)
                iao.newCharacterActionData.shouldClearQueue = false;
            idleSend(JSON.stringify(iao));
        }
    }

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
            if (socket.url.indexOf("api.milkywayidlecn.com/ws") <= -1
                && socket.url.indexOf("api-test.milkywayidlecn.com/ws") <= -1
                && socket.url.indexOf("api.milkywayidle.com/ws") <= -1
                && socket.url.indexOf("api-test.milkywayidle.com/ws") <= -1) {
                return oriGet.call(this);
            }

            const message = oriGet.call(this);
            Object.defineProperty(this, "data", { value: message }); // Anti-loop

            return handleMessage(message);
        }
    }
    let idleTimer = null;
    function handleMessage(message) {
        let obj = JSON.parse(message);
        if (obj && obj.type === "init_character_data") {
            cleanAll();
            currentActionsHridList = [...obj.characterActions];
            currentCharacterItems = obj.characterItems;
            initAll(obj.character.id);
        } else if (obj && obj.type === "init_client_data") {
            initData_itemDetailMap = obj.itemDetailMap;
            initData_actionDetailMap = obj.actionDetailMap;
            initData_houseRoomDetailMap = obj.houseRoomDetailMap;
        } else if (obj && obj.endCharacterItems) {
            let newIds = obj.endCharacterItems.map(i => i.id);
            currentCharacterItems = currentCharacterItems.filter(e => !newIds.includes(e.id));//移除存在的物品
            currentCharacterItems.push(...obj.endCharacterItems);//放入新物品
        }
        else if (obj && obj.type === "actions_updated") {
            for (const action of obj.endCharacterActions) {
                if (action.isDone === false) {
                    currentActionsHridList.push(action);
                } else {
                    currentActionsHridList = currentActionsHridList.filter((o) => {
                        return o.id !== action.id;
                    });
                }
            }
            //空闲任务检测
            if (idleTimer) {
                clearTimeout(idleTimer);
            }
            if (currentActionsHridList.length == 0) {
                idleTimer = setTimeout(doIdle, 1111); // 延迟一秒执行空闲任务
            }
        } else if (obj && obj.type === "community_buffs_updated" && settings.buffNotify) {
            if (typeof GM_notification === "undefined" || !GM_notification) {
                console.error("notificate null GM_notification");
            } else GM_notification({
                text: "🔔社区buff有更新",
                title: "银河奶牛",
                timeout: 60000,
                silent: false,
                highlight: true,
                tag: "MWIdleWork",
                onclick: () => {
                    window.focus();
                }
            });
        }
        updateAction();
        return message;
    }

    function save() {
        //save queue
        let queue = [];
        clientQueue.forEach(e => queue.push(e.data));
        settings.queue = queue;

        localStorage.setItem("script_idlework" + settings.id, JSON.stringify(settings));
    }

    function initAll(characterId) {
        let o = localStorage.getItem("script_idlework" + characterId);
        if (o) {
            settings = JSON.parse(o);
        }
        settings.id = characterId;
        settings.recordsDict = settings.recordsDict || {};
        settings.queue = settings.queue || [];

        updateAction(settings.idleActionStr);
        settings.queue.forEach(e => enqueue(e));
        waitForActionPanelParent();
    }
    function cleanAll() {
        let idlediv = document.querySelector("#script_idlediv");
        if (idlediv) {
            idlediv.parentElement.removeChild(idlediv);
        }

        recording = false;
        records = [];

        idleSend = null;
        lastActionStr = null;

        clientQueueOn = false;
        clientQueue = [];
        clientQueueDecOn = false;//自动解析
        currentActionsHridList = [];
        currentCharacterItems = [];
    }
    /* 动作面板 */
    const waitForActionPanelParent = () => {
        const targetNode = document.querySelector("div.GamePage_contentPanel__Zx4FH");
        if (targetNode) {
            const actionPanelObserver = new MutationObserver(async function (mutations) {
                for (const mutation of mutations) {
                    for (const added of mutation.addedNodes) {
                        if (
                            added?.classList?.contains("Modal_modalContainer__3B80m") &&
                            added.querySelector("div.SkillActionDetail_regularComponent__3oCgr")
                        ) {
                            handleActionPanelAdd(added.querySelector("div.SkillActionDetail_regularComponent__3oCgr"));
                        }

                        if (
                            added?.classList?.contains("Modal_modalContainer__3B80m") &&
                            added.querySelector("div.HousePanel_modalContent__3AwPH")
                        ) {
                            handleHousePanelAdd(added.querySelector("div.HousePanel_modalContent__3AwPH"));
                        }
                        if (
                            added?.classList?.contains("Modal_modalContainer__3B80m")
                        ) {
                            //console.log(added);
                        }
                    }
                    for (const rm of mutation.removedNodes) {
                        if (
                            rm?.classList?.contains("Modal_modalContainer__3B80m") &&
                            rm.querySelector("div.SkillActionDetail_regularComponent__3oCgr")
                        ) {
                            handleActionPanelRemove(rm.querySelector("div.SkillActionDetail_regularComponent__3oCgr"));
                        }

                        if (
                            rm?.classList?.contains("Modal_modalContainer__3B80m") &&
                            rm.querySelector("div.HousePanel_modalContent__3AwPH")
                        ) {
                            handleHousePanelRemove(rm.querySelector("div.HousePanel_modalContent__3AwPH"));
                        }
                    }
                }
            });
            actionPanelObserver.observe(targetNode, { attributes: false, childList: true, subtree: true });
        } else {
            setTimeout(waitForActionPanelParent, 200);
        }
    };

    async function handleActionPanelAdd(panel) {
        let buttons = panel.querySelector("div.SkillActionDetail_buttonsContainer__sbg-V");
        if (buttons) {
            let html = '<div><input type="checkbox" id="script_clientQueue"><label for="script_clientQueue">加入闲时队列  </label><input type="checkbox" id="script_clientQueueDec"><label id="script_clientQueueDecLabel" for="script_clientQueueDec">解析需求</label></div>';
            buttons.insertAdjacentHTML("afterend", html);

            let checkClientQueue = panel.querySelector("#script_clientQueue");
            let checkClientQueueDec = panel.querySelector("#script_clientQueueDec");
            let checkClientQueueDecLabel = panel.querySelector("#script_clientQueueDecLabel");

            checkClientQueueDecLabel.title = "必须输入制作数量，才能分析需要的材料";
            checkClientQueueDec.style.display = "none";//默认隐藏
            checkClientQueueDecLabel.style.display = "none";

            checkClientQueue.onclick = () => {
                clientQueueOn = checkClientQueue.checked;
                if (clientQueueOn) {
                    checkClientQueueDec.style.display = "initial";
                    checkClientQueueDecLabel.style.display = "initial";
                } else {
                    checkClientQueueDec.style.display = "none";
                    checkClientQueueDecLabel.style.display = "none";
                }
            }

            checkClientQueueDec.onclick = () => {
                clientQueueDecOn = checkClientQueueDec.checked;
            }
        }
    }
    async function handleActionPanelRemove(panel) {
        clientQueueOn = false;
        clientQueueDecOn = false;
    }
    function createObj(actionHrid, count, hash1 = "", hash2 = "") {
        let obj = {
            "type": "new_character_action",
            "newCharacterActionData": {
                "actionHrid": actionHrid,
                "hasMaxCount": true,
                "maxCount": count,
                "primaryItemHash": hash1,
                "secondaryItemHash": hash2,
                "enhancingMaxLevel": 0,
                "enhancingProtectionMinLevel": 0,
                "shouldClearQueue": false
            }
        }

        return obj
    }
    //合并同action
    function addToActionList(list, actionObj, combine = false) {//取消合并，不按顺序制作会存在问题
        if (combine) {
            let foundAction = list.find(act => act.newCharacterActionData.actionHrid === actionObj.newCharacterActionData.actionHrid);
            if (foundAction) {
                foundAction.newCharacterActionData.maxCount += actionObj.newCharacterActionData.maxCount;
            } else {
                list.push(actionObj);
            }
        } else {
            list.push(actionObj);
        }
    }
    function deconstructItem(item, actionList, inventoryPool) {
        let count = 0;
        if (inventoryPool.hasOwnProperty(item.itemHrid)) {
            count = inventoryPool[item.itemHrid];
        } else {
            count = getItemCount(item.itemHrid);
            inventoryPool[item.itemHrid] = count;
        }
        if (count >= item.count) {//本材料足够，不用做
            count -= item.count;
            inventoryPool[item.itemHrid] = count;
        } else {//材料不够
            let need = item.count - count;
            inventoryPool[item.itemHrid] = 0;

            let act = Object.entries(initData_actionDetailMap).find(([k, v]) => v.outputItems?.[0]?.itemHrid === item.itemHrid);//找到产出该材料的动作（合成
            let nop;
            if (act) {//不是最低级材料
                [nop, act] = act;//解构
                //做材料
                act.inputItems.forEach(ii => {
                    let icount = need / act.outputItems[0].count * ii.count;//材料数量=需求量/每次产出*输入个数
                    deconstructItem({ itemHrid: ii.itemHrid, count: icount }, actionList, inventoryPool);
                });
                //需要升级材料
                let upgradeItemHash = "";
                if (act.upgradeItemHrid) {
                    deconstructItem({ itemHrid: act.upgradeItemHrid, count: need }, actionList, inventoryPool);
                    upgradeItemHash = getItemHash(act.upgradeItemHrid)
                }

                //加入待做列表
                let times = Math.ceil(need / act.outputItems[0].count);
                if (times > 0) {
                    let actionObj = createObj(act.hrid, times, upgradeItemHash);
                    addToActionList(actionList, actionObj);
                }
            } else {//最低级材料
                act = Object.entries(initData_actionDetailMap).find(([k, v]) => v.dropTable?.[0]?.itemHrid === item.itemHrid && v.dropTable?.[0]?.dropRate === 1);//基础采集
                if (act) {//可以直接做的材料
                    [nop, act] = act;
                    let perCount = (act.dropTable[0].minCount + act.dropTable[0].maxCount) / 2;//每次采集期望
                    let times = Math.ceil(need / perCount);
                    if (times > 0) {
                        let actionObj = createObj(act.hrid, times);
                        addToActionList(actionList, actionObj);
                    }
                } else {//比如兽皮不能直接做
                    alert(`缺少必要材料(${need})：${item.itemHrid}`);
                }
            }
        }
    }
    function deconstructItems(items) {
        let actionList = [];
        let inventoryPool = {};
        items.forEach(item => {
            deconstructItem(item, actionList, inventoryPool);
        });
        return actionList;
    }
    // [{itemHrid:"/items/lumber",count:1}]
    function costs2actions(costs, characterLoadoutId = null) {
        let actions = deconstructItems(costs);
        if (characterLoadoutId)//添加装备
            actions.forEach(act => act.newCharacterActionData.characterLoadoutId = characterLoadoutId)
        return actions;
    }
    function getItemCount(itemHrid) {
        return currentCharacterItems.find(item => item.itemHrid === itemHrid && item.itemLocationHrid === "/item_locations/inventory" && item.enhancementLevel === 0)?.count || 0;//背包里面的0级物品
    }
    function getItemHash(itemHrid) {
        return `${currentCharacterItems[0].characterID}::/item_locations/inventory::${itemHrid}::0`;//只取0级物品做升级
        //return currentCharacterItems.find(item => item.itemHrid === itemHrid)?.hash || "";
    }
    function costs2needs(costs) {
        let needs = [];
        costs.forEach(
            item => {
                let need = item.count - getItemCount(item.itemHrid);
                //if(need<0)need=0;
                needs.push({ itemHrid: item.itemHrid, count: need });
            }
        )
        return needs;
    }
    async function handleHousePanelAdd(panel) {
        let buildButton = panel.querySelector("button.Button_button__1Fe9z");
        if (buildButton) {
            let addButton = document.createElement("button");
            addButton.onclick = () => {
                let roomName = panel.querySelector("div.HousePanel_header__3QdpP").innerText;
                let toLevel = panel.querySelector("div.HousePanel_level__2UlEu").innerText.split(" ").map(s => parseInt(s)).findLast(s => s)
                roomName = houseRoomDict[roomName];

                let roomInfo = initData_houseRoomDetailMap[roomName]
                let costs = roomInfo.upgradeCostsMap[toLevel];
                costs = costs.slice(1);//coin remove
                let actions = costs2actions(costs);
                actions.forEach(action => enqueue(JSON.stringify(action)));
            }
            addButton.innerText = "加入队列";
            buildButton.parentNode.appendChild(addButton);
        }
    }
    async function handleHousePanelRemove(panel) {

    }

    //定时逃跑功能
    function escapeFromBattle() {
        //点击逃跑按钮
        //两个逃跑按钮都可以
        console.log("逃跑中...")
        let escapeButton = document.querySelector(".BattlePanel_buttonsContainer__lNrk1 .Button_button__1Fe9z.Button_warning__1-AMI.Button_fullWidth__17pVU") || document.querySelector(".Header_stopButtonContainer__3hHUk .Button_button__1Fe9z.Button_warning__1-AMI.Button_fullWidth__17pVU.Button_small__3fqC7");
        escapeButton?.click();
        setTimeout(() => {
            //确定逃跑
            mwi?.game?.updateNotifications("info", '你偷偷地逃离了战场');
            document.querySelector(".DialogModal_buttonContainer__2lIyK .Button_button__1Fe9z.Button_success__6d6kU.Button_fullWidth__17pVU")?.click();
        }, 1000);
    }
    let escapeTimer = null;
    let escapeRemainSeconds = 0;
    function startEscapeFromBattle() {
        //显示倒计时
        if (escapeTimer) {//已经在跑了
            mwi?.game?.updateNotifications("info", `你取消了逃跑`);
            clearInterval(escapeTimer);
            escapeTimer = null;
            let autoEscapeButton = document.querySelector("#autoEscapeButton");
            if (!autoEscapeButton) return;//没有按钮，不处理
            if (autoEscapeButton) {
                autoEscapeButton.innerText = "秒后自动逃跑";
            }
        } else {//
            mwi?.game?.updateNotifications("info", `将在${escapeRemainSeconds}秒后逃跑`);
            escapeTimer = setInterval(() => {
                console.log(`逃跑倒计时${escapeRemainSeconds}`);

                if (escapeRemainSeconds > 0) {
                    escapeRemainSeconds--;

                    let autoEscapeButton = document.querySelector("#autoEscapeButton");
                    if (autoEscapeButton) autoEscapeButton.innerText = `取消(${escapeRemainSeconds}秒)`;
                } else {
                    escapeFromBattle();
                    clearInterval(escapeTimer);
                    escapeTimer = null;
                }
            }, 1000);
        }


    }

    setInterval(() => {
        //自动逃跑按钮
        let autoEscapeButton = document.querySelector("#autoEscapeButton");
        if (autoEscapeButton) return;//有了

        let escapeButton = document.querySelector(".BattlePanel_buttonsContainer__lNrk1 .Button_button__1Fe9z.Button_warning__1-AMI.Button_fullWidth__17pVU");
        if (escapeButton) {
            let autoEscapeDiv = document.createElement("div");
            //有一个按钮和一个输入秒数的输入框

            //<button id="autoEscapeButton" class="Button_button__1Fe9z Button_warning__1-AMI">自动逃跑</button>
            //<input type="number" id="autoEscapeTime" value="10">秒后逃跑

            let autoEscapeTime = document.createElement("input");
            autoEscapeTime.id = "autoEscapeTime";
            autoEscapeTime.type = "number";
            autoEscapeTime.value = "120";
            autoEscapeTime.style.width = "100px";
            autoEscapeTime.className = "Input_input__2-t98";
            autoEscapeDiv.appendChild(autoEscapeTime);

            autoEscapeButton = document.createElement("button");
            autoEscapeButton.id = "autoEscapeButton";
            autoEscapeButton.innerText = "秒后自动逃跑";
            autoEscapeButton.className = "Button_button__1Fe9z Button_warning__1-AMI";
            autoEscapeButton.onclick = () => {
                escapeRemainSeconds = parseInt(autoEscapeTime.value);
                startEscapeFromBattle();
            };
            autoEscapeDiv.appendChild(autoEscapeButton);

            document.querySelector(".BattlePanel_buttonsContainer__lNrk1 .Button_button__1Fe9z.Button_warning__1-AMI").parentNode.parentNode.appendChild(autoEscapeDiv);
        }
        //自动检测面板
        let actionDiv = document.querySelector("div.SkillActionDetail_regularComponent__3oCgr");
        if (!actionDiv) {
            clientQueueOn = false;
            clientQueueDecOn = false;
        }
    }, 1000);
})();
