// ==UserScript==
// @name         BANK_JK_MPAY_WM
// @namespace    http://tampermonkey.net/
// @version      2025-04-27
// @description  需要配合监控使用
// @author       WebMonitor
// @match        https://ibank.jkbank.com/ReachIB/inet/entry
// @icon         TODO
// @grant        GM_xmlhttpRequest
// @grant        GM_addElement
// @grant        GM_setValue
// @grant        GM_getValue
// @run-at       document-idle
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/533576/BANK_JK_MPAY_WM.user.js
// @updateURL https://update.greasyfork.org/scripts/533576/BANK_JK_MPAY_WM.meta.js
// ==/UserScript==

(() => {
    "use strict";

    const initTxnJob = async () => {
        while (GM_getValue("mk_start_flag", false)) {
            try {
                try {
                    const balance = document.evaluate("//div[contains(text(), 'Account Balance')]", document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue.parentNode.querySelector("div:nth-child(2)");
                    document.querySelector("#mk_balance").value = balance.innerText.replace(":", "").trim();
                } catch {

                }

                const txnList = document.querySelectorAll(".p-dataview-content > .flex-column");
                console.log("txnList", txnList);
                if (txnList && txnList.length > 0) {
                    for (let i = 0; i < txnList.length; i++) {
                        let amountEle = txnList[i].querySelector(".text_severity_debit,.text_severity_credit");
                        const match = amountEle.innerText.match(/(\d.*)/);
                        let amount = match ? match[1] : '';
                        if (amount.includes(".")) {
                            amount = amount.replace(",", "").replace(".", "").trim();
                        } else {
                            amount = amount.replace(",", "").trim() + "00";
                        }

                        const type = amountEle.classList.contains("text_severity_credit") ? "0" : "1";

                        let remarks = txnList[i].querySelector(".transaction_text").innerText;
                        remarks = remarks.replace(/(\r\n|\n|\r|\t)/gm, "").trim();

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
                            key: `Jk.MpayWeb_${userName}_`,
                            value: {
                                amount: amount,
                                balance: "",
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
                }

                document.querySelector("a[id='fromCombo']").click();
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
            style: "display: block; cursor: pointer; width: 200px; height: 30px; margin-bottom: 5px; border-radius: 5px; border: 1px solid #ccc; padding: 5px;"
        });
        document.querySelector("#mk_start").onclick = () => {
            if (!GM_getValue("mk_start_flag", false)) {
                if (!document.querySelector("a[id='fromCombo']")) {
                    alert("请登录并停留在 Dashboard 页面");
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

    // initOverride();
    initDashBoard();

})();