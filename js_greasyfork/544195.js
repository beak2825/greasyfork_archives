// ==UserScript==
// @name         Codewars 沉浸式题目汉化工具
// @namespace    http://tampermonkey.net/
// @version      1.0.0
// @description  Codewars 沉浸式题目汉化工具，支持中英对照、用户 API Key(Gemini)，并在 Kata 切换时自动刷新页面。
// @author       Cerry2025 & AI Assistant & User Request
// @license      MIT
// @homepageURL  https://github.com/Cerry2022/Codewars-Immersive-Translator
// @supportURL   https://github.com/Cerry2022/Codewars-Immersive-Translator/issues
// @match        https://*.codewars.com/*
// @grant        GM_xmlhttpRequest
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        GM_registerMenuCommand
// @connect      generativelanguage.googleapis.com
// @downloadURL https://update.greasyfork.org/scripts/544195/Codewars%20%E6%B2%89%E6%B5%B8%E5%BC%8F%E9%A2%98%E7%9B%AE%E6%B1%89%E5%8C%96%E5%B7%A5%E5%85%B7.user.js
// @updateURL https://update.greasyfork.org/scripts/544195/Codewars%20%E6%B2%89%E6%B5%B8%E5%BC%8F%E9%A2%98%E7%9B%AE%E6%B1%89%E5%8C%96%E5%B7%A5%E5%85%B7.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 配置
    const CONFIG = {
        TARGET_SELECTOR: '#description',
        LOADING_TEXT: 'Loading description...',
        TRANSLATE_DELAY: 0,
        STORAGE_KEY_MODE: 'codewars_translate_mode',
        STORAGE_KEY_APIKEY: 'codewars_gemini_apikey',
        ROUTE_CHECK_INTERVAL: 500,
        API_ENDPOINT: 'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent',
        TRANSLATION_STATE_ATTR: 'data-translation-state',
        NOTIFICATION_DURATION: 3000, // 通知显示时长
    };

    // API Key 管理

    /**
     * 获取 API Key。
     * 如果未设置，则提示用户输入并存储。
     * @returns {string|null} API Key 或 null（如果未设置）
     */
    function getApiKey() {
        let apiKey = GM_getValue(CONFIG.STORAGE_KEY_APIKEY, null);
        if (!apiKey || apiKey.trim() === '') {
            apiKey = prompt('请输入您的 Google AI Gemini API 密钥以启用翻译功能。\n（您可以在 Google AI Studio 免费获取）');
            if (apiKey && apiKey.trim() !== '') {
                apiKey = apiKey.trim();
                // 简单验证 API Key 格式 (可以根据 Gemini API 的 Key 格式进行更严格的验证)
                if (!apiKey.startsWith('AIza')) {
                    alert('API 密钥格式不正确，请检查!');
                    return null;
                }
                GM_setValue(CONFIG.STORAGE_KEY_APIKEY, apiKey);
                showNotification('API 密钥已保存。', 'success');
                return apiKey;
            } else {
                showNotification('未提供有效的 API 密钥。翻译功能将无法使用。\n您可以通过油猴菜单 "设置/更新 API 密钥" 来设置。', 'warning');
                return null;
            }
        }
        return apiKey;
    }

    // 注册油猴菜单命令，用于设置或更新 API Key
    GM_registerMenuCommand('设置/更新 API 密钥', () => {
        const currentKey = GM_getValue(CONFIG.STORAGE_KEY_APIKEY, '');
        const newKey = prompt('请输入或更新您的 Google AI Gemini API 密钥:', currentKey);
        if (newKey !== null) {
            const trimmedKey = newKey.trim();
            // 简单验证 API Key 格式
             if (trimmedKey && !trimmedKey.startsWith('AIza')) {
                alert('API 密钥格式不正确，请检查!');
                return;
             }
            GM_setValue(CONFIG.STORAGE_KEY_APIKEY, trimmedKey);
            showNotification(trimmedKey ? 'API 密钥已更新！请刷新页面或导航到新题目以生效。' : 'API 密钥已清除。', 'info');
        } else {
            showNotification('操作已取消。', 'info');
        }
    });

    // 样式与 UI

    /**
     * 注入 CSS 样式。
     */
    function addStyles() {
        const style = document.createElement('style');
        style.id = 'codewars-translator-styles';
        style.textContent = `
            /* 整个双语容器的样式 */
            .bilingual-container .original-text {
                opacity: 0.75; /* 降低原文的透明度，使其略微不显眼 */
                font-size: 0.95em; /* 稍微缩小原文的字体大小 */
                line-height: 1.3; /* 设置原文的行高 */
                margin-bottom: 0; /* 移除原文底部的外边距 */
            }

            /* 分割原文和译文的水平线的样式 */
            .bilingual-container hr.translation-separator {
                margin: 15px 0; /* 设置水平线的上下外边距 */
                border: none; /* 移除默认的边框 */
                border-top: 1px solid #eee; /* 设置水平线为浅灰色细线 */
            }

            /* 译文文本的样式 */
            .bilingual-container .translated-text {
                padding: 5px; /* 设置译文的内边距 */
                line-height: 1.3; /* 设置译文的行高 */
                margin-top: 0; /* 移除译文顶部的外边距 */
            }

            /* 原文和译文中 <strong> 标签的样式 (通常用于标题或关键词) */
            .bilingual-container .original-text strong,
            .bilingual-container .translated-text strong {
                display: block; /* 使 <strong> 标签占据整行 */
                margin-bottom: 0px; /* 移除 <strong> 标签底部的外边距 */
                font-size: 0.8em; /* 缩小 <strong> 标签的字体大小 */
                color: #777; /* 设置 <strong> 标签的颜色为深灰色 */
                text-transform: uppercase; /* 将 <strong> 标签的文本转换为大写 */
                font-weight: bold; /* 加粗 <strong> 标签的文本 */
            }

            /* 头部切换按钮的样式 */
            .header-toggle {
                margin-left: auto; /* 将按钮推到右侧 */
                display: flex; /* 使用 Flexbox 布局 */
                align-items: center; /* 垂直居中对齐按钮内容 */
                gap: 6px; /* 设置按钮内容之间的间距 */
                cursor: pointer; /* 将鼠标指针变为手型，表示可点击 */
                padding-right: 10px; /* 右侧内边距 */
            }

            /* 翻译状态提示信息的样式 */
            .translation-status-tip {
                padding: 5px 0; /* 设置提示信息的上下内边距 */
                margin-bottom: 10px; /* 设置提示信息底部的外边距 */
                display: block; /* 使提示信息占据整行 */
                font-size: 0.9em; /* 缩小提示信息的字体大小 */
            }

            /* 普通提示信息的样式 */
            .translation-status-tip.tip {
                color: #666; /* 设置提示信息的颜色为灰色 */
                font-style: italic; /* 将提示信息设置为斜体 */
                border-bottom: 1px dashed #eee; /* 添加浅灰色虚线下划线 */
            }

            /* 错误提示信息的样式 */
            .translation-status-tip.error {
                color: #f44336; /* 设置错误信息的颜色为红色 */
                font-weight: bold; /* 加粗错误信息 */
                border: 1px solid #f44336; /* 添加红色边框 */
                padding: 8px 10px; /* 设置错误信息的内边距 */
                background-color: #ffebee; /* 设置错误信息的背景色为浅红色 */
                border-radius: 4px; /* 添加圆角 */
                margin: 10px 0; /* 设置错误信息的上下外边距 */
            }

            /* 通知消息的样式 */
            .notification {
                position: fixed; /* 使用固定定位，使其始终显示在屏幕的固定位置 */
                top: 20px; /* 距离顶部 20px */
                right: 20px; /* 距离右侧 20px */
                background-color: #f0f0f0; /* 设置背景色为浅灰色 */
                padding: 10px 15px; /* 设置内边距 */
                border-radius: 5px; /* 添加圆角 */
                box-shadow: 0 2px 5px rgba(0,0,0,0.2); /* 添加阴影 */
                z-index: 1000; /* 设置 z-index 属性，使其显示在其他元素的上方 */
                font-size: 14px; /* 设置字体大小 */
                color: #333; /* 设置颜色 */
            }

            /* 成功通知的样式 */
            .notification.success {
                background-color: #d4edda; /* 设置背景色为浅绿色 */
                color: #155724; /* 设置颜色为深绿色 */
                border: 1px solid #c3e6cb; /* 设置边框 */
            }

            /* 警告通知的样式 */
            .notification.warning {
                background-color: #fff3cd; /* 设置背景色为浅黄色 */
                color: #856404; /* 设置颜色为深黄色 */
                border: 1px solid #ffeeba; /* 设置边框 */
            }

             /* 信息通知的样式 */
            .notification.info {
                background-color: #bee5eb; /* 设置背景色为浅蓝色 */
                color: #0c5460; /* 设置颜色为深蓝色 */
                border: 1px solid #b7e1e8; /* 设置边框 */
            }

            /* 加载动画的样式 */
            .loading-animation {
              border: 5px solid #f3f3f3; /* 浅灰色边框 */
              border-top: 5px solid #3498db; /* 蓝色顶部边框 */
              border-radius: 50%; /* 圆形 */
              width: 20px; /* 宽度 */
              height: 20px; /* 高度 */
              animation: spin 2s linear infinite; /* 应用旋转动画 */
              display: inline-block; /* 行内块元素，可以设置宽高 */
              margin-right: 5px; /* 右侧外边距 */
            }

            /* 旋转动画的关键帧 */
            @keyframes spin {
              0% { transform: rotate(0deg); } /* 初始角度 */
              100% { transform: rotate(360deg); } /* 旋转 360 度 */
            }
        `;
        if (!document.getElementById(style.id)) {
            document.head.appendChild(style);
        }
    }

     /**
     * 显示通知消息。
     * @param {string} message 通知内容
     * @param {string} type 通知类型 (success, warning, info)
     */
    function showNotification(message, type = 'info') {
        const notification = document.createElement('div');
        notification.className = `notification ${type}`;
        notification.textContent = message;
        document.body.appendChild(notification);

        setTimeout(() => {
            notification.remove();
        }, CONFIG.NOTIFICATION_DURATION);
    }


    /**
     * 使用 MutationObserver 添加中英对照切换开关到页面头部。
     * 目标：添加到 "Instructions"/"Output" 选项卡右侧。
     */
    function addHeaderSwitch() {
        console.log("开始监控 DOM 以添加头部切换开关...");

        // 更精确的目标容器选择器，基于提供的 HTML
        const headerTargetSelector = '.mb-2.border-0.overflow-hidden.flex.items-center.justify-start';
        const toggleContainerId = 'codewars-translator-header-toggle-container'; // 唯一 ID

        const observer = new MutationObserver((mutationsList, obs) => {
            // 检查开关是否已存在
            if (document.getElementById(toggleContainerId)) {
                // console.log("头部开关已存在，停止监控。"); // 可以取消注释以进行调试
                obs.disconnect();
                return;
            }

            // 查找目标容器
            const targetArea = document.querySelector(headerTargetSelector);

            // 检查目标容器是否存在，并确保它至少包含一个选项卡链接作为稳定标志
            const stableElementCheck = targetArea?.querySelector('a.inline-block.px-4.py-2');

            if (targetArea && stableElementCheck) {
                console.log("找到头部目标区域，尝试添加开关...");

                // 再次确认开关不存在（双重检查，虽然有 ID 可能多余，但保险）
                 if (!targetArea.querySelector(`#${toggleContainerId}`)) {
                    const isBilingual = localStorage.getItem(CONFIG.STORAGE_KEY_MODE) === 'bilingual';

                    // 创建开关的容器 div
                    const toggleWrapperDiv = document.createElement('div');
                    toggleWrapperDiv.id = toggleContainerId; // 设置唯一 ID
                    // 使用 margin-left: auto 将其推到 flex 容器的右侧
                    toggleWrapperDiv.style.marginLeft = 'auto';
                    // 保持 flex 布局以垂直居中
                    toggleWrapperDiv.style.display = 'flex';
                    toggleWrapperDiv.style.alignItems = 'center';
                    toggleWrapperDiv.style.gap = '6px'; // 复刻之前的样式
                    toggleWrapperDiv.style.paddingRight = '10px'; // 增加一些右边距，避免太贴边

                    // 创建开关内部的 HTML
                    toggleWrapperDiv.innerHTML = `
                        <input type="checkbox" id="bilingualToggleHeader" style="cursor: pointer;" ${isBilingual ? 'checked' : ''}>
                        <label for="bilingualToggleHeader" style="cursor: pointer; user-select: none;">中英对照</label>
                    `;

                    // 将开关容器添加到目标区域（flex 容器）的末尾
                    // 由于设置了 margin-left: auto，它会被推到右边
                    targetArea.appendChild(toggleWrapperDiv);
                    console.log("头部开关已添加。");

                    // 获取新添加的 checkbox 并添加事件监听器
                    const toggle = toggleWrapperDiv.querySelector('#bilingualToggleHeader');
                    toggle.addEventListener('change', () => {
                        localStorage.setItem(CONFIG.STORAGE_KEY_MODE, toggle.checked ? 'bilingual' : 'replace');
                        showNotification('模式已切换。刷新页面或导航到新题目以查看效果。', 'info');
                        location.reload(); // 保留刷新逻辑
                    });

                    // 成功添加后，停止观察
                    obs.disconnect();
                    console.log("停止监控 DOM (开关已添加)。");

                } else {
                     // console.log("开关已存在于目标区域内（二次检查），停止监控。");
                     obs.disconnect();
                }
            }
            // else {
            //    console.log("未找到目标区域或稳定元素，继续监控..."); // 可选日志
            //}
        });

        // 配置观察选项: 监控整个文档的子节点添加/删除
        const config = { childList: true, subtree: true };

        // 开始观察 document.body
        observer.observe(document.body, config);

        // 添加一个超时，以防万一目标元素永远不出现
        setTimeout(() => {
            observer.disconnect();
        }, 5000); // 设置 5 秒超时
    }

    /**
     * 设置状态提示。
     * @param {HTMLElement} element 目标元素
     * @param {string} text 提示文本
     * @param {boolean} isError 是否为错误提示
     */
    function setStatusTip(element, text, isError = false, showLoading = false) {
        removeStatusTip(element);
        const tipElement = document.createElement('div');
        tipElement.className = `translation-status-tip ${isError ? 'error' : 'tip'}`;

        if(showLoading){
          const loadingAnimation = document.createElement('span');
          loadingAnimation.className = 'loading-animation';
          tipElement.appendChild(loadingAnimation);
        }

        tipElement.appendChild(document.createTextNode(text)); // 使用 createTextNode 防止 HTML 注入
        element.insertBefore(tipElement, element.firstChild);
    }

    /**
     * 移除状态提示。
     * @param {HTMLElement} element
     */
    function removeStatusTip(element) {
        const tipElement = element.querySelector(':scope > .translation-status-tip');
        if (tipElement) {
            tipElement.remove();
        }
    }

    // 路由变化检测（简化：页面刷新）
    const initialPath = location.pathname;

    function checkForRouteChange() {
        if (location.pathname !== initialPath && location.pathname.includes('/kata/')) {
            console.log(`Codewars Translator: Kata 切换，从 ${initialPath} 到 ${location.pathname}。 刷新页面。`);
            clearInterval(routeCheckInterval);
            location.reload();
        }
    }

    const routeCheckInterval = setInterval(checkForRouteChange, CONFIG.ROUTE_CHECK_INTERVAL);

    // 翻译核心逻辑

    /**
     * 检查元素是否包含加载文本。
     * @param {HTMLElement} element
     * @returns {boolean}
     */
    const isLoading = (element) => element.textContent.includes(CONFIG.LOADING_TEXT);

    /**
     * 等待内容加载完成。
     * @param {HTMLElement} element
     * @returns {Promise<void>}
     */
    function waitForContentReady(element) {
        return new Promise((resolve, reject) => {
            if (!isLoading(element)) return resolve();

            let resolved = false;
            const observer = new MutationObserver(() => {
                if (!isLoading(element)) {
                    if(resolved) return;
                    resolved = true;
                    observer.disconnect();
                    resolve();
                }
            });
            observer.observe(element, { childList: true, subtree: true, characterData: true });

             const timeoutId = setTimeout(() => {
                if (resolved) return;
                observer.disconnect();
                console.warn("waitForContentReady 超时。");
                resolve();
            }, 10000);

             const originalResolve = resolve;
             resolve = () => {
                 clearTimeout(timeoutId);
                 originalResolve();
             }
        });
    }


    /**
     * 处理单个元素：检查状态、加载、API Key，然后翻译。
     * @param {HTMLElement} element
     */
    /**
     * 处理单个元素：检查状态、加载、API Key，然后翻译。
     * @param {HTMLElement} element
     */
    async function processElement(element) {
        const currentState = element.getAttribute(CONFIG.TRANSLATION_STATE_ATTR);

        // 如果元素已处理、正在处理、出错或明确标记为空，则跳过
        if (['processing', 'translated', 'error', 'empty'].includes(currentState)) {
            // console.log(`Skipping element, state: ${currentState}`); // 可选调试日志
            return;
        }

        console.log("Processing element:", element.id || element.className);

        let originalHTML;

        // --- 步骤 1: 处理 Codewars 自身的加载状态 ---
        if (isLoading(element)) {
            console.log("Element is initially loading (Codewars)...");
            element.setAttribute(CONFIG.TRANSLATION_STATE_ATTR, 'loading_codewars'); // 标记为 Codewars 加载状态
            setStatusTip(element, '等待题目内容加载...'); // 显示 Codewars 加载提示
            await waitForContentReady(element);
            removeStatusTip(element); // 移除 Codewars 加载提示
            console.log("Codewars loading finished.");
            // 再次检查状态，因为 waitForContentReady 可能改变了元素状态或内容
            if (!element.textContent || element.textContent.trim() === '') {
                console.log("Element became empty after Codewars loading.");
                element.setAttribute(CONFIG.TRANSLATION_STATE_ATTR, 'empty');
                // 如果希望显示空状态，可以保留元素为空，或者恢复可能的原始空结构
                // element.innerHTML = ''; // 确保是空的
                return; // 内容为空，不进行翻译
            }
            // 内容加载完成后，清除 Codewars 加载状态标记，以便后续捕获 HTML
            element.removeAttribute(CONFIG.TRANSLATION_STATE_ATTR);
        }

        // --- 步骤 2: 捕获干净的原始 HTML ---
        // 确保在添加我们自己的翻译提示之前捕获
        if (!element.dataset.originalHtml) {
            // 再次检查内容是否为空（可能在非 loading 状态下初始为空）
             if (!element.textContent || element.textContent.trim() === '') {
                 console.log("Element is initially empty.");
                 element.setAttribute(CONFIG.TRANSLATION_STATE_ATTR, 'empty');
                 return;
             }
            originalHTML = element.innerHTML;
            element.dataset.originalHtml = originalHTML;
            console.log("Original HTML captured successfully.");
            // console.log("Captured HTML:", originalHTML.substring(0, 200) + "..."); // 调试日志，只显示部分
        } else {
            originalHTML = element.dataset.originalHtml;
            console.log("Reusing cached original HTML.");
        }

        // --- 步骤 3: 检查 API Key ---
        const apiKey = getApiKey();
        if (!apiKey) {
            // 只有在尚未显示错误时才添加提示
            if (element.getAttribute(CONFIG.TRANSLATION_STATE_ATTR) !== 'error') {
                 setStatusTip(element, '错误：未设置 API 密钥。请通过脚本菜单设置。', true);
                 element.setAttribute(CONFIG.TRANSLATION_STATE_ATTR, 'error');
            }
            return;
        }

        // --- 步骤 4: 设置处理状态并显示我们的翻译加载提示 ---
        console.log("Setting state to 'processing' and showing translation tip.");
        element.setAttribute(CONFIG.TRANSLATION_STATE_ATTR, 'processing');
        // *** 确保此时才添加我们自己的加载提示 ***
        setStatusTip(element, '正在翻译 (使用 Gemini)...', false, true);

        // --- 步骤 5: 执行翻译 ---
        try {
            // console.log("Extracting placeholders from original HTML...");
            const { cleanedHTML, placeholders } = extractPlaceholders(originalHTML); // 必须使用捕获的 originalHTML

            // 检查清理后的 HTML 是否只包含占位符或为空
            if (cleanedHTML.replace(/<!-- PLACEHOLDER_\d+ -->/g, '').trim() === '') {
                 console.log("Cleaned HTML is effectively empty, skipping API call.");
                 removeStatusTip(element); // 移除我们的加载提示
                 element.setAttribute(CONFIG.TRANSLATION_STATE_ATTR, 'translated'); // 标记为已翻译（即使是空的）
                 // 恢复原始 HTML（可能只包含占位符或确实是空的）
                 element.innerHTML = originalHTML;
                 return;
            }

            // console.log("Calling translation API...");
            const translatedHTMLRaw = await callTranslationAPI(cleanedHTML, apiKey);
            console.log("Translation API call successful.");

            // *** 在应用翻译之前移除我们的加载提示 ***
            console.log("Removing translation status tip before applying translation.");
            removeStatusTip(element); // 关键一步！

            // 应用翻译结果
            console.log("Applying translation...");
            applyTranslation(element, originalHTML, translatedHTMLRaw, placeholders); // 使用正确的 originalHTML

            element.setAttribute(CONFIG.TRANSLATION_STATE_ATTR, 'translated');
            console.log("Translation applied. Final state: translated.");

        } catch (error) {
            console.error('翻译流程出错:', error);
            // 移除可能存在的加载提示，并显示错误信息
            removeStatusTip(element); // 先尝试移除加载提示
            setStatusTip(element, `翻译失败：${error.message || error}`, true); // 再设置错误提示
            element.setAttribute(CONFIG.TRANSLATION_STATE_ATTR, 'error');
        }
    }

    /**
     * 提取 HTML 中的 img 和 pre/code 标签，替换为占位符。
     * @param {string} html
     * @returns {{cleanedHTML: string, placeholders: Array<string>}}
     */
    function extractPlaceholders(html) {
        const placeholders = [];
        let index = 0;
        const cleanedHTML = html.replace(/<(img|pre|code)\b[^>]*>.*?<\/\1>|<(img)\b[^>]*?\/?>(?!\s*<\/(img)>)/gis, (match) => {
            placeholders.push(match);
            return `<!-- PLACEHOLDER_${index++} -->`;
        });
        return { cleanedHTML, placeholders };
    }

    /**
     * 恢复占位符。
     * @param {string} translatedHTML
     * @param {Array<string>} placeholders
     * @returns {string}
     */
    function restorePlaceholders(translatedHTML, placeholders) {
        return translatedHTML.replace(/<!-- PLACEHOLDER_(\d+) -->/g, (_, indexStr) => {
            const index = parseInt(indexStr, 10);
            return placeholders[index] !== undefined ? placeholders[index] : `<!-- MISSING_PLACEHOLDER_${index} -->`;
        });
    }

    /**
     * 调用 Gemini API 翻译。
     * @param {string} htmlToTranslate - 清理后的 HTML
     * @param {string} apiKey
     * @returns {Promise<string>} 翻译后的 HTML
     */
    function callTranslationAPI(htmlToTranslate, apiKey) {
      const maxRetries = 2; // 最大重试次数
      let retryCount = 0;

      return new Promise((resolve, reject) => {
        function makeRequest() {
          GM_xmlhttpRequest({
            method: 'POST',
            url: `${CONFIG.API_ENDPOINT}?key=${apiKey}`,
            headers: { 'Content-Type': 'application/json' },
            data: JSON.stringify({
              contents: [{
                parts: [{
                  text: `将以下 HTML 片段中的可读文本内容翻译成 **简体中文**。
请严格保留所有原始 HTML 标签（例如 <img>、<pre>、<code>、<a>、<strong>、<em> 等），其属性、结构以及任何占位符（例如 <!-- PLACEHOLDER_0 -->）。
**不要翻译** <pre>...</pre> 或 <code>...</code> 标签内的内容。
仅翻译这些受保护元素之外的用户可见文本。确保输出是有效的 HTML。

输入 HTML:
\`\`\`html
${htmlToTranslate}
\`\`\`

翻译后的 HTML (简体中文):`
                }]
              }],
              generationConfig: {}
            }),
            responseType: 'json',
            timeout: 45000,
            onload: (res) => {
              if (res.status === 200 && res.response) {
                const candidate = res.response.candidates?.[0];
                let text = candidate?.content?.parts?.[0]?.text;
                const finishReason = candidate?.finishReason;
                const blockReason = res.response.promptFeedback?.blockReason;

                if (blockReason) {
                  return reject(new Error(`API 请求被阻止: ${blockReason}。检查内容安全设置或提示。`));
                }
                if (finishReason && finishReason !== "STOP" && finishReason !== "MAX_TOKENS") {
                  if (finishReason === "MAX_TOKENS") {
                    console.warn("翻译可能由于 MAX_TOKENS 限制而不完整。");
                  } else {
                    return reject(new Error(`API 完成原因问题: ${finishReason}。内容可能不安全或发生错误。`));
                  }
                }
                if (text) {
                  text = text.replace(/^```(?:html)?\s*|```$/gi, '').trim();
                  resolve(text);
                } else if (finishReason === "STOP" && !text) {
                  console.warn("API 返回 STOP 但没有文本。假设没有可翻译内容。");
                  resolve("");
                } else {
                  console.error("API 响应详情:", JSON.stringify(res.response, null, 2));
                  reject(new Error('API 响应格式错误：在 candidate 部分中未找到有效的文本。'));
                }
              } else {
                let errorMsg = `API 请求失败，状态码 ${res.status}`;
                let errorDetails = '(无更多详细信息)';
                try {
                  if (res.response && res.response.error) {
                    errorDetails = res.response.error.message || JSON.stringify(res.response.error);
                  } else if (res.responseText) {
                    try {
                      const errJson = JSON.parse(res.responseText);
                      errorDetails = errJson.error?.message || res.responseText;
                    } catch (e) {
                      errorDetails = res.responseText;
                    }
                  }
                  if (errorDetails) errorMsg += `: ${errorDetails}`;
                  if (res.status === 400) errorMsg += " (Bad request - 检查 API key/请求格式)";
                  if (res.status === 403) errorMsg += " (Forbidden - 检查 API key 权限)";
                  if (res.status === 429) errorMsg += " (Rate limit exceeded)";
                  if (res.status >= 500) errorMsg += " (服务器端 API 错误)";
                } catch (e) {
                  console.error("错误解析错误响应:", e);
                }

                // 重试机制
                if (res.status >= 500 && retryCount < maxRetries) { //  仅对服务器错误进行重试
                  retryCount++;
                  console.log(`API 请求失败，正在重试 (${retryCount}/${maxRetries})...`);
                  setTimeout(makeRequest, 1000 * retryCount); // 延迟重试
                } else {
                  reject(new Error(errorMsg));
                }
              }
            },
            onerror: (err) => reject(new Error(`翻译期间的网络错误: ${err.error || '未知网络问题'}`)),
            ontimeout: () => reject(new Error('翻译请求超时'))
          });
        }

        makeRequest(); // 启动首次请求
      });
    }


    /**
     * 应用翻译结果。
     * @param {HTMLElement} element 目标元素
     * @param {string} originalHTML 原始 HTML
     * @param {string} translatedRaw 翻译后的原始文本
     * @param {Array<string>} placeholders 占位符
     */
    function applyTranslation(element, originalHTML, translatedRaw, placeholders) {
        const isBilingual = localStorage.getItem(CONFIG.STORAGE_KEY_MODE) === 'bilingual';
        const cleanTranslation = translatedRaw
            .replace(/^```(?:html)?\s*|```$/gi, '')
            .trim();

        const translatedWithContent = restorePlaceholders(cleanTranslation, placeholders);

        element.innerHTML = '';
        element.classList.remove('bilingual-container');

        if (isBilingual) {
            element.classList.add('bilingual-container');
            element.innerHTML = `
                <div class="original-text">
                  <strong>原文:</strong>
                  <div>${originalHTML}</div>
                </div>
                <hr class="translation-separator">
                <div class="translated-text">
                   <strong>翻译:</strong>
                   <div>${translatedWithContent || '(翻译为空)'}</div>
                </div>
            `;
        } else {
            element.innerHTML = translatedWithContent || originalHTML;
        }

    }

    // 初始化

    /**
     * 脚本初始化。
     */
    function initialize() {
        console.log("Codewars Translator初始化...");
        addStyles();
        addHeaderSwitch();

        // 使用 MutationObserver 监听目标元素的变化
        const observer = new MutationObserver((mutations) => {
            const targetElement = document.querySelector(CONFIG.TARGET_SELECTOR);
            if (targetElement) {
                observer.disconnect(); // 找到目标元素后停止监听
                processElement(targetElement);
            }
        });

        // 开始监听 document body 的变化
        observer.observe(document.body, {
            childList: true,
            subtree: true
        });

        console.log("Codewars Translator 初始化完成。 监控路由变化以进行页面刷新。");
    }

    // 启动脚本
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initialize);
    } else {
        initialize();
    }

})();
