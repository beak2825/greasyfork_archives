// ==UserScript==
// @name         Qwen Chat自动选择模型
// @namespace    http://tampermonkey.net/
// @version      1.0.0
// @description  Automatically select the model for Qwen Chat
// @author       tgxhx
// @license      MIT
// @match        https://chat.qwen.ai/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=qwen.ai
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        GM_registerMenuCommand
// @run-at       document-idle
// @downloadURL https://update.greasyfork.org/scripts/529202/Qwen%20Chat%E8%87%AA%E5%8A%A8%E9%80%89%E6%8B%A9%E6%A8%A1%E5%9E%8B.user.js
// @updateURL https://update.greasyfork.org/scripts/529202/Qwen%20Chat%E8%87%AA%E5%8A%A8%E9%80%89%E6%8B%A9%E6%A8%A1%E5%9E%8B.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 从配置中获取modelName
    let modelName = GM_getValue('modelName') || 'QwQ-32B';

    // 注册配置菜单
    GM_registerMenuCommand('设置目标模型名称', () => {
        const newModelName = prompt('请输入要自动选择的模型名称（默认：QwQ-32B）：', modelName);
        if (newModelName !== null) {
            modelName = newModelName;
            GM_setValue('modelName', newModelName);
            console.log(`[配置更新] 模型名称已更新为：${newModelName}`);
        }
    });

    function log(message) {
        console.log(`[${new Date().toISOString()}] ${message}`);
    }

    let intervalId; // 全局变量保存定时器ID

    // 主逻辑函数：每秒执行一次
    function mainLoop() {
        // 步骤1：查找元素A
        const elementA = document.querySelector('[aria-label="选择一个模型"][data-state] > div > div');

        if (elementA) {
            const currentText = elementA.textContent.trim();
            log(`元素A当前文本：${currentText}`);

            if (currentText === modelName) {
                log('元素A文本正确，清除定时器');
                clearInterval(intervalId); // 检测到正确时停止轮询
            } else {
                log('元素A文本不匹配，开始点击');
                elementA.click();

                // 步骤2：延迟200ms后查找菜单和目标元素B
                setTimeout(() => {
                    const menuContainer = document.querySelector('[role="menu"]');
                    if (menuContainer) {
                        log('找到菜单容器，开始查找目标元素B');

                        // 遍历菜单容器查找文本为"QwQ-32B"的元素
                        let targetElement = null;
                        menuContainer.querySelectorAll('*').forEach(el => {
                            if (modelName && el.textContent.trim() === modelName) {
                                targetElement = el;
                                return; // 找到后终止循环
                            }
                        });

                        if (targetElement) {
                            log('找到目标元素B，点击');
                            targetElement.click();
                        } else {
                            log('未找到目标元素B');
                        }
                    } else {
                        log('未找到菜单容器');
                    }
                }, 200);
            }
        } else {
            log('未找到元素A');
        }
    }

    setTimeout(() => {
        const newChatButton = document.getElementById('sidebar-new-chat-button');

        if (newChatButton) {
            log('找到"新建对话"按钮，开始监听点击事件');

            newChatButton.addEventListener('click', () => {
                log('检测到新建对话按钮点击，重新启动定时器');
                // 重新开启定时器
                intervalId = setInterval(mainLoop, 300);
                log('定时器已重新启动');
            });
        } else {
            log('未找到"新建对话"按钮');
        }
    }, 3000)

    // 初始化定时器（页面加载时先启动）
    log('页面加载完成，启动定时器');
    intervalId = setInterval(mainLoop, 500);
})();