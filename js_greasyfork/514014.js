// ==UserScript==
// @name         手动获取ChatGPT RT
// @namespace    http://tampermonkey.net/
// @version      3.2
// @description  打开登录页面并在特定URL时弹出提示，提示用户打开开发者工具，点击任意处关闭弹窗或等待倒计时自动关闭。弹窗只出现一次，并保留登录按钮。
// @author       XYHELPER
// @match        *://*/*
// @grant        GM_xmlhttpRequest
// @license      ChatGPT4V
// @grant        GM_openInTab
// @grant        GM_registerMenuCommand
// @grant        window.close
// @connect      login.closeai.biz
// @downloadURL https://update.greasyfork.org/scripts/514014/%E6%89%8B%E5%8A%A8%E8%8E%B7%E5%8F%96ChatGPT%20RT.user.js
// @updateURL https://update.greasyfork.org/scripts/514014/%E6%89%8B%E5%8A%A8%E8%8E%B7%E5%8F%96ChatGPT%20RT.meta.js
// ==/UserScript==

(function() {
    'use strict';

    let hasShownPopup = false; // 用于确保弹窗只显示一次

    // 创建弹窗
    function createPopup() {
        const modal = document.createElement('div');
        modal.style.position = 'fixed';
        modal.style.top = '35%'; // 垂直居中
        modal.style.left = '50%'; // 水平居中
        modal.style.transform = 'translate(-50%, -50%)'; // 中心偏移
        modal.style.backgroundColor = 'rgba(0, 0, 0, 0.8)';
        modal.style.color = 'white';
        modal.style.padding = '15px';
        modal.style.borderRadius = '8px';
        modal.style.zIndex = '10000';
        modal.style.boxShadow = '0 2px 10px rgba(0, 0, 0, 0.5)';
        modal.style.cursor = 'pointer';
        modal.style.maxWidth = '80%'; // 最大宽度，确保在小屏幕下也能显示完整

        // 添加提示文本
        const tipText = document.createElement('p');
        tipText.textContent = '请按F12 获取返回参数';
        tipText.style.fontSize = '14px';
        tipText.style.color = 'rgba(255, 255, 255, 0.9)';
        tipText.style.margin = '0';
        modal.appendChild(tipText);

        // 将弹窗添加到页面中
        document.body.appendChild(modal);

        // 创建点击外部关闭弹窗的功能
        function handleOutsideClick(event) {
            if (!modal.contains(event.target)) {
                closeModal();
            }
        }

        // 关闭弹窗的功能
        function closeModal() {
            if (document.body.contains(modal)) {
                document.body.removeChild(modal);
                document.removeEventListener('click', handleOutsideClick);
            }
        }

        // 监听点击事件，检测点击是否在弹窗外部
        setTimeout(() => {
            document.addEventListener('click', handleOutsideClick);
        }, 0); // 延迟0毫秒确保事件绑定后再执行

        // 设置倒计时三秒后自动关闭弹窗
        setTimeout(() => {
            closeModal();
        }, 2000); // 2000毫秒 = 2秒
    }

    // 监控URL变化，当URL匹配时显示弹窗
    function monitorUrl() {
        const url = window.location.href;
        if (!hasShownPopup && url.startsWith('https://auth0.openai.com/u/login/identifier?state=')) {
            createPopup(); // 打开页面后显示弹窗
            hasShownPopup = true; // 标记弹窗已显示，防止重复弹出
        }
    }

    // 每隔一段时间检测URL变化
    setInterval(monitorUrl, 1000); // 每秒检测一次URL变化

    // 注册“打开登录链接”按钮
    GM_registerMenuCommand("打开登录链接", () => {
        // 获取当前标签页的 window 对象
        const currentWindow = window;

        // 打开登录页面
        GM_openInTab("https://login.closeai.biz", {active: true});

        // 使用 GM_xmlhttpRequest 获取页面内容
        GM_xmlhttpRequest({
            method: "GET",
            url: "https://login.closeai.biz",
            onload: function(response) {
                // 解析返回的HTML
                const parser = new DOMParser();
                const doc = parser.parseFromString(response.responseText, "text/html");

                // 查找id为url的div元素
                const urlDiv = doc.querySelector("#url");
                if (urlDiv) {
                    const newUrl = urlDiv.textContent.trim(); // 获取里面的文本内容
                    console.log("获取到的URL:", newUrl);
                    if (newUrl.startsWith("https://")) {
                        // 打开新的链接并在新标签页中显示
                        GM_openInTab(newUrl, {active: true});

                        // 关闭当前原始标签页
                        currentWindow.close();
                    } else {
                        alert("无法获取有效的URL");
                    }
                } else {
                    alert("未能找到包含URL的div元素");
                }
            },
            onerror: function() {
                alert("无法加载登录页面，请稍后再试。");
            }
        });
    });

})();
