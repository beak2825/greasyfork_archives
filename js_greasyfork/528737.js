// ==UserScript==
// @name         Auto Combat
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Auto Combat Detect!
// @author       LODDY
// @license      CC-BY-NC-SA-1.0
// @match        https://www.milkywayidle.com/*
// @match        https://test.milkywayidle.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=milkywayidle.com
// @grant        none
// @require      https://code.jquery.com/jquery-3.7.1.js
// @downloadURL https://update.greasyfork.org/scripts/528737/Auto%20Combat.user.js
// @updateURL https://update.greasyfork.org/scripts/528737/Auto%20Combat.meta.js
// ==/UserScript==

(() => {
    'use strict';
    // 戰鬥參數設定
    var combatSection = '3';
    var combatArea = '海洋星球';

    // 取得比對名稱
    var initData_character_name = hookWS();
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
        let obj = JSON.parse(message);
        if (obj && obj.type === "init_character_data") {
            initData_character_name = obj.character.name;
        }
        return initData_character_name;
    }

    // 監控戰鬥
    //listenBbattleHookWS();
    function listenBbattleHookWS() {
        // 監控HP等於0
        var onloadHPBarNow = function() {
            const targetNode = document.querySelector('div.BattlePanel_playersArea__vvwlB div.HitpointsBar_hpValue__xNp7m');
            if (targetNode) {
                console.log("start observe battleHPbar");
                console.log(targetNode.innerText);
                //console.log(initData_character_name);
                var regex = /^[0]\/[0-9]+$/;
                if (regex.test(targetNode.innerText)) {
                    //console.log(regex.test(targetNode.innerText));
                    //console.log(targetNode.innerText);
                    // 逃跑
                    var onloadSURRENDER = function() {
                        const targetNodeSURRENDER = document.querySelector('button.Button_button__1Fe9z.Button_warning__1-AMI.Button_fullWidth__17pVU.Button_small__3fqC7');
                        //console.log(targetNodeSURRENDER.innerText)
                        if (targetNodeSURRENDER.innerText == '逃跑') {
                            targetNodeSURRENDER.click();
                            var onloadConfirm = function() {
                                var targetNodeConfirm = document.querySelector('button.Button_button__1Fe9z.Button_success__6d6kU.Button_fullWidth__17pVU');
                                //console.log(targetNodeConfirm.innerText)
                                //var targetNodeConfirm = document.querySelector('button.Button_button__1Fe9z.Button_fullWidth__17pVU');
                                //console.log(targetNodeConfirm.innerText)

                                // 按下確認
                                if (targetNodeConfirm.innerText == '确定') {
                                //if (targetNodeConfirm.innerText == '取消') {
                                    targetNodeConfirm.click();
                                    // 開啟新戰鬥
                                    var onloadNewBattle = function() {
                                        const targetNodeNewBattle = document.querySelectorAll('span.NavigationBar_label__1uH-y');
                                        //console.log(targetNodeNewBattle)
                                        if (targetNodeNewBattle[0]) {
                                            targetNodeNewBattle.forEach((elements) => {
                                                if (elements.innerText == '战斗') {
                                                    //console.log(elements.innerText)
                                                    $(elements).click();
                                                    elements.click();
                                                }
                                            });
                                            // 開啟區域
                                            var onloadNewSection = function() {
                                                const targetNodeNewSection = document.querySelectorAll('span.script_mapIndex');
                                                console.log(targetNodeNewSection)
                                                if (targetNodeNewSection[0]) {
                                                    targetNodeNewSection.forEach((elements) => {
                                                        if (elements.innerText == combatArea) {
                                                            //console.log(elements.innerText)
                                                            $(elements).click();
                                                            elements.click();
                                                        }
                                                    });
                                                    //var target = targetNodeNewSection[combatSection - 1];
                                                    //console.log(targetNodeNewSection[combatSection - 1])
                                                    //$(target).click();
                                                    const targetNodeNewArea = document.querySelectorAll('div.SkillAction_name__2VPXa');
                                                    //console.log(targetNodeNewArea)
                                                    targetNodeNewArea.forEach((elements) => {
                                                        //console.log(elements)
                                                        //console.log(combatArea)
                                                        if (elements.innerText == combatArea) {
                                                            elements.click();
                                                            const targetNodeStart = document.querySelector('button.Button_button__1Fe9z.Button_success__6d6kU.Button_fullWidth__17pVU.Button_large__yIDVZ');
                                                            //console.log(targetNodeStart)
                                                            if (targetNodeStart.innerText == '开始') {
                                                                targetNodeStart.click();
                                                            }
                                                        }
                                                    });
                                                    //targetNodeNewSection.click();
                                                    const targetNodeCheck = document.querySelector('div.CombatUnit_name__1SlO1');
                                                    //console.log(initData_character_name);
                                                    //console.log(targetNodeCheck.innerText);
                                                    if (targetNodeCheck.innerText == initData_character_name) {
                                                        setTimeout(onloadHPBarNow, 1000);
                                                    } else {
                                                        setTimeout(onloadNewBattle, 1000);
                                                    }
                                                } else {
                                                    setTimeout(onloadNewSection, 1000);
                                                }
                                            }
                                            onloadNewSection();
                                        } else {
                                            setTimeout(onloadNewBattle, 1000);
                                        }
                                    }
                                    onloadNewBattle();
                                } else {
                                    setTimeout(onloadConfirm, 1000);
                                }
                            };
                            onloadConfirm();
                        } else {
                            setTimeout(onloadSURRENDER, 1000);
                        }
                    };
                    onloadSURRENDER();
                }
                //console.log("end observe battleHPbar 1");
                setTimeout(onloadHPBarNow, 1000);
            } else {
                //console.log("end observe battleHPbar 2");
                setTimeout(onloadHPBarNow, 1000);
            }
        };
        onloadHPBarNow();
        //console.log("end observe battleHPbar 3");
    }

    let startBtnObj = (btnText) => {
        let buttonObj = document.createElement("button");
        buttonObj.className = 'Button_button__1Fe9z Button_warning__1-AMI Button_small__3fqC7'
        // 按鈕文字
        buttonObj.textContent = btnText;
        // 設定按鈕事件：
        buttonObj.addEventListener("click", () => {
            // 取得戰鬥區域參數
            let prompt1 = prompt("Please enter your name", "3");
            let prompt2 = prompt("Please enter your name", "海洋星球");
            //let prompt1 = prompt("Please enter your name", "11");
            //let prompt2 = prompt("Please enter your name", "深渊小鬼");
            if (prompt1 != null) {
                combatSection = prompt1;
            }

            if (prompt2 != null) {
                combatArea = prompt2;
            }

            // 開始戰鬥
            var onloadNewBattle1 = function() {
                const targetNodeNewBattle = document.querySelectorAll('span.NavigationBar_label__1uH-y');
                //console.log(targetNodeNewBattle)
                targetNodeNewBattle.forEach((elements) => {
                    if (elements.innerText == '战斗') {
                        elements.click();
                    }
                });
                const targetNodeNewSection = document.querySelectorAll('span.script_mapIndex');
                //console.log(targetNodeNewSection)
                var target = targetNodeNewSection[combatSection - 1];
                //console.log(targetNodeNewSection[combatSection - 1])
                $(target).click();
                const targetNodeNewArea = document.querySelectorAll('div.SkillAction_name__2VPXa');
                //console.log(targetNodeNewArea)
                targetNodeNewArea.forEach((elements) => {
                    //console.log(elements)
                    //console.log(combatArea)
                    if (elements.innerText == combatArea) {
                        elements.click();
                        const targetNodeStart = document.querySelector('button.Button_button__1Fe9z.Button_success__6d6kU.Button_fullWidth__17pVU.Button_large__yIDVZ');
                        //console.log(targetNodeStart)
                        if (targetNodeStart.innerText == '开始') {
                            targetNodeStart.click();
                        }
                    }
                });
            }
            onloadNewBattle1();
            listenBbattleHookWS();
        });
        return buttonObj;
    }

    let listenBtnObj = (btnText) => {
        let buttonObj = document.createElement("button");
        buttonObj.className = 'Button_button__1Fe9z Button_warning__1-AMI Button_small__3fqC7'
        // 按鈕文字
        buttonObj.textContent = btnText;
        // 設定按鈕事件：
        buttonObj.addEventListener("click", () => {
            // 取得戰鬥區域參數
            let prompt1 = prompt("Please enter your name", "3");
            let prompt2 = prompt("Please enter your name", "海洋星球");
            //let prompt1 = prompt("Please enter your name", "11");
            //let prompt2 = prompt("Please enter your name", "深渊小鬼");
            if (prompt1 != null) {
                combatSection = prompt1;
            }

            if (prompt2 != null) {
                combatArea = prompt2;
            }
            // 開始監控戰鬥
            listenBbattleHookWS();
        });
        return buttonObj;
    }

    // 新增戰鬥按紐
    const battleButton = document.querySelector("div.Header_leftHeader__PkRWX")
    battleButton.appendChild(startBtnObj('開始戰鬥'))
    battleButton.appendChild(listenBtnObj('監控戰鬥'))
})();