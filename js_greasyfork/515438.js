// ==UserScript==
// @name         ForArthur
// @namespace    http://tampermonkey.net/
// @version      0.2.1
// @description  💵💵💵
// @author       Akira
// @match        https://www.sinotrade.com.tw/newweb/SubBrokerageNew/
// @icon         https://www.google.com/s2/favicons?sz=64&domain=sinotrade.com.tw
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/515438/ForArthur.user.js
// @updateURL https://update.greasyfork.org/scripts/515438/ForArthur.meta.js
// ==/UserScript==

// ==================================================================
// UPDATES:
// 20241101 v0.1
// 20241102 v0.2：優化載入，移除手動輸入簽名，第一單改為DOM操作以擷取簽名
// 20241102 v0.2.1：修復isInTradingHours變數名稱錯誤、date.toISOString為美國時間導致startDateTime、endDateTime錯誤問題

// ISSUE:
// 20241101 發現Position請求有可能導致判斷成空倉而送出額外的買進委託
// 若開始結束時間包含非盤中時段會送出一大堆預約委託單 > 先加入非盤中時間判斷檔一下

// TODO:
// 繼續測試11/01的問題是否持續發生
// 非盤中時段送單前應檢查是否有委託預約單
// 美化UI
// 錯誤處理 < 不太想弄
// 可選IP、更新間隔 < 好像沒啥用
// 自動調整價位
// ==================================================================


