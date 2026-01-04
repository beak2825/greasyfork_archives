// ==UserScript==
// @name         秒账
// @namespace    http://tampermonkey.net/
// @version      4.2.0
// @description  try to extend mz!
// @author       LZZ
// @match        https://mz.bizgo.com/index.html
// @icon         https://www.google.com/s2/favicons?sz=64&domain=bizgo.com
// @run-at document-start
// @run-at document-end
// @grant unsafeWindow
// @grant GM_setClipboard
// @grant GM_info
// @grant GM_addStyle
// @grant GM_getValue
// @grant GM_setValue
// @grant GM_notification
// @grant GM_openInTab
// @grant GM_xmlhttpRequest
// @downloadURL https://update.greasyfork.org/scripts/475088/%E7%A7%92%E8%B4%A6.user.js
// @updateURL https://update.greasyfork.org/scripts/475088/%E7%A7%92%E8%B4%A6.meta.js
// ==/UserScript==

//send数据函数
//参数1：url;参数2：请求类型get或post;参数3：post的body;
function runAsync(url, send_type, data_ry, head) {
    let p = new Promise((resolve, reject) => {
        GM_xmlhttpRequest({
            method: send_type,
            url: url,
            headers: head/* {
                "Content-Type": "application/x-www-form-urlencoded;charset=utf-8"
            } */,
            data: data_ry,
            onload: function (response) {
                resolve(response.responseText);
            },
            onerror: function (response) {
                console.error(url + "=========>请求失败!");
                reject("请求失败");
            }
        });
    })
    return p;
}

// 添加铝锭价格展示组件
function addPriceCom(parent) {
    let objectDate = new Date();

    let timestamp = new Date().getTime();

    // 开始抓取铝锭价
    runAsync("https://api.iyunhui.com/v2/market/price?starttime=" + (Math.floor(timestamp/1000) -86400*10) + "&endtime=" + Math.floor(timestamp / 1000) + "&classid=10", "GET", null, null).then((result) => {
        result = JSON.parse(result);

        let data = result[0];
        
        if (!data) return;

        let createTime = new Date(data.createtime * 1000);

        let div = document.createElement("div");
        div.style.position = "absolute";
        div.style.whiteSpace = "nowrap";
        div.style.top = "0px";
        div.style.left = "350px";
        div.style.fontFamily = "Verdana";
        div.style.color = "#333333";
        div.textContent = (createTime.getMonth() + 1) + "月" + createTime.getDate() + "日" + "铝锭:" + data.max + (parseInt(data.move) > 0 ? " ↑ " : " ↓ ") + data.move;
        div.style.fontSize = "30px";
        parent.appendChild(div);
    })
}

// 等待网页完成加载
let flushPriceTimeID = setInterval(function () {
    let logo = document.querySelector("#logo");
    if (logo) {
        // 添加铝锭价格展示
        addPriceCom(logo);
        // 结束计时
        clearInterval(flushPriceTimeID);
    }
}, 500);