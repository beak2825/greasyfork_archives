// ==UserScript==
// @name         Bangumi 小组评论分享图片生成器
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  生成 Bangumi 小组评论分享图片
// @license      MIT
// @match        https://bgm.tv/group/topic/*
// @match        https://bangumi.tv/group/topic/*
// @match        https://chii.in/group/topic/*
// @match        http://bgm.tv/group/topic/*
// @match        http://bangumi.tv/group/topic/*
// @match        https://chii.in/group/topic/*
// @require      https://cdnjs.cloudflare.com/ajax/libs/html2canvas/1.4.1/html2canvas.min.js
// @require      https://cdnjs.cloudflare.com/ajax/libs/qrcodejs/1.0.0/qrcode.min.js
// @grant        GM_addStyle
// @grant        GM_xmlhttpRequest
// @grant        GM_setValue
// @grant        GM_getValue
// @connect      bgm.tv
// @connect      bangumi.tv
// @connect      chii.in
// @downloadURL https://update.greasyfork.org/scripts/545192/Bangumi%20%E5%B0%8F%E7%BB%84%E8%AF%84%E8%AE%BA%E5%88%86%E4%BA%AB%E5%9B%BE%E7%89%87%E7%94%9F%E6%88%90%E5%99%A8.user.js
// @updateURL https://update.greasyfork.org/scripts/545192/Bangumi%20%E5%B0%8F%E7%BB%84%E8%AF%84%E8%AE%BA%E5%88%86%E4%BA%AB%E5%9B%BE%E7%89%87%E7%94%9F%E6%88%90%E5%99%A8.meta.js
// ==/UserScript==

