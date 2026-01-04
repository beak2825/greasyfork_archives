// ==UserScript==
// @name         Shanxi GSPX Online Auto-click Unlearned
// @namespace    http://tampermonkey.net/
// @version      6.3
// @description  陕西省高校教师岗前培训暨教师资格教育基础理论知识培训，自动查找并点击“未达标”课程中的“前往学习”链接，直到所有课程达标。
// @author       大老粗
// @match        http://shanxigs.gspxonline.com/*
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/512926/Shanxi%20GSPX%20Online%20Auto-click%20Unlearned.user.js
// @updateURL https://update.greasyfork.org/scripts/512926/Shanxi%20GSPX%20Online%20Auto-click%20Unlearned.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const WAIT_TIME = 10000; // 通用等待时间
    const LONG_WAIT_TIME = 18000000; // 5小时的等待时间

    // 创建状态窗口
    function createStatusWindow() {
        const statusDiv = document.createElement('div');
        statusDiv.id = 'scriptStatusWindow';
        statusDiv.style.cssText = `
            position: fixed; top: 10px; right: 10px; width: 250px; height: 150px;
            background-color: rgba(0, 0, 0, 0.8); color: white; font-size: 14px;
            padding: 10px; z-index: 9999; border-radius: 8px; text-align: left;
        `;
        statusDiv.innerHTML = `<strong>脚本运行状态</strong><br>初始化...`;
        document.body.appendChild(statusDiv);
    }

    // 更新状态窗口的内容
    function updateStatus(message) {
        const statusDiv = document.getElementById('scriptStatusWindow');
        if (statusDiv) {
            statusDiv.innerHTML = `<strong>脚本运行状态</strong><br>${message}`;
        }
    }

    // 处理弹出窗口
    async function handlePopup() {
        updateStatus('正在处理弹出窗口...');
        const confirmButton = document.querySelector('button[data-bb-handler="success"]');
        if (confirmButton) {
            confirmButton.click();
            updateStatus('已点击确认按钮，页面加载中...');
            await new Promise(resolve => setTimeout(resolve, WAIT_TIME));
        }
    }

    // 查找并点击未达标课程
    async function clickUnqualifiedCourse() {
        updateStatus('正在查找 "未达标" 的课程...');

        // 查找包含“未达标”文本的 <tr> 行
        const unqualifiedCourses = Array.from(document.querySelectorAll('tr'))
            .filter(row => row.textContent.includes('未达标'));

        updateStatus(`找到 "未达标" 的课程数量: ${unqualifiedCourses.length}`);

        if (unqualifiedCourses.length > 0) {
            const firstCourse = unqualifiedCourses[0];

            // 查找包含 "前往学习" 的 <a> 链接
            const studyLink = firstCourse.querySelector('a.btn.btn-primary');

            if (studyLink) {
                updateStatus('找到 "前往学习" 链接，正在模拟点击...');

                // 手动触发鼠标点击事件
                simulateClick(studyLink);

                await new Promise(resolve => setTimeout(resolve, LONG_WAIT_TIME));
                await handlePopup(); // 刷新前再次处理弹出窗口
                location.reload();
                return true;
            } else {
                updateStatus('未找到 "前往学习" 链接。');
            }
        } else {
            updateStatus('未找到 "未达标" 的课程。');
        }

        return false;
    }

    // 模拟点击函数，创建鼠标事件
    function simulateClick(element) {
        const rect = element.getBoundingClientRect();
        const clickEvent = new MouseEvent('click', {
            view: window,
            bubbles: true,
            cancelable: true,
            clientX: rect.left + rect.width / 2,
            clientY: rect.top + rect.height / 2
        });
        element.dispatchEvent(clickEvent);  // 触发点击事件
        console.log('模拟点击已发送至元素:', element);
    }

    // 主程序
    async function main() {
        createStatusWindow();
        while (true) {
            const isUnqualified = await clickUnqualifiedCourse();
            if (!isUnqualified) {
                updateStatus('所有课程已达标或未找到未达标课程。');
                break;
            }
            await handlePopup(); // 处理可能出现的弹出窗口
        }
    }

    window.addEventListener('load', main);
})();