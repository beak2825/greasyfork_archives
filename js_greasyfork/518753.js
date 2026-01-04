// ==UserScript==
// @name         一键文本转图片
// @namespace    mailto:iscyclebai@outlook.com
// @version      2.0
// @description  按下快捷键将选中文字转为图片并复制到剪贴板，
// @author       Cycle Bai
// @license      LGPL
// @match        *://*/*
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_registerMenuCommand
// @grant        GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/518753/%E4%B8%80%E9%94%AE%E6%96%87%E6%9C%AC%E8%BD%AC%E5%9B%BE%E7%89%87.user.js
// @updateURL https://update.greasyfork.org/scripts/518753/%E4%B8%80%E9%94%AE%E6%96%87%E6%9C%AC%E8%BD%AC%E5%9B%BE%E7%89%87.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 默认配置
    const DEFAULT_CONFIG = {
        fontSize: 16,
        fontFamily: 'Arial, "Microsoft YaHei", sans-serif',
        padding: 20,
        maxWidth: 800,
        lineHeight: 1.5,
        backgroundColor: '#ffffff',
        textColor: '#333333',
        borderRadius: 8,
        shadowColor: 'rgba(0, 0, 0, 0.1)',
        shortcutKey: 'i',
        shortcutModifier: 'alt'
    };

    // 获取配置
    let config = {
        ...DEFAULT_CONFIG,
        ...GM_getValue('textToImageConfig', {})
    };

    // 添加设置面板样式
    GM_addStyle(`
        .t2i-settings-overlay {
            position: fixed;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background: rgba(0, 0, 0, 0.5);
            z-index: 9999;
            display: flex;
            justify-content: center;
            align-items: center;
        }

        .t2i-settings-panel {
            background: white;
            padding: 20px;
            border-radius: 8px;
            width: 400px;
            max-height: 80vh;
            overflow-y: auto;
            box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
        }

        .t2i-settings-panel h2 {
            margin: 0 0 20px 0;
            font-size: 1.5em;
        }

        .t2i-settings-group {
            margin-bottom: 15px;
        }

        .t2i-settings-group label {
            display: block;
            margin-bottom: 5px;
            font-weight: bold;
        }

        .t2i-settings-group input,
        .t2i-settings-group select {
            width: 100%;
            padding: 8px;
            border: 1px solid #ddd;
            border-radius: 4px;
            margin-bottom: 10px;
        }

        .t2i-settings-buttons {
            display: flex;
            justify-content: flex-end;
            gap: 10px;
            margin-top: 20px;
        }

        .t2i-settings-buttons button {
            padding: 8px 16px;
            border: none;
            border-radius: 4px;
            cursor: pointer;
            font-weight: bold;
        }

        .t2i-save-btn {
            background: #4caf50;
            color: white;
        }

        .t2i-cancel-btn {
            background: #f44336;
            color: white;
        }

        .t2i-reset-btn {
            background: #ff9800;
            color: white;
        }
    `);

    // 创建设置面板
    function createSettingsPanel() {
        const overlay = document.createElement('div');
        overlay.className = 't2i-settings-overlay';

        const panel = document.createElement('div');
        panel.className = 't2i-settings-panel';

        panel.innerHTML = `
            <h2>文本转图片设置</h2>
            <div class="t2i-settings-group">
                <label>字体大小 (px)</label>
                <input type="number" id="t2i-font-size" value="${config.fontSize}">

                <label>字体家族</label>
                <input type="text" id="t2i-font-family" value="${config.fontFamily}">

                <label>内边距 (px)</label>
                <input type="number" id="t2i-padding" value="${config.padding}">

                <label>最大宽度 (px)</label>
                <input type="number" id="t2i-max-width" value="${config.maxWidth}">

                <label>行高</label>
                <input type="number" id="t2i-line-height" value="${config.lineHeight}" step="0.1">

                <label>背景颜色</label>
                <input type="color" id="t2i-bg-color" value="${config.backgroundColor}">

                <label>文本颜色</label>
                <input type="color" id="t2i-text-color" value="${config.textColor}">

                <label>圆角大小 (px)</label>
                <input type="number" id="t2i-border-radius" value="${config.borderRadius}">

                <label>快捷键</label>
                <input type="text" id="t2i-shortcut-key" value="${config.shortcutKey}">

                <label>修饰键</label>
                <select id="t2i-shortcut-modifier">
                    <option value="alt" ${config.shortcutModifier === 'alt' ? 'selected' : ''}>Alt</option>
                    <option value="ctrl" ${config.shortcutModifier === 'ctrl' ? 'selected' : ''}>Ctrl</option>
                    <option value="shift" ${config.shortcutModifier === 'shift' ? 'selected' : ''}>Shift</option>
                </select>
            </div>
            <div class="t2i-settings-buttons">
                <button class="t2i-reset-btn">重置默认</button>
                <button class="t2i-cancel-btn">取消</button>
                <button class="t2i-save-btn">保存</button>
            </div>
        `;

        // 保存设置
        const saveButton = panel.querySelector('.t2i-save-btn');
        saveButton.addEventListener('click', () => {
            const newConfig = {
                fontSize: parseInt(panel.querySelector('#t2i-font-size').value),
                fontFamily: panel.querySelector('#t2i-font-family').value,
                padding: parseInt(panel.querySelector('#t2i-padding').value),
                maxWidth: parseInt(panel.querySelector('#t2i-max-width').value),
                lineHeight: parseFloat(panel.querySelector('#t2i-line-height').value),
                backgroundColor: panel.querySelector('#t2i-bg-color').value,
                textColor: panel.querySelector('#t2i-text-color').value,
                borderRadius: parseInt(panel.querySelector('#t2i-border-radius').value),
                shortcutKey: panel.querySelector('#t2i-shortcut-key').value.toLowerCase(),
                shortcutModifier: panel.querySelector('#t2i-shortcut-modifier').value
            };

            config = newConfig;
            GM_setValue('textToImageConfig', newConfig);
            showNotification('设置已保存！', 'success');
            overlay.remove();
        });

        // 取消按钮
        const cancelButton = panel.querySelector('.t2i-cancel-btn');
        cancelButton.addEventListener('click', () => overlay.remove());

        // 重置按钮
        const resetButton = panel.querySelector('.t2i-reset-btn');
        resetButton.addEventListener('click', () => {
            config = { ...DEFAULT_CONFIG };
            GM_setValue('textToImageConfig', config);
            overlay.remove();
            showNotification('设置已重置为默认值！', 'success');
        });

        overlay.appendChild(panel);
        document.body.appendChild(overlay);
    }

    // 获取选中的文本
    function getSelectedText() {
        const activeElement = document.activeElement;
        const selection = window.getSelection().toString().trim();

        if (selection) return selection;

        if (activeElement.tagName === 'TEXTAREA' || activeElement.tagName === 'INPUT') {
            return activeElement.value.substring(
                activeElement.selectionStart,
                activeElement.selectionEnd
            ).trim();
        }

        return '';
    }

    // 优化的文本换行处理
    function wrapText(context, text, maxWidth) {
        const characters = Array.from(text);
        let lines = [];
        let currentLine = '';

        for (let char of characters) {
            const testLine = currentLine + char;
            const metrics = context.measureText(testLine);

            if (metrics.width > maxWidth - (config.padding * 2)) {
                lines.push(currentLine);
                currentLine = char;
            } else {
                currentLine = testLine;
            }
        }

        if (currentLine) {
            lines.push(currentLine);
        }

        return lines;
    }

    // 创建并配置画布
    function setupCanvas(lines) {
        const canvas = document.createElement('canvas');
        const context = canvas.getContext('2d');

        // 设置字体
        context.font = `${config.fontSize}px ${config.fontFamily}`;

        // 计算画布尺寸
        const lineHeight = config.fontSize * config.lineHeight;
        const width = config.maxWidth;
        const height = lines.length * lineHeight + (config.padding * 2);

        // 设置画布尺寸（考虑设备像素比以提高清晰度）
        const scale = window.devicePixelRatio || 1;
        canvas.width = width * scale;
        canvas.height = height * scale;
        canvas.style.width = width + 'px';
        canvas.style.height = height + 'px';

        // 缩放上下文以匹配设备像素比
        context.scale(scale, scale);

        return { canvas, context, lineHeight };
    }

    // 绘制图片
    function drawImage(canvas, context, lines, lineHeight) {
        // 绘制背景
        context.fillStyle = config.backgroundColor;
        context.fillRect(0, 0, canvas.width, canvas.height);

        // 添加圆角
        context.beginPath();
        context.roundRect(0, 0, canvas.width, canvas.height, config.borderRadius);
        context.clip();

        // 添加阴影
        context.shadowColor = config.shadowColor;
        context.shadowBlur = 10;
        context.shadowOffsetX = 0;
        context.shadowOffsetY = 2;

        // 绘制文本
        context.fillStyle = config.textColor;
        context.font = `${config.fontSize}px ${config.fontFamily}`;
        context.textBaseline = 'middle';

        lines.forEach((line, i) => {
            const y = config.padding + (i + 0.5) * lineHeight;
            context.fillText(line, config.padding, y);
        });
    }

    // 显示通知
    function showNotification(message, type = 'info') {
        const notification = document.createElement('div');
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            padding: 12px 24px;
            background: ${type === 'success' ? '#4caf50' : type === 'warning' ? '#ff9800' : '#f44336'};
            color: white;
            border-radius: 4px;
            font-size: 14px;
            z-index: 9999;
            box-shadow: 0 2px 5px rgba(0,0,0,0.2);
            animation: fadeInOut 3s ease-in-out;
        `;

        notification.textContent = message;
        document.body.appendChild(notification);

        setTimeout(() => {
            notification.remove();
        }, 3000);
    }

    // 主要事件处理函数
    async function handleKeyPress(event) {
        const isModifierPressed =
            (config.shortcutModifier === 'alt' && event.altKey) ||
            (config.shortcutModifier === 'ctrl' && event.ctrlKey) ||
            (config.shortcutModifier === 'shift' && event.shiftKey);

        if (!(isModifierPressed && event.key.toLowerCase() === config.shortcutKey)) return;

        const selection = getSelectedText();
        if (!selection) {
            showNotification('请先选中文本！', 'warning');
            return;
        }

        try {
            const context = document.createElement('canvas').getContext('2d');
            context.font = `${config.fontSize}px ${config.fontFamily}`;

            const lines = selection.split('\n').flatMap(line =>
                wrapText(context, line, config.maxWidth)
            );

            const { canvas, context: finalContext, lineHeight } = setupCanvas(lines);
            drawImage(canvas, finalContext, lines, lineHeight);

            const blob = await new Promise(resolve => canvas.toBlob(resolve, 'image/png'));
            await navigator.clipboard.write([
                new ClipboardItem({ 'image/png': blob })
            ]);

            showNotification('图片已复制到剪贴板！', 'success');
        } catch (error) {
            console.error('转换失败:', error);
            showNotification('转换失败，请检查权限或浏览器兼容性。', 'error');
        }
    }

    // 注册菜单命令
    GM_registerMenuCommand('设置', createSettingsPanel);

    // 注册事件监听器
    document.addEventListener('keydown', handleKeyPress);

    // 添加样式
    const style = document.createElement('style');
    style.textContent = `
        @keyframes fadeInOut {
            0% { opacity: 0; transform: translateY(-20px); }
            10% { opacity: 1; transform: translateY(0); }
            90% { opacity: 1; transform: translateY(0); }
            100% { opacity: 0; transform: translateY(-20px); }
        }
    `;
    document.head.appendChild(style);
})();
