// ==UserScript==
// @name         虎牙弹幕屏蔽
// @namespace    http://tampermonkey.net/
// @version      2.2
// @description  屏蔽
// @author       Mike
// @license      CC BY-NC-ND 4.0
// @match        https://www.huya.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/518336/%E8%99%8E%E7%89%99%E5%BC%B9%E5%B9%95%E5%B1%8F%E8%94%BD.user.js
// @updateURL https://update.greasyfork.org/scripts/518336/%E8%99%8E%E7%89%99%E5%BC%B9%E5%B9%95%E5%B1%8F%E8%94%BD.meta.js
// ==/UserScript==
/*
此代码使用 CC BY-NC-ND 4.0 协议授权：
- 允许复制和共享代码，但必须注明作者。
- 禁止将代码用于商业用途。
- 禁止修改、重新分发修改版代码，除非获得作者的明确许可。

详情请查看：https://creativecommons.org/licenses/by-nc-nd/4.0/
*/


(function() {
    'use strict';

    // 创建并美化GUI界面
    const guiContainer = document.createElement('div');
    guiContainer.style.position = 'fixed';
    guiContainer.style.bottom = '50px'; // 调整位置避免与按钮重叠
    guiContainer.style.right = '10px';
    guiContainer.style.backgroundColor = '#fff';
    guiContainer.style.border = '1px solid #ccc';
    guiContainer.style.padding = '10px';
    guiContainer.style.zIndex = '9999';
    guiContainer.style.fontSize = '14px';
    guiContainer.style.boxShadow = '0 0 10px rgba(0, 0, 0, 0.2)';
    guiContainer.style.display = 'none'; // 初始状态隐藏
    document.body.appendChild(guiContainer);

    const title = document.createElement('div');
    title.textContent = '屏蔽关键词设置';
    title.style.fontWeight = 'bold';
    guiContainer.appendChild(title);

    const input = document.createElement('input');
    input.type = 'text';
    input.placeholder = '输入关键词，用逗号分隔';
    input.style.width = '200px';
    guiContainer.appendChild(input);

    const button = document.createElement('button');
    button.textContent = '保存';
    button.style.marginLeft = '10px';
    guiContainer.appendChild(button);

    // 创建GUI开关按钮
    const toggleButton = document.createElement('button');
    toggleButton.textContent = '+';
    toggleButton.style.position = 'fixed';
    toggleButton.style.bottom = '10px';
    toggleButton.style.right = '10px';
    toggleButton.style.zIndex = '10000';
    toggleButton.style.fontSize = '20px';
    toggleButton.style.backgroundColor = '#007bff';
    toggleButton.style.color = '#fff';
    toggleButton.style.border = 'none';
    toggleButton.style.padding = '5px 10px';
    toggleButton.style.cursor = 'pointer';
    document.body.appendChild(toggleButton);

    toggleButton.addEventListener('click', () => {
        guiContainer.style.display = guiContainer.style.display === 'none' ? 'block' : 'none';
    });

    // 获取屏蔽关键词列表
    const getKeywords = () => {
        return (localStorage.getItem('blockKeywords') || '').split(',').map(k => k.trim()).filter(k => k);
    };

    // 保存关键词
    button.addEventListener('click', () => {
        const keywords = input.value.split(',').map(k => k.trim());
        localStorage.setItem('blockKeywords', keywords.join(','));
        alert('关键词已保存！');
    });

    // 初始化输入框
    input.value = localStorage.getItem('blockKeywords') || '';

    // 实时移除弹幕并处理聊天室同步
    const observer = new MutationObserver(() => {
        const keywords = getKeywords();
        const danmuContainer = document.querySelector('#danmudiv');
        if (!danmuContainer) return;

        const danmus = danmuContainer.querySelectorAll('.danmu-item');
        danmus.forEach(danmu => {
            const text = danmu.innerText || '';
            if (keywords.some(keyword => text.includes(keyword))) {
                // 从DOM中移除弹幕元素
                danmu.remove();

                // 同步处理聊天室
                const chatXPath = "/html/body/div[1]/div/div[2]/div/div[2]/div/div[3]/div[1]/div[2]/div/div[3]/div/div[6]/div[2]/div";
                const chatElement = document.evaluate(chatXPath, document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
                if (chatElement) {
                    const chatMessages = chatElement.querySelectorAll('div');
                    chatMessages.forEach(chatMessage => {
                        if (chatMessage.innerText.includes(text)) {
                            chatMessage.style.backgroundColor = 'rgba(255, 0, 0, 0.2)'; // 设置淡红色背景
                        }
                    });
                }
            }
        });
    });

    // 开始监听弹幕容器
    const startObserver = () => {
        const danmuContainer = document.querySelector('#danmudiv');
        if (danmuContainer) {
            observer.observe(danmuContainer, { childList: true, subtree: true });
        } else {
            setTimeout(startObserver, 1000); // 如果容器未加载，1秒后重试
        }
    };

    startObserver();

    // 新手提示，首次安装脚本时展示
    if (!localStorage.getItem('firstTimeUser')) {
        const guideOverlay = document.createElement('div');
        guideOverlay.style.position = 'fixed';
        guideOverlay.style.top = '0';
        guideOverlay.style.left = '0';
        guideOverlay.style.width = '100%';
        guideOverlay.style.height = '100%';
        guideOverlay.style.backgroundColor = 'rgba(0, 0, 0, 0.7)';
        guideOverlay.style.zIndex = '10001';
        guideOverlay.style.color = '#fff';
        guideOverlay.style.display = 'flex';
        guideOverlay.style.flexDirection = 'column';
        guideOverlay.style.justifyContent = 'center';
        guideOverlay.style.alignItems = 'center';
        guideOverlay.style.fontSize = '20px';
        guideOverlay.style.textAlign = 'center';
        guideOverlay.innerHTML = `
            <div>欢迎使用虎牙弹幕屏蔽优化脚本！</div>
            <div style="margin-top: 20px;">点击右下角的“+”按钮以设置屏蔽关键词。</div>
            <div style="margin-top: 20px;">屏蔽词用英文逗号分隔</div>
            <div style="margin-top: 20px">被屏蔽的弹幕会在聊天室用淡红色背景标出</div>
            <button style="margin-top: 30px; padding: 10px 20px; font-size: 18px; cursor: pointer;">我知道了</button>
        `;
        document.body.appendChild(guideOverlay);

        guideOverlay.querySelector('button').addEventListener('click', () => {
            guideOverlay.remove();
            localStorage.setItem('firstTimeUser', 'true');
        });
    }
})();