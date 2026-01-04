// ==UserScript==
// @name         Bilibili Video Duration Calculator
// @namespace    http://tampermonkey.net/
// @version      3.0
// @description  自动计算B站视频列表中从当前集数到最后一集的剩余时长，并支持手动输入集数计算
// @author       Jian A
// @match        https://www.bilibili.com/video/*
// @license      MIT
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/524839/Bilibili%20Video%20Duration%20Calculator.user.js
// @updateURL https://update.greasyfork.org/scripts/524839/Bilibili%20Video%20Duration%20Calculator.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 将时长从MM:SS或HH:MM:SS转换为秒
    function parseDuration(duration) {
        const cleanDuration = duration.trim().replace(/^0+/, '');
        const parts = cleanDuration.split(':').map(Number);

        if (parts.length < 2 || parts.length > 3) {
            console.warn('异常时长格式:', duration);
            return 0;
        }

        const isValid = parts.every((part, index) => {
            if (isNaN(part)) return false;
            if (index === 0 && parts.length === 3) return part < 24; // 小时
            return part < 60; // 分钟和秒钟
        });

        if (!isValid) {
            console.warn('异常时长值:', duration);
            return 0;
        }

        if (parts.length === 2) {
            return parts[0] * 60 + parts[1];
        } else {
            return parts[0] * 3600 + parts[1] * 60 + parts[2];
        }
    }

    // 将总秒数转换为HH:MM:SS格式
    function formatDuration(totalSeconds) {
        const hours = Math.floor(totalSeconds / 3600);
        const minutes = Math.floor((totalSeconds % 3600) / 60);
        const seconds = totalSeconds % 60;
        return `${hours}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    }

    // 获取当前播放的集数
    function getCurrentEpisode() {
        const urlParams = new URLSearchParams(window.location.search);
        const p = urlParams.get('p');
        return p ? parseInt(p) : 1;
    }

    // 主要计算逻辑
    function calculateTotalDuration(startPage) {
        const videoItems = document.querySelectorAll('.stat-item.duration');
        let totalSeconds = 0;
        let totalEpisodes = videoItems.length;
        let validDurations = 0;

        if (totalEpisodes === 0) {
            console.warn('未找到视频时长元素');
            return {
                duration: '0:00:00',
                totalEpisodes: 0,
                remainingEpisodes: 0
            };
        }

        startPage = Math.max(1, Math.min(startPage, totalEpisodes));

        let remainingEpisodes = 0;
        videoItems.forEach((item, index) => {
            const pageNum = index + 1;
            if (pageNum > startPage) {
                const duration = item.textContent.trim();
                const seconds = parseDuration(duration);
                if (seconds > 0) {
                    totalSeconds += seconds;
                    remainingEpisodes++;
                    validDurations++;
                } else {
                    console.warn(`第${pageNum}集时长(无效): ${duration}`);
                }
            }
        });

        return {
            duration: formatDuration(totalSeconds),
            totalEpisodes: totalEpisodes,
            remainingEpisodes: remainingEpisodes
        };
    }

    // 创建控件
    function createControls() {
        // 检查是否已经存在控件
        if (document.querySelector('.custom-control-container')) {
            return;
        }

        const container = document.createElement('div');
        container.className = 'custom-control-container';
        container.style.cssText = `
            display: flex;
            align-items: center;
            gap: 10px;
            margin-left: auto;
        `;

        const button = document.createElement('button');
        button.textContent = '计算剩余时长';
        button.style.cssText = `
            padding: 5px 10px;
            background: #00A1D6;
            color: white;
            border: none;
            border-radius: 4px;
            cursor: pointer;
            font-size: 14px;
            transition: background 0.3s ease;
        `;
        button.addEventListener('mouseover', () => {
            button.style.background = '#0087B3';
        });
        button.addEventListener('mouseout', () => {
            button.style.background = '#00A1D6';
        });

        const input = document.createElement('input');
        input.type = 'number';
        input.placeholder = '输入集数';
        input.style.cssText = `
            width: 80px;
            padding: 5px;
            border: 1px solid #ccc;
            border-radius: 4px;
            font-size: 14px;
            text-align: center;
        `;

        const resultBox = document.createElement('div');
        resultBox.style.cssText = `
            display: none;
            padding: 5px 10px;
            background: rgba(0, 0, 0, 0.7);
            color: white;
            border-radius: 4px;
            font-size: 14px;
            line-height: 1.5;
            white-space: nowrap;
        `;

        container.appendChild(input);
        container.appendChild(button);
        container.appendChild(resultBox);

        const titleContainer = document.querySelector('.video-info-title');
        if (titleContainer) {
            titleContainer.style.display = 'flex';
            titleContainer.style.alignItems = 'center';
            titleContainer.appendChild(container);
        } else {
            console.warn('未找到标题容器');
        }

        return { button, input, resultBox };
    }

    // 更新显示
    function updateDisplay(resultBox, startPage) {
        const result = calculateTotalDuration(startPage);

        if (result.totalEpisodes === 0) {
            resultBox.textContent = '未找到视频时长信息';
        } else if (startPage < 1 || startPage > result.totalEpisodes) {
            resultBox.textContent = '请输入有效的集数（1 到 ' + result.totalEpisodes + '）';
        } else if (startPage >= result.totalEpisodes) {
            resultBox.textContent = '🎉 恭喜你已经看完全部内容啦！';
        } else {
            resultBox.textContent = `距离撒花还有${result.remainingEpisodes}集，` +
                                   `总时长: ${result.duration} 🌸`;
        }
        resultBox.style.display = 'block';
    }

    // 初始化
    function init() {
        const durationElements = document.querySelectorAll('.stat-item.duration');
        const titleContainer = document.querySelector('.video-info-title');

        if (durationElements.length > 0 && titleContainer) {
            const { button, input, resultBox } = createControls();

            // 默认从当前集数计算
            let currentEpisode = getCurrentEpisode();
            updateDisplay(resultBox, currentEpisode);

            // 点击按钮时从输入框的集数计算
            button.addEventListener('click', () => {
                const startPage = parseInt(input.value) || currentEpisode;
                updateDisplay(resultBox, startPage);
            });

            // 回车键触发计算
            input.addEventListener('keypress', (e) => {
                if (e.key === 'Enter') {
                    const startPage = parseInt(input.value) || currentEpisode;
                    updateDisplay(resultBox, startPage);
                }
            });

            // URL变化时自动更新
            let lastUrl = location.href;
            new MutationObserver(() => {
                const url = location.href;
                if (url !== lastUrl) {
                    lastUrl = url;
                    setTimeout(() => {
                        currentEpisode = getCurrentEpisode();
                        input.value = ''; // 清空输入框
                        updateDisplay(resultBox, currentEpisode);
                    }, 1000);
                }
            }).observe(document, { subtree: true, childList: true });
        } else {
            console.warn('未找到视频时长元素或标题容器');
        }
    }

    // 启动时添加延迟
    setTimeout(() => {
        if (document.readyState === 'complete') {
            init();
        } else {
            window.addEventListener('load', init);
        }
    }, 2000);
})();