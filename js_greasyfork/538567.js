// ==UserScript==
// @name         DeepSeek & Doubao Chat to word | image
// @name:zh-CN   DeepSeek & 豆包 对话导出增强
// @namespace    http://tampermonkey.net/
// @version      1.7
// @description  Enhances DeepSeek & Doubao Chat to export conversations as Word documents and generate beautiful knowledge cards. Adds buttons for single messages and global controls to process multiple selected messages.
// @description:zh-CN 增强 DeepSeek & 豆包 Chat，轻松将对话导出为 Word 文档或生成精美的知识卡片。为每条消息添加独立操作按钮，并通过侧边栏全局控件，批量处理勾选的多条消息。
// @author       licc168
// @license      MIT
// @match        *://chat.deepseek.com/*
// @match        *://*.doubao.com/*
// @grant        GM_addStyle
// @grant        GM_openInTab
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_xmlhttpRequest
// @grant        GM_log
// @downloadURL https://update.greasyfork.org/scripts/538567/DeepSeek%20%20Doubao%20Chat%20to%20word%20%7C%20image.user.js
// @updateURL https://update.greasyfork.org/scripts/538567/DeepSeek%20%20Doubao%20Chat%20to%20word%20%7C%20image.meta.js
// ==/UserScript==
 
 
(function() {
    'use strict';
 
    const onDeepSeek = window.location.hostname.includes('deepseek.com');
    const onDoubao = window.location.hostname.includes('doubao.com');
 
    // --- Configuration ---
    const dislikeIconSvgPathStart = "M18.304";
    const generateButtonText = '生成卡片';
    const generateButtonTitle = '生成图文卡片 (API)';
    const API_ENDPOINT = 'https://api.any2card.com/api/generate-image';
    const API_ENDPOINT_WORD = 'https://api.any2card.com/api/md-to-word';
    const API_ENDPOINT_PDF = 'https://api.any2card.com/api/md-to-pdf';
    const API_ENDPOINT_MINDMAP = 'https://api.any2card.com/api/md-to-mindmap';
    const API_KEY_STORAGE = 'deepseek_generate_card_api_key';
 
    let modalOverlay = null;
    let apiKeyInput, markdownTextarea, templateSelect, splitModeSelect, widthInput, heightInput, aspectRatioSelect, fontSelect, watermarkToggle, watermarkTextInput, modalGenerateCardButton, modalCancelButton, cardResultDiv, heightOverflowHiddenToggle, heightOverflowHiddenRow;
    let floatingActionPanel = null;
 
    const floatingButtonStyles = {
        padding: '8px 12px',
        backgroundColor: 'rgb(0, 123, 255)',
        color: 'rgb(255, 255, 255)',
        border: 'none',
        borderRadius: '5px',
        cursor: 'pointer',
        transition: 'all 0.3s ease 0s',
        fontFamily: 'Arial, sans-serif',
        boxShadow: 'rgba(0, 0, 0, 0.2) 0px 2px 5px',
        whiteSpace: 'nowrap',
        fontSize: '14px',
        display: 'flex',
        alignItems: 'center',
        gap: '8px'
    };
 
    // --- Data from constants.ts ---
    const imageTextTemplates = [
      { id: "memo", name: "备忘录" },
      { id: "popart", name: "波普艺术" },
      { id: "traditionalchinese", name: "中国传统" },
      { id: "coilnotebook", name: "线圈笔记本" },
      { id: "purpleticket", name: "紫色小红书" },
      { id: "bytedance", name: "字节范" },
      { id: "warm", name: "温暖柔和" },
      { id: 'alibaba', name: '阿里橙' },
      { id: "notebook", name: "笔记本" },
      { id: "darktech", name: "黑色科技" },
      { id: "fairytale", name: "儿童童话" },
      { id: "boardgamestyle", name: "桌游风格" },
      { id: "cyberpunk", name: "赛博朋克" },
      { id: "glassmorphism", name: "玻璃拟态" },
      { id: "neonglow", name: "霓虹发光" },
      { id: "vintagenewspaper", name: "复古报纸" },
      { id: "handwrittennote", name: "手写笔记" },
      { id: "vintagemap", name: "古旧地图" },
    ];
 
    const splitModes = [
        { id: 'long', name: '长图文 (不分割)' },
        { id: 'auto', name: '自动切割 (智能)' },
        { id: 'line', name: '横线拆分 (---)' },
    ];
 
    const aspectRatios = [
        { id: 'custom', name: '自定义尺寸', width: 0, height: 0 },
        { id: '3:4', name: '3:4 竖屏', width: 3, height: 4 },
        { id: '1:1', name: '1:1 方形', width: 1, height: 1 },
        { id: '4:3', name: '4:3 横屏', width: 4, height: 3 },
        { id: '16:9', name: '16:9 横屏宽', width: 16, height: 9 },
        { id: '9:16', name: '9:16 竖屏长', width: 9, height: 16 },
    ];
 
    const fontOptionsFromConstants = [
      { label: "思源黑体", value: "var(--font-noto-sans-sc)" },
      { label: "思源宋体", value: "var(--font-noto-serif-sc)" },
      { label: "苹方中黑", value: "var(--font-pingfang-medium)" },
      { label: "方正公文黑", value: "var(--font-fangzheng-gongwenhei)" },
      { label: "汇文明朝", value: "var(--font-huiwen-mincho)" },
      { label: "霞鹜文楷", value: "var(--font-lxgw-wenkai-lite)" },
      { label: "马善政手写体", value: "var(--font-ma-shan-zheng)" },
      { label: "字酷快乐体", value: "var(--font-zcool-kuaile)" },
      { label: "字酷倾颜黄油体", value: "var(--font-zcool-qingke-huangyou)" },
      { label: "龙藏体", value: "var(--font-long-cang)" },
      { label: "智芒星体", value: "var(--font-zhi-mang-xing)" },
      { label: "柳简毛草体", value: "var(--font-liu-jian-mao-cao)" },
      { label: "字酷小薇体", value: "var(--font-zcool-xiaowei)" },
      { label: "禅丸哥特体", value: "var(--font-zen-maru-gothic)" },
      { label: "东叔原宋", value: "var(--font-dong-shu-yuan-song)" },
    ];
 
    const fontOptions = fontOptionsFromConstants.map(font => {
        let shortValue = font.value;
        if (font.value.startsWith("var(--font-") && font.value.endsWith(")")) {
            shortValue = font.value.substring(11, font.value.length - 1);
        }
        return { label: font.label, value: shortValue };
    });
 
 
    // --- Add Styles ---
    GM_addStyle(`
        .gm-generate-card-button {
            margin-left: 8px;
            padding: 5px 10px;
            font-size: 12px;
            font-weight: bold;
            line-height: 1.4;
            cursor: pointer;
            border: 1px solid #ffb6c1;
            background: linear-gradient(145deg, #ffd1dc, #ffb6c1);
            color: white;
            text-shadow: 0 1px 2px rgba(0, 0, 0, 0.4);
            border-radius: 16px;
            vertical-align: middle;
            display: inline-flex;
            align-items: center;
            justify-content: center;
            box-shadow: 0 2px 4px rgba(255, 105, 180, 0.3);
            transition: all 0.2s ease-in-out;
        }
        .gm-generate-card-button:hover {
            background: linear-gradient(145deg, #ffb6c1, #ffd1dc);
            border-color: #ff99aa;
            box-shadow: 0 3px 6px rgba(255, 105, 180, 0.5);
            transform: translateY(-1px);
        }
        .gm-generate-card-button:active {
            transform: translateY(0px);
            box-shadow: 0 1px 2px rgba(255, 105, 180, 0.4);
        }
        .gm-card-modal-overlay {
            position: fixed; top: 0; left: 0; width: 100%; height: 100%;
            background-color: rgba(0,0,0,0.6); display: flex; align-items: center; justify-content: center;
            z-index: 10000; opacity: 0; visibility: hidden;
            transition: opacity 0.3s ease, visibility 0s linear 0.3s;
        }
        .gm-card-modal-overlay.gm-modal-visible { opacity: 1; visibility: visible; transition: opacity 0.3s ease; }
        .gm-card-modal-content {
            background-color: #fff; color: #333; padding: 20px; border-radius: 8px;
            box-shadow: 0 5px 20px rgba(0,0,0,0.3); width: 90%; max-width: 1000px;
            display: flex; flex-direction: column; gap: 15px;
            max-height: 90vh;
        }
        .gm-card-modal-main-layout {
            display: flex; gap: 15px; flex-grow: 1; overflow: hidden; min-height: 400px;
        }
        .gm-card-modal-column {
            display: flex; flex-direction: column; gap: 10px; padding: 5px;
        }
        .gm-card-modal-column.gm-left-column { flex: 1.2; }
        .gm-card-modal-column.gm-middle-column {
            flex: 1; overflow-y: auto; max-height: calc(90vh - 100px); padding-right: 10px;
        }
        .gm-card-modal-column.gm-right-column { flex: 1.2; }
 
        .gm-card-modal-content label { display: block; margin-bottom: 3px; font-weight: bold; font-size: 13px; }
        .gm-card-modal-content textarea,
        .gm-card-modal-content input[type="number"],
        .gm-card-modal-content input[type="text"],
        .gm-card-modal-content select {
            width: 100%; padding: 8px; border: 1px solid #ccc; border-radius: 4px; font-size: 13px;
            background-color: #fff; color: #333; box-sizing: border-box;
        }
        .gm-card-modal-content textarea#gmCardMarkdown {
            flex-grow: 1; min-height: 200px; resize: vertical; background-color: #f9f9f9;
        }
        .gm-card-modal-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 10px; }
 
        .gm-card-modal-watermark-group { display: flex; align-items: center; gap: 10px; }
        .gm-card-modal-watermark-group input[type="checkbox"] { width: auto; flex-shrink: 0; }
        .gm-card-modal-watermark-group label { font-weight: normal; margin-bottom: 0; }
 
        .gm-card-modal-buttons {
            display: flex; justify-content: flex-end; gap: 10px; margin-top: auto;
            padding-top: 10px; border-top: 1px solid #eee;
        }
        .gm-card-modal-buttons button {
            padding: 8px 15px; border-radius: 4px; border: none; cursor: pointer;
            font-size: 14px; transition: background-color 0.2s ease;
        }
        button#gmCardGenerateBtn { background-color: #4CAF50; color: white; }
        button#gmCardGenerateBtn:hover { background-color: #45a049; }
        button#gmCardGenerateBtn:disabled { background-color: #aaa; cursor: not-allowed; }
        button#gmCardCancelBtn { background-color: #f0f0f0; color: #333; border: 1px solid #ccc; }
        button#gmCardCancelBtn:hover { background-color: #e0e0e0; }
 
        #gmCardResultDiv {
            flex-grow: 1; border: 1px dashed #ccc; min-height: 150px; text-align: left;
            background-color: #f9f9f9; padding: 10px; overflow-y: auto;
            position: relative;
        }
        #gmCardResultDiv img {
            max-width: 100%; max-height: 400px; border: 1px solid #eee;
            border-radius: 4px; background-color: white; display: block;
        }
        .gm-preview-image-button {
            position: absolute;
            top: 20px;
            left: 50%;
            transform: translateX(-50%);
            padding: 5px 10px;
            background-color: rgba(0, 0, 0, 0.6);
            color: white;
            border: none;
            border-radius: 4px;
            cursor: pointer;
            z-index: 10;
            font-size: 12px;
        }
        .gm-preview-image-button:hover {
            background-color: rgba(0, 0, 0, 0.8);
        }
        #gmCardResultDiv a {
            display: inline-block; padding: 10px 15px; background-color: #007bff; color: white;
            text-decoration: none; border-radius: 4px; margin-top: 10px;
        }
        #gmCardResultDiv a:hover { background-color: #0056b3; }
        .gm-spinner {
            border: 3px solid rgba(255,255,255,0.3); border-radius: 50%; border-top-color: #fff;
            width: 14px; height: 14px; animation: spin 1s linear infinite;
            display: inline-block; margin-right: 8px; vertical-align: middle;
        }
        @keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }
 
        .gm-api-key-group {
            display: flex;
            align-items: center;
            gap: 8px;
            width: 100%;
        }
        .gm-api-key-group input[type="text"] {
            flex-grow: 1;
            min-width: 0;
        }
        .gm-api-key-link {
            font-size: 12px;
            color: #007bff;
            text-decoration: none;
            white-space: nowrap;
        }
        .gm-api-key-link:hover {
            text-decoration: underline;
            color: #0056b3;
        }
 
        /* Styles for new features */
        /* The main button is now cloned, so it doesn't need extensive styling here */
        #gmMainGenerateCardBtn {
            cursor: pointer;
        }
 
        /* Using a selector that is hopefully stable enough for message items */
        .gm-message-item-for-checkbox {
            position: relative !important;
            padding-left: 40px !important; /* Increased padding to make space for shifted checkbox */
        }
 
        .gm-message-checkbox-container {
            position: absolute;
            top: 10px;
            left: -25px; /* Moved further to the left */
            width: 25px;
            height: 25px;
            display: flex;
            align-items: center;
            justify-content: center;
            z-index: 10;
        }
        .gm-message-checkbox {
            width: 16px;
            height: 16px;
            cursor: pointer;
            accent-color: #4CAF50; /* Style the checkbox color */
        }
 
        /* Site-specific adjustments */
        .gm-on-deepseek .gm-message-item-for-checkbox {
            position: relative !important;
            padding-left: 40px !important;
        }
        .gm-on-deepseek .gm-message-checkbox-container {
            left: -25px;
        }
 
        .gm-on-doubao .gm-message-item-for-checkbox {
            position: relative !important;
            padding-left: 30px !important;
        }
        .gm-on-doubao .gm-message-checkbox-container {
            left: 5px;
            top: 15px;
        }
    `);
 
    function createSelect(options, id, defaultSelectedValue) {
        const select = document.createElement('select');
        select.id = id;
        options.forEach(opt => {
            const optionEl = document.createElement('option');
            optionEl.value = opt.id || opt.value;
            optionEl.textContent = opt.name || opt.label;
            if ((opt.id || opt.value) === defaultSelectedValue) {
                optionEl.selected = true;
            }
            select.appendChild(optionEl);
        });
        return select;
    }
 
    function htmlToMarkdown(element) {
        if (!element) return "";
        // Create a temporary clone to work on to avoid modifying the live DOM
        const clone = element.cloneNode(true);
 
        // --- 1. Pre-process and replace special elements ---
 
        // Handle KaTeX math formulas by extracting LaTeX from annotations
        clone.querySelectorAll('.katex, .katex-display').forEach(katexEl => {
            const annotation = katexEl.querySelector('annotation[encoding="application/x-tex"]');
            if (annotation && annotation.textContent) {
                const tex = annotation.textContent.trim();
                const isBlock = katexEl.classList.contains('katex-display');
                katexEl.replaceWith(document.createTextNode(isBlock ? `\n\n$$${tex}$$` + `\n\n` : `\\(${tex}\\)`));
            } else {
                // Fallback if no annotation is found, just use text content to avoid showing raw HTML
                katexEl.replaceWith(document.createTextNode(katexEl.textContent || ''));
            }
        });
 
        // Handle code blocks
        clone.querySelectorAll('pre code').forEach(codeBlock => {
            const parentPre = codeBlock.parentElement;
            const lang = [...codeBlock.classList].find(cls => cls.startsWith('language-'))?.replace('language-', '') || '';
            // Replace the <pre> element with a markdown code block as a single text node
            parentPre.replaceWith(document.createTextNode(`\n\n\`\`\`${lang}\n${codeBlock.textContent.trim()}\n\`\`\`\n\n`));
        });
 
 
        // --- 2. Convert remaining HTML to a text-based representation with Markdown-like newlines ---
 
        // This is a simplified process. We'll use innerHTML and a series of regex replacements.
        // It's not as robust as a full DOM traversal, but it's much simpler and handles the main cases.
        let markdown = clone.innerHTML;
 
        // Add newlines for block elements
        markdown = markdown.replace(/<br\s*\/?>/gi, '\n');
        markdown = markdown.replace(/<\/h[1-6]>/gi, '\n\n');
        markdown = markdown.replace(/<\/p>/gi, '\n\n');
        markdown = markdown.replace(/<\/li>/gi, '\n');
        markdown = markdown.replace(/<hr[^>]*>/gi, '\n\n---\n\n');
 
        // Add markdown prefixes for lists and headings
        markdown = markdown.replace(/<h1[^>]*>/gi, '# ');
        markdown = markdown.replace(/<h2[^>]*>/gi, '## ');
        markdown = markdown.replace(/<h3[^>]*>/gi, '### ');
        markdown = markdown.replace(/<h4[^>]*>/gi, '#### ');
        markdown = markdown.replace(/<li[^>]*>/gi, (match) => {
            // A rough way to detect list level by indentation in the source HTML
            const indentation = match.search(/\S|$/);
            const level = Math.floor(indentation / 2); // Assuming 2 spaces indentation
            return '  '.repeat(level) + '* ';
        });
 
        // Handle inline elements
        markdown = markdown.replace(/<strong>(.*?)<\/strong>/gis, '**$1**');
        markdown = markdown.replace(/<b>(.*?)<\/b>/gis, '**$1**');
        markdown = markdown.replace(/<em>(.*?)<\/em>/gis, '*$1*');
        markdown = markdown.replace(/<i>(.*?)<\/i>/gis, '*$1*');
        markdown = markdown.replace(/<code[^>]*>(.*?)<\/code>/gis, '`$1`');
        markdown = markdown.replace(/<a href="(.*?)"[^>]*>(.*?)<\/a>/gi, '[$2]($1)');
 
        // --- 3. Strip all remaining tags and clean up whitespace ---
        const tempDiv = document.createElement('div');
        tempDiv.innerHTML = markdown;
        markdown = tempDiv.textContent || tempDiv.innerText;
 
        // Normalize newlines, removing excessive blank lines
        return markdown.replace(/(\n\s*){3,}/g, '\n\n').trim();
    }
 
    function createCardModal() {
        if (document.getElementById('gmCardModalOverlay')) return;
 
        modalOverlay = document.createElement('div');
        modalOverlay.id = 'gmCardModalOverlay';
        modalOverlay.className = 'gm-card-modal-overlay';
 
        const modalContent = document.createElement('div');
        modalContent.className = 'gm-card-modal-content';
        modalContent.addEventListener('click', e => e.stopPropagation());
 
        const mainLayout = document.createElement('div');
        mainLayout.className = 'gm-card-modal-main-layout';
 
        const leftColumn = document.createElement('div');
        leftColumn.className = 'gm-card-modal-column gm-left-column';
        let label = document.createElement('label');
        label.htmlFor = 'gmCardMarkdown';
        label.textContent = '卡片内容 (Markdown):';
        leftColumn.appendChild(label);
        markdownTextarea = document.createElement('textarea');
        markdownTextarea.id = 'gmCardMarkdown';
        markdownTextarea.readOnly = true;
        leftColumn.appendChild(markdownTextarea);
        mainLayout.appendChild(leftColumn);
 
        const middleColumn = document.createElement('div');
        middleColumn.className = 'gm-card-modal-column gm-middle-column';
 
        label = document.createElement('label');
        label.htmlFor = 'gmCardApiKey';
        label.textContent = 'API Key:';
        middleColumn.appendChild(label);
 
        const apiKeyGroup = document.createElement('div');
        apiKeyGroup.className = 'gm-api-key-group';
 
        apiKeyInput = document.createElement('input');
        apiKeyInput.type = 'text';
        apiKeyInput.id = 'gmCardApiKey';
        apiKeyInput.placeholder = '请输入您的 API Key';
 
        const apiKeyLink = document.createElement('a');
        apiKeyLink.href = 'https://any2card.com/zh/blog/api-key';
        apiKeyLink.target = '_blank';
        apiKeyLink.rel = 'noopener noreferrer';
        apiKeyLink.textContent = '获取 API Key';
        apiKeyLink.className = 'gm-api-key-link';
 
        apiKeyGroup.appendChild(apiKeyInput);
        apiKeyGroup.appendChild(apiKeyLink);
        middleColumn.appendChild(apiKeyGroup);
 
        label = document.createElement('label');
        label.htmlFor = 'gmCardTemplate';
        label.textContent = '图文模板:';
        middleColumn.appendChild(label);
        templateSelect = createSelect(imageTextTemplates, 'gmCardTemplate', imageTextTemplates[0]?.id);
        middleColumn.appendChild(templateSelect);
 
        label = document.createElement('label');
        label.htmlFor = 'gmCardSplitMode';
        label.textContent = '分割模式:';
        middleColumn.appendChild(label);
        splitModeSelect = createSelect(splitModes, 'gmCardSplitMode', splitModes[0]?.id);
        middleColumn.appendChild(splitModeSelect);
 
        // 新增：超出高度隐藏开关
        heightOverflowHiddenRow = document.createElement('div');
        heightOverflowHiddenRow.style.display = 'flex';
        heightOverflowHiddenRow.style.alignItems = 'center';
        heightOverflowHiddenRow.style.margin = '6px 0 0 0';
        let heightOverflowHiddenLabel = document.createElement('label');
        heightOverflowHiddenLabel.htmlFor = 'gmCardHeightOverflowHidden';
        heightOverflowHiddenLabel.textContent = '超出高度隐藏';
        heightOverflowHiddenLabel.style.marginRight = '8px';
        heightOverflowHiddenToggle = document.createElement('input');
        heightOverflowHiddenToggle.type = 'checkbox';
        heightOverflowHiddenToggle.id = 'gmCardHeightOverflowHidden';
        // 顺序调整：label在前，checkbox在后
        heightOverflowHiddenRow.appendChild(heightOverflowHiddenLabel);
        heightOverflowHiddenRow.appendChild(heightOverflowHiddenToggle);
        middleColumn.appendChild(heightOverflowHiddenRow);
 
        // 监听分割模式变化，只有long时显示
        splitModeSelect.addEventListener('change', function() {
            if (splitModeSelect.value === 'long') {
                heightOverflowHiddenRow.style.display = '';
            } else {
                heightOverflowHiddenRow.style.display = 'none';
            }
        });
        // 初始化时根据默认分割模式显示/隐藏
        if (splitModeSelect.value === 'long') {
            heightOverflowHiddenRow.style.display = '';
        }
 
        const dimensionGrid = document.createElement('div');
        dimensionGrid.className = 'gm-card-modal-grid';
        let div = document.createElement('div');
        label = document.createElement('label');
        label.htmlFor = 'gmCardWidth';
        label.textContent = '宽度 (px):';
        div.appendChild(label);
        widthInput = document.createElement('input');
        widthInput.type = 'number';
        widthInput.id = 'gmCardWidth';
        div.appendChild(widthInput);
        dimensionGrid.appendChild(div);
        div = document.createElement('div');
        label = document.createElement('label');
        label.htmlFor = 'gmCardHeight';
        label.textContent = '高度 (px):';
        div.appendChild(label);
        heightInput = document.createElement('input');
        heightInput.type = 'number';
        heightInput.id = 'gmCardHeight';
        div.appendChild(heightInput);
        dimensionGrid.appendChild(div);
        middleColumn.appendChild(dimensionGrid);
 
        label = document.createElement('label');
        label.htmlFor = 'gmCardAspectRatio';
        label.textContent = '宽高比:';
        middleColumn.appendChild(label);
        aspectRatioSelect = createSelect(aspectRatios, 'gmCardAspectRatio', aspectRatios.find(r => r.id === '3:4')?.id);
        aspectRatioSelect.addEventListener('change', function() {
            const selectedRatioInfo = aspectRatios.find(r => r.id === this.value);
            if (selectedRatioInfo && selectedRatioInfo.id !== 'custom' && selectedRatioInfo.width > 0 && selectedRatioInfo.height > 0) {
                const currentWidth = parseInt(widthInput.value, 10) || 440;
                widthInput.value = currentWidth;
                heightInput.value = Math.round((currentWidth * selectedRatioInfo.height) / selectedRatioInfo.width);
                heightInput.readOnly = true;
            } else {
                heightInput.readOnly = false;
            }
        });
        middleColumn.appendChild(aspectRatioSelect);
 
        label = document.createElement('label');
        label.htmlFor = 'gmCardFont';
        label.textContent = '字体选择:';
        middleColumn.appendChild(label);
        fontSelect = createSelect(fontOptions, 'gmCardFont', fontOptions.find(f => f.value === 'lxgw-wenkai-lite')?.value || fontOptions[0]?.value);
        middleColumn.appendChild(fontSelect);
 
        const watermarkGroup = document.createElement('div');
        watermarkGroup.className = 'gm-card-modal-watermark-group';
        watermarkToggle = document.createElement('input');
        watermarkToggle.type = 'checkbox';
        watermarkToggle.id = 'gmCardWatermarkToggle';
        watermarkGroup.appendChild(watermarkToggle);
        let watermarkLabelElement = document.createElement('label');
        watermarkLabelElement.htmlFor = 'gmCardWatermarkToggle';
        watermarkLabelElement.textContent = '启用水印';
        watermarkGroup.appendChild(watermarkLabelElement);
        watermarkTextInput = document.createElement('input');
        watermarkTextInput.type = 'text';
        watermarkTextInput.id = 'gmCardWatermarkText';
        watermarkTextInput.placeholder = '水印文字';
        watermarkTextInput.style.flexGrow = '1';
        watermarkTextInput.disabled = true;
        watermarkToggle.addEventListener('change', () => watermarkTextInput.disabled = !watermarkToggle.checked);
        watermarkGroup.appendChild(watermarkTextInput);
        middleColumn.appendChild(watermarkGroup);
        mainLayout.appendChild(middleColumn);
 
        const rightColumn = document.createElement('div');
        rightColumn.className = 'gm-card-modal-column gm-right-column';
        label = document.createElement('label');
        label.htmlFor = 'gmCardResultDiv';
        label.textContent = '生成结果:';
        rightColumn.appendChild(label);
        cardResultDiv = document.createElement('div');
        cardResultDiv.id = 'gmCardResultDiv';
        rightColumn.appendChild(cardResultDiv);
        mainLayout.appendChild(rightColumn);
 
        modalContent.appendChild(mainLayout);
 
        const buttonsDiv = document.createElement('div');
        buttonsDiv.className = 'gm-card-modal-buttons';
        modalCancelButton = document.createElement('button');
        modalCancelButton.textContent = '取消';
        modalCancelButton.id = 'gmCardCancelBtn';
        modalCancelButton.addEventListener('click', () => modalOverlay.classList.remove('gm-modal-visible'));
        modalGenerateCardButton = document.createElement('button');
        modalGenerateCardButton.textContent = '生成卡片';
        modalGenerateCardButton.id = 'gmCardGenerateBtn';
        buttonsDiv.appendChild(modalCancelButton);
        buttonsDiv.appendChild(modalGenerateCardButton);
        modalContent.appendChild(buttonsDiv);
 
        modalOverlay.appendChild(modalContent);
        document.body.appendChild(modalOverlay);
        modalOverlay.addEventListener('click', () => modalOverlay.classList.remove('gm-modal-visible'));
    }
 
    function handleGenerateCard() {
        const apiKey = apiKeyInput.value.trim();
        if (!apiKey) {
            alert('请输入 API Key。');
            apiKeyInput.focus();
            return;
        }
        GM_setValue(API_KEY_STORAGE, apiKey);
 
        const settings = {
            templateType: "imageText",
            selectedImageTextTemplate: templateSelect.value,
            splitMode: splitModeSelect.value,
            cardWidth: parseInt(widthInput.value, 10) || 440,
            cardHeight: parseInt(heightInput.value, 10) || 587,
            fontFamily: fontSelect.value,
            watermarkEnabled: watermarkToggle.checked,
            watermarkText: watermarkToggle.checked ? watermarkTextInput.value.trim() : "",
            deviceScaleFactor: 2,
            heightOverflowHidden: splitModeSelect.value === 'long' ? heightOverflowHiddenToggle.checked : false,
        };
        const markdownContent = markdownTextarea.value;
 
        if (!markdownContent) { alert('无法获取卡片内容。'); return; }
        if (settings.cardWidth <= 0 || settings.cardHeight <= 0) { alert('宽度和高度必须是正数。'); return; }
 
        console.log("API Request Parameters:");
        console.log("Settings:", JSON.parse(JSON.stringify(settings)));
        console.log("Markdown Content:", markdownContent);
 
        modalGenerateCardButton.disabled = true;
        modalGenerateCardButton.innerHTML = '<span class="gm-spinner"></span>生成中...';
        cardResultDiv.innerHTML = '正在请求 API...';
 
        GM_xmlhttpRequest({
            method: "POST",
            url: API_ENDPOINT,
            headers: {
                "Content-Type": "application/json",
                "x-api-key": apiKey
            },
            data: JSON.stringify({ markdownContent, settings }),
            onload: function(response) {
                try {
                    const result = JSON.parse(response.responseText);
                    if (response.status >= 200 && response.status < 300 && result.code === 0) {
                        cardResultDiv.innerHTML = '';
                        if (result.data && result.data.url) {
                            if (result.data.type === 'png') {
                                const img = document.createElement('img');
                                img.src = result.data.url;
                                img.alt = '生成的卡片';
                                cardResultDiv.appendChild(img);
 
                                const previewButton = document.createElement('button');
                                previewButton.textContent = '预览原图';
                                previewButton.className = 'gm-preview-image-button';
                                previewButton.onclick = function() {
                                    GM_openInTab(result.data.url, { active: true, insert: true });
                                };
                                cardResultDiv.insertBefore(previewButton, img);
 
                            } else if (result.data.type === 'zip') {
                                const link = document.createElement('a');
                                link.href = result.data.url;
                                link.textContent = `下载卡片 (ZIP${result.data.pages ? ' - ' + result.data.pages + '页' : ''})`;
                                link.target = '_blank';
                                cardResultDiv.appendChild(link);
                                if(confirm("ZIP文件已生成，是否立即在新标签页打开下载链接？")) {
                                    GM_openInTab(result.data.url, { active: true, insert: true });
                                }
                            } else {
                                cardResultDiv.textContent = `收到未知类型的响应: ${result.data.type}`;
                            }
                        } else {
                            cardResultDiv.textContent = 'API 响应中未找到有效的图片或文件 URL。';
                        }
                    } else {
                        throw new Error(result.message || `API 请求失败 (状态 ${response.status})`);
                    }
                } catch (error) {
                    console.error('解析响应或处理数据错误:', error);
                    cardResultDiv.textContent = `错误: ${error.message}`;
                } finally {
                    modalGenerateCardButton.disabled = false;
                    modalGenerateCardButton.textContent = '生成卡片';
                }
            },
            onerror: function(response) {
                console.error('GM_xmlhttpRequest 错误:', response);
                cardResultDiv.textContent = `请求错误: ${response.statusText || '无法连接到服务器'}`;
                modalGenerateCardButton.disabled = false;
                modalGenerateCardButton.textContent = '生成卡片';
            }
        });
    }
 
    function showCardModal(defaultMarkdown) {
        if (!modalOverlay) createCardModal();
 
        markdownTextarea.value = defaultMarkdown;
        apiKeyInput.value = GM_getValue(API_KEY_STORAGE, "");
 
        widthInput.value = '440';
        heightInput.value = '587';
        aspectRatioSelect.value = aspectRatios.find(r => r.id === '3:4')?.id || aspectRatios[0].id;
        aspectRatioSelect.dispatchEvent(new Event('change'));
 
        // 新增：初始化超出高度隐藏开关
        heightOverflowHiddenToggle.checked = false;
        if (splitModeSelect.value === 'long') {
            heightOverflowHiddenRow.style.display = '';
        } else {
            heightOverflowHiddenRow.style.display = 'none';
        }
 
        watermarkToggle.checked = false;
        watermarkTextInput.value = '';
        watermarkTextInput.disabled = true;
        cardResultDiv.innerHTML = '';
 
        const oldBtn = modalGenerateCardButton;
        if (oldBtn && oldBtn.parentNode) {
            modalGenerateCardButton = oldBtn.cloneNode(true);
            oldBtn.parentNode.replaceChild(modalGenerateCardButton, oldBtn);
        }
        modalGenerateCardButton.addEventListener('click', handleGenerateCard);
 
 
        modalOverlay.classList.add('gm-modal-visible');
        if (!apiKeyInput.value) apiKeyInput.focus();
    }
 
    function addGenerateCardButton(targetButtonElement) {
        if (targetButtonElement.dataset.hasGenerateCardButton) return;
 
        const genButton = document.createElement('button');
        genButton.textContent = generateButtonText;
        genButton.title = generateButtonTitle;
        genButton.className = 'gm-generate-card-button';
 
        genButton.addEventListener('click', async function(event) {
            event.stopPropagation();
            event.preventDefault();
            let promptText = '';
 
            // --- Start: New clipboard logic ---
            let copyButton;
            if (onDeepSeek) {
                const actionsContainer = targetButtonElement.parentElement;
                if (actionsContainer) {
                    const buttonsInContainer = actionsContainer.querySelectorAll('div.ds-icon-button');
                    for (let i = 0; i < buttonsInContainer.length; i++) {
                        const svgPath = buttonsInContainer[i].querySelector('svg path[d^="M3.65169"]');
                        if (svgPath) {
                            copyButton = buttonsInContainer[i];
                            break;
                        }
                    }
                }
            } else if (onDoubao) {
                const actionsContainer = targetButtonElement.closest('.container-tjEzGV');
                if (actionsContainer) {
                    copyButton = actionsContainer.querySelector('button[data-testid="message_action_copy"]');
                }
            }
 
            if (copyButton) {
                try {
                    copyButton.click(); // Simulate click on the copy button
                    await new Promise(resolve => setTimeout(resolve, 150)); // 150ms delay
                    promptText = await navigator.clipboard.readText();
 
                    if (promptText && promptText.trim() !== '') {
                        GM_log('Script: Successfully retrieved content from clipboard.');
                        showCardModal(promptText);
                        return; // Successfully got content from clipboard
                    } else {
                        GM_log('Script: Clipboard was empty after copy. Falling back to text extraction.');
                        promptText = ''; // Ensure promptText is reset
                    }
                } catch (err) {
                    GM_log('Script: Failed to read from clipboard. Error: ' + err.message + '. Falling back.');
                    promptText = ''; // Ensure promptText is reset
                }
            } else {
                GM_log('Script: Could not find the copy button. Falling back to text extraction.');
            }
            // --- End: New clipboard logic ---
 
            // --- Fallback: Existing text extraction logic ---
            if (!promptText) {
                if (onDeepSeek) {
                    let messageWrapper = null;
                    let currentElement = targetButtonElement;
                    const messageWrapperSelectors = [
                        '.group', '.chat-message-item', '.message-container',
                        'div[class*="message-bubble"]', 'div[class*="content-container"]',
                    ];
 
                    for (let i = 0; i < 7 && currentElement && currentElement.parentElement; i++) {
                        currentElement = currentElement.parentElement;
                        for (const selector of messageWrapperSelectors) {
                            if (currentElement.matches(selector)) {
                                messageWrapper = currentElement;
                                break;
                            }
                        }
                        if (!messageWrapper &&
                            currentElement.querySelector('div.ds-markdown.ds-markdown--block:not(:empty)') &&
                            currentElement.contains(targetButtonElement)) {
                            messageWrapper = currentElement;
                        }
                        if (messageWrapper) break;
                    }
 
                    if (messageWrapper) {
                        const markdownElements = Array.from(messageWrapper.querySelectorAll('div.ds-markdown.ds-markdown--block:not(:empty)'));
                        let foundMd = null;
                        for (let i = markdownElements.length - 1; i >= 0; i--) {
                            if (!markdownElements[i].contains(targetButtonElement)) {
                                foundMd = markdownElements[i];
                                break;
                            }
                        }
                        if (foundMd) {
                            promptText = (foundMd.innerText || foundMd.textContent || "").trim();
                        }
                    }
 
                    if (!promptText) {
                        let searchStartNode = targetButtonElement.parentElement;
                        for (let i = 0; i < 3 && searchStartNode; i++) {
                            let sibling = searchStartNode.previousElementSibling;
                            while (sibling) {
                                if (sibling.matches('div.ds-markdown.ds-markdown--block:not(:empty)')) {
                                    promptText = (sibling.innerText || sibling.textContent || "").trim();
                                    break;
                                }
                                const mdBlock = sibling.querySelector('div.ds-markdown.ds-markdown--block:not(:empty)');
                                if (mdBlock) {
                                    promptText = (mdBlock.innerText || mdBlock.textContent || "").trim();
                                    break;
                                }
                                sibling = sibling.previousElementSibling;
                            }
                            if (promptText) break;
                            searchStartNode = searchStartNode.parentElement;
                        }
                    }
                    GM_log('Script: Using fallback text extraction for DeepSeek. Found: ' + (promptText ? 'content' : 'no content'));
                } else if (onDoubao) {
                    const messageWrapper = targetButtonElement.closest('div[data-testid="receive_message"]');
                    if (messageWrapper) {
                        const contentEl = messageWrapper.querySelector('div[data-testid="message_text_content"]');
                        if (contentEl) {
                            promptText = htmlToMarkdown(contentEl);
                        }
                    }
                }
            }
            // --- End of Fallback logic ---
 
            if (!promptText) {
                GM_log('Script: Could not reliably find message content using any method.');
                promptText = "# 内容提取失败\\n\\n请手动复制内容或检查脚本的DOM选择器。";
            }
            showCardModal(promptText);
        });
 
        if (targetButtonElement.nextSibling) {
            targetButtonElement.parentNode.insertBefore(genButton, targetButtonElement.nextSibling);
        } else {
            targetButtonElement.parentNode.appendChild(genButton);
        }
        targetButtonElement.dataset.hasGenerateCardButton = 'true';
    }
 
    function findAndProcessTargetButtons_DeepSeek() {
        const specificDislikeButtonSelector = `div.ds-icon-button svg path[d^="${dislikeIconSvgPathStart}"]`;
        const iconPaths = document.querySelectorAll(specificDislikeButtonSelector);
        iconPaths.forEach(svgPath => {
            const buttonElement = svgPath.closest('div.ds-icon-button');
            if (buttonElement) {
                const messageRoleCheck = buttonElement.closest('[class*="agent"], [class*="assistant"], [class*="response"]');
                const userRoleCheck = buttonElement.closest('[class*="user"], [class*="prompt"]');
                if (userRoleCheck && messageRoleCheck && userRoleCheck.contains(messageRoleCheck)) { /* Skip nested */ }
                else if (userRoleCheck) { return; }
                addGenerateCardButton(buttonElement);
            }
        });
    }
 
    function findAndProcessTargetButtons_Doubao() {
        const dislikeButtons = document.querySelectorAll('button[data-testid="message_action_dislike"]');
        dislikeButtons.forEach(button => {
            const messageContainer = button.closest('div[data-testid="receive_message"]');
            if (messageContainer) {
                addGenerateCardButton(button);
            }
        });
    }
 
    function findAndProcessTargetButtons() {
        if (onDeepSeek) {
            findAndProcessTargetButtons_DeepSeek();
        } else if (onDoubao) {
            findAndProcessTargetButtons_Doubao();
        }
    }
 
    // --- Helper functions for content extraction ---
    function getCopyButtonFromMessageWrapper(wrapper) {
        if (onDeepSeek) {
            const svgPath = wrapper.querySelector('div.ds-icon-button svg path[d^="M3.65169"]');
            return svgPath ? svgPath.closest('div.ds-icon-button') : null;
        }
        if (onDoubao) {
            return wrapper.querySelector('button[data-testid="message_action_copy"]');
        }
        return null;
    }
 
    function getMarkdownFromMessageWrapper(wrapper) {
        let contentElement;
        if (onDeepSeek) {
            contentElement = wrapper.querySelector('div.ds-markdown.ds-markdown--block:not(:empty)');
            if (contentElement) return htmlToMarkdown(contentElement);
 
            // Fallback for DeepSeek's complex structure
            const children = Array.from(wrapper.children || []);
            for (const child of children) {
                if (!child.querySelector('.ds-flex') && !child.classList.contains('gm-message-checkbox-container')) {
                    const text = child.innerText || child.textContent || "";
                    if (text.trim()) return text.trim();
                }
            }
        } else if (onDoubao) {
            contentElement = wrapper.querySelector('div[data-testid="message_text_content"]');
            if (contentElement) return htmlToMarkdown(contentElement);
        }
        return '';
    }
 
    async function getCombinedMarkdownForExport() {
        const checkedBoxes = document.querySelectorAll('.gm-message-checkbox:checked');
        if (checkedBoxes.length === 0) {
            alert('请先勾选需要导出的对话。');
            return null;
        }
 
        let combinedMarkdown = [];
        let firstTitle = onDeepSeek ? 'DeepSeek' : '豆包';
        let foundFirstTitle = false;
 
        for (const checkbox of checkedBoxes) {
            const messageWrapper = checkbox.closest('.gm-message-item-for-checkbox');
            if (!messageWrapper) continue;
 
            let promptText = '';
            const copyButton = getCopyButtonFromMessageWrapper(messageWrapper);
 
            if (copyButton) {
                try {
                    copyButton.click();
                    await new Promise(resolve => setTimeout(resolve, 150));
                    promptText = await navigator.clipboard.readText();
                    GM_log(`Script: Successfully retrieved content from clipboard for ${window.location.hostname}.`);
                } catch (err) {
                    GM_log(`Script: Clipboard copy failed on ${window.location.hostname}: ${err.message}. Falling back to htmlToMarkdown.`);
                    promptText = getMarkdownFromMessageWrapper(messageWrapper);
                }
            } else {
                GM_log(`Script: Copy button not found on ${window.location.hostname}, falling back to direct text extraction.`);
                promptText = getMarkdownFromMessageWrapper(messageWrapper);
            }
 
            if (promptText) {
                if (!foundFirstTitle) {
                    const titleMatch = promptText.match(/^(?:#\s+)(.+)/);
                    if (titleMatch && titleMatch[1]) {
                        firstTitle = titleMatch[1].trim();
                        foundFirstTitle = true;
                    }
                }
                combinedMarkdown.push(promptText);
            }
        }
 
        if (combinedMarkdown.length === 0) {
            alert('未能提取已勾选对话的内容。');
            return null;
        }
 
        return {
            markdown: combinedMarkdown.join('\n\n---\n\n'),
            title: firstTitle,
        };
    }
 
    // --- New Feature Functions ---
    function createFloatingActionPanel() {
        if (document.getElementById('gm-floating-action-panel')) return;
 
        floatingActionPanel = document.createElement('div');
        floatingActionPanel.id = 'gm-floating-action-panel';
 
        Object.assign(floatingActionPanel.style, {
            position: 'fixed',
            top: '45%',
            right: '10px',
            zIndex: '9999',
            display: 'flex',
            flexDirection: 'column',
            gap: '10px',
            opacity: '0.7',
            transition: 'opacity 0.3s ease',
            cursor: 'move'
        });
 
        floatingActionPanel.onmouseenter = () => { floatingActionPanel.style.opacity = '1'; };
        floatingActionPanel.onmouseleave = () => { floatingActionPanel.style.opacity = '0.7'; };
 
        let isDragging = false;
        let initialX, initialY;
        let xOffset = 0, yOffset = 0;
 
        function dragStart(e) {
            if (e.target === floatingActionPanel) {
                isDragging = true;
                initialX = e.clientX - xOffset;
                initialY = e.clientY - yOffset;
            }
        }
 
        function drag(e) {
            if (isDragging) {
                e.preventDefault();
                const currentX = e.clientX - initialX;
                const currentY = e.clientY - initialY;
                xOffset = currentX;
                yOffset = currentY;
                floatingActionPanel.style.transform = `translate(${xOffset}px, ${yOffset}px)`;
            }
        }
 
        function dragEnd() {
            isDragging = false;
        }
 
        floatingActionPanel.addEventListener('mousedown', dragStart);
        document.addEventListener('mousemove', drag);
        document.addEventListener('mouseup', dragEnd);
 
        document.body.appendChild(floatingActionPanel);
    }
 
    function addExportWordButton() {
        if (document.getElementById('gmMainExportWordBtn') || !floatingActionPanel) return;
 
        const exportWordButton = document.createElement('button');
        exportWordButton.id = 'gmMainExportWordBtn';
        Object.assign(exportWordButton.style, floatingButtonStyles);
 
 
        const iconHTML = `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M4 17v2a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-2" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"></path><path d="M7 11l5 5 5-5" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"></path><path d="M12 4v12" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"></path></svg>`;
        const buttonText = '导出 Word';
        exportWordButton.innerHTML = iconHTML + `<span>${buttonText}</span>`;
 
        const setLoading = (isLoading) => {
            if (isLoading) {
                exportWordButton.disabled = true;
                exportWordButton.innerHTML = '<span class="gm-spinner"></span><span>导出中...</span>';
            } else {
                exportWordButton.disabled = false;
                exportWordButton.innerHTML = iconHTML + `<span>${buttonText}</span>`;
            }
        };
 
        exportWordButton.addEventListener('click', async () => {
            setLoading(true);
            const exportData = await getCombinedMarkdownForExport();
            if (!exportData) {
                setLoading(false);
                return;
            }
 
            GM_xmlhttpRequest({
                method: "POST",
                url: API_ENDPOINT_WORD,
                headers: { "Content-Type": "application/json" },
                data: JSON.stringify({ markdown: exportData.markdown, title: exportData.title }),
                responseType: 'blob',
                onload: function(response) {
                    setLoading(false);
                    if (response.status >= 200 && response.status < 300) {
                        try {
                            const dispositionHeader = response.responseHeaders.match(/content-disposition:.*/i) ? response.responseHeaders.match(/content-disposition:.*/i)[0] : '';
                            const filenameMatch = dispositionHeader.match(/filename[^;=\n]*=((['"]).*?\2|[^;\n]*)/);
                            const filename = filenameMatch && filenameMatch[1] ? decodeURIComponent(filenameMatch[1].replace(/['"]/g, '')) : 'document.docx';
 
                            const blob = response.response;
                            const url = URL.createObjectURL(blob);
                            const a = document.createElement('a');
                            a.style.display = 'none';
                            a.href = url;
                            a.download = filename;
                            document.body.appendChild(a);
                            a.click();
                            document.body.removeChild(a);
                            URL.revokeObjectURL(url);
                        } catch (e) {
                            alert('下载文件时出错: ' + e.message);
                            console.error("处理下载时出错:", e);
                        }
                    } else {
                        const reader = new FileReader();
                        reader.onload = function() {
                            try {
                                const errorResult = JSON.parse(this.result);
                                alert(`导出失败: ${errorResult.error || '未知错误'}`);
                            } catch (e) {
                                alert(`导出失败，状态码: ${response.status}。无法解析错误信息。`);
                            }
                        };
                        reader.readAsText(response.response);
                    }
                },
                onerror: function(response) {
                    setLoading(false);
                    alert(`请求错误: ${response.statusText || '无法连接到服务器'}`);
                }
            });
        });
 
        floatingActionPanel.appendChild(exportWordButton);
    }
 
    function addExportPdfButton() {
        if (document.getElementById('gmMainExportPdfBtn') || !floatingActionPanel) return;
 
        const exportPdfButton = document.createElement('button');
        exportPdfButton.id = 'gmMainExportPdfBtn';
        Object.assign(exportPdfButton.style, floatingButtonStyles);
 
 
        const iconHTML = `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M13 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V9z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/><path d="M13 2v7h7" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>`;
        const buttonText = '导出 PDF';
        exportPdfButton.innerHTML = iconHTML + `<span>${buttonText}</span>`;
 
        const setLoading = (isLoading) => {
            if (isLoading) {
                exportPdfButton.disabled = true;
                exportPdfButton.innerHTML = '<span class="gm-spinner"></span><span>导出中...</span>';
            } else {
                exportPdfButton.disabled = false;
                exportPdfButton.innerHTML = iconHTML + `<span>${buttonText}</span>`;
            }
        };
 
        exportPdfButton.addEventListener('click', async () => {
            setLoading(true);
            const exportData = await getCombinedMarkdownForExport();
            if (!exportData) {
                setLoading(false);
                return;
            }
 
            GM_xmlhttpRequest({
                method: "POST",
                url: API_ENDPOINT_PDF,
                headers: { "Content-Type": "application/json" },
                data: JSON.stringify({ markdown: exportData.markdown, title: exportData.title }),
                responseType: 'blob',
                onload: function(response) {
                    setLoading(false);
                    if (response.status >= 200 && response.status < 300) {
                        try {
                            const dispositionHeader = response.responseHeaders.match(/content-disposition:.*/i) ? response.responseHeaders.match(/content-disposition:.*/i)[0] : '';
                            const filenameMatch = dispositionHeader.match(/filename[^;=\n]*=((['"]).*?\2|[^;\n]*)/);
                            const filename = filenameMatch && filenameMatch[1] ? decodeURIComponent(filenameMatch[1].replace(/['"]/g, '')) : 'document.pdf';
 
                            const blob = response.response;
                            const url = URL.createObjectURL(blob);
                            const a = document.createElement('a');
                            a.style.display = 'none';
                            a.href = url;
                            a.download = filename;
                            document.body.appendChild(a);
                            a.click();
                            document.body.removeChild(a);
                            URL.revokeObjectURL(url);
                        } catch (e) {
                            alert('下载文件时出错: ' + e.message);
                            console.error("处理下载时出错:", e);
                        }
                    } else {
                        const reader = new FileReader();
                        reader.onload = function() {
                            try {
                                const errorResult = JSON.parse(this.result);
                                alert(`导出失败: ${errorResult.error || '未知错误'}`);
                            } catch (e) {
                                alert(`导出失败，状态码: ${response.status}。无法解析错误信息。`);
                            }
                        };
                        reader.readAsText(response.response);
                    }
                },
                onerror: function(response) {
                    setLoading(false);
                    alert(`请求错误: ${response.statusText || '无法连接到服务器'}`);
                }
            });
        });
 
        floatingActionPanel.appendChild(exportPdfButton);
    }
 
    function addExportMindMapButton() {
        if (document.getElementById('gmMainExportMindMapBtn') || !floatingActionPanel) return;
 
        const exportMindMapButton = document.createElement('button');
        exportMindMapButton.id = 'gmMainExportMindMapBtn';
        Object.assign(exportMindMapButton.style, floatingButtonStyles);
 
 
        const iconHTML = `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M7 12H3M7 12C7 8.68629 9.68629 6 13 6V6C16.3137 6 19 8.68629 19 12V12C19 15.3137 16.3137 18 13 18V18C9.68629 18 7 15.3137 7 12V12Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/><path d="M13 6V3M13 18V21M19 12H21" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>`;
        const buttonText = '导出思维导图';
        exportMindMapButton.innerHTML = iconHTML + `<span>${buttonText}</span>`;
 
        const setLoading = (isLoading) => {
            if (isLoading) {
                exportMindMapButton.disabled = true;
                exportMindMapButton.innerHTML = '<span class="gm-spinner"></span><span>导出中...</span>';
            } else {
                exportMindMapButton.disabled = false;
                exportMindMapButton.innerHTML = iconHTML + `<span>${buttonText}</span>`;
            }
        };
 
        exportMindMapButton.addEventListener('click', async () => {
            setLoading(true);
            const exportData = await getCombinedMarkdownForExport();
            if (!exportData) {
                setLoading(false);
                return;
            }
 
            GM_xmlhttpRequest({
                method: "POST",
                url: API_ENDPOINT_MINDMAP,
                headers: { "Content-Type": "application/json" },
                data: JSON.stringify({ markdown: exportData.markdown, title: exportData.title }),
                responseType: 'blob',
                onload: function(response) {
                    setLoading(false);
                    if (response.status >= 200 && response.status < 300) {
                        try {
                            const dispositionHeader = response.responseHeaders.match(/content-disposition:.*/i) ? response.responseHeaders.match(/content-disposition:.*/i)[0] : '';
                            const filenameMatch = dispositionHeader.match(/filename[^;=\n]*=((['"]).*?\2|[^;\n]*)/);
                            const filename = filenameMatch && filenameMatch[1] ? decodeURIComponent(filenameMatch[1].replace(/['"]/g, '')) : 'mindmap.mm';
 
                            const blob = response.response;
                            const url = URL.createObjectURL(blob);
                            const a = document.createElement('a');
                            a.style.display = 'none';
                            a.href = url;
                            a.download = filename;
                            document.body.appendChild(a);
                            a.click();
                            document.body.removeChild(a);
                            URL.revokeObjectURL(url);
                        } catch (e) {
                            alert('下载文件时出错: ' + e.message);
                            console.error("处理下载时出错:", e);
                        }
                    } else {
                        const reader = new FileReader();
                        reader.onload = function() {
                            try {
                                const errorResult = JSON.parse(this.result);
                                alert(`导出失败: ${errorResult.error || '未知错误'}`);
                            } catch (e) {
                                alert(`导出失败，状态码: ${response.status}。无法解析错误信息。`);
                            }
                        };
                        reader.readAsText(response.response);
                    }
                },
                onerror: function(response) {
                    setLoading(false);
                    alert(`请求错误: ${response.statusText || '无法连接到服务器'}`);
                }
            });
        });
 
        floatingActionPanel.appendChild(exportMindMapButton);
    }
 
    function addExportMarkdownButton() {
        if (document.getElementById('gmMainExportMarkdownBtn') || !floatingActionPanel) return;
 
        const exportMarkdownButton = document.createElement('button');
        exportMarkdownButton.id = 'gmMainExportMarkdownBtn';
        Object.assign(exportMarkdownButton.style, floatingButtonStyles);
 
        const iconHTML = `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M9 7V17M15 7V17M9 12H15M3 10V4C3 3.44772 3.44772 3 4 3H16L21 8V20C21 20.5523 20.5523 21 20 21H4C3.44772 21 3 20.5523 3 20V14" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>`;
        const buttonText = '导出 MD';
        exportMarkdownButton.innerHTML = iconHTML + `<span>${buttonText}</span>`;
 
        const originalInnerHTML = exportMarkdownButton.innerHTML;
        const setLoading = (isLoading) => {
            if (isLoading) {
                exportMarkdownButton.disabled = true;
                exportMarkdownButton.innerHTML = '<span class="gm-spinner"></span><span>导出中...</span>';
            } else {
                exportMarkdownButton.disabled = false;
                exportMarkdownButton.innerHTML = originalInnerHTML;
            }
        };
 
        exportMarkdownButton.addEventListener('click', async () => {
            setLoading(true);
            const exportData = await getCombinedMarkdownForExport();
            if (!exportData) {
                setLoading(false);
                return;
            }
 
            try {
                const timestamp = new Date().toISOString().replace(/[:.]/g, '-').slice(0, -5);
                let chatName = document.title.split(' - ')[0] || exportData.title;
                chatName = `${onDeepSeek ? 'DeepSeek' : '豆包'} - ${chatName}`.replace(/[\/\\?%*:|"<>]/g, '-');
                const fileName = `${chatName}_${timestamp}.md`;
 
                const blob = new Blob([exportData.markdown], { type: 'text/markdown;charset=utf-8' });
                const url = URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.style.display = 'none';
                a.href = url;
                a.download = fileName;
                document.body.appendChild(a);
                a.click();
                document.body.removeChild(a);
                URL.revokeObjectURL(url);
            } catch (e) {
                alert('下载文件时出错: ' + e.message);
                console.error("处理下载时出错:", e);
            } finally {
                setLoading(false);
            }
        });
 
        floatingActionPanel.appendChild(exportMarkdownButton);
    }
 
    function addMainGenerateCardButton() {
        if (document.getElementById('gmMainGenerateCardBtn') || !floatingActionPanel) return;
 
        const mainGenButton = document.createElement('button');
        mainGenButton.id = 'gmMainGenerateCardBtn';
        Object.assign(mainGenButton.style, floatingButtonStyles);
 
        const iconHTML = `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M21 15.6538V18C21 19.1046 20.1046 20 19 20H5C3.89543 20 3 19.1046 3 18V6C3 4.89543 3.89543 4 5 4H14.3462" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"></path><path d="M7 14L10.0718 10.9282C10.4522 10.5478 11.0854 10.5478 11.4658 10.9282L14 13.5" stroke="currentColor" stroke-width="2" stroke-linecap="round"></path><path d="M12.5 15L14.0718 13.4282C14.4522 13.0478 15.0854 13.0478 15.4658 13.4282L18 16" stroke="currentColor" stroke-width="2" stroke-linecap="round"></path><path d="M18 4L22 8" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"></path><path d="M17 9L21 5" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"></path></svg>`;
        const buttonText = '生成卡片';
        mainGenButton.innerHTML = iconHTML + `<span>${buttonText}</span>`;
 
        mainGenButton.addEventListener('click', async () => {
            const exportData = await getCombinedMarkdownForExport();
            if (exportData && exportData.markdown) {
                showCardModal(exportData.markdown);
            } else {
                alert('未能提取已勾选对话的内容或内容为空。');
            }
        });
 
        floatingActionPanel.appendChild(mainGenButton);
    }
 
    function addCheckboxesToMessages_DeepSeek() {
        // 查找所有可能的对话内容区域
        // 提问部分：在ds-flex节点的上级的上级的前面兄弟节点中查找内容
        // 回答部分：在ds-flex节点的上级的前面兄弟节点中查找内容
        const flexElements = document.querySelectorAll('.ds-flex');
 
        flexElements.forEach(flexEl => {
            // 跳过已经处理过的对话区域
            const processedParent = flexEl.closest('.gm-message-item-for-checkbox');
            if (processedParent) {
                return;
            }
 
            // 检查是否是有效的对话操作区域
            const actionButtons = flexEl.querySelectorAll('.ds-icon-button');
            if (actionButtons.length < 2) {
                return; // 不是我们要找的操作区域
            }
 
            let messageWrapper = null;
            let contentElement = null;
 
            // 检查是否是回答部分 - 回答部分的flex直接父级是对话容器
            const parentElement = flexEl.parentElement;
            if (parentElement) {
                const markdownElement = parentElement.querySelector('.ds-markdown.ds-markdown--block');
                if (markdownElement && !markdownElement.contains(flexEl)) {
                    messageWrapper = parentElement;
                    contentElement = markdownElement;
                }
            }
 
            // 检查是否是提问部分 - 提问部分需要往上查找两级，然后查找前面的兄弟节点
            if (!messageWrapper) {
                const grandParent = flexEl.parentElement?.parentElement;
                if (grandParent) {
                    // 在提问部分，内容通常在祖父节点的前一个兄弟节点中
                    const prevSibling = grandParent.previousElementSibling;
                    if (prevSibling) {
                        messageWrapper = prevSibling.parentElement;
                        contentElement = prevSibling;
                    }
                }
            }
 
            // 如果找到了对话容器和内容元素
            if (messageWrapper && contentElement) {
                // 确保没有重复添加
                if (messageWrapper.querySelector('.gm-message-checkbox-container')) {
                    return;
                }
 
                // 添加标记类
                messageWrapper.classList.add('gm-message-item-for-checkbox');
 
                const container = document.createElement('div');
                container.className = 'gm-message-checkbox-container';
 
                const checkbox = document.createElement('input');
                checkbox.type = 'checkbox';
                checkbox.className = 'gm-message-checkbox';
 
                container.appendChild(checkbox);
                messageWrapper.prepend(container); // 添加到对话容器的开始位置
            }
        });
    }
 
    function addCheckboxesToMessages_Doubao() {
        document.querySelectorAll('div[data-testid="union_message"]').forEach(messageWrapper => {
            if (messageWrapper && !messageWrapper.querySelector('.gm-message-checkbox-container')) {
                messageWrapper.classList.add('gm-message-item-for-checkbox');
 
                const container = document.createElement('div');
                container.className = 'gm-message-checkbox-container';
 
                const checkbox = document.createElement('input');
                checkbox.type = 'checkbox';
                checkbox.className = 'gm-message-checkbox';
 
                container.appendChild(checkbox);
                messageWrapper.prepend(container);
            }
        });
    }
 
    function addCheckboxesToMessages() {
        if (onDeepSeek) {
            addCheckboxesToMessages_DeepSeek();
        } else if (onDoubao) {
            addCheckboxesToMessages_Doubao();
        }
    }
 
    function addSelectAllButton() {
        if (document.getElementById('gmMainSelectAllBtn') || !floatingActionPanel) return;
 
        const selectAllButton = document.createElement('button');
        selectAllButton.id = 'gmMainSelectAllBtn';
        Object.assign(selectAllButton.style, floatingButtonStyles);
 
        const iconHTML = `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M3 5.5L4.5 7L7.5 4" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"></path><path d="M3 11.5L4.5 13L7.5 10" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"></path><path d="M3 17.5L4.5 19L7.5 16" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"></path><path d="M11 6H21" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"></path><path d="M11 12H21" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"></path><path d="M11 18H21" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"></path></svg>`;
        const selectAllText = '全选';
        const deselectAllText = '取消全选';
 
        const textSpan = document.createElement('span');
        textSpan.textContent = selectAllText;
 
        selectAllButton.innerHTML = iconHTML;
        selectAllButton.appendChild(textSpan);
 
        selectAllButton.addEventListener('click', () => {
            const allCheckboxes = document.querySelectorAll('.gm-message-checkbox');
            if (allCheckboxes.length === 0) {
                return;
            }
            const shouldSelectAll = Array.from(allCheckboxes).some(cb => !cb.checked);
            allCheckboxes.forEach(checkbox => {
                checkbox.checked = shouldSelectAll;
            });
            textSpan.textContent = shouldSelectAll ? deselectAllText : '全选';
        });
 
        floatingActionPanel.appendChild(selectAllButton);
    }
 
    function runFeatureInjections() {
        findAndProcessTargetButtons(); // Existing feature
 
        // These buttons will be added to the floating panel
        addSelectAllButton();
        addExportWordButton();
        addExportPdfButton();
        addExportMindMapButton();
        addExportMarkdownButton();
        addMainGenerateCardButton();
 
        addCheckboxesToMessages(); // New feature
    }
 
    // --- Main Execution ---
    createCardModal();
    createFloatingActionPanel();
    document.body.classList.add(onDeepSeek ? 'gm-on-deepseek' : (onDoubao ? 'gm-on-doubao' : ''));
    setTimeout(runFeatureInjections, 3000);
 
    const observer = new MutationObserver((mutationsList) => {
        let needsUpdate = false;
        let needsCheckboxUpdate = false;
 
        for (const mutation of mutationsList) {
            if (mutation.type === 'childList' && mutation.addedNodes.length > 0) {
                mutation.addedNodes.forEach(node => {
                    if (node.nodeType === Node.ELEMENT_NODE) {
                        // 检查新增节点是否包含内容元素或操作按钮
                        if (node.querySelector && (
                            node.querySelector('.ds-flex') ||
                            node.querySelector('.ds-markdown.ds-markdown--block') ||
                            node.querySelector('.ds-icon-button')
                        )) {
                            needsCheckboxUpdate = true;
                        }
                        // 整体更新标志
                        needsUpdate = true;
                    }
                });
            }
        }
 
        // 如果检测到新的内容元素，立即添加复选框
        if (needsCheckboxUpdate) {
            addCheckboxesToMessages();
        }
 
        // 整体功能更新（可能包括其他功能）
        if (needsUpdate) {
            // Using a timeout to let the DOM settle and avoid over-firing
            setTimeout(runFeatureInjections, 500);
        }
    });
    observer.observe(document.documentElement, { childList: true, subtree: true });
 
})();
