// ==UserScript==
// @name         Jellyfin元数据辅助
// @namespace    http://tampermonkey.net/
// @version      3.6
// @description  【二合一】功能1: 在“标为已播放”按钮旁添加“搜索弹幕”按钮。功能2: 添加“刷新元数据”按钮。功能可独立开关。
// @author       Gemini & mojie
// @match        *://*/web/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=jellyfin.org
// @grant        GM_addStyle
// @grant        GM_xmlhttpRequest
// @downloadURL https://update.greasyfork.org/scripts/542072/Jellyfin%E5%85%83%E6%95%B0%E6%8D%AE%E8%BE%85%E5%8A%A9.user.js
// @updateURL https://update.greasyfork.org/scripts/542072/Jellyfin%E5%85%83%E6%95%B0%E6%8D%AE%E8%BE%85%E5%8A%A9.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // =========================================================================================
    // ——— 配置中心 ———
    // =========================================================================================

    // --- 功能开关 ---
    const ENABLE_SUBTITLE_SEARCH = true;   // true: 开启“一键搜索字幕”功能, false: 关闭
    const ENABLE_METADATA_REFRESH = true; // true: 开启“刷新元数据”功能, false: 关闭

    // --- “刷新元数据”功能所需的 API Key ---
    // 获取方法: 登录 Jellyfin -> 控制台 -> API 密钥 -> 点击(+)创建 -> 复制并粘贴到下方引号之间
    const MANUAL_API_KEY = '在此处粘贴你的API密钥'; // <--- 在这里替换

    // =========================================================================================
    // ——— 样式定义 (合并) ———
    // =========================================================================================
    GM_addStyle(`
        /* 统一样式：刷新元数据按钮 & 搜索字幕按钮 */
        .btn-item-refresh, .btn-item-subsearch {
            min-width: 42px !important;
            padding: 0 !important;
            margin-right: 4px; /* 增加一点右边距，避免和旁边的按钮贴太近 */
        }
        .btn-item-refresh .material-icons, .btn-item-subsearch .material-icons {
            color: rgba(255,255,255,0.87);
            transition: transform 0.3s cubic-bezier(.34,1.56,.64,1);
        }
        .btn-item-refresh:hover .material-icons {
            transform: scale(1.1) rotate(-180deg);
        }
        .btn-item-subsearch:hover .material-icons {
            transform: scale(1.1); /* 字幕按钮悬浮时只放大，不旋转 */
        }
        .btn-item-refresh.is-loading .material-icons {
            animation: spin 1s linear infinite;
        }
        @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
        }
    `);

    // =========================================================================================
    // ——— 核心逻辑 (合并) ———
    // =========================================================================================

    const CONSTANTS = {
        SUBTITLE: {
            EDIT_SUBTITLES_SELECTOR: 'button[data-id="editsubtitles"]',
            SEARCH_BUTTON_SELECTOR: 'button.btnSearchSubtitles',
            MARKER_ATTRIBUTE: 'data-subtitle-button-added'
        },
        METADATA: {
            PLAYSTATE_BUTTON_SELECTOR: 'button[is="emby-playstatebutton"]',
            MARKER_ATTRIBUTE: 'data-refresh-button-added',
            ICON_NAME: 'sync'
        }
    };

    /**
     * 智能重试函数：尝试查找元素，如果失败则重试。
     */
    async function findElementWithRetry(selector, retries = 3, interval = 800) {
        for (let i = 0; i <= retries; i++) {
            const element = document.querySelector(selector);
            if (element) return element;
            if (i < retries) {
                console.log(`[Jellyfin元数据辅助] 未找到元素 "${selector}", ${interval}ms后重试 (第 ${i + 1} 次)...`);
                await new Promise(res => setTimeout(res, interval));
            }
        }
        console.error(`[Jellyfin元数据辅助] 超过最大重试次数，未能找到元素 "${selector}"。`);
        return null;
    }

    /**
     * 通用的“一键搜索字幕”点击逻辑（采用智能重试）
     */
    async function performSubtitleSearch(moreButtonElement) {
        console.log(`[Jellyfin元数据辅助] 开始执行“一键搜索字幕”...`);
        try {
            if (!moreButtonElement) throw new Error('无法定位到对应的“更多”按钮。');
            moreButtonElement.click();

            const editSubsBtn = await findElementWithRetry(CONSTANTS.SUBTITLE.EDIT_SUBTITLES_SELECTOR, 3, 800);
            if (editSubsBtn) {
                editSubsBtn.click();
            } else {
                throw new Error('步骤2失败: 未能在多次尝试后找到“编辑字幕”按钮');
            }

            const searchBtn = await findElementWithRetry(CONSTANTS.SUBTITLE.SEARCH_BUTTON_SELECTOR, 3, 800);
            if (searchBtn) {
                searchBtn.click();
            } else {
                throw new Error('步骤3失败: 未能在多次尝试后找到“搜索”按钮');
            }
            console.log('[Jellyfin元数据辅助] “一键搜索字幕”任务完成！');

        } catch (error) {
            console.error(`[Jellyfin元数据辅助] ${error.message}`);
            document.body.click();
        }
    }

    // --- 功能1: 添加“一键搜索字幕”按钮 ---
    /**
     * 【新】在“标为已播放”按钮左侧添加字幕搜索按钮
     * @param {HTMLElement} playStateButton - “标为已播放”按钮
     */
    function addSubtitleButtonNextToPlaystate(playStateButton) {
        // 从“已播放”按钮的父容器中寻找对应的“更多”按钮，因为后续操作需要点击它
        const moreButton = playStateButton.parentElement.querySelector('button[data-action="menu"]');
        if (!moreButton) {
            // 如果在当前上下文中找不到“更多”按钮，则不添加字幕按钮
            return;
        }

        const newButton = document.createElement('button');
        newButton.type = 'button';
        // 借用“已播放”按钮的通用类名，并添加自定义类名以便应用样式
        newButton.className = playStateButton.className + ' btn-item-subsearch';
        newButton.title = '一键搜索字幕';
        newButton.innerHTML = `<span class="material-icons" aria-hidden="true">subtitles</span>`;
        newButton.onclick = (e) => {
            e.stopPropagation();
            performSubtitleSearch(moreButton); // 点击时，传入找到的“更多”按钮来执行后续操作
        };

        playStateButton.before(newButton);
        playStateButton.setAttribute(CONSTANTS.SUBTITLE.MARKER_ATTRIBUTE, 'true');
    }

    // --- 功能2: 添加“刷新元数据”按钮 ---
    function addMetadataRefreshButton(playStateButton) {
        const itemId = playStateButton.getAttribute('data-id');
        if (!itemId) return;
        const refreshButton = document.createElement('button');
        refreshButton.type = 'button';
        refreshButton.className = playStateButton.className + ' btn-item-refresh';
        refreshButton.title = '刷新元数据';
        refreshButton.innerHTML = `<span class="material-icons" aria-hidden="true">${CONSTANTS.METADATA.ICON_NAME}</span>`;
        refreshButton.onclick = (e) => {
            e.stopPropagation();
            if (MANUAL_API_KEY === '在此处粘贴你的API密钥' || MANUAL_API_KEY.length < 10) {
                alert('错误：请先在脚本顶部的配置中心填写正确的 API Key！');
                return;
            }
            refreshButton.classList.add('is-loading');
            refreshButton.disabled = true;
            const serverUrl = window.location.origin;
            const requestUrl = `${serverUrl}/Items/${itemId}/Refresh?Recursive=true&ImageRefreshMode=FullRefresh&MetadataRefreshMode=FullRefresh&ReplaceAllImages=false&RegenerateTrickplay=false&ReplaceAllMetadata=true`;
            GM_xmlhttpRequest({
                method: "POST",
                url: requestUrl,
                headers: { "X-Emby-Token": MANUAL_API_KEY },
                onload: (response) => {
                    refreshButton.classList.remove('is-loading');
                    refreshButton.disabled = false;
                    if (response.status >= 200 && response.status < 300) {
                        refreshButton.innerHTML = '<span class="material-icons" aria-hidden="true" style="color: #4CAF50;">done</span>';
                        setTimeout(() => {
                            refreshButton.innerHTML = `<span class="material-icons" aria-hidden="true">${CONSTANTS.METADATA.ICON_NAME}</span>`;
                        }, 2000);
                    } else {
                        alert(`刷新 Item ID ${itemId} 失败！\n状态码: ${response.status}\n可能是API Key不正确或无权限。`);
                    }
                },
                onerror: () => {
                    refreshButton.classList.remove('is-loading');
                    refreshButton.disabled = false;
                    alert('发送刷新请求时发生网络错误。');
                }
            });
        };
        playStateButton.before(refreshButton);
        playStateButton.setAttribute(CONSTANTS.METADATA.MARKER_ATTRIBUTE, 'true');
    }

    // --- 总调度函数 ---
    function masterScanAndApply() {
        // 统一查找“标为已播放”按钮，并根据开关状态添加对应的功能按钮
        if (ENABLE_SUBTITLE_SEARCH) {
            const query = `${CONSTANTS.METADATA.PLAYSTATE_BUTTON_SELECTOR}:not([${CONSTANTS.SUBTITLE.MARKER_ATTRIBUTE}="true"])`;
            document.querySelectorAll(query).forEach(addSubtitleButtonNextToPlaystate);
        }
        if (ENABLE_METADATA_REFRESH) {
            const query = `${CONSTANTS.METADATA.PLAYSTATE_BUTTON_SELECTOR}:not([${CONSTANTS.METADATA.MARKER_ATTRIBUTE}="true"])`;
            document.querySelectorAll(query).forEach(addMetadataRefreshButton);
        }
    }

    // =========================================================================================
    // ——— 启动 MutationObserver ———
    // =========================================================================================
    const observer = new MutationObserver(masterScanAndApply);
    observer.observe(document.body, { childList: true, subtree: true });
    masterScanAndApply();

})();