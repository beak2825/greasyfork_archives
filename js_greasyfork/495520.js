// ==UserScript==
// @name         米家中枢极客版助手
// @namespace    http://tampermonkey.net/
// @version      v0.9.13
// @description  登录极客版页面后，自动开启助手插件，显示设备、变量与自动化的关系，方便查找设备或变量用在了哪些自动化中。点击自动化规则名称即可跳转到自动化页面并高亮所对应的设备或变量卡片。支持快捷键折叠/展开，关闭，适应画布布局，设备高亮，日志高亮，自动适应画布、设置自动化列表布局样式等功能。
// @author       王丰,sk163
// @license      MIT
// @match        http://*/*
// @match        https://*/*
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/495520/%E7%B1%B3%E5%AE%B6%E4%B8%AD%E6%9E%A2%E6%9E%81%E5%AE%A2%E7%89%88%E5%8A%A9%E6%89%8B.user.js
// @updateURL https://update.greasyfork.org/scripts/495520/%E7%B1%B3%E5%AE%B6%E4%B8%AD%E6%9E%A2%E6%9E%81%E5%AE%A2%E7%89%88%E5%8A%A9%E6%89%8B.meta.js
// ==/UserScript==
/**
 * v0.9.13更新：
 * 1、优化了部分显示样式及面板显示逻辑
 * 2、增加了新选项：高亮卡片后全屏居中显示、高亮卡片后画布比例（原始比例、自动比例、自定义比例）
 *
 * v0.9.12更新：
 * 1、修复多参数卡片未识别到变量的问题（感谢：零壹笃行反馈）
 *
 * v0.9.11更新：
 * 1、修复safari浏览器上显示异常的问题。（感谢：名字名字Air反馈）
 * 2、设置选项窗口增加了折叠后宽度、卡片颜色选择器等
 * 3、更换了整体显示风格。
 *
 * v0.9.10更新：
 * 1、通过查找设备、变量跳转到自动化页面后，将会自动画布大小，防止未高亮显示对应的设备卡片(感谢：追寻的风、间谍王师傅反馈)
 * 2、增加了虚拟事件的列表视图，可快速查找定位中枢发送或接收的虚拟事件自动化卡片。
 *
 * v0.9.9更新：
 * 1、支持https协议及端口访问(感谢：追寻的风、间谍王师傅反馈)
 *
 * v0.9.8更新：
 * 1、修复了变量列表可能重复的问题(感谢：间谍王师傅反馈)
 * 2、调整了一些显示逻辑的细节
 *
 * v0.9.7更新：
 * 1、修复自动化涉及的变量列表没有滚动条的问题(感谢：间谍王师傅反馈)
 *
 * v0.9.6更新：
 * 1、修复自动化涉及的设备列表没有滚动条的问题(感谢：间谍王师傅反馈)
 *
 * v0.9.5更新：
 * 1、自动化中设备和变量列表默认隐藏，可通过详情按钮进行展开。非常感谢原作者:【枋柚梓】PR的代码
 *
 * v0.9.4更新：
 * 1、修复变量可能引起的初始化错误
 *
 * v0.9.3更新：
 * 1、增加了在自动化中高亮显示指定的设备或变量名称
 * 2、修改了描述内容，[规则]的命名统一替换为了[自动化]，方便理解
 * 3、修复其它已知问题
 *
 * v0.9.2更新：
 * 1、修复已知问题
 *
 * v0.9.1更新：
 * 1、增加了对变量视图的支持（变量类型、变量名称、变量值的筛选、变量排序、对应规则编排中的变量卡片高亮显示等）
 * 2、调整了选项布局
 * 3、支持了对表格文本的选择，方便复制
 * 注意：仅兼容极客版v1.6.0版本
 *
 * v0.9.0更新：
 * 1、适配v1.6.0极客版
 * 注意：仅兼容极客版v1.6.0版本
 *
 * v0.8.17更新：
 * 1、修正文本变量排序（作者：Derstood）
 *
 * v0.8.16更新：
 * 1、新增变量按照名称排序（作者：Derstood）
 *
 * v0.8.15更新：
 * 1、修复自动化列表在多列显示时，筛选格式混乱问题（作者：lqs1848）
 * 2、修复自动化列表在多列显示时，第一个自动化显示错位问题（作者：lqs1848）
 *
 * v0.8.14更新：
 * 1、增加刷新助手按钮，同时增加了快捷键Ctrl+R。查看所有的快捷键，可在极客版画布的【使用指南】中进行查看。
 * 2、优化了自动化规则列表在一行多列下的显示效果。
 * 3、修正了一些已知问题
 *
 * v0.8.13更新：
 * 1、修复了一行显示多列时，由于规则名称过长导致显示错位的问题
 *
 * v0.8.12更新：
 * 1、增加了快捷键Ctrl+W，关闭当前的画布
 * 2、将快捷键说明增加到了原生的【使用指南】中
 *
 * v0.8.11更新：
 * 1、规则列表换行显示
 *
 * v0.8.10更新：
 * 1、修复了窗口过小的问题
 * 2、取消了规则列表最小宽度限制
 *
 * v0.8.9更新：
 * 1、修改了日志高亮逻辑，优化了执行效率，提升了性能，减少无用的循环
 * 2、参考了米家自动化极客版样式优化（感谢原作者：lqs1848，https://greasyfork.org/zh-CN/scripts/495833），增加了规则列表样式设置选项，可选择每行显示1-5条规则
 * 3、增加了自动折叠窗口的选项
 * 4、修正了一些已知问题
 *
 * v0.8.8更新：
 * 1. 更改了插件名称
 * 2、增加了快捷键，Ctrl/Command+E折叠/展开，Ctrl/Command+Q关闭，Ctrl/Command+B适应画布布局
 * 3、自动画布布局修改为仅在初次进入规则编排页面或激活编排页面时触发
 * 4、极客版登录后自动启动插件，无需再点击设备列表激活
 * 5、修正了一些已知问题
 */
