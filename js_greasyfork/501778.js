// ==UserScript==
// @name         b站（bilibili）稍后再看链接替换
// @match        https://www.bilibili.com/list/watchlater*
// @grant        none
// @version      0.1
// @description  从 稍后再看样式播放器 进入 正常样式的播放器
// @author       ccm
// @license      MIT

// @namespace https://greasyfork.org/users/1328577
// @downloadURL https://update.greasyfork.org/scripts/501778/b%E7%AB%99%EF%BC%88bilibili%EF%BC%89%E7%A8%8D%E5%90%8E%E5%86%8D%E7%9C%8B%E9%93%BE%E6%8E%A5%E6%9B%BF%E6%8D%A2.user.js
// @updateURL https://update.greasyfork.org/scripts/501778/b%E7%AB%99%EF%BC%88bilibili%EF%BC%89%E7%A8%8D%E5%90%8E%E5%86%8D%E7%9C%8B%E9%93%BE%E6%8E%A5%E6%9B%BF%E6%8D%A2.meta.js
// ==/UserScript==

//参考了https://greasyfork.org/zh-CN/users/1038738-toonaive2333
(function() {
    'use strict';

    // 取得当前 URL
    function getUrl(){
        var currentUrl = window.location.href;
        console.log(currentUrl);
        return currentUrl;
    }

    // 替换 URL
    function tranUrl(){
        let url = getUrl();

        // 处理包含 bvid 和 oid 的情况
        if (url.includes("bvid") && url.includes("oid")) {
            let bvidMatch = url.match(/bvid=([^&]*)/);
            if (bvidMatch) {
                url = `https://www.bilibili.com/${bvidMatch[1]}`;
            }
        }
        // 处理包含 bvid 而不包含 oid 的情况
        else if (url.includes("bvid")) {
            url = url.replace(/list\/watchlater\?bvid=/, "");
            url = url.replace(/&.*/, "");
        }

        console.log(url);
        return url;
    }

    // 提示框
    function showAlert(message) {
        const alertBox = document.createElement("div");
        alertBox.style.position = "fixed";
        alertBox.style.top = "0";
        alertBox.style.left = "0";
        alertBox.style.width = "100%";
        alertBox.style.backgroundColor = "yellow";
        alertBox.style.textAlign = "gray";
        alertBox.style.padding = "10px";
        alertBox.innerText = message;
        document.body.appendChild(alertBox);
        setTimeout(() => {
          alertBox.remove();
        }, 2000);
    }

    // 弹提示框然后跳转链接
    showAlert("跳转中！");
    let newUrl = tranUrl();
    window.location.href = newUrl;

})();
