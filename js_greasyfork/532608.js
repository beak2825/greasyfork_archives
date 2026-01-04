// ==UserScript==
// @name         BANK_MAHA_WM
// @namespace    http://tampermonkey.net/
// @version      2025-04-27
// @description  需要配合监控使用
// @author       WebMonitor
// @match        https://www.mahaconnect.in/InternetBanking1/ib/*
// @icon         TODO
// @grant        GM_xmlhttpRequest
// @grant        GM_addElement
// @grant        GM_setValue
// @grant        GM_getValue
// @run-at       document-idle
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/532608/BANK_MAHA_WM.user.js
// @updateURL https://update.greasyfork.org/scripts/532608/BANK_MAHA_WM.meta.js
// ==/UserScript==

(() => {
    "use strict";

    const initTxnJob = async () => {
        let timeFlag = new Date().getTime();
        let startFlag;
        const id = setInterval(async () => {
            if (!((startFlag = GM_getValue("mk_start_flag", false)))) {
                clearInterval(id);

                let intervalIdsInner = GM_getValue("mk_interval_id", []);
                if (intervalIdsInner) {
                    for (let i = 0; i < intervalIdsInner.length; i++) {
                        clearInterval(intervalIdsInner[i]);
                    }
                    intervalIdsInner = [];
                    GM_setValue("mk_interval_id", intervalIdsInner);
                }
                return;
            }
            const startButton = document.querySelector("#mk_start");
            startButton.value = startFlag ? "停止" : "开始";
            startButton.style.backgroundColor = startFlag ? "#f00" : "#fff";

            try {
                if (!document.querySelector("div[id='mainform:retailTabMenu'] > ul > li:nth-of-type(1) > a")) return;

                if (!document.querySelector("a[onclick*='mainform:MiniStatementView']")) {
                    document.querySelector("div[id='mainform:retailTabMenu'] > ul > li:nth-of-type(1) > a").click();
                    await delay(9000);
                }

                document.querySelector("a[onclick*='mainform:MiniStatementView']").click();
                await waitForEle("div[id='mainform:MiniStatementView']");
                document.querySelector("div[id='mainform:MiniStatementView'] a[aria-label='Close']").click();

                if (new Date().getTime() - timeFlag > 60000) {
                    document.querySelector("div[id='mainform:retailTabMenu'] > ul > li:nth-of-type(2) > a").click();
                    await delay(9000);
                    document.querySelector("div[id='mainform:retailTabMenu'] > ul > li:nth-of-type(1) > a").click();
                    await delay(9000);
                    timeFlag = new Date().getTime();
                }
            } catch (e) { }
            finally {
                await delay(9000);
            }
        }, 9000);
        let intervalIds = GM_getValue("mk_interval_id", []);
        intervalIds.push(id);
        GM_setValue("mk_interval_id", intervalIds);
    };

    const initDashBoard = () => {
        /* 面板容器 */
        GM_addElement(document.querySelector("body"), "div", {
            id: "mk_wrapper",
            style: "position: fixed; bottom: 10px; right: 10px; z-index: 9999; padding: 10px; background: #fff; border: 1px solid #ccc; border-radius: 5px; box-shadow: 0 0 10px rgba(0,0,0,0.5);"
        });

        /* 输入控件 */
        GM_addElement(document.querySelector("#mk_wrapper"), "input", {
            id: "mk_user_name",
            type: "text",
            style: "display: block; width: 200px; height: 30px; margin-bottom: 5px; border-radius: 5px; border: 1px solid #ccc; padding: 5px;",
            placeholder: "请输入用户"
        });
        document.querySelector("#mk_user_name").value = GM_getValue("mk_user_name", "");

        /* 按钮控件 */
        GM_addElement(document.querySelector("#mk_wrapper"), "input", {
            id: "mk_start",
            type: "button",
            value: "开始",
            style: "display: block; width: 200px; height: 30px; margin-bottom: 5px; border-radius: 5px; border: 1px solid #ccc; padding: 5px;"
        });
        const startButton = document.querySelector("#mk_start");
        startButton.onclick = () => {
            const userName = document.querySelector("#mk_user_name").value;
            if (!userName) {
                alert("请输入用户名");
                return;
            }

            GM_setValue("mk_user_name", userName);

            let startFlag = !GM_getValue("mk_start_flag", false);
            GM_setValue("mk_start_flag", startFlag);
            const startButton = document.querySelector("#mk_start");
            startButton.value = startFlag ? "停止" : "开始";
            startButton.style.backgroundColor = startFlag ? "#f00" : "#fff";
            if (startFlag) {
                initTxnJob();
            }
        };


        GM_addElement(document.querySelector("#mk_wrapper"), "input", {
            id: "mk_balance",
            type: "text",
            style: "display: block; width: 200px; height: 30px; margin-bottom: 5px; border-radius: 5px; border: 1px solid #ccc; padding: 5px;",
            readonly: true,
            placeholder: "余额"
        });
    };

    const initOverride = () => {
        const originOpen = XMLHttpRequest.prototype.open;
        const parser = new DOMParser();
        XMLHttpRequest.prototype.open = function (_, url) {
            if (GM_getValue("mk_start_flag", false)) {
                this.addEventListener("readystatechange", function () {
                    if (this.readyState === 4) {
                        const responseDoc = parser.parseFromString(this.responseText, "text/html");
                        parseTxnList(responseDoc);
                    }
                });
            }
            originOpen.apply(this, arguments);
        };
    };

    const parseTxnList = (responseDoc) => {
        if (!responseDoc) return;

        const txnList = responseDoc.querySelectorAll("tbody[id='mainform:StatementViewId_data'] tr[data-ri]");
        if (!txnList) return;
        for (let i = 0; i < txnList.length; i++) {
            const txn = txnList[i];

            const tds = txn.querySelectorAll("td");
            let debit = tds[3].innerText.replace("INR", "").replace("\n", "").replace("\t", "").trim();
            if (debit) {
                if (debit.includes(".")) {
                    debit = debit.replace(",", "").replace(".", "").trim();
                } else {
                    debit = debit.replace(",", "").trim() + "00";
                }
            }
            let credit = tds[4].innerText.replace("INR", "").replace("\n", "").replace("\t", "").trim();
            if (credit) {
                if (credit.includes(".")) {
                    credit = credit.replace(",", "").replace(".", "").trim();
                } else {
                    credit = credit.replace(",", "").trim() + "00";
                }
            }
            const amount = debit || credit;
            const balance = tds[5].innerText.replace("INR", "").replace("\n", "").replace("\t", "").trim();
            if (balance.includes(".")) {
                balance = balance.replace(",", "").replace(".", "").trim();
            } else {
                balance = balance.replace(",", "").trim() + "00";
            }
            const type = credit ? 0 : 1;
            const remarks = tds[1].innerText.replace("\n", "").replace("\t", "").trim();

            if (i == 0) {
                const balanceEle = document.querySelector("#mk_balance");
                balanceEle.value = tds[5].innerText.replace("\n", "").replace("\t", "").trim();
            }

            const match = remarks.match(/\d{12}/);
            var transactionCode;
            if (match) {
                transactionCode = match[0];
            }

            var messageIdentifyCode;
            var split = remarks.split("/");
            messageIdentifyCode = split[split.length - 1];

            var userName = document.querySelector("#mk_user_name").value;

            const data = {
                key: `Maha_${userName}_`,
                value: {
                    amount: amount,
                    balance: balance,
                    detail: remarks,
                    transactionCode: transactionCode,
                    transactionType: type,
                    messageIdentifyCode: messageIdentifyCode
                }
            };

            GM_xmlhttpRequest({
                method: "POST",
                url: "http://localhost:34567",
                headers: {
                    "Content-Type": "application/json",
                },
                data: JSON.stringify(data),
                onload: function (response) {
                    console.log(response.responseText);
                }
            });
        }
    };

    const waitForEle = async (selector, timeout = 36000) => {
        let startTime = Date.now();
        while (Date.now() - startTime < timeout) {
            let targetEle = document.querySelector(selector);
            if (targetEle && targetEle.style.display !== "none") return targetEle;
            await delay(1000);
        }
    };

    const waitForEleNone = async (selector, timeout = 36000) => {
        let startTime = Date.now();
        while (Date.now() - startTime < timeout) {
            let targetEle = document.querySelector(selector);
            if (targetEle && targetEle.style.display === "none") return targetEle;
            await delay(1000);
        }
    };

    const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

    initOverride();
    initDashBoard();
    initTxnJob();

})();