// ==UserScript==
// @name         网页自动刷新面板
// @namespace    http://tampermonkey.net/
// @version      2.2.1
// @description  自动取消勾选的递减次数刷新工具，状态持久化存储
// @author       明灯花月夜
// @match        *://*/*
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/530214/%E7%BD%91%E9%A1%B5%E8%87%AA%E5%8A%A8%E5%88%B7%E6%96%B0%E9%9D%A2%E6%9D%BF.user.js
// @updateURL https://update.greasyfork.org/scripts/530214/%E7%BD%91%E9%A1%B5%E8%87%AA%E5%8A%A8%E5%88%B7%E6%96%B0%E9%9D%A2%E6%9D%BF.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const panel = document.createElement('div');
    panel.style.position = 'fixed';
    panel.style.bottom = '20px';
    panel.style.right = '20px';
    panel.style.padding = '15px';
    panel.style.background = '#5C6BC0';
    panel.style.border = '1px solid #ddd';
    panel.style.borderRadius = '6px';
    panel.style.boxShadow = '0 2px 12px rgba(0,0,0,0.1)';
    panel.style.zIndex = '99999';
    panel.style.maxWidth = '250px';

    // 创建带验证的输入框 [[8]]
    const createInput = (id, label, defaultValue) => {
        const container = document.createElement('div');
        container.style.margin = '8px 0';
        
        const input = document.createElement('input');
        input.type = 'number';
        input.min = '0';
        input.style.width = '60px';
        input.style.marginLeft = '8px';
        input.value = localStorage.getItem(id) || defaultValue;
        
        input.addEventListener('input', () => {
            input.value = Math.max(0, parseInt(input.value) || 0);
        });

        container.appendChild(document.createTextNode(label));
        container.appendChild(input);
        return { container, input };
    };

    const checkbox = document.createElement('input');
    checkbox.type = 'checkbox';
    checkbox.id = 'auto-refresh-checkbox';

    const label = document.createElement('label');
    label.htmlFor = 'auto-refresh-checkbox';
    label.appendChild(document.createTextNode('启用自动刷新'));

    const { container: delayContainer, input: delayInput } = 
        createInput('refreshDelay', '延迟（秒）:', 5);
    
    const { container: countContainer, input: countInput } = 
        createInput('refreshCount', '总次数（0=无限）:', 0);

    panel.appendChild(checkbox);
    panel.appendChild(label);
    panel.appendChild(delayContainer);
    panel.appendChild(countContainer);
    document.body.appendChild(panel);

    // 加载状态 [[5]]
    let remainingCount = parseInt(localStorage.getItem('refreshRemaining')) || 0;
    const savedEnabled = localStorage.getItem('autoRefreshEnabled') === 'true';
    checkbox.checked = savedEnabled && (remainingCount > 0 || countInput.value == 0);

    let refreshTimer;

    // 启动刷新逻辑 [[9]]
    function startRefresh() {
        const total = parseInt(countInput.value) || 0;
        const delay = parseInt(delayInput.value) || 5;
        
        // 初始化剩余次数 [[7]]
        remainingCount = total === 0 ? 0 : (total || 0);
        localStorage.setItem('refreshRemaining', remainingCount);
        
        if (refreshTimer) clearTimeout(refreshTimer);
        
        function refreshLoop() {
            if (!checkbox.checked) return;

            // 次数控制逻辑 [[2]]
            if (total > 0 && remainingCount <= 0) {
                stopRefresh();
                return;
            }

            if (total > 0) {
                remainingCount--;
                localStorage.setItem('refreshRemaining', remainingCount);
                countInput.value = remainingCount; // 实时更新显示
            }

            // 最后一次刷新时取消勾选 [[6]]
            if (total > 0 && remainingCount === 0) {
                checkbox.checked = false;
                localStorage.setItem('autoRefreshEnabled', false);
            }

            window.location.reload();
        }

        // 使用setTimeout实现精确控制 [[9]]
        refreshTimer = setTimeout(() => {
            refreshLoop();
            if (checkbox.checked) {
                setTimeout(arguments.callee, delay * 1000);
            }
        }, delay * 1000);
    }

    function stopRefresh() {
        clearTimeout(refreshTimer);
        checkbox.checked = false;
        localStorage.setItem('autoRefreshEnabled', false);
    }

    // 复选框事件 [[7]]
    checkbox.addEventListener('change', (e) => {
        localStorage.setItem('autoRefreshEnabled', e.target.checked);
        if (e.target.checked) {
            localStorage.setItem('refreshDelay', delayInput.value);
            localStorage.setItem('refreshCount', countInput.value);
            startRefresh();
        } else {
            stopRefresh();
        }
    });

    // 输入变化处理 [[5]]
    const saveInput = (input, key) => {
        input.addEventListener('change', () => {
            const value = parseInt(input.value) || 0;
            localStorage.setItem(key, value);
            if (checkbox.checked) {
                stopRefresh();
                startRefresh();
            }
        });
    };

    saveInput(delayInput, 'refreshDelay');
    saveInput(countInput, 'refreshCount');

    // 初始化检查 [[7]]
    if (checkbox.checked) {
        // 恢复剩余次数显示
        countInput.value = remainingCount > 0 ? remainingCount : countInput.value;
        startRefresh();
    }
})();