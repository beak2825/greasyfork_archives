// ==UserScript==
// @name         颜色工具箱 - 预览与转换
// @namespace    https://viayoo.com/
// @version      3.2.1
// @description  提供16进制颜色预览、调试及全网常见颜色展示。支持单色和双色预览，颜色按分组排序，并提供颜色格式转换功能。
// @author       是小白呀 & ChatGPT & Grok & DeepSeek
// @match        *://*/*
// @license      MIT
// @grant        GM_registerMenuCommand
// @grant        GM_setClipboard
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/528677/%E9%A2%9C%E8%89%B2%E5%B7%A5%E5%85%B7%E7%AE%B1%20-%20%E9%A2%84%E8%A7%88%E4%B8%8E%E8%BD%AC%E6%8D%A2.user.js
// @updateURL https://update.greasyfork.org/scripts/528677/%E9%A2%9C%E8%89%B2%E5%B7%A5%E5%85%B7%E7%AE%B1%20-%20%E9%A2%84%E8%A7%88%E4%B8%8E%E8%BD%AC%E6%8D%A2.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // ========== 颜色分组数据（包含 emoji 标识） ==========
    const colorGroups = [
        {
            group: "红色 🔴",
            colors: [
                { code: "#FF0000", name: "红色" },
                { code: "#DC143C", name: "猩红" },
                { code: "#B22222", name: "火砖红" },
                { code: "#8B0000", name: "深红" },
                { code: "#FF4500", name: "橙红" },
                { code: "#FF6347", name: "番茄红" },
                { code: "#CD5C5C", name: "印度红" },
                { code: "#FF6B6B", name: "浅珊瑚红" },
                { code: "#E32636", name: "茜红" }
            ]
        },
        {
            group: "粉色系 💗",
            colors: [
                { code: "#FFC0CB", name: "粉色" },
                { code: "#F7CAC9", name: "樱花粉" },
                { code: "#FFB6C1", name: "浅粉色" },
                { code: "#FF69B4", name: "热情粉" },
                { code: "#FF1493", name: "深粉" },
                { code: "#C71585", name: "中紫红" },
                { code: "#DB7093", name: "淡玫瑰色" },
                { code: "#FF007F", name: "玫瑰红" },
                { code: "#FA8072", name: "鲑鱼粉" },
                { code: "#B0C7E2", name: "灰雾蓝粉" },
                { code: "#FF99CC", name: "泡泡糖粉" },
                { code: "#FF77FF", name: "霓虹粉" }
            ]
        },
        {
            group: "橙色 🟠",
            colors: [
                { code: "#FFA500", name: "橙色" },
                { code: "#FF8C00", name: "深橙" },
                { code: "#FF7F50", name: "珊瑚橙" },
                { code: "#FFA07A", name: "浅橙" },
                { code: "#FFDAB9", name: "桃橙" },
                { code: "#FF8243", name: "芒果橙" }
            ]
        },
        {
            group: "黄色 🟡",
            colors: [
                { code: "#FFFF00", name: "黄色" },
                { code: "#FFD700", name: "金黄" },
                { code: "#FFFFE0", name: "浅黄色" },
                { code: "#FFFACD", name: "柠檬绸" },
                { code: "#F0E68C", name: "卡其色" },
                { code: "#FFE4B5", name: "鹿皮色" },
                { code: "#FFDAB9", name: "桃色" },
                { code: "#FADA5E", name: "玉米黄" },
                { code: "#FFDB58", name: "芥末黄" }
            ]
        },
        {
            group: "棕色系 🟤",
            colors: [
                { code: "#A52A2A", name: "棕色" },
                { code: "#8B4513", name: "马鞍棕" },
                { code: "#D2691E", name: "巧克力棕" },
                { code: "#CD853F", name: "秘鲁棕" },
                { code: "#DEB887", name: "陶土棕" }
            ]
        },
        {
            group: "绿色 🟢",
            colors: [
                { code: "#008000", name: "绿色" },
                { code: "#00FF00", name: "酸橙绿" },
                { code: "#228B22", name: "森林绿" },
                { code: "#98FB98", name: "苍绿色" },
                { code: "#90EE90", name: "淡绿色" },
                { code: "#3CB371", name: "海洋绿" },
                { code: "#2E8B57", name: "海绿" },
                { code: "#006400", name: "深绿色" },
                { code: "#00FF7F", name: "春绿" },
                { code: "#C7EDCC", name: "豆沙绿" },
                { code: "#32CD32", name: "酸橙绿 (LimeGreen)" },
                { code: "#9ACD32", name: "黄绿" },
                { code: "#556B2F", name: "橄榄绿" }
            ]
        },
        {
            group: "青色 🔵",
            colors: [
                { code: "#00FFFF", name: "青色" },
                { code: "#E0FFFF", name: "淡青色" },
                { code: "#40E0D0", name: "绿松石" },
                { code: "#48D1CC", name: "中绿松石" },
                { code: "#00CED1", name: "暗绿松石" },
                { code: "#7FFFD4", name: "水绿宝石" },
                { code: "#AFEEEE", name: "碧绿色" },
                { code: "#00FFEF", name: "电青色" },
                { code: "#20B2AA", name: "浅海洋绿" }
            ]
        },
        {
            group: "蓝色 🔷",
            colors: [
                { code: "#0000FF", name: "蓝色" },
                { code: "#4169E1", name: "皇家蓝" },
                { code: "#1E90FF", name: "道奇蓝" },
                { code: "#00BFFF", name: "深天蓝" },
                { code: "#87CEEB", name: "天蓝" },
                { code: "#87CEFA", name: "淡天蓝" },
                { code: "#4682B4", name: "钢蓝" },
                { code: "#ADD8E6", name: "淡蓝色" },
                { code: "#B0E0E6", name: "粉蓝" },
                { code: "#191970", name: "午夜蓝" },
                { code: "#000080", name: "藏青色" },
                { code: "#6A5ACD", name: "石板蓝" },
                { code: "#7B68EE", name: "中石板蓝" }
            ]
        },
        {
            group: "紫色 🟣",
            colors: [
                { code: "#800080", name: "紫色" },
                { code: "#EE82EE", name: "紫罗兰" },
                { code: "#DA70D6", name: "兰花紫" },
                { code: "#DDA0DD", name: "李子紫" },
                { code: "#9370DB", name: "中紫" },
                { code: "#8A2BE2", name: "蓝紫色" },
                { code: "#9400D3", name: "深紫罗兰" },
                { code: "#9932CC", name: "暗兰花紫" },
                { code: "#8B008B", name: "暗品红" },
                { code: "#4B0082", name: "靛蓝" },
                { code: "#BA55D3", name: "中兰花紫" },
                { code: "#D8BFD8", name: "蓟色" },
                { code: "#E6E6FA", name: "薰衣草紫" }
            ]
        },
        {
            group: "黑白 ⚫⚪",
            colors: [
                { code: "#000000", name: "黑色" },
                { code: "#FFFFFF", name: "白色" },
                { code: "#C0C0C0", name: "银色" },
                { code: "#808080", name: "灰色" },
                { code: "#D3D3D3", name: "浅灰" },
                { code: "#A9A9A9", name: "暗灰" }
            ]
        },
        {
            group: "透明色 🟤",
            colors: [
                { code: "#00000000", name: "透明黑" },
                { code: "#FFFFFF00", name: "透明白" },
                { code: "#00000080", name: "半透明黑" },
                { code: "#FF000080", name: "半透明红" },
                { code: "#00FF0080", name: "半透明绿" }
            ]
        }
    ];

    // 累积颜色映射，不去除重复，名称以 " / " 分隔
    const colorMapping = {};
    colorGroups.forEach(group => {
        group.colors.forEach(item => {
            const upperCode = item.code.toUpperCase();
            if (colorMapping[upperCode]) {
                if (!colorMapping[upperCode].includes(item.name)) {
                    colorMapping[upperCode] += " / " + item.name;
                }
            } else {
                colorMapping[upperCode] = item.name;
            }
        });
    });

    // 工具函数：创建元素
    function createElement(tag, className, innerHTML) {
        const el = document.createElement(tag);
        if (className) el.className = className;
        if (innerHTML) el.innerHTML = innerHTML;
        return el;
    }

    // 添加全局样式到Shadow DOM
    function addShadowStyle(shadowRoot) {
        const style = document.createElement('style');
        style.textContent = `
        :host {
            display: block;
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0,0,0,0.7);
            z-index: 9999;
            font-family: "Helvetica Neue", Helvetica, Arial, sans-serif;
        }
        .color-modal {
            background: #fff;
            color: #333;
            border-radius: 10px;
            box-shadow: 0 4px 20px rgba(0,0,0,0.3);
            padding: 20px;
            max-width: 95%;
            max-height: 95%;
            overflow-y: auto;
            position: relative;
        }
        .color-modal h2 {
            margin-top: 0;
            font-size: 26px;
            text-align: center;
            margin-bottom: 20px;
        }
        .close-button {
            position: absolute;
            top: 10px;
            right: 10px;
            background: #333;
            color: #fff;
            border: none;
            border-radius: 5px;
            padding: 5px 10px;
            cursor: pointer;
            font-size: 14px;
            width: 30px;
            height: 30px;
            display: flex;
            align-items: center;
            justify-content: center;
        }
        .mode-toggle {
            text-align: center;
            margin: 10px 0;
        }
        .mode-toggle label {
            margin: 0 10px;
            font-size: 16px;
            cursor: pointer;
        }
        .input-group {
            margin: 10px 0;
            text-align: center;
        }
        .input-group input {
            width: 60%;
            padding: 8px;
            font-size: 16px;
            background: #fff;
            color: #333;
            border: 1px solid #ccc;
            border-radius: 5px;
            margin-bottom: 5px;
        }
        .input-group button {
            padding: 8px 16px;
            font-size: 16px;
            margin: 5px 5px;
            border: none;
            border-radius: 5px;
            background: #007BFF;
            color: #fff;
            cursor: pointer;
        }
        .color-item {
            display: inline-block;
            width: 120px;
            margin: 10px;
            text-align: center;
            position: relative;
        }
        .color-swatch {
            width: 120px;
            height: 120px;
            line-height: 120px;
            border-radius: 8px;
            color: #fff;
            font-weight: bold;
            margin-bottom: 5px;
            box-shadow: 0 2px 8px rgba(0,0,0,0.2);
            cursor: pointer;
            border: 1px solid #ccc;
        }
        .copy-tooltip {
            pointer-events: none;
            opacity: 0.9;
        }
        .error-message {
            color: red;
            font-size: 14px;
            margin-top: 5px;
            text-align: center;
            animation: fadeIn 0.5s ease-in-out;
        }
        @keyframes fadeIn {
            from { opacity: 0; }
            to { opacity: 1; }
        }
        .search-group {
            margin: 10px 0 20px 0;
            text-align: center;
        }
        .search-group input {
            width: 70%;
            padding: 8px;
            font-size: 16px;
            border: 1px solid #ccc;
            border-radius: 5px;
            background: #fff;
            color: #333;
        }
        .color-group {
            margin-bottom: 20px;
        }
        .group-title {
            font-size: 18px;
            font-weight: bold;
            margin-bottom: 10px;
        }
        .color-list {
            display: flex;
            flex-wrap: wrap;
            justify-content: center;
        }
        .converter-group {
            margin: 20px 0;
            text-align: center;
        }
        .converter-group label {
            display: block;
            margin-bottom: 5px;
            font-size: 16px;
        }
        .converter-group input, .converter-group select {
            width: 80%;
            padding: 8px;
            font-size: 16px;
            background: #fff;
            color: #333;
            border: 1px solid #ccc;
            border-radius: 5px;
            margin-bottom: 10px;
        }
        .converter-group button {
            padding: 8px 16px;
            font-size: 16px;
            border: none;
            border-radius: 5px;
            background: #007BFF;
            color: #fff;
            cursor: pointer;
        }
        .converter-result {
            margin-top: 15px;
            padding: 10px;
            border: 1px solid #ccc;
            border-radius: 5px;
            background: #fff;
            color: #333;
            font-size: 14px;
            white-space: pre-wrap;
            word-break: break-all;
        }
        .converter-preview {
            margin-top: 10px;
            height: 50px;
            border-radius: 5px;
            border: 1px solid #ccc;
        }
        @media only screen and (orientation: portrait) {
          .preview-container, .content-container {
            text-align: center !important;
          }
          .close-button {
            position: absolute !important;
            top: 10px !important;
            right: 10px !important;
          }
        }
        `;
        shadowRoot.appendChild(style);
    }

    // ========== 防抖函数 ==========
    function debounce(func, delay) {
        let timeout;
        return function(...args) {
            clearTimeout(timeout);
            timeout = setTimeout(() => func.apply(this, args), delay);
        };
    }

    // ========== 复制文本函数 ==========
    function copyText(text) {
        if (typeof GM_setClipboard !== "undefined") {
            try {
                GM_setClipboard(text);
                return Promise.resolve();
            } catch (err) {
                return Promise.reject(err);
            }
        } else if (navigator.clipboard && navigator.clipboard.writeText) {
            return navigator.clipboard.writeText(text);
        } else {
            const textarea = document.createElement('textarea');
            textarea.value = text;
            document.body.appendChild(textarea);
            textarea.select();
            try {
                document.execCommand('copy');
            } catch (err) {
                console.error('复制失败', err);
            }
            document.body.removeChild(textarea);
            return Promise.resolve();
        }
    }

    // ========== 颜色代码校验与扩展 ==========
    function normalizeColorCode(code) {
        code = code.trim().toUpperCase();
        if (!code.startsWith("#")) {
            code = "#" + code;
        }
        if (/^#[0-9A-F]{3}$/.test(code)) {
            code = "#" + code.slice(1).split('').map(ch => ch + ch).join('');
        }
        return code;
    }

    function isValidColorCode(code) {
        return /^#[0-9A-F]{6}([0-9A-F]{2})?$/.test(code);
    }

    // ========== 调试16进制颜色预览与调试UI ==========
    function showDebugColorUI() {
        // 创建Shadow DOM容器
        const shadowHost = document.createElement('div');
        shadowHost.className = 'color-overlay';
        const shadowRoot = shadowHost.attachShadow({ mode: 'open' });
        
        // 添加样式
        addShadowStyle(shadowRoot);
        
        // 创建模态框
        const modal = createElement('div', 'color-modal');
        shadowRoot.appendChild(modal);

        const closeBtn = createElement('button', 'close-button', '✕');
        closeBtn.setAttribute("aria-label", "关闭预览窗口");
        closeBtn.addEventListener('click', () => document.body.removeChild(shadowHost));
        modal.appendChild(closeBtn);

        const title = createElement('h2', '', '16进制颜色预览与调试');
        modal.appendChild(title);

        // ===== 预览模式切换 =====
        const modeToggle = createElement('div', 'mode-toggle');
        modeToggle.innerHTML = `
            <label>
                <input type="radio" name="previewMode" value="single" checked> 单色预览
            </label>
            <label>
                <input type="radio" name="previewMode" value="dual"> 双色预览
            </label>
        `;
        modal.appendChild(modeToggle);

        // 容器：根据模式显示不同的输入区域
        const inputContainer = createElement('div', 'input-container');
        modal.appendChild(inputContainer);

        // 单色输入组（默认显示）
        const singleInputGroup = createElement('div', 'input-group');
        const singleInput = document.createElement('input');
        singleInput.type = 'text';
        singleInput.placeholder = '#C7EDCC 或 #FFF';
        singleInputGroup.appendChild(singleInput);
        inputContainer.appendChild(singleInputGroup);

        // 双色输入组（初始隐藏）
        const dualInputGroup = createElement('div', 'input-group');
        dualInputGroup.style.display = 'none';
        const dualInput1 = document.createElement('input');
        dualInput1.type = 'text';
        dualInput1.placeholder = '#C7EDCC 或 #FFF';
        dualInputGroup.appendChild(dualInput1);
        const dualInput2 = document.createElement('input');
        dualInput2.type = 'text';
        dualInput2.placeholder = '#1E90FF 或 #00F';
        dualInputGroup.appendChild(dualInput2);
        inputContainer.appendChild(dualInputGroup);

        // 生成预览、清空预览按钮区域
        const btnGroup = createElement('div', 'input-group');
        const generateBtn = createElement('button', '', '生成预览');
        generateBtn.setAttribute("aria-label", "生成颜色预览");
        btnGroup.appendChild(generateBtn);
        const clearBtn = createElement('button', '', '清空预览');
        clearBtn.setAttribute("aria-label", "清空颜色预览");
        btnGroup.appendChild(clearBtn);
        modal.appendChild(btnGroup);

        const errorMsg = createElement('div', 'error-message', '');
        errorMsg.setAttribute("aria-live", "assertive");
        modal.appendChild(errorMsg);

        const previewContainer = createElement('div', 'preview-container');
        previewContainer.style.textAlign = 'center';
        modal.appendChild(previewContainer);

        // 预览模式切换事件
        modeToggle.addEventListener('change', (e) => {
            const mode = modal.querySelector('input[name="previewMode"]:checked').value;
            if (mode === 'single') {
                singleInputGroup.style.display = '';
                dualInputGroup.style.display = 'none';
            } else {
                singleInputGroup.style.display = 'none';
                dualInputGroup.style.display = '';
            }
            errorMsg.innerHTML = '';
            previewContainer.innerHTML = '';
        });

        // 支持输入框回车触发生成预览（分别对单色与双色）
        singleInput.addEventListener('keydown', (e) => {
            if (e.key === "Enter") {
                generateBtn.click();
            }
        });
        dualInput1.addEventListener('keydown', (e) => {
            if (e.key === "Enter") {
                generateBtn.click();
            }
        });
        dualInput2.addEventListener('keydown', (e) => {
            if (e.key === "Enter") {
                generateBtn.click();
            }
        });

        // 生成预览事件，根据当前预览模式处理
        generateBtn.addEventListener('click', () => {
            previewContainer.innerHTML = '';
            errorMsg.innerHTML = '';
            const mode = modal.querySelector('input[name="previewMode"]:checked').value;
            if (mode === 'single') {
                const inputText = singleInput.value.trim();
                if (!inputText) return;
                let code = normalizeColorCode(inputText);
                if (!isValidColorCode(code)) {
                    errorMsg.innerHTML = "无效的颜色代码: " + inputText;
                    return;
                }
                const item = createElement('div', 'color-item');
                const swatch = createElement('div', 'color-swatch', code);
                swatch.style.backgroundColor = code;
                swatch.addEventListener('click', () => {
                    const existingTooltip = item.querySelector('.copy-tooltip');
                    if (existingTooltip) { existingTooltip.remove(); }
                    copyText(code).then(() => {
                        const tooltip = createElement('div', 'copy-tooltip', '已复制');
                        tooltip.style.position = 'absolute';
                        tooltip.style.backgroundColor = 'rgba(0,0,0,0.6)';
                        tooltip.style.color = '#fff';
                        tooltip.style.padding = '2px 5px';
                        tooltip.style.borderRadius = '3px';
                        tooltip.style.fontSize = '12px';
                        tooltip.style.top = '0';
                        tooltip.style.left = '50%';
                        tooltip.style.transform = 'translateX(-50%)';
                        item.appendChild(tooltip);
                        setTimeout(() => { if(item.contains(tooltip)) item.removeChild(tooltip); }, 1000);
                    }).catch(() => {
                        const tooltip = createElement('div', 'copy-tooltip', '复制失败');
                        tooltip.style.position = 'absolute';
                        tooltip.style.backgroundColor = 'rgba(255,0,0,0.6)';
                        tooltip.style.color = '#fff';
                        tooltip.style.padding = '2px 5px';
                        tooltip.style.borderRadius = '3px';
                        tooltip.style.fontSize = '12px';
                        tooltip.style.top = '0';
                        tooltip.style.left = '50%';
                        tooltip.style.transform = 'translateX(-50%)';
                        item.appendChild(tooltip);
                        setTimeout(() => { if(item.contains(tooltip)) item.removeChild(tooltip); }, 1000);
                    });
                });
                item.appendChild(swatch);
                const nameDiv = createElement('div', '', colorMapping[code] || '未知颜色');
                item.appendChild(nameDiv);
                previewContainer.appendChild(item);
            } else { // dual 模式
                const code1 = normalizeColorCode(dualInput1.value.trim());
                const code2 = normalizeColorCode(dualInput2.value.trim());
                let invalid = [];
                if (!isValidColorCode(code1)) { invalid.push(dualInput1.value.trim()); }
                if (!isValidColorCode(code2)) { invalid.push(dualInput2.value.trim()); }
                if (invalid.length > 0) {
                    errorMsg.innerHTML = "无效的颜色代码: " + invalid.join(', ');
                    return;
                }
                // 预览颜色1
                const item1 = createElement('div', 'color-item');
                const swatch1 = createElement('div', 'color-swatch', code1);
                swatch1.style.backgroundColor = code1;
                swatch1.addEventListener('click', () => {
                    const existingTooltip = item1.querySelector('.copy-tooltip');
                    if (existingTooltip) { existingTooltip.remove(); }
                    copyText(code1).then(() => {
                        const tooltip = createElement('div', 'copy-tooltip', '已复制');
                        tooltip.style.position = 'absolute';
                        tooltip.style.backgroundColor = 'rgba(0,0,0,0.6)';
                        tooltip.style.color = '#fff';
                        tooltip.style.padding = '2px 5px';
                        tooltip.style.borderRadius = '3px';
                        tooltip.style.fontSize = '12px';
                        tooltip.style.top = '0';
                        tooltip.style.left = '50%';
                        tooltip.style.transform = 'translateX(-50%)';
                        item1.appendChild(tooltip);
                        setTimeout(() => { if(item1.contains(tooltip)) item1.removeChild(tooltip); }, 1000);
                    }).catch(() => {
                        const tooltip = createElement('div', 'copy-tooltip', '复制失败');
                        tooltip.style.position = 'absolute';
                        tooltip.style.backgroundColor = 'rgba(255,0,0,0.6)';
                        tooltip.style.color = '#fff';
                        tooltip.style.padding = '2px 5px';
                        tooltip.style.borderRadius = '3px';
                        tooltip.style.fontSize = '12px';
                        tooltip.style.top = '0';
                        tooltip.style.left = '50%';
                        tooltip.style.transform = 'translateX(-50%)';
                        item1.appendChild(tooltip);
                        setTimeout(() => { if(item1.contains(tooltip)) item1.removeChild(tooltip); }, 1000);
                    });
                });
                item1.appendChild(swatch1);
                const nameDiv1 = createElement('div', '', colorMapping[code1] || '未知颜色');
                item1.appendChild(nameDiv1);
                previewContainer.appendChild(item1);

                // 预览颜色2
                const item2 = createElement('div', 'color-item');
                const swatch2 = createElement('div', 'color-swatch', code2);
                swatch2.style.backgroundColor = code2;
                swatch2.addEventListener('click', () => {
                    const existingTooltip = item2.querySelector('.copy-tooltip');
                    if (existingTooltip) { existingTooltip.remove(); }
                    copyText(code2).then(() => {
                        const tooltip = createElement('div', 'copy-tooltip', '已复制');
                        tooltip.style.position = 'absolute';
                        tooltip.style.backgroundColor = 'rgba(0,0,0,0.6)';
                        tooltip.style.color = '#fff';
                        tooltip.style.padding = '2px 5px';
                        tooltip.style.borderRadius = '3px';
                        tooltip.style.fontSize = '12px';
                        tooltip.style.top = '0';
                        tooltip.style.left = '50%';
                        tooltip.style.transform = 'translateX(-50%)';
                        item2.appendChild(tooltip);
                        setTimeout(() => { if(item2.contains(tooltip)) item2.removeChild(tooltip); }, 1000);
                    }).catch(() => {
                        const tooltip = createElement('div', 'copy-tooltip', '复制失败');
                        tooltip.style.position = 'absolute';
                        tooltip.style.backgroundColor = 'rgba(255,0,0,0.6)';
                        tooltip.style.color = '#fff';
                        tooltip.style.padding = '2px 5px';
                        tooltip.style.borderRadius = '3px';
                        tooltip.style.fontSize = '12px';
                        tooltip.style.top = '0';
                        tooltip.style.left = '50%';
                        tooltip.style.transform = 'translateX(-50%)';
                        item2.appendChild(tooltip);
                        setTimeout(() => { if(item2.contains(tooltip)) item2.removeChild(tooltip); }, 1000);
                    });
                });
                item2.appendChild(swatch2);
                const nameDiv2 = createElement('div', '', colorMapping[code2] || '未知颜色');
                item2.appendChild(nameDiv2);
                previewContainer.appendChild(item2);
            }
        });

        // 清空按钮事件
        clearBtn.addEventListener('click', () => {
            singleInput.value = '';
            dualInput1.value = '';
            dualInput2.value = '';
            previewContainer.innerHTML = '';
            errorMsg.innerHTML = '';
        });

        shadowHost.addEventListener('keydown', (e) => {
            if (e.key === "Escape") { document.body.removeChild(shadowHost); }
        });
        shadowHost.tabIndex = 0;
        shadowHost.focus();
        document.body.appendChild(shadowHost);
    }

    // ========== 16进制颜色大全展示UI ==========
    function showColorCollectionUI() {
        // 创建Shadow DOM容器
        const shadowHost = document.createElement('div');
        shadowHost.className = 'color-overlay';
        const shadowRoot = shadowHost.attachShadow({ mode: 'open' });
        
        // 添加样式
        addShadowStyle(shadowRoot);
        
        // 创建模态框
        const modal = createElement('div', 'color-modal');
        shadowRoot.appendChild(modal);

        const closeBtn = createElement('button', 'close-button', '✕');
        closeBtn.setAttribute("aria-label", "关闭颜色展示窗口");
        closeBtn.addEventListener('click', () => document.body.removeChild(shadowHost));
        modal.appendChild(closeBtn);

        const title = createElement('h2', '', '16进制颜色大全展示');
        modal.appendChild(title);

        const searchGroup = createElement('div', 'search-group');
        const searchInput = document.createElement('input');
        searchInput.type = 'text';
        searchInput.placeholder = '搜索颜色（代码或名称）';
        searchGroup.appendChild(searchInput);
        modal.appendChild(searchGroup);

        const contentContainer = createElement('div', 'content-container');
        modal.appendChild(contentContainer);

        function renderGroups() {
            contentContainer.innerHTML = '';
            colorGroups.forEach(group => {
                const filteredColors = group.colors.filter(item => {
                    const searchTerm = searchInput.value.trim().toLowerCase();
                    if (!searchTerm) return true;
                    if (searchTerm.startsWith('#')) {
                        return item.code.toLowerCase().startsWith(searchTerm);
                    } else if (searchTerm.endsWith('*')) {
                        return item.name.toLowerCase().startsWith(searchTerm.slice(0, -1));
                    } else {
                        return (
                            item.code.toLowerCase().includes(searchTerm) ||
                            item.name.toLowerCase().includes(searchTerm)
                        );
                    }
                });
                if (filteredColors.length === 0) return;

                const groupDiv = createElement('div', 'color-group');
                const groupTitle = createElement('div', 'group-title', group.group);
                groupDiv.appendChild(groupTitle);

                const colorList = createElement('div', 'color-list');
                filteredColors.forEach(item => {
                    const colorItem = createElement('div', 'color-item');
                    const swatch = createElement('div', 'color-swatch', item.code);
                    swatch.style.backgroundColor = item.code;
                    swatch.addEventListener('click', () => {
                        const existingTooltip = colorItem.querySelector('.copy-tooltip');
                        if (existingTooltip) { existingTooltip.remove(); }
                        copyText(item.code).then(() => {
                            const tooltip = createElement('div', 'copy-tooltip', '已复制');
                            tooltip.style.position = 'absolute';
                            tooltip.style.backgroundColor = 'rgba(0,0,0,0.6)';
                            tooltip.style.color = '#fff';
                            tooltip.style.padding = '2px 5px';
                            tooltip.style.borderRadius = '3px';
                            tooltip.style.fontSize = '12px';
                            tooltip.style.top = '0';
                            tooltip.style.left = '50%';
                            tooltip.style.transform = 'translateX(-50%)';
                            colorItem.appendChild(tooltip);
                            setTimeout(() => { if(colorItem.contains(tooltip)) colorItem.removeChild(tooltip); }, 1000);
                        }).catch(() => {
                            const tooltip = createElement('div', 'copy-tooltip', '复制失败');
                            tooltip.style.position = 'absolute';
                            tooltip.style.backgroundColor = 'rgba(255,0,0,0.6)';
                            tooltip.style.color = '#fff';
                            tooltip.style.padding = '2px 5px';
                            tooltip.style.borderRadius = '3px';
                            tooltip.style.fontSize = '12px';
                            tooltip.style.top = '0';
                            tooltip.style.left = '50%';
                            tooltip.style.transform = 'translateX(-50%)';
                            colorItem.appendChild(tooltip);
                            setTimeout(() => { if(colorItem.contains(tooltip)) colorItem.removeChild(tooltip); }, 1000);
                        });
                    });
                    colorItem.appendChild(swatch);

                    const codeDiv = createElement('div', '', item.code);
                    colorItem.appendChild(codeDiv);

                    const nameDiv = createElement('div', '', item.name);
                    colorItem.appendChild(nameDiv);

                    colorList.appendChild(colorItem);
                });
                groupDiv.appendChild(colorList);

                contentContainer.appendChild(groupDiv);
            });
        }

        searchInput.addEventListener('input', debounce(renderGroups, 300));
        renderGroups();

        shadowHost.addEventListener('keydown', (e) => {
            if (e.key === "Escape") { document.body.removeChild(shadowHost); }
        });
        shadowHost.tabIndex = 0;
        shadowHost.focus();
        document.body.appendChild(shadowHost);
    }

    // ========== 颜色格式转换UI ==========
    function showColorConverterUI() {
        // 创建Shadow DOM容器
        const shadowHost = document.createElement('div');
        shadowHost.className = 'color-overlay';
        const shadowRoot = shadowHost.attachShadow({ mode: 'open' });
        
        // 添加样式
        addShadowStyle(shadowRoot);
        
        // 创建模态框
        const modal = createElement('div', 'color-modal');
        shadowRoot.appendChild(modal);

        const closeBtn = createElement('button', 'close-button', '✕');
        closeBtn.setAttribute("aria-label", "关闭转换工具");
        closeBtn.addEventListener('click', () => document.body.removeChild(shadowHost));
        modal.appendChild(closeBtn);

        const title = createElement('h2', '', '颜色格式转换工具');
        modal.appendChild(title);

        const converterGroup = createElement('div', 'converter-group');
        
        // 输入颜色值的标签与输入框
        const labelInput = createElement('label', '', '输入颜色值：');
        converterGroup.appendChild(labelInput);
        const colorInput = document.createElement('input');
        colorInput.placeholder = "例如：#FF5733 或 rgb(255,87,51) 或 hsl(9,100%,60%)";
        converterGroup.appendChild(colorInput);

        // 错误提示
        const errorDiv = createElement('div', 'error-message', '');
        converterGroup.appendChild(errorDiv);

        // 选择输入格式
        const labelFormat = createElement('label', '', '选择输入格式：');
        converterGroup.appendChild(labelFormat);
        const formatSelect = document.createElement('select');
        const formats = ["HEX", "RGB", "HSL"];
        formats.forEach(fmt => {
            const opt = document.createElement('option');
            opt.value = fmt;
            opt.textContent = fmt;
            formatSelect.appendChild(opt);
        });
        converterGroup.appendChild(formatSelect);

        // 转换按钮
        const convertBtn = createElement('button', '', '转换');
        converterGroup.appendChild(convertBtn);

        // 结果展示区域
        const resultDiv = createElement('div', 'converter-result', '');
        converterGroup.appendChild(resultDiv);

        // 颜色预览区域
        const previewDiv = createElement('div', 'converter-preview');
        converterGroup.appendChild(previewDiv);

        modal.appendChild(converterGroup);

        // 实时输入验证
        colorInput.addEventListener("input", () => {
            const input = colorInput.value.trim();
            const format = formatSelect.value;
            errorDiv.style.display = "none";
            if (!input) return;

            try {
                if (format === "HEX") {
                    normalizeHex(input);
                } else if (format === "RGB") {
                    parseRGB(input);
                } else if (format === "HSL") {
                    parseHSL(input);
                }
            } catch (e) {
                errorDiv.textContent = e.message || "无效的输入格式，请检查！";
                errorDiv.style.display = "block";
            }
        });

        // 绑定转换事件
        convertBtn.addEventListener("click", () => {
            const input = colorInput.value.trim();
            const format = formatSelect.value;
            errorDiv.style.display = "none";
            if (!input) {
                errorDiv.textContent = "请输入颜色值！";
                errorDiv.style.display = "block";
                return;
            }
            try {
                let rgb, hex, hsl;
                if (format === "HEX") {
                    hex = normalizeHex(input);
                    rgb = hexToRgb(hex);
                    hsl = rgbToHsl(rgb.r, rgb.g, rgb.b);
                } else if (format === "RGB") {
                    rgb = parseRGB(input);
                    hex = rgbToHex(rgb.r, rgb.g, rgb.b);
                    hsl = rgbToHsl(rgb.r, rgb.g, rgb.b);
                } else if (format === "HSL") {
                    hsl = parseHSL(input);
                    rgb = hslToRgb(hsl.h, hsl.s, hsl.l);
                    hex = rgbToHex(rgb.r, rgb.g, rgb.b);
                }
                resultDiv.textContent = `HEX: ${hex}\nRGB: rgb(${rgb.r}, ${rgb.g}, ${rgb.b})\nHSL: hsl(${hsl.h}, ${hsl.s}%, ${hsl.l}%)`;
                previewDiv.style.backgroundColor = hex;
            } catch (e) {
                errorDiv.textContent = e.message || "转换出错，请检查输入格式！";
                errorDiv.style.display = "block";
                resultDiv.textContent = "";
                previewDiv.style.backgroundColor = "#fff";
            }
        });

        shadowHost.addEventListener('keydown', (e) => {
            if (e.key === "Escape") { document.body.removeChild(shadowHost); }
        });
        shadowHost.tabIndex = 0;
        shadowHost.focus();
        document.body.appendChild(shadowHost);
    }

    // ========== 辅助函数（颜色转换） ==========
    function normalizeHex(code) {
        code = code.toUpperCase().trim();
        if (!code.startsWith("#")) {
            code = "#" + code;
        }
        if (/^#[0-9A-F]{3}$/i.test(code)) {
            code = "#" + code.slice(1).split('').map(ch => ch + ch).join('');
        }
        if (!/^#[0-9A-F]{6}$/i.test(code)) {
            throw new Error("无效的HEX格式，必须是3或6位十六进制数（如#FFF或#FFFFFF）");
        }
        return code;
    }

    function parseRGB(str) {
        const match = str.match(/rgba?\(\s*(\d{1,3})\s*,\s*(\d{1,3})\s*,\s*(\d{1,3})\s*(?:,\s*[\d.]+)?\s*\)/i);
        if (!match) {
            throw new Error("无效的RGB格式，必须是rgb(r,g,b)或rgba(r,g,b,a)形式");
        }
        const [r, g, b] = match.slice(1, 4).map(Number);
        if (r > 255 || g > 255 || b > 255) {
            throw new Error("RGB值必须在0-255之间！");
        }
        return { r, g, b };
    }

    function parseHSL(str) {
        const match = str.match(/hsl\(\s*(\d{1,3})\s*,\s*(\d{1,3})%?\s*,\s*(\d{1,3})%?\s*\)/i);
        if (!match) {
            throw new Error("无效的HSL格式，必须是hsl(h,s%,l%)形式");
        }
        const h = parseInt(match[1]);
        const s = parseInt(match[2]);
        const l = parseInt(match[3]);
        if (h > 360 || s > 100 || l > 100) {
            throw new Error("HSL值范围错误：色调0-360，饱和度和亮度0-100！");
        }
        return { h, s, l };
    }

    function hexToRgb(hex) {
        hex = hex.replace(/^#/, '');
        const bigint = parseInt(hex, 16);
        const r = (bigint >> 16) & 255;
        const g = (bigint >> 8) & 255;
        const b = bigint & 255;
        return { r, g, b };
    }

    function rgbToHex(r, g, b) {
        return "#" + [r, g, b].map(x => {
            const hex = x.toString(16);
            return hex.length === 1 ? "0" + hex : hex;
        }).join('').toUpperCase();
    }

    function rgbToHsl(r, g, b) {
        r /= 255; g /= 255; b /= 255;
        const max = Math.max(r, g, b), min = Math.min(r, g, b);
        let h, s, l = (max + min) / 2;
        if (max === min) {
            h = s = 0; // 无色
        } else {
            const d = max - min;
            s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
            if (max === r) {
                h = (g - b) / d + (g < b ? 6 : 0);
            } else if (max === g) {
                h = (b - r) / d + 2;
            } else {
                h = (r - g) / d + 4;
            }
            h /= 6;
        }
        return { h: Math.round(h * 360), s: Math.round(s * 100), l: Math.round(l * 100) };
    }

    function hslToRgb(h, s, l) {
        h /= 360; s /= 100; l /= 100;
        let r, g, b;
        if (s === 0) {
            r = g = b = l; // 无色
        } else {
            const hue2rgb = function(p, q, t) {
                if (t < 0) t += 1;
                if (t > 1) t -= 1;
                if (t < 1/6) return p + (q - p) * 6 * t;
                if (t < 1/2) return q;
                if (t < 2/3) return p + (q - p) * (2/3 - t) * 6;
                return p;
            };
            const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
            const p = 2 * l - q;
            r = hue2rgb(p, q, h + 1/3);
            g = hue2rgb(p, q, h);
            b = hue2rgb(p, q, h - 1/3);
        }
        return { r: Math.round(r * 255), g: Math.round(g * 255), b: Math.round(b * 255) };
    }

    // ========== 注册油猴菜单 ==========
    if (typeof GM_registerMenuCommand !== "undefined") {
        GM_registerMenuCommand("16进制颜色预览与调试", showDebugColorUI);
        GM_registerMenuCommand("16进制颜色大全展示", showColorCollectionUI);
        GM_registerMenuCommand("颜色格式转换", showColorConverterUI);
    } else {
        console.error("GM_registerMenuCommand 不可用。");
    }
})();