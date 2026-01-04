// ==UserScript==
// @name         Steam 文本内容翻译
// @namespace    http://tampermonkey.net/
// @version      0.5
// @description  在 Steam 网页上的常见文本内容如简介、评论、新闻、讨论、聊天消息等文本右上角加上了翻译按钮，一键翻译外文。可通过右键点击按钮可重新翻译或切换翻译引擎。支持 WattToolkit 工具箱。
// @author       羽
// @match        *://*.steampowered.com/*
// @match        *://steamcommunity.com/*
// @grant        GM_xmlhttpRequest

// @connect      translate.google.com
// @connect      translate.googleapis.com
// @connect      fanyi.baidu.com
// @connect      ifanyi.iciba.com
// @connect      translate.alibaba.com
// @connect      m.youdao.com
// @connect      dict.youdao.com
// @connect      fanyi.youdao.com
// @connect      transmart.qq.com

// @require      https://cdnjs.cloudflare.com/ajax/libs/crypto-js/4.1.1/crypto-js.min.js
// @require      https://cdn.jsdelivr.net/npm/js-base64@3.7.4/base64.min.js

// @license      MIT License

// @downloadURL https://update.greasyfork.org/scripts/533040/Steam%20%E6%96%87%E6%9C%AC%E5%86%85%E5%AE%B9%E7%BF%BB%E8%AF%91.user.js
// @updateURL https://update.greasyfork.org/scripts/533040/Steam%20%E6%96%87%E6%9C%AC%E5%86%85%E5%AE%B9%E7%BF%BB%E8%AF%91.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 添加目标语言和API的全局配置
    const TARGET_LANGUAGES = {
        "中文": "zh-CN",
        "英语": "en",
        "日语": "ja",
        "韩语": "ko",
        "法语": "fr",
        "德语": "de",
        "西班牙语": "es",
        "俄语": "ru"
    };

    const TRANSLATION_APIS = {
        "Google翻译": "google",
        "百度翻译": "baidu",
        "金山词霸": "iciba",
        "有道词典-mobile": "youdao_m",
        "腾讯AI": "tencentai"
    };

    // 需要添加翻译功能的控件类名列表
    const targetClasses = [
        'profile_summary noexpand', // 用户简介
        'game_description_snippet', // 游戏简介
        'curator_review', // 游戏简介（推荐流）
        'recommendation',    // 游戏简介（推荐流卡片）
        'game_area_description',    // 游戏介绍
        'devnotes',     // 开发者说明
        'review_area_content',  // 游戏评论详情
        'blotter_group_announcement_content',  // 公告
        'workshop_item_row', // 创意工坊mod简介
        'workshopItemDescription',  // 创意工坊mod介绍
        'commentthread_comment_text',   // 创意工坊回复/游戏评论回复/讨论回复
        'apphub_CardContentMain',   // 新闻卡片简讯
        'workshopItemCollectionContainer',  // 指南简讯
        'guideTopContent',  // 指南主题
        'guide subSections',    // 指南内容
        'A_A2B6fTn_MPLlGCmsLtd _3NW5vEM9HgfQrgR4W-Xy_s',    // 新闻内容
        'EventDetailsBody',  // 活动页面
        'achieveTxt', // 成就
    ];
    // 需要添加翻译功能的CSS选择器列表
    const targetSelectors = {
        // 选择class为rightcol内的class为content的元素
        'rightcol': ['content'],    // 游戏评论
        'shortcol': ['content'],    // 游戏短评
        'forum_op': ['content', 'topic'],   // 讨论会话
        'ChatMessageBlock': ['msg'],    // 聊天消息
        '_1h5cJPC1IYFGDEMbRAWSNy': ['_1M8-Pa3b3WboayCgd5VBJT','_2g3JjlrRkzgUWXF57w3leW'],   // 更新记录简讯
        'announcement detailBox': ['headline','bodytext'],  // 创意工坊主页
    };
    const ignoredClasses = [
        'AppSummaryWidgetCtn',  // 介绍中的游戏卡片

    ]

    // 存储原始内容的键
    const ORIGINAL_CONTENT_KEY = 'original-content';
    // 存储翻译内容的键
    const TRANSLATED_CONTENT_KEY = 'translated-content';
    // 标记控件是否已添加翻译按钮
    const BUTTON_ADDED_KEY = 'translation-button-added';
    // 标记控件当前状态
    const TRANSLATION_STATE_KEY = 'translation-state';

    // 获取保存的设置或使用默认值
    let targetLanguage = localStorage.getItem('translation-target-language') || 'zh-CN';
    let translationApi = localStorage.getItem('translation-api') || 'iciba';


    // 初始化函数
    function init() {
        // 定期检查页面上的目标控件
        setInterval(checkForTargetElements, 2000);
        // 立即执行一次检查
        checkForTargetElements();
    }

    // 检查页面上的目标控件
    function checkForTargetElements() {
        // 处理类名列表
        targetClasses.forEach(className => {
            const elements = document.getElementsByClassName(className);
            for (let i = 0; i < elements.length; i++) {
                const element = elements[i];
                if (!element.getAttribute(BUTTON_ADDED_KEY)) {
                    addTranslationButton(element);
                    element.setAttribute(BUTTON_ADDED_KEY, 'true');
                    element.setAttribute(TRANSLATION_STATE_KEY, 'original');
                }
            }
        });
        
        // 处理CSS选择器列表
        Object.entries(targetSelectors).forEach(([selector, includes]) => {
            const elements = document.getElementsByClassName(selector);
            for (let i = 0; i < elements.length; i++) {
                const element = elements[i];
                // 检查元素是否包含所有指定的子元素
                const hasAllIncludes = includes.every(className => 
                    Array.from(element.children).some(child => 
                        child.classList.contains(className)
                    )
                );
                
                if (!element.getAttribute(BUTTON_ADDED_KEY) && hasAllIncludes) {
                    addTranslationButton(element, includes);
                    element.setAttribute(BUTTON_ADDED_KEY, 'true');
                    element.setAttribute(TRANSLATION_STATE_KEY, 'original');
                }
            }
        });
    }

    // 为控件添加翻译按钮
    function addTranslationButton(element, includes=null) {
        // 检查控件内容是否为空
        if (!element.textContent.trim()) {
            return; 
        }
        // 保存原始内容的深拷贝
        const originalContent = element.cloneNode(true);
        element.setAttribute(ORIGINAL_CONTENT_KEY, 'saved');
        element._originalContent = originalContent;

        // 创建按钮容器，设置为绝对定位
        const buttonContainer = document.createElement('div');
        buttonContainer.className = 'translation-button-container';

        // 创建翻译按钮
        const translateButton = document.createElement('button');
        translateButton.textContent = '翻译';
        translateButton.className = 'translation-toggle-button';
        translateButton.title = '左键点击翻译，右键点击可重新翻译/设置。';

        // 添加按钮点击事件
        translateButton.addEventListener('click', function(event) {
            event.stopPropagation(); // 阻止事件冒泡
            toggleTranslation(element, translateButton, includes);
        });
        // 添加右键菜单事件
        translateButton.addEventListener('contextmenu', function(event) {
            event.stopPropagation(); // 阻止事件冒泡
            showContextMenu(event, element, translateButton);
        });

        // 将按钮添加到容器中
        buttonContainer.appendChild(translateButton);

        // 确保元素有相对定位，以便正确放置按钮
        const originalPosition = window.getComputedStyle(element).position;
        if (originalPosition === 'static') {
            element.style.position = 'relative';
        }

        // 将按钮容器添加到元素中
        element.appendChild(buttonContainer);

        // 添加样式
        addStyles();
    }

    // 创建右键菜单
    function createContextMenu(element, button) {
        // 检查是否已存在菜单
        let menu = document.querySelector('.translation-context-menu');
        if (!menu) {
            menu = document.createElement('div');
            menu.className = 'translation-context-menu';
            document.body.appendChild(menu);
        }
        
        // 清空菜单内容
        menu.innerHTML = '';
        
        // 添加菜单项
        const retranslateItem = document.createElement('div');
        retranslateItem.className = 'translation-context-menu-item';
        retranslateItem.textContent = '重新翻译';
        retranslateItem.addEventListener('click', function() {
            retranslate(element, button);
            hideContextMenu();
        });
        menu.appendChild(retranslateItem);
        
        // 添加分隔线
        const separator = document.createElement('div');
        separator.className = 'translation-context-menu-separator';
        menu.appendChild(separator);
        
        // 添加设置菜单项
        const settingsItem = document.createElement('div');
        settingsItem.className = 'translation-context-menu-item';
        settingsItem.textContent = '翻译设置';
        settingsItem.addEventListener('click', function() {
            showTranslationSettings();
            hideContextMenu();
        });
        menu.appendChild(settingsItem);
        
        return menu;
    }
    
    // 显示右键菜单
    function showContextMenu(event, element, button) {
        event.preventDefault();
        
        const menu = createContextMenu(element, button);
        
        // 设置菜单位置
        menu.style.left = `${event.pageX}px`;
        menu.style.top = `${event.pageY}px`;
        menu.style.display = 'block';
        
        // 点击其他区域关闭菜单
        const closeMenuHandler = function(e) {
            if (!menu.contains(e.target)) {
                hideContextMenu();
                document.removeEventListener('click', closeMenuHandler);
            }
        };
        
        setTimeout(() => {
            document.addEventListener('click', closeMenuHandler);
        }, 0);
    }
    
    // 隐藏右键菜单
    function hideContextMenu() {
        const menu = document.querySelector('.translation-context-menu');
        if (menu) {
            menu.style.display = 'none';
        }
    }

    // 显示翻译设置
    function showTranslationSettings() {
        // 检查是否已存在设置面板
        let settingsPanel = document.getElementById('translation-settings-panel');
        if (settingsPanel) {
            settingsPanel.style.display = 'block';
            // 重置数据
            document.getElementById('translation-target-language').value = targetLanguage;
            document.getElementById('translation-api').value = translationApi;
            return;
        }
        
        // 创建设置面板
        settingsPanel = document.createElement('div');
        settingsPanel.id = 'translation-settings-panel';
        settingsPanel.className = 'translation-settings-panel';
        
        // 添加标题
        const title = document.createElement('h3');
        title.textContent = '翻译设置';
        title.className = 'translation-settings-title';
        settingsPanel.appendChild(title);
        
        // 添加关闭按钮
        const closeButton = document.createElement('button');
        closeButton.textContent = '×';
        closeButton.className = 'translation-settings-close-btn';
        closeButton.addEventListener('click', function() {
            settingsPanel.style.display = 'none';
        });
        settingsPanel.appendChild(closeButton);
        
        // 添加设置选项
        const settingsContent = document.createElement('div');
        settingsContent.className = 'translation-settings-content';
        settingsContent.innerHTML = `
            <div class="translation-settings-option">
                <label>目标语言：</label>
                <select id="translation-target-language">
                    ${Object.entries(TARGET_LANGUAGES).map(([name, value]) => 
                        `<option value="${value}"${value === targetLanguage ? ' selected' : ''}>${name}</option>`
                    ).join('')}
                </select>
            </div>
            <div class="translation-settings-option">
                <label>翻译API：</label>
                <select id="translation-api">
                    ${Object.entries(TRANSLATION_APIS)
                        .map(([name, value]) => 
                            `<option value="${value}"${value === translationApi ? ' selected' : ''}>${name}</option>`
                        ).join('')}
                </select>
            </div>
        `;
        settingsPanel.appendChild(settingsContent);
        
        // 添加保存按钮
        const saveButton = document.createElement('button');
        saveButton.textContent = '保存设置';
        saveButton.className = 'translation-settings-save-btn';
        saveButton.addEventListener('click', function() {
            // 保存设置逻辑
            targetLanguage = document.getElementById('translation-target-language').value;
            translationApi = document.getElementById('translation-api').value;
            
            // 保存到localStorage
            localStorage.setItem('translation-target-language', targetLanguage);
            localStorage.setItem('translation-api', translationApi);
            
            settingsPanel.style.display = 'none';
        });
        settingsPanel.appendChild(saveButton);
        
        // 添加到页面
        document.body.appendChild(settingsPanel);
        
        if (targetLanguage) {
            document.getElementById('translation-target-language').value = targetLanguage;
        }
        
        if (translationApi) {
            document.getElementById('translation-api').value = translationApi;
        }
        
        // 确保样式已添加
        addStyles();
    }

    // 切换翻译状态
    function toggleTranslation(element, button, includes=null) {
        const currentState = element.getAttribute(TRANSLATION_STATE_KEY);
        if (button.classList.contains('error')) {
            button.classList.remove('error'); 
            button.title = '左键点击翻译，右键点击可重新翻译/设置。';
            element._translatedContent = null;
        }

        if (currentState === 'original') {
            // 如果已经有翻译内容，直接显示
            if (element._translatedContent) {
                showTranslatedContent(element);
                button.textContent = '原文';
                element.setAttribute(TRANSLATION_STATE_KEY, 'translated');
            } else {
                // 否则进行翻译
                button.textContent = '翻译中...';
                button.disabled = true;

                // 先移除翻译按钮，避免其文本被收集
                const buttonContainer = element.querySelector('.translation-button-container');
                if (buttonContainer) {
                    element.removeChild(buttonContainer);
                }
                // 仅翻译目标元素
                const nonTargetElements = [];
                let targetElements = [];
                if (includes) {
                    // 保存目标元素和非目标元素
                    Array.from(element.children).forEach((child, index) => {
                        if (includes.some(className => child.classList.contains(className))) {
                            targetElements.push(child);
                        } else if (!child.classList.contains('translation-button-container')) {
                            nonTargetElements.push({
                                element: child,
                                parent: child.parentNode,
                                nextSibling: child.nextSibling,
                                index: index
                            });
                            child.parentNode.removeChild(child);
                        }
                    });
                } else if (ignoredClasses && ignoredClasses.length > 0){
                    // 当没有指定includes时，排除ignoredClasses
                    const ignoredElements = element.querySelectorAll(
                        ignoredClasses.map(className => '.' + className).join(',')
                    );
                    ignoredElements.forEach(el => {
                        el.setAttribute('data-skip-translation', 'true');
                    });
                }

                // 收集所有文本节点
                // const textNodeInfos = collectTextNodes(element);
                // const textsToTranslate = textNodeInfos.map(info => info.node.nodeValue.trim()).filter(text => text.length > 0);
                // 收集所有文本节点（仅从目标元素中收集）
                const textNodeInfos = includes ? 
                    targetElements.flatMap(el => collectTextNodes(el)) :
                    collectTextNodes(element);
                const textsToTranslate = textNodeInfos.map(info => info.node.nodeValue.trim()).filter(text => text.length > 0);

                // 按原始顺序恢复元素
                nonTargetElements.sort((a, b) => a.index - b.index).forEach(info => {
                    info.parent.insertBefore(info.element, info.nextSibling);
                });
                // 重新添加按钮
                if (buttonContainer) {
                    element.appendChild(buttonContainer);
                }

                if (textsToTranslate.length > 0) {
                    // 将所有文本分批翻译，避免超出API限制
                    translateTextBatches(textsToTranslate, function(translatedTexts, success) {
                        // 创建翻译内容的深拷贝
                        const translatedContent = element._originalContent.cloneNode(true);

                        // 再次移除翻译按钮

                        // 获取翻译后的文本节点信息
                        // const translatedNodeInfos = collectTextNodes(translatedContent);
                        // 获取翻译后的文本节点信息（仅从目标元素获取）
                        const translatedTargetElements = includes ?
                            Array.from(translatedContent.children)
                                .filter(child => includes.some(className => child.classList.contains(className))) :
                            [translatedContent];
                        
                        const translatedNodeInfos = translatedTargetElements.flatMap(el => collectTextNodes(el));

                        // 按照原始顺序替换文本
                        let translatedIndex = 0;
                        textNodeInfos.forEach((originalInfo, i) => {
                            if (i >= translatedNodeInfos.length) return;
                            
                            const originalText = originalInfo.node.nodeValue.trim();
                            if (originalText.length > 0 && translatedIndex < translatedTexts.length) {
                                translatedNodeInfos[i].node.nodeValue = translatedNodeInfos[i].node.nodeValue.replace(
                                    translatedNodeInfos[i].node.nodeValue.trim(),
                                    translatedTexts[translatedIndex]
                                );
                                translatedIndex++;
                            }
                        });

                        // 保存翻译内容
                        element._translatedContent = translatedContent;

                        // 显示翻译内容
                        showTranslatedContent(element);

                        button.textContent = '原文';
                        button.disabled = false;
                        element.setAttribute(TRANSLATION_STATE_KEY, 'translated');
                        if(!success){
                            button.textContent = '翻译错误';
                            button.classList.add('error');
                            button.title = '左键点击翻译，右键点击可重新翻译/设置。\n翻译错误可尝试重新翻译，或者切换翻译引擎。';
                        }
                    });
                } else {
                    button.textContent = '翻译';
                    button.disabled = false;
                }
            }
        } else {
            // 恢复原文
            showOriginalContent(element);
            button.textContent = '翻译';
            element.setAttribute(TRANSLATION_STATE_KEY, 'original');
        }
    }

    // 分批翻译文本，处理长文本
    function translateTextBatches(texts, callback) {
        const MAX_BATCH_SIZE = 1000; // 每批最大字符数
        const batches = [];
        let currentBatch = [];
        let currentSize = 0;

        // 将文本分成多个批次
        for (let i = 0; i < texts.length; i++) {
            const text = texts[i];
            if (currentSize + text.length > MAX_BATCH_SIZE && currentBatch.length > 0) {
                batches.push(currentBatch);
                currentBatch = [text];
                currentSize = text.length;
            } else {
                currentBatch.push(text);
                currentSize += text.length;
            }
        }

        if (currentBatch.length > 0) {
            batches.push(currentBatch);
        }

        const results = new Array(texts.length);
        let totalSuccess = true;
        let completedBatches = 0;

        // 翻译每个批次
        batches.forEach((batch, batchIndex) => {
            const batchText = batch.join('\n');

            translateText(batchText, function(translatedText, success) {
                let textIndex = 0;
                // 空值检查
                if (!translatedText) {
                    console.error('翻译返回空值:', {
                        batchText,
                        batchIndex,
                        translationApi
                    });
                    results[textIndex] = batchText; // 使用原文
                    success = false;
                } else {
                    // 分割翻译结果
                    const translatedParts = translatedText.split('\n');
                    
                    // 将结果放入正确的位置
                    for (let i = 0; i < batchIndex; i++) {
                        textIndex += batches[i].length;
                    }

                    for (let i = 0; i < Math.min(batch.length, translatedParts.length); i++) {
                        results[textIndex + i] = translatedParts[i];
                    }
                }
                
                totalSuccess = totalSuccess && success;
                completedBatches++;

                // 所有批次都完成后，返回结果
                if (completedBatches === batches.length) {
                    callback(results, totalSuccess);
                }
            });
        });
    }

    // 显示翻译内容
    function showTranslatedContent(element) {
        if (!element._translatedContent) return;

        // 保存当前的按钮容器
        const buttonContainer = element.querySelector('.translation-button-container');

        // 清空当前内容
        while (element.firstChild) {
            element.removeChild(element.firstChild);
        }

        // 添加翻译内容的所有子节点
        const fragment = document.createDocumentFragment();
        Array.from(element._translatedContent.childNodes).forEach(node => {
            fragment.appendChild(node.cloneNode(true));
        });

        element.appendChild(fragment);

        // 重新添加按钮容器
        if (buttonContainer) {
            element.appendChild(buttonContainer);
        }
    }

    // 显示原始内容
    function showOriginalContent(element) {
        if (!element._originalContent) return;

        // 保存当前的按钮容器
        const buttonContainer = element.querySelector('.translation-button-container');

        // 清空当前内容
        while (element.firstChild) {
            element.removeChild(element.firstChild);
        }

        // 添加原始内容的所有子节点
        const fragment = document.createDocumentFragment();
        Array.from(element._originalContent.childNodes).forEach(node => {
            fragment.appendChild(node.cloneNode(true));
        });

        element.appendChild(fragment);

        // 重新添加按钮容器
        if (buttonContainer) {
            element.appendChild(buttonContainer);
        }
    }

    // 重新翻译功能
    function retranslate(element, button) {
        // 如果当前是翻译状态，则重新触发翻译
        if (element.getAttribute(TRANSLATION_STATE_KEY) === 'translated') {
            // 先切换回原文
            toggleTranslation(element, button);
        }
        // 清除已有的翻译内容
        element._translatedContent = null;
        // 再触发翻译
        toggleTranslation(element, button);
    }

    // 收集元素中的所有文本节点
    function collectTextNodes(element) {
        const textNodes = [];
        const walker = document.createTreeWalker(element, NodeFilter.SHOW_TEXT, null, false);

        let node;
        while (node = walker.nextNode()) {
            const parent = node.parentNode;
            // 检查是否为需要跳过的元素或其子元素
            const shouldSkip = parent && (
                parent.tagName === 'SCRIPT' ||
                parent.tagName === 'STYLE' ||
                parent.closest('.translation-button-container') ||
                ignoredClasses.some(className => 
                    parent.classList.contains(className) || 
                    parent.closest('.' + className)
                )
            );
            
            if (parent && !shouldSkip) {
                const index = Array.from(parent.childNodes).indexOf(node);
                textNodes.push({
                    node: node,
                    parent: parent,
                    index: index
                });
            }
        }

        return textNodes;
    }
    

    // 翻译文本
    async function translateText(text, callback) {
        // console.log('翻译文本:', text);
        if (!text.trim()) {
            callback('',false);
            return;
        }
        
        try {
            let result;
            switch (translationApi) {
                case 'google':
                    result = await translate_gg(text, targetLanguage); break; 
                case 'baidu':
                    result = await translate_baidu(text, targetLanguage); break;
                case 'youdao_m':
                    result = await translate_youdao_mobile(text, targetLanguage); break;
                case 'iciba':
                    result = await translate_iciba(text, targetLanguage); break;
                case 'tencentai':
                    result = await translate_tencentai(text, targetLanguage); break;
                default:
                    result = await translate_gg(text, targetLanguage); break;
            }
            
            callback(result, true);
        } catch (error) {
            console.error('翻译出错:', error);
            callback(text, false); // 出错时返回原文
        }
    }

    //--谷歌翻译--start
    async function translate_gg(raw,targetLanguage='zh-CN') {
        const options = {
            method: "GET",
            url: `https://translate.google.com/translate_a/t?client=gtx&sl=auto&tl=zh-CN&q=` + encodeURIComponent(raw),
            anonymous: true,
            nocache: true,
        }
        return await BaseTranslate('谷歌翻译', raw, options, res => JSON.parse(res)[0][0])
    }
    //--百度翻译--start
    async function translate_baidu(raw, lang='zh') {
        if (!lang) {
            lang = await check_lang(raw);
        }
        if (lang == 'zh-CN') lang = 'zh';
        const options = {
            method: "POST",
            url: 'https://fanyi.baidu.com/ait/text/translate',
            data: JSON.stringify({ query: raw, from: lang, to: "zh" }),
            headers: {
                "referer": 'https://fanyi.baidu.com',
                'Content-Type': 'application/json',
                'Origin': 'https://fanyi.baidu.com',
                'accept': 'text/event-stream',
            },
        }
        return await BaseTranslate('百度翻译', raw, options, res => res.split('\n').filter(item => item.startsWith('data: ')).map(item => JSON.parse(item.slice(6))).find(item => item.data.list).data.list.map(item => item.dst).join('\n'))
    }
    async function check_lang(raw) {
        let t = Date.now();
        const options = {
            method: "POST",
            url: 'https://fanyi.baidu.com/langdetect',
            data: 'query=' + encodeURIComponent(raw.replace(/[\uD800-\uDBFF]$/, "").slice(0, 50)),
            headers: {
                "Content-Type": "application/x-www-form-urlencoded",
            }
        }
        const res = await Request(options);
        //console.log(`语言加载完毕，耗时${Date.now()-t}ms`)
        try {
            return JSON.parse(res.responseText).lan
        } catch (err) {
            console.log(err);
            return
        }
    }
    //--腾讯AI翻译--start
    function guid() {
        return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
            let r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
            return v.toString(16);
        });
    }
    async function translate_tencentai(raw,targetLanguage='zh') {
        if(targetLanguage=='zh-CN') targetLanguage='zh';
        const data = {
            "header": {
                "fn": "auto_translation",
                "client_key": `browser-chrome-121.0.0-Windows_10-${guid()}-${Date.now()}`,
                "session": "",
                "user": ""
            },
            "type": "plain",
            "model_category": "normal",
            "text_domain": "",
            "source": {
                "lang": "auto",
                "text_list": [raw]
            },
            "target": {
                "lang": targetLanguage
            }
        }
        const options = {
            method: 'POST',
            url: 'https://transmart.qq.com/api/imt',
            data: JSON.stringify(data),
            headers: {
                'Content-Type': 'application/json',
                'Host': 'transmart.qq.com',
                'Origin': 'https://transmart.qq.com',
                'Referer': 'https://transmart.qq.com/'
            },
            anonymous: true,
            nocache: true,
        }
        return await BaseTranslate('腾讯AI翻译', raw, options, res => JSON.parse(res).auto_translation[0])
    }
    //--有道翻译m--start
    async function translate_youdao_mobile(raw, targetLanguage='') {
        const options = {
            method: "POST",
            url: 'http://m.youdao.com/translate',
            data: "inputtext=" + encodeURIComponent(raw) + "&type=AUTO",
            anonymous: true,
            headers: {
                "Content-Type": "application/x-www-form-urlencoded"
            }
        }
        return await BaseTranslate('有道翻译mobile', raw, options, res => /id="translateResult">\s*?<li>([\s\S]*?)<\/li>\s*?<\/ul/.exec(res)[1])
    }
    //--爱词霸翻译--start
    async function translate_iciba(raw, targetLanguage='zh') {
        if(targetLanguage=='zh-CN') targetLanguage='zh';
        const sign = CryptoJS.MD5("6key_web_fanyiifanyiweb8hc9s98e" + raw.replace(/(^\s*)|(\s*$)/g, "")).toString().substring(0, 16)
        const options = {
            method: "POST",
            url: `https://ifanyi.iciba.com/index.php?c=trans&m=fy&client=6&auth_user=key_web_fanyi&sign=${sign}`,
            data: `from=auto&t=${targetLanguage}&q=` + encodeURIComponent(raw),
            headers: {
                "Content-Type": "application/x-www-form-urlencoded",
            },
        }
        return await BaseTranslate('爱词霸翻译', raw, options, res => JSON.parse(res).content.out)
    }
    

    // 基础请求
    async function BaseTranslate(name, raw, options, processer) {
        const toDo = async () => {
            try {
                const { responseText } = await Request(options);
                // 响应内容检查
                if (!responseText) {
                    throw new Error('翻译API返回空响应');
                }
                // 处理器结果检查
                const result = await processer(responseText);
                if (!result) {
                    throw new Error('翻译处理器返回空结果');
                }
                queueMicrotask(() => sessionStorage.setItem(`${name}-${raw}`, result));
                return result;
            } catch (err) {
                console.error('翻译请求详细错误:', {
                    name,
                    raw,
                    error: err,
                    responseText: err.responseText,
                    api: translationApi
                });
                throw err;
            }
        };
        
        return await PromiseRetryWrap(toDo, { 
            RetryTimes: 3, 
            ErrProcesser: (err) => {
                console.error('翻译重试失败:', err);
                throw err; // 抛出错误而不是返回原文
            }
        });
    }
    // 基础请求函数
    function Request(options) {
        return new Promise((resolve, reject) => {
            const timeout = options.timeout || 10000; // 默认10秒超时
            const controller = new AbortController();
            const timeoutId = setTimeout(() => controller.abort(), timeout);
    
            GM_xmlhttpRequest({
                ...options,
                signal: controller.signal,
                onload: (response) => {
                    clearTimeout(timeoutId);
                    resolve(response);
                },
                onerror: (error) => {
                    clearTimeout(timeoutId);
                    reject(error);
                },
                ontimeout: () => {
                    clearTimeout(timeoutId);
                    reject(new Error('请求超时'));
                }
            });
        });
    }

    // 重试包装函数
    async function PromiseRetryWrap(func, { RetryTimes = 3, ErrProcesser = null, baseDelay = 1000 } = {}) {
        let lastError;
        
        for (let i = 0; i < RetryTimes; i++) {
            try {
                return await func();
            } catch (error) {
                lastError = error;
                if (i < RetryTimes - 1) {
                    // 使用指数退避策略，延迟时间随重试次数增加
                    const delay = baseDelay * Math.pow(2, i);
                    await new Promise(resolve => setTimeout(resolve, delay));
                }
            }
        }
        
        return ErrProcesser ? ErrProcesser(lastError) : Promise.reject(lastError);
    }

    // 添加全局样式
    function addStyles() {
        // 检查是否已添加样式
        if (document.getElementById('translation-button-styles')) {
            return;
        }

        const styleElement = document.createElement('style');
        styleElement.id = 'translation-button-styles';
        styleElement.textContent = `
            .translation-button-container {
                top: 0;
                right: 0;
                position: absolute;
                z-index: 9999;
                pointer-events: none; /* 容器本身不接收点击事件 */
            }

            .translation-toggle-button {
                padding: 1px 5px;
                font-size: 12px;
                cursor: pointer;
                background-color: rgba(40, 80, 107, 0.3); 
                color: rgba(96, 182, 231, 0.3);
                border: none;
                border-radius: 4px;
                transition: all 0.3s ease;
                box-shadow: 0 1px 5px rgba(0, 0, 0, 0.2);
                pointer-events: auto; /* 按钮可以接收点击事件 */
                transform-origin: center;
            }
            .translation-toggle-button:hover {
                background-color: rgba(40, 80, 107, 1); /* 悬停时不透明 */
                box-shadow: 0 3px 8px rgba(0, 0, 0, 0.3);
                color: rgba(96, 182, 231, 1);
            }
            .translation-toggle-button:active {
                transform: scale(0.95); /* 点击时缩小效果 */
                box-shadow: 0 1px 3px rgba(0, 0, 0, 0.2);
                background-color: rgba(102, 192, 244, 0.7);
                color: white;
            }
            .translation-toggle-button:disabled {
                background-color: rgba(102, 192, 244, 0.5);
                cursor: not-allowed;
                color: rgba(27, 40, 56, 1);
            }
            .translation-toggle-button.error {
                background-color: rgba(200, 51, 51, 0.7);
                color: rgba(243, 236, 236, 0.7);
            }
            .translation-toggle-button.error:hover {
                background-color: rgba(200, 51, 51, 1);
                color: rgb(245, 234, 234);
            }

            /* 右键菜单样式 */
            .translation-context-menu {
                position: absolute;
                background-color: rgba(72, 101, 130, 0.9);
                border: 1px solid #2a4b62;
                border-radius: 4px;
                box-shadow: 0 2px 10px rgba(0, 0, 0, 0.2);
                color: #d6d8db;
                padding: 2px;
                z-index: 10000;
                min-width: 50px;
                display: none;
            }
            
            .translation-context-menu-item {
                padding: 1px 5px;
                cursor: pointer;
                font-size: 13px;
                transition: background-color 0.2s;
            }
            
            .translation-context-menu-item:hover {
                background-color: rgb(30, 47, 68);
            }
            
            .translation-context-menu-separator {
                height: 1px;
                background-color: #8b9fb4;
                margin: 2px;
            }

            /* 设置面板样式 */
            .translation-settings-panel {
                position: fixed;
                top: 50%;
                left: 50%;
                transform: translate(-50%, -50%);
                background-color: rgba( 33, 49, 68, 0.9);
                padding: 20px;
                border-radius: 8px;
                box-shadow: 0 4px 20px rgba(0, 0, 0, 0.3);
                z-index: 10001;
                min-width: 300px;
            }
            
            .translation-settings-title {
                margin: 0 0 15px 0;
                border-bottom: 1px solid #eee;
                padding-bottom: 10px;
            }
            
            .translation-settings-close-btn {
                position: absolute;
                top: 10px;
                right: 10px;
                background: none;
                border: none;
                font-size: 20px;
                cursor: pointer;
                color: #999;
            }
            
            .translation-settings-content {
                margin-bottom: 15px;
            }
            
            .translation-settings-option {
                margin-bottom: 10px;
            }
            
            .translation-settings-option label {
                display: block;
                margin-bottom: 5px;
            }
            
            .translation-settings-option select {
                width: 100%;
                padding: 5px;
                background-color: #7d90a4;
            }
            
            .translation-settings-save-btn {
                padding: 8px 15px;
                background-color: #486582;
                color: white;
                border: none;
                border-radius: 4px;
                cursor: pointer;
                margin-top: 15px;
            }
            
            .translation-settings-save-btn:hover {
                background-color: #6E8FAF;
            }

            /* 按钮定位调整 */
            .commentthread_comment_text {
                overflow-y: unset;
            }
            .blotter_group_announcement_content,
            .review_area_content {
                overflow: unset;
            }
            .game_area_description .translation-button-container {
                top: 0;
                bottom: unset;
            }
            .workshopItemDescription .translation-button-container,
            .commentthread_comment_content .translation-button-container {
                top: unset;
                right: 30px;
                bottom: 100%; 
            }
            .apphub_CardContentMain .translation-button-container {
                top: 5px;
                right: 5px; 
                bottom: unset;
            }
            .EventDetailsBody .translation-button-container,
            .workshopItemCollectionContainer .translation-button-container {
                top: 5px;
                right: 100px; 
                bottom: unset;
            }
            .announcement .translation-button-container,
            .ChatMessageBlock .translation-button-container{
                top: 5px;
                right: 15px;
                bottom: unset;
            }
            .subSections .translation-button-container {
                top: 15px;
                right: 5px;
                bottom: unset;
            }
            .guideTopContent .translation-button-container {
                top: 8px;
                right: 160px; 
                bottom: unset;
            }
            .forum_op .translation-button-container {
                top: 50px;
                right: 12px; 
                bottom: unset;
            }
            .rightcol .translation-button-container {
                top: 60px;
                right: 10px; 
                bottom: unset;
            }
            .profile_summary .translation-button-container,
            .devnotes .translation-button-container,
            .shortcol .translation-button-container {
                top: 0;
                right: 10px; 
                bottom: unset;
            }
            .game_description_snippet .translation-button-container{
                top: 0;
                right: 3px; 
                bottom: unset;
            }
            .recommendation .translation-button-container {
                top: 12px;
                right: 80px;
                bottom: unset; 
            }
            .curator_review .translation-button-container {
                top: 0;
                right: unset;
                bottom: unset; 
            }
            .blotter_group_announcement_content .translation-button-container{
                top: -30px;
                right: 10px;
                bottom: unset;
            }
            .review_area_content .translation-button-container,
            ._3NW5vEM9HgfQrgR4W-Xy_s .translation-button-container {
                top: -22px;
                right: 0;
                bottom: unset; 
            }

        `;

        document.head.appendChild(styleElement);
    }

    // 启动脚本
    init();
})();