// ==UserScript==
// @name         获取EVRI快递图片
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  查询EVRI的快递图片
// @author       You
// @match        https://www.evri.com/track/parcel/*/details
// @grant        GM_xmlhttpRequest
// @connect      *
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/473818/%E8%8E%B7%E5%8F%96EVRI%E5%BF%AB%E9%80%92%E5%9B%BE%E7%89%87.user.js
// @updateURL https://update.greasyfork.org/scripts/473818/%E8%8E%B7%E5%8F%96EVRI%E5%BF%AB%E9%80%92%E5%9B%BE%E7%89%87.meta.js
// ==/UserScript==

(function () {
    'use strict';

    // 指定需要截取请求的 URL 中包含的字符串
    const targetString = '/parcels/photo/';
    var imgUrl = "";
    const nativeXHRopen = XMLHttpRequest.prototype.open;
    // 重写 XMLHttpRequest 的 open 方法，捕获指定域名的请求
    XMLHttpRequest.prototype.open = function (method, url) {
        const urlObj = new URL(url, window.location.href);

        if (urlObj.href.includes(targetString)) {
            console.log('截取的 XHR 请求完整 URL:', urlObj.href);
            imgUrl = urlObj.href;
        }

        return nativeXHRopen.apply(this, arguments);
    };

    waitForElement(".follow-my-parcel__card-top");
    
    console.log(imgUrl);

    function elementFound(element) {
        var btn = document.createElement("button");
        btn.id = "btnGetImage";
        btn.innerText = "获取图片";
        btn.onclick = async function () {
            if(imgUrl==""){
                alert("未能查询图片！");
                return;
            }
            await GM_xmlhttpRequest({
                method: "GET",
                url: imgUrl,
                headers: {
                    "accept": "application/json, text/plain, */*",
                    "accept-language": "zh-CN,zh;q=0.9,en;q=0.8,en-GB;q=0.7,en-US;q=0.6",
                    "apikey": "R6xkX4kqK4U7UxqTNraxmXrnPi8cFPZ6",
                    "sec-ch-ua": '"Chromium";v="116", "Not A Brand";v="24", "Microsoft Edge";v="116"',
                    "sec-ch-ua-mobile": "?0",
                    "sec-ch-ua-platform": '"Windows"',
                    "sec-fetch-dest": "empty",
                    "sec-fetch-mode": "cors",
                    "sec-fetch-site": "cross-site"
                },
                onload: function (response) {
                    const jsonResponse = JSON.parse(response.responseText);
                    console.log('异步请求成功:', jsonResponse);
                    var img = document.createElement("img");
                    img.src = jsonResponse.image;
                    document.querySelector(".follow-my-parcel__list-container").appendChild(img);
                },
                onerror: function () {
                    console.error('异步请求失败');
                }
            })
        }
        element.appendChild(btn);
    }

    function waitForElement(selector) {
        const targetNode = document.querySelector('body');
        const config = { childList: true, subtree: true };
        const observer = new MutationObserver((mutationsList, observer) => {
            const element = document.querySelector(selector);
            if (element) {
                observer.disconnect();
                elementFound(element);
            }
        });
        observer.observe(targetNode, config);
    }
})();