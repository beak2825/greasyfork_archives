// ==UserScript==
// @name         小萝卜斗鱼活动助手-水友版本
// @namespace    http://tampermonkey.net/
// @version      2024.11.30-1
// @description  斗鱼活动助手
// @license      AGPL-3.0-or-later
// @author       Lonewolf_12138
// @match       *://*.douyu.com/0*
// @match       *://*.douyu.com/1*
// @match       *://*.douyu.com/2*
// @match       *://*.douyu.com/3*
// @match       *://*.douyu.com/4*
// @match       *://*.douyu.com/5*
// @match       *://*.douyu.com/6*
// @match       *://*.douyu.com/7*
// @match       *://*.douyu.com/8*
// @match       *://*.douyu.com/9*
// @match       *://*.douyu.com/topic/*
// @icon         https://apic.douyucdn.cn/upload/avatar_v3/202405/a8af73e034a8434e8cc2f27afef3dce3_big.jpg
// @grant        GM_info
// @grant        unsafeWindow
// @grant        GM_setValue
// @grant        GM_getValue
// @connect      douyucdn.cn
// @connect      douyu.com
// @connect      greasyfork.org
// @downloadURL https://update.greasyfork.org/scripts/483093/%E5%B0%8F%E8%90%9D%E5%8D%9C%E6%96%97%E9%B1%BC%E6%B4%BB%E5%8A%A8%E5%8A%A9%E6%89%8B-%E6%B0%B4%E5%8F%8B%E7%89%88%E6%9C%AC.user.js
// @updateURL https://update.greasyfork.org/scripts/483093/%E5%B0%8F%E8%90%9D%E5%8D%9C%E6%96%97%E9%B1%BC%E6%B4%BB%E5%8A%A8%E5%8A%A9%E6%89%8B-%E6%B0%B4%E5%8F%8B%E7%89%88%E6%9C%AC.meta.js
// ==/UserScript==

