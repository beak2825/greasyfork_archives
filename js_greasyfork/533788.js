// ==UserScript==
// @name         BANK_IOB_P_WM
// @namespace    http://tampermonkey.net/
// @version      2025-04-27
// @description  需要配合监控使用
// @author       WebMonitor
// @match        https://www.iobnet.co.in/*
// @icon         TODO
// @grant        GM_xmlhttpRequest
// @grant        GM_addElement
// @grant        GM_setValue
// @grant        GM_getValue
// @run-at       document-idle
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/533788/BANK_IOB_P_WM.user.js
// @updateURL https://update.greasyfork.org/scripts/533788/BANK_IOB_P_WM.meta.js
// ==/UserScript==

(() => {
    "use strict";

    const initTxnJob = async () => {
        while (GM_getValue("mk_start_flag", false)) {
            try {
                document.querySelector("a[href*='getLastFew']").click();
                await delay(2000);
                document.querySelector("div[aria-describedby='lastfew'] button[title='Close']").click();
                try {
                    const accInfo = document.querySelector("a[href*='getLastFew']");
                    const accHref = accInfo.getAttribute("href");
                    const accReg = /getLastFew\('([^']+)','([^']+)'\)/;
                    const accMatch = accHref.match(accReg);
                    const accNick = encodeURIComponent(accMatch[1]);
                    const accNo = encodeURIComponent(accMatch[2]);
                    const csrfid = document.querySelector("input[id='csrftokenid']").value;
                    const res = await fetch("https://www.iobnet.co.in/ibanking/query?", {
                        "headers": {
                            "accept": "*/*",
                            "accept-language": "en-US,en;q=0.9,zh-CN;q=0.8,zh;q=0.7",
                            "cache-control": "no-cache",
                            "content-type": "application/x-www-form-urlencoded",
                            "csrfid": csrfid,
                            "pragma": "no-cache",
                            "sec-ch-ua": "\"Google Chrome\";v=\"135\", \"Not-A.Brand\";v=\"8\", \"Chromium\";v=\"135\"",
                            "sec-ch-ua-mobile": "?0",
                            "sec-ch-ua-platform": "\"Windows\"",
                            "sec-fetch-dest": "empty",
                            "sec-fetch-mode": "cors",
                            "sec-fetch-site": "same-origin"
                        },
                        "referrer": "https://www.iobnet.co.in/ibanking/ibquery.do?query=balance",
                        "referrerPolicy": "strict-origin-when-cross-origin",
                        "body": `type=balance&acno=${accNo}&nick=${accNick}`,
                        "method": "POST",
                        "mode": "cors",
                        "credentials": "include"
                    });
                    if (!res.ok) return;
                    const resText = await res.text();
                    const resJson = JSON.parse(resText);
                    const csrftokenid = resJson.csrftokenid;
                    document.querySelector("input[id='csrftokenid']").value = csrftokenid;
                    const balance = resJson.availbal;
                    document.querySelector("#mk_balance").value = balance;
                } catch (e) { }
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
                const accTable = document.querySelector("table[id='lstAccounts']");
                if (!accTable) {
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

    const initOverride = () => {
        const originOpen = XMLHttpRequest.prototype.open;
        XMLHttpRequest.prototype.open = function (_, url) {
            if (GM_getValue("mk_start_flag", false)) {
                this.addEventListener("readystatechange", function () {
                    if (this.readyState === 4) {
                        const resJson = JSON.parse(this.responseText);
                        parseTxnList(resJson);
                    }
                });
            }
            originOpen.apply(this, arguments);
        };
    };

    const parseTxnList = (data) => {
        const list = data["lastfew"];
        for (let i = 0; i < list.length; i++) {
            const ele = list[i];
            let amount = ele["amount"].trim();
            if (amount.includes(".")) {
                amount = amount.replace(",", "").replace(".", "").trim();
            } else {
                amount = amount.replace(",", "").trim() + "00";
            }
            const type = ele["drCr"].includes("Credit") ? "0" : "1";
            const remarks = ele["narr"].trim();

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
                key: `Iob.p_${userName}_`,
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
    };

    const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

    initOverride();
    initDashBoard();

})();