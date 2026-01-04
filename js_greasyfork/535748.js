// ==UserScript==
// @name   [银河奶牛]自动消息翻译(zh-CN)
// @namespace    https://cnb.cool/shenhuanjie/skyner-cn/tamper-monkey-script/mwi-message-translator-zh_cn
// @version      1.0.2
// @description  在银河奶牛游戏中自动将英文消息翻译为中文
// @author       shenhuanjie
// @license      MIT
// @match        https://www.milkywayidle.com/game*
// @match        https://milkywayidle.com/game*
// @icon         https://www.milkywayidle.com/favicon.svg
// @homepage     https://cnb.cool/shenhuanjie/skyner-cn/tamper-monkey-script/mwi-message-translator-zh_cn
// @supportURL   https://cnb.cool/shenhuanjie/skyner-cn/tamper-monkey-script/mwi-message-translator-zh_cn
// @grant        GM_xmlhttpRequest
// @grant        GM_addStyle
// @connect      fanyi-api.baidu.com
// @run-at       document-start
// @noframes
//
// @history      1.0.1 - Added support for more languages, improved translation reliability
// @history      1.0.0 - Initial release
// @downloadURL https://update.greasyfork.org/scripts/535748/%5B%E9%93%B6%E6%B2%B3%E5%A5%B6%E7%89%9B%5D%E8%87%AA%E5%8A%A8%E6%B6%88%E6%81%AF%E7%BF%BB%E8%AF%91%28zh-CN%29.user.js
// @updateURL https://update.greasyfork.org/scripts/535748/%5B%E9%93%B6%E6%B2%B3%E5%A5%B6%E7%89%9B%5D%E8%87%AA%E5%8A%A8%E6%B6%88%E6%81%AF%E7%BF%BB%E8%AF%91%28zh-CN%29.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // ========== 全局配置 ==========
    const CONFIG = {
        // 百度翻译配置
        baiduTranslate:{
            appid: 'xxxxx',       // 替换为你的百度翻译API AppID
            key: 'xxxxx',          // 替换为你的百度翻译API 密钥
        },
        enabled:true,                   // 是否开启翻译
        enableConsoleLog: true,      // 控制台日志开关
        sourceLanguage: 'en',        // 源语言
        targetLanguage: 'zh',     // 目标语言（修正为百度API支持的'zh'）
        logLevel: 'INFO',            // 日志级别: DEBUG, INFO, WARNING, ERROR
        initialScanDelay: 1000,      // 初始扫描延迟(ms)
        rescanInterval: 5000,        // 重新扫描间隔(ms)
        maxTranslationDepth: 5,      // 最大翻译深度
        translationCacheSize: 100,   // 翻译缓存大小
        messageFormat: /【(.+?)】\s*[:：]\s*(.+)/,  // 消息格式正则表达式

        // 类名前缀配置（用于模糊匹配）
        classNamePrefixes: {
            chatMessage: 'ChatMessage_chatMessage__',
            timestamp: 'ChatMessage_timestamp__',
            name: 'ChatMessage_name__',
            chatHistory: 'ChatHistory_chatHistory__',
            systemMessage: 'ChatMessage_systemMessage__'
        },

        // 翻译请求间隔(ms)，避免请求过于频繁被封IP
        translationRequestDelay: 300,

        // 翻译选项
        translateSystemMessages: false, // 是否翻译系统消息
        skipEmojiMessages: true,       // 是否跳过包含表情符号的消息
        minTextLength: 2,               // 最小翻译文本长度
        skipPatterns: [                 // 跳过匹配这些模式的消息
            /^[:：]$/,                  // 冒号
            /^[@#]\w+$/,                // @用户名或#标签
            /^[^\w\s]{2,}$/,            // 纯特殊字符
            /^[\uD800-\uDBFF][\uDC00-\uDFFF]$/ // 表情符号
        ]
    };
    // =============================

    // 工具函数：根据类名前缀生成选择器
    function getClassSelector(prefix) {
        return `[class^="${prefix}"], [class*=" ${prefix}"]`;
    }

    // 翻译缓存，避免重复翻译相同内容
    const translationCache = new Map();

    // 上次翻译请求的时间戳
    let lastTranslationTime = 0;

    // 延迟函数，返回一个Promise，在指定的毫秒数后解析
    function delay(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    // 工具函数：日志记录
    function log(message, level = 'INFO') {
        if (!CONFIG.enableConsoleLog) return;

        if (!['DEBUG', 'INFO', 'WARNING', 'ERROR'].includes(level)) {
            level = 'INFO';
        }

        const logLevels = {
            'DEBUG': 0,
            'INFO': 1,
            'WARNING': 2,
            'ERROR': 3
        };

        if (logLevels[level] < logLevels[CONFIG.logLevel]) {
            return;
        }

        const logColor = {
            DEBUG: '#888',
            INFO: '#2196F3',
            WARNING: '#FFC107',
            ERROR: '#F44336'
        };

        console.log(`%c[Translator][${level}] ${message}`, `color: ${logColor[level]}`);
    }

    // 使用百度翻译API进行翻译（需要appid和密钥）
    async function translateText(text, sourceLang = CONFIG.sourceLanguage, targetLang = CONFIG.targetLanguage) {
        if(!CONFIG.enabled){
            return;
        }
        // 判断是否设置APPId 和密钥
        if(!CONFIG.baiduTranslate.appid || !CONFIG.baiduTranslate.key||CONFIG.baiduTranslate.appid==='xxxxx'|| CONFIG.baiduTranslate.key==='xxxxx'){
            log('未设置APPId 或 密钥', 'ERROR');
            log('已禁用翻译功能', 'ERROR');
            log('请前往 https://api.fanyi.baidu.com 申请 APPID 和密钥', 'ERROR');
            log('并在脚本中配置 APPID 和密钥后，刷新页面', 'ERROR');
            CONFIG.enabled = false;
            return ;
        }
        // 检查缓存
        if (translationCache.has(text)) {
            log(`使用缓存翻译: ${text.substring(0, 30)}...`, 'DEBUG');
            return translationCache.get(text);
        }

        // 如果文本为空或只包含空白字符，直接返回
        if (!text || text.trim() === '') {
            return text;
        }

        log(`翻译文本: ${text.substring(0, 30)}...`, 'DEBUG');

        try {
            // 实现请求延迟，避免请求过于频繁
            const now = Date.now();
            const timeSinceLastRequest = now - lastTranslationTime;
            if (timeSinceLastRequest < CONFIG.translationRequestDelay) {
                const waitTime = CONFIG.translationRequestDelay - timeSinceLastRequest;
                log(`等待 ${waitTime}ms 后发送翻译请求...`, 'DEBUG');
                await delay(waitTime);
            }

            // 更新最后请求时间
            lastTranslationTime = Date.now();

            // 仅在需要发送请求时生成校验参数
            const salt = Date.now().toString();
            console.log('[调试] 生成的salt:', salt); // 调试：输出随机数
            const encodedText = encodeURIComponent(text);
            const signStr = `${CONFIG.baiduTranslate.appid}${text}${salt}${CONFIG.baiduTranslate.key}`;
            console.log('[调试] 签名原始字符串:', signStr); // 调试：输出签名原始字符串
            const sign = MD5(signStr);
            console.log('[调试] 生成的sign:', sign); // 调试：输出计算后的签名
            // 构建百度翻译API请求URL
            const url = `https://fanyi-api.baidu.com/api/trans/vip/translate?q=${encodedText}&from=${sourceLang}&to=${targetLang}&appid=${CONFIG.baiduTranslate.appid}&salt=${salt}&sign=${sign}`;
            console.log('[调试] 发送翻译请求URL:', url); // 调试：输出请求URL

            // 使用Promise包装GM_xmlhttpRequest
            const response = await new Promise((resolve, reject) => {
                GM_xmlhttpRequest({
                    method: 'GET',
                    url: url,
                    headers: {
                        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
                    },
                    onload: function(response) {
                        if (response.status >= 200 && response.status < 300) {
                            resolve(response);
                        } else {
                            reject(new Error(`请求失败: ${response.status} ${response.statusText}`));
                        }
                    },
                    onerror: function(error) {
                        reject(error);
                    }
                });
            });

            // 解析百度翻译API的JSON响应
            const responseData = JSON.parse(response.responseText);
            console.log('[调试] 百度翻译响应数据:', responseData); // 调试：输出完整响应数据
            if (responseData.error_code) {
                console.error('[调试] 百度翻译错误:', responseData.error_msg); // 调试：输出错误详情
                log(`百度翻译错误: ${responseData.error_msg}`, 'ERROR');
                return text;
            }
            if (responseData.trans_result && responseData.trans_result.length > 0) {
                const translatedText = responseData.trans_result[0].dst;
                // 更新缓存
                if (translationCache.size >= CONFIG.translationCacheSize) {
                    const firstKey = translationCache.keys().next().value;
                    translationCache.delete(firstKey);
                }
                translationCache.set(text, translatedText);
                log(`翻译完成: ${text.substring(0, 20)}... -> ${translatedText.substring(0, 20)}...`, 'INFO');
                return translatedText;
            } else {
                log('未获取到翻译结果', 'WARNING');
                return text;
            }

            // 更新缓存
            if (translationCache.size >= CONFIG.translationCacheSize) {
                // 如果缓存已满，删除最早添加的项
                const firstKey = translationCache.keys().next().value;
                translationCache.delete(firstKey);
            }
            translationCache.set(text, translatedText);

            log(`翻译完成: ${text.substring(0, 20)}... -> ${translatedText.substring(0, 20)}...`, 'INFO');
            return translatedText;
        } catch (error) {
            log(`翻译失败: ${error.message}`, 'ERROR');
            return text; // 翻译失败时返回原文
        }
    }

    // 从聊天消息元素中提取用户名和消息内容
    function extractMessageInfo(chatMessageElement) {
        if (!chatMessageElement) return null;

        try {
            // 检查是否是系统消息
            if (chatMessageElement.classList.contains('ChatMessage_systemMessage__3Jz9e')) {
                // 系统消息通常只有一个span，直接包含在消息元素中
                const systemSpan = chatMessageElement.querySelector('span:not(.ChatMessage_timestamp__1iRZO)');
                if (systemSpan && systemSpan.textContent) {
                    return {
                        isSystemMessage: true,
                        username: 'System',
                        contentSpan: systemSpan,
                        originalContent: systemSpan.textContent
                    };
                }
                return null;
            }

            // 查找用户名元素
            const nameSelector = getClassSelector(CONFIG.classNamePrefixes.name);
            const nameElement = chatMessageElement.querySelector(nameSelector);

            if (!nameElement) {
                log('未找到用户名元素', 'DEBUG');
                return null;
            }

            // 提取用户名 - 用户名不需要翻译，所以只是提取文本
            const username = nameElement.textContent.trim();

            // 查找最后一个span元素，通常是消息内容
            // 这个方法更可靠，因为消息内容总是在最后
            const allSpans = Array.from(chatMessageElement.querySelectorAll('span'));

            // 过滤掉时间戳、用户名相关的span和已翻译的span
            const contentSpans = allSpans.filter(span => {
                // 跳过时间戳
                if (span.classList.toString().includes(CONFIG.classNamePrefixes.timestamp)) {
                    return false;
                }

                // 跳过包含用户名的span或其父元素
                if (span.contains(nameElement) || nameElement.contains(span)) {
                    return false;
                }

                // 跳过冒号span (通常紧跟用户名)
                if (span.textContent.trim() === ':' || span.textContent.trim() === '：') {
                    return false;
                }

                // 跳过已经被标记为翻译过的span
                if (span.hasAttribute('data-translated')) {
                    return false;
                }

                // 跳过包含在链接容器中的span
                const linkContainer = span.closest('.ChatMessage_linkContainer__18Kv3');
                if (linkContainer) {
                    return false;
                }

                // 跳过物品元素
                const itemContainer = span.closest('.Item_itemContainer__x7kH1');
                if (itemContainer) {
                    return false;
                }

                return span.textContent.trim() !== '';
            });

            // 如果找不到合适的内容span，返回null
            if (contentSpans.length === 0) {
                log('未找到合适的消息内容span', 'DEBUG');
                return null;
            }

            // 使用最后一个符合条件的span作为消息内容
            const contentSpan = contentSpans[contentSpans.length - 1];

            return {
                isSystemMessage: false,
                username,  // 用户名不翻译
                contentSpan,  // 只翻译消息内容span
                originalContent: contentSpan.textContent
            };
        } catch (error) {
            log(`提取消息信息时出错: ${error.message}`, 'ERROR');
            return null;
        }
    }

    // 处理单个聊天消息
    async function processChatMessage(chatMessageElement) {
        if(!CONFIG.enabled){
            return false;
        }
        if (!chatMessageElement) return false;

        try {
            // 在DEBUG级别下显示消息结构
            if (CONFIG.logLevel === 'DEBUG') {
                debugMessageStructure(chatMessageElement);
            }

            const messageInfo = extractMessageInfo(chatMessageElement);
            if (!messageInfo) {
                log('无法提取消息信息', 'DEBUG');
                return false;
            }

            const { isSystemMessage, username, contentSpan, originalContent } = messageInfo;

            // 确保我们找到的是消息内容而不是用户名
            if (!contentSpan || !originalContent) {
                log('未找到有效的消息内容', 'WARNING');
                return false;
            }

            // 检查是否已翻译（添加一个标记属性）
            if (contentSpan.hasAttribute('data-translated')) {
                log(`跳过已翻译的消息: ${originalContent.substring(0, 20)}...`, 'DEBUG');
                return false;
            }

            // 跳过只包含表情符号、特殊字符或非英文内容的消息
            if (!/[a-zA-Z]{2,}/.test(originalContent)) {
                log(`跳过非英文内容: ${originalContent}`, 'DEBUG');
                contentSpan.setAttribute('data-translated', 'non-english');
                return false;
            }

            // 跳过系统消息（可选，根据需要配置）
            if (isSystemMessage && !CONFIG.translateSystemMessages) {
                log(`跳过系统消息: ${originalContent.substring(0, 20)}...`, 'DEBUG');
                contentSpan.setAttribute('data-translated', 'system');
                return false;
            }

            log(`准备翻译 ${username} 的消息内容: ${originalContent.substring(0, 30)}...`, 'DEBUG');

            // 只翻译消息内容，不翻译用户名
            const translatedContent = await translateText(originalContent);

            // 如果翻译结果与原文相同，则不做更改
            if (translatedContent === originalContent) {
                contentSpan.setAttribute('data-translated', 'same');
                log(`翻译结果与原文相同: ${originalContent.substring(0, 20)}...`, 'DEBUG');
                return false;
            }

            // 更新span内容
            contentSpan.textContent = translatedContent;
            contentSpan.setAttribute('data-translated', 'true');
            contentSpan.setAttribute('title', `原文: ${originalContent}`); // 添加原文作为提示

            log(`已翻译 ${username} 的消息内容: ${originalContent.substring(0, 20)}... -> ${translatedContent.substring(0, 20)}...`, 'INFO');
            return true;
        } catch (error) {
            log(`处理聊天消息时出错: ${error.message}`, 'ERROR');
            return false;
        }
    }

    // 扫描并翻译聊天消息
    async function scanAndTranslate() {
        if(!CONFIG.enabled){
            return;
        }
        log('开始扫描聊天消息...', 'INFO');
        const startTime = performance.now();

        try {
            // 使用类名前缀查找所有聊天消息元素
            const chatMessageSelector = getClassSelector(CONFIG.classNamePrefixes.chatMessage);
            const chatMessages = document.querySelectorAll(chatMessageSelector);

            log(`找到 ${chatMessages.length} 条聊天消息`, 'INFO');

            let totalTranslations = 0;
            for (const message of chatMessages) {
                const translated = await processChatMessage(message);
                if (translated) {
                    totalTranslations++;
                }
            }

            const elapsedTime = performance.now() - startTime;
            log(`扫描完成: ${totalTranslations} 处翻译，耗时 ${elapsedTime.toFixed(2)}ms`, 'INFO');
            return totalTranslations;
        } catch (error) {
            log(`扫描过程中出错: ${error.message}`, 'ERROR');
            return 0;
        }
    }

    // 处理新添加的节点
    async function processAddedNode(node) {
        if (!node || node.nodeType !== Node.ELEMENT_NODE) return;

        try {
            // 检查节点是否是聊天消息
            const chatMessageSelector = getClassSelector(CONFIG.classNamePrefixes.chatMessage);
            if (node.matches && node.matches(chatMessageSelector)) {
                await processChatMessage(node);
                return;
            }

            // 查找节点内的所有聊天消息
            const chatMessages = node.querySelectorAll(chatMessageSelector);
            for (const message of chatMessages) {
                await processChatMessage(message);
            }
        } catch (error) {
            log(`处理新添加节点时出错: ${error.message}`, 'ERROR');
        }
    }

    // 检查元素是否在聊天历史区域内
    function isInChatHistory(element) {
        if (!element) return false;

        // 向上查找聊天历史容器
        let current = element;
        const chatHistorySelector = getClassSelector(CONFIG.classNamePrefixes.chatHistory);

        while (current && current !== document.body) {
            if (current.matches && current.matches(chatHistorySelector)) {
                return true;
            }
            current = current.parentElement;
        }

        return false;
    }

    // 防抖函数，避免频繁处理
    function debounce(func, wait) {
        let timeout;
        return function(...args) {
            const context = this;
            clearTimeout(timeout);
            timeout = setTimeout(() => func.apply(context, args), wait);
        };
    }

    // 处理DOM变化的防抖函数
    const debouncedProcessMutations = debounce(async (mutations) => {
        let hasNewMessages = false;

        for (const mutation of mutations) {
            if (mutation.type === 'childList') {
                // 处理新增节点
                for (const node of mutation.addedNodes) {
                    if (node.nodeType === Node.ELEMENT_NODE && isInChatHistory(node)) {
                        await processAddedNode(node);
                        hasNewMessages = true;
                    }
                }
            } else if (mutation.type === 'characterData') {
                // 处理文本内容变更
                const textNode = mutation.target;
                if (textNode && textNode.nodeType === Node.TEXT_NODE && isInChatHistory(textNode)) {
                    // 查找包含此文本节点的聊天消息元素
                    let current = textNode.parentNode;
                    const chatMessageSelector = getClassSelector(CONFIG.classNamePrefixes.chatMessage);

                    while (current && current !== document.body) {
                        if (current.matches && current.matches(chatMessageSelector)) {
                            await processChatMessage(current);
                            hasNewMessages = true;
                            break;
                        }
                        current = current.parentElement;
                    }
                }
            }
        }

        if (hasNewMessages) {
            log('处理了新的聊天消息', 'DEBUG');
        }
    }, 300); // 300ms防抖延迟

    // 初始化函数
    function init() {
        log('翻译器初始化中...', 'INFO');

        try {
            // 初始延迟扫描，等待页面完全加载
            setTimeout(async () => {
                log('执行初始聊天消息扫描...', 'INFO');
                const initialTranslations = await scanAndTranslate();
                log(`初始扫描完成，翻译了 ${initialTranslations} 条消息`, 'INFO');

                // 动态监听DOM变化
                const observer = new MutationObserver(mutations => {
                    debouncedProcessMutations(mutations);
                });

                // 查找聊天历史容器并监听其变化
                const chatHistorySelector = getClassSelector(CONFIG.classNamePrefixes.chatHistory);
                const chatHistoryElements = document.querySelectorAll(chatHistorySelector);

                if (chatHistoryElements.length > 0) {
                    for (const element of chatHistoryElements) {
                        observer.observe(element, {
                            childList: true,
                            subtree: true,
                            characterData: true
                        });
                        log(`开始监听聊天历史容器: ${element.className}`, 'INFO');
                    }
                } else {
                    // 如果找不到聊天历史容器，则监听整个body
                    observer.observe(document.body, {
                        childList: true,
                        subtree: true,
                        characterData: true
                    });
                    log('未找到聊天历史容器，监听整个页面', 'WARNING');
                }

                log('翻译器已启动并监听DOM变化', 'INFO');
            }, CONFIG.initialScanDelay);

            // 定期重新扫描整个DOM
            setInterval(async () => {
                await scanAndTranslate();
            }, CONFIG.rescanInterval);

            log(`翻译器配置: 源语言=${CONFIG.sourceLanguage}, 目标语言=${CONFIG.targetLanguage}, 扫描间隔=${CONFIG.rescanInterval/1000}s`, 'INFO');
        } catch (error) {
            log(`初始化失败: ${error.message}`, 'ERROR');
        }
    }

    // 添加翻译样式
    function addTranslationStyles() {
        const styleElement = document.createElement('style');
        styleElement.textContent = `
            span[data-translated="true"] {
                color: #4CAF50 !important;
                text-decoration: underline dotted #4CAF50;
                position: relative;
            }

            span[data-translated="true"]:hover::after {
                content: attr(title);
                position: absolute;
                bottom: 100%;
                left: 0;
                background: rgba(0, 0, 0, 0.8);
                color: white;
                padding: 4px 8px;
                border-radius: 4px;
                font-size: 12px;
                white-space: pre-wrap;
                max-width: 300px;
                z-index: 1000;
            }

            .translator-status {
                position: fixed;
                bottom: 10px;
                right: 10px;
                background: rgba(33, 150, 243, 0.8);
                color: white;
                padding: 5px 10px;
                border-radius: 4px;
                font-size: 12px;
                z-index: 10000;
                display: none;
                transition: opacity 0.3s;
            }
        `;
        document.head.appendChild(styleElement);
    }

    // 添加状态指示器
    function addStatusIndicator() {
        const statusDiv = document.createElement('div');
        statusDiv.className = 'translator-status';
        statusDiv.textContent = '翻译器已启动';
        document.body.appendChild(statusDiv);

        // 显示状态指示器几秒钟，然后淡出
        setTimeout(() => {
            statusDiv.style.display = 'block';
            setTimeout(() => {
                statusDiv.style.opacity = '0';
                setTimeout(() => {
                    statusDiv.style.display = 'none';
                }, 1000);
            }, 3000);
        }, 1000);

        return statusDiv;
    }

    // 更新状态指示器
    function updateStatus(message, duration = 3000) {
        if(!CONFIG.enabled){
            return;
        }
        const statusDiv = document.querySelector('.translator-status') || addStatusIndicator();
        statusDiv.textContent = message;
        statusDiv.style.display = 'block';
        statusDiv.style.opacity = '1';

        setTimeout(() => {
            statusDiv.style.opacity = '0';
            setTimeout(() => {
                statusDiv.style.display = 'none';
            }, 1000);
        }, duration);
    }

    // 启动脚本
    function startScript() {
        // 添加样式
        addTranslationStyles();

        // 初始化翻译器
        init();

        // 添加状态指示器
        addStatusIndicator();

        // 打印初始状态信息
        if (CONFIG.enableConsoleLog) {
            console.log('%c[Translator] 翻译器已加载，控制台日志已开启', 'color: #2196F3');
        } else {
            console.log('%c[Translator] 翻译器已加载，控制台日志已关闭', 'color: #888');
        }
    }

    // 根据页面加载状态启动脚本
    if (document.readyState === 'loading') {
        window.addEventListener('DOMContentLoaded', startScript);
    } else {
        startScript();
    }

    // 调试函数：显示消息结构
    function debugMessageStructure(chatMessageElement) {
        if (!CONFIG.enableConsoleLog || CONFIG.logLevel !== 'DEBUG') return;

        try {
            console.group('消息结构调试');
            console.log('消息元素:', chatMessageElement);

            // 查找用户名元素
            const nameSelector = getClassSelector(CONFIG.classNamePrefixes.name);
            const nameElement = chatMessageElement.querySelector(nameSelector);
            console.log('用户名元素:', nameElement);

            if (nameElement) {
                console.log('用户名文本:', nameElement.textContent.trim());
            }

            // 查找所有span元素
            const spans = chatMessageElement.querySelectorAll('span');
            console.log('所有span元素:', spans);

            // 查找可能的消息内容span
            for (let i = 0; i < spans.length; i++) {
                const span = spans[i];
                console.log(`Span ${i}:`, {
                    element: span,
                    text: span.textContent.trim(),
                    classes: span.className,
                    containsUserName: nameElement && (span.contains(nameElement) || nameElement.contains(span))
                });
            }

            console.groupEnd();
        } catch (error) {
            console.error('调试消息结构时出错:', error);
        }
    }

    // 导出一些函数到全局作用域，方便调试
    window.messageTranslator = {
        translate: translateText,
        scan: scanAndTranslate,
        updateStatus: updateStatus,
        config: CONFIG,
        debug: {
            messageStructure: debugMessageStructure,
            extractMessageInfo: extractMessageInfo
        }
    };

    // 整合自md5.js的MD5函数实现
    var MD5 = function (string) {

        function RotateLeft(lValue, iShiftBits) {
            return (lValue<<iShiftBits) | (lValue>>>(32-iShiftBits));
        }

        function AddUnsigned(lX,lY) {
            var lX4,lY4,lX8,lY8,lResult;
            lX8 = (lX & 0x80000000);
            lY8 = (lY & 0x80000000);
            lX4 = (lX & 0x40000000);
            lY4 = (lY & 0x40000000);
            lResult = (lX & 0x3FFFFFFF)+(lY & 0x3FFFFFFF);
            if (lX4 & lY4) {
                return (lResult ^ 0x80000000 ^ lX8 ^ lY8);
            }
            if (lX4 | lY4) {
                if (lResult & 0x40000000) {
                    return (lResult ^ 0xC0000000 ^ lX8 ^ lY8);
                } else {
                    return (lResult ^ 0x40000000 ^ lX8 ^ lY8);
                }
            } else {
                return (lResult ^ lX8 ^ lY8);
            }
        }

        function F(x,y,z) { return (x & y) | ((~x) & z); }
        function G(x,y,z) { return (x & z) | (y & (~z)); }
        function H(x,y,z) { return (x ^ y ^ z); }
        function I(x,y,z) { return (y ^ (x | (~z))); }

        function FF(a,b,c,d,x,s,ac) {
            a = AddUnsigned(a, AddUnsigned(AddUnsigned(F(b, c, d), x), ac));
            return AddUnsigned(RotateLeft(a, s), b);
        };

        function GG(a,b,c,d,x,s,ac) {
            a = AddUnsigned(a, AddUnsigned(AddUnsigned(G(b, c, d), x), ac));
            return AddUnsigned(RotateLeft(a, s), b);
        };

        function HH(a,b,c,d,x,s,ac) {
            a = AddUnsigned(a, AddUnsigned(AddUnsigned(H(b, c, d), x), ac));
            return AddUnsigned(RotateLeft(a, s), b);
        };

        function II(a,b,c,d,x,s,ac) {
            a = AddUnsigned(a, AddUnsigned(AddUnsigned(I(b, c, d), x), ac));
            return AddUnsigned(RotateLeft(a, s), b);
        };

        function ConvertToWordArray(string) {
            var lWordCount;
            var lMessageLength = string.length;
            var lNumberOfWords_temp1=lMessageLength + 8;
            var lNumberOfWords_temp2=(lNumberOfWords_temp1-(lNumberOfWords_temp1 % 64))/64;
            var lNumberOfWords = (lNumberOfWords_temp2+1)*16;
            var lWordArray=Array(lNumberOfWords-1);
            var lBytePosition = 0;
            var lByteCount = 0;
            while ( lByteCount < lMessageLength ) {
                lWordCount = (lByteCount-(lByteCount % 4))/4;
                lBytePosition = (lByteCount % 4)*8;
                lWordArray[lWordCount] = (lWordArray[lWordCount] | (string.charCodeAt(lByteCount)<<lBytePosition));
                lByteCount++;
            }
            lWordCount = (lByteCount-(lByteCount % 4))/4;
            lBytePosition = (lByteCount % 4)*8;
            lWordArray[lWordCount] = lWordArray[lWordCount] | (0x80<<lBytePosition);
            lWordArray[lNumberOfWords-2] = lMessageLength<<3;
            lWordArray[lNumberOfWords-1] = lMessageLength>>>29;
            return lWordArray;
        };

        function WordToHex(lValue) {
            var WordToHexValue="",WordToHexValue_temp="",lByte,lCount;
            for (lCount = 0;lCount<=3;lCount++) {
                lByte = (lValue>>>(lCount*8)) & 255;
                WordToHexValue_temp = "0" + lByte.toString(16);
                WordToHexValue = WordToHexValue + WordToHexValue_temp.substr(WordToHexValue_temp.length-2,2);
            }
            return WordToHexValue;
        };

        function Utf8Encode(string) {
            string = string.replace(/\r\n/g,"\n");
            var utftext = "";

            for (var n = 0; n < string.length; n++) {

                var c = string.charCodeAt(n);

                if (c < 128) {
                    utftext += String.fromCharCode(c);
                }
                else if((c > 127) && (c < 2048)) {
                    utftext += String.fromCharCode((c >> 6) | 192);
                    utftext += String.fromCharCode((c & 63) | 128);
                }
                else {
                    utftext += String.fromCharCode((c >> 12) | 224);
                    utftext += String.fromCharCode(((c >> 6) & 63) | 128);
                    utftext += String.fromCharCode((c & 63) | 128);
                }

            }

            return utftext;
        };

        var x=Array();
        var k,AA,BB,CC,DD,a,b,c,d;
        var S11=7, S12=12, S13=17, S14=22;
        var S21=5, S22=9 , S23=14, S24=20;
        var S31=4, S32=11, S33=16, S34=23;
        var S41=6, S42=10, S43=15, S44=21;

        string = Utf8Encode(string);

        x = ConvertToWordArray(string);

        a = 0x67452301; b = 0xEFCDAB89; c = 0x98BADCFE; d = 0x10325476;

        for (k=0;k<x.length;k+=16) {
            AA=a; BB=b; CC=c; DD=d;
            a=FF(a,b,c,d,x[k+0], S11,0xD76AA478);
            d=FF(d,a,b,c,x[k+1], S12,0xE8C7B756);
            c=FF(c,d,a,b,x[k+2], S13,0x242070DB);
            b=FF(b,c,d,a,x[k+3], S14,0xC1BDCEEE);
            a=FF(a,b,c,d,x[k+4], S11,0xF57C0FAF);
            d=FF(d,a,b,c,x[k+5], S12,0x4787C62A);
            c=FF(c,d,a,b,x[k+6], S13,0xA8304613);
            b=FF(b,c,d,a,x[k+7], S14,0xFD469501);
            a=FF(a,b,c,d,x[k+8], S11,0x698098D8);
            d=FF(d,a,b,c,x[k+9], S12,0x8B44F7AF);
            c=FF(c,d,a,b,x[k+10],S13,0xFFFF5BB1);
            b=FF(b,c,d,a,x[k+11],S14,0x895CD7BE);
            a=FF(a,b,c,d,x[k+12],S11,0x6B901122);
            d=FF(d,a,b,c,x[k+13],S12,0xFD987193);
            c=FF(c,d,a,b,x[k+14],S13,0xA679438E);
            b=FF(b,c,d,a,x[k+15],S14,0x49B40821);
            a=GG(a,b,c,d,x[k+1], S21,0xF61E2562);
            d=GG(d,a,b,c,x[k+6], S22,0xC040B340);
            c=GG(c,d,a,b,x[k+11],S23,0x265E5A51);
            b=GG(b,c,d,a,x[k+0], S24,0xE9B6C7AA);
            a=GG(a,b,c,d,x[k+5], S21,0xD62F105D);
            d=GG(d,a,b,c,x[k+10],S22,0x2441453);
            c=GG(c,d,a,b,x[k+15],S23,0xD8A1E681);
            b=GG(b,c,d,a,x[k+4], S24,0xE7D3FBC8);
            a=GG(a,b,c,d,x[k+9], S21,0x21E1CDE6);
            d=GG(d,a,b,c,x[k+14],S22,0xC33707D6);
            c=GG(c,d,a,b,x[k+3], S23,0xF4D50D87);
            b=GG(b,c,d,a,x[k+8], S24,0x455A14ED);
            a=GG(a,b,c,d,x[k+13],S21,0xA9E3E905);
            d=GG(d,a,b,c,x[k+2], S22,0xFCEFA3F8);
            c=GG(c,d,a,b,x[k+7], S23,0x676F02D9);
            b=GG(b,c,d,a,x[k+12],S24,0x8D2A4C8A);
            a=HH(a,b,c,d,x[k+5], S31,0xFFFA3942);
            d=HH(d,a,b,c,x[k+8], S32,0x8771F681);
            c=HH(c,d,a,b,x[k+11],S33,0x6D9D6122);
            b=HH(b,c,d,a,x[k+14],S34,0xFDE5380C);
            a=HH(a,b,c,d,x[k+1], S31,0xA4BEEA44);
            d=HH(d,a,b,c,x[k+4], S32,0x4BDECFA9);
            c=HH(c,d,a,b,x[k+7], S33,0xF6BB4B60);
            b=HH(b,c,d,a,x[k+10],S34,0xBEBFBC70);
            a=HH(a,b,c,d,x[k+13],S31,0x289B7EC6);
            d=HH(d,a,b,c,x[k+0], S32,0xEAA127FA);
            c=HH(c,d,a,b,x[k+3], S33,0xD4EF3085);
            b=HH(b,c,d,a,x[k+6], S34,0x4881D05);
            a=HH(a,b,c,d,x[k+9], S31,0xD9D4D039);
            d=HH(d,a,b,c,x[k+12],S32,0xE6DB99E5);
            c=HH(c,d,a,b,x[k+15],S33,0x1FA27CF8);
            b=HH(b,c,d,a,x[k+2], S34,0xC4AC5665);
            a=II(a,b,c,d,x[k+0], S41,0xF4292244);
            d=II(d,a,b,c,x[k+7], S42,0x432AFF97);
            c=II(c,d,a,b,x[k+14],S43,0xAB9423A7);
            b=II(b,c,d,a,x[k+5], S44,0xFC93A039);
            a=II(a,b,c,d,x[k+12],S41,0x655B59C3);
            d=II(d,a,b,c,x[k+3], S42,0x8F0CCC92);
            c=II(c,d,a,b,x[k+10],S43,0xFFEFF47D);
            b=II(b,c,d,a,x[k+1], S44,0x85845DD1);
            a=II(a,b,c,d,x[k+8], S41,0x6FA87E4F);
            d=II(d,a,b,c,x[k+15],S42,0xFE2CE6E0);
            c=II(c,d,a,b,x[k+6], S43,0xA3014314);
            b=II(b,c,d,a,x[k+13],S44,0x4E0811A1);
            a=II(a,b,c,d,x[k+4], S41,0xF7537E82);
            d=II(d,a,b,c,x[k+11],S42,0xBD3AF235);
            c=II(c,d,a,b,x[k+2], S43,0x2AD7D2BB);
            b=II(b,c,d,a,x[k+9], S44,0xEB86D391);
            a=AddUnsigned(a,AA);
            b=AddUnsigned(b,BB);
            c=AddUnsigned(c,CC);
            d=AddUnsigned(d,DD);
        }

        var temp = WordToHex(a)+WordToHex(b)+WordToHex(c)+WordToHex(d);

        return temp.toLowerCase();
    };
})();