// ==UserScript==
// @name         crawler 1688
// @namespace    http://tampermonkey.net/
// @version      0.16
// @description  crawler 1688.
// @author       DL
// @match        https://detail.1688.com/*
// @grant        GM_xmlhttpRequest
// @downloadURL https://update.greasyfork.org/scripts/376453/crawler%201688.user.js
// @updateURL https://update.greasyfork.org/scripts/376453/crawler%201688.meta.js
// ==/UserScript==

'use strict';
(function() {
    'use strict';
    let div = document.createElement("div");
    div.setAttribute('style', 'width: 1200px; height: 55px; background: DarkGreen; z-index: 100; position: fixed; bottom: 0; margin: auto; left:0; right:0; border: 1px solid #e5e5e5; line-height: 55px; padding: 0 20px;');
    div.innerHTML = "<h1 style=\"color: white; display:inline;\">账号：</h1><input type=\"text\" id=\"account_number\" autocomplete=\"on\" style=\"width: 200px; height: 25px;\"/>"
    div.innerHTML += "<button id=\"btn-crawler\" style=\"position: absolute; right: 50px; margin-top: 10px; color: #FFF; background-color: #03a9f4; line-height: 32px; padding-left: 10px; padding-right: 10px; cursor: pointer;\">抓取</button>"
    document.body.appendChild(div);
    document.body.style.paddingBottom = "20px";
    let btnCrawler = document.getElementById("btn-crawler");
    let inputAccountNumber = document.getElementById("account_number");
    let cookies = document.cookie.split(";");
    let accountNumberByCookie = null;
    for(let i=0; i<cookies.length; i++) {
        let cookie = cookies[i].split("=");
        if (cookie[0].trim()==="account_number") {
            accountNumberByCookie = cookie[1];
        }
    }
    inputAccountNumber.value = accountNumberByCookie;
    btnCrawler.addEventListener("click", function() {
        document.cookie = "account_number=" + inputAccountNumber.value.trim();
        if (!inputAccountNumber.value.trim()) {
            alert("请输入账号");
            return;
        }
        btnCrawler.disabled = "disabled";
        btnCrawler.innerText = "处理中";
        GM_xmlhttpRequest({
            method: "POST",
            // url: "http://localhost:9292/v1/crawlers/by1688",
            //url: "http://shop.service.staging.ggoo.net.cn/v1/crawlers/by1688",
            url: "https://shop-api.ggoo.net.cn/v1/crawlers/by1688",
            headers: {"Content-Type": "application/json"},
            data: JSON.stringify({
                "account_number": inputAccountNumber.value.trim(),
                "content": document.documentElement.outerHTML,
            }),
            onload: function(response) {
                let data = JSON.parse(response.responseText);
                if (data.code === 200) {
                    alert("保存成功！");
                } else {
                    alert(data.tips);
                }
                btnCrawler.disabled = "";
                btnCrawler.innerText = "抓取";
            },
            onerror: function(error) {
                alert("操作失败，请联系管理员！");
                btnCrawler.disabled = "";
                btnCrawler.innerText = "抓取";
            }
        });
    });
})();

