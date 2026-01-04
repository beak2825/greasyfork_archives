// ==UserScript==
// @name 设备模拟器
// @namespace github.com/yourusername
// @version 1.0.0
// @description 一个用于模拟设备UA和屏幕参数的工具，支持预设设备和自定义参数
// @author Your name
// @license MIT
// @grant GM_addStyle
// @run-at document-start
// @match *://*.*/*
// @downloadURL https://update.greasyfork.org/scripts/521809/%E8%AE%BE%E5%A4%87%E6%A8%A1%E6%8B%9F%E5%99%A8.user.js
// @updateURL https://update.greasyfork.org/scripts/521809/%E8%AE%BE%E5%A4%87%E6%A8%A1%E6%8B%9F%E5%99%A8.meta.js
// ==/UserScript==

(function() {
let css = `
    (function() {
        'use strict';

        // 预设设备列表
        const presetDevices = {
            'iPhone 13': {
                userAgent: 'Mozilla/5.0 (iPhone; CPU iPhone OS 15_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/15.0 Mobile/15E148 Safari/604.1',
                width: 390,
                height: 844,
                pixelRatio: 3
            },
            'Samsung Galaxy S21': {
                userAgent: 'Mozilla/5.0 (Linux; Android 12; SM-G991B) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/96.0.4664.104 Mobile Safari/537.36',
                width: 360,
                height: 800,
                pixelRatio: 3
            },
            'iPad Pro': {
                userAgent: 'Mozilla/5.0 (iPad; CPU OS 15_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/15.0 Mobile/15E148 Safari/604.1',
                width: 1024,
                height: 1366,
                pixelRatio: 2
            }
        };

        // 创建悬浮窗
        function createFloatingWindow() {
            const container = document.createElement('div');
            container.style.cssText = \`
                position: fixed;
                top: 20px;
                right: 20px;
                background: white;
                border: 1px solid #ccc;
                border-radius: 5px;
                padding: 10px;
                z-index: 9999;
                box-shadow: 0 2px 10px rgba(0,0,0,0.1);
                transition: transform 0.3s;
                transform: translateX(calc(100% - 30px));
            \`;

            // 创建切换按钮
            const toggleBtn = document.createElement('button');
            toggleBtn.textContent = '◀';
            toggleBtn.style.cssText = \`
                position: absolute;
                left: 0;
                top: 50%;
                transform: translateY(-50%);
                border: none;
                background: #007bff;
                color: white;
                padding: 5px;
                cursor: pointer;
                border-radius: 3px 0 0 3px;
            \`;

            // 创建内容区域
            const content = document.createElement('div');
            content.style.cssText = \`
                width: 300px;
                padding: 10px;
            \`;

            // 设备选择下拉框
            const deviceSelect = document.createElement('select');
            deviceSelect.style.cssText = 'width: 100%; margin-bottom: 10px; padding: 5px;';
            Object.keys(presetDevices).forEach(device => {
                const option = document.createElement('option');
                option.value = device;
                option.textContent = device;
                deviceSelect.appendChild(option);
            });

            // 自定义输入区域
            const customInputs = document.createElement('div');
            customInputs.innerHTML = \`
                <input type="text" id="customUA" placeholder="User Agent" style="width: 100%; margin-bottom: 5px; padding: 5px;">
                <input type="number" id="customWidth" placeholder="宽度" style="width: 48%; margin-bottom: 5px; padding: 5px;">
                <input type="number" id="customHeight" placeholder="高度" style="width: 48%; margin-bottom: 5px; padding: 5px; float: right;">
                <input type="number" id="customPixelRatio" placeholder="像素比" style="width: 100%; margin-bottom: 5px; padding: 5px;">
                <button id="applyCustom" style="width: 100%; padding: 5px; background: #007bff; color: white; border: none; border-radius: 3px; cursor: pointer;">应用设置</button>
            \`;

            // 组装悬浮窗
            content.appendChild(deviceSelect);
            content.appendChild(customInputs);
            container.appendChild(toggleBtn);
            container.appendChild(content);
            document.body.appendChild(container);

            // 切换悬浮窗显示/隐藏
            let isExpanded = false;
            toggleBtn.addEventListener('click', () => {
                isExpanded = !isExpanded;
                container.style.transform = isExpanded ? 'translateX(0)' : 'translateX(calc(100% - 30px))';
                toggleBtn.textContent = isExpanded ? '▶' : '◀';
            });

            // 应用设备设置
            function applyDeviceSettings(settings) {
                // 保存设置到本地存储
                GM_setValue('deviceSettings', settings);
                
                // 修改 User Agent
                Object.defineProperty(navigator, 'userAgent', {
                    get: function() { return settings.userAgent; }
                });

                // 修改屏幕参数
                Object.defineProperty(window, 'innerWidth', {
                    get: function() { return settings.width; }
                });
                Object.defineProperty(window, 'innerHeight', {
                    get: function() { return settings.height; }
                });
                Object.defineProperty(window, 'devicePixelRatio', {
                    get: function() { return settings.pixelRatio; }
                });

                // 刷新页面
                location.reload();
            }

            // 设备选择事件
            deviceSelect.addEventListener('change', (e) => {
                const selectedDevice = presetDevices[e.target.value];
                if (selectedDevice) {
                    applyDeviceSettings(selectedDevice);
                }
            });

            // 自定义设置事件
            document.getElementById('applyCustom').addEventListener('click', () => {
                const customSettings = {
                    userAgent: document.getElementById('customUA').value || navigator.userAgent,
                    width: parseInt(document.getElementById('customWidth').value) || window.innerWidth,
                    height: parseInt(document.getElementById('customHeight').value) || window.innerHeight,
                    pixelRatio: parseFloat(document.getElementById('customPixelRatio').value) || window.devicePixelRatio
                };
                applyDeviceSettings(customSettings);
            });

            // 恢复之前的设置
            const savedSettings = GM_getValue('deviceSettings');
            if (savedSettings) {
                applyDeviceSettings(savedSettings);
            }
        }

        // 初始化
        createFloatingWindow();
    })();
`;
if (typeof GM_addStyle !== "undefined") {
  GM_addStyle(css);
} else {
  const styleNode = document.createElement("style");
  styleNode.appendChild(document.createTextNode(css));
  (document.querySelector("head") || document.documentElement).appendChild(styleNode);
}
})();