(async function () {
    'use strict';

    let config = {
        intervalMs: 10000,
        intervalId: null,
        Exchid: "US",
        ca: {
            ClientIP: await getIpAddress()
        },
        summerStartTime: "21:30",
        summerEndTime: "04:00",
        winterStartTime: "22:30",
        winterEndTime: "05:00"
    };

    const priceType = { ANY: "0", AON: "6" };

    async function getIpAddress(useRandom) {
        if (useRandom) return Array.from({ length: 4 }, () => Math.floor(Math.random() * 256)).join('.');

        try {
            const response = await fetch('https://api.ipify.org?format=json');
            const data = await response.json();
            return data.ip;
        } catch (error) {
            console.error('查詢倉位失敗:', error);
            return null;
        }
    }

    function getCookie(name) {
        const value = `; ${document.cookie}`;
        const parts = value.split(`; ${name}=`);
        return parts.length === 2 ? parts.pop().split(';').shift() : null;
    }

    function captureAndReleaseRequests() {
        const originalOpen = XMLHttpRequest.prototype.open;
        const originalSend = XMLHttpRequest.prototype.send;

        XMLHttpRequest.prototype.open = function (method, url, async, user, pass) {
            this._url = url;
            return originalOpen.apply(this, arguments);
        };

        XMLHttpRequest.prototype.send = function (body) {
            const xhr = this;
            this.addEventListener('load', () => {
                if (xhr.readyState === 4 && xhr.status === 200) {
                    try {
                        const response = JSON.parse(this.responseText);
                        // 收尋股票名稱觸發
                        if (xhr._url && xhr._url.includes('/api/v1/SubBrokerage/Config/StockInfo')) {
                            config.targetStock = response.result.Stock.Data["@StockID"];

                            // 下單後觸發，更新簽名
                        } else if (xhr._url && xhr._url.includes('/api/v2/SubBrokerage/SecuritiesTrade/Order')) {
                            const payload = JSON.parse(body);
                            const signature = payload?.ca_content?.signature;
                            if (signature) {
                                config.ca.signature = signature;
                            } else {
                                console.warn('ca_content.signature not found');
                            }
                        }
                    }
                    catch (error) {
                        console.error('回傳內容解析失敗:', error);
                    }
                }
            });
            originalSend.call(this, body);
        };
    }

    // 下單
    async function placeOrder(BS, StockID, Qty, Price, priceType) {
        const body = {
            token: config.ca.token,
            AID: config.ca.aid,
            CID: "11",
            BS,
            StockID: StockID,
            Qty,
            PriceType: priceType,
            Price,
            Creator: config.ca.user_idNo,
            Exchid: config.Exchid,
            ClientIP: config.ca.ClientIP,
            ca_content: {
                signature: config.ca.signature,
                type: "web"
            }
        };

        try {
            const response = await fetch("https://service.sinotrade.com.tw/api/v2/SubBrokerage/SecuritiesTrade/Order", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(body),
            });
            const data = await response.json();
            console.log(data);
        } catch (error) {
            console.log("下單失敗:", error);
        }
    }

    // 發送檢查持倉請求
    async function fetchPosition() {
        try {
            const response = await fetch("https://service.sinotrade.com.tw/api/v2/SubBrokerage/QueryTradeData/Position", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ AID: config.ca.aid, token: config.ca.token })
            });
            const json = await response.json();
            return json.result;
        } catch (error) {
            console.error('查詢倉位失敗:', error);
            return null;
        }
    }

    function showDialog() {
        const dialog = document.createElement("div");
        dialog.style = `
            position: fixed; top: 50%; left: 50%; transform: translate(-50%, -50%);
            padding: 20px; background-color: #fff; border: 1px solid #ccc; z-index: 1000;
        `;

        dialog.innerHTML = `
            <label>Ticker: <input type="text" id="dialogTicker"/></label><br><br>
            <label>價格: <input type="number" id="dialogPrice"/></label><br><br>
            <label>數量: <input type="number" id="dialogQty"/></label><br><br>
            <label>開始時間: <input type="time" id="startTime" /></label><br><br>
            <label>結束時間: <input type="time" id="endTime" /></label><br><br>
            <button id="confirmBtn">確定</button>
            <button id="cancelBtn">取消</button>
        `;

        document.body.appendChild(dialog);
        document.getElementById("dialogTicker").value = config.targetStock;
        document.getElementById("dialogTicker").readOnly = true;
        document.getElementById("dialogPrice").value = document.querySelectorAll("input.ant-input")[0].value || 0;
        document.getElementById("dialogPrice").readOnly = true;
        document.getElementById("dialogQty").value = document.querySelectorAll("input.ant-input")[1].value || 1;
        document.getElementById("dialogQty").readOnly = true;

        const now = new Date();
        const hours = String(now.getHours()).padStart(2, '0');
        const minutes = String(now.getMinutes()).padStart(2, '0');
        const currentMonth = new Date().getMonth() + 1;
        document.getElementById("startTime").value = `${hours}:${minutes}`; //帶入目前時間
        document.getElementById("endTime").value = `${(currentMonth >= 3 && currentMonth <= 10) ? config.summerEndTime : config.winterEndTime}`; //帶入交易結束時間

        document.getElementById("confirmBtn").onclick = () => handleDialogConfirm(dialog);
        document.getElementById("cancelBtn").onclick = () => closeDialog(dialog);
    }

    // 將對話視窗內容紀錄到config
    function handleDialogConfirm(dialog) {
        config.startTime = document.getElementById("startTime").value;
        config.endTime = document.getElementById("endTime").value;
        config.ticker = document.getElementById("dialogTicker").value;
        config.price = Number(document.getElementById("dialogPrice").value);
        config.qty = Number(document.getElementById("dialogQty").value);
        console.log("開始時間:", config.startTime, "結束時間:", config.endTime);

        closeDialog(dialog);
        run();
    }

    function closeDialog(dialog) {
        if (dialog) document.body.removeChild(dialog);
    }

    // 處理委託確認視窗（按下買進/賣出委託按鈕觸發）
    async function handleModalInteraction() {
        // 等待委託確認按鈕出現後點擊
        waitForElement("div.ant-modal-content > div.ant-modal-footer > button.ant-btn.ant-btn-primary", (ele) => { ele.click() });
        // 按下買進/賣出委託按鈕
        document.querySelector("button.ant-btn.ant-btn-primary.ant-btn-lg:not([id='runButton'])").click();
    }

    // 根據持倉判斷交易條件
    async function handlePositions(positions) {
        const stockID = config.ticker.split(".")[0];

        // 無倉位
        if (positions.length === 0) {
            await placeOrder("B", stockID, config.qty.toFixed(0), config.price.toFixed(2), config.qty >= 100 ? priceType.AON : priceType.ANY);
        } else {
            let position = positions[0];
            let holdings = Number(position.UseQty);
            let buyOrders = Number(position.QtyInfo2);
            let sellOrders = Number(position.QtyInfo3);
            // 當沒有持倉且無委買單全數敲進
            if (holdings === 0 && buyOrders === 0) {
                await placeOrder("B", stockID, config.qty.toFixed(0), config.price.toFixed(2), config.qty >= 100 ? priceType.AON : priceType.ANY);
            }
            // 滿倉且無委賣單全數敲出
            else if (holdings === config.qty && sellOrders === 0) {
                await placeOrder("S", stockID, config.qty.toFixed(0), (config.price + 0.01).toFixed(2), config.qty >= 100 ? priceType.AON : priceType.ANY);
            }
        }
    }

    function isInTradingHours(currentTime) {
        const currentMonth = new Date().getMonth() + 1; // 月份 (1-12)

        // 判斷夏令時間 (3 月到 10 月) 或冬令時間
        const isSummerTime = currentMonth >= 3 && currentMonth <= 10;
        const startTime = isSummerTime ? config.summerStartTime : config.winterStartTime;
        const endTime = isSummerTime ? config.summerEndTime : config.winterEndTime;

        // 當天的起始和結束時間
        const startDateTime = new Date(`${currentTime.toDateString()} ${startTime}:00`);
        const endDateTime = new Date(`${currentTime.toDateString()} ${endTime}:00`);

        // 如果結束時間在第二天，調整結束時間
        if (endDateTime < startDateTime) {
            endDateTime.setDate(endDateTime.getDate() + 1);
        }

        return currentTime >= startDateTime && currentTime <= endDateTime && currentTime.getDay() !== 6 && currentTime.getDay() !== 0;
    }
    function run() {
        const currentDate = new Date().toLocaleDateString('en-CA'); // yyyy-mm-dd
        const startDateTime = new Date(`${currentDate}T${config.startTime}:00`);
        let endDateTime = new Date(`${currentDate}T${config.endTime}:00`);

        // 檢查是否跨越午夜（結束時間早於開始時間），如果是則將結束時間移到第二天
        if (endDateTime < startDateTime) endDateTime.setDate(endDateTime.getDate() + 1);
        console.log(startDateTime, endDateTime)

        config.intervalId = setInterval(async () => {
            const currentTime = new Date();
            // 檢查是否在指定時間範圍內
            if (isInTradingHours(currentTime)) {
                try {
                    // 獲取持倉資料
                    const positionData = await fetchPosition();
                    if (!positionData) return;

                    // 檢查回傳結果是否為空
                    if (positionData?.success === "True" && positionData.result?.msg === "查無資料") {
                        console.log("查無資料，無法執行後續操作");
                        return; // 停止執行，因為無資料
                    }

                    // 確保 positionData.result 是陣列，否則使用空陣列
                    const positions = Array.isArray(positionData.result)
                        ? positionData.result.filter(item => item.StockID === config.ticker)
                        : [];

                    // 處理無簽名的情況
                    if (!config.ca.signature) {
                        await handleModalInteraction();
                    } else {
                        await handlePositions(positions);
                    }
                } catch (error) {
                    console.error("錯誤發生:", error);
                }


            } else if (currentTime > endDateTime) {
                console.log("時間範圍結束，停止");
                stop();
                toggleRunButton();
            }
        }, config.intervalMs);

        toggleRunButton();
    }

    function stop() {
        clearInterval(config.intervalId);
        config.intervalId = null;
    }

    function toggleRunButton() {
        const runButton = document.getElementById('runButton');
        if (!config.intervalId) { // 沒有運行
            runButton.textContent = "開始造市";
            runButton.style = "border-color: blue; background-color: blue;";
            runButton.onclick = () => {
                showDialog();
            }
        } else { // 運行中
            runButton.innerText = "中止";
            runButton.style = "border-color: grey; background-color: grey;";
            runButton.onclick = () => {
                stop();
                toggleRunButton();
            };
        }
    }

    function insertRunButton() {
        const runButton = document.createElement("button");
        runButton.id = 'runButton';
        runButton.className = "ant-btn ant-btn-primary ant-btn-lg";
        const targetElement = document.querySelector("button.ant-btn.ant-btn-primary.ant-btn-lg").parentNode;
        targetElement.insertBefore(runButton, targetElement.firstChild);
        toggleRunButton();
    }

    async function initialize() {
        insertStyles();

        const accountData = JSON.parse(decodeURIComponent(getCookie('accounts')))?.find(item => item.accttype === 'H');
        if (accountData) {
            config.ca.aid = accountData.broker_id + accountData.account;
        } else {
            console.error('Account data not found');
        }
        config.ca.token = getCookie('token');
        config.ca.user_idNo = getCookie('user_idNo');
        // console.log(config)
        captureAndReleaseRequests(); // 開始抓請求

        // 等待委託按鈕渲染完成後插入按鈕
        await waitForElement("button.ant-btn.ant-btn-primary.ant-btn-lg");
        insertRunButton();
    }
    function insertStyles() {
        const style = document.createElement('style');
        style.textContent = `
            .run-button-start {
                border-color: blue;
                background-color: blue;
                color: white;
            }
    
            .run-button-stop {
                border-color: grey;
                background-color: grey;
                color: white;
            }
        `;
        document.head.appendChild(style);
    }

    function waitForElement(selector, callback, timeout = 10000) {
        return new Promise((resolve) => {
            const element = document.querySelector(selector);
            if (element) {
                resolve(element);
                return;
            }
            const observer = new MutationObserver((mutationsList, observer) => {
                const element = document.querySelector(selector);
                if (element) {
                    observer.disconnect();
                    if (callback) callback(element);
                    resolve(element);
                }
            });

            observer.observe(document.body, {
                childList: true,
                subtree: true
            });

            setTimeout(() => {
                observer.disconnect(); // 超時後釋放資源
                reject(new Error(`Element ${selector} not found within timeout`));
            }, timeout);
        });
    }
    initialize();
})();


//Thanks for $7 donation from Mr.Won and 🐠🐠🐠 from Arthur.
