// ==UserScript==
// @name         Bangumi Wiki 终极增强套件
// @namespace    https://tampermonkey.net/
// @version      3.1.3.2
// @description  集成Wiki按钮、关联按钮、封面上传、批量关联、批量分集编辑、内容快捷填充、单行本快捷创建、编辑预览功能
// @author       Bios (improved Claude & Gemini)
// @include      /^https?:\/\/(bgm|bangumi|chii)\.tv\/(subject|character|person|new_subject)\/.*/
// @exclude      /^https?:\/\/[^\/]+\/character\/[^\/]+\/add_related\/person\/.*/
// @exclude      /^https?:\/\/[^\/]+\/person\/[^\/]+\/add_related\/character\/.*/
// @connect      bgm.tv
// @connect      bangumi.tv
// @connect      chii.in
// @icon         https://lain.bgm.tv/pic/icon/l/000/00/01/128.jpg
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_deleteValue
// @grant        GM_xmlhttpRequest
// @license      MIT
// @require      https://cdnjs.cloudflare.com/ajax/libs/jquery/3.6.0/jquery.min.js
// @run-at       document-idle
// @downloadURL https://update.greasyfork.org/scripts/529535/Bangumi%20Wiki%20%E7%BB%88%E6%9E%81%E5%A2%9E%E5%BC%BA%E5%A5%97%E4%BB%B6.user.js
// @updateURL https://update.greasyfork.org/scripts/529535/Bangumi%20Wiki%20%E7%BB%88%E6%9E%81%E5%A2%9E%E5%BC%BA%E5%A5%97%E4%BB%B6.meta.js
// ==/UserScript==

/* global $ jQuery */

