// ==UserScript==
// @name         Serv00 自动注册填写
// @namespace    http://tampermonkey.net/
// @version      1.2
// @description  自动填写serv00.com的注册信息
// @author       Your name
// @match        https://www.serv00.com/offer/create_new_account
// @grant        GM.setValue
// @grant        GM.getValue
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM.notification
// @grant        GM_notification
// @run-at       document-end
// @compatible	      Chrome
// @compatible	      Edge
// @compatible	      Firefox
// @compatible	      Safari
// @compatible	      Opera
// @downloadURL https://update.greasyfork.org/scripts/522157/Serv00%20%E8%87%AA%E5%8A%A8%E6%B3%A8%E5%86%8C%E5%A1%AB%E5%86%99.user.js
// @updateURL https://update.greasyfork.org/scripts/522157/Serv00%20%E8%87%AA%E5%8A%A8%E6%B3%A8%E5%86%8C%E5%A1%AB%E5%86%99.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 兼容不同脚本管理器的存储API
    const storage = {
        async setValue(key, value) {
            if (typeof GM_setValue !== 'undefined') {
                GM_setValue(key, value);
            } else if (typeof GM.setValue !== 'undefined') {
                await GM.setValue(key, value);
            } else {
                localStorage.setItem(key, JSON.stringify(value));
            }
        },
        async getValue(key, defaultValue) {
            if (typeof GM_getValue !== 'undefined') {
                return GM_getValue(key, defaultValue);
            } else if (typeof GM.getValue !== 'undefined') {
                return await GM.getValue(key, defaultValue);
            } else {
                const value = localStorage.getItem(key);
                return value ? JSON.parse(value) : defaultValue;
            }
        }
    };

    // 显示通知
    function showNotification(message, isError = false) {
        const title = isError ? '错误' : '提示';
        if (typeof GM_notification !== 'undefined') {
            GM_notification({
                text: message,
                title: title,
                timeout: 3000
            });
        } else if (typeof GM.notification !== 'undefined') {
            GM.notification({
                text: message,
                title: title,
                timeout: 3000
            });
        } else {
            alert(`${title}: ${message}`);
        }
    }

    // 生成随机字符串的函数
    function generateRandomString(length, includeNumbers = true) {
        const chars = 'abcdefghijklmnopqrstuvwxyz';
        const numbers = '0123456789';
        const allChars = includeNumbers ? chars + numbers : chars;
        let result = '';
        for (let i = 0; i < length; i++) {
            result += allChars.charAt(Math.floor(Math.random() * allChars.length));
        }
        return result;
    }

    // 生成随机用户信息
    function generateUserInfo() {
        const timestamp = new Date().getTime().toString().slice(-4);
        return {
            firstName: generateRandomString(6, false),
            lastName: generateRandomString(6, false),
            username: `user${timestamp}${generateRandomString(4)}`,
            email: "liuxianfeng2024@gmail.com",
            question: "Free"
        };
    }

    // 保存注册信息
    async function saveRegistrationInfo(info) {
        try {
            const savedData = await storage.getValue('serv00_registrations', []);
            savedData.push({
                ...info,
                timestamp: new Date().toISOString()
            });
            await storage.setValue('serv00_registrations', savedData);
            showNotification('注册信息已保存');
        } catch (error) {
            console.error('保存数据失败:', error);
            showNotification('保存数据失败', true);
        }
    }

    // 填写表单
    async function fillForm() {
        try {
            const userInfo = generateUserInfo();
            
            // 使用更可靠的选择器
            const selectors = {
                firstName: '#id_first_name',
                lastName: '#id_last_name',
                username: '#id_username',
                email: '#id_email',
                question: '#id_question'
            };

            // 填写表单
            for (const [key, selector] of Object.entries(selectors)) {
                const element = document.querySelector(selector);
                if (!element) {
                    throw new Error(`未找到元素: ${selector}`);
                }
                element.value = userInfo[key];
                // 触发change事件
                element.dispatchEvent(new Event('change', { bubbles: true }));
            }

            // 添加控制面板
            const controlPanel = document.createElement('div');
            controlPanel.style.cssText = `
                position: fixed;
                top: 10px;
                right: 10px;
                background: #fff;
                padding: 10px;
                border: 1px solid #ccc;
                border-radius: 5px;
                box-shadow: 0 2px 5px rgba(0,0,0,0.2);
                z-index: 9999;
            `;

            // 添加查看历史按钮
            const viewHistoryBtn = document.createElement('button');
            viewHistoryBtn.textContent = '查看注册历史';
            viewHistoryBtn.style.marginRight = '10px';
            viewHistoryBtn.onclick = async function() {
                const history = await storage.getValue('serv00_registrations', []);
                console.table(history);
                showNotification(`共有 ${history.length} 条注册记录`);
            };

            // 添加清除历史按钮
            const clearHistoryBtn = document.createElement('button');
            clearHistoryBtn.textContent = '清除历史记录';
            clearHistoryBtn.onclick = async function() {
                if (confirm('确定要清除所有历史记录吗？')) {
                    await storage.setValue('serv00_registrations', []);
                    showNotification('历史记录已清除');
                }
            };

            controlPanel.appendChild(viewHistoryBtn);
            controlPanel.appendChild(clearHistoryBtn);
            document.body.appendChild(controlPanel);

            // 监听表单提交
            const form = document.querySelector('form');
            if (form) {
                form.addEventListener('submit', function(e) {
                    saveRegistrationInfo(userInfo);
                });
            }

            showNotification('表单已自动填写完成');
        } catch (error) {
            console.error('填写表单失败:', error);
            showNotification(`填写表单失败: ${error.message}`, true);
        }
    }

    // 确保DOM加载完成后执行
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', fillForm);
    } else {
        fillForm();
    }
})(); 