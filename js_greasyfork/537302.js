// ==UserScript==
// @name         多模型同时回答 & 目录导航
// @namespace    http://tampermonkey.net/
// @version      5.2.0
// @description  一键自动同时在各家大模型官网提问，免去复制粘贴的麻烦；提供历次提问、回答细节的目录导航，方便快速定位。支持范围：DS，Kimi，千问，豆包，元宝，ChatGPT，Gemini，Claude，Grok 等
// @author       interest2
// @match        https://chat.deepseek.com/*
// @match        https://www.kimi.com/*
// @match        https://www.qianwen.com/*
// @match        https://chat.qwen.ai/*
// @match        https://www.doubao.com/*
// @match        https://yuanbao.tencent.com/*
// @match        https://chat.zchat.tech/*
// @match        https://chatgpt.com/*
// @match        https://gemini.google.com/*
// @match        https://aistudio.google.com/*
// @match        https://claude.ai/*
// @match        https://grok.com/*
// @noframes
// @grant        GM_addStyle
// @grant        GM_xmlhttpRequest
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_deleteValue
// @grant        GM_addValueChangeListener
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/537302/%E5%A4%9A%E6%A8%A1%E5%9E%8B%E5%90%8C%E6%97%B6%E5%9B%9E%E7%AD%94%20%20%E7%9B%AE%E5%BD%95%E5%AF%BC%E8%88%AA.user.js
// @updateURL https://update.greasyfork.org/scripts/537302/%E5%A4%9A%E6%A8%A1%E5%9E%8B%E5%90%8C%E6%97%B6%E5%9B%9E%E7%AD%94%20%20%E7%9B%AE%E5%BD%95%E5%AF%BC%E8%88%AA.meta.js
// ==/UserScript==