(function() {
    "use strict";

    // 样式注入函数
    function injectStyles() {
        $('head').append(`
<style>

    :root {
        /* 主题色 - 粉色为主色，蓝色为悬停色 */
        --primary-color: #F09199;
        --primary-hover: #369CF8;
        --primary-light: rgba(240, 145, 153, 0.1);

        /* 文本颜色 */
        --text-primary: #333333;
        --text-secondary: #666666;

        /* 边框和背景 */
        --border-color: #E0E0E0;
        --background-light: #F9F9F9;

        /* 状态颜色 */
        --success-color: #42B983;
        --warning-color: #E6A23C;
        --danger-color: #F56C6C;
        --info-color: #4A90E2;

        /* 统一样式属性 */
        --border-radius: 8px;
        --transition-normal: all 0.1s cubic-bezier(0.4, 0, 0.2, 1);
    }


    /* 按钮 */
    .btnCustom {
        margin: 5px 0;
        background-color: var(--primary-color) !important;
        color: white !important;
        border-radius: var(--border-radius) !important;
        padding: 8px 16px !important;
        border: none !important;
        cursor: pointer !important;
        font-size: 14px;
        font-weight: 600;
        text-align: center;
        display: flex;
        justify-content: center;
        align-items: center;
        transition: var(--transition-normal);
    }

    .btnCustom:hover {
        background-color: var(--primary-hover) !important;
        transform: translateY(-1px);
    }


    /* 文本域 */
    .enhancer-textarea {
        width: 100%;
        min-height: 80px;
        max-height: 300px;
        border: 1px solid var(--border-color);
        border-radius: var(--border-radius);
        padding: 12px;
        margin: 10px 0;
        resize: vertical;
        font-size: 14px;
        box-sizing: border-box;
        background: white;
        transition: var(--transition-normal);
    }

    .enhancer-textarea:focus {
        border-color: var(--primary-color);
        box-shadow: 0 0 0 3px var(--primary-light);
        outline: none;
    }


    /* 数字输入框 */
    .input-number {
        width: 100px;
        height: 10px;
        padding: 10px;
        border-radius: var(--border-radius);
        border: 1px solid var(--border-color);
        background: white;
        transition: var(--transition-normal);
        font-size: 14px;
    }

    .input-number:focus {
        border-color: var(--primary-color);
        box-shadow: 0 0 0 3px var(--primary-light);
        outline: none;
    }


    /* 批量关联模块 */
    .Relation_wrapper {
        width: 280px;
        margin: 18px 0;
        text-align: center;
        background: white;
        padding: 18px;
        border-radius: var(--border-radius);
        border: 1px solid var(--border-color);
        transition: var(--transition-normal);
    }

    .select-label {
        display: flex;
        margin-right: auto;
        font-weight: 600;
        color: var(--text-secondary);
    }

    .Relation_item_type {
        display: flex;
        margin-right: auto;
        align-items: center;
    }

    .Relation_progress {
        margin: 14px 0;
        color: var(--primary-color);
        font-weight: 600;
        font-size: 18px;
        text-align: center;
    }

    .Relation_header {
        font-size: 17px;
        margin: 14px 0 8px;
        color: var(--text-primary);
        font-weight: 600;
        text-align: left;
    }

    .Relation_controls {
        display: flex;
        justify-content: flex-end;
        align-items: center;
        gap: 10px;
    }


    /* 状态提示色块 */
    .Relation_item_not_found,
    .Relation_item_dupe,
    .Relation_item_type_changed,
    .Relation_item_unchanged {
        margin-top: 10px;
        padding: 12px;
        min-height: 15px;
        border-radius: var(--border-radius);
        font-size: 14px;
        transition: var(--transition-normal);
    }

    .Relation_item_not_found {
        color: var(--danger-color);
        background: rgba(245, 108, 108, 0.1);
        border: 1px solid rgba(245, 108, 108, 0.2);
    }

    .Relation_item_dupe {
        color: var(--info-color);
        background: rgba(74, 144, 226, 0.1);
        border: 1px solid rgba(74, 144, 226, 0.2);
    }

    .Relation_item_type_changed {
        color: var(--success-color);
        background: rgba(66, 185, 131, 0.1);
        border: 1px solid rgba(66, 185, 131, 0.2);
    }

    .Relation_item_unchanged {
        color: var(--warning-color);
        background: rgba(230, 162, 60, 0.1);
        border: 1px solid rgba(230, 162, 60, 0.2);
    }


    /* 标签页 */
    .tab-nav {
        display: flex;
        justify-content: center;
        border-bottom: 2px solid var(--border-color);
        margin-bottom: 18px;
    }

    .tab-nav button {
        background: none;
        border: none;
        padding: 12px 24px;
        cursor: pointer;
        font-size: 14px;
        font-weight: 600;
        color: var(--text-secondary);
        border-bottom: 3px solid transparent;
        transition: var(--transition-normal);
    }

    .tab-nav button.active {
        border-bottom: 3px solid var(--primary-color);
        color: var(--primary-color);
    }

    .tab-nav button:hover {
        color: var(--primary-hover);
        border-bottom: 3px solid var(--primary-hover);
    }

    .tab-panel {
        display: none;
    }

    .tab-panel.active {
        display: block;
        animation: fadeInPanel 0.3s ease;
    }

    @keyframes fadeInPanel {
        from {
            opacity: 0;
            transform: translateY(8px);
        }
        to {
            opacity: 1;
            transform: translateY(0);
        }
    }


    /* 封面上传 */
    .cover-upload-modal {
        display: none;
        background: white;
        position: fixed;
        z-index: 1000;
        border: 1px solid var(--border-color);
        border-radius: var(--border-radius);
        padding: 15px;
        width: 240px;
        max-width: 100%;
        transition: var(--transition-normal);
    }

    #coverUploadForm {
        display: flex;
        flex-direction: column;
        align-items: center;
    }

    #coverUploadForm input[type="file"] {
        border: 2px dashed var(--border-color);
        border-radius: var(--border-radius);
        padding: 10px;
        width: 100%;
        background: var(--background-light);
        box-sizing: border-box;
        cursor: pointer;
        transition: var(--transition-normal);
    }

    #coverUploadForm input[type="file"]:hover {
        border-color: var(--primary-color);
        background: var(--primary-light);
    }

    #coverUploadForm input[type="submit"] {
        background: var(--primary-color);
        color: white;
        border: none;
        border-radius: 20px;
        padding: 8px 16px;
        margin-top: 8px;
        cursor: pointer;
        font-weight: 600;
        transition: var(--transition-normal);
        position: relative;
        top: -15px;
    }

    #coverUploadForm input[type="submit"]:hover {
        background: var(--primary-hover);
        transform: translateY(-1px);
    }

    .upload-section {
        display: flex;
        flex-direction: column;
    }

    .url-input-container {
        display: flex;
        margin-bottom: 10px;
        height: 30px;
    }

    .image-url-input {
        flex-grow: 1;
        padding: 8px;
        margin-right: 10px;
        border: 1px solid var(--border-color);
        border-radius: var(--border-radius);
        outline: none;
        transition: var(--transition-normal);
        font-size: 14px;
    }

    .image-url-input:focus {
        border-color: var(--primary-color);
        box-shadow: 0 0 0 3px var(--primary-light);
    }

    .download-url-button {
        padding: 8px 16px;
        background-color: var(--primary-color);
        color: white;
        border: none;
        border-radius: var(--border-radius);
        cursor: pointer;
        font-weight: 600;
        transition: var(--transition-normal);
        display: flex;
        align-items: center;
        justify-content: center;
        height: 100%;
    }

    .download-url-button:hover {
        background-color: var(--primary-hover);
        transform: translateY(-1px);
    }

    .upload-form-container {
        margin-top: 10px;
    }

    .image-preview-container {
        margin-top: 10px;
        display: none;
        text-align: center;
    }

    .image-preview {
        max-width: 100%;
        max-height: 300px;
        object-fit: contain;
        border: 1px solid var(--border-color);
        border-radius: var(--border-radius);
    }


    /* 单行本快捷创建 */
    #clone-entry-button {
        transition: all 0.3s ease !important;
        position: relative !important;
    }

    #clone-entry-button:hover {
        background-color: var(--primary-hover) !important;
    }

    #bgm-notification-area {
        transition: all 0.3s ease !important;
        font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif !important;
        font-size: 14px !important;
        font-weight: 500 !important;
    }


    /* 下拉菜单 */
    .bgm-dropdown {
        position: relative;
        display: inline-block;
    }

    .bgm-dropdown-content {
        display: none;
        position: absolute;
        background-color: #f9f9f9;
        min-width: 50px;
        max-width: fit-content;
        max-height: 200px;
        overflow-y: auto;
        z-index: 1000;
        border-radius: 4px;
        margin-top: 2px;
        left: 0;
        top: 100%;
    }

    .bgm-dropdown-active {
        display: block;
    }

    .bgm-dropdown-item {
        padding: 8px 12px;
        text-decoration: none;
        display: block;
        cursor: pointer;
        transition: background-color 0.2s;
        white-space: nowrap;
    }

    .bgm-dropdown-item:hover {
        background-color: #f1f1f1;
    }

    .bgm-dropdown-item.selected {
        background-color: #e6e6e6;
    }


    /* 配置模态框 */
    .bgm-config-modal {
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background-color: rgba(0, 0, 0, 0.5);
        display: flex;
        justify-content: center;
        align-items: center;
        z-index: 2000;
    }

    .bgm-config-content {
        background-color: white;
        padding: 20px;
        border-radius: 6px;
        max-width: 300px;
        width: 90%;
        max-height: 90vh;
        overflow-y: auto;
        position: relative;
    }

    .bgm-config-close {
        position: absolute;
        top: 10px;
        right: 10px;
        font-size: 20px;
        cursor: pointer;
        background: none;
        border: none;
        color: #555;
    }

    .bgm-config-close:hover {
        color: #000;
    }

    .bgm-config-textarea {
        width: 95%;
        height: 300px;
        font-family: monospace;
        padding: 8px;
        margin-bottom: 10px;
        border: 1px solid #ddd;
        border-radius: 4px;
        resize: vertical;
    }

    .bgm-config-buttons {
        display: flex;
        gap: 6px;
        justify-content: center;
        margin-top: 15px;
    }

    .bgm-config-button {
        padding: 6px 12px;
        border: none;
        border-radius: 4px;
        cursor: pointer;
        background-color: #f0f0f0;
        transition: background-color 0.2s;
    }

    .bgm-config-button:hover {
        background-color: #e0e0e0;
    }

    .bgm-config-button.primary {
        background-color: var(--primary-color);
        color: white;
    }

    .bgm-config-button.primary:hover {
        background-color: var(--primary-hover);
    }

    .bgm-config-button.danger {
        background-color: var(--danger-color);
        color: white;
    }

    .bgm-config-button.danger:hover {
        background-color: color-mix(in srgb, var(--danger-color) 90%, black);
    }

    .bgm-input-wrapper {
        position: relative;
        display: inline;
    }

    .preview-overlay {
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background-color: rgba(0, 0, 0, 0.75);
        z-index: 9999;
        display: flex;
        justify-content: center;
        align-items: center;
        animation: fadeIn 0.2s ease-in;
    }
    
    @keyframes fadeIn {
        from { opacity: 0; }
        to { opacity: 1; }
    }
    
    .preview-container {
        background-color: white;
        padding: 25px;
        border-radius: 8px;
        max-width: 90%;
        max-height: 85%;
        overflow-y: auto;
        position: relative;
        font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
        box-shadow: 0 10px 40px rgba(0, 0, 0, 0.3);
    }
    
    .preview-header {
        font-size: 20px;
        font-weight: bold;
        margin-bottom: 20px;
        border-bottom: 2px solid #e0e0e0;
        padding-bottom: 12px;
        color: #333;
    }
    
    .preview-content {
        margin-bottom: 20px;
    }
    
    .preview-section {
        margin-bottom: 30px;
        border: 1px solid #e8e8e8;
        border-radius: 6px;
        overflow: hidden;
    }
    
    .preview-section-title {
        font-weight: bold;
        padding: 12px 15px;
        font-size: 16px;
        background: linear-gradient(to bottom, #f8f9fa, #f0f0f0);
        color: #444;
        border-bottom: 1px solid #e0e0e0;
    }
    
    .preview-diff-container {
        background-color: #fafafa;
    }
    
    .preview-diff-header {
        background-color: #f5f5f5;
        padding: 10px 15px;
        border-bottom: 1px solid #ddd;
        font-weight: 600;
        font-size: 13px;
        color: #666;
        display: flex;
        justify-content: space-around;
    }
    
    .preview-diff-header .old-label {
        color: #c73232;
    }
    
    .preview-diff-header .new-label {
        color: #28a745;
    }
    
    .preview-diff-content {
        max-height: 400px;
        overflow-y: auto;
        font-family: 'Consolas', 'Monaco', 'Courier New', monospace;
        font-size: 13px;
        line-height: 1.5;
    }
    
    .preview-diff-line {
        display: flex;
        border-bottom: 1px solid #f0f0f0;
        transition: background-color 0.15s;
    }
    
    .preview-diff-line:hover {
        background-color: #f9f9f9;
    }
    
    .preview-diff-line:last-child {
        border-bottom: none;
    }
    
    .preview-diff-old {
        background-color: #fff;
        color: #333;
        flex: 1;
        padding: 4px 12px;
        white-space: pre-wrap;
        word-break: break-word;
        border-right: 1px solid #e8e8e8;
    }
    
    .preview-diff-new {
        background-color: #fff;
        color: #333;
        flex: 1;
        padding: 4px 12px;
        white-space: pre-wrap;
        word-break: break-word;
    }
    
    .preview-diff-old .del {
        background-color: #ffeef0;
        color: #c73232;
        text-decoration: line-through;
        padding: 2px 0;
    }
    
    .empty-placeholder {
        color: #999;
        font-style: italic;
        font-size: 12px;
    }
    
    .preview-diff-new .add {
        background-color: #e6ffed;
        color: #28a745;
        padding: 2px 0;
    }
    
    .preview-diff-old .mod {
        background-color: #fff3cd;
        color: #856404;
        padding: 2px 0;
    }
    
    .preview-diff-new .mod {
        background-color: #d1ecf1;
        color: #0c5460;
        padding: 2px 0;
    }
    
    .preview-diff-line-number {
        color: #999;
        text-align: right;
        padding: 4px 8px;
        min-width: 45px;
        background-color: #f8f8f8;
        border-right: 1px solid #ddd;
        user-select: none;
        font-size: 12px;
    }
    
    .preview-diff-line.unchanged {
        opacity: 0.6;
    }
    
    .preview-diff-line.changed {
        background-color: #fffef7;
    }
    
    .preview-buttons {
        display: flex;
        justify-content: center;
        gap: 20px;
        margin-top: 25px;
        padding-top: 20px;
        border-top: 2px solid #e8e8e8;
    }
    
    .preview-button {
        padding: 8px 20px;
        cursor: pointer;
        border-radius: 5px;
        border: none;
        color: white;
        font-weight: bold;
        font-size: 14px;
        transition: all 0.2s;
        box-shadow: 0 2px 4px rgba(0,0,0,0.1);
    }
    
    .preview-button:hover {
        transform: translateY(-1px);
        box-shadow: 0 4px 8px rgba(0,0,0,0.15);
    }
    
    .preview-button-cancel {
        background-color: #dc3545;
    }
    
    .preview-button-cancel:hover {
        background-color: #c82333;
    }
    
    .preview-button-confirm {
        background-color: #28a745;
    }
    
    .preview-button-confirm:hover {
        background-color: #218838;
    }
    
    .preview-close {
        position: absolute;
        top: 15px;
        right: 15px;
        cursor: pointer;
        font-size: 24px;
        color: #999;
        width: 30px;
        height: 30px;
        display: flex;
        align-items: center;
        justify-content: center;
        border-radius: 50%;
        transition: all 0.2s;
    }
    
    .preview-close:hover {
        background-color: #f0f0f0;
        color: #333;
    }
    
    .no-changes-message {
        text-align: center;
        padding: 40px 20px;
        color: #666;
        font-size: 15px;
    }
    
    .stats-info {
        font-size: 12px;
        color: #888;
        margin-top: 8px;
        padding: 8px 15px;
        background-color: #f9f9f9;
        border-top: 1px solid #e8e8e8;
    }
    
    .stats-add {
        color: #28a745;
        font-weight: 600;
    }
    
    .stats-del {
        color: #dc3545;
        font-weight: 600;
    }

    /* 布局辅助类 */
    .flex-row {
        display: flex;
        gap: 14px;
        align-items: center;
    }

</style>
    `);
    }
    

    /* =============
     Wiki、关联按钮
    =============== */
    function initNavButtons() {
        // 精确匹配仅以数字结尾的路径（不允许多余路径）
        const pathMatch = location.pathname.match(/^\/(subject|person|character)\/(\d+)$/);
        if (!pathMatch) return;

        const [, pageType, pageId] = pathMatch;
        const origin = location.origin;

        // 获取导航栏
        const nav = document.querySelector(".subjectNav .navTabs, .navTabs");
        if (!nav) return;

        // 按钮配置
        const buttons = [
            {
                className: "wiki-button",
                getText: () => "编辑",
                getUrl: () => pageType === "subject"
                ? `${origin}/${pageType}/${pageId}/edit_detail`
                : `${origin}/${pageType}/${pageId}/edit`
            },
            {
                className: "relate-button",
                getText: () => "关联",
                getUrl: () => pageType === "subject"
                ? `${origin}/${pageType}/${pageId}/add_related/subject/anime`
                : `${origin}/${pageType}/${pageId}/add_related/anime`
            }
        ];

        // 添加按钮
        buttons.forEach(button => {
            if (!nav.querySelector(`.${button.className}`)) {
                const li = document.createElement("li");
                li.className = button.className;
                li.innerHTML = `<a href="${button.getUrl()}" target="_blank">${button.getText()}</a>`;
                nav.appendChild(li);
            }
        });
    }

    // 监听 URL 变化
    function observeURLChanges() {
        let lastURL = location.href;
        new MutationObserver(() => {
            if (location.href !== lastURL) {
                lastURL = location.href;
                initNavButtons();
            }
        }).observe(document, { subtree: true, childList: true });
    }


    /* ===========
     封面快捷上传
    ============= */
    async function initCoverUpload() {
        // 定义支持的域名（用于后续可能的URL匹配校验，当前未使用）
        const SUPPORTED_DOMAINS = ['bangumi\\.tv', 'bgm\\.tv', 'chii\\.in'];
        const url = window.location.href; // 当前页面完整 URL
        const pathname = location.pathname; // 当前页面路径部分（不含域名、参数）

        // 仅当路径完全以数字结尾才认为是有效的目标页面
        const match = pathname.match(/^\/(subject|person|character)\/(\d+)$/);
        if (!match) return; // 如果不匹配，直接退出函数，不执行后续逻辑

        // 解析页面类型（subject/person/character）和 ID
        const type = match[1];
        const id = match[2];
        const parsedInfo = { type, id }; // 封装为对象便于后续使用

        // 如果上传按钮已经存在，则不再重复创建，避免重复注入
        if (document.querySelector("#coverUploadButton")) return;

        // 获取导航栏 DOM 元素（兼容旧模板和新模板）
        const nav = document.querySelector(".subjectNav .navTabs") || document.querySelector(".navTabs");
        if (!nav) return; // 如果找不到导航栏，则无法插入按钮，直接退出

        // 创建上传按钮和表单容器（无论是否有图片）
        const createUploadButton = () => {
            const uploadLi = document.createElement("li");
            uploadLi.id = "coverUploadButton";
            uploadLi.className = "upload-button";
            uploadLi.style.float = "right";
            uploadLi.innerHTML = `<a href="javascript:void(0);" style="padding: 10px 10px 9px;">上传封面</a>`;
            return uploadLi;
        };

        const createFormContainer = () => {
            const formContainer = document.createElement("div");
            formContainer.id = "coverUploadFormContainer";
            formContainer.classList.add("cover-upload-modal");
            formContainer.innerHTML = `
        <div class="upload-section">
          <div class="url-input-container">
            <input type="text" id="imageUrlInput" class="image-url-input" placeholder="输入图片 URL">
            <button id="downloadUrlButton" class="download-url-button">下载</button>
          </div>
          <div id="uploadFormContainer" class="upload-form-container"></div>
          <div id="imagePreviewContainer" class="image-preview-container">
            <img id="imagePreview" class="image-preview" alt="图片预览">
          </div>
          <div id="statusMessage" class="status-message" style="display:none; margin-top:10px; padding:5px; text-align:center;"></div>
        </div>
        `;
            formContainer.style.position = "absolute";
            formContainer.style.zIndex = "9999";
            formContainer.style.display = "none";
            return formContainer;
        };

        const uploadLi = createUploadButton();
        const formContainer = createFormContainer();
        nav.appendChild(uploadLi);
        document.body.appendChild(formContainer);

        // 初始化图片相关变量
        let imgIdx = 0, imgList = [], voteLinks = [];
        let imgEl = null, coverLnk = null, coverDiv = null, currImgSrc = null;

        // 尝试获取封面图片容器
        coverDiv = document.querySelector('#bangumiInfo .infobox div[align="center"]');
        if (coverDiv) {
            imgEl = coverDiv.querySelector('a.cover img');
            coverLnk = coverDiv.querySelector('a.cover');
            currImgSrc = imgEl ? imgEl.getAttribute('src') : null;
        }

        // 创建圆形箭头按钮
        const createArrow = (cls) => {
            const arrow = document.createElement('div');
            arrow.className = `cover-arrow ${cls}`;
            Object.assign(arrow.style, {
                position: 'absolute',
                top: '50%',
                transform: 'translateY(-50%)',
                [cls.includes('left') ? 'left' : 'right']: '10px',
                opacity: '0.8',
                cursor: 'pointer',
                background: 'rgba(0, 0, 0, 0.7)',
                color: '#fff',
                width: '30px',
                height: '30px',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '16px',
                fontWeight: 'bold',
                zIndex: '1000',
                boxShadow: '0 0 5px rgba(0, 0, 0, 0.5)',
                transition: 'background 0.2s ease, opacity 0.2s ease'
            });
            arrow.innerHTML = cls.includes('left') ? '◄' : '►';

            arrow.addEventListener('mouseenter', () => {
                arrow.style.background = 'rgba(0, 0, 0, 0.9)';
                arrow.style.opacity = '1';
            });
            arrow.addEventListener('mouseleave', () => {
                arrow.style.background = 'rgba(0, 0, 0, 0.7)';
                arrow.style.opacity = '0.8';
            });
            return arrow;
        };

        // 创建投票按钮
        const createVoteButton = () => {
            const voteButton = document.createElement('div');
            voteButton.className = 'vote-button';
            Object.assign(voteButton.style, {
                position: 'absolute',
                bottom: '15px',
                left: '50%',
                transform: 'translateX(-50%)',
                opacity: '0.9',
                cursor: 'pointer',
                background: 'var(--new-color)',
                color: '#fff',
                padding: '8px 20px',
                borderRadius: '20px',
                fontSize: '14px',
                fontWeight: 'bold',
                zIndex: '1000',
                boxShadow: '0 2px 5px rgba(0, 0, 0, 0.3)',
                transition: 'background 0.2s ease, transform 0.1s ease, box-shadow 0.2s ease',
            });
            voteButton.textContent = '投票';

            voteButton.addEventListener('mouseenter', () => {
                voteButton.style.background = 'color-mix(in srgb, var(--new-color) 90%, black)';
                voteButton.style.transform = 'translateX(-50%) scale(1.05)';
                voteButton.style.boxShadow = '0 4px 8px rgba(0, 0, 0, 0.4)';
            });
            voteButton.addEventListener('mouseleave', () => {
                voteButton.style.background = 'var(--new-color)';
                voteButton.style.transform = 'translateX(-50%) scale(1)';
                voteButton.style.boxShadow = '0 2px 5px rgba(0, 0, 0, 0.3)';
            });
            return voteButton;
        };

        // 图片切换逻辑（仅在有图片时启用）
        if (coverDiv && imgEl && coverLnk) {
            const updateImg = () => {
                const newImgSrc = imgList[imgIdx];
                imgEl.setAttribute('src', newImgSrc);
                coverLnk.setAttribute('href', newImgSrc.replace('/r/400/', '/'));
                const voteButton = coverDiv.querySelector('.vote-button');
                if (voteButton) voteButton.remove();
                if (newImgSrc !== currImgSrc && voteLinks[imgIdx]) {
                    const voteBtn = createVoteButton();
                    voteBtn.addEventListener('click', () => {
                        const voteUrl = voteLinks[imgIdx];
                        if (!voteUrl) {
                            showStatus('找不到有效的投票链接', true);
                            showBrowserNotification("投票失败", "找不到有效的投票链接。");
                            return;
                        }

                        const fullVoteUrl = voteUrl.startsWith('http')
                        ? voteUrl
                        : `https://${window.location.host}${voteUrl.startsWith('/') ? '' : '/'}${voteUrl}`;

                        showStatus('正在提交投票...');

                        const xhr = new XMLHttpRequest();
                        xhr.open('GET', fullVoteUrl, true);
                        xhr.withCredentials = true;
                        xhr.setRequestHeader('Accept', 'text/html');
                        xhr.setRequestHeader('Referer', window.location.href);

                        xhr.onload = function() {
                            if (xhr.status >= 200 && xhr.status < 300) {
                                alert('投票成功！页面将在3秒后刷新...');
                                showBrowserNotification("投票成功", "封面投票成功，页面即将刷新。");
                                setTimeout(() => window.location.reload(), 3000);
                            } else {
                                const errorMsg = `投票失败(${xhr.status})，请手动投票`;
                                showStatus(errorMsg, true);
                                showBrowserNotification("投票失败", `投票遇到问题 (${xhr.status})，请尝试手动投票。`);
                                console.error('投票请求失败:', xhr.statusText);
                            }
                        };
                        xhr.onerror = function() {
                            alert('网络错误，投票失败，请手动投票！');
                            showBrowserNotification("投票失败", "网络错误导致投票失败，请尝试手动投票。");
                            console.error('投票XHR请求错误');
                        };

                        xhr.send();
                    });
                    coverDiv.appendChild(voteBtn);
                }
            };

            const changeImg = (dir) => {
                if (imgList.length) {
                    imgIdx = (imgIdx + dir + imgList.length) % imgList.length;
                    updateImg();
                }
            };

            const arrows = [
                createArrow('cover-arrow-left'),
                createArrow('cover-arrow-right')
            ];
            coverDiv.style.position = 'relative';
            coverDiv.append(...arrows);
            arrows.forEach(arrow => arrow.style.display = 'none');
            coverDiv.addEventListener('mouseenter', () => {
                arrows.forEach(arrow => arrow.style.display = 'flex');
                const voteBtn = coverDiv.querySelector('.vote-button');
                if (voteBtn) voteBtn.style.display = 'block';
            });
            coverDiv.addEventListener('mouseleave', () => {
                arrows.forEach(arrow => arrow.style.display = 'none');
                const voteBtn = coverDiv.querySelector('.vote-button');
                if (voteBtn) voteBtn.style.display = 'none';
            });
            coverDiv.addEventListener('click', (e) => {
                if (e.target.classList.contains('cover-arrow-left')) changeImg(-1);
                if (e.target.classList.contains('cover-arrow-right')) changeImg(1);
            });
        }

        // 获取图片列表
        const fetchImgList = () => {
            fetch(`${window.location.pathname}/upload_img`)
                .then(res => res.text())
                .then(html => {
                const $html = new DOMParser().parseFromString(html, 'text/html');
                const imgs = Array.from($html.querySelectorAll('.photoList li a.grid img')).map(img => img.getAttribute('src'));
                voteLinks = Array.from($html.querySelectorAll('.photoList li a[href*="/vote/cover/"]')).map(a => a.getAttribute('href'));
                imgList = [...new Set(imgs)];
                imgIdx = Math.max(0, imgList.indexOf(currImgSrc));
                if (imgList.length > 1 && coverDiv && imgEl && coverLnk) {
                    updateImg();
                }
            })
        };
        fetchImgList();

        let formLoaded = false;
        let hideTimeout = null;
        let isFormPinned = false;

        // 显示状态消息
        function showStatus(message, isError = false) {
            const statusDiv = document.getElementById('statusMessage');
            statusDiv.textContent = message;
            statusDiv.style.display = 'block';
            statusDiv.style.backgroundColor = isError ? '#ffeeee' : '#eeffee';
            statusDiv.style.color = isError ? '#cc0000' : '#007700';
            statusDiv.style.border = `1px solid ${isError ? '#cc0000' : '#007700'}`;
            console.log(`[状态] ${message}`);
        }

        // 显示浏览器通知
        function showBrowserNotification(title, body) {
            if (!("Notification" in window)) {
                console.log("此浏览器不支持桌面通知");
                showStatus(body || title, title.includes("失败")); // Fallback to status message
            } else if (Notification.permission === "granted") {
                new Notification(title, { body: body });
            } else if (Notification.permission !== "denied") {
                Notification.requestPermission().then(function (permission) {
                    if (permission === "granted") {
                        new Notification(title, { body: body });
                    } else {
                        showStatus(body || title, title.includes("失败")); // Fallback if permission denied
                    }
                });
            } else {
                showStatus(body || title, title.includes("失败")); // Fallback if permission denied
            }
        }

        // 创建隐藏的iframe用于POST请求
        function createHiddenIframe() {
            const existingIframe = document.getElementById('hiddenUploadFrame');
            if (existingIframe) return existingIframe;
            const iframe = document.createElement('iframe');
            iframe.id = 'hiddenUploadFrame';
            iframe.name = 'hiddenUploadFrame';
            iframe.style.display = 'none';
            document.body.appendChild(iframe);
            return iframe;
        }

        // 从上传结果页面中提取投票链接并自动投票
        function processUploadResult(iframe) {
            return new Promise((resolve, reject) => {
                iframe.onload = function() {
                    try {
                        const iframeDocument = iframe.contentDocument || iframe.contentWindow.document;
                        const allVoteLinks = iframeDocument.querySelectorAll('a[href*="/vote/cover/"]');
                        const voteLink = allVoteLinks.length > 0 ? allVoteLinks[allVoteLinks.length - 1] : null;
                        if (voteLink) {
                            const href = voteLink.getAttribute('href');
                            const host = window.location.host;
                            const voteUrl = href.startsWith('http') ? href : `https://${host}${href.startsWith('/') ? '' : '/'}${href}`;
                            showStatus('封面上传成功，正在投票...');

                            const xhr = new XMLHttpRequest();
                            xhr.open('GET', voteUrl, true);
                            xhr.withCredentials = true;
                            xhr.setRequestHeader('Accept', 'text/html');
                            xhr.setRequestHeader('Referer', window.location.href);

                            xhr.onload = function() {
                                if (xhr.status >= 200 && xhr.status < 300) {
                                    const successMsg = '投票成功！页面将在3秒后刷新...';
                                    showStatus(successMsg);
                                    showBrowserNotification("投票成功", "封面上传后的自动投票已成功，页面即将刷新。");
                                    setTimeout(() => window.location.reload(), 3000);
                                    resolve(true);
                                } else {
                                    const errorMsg = '封面上传成功，但投票失败。3秒后跳转到手动投票页面...';
                                    showStatus(errorMsg, true);
                                    showBrowserNotification("投票失败", "封面上传成功，但自动投票失败。将跳转到手动投票页面。");
                                    setTimeout(() => window.location.href = `${window.location.href.split('?')[0]}/upload_img`, 3000);
                                    reject(new Error(`投票请求失败，状态 ${xhr.status}`));
                                }
                            };
                            xhr.onerror = function() {
                                const errorMsg = '封面上传成功，但投票失败。3秒后跳转到手动投票页面...';
                                showStatus(errorMsg, true);
                                showBrowserNotification("投票失败", "封面上传成功，但网络错误导致自动投票失败。将跳转到手动投票页面。");
                                setTimeout(() => window.location.href = `${window.location.href.split('?')[0]}/upload_img`, 3000);
                                reject(new Error('XHR请求错误'));
                            };

                            xhr.send();
                        } else {
                            const errorMsgEl = iframeDocument.querySelector('.error, .errorMessage, [class*="error"]');
                            if (errorMsgEl) {
                                const errorText = `上传失败: ${errorMsgEl.textContent}，3秒后跳转到手动上传页面...`;
                                showStatus(errorText, true);
                                showBrowserNotification("上传失败", `${errorMsgEl.textContent} 将跳转到手动上传页面。`);
                                setTimeout(() => window.location.href = `${window.location.href.split('?')[0]}/upload_img`, 3000);
                                reject(new Error(errorMsgEl.textContent));
                            } else {
                                const warnMsg = '封面似乎已上传成功，但未找到投票链接。3秒后跳转到手动处理页面...';
                                showStatus(warnMsg, true);
                                showBrowserNotification("操作提醒", "封面已上传，但未找到投票链接。将跳转到手动处理页面。");
                                setTimeout(() => window.location.href = `${window.location.href.split('?')[0]}/upload_img`, 3000);
                                reject(new Error('未找到投票链接'));
                            }
                        }
                    } catch (error) {
                        const errorText = '处理上传结果时出错，3秒后跳转到手动上传页面...';
                        showStatus(errorText, true);
                        showBrowserNotification("处理错误", "处理上传结果时出错，将跳转到手动上传页面。");
                        setTimeout(() => window.location.href = `${window.location.href.split('?')[0]}/upload_img`, 3000);
                        reject(error);
                    }
                };
                iframe.onerror = function(error) {
                    const errorText = '上传请求失败，3秒后跳转到手动上传页面...';
                    showStatus(errorText, true);
                    showBrowserNotification("上传失败", "上传请求失败，将跳转到手动上传页面。");
                    setTimeout(() => window.location.href = `${window.location.href.split('?')[0]}/upload_img`, 3000);
                    reject(new Error('上传请求失败'));
                };
            });
        }

        // 修改表单提交处理函数，使用iframe提交
        function setupFormForIframeSubmission(form) {
            const iframe = createHiddenIframe();
            form.target = 'hiddenUploadFrame';
            form.addEventListener('submit', function(e) {
                showStatus('正在上传封面...');
                processUploadResult(iframe).catch(error => console.error('处理上传结果失败:', error));
            });
        }

        // 优化的图片转换函数
        async function convertImageFormat(file) {
            return new Promise((resolve, reject) => {
                const reader = new FileReader();
                reader.onload = (e) => {
                    const img = new Image();
                    img.onload = () => {
                        const fileType = file.type.toLowerCase();
                        let hasTransparency = false;
                        let finalFormat;
                        const canvas = document.createElement('canvas');
                        canvas.width = img.width;
                        canvas.height = img.height;
                        const ctx = canvas.getContext('2d');
                        ctx.drawImage(img, 0, 0);
                        try {
                            const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
                            const pixels = imageData.data;
                            for (let i = 3; i < pixels.length; i += 4) {
                                if (pixels[i] < 255) {
                                    hasTransparency = true;
                                    break;
                                }
                            }
                        } catch (e) {
                            console.warn("无法检查透明度，默认使用原格式", e);
                        }
                        if (hasTransparency) {
                            finalFormat = 'image/png';
                        } else if (fileType.includes('png') && !hasTransparency) {
                            finalFormat = 'image/jpeg';
                        } else {
                            finalFormat = fileType.includes('jpeg') || fileType.includes('jpg')
                                ? 'image/jpeg'
                            : fileType.includes('png')
                                ? 'image/png'
                            : 'image/jpeg';
                        }
                        canvas.width = img.width;
                        canvas.height = img.height;
                        const newCtx = canvas.getContext('2d');
                        if (finalFormat === 'image/jpeg') {
                            newCtx.fillStyle = '#FFFFFF';
                            newCtx.fillRect(0, 0, canvas.width, canvas.height);
                        }
                        newCtx.drawImage(img, 0, 0);
                        const quality = finalFormat === 'image/jpeg' ? 0.92 : undefined;
                        canvas.toBlob((blob) => {
                            if (!blob) {
                                reject(new Error('转换图片失败'));
                                return;
                            }
                            const ext = finalFormat === 'image/png' ? 'png' : 'jpg';
                            const newFileName = file.name.split('.')[0] + '.' + ext;
                            const convertedFile = new File([blob], newFileName, { type: finalFormat });
                            resolve({
                                file: convertedFile,
                                dataURL: canvas.toDataURL(finalFormat, quality),
                                format: finalFormat.split('/')[1]
                            });
                        }, finalFormat, quality);
                    };
                    img.onerror = () => reject(new Error('加载图片失败'));
                    img.src = e.target.result;
                };
                reader.onerror = () => reject(new Error('读取文件失败'));
                reader.readAsDataURL(file);
            });
        }

        // 图片下载和转换函数 - 优化版本，支持多种下载策略
        async function downloadAndConvertImage(imageUrl) {
            try {
                let actualImageUrl = imageUrl;
                if (imageUrl.includes('google.com/imgres')) {
                    const urlParams = new URL(imageUrl).searchParams;
                    actualImageUrl = urlParams.get('imgurl');
                }
                if (!actualImageUrl) actualImageUrl = imageUrl;

                showStatus('正在下载图片...');

                // 策略1: 尝试使用 Image 对象加载（适用于大多数图片）
                const downloadViaImageObject = (url) => {
                    return new Promise((resolve, reject) => {
                        const img = new Image();
                        img.crossOrigin = 'anonymous';

                        img.onload = () => {
                            try {
                                const canvas = document.createElement('canvas');
                                canvas.width = img.width;
                                canvas.height = img.height;
                                const ctx = canvas.getContext('2d');
                                ctx.drawImage(img, 0, 0);

                                canvas.toBlob((blob) => {
                                    if (blob) {
                                        const fileName = url.split('/').pop()?.split('?')[0] || 'image.jpg';
                                        const file = new File([blob], fileName, { type: blob.type || 'image/jpeg' });
                                        resolve(file);
                                    } else {
                                        reject(new Error('转换为Blob失败'));
                                    }
                                }, 'image/jpeg', 0.92);
                            } catch (error) {
                                reject(error);
                            }
                        };

                        img.onerror = () => reject(new Error('Image对象加载失败'));
                        img.src = url;
                    });
                };

                // 策略2: 使用 fetch (适用于同源或支持CORS的图片)
                const downloadViaFetch = async (url) => {
                    const response = await fetch(url, { mode: 'cors' });
                    if (!response.ok) throw new Error(`HTTP ${response.status}`);
                    const blob = await response.blob();
                    const fileName = url.split('/').pop()?.split('?')[0] || 'image.jpg';
                    return new File([blob], fileName, { type: blob.type });
                };

                // 策略3: 使用代理服务 (最后手段，适用于严格CORS限制的图片)
                const downloadViaProxy = async (url) => {
                    const proxyUrl = `https://images.weserv.nl/?url=${encodeURIComponent(url)}`;
                    return downloadViaImageObject(proxyUrl);
                };

                let tempFile = null;
                let downloadMethod = '';

                // 依次尝试各种下载策略
                try {
                    tempFile = await downloadViaImageObject(actualImageUrl);
                    downloadMethod = 'Image对象';
                } catch (error1) {
                    console.log('Image对象下载失败，尝试fetch...', error1);
                    try {
                        tempFile = await downloadViaFetch(actualImageUrl);
                        downloadMethod = 'Fetch API';
                    } catch (error2) {
                        console.log('Fetch下载失败，尝试代理服务...', error2);
                        try {
                            tempFile = await downloadViaProxy(actualImageUrl);
                            downloadMethod = '代理服务';
                        } catch (error3) {
                            throw new Error('所有下载方式均失败，请检查图片URL或网络连接');
                        }
                    }
                }

                console.log(`图片下载成功，使用方法: ${downloadMethod}`);
                showStatus('正在优化图片格式...');

                const convertedData = await convertImageFormat(tempFile);
                const previewContainer = document.querySelector("#imagePreviewContainer");
                const previewImage = document.querySelector("#imagePreview");
                previewImage.src = convertedData.dataURL;
                previewContainer.style.display = "block";

                const fileInput = document.querySelector("#coverUploadForm input[type='file']");
                if (fileInput) {
                    const dataTransfer = new DataTransfer();
                    dataTransfer.items.add(convertedData.file);
                    fileInput.files = dataTransfer.files;
                    const event = new Event('change', { bubbles: true });
                    fileInput.dispatchEvent(event);
                    const submitButton = document.querySelector("#coverUploadForm input[type='submit']");
                    if (submitButton) submitButton.style.display = 'block';
                    showStatus(`图片已优化为 ${convertedData.format.toUpperCase()} 格式，点击提交按钮上传`);
                } else {
                    showStatus('未找到文件上传输入框', true);
                }
            } catch (error) {
                console.error('下载或转换图片时发生错误:', error);
                showStatus(`下载图片失败：${error.message}`, true);
            }
        }

        // 全局点击事件
        function setupGlobalClickHandler(container, trigger) {
            document.addEventListener('click', function (event) {
                if (!container.contains(event.target) && !trigger.contains(event.target)) {
                    container.style.display = "none";
                    isFormPinned = false;
                }
            });
        }

        // 预先加载本地上传表单
        async function preloadLocalUpload() {
            if (formLoaded) return;
            const uploadFormContainer = formContainer.querySelector("#uploadFormContainer");
            uploadFormContainer.innerHTML = "加载中...";
            try {
                const uploadUrl = `https://${window.location.host}/${parsedInfo.type}/${parsedInfo.id}/upload_img`;
                const res = await fetch(uploadUrl);
                const doc = new DOMParser().parseFromString(await res.text(), "text/html");
                const form = doc.querySelector("form[enctype='multipart/form-data']");
                if (form) {
                    form.id = "coverUploadForm";
                    form.style.margin = "0";
                    form.style.padding = "0";
                    uploadFormContainer.innerHTML = form.outerHTML;
                    const insertedForm = document.getElementById("coverUploadForm");
                    setupFormForIframeSubmission(insertedForm);
                    const fileInput = document.querySelector("#coverUploadForm input[type='file']");
                    fileInput.addEventListener('change', async (e) => {
                        const file = e.target.files[0];
                        if (file) {
                            try {
                                showStatus('正在处理图片...');
                                const convertedData = await convertImageFormat(file);
                                const dataTransfer = new DataTransfer();
                                dataTransfer.items.add(convertedData.file);
                                fileInput.files = dataTransfer.files;
                                const previewContainer = formContainer.querySelector("#imagePreviewContainer");
                                const previewImage = formContainer.querySelector("#imagePreview");
                                previewImage.src = convertedData.dataURL;
                                previewContainer.style.display = "block";
                                const submitButton = document.querySelector("#coverUploadForm input[type='submit']");
                                if (submitButton) submitButton.style.display = 'block';
                                showStatus(`图片已优化为 ${convertedData.format.toUpperCase()} 格式，点击提交按钮上传`);
                            } catch (error) {
                                console.error('处理本地图片失败:', error);
                                showStatus(`处理图片失败: ${error.message}`, true);
                                const reader = new FileReader();
                                reader.onload = (ev) => {
                                    const previewContainer = formContainer.querySelector("#imagePreviewContainer");
                                    const previewImage = formContainer.querySelector("#imagePreview");
                                    previewImage.src = ev.target.result;
                                    previewContainer.style.display = "block";
                                    showStatus('使用原始格式，点击提交按钮上传');
                                };
                                reader.readAsDataURL(file);
                            }
                        }
                    });
                    formLoaded = true;
                } else {
                    uploadFormContainer.innerHTML = "无法加载上传表单";
                    showStatus("无法加载上传表单", true);
                }
            } catch (e) {
                uploadFormContainer.innerHTML = "加载失败";
                showStatus("加载上传表单失败", true);
                console.error("上传模块加载失败:", e);
            }
        }

        // 事件绑定逻辑
        const setupEventHandlers = () => {
            const urlInput = formContainer.querySelector("#imageUrlInput");
            const downloadButton = formContainer.querySelector("#downloadUrlButton");
            const showForm = () => {
                clearTimeout(hideTimeout);
                const buttonRect = uploadLi.getBoundingClientRect();
                formContainer.style.top = `${buttonRect.bottom + window.scrollY + 5}px`;
                formContainer.style.left = `${buttonRect.left + window.scrollX - 180}px`;
                formContainer.style.display = "block";
            };
            const hideForm = () => {
                if (isFormPinned) return;
                const previewContainer = formContainer.querySelector("#imagePreviewContainer");
                const statusMessage = formContainer.querySelector("#statusMessage");
                if (previewContainer.style.display === "block" || statusMessage.style.display === "block") return;
                hideTimeout = setTimeout(() => {
                    if (!formContainer.matches(":hover") && !isFormPinned) {
                        formContainer.style.display = "none";
                    }
                }, 200);
            };
            uploadLi.addEventListener("click", () => {
                showForm();
                isFormPinned = true;
                console.log("表单已固定，鼠标移出不会自动关闭");
            });
            uploadLi.addEventListener("mouseenter", showForm);
            uploadLi.addEventListener("mouseleave", () => {
                if (!isFormPinned) hideForm();
            });
            formContainer.addEventListener("mouseenter", () => clearTimeout(hideTimeout));
            formContainer.addEventListener("mouseleave", () => {
                if (!isFormPinned) hideForm();
            });
            urlInput.addEventListener('focus', () => {
                urlInput.style.borderColor = '#F4C7CC';
                urlInput.style.boxShadow = '0 0 5px rgba(244, 199, 204, 0.5)';
            });
            urlInput.addEventListener('blur', () => {
                urlInput.style.borderColor = '#ddd';
                urlInput.style.boxShadow = 'none';
            });
            downloadButton.addEventListener('click', () => {
                const imageUrl = urlInput.value.trim();
                if (imageUrl) downloadAndConvertImage(imageUrl);
                else showStatus('请输入图片 URL', true);
            });
            urlInput.addEventListener('keypress', (e) => {
                if (e.key === 'Enter') downloadButton.click();
            });
        };

        setupGlobalClickHandler(formContainer, uploadLi);
        preloadLocalUpload();
        setupEventHandlers();
    }

    // MutationObserver 保证上传按钮始终存在
    const observer = new MutationObserver(() => {
        if (!document.querySelector("#coverUploadButton")) {
            initCoverUpload();
        }
    });
    observer.observe(document.body, { childList: true, subtree: true });

    // 确保在脚本开始时检查通知权限
    if (Notification.permission === "default") {
        Notification.requestPermission();
    }


    /* =============
      批量关联增强版
     =============== */
    async function initBatchRelation() {
        injectStyles();

        // 参数配置
        const DELAY_AFTER_CLICK = 150;
        const DELAY_BETWEEN_ITEMS = 300;
        const MAX_RETRY_ATTEMPTS = 10;
        const RETRY_INTERVAL = 100;

        // 全局变量
        let globalItemType = '1';
        let currentProcessingIndex = -1;
        // 添加全局设置变量
        let enableExistingRelationCheck = false;

        // 根据当前 URL 判断页面类型和关联类型
        function getCurrentPageInfo() {
            const path = window.location.pathname;

            if (/^\/character\/\d+\/add_related\/character/.test(path)) {
                return { pageType: 'character', relationType: 'character_relation' };
            }
            if (/^\/character\/\d+\/add_related\/anime/.test(path)) {
                return { pageType: 'character', relationType: 'character_anime' };
            }
            if (/^\/person\/\d+\/add_related\/person/.test(path)) {
                return { pageType: 'person', relationType: 'person_relation' };
            }
            if (/^\/subject\/\d+\/add_related\/person/.test(path)) {
                return { pageType: 'subject', relationType: 'subject_person' };
            }
            if (/^\/subject\/\d+\/add_related\/character/.test(path)) {
                return { pageType: 'subject', relationType: 'subject_character' };
            }
            if (/^\/subject\/\d+\/add_related\//.test(path)) {
                return { pageType: 'subject', relationType: 'subject_relation' };
            }

            return { pageType: 'person', relationType: 'person' };
        }

        // 获取关联类型列表（简化逻辑，根据页面类型优先尝试不同全局变量或函数）
        function getTypeList() {
            const { pageType } = getCurrentPageInfo();

            if (pageType === 'subject') {
                // 优先 crtTypeList（数组或对象），否则 prsnStaffList 函数
                if (typeof crtTypeList !== 'undefined') {
                    return crtTypeList;
                } else if (typeof genPrsnStaffList === 'function') {
                    return genPrsnStaffList(-1);
                }
            } else if (pageType === 'character') {
                // 优先 crtTypeList（数组或对象），否则 crtRelationList
                if (typeof crtTypeList !== 'undefined') {
                    return crtTypeList;
                } else if (typeof crtRelationList !== 'undefined' && Array.isArray(crtRelationList)) {
                    return crtRelationList;
                }
            } else if (pageType === 'person') {
                // 优先 crtTypeList（数组或对象），否则 crtRelationList
                if (typeof crtTypeList !== 'undefined') {
                    return crtTypeList;
                } else if (typeof crtRelationList !== 'undefined' && Array.isArray(crtRelationList)) {
                    return crtRelationList;
                }
            }

            return null; // 无可用列表
        }

        // 生成关联类型选择下拉框（显示所有内容，无前缀）
        function generateTypeSelector() {
            const typeList = getTypeList();
            let options = '';

            if (typeList) {
                if (Array.isArray(typeList)) {
                    // 处理数组结构（如 crtTypeList 或 crtRelationList）
                    typeList.forEach(type => {
                        // 收集所有可用的字段
                        const fields = [];
                        if (type.cn) fields.push(type.cn);
                        if (type.en) fields.push(type.en);
                        if (type.jp) fields.push(type.jp);
                        if (type.desc) fields.push(type.desc);
                        // 如果没有字段，使用 ID 作为默认显示
                        const displayName = fields.length > 0 ? fields.join(' | ') : type.id;
                        options += `<option value="${type.id}">${displayName}</option>`;
                    });
                } else if (typeof typeList === 'object') {
                    // 处理对象结构（如 crtTypeList 对象）
                    Object.entries(typeList).forEach(([id, name]) => {
                        options += `<option value="${id}">${name}</option>`;
                    });
                } else if (typeof typeList === 'string') {
                    // 如果是 genPrsnStaffList 返回的 HTML 字符串，直接返回
                    return `<span class="select-label"></span>${typeList}`;
                }
            }

            // 无选项时回退
            if (!options) {
                return `<span class="select-label"></span><select><option value="-999">类型选择器不可用</option></select>`;
            }

            return `<span class="select-label"></span><select style="width:180px;">${options}</select>`;
        }

        // 根据页面类型设定 UI 标题
        function getTypeText() {
            const url = window.location.href;

            // 检查是否在人物/角色页面添加条目关联
            if (url.match(/\/(person|character)\/\d+\/add_related\/\w+$/)) {
                if (url.match(/\/person\/\d+\/add_related\/person/)) {
                    return '人物';
                } else if (url.match(/\/character\/\d+\/add_related\/character/)) {
                    return '角色';
                }
                return '条目';
            }

            // 检查是否在条目添加人物或角色关联页面
            if (url.match(/\/subject\/\d+\/add_related\/person/)) {
                return '人物';
            }
            if (url.match(/\/subject\/\d+\/add_related\/character/)) {
                return '角色';
            }

            // 默认情况
            const { pageType } = getCurrentPageInfo();
            if (pageType === 'character') {
                return '角色';
            } else if (pageType === 'subject') {
                return '条目';
            } else {
                return '人物';
            }
        }

        // 针对传入的元素内的下拉框进行设置，并通过递归确保修改成功
        function setRelationTypeWithElement($li, item_type) {
            return new Promise((resolve) => {
                let attempts = 0;
                function trySet() {
                    // 确保我们获取的是当前元素内部的select，而不是全局的
                    let $select = $li.find('select').first();

                    if ($select.length > 0) {
                        // 先确保下拉框可交互
                        if ($select.prop('disabled')) {
                            setTimeout(trySet, RETRY_INTERVAL);
                            return;
                        }

                        $select.val(item_type);
                        // 触发 change 事件
                        const event = new Event('change', { bubbles: true });
                        $select[0].dispatchEvent(event);

                        setTimeout(() => {
                            if ($select.val() == item_type) {
                                resolve(true);
                            } else if (attempts < MAX_RETRY_ATTEMPTS) {
                                attempts++;
                                setTimeout(trySet, RETRY_INTERVAL);
                            } else {
                                resolve(false);
                            }
                        }, 200);
                    } else if (attempts < MAX_RETRY_ATTEMPTS) {
                        attempts++;
                        setTimeout(trySet, RETRY_INTERVAL);
                    } else {
                        resolve(false);
                    }
                }
                trySet();
            });
        }

        // 修改 checkAndHandleExistingRelation 函数
        function checkAndHandleExistingRelation(search_name, item_id, item_type) {
            return new Promise(async (resolve) => {
                // 如果开关关闭，直接返回未关联状态
                if (!enableExistingRelationCheck) {
                    resolve({ exists: false });
                    return;
                }

                // 获取所有已关联条目的容器
                const relatedContainer = document.querySelector('#crtRelateSubjects');
                if (!relatedContainer) {
                    resolve({ exists: false });
                    return;
                }

                // 原有的检查逻辑保持不变...
                const relatedItems = relatedContainer.querySelectorAll('li');
                for (const item of relatedItems) {
                    // 检查条目ID是否匹配 - 从URL中提取ID
                    const itemLink = item.querySelector('a[href*="/subject/"], a[href*="/character/"], a[href*="/person/"]');
                    if (!itemLink) continue;

                    const urlMatch = itemLink.href.match(/\/(subject|character|person)\/(\d+)/);
                    if (!urlMatch || urlMatch[2] !== item_id.toString()) continue;

                    // 找到匹配的已关联条目，检查并更新类型
                    const $select = $(item).find('select').first();
                    if ($select.length > 0) {
                        const currentType = $select.val();

                        if (currentType !== item_type) {
                            // 类型不同，需要更新
                            const success = await setRelationTypeWithElement($(item), item_type);
                            if (success) {
                                $('.Relation_item_type_changed').append(`${search_name} `);
                                resolve({ exists: true, typeChanged: true });
                                return;
                            }
                        } else {
                            // 类型相同，无需更新
                            $('.Relation_item_unchanged').append(`${search_name} `);
                            resolve({ exists: true, typeChanged: false });
                            return;
                        }
                    }
                }

                // 未找到匹配的已关联条目
                resolve({ exists: false });
            });
        }

        // 点击项目后利用 MutationObserver 监听新增条目，然后对该条目的下拉框设置类型
        function processItem(element, item_type, item_id, search_name) {
            return new Promise(async (resolve) => {
                // 先检查条目是否已关联
                const existingCheck = await checkAndHandleExistingRelation(search_name, item_id, item_type);
                if (existingCheck.exists) {
                    return resolve(true); // 已处理完毕，无需继续
                }

                // 条目未关联，进行新增操作
                // 关联列表容器
                const container = document.querySelector('#crtRelateSubjects');
                if (!container) {
                    return resolve(false);
                }
                // 保存处理前的条目列表
                const initialItems = Array.from(container.children);
                // 绑定 MutationObserver 监听子节点变化
                const observer = new MutationObserver((mutations) => {
                    // 获取当前所有条目
                    const currentItems = Array.from(container.children);
                    // 找出新增的条目（在当前列表中但不在初始列表中的元素）
                    const newItems = currentItems.filter(item => !initialItems.includes(item));

                    if (newItems.length > 0) {
                        observer.disconnect();
                        const newItem = newItems[0]; // 获取第一个新增条目

                        // 确保等待DOM完全渲染
                        setTimeout(async () => {
                            // 使用新的条目元素直接查找其内部的select
                            const $select = $(newItem).find('select');

                            if ($select.length > 0) {
                                const success = await setRelationTypeWithElement($(newItem), item_type);
                                resolve(success);
                            } else {
                                resolve(false);
                            }
                        }, DELAY_AFTER_CLICK);
                    }
                });

                observer.observe(container, { childList: true, subtree: true });
                // 触发点击
                $(element).click();
                // 超时防护
                setTimeout(() => {
                    observer.disconnect();
                    resolve(false);
                }, MAX_RETRY_ATTEMPTS * RETRY_INTERVAL);
            });
        }

        // 处理搜索结果不唯一且没有完全匹配项则自动选择第一个
        function normalizeText(text) {
            return text.normalize("NFC").replace(/\s+/g, '').replace(/[\u200B-\u200D\uFEFF]/g, '').trim();
        }

        function extractTextFromElement(el) {
            if (!el) return '';
            let text = el.innerText || el.textContent || $(el).text();
            // 尝试从 `iframe` 和 `shadowRoot` 获取文本
            if (!text.trim()) {
                if (el.shadowRoot) {
                    text = [...el.shadowRoot.querySelectorAll('*')].map(e => e.textContent).join('');
                }
                let iframe = el.querySelector('iframe');
                if (iframe && iframe.contentDocument) {
                    text = iframe.contentDocument.body.textContent;
                }
            }
            return normalizeText(text);
        }

        async function processSingleItem(elements, item_type, search_name) {
            return new Promise(async (resolve) => {
                if (elements.length === 0) {
                    $('.Relation_item_not_found').append(search_name + ' ');
                    resolve(false);
                    return;
                }
                let elementsArray = elements.toArray();
                let normalizedSearchName = normalizeText(search_name);

                console.log("搜索名（规范化）：", normalizedSearchName);

                // 等待元素加载，避免空文本
                await new Promise(res => setTimeout(res, 500));
                let selectedElement = elementsArray.find(el => {
                    let normalizedElementText = extractTextFromElement(el);
                    console.log("元素文本（规范化）：", normalizedElementText); // 调试用
                    return normalizedElementText === normalizedSearchName;
                });

                if (!selectedElement) {
                    if (elements.length > 1) {
                        $('.Relation_item_dupe').append(`${search_name} `);
                    }
                    selectedElement = elements[0]; // 没有完全匹配，取第一个
                }

                // 提取条目ID
                let item_id = null;
                const itemHref = $(selectedElement).attr('href');
                const idMatch = itemHref && itemHref.match(/\/(subject|character|person)\/(\d+)/);
                if (idMatch) {
                    item_id = idMatch[2];
                }

                resolve(await processItem(selectedElement, item_type, item_id, search_name));
            });
        }

        // 处理下一个项目
        async function proceedToNextItem(idx, item_list, item_type, item_num) {
            if (idx < item_num - 1) {
                setTimeout(async () => {
                    await ctd_findItemFunc(item_list, item_type, idx + 1);
                }, DELAY_BETWEEN_ITEMS);
            } else {
                setTimeout(() => {
                    $('#subjectList').empty();
                    $('#subjectList').show();
                    alert('全部添加完成');
                }, DELAY_BETWEEN_ITEMS);
            }
        }

        // 核心查找及处理函数：依次检索每个条目并处理
        var ctd_findItemFunc = async function(item_list, item_type, idx) {
            currentProcessingIndex = idx;
            item_type = globalItemType;
            let search_name = item_list[idx].trim();
            if (!search_name) {
                proceedToNextItem(idx, item_list, item_type, item_list.length);
                return;
            }
            var item_num = item_list.length;
            $('#subjectList').html('<tr><td>正在检索中...</td></tr>');
            var search_mod = $('#sbjSearchMod').attr('value');
            try {
                const response = await new Promise((resolve, reject) => {
                    $.ajax({
                        type: "GET",
                        url: '/json/search-' + search_mod + '/' + encodeURIComponent(search_name),
                        dataType: 'json',
                        success: resolve,
                        error: reject
                    });
                });
                var html = '';
                if ($(response).length > 0) {
                    subjectList = response;
                    for (var i in response) {
                        if ($.inArray(search_mod, enableStaffSbjType) != -1) {
                            html += genSubjectList(response[i], i, 'submitForm');
                        } else {
                            html += genSubjectList(response[i], i, 'searchResult');
                        }
                    }
                    $('#subjectList').html(html);
                    $('.Relation_current_idx').text(idx + 1);
                    $('.Relation_all_num').text(item_num);
                    await new Promise(resolve => setTimeout(resolve, 400)); // 减少等待时间
                    var elements = $('#subjectList>li>a.avatar.h');
                    if (window.location.pathname.includes('/person/') && window.location.pathname.includes('/add_related/character/anime')) {
                        if (elements.length === 0) {
                            $('.Relation_item_not_found').append(search_name + ' ');
                        } else {
                            // 提取条目ID
                            let item_id = null;
                            const itemHref = $(elements[0]).attr('href');
                            const idMatch = itemHref && itemHref.match(/\/(subject|character|person)\/(\d+)/);
                            if (idMatch) {
                                item_id = idMatch[2];
                            }

                            // 检查是否已关联
                            const existingCheck = await checkAndHandleExistingRelation(search_name, item_id, item_type);
                            if (!existingCheck.exists) {
                                $(elements[0]).click();
                            }

                            if (elements.length > 1) {
                                $('.Relation_item_dupe').append(`${search_name} `);
                            }
                        }

                        $('.Relation_current_idx').text(idx + 1);
                        if (idx < item_num - 1) {
                            setTimeout(async () => {
                                await ctd_findItemFunc(item_list, item_type, idx + 1);
                            }, DELAY_BETWEEN_ITEMS);
                        } else {
                            setTimeout(() => {
                                $('#subjectList').empty();
                                $('#subjectList').show();
                                alert('全部添加完成');
                            }, DELAY_BETWEEN_ITEMS);
                        }
                    } else {
                        await processSingleItem(elements, item_type, search_name, idx, item_list, item_num);
                        await proceedToNextItem(idx, item_list, item_type, item_num);
                    }
                } else {
                    $("#robot").fadeIn(300);
                    $("#robot_balloon").html(`没有找到 ${search_name} 的相关结果`);
                    $("#robot").animate({ opacity: 1 }, 500).fadeOut(500); // 减少动画时间
                    $('.Relation_item_not_found').append(search_name + ' ');
                    $('#subjectList').html(html);
                    $('.Relation_current_idx').text(idx + 1);
                    $('.Relation_all_num').text(item_num);
                    await proceedToNextItem(idx, item_list, item_type, item_num);
                }
            } catch (error) {
                console.error('查询出错:', error);
                $("#robot").fadeIn(300);
                $("#robot_balloon").html('通信错误，您是不是重复查询太快了？');
                $("#robot").animate({ opacity: 1 }, 500).fadeOut(1000); // 减少动画时间
                $('#subjectList').html('');
                setTimeout(async () => {
                    if (idx < item_list.length - 1) {
                        await ctd_findItemFunc(item_list, item_type, idx + 1);
                    } else {
                        $('#subjectList').empty();
                        $('#subjectList').show();
                        alert('全部添加完成');
                    }
                }, 1500); // 减少等待时间
            }
        };

        // 增强的解析函数：支持多种ID分隔和准确搜索
        function parsePersonInput(input) {
            input = input.trim();
            // 支持URL格式
            const urlMatch = input.match(/(?:bgm\.tv|bangumi\.tv|chii\.in)\/(?:person|character|subject)\/(\d+)/i);
            if (urlMatch) return urlMatch[1];
            // 提取纯数字ID - 每次只返回一个ID
            const numberMatch = input.match(/^\d+$/);
            if (numberMatch) return numberMatch[0];
            // 支持姓名直接搜索
            if (/^[\u4e00-\u9fa5a-zA-Z0-9\s]+$/.test(input)) {
                return encodeURIComponent(input);
            }
            return input; // 如果无法识别，返回原始输入
        }

        // 从ID范围中提取ID列表
        function getIDsFromRange(start, end) {
            const startID = parseInt(start, 10);
            const endID = parseInt(end, 10);
            if (isNaN(startID) || isNaN(endID) || startID > endID) {
                alert("ID范围无效");
                return [];
            }
            return Array.from({ length: endID - startID + 1 }, (_, i) => "bgm_id=" + (startID + i));
        }

        const numberMap = {
            '0': '零', '1': '一', '2': '二', '3': '三', '4': '四', '5': '五',
            '6': '六', '7': '七', '8': '八', '9': '九', '10': '十',
            'Ⅰ': '一', 'Ⅱ': '二', 'Ⅲ': '三', 'Ⅳ': '四', 'Ⅴ': '五',
            'Ⅵ': '六', 'Ⅶ': '七', 'Ⅷ': '八', 'Ⅸ': '九', 'Ⅹ': '十'
        };

        // 修改后的 normalizeSeasonOrEpisode 函数
        function normalizeSeasonOrEpisode(text) {
            text = text.replace(/\s+/g, '');
            // 如果完全由数字组成，则直接返回原文本
            if (/^\d+$/.test(text)) return text;

            // 处理带数字的情况（包括直接的数字转换）
            const numberMatch = text.match(/(\d+)季$/);
            if (numberMatch) {
                const number = numberMatch[1];
                const chineseNumber = numberMap[number] || number;
                return text.replace(/\d+季$/, `${chineseNumber}季`);
            }

            // 处理原有的罗马数字模式
            const romanMatch = text.match(/[^\d]([ⅠⅡⅢⅣⅤⅥⅦⅧⅨⅩ])$/);
            if (romanMatch) {
                const romanNumber = romanMatch[1];
                const chineseNumber = numberMap[romanNumber];
                return text.replace(/[ⅠⅡⅢⅣⅤⅥⅦⅧⅨⅩ]$/, `${chineseNumber}季`);
            }

            // 新增：处理"标题 数字"格式
            const simpleTitleNumberMatch = text.match(/(.+?)(\d+)$/);
            if (simpleTitleNumberMatch) {
                const title = simpleTitleNumberMatch[1];
                const number = simpleTitleNumberMatch[2];
                const chineseNumber = numberMap[number] || number;
                return `${title}第${chineseNumber}季`;
            }
            return text;
        }

        // 修改后的 getIDsFromText 函数
        function getIDsFromText(input) {
            input = input.trim();
            if (!input) {
                alert("请输入ID或内容");
                return [];
            }

            // 先识别 URL 形式的 ID
            const urlPattern = /(bgm\.tv|bangumi\.tv|chii\.in)\/(subject|character|person)\/(\d+)/g;
            const urlMatches = [...input.matchAll(urlPattern)].map(m => m[3]);
            if (urlMatches.length > 0) {
                return urlMatches.map(id => "bgm_id=" + id);
            }

            // 如果以 "bgm_id=" 开头，则去掉前缀后进行分割，使用 /[^0-9]+/ 作为分隔符
            if (input.startsWith("bgm_id=")) {
                return input.substring(7)
                    .split(/[^0-9]+/)
                    .filter(token => token)
                    .map(token => "bgm_id=" + token);
            }

            // 否则先按标点和各种分隔符拆分，再进行标准化和数字提取
            return input.split(/[,\n\r，、\/|;。.()【】<>!?]+/)
                .map(part => part.trim())
                .filter(part => part.length > 0)
                .map(normalizeSeasonOrEpisode)
                .map(part => {
                // 处理纯数字ID（此时 normalizeSeasonOrEpisode 不会修改纯数字）
                const numberMatch = part.match(/\b\d+\b/);
                if (numberMatch) {
                    return "bgm_id=" + numberMatch[0];
                }
                return part;
            })
                .filter(part => part);
        }

        // 批量查找入口函数
        var Relation_MultiFindItemFunc = async function() {
            let item_type = '1';
            let typeSelector = $('.Relation_item_type select');
            if (typeSelector.length > 0) {
                item_type = typeSelector.val();
                if (item_type == '-999') {
                    alert('请先选择关联类型');
                    return false;
                }
                globalItemType = item_type;
            }

            let ctd_item_list = [];
            const activeTab = $('.tab-panel.active').attr('id');
            if (activeTab === 'tab-text') {
                // 处理文本输入模式
                const inputVal = $('#custom_ids').val().trim();
                ctd_item_list = getIDsFromText(inputVal);
            } else if (activeTab === 'tab-range') {
                // 处理ID范围模式
                const startID = $('#id_start').val().trim();
                const endID = $('#id_end').val().trim();
                ctd_item_list = getIDsFromRange(startID, endID);
            }
            if (ctd_item_list.length === 0) {
                return false;
            }

            $('#subjectList').hide();
            $('.Relation_item_not_found').empty();
            $('.Relation_item_dupe').empty();
            $('.Relation_item_type_changed').empty();
            $('.Relation_item_unchanged').empty();
            $('.Relation_current_idx').text('0');
            $('.Relation_all_num').text(ctd_item_list.length);

            currentProcessingIndex = -1;
            await ctd_findItemFunc(ctd_item_list, item_type, 0);
        };

        // 切换标签页
        function switchTab(tabId) {
            $('.tab-nav button').removeClass('active');
            $(`.tab-nav button[data-tab="${tabId}"]`).addClass('active');
            $('.tab-panel').removeClass('active');
            $(`#${tabId}`).addClass('active');
        }

        let uiTitle = getTypeText();

        // 创建改进的UI界面
        $('.subjectListWrapper').after(`
      <div class="Relation_wrapper">
        <h2 style="color: #333333;">批量关联助手</h2>
        <div class="tab-nav">
          <button data-tab="tab-text" class="active">自由文本输入</button>
          <button data-tab="tab-range">ID范围输入</button>
        </div>

        <div id="tab-text" class="tab-panel active">
          <textarea id="custom_ids" class="enhancer-textarea"
            placeholder="输入ID/网址/名称（支持多种格式：bgm_id=xx、数字、网址、文本，支持除空格外的各种分隔符）"></textarea>
        </div>

        <div id="tab-range" class="tab-panel">
          <div class="flex-row" style="justify-content: center">
            <input id="id_start" type="number" min="0" placeholder="起始ID" class="input-number">
            <span style="line-height: 30px">～</span>
            <input id="id_end" type="number" min="0" placeholder="结束ID" class="input-number">
          </div>
        </div>

        <div class="Relation_controls" style="margin-top: 10px">
          <span class="Relation_item_type"></span>
          <button id="btn_ctd_multi_search" class="btnCustom">批量关联</button>
        </div>

        <div class="toggle-container" style="margin-top: 10px; display: flex; align-items: center;">
          <input type="checkbox" id="toggle_existing_check">
          <label for="toggle_existing_check" style="margin-left: 8px;">已关联${uiTitle}修改</label>
          <span class="toggle-description" style="margin-left: 8px; font-size: 12px; color: #666;">(取消勾选将不修改已关联项)</span>
        </div>

        <div class="Relation_progress">
          添加进度：<span class="Relation_current_idx">0</span>/<span class="Relation_all_num">0</span>
        </div>

        <div class="Relation_header">未找到的${uiTitle}：</div>
        <div class="Relation_item_not_found"></div>

        <div class="Relation_header">存在多结果的${uiTitle}（无最佳匹配结果，将自动选择第一个）：</div>
        <div class="Relation_item_dupe"></div>

        <div class="Relation_header">已修改类型的${uiTitle}：</div>
        <div class="Relation_item_type_changed"></div>

        <div class="Relation_header">无需修改类型的${uiTitle}：</div>
        <div class="Relation_item_unchanged"></div>
      </div>
    `);

        // 绑定开关事件
        $('#toggle_existing_check').on('change', function() {
            enableExistingRelationCheck = $(this).prop('checked');
            console.log("已关联条目检查功能:", enableExistingRelationCheck ? "已启用" : "已禁用");
        });

        // 添加关联类型选择器
        $('.Relation_item_type').append(generateTypeSelector());
        $('.Relation_item_type select').prepend('<option value="-999">请选择关联类型</option>').val('-999');

        // 绑定事件
        $('#btn_ctd_multi_search').on('click', Relation_MultiFindItemFunc);
        $('.Relation_item_type select').on('change', function() {
            globalItemType = $(this).val();
        });
        $('.tab-nav button').on('click', function() {
            switchTab($(this).data('tab'));
        });

        // 新增：结束ID输入框聚焦时自动填充
        $('#id_end').on('focus', function() {
            const currentEndValue = $(this).val().trim();
            const startValue = $('#id_start').val().trim();

            // 如果结束ID为空且起始ID有有效值
            if (!currentEndValue && startValue) {
                const startID = parseInt(startValue, 10);
                if (!isNaN(startID)) {
                    $(this).val(startID + 1);
                }
            }
        });
    }

    /* ===============
     批量添加章节模板
    ================== */
    const BatchEpisodeCreator = {
        // 初始化入口
        init() {
            // 检查是否为添加章节页面
            if (!this.isEpisodeCreatePage()) return;

            // 设置元素监听，等待页面 DOM 变化后执行
            this.setupElementObserver();

            // 检查目标元素
            this.checkTargetElement();
        },

        // 判断当前页面是否为添加章节页面
        isEpisodeCreatePage() {
            const pattern = /\/subject\/\d+\/ep\/create/;
            return pattern.test(window.location.href);
        },

        // 设置监听器，观察页面 DOM 变化
        setupElementObserver() {
            // 创建一个 MutationObserver，监听 DOM 变化
            this.observer = new MutationObserver(() => this.checkTargetElement());

            // 监听整个文档的变化，特别是子节点变化
            this.observer.observe(document.body, { childList: true, subtree: true });
        },

        // 检查目标元素是否存在
        checkTargetElement() {
            // 查找目标元素 div#batch，并检查其是否处于显示状态
            const targetElement = document.querySelector('div#batch[style*="display: block"]');

            // 如果目标元素存在，则添加批量创建界面
            if (targetElement) {
                this.addBatchCreationInterface();
            } else {
                // 如果目标元素不存在，移除已有的批量创建界面
                const existing = document.querySelector('.batch-creator-area');
                if (existing) existing.remove();
            }
        },

        // 添加批量创建界面
        addBatchCreationInterface() {
            // 如果批量创建界面已经存在，则不再重复添加
            if (document.querySelector('.batch-creator-area')) return;

            // 查找目标元素 div#batch，并确认其处于显示状态
            const targetElement = document.querySelector('div#batch[style*="display: block"]');
            if (!targetElement) return;

            // 创建批量添加区域的 HTML 内容
            const batchArea = document.createElement('div');
            batchArea.className = 'batch-creator-area Relation_wrapper';
            batchArea.innerHTML = `
            <h2 class="batch_header" style="margin-bottom: 20px;">批量添加章节</h2>
            <div class="batch-controls">
                <div class="flex-row" style="margin-bottom: 14px; gap: 12px; flex-wrap: wrap;">
                    <div class="flex-row" style="gap: 8px; align-items: center; width: 100%; justify-content: center;">
                        <input type="number" id="batch-start" min="1" value="" class="input-number" style="width: 65px">
                        <span> - </span>
                        <input type="number" id="batch-end" min="1" value="" class="input-number" style="width: 65px">
                    </div>
                    <div class="flex-row" style="gap: 8px; align-items: center; width: 100%; justify-content: center; margin-top: 8px;">
                        <label style="display: inline-flex; align-items: center; margin-right: 10px;">
                            <input type="radio" name="end-value-mode" value="auto" checked>
                            <span style="margin-left: 5px">自动输入</span>
                        </label>
                        <label style="display: inline-flex; align-items: center;">
                            <input type="radio" name="end-value-mode" value="manual">
                            <span style="margin-left: 5px">手动输入</span>
                        </label>
                    </div>
                    <div style="width: 100%; display: flex; justify-content: center; margin-top: 8px;">
                        <label class="flex-row" style="display: inline-flex; gap: 6px; align-items: center;">
                            <input type="checkbox" id="empty-content">
                            <span class="text-secondary">空内容模式</span>
                        </label>
                    </div>
                </div>
                <button type="button" id="generate-episodes" class="btnCustom" style="display: block; margin: 0 auto 10px auto;">生成模板</button>
            </div>
            <div class="batch-preview">
                <textarea id="batch-result" rows="5" class="enhancer-textarea" placeholder="生成的章节将显示在这里"></textarea>
                <div class="batch_controls" style="margin-top: 8px; display: flex; justify-content: center;">
                    <button type="button" id="apply-episodes" class="btnCustom">应用到表单</button>
                </div>
            </div>
        `;

            // 设置批量创建区域的样式
            batchArea.style.cssText = `
            width: 200px;
            margin-bottom: var(--margin-medium);
            padding: 18px;
            background: white;
        `;

            // 在指定位置插入批量创建区域
            const subjectInnerInfo = document.getElementById('subject_inner_info');
            if (subjectInnerInfo) {
                subjectInnerInfo.insertAdjacentElement('afterend', batchArea);
                batchArea.style.marginTop = 'var(--margin-medium)';
                batchArea.style.marginBottom = 'var(--margin-medium)';
            } else {
                console.warn('未找到 subject_inner_info 元素，已附加到body末尾');
                document.body.appendChild(batchArea);
            }

            // 绑定批量创建按钮事件
            this.bindBatchEvents();

            // 在输入框创建后绑定联动逻辑
            this.setupEndValueMode();
        },

        // 绑定批量创建按钮事件
        bindBatchEvents() {
            const generateBtn = document.getElementById('generate-episodes');
            const applyBtn = document.getElementById('apply-episodes');

            // 绑定生成按钮事件
            if (generateBtn) {
                generateBtn.addEventListener('click', () => this.generateEpisodes());
            } else {
                console.error('生成按钮未找到');
            }

            // 绑定应用按钮事件
            if (applyBtn) {
                applyBtn.addEventListener('click', () => this.applyToForm());
            } else {
                console.error('应用按钮未找到');
            }
        },

        // 生成章节模板
        generateEpisodes() {
            const start = parseInt(document.getElementById('batch-start').value) || 1;
            const end = parseInt(document.getElementById('batch-end').value) || 20;
            const isEmpty = document.getElementById('empty-content').checked;

            // 校验起始数字是否大于结束数字
            if (start > end) {
                alert('起始数字不能大于结束数字');
                return;
            }

            // 当生成章节数过多时进行确认
            if (end - start >= 100) {
                if (!confirm(`您将生成 ${end - start + 1} 个章节，确定继续吗？`)) return;
            }

            // 生成章节内容
            let result = '';
            for (let i = start; i <= end; i++) {
                result += isEmpty
                    ? `${i}| | | |\n`
                : `${i}| | | m| 0000-00-00\n`;
            }

            // 显示生成的章节内容
            const resultArea = document.getElementById('batch-result');
            if (resultArea) {
                resultArea.value = result.trim();
            } else {
                console.error('结果区域未找到');
            }
        },

        // 应用生成的章节内容到表单
        applyToForm() {
            const episodeText = document.getElementById('batch-result')?.value;
            const epTextarea = document.querySelector('textarea[name="eplist"]') ||
                  document.querySelector('textarea#eplist') ||
                  document.querySelector('form textarea');

            if (epTextarea && episodeText) {
                epTextarea.value = epTextarea.value.trim()
                    ? epTextarea.value + '\n' + episodeText
                : episodeText;
                alert('章节模板已应用到表单');
            } else {
                console.error('未找到章节输入区域');
                alert('未找到章节输入区域，请手动复制生成的内容');
            }
        },

        // 设置结束值输入模式
        setupEndValueMode() {
            const startInput = document.getElementById('batch-start');
            const endInput = document.getElementById('batch-end');
            const radioButtons = document.querySelectorAll('input[name="end-value-mode"]');

            if (startInput && endInput && radioButtons.length) {
                // 获取当前选中的模式
                const getCurrentMode = () => {
                    const checkedRadio = document.querySelector('input[name="end-value-mode"]:checked');
                    return checkedRadio ? checkedRadio.value : 'auto';
                };

                // 根据初始模式设置状态
                this.updateEndInputState(getCurrentMode());

                // 监听单选按钮变化
                radioButtons.forEach(radio => {
                    radio.addEventListener('change', () => {
                        this.updateEndInputState(getCurrentMode());
                    });
                });

                // 监听 batch-start 输入框的变化
                startInput.addEventListener('input', () => {
                    if (getCurrentMode() === 'auto') {
                        const val = parseInt(startInput.value);
                        if (!isNaN(val)) {
                            endInput.value = val + 19; // 将 batch-end 设置为 batch-start + 19
                        } else {
                            endInput.value = ''; // 如果输入无效，清空 batch-end
                        }
                    }
                });

                // 初始化时，如果 start 有值，自动设置 end
                if (startInput.value) {
                    const val = parseInt(startInput.value);
                    if (!isNaN(val) && getCurrentMode() === 'auto') {
                        endInput.value = val + 19;
                    }
                }
            }
        },

        // 更新结束值输入框状态
        updateEndInputState(mode) {
            const startInput = document.getElementById('batch-start');
            const endInput = document.getElementById('batch-end');

            if (mode === 'auto') {
                // 自动模式：更新结束值，并使其读取 start 值的变化
                const val = parseInt(startInput.value);
                if (!isNaN(val)) {
                    endInput.value = val + 19;
                }
            }
        }
    };

    // 延迟初始化，防止 DOM 未加载完成
    setTimeout(() => {
        BatchEpisodeCreator.init();
    }, 1000);


    /* ===========
     内容快捷填充
    ============== */
    function initBgmDropdownMenu() {
        const currentPath = window.location.pathname;

        // 排除包含 "/add_related/" 的路径
        if (currentPath.includes('/add_related/')) {
            return;
        }

        // 正则匹配：路径是否以 "/数字" 结尾，且不以 "/new_subject" 开头
        if (/^(?!\/new_subject).*\/\d+$/.test(currentPath)) {
            return; // 直接退出，不执行后续逻辑
        }

        // 获取页面类型
        const pageType = determinePageType();

        // 为每种页面类型单独存储配置
        // 根据页面类型获取配置存储键名
        const configKey = `menuConfig_${pageType}`;

        // 根据页面类型获取相应默认配置
        const defaultConfig = getDefaultConfig(pageType);

        // 从本地存储获取当前页面类型的配置或使用默认配置
        let config = JSON.parse(localStorage.getItem(configKey)) || defaultConfig;

        // 保存配置到本地存储
        const saveConfig = () => localStorage.setItem(configKey, JSON.stringify(config));

        // 判断页面类型的函数
        function determinePageType() {
            // 检查URL路径
            if (document.querySelector('label[for="cat_comic"]') || document.querySelector('label[for="cat_picture"]')) {
                return 'book';

            } else if (document.querySelector('label[for="cat_jp"]') || document.querySelector('label[for="cat_tv"]')) {
                return 'video';

            } else if (document.querySelector('label[for="cat_games"]')) {
                return 'game';

            } else if (document.querySelector('td[valign="top"][width="70"]')?.textContent.includes('唱片名')) {
                return 'music';

            } else if (currentPath.includes('/person/')) {
                return 'person';
            }
            return 'common';
        }

        // 根据页面类型获取默认配置
        function getDefaultConfig(pageType) {
            // 通用配置，所有页面（除person）都会包含
            const commonConfig = {
                "价格, 定价, 售价": {
                    options: ["¥", "¥(税込)", "¥(税抜)", "$", "NT$", "HK$", "₩", "€", "£", "฿", "元", "円", "円(税込)", "円(税抜)"],
                    mode: "append",
                    display: "horizontal"
                },
                "发售日, 发售日期, 发行日期, 放送开始, 播放结束, 连载开始, 连载结束, 开始, 结束": {
                    options: [" 年 月 日", " - - "],
                    mode: "replace",
                    display: "horizontal"
                }
            };

            // 根据页面类型添加特定配置
            switch (pageType) {
                case 'game':
                    return {
                        ...commonConfig,
                        "平台": {
                            options: ["Android", "iOS", "PC", "macOS", "Linux", "PS4", "PS5", "Xbox 360", "Xbox One", "Xbox Series X/S",
                                      "Nintendo Switch", "Nintendo Switch 2", "SteamOS"],
                            mode: "replace",
                            display: "horizontal"
                        },
                        "游戏类型": {
                            options: [
                                "ACT", "AAVG", "ADV", "AVG", "Platform", "Parkour",
                                "ARPG", "RPG", "JRPG", "CRPG", "DRPG", "SRPG", "MMORPG",
                                "FPS", "TPS", "Rail Shooter", "Arena Shooter", "STG", "Fly", "Horror",
                                "RTS", "RTT", "TBS", "4X", "Strategy", "SLG", "MOBA",
                                "DBG", "CCG", "TCG", "Roguelike", "Roguelite", "VN", "Interactive Fiction", "TAB", "Board Game", "TRPG",
                                "SIM", "Life sim", "City Building", "Base Building", "Sandbox", "Survival", "PUZ", "Rhythm", "MUG", "FTG", "RAC", "EDU", "Game Engine",

                                "动作", "动作冒险", "冒险", "文字冒险", "平台跳跃", "跑酷",
                                "动作角色扮演", "角色扮演", "日式角色扮演", "美式角色扮演", "地下城角色扮演", "战略角色扮演", "大型多人在线角色扮演",
                                "第一人称射击", "第三人称射击", "轨道射击", "竞技场射击", "弹幕射击", "飞行模拟", "恐怖",
                                "即时战略", "即时战术", "回合制策略", "4X策略", "策略", "策略模拟", "多人在线战术竞技",
                                "牌组构建", "收集式卡牌", "集换式卡牌", "类Rogue", "轻度类Rogue", "视觉小说", "互动小说", "桌面游戏", "桌面角色扮演",
                                "模拟", "生活模拟", "城市建造", "基地建造", "沙盒", "生存", "解谜", "节奏", "音乐", "格斗", "竞速", "教育", "游戏引擎"
                            ],
                            mode: "replace",
                            display: "horizontal"
                        },
                        "游戏引擎": {
                            "options": [
                                "Unity Engine", "Unreal Engine", "Godot Engine", "Source Engine", "Source 2 Engine",
                                "RPGMaker Engine", "GameMaker", "CryEngine", "Frostbite Engine", "Cocos2d-x Engine",
                                "Ren'Py Engine", "Cocos Engine", "PyGame", "GDevelop Engine", "Electron Container",
                                "Red Engine", "RAGE", "Anvil Engine", "Snowdrop Engine", "IW Engine",
                                "Creation Engine", "DECIMA Engine", "Avalanche Engine", "Id Tech Engine",
                                "ForzaTech Engine", "Naughty Dog Engine", "EpicOnlineServices SDK", "Divinity Engine",
                                "KiriKiri Engine", "Live Maker Engine", "Microsoft XNA", "Adobe AIR",
                                "Amazon Lumberyard", "Open 3D Engine (O3DE)", "MT Framework", "Fox Engine", "Glacier Engine",
                                "EGO Engine", "Clausewitz Engine", "Infinity Engine", "LithTech Engine", "RenderWare",
                                "PhyreEngine", "4A Engine", "Build Engine", "Carbon Engine", "Vision Engine", "Wintermute Engine", "Sith Engine"
                            ],
                            mode: "replace",
                            display: "horizontal"
                        }
                    };
                case 'book':
                    return {
                        ...commonConfig,
                        "册数": {
                            options: ["册全", "卷全", "册既刊", "册中断", "卷既刊", "卷中断"],
                            mode: "replace",
                            display: "horizontal"
                        },
                        "出版社, 其他出版社": {
                            options: [
                                "一迅社", "芳文社", "KADOKAWA", "ホーム社", "講談社", "集英社", "小学館", "白泉社", "新潮社",
                                "秋田書店", "双葉社", "竹書房", "幻冬舎", "徳間書店", "マッグガーデン", "エンターブレイン",
                                "一水社", "リイド社", "少年画報社", "朝日新聞出版", "宝島社", "日経BP", "NHK出版", "河出書房新社",
                                "太田出版", "メディアファクトリー", "スクウェア・エニックス", "祥伝社",

                                "네이버웹툰", "카카오엔터테인먼트", "카카오웹툰스튜디오", "레진엔터테인먼트", "탑툰", "투믹스",
                                "미스터블루", "봄툰", "리디", "키다리스튜디오", "대원씨아이", "서울미디어코믹스", "학산문화사",
                                "크랙엔터테인먼트", "콘텐츠랩블루", "스토리위즈", "YLAB", "재담미디어", "투유드림", "엠스토리허브",

                                "安徽文艺出版社", "安徽美术出版社", "长春出版社", "长江出版社", "长江文艺出版社", "二十一世纪出版社",
                                "广西美术出版社", "黑龙江美术出版社", "湖南文艺出版社", "湖南美术出版社", "吉林美术出版社",
                                "江苏凤凰文艺出版社", "连环画出版社", "内蒙古人民出版社", "人民美术出版社", "人民邮电出版社",
                                "上海人民美术出版社", "上海文艺出版社", "上海译文出版社", "四川文艺出版社", "四川美术出版社",
                                "天津人民美术出版社", "新世纪出版社", "新星出版社", "云南美术出版社", "浙江人民美术出版社",
                                "浙江文艺出版社", "中信出版社",

                                "皇冠文化集團", "尖端出版", "東立出版社", "青文出版社", "台灣角川", "蓋亞文化", "四季出版",
                                "漫遊者文化", "聯經出版事業公司", "三民書局", "遠流出版", "麥田出版", "大塊文化", "貓頭鷹出版社",
                                "漫客文化", "原動力文化", "木馬文化", "小魯文化", "小宇宙出版", "開學文化", "親子天下"
                            ],
                            mode: "append",
                            display: "horizontal"
                        },
                        "连载杂志": {
                            "options": [
                                "pixiv", "pixivコミック", "ニコニコ静画", "マンガハック", "comico", "comico PLUS", "Palcy",
                                "GANMA!", "マガポケ/マガジンポケット", "コミック百合姫", "ガレット", "カクヨム", "小説家になろう",
                                "週刊少年ジャンプ/少年ジャンプ", "ゼブラック", "週刊少年サンデー", "サンデーうぇぶり", "週刊少年マガジン", "コミックDAYS",
                                "月刊アフタヌーン", "ヤングジャンプ", "モーニング", "月刊少年ガンガン", "マンガUP!", "電撃大王", "COMICリュウ",
                                "ウルトラジャンプ", "花とゆめ", "LaLa", "別冊マーガレット", "FEEL YOUNG", "ebookjapan", "コミックシーモア",
                                "BookLive!", "まんが王国", "ピッコマ", "アルファポリス", "ノベルアップ＋",

                                "LINEマンガ", "LINE Webtoon", "Naver Webtoon", "Naver Series", "Daum Webtoon", "Kakao Webtoon", "Kakao Page", "Lezhin Comics",
                                "TopToon", "Toomics", "Bomtoon", "Mr.Blue", "Peanutoon", "Ridibooks", "Delitoon", "BUFF툰", "Spottoon", "Tappytoon", "Manta",

                                "爱奇艺叭嗒", "哔哩哔哩漫画", "大角虫漫画", "快看漫画", "MOJOIN", "日更计划", "腾讯漫画", "QQ阅读", "有妖气",
                                "漫客栈", "布卡漫画", "咚漫", "漫漫漫画", "菠萝包轻小说", "长佩文学", "刺猬猫阅读", "番茄小说", "晋江文学城",
                                "起点中文网", "纵横中文网", "书旗小说", "掌阅iReader", "咪咕阅读",

                                "鏡文學", "Readmoo读墨", "BOOK☆WALKER台湾", "台湾角川", "POPO原创市集"
                            ],
                            mode: "append",
                            display: "horizontal"
                        },
                        "话数": {
                            options: ["序章", "正篇", "后记", "番外", "外传", "尾声", "杂篇", "特别篇", "特典番外"],
                            mode: "append",
                            display: "horizontal"
                        }
                    };
                case 'video':
                    return {
                        ...commonConfig,
                        "语言": {
                            options: ["简体中文", "繁体中文", "日文", "韩文", "英文", "法文", "德文"],
                            mode: "replace",
                            display: "horizontal"
                        },
                        "国家/地区, 首播国家, 首播地区": {
                            options: ["中国大陆", "香港", "澳门", "台湾", "日本", "韩国", "泰国", "美国", "英国", "法国", "德国", "加拿大",
                                      "意大利", "土耳其", "新西兰", "俄罗斯"],
                            mode: "replace",
                            display: "horizontal"
                        },
                        "放送星期": {
                            options: ["星期一", "星期二", "星期三", "星期四", "星期五", "星期六", "星期日"],
                            mode: "append",
                            display: "horizontal"
                        },
                        "类型": {
                            options: ["爱情", "布袋戏", "传记", "动作", "犯罪", "歌舞", "古装", "家庭", "纪录片", "惊悚", "剧情", "科幻", "恐怖",
                                      "历史", "冒险", "美食", "奇幻", "少儿", "同性", "特摄", "推理", "武侠", "喜剧", "校园", "悬疑", "玄幻",
                                      "西部", "音乐", "运动", "灾难", "战争", "职场"],
                            mode: "append",
                            display: "horizontal"
                        },
                        "在线播放平台": {
                            options: [
                                "Netflix", "Amazon Prime Video", "Disney+", "Hulu", "HBO Max", "Apple TV+", "YouTube", "YouTube Movies", "Vimeo",

                                "LINE TV", "Viu", "WeTV", "iQIYI International", "myTV SUPER", "TVING", "Wavve", "Watcha",

                                "AbemaTV", "niconico", "U-NEXT", "dアニメストア", "FOD", "TVer", "GYAO!", "Paravi",

                                "bilibili", "爱奇艺", "腾讯视频", "优酷视频", "芒果TV", "猫耳FM", "饭角", "AcFun", "蜻蜓FM", "漫播", "喜马拉雅", "咪咕视频",
                                "搜狐视频", "PPTV", "可可FM", "央视网", "乐视视频", "西瓜视频", "土豆网", "风行网", "华数TV", "酷米网", "淘米视频"
                            ],
                            mode: "append",
                            display: "horizontal"
                        },
                        "播放电视台, 其他电视台, 电视台, 频道": {
                            options: [
                                "ABC", "AMC", "BBC", "Cable TV", "CBS", "CNN", "CTiTV", "CTS", "CTV", "Fuji TV", "France TV", "FOX", "HBO", "JTBC", "KBS", "KBS2", "KTV",
                                "MBC", "Mnet", "NBC", "NHK", "NTV", "OCN", "RTHK", "SETTV", "STV", "SBS", "TBS", "TV Tokyo", "TVB", "TVBS", "ViuTV", "ZDF",

                                "Disney Channel", "Nickelodeon", "Cartoon Network", "Adult Swim", "Boomerang", "Discovery Channel", "National Geographic",
                                "History Channel", "Animal Planet", "MTV", "ESPN", "AXN", "FX", "Syfy",

                                "安徽动漫频道", "安徽广播电视台农业·科教频道", "成都广播电视台少儿频道", "重庆电视台少儿频道", "动漫秀场",
                                "福建电视台少儿频道", "福州广播电视台少儿频道", "甘肃广播电视台少儿频道", "嘉佳卡通", "江西广播电视台少儿频道",
                                "卡酷少儿", "广东广播电视台少儿频道", "广西广播电视台公共频道", "广州广播电视台少儿频道", "哈哈少儿", "哈哈炫动",
                                "河北广播电视台少儿科教频道", "黑龙江广播电视台少儿频道", "湖北广播电视台少儿频道", "湖南金鹰卡通", "吉林教育电视台",
                                "济南广播电视台少儿频道", "辽宁广播电视台教育·青少频道", "辽宁广播电视台新动漫频道", "内蒙古广播电视台少儿频道",
                                "陕西卫视", "山东广播电视台少儿频道", "武汉电视台少儿频道", "厦门电视台综合频道", "炫动卡通", "优漫卡通",
                                "云南广播电视台少儿频道", "浙江电视台少儿频道", "中央电视台少儿频道"
                            ],
                            mode: "append",
                            display: "horizontal"
                        }
                    };
                case 'music':
                    return {
                        ...commonConfig,
                        "版本特性": {
                            options: ["CD", "Digital", "Soundtrack", "Remix Album", "CD, Album"],
                            mode: "replace",
                            display: "vertical"
                        }
                    };
                case 'person':
                    return {
                        "": {
                            options: ["X/Twitter", "YouTube", "Instagram", "Soundcloud", "HP", "Pixiv", "bilibili", "微博"],
                            mode: "replace",
                            display: "horizontal"
                        }
                    };
                default:
                    return commonConfig;
            }
        }

        // 添加设置按钮到导航栏
        const addSettingsButton = () => {
            const $ = window.jQuery || window.$;
            $('<li class="last"><a href="javascript:void(0);" id="editMenu">修改选单 |</a></li>').insertBefore($('li.last a#showrobot').parent());
            $(document).on('click', '#editMenu', showConfigModal);
        };

        // 显示配置模态框
        const showConfigModal = () => {
            const $ = window.jQuery || window.$;

            // 创建模态框容器
            const $modal = $('<div>', {
                id: 'bgmConfigModal',
                class: 'bgm-config-modal'
            }).appendTo('body');

            // 创建模态框内容
            const $content = $('<div>', {
                class: 'bgm-config-content'
            }).appendTo($modal);

            // 关闭按钮
            $('<button>', {
                text: '×',
                class: 'bgm-config-close'
            }).on('click', () => $modal.remove()).appendTo($content);

            // 标题
            $('<h3>', {
                text: '选单配置',
                css: { marginTop: 0 }
            }).appendTo($content);

            // 页面类型信息
            $('<p>', {
                text: `当前页面类型: ${pageType}`,
                css: { marginBottom: '10px', fontWeight: 'bold' }
            }).appendTo($content);

            // 表单
            const $form = $('<form>').appendTo($content);

            // 文本区域
            const $textarea = $('<textarea>', {
                class: 'bgm-config-textarea'
            }).val('{' + Object.entries(config).map(([key, value]) =>
                                                    `"${key}": ${JSON.stringify(value, null, 2)}`
                                                   ).join(',\n') + '}').appendTo($form);

            // 按钮容器
            const $buttonContainer = $('<div>', {
                class: 'bgm-config-buttons'
            }).appendTo($form);

            // 创建按钮辅助函数
            const createButton = (text, onClick, className = '') =>
            $('<button>', {
                text,
                class: `bgm-config-button ${className}`
            }).on('click', (e) => {
                e.preventDefault();
                onClick();
            }).appendTo($buttonContainer);

            // 重置按钮
            createButton('重置', () => {
                if (confirm(`确定要重置当前页面(${pageType})的配置吗？`)) {
                    config = getDefaultConfig(pageType);
                    saveConfig();
                    location.reload();
                }
            }, 'danger');

            // 添加导出所有配置和导入所有配置的按钮
            createButton('导出（全）', exportAllConfigs, '');

            // 导出按钮
            createButton('导出', () => exportConfig(pageType));

            // 导入按钮和文件输入
            const $fileInput = $('<input>', {
                type: 'file',
                css: { display: 'none' }
            }).appendTo($buttonContainer);

            createButton('导入', () => $fileInput.click());

            $fileInput.on('change', (e) => {
                if (e.target.files[0]) {
                    importConfig(e.target.files[0], pageType);
                }
            });

            // 导入所有配置按钮和文件输入
            const $allFileInput = $('<input>', {
                type: 'file',
                css: { display: 'none' }
            }).appendTo($buttonContainer);

            createButton('导入（全）', () => $allFileInput.click());

            $allFileInput.on('change', (e) => {
                if (e.target.files[0]) {
                    importAllConfigs(e.target.files[0]);
                }
            });

            // 保存按钮
            createButton('保存', () => {
                try {
                    const newConfig = JSON.parse($textarea.val());
                    config = newConfig;
                    saveConfig();
                    $modal.remove();
                    location.reload();
                } catch (e) {
                    console.error(e);
                    alert('保存失败，请检查格式是否正确');
                }
            }, 'primary');

        };

        // 导出单个配置
        const exportConfig = (type) => {
            const configData = localStorage.getItem(`menuConfig_${type}`);
            const blob = new Blob([configData || JSON.stringify(getDefaultConfig(type), null, 2)], {
                type: 'application/json'
            });
            const a = document.createElement('a');
            a.href = URL.createObjectURL(blob);
            a.download = `WikiMenuConfig_${type}.json`;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
        };

        // 导出所有配置
        const exportAllConfigs = () => {
            const allConfigs = {};
            const pageTypes = ['common', 'game', 'book', 'video', 'music', 'person'];

            pageTypes.forEach(type => {
                const configData = localStorage.getItem(`menuConfig_${type}`);
                allConfigs[type] = configData ? JSON.parse(configData) : getDefaultConfig(type);
            });

            const blob = new Blob([JSON.stringify(allConfigs, null, 2)], {
                type: 'application/json'
            });
            const a = document.createElement('a');
            a.href = URL.createObjectURL(blob);
            a.download = 'WikiMenuConfig_All.json';
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
        };

        // 导入单个配置
        const importConfig = (file, type) => {
            const reader = new FileReader();
            reader.onload = (event) => {
                try {
                    const newConfig = JSON.parse(event.target.result);
                    localStorage.setItem(`menuConfig_${type}`, JSON.stringify(newConfig));
                    alert(`导入${type}配置成功！`);
                    location.reload();
                } catch (e) {
                    alert('导入失败，请检查文件格式！');
                }
            };
            reader.readAsText(file);
        };

        // 导入所有配置
        const importAllConfigs = (file) => {
            const reader = new FileReader();
            reader.onload = (event) => {
                try {
                    const allConfigs = JSON.parse(event.target.result);
                    const pageTypes = ['common', 'game', 'book', 'video', 'music', 'person'];

                    pageTypes.forEach(type => {
                        if (allConfigs[type]) {
                            localStorage.setItem(`menuConfig_${type}`, JSON.stringify(allConfigs[type]));
                        }
                    });

                    alert('导入所有配置成功！');
                    location.reload();
                } catch (e) {
                    console.error(e);
                    alert('导入失败，请检查文件格式！');
                }
            };
            reader.readAsText(file);
        };

        // 为输入创建下拉框
        const createDropdown = (inputElement, options, mode, connector) => {
            const $ = window.jQuery || window.$;
            const $input = $(inputElement);

            // 已经有下拉框则不再创建
            if ($input.data('dropdownAdded')) return;

            // 包装输入框（不改变布局）
            if (!$input.parent().hasClass('bgm-input-wrapper')) {
                $input.wrap('<div class="bgm-input-wrapper"></div>');
            }

            // 创建下拉容器
            const $dropdownContainer = $('<div>', {
                class: 'bgm-dropdown-content'
            }).insertAfter($input);

            // 标记已添加下拉菜单
            $input.data('dropdownAdded', true);
            $input.data('dropdownOptions', options);
            $input.data('dropdownMode', mode);
            $input.data('dropdownConnector', connector || '、'); // 设置连接符，默认为顿号

            // 输入框获得焦点时显示下拉框
            $input.on('focus', function() {
                // 新增代码：关闭所有其他下拉菜单
                $('.bgm-dropdown-content').removeClass('bgm-dropdown-active');
                updateDropdown(this, '');
                $(this).next('.bgm-dropdown-content').addClass('bgm-dropdown-active');
            });

            // 输入时过滤选项
            $input.on('input', function() {
                updateDropdown(this, $(this).val());
            });

            // 为输入框添加键盘事件处理（用于处理Tab、Enter等按键）
            $input.on('keydown', function(e) {
                // Tab键 或 Enter键
                if ((e.keyCode === 9 || e.keyCode === 13) && $('.bgm-dropdown-content.bgm-dropdown-active').length) {
                    const $activeDropdown = $('.bgm-dropdown-content.bgm-dropdown-active');
                    const $firstItem = $activeDropdown.find('.bgm-dropdown-item').first();

                    // 如果有过滤后的选项，选择第一个
                    if ($firstItem.length && !$firstItem.text().includes('没有匹配选项')) {
                        e.preventDefault(); // 阻止默认行为
                        $firstItem.click();
                    }
                }
            });

            return $dropdownContainer;
        };

        // 更新下拉框选项
        const updateDropdown = (inputElement, filterText) => {
            const $ = window.jQuery || window.$;
            const $input = $(inputElement);
            const options = $input.data('dropdownOptions');
            const $dropdownContent = $input.next('.bgm-dropdown-content');

            if (!options || !$dropdownContent.length) return;

            // 清空现有选项
            $dropdownContent.empty();

            // 根据输入过滤选项
            const filteredOptions = filterText.trim() !== '' ?
                  options.filter(option => option.toLowerCase().includes(filterText.toLowerCase())) :
            options;

            // 添加过滤后的选项
            if (filteredOptions.length > 0) {
                filteredOptions.forEach(option => {
                    $('<a>', {
                        href: 'javascript:void(0);',
                        text: option,
                        class: 'bgm-dropdown-item'
                    }).on('click', function() {
                        insertOptionValue(inputElement, option);
                        $dropdownContent.removeClass('bgm-dropdown-active');
                    }).appendTo($dropdownContent);
                });
            } else {
                $('<div>', {
                    text: '没有匹配选项',
                    class: 'bgm-dropdown-item',
                    css: { color: '#999', cursor: 'default' }
                }).appendTo($dropdownContent);
            }
        };

        // 将选项值插入到输入框
        function insertOptionValue(inputElem, value) {
            const text = inputElem.value;
            const pos = inputElem.selectionStart;
            const mode = inputElem.dataset.dropdownMode || 'append'; // 获取插入模式
            const conn = inputElem.dataset.dropdownConnector || '、';

            // 根据不同的插入模式处理
            if (mode === 'replace') {
                // 直接替换
                inputElem.value = value;
            } else if (mode === 'append') {
                // 自动补全逻辑改进
                if (text) {
                    const currentWord = text.slice(0, pos).toLowerCase();
                    if (value.toLowerCase().startsWith(currentWord)) {
                        // 如果当前输入是目标值的开头，直接替换整个值
                        inputElem.value = value + text.slice(pos);
                        inputElem.setSelectionRange(value.length, value.length);
                        inputElem.focus();
                        return;
                    }

                    // 处理分隔符和空格
                    const lastChar = text.slice(-1);
                    if (['、','，',',','+',' '].includes(lastChar)) {
                        // 如果最后一个字符是分隔符，直接添加新值
                        inputElem.value = text.trimRight() + value;
                    } else {
                        // 否则添加分隔符和新值
                        inputElem.value = text + conn + value;
                    }
                } else {
                    // 如果输入框为空，直接设置值
                    inputElem.value = value;
                }
            }

            inputElem.focus();
        }

        // 处理所有字段
        const processAllFields = () => {
            const $ = window.jQuery || window.$;

            // 处理ID字段和对应的属性字段
            $('input.inputtext.id').each(function() {
                const $idInput = $(this);
                const idValue = $idInput.val().trim();
                const $propInput = $idInput.next('.inputtext.prop');

                // 为空ID字段添加下拉菜单（如果配置了）
                if (idValue === '' && config[''] && !$idInput.data('dropdownAdded')) {
                    createDropdown(this, config[''].options, config[''].mode);
                }

                // 为其他配置的字段添加下拉菜单
                if ($propInput.length) {
                    Object.entries(config).forEach(([key, options]) => {
                        const keys = key.split(',').map(k => k.trim());
                        if (keys.includes(idValue) && !$propInput.data('dropdownAdded')) {
                            createDropdown($propInput[0], options.options, options.mode, options.connector);
                        }
                    });
                }
            });
        };

        // 处理动态添加的字段
        const processDynamicField = (element) => {
            const $ = window.jQuery || window.$;
            const $element = $(element);

            // 如果元素本身是输入框
            if ($element.is('input.inputtext.id')) {
                const $idInput = $element;
                const idValue = $idInput.val().trim();
                const $propInput = $idInput.next('.inputtext.prop');

                // 空ID字段处理
                if (idValue === '' && config['']) {
                    createDropdown($idInput[0], config[''].options, config[''].mode);
                }

                // 属性字段处理
                if ($propInput.length) {
                    Object.entries(config).forEach(([key, options]) => {
                        const keys = key.split(',').map(k => k.trim());
                        if (keys.includes(idValue)) {
                            createDropdown($propInput[0], options.options, options.mode, options.connector);
                        }
                    });
                }
            }
            // 如果元素是容器
            else {
                // 处理常规ID字段
                $element.find('input.inputtext.id').each(function() {
                    const $idInput = $(this);
                    const idValue = $idInput.val().trim();
                    const $propInput = $idInput.next('.inputtext.prop');

                    // 空ID字段处理
                    if (idValue === '' && config['']) {
                        createDropdown($idInput[0], config[''].options, config[''].mode);
                    }

                    // 属性字段处理
                    if ($propInput.length) {
                        Object.entries(config).forEach(([key, options]) => {
                            const keys = key.split(',').map(k => k.trim());
                            if (keys.includes(idValue)) {
                                createDropdown($propInput[0], options.options, options.mode, options.connector);
                            }
                        });
                    }
                });
            }
        };

        // 初始化函数
        const init = () => {
            const $ = window.jQuery || window.$;

            // 添加设置按钮
            addSettingsButton();

            // 初始处理所有字段
            $(document).ready(function() {
                processAllFields();

                // 监听动态添加的字段
                $(document).on('DOMNodeInserted', function(e) {
                    const $target = $(e.target);
                    if ($target.find('input.inputtext.id').length || $target.is('input.inputtext.id')) {
                        setTimeout(() => processDynamicField(e.target), 100);
                    }
                });

                // 点击页面其他位置时隐藏所有下拉框
                $(document).on('click', function(e) {
                    if (!$(e.target).closest('.bgm-input-wrapper').length && !$(e.target).closest('.bgm-config-modal').length) {
                        $('.bgm-dropdown-content').removeClass('bgm-dropdown-active');
                    }
                });
            });

            // 监听添加新行的按钮点击事件
            $(document).on('click', '.newbtn', function() {
                setTimeout(processAllFields, 100);
            });

            // 处理现有字段ID值变化的情况
            $(document).on('change', 'input.inputtext.id', function() {
                const $idInput = $(this);
                const idValue = $idInput.val().trim();
                const $propInput = $idInput.next('.inputtext.prop');

                // 若属性字段已有下拉菜单，需要移除
                if ($propInput.data('dropdownAdded')) {
                    if ($propInput.next('.bgm-dropdown-content').length) {
                        $propInput.next('.bgm-dropdown-content').remove();
                    }
                    $propInput.data('dropdownAdded', false);

                    // 如果输入框被包装了，尝试解包
                    if ($propInput.parent().hasClass('bgm-input-wrapper')) {
                        $propInput.unwrap();
                    }
                }

                // 添加新的下拉菜单
                if ($propInput.length) {
                    Object.entries(config).forEach(([key, options]) => {
                        const keys = key.split(',').map(k => k.trim());
                        if (keys.includes(idValue)) {
                            createDropdown($propInput[0], options.options, options.mode, options.connector);
                        }
                    });
                }
            });
        };

        // 执行初始化
        init();
    }


    /* =============
     单行本快捷创建
    ============== */
    function initBgmCreateSubject() {

        const path = location.pathname;

        if (!(/^\/subject\/\d+$/.test(path) || /^\/new_subject\/1$/.test(path))) return;

        // 调试日志函数
        function log(message) {
            console.log(`[BGM助手] ${message}`);
        }

        // 通知系统
        const notification = {
            // 添加通知区域
            addArea() {
                if (document.querySelector('#bgm-notification-area')) return;

                const notificationArea = document.createElement('div');
                notificationArea.id = 'bgm-notification-area';
                notificationArea.style.position = 'fixed';
                notificationArea.style.top = '10px';
                notificationArea.style.right = '10px';
                notificationArea.style.padding = '8px 15px';
                notificationArea.style.backgroundColor = '#369CF8';
                notificationArea.style.color = 'white';
                notificationArea.style.borderRadius = '5px';
                notificationArea.style.zIndex = '9999';
                notificationArea.style.display = 'none';
                notificationArea.style.boxShadow = '0 2px 5px rgba(0,0,0,0.2)';

                document.body.appendChild(notificationArea);
            },

            // 显示通知
            show(message, isError = false) {
                this.addArea();

                const notificationArea = document.querySelector('#bgm-notification-area');
                notificationArea.textContent = message;
                notificationArea.style.backgroundColor = isError ? '#FF5151' : '#369CF8';
                notificationArea.style.display = 'block';

                // 3秒后隐藏通知
                setTimeout(() => {
                    notificationArea.style.display = 'none';
                }, 3000);

                // 如果支持GM通知，也显示一个
                if (typeof GM_notification !== 'undefined') {
                    GM_notification({
                        title: 'Bangumi 条目创建助手',
                        text: message,
                        timeout: 3000
                    });
                }

                // 同时在控制台输出
                log(message);
            }
        };

        // 数据存储系统
        const storage = {
            // 保存数据
            save(key, value) {
                if (typeof GM_setValue !== 'undefined') {
                    GM_setValue(key, value);
                    log(`使用GM_setValue保存数据: ${key}`);
                    return true;
                } else if (typeof localStorage !== 'undefined') {
                    try {
                        localStorage.setItem(key, value);
                        log(`使用localStorage保存数据: ${key}`);
                        return true;
                    } catch (e) {
                        log(`localStorage保存失败: ${e.message}`);
                        return false;
                    }
                }
                return false;
            },

            // 获取数据
            get(key) {
                if (typeof GM_getValue !== 'undefined') {
                    const value = GM_getValue(key);
                    log(`使用GM_getValue获取数据: ${key}=${value ? '有数据' : '无数据'}`);
                    return value;
                } else if (typeof localStorage !== 'undefined') {
                    try {
                        const value = localStorage.getItem(key);
                        log(`使用localStorage获取数据: ${key}=${value ? '有数据' : '无数据'}`);
                        return value;
                    } catch (e) {
                        log(`localStorage获取失败: ${e.message}`);
                        return null;
                    }
                }
                return null;
            },

            // 删除数据
            remove(key) {
                if (typeof GM_deleteValue !== 'undefined') {
                    GM_deleteValue(key);
                    log(`使用GM_deleteValue删除数据: ${key}`);
                } else if (typeof localStorage !== 'undefined') {
                    try {
                        localStorage.removeItem(key);
                        log(`使用localStorage删除数据: ${key}`);
                    } catch (e) {
                        log(`localStorage删除失败: ${e.message}`);
                    }
                }
            },

            // 根据前缀查找最新的存储项
            findLatestByPrefix(prefix) {
                if (typeof localStorage === 'undefined') return null;

                const foundKeys = [];
                for (let i = 0; i < localStorage.length; i++) {
                    const key = localStorage.key(i);
                    if (key.startsWith(prefix)) {
                        foundKeys.push(key);
                    }
                }

                if (foundKeys.length === 0) return null;

                foundKeys.sort();
                return foundKeys[foundKeys.length - 1].split('_').slice(0, -1).join('_');
            }
        };

        // 网络请求系统
        const network = {
            // 发起请求，自动选择合适的方法
            request(url, onSuccess, onError) {
                log(`发起请求: ${url}`);

                // 尝试使用fetch
                if (window.fetch) {
                    fetch(url)
                        .then(response => {
                        if (!response.ok) {
                            throw new Error(`HTTP状态码: ${response.status}`);
                        }
                        return response.text();
                    })
                        .then(html => onSuccess(html))
                        .catch(e => {
                        log(`Fetch错误: ${e.message}`);
                        // fetch失败，尝试使用GM_xmlhttpRequest
                        if (typeof GM_xmlhttpRequest !== 'undefined') {
                            this.requestWithGM(url, onSuccess, onError);
                        } else if (onError) {
                            onError(`请求失败: ${e.message}`);
                        }
                    });
                }
                // 否则尝试使用GM_xmlhttpRequest
                else if (typeof GM_xmlhttpRequest !== 'undefined') {
                    this.requestWithGM(url, onSuccess, onError);
                }
                // 都不支持
                else if (onError) {
                    onError("浏览器不支持所需的请求方法");
                }
            },

            // 使用GM_xmlhttpRequest请求
            requestWithGM(url, onSuccess, onError) {
                log(`使用GM_xmlhttpRequest请求: ${url}`);

                GM_xmlhttpRequest({
                    method: "GET",
                    url: url.startsWith('//') ? window.location.protocol + url : url,
                    timeout: 10000, // 10秒超时
                    onload: function(response) {
                        if (response.status !== 200) {
                            if (onError) onError(`请求失败，状态码: ${response.status}`);
                            return;
                        }
                        onSuccess(response.responseText);
                    },
                    onerror: function(error) {
                        if (onError) onError("网络请求失败，请检查网络连接");
                        log("请求失败", error);
                    },
                    ontimeout: function() {
                        if (onError) onError("请求超时，请稍后重试");
                    }
                });
            }
        };

        // 条目处理系统
        const entryHandler = {
            // 识别Infobox类型
            identifyType(content) {
                if (!content) return "Unknown";

                if (content.includes("Infobox animanga/Novel")) {
                    return "Novel";
                } else if (content.includes("Infobox animanga/Manga")) {
                    return "Manga";
                }

                return "Unknown";
            },

            // 存储条目数据
            storeEntryData(content, type, title, sourceId) {
                const keyPrefix = `bgm_infobox_${sourceId}`;

                const savedContent = storage.save(`${keyPrefix}_content`, content);
                const savedType = storage.save(`${keyPrefix}_type`, type);
                storage.save(`${keyPrefix}_title`, title);

                return savedContent && savedType;
            },

            // 解析编辑页内容
            parseEditPage(html, title, sourceId) {
                try {
                    const parser = new DOMParser();
                    const doc = parser.parseFromString(html, "text/html");

                    // 检查是否需要登录
                    const loginForm = doc.querySelector('form[action="/FollowTheRabbit"]');
                    if (loginForm) {
                        notification.show("获取失败，请先登录Bangumi", true);
                        return false;
                    }

                    const textarea = doc.querySelector('#subject_summary');
                    if (!textarea) {
                        notification.show("未找到条目内容，可能没有编辑权限", true);
                        return false;
                    }

                    const content = textarea.value;
                    if (!content) {
                        notification.show("条目内容为空", true);
                        return false;
                    }

                    // 识别条目类型
                    const type = this.identifyType(content);
                    if (type === "Unknown") {
                        notification.show("未识别 Infobox 类型（支持 Novel 或 Manga）", true);
                        return false;
                    }

                    // 存储数据
                    if (!this.storeEntryData(content, type, title, sourceId)) {
                        notification.show("保存数据失败，请检查浏览器权限", true);
                        return false;
                    }

                    return true;
                } catch (e) {
                    notification.show(`解析页面失败: ${e.message}`, true);
                    console.error(e);
                    return false;
                }
            },

            // 将原标题处理为新建条目标题
            processTitle(title) {
                if (!title) return "";

                const match = title.match(/\((\d+)\)$/);
                if (match) {
                    const num = parseInt(match[1], 10) + 1;
                    return title.replace(/\(\d+\)$/, `(${num})`);
                } else {
                    return `${title} (1)`;
                }
            }
        };

        // 页面功能系统
        const pageFeatures = {
            // 在条目页添加"新条目"按钮
            addCreateButton() {
                const currentPath = location.pathname;
                const matchSubject = currentPath.match(/^\/subject\/(\d+)$/);
                if (!matchSubject) {
                    log("当前页面不是条目页面，不添加按钮");
                    return;
                }

                // 检查类型是否为"小说"或"漫画"
                const genreSmall = document.querySelector('small.grey');
                if (!genreSmall || !(genreSmall.textContent.trim() === '小说' || genreSmall.textContent.trim() === '漫画')) {
                    log(`条目类型不是小说或漫画: ${genreSmall ? genreSmall.textContent.trim() : '未找到'}`);
                    return;
                }

                // 查找导航栏并避免重复添加
                const nav = document.querySelector(".subjectNav .navTabs, .navTabs");
                if (!nav || nav.querySelector(".create-button")) {
                    log(nav ? "按钮已存在，不重复添加" : "未找到导航栏");
                    return;
                }

                // 准备通知区域
                notification.addArea();

                // 创建并添加按钮
                const createLi = document.createElement("li");
                createLi.className = "create-button";
                const subjectId = matchSubject[1];
                createLi.innerHTML = `<a href="javascript:void(0);" class="create-button-link">新条目</a>`;

                // 按钮点击事件
                createLi.querySelector("a").addEventListener("click", () => {
                    this.handleCreateButtonClick(subjectId);
                });

                nav.appendChild(createLi);
                log("成功添加新条目按钮");
            },

            // 处理创建按钮点击
            handleCreateButtonClick(subjectId) {
                notification.show("正在获取条目内容...");

                const currentHost = window.location.hostname;
                const editUrl = `//${currentHost}/subject/${subjectId}/edit`;
                const title = document.querySelector('h1 a[property="v:itemreviewed"]')?.textContent?.trim() ||
                      document.querySelector('h1.nameSingle a')?.textContent?.trim() || '';

                // 唯一标识符
                const uniqueId = Date.now().toString();

                // 发起请求获取编辑页内容
                network.request(
                    editUrl,
                    (html) => {
                        // 成功处理编辑页内容
                        if (entryHandler.parseEditPage(html, title, uniqueId)) {
                            notification.show("条目内容获取成功，正在打开创建页面...");
                            window.open(`//${currentHost}/new_subject/1?source=${uniqueId}`, "_blank");
                        }
                    },
                    (errorMsg) => {
                        notification.show(errorMsg, true);
                    }
                );
            },

            // 添加"复制创建"按钮到新建条目页面
            addCloneButton() {
                if (!location.pathname.includes("/new_subject/1")) {
                    log("当前不是新建条目页面，不添加克隆按钮");
                    return;
                }

                // 查找标题并检查
                const titleHeader = document.querySelector('h1');
                if (!titleHeader || !titleHeader.textContent.includes('添加')) {
                    log(`标题元素不符合条件: ${titleHeader ? titleHeader.textContent : '未找到'}`);
                    return;
                }

                // 避免重复添加
                if (document.querySelector('#clone-entry-button')) {
                    log("克隆按钮已存在，不重复添加");
                    return;
                }

                // 准备通知区域
                notification.addArea();

                // 创建按钮
                const cloneButton = document.createElement('button');
                cloneButton.id = 'clone-entry-button';
                cloneButton.textContent = '新条目';
                cloneButton.style.cssText = `
                                  background-color: #F09199;
                                  color: white;
                                  border: none;
                                  padding: 5px 10px;
                                  border-radius: 4px;
                                  margin-left: 10px;
                                  cursor: pointer;
                                  font-weight: bold;
                                  text-align: center;
                                `;


                // 添加到页面
                titleHeader.appendChild(cloneButton);
                log("成功添加克隆按钮");

                // 添加点击事件
                cloneButton.addEventListener('click', () => {
                    this.handleCloneButtonClick();
                });
            },

            // 处理克隆按钮点击
            handleCloneButtonClick() {
                // 尝试切换到Wiki模式
                const wikiModeLink = document.querySelector('a[onclick="NormaltoWCODE()"]');
                if (wikiModeLink) {
                    wikiModeLink.click();
                    log("已自动切换到Wiki模式");
                }

                // 获取表单内容
                const infobox = document.querySelector("#subject_infobox");
                const titleInput = document.querySelector('input[name="subject_title"]');

                if (!infobox || !titleInput) {
                    notification.show("无法获取表单内容，请确保已切换到Wiki模式", true);
                    return;
                }

                const content = infobox.value;
                const title = titleInput.value;

                if (!content) {
                    notification.show("Infobox内容为空", true);
                    return;
                }

                // 识别类型
                const type = entryHandler.identifyType(content);
                if (type === "Unknown") {
                    notification.show("未识别 Infobox 类型（支持 Novel 或 Manga）", true);
                    return;
                }

                // 生成唯一ID
                const cloneId = 'clone_' + Date.now();

                // 存储数据
                if (!entryHandler.storeEntryData(content, type, title, cloneId)) {
                    notification.show("保存数据失败，请检查浏览器权限", true);
                    return;
                }

                notification.show("已复制当前页面条目内容，正在打开新建页面...");

                // 打开新页面
                const currentHost = window.location.hostname;
                window.open(`//${currentHost}/new_subject/1?source=${cloneId}`, "_blank");
            },

            // 自动填充表单
            fillNewSubjectForm() {
                // 获取URL参数
                const sourceId = new URL(window.location.href).searchParams.get("source");
                if (!sourceId) {
                    log("没有找到source参数，不执行填充");
                    return;
                }

                log(`检测到source参数: ${sourceId}`);
                notification.addArea();

                // 构建键名前缀并获取数据
                const keyPrefix = `bgm_infobox_${sourceId}`;
                let content = storage.get(`${keyPrefix}_content`);
                let type = storage.get(`${keyPrefix}_type`);
                let title = storage.get(`${keyPrefix}_title`);

                // 如果找不到数据，尝试使用旧版键名
                if (!content || !type) {
                    log(`未找到数据: ${keyPrefix}`);

                    // 尝试旧版键名
                    const oldKeyPrefix = `infobox_${sourceId}`;
                    const oldContent = storage.get(`${oldKeyPrefix}_content`);
                    const oldType = storage.get(`${oldKeyPrefix}_type`);
                    const oldTitle = storage.get(`${oldKeyPrefix}_title`);

                    if (oldContent && oldType) {
                        log(`找到旧版数据: ${oldKeyPrefix}`);
                        content = oldContent;
                        type = oldType;
                        title = oldTitle;
                    } else {
                        // 尝试找到最新的相关键
                        const latestKeyBase = storage.findLatestByPrefix('bgm_infobox_') || storage.findLatestByPrefix('infobox_');

                        if (latestKeyBase) {
                            log(`尝试使用最近的键前缀: ${latestKeyBase}`);
                            content = storage.get(`${latestKeyBase}_content`);
                            type = storage.get(`${latestKeyBase}_type`);
                            title = storage.get(`${latestKeyBase}_title`);
                        }
                    }

                    if (!content || !type) {
                        notification.show("未找到条目内容，请重试", true);
                        return;
                    }
                }

                // 开始填充表单
                this.performFormFill(content, type, title, keyPrefix);
            },

            // 执行表单填充
            performFormFill(content, type, title, keyPrefix) {
                // 定义类型映射
                const typeMap = {
                    "Novel": { id: "cat_novel", tpl: "Novel" },
                    "Manga": { id: "cat_comic", tpl: "Manga" }
                };

                const category = typeMap[type];
                if (!category) {
                    log(`未知条目类型: ${type}`);
                    return;
                }

                notification.show("正在填充条目信息...");
                log(`准备填充 ${type} 类型的条目，标题: ${title || '无标题'}`);

                // 等待表单加载
                this.waitForForm(category, content, title, keyPrefix);
            },

            // 等待表单加载
            waitForForm(category, content, title, keyPrefix) {
                // 检查表单是否加载完成
                const checkForm = () => {
                    const infoboxInput = document.querySelector("#subject_infobox");
                    const titleInput = document.querySelector('input[name="subject_title"]');
                    const typeRadio = document.getElementById(category.id);
                    return infoboxInput && titleInput && typeRadio;
                };

                // 如果表单已加载，立即填充
                if (checkForm()) {
                    this.doFillForm(category, content, title, keyPrefix);
                    return;
                }

                // 否则等待表单加载
                log("等待表单加载...");
                let attempts = 0;
                const maxAttempts = 30; // 最多等待6秒

                const waitInterval = setInterval(() => {
                    attempts++;
                    if (checkForm()) {
                        clearInterval(waitInterval);
                        log("表单已加载，开始填充");
                        this.doFillForm(category, content, title, keyPrefix);
                        return;
                    }

                    if (attempts >= maxAttempts) {
                        clearInterval(waitInterval);
                        log("表单加载超时");
                        notification.show("表单加载超时，请手动填写", true);
                    }
                }, 200);
            },

            // 实际执行表单填充
            doFillForm(category, content, title, keyPrefix) {
                try {
                    // 选择分类
                    const typeRadio = document.getElementById(category.id);
                    if (typeRadio) {
                        typeRadio.click();
                        log(`已选择类型: ${category.tpl}`);
                    } else {
                        log(`未找到类型选择框: ${category.id}`);
                    }

                    // 等待分类选择完成后填充表单
                    setTimeout(() => {
                        try {
                            // 填充内容
                            const infobox = document.querySelector("#subject_infobox");
                            if (infobox) {
                                infobox.value = content;
                                log("已填充Infobox内容");
                                infobox.dispatchEvent(new Event('change', { bubbles: true }));
                            }

                            // 填充标题
                            const titleInput = document.querySelector('input[name="subject_title"]');
                            if (titleInput && title) {
                                const newTitle = entryHandler.processTitle(title);
                                titleInput.value = newTitle;
                                log(`已填充标题: ${newTitle}`);
                                titleInput.dispatchEvent(new Event('change', { bubbles: true }));
                            }

                            // 根据需要切换模式
                            const currentMode = document.querySelector('#header_infobox');
                            const wikiModeLink = document.querySelector('a[onclick*="NormaltoWCODE"]');
                            const simpleModeLink = document.querySelector('a[onclick*="WCODEtoNormal"]');
                            const isInWikiMode = currentMode && currentMode.textContent.includes('WCODE');

                            if (!isInWikiMode && wikiModeLink) {
                                wikiModeLink.click();
                                log("已切换到wiki模式");
                            } else if (isInWikiMode && simpleModeLink) {
                                simpleModeLink.click();
                                log("已切换到入门模式");
                            }

                            // 显示成功通知
                            notification.show("条目信息填充完成");

                            // 清理临时数据
                            if (keyPrefix) {
                                storage.remove(`${keyPrefix}_content`);
                                storage.remove(`${keyPrefix}_type`);
                                storage.remove(`${keyPrefix}_title`);
                                log("已清理临时数据");
                            }
                        } catch (e) {
                            notification.show(`填充表单时出错: ${e.message}`, true);
                            console.error(e);
                        }
                    }, 500);
                } catch (e) {
                    notification.show(`选择分类时出错: ${e.message}`, true);
                    console.error(e);
                }
            }
        };

        // 初始化
        function init() {
            log("Bangumi条目创建助手初始化中...");

            // 若当前页面是条目页面，添加"新条目"按钮
            if (location.pathname.match(/^\/subject\/\d+$/)) {
                log("检测到条目页面");
                pageFeatures.addCreateButton();
            }

            // 若当前页面是创建条目页，添加功能
            if (location.pathname.includes("/new_subject/1")) {
                log("检测到新建条目页面");
                pageFeatures.addCloneButton();

                // 如果有source参数，则填充表单
                if (location.search.includes("source=")) {
                    log("检测到source参数，准备填充表单");
                    setTimeout(function() {
                        pageFeatures.fillNewSubjectForm();
                    }, 500);
                }
            }

            log("初始化完成");
        }

        // 页面加载完成后执行初始化
        window.addEventListener("load", init);
        // 也可以在DOM加载完成后就执行，提高响应速度
        if (document.readyState === "interactive" || document.readyState === "complete") {
            init();
        } else {
            document.addEventListener("DOMContentLoaded", init);
        }
    }


    /* =======
     编辑预览
    ========= */
    function initBgmPreview() {

        // 标记预览功能是否已禁用
        let previewDisabled = false;

        // 保存原始按钮的引用，防止重复创建
        let originalButtons = new Map();

        // 拦截提交按钮，添加预览逻辑并确保漫画条目类型正确
        function interceptSubmitButtons() {
            const submitButtons = document.querySelectorAll('input.inputBtn[value="提交"][name="submit"][type="submit"]');
            submitButtons.forEach(button => {
                if (originalButtons.has(button)) return;
                const originalForm = button.form;
                const originalSubmitEvent = originalForm ? originalForm.onsubmit : null;
                originalButtons.set(button, {
                    originalOnClick: button.onclick,
                    originalForm: originalForm,
                    originalSubmitEvent: originalSubmitEvent,
                    handled: true
                });
                button.onclick = function(event) {
                    if (previewDisabled) return true;
                    event.preventDefault();
                    showPreview(button);
                    return false;
                };
                if (originalForm) {
                    originalForm.onsubmit = function(event) {
                        if (previewDisabled) {
                            return originalSubmitEvent ? originalSubmitEvent.call(this, event) : true;
                        }
                        if (event && event.submittedViaPreview) {
                            const infobox = document.querySelector('#subject_infobox');
                            const isManga = infobox && infobox.value.includes('Infobox animanga/Manga');
                            if (isManga) {
                                let platformInput = document.querySelector('input[name="platform"][value="1001"]');
                                if (platformInput && !platformInput.checked) {
                                    platformInput.checked = true;
                                    platformInput.click();
                                    console.log('强制选择了漫画类型(platform=1001)');
                                }
                                if (!document.querySelector('input[name="platform"][type="hidden"]')) {
                                    const hiddenPlatform = document.createElement('input');
                                    hiddenPlatform.type = 'hidden';
                                    hiddenPlatform.name = 'platform';
                                    hiddenPlatform.value = '1001';
                                    originalForm.appendChild(hiddenPlatform);
                                    console.log('添加了隐藏的 platform 字段：value=1001');
                                } else {
                                    const existingHidden = document.querySelector('input[name="platform"][type="hidden"]');
                                    if (existingHidden) {
                                        existingHidden.value = '1001';
                                        console.log('更新了隐藏的 platform 字段：value=1001');
                                    }
                                }
                                const comicRadio = document.querySelector('#cat_comic');
                                if (comicRadio && !comicRadio.checked) {
                                    comicRadio.click();
                                    console.log('重新选择了漫画单选框(cat_comic)');
                                }
                                if (typeof WikiTpl === 'function') {
                                    WikiTpl('Manga');
                                    console.log('手动调用了 WikiTpl("Manga")');
                                }
                            }
                            return originalSubmitEvent ? originalSubmitEvent.call(this, event) : true;
                        }
                        event.preventDefault();
                        showPreview(button);
                        return false;
                    };
                }
            });
        }

        // 保存表单数据
        function saveFormData() {
            const formData = {};
            document.querySelectorAll('input, textarea, select').forEach(el => {
                if (el.name) {
                    formData[el.name] = el.value;
                }
            });
            return formData;
        }

        // 恢复表单数据
        function restoreFormData(formData) {
            for (const name in formData) {
                const el = document.querySelector(`[name="${name}"]`);
                if (el) {
                    el.value = formData[name];
                }
            }
        }

        // 阻止Enter键提交表单
        function preventEnterSubmit() {
            document.addEventListener('keydown', function(event) {
                if (event.key === 'Enter' && !previewDisabled &&
                    !(document.activeElement &&
                      (document.activeElement.tagName === 'INPUT' ||
                       document.activeElement.tagName === 'TEXTAREA'))) {
                    event.preventDefault();
                    return false;
                }
            });
        }

        // 切换到WCODE模式并等待内容加载
        function switchToWCODEMode(callback) {
            const wikiModeLink = document.querySelector('a.l[onclick="NormaltoWCODE()"]');
            if (!wikiModeLink) {
                console.log('已在WCODE模式或无法切换');
                callback();
                return;
            }
            console.log('切换到WCODE模式');
            wikiModeLink.click();
            waitForInfobox(callback);
        }

        // 等待Infobox内容加载
        function waitForInfobox(callback, maxAttempts = 30, interval = 200) {
            let attempts = 0;
            const checkInfobox = () => {
                const infobox = document.querySelector('#subject_infobox');
                if (infobox && infobox.value) {
                    console.log('Infobox内容已加载');
                    callback();
                } else if (attempts >= maxAttempts) {
                    console.error('Infobox加载超时');
                    callback();
                } else {
                    attempts++;
                    setTimeout(checkInfobox, interval);
                }
            };
            checkInfobox();
        }

        // 收集所有表单字段数据并获取原始数据
        function collectFormData() {
            const formData = {};

            // 收集标题
            const titleInput = document.querySelector('input[name="subject_title"]');
            if (titleInput) {
                formData.title = {
                    current: titleInput.value,
                    original: titleInput.defaultValue || ""
                };
            }

            // 收集Infobox
            const infobox = document.querySelector('#subject_infobox');
            if (infobox) {
                formData.infobox = {
                    current: infobox.value,
                    original: window.originalInfoboxContent || ""
                };
            }

            // 收集简介
            const summary = document.querySelector('textarea[name="subject_summary"]');
            if (summary) {
                formData.summary = {
                    current: summary.value,
                    original: summary.defaultValue || ""
                };
            }

            // 收集标签
            const tags = document.querySelector('input[name="subject_meta_tags"]');
            if (tags) {
                formData.tags = {
                    current: tags.value,
                    original: tags.defaultValue || ""
                };
            }

            // 收集编辑摘要
            const editSummary = document.querySelector('input[name="editSummary"]');
            if (editSummary) {
                formData.editSummary = {
                    current: editSummary.value,
                    original: editSummary.defaultValue || ""
                };
            }

            return formData;
        }

        // Myers差分算法 - 用于精确的字符级差异检测
        function myersDiff(text1, text2) {
            const n = text1.length;
            const m = text2.length;
            const max = n + m;
            const v = {};
            const trace = [];

            v[1] = 0;

            for (let d = 0; d <= max; d++) {
                trace.push({...v});

                for (let k = -d; k <= d; k += 2) {
                    let x;
                    if (k === -d || (k !== d && v[k - 1] < v[k + 1])) {
                        x = v[k + 1];
                    } else {
                        x = v[k - 1] + 1;
                    }

                    let y = x - k;

                    while (x < n && y < m && text1[x] === text2[y]) {
                        x++;
                        y++;
                    }

                    v[k] = x;

                    if (x >= n && y >= m) {
                        return backtrack(trace, text1, text2, d);
                    }
                }
            }

            return [];
        }

        // 回溯Myers算法结果
        function backtrack(trace, text1, text2, d) {
            const diff = [];
            let x = text1.length;
            let y = text2.length;

            for (let i = d; i >= 0; i--) {
                const v = trace[i];
                const k = x - y;

                let prevK;
                if (k === -i || (k !== i && v[k - 1] < v[k + 1])) {
                    prevK = k + 1;
                } else {
                    prevK = k - 1;
                }

                const prevX = v[prevK];
                const prevY = prevX - prevK;

                while (x > prevX && y > prevY) {
                    diff.unshift({ type: 'equal', char: text1[x - 1] });
                    x--;
                    y--;
                }

                if (y > prevY) {
                    diff.unshift({ type: 'add', char: text2[y - 1] });
                    y--;
                } else if (x > prevX) {
                    diff.unshift({ type: 'delete', char: text1[x - 1] });
                    x--;
                }
            }

            return diff;
        }

        // 改进的行级差分算法
        function diffLines(originalLines, newLines) {
            if (originalLines.length === 0 && newLines.length === 0) {
                return [];
            }
            if (originalLines.length === 0) {
                return newLines.map(line => ({ old: '', new: line, type: 'add' }));
            }
            if (newLines.length === 0) {
                return originalLines.map(line => ({ old: line, new: '', type: 'delete' }));
            }

            const lcs = computeLCS(originalLines, newLines);
            const result = [];
            let i = 0, j = 0;
            let lcsIndex = 0;

            while (i < originalLines.length || j < newLines.length) {
                if (lcsIndex < lcs.length &&
                    i === lcs[lcsIndex].oldIndex &&
                    j === lcs[lcsIndex].newIndex) {
                    const oldLine = originalLines[i];
                    const newLine = newLines[j];

                    if (oldLine === newLine) {
                        result.push({ old: oldLine, new: newLine, type: 'equal' });
                    } else {
                        result.push({ old: oldLine, new: newLine, type: 'modify' });
                    }

                    i++;
                    j++;
                    lcsIndex++;
                } else if (lcsIndex < lcs.length) {
                    const nextOldIndex = lcs[lcsIndex].oldIndex;
                    const nextNewIndex = lcs[lcsIndex].newIndex;

                    if (i < nextOldIndex && j < nextNewIndex) {
                        // 同时有删除和添加，配对处理
                        result.push({
                            old: originalLines[i],
                            new: newLines[j],
                            type: 'modify'
                        });
                        i++;
                        j++;
                    } else if (i < nextOldIndex) {
                        result.push({ old: originalLines[i], new: '', type: 'delete' });
                        i++;
                    } else if (j < nextNewIndex) {
                        result.push({ old: '', new: newLines[j], type: 'add' });
                        j++;
                    }
                } else {
                    if (i < originalLines.length && j < newLines.length) {
                        result.push({
                            old: originalLines[i],
                            new: newLines[j],
                            type: 'modify'
                        });
                        i++;
                        j++;
                    } else if (i < originalLines.length) {
                        result.push({ old: originalLines[i], new: '', type: 'delete' });
                        i++;
                    } else if (j < newLines.length) {
                        result.push({ old: '', new: newLines[j], type: 'add' });
                        j++;
                    }
                }
            }

            return result;
        }

        // 计算最长公共子序列(LCS)
        function computeLCS(originalLines, newLines) {
            const m = originalLines.length;
            const n = newLines.length;
            const dp = Array(m + 1).fill(null).map(() => Array(n + 1).fill(0));

            for (let i = 1; i <= m; i++) {
                for (let j = 1; j <= n; j++) {
                    const oldLine = originalLines[i - 1].trim();
                    const newLine = newLines[j - 1].trim();

                    if (oldLine === newLine) {
                        dp[i][j] = dp[i - 1][j - 1] + 1;
                    } else {
                        const similarity = calculateSimilarity(oldLine, newLine);
                        if (similarity > 0.8) {
                            dp[i][j] = dp[i - 1][j - 1] + 0.8;
                        } else {
                            dp[i][j] = Math.max(dp[i - 1][j], dp[i][j - 1]);
                        }
                    }
                }
            }

            const lcs = [];
            let i = m, j = n;

            while (i > 0 && j > 0) {
                const oldLine = originalLines[i - 1].trim();
                const newLine = newLines[j - 1].trim();

                if (oldLine === newLine || calculateSimilarity(oldLine, newLine) > 0.8) {
                    lcs.unshift({ oldIndex: i - 1, newIndex: j - 1 });
                    i--;
                    j--;
                } else if (dp[i - 1][j] > dp[i][j - 1]) {
                    i--;
                } else {
                    j--;
                }
            }

            return lcs;
        }

        // 计算相似度函数（改进版）
        function calculateSimilarity(str1, str2) {
            if (!str1 && !str2) return 1.0;
            if (!str1 || !str2) return 0.0;

            const s1 = str1.trim();
            const s2 = str2.trim();

            if (s1 === s2) return 1.0;

            const len1 = s1.length;
            const len2 = s2.length;
            const maxLen = Math.max(len1, len2);

            if (maxLen === 0) return 1.0;

            // 使用编辑距离算法
            const distance = levenshteinDistance(s1, s2);
            return 1 - (distance / maxLen);
        }

        // Levenshtein编辑距离
        function levenshteinDistance(str1, str2) {
            const len1 = str1.length;
            const len2 = str2.length;
            const matrix = Array(len1 + 1).fill(null).map(() => Array(len2 + 1).fill(0));

            for (let i = 0; i <= len1; i++) matrix[i][0] = i;
            for (let j = 0; j <= len2; j++) matrix[0][j] = j;

            for (let i = 1; i <= len1; i++) {
                for (let j = 1; j <= len2; j++) {
                    const cost = str1[i - 1] === str2[j - 1] ? 0 : 1;
                    matrix[i][j] = Math.min(
                        matrix[i - 1][j] + 1,
                        matrix[i][j - 1] + 1,
                        matrix[i - 1][j - 1] + cost
                    );
                }
            }

            return matrix[len1][len2];
        }

        // 精确标记字符级差异（修复 undefined 问题版）
        function highlightCharDifferences(oldStr, newStr) {
            if (oldStr === newStr) {
                return { old: escapeHtml(oldStr), new: escapeHtml(newStr) };
            }

            if (!oldStr && newStr) {
                return {
                    old: '',
                    new: `<span class="add">${escapeHtml(newStr)}</span>`
                };
            }

            if (oldStr && !newStr) {
                return {
                    old: `<span class="del">${escapeHtml(oldStr)}</span>`,
                    new: '<span class="empty-placeholder">（已删除）</span>'
                };
            }

            const diff = myersDiff(oldStr, newStr);
            let oldHtml = '';
            let newHtml = '';
            let addBuffer = '';
            let delBuffer = '';

            diff.forEach((item) => {
                // 核心修复：确保 char 存在，如果是 undefined 则转换为空字符串
                const char = item.char || '';

                if (item.type === 'equal') {
                    // 先输出缓存的差异
                    if (delBuffer) {
                        oldHtml += `<span class="del">${escapeHtml(delBuffer)}</span>`;
                        delBuffer = '';
                    }
                    if (addBuffer) {
                        newHtml += `<span class="add">${escapeHtml(addBuffer)}</span>`;
                        addBuffer = '';
                    }
                    // 输出相同的字符
                    oldHtml += escapeHtml(char);
                    newHtml += escapeHtml(char);
                } else if (item.type === 'delete') {
                    delBuffer += char;
                } else if (item.type === 'add') {
                    addBuffer += char;
                }
            });

            // 输出剩余的差异
            if (delBuffer) {
                oldHtml += `<span class="del">${escapeHtml(delBuffer)}</span>`;
            }
            if (addBuffer) {
                newHtml += `<span class="add">${escapeHtml(addBuffer)}</span>`;
            }

            return { old: oldHtml, new: newHtml };
        }

        // 创建差异对比视图的UI
        function createDiffView(title, originalText, newText) {
            const section = document.createElement('div');
            section.className = 'preview-section';

            const sectionTitle = document.createElement('div');
            sectionTitle.className = 'preview-section-title';
            sectionTitle.textContent = title;
            section.appendChild(sectionTitle);

            const diffContainer = document.createElement('div');
            diffContainer.className = 'preview-diff-container';

            const header = document.createElement('div');
            header.className = 'preview-diff-header';
            header.innerHTML = '<span class="old-label">修改前</span><span class="new-label">修改后</span>';
            diffContainer.appendChild(header);

            const content = document.createElement('div');
            content.className = 'preview-diff-content';

            const ori = originalText.split('\n');
            const neu = newText.split('\n');
            const lines = diffLines(ori, neu);

            let addCount = 0;
            let delCount = 0;
            let modCount = 0;

            lines.forEach((pair, idx) => {
                const line = document.createElement('div');
                line.className = 'preview-diff-line';

                if (pair.type === 'equal') {
                    line.classList.add('unchanged');
                } else {
                    line.classList.add('changed');
                    if (pair.type === 'add') addCount++;
                    if (pair.type === 'delete') delCount++;
                    if (pair.type === 'modify') modCount++;
                }

                const lineNumber = document.createElement('div');
                lineNumber.className = 'preview-diff-line-number';
                lineNumber.textContent = idx + 1;
                line.appendChild(lineNumber);

                const oldContent = document.createElement('div');
                oldContent.className = 'preview-diff-old';
                const newContent = document.createElement('div');
                newContent.className = 'preview-diff-new';

                if (pair.type === 'equal') {
                    oldContent.innerHTML = escapeHtml(pair.old);
                    newContent.innerHTML = escapeHtml(pair.new);
                } else if (pair.type === 'delete') {
                    oldContent.innerHTML = `<span class="del">${escapeHtml(pair.old)}</span>`;
                    newContent.innerHTML = '<span class="empty-placeholder">（已删除）</span>';
                } else if (pair.type === 'add') {
                    oldContent.innerHTML = '<span class="empty-placeholder">（新增）</span>';
                    newContent.innerHTML = `<span class="add">${escapeHtml(pair.new)}</span>`;
                } else if (pair.type === 'modify') {
                    const diffs = highlightCharDifferences(pair.old, pair.new);
                    oldContent.innerHTML = diffs.old;
                    newContent.innerHTML = diffs.new;
                }

                line.appendChild(oldContent);
                line.appendChild(newContent);
                content.appendChild(line);
            });

            diffContainer.appendChild(content);

            // 添加统计信息
            if (addCount > 0 || delCount > 0 || modCount > 0) {
                const stats = document.createElement('div');
                stats.className = 'stats-info';
                stats.innerHTML = `变更统计: <span class="stats-add">${addCount} 行新增</span>, <span class="stats-del">${delCount} 行删除</span>, ${modCount} 行修改`;
                diffContainer.appendChild(stats);
            }

            section.appendChild(diffContainer);
            return section;
        }

        // HTML 转义函数
        function escapeHtml(str) {
            if (!str) return '';
            return str.replace(/&/g, '&amp;')
                .replace(/</g, '&lt;')
                .replace(/>/g, '&gt;')
                .replace(/"/g, '&quot;')
                .replace(/'/g, '&#39;')
                .replace(/\s/g, (match) => {
                if (match === ' ') return ' ';
                if (match === '\t') return '&nbsp;&nbsp;&nbsp;&nbsp;';
                return match;
            });
        }

        // 检查是否已存在预览界面
        function isPreviewActive() {
            return document.querySelector('.preview-overlay') !== null;
        }

        // 关闭预览界面
        function closePreview() {
            const overlay = document.querySelector('.preview-overlay');
            if (overlay) {
                document.body.removeChild(overlay);
            }
        }

        // 显示预览界面
        function showPreview(originalButton) {
            if (isPreviewActive()) {
                closePreview();
            }

            // 检查当前是否在Normal模式，如果是，则切换到WCODE模式
            switchToWCODEMode(() => {
                // 保存当前表单数据以便恢复
                const savedFormData = saveFormData();
                // 获取表单数据
                const formData = collectFormData();

                const overlay = document.createElement('div');
                overlay.className = 'preview-overlay';
                const container = document.createElement('div');
                container.className = 'preview-container';
                const closeButton = document.createElement('div');
                closeButton.className = 'preview-close';
                closeButton.textContent = '×';
                closeButton.onclick = function() {
                    restoreFormData(savedFormData);
                    closePreview();
                };
                const header = document.createElement('div');
                header.className = 'preview-header';
                header.textContent = '📋 提交预览 - 请仔细检查您的修改';
                const content = document.createElement('div');
                content.className = 'preview-content';
                const fieldNames = {
                    title: '📌 标题',
                    infobox: '📦 条目信息',
                    summary: '📝 简介',
                    tags: '🏷️ 标签',
                    editSummary: '✏️ 编辑摘要'
                };
                let hasContent = false;
                for (const key in formData) {
                    if (formData[key] && formData[key].current !== formData[key].original) {
                        const fieldTitle = fieldNames[key] || key;
                        content.appendChild(createDiffView(fieldTitle, formData[key].original, formData[key].current));
                        hasContent = true;
                    }
                }
                if (!hasContent) {
                    const noChanges = document.createElement('div');
                    noChanges.className = 'no-changes-message';
                    noChanges.textContent = '✅ 没有检测到内容变化';
                    content.appendChild(noChanges);
                }
                const buttonsContainer = document.createElement('div');
                buttonsContainer.className = 'preview-buttons';
                const cancelButton = document.createElement('button');
                cancelButton.className = 'preview-button preview-button-cancel';
                cancelButton.textContent = '取消';
                cancelButton.onclick = function() {
                    restoreFormData(savedFormData);
                    closePreview();
                };
                const confirmButton = document.createElement('button');
                confirmButton.className = 'preview-button preview-button-confirm';
                confirmButton.textContent = '确认';
                const form = originalButton.form;
                confirmButton.onclick = function() {
                    closePreview();
                    previewDisabled = true;
                    if (form) {
                        const submitEvent = new Event('submit', { bubbles: true, cancelable: true });
                        submitEvent.submittedViaPreview = true;
                        form.dispatchEvent(submitEvent);
                    } else {
                        originalButton.click();
                    }
                };
                buttonsContainer.appendChild(cancelButton);
                buttonsContainer.appendChild(confirmButton);
                container.appendChild(closeButton);
                container.appendChild(header);
                container.appendChild(content);
                container.appendChild(buttonsContainer);
                overlay.appendChild(container);
                document.body.appendChild(overlay);

                // 添加ESC键关闭功能
                const escHandler = function(e) {
                    if (e.key === 'Escape') {
                        restoreFormData(savedFormData);
                        closePreview();
                        document.removeEventListener('keydown', escHandler);
                    }
                };
                document.addEventListener('keydown', escHandler);
            });
        }

        // 捕获原始Infobox内容
        function captureOriginalEditorContent() {
            setTimeout(() => {
                switchToWCODEMode(() => {
                    const infobox = document.querySelector('#subject_infobox');
                    if (infobox) {
                        window.originalInfoboxContent = infobox.defaultValue || infobox.value;
                        console.log('✅ 捕获原始Infobox内容成功');
                    }
                });
            }, 1000);
        }

        // 修复按钮消失问题
        function fixButtonDisappearing() {
            const observer = new MutationObserver(function(mutations) {
                mutations.forEach(function(mutation) {
                    if (mutation.removedNodes.length > 0) {
                        Array.from(mutation.removedNodes).forEach(node => {
                            if (node.nodeType === 1 &&
                                (node.matches && node.matches('input.inputBtn[value="提交"]') ||
                                 node.querySelector && node.querySelector('input.inputBtn[value="提交"]'))) {
                                setTimeout(interceptSubmitButtons, 0);
                            }
                        });
                    }
                });
            });
            const config = { childList: true, subtree: true };
            observer.observe(document.body, config);
        }

        // 页面加载完成后初始化
        window.addEventListener('load', function() {
            console.log('Bangumi表单提交预览脚本（增强版）已加载');
            captureOriginalEditorContent();
            interceptSubmitButtons();
            fixButtonDisappearing();
            preventEnterSubmit();
        });
    }


    /* ===========
     启动所有功能
    ============== */
    function startEnhancer() {
        initNavButtons();
        observeURLChanges();
        initCoverUpload();
        initBatchRelation();
        initBgmDropdownMenu();
        initBgmCreateSubject();
        initBgmPreview();
        console.log("Bangumi Ultimate Enhancer 已启动");
    }
    
    // 在DOM加载完成后启动脚本
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', startEnhancer);
    } else {
        startEnhancer();
    }
    
})();