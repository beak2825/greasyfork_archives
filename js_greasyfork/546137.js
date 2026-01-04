// ==UserScript==
// @name         GPT5/GPT4账号池--免费GPT5-mini/GPT4o镜像车队服务！👍（使用前先看使用说明）
// @namespace    失效联系V：caicats
// @version      1.1
// @description  让每一个都能使用上ChatGPT，本脚本在国内提供免费的GPT5-mini模型使用，如需更好体验可订阅付费系统：https://afdian.com/a/warmo
// @match        https://gpt.github.cn.com/*
// @grant        none
// @license MIT
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/546137/GPT5GPT4%E8%B4%A6%E5%8F%B7%E6%B1%A0--%E5%85%8D%E8%B4%B9GPT5-miniGPT4o%E9%95%9C%E5%83%8F%E8%BD%A6%E9%98%9F%E6%9C%8D%E5%8A%A1%EF%BC%81%F0%9F%91%8D%EF%BC%88%E4%BD%BF%E7%94%A8%E5%89%8D%E5%85%88%E7%9C%8B%E4%BD%BF%E7%94%A8%E8%AF%B4%E6%98%8E%EF%BC%89.user.js
// @updateURL https://update.greasyfork.org/scripts/546137/GPT5GPT4%E8%B4%A6%E5%8F%B7%E6%B1%A0--%E5%85%8D%E8%B4%B9GPT5-miniGPT4o%E9%95%9C%E5%83%8F%E8%BD%A6%E9%98%9F%E6%9C%8D%E5%8A%A1%EF%BC%81%F0%9F%91%8D%EF%BC%88%E4%BD%BF%E7%94%A8%E5%89%8D%E5%85%88%E7%9C%8B%E4%BD%BF%E7%94%A8%E8%AF%B4%E6%98%8E%EF%BC%89.meta.js
// ==/UserScript==

(function() {
    'use strict';

    
    function fillAuthCode() {
        const input = document.querySelector('#password');
        if (!input) {
            alert("未找到授权码输入框！");
            return;
        }
        const val = "GPTDSB";
        input.value = val;

        input.dispatchEvent(new Event("input", { bubbles: true }));
        input.dispatchEvent(new Event("change", { bubbles: true }));

        alert("已破解填充授权码！");
    }

    function addButton() {
        if (document.getElementById("autoFillBtn")) return;
        const btn = document.createElement("button");
        btn.id = "autoFillBtn";
        btn.innerText = "点我破解自动填充授权码";
        btn.style.cssText = `
            margin: 10px 0;
            background-color: #4CAF50;
            color: white;
            padding: 8px 16px;
            border: none;
            border-radius: 6px;
            cursor: pointer;
            font-size: 14px;
        `;
        btn.onclick = fillAuthCode;

        const continueBtn = [...document.querySelectorAll("button")].find(b => b.innerText.includes("继续"));
        if (continueBtn && continueBtn.parentNode) {
            continueBtn.parentNode.insertBefore(btn, continueBtn);
        } else {
            document.body.appendChild(btn);
        }
    }

    
    function addFloatingImage() {
        const floatDiv = document.createElement('div');
        floatDiv.style.cssText = `
            position: fixed;
            right: 20px;
            bottom: 20px;
            z-index: 9999;
            cursor: pointer;
        `;

        const iconImg = document.createElement('img');
        iconImg.src = 'https://i.postimg.cc/9fWYc7nT/image.jpg'; 
        iconImg.style.width = '300px';
        iconImg.style.height = '176px';

        floatDiv.appendChild(iconImg);
        document.body.appendChild(floatDiv);

        floatDiv.addEventListener('click', function() {
            window.location.href = 'http://h5ma.cn/jiaoben';
        });
    }

    
    window.addEventListener("load", () => {
        if (location.pathname.startsWith("/login")) {
            addButton();  
        } else if (location.pathname === "/" || location.pathname === "") {
            addFloatingImage();  
        }
    });
})();
