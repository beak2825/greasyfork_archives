// ==UserScript==
// @name         获取阿里云盘token[2024最新适配版]
// @namespace    https://greasyfork.org/zh-CN/scripts/484492-%E8%8E%B7%E5%8F%96%E9%98%BF%E9%87%8C%E4%BA%91%E7%9B%98token-2024%E6%9C%80%E6%96%B0%E9%80%82%E9%85%8D%E7%89%88
// @version      1.1.2
// @description  🥰帮助各位快速获取阿里云盘的token😘
// @author       jacklove
// @license      MIT
// @match        https://www.alipan.com/drive
// @match        https://www.alipan.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=www.alipan.com
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/484492/%E8%8E%B7%E5%8F%96%E9%98%BF%E9%87%8C%E4%BA%91%E7%9B%98token%5B2024%E6%9C%80%E6%96%B0%E9%80%82%E9%85%8D%E7%89%88%5D.user.js
// @updateURL https://update.greasyfork.org/scripts/484492/%E8%8E%B7%E5%8F%96%E9%98%BF%E9%87%8C%E4%BA%91%E7%9B%98token%5B2024%E6%9C%80%E6%96%B0%E9%80%82%E9%85%8D%E7%89%88%5D.meta.js
// ==/UserScript==

(function() {
    'use strict';
    window.onload = function(){
        let token = JSON.parse(localStorage.token).refresh_token; // 获取token
        console.log(token);
        // 创建只读文本框
        var input = document.createElement("input");
        input.type = "text";
        input.readOnly = true;
        input.value = token;
        input.id = "token_value";
        // 添加样式
        input.style.width = "300px";
        input.style.padding = "10px";
        input.style.backgroundColor = "#f0f0f0";
        input.style.border = "1px solid black";
        input.style.marginRight = "10px";
        input.style.borderRadius="12px";
        // 创建复制按钮
        var button = document.createElement("button");
        button.innerText = "复制";
        button.addEventListener("click", function() {
            input.select();
            document.execCommand("copy");
            alert("已复制到剪贴板");
        });
        // 添加样式
        button.style.width = "100px";
        button.style.padding = "10px";
        button.style.backgroundColor = "#4CAF50";
        button.style.border = "none";
        button.style.color= "white";
        button.style.borderRadius="12px";
 
        // 创建包裹文本框和复制按钮的div
        var wrapper = document.createElement("div");
        wrapper.style.position = "fixed";
        wrapper.style.bottom = "0";
        wrapper.style.right = "50%"; // 调整右侧位置到中间
        wrapper.style.transform = "translateX(50%)"; // 将div水平居中
        wrapper.style.width = "350px";
        wrapper.style.display = "flex";
        wrapper.style.justifyContent = "space-between";
        wrapper.style.alignItems = "center";
        wrapper.style.zIndex = "9999";
        // 将文本框和复制按钮添加至包裹div中
        wrapper.appendChild(input);
        wrapper.appendChild(button);
        // 将包裹div添加至页面中
        document.body.appendChild(wrapper);
    }
})();
