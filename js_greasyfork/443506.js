// ==UserScript==
// @name         B站素材库平台下载按钮
// @namespace    http://tampermonkey.net/
// @version      0.1.2
// @description  B站素材库平台 下载按钮
// @author       You
// @match        https://cool.bilibili.com/detail/video?*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=bilibili.com
// @grant        none
// @run-at       document-idle
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/443506/B%E7%AB%99%E7%B4%A0%E6%9D%90%E5%BA%93%E5%B9%B3%E5%8F%B0%E4%B8%8B%E8%BD%BD%E6%8C%89%E9%92%AE.user.js
// @updateURL https://update.greasyfork.org/scripts/443506/B%E7%AB%99%E7%B4%A0%E6%9D%90%E5%BA%93%E5%B9%B3%E5%8F%B0%E4%B8%8B%E8%BD%BD%E6%8C%89%E9%92%AE.meta.js
// ==/UserScript==


(function () {
    'use strict';
    function downloadURI(uri, name) {
        var link = document.createElement("a");
        // 改download参数也不能改下载下来的名字，很奇怪
        link.download = name;
        console.log(link.download)
        link.href = uri;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    }
    function addBut() {
        var but = document.createElement("button");
        but.innerHTML = "下载";
        // 更新符合B站风格的样式
        but.style = "margin-top: 22px;width: 76px;height: 40px;font-size: 14px;line-height: 40px;text-align: center;background: #20aae2;border: 1px solid #20aae2;color: #fff;border-radius: 20px;box-sizing: border-box;";
        var parent = document.getElementsByClassName("rules")[0];
        var node = document.createElement("div");
        node.style = "display: flex;height: inherit;width: inherit;justify-content: space-evenly;justify-content: space-evenly;align-items: center;";
        var childLength = parent.childNodes.length;
        for (var i = 0; i < childLength; i++) {
            parent.removeChild(parent.childNodes[0]);
        }
        node.appendChild(but)
        parent.appendChild(node);
        but.onclick = function () {
            downloadURI(document.getElementsByTagName('video')[0].src, document.getElementsByClassName('info-card-title')[0].innerHTML)
        }
    }
    // 延迟1秒执行，如果网速慢可以增加延迟时间
    setTimeout(() => {
        addBut()
    }, 1500)
    // Your code here...
})();