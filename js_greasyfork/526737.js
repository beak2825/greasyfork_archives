// ==UserScript==
// @name         SmartPlay Token Login
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  快速使用Token登录SmartPlay
// @author       SmartPlay Helper
// @match        https://www.smartplay.lcsd.gov.hk/*
// @icon         https://www.smartplay.lcsd.gov.hk/favicon.ico
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/526737/SmartPlay%20Token%20Login.user.js
// @updateURL https://update.greasyfork.org/scripts/526737/SmartPlay%20Token%20Login.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 创建悬浮按钮
    const floatButton = document.createElement('button');
    floatButton.innerHTML = '🔑 Token登录';
    floatButton.style.cssText = `
        position: fixed;
        right: 20px;
        top: 20px;
        z-index: 9999;
        padding: 10px 20px;
        background-color: #4CAF50;
        color: white;
        border: none;
        border-radius: 5px;
        cursor: pointer;
        font-size: 14px;
        box-shadow: 0 2px 5px rgba(0,0,0,0.2);
    `;

    // 创建弹窗
    const modal = document.createElement('div');
    modal.style.cssText = `
        display: none;
        position: fixed;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        background-color: white;
        padding: 20px;
        border-radius: 8px;
        box-shadow: 0 2px 10px rgba(0,0,0,0.1);
        z-index: 10000;
        width: 400px;
        font-size: 13px;
    `;

    // 创建遮罩
    const overlay = document.createElement('div');
    overlay.style.cssText = `
        display: none;
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background-color: rgba(0,0,0,0.5);
        z-index: 9999;
    `;

    // 弹窗内容
    modal.innerHTML = `
        <h3 style="margin-top: 0; margin-bottom: 15px; color: #333; font-size: 15px;">Token登录</h3>
        <textarea id="tokenInput" placeholder="请输入Token" style="
            width: 100%;
            height: 80px;
            padding: 8px;
            margin: 10px 0;
            border: 1px solid #ddd;
            border-radius: 4px;
            box-sizing: border-box;
            resize: none;
            font-size: 13px;
            font-family: monospace;
        "></textarea>
        <div style="text-align: right; margin-top: 15px;">
            <button id="cancelBtn" style="
                padding: 6px 12px;
                margin-right: 10px;
                background-color: #f5f5f5;
                border: none;
                border-radius: 4px;
                cursor: pointer;
                font-size: 13px;
            ">取消</button>
            <button id="confirmBtn" style="
                padding: 6px 12px;
                background-color: #4CAF50;
                color: white;
                border: none;
                border-radius: 4px;
                cursor: pointer;
                font-size: 13px;
            ">确认</button>
        </div>
    `;

    // 添加元素到页面
    document.body.appendChild(floatButton);
    document.body.appendChild(overlay);
    document.body.appendChild(modal);

    // 显示弹窗
    function showModal() {
        overlay.style.display = 'block';
        modal.style.display = 'block';
        document.getElementById('tokenInput').focus();
    }

    // 隐藏弹窗
    function hideModal() {
        overlay.style.display = 'none';
        modal.style.display = 'none';
        document.getElementById('tokenInput').value = '';
    }

    // 处理Token登录
    function handleTokenLogin(token) {
        // 去除头尾空格和换行符
        token = token.replace(/^\s+|\s+$/g, '');

        if (!token) {
            alert('请输入Token');
            return;
        }

        // 设置Token到localStorage，添加Bearer前缀
        localStorage.setItem('webappaccessToken', `Bearer ${token}`);

        // 隐藏弹窗
        hideModal();

        // 刷新页面
        setTimeout(() => {
            window.location.reload();
        }, 500);
    }

    // 事件监听
    floatButton.addEventListener('click', showModal);
    overlay.addEventListener('click', hideModal);
    document.getElementById('cancelBtn').addEventListener('click', hideModal);
    document.getElementById('confirmBtn').addEventListener('click', () => {
        const token = document.getElementById('tokenInput').value.trim();
        handleTokenLogin(token);
    });

    // 添加回车键支持
    document.getElementById('tokenInput').addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            const token = e.target.value.trim();
            handleTokenLogin(token);
        }
    });

    // 鼠标悬停效果
    floatButton.addEventListener('mouseover', () => {
        floatButton.style.backgroundColor = '#45a049';
    });
    floatButton.addEventListener('mouseout', () => {
        floatButton.style.backgroundColor = '#4CAF50';
    });
})();