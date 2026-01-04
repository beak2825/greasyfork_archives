// ==UserScript==
// @name         惠州学院教务 - 学生评价
// @namespace    http://tampermonkey.net/
// @version      1.1
// @description  只保留“一键填写本页”功能，并使用优雅的非阻塞Toast提示框，提供最佳用户体验。
// @author       Google
// @match        https://jwxt.hzu.edu.cn/xspjgl/*
// @icon         https://jwxt.hzu.edu.cn/favicon.ico
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/539750/%E6%83%A0%E5%B7%9E%E5%AD%A6%E9%99%A2%E6%95%99%E5%8A%A1%20-%20%E5%AD%A6%E7%94%9F%E8%AF%84%E4%BB%B7.user.js
// @updateURL https://update.greasyfork.org/scripts/539750/%E6%83%A0%E5%B7%9E%E5%AD%A6%E9%99%A2%E6%95%99%E5%8A%A1%20-%20%E5%AD%A6%E7%94%9F%E8%AF%84%E4%BB%B7.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // --- 配置区 ---
    const DELAY_CONFIG = {
        BETWEEN_RADIOS_MIN: 80,  BETWEEN_RADIOS_MAX: 250,
        PER_CHARACTER_MIN: 40,   PER_CHARACTER_MAX: 90,
    };
    const GOOD_COMMENTS = [
        "老师教学态度认真，治学严谨，授课内容丰富，深入浅出，非常感谢老师的辛勤付出！",
        "老师讲课思路清晰，语言风趣幽默，课堂气氛活跃，使我们对这门课产生了浓厚的兴趣。",
        "老师非常负责，对学生既严格要求又亲切和蔼，是我们的良师益友。",
        "课程内容充实，案例丰富，老师的讲解总能抓住重点，让我们受益匪浅。",
    ];

    // --- 核心工具函数 ---
    const sleep = ms => new Promise(resolve => setTimeout(resolve, ms));
    const randomDelay = (min, max) => sleep(Math.floor(Math.random() * (max - min + 1)) + min);
    const getRandomComment = () => GOOD_COMMENTS[Math.floor(Math.random() * GOOD_COMMENTS.length)];
    async function simulateTyping(element, text) {
        element.value = '';
        for (const char of text) {
            element.value += char;
            element.dispatchEvent(new Event('input', { bubbles: true }));
            await randomDelay(DELAY_CONFIG.PER_CHARACTER_MIN, DELAY_CONFIG.PER_CHARACTER_MAX);
        }
    }

    /**
     * 【新功能】显示一个优雅的、非阻塞的Toast提示
     */
    function showToast(message, duration = 3000) {
        const toast = document.createElement('div');
        toast.id = 'hzu-toast-notification';
        toast.innerHTML = message;
        toast.style.cssText = `
            position: fixed;
            top: 20px;
            left: 50%;
            transform: translate(-50%, -50px);
            background-color: #4CAF50;
            color: white;
            padding: 12px 20px;
            border-radius: 8px;
            z-index: 10000;
            font-size: 16px;
            box-shadow: 0 4px 10px rgba(0,0,0,0.2);
            opacity: 0;
            transition: all 0.5s cubic-bezier(0.25, 0.8, 0.25, 1);
        `;
        document.body.appendChild(toast);

        // 触发滑入动画
        setTimeout(() => {
            toast.style.opacity = '1';
            toast.style.transform = 'translate(-50%, 0)';
        }, 10);

        // 在指定时间后触发滑出并移除
        setTimeout(() => {
            toast.style.opacity = '0';
            toast.style.transform = 'translate(-50%, -50px)';
            setTimeout(() => toast.remove(), 500); // 等动画结束后再移除
        }, duration);
    }


    /**
     * 核心功能：填写当前页面的表单
     */
    async function fillThisPage() {
        const fillButton = document.getElementById('hzu-fill-page-btn');
        if (fillButton) {
            fillButton.disabled = true;
            fillButton.innerHTML = '...正在填写...';
        }

        console.log("收到指令，开始拟人化填写本页...");
        const excellentRadios = document.querySelectorAll('.input-xspj-1 input[type="radio"]');
        for (const radio of excellentRadios) {
            if (!radio.checked) {
                radio.click();
                await randomDelay(DELAY_CONFIG.BETWEEN_RADIOS_MIN, DELAY_CONFIG.BETWEEN_RADIOS_MAX);
            }
        }

        const textarea = document.querySelector('textarea.input-zgpj');
        if (textarea) {
            await simulateTyping(textarea, getRandomComment());
        } else {
            console.error("错误：未能找到评语输入框！");
        }

        console.log("填写完成！请手动点击“保存”。");

        showToast("填写完成！请手动点击“保存”。");
        // --- 核心修改点结束 ---

        if (fillButton) {
            fillButton.innerHTML = '✅ 填写完成';
        }
    }

    /**
     * 哨兵函数：根据页面状态，决定是否创建或销毁“一键填写”按钮
     */
    function manageFillButton() {
        const isFormVisible = document.querySelector('#btn_xspj_bc');
        const fillButton = document.getElementById('hzu-fill-page-btn');

        if (isFormVisible && !fillButton) {
            const newButton = document.createElement('button');
            newButton.id = 'hzu-fill-page-btn';
            newButton.innerHTML = '📝 一键填写本页';
            newButton.title = '一键填写本页所有选项和评语';
            newButton.style.cssText = `
                position: fixed; top: 100px; right: 20px; z-index: 9999;
                padding: 12px 22px; font-size: 18px; background-color: #2196F3;
                color: white; border: none; border-radius: 8px; cursor: pointer;
                box-shadow: 0 5px 10px rgba(0,0,0,0.2); transition: all 0.3s;
            `;
            newButton.addEventListener('click', fillThisPage);
            document.body.appendChild(newButton);
        }
        else if (!isFormVisible && fillButton) {
            fillButton.remove();
        }
    }

    // --- 脚本启动入口 ---
    console.log("惠州学院教务系统 - 评价页一键填写脚本已启动。");
    const observer = new MutationObserver(manageFillButton);
    observer.observe(document.body, { childList: true, subtree: true });
    manageFillButton();

})();