(function() {
    'use strict';

    let bangumiLogoDataUrl = null;

    // --- v1.1 CSS Styles ---
    GM_addStyle(`
        /* --- Modal and general UI styles (v1.1 Refined) --- */
        .share-script-modal-backdrop {
            position: fixed; top: 0; left: 0; width: 100%; height: 100%;
            background-color: rgba(0,0,0,0.65); z-index: 10000;
            display: flex; justify-content: center; align-items: center;
        }
        .share-script-modal-content {
            background-color: #f7f7f7; color: #333; padding: 25px;
            border-radius: 12px; box-shadow: 0 8px 30px rgba(0,0,0,0.2);
            max-height: 85vh; overflow-y: auto; font-size: 14px;
            position: relative; line-height: 1.6;
            -webkit-font-smoothing: antialiased; -moz-osx-font-smoothing: grayscale;
        }
        #shareOptionsModalContent { width: 480px; max-width: 90vw; }
        #shareOptionsModalContent h3 { margin-top: 0; margin-bottom: 24px; color: #111; border-bottom: 2px solid #e0e0e0; padding-bottom: 12px; font-size: 20px; font-weight: 700; text-align: center; }
        
        /* Option groups for better organization */
        .option-group { background: #f8f9fa; border-radius: 10px; padding: 18px; margin-bottom: 16px; border: 1px solid #e9ecef; }
        .option-group-title { font-size: 14px; font-weight: 600; color: #495057; margin-bottom: 14px; display: flex; align-items: center; gap: 8px; }
        .option-group-title::before { content: "●"; color: #007bff; font-size: 12px; }
        
        #shareOptionsModalContent label { display: flex; align-items: center; margin-bottom: 10px; cursor: pointer; padding: 4px 0; }
        #shareOptionsModalContent input[type="checkbox"] { width: 18px; height: 18px; margin-right: 12px; cursor: pointer; }
        #shareOptionsModalContent select, #shareOptionsModalContent button { margin-right: 10px; height: 36px; padding: 0 12px; border: 1px solid #ced4da; border-radius: 6px; }
        #shareOptionsModalContent select { background-color: white; color: #111; }
        
        #shareOptionsModalContent .sub-reply-selection { margin-top: 8px; max-height: 200px; overflow-y: auto; border: 1px solid #e0e0e0; padding: 14px; border-radius: 8px; background-color: #fff; }
        #shareOptionsModalContent .sub-reply-selection h4 { margin-top: 0; margin-bottom: 12px; font-size: 15px; font-weight: bold; color: #495057; }
        
        #shareOptionsModalContent details { margin-top: 20px; border-top: 1px solid #e0e0e0; padding-top: 18px; }
        #shareOptionsModalContent summary { cursor: pointer; font-weight: bold; color: #555; padding: 8px 0; font-size: 15px; }
        #shareOptionsModalContent details > div { padding-top: 12px; }
        #customCssArea { width: 100%; min-height: 100px; font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace; font-size: 12px; padding: 12px; border: 1px solid #e0e0e0; border-radius: 8px; display: none; background-color: #f8f9fa; }
        
        /* Improved button layout */
        .modal-buttons { 
            display: flex; justify-content: space-between; align-items: center; 
            margin-top: 28px; padding-top: 20px; border-top: 2px solid #e9ecef; 
        }
        .modal-buttons-left { display: flex; gap: 10px; }
        .modal-buttons-right { display: flex; gap: 10px; }
        .modal-buttons button { 
            padding: 12px 24px; cursor: pointer; border: none; border-radius: 8px; 
            font-size: 14px; font-weight: 600; transition: all 0.2s ease; 
            min-width: 80px; height: auto;
        }
        .btn-primary { background-color: #28a745; color: white; }
        .btn-primary:hover { background-color: #218838; transform: translateY(-1px); }
        .btn-secondary { background-color: #6c757d; color: white; }
        .btn-secondary:hover { background-color: #5a6268; transform: translateY(-1px); }
        .btn-outline { background-color: transparent; color: #6c757d; border: 1px solid #6c757d !important; }
        .btn-outline:hover { background-color: #6c757d; color: white; }
        #generateShareImageBtn { background-color: #28a745; color: white; }
        #generateShareImageBtn:hover { background-color: #218838; transform: translateY(-1px); }
        #imagePreviewModalContent { text-align: center; max-width: 90vw; }
        #imagePreviewModalContent img { max-width: 100%; max-height: calc(80vh - 120px); border: 1px solid #ddd; margin: 20px auto; border-radius: 8px; display: block; box-shadow: 0 4px 15px rgba(0,0,0,0.15); }

        /* --- Themed Card Layout --- */
        .image-host-container {
            /* Theme variables (Air / default) */
            --bg: #f8f9fa;
            --card: #ffffff;
            --text: #212529;
            --muted: #868e96;
            --border: #e9ecef;
            --accent: #0078D7;
            --op: rgba(240,145,153,0.06);
            --quote-bg: #f1f3f5;
            --quote-border: #ced4da;
            --shadow: 0 10px 30px rgba(0,0,0,0.05);
            --radius: 12px;

            width: 750px; padding: 32px; background-color: var(--bg) !important; position: relative;
            border: 1px solid var(--border); border-radius: var(--radius); box-shadow: var(--shadow);
            font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
            color: var(--text) !important; line-height: 1.6;
        }
        .image-host-container.theme-ink {
            --bg: #16181c;
            --card: #1e2126;
            --text: #e6e8eb;
            --muted: #9aa0a6;
            --border: #2a2f36;
            --accent: #5cabff;
            --op: rgba(92,171,255,0.07);
            --quote-bg: #20252b;
            --quote-border: #2f353d;
            --shadow: 0 10px 30px rgba(0,0,0,0.35);
        }
        .image-host-container.theme-sakura {
            --bg: #fff6f8;
            --card: #ffffff;
            --text: #2b2b2b;
            --muted: #8c8c8c;
            --border: #ffd9e1;
            --accent: #ff6b9e;
            --op: rgba(255, 107, 158, 0.08);
            --quote-bg: #ffeaf0;
            --quote-border: #ffc4d1;
            --shadow: 0 10px 30px rgba(255, 107, 158, 0.08);
        }
        .image-host-container * { color: inherit !important; background-color: transparent !important; border: none; box-sizing: border-box; }
        .image-header { padding-bottom: 12px; margin-bottom: 12px; border-bottom: 1px solid var(--border); }
        .group-info { display: flex; align-items: center; margin-bottom: 10px; }
        .group-avatar { width: 24px; height: 24px; border-radius: 4px; margin-right: 8px; }
        .image-header-group { font-size: 14px; color: var(--muted) !important; }
        .image-header-title { font-size: 20px; font-weight: 600; color: var(--text) !important; }
        .image-corner-logo { position: absolute; top: 12px; right: 12px; height: 22px; opacity: 0.45; }

        /* Main topic post - primary but clean (no colored border or badge) */
        .topic_post {
            display: flex; align-items: flex-start; margin-bottom: 16px; padding: 18px;
            background: var(--card); border: 1px solid var(--border); border-radius: 10px;
            box-shadow: 0 2px 10px rgba(0,0,0,0.05); position: relative;
        }
        /* simple separator to distinguish from comments */
        .topic_post + .comment-item { border-top: 1px solid var(--border); }
        
        /* Comments - lighter than topic */
        .comment-item {
            display: flex; align-items: flex-start; padding: 14px; margin-bottom: 10px;
            background: var(--quote-bg); border: 1px solid var(--border);
            border-radius: 8px; position: relative;
        }
        .topic_post + .comment-item { margin-top: 0; }
        .comment-item:first-child:not(.topic_post) { margin-top: 0; }

        .topic_post .comment-avatar-wrapper { width: 52px; height: 52px; margin-right: 16px; flex-shrink: 0; border-radius: 50%; overflow: hidden; background-color: #e9ecef; }
        .comment-item .comment-avatar-wrapper { width: 46px; height: 46px; margin-right: 14px; flex-shrink: 0; border-radius: 50%; overflow: hidden; background-color: #e9ecef; }
        .comment-item .comment-avatar, .topic_post .comment-avatar { width: 100%; height: 100%; background-size: cover; background-position: center; }
        .comment-item .comment-details, .topic_post .comment-details { flex-grow: 1; min-width: 0; }
        .topic_post .comment-author { font-weight: 700; font-size: 15px; color: var(--text) !important; display: flex; align-items: center; margin-bottom: 4px;}
        .comment-item .comment-author { font-weight: 600; font-size: 14px; color: var(--text) !important; display: flex; align-items: center; margin-bottom: 4px;}
        .comment-author-op { color: #f09199 !important; }
        .op-badge { font-size: 10px; font-weight: bold; color: white !important; background-color: #f09199 !important; padding: 2px 5px; margin-left: 8px; border-radius: 4px; }
        .comment-author-sign { font-size: 12px; color: var(--muted) !important; margin-left: 8px; font-weight: normal; }
        .topic_post .comment-text { font-size: 15px; color: var(--text) !important; word-wrap: break-word; white-space: normal; line-height: 1.65; }
        .comment-item .comment-text { font-size: 14px; color: var(--text) !important; word-wrap: break-word; white-space: normal; }
        .comment-text p, .comment-text div, .comment-text blockquote, .comment-text ul, .comment-text ol { margin: 0.4em 0; }
        .comment-text p:first-child, .comment-text div:first-child { margin-top: 0; }
        .comment-text p:last-child, .comment-text div:last-child { margin-bottom: 0; }
        .comment-text.collapsed { max-height: 150px; overflow: hidden; -webkit-mask-image: linear-gradient(to bottom, black 50%, transparent 100%); mask-image: linear-gradient(to bottom, black 50%, transparent 100%); }
        .comment-text img { max-height: 1.6em; vertical-align: middle; display: inline; border-radius: 4px; }
        .comment-text a { color: var(--accent) !important; text-decoration: underline !important; }
        .comment-text .quote { padding: 12px; margin: 10px 0; background: var(--quote-bg) !important; border-left: 3px solid var(--quote-border); border-radius: 6px; }

        .sub-replies-wrapper { margin-top: 15px; padding-left: 20px; border-left: 2px solid var(--border); }
        .sub-comment-item { display: flex; align-items: flex-start; padding: 12px 0; border-top: 1px dashed var(--border); }
        .sub-comment-item:first-child { border-top: none; }
        .sub-comment-item .comment-avatar-wrapper { width: 36px; height: 36px; margin-right: 12px; }

        .image-footer { margin-top: 20px; padding-top: 15px; border-top: 1px solid var(--border); display: flex; justify-content: flex-end; align-items: center; }
        .image-footer-logo { height: 20px; opacity: 0.6; }
        .image-footer-text { font-size: 11px; color: var(--muted) !important; }
        .image-footer-left { display: none; }
        .image-footer-right { display: flex; align-items: center; gap: 12px; }
        .image-footer-qr { width: 72px; height: 72px; background: var(--card); padding: 4px; border: 1px solid var(--border); border-radius: 6px; display: flex; align-items: center; justify-content: center; }
        .image-footer-texts { display: flex; flex-direction: column; gap: 4px; }
        .image-footer-url { font-size: 11px; color: var(--muted) !important; word-break: break-all; }
    `);
    // Settings storage helpers
    const SETTINGS_KEY = 'bgm_share_card_settings_v1';
    function getStoredSettings() {
        try {
            const raw = (typeof GM_getValue === 'function') ? GM_getValue(SETTINGS_KEY) : localStorage.getItem(SETTINGS_KEY);
            return raw ? JSON.parse(raw) : {};
        } catch (_) { return {}; }
    }
    function setStoredSettings(obj) {
        try {
            const raw = JSON.stringify(obj || {});
            if (typeof GM_setValue === 'function') GM_setValue(SETTINGS_KEY, raw);
            else localStorage.setItem(SETTINGS_KEY, raw);
        } catch (_) { /* noop */ }
    }

    // --- Core Functions (fetchImage, initButtons, etc. are unchanged unless necessary) ---
    async function fetchImageAsDataURL(imageUrl) {
        if (!imageUrl || typeof imageUrl !== 'string') return null;
        const absoluteUrl = imageUrl.startsWith('//') ? 'https:' + imageUrl : imageUrl;
        // Cache Bangumi logo to avoid repeated network
        if (absoluteUrl === 'https://bgm.tv/img/rc3/logo_2x.png' && bangumiLogoDataUrl) return bangumiLogoDataUrl;
        return new Promise((resolve) => {
            if (!absoluteUrl.startsWith('http')) { resolve(null); return; }
            GM_xmlhttpRequest({
                method: 'GET', url: absoluteUrl, responseType: 'blob', timeout: 15000,
                onload: (response) => {
                    if (response.status === 200 && response.response) {
                        const reader = new FileReader();
                        reader.onloadend = () => {
                            const dataUrl = reader.result;
                            if (absoluteUrl === 'https://bgm.tv/img/rc3/logo_2x.png') bangumiLogoDataUrl = dataUrl;
                            resolve(dataUrl);
                        };
                        reader.onerror = () => resolve(null);
                        reader.readAsDataURL(response.response);
                    } else { resolve(null); }
                },
                onerror: () => resolve(null), ontimeout: () => resolve(null)
            });
        });
    }

    function addShareButtonToMenu(menuUl, mainCommentOrPostElement) {
        if (!menuUl || menuUl.querySelector('.share-comment-menu-item')) return;
        const listItem = document.createElement('li');
        const anchor = document.createElement('a');
        anchor.href = 'javascript:void(0);';
        anchor.textContent = '分享图片';
        anchor.className = 'share-comment-menu-item';
        anchor.style.cursor = 'pointer';
        anchor.addEventListener('click', (e) => {
            e.preventDefault(); e.stopPropagation();
            showOptionsModal(mainCommentOrPostElement);
        });
        listItem.appendChild(anchor);
        const ignoreUserLi = Array.from(menuUl.children).find(li => li.textContent.includes('绝交'));
        if (ignoreUserLi) menuUl.insertBefore(listItem, ignoreUserLi); else menuUl.appendChild(listItem);
    }

    function initShareButtons() {
        const processElement = (element) => {
            const actionDivs = element.querySelectorAll('.post_actions.re_info > .action.dropdown');
            actionDivs.forEach(actionDiv => {
                // Some dropdowns are for likes; skip those
                if (!actionDiv.querySelector('a.like_dropdown')) {
                    const menuUl = actionDiv.querySelector('ul');
                    if (menuUl) addShareButtonToMenu(menuUl, element);
                }
            });
        };
        // Replies only (do not inject on OP)
        const comments = document.querySelectorAll('div.row.row_reply[id^="post_"]');
        comments.forEach(processElement);
    }

    function setupModalCloseEvents(modalContentDiv, modalBackdropDiv, closeXButton) {
        const cleanup = () => {
            if (modalBackdropDiv && modalBackdropDiv.parentNode) modalBackdropDiv.remove();
            else if (modalContentDiv && modalContentDiv.parentNode) modalContentDiv.remove();
            document.removeEventListener('keydown', escHandler);
            if (modalBackdropDiv) modalBackdropDiv.removeEventListener('click', backdropHandler);
        };
        const escHandler = (event) => { if (event.key === 'Escape') cleanup(); };
        const backdropHandler = (event) => { if (event.target === modalBackdropDiv) cleanup(); };
        document.addEventListener('keydown', escHandler);
        if (modalBackdropDiv) modalBackdropDiv.addEventListener('click', backdropHandler);
        if (closeXButton) closeXButton.addEventListener('click', cleanup);
        return cleanup;
    }

    function formatDisplayUrl(rawUrl) {
        try {
            const u = new URL(rawUrl);
            let s = u.host + u.pathname;
            if (s.length > 60) s = s.slice(0, 28) + '…' + s.slice(-26);
            return s;
        } catch (_) {
            const noProto = String(rawUrl || '').replace(/^https?:\/\//, '');
            return noProto.length > 60 ? (noProto.slice(0, 28) + '…' + noProto.slice(-26)) : noProto;
        }
    }

    async function inlineAllExternalImages(rootElement) {
        if (!rootElement) return;
        const imgNodes = Array.from(rootElement.querySelectorAll('img'));
        await Promise.all(imgNodes.map(async (img) => {
            const src = img.getAttribute('src');
            if (!src || src.startsWith('data:')) return;
            let absoluteUrl = src;
            if (src.startsWith('//')) absoluteUrl = 'https:' + src;
            else if (src.startsWith('/')) absoluteUrl = location.origin + src;
            const dataUrl = await fetchImageAsDataURL(absoluteUrl);
            if (dataUrl) {
                img.removeAttribute('srcset');
                img.src = dataUrl;
            }
        }));
    }

    // ====================================================================
    //  MODIFIED: Reworked Options Modal UI (v1.1)
    // ====================================================================
    function showOptionsModal(mainCommentElement) {
        document.querySelectorAll('.share-script-modal-backdrop').forEach(el => el.remove());

        const modalBackdrop = document.createElement('div');
        modalBackdrop.className = 'share-script-modal-backdrop';
        const modalContent = document.createElement('div');
        modalContent.id = 'shareOptionsModalContent';
        modalContent.classList.add('share-script-modal-content');

        let subRepliesHTML = '';
        const isOpPost = mainCommentElement.classList.contains('postTopic');
        if (!isOpPost) {
            const subRepliesContainer = mainCommentElement.querySelector('.topic_sub_reply');
            if (subRepliesContainer) {
                const subReplies = subRepliesContainer.querySelectorAll('.sub_reply_bg[id^="post_"]');
                if (subReplies.length > 0) {
                    subRepliesHTML = '<h4>包含子评论</h4><div class="sub-reply-selection">';
                    subReplies.forEach((subReply) => {
                        const author = subReply.querySelector('.userName a')?.textContent.trim() || '未知用户';
                        let contentPreview = subReply.querySelector('.cmt_sub_content')?.textContent.trim() || '';
                        contentPreview = contentPreview.substring(0, 30) + (contentPreview.length > 30 ? '...' : '');
                        subRepliesHTML += `<label><input type="checkbox" name="subReply" value="${subReply.id}" checked> <span>${author}: ${contentPreview}</span></label>`;
                    });
                    subRepliesHTML += '</div>';
                }
            }
        }

        // Redesigned modal with better organization
        const optionsHtml = `
            <h3>🖼️ 生成分享图片</h3>
            ${subRepliesHTML ? `<div class="option-group">${subRepliesHTML}</div>` : ''}

            <details>
                <summary>主题与显示</summary>
                <div class="option-group" style="margin-top:12px;">
                    <div class="option-group-title">主题模式</div>
                    <label style="margin-bottom:0;">
                        <select id="shareOption_theme" style="min-width: 220px; color: #111;">
                            <option value="air" selected>Air（浅色）</option>
                            <option value="ink">Ink（深色）</option>
                            <option value="sakura">Sakura（点缀）</option>
                        </select>
                    </label>
                </div>

                <div class="option-group">
                    <div class="option-group-title">显示选项</div>
                    <label><input type="checkbox" id="shareOption_showLogo" checked> <span>显示 Bangumi Logo</span></label>
                    <label><input type="checkbox" id="shareOption_showDate"> <span>显示生成时间</span></label>
                    <label><input type="checkbox" id="shareOption_showUrl"> <span>显示源主题 URL</span></label>
                    <label><input type="checkbox" id="shareOption_showQr"> <span>显示分享二维码</span></label>
                </div>

                <div class="option-group">
                    <div class="option-group-title">高级设置</div>
                    <label><input type="checkbox" id="shareOption_hideSignatures" checked> <span>隐藏用户签名</span></label>
                    <label><input type="checkbox" id="shareOption_collapseContent"> <span>折叠主题内容</span></label>

                    <div style="margin: 8px 0; display:flex; align-items:center; flex-wrap:wrap; gap:8px;">
                        <button id="btnExportTheme" type="button" class="btn-outline">导出设置</button>
                        <button id="btnImportTheme" type="button" class="btn-outline">导入设置</button>
                        <label style="margin:0 0 0 12px;">
                          <input type="checkbox" id="shareOption_enableCustomCss">
                          <span>使用自定义 CSS</span>
                        </label>
                    </div>
                    <textarea id="customCssArea" placeholder="仅作用于图片容器 .image-host-container 作用域下的样式，例如：&#10;.image-host-container .comment-text { font-size: 16px; }&#10;&#10;注意：请确保CSS语法正确，否则可能影响图片生成"></textarea>
                </div>
            </details>
            
            <div class="modal-buttons">
                <div class="modal-buttons-left">
                    <button type="button" class="btn-secondary" id="resetSettingsBtn">重置默认</button>
                </div>
                <div class="modal-buttons-right">
                    <button type="button" class="btn-outline" id="cancelBtn">取消</button>
                    <button id="generateShareImageBtn" class="btn-primary">生成图片</button>
                </div>
            </div>`;
        modalContent.insertAdjacentHTML('afterbegin', optionsHtml);

        modalBackdrop.appendChild(modalContent);
        document.body.appendChild(modalBackdrop);
        const cleanupModalListeners = setupModalCloseEvents(modalContent, modalBackdrop, null); // Pass null for closeX, we handle it inside
        // Auto-select theme based on system dark mode
        try {
            const prefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
            const themeSelect = modalContent.querySelector('#shareOption_theme');
            const saved = getStoredSettings();
            if (themeSelect) themeSelect.value = saved.theme || (prefersDark ? 'ink' : 'air');
            if (saved.customCss) {
                const ta = modalContent.querySelector('#customCssArea');
                const enable = modalContent.querySelector('#shareOption_enableCustomCss');
                if (ta && enable) { ta.value = saved.customCss; enable.checked = !!saved.enableCustomCss; ta.style.display = enable.checked ? 'block' : 'none'; }
            }
        } catch (_) { /* noop */ }
        // Toggle custom CSS area
        const enableCssCb = modalContent.querySelector('#shareOption_enableCustomCss');
        const cssArea = modalContent.querySelector('#customCssArea');
        if (enableCssCb && cssArea) enableCssCb.addEventListener('change', () => { cssArea.style.display = enableCssCb.checked ? 'block' : 'none'; });
        // Export / Import
        const exportBtn = modalContent.querySelector('#btnExportTheme');
        const importBtn = modalContent.querySelector('#btnImportTheme');
        if (exportBtn) exportBtn.addEventListener('click', () => {
            const theme = modalContent.querySelector('#shareOption_theme')?.value || 'air';
            const enable = enableCssCb?.checked || false;
            const css = cssArea?.value || '';
            const payload = JSON.stringify({ theme, enableCustomCss: enable, customCss: css });
            window.prompt('复制以下 JSON 以保存设置：', payload);
        });
        if (importBtn) importBtn.addEventListener('click', () => {
            const text = window.prompt('粘贴之前导出的 JSON：');
            if (!text) return;
            try {
                const obj = JSON.parse(text);
                const themeSelect = modalContent.querySelector('#shareOption_theme');
                if (themeSelect && obj.theme) themeSelect.value = obj.theme;
                if (enableCssCb && typeof obj.enableCustomCss === 'boolean') enableCssCb.checked = obj.enableCustomCss;
                if (cssArea && typeof obj.customCss === 'string') cssArea.value = obj.customCss;
                if (cssArea && enableCssCb) cssArea.style.display = enableCssCb.checked ? 'block' : 'none';
            } catch (e) { alert('导入失败：JSON 无效'); }
        });
        
        // Add event handlers for new buttons
        const resetBtn = modalContent.querySelector('#resetSettingsBtn');
        const cancelBtn = modalContent.querySelector('#cancelBtn');
        
        if (resetBtn) resetBtn.addEventListener('click', () => {
            // Reset to defaults
            const checkboxes = modalContent.querySelectorAll('input[type="checkbox"]');
            checkboxes.forEach(cb => {
                if (cb.id === 'shareOption_hideSignatures' || cb.id === 'shareOption_showLogo') {
                    cb.checked = true;
                } else {
                    cb.checked = false;
                }
            });
            const themeSelect = modalContent.querySelector('#shareOption_theme');
            if (themeSelect) themeSelect.value = 'air';
            if (cssArea) cssArea.value = '';
            if (cssArea && enableCssCb) {
                enableCssCb.checked = false;
                cssArea.style.display = 'none';
            }
        });
        
        if (cancelBtn) cancelBtn.addEventListener('click', () => {
            cleanupModalListeners();
        });
        
        modalContent.querySelector('#generateShareImageBtn').onclick = async () => {
            const options = {
                hideSignatures: modalContent.querySelector('#shareOption_hideSignatures').checked,
                collapseContent: modalContent.querySelector('#shareOption_collapseContent').checked,
                showLogo: modalContent.querySelector('#shareOption_showLogo').checked,
                showDate: modalContent.querySelector('#shareOption_showDate').checked,
                showUrl: modalContent.querySelector('#shareOption_showUrl').checked,
                showQr: modalContent.querySelector('#shareOption_showQr').checked,
                theme: modalContent.querySelector('#shareOption_theme')?.value || 'air',
                enableCustomCss: modalContent.querySelector('#shareOption_enableCustomCss')?.checked || false,
                customCss: modalContent.querySelector('#customCssArea')?.value || '',
                selectedSubReplyIds: isOpPost ? [] : Array.from(modalContent.querySelectorAll('input[name="subReply"]:checked')).map(cb => cb.value)
            };
            // Persist selection
            setStoredSettings({ theme: options.theme, enableCustomCss: options.enableCustomCss, customCss: options.customCss });
            cleanupModalListeners();
            await generateAndShowPreview(mainCommentElement, options);
        };
    }


    // ====================================================================
    //  MODIFIED: Reworked Image Generation Logic (v1.1)
    // ====================================================================
    async function generateAndShowPreview(mainElement, options) {
        const imageHost = document.createElement('div');
        imageHost.className = 'image-host-container';
        if (options.theme === 'ink') imageHost.classList.add('theme-ink');
        if (options.theme === 'sakura') imageHost.classList.add('theme-sakura');
        imageHost.style.position = 'absolute'; imageHost.style.left = '-9999px'; imageHost.style.top = '0px';
        document.body.appendChild(imageHost);
        if (options.enableCustomCss && options.customCss) {
            const scoped = document.createElement('style');
            scoped.textContent = options.customCss;
            imageHost.appendChild(scoped);
        }
        const headerDiv = document.createElement('div'); headerDiv.className = 'image-header';
        // Group info with avatar
        const groupAnchor = document.querySelector('#pageHeader h1 a.avatar');
        if (groupAnchor) {
            const groupInfo = document.createElement('div');
            groupInfo.className = 'group-info';
            const avatarImgEl = groupAnchor.querySelector('img');
            const groupNameText = groupAnchor.textContent.trim();
            if (avatarImgEl && avatarImgEl.getAttribute('src')) {
                const avatarData = await fetchImageAsDataURL(avatarImgEl.getAttribute('src'));
                if (avatarData) {
                    const groupAvatar = document.createElement('img');
                    groupAvatar.className = 'group-avatar';
                    groupAvatar.src = avatarData;
                    groupInfo.appendChild(groupAvatar);
                }
            }
            const groupNameSpan = document.createElement('span');
            groupNameSpan.className = 'image-header-group';
            groupNameSpan.textContent = groupNameText || '小组';
            groupInfo.appendChild(groupNameSpan);
            headerDiv.appendChild(groupInfo);
        }
        const titleEl = document.querySelector('#pageHeader h1');
        if (titleEl) { let title = titleEl.innerText.trim(); const groupText = titleEl.querySelector('span a[href^="/group/"]')?.parentElement?.innerText.trim(); if (groupText && title.startsWith(groupText)) title = title.substring(groupText.length).replace(/^»\s*/, '').trim(); else title = title.split('\n').pop().trim(); const div = document.createElement('div'); div.className = 'image-header-title'; div.textContent = title; headerDiv.appendChild(div); }
        if (headerDiv.hasChildNodes()) imageHost.appendChild(headerDiv);
        // Corner logo (top-right)
        if (options.showLogo) {
            const logoUrl = await fetchImageAsDataURL('https://bgm.tv/img/rc3/logo_2x.png');
            if (logoUrl) {
                const cornerLogo = document.createElement('img');
                cornerLogo.className = 'image-corner-logo';
                cornerLogo.src = logoUrl;
                imageHost.appendChild(cornerLogo);
            }
        }
        const opElement = document.querySelector('div.postTopic[data-item-user]');
        const opUserId = opElement ? opElement.getAttribute('data-item-user') : null;
        const isMainElementOp = mainElement.classList.contains('postTopic');
        const elementsToRender = [];
        if (opElement) { elementsToRender.push({ type: 'opPost', el: opElement, userId: opUserId }); }
        if (!isMainElementOp) { elementsToRender.push({ type: 'mainReply', el: mainElement, userId: mainElement.getAttribute('data-item-user') }); }
        options.selectedSubReplyIds.forEach(id => { const subEl = document.getElementById(id); if (subEl) elementsToRender.push({ type: 'subReply', el: subEl, userId: subEl.getAttribute('data-item-user') }); });
        const uniqueElements = [...new Map(elementsToRender.map(item => [item.el.id, item])).values()];
        const avatarPromises = uniqueElements.map(item => {
            const avatarSpan = item.el.querySelector('a.avatar span.avatarNeue');
            let rawUrl = null;
            if (avatarSpan && avatarSpan.style.backgroundImage) { const match = avatarSpan.style.backgroundImage.match(/url\s*\(\s*['"]?(.+?)['"]?\s*\)/i); if (match && match[1]) rawUrl = match[1]; }
            return fetchImageAsDataURL(rawUrl).then(dataUrl => ({ ...item, avatarDataUrl: dataUrl }));
        });
        const processedItems = await Promise.all(avatarPromises);
        let mainReplyDomRef = null;
        processedItems.forEach(item => {
            let domItem;
            if (item.type === 'opPost') { domItem = createCommentItemDOM(item.el, true, false, options, item.avatarDataUrl, opUserId); }
            else if (item.type === 'mainReply') { domItem = createCommentItemDOM(item.el, false, false, options, item.avatarDataUrl, opUserId); mainReplyDomRef = domItem; }
            if (domItem) imageHost.appendChild(domItem);
        });
        if (mainReplyDomRef) {
            const subRepliesWrapper = document.createElement('div'); subRepliesWrapper.className = 'sub-replies-wrapper';
            processedItems.filter(item => item.type === 'subReply').forEach(subItem => {
                const subDomItem = createCommentItemDOM(subItem.el, false, true, options, subItem.avatarDataUrl, opUserId);
                if (subDomItem) subRepliesWrapper.appendChild(subDomItem);
            });
            if (subRepliesWrapper.hasChildNodes) { mainReplyDomRef.querySelector('.comment-details').appendChild(subRepliesWrapper); }
        }
        if (options.showDate || options.showUrl || options.showQr) {
            const footerDiv = document.createElement('div');
            footerDiv.className = 'image-footer';

            // Right: QR + URL/Date texts
            const footerRight = document.createElement('div');
            footerRight.className = 'image-footer-right';
            const currentUrl = window.location.href;

            if (options.showQr && typeof QRCode !== 'undefined') {
                const qrBox = document.createElement('div');
                qrBox.className = 'image-footer-qr';
                const qrInner = document.createElement('div');
                qrBox.appendChild(qrInner);
                try {
                    new QRCode(qrInner, { text: currentUrl, width: 64, height: 64, correctLevel: QRCode.CorrectLevel.M });
                } catch (e) { console.error('QR generation failed', e); }
                footerRight.appendChild(qrBox);
            }

            const textCol = document.createElement('div');
            textCol.className = 'image-footer-texts';
            if (options.showUrl) {
                const urlSpan = document.createElement('span');
                urlSpan.className = 'image-footer-url';
                urlSpan.textContent = formatDisplayUrl(currentUrl);
                textCol.appendChild(urlSpan);
            }
            if (options.showDate) {
                const dateSpan = document.createElement('span');
                dateSpan.className = 'image-footer-text';
                dateSpan.textContent = `Generated @ ${new Date().toLocaleDateString()}`;
                textCol.appendChild(dateSpan);
            }
            if (textCol.childNodes.length > 0) footerRight.appendChild(textCol);

            footerDiv.appendChild(footerRight);
            imageHost.appendChild(footerDiv);
        }

        // Ensure QR is rendered and external images are inlined before capture
        await new Promise(r => setTimeout(r, 60));
        await inlineAllExternalImages(imageHost);

        try {
            const canvas = await html2canvas(imageHost, { backgroundColor: '#f8f9fa', useCORS: true, scale: window.devicePixelRatio || 2, logging: false });
            const dataUrl = canvas.toDataURL('image/png');
            if (dataUrl.length < 1024) throw new Error("Generated image is too small, assuming it's blank.");
            document.querySelectorAll('.share-script-modal-backdrop').forEach(el => el.remove());
            const previewBackdrop = document.createElement('div'); previewBackdrop.className = 'share-script-modal-backdrop';
            const previewContentDiv = document.createElement('div'); previewContentDiv.id = 'imagePreviewModalContent'; previewContentDiv.classList.add('share-script-modal-content');
            const closeXButton = document.createElement('a'); closeXButton.href = 'javascript:void(0);'; closeXButton.innerHTML = '&times;'; closeXButton.className = 'modal-close-x'; previewContentDiv.appendChild(closeXButton);
            const imgElement = new Image(); imgElement.src = dataUrl;
            const instructions = document.createElement('p'); instructions.textContent = '✅ 图片已生成！请右键复制或拖拽保存。'; instructions.style.margin = '0 0 16px 0'; instructions.style.fontSize = '15px'; instructions.style.color = '#28a745';
            const buttonDiv = document.createElement('div'); buttonDiv.className = 'modal-buttons';
            const buttonDivRight = document.createElement('div'); buttonDivRight.className = 'modal-buttons-right';
            const closeMainButton = document.createElement('button'); closeMainButton.textContent = '关闭预览'; closeMainButton.className = 'btn-secondary';
            buttonDivRight.appendChild(closeMainButton);
            buttonDiv.appendChild(document.createElement('div')); // Empty left side
            buttonDiv.appendChild(buttonDivRight);
            previewContentDiv.appendChild(instructions); previewContentDiv.appendChild(imgElement); previewContentDiv.appendChild(buttonDiv);
            previewBackdrop.appendChild(previewContentDiv); document.body.appendChild(previewBackdrop);
            const cleanupPreviewListeners = setupModalCloseEvents(previewContentDiv, previewBackdrop, closeXButton);
            closeMainButton.addEventListener('click', cleanupPreviewListeners);
        } catch (error) { console.error('Image generation failed (html2canvas error):', error); alert('图片生成失败，详情请查看控制台。\n错误: ' + error.message);
        } finally { imageHost.remove(); }
    }


    // ====================================================================
    //  MODIFIED: createCommentItemDOM to fix parentheses (v1.1)
    // ====================================================================
    function createCommentItemDOM(element, isOp = false, isSubComment = false, options, preFetchedAvatarDataURL, opUserId) {
        // This is the container for the whole block (OP or a single comment)
        const itemContainer = document.createElement('div');
        // FIX: Add appropriate class for layout
        itemContainer.className = isOp ? 'topic_post' : (isSubComment ? 'sub-comment-item' : 'comment-item');
        const currentUserId = element.getAttribute('data-item-user');

        // Avatar part
        const avatarWrapper = document.createElement('div');
        avatarWrapper.className = 'comment-avatar-wrapper';
        const avatarDiv = document.createElement('div');
        avatarDiv.className = 'comment-avatar';
        if (preFetchedAvatarDataURL) {
            avatarDiv.style.backgroundImage = `url("${preFetchedAvatarDataURL}")`;
        }
        avatarWrapper.appendChild(avatarDiv);

        // Details part (username, content, etc.)
        const detailsDiv = document.createElement('div');
        detailsDiv.className = 'comment-details';
        const authorDiv = document.createElement('div');
        authorDiv.className = 'comment-author';
        if (currentUserId === opUserId) authorDiv.classList.add('comment-author-op');
        const contentDiv = document.createElement('div');
        contentDiv.className = 'comment-text';

        let authorName = '', authorSign = '', commentHTML = '';

        try {
            if (isOp) {
                authorName = element.querySelector('.inner strong a.l')?.textContent.trim() || '楼主';
                authorSign = element.querySelector('.inner span.sign')?.textContent.trim() || '';
                commentHTML = element.querySelector('.topic_content')?.innerHTML || '';
                if (options.collapseContent) contentDiv.classList.add('collapsed');
            } else if (isSubComment) {
                authorName = element.querySelector('.inner strong.userName a.l')?.textContent.trim() || '用户';
                authorSign = ''; // Sub-replies on BGM do not have signatures
                commentHTML = element.querySelector('.inner .cmt_sub_content')?.innerHTML || '';
            } else { // Main Reply
                authorName = element.querySelector('.inner span.userInfo strong a.l')?.textContent.trim() || '用户';
                authorSign = element.querySelector('.inner span.userInfo span.sign')?.textContent.trim() || '';
                commentHTML = element.querySelector('.inner .reply_content .message')?.innerHTML || '';
            }
        } catch (e) { console.error("Error parsing comment DOM:", { e, element }); }

        const authorNameSpan = document.createElement('span');
        authorNameSpan.textContent = authorName;
        authorDiv.appendChild(authorNameSpan);

        if (currentUserId === opUserId) {
            const opBadge = document.createElement('span');
            opBadge.className = 'op-badge';
            opBadge.textContent = 'OP';
            authorDiv.appendChild(opBadge);
        }

        if (authorSign && !options.hideSignatures) {
            const normalized = authorSign
                .replace(/^\s*[（(]/, '')
                .replace(/[)）]\s*$/, '');
            const signSpan = document.createElement('span');
            signSpan.className = 'comment-author-sign';
            signSpan.textContent = `（${normalized}）`;
            authorDiv.appendChild(signSpan);
        }
        detailsDiv.appendChild(authorDiv);

        contentDiv.innerHTML = commentHTML;
        detailsDiv.appendChild(contentDiv);

        itemContainer.appendChild(avatarWrapper);
        itemContainer.appendChild(detailsDiv);
        return itemContainer;
    }


    // ====================================================================
    //  UNCHANGED: Initialization Logic (from v1.0.1)
    // ====================================================================
    setTimeout(() => {
        initShareButtons();
        const mainContentArea = document.getElementById('main');
        if (mainContentArea) {
            const observer = new MutationObserver(mutations => {
                let needsReInit = false;
                for(let mutation of mutations) {
                    if (mutation.type === 'childList' && mutation.addedNodes.length > 0) {
                        mutation.addedNodes.forEach(node => {
                            if (node.nodeType === Node.ELEMENT_NODE) {
                                if (node.matches('div.row.row_reply[id^="post_"], div.postTopic[id^="post_"], .action.dropdown ul') ||
                                    node.querySelector('div.row.row_reply[id^="post_"], div.postTopic[id^="post_"], .action.dropdown ul')) {
                                    needsReInit = true;
                                }
                            }
                        });
                    }
                    if (needsReInit) break;
                }
                if (needsReInit) {
                    initShareButtons();
                }
            });
            observer.observe(mainContentArea, { childList: true, subtree: true });
        }
    }, 1500);

})();