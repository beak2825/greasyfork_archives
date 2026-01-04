// ==UserScript==
// @name         快速打开粘贴的多个网址
// @namespace    http://tampermonkey.net/
// @version      0.3
// @description  批量打开多个网址，支持设置时间间隔
// @author       喵喵侠
// @match        *://*/*
// @grant        none
// @run-at       context-menu
// @downloadURL https://update.greasyfork.org/scripts/40912/%E5%BF%AB%E9%80%9F%E6%89%93%E5%BC%80%E7%B2%98%E8%B4%B4%E7%9A%84%E5%A4%9A%E4%B8%AA%E7%BD%91%E5%9D%80.user.js
// @updateURL https://update.greasyfork.org/scripts/40912/%E5%BF%AB%E9%80%9F%E6%89%93%E5%BC%80%E7%B2%98%E8%B4%B4%E7%9A%84%E5%A4%9A%E4%B8%AA%E7%BD%91%E5%9D%80.meta.js
// ==/UserScript==

(function () {
    'use strict';

    // 创建主容器
    var div = document.createElement("div");
    div.style.cssText = "position:fixed;top:0;right:0;bottom:0;left:0;margin:auto;z-index:99999;width:800px;height:600px;background:rgba(0,0,0,0.8);display:flex;flex-direction:column;justify-content:center;align-items:center;padding:20px;border-radius:10px;";

    // 创建文本框
    var textarea = document.createElement("textarea");
    textarea.style.cssText = "width:100%;height:300px;padding:10px;margin-bottom:10px;font-size:16px;border-radius:5px;border:1px solid #ccc;";

    // 创建打开按钮
    var btn = document.createElement("button");
    btn.innerHTML = "全部跳转！";
    btn.style.cssText = "padding:10px 20px;margin:5px;background-color:#4CAF50;color:white;border:none;border-radius:5px;cursor:pointer;font-size:16px;";

    // 创建关闭按钮
    var close_btn = document.createElement("button");
    close_btn.innerHTML = "关闭";
    close_btn.style.cssText = "padding:10px 20px;margin:5px;background-color:#f44336;color:white;border:none;border-radius:5px;cursor:pointer;font-size:16px;";

    // 创建时间间隔输入框
    var time_input = document.createElement("input");
    time_input.type = "number";
    time_input.value = "500";
    time_input.style.cssText = "width:60px;padding:10px;margin:5px;font-size:16px;border-radius:5px;border:1px solid #ccc;text-align:center;";

    // 将元素添加到主容器
    div.appendChild(textarea);
    div.appendChild(btn);
    div.appendChild(close_btn);
    div.appendChild(time_input);

    // 将主容器添加到body
    document.body.appendChild(div);

    // 打开按钮点击事件
    btn.onclick = function () {
        var urls = textarea.value.split("\n").filter(url => url.trim() !== ""); // 过滤空行
        for (let i = 0; i < urls.length; i++) {
            setTimeout(() => {
                window.open(urls[i].trim());
            }, i * time_input.value); // 使用索引*i*时间间隔，避免一次性打开太多页面
        }
        document.body.removeChild(div);
    };

    // 关闭按钮点击事件
    close_btn.onclick = function () {
        document.body.removeChild(div);
    };
})();