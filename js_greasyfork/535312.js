// ==UserScript==
// @name         NG Space Company
// @namespace    http://tampermonkey.net/
// @version      2025-12-31 10:43
// @description  for NG Space Company plugin
// @author       Mike
// @match        https://ngsc.freddecgames.com/
// @icon         https://www.google.com/s2/favicons?sz=64&domain=freddecgames.com
// @grant        GM_registerMenuCommand
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        GM_info
// @downloadURL https://update.greasyfork.org/scripts/535312/NG%20Space%20Company.user.js
// @updateURL https://update.greasyfork.org/scripts/535312/NG%20Space%20Company.meta.js
// ==/UserScript==

// 文件 https://www.tampermonkey.net/documentation.php

(function () {
    'use strict';

    // const constantVolume = GM.getValue(constantVolume)
    // GM_registerMenuCommand(
    //     `恆定音量: ${constantVolume ? 'on' : 'off'}`,
    //     () => {
    //         constantVolume = !constantVolume;
    //         GM_setValue("constantVolume", constantVolume).then(() =>
    //             location.reload()
    //         );
    //     }
    // );

    ////// 顯示文字 //////
    class ShowInfo {
        infoShowWait = 1500 // 訊息顯示多久
        // 寫訊息
        writeTextBox = (str, autoDisappear = true) => {
            let textBox = document.getElementById('infoBox')
            if (textBox) {
                textBox.textContent = str
                if ('' != str && true == autoDisappear) {
                    setTimeout(() => { this.writeTextBox('') }, this.infoShowWait)
                }
            } else {
                console.log(str)
            }
        }
        // 訊息框
        infoBoxObj = () => {
            let textBox = document.createElement('div');
            textBox.id = 'infoBox';
            textBox.textContent = '';
            textBox.className = 'text-success'
            return textBox
        }
    }
    var si = new ShowInfo()

    ////// 共用 //////
    class CommonFunc {
        //
        getResourcePane = () => {
            // 取得物件名稱
            let page = document.getElementById('page')
            let tabPane = page.getElementsByClassName('tab-pane')
            let resourcePane = tabPane[0].getAttribute('id')
            return resourcePane
        }
        // 當頁資源名稱
        getResourceName = () => {
            // 取得物件名稱
            let resourcePane = this.getResourcePane()
            let resourceName = resourcePane.replace('Pane', '')
            return resourceName
        }
        // 資源列表
        getResourcesList = () => {
            let resourcesList = []
            // 左側列表
            let resourcesPane = document.querySelector('#resourcesPane')
            // sidebarBlock 是會分區
            let sidebarBlocks = resourcesPane.querySelectorAll('.sidebar-block')
            // 循序處理
            for (let i = 0; i < sidebarBlocks.length; i++) {
                let sidebarBlock = sidebarBlocks[i]
                // 區域名稱
                let area = sidebarBlock.querySelector('span.text-steelblue').textContent
                // 按鈕列表
                let btns = sidebarBlock.querySelectorAll('button[role=tab]')
                // 塞進
                for (let k = 0; k < btns.length; k++) {
                    resourcesList.push(btns[k])
                }
            }
            return resourcesList
        }
        // 找卡片
        cardCategoryGain = 'GainCard' // 獲取
        cardCategoryUpgrade = 'UpgradeCard' // 升級
        cardCategoryConvert = 'ConvertCard' // 轉換
        findCard = (cardCategory = this.cardCategoryGain | this.cardCategoryUpgrade | this.cardCategoryConvert) => {
            let resourceName = this.getResourceName()
            let CardId = resourceName + cardCategory
            let CardObj = document.getElementById(CardId)
            return CardObj
        }
        // 卡片 span
        spanPositionFirst = 'first'
        spanPositionLast = 'last'
        getCardSpan = (cardObj, position = this.spanPositionFirst | this.spanPositionLast) => {
            let spanAry = cardObj.querySelectorAll('span')
            if (this.spanPositionFirst == position) {
                return spanAry[0]
            } else if (this.spanPositionLast == position) {
                return spanAry[spanAry.length - 1]
            }
        }
        // 按鈕切換文字顏色
        btnStatusOn = 'on'
        btnStatusOff = 'off'
        btnSwitchColor = (btnId, status = this.btnStatusOn | this.btnStatusOff) => {
            let btnObj = document.getElementById(btnId)
            if (btnObj) {
                if (this.btnStatusOn == status) {
                    btnObj.classList.remove('text-danger')
                    btnObj.classList.add('text-success')
                } else if (this.btnStatusOff == status) {
                    btnObj.classList.remove('text-success')
                    btnObj.classList.add('text-danger')
                }
            }
        }
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
        // 配合下方原件的 div 外框
        divColAuto = (childElement, width = null) => {
            let divElement = document.createElement("div")
            divElement.className = 'col-auto'
            if (null != width) {
                divElement.style.width = width + 'px'
            }
            divElement.appendChild(childElement)
            return divElement
        }
        // 進入指定資源格
        goPane = (paneName, callback = null) => {
            // 找資源按鈕
            let resourceBtn = document.querySelector('button.btn[aria-controls="' + paneName + '"]')
            // 點擊
            resourceBtn.click()
            // 等待載入後操作
            cf.waitForElement('#' + paneName, () => {
                if (null != callback) callback()
            })
        }
    }
    var cf = new CommonFunc()

    ////// 整理畫面 //////
    class Tidy {
        TiCardMax = 6 // T層級
        // 觸動卡片開關
        targetCardFold = (cardObject) => {
            let CardParent = cardObject.parentNode
            let CardHeader = CardParent.getElementsByClassName('card-header')
            let btn = CardHeader[0].querySelector('button')
            btn.click()
        }
        // 卡片是否展開
        isCardOpen = (cardObject) => {
            let cardObjectClass = cardObject.classList
            if (cardObjectClass.value.includes('show')) {
                // 展開
                return true
            }
            return false
        }
        // 展開
        openCard = (cardObject) => {
            // 判斷是否是展開的
            if (!this.isCardOpen(cardObject)) {
                // 展開 觸發操作=>關上
                this.targetCardFold(cardObject)
            }
        }
        // 關上
        closeCard = (cardObject) => {
            // 判斷是否是展開的
            if (this.isCardOpen(cardObject)) {
                // 展開 觸發操作=>關上
                this.targetCardFold(cardObject)
            }
        }
        // TnCard 是否保留開啟
        isTnCardKeepOpen = (cardObject) => {
            // TnCard point
            let CardParent = cardObject.parentNode
            let CardHeader = CardParent.querySelector('div.card-header')
            // Tn 區
            let CardTn = CardHeader.querySelector('div.lh-1')
            let CardTnStr = CardTn.querySelector('span.badge').textContent
            // 點數區
            let CardPoint = CardTn.nextElementSibling
            let CardPointDone = CardPoint.querySelector('small.text-success')
            // 確認是否找到 Done
            if (null !== CardPointDone) {
                // 找到 Done, 都升級完了, 關上吧
                return false
            } else {
                // 沒找到 Done, 還沒全部升級完
                // 目前點數
                let CardNum = CardPoint.querySelector('span.text-light').textContent
                // 最大值
                let CardMax = CardPoint.querySelector('small.text-normal').textContent.replace('/', '')
                // 加點級距列表, 目前點數是字串
                let pointGrade = [
                    '0' // 還沒加過點
                    , '5', '25', '75', '150' // 加點級距
                    , '250' // 已經達到最大值
                ]
                // 判斷是否需要關上
                if (pointGrade.includes(CardNum)) {
                    // 關上
                    return false
                }
            }
            // 保留開啟
            return true
        }
        // 整理卡片展開狀態
        doTidy = () => {
            // 獲取 GainCard
            let GainCard = cf.findCard(cf.cardCategoryGain)
            if (GainCard) {
                // 如果有, 選在 +20
                let add20 = GainCard.querySelector('input.btn-check[value="20"]')
                if (add20) {
                    add20.click()
                }
                this.closeCard(GainCard) // 關上
            }

            // 轉換 ConvertCard (要升到 Sol Scientific Center 之後)
            let ConvertCard = cf.findCard(cf.cardCategoryConvert)
            if (ConvertCard) {
                this.openCard(ConvertCard) // 打開
                //this.closeCard(ConvertCard) // 關上
            }

            // 升級 UpgradeCard
            let UpgradeCard = cf.findCard(cf.cardCategoryUpgrade)
            if (UpgradeCard) {
                //this.openCard(UpgradeCard) // 打開
                this.closeCard(UpgradeCard) // 關上
            }

            // T1~Tn
            for (let i = 1; i <= this.TiCardMax; i++) {
                // T{i}Card
                let TiCardStr = 'T' + i + 'Card'
                let TiCard = cf.findCard(TiCardStr)
                if (TiCard) {
                    // 進行判斷
                    if (this.isTnCardKeepOpen(TiCard)) {
                        this.openCard(TiCard)
                    } else {
                        this.closeCard(TiCard)
                    }
                }
            }
        }

        // 拿 目前資源 庫存等級 更新 制 對應位置
        setResourcesStorageLevel = () => {
            // 當前資源
            let resourceName = cf.getResourceName()
            let resourcePane = cf.getResourcePane()
            // 確認庫存卡片
            let UpgradeCard = cf.findCard(cf.cardCategoryUpgrade)
            if (UpgradeCard) {
                // 取得庫存等級
                let CardParent = UpgradeCard.parentNode
                let CardHeader = CardParent.querySelector('div.card-header')
                let UpgradeLevel = CardHeader.querySelector('span.text-light').textContent

                // 確認 顯示等級的區塊是否存在
                let levelElementId = 'level' + resourcePane
                let levelElement = 'span[id="' + levelElementId + '"]'
                let levelArea = document.querySelector(levelElement)
                if (levelArea) {
                    // 已經存在直接複寫
                    levelArea.textContent = UpgradeLevel
                } else {
                    // 尚未存在, 建立, 寫入
                    let resourceBtn = document.querySelector('button.btn[aria-controls="' + resourcePane + '"]')
                    let resourceBtnParent = resourceBtn.parentNode
                    let spanElement = document.createElement("span")
                    spanElement.textContent = UpgradeLevel
                    spanElement.setAttribute('id', levelElementId)
                    resourceBtnParent.appendChild(spanElement)
                }
            }
        }
    }
    var t = new Tidy()
    ////// 點開資源畫面, 自動進行整理 //////
    cf.waitForElement('#resourcesPane', () => {
        // 資源列表
        let resourcesList = cf.getResourcesList()
        // 設定上下間距寬
        const paddingY = '1px'
        // 循序處理
        for (let i = 0; i < resourcesList.length; i++) {
            // 對 資源列 進行上下間距調整
            let switchBtn = resourcesList[i]
            switchBtn.style.paddingTop = paddingY
            switchBtn.style.paddingBottom = paddingY
            

            // 資源格名稱 xxxPane
            let resourcePaneName = switchBtn.getAttribute('aria-controls')
            // 對資源增加按鈕事件
            switchBtn.addEventListener('click', () => {
                // 等待畫面載入
                cf.waitForElement('#' + resourcePaneName, () => {
                    // 進行整理
                    t.doTidy()
                    // 拿 目前資源 庫存等級 更新 制 對應位置
                    t.setResourcesStorageLevel()
                })
            })

            // 對 升級按鈕(資源列同階下一個元件) 進行上下間距調整
            let upgradeBtn = switchBtn.nextElementSibling
            if (upgradeBtn) {
                upgradeBtn.style.paddingTop = paddingY
                upgradeBtn.style.paddingBottom = paddingY
                // 對升級按鈕也加入觸發進入對應 資源頁面的 操作
                upgradeBtn.addEventListener('click', () => {
                    setTimeout(async () => { await switchBtn.click() }, 150)
                })
            }
            
            // 模擬按鈕觸發 強制更新資源等級資訊
            setTimeout(async () => { await switchBtn.click() }, 250 * i)
        }
    })

    ////// 獲取 //////
    class GainProcess {
        noGainCardErrorMsg = '無法進行獲取操作'
        // 能否獲取
        canGain = (byPass = false) => {
            let GainCard = cf.findCard(cf.cardCategoryGain)
            if (GainCard) {
                if (true == byPass) {
                    // 不確認消耗
                    return true
                } else {
                    // 確認是否需要耗資源??
                    let firstSpan = cf.getCardSpan(GainCard, cf.spanPositionFirst)
                    // 有出現 from 字樣表示需要消耗別人
                    if (firstSpan.textContent.includes('from')) {
                        // 需消耗其他資源, 不進行連續採礦
                        si.writeTextBox('需消耗其他資源, 不進行獲取')
                        return false
                    } else {
                        // 不須消耗
                        return true
                    }
                }
            } else {
                // 無法進行連續採礦操作
                si.writeTextBox(this.noGainCardErrorMsg)
                return false
            }
        }
        // 獲取操作
        doGain = (frequency = 1, byPass = false) => {
            if (true == this.canGain(byPass)) {
                si.writeTextBox('')
                let GainCard = cf.findCard(cf.cardCategoryGain)
                let lastSpan = cf.getCardSpan(GainCard, cf.spanPositionLast)
                //
                for (let i = 0; i < frequency; i++) {
                    if ('Full' == lastSpan.textContent) {
                        // 滿啦
                        si.writeTextBox('滿啦')
                        break
                    } else if ('Gain' == lastSpan.textContent) {
                        // 可以操作, 按按鈕
                        let btn = lastSpan.parentNode
                        btn.click()
                        si.writeTextBox('獲取完成')
                    }
                }
            }
        }
        // 獲取按鈕
        gainButtonObj = () => {
            let continuousGainButton = document.createElement("button");
            continuousGainButton.id = 'continuousGainButton'
            continuousGainButton.className = 'btn btn-outline-info'
            // 按鈕文字
            continuousGainButton.textContent = '連續獲取';
            // 設定按鈕事件：直接連續採礦
            continuousGainButton.addEventListener("click", function () {
                //
                gp.doGain(1000, true)
            });
            return continuousGainButton
        }
    }
    var gp = new GainProcess()

    // ////// 連續獲取流程 //////
    // // 連續獲取按鈕
    // const continuousGainButtonObj = () => {
    //     let continuousGainButton = document.createElement("button");
    //     continuousGainButton.id = 'continuousGainButton'
    //     continuousGainButton.className = 'btn btn-outline-info'
    //     // 按鈕文字
    //     continuousGainButton.textContent = '連續獲取';
    //     // 設定按鈕事件：直接連續採礦
    //     continuousGainButton.addEventListener("click", function () {
    //         //
    //         gp.doGain(1000, true)
    //     });
    //     return continuousGainButton
    // }

    ////// 自動獲取流程 + 目標數 //////
    class AutoGain {
        //
        buttonObjId = 'autoGainButton'
        inputObjId = 'autoGainInput'
        loopTimes = false // 循環次數
        inAuto = false // 連續獲取
        autoTimer = null // 連續獲取 timer
        timerWait = 1.5 * 1000 // 延遲多久連續執行
        // 執行 自動獲取
        doAutoGain = () => {
            // 設定按鈕狀態, 開啟
            cf.btnSwitchColor(this.buttonObjId, cf.btnStatusOn)
            // 判斷是否進入循環
            if (false === this.loopTimes || this.loopTimes > 0) {
                // 沒設定循環次數 或 還有循環次數
                if (this.loopTimes > 0) {
                    // 次數減一
                    this.loopTimes--
                    // 更新輸入
                    document.querySelector('#' + this.inputObjId).value = this.loopTimes
                }
                // 連續執行
                gp.doGain(1000, true)
                // 等待 再次執行
                this.autoTimer = setTimeout(this.doAutoGain, this.timerWait)
            } else {
                // 關上
                this.stopAutoGain()
            }
        }
        // 停止 自動獲取
        stopAutoGain = () => {
            // 設定按鈕狀態, 關閉
            cf.btnSwitchColor(this.buttonObjId, cf.btnStatusOff)
            // 清除輸入
            document.querySelector('#' + this.inputObjId).value = ''
            // 恢復初始化狀態
            this.loopTimes = false
            this.inAuto = false
            // 刪除計數器
            clearTimeout(this.autoTimer)
        }
        // 自動獲取 按鈕物件
        autoGainButtonObj = () => {
            let buttonObj = document.createElement("button");
            buttonObj.id = this.buttonObjId
            buttonObj.className = 'btn btn-outline-secondary text-danger rounded-start-0'
            // 按鈕文字
            buttonObj.textContent = '自動獲取';
            // 設定按鈕事件：直接連續採礦
            buttonObj.addEventListener("click", () => {
                this.inAuto = !this.inAuto
                if (this.inAuto) {
                    this.doAutoGain()
                } else {
                    this.stopAutoGain()
                }
            });
            return buttonObj
        }
        // 自動獲取獲取 輸入物件
        autoGainInputObj = () => {
            let inputObj = document.createElement("input");
            inputObj.type = 'number'
            inputObj.min = "1"
            inputObj.id = this.inputObjId
            inputObj.className = 'form-control rounded-end-0'
            inputObj.title = '獲取次數'
            inputObj.placeholder = '次數'
            // 設定事件
            inputObj.addEventListener('change', () => {
                this.loopTimes = document.querySelector('#' + this.inputObjId).value
            })
            return inputObj
        }
        // 自動獲取 物件
        autoGainObj = () => {
            // 按鈕物件
            let buttonObj = this.autoGainButtonObj()
            // 輸入物件
            let inputObj = this.autoGainInputObj()
            // divObj
            let divObj = document.createElement("div")
            divObj.className = 'd-flex'
            //
            divObj.appendChild(cf.divColAuto(inputObj, 60))
            divObj.appendChild(buttonObj)
            // 
            return divObj
        }
    }
    var ag = new AutoGain()

    // ////// 自動輪巡 //////
    // class AutoPolling {
    //     //
    //     inAutoPage = false
    //     autoPageTimer = null
    //     pageWait = 1 * 1000 // 延遲多久連續執行
    //     // 開始輪巡
    //     doAutoPolling = (resourcesList, nowPage) => {
    //         let nextPage
    //         // 按下當前的一個
    //         resourcesList[nowPage].click()
    //         // 資源格名稱 xxxPane
    //         let resourcePaneName = resourcesList[nowPage].getAttribute('aria-controls')
    //         // 等待載入完成
    //         cf.waitForElement('#' + resourcePaneName, () => {
    //             // 計算下一個
    //             if (nowPage < (resourcesList.length - 1)) {
    //                 // 還沒到最大值, 加一
    //                 nextPage = nowPage + 1
    //             } else {
    //                 // 超過預期值, 歸零
    //                 nextPage = 0
    //             }
    //             // 看看有沒有獲取卡
    //             let GainCard = cf.findCard(cf.cardCategoryGain)
    //             if (GainCard) {
    //                 // 有獲取卡片
    //                 let oneTimes = 200
    //                 // 執行獲取
    //                 gp.doGain(oneTimes, true)
    //                 if ('woodPane' == resourcePaneName) {
    //                     // 木頭多做兩輪, 抵銷 燃燒
    //                     gp.doGain(oneTimes, true)
    //                 }
    //             }
    //             // 開, 繼續跳下一個
    //             if (this.inAutoPage) {
    //                 this.doAutoPolling(resourcesList, nextPage)
    //             }
    //         })
    //     }
    //     // 輪巡分頁
    //     autoPollingButtonObj = () => {
    //         let autoPollingButton = document.createElement("button");
    //         autoPollingButton.id = 'autoPollingButton'
    //         autoPollingButton.className = 'btn btn-outline-secondary text-danger' // text-success, text-danger
    //         // 按鈕文字
    //         autoPollingButton.textContent = '自動輪巡';
    //         // 設定按鈕事件：
    //         autoPollingButton.addEventListener("click", () => {
    //             this.inAutoPage = !this.inAutoPage
    //             if (this.inAutoPage) {
    //                 cf.btnSwitchColor('autoPollingButton', cf.btnStatusOn)
    //                 let resourcesList = cf.getResourcesList()
    //                 // todo 亂數一下開始位置
    //                 let start = 0
    //                 //
    //                 this.doAutoPolling(resourcesList, start)
    //             } else {
    //                 cf.btnSwitchColor('autoPollingButton', cf.btnStatusOff)
    //             }
    //         });
    //         return autoPollingButton
    //     }
    // }
    // var ap = new AutoPolling()

    // ////// 升級庫存 //////
    // class UpgradeProcess {
    //     // 能否升級
    //     canUpgrade = () => {
    //         let UpgradeCard = cf.findCard(cf.cardCategoryUpgrade)
    //         if (UpgradeCard) {
    //             let lastSpan = cf.getCardSpan(UpgradeCard, cf.spanPositionLast)
    //             let btnText = lastSpan.textContent
    //             // 文字為 Upgrade 表示可以升級了
    //             if (btnText == 'Upgrade') {

    //                 return true
    //             }
    //         }

    //         return false
    //     }
    //     // 升級操作
    //     doUpgrade = () => {
    //         if (true == this.canUpgrade()) {
    //             let UpgradeCard = cf.findCard(cf.cardCategoryUpgrade)
    //             let lastSpan = cf.getCardSpan(UpgradeCard, cf.spanPositionLast)
    //             let btn = lastSpan.parentNode
    //             btn.click()
    //             // 再一次進入該資源頁, 觸發更新等級紀錄
    //             cf.goPane(cf.getResourcePane())

    //             return true
    //         }
    //         return false
    //     }
    // }
    // var up = new UpgradeProcess()

    // ////// 自動升級庫存 //////
    // class AutoUpgrade {
    //     //
    //     buttonObjId = 'autoUpgradeButton'
    //     inputObjId = 'autoUpgradeInput'
    //     loopTimes = false
    //     inAuto = false
    //     autoTimer = null
    //     timerWait = 3 * 1000
    //     // 執行 自動升級庫存
    //     doAutoUpgrade = () => {
    //         // 設定按鈕狀態, 開啟
    //         cf.btnSwitchColor(this.buttonObjId, cf.btnStatusOn)
    //         // 判斷是否進入循環
    //         if (false === this.loopTimes || this.loopTimes > 0) {
    //             // 沒設定循環次數 或 還有循環次數
    //             if (this.loopTimes > 0) {
    //                 // 次數減一
    //                 this.loopTimes--
    //                 // 更新輸入
    //                 document.querySelector('#' + this.inputObjId).value = this.loopTimes
    //             }
    //             // 操作升級
    //             if (up.doUpgrade()) {
    //                 si.writeTextBox('升級, ' + (this.timerWait / 1000) + '秒再來一次')
    //             } else {
    //                 si.writeTextBox('還沒, ' + (this.timerWait / 1000) + '秒再來一次')
    //             }
    //             // 等待 再次執行
    //             this.autoTimer = setTimeout(this.doAutoUpgrade, this.timerWait)
    //         } else {
    //             // 關上
    //             this.stopAutoUpgrade()
    //         }
    //     }
    //     // 停止 自動升級庫存
    //     stopAutoUpgrade = () => {
    //         // 設定按鈕狀態, 關閉
    //         cf.btnSwitchColor(this.buttonObjId, cf.btnStatusOff)
    //         // 清除輸入
    //         document.querySelector('#' + this.inputObjId).value = ''
    //         // 恢復初始化狀態
    //         this.loopTimes = false
    //         this.inAuto = false
    //         // 刪除計數器
    //         clearTimeout(this.autoTimer)
    //     }
    //     // 升級庫存 按鈕物件
    //     autoUpgradeButtonObj = () => {
    //         let buttonObj = document.createElement("button");
    //         buttonObj.id = this.buttonObjId
    //         buttonObj.className = 'btn btn-outline-secondary text-danger rounded-start-0'
    //         // 按鈕文字
    //         buttonObj.textContent = '升級庫存';
    //         // 設定按鈕事件：
    //         buttonObj.addEventListener("click", () => {
    //             this.inAuto = !this.inAuto
    //             if (this.inAuto) {
    //                 this.doAutoUpgrade()
    //             } else {
    //                 this.stopAutoUpgrade()
    //             }
    //         });
    //         return buttonObj
    //     }
    //     // 升級庫存 輸入物件
    //     autoUpgradeInputObj = () => {
    //         let inputObj = document.createElement("input");
    //         inputObj.type = 'number'
    //         inputObj.min = "1"
    //         inputObj.id = this.inputObjId
    //         inputObj.className = 'form-control rounded-end-0'
    //         inputObj.title = '升級次數'
    //         inputObj.placeholder = '次數'
    //         // 設定事件
    //         inputObj.addEventListener('change', () => {
    //             this.loopTimes = document.querySelector('#' + this.inputObjId).value
    //         })
    //         return inputObj
    //     }
    //     // 升級庫存 物件
    //     autoUpgradeObj = () => {
    //         // 按鈕物件
    //         let buttonObj = this.autoUpgradeButtonObj()
    //         // 輸入物件
    //         let inputObj = this.autoUpgradeInputObj()
    //         // divObj
    //         let divObj = document.createElement("div")
    //         divObj.className = 'd-flex'
    //         //
    //         divObj.appendChild(cf.divColAuto(inputObj, 60))
    //         divObj.appendChild(buttonObj)
    //         //
    //         return divObj
    //     }
    // }
    // var au = new AutoUpgrade()

    ////// 升級庫存到 N  + 目標數 //////
    class UpgradeToN {
        //
        buttonObjId = 'upgradeToNButton'
        inputObjId = 'upgradeToNInput'
        //
        defaultTargetLevel = 20
        targetLevel = 20
        mainResoursPane = ''
        //
        inAuto = false
        autoTimer = null
        timerWait = 3 * 1000
        // 執行 升級庫存到 N
        doAutoUpgradeToN = () => {
            // 設定按鈕狀態, 開啟
            cf.btnSwitchColor(this.buttonObjId, cf.btnStatusOn)
            // 記得現在是誰
            this.mainResoursPane = cf.getResourcePane()
            // 庫存等級卡片
            let UpgradeCard = cf.findCard(cf.cardCategoryUpgrade)
            if (UpgradeCard) {
                // 有庫存卡片 取得目前的庫存等級

                // 先進行一次獲取操作
                let GainCard = cf.findCard(cf.cardCategoryGain)
                // 有沒有獲取卡片
                if (GainCard) {
                    // 取得升級需要的資源有哪些
                    let needResoursList = UpgradeCard.querySelectorAll('div.progress-bar')
                    // 找第一個不夠的資源
                    let needResoursFirst = null
                    for (let i = 0; i < needResoursList.length; i++) {
                        let needResours = needResoursList[i]
                        let needResoursValuenow = parseFloat(needResours.getAttribute('aria-valuenow'))
                        let needResoursValuemax = parseFloat(needResours.getAttribute('aria-valuemax'))
                        if (needResoursValuenow < needResoursValuemax) {
                            needResoursFirst = needResours
                            break
                        }
                    }
                    if (null != needResoursFirst) {
                        let parentBtn = needResoursFirst.parentNode.parentNode
                        let resourceName = parentBtn.getAttribute('title')
                        let paneName = resourceName.toLowerCase() + 'Pane'
                        cf.goPane(paneName, () => {
                            gp.doGain(1000, true)
                            cf.goPane(this.mainResoursPane)
                        })
                    }
                } else {
                    // 沒有獲取的方式
                    si.writeTextBox(gp.noGainCardErrorMsg)
                }

                // 取同級前一個 物件
                let UpgradeCardHeader = UpgradeCard.previousElementSibling
                // 取得等級數字
                let UpgradeLevel = parseInt(UpgradeCardHeader.querySelector('span.text-light').textContent)
                // 判斷等級
                if (UpgradeLevel < this.targetLevel) {
                    // 未達標, 操作升級
                    if (up.doUpgrade()) {
                        // 可以升級
                        si.writeTextBox('升級, ' + (this.timerWait / 1000) + '秒再來一次')
                    } else {
                        // 不能升級
                        si.writeTextBox('還不夠資源升到' + this.targetLevel + ', ' + (this.timerWait / 1000) + '秒再來一次')
                    }
                } else if (UpgradeLevel == this.targetLevel) {
                    // 已達標
                    si.writeTextBox('庫存等級 已到達 目標等級, 等級 ' + this.targetLevel)
                } else {
                    // 超過目標 ?? 不可能
                    si.writeTextBox('庫存等級 已超過 目標等級, 等級 ' + this.targetLevel)
                }
                // 等待 再次執行
                this.autoTimer = setTimeout(this.doAutoUpgradeToN, this.timerWait)
            }
        }
        // 停止 升級庫存到 N
        stopAutoUpgradeToN = () => {
            // 設定按鈕狀態, 關閉
            cf.btnSwitchColor(this.buttonObjId, cf.btnStatusOff)
            // 恢復初始化狀態
            this.inAuto = false
            // 刪除計數器
            clearTimeout(this.autoTimer)
        }
        // 升級庫存到 N 按鈕物件
        upgradeToNButtonObj = () => {
            let buttonObj = document.createElement("button");
            buttonObj.id = this.buttonObjId
            buttonObj.className = 'btn btn-outline-secondary text-danger rounded-start-0'
            // 按鈕文字
            buttonObj.textContent = '升庫存到';
            // 設定按鈕事件：
            buttonObj.addEventListener("click", () => {
                this.inAuto = !this.inAuto
                if (this.inAuto) {
                    this.doAutoUpgradeToN()
                } else {
                    this.stopAutoUpgradeToN()
                }
            });
            return buttonObj
        }
        // 升級庫存到 N 輸入物件
        upgradeToNInputObj = () => {
            let inputObj = document.createElement("input");
            inputObj.type = 'number'
            inputObj.min = "1"
            inputObj.id = this.inputObjId
            inputObj.className = 'form-control rounded-end-0'
            inputObj.title = '升級次數'
            inputObj.placeholder = '次數'
            inputObj.value = this.defaultTargetLevel
            // 設定事件
            inputObj.addEventListener('change', () => {
                this.targetLevel = document.querySelector('#' + this.inputObjId).value
            })
            return inputObj
        }
        // 升級庫存到 N 物件
        upgradeToNObj = () => {
            // divObj
            let divObj = document.createElement("div")
            divObj.className = 'd-flex'
            // 放入輸入物件
            divObj.appendChild(cf.divColAuto(this.upgradeToNInputObj(), 60))
            // 放入按鈕物件
            divObj.appendChild(this.upgradeToNButtonObj())
            //
            return divObj
        }
    }
    var utn = new UpgradeToN()

    // ////// 手動執行能量=>電漿=>隕石 //////
    // class ManualGainMeteorit {
    //     energyPaneBtn
    //     plasmaPaneBtn
    //     // 級距資料
    //     gradeAry = ['k', 'M']
    //     // 是否超過 num 百萬 M
    //     isOverMillion = (numStr, numBaseLine) => {
    //         // 解析單位
    //         let unit = numStr.slice(-1)
    //         // 解析數字
    //         let num = parseFloat(numStr.slice(0, -1))
    //         // 解析級距等級
    //         let gradeLevel = this.gradeAry.findIndex(eml => eml == unit)
    //         if (num >= numBaseLine && gradeLevel >= 1) {
    //             return true
    //         }
    //         return false
    //     }
    //     // 是否超過 num 千 k
    //     isOverThousand = (numStr, numBaseLine) => {
    //         // 解析單位
    //         let unit = numStr.slice(-1)
    //         // 解析數字
    //         let num = parseFloat(numStr.slice(0, -1))
    //         // 解析級距等級
    //         let gradeLevel = this.gradeAry.findIndex(eml => eml == unit)
    //         if (num >= numBaseLine && gradeLevel >= 0) {
    //             return true
    //         }
    //         return false
    //     }
    //     // 進特定資源依據按鈕
    //     goPaneAndGain = (BtnObj, GainTimes, callback = null) => {
    //         // 資源格名稱 xxxPane
    //         let paneName = BtnObj.getAttribute('aria-controls')
    //         // 進資源格並操作
    //         cf.goPane(paneName, () => {
    //             gp.doGain(GainTimes, true)
    //             if (null != callback) callback()
    //         })
    //     }
    //     // 進入 電漿格 進行獲取
    //     goGetPlasma = () => {
    //         this.goPaneAndGain(
    //             this.plasmaPaneBtn,
    //             4000,
    //             this.goGetMeteorite
    //         )
    //     }
    //     // 進入 隕石格 進行獲取
    //     goGetMeteorite = () => {
    //         // 取得隕石資源按鈕
    //         let meteoritePaneBtn = document.querySelector('button.btn[aria-controls="meteoritePane"]')
    //         this.goPaneAndGain(
    //             meteoritePaneBtn,
    //             1000,
    //             () => {
    //                 this.energyPaneBtn.click()
    //                 si.writeTextBox('Done')
    //             }
    //         )
    //     }
    //     // 進入 鈦礦格 Titanium 進行獲取
    //     goGetTitanium = () => {
    //         // 取得隕石資源按鈕
    //         let titaniumPaneBtn = document.querySelector('button.btn[aria-controls="titaniumPane"]')
    //         this.goPaneAndGain(
    //             titaniumPaneBtn,
    //             1000,
    //             () => {
    //                 this.energyPaneBtn.click()
    //             }
    //         )
    //     }

    //     // 手動獲取隕石操作
    //     doManualGainMeteorit = () => {
    //         // 有隕石資源則必定有 能量資源 energyPane 電漿資源 plasmaPane
    //         // 取得能量資源按鈕
    //         this.energyPaneBtn = document.querySelector('button.btn[aria-controls="energyPane"]')
    //         // 能量資源數值, 不能用 span.text-light 滿了會失效, 改抓全部的最後一個
    //         let energyPaneBtnSpanAry = this.energyPaneBtn.querySelectorAll('span')
    //         let energyPaneNum = energyPaneBtnSpanAry[energyPaneBtnSpanAry.length - 1].textContent

    //         // 取得電漿資源按鈕
    //         this.plasmaPaneBtn = document.querySelector('button.btn[aria-controls="plasmaPane"]')
    //         // 電漿資源數值, 不能用 span.text-light 滿了會失效, 改抓全部的最後一個
    //         let plasmaPaneBtnSpanAry = this.energyPaneBtn.querySelectorAll('span')
    //         let plasmaPaneNum = plasmaPaneBtnSpanAry[plasmaPaneBtnSpanAry.length - 1].textContent

    //         // 確認資源數量
    //         if (true == this.isOverMillion(energyPaneNum, 4)) {
    //             // 能量資源數值 超過 百萬 M 級, 進入 電漿資源 格
    //             this.goGetPlasma()
    //         } else if (true == this.isOverThousand(plasmaPaneNum, 3)) {
    //             // 電漿資源數值 超過 千 k 級, 進入 隕石資源 格
    //             this.goGetMeteorite()
    //         } else {
    //             si.writeTextBox('資源不足')
    //             // 都沒數量 去拿個 鈦礦 吧
    //             this.goGetTitanium()
    //         }
    //     }
    //     // 手動獲取隕石按鈕
    //     manualGainMeteoritButtonObj = () => {
    //         let autoGainButton = document.createElement("button");
    //         autoGainButton.id = 'manualGainMeteoritButton'
    //         autoGainButton.className = 'btn btn-outline-info'
    //         // 按鈕文字
    //         autoGainButton.textContent = '手動隕石';
    //         // 設定按鈕事件：直接連續採礦
    //         autoGainButton.addEventListener("click", this.doManualGainMeteorit);
    //         return autoGainButton
    //     }

    //     // 製作手動隕石
    //     doManualGainMeteorit = (btnArea, secondChild) => {
    //         // 判斷有沒有 隕石資源格
    //         let meteoritePaneBtn = document.querySelector('button[aria-controls="meteoritePane"]')
    //         if (null != meteoritePaneBtn) {
    //             // 有隕石資源格, 生成 手動獲取隕石 按鈕
    //             let manualGainMeteoritButton = mgm.manualGainMeteoritButtonObj()
    //             btnArea.insertBefore(cf.divColAuto(manualGainMeteoritButton), secondChild)
    //         }
    //     }

    // }
    // var mgm = new ManualGainMeteorit()

    // ////// info  //////
    // class FloatingBox {
    //     // 建置浮動框
    //     createFloatingBox = () => {
    //         // 創建浮動區塊容器
    //         const floatingBox = document.createElement("div");
    //         floatingBox.id = "floatingBox";
    //         //
    //         floatingBox.style.position = "fixed";
    //         //
    //         floatingBox.style.right = "20px";
    //         floatingBox.style.top = "60px";
    //         //
    //         floatingBox.style.width = "130px";
    //         floatingBox.style.height = "75vh"; // 設置浮動區塊高度
    //         floatingBox.style.overflow = "auto"; // 啟用滾動條
    //         //
    //         floatingBox.style.padding = "10px";
    //         floatingBox.style.backgroundColor = "#333";
    //         floatingBox.style.color = "white";
    //         floatingBox.style.borderRadius = "8px";
    //         //
    //         floatingBox.style.zIndex = "1000";

    //         // 資源列表
    //         let resourcesList = cf.getResourcesList()
    //         // 循序生成資源資訊
    //         resourcesList.forEach((resources, index) => {
    //             // 解析資源物件, 取得 名稱
    //             const resourcesName = resources.querySelector('span.text-truncate').textContent
    //             const resourcesImg = resources.querySelector('img').src

    //             // 創建文字區塊
    //             const resourcesDiv = document.createElement("div");
    //             resourcesDiv.className = 'row gx-0'

    //             // icon + 資源名
    //             const resourcesL = document.createElement("div");
    //             resourcesL.className = 'w-50 text-start d-flex col align-items-center'
    //             // icon
    //             const resourcesIcon = document.createElement("img");
    //             resourcesIcon.src = resourcesImg
    //             resourcesIcon.width = 16
    //             resourcesIcon.height = 16
    //             resourcesIcon.alt = resourcesName
    //             resourcesL.appendChild(resourcesIcon)
    //             // 資源名
    //             const resourcesText = document.createElement("span")
    //             resourcesText.textContent = resourcesName
    //             resourcesL.appendChild(resourcesText)
    //             resourcesDiv.appendChild(resourcesL)
    //             // 等級
    //             const resourcesR = document.createElement("div");
    //             resourcesR.className = 'text-end small col'
    //             resourcesR.id = 'fb_' + resourcesName.toLowerCase()
    //             resourcesR.textContent = ''
    //             resourcesDiv.appendChild(resourcesR)
    //             // 讓 文字區塊也可以跳到指定資源格
    //             resourcesDiv.addEventListener("click", () => {
    //                 let resourcePaneName = resources.getAttribute('aria-controls')
    //                 cf.goPane(resourcePaneName, () => {
    //                     cf.waitForElement('#' + resourcePaneName, () => {
    //                         // 進行整理
    //                         t.doTidy()
    //                         // 拿目前資源庫存等級更新制對應位置
    //                         fb.setResourcesStorageLevel()
    //                     })
    //                 })
    //             })

    //             // 將文字加入浮動區塊
    //             floatingBox.appendChild(resourcesDiv);
    //         })
    //         // 將浮動區塊加入到頁面中
    //         document.body.appendChild(floatingBox);
    //     }
    //     // 設定資源庫存等級
    //     setResourcesStorageLevel = () => {
    //         // 當前資源
    //         let resourceName = cf.getResourceName()
    //         // 確認庫存卡片
    //         let UpgradeCard = cf.findCard(cf.cardCategoryUpgrade)
    //         if (UpgradeCard) {
    //             // 取得庫存等級
    //             let CardParent = UpgradeCard.parentNode
    //             let CardHeader = CardParent.querySelector('div.card-header')
    //             let UpgradeLevel = CardHeader.querySelector('span.text-light').textContent
    //             // 顯示位置
    //             let fbId = '#fb_' + (('science' == resourceName) ? 'scientists' : resourceName)
    //             let resourceFB = document.querySelector(fbId)
    //             // 把等級顯示
    //             resourceFB.textContent = UpgradeLevel
    //         }
    //     }
    // }
    // const fb = new FloatingBox()

    // 移除背景圖
    document.body.style.backgroundImage = 'unset';
    // 等待下方 bar 出現, 製作相關按鈕
    cf.waitForElement('#bottombar', () => {
        //
        let bottombar = document.getElementById('bottombar')
        let btnArea = bottombar.querySelector('div.row')
        const secondChild = btnArea.children[1] // 塞在第二個之前, pause

        // 放在下方區塊 直接偽裝成畫面按鈕
        // 訊息
        let infoBox = si.infoBoxObj()
        btnArea.insertBefore(cf.divColAuto(infoBox), secondChild)

        // 連續獲取按鈕
        let continuousGainButton = gp.gainButtonObj()
        btnArea.insertBefore(cf.divColAuto(continuousGainButton), secondChild)

        // 自動獲取按鈕 + 目標數
        let autoGain = ag.autoGainObj()
        btnArea.insertBefore(cf.divColAuto(autoGain), secondChild)

        // // 自動輪詢切換
        // let autoPollingButton = ap.autoPollingButtonObj()
        // btnArea.insertBefore(cf.divColAuto(autoPollingButton), secondChild)

        // // 自動升級庫存
        // let autoUpgrade = au.autoUpgradeObj()
        // btnArea.insertBefore(cf.divColAuto(autoUpgrade), secondChild)

        // 升級庫存到 n + 目標數
        let upgradeToN = utn.upgradeToNObj()
        btnArea.insertBefore(cf.divColAuto(upgradeToN), secondChild)

        // 手動執行能量=>電漿=>隕石
        // mgm.doManualGainMeteorit(btnArea, secondChild)

        // 做一個浮窗
        //fb.createFloatingBox()

    })

    ////// 針對技能樹 增加一個比較好看清楚的按鈕 //////
    // 等 左側-公司 頁籤顯示
    cf.waitForElement('#empirePane', () => {
        let paneName = 'technologiesPane'
        // 找到科技樹按鈕
        let technologiesPaneBtn = document.querySelector('button[aria-controls="' + paneName + '"]')
        // 對按鈕加上 click 事件
        technologiesPaneBtn.addEventListener("click", () => {
            // 等待技能樹畫面
            cf.waitForElement('#' + paneName, () => {
                // 卡片
                let scienceBoostsCard = document.querySelector('#scienceBoostsCard')

                // 找對應的物件
                let divRow = scienceBoostsCard.querySelectorAll('div.row.row-cols-1.g-2')
                if (divRow.length > 1) {
                    let divRowLast = divRow[divRow.length - 1]
                    //divRowLast.classList.remove('g-2')
                    divRowLast.classList.replace('row-cols-1', 'row-cols-2')    // 變成兩列
                }

                // 卡片中的升級按鈕
                let scienceBoostsBtnList = scienceBoostsCard.querySelectorAll('button.btn')
                //
                for (let i = 0; i < scienceBoostsBtnList.length; i++) {
                    let scienceBoostsbtn = scienceBoostsBtnList[i]
                    // 按鈕外層還有一個 div.col 所以上兩層
                    let btnParentNode = scienceBoostsbtn.parentNode.parentNode
                    // 看裡面有幾個子項目
                    let btnParentChild = btnParentNode.childNodes
                    if (btnParentChild.length == 4) {
                        // 如果只有四個表示是原本樣子, 加新按鈕
                        // 設置按鈕樣式
                        let newBtn = document.createElement("button");
                        newBtn.className = 'btn btn-outline-success lh-1'
                        newBtn.textContent = '+' // 按鈕文字
                        // 設定新按鈕事件, 等同後面的按鈕
                        newBtn.addEventListener("click", () => {
                            scienceBoostsbtn.click()
                        })
                        // 塞在 數字 和 進度條之間
                        btnParentNode.insertBefore(cf.divColAuto(newBtn), btnParentNode.children[2])
                    }
                    // 對 進度條 縮窄一點
                    let progress = btnParentNode.querySelector('div.col-6')
                    progress.classList.replace('col-6', 'col-5')
                }
            })
        })
    })
})();