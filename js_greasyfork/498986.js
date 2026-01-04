// ==UserScript==
// @name         小萝卜斗鱼活动助手-房管版本
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
// @connect      douyucdn.cn
// @connect      douyu.com
// @connect      greasyfork.org
// @downloadURL https://update.greasyfork.org/scripts/498986/%E5%B0%8F%E8%90%9D%E5%8D%9C%E6%96%97%E9%B1%BC%E6%B4%BB%E5%8A%A8%E5%8A%A9%E6%89%8B-%E6%88%BF%E7%AE%A1%E7%89%88%E6%9C%AC.user.js
// @updateURL https://update.greasyfork.org/scripts/498986/%E5%B0%8F%E8%90%9D%E5%8D%9C%E6%96%97%E9%B1%BC%E6%B4%BB%E5%8A%A8%E5%8A%A9%E6%89%8B-%E6%88%BF%E7%AE%A1%E7%89%88%E6%9C%AC.meta.js
// ==/UserScript==

(function () {

    if (unsafeWindow.top != unsafeWindow.self) {
        return;
    }

    const scriptInfo = GM_info.script;
    // 版本号
    const version = scriptInfo.version;

    let loadCompleted = false;

    let rid = 0;

    let autoStartPk = false;
    let lastHour = -1;
    let blackAwardList = [];

    // 接近整点时不参与pk
    let isCloseToHour = false;
    const stopMinutes = 50;

    let activityId;
    let activityName;
    let activityPkName;

    window.addEventListener('ibUpdateCheck', function (e) {
        unsafeWindow.ib.updateCheck(version, 498986, true);
    });

    window.addEventListener('ibLoadedComplete', function (e) {
        rid = e.detail.roomId;
        activityId = e.detail.activityId;
        activityName = e.detail.activityName;
        activityPkName = e.detail.activityPkName;
        init();
    });

    // window.addEventListener('ibGetRoomPkInfo', function(e) {  
    //     const roomPkData = e.detail.roomData;
    //     activityHandler(roomPkData);
    // }); 

    function init() {
        // unsafeWindow.ib.updateCheck(version, 498986, true);
        initAdminPage();
        initAnchorPkFunction();
        loadCompleted = true;
    }

    function initAdminPage() {
        initConfig();
        const style = document.createElement('style');
        style.innerHTML += `
        #ib-award-table {  
            width: 100%;
            border-collapse: collapse;  
            user-select         : none;
            -moz-user-select    : none;
            -webkit-user-select : none;
            -ms-user-select     : none;
        }  
        #ib-award-table th, #ib-award-table td {  
            text-align: center;
            padding: 1px;  
            border: 1px solid #ddd;
        }  
        #ib-award-table th:first-child {  
            width: 15%; 
            text-align: center;
        }  
        #ib-award-table th:nth-child(2) {  
            width: 60%; 
            text-align: center;
        }  
        #ib-award-table th:nth-child(3) {  
            width: 25%; 
            text-align: center;
        }  
        #ib-award-table .ib-award-delete-button {  
            border-radius: 4px;   
            background-color: #4CAF50;  
            color: white;  
            cursor: pointer;  
            transition-duration: 0.4s;  
            width: 80%;
            height: 20px;
        }  
        #ib-award-table .ib-award-delete-button:hover {  
            background-color: #2d5c2f;
        }
        #ib-award-table .ib-award-weight-input {   
            width: 80%;
            margin-left: -1.5px;
        }  
        #ib-award-table .ib-award-weight-input::-webkit-inner-spin-button {   
            -webkit-appearance: none;  
            margin: 0;   
        }  
        `;
        document.head.appendChild(style);
        const pageElement = unsafeWindow.ib.addPage(`${activityName} - 房管`);
        pageElement.innerHTML += `
        <div class="ib-flex-main-start">
            <input class="ib-auto-start-pk-checkbox" type="checkbox" ${autoStartPk ? "checked" : ""} />
            <label id="ib-auto-start-pk-label" style="margin-left: 5px;">自动开启 ${activityPkName} Pk</label>
        </div>
        <div class="ib-flex-main-start">
            <input class="ib-is-close-to-hour-checkbox" type="checkbox" ${isCloseToHour ? "checked" : ""} />
            <label id="ib-is-close-to-hour-label" style="margin-left: 5px;">距离下个整点少于10分钟时,不再自动开启${activityPkName}PK,用于抢整点刷新的PK奖励</label>
        </div>
        <hr style="margin: -5px -10px 0px -10px;" />
        <div class="ib-flex-main-center">
            <label id="ib-award-title-label" style="font-size: 16px; color: black; margin-bottom: -5px;">${activityName}Pk奖励配置</label>
        </div>
        <div class="ib-flex-main-start">
            <table id="ib-award-table">  
                <tr>  
                    <th>启用</th>  
                    <th>奖励</th>  
                    <th>奖励权重</th>  
                </tr>  
            </table>  
        </div>
        <div class="ib-flex-main-center">
            <label>权重计算公式为: 总权重 = 权重 * 奖励数量 (*是乘)</label>
        </div>
        `;
        pageElement.querySelector(".ib-auto-start-pk-checkbox").addEventListener('change', function () {
            autoStartPk = this.checked;
            saveAutoStartPk();
        });
        pageElement.querySelector(".ib-is-close-to-hour-checkbox").addEventListener('change', function () {
            isCloseToHour = this.checked;
            saveIsCloseToHour();
        });
        initAwardTableRow();
        // #ib-award-table th:nth-child(4) {  
        //     width: 20%; 
        //     text-align: center;
        // } 
        // <th>操作</th>  
        // <td><button class="ib-award-delete-button">删除</button></td> 
        //     <div class="ib-flex-main-start">
        //     <textarea id="ib-add-award-textarea" rows="3" style="width: 70%; resize: none; overflow: hidden;" placeholder="输入自定义奖励, 回车添加" /></textarea>
        //     <div style="width: 30%;">
        //         <button class="ib-button" style="margin-top: -10%; margin-left: 2.5%; width: 95%; height: 25px;">复制配置</button>
        //         <button class="ib-button" style="margin-top: 10%; margin-left: 2.5%; width: 95%; height: 25px;">粘贴导入配置</button>
        //     </div>
        // </div>
        //     <div class="ib-flex-main-start">
        //     <input id="ib-start-pk-send-message-checkbox" type="checkbox" ${autoPk ? "checked" : ""} />
        //     <label id="ib-start-pk-send-message-label">${activityPkName}Pk开始时发送弹幕:</label>
        // </div>
        // <div class="ib-flex-main-start">
        //     <input id="ib-start-pk-send-message-checkbox" type="checkbox" ${autoPk ? "checked" : ""} />
        //     <label id="ib-auto-pk-label">${activityPkName}Pk偷塔时发送弹幕:</label>
        // </div>
    }

    function initAwardTableRow() {
        const awardTableElement = document.getElementById("ib-award-table");
        awardList.forEach(function (value, index, array) {
            const rowElement = document.createElement('tr');
            rowElement.innerHTML = `
            <td><input class="ib-table-award-enable-checkbox" type="checkbox" ${awardSetting[value].enable ? "checked" : ""} /></td>
            <td>${value}</td>  
            <td><input class="ib-award-weight-input" type="text" value="${awardSetting[value].weight}" /></td>
            `;
            awardTableElement.appendChild(rowElement);
            rowElement.querySelector(".ib-table-award-enable-checkbox").addEventListener("change", function () {
                awardSetting[value].enable = this.checked;
                saveAwardSetting();
                unsafeWindow.ib.showMessage(`${activityPkName}的奖励 ${value} 已${awardSetting[value].enable ? `启用, 当前权重为 ${awardSetting[value].weight}` : "禁用, 权重将按0计算"}`, !awardSetting[value].enable);
                if (awardSetting[value].enable && awardSetting[value].weight == 0) {
                    unsafeWindow.ib.showMessage(`${activityPkName}的奖励 ${value} 已启用, 但请注意, 当前奖励的权重为0, 请设置当前奖励的权重`, true);
                }
            });
            const weightInputElement = rowElement.querySelector(".ib-award-weight-input");
            weightInputElement.addEventListener("input", function () {
                let firstString = "";
                if (this.value.startsWith("-")) {
                    firstString = "-";
                }
                this.value = firstString + this.value.replace(/[^0-9]/g, '');
            });
            weightInputElement.addEventListener("blur", function () {
                const newWeight = parseInt(this.value, 10);
                if (isNaN(parseInt(this.value, 10)) || (this.value.startsWith("-") && !/^\d+$/.test(this.value.substring(1))) || (!this.value.startsWith("-") && !/^\d+$/.test(this.value))) {  //!/^\d+$/.test(this.value)
                    unsafeWindow.ib.showMessage(`${activityPkName}的奖励 ${value} 权重设置不规范, 请输入有效整数`, true);
                    this.value = awardSetting[value].weight;
                } else if (awardSetting[value].weight != newWeight) {
                    this.value = newWeight;
                    awardSetting[value].weight = this.value;
                    saveAwardSetting();
                    unsafeWindow.ib.showMessage(`${activityPkName}的奖励 ${value} 权重已设置为 ${this.value}`, false);
                    if (!awardSetting[value].enable) {
                        unsafeWindow.ib.showMessage(`${activityPkName}的奖励 ${value} 权重已设置为 ${this.value} ${awardSetting[value].enable ? "" : ", 但请注意, 你未启用该奖励, 权重仍按0计算"}`, !awardSetting[value].enable);
                    }
                }
            });
        });
    }

    const awardList = [
        "钻石双倍卡",
        "黄金双倍卡",
        "白银双倍卡",
        "铁皮礼物双倍卡",
        "钻石双倍卡碎片",
        "黄金双倍卡碎片",
        "白银双倍卡碎片",
        "铁皮双倍卡碎片",
        "房间VIP卡",
        "房间VIP卡碎片",
        "0.1元粉丝牌卡",
        "1元粉丝牌卡(1天)",
        "顶级福蛋券",
        "高级福蛋券",
        "初级福蛋券",
        "鱼翅红包",
        "量子火箭",
        "九天云出",
        "音乐车",
        "城池"
    ]

    var awardSetting = null;

    //#region 配置
    function initConfig() {
        autoStartPk = getAutoStartPk();
        isCloseToHour = getIsCloseToHour();
        awardSetting = getAwardSetting();
        let change = false;
        awardList.forEach(function (value, index, array) {
            if (!(value in awardSetting)) {
                awardSetting[value] = {
                    enable: false,
                    weight: 0
                };
                change = true;
            }
        });
        if (change) {
            saveAwardSetting();
        }
    }

    function saveAutoStartPk() {
        unsafeWindow.ib.setValue("ib_auto_start_pk", autoStartPk);
    }

    function getAutoStartPk() {
        return unsafeWindow.ib.getValue("ib_auto_start_pk", autoStartPk);
    }

    function saveAwardSetting() {
        unsafeWindow.ib.setValue("ib_award_setting", awardSetting);
    }

    function getAwardSetting() {
        return unsafeWindow.ib.getValue("ib_award_setting", {});
    }

    function saveIsCloseToHour() {
        unsafeWindow.ib.setValue("ib_is_close_to_hour", isCloseToHour);
    }

    function getIsCloseToHour() {
        return unsafeWindow.ib.getValue("ib_is_close_to_hour", isCloseToHour);
    }
    //#endregion 配置

    // let currentAnchorPkEndLimitTime = 0;
    let firstGetAnchorPkInfo = false;
    let isAnchorPking = false;
    function initAnchorPkFunction() {
        unsafeWindow.ib.addDanmuWebSocketMessageHandler("anchor_pk_notice", anchorPkEndHandler);
        // getActivityRoomPkInfo().then(roomData => {
        //     if (roomData.error != 0) {
        //         showMessage(`获取直播间主播Pk信息出现错误, ${roomData.error} ${roomData.msg}`, true);
        //         return;
        //     }
        //     isAnchorPking = roomData.data.endLimitTime != 0;
        //     // currentAnchorPkEndLimitTime = roomData.data.endLimitTime;
        //     setInterval(() => {
        //         checkBlackAwardList();
        //         if (autoStartPk && !isAnchorPking && isAnchorPkAllowedTime()) {

        //         }
        //     }, 5000);
        // });
        setInterval(() => {
            checkBlackAwardList();
            // unsafeWindow.ib.showMessage(`${isAnchorPkAllowedTime()}`, false);
            if (autoStartPk && !isAnchorPking && isAnchorPkAllowedTime()) {
                getActivityRoomPkInfo().then(roomData => {
                    if (roomData.error != 0) {
                        unsafeWindow.ib.showMessage(`获取直播间主播Pk信息出现错误, ${roomData.error} ${roomData.msg}`, true);
                        return;
                    }
                    // unsafeWindow.ib.showMessage(`调试信息: 房管版本获取直播间消息`, false);
                    if (!firstGetAnchorPkInfo) {
                        firstGetAnchorPkInfo = true;
                        isAnchorPking = roomData.data.endLimitTime != 0;
                        if (isAnchorPking) {
                            return;
                        }
                    }
                    // unsafeWindow.ib.showMessage(`调试信息: 房管版本尝试开启pk`, false);
                    startPk(roomData);
                });
            }
        }, 5000);
    }

    function isAnchorPkAllowedTime() {
        const date = new Date();
        const currentHour = date.getHours();
        // 正在活动期间(普通)
        if (currentHour >= 1 && currentHour <= 11) {
            return false;
        }
        // 临近整点
        if (isCloseToHour && date.getMinutes() >= stopMinutes) {
            return false;
        }
        // boss
        if (date.getMinutes() >= 50 || date.getMinutes() < 10) {
            return false;
        }
        return true;
    }

    function anchorPkEndHandler(data) {
        if (!("pkStatus" in data)) {
            unsafeWindow.ib.showMessage(`服务器发送的pk消息解析错误,会影响脚本的正常运行!`, true);
            return;
        }
        switch (data.pkStatus) {
            // 只有自己一个人
            case 10:
                isAnchorPking = true;
                break;
            // 等待状态
            case 20:
                isAnchorPking = true;
                break;
            // 开始
            case 30:
                isAnchorPking = true;
                // currentAnchorPkEndLimitTime = data.endLimitTime;
                break;
            // 结束
            case 40:
                isAnchorPking = false;
                // currentAnchorPkEndLimitTime = 0;
                break;
            // 无人对战 解散
            case 50:
                isAnchorPking = false;
                // currentAnchorPkEndLimitTime = 0;
                break;
            default:
                unsafeWindow.ib.showMessage(`房管版本pk消息未知返回值: ${data.pkStatus}`, true);
                break;
        }
    }

    // function activityHandler(roomPkData) {
    //     if (!loadCompleted) {
    //         return;
    //     }
    //     checkBlackAwardList();
    //     if (autoStartPk) {
    //         if (isCloseToHour && new Date().getMinutes() >= stopMinutes) {
    //             return;
    //         }
    //         startPk(roomPkData);
    //     }
    // }

    function checkBlackAwardList() {
        if (new Date().getHours() != lastHour) {
            blackAwardList = [];
            if (lastHour != -1) {
                unsafeWindow.ib.showMessage(`整点已重置无库存奖励黑名单`, false);
            }
            lastHour = new Date().getHours();
        }
    }

    function startPk(roomPkData) {
        let level = roomPkData.data.anchorLv;
        let startTime = roomPkData.data.createTime;
        let endTime = roomPkData.data.endLimitTime;
        if (startTime === 0 && endTime === 0) {
            getActivityRoomPkAwardList(level).then(awardListData => {
                if (awardListData.error != 0) {
                    return;
                }
                const awardWeightMap = new Map();
                const roomPkAwardMap = awardListData.data.awardMap;
                // var awardInfo = "";
                for (let awardKey in roomPkAwardMap) {
                    if (blackAwardList.includes(awardKey)) {
                        continue;
                    }
                    // let awardQuantityIsZero = false;
                    let weight = 0;
                    var awards = roomPkAwardMap[awardKey];
                    if (awards[0].name in awardSetting) {
                        if (awards[0].num == 0) {
                            continue;
                        }
                        if (awardSetting[awards[0].name].enable) {
                            weight += awardSetting[awards[0].name].weight * awards[0].num;
                            // unsafeWindow.ib.showMessage(`${awardSetting[awards[0].name].weight} ${awards[0].name}*${awards[0].num} ${weight}`, false);
                        }
                    }
                    if (awards[1].name in awardSetting) {
                        if (awards[1].num == 0) {
                            continue;
                        }
                        if (awardSetting[awards[1].name].enable) {
                            weight += awardSetting[awards[1].name].weight * awards[1].num;
                            // unsafeWindow.ib.showMessage(`${awardSetting[awards[1].name].weight} ${awards[1].name}*${awards[1].num} ${weight}`, false);
                        }
                    }
                    awardWeightMap.set(awardKey, weight);
                    // if (awardInfo != "") {
                    //     awardInfo += "\n";
                    // }
                    // awardInfo += `${awards[0].name}*${awards[0].num} 与 ${awards[1].name}*${awards[1].num} 权重为${weight}`;
                }
                let highestWeightAwardKey = null;
                let highestWeightValue = Number.MIN_SAFE_INTEGER;
                awardWeightMap.forEach((value, key) => {
                    if (value > highestWeightValue) {
                        highestWeightValue = value;
                        highestWeightAwardKey = key;
                    }
                });
                if (highestWeightAwardKey != null) {
                    if (highestWeightValue <= 0) {
                        unsafeWindow.ib.showMessage(`本次Pk奖励选择(权重小于0,将不加入PK): ${roomPkAwardMap[highestWeightAwardKey][0].name}*${roomPkAwardMap[highestWeightAwardKey][0].num} 与 ${roomPkAwardMap[highestWeightAwardKey][1].name}*${roomPkAwardMap[highestWeightAwardKey][1].num}, 权重: ${highestWeightValue}`, false);
                        return;
                    }
                    // awardInfo += `\n最终选择 ${awards[0].name}*${awards[0].num} 与 ${awards[1].name}*${awards[1].num} 权重为${highestWeightValue}`;
                    unsafeWindow.ib.showMessage(`本次Pk奖励选择: ${roomPkAwardMap[highestWeightAwardKey][0].name}*${roomPkAwardMap[highestWeightAwardKey][0].num} 与 ${roomPkAwardMap[highestWeightAwardKey][1].name}*${roomPkAwardMap[highestWeightAwardKey][1].num}, 权重: ${highestWeightValue}`, false);
                    getActivityRoomPkRefreshInfo(level, highestWeightAwardKey).then(pkPreData => {
                        if (pkPreData.error != 0) {
                            unsafeWindow.ib.showMessage(`获取PKID时出现错误, id: ${pkPreData.error}, 信息: ${pkPreData.msg}`, true);
                            return;
                        }
                        const pkId = pkPreData.data == undefined || pkPreData.data.pkId === undefined ? 0 : pkPreData.data.pkId;
                        joinActivityRoomPk(level, highestWeightAwardKey, pkId).then(pkData => {
                            if (pkData.error === 0) {
                                // 成功加入
                                unsafeWindow.ib.showMessage(`成功开启${activityName}Pk, 本次奖励: ${roomPkAwardMap[highestWeightAwardKey][0].name}*${roomPkAwardMap[highestWeightAwardKey][0].num} 与 ${roomPkAwardMap[highestWeightAwardKey][1].name}*${roomPkAwardMap[highestWeightAwardKey][1].num}, 权重: ${highestWeightValue}`, false);
                            } else if (pkData.error === 500002) {
                                unsafeWindow.ib.showMessage(`加入Pk时出现错误: ${pkData.error} ${pkData.msg}`, true);
                                blackAwardList.push(highestWeightAwardKey);
                            } else {
                                unsafeWindow.ib.showMessage(`加入Pk时出现错误: ${pkData.error} ${pkData.msg}`, true);
                            }
                        });
                    });
                }
            });
        }
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

    // 获取房间Pk奖励列表
    function getActivityRoomPkAwardList(level) {
        return fetch(`https://www.douyu.com/japi/revenuenc/web/actqzs/anchorPk/pkPool?activity_id=${activityId}&rid=${rid}&awardLevel=${level}`, {
            method: "GET",
            mode: "no-cors",
            credentials: "include",
            headers: {
                "Content-Type": "application/x-www-form-urlencoded"
            }
        })
            .then(response => response.json());
    }

    // 获取奖励的PK信息, 获取PKID
    function getActivityRoomPkRefreshInfo(awardLevel, awardKey) {
        return fetch(`https://www.douyu.com/japi/revenue/web/actqzs/anchorPk/pkRefresh?activity_id=${activityId}&rid=${rid}&awardLevel=${awardLevel}&awardKey=${awardKey}&pkId=0`, {
            method: "GET",
            mode: "cors",
            credentials: "include",
            headers: {
                // "Content-Type": "application/x-www-form-urlencoded"
            }
        })
            .then(response => response.json());
    }

    // 房间加入Pk
    function joinActivityRoomPk(awardLevel, awardKey, pkId) {
        // return fetch("https://www.douyu.com/japi/revenuenc/web/cardArena/pkJoin", {
        return fetch("https://www.douyu.com/japi/revenuenc/web/actqzs/anchorPk/pkJoin", {
            method: "POST",
            mode: "cors",
            credentials: "include",
            headers: {
                "Content-Type": "application/x-www-form-urlencoded"
            },
            body: `ctn=${unsafeWindow.ib.getCookieCtn()}&activity_id=${activityId}&rid=${rid}&awardLevel=${awardLevel}&awardKey=${awardKey}&pkId=${pkId}`
        })
            .then(response => response.json());
    }

})();