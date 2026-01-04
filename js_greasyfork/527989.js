// ==UserScript==
// @name         MWTools plus
// @namespace    http://tampermonkey.net/
// @version      2025-12-31 10:50
// @description  基於 MWTools 的次數設定進行強化
// @author       mike
// @match        https://www.milkywayidle.com/*
// @match        https://test.milkywayidle.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=milkywayidle.com
// @grant        GM.registerMenuCommand
// @grant        GM.getValue
// @grant        GM.setValue
// @downloadURL https://update.greasyfork.org/scripts/527989/MWTools%20plus.user.js
// @updateURL https://update.greasyfork.org/scripts/527989/MWTools%20plus.meta.js
// ==/UserScript==

(async function () {
    'use strict';

    class CommonFunc {
        // 等待物件 func
        waitForElement = (selector, callback) => {
            const interval = setInterval(() => {
                const element = document.querySelector(selector);
                if (element) {
                    clearInterval(interval); // 找到元素後清除定時器
                    callback(element);
                }
            }, 100); // 每 100 毫秒檢查一次
        }
    }
    const cf = new CommonFunc()

    // menu 開關
    // 設定預設值
    let doCharacterSelectReflash = await GM.getValue("doCharacterSelectReflash");
    if (doCharacterSelectReflash === void 0) {
        doCharacterSelectReflash = true;
        GM.setValue("doCharacterSelectReflash", doCharacterSelectReflash);
    }
    // 註冊 menu 選項
    GM.registerMenuCommand(
        `選擇角色畫面刷新: ${doCharacterSelectReflash ? '開' : '關'}`,
        () => {
            let doCharacterSelectReflashNew = !doCharacterSelectReflash;
            GM.setValue("doCharacterSelectReflash", doCharacterSelectReflashNew).then(() =>
                location.reload()
            );
        }
    );
    let characterSelectTimer
    // 判斷有沒有設定 選擇角色畫面刷新
    if (doCharacterSelectReflash) {
        // 選擇角色頁面 每 30 秒重新刷新一次
        cf.waitForElement('.CharacterSelectPage_content__-8-oQ', () => {
            characterSelectTimer = setTimeout(() => {
                location.reload()
            }, 30 * 1000)
        })
    }

    // 設定次數
    const setInputBoxValue = (value, inputBox) => {
        // 設定數值
        let inputBoxValueOrg = parseInt(inputBox.value)
        inputBox.value = value
        // 設定數值??
        let event = new Event("input", { bubbles: true });
        event.simulated = true;
        let tracker = inputBox._valueTracker;
        if (tracker) {
            tracker.setValue(inputBoxValueOrg);
        }
        inputBox.dispatchEvent(event);
    }
    // 變更次數按鈕
    const btnObj = (btnText, operateNum, inputBox) => {
        let buttonObj = document.createElement("button");
        buttonObj.className = 'Button_button__1Fe9z Button_small__3fqC7'
        // 按鈕文字
        buttonObj.textContent = btnText;
        // 設定按鈕事件：
        buttonObj.addEventListener("click", () => {
            // 設定數值
            if (inputBox.value == 'unlimited' || inputBox.value == '∞') inputBox.value = 0
            let inputBoxValueOrg = parseInt(inputBox.value)
            let inputBoxValue = inputBoxValueOrg + operateNum
            setInputBoxValue(inputBoxValue, inputBox)
        });
        return buttonObj
    }
    // 設定次數時 增加數量操作按鈕
    const doAddOperateNumberBtn = () => {
        // 偵測 動作 畫面是否已經開啟, 方便後續增加次數操作按鈕
        const mainPanel = 'div.GamePage_mainPanel__2njyb'
        cf.waitForElement(mainPanel, () => {
            const targetNode = document.querySelector(mainPanel);
            // MutationObserver 是一種 節點偵測 操作, 定義節點變化時的操作
            const actionPanelObserver = new MutationObserver(async function (mutations) {
                for (const mutation of mutations) {
                    for (const added of mutation.addedNodes) {
                        if (
                            added?.classList?.contains("Modal_modalContainer__3B80m") &&
                            added.querySelector("div.SkillActionDetail_regularComponent__3oCgr")
                        ) {
                            // 次數操作區塊
                            const actionPanel = added.querySelector("div.SkillActionDetail_regularComponent__3oCgr")

                            // 次數輸入框
                            const inputBox = actionPanel.querySelector('input.Input_input__2-t98')
                            // 預設數值 unlimited

                            // 次數區塊
                            const timesArea = added.querySelector("div.SkillActionDetail_maxActionCountInput__1C0Pw")
                            // 對畫面 增加快速按鈕
                            timesArea.appendChild(btnObj('+1', 1, inputBox))
                            timesArea.appendChild(btnObj('+10', 10, inputBox))
                            timesArea.appendChild(btnObj('+100', 100, inputBox))
                            timesArea.appendChild(btnObj('+1k', 1000, inputBox))
                            timesArea.appendChild(btnObj('+1w', 10000, inputBox))

                            // 目標級的次數
                            cf.waitForElement('#tillLevelNumber', () => {
                                const tillLevelNumber = actionPanel.querySelector('#tillLevelNumber')
                                tillLevelNumber.addEventListener('click', () => {
                                    const nextLevelNeedTimes = tillLevelNumber.textContent.split(' ')[0]
                                    setInputBoxValue(nextLevelNeedTimes, inputBox)
                                })
                            })
                        }
                    }
                }
            });
            // 執行偵測模式, 屬性、子節點、字元內容
            actionPanelObserver.observe(targetNode, { attributes: false, childList: true, subtree: true });
        })
    }

    // 增加一個回到腳色列表的功能
    const doAddGoBackCharacterSelect = () => {
        // 在名字加一個 進入腳色切換頁面 的按鈕
        const characterName = 'div.Header_info__26fkk'
        cf.waitForElement(characterName, () => {
            const targetNode = document.querySelector(characterName)
            targetNode.addEventListener('click', () => {
                // 等同切換腳色功能
                location.href = '/characterSelect'
            })
        })
        // // 在頭像加一個 進入腳色切換頁面 的按鈕
        // const headerAvatar = 'div.Header_avatar__2RQgo'
        // cf.waitForElement(headerAvatar, () => {
        //     const targetNode = document.querySelector(headerAvatar)
        //     targetNode.addEventListener('click', () => {
        //         // 等同切換腳色功能
        //         location.href = '/characterSelect'
        //     })
        // })
        // 改用 https://greasyfork.org/zh-CN/scripts/538797-银河奶牛-生产采集增强-mwi-production-gathering-enhanced
    }

    // 客制化 右側 tab 點擊事件
    const customizationTabClick = () => {
        const characterManagementPanelClassName = '.GamePage_characterManagementPanel__3OYQL'
        cf.waitForElement(characterManagementPanelClassName, () => {
            // 找到右側所有 tab
            const characterManagementPanel = document.querySelector(characterManagementPanelClassName)
            const MuiTabs = characterManagementPanel.querySelector('.MuiTabs-flexContainer')
            const MuiTab = MuiTabs.querySelectorAll('.MuiTab-root')
            // 找特定 tab, 對其加上 ckick 事件
            MuiTab.forEach((item) => {
                let MuiBadge = item.querySelector('.MuiBadge-root')
                if ('库存' == MuiBadge.textContent) {
                    item.addEventListener('click', doCreateAutoOpenBoxFunc)
                } else if ('房屋' == MuiBadge.textContent) {
                    item.addEventListener('click', doUpgradeHouseUI)
                }
            })
        })
    }

    // 調整房屋列表的UI
    const doUpgradeHouseUI = () => {
        const houseRoomsClassName = '.HousePanel_houseRooms__3K61R'
        cf.waitForElement(houseRoomsClassName, () => {
            console.log('找到房子啦')
            const houseRooms = document.querySelector(houseRoomsClassName)
            const houseRoom = houseRooms.querySelectorAll('.HousePanel_houseRoom__nOmpF')
            houseRoom.forEach((item) => {
                //item.style.width = '100px'
                //item.style.height = '100px'
            })

        })
    }

    // 建制一鍵開啟所有戰利品的功能
    const autoOpen = (itemGrid) => {
        console.log('自動開啟')
        console.log(itemGrid)
        const itemContainer = itemGrid.querySelectorAll('.Item_itemContainer__x7kH1')
        itemContainer.forEach((item)=>{
            
        })

    }
    const doCreateAutoOpenBoxFunc = () => {
        const itemClassName = '.Inventory_items__6SXv0'
        cf.waitForElement(itemClassName, () => {
            // 庫存物件
            const item = document.querySelector(itemClassName)
            // 庫存格物件
            const itemGrid = document.querySelectorAll('.Inventory_itemGrid__20YAH')
            //
            itemGrid.forEach((item)=>{
                // 庫存標題物件
                const itemGridLabel = item.querySelector('.Inventory_label__XEOAx')
                if(null !== itemGridLabel){
                    const itemcategoryButton = itemGridLabel.querySelector('.Inventory_categoryButton__35s1x')
                    if('战利品' == itemcategoryButton.textContent || '+ 战利品' == itemcategoryButton.textContent.slice(0, 5)){
                        if(itemGridLabel.querySelectorAll('button').length == 0){
                            let autoOpenBtn = document.createElement("button");
                            autoOpenBtn.style.marginLeft = '5px';
                            autoOpenBtn.style.backgroundColor = "black";
                            autoOpenBtn.style.color = "white";
                            autoOpenBtn.style.border = "1px solid"
                            autoOpenBtn.style.borderRadius = "10px";
                            autoOpenBtn.style.cursor = "pointer";
                            autoOpenBtn.textContent = '一鍵開啟';
                            autoOpenBtn.addEventListener("click", () => {
                                autoOpen(item)
                            });
                            itemGridLabel.appendChild(autoOpenBtn)
                        }
                    }
                }
            })
            

            // let autoOpenBtn = document.createElement("button");
            // autoOpenBtn.style.cursor = "pointer";
            // autoOpenBtn.textContent = '一鍵開啟';
            // autoOpenBtn.addEventListener("click", autoOpen);
            // console.log(autoOpenBtn)
            
            // itemGridLabel.appendChild('<div>123</div>')
            //itemGridTitle.addEventListener('click', autoOpen)
        })
    }

    // 調整手機左側按鈕大小
    const fixUiForMobile = () => {
        if (768 > document.body.clientWidth) {
            // 手機
            // 左側
            const GamePage_navPanel = 'div.GamePage_navPanel__3wbAU'
            cf.waitForElement(GamePage_navPanel, () => {
                const targetNode = document.querySelector(GamePage_navPanel)
                targetNode.style.width = '4rem'
            })
            // NavigationBar_navigationBarContainer__18vsw
            // 圖案塊
            const navigationBar_navigationBarContainer = 'div.NavigationBar_navigationBarContainer__18vsw'
            cf.waitForElement(navigationBar_navigationBarContainer, () => {
                const targetNode = document.querySelector(navigationBar_navigationBarContainer)
                targetNode.style.width = '4rem'
            })
            // 圖案塊
            const NavigationBar_navigationLinks = 'div.NavigationBar_navigationLinks__1XSSb'
            cf.waitForElement(NavigationBar_navigationLinks, () => {
                const targetNode = document.querySelector(NavigationBar_navigationLinks)
                targetNode.style.width = '4rem'
            })
            // 圖案大小
            const icon = 'svg.Icon_icon__2LtL_.Icon_small__2bxvH'
            cf.waitForElement(icon, () => {
                const targetNode = document.querySelectorAll(icon)
                targetNode.forEach((item) => {
                    item.style.width = '4rem'
                    item.style.height = '4rem'
                })
            })
        }
    }

    // 執行劫持 webSocket
    hookWS();
    // 劫持 webSocket 訊息, 進行處理
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
    // 判斷訊息資訊執行需要的操作, 直接回傳原始訊息
    const handleMessage = (message) => {
        let obj = JSON.parse(message);
        if (obj && obj.type === "init_character_data") {
            // 關上選擇角色畫面啟動的 timer
            clearTimeout(characterSelectTimer)

            // 設定次數時 增加數量操作按鈕
            doAddOperateNumberBtn()
            // 在名字加一個 進入腳色切換頁面 的按鈕
            doAddGoBackCharacterSelect()
            // 客制化 右側 tab 點擊事件
            //customizationTabClick()

            // 調整手機左側按鈕大小
            fixUiForMobile()
        }
        return message
    }
})();