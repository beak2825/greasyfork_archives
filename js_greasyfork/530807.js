// ==UserScript==
// @name         网页定时刷新
// @namespace    http://tampermonkey.net/
// @version      1.2
// @description  定时刷新页面，支持设置间隔时间和最大刷新次数
// @author       嘉虔居士
// @match        *://*/*
// @grant        none
// @license      GPL
// @downloadURL https://update.greasyfork.org/scripts/530807/%E7%BD%91%E9%A1%B5%E5%AE%9A%E6%97%B6%E5%88%B7%E6%96%B0.user.js
// @updateURL https://update.greasyfork.org/scripts/530807/%E7%BD%91%E9%A1%B5%E5%AE%9A%E6%97%B6%E5%88%B7%E6%96%B0.meta.js
// ==/UserScript==

(function () {
    'use strict';

    function init() {
        // 从本地存储获取状态
        const isRefreshEnabled = localStorage.getItem('isRefreshEnabled') === 'true';
        const savedRefreshInterval = localStorage.getItem('refreshInterval');
        const savedMaxRefreshCount = localStorage.getItem('maxRefreshCount');
        let currentRefreshCount = parseInt(localStorage.getItem('currentRefreshCount')) || 0;

        // 自动启动刷新
        if (isRefreshEnabled && savedRefreshInterval) {
            const refreshIntervalInMilliseconds = savedRefreshInterval * 1000;
            window.refreshIntervalId = setInterval(() => {
                currentRefreshCount++;
                localStorage.setItem('currentRefreshCount', currentRefreshCount);

                const maxCount = parseInt(localStorage.getItem('maxRefreshCount'));
                if (maxCount && currentRefreshCount >= maxCount) {
                    clearInterval(window.refreshIntervalId);
                    localStorage.setItem('isRefreshEnabled', 'false');
                    localStorage.setItem('currentRefreshCount', '0');
                    currentRefreshCount = 0;
                    if (document.body.querySelector('div')) {
                        document.querySelector('div div:nth-child(2)').textContent = '已刷新次数: 0';
                    }
                }
                location.reload(true);
            }, refreshIntervalInMilliseconds);
        }

        // 创建设置框
        const settingsBox = document.createElement('div');
        Object.assign(settingsBox.style, {
            position: 'fixed',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            backgroundColor: 'white',
            border: '2px solid #007bff',
            borderRadius: '8px',
            padding: '20px',
            boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
            zIndex: '2147483647',
            display: 'flex',
            flexDirection: 'column',
            gap: '10px',
        });

        // 创建双栏容器
        const inputRow = document.createElement('div');
        Object.assign(inputRow.style, {
            display: 'flex',
            gap: '10px',
            width: '100%'
        });

        // 左侧输入框（间隔时间）
        const intervalInput = document.createElement('input');
        Object.assign(intervalInput, {
            type: 'number',
            placeholder: '刷新间隔（秒）',
            min: "1",
            value: savedRefreshInterval || '',
        });
        Object.assign(intervalInput.style, {
            flex: 1,
            padding: '8px',
            fontSize: '14px',
            border: '1px solid #ddd',
            borderRadius: '4px',
        });

        // 右侧输入框（最大次数）
        const countInput = document.createElement('input');
        Object.assign(countInput, {
            type: 'number',
            placeholder: '最大次数（空为不限）',
            min: "1",
            value: savedMaxRefreshCount || '',
        });
        Object.assign(countInput.style, {
            flex: 1,
            padding: '8px',
            fontSize: '14px',
            border: '1px solid #ddd',
            borderRadius: '4px',
        });

        // 状态显示
        const statusText = document.createElement('div');
        statusText.textContent = `已刷新次数: ${currentRefreshCount}`;
        Object.assign(statusText.style, {
            fontSize: '12px',
            color: '#666',
            textAlign: 'center'
        });

        // 按钮
        const startButton = document.createElement('button');
        startButton.textContent = isRefreshEnabled ? '停止定时刷新' : '启动定时刷新';
        Object.assign(startButton.style, {
            width: '100%',
            padding: '12px',
            backgroundColor: '#007bff',
            color: 'white',
            border: 'none',
            borderRadius: '5px',
            cursor: 'pointer',
            fontSize: '16px',
            fontWeight: 'bold',
        });

        // 按钮交互
        startButton.addEventListener('mouseover', () => {
            startButton.style.backgroundColor = '#0056b3';
        });
        startButton.addEventListener('mouseout', () => {
            startButton.style.backgroundColor = '#007bff';
        });

        // 按钮点击逻辑
        startButton.addEventListener('click', function () {
            const refreshInterval = intervalInput.value;
            const maxCount = countInput.value;

            if (refreshInterval <= 0) {
                alert('间隔时间必须大于0');
                return;
            }
            if (maxCount && maxCount <= 0) {
                alert('最大次数必须大于0');
                return;
            }

            localStorage.setItem('refreshInterval', refreshInterval);
            localStorage.setItem('maxRefreshCount', maxCount);
            const isEnabled = localStorage.getItem('isRefreshEnabled') === 'true';

            if (isEnabled) {
                clearInterval(window.refreshIntervalId);
                startButton.textContent = '启动定时刷新';
                localStorage.setItem('isRefreshEnabled', 'false');
                localStorage.setItem('currentRefreshCount', '0');
                currentRefreshCount = 0;
                statusText.textContent = '已刷新次数: 0';
            } else {
                localStorage.setItem('currentRefreshCount', '0');
                statusText.textContent = '已刷新次数: 0';

                const interval = refreshInterval * 1000;
                window.refreshIntervalId = setInterval(() => {
                    currentRefreshCount++;
                    localStorage.setItem('currentRefreshCount', currentRefreshCount);
                    statusText.textContent = `已刷新次数: ${currentRefreshCount}`;

                    if (maxCount && currentRefreshCount >= maxCount) {
                        clearInterval(window.refreshIntervalId);
                        startButton.textContent = '启动定时刷新';
                        localStorage.setItem('isRefreshEnabled', 'false');
                        localStorage.setItem('currentRefreshCount', '0');
                        currentRefreshCount = 0;
                        statusText.textContent = '已刷新次数: 0';
                    }
                    location.reload(true);
                }, interval);
                startButton.textContent = '停止定时刷新';
                localStorage.setItem('isRefreshEnabled', 'true');
            }
        });

        // 组装元素
        inputRow.appendChild(intervalInput);
        inputRow.appendChild(countInput);
        settingsBox.appendChild(inputRow);
        settingsBox.appendChild(statusText);
        settingsBox.appendChild(startButton);
        document.body.appendChild(settingsBox);
    }

    // 确保DOM加载完成
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();