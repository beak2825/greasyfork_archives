// ==UserScript==
// @name         TikTok 快捷回复管理器 (统一存储版)
// @namespace    http://tampermonkey.net/
// @version      2.0
// @description  【最终稳定版】根据用户要求，统一使用最初的存储键 'tiktok_quick_replies' 进行数据读写，不再进行任何迁移操作。代码更简洁，功能稳定。
// @author       Gemini & You
// @match        https://affiliate.tiktok.com/seller/im*
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_addStyle
// @run-at       document-idle
// @downloadURL https://update.greasyfork.org/scripts/543902/TikTok%20%E5%BF%AB%E6%8D%B7%E5%9B%9E%E5%A4%8D%E7%AE%A1%E7%90%86%E5%99%A8%20%28%E7%BB%9F%E4%B8%80%E5%AD%98%E5%82%A8%E7%89%88%29.user.js
// @updateURL https://update.greasyfork.org/scripts/543902/TikTok%20%E5%BF%AB%E6%8D%B7%E5%9B%9E%E5%A4%8D%E7%AE%A1%E7%90%86%E5%99%A8%20%28%E7%BB%9F%E4%B8%80%E5%AD%98%E5%82%A8%E7%89%88%29.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // --- 1. 配置与常量 ---
    // **核心改动**: 只定义并使用这一个存储键
    const STORAGE_KEY = 'tiktok_quick_replies';
    const INJECTION_PARENT_SELECTOR = 'div[data-e2e="3c045464-0434-940d"]';
    const INPUT_TEXTAREA_SELECTOR = 'textarea[data-e2e="798845f5-2eb9-0980"]';

    // --- 2. 样式中心 ---
    GM_addStyle(`
        ${INJECTION_PARENT_SELECTOR} { display: flex !important; flex-direction: column !important; height: 100% !important; }
        .quick-reply-container { margin-top: 20px; padding: 16px; border: 1px solid #eef0f2; border-radius: 8px; background-color: #ffffff; flex-grow: 1; display: flex; flex-direction: column; min-height: 0; }
        .qr-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 12px; flex-shrink: 0; }
        .qr-title { font-size: 16px; font-weight: 600; color: #161823; }
        .qr-btn { padding: 5px 12px; font-size: 13px; font-weight: 500; border-radius: 6px; cursor: pointer; border: 1px solid #007bff; background-color: #007bff; color: white; transition: background-color 0.2s, border-color 0.2s; }
        .qr-btn:hover { background-color: #0056b3; border-color: #0056b3; }
        .qr-list { flex-grow: 1; overflow-y: auto; display: flex; flex-direction: column; gap: 8px; padding-right: 5px; }
        .qr-item { display: flex; align-items: center; justify-content: space-between; padding: 10px; background-color: #f7f8fa; border-radius: 6px; flex-shrink: 0; transition: background-color 0.2s; }
        .qr-item:hover { background-color: #f0f2f5; }
        .qr-text { flex-grow: 1; cursor: pointer; white-space: pre-wrap; word-break: break-word; padding-right: 10px; font-size: 14px; color: #444; }
        .qr-text:hover { color: #007bff; }
        .qr-actions { display: flex; align-items: center; }
        .qr-actions button { background: none; border: none; cursor: pointer; font-size: 16px; margin-left: 8px; padding: 4px; border-radius: 50%; display: flex; align-items: center; justify-content: center; width: 28px; height: 28px; transition: background-color 0.2s; }
        .qr-actions button:hover { background-color: #e8e8e8; }
    `);

    // --- 3. 数据管理 ---
    let quickReplies = []; // 全局变量，用于存储当前会话的数据

    async function loadReplies() {
        const storedData = await GM_getValue(STORAGE_KEY, null);
        if (storedData) {
            return JSON.parse(storedData);
        }
        // 如果没有任何历史数据，则返回默认值
        return [
            '你好，很高兴与你合作！',
            '请问有什么可以帮助您？',
            '我们的标准运输时间是5-7个工作日。'
        ];
    }

    async function saveReplies() {
        await GM_setValue(STORAGE_KEY, JSON.stringify(quickReplies));
    }

    // --- 4. DOM 操作与事件处理 ---
    function renderList() {
        const list = document.querySelector('.qr-list');
        if (!list) return;
        list.innerHTML = '';
        quickReplies.forEach((text, index) => {
            const item = document.createElement('div');
            item.className = 'qr-item';
            item.innerHTML = `<span class="qr-text" title="点击回填">${text}</span><div class="qr-actions"><button class="qr-edit-btn" title="编辑">✏️</button><button class="qr-delete-btn" title="删除">🗑️</button></div>`;
            item.querySelector('.qr-text').addEventListener('click', () => fillInputBox(text));
            item.querySelector('.qr-edit-btn').addEventListener('click', () => editReply(index));
            item.querySelector('.qr-delete-btn').addEventListener('click', () => deleteReply(index));
            list.appendChild(item);
        });
    }

    function addReply() { const newReply = prompt("请输入新的快捷回复内容："); if (newReply && newReply.trim()) { quickReplies.unshift(newReply.trim()); saveReplies(); renderList(); } }
    function editReply(index) { const oldReply = quickReplies[index]; const newReply = prompt("请修改快捷回复内容：", oldReply); if (newReply && newReply.trim() && newReply.trim() !== oldReply) { quickReplies[index] = newReply.trim(); saveReplies(); renderList(); } }
    function deleteReply(index) { if (confirm(`确定要删除这条快捷回复吗？\n\n"${quickReplies[index]}"`)) { quickReplies.splice(index, 1); saveReplies(); renderList(); } }
    function fillInputBox(text) {
        const inputBox = document.querySelector(INPUT_TEXTAREA_SELECTOR);
        if (!inputBox) { alert("错误：未找到聊天输入框。"); return; }
        const nativeInputValueSetter = Object.getOwnPropertyDescriptor(window.HTMLTextAreaElement.prototype, 'value').set;
        nativeInputValueSetter.call(inputBox, text);
        const event = new Event('input', { bubbles: true });
        inputBox.dispatchEvent(event);
    }

    // --- 5. 注入与初始化 ---
    async function initializePanel(parentContainer) {
        // 先等待数据加载完毕
        quickReplies = await loadReplies();

        // 然后渲染面板
        const panel = document.createElement('div');
        panel.className = 'quick-reply-container';
        panel.innerHTML = `<div class="qr-header"><span class="qr-title">快捷回复</span><button id="qr-add-btn" class="qr-btn">新增</button></div><div class="qr-list"></div>`;
        parentContainer.appendChild(panel);
        document.getElementById('qr-add-btn').addEventListener('click', addReply);

        // 使用加载到的数据渲染列表
        renderList();
    }

    // --- 6. 启动与监控 ---
    function mainLoop() {
        const parentContainer = document.querySelector(INJECTION_PARENT_SELECTOR);
        if (!parentContainer) return;
        const myPanel = parentContainer.querySelector('.quick-reply-container');
        if (!myPanel) {
            initializePanel(parentContainer);
        } else if (parentContainer.lastElementChild !== myPanel) {
            parentContainer.appendChild(myPanel);
        }
    }

    setInterval(mainLoop, 500);

})();