(function () {

    if (unsafeWindow.top != unsafeWindow.self) {
        return;
    }

    //#region 脚本信息
    const scriptInfo = GM_info.script;
    const version = scriptInfo.version;
    //#endregion 脚本信息

    let rid;

    let binary = "";

    var danmuWebSocketMessageHandlerMap = new Map();

    const activityId = 2056;
    const activityName = "撼动乾坤";
    const activityGiftName = "陪伴印章";
    const activityGiftId = 3410;
    const activityMessage = "诸神出战";
    const activityPkName = "神域征天";

    const startTime = new Date('2024-11-28 12:00:00').getTime();
    const endTime = new Date('2024-12-11 23:30:00').getTime();

    checkRoomAndInit();

    function checkRoomAndInit() {
        let checkCount = 0;
        const iId = setInterval(function () {
            checkCount++;
            if (checkCount > 30) {
                clearInterval(iId);
                return;
            }
            const htmlElements = document.getElementsByTagName("html");
            if (htmlElements.length == 0) {
                return;
            }
            const match = htmlElements[0].innerHTML.match(/\$ROOM\.room_id\s*=\s*(\d+);/);
            if (match) {
                rid = match[1];
            }
            if (rid === 0) {
                return;
            }
            if (!new Set(["110111111001111101", "101010111110010111011111", "10001011100010011101100", "101011111000011101011000"]).has(intToBinary(rid))) {
                clearInterval(iId);
                return;
            }
            loadAfterElementReady();
            clearInterval(iId);
        }, 1000);
    }

    function loadAfterElementReady() {
        let checkCount = 0;
        const iId = setInterval(function () {
            checkCount++;
            if (checkCount > 30) {
                clearInterval(iId);
                return;
            }
            if (document.getElementsByClassName("layout-Player-asideMainTop").length == 0 || document.getElementsByClassName("ChatToolBar__right").length == 0) {
                return;
            }
            setTimeout(() => {
                init();
            }, 2500);
            clearInterval(iId);
        }, 1000);
    }

    function init() {
        if (new Set(["110111111001111101", "101010111110010111011111", "10001011100010011101100", "101011111000011101011000"]).has(binary)) {
            initShowMessageModule();
            exposeGlobalMethods();
            updateCheck(version, 483093, false);
            window.dispatchEvent(new CustomEvent('ibUpdateCheck'));
            if (Date.now() < startTime || Date.now() > endTime) {
                showMessage(`当前脚本(活动)已过期,脚本停止运行`, true);
                return;
            }
            initBase();
            initUserPage();
            initDanumWebSocket();
            window.dispatchEvent(new CustomEvent('ibLoadedComplete', {
                detail: {
                    roomId: rid,
                    activityId: activityId,
                    activityName: activityName,
                    activityPkName: activityPkName
                }
            }));
            setTimeout(() => {
                if (!sneakAttack) {
                    showMessage(`当前未开启偷塔选项,本次活动建议开启偷塔`, true);
                }
            }, 2500);
        }
    }

    var clientKeepLiveTimerId = 0;
    function initDanumWebSocket() {
        const danmuWS = new WebSocket("wss://danmuproxy.douyu.com:850" + String(getRandomInt(2, 5)));
        danmuWS.addEventListener('open', (e) => {
            console.log("发送消息");
            danmuWS.send(generateClientLoginMessage());
            danmuWS.send(generateClientJoinRoomMessage());
            clientKeepLiveTimerId = setInterval(() => {
                danmuWS.send(generateClientKeepliveMessage());
            }, 30000);
        });
        danmuWS.addEventListener('message', (e) => {
            if (e.data instanceof Blob) {
                const reader = new FileReader();
                reader.onload = function (event) {
                    // let messageString = event.target.result;
                    // messageAsString = messageString.substring(12, messageString.length);
                    let arrayBuffer = event.target.result;
                    handleDanumWSMessage(arrayBuffer);
                };
                // reader.readAsText(e.data);
                reader.readAsArrayBuffer(e.data);
            } else if (e.data instanceof ArrayBuffer) {
                handleDanumWSMessage(e.data);
            }
        });
        danmuWS.addEventListener('error', (e) => {
            danmuWS.close();
        });
        danmuWS.addEventListener('close', (e) => {
            danmuWS.close();
            clearInterval(clientKeepLiveTimerId);
            setTimeout(() => {
                initDanumWebSocket();
            }, 3000);
        });
    }

    const decoder = new TextDecoder('utf-8');
    function handleDanumWSMessage(arrayBuffer) {
        let byteArray = new Uint8Array(arrayBuffer);
        if (byteArray.length < 15) {
            return;
        }
        let subArray = byteArray.subarray(12, byteArray.length - 2);
        const messageAsString = decoder.decode(subArray);
        let messages = [];
        if (messageAsString != null && messageAsString.includes('\0')) {
            let tempMessages = messageAsString.split('\x00').filter(tempMessage => tempMessage.trim() !== '');
            tempMessages.forEach(tempMessage => {
                if (tempMessage.length > 7) {
                    messages.push(tempMessage);
                }
            });
        } else {
            messages.push(messageAsString);
        }
        messages.forEach(message => {
            if (message != null && message != "" && (message.startsWith("type@=") || message.includes("/type@="))) {
                const data = parseJson(message);
                if ("type" in data && danmuWebSocketMessageHandlerMap.has(data.type)) {
                    danmuWebSocketMessageHandlerMap.get(data.type).forEach(func => {
                        func(data);
                    });
                }
                // if ("type" in data) {
                //     console.log("调试信息", data); 
                // }
            }
        });
    }

    function addDanmuWebSocketMessageHandler(dataType, method) {
        if (danmuWebSocketMessageHandlerMap.has(dataType)) {
            danmuWebSocketMessageHandlerMap.get(dataType).add(method);
        } else {
            danmuWebSocketMessageHandlerMap.set(dataType, new Set([method]));
        }
    }

    // region 基础
    function initBase() {
        const style = document.createElement('style');
        style.innerHTML += `
        .ib-flex-main-start {
            margin          : 0 0 8px 0;
            display         : flex; 
            justify-content : flex-start;
            align-items     : center;
            width           : 100%;
        }
        .ib-flex-main-center {
            margin          : 0 0 8px 0;
            display         : flex; 
            justify-content : center;
            align-items     : center;
            width           : 100%;
        }
        .ib-flex-main-end {
            margin          : 0 0 8px 0;
            display         : flex; 
            justify-content : flex-end;
            align-items     : center;
            width           : 100%;
        }
        .ib-button {  
            border-radius: 8px;   
            background-color: #4CAF50;  
            color: white;  
            cursor: pointer;  
            transition-duration: 0.4s;  
            width: 100%;
            height: 100%;
        }  
        .ib-button:hover {  
            background-color: #2d5c2f;
        }
        #ib-icon {
            width               : 18px;
            height              : 18px;
            display             : inline-block;
            vertical-align      : middle;
            margin              : -6px 0 0 -0px;
        }
        #ib-icon span {
            font-size           : 18px;
            cursor              : pointer;
            user-select         : none;
            -moz-user-select    : none;
            -webkit-user-select : none;
            -ms-user-select     : none;
        }
        #ib-page-area input, #ib-page-area button, #ib-page-area select {
            outline       : none;
            line-height   : 10px;
        }
        #ib-page-area {
            position      : absolute;
            bottom        : 1px;
            width         : calc(100%);
            border        : none;
            margin        : 0 0 0 -1px;
            box-shadow    : #c7c7c7 0 -5px 5px 0;
            display       : flex;
            flex-flow     : row wrap;
            z-index       : 999;
        }
        #ib-page-area .ib-page-switcher {
            width         : calc(100%);
            border-top    : 1px solid #DCDCDC;
            border-radius : 2px;
            font-family   : WeibeiSC-Bold, STKaiti;
            font-size     : 16px;
            background    : #f5f5f5;
            display       : flex;
            flex-flow     : row wrap;
        }
        #ib-page-area .ib-page-switch-button {
            display          : flex;
            flex-grow        : 1;
            height           : 25px;
            padding          : 2px 0;
            justify-content  : center;
            align-items      : center;
            user-select         : none;
            -moz-user-select    : none;
            -webkit-user-select : none;
            -ms-user-select     : none;
        }
        #ib-page-area .ib-page-switch-button:hover {
            cursor        : pointer;
            background    : #DDDDDD;
        }
        #ib-page-area .ib-page {
            width         : calc(100% - 20px);
            padding       : 10px;
            border-width  : 0 0 1px 0;
            font-family   : WeibeiSC-Bold, STKaiti;
            font-size     : 13px;
            background    : #f5f5f5;
        }
        `;
        document.head.appendChild(style);
        // 图标
        const iconElement = document.createElement('div');
        iconElement.id = 'ib-icon';
        iconElement.title = `[小萝卜] 斗鱼直播间${rid}活动助手`;
        iconElement.innerHTML = `
            <span id="ib-icon-span">${"🥕"}</span>
        `;
        document.getElementsByClassName("ChatToolBar__right")[0].appendChild(iconElement);
        // 页面区域
        const pageAreaElement = document.createElement('div');
        pageAreaElement.id = 'ib-page-area';
        pageAreaElement.style.display = 'none';
        document.getElementsByClassName("layout-Player-asideMainTop")[0].appendChild(pageAreaElement);
        // 点击显示/隐藏页面
        iconElement.addEventListener('click', e => {
            pageAreaElement.style.display = pageAreaElement.style.display === '' ? 'none' : '';
        });
        // 页面切换栏
        let pageSwitcherElement = document.createElement('div');
        pageSwitcherElement.className = 'ib-page-switcher';
        pageSwitcherElement.id = 'ib-page-switcher';
        pageSwitcherElement.style = 'order: 20;'
        pageAreaElement.appendChild(pageSwitcherElement);
        pageSwitcherElement.addEventListener('click', (e) => {
            switchPage(e.target);
        }, false);
    }

    function addPage(pageSwitchButtonTitle) {
        const amount = document.getElementsByClassName("ib-page").length;
        // 页面
        const pageElement = document.createElement('div');
        pageElement.className = 'ib-page';
        pageElement.id = `ib-page-${amount}`;
        pageElement.style.display = amount == 0 ? '' : 'none';
        document.getElementById("ib-page-area").appendChild(pageElement);
        // 页面切换按钮
        const pageSwitchButtonElement = document.createElement('div');
        pageSwitchButtonElement.className = 'ib-page-switch-button';
        pageSwitchButtonElement.id = `ib-page-switch-button-${amount}`;
        pageSwitchButtonElement.innerText = pageSwitchButtonTitle;
        pageSwitchButtonElement.style.backgroundColor = '#f5f5f5';
        pageSwitchButtonElement.setAttribute("page", pageElement.id);
        document.getElementById("ib-page-switcher").appendChild(pageSwitchButtonElement);
        if (amount == 0) {
            switchPage(pageSwitchButtonElement);
        }
        return pageElement;
    }

    function switchPage(buttonElement) {
        if (!buttonElement.hasAttribute("page")) {
            return;
        }
        const pageSwitcherElement = document.getElementById("ib-page-switcher");
        if (!pageSwitcherElement.hasAttribute("current_page_id")) {
            pageSwitcherElement.setAttribute("current_page_id", buttonElement.getAttribute("page"));
            pageSwitcherElement.setAttribute("current_page_button_id", buttonElement.id);
            buttonElement.style.backgroundColor = "#DDDDDD";
            return;
        } else {
            const newPageId = buttonElement.getAttribute("page");
            if (newPageId == pageSwitcherElement.getAttribute("current_page")) {
                return;
            }
            document.getElementById(pageSwitcherElement.getAttribute("current_page_id")).style.display = 'none';
            document.getElementById(pageSwitcherElement.getAttribute("current_page_button_id")).style.backgroundColor = '#f5f5f5';
            document.getElementById(newPageId).style.display = '';
            buttonElement.style.backgroundColor = "#DDDDDD";
            pageSwitcherElement.setAttribute("current_page_id", newPageId);
            pageSwitcherElement.setAttribute("current_page_button_id", buttonElement.id);
        }
    }
    // #endregion 基础

    // #region 共享方法
    function exposeGlobalMethods() {
        unsafeWindow.ib = unsafeWindow.ib || {};
        unsafeWindow.ib.addDanmuWebSocketMessageHandler = addDanmuWebSocketMessageHandler;
        unsafeWindow.ib.addPage = addPage;
        unsafeWindow.ib.showMessage = showMessage;
        unsafeWindow.ib.updateCheck = updateCheck;
        unsafeWindow.ib.getCookieCtn = getCookieCtn;
        unsafeWindow.ib.sendMessage = sendMessage;
        unsafeWindow.ib.setValue = setValue;
        unsafeWindow.ib.getValue = getValue;
    }
    // #endregion 共享方法

    // #region 水友功能
    let autoSendMessage = false;

    let autoSendGift = false;

    let showAutoSendGiftFailMessage = true;

    let sneakAttack = true;

    // 偷塔时机
    let sneakAttackTime = 7;

    // 只有福蛋券才会礼物出战
    let onlyRareAwradSendGift = true;

    let lastTimeAnchorPkEndLimitTime = 0;

    function initUserPage() {
        initConfig();

        // 本次活动特殊设置
        // sneakAttack = false;

        const pageElement = addPage(`${activityName} - 水友`);
        // 本次活动特殊设置
        // 自动发送弹幕
        pageElement.innerHTML += `
        <div class="ib-flex-main-start">
            <input id="ib-auto-send-message-checkbox" type="checkbox" ${autoSendMessage ? "checked" : ""} />
            <label id="ib-auto-send-message-label" style="margin-left: 5px;"></label>
        </div>
        <div class="ib-flex-main-start">
            <input id="ib-auto-send-gift-checkbox" type="checkbox" ${autoSendGift ? "checked" : ""} />
            <label id="ib-auto-send-gift-label" style="margin-left: 5px;"></label>
        </div>
        <div class="ib-flex-main-start">
            <input id="ib-sneak-attack-checkbox" type="checkbox" ${sneakAttack ? "checked" : ""} />
            <label id="ib-sneak-attack-label" style="margin-left: 5px;">
                启用偷塔,${activityPkName}PK剩余时间小于
                <input id="ib-sneak-attack-time-input" type="text" maxlength="2" placeholder="7" value="${sneakAttackTime}" style="width: 20px; text-align: center; color: red;" />
                秒且主播血量大于0时,再自动完成上方选中的任务
                <span style="color: red;">
                    (本次活动墙裂建议开启.但
                </span>
                <span style="color: red; font-weight: bold;">
                    浏览器卡顿
                </span>
                <span style="color: red;">
                    或
                </span>
                <span style="color: red; font-weight: bold;">
                    网络不稳定
                </span>
                <span style="color: red;">
                    或
                </span>
                <span style="color: red; font-weight: bold;">
                    本地时间不准确
                </span>
                <span style="color: red;">
                    并且
                </span>
                <span style="color: red; font-weight: bold;">
                    偷塔时间设置过小(默认7秒,最小3秒)
                </span>
                <span style="color: red;">
                    可能会导致出战时Pk已结束,请酌情修改完成任务的时机,开启该功能后若出现上述问题会有提醒[自动出战时左下角])
                </span>
            </label>
        </div>
        <div class="ib-flex-main-start">
            <input id="ib-only-rare-awrad-send-gift-checkbox" type="checkbox" ${onlyRareAwradSendGift ? "checked" : ""} />
            <label id="ib-only-rare-awrad-send-gift-label" style="margin-left: 5px;">
                只有『${activityPkName}Pk』奖励是『任意福蛋券』时才会送出『${activityGiftName}』礼物
                <span style="color: red;">
                    (仅开启此开关不会送礼物)
                </span>
            </label>
        </div>
        <div class="ib-flex-main-start">
            <input id="ib-show-auto-send-gift-fail-message-checkbox" type="checkbox" ${showAutoSendGiftFailMessage ? "checked" : ""} />
            <label id="ib-show-auto-send-gift-fail-message-label" style="margin-left: 5px;">显示自动送出${activityGiftName}礼物时,未拥有${activityGiftName}礼物的错误信息</label>
        </div>
        `;
        updateSneakAttackShowLabel();
        document.getElementById("ib-auto-send-message-checkbox").addEventListener("change", function () {
            autoSendMessage = this.checked;
            saveAutoSendMessage();
        });
        document.getElementById("ib-auto-send-gift-checkbox").addEventListener("change", function () {
            autoSendGift = this.checked;
            saveAutoSendGift();
        });
        document.getElementById("ib-sneak-attack-checkbox").addEventListener("change", function () {
            sneakAttack = this.checked;
            saveSneakAttack();
            updateSneakAttackShowLabel();
            // todo
            onUpdateSneankAttack();
        });

        document.getElementById("ib-only-rare-awrad-send-gift-checkbox").addEventListener("change", function () {
            onlyRareAwradSendGift = this.checked;
            saveOnlyRareAwradSendGift();
        });

        document.getElementById("ib-sneak-attack-label").addEventListener("click", function (e) {
            e.preventDefault();  
        });

        const sneakAttackTimeInputElement = document.getElementById("ib-sneak-attack-time-input");
        sneakAttackTimeInputElement.addEventListener("input", function () {
            this.value = this.value.replace(/[^0-9]/g, '');
            if (this.value.length > 2) {  
                this.value = this.value.slice(0, 2);  
            }  
        });
        sneakAttackTimeInputElement.addEventListener("blur", function () {
            const newSneakAttackTime = parseInt(this.value, 10);
            if (isNaN(parseInt(this.value, 10)) || !/^\d+$/.test(this.value)) {  //!/^\d+$/.test(this.value)
                showMessage(`${activityPkName}Pk偷塔时间设置不规范, 请输入3-99之间(包含3与99)的有效整数`, true);
                this.value = sneakAttackTime;
            } else if (newSneakAttackTime < 3) {
                showMessage(`${activityPkName}Pk偷塔时间设置不规范, 请输入3-99之间(包含3与99)的有效整数`, true);
                this.value = sneakAttackTime;
            } else if (sneakAttackTime != newSneakAttackTime) {
                sneakAttackTime = newSneakAttackTime;
                saveSneakAttackTime();
                showMessage(`${activityPkName}Pk将在pk剩余 ${this.value} 秒时完成选定任务(出战),请注意查看偷塔选项后括号内的说明,以防出现无效出战`, false);
                this.blur();
            }
        });

        document.getElementById("ib-show-auto-send-gift-fail-message-checkbox").addEventListener("change", function () {
            showAutoSendGiftFailMessage = this.checked;
            saveShowAutoSendGiftFailMessage();
        });

        initAnchorPkFunction();
    }

    function updateSneakAttackShowLabel() {
        if (sneakAttack) {
            document.getElementById("ib-auto-send-message-label").innerText = `${activityPkName}PK满足偷塔条件时,自动发送『${activityMessage}』弹幕(每场1次)`;
            document.getElementById("ib-auto-send-gift-label").innerText = `${activityPkName}PK满足偷塔条件时,自动送出『${activityGiftName}』礼物(每场5次, 每次10个)`;
        } else {
            document.getElementById("ib-auto-send-message-label").innerText = `${activityPkName}PK时,自动发送『${activityMessage}』弹幕(每场1次)`;
            document.getElementById("ib-auto-send-gift-label").innerText = `${activityPkName}PK时,自动送出『${activityGiftName}』礼物(每场5次, 每次10个)`;
        }
    }

    function onUpdateSneankAttack() {
        if (!sneakAttack) {
            anchorPkBattle();
        }
    }

    let currentAnchorPkEndLimitTime = 0;
    function initAnchorPkFunction() {
        addDanmuWebSocketMessageHandler("anchor_pk_notice", anchorPkHandler);
        setInterval(() => {
            if (currentAnchorPkEndLimitTime == 0 || currentAnchorPkEndLimitTime == lastTimeAnchorPkEndLimitTime || currentAnchorPkEndLimitTime <= Date.now()) {
                return;
            }
            if (currentAnchorPkEndLimitTime - Date.now() <= sneakAttackTime * 1000) {
                anchorPkBattle();
            }
        }, 250);
        getActivityRoomPkInfo().then(roomData => {
            if (roomData.error != 0) {
                showMessage(`获取直播间主播Pk信息出现错误, ${roomData.error} ${roomData.msg}`, true);
                return;
            }
            if (roomData.data.endLimitTime == 0) {
                return;
            }
            if (roomData.data.endLimitTime - Date.now() < 1500) {
                return;
            }
            currentAnchorPkEndLimitTime = roomData.data.endLimitTime;
            if (!sneakAttack) {
                anchorPkBattle();
            }
        });
    }


    function anchorPkHandler(data) {
        console.log("调试信息", data);
        if (!("pkStatus" in data)) {
            showMessage(`服务器发送的pk消息解析错误,会影响脚本的正常运行!`, true);
            return;
        }
        if (data.pkStatus == 30) {
            if (!("endLimitTime" in data) || !("serverTime" in data)) {
                showMessage(`服务器发送的pk消息解析错误,本次主播pk脚本将无法正常完成任务!`, true);
                return;
            }
            currentAnchorPkEndLimitTime = data.endLimitTime;
            if (!sneakAttack) {
                anchorPkBattle();
            }
        } else if (data.pkStatus == 40) {
            currentAnchorPkEndLimitTime = 0;
        }
    }

    function anchorPkBattle() {
        lastTimeAnchorPkEndLimitTime = currentAnchorPkEndLimitTime;
        saveLastTimeAnchorPkEndLimitTime();
        getActivityRoomPkInfo().then(roomData => {
            if (roomData.error != 0) {
                showMessage(`获取直播间主播Pk信息出现错误, ${roomData.error} ${roomData.msg}`, true);
                return;
            }
            if (!autoSendMessage && !autoSendGift) {
                return;
            }
            if (roomData.data.endLimitTime == 0) {
                return;
            }
            getActivityRoomPkUserTask().then(pkUserTaskData => {
                if (pkUserTaskData.error != 0 || pkUserTaskData.data.hit.length == 0) {
                    return;
                }
                if (roomData.data.endLimitTime - Date.now() < 800) {
                    if (sneakAttack) {
                        showMessage(`本次出战时机过晚,本次自动出战已暂停,若频繁出现,请重新设置偷塔时间,本次出战距离pk结束还有 ${roomData.data.endLimitTime - Date.now()} 毫秒`, true);
                    }
                    return;
                }
                const anchors = roomData.data.pkAnchor;
                for (let index = 0; index < anchors.length; index++) {
                    if (anchors[index].rid == rid) {
                        if (anchors[index].blood <= 0) {
                            return;
                        } else {
                            break;
                        }
                    }
                }
                getUserBattleCardInfo().then(userBattleCardInfoData => {
                    if (userBattleCardInfoData.error != 0) {
                        showMessage(`获取当前出战卡牌列表出现错误,请反馈给脚本作者,代码: ${userBattleCardInfoData.error},信息: ${userBattleCardInfoData.msg}`, true);
                        return;
                    }
                    if (Object.keys(userBattleCardInfoData.data).length == 0) {
                        showMessage(`当前未设置出战卡牌栏,无法出战`, true);
                        return;
                    }
                    if (userBattleCardInfoData.data.curCid != 0) {
                        showMessage(`当前已有出战卡牌,脚本将使用该卡牌,但可能会导致脚本出战前卡牌死亡,导致无效出战,请尽可能避免手动出战卡牌!`, false);
                        completeAnchorPkBattleTask(roomData, pkUserTaskData, roomData.data.endLimitTime);
                    } else {
                        const pkId = roomData.data.pkId;
                        // const attackMode = userBattleCardInfoData.data.attackMode;
                        const attackMode = "attackMode" in userBattleCardInfoData.data ? userBattleCardInfoData.data.attackMode : 0;

                        let cardId = -1;
                        let cardType = -1;
                        let currentAttackDamage = -1;
                        const cards = userBattleCardInfoData.data.list;
                        for (let index = 0; index < cards.length; index++) {
                            if (cards[index].att > currentAttackDamage && cards[index].curHp > 0) {
                                cardId = cards[index].cid;
                                cardType = cards[index].ctype;
                                currentAttackDamage = cards[index].att;
                            }
                        }
                        if (cardId == -1) {
                            showMessage(`在选择卡牌时出现意料之外的错误!`, true);
                            return;
                        }
                        changeUserBattleCard(pkId, attackMode, cardId, cardType).then(changeUserBattleCardData => {
                            if (changeUserBattleCardData.error != 0) {
                                showMessage(`切换出战卡牌出现错误,代码: ${changeUserBattleCardData.error},信息: ${changeUserBattleCardData.msg}`, true);
                                return;
                            }
                            showMessage(`本次设置出战卡牌Id: ${cardId}, 攻击力: ${currentAttackDamage}`, false);
                            completeAnchorPkBattleTask(roomData, pkUserTaskData, roomData.data.endLimitTime);
                        });
                    }
                });
            });
        });
    }

    function completeAnchorPkBattleTask(roomData, anchorPkUserTaskData, endLimitTime) {
        if (endLimitTime - Date.now() <= 800 && sneakAttack) {
            showMessage(`本次出战时机过晚,可能导致出战失败(请查看出战记录),若多次出现该提醒,说明当前网络不稳或浏览器卡顿不适合开启偷塔功能,请考虑关闭偷塔功能`, true);
        }
        showMessage(`本次出战距离pk结束还有: ${endLimitTime - Date.now()} 毫秒(服务器时间减本地时间,仅供参考)`, false);
        if (autoSendMessage && anchorPkUserTaskData.data.hit[0].total === 1 && anchorPkUserTaskData.data.hit[0].num != 1) {
            sendMessage(activityMessage);
        }
        if (autoSendGift && anchorPkUserTaskData.data.hit[1].total === 5 && anchorPkUserTaskData.data.hit[1].num != 5) {
            if (onlyRareAwradSendGift && !roomData.data.award[0].awardName.includes("福蛋券")) {
                return;
            }
            let needSend = anchorPkUserTaskData.data.hit[1].total - anchorPkUserTaskData.data.hit[1].num;
            const sendGift = async () => {
                const giftPromises = Array.from({ length: needSend }, () =>
                    sendGiftFromBackpack(activityGiftId, 10, rid)
                        .then(result => {
                            if (result) {
                                return 10;
                            } else {
                                return 0;
                            }
                        }));
                const results = await Promise.all(giftPromises);
                const count = results.reduce((total, value) => total + value, 0);
                if (count == 0) {
                    if (showAutoSendGiftFailMessage) {
                        showMessage(`您当前未拥有${activityGiftName}x10个,还需送出 ${needSend * 10 - count} 个完成本场PK任务`, true);
                    }
                } else {
                    showMessage(`成功送出 ${count} 个 ${activityGiftName},还需送出 ${needSend * 10 - count} 个完成本场PK任务`, false);
                }
            };
            sendGift();
        }
    }

    //#region 配置
    function initConfig() {
        autoSendMessage = getAutoSendMessage();
        autoSendGift = getAutoSendGift();
        sneakAttack = getSneakAttack();
        sneakAttackTime = getSneakAttackTime();
        showAutoSendGiftFailMessage = getShowAutoSendGiftFailMessage();
        lastTimeAnchorPkEndLimitTime = getLastTimeAnchorPkEndLimitTime();
        onlyRareAwradSendGift = getOnlyRareAwradSendGift();
    }

    function saveAutoSendMessage() {
        setValue("ib_user_autoSendMessage", autoSendMessage);
    }

    function getAutoSendMessage() {
        return getValue(`ib_user_autoSendMessage`, autoSendMessage);
    }

    function saveAutoSendGift() {
        setValue("ib_user_autoSendGift", autoSendGift);
    }

    function getAutoSendGift() {
        return getValue(`ib_user_autoSendGift`, autoSendGift);
    }

    function saveSneakAttack() {
        setValue("ib_user_sneakAttack", sneakAttack);
    }

    function getSneakAttack() {
        return getValue(`ib_user_sneakAttack`, sneakAttack);
    }

    function saveSneakAttackTime() {
        setValue("ib_user_sneakAttackTime", sneakAttackTime);
    }

    function getSneakAttackTime() {
        return getValue(`ib_user_sneakAttackTime`, sneakAttackTime);
    }

    function saveShowAutoSendGiftFailMessage() {
        setValue("ib_user_showAutoSendGiftFailMessage", showAutoSendGiftFailMessage);
    }

    function getShowAutoSendGiftFailMessage() {
        return getValue(`ib_user_showAutoSendGiftFailMessage`, showAutoSendGiftFailMessage);
    }

    function saveLastTimeAnchorPkEndLimitTime() {
        setValue("ib_user_lastTimeAnchorPkEndLimitTime", lastTimeAnchorPkEndLimitTime);
    }

    function getLastTimeAnchorPkEndLimitTime() {
        return getValue(`ib_user_lastTimeAnchorPkEndLimitTime`, lastTimeAnchorPkEndLimitTime);
    }

    function saveOnlyRareAwradSendGift() {
        setValue("ib_user_onlyRareAwradSendGift", onlyRareAwradSendGift);
    }

    function getOnlyRareAwradSendGift() {
        return getValue(`ib_user_onlyRareAwradSendGift`, onlyRareAwradSendGift);
    }
    //#endregion 配置

    // #region 显示消息
    class MessageElementPool {
        constructor() {
            this.pool = [];
            for (let i = 0; i < 10; i++) {
                this.pool.push(this.createElement());
            }
        }

        createElement() {
            const element = document.createElement('div');
            element.id = 'ib-notification-area-message';
            element.className = 'ib-notification-area-message';
            element.innerHTML += `
            <div class="ib-notification-area-message-border">
                <div class="ib-notification-area-message-progress" for="ib-notification-area-message-progress"></div>
                <label class="ib-notification-area-message-label" for="ib-notification-area-message-label"></label>
                <label class="ib-notification-area-message-close" for="ib-notification-area-message-close" title="关闭">x</label>
            </div>
            `;
            element.querySelector(".ib-notification-area-message-close").addEventListener('click', event => {
                this.release(element);
            });
            // <div class="ib-notification-area-message-border">
            return element;
        }

        acquire(message, error) {
            let element;
            if (this.pool.length > 0) {
                element = this.pool.pop();
            } else {
                element = this.createElement();
            }
            element.style.backgroundColor = error ? '#C00000' : '#13A813';
            element.querySelector(".ib-notification-area-message-progress").style.backgroundColor = error ? '#FA0505' : '#4DBD4D';
            element.querySelector(".ib-notification-area-message-progress").style.width = 1;
            element.querySelector(".ib-notification-area-message-label").textContent = message;
            return element;
        }

        release(element) {
            element.remove();
            this.pool.push(element);
        }
    }

    const messageElementPool = new MessageElementPool();
    var notificationAreaElement;

    function initShowMessageModule() {
        const style = document.createElement('style');
        style.innerHTML += `
        #ib-notification-area {
            position            : fixed;
            bottom              : 15px;
            left                : 10px;
            width               : 100%;
            border              : none;
            display             : flex;
            flex-direction      : column;
            z-index             : 999;
            pointer-events      : none;
            user-select         : none;
            -moz-user-select    : none;
            -webkit-user-select : none;
            -ms-user-select     : none;
        }
        .ib-notification-area-message {
            position            : relative;
            pointer-events      : none;
            margin-top          : 15px;
            border-radius       : 8px;
            width               : 350px;
            overflow            : hidden;
        }
        .ib-notification-area-message-border {  
            display             : flex;  
            align-items         : center;
        } 
        .ib-notification-area-message-progress {
            position            : absolute;
            pointer-events      : none;
            width               : 1px;
            height              : 100%;
        }
        .ib-notification-area-message-label {
            position            : relative;  
            left                : 5px; 
            top                 : -0.6px;
            color               : white;
            font-size           : 14px;
            line-height         : 1.5;
            max-width           : 330px;
            word-wrap           : break-word;
            display             : inline-block;
            text-shadow         : 1px 1px 2px rgba(0, 0, 0, 0.5);
        }
        .ib-notification-area-message-close {
            position            : absolute;
            left                : 96%;
            top                 : -7.7px;
            color               : white;
            font-weight         : bold;
            font-size           : 20px;
            pointer-events      : auto;
        }
        .ib-notification-area-message-close:hover {
            cursor              : pointer;
            color               : #FFA500;
        }
        .ib-notification-area-message-link {
            color               : red;
            pointer-events      : auto;
            text-decoration     : underline;
            font-weight         : bold;
        }
        .ib-notification-area-message-link:hover {
            cursor              : pointer;
        }
        `;
        document.head.appendChild(style);
        notificationAreaElement = document.createElement('div');
        notificationAreaElement.id = 'ib-notification-area';
        document.body.appendChild(notificationAreaElement);
    }

    function showMessage(message, error = false) {
        const messageElement = messageElementPool.acquire(message, error);
        notificationAreaElement.appendChild(messageElement);

        const progressElement = messageElement.querySelector('.ib-notification-area-message-progress');
        updateRemainingTime(messageElement, progressElement, 4900, performance.now());
    }

    function updateRemainingTime(messageElement, progressElement, totalTime, startTime) {
        window.requestAnimationFrame(() => {
            if (!notificationAreaElement.contains(messageElement)) {
                return;
            }
            const remainingTime = performance.now() - startTime;
            if (totalTime >= remainingTime) {
                progressElement.style.width = `${remainingTime / totalTime * 100}%`;
                updateRemainingTime(messageElement, progressElement, totalTime, startTime);
            } else {
                messageElementPool.release(messageElement);
            }
        });
    }

    function showUpdateMessage(curVersion, latestVersion, scriptId, adminVer) {
        const element = document.createElement('div');
        element.id = 'ib-notification-area-message';
        element.className = 'ib-notification-area-message';
        element.innerHTML += `
        <div class="ib-notification-area-message-border">
            <label class="ib-notification-area-message-label">  
                小萝卜斗鱼助手 ${adminVer ? "房管版本" : "水友版本"} 检查到有新版本, 当前版本: ${curVersion}, 最新版本: ${latestVersion}, 更新后请刷新直播间: 
                <a href="https://greasyfork.org/zh-CN/scripts/${scriptId}" class="ib-notification-area-message-link" target="_blank" rel="noopener noreferrer">点我更新</a>  
            </label>
            <label class="ib-notification-area-message-close" for="ib-notification-area-message-close" title="关闭">x</label>
        </div>
        `;
        element.style.backgroundColor = '#511256';
        element.querySelector(".ib-notification-area-message-close").addEventListener('click', event => {
            element.remove();
        });
        notificationAreaElement.appendChild(element);
    }
    // #endregion 显示消息

    // #region 更新
    async function updateCheck(curVersion, scriptId, adminVer) {
        try {
            const result = await getLatestVersion(curVersion, scriptId);
            if (Array.isArray(result) && result[0]) {
                showUpdateMessage(curVersion, result[1], scriptId, adminVer);
            }
        } catch (error) {
            console.error('检查更新时出错:', error);
        }
    }

    function getLatestVersion(curVersion, scriptId) {
        return new Promise((resolve, reject) => {
            fetch(`https://greasyfork.org/zh-CN/scripts/${scriptId}`, {
                method: "GET",
                mode: "cors",
                cache: "no-store",
                credentials: "omit"
            })
                .then(response => response.text())
                .then(html => {
                    try {
                        const doc = new DOMParser().parseFromString(html, "text/html");
                        const versionElement = doc.getElementsByClassName("script-show-version")[1];
                        if (versionElement && versionElement.innerText !== curVersion) {
                            resolve([true, versionElement.innerText]);
                        } else {
                            resolve(false);
                        }
                    } catch (e) {
                        reject(e);
                    }
                }
                )
                .catch(error => {
                    console.error("请求失败", error);
                    reject(error);
                })
        })
    }
    // #endregion 更新

    //#region WebSocket
    function parseJson(string) {
        let res = {};
        let strings = string.split('/');

        strings.forEach(s => {
            let kv = s.split('@=');
            if (kv.length === 2) {
                parseDepthJson(res, kv[0], kv[1], 1);
            }
        });

        return res;
    }

    function parseDepthJson(parentJson, key, value, depth) {
        const jsonSplitString = '@' + 'A'.repeat(depth - 1) + 'S';
        const keyValueSplitString = '@' + 'A'.repeat(depth) + '=';
        if (value.endsWith(jsonSplitString)) {
            value = value.slice(0, value.length - jsonSplitString.length);
            if (!value.includes(keyValueSplitString)) {
                let subJsonArray = [];
                parentJson[key] = subJsonArray;
                let strings = value.split(jsonSplitString);
                for (let index = 0; index < strings.length; index++) {
                    parseDepthJson(subJsonArray, index, strings[index], depth + 1);
                }
            } else {
                let subJson = {};
                parentJson[key] = subJson;
                let strings = value.split(jsonSplitString);
                strings.forEach(s => {
                    let kv = s.split(keyValueSplitString);
                    if (kv.length === 2) {
                        parseDepthJson(subJson, kv[0], kv[1], depth + 1);
                    }
                });
            }
        } else {
            if (/^-?\d+(\.\d+)?$/.test(value)) {
                parentJson[key] = Number(value);
            } else {
                parentJson[key] = value.replace(/@A*S/g, "/");
            }
        }
    }

    function encode(messageJson) {
        let messageString = "";
        Object.entries(messageJson).forEach(([key, value]) => {
            messageString += key.replace(/@/g, "@A").replace(/\//g, "@A");
            messageString += "@=";
            messageString += value.replace(/@/g, "@A").replace(/\//g, "@A");
            messageString += "/";
        });
        messageString += "\0";
        return messageString;
    }

    const CLIENT_MSG_TYPE = 689;
    const SERVER_MSG_TYPE = 690;
    const encoder = new TextEncoder();
    function generateDouYuMessage(messageString, messageType = CLIENT_MSG_TYPE) {
        const bytesArr = encoder.encode(messageString);

        const buffer = new Uint8Array(bytesArr.length + 4 + 4 + 2 + 1 + 1);

        const view = new DataView(buffer.buffer);
        view.setUint32(0, bytesArr.length + 4 + 2 + 1 + 1, true);
        view.setUint32(4, bytesArr.length + 4 + 2 + 1 + 1, true);
        view.setUint16(8, messageType, true);
        view.setUint8(10, 0, true);
        view.setUint8(11, 0, true);
        buffer.set(bytesArr, 12);

        return buffer;
    }

    function generateClientLoginMessage() {
        const json = {};
        json.type = "loginreq";
        json.roomid = String(rid);
        return generateDouYuMessage(encode(json));
    }

    function generateClientJoinRoomMessage() {
        const json = {};
        json.type = "joingroup";
        json.rid = String(rid);
        json.gid = String(-9999);
        return generateDouYuMessage(encode(json));
    }

    function generateClientKeepliveMessage() {
        const json = {};
        json.type = "mrkl";
        return generateDouYuMessage(encode(json));
    }
    //#endregion WebSocket

    // #region Helper
    function setValue(key, value) {
        GM_setValue(`${key}_${rid}`, value);
    }

    function getValue(key, defaultValue) {
        return GM_getValue(`${key}_${rid}`, defaultValue);
    }

    function getRandomInt(min, max) {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }

    function sendMessage(message) {
        if (document.getElementsByClassName("ChatSend-button is-gray").length == 0) {
            document.getElementsByClassName("ChatSend-txt")[0].value = message;
            document.getElementsByClassName("ChatSend-button")[0].click();
            showMessage(`发送弹幕成功: ${message}`, false);
        } else {
            showMessage(`发送弹幕失败: ${message}`, true);
        }
    }

    function getCookieCtn() {
        const cookiesArray = document.cookie.split('; ');
        for (const cookie of cookiesArray) {
            const [name, value] = cookie.split('=');
            if (name === "acf_ccn") {
                return value;
            }
        }
        return null;
    }

    function sendGiftFromBackpack(giftId, amount) {
        return fetch("https://www.douyu.com/japi/prop/donate/mainsite/v1", {
            method: "POST",
            mode: "no-cors",
            credentials: "include",
            headers: {
                "Content-Type": "application/x-www-form-urlencoded"
            },
            body: `propId=${giftId}&propCount=${amount}&roomId=${rid}&bizExt=%7B%22yzxq%22%3A%7B%7D%7D`
        })
            .then(response => response.json())
            .then(data => {
                if (data && data.error == 0) {
                    return true;
                } else {
                    return false;
                }
            });
    }

    //  获取直播间活动PK的玩家任务
    function getActivityRoomPkUserTask() {
        return fetch(`https://www.douyu.com/japi/revenuenc/web/actqzs/anchorPk/hitTask?activity_id=${activityId}&rid=${rid}`, {
            method: "GET",
            mode: "no-cors",
            credentials: "include",
            headers: {
                "Content-Type": "application/x-www-form-urlencoded"
            }
        })
            .then(response => response.json());
    }

    //  获取直播间活动Pk的任务信息(非水友)
    function getActivityRoomPkInfo() {
        return fetch(`https://www.douyu.com/japi/revenuenc/web/actqzs/anchorPk/homePage?activity_id=${activityId}&rid=${rid}`, {
            method: "GET",
            mode: "no-cors",
            credentials: "include",
            headers: {
                "Content-Type": "application/x-www-form-urlencoded"
            }
        })
            .then(response => response.json());
    }

    // 获取当前出战栏所有角色卡
    function getUserBattleCardInfo() {
        return fetch(`https://www.douyu.com/japi/revenuenc/web/actqzs/anchorPk/userBattleInfo?activity_id=${activityId}&rid=${rid}`, {
            method: "GET",
            mode: "no-cors",
            credentials: "include",
            headers: {
                "Content-Type": "application/x-www-form-urlencoded"
            }
        })
            .then(response => response.json());
    }

    // 切换水友出战卡牌
    function changeUserBattleCard(pkId, mode, cardId, cardType) {
        return fetch("https://www.douyu.com/japi/revenuenc/web/actqzs/anchorPk/userChangeCharacter", {
            method: "POST",
            mode: "no-cors",
            credentials: "include",
            headers: {
                "Content-Type": "application/x-www-form-urlencoded"
            },
            body: `ctn=${getCookieCtn()}&activity_id=${activityId}&rid=${rid}&pkId=${pkId}&mode=${mode}&cid=${cardId}&ctype=${cardType}`
        })
            .then(response => response.json());
    }

    // 切换出战角色

    // #endregion Helper

    function intToBinary(num) {
        if (num === 0) {
            return "0";
        }
        while (num > 0) {
            binary = (num & 1) + binary;
            num >>>= 1;
        }
        return binary;
    }

})();