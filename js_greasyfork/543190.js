// ==UserScript==
// @name         阿里云防火墙规则批量添加工具
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  批量添加阿里云防火墙规则
// @author       yangxiongj
// @match        https://swasnext.console.aliyun.com/*
// @license MIT
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/543190/%E9%98%BF%E9%87%8C%E4%BA%91%E9%98%B2%E7%81%AB%E5%A2%99%E8%A7%84%E5%88%99%E6%89%B9%E9%87%8F%E6%B7%BB%E5%8A%A0%E5%B7%A5%E5%85%B7.user.js
// @updateURL https://update.greasyfork.org/scripts/543190/%E9%98%BF%E9%87%8C%E4%BA%91%E9%98%B2%E7%81%AB%E5%A2%99%E8%A7%84%E5%88%99%E6%89%B9%E9%87%8F%E6%B7%BB%E5%8A%A0%E5%B7%A5%E5%85%B7.meta.js
// ==/UserScript==


(function() {
    'use strict';

    // 创建控制面板
    function createControlPanel() {
        // 检查是否已存在控制面板
        if (document.getElementById('firewall-batch-panel')) {
            return;
        }

        const panel = document.createElement('div');
        panel.id = 'firewall-batch-panel';
        panel.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            width: 300px;
            background: #fff;
            border: 2px solid #1890ff;
            border-radius: 8px;
            box-shadow: 0 4px 12px rgba(0,0,0,0.15);
            z-index: 10000;
            padding: 15px;
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
        `;

        panel.innerHTML = `
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 15px;">
                <h3 style="margin: 0; color: #1890ff; font-size: 16px;">批量填写端口</h3>
                <button id="close-panel" style="background: none; border: none; font-size: 18px; cursor: pointer; color: #999;">×</button>
            </div>

            <div style="margin-bottom: 15px;">
                <label style="display: block; margin-bottom: 5px; font-weight: 500; color: #333;">端口列表 (用逗号分隔):</label>
                <textarea id="port-input" placeholder="例如: 80,443,8080,3000"
                    style="width: 100%; height: 80px; padding: 8px; border: 1px solid #d9d9d9; border-radius: 4px; resize: vertical; font-size: 14px; box-sizing: border-box;"></textarea>
            </div>

            <button id="batch-add-rows"
                style="width: 100%; padding: 10px; background: #52c41a; color: white; border: none; border-radius: 4px; font-size: 14px; cursor: pointer; font-weight: 500; margin-bottom: 10px;">
                新增N行规则
            </button>

            <button id="batch-fill-ports"
                style="width: 100%; padding: 10px; background: #1890ff; color: white; border: none; border-radius: 4px; font-size: 14px; cursor: pointer; font-weight: 500;">
                批量填写端口
            </button>

            <div id="status-info" style="margin-top: 10px; padding: 8px; background: #f6f8fa; border-radius: 4px; font-size: 12px; color: #666; display: none;">
            </div>
        `;

        document.body.appendChild(panel);

        // 绑定事件
        document.getElementById('close-panel').onclick = () => {
            panel.remove();
        };

        document.getElementById('batch-add-rows').onclick = batchAddRows;
        document.getElementById('batch-fill-ports').onclick = batchFillPorts;

        // 添加拖拽功能
        let isDragging = false;
        let dragOffset = { x: 0, y: 0 };

        panel.addEventListener('mousedown', (e) => {
            if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA' || e.target.tagName === 'BUTTON') {
                return;
            }
            isDragging = true;
            dragOffset.x = e.clientX - panel.offsetLeft;
            dragOffset.y = e.clientY - panel.offsetTop;
            panel.style.cursor = 'move';
        });

        document.addEventListener('mousemove', (e) => {
            if (isDragging) {
                panel.style.left = (e.clientX - dragOffset.x) + 'px';
                panel.style.top = (e.clientY - dragOffset.y) + 'px';
                panel.style.right = 'auto';
            }
        });

        document.addEventListener('mouseup', () => {
            isDragging = false;
            panel.style.cursor = 'default';
        });
    }

    // 状态显示函数
    function showStatus(message, type = 'info') {
        const statusInfo = document.getElementById('status-info');
        if (statusInfo) {
            statusInfo.style.display = 'block';
            const color = type === 'error' ? '#ff4d4f' : type === 'success' ? '#52c41a' : '#1890ff';
            statusInfo.innerHTML = `<span style="color: ${color};">${message}</span>`;
        }
        console.log(`[防火墙工具] ${message}`);
    }

    // 解析端口列表
    function parsePorts() {
        const portInput = document.getElementById('port-input');
        if (!portInput.value.trim()) {
            showStatus('请输入端口列表', 'error');
            return [];
        }

        const ports = portInput.value.split(',').map(p => p.trim()).filter(p => p && /^\d+$/.test(p));
        if (ports.length === 0) {
            showStatus('未解析到有效的端口号', 'error');
            return [];
        }

        showStatus(`解析到 ${ports.length} 个端口: ${ports.join(', ')}`, 'success');
        return ports;
    }

    // 找到新增规则按钮并点击N次
    function batchAddRows() {
        const ports = parsePorts();
        if (ports.length === 0) return;
        // 查找新增规则按钮
        let addButton = null;

        // 优先查找指定的按钮

            // 查找包含"新增规则"文本的按钮
        const buttons = document.querySelectorAll('form .swas-space-item span');
        for (const btn of buttons) {
            if (btn.textContent.includes('新增规则') || btn.textContent.includes('添加规则')) {
                addButton = btn;
                break;
            }
        }

        showStatus(`找到新增规则按钮，准备点击 ${ports.length} 次`);

        // 连续点击N次
        for (let i = 0; i < ports.length -1; i++) {
            addButton.click();
        }

        showStatus(`已新增 ${ports.length -1} 行规则，请点击"批量填写端口"`, 'success');
    }

    // 批量填写端口
    function batchFillPorts() {
        const ports = parsePorts();
        if (ports.length === 0) return;

        let filledCount = 0;

        // 查找所有端口输入框并填写
        for (let i = 0; i < ports.length; i++) {
            const port = ports[i];

                         // 多种端口输入框选择器
             const portSelectors = [
                 `[name="firewallRules[${i}].Port"]`
             ];
            let portInput = null;
            for (const selector of portSelectors) {
                portInput = document.querySelector(selector);
                if (portInput) break;
            }

                 if (portInput) {
                 // 填写端口值
                 portInput.focus();

                 // 清空原值
                 portInput.value = '';

                 // 设置新值
                 portInput.value = port;

                 // 触发所有可能的事件，确保框架能够检测到值的变化
                 portInput.dispatchEvent(new Event('input', { bubbles: true, cancelable: true }));
                 portInput.dispatchEvent(new Event('change', { bubbles: true, cancelable: true }));
                 portInput.dispatchEvent(new Event('blur', { bubbles: true, cancelable: true }));

                 // 对于React组件，还需要触发这些事件
                 const nativeInputValueSetter = Object.getOwnPropertyDescriptor(window.HTMLInputElement.prototype, "value").set;
                 nativeInputValueSetter.call(portInput, port);

                 const inputEvent = new Event('input', { bubbles: true });
                 portInput.dispatchEvent(inputEvent);

                 filledCount++;
             }
        }

        if (filledCount > 0) {
            showStatus(`成功填写 ${filledCount}/${ports.length} 个端口`, 'success');
        } else {
            showStatus('未找到端口输入框，请确保已新增规则行', 'error');
        }
    }

    // 页面加载完成后创建控制面板
    function init() {
        // 检查是否在阿里云控制台页面
        if (window.location.hostname.includes('console.aliyun.com')) {
            // 等待页面加载完成后创建面板
            if (document.readyState === 'complete') {
                createControlPanel();
            } else {
                window.addEventListener('load', createControlPanel);
            }
        }
    }

    // 初始化
    init();

})();