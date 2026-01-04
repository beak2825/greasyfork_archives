// ==UserScript==
// @name         白嫖GPT网站模型次数、突破4o模型次数限制 直接续杯🔫 （使用前看说明）
// @namespace    https://afdian.com/a/warmo
// @version      1.1
// @description  突破特定网站上面GPT-4o模型次数限制,直接续杯🐎。因脚本特殊性可能会失效，失效请访问：https://afdian.com/a/warmo 使用
// @author       xlike，caicats
// @match        https://aichatru.ru/*
// @match        https://gpt4o.so/*
// @match        https://finechat.ai/*
// @match        https://gpt4o.so/zh-CN/app
// @icon         https://t1.gstatic.cn/faviconV2?client=SOCIAL&type=FAVICON&fallback_opts=TYPE,SIZE,URL&size=32&url=https://chatgpt.com
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/515897/%E7%99%BD%E5%AB%96GPT%E7%BD%91%E7%AB%99%E6%A8%A1%E5%9E%8B%E6%AC%A1%E6%95%B0%E3%80%81%E7%AA%81%E7%A0%B44o%E6%A8%A1%E5%9E%8B%E6%AC%A1%E6%95%B0%E9%99%90%E5%88%B6%20%E7%9B%B4%E6%8E%A5%E7%BB%AD%E6%9D%AF%F0%9F%94%AB%20%EF%BC%88%E4%BD%BF%E7%94%A8%E5%89%8D%E7%9C%8B%E8%AF%B4%E6%98%8E%EF%BC%89.user.js
// @updateURL https://update.greasyfork.org/scripts/515897/%E7%99%BD%E5%AB%96GPT%E7%BD%91%E7%AB%99%E6%A8%A1%E5%9E%8B%E6%AC%A1%E6%95%B0%E3%80%81%E7%AA%81%E7%A0%B44o%E6%A8%A1%E5%9E%8B%E6%AC%A1%E6%95%B0%E9%99%90%E5%88%B6%20%E7%9B%B4%E6%8E%A5%E7%BB%AD%E6%9D%AF%F0%9F%94%AB%20%EF%BC%88%E4%BD%BF%E7%94%A8%E5%89%8D%E7%9C%8B%E8%AF%B4%E6%98%8E%EF%BC%89.meta.js
// ==/UserScript==
(function() {
    'use strict';
    // 创建并插入续杯按钮
    const button = document.createElement('button');
    button.innerText = '续杯';
    button.style.position = 'fixed';
    button.style.right = '20px';
    button.style.top = '80px';
    button.style.padding = '10px 20px';
    button.style.fontSize = '16px';
    button.style.backgroundColor = '#007bff';
    button.style.color = '#fff';
    button.style.border = 'none';
    button.style.borderRadius = '5px';
    button.style.cursor = 'pointer';
    button.style.boxShadow = '0 4px 8px rgba(0, 0, 0, 0.2)';
    button.style.zIndex = '1000';
    document.body.appendChild(button);

    // 创建并插入付费库按钮
    const payButton = document.createElement('button');
    payButton.innerText = '付费库';
    payButton.style.position = 'fixed';
    payButton.style.right = '20px';
    payButton.style.top = '140px';
    payButton.style.padding = '10px 20px';
    payButton.style.fontSize = '16px';
    payButton.style.backgroundColor = '#28a745';
    payButton.style.color = '#fff';
    payButton.style.border = 'none';
    payButton.style.borderRadius = '5px';
    payButton.style.cursor = 'pointer';
    payButton.style.boxShadow = '0 4px 8px rgba(0, 0, 0, 0.2)';
    payButton.style.zIndex = '1000';
    document.body.appendChild(payButton);

    // 付费库按钮点击事件
    payButton.addEventListener('click', function() {
        window.location.href = 'https://afdian.com/a/warmo';  // 跳转到付费页面
    });

    // 生成与旧值长度相同的随机字符串
    function generateRandomUniqueId(length) {
        return Array(length).fill(0).map(() => Math.random().toString(36).charAt(2)).join('');
    }

    // 删除cookie的方法，只使用cookie名称
    function deleteCookie(name) {
        document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 GMT; domain=aichatru.ru; path=/`;
    }

    // 获取cookie的方法
    function getCookie(name) {
        const cookies = document.cookie.split(';').map(cookie => cookie.trim());
        for (const cookie of cookies) {
            const [cookieName, cookieValue] = cookie.split('=');
            if (cookieName === name) {
                return cookieValue;
            }
        }
        return null;
    }

    // 修改uniqueId的方法
    function updateUniqueId() {
        const oldUniqueId = getCookie('uniqueId');
        if (oldUniqueId) {
            deleteCookie('uniqueId');
            const newUniqueId = generateRandomUniqueId(oldUniqueId.length);
            document.cookie = `uniqueId=${newUniqueId};`;
            alert("续杯成功");
        } else {
            alert("续杯失败");
        }
    }

    // 点击续杯按钮时更新uniqueId
    button.addEventListener('click', updateUniqueId);
})();

// 新增的浮动图标功能
function addFloatingIcon() {
    console.log("Floating Icon Function Called");
    var floatDiv = document.createElement('div');
    floatDiv.style.position = 'fixed';
    floatDiv.style.top = '30px';
    floatDiv.style.right = '48px';
    floatDiv.style.zIndex = '9999';
    floatDiv.style.width = '30px';
    floatDiv.style.height = '30px';
    floatDiv.style.borderRadius = '50%';
    floatDiv.style.background = '#fff';
    floatDiv.style.cursor = 'pointer';
    floatDiv.style.display = 'flex';
    floatDiv.style.alignItems = 'center';
    floatDiv.style.justifyContent = 'center';

    var iconImg = document.createElement('img');
    iconImg.src = 'https://i.postimg.cc/nct7nCBL/5454.png';
    iconImg.style.width = '26px';
    iconImg.style.height = '26px';

    floatDiv.appendChild(iconImg);
    document.body.appendChild(floatDiv);

    // 点击事件，跳转到指定页面
    floatDiv.addEventListener('click', function() {
        window.location.href = 'https://h5ma.cn/caicats';
    });
}

// 确保页面加载完成后执行浮动图标功能
window.addEventListener('load', function() {
    addFloatingIcon();
});
