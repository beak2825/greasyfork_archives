// ==UserScript==
// @name         网页浏览时间限制器
// @namespace    https://github.com/KNWking
// @version      0.0.5
// @description  控制特定网页的浏览时间
// @match        *://*/*
// @grant        none
// @license      GPL-3.0
// @downloadURL https://update.greasyfork.org/scripts/513300/%E7%BD%91%E9%A1%B5%E6%B5%8F%E8%A7%88%E6%97%B6%E9%97%B4%E9%99%90%E5%88%B6%E5%99%A8.user.js
// @updateURL https://update.greasyfork.org/scripts/513300/%E7%BD%91%E9%A1%B5%E6%B5%8F%E8%A7%88%E6%97%B6%E9%97%B4%E9%99%90%E5%88%B6%E5%99%A8.meta.js
// ==/UserScript==

(function () {
    'use strict';

    // 从 localStorage 获取管理的 URL 列表
    function getManagedUrls() {
        return JSON.parse(localStorage.getItem('managedUrls') || '[]');
    }

    // 保存管理的 URL 列表到 localStorage
    function saveManagedUrls(urls) {
        localStorage.setItem('managedUrls', JSON.stringify(urls));
    }

    // 检查当前页面是否需要管理时间
    function shouldManageCurrentPage() {
        const currentUrl = window.location.origin;
        return getManagedUrls().includes(currentUrl);
    }

    // 创建弹出框
    function createPopup(message, buttons) {
        const popup = document.createElement('div');
        popup.style.cssText = `
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            background: rgba(255, 255, 255, 0.5);
            backdrop-filter: blur(10px);
            -webkit-backdrop-filter: blur(10px);
            padding: 20px;
            border-radius: 13px;
            box-shadow: 0 4px 30px rgba(0, 0, 0, 0.1);
            z-index: 9999;
            text-align: center;
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Helvetica', 'Arial', sans-serif;
            min-width: 250px;
        `;
        popup.innerHTML = `<p style="font-size: 16px; color: #333; margin-bottom: 20px;">${message}</p>`;

        buttons.forEach(button => {
            const btn = document.createElement('button');
            btn.textContent = button.text;
            btn.onclick = () => {
                button.action();
                document.body.removeChild(popup);
            };
            btn.style.cssText = `
                background: rgba(0, 122, 255, 0.8);
                color: white;
                border: none;
                padding: 10px 20px;
                margin: 5px;
                border-radius: 6px;
                font-size: 14px;
                cursor: pointer;
                transition: all 0.3s;
            `;
            btn.onmouseover = () => {
                btn.style.background = 'rgba(0, 86, 179, 0.8)';
                btn.style.transform = 'scale(1.05)';
            };
            btn.onmouseout = () => {
                btn.style.background = 'rgba(0, 122, 255, 0.8)';
                btn.style.transform = 'scale(1)';
            };
            popup.appendChild(btn);
        });

        document.body.appendChild(popup);
    }

    // 设置定时器
    function setTimer(minutes) {
        return setTimeout(() => {
            const elapsedTime = Date.now() - startTime;
            const elapsedMinutes = Math.round(elapsedTime / 60000);

            createPopup(
                `规定的${minutes}分钟已经过去，您已经浏览了${elapsedMinutes}分钟。`,
                [
                    {
                        text: '延长时间',
                        action: () => promptForTime()
                    },
                    {
                        text: '关闭页面',
                        action: () => window.close()
                    }
                ]
            );
        }, minutes * 60000);
    }

    // 提示用户输入浏览时间
    function promptForTime() {
        createPopup(
            '请选择您想要浏览这个网页的时间：',
            [
                {text: '5分钟', action: () => startTimer(5)},
                {text: '10分钟', action: () => startTimer(10)},
                {text: '15分钟', action: () => startTimer(15)},
                {text: '30分钟', action: () => startTimer(30)},
                {text: '自定义', action: showCustomTimeInput}
            ]
        );
    }

    // 显示自定义时间输入界面
    function showCustomTimeInput() {
        const customTimePopup = document.createElement('div');
        customTimePopup.style.cssText = `
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            background: rgba(255, 255, 255, 0.5);
            backdrop-filter: blur(10px);
            -webkit-backdrop-filter: blur(10px);
            padding: 20px;
            border-radius: 13px;
            box-shadow: 0 4px 30px rgba(0, 0, 0, 0.1);
            z-index: 10000;
            text-align: center;
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Helvetica', 'Arial', sans-serif;
        `;

        customTimePopup.innerHTML = `
            <h3 style="margin-bottom: 15px;">设置自定义时间</h3>
            <p style="margin-bottom: 10px; color: #666; font-size: 14px;">
                请输入您想要浏览的时间<br>
                <strong style="color: #333;">（单位：分钟）</strong>
            </p>
            <input type="number" id="customTimeInput" min="1" step="1" value="5" style="
                width: 100px;
                padding: 5px;
                font-size: 16px;
                border: 1px solid #ccc;
                border-radius: 5px;
                text-align: center;
            ">
            <p style="margin: 10px 0; color: #666; font-size: 14px;">分钟</p>
        `;

        const confirmButton = document.createElement('button');
        confirmButton.textContent = '确认';
        confirmButton.style.cssText = `
            background: rgba(0, 122, 255, 0.8);
            color: white;
            border: none;
            padding: 8px 16px;
            margin: 5px;
            border-radius: 6px;
            font-size: 14px;
            cursor: pointer;
            transition: all 0.3s;
        `;
        confirmButton.onmouseover = () => {
            confirmButton.style.background = 'rgba(0, 86, 179, 0.8)';
            confirmButton.style.transform = 'scale(1.05)';
        };
        confirmButton.onmouseout = () => {
            confirmButton.style.background = 'rgba(0, 122, 255, 0.8)';
            confirmButton.style.transform = 'scale(1)';
        };
        confirmButton.onclick = () => {
            const customTime = document.getElementById('customTimeInput').value;
            if (customTime && !isNaN(customTime) && customTime > 0) {
                startTimer(parseInt(customTime));
                document.body.removeChild(customTimePopup);
            } else {
                alert('请输入有效的正整数！');
            }
        };

        customTimePopup.appendChild(confirmButton);
        document.body.appendChild(customTimePopup);
    }

    // 开始计时
    let timerHandle;
    let startTime;

    function startTimer(minutes) {
        if (timerHandle) {
            clearTimeout(timerHandle);
        }
        startTime = Date.now();
        timerHandle = setTimer(minutes);
    }

    // 添加当前网页到管理列表
    function addCurrentPage() {
        const currentUrl = window.location.origin;
        const managedUrls = getManagedUrls();
        if (!managedUrls.includes(currentUrl)) {
            managedUrls.push(currentUrl);
            saveManagedUrls(managedUrls);
            alert('当前网页已添加到时间管理列表');
        } else {
            alert('当前网页已在时间管理列表中');
        }
    }

    // 从管理列表中移除当前网页
    function removeCurrentPage() {
        const currentUrl = window.location.origin;
        let managedUrls = getManagedUrls();
        managedUrls = managedUrls.filter(url => url !== currentUrl);
        saveManagedUrls(managedUrls);
        alert('当前网页已从时间管理列表中移除');
    }

    // 创建控制面板
    function createControlPanel() {
        const panel = document.createElement('div');
        panel.style.cssText = `
            position: fixed;
            bottom: 20px;
            right: 20px;
            background: rgba(255, 255, 255, 0.4);
            backdrop-filter: blur(10px);
            -webkit-backdrop-filter: blur(10px);
            padding: 10px;
            border-radius: 10px;
            box-shadow: 0 4px 30px rgba(0, 0, 0, 0.1);
            z-index: 9998;
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Helvetica', 'Arial', sans-serif;
        `;

        const addButton = createButton('添加到管理', addCurrentPage);
        const removeButton = createButton('从管理中移除', removeCurrentPage);

        panel.appendChild(addButton);
        panel.appendChild(removeButton);

        document.body.appendChild(panel);
    }

    function createButton(text, onClick) {
        const button = document.createElement('button');
        button.textContent = text;
        button.onclick = onClick;
        button.style.cssText = `
            background: rgba(0, 122, 255, 0.6);
            color: white;
            border: none;
            padding: 8px 16px;
            margin: 5px;
            border-radius: 6px;
            font-size: 12px;
            cursor: pointer;
            transition: all 0.3s;
        `;
        button.onmouseover = () => {
            button.style.background = 'rgba(0, 86, 179, 0.6)';
            button.style.transform = 'scale(1.05)';
        };
        button.onmouseout = () => {
            button.style.background = 'rgba(0, 122, 255, 0.6)';
            button.style.transform = 'scale(1)';
        };
        return button;
    }

    // 初始化
    createControlPanel();
    if (shouldManageCurrentPage()) {
        promptForTime();
    }
})();