(function () {
    'use strict';
    console.log("ai script, start");

    let CONTENT_MAX_WIDTH = 830; // 部分站点内容最大宽度 px
    const DEFAULT_WAIT_ELEMENT_TIME = 20000; // 等待元素出现的超时时间
    const MODEL_GROUP_INDEX = 6;
    const PANEL_BUTTON_WIDTH = "70px";       // 多选面板按钮固定宽度（顶部主按钮）
    const PANEL_COLUMN_WIDTH = "135px";      // 多选面板模型列固定宽度
    const PANEL_SMALL_BUTTON_WIDTH = "40px"; // 全选/清空等小按钮宽度
    const PANEL_DISABLE_BUTTON_COMPACT_WIDTH = "24px"; // 缩略模式下禁用按钮宽度

    /******************************************************************************
     * ═══════════════════════════════════════════════════════════════════════
     * ║                                                                      ║
     * ║  🔧 1、适配各站点相关代码  🔧                                      ║
     * ║                                                                      ║
     * ═══════════════════════════════════════════════════════════════════════
     ******************************************************************************/

    // 定义站点常量
    const DEEPSEEK = 0;
    const KIMI = 1;
    const TONGYI = 2;
    const QWEN = 3;
    const DOUBAO = 4;
    const YUANBAO = 5;

    const ZCHAT = 10;
    const CHATGPT = 11;
    const GEMINI = 12;
    const STUDIO = 13;
    const CLAUDE = 14;
    const GROK = 15;

    // 输入框类型分类
    const inputAreaTypes = {
        textarea: [DEEPSEEK, TONGYI, DOUBAO, QWEN, STUDIO],
        lexical: [KIMI, CHATGPT, ZCHAT, GEMINI, CLAUDE, GROK, YUANBAO]
    };

    // 通用输入框选择器，两类：textarea标签、lexical
    const getContenteditableInput = () => document.querySelector('[contenteditable="true"]:has(p)');

    // 选择器配置
    const selectors = {
        // 输入框分两类处理
        inputArea: {
            ...Object.fromEntries(inputAreaTypes.textarea.map(site => [site, getTextareaInput])),
            ...Object.fromEntries(inputAreaTypes.lexical.map(site => [site, getContenteditableInput]))
        },
        // 已提问的列表（官网样式变更不会影响同步提问功能，只影响目录功能）
        questionList: {
            [DEEPSEEK]: () => filterQuestions(document.getElementsByClassName("ds-message")),
            [KIMI]: () => document.getElementsByClassName("user-content"),
            [TONGYI]: () => document.querySelectorAll('[class^="bubble-"]'),
            [QWEN]: () => document.getElementsByClassName("user-message-content"),
            [DOUBAO]: () => Array.from(document.querySelectorAll('[data-testid="message_text_content"]')).filter(el => !el.children || el.children.length === 0),
            [YUANBAO]: () => document.querySelectorAll(".hyc-content-text"),

            [ZCHAT]: () => document.querySelectorAll('[data-message-author-role="user"]'),
            [CHATGPT]: () => document.querySelectorAll('[data-message-author-role="user"]'),
            [GEMINI]: () => document.getElementsByTagName('user-query'),
            [STUDIO]: () => document.querySelectorAll('[data-turn-role="User"]'),
            [CLAUDE]: () => document.querySelectorAll('[data-testid="user-message"]'),
            [GROK]: () => document.querySelectorAll('div.items-end .message-bubble')
        }
    };

    function getTextareaInput() {
        const textareas = document.getElementsByTagName('textarea');
        if (textareas.length === 0) return null;
        if (textareas.length === 1) return textareas[0];

        // 尝试从缓存获取
        const TEXTAREA_CACHE_KEY = 'textarea_input_cache';
        const cacheStr = getS(TEXTAREA_CACHE_KEY);
        if (!isEmpty(cacheStr)) {
            try {
                const cache = JSON.parse(cacheStr);
                if (cache && cache.id) {
                    const cachedElement = document.getElementById(cache.id);
                    if (cachedElement) {
                        return cachedElement;
                    }
                }
            } catch (e) {
                // 解析失败，继续执行查找逻辑
            }
        }

        // 如果有多个textarea，返回高度最大的
        let maxHeight = 0;
        let maxTextarea = textareas[0];
        for (let i = 0; i < textareas.length; i++) {
            const height = textareas[i].offsetHeight || textareas[i].clientHeight;
            if (height > maxHeight) {
                maxHeight = height;
                maxTextarea = textareas[i];
            }
        }

        // 存储找到的最大textarea的id
        if (maxTextarea) {
            const cacheData = {
                id: maxTextarea.id || ''
            };
            setS(TEXTAREA_CACHE_KEY, JSON.stringify(cacheData));
        }

        return maxTextarea;
    }

    // url里关键词与各站点的对应关系
    const keywords = {
        "deepseek": DEEPSEEK,
        "kimi": KIMI,
        "qianwen": TONGYI,
        "qwen": QWEN,
        "doubao": DOUBAO,
        "yuanbao": YUANBAO,

        "zchat": ZCHAT,
        "chatgpt": CHATGPT,
        "gemini": GEMINI,
        "aistudio": STUDIO,
        "claude": CLAUDE,
        "grok": GROK
    };

    // 各家大模型的网址（新对话，历史对话的前缀）
    const webSites = {
        [KIMI]: ["https://www.kimi.com/"],
        [DEEPSEEK]: ["https://chat.deepseek.com/"],
        [TONGYI]: ["https://www.qianwen.com/"],
        [CHATGPT]: ["https://chatgpt.com/"],
        [DOUBAO]: ["https://www.doubao.com/chat"],
        [YUANBAO]: ["https://yuanbao.tencent.com/"],

        [ZCHAT]: ["https://chat.zchat.tech/"],
        [GEMINI]: ["https://gemini.google.com/app"],
        [STUDIO]: ["https://aistudio.google.com/"],
        [QWEN]: ["https://chat.qwen.ai/"],
        [CLAUDE]: ["https://claude.ai/chat"],
        [GROK]: ["https://grok.com/"]
    };

    // 多选面板里，各站点的全称、简称
    let wordConfig = [
        { site: DEEPSEEK, word: 'DeepSeek', alias: 'D'},
        { site: KIMI, word: 'Kimi', alias: 'K' },
        { site: TONGYI, word: '千问', alias: '千' },
        { site: QWEN, word: 'Qwen', alias: 'Q' },
        { site: DOUBAO, word: '豆包', alias: '豆' },
        { site: YUANBAO, word: '元宝', alias: '元' },

        { site: CHATGPT, word: 'ChatGPT', alias: 'C' },
        { site: GEMINI, word: 'Gemini', alias: 'G' },
        { site: STUDIO, word: 'AI Studio', alias: 'A' },
        { site: CLAUDE, word: 'Claude', alias: 'Cl' },
        { site: GROK, word: 'Grok', alias: 'Gr' },
        { site: ZCHAT, word: 'ZCHAT-GPT', alias: 'Z' }
    ];

    // 过滤掉被禁用的站点
    const DISABLE_SITES = [];
    wordConfig = wordConfig.filter(item => !DISABLE_SITES.includes(item.site));

    // （可选）隐藏输入框及周边区域，所需隐藏的元素，是输入框本体的第几层父元素？以下数字即层数（后续应改为半自动配置）
    const inputAreaHideParentLevel = {
        [DEEPSEEK]: 5,
        [KIMI]: 4,
        [TONGYI]: 6,
        [QWEN]: 9,
        [DOUBAO]: 11,
        [YUANBAO]: 10,

        [ZCHAT]: 10,
        [CHATGPT]: 10,
        [GEMINI]: 9,
        [STUDIO]: 11,
        [CLAUDE]: 6,
        [GROK]: 10
    };

    const newSites = Object.fromEntries(
        Object.entries(webSites).map(([key, [baseUrl]]) => [key, baseUrl])
    );

    // 表示当前站点的变量
    let site = 0;
    let currentUrl = getUrl();

    // 根据当前网址关键词，设置site值
    for (const keyword in keywords) {
        if (currentUrl.indexOf(keyword) > -1) {
            site = keywords[keyword];
            break;
        }
    }

    // 检查当前站点是否被禁用
    if (DISABLE_SITES.includes(site)) {
        console.log(`站点 ${site} 已被禁用，脚本完全退出`);
        return;
    }

    // 判断是否需要修饰键（Ctrl/Command）来发送消息
    function needModifierForEnter() {
        return site === STUDIO;
    }

    // 面板数据常量
    const CHOSEN_SITE = "chosenSite";
    const COMMON_COMBINATIONS_KEY = "commonCombinations";
    const ADD_COMBINATION_BUTTON_CLICKED_KEY = "addCombinationButtonClicked"; // 设定组合按钮是否已点击过

    // 按钮显示状态存储键名（GM存储，所有站点共享）
    const SHOW_TOGGLE_BUTTON_KEY = "showToggleButton";
    const SHOW_BOOKMARK_BUTTON_KEY = "showBookmarkButton"; // 同时控制"书签"和"历史"两个按钮
    const SHOW_GROUPED_BUTTONS_KEY = "showGroupedButtons"; // 控制"分组新对话"和图钉按钮
    const DEFAULT_HIDE_INPUT_AREA_KEY = "defaultHideInputArea"; // 默认隐藏输入框

    // 书签功能总开关存储键名（GM存储，所有站点共享）
    const ENABLE_BOOKMARK_FEATURE_KEY = "enableBookmarkFeature";

    // 多选面板可见模型列表存储键名（GM存储，所有站点共享）
    const VISIBLE_MODELS_KEY = "visibleModels";

    // 输入框隐藏层级自定义配置存储键名（GM存储，所有站点共享）
    const INPUT_AREA_HIDE_PARENT_LEVEL_KEY = "inputAreaHideParentLevel";

    // 站点图标存储键名前缀（GM存储，所有站点共享）
    const SITE_ICON_KEY_PREFIX = "siteIcon_";

    /******************************************************************************
     * ═══════════════════════════════════════════════════════════════════════
     * ║                                                                      ║
     * ║  🔧 2、一些函数和变量  🔧                                            ║
     * ║                                                                      ║
     * ═══════════════════════════════════════════════════════════════════════
     ******************************************************************************/

    // 过滤出问题列表（偶数索引元素）
    const filterQuestions = (elements) => {
        if (!isEmpty(elements)) {
            let elementsArray = Array.from(elements);
            return elementsArray.filter((item, index) => index % 2 === 0);
        }
        return [];
    };

    const INVISIBLE_EDGE_CHARS_REGEX = /^[\u200B-\u200D\uFEFF]+|[\u200B-\u200D\uFEFF]+$/g;

    // 标准化问题文本：移除头尾不可见字符 + 特定站点前缀
    const normalizeQuestionText = (text) => {
        if (!text) return '';
        const cleanedText = text.replace(INVISIBLE_EDGE_CHARS_REGEX, '');
        const trimmedText = cleanedText.trim();
        const removeWord = 'User';
        if (site === STUDIO && trimmedText.startsWith(removeWord)) {
            return trimmedText.substring(removeWord.length).trim();
        }
        return trimmedText;
    };


    // 以下几个，是获取元素的入口方法
    function getQuestionList() {
        const selector = selectors.questionList[site];
        return selector ? selector() : [];
    }

    function getInputArea() {
        const selector = selectors.inputArea[site];
        return selector ? selector() : null;
    }

    // STUDIO站点的特殊处理已移到getSubNavTop函数中

    // 系统功能配置
    const OPEN_GAP = 300; // 打开网页的间隔
    const HIBERNATE_GAP = 600; // 单位：秒

    // 存储时的特征词
    const T = "tool-";
    const HEART_KEY_PREFIX ="lastHeartbeat-";
    const SITE_URL_PREFIX = "siteUrl-"; // 站点URL存储前缀
    const PINNED_GROUPS_KEY = "pinnedGroupUrls"; // {groupId: {siteId:url}}
    const PINNED_GROUP_NAMES_KEY = "pinnedGroupNames"; // {groupId: groupName}
    const PINNED_GROUP_ID_KEY = "pinnedGroupIdCounter"; // 自增分组ID计数器
    const GROUP_NAME_PREFIX = "分组"; // 默认分组名前缀
    const PIN_REQUEST_KEY = "pinRequestSignal"; // 请求各站点上报URL
    const PIN_RESPONSE_PREFIX = "pinResponse-"; // 各站点上报URL的响应key

    // 同步书签相关常量
    const BOOKMARK_PREFIX = "bookmark-";           // 书签存储key前缀
    const BOOKMARK_ID_COUNTER = "bookmarkIdCounter"; // 书签ID计数器
    const CURRENT_BOOKMARK_KEY = "currentBookmarkKey"; // 当前书签key
    // 已移除BOOKMARK_KEY_LIST，改为从分组映射叠加获取全部书签
    const BOOKMARK_GROUP_LIST = "bookmarkGroupList"; // 分组列表（二级分组）
    const BOOKMARK_GROUP_MAP = "bookmarkGroupMap"; // 分组到书签ID的映射 {groupId: [bookmarkId数组]}，存储时移除"bookmark-"前缀以节省空间
    const BOOKMARK_LAST_SELECTED_GROUP = "bookmarkLastSelectedGroup"; // 上次选中的分组ID
    const DEFAULT_GROUP_NAME = "默认"; // 默认分组名称
    const DEFAULT_GROUP_ID = 0; // 默认分组代号
    const TOP_LEVEL_GROUP_LIST = "topLevelGroupList"; // 一级分组列表 {id: name}
    const TOP_LEVEL_GROUP_MAP = "topLevelGroupMap"; // 一级分组到二级分组的映射 {topLevelId: [secondLevelId数组]}
    const TOP_LEVEL_GROUP_ID_COUNTER = "topLevelGroupIdCounter"; // 一级分组ID计数器（从1000开始）
    const BOOKMARK_QUESTION_MAX_LENGTH = 150; // 书签question最大长度
    // 书签按钮公共样式（不包含 bottom 和 background）
    const BOOKMARK_BTN_BASE_STYLE = "position:fixed;right:0;color:white;font-size:14px;display:flex;align-items:center;justify-content:center;cursor:pointer;z-index:10000;border-radius:6px 0 0 6px;box-shadow:-2px 2px 8px rgba(0,0,0,0.2);user-select:none;padding:3px 5px";

    let userid = getGV("userid");
    if(isEmpty(userid)){
        userid = guid();
        setGV("userid", userid);
    }

    // 生成映射
    const wordToSite = {};
    const siteToWord = {};
    const siteToAlias = {};
    const wordToAlias = {};
    const words = [];

    wordConfig.forEach(({ site, word, alias }) => {
        words.push(word);

        wordToSite[word] = site;
        siteToWord[site] = word;
        siteToAlias[site] = alias;
        wordToAlias[word] = alias;
    });


    /******************************************************************************
     * ═══════════════════════════════════════════════════════════════════════
     * ║                                                                      ║
     * ║  📡 3、主从节点逻辑  📡                                              ║
     * ║                                                                      ║
     * ═══════════════════════════════════════════════════════════════════════
     ******************************************************************************/

    // 给发送环节加锁。因为send环节是异步轮询，新问题来时send未必轮询结束
    let sendLock = false;

    // 页面加载时，向本地存储发送一次心跳
    setGV(HEART_KEY_PREFIX + site, Date.now());
    // 同时更新当前站点的URL
    setGV(SITE_URL_PREFIX + site, getUrl());
    let lastQuestion = "";

    function masterCheck(lastestQ){
        if(sendLock){
            return;
        }
        if(isEmpty(lastestQ)){
            return;
        }
        if(lastestQ === lastQuestion){
            return;
        }

        let msg = {
            question: lastestQ,
            date: Date.now()
        };
        console.log(msg);
        setGV("msg", msg);
        lastQuestion = lastestQ;

        let isDisable = getGV("disable");
        if(isDisable){
            return;
        }
        addCurrentToStorage();
    }

    // 监听是否有新的提问
    GM_addValueChangeListener('msg', function(name, oldValue, msg, remote) {
        if(!remote){
            return;
        }
        if(getGV("disable") === true){
            return;
        }

        let sites = getSitesOfStorage();
        if(sites.includes(site)){
            // 避免短时重复发送：假定新的提问出现时，上次的提问已经发送出去，故正常情况sendLock已解锁
            if(sendLock){
                return;
            }

            let msg = getGV("msg");
            const msgDate = msg?.date;
            if(!msgDate || (Date.now() - msgDate) > 20 * 1000){
                return;
            }

            let question = msg.question;
            // 避免重复发送
            if(question === lastQuestion){
                return;
            }
            sendQuestion(question);
        }
    });

    /******************************************************************************
     * ═══════════════════════════════════════════════════════════════════════
     * ║                                                                      ║
     * ║  ⚙️ 4、从节点异步轮询检查  ⚙️                                        ║
     * ║                                                                      ║
     * ═══════════════════════════════════════════════════════════════════════
     ******************************************************************************/

    /**
     * 发送提问内容
     * 整体涉及这些轮询检查：① 输入框的存在 ② 发送按钮的存在 ③ 输入框的清空
     */

    /**
     * 发送问题的主流程
     */
    async function sendQuestion(content) {
        updateBoxFromStorage();
        sendLock = true;
        lastQuestion = content;

        try {
            // 步骤1: 等待输入框出现（使用 MutationObserver）
            const inputArea = await waitForElement(
                () => getInputArea(),
                {timeout: 10000, timeoutMsg: "监测输入框存在超时"}
            );
            // 步骤2、3: 粘贴内容到输入框、模拟回车发送
            await pasteContent(inputArea, content);
            await waitAndEnter(inputArea);

        } catch (error) {
            console.error("发送问题失败:", error);
            sendLock = false;
        }
    }

    /**
     * 模拟回车发送（公共函数）
     */
    function enterKeySend(inputArea) {
        const needModifier = needModifierForEnter();
        const event = new KeyboardEvent('keydown', {
            key: 'Enter',
            code: 'Enter',
            keyCode: 13,
            which: 13,
            bubbles: true,
            cancelable: true,
            ctrlKey: needModifier,
            metaKey: needModifier
        });
        event.isSimulated = true;
        inputArea.dispatchEvent(event);
    }

    /**
     * 等待发送按钮出现并执行发送流程
     */
    async function waitAndEnter(inputArea) {
        console.log(curDate() + "h2 模拟回车发送");

        try {
            await new Promise(resolve => setTimeout(resolve, 400));

            // 模拟回车发送
            enterKeySend(inputArea);

            await verifySendSuccess();

        } catch (error) {
            console.error("发送失败:", error);
            sendLock = false;
            throw error;
        }
    }

    /**
     * 验证发送成功（输入框内容清空）
     */
    async function verifySendSuccess() {
        const pollInterval = 1000;
        const maxPollTime = 20000;
        const startTime = Date.now();
        if(site === YUANBAO){
            pollInterval = 2000;
        }

        return new Promise((resolve) => {
            function checkInputArea() {
                const elapsed = Date.now() - startTime;
                const inputArea = getInputArea();
                const areaContent = getInputContent(inputArea);

                // 输入框为空，表明发送成功
                if (!areaContent || areaContent.trim() === '') {
                    sendLock = false;
                    resolve();
                    return;
                }

                // 超时，解锁并返回
                if (elapsed >= maxPollTime) {
                    console.warn("发送验证超时，但可能已经成功发送");
                    sendLock = false;
                    resolve();
                    return;
                }


                // 输入框仍有内容，继续模拟回车发送
                if (inputArea) {
                    console.log(curDate() + "h3 重试发送");
                    enterKeySend(inputArea);
                }

                setTimeout(checkInputArea, pollInterval);
            }

            setTimeout(checkInputArea, pollInterval);
        });
    }

    /**
     * 输入框粘贴提问内容
     */
    async function pasteContent(editor, content) {
        return new Promise((resolve) => {
            setTimeout(() => {
                // 输入框粘贴文字，大致分两类处理。其中第一类里 kimi 特殊处理
                //  第一类（lexical）
                if (inputAreaTypes.lexical.includes(site)) {
                    if ([KIMI].includes(site)) {
                        editor.dispatchEvent(new InputEvent('input', { bubbles: true, data: content }));
                    } else {
                        editor.textContent = content;
                    }
                    //  第二类（textarea 标签）
                } else if (inputAreaTypes.textarea.includes(site)) {
                    const nativeInputValueSetter = Object.getOwnPropertyDescriptor(
                        window.HTMLTextAreaElement.prototype,
                        'value'
                    ).set;
                    nativeInputValueSetter.call(editor, content);
                    // 触发 input 事件
                    editor.dispatchEvent(new Event('input', { bubbles: true }));
                }
                resolve();
            }, 100);
        });
    }

    /******************************************************************************
     * ═══════════════════════════════════════════════════════════════════════
     * ║                                                                      ║
     * ║  🖼️ 5、图片同步功能  🖼️                                              ║
     * ║                                                                      ║
     * ═══════════════════════════════════════════════════════════════════════
     ******************************************************************************/

    // 监听是否有新的图片
    GM_addValueChangeListener('image', function(name, oldValue, msg, remote) {
        if(!remote){
            return;
        }
        if(getGV("disable") === true){
            return;
        }

        let sites = getSitesOfStorage();
        if(sites.includes(site)){
            pasteImage();
        }
    });

    // 主节点监听粘贴事件
    const imageKey = "image";
    const currentAskHasImage = "currentAskHasImage";

    document.addEventListener('paste', async (e) => {
        const items = e.clipboardData?.items;
        if (!items) return;

        for (let i = 0; i < items.length; i++) {
            const item = items[i];
            if (item.type.startsWith('image/')) {
                const blob = item.getAsFile();
                if (!blob) continue;

                // 转为 Base64
                const base64 = await blobToBase64(blob);

                GM_setValue(imageKey, base64);
                setS(T + currentAskHasImage, "1");


                break; // 手动粘贴图片后，脚本读取最后一张图，存入共享存储
            }
        }
    });

    // 模拟将 base64 图片粘贴到输入框（返回在实际触发粘贴后才 resolve）
    async function pasteImage() {
        const base64 = GM_getValue(imageKey);
        if (!base64) {
            console.error('未找到指定的图片');
            return false;
        }
        return new Promise((resolve) => {
            try {
                const blob = base64ToBlob(base64);
                const file = new File([blob], 'pasted-image.png', {
                    type: blob.type || 'image/png',
                    lastModified: Date.now()
                });

                const dataTransfer = new DataTransfer();
                dataTransfer.items.add(file);

                const pasteEvent = new ClipboardEvent('paste', {
                    clipboardData: dataTransfer,
                    bubbles: true,
                    cancelable: true
                });

                let targetElement = getInputArea();
                let retryCount = 0;
                const maxRetries = 100; // 最多重试（20秒）
                const interval = setInterval(() => {
                    retryCount++;
                    targetElement = getInputArea(); // 每次重试时重新获取元素
                    if (targetElement && typeof targetElement.focus === 'function') {
                        clearInterval(interval);
                        targetElement.focus();

                        // 粘贴
                        const dispatched = targetElement.dispatchEvent(pasteEvent);
                        console.log('模拟粘贴图片成功');
                        resolve(!!dispatched);
                    } else if (retryCount >= maxRetries) {
                        clearInterval(interval);
                        console.warn('粘贴图片超时：输入框未找到或无法聚焦');
                        resolve(false);
                    }
                }, 200);
            } catch (error) {
                console.error('模拟粘贴失败:', error);
                resolve(false);
            }
        });
    }

    /******************************************************************************
     * ═══════════════════════════════════════════════════════════════════════
     * ║                                                                      ║
     * ║  👂 6、监听新的提问：监听输入框回车事件、发送按钮点击事件  👂        ║
     * ║                                                                      ║
     * ═══════════════════════════════════════════════════════════════════════
     ******************************************************************************/

    // 检查事件是否带有修饰键
    const hasModifierKey = (event) => event.shiftKey || event.ctrlKey || event.altKey || event.metaKey;

    // 判断是否触发回车发送
    const isEnterTrigger = (event) => {
        if (needModifierForEnter()) {
            return event.key === 'Enter' && (event.ctrlKey || event.metaKey);
        } else {
            // 单纯的 Enter 键，不带任何修饰键
            return event.key === 'Enter' && !hasModifierKey(event);
        }
    };

    // 根据输入框类型获取内容
    function getInputContent(inputArea) {
        if (isEmpty(inputArea)) return '';

        // textarea 类型使用 .value
        if (inputAreaTypes.textarea.includes(site)) {
            return inputArea.value ? inputArea.value.trim() : '';
        }
        // lexical 类型使用 .textContent
        else if (inputAreaTypes.lexical.includes(site)) {
            return inputArea.textContent ? inputArea.textContent.trim() : '';
        }

        return '';
    }

    // 监听输入框回车键和页面鼠标事件
    let inputAreaListenerAdded = false;
    let lastUrl = getUrl(); // 记录上次的 URL

    let cachedInputContent = ""; // 缓存的输入框内容
    let previousInputContent = ""; // 上一次的输入框内容，用于检测清空
    let pendingQuestion = null; // 临时存储 mousedown 时的问题

    let isSendingByEnter = false;        // 是否通过回车键发送，避免重复触发
    let isProcessingMouseUp = false;     // 是否正在处理 mouseup 检测
    let mouseEventListenerAdded = false; // 是否已添加鼠标监听器
    const ADD_LISTENER_RETRY_DELAY = 200;
    const ADD_LISTENER_MAX_RETRIES = 100; // 最大重试次数

    // 判断点击位置是否在忽略区域。如果输入框父元素检测过了，以它的区域为准，否则用兜底的
    function isClickInIgnoredArea(event) {
        let hasTargetFlag = false;
        // 这个 if 判断意味着，只有非新对话才检测输入框右侧区域
        if(getQuestionList().length > 0){
            const level = getS(TOGGLE_LEVEL_KEY);
            if (!isEmpty(level)) {
                const inputArea = getInputArea();
                if (inputArea) {
                    const parentEl = getNthParent(inputArea, parseInt(level));
                    if (parentEl) {
                        hasTargetFlag = true;
                        const parentRect = parentEl.getBoundingClientRect();
                        // 检查纵坐标是否在父元素范围内
                        const isYInRange = event.clientY >= parentRect.top && event.clientY <= parentRect.bottom;
                        // 检查横坐标是否距离父元素右边缘20%宽度以内
                        const rightEdge = parentRect.right;
                        const leftThreshold = rightEdge - parentRect.width * 0.2;
                        const isXInRange = event.clientX >= leftThreshold && event.clientX <= rightEdge;
                        if (isYInRange && isXInRange) {
                            return false;
                        }
                    }
                }
            }
        }

        if(!hasTargetFlag){
            return event.clientX < window.innerWidth * 0.4 || event.clientY < window.innerHeight * 0.1;
        }
        return true;
    }

    // 输入框内容变化
    function inputContentChanged(inputArea) {
        const currentContent = getInputContent(inputArea);
        // 当前空、上次非空
        if (isEmpty(currentContent) && !isEmpty(previousInputContent)) {
            // mouseup、enter 事件会处理，这里只重置内容
            previousInputContent = currentContent;
            cachedInputContent = currentContent;
            return;
        }

        // 当前非空、上次非空；当前非空、上次空 --> 更新上一次的内容和缓存
        previousInputContent = currentContent;
        cachedInputContent = currentContent;
        pendingQuestion = currentContent; // 这里是给鼠标事件兜底用
    }

    // mousedown 事件：记录输入框内容
    function handleMouseDown(event) {
        // 如果点击位置位于网页左侧40%或上部10%，则return
        if (isClickInIgnoredArea(event) || isProcessingMouseUp) {
            return;
        }
        const inputArea = getInputArea();
        let hasContentFlag = false;
        let contentBeforeDown = "";
        if (!isEmpty(inputArea)) {
            contentBeforeDown = getInputContent(inputArea);
            if (!isEmpty(contentBeforeDown)) {
                hasContentFlag = true;
            }
        }
        if(hasContentFlag){
            pendingQuestion = contentBeforeDown;
        }else{
            pendingQuestion = null;
        }
    }

    // mouseup 事件：延迟检测输入框是否清空
    function handleMouseUp(event) {
        // 如果点击位置位于网页左侧 40% 或上部 10%，则return
        if (isClickInIgnoredArea(event) || isProcessingMouseUp) {
            return;
        }
        isProcessingMouseUp = true;

        // 只有 up 前内容非空 才进行检测
        if (isEmpty(pendingQuestion)) {
            isProcessingMouseUp = false;
        } else {
            // 赋值给 temp 变量才行，（可能）是为了防止 pendingQuestion 在轮询开始前提前变空
            let pendingQuestionTemp = pendingQuestion;
            // 轮询检测输入框是否清空，每 200ms 检查一次，满足则提前结束
            const checkInterval = 200;
            const checkTotal = 2000;
            const checkStart = Date.now();

            const mouseUpTimer = setInterval(function() {
                const inputArea = getInputArea();
                let contentAfterUp = "";
                if (!isEmpty(inputArea)) {
                    contentAfterUp = getInputContent(inputArea);
                }
                if (!isEmpty(pendingQuestionTemp) && isEmpty(contentAfterUp)) {
                    const questionToSend = pendingQuestionTemp;
                    pendingQuestion = null;
                    clearInterval(mouseUpTimer);
                    setTimeout(function() {
                        masterCheck(questionToSend);
                    }, 100);
                    isProcessingMouseUp = false;
                    return;
                }
                if (Date.now() - checkStart >= checkTotal) {
                    // 输入框未被清空，不是发送
                    pendingQuestion = null;
                    clearInterval(mouseUpTimer);
                    isProcessingMouseUp = false;
                }
            }, checkInterval);
        }
    }

    // keydown 事件：检测回车键发送
    function handleKeyDown(event, inputArea) {
        // 忽略模拟的回车事件
        if (!event.isSimulated && isEnterTrigger(event)) {

            const lastestQ = getInputContent(inputArea);
            console.log("lastestQ: "+lastestQ);
            const questionToUse = isEmpty(lastestQ) ? cachedInputContent : lastestQ;
            if (!isEmpty(questionToUse)) {
                // 标记通过回车键发送，避免 input 事件和 mouseup 检测重复触发
                isSendingByEnter = true;
                pendingQuestion = null; // 清空 pendingQuestion，避免 mouseup 重复触发
                // 更新 previousInputContent，以便 input 事件检测时不会重复
                previousInputContent = "";
                setTimeout(function() {
                    masterCheck(questionToUse);
                }, 100);
            }
        }
    }

    function addAskEventListener(retryCount = 0) {
        const inputArea = getInputArea();

        // 输入框尚未渲染完成时，延迟重试
        if (isEmpty(inputArea)) {
            if (retryCount >= ADD_LISTENER_MAX_RETRIES) {
                console.warn("⚠ 输入框加载超时，已达到最大重试次数");
                return;
            }
            setTimeout(() => addAskEventListener(retryCount + 1), ADD_LISTENER_RETRY_DELAY);
            return;
        }

        // 增加 MutationObserver 兜底
        const observer = new MutationObserver(() => {
            requestAnimationFrame(() => inputContentChanged(inputArea));
        });

        observer.observe(inputArea, {
            childList: true,
            subtree: true,
            characterData: true
        });

        // 监听鼠标（注意内部其实也依赖了输入框，需要输入框先就绪）
        if (!mouseEventListenerAdded) {
            // 记录输入框内容作为 mouseup 前的基准
            document.addEventListener('mousedown', handleMouseDown);
            // mouseup：延迟检测输入框是否清空
            document.addEventListener('mouseup', handleMouseUp);
            mouseEventListenerAdded = true;
            console.log("✓ 页面鼠标事件监听器已添加");
        }

        // 监听输入框：回车键和输入内容
        if (inputAreaListenerAdded) {
            // 输入框加载完成后，应用默认隐藏设置
            applyDefaultHideInputArea();
        }else {
            inputArea.setAttribute('data-listener-added', 'true');

            // 监听输入框内容变化，更新缓存
            inputArea.addEventListener('input', (event) => {
                inputContentChanged(inputArea);
            });

            inputArea.addEventListener('keydown', function(event) {
                handleKeyDown(event, inputArea);
            });
            inputAreaListenerAdded = true;
            console.log("✓ 输入框回车监听器已添加");
        }
    }


    // 检查监听器是否丢失（元素被替换）
    function checkListenerIntegrity() {
        const inputArea = getInputArea();

        // 检查输入框
        if (!isEmpty(inputArea) && inputAreaListenerAdded) {
            const hasMarker = inputArea.getAttribute('data-listener-added') === 'true';
            if (!hasMarker) {
                console.warn("⚠ 输入框元素已被替换，监听器丢失！重新添加...");
                inputAreaListenerAdded = false;
            }
        }

        // 如果发现监听器丢失，重新添加
        if (!inputAreaListenerAdded) {
            addAskEventListener();
        }
    }
    // 标记输入框是否处于隐藏状态
    let isInputAreaHidden = false;
    // 标记用户是否手动点击了"显示"按钮（页面刷新前有效）
    let userManuallyShown = false;

    // 监听URL变化，重新添加监听器
    function checkUrlChange() {
        let currentUrl = getUrl();
        if (currentUrl === lastUrl) {
            return;
        }
        console.log("URL已变化，重新添加监听器");
        lastUrl = currentUrl;

        // 更新当前站点的URL
        setGV(SITE_URL_PREFIX + site, currentUrl);

        userManuallyShown = false;

        let nthInputArea = getNthInputArea();

        // 如果打开新对话，可能导致 display 值清空，此时输入框并未隐藏
        if(nthInputArea && nthInputArea.style.display === ''){
            toggleBtnStatus(true);
            isInputAreaHidden = false;
        }

        mouseEventListenerAdded = false;
        inputAreaListenerAdded = false;

        // URL 变化时隐藏副目录
        if (typeof hideSubNavBar === 'function') {
            hideSubNavBar();
        }
        addAskEventListener();
    }

    let contentLevelKey = T + "contentWidthLevel";
    let contentMaxWidthKey = T + "contentMaxWidth";
    let cachedContentMaxWidth = getS(contentMaxWidthKey);
    if(!isEmpty(cachedContentMaxWidth)){
        CONTENT_MAX_WIDTH = cachedContentMaxWidth;
    }

    // 定期检查URL变化和监听器完整性
    setInterval(function() {
        reloadCompactMode();
        checkUrlChange();
        checkListenerIntegrity();

        setGV(HEART_KEY_PREFIX + site, Date.now());
        // 同时更新当前站点的URL
        setGV(SITE_URL_PREFIX + site, getUrl());

        let questions = getQuestionList();
        updateNavQuestions(questions);

        setContentWidth();
    }, 2000);


    // 部分站点调整内容宽度（不依赖选择器）
    function setContentWidth(){
        if(![GEMINI, STUDIO].includes(site) && !cachedContentMaxWidth){
          return;
        }

        let quesList = getQuestionList();
        if(!quesList || quesList.length === 0){
            return;
        }
        let tailQuestion = quesList[quesList.length - 1];

        let tailContentZone = null;
        let cachedContentLevel = getS(contentLevelKey);
        if(!isEmpty(cachedContentLevel)){
            tailContentZone = getNthParent(tailQuestion, cachedContentLevel)
        }else {
            let prevEle = null;
            let nth = 1;

            while (nth < 10) {
                let checkEle = getNthParent(tailQuestion, nth);
                if (!checkEle) {
                    break;
                }
                let checkWidth = checkEle.getBoundingClientRect().width;
                if (checkWidth > 1000) {
                    tailContentZone = prevEle;
                    setS(contentLevelKey, nth - 1);
                    break;
                }
                prevEle = checkEle;
                nth++;
            }
        }
        // 回答区域
        if(!isEmpty(tailContentZone)){
            const ratioWidth = window.outerWidth * 0.9;

            const ADAPTIVE_WIDTH = ratioWidth + "px";
            const MAX_WIDTH = CONTENT_MAX_WIDTH + "px";

            // 最后一个回答的宽度如果不符合
            if(eleWidthNotMatched(tailContentZone, ratioWidth)){
                tailContentZone.style.maxWidth = MAX_WIDTH;
                tailContentZone.style.width = ADAPTIVE_WIDTH;

                let traverseFlag = false;
                let cur = tailContentZone.previousElementSibling;

                while (cur) {
                    // 倒数第二个回答，如果宽度符合，则终止；不符合，说明需要遍历，下个游标无需再判断宽度
                    if(!traverseFlag && !eleWidthNotMatched(cur, ratioWidth)){
                        return;
                    }
                    traverseFlag = true;
                    cur.style.maxWidth = MAX_WIDTH;
                    cur.style.width = ADAPTIVE_WIDTH;
                    cur = cur.previousElementSibling;
                }
            }

        }
    }

    function eleWidthNotMatched(ele, ratioWidth){
        let targetWidth = Math.min(ratioWidth, CONTENT_MAX_WIDTH);

        let oldWidth = ele.getBoundingClientRect().width;
        return Math.abs(oldWidth - targetWidth) > 3;
    }

    /******************************************************************************
     * ═══════════════════════════════════════════════════════════════════════
     * ║                                                                      ║
     * ║  🎨 7、trusted HTML & 首次使用指引 🎨                        ║
     * ║                                                                      ║
     * ═══════════════════════════════════════════════════════════════════════
     ******************************************************************************/

    // 安全处理HTML内容（Trusted Types支持）
    let policy = null;
    try {
        if (window.trustedTypes) {
            policy = trustedTypes.createPolicy("forceInner", {
                createHTML: (to_escape) => to_escape
            });
        }
    } catch(e) {
        policy = null;
    }

    function makeHTML(content){
        if(isEmpty(policy)){
            return content;
        }else{
            try {
                return policy.createHTML(content);
            } catch(e) {
                return content;
            }
        }
    }

    // 安全设置 innerHTML，如果失败则使用 DOM 方法
    function setInnerHTML(element, html) {
        if (isEmpty(html)) {
            // 清空内容使用 replaceChildren 更安全
            element.replaceChildren();
            return;
        }

        try {
            const trustedHTML = makeHTML(html);
            element.innerHTML = trustedHTML;
        } catch(e) {
            // 如果 Trusted Types 失败，使用 DOMParser
            try {
                const parser = new DOMParser();
                const doc = parser.parseFromString(html, 'text/html');
                element.replaceChildren(...Array.from(doc.body.childNodes));
            } catch(parseError) {
                // 如果 DOMParser 也失败，使用 textContent 作为最后手段
                element.textContent = html.replace(/<[^>]*>/g, '');
            }
        }
    }

    // 面板延迟时间
    let panelDelay = site === ZCHAT ? 500 : 50;
    const panel = createTag('div', "", "");

    /**
     * 脚本首次使用的指引
     */
    let FIRST_RUN_KEY = "firstRun";
        setTimeout(function(){
        // 页面加载时获取并保存站点图标
        getAndSaveSiteIcon(site);

        appendSeveral(document.body, panel, toggleButtonContainer, subNavBar);
        reloadDisableStatus();
        updateButtonVisibility(); // 根据设置更新按钮显示状态

        // 添加发送按钮监听
        setTimeout(addAskEventListener, 1000);

        setTimeout(function(){
            // 首次运行
            if(isEmpty(getGV(FIRST_RUN_KEY))){
                setGV(FIRST_RUN_KEY, 1);
                let updateHint = "网页右下方的多选面板可勾选提问范围，\n\n" +
                    "点击\"设置\"按钮可进行多种设置\n\n";

                showMessagePopup(updateHint, "脚本使用提示");
            } else {
                // 非首次运行，检查版本更新
                // 注意：如果是新用户，将短时间内出现第二次弹窗，体验不好
            }

        }, 800);
    }, panelDelay);


    /******************************************************************************
     * ═══════════════════════════════════════════════════════════════════════
     * ║                                                                      ║
     * ║  🎨 8、输入框的显示/隐藏切换 🎨                        ║
     * ║                                                                      ║
     * ═══════════════════════════════════════════════════════════════════════
     ******************************************************************************/


    /**
     * 输入框的显示/隐藏切换功能
     */
    // 切换按钮相关常量
    const TOGGLE_BUTTON_BG_SHOW = '#ec7258';
    const TOGGLE_BUTTON_BG_HIDE = '#999';
    const TOGGLE_BUTTON_STYLE = `font-size:14px;padding:5px;cursor:pointer;background:${TOGGLE_BUTTON_BG_SHOW};color:white;border:1px solid #ddd;border-radius:30%;box-shadow:0 4px 12px rgba(0,0,0,0.2);display:flex;align-items:center;justify-content:center;`;
    const SYNC_SWITCH_TITLE = '同步提问开关';

    // 切换状态配置
    const TOGGLE_STATES = {
        show: {
            text: '隐藏',
            bg: TOGGLE_BUTTON_BG_SHOW,
            display: 'flex'
        },
        hide: {
            text: '显示',
            bg: TOGGLE_BUTTON_BG_HIDE,
            display: 'none'
        }
    };

    // 创建按钮容器（垂直排列，右对齐）
    const toggleButtonContainer = createTag('div', '', 'position:fixed;z-index:99999999;display:flex;flex-direction:column;align-items:flex-end;gap:5px;');
    
    const toggleButton = createTag('div', TOGGLE_STATES.show.text, TOGGLE_BUTTON_STYLE);
    toggleButton.title = '临时隐藏输入框获得更大的视野高度';
    const toggleDisableButton = createTag('div', '', TOGGLE_BUTTON_STYLE);
    toggleDisableButton.style.padding = '3px';
    toggleDisableButton.title = SYNC_SWITCH_TITLE;
    toggleDisableButton.style.background = 'white';
    toggleDisableButton.addEventListener('click', (e) => {
        e.stopPropagation();
        disableEvent(e);
    });
    
    // 将按钮添加到容器中（禁用按钮在上方）
    appendSeveral(toggleButtonContainer, toggleDisableButton, toggleButton);

    const getNthParent = (el, n) => n > 0 ? getNthParent(el?.parentElement, n - 1) : el;

    function getNthInputArea(){
        const inputArea = getInputArea();
        // 优先使用用户自定义的层级值
        const customLevels = getGV(INPUT_AREA_HIDE_PARENT_LEVEL_KEY) || {};
        let level = customLevels[site] !== undefined ? customLevels[site] : inputAreaHideParentLevel[site];
        if(site === CHATGPT && getUrl().indexOf("/g/") > -1){
            level = level - 2;
        }
        return getNthParent(inputArea, level);
    }

    // 按钮点击事件 - 切换显示/隐藏
    toggleButton.addEventListener('click', (e) => {
        e.stopPropagation();
        toggleInput();
    });

    function toggleInput(){
        const aroundInputArea = getNthInputArea();
        // 如果输入框是被用户隐藏的，则切换输入框、按钮状态
        const isHidden = aroundInputArea.style.display === 'none';
        // 更新隐藏状态标记
        isInputAreaHidden = !isHidden;
        // 如果用户手动点击了"显示"按钮，设置标记
        if (isHidden) {
            userManuallyShown = true;
        }

        const state = isHidden ? TOGGLE_STATES.show : TOGGLE_STATES.hide;
        toggleBtnStatus(isHidden);
        aroundInputArea.style.display = state.display;
    }

    function toggleBtnStatus(isHidden){
        const state = isHidden ? TOGGLE_STATES.show : TOGGLE_STATES.hide;
        toggleButton.textContent = state.text;
        toggleButton.style.background = state.bg;
    }

    // 应用默认隐藏输入框设置
    function applyDefaultHideInputArea() {
        const shouldHide = getGV(DEFAULT_HIDE_INPUT_AREA_KEY) === true;
        if (!shouldHide) {
            return;
        }

        // 如果是新对话（问题列表为空），则不隐藏输入框
        const questions = getQuestionList();
        if (questions.length === 0) {
            return;
        }

        // 如果用户手动点击了"显示"按钮，则不执行自动隐藏
        if (userManuallyShown) {
            return;
        }

        const aroundInputArea = getNthInputArea();
        if (aroundInputArea && aroundInputArea.style.display !== 'none') {
            aroundInputArea.style.display = TOGGLE_STATES.hide.display;
            isInputAreaHidden = true;
            toggleBtnStatus(false);
        }
    }

    // 存储的key
    const TOGGLE_BOTTOM_KEY = T + 'toggleBottom';
    const TOGGLE_LEFT_KEY = T + 'theBtnLeft';
    const TOGGLE_LEVEL_KEY = T + 'theLevel';
    const TOGGLE_LEFT_DATE_KEY = T + 'theBtnLeftDate';

    const BUTTON_INPUT_GAP = site === GEMINI ? 40 : 20; // 按钮与输入框的间距
    const DEFAULT_LEFT_OFFSET = 40; // 默认left值的偏移量
    const MIN_RIGHT_THRESHOLD = 10; // right值的最小阈值
    const TOOL_PANEL_ID = 'tool-panel'; // 多选面板的ID

    /**
     * 轮询更新 toggle 按钮的位置和显示状态
     */
    function pollToggleButtonPosition() {
        const POLL_INTERVAL = 1000; // 轮询间隔1000ms

        const checkAndUpdate = () => {
            updateToggleButtonPosition();
            setTimeout(checkAndUpdate, POLL_INTERVAL);
        };

        // 开始轮询
        checkAndUpdate();
    }

    // 页面加载后开始持续轮询
    pollToggleButtonPosition();

    // 监听窗口宽度变化，更新toggle按钮的位置和显示状态
    let resizeTimer = null;
    window.addEventListener('resize', () => {
        // 防抖处理，避免频繁触发
        clearTimeout(resizeTimer);
        resizeTimer = setTimeout(() => updateToggleButtonPosition(true), 50);
    });

    /**
     * 更新 toggle 按钮的位置和显示状态
     * @param {boolean} isResizeEvent - 是否是resize事件触发
     */
    function updateToggleButtonPosition(isResizeEvent = false) {
        // 如果处于隐藏状态、且非resize场景，直接返回，不更新位置
        if (isInputAreaHidden && !isResizeEvent) {
            return;
        }
        const inputArea = getInputArea();

        const bottom = calculateBottom(inputArea);

        if (inputArea) {
            let inputBottom = inputArea.getBoundingClientRect().bottom;
            if(inputBottom !== 0 && window.innerHeight - inputBottom > 300){
                let oldBottom = toggleButtonContainer.getBoundingClientRect().bottom;
                if(window.innerHeight - oldBottom < 300){
                    return;
                }
            }
        }

        let left;

        // 如果非隐藏、或 resize 场景
        //   特殊情况：如果 resize 到最大宽度且有保存的 maxLeft，优先使用maxLeft
        if (isMaxWidth()) {
            left = calcLeftInMaxState(inputArea);
        } else {
            // 非最大宽度，跟随缩略状态的多选面板的left位置
            const toolPanel = document.getElementById(TOOL_PANEL_ID);
            if (toolPanel) {
                const panelRect = toolPanel.getBoundingClientRect();
                left = panelRect.left;
            } else {
                left = window.innerWidth - DEFAULT_LEFT_OFFSET;
            }
        }

        // 更新toggle按钮容器位置
        toggleButtonContainer.style.left = `${left}px`;
        toggleButtonContainer.style.bottom = `${bottom}px`;
    }

    /**
     * 计算bottom值
     */
    function calculateBottom(inputArea) {
        const savedBottom = getS(TOGGLE_BOTTOM_KEY);
        if (savedBottom !== null) {
            return parseFloat(savedBottom);
        }

        // 若新 bottom < 阈值，才更新。如果阈值较大，则输入框本体较高的情况下，按钮位置会偏高
        const UPDATE_BOTTOM_THRESHOLD = 50;
        if (inputArea) {
            const distanceToBottom = window.innerHeight - inputArea.getBoundingClientRect().bottom;
            if (distanceToBottom < UPDATE_BOTTOM_THRESHOLD && distanceToBottom > 0) {
                setS(TOGGLE_BOTTOM_KEY, distanceToBottom.toString());
                return distanceToBottom;
            }
        }

        // 默认值
        return UPDATE_BOTTOM_THRESHOLD;
    }

    /**
     * 计算left值
     * @param {HTMLElement} inputArea - 输入框元素
     */
    function calcLeftInMaxState(inputArea) {
        const savedLeft = getS(TOGGLE_LEFT_KEY);
        if(isInputAreaHidden){
            return savedLeft;
        }

        const today = getToday();
        const lastCheckDate = getS(TOGGLE_LEFT_DATE_KEY);
        const isFirstTriggerToday = lastCheckDate !== today;
        if (isFirstTriggerToday) {
            setS(TOGGLE_LEFT_DATE_KEY, today);
        }

        let hasInputArea = !!inputArea;

        // 如果输入框存在
        if (hasInputArea) {
            let targetLevel = getS(TOGGLE_LEVEL_KEY);
            if(!isEmpty(targetLevel) && !isFirstTriggerToday){
                let nthParent = getNthParent(inputArea, targetLevel);
                if(!isEmpty(nthParent)){
                    let targetRight = nthParent.getBoundingClientRect().right;
                    let shouldUpdate = (targetRight + BUTTON_INPUT_GAP).toString() !== savedLeft;
                    return handleButtonLeft(targetRight, shouldUpdate);
                }
            }

            let targetRight = null;
            let prevRight = null;
            let prevHeight = null;

            // 遍历 level
            const START_LEVEL = 2;
            for (let level = START_LEVEL; level < 25; level++) {
                const parentElement = getNthParent(inputArea, level);
                if (!parentElement) {
                    break;
                }

                const right = parentElement.getBoundingClientRect().right;
                const height = parentElement.getBoundingClientRect().height;

                // 如果达到最大宽度，使用前一个 level 的 right 值；如果单纯是达到最大高度，则 level 回退 m 层
                let rightFlag = right > window.innerWidth - 50;
                let heightFlag = height > window.innerHeight - 200;

                if (rightFlag || heightFlag) {
                    let minusValue = 1;

                    // 注意：这个 if 是针对高度比宽度先触发的情况，if 后面才是宽度触发的情况
                    if(heightFlag && !rightFlag){
                        let checkLevel = level - 1;
                        while (checkLevel >= START_LEVEL) {
                            let checkEle = getNthParent(inputArea, checkLevel);
                            if (!checkEle) {
                                break;
                            }
                            let checkRight = checkEle.getBoundingClientRect().right;
                            const gapOfHighBoxBorder = 30;
                            if (right - checkRight > gapOfHighBoxBorder) {
                                minusValue = level - checkLevel;
                                break;
                            }
                            checkLevel--;
                        }
                    }
                    targetRight = prevRight;
                    setS(TOGGLE_LEVEL_KEY, level - minusValue);
                    break;
                }
                prevRight = right;
            }

            // 如果找到了有效的 right 值
            if (targetRight !== null && targetRight >= MIN_RIGHT_THRESHOLD) {
                return handleButtonLeft(targetRight);
            }
        }

        if (savedLeft !== null) {
            return parseFloat(savedLeft);
        }

        return window.innerWidth - DEFAULT_LEFT_OFFSET;
    }

    function handleButtonLeft(targetRight, shouldUpdate = true){
        const expectedLeft = targetRight + BUTTON_INPUT_GAP;
        if(shouldUpdate){
            setS(TOGGLE_LEFT_KEY, expectedLeft);
        }
        return expectedLeft;
    }

    /******************************************************************************
     * ═══════════════════════════════════════════════════════════════════════
     * ║                                                                      ║
     * ║  📑 9、目录导航功能  📑                                              ║
     * ║                                                                      ║
     * ═══════════════════════════════════════════════════════════════════════
     ******************************************************************************/

    // 导航变量默认值
    const DEFAULT_NAV_MAX_WIDTH = "230px";
    const DEFAULT_NAV_TOP = "20%";
    const DEFAULT_NAV_TOP_OVERFLOW = "7%";
    const DEFAULT_SUB_NAV_MAX_WIDTH = "260px";
    const DEFAULT_SUB_NAV_TOP = "20%";
    const DEFAULT_SUB_NAV_TOP_OVERFLOW = "7%";

    // 存储键名
    const NAV_MAX_WIDTH_KEY = "navMaxWidth";
    const NAV_TOP_KEY = "navTop";
    const NAV_TOP_OVERFLOW_KEY = "navTopOverflow";
    const SUB_NAV_TOP_KEY = "subNavTop";
    const SUB_NAV_TOP_OVERFLOW_KEY = "subNavTopOverflow";

    // 从GM存储读取导航变量，如果没有则使用默认值
    const getNavMaxWidth = () => {
        return getGV(NAV_MAX_WIDTH_KEY) || DEFAULT_NAV_MAX_WIDTH;
    };

    const getNavTop = () => {
        return getGV(NAV_TOP_KEY) || DEFAULT_NAV_TOP;
    };

    const getNavTopOverflow = () => {
        return getGV(NAV_TOP_OVERFLOW_KEY) || DEFAULT_NAV_TOP_OVERFLOW;
    };

    let subNavMaxWidthKey = T + "subNavMaxWidth";

    // 获取副目录的最大宽度值（从localStorage读取，如果没有则使用默认值）
    const getSubNavMaxWidth = () => {
        const savedMaxWidth = getS(subNavMaxWidthKey);
        if (!isEmpty(savedMaxWidth)) return savedMaxWidth;
        return DEFAULT_SUB_NAV_MAX_WIDTH;
    };

    // 设置副目录的最大宽度值到localStorage
    const setSubNavMaxWidth = (maxWidth) => {
        setS(subNavMaxWidthKey, maxWidth);
        updateNavStyles();
    };

    const getSubNavTop = () => {
        const saved = getGV(SUB_NAV_TOP_KEY);
        if (saved) {
            return saved;
        }
        return site === STUDIO ? "35%" : DEFAULT_SUB_NAV_TOP;
    };

    const getSubNavTopOverflow = () => {
        return getGV(SUB_NAV_TOP_OVERFLOW_KEY) || DEFAULT_SUB_NAV_TOP_OVERFLOW;
    };

    // 根据top值计算max-height，使总和为99vh
    const calculateSubNavMaxHeight = (topValue) => {
        // 从top值中提取百分比数字（如"7%" -> 7）
        const match = topValue.toString().match(/(\d+(?:\.\d+)?)/);
        if (match) {
            const topPercent = parseFloat(match[1]);
            const maxHeightPercent = 99 - topPercent;
            return `${maxHeightPercent}vh`;
        }
        // 如果无法解析，返回默认值
        return "98vh";
    };

    const NAV_TOP_THRESHOLD = 7;    // 主目录条目超过此阈值时，top位置抬高
    const NAV_COUNT_THRESHOLD = 10; // 主目录条数超过此阈值时，会显示"共xx条"

    const SUB_NAV_LEFT = "270px";     // 副目录的水平位置（距离屏幕左侧）
    const SUB_NAV_MIN_ITEMS = 2;      // 副目录标题总条数超过此阈值才显示
    const SUB_NAV_TOP_THRESHOLD = 14; // 副目录标题条数超过此阈值时，top位置抬高
    const SUB_NAV_PREV_LEVEL_THRESHOLD = 15; // 总条数超过此阈值时，默认显示到上一层级（如h4显示到h3，h3显示到h2）

    // 查找回答内容区域的查找限制（用于性能优化）
    const FIND_ANSWER_MIDDLE_SIBLING_LIMIT = 30; // 中间问题查找时的兄弟元素上限（原50，已优化）
    const FIND_ANSWER_LAST_SIBLING_LIMIT = 15; // 最后一个问题查找时的兄弟元素上限（原20，已优化）
    const FIND_ANSWER_PARENT_DEPTH_LIMIT = 10// 向上查找父元素的最大深度（原10，已优化）


    const NAV_ITEM_COLOR = "#333";
    // 副目录项悬停样式常量
    const SUB_NAV_ITEM_HOVER_BG = '#f0f0f0';
    const SUB_NAV_ITEM_HOVER_COLOR = '#0066cc';
    const SUB_NAV_ITEM_NORMAL_BG = 'transparent';
    const SUB_NAV_ITEM_NORMAL_COLOR = '#333';
    // 目录导航相关常量
    const NAV_HIGHLIGHT_THRESHOLD = 0.3; // 目录高亮阈值（0~30%高亮当前项，30%~100%高亮前一项）
    const NAV_VIEWPORT_THRESHOLD = 0.9; // 可视区域阈值（90%）
    const NAV_NEAR_TOP_THRESHOLD = 24; // 接近顶部阈值（像素）
    const NAV_CLICK_LOCK_DURATION = 1200; // 点击锁定持续时间（毫秒）
    const NAV_UPDATE_TEXT_DELAY = 500; // 导航链接文本更新延迟（毫秒）
    const NAV_RETRY_MAX_COUNT = 10; // 导航链接跳转最大重试次数
    const NAV_RETRY_INTERVAL = 100; // 导航链接跳转重试间隔（毫秒）
    // 副目录标题级别配置（可配置为 h1~h4、h2~h4 或 h2~h3）
    const SUB_NAV_HEADING_LEVELS = [4, 3, 2, 1]; // 支持 h4, h3, h2, h1（顺序从低到高）
    const SUB_NAV_HEADING_SELECTOR = SUB_NAV_HEADING_LEVELS.map(level => `h${level}`).join(', '); // 生成选择器字符串，如 "h1, h2, h3, h4"
    const SUB_NAV_HEADING_TAGS = SUB_NAV_HEADING_LEVELS.map(level => `H${level}`); // 生成标签数组，如 ["H1", "H2", "H3", "H4"]
    const SUB_POS_RIGHT = "25px";
    const SUB_ALIGN_LEFT_TOP = "22px";
    const SUB_ALIGN_LEFT_VALUE = "0px";
    const SUB_ALIGN_LEFT_ACTIVE_BG = "#e6f0ff";
    const SUB_ALIGN_RIGHT_VALUE = "0px";
    const SUB_ALIGN_RIGHT_ACTIVE_BG = "#e6f0ff";
    // 启用 Markdown 标题查找的站点列表
    const ENABLE_MARKDOWN_HEADING_SITES = [CLAUDE];
    const STUDIO_HEADING_RIGHT_GAP = 400;
    // 副目录left预设（按站点配置，值自行填写，如 "300px"）
    const SUB_NAV_LEFT_PRESETS = {
        [DEEPSEEK]: "260px",
        [KIMI]: "240px",
        [TONGYI]: "260px",
        [QWEN]: "260px",
        [DOUBAO]: "280px",
        [YUANBAO]: "260px",

        [ZCHAT]: "260px",
        [CHATGPT]: "260px",
        [GEMINI]: "310px",
        [STUDIO]: "10px",
        [CLAUDE]: "290px",
        [GROK]: "255px"
    };

    const subNavMinWidth = "170px";

    // 获取导航样式（动态生成，支持运行时修改变量）
    const getNavStyles = () => {
        const navTop = getNavTop();
        const navMaxWidth = getNavMaxWidth();
        const subNavTop = getSubNavTop();
        const subNavMaxWidth = getSubNavMaxWidth();
        const subNavMaxHeight = calculateSubNavMaxHeight(subNavTop);

        return {
            // 主目录样式
            navBar: `position:fixed;visibility:hidden;top:${navTop};right:15px;max-width:${navMaxWidth};min-width:150px;background:rgba(255,255,255,0.95);border:1px solid #ccc;border-radius:6px;padding:0 5px;z-index:99999;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;box-shadow:0 2px 8px rgba(0,0,0,0.15);max-height:90vh;overflow-y:auto;box-sizing:border-box;`,
            miniButton: `position:fixed;top:${navTop};right:15px;color:${NAV_ITEM_COLOR};border:1px solid #ddd;border-radius:8px;padding:2px 8px;font-size:14px;font-weight: bold;cursor:pointer;z-index:99999;visibility:hidden;box-shadow:0 2px 6px rgba(0,0,0,0.15);user-select:none;`,
            title: `display:flex;align-items:center;justify-content:flex-start;gap:6px;font-weight:bold;color:#333;padding:4px 5px;border-bottom:1px solid #eaeaea;margin-bottom:4px;position:sticky;top:0;background:rgba(255,255,255,0.95);z-index:10;`,
            hideBtn: `font-weight:normal;color:#333;font-size:12px;padding:2px 6px;border:1px solid #aaa;border-radius:10px;cursor:pointer;user-select:none;`,
            countText: `font-weight:normal;color:#333;font-size:14px;margin-left:6px;user-select:none;`,
            linkContainer: `display:flex;align-items:center;gap:4px;width:100%;`,
            link: `width:100%;padding:4px 2px;cursor:pointer;color:#333;font-size:14px;line-height:1.5;white-space:normal;overflow:hidden;text-overflow:ellipsis;display:-webkit-box;-webkit-line-clamp:2;-webkit-box-orient:vertical;word-break:break-word;max-height:calc(1.9em * 2);box-sizing:border-box;`,
            waveIcon: `font-size:12px;cursor:pointer;color:#333;padding:0;border-radius:3px;user-select:none;flex-shrink:0;transition:background-color 0.2s;`,
            waveIconHover: `background-color:#f0f0f0;color:#0066cc;`,
            waveIconNormal: `background-color:transparent;color:#333;`,

            // 副目录样式
            subNavBar: `position:fixed;left:${SUB_NAV_LEFT};top:${subNavTop};max-width:${subNavMaxWidth};min-width:${subNavMinWidth};max-height:${subNavMaxHeight};background:rgba(255,255,255,1);border:1px solid #ccc;border-radius:6px;padding:0 8px;z-index:2147483646;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;box-shadow:0 2px 8px rgba(0,0,0,0.15);overflow-y:auto;box-sizing:border-box;display:none;`,
            subNavTitle: `font-weight:bold;color:#111;padding:4px 0;border-bottom:1px solid #eaeaea;margin-bottom:6px;font-size:14px;`,
            subNavCloseBtn: `position:absolute;top:0;right:5px;font-size:18px;cursor:pointer;color:#333;width:20px;height:20px;display:flex;align-items:center;justify-content:center;border-radius:3px;transition:background-color 0.2s;`,

            subNavItem: `padding:4px 2px;cursor:pointer;color:#333;font-size:13px;line-height:1.6;border-radius:3px;margin:2px 0;transition:background-color 0.2s;word-break:break-word;`,
            subNavItemH1: `padding-left:0px;font-weight:700;`,
            subNavItemH2: `padding-left:2px;font-weight:600;`,
            subNavItemH3: `padding-left:8px;font-weight:500;`,
            subNavItemH4: `padding-left:14px;font-weight:400;`,

            levelBtnGroup: `display:flex;gap:4px;align-items:center;`,
            levelBtn: `padding:2px 4px;font-size:11px;cursor:pointer;border:1px solid #ddd;border-radius:4px;background:#fff;color:#333;transition:all 0.2s;user-select:none;`,
            levelBtnActive: `background:#3498db;color:#fff;border-color:#3498db;`,
            levelBtnHover: `background-color:#f0f0f0;border-color:#ccc;`,
            levelBtnLeave: `background-color:#fff;border-color:#ddd;color:#333;`,

            subNavMaxWidthBtn: `position:absolute;top:0;right:${SUB_POS_RIGHT};font-size:12px;margin:0 3px;padding:0 4px;cursor:pointer;color:#111;height:20px;display:flex;align-items:center;justify-content:center;border:1px solid #ccc;border-radius:3px;transition:background-color 0.2s;`,
            subNavMaxWidthBtnHover: `background-color:#f0f0f0;`,
            subNavMaxWidthBtnNormal: `background-color:transparent;`,
            subNavMaxWidthInput: `position:absolute;top:0;right:${SUB_POS_RIGHT};width:45px;height:20px;padding:0 4px;font-size:12px;border:1px solid #ccc;border-radius:3px;outline:none;`,

            subNavPositionBtn: `position:absolute;top:0;right:${SUB_POS_RIGHT};font-size:12px;margin:0 3px;padding:0 4px;cursor:pointer;color:#111;height:20px;display:flex;align-items:center;justify-content:center;border:1px solid #ccc;border-radius:3px;transition:background-color 0.2s;`,
            subNavPositionBtnHover: `background-color:#f0f0f0;`,
            subNavPositionBtnNormal: `background-color:transparent;`,
            subNavPositionInput: `position:absolute;top:0;right:${SUB_POS_RIGHT};width:45px;height:20px;padding:0 4px;font-size:12px;border:1px solid #ccc;border-radius:3px;outline:none;`,

            subNavAlignLeftBtn: `position:absolute;top:${SUB_ALIGN_LEFT_TOP};right:${SUB_POS_RIGHT};font-size:12px;padding:0 3px;margin:0 3px;cursor:pointer;color:#111;display:flex;align-items:center;justify-content:center;border:1px solid #ccc;border-radius:3px;transition:background-color 0.2s;`,
            subNavAlignLeftBtnHover: `background-color:#f0f0f0;`,
            subNavAlignLeftBtnActive: `background-color:${SUB_ALIGN_LEFT_ACTIVE_BG};`,
            subNavAlignLeftBtnNormal: `background-color:transparent;`,

            subNavAlignRightBtn: `position:absolute;top:${SUB_ALIGN_LEFT_TOP};right:${SUB_POS_RIGHT};font-size:12px;padding:0 3px;margin:0 3px;cursor:pointer;color:#111;display:flex;align-items:center;justify-content:center;border:1px solid #ccc;border-radius:3px;transition:background-color 0.2s;`,
            subNavAlignRightBtnHover: `background-color:#f0f0f0;`,
            subNavAlignRightBtnActive: `background-color:${SUB_ALIGN_RIGHT_ACTIVE_BG};`,
            subNavAlignRightBtnNormal: `background-color:transparent;`,
            subNavButtonRow: `display:flex;align-items:center;justify-content:flex-end;gap:4px;margin-top:4px;`
        };
    };

    // 样式常量（向后兼容，使用函数生成）
    const NAV_STYLES = getNavStyles();

    // 创建导航元素
    const navBar = createTag('div', "", NAV_STYLES.navBar);
    navBar.id = "tool-nav-bar";

    const navMiniButton = createTag('div', '目录', NAV_STYLES.miniButton);

    // 更新导航栏样式的函数（当变量改变时调用）
    const updateNavStyles = () => {
        const styles = getNavStyles();
        if (navBar) {
            navBar.style.top = getNavTop();
            navBar.style.maxWidth = getNavMaxWidth();
        }
        if (navMiniButton) {
            navMiniButton.style.top = getNavTop();
        }
        if (subNavBar) {
            subNavBar.style.top = getSubNavTop();
            subNavBar.style.maxWidth = getSubNavMaxWidth();
        }
        // 刷新导航栏显示状态以应用新的top值
        if (typeof refreshNavBarVisibility === 'function') {
            refreshNavBarVisibility();
        }
        if (typeof updateSubNavTop === 'function') {
            updateSubNavTop();
        }
    };


    let subNavLeftKey = T + "subNavLeft";

    // 获取副目录的left值（优先从localStorage，其次站点预设，最后默认值）
    const getSubNavLeft = () => {
        const savedLeft = getS(subNavLeftKey);
        if (!isEmpty(savedLeft)) return savedLeft;
        const presetLeft = SUB_NAV_LEFT_PRESETS[site];
        if (presetLeft) return presetLeft;
        return SUB_NAV_LEFT;
    };

    // 设置副目录的left值到localStorage
    const setSubNavLeft = (left) => {
        setS(subNavLeftKey, left);
    };

    // 创建副目录栏元素
    const subNavLeft = getSubNavLeft();
    const subNavBar = createTag('div', "", NAV_STYLES.subNavBar.replace(`left:${SUB_NAV_LEFT}`, `left:${subNavLeft}`));
    subNavBar.id = "tool-sub-nav-bar";
    const alignLeftValue = SUB_ALIGN_LEFT_VALUE;
    const alignRightValue = SUB_ALIGN_RIGHT_VALUE;
    let isSubNavAlignedLeft = subNavLeft === alignLeftValue;
    let isSubNavAlignedRight = false;
    let subNavLeftBeforeAlign = isSubNavAlignedLeft ? SUB_NAV_LEFT : subNavLeft;
    let subNavLeftBeforeAlignRight = subNavLeft;

    // 状态变量
    let navQuestions, navLinks = [], navIO, elToLink = new Map();
    let clickedTarget = null, clickLockUntil = 0, scrollDebounceTimer;
    let currentSubNavQuestionIndex = -1; // 当前显示的副目录对应的主目录索引
    let preservedNavTextsUrl = null; // 保存保留文本时的 URL
    let currentNavBarUrl = null; // 当前导航栏对应的 URL，用于检测 URL 变化
    let currentSubNavLevel = 4; // 当前副目录显示的层级（默认 h4）
    let currentSubNavHeadings = []; // 当前副目录的所有标题数据（未过滤）
    let subNavPollInterval = null; // 副目录轮询定时器
    let isSubNavLevelManuallySet = false; // 用户是否手动选择了层级
    let h1Count = 0; // h1标题的数量
    let navCountText = null; // 主目录条数显示元素

    // 从localStorage读取最小化状态，默认为false
    let navMinimized = getS(T + 'navMinimized') === 'true';

    // 设置导航链接的样式（高亮或普通状态）
    const setLinkStyle = (linkContainer, isActive) => {
        if(!linkContainer) return;
        // 如果是 linkContainer，从中查找 link 元素
        const link = linkContainer.classList?.contains('tool-nav-link-container')
            ? linkContainer.querySelector('.tool-nav-link')
            : linkContainer;
        if(!link) return;
        const color = isActive ? SUB_NAV_ITEM_HOVER_COLOR : NAV_ITEM_COLOR;
        link.style.cssText = NAV_STYLES.link + `background-color:;color:${color};`;
    };

    // 清除所有导航链接的高亮状态
    const clearAllHighlights = () => navLinks.forEach(link => setLinkStyle(link, false));

    // 统一的元素可见性判断函数
    const isElementVisible = (rect, viewportThreshold = NAV_VIEWPORT_THRESHOLD) => {
        if (!rect) return false;
        const viewportHeight = window.innerHeight || document.documentElement.clientHeight;
        return rect.bottom > 0 && rect.top < viewportHeight * viewportThreshold;
    };

    // 判断元素是否接近顶部
    const isElementNearTop = (rect, threshold = NAV_NEAR_TOP_THRESHOLD) => {
        return rect ? Math.abs(rect.top) < threshold : false;
    };

    // 获取视口高度
    const getViewportHeight = () => window.innerHeight || document.documentElement.clientHeight;

    // 计算元素在视口中的位置百分比
    const getElementPositionPercent = (rect) => {
        const viewportHeight = getViewportHeight();
        return rect.top / viewportHeight;
    };

    // 获取所有可见的元素
    const getVisibleElements = (elements, viewportThreshold = NAV_VIEWPORT_THRESHOLD) => {
        return elements.filter(el => {
            const rect = el?.getBoundingClientRect();
            return isElementVisible(rect, viewportThreshold);
        });
    };

    // 更新主目录条数显示
    const updateNavCount = () => {
        if (!navCountText) return;

        const linkCount = navBar.querySelectorAll('.tool-nav-link').length;

        // 如果条数超过阈值，显示"共xx条"
        if (linkCount > NAV_COUNT_THRESHOLD) {
            navCountText.textContent = `共${linkCount}条`;
            navCountText.style.display = '';
        } else {
            navCountText.style.display = 'none';
        }
    };

    // 刷新导航栏的显示状态（显示/隐藏/最小化）
    const refreshNavBarVisibility = () => {
        const root = document.body || document.documentElement;
        if(!root.contains(navMiniButton)) root.appendChild(navMiniButton);

        const linkCount = navBar.querySelectorAll('.tool-nav-link').length;
        if(linkCount === 0) {
            navBar.style.visibility = navMiniButton.style.visibility = "hidden";
            updateNavCount(); // 更新条数显示
            return;
        }

        // 如果条目数量超过指定阈值，则将navBar的top抬高
        let navTop = linkCount > NAV_TOP_THRESHOLD ? getNavTopOverflow() : getNavTop();
        navBar.style.top = navTop;
        navMiniButton.style.top = navTop;

        // 更新条数显示
        updateNavCount();

        if(navMinimized) {
            navBar.style.visibility = "hidden";
            navMiniButton.style.visibility = "visible";
        } else {
            navBar.style.visibility = "visible";
            navMiniButton.style.visibility = "hidden";
            if(!root.contains(navBar)) root.appendChild(navBar);
        }
    };

    // 设置导航栏的最小化状态
    const setNavMinimized = (min) => {
        navMinimized = min === true;
        setS(T + 'navMinimized', navMinimized.toString());
        refreshNavBarVisibility();
    };

    // 计算当前应该高亮的导航项索引
    const computeActiveIndex = () => {
        if(!navQuestions?.length) return -1;
        let candidateIndex = -1, smallestPositiveTop = Infinity, lastNegativeIndex = -1;

        navQuestions.forEach((el, i) => {
            if(!el?.getBoundingClientRect) return;
            const rect = el.getBoundingClientRect();
            if(rect.top >= 0) {
                if(rect.top < smallestPositiveTop) {
                    smallestPositiveTop = rect.top;
                    candidateIndex = i;
                }
            } else {
                lastNegativeIndex = i;
            }
        });
        return candidateIndex !== -1 ? candidateIndex : lastNegativeIndex;
    };

    // 高亮当前活跃的导航项
    const highlightActiveNav = () => {
        const idx = computeActiveIndex();
        navLinks.forEach((link, i) => setLinkStyle(link, i === idx));
        // 自动显示当前高亮项对应的副目录
        if (idx >= 0 && typeof autoShowSubNav === 'function') {
            autoShowSubNav(idx);
        }
    };

    // 检查并切换高亮状态（根据滚动位置智能高亮）
    const checkAndSwitchHighlight = () => {
        if(!navQuestions?.length) return;

        // 找到所有可见的目录项
        const visibleElements = getVisibleElements(navQuestions, 1.0); // 使用100%视口高度进行初步筛选
        if(visibleElements.length === 0) {
            return;
        }

        const firstVisibleEl = visibleElements[0];
        const rect = firstVisibleEl.getBoundingClientRect();
        const positionPercent = getElementPositionPercent(rect);

        let targetIndex = -1;
        if(positionPercent >= 0 && positionPercent <= NAV_HIGHLIGHT_THRESHOLD) {
            // 0~30%：高亮当前项
            targetIndex = navQuestions.indexOf(firstVisibleEl);
        } else if(positionPercent > NAV_HIGHLIGHT_THRESHOLD && positionPercent <= 1.0) {
            // 30%~100%：高亮前一项
            const currentIndex = navQuestions.indexOf(firstVisibleEl);
            targetIndex = currentIndex > 0 ? currentIndex - 1 : currentIndex;
        }

        if(targetIndex >= 0) {
            clearAllHighlights();
            setLinkStyle(navLinks[targetIndex], true);
            // 自动显示当前高亮项对应的副目录
            if (typeof autoShowSubNav === 'function') {
                autoShowSubNav(targetIndex);
            }
        }
    };

    // 滚动事件处理函数（优化的节流处理）
    let lastScrollTime = 0;
    const onScrollRefreshActive = () => {
        const now = Date.now();
        if(now - lastScrollTime < 32) return; // 约30fps的节流，减少性能消耗
        lastScrollTime = now;

        // 清除之前的防抖计时器
        if(scrollDebounceTimer) {
            clearTimeout(scrollDebounceTimer);
            scrollDebounceTimer = null;
        }

        // 设置防抖，避免重复执行
        scrollDebounceTimer = setTimeout(() => {
            scrollDebounceTimer = null;
            highlightActiveNav();
            checkAndSwitchHighlight();
        }, 30); // 减少延迟到30ms，提高响应性
    };

    window.addEventListener('scroll', onScrollRefreshActive, { passive: true });

    // 查找问题对应的回答内容区域
    const findAnswerContent = (questionEl) => {
        if (!questionEl) return null;

        // 获取所有问题元素，用于确定回答区域的边界
        const allQuestions = getQuestionList();
        if (!allQuestions || allQuestions.length === 0) return null;

        const questionIndex = Array.from(allQuestions).indexOf(questionEl);

        // 兼容：问题节点已不在最新列表中时，仍然从其后续兄弟中兜底查找回答区域
        if (questionIndex < 0) {
            let nextSibling = questionEl.nextElementSibling;
            let checkedCount = 0;
            while (nextSibling && checkedCount < FIND_ANSWER_MIDDLE_SIBLING_LIMIT) {
                const headings = nextSibling.querySelectorAll(SUB_NAV_HEADING_SELECTOR);
                if (headings.length > 0) {
                    return nextSibling;
                }
                if (nextSibling.tagName && SUB_NAV_HEADING_TAGS.includes(nextSibling.tagName)) {
                    return nextSibling.parentElement;
                }
                nextSibling = nextSibling.nextElementSibling;
                checkedCount++;
            }
            return null;
        }

        // 先按父级兄弟链查找回答区域
        if (questionIndex >= allQuestions.length - 1) {
            // 如果是最后一个问题，查找它之后的所有内容
            const answerFromParents = searchInParentSiblings(questionEl, FIND_ANSWER_LAST_SIBLING_LIMIT, null);
            if (answerFromParents) return answerFromParents;
        } else {
            // 如果不是最后一个问题，查找当前问题和下一个问题之间的内容
            const nextQuestion = allQuestions[questionIndex + 1];
            if (!nextQuestion) return null;

            const stopCondition = (sibling) => {
                return sibling.contains(nextQuestion) || sibling === nextQuestion;
            };
            const answerFromParents = searchInParentSiblings(questionEl, FIND_ANSWER_MIDDLE_SIBLING_LIMIT, stopCondition);
            if (answerFromParents) return answerFromParents;
        }

        // 父级兄弟未找到时，最后再从当前问题节点的后续兄弟元素中兜底查找
        let nextSibling = questionEl.nextElementSibling;
        let checkedCount = 0;
        while (nextSibling && checkedCount < FIND_ANSWER_MIDDLE_SIBLING_LIMIT) {
            const headings = nextSibling.querySelectorAll(SUB_NAV_HEADING_SELECTOR);
            if (headings.length > 0) {
                return nextSibling;
            }
            if (nextSibling.tagName && SUB_NAV_HEADING_TAGS.includes(nextSibling.tagName)) {
                return nextSibling.parentElement;
            }
            nextSibling = nextSibling.nextElementSibling;
            checkedCount++;
        }

        return null;
    };

    // 向上查找父元素的兄弟元素，查找回答区域
    const searchInParentSiblings = (startEl, siblingLimit, stopCondition) => {
        let current = startEl;
        let depth = 0;
        while (current && depth < FIND_ANSWER_PARENT_DEPTH_LIMIT) {
            const parent = current.parentElement;
            if (!parent) break;

            let sibling = parent.nextElementSibling;
            let checkedCount = 0;
            while (sibling && checkedCount < siblingLimit) {
                // 检查停止条件（如遇到下一个问题）
                if (stopCondition && stopCondition(sibling)) {
                    break;
                }
                // 查找包含标题的兄弟元素
                const headings = sibling.querySelectorAll(SUB_NAV_HEADING_SELECTOR);
                if (headings.length > 0) {
                    return sibling;
                }
                if (sibling.tagName && SUB_NAV_HEADING_TAGS.includes(sibling.tagName)) {
                    return sibling.parentElement;
                }
                sibling = sibling.nextElementSibling;
                checkedCount++;
            }
            current = parent;
            depth++;
        }
        return null;
    };

    // 规范化标题文本（移除 emoji、空格、冒号等，但保留数字编号）
    const normalizeHeadingText = (text) => {
        if (!text) return '';
        let normalized = text.trim();
        // 先移除开头的连续空格
        normalized = normalized.replace(/^\s+/, '');

        // 关键优化：先检查第一个字符是否是数字，避免某些环境将数字误识别为 emoji
        const firstChar = normalized.charAt(0);
        if (/[0-9]/.test(firstChar)) {
            // 第一个字符是数字，不做任何处理，保留完整的数字编号
        } else {
            // 检查是否是 emoji 开头，且后面紧跟数字（可能含空格）
            if (/^\p{Emoji}\s*[0-9]/u.test(normalized)) {
                // emoji 后面是数字，只移除 emoji 和空格，保留数字
                normalized = normalized.substring(2);
            } else if (/^\p{Emoji}/u.test(normalized)) {
                // emoji 后面不是数字，安全移除 emoji
                // 再次确认第一个字符不是数字（双重检查，防止误识别）
                if (!/[0-9]/.test(normalized.charAt(0))) {
                    normalized = normalized.replace(/^\p{Emoji}+\s*/u, '');
                }
                // 如果第一个字符是数字，说明被误识别为 emoji，不做处理
            }
        }
        // 移除末尾的冒号（中英文）
        return normalized.replace(/[:：]+$/, '');
    };

    /**
     * 查找 Markdown 格式的标题（如 # 标题、## 标题、### 标题）
     * 支持标题被分割在多个元素中的情况（如 <span>## 五、</span><span>标题内容</span>）
     * 兼容代码块未正确闭合的情况：即使标题在代码块内（因代码块未正确闭合导致的），也要识别为标题
     */
    const findMarkdownHeadings = (contentEl, headingList, startDomOrder) => {
        // 按前缀长度降序排列，确保先匹配更长的前缀（如 ###），再匹配短的前缀（如 ##）
        const markdownHeadingPatterns = [
            { level: 3, prefix: '### ' },   // h3: ### 标题
            { level: 2, prefix: '## ' }    // h2: ## 标题
        ];

        // 检查纯文本节点（包括合并后的文本，如分割在多个span中的标题在textContent中会合并成一行）
        const walker = document.createTreeWalker(
            contentEl,
            NodeFilter.SHOW_TEXT,
            null,
            false
        );

        let textNode;
        let domOrder = startDomOrder; // 继续使用传入的domOrder，保持顺序连续
        const processedElements = new Set(); // 记录已处理的元素，避免重复处理

        while (textNode = walker.nextNode()) {
            const text = textNode.textContent;
            if (!text) continue;

            // 获取文本节点的父元素（通常是 span）
            const parentSpan = textNode.parentElement;
            if (!parentSpan || parentSpan === contentEl) continue;

            // 如果已经处理过这个 span，跳过（避免重复）
            if (processedElements.has(parentSpan)) continue;

            // 检查父元素是否是 span 标签
            if (parentSpan.tagName !== 'SPAN') continue;

            // 获取 span 的文本内容（去空后）
            const spanText = (parentSpan.textContent || '').trim();

            // 检查所有 markdown 标题模式
            for (const { level, prefix } of markdownHeadingPatterns) {
                if (!SUB_NAV_HEADING_LEVELS.includes(level)) continue;

                let titleElement = null;
                let titleText = '';

                // 情况1：span 文本去空后仅包含标记（如 "###" 或 "##"）
                if (spanText === prefix.trim()) {
                    // 找到标记 span，使用其父元素作为标题元素
                    titleElement = parentSpan.parentElement;
                    if (!titleElement || titleElement === contentEl) continue;

                    // 从父元素的 textContent 中提取完整标题文本（去掉标记前缀）
                    const fullText = (titleElement.textContent || '').trim();
                    titleText = fullText.replace(new RegExp(`^${prefix.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}`), '').trim();
                }
                // 情况2：span 文本以标记开头（如 "##二、请求处理全景图"）
                else if (spanText.startsWith(prefix.trim())) {
                    // 从 span 的文本中提取标题文本（去掉标记前缀）
                    titleText = spanText.substring(prefix.trim().length).trim();

                    // 检查该 span 之后的所有兄弟元素，如果有文本，拼接到标题文本
                    let nextSibling = parentSpan.nextSibling;
                    while (nextSibling) {
                        let siblingText = '';
                        if (nextSibling.nodeType === Node.ELEMENT_NODE) {
                            siblingText = (nextSibling.textContent || '').trim();
                        } else if (nextSibling.nodeType === Node.TEXT_NODE) {
                            siblingText = (nextSibling.textContent || '').trim();
                        }

                        // 如果遇到 ```（三个反引号），终止拼接
                        if (siblingText === '```') {
                            break;
                        }

                        // 如果是空字符，终止匹配
                        if (!siblingText) {
                            break;
                        }

                        // 如果兄弟元素以 ## 或 ### 开头，视为新的标题元素，终止拼接
                        // 先检查更长的模式，避免 ### 被 ## 匹配
                        if (siblingText.startsWith('###') || siblingText.startsWith('##')) {
                            break;
                        }

                        // 如果有文本，拼接到标题文本
                        if (siblingText) {
                            titleText += siblingText;
                        }

                        nextSibling = nextSibling.nextSibling;
                    }

                    // 使用该 span 的父元素作为标题元素（因为可能需要包含所有兄弟元素）
                    titleElement = parentSpan.parentElement;
                    if (!titleElement || titleElement === contentEl) {
                        // 如果父元素无效，则使用该 span 本身
                        titleElement = parentSpan;
                    }
                }

                // 如果找到了标题元素和文本，进行处理
                if (titleElement && titleText) {
                    const rect = titleElement.getBoundingClientRect();
                    if (rect.width === 0 || rect.height === 0) continue;

                    // 规范化标题文本
                    const normalizedText = normalizeHeadingText(titleText);
                    if (!normalizedText) continue;

                    // 检查是否已经存在相同文本和级别的标题（避免重复）
                    // 使用 position 来判断，更准确
                    const exists = headingList.some(h =>
                        h.text === normalizedText &&
                        h.level === level &&
                        h.position !== undefined &&
                        Math.abs(h.position - rect.top) < 30
                    );

                    if (!exists) {
                        headingList.push({
                            element: titleElement,
                            tagName: `H${level}`,
                            text: normalizedText,
                            level: level,
                            position: rect.top, // 记录位置，用于排序
                            domOrder: domOrder++ // 记录DOM顺序（每个匹配的标题单独分配）
                        });
                        // 标记该 span 已处理，避免重复
                        processedElements.add(parentSpan);
                    }
                    break; // 找到匹配后退出模式循环
                }
            }
        }

        return domOrder; // 返回更新后的domOrder
    };

    // 在回答内容区域中查找所有配置的标题级别
    const findHeadingsInContent = (contentEl) => {
        if (!contentEl) return [];

        const headingList = [];

        // 1. 查找现有的 h2~h4 标签标题
        let domOrder = 0; // 初始化DOM顺序计数器（HTML标签标题和Markdown标题共用）
        const headings = contentEl.querySelectorAll(SUB_NAV_HEADING_SELECTOR);
        Array.from(headings).forEach(h => {
            // 确保标题是可见的
            const rect = h.getBoundingClientRect();
            if (rect.width === 0 || rect.height === 0) return;
            if (site === STUDIO) {
                const distanceToRight = window.innerWidth - rect.left;
                if (distanceToRight < STUDIO_HEADING_RIGHT_GAP) return;
            }
            // 确保标题级别在配置的范围内
            const level = parseInt(h.tagName.substring(1));
            if (!SUB_NAV_HEADING_LEVELS.includes(level)) return;

            // 规范化标题文本
            const text = normalizeHeadingText(h.textContent);

            headingList.push({
                element: h,
                tagName: h.tagName,
                text: text,
                level: level,
                position: rect.top, // 记录位置，用于排序
                domOrder: domOrder++ // 为HTML标签标题也添加domOrder，确保排序正确
            });
        });

        // 2. 查找文本中以 "# "、"## " 或 "### " 开头的 Markdown 标题
        // 性能优化：仅对配置的站点启用此功能，避免对其他站点造成性能占用
        if (ENABLE_MARKDOWN_HEADING_SITES.includes(site)) {
            domOrder = findMarkdownHeadings(contentEl, headingList, domOrder);
        }

        // 3. 去重并排序（按DOM位置，保持文档中的原始顺序）
        const uniqueHeadings = [];
        const seenKeys = new Set();

        // 按位置排序（使用 position，这样 Markdown 标题会插入到正确的位置）
        // 如果 position 不存在，使用 domOrder 作为备选排序依据
        headingList.sort((a, b) => {
            const posA = a.position !== undefined ? a.position : Infinity;
            const posB = b.position !== undefined ? b.position : Infinity;
            if (posA !== Infinity && posB !== Infinity) {
                return posA - posB;
            }
            // 如果某个标题没有 position，使用 domOrder 排序
            const orderA = a.domOrder !== undefined ? a.domOrder : Infinity;
            const orderB = b.domOrder !== undefined ? b.domOrder : Infinity;
            return orderA - orderB;
        });

        headingList.forEach(heading => {
            // 使用文本、级别和位置作为唯一标识，避免重复
            // 使用更小的位置区间（5像素）来区分不同的标题
            const positionKey = heading.position !== undefined ? Math.floor(heading.position / 5) : heading.domOrder;
            const key = `${heading.text}_${heading.level}_${positionKey}`;

            if (!seenKeys.has(key)) {
                seenKeys.add(key);
                uniqueHeadings.push({
                    element: heading.element,
                    tagName: heading.tagName,
                    text: heading.text,
                    level: heading.level,
                    domOrder: heading.domOrder
                });
            }
        });

        return uniqueHeadings;
    };

    // 渲染副目录项（根据当前选择的层级过滤）
    const renderSubNavItems = () => {
        // 获取标题容器后的所有元素
        const titleContainer = subNavBar.querySelector('.sub-nav-title-container');
        if (!titleContainer) return;

        // 移除所有标题项（保留标题容器）
        const items = subNavBar.querySelectorAll('.sub-nav-item');
        items.forEach(item => item.remove());

        // 根据当前选择的层级过滤标题
        let filteredHeadings = currentSubNavHeadings.filter(h => h.level <= currentSubNavLevel);

        // 如果h1只有1个，则过滤掉h1标题项
        if (h1Count === 1) {
            filteredHeadings = filteredHeadings.filter(h => h.level !== 1);
        }

        // 获取所有出现的标题层级（从小到大排序）
        const allLevels = [...new Set(currentSubNavHeadings.map(h => h.level))].sort((a, b) => a - b);
        
        // 从后往前分配字体粗细
        const fontWeightValues = [400, 500, 600, 700];
        const levelToWeightMap = {};
        allLevels.forEach((level, index) => {
            const reverseIndex = allLevels.length - 1 - index;
            const weightIndex = Math.min(reverseIndex, fontWeightValues.length - 1);
            levelToWeightMap[level] = fontWeightValues[weightIndex];
        });

        // 创建标题级别样式映射，根据实际出现的层级动态设置字体粗细
        const getStyleWithWeight = (baseStyle, level) => {
            // 如果该层级存在，使用映射的粗细值；否则保持原样式
            if (levelToWeightMap.hasOwnProperty(level)) {
                const weight = levelToWeightMap[level];
                return baseStyle.replace(/font-weight:\d+/, `font-weight:${weight}`);
            }
            return baseStyle;
        };

        const headingStyleMap = {
            1: getStyleWithWeight(NAV_STYLES.subNavItemH1, 1),
            2: getStyleWithWeight(NAV_STYLES.subNavItemH2, 2),
            3: getStyleWithWeight(NAV_STYLES.subNavItemH3, 3),
            4: getStyleWithWeight(NAV_STYLES.subNavItemH4, 4)
        };

        // 添加过滤后的标题
        filteredHeadings.forEach((heading, index) => {
            const item = document.createElement('div');
            item.className = 'sub-nav-item';
            let itemStyle = NAV_STYLES.subNavItem;

            // 根据标题级别设置不同的缩进（如果配置中包含该级别）
            if (SUB_NAV_HEADING_LEVELS.includes(heading.level) && headingStyleMap[heading.level]) {
                itemStyle += headingStyleMap[heading.level];
            } else {
                // 如果级别不在预定义样式中，根据级别动态计算缩进（每级8px）
                const paddingLeft = heading.level * 8;
                itemStyle += `padding-left:${paddingLeft}px;`;
            }

            item.style.cssText = itemStyle;
            item.textContent = heading.text;
            item.title = heading.text;

            // 鼠标悬停效果
            item.addEventListener('mouseenter', () => {
                item.style.backgroundColor = SUB_NAV_ITEM_HOVER_BG;
                item.style.color = SUB_NAV_ITEM_HOVER_COLOR;
            });
            item.addEventListener('mouseleave', () => {
                item.style.backgroundColor = SUB_NAV_ITEM_NORMAL_BG;
                item.style.color = SUB_NAV_ITEM_NORMAL_COLOR;
            });

            // 点击跳转
            item.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation();

                // 先尝试使用保存的元素引用
                let targetElement = heading.element;

                // 如果元素引用失效，重新查找对应的标题元素
                if (!targetElement || !document.body.contains(targetElement)) {
                    // 获取当前问题索引
                    const questionIndex = currentSubNavQuestionIndex;
                    if (questionIndex >= 0 && navQuestions && questionIndex < navQuestions.length) {
                        const targetEl = navQuestions[questionIndex];
                        if (targetEl && document.body.contains(targetEl)) {
                            // 查找回答内容区域
                            const answerContent = findAnswerContent(targetEl);
                            if (answerContent) {
                                // 重新查找所有标题
                                const headings = findHeadingsInContent(answerContent);
                                // 查找匹配的标题（通过文本和级别）
                                const matchedHeading = headings.find(h =>
                                    h.text === heading.text && h.level === heading.level
                                );
                                if (matchedHeading && matchedHeading.element) {
                                    targetElement = matchedHeading.element;
                                }
                            }
                        }
                    }
                }

                if (!targetElement || !document.body.contains(targetElement)) {
                    console.warn('标题元素不存在，无法跳转');
                    return;
                }
                targetElement.scrollIntoView({ block: 'start' });
            });

            subNavBar.appendChild(item);
        });
    };

    // 根据副目录条目数量动态设置top位置
    const updateSubNavTop = () => {
        const subNavItemCount = subNavBar.querySelectorAll('.sub-nav-item').length;
        const topValue = subNavItemCount > SUB_NAV_TOP_THRESHOLD ? getSubNavTopOverflow() : getSubNavTop();
        subNavBar.style.top = topValue;
        subNavBar.style.maxHeight = calculateSubNavMaxHeight(topValue);
    };

    // 更新副目录状态
    const updateSubNavState = (questionIndex, headings) => {
        // 保存标题数据和状态
        currentSubNavHeadings = headings;

        // 统计h1标题的数量
        h1Count = headings.filter(h => h.level === 1).length;

        // 获取实际存在的标题层级（从高到低：h4, h3, h2, h1）
        let existingLevels = [...new Set(headings.map(h => h.level))].sort((a, b) => b - a);

        // 如果h1只有1个，则从层级列表中过滤掉h1
        if (h1Count === 1) {
            existingLevels = existingLevels.filter(level => level !== 1);
        }

        // 检查是否是同一个问题且用户已手动选择层级
        const isSameQuestion = questionIndex === currentSubNavQuestionIndex;
        if (isSameQuestion && isSubNavLevelManuallySet) {
            // 如果是同一个问题且用户已手动选择层级，保留用户的选择，不重新计算
            currentSubNavQuestionIndex = questionIndex;
        } else {
            // 如果是新问题或用户未手动选择，重新计算层级
            currentSubNavQuestionIndex = questionIndex;
            isSubNavLevelManuallySet = false; // 重置手动选择标志

            // 设置默认层级
            if (existingLevels.length > 0) {
                const highestLevel = existingLevels[0]; // 最高层级（数字最大，如h4=4）
                // 如果总条数超过阈值，则默认显示到上一层级
                if (headings.length > SUB_NAV_PREV_LEVEL_THRESHOLD) {
                    // 从最高层级开始，向下查找第一个不超过阈值的层级
                    for (const level of existingLevels) {
                        let filtered = headings.filter(h => h.level <= level);
                        if (h1Count === 1) {
                            filtered = filtered.filter(h => h.level !== 1);
                        }
                        if (filtered.length <= SUB_NAV_PREV_LEVEL_THRESHOLD) {
                            currentSubNavLevel = level;
                            break;
                        }
                        currentSubNavLevel = level; // 如果都超过阈值，使用最低层级
                    }
                } else {
                    // 否则显示到实际存在的最高层级（h4 > h3 > h2）
                    currentSubNavLevel = highestLevel;
                }
            }
            // 如果h1只有1个且当前层级是h1，则降级到h2
            if (h1Count === 1 && currentSubNavLevel === 1) {
                currentSubNavLevel = existingLevels.length > 0 ? existingLevels[0] : 2;
            }
        }

        return existingLevels;
    };

    // 创建副目录最大宽度按钮
    const createSubNavMaxWidthBtn = (buttonRow) => {
        const maxWidthBtn = createTag('div', "", NAV_STYLES.subNavMaxWidthBtn);
        maxWidthBtn.textContent = '最大宽';
        maxWidthBtn.title = '设置副目录最大宽度';
        maxWidthBtn.style.position = 'relative';
        maxWidthBtn.style.top = 'auto';
        maxWidthBtn.style.right = 'auto';
        maxWidthBtn.addEventListener('mouseenter', () => {
            maxWidthBtn.style.backgroundColor = '#f0f0f0';
        });
        maxWidthBtn.addEventListener('mouseleave', () => {
            maxWidthBtn.style.backgroundColor = 'transparent';
        });
        maxWidthBtn.addEventListener('click', (e) => {
            e.stopPropagation();

            // 创建输入框
            const input = document.createElement('input');
            input.type = 'text';
            input.value = getSubNavMaxWidth();
            input.style.cssText = NAV_STYLES.subNavMaxWidthInput.replace('position:absolute;top:0;right:', 'position:relative;top:auto;right:auto;');

            // 替换按钮为输入框（使用insertBefore保持位置）
            buttonRow.insertBefore(input, maxWidthBtn);
            maxWidthBtn.style.display = 'none';
            input.focus();
            input.select();

            // blur事件：保存值并更新宽度
            input.addEventListener('blur', () => {
                const newMaxWidth = input.value.trim();
                const formatRegex = /^\d+(\.\d+)?px$/;
                if (newMaxWidth && formatRegex.test(newMaxWidth)) {
                    const minWidthNum = parseFloat(subNavMinWidth);
                    const newMaxWidthNum = parseFloat(newMaxWidth);
                    if (newMaxWidthNum >= minWidthNum) {
                        // 格式正确且大于等于最小宽度，保存并更新
                        setSubNavMaxWidth(newMaxWidth);
                        subNavBar.style.maxWidth = newMaxWidth;
                    } else {
                        input.value = getSubNavMaxWidth();
                        alert(`最大宽度不能小于最小宽度 ${subNavMinWidth}`);
                    }
                } else if (newMaxWidth) {
                    input.value = getSubNavMaxWidth();
                    alert('格式错误，请输入"数字+px"格式，例如：260px');
                }
                // 恢复按钮（使用insertBefore保持位置）
                buttonRow.insertBefore(maxWidthBtn, input);
                input.remove();
                maxWidthBtn.style.display = 'flex';
            });

            // Enter键也触发blur
            input.addEventListener('keydown', (e) => {
                if (e.key === 'Enter') {
                    input.blur();
                }
            });
        });
        return maxWidthBtn;
    };

    // 创建副目录位置按钮
    const createSubNavPositionBtn = (buttonRow) => {
        const positionBtn = createTag('div', "", NAV_STYLES.subNavPositionBtn);
        positionBtn.textContent = '位置';
        positionBtn.title = '设置副目录水平位置';
        positionBtn.style.position = 'relative';
        positionBtn.style.top = 'auto';
        positionBtn.style.right = 'auto';
        positionBtn.addEventListener('mouseenter', () => {
            positionBtn.style.backgroundColor = '#f0f0f0';
        });
        positionBtn.addEventListener('mouseleave', () => {
            positionBtn.style.backgroundColor = 'transparent';
        });
        positionBtn.addEventListener('click', (e) => {
            e.stopPropagation();

            // 创建输入框
            const input = document.createElement('input');
            input.type = 'text';
            input.value = getSubNavLeft();
            input.style.cssText = NAV_STYLES.subNavPositionInput.replace('position:absolute;top:0;right:', 'position:relative;top:auto;right:auto;');

            // 替换按钮为输入框（使用insertBefore保持位置）
            buttonRow.insertBefore(input, positionBtn);
            positionBtn.style.display = 'none';
            input.focus();
            input.select();

            // blur事件：保存值并更新位置
            input.addEventListener('blur', () => {
                const newLeft = input.value.trim();
                const formatRegex = /^\d+(\.\d+)?px$/;
                if (newLeft && formatRegex.test(newLeft)) {
                    // 格式正确，保存到localStorage，更新副目录的left位置
                    setSubNavLeft(newLeft);
                    subNavBar.style.left = newLeft;
                    subNavBar.style.right = 'auto';
                    isSubNavAlignedLeft = newLeft === alignLeftValue;
                    isSubNavAlignedRight = false;
                    if (!isSubNavAlignedLeft) {
                        subNavLeftBeforeAlign = newLeft;
                        subNavLeftBeforeAlignRight = newLeft;
                    }
                } else if (newLeft) {
                    input.value = getSubNavLeft();
                    alert('位置格式错误，请输入"数字+px"格式，例如：270px');
                }
                // 恢复按钮（使用insertBefore保持位置）
                buttonRow.insertBefore(positionBtn, input);
                input.remove();
                positionBtn.style.display = 'flex';
            });

            // Enter键也触发blur
            input.addEventListener('keydown', (e) => {
                if (e.key === 'Enter') {
                    input.blur();
                }
            });
        });
        return positionBtn;
    };

    // 创建副目录靠左按钮
    const createSubNavAlignLeftBtn = () => {
        const alignLeftBtn = createTag('div', "", NAV_STYLES.subNavAlignLeftBtn + (isSubNavAlignedLeft ? NAV_STYLES.subNavAlignLeftBtnActive : NAV_STYLES.subNavAlignLeftBtnNormal));
        alignLeftBtn.textContent = '左';
        alignLeftBtn.title = '靠左/恢复原位置';

        const refreshAlignLeftBtnStyle = (isHover = false) => {
            const baseBg = isSubNavAlignedLeft ? SUB_ALIGN_LEFT_ACTIVE_BG : 'transparent';
            const hoverBg = isHover ? '#f0f0f0' : baseBg;
            alignLeftBtn.style.backgroundColor = hoverBg;
        };

        alignLeftBtn.addEventListener('mouseenter', () => {
            refreshAlignLeftBtnStyle(true);
        });
        alignLeftBtn.addEventListener('mouseleave', () => {
            refreshAlignLeftBtnStyle(false);
        });
        alignLeftBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            const currentLeft = getSubNavLeft();
            if (!isSubNavAlignedLeft) {
                if (isSubNavAlignedRight) {
                    subNavLeftBeforeAlign = subNavLeftBeforeAlignRight || SUB_NAV_LEFT;
                } else if (currentLeft !== alignLeftValue) {
                    subNavLeftBeforeAlign = currentLeft;
                } else if (!subNavLeftBeforeAlign) {
                    subNavLeftBeforeAlign = SUB_NAV_LEFT;
                }
                setSubNavLeft(alignLeftValue);
                subNavBar.style.left = alignLeftValue;
                subNavBar.style.right = 'auto';
                isSubNavAlignedLeft = true;
                isSubNavAlignedRight = false;
            } else {
                const restoreLeft = subNavLeftBeforeAlign || SUB_NAV_LEFT;
                setSubNavLeft(restoreLeft);
                subNavBar.style.left = restoreLeft;
                subNavBar.style.right = 'auto';
                isSubNavAlignedLeft = false;
            }
            refreshAlignLeftBtnStyle(false);
        });

        return alignLeftBtn;
    };

    // 创建副目录靠右按钮
    const createSubNavAlignRightBtn = () => {
        const alignRightBtn = createTag('div', "", NAV_STYLES.subNavAlignRightBtn + (isSubNavAlignedRight ? NAV_STYLES.subNavAlignRightBtnActive : NAV_STYLES.subNavAlignRightBtnNormal));
        alignRightBtn.textContent = '右';
        alignRightBtn.title = '靠右/恢复原位置';

        const refreshAlignRightBtnStyle = (isHover = false) => {
            const baseBg = isSubNavAlignedRight ? SUB_ALIGN_RIGHT_ACTIVE_BG : 'transparent';
            const hoverBg = isHover ? '#f0f0f0' : baseBg;
            alignRightBtn.style.backgroundColor = hoverBg;
        };

        alignRightBtn.addEventListener('mouseenter', () => {
            refreshAlignRightBtnStyle(true);
        });
        alignRightBtn.addEventListener('mouseleave', () => {
            refreshAlignRightBtnStyle(false);
        });
        alignRightBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            const currentLeft = getSubNavLeft();
            if (!isSubNavAlignedRight) {
                if (isSubNavAlignedLeft) {
                    subNavLeftBeforeAlignRight = subNavLeftBeforeAlign || SUB_NAV_LEFT;
                } else if (currentLeft !== alignRightValue) {
                    subNavLeftBeforeAlignRight = currentLeft;
                } else if (!subNavLeftBeforeAlignRight) {
                    subNavLeftBeforeAlignRight = SUB_NAV_LEFT;
                }
                subNavBar.style.left = 'auto';
                subNavBar.style.right = alignRightValue;
                isSubNavAlignedRight = true;
                isSubNavAlignedLeft = false;
            } else {
                const restoreLeft = subNavLeftBeforeAlignRight || SUB_NAV_LEFT;
                setSubNavLeft(restoreLeft);
                subNavBar.style.left = restoreLeft;
                subNavBar.style.right = 'auto';
                isSubNavAlignedRight = false;
            }
            refreshAlignRightBtnStyle(false);
        });

        return alignRightBtn;
    };

    // 创建副目录关闭按钮
    const createSubNavCloseBtn = () => {
        const closeBtn = createTag('div', "", NAV_STYLES.subNavCloseBtn);
        closeBtn.textContent = '×';
        closeBtn.title = '关闭副目录';
        closeBtn.addEventListener('mouseenter', () => {
            closeBtn.style.backgroundColor = '#f0f0f0';
        });
        closeBtn.addEventListener('mouseleave', () => {
            closeBtn.style.backgroundColor = 'transparent';
        });
        closeBtn.addEventListener('click', (e) => {
            e.stopPropagation();

            // 检查是否是首次点击（用GM存储标记状态）
            const firstCloseKey = `${T}subNavFirstCloseShown`;
            const hasShownFirstClose = GM_getValue(firstCloseKey, false);
            if (!hasShownFirstClose) {
                alert("这家大模型将不再显示副目录；\n若需恢复，点击主目录每条提问前的小图标即可");
                GM_setValue(firstCloseKey, true);
            }

            // 记录关闭状态
            setSubNavClosed(true);
            hideSubNavBar();
        });
        return closeBtn;
    };

    // 创建副目录层级按钮组
    const createSubNavLevelBtnGroup = (existingLevels) => {
        const levelBtnGroup = createTag('div', "", NAV_STYLES.levelBtnGroup);

        // 创建层级按钮（只显示实际存在的层级，按钮显示顺序为 h2, h3, h4，从高到低）
        existingLevels.slice().reverse().forEach(level => {
            const btn = document.createElement('div');
            btn.textContent = `h${level}`;
            btn.dataset.level = level;

            // 设置按钮样式
            let btnStyle = NAV_STYLES.levelBtn;
            if (level === currentSubNavLevel) {
                btnStyle += NAV_STYLES.levelBtnActive;
            }
            btn.style.cssText = btnStyle;

            // 鼠标悬停效果
            btn.addEventListener('mouseenter', () => {
                if (level !== currentSubNavLevel) {
                    btn.style.cssText = btnStyle + NAV_STYLES.levelBtnHover;
                }
            });
            btn.addEventListener('mouseleave', () => {
                if (level !== currentSubNavLevel) {
                    btn.style.cssText = btnStyle + NAV_STYLES.levelBtnLeave;
                }
            });

            // 点击切换层级
            btn.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation();

                // 更新当前层级
                currentSubNavLevel = level;
                // 标记用户已手动选择层级
                isSubNavLevelManuallySet = true;

                // 更新所有按钮的样式
                levelBtnGroup.querySelectorAll('[data-level]').forEach(b => {
                    if (parseInt(b.dataset.level) === level) {
                        b.style.cssText = NAV_STYLES.levelBtn + NAV_STYLES.levelBtnActive;
                    } else {
                        b.style.cssText = NAV_STYLES.levelBtn;
                    }
                });

                // 重新渲染标题项
                renderSubNavItems();

                // 根据副目录条目数量动态设置top位置
                updateSubNavTop();
            });

            levelBtnGroup.appendChild(btn);
        });

        return levelBtnGroup;
    };

    // 渲染副目录UI
    const renderSubNavUI = (questionIndex, existingLevels) => {
        // 清空副目录栏
        subNavBar.replaceChildren();

        // 创建标题容器（sticky定位，用于冻结顶栏）
        const titleContainer = createTag('div', "", 'position:sticky;top:0;background:rgba(255,255,255,1);z-index:10;padding:5px 0;padding-bottom:6px;border-bottom:1px solid #eaeaea;');
        titleContainer.className = 'sub-nav-title-container';
        
        // 第一行：标题、层级按钮组、关闭按钮
        const titleRow = createTag('div', "", 'display:flex;align-items:center;justify-content:space-between;gap:8px;');
        const titleLeft = createTag('div', "", 'display:flex;align-items:center;gap:8px;flex:1;');

        // 创建标题文本
        const titleText = createTag('span', "", 'font-weight:bold;color:#333;font-size:14px;');
        titleText.textContent = `副目录 ${questionIndex + 1}`;

        // 创建层级按钮组
        const levelBtnGroup = createSubNavLevelBtnGroup(existingLevels);

        // 组装左侧（标题和按钮组）
        appendSeveral(titleLeft, titleText, levelBtnGroup);
        titleRow.appendChild(titleLeft);
        
        // 创建关闭按钮
        const closeBtn = createSubNavCloseBtn();
        titleRow.appendChild(closeBtn);
        titleContainer.appendChild(titleRow);

        // 第二行：最大宽度、位置、靠左、靠右按钮
        const buttonRow = createTag('div', "", NAV_STYLES.subNavButtonRow);
        const maxWidthBtn = createSubNavMaxWidthBtn(buttonRow);
        const positionBtn = createSubNavPositionBtn(buttonRow);
        const alignLeftBtn = createSubNavAlignLeftBtn();
        const alignRightBtn = createSubNavAlignRightBtn();
        
        // 调整按钮样式，使其在第二行正常显示
        alignLeftBtn.style.position = 'relative';
        alignLeftBtn.style.top = 'auto';
        alignLeftBtn.style.right = 'auto';
        alignRightBtn.style.position = 'relative';
        alignRightBtn.style.top = 'auto';
        alignRightBtn.style.right = 'auto';
        
        appendSeveral(buttonRow, maxWidthBtn, positionBtn, alignLeftBtn, alignRightBtn);
        titleContainer.appendChild(buttonRow);

        // 添加到副目录栏
        subNavBar.appendChild(titleContainer);

        // 渲染标题项
        renderSubNavItems();

        // 根据副目录条目数量动态设置top位置
        updateSubNavTop();

        // 确保使用最新的left值（从localStorage读取）
        const currentLeft = getSubNavLeft();
        if (isSubNavAlignedRight) {
            subNavBar.style.left = 'auto';
            subNavBar.style.right = alignRightValue;
        } else {
            subNavBar.style.left = currentLeft;
            subNavBar.style.right = 'auto';
        }

        // 显示副目录栏
        subNavBar.style.display = 'block';

        // 启动轮询更新，每10秒检查一次是否需要更新副目录
        startSubNavObserver(questionIndex);
    };

    // 显示副目录栏
    const showSubNavBar = (questionIndex, headings, isPolling = false) => {
        // 如果已关闭，则不加载
        if (isSubNavClosed()) {
            return;
        }
        if (!headings || headings.length === 0) {
            console.log('未找到标题');
            return;
        }
        // 检测标题总条数，超过指定数量才显示副目录
        if (headings.length <= SUB_NAV_MIN_ITEMS) {
            return;
        }

        // 轮询时的优化：如果当前已有标题且新标题数量少于或等于现有标题数量，可能是DOM还没完全加载
        // 只有在标题数量增加时才更新（保留更完整的数据）
        if (isPolling && currentSubNavHeadings.length > 0) {
            // 如果新标题数量少于现有标题，说明可能丢失了某些标题，不更新
            if (headings.length < currentSubNavHeadings.length) {
                console.log(`轮询时标题数量减少（${headings.length} < ${currentSubNavHeadings.length}），保留现有标题`);
                return;
            }
            // 如果标题数量相同，检查是否有实际变化（避免不必要的重建）
            if (headings.length === currentSubNavHeadings.length) {
                // 检查标题列表是否完全相同（通过比较标题文本、级别和domOrder）
                const existingKeys = new Set(currentSubNavHeadings.map(h =>
                    `${h.text}_${h.level}_${h.domOrder || 0}`
                ));
                const newKeys = new Set(headings.map(h =>
                    `${h.text}_${h.level}_${h.domOrder || 0}`
                ));
                // 如果标题完全相同，不更新
                if (existingKeys.size === newKeys.size &&
                    [...existingKeys].every(k => newKeys.has(k))) {
                    return;
                }
            }
        }

        // 更新状态
        const existingLevels = updateSubNavState(questionIndex, headings);

        // 渲染UI
        renderSubNavUI(questionIndex, existingLevels);
    };

    const SUB_NAV_CLOSED_KEY = `${T}subNavClosed`;
    // 检查副目录是否已关闭
    const isSubNavClosed = () => {
        return getS(SUB_NAV_CLOSED_KEY) === 'true';
    };

    // 设置副目录关闭状态
    const setSubNavClosed = (closed) => {
        if (closed) {
            setS(SUB_NAV_CLOSED_KEY, 'true');
        } else {
            localStorage.removeItem(SUB_NAV_CLOSED_KEY);
        }
    };

    // 启动副目录轮询更新（复用 autoShowSubNav 实现）
    const startSubNavObserver = (questionIndex) => {
        // 先停止之前的轮询
        stopSubNavObserver();

        if (questionIndex < 0 || !navQuestions || questionIndex >= navQuestions.length) {
            return;
        }

        // 保存问题索引，供轮询函数使用
        const pollQuestionIndex = questionIndex;

        // 轮询间隔
        const POLL_INTERVAL = 8000;

        // 启动轮询定时器，复用 autoShowSubNav 实现更新
        subNavPollInterval = setInterval(() => {
            // 检查副目录是否还在显示或已关闭
            if (subNavBar.style.display !== 'block' || currentSubNavQuestionIndex !== pollQuestionIndex || isSubNavClosed()) {
                stopSubNavObserver();
                return;
            }

            // 复用 autoShowSubNav 实现更新
            autoShowSubNav(pollQuestionIndex);
        }, POLL_INTERVAL);
    };

    // 停止副目录轮询更新
    const stopSubNavObserver = () => {
        if (subNavPollInterval) {
            clearInterval(subNavPollInterval);
            subNavPollInterval = null;
        }
    };

    // 隐藏副目录栏
    const hideSubNavBar = () => {
        subNavBar.style.display = 'none';
        currentSubNavQuestionIndex = -1;
        // 停止内容变化监听
        stopSubNavObserver();
    };

    // 根据问题索引自动显示对应的副目录
    const autoShowSubNav = (questionIndex) => {
        if (questionIndex < 0 || !navQuestions || questionIndex >= navQuestions.length) {
            return;
        }

        // 如果已关闭，则不加载
        if (isSubNavClosed()) {
            return;
        }

        const targetEl = navQuestions[questionIndex];
        if (!targetEl || !document.body.contains(targetEl)) {
            return;
        }

        // 查找回答内容区域
        const answerContent = findAnswerContent(targetEl);
        if (!answerContent) {
            return;
        }

        // 查找标题
        const headings = findHeadingsInContent(answerContent);
        if (headings.length === 0) {
            return;
        }

        // 显示副目录栏
        // 检查是否是轮询调用（通过检查副目录栏是否已显示来判断）
        const isPolling = subNavBar.style.display === 'block' &&
                         currentSubNavQuestionIndex === questionIndex;
        showSubNavBar(questionIndex, headings, isPolling);
    };

    // 处理导航链接点击事件
    const handleNavLinkClick = (el, i, linkContainer) => {
        return (e) => {
            e.preventDefault();
            // 验证元素是否存在，如果不存在则尝试重新获取
            let targetEl = el;
            const questions = getQuestionList();

            if (!targetEl || !document.body.contains(targetEl)) {
                // 元素可能已被移除或重新渲染，尝试重新获取
                if (questions && questions.length > i) {
                    targetEl = questions[i];
                }
            }

            setTimeout(function(){
                // 遍历更新所有条目文字：如果条目内容为空而questionList里的textContent非空
                if (questions && navLinks) {
                    questions.forEach((question, index) => {
                        if (index >= navLinks.length) return;

                        const currentLinkContainer = navLinks[index];
                        const linkElement = currentLinkContainer.querySelector('.tool-nav-link');
                        if (!linkElement) return;

                        const spans = linkElement.querySelectorAll('span');
                        if (spans.length < 2) return;

                        const textSpanElement = spans[1]; // 第二个span是文本span
                        const currentText = textSpanElement.textContent.trim();
                        const newText = normalizeQuestionText(question.textContent);

                        if (isEmpty(currentText) && !isEmpty(newText)) {
                            textSpanElement.textContent = newText;
                            linkElement.title = (index + 1) + '. ' + newText;
                        }
                    });
                }
            }, NAV_UPDATE_TEXT_DELAY);

            // 如果元素存在，执行滚动
            if (targetEl && document.body.contains(targetEl)) {
                targetEl.scrollIntoView({block: 'start'});
                clickedTarget = targetEl;
                clickLockUntil = Date.now() + NAV_CLICK_LOCK_DURATION;
                clearAllHighlights();
                setLinkStyle(linkContainer, true);
                // 自动显示当前点击项对应的副目录
                if (typeof autoShowSubNav === 'function') {
                    autoShowSubNav(i);
                }
            } else {
                // 元素不存在，等待一段时间后重试
            }
        };
    };

    // 创建导航链接元素
    const createNavLink = (el, i, preservedText) => {
        // 创建链接容器
        const linkContainer = createTag('div', "", NAV_STYLES.linkContainer);
        linkContainer.className = 'tool-nav-link-container';

        // 创建副目录小图标
        const subNavIcon = createTag('span', '📖', NAV_STYLES.waveIcon);
        subNavIcon.title = '显示副目录';
        subNavIcon.addEventListener('mouseenter', () => {
            subNavIcon.style.cssText = NAV_STYLES.waveIcon + NAV_STYLES.waveIconHover;
        });
        subNavIcon.addEventListener('mouseleave', () => {
            subNavIcon.style.cssText = NAV_STYLES.waveIcon + NAV_STYLES.waveIconNormal;
        });
        subNavIcon.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();

            // 如果当前已经显示该问题的副目录，则隐藏
            if (currentSubNavQuestionIndex === i && subNavBar.style.display === 'block') {
                hideSubNavBar();
                return;
            }

            // 查找问题对应的回答内容区域
            let targetEl = el;
            if (!targetEl || !document.body.contains(targetEl)) {
                const questions = getQuestionList();
                if (questions && questions.length > i) {
                    targetEl = questions[i];
                }
            }

            if (!targetEl) {
                console.warn('问题元素不存在');
                return;
            }

            // 查找回答内容区域
            const answerContent = findAnswerContent(targetEl);
            if (!answerContent) {
                console.log('未找到回答内容区域');
                return;
            }

            // 查找标题
            const headings = findHeadingsInContent(answerContent);
            if (headings.length === 0) {
                console.log('未找到h2~h4标题');
                return;
            }

            // 清除关闭状态（恢复副目录）
            setSubNavClosed(false);

            // 显示副目录栏
            showSubNavBar(i, headings);
        });

        // 创建链接内容
        const link = createTag('div', "", NAV_STYLES.link);
        link.className = 'tool-nav-link';

        const indexText = (i + 1) + '. ';
        const indexSpan = createTag('span', indexText, "");
        indexSpan.style.color = NAV_ITEM_COLOR;

        // 先获取新文本，如果新文本非空则使用新文本，否则使用保留文本
        const newText = normalizeQuestionText(el.textContent);
        const normalizedText = (newText && newText.length > 0) ? newText : (preservedText || newText);
        const textSpan = createTag('span', normalizedText, "");

        link.title = (i + 1) + '. ' + normalizedText;
        appendSeveral(link, indexSpan, textSpan);

        // 事件监听
        link.addEventListener('mouseenter', () => link.style.backgroundColor = '#f0f0f0');
        link.addEventListener('mouseleave', () => link.style.backgroundColor = '');
        link.addEventListener('click', handleNavLinkClick(el, i, linkContainer));

        // 组装链接容器
        appendSeveral(linkContainer, subNavIcon, link);

        return linkContainer;
    };

    // 创建导航栏标题元素（包含隐藏按钮）
    const createTitle = () => {
        const title = createTag('div', "", NAV_STYLES.title);

        const titleText = createTag('span', '主目录', "");

        const hideBtn = createTag('span', '隐藏', NAV_STYLES.hideBtn);
        hideBtn.addEventListener('mouseenter', () => hideBtn.style.backgroundColor = '#f5f5f5');
        hideBtn.addEventListener('mouseleave', () => hideBtn.style.backgroundColor = '');
        hideBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            setNavMinimized(true);
        });

        // 创建条数显示元素
        navCountText = createTag('span', "", NAV_STYLES.countText);
        navCountText.style.display = 'none'; // 默认隐藏

        appendSeveral(title, titleText, hideBtn, navCountText);
        return title;
    };

    // 初始化 IntersectionObserver
    const initIntersectionObserver = () => {
        try {
            navIO = new IntersectionObserver((entries) => {
                const now = Date.now();
                let nextEl = null;

                // 点击锁定期内，优先使用点击的目标
                if(now < clickLockUntil && clickedTarget) {
                    const rect = clickedTarget.getBoundingClientRect?.();
                    const nearTop = isElementNearTop(rect);
                    const inView = isElementVisible(rect, NAV_VIEWPORT_THRESHOLD);
                    if(inView || nearTop) nextEl = clickedTarget;
                }

                // 新的高亮逻辑
                if(!nextEl) {
                    // 找到所有可见的目录项，按位置排序
                    const visibleElements = getVisibleElements(navQuestions, 1.0); // 使用100%视口高度

                    if(visibleElements.length > 0) {
                        // 检查第一个可见元素的位置
                        const firstVisibleEl = visibleElements[0];
                        const rect = firstVisibleEl.getBoundingClientRect();
                        const positionPercent = getElementPositionPercent(rect);

                        // 根据位置决定高亮项
                        if(positionPercent >= 0 && positionPercent <= NAV_HIGHLIGHT_THRESHOLD) {
                            // 0~30%：高亮当前项
                            nextEl = firstVisibleEl;
                        } else if(positionPercent > NAV_HIGHLIGHT_THRESHOLD && positionPercent <= 1.0) {
                            // 30%~100%：高亮前一项
                            const currentIndex = navQuestions.indexOf(firstVisibleEl);
                            if(currentIndex > 0) {
                                nextEl = navQuestions[currentIndex - 1];
                            } else {
                                nextEl = firstVisibleEl; // 如果是第一项，仍然高亮自己
                            }
                        }
                    } else {
                        // 视野无任何目录，保持上次高亮项（不改变nextEl）
                        // 这样navLinks会保持之前的状态
                        return;
                    }
                }

                // 应用高亮
                navLinks.forEach((link, i) => setLinkStyle(link, navQuestions[i] === nextEl));
                // 自动显示当前高亮项对应的副目录
                if (nextEl && typeof autoShowSubNav === 'function') {
                    const activeIndex = navQuestions.indexOf(nextEl);
                    if (activeIndex >= 0) {
                        autoShowSubNav(activeIndex);
                    }
                }
            }, { root: null, rootMargin: '0px 0px -70% 0px', threshold: [0, 0.1, 0.5, 1] });

            navQuestions.forEach(el => {
                if(el?.tagName) try { navIO.observe(el); } catch(e) {}
            });
        } catch(e) {}
    };

    // 从主目录栏链接容器中获取实质内容文本
    const getStudioNavLinkText = (linkContainer) => {
        if(!linkContainer) return null;
        const link = linkContainer.querySelector('.tool-nav-link');
        if(!link) return null;
        const spans = link.querySelectorAll('span');
        if(spans.length < 2) return null;
        const textSpan = spans[1]; // 第二个 span 是文本内容
        const normalizedText = normalizeQuestionText(textSpan.textContent);
        return (normalizedText && normalizedText.length > 0) ? normalizedText : null;
    };

    // 检查 STUDIO 站点主目录栏中所有链接的 span 是否都有实质内容
    const checkStudioNavContent = () => {
        return navLinks.length > 0 && navLinks.every(linkContainer => {
            return getStudioNavLinkText(linkContainer) !== null;
        });
    };

    // 获取主目录栏中第一个有实质内容的链接文本
    const getFirstStudioNavLinkText = () => {
        if(!navLinks || navLinks.length === 0) return null;
        for (let i = 0; i < navLinks.length; i++) {
            const text = getStudioNavLinkText(navLinks[i]);
            if(text) return text;
        }
        return null;
    };

    // 保存 STUDIO 站点旧链接中有实质内容的文本
    const preserveStudioNavTexts = () => {
        const preservedTexts = [];
        const currentUrl = getUrl();
        // 如果 URL 变化了，清空保留的文本，不保存旧文本
        if(navLinks.length > 0) {
            // 检查 URL 是否变化
            if(preservedNavTextsUrl !== null && preservedNavTextsUrl !== currentUrl) {
                preservedNavTextsUrl = null;
                // URL 变化了，不保存旧文本，preservedTexts 保持为空数组
            } else {
                // URL 未变化，保存旧文本
                navLinks.forEach((linkContainer, i) => {
                    preservedTexts[i] = getStudioNavLinkText(linkContainer);
                });
                // 保存当前的 URL
                preservedNavTextsUrl = currentUrl;
            }
        }
        return preservedTexts;
    };

    // 获取 STUDIO 站点保留的文本（用于创建链接时）
    const getPreservedTextForStudio = (preservedTexts, index) => {
        const urlWhenUsing = getUrl();
        return (preservedNavTextsUrl === urlWhenUsing && preservedTexts[index]) ? preservedTexts[index] : null;
    };

    // 更新导航问题列表（重新构建导航栏）
    const updateNavQuestions = (quesList) => {
        if(isEmpty(quesList)) {
            navBar.replaceChildren();
            navBar.style.visibility = navMiniButton.style.visibility = "hidden";
            currentNavBarUrl = null; // 清空时也重置 URL 跟踪
            updateNavCount(); // 更新条数显示
            return;
        }

        const thisQuestions = Array.from(quesList);
        const currentUrl = getUrl();
        // 检查 URL 是否变化（使用 currentNavBarUrl 来检测，即使 preservedNavTextsUrl 为 null 也能检测到）
        const urlChanged = currentNavBarUrl !== null && currentNavBarUrl !== currentUrl;
        // 页面切换时旧目录元素会被卸载，发现断连则强制重建
        const navHasDetached = navQuestions?.some(el => el && !el.isConnected);

        if(navQuestions
            && !navHasDetached
            && thisQuestions.length === navQuestions.length
            && normalizeQuestionText(thisQuestions[0].textContent) === normalizeQuestionText(navQuestions[0].textContent)) {

            // 非 STUDIO 站点保持原有逻辑，直接返回（除非 URL 变化）
            if(site !== STUDIO) {
                if(!urlChanged) {
                    refreshNavBarVisibility();
                    return;
                }
                // URL 变化了，继续执行后续流程
            } else {
                // STUDIO 站点：检查主目录栏中所有链接的 span 是否都有实质内容
                const hasSubstantialContent = checkStudioNavContent();

                // 如果有实质内容且 URL 未变化，则直接返回；否则继续执行后续流程
                if(hasSubstantialContent && !urlChanged) {
                    refreshNavBarVisibility();
                    return;
                }
            }
        }

        // 对于 STUDIO 站点，保存旧链接中有实质内容的文本
        const preservedTexts = site === STUDIO ? preserveStudioNavTexts() : [];

        navBar.replaceChildren();
        navLinks = [];
        elToLink.clear();
        if(navIO) try { navIO.disconnect(); } catch(e) {}

        // 更新当前导航栏对应的 URL
        currentNavBarUrl = currentUrl;

        navBar.appendChild(createTitle());
        navQuestions = thisQuestions;

        navQuestions.forEach((el, i) => {
            if(!el?.tagName) return;
            // 如果有保留的文本且 URL 未变化，则使用保留的文本；否则不使用
            const preservedText = site === STUDIO ? getPreservedTextForStudio(preservedTexts, i) : null;
            const link = createNavLink(el, i, preservedText);
            navBar.appendChild(link);
            navLinks.push(link);
            elToLink.set(el, link);
        });

        refreshNavBarVisibility();
        initIntersectionObserver();

        // 页面刚加载时，如果视野里没有任何目录项，则自动高亮最后一项
        setTimeout(() => {
            const visibleElements = getVisibleElements(navQuestions, 1.0);

            if(visibleElements.length === 0 && navLinks.length > 0) {
                // 视野无任何目录项，高亮最后一项
                clearAllHighlights();
                setLinkStyle(navLinks[navLinks.length - 1], true);
                // 自动显示最后一项对应的副目录
                if (typeof autoShowSubNav === 'function') {
                    autoShowSubNav(navLinks.length - 1);
                }
            }
        }, 100);
    };

    // 迷你按钮事件
    navMiniButton.addEventListener('click', (e) => {
        e.stopPropagation();
        setNavMinimized(false);
    });

    /******************************************************************************
     * ═══════════════════════════════════════════════════════════════════════
     * ║                                                                      ║
     * ║  🎛️ 10、多选面板  🎛️                                                  ║
     * ║                                                                      ║
     * ═══════════════════════════════════════════════════════════════════════
     ******************************************************************************/

    // 面板样式集中定义
    const PANEL_STYLES = {
        // 固定多选面板宽度（同时保留高度自适应）
        panel: `z-index:100000;cursor:pointer;position:fixed;right:10px;bottom:110px;max-height:450px;width:calc(${PANEL_COLUMN_WIDTH} * 2 + 110px);background:white;border:1px solid #ddd;border-radius:8px;box-shadow:0 4px 12px rgba(0,0,0,0.1);overflow-y:auto;padding:6px 4px;display:flex;flex-direction:column;align-items:flex-start;`,
        panelCompact: `width:auto;padding-top:0px;padding-bottom:0px;`,
        buttonContainer: `display:flex;align-items:center;gap:16px;width:calc(${PANEL_BUTTON_WIDTH} + ${PANEL_BUTTON_WIDTH} + ${PANEL_BUTTON_WIDTH} + ${PANEL_BUTTON_WIDTH} + 24px);margin-bottom:10px;margin-top:2px`,
        buttonBase: `display:inline-flex;align-items:center;justify-content:center;text-align:center;color:white;border:none;border-radius:6px;padding:4px 6px;font-size:14px;cursor:pointer;width:${PANEL_BUTTON_WIDTH};height:36px;flex-shrink:0;`,
        disable: `background:#ec7258;`,
        settingsBtn: `background:#667eea;`,
        newChatBtn: `background:#48bb78;`,
        // 全选、清空按钮尺寸更紧凑，且使用单独宽度，高度自适应
        selectAllBtn: `background:#3498db;width:${PANEL_SMALL_BUTTON_WIDTH};padding:3px 6px;font-size:12px;height:auto;`,
        clearBtn: `background:#95a5a6;width:${PANEL_SMALL_BUTTON_WIDTH};padding:3px 6px;font-size:12px;height:auto;`,
        addCombinationBtn: `background:#48bb78;margin:6px 2px;height:auto;width:auto`,
        // 组合按钮基础样式：宽度自适应，不使用固定 PANEL_BUTTON_WIDTH
        combinationBtnBase: `text-align:center;color:white;border:none;border-radius:6px;padding:4px 6px;font-size:13px;cursor:pointer;width:auto;flex-shrink:1;`,
        // 组合按钮：宽度自适应，不使用固定 PANEL_BUTTON_WIDTH
        combinationBtn: `background:transparent;border:1px solid #ddd;margin:2px;padding:4px 8px;font-size:12px;min-width:40px;white-space:nowrap;position:relative;`,
        deleteBtn: `position:absolute;top:-6px;right:-6px;width:16px;height:16px;background:#ff4444;border-radius:50%;border:none;color:white;font-size:10px;line-height:1;cursor:pointer;display:none;z-index:10;padding:0;text-align:center;box-shadow:0 2px 4px rgba(0,0,0,0.2);`,
        combinationContainer: `display:flex;flex-wrap:wrap;gap:4px;width:100%;margin-top:4px;`,
        item: `display:flex;align-items:center;padding:4px 0 4px 4px;border-bottom:1px solid #eee;`,
        itemCompact: `display:flex;align-items:center;justify-content:center;padding:4px;`,
        iconImg: `width:16px;height:16px;margin-right:6px;flex-shrink:0;vertical-align:middle;`,
        iconImgCompact: `width:16px;height:16px;flex-shrink:0;vertical-align:middle;`,
        iconImgCombination: `width:16px;height:16px;margin:0 2px;flex-shrink:0;vertical-align:middle;`,
        wordSpan: `flex:1;margin-right:8px;font-size:14px;line-height:16px;display:flex;align-items:center;`,
        wordSpanCompact: `font-size:14px;line-height:16px;display:flex;align-items:center;`,
        checkbox: `margin-right:4px;font-size:18px;`,
        emptyMessage: `padding:8px;text-align:center;color:#888;font-size:14px;`,
        headline: `font-weight:bold;font-size:15px;margin-bottom:4px;`,
        modelColumns: `display:flex;gap:25px;align-items:flex-start;`,
        modelColumn: `width:${PANEL_COLUMN_WIDTH};flex-shrink:0;`,
        modelListWithButtons: `display:flex;gap:12px;align-items:flex-start;width:100%;`,
        selectClearContainerVertical: `display:flex;flex-direction:column;gap:6px;flex-shrink:0;`,
        groupMenuWrapper: `position:relative;display:inline-block;`,
        groupMenu: `display:none;flex-direction:column;gap:6px;position:fixed;min-width:60px;max-width:240px;max-height:260px;overflow:auto;background:#fff;border:1px solid #ddd;border-radius:6px;padding:6px;box-shadow:0 4px 12px rgba(0,0,0,0.12);z-index:10000;`,
        groupMenuBtn: `background:#48bb78;color:#fff;border:none;border-radius:4px;padding:6px 8px;text-align:left;font-size:14px;cursor:pointer;white-space:nowrap;position:relative;`,
        groupMenuEmpty: `padding:6px 4px;color:#666;font-size:14px;white-space:nowrap;`
    };

    // 面板数据
    const contentContainer = createTag('div', "", "");
    let isCompactMode = false;
    let isSettingsPopupOpen = false;
    let originalHTML = contentContainer.innerHTML;

    // 创建面板容器
    panel.style.cssText = PANEL_STYLES.panel;
    panel.id = TOOL_PANEL_ID;

    const DISABLE = "禁用";
    const ENABLE = "开启";
    const DISABLED_ICON = "🚫";
    const ENABLED_ICON = "🟢";

    // 创建禁用按钮
    let disable = createTag('button', DISABLE, PANEL_STYLES.buttonBase + PANEL_STYLES.disable);
    disable.id = "tool-disable";
    disable.addEventListener('click', (e) => disableEvent(e));
    disable.addEventListener('mouseenter', () => disable.style.opacity = '0.85');
    disable.addEventListener('mouseleave', () => disable.style.opacity = '1');
    disable.title = SYNC_SWITCH_TITLE;
    syncToggleDisableButton();

    const settingsBtn = createSettingsButton();
    const newChatBtn = createNewChatButton();
    const groupedNewChatBtn = createGroupedNewChatButton();
    const pinBtn = createPinButton();

    // 根据GM变量设置按钮初始显示状态（默认不显示）
    const showGroupedButtons = getGV(SHOW_GROUPED_BUTTONS_KEY) === true;
    // 分组新对话按钮返回的是wrapper，需要控制wrapper的显示
    if (groupedNewChatBtn) {
        groupedNewChatBtn.style.display = showGroupedButtons ? '' : 'none';
    }
    pinBtn.style.display = showGroupedButtons ? '' : 'none';

    // 创建按钮容器
    const buttonContainer = createTag('div', "", PANEL_STYLES.buttonContainer);
    appendSeveral(buttonContainer, disable, settingsBtn, newChatBtn, groupedNewChatBtn, pinBtn);

    // 创建全选和清空按钮
    const selectAllBtn = createTag('button', '全选', PANEL_STYLES.buttonBase + PANEL_STYLES.selectAllBtn);
    selectAllBtn.id = 'tool-select-all';
    selectAllBtn.title = '全选所有可见模型';
    selectAllBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        selectAllModels();
    });
    selectAllBtn.addEventListener('mouseenter', () => selectAllBtn.style.opacity = '0.85');
    selectAllBtn.addEventListener('mouseleave', () => selectAllBtn.style.opacity = '1');

    const clearBtn = createTag('button', '清空', PANEL_STYLES.buttonBase + PANEL_STYLES.clearBtn);
    clearBtn.id = 'tool-clear';
    clearBtn.title = '清空所有已选模型';
    clearBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        clearAllModels();
    });
    clearBtn.addEventListener('mouseenter', () => clearBtn.style.opacity = '0.85');
    clearBtn.addEventListener('mouseleave', () => clearBtn.style.opacity = '1');

    // 创建全选/清空按钮容器（垂直排列，用于放在模型列表右侧）
    const selectClearContainer = createTag('div', "", PANEL_STYLES.selectClearContainerVertical);
    appendSeveral(selectClearContainer, selectAllBtn, clearBtn);

    // 创建"添加常用组合"按钮
    const addCombinationBtn = createTag('button', '保存勾选组合 📌', PANEL_STYLES.buttonBase + PANEL_STYLES.addCombinationBtn);
    addCombinationBtn.id = 'tool-add-combination';
    addCombinationBtn.title = '保存当前勾选的模型组合，后续可一键勾选此组合';
    // 检查GM存储中的状态，如果已点击过就只显示emoji并自适应宽度
    if (getGV(ADD_COMBINATION_BUTTON_CLICKED_KEY)) {
        addCombinationBtn.textContent = '📌';
        addCombinationBtn.style.width = 'auto';
        addCombinationBtn.style.flexShrink = '1';
    }
    addCombinationBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        saveCurrentCombination();
        // 点击后只保留emoji并自适应宽度
        addCombinationBtn.textContent = '📌';
        addCombinationBtn.style.width = 'auto';
        addCombinationBtn.style.flexShrink = '1';
        // 保存状态到GM存储
        setGV(ADD_COMBINATION_BUTTON_CLICKED_KEY, true);
    });
    addCombinationBtn.addEventListener('mouseenter', () => addCombinationBtn.style.opacity = '0.85');
    addCombinationBtn.addEventListener('mouseleave', () => addCombinationBtn.style.opacity = '1');

    // 创建组合按钮容器
    const combinationContainer = createTag('div', "", PANEL_STYLES.combinationContainer);
    combinationContainer.id = 'combination-container';

    // 根据word在words数组中的索引获取背景色
    const getItemBgColor = (word) => {
        const index = typeof word === 'number' ? word : words.indexOf(word);
        return index < MODEL_GROUP_INDEX ? '#fffcf0' : '#fffcf0';
    };

    /**
     * 将图标URL转换为base64并保存（使用Image+Canvas方式）
     */
    function convertIconUrlToBase64(iconUrl, iconKey, siteId, logMessage) {
        const img = new Image();
        img.crossOrigin = 'anonymous';
        img.onload = function() {
            try {
                const canvas = document.createElement('canvas');
                let sourceX = 0, sourceY = 0, sourceWidth = img.width, sourceHeight = img.height;

                let cropRatio = 1;
                // 如果是某些站点的图标，进行80%裁切（保留中心80%区域）
                if ([CLAUDE, DEEPSEEK, DOUBAO].includes(siteId)) {
                    cropRatio = 0.8; // 80%
                } else if ([GEMINI].includes(siteId)) {
                    cropRatio = 0.9; // 90%
                }

                const cropOffset = (1 - cropRatio) / 2; // 10%
                sourceX = img.width * cropOffset;
                sourceY = img.height * cropOffset;
                sourceWidth = img.width * cropRatio;
                sourceHeight = img.height * cropRatio;

                canvas.width = sourceWidth;
                canvas.height = sourceHeight;
                const ctx = canvas.getContext('2d');
                ctx.drawImage(img, sourceX, sourceY, sourceWidth, sourceHeight, 0, 0, sourceWidth, sourceHeight);
                const base64DataUri = canvas.toDataURL('image/png');
                setGV(iconKey, base64DataUri);
                console.log(logMessage || `站点图标已保存(base64): site=${siteId}`);
            } catch (error) {
                console.error(`转换图标为base64失败: site=${siteId}`, error);
            }
        };
        img.onerror = function(error) {
            console.error(`加载图标失败: site=${siteId}`, error);
        };
        img.src = iconUrl;
    }

    /**
     * 创建站点图标元素（复用函数）
     * @param {string} word - 模型名称
     * @param {string} iconStyle - 图标样式（展开模式或缩略模式）
     * @returns {HTMLElement|null} 图标元素，如果没有图标则返回null
     */
    function createSiteIcon(word, iconStyle) {
        const siteId = wordToSite[word];
        if (siteId === undefined || siteId === null) {
            return null;
        }

        const iconKey = SITE_ICON_KEY_PREFIX + siteId;
        const iconBase64 = getGV(iconKey);

        if (!iconBase64) {
            return null;
        }

        const iconImg = document.createElement('img');
        iconImg.src = iconBase64;
        iconImg.style.cssText = iconStyle;
        iconImg.alt = word;
        iconImg.onerror = function() {
            // 图标加载失败时隐藏图标
            this.style.display = 'none';
        };
        return iconImg;
    }

    /**
     * 创建单个面板项
     */
    function createPanelItem(word, selectedSites) {
        const originalIndex = words.indexOf(word);
        const item = createTag('div', "", PANEL_STYLES.item + `background:${getItemBgColor(originalIndex)};`);
        item.className = 'panel-item';
        item.dataset.word = word;

        // 创建元素数组，用于 appendSeveral
        const elements = [];

        // 如果有图标URL，创建图标元素
        const iconImg = createSiteIcon(word, PANEL_STYLES.iconImg);
        if (iconImg) {
            elements.push(iconImg);
        }

        const wordSpan = createTag('span', word, PANEL_STYLES.wordSpan);
        elements.push(wordSpan);

        const checkbox = createTag('input', "", PANEL_STYLES.checkbox);
        checkbox.type = 'checkbox';
        checkbox.id = `word-${word}`;
        checkbox.checked = selectedSites.includes(wordToSite[word]);

        checkbox.addEventListener('change', () => updateStorageSites(word));

        item.addEventListener('click', (e) => {
            if (e.target.tagName === 'INPUT') {
                return;
            }
            e.stopPropagation();
            checkbox.checked = !checkbox.checked;
            updateStorageSites(word);
        });

        elements.push(checkbox);
        appendSeveral(item, ...elements);
        return item;
    }

    /**
     * 创建设置按钮
     */
    function createSettingsButton() {
        const btn = createTag('button', '设置', PANEL_STYLES.buttonBase + PANEL_STYLES.settingsBtn);
        btn.id = 'tool-settings';
        btn.addEventListener('click', (e) => {
            e.stopPropagation();
            showSettingsPopup();
        });
        btn.addEventListener('mouseenter', () => btn.style.opacity = '0.85');
        btn.addEventListener('mouseleave', () => btn.style.opacity = '1');
        return btn;
    }

    /**
     * 创建新对话按钮
     */
    function createNewChatButton() {
        const btn = createTag('button', '新对话', PANEL_STYLES.buttonBase + PANEL_STYLES.newChatBtn);
        btn.id = 'tool-new-chat';
        btn.title = '对于已勾选且已打开的站点，将批量跳转到新对话页面';
        btn.addEventListener('click', (e) => {
            e.stopPropagation();
            jumpToNewChat();
        });
        btn.addEventListener('mouseenter', () => btn.style.opacity = '0.85');
        btn.addEventListener('mouseleave', () => btn.style.opacity = '1');
        return btn;
    }


    /**
     * 渲染面板内容（公共函数，用于初始化和刷新）
     */
    function renderPanelContent() {
        const selectedSites = getSitesAndCurrent();
        const visibleSites = getVisibleModels();
        const visibleWords = visibleSites.map(site => siteToWord[site]).filter(word => word);

        // 以MODEL_GROUP_INDEX为界，将模型列表分为两列
        const firstGroupWords = visibleWords.filter((word, index) => {
            const originalIndex = words.indexOf(word);
            return originalIndex < MODEL_GROUP_INDEX;
        });
        const secondGroupWords = visibleWords.filter((word, index) => {
            const originalIndex = words.indexOf(word);
            return originalIndex >= MODEL_GROUP_INDEX;
        });

        const firstGroupItems = firstGroupWords.map(word => createPanelItem(word, selectedSites));
        const secondGroupItems = secondGroupWords.map(word => createPanelItem(word, selectedSites));

        const headline = createTag('div', "模型列表", PANEL_STYLES.headline);

        // 创建两列容器
        const modelColumns = createTag('div', "", PANEL_STYLES.modelColumns);
        const firstColumn = createTag('div', "", PANEL_STYLES.modelColumn);
        const secondColumn = createTag('div', "", PANEL_STYLES.modelColumn);

        appendSeveral(firstColumn, ...firstGroupItems);
        appendSeveral(secondColumn, ...secondGroupItems);
        appendSeveral(modelColumns, firstColumn, secondColumn);

        // 创建模型列表和按钮的横向容器
        const modelListWithButtons = createTag('div', "", PANEL_STYLES.modelListWithButtons);
        appendSeveral(modelListWithButtons, modelColumns, selectClearContainer);

        appendSeveral(contentContainer, headline, modelListWithButtons);
        originalHTML = contentContainer.innerHTML;
    }

    // 初始化面板内容
    renderPanelContent();
    appendSeveral(panel, buttonContainer, contentContainer, addCombinationBtn, combinationContainer);

    // 加载保存的组合
    loadCombinations();

    const settingsBtnText = '设置 ⚙️';
    // 首次加载多选面板 是展开状态，后续刷新网页默认缩略状态
    if(getGV(FIRST_RUN_KEY)){
        switchToCompactMode();
    } else {
        // 如果不是第一次运行，面板保持展开状态，更新设置按钮文字
        settingsBtn.textContent = settingsBtnText;
    }

    // 面板相关函数
    function disableEvent(event){
        event.stopPropagation();
        // 使用存储的状态或原始文字判断，而不是textContent（缩略模式下是符号）
        const isCurrentlyDisabled = getGV("disable");
        const originalText = disable.dataset.originalText || disable.textContent;
        if(originalText === DISABLE || !isCurrentlyDisabled){
            changeDisable(true);
        }else{
            changeDisable(false);
        }
    }

    function syncToggleDisableButton(baseText = SYNC_SWITCH_TITLE, stateIcon = ''){
        if(!toggleDisableButton){
            return;
        }
        // 只显示状态图标，保持固定宽度不随文字变化
        toggleDisableButton.textContent = stateIcon || ENABLED_ICON;
    }

    // 统一更新禁用按钮的文案和 emoji
    function updateDisableButtonLabel(isDisabled){
        // 文案仍然表示下一步操作：禁用 / 开启
        const baseText = isDisabled ? ENABLE : DISABLE;
        // 始终保留纯文字，供点击事件判断使用
        disable.dataset.originalText = baseText;

        const stateIcon = isDisabled ? DISABLED_ICON : ENABLED_ICON;
        if(isCompactMode){
            // 缩略模式：仅展示当前状态对应的图标
            disable.textContent = isDisabled ? DISABLED_ICON : ENABLED_ICON;
        }else{
            // 展开模式：按钮文字 + 当前状态对应的 emoji
            disable.textContent = `${baseText} ${stateIcon}`;
        }
        syncToggleDisableButton(baseText, stateIcon);
    }

    // 使用 CSS 滤镜整体控制多选面板启用/禁用的视觉效果
    function changeDisable(status){
        if(status === true){
            setGV("disable", true);
            updateDisableButtonLabel(true);
            // 简略模式下不显示背景色
            disable.style.background = isCompactMode ? "transparent" : "#f5a088";
            contentContainer.style.color = "lightgray";
            contentContainer.style.filter = "grayscale(100%)";
            contentContainer.style.opacity = "0.5";
            // 禁用状态下，缩略模式的背景色改为白色
            if(isCompactMode){
                const items = contentContainer.querySelectorAll('[data-word]');
                items.forEach(item => {
                    item.style.background = "white";
                });
            }
        }else{
            setGV("disable", false);
            updateDisableButtonLabel(false);
            // 简略模式下不显示背景色
            disable.style.background = isCompactMode ? "transparent" : "#ec7258";
            contentContainer.style.color = "black";
            contentContainer.style.filter = "";
            contentContainer.style.opacity = "1";
            // 恢复启用状态，缩略模式的背景色恢复为彩色
            if(isCompactMode){
                const items = contentContainer.querySelectorAll('[data-word]');
                items.forEach(item => {
                    const word = item.dataset.word;
                    item.style.background = getItemBgColor(word);
                });
            }
        }
    }

    // 全选所有可见模型
    function selectAllModels() {
        changeDisable(false);
        const visibleSites = getVisibleModels();
        const visibleWords = visibleSites.map(site => siteToWord[site]).filter(word => word);
        const selectedSites = visibleWords.map(word => wordToSite[word]);
        setGV(CHOSEN_SITE, selectedSites);

        visibleWords.forEach(word => {
            const checkbox = document.getElementById(`word-${word}`);
            if (checkbox) {
                checkbox.checked = true;
            }
        });

        updateBoxFromStorage();
        if (isCompactMode) {
            reloadCompactMode();
        }
    }

    // 清空所有已选模型（取消所有复选框的勾选状态）
    function clearAllModels() {
        changeDisable(false);

        const visibleSites = getVisibleModels();
        const visibleWords = visibleSites.map(site => siteToWord[site]).filter(word => word);
        visibleWords.forEach(word => {
            const checkbox = document.getElementById(`word-${word}`);
            if (checkbox) {
                checkbox.checked = false;
            }
        });

        // 根据复选框状态更新存储
        getSitesFromDomAndSave();

        if (isCompactMode) {
            reloadCompactMode();
        }
    }

    // 从前端DOM获取面板被选中的元素，并存储
    function getSitesFromDomAndSave(){
        const checkboxes = document.querySelectorAll('input[type="checkbox"][id^="word-"]');
        const selectedSites = [];

        checkboxes.forEach(checkbox => {
            if (checkbox.checked) {
                const word = checkbox.id.split('-')[1]; // 提取选中的文本
                selectedSites.push(wordToSite[word]);
            }
        });
        setGV(CHOSEN_SITE, selectedSites);
        return selectedSites;
    };

    // 从存储获取已选站点
    function getSitesOfStorage(){
        try {
            return getGV(CHOSEN_SITE) || [];
        } catch (e) {
            console.error('Failed to parse selectedSites from GV', e);
            return [];
        }
    };

    function getSitesAndCurrent() {
        let sitesOfStorage = getSitesOfStorage();
        if(!sitesOfStorage.includes(site)){
            sitesOfStorage.unshift(site);
        }
        return sitesOfStorage;
    };
    function addCurrentToStorage() {
        let sitesOfStorage = getSitesOfStorage();
        if(!sitesOfStorage.includes(site)){
            sitesOfStorage.unshift(site);
            setGV(CHOSEN_SITE, sitesOfStorage);
        }
    };

    function getSitesExcludeCurrent() {
        let sitesOfStorage = getSitesOfStorage();
        if(sitesOfStorage.includes(site)){
            sitesOfStorage = sitesOfStorage.filter(element => element !== site);
        }
        return sitesOfStorage;
    };

    // 更新存储中的已选单词数字
    function updateStorageSites(word) {
        // 只要有勾选动作，就关闭禁用模式
        changeDisable(false);

        const visibleSites = getVisibleModels();
        const visibleWords = visibleSites.map(site => siteToWord[site]).filter(word => word);
        const selectedSites = visibleWords
            .filter(word => document.getElementById(`word-${word}`)?.checked)
            .map(word => wordToSite[word]);

        setGV(CHOSEN_SITE, selectedSites);
        console.log('Current selected sites:', selectedSites);

        let isDisable = getGV("disable");
        if(isDisable){
            return;
        }
        const siteOfWord = wordToSite[word];
        if (siteOfWord !== site && selectedSites.includes(siteOfWord)) {
            const targetUrl = newSites[siteOfWord];
            if (!isEmpty(targetUrl)) {
                const targetPath = extractUrlPath(targetUrl);
                jumpToSite({ site: siteOfWord, url: targetPath });
            }
        }
    };

    // 存储-->复选框
    function updateBoxFromStorage() {
        const selectedSites = getSitesAndCurrent();
        // console.log('Syncing checkboxes from stoage:', selectedSites);

        const visibleSites = getVisibleModels();
        const visibleWords = visibleSites.map(site => siteToWord[site]).filter(word => word);
        visibleWords.forEach(word => {
            const checkbox = document.getElementById(`word-${word}`);
            if (checkbox) {
                checkbox.checked = selectedSites.includes(wordToSite[word]);
            }
        });
    };

    // zchat特殊处理
    if(site === ZCHAT){
        let lastVisibleState = false; // 记录上一次的可见状态
        const observer = new IntersectionObserver((entries, instance) => {
            entries.forEach(entry => {
                const isCurrentlyVisible = entry.isIntersecting;
                // 状态发生变化时触发逻辑
                if (lastVisibleState === true && isCurrentlyVisible === false) {
                    document.body.appendChild(panel);
                    instance.unobserve(entry.target); // 停止观察当前元素
                }
                lastVisibleState = isCurrentlyVisible; // 更新状态记录
            });
        }, {
            threshold: 0.1 // 阈值可根据需求调整
        });
        observer.observe(panel);
    }

    // 刷新简略模式
    function reloadCompactMode(){
        if (!isCompactMode) return;

        // 确保按钮状态正确
        buttonContainer.style.display = 'none';
        selectClearContainer.style.display = 'none';
        addCombinationBtn.style.display = 'none';
        combinationContainer.style.display = 'none';
        // 如果disable在buttonContainer中，先移除
        if (buttonContainer.contains(disable)) {
            disable.remove();
        }
        if (!panel.contains(disable)) {
            panel.insertBefore(disable, contentContainer);
        }
        disable.style.display = 'block';
        // 缩略模式下减小按钮宽度，只显示图标或符号
        disable.style.width = PANEL_DISABLE_BUTTON_COMPACT_WIDTH;
        disable.style.minWidth = PANEL_DISABLE_BUTTON_COMPACT_WIDTH;
        disable.style.maxWidth = PANEL_DISABLE_BUTTON_COMPACT_WIDTH;
        disable.style.padding = '0px';
        // 文案与 emoji 统一由 changeDisable 控制
        let selectedSites = getSitesAndCurrent();
        let selectedWords = selectedSites.map(site => siteToWord[site]).filter(word => word);
        // 按照可见模型列表的顺序排序
        const visibleSites = getVisibleModels();
        const visibleWords = visibleSites.map(site => siteToWord[site]).filter(word => word);
        selectedWords = visibleWords.filter(word => selectedWords.includes(word));
        drawCompactPanel(selectedWords);

        reloadDisableStatus();
    }

    function reloadDisableStatus(){
        let isDisable = getGV("disable");
        let status = isDisable ? true : false;
        changeDisable(status);
    }

    // 切换到简略模式
    function switchToCompactMode(){
        if (isCompactMode) return;
        // 先按展开模式刷新一次，保证整体状态正确
        reloadDisableStatus();

        // 保存原始内容
        originalHTML = contentContainer.innerHTML;

        // 记录选中的项：优先从DOM读取，如果读取不到则从存储读取
        const visibleSites = getVisibleModels();
        const visibleWords = visibleSites.map(site => siteToWord[site]).filter(word => word);
        let selectedWords = visibleWords.filter(word =>
            document.getElementById(`word-${word}`)?.checked
        );

        // 如果从DOM读取不到，则从存储读取（fallback机制）
        if (selectedWords.length === 0) {
            const selectedSites = getSitesAndCurrent();
            let wordsFromStorage = selectedSites.map(site => siteToWord[site]).filter(word => word);
            // 按照可见模型列表的顺序排序
            selectedWords = visibleWords.filter(word => wordsFromStorage.includes(word));
        }

        // 隐藏按钮容器，单独显示禁用按钮
        buttonContainer.style.display = 'none';
        selectClearContainer.style.display = 'none';
        addCombinationBtn.style.display = 'none';
        combinationContainer.style.display = 'none';
        // 如果disable在buttonContainer中，先移除
        if (buttonContainer.contains(disable)) {
            disable.remove();
        }
        // 将disable添加到panel顶部
        if (!panel.contains(disable)) {
            panel.insertBefore(disable, contentContainer);
        }
        disable.style.display = 'block';
        // 缩略模式下减小按钮宽度，只显示图标或符号
        disable.style.width = PANEL_DISABLE_BUTTON_COMPACT_WIDTH;
        disable.style.minWidth = PANEL_DISABLE_BUTTON_COMPACT_WIDTH;
        disable.style.maxWidth = PANEL_DISABLE_BUTTON_COMPACT_WIDTH;
        disable.style.padding = '0px';
        if (selectedWords.length === 0) {
            const emptyMsg = createTag('div', '未选模型', PANEL_STYLES.emptyMessage);
            contentContainer.replaceChildren();
            contentContainer.appendChild(emptyMsg);
        } else {
            drawCompactPanel(selectedWords);
        }

        isCompactMode = true;
        panel.style.cssText = PANEL_STYLES.panel + PANEL_STYLES.panelCompact;
        // 进入缩略模式后，再根据禁用状态刷新一次按钮文案和背景（此时 isCompactMode=true）
        reloadDisableStatus();
    };

    // 绘制缩略模式面板
    function drawCompactPanel(selectedWords){
        contentContainer.replaceChildren();

        let isDisable = getGV("disable");
        selectedWords.forEach(word => {
            // 禁用状态下使用白色背景，否则使用彩色背景
            const bgColor = isDisable ? 'white' : getItemBgColor(word);
            const item = createTag('div', "", PANEL_STYLES.itemCompact + `background:${bgColor};`);
            item.dataset.word = word;

            // 如果有图标，使用图标替换alias；否则使用alias
            const iconImg = createSiteIcon(word, PANEL_STYLES.iconImgCompact);
            if (iconImg) {
                item.appendChild(iconImg);
            } else {
            let alias = wordToAlias[word];
            const wordSpan = createTag('span', alias, PANEL_STYLES.wordSpanCompact);
            item.appendChild(wordSpan);
            }

            contentContainer.appendChild(item);
        });
    }

    /**
     * 根据sites数组生成alias组合名称
     */
    function generateCombinationName(sites) {
        const aliasList = sites
            .map(site => siteToAlias[site])
            .filter(alias => alias)
            .sort();
        return aliasList.join(', ');
    }

    /**
     * 根据sites数组生成图标组合元素
     * @param {Array<number>} sites - 站点ID数组
     * @returns {HTMLElement} 包含图标的容器元素
     */
    function createCombinationIcons(sites) {
        const container = document.createElement('div');
        container.style.cssText = 'display:inline-flex;align-items:center;gap:2px;';

        // 保持保存时的原始顺序，不排序
        sites.forEach(site => {
            const word = siteToWord[site];
            if (!word) {
                return;
            }

            const iconImg = createSiteIcon(word, PANEL_STYLES.iconImgCombination);
            if (iconImg) {
                container.appendChild(iconImg);
            } else {
                // 如果没有图标，使用alias作为fallback
                const alias = siteToAlias[site];
                if (alias) {
                    const aliasSpan = document.createElement('span');
                    aliasSpan.textContent = alias;
                    aliasSpan.style.cssText = 'font-size:11px;margin:0 1px;color:#333;font-size:14px';
                    container.appendChild(aliasSpan);
                }
            }
        });

        return container;
    }

    /**
     * 保存当前勾选的模型组合
     */
    function saveCurrentCombination() {
        const selectedSites = getSitesFromDomAndSave();
        if (selectedSites.length === 0) {
            alert('请先勾选至少一个模型');
            return;
        }

        // 获取已保存的组合
        let combinations = getGV(COMMON_COMBINATIONS_KEY) || [];
        if (!Array.isArray(combinations)) {
            combinations = [];
        }

        // 检查是否已存在相同组合（使用排序后的数组进行比较）
        const selectedSitesSorted = [...selectedSites].sort();
        const existingIndex = combinations.findIndex(combo => {
            const comboSitesSorted = [...combo].sort();
            return JSON.stringify(comboSitesSorted) === JSON.stringify(selectedSitesSorted);
        });

        if (existingIndex >= 0) {
            // 如果已存在，不重复添加
            return;
        } else {
            // 如果不存在，添加新组合（只存sites数组）
            combinations.push(selectedSites);
        }

        // 保存到存储
        setGV(COMMON_COMBINATIONS_KEY, combinations);

        // 刷新组合按钮显示
        loadCombinations();
    }

    /**
     * 删除指定索引的组合
     */
    function deleteCombination(index) {
        const combinations = getGV(COMMON_COMBINATIONS_KEY) || [];
        if (!Array.isArray(combinations) || index < 0 || index >= combinations.length) {
            return;
        }

        combinations.splice(index, 1);
        setGV(COMMON_COMBINATIONS_KEY, combinations);
        loadCombinations();
    }

    /**
     * 加载并显示保存的组合按钮
     */
    function loadCombinations() {
        const combinations = getGV(COMMON_COMBINATIONS_KEY) || [];
        if (!Array.isArray(combinations)) {
            return;
        }

        // 清空容器
        combinationContainer.replaceChildren();

        // 为每个组合创建按钮
        combinations.forEach((sites, index) => {
            if (!Array.isArray(sites) || sites.length === 0) {
                return;
            }

            // 根据sites动态生成alias组合名称（用于title提示）
            const combinationName = generateCombinationName(sites);

            const btn = createTag('button', '', PANEL_STYLES.combinationBtnBase + PANEL_STYLES.combinationBtn);
            btn.title = `点击一键勾选此组合`;

            // 创建图标组合并添加到按钮
            const iconContainer = createCombinationIcons(sites);
            btn.appendChild(iconContainer);

            // 创建删除按钮（红叉）
            const deleteBtn = createTag('button', '×', PANEL_STYLES.deleteBtn);
            deleteBtn.title = '删除组合';
            deleteBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                deleteCombination(index);
            });
            btn.appendChild(deleteBtn);

            btn.dataset.combinationIndex = index;
            btn.addEventListener('click', (e) => {
                e.stopPropagation();
                applyCombination(sites);
            });

            // 鼠标悬停显示删除按钮
            let hoverTimer = null;
            btn.addEventListener('mouseenter', () => {
                // 清除之前的定时器（如果存在）
                if (hoverTimer) {
                    clearTimeout(hoverTimer);
                }
                hoverTimer = setTimeout(() => {
                    btn.style.opacity = '0.85';
                    deleteBtn.style.display = 'block';
                    hoverTimer = null;
                }, 500);
            });
            btn.addEventListener('mouseleave', () => {
                // 清除定时器，防止延迟回调执行
                if (hoverTimer) {
                    clearTimeout(hoverTimer);
                    hoverTimer = null;
                }
                btn.style.opacity = '1';
                deleteBtn.style.display = 'none';
            });

            combinationContainer.appendChild(btn);
        });
    }

    /**
     * 应用组合（一键设置勾选状态）
     */
    function applyCombination(sites) {
        changeDisable(false);

        // 获取可见模型
        const visibleSites = getVisibleModels();
        const visibleWords = visibleSites.map(site => siteToWord[site]).filter(word => word);

        // 更新复选框状态
        visibleWords.forEach(word => {
            const checkbox = document.getElementById(`word-${word}`);
            if (checkbox) {
                const wordSite = wordToSite[word];
                checkbox.checked = sites.includes(wordSite);
            }
        });

        // 保存到存储
        const selectedSites = visibleWords
            .filter(word => {
                const checkbox = document.getElementById(`word-${word}`);
                return checkbox && checkbox.checked;
            })
            .map(word => wordToSite[word]);
        setGV(CHOSEN_SITE, selectedSites);

        // 组合点击后，确保目标站点被唤起（依赖跨页跳转监听）
        const targetSites = Array.from(new Set(sites)).filter(targetSite => targetSite !== site);
        targetSites.forEach(targetSite => {
            const targetUrl = newSites[targetSite];
            if (!isEmpty(targetUrl)) {
                const targetPath = extractUrlPath(targetUrl);
                jumpToSite({ site: targetSite, url: targetPath, jumpIfOpen: false });
            }
        });

        // 更新存储并刷新
        updateBoxFromStorage();
        if (isCompactMode) {
            reloadCompactMode();
        }
    }

    // 刷新多选面板（重新生成面板内容）
    function refreshPanel() {
        contentContainer.replaceChildren();
        renderPanelContent();

        // 如果是展开模式，确保按钮容器正确显示
        if (!isCompactMode) {
            settingsBtn.textContent = settingsBtnText;
            buttonContainer.style.display = 'flex';
            selectClearContainer.style.display = 'flex';
            addCombinationBtn.style.display = 'block';
            combinationContainer.style.display = 'flex';
            // 确保按钮容器在panel层面，在contentContainer之前
            if (!panel.contains(buttonContainer) || buttonContainer.nextSibling !== contentContainer) {
                if (panel.contains(buttonContainer)) {
                    buttonContainer.remove();
                }
                panel.insertBefore(buttonContainer, contentContainer);
            }
            // 确保contentContainer在addCombinationBtn之前
            if (!panel.contains(contentContainer) || contentContainer.nextSibling !== addCombinationBtn) {
                if (panel.contains(contentContainer)) {
                    contentContainer.remove();
                }
                panel.insertBefore(contentContainer, addCombinationBtn);
            }
            // 确保addCombinationBtn在combinationContainer之前
            if (!panel.contains(addCombinationBtn) || addCombinationBtn.nextSibling !== combinationContainer) {
                if (panel.contains(addCombinationBtn)) {
                    addCombinationBtn.remove();
                }
                panel.insertBefore(addCombinationBtn, combinationContainer);
            }
            // 确保disable在buttonContainer中
            if (!buttonContainer.contains(disable)) {
                if (panel.contains(disable)) {
                    disable.remove();
                }
                buttonContainer.insertBefore(disable, settingsBtn);
            }
        }
    }

    // 切换到原始模式
    function switchToOriginalMode() {
        if (!isCompactMode) return;

        // 显示按钮容器
        settingsBtn.textContent = settingsBtnText;
        buttonContainer.style.display = 'flex';
        selectClearContainer.style.display = 'flex';
        addCombinationBtn.style.display = 'block';
        combinationContainer.style.display = 'flex';
        // 确保按钮容器在panel层面，在contentContainer之前
        if (!panel.contains(buttonContainer) || buttonContainer.nextSibling !== contentContainer) {
            if (panel.contains(buttonContainer)) {
                buttonContainer.remove();
            }
            panel.insertBefore(buttonContainer, contentContainer);
        }
        // 确保contentContainer在addCombinationBtn之前
        if (!panel.contains(contentContainer) || contentContainer.nextSibling !== addCombinationBtn) {
            if (panel.contains(contentContainer)) {
                contentContainer.remove();
            }
            panel.insertBefore(contentContainer, addCombinationBtn);
        }
        // 确保addCombinationBtn在combinationContainer之前
        if (!panel.contains(addCombinationBtn) || addCombinationBtn.nextSibling !== combinationContainer) {
            if (panel.contains(addCombinationBtn)) {
                addCombinationBtn.remove();
            }
            panel.insertBefore(addCombinationBtn, combinationContainer);
        }
        // 确保disable在buttonContainer中
        if (!buttonContainer.contains(disable)) {
            if (panel.contains(disable)) {
                disable.remove();
            }
            buttonContainer.insertBefore(disable, settingsBtn);
        }
        // 恢复禁用按钮的原始宽度和文字（字体大小统一由 PANEL_STYLES.disable 控制）
        disable.style.width = PANEL_BUTTON_WIDTH;
        disable.style.minWidth = '';
        disable.style.maxWidth = '';
        disable.style.padding = '6px 8px';
        // 如果设定组合按钮已点击过，保持自适应宽度
        if (getGV(ADD_COMBINATION_BUTTON_CLICKED_KEY)) {
            addCombinationBtn.style.width = 'auto';
            addCombinationBtn.style.flexShrink = '1';
        }

        contentContainer.replaceChildren();
        renderPanelContent();
        updateBoxFromStorage();

        isCompactMode = false;
        panel.style.cssText = PANEL_STYLES.panel;
        // 从缩略切回展开后，立即按当前禁用状态刷新按钮文案和背景
        reloadDisableStatus();
    };

    // 点击面板切换模式
    panel.addEventListener('click', (e) => {
        // 阻止事件冒泡到document
        e.stopPropagation();

        // 如果点击的是复选框、按钮或者panel-item，不切换模式
        if (e.target.tagName === 'INPUT' ||
            e.target.tagName === 'BUTTON' ||
            e.target.id === 'tool-disable' ||
            e.target.id === 'tool-settings' ||
            e.target.id === 'tool-select-all' ||
            e.target.id === 'tool-clear' ||
            e.target.closest('.panel-item')) {
            return;
        }

        // 切换模式：缩略-->展开；展开-->缩略
        if (isCompactMode) {
            switchToOriginalMode();
        } else {
            switchToCompactMode();
        }
    });

    // 点击页面其他地方切换到简略模式
    document.addEventListener('click', (e) => {
        // 设置弹窗打开时，保持当前展开状态
        if (isSettingsPopupOpen) {
            return;
        }
        // 如果点击的是面板内部，不处理
        if (panel.contains(e.target)) {
            return;
        }

        // 切换到简略模式
        if(panel.style.visibility !== "hidden"){
            switchToCompactMode();
        }
    });


    /******************************************************************************
     * ═══════════════════════════════════════════════════════════════════════
     * ║                                                                      ║
     * ║  ⚠️ 11、一些工具函数  ⚠️                       ║
     * ║                                                                      ║
     * ═══════════════════════════════════════════════════════════════════════
     ******************************************************************************/

    /**
     * 创建标签
     */
    function createTag(tag, textContent, css){
        const ele = document.createElement(tag);
        ele.style.cssText = css;
        if(textContent){
            ele.textContent = textContent;
        }
        return ele;
    }

    function createHtml(tag, html, css){
        const ele = document.createElement(tag);
        ele.style.cssText = css;
        if(html){
            setInnerHTML(ele, html);
        }
        return ele;
    }

    /**
     * 一次性添加多个子元素
     */
    function appendSeveral(parent, ...children) {
        children.forEach(child => {
            if (child) {
                parent.appendChild(child);
            }
        });
        return parent;
    }

    /**
     * 使用 MutationObserver 监测元素出现（更优雅的方式）
     * @param {Function} selectorFn - 获取元素的函数
     */
    function waitForElement(selectorFn, options = {}) {
        const {
            timeout = DEFAULT_WAIT_ELEMENT_TIME,
            root = document.body,
            timeoutMsg = "等待元素出现超时"
        } = options;

        return new Promise((resolve, reject) => {
            // 先检查元素是否已经存在
            const element = selectorFn();
            if (element) {
                resolve(element);
                return;
            }

            let timeoutId;
            let observer;

            // 设置超时
            timeoutId = setTimeout(() => {
                if (observer) observer.disconnect();
                console.warn(timeoutMsg);
                reject(new Error(timeoutMsg));
            }, timeout);

            // 创建 MutationObserver 监听 DOM 变化
            observer = new MutationObserver((mutations) => {
                const element = selectorFn();
                if (element) {
                    clearTimeout(timeoutId);
                    observer.disconnect();
                    resolve(element);
                }
            });

            // 开始观察
            observer.observe(root, {
                childList: true,      // 监听子节点的添加/删除
                subtree: true,        // 监听所有后代节点
                attributes: false,    // 不监听属性变化（性能优化）
                characterData: false  // 不监听文本内容变化（性能优化）
            });
        });
    }

    // 获取当前URL
    function getUrl(){
        return window.location.href;
    }

    /**
     * 判断当前是否为最大宽度
     */
    function isMaxWidth() {
        return window.outerWidth >= screen.availWidth - 50;
    }

    /**
     * 存储管理
     */

    // Blob --> Base64
    function blobToBase64(blob) {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = () => resolve(reader.result);
            reader.onerror = reject;
            reader.readAsDataURL(blob);
        });
    }

    // Base64 --> Blob
    function base64ToBlob(base64) {
        // 移除 data URL 前缀
        const base64Data = base64.split(',')[1];
        if (!base64Data) {
            throw new Error('无效的 Base64 字符串');
        }
        const byteString = atob(base64Data);
        const mimeType = base64.split(',')[0].split(':')[1].split(';')[0] || 'image/png';

        const ab = new ArrayBuffer(byteString.length);
        const ia = new Uint8Array(ab);
        // 填充字节数组
        for (let i = 0; i < byteString.length; i++) {
            ia[i] = byteString.charCodeAt(i);
        }
        return new Blob([ab], { type: mimeType });
    }

    function getS(key){
        return localStorage.getItem(key);
    }
    function setS(key, val){
        localStorage.setItem(key, val);
    }

    // 油猴设置、读取共享存储
    function setGV(key, value){
        GM_setValue(key, value);
    }
    function getGV(key){
        return GM_getValue(key);
    }

    /**
     * 获取站点图标并保存到GM（base64格式）
     * @param {number} siteId - 站点ID
     */
    function getAndSaveSiteIcon(siteId) {
        const iconKey = SITE_ICON_KEY_PREFIX + siteId;

        // 如果已经保存过图标，直接返回
        if (getGV(iconKey)) {
            return;
        }

        // 获取站点图标（按优先级尝试多个选择器，取第一个匹配到的）
        const iconSelectors = [
            "link[rel*='icon']",
            "link[rel='apple-touch-startup-image']"
        ];
        let iconLink = null;
        for (const selector of iconSelectors) {
            const candidate = document.querySelector(selector);
            if (candidate && candidate.href) {
                iconLink = candidate;
                break;
            }
        }
        if (iconLink && iconLink.href) {
            const iconUrl = iconLink.href;

            // 如果已经是base64格式，直接保存
            if (iconUrl.startsWith('data:')) {
                setGV(iconKey, iconUrl);
                console.log(`站点图标已保存(base64): site=${siteId}`);
                return;
            }

            // 将URL转换为base64（使用Image+Canvas方式）
            convertIconUrlToBase64(iconUrl, iconKey, siteId, `站点图标已保存(base64): site=${siteId}`);
        }
    }

    // 获取可见模型列表（返回site值列表）
    function getVisibleModels() {
        const stored = getGV(VISIBLE_MODELS_KEY);
        if (stored && Array.isArray(stored) && stored.length > 0) {
            // 验证存储的site是否仍然有效（未被禁用）
            const validSites = wordConfig.map(item => item.site);
            return stored.filter(site => validSites.includes(site));
        }
        // 默认返回所有模型的 site 列表
        return wordConfig.map(item => item.site);
    }

    // 设置可见模型列表（接受site值列表）
    function setVisibleModels(visibleSites) {
        // 验证：至少保留一个
        if (!visibleSites || visibleSites.length === 0) {
            return false;
        }
        setGV(VISIBLE_MODELS_KEY, visibleSites);
        return true;
    }

    // 获取书签功能总开关状态（默认 false，即关闭）
    function isBookmarkFeatureEnabled() {
        return getGV(ENABLE_BOOKMARK_FEATURE_KEY) === true;
    }

    // 通用判空函数
    function isEmpty(item){
        if(item===null || item===undefined || item.length===0 || item === "null"){
            return true;
        }else{
            return false;
        }
    }


    function guid() {
        return 'xxxxxxxx-xxxx-4xxx-yxxxx'.replace(/[xy]/g, function (c) {
            var r = Math.random() * 16 | 0,
                v = c == 'x' ? r : (r & 0x3 | 0x8);
            return v.toString(16);
        });
    }

    // 格式化的时间
    function curDate() {
        let timer = new Date();
        let year = timer.getFullYear();
        let month = timer.getMonth() + 1; // 由于月份从0开始，因此需加1
        if (month < 10) month = "0" + month;
        let day = timer.getDate();
        if (day < 10) day = "0" + day;
        let hour = timer.getHours();
        if (hour < 10) hour = "0" + hour;
        let minute = timer.getMinutes();
        if (minute < 10) minute = "0" + minute;
        let second = timer.getSeconds();
        if (second < 10) second = "0" + second;
        return `【${hour}:${minute}:${second}】`;
    }

    // 获取当天日期（yyyy-mm-dd）
    function getToday() {
        const now = new Date();
        const year = now.getFullYear();
        const month = String(now.getMonth() + 1).padStart(2, '0');
        const day = String(now.getDate()).padStart(2, '0');
        return `${year}-${month}-${day}`;
    }

    // 弹窗样式常量
    const POPUP_CONTAINER_STYLE = 'position:fixed;top:0;left:0;width:100%;height:100%;background:rgba(0,0,0,0.5);z-index:2147483647;display:flex;align-items:center;justify-content:center';
    const POPUP_CONTENT_BASE_STYLE = 'min-width:400px;background:white;border-radius:12px;padding:5px 20px;box-shadow:0 10px 40px rgba(0,0,0,0.3)';
    const POPUP_TITLE_STYLE = 'font-size:16px;font-weight:bold;color:#222;margin-bottom:10px';

    // 设置面板公共样式常量（提取公共基础，通过组合减少重复）
    const _tabBase = 'min-width:100px;padding:12px 20px;text-align:center;cursor:pointer;font-size:14px;';
    const _labelBase = 'font-size:14px;color:#333;';
    const _inputBase = 'border:1px solid #ddd;border-radius:4px;font-size:14px;';
    const _containerBase = 'display:flex;align-items:center;';

    const SETTINGS_STYLES = {
        // Tab样式
        tabBase: _tabBase,
        tabActive: _tabBase + 'border-bottom:3px solid #667eea;color:#667eea;font-weight:bold;background:#e8f0fe;',
        tabInactive: _tabBase + 'border-bottom:3px solid transparent;color:#666;background:#f5f5f5;',
        // Label样式
        labelBase: _labelBase,
        labelWithCursor: _labelBase + 'cursor:pointer;flex:1;',
        labelWithMinWidth: _labelBase + 'min-width:220px;flex-shrink:0;user-select:none;',
        labelWithMinWidthSmall: _labelBase + 'min-width:82px;flex-shrink:0;',
        // Input样式
        inputBase: 'padding:6px;' + _inputBase,
        inputSmall: 'width:55px;padding:6px 2px;' + _inputBase + 'text-align:center;',
        inputMedium: 'width:80px;padding:6px 10px;' + _inputBase,
        inputTextarea: 'width:100%;min-height:60px;padding:6px;border:1px solid #667eea;border-radius:4px;font-size:13px;font-family:inherit;resize:vertical;box-sizing:border-box',
        // Container样式
        itemContainer: _containerBase + 'padding:10px 0;border-bottom:1px solid #f0f0f0',
        itemContainerWithGap: _containerBase + 'padding:8px 0;border-bottom:1px solid #f0f0f0',
        toggleContainer: _containerBase + 'justify-content:flex-start;padding:6px 0;border-bottom:1px solid #f0f0f0;gap:12px;',
        columnsContainer: 'display:flex;gap:12px;margin-bottom:15px',
        // Tip文本样式
        tipText: 'color:#333;font-size:14px;margin-bottom:15px;line-height:1.5',
        // 其他样式
        checkboxSmall: 'margin-right:8px;width:16px;height:16px;cursor:pointer;',
        checkboxHidden: 'opacity:0;width:0;height:0;position:absolute;',
        closeBtn: 'cursor:pointer;font-size:20px;font-weight:bold;color:#999;padding:5px;position:absolute;top:15px;right:15px',
        saveBtn: 'padding:4px 8px;background:#4caf50;color:white;border:none;border-radius:4px;cursor:pointer;font-size:12px;flex-shrink:0'
    };

    /**
     * 创建弹窗基础结构
     */
    function createPopupBase(popupId, contentExtraStyle = '') {
        // 移除已有弹窗
        const existingPopup = document.getElementById(popupId);
        if (existingPopup) existingPopup.remove();

        // 创建弹窗容器
        const popup = createTag('div', "", POPUP_CONTAINER_STYLE);
        popup.id = popupId;

        // 创建弹窗内容
        const content = createTag('div', "", POPUP_CONTENT_BASE_STYLE + contentExtraStyle);

        popup.appendChild(content);
        popup.onclick = (e) => { if (e.target === popup) popup.remove(); };
        document.body.appendChild(popup);

        return { popup, content };
    }

    /**
     * 创建主按钮（渐变紫色）
     */
    function createPrimaryButton(text, onClick) {
        const btn = createTag('button', text, 'padding:10px;background:linear-gradient(135deg,#667eea 0%,#764ba2 100%);color:white;border:none;border-radius:4px;cursor:pointer;font-size:14px');
        btn.onclick = onClick;
        btn.addEventListener('mouseenter', () => btn.style.opacity = '0.85');
        btn.addEventListener('mouseleave', () => btn.style.opacity = '1');
        return btn;
    }

    /**
     * 显示提示弹窗
     * @param {string} message 提示内容
     * @param {string} [title] 可选标题
     * @param {Object} [extraButton] 可选额外按钮配置 {text: string, onClick: function}
     */
    function showMessagePopup(message, title, extraButton) {
        const { popup, content } = createPopupBase('message-popup', ';max-width:400px');

        // 标题（可选）
        if (title) {
            const titleDiv = createTag('div', title, POPUP_TITLE_STYLE);
            content.appendChild(titleDiv);
        }

        // 消息内容
        const messageDiv = createTag('div', message, 'color:#333;font-size:14px;line-height:1.6;white-space:pre-line;margin-bottom:15px');

        // 按钮容器
        const buttonContainer = createTag('div', '', 'display:flex;gap:10px;margin-top:15px');

        // 确定按钮
        const confirmBtn = createPrimaryButton('确定', () => popup.remove());
        confirmBtn.style.flex = '1';

        // 如果有额外按钮，添加到容器中
        if (extraButton && extraButton.text && extraButton.onClick) {
            const extraBtn = createPrimaryButton(extraButton.text, () => {
                extraButton.onClick();
                popup.remove();
            });
            extraBtn.style.flex = '1';
            buttonContainer.appendChild(extraBtn);
        }

        buttonContainer.appendChild(confirmBtn);
        appendSeveral(content, messageDiv, buttonContainer);
    }

    /******************************************************************************
     * ═══════════════════════════════════════════════════════════════════════
     * ║                                                                      ║
     * ║  ⚙️ 12、设置弹窗功能  ⚙️                                                   ║
     * ║                                                                      ║
     * ═══════════════════════════════════════════════════════════════════════
     ******************************************************************************/

    /**
     * 更新按钮显示状态
     */
    function updateButtonVisibility() {
        // 先读取当前开关配置
        const showToggle = getGV(SHOW_TOGGLE_BUTTON_KEY) !== false; // 默认true（显示）
        // 书签/列表按钮：默认 false（隐藏），只有显式设置为 true 时才显示
        const showBookmark = getGV(SHOW_BOOKMARK_BUTTON_KEY) === true;

        // 更新隐藏（输入框）按钮容器 —— 与书签功能是否启用无关
        if (toggleButtonContainer) {
            toggleButtonContainer.style.display = showToggle ? 'flex' : 'none';
        }

        // 书签功能整体关闭时，清理书签按钮并退出
        if (!isBookmarkFeatureEnabled()) {
            const bookmarkBtnForce = document.getElementById('bookmark-btn');
            if (bookmarkBtnForce) {
                bookmarkBtnForce.remove();
            }
            const bookmarkViewBtnForce = document.getElementById('bookmark-view-btn');
            if (bookmarkViewBtnForce) {
                bookmarkViewBtnForce.remove();
            }
            return;
        }

        // 当书签功能开启时，按用户配置显示/隐藏书签按钮
        const bookmarkBtn = document.getElementById('bookmark-btn');
        if (bookmarkBtn) {
            bookmarkBtn.style.display = showBookmark ? 'flex' : 'none';
        }

        // 更新历史（书签）按钮（与书签按钮使用同一个设置）
        const bookmarkViewBtn = document.getElementById('bookmark-view-btn');
        if (bookmarkViewBtn) {
            bookmarkViewBtn.style.display = showBookmark ? 'flex' : 'none';
        }
    }


    /**
     * 创建苹果风格开关
     */
    function createToggleSwitch(label, checked, onChange) {
        const container = createTag('div', '', SETTINGS_STYLES.toggleContainer);

        const labelDiv = createTag('div', label, SETTINGS_STYLES.labelBase);

        const switchContainer = createTag('label', '', 'position:relative;display:inline-block;width:44px;height:26px;cursor:pointer;flex-shrink:0');

        const checkbox = document.createElement('input');
        checkbox.type = 'checkbox';
        checkbox.checked = checked;
        checkbox.style.cssText = SETTINGS_STYLES.checkboxHidden;

        const slider = createTag('span', '', 'position:absolute;top:0;left:0;right:0;bottom:0;background-color:' + (checked ? '#34c759' : '#ccc') + ';transition:0.3s;border-radius:26px;');
        slider.style.cssText += 'cursor:pointer;';

        const sliderCircle = createTag('span', '', 'position:absolute;content:"";height:20px;width:20px;left:' + (checked ? '21px' : '3px') + ';bottom:3px;background-color:white;transition:0.3s;border-radius:50%;box-shadow:0 2px 4px rgba(0,0,0,0.2);');
        sliderCircle.style.cssText += 'cursor:pointer;';

        checkbox.addEventListener('change', function() {
            const isChecked = checkbox.checked;
            slider.style.backgroundColor = isChecked ? '#34c759' : '#ccc';
            sliderCircle.style.left = isChecked ? '21px' : '3px';
            onChange(isChecked);
        });

        appendSeveral(switchContainer, checkbox, slider, sliderCircle);
        appendSeveral(container, switchContainer, labelDiv);

        return container;
    }

    /**
     * 创建 Tab 1: 多选面板自定义
     */
    function createModelSelectionTab(checkboxes) {
        const tab = createTag('div', '多选面板自定义', SETTINGS_STYLES.tabActive);
        const tabContent = createTag('div', '', '');

        // 创建说明文字
        const tipText = createTag('div', '仅勾选的大模型将出现在多选面板上', SETTINGS_STYLES.tipText);
        appendSeveral(tabContent, tipText);

        // 读取当前可见模型列表
        const visibleSites = getVisibleModels();

        // 创建两列容器
        const columnsContainer = createTag('div', '', SETTINGS_STYLES.columnsContainer);
        const leftColumn = createTag('div', '', 'flex:1');
        const rightColumn = createTag('div', '', 'flex:1');

        // 将 wordConfig 分为前6个和后6个
        const firstHalf = wordConfig.slice(0, 6);
        const secondHalf = wordConfig.slice(6);

        // 创建复选框函数
        function createModelCheckbox(config) {
            const { word, site } = config;
            const isVisible = visibleSites.includes(site);

            const checkboxContainer = createTag('div', '', SETTINGS_STYLES.itemContainerWithGap);

            const checkbox = document.createElement('input');
            checkbox.type = 'checkbox';
            checkbox.checked = isVisible;
            checkbox.style.cssText = SETTINGS_STYLES.checkboxSmall;

            // 立即保存功能：复选框改变时立即生效
            checkbox.addEventListener('change', () => {
                const newVisibleSites = wordConfig
                    .filter(config => checkboxes[config.word]?.checked)
                    .map(config => config.site);

                if (newVisibleSites.length === 0) {
                    checkbox.checked = true; // 恢复选中，至少保留一个
                    showMessagePopup('至少需要保留一个模型可见');
                    return;
                }

                // 保存配置，退出弹窗后再刷新面板
                setVisibleModels(newVisibleSites);
                // 立即刷新多选面板展示状态
                refreshPanel();
                reloadCompactMode();
            });

            const label = createTag('label', word, SETTINGS_STYLES.labelWithCursor);
            label.style.cssText += 'user-select:none;';
            label.onclick = () => checkbox.click();

            checkboxes[word] = checkbox;

            appendSeveral(checkboxContainer, checkbox, label);
            return checkboxContainer;
        }

        // 添加前6个到左列
        firstHalf.forEach(config => {
            leftColumn.appendChild(createModelCheckbox(config));
        });

        // 添加后6个到右列
        secondHalf.forEach(config => {
            rightColumn.appendChild(createModelCheckbox(config));
        });

        appendSeveral(columnsContainer, leftColumn, rightColumn);
        appendSeveral(tabContent, columnsContainer);

        return { tab, tabContent };
    }

    /**
     * 创建 Tab 2: 按钮显示设置
     */
    function createButtonDisplayTab() {
        const tab = createTag('div', '按钮显示', SETTINGS_STYLES.tabInactive);
        const tabContent = createTag('div', '', 'display:none;');

        // 读取当前设置
        // 隐藏输入框按钮：默认 true（显示）
        const showToggle = getGV(SHOW_TOGGLE_BUTTON_KEY) !== false;
        // 默认隐藏输入框：默认 false（不隐藏）
        const isInputDefaultHided = getGV(DEFAULT_HIDE_INPUT_AREA_KEY) === true;

        // 创建两个开关
        const toggleSwitch1 = createToggleSwitch('隐藏输入框的按钮，是否展示', showToggle, (checked) => {
            setGV(SHOW_TOGGLE_BUTTON_KEY, checked);
            updateButtonVisibility();
        });

        const toggleSwitch2 = createToggleSwitch('每次打开历史对话页面，输入框是否默认隐藏', isInputDefaultHided, (checked) => {
            setGV(DEFAULT_HIDE_INPUT_AREA_KEY, checked);
            // 如果开启，立即应用；如果关闭，恢复显示
            if (checked) {
                applyDefaultHideInputArea();
            } else {
                const aroundInputArea = getNthInputArea();
                if (aroundInputArea && aroundInputArea.style.display === 'none') {
                    aroundInputArea.style.display = TOGGLE_STATES.show.display;
                    isInputAreaHidden = false;
                    toggleBtnStatus(true);
                }
            }
        });

        appendSeveral(tabContent, toggleSwitch1, toggleSwitch2);

        return { tab, tabContent };
    }

    /**
     * 创建 Tab 3: 导航变量设置
     */
    function createNavVarsTab() {
        const tab = createTag('div', '目录设置', SETTINGS_STYLES.tabInactive);
        const tabContent = createTag('div', '', 'display:none;');

        // 读取当前导航变量设置
        const navMaxWidthValue = getGV(NAV_MAX_WIDTH_KEY) || DEFAULT_NAV_MAX_WIDTH;
        const navTopValue = getGV(NAV_TOP_KEY) || DEFAULT_NAV_TOP;
        const navTopOverflowValue = getGV(NAV_TOP_OVERFLOW_KEY) || DEFAULT_NAV_TOP_OVERFLOW;
        const subNavTopOverflowValue = getGV(SUB_NAV_TOP_OVERFLOW_KEY) || DEFAULT_SUB_NAV_TOP_OVERFLOW;

        // 创建说明文字
        const tipText = createHtml('div', '修改后立即生效。', SETTINGS_STYLES.tipText);
        appendSeveral(tabContent, tipText);

        // 创建输入框容器
        const configContainer = createTag('div', '', 'display:flex;flex-direction:column;gap:12px');
        const inputCss = SETTINGS_STYLES.inputMedium;
        const itemContainerCss = SETTINGS_STYLES.itemContainer;
        const labelCss = SETTINGS_STYLES.labelWithMinWidth;
        const defaultLabelCss = 'font-size:13px;color:#666;margin-left:10px;';

        // 导航变量配置
        const navConfigs = [
            { label: '主目录最大宽度', value: navMaxWidthValue, placeholder: DEFAULT_NAV_MAX_WIDTH, key: NAV_MAX_WIDTH_KEY, defaultVal: DEFAULT_NAV_MAX_WIDTH },
            { label: '主目录（默认）垂直位置', value: navTopValue, placeholder: DEFAULT_NAV_TOP, key: NAV_TOP_KEY, defaultVal: DEFAULT_NAV_TOP },
            { label: '主目录（条数较多时）垂直位置', value: navTopOverflowValue, placeholder: DEFAULT_NAV_TOP_OVERFLOW, key: NAV_TOP_OVERFLOW_KEY, defaultVal: DEFAULT_NAV_TOP_OVERFLOW },
            { label: '副目录最高的垂直位置', value: subNavTopOverflowValue, placeholder: DEFAULT_SUB_NAV_TOP_OVERFLOW, key: SUB_NAV_TOP_OVERFLOW_KEY, defaultVal: DEFAULT_SUB_NAV_TOP_OVERFLOW }
        ];

        // 创建输入框项的函数
        function createNavInputItem(config) {
            const item = createTag('div', '', itemContainerCss);
            const label = createTag('label', config.label, labelCss);
            const input = createTag('input', "", inputCss);
            input.type = 'text';
            input.value = config.value;
            input.placeholder = config.placeholder;
            const defaultLabel = createTag('span', `(默认: ${config.defaultVal})`, defaultLabelCss);
            appendSeveral(item, label, input, defaultLabel);
            return { item, input };
        }

        // 批量创建输入框
        const navInputs = navConfigs.map(createNavInputItem);
        const navInputItems = navInputs.map(nav => nav.item);
        const inputElements = navInputs.map(nav => nav.input);

        // 立即保存导航变量配置的函数
        function saveNavVarsImmediately() {
            navConfigs.forEach((config, index) => {
                const inputVal = inputElements[index].value.trim();
                if (inputVal && inputVal !== config.defaultVal) {
                    setGV(config.key, inputVal);
                } else {
                    GM_deleteValue(config.key);
                }
            });
            updateNavStyles();
        }

        // 批量添加输入框事件监听
        inputElements.forEach(input => {
            input.addEventListener('change', saveNavVarsImmediately);
            input.addEventListener('blur', saveNavVarsImmediately);
        });

        appendSeveral(configContainer, ...navInputItems);
        appendSeveral(tabContent, configContainer);

        return { tab, tabContent };
    }

    /**
     * 创建 Tab 4: 输入框隐藏范围设置
     */
    function createInputAreaHideLevelTab() {
        const tab = createTag('div', '输入框隐藏范围', SETTINGS_STYLES.tabInactive);
        const tabContent = createTag('div', '', 'display:none;');

        // 读取用户自定义的层级配置
        const customLevels = getGV(INPUT_AREA_HIDE_PARENT_LEVEL_KEY) || {};
        const levelInputs = {};

        // 创建说明文字
        const tipText = createHtml('div', '如果官网做了某些改动，则隐藏输入框的范围效果可能不合适；<br>此时可尝试修改下面数值：数值越大，则页面隐藏的内容范围越大，反之越小。', SETTINGS_STYLES.tipText);
        appendSeveral(tabContent, tipText);

        // 创建两列容器
        const columnsContainer = createTag('div', '', SETTINGS_STYLES.columnsContainer);
        const leftColumn = createTag('div', '', 'flex:1');
        const rightColumn = createTag('div', '', 'flex:1');

        // 将 wordConfig 分为前6个和后6个
        const firstHalf = wordConfig.slice(0, 6);
        const secondHalf = wordConfig.slice(6);

        // 立即保存层级配置的函数
        function saveLevelsImmediately() {
            const newLevels = {};
            let hasInvalid = false;

            // 收集所有输入框的值
            wordConfig.forEach(config => {
                const { site: siteId } = config;
                const input = levelInputs[siteId];
                const value = parseInt(input.value, 10);

                if (isNaN(value) || value < 0) {
                    hasInvalid = true;
                    input.style.borderColor = '#ff4444';
                    setTimeout(() => {
                        input.style.borderColor = '#ddd';
                    }, 2000);
                } else {
                    input.style.borderColor = '#ddd';
                    const defaultLevel = inputAreaHideParentLevel[siteId];
                    // 如果与默认值相同，则不保存（使用默认值）
                    if (value !== defaultLevel) {
                        newLevels[siteId] = value;
                    }
                }
            });

            if (hasInvalid) {
                return;
            }

            // 保存配置
            if (Object.keys(newLevels).length === 0) {
                // 如果所有值都是默认值，删除存储的配置
                GM_deleteValue(INPUT_AREA_HIDE_PARENT_LEVEL_KEY);
            } else {
                setGV(INPUT_AREA_HIDE_PARENT_LEVEL_KEY, newLevels);
            }
        }

        // 创建配置项的函数
        function createLevelConfigItem(config) {
            const { site: siteId, word } = config;
            const defaultLevel = inputAreaHideParentLevel[siteId];
            const currentLevel = customLevels[siteId] !== undefined ? customLevels[siteId] : defaultLevel;

            const itemContainer = createTag('div', '', SETTINGS_STYLES.itemContainer);

            const label = createTag('label', word, SETTINGS_STYLES.labelWithMinWidthSmall);
            label.style.cssText += 'user-select:none;';

            const input = document.createElement('input');
            input.type = 'number';
            input.value = currentLevel;
            input.min = '0';
            input.style.cssText = SETTINGS_STYLES.inputSmall;

            // 立即保存功能：输入框值改变时立即生效
            input.addEventListener('change', () => {
                saveLevelsImmediately();
            });
            input.addEventListener('blur', () => {
                saveLevelsImmediately();
            });

            const defaultLabel = createTag('span', `(默认: ${defaultLevel})`, 'font-size:13px;color:#666;margin:auto 10px;');

            levelInputs[siteId] = input;

            appendSeveral(itemContainer, label, input, defaultLabel);
            return itemContainer;
        }

        // 添加前6个到左列
        firstHalf.forEach(config => {
            leftColumn.appendChild(createLevelConfigItem(config));
        });

        // 添加后6个到右列
        secondHalf.forEach(config => {
            rightColumn.appendChild(createLevelConfigItem(config));
        });

        appendSeveral(columnsContainer, leftColumn, rightColumn);
        appendSeveral(tabContent, columnsContainer);

        return { tab, tabContent };
    }

    /**
     * 显示设置弹窗
     */
    function showSettingsPopup() {
        isSettingsPopupOpen = true;
        const { popup, content } = createPopupBase('settings-popup', ';width:600px;height:550px;overflow:auto');

        // 标题
        const title = createTag('div', '设置', 'font-size:18px;font-weight:bold;margin-bottom:20px;color:#333');

        // Tab 切换容器
        const tabContainer = createTag('div', '', 'display:flex;border-bottom:2px solid #e0e0e0;margin-bottom:20px;width:fit-content;');

        // Tab 内容容器
        const tabContentContainer = createTag('div', '', 'min-height:200px;min-width:300px;');

        // 存储所有复选框的引用（用于多选面板设置）
        const checkboxes = {};

        // 创建各个Tab
        const { tab: tab1, tabContent: tab1Content } = createModelSelectionTab(checkboxes);
        const { tab: tab2, tabContent: tab2Content } = createButtonDisplayTab();
        const { tab: tab3, tabContent: tab3Content } = createNavVarsTab();
        const { tab: tab4, tabContent: tab4Content } = createInputAreaHideLevelTab();

        // Tab 切换函数（支持多个tab）
        const tabs = [tab1, tab2, tab3, tab4];
        const tabContents = [tab1Content, tab2Content, tab3Content, tab4Content];

        function switchTab(activeIndex) {
            tabs.forEach((tab, index) => {
                if (index === activeIndex) {
                    tab.style.cssText = SETTINGS_STYLES.tabActive;
                    tabContents[index].style.display = '';
                } else {
                    tab.style.cssText = SETTINGS_STYLES.tabInactive;
                    tabContents[index].style.display = 'none';
                }
            });
        }

        // Tab 点击事件
        tab1.onclick = () => switchTab(0);
        tab2.onclick = () => switchTab(1);
        tab3.onclick = () => switchTab(2);
        tab4.onclick = () => switchTab(3);

        appendSeveral(tabContainer, tab1, tab2, tab3, tab4);
        appendSeveral(tabContentContainer, tab1Content, tab2Content, tab3Content, tab4Content);

        // 关闭弹窗的函数，关闭时刷新多选面板
        const closePopup = () => {
            popup.remove();
            refreshPanel();
            isSettingsPopupOpen = false;
        };

        // 关闭按钮
        const closeBtn = createTag('span', '✕', SETTINGS_STYLES.closeBtn);
        closeBtn.onclick = closePopup;

        // 点击背景关闭时也刷新面板
        popup.onclick = (e) => {
            if (e.target === popup) {
                closePopup();
            }
        };

        appendSeveral(content, closeBtn, title, tabContainer, tabContentContainer);
    }

    /******************************************************************************
     * ═══════════════════════════════════════════════════════════════════════
     * ║                                                                      ║
     * ║  📚 13、书签功能  📚                                                      ║
     * ║                                                                      ║
     * ═══════════════════════════════════════════════════════════════════════
     ******************************************************************************/

    const BOOKMARK_SIGNAL_KEY = "bookmarkSignal"; // 书签创建信号key
    const BOOKMARK_JUMP_SIGNAL_KEY = "bookmarkJumpSignal"; // 书签跳转信号key
    
    // 当前选中的书签key（用于切换分组）- 模块级变量
    let selectedBookmarkKey = null;
    const NEW_CHAT_JUMP_SIGNAL_KEY = "newChatJumpSignal"; // 新对话跳转信号key
    const SITE_JUMP_REQUEST_PREFIX = "site-jump-request-"; // 单站点跳转请求信号前缀
    const SITE_JUMP_ACK_PREFIX = "site-jump-ack-"; // 单站点跳转确认信号前缀
    const SITE_JUMP_TIMEOUT = 500; // 跳转确认超时时间（毫秒）

    // ──────────────────────────────────────────────────────────────────────
    // 13.1 工具函数
    // ──────────────────────────────────────────────────────────────────────

    // 生成书签key（自增ID）
    function generateBookmarkKey() {
        let counter = getGV(BOOKMARK_ID_COUNTER) || 0;
        counter++;
        setGV(BOOKMARK_ID_COUNTER, counter);
        return `${BOOKMARK_PREFIX}${counter}`;
    }

    /**
     * 获取页面首个提问的内容
     */
    function getFirstQuestionContent() {
        const questions = getQuestionList();
        if (questions && questions.length > 0) {
            const firstQuestion = questions[0];
            const content = normalizeQuestionText(firstQuestion.textContent || firstQuestion.innerText || '');

            // 如果是 STUDIO 站点且内容为空，从主目录栏获取实质内容
            if (site === STUDIO && (!content || content.length === 0)) {
                const navLinkText = getFirstStudioNavLinkText();
                if (navLinkText) {
                    return navLinkText;
                }
            }

            return content;
        }
        return '';
    }

    // 从完整URL中提取路径部分（去掉域名前缀，截取第一个斜线为止，排除双斜线）
    function extractUrlPath(fullUrl) {
        const match = fullUrl.match(/^https?:\/\/[^\/]+\/(.*)$/);
        return match ? match[1] : '';
    }

    /**
     * 截取书签question（超过最大长度则截取）
     */
    function truncateBookmarkQuestion(question) {
        if (!question) return '';
        return question.length > BOOKMARK_QUESTION_MAX_LENGTH ? question.substring(0, BOOKMARK_QUESTION_MAX_LENGTH) : question;
    }

    /**
     * 生成书签标题
     * 从 document.title 移除当前站点的 word 前缀或后缀后，如果字数大于7则采用，否则复用提问内容
     */
    function generateBookmarkTitle(question) {
        let title = document.title || '';

        // 查找当前站点的 word
        const currentSiteConfig = wordConfig.find(config => config.site === site);
        if (currentSiteConfig) {
            const word = currentSiteConfig.word;
            // 移除前缀
            if (title.startsWith(word)) {
                title = title.substring(word.length).trim();
            }
            // 移除后缀
            if (title.endsWith(word)) {
                title = title.substring(0, title.length - word.length).trim();
            }
            if (title.endsWith("-")) {
                title = title.substring(0, title.length - 2).trim();
            }
            if (title.startsWith("-")) {
                title = title.substring(2, title.length).trim();
            }
        }

        // 如果字数大于7，则采用它，否则复用提问内容
        if (title.length > 7) {
            return title;
        } else {
            return question || '';
        }
    }

    // 从路径部分拼接完整URL（加上域名前缀）
    function buildFullUrl(path, siteId) {
        const baseUrl = webSites[siteId]?.[0];
        if (!baseUrl) return path;
        const match = baseUrl.match(/^(https?:\/\/[^\/]+\/)/);
        return match ? match[1] + path : baseUrl + path;
    }

    /**
     * 根据URL识别站点ID
     * @param {string} url - 完整URL
     * @returns {number|null} - 站点ID，如果无法识别则返回null
     */
    function identifySiteFromUrl(url) {
        if (!url || typeof url !== 'string') return null;

        // 如果没有协议前缀，自动添加https://
        let normalizedUrl = url.trim();
        if (!normalizedUrl.match(/^https?:\/\//i)) {
            normalizedUrl = 'https://' + normalizedUrl;
        }

        try {
            const urlObj = new URL(normalizedUrl);
            const urlHost = urlObj.hostname.toLowerCase();

            // 移除www前缀进行比较（更灵活的匹配）
            const urlHostWithoutWww = urlHost.replace(/^www\./, '');

            // 遍历webSites，匹配域名
            for (const [siteId, baseUrls] of Object.entries(webSites)) {
                if (!baseUrls || !Array.isArray(baseUrls) || baseUrls.length === 0) continue;

                const baseUrl = baseUrls[0];
                if (!baseUrl) continue;

                try {
                    const baseUrlObj = new URL(baseUrl);
                    const baseHost = baseUrlObj.hostname.toLowerCase();
                    const baseHostWithoutWww = baseHost.replace(/^www\./, '');

                    // 精确匹配域名（考虑www前缀）
                    if (urlHost === baseHost || urlHostWithoutWww === baseHostWithoutWww) {
                        return parseInt(siteId);
                    }
                } catch (e) {
                    // 如果baseUrl解析失败，尝试字符串匹配
                    if (normalizedUrl.indexOf(baseUrl) === 0 || url.indexOf(baseUrl) === 0) {
                        return parseInt(siteId);
                    }
                }
            }
        } catch (e) {
            // URL解析失败，尝试字符串匹配
            for (const [siteId, baseUrls] of Object.entries(webSites)) {
                if (!baseUrls || !Array.isArray(baseUrls) || baseUrls.length === 0) continue;
                const baseUrl = baseUrls[0];
                if (baseUrl && (normalizedUrl.indexOf(baseUrl) === 0 || url.indexOf(baseUrl) === 0)) {
                    return parseInt(siteId);
                }
            }
        }

        return null;
    }

    /**
     * 更新书签数据（添加或更新当前站点的URL）
     * 解决并发写入覆盖问题：写入前重新读取最新数据并合并
     */
    function updateBookmarkData(bookmarkKey, siteId, url, question) {
        const siteWord = siteToWord[siteId] || siteId;
        // 只存储路径部分，去掉域名前缀
        const urlPath = extractUrlPath(url);

        // 重新读取最新数据，避免并发覆盖
        const bookmarkData = getBookmarkData(bookmarkKey) || { sites: [], group: DEFAULT_GROUP_ID, question: '', title: '' };
        const sites = bookmarkData.sites || [];
        const existingIndex = sites.findIndex(item => item.site === siteId);

        if (existingIndex >= 0) {
            sites[existingIndex].url = urlPath;
        } else {
            sites.push({ site: siteId, url: urlPath });
        }

        // 如果提供了question，则更新question字段
        const questionToSave = question !== undefined ? truncateBookmarkQuestion(question) : (bookmarkData.question || '');
        // 如果提供了question且没有title，则生成title
        const titleToSave = bookmarkData.title || (questionToSave ? generateBookmarkTitle(questionToSave) : '');
        setBookmarkData(bookmarkKey, sites, bookmarkData.group, questionToSave, titleToSave);

        // 写入后验证，若数据丢失则重试
        setTimeout(() => {
            const verifyData = getBookmarkData(bookmarkKey);
            const verified = verifyData && verifyData.sites && verifyData.sites.some(item => item.site === siteId && item.url === urlPath);
            if (!verified) {
                console.log(curDate() + `书签: 检测到数据丢失，重试写入 ${siteWord}`);
                updateBookmarkData(bookmarkKey, siteId, url);
            }
        }, 100 + Math.random() * 200); // 随机延迟避免再次冲突

        console.log(curDate() + `书签: 站点[${siteWord}]的URL已保存`, bookmarkKey);
    }

    /**
     * 切换站点星标状态
     * @param {string} bookmarkKey - 书签key
     * @param {number} siteId - 站点ID
     * @returns {boolean} - 是否成功
     */
    function toggleSiteStarred(bookmarkKey, siteId) {
        const bookmarkData = getBookmarkData(bookmarkKey);
        if (!bookmarkData || !bookmarkData.sites) return false;

        const sites = bookmarkData.sites;
        const siteIndex = sites.findIndex(item => item.site === siteId);
        if (siteIndex === -1) return false;

        // 切换星标状态
        sites[siteIndex].starred = !sites[siteIndex].starred;

        // 保存数据
        setBookmarkData(bookmarkKey, sites, bookmarkData.group, bookmarkData.question, bookmarkData.title);
        return true;
    }

    /**
     * 从书签中移除站点
     * @param {string} bookmarkKey - 书签key
     * @param {number} siteId - 站点ID
     * @returns {boolean} - 是否成功移除
     */
    function removeSiteFromBookmark(bookmarkKey, siteId) {
        const bookmarkData = getBookmarkData(bookmarkKey);
        if (!bookmarkData || !bookmarkData.sites) return false;

        const sites = bookmarkData.sites;
        const siteIndex = sites.findIndex(item => item.site === siteId);
        if (siteIndex === -1) return false;

        // 移除站点
        sites.splice(siteIndex, 1);

        // 保存数据
        setBookmarkData(bookmarkKey, sites, bookmarkData.group, bookmarkData.question, bookmarkData.title);
        return true;
    }

    // ──────────────────────────────────────────────────────────────────────
    // 13.2 跨站点同步机制
    // ──────────────────────────────────────────────────────────────────────

    // 监听书签创建信号：将当前站点URL添加到书签
    GM_addValueChangeListener(BOOKMARK_SIGNAL_KEY, function(name, oldValue, newValue, remote) {
        if (!remote) return;

        const bookmarkKey = getGV(CURRENT_BOOKMARK_KEY);
        if (!bookmarkKey) return;

        // 检查：如果勾选站点的第一个问题不等于当前站点的，则不加到同步关系里
        const bookmarkData = getBookmarkData(bookmarkKey);
        if (!bookmarkData) return;
        const bookmarkQuestion = truncateBookmarkQuestion(normalizeQuestionText(bookmarkData.question || ''));
        const currentSiteFirstQuestion = truncateBookmarkQuestion(normalizeQuestionText(getFirstQuestionContent() || ''));
        if (bookmarkQuestion !== currentSiteFirstQuestion) {
            console.log(curDate() + "书签: 当前站点第一个问题与书签问题不一致，不添加到同步关系");
            return;
        }

        const currentUrl = getUrl();
        updateBookmarkData(bookmarkKey, site, currentUrl);
        console.log(curDate() + "书签: 收到创建信号，已添加URL");
    });

    // 监听图钉收集请求：收到后上报当前URL
    GM_addValueChangeListener(PIN_REQUEST_KEY, function(name, oldValue, newValue, remote) {
        if (!remote || !newValue) return;
        const { requestId } = newValue;
        if (!requestId) return;
        setGV(PIN_RESPONSE_PREFIX + site, {
            requestId,
            url: getUrl(),
            timestamp: Date.now()
        });
    });

    // 监听书签跳转信号：如果包含当前站点，执行跳转
    GM_addValueChangeListener(BOOKMARK_JUMP_SIGNAL_KEY, function(name, oldValue, newValue, remote) {
        if (!remote || !newValue) return;

        const { jumpData, timestamp } = newValue;
        if (!jumpData || !jumpData[site]) return;

        const targetUrl = jumpData[site];
        const currentUrl = getUrl();
        if (currentUrl !== targetUrl) {
            console.log(curDate() + `书签跳转: 从 ${currentUrl} 跳转到 ${targetUrl}`);
            window.location.href = targetUrl;
        }
    });

    // 监听新对话跳转信号：所有已打开站点收到信号后跳转到新对话页面
    GM_addValueChangeListener(NEW_CHAT_JUMP_SIGNAL_KEY, function(name, oldValue, newValue, remote) {
        if (!remote || !newValue) return;

        const { jumpData, timestamp } = newValue;
        if (!jumpData || !jumpData[site]) return;

        const targetUrl = jumpData[site];
        const currentUrl = getUrl();
        if (currentUrl !== targetUrl) {
            console.log(curDate() + `新对话跳转: 从 ${currentUrl} 跳转到 ${targetUrl}`);
            window.location.href = targetUrl;
        }
    });

    // 监听单站点跳转请求：当前站点收到跳转请求时，返回确认并执行跳转
    const siteJumpRequestKey = SITE_JUMP_REQUEST_PREFIX + site;
    GM_addValueChangeListener(siteJumpRequestKey, function(name, oldValue, newValue, remote) {
        if (!remote || !newValue) return;

        const { url, timestamp, jumpIfOpen } = newValue;
        if (!url) return;

        // 立即返回确认信号
        const ackKey = SITE_JUMP_ACK_PREFIX + site;
        setGV(ackKey, { timestamp: Date.now() });

        // 判断是否需要跳转
        if (jumpIfOpen && getUrl() !== url) {
            console.log(curDate() + `单站点跳转: 从 ${currentUrl} 跳转到 ${url}`);
            window.location.href = url;
        }
    });

    /**
     * 发送跳转信号，通知所有站点跳转到书签记录的URL
     */
    function sendJumpSignalToAll(sites) {
        const jumpData = {};
        sites.forEach(s => {
            // 从路径部分拼接完整URL
            jumpData[s.site] = buildFullUrl(s.url, s.site);
        });

        setGV(BOOKMARK_JUMP_SIGNAL_KEY, {
            jumpData: jumpData,
            timestamp: Date.now()
        });

        // 当前站点直接跳转（不依赖监听器的remote检查）
        if (jumpData[site]) {
            const currentUrl = getUrl();
            if (currentUrl !== jumpData[site]) {
                console.log(curDate() + `书签跳转: 当前站点从 ${currentUrl} 跳转到 ${jumpData[site]}`);
                window.location.href = jumpData[site];
            }
        }
        console.log(curDate() + `书签: 已发送一键跳转信号`);
    }

    /**
     * 跳转到指定站点
     * @param {Object} siteInfo - 站点信息 {site: 站点ID, url: 路径部分}
     */
    function jumpToSite(siteInfo) {
        // 从路径部分拼接完整URL
        const fullUrl = buildFullUrl(siteInfo.url, siteInfo.site);
        // 是否在站点已打开时跳转
        const jumpIfOpen = siteInfo.jumpIfOpen || false;

        // 当前站点：根据jumpIfOpen参数决定是否跳转
        if (siteInfo.site === site && jumpIfOpen) {
            const currentUrl = getUrl();
            if (currentUrl !== fullUrl) {
                window.location.href = fullUrl;
            }
            return;
        }

        // 其他站点：发送跳转请求并等待确认
        const requestKey = SITE_JUMP_REQUEST_PREFIX + siteInfo.site;
        const ackKey = SITE_JUMP_ACK_PREFIX + siteInfo.site;
        const siteName = siteToWord[siteInfo.site] || siteInfo.site;

        // 发送跳转请求
        setGV(requestKey, {
            url: fullUrl,
            timestamp: Date.now(),
            jumpIfOpen: jumpIfOpen
        });

        // 监听确认信号
        let ackReceived = false;
        const listener = GM_addValueChangeListener(ackKey, function(name, oldValue, newValue, remote) {
            if (newValue && newValue.timestamp) {
                ackReceived = true;
                console.log(curDate() + `站点 ${siteName} 已打开，等待其自行跳转`);
            }
        });

        // 超时检查
        setTimeout(() => {
            if (!ackReceived) {
                // 未收到确认，说明站点未打开，新开页面
                console.log(curDate() + `站点 ${siteName} 未打开，新开页面`);
                window.open(fullUrl, '_blank');
            }
            // 移除监听器（如果支持）
            try {
                if (listener && typeof listener.removeListener === 'function') {
                    listener.removeListener();
                }
            } catch (e) {
            }
        }, SITE_JUMP_TIMEOUT);
    }

    // ──────────────────────────────────────────────────────────────────────
    // 13.3 书签CRUD操作
    // ──────────────────────────────────────────────────────────────────────

    /**
     * 创建书签（内部函数）
     */
    function createBookmark(questionText) {
        const bookmarkKey = generateBookmarkKey();
        const currentUrl = getUrl();

        // 存储书签key
        setGV(CURRENT_BOOKMARK_KEY, bookmarkKey);
        addBookmarkKeyToList(bookmarkKey);
        console.log(curDate() + "书签: 创建新书签", bookmarkKey);

        // 截取question
        const truncatedQuestion = truncateBookmarkQuestion(questionText);

        // 生成标题
        const title = generateBookmarkTitle(truncatedQuestion);

        // 先设置初始数据（包含title），然后再调用updateBookmarkData
        // updateBookmarkData会读取已有的title，不会重复生成
        setBookmarkData(bookmarkKey, [], DEFAULT_GROUP_ID, truncatedQuestion, title);

        // 添加当前站点的URL（同时保存question和title）
        updateBookmarkData(bookmarkKey, site, currentUrl, truncatedQuestion);

        // 发送信号通知其他站点添加URL
        setGV(BOOKMARK_SIGNAL_KEY, Date.now());

        // 延迟显示提示，等待其他站点响应后获取实际添加的站点列表
        setTimeout(() => {
            const bookmarkData = getBookmarkData(bookmarkKey);
            const actualSites = bookmarkData ? (bookmarkData.sites || []).map(item => item.site) : [];
            const siteNames = actualSites.map(s => siteToWord[s] || s).join(', ');
            showMessagePopup(`书签已创建！\n【关联站点】${siteNames}\n【书签名】${questionText}`, null, {
                text: '立即查看书签列表',
                onClick: () => showBookmarkWindow(DEFAULT_GROUP_ID, true)
            });
        }, 1500);
    }

    /**
     * 点击书签按钮时触发
     */
    function onBookmarkButtonClick() {
        const firstQuestion = getFirstQuestionContent();
        if (!firstQuestion) {
            showMessagePopup("当前页面没有提问内容，无法创建书签");
            return;
        }

        const currentUrl = getUrl();

        // 检查是否已存在相同question的书签（通过遍历所有书签）
        const allBookmarks = getAllBookmarks();
        const normalizedFirstQuestion = truncateBookmarkQuestion(normalizeQuestionText(firstQuestion));
        const existingBookmark = allBookmarks.find(b => truncateBookmarkQuestion(normalizeQuestionText(b.question)) === normalizedFirstQuestion);

        if (existingBookmark) {
            // 检查是否真的重复：相同site且相同url（比较路径部分）
            const currentUrlPath = extractUrlPath(currentUrl);
            const isReallyDuplicate = existingBookmark.sites.some(item => item.site === site && item.url === currentUrlPath);

            if (isReallyDuplicate) {
                // 真的重复，提示用户
                showMessagePopup("该书签已存在，无需重复创建");
                return;
            }
        }

        // 其他情况（不重复或只是bookmarkKey重复但site/url不同），直接创建
        createBookmark(firstQuestion);
    }

    /**
     * 添加书签key到列表
     */
    function addBookmarkKeyToList(bookmarkKey) {
        // 已移除bookmarkKeyList，书签通过分组映射管理
        // 此函数保留以兼容调用，但不执行任何操作
    }

    /**
     * 删除书签
     */
    function removeBookmark(bookmarkKey) {
        // 从分组映射中移除
        const data = getBookmarkData(bookmarkKey);
        if (data) {
            removeBookmarkFromGroupMap(bookmarkKey, data.group);
        }

        // 移除 json（分组映射已在removeBookmarkFromGroupMap中处理）
        GM_deleteValue(bookmarkKey);
        console.log(curDate() + `书签: 已删除 ${bookmarkKey}`);
    }

    /**
     * 移动书签在分组中的位置（上移或下移）
     * @param {string} bookmarkKey - 书签完整key
     * @param {string} direction - 移动方向：'top', 'bottom', 'up', 'down'
     * @param {number|null} groupId - 分组ID，null表示"全部"视图（使用书签所在分组）
     */
    function moveBookmarkInList(bookmarkKey, direction, groupId = null) {
        // 获取书签所在分组
        const data = getBookmarkData(bookmarkKey);
        if (!data) {
            console.log(curDate() + `书签: 未找到书签数据 ${bookmarkKey}`);
            return false;
        }
        // 如果groupId为null（全部视图），使用书签实际所在的分组
        const targetGroupId = groupId !== null ? groupId : (data.group || DEFAULT_GROUP_ID);

        const groupMap = getGroupMap();
        const bookmarkIds = groupMap[targetGroupId] || [];
        const bookmarkId = getBookmarkId(bookmarkKey);
        const currentIndex = bookmarkIds.indexOf(bookmarkId);

        if (currentIndex === -1) {
            console.log(curDate() + `书签: 未找到书签 ${bookmarkKey}`);
            return false;
        }

        let newIndex;
        if (direction === 'top') {
            if (currentIndex === 0) return false; // 已经在最顶部
            // 移除当前元素，插入到最前面
            bookmarkIds.splice(currentIndex, 1);
            bookmarkIds.unshift(bookmarkId);
            groupMap[targetGroupId] = bookmarkIds;
            setGroupMap(groupMap);
            console.log(curDate() + `书签: 置顶 ${bookmarkKey}`);
            return true;
        } else if (direction === 'bottom') {
            if (currentIndex === bookmarkIds.length - 1) return false; // 已经在最底部
            // 移除当前元素，插入到最后面（显示时在最上面）
            bookmarkIds.splice(currentIndex, 1);
            bookmarkIds.push(bookmarkId);
            groupMap[targetGroupId] = bookmarkIds;
            setGroupMap(groupMap);
            console.log(curDate() + `书签: 移到底部（显示置顶） ${bookmarkKey}`);
            return true;
        } else if (direction === 'up') {
            if (currentIndex === 0) return false; // 已经在最顶部
            newIndex = currentIndex - 1;
        } else if (direction === 'down') {
            if (currentIndex === bookmarkIds.length - 1) return false; // 已经在最底部
            newIndex = currentIndex + 1;
        } else {
            return false;
        }

        // 交换位置
        [bookmarkIds[currentIndex], bookmarkIds[newIndex]] = [bookmarkIds[newIndex], bookmarkIds[currentIndex]];
        groupMap[targetGroupId] = bookmarkIds;
        setGroupMap(groupMap);

        console.log(curDate() + `书签: ${direction === 'up' ? '上移' : '下移'} ${bookmarkKey}`);
        return true;
    }

    // ──────────────────────────────────────────────────────────────────────
    // 13.4 数据管理（分组和书签数据存取）
    // ──────────────────────────────────────────────────────────────────────

    /**
     * 分组管理函数
     */
    // 获取一级分组列表 {id: name}
    function getTopLevelGroups() {
        const groups = getGV(TOP_LEVEL_GROUP_LIST);
        return groups && typeof groups === 'object' ? groups : {};
    }

    // 设置一级分组列表
    function setTopLevelGroups(groups) {
        setGV(TOP_LEVEL_GROUP_LIST, groups);
    }

    // 获取一级分组到二级分组的映射 {topLevelId: [secondLevelId数组]}
    function getTopLevelGroupMap() {
        const map = getGV(TOP_LEVEL_GROUP_MAP);
        return map && typeof map === 'object' ? map : {};
    }

    // 设置一级分组到二级分组的映射
    function setTopLevelGroupMap(map) {
        setGV(TOP_LEVEL_GROUP_MAP, map);
    }

    // 获取下一个一级分组ID（从1000开始）
    function getNextTopLevelGroupId() {
        const counter = parseInt(getGV(TOP_LEVEL_GROUP_ID_COUNTER)) || 999;
        const nextId = Math.max(counter, 999) + 1;
        setGV(TOP_LEVEL_GROUP_ID_COUNTER, nextId);
        return nextId;
    }

    // 将二级分组移动到指定的一级分组
    function moveSecondLevelGroupToTopLevel(secondLevelId, targetTopLevelId) {
        const topLevelGroupMap = getTopLevelGroupMap();
        
        // 从所有一级分组中移除该二级分组
        Object.keys(topLevelGroupMap).forEach(topLevelId => {
            if (topLevelGroupMap[topLevelId]) {
                topLevelGroupMap[topLevelId] = topLevelGroupMap[topLevelId].filter(id => id !== secondLevelId);
            }
        });
        
        // 添加到目标一级分组
        if (!topLevelGroupMap[targetTopLevelId]) {
            topLevelGroupMap[targetTopLevelId] = [];
        }
        if (!topLevelGroupMap[targetTopLevelId].includes(secondLevelId)) {
            topLevelGroupMap[targetTopLevelId].push(secondLevelId);
        }
        
        setTopLevelGroupMap(topLevelGroupMap);
    }

    // 从一级分组中移除二级分组（变为未归类）
    function removeSecondLevelGroupFromTopLevel(secondLevelId) {
        const topLevelGroupMap = getTopLevelGroupMap();
        
        // 从所有一级分组中移除该二级分组
        Object.keys(topLevelGroupMap).forEach(topLevelId => {
            if (topLevelGroupMap[topLevelId]) {
                topLevelGroupMap[topLevelId] = topLevelGroupMap[topLevelId].filter(id => id !== secondLevelId);
            }
        });
        
        setTopLevelGroupMap(topLevelGroupMap);
    }

    // 获取分组列表（对象数组：{id, name}）- 二级分组
    function getBookmarkGroups() {
        let groups = getGV(BOOKMARK_GROUP_LIST) || [];
        // 确保默认分组存在
        const hasDefault = groups.some(g => g.id === DEFAULT_GROUP_ID);
        if (!hasDefault) {
            groups.unshift({ id: DEFAULT_GROUP_ID, name: DEFAULT_GROUP_NAME });
            setGV(BOOKMARK_GROUP_LIST, groups);
        }
        return groups;
    }

    // 根据代号获取分组名称
    function getGroupNameById(groupId) {
        const groups = getBookmarkGroups();
        const group = groups.find(g => g.id === groupId);
        return group ? group.name : DEFAULT_GROUP_NAME;
    }

    // 根据名称获取分组代号
    function getGroupIdByName(groupName) {
        if (groupName === '全部') return null;
        const groups = getBookmarkGroups();
        const group = groups.find(g => g.name === groupName);
        return group ? group.id : DEFAULT_GROUP_ID;
    }

    // 分组背景色数组（用于区分不同分组）
    const GROUP_BACKGROUND_COLORS = [
        '#e3f2fd', // 浅蓝色
        '#f3e5f5', // 浅紫色
        '#e8f5e9', // 浅绿色
        '#fff3e0', // 浅橙色
        '#fce4ec', // 浅粉色
        '#e0f2f1', // 浅青色
        '#fff9c4', // 浅黄色
        '#f1f8e9', // 浅黄绿色
        '#ede7f6', // 浅蓝紫色
        '#e8eaf6'  // 浅靛蓝色
    ];

    // 根据分组ID获取对应的背景色
    function getGroupBackgroundColor(groupId) {
        if (groupId === null || groupId === undefined) {
            return '#f5f5f5'; // 默认灰色
        }
        const index = Math.abs(groupId) % GROUP_BACKGROUND_COLORS.length;
        return GROUP_BACKGROUND_COLORS[index];
    }

    // 添加一级分组（标签）
    function addTopLevelGroup(groupName) {
        if (!groupName || !groupName.trim()) {
            return false;
        }
        const trimmedName = groupName.trim();
        const topLevelGroups = getTopLevelGroups();
        // 检查名称是否已存在
        if (Object.values(topLevelGroups).some(name => name === trimmedName)) {
            return false; // 已存在
        }
        // 获取下一个ID（从1000开始）
        const newId = getNextTopLevelGroupId();
        topLevelGroups[newId] = trimmedName;
        setTopLevelGroups(topLevelGroups);
        // 初始化映射（空数组）
        const topLevelGroupMap = getTopLevelGroupMap();
        topLevelGroupMap[newId] = [];
        setTopLevelGroupMap(topLevelGroupMap);
        return true;
    }

    // 更新一级分组名称
    function updateTopLevelGroupName(topLevelId, newName) {
        if (!newName || !newName.trim()) {
            return false;
        }
        const trimmedName = newName.trim();
        const topLevelGroups = getTopLevelGroups();
        // 检查名称是否已存在（排除当前分组）
        if (Object.entries(topLevelGroups).some(([id, name]) => name === trimmedName && parseInt(id) !== topLevelId)) {
            return false; // 已存在
        }
        topLevelGroups[topLevelId] = trimmedName;
        setTopLevelGroups(topLevelGroups);
        return true;
    }

    // 更新二级分组名称
    function updateSecondLevelGroupName(groupId, newName) {
        if (!newName || !newName.trim()) {
            return false;
        }
        if (groupId === DEFAULT_GROUP_ID) {
            return false; // 不能修改默认分组名称
        }
        const trimmedName = newName.trim();
        const groups = getBookmarkGroups();
        // 检查名称是否已存在（排除当前分组）
        if (groups.some(g => g.name === trimmedName && g.id !== groupId)) {
            return false; // 已存在
        }
        const group = groups.find(g => g.id === groupId);
        if (!group) {
            return false;
        }
        group.name = trimmedName;
        setGV(BOOKMARK_GROUP_LIST, groups);
        return true;
    }

    // 添加分组
    function addBookmarkGroup(groupName) {
        if (!groupName || !groupName.trim()) {
            return false;
        }
        const trimmedName = groupName.trim();
        const groups = getBookmarkGroups();
        // 检查名称是否已存在
        if (groups.some(g => g.name === trimmedName)) {
            return false; // 已存在
        }
        // 计算新的代号（自增）
        const maxId = groups.length > 0 ? Math.max(...groups.map(g => g.id)) : DEFAULT_GROUP_ID;
        const newId = maxId + 1;
        groups.push({ id: newId, name: trimmedName });
        setGV(BOOKMARK_GROUP_LIST, groups);
        return true;
    }

    // 删除分组
    function deleteBookmarkGroup(groupName) {
        if (groupName === DEFAULT_GROUP_NAME) {
            return false; // 不能删除默认分组
        }
        const groups = getBookmarkGroups();
        const groupToDelete = groups.find(g => g.name === groupName);
        if (!groupToDelete) {
            return false;
        }
        const groupId = groupToDelete.id;
        // 从列表中删除
        const index = groups.findIndex(g => g.id === groupId);
        if (index === -1) {
            return false;
        }
        groups.splice(index, 1);
        setGV(BOOKMARK_GROUP_LIST, groups);

        // 将该分组下的所有书签移到默认分组（使用映射快速获取）
        const groupMap = getGroupMap();
        const bookmarkIds = groupMap[groupId] || [];
        bookmarkIds.forEach(id => {
            const key = getBookmarkKey(id);
            const data = getBookmarkData(key);
            if (data) {
                setBookmarkData(key, data.sites, DEFAULT_GROUP_ID, data.question, data.title);
            }
        });

        // 清理映射中的该分组
        delete groupMap[groupId];
        setGroupMap(groupMap);

        return true;
    }

    /**
     * 分组映射管理函数（性能优化：维护groupId到bookmarkKey数组的映射）
     * 存储时移除"bookmark-"前缀以节省空间
     */
    // 从bookmarkKey提取ID（移除前缀）
    function getBookmarkId(bookmarkKey) {
        if (typeof bookmarkKey === 'string' && bookmarkKey.startsWith(BOOKMARK_PREFIX)) {
            return bookmarkKey.substring(BOOKMARK_PREFIX.length);
        }
        return bookmarkKey; // 如果已经是ID格式，直接返回
    }

    // 从ID构建bookmarkKey（添加前缀）
    function getBookmarkKey(id) {
        if (typeof id === 'string' && id.startsWith(BOOKMARK_PREFIX)) {
            return id; // 如果已经是完整key，直接返回
        }
        return `${BOOKMARK_PREFIX}${id}`;
    }

    // 获取分组映射
    function getGroupMap() {
        let groupMap = getGV(BOOKMARK_GROUP_MAP);
        if (!groupMap || typeof groupMap !== 'object') {
            groupMap = {};
        }
        return groupMap;
    }

    // 保存分组映射
    function setGroupMap(groupMap) {
        setGV(BOOKMARK_GROUP_MAP, groupMap);
    }

    // 将书签添加到分组映射（存储时移除前缀）
    function addBookmarkToGroupMap(bookmarkKey, groupId) {
        const groupMap = getGroupMap();
        const normalizedGroupId = (typeof groupId === 'number') ? groupId : DEFAULT_GROUP_ID;
        const bookmarkId = getBookmarkId(bookmarkKey);

        if (!groupMap[normalizedGroupId]) {
            groupMap[normalizedGroupId] = [];
        }

        // 如果不在数组中，则添加（存储ID而非完整key）
        if (!groupMap[normalizedGroupId].includes(bookmarkId)) {
            groupMap[normalizedGroupId].push(bookmarkId);
            setGroupMap(groupMap);
        }
    }

    // 从分组映射中移除书签（比较时移除前缀）
    function removeBookmarkFromGroupMap(bookmarkKey, groupId) {
        const groupMap = getGroupMap();
        const normalizedGroupId = (typeof groupId === 'number') ? groupId : DEFAULT_GROUP_ID;
        const bookmarkId = getBookmarkId(bookmarkKey);

        if (groupMap[normalizedGroupId]) {
            groupMap[normalizedGroupId] = groupMap[normalizedGroupId].filter(k => k !== bookmarkId);
            setGroupMap(groupMap);
        }
    }

    // 将书签从一个分组移动到另一个分组
    function moveBookmarkInGroupMap(bookmarkKey, oldGroupId, newGroupId) {
        const normalizedOldGroupId = (typeof oldGroupId === 'number') ? oldGroupId : DEFAULT_GROUP_ID;
        const normalizedNewGroupId = (typeof newGroupId === 'number') ? newGroupId : DEFAULT_GROUP_ID;

        if (normalizedOldGroupId === normalizedNewGroupId) {
            return; // 分组未变化，无需更新
        }

        removeBookmarkFromGroupMap(bookmarkKey, normalizedOldGroupId);
        addBookmarkToGroupMap(bookmarkKey, normalizedNewGroupId);
    }

    // 从所有分组叠加获取全部书签ID（用于"全部"视图）
    function getAllBookmarkIds() {
        const groupMap = getGroupMap();
        const allIds = [];
        Object.values(groupMap).forEach(ids => {
            allIds.push(...ids);
        });
        return allIds;
    }

    // 初始化分组映射（确保映射完整性，从所有书签数据构建）
    function initGroupMap() {
        const groupMap = getGroupMap();
        // 获取所有可能的书签key（通过遍历所有GV key，查找bookmark-前缀的）
        const allKeys = [];
        // 由于无法直接遍历所有GV key，我们通过已知的bookmarkIdCounter来推断
        const counter = getGV(BOOKMARK_ID_COUNTER) || 0;
        let needUpdate = false;

        // 检查所有可能存在的书签
        for (let i = 1; i <= counter; i++) {
            const key = getBookmarkKey(i.toString());
            const data = getBookmarkData(key);
            if (data) {
                allKeys.push(key);
                const groupId = (typeof data.group === 'number') ? data.group : DEFAULT_GROUP_ID;
                const bookmarkId = getBookmarkId(key);
                const groupArray = groupMap[groupId] || [];
                if (!groupArray.includes(bookmarkId)) {
                    addBookmarkToGroupMap(key, groupId);
                    needUpdate = true;
                }
            }
        }

        // 清理映射中不存在的书签
        Object.keys(groupMap).forEach(groupId => {
            const bookmarkIds = groupMap[groupId];
            const validIds = bookmarkIds.filter(id => {
                const key = getBookmarkKey(id);
                return getBookmarkData(key) !== null;
            });
            if (validIds.length !== bookmarkIds.length) {
                groupMap[groupId] = validIds;
                needUpdate = true;
            }
        });

        if (needUpdate) {
            setGroupMap(groupMap);
        }
    }

    /**
     * 获取书签数据
     */
    function getBookmarkData(bookmarkKey) {
        const data = getGV(bookmarkKey);
        if (!data) return null;
        return {
            sites: data.sites || [],
            group: (typeof data.group === 'number') ? data.group : DEFAULT_GROUP_ID,
            question: data.question || '',
            title: data.title || ''
        };
    }

    /**
     * 设置书签数据（group使用代号）
     */
    function setBookmarkData(bookmarkKey, sites, group, question, title) {
        const oldData = getBookmarkData(bookmarkKey);
        const oldGroupId = oldData ? oldData.group : DEFAULT_GROUP_ID;
        const newGroupId = (typeof group === 'number') ? group : DEFAULT_GROUP_ID;

        setGV(bookmarkKey, {
            sites: sites || [],
            group: newGroupId,
            question: truncateBookmarkQuestion(question || ''),
            title: title || ''
        });

        // 更新分组映射（如果分组发生变化）
        if (oldGroupId !== newGroupId) {
            moveBookmarkInGroupMap(bookmarkKey, oldGroupId, newGroupId);
        } else if (!oldData) {
            // 新书签，直接添加到映射
            addBookmarkToGroupMap(bookmarkKey, newGroupId);
        }
    }

    /**
     * 设置书签分组（group使用代号）
     */
    function setBookmarkGroup(bookmarkKey, groupId) {
        const data = getBookmarkData(bookmarkKey);
        if (!data) return false;
        const oldGroupId = data.group;
        const newGroupId = groupId || DEFAULT_GROUP_ID;
        setBookmarkData(bookmarkKey, data.sites, newGroupId, data.question, data.title);
        // 更新分组映射
        moveBookmarkInGroupMap(bookmarkKey, oldGroupId, newGroupId);
        return true;
    }

    /**
     * 获取所有书签数据（性能优化：使用分组映射快速获取）
     */
    function getAllBookmarks(filterGroupId = null) {
        let bookmarkIds;
        if (filterGroupId === null) {
            // 全部：从所有分组叠加获取，按ID降序排序
            bookmarkIds = getAllBookmarkIds();
            // 按ID数字降序排序（ID大的在前面，即最新的在前面）
            bookmarkIds.sort((a, b) => {
                const numA = parseInt(a, 10) || 0;
                const numB = parseInt(b, 10) || 0;
                return numB - numA; // 降序
            });
        } else {
            // 指定分组：使用映射快速获取
            const groupMap = getGroupMap();
            bookmarkIds = groupMap[filterGroupId] || [];
        }
        // 将ID转换为完整key
        const keyList = bookmarkIds.map(id => getBookmarkKey(id));

        // 无数据时直接返回，避免循环边界错误导致死循环
        if (keyList.length === 0) return [];

        const bookmarks = [];
        if (filterGroupId === null) {
            // 全部视图：按排序后的keyList正序遍历
            for (let i = 0; i < keyList.length; i += 1) {
                const key = keyList[i];
                const data = getBookmarkData(key);
                if (!data || !data.sites || data.sites.length === 0) continue;
                const question = data.question || '';
                const title = data.title || '';
                bookmarks.push({
                    question,
                    title,
                    sites: data.sites,
                    group: getGroupNameById(data.group || DEFAULT_GROUP_ID),
                    groupId: data.group || DEFAULT_GROUP_ID,
                    bookmarkKey: key
                });
            }
        } else {
            // 分组视图：倒序让最新的在上面
            for (let i = keyList.length - 1; i >= 0; i -= 1) {
                const key = keyList[i];
                const data = getBookmarkData(key);
                if (!data || !data.sites || data.sites.length === 0) continue;
                if (data.group !== filterGroupId) continue; // 双重校验分组
                const question = data.question || '';
                const title = data.title || '';
                bookmarks.push({
                    question,
                    title,
                    sites: data.sites,
                    group: getGroupNameById(data.group || DEFAULT_GROUP_ID),
                    groupId: data.group || DEFAULT_GROUP_ID,
                    bookmarkKey: key
                });
            }
        }
        return bookmarks;
    }

    // ──────────────────────────────────────────────────────────────────────
    // 13.5 UI界面
    // ──────────────────────────────────────────────────────────────────────
    let TITLE_SUB_LEN = 40;

    /**
     * 处理编辑书签标题的点击事件
     */
    function editBookmarkTitle(title, bookmarkKey, titleText, editBtn, titleContainer) {
        // 创建编辑输入框
        const input = document.createElement('input');
        input.type = 'text';
        input.value = title;
        input.style.cssText = 'flex:1;padding:4px;border:1px solid #ddd;border-radius:4px;font-size:14px';

        // 替换显示
        titleText.style.display = 'none';
        editBtn.style.display = 'none';

        const inputContainer = createTag('div', "", 'flex:1;display:flex;gap:4px;align-items:center');
        inputContainer.appendChild(input);

        // 保存按钮
        const saveBtn = createTag('button', '✓', SETTINGS_STYLES.saveBtn);
        saveBtn.title = '保存';
        saveBtn.addEventListener('mouseenter', () => saveBtn.style.opacity = '0.85');
        saveBtn.addEventListener('mouseleave', () => saveBtn.style.opacity = '1');
        inputContainer.appendChild(saveBtn);

        titleContainer.appendChild(inputContainer);

        // 保存逻辑
        saveBtn.addEventListener('click', () => {
            const newTitle = input.value.trim();
            const data = getBookmarkData(bookmarkKey);
            if (!data) return;

            setBookmarkData(bookmarkKey, data.sites, data.group, data.question, newTitle);
            // 更新显示（只显示前xx字）
            const displayTitle = newTitle.length > TITLE_SUB_LEN ? newTitle.substring(0, TITLE_SUB_LEN) + '...' : newTitle;
            titleText.textContent = displayTitle;
            titleText.title = newTitle;
            // 恢复显示
            titleText.style.display = '';
            editBtn.style.display = '';
            titleContainer.removeChild(inputContainer);
        });

        // 自动聚焦
        input.focus();
        input.select();
    }

    /**
     * 创建排序列
     * @param {number} index - 当前索引
     */
    function createSortColumn(bookmarkKey, index, bookmarks, currentGroupId, tr) {
        const TD_SORT_STYLE =    'padding:2px;vertical-align:top;white-space:nowrap;text-align:left;border:1px solid #ddd';
        const TOP_BTN_STYLE =    'padding:4px 2px;background:transparent;border:none;cursor:pointer;font-size:16px;color:#3498db';
        const UP_DOWN_BTN_STYLE ='padding:4px 2px;background:transparent;border:none;cursor:pointer;font-size:16px;color:#95a5a6';

        const tdSort = createTag('td', "", TD_SORT_STYLE);

        // 置顶按钮（显示中最上面，存储中移到最后）
        const topBtn = createTag('button', '⬆', TOP_BTN_STYLE);
        topBtn.title = '置顶';
        // 获取当前分组内的书签列表
        const groupMap = getGroupMap();
        const bookmarkIds = currentGroupId !== null ? (groupMap[currentGroupId] || []) : getAllBookmarkIds();
        const bookmarkId = getBookmarkId(bookmarkKey);
        const storageIndex = bookmarkIds.indexOf(bookmarkId);
        // 显示中 index=0 对应存储列表的最后一个，如果已经在最后则不能置顶
        const canMoveTop = storageIndex !== -1 && storageIndex < bookmarkIds.length - 1;
        if (!canMoveTop) {
            topBtn.style.opacity = '0.5';
            topBtn.style.cursor = 'not-allowed';
        } else {
            topBtn.addEventListener('click', () => {
                if (moveBookmarkInList(bookmarkKey, 'bottom', currentGroupId)) {
                    showBookmarkWindow(currentGroupId);
                }
            });
        }

        // 上移按钮（显示中向上，存储中向下）
        const upBtn = createTag('button', '↑', UP_DOWN_BTN_STYLE);
        upBtn.title = '上移';
        const canMoveUp = index > 0;
        if (!canMoveUp) {
            upBtn.style.opacity = '0.5';
            upBtn.style.cursor = 'not-allowed';
        } else {
            upBtn.addEventListener('click', () => {
                // 显示中向上 = 存储中向下
                if (moveBookmarkInList(bookmarkKey, 'down', currentGroupId)) {
                    showBookmarkWindow(currentGroupId);
                }
            });
        }

        // 下移按钮（显示中向下，存储中向上）
        const downBtn = createTag('button', '↓', UP_DOWN_BTN_STYLE);
        downBtn.title = '下移';
        const canMoveDown = index < bookmarks.length - 1;
        if (!canMoveDown) {
            downBtn.style.opacity = '0.5';
            downBtn.style.cursor = 'not-allowed';
        } else {
            downBtn.addEventListener('click', () => {
                // 显示中向下 = 存储中向上
                if (moveBookmarkInList(bookmarkKey, 'up', currentGroupId)) {
                    showBookmarkWindow(currentGroupId);
                }
            });
        }

        appendSeveral(tdSort, topBtn, upBtn, downBtn);
        tr.appendChild(tdSort);
    }

    /**
     * 创建站点列单元格
     */
    function createSitesColumn(sites, bookmarkKey, currentGroupId, linkStyle) {
        const tdSites = createTag('td', "", 'max-width:160px;padding:5px;vertical-align:middle;border:1px solid #ddd');

        // 按星标状态排序：星标的在前
        const sortedSites = [...sites].sort((a, b) => {
            const aStarred = a.starred ? 1 : 0;
            const bStarred = b.starred ? 1 : 0;
            return bStarred - aStarred;
        });

        sortedSites.forEach(s => {
            // 站点链接容器
            const siteContainer = createTag('div', "", 'display:inline-flex;align-items:center;margin-right:5px;margin-bottom:2px;position:relative');

            // 星标emoji（如果已星标）
            if (s.starred) {
                const starEmoji = createTag('span', '⭐', 'margin-right:2px;font-size:14px');
                siteContainer.appendChild(starEmoji);
            }

            // 站点链接
            const siteName = siteToWord[s.site] || s.site;
            const link = createTag('a', siteName, linkStyle);
            // 从路径部分拼接完整URL
            link.href = buildFullUrl(s.url, s.site);
            link.style.marginRight = '4px';
            link.addEventListener('click', (e) => {
                e.preventDefault();
                s[jumpIfOpen] = true;
                jumpToSite(s);
            });
            siteContainer.appendChild(link);

            // 三点按钮（悬停时显示）
            const moreBtn = createTag('button', '⋮', 'padding:2px 3px;background:transparent;border:none;cursor:pointer;font-size:20px;color:#666;opacity:0;transition:opacity 0.2s;vertical-align:middle;line-height:1');
            moreBtn.title = '更多操作';

            // 菜单容器
            const menuContainer = createTag('div', "", 'position:absolute;top:100%;right:0;background:white;border:1px solid #ddd;border-radius:4px;box-shadow:0 2px 8px rgba(0,0,0,0.15);z-index:1000;display:none;min-width:120px;margin-top:4px');

            // 点击外部关闭菜单的处理器
            let closeMenuHandler = null;

            // 悬停显示三点按钮
            siteContainer.addEventListener('mouseenter', () => {
                moreBtn.style.opacity = '1';
            });
            siteContainer.addEventListener('mouseleave', () => {
                setTimeout(() => {
                    moreBtn.style.opacity = '0';
                    menuContainer.style.display = 'none';
                }, 500);
            });

            // 星标按钮
            const starBtn = createTag('button', s.starred ? '⭐ 取消星标' : '⭐ 设为星标', 'width:100%;padding:8px 12px;background:transparent;border:none;cursor:pointer;text-align:left;font-size:13px;color:#333');
            starBtn.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation();
                // 关闭菜单
                menuContainer.style.display = 'none';
                if (closeMenuHandler) {
                    document.removeEventListener('click', closeMenuHandler);
                    closeMenuHandler = null;
                }
                if (toggleSiteStarred(bookmarkKey, s.site)) {
                    showBookmarkWindow(currentGroupId);
                }
            });
            starBtn.addEventListener('mouseenter', () => starBtn.style.backgroundColor = '#f5f5f5');
            starBtn.addEventListener('mouseleave', () => starBtn.style.backgroundColor = 'transparent');
            menuContainer.appendChild(starBtn);

            // 移除按钮（只有当站点数量大于1时才显示）
            if (sites.length > 1) {
                const removeBtn = createTag('button', '🗑️ 移除', 'width:100%;padding:8px 12px;background:transparent;border:none;cursor:pointer;text-align:left;font-size:13px;color:#333;border-top:1px solid #eee');
                removeBtn.addEventListener('click', (e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    // 关闭菜单
                    menuContainer.style.display = 'none';
                    if (closeMenuHandler) {
                        document.removeEventListener('click', closeMenuHandler);
                        closeMenuHandler = null;
                    }
                    if (removeSiteFromBookmark(bookmarkKey, s.site)) {
                        showBookmarkWindow(currentGroupId);
                    }
                });
                removeBtn.addEventListener('mouseenter', () => removeBtn.style.backgroundColor = '#f5f5f5');
                removeBtn.addEventListener('mouseleave', () => removeBtn.style.backgroundColor = 'transparent');
                menuContainer.appendChild(removeBtn);
            }

            // 点击三点按钮显示/隐藏菜单
            moreBtn.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation();
                const isVisible = menuContainer.style.display === 'block';
                if (isVisible) {
                    menuContainer.style.display = 'none';
                    if (closeMenuHandler) {
                        document.removeEventListener('click', closeMenuHandler);
                        closeMenuHandler = null;
                    }
                } else {
                    menuContainer.style.display = 'block';
                    // 添加点击外部关闭菜单的监听器
                    if (!closeMenuHandler) {
                        closeMenuHandler = (e) => {
                            if (!siteContainer.contains(e.target)) {
                                menuContainer.style.display = 'none';
                                document.removeEventListener('click', closeMenuHandler);
                                closeMenuHandler = null;
                            }
                        };
                        // 使用setTimeout确保当前点击事件处理完成后再添加监听器
                        setTimeout(() => {
                            document.addEventListener('click', closeMenuHandler);
                        }, 0);
                    }
                }
            });

            // 右键三点按钮显示菜单
            moreBtn.addEventListener('contextmenu', (e) => {
                e.preventDefault();
                e.stopPropagation();
                menuContainer.style.display = 'block';
                // 设置菜单位置
                const rect = moreBtn.getBoundingClientRect();
                menuContainer.style.top = rect.bottom + 'px';
                menuContainer.style.right = '0';
                // 添加点击外部关闭菜单的监听器
                if (!closeMenuHandler) {
                    closeMenuHandler = (e) => {
                        if (!siteContainer.contains(e.target)) {
                            menuContainer.style.display = 'none';
                            document.removeEventListener('click', closeMenuHandler);
                            closeMenuHandler = null;
                        }
                    };
                    setTimeout(() => {
                        document.addEventListener('click', closeMenuHandler);
                    }, 0);
                }
            });

            siteContainer.appendChild(moreBtn);
            siteContainer.appendChild(menuContainer);
            tdSites.appendChild(siteContainer);
        });

        // 添加加号按钮容器
        const addBtnContainer = createTag('div', "", 'display:inline-flex;align-items:center;margin-right:5px;margin-bottom:2px;position:relative');

        // 加号按钮
        const addBtn = createTag('button', '+', 'padding:2px;background:transparent;border:none;cursor:pointer;font-size:24px;color:#666;border-radius:3px;font-weight:bold;line-height:1');
        addBtn.title = '添加链接';
        addBtn.style.marginRight = '4px';

        // 保存当前打开的输入框引用
        let currentInputContainer = null;
        let closeInputHandler = null;

        // 关闭输入框的函数
        const closeInput = () => {
            if (currentInputContainer) {
                currentInputContainer.remove();
                currentInputContainer = null;
            }
            if (closeInputHandler) {
                document.removeEventListener('click', closeInputHandler);
                closeInputHandler = null;
            }
        };

        // 点击加号按钮显示输入框
        addBtn.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();

            // 如果已有输入框打开，先关闭
            if (currentInputContainer) {
                closeInput();
                return;
            }

            // 创建输入框容器
            currentInputContainer = createTag('div', "", 'position:absolute;top:100%;left:0;background:white;border:1px solid #ddd;border-radius:4px;box-shadow:0 2px 8px rgba(0,0,0,0.15);z-index:1000;padding:10px;min-width:300px;margin-top:4px');

            // 输入框标签
            const label = createTag('label', '添加链接：', 'display:block;margin-bottom:5px;font-size:13px;color:#333');
            currentInputContainer.appendChild(label);

            // 输入框
            const input = createTag('input', '', 'width:100%;padding:6px;border:1px solid #ddd;border-radius:3px;font-size:13px;box-sizing:border-box');
            input.type = 'text';
            input.placeholder = 'https://...';
            currentInputContainer.appendChild(input);

            // 按钮容器
            const btnContainer = createTag('div', "", 'display:flex;gap:8px;margin-top:8px;justify-content:flex-end');

            // 保存链接的函数
            const saveLink = () => {
                let url = input.value.trim();
                if (!url) {
                    alert('请输入链接');
                    return;
                }

                // 如果没有协议前缀，自动添加https://
                if (!url.match(/^https?:\/\//i)) {
                    url = 'https://' + url;
                }

                // 识别站点
                const siteId = identifySiteFromUrl(url);
                if (siteId === null) {
                    alert('无法识别链接所属站点，请确保链接来自支持的站点');
                    return;
                }

                // 检查是否已存在该站点
                const existingSite = sites.find(s => s.site === siteId);
                if (existingSite) {
                    alert(`该站点（${siteToWord[siteId] || siteId}）已存在`);
                    closeInput();
                    return;
                }

                // 保存链接
                updateBookmarkData(bookmarkKey, siteId, url);

                // 关闭输入框
                closeInput();

                // 刷新显示
                showBookmarkWindow(currentGroupId);
            };

            // 取消按钮
            const cancelBtn = createTag('button', '取消', 'padding:6px 12px;background:#f5f5f5;border:1px solid #ddd;border-radius:3px;cursor:pointer;font-size:13px;color:#333');
            cancelBtn.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation();
                closeInput();
            });
            btnContainer.appendChild(cancelBtn);

            // 确定按钮
            const confirmBtn = createTag('button', '确定', 'padding:6px 12px;background:#4CAF50;border:none;border-radius:3px;cursor:pointer;font-size:13px;color:white');
            confirmBtn.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation();
                saveLink();
            });
            btnContainer.appendChild(confirmBtn);

            currentInputContainer.appendChild(btnContainer);
            addBtnContainer.appendChild(currentInputContainer);

            // 按Enter键确认
            input.addEventListener('keydown', (e) => {
                if (e.key === 'Enter') {
                    e.preventDefault();
                    saveLink();
                } else if (e.key === 'Escape') {
                    e.preventDefault();
                    closeInput();
                }
            });

            // 点击外部关闭输入框
            closeInputHandler = (e) => {
                if (!currentInputContainer.contains(e.target) && e.target !== addBtn) {
                    closeInput();
                }
            };
            setTimeout(() => {
                document.addEventListener('click', closeInputHandler);
            }, 0);

            // 聚焦输入框
            setTimeout(() => {
                input.focus();
            }, 0);
        });

        addBtnContainer.appendChild(addBtn);
        tdSites.appendChild(addBtnContainer);

        return tdSites;
    }

    /**
     * 渲染书签列表内容（表格部分）
     * @param {HTMLElement} content - 内容容器
     * @param {number|null} currentGroupId - 当前选中的分组代号
     * @param {Array} groups - 分组列表
     */
    function renderTableOfBookmark(content, currentGroupId, groups) {
        // CSS样式变量（属性超过2个的样式）
        const EMPTY_TABLE_TIP_STYLE = 'color:#666;text-align:center;padding:5px 20px';
        const TABLE_STYLE = 'width:100%;border-collapse:collapse;font-size:14px';
        const TH_STYLE = 'padding:10px;text-align:left;border:1px solid #ddd';
        const TD_STYLE = 'padding:5px;vertical-align:top;white-space:nowrap;border:1px solid #ddd';
        const TD_OPERATION_STYLE = 'max-width:150px;padding:5px;vertical-align:top;white-space:nowrap;border:1px solid #ddd';
        const TD_QUESTION_STYLE = 'padding:10px;max-width:300px;word-break:break-all;vertical-align:top;position:relative;border:1px solid #ddd';
        const QUESTION_CONTAINER_STYLE = 'display:flex;align-items:center;gap:0px';
        const EDIT_BTN_STYLE = 'padding:4px;background:transparent;border:none;cursor:pointer;font-size:16px;flex-shrink:0;color:#666';
        const LINK_STYLE = 'color:#1e3a8a;text-decoration:none;margin-right:auto 10px;cursor:pointer';
        const JUMP_BTN_STYLE = 'padding:6px 12px;background:#f5f5f5;color:#000;border:1px solid #ddd;border-radius:4px;cursor:pointer;font-size:12px;margin-right:8px';
        const DEL_BTN_STYLE = 'padding:6px 3px;background:transparent;border:none;cursor:pointer;font-size:18px;color:#ff6b6b';
        const GROUP_SELECT_BASE_STYLE = 'padding:4px 8px;border:1px solid #ddd;border-radius:4px;font-size:13px;cursor:pointer;min-width:50px';

        // 获取书签（根据选中的分组过滤，使用代号）
        const bookmarks = getAllBookmarks(currentGroupId);

        if (bookmarks.length === 0) {
            const emptyTableTip = createHtml('p', '暂无多选同步提问的书签，点击屏幕边缘的书签按钮可添加书签', EMPTY_TABLE_TIP_STYLE);
            content.appendChild(emptyTableTip);
            return;
        }

        // 创建表格
        const table = createTag('table', "", TABLE_STYLE);

        // 表头（冻结）
        const TH_STICKY_STYLE = `${TH_STYLE};position:sticky;top:0;background:#f5f5f5;z-index:5`;
        let theadHtml = `<tr style="background:#f5f5f5"><th style="${TH_STICKY_STYLE}">分组</th><th style="${TH_STICKY_STYLE}">提问</th><th style="${TH_STICKY_STYLE}">站点链接</th><th style="${TH_STICKY_STYLE}">操作</th><th style="${TH_STICKY_STYLE}">排序</th></tr>`;
        const thead = createHtml('thead', theadHtml, '');
        table.appendChild(thead);

        // 表体
        const tbody = createTag('tbody', "", "");
        bookmarks.forEach((bookmark, index) => {
            const tr = createTag('tr', "", 'border-bottom:1px solid #eee');

            const bookmarkKey = bookmark.bookmarkKey;
            const bookmarkGroupName = bookmark.group || DEFAULT_GROUP_NAME;
            const bookmarkGroupId = bookmark.groupId !== undefined ? bookmark.groupId : getGroupIdByName(bookmarkGroupName);

            // 1、分组列
            const groupBgColor = getGroupBackgroundColor(bookmarkGroupId);
            const tdGroup = createTag('td', "", TD_STYLE);
            const groupSelect = createTag('div', bookmarkGroupName, `${GROUP_SELECT_BASE_STYLE};background:${groupBgColor};cursor:pointer;color:#333;text-align:center`);
            groupSelect.setAttribute('data-bookmark-key', bookmarkKey);
            groupSelect.title = '点击选中此行，然后点击表格上方的分组按钮来更换此条书签的分组；再次点击可取消选中';
            
            // 点击分组列时选中/取消选中该行
            groupSelect.addEventListener('click', () => {
                const isCurrentlySelected = selectedBookmarkKey === bookmarkKey;
                
                if (isCurrentlySelected) {
                    // 当前行已选中，取消选中
                    tr.style.backgroundColor = '';
                    selectedBookmarkKey = null;
                } else {
                    // 清除之前选中的行
                    const allRows = document.querySelectorAll('#bookmark-popup tr[data-bookmark-key]');
                    allRows.forEach(row => {
                        row.style.backgroundColor = '';
                    });
                    // 选中当前行
                    tr.style.backgroundColor = '#e3f2fd';
                    selectedBookmarkKey = bookmarkKey;
                }
            });
            
            tr.setAttribute('data-bookmark-key', bookmarkKey);
            tdGroup.appendChild(groupSelect);
            tr.appendChild(tdGroup);

            // 2、提问列
            const tdQuestion = createTag('td', "", TD_QUESTION_STYLE);

            // 标题容器（在上）
            const titleContainer = createTag('div', "", 'display:flex;align-items:center;gap:0px;margin-bottom:8px');
            const fullTitle = bookmark.title || bookmark.question || '';
            const titleDisplay = fullTitle.length > TITLE_SUB_LEN ? fullTitle.substring(0, TITLE_SUB_LEN) + '...' : fullTitle;
            const titleText = createTag('span', titleDisplay, 'flex:1;word-break:break-all;font-weight:bold;color:#333');
            titleText.title = fullTitle;
            titleContainer.appendChild(titleText);

            // 标题编辑按钮
            const titleEditBtn = createTag('button', '✏️', EDIT_BTN_STYLE);
            titleEditBtn.title = '编辑标题';
            titleEditBtn.addEventListener('click', () => {
                editBookmarkTitle(fullTitle, bookmarkKey, titleText, titleEditBtn, titleContainer);
            });
            titleContainer.appendChild(titleEditBtn);
            tdQuestion.appendChild(titleContainer);

            // 如果 title 和 question 内容相同，只显示 title，否则显示提问内容
            // 兼容历史情况：title 为空时，使用 question 作为 title，此时不显示 question（避免重复）
            const questionContent = bookmark.question || '';
            // fullTitle 是实际显示的标题（兼容历史数据：title 为空时用 question）
            // 如果 fullTitle 和 questionContent 相同，则不显示 question
            if (fullTitle !== questionContent) {
                // 提问内容容器（在下）
                const questionContainer = createTag('div', "", QUESTION_CONTAINER_STYLE);

                // 提问文本（不可编辑）
                const SUB_LEN = 80;
                const questionTextContent = questionContent.length > SUB_LEN ? questionContent.substring(0, SUB_LEN) + '...' : questionContent;
                const questionText = createTag('span', questionTextContent, 'flex:1;word-break:break-all;color:#666');
                questionText.title = questionContent;
                questionContainer.appendChild(questionText);

                tdQuestion.appendChild(questionContainer);
            }

            tr.appendChild(tdQuestion);

            // 3、站点列
            const tdSites = createSitesColumn(bookmark.sites, bookmarkKey, currentGroupId, LINK_STYLE);
            tr.appendChild(tdSites);

            // 4、操作列
            const tdAction = createTag('td', "", TD_OPERATION_STYLE);

            // 一键跳转按钮
            const jumpBtn = createTag('button', '一键跳转', JUMP_BTN_STYLE);
            jumpBtn.title = '前提是已打开各家网页（任意页面皆可）';
            jumpBtn.addEventListener('click', () => sendJumpSignalToAll(bookmark.sites));
            jumpBtn.addEventListener('mouseenter', () => jumpBtn.style.opacity = '0.85');
            jumpBtn.addEventListener('mouseleave', () => jumpBtn.style.opacity = '1');

            // 删除按钮
            const delBtn = createTag('button', '✕', DEL_BTN_STYLE);
            delBtn.title = '删除此书签，无法恢复';
            delBtn.addEventListener('click', () => {
                removeBookmark(bookmarkKey);
                showBookmarkWindow();
            });
            appendSeveral(tdAction, jumpBtn, delBtn);

            tr.appendChild(tdAction);

            // 5、排序列
            createSortColumn(bookmarkKey, index, bookmarks, currentGroupId, tr);

            tbody.appendChild(tr);
        });
        table.appendChild(tbody);
        
        // 创建可滚动的表格容器
        const tableContainer = createTag('div', "", 'flex:1;overflow-y:auto;overflow-x:auto;min-height:0');
        tableContainer.appendChild(table);
        content.appendChild(tableContainer);
    }

    /**
     * 显示书签列表弹窗
     * @param {number|null} selectedGroupId - 选中的分组代号，null表示"全部"
     * @param {boolean} skipSaveGroup - 是否跳过保存分组选择，true时不更新GV
     */
    function showBookmarkWindow(selectedGroupId = null, skipSaveGroup = false) {
        // 重置选中的书签（每次打开弹窗时）
        selectedBookmarkKey = null;
        
        // CSS样式变量（属性超过2个的样式）
        const POPUP_SIZE_STYLE = 'width:65%;height:90%;overflow:hidden;display:flex;flex-direction:column';
        const HEADER_STYLE = 'display:flex;justify-content:space-between;align-items:center;margin-bottom:15px;padding-bottom:10px;border-bottom:1px solid #eee;flex-shrink:0;background:white;z-index:10';
        const CLOSE_BTN_STYLE = 'cursor:pointer;font-size:20px;color:#999;padding:5px';
        const TAB_BASE_STYLE = 'padding:6px 12px;border-radius:4px;cursor:pointer;font-size:13px;color:#333';
        const TAB_CONTAINER_STYLE = 'display:flex;align-items:flex-start;gap:8px;margin-bottom:15px;padding-bottom:10px;border-bottom:1px solid #eee;flex-wrap:wrap;flex-shrink:0;background:white;z-index:10;position:sticky;top:0';
        const ADD_GROUP_BTN_STYLE = 'padding:6px 12px;background:#4caf50;color:white;border:none;border-radius:4px;cursor:pointer;font-size:13px';
        const ADD_TAG_BTN_STYLE = 'padding:6px 12px;background:#2196f3;color:white;border:none;border-radius:4px;cursor:pointer;font-size:13px';
        
        // 一级分组容器样式
        const TOP_LEVEL_CONTAINER_STYLE = 'display:inline-block;margin-bottom:15px;margin-right:15px;padding:3px 8px;border:1px solid #ddd;border-radius:4px;width:fit-content;vertical-align:top';
        // 一级分组标题样式
        const TOP_LEVEL_HEADER_STYLE = 'font-weight:bold;font-size:14px;margin-bottom:3px;color:#333;padding:2px 0';
        // 二级分组按钮容器默认样式
        const SECOND_LEVEL_CONTAINER_DEFAULT_STYLE = 'margin-bottom:3px;max-height:80px;overflow:hidden;line-height:1.5';

        // 获取分组列表（提前获取，避免重复调用），按名称排序
        const groups = getBookmarkGroups()
            .slice()
            .sort((a, b) => (a.name || '').localeCompare(b.name || '', 'zh-Hans'));

        // 如果selectedGroupId为null（首次打开），从存储中读取上次选中的分组ID
        // 但如果skipSaveGroup为true，则跳过读取，直接使用null（用于"立即查看书签列表"按钮）
        if (selectedGroupId === null && !skipSaveGroup) {
            const lastSelectedGroupId = getGV(BOOKMARK_LAST_SELECTED_GROUP);
            if (lastSelectedGroupId !== null && lastSelectedGroupId !== undefined) {
                // 检查该分组是否还存在
                const groupExists = groups.some(g => g.id === lastSelectedGroupId);
                if (groupExists) {
                    selectedGroupId = lastSelectedGroupId;
                } else {
                    // 分组不存在，清除保存的值，使用null（显示全部）
                    setGV(BOOKMARK_LAST_SELECTED_GROUP, null);
                }
            }
        }

        // 检查弹窗是否已存在
        const existingPopup = document.getElementById('bookmark-popup');
        let popup, content;

        if (existingPopup) {
            // 弹窗已存在，复用它（避免闪烁）
            popup = existingPopup;
            content = popup.firstElementChild; // content是popup的第一个子元素
            // 清空内容，准备重新填充
            if (content) {
                content.replaceChildren(); // 使用replaceChildren代替innerHTML
            }
        } else {
            // 首次创建弹窗，固定宽度60%，高度80%
            const result = createPopupBase('bookmark-popup', ';' + POPUP_SIZE_STYLE);
            popup = result.popup;
            content = result.content;
        }

        // 标题栏
        const header = createHtml('div', '<h3 style="margin:0;color:#333">📚 书签列表</h3>', HEADER_STYLE);

        const closeBtn = createTag('span', '✕', CLOSE_BTN_STYLE);
        closeBtn.onclick = () => {
            if (popup && popup.parentNode) {
                popup.remove();
            }
        };
        header.appendChild(closeBtn);
        content.appendChild(header);

        // 分组管理区域
        const currentGroupId = selectedGroupId;

        // Tab切换函数（统一处理保存和切换）
        // 用户主动点击tab时，应该恢复正常保存行为（skipSaveGroup设为false）
        const switchToGroup = (groupId, skipSave = false) => {
            if (!skipSave && !skipSaveGroup) {
                setGV(BOOKMARK_LAST_SELECTED_GROUP, groupId);
            }
            // 用户主动点击tab时，重置skipSaveGroup为false，恢复正常保存行为
            showBookmarkWindow(groupId, skipSave);
        };

        // 创建Tab函数（统一处理全部和分组tab）
        const createGroupTab = (text, groupId, isSelected, bgColor, isBold = false, isSecondLevel = true) => {
            const fontWeight = isBold ? 'font-weight:bold;' : '';
            const border = isSelected ? '2px solid #667eea' : '1px solid transparent';
            const displayStyle = isSecondLevel ? 'display:inline-block;' : '';
            const tab = createTag('div', text, `${TAB_BASE_STYLE};${displayStyle}${fontWeight}background:${bgColor};border:${border}`);
            
            if (isSecondLevel && groupId !== null) {
                // 二级分组按钮：点击时如果有选中的书签，则切换分组；否则切换视图
                tab.setAttribute('data-group-id', groupId);
                // 默认cursor为pointer，只有按住时才可拖拽
                tab.style.cursor = 'pointer';
                tab.draggable = false;
                
                let isDragging = false;
                let isMouseDown = false;
                
                // 鼠标按下时启用拖拽
                tab.addEventListener('mousedown', (e) => {
                    isMouseDown = true;
                    tab.draggable = true;
                    // 延迟一点时间，避免立即触发拖拽
                    setTimeout(() => {
                        if (isMouseDown) {
                            tab.style.cursor = 'move';
                        }
                    }, 100);
                });
                
                // 鼠标释放时禁用拖拽
                tab.addEventListener('mouseup', (e) => {
                    isMouseDown = false;
                    tab.draggable = false;
                    tab.style.cursor = 'pointer';
                });
                
                // 鼠标离开时也禁用拖拽
                tab.addEventListener('mouseleave', (e) => {
                    isMouseDown = false;
                    tab.draggable = false;
                    tab.style.cursor = 'pointer';
                });
                
                tab.addEventListener('dragstart', (e) => {
                    isDragging = true;
                    e.dataTransfer.setData('text/plain', groupId.toString());
                    e.dataTransfer.effectAllowed = 'move';
                    tab.style.opacity = '0.5';
                });
                
                tab.addEventListener('dragend', (e) => {
                    tab.style.opacity = '1';
                    tab.draggable = false;
                    tab.style.cursor = 'pointer';
                    isMouseDown = false;
                    // 延迟重置，避免触发点击事件
                    setTimeout(() => {
                        isDragging = false;
                    }, 100);
                });
                
                // 双击编辑分组名称
                let lastClickTime = 0;
                tab.addEventListener('dblclick', (e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    if (isDragging) return;
                    
                    const currentName = text;
                    const newName = prompt('请输入新的分组名称：', currentName);
                    if (newName && newName.trim() && newName.trim() !== currentName) {
                        if (updateSecondLevelGroupName(groupId, newName.trim())) {
                            showBookmarkWindow(currentGroupId);
                        } else {
                            showMessagePopup('分组名称已存在或无效');
                        }
                    }
                });
                
                tab.addEventListener('click', (e) => {
                    // 如果刚刚拖拽过，不触发点击事件
                    if (isDragging) {
                        e.preventDefault();
                        e.stopPropagation();
                        return;
                    }
                    
                    // 处理双击：如果两次点击间隔很短，可能是双击，延迟处理单击
                    const now = Date.now();
                    if (now - lastClickTime < 300) {
                        // 可能是双击，不处理单击
                        lastClickTime = 0;
                        return;
                    }
                    lastClickTime = now;
                    
                    // 延迟处理单击，避免与双击冲突
                    setTimeout(() => {
                        if (lastClickTime === now) {
                            if (selectedBookmarkKey) {
                                // 有选中的书签，切换分组
                                if (setBookmarkGroup(selectedBookmarkKey, groupId)) {
                                    selectedBookmarkKey = null;
                                    // 清除所有行的选中状态
                                    const allRows = document.querySelectorAll('#bookmark-popup tr[data-bookmark-key]');
                                    allRows.forEach(row => {
                                        row.style.backgroundColor = '';
                                    });
                                    showBookmarkWindow(currentGroupId);
                                }
                            } else {
                                // 没有选中的书签，切换视图
                                switchToGroup(groupId);
                            }
                        }
                    }, 300);
                });
            } else {
                // 一级分组或"全部"按钮：只切换视图
                tab.addEventListener('click', () => switchToGroup(groupId));
            }
            return tab;
        };

        // Tab切换区域
        const tabContainer = createTag('div', "", TAB_CONTAINER_STYLE);

        // 全部和默认按钮容器（垂直排列）
        const allAndDefaultContainer = createTag('div', "", 'display:flex;flex-direction:column;gap:8px;align-items:flex-start');
        
        // 全部Tab
        const allTab = createGroupTab('全部', null, currentGroupId === null, '#f0f0f0', true);
        allAndDefaultContainer.appendChild(allTab);
        
        // 默认分组按钮（显示在"全部"按钮下方）
        const defaultGroup = groups.find(g => g.id === DEFAULT_GROUP_ID);
        if (defaultGroup) {
            const defaultGroupBgColor = getGroupBackgroundColor(DEFAULT_GROUP_ID);
            const defaultTab = createGroupTab(defaultGroup.name, DEFAULT_GROUP_ID, currentGroupId === DEFAULT_GROUP_ID, defaultGroupBgColor);
            allAndDefaultContainer.appendChild(defaultTab);
        }
        
        tabContainer.appendChild(allAndDefaultContainer);

        // 获取一级分组数据
        const topLevelGroups = getTopLevelGroups();
        const topLevelGroupMap = getTopLevelGroupMap();
        const topLevelGroupIds = Object.keys(topLevelGroups).map(id => parseInt(id)).sort((a, b) => a - b);

        // 创建按钮行的公共函数（提升到循环外部，供所有地方使用）
        const createButtonRow = (groups, hasMarginBottom = false) => {
            if (groups.length === 0) return null;
            const row = createTag('div', "", hasMarginBottom ? 'margin-bottom:8px' : '');
            groups.forEach((group, index) => {
                const groupBgColor = getGroupBackgroundColor(group.id);
                const groupTab = createGroupTab(group.name, group.id, currentGroupId === group.id, groupBgColor);
                if (index > 0) {
                    groupTab.style.marginLeft = '8px';
                }
                row.appendChild(groupTab);
            });
            return row;
        };

        // 添加拖拽放置功能的公共函数
        const addDragDropHandlers = (container, topLevelId, onDropCallback) => {
            container.addEventListener('dragover', (e) => {
                e.preventDefault();
                e.dataTransfer.dropEffect = 'move';
                container.style.borderColor = '#667eea';
                container.style.backgroundColor = '#f0f4ff';
            });
            
            container.addEventListener('dragleave', (e) => {
                container.style.borderColor = '#ddd';
            });
            
            container.addEventListener('drop', (e) => {
                e.preventDefault();
                container.style.borderColor = '#ddd';
                
                const secondLevelId = parseInt(e.dataTransfer.getData('text/plain'));
                if (!isNaN(secondLevelId)) {
                    onDropCallback(secondLevelId);
                    showBookmarkWindow(currentGroupId);
                }
            });
        };

        // 创建按钮容器（包含两行按钮）的公共函数
        const createButtonContainer = (secondLevelGroups, containerStyle = SECOND_LEVEL_CONTAINER_DEFAULT_STYLE) => {
            const container = createTag('div', "", containerStyle);
            
            // 将二级分组分成两行
            const row1Groups = secondLevelGroups.slice(0, Math.ceil(secondLevelGroups.length / 2));
            const row2Groups = secondLevelGroups.slice(Math.ceil(secondLevelGroups.length / 2));

            // 创建并添加两行按钮
            const row1 = createButtonRow(row1Groups, true);
            if (row1) container.appendChild(row1);
            
            const row2 = createButtonRow(row2Groups, false);
            if (row2) container.appendChild(row2);
            
            return container;
        };

        // 为每个一级分组创建容器
        topLevelGroupIds.forEach(topLevelId => {
            const topLevelName = topLevelGroups[topLevelId] || `一级分组${topLevelId}`;
            const secondLevelIds = topLevelGroupMap[topLevelId] || [];

            // 创建一级分组容器（宽度自适应内容）
            const topLevelContainer = createTag('div', "", TOP_LEVEL_CONTAINER_STYLE);
            topLevelContainer.setAttribute('data-top-level-id', topLevelId);
            
            // 添加拖拽放置功能
            addDragDropHandlers(topLevelContainer, topLevelId, (secondLevelId) => {
                moveSecondLevelGroupToTopLevel(secondLevelId, topLevelId);
            });
            
            // 一级分组标题div（支持双击编辑）
            const topLevelHeader = createTag('div', topLevelName, TOP_LEVEL_HEADER_STYLE);
            topLevelHeader.style.cursor = 'pointer';
            topLevelHeader.title = '双击编辑标签名称';
            topLevelHeader.addEventListener('dblclick', (e) => {
                e.preventDefault();
                e.stopPropagation();
                const newName = prompt('请输入新的标签名称：', topLevelName);
                if (newName && newName.trim() && newName.trim() !== topLevelName) {
                    if (updateTopLevelGroupName(topLevelId, newName.trim())) {
                        showBookmarkWindow(currentGroupId);
                    } else {
                        showMessagePopup('标签名称已存在或无效');
                    }
                }
            });
            topLevelContainer.appendChild(topLevelHeader);

            // 获取对应的二级分组
            const secondLevelGroups = secondLevelIds
                .map(id => groups.find(g => g.id === id))
                .filter(g => g !== undefined)
                .slice(0, 100); // 限制最多显示100个，避免过多

            // 创建按钮容器
            const secondLevelContainer = createButtonContainer(secondLevelGroups);
            topLevelContainer.appendChild(secondLevelContainer);
            tabContainer.appendChild(topLevelContainer);
        });

        // 未归类到一级分组的二级分组（单独显示，排除默认分组）
        const allSecondLevelIds = new Set();
        Object.values(topLevelGroupMap).forEach(ids => {
            ids.forEach(id => allSecondLevelIds.add(id));
        });
        const ungroupedSecondLevelGroups = groups.filter(g => !allSecondLevelIds.has(g.id) && g.id !== DEFAULT_GROUP_ID);
        
        if (ungroupedSecondLevelGroups.length > 0) {
            const ungroupedContainer = createTag('div', "", TOP_LEVEL_CONTAINER_STYLE);
            ungroupedContainer.setAttribute('data-top-level-id', 'ungrouped');
            
            // 添加拖拽放置功能（未归类分组）
            addDragDropHandlers(ungroupedContainer, 'ungrouped', (secondLevelId) => {
                removeSecondLevelGroupFromTopLevel(secondLevelId);
            });
            
            const ungroupedHeader = createTag('div', '未归类', TOP_LEVEL_HEADER_STYLE);
            ungroupedContainer.appendChild(ungroupedHeader);
            
            // 创建按钮容器
            const ungroupedButtonsContainer = createButtonContainer(ungroupedSecondLevelGroups, SECOND_LEVEL_CONTAINER_DEFAULT_STYLE);
            ungroupedContainer.appendChild(ungroupedButtonsContainer);
            tabContainer.appendChild(ungroupedContainer);
        }

        // 创建按钮容器（上下排列）
        const buttonContainer = createTag('div', "", 'display:flex;flex-direction:column;gap:8px;align-items:flex-start');
        
        // 添加标签按钮（添加一级分组）
        const addTagBtn = createTag('button', '+ 添加标签', ADD_TAG_BTN_STYLE);
        addTagBtn.title = '添加新标签（一级分组）';
        addTagBtn.addEventListener('click', () => {
            const tagName = prompt('请输入标签名称：');
            if (tagName && tagName.trim()) {
                if (addTopLevelGroup(tagName.trim())) {
                    showBookmarkWindow(currentGroupId);
                } else {
                    showMessagePopup('标签名称已存在或无效');
                }
            }
        });
        addTagBtn.addEventListener('mouseenter', () => addTagBtn.style.opacity = '0.85');
        addTagBtn.addEventListener('mouseleave', () => addTagBtn.style.opacity = '1');
        buttonContainer.appendChild(addTagBtn);

        // 添加分组按钮
        const addGroupBtn = createTag('button', '+ 添加分组', ADD_GROUP_BTN_STYLE);
        addGroupBtn.title = '添加新分组';
        addGroupBtn.addEventListener('click', () => {
            const groupName = prompt('请输入分组名称：');
            if (groupName && groupName.trim()) {
                if (addBookmarkGroup(groupName.trim())) {
                    showBookmarkWindow(currentGroupId);
                } else {
                    showMessagePopup('分组名称已存在或无效');
                }
            }
        });
        addGroupBtn.addEventListener('mouseenter', () => addGroupBtn.style.opacity = '0.85');
        addGroupBtn.addEventListener('mouseleave', () => addGroupBtn.style.opacity = '1');
        buttonContainer.appendChild(addGroupBtn);
        
        tabContainer.appendChild(buttonContainer);

        content.appendChild(tabContainer);

        // 渲染书签列表
        renderTableOfBookmark(content, currentGroupId, groups);
    }

    // 初始化书签按钮
    setTimeout(() => {
        if (isBookmarkFeatureEnabled()) {
            createAddButtonOfBookmark();
            createViewButtonOfBookmark();
        }
        updateButtonVisibility(); // 根据设置更新按钮显示状态
    }, 1000);


    // 创建加书签按钮
    function createAddButtonOfBookmark() {
        createButtonOfBookmark({
            id: 'bookmark-btn',
            text: '书签',
            title: '多家同步提问后的各页面，可一键加书签，方便回看',
            bottom: '0px',
            background: 'linear-gradient(135deg,#11998e 0%,#38ef7d 100%)',
            onClick: onBookmarkButtonClick
        });
    }

    // 创建查看书签按钮
    function createViewButtonOfBookmark() {
        createButtonOfBookmark({
            id: 'bookmark-view-btn',
            text: '列表',
            title: '书签列表',
            bottom: '40px',
            background: 'linear-gradient(135deg,#667eea 0%,#764ba2 100%)',
            onClick: showBookmarkWindow
        });
    }

    // 创建书签按钮（通用函数）
    function createButtonOfBookmark(config) {
        const { id, text, title, bottom, background, onClick } = config;
        const btn = document.createElement('div');
        btn.id = id;
        setInnerHTML(btn, text);
        btn.title = title;
        // 组合公共样式和动态样式
        btn.style.cssText = BOOKMARK_BTN_BASE_STYLE + `;bottom:${bottom};background:${background}`;
        btn.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();
            onClick();
        });
        document.body.appendChild(btn);
    }

    /**
     * 分组新对话 & 图钉相关逻辑（集中放在文件尾部）
     */
    const GROUP_MENU_HIDE_DELAY = 160;

    function getPinnedGroups() {
        const groups = getGV(PINNED_GROUPS_KEY);
        return groups && typeof groups === 'object' ? groups : {};
    }

    function getPinnedGroupNames() {
        const names = getGV(PINNED_GROUP_NAMES_KEY);
        return names && typeof names === 'object' ? names : {};
    }

    function getNextGroupId(groups) {
        const keys = Object.keys(groups || {}).map(k => Number(k)).filter(n => !Number.isNaN(n));
        const maxId = keys.length ? Math.max(...keys) : 0;
        const counter = parseInt(getGV(PINNED_GROUP_ID_KEY)) || maxId;
        const nextId = Math.max(counter, maxId) + 1;
        setGV(PINNED_GROUP_ID_KEY, nextId);
        return nextId;
    }

    function arePinnedUrlsEqual(a = {}, b = {}) {
        const aKeys = Object.keys(a);
        const bKeys = Object.keys(b);
        if (aKeys.length !== bKeys.length) return false;
        return aKeys.every(key => a[key] === b[key]);
    }

    function findMatchingGroupId(groups, target) {
        const groupEntries = Object.entries(groups || {});
        const match = groupEntries.find(([_, urls]) => arePinnedUrlsEqual(urls, target));
        return match ? match[0] : null;
    }

    function deletePinnedGroup(groupId) {
        const groups = getPinnedGroups();
        const names = getPinnedGroupNames();
        if (groups[groupId]) {
            delete groups[groupId];
        }
        if (names[groupId]) {
            delete names[groupId];
        }
        setGV(PINNED_GROUPS_KEY, groups);
        setGV(PINNED_GROUP_NAMES_KEY, names);
    }

    function normalizeGroupName(inputName, fallback) {
        const text = (inputName || '').trim();
        return text || fallback;
    }

    function renderGroupedMenu(menuEl, hideMenu) {
        setInnerHTML(menuEl, '');
        const groups = getPinnedGroups();
        const names = getPinnedGroupNames();
        const groupIds = Object.keys(groups);

        if (groupIds.length === 0) {
            const emptyItem = createTag('div', '暂无分组', PANEL_STYLES.groupMenuEmpty);
            menuEl.appendChild(emptyItem);
            return;
        }

        const hueBase = 42;
        groupIds
            .map(id => Number(id))
            .filter(id => !Number.isNaN(id))
            .sort((a, b) => b - a)
            .forEach((groupId, idx) => {
                const displayName = names[groupId] || `${GROUP_NAME_PREFIX}${groupId}`;
                const btn = createTag('button', displayName, PANEL_STYLES.groupMenuBtn);
                btn.style.background = '#ec7258';
                const deleteBtn = createTag('button', '×', PANEL_STYLES.deleteBtn);
                deleteBtn.title = '删除分组';
                deleteBtn.addEventListener('click', (e) => {
                    e.stopPropagation();
                    deletePinnedGroup(groupId);
                    renderGroupedMenu(menuEl, hideMenu);
                });
                btn.appendChild(deleteBtn);

                let hoverTimer = null;
                btn.addEventListener('mouseenter', () => {
                    if (hoverTimer) {
                        clearTimeout(hoverTimer);
                    }
                    hoverTimer = setTimeout(() => {
                        btn.style.opacity = '0.9';
                        deleteBtn.style.display = 'block';
                        hoverTimer = null;
                    }, 400);
                });
                btn.addEventListener('mouseleave', () => {
                    if (hoverTimer) {
                        clearTimeout(hoverTimer);
                        hoverTimer = null;
                    }
                    btn.style.opacity = '1';
                    deleteBtn.style.display = 'none';
                });

                btn.addEventListener('click', (e) => {
                    e.stopPropagation();
                    jumpToPinnedNewChat(groupId);
                    if (hideMenu) hideMenu();
                });
                menuEl.appendChild(btn);
            });
    }

    function createGroupedNewChatButton() {
        const wrapper = createTag('div', "", PANEL_STYLES.groupMenuWrapper);
        wrapper.id = 'tool-grouped-new-chat-wrapper';
        const btn = createHtml('button', '分组<br>新对话', PANEL_STYLES.buttonBase + PANEL_STYLES.newChatBtn);
        btn.id = 'tool-grouped-new-chat';
        btn.title = '悬停查看已保存分组，点击分组按钮进行跳转';
        btn.style.lineHeight = '1.2';

        const menu = createTag('div', "", PANEL_STYLES.groupMenu);
        menu.id = 'tool-grouped-new-chat-menu';

        let hideTimer = null;
        const hideMenu = () => {
            hideTimer = setTimeout(() => {
                menu.style.display = 'none';
            }, GROUP_MENU_HIDE_DELAY);
        };
        const showMenu = () => {
            if (hideTimer) {
                clearTimeout(hideTimer);
                hideTimer = null;
            }
            renderGroupedMenu(menu, hideMenu);
            const rect = btn.getBoundingClientRect();
            menu.style.display = 'flex';
            menu.style.visibility = 'hidden';
            requestAnimationFrame(() => {
                const menuWidth = menu.offsetWidth || 180;
                const menuHeight = menu.offsetHeight || 120;
                const maxLeft = window.innerWidth - menuWidth - 20;
                const left = Math.max(0, Math.min(rect.left, maxLeft));
                const top = Math.max(0, rect.top - menuHeight - 6);
                menu.style.left = `${left}px`;
                menu.style.top = `${top}px`;
                menu.style.visibility = 'visible';
            });
        };

        btn.addEventListener('mouseenter', () => {
            btn.style.opacity = '0.85';
            showMenu();
        });
        btn.addEventListener('mouseleave', () => {
            btn.style.opacity = '1';
            hideMenu();
        });
        btn.addEventListener('click', (e) => e.stopPropagation());

        menu.addEventListener('mouseenter', () => {
            if (hideTimer) {
                clearTimeout(hideTimer);
                hideTimer = null;
            }
        });
        menu.addEventListener('mouseleave', hideMenu);

        appendSeveral(wrapper, btn, menu);
        return wrapper;
    }

    function jumpToNewChat() {
        let selectedSites = [];
        const visibleSites = getVisibleModels();
        const visibleWords = visibleSites.map(site => siteToWord[site]).filter(word => word);
        const checkedWords = visibleWords.filter(word => document.getElementById(`word-${word}`)?.checked);

        if (checkedWords.length > 0) {
            selectedSites = checkedWords.map(word => wordToSite[word]);
        } else {
            selectedSites = getSitesAndCurrent();
        }

        if (selectedSites.length === 0) {
            console.log('没有勾选的站点');
            return;
        }

        const jumpData = {};
        selectedSites.forEach(siteId => {
            const baseUrl = webSites[siteId]?.[0];
            if (baseUrl) {
                jumpData[siteId] = baseUrl;
            }
        });

        setGV(NEW_CHAT_JUMP_SIGNAL_KEY, {
            jumpData: jumpData,
            timestamp: Date.now()
        });

        const currentUrl = getUrl();
        const targetUrl = jumpData[site];
        if (targetUrl && currentUrl !== targetUrl) {
            console.log(curDate() + `新对话跳转: 从 ${currentUrl} 跳转到 ${targetUrl}`);
            window.location.href = targetUrl;
        }

        console.log(curDate() + `新对话: 已发送跳转信号到 ${selectedSites.length} 个已勾选站点`);
    }

    function jumpToPinnedNewChat(groupId) {
        const groups = getPinnedGroups();
        const names = getPinnedGroupNames();
        const groupIds = Object.keys(groups);
        if (groupIds.length === 0) {
            showMessagePopup('没有已保存的分组，请先点击图钉按钮保存');
            return;
        }

        const sortedIds = groupIds.map(id => Number(id)).filter(id => !Number.isNaN(id)).sort((a, b) => b - a);
        const targetGroupId = groupId ?? sortedIds[0];
        const pinnedUrls = groups[targetGroupId];

        if (!pinnedUrls || typeof pinnedUrls !== 'object' || Object.keys(pinnedUrls).length === 0) {
            showMessagePopup('分组数据为空，请重新保存');
            return;
        }

        const jumpData = {};
        Object.keys(pinnedUrls).forEach(siteIdStr => {
            const siteId = parseInt(siteIdStr);
            const url = pinnedUrls[siteIdStr];
            if (url) {
                jumpData[siteId] = url;
            }
        });

        if (Object.keys(jumpData).length === 0) {
            showMessagePopup('分组数据为空，请重新保存');
            return;
        }

        const groupName = names[targetGroupId] || `${GROUP_NAME_PREFIX}${targetGroupId}`;
        setGV(NEW_CHAT_JUMP_SIGNAL_KEY, {
            jumpData: jumpData,
            timestamp: Date.now()
        });

        const currentUrl = getUrl();
        const targetUrl = jumpData[site];
        if (targetUrl && currentUrl !== targetUrl) {
            console.log(curDate() + `分组新对话跳转(${groupName}): 从 ${currentUrl} 跳转到 ${targetUrl}`);
            window.location.href = targetUrl;
        }

        console.log(curDate() + `分组新对话(${groupName}): 已发送跳转信号到 ${Object.keys(jumpData).length} 个站点`);
    }

    /**
     * 创建图钉按钮（多选面板顶栏）
     */
    function createPinButton() {
        const btn = createTag('button', '📌', PANEL_STYLES.combinationBtnBase + 'background:linear-gradient(135deg,#f093fb 0%,#f5576c 100%);');
        btn.id = 'tool-pin';
        btn.title = '保存当前打开的各家分组新对话页面，\n后续点击"分组新对话"可自动跳转';
        setInnerHTML(btn, '📌');
        btn.addEventListener('click', async (e) => {
            e.stopPropagation();
            await onPinButtonClick();
        });
        btn.addEventListener('mouseenter', () => btn.style.opacity = '0.85');
        btn.addEventListener('mouseleave', () => btn.style.opacity = '1');
        return btn;
    }

    /**
     * 图钉按钮点击事件：收集所有已打开站点的URL并存储
     */
    async function onPinButtonClick() {
        const pinnedUrls = {};

        // 获取已勾选的站点
        const selectedSites = getSitesAndCurrent();

        // 请求所有站点上报当前URL（依赖现有跨页监听机制，而非心跳）
        const requestId = Date.now();
        setGV(PIN_REQUEST_KEY, { requestId });

        // 等待短暂时间收集响应（利用现有监听回调返回）
        const waitMs = 500;
        await new Promise(resolve => setTimeout(resolve, waitMs));

        // 当前站点直接记录
        pinnedUrls[site] = getUrl();

        // 只处理已勾选的站点
        selectedSites.forEach((siteId) => {
            // 跳过当前站点（已经记录）
            if (siteId === site) {
                return;
            }
            const resp = getGV(PIN_RESPONSE_PREFIX + siteId);
            if (resp && resp.requestId === requestId && !isEmpty(resp.url)) {
                pinnedUrls[siteId] = resp.url;
            }
        });

        const collectedCount = Object.keys(pinnedUrls).length;

        if (collectedCount === 0) {
            showMessagePopup('当前没有已打开的站点');
            return;
        }

        const groups = getPinnedGroups();
        const names = getPinnedGroupNames();
        const defaultName = `${GROUP_NAME_PREFIX}${Object.keys(groups).length + 1}`;
        const inputName = window.prompt('请输入分组名称', defaultName);
        if (inputName === null) {
            showMessagePopup('已取消保存分组');
            return;
        }
        const groupName = normalizeGroupName(inputName, defaultName);
        const matchedId = findMatchingGroupId(groups, pinnedUrls);
        const groupId = matchedId ? Number(matchedId) : getNextGroupId(groups);

        groups[groupId] = pinnedUrls;
        names[groupId] = groupName;

        setGV(PINNED_GROUPS_KEY, groups);
        setGV(PINNED_GROUP_NAMES_KEY, names);

        const siteNames = Object.keys(pinnedUrls).map(s => siteToWord[parseInt(s)] || s).join(', ');
        const prefix = matchedId ? '已更新分组' : '已新增分组';
        showMessagePopup(`${prefix}「${groupName}」，共 ${collectedCount} 个站点：\n${siteNames}`);
        console.log(curDate() + `${prefix}: ${groupName} (ID: ${groupId})`, pinnedUrls);
    }

})();
