// ==UserScript==
// @name         论坛批量赠送茉莉
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  添加固定控制面板，包含启动和停止按钮
// @author       Orange$Goose
// @match        https://springsunday.net/forums.php?*&topicid=*
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/528962/%E8%AE%BA%E5%9D%9B%E6%89%B9%E9%87%8F%E8%B5%A0%E9%80%81%E8%8C%89%E8%8E%89.user.js
// @updateURL https://update.greasyfork.org/scripts/528962/%E8%AE%BA%E5%9D%9B%E6%89%B9%E9%87%8F%E8%B5%A0%E9%80%81%E8%8C%89%E8%8E%89.meta.js
// ==/UserScript==

(function () {
    'use strict';

    // 用于控制脚本运行状态
    let isRunning = false;
    let shouldStop = false;

    // 创建固定的悬浮控制面板
    function createControlPanel() {
        // 创建控制面板容器
        const panel = document.createElement('div');
        panel.id = 'autoCollectPanel';

        // 设置面板样式
        panel.style.position = 'fixed';
        panel.style.bottom = '20px';
        panel.style.right = '20px';
        panel.style.zIndex = '9999';
        panel.style.padding = '10px';
        panel.style.backgroundColor = '#f0f0f0';
        panel.style.border = '1px solid #ccc';
        panel.style.borderRadius = '5px';
        panel.style.boxShadow = '0 2px 5px rgba(0,0,0,0.3)';
        panel.style.display = 'flex';
        panel.style.gap = '10px';

        // 创建开始按钮
        const startButton = document.createElement('button');
        startButton.textContent = '散！！！';
        startButton.id = 'startButton';

        // 设置开始按钮样式
        startButton.style.padding = '8px 15px';
        startButton.style.backgroundColor = '#4CAF50';
        startButton.style.color = 'white';
        startButton.style.border = 'none';
        startButton.style.borderRadius = '5px';
        startButton.style.cursor = 'pointer';
        startButton.style.fontWeight = 'bold';

        // 鼠标悬停效果
        startButton.onmouseover = function() {
            if (!isRunning) this.style.backgroundColor = '#45a049';
        };
        startButton.onmouseout = function() {
            if (!isRunning) this.style.backgroundColor = '#4CAF50';
        };

        // 创建停止按钮
        const stopButton = document.createElement('button');
        stopButton.textContent = '停止';
        stopButton.id = 'stopButton';

        // 设置停止按钮样式
        stopButton.style.padding = '8px 15px';
        stopButton.style.backgroundColor = '#f44336';
        stopButton.style.color = 'white';
        stopButton.style.border = 'none';
        stopButton.style.borderRadius = '5px';
        stopButton.style.cursor = 'pointer';
        stopButton.style.fontWeight = 'bold';
        stopButton.style.opacity = '0.5';
        stopButton.disabled = true;

        // 鼠标悬停效果
        stopButton.onmouseover = function() {
            if (isRunning) this.style.backgroundColor = '#d32f2f';
        };
        stopButton.onmouseout = function() {
            if (isRunning) this.style.backgroundColor = '#f44336';
        };

        // 添加开始按钮点击事件
        startButton.addEventListener('click', function() {
            if (isRunning) return;

            // 更新状态
            isRunning = true;
            shouldStop = false;

            // 更新按钮状态
            startButton.textContent = '处理中...';
            startButton.disabled = true;
            startButton.style.backgroundColor = '#999';
            stopButton.disabled = false;
            stopButton.style.opacity = '1';

            // 开始处理
            processCurrentPage()
                .then(() => {
                    finishProcessing(startButton, stopButton, !shouldStop);
                })
                .catch(error => {
                    console.error('处理过程出错:', error);
                    finishProcessing(startButton, stopButton, false);
                });
        });

        // 添加停止按钮点击事件
        stopButton.addEventListener('click', function() {
            if (!isRunning) return;

            shouldStop = true;
            stopButton.textContent = '正在停止...';
            stopButton.disabled = true;
        });

        // 添加按钮到面板
        panel.appendChild(startButton);
        panel.appendChild(stopButton);

        // 添加面板到页面
        document.body.appendChild(panel);
    }

    // 处理完成或停止后重置按钮
    function finishProcessing(startButton, stopButton, isSuccess) {
        isRunning = false;

        startButton.textContent = isSuccess ? '完成！' : (shouldStop ? '已停止' : '出错！');
        stopButton.textContent = '停止';
        stopButton.disabled = true;
        stopButton.style.opacity = '0.5';

        setTimeout(() => {
            startButton.textContent = '散！！！';
            startButton.disabled = false;
            startButton.style.backgroundColor = '#4CAF50';
        }, 3000);
    }

    async function processCurrentPage() {
        // 检查是否应该停止
        if (shouldStop) return;

        // 选择所有符合条件的元素
        const elements = document.querySelectorAll('[id^="pid"][id$="-bonus-button"]');

        // 提取 ID 中的数字部分并存入数组
        const ids = Array.from(elements)
            .map(el => el.id.match(/pid(\d+)-bonus-button/))
            .filter(match => match)
            .map(match => match[1]);

        // 处理当前页面所有ID
        for (const id of ids) {
            // 检查是否应该停止
            if (shouldStop) return;

            await sendPostRequest(id);
            // 添加随机延迟，避免请求过快
            await new Promise(resolve => setTimeout(resolve, 500 + Math.random() * 500));
        }

        // 检查是否有下一页，如果有则点击并继续处理
        if (!shouldStop && hasNextPage()) {
            const nextPageLink = document.querySelector('span[title="Alt+Pagedown"]').parentElement;
            nextPageLink.click();
            // 等待页面加载完成
            await new Promise(resolve => setTimeout(resolve, 3000));
            // 递归处理下一页
            await processCurrentPage();
        }
    }

    // 发送 POST 请求的函数
    async function sendPostRequest(id) {
        const url = "https://springsunday.net/bonus.php"; // 请求 URL
        const formData = new URLSearchParams(); // 构造表单数据

        formData.append("id", id); // 变动 ID
        formData.append("bonus", "3000"); // 固定参数
        formData.append("type", "post"); // 固定参数

        try {
            const response = await fetch(url, {
                method: "POST",
                headers: {
                    "Content-Type": "application/x-www-form-urlencoded",
                },
                body: formData.toString(),
            });

            if (!response.ok) throw new Error(`请求失败: ${response.status}`);

            const result = await response.text(); // 解析响应
            console.log(`ID ${id} 处理成功:`, result);
        } catch (error) {
            console.error(`ID ${id} 处理失败:`, error);
        }
    }

    function hasNextPage() {
        // 选择所有包含 title="Alt+Pagedown" 的 <span>
        const nextPageSpan = document.querySelector('span[title="Alt+Pagedown"]');

        // 判断该 <span> 是否被 <a> 包裹
        return nextPageSpan && nextPageSpan.parentElement.tagName.toLowerCase() === "a";
    }

    // 创建控制面板，等待页面完全加载
    window.addEventListener('load', createControlPanel);
})();