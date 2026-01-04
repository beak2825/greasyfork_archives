// ==UserScript==
// @name         高级侧边内容查看器
// @namespace    http://tampermonkey.net/
// @version      0.5
// @description  点击论坛帖子链接，在优雅的侧边面板中加载内容，支持宽度调整，适配1cili和其他论坛站点
// @author       You
// @match        https://www.tgb.cn/user/blog/*
// @match        https://www.wnflb2023.com/forum*
// @match        https://www.52pojie.cn/forum.php?*
// @match        *://1cili.com/*
// @grant        GM_xmlhttpRequest
// @grant        GM_addStyle
// @connect      *
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/533374/%E9%AB%98%E7%BA%A7%E4%BE%A7%E8%BE%B9%E5%86%85%E5%AE%B9%E6%9F%A5%E7%9C%8B%E5%99%A8.user.js
// @updateURL https://update.greasyfork.org/scripts/533374/%E9%AB%98%E7%BA%A7%E4%BE%A7%E8%BE%B9%E5%86%85%E5%AE%B9%E6%9F%A5%E7%9C%8B%E5%99%A8.meta.js
// ==/UserScript==

(function() {
    'use strict';
    // 添加全局样式
    GM_addStyle(`
      /* 基础链接样式优化 - 更柔和的过渡和焦点效果 */
.suh a, table tr td a, th.common a {
    cursor: pointer;
    transition: color 0.2s ease-in-out, text-shadow 0.2s ease-in-out; /* 更自然的颜色过渡和阴影 */
    text-decoration: none;
    position: relative;
    color: inherit; /* 继承父元素的颜色，方便整体风格控制 */
}

.suh a:hover, table tr td a:hover, th.common a.xst:hover {
    color: #2979ff; /* 更现代的蓝色 */
    text-shadow: 0 0 5px rgba(41, 121, 255, 0.3); /* 添加轻微的文字阴影 */
}

/* 现代化侧边面板样式 - 更精致的边框和阴影 */
#side-content-panel {
    position: fixed;
    top: 0;
    right: -40%; /* 稍微减小初始隐藏宽度 */
    width: 40%;    /* 相应调整面板宽度 */
    height: 100vh;
    background-color: #fff;
    border-left: 1px solid #eee; /* 更浅的边框 */
    z-index: 10000;
    overflow-y: auto;
    box-shadow: -5px 0 30px rgba(0, 0, 0, 0.1); /* 更柔和的阴影 */
    transition: right 0.35s cubic-bezier(0.16, 1, 0.3, 1); /* 更流畅的动画 */
    display: flex;
    flex-direction: column;
    font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; /* 更现代的字体 */
}

#side-content-panel.visible {
    right: 0;
}

/* 美化面板头部 - 更清晰的层级和交互反馈 */
#side-panel-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 12px 16px; /* 稍微调整内边距 */
    background-color: #fff; /* 与面板背景一致 */
    border-bottom: 1px solid #f0f0f0; /* 更柔和的底部边框 */
    height: 56px; /* 稍微调整高度 */
    min-height: 56px;
}

#side-panel-title {
    font-size: 17px; /* 稍微增大字体 */
    font-weight: 500; /* 更现代的字重 */
    color: #333;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    max-width: calc(100% - 90px); /* 调整最大宽度 */
}

#side-panel-actions {
    display: flex;
    gap: 8px; /* 稍微调整间距 */
}

.side-panel-btn {
    background-color: #f5f5f5; /* 更浅的按钮背景 */
    border: none;
    border-radius: 4px; /* 更小的圆角 */
    padding: 7px 9px; /* 稍微调整内边距 */
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: background-color 0.15s ease-in-out, transform 0.1s ease-in-out, box-shadow 0.15s ease-in-out; /* 更细腻的过渡 */
    color: #444;
}

.side-panel-btn:hover {
    background-color: #e0e0e0;
    transform: translateY(-0.5px); /* 更轻微的悬停位移 */
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.08); /* 添加轻微的悬停阴影 */
}

.side-panel-btn:active {
    transform: translateY(0.5px);
}

#side-panel-close {
    color: #666;
}

#side-panel-close:hover {
    color: #d32f2f; /* 更醒目的关闭颜色 */
}

#side-panel-refresh:hover {
    color: #1976d2; /* 更醒目的刷新颜色 */
}

#side-panel-open-in-new:hover {
    color: #1976d2; /* 更醒目的新窗口颜色 */
}

/* 内容区域 - 更平滑的滚动 */
#side-content-area {
    flex: 1;
    overflow-y: auto;
    position: relative;
    height: calc(100% - 56px); /* 匹配头部高度 */
    background-color: #fff; /* 与面板背景一致 */
    padding: 15px; /* 添加一些内边距 */
    box-sizing: border-box; /* 确保内边距不影响高度计算 */
    scroll-behavior: smooth; /* 平滑滚动效果 */
}

/* 调整器样式改进 - 更微妙的视觉提示 */
#side-panel-left-resizer {
    position: absolute;
    top: 0;
    left: 0;
    width: 6px; /* 稍微减小宽度 */
    height: 100%;
    cursor: ew-resize;
    background-color: transparent;
    z-index: 10001;
    transition: background-color 0.15s ease-in-out; /* 更快速的过渡 */
}

#side-panel-left-resizer:hover {
    background-color: rgba(41, 121, 255, 0.1); /* 更柔和的悬停背景 */
}

#side-panel-left-resizer:active {
    background-color: rgba(41, 121, 255, 0.2);
}

/* 主内容调整器 - 更精致的显示效果 */
#main-content-resizer {
    position: fixed;
    top: 0;
    left: 0;
    width: 4px; /* 更细的调整器 */
    height: 100%;
    cursor: ew-resize;
    background-color: #2979ff; /* 更现代的蓝色 */
    opacity: 0;
    z-index: 9999;
    transition: opacity 0.2s ease-in-out, background-color 0.15s ease-in-out;
    display: none;
}

#main-content-resizer:hover {
    opacity: 0.7 !important; /* 更明显的悬停透明度 */
    background-color: #4d90fe; /* 悬停时更亮的蓝色 */
}

#main-content-resizer.visible {
    display: block;
    opacity: 0.3; /* 初始可见时的透明度 */
}

#main-content-resizer:active {
    opacity: 0.9 !important;
}

/* 主内容区域调整效果 - 更平滑的过渡 */
body.side-panel-visible {
    margin-right: 35% !important; /* 匹配面板宽度 */
    transition: margin-right 0.35s cubic-bezier(0.16, 1, 0.3, 1); /* 更流畅的动画 */
}

/* 加载状态美化 - 更现代的加载动画 */
#side-panel-loading {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    height: 100%;
    color: #777; /* 更柔和的文字颜色 */
    padding: 25px;
}

.spinner {
    width: 36px; /* 稍微减小尺寸 */
    height: 36px;
    margin-bottom: 18px;
    border: 3px solid rgba(41, 121, 255, 0.2);
    border-radius: 50%;
    border-top: 3px solid #2979ff;
    animation: spin 0.8s cubic-bezier(0.68, -0.55, 0.27, 1.55) infinite; /* 更快的动画 */
}

@keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
}

/* 错误状态美化 - 更清晰的视觉层级 */
#side-panel-error {
    padding: 35px;
    color: #c62828; /* 更深的错误颜色 */
    text-align: center;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    height: 100%;
    box-sizing: border-box;
}

#side-panel-error h3 {
    margin-top: 18px;
    margin-bottom: 12px;
    font-weight: 500;
    font-size: 1.2em; /* 稍微增大标题 */
}

#side-panel-error p {
    margin-bottom: 22px;
    color: #777;
    max-width: 420px;
    line-height: 1.6; /* 增加行高 */
}

#side-panel-error button {
    padding: 11px 22px;
    background: #2979ff;
    color: white;
    border: none;
    border-radius: 4px; /* 更小的圆角 */
    cursor: pointer;
    font-weight: 500;
    transition: background 0.15s ease-in-out, transform 0.1s ease-in-out, box-shadow 0.15s ease-in-out;
}

#side-panel-error button:hover {
    background: #4d90fe;
    transform: translateY(-0.5px);
    box-shadow: 0 2px 6px rgba(0, 0, 0, 0.15);
}

#side-panel-error button:active {
    transform: translateY(0.5px);
}

/* iframe 样式 - 更柔和的边框 */
#side-panel-iframe {
    width: 100%;
    height: 100%;
    border: none;
    background-color: white;
    box-shadow: 0 0 8px rgba(0, 0, 0, 0.05); /* 更柔和的阴影 */
}

/* 链接视觉提示优化 - 更精致的图标和动画 */
.side-panel-trigger {
    position: relative;
}

.side-panel-trigger::after {
    content: ''; /* 使用更现代的图标字体，例如 Material Icons */
    font-family: 'Material Symbols Outlined'; /* 确保引入了字体 */
    position: absolute;
    right: 8px; /* 稍微调整位置 */
    top: 50%;
    transform: translateY(-50%);
    font-size: 16px; /* 稍微增大图标 */
    opacity: 0;
    transition: opacity 0.2s ease-in-out, transform 0.15s ease-in-out; /* 更流畅的过渡 */
}

.side-panel-trigger:hover::after {
    opacity: 0.7;
    transform: translateY(-50%) scale(1.05); /* 更轻微的缩放 */
}

/* 论坛帖子标题样式优化 - 同样使用图标字体 */
th.common {
    position: relative;
}

th.common::after {
    content: ''; /* 使用 Material Icons */
    font-family: 'Material Symbols Outlined';
    position: absolute;
    right: 8px;
    top: 50%;
    transform: translateY(-50%);
    font-size: 16px;
    opacity: 0;
    transition: opacity 0.2s ease-in-out, transform 0.15s ease-in-out;
}

th.common:hover::after {
    opacity: 0.7;
    transform: translateY(-50%) scale(1.05);
}

/* 美化宽度指示器 - 更现代的样式和动画 */
#width-indicator {
    position: fixed;
    bottom: 18px; /* 稍微调整位置 */
    right: 18px;
    background-color: rgba(51, 51, 51, 0.8); /* 更深的背景 */
    color: white;
    padding: 9px 16px; /* 稍微调整内边距 */
    border-radius: 22px; /* 更圆润 */
    font-size: 13px; /* 稍微增大字体 */
    z-index: 10002;
    pointer-events: none;
    opacity: 0;
    transition: opacity 0.25s ease-in-out, transform 0.25s cubic-bezier(0.175, 0.885, 0.32, 1.275); /* 更活泼的动画 */
    transform: translateY(15px);
    font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
    font-weight: 400; /* 更柔和的字重 */
    box-shadow: 0 3px 9px rgba(0, 0, 0, 0.25); /* 更明显的阴影 */
}

#width-indicator.visible {
    opacity: 1;
    transform: translateY(0);
}

/* 添加遮罩效果 - 更柔和的模糊效果 */
#side-panel-overlay {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(0, 0, 0, 0.2); /* 更轻的遮罩 */
    opacity: 0;
    z-index: 9998;
    transition: opacity 0.2s ease-in-out;
    pointer-events: none;
    backdrop-filter: blur(3px); /* 更明显的模糊 */
}

#side-panel-overlay.visible {
    opacity: 1;
    pointer-events: auto;
}

/* 添加标题栏图标 - 更精致的 SVG 效果 */
#side-panel-title:before {
    content: '';
    display: inline-block;
    width: 16px; /* 稍微减小尺寸 */
    height: 16px;
    background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='%232979ff' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpath d='M18 6L6 18M6 6l12 12'%3E%3C/path%3E%3C/svg%3E"); /* 更现代的蓝色 */
    background-size: contain;
    background-repeat: no-repeat;
    margin-right: 6px; /* 稍微调整间距 */
    vertical-align: middle;
    opacity: 0.7; /* 稍微降低不透明度 */
}

/* 美化帖子标题触发效果 - 同样使用图标字体和更精致的动画 */
a.xst {
    position: relative;
    display: inline-block;
    transition: color 0.15s ease-in-out, padding-right 0.15s ease-in-out; /* 同时过渡颜色和内边距 */
    padding-right: 20px; /* 稍微调整内边距 */
}

a.xst:hover {
    color: #2979ff;
    padding-right: 25px; /* 悬停时增加内边距，为图标腾出空间 */
}

a.xst::after {
    content: ''; /* 使用 Material Icons */
    font-family: 'Material Symbols Outlined';
    position: absolute;
    right: 0;
    top: 50%;
    transform: translateY(-50%);
    font-size: 16px;
    opacity: 0;
    transition: opacity 0.2s ease-in-out, transform 0.15s ease-in-out;
}
    `)

    // 创建SVG图标 - 使用更高质量的图标
    const ICONS = {
        close:
            '<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>',
        external:
            '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path><polyline points="15 3 21 3 21 9"></polyline><line x1="10" y1="14" x2="21" y2="3"></line></svg>',
        refresh:
            '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M23 4v6h-6"></path><path d="M1 20v-6h6"></path><path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10"></path><path d="M1 14l4.64 4.36A9 9 0 0 0 20.49 15"></path></svg>',
        view: '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path><circle cx="12" cy="12" r="3"></circle></svg>',
        maximize:
            '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="15 3 21 3 21 9"></polyline><polyline points="9 21 3 21 3 15"></polyline><line x1="21" y1="3" x2="14" y2="10"></line><line x1="3" y1="21" x2="10" y2="14"></line></svg>',
    }

    // 当前加载的URL
    let currentUrl = ""

    // 记录主内容区域的宽度
    let mainContentWidth = null

    // 面板宽度设置
    const defaultPanelWidth = "40%"
    let currentPanelWidth = defaultPanelWidth

    // 是否为全屏模式
    let isFullScreen = false

    // 创建宽度指示器
    function createWidthIndicator() {
        if (document.getElementById("width-indicator")) {
            return document.getElementById("width-indicator")
        }

        const indicator = document.createElement("div")
        indicator.id = "width-indicator"
        document.body.appendChild(indicator)

        return indicator
    }

    // 显示宽度指示器
    function showWidthIndicator(width) {
        const indicator = createWidthIndicator()
        indicator.textContent = `宽度: ${Math.round(width)}px`
        indicator.classList.add("visible")

        // 延迟隐藏
        clearTimeout(indicator.hideTimeout)
        indicator.hideTimeout = setTimeout(() => {
            indicator.classList.remove("visible")
        }, 1500)
    }

    // 创建遮罩层
    function createOverlay() {
        if (document.getElementById("side-panel-overlay")) {
            return document.getElementById("side-panel-overlay")
        }

        const overlay = document.createElement("div")
        overlay.id = "side-panel-overlay"
        overlay.addEventListener("click", closePanel)
        document.body.appendChild(overlay)

        return overlay
    }

    // 创建右侧内容容器
    function createContentPanel() {
        // 检查是否已存在
        if (document.getElementById("side-content-panel")) {
            return document.getElementById("side-content-panel")
        }

        // 创建遮罩层
        createOverlay()

        // 创建侧边栏容器
        const sidePanel = document.createElement("div")
        sidePanel.id = "side-content-panel"
        sidePanel.style.width = currentPanelWidth

        // 创建左侧调整大小的元素
        const leftResizer = document.createElement("div")
        leftResizer.id = "side-panel-left-resizer"
        leftResizer.title = "调整宽度"

        // 创建头部
        const header = document.createElement("div")
        header.id = "side-panel-header"

        // 创建标题
        const title = document.createElement("div")
        title.id = "side-panel-title"

        // 创建按钮区域
        const actions = document.createElement("div")
        actions.id = "side-panel-actions"

        // 创建刷新按钮
        const refreshBtn = document.createElement("button")
        refreshBtn.id = "side-panel-refresh"
        refreshBtn.className = "side-panel-btn"
        refreshBtn.innerHTML = ICONS.refresh
        refreshBtn.title = "刷新内容"
        refreshBtn.onclick = () => {
            if (currentUrl) {
                loadContent(currentUrl)
            }
        }

        // 创建全屏/恢复按钮
        const maximizeBtn = document.createElement("button")
        maximizeBtn.id = "side-panel-maximize"
        maximizeBtn.className = "side-panel-btn"
        maximizeBtn.innerHTML = ICONS.maximize
        maximizeBtn.title = "全屏/恢复"
        maximizeBtn.onclick = toggleFullScreen

        // 创建在新标签页打开按钮
        const openBtn = document.createElement("button")
        openBtn.id = "side-panel-open-in-new"
        openBtn.className = "side-panel-btn"
        openBtn.innerHTML = ICONS.external
        openBtn.title = "在新标签页打开"
        openBtn.onclick = () => {
            if (currentUrl) {
                window.open(currentUrl, "_blank")
            }
        }

        // 创建关闭按钮
        const closeBtn = document.createElement("button")
        closeBtn.id = "side-panel-close"
        closeBtn.className = "side-panel-btn"
        closeBtn.innerHTML = ICONS.close
        closeBtn.title = "关闭"
        closeBtn.onclick = closePanel

        // 创建内容区域
        const contentArea = document.createElement("div")
        contentArea.id = "side-content-area"

        // 组装面板
        actions.appendChild(refreshBtn)
        actions.appendChild(maximizeBtn)
        actions.appendChild(openBtn)
        actions.appendChild(closeBtn)

        header.appendChild(title)
        header.appendChild(actions)

        sidePanel.appendChild(leftResizer)
        sidePanel.appendChild(header)
        sidePanel.appendChild(contentArea)

        document.body.appendChild(sidePanel)

        // 创建主内容区域的调整器
        createMainContentResizer()

        // 添加右侧面板的调整大小功能
        initSidePanelResizer(leftResizer, sidePanel)

        // 添加键盘快捷键
        document.addEventListener("keydown", (e) => {
            if (sidePanel.classList.contains("visible")) {
                // Escape 关闭面板
                if (e.key === "Escape") {
                    closePanel()
                }
                // F 全屏/恢复
                else if (e.key === "f" || e.key === "F") {
                    toggleFullScreen()
                }
                // R 刷新内容
                else if (e.key === "r" || e.key === "R") {
                    if (currentUrl) {
                        loadContent(currentUrl)
                    }
                }
            }
        })

        // 双击标题栏最大化/还原
        header.addEventListener("dblclick", toggleFullScreen)

        return sidePanel
    }

    // 全屏/恢复功能
    function toggleFullScreen() {
        const sidePanel = document.getElementById("side-content-panel")
        const mainResizer = document.getElementById("main-content-resizer")

        if (!isFullScreen) {
            // 保存当前宽度
            currentPanelWidth = sidePanel.style.width

            // 设置全屏
            sidePanel.style.width = "100%"
            sidePanel.style.zIndex = "10002"

            // 隐藏调整器
            mainResizer.classList.remove("visible")

            isFullScreen = true
        } else {
            // 恢复原来的宽度
            sidePanel.style.width = currentPanelWidth
            sidePanel.style.zIndex = "10000"

            // 显示调整器
            mainResizer.classList.add("visible")

            isFullScreen = false
        }
    }

    // 创建主内容区域的调整器
    function createMainContentResizer() {
        if (document.getElementById("main-content-resizer")) {
            return document.getElementById("main-content-resizer")
        }

        const resizer = document.createElement("div")
        resizer.id = "main-content-resizer"
        resizer.title = "调整内容区域宽度"
        document.body.appendChild(resizer)

        // 初始化主内容调整功能
        initMainContentResizer(resizer)

        return resizer
    }

    // 初始化主内容区域的调整大小功能
    function initMainContentResizer(resizer) {
        let startX, startWidth

        resizer.addEventListener("mousedown", (e) => {
            e.preventDefault()
            e.stopPropagation()

            startX = e.clientX

            // 获取当前内容宽度
            const computedStyle = window.getComputedStyle(document.body)
            const paddingLeft = Number.parseFloat(computedStyle.paddingLeft) || 0
            const marginLeft = Number.parseFloat(computedStyle.marginLeft) || 0
            startWidth = mainContentWidth || paddingLeft + marginLeft

            document.documentElement.style.cursor = "ew-resize"
            document.addEventListener("mousemove", resizeMainContent)
            document.addEventListener("mouseup", stopResizeMainContent)

            // 高亮调整器
            resizer.style.opacity = "0.9"
        })

        function resizeMainContent(e) {
            const width = startWidth + (e.clientX - startX)
            if (width >= 0 && width <= window.innerWidth * 0.6) {
                document.body.style.marginLeft = width + "px"
                resizer.style.left = width + "px"
                mainContentWidth = width
                showWidthIndicator(width)
            }
        }

        function stopResizeMainContent() {
            document.documentElement.style.cursor = ""
            document.removeEventListener("mousemove", resizeMainContent)
            document.removeEventListener("mouseup", stopResizeMainContent)

            // 恢复调整器透明度
            resizer.style.opacity = "0.5"
        }
    }

    // 初始化右侧面板的调整大小功能
    function initSidePanelResizer(resizer, panel) {
        let startX,
            startWidth,
            minWidth = 300,
            maxWidth

        resizer.addEventListener("mousedown", (e) => {
            if (isFullScreen) return // 全屏模式下禁用调整大小

            e.preventDefault()
            e.stopPropagation()

            startX = e.clientX
            startWidth = Number.parseInt(panel.offsetWidth)
            maxWidth = window.innerWidth * 0.9 // 最大宽度为窗口的90%

            document.documentElement.style.cursor = "ew-resize"
            document.addEventListener("mousemove", resizeSidePanel)
            document.addEventListener("mouseup", stopResizeSidePanel)

            // 高亮调整器
            resizer.style.backgroundColor = "rgba(66, 133, 244, 0.25)"
        })

        function resizeSidePanel(e) {
            const width = startWidth - (e.clientX - startX)
            if (width >= minWidth && width <= maxWidth) {
                panel.style.width = width + "px"
                currentPanelWidth = width + "px" // 保存当前宽度
                showWidthIndicator(width)
            }
        }

        function stopResizeSidePanel() {
            document.documentElement.style.cursor = ""
            document.removeEventListener("mousemove", resizeSidePanel)
            document.removeEventListener("mouseup", stopResizeSidePanel)

            // 恢复调整器外观
            resizer.style.backgroundColor = "transparent"
        }
    }

    // 关闭面板
    function closePanel() {
        const sidePanel = document.getElementById("side-content-panel")
        const overlay = document.getElementById("side-panel-overlay")

        if (sidePanel) {
            sidePanel.classList.remove("visible")
            document.body.classList.remove("side-panel-visible")

            // 隐藏遮罩
            if (overlay) {
                overlay.classList.remove("visible")
            }

            // 隐藏主内容调整器
            const mainResizer = document.getElementById("main-content-resizer")
            if (mainResizer) {
                mainResizer.classList.remove("visible")
            }

            // 如果在全屏模式，恢复原来的宽度
            if (isFullScreen) {
                sidePanel.style.width = currentPanelWidth
                sidePanel.style.zIndex = "10000"
                isFullScreen = false
            }

            // 延迟清空内容，等动画完成
            setTimeout(() => {
                const contentArea = document.getElementById("side-content-area")
                if (contentArea) {
                    contentArea.innerHTML = ""
                }
            }, 400)
        }
    }

    // 显示面板
    function showPanel(title, url) {
        const sidePanel = createContentPanel()
        const overlay = document.getElementById("side-panel-overlay")
        currentUrl = url

        // 设置标题
        const titleElement = document.getElementById("side-panel-title")
        titleElement.textContent = title || "查看内容"

        // 显示面板
        sidePanel.classList.add("visible")
        document.body.classList.add("side-panel-visible")

        // 显示遮罩
        if (overlay) {
            overlay.classList.add("visible")
        }

        // 显示主内容调整器
        const mainResizer = document.getElementById("main-content-resizer")
        if (mainResizer && !isFullScreen) {
            // 根据当前主内容区域的左边距设置位置
            const marginLeft = Number.parseFloat(window.getComputedStyle(document.body).marginLeft) || 0
            mainResizer.style.left = marginLeft + "px"
            mainResizer.classList.add("visible")
        }

        return document.getElementById("side-content-area")
    }

    // 显示加载中
    function showLoading(container) {
        container.innerHTML = `
            <div id="side-panel-loading">
                <div class="spinner"></div>
                <div style="font-size: 15px; font-weight: 500;">正在加载内容...</div>
                <div style="margin-top: 10px; font-size: 13px; color: #999;">请稍候片刻</div>
            </div>
        `
    }

    // 显示错误
    function showError(container, message) {
        container.innerHTML = `
            <div id="side-panel-error">
                <div>
                    <svg xmlns="http://www.w3.org/2000/svg" width="50" height="50" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                        <circle cx="12" cy="12" r="10"></circle>
                        <line x1="12" y1="8" x2="12" y2="12"></line>
                        <line x1="12" y1="16" x2="12.01" y2="16"></line>
                    </svg>
                </div>
                <h3 style="margin-top:15px;margin-bottom:10px;">加载失败</h3>
                <p><span class="math-inline">\{message \|\| "无法加载请求的内容"\}</p\>
<button onclick\="window\.open\('</span>{currentUrl}', '_blank')" style="margin-top:15px;padding:8px 16px;background:#4285f4;color:white;border:none;border-radius:4px;cursor:pointer;">
                    在新标签页打开
                </button>
            </div>
        `
    }

    // 加载内容
    function loadContent(url) {
        const contentArea = document.getElementById("side-content-area")
        showLoading(contentArea)

        GM_xmlhttpRequest({
            method: "GET",
            url: url,
            onload: (response) => {
                if (response.status === 200) {
                    try {
                        // 清空现有内容
                        contentArea.innerHTML = ""

                        // 创建iframe
                        const iframe = document.createElement("iframe")
                        iframe.id = "side-panel-iframe"
                        contentArea.appendChild(iframe)

                        // 写入内容到iframe
                        const iframeDoc = iframe.contentWindow.document
                        iframeDoc.open()
                        iframeDoc.write(response.responseText)

                        // 修改iframe内链接，使其在新标签页打开
                        iframeDoc.addEventListener("DOMContentLoaded", () => {
                            const links = iframeDoc.querySelectorAll("a")
                            links.forEach((link) => {
                                if (link.href) {
                                    link.target = "_blank"
                                }
                            })
                        })

                        iframeDoc.close()
                    } catch (error) {
                        showError(contentArea, "内容解析失败: " + error.message)
                    }
                } else {
                    showError(contentArea, `加载失败 (${response.status})`)
                }
            },
            onerror: (error) => {
                showError(contentArea, "网络请求失败")
            },
        })
    }

    // 处理论坛帖子链接点击
    function handleForumLinkClick(event) {
        // 获取点击目标
        const target = event.target

        // 检查是否点击了论坛帖子链接（class="xst"的链接）
        if (target.classList.contains("xst") || target.closest("a.xst")) {
            const link = target.classList.contains("xst") ? target : target.closest("a.xst")

            // 阻止默认行为
            event.preventDefault()
            event.stopPropagation()

            // 获取链接地址和标题
            const url = link.href
            const title = link.textContent.trim()

            // 显示面板并加载内容
            showPanel(title, url)
            loadContent(url)

            return true
        }

        return false
    }

    // 处理链接点击 - 适配1cili.com和一般网站以及论坛站点
    function handleLinkClick(event) {
        // 首先尝试处理论坛帖子链接
        if (handleForumLinkClick(event)) {
            return
        }

        // 检查是否在1cili.com域名
        const is1Cili = window.location.hostname.includes("1cili.com")

        if (is1Cili) {
            // 1cili.com的特定处理
            const target = event.target
            const tableRow = target.closest("tr")

            if (!tableRow) return

            const linkCell = tableRow.querySelector("td a")
            if (!linkCell || !linkCell.href) return

            // 找到包含链接的单元格
            const linkTd = linkCell.closest("td")
            if (!linkTd) return

            // 只有当点击发生在第一个单元格时才触发
            if (target.closest("td") !== linkTd && !target.closest("a")) return

            // 阻止默认行为
            event.preventDefault()
            event.stopPropagation()

            // 提取标题
            let title = ""
            const boldElem = linkCell.querySelector("b")
            if (boldElem) {
                title = boldElem.textContent.trim()
            } else {
                title = linkCell.textContent.trim()
            }

            // 显示面板并加载内容
            showPanel(title, linkCell.href)
            loadContent(linkCell.href)

            return
        }

        // 其他网站的通用处理
        const targetTd = findParentTd(event.target)
        if (!targetTd || !targetTd.classList.contains("suh")) {
            return
        }

        // 查找链接元素
        const link = event.target.closest("a") || targetTd.querySelector("a")
        if (!link || !link.href) {
            return
        }

        // 阻止默认行为
        event.preventDefault()
        event.stopPropagation()

        // 获取链接地址和标题
        const url = link.href
        const title = link.title || link.textContent || "查看内容"

        // 显示面板并加载内容
        showPanel(title, url)
        loadContent(url)
    }

    // 查找父级TD元素
    function findParentTd(element) {
        return element.closest("td") || null
    }

    // 查找父级TH元素
    function findParentTh(element) {
        return element.closest("th") || null
    }

    // 为1cili.com网站添加视觉提示
    function enhance1CiliLinks() {
        if (!window.location.hostname.includes("1cili.com")) return

        // 找到所有表格行
        const rows = document.querySelectorAll("tr")
        rows.forEach((row) => {
            const firstCell = row.querySelector("td")
            if (firstCell && firstCell.querySelector("a")) {
                firstCell.classList.add("side-panel-trigger")
            }
        })
    }

    // 增强论坛帖子链接
    function enhanceForumLinks() {
        // 找到所有含有xst类的链接
        const forumLinks = document.querySelectorAll("a.xst")
        forumLinks.forEach((link) => {
            const th = link.closest("th")
            if (th) {
                th.classList.add("common") // 添加common类以应用样式
            }
        })
    }

    // 初始化
    function init() {
        // 监听整个文档的点击事件，通过事件代理处理
        document.addEventListener("click", handleLinkClick, true)

        // 针对1cili.com的特定增强
        if (window.location.hostname.includes("1cili.com")) {
            enhance1CiliLinks()

            // 监听DOM变化，为动态加载的内容也添加增强
            const observer = new MutationObserver((mutations) => {
                enhance1CiliLinks()
            })

            observer.observe(document.body, {
                childList: true,
                subtree: true,
            })
        }

        // 针对论坛网站的增强
        enhanceForumLinks()

        // 监听DOM变化，为动态加载的论坛内容添加增强
        const forumObserver = new MutationObserver((mutations) => {
            enhanceForumLinks()
        })

        forumObserver.observe(document.body, {
            childList: true,
            subtree: true,
        })

        console.log("高级侧边内容查看器已启用")
    }

    // 页面加载时初始化
    if (document.readyState === "loading") {
        document.addEventListener("DOMContentLoaded", init)
    } else {
        init()
    }
})()