(async () => {
    const callAPI = (api, params) => {
        return new Promise(res => editor.gateway.callAPI(api, params, res));
    };
    let scriptTitle = GM_info.script.name;
    let scriptVersion = GM_info.script.version;
    let isInit = false;
    let selectCardIds = '';
    let devMap = null;
    let defaultColor = '#43ad7f7f'
    let defaultWindowWidth = 1200;
    let defaultWindowHeight = 600;
    let defaultGraphWidth = 680;
    let defaultRuleStyle = '4';
    let minWindowWidth = 500;
    let minWindowHeight = 100;
    let minGraphWidth = 320;
    let enableEnhancedDisplayLog = GM_getValue("enableEnhancedDisplayLog");
    let enableAutoFitContent = GM_getValue("enableAutoFitContent");
    let enableAutoCollapseCheck = GM_getValue("enableAutoCollapseCheck");
    let backgroundColor = GM_getValue("backgroundColor");
    let windowWidth = GM_getValue("windowWidth");
    let windowHeight = GM_getValue("windowHeight");
    let graphWidth = GM_getValue("graphWidth");
    let ruleStyle = GM_getValue("ruleStyle");

    let canvasScale = GM_getValue("canvasScale"); // 画布比例 1-100
    let enableCenterCard = GM_getValue("enableCenterCard"); // 高亮卡片后全屏居中
    let cardDisplayScale = GM_getValue("cardDisplayScale"); // 高亮卡片后画布比例
    let customScale = GM_getValue("customScale"); // 自定义比例值
    // 折叠状态标记（用于按钮切换）
    let isCollapsed = false;
    let isGraphVisible = false;

    // 统一样式注入（Safari/Chrome 一致性）
    let styleInjected = false;

    function injectStyles() {
        if (styleInjected) return;
        styleInjected = true;
        const css = `
        :root {
            --mjk-font: -apple-system, MiSans, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, "Noto Sans", "Apple Color Emoji", "Segoe UI Emoji";
            --mjk-bg: #ffffff;
            --mjk-border: #d0d7de;
            --mjk-shadow: 0 8px 24px rgba(140,149,159,0.15);
            --mjk-radius: 8px;
            --mjk-pad: 10px;
            --mjk-z-topbar: 2147483646;
            --mjk-z-container: 2147483646;
            --mjk-z-graph: 2147483645;
            --mjk-z-options: 2147483647;
            --mjk-btn-bg: #f6f8fa;
            --mjk-btn-border: #d0d7de;
            --mjk-btn-hover: #eff1f3;
            --mjk-accent: #0000EE;
        }
        .mjk-container, .mjk-topbar, .mjk-options {
            font-family: var(--mjk-font);
            -webkit-font-smoothing: antialiased;
            -moz-osx-font-smoothing: grayscale;
        }
        .mjk-topbar {
            position: fixed;
            top: 0;
            right: 40px;
            width: var(--mjk-topbar-width, var(--mjk-width));
            height: 38px;
            background: var(--mjk-bg);
            z-index: var(--mjk-z-topbar);
            box-shadow: var(--mjk-shadow);
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding: 0 10px;
            border-radius: var(--mjk-radius);
            transform: translateZ(0);
        }
        .mjk-container {
            position: fixed;
            top: 10px;
            right: 40px;
            width: var(--mjk-width);
            height: var(--mjk-height);
            overflow: hidden;
            background: var(--mjk-bg);
            border: 1px solid var(--mjk-border);
            padding-top: 45px; /* 预留顶栏 */
            z-index: var(--mjk-z-container);
            box-shadow: var(--mjk-shadow);
            border-radius: var(--mjk-radius);
            transform: translateZ(0);
        }
        .mjk-options {
            position: fixed;
            top: 40px;
            right: 40px;
            width: 360px;
            min-height: 50px;
            display: flex;
            flex-direction: column;
            align-items: stretch;
            gap: 8px;
            padding: 12px;
            background: #f0f2f4;
            border: 1px solid var(--mjk-border);
            box-shadow: var(--mjk-shadow);
            z-index: var(--mjk-z-options);
            border-radius: var(--mjk-radius);
        }
        .mjk-btn {
            appearance: none;
            border: 1px solid var(--mjk-btn-border);
            background: var(--mjk-btn-bg);
            color: #24292f;
            height: 28px;
            padding: 0 10px;
            border-radius: 6px;
            cursor: pointer;
            font-size: 12px;
            line-height: 26px;
        }
        .mjk-btn:hover { background: var(--mjk-btn-hover); }
        .mjk-switch { }
        .mjk-filter { }
        .mjk-input, .mjk-select {
            height: 28px;
            border: 1px solid var(--mjk-border);
            padding: 0 8px;
            border-radius: 6px;
            background: var(--mjk-bg);
        }
        .mjk-input { width: 200px; }
        .mjk-select {
            height: 32px;
            padding-right: 32px;
            line-height: 30px;
            cursor: pointer;
            appearance: none;
            -webkit-appearance: none;
            -moz-appearance: none;
            background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='8' viewBox='0 0 12 8'%3E%3Cpath fill='%23666' d='M6 8 0 0h12z'/%3E%3C/svg%3E");
            background-repeat: no-repeat;
            background-position: right 10px center;
            background-size: 12px 8px;
            transition: border-color 0.2s ease, box-shadow 0.2s ease;
        }
        .mjk-select:focus {
            outline: none;
            border-color: var(--mjk-accent);
            box-shadow: 0 0 0 2px rgba(66, 133, 244, 0.15);
        }
        .mjk-select::-ms-expand { display: none; }
        .mjk-link-accent {
            color: var(--mjk-accent);
            text-decoration: none;
        }
        .mjk-link-accent:hover {
            text-decoration: underline;
        }
        .mjk-link-accent:active,
        .mjk-link-accent:focus,
        .mjk-link-accent.mjk-link-selected {
            color: #f5222d;
        }
        .mjk-color-picker {
            height: 28px;
            width: 44px;
            border: 1px solid var(--mjk-border);
            border-radius: 6px;
            padding: 0;
            background: transparent;
            cursor: pointer;
        }
        .mjk-table {
            width: 100%;
            border-collapse: collapse;
            user-select: text;
        }
        .mjk-table th, .mjk-table td {
            border: 1px solid var(--mjk-border);
            padding: 6px 8px;
            white-space: nowrap;
        }
        .mjk-table thead th {
            background: #f6f8fa;
            font-weight: 600;
        }
        .mjk-toolbar {
            display: flex;
            align-items: center;
            justify-content: space-between;
            gap: 10px;
            margin-bottom: 8px;
        }
        .mjk-view-buttons { display: flex; gap: 8px; }
        #filtersSlot { display: flex; align-items: center; gap: 10px; flex-wrap: wrap; }
        .mjk-opt-row { display: flex; align-items: center; gap: 10px; }
        #graph-list-container {
            position: fixed;
            top: 39px;
            right: 40px;
            background: var(--mjk-bg);
            border: 1px solid var(--mjk-border);
            box-shadow: var(--mjk-shadow);
            border-radius: var(--mjk-radius);
            z-index: var(--mjk-z-graph);
            height: calc(var(--mjk-height) - 50px);
            width: var(--mjk-graph-width, 680px);
        }
        /* 变量表格：更友好宽度与换行，让自动化列完整显示 */
        #varTable { table-layout: fixed; }
        #varTable th, #varTable td { white-space: normal; overflow-wrap: anywhere; word-break: break-word; }
        #varTable th:nth-child(1), #varTable td:nth-child(1) { width: 80px; }
        #varTable th:nth-child(2), #varTable td:nth-child(2) { width: 80px; }
        #varTable th:nth-child(3), #varTable td:nth-child(3) { width: 140px; }
        #varTable th:nth-child(4), #varTable td:nth-child(4) { width: 300px; }
        #varTable th:nth-child(5), #varTable td:nth-child(5) { width: auto; }

        /* 新增：专用CSS类替代内联样式 */
        /* 布局类 */
        .mjk-container-main {
            position: fixed;
            top: 10px;
            right: 40px;
            overflow-y: scroll;
            background-color: white;
            border: 1px solid #ccc;
            padding-top: 45px;
            z-index: 2147483646;
            transform: translateZ(0);
            box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
        }

        .mjk-topbar-layout {
            position: fixed;
            top: 0;
            right: 40px;
            height: 38px;
            background-color: white;
            z-index: 2147483646;
            transform: translateZ(0);
            box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding: 0 10px;
        }

        .mjk-flex-container {
            display: flex;
        }

        .mjk-flex-between {
            justify-content: space-between;
        }

        .mjk-flex-gap-10 {
            gap: 10px;
        }

        /* 间距类 */
        .mjk-margin-left-2 {
            margin-left: 2px;
        }

        .mjk-margin-left-10 {
            margin-left: 10px;
        }

        .mjk-margin-bottom-10 {
            margin-bottom: 10px;
        }

        .mjk-margin-top-10 {
            margin-top: 10px;
        }

        .mjk-margin-0 {
            margin: 0;
        }

        .mjk-padding-top-16 {
            padding-top: 16px;
        }

        /* 字体样式类 */
        .mjk-font-size-9 {
            font-size: 9px;
        }

        /* 宽度类 */
        .mjk-width-120 {
            width: 120px;
        }

        .mjk-width-200 {
            width: 200px;
        }

        /* 表格类 */
        .mjk-table-base {
            width: 100%;
            border: 1px solid black;
            user-select: text;
            border-collapse: collapse;
        }

        .mjk-table-cell-nowrap {
            text-wrap: nowrap;
        }

        .mjk-table-cell-normal {
            white-space: normal;
        }

        /* 表单样式类 */
        .mjk-form-height-32 {
            height: 32px;
        }

        .mjk-form-height-28 {
            height: 28px;
        }

        .mjk-form-border-solid {
            border-style: solid;
            border-width: 1px;
        }

        /* 显示控制类 */
        .mjk-hidden {
            display: none;
        }

        .mjk-visible {
            display: block;
        }

        .mjk-visible-flex {
            display: flex;
        }

        /* 专用组件类 */
        .mjk-graph-container {
            position: fixed;
            top: 39px;
            right: 40px;
            overflow-y: scroll;
            background-color: white;
            border: 1px solid #ccc;
            padding-top: 0px;
            z-index: 2147483645;
            transform: translateZ(0);
            box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
            overflow: auto;
        }

        .mjk-filter-container {
            /* 筛选容器基础样式，具体显示由 mjk-hidden/mjk-visible 控制 */
        }

        .mjk-title-version {
            margin-left: 2px;
            padding-top: 16px;
            font-size: 9px;
        }

        .mjk-remark-text {
            color: red;
            margin-top: 10px;
        }

        .mjk-user-select-text {
            user-select: text;
        }

        /* 容器布局调整类 */
        .mjk-collapsed-container {
            height: 0px;
            width: 0px;
            top: 0;
            right: -1px;
        }

        .mjk-expanded-container {
            width: auto;
            height: auto;
            top: 10px;
            right: 40px;
        }

        /* 新增：选项窗口专用样式 */
        .mjk-checkbox-row {
            display: flex;
            align-items: center;
            gap: 10px;
        }

        .mjk-checkbox-group {
            display: flex;
            align-items: center;
            // gap: 5px;
            margin-left: 10px;
        }

        .mjk-slider-container {
            display: flex;
            align-items: center;
            gap: 10px;
        }

        .mjk-slider {
            width: 150px;
            height: 6px;
            border-radius: 3px;
            background: #d3d3d3;
            outline: none;
            opacity: 0.7;
            transition: opacity 0.2s;
            appearance: none;
            -webkit-appearance: none;
        }

        .mjk-slider:hover {
            opacity: 1;
        }

        .mjk-slider::-webkit-slider-thumb {
            appearance: none;
            -webkit-appearance: none;
            width: 18px;
            height: 18px;
            border-radius: 50%;
            background: var(--mjk-accent);
            cursor: pointer;
        }

        .mjk-slider::-moz-range-thumb {
            width: 18px;
            height: 18px;
            border-radius: 50%;
            background: var(--mjk-accent);
            cursor: pointer;
            border: none;
        }

        .mjk-slider-value {
            min-width: 40px;
            text-align: center;
            font-weight: 500;
        }

        .mjk-conditional-input {
            margin-left: 10px;
            transition: opacity 0.2s ease;
        }

        .mjk-conditional-input.mjk-hidden {
            opacity: 0;
            pointer-events: none;
        }
        `;
        try {
            GM_addStyle(css);
        } catch (e) { /* Fallback */
            const style = document.createElement('style');
            style.textContent = css;
            document.head.appendChild(style);
        }
    }

    if (enableEnhancedDisplayLog === undefined || enableEnhancedDisplayLog === null || enableEnhancedDisplayLog === "") {
        enableEnhancedDisplayLog = true;
    }
    if (enableAutoFitContent === undefined || enableAutoFitContent === null || enableAutoFitContent === "") {
        enableAutoFitContent = true;
    }
    if (enableAutoCollapseCheck === undefined || enableAutoCollapseCheck === null || enableAutoCollapseCheck === "") {
        enableAutoCollapseCheck = false;
    }
    // 设置新选项的默认值
    if (canvasScale === undefined || canvasScale === null || canvasScale === "" || isNaN(canvasScale)) {
        canvasScale = 100; // 默认100%
    } else {
        const parsedCanvasScale = parseInt(canvasScale, 10);
        canvasScale = (parsedCanvasScale < 1 || parsedCanvasScale > 100) ? 100 : parsedCanvasScale;
    }
    if (enableCenterCard === undefined || enableCenterCard === null || enableCenterCard === "") {
        enableCenterCard = true; // 默认全屏居中
    }
    if (cardDisplayScale === undefined || cardDisplayScale === null || cardDisplayScale === "") {
        cardDisplayScale = "auto"; // 默认自动比例
    }
    if (customScale === undefined || customScale === null || customScale === "" || isNaN(customScale)) {
        customScale = 50; // 默认50%
    } else {
        const parsedCustomScale = parseInt(customScale, 10);
        customScale = (parsedCustomScale < 1) ? 1 : (parsedCustomScale > 100 ? 100 : parsedCustomScale);
    }
    if (backgroundColor === undefined || backgroundColor === null || backgroundColor === "") {
        backgroundColor = defaultColor;
    }
    if (windowWidth === undefined || windowWidth === null || windowWidth === "" || isNaN(windowWidth)) {
        windowWidth = defaultWindowWidth;
    } else {
        const parsedWindowWidth = parseInt(windowWidth, 10);
        windowWidth = Number.isNaN(parsedWindowWidth) ? defaultWindowWidth : (parsedWindowWidth < minWindowWidth ? minWindowWidth : parsedWindowWidth);
    }
    if (windowHeight === undefined || windowHeight === null || windowHeight === "" || isNaN(windowHeight)) {
        windowHeight = defaultWindowHeight;
    } else {
        const parsedWindowHeight = parseInt(windowHeight, 10);
        windowHeight = Number.isNaN(parsedWindowHeight) ? defaultWindowHeight : (parsedWindowHeight < minWindowHeight ? minWindowHeight : parsedWindowHeight);
    }
    if (graphWidth === undefined || graphWidth === null || graphWidth === "" || isNaN(graphWidth)) {
        graphWidth = defaultGraphWidth;
    } else {
        const parsedGraphWidth = parseInt(graphWidth, 10);
        graphWidth = Number.isNaN(parsedGraphWidth) ? defaultGraphWidth : (parsedGraphWidth < minGraphWidth ? minGraphWidth : parsedGraphWidth);
    }
    if (ruleStyle === undefined || ruleStyle === null || ruleStyle === "") {
        ruleStyle = defaultRuleStyle;
    }

    // 将窗口尺寸同步到 CSS 变量
    function syncCSSDims() {
        try {
            document.documentElement.style.setProperty('--mjk-width', (parseInt(windowWidth, 10) || 0) + 'px');
            document.documentElement.style.setProperty('--mjk-height', (parseInt(windowHeight, 10) || 0) + 'px');
            document.documentElement.style.setProperty('--mjk-graph-width', (parseInt(graphWidth, 10) || 0) + 'px');
            document.documentElement.style.setProperty('--mjk-topbar-width', (parseInt(graphWidth, 10) || 0) + 'px');
        } catch (e) {
        }
    }

    const toPickerColor = (value) => {
        const normalized = typeof value === 'string' ? value.trim() : '';
        if (/^#([0-9a-fA-F]{6})$/.test(normalized)) {
            return normalized;
        }
        if (/^#([0-9a-fA-F]{8})$/.test(normalized)) {
            return normalized.slice(0, 7);
        }
        const fallback = typeof defaultColor === 'string' ? defaultColor.trim() : '';
        if (/^#([0-9a-fA-F]{6})$/.test(fallback)) {
            return fallback;
        }
        if (/^#([0-9a-fA-F]{8})$/.test(fallback)) {
            return fallback.slice(0, 7);
        }
        return '#ffffff';
    };

    const bindLinkClickHighlight = (link) => {
        if (!link) return;
        const activate = () => {
            document.querySelectorAll('.mjk-link-accent.mjk-link-selected').forEach(node => {
                if (node !== link) {
                    node.classList.remove('mjk-link-selected');
                }
            });
            link.classList.add('mjk-link-selected');
        };
        link.addEventListener('mousedown', activate);
        link.addEventListener('click', activate);
        link.addEventListener('focus', activate);
    };

    const executeScript = async () => {
        if (document.getElementById('device-rule-map') || isInit === true) {
            return;
        }

        if (typeof editor === 'undefined' || typeof editor.gateway === 'undefined' || typeof editor.gateway.callAPI === 'undefined') {
            console.error('editor.gateway.callAPI 方法未定义。请确保在正确的环境中运行此脚本。');
            return;
        }

        try {
            injectStyles();
            syncCSSDims();
            isInit = true;
            const devListResponse = await callAPI('getDevList');
            devMap = devListResponse.devList;
            const roomNames = Array.from(new Set(Object.values(devMap).map(device => device.roomName)));
            let varRuleMap = {};
            let devRuleMap = {};
            let varMap = {};
            let sendEventRuleMap = {};
            let receiveEventRuleMap = {};

            const varScopes = (await callAPI('getVarScopeList', {})).scopes;
            for (const scope of varScopes) {
                const vars = await callAPI('getVarList', {scope: scope});
                Object.entries(vars).forEach(([vid, v]) => {
                    varRuleMap[vid] = [];
                    varMap[vid] = {
                        name: v.userData.name,
                        scope: (scope === "global" ? "全局" : "局部"),
                        type: (v.type === "string" ? "文本" : "数值"),
                        value: v.value
                    }
                });
            }

            const ruleList = await callAPI('getGraphList')
            for (const rule of ruleList) {
                const content = await callAPI('getGraph', {id: rule.id});
                const dids = new Set(content.nodes.map(n => n.props?.did).filter(did => did !== undefined));
                const devCards = new Set(content.nodes.map(n => {
                    return (n.props && n.id) ? {did: n.props.did, cid: n.id} : undefined;
                }).filter(card => card !== undefined));

                dids.forEach(did => {
                    devRuleMap[did] = devRuleMap[did] ?? [];
                    const cardIds = Array.from(devCards)
                        .filter(card => card.did === did)
                        .map(card => card.cid).join(',');
                    const tempDevRule = {
                        ruleId: rule.id,
                        cardIds: cardIds,
                        totalCardNum: devCards.size
                    };

                    devRuleMap[did].push(tempDevRule);
                });

                const varCards = content.nodes.flatMap(node => {
                    if (!node.props || !node.id) return [];

                    const cards = [];
                    // 直接变量卡片
                    if (node.props.scope) {
                        cards.push({vid: node.props.id, cid: node.id});
                    }
                    // 参数中的变量
                    if (node.props.arguments?.length > 0) {
                        cards.push(...node.props.arguments
                            .filter(arg => arg.id)
                            .map(arg => ({vid: arg.id, cid: node.id}))
                        );
                    }
                    return cards;
                });

                const varids = new Set(content.nodes
                    .flatMap(node => {
                        if (!node.props) return [];

                        const ids = [];
                        // 直接变量卡片的ID
                        if (node.props.scope) {
                            ids.push(node.props.id);
                        }
                        // 参数中的变量ID
                        if (node.props.arguments?.length > 0) {
                            ids.push(...node.props.arguments
                                .filter(arg => arg.id)
                                .map(arg => arg.id)
                            );
                        }
                        return ids;
                    })
                );

                varids.forEach(vid => {
                    varRuleMap[vid] = varRuleMap[vid] ?? [];
                    const cardIds = varCards
                        .filter(card => card.vid === vid)
                        .map(card => card.cid)
                        .join(',');
                    varRuleMap[vid].push({
                        ruleId: rule.id,
                        cardIds: cardIds,
                        totalCardNum: varCards.length
                    });
                });

                //发出虚拟事件的列表
                const gatewaySendEventCards = new Set(content.nodes.map(n => {
                    return (n.props && n.cfg && n.id && n.type === "deviceOutput"
                        && n.cfg.urn && n.cfg.urn.indexOf("device:gateway") > -1
                        && n.props.siid && n.props.siid === 4 && n.props.aiid && n.props.aiid === 1
                        && n.props.ins && n.props.ins[0] && n.props.ins[0].piid && n.props.ins[0].piid === 1
                    ) ? {
                        did: n.props.did,
                        cid: n.id,
                        eventName: n.props.ins[0].value ? n.props.ins[0].value : n.props.ins[0].id + "$$" + n.props.ins[0].scope
                    } : undefined;
                }).filter(card => card !== undefined));
                //接收虚拟事件的列表
                const gatewayReceiveEventCards = new Set(content.nodes.map(n => {
                    return (n.props && n.cfg && n.id && n.type === "deviceInput"
                        && n.cfg.urn && n.cfg.urn.indexOf("device:gateway") > -1
                        && n.props.siid && n.props.siid === 4 && n.props.eiid && n.props.eiid === 1
                        && n.props.arguments && n.props.arguments[0] && n.props.arguments[0].piid && n.props.arguments[0].piid === 1
                    ) ? {did: n.props.did, cid: n.id, eventName: n.props.arguments[0].v1} : undefined;
                }).filter(card => card !== undefined));

                const processEventCards = (eventCards, eventType) => {
                    eventCards.forEach(event => {
                        let eventName = event.eventName;
                        let cid = event.cid;
                        if (eventName.indexOf("$$") > -1) {
                            let vid = event.eventName.split("$$")[0];
                            let scope = event.eventName.split("$$")[1];
                            const varData = varMap[vid];
                            if (varData) {
                                eventName = "变量名：${" + varData.name + "}，当前值：" + varData.value;
                            }
                        }
                        if (eventType === "send") {
                            sendEventRuleMap[eventName] = sendEventRuleMap[eventName] ?? {};
                            sendEventRuleMap[eventName][rule.id] = sendEventRuleMap[eventName][rule.id] ?? {}
                            sendEventRuleMap[eventName][rule.id]["totalCardNum"] = eventCards.size;
                            sendEventRuleMap[eventName][rule.id]["cardIds"] = sendEventRuleMap[eventName][rule.id]["cardIds"] ?? []
                            sendEventRuleMap[eventName][rule.id]["cardIds"].push(cid);
                        } else {
                            receiveEventRuleMap[eventName] = receiveEventRuleMap[eventName] ?? [];
                            receiveEventRuleMap[eventName][rule.id] = receiveEventRuleMap[eventName][rule.id] ?? {}
                            receiveEventRuleMap[eventName][rule.id]["totalCardNum"] = eventCards.size;
                            receiveEventRuleMap[eventName][rule.id]["cardIds"] = receiveEventRuleMap[eventName][rule.id]["cardIds"] ?? []
                            receiveEventRuleMap[eventName][rule.id]["cardIds"].push(cid);
                        }
                    });
                };

                processEventCards(gatewaySendEventCards, "send");
                processEventCards(gatewayReceiveEventCards, "receive");
            }
            const devRuleData = Object.fromEntries(
                Object.entries(devRuleMap).map(([did, devRules]) => [
                    did,
                    {
                        device: {
                            name: devMap[did]?.name ?? `did: ${did}`,
                            roomName: devMap[did]?.roomName ?? `未知`
                        },
                        rules: devRules.map(dr => {
                            const rule = ruleList.find(r => r.id === dr.ruleId);
                            return {
                                id: dr.ruleId,
                                cardIds: dr.cardIds,
                                totalCardNum: dr.totalCardNum,
                                name: rule ? rule.userData.name : 'Unknown'
                            };
                        })
                    }
                ])
            );

            const varRuleData = Object.fromEntries(
                Object.entries(varRuleMap).map(([vid, varRules]) => [
                    vid,
                    {
                        rules: varRules.map(vr => {
                            const rule = ruleList.find(r => r.id === vr.ruleId);
                            return {
                                id: vr.ruleId,
                                cardIds: vr.cardIds,
                                totalCardNum: vr.totalCardNum,
                                name: rule ? rule.userData.name : 'Unknown'
                            };
                        })
                    }
                ])
            );

            const sendEventRuleData = Object.fromEntries(
                Object.entries(sendEventRuleMap).map(([eventName, eventRuleCardsMap]) => [
                    eventName,
                    {
                        rules: Object.entries(eventRuleCardsMap).map(([ruleId, cardsInfo]) => {
                            const rule = ruleList.find(r => r.id === ruleId);
                            return {
                                id: ruleId,
                                cardIds: cardsInfo["cardIds"].join(','),
                                totalCardNum: cardsInfo["totalCardNum"],
                                name: rule ? rule.userData.name : 'Unknown'
                            };
                        })
                    }
                ])
            );
            const receiveEventRuleData = Object.fromEntries(
                Object.entries(receiveEventRuleMap).map(([eventName, eventRuleCardsMap]) => [
                    eventName,
                    {
                        rules: Object.entries(eventRuleCardsMap).map(([ruleId, cardsInfo]) => {
                            const rule = ruleList.find(r => r.id === ruleId);
                            return {
                                id: ruleId,
                                cardIds: cardsInfo["cardIds"].join(','),
                                totalCardNum: cardsInfo["totalCardNum"],
                                name: rule ? rule.userData.name : 'Unknown'
                            };
                        })
                    }
                ])
            );

            const container = document.createElement('div');
            container.id = 'device-rule-map';
            container.classList.add('mjk-container', 'mjk-container-main');
            // 尺寸由 CSS 变量控制：--mjk-width / --mjk-height

            const topBar = document.createElement('div');
            topBar.id = 'topBar';
            topBar.classList.add('mjk-topbar', 'mjk-topbar-layout');
            // 顶栏宽度由 CSS 变量控制

            const titleDiv = document.createElement('div');
            titleDiv.classList.add('mjk-flex-container');
            const title = document.createElement('h2');
            title.classList.add('mjk-margin-0');
            title.textContent = scriptTitle;
            titleDiv.appendChild(title);
            const version = document.createElement('span');
            version.textContent = scriptVersion;
            version.classList.add('mjk-title-version');
            titleDiv.appendChild(version);

            const buttonContainer = document.createElement('div');
            buttonContainer.classList.add('mjk-flex-container', 'mjk-flex-gap-10');

            const optionsButton = document.createElement('button');
            optionsButton.id = "optionsButton";
            optionsButton.className = 'mjk-btn';
            optionsButton.textContent = '选项';
            optionsButton.title = '选项';
            optionsButton.onclick = () => {
                handleOptionsBtnClick();
            };

            const collapseButton = document.createElement('button');
            collapseButton.id = "collapseButton";
            collapseButton.className = 'mjk-btn';
            collapseButton.textContent = '折叠';
            collapseButton.title = '快捷键为Ctrl+E';
            collapseButton.onclick = () => {
                handleCollapseBtnClick();
            };

            const closeButton = document.createElement('button');
            closeButton.id = "closeButton";
            closeButton.className = 'mjk-btn';
            closeButton.title = '快捷键为Ctrl+Q';
            closeButton.textContent = '关闭';
            closeButton.onclick = () => {
                closeGraphContainer();
                if (document.getElementById('device-rule-map')) {
                    document.body.removeChild(container);
                }
                const oldTopBar = document.getElementById('topBar');
                if (oldTopBar && oldTopBar.parentElement) {
                    oldTopBar.parentElement.removeChild(oldTopBar);
                }
                const oldOptions = document.getElementById('optionsContainer');
                if (oldOptions && oldOptions.parentElement) {
                    oldOptions.parentElement.removeChild(oldOptions);
                }
                isInit = false;
            }

            const refreshButton = document.createElement('button');
            refreshButton.id = "refreshButton";
            refreshButton.className = 'mjk-btn';
            refreshButton.title = '快捷键为Ctrl+R';
            refreshButton.textContent = '刷新';
            refreshButton.onclick = () => {
                closeGraphContainer();
                if (document.getElementById('device-rule-map')) {
                    document.body.removeChild(container);
                }
                const oldTopBar = document.getElementById('topBar');
                if (oldTopBar && oldTopBar.parentElement) {
                    oldTopBar.parentElement.removeChild(oldTopBar);
                }
                const oldOptions = document.getElementById('optionsContainer');
                if (oldOptions && oldOptions.parentElement) {
                    oldOptions.parentElement.removeChild(oldOptions);
                }
                isInit = false;
                executeScript();
                setTimeout(function () {
                    handleUrlChange();
                }, 500);
            }

            const graphListDetailButton = document.createElement('button');
            graphListDetailButton.id = "graphListDetailButton";
            graphListDetailButton.className = 'mjk-btn';
            graphListDetailButton.textContent = '详情';
            graphListDetailButton.classList.add('mjk-hidden');
            graphListDetailButton.onclick = () => {
                handleGraphListDetailBtnClick();
            }

            buttonContainer.appendChild(collapseButton);
            buttonContainer.appendChild(graphListDetailButton);
            buttonContainer.appendChild(optionsButton);
            buttonContainer.appendChild(refreshButton);
            buttonContainer.appendChild(closeButton);

            topBar.appendChild(titleDiv);
            topBar.appendChild(buttonContainer);

            const optionsContainer = document.createElement('div');
            optionsContainer.id = 'optionsContainer';
            optionsContainer.classList.add('mjk-options', 'mjk-hidden');

            const widthInput = document.createElement('input');
            widthInput.className = 'mjk-input';
            widthInput.type = 'text';
            widthInput.value = windowWidth;
            widthInput.placeholder = windowWidth + 'px';
            widthInput.onchange = () => {
                const parsedWidth = parseInt(widthInput.value, 10);
                if (Number.isNaN(parsedWidth)) {
                    widthInput.value = windowWidth;
                    return;
                }
                windowWidth = parsedWidth < minWindowWidth ? minWindowWidth : parsedWidth;
                widthInput.value = windowWidth;
                GM_setValue("windowWidth", windowWidth);
                syncCSSDims();
            };
            const spanW = document.createElement('span');
            spanW.textContent = '主窗口宽度:';
            spanW.classList.add('mjk-margin-left-10');
            const rowW = document.createElement('div');
            rowW.className = 'mjk-opt-row';
            rowW.appendChild(spanW);
            rowW.appendChild(widthInput);
            optionsContainer.appendChild(rowW);

            const heightInput = document.createElement('input');
            heightInput.className = 'mjk-input';
            heightInput.type = 'text';
            heightInput.value = windowHeight;
            heightInput.placeholder = windowHeight + 'px';
            heightInput.onchange = () => {
                const parsedHeight = parseInt(heightInput.value, 10);
                if (Number.isNaN(parsedHeight)) {
                    heightInput.value = windowHeight;
                    return;
                }
                windowHeight = parsedHeight < minWindowHeight ? minWindowHeight : parsedHeight;
                heightInput.value = windowHeight;
                GM_setValue("windowHeight", windowHeight);
                syncCSSDims();
            };
            const spanH = document.createElement('span');
            spanH.textContent = '主窗口高度:';
            spanH.classList.add('mjk-margin-left-10');
            const rowH = document.createElement('div');
            rowH.className = 'mjk-opt-row';
            rowH.appendChild(spanH);
            rowH.appendChild(heightInput);
            optionsContainer.appendChild(rowH);

            const graphWidthInput = document.createElement('input');
            graphWidthInput.className = 'mjk-input';
            graphWidthInput.type = 'text';
            graphWidthInput.value = graphWidth;
            graphWidthInput.placeholder = graphWidth + 'px';
            graphWidthInput.onchange = () => {
                const parsedGraphWidthInput = parseInt(graphWidthInput.value, 10);
                if (Number.isNaN(parsedGraphWidthInput)) {
                    graphWidthInput.value = graphWidth;
                    return;
                }
                graphWidth = parsedGraphWidthInput < minGraphWidth ? minGraphWidth : parsedGraphWidthInput;
                graphWidthInput.value = graphWidth;
                GM_setValue("graphWidth", graphWidth);
                syncCSSDims();
            };
            const spanGraph = document.createElement('span');
            spanGraph.textContent = '折叠后宽度:';
            spanGraph.classList.add('mjk-margin-left-10');
            const rowGraph = document.createElement('div');
            rowGraph.className = 'mjk-opt-row';
            rowGraph.appendChild(spanGraph);
            rowGraph.appendChild(graphWidthInput);
            optionsContainer.appendChild(rowGraph);

            const ruleStyleSelect = document.createElement('select');
            ruleStyleSelect.className = 'mjk-select';
            ruleStyleSelect.innerHTML = '<option value="1">每行1列</option>' +
                '<option value="2">每行2列</option>' +
                '<option value="3">每行3列</option>' +
                '<option value="4">每行4列</option>' +
                '<option value="5">每行5列</option>';
            ruleStyleSelect.onchange = () => {
                GM_setValue("ruleStyle", ruleStyleSelect.value);
                changeRuleListStyle(ruleStyleSelect.value);
            };
            const spanS = document.createElement('span');
            spanS.textContent = '自动化列表:';
            spanS.classList.add('mjk-margin-left-10');
            const rowS = document.createElement('div');
            rowS.className = 'mjk-opt-row';
            rowS.appendChild(spanS);
            rowS.appendChild(ruleStyleSelect);
            optionsContainer.appendChild(rowS);
            ruleStyleSelect.value = ruleStyle;
            changeRuleListStyle(ruleStyle);

            const colorInput = document.createElement('input');
            colorInput.className = 'mjk-input';
            colorInput.type = 'text';
            colorInput.placeholder = defaultColor;
            colorInput.classList.add('mjk-width-120');
            colorInput.value = backgroundColor;
            const colorPicker = document.createElement('input');
            colorPicker.type = 'color';
            colorPicker.className = 'mjk-color-picker';
            colorPicker.value = toPickerColor(backgroundColor || defaultColor);
            colorInput.oninput = () => {
                backgroundColor = colorInput.value;
                GM_setValue("backgroundColor", backgroundColor);
                const pickerValue = toPickerColor(backgroundColor);
                if (pickerValue) {
                    colorPicker.value = pickerValue;
                }
            };
            colorPicker.oninput = () => {
                const currentValue = colorInput.value.trim();
                const alphaSuffix = /^#([0-9a-fA-F]{8})$/.test(currentValue) ? currentValue.slice(7) : '';
                colorInput.value = colorPicker.value + alphaSuffix;
                colorInput.dispatchEvent(new Event('input', {bubbles: true}));
            };
            const spanC = document.createElement('span');
            spanC.textContent = '高亮卡片色:';
            spanC.classList.add('mjk-margin-left-10');
            const rowC = document.createElement('div');
            rowC.className = 'mjk-opt-row';
            rowC.appendChild(spanC);
            rowC.appendChild(colorInput);
            rowC.appendChild(colorPicker);
            optionsContainer.appendChild(rowC);

            // 创建复选框组合行：日志高亮、自动画布、自动折叠
            const checkboxRow = document.createElement('div');
            checkboxRow.classList.add('mjk-checkbox-row');

            // 日志高亮复选框组
            const logGroup = document.createElement('div');
            logGroup.classList.add('mjk-checkbox-group');
            const logLabel = document.createElement('label');
            logLabel.htmlFor = 'highlightLogCheck';
            logLabel.appendChild(document.createTextNode('日志高亮'));
            const highlightLogCheck = document.createElement('input');
            highlightLogCheck.className = 'mjk-checkbox';
            highlightLogCheck.type = 'checkbox';
            highlightLogCheck.id = 'highlightLogCheck';
            highlightLogCheck.checked = enableEnhancedDisplayLog;
            highlightLogCheck.onchange = function () {
                enableEnhancedDisplayLog = highlightLogCheck.checked;
                GM_setValue("enableEnhancedDisplayLog", enableEnhancedDisplayLog);
            };
            logGroup.appendChild(logLabel);
            logGroup.appendChild(highlightLogCheck);

            // 自动画布复选框组
            const fitGroup = document.createElement('div');
            fitGroup.classList.add('mjk-checkbox-group');
            const fitLabel = document.createElement('label');
            fitLabel.htmlFor = 'autoFitCheck';
            fitLabel.appendChild(document.createTextNode('自动画布'));
            const autoFitCheck = document.createElement('input');
            autoFitCheck.className = 'mjk-checkbox';
            autoFitCheck.type = 'checkbox';
            autoFitCheck.id = 'autoFitCheck';
            autoFitCheck.checked = enableAutoFitContent;
            autoFitCheck.onchange = function () {
                enableAutoFitContent = autoFitCheck.checked;
                GM_setValue("enableAutoFitContent", enableAutoFitContent);
            };
            fitGroup.appendChild(fitLabel);
            fitGroup.appendChild(autoFitCheck);

            // 自动折叠复选框组
            const collapseGroup = document.createElement('div');
            collapseGroup.classList.add('mjk-checkbox-group');
            const autoCollapseLabel = document.createElement('label');
            autoCollapseLabel.htmlFor = 'autoCollapseCheck';
            autoCollapseLabel.appendChild(document.createTextNode('自动折叠'));
            const autoCollapseCheck = document.createElement('input');
            autoCollapseCheck.className = 'mjk-checkbox';
            autoCollapseCheck.type = 'checkbox';
            autoCollapseCheck.id = 'autoCollapseCheck';
            autoCollapseCheck.checked = enableAutoCollapseCheck;
            autoCollapseCheck.onchange = function () {
                enableAutoCollapseCheck = autoCollapseCheck.checked;
                GM_setValue("enableAutoCollapseCheck", enableAutoCollapseCheck);
                autoCollapse();
            };
            collapseGroup.appendChild(autoCollapseLabel);
            collapseGroup.appendChild(autoCollapseCheck);

            // 将三个复选框组添加到行中
            checkboxRow.appendChild(logGroup);
            checkboxRow.appendChild(fitGroup);
            checkboxRow.appendChild(collapseGroup);
            optionsContainer.appendChild(checkboxRow);

            // 画布比例滑块选项
            const canvasScaleRow = document.createElement('div');
            canvasScaleRow.className = 'mjk-opt-row';
            const canvasScaleLabel = document.createElement('span');
            canvasScaleLabel.textContent = '画布比例:';
            canvasScaleLabel.classList.add('mjk-margin-left-10');

            const canvasScaleContainer = document.createElement('div');
            canvasScaleContainer.classList.add('mjk-slider-container');

            const canvasScaleSlider = document.createElement('input');
            canvasScaleSlider.type = 'range';
            canvasScaleSlider.min = '1';
            canvasScaleSlider.max = '100';
            canvasScaleSlider.value = canvasScale;
            canvasScaleSlider.classList.add('mjk-slider');
            canvasScaleSlider.id = 'canvasScaleSlider';

            const canvasScaleValue = document.createElement('span');
            canvasScaleValue.classList.add('mjk-slider-value');
            canvasScaleValue.textContent = canvasScale + '%';
            canvasScaleValue.id = 'canvasScaleValue';

            canvasScaleSlider.oninput = function () {
                canvasScale = parseInt(canvasScaleSlider.value, 10);
                canvasScaleValue.textContent = canvasScale + '%';
                GM_setValue("canvasScale", canvasScale);
                editor.transformTool.scaleCanvasAtPoint(editor.graphTool.centerPoint, 1, (Math.round(canvasScale / 100 * 10) / 10))
            };

            canvasScaleContainer.appendChild(canvasScaleSlider);
            canvasScaleContainer.appendChild(canvasScaleValue);
            canvasScaleRow.appendChild(canvasScaleLabel);
            canvasScaleRow.appendChild(canvasScaleContainer);
            optionsContainer.appendChild(canvasScaleRow);

            // 高亮卡片后使其居中选项
            const centerCardRow = document.createElement('div');
            centerCardRow.className = 'mjk-opt-row';
            const centerCardLabel = document.createElement('span');
            centerCardLabel.textContent = '高亮卡片画布居中';
            centerCardLabel.classList.add('mjk-margin-left-10');

            const centerCardCheck = document.createElement('input');
            centerCardCheck.className = 'mjk-checkbox';
            centerCardCheck.type = 'checkbox';
            centerCardCheck.id = 'centerCardCheck';
            centerCardCheck.checked = enableCenterCard;
            centerCardCheck.onchange = function () {
                enableCenterCard = centerCardCheck.checked;
                GM_setValue("enableCenterCard", enableCenterCard);
            };

            centerCardRow.appendChild(centerCardLabel);
            centerCardRow.appendChild(centerCardCheck);
            optionsContainer.appendChild(centerCardRow);

            // 选择卡片后显示比例选项
            const cardDisplayRow = document.createElement('div');
            cardDisplayRow.className = 'mjk-opt-row';
            const cardDisplayLabel = document.createElement('span');
            cardDisplayLabel.textContent = '高亮卡片画布比例:';
            cardDisplayLabel.classList.add('mjk-margin-left-10');

            const cardDisplaySelect = document.createElement('select');
            cardDisplaySelect.className = 'mjk-select';
            cardDisplaySelect.id = 'cardDisplaySelect';
            cardDisplaySelect.innerHTML =
                '<option value="original">原始比例</option>' +
                '<option value="auto">自动比例</option>' +
                '<option value="custom">指定比例</option>';
            cardDisplaySelect.value = cardDisplayScale;

            // 自定义比例输入框
            const customScaleInput = document.createElement('input');
            customScaleInput.className = 'mjk-input mjk-conditional-input';
            customScaleInput.type = 'number';
            customScaleInput.min = '1';
            customScaleInput.value = customScale;
            customScaleInput.placeholder = '比例%';
            customScaleInput.id = 'customScaleInput';
            customScaleInput.style.width = '40px';
            // 根据当前选择显示/隐藏自定义输入框
            if (cardDisplayScale !== 'custom') {
                customScaleInput.classList.add('mjk-hidden');
            }

            cardDisplaySelect.onchange = function () {
                cardDisplayScale = cardDisplaySelect.value;
                GM_setValue("cardDisplayScale", cardDisplayScale);
                if (cardDisplayScale === 'custom') {
                    customScaleInput.classList.remove('mjk-hidden');
                } else {
                    customScaleInput.classList.add('mjk-hidden');
                }
            };

            customScaleInput.onchange = function () {
                const value = parseInt(customScaleInput.value, 10);
                if (!isNaN(value)) {
                    customScale = value < 1 ? 1 : (value > 100 ? 100 : value);
                    GM_setValue("customScale", customScale);
                    customScaleInput.value = customScale;
                }
            };

            cardDisplayRow.appendChild(cardDisplayLabel);
            cardDisplayRow.appendChild(cardDisplaySelect);
            cardDisplayRow.appendChild(customScaleInput);
            optionsContainer.appendChild(cardDisplayRow);
            // 选项窗口固定到 body，避免受容器折叠与 transform 影响（Safari 兼容）
            const existedOptions = document.getElementById('optionsContainer');
            if (existedOptions && existedOptions !== optionsContainer && existedOptions.parentElement) {
                existedOptions.parentElement.removeChild(existedOptions);
            }
            document.body.appendChild(optionsContainer);


            //设备表格
            const devTable = document.createElement('table');
            devTable.id = 'devTable';
            devTable.className = 'mjk-table';
            devTable.border = '1';
            devTable.cellSpacing = '0';
            devTable.cellPadding = '5';
            devTable.classList.add('mjk-table-base');

            const devThead = document.createElement('thead');
            const devHeaderRow = document.createElement('tr');
            const devRoomHeader = document.createElement('th');
            const devDeviceHeader = document.createElement('th');
            const devRuleHeader = document.createElement('th');
            const devTbody = document.createElement('tbody');

            let roomSortOrder = 'asc';
            let deviceSortOrder = 'asc';
            let ruleSortOrder = 'asc';

            const devUpdateSortMarkers = () => {
                devRoomHeader.innerHTML = `房间 ${roomSortOrder === 'asc' ? '⬆️' : '⬇️'}`;
                devDeviceHeader.innerHTML = `设备 ${deviceSortOrder === 'asc' ? '⬆️' : '⬇️'}`;
                devRuleHeader.innerHTML = `自动化名称 ${ruleSortOrder === 'asc' ? '⬆️' : '⬇️'}`;
            };

            devRoomHeader.textContent = '房间';
            devRoomHeader.classList.add('mjk-table-cell-nowrap');
            devDeviceHeader.textContent = '设备';
            devDeviceHeader.classList.add('mjk-table-cell-nowrap');
            devRuleHeader.textContent = '自动化名称';

            devRoomHeader.onclick = () => {
                roomSortOrder = roomSortOrder === 'asc' ? 'desc' : 'asc';
                sortTable(devTbody, 0, roomSortOrder);
                devUpdateSortMarkers();
            };
            devDeviceHeader.onclick = () => {
                deviceSortOrder = deviceSortOrder === 'asc' ? 'desc' : 'asc';
                sortTable(devTbody, 1, deviceSortOrder);
                devUpdateSortMarkers();
            };
            devRuleHeader.onclick = () => {
                ruleSortOrder = ruleSortOrder === 'asc' ? 'desc' : 'asc';
                sortTable(devTbody, 2, ruleSortOrder);
                devUpdateSortMarkers();
            };

            devHeaderRow.appendChild(devRoomHeader);
            devHeaderRow.appendChild(devDeviceHeader);
            devHeaderRow.appendChild(devRuleHeader);
            devThead.appendChild(devHeaderRow);
            devTable.appendChild(devThead);

            const devFilterContainer = document.createElement('span');
            devFilterContainer.id = 'devFilterContainer';
            devFilterContainer.classList.add('mjk-filter');

            const roomFilterSelect = document.createElement('select');
            roomFilterSelect.className = 'mjk-select';
            roomFilterSelect.classList.add('mjk-form-height-32', 'mjk-form-border-solid');
            roomFilterSelect.innerHTML = `<option value="">所有房间</option>` + roomNames.map(room => `<option value="${room}">${room}</option>`).join('');
            roomFilterSelect.onchange = () => {
                filterDevTable(roomFilterSelect.value, deviceFilterInput.value, devRuleFilterInput.value);
            };
            const deviceFilterInput = document.createElement('input');
            deviceFilterInput.className = 'mjk-input';
            deviceFilterInput.type = 'text';
            deviceFilterInput.placeholder = '设备筛选';
            deviceFilterInput.classList.add('mjk-width-200', 'mjk-margin-left-10', 'mjk-form-height-28', 'mjk-form-border-solid');
            deviceFilterInput.oninput = () => {
                filterDevTable(roomFilterSelect.value, deviceFilterInput.value, devRuleFilterInput.value);
            };
            const devRuleFilterInput = document.createElement('input');
            devRuleFilterInput.className = 'mjk-input';
            devRuleFilterInput.type = 'text';
            devRuleFilterInput.placeholder = '自动化名称筛选';
            devRuleFilterInput.classList.add('mjk-width-200', 'mjk-margin-left-10', 'mjk-form-height-28', 'mjk-form-border-solid');
            devRuleFilterInput.oninput = () => {
                filterDevTable(roomFilterSelect.value, deviceFilterInput.value, devRuleFilterInput.value);
            };

            devFilterContainer.appendChild(roomFilterSelect);
            devFilterContainer.appendChild(deviceFilterInput);
            devFilterContainer.appendChild(devRuleFilterInput);

            // 工具栏（左侧过滤 + 右侧视图按钮）
            const toolbarRow = document.createElement('div');
            toolbarRow.id = 'toolbarRow';
            toolbarRow.className = 'mjk-toolbar';
            const filtersSlot = document.createElement('div');
            filtersSlot.id = 'filtersSlot';
            toolbarRow.appendChild(filtersSlot);
            const viewButtons = document.createElement('div');
            viewButtons.id = 'viewButtons';
            viewButtons.className = 'mjk-view-buttons';
            toolbarRow.appendChild(viewButtons);
            container.appendChild(toolbarRow);

            const varFilterContainer = document.createElement('span');
            varFilterContainer.id = 'varFilterContainer';
            varFilterContainer.classList.add('mjk-filter', 'mjk-hidden');

            const varScopeFilterSelect = document.createElement('select');
            varScopeFilterSelect.className = 'mjk-select';
            varScopeFilterSelect.innerHTML =
                '<option value="">所有变量范围</option>' +
                '<option value="全局">全局</option>' +
                '<option value="局部">局部</option>';
            varScopeFilterSelect.onchange = () => {
                filterVarTable(varScopeFilterSelect.value, varTypeFilterSelect.value, varNameFilterInput.value, varValueFilterInput.value, varRuleFilterInput.value);
            };
            const varTypeFilterSelect = document.createElement('select');
            varTypeFilterSelect.className = 'mjk-select';
            varTypeFilterSelect.innerHTML =
                '<option value="">所有变量类型</option>' +
                '<option value="文本">文本</option>' +
                '<option value="数值">数值</option>';
            varTypeFilterSelect.onchange = () => {
                filterVarTable(varScopeFilterSelect.value, varTypeFilterSelect.value, varNameFilterInput.value, varValueFilterInput.value, varRuleFilterInput.value);
            };
            const varNameFilterInput = document.createElement('input');
            varNameFilterInput.className = 'mjk-input';
            varNameFilterInput.type = 'text';
            varNameFilterInput.placeholder = '变量名称筛选';
            varNameFilterInput.oninput = () => {
                filterVarTable(varScopeFilterSelect.value, varTypeFilterSelect.value, varNameFilterInput.value, varValueFilterInput.value, varRuleFilterInput.value);
            };

            const varValueFilterInput = document.createElement('input');
            varValueFilterInput.className = 'mjk-input';
            varValueFilterInput.type = 'text';
            varValueFilterInput.placeholder = '变量值称筛选';
            varValueFilterInput.oninput = () => {
                filterVarTable(varScopeFilterSelect.value, varTypeFilterSelect.value, varNameFilterInput.value, varValueFilterInput.value, varRuleFilterInput.value);
            };
            const varRuleFilterInput = document.createElement('input');
            varRuleFilterInput.className = 'mjk-input';
            varRuleFilterInput.type = 'text';
            varRuleFilterInput.placeholder = '自动化名称筛选';
            varRuleFilterInput.oninput = () => {
                filterVarTable(varScopeFilterSelect.value, varTypeFilterSelect.value, varNameFilterInput.value, varValueFilterInput.value, varRuleFilterInput.value);
            };
            varFilterContainer.appendChild(varScopeFilterSelect);
            varFilterContainer.appendChild(varTypeFilterSelect);
            varFilterContainer.appendChild(varNameFilterInput);
            varFilterContainer.appendChild(varValueFilterInput);
            varFilterContainer.appendChild(varRuleFilterInput);
            // 过滤区放入工具栏左侧插槽（初始为设备过滤）
            filtersSlot.appendChild(devFilterContainer);
            filtersSlot.appendChild(varFilterContainer);

            const eventFilterContainer = document.createElement('span');
            eventFilterContainer.id = 'eventFilterContainer';
            eventFilterContainer.classList.add('mjk-filter', 'mjk-hidden');
            const eventTypeFilterSelect = document.createElement('select');
            eventTypeFilterSelect.className = 'mjk-select';
            eventTypeFilterSelect.innerHTML =
                '<option value="">虚拟事件类型</option>' +
                '<option value="发送">发送</option>' +
                '<option value="接收">接收</option>';
            eventTypeFilterSelect.onchange = () => {
                filterEventTable(eventTypeFilterSelect.value, eventNameFilterInput.value, eventRuleFilterInput.value);
            };

            const eventNameFilterInput = document.createElement('input');
            eventNameFilterInput.className = 'mjk-input';
            eventNameFilterInput.type = 'text';
            eventNameFilterInput.placeholder = '虚拟事件名称筛选';
            eventNameFilterInput.oninput = () => {
                filterEventTable(eventTypeFilterSelect.value, eventNameFilterInput.value, eventRuleFilterInput.value);
            };
            const eventRuleFilterInput = document.createElement('input');
            eventRuleFilterInput.className = 'mjk-input';
            eventRuleFilterInput.type = 'text';
            eventRuleFilterInput.placeholder = '自动化名称筛选';
            eventRuleFilterInput.oninput = () => {
                filterEventTable(eventTypeFilterSelect.value, eventNameFilterInput.value, eventRuleFilterInput.value);
            };

            eventFilterContainer.appendChild(eventTypeFilterSelect);
            eventFilterContainer.appendChild(eventNameFilterInput);
            eventFilterContainer.appendChild(eventRuleFilterInput);
            filtersSlot.appendChild(eventFilterContainer);


            const changeDevButton = document.createElement('button');
            changeDevButton.id = "changeDevButton";
            changeDevButton.className = 'mjk-btn mjk-switch';
            changeDevButton.textContent = '设备列表';
            changeDevButton.title = '切换至设备列表视图';
            changeDevButton.onclick = () => {
                handleChangeViewBtnClick("dev");
            };
            viewButtons.appendChild(changeDevButton);

            const changeVarButton = document.createElement('button');
            changeVarButton.id = "changeVarButton";
            changeVarButton.className = 'mjk-btn mjk-switch';
            changeVarButton.textContent = '变量列表';
            changeVarButton.title = '切换至变量列表视图';
            changeVarButton.onclick = () => {
                handleChangeViewBtnClick("var");
            };
            viewButtons.appendChild(changeVarButton);

            const changeEventButton = document.createElement('button');
            changeEventButton.id = "changeEventButton";
            changeEventButton.className = 'mjk-btn mjk-switch';
            changeEventButton.textContent = '虚拟事件';
            changeEventButton.title = '切换至发送虚拟事件视图';
            changeEventButton.onclick = () => {
                handleChangeViewBtnClick("event");
            };
            viewButtons.appendChild(changeEventButton);

            Object.entries(devRuleData).forEach(([did, data]) => {
                const device = data.device;
                const rules = data.rules;
                const row = document.createElement('tr');
                const roomCell = document.createElement('td');
                roomCell.textContent = device.roomName;
                roomCell.classList.add('mjk-table-cell-nowrap');
                const deviceCell = document.createElement('td');
                deviceCell.textContent = device.name;
                deviceCell.classList.add('mjk-table-cell-nowrap');
                const ruleCell = document.createElement('td');

                const protocol = window.location.protocol;
                const host = window.location.host;
                let sequence = 0;
                rules.forEach(rule => {
                    const link = document.createElement('a');
                    link.classList.add('mjk-link-accent');
                    link.href = `${protocol}//${host}/#/graph/${rule.id}`;
                    link.target = '_self';
                    link.textContent = ++sequence + "、" + rule.name + "[" + rule.cardIds.split(',').length + "/" + rule.totalCardNum + "]";
                    link.onclick = () => {
                        window.location.hash = '#/';
                        selectCardIds = rule.cardIds;
                    };
                    bindLinkClickHighlight(link);
                    ruleCell.appendChild(link);
                    ruleCell.appendChild(document.createElement('br'));
                });
                row.appendChild(roomCell);
                row.appendChild(deviceCell);
                row.appendChild(ruleCell);
                devTbody.appendChild(row);
            });
            devTable.appendChild(devTbody);

            //变量表格
            const varTable = document.createElement('table');
            varTable.id = 'varTable';
            varTable.className = 'mjk-table';
            varTable.border = '1';
            varTable.cellSpacing = '0';
            varTable.cellPadding = '5';
            varTable.classList.add('mjk-table-base', 'mjk-hidden');

            const varThead = document.createElement('thead');
            const varHeaderRow = document.createElement('tr');
            const varScopeHeader = document.createElement('th');
            const varTypeHeader = document.createElement('th');
            const varNameHeader = document.createElement('th');
            const varValueHeader = document.createElement('th');
            const varRuleHeader = document.createElement('th');
            const varTbody = document.createElement('tbody');

            let varScopeSortOrder = 'asc';
            let varTypeSortOrder = 'asc';
            let varNameSortOrder = 'asc';
            let varValueSortOrder = 'asc';
            let varRuleSortOrder = 'asc';
            const varUpdateSortMarkers = () => {
                varScopeHeader.innerHTML = `变量范围 ${varScopeSortOrder === 'asc' ? '⬆️' : '⬇️'}`;
                varTypeHeader.innerHTML = `变量类型 ${varTypeSortOrder === 'asc' ? '⬆️' : '⬇️'}`;
                varNameHeader.innerHTML = `变量名 ${varNameSortOrder === 'asc' ? '⬆️' : '⬇️'}`;
                varValueHeader.innerHTML = `变量值 ${varValueSortOrder === 'asc' ? '⬆️' : '⬇️'}`;
                varRuleHeader.innerHTML = `自动化名称 ${varRuleSortOrder === 'asc' ? '⬆️' : '⬇️'}`;
            };

            varScopeHeader.textContent = '变量范围';
            varScopeHeader.classList.add('mjk-table-cell-nowrap');
            varTypeHeader.textContent = '变量类型';
            varTypeHeader.classList.add('mjk-table-cell-nowrap');
            varNameHeader.textContent = '变量名';
            varNameHeader.classList.add('mjk-table-cell-nowrap');
            varValueHeader.textContent = '变量值';
            varValueHeader.classList.add('mjk-table-cell-nowrap');
            varRuleHeader.textContent = '自动化名称';
            varRuleHeader.classList.add('mjk-table-cell-nowrap');

            varScopeHeader.onclick = () => {
                varScopeSortOrder = varScopeSortOrder === 'asc' ? 'desc' : 'asc';
                sortTable(varTbody, 0, varScopeSortOrder);
                varUpdateSortMarkers();
            };
            varTypeHeader.onclick = () => {
                varTypeSortOrder = varTypeSortOrder === 'asc' ? 'desc' : 'asc';
                sortTable(varTbody, 1, varTypeSortOrder);
                varUpdateSortMarkers();
            };
            varNameHeader.onclick = () => {
                varNameSortOrder = varNameSortOrder === 'asc' ? 'desc' : 'asc';
                sortTable(varTbody, 2, varNameSortOrder);
                varUpdateSortMarkers();
            };
            varValueHeader.onclick = () => {
                varValueSortOrder = varValueSortOrder === 'asc' ? 'desc' : 'asc';
                sortTable(varTbody, 3, varValueSortOrder);
                varUpdateSortMarkers();
            };
            varRuleHeader.onclick = () => {
                varRuleSortOrder = varRuleSortOrder === 'asc' ? 'desc' : 'asc';
                sortTable(varTbody, 4, varRuleSortOrder);
                varUpdateSortMarkers();
            };

            varHeaderRow.appendChild(varScopeHeader);
            varHeaderRow.appendChild(varTypeHeader);
            varHeaderRow.appendChild(varNameHeader);
            varHeaderRow.appendChild(varValueHeader);
            varHeaderRow.appendChild(varRuleHeader);
            varThead.appendChild(varHeaderRow);
            varTable.appendChild(varThead);
            Object.entries(varRuleData).forEach(([vid, data]) => {
                const rules = data.rules;
                const varData = varMap[vid];
                if (varData != null) {
                    const row = document.createElement('tr');

                    const varScopeCell = document.createElement('td');
                    varScopeCell.textContent = varData.scope;
                    varScopeCell.classList.add('mjk-table-cell-nowrap');
                    const varTypeCell = document.createElement('td');
                    varTypeCell.textContent = varData.type;
                    varTypeCell.classList.add('mjk-table-cell-nowrap');
                    const varNameCell = document.createElement('td');
                    varNameCell.textContent = varData.name;
                    varNameCell.classList.add('mjk-table-cell-nowrap');
                    const varValueCell = document.createElement('td');
                    varValueCell.textContent = varData.value;
                    // 明确允许换行，优先于通用表格 nowrap
                    varValueCell.classList.add('mjk-table-cell-normal');

                    const varRuleCell = document.createElement('td');
                    const protocol = window.location.protocol;
                    const host = window.location.host;
                    let sequence = 0;
                    rules.forEach(rule => {
                        const link = document.createElement('a');
                        link.classList.add('mjk-link-accent');
                        link.href = `${protocol}//${host}/#/graph/${rule.id}`;
                        link.target = '_self';
                        link.textContent = ++sequence + "、" + rule.name + "[" + rule.cardIds.split(',').length + "/" + rule.totalCardNum + "]";
                        link.onclick = () => {
                            window.location.hash = '#/';
                            selectCardIds = rule.cardIds;
                        };
                        bindLinkClickHighlight(link);
                        varRuleCell.appendChild(link);
                        varRuleCell.appendChild(document.createElement('br'));
                    });
                    row.appendChild(varScopeCell);
                    row.appendChild(varTypeCell);
                    row.appendChild(varNameCell);
                    row.appendChild(varValueCell);
                    row.appendChild(varRuleCell);
                    varTbody.appendChild(row);
                }
            });
            varTable.appendChild(varTbody);

            //虚拟事件表格
            const eventTable = document.createElement('table');
            eventTable.id = 'eventTable';
            eventTable.className = 'mjk-table';
            eventTable.border = '1';
            eventTable.cellSpacing = '0';
            eventTable.cellPadding = '5';
            eventTable.classList.add('mjk-table-base', 'mjk-hidden');

            const eventThead = document.createElement('thead');
            const eventHeaderRow = document.createElement('tr');
            const eventTypeHeader = document.createElement('th');
            const eventNameHeader = document.createElement('th');
            const eventRuleHeader = document.createElement('th');
            const eventTbody = document.createElement('tbody');

            let eventTypeSortOrder = 'asc';
            let eventNameSortOrder = 'asc';
            let eventRuleSortOrder = 'asc';
            const eventUpdateSortMarkers = () => {
                eventTypeHeader.innerHTML = `虚拟事件类型 ${eventTypeSortOrder === 'asc' ? '⬆️' : '⬇️'}`;
                eventNameHeader.innerHTML = `事件名称 ${eventNameSortOrder === 'asc' ? '⬆️' : '⬇️'}`;
                eventRuleHeader.innerHTML = `自动化名称 ${eventRuleSortOrder === 'asc' ? '⬆️' : '⬇️'}`;
            };

            eventTypeHeader.textContent = '虚拟事件类型';
            eventTypeHeader.classList.add('mjk-table-cell-nowrap');
            eventNameHeader.textContent = '事件名称';
            eventNameHeader.classList.add('mjk-table-cell-nowrap');
            eventRuleHeader.textContent = '自动化名称';
            eventRuleHeader.classList.add('mjk-table-cell-nowrap');

            eventTypeHeader.onclick = () => {
                eventTypeSortOrder = eventTypeSortOrder === 'asc' ? 'desc' : 'asc';
                sortTable(eventTbody, 0, eventTypeSortOrder);
                eventUpdateSortMarkers();
            };
            eventNameHeader.onclick = () => {
                eventNameSortOrder = eventNameSortOrder === 'asc' ? 'desc' : 'asc';
                sortTable(eventTbody, 1, eventNameSortOrder);
                eventUpdateSortMarkers();
            };
            eventRuleHeader.onclick = () => {
                eventRuleSortOrder = eventRuleSortOrder === 'asc' ? 'desc' : 'asc';
                sortTable(eventTbody, 2, eventRuleSortOrder);
                eventUpdateSortMarkers();
            };

            eventHeaderRow.appendChild(eventTypeHeader);
            eventHeaderRow.appendChild(eventNameHeader);
            eventHeaderRow.appendChild(eventRuleHeader);
            eventThead.appendChild(eventHeaderRow);
            eventTable.appendChild(eventThead);
            Object.entries(sendEventRuleData).forEach(([eventName, data]) => {
                const rules = data.rules;
                const row = document.createElement('tr');

                const eventTypeCell = document.createElement('td');
                eventTypeCell.textContent = "发送";
                eventTypeCell.classList.add('mjk-table-cell-nowrap');
                const eventNameCell = document.createElement('td');
                eventNameCell.textContent = eventName;
                eventNameCell.classList.add('mjk-table-cell-nowrap');
                const eventRuleCell = document.createElement('td');
                const protocol = window.location.protocol;
                const host = window.location.host;
                let sequence = 0;
                rules.forEach(rule => {
                    const link = document.createElement('a');
                    link.classList.add('mjk-link-accent');
                    link.href = `${protocol}//${host}/#/graph/${rule.id}`;
                    link.target = '_self';
                    link.textContent = ++sequence + "、" + rule.name + "[" + rule.cardIds.split(',').length + "/" + rule.totalCardNum + "]";
                    link.onclick = () => {
                        window.location.hash = '#/';
                        selectCardIds = rule.cardIds;
                    };
                    bindLinkClickHighlight(link);
                    eventRuleCell.appendChild(link);
                    eventRuleCell.appendChild(document.createElement('br'));
                });
                row.appendChild(eventTypeCell);
                row.appendChild(eventNameCell);
                row.appendChild(eventRuleCell);
                eventTbody.appendChild(row);
            });
            Object.entries(receiveEventRuleData).forEach(([eventName, data]) => {
                const rules = data.rules;
                const row = document.createElement('tr');

                const eventTypeCell = document.createElement('td');
                eventTypeCell.textContent = "接收";
                eventTypeCell.classList.add('mjk-table-cell-nowrap');
                const eventNameCell = document.createElement('td');
                eventNameCell.textContent = eventName;
                eventNameCell.classList.add('mjk-table-cell-nowrap');
                const eventRuleCell = document.createElement('td');
                const protocol = window.location.protocol;
                const host = window.location.host;
                let sequence = 0;
                rules.forEach(rule => {
                    const link = document.createElement('a');
                    link.classList.add('mjk-link-accent');
                    link.href = `${protocol}//${host}/#/graph/${rule.id}`;
                    link.target = '_self';
                    link.textContent = ++sequence + "、" + rule.name + "[" + rule.cardIds.split(',').length + "/" + rule.totalCardNum + "]";
                    link.onclick = () => {
                        window.location.hash = '#/';
                        selectCardIds = rule.cardIds;
                    };
                    bindLinkClickHighlight(link);
                    eventRuleCell.appendChild(link);
                    eventRuleCell.appendChild(document.createElement('br'));
                });
                row.appendChild(eventTypeCell);
                row.appendChild(eventNameCell);
                row.appendChild(eventRuleCell);
                eventTbody.appendChild(row);
            });


            eventTable.appendChild(eventTbody);

            // 顶栏固定到 body，避免 Safari 在父容器折叠时不渲染固定子元素
            container.appendChild(devTable);
            container.appendChild(varTable);
            container.appendChild(eventTable);
            document.body.appendChild(container);
            // 先移除可能存在的旧顶栏，再追加新的顶栏
            const existedTopBar = document.getElementById('topBar');
            if (existedTopBar && existedTopBar !== topBar && existedTopBar.parentElement) {
                existedTopBar.parentElement.removeChild(existedTopBar);
            }
            document.body.appendChild(topBar);

            devUpdateSortMarkers();
            varUpdateSortMarkers();
            eventUpdateSortMarkers();

            function filterDevTable(roomName, deviceKeyword, ruleKeyword) {
                const rows = Array.from(devTable.rows);
                rows.forEach(row => {
                    const roomText = row.cells[0].textContent;
                    const deviceText = row.cells[1].textContent.toLowerCase();
                    const ruleText = row.cells[2].textContent.toLowerCase();
                    if ((roomName === '' || roomText === roomName) && deviceText.includes(deviceKeyword.toLowerCase()) && ruleText.includes(ruleKeyword.toLowerCase())) {
                        row.classList.remove('mjk-hidden');
                    } else {
                        row.classList.add('mjk-hidden');
                    }
                });
            }

            function filterVarTable(varScope, varType, varName, varValue, ruleName) {
                const rows = Array.from(varTable.rows);
                rows.forEach(row => {
                    const varScopeText = row.cells[0].textContent;
                    const varTypeText = row.cells[1].textContent;
                    const varNameText = row.cells[2].textContent.toLowerCase();
                    const varValueText = row.cells[3].textContent.toLowerCase();
                    const ruleNameText = row.cells[4].textContent.toLowerCase();
                    if ((varScope === '' || varScope === varScopeText)
                        && (varType === '' || varType === varTypeText)
                        && varNameText.includes(varName.toLowerCase())
                        && varValueText.includes(varValue.toLowerCase())
                        && ruleNameText.includes(ruleName.toLowerCase())) {
                        row.classList.remove('mjk-hidden');
                    } else {
                        row.classList.add('mjk-hidden');
                    }
                });
            }

            function filterEventTable(eventType, eventName, ruleName) {
                const rows = Array.from(eventTable.rows);
                rows.forEach(row => {
                    const eventTypeText = row.cells[0].textContent;
                    const eventNameText = row.cells[1].textContent.toLowerCase();
                    const ruleNameText = row.cells[2].textContent.toLowerCase();
                    if ((eventType === '' || eventType === eventTypeText)
                        && eventNameText.includes(eventName.toLowerCase())
                        && ruleNameText.includes(ruleName.toLowerCase())) {
                        row.classList.remove('mjk-hidden');
                    } else {
                        row.classList.add('mjk-hidden');
                    }
                });
            }

            autoCollapse();
            handleUrlChange();
        } catch (error) {
            isInit = false;
            console.error('调用 API 时出错:', error);
        }
    };

    const selectDevices = async () => {
        // await sleep(600);
        if (selectCardIds !== '') {
            const cards = selectCardIds.split(',');
            if (cards) {
                handleCardSelection(cards, backgroundColor, defaultColor);
            }
        }
        selectCardIds = '';
        closeGraphContainer();

        const graphDevTableDiv = document.createElement('div');
        const graphDevSpan = document.createElement('span');
        graphDevSpan.textContent = "当前自动化涉及的设备列表：";
        graphDevSpan.classList.add('mjk-user-select-text');
        graphDevTableDiv.id = 'graphDevTableDiv';
        graphDevTableDiv.appendChild(graphDevSpan);
        const graphDevTable = document.createElement('table');
        graphDevTable.border = '1';
        graphDevTable.cellSpacing = '0';
        graphDevTable.cellPadding = '5';
        graphDevTable.classList.add('mjk-table-base');
        graphDevTableDiv.appendChild(graphDevTable);

        const graphDevThead = document.createElement('thead');
        const graphDevHeaderRow = document.createElement('tr');
        const graphDevRoomHeader = document.createElement('th');
        const graphDevInfoHeader = document.createElement('th');
        const graphDevTbody = document.createElement('tbody');

        graphDevRoomHeader.textContent = '房间';
        graphDevRoomHeader.classList.add('mjk-table-cell-nowrap');
        graphDevInfoHeader.textContent = '设备名称';
        graphDevInfoHeader.classList.add('mjk-table-cell-nowrap');

        let ruleId = window.location.hash.split('/')[2];
        const ruleContent = await callAPI('getGraph', {id: ruleId});

        const dids = new Set(ruleContent.nodes.map(n => n.props?.did).filter(did => did !== undefined));
        dids.forEach(did => {
            const row = document.createElement('tr');
            const roomCell = document.createElement('td');
            roomCell.textContent = devMap[did]?.roomName ?? `未知`;
            roomCell.classList.add('mjk-table-cell-nowrap');
            const deviceCell = document.createElement('td');
            deviceCell.classList.add('mjk-table-cell-nowrap');
            const cards = ruleContent.nodes
                .filter(node => node.props && node.id && node.props.did === did)
                .map(node => node.id);
            const link = document.createElement('a');
            link.classList.add('mjk-link-accent');
            link.href = `javascript:void(0);`;
            link.textContent = devMap[did]?.name + " [" + cards.length + "]" ?? `did: ${did}`;
            link.onclick = () => {
                handleCardSelection(cards, backgroundColor, defaultColor);
            };
            bindLinkClickHighlight(link);
            deviceCell.appendChild(link);
            row.appendChild(roomCell);
            row.appendChild(deviceCell);
            graphDevTbody.appendChild(row);
        });

        const graphVarTableDiv = document.createElement('div');
        graphVarTableDiv.textContent = "当前自动化涉及的变量列表：";
        graphVarTableDiv.classList.add('mjk-margin-top-10');
        graphVarTableDiv.id = 'graphVarTableDiv';
        graphVarTableDiv.classList.add('mjk-user-select-text');
        const graphVarTable = document.createElement('table');
        graphVarTable.border = '1';
        graphVarTable.cellSpacing = '0';
        graphVarTable.cellPadding = '5';
        graphVarTable.classList.add('mjk-table-base');
        graphVarTableDiv.appendChild(graphVarTable);

        const graphVarThead = document.createElement('thead');
        const graphVarHeaderRow = document.createElement('tr');
        const graphVarScopeHeader = document.createElement('th');
        const graphVarTypeHeader = document.createElement('th');
        const graphVarNameHeader = document.createElement('th');
        const graphVarValueHeader = document.createElement('th');
        const graphVarTbody = document.createElement('tbody');

        graphVarScopeHeader.textContent = '范围';
        graphVarScopeHeader.classList.add('mjk-table-cell-nowrap');
        graphVarTypeHeader.textContent = '类型';
        graphVarTypeHeader.classList.add('mjk-table-cell-nowrap');
        graphVarNameHeader.textContent = '变量名称';
        graphVarNameHeader.classList.add('mjk-table-cell-nowrap');
        graphVarValueHeader.textContent = '变量值';

        let varMap = {};
        const varScopes = (await callAPI('getVarScopeList', {})).scopes;
        for (const scope of varScopes) {
            if (scope === "global" || scope === "R" + ruleId) {
                const vars = await callAPI('getVarList', {scope: scope});
                Object.entries(vars).forEach(([vid, v]) => {
                    varMap[vid] = {
                        name: v.userData.name,
                        scope: (scope === "global" ? "全局" : "局部"),
                        type: (v.type === "string" ? "文本" : "数值"),
                        value: v.value
                    }
                });
            }
        }

        const varids = new Set(ruleContent.nodes
            .flatMap(node => {
                if (!node.props) return [];

                const ids = [];
                // 直接变量卡片的ID
                if (node.props.scope) {
                    ids.push(node.props.id);
                }
                // 参数中的变量ID
                if (node.props.arguments?.length > 0) {
                    ids.push(...node.props.arguments
                        .filter(arg => arg.id)
                        .map(arg => arg.id)
                    );
                }
                return ids;
            })
        );
        varids.forEach(vid => {
            const row = document.createElement('tr');
            const varScopeCell = document.createElement('td');
            varScopeCell.textContent = varMap[vid]?.scope ?? `未知`;
            varScopeCell.classList.add('mjk-table-cell-nowrap');
            const varTypeCell = document.createElement('td');
            varTypeCell.textContent = varMap[vid]?.type ?? `未知`;
            varTypeCell.classList.add('mjk-table-cell-nowrap');
            const varNameCell = document.createElement('td');
            varNameCell.classList.add('mjk-table-cell-nowrap');
            const cards = ruleContent.nodes
                .filter(node => node.props && node.id && ((node.props.scope && node.props.id === vid) || (node.props.arguments && node.props.arguments.some(arg => arg.id === vid))))
                .map(node => node.id);

            const link = document.createElement('a');
            link.classList.add('mjk-link-accent');
            link.href = `javascript:void(0);`;
            link.textContent = varMap[vid]?.name + " [" + cards.length + "]" ?? `未知`;
            link.onclick = () => {
                handleCardSelection(cards, backgroundColor, defaultColor);
            };
            bindLinkClickHighlight(link);
            varNameCell.appendChild(link);
            const varValueCell = document.createElement('td');
            varValueCell.textContent = varMap[vid]?.value ?? `未知`;
            row.appendChild(varScopeCell);
            row.appendChild(varTypeCell);
            row.appendChild(varNameCell);
            row.appendChild(varValueCell);
            graphVarTbody.appendChild(row);
        });

        const graphEventTableDiv = document.createElement('div');
        graphEventTableDiv.textContent = "当前自动化涉及的虚拟事件列表：";
        graphEventTableDiv.classList.add('mjk-margin-top-10');
        graphEventTableDiv.id = 'graphEventTableDiv';
        graphEventTableDiv.classList.add('mjk-user-select-text');
        const graphEventTable = document.createElement('table');
        graphEventTable.border = '1';
        graphEventTable.cellSpacing = '0';
        graphEventTable.cellPadding = '5';
        graphEventTable.classList.add('mjk-table-base');
        graphEventTableDiv.appendChild(graphEventTable);

        const graphEventThead = document.createElement('thead');
        const graphEventHeaderRow = document.createElement('tr');
        const graphEventTypeHeader = document.createElement('th');
        const graphEventNameHeader = document.createElement('th');
        const graphEventTbody = document.createElement('tbody');

        graphEventTypeHeader.textContent = '虚拟事件类型';
        graphEventTypeHeader.classList.add('mjk-table-cell-nowrap');
        graphEventNameHeader.textContent = '虚拟事件名称';
        graphEventNameHeader.classList.add('mjk-table-cell-nowrap');

        const sendEventCards = new Set(ruleContent.nodes.map(n => {
            return (n.props && n.cfg && n.id && n.type === "deviceOutput"
                && n.cfg.urn && n.cfg.urn.indexOf("device:gateway") > -1
                && n.props.siid && n.props.siid === 4 && n.props.aiid && n.props.aiid === 1
                && n.props.ins && n.props.ins[0] && n.props.ins[0].piid && n.props.ins[0].piid === 1
            ) ? {
                cid: n.id,
                eventName: n.props.ins[0].value ? n.props.ins[0].value : n.props.ins[0].id + "$$" + n.props.ins[0].scope
            } : undefined;
        }).filter(card => card !== undefined));
        const sendGrouped = Array.from(sendEventCards).reduce((acc, {eventName, cid}) => {
            if (!acc[eventName]) {
                acc[eventName] = [];
            }
            acc[eventName].push(cid);
            return acc;
        }, {});
        const groupedSendEventCards = Object.entries(sendGrouped).map(([eventName, cids]) => ({
            eventName,
            cids
        }));
        const receiveEventCards = new Set(ruleContent.nodes.map(n => {
            return (n.props && n.cfg && n.id && n.type === "deviceInput"
                && n.cfg.urn && n.cfg.urn.indexOf("device:gateway") > -1
                && n.props.siid && n.props.siid === 4 && n.props.eiid && n.props.eiid === 1
                && n.props.arguments && n.props.arguments[0] && n.props.arguments[0].piid && n.props.arguments[0].piid === 1
            ) ? {
                cid: n.id, eventName: n.props.arguments[0].v1
            } : undefined;
        }).filter(card => card !== undefined));
        const receiveGrouped = Array.from(receiveEventCards).reduce((acc, {eventName, cid}) => {
            if (!acc[eventName]) {
                acc[eventName] = [];
            }
            acc[eventName].push(cid);
            return acc;
        }, {});
        const groupedReceiveEventCards = Object.entries(receiveGrouped).map(([eventName, cids]) => ({
            eventName,
            cids
        }));
        const createEventRow = (event, eventType) => {
            const row = document.createElement('tr');
            const eventTypeCell = document.createElement('td');
            eventTypeCell.textContent = eventType;
            eventTypeCell.classList.add('mjk-table-cell-nowrap');
            const eventNameCell = document.createElement('td');
            eventNameCell.classList.add('mjk-table-cell-nowrap');
            const cards = event.cids;
            const link = document.createElement('a');
            link.classList.add('mjk-link-accent');
            link.href = `javascript:void(0);`;
            let eventName = event.eventName;
            if (eventName.indexOf("$$") > -1) {
                let vid = event.eventName.split("$$")[0];
                let scope = event.eventName.split("$$")[1];
                const varData = varMap[vid];
                if (varData) {
                    eventName = "变量名：${" + varData.name + "}，当前值：" + varData.value;
                }
            }
            link.textContent = eventName + " [" + cards.length + "]";
            link.onclick = () => {
                handleCardSelection(cards, backgroundColor, defaultColor);
            };
            bindLinkClickHighlight(link);
            eventNameCell.appendChild(link);
            row.appendChild(eventTypeCell);
            row.appendChild(eventNameCell);
            graphEventTbody.appendChild(row);
        };

        groupedSendEventCards.forEach(event => createEventRow(event, '发送'));
        groupedReceiveEventCards.forEach(event => createEventRow(event, '接收'));

        const graphRemarkDiv = document.createElement('div');
        graphRemarkDiv.textContent = "提示：设备名称或变量名称后的括号内显示的数字为当前自动化涉及的卡片数量，点击设备名称或变量名称可高亮显示对应卡片！";
        graphRemarkDiv.classList.add('mjk-remark-text');

        graphDevHeaderRow.appendChild(graphDevRoomHeader);
        graphDevHeaderRow.appendChild(graphDevInfoHeader);
        graphDevThead.appendChild(graphDevHeaderRow);
        graphDevTable.appendChild(graphDevThead);
        graphDevTable.appendChild(graphDevTbody);
        sortTable(graphDevTbody, 0, 'asc');

        const graphContainer = document.getElementById('graph-list-container') || document.createElement('div');
        graphContainer.id = 'graph-list-container';
        graphContainer.classList.add('mjk-graph-container', 'mjk-hidden');
        // 宽度由 CSS 变量 --mjk-graph-width 控制（默认 680px）
        // 高度由 CSS 控制（calc(var(--mjk-height) - 50px)）
        // 高度由 CSS calc(var(--mjk-height) - 50px) 控制

        if (!document.getElementById('graphDevTableDiv')) {
            graphContainer.appendChild(graphDevTableDiv);
        }

        graphVarHeaderRow.appendChild(graphVarScopeHeader);
        graphVarHeaderRow.appendChild(graphVarTypeHeader);
        graphVarHeaderRow.appendChild(graphVarNameHeader);
        graphVarHeaderRow.appendChild(graphVarValueHeader);
        graphVarThead.appendChild(graphVarHeaderRow);
        graphVarTable.appendChild(graphVarThead);
        graphVarTable.appendChild(graphVarTbody);
        sortTable(graphVarTbody, 0, 'asc');
        if (varids.size > 0) {
            if (!document.getElementById('graphVarTableDiv')) {
                graphContainer.appendChild(graphVarTableDiv);
            }
        }

        graphEventHeaderRow.appendChild(graphEventTypeHeader);
        graphEventHeaderRow.appendChild(graphEventNameHeader);
        graphEventThead.appendChild(graphEventHeaderRow);
        graphEventTable.appendChild(graphEventThead);
        graphEventTable.appendChild(graphEventTbody);
        sortTable(graphEventTbody, 0, 'asc');
        if (groupedSendEventCards.length > 0 || groupedReceiveEventCards.length > 0) {
            if (!document.getElementById('graphEventTableDiv')) {
                graphContainer.appendChild(graphEventTableDiv);
            }
        }

        //graphContainer.appendChild(graphRemarkDiv);
        if (!document.getElementById('graph-list-container')) {
            document.body.appendChild(graphContainer);
        }
    };

    function sortTable(tbody, columnIndex, sortOrder) {
        const rows = Array.from(tbody.rows);
        const sortedRows = rows.sort((a, b) => {
            const aText = a.cells[columnIndex].textContent;
            const bText = b.cells[columnIndex].textContent;
            if (sortOrder === 'asc') {
                return aText.localeCompare(bText);
            } else {
                return bText.localeCompare(aText);
            }
        });
        tbody.innerHTML = '';
        sortedRows.forEach(row => tbody.appendChild(row));
    }

    //设备列表视图
    function handleChangeViewBtnClick(type) {
        const varTable = document.getElementById('varTable');
        const devTable = document.getElementById('devTable');
        const eventTable = document.getElementById('eventTable');
        const devFilterContainer = document.getElementById('devFilterContainer');
        const varFilterContainer = document.getElementById('varFilterContainer');
        const eventFilterContainer = document.getElementById('eventFilterContainer');

        if (type === 'dev') {
            devTable.classList.remove('mjk-hidden');
            varTable.classList.add('mjk-hidden');
            eventTable.classList.add('mjk-hidden');
            devFilterContainer.classList.remove('mjk-hidden');
            varFilterContainer.classList.add('mjk-hidden');
            eventFilterContainer.classList.add('mjk-hidden');
        } else if (type === 'var') {
            devTable.classList.add('mjk-hidden');
            varTable.classList.remove('mjk-hidden');
            eventTable.classList.add('mjk-hidden');
            devFilterContainer.classList.add('mjk-hidden');
            varFilterContainer.classList.remove('mjk-hidden');
            eventFilterContainer.classList.add('mjk-hidden');
        } else if (type === 'event') {
            devTable.classList.add('mjk-hidden');
            varTable.classList.add('mjk-hidden');
            eventTable.classList.remove('mjk-hidden');
            devFilterContainer.classList.add('mjk-hidden');
            varFilterContainer.classList.add('mjk-hidden');
            eventFilterContainer.classList.remove('mjk-hidden');
        }
    }


    function handleOptionsBtnClick() {
        const optionsContainer = document.getElementById('optionsContainer');
        if (optionsContainer) {
            if (optionsContainer.classList.contains('mjk-hidden')) {
                optionsContainer.classList.remove('mjk-hidden');
            } else {
                optionsContainer.classList.add('mjk-hidden');
            }
        }
    }

    function handleCollapseBtnClick() {
        const container = document.getElementById('device-rule-map');
        if (container) {
            if (isCollapsed) {
                expand();
            } else {
                collapse();
            }
        }
    }

    function collapse() {
        const container = document.getElementById('device-rule-map');
        if (container) {
            const collapseButton = document.getElementById('collapseButton');
            const topBar = document.getElementById('topBar');
            topBar.style.width = '';
            document.documentElement.style.setProperty('--mjk-topbar-width', (parseInt(graphWidth, 10) || 0) + 'px');
            container.classList.add('mjk-collapsed-container');
            collapseButton.textContent = '展开';
            isCollapsed = true;
            if (isGraphVisible) {
                hiddenGraphListDetail();
            }
        }
    }

    function expand() {
        const container = document.getElementById('device-rule-map');
        if (container) {
            const collapseButton = document.getElementById('collapseButton');
            const topBar = document.getElementById('topBar');
            topBar.style.width = '';
            document.documentElement.style.setProperty('--mjk-topbar-width', (parseInt(windowWidth, 10) || 0) + 'px');
            container.classList.remove('mjk-collapsed-container');
            collapseButton.textContent = '折叠';
            isCollapsed = false;
            if (isGraphVisible) {
                hiddenGraphListDetail();
            }
        }
    }

    function autoFitContent() {
        if (enableAutoFitContent && editor && editor.transformTool) {
            editor.transformTool.fitToBestPos();
        }
    }

    /**
     * 统一处理卡片选择的方法
     */
    function handleCardSelection(cards, backgroundColor, defaultColor) {
        if (!cards || !editor || !editor.transformTool) {
            return;
        }

        // 清除所有CSS卡片的背景色
        const cssCards = document.querySelectorAll('.card,.simple-card');
        if (cssCards) {
            cssCards.forEach(card => {
                card.style.backgroundColor = '';
            });
        }

        // 先自动画布，防止有卡片在边缘无法看见
        let beforeFitScale = editor.transformTool.data.scale;
        editor.transformTool.fitToBestPos();
        let afterFitScale = editor.transformTool.data.scale;

        // 处理每个卡片
        cards.forEach((cardId, idx) => {
            let targetElement = document.querySelector("[id='" + cardId.trim() + "'] > div > div");
            if (targetElement) {
                targetElement.style.backgroundColor = backgroundColor === '' ? defaultColor : backgroundColor;
            }

            // 仅对第一个卡片进行居中和缩放处理
            if (idx === 0 && editor) {
                // 选择卡片后使其居中
                if (enableCenterCard) {
                    editor.transformTool.moveElementToCenter(cardId);
                }

                let targetScale = beforeFitScale;
                // 选择卡片后显示比例模式
                if (cardDisplayScale === 'original') {
                    targetScale = beforeFitScale;
                } else if (cardDisplayScale === 'auto') {
                    targetScale = afterFitScale;
                } else if (cardDisplayScale === "custom" && customScale > 0) {
                    targetScale = Math.round(customScale / 100 * 10) / 10;
                }
                editor.transformTool.scaleCanvasAtPoint(editor.graphTool.centerPoint, 1, targetScale);
            }
        });
    }

    function autoCollapse() {
        if (enableAutoCollapseCheck) {
            collapse();
        }
    }

    function enhancedDisplayLog() {
        //监听画布变化
        const canvas = document.getElementById('canvas-root');
        if (canvas) {
            const config = {attributes: false, childList: true, subtree: true};
            const callback = function (mutationsList, observer) {
                if (enableEnhancedDisplayLog) {
                    let element = document.querySelector('.panel-log-card-blink');
                    if (element && element.style.outline !== "red solid 20px") {
                        element.style.outline = "red solid 10px";
                    }
                    let animateElement = document.querySelector('animate');
                    if (animateElement && animateElement.getAttribute('stroke-width') != '10') {
                        let pathElement = animateElement.parentElement;
                        pathElement.setAttribute('stroke-width', '10');
                        if (pathElement) {
                            let gElement = pathElement.parentElement;
                            gElement.setAttribute('stroke', 'red');
                        }
                    }
                }
            };
            const observer = new MutationObserver(callback);
            observer.observe(canvas, config);
        }
    }

    function addShortcutHelp() {
        const addedSchortcut = document.getElementById('addedSchortcut');
        if (addedSchortcut) {
            return;
        }
        const helpLeft = document.querySelector('.help-modal-left');
        if (helpLeft) {
            const leftContent = `
          <div></div>
          <div class="help-modal-item-label" id="addedSchortcut">自适应画布</div>
          <div class="help-modal-item-btn">Ctrl 或 ⌘</div>
          <div class="help-modal-item-btn" style="width: 41px;">B</div>
          <div class="help-modal-item-label">关闭画布</div>
          <div class="help-modal-item-btn">Ctrl</div>
          <div class="help-modal-item-btn" style="width: 41px;">W</div>
          <div class="help-modal-item-label">关闭助手</div>
          <div class="help-modal-item-btn">Ctrl</div>
          <div class="help-modal-item-btn" style="width: 41px;">Q</div>
          `;
            helpLeft.insertAdjacentHTML('beforeend', leftContent);
        }
        const helpRight = document.querySelector('.help-modal-right');
        if (helpRight) {
            const rightContent = `
          <div></div>
          <div class="help-modal-item-label">折叠助手</div>
          <div class="help-modal-item-btn" style="width: auto;">Ctrl 或 ⌘</div>
          <div class="help-modal-item-btn" style="width: 41px;">E</div>
          <div class="help-modal-item-label">刷新助手</div>
          <div class="help-modal-item-btn">Ctrl</div>
          <div class="help-modal-item-btn" style="width: 41px;">R</div>
          `;
            helpRight.insertAdjacentHTML('beforeend', rightContent);
        }

        GM_addStyle('.help-modal .help-modal-middle {grid-template-rows: 32px 32px 32px 32px 32px;}');
        GM_addStyle('.help-modal .help-modal-right {grid-template-rows: 32px 32px 32px 32px 32px;}');
        GM_addStyle('.help-modal {height: 238px;}');
    }

    function changeRuleListStyle(count) {
        GM_addStyle('.automation-rule-page .ant-spin-container .content-scroll-wrapper .rule-list {    grid-template-columns: repeat(' + count + ', 1fr);}')
    }

    function sortVars() {
        const varLists = document.querySelectorAll(".var-list");
        varLists.forEach(varList => {
            const commonVarCells = Array.from(varList.querySelectorAll(".common-var-cell"));

            const cellsWithTitle = commonVarCells.map(cell => ({
                cell: cell,
                title: (cell.querySelector(".var-name")?.getAttribute("title") || "").toUpperCase()
            }));

            cellsWithTitle.sort((a, b) => a.title.localeCompare(b.title));

            const fragment = document.createDocumentFragment();
            cellsWithTitle.forEach(item => fragment.appendChild(item.cell));

            varList.innerHTML = '';
            varList.appendChild(fragment);
        });
    }

    let sleep = function (ms) {
        return new Promise(resolve => setTimeout(resolve, ms))
    }

    function isMiJiaJiKePage() {
        return document.title === "米家自动化极客版" && !document.querySelector('.pin-code-with-keyboard') && editor;
    }

    function closeGraphContainer() {
        const graphContainer = document.getElementById('graph-list-container');
        const graphListDetailButton = document.getElementById('graphListDetailButton');
        if (graphContainer) {
            document.body.removeChild(graphContainer);
        }
        if (graphListDetailButton) {
            if (window.location.hash.match(/^#\/graph\/.*/g)) {
                graphListDetailButton.classList.remove('mjk-hidden');
            } else {
                graphListDetailButton.classList.add('mjk-hidden');
            }
        }
    }

    function handleGraphListDetailBtnClick() {
        const graphContainer = document.getElementById('graph-list-container');
        if (graphContainer) {
            if (!isCollapsed) {
                collapse();
            }
            if (isGraphVisible) {
                hiddenGraphListDetail();
            } else {
                displayGraphListDetail();
            }
            document.documentElement.style.setProperty('--mjk-topbar-width', (parseInt(graphWidth, 10) || 0) + 'px');
        }
    }

    function displayGraphListDetail() {
        const graphContainer = document.getElementById('graph-list-container');
        if (graphContainer) {
            if (graphContainer.classList.contains('mjk-hidden')) {
                graphContainer.classList.remove('mjk-hidden');
            }
            isGraphVisible = true;
        }
    }

    function hiddenGraphListDetail() {
        const graphContainer = document.getElementById('graph-list-container');
        if (graphContainer) {
            if (!graphContainer.classList.contains('mjk-hidden')) {
                graphContainer.classList.add('mjk-hidden');
            }
            isGraphVisible = false;
        }
    }

    function handleUrlChange() {
        if (isMiJiaJiKePage()) {
            executeScript();
            closeGraphContainer();
            if (window.location.hash.match(/^#\/graph\/.*/g)) {
                setTimeout(function () {
                    autoFitContent();
                    enhancedDisplayLog();
                    autoCollapse();
                    addShortcutHelp();
                    selectDevices();
                }, 500);
            }
            if (window.location.hash.match(/^#\/vars/g)) {
                setTimeout(function () {
                    sortVars();
                }, 500);
                sortVars();
            }
        }
    }

    //页面变化
    window.addEventListener('popstate', handleUrlChange);
    window.addEventListener('hashchange', handleUrlChange);
    const originalPushState = history.pushState;
    const originalReplaceState = history.replaceState;
    history.pushState = function () {
        originalPushState.apply(this, arguments);
        handleUrlChange();
    };
    history.replaceState = function () {
        originalReplaceState.apply(this, arguments);
        handleUrlChange();
    };
    //快捷键
    document.addEventListener('keydown', function (event) {
        if ((event.metaKey || event.ctrlKey) && event.key === 'e') {
            event.preventDefault();
            if (document.getElementById('collapseButton')) {
                document.getElementById('collapseButton').click();
            }
        }
        if (event.ctrlKey && event.key === 'q') {
            event.preventDefault();
            if (document.getElementById('closeButton')) {
                document.getElementById('closeButton').click();
            }
        }
        if (event.ctrlKey && event.key === 'r') {
            event.preventDefault();
            if (document.getElementById('refreshButton')) {
                document.getElementById('refreshButton').click();
            }
        }
        if ((event.metaKey || event.ctrlKey) && event.key === 'b') {
            event.preventDefault();
            if (editor && editor.transformTool) {
                editor.transformTool.fitToBestPos();
            }
        }
        if (event.ctrlKey && event.key === 'w') {
            event.preventDefault();
            const selectedMenuItem = document.querySelector('.app-header-menu-item-selected');
            if (selectedMenuItem) {
                const actionElement = selectedMenuItem.querySelector('.app-header-menu-item-action');
                if (actionElement) {
                    actionElement.click();
                }
            }
        }

    });
    window.onload = function () {
        //监控登录页面
        const loginForm = document.querySelector('.account-content');
        if (loginForm) {
            const config = {attributes: true, childList: true, subtree: true};
            const callback = function (mutationsList, observer) {
                setTimeout(function () {
                    handleUrlChange();
                }, 1500);
            };
            const observer = new MutationObserver(callback);
            observer.observe(loginForm, config);
        }

    };
})();
