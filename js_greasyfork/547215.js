// ==UserScript==
// @license MIT
// @name         实验花瓣多功能轮盘 V2
// @namespace    http://tampermonkey.net/
// @version      7.0
// @description  为花瓣图片添加拖动轮盘交互，支持将图片拖动到轮盘扇区调用不同功能。
// @author       You
// @match        https://huaban.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/547215/%E5%AE%9E%E9%AA%8C%E8%8A%B1%E7%93%A3%E5%A4%9A%E5%8A%9F%E8%83%BD%E8%BD%AE%E7%9B%98%20V2.user.js
// @updateURL https://update.greasyfork.org/scripts/547215/%E5%AE%9E%E9%AA%8C%E8%8A%B1%E7%93%A3%E5%A4%9A%E5%8A%9F%E8%83%BD%E8%BD%AE%E7%9B%98%20V2.meta.js
// ==/UserScript==

(function () {
    'use strict';
    // 移除页面限制，允许在所有花瓣页面运行
    // if (location.href.includes('/pins/')) return;

    const OPACITY = 0.2;
    const imgHTMLMap = new WeakMap();

    // 轮盘主题配置
    const THEME_MODE = '浅色';  // 可选值：'浅色' 或 '深色'

    // 文件夹前缀标识配置
    const PREFIX_SEPARATOR = '---';  // 前缀分隔符，请勿删除
    const FOLDER_CONFIG = {
        '1': { label: '导入PS', icon: 'https://files.getquicker.net/_icons/1096CBE4588E947CB8D5F95662A9334C73F5455B.png' },
        '2': { label: '贴图', icon: 'https://files.getquicker.net/_icons/CA42B74E62C8593AF1FF56B8CBD6D1E2F021A7CD.png' },
        '3': { label: '下载', icon: 'https://files.getquicker.net/_icons/11F9114FFD29492BA0A2022700667BBE207F73AC.png' },
        '4': { label: '剪贴板', icon: 'https://files.getquicker.net/_icons/6E999D76E20CA8CA766A3A37C99899C18337E629.png' },
        '5': { label: '暂无', icon: 'https://files.getquicker.net/_icons/D28DC400482617B924675708232F954FCFE114EE.png' },
        '6': { label: '暂无', icon: 'https://files.getquicker.net/_icons/D28DC400482617B924675708232F954FCFE114EE.png' }
    };

    // 图标缓存
    const iconCache = new Map();

    // 兼容性：从FOLDER_CONFIG提取标签和图标
    const FOLDER_LABELS = Object.fromEntries(
        Object.entries(FOLDER_CONFIG).map(([key, config]) => [key, config.label])
    );
    // 初始默认配置的不可变快照，供“恢复初始设置”使用
    const INITIAL_FOLDER_CONFIG = JSON.parse(JSON.stringify(FOLDER_CONFIG));

    const FOLDER_ICONS = Object.fromEntries(
        Object.entries(FOLDER_CONFIG).map(([key, config]) => [key, config.icon])
    );
    let isDragging = false;
    let draggedElement = null;
    let turntableVisible = false;
    let turntableCanvas = null;
    let turntableDialog = null;
    // 文档级监听引用（用于盲操扩展区域）
    let docDragOverHandler = null;
    let docDropHandler = null;

    // 轮盘配置
    const turntableConfig = {
        centerX: 0,
        centerY: 0,
        outerRadius: 120,
        innerRadius: 40,
        sectorCount: 6,
        colors: {
            // 浅色主题
            light: {
                background: "#ffffff",
                backgroundHover: "#e5e5e5",
                stroke: "#737373",
                text: "#333"
            },
            // 深色主题
            dark: {
                background: "#262626",
                backgroundHover: "#404040",
                stroke: "#737373",
                text: "#f5f5f5"
            }
        },
        fontSize: "12px Arial, sans-serif"
    };

    // 根据主题模式获取当前颜色配置
    let getCurrentColors = () => {
        return THEME_MODE === '深色' ? turntableConfig.colors.dark : turntableConfig.colors.light;
    };

    // 更新轮盘大小函数
    function getScaledRadii(sizeLevel) {
        const baseOuterRadius = 120; // 基础外半径（正常大小）
        const baseInnerRadius = 40;  // 基础内半径（正常大小）
        let scaleFactor;
        if (sizeLevel <= 3) {
            // 1-3级：从0.4倍线性增长到1.0倍
            scaleFactor = 0.4 + (sizeLevel - 1) * 0.3;
        } else {
            // 4-10级：从1.0倍线性增长到2.0倍
            scaleFactor = 1.0 + (sizeLevel - 3) * (1.0 / 7);
        }
        return {
            outerRadius: Math.round(baseOuterRadius * scaleFactor),
            innerRadius: Math.round(baseInnerRadius * scaleFactor)
        };
    }

    function updateTurntableSize(sizeLevel) {
        const { outerRadius, innerRadius } = getScaledRadii(sizeLevel);

        turntableConfig.outerRadius = outerRadius;
        turntableConfig.innerRadius = innerRadius;

        // 如果轮盘正在显示，重新渲染
        if (turntableCanvas && turntableVisible) {
            const ctx = turntableCanvas.getContext('2d');
            renderTurntable(ctx, null);
        }
    }

    // 预览轮盘相关函数（简化版预览）
    let previewTimeout = null;
    let previewRafId = 0; // rAF 节流ID
    let pendingPreviewSize = null; // 等待渲染的尺寸
    let isPreviewMode = false;
    let currentPreviewSize = null;
    let previewCanvas = null;
    let previewDialog = null;
    let lastPreviewCanvasSize = 0; // 上次预览画布尺寸缓存

    // 简化的预览轮盘渲染函数
    function renderPreviewTurntable(ctx, sizeLevel) {
        // 使用统一的轮盘大小计算逻辑
        const { outerRadius, innerRadius } = getScaledRadii(sizeLevel);

        // 调整画布大小以适应轮盘（只在尺寸变化时更新）
        const canvasSize = Math.max(200, (outerRadius + 20) * 2);
        if (ctx.canvas.width !== canvasSize || ctx.canvas.height !== canvasSize) {
            ctx.canvas.width = canvasSize;
            ctx.canvas.height = canvasSize;
            ctx.canvas.style.width = canvasSize + 'px';
            ctx.canvas.style.height = canvasSize + 'px';
        }

        const centerX = canvasSize / 2;
        const centerY = canvasSize / 2;
        const sectorCount = 6;

        ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);

        // 获取当前主题颜色
        const colors = getCurrentColors();

        // 定义扇形颜色（简化版，使用固定颜色）
        const sectorColors = [
            colors.background,
            colors.backgroundHover,
            colors.background,
            colors.backgroundHover,
            colors.background,
            colors.backgroundHover
        ];

        // 绘制扇形
        const anglePerSector = 2 * Math.PI / sectorCount;
        for (let i = 0; i < sectorCount; i++) {
            const startAngle = i * anglePerSector;
            const endAngle = startAngle + anglePerSector;

            ctx.beginPath();
            ctx.moveTo(centerX, centerY);
            ctx.arc(centerX, centerY, outerRadius, startAngle, endAngle);
            ctx.closePath();

            // 使用主题颜色
            ctx.fillStyle = sectorColors[i];
            ctx.fill();

            // 绘制边框
            ctx.strokeStyle = colors.stroke;
            ctx.lineWidth = 1;
            ctx.stroke();

            // 绘制简化的文字标签
            const angle = startAngle + anglePerSector / 2;
            const textRadius = outerRadius * 0.7;
            const textX = centerX + Math.cos(angle) * textRadius;
            const textY = centerY + Math.sin(angle) * textRadius;

            ctx.fillStyle = colors.text;
            ctx.font = Math.max(10, Math.round(outerRadius / 10)) + 'px Arial';
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            ctx.fillText(`F${i + 1}`, textX, textY);
        }

        // 绘制中心圆
        ctx.beginPath();
        ctx.arc(centerX, centerY, innerRadius, 0, 2 * Math.PI);
        ctx.fillStyle = colors.background;
        ctx.fill();
        ctx.strokeStyle = colors.stroke;
        ctx.lineWidth = 2;
        ctx.stroke();

        // 绘制中心文字
        ctx.fillStyle = colors.text;
        ctx.font = '10px Arial';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText('预览', centerX, centerY);
    }

    function showPreviewTurntable(sizeLevel) {
        // 清除之前的定时器（不再使用自动关闭，仅清理遗留）
        if (previewTimeout) {
            clearTimeout(previewTimeout);
            previewTimeout = null;
        }

        isPreviewMode = true;
        currentPreviewSize = sizeLevel;

        // 如果预览还没有显示，创建预览
        if (!previewDialog) {
            const settingsWindow = document.getElementById('settingsWindow');
            if (settingsWindow) {
                const rect = settingsWindow.getBoundingClientRect();

                // 创建预览对话框（去除过渡/淡入）
                previewDialog = document.createElement('div');
                previewDialog.style.cssText = `
                    position: fixed;
                    left: ${rect.right + 20}px;
                    top: ${rect.top + rect.height / 2}px;
                    background: rgba(0, 0, 0, 0.05);
                    border-radius: 50%;
                    z-index: 10001;
                    pointer-events: none;
                    transform: translate(0, -50%);
                    transition: none;
                    contain: layout paint; /* 限制布局/绘制范围，提升性能 */
                `;

                // 创建预览画布
                previewCanvas = document.createElement('canvas');
                previewCanvas.style.cssText = `
                    border-radius: 50%;
                    display: block;
                `;

                previewDialog.appendChild(previewCanvas);
                document.body.appendChild(previewDialog);
            }
        } else {
            // 如果预览已存在，更新位置
            const settingsWindow = document.getElementById('settingsWindow');
            if (settingsWindow) {
                const rect = settingsWindow.getBoundingClientRect();
                previewDialog.style.left = rect.right + 20 + 'px';
                previewDialog.style.top = rect.top + rect.height / 2 + 'px';
            }
        }

        // 渲染预览轮盘
        if (previewCanvas) {
            const ctx = previewCanvas.getContext('2d');
            renderPreviewTurntable(ctx, sizeLevel);

            // 更新预览对话框的大小以匹配画布（只在尺寸变化时更新）
            if (previewDialog) {
                const canvasSize = ctx.canvas.width;
                const currentWidth = parseInt(previewDialog.style.width) || 0;
                if (currentWidth !== canvasSize) {
                    previewDialog.style.width = canvasSize + 'px';
                    previewDialog.style.height = canvasSize + 'px';
                }
            }
        }
    }

    function hidePreviewTurntable() {
        if (!isPreviewMode) return; // 避免重复调用

        isPreviewMode = false;
        currentPreviewSize = null;

        // 清除自动关闭定时器
        if (previewTimeout) {
            clearTimeout(previewTimeout);
            previewTimeout = null;
        }

        // 隐藏预览（立即移除，无过渡动画）
        if (previewDialog) {
            if (previewDialog.parentNode) {
                previewDialog.parentNode.removeChild(previewDialog);
            }
            previewDialog = null;
            previewCanvas = null;
        }
    }

    function updatePreviewTurntable(sizeLevel) {
        // 使用 rAF 节流，减少计时器开销并保证与屏幕刷新同步
        pendingPreviewSize = sizeLevel;
        if (previewRafId) return;

        previewRafId = requestAnimationFrame(() => {
            const value = pendingPreviewSize != null ? pendingPreviewSize : sizeLevel;
            pendingPreviewSize = null;
            previewRafId = 0;

            // 如果已有预览，仅更新画布；否则创建
            if (previewCanvas) {
                const ctx = previewCanvas.getContext('2d');
                renderPreviewTurntable(ctx, value);

                if (previewDialog) {
                    const canvasSize = ctx.canvas.width;
                    if (lastPreviewCanvasSize !== canvasSize) {
                        previewDialog.style.width = canvasSize + 'px';
                        previewDialog.style.height = canvasSize + 'px';
                        lastPreviewCanvasSize = canvasSize;
                    }
                }
                currentPreviewSize = value;
            } else {
                showPreviewTurntable(value);
            }
        });
    }

    // 文件夹数据（标签从 FOLDER_LABELS 获取，确保配置统一）
    const folderData = [
        { id: '1', label: FOLDER_LABELS['1'] },
        { id: '2', label: FOLDER_LABELS['2'] },
        { id: '3', label: FOLDER_LABELS['3'] },
        { id: '4', label: FOLDER_LABELS['4'] },
        { id: '5', label: FOLDER_LABELS['5'] },
        { id: '6', label: FOLDER_LABELS['6'] }
    ];

    // 样式
    const style = document.createElement('style');
    style.textContent = `
        .huaban-img-container {
            position: relative;
            cursor: grab;
        }
        .huaban-img-container:active {
            cursor: grabbing;
        }
        .huaban-img-container.dragging {
            opacity: 0.7;
            transform: scale(0.95);
            transition: all 0.2s ease;
        }
        .huaban-img-container:hover {
            transform: scale(1.02);
            transition: transform 0.2s ease;
        }
        .turntable-dialog {
            position: fixed;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background: rgba(0, 0, 0, 0.3);
            z-index: 999999;
            display: none;
            pointer-events: none;
        }
        .turntable-canvas {
            position: absolute;
            pointer-events: auto;
            border-radius: 50%;
            box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
        }

        /* 设置按钮样式 */
        #settingsBtn {
            position: fixed;
            bottom: 20px;
            right: 20px;
            width: 50px;
            height: 50px;
            background: url('https://files.getquicker.net/_icons/B27B8889C10C8E6194235FD601BAA804CCD50200.png') no-repeat center;
            background-size: 32px 32px;
            background-color: rgba(255, 255, 255, 0.9);
            border: none;
            border-radius: 50%;
            cursor: pointer;
            z-index: 10001;
            box-shadow: 0 4px 16px rgba(0, 0, 0, 0.15);
            transition: all 0.3s ease;
            font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
            user-select: none;
        }
        #settingsBtn:hover {
            background-color: rgba(255, 255, 255, 1);
            transform: translateY(-1px);
            box-shadow: 0 6px 20px rgba(0, 0, 0, 0.2);
        }

        #settingsBtn.hidden {
            opacity: 0.3;
        }
        #settingsBtn.hidden:hover {
            opacity: 1;
        }
        #settingsBtn.hidden[data-side="left"] {
            transform: translate(-35px, var(--current-y)) !important;
        }
        #settingsBtn.hidden[data-side="left"]:hover {
            transform: translate(0px, var(--current-y)) !important;
        }
        #settingsBtn.hidden[data-side="right"] {
            transform: translate(calc(100vw - 15px), var(--current-y)) !important;
        }
        #settingsBtn.hidden[data-side="right"]:hover {
            transform: translate(calc(100vw - 50px), var(--current-y)) !important;
        }

        /* 设置窗口样式 */
        #settingsModal {
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0,0,0,0.3);
            z-index: 10002;
            display: none;
            align-items: center;
            justify-content: center;
            font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
        }
        .settings-window {
            background: rgba(255, 255, 255, 0.85);
            backdrop-filter: blur(20px);
            -webkit-backdrop-filter: blur(20px);
            border-radius: 16px;
            box-shadow: 0 8px 32px rgba(0, 0, 0, 0.12), 0 2px 8px rgba(0, 0, 0, 0.08);
            border: 1px solid rgba(255, 255, 255, 0.2);
            width: 800px;
            max-width: 90vw;
            min-height: 600px;
            overflow: hidden;
        }
        .window-header {
            padding: 18px 24px;
            border-bottom: 1px solid rgba(0, 0, 0, 0.08);
            display: flex;
            justify-content: space-between;
            align-items: center;
            background: rgba(255, 255, 255, 0.6);
        }
        .window-title {
            font-size: 17px;
            font-weight: 600;
            color: #1d1d1f;
            letter-spacing: -0.02em;
        }
        .close-btn {
            width: 20px;
            height: 20px;
            border-radius: 50%;
            display: flex;
            justify-content: center;
            align-items: center;
            cursor: pointer;
            transition: all 0.2s ease;
            background: rgba(255, 95, 87, 0.9);
            border: none;
        }
        .close-btn:hover {
            background: rgba(255, 95, 87, 1);
            transform: scale(1.1);
        }
        .close-btn svg {
            width: 10px;
            height: 10px;
            fill: #ffffff;
        }
        .window-content {
            padding: 24px;
        }
        .tab-container {
            display: flex;
            border-bottom: 1px solid rgba(0, 0, 0, 0.08);
            margin: -24px -24px 24px -24px;
        }
        .tab-button {
            flex: 1;
            padding: 16px 24px;
            background: none;
            border: none;
            font-size: 15px;
            font-weight: 500;
            color: #6e6e73;
            cursor: pointer;
            transition: all 0.2s ease;
            border-bottom: 2px solid transparent;
        }
        .tab-button.active {
            color: #1d1d1f;
            border-bottom-color: #3531d1;
            font-weight: 600;
        }
        .tab-button:hover {
            color: #1d1d1f;
            background: rgba(245, 245, 247, 0.5);
        }
        /* Compact variant: proportionally scale down settings window */
        .settings-window.compact { transform: scale(0.8); transform-origin: center; }
        @media (max-width: 860px) { .settings-window.compact { transform: scale(0.9); } }
        .tab-content {
            display: none;
        }
        .tab-content.active {
            display: block;
        }
        .section {
            margin-bottom: 25px;
        }
        .section-title {
            font-size: 15px;
            font-weight: 600;
            color: #1d1d1f;
            margin-bottom: 16px;
            letter-spacing: -0.01em;
        }
        .theme-selector {
            margin-bottom: 20px;
        }
        .icon-settings {
            margin-bottom: 20px;
        }
        .icon-settings-row {
            display: flex;
            align-items: center;
            gap: 20px;
        }
        .config-buttons {
            display: flex;
            gap: 10px;
        }
        .config-btn {
            padding: 12px 20px;
            border: none;
            border-radius: 28px;
            background: rgba(255, 255, 255, 0.25);
            backdrop-filter: blur(6px);
            box-shadow: inset 0 1px 2px rgba(255,255,255,0.6), inset 0 -1px 2px rgba(0,0,0,0.1), 0 4px 10px rgba(0,0,0,0.15);
            color: #424245;
            font-size: 13px;
            font-weight: 600;
            cursor: pointer;
            transition: all 0.3s ease;
            user-select: none;
            white-space: nowrap;
            display: inline-flex;
            align-items: center;
            justify-content: center;
            min-height: 44px;
        }
        .export-config-btn {
            color: #007aff;
        }
        .export-config-btn:hover {
            background: rgba(0, 122, 255, 0.15);
            box-shadow: inset 0 1px 2px rgba(255,255,255,0.8), inset 0 -1px 2px rgba(0,0,0,0.15), 0 6px 15px rgba(0, 122, 255, 0.25);
        }
        .import-config-btn {
            color: #34c759;
        }
        .import-config-btn:hover {
            background: rgba(52, 199, 89, 0.15);
            box-shadow: inset 0 1px 2px rgba(255,255,255,0.8), inset 0 -1px 2px rgba(0,0,0,0.15), 0 6px 15px rgba(52, 199, 89, 0.25);
        }
        .reset-config-btn {
            color: #ff3b30;
        }
        .reset-config-btn:hover {
            background: rgba(255, 59, 48, 0.15);
            box-shadow: inset 0 1px 2px rgba(255,255,255,0.8), inset 0 -1px 2px rgba(0,0,0,0.15), 0 6px 15px rgba(255, 59, 48, 0.25);
        }
        .config-btn:active {
            box-shadow: inset 0 1px 2px rgba(255,255,255,0.4), inset 0 -1px 2px rgba(0,0,0,0.2), 0 2px 5px rgba(0,0,0,0.1);
        }
        .checkbox-container {
            display: flex;
            align-items: center;
            cursor: pointer;
            font-size: 14px;
            color: #424245;
            user-select: none;
        }
        .checkbox-container input[type="checkbox"] {
            display: none;
        }
        .checkmark {
            width: 18px;
            height: 18px;
            border: 2px solid #d1d1d6;
            border-radius: 4px;
            margin-right: 10px;
            position: relative;
            transition: all 0.2s ease;
        }
        .checkbox-container:hover .checkmark {
            border-color: #007aff;
        }
        .checkbox-container input[type="checkbox"]:checked + .checkmark {
            background-color: #007aff;
            border-color: #007aff;
        }
        .checkbox-container input[type="checkbox"]:checked + .checkmark::after {
            content: '';
            position: absolute;
            left: 5px;
            top: 2px;
            width: 4px;
            height: 8px;
            border: solid white;
            border-width: 0 2px 2px 0;
            transform: rotate(45deg);
        }
        .checkbox-label {
            font-weight: 500;
        }
        .theme-label {
            font-size: 14px;
            color: #424245;
            margin-bottom: 8px;
            display: block;
        }
        .custom-dropdown {
            position: relative;
            width: 100%;
        }
        .dropdown-selected {
            width: 100%;
            padding: 14px 18px;
            border: 1px solid rgba(0, 0, 0, 0.08);
            border-radius: 16px;
            background: rgba(255, 255, 255, 0.9);
            backdrop-filter: blur(20px);
            font-size: 15px;
            font-weight: 500;
            color: #1d1d1f;
            cursor: pointer;
            display: flex;
            justify-content: space-between;
            align-items: center;
            transition: all 0.3s ease;
            box-shadow: 0 2px 12px rgba(0, 0, 0, 0.04);
        }
        .dropdown-selected:hover {
            border-color: rgba(53, 49, 209, 0.3);
            box-shadow: 0 4px 16px rgba(0, 0, 0, 0.06);
        }
        .dropdown-selected.active {
            border-color: #3531d1;
            box-shadow: 0 0 0 4px rgba(53, 49, 209, 0.15), 0 4px 20px rgba(0, 0, 0, 0.08);
            background: rgba(255, 255, 255, 1);
        }
        .dropdown-arrow {
            width: 14px;
            height: 14px;
            color: #424245;
            transition: transform 0.3s ease;
        }
        .dropdown-selected.active .dropdown-arrow {
            transform: rotate(180deg);
        }
        .dropdown-options {
            position: absolute;
            top: 100%;
            left: 0;
            right: 0;
            background: rgba(255, 255, 255, 0.95);
            backdrop-filter: blur(20px);
            border: 1px solid rgba(0, 0, 0, 0.08);
            border-radius: 12px;
            box-shadow: 0 8px 32px rgba(0, 0, 0, 0.12);
            z-index: 1000;
            margin-top: 4px;
            opacity: 0;
            visibility: hidden;
            transform: translateY(-8px);
            transition: all 0.3s ease;
        }
        .dropdown-options.show {
            opacity: 1;
            visibility: visible;
            transform: translateY(0);
        }
        .dropdown-option {
            padding: 12px 16px;
            font-size: 15px;
            font-weight: 500;
            color: #1d1d1f;
            cursor: pointer;
            transition: all 0.2s ease;
            border-radius: 8px;
            margin: 4px;
        }
        .dropdown-option:hover {
            background: rgba(53, 49, 209, 0.1);
            color: #3531d1;
        }
        .dropdown-option.selected {
            background: #3531d1;
            color: #ffffff;
        }
        .sectors-grid {
            display: grid;
            grid-template-columns: repeat(2, 1fr);
            gap: 20px;
        }
        .sector-item {
            background: rgba(245, 245, 247, 0.6);
            backdrop-filter: blur(10px);
            border-radius: 12px;
            padding: 16px;
            display: flex;
            flex-direction: column;
            gap: 12px;
            border: 1px solid rgba(255, 255, 255, 0.3);
            transition: all 0.2s ease;
        }
        .sector-item:hover {
            background: rgba(245, 245, 247, 0.8);
            transform: translateY(-1px);
            box-shadow: 0 4px 16px rgba(0, 0, 0, 0.08);
        }
        .sector-icon {
            width: 24px;
            height: 24px;
            border-radius: 6px;
            background-size: cover;
            background-position: center;
            background-repeat: no-repeat;
            box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
            flex-shrink: 0;
        }
        .sector-header {
            display: flex;
            align-items: center;
            gap: 12px;
        }
        .sector-info {
            flex: 1;
        }
        .sector-name {
            font-size: 13px;
            font-weight: 600;
            color: #1d1d1f;
            margin-bottom: 0;
            letter-spacing: -0.01em;
        }
        .sector-inputs {
            display: flex;
            gap: 10px;
            align-items: flex-end;
        }
        .input-group {
            display: flex;
            flex-direction: column;
            gap: 6px;
        }
        .input-group.name-input {
            flex: 0 0 120px;
        }
        .input-group.icon-input {
            flex: 1;
            min-width: 200px;
        }
        .input-label {
            font-size: 14px;
            color: #6e6e73;
            font-weight: 500;
            letter-spacing: -0.01em;
        }
        .sector-input {
            width: 100%;
            padding: 10px 12px;
            border: 1px solid rgba(0, 0, 0, 0.1);
            border-radius: 8px;
            background: rgba(255, 255, 255, 0.8);
            backdrop-filter: blur(10px);
            font-size: 15px;
            color: #1d1d1f;
            transition: all 0.2s ease;
        }
        .sector-input:focus {
            outline: none;
            border-color: rgba(52, 199, 89, 0.6);
            box-shadow: 0 0 0 3px rgba(52, 199, 89, 0.1);
            background: rgba(255, 255, 255, 0.95);
        }
        .icon-input-container {
            display: flex;
            align-items: center;
            gap: 12px;
        }
        .icon-url-input {
            flex: 1;
        }
        .icon-preview {
            width: 32px;
            height: 32px;
            border: 1px solid rgba(0, 0, 0, 0.1);
            border-radius: 6px;
            display: flex;
            align-items: center;
            justify-content: center;
            background: rgba(245, 245, 247, 0.8);
            flex-shrink: 0;
            overflow: hidden;
        }
        .icon-preview img {
            width: 100%;
            height: 100%;
            object-fit: cover;
            border-radius: 4px;
        }
        .icon-preview:empty::after {
            content: '🖼️';
            font-size: 16px;
            color: #999;
        }
        .save-btn {
            width: 100%;
            padding: 14px;
            background: #3531d1;
            color: #ffffff;
            border: none;
            border-radius: 12px;
            font-size: 15px;
            font-weight: 600;
            cursor: pointer;
            transition: all 0.2s ease;
            box-shadow: 0 4px 16px rgba(53, 49, 209, 0.3);
            letter-spacing: -0.01em;
        }
        .save-btn:hover {
            background: #2d28b8;
            transform: translateY(-1px);
            box-shadow: 0 6px 20px rgba(53, 49, 209, 0.4);
        }
        .save-btn:active {
            transform: translateY(0);
        }
        .button-group {
            display: flex;
            gap: 10px;
            flex-direction: column;
        }

        /* 深色模式样式 */
        .settings-window.dark {
            background: rgba(28, 28, 30, 0.85);
            backdrop-filter: blur(20px);
            border: 1px solid rgba(255, 255, 255, 0.1);
        }
        .settings-window.dark .window-header {
            background: rgba(28, 28, 30, 0.6);
            border-bottom: 1px solid rgba(255, 255, 255, 0.08);
        }
        .settings-window.dark .window-title {
            color: #ffffff;
        }
        .settings-window.dark .section-title {
            color: #ffffff;
        }
        .settings-window.dark .theme-label {
            color: #f5f5f7;
        }
        .settings-window.dark .checkbox-container {
            color: #f5f5f7;
        }
        .settings-window.dark .checkmark {
            border-color: rgba(255, 255, 255, 0.3);
        }
        .settings-window.dark .checkbox-container:hover .checkmark {
            border-color: #0a84ff;
        }
        .settings-window.dark .checkbox-container input[type="checkbox"]:checked + .checkmark {
            background-color: #0a84ff;
            border-color: #0a84ff;
        }
        .settings-window.dark .tab-container {
            border-bottom: 1px solid rgba(255, 255, 255, 0.08);
        }
        .settings-window.dark .tab-button {
            color: #c7c7cc;
        }
        .settings-window.dark .tab-button.active {
            color: #ffffff;
        }
        .settings-window.dark .tab-button:hover {
            color: #ffffff;
            background: rgba(44, 44, 46, 0.5);
        }
        .settings-window.dark .dropdown-selected {
            background: rgba(44, 44, 46, 0.9);
            backdrop-filter: blur(20px);
            border-color: rgba(255, 255, 255, 0.12);
            color: #ffffff;
            box-shadow: 0 2px 12px rgba(0, 0, 0, 0.2);
        }
        .settings-window.dark .dropdown-selected:hover {
            border-color: rgba(53, 49, 209, 0.4);
            box-shadow: 0 4px 16px rgba(0, 0, 0, 0.25);
        }
        .settings-window.dark .dropdown-selected.active {
            border-color: #3531d1;
            box-shadow: 0 0 0 4px rgba(53, 49, 209, 0.25), 0 4px 20px rgba(0, 0, 0, 0.3);
            background: rgba(44, 44, 46, 1);
        }
        .settings-window.dark .dropdown-arrow {
            color: #f5f5f7;
        }
        .settings-window.dark .dropdown-options {
            background: rgba(44, 44, 46, 0.95);
            border-color: rgba(255, 255, 255, 0.12);
            box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
        }
        .settings-window.dark .dropdown-option {
            color: #ffffff;
        }
        .settings-window.dark .dropdown-option:hover {
            background: rgba(53, 49, 209, 0.2);
            color: #5b4fe3;
        }
        .settings-window.dark .dropdown-option.selected {
            background: #3531d1;
            color: #ffffff;
        }
        .settings-window.dark .sectors-grid .sector-item {
            background: rgba(44, 44, 46, 0.6);
            border: 1px solid rgba(255, 255, 255, 0.1);
        }
        .settings-window.dark .sector-item:hover {
            background: rgba(44, 44, 46, 0.8);
        }
        .settings-window.dark .sector-name {
            color: #ffffff;
        }
        .settings-window.dark .input-label {
            color: #c7c7cc;
        }
        .settings-window.dark .sector-input {
            background: rgba(28, 28, 30, 0.8);
            backdrop-filter: blur(10px);
            border-color: rgba(255, 255, 255, 0.1);
            color: #ffffff;
        }
        .settings-window.dark .sector-input:focus {
            border-color: rgba(52, 199, 89, 0.6);
            background: rgba(28, 28, 30, 0.95);
        }
        .settings-window.dark .icon-preview {
            background: rgba(28, 28, 30, 0.8);
            border-color: rgba(255, 255, 255, 0.1);
        }
        .settings-window.dark .icon-preview:empty::after {
            color: #666;
        }
        /* 联系作者页面样式 */
        .contact-content {
            padding: 0;
        }
        .contact-intro {
            color: #6e6e73;
            font-size: 15px;
            margin-bottom: 28px;
            text-align: center;
            line-height: 1.5;
        }
        .contact-cards {
            display: flex;
            flex-wrap: wrap;
            justify-content: center;
            gap: 20px;
            margin-bottom: 24px;
        }
        .contact-card {
            flex: 1 1 220px;
            background: rgba(255, 255, 255, 0.7);
            backdrop-filter: blur(15px);
            border-radius: 16px;
            padding: 20px 16px;
            box-shadow: 0 4px 16px rgba(0, 0, 0, 0.06);
            border: 1px solid rgba(255, 255, 255, 0.3);
            transition: all 0.3s ease;
        }
        .contact-card:hover {
            transform: translateY(-2px);
            box-shadow: 0 8px 24px rgba(0, 0, 0, 0.1);
        }
        .card-header {
            margin-bottom: 12px;
            font-weight: 600;
            font-size: 14px;
            color: #6e6e73;
            letter-spacing: 0.5px;
            display: flex;
            align-items: center;
        }
        .qq-icon {
            width: 16px;
            height: 16px;
            vertical-align: middle;
            margin-right: 6px;
        }
        .card-content {
            font-size: 20px;
            font-weight: bold;
            padding: 12px 16px;
            background: rgba(255, 255, 255, 0.9);
            color: #1d1d1f;
            border-radius: 12px;
            box-shadow: 0 2px 8px rgba(0, 0, 0, 0.04);
            letter-spacing: 1px;
            text-align: center;
            display: flex;
            align-items: center;
            justify-content: center;
            min-height: 60px;
            transition: all 0.3s ease;
        }
        .qq-link {
            display: block;
            width: 100%;
            height: 100%;
            text-decoration: none;
            color: inherit;
        }
        .qq-link:hover {
            color: #3531d1;
        }
        .contact-description {
            color: #6e6e73;
            font-size: 14px;
            line-height: 1.8;
            text-align: center;
        }
        .highlight-badge {
            background: linear-gradient(135deg, #3531d1, #5b4fe3);
            color: #ffffff;
            padding: 4px 12px;
            border-radius: 8px;
            font-weight: 600;
            margin: 0 4px;
            display: inline-block;
        }
        /* 深色模式下的联系作者页面样式 */
        .settings-window.dark .contact-intro {
            color: #c7c7cc;
        }
        .settings-window.dark .contact-card {
            background: rgba(44, 44, 46, 0.7);
            border: 1px solid rgba(255, 255, 255, 0.1);
        }
        .settings-window.dark .contact-card:hover {
            box-shadow: 0 8px 24px rgba(0, 0, 0, 0.3);
        }
        .settings-window.dark .card-header {
            color: #c7c7cc;
        }
        .settings-window.dark .card-content {
            background: rgba(28, 28, 30, 0.9);
            color: #ffffff;
            box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
            display: flex;
            align-items: center;
            justify-content: center;
            min-height: 60px;
        }
        .settings-window.dark .qq-link:hover {
            color: #5b4fe3;
        }
        .settings-window.dark .contact-description {
            color: #c7c7cc;
        }

        /* 注意事项板块样式 */
        .notice-section {
            margin-top: 32px;
            padding: 24px;
            background: rgba(255, 255, 255, 0.8);
            backdrop-filter: blur(15px);
            border-radius: 16px;
            border: 1px solid rgba(255, 255, 255, 0.3);
            box-shadow: 0 4px 16px rgba(0, 0, 0, 0.06);
        }

        .notice-title {
            font-size: 18px;
            font-weight: 600;
            color: #1d1d1f;
            margin-bottom: 16px;
            display: flex;
            align-items: center;
        }

        .notice-title::before {
            content: "⚠️";
            margin-right: 8px;
            font-size: 20px;
        }

        .notice-list {
            list-style: none;
            padding: 0;
            margin: 0;
        }

        .notice-item {
            margin-bottom: 16px;
            padding-left: 20px;
            position: relative;
            color: #6e6e73;
            line-height: 1.6;
        }

        .notice-item::before {
            content: counter(notice-counter);
            counter-increment: notice-counter;
            position: absolute;
            left: 0;
            top: 0;
            background: #3531d1;
            color: white;
            width: 18px;
            height: 18px;
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 12px;
            font-weight: 600;
        }

        .notice-list {
            counter-reset: notice-counter;
        }

        .notice-link {
            color: #3531d1;
            text-decoration: none;
            font-weight: 500;
        }

        .notice-link:hover {
            text-decoration: underline;
        }

        .notice-highlight {
            background: linear-gradient(135deg, #ff6b6b, #ff8e8e);
            color: white;
            padding: 2px 8px;
            border-radius: 6px;
            font-weight: 600;
            font-size: 13px;
        }

        /* 深色模式下的注意事项样式 */
        .settings-window.dark .notice-section {
            background: rgba(44, 44, 46, 0.8);
            border: 1px solid rgba(255, 255, 255, 0.1);
        }

        .settings-window.dark .notice-title {
            color: #ffffff;
        }

        .settings-window.dark .notice-item {
            color: #c7c7cc;
        }

        .settings-window.dark .notice-link {
            color: #5b4fe3;
        }

        .settings-window.dark .config-btn {
            background: rgba(0, 0, 0, 0.25);
            color: #f5f5f7;
        }
        .settings-window.dark .export-config-btn {
            color: #64d2ff;
        }
        .settings-window.dark .export-config-btn:hover {
            background: rgba(100, 210, 255, 0.15);
            box-shadow: inset 0 1px 2px rgba(255,255,255,0.1), inset 0 -1px 2px rgba(0,0,0,0.3), 0 6px 15px rgba(100, 210, 255, 0.25);
        }
        .settings-window.dark .import-config-btn {
            color: #30d158;
        }
        .settings-window.dark .import-config-btn:hover {
            background: rgba(48, 209, 88, 0.15);
            box-shadow: inset 0 1px 2px rgba(255,255,255,0.1), inset 0 -1px 2px rgba(0,0,0,0.3), 0 6px 15px rgba(48, 209, 88, 0.25);
        }
        .settings-window.dark .reset-config-btn {
            color: #ff453a;
        }
        .settings-window.dark .reset-config-btn:hover {
            background: rgba(255, 69, 58, 0.15);
            box-shadow: inset 0 1px 2px rgba(255,255,255,0.1), inset 0 -1px 2px rgba(0,0,0,0.3), 0 6px 15px rgba(255, 69, 58, 0.25);
        }
    `;
    document.head.appendChild(style);

    // 轮盘绘制相关函数
    function createCanvas(canvas, width, height) {
        const ratio = window.devicePixelRatio || 1;
        canvas.width = width * ratio;
        canvas.height = height * ratio;
        canvas.style.width = `${width}px`;
        canvas.style.height = `${height}px`;
        const context = canvas.getContext('2d');
        if (!context) throw new Error('Canvas context not available');
        context.setTransform(ratio, 0, 0, ratio, 0, 0);
        return context;
    }

    function wrapText(ctx, text, maxWidth, maxLines = 2) {
        const words = text.split(' ');
        const lines = [];
        let currentLine = '';

        for (const word of words) {
            const testLine = currentLine + word;
            if (ctx.measureText(testLine).width <= maxWidth) {
                currentLine = testLine;
            } else {
                if (lines.length === maxLines - 1) {
                    const ellipsis = '…';
                    let truncated = currentLine;
                    while (ctx.measureText(truncated + ellipsis).width > maxWidth && truncated.length > 0) {
                        truncated = truncated.slice(0, -1);
                    }
                    lines.push(truncated + ellipsis);
                    return lines;
                }
                lines.push(currentLine);
                currentLine = word;
            }
        }
        if (currentLine && lines.length < maxLines) {
            lines.push(currentLine);
        }
        return lines;
    }

    function drawSector(ctx, startAngle, endAngle, sector, isHovered = false) {
        const { centerX, centerY, outerRadius, innerRadius } = turntableConfig;
        const colors = getCurrentColors();
        const radius = isHovered ? outerRadius + 8 : outerRadius;

        ctx.beginPath();
        ctx.moveTo(centerX, centerY);
        ctx.arc(centerX, centerY, radius, startAngle, endAngle);
        ctx.closePath();

        ctx.fillStyle = isHovered ? colors.backgroundHover : colors.background;
        ctx.fill();
        ctx.strokeStyle = colors.stroke;
        ctx.lineWidth = 1;
        ctx.stroke();

        // 绘制文本
        const midAngle = (startAngle + endAngle) / 2;
        const textRadius = radius * 0.7;
        const textX = centerX + textRadius * Math.cos(midAngle);
        const textY = centerY + textRadius * Math.sin(midAngle);

        ctx.fillStyle = colors.text;
        ctx.font = turntableConfig.fontSize;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';

        const maxTextWidth = radius * 0.6;
        const lines = wrapText(ctx, sector.label, maxTextWidth, 2);
        const lineHeight = 14;
        const startY = textY - (lines.length - 1) * lineHeight / 2;

        lines.forEach((line, index) => {
            ctx.fillText(line, textX, startY + index * lineHeight);
        });

        // 绘制图标
        const iconUrl = FOLDER_ICONS[sector.id];
        if (iconUrl) {
            const iconAngle = startAngle + (endAngle - startAngle) / 8;
            const iconX = centerX + (radius * 0.9) * Math.cos(iconAngle);
            const iconY = centerY + (radius * 0.9) * Math.sin(iconAngle);
            const iconSize = 16;

            drawNetworkIcon(ctx, iconUrl, iconX, iconY, iconSize);
        }
    }

    function drawCenter(ctx, isHovered = false) {
        const { centerX, centerY, innerRadius } = turntableConfig;
        const colors = getCurrentColors();
        const radius = isHovered ? innerRadius + 5 : innerRadius;

        ctx.beginPath();
        ctx.arc(centerX, centerY, radius, 0, 2 * Math.PI);
        ctx.fillStyle = isHovered ? colors.backgroundHover : colors.background;
        ctx.fill();
        ctx.strokeStyle = colors.stroke;
        ctx.lineWidth = 1;
        ctx.stroke();

        // 绘制中心文本
        ctx.fillStyle = colors.text;
        ctx.font = turntableConfig.fontSize;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText('取消', centerX, centerY);
    }

    // 绘制网络图标
    function drawNetworkIcon(ctx, iconUrl, x, y, size = 16) {
        if (!iconUrl) return;

        // 检查缓存
        if (iconCache.has(iconUrl)) {
            const img = iconCache.get(iconUrl);
            if (img.complete && img.naturalWidth > 0) {
                ctx.save();

                // 根据用户设置决定是否对图标进行反色
                let shouldInvert = false;

                // 优先检查按钮状态（实时预览）
                const toggle = document.getElementById('iconInvertToggle');
                if (toggle) {
                    shouldInvert = toggle.classList.contains('active');
                } else {
                    // 如果按钮不存在，从localStorage读取
                    const saved = localStorage.getItem('huaban_turntable_config');
                    if (saved) {
                        try {
                            const config = JSON.parse(saved);
                            shouldInvert = config.iconInvert || false;
                        } catch (e) {
                            console.warn('解析设置失败:', e);
                        }
                    }
                }

                if (shouldInvert) {
                    ctx.filter = 'invert(1)';
                }

                ctx.drawImage(img, x - size/2, y - size/2, size, size);
                ctx.restore();
            }
            return;
        }

        // 加载新图片
        const img = new Image();
        img.crossOrigin = 'anonymous';
        img.onload = () => {
            iconCache.set(iconUrl, img);
            // 重新绘制轮盘以显示加载完成的图标
            if (turntableCanvas) {
                const ctx = turntableCanvas.getContext('2d');
                renderTurntable(ctx, null);
            }
        };
        img.onerror = () => {
            console.warn(`图标加载失败: ${iconUrl}`);
        };
        img.src = iconUrl;
    }

    function renderTurntable(ctx, hoveredSector = -1) {
        const { sectorCount } = turntableConfig;
        const size = (turntableConfig.outerRadius + 20) * 2;

        ctx.clearRect(0, 0, size, size);

        // 绘制扇形
        const anglePerSector = 2 * Math.PI / sectorCount;
        for (let i = 0; i < sectorCount; i++) {
            const startAngle = i * anglePerSector;
            const endAngle = startAngle + anglePerSector;
            drawSector(ctx, startAngle, endAngle, folderData[i], hoveredSector === i);
        }

        // 绘制中心
        drawCenter(ctx, hoveredSector === -1);
    }

    function getHoveredSector(mouseX, mouseY) {
        const { centerX, centerY, outerRadius, innerRadius, sectorCount } = turntableConfig;
        const dx = mouseX - centerX;
        const dy = mouseY - centerY;
        const distance = Math.sqrt(dx * dx + dy * dy);

        if (distance <= innerRadius + 5) {
            return -1; // 中心区域
        } else if (distance <= outerRadius + 300) {  // 扩大外围检测范围，支持盲操
            const angle = Math.atan2(dy, dx);
            const normalizedAngle = angle >= 0 ? angle : 2 * Math.PI + angle;
            const sectorIndex = Math.floor(normalizedAngle / (2 * Math.PI / sectorCount));
            return sectorIndex;
        }
        return null;
    }

    // 边界检测和位置修复函数
    function adjustTurntablePosition(x, y, size) {
        const margin = 20; // 距离边界的最小间距
        const halfSize = size / 2;

        // 获取视窗尺寸
        const viewportWidth = window.innerWidth;
        const viewportHeight = window.innerHeight;

        let adjustedX = x;
        let adjustedY = y;

        // 水平边界检测（独立处理，支持角落位置）
        if (x - halfSize < margin) {
            adjustedX = halfSize + margin;
        }
        if (x + halfSize > viewportWidth - margin) {
            adjustedX = viewportWidth - halfSize - margin;
        }

        // 垂直边界检测（独立处理，支持角落位置）
        if (y - halfSize < margin) {
            adjustedY = halfSize + margin;
        }
        if (y + halfSize > viewportHeight - margin) {
            adjustedY = viewportHeight - halfSize - margin;
        }

        return { x: adjustedX, y: adjustedY };
    }

    function showTurntable(x, y) {
        if (turntableVisible) return;

        turntableVisible = true;
        const size = (turntableConfig.outerRadius + 20) * 2;

        // 边界检测和位置修复
        const adjustedPosition = adjustTurntablePosition(x, y, size);
        const finalX = adjustedPosition.x;
        const finalY = adjustedPosition.y;

        // 创建对话框
        turntableDialog = document.createElement('div');
        turntableDialog.className = 'turntable-dialog';
        turntableDialog.style.display = 'block';

        // 创建画布
        turntableCanvas = document.createElement('canvas');
        turntableCanvas.className = 'turntable-canvas';
        turntableCanvas.style.left = `${finalX - size / 2}px`;
        turntableCanvas.style.top = `${finalY - size / 2}px`;

        const ctx = createCanvas(turntableCanvas, size, size);
        turntableConfig.centerX = size / 2;
        turntableConfig.centerY = size / 2;

        // 鼠标移动事件 - 优化响应速度
        let currentHoveredSector = null;
        let lastRenderTime = 0;
        const renderThrottle = 16; // 约60fps的渲染频率

        turntableCanvas.addEventListener('mousemove', (e) => {
            const now = performance.now();
            if (now - lastRenderTime < renderThrottle) return;

            const rect = turntableCanvas.getBoundingClientRect();
            const mouseX = e.clientX - rect.left;
            const mouseY = e.clientY - rect.top;
            const hoveredSector = getHoveredSector(mouseX, mouseY);

            if (hoveredSector !== currentHoveredSector) {
                currentHoveredSector = hoveredSector;
                renderTurntable(ctx, hoveredSector);
                lastRenderTime = now;
            }
        });

        // 鼠标离开事件
        turntableCanvas.addEventListener('mouseleave', () => {
            currentHoveredSector = null;
            renderTurntable(ctx, null);
        });

        // 拖放事件 - 优化性能（支持画布外盲操）
        let lastDragRenderTime = 0;
        const onCanvasDragOver = (e) => {
            e.preventDefault();

            const now = performance.now();
            if (now - lastDragRenderTime < renderThrottle) return;

            const rect = turntableCanvas.getBoundingClientRect();
            const mouseX = e.clientX - rect.left;
            const mouseY = e.clientY - rect.top;
            const hoveredSector = getHoveredSector(mouseX, mouseY);

            if (hoveredSector !== currentHoveredSector) {
                currentHoveredSector = hoveredSector;
                renderTurntable(ctx, hoveredSector);
                lastDragRenderTime = now;
            }
        };
        turntableCanvas.addEventListener('dragover', onCanvasDragOver);

        // 添加文档级dragover以支持画布外悬停计算（盲操）
        const onDocumentDragOver = (e) => {
            if (!turntableVisible) return;
            // 限频
            const now = performance.now();
            if (now - lastDragRenderTime < renderThrottle) return;

            const rect = turntableCanvas.getBoundingClientRect();
            const mouseX = e.clientX - rect.left;
            const mouseY = e.clientY - rect.top;
            const hoveredSector = getHoveredSector(mouseX, mouseY);

            if (hoveredSector !== currentHoveredSector) {
                currentHoveredSector = hoveredSector;
                renderTurntable(ctx, hoveredSector);
                lastDragRenderTime = now;
            }
        };
        docDragOverHandler = onDocumentDragOver;
        document.addEventListener('dragover', docDragOverHandler);

        const handleDropAtPoint = (clientX, clientY) => {
            const rect = turntableCanvas.getBoundingClientRect();
            const mouseX = clientX - rect.left;
            const mouseY = clientY - rect.top;
            const hoveredSector = getHoveredSector(mouseX, mouseY);

            if (hoveredSector === -1) {
                // 中心区域 - 取消操作
                console.log('取消保存');
            } else if (hoveredSector !== null && folderData[hoveredSector]) {
                // 扇形区域 - 保存到对应文件夹
                const folder = folderData[hoveredSector];

                // 获取图片链接并进行处理
                if (draggedElement) {
                    const imgHTML = imgHTMLMap.get(draggedElement);

                    // 获取图片链接
                    const imgSrc = draggedElement.src;
                    const imgSrcset = draggedElement.srcset || '';
                    const allSrcs = [imgSrc, ...imgSrcset.split(',').map(s => s.trim().split(' ')[0])];

                    // 找到有效的花瓣图片链接
                    const validSrc = allSrcs.find(url =>
                        url && url.startsWith('https://gd-hbimg.huaban.com') && !/_fw86($|\?)/.test(url)
                    );

                    if (validSrc) {
                        // 创建或更新标记元素，用于传递图片信息
                        let marker = document.querySelector('.tampermonkey-huaban-marker');
                        if (!marker) {
                            marker = document.createElement('div');
                            marker.className = 'tampermonkey-huaban-marker';
                            marker.style.display = 'none';
                            document.body.appendChild(marker);
                        }
                        // 根据文件夹类型添加前缀标识
                        const folderLabel = FOLDER_LABELS[folder.id] || FOLDER_LABELS['default'];
                        const folderPrefix = folderLabel + PREFIX_SEPARATOR;

                        marker.innerHTML = folderPrefix + (imgHTML || '');

                        // 在标记元素上添加额外的数据属性
                        marker.setAttribute('data-img-src', validSrc);
                        marker.setAttribute('data-folder-id', folder.id);
                        marker.setAttribute('data-folder-label', folder.label);

                        // 触发外部处理程序
                        window.location.href = 'quicker:runaction:e4dd155a-c6bc-4241-cd50-08dde322b5de?woda';

                        // 调用图片处理函数
                        processImageLink(validSrc, folder);
                    } else {
                        console.warn('未找到有效的图片链接');
                    }
                }
            }
        };

        turntableCanvas.addEventListener('drop', (e) => {
            e.preventDefault();
            handleDropAtPoint(e.clientX, e.clientY);
            hideTurntable();
        });

        // 文档级 drop 支持盲操（画布外释放）
        const onDocumentDrop = (e) => {
            if (!turntableVisible) return;
            e.preventDefault();
            handleDropAtPoint(e.clientX, e.clientY);
            hideTurntable();
        };
        docDropHandler = onDocumentDrop;
        document.addEventListener('drop', docDropHandler, { passive: false });

        turntableDialog.appendChild(turntableCanvas);
        document.body.appendChild(turntableDialog);

        // 初始渲染
        renderTurntable(ctx, null);

        // 添加淡入动画
        turntableDialog.style.opacity = '0';
        requestAnimationFrame(() => {
            turntableDialog.style.transition = 'opacity 0.2s ease';
            turntableDialog.style.opacity = '1';
        });
    }

    function hideTurntable() {
        if (!turntableVisible || !turntableDialog) return;

        turntableVisible = false;
        turntableDialog.style.transition = 'opacity 0.2s ease';
        turntableDialog.style.opacity = '0';

        // 清理文档级事件监听，防止泄漏
        try {
            if (docDragOverHandler) document.removeEventListener('dragover', docDragOverHandler);
            docDragOverHandler = null;
        } catch {}
        try {
            if (docDropHandler) document.removeEventListener('drop', docDropHandler);
            docDropHandler = null;
        } catch {}

        setTimeout(() => {
            if (turntableDialog && turntableDialog.parentNode) {
                turntableDialog.parentNode.removeChild(turntableDialog);
            }
            turntableDialog = null;
            turntableCanvas = null;
        }, 200);
    }

    // 图片验证函数
    const isValidImage = (img) => {
        const srcs = [img.src || '', ...(img.srcset || '').split(',').map(s => s.trim().split(' ')[0])];
        return srcs.some(url => url.startsWith('https://gd-hbimg.huaban.com') && !/_fw86($|\?)/.test(url));
    };

    const isExcluded = (img) => {
        const selectors = [
            '#__next > main > div.wrapper > div > div.vB0yuKZj',
            '#__next > main > div.mmxqWRkC > div',
            '#pin_detail > div.xSGn1h2H',
            '[id^="rc-tabs-"][id$="-panel-board"]'
        ];
        return selectors.some(sel => {
            const el = document.querySelector(sel);
            return el && el.contains(img);
        });
    };

    // 添加拖动功能
    const addDragFeature = (img) => {
        const parent = img.parentElement;
        if (!parent) return;
        if (!isValidImage(img) || isExcluded(img)) return;

        // 避免重复处理
        if (parent.classList.contains('huaban-img-container')) return;

        parent.classList.add('huaban-img-container');
        parent.style.position = 'relative';
        parent.draggable = true;

        // 添加调试信息
        console.log('✅ 为图片添加拖拽功能:', img.src.substring(0, 50) + '...');

        // 拖动开始
        parent.addEventListener('dragstart', (e) => {
            isDragging = true;
            draggedElement = img;
            parent.classList.add('dragging');

            // 设置拖动数据
            e.dataTransfer.effectAllowed = 'copy';
            e.dataTransfer.setData('text/plain', img.src);

            // 延迟显示轮盘，避免立即显示 - 优化速度
            setTimeout(() => {
                if (isDragging) {
                    showTurntable(e.clientX, e.clientY);
                }
            }, 100);
        });

        // 拖动结束
        parent.addEventListener('dragend', (e) => {
            isDragging = false;
            draggedElement = null;
            parent.classList.remove('dragging');

            // 延迟隐藏轮盘，给drop事件时间处理
            setTimeout(() => {
                if (!isDragging) {
                    hideTurntable();
                }
            }, 100);
        });

        // 存储图片HTML用于后续处理
        imgHTMLMap.set(img, img.outerHTML);
    };

    // 标记付费素材
    const markPremium = () => {
        const nodes = document.evaluate(
            '//div[@data-content-type="素材采集"]',
            document,
            null,
            XPathResult.ORDERED_NODE_SNAPSHOT_TYPE,
            null
        );

        for (let i = 0; i < nodes.snapshotLength; i++) {
            const el = nodes.snapshotItem(i);
            if (el.querySelector('.premium-overlay')) continue;

            el.style.position = 'relative';
            el.style.overflow = 'hidden';

            const overlay = document.createElement('div');
            overlay.className = 'premium-overlay';
            overlay.innerHTML = '<span>💰 付费素材</span>';
            overlay.style.cssText = `
                position: absolute; top: 0; left: 0; width: 100%; height: 100%;
                background: rgba(0,0,0,${OPACITY}); display: flex; align-items: center;
                justify-content: center; z-index: 1000; pointer-events: none;
            `;
            overlay.querySelector('span').style.cssText = `
                color: white; font-size: 16px; font-weight: bold;
                text-shadow: 2px 2px 4px rgba(0,0,0,0.8);
                background: rgba(255,255,255,0.1); padding: 8px 16px;
                border-radius: 20px; border: 2px solid rgba(255,255,255,0.3);
            `;

            el.onmouseenter = () => overlay.style.opacity = '0.3';
            el.onmouseleave = () => overlay.style.opacity = '1';

            el.appendChild(overlay);
        }
    };

    // 处理页面元素
    const process = () => {
        try {
            const images = document.querySelectorAll('img');
            console.log(`🔍 发现 ${images.length} 个图片元素`);

            let processedCount = 0;
            images.forEach(img => {
                try {
                    const beforeProcessing = img.parentElement?.classList.contains('huaban-img-container');
                    addDragFeature(img);
                    const afterProcessing = img.parentElement?.classList.contains('huaban-img-container');
                    if (!beforeProcessing && afterProcessing) {
                        processedCount++;
                    }
                } catch (error) {
                    console.warn('处理图片时出错:', error, img);
                }
            });

            console.log(`✅ 成功处理 ${processedCount} 个新图片`);
            markPremium();
        } catch (error) {
            console.error('处理页面元素时出错:', error);
        }
    };

    // 监听DOM变化
    const observer = new MutationObserver(process);
    observer.observe(document.body, { childList: true, subtree: true });

    // 页面处理函数
    const handlePageLoad = () => {
        setTimeout(() => {
            process();

            // 自动点击 .p7zlqpbo 元素
            const target = document.querySelector('.p7zlqpbo');
            if (target) {
                target.click();
                console.log('✅ 已自动点击 .p7zlqpbo 元素');
            } else {
                console.log('⚠️ 未找到 .p7zlqpbo 元素');
            }
        }, 1000);
    };

    // 页面加载完成后处理
    window.addEventListener('load', handlePageLoad);

    // 监听页面URL变化（处理SPA路由跳转）
    let currentUrl = location.href;
    const checkUrlChange = () => {
        if (location.href !== currentUrl) {
            currentUrl = location.href;
            console.log('🔄 检测到页面跳转:', currentUrl);
            // 页面跳转后重新处理
            setTimeout(handlePageLoad, 500);
        }
    };

    // 定期检查URL变化
    setInterval(checkUrlChange, 1000);

    // 监听浏览器前进后退
    window.addEventListener('popstate', () => {
        console.log('🔄 检测到浏览器前进/后退');
        setTimeout(handlePageLoad, 500);
    });

    // 监听页面可见性变化（处理标签页切换回来的情况）
    document.addEventListener('visibilitychange', () => {
        if (!document.hidden) {
            console.log('🔄 页面重新可见，重新处理');
            setTimeout(process, 500);
        }
    });

    // 全局拖放事件处理
    document.addEventListener('dragover', (e) => {
        if (isDragging) {
            e.preventDefault();
        }
    });

    document.addEventListener('drop', (e) => {
        if (isDragging && !turntableCanvas?.contains(e.target)) {
            if (turntableVisible) {
                // 交由实例级 onDocumentDrop 处理（避免提前隐藏导致无法盲操）
                return;
            }
            e.preventDefault();
            hideTurntable();
        }
    });

    // 图片链接处理函数（预留扩展接口）
    function processImageLink(imgSrc, folder) {
        console.log(`图片已保存到: ${folder.label}`);
        // 预留：可在此处添加自定义图片处理逻辑
    }

    // ESC键取消
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            if (turntableVisible) {
                hideTurntable();
            } else {
                // 检查设置窗口是否打开
                const settingsModal = document.getElementById('settingsModal');
                if (settingsModal && settingsModal.style.display === 'flex') {
                    // 恢复原始设置并关闭窗口
                    if (typeof restoreOriginalSettings === 'function') {
                        restoreOriginalSettings();
                    }
                    settingsModal.style.display = 'none';
                    // 隐藏主题切换悬浮框
                    const themeFooter = document.getElementById('themeToggleFooter');
                    if (themeFooter) themeFooter.style.display = 'none';
                }
            }
        }
    });

    // 保存原始设置状态的变量
    let originalSettings = null;



    // 创建设置按钮和设置窗口
    function createSettingsUI() {
        // 创建设置按钮
        const settingsBtn = document.createElement('button');
        settingsBtn.id = 'settingsBtn';
        settingsBtn.innerHTML = '';
        settingsBtn.title = '轮盘设置';
        // 确保按钮初始定位正确
        settingsBtn.style.position = 'fixed';
        settingsBtn.style.bottom = '20px';
        settingsBtn.style.right = '20px';
        settingsBtn.style.transform = 'none';
        document.body.appendChild(settingsBtn);

        // 按钮显示/隐藏控制
        let hideTimeout;



        // 点击按钮打开设置窗口
        settingsBtn.addEventListener('click', () => {
            // 保存当前设置状态
            saveOriginalSettings();
            settingsModal.style.display = 'flex';
        });

        // 鼠标悬停显示完整按钮
        settingsBtn.addEventListener('mouseenter', () => {
            settingsBtn.classList.remove('hidden');
            clearTimeout(hideTimeout);
        });

        // 鼠标离开后延迟隐藏
        settingsBtn.addEventListener('mouseleave', () => {
            hideTimeout = setTimeout(() => {
                settingsBtn.classList.add('hidden');
            }, 2000);
        });

        // 创建设置窗口
        const settingsModal = document.createElement('div');
        settingsModal.id = 'settingsModal';
        settingsModal.innerHTML = `
            <div class="settings-window compact" id="settingsWindow">
                <div class="window-header">
                    <div class="window-title">轮盘设置</div>
                    <div class="close-btn">
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                            <line x1="18" y1="6" x2="6" y2="18"></line>
                            <line x1="6" y1="6" x2="18" y2="18"></line>
                        </svg>
                    </div>
                </div>
                <div class="window-content">
                    <div class="tab-container">
                        <button class="tab-button active" onclick="switchTab('settings')">轮盘设置</button>
                        <button class="tab-button" onclick="switchTab('contact')">联系作者</button>
                    </div>
                    <div id="settings-tab" class="tab-content active">
                        <span id="selectedText" style="display:none">浅色</span>
                        <div class="top-cards">
                            <div class="settings-card" id="leftToolsCard">
                                <div class="card-body">
                                    <div class="config-buttons">
                                        <button class="config-btn export-config-btn" id="exportSettings" title="导出配置">导出配置</button>
                                        <button class="config-btn import-config-btn" id="importSettings" title="导入配置">导入配置</button>
                                        <button class="config-btn reset-config-btn" id="resetSettings" title="恢复初始设置">恢复初始设置</button>
                                    </div>
                                </div>
                            </div>
                            <div class="settings-card" id="rightThemeCard">
                                <div class="card-body card-body-center">
                                    <div class="toggle-group-horizontal">
                                        <div class="toggle-item">
                                            <span class="toggle-label">主题切换</span>
                                            <div id="themeToggleContainer"></div>
                                        </div>
                                        <div class="toggle-item">
                                            <span class="toggle-label">图标反色</span>
                                            <div class="icon-toggle" id="iconInvertToggle">
                                                <div class="knob" id="iconInvertKnob">⚪</div>
                                            </div>
                                        </div>
                                    </div>
                                    <div class="toggle-group-horizontal" style="margin-top: 20px;">
                                        <div class="toggle-item" style="width: 100%;">
                                            <span class="toggle-label">轮盘大小</span>
                                            <div class="size-slider-container" id="sizeSliderContainer">
                                                <input type="range" class="size-slider" id="sizeSlider" min="1" max="10" value="3" step="1">
                                                <div class="size-value" id="sizeValue">3</div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                        </div>
                        <div class="section">
                            <div class="section-title">扇区设置</div>
                            <div class="sectors-grid" id="folderConfigs"></div>
                        </div>
                        <div class="button-group">
                            <button class="save-btn" id="saveSettings">保存设置</button>
                        </div>
                        <input type="file" id="importFileInput" accept=".json" style="display: none;">
                    </div>
                    <div id="contact-tab" class="tab-content">
                        <div class="contact-content">
                            <p class="contact-intro">
                                如果此动作对您有帮助，请动动小手点个赞 ❤️
                            </p>
                            <div class="contact-cards">
                                <div class="contact-card">
                                    <div class="card-header">
                                        🎁 作者推荐码
                                    </div>
                                    <div class="card-content">
                                        207095-7440
                                    </div>
                                </div>
                                <div class="contact-card">
                                    <div class="card-header">
                                        <img src="https://files.getquicker.net/_icons/A93DD95564D9430D4276411BD5D1C99FA817BCCA.png" class="qq-icon"> 作者QQ群
                                    </div>
                                    <div class="card-content">
                                        <a href="https://qm.qq.com/cgi-bin/qm/qr?_wv=1027&k=7q8lAcCA3xTr-PZ2XG8VA04BIyfKhXeV&authKey=rSwrwGZzcJKWm%2F3zfYeTATxVBt%2B170gK4DbDezYPwKMZGI0BH6VSYUp6PYZXTO%2BC&noverify=0&group_code=453478357" target="_blank" class="qq-link">
                                            453478357
                                        </a>
                                    </div>
                                </div>
                            </div>
                            <div class="contact-description">
                                使用推荐码首次开通专业版，<br>
                                双方均可获赠
                                <span class="highlight-badge">
                                    90天
                                </span>
                                专业版使用时长
                            </div>

                            <div class="notice-section">
                                <div class="notice-title">注意事项</div>
                                <ol class="notice-list">
                                    <li class="notice-item">
                                        首次使用需安装：
                                        <br>• Quicker 软件（<a href="https://getquicker.net/Download" target="_blank" class="notice-link">https://getquicker.net/Download</a>）
                                        <br>• Quicker 浏览器扩展（<a href="https://getquicker.net/Download" target="_blank" class="notice-link">https://getquicker.net/Download</a>）
                                    </li>
                                    <li class="notice-item">
                                        该脚本需配合 Quicker 动作"实验花瓣v2"使用（<a href="https://getquicker.net/Sharedaction?code=e4dd155a-c6bc-4241-cd50-08dde322b5de&fromMyShare=true" target="_blank" class="notice-link">点击安装</a>），安装完成即可，无需后台运行。
                                    </li>
                                    <li class="notice-item">
                                         脚本与动作联动需通过"外部链接启用动作"功能，该功能仅支持 Quicker <span class="notice-highlight">专业版</span>，免费版有使用限制，无法正常使用。
                                     </li>
                                     <li class="notice-item">
                                          本 Quicker 动作（实验花瓣v2）及配套油猴脚本均为实验测试版，支持用户自定义修改与重新发布（发布需备注原作者且内容不与原版相似），无需告知作者，有问题或建议可加群讨论。
                                      </li>
                                      <li class="notice-item">
                                          所有通过设置按钮调整的内容均暂存于浏览器缓存，清除缓存会导致设置丢失并需重新操作；若需避免反复配置，建议直接在脚本内修改相关参数，一次调整即可长期生效。
                                      </li>
                                 </ol>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `;
        document.body.appendChild(settingsModal);

        // 生成文件夹配置界面
        const folderConfigsDiv = document.getElementById('folderConfigs');

        Object.entries(FOLDER_CONFIG).forEach(([key, config]) => {
            const folderDiv = document.createElement('div');
            folderDiv.className = 'sector-item';

            // 直接使用当前配置数据
            const displayName = config.label;
            const displayIcon = config.icon;

            folderDiv.innerHTML = `
                <div class="sector-header">
                    <div class="sector-info">
                        <div class="sector-name">扇区 ${key}</div>
                    </div>
                </div>
                <div class="sector-inputs">
                    <div class="input-group name-input">
                        <label class="input-label">名称:</label>
                        <input type="text" class="sector-input" id="label_${key}" value="${displayName}" placeholder="请输入名称">
                    </div>
                    <div class="input-group icon-input">
                        <label class="input-label">图标链接:</label>
                        <div class="icon-input-container">
                            <input type="text" class="sector-input icon-url-input" id="icon_${key}" value="${displayIcon}" placeholder="请输入图标链接">
                            <div class="icon-preview" id="preview_${key}">
                                <img src="${displayIcon}" alt="图标预览" onerror="this.style.display='none'" onload="this.style.display='block'">
                            </div>
                        </div>
                    </div>
                </div>
            `;
            folderConfigsDiv.appendChild(folderDiv);
        });

        // 添加图标实时预览功能
        Object.keys(FOLDER_CONFIG).forEach(key => {
            const iconInput = document.getElementById(`icon_${key}`);
            const previewDiv = document.getElementById(`preview_${key}`);

            if (iconInput && previewDiv) {
                // 更新预览图标的函数
                const updatePreview = (url) => {
                    const img = previewDiv.querySelector('img');
                    if (url && url.trim()) {
                        if (img) {
                            img.src = url;
                            img.style.display = 'block';
                        } else {
                            previewDiv.innerHTML = `<img src="${url}" alt="图标预览" onerror="this.style.display='none'" onload="this.style.display='block'">`;
                        }
                        // 应用反色效果
                        applyInvertFilter(previewDiv);
                    } else {
                        previewDiv.innerHTML = '';
                    }
                };

                // 应用反色滤镜的函数
                const applyInvertFilter = (container) => {
                    const img = container.querySelector('img');
                    if (!img) return;

                    // 检查反色按钮状态
                    const toggle = document.getElementById('iconInvertToggle');
                    const shouldInvert = toggle && toggle.classList.contains('active');

                    if (shouldInvert) {
                        img.style.filter = 'invert(1)';
                    } else {
                        img.style.filter = 'none';
                    }
                };

                // 监听输入变化
                iconInput.addEventListener('input', (e) => {
                    updatePreview(e.target.value);
                });

                // 监听粘贴事件
                iconInput.addEventListener('paste', (e) => {
                    setTimeout(() => {
                        updatePreview(e.target.value);
                    }, 10);
                });

                // 初始化时应用反色状态
                setTimeout(() => {
                    applyInvertFilter(previewDiv);
                }, 100);
            }
        });

        // 设置当前主题模式 - 从localStorage读取
        const selectedText = document.getElementById('selectedText');
        const settingsWindow = document.getElementById('settingsWindow');

        // 从localStorage获取当前主题模式
        let currentThemeMode = THEME_MODE; // 默认值
        try {
            const saved = localStorage.getItem('huaban_turntable_config');
            if (saved) {
                const config = JSON.parse(saved);
                if (config.themeMode) {
                    currentThemeMode = config.themeMode;
                }
            }
        } catch (e) {
            console.warn('读取主题设置失败:', e);
        }

        // 应用主题设置到界面
        if (currentThemeMode === '深色') {
            selectedText.textContent = '深色';
            settingsWindow.classList.add('dark');
            // 更新下拉选项的选中状态（兼容：下拉可能不存在）
            const darkOpt = document.querySelector('.dropdown-option[data-value="dark"]');
            if (darkOpt) darkOpt.classList.add('selected');
        } else {
            selectedText.textContent = '浅色';
            settingsWindow.classList.remove('dark');
            // 更新下拉选项的选中状态（兼容：下拉可能不存在）
            const lightOpt = document.querySelector('.dropdown-option[data-value="light"]');
            if (lightOpt) lightOpt.classList.add('selected');
        }



        settingsModal.addEventListener('click', (e) => {
            if (e.target === settingsModal) {
                // 恢复原始设置
                restoreOriginalSettings();
                settingsModal.style.display = 'none';
                // 隐藏主题切换悬浮框
                const themeFooter = document.getElementById('themeToggleFooter');
                if (themeFooter) themeFooter.style.display = 'none';
            }
        });

        document.querySelector('.close-btn').addEventListener('click', () => {
            // 恢复原始设置
            restoreOriginalSettings();
            settingsModal.style.display = 'none';
        });

        document.getElementById('saveSettings').addEventListener('click', () => {
            saveSettings();
            settingsModal.style.display = 'none';
        });

        // 图标反色按钮切换事件监听器（实时预览，不立即落盘）
        const iconToggleEl = document.getElementById('iconInvertToggle');
        if (iconToggleEl) {
            iconToggleEl.addEventListener('click', () => {
                iconToggleEl.classList.toggle('active');
                const knob = document.getElementById('iconInvertKnob');
                if (knob) knob.textContent = iconToggleEl.classList.contains('active') ? '◐' : '◑';

                // 更新轮盘图标
                if (turntableCanvas) {
                    const ctx = turntableCanvas.getContext('2d');
                    renderTurntable(ctx, null);
                }

                // 更新所有图标预览
                Object.keys(FOLDER_CONFIG).forEach(key => {
                    const previewDiv = document.getElementById(`preview_${key}`);
                    if (previewDiv) {
                        const img = previewDiv.querySelector('img');
                        if (img) {
                            const shouldInvert = iconToggleEl.classList.contains('active');
                            img.style.filter = shouldInvert ? 'invert(1)' : 'none';
                        }
                    }
                });
            });
        }

        // 导出配置按钮事件监听器
        document.getElementById('exportSettings').addEventListener('click', () => {
            exportConfig();
        });

        // 导入配置按钮事件监听器
        document.getElementById('importSettings').addEventListener('click', () => {
            document.getElementById('importFileInput').click();
        });

        // 恢复初始设置按钮事件监听器
        document.getElementById('resetSettings').addEventListener('click', () => {
            if (confirm('确定要恢复到初始设置吗？这将清除所有自定义配置。')) {
                resetToDefaultSettings();
            }
        });

        // 文件选择事件监听器
        document.getElementById('importFileInput').addEventListener('change', (e) => {
            const file = e.target.files[0];
            if (file) {
                importConfig(file);
                e.target.value = ''; // 清空文件选择，允许重复选择同一文件
            }
        });

        // 自定义下拉菜单功能（兼容：当下拉菜单被移除时不执行）
        const dropdown = document.getElementById('customDropdown');
        const selected = document.getElementById('dropdownSelected');
        const options = document.getElementById('dropdownOptions');

        if (dropdown && selected && options) {
            // 点击选中区域切换下拉菜单
            selected.addEventListener('click', function(e) {
                e.stopPropagation();
                selected.classList.toggle('active');
                options.classList.toggle('show');
            });

            // 点击选项
            options.addEventListener('click', function(e) {
                if (e.target.classList.contains('dropdown-option')) {
                    const value = e.target.getAttribute('data-value');
                    const text = e.target.textContent;

                    // 更新选中文本
                    selectedText.textContent = text;

                    // 更新选中状态
                    document.querySelectorAll('.dropdown-option').forEach(opt => {
                        opt.classList.remove('selected');
                    });
                    e.target.classList.add('selected');

                    // 应用主题
                    if (value === 'dark') {
                        settingsWindow.classList.add('dark');
                    } else {
                        settingsWindow.classList.remove('dark');
                    }

                    // 关闭下拉菜单
                    selected.classList.remove('active');
                    options.classList.remove('show');
                }
            });

            // 点击其他地方关闭下拉菜单
            document.addEventListener('click', function() {
                selected.classList.remove('active');
                options.classList.remove('show');
            });
        }

        // 初始化选中状态已在上面的主题加载逻辑中处理

        // 隐藏原“轮盘主题颜色”整段（含标题与选择区，保留DOM不移除）
        try {
            const themeSelector = settingsWindow.querySelector('.theme-selector');
            const themeSection = themeSelector ? themeSelector.closest('.section') : null;
            if (themeSection) {
                themeSection.style.display = 'none';
            } else if (themeSelector) {
                themeSelector.style.display = 'none';
            }
        } catch (_) {}

        // 注入专用切换按钮样式（仅注入一次）
        if (!document.getElementById('theme-toggle-styles')) {
            const style = document.createElement('style');
            style.id = 'theme-toggle-styles';
            style.textContent = `
            .theme-toggle {
                width: 64px;
                height: 28px;
                background: rgba(255, 255, 255, 0.25);
                backdrop-filter: blur(6px);
                border-radius: 50px;
                box-shadow: inset 0 1px 2px rgba(255,255,255,0.6),
                            inset 0 -1px 2px rgba(0,0,0,0.1),
                            0 4px 10px rgba(0,0,0,0.15);
                cursor: pointer;
                transition: background 0.3s ease;
                overflow: hidden;
                display: inline-flex;
                position: relative;
                align-items: center;
            }
            .theme-toggle.dark { background: rgba(0, 0, 0, 0.25); }
            .settings-window.dark .theme-toggle { background: rgba(0, 0, 0, 0.25); }
            .settings-window.dark .theme-toggle .knob { background: linear-gradient(145deg, #444, #222); color: #ffd93b; }
            .theme-toggle .knob {
                width: 22px; height: 22px;
                background: linear-gradient(145deg, #fff, #e6e6e6);
                border-radius: 50%;
                position: absolute; top: 3px; left: 3px;
                display: flex; align-items: center; justify-content: center;
                font-size: 12px;
                transition: all 0.3s ease;
                box-shadow: 0 2px 5px rgba(0,0,0,0.2);
            }
            .theme-toggle.dark .knob {
                left: 39px;
                background: linear-gradient(145deg, #444, #222);
                color: #ffd93b;
            }
            @media (prefers-reduced-motion: reduce) {
                .theme-toggle, .theme-toggle .knob { transition: none; }
            }
            `;
            document.head.appendChild(style);
        }

        // 注入卡片布局样式（仅注入一次）
        if (!document.getElementById('settings-cards-styles')) {
            const style2 = document.createElement('style');
            style2.id = 'settings-cards-styles';
            style2.textContent = `
            .top-cards { display: flex; gap: 16px; margin-bottom: 16px; align-items: stretch; }
            .settings-card { flex: 1; height: auto; background: rgba(255,255,255,0.6); border-radius: 12px; padding: 16px; backdrop-filter: blur(10px); box-shadow: 0 6px 20px rgba(0,0,0,0.08); border: 1px solid rgba(0,0,0,0.06); display: flex; flex-direction: column; }
            .dark .settings-card { background: rgba(40,40,40,0.5); border-color: rgba(255,255,255,0.08); }
            .settings-card .card-title { font-weight: 600; margin-bottom: 12px; font-size: 14px; }
            .settings-card .card-body { flex: 1; display: flex; align-items: center; justify-content: space-between; }
            /* Left card vertical layout */
            #leftToolsCard { height: auto; }
            #leftToolsCard .card-body { flex-direction: column; align-items: flex-start; justify-content: flex-start; gap: 12px; }
            #leftToolsCard .config-buttons { display: flex; flex-direction: column; align-items: flex-start; gap: 10px; }
            .settings-card .card-body.card-body-center { justify-content: center; flex-direction: column; align-items: center; gap: 12px; }
            .toggle-group-horizontal { display: flex; flex-direction: row; gap: 20px; width: 100%; align-items: flex-end; justify-content: center; }
              .toggle-item { display: grid; grid-template-rows: 18px 56px; row-gap: 6px; align-items: end; justify-items: center; }
              .toggle-label { height: 18px; line-height: 18px; font-size: 13px; display: flex; align-items: center; justify-content: center; }
              #themeToggleContainer { display: contents; }
              /* 去除标题后保留占位可控，这里不再需要card-title样式 */
            #rightThemeCard .theme-toggle { width: 128px; height: 56px; position: relative; background: rgba(255, 255, 255, 0.25); border-radius: 28px; display: inline-flex; align-items: center; }
            #rightThemeCard .theme-toggle .knob { width: 44px; height: 44px; font-size: 18px; top: 6px; left: 6px; position: absolute; }
            #rightThemeCard .theme-toggle.dark .knob { left: calc(100% - 50px); }
            #rightThemeCard .icon-toggle { width: 128px; height: 56px; display: inline-flex; }
            #rightThemeCard .icon-toggle .knob { width: 44px; height: 44px; font-size: 18px; top: 6px; left: 6px; }
            #rightThemeCard .icon-toggle.active .knob { left: calc(100% - 50px); }
            @media (max-width: 860px) { .top-cards { flex-direction: column; } .settings-card { height: auto; } }

            `;
            document.head.appendChild(style2);
        }

        // 注入图标反色切换按钮样式（仅注入一次）
        if (!document.getElementById('icon-toggle-styles')) {
            const style3 = document.createElement('style');
            style3.id = 'icon-toggle-styles';
            style3.textContent = `
            .icon-toggle {
                width: 128px;
                height: 56px;
                background: rgba(255, 255, 255, 0.25);
                backdrop-filter: blur(6px);
                border-radius: 50px;
                box-shadow: inset 0 1px 2px rgba(255,255,255,0.6), inset 0 -1px 2px rgba(0,0,0,0.1), 0 4px 10px rgba(0,0,0,0.15);
                cursor: pointer;
                transition: background 0.3s ease;
                overflow: hidden;
                display: inline-flex;
                position: relative;
                align-items: center;
                justify-content: flex-start;
            }
            .settings-window.dark .icon-toggle { background: rgba(0, 0, 0, 0.25); }
            .settings-window.dark #rightThemeCard .theme-toggle { background: rgba(0, 0, 0, 0.25); }
            .icon-toggle .knob {
                width: 44px; height: 44px;
                background: linear-gradient(145deg, #fff, #e6e6e6);
                border-radius: 50%;
                position: absolute; top: 6px; left: 6px;
                display: flex; align-items: center; justify-content: center;
                font-size: 18px;
                transition: all 0.3s ease;
                box-shadow: 0 2px 5px rgba(0,0,0,0.2);
                color: #424245;
            }
            .settings-window.dark .icon-toggle .knob { background: linear-gradient(145deg, #444, #222); color: #ffd93b; }
            .icon-toggle.active .knob { left: calc(100% - 50px); }
            .toggle-label { font-size: 13px; color: #424245; }
            .settings-window.dark .toggle-label { color: #f5f5f7; }
            #leftToolsCard .card-body { align-items: center !important; justify-content: center !important; gap: 14px !important; }
            #leftToolsCard .config-buttons { flex-direction: column !important; align-items: center !important; gap: 10px !important; width: 100%; }
            #leftToolsCard .config-btn { width: 220px; height: 40px; padding: 0 16px; display: inline-flex; align-items: center; justify-content: center; }

            /* 轮盘大小滑块样式 */
            .size-slider-container {
                width: 256px;
                height: 56px;
                background: rgba(255, 255, 255, 0.25);
                backdrop-filter: blur(6px);
                border-radius: 28px;
                box-shadow: inset 0 1px 2px rgba(255,255,255,0.6), inset 0 -1px 2px rgba(0,0,0,0.1), 0 4px 10px rgba(0,0,0,0.15);
                display: flex;
                align-items: center;
                justify-content: space-between;
                padding: 0 20px;
                position: relative;
            }
            .settings-window.dark .size-slider-container { background: rgba(0, 0, 0, 0.25); }

            .size-slider {
                width: 180px;
                height: 6px;
                background: rgba(0, 0, 0, 0.15);
                border-radius: 3px;
                outline: none;
                -webkit-appearance: none;
                appearance: none;
                cursor: pointer;
            }
            .settings-window.dark .size-slider { background: rgba(255, 255, 255, 0.2); }

            .size-slider::-webkit-slider-thumb {
                -webkit-appearance: none;
                appearance: none;
                width: 20px;
                height: 20px;
                background: linear-gradient(145deg, #fff, #e6e6e6);
                border-radius: 50%;
                cursor: pointer;
                box-shadow: 0 2px 5px rgba(0,0,0,0.2);
                transition: all 0.3s ease;
            }
            .settings-window.dark .size-slider::-webkit-slider-thumb { background: linear-gradient(145deg, #444, #222); }

            .size-slider::-moz-range-thumb {
                width: 20px;
                height: 20px;
                background: linear-gradient(145deg, #fff, #e6e6e6);
                border-radius: 50%;
                cursor: pointer;
                box-shadow: 0 2px 5px rgba(0,0,0,0.2);
                border: none;
                transition: all 0.3s ease;
            }
            .settings-window.dark .size-slider::-moz-range-thumb { background: linear-gradient(145deg, #444, #222); }

            .size-value {
                width: 36px;
                height: 36px;
                background: linear-gradient(145deg, #fff, #e6e6e6);
                border-radius: 50%;
                display: flex;
                align-items: center;
                justify-content: center;
                font-size: 14px;
                font-weight: 600;
                color: #424245;
                box-shadow: 0 2px 5px rgba(0,0,0,0.2);
                transition: all 0.3s ease;
            }
            .settings-window.dark .size-value { background: linear-gradient(145deg, #444, #222); color: #ffd93b; }
            `;
            document.head.appendChild(style3);
        }

        // 创建（或获取）专用主题切换按钮（右上角卡片内）
        const oldFloating = document.getElementById('themeToggleFloating');
        if (oldFloating) oldFloating.remove();
        const oldInWindow = document.getElementById('themeToggleInWindow');
        if (oldInWindow) oldInWindow.remove();
        const oldFooter = document.querySelector('.theme-toggle-footer');
        if (oldFooter) oldFooter.remove();

        let themeToggle = document.getElementById('themeToggleInWindow');
        if (!themeToggle) {
            themeToggle = document.createElement('div');
            themeToggle.id = 'themeToggleInWindow';
            themeToggle.className = 'theme-toggle';
            themeToggle.innerHTML = '<div class="knob" id="themeToggleKnob">☀️</div>';
            const container = document.getElementById('themeToggleContainer');
            if (container) container.appendChild(themeToggle);
        }

        // 从selectedText同步切换按钮的视觉状态（不改变settingsWindow的类名，保持原逻辑一致）
        const syncToggleUIFromSelectedText = () => {
            const isDark = (selectedText?.textContent || '').trim() === '深色';
            if (themeToggle) themeToggle.classList.toggle('dark', isDark);
            const knob = document.getElementById('themeToggleKnob');
            if (knob) knob.textContent = isDark ? '🌙' : '☀️';
        };

        // 初始化切换按钮显示
        syncToggleUIFromSelectedText();
        // 不再需要悬浮框主题样式初始化（改为卡片内按钮）

        // 初始化图标反色切换按钮UI
        (function initIconInvertToggle() {
            const toggle = document.getElementById('iconInvertToggle');
            const knob = document.getElementById('iconInvertKnob');
            if (toggle) {
                let initial = false;
                try {
                    const saved = localStorage.getItem('huaban_turntable_config');
                    if (saved) initial = !!(JSON.parse(saved).iconInvert);
                } catch (_) {}
                toggle.classList.toggle('active', initial);
                if (knob) knob.textContent = initial ? '◐' : '◑';
            }
        })();

        // 初始化轮盘大小滑块
        (function initSizeSlider() {
            const slider = document.getElementById('sizeSlider');
            const valueDisplay = document.getElementById('sizeValue');
            if (slider && valueDisplay) {
                // 从localStorage加载保存的轮盘大小
                let initialSize = 3;
                try {
                    const saved = localStorage.getItem('huaban_turntable_config');
                    if (saved) {
                        const config = JSON.parse(saved);
                        initialSize = config.turntableSize || 3;
                    }
                } catch (_) {}

                slider.value = initialSize;
                valueDisplay.textContent = initialSize;

                // 应用初始轮盘大小
                updateTurntableSize(initialSize);

                // 监听滑块变化
                let lastValue = initialSize;
                slider.addEventListener('input', function() {
                    const value = parseInt(this.value);
                    valueDisplay.textContent = value;

                    // 只有值真正改变时才更新和显示预览
                    if (value !== lastValue) {
                        lastValue = value;
                        updateTurntableSize(value);
                        updatePreviewTurntable(value);
                    }
                });

                // 按下滑块时显示预览，松手后关闭（替代自动关闭时间）
                const openPreviewOnPress = (e) => {
                    const value = parseInt(slider.value);
                    showPreviewTurntable(value);
                };
                const attachReleaseOnce = () => {
                    const onRelease = () => {
                        window.removeEventListener('pointerup', onRelease);
                        window.removeEventListener('mouseup', onRelease);
                        window.removeEventListener('touchend', onRelease);
                        hidePreviewTurntable();
                    };
                    if (window.PointerEvent) {
                        window.addEventListener('pointerup', onRelease, { once: true, passive: true });
                    } else {
                        window.addEventListener('mouseup', onRelease, { once: true, passive: true });
                        window.addEventListener('touchend', onRelease, { once: true, passive: true });
                    }
                };
                if (window.PointerEvent) {
                    slider.addEventListener('pointerdown', (e) => { openPreviewOnPress(e); attachReleaseOnce(); }, { passive: true });
                } else {
                    slider.addEventListener('mousedown', (e) => { openPreviewOnPress(e); attachReleaseOnce(); }, { passive: true });
                    slider.addEventListener('touchstart', (e) => { openPreviewOnPress(e); attachReleaseOnce(); }, { passive: true });
                }
            }
        })();

        // 监听selectedText文本变化，保持与现有设置同步（导入/重置等路径会触发）
        try {
            const observer = new MutationObserver(() => {
                syncToggleUIFromSelectedText();
            });
            observer.observe(selectedText, { characterData: true, childList: true, subtree: true });
        } catch (_) {}

        // 点击专用切换按钮时，执行与原下拉选项点击相同的逻辑：
        // 1) 更新selectedText文本；2) 更新下拉选项选中态；3) 应用settingsWindow的.dark类；
        // 注意：不写入localStorage（保持与原逻辑等价），保存时由saveSettings处理。
        if (themeToggle) themeToggle.addEventListener('click', () => {
            const currentlyDark = (selectedText?.textContent || '').trim() === '深色';
            const newText = currentlyDark ? '浅色' : '深色';

            // 更新选中文本
            if (selectedText) selectedText.textContent = newText;

            // 更新下拉选项的选中状态
            document.querySelectorAll('.dropdown-option').forEach(opt => {
                opt.classList.remove('selected');
                const val = opt.getAttribute('data-value');
                if ((newText === '深色' && val === 'dark') || (newText === '浅色' && val === 'light')) {
                    opt.classList.add('selected');
                }
            });

            // 应用主题到设置窗口
            if (newText === '深色') {
                settingsWindow.classList.add('dark');
            } else {
                settingsWindow.classList.remove('dark');
            }


            // 同步切换按钮视觉
            syncToggleUIFromSelectedText();
        });

        // 当用户通过原“轮盘主题颜色”的选项修改时，同步切换按钮（该逻辑在选项点击处也会触发observer，无需额外处理）

    }

    // 导出配置
    function exportConfig() {
        try {
            // 获取当前设置
            const selectedText = document.getElementById('selectedText').textContent;
            const iconInvert = document.getElementById('iconInvertToggle')?.classList.contains('active') || false;
            const turntableSize = parseInt(document.getElementById('sizeSlider')?.value || 3);

            // 获取文件夹配置
            const folderConfig = {};
            Object.keys(FOLDER_CONFIG).forEach(key => {
                const labelElement = document.getElementById(`label_${key}`);
                const iconElement = document.getElementById(`icon_${key}`);
                if (labelElement && iconElement) {
                    folderConfig[key] = {
                        label: labelElement.value,
                        icon: iconElement.value
                    };
                }
            });

            // 创建配置对象
            const config = {
                version: '1.0',
                exportTime: new Date().toISOString(),
                themeMode: selectedText,
                iconInvert: iconInvert,
                turntableSize: turntableSize,
                folderConfig: folderConfig
            };

            // 创建下载链接
            const dataStr = JSON.stringify(config, null, 2);
            const dataBlob = new Blob([dataStr], { type: 'application/json' });
            const url = URL.createObjectURL(dataBlob);

            // 创建下载元素
            const downloadLink = document.createElement('a');
            downloadLink.href = url;
            downloadLink.download = `huaban_turntable_config_${new Date().toISOString().slice(0, 10)}.json`;
            document.body.appendChild(downloadLink);
            downloadLink.click();
            document.body.removeChild(downloadLink);

            // 清理URL对象
            URL.revokeObjectURL(url);

            console.log('✅ 配置导出成功');
            alert('配置导出成功！');
        } catch (e) {
            console.error('❌ 配置导出失败:', e);
            alert('配置导出失败：' + e.message);
        }
    }

    // 导入配置
    function importConfig(file) {
        const reader = new FileReader();
        reader.onload = (e) => {
            try {
                const config = JSON.parse(e.target.result);

                // 验证配置格式
                if (!config.version || !config.themeMode) {
                    throw new Error('配置文件格式不正确');
                }

                // 应用主题模式
                if (config.themeMode) {
                    const selectedTextElement = document.getElementById('selectedText');
                    const settingsWindow = document.getElementById('settingsWindow');
                    if (selectedTextElement) {
                        selectedTextElement.textContent = config.themeMode;

                        // 更新下拉选项的选中状态（兼容：下拉可能不存在）
                        const opts = document.querySelectorAll('.dropdown-option');
                        if (opts && opts.length) {
                            opts.forEach(opt => {
                                opt.classList.remove('selected');
                                if ((config.themeMode === '深色' && opt.dataset.value === 'dark') ||
                                    (config.themeMode === '浅色' && opt.dataset.value === 'light')) {
                                    opt.classList.add('selected');
                                }
                            });
                        }

                        // 应用主题到设置窗口
                        if (settingsWindow) {
                            if (config.themeMode === '深色') {
                                settingsWindow.classList.add('dark');
                            } else {
                                settingsWindow.classList.remove('dark');
                            }
                        }
                    }
                }

                // 应用图标反色设置
                if (config.iconInvert !== undefined) {
                    const toggle = document.getElementById('iconInvertToggle');
                    const knob = document.getElementById('iconInvertKnob');
                    if (toggle) {
                        toggle.classList.toggle('active', !!config.iconInvert);
                        if (knob) knob.textContent = config.iconInvert ? '◐' : '◑';

                        // 更新所有图标预览的反色效果
                        Object.keys(FOLDER_CONFIG).forEach(key => {
                            const previewDiv = document.getElementById(`preview_${key}`);
                            if (previewDiv) {
                                const img = previewDiv.querySelector('img');
                                if (img) {
                                    img.style.filter = config.iconInvert ? 'invert(1)' : 'none';
                                }
                            }
                        });
                    }
                }

                // 应用轮盘大小设置
                if (config.turntableSize !== undefined) {
                    const slider = document.getElementById('sizeSlider');
                    const valueDisplay = document.getElementById('sizeValue');
                    if (slider && valueDisplay) {
                        slider.value = config.turntableSize;
                        valueDisplay.textContent = config.turntableSize;
                        updateTurntableSize(config.turntableSize);
                    }
                }

                // 应用文件夹配置
                if (config.folderConfig) {
                    Object.keys(config.folderConfig).forEach(key => {
                        const labelElement = document.getElementById(`label_${key}`);
                        const iconElement = document.getElementById(`icon_${key}`);
                        const previewDiv = document.getElementById(`preview_${key}`);
                        if (labelElement && iconElement && config.folderConfig[key]) {
                            labelElement.value = config.folderConfig[key].label || '';
                            iconElement.value = config.folderConfig[key].icon || '';

                            // 更新图标预览
                            if (previewDiv && config.folderConfig[key].icon) {
                                const iconUrl = config.folderConfig[key].icon.trim();
                                if (iconUrl) {
                                    const img = previewDiv.querySelector('img');
                                    if (img) {
                                        img.src = iconUrl;
                                        img.style.display = 'block';
                                    } else {
                                        previewDiv.innerHTML = `<img src="${iconUrl}" alt="图标预览" onerror="this.style.display='none'" onload="this.style.display='block'">`;
                                    }

                                    // 应用反色效果（根据当前按钮状态）
                                    const toggle = document.getElementById('iconInvertToggle');
                                    const shouldInvert = toggle && toggle.classList.contains('active');
                                    const imgElement = previewDiv.querySelector('img');
                                    if (imgElement) {
                                        imgElement.style.filter = shouldInvert ? 'invert(1)' : 'none';
                                    }
                                } else {
                                    previewDiv.innerHTML = '';
                                }
                            }
                        }
                    });
                }

                // 同步切换按钮UI
                if (typeof syncToggleUIFromSelectedText === 'function') {
                    syncToggleUIFromSelectedText();
                }

                console.log('✅ 配置导入成功');
                alert('配置导入成功！请点击"保存设置"来应用配置。');

            } catch (e) {
                console.error('❌ 配置导入失败:', e);
                alert('配置导入失败：' + e.message);
            }
        };

        reader.onerror = () => {
            console.error('❌ 文件读取失败');
            alert('文件读取失败，请检查文件是否损坏。');
        };

        reader.readAsText(file);
    }

    // 恢复初始设置
    function resetToDefaultSettings() {
        try {
            // 强制使用当前脚本中的FOLDER_CONFIG，避免任何缓存问题
            // 通过深拷贝确保获取到最新的配置值
            const actualDefaultConfig = JSON.parse(JSON.stringify(INITIAL_FOLDER_CONFIG));

            // 添加调试信息，让用户可以在控制台看到当前使用的配置
            console.log('🔄 恢复初始设置 - 当前使用的FOLDER_CONFIG:', actualDefaultConfig);
            console.log('📝 如果配置不是最新的，请强制刷新页面 (Ctrl+F5) 清除浏览器缓存');

            // 恢复主题模式为浅色
            const selectedTextElement = document.getElementById('selectedText');
            const settingsWindow = document.getElementById('settingsWindow');
            if (selectedTextElement) {
                selectedTextElement.textContent = '浅色';

                // 更新下拉选项的选中状态
                document.querySelectorAll('.dropdown-option').forEach(opt => {
                    opt.classList.remove('selected');
                    if (opt.dataset.value === 'light') {
                        opt.classList.add('selected');
                    }
                });

                // 应用主题到设置窗口
                if (settingsWindow) {
                    settingsWindow.classList.remove('dark');
                }
            }

            // 恢复图标反色设置为false
            const toggle = document.getElementById('iconInvertToggle');
            const knob = document.getElementById('iconInvertKnob');
            if (toggle) {
                toggle.classList.remove('active');
                if (knob) knob.textContent = '◑';

                // 更新所有图标预览的反色效果
                Object.keys(actualDefaultConfig).forEach(key => {
                    const previewDiv = document.getElementById(`preview_${key}`);
                    if (previewDiv) {
                        const img = previewDiv.querySelector('img');
                        if (img) {
                            img.style.filter = 'none'; // 恢复初始设置时关闭反色
                        }
                    }
                });
            }

            // 恢复轮盘大小设置为3级
            const sizeSlider = document.getElementById('sizeSlider');
            const sizeValue = document.getElementById('sizeValue');
            if (sizeSlider && sizeValue) {
                sizeSlider.value = 3;
                sizeValue.textContent = '3';
                updateTurntableSize(3);
            }

            // 恢复文件夹配置
            Object.keys(actualDefaultConfig).forEach(key => {
                const labelElement = document.getElementById(`label_${key}`);
                const iconElement = document.getElementById(`icon_${key}`);
                const previewDiv = document.getElementById(`preview_${key}`);
                if (labelElement && iconElement && actualDefaultConfig[key]) {
                    labelElement.value = actualDefaultConfig[key].label || '';
                    iconElement.value = actualDefaultConfig[key].icon || '';

                    // 触发输入事件，确保与其他UI逻辑（如校验/按钮状态）同步
                    try {
                        const evt = new Event('input', { bubbles: true });
                        labelElement.dispatchEvent(evt);
                        iconElement.dispatchEvent(evt);
                    } catch (_) {}

                    // 更新图标预览
                    if (previewDiv && actualDefaultConfig[key].icon) {
                        const iconUrl = actualDefaultConfig[key].icon.trim();
                        if (iconUrl) {
                            const img = previewDiv.querySelector('img');
                            if (img) {
                                img.src = iconUrl;
                                img.style.display = 'block';
                            } else {
                                previewDiv.innerHTML = `<img src="${iconUrl}" alt="图标预览" onerror="this.style.display='none'" onload="this.style.display='block'">`;
                            }

                            // 恢复初始设置时不应用反色（因为反色按钮已重置为关闭状态）
                            const imgElement = previewDiv.querySelector('img');
                            if (imgElement) {
                                imgElement.style.filter = 'none';
                            }
                        } else {
                            previewDiv.innerHTML = '';
                        }
                    }
                }
            });

            // 清除localStorage中的配置
            localStorage.removeItem('huaban_turntable_config');

            // 同步切换按钮UI
            if (typeof syncToggleUIFromSelectedText === 'function') {
                syncToggleUIFromSelectedText();
            }

            console.log('✅ 已恢复初始设置到UI，请点击"保存设置"以应用更改');
            alert('已恢复初始设置到界面！请点击"保存设置"按钮以应用更改。');

        } catch (e) {
            console.error('❌ 恢复初始设置失败:', e);
            alert('恢复初始设置失败：' + e.message);
        }
    }

    // 保存原始设置状态
    function saveOriginalSettings() {
        const selectedText = document.getElementById('selectedText');
        const iconInvertToggle = document.getElementById('iconInvertToggle');

        originalSettings = {
            themeMode: selectedText ? selectedText.textContent : '浅色',
            iconInvert: iconInvertToggle ? iconInvertToggle.classList.contains('active') : false,
            folderConfig: {}
        };

        // 保存轮盘大小设置
        const sizeSlider = document.getElementById('sizeSlider');
        originalSettings.turntableSize = sizeSlider ? parseInt(sizeSlider.value || '3', 10) : 3;

        // 保存文件夹配置
        Object.keys(FOLDER_CONFIG).forEach(key => {
            const labelElement = document.getElementById(`label_${key}`);
            const iconElement = document.getElementById(`icon_${key}`);
            if (labelElement && iconElement) {
                originalSettings.folderConfig[key] = {
                    label: labelElement.value,
                    icon: iconElement.value
                };
            }
        });
    }

    // 恢复原始设置状态
    function restoreOriginalSettings() {
        if (!originalSettings) return;

        const selectedText = document.getElementById('selectedText');
        const settingsWindow = document.getElementById('settingsWindow');
        const iconInvertToggle = document.getElementById('iconInvertToggle');
        const iconInvertKnob = document.getElementById('iconInvertKnob');

        // 恢复主题模式
        if (selectedText) {
            selectedText.textContent = originalSettings.themeMode;

            // 更新下拉选项的选中状态
            document.querySelectorAll('.dropdown-option').forEach(opt => {
                opt.classList.remove('selected');
                const val = opt.getAttribute('data-value');
                if ((originalSettings.themeMode === '深色' && val === 'dark') ||
                    (originalSettings.themeMode === '浅色' && val === 'light')) {
                    opt.classList.add('selected');
                }
            });

            // 应用主题到设置窗口
            if (originalSettings.themeMode === '深色') {
                settingsWindow.classList.add('dark');
            } else {
                settingsWindow.classList.remove('dark');
            }
        }

        // 恢复图标反色设置
        if (iconInvertToggle) {
            iconInvertToggle.classList.toggle('active', originalSettings.iconInvert);
            if (iconInvertKnob) {
                iconInvertKnob.textContent = originalSettings.iconInvert ? '◐' : '◑';
            }

            // 更新所有图标预览的反色效果
            Object.keys(originalSettings.folderConfig).forEach(key => {
                const previewDiv = document.getElementById(`preview_${key}`);
                if (previewDiv) {
                    const img = previewDiv.querySelector('img');
                    if (img) {
                        img.style.filter = originalSettings.iconInvert ? 'invert(1)' : 'none';
                    }
                }
            });
        }

        // 恢复轮盘大小设置
        if (originalSettings.turntableSize !== undefined) {
            const slider = document.getElementById('sizeSlider');
            const valueDisplay = document.getElementById('sizeValue');
            if (slider && valueDisplay) {
                slider.value = originalSettings.turntableSize;
                valueDisplay.textContent = originalSettings.turntableSize;
                updateTurntableSize(originalSettings.turntableSize);
            }
        }

        // 恢复文件夹配置（并更新预览）
        Object.keys(originalSettings.folderConfig).forEach(key => {
            const labelElement = document.getElementById(`label_${key}`);
            const iconElement = document.getElementById(`icon_${key}`);
            const previewDiv = document.getElementById(`preview_${key}`);
            if (labelElement && iconElement && originalSettings.folderConfig[key]) {
                labelElement.value = originalSettings.folderConfig[key].label || '';
                iconElement.value = originalSettings.folderConfig[key].icon || '';

                // 更新图标预览
                if (previewDiv) {
                    const iconUrl = (originalSettings.folderConfig[key].icon || '').trim();
                    if (iconUrl) {
                        const img = previewDiv.querySelector('img');
                        if (img) {
                            img.src = iconUrl;
                            img.style.display = 'block';
                        } else {
                            previewDiv.innerHTML = `<img src="${iconUrl}" alt="图标预览" onerror="this.style.display='none'" onload="this.style.display='block'">`;
                        }
                        const imgEl = previewDiv.querySelector('img');
                        if (imgEl) imgEl.style.filter = originalSettings.iconInvert ? 'invert(1)' : 'none';
                    } else {
                        previewDiv.innerHTML = '';
                    }
                }
            }
        });

        // 同步切换按钮UI
        if (typeof syncToggleUIFromSelectedText === 'function') {
            syncToggleUIFromSelectedText();
        }

        // 如果轮盘正在显示，重新渲染
        if (turntableCanvas) {
            const ctx = turntableCanvas.getContext('2d');
            renderTurntable(ctx, null);
        }
    }

    // 保存设置
    function saveSettings() {
        // 保存主题模式
        const selectedText = document.getElementById('selectedText').textContent;
        const newThemeMode = selectedText;

        // 保存图标反色设置
        const iconInvert = document.getElementById('iconInvertToggle')?.classList.contains('active') || false;

        // 保存轮盘大小设置
        const turntableSize = parseInt(document.getElementById('sizeSlider')?.value || 3);

        // 保存文件夹配置
        const newFolderConfig = {};
        Object.keys(FOLDER_CONFIG).forEach(key => {
            const label = document.getElementById(`label_${key}`).value;
            const icon = document.getElementById(`icon_${key}`).value;
            newFolderConfig[key] = { label, icon };
        });

        // 更新全局配置
        Object.assign(FOLDER_CONFIG, newFolderConfig);

        // 更新兼容性对象
        Object.keys(FOLDER_LABELS).forEach(key => {
            FOLDER_LABELS[key] = newFolderConfig[key]?.label || FOLDER_LABELS[key];
        });
        Object.keys(FOLDER_ICONS).forEach(key => {
            FOLDER_ICONS[key] = newFolderConfig[key]?.icon || FOLDER_ICONS[key];
        });

        // 更新文件夹数据
        folderData.forEach(folder => {
            if (newFolderConfig[folder.id]) {
                folder.label = newFolderConfig[folder.id].label;
            }
        });

        // 清除图标缓存以重新加载
        iconCache.clear();

        // 保存到本地存储
        try {
            localStorage.setItem('huaban_turntable_config', JSON.stringify({
                themeMode: newThemeMode,
                iconInvert: iconInvert,
                turntableSize: turntableSize,
                folderConfig: newFolderConfig
            }));
            console.log('✅ 设置已保存');
        } catch (e) {
            console.warn('⚠️ 设置保存失败:', e);
        }

        // 如果轮盘正在显示，重新渲染
        if (turntableCanvas) {
            const ctx = turntableCanvas.getContext('2d');
            renderTurntable(ctx, null);
        }
    }

    // 加载保存的设置
    function loadSettings() {
        try {
            const saved = localStorage.getItem('huaban_turntable_config');
            if (saved) {
                const config = JSON.parse(saved);

                // 更新主题模式
                if (config.themeMode) {
                    // 注意：这里不能直接修改const变量，需要在实际使用时检查localStorage
                }

                // 更新图标反色设置
                if (config.iconInvert !== undefined) {
                    const toggle = document.getElementById('iconInvertToggle');
                    const knob = document.getElementById('iconInvertKnob');
                    if (toggle) {
                        toggle.classList.toggle('active', !!config.iconInvert);
                        if (knob) knob.textContent = config.iconInvert ? '◐' : '◑';
                    }
                }

                // 更新轮盘大小设置
                if (config.turntableSize !== undefined) {
                    const slider = document.getElementById('sizeSlider');
                    const valueDisplay = document.getElementById('sizeValue');
                    if (slider && valueDisplay) {
                        slider.value = config.turntableSize;
                        valueDisplay.textContent = config.turntableSize;
                        updateTurntableSize(config.turntableSize);
                    }
                }

                // 更新文件夹配置
                if (config.folderConfig) {
                    Object.assign(FOLDER_CONFIG, config.folderConfig);

                    // 更新兼容性对象
                    Object.keys(FOLDER_LABELS).forEach(key => {
                        if (config.folderConfig[key]) {
                            FOLDER_LABELS[key] = config.folderConfig[key].label;
                        }
                    });
                    Object.keys(FOLDER_ICONS).forEach(key => {
                        if (config.folderConfig[key]) {
                            FOLDER_ICONS[key] = config.folderConfig[key].icon;
                        }
                    });

                    // 更新文件夹数据
                    folderData.forEach(folder => {
                        if (config.folderConfig[folder.id]) {
                            folder.label = config.folderConfig[folder.id].label;
                        }
                    });

                    // 将保存的配置加载到设置界面的输入框中（如果设置界面已创建）
                    Object.keys(config.folderConfig).forEach(key => {
                        const labelElement = document.getElementById(`label_${key}`);
                        const iconElement = document.getElementById(`icon_${key}`);
                        if (labelElement && iconElement && config.folderConfig[key]) {
                            labelElement.value = config.folderConfig[key].label || '';
                            iconElement.value = config.folderConfig[key].icon || '';
                            // 触发预览更新
                            const event = new Event('input', { bubbles: true });
                            iconElement.dispatchEvent(event);
                        }
                    });
                }

                console.log('✅ 设置已加载');
            }
        } catch (e) {
            console.warn('⚠️ 设置加载失败:', e);
        }
    }

    // 标签页切换功能
    window.switchTab = function(tabName) {
        // 隐藏所有标签内容
        const tabContents = document.querySelectorAll('.tab-content');
        tabContents.forEach(content => content.classList.remove('active'));

        // 移除所有标签按钮的激活状态
        const tabButtons = document.querySelectorAll('.tab-button');
        tabButtons.forEach(button => button.classList.remove('active'));

        // 显示选中的标签内容
        document.getElementById(tabName + '-tab').classList.add('active');

        // 激活选中的标签按钮
        event.target.classList.add('active');
    }

    // 修改getCurrentColors函数以支持动态主题
     getCurrentColors = () => {
         try {
             const saved = localStorage.getItem('huaban_turntable_config');
             if (saved) {
                 const config = JSON.parse(saved);
                 const themeMode = config.themeMode || THEME_MODE;
                 return themeMode === '深色' ? turntableConfig.colors.dark : turntableConfig.colors.light;
             }
         } catch (e) {
             // 忽略错误，使用默认值
         }
         return THEME_MODE === '深色' ? turntableConfig.colors.dark : turntableConfig.colors.light;
     };

    // 初始化函数
    const initialize = () => {
        createSettingsUI();
        loadSettings();
        process(); // 立即处理一次页面元素
        console.log('🎯 花瓣网拖动轮盘脚本已初始化');
    };

    // 多重初始化策略，确保在各种情况下都能正常工作
    if (document.readyState === 'loading') {
        // 如果DOM还在加载中
        document.addEventListener('DOMContentLoaded', initialize);
    } else {
        // 如果DOM已经加载完成，立即初始化
        initialize();
    }

    // 额外的延迟初始化，处理动态内容
    setTimeout(() => {
        process();
        console.log('🔄 延迟处理页面元素完成');
    }, 2000);

    console.log('🎯 花瓣网拖动轮盘脚本已加载');
})();