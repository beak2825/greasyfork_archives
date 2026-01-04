// ==UserScript==
// @name         拼多多采集
// @namespace    http://tampermonkey.net/
// @version      2024-12-23
// @description  pdd采集
// @author       bzy
// @match        https://mobile.yangkeduo.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=microsoft.com
// @run-at       document-end
// @grant        GM_xmlhttpRequest
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/521660/%E6%8B%BC%E5%A4%9A%E5%A4%9A%E9%87%87%E9%9B%86.user.js
// @updateURL https://update.greasyfork.org/scripts/521660/%E6%8B%BC%E5%A4%9A%E5%A4%9A%E9%87%87%E9%9B%86.meta.js
// ==/UserScript==

(function() {
    'use strict';

    function sendRequest2(method, url, data = null, callback = null, headers = {}) {
        // 创建 XMLHttpRequest 对象
        const xhr = new XMLHttpRequest();

        // 配置请求
        xhr.open(method, url, true);

        // 设置请求头（可以根据需要自定义）
        for (const key in headers) {
            xhr.setRequestHeader(key, headers[key]);
        }

        // 设置请求完成后的回调函数
        console.log(url)
        xhr.onload = function() {
            if (xhr.status >= 200 && xhr.status < 300) {
                console.log("已上传")
                // 请求成功
                if (callback) callback(null, xhr.responseText);
            } else {
                console.log("失败")
                // 请求失败
                if (callback) callback(new Error(`Request failed with status ${xhr.status}`));
            }
        };

        // 处理请求错误
        xhr.onerror = function() {
            if (callback) callback(new Error('Network error'));
        };

        // 发送请求（如果有请求体，则发送数据）
        xhr.send(data);
    }

    let url = window.location.href
    // unsafeWindow.alert("找到商品")
    if (url.includes('mobile.yangkeduo.com/goods2.html?goods_id')) {
        try {
            const urlParams = new URLSearchParams(window.location.search);
            const goodsId = urlParams.get("goods_id");
            const userId = urlParams.get("user_id");
            let pageHTML = document.documentElement.outerHTML
            const regex = /window\.rawData\s*=\s*(.*?);/s;
            const match = pageHTML.match(regex);
            // const rawDataValue = match[1].trim();
            // console.log("window.rawData 的值为:", rawDataValue);
            // alert(match[1])
            if (match && match[1]) {
                // unsafeWindow.fetch ("http://45.136.13.81:5002/up", {"body": "{'123': '456'}"})
                // alert("有商品")
                const rawDataValue = match[1].trim();
                if (rawDataValue.includes("商品已售罄")) {
                    return
                }
                url = "http://45.136.13.81:5002/up"
                GM_xmlhttpRequest({
                    "url": url,
                    "data": JSON.stringify({
                        "goods_id": goodsId,
                        "goods_detail":rawDataValue,
                        "use":"005"
                    }),
                    "method": "POST",
                    "headers": {"Content-Type":"application/json"},
                    "onload": (res) => {
                        console.log(JSON.stringify(res))
                    }
                })


                sendRequest2("GET", "https://pddcj.https7.com/api/v1/other/achieve?goods_id=" + goodsId + "&status=1&user_id=" + userId )
            } else {
                console.log("没有找到");
            }
        } catch (error) {
            alert("出错" + error)
        }

    }
})();