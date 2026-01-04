// ==UserScript==
// @name        IDBI_MINI
// @namespace    http://tampermonkey.net/
// @version      2025-03-33
// @description  IDBI_MINI!
// @author       You
// @match        https://inet.idbibank.co.in/ret/Finacle;jsessionid*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=idbibank.co.in
// @grant        GM_xmlhttpRequest
// @grant        GM_addElement
// @grant        GM_setValue
// @grant        GM_getValue
// @run-at document-idle
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/532503/IDBI_MINI.user.js
// @updateURL https://update.greasyfork.org/scripts/532503/IDBI_MINI.meta.js
// ==/UserScript==

(function () {
    'use strict';
    var titleSpan = null;
    var goButton = null;
    var titleSpanIntervalID = null;
    var ccButton = null;
    var startFlag = false;

    addElement();

    setInterval(function () {
        let closeIcon = document.getElementById("closeIcon");
        var _startFlag = GM_getValue("cc_start_flag");
        if (_startFlag) {
            let mini = document.getElementById("PageConfigurationMaster_ROAUUIW__1:VIEW_MINI_STATEMENT[0]8");
            let blockLength = document.querySelectorAll("div[class='blockUI']").length;
            if (null == closeIcon && mini && blockLength == 0) {
                mini.click();
                setTimeout(function () {
                    closeIcon = document.getElementById("closeIcon");
                    if (closeIcon) {
                        closeIcon.click();
                    }
                }, 3000);
            } else {
                if (closeIcon) {
                    closeIcon.click();
                }
            }
        }
    }, 8000);

    function addElement() {
        GM_addElement(document.querySelector("body"), 'div', {
            id: 'monkey_wrapper', style: 'position: fixed; top: 10px; left: 10px; z-index: 9999; padding: 10px; background: #fff; border: 1px solid #ccc; border-radius: 5px; box-shadow: 0 0 10px rgba(0,0,0,0.5);'
        });

        
        GM_addElement(document.querySelector("#monkey_wrapper"), 'input', {
            id: 'mk_webName', type: "text", style: "display: block; width: 200px; height: 30px; margin-bottom: 5px; border-radius: 5px; border: 1px solid #ccc; padding: 5px;", placeholder: "请输入用户名"
        });
        document.querySelector("#mk_webName").value = GM_getValue("ss_mk_webName", "");

        GM_addElement(document.querySelector("#monkey_wrapper"), 'input', {
            id: 'mk_userName', type: "text", style: "display: block; width: 200px; height: 30px; margin-bottom: 5px; border-radius: 5px; border: 1px solid #ccc; padding: 5px;", placeholder: "请输入用户名"
        });
        document.querySelector("#mk_userName").value = GM_getValue("ss_mk_userName", "");


        GM_addElement(document.querySelector("#monkey_wrapper"), 'input', {
            id: 'cc_ww_code', type: "text", style: "display: none; width: 200px; height: 30px; margin-bottom: 5px; border-radius: 5px; border: 1px solid #ccc; padding: 5px;", placeholder: "请输入渠道名称"
        });
        GM_addElement(document.querySelector("#monkey_wrapper"), 'input', {
            id: 'cc_ww_btn', type: "button", class: "styled", value: "start",
            style: "display: block; width: 200px; height: 30px; margin-bottom: 5px; border-radius: 5px; border: 1px solid #ccc; padding: 5px;"
        });
        var button = document.getElementById('cc_ww_btn');
        button.onclick = function () {
            var webName = document.getElementById('mk_webName').value;
            var userName = document.getElementById('mk_userName').value;
            var ccBtn = document.getElementById('cc_ww_btn');
            if (!webName || !userName) {
                alert('请输入监控名和登录账号名');
            } else {
                GM_setValue("ss_mk_webName", webName);
                GM_setValue("ss_mk_userName", userName);
                
                if ("Close" == ccBtn.value) {
                    ccBtn.value = "Start";
                    ccBtn.style.backgroundColor = "white";
                    startFlag = false;
                    GM_setValue("cc_start_flag", startFlag);
                } else {
                    ccBtn.value = "Close";
                    ccBtn.style.backgroundColor = "red";
                    startFlag = true;
                    GM_setValue("cc_start_flag", startFlag);
                }
            }
        };
    }

    const originOpen = XMLHttpRequest.prototype.open;
    const parser = new DOMParser();
    XMLHttpRequest.prototype.open = function (_, url) {
        if (url.startsWith("FinacleRiaRequest;jsessionid")) {
            this.addEventListener("readystatechange", function () {
                if (this.readyState === 4) {
                    const doc = parser.parseFromString(this.responseText, "text/html");
                    var rows = doc.querySelectorAll("table[id*='HWListTable'] tbody.listrowwrapper");
                    if (rows && rows.length > 0) {
                        var dataArray = parseData(rows);
                        console.log('parseData', dataArray);
                        if (dataArray.length > 0) {
                            commitData(dataArray);
                        }
                    }
                }
            });
        }
        originOpen.apply(this, arguments);
    };

    function parseData(rows) {
        var list = [];
        rows.forEach(row => {
            var tds = row.querySelectorAll("tr td");
            var amount = tds[4].innerText.trim().replace(".", "").replace(",", "");
            var type = tds[3].innerText.trim();
            var typeParse = type.includes("CR") ? 0 : 1;
            var remarks = tds[1].innerText.trim();

            const match = remarks.match(/\d{12}/);
            var transactionCode;
            if (match) {
                transactionCode = match[0];
            }

            var messageIdentifyCode;
            var split = remarks.split("/");
            messageIdentifyCode = split[split.length - 1];

            var webName = document.querySelector("#mk_webName").value;
            var userName = document.querySelector("#mk_userName").value;
            
            list.push({
                key: `${webName}_${userName}_`,
                value: {
                    amount: amount,
                    balance: 0,
                    detail: remarks,
                    transactionCode: transactionCode,
                    transactionType: typeParse,
                    messageIdentifyCode: messageIdentifyCode
                }
            });
        });
        return list;
    }
    function commitData(dataList) {
        console.log('commitData', dataList);
        if (dataList) {
            dataList.forEach(data => {
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
            });
        }
    }


})();