// ==UserScript==
// @name         BANK_AXIS_NEO_WM
// @namespace    http://tampermonkey.net/
// @version      2025-04-27
// @description  需要配合监控使用
// @author       WebMonitor
// @match        https://neo.axisbank.com/*
// @icon         TODO
// @grant        GM_xmlhttpRequest
// @grant        GM_addElement
// @grant        GM_setValue
// @grant        GM_getValue
// @run-at       document-idle
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/533813/BANK_AXIS_NEO_WM.user.js
// @updateURL https://update.greasyfork.org/scripts/533813/BANK_AXIS_NEO_WM.meta.js
// ==/UserScript==

(() => {
    "use strict";

    const initTxnJob = async () => {
        while (GM_getValue("mk_start_flag", false)) {
            try {
                // 余额
                try {
                    const balance = document.querySelector("ax-bank-account-card > div > div > div > div:nth-of-type(2) > span");
                    document.querySelector("#mk_balance").value = balance.innerText;
                } catch {

                }

                // 流水
                try {
                    const txnList = document.querySelectorAll("ax-bank-account-statements div[ngsscrollheightadjuster] > div");
                    if (txnList) {
                        for (let i = 0; i < txnList.length; i++) {
                            const txn = txnList[i];
                            const tds = txn.firstChild.children;
                            const remarks = tds[2].innerText.replace("\r\n", "").replace("\r", "").replace("\n", "").replace("\t", "").trim();
                            const type = tds[3].innerText.replace("\r\n", "").replace("\r", "").replace("\n", "").replace("\t", "").trim();
                            const amount = tds[4].innerText.replace("\r\n", "").replace("\r", "").replace("\n", "").replace("\t", "").trim();
                            amount = amount.match(/\d.*/)[0];
                            let amountParse;
                            if (amount.includes(".")) {
                                amountParse = amount.replace(",", "").replace(".", "").trim();
                            } else {
                                amountParse = amount.replace(",", "").trim() + "00";
                            }

                            const codeMatch = remarks.match(/\d{12}/);
                            var transactionCode;
                            if (codeMatch) {
                                transactionCode = codeMatch[0];
                            }

                            var messageIdentifyCode;
                            var split = remarks.split("/");
                            messageIdentifyCode = split[split.length - 1];

                            var userName = document.querySelector("#mk_user_name").value;

                            const data = {
                                key: `Axis_neo_${userName}_`,
                                value: {
                                    amount: amountParse,
                                    balance: "",
                                    detail: remarks,
                                    transactionCode: transactionCode,
                                    transactionType: type != "DEBIT" ? 0 : 1,
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
                    }
                } catch {

                }

                document.querySelector("ax-bank-account-card").click();
            } catch (e) {
                console.error("click fromCombo error", e);
            } finally {
                await delay(6000);
            }
        }
    };

    const initDashBoard = () => {
        /* 面板容器 */
        GM_addElement(document.querySelector("body"), "div", {
            id: "mk_wrapper",
            style: "position: fixed; top: 100px; right: 10px; z-index: 9999; padding: 10px; background: #fff; border: 1px solid #ccc; border-radius: 5px; box-shadow: 0 0 10px rgba(0,0,0,0.5);"
        });

        /* 输入控件 */
        GM_addElement(document.querySelector("#mk_wrapper"), "input", {
            id: "mk_user_name",
            type: "text",
            style: "display: block; width: 200px; height: 30px; margin-bottom: 5px; border-radius: 5px; border: 1px solid #ccc; padding: 5px;",
            placeholder: "请输入 User Id"
        });
        document.querySelector("#mk_user_name").value = GM_getValue("mk_user_name", "");

        /* 按钮控件 */
        GM_addElement(document.querySelector("#mk_wrapper"), "input", {
            id: "mk_start",
            type: "button",
            value: "开始",
            style: "color: #000; display: block; cursor: pointer; width: 200px; height: 30px; margin-bottom: 5px; border-radius: 5px; border: 1px solid #ccc; padding: 5px;"
        });
        document.querySelector("#mk_start").onclick = () => {
            if (!GM_getValue("mk_start_flag", false)) {
                const txnPage = document.querySelector("ax-bank-account-details > div > div > div > div:nth-of-type(1) > div:nth-of-type(2)");
                if (!txnPage) {
                    alert("请登录并导航到短流水页面");
                    return;
                }

                const userName = document.querySelector("#mk_user_name").value;
                if (!userName) {
                    alert("请输入用户名");
                    return;
                }

                GM_setValue("mk_user_name", userName);
            }

            let startFlag = !GM_getValue("mk_start_flag", false);
            GM_setValue("mk_start_flag", startFlag);

            const startButton = document.querySelector("#mk_start");
            startButton.value = startFlag ? "停止" : "开始";
            startButton.style.backgroundColor = startFlag ? "#f00" : "#fff";

            if (startFlag) {
                initTxnJob();
            }
        };


        /* 余额控件 */
        GM_addElement(document.querySelector("#mk_wrapper"), "input", {
            id: "mk_balance",
            type: "text",
            readonly: true,
            style: "display: block; width: 200px; height: 30px; margin-bottom: 5px; border-radius: 5px; border: 1px solid #ccc; padding: 5px;",
            placeholder: "当前余额"
        });
        document.querySelector("#mk_balance").value = GM_getValue("mk_balance", "");

    };

    const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

    initDashBoard();

})();