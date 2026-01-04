// ==UserScript==
// @name         v4Words - 划词翻译 UserScript
// @namespace    https://github.com/vlan20/v4words
// @version      0.1.2
// @description  更便捷的划词翻译(select translator)，双击即译，支持谷歌翻译、有道词典及剑桥词典，适配Tampermonkey等脚本管理器。
// @author       vlan20
// @license      MIT
// @match        *://*/*
// @exclude      *://translate.google.com/*
// @exclude      *://dict.youdao.com/*
// @exclude      *://dictionary.cambridge.org/*
// @grant        GM_xmlhttpRequest
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_deleteValue
// @grant        GM_addStyle
// @grant        GM_registerMenuCommand
// @grant        GM_unregisterMenuCommand
// @connect      translate.googleapis.com
// @connect      dict.youdao.com
// @connect      dictionary.cambridge.org
// @run-at       document-end
// @supportURL   https://github.com/vlan20/v4words/issues
// @downloadURL https://update.greasyfork.org/scripts/528047/v4Words%20-%20%E5%88%92%E8%AF%8D%E7%BF%BB%E8%AF%91%20UserScript.user.js
// @updateURL https://update.greasyfork.org/scripts/528047/v4Words%20-%20%E5%88%92%E8%AF%8D%E7%BF%BB%E8%AF%91%20UserScript.meta.js
// ==/UserScript==

/*
更新日期：2025-02-27
当前版本：0.1.2
更新说明：
1. 首次启动脚本时，默认翻译器更改：谷歌翻译->有道词典。
2. 优化部分外观细节。
3. 修复在部分网页上，翻译面板显示位置不正确的情况。

使用说明：
1. 双击选中的文本即可翻译。
2. 点击标题栏切换翻译器，目前支持谷歌翻译、有道词典及剑桥词典。
3. 点击音标按钮即可播放发音。
4. 窗口内单击右键/窗口外单击左键，可关闭翻译窗口。
*/

/*
MIT License

Copyright (c) 2025 vlan20

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
*/

(() => {
    'use strict';

    // 配置项
    const CONFIG = {
        fontSize: 16, // 基础字体大小
        sourceFontSize: 14, // 原文字体大小
        translationFontSize: 13, // 翻译结果字体大小
        triggerDelay: 150, // 减少触发延迟
        doubleClickDelay: 250, // 减少双击延迟
        selectionOverrideDelay: 400, // 减少选择覆盖延迟
        darkModeClass: 'translator-panel-dark',
        panelSpacing: 12, // 减小面板间距
        panelWidth: 300,
        maxPanelHeight: 400,
        titleBarHeight: 40, // 添加标题栏高度配置
        animationDuration: 200, // 添加动画持续时间配置
        currentTranslator: GM_getValue('defaultTranslator', 'youdao'), // 从GM_getValue读取默认翻译器，默认为有道
        cacheExpiration: 24 * 60 * 60 * 1000, // 缓存过期时间（24小时）
        maxCacheSize: 100, // 最大缓存条目数
    };

    // 全局变量
    let currentPanel = null;
    let isTranslating = false;

    // 翻译缓存系统
    const translationCache = {
        cache: new Map(),
        generateKey: (text, translator) => `${translator}:${text}`,
        get(text, translator) {
            const key = this.generateKey(text, translator);
            const item = this.cache.get(key);
            if (!item || Date.now() - item.timestamp > CONFIG.cacheExpiration) {
                item && this.cache.delete(key);
                return null;
            }
            return item.translation;
        },
        set(text, translator, translation) {
            const key = this.generateKey(text, translator);
            if (this.cache.size >= CONFIG.maxCacheSize) {
                const oldestKey = Array.from(this.cache.entries())
                    .sort((a, b) => a[1].timestamp - b[1].timestamp)[0][0];
                this.cache.delete(oldestKey);
            }
            this.cache.set(key, { translation, timestamp: Date.now() });
        },
        cleanup() {
            const now = Date.now();
            for (const [key, item] of this.cache.entries()) {
                if (now - item.timestamp > CONFIG.cacheExpiration) {
                    this.cache.delete(key);
                }
            }
        }
    };

    // 定期清理过期缓存
    setInterval(() => translationCache.cleanup(), CONFIG.cacheExpiration);

    // 清理函数
    function cleanupPanels() {
        document.querySelectorAll('.translator-panel').forEach(panel => {
            if (panel !== currentPanel && !panel.classList.contains('pinned')) panel.remove();
        });
    }

    // 创建翻译面板前的检查
    function beforeCreatePanel() {
        cleanupPanels();
        if (currentPanel && !currentPanel.classList.contains('pinned')) {
            currentPanel.remove();
            currentPanel = null;
        }
        // 从存储中获取默认翻译器
        CONFIG.currentTranslator = GM_getValue('defaultTranslator', 'youdao');
    }

    // 添加音频播放功能
    const audio = {
        element: null,
        getElement() {
            if (!this.element) {
                this.element = document.createElement('audio');
                this.element.style.display = 'none';
                document.body.appendChild(this.element);
            }
            return this.element;
        },
        async play(url) {
            try {
                const audioElement = this.getElement();
                audioElement.src = url;
                await audioElement.play();
            } catch (error) {
                console.error('播放音频失败:', error);
            }
        }
    };

    // 翻译器工厂函数
    const createTranslator = (name, translateFn) => ({
        name,
        translate: async (text) => {
            const cachedResult = translationCache.get(text, name);
            if (cachedResult) return cachedResult;

            const result = await translateFn(text);
            if (!result) throw new Error(`${name}翻译失败: 翻译结果为空`);

            translationCache.set(text, name, result);
            return result;
        }
    });

    // 翻译器配置
    const TRANSLATORS = {
        google: createTranslator('谷歌翻译', async (text) => {
            try {
                const response = await new Promise((resolve, reject) => {
                    GM_xmlhttpRequest({
                        method: 'GET',
                        url: `https://translate.googleapis.com/translate_a/single?client=gtx&sl=auto&tl=zh-CN&dt=t&q=${encodeURIComponent(text)}`,
                        headers: {'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'},
                        onload: resolve, onerror: reject
                    });
                });
                const result = JSON.parse(response.responseText);
                if (!result?.[0]?.length) throw new Error('谷歌翻译返回的数据格式不正确');
                return result[0].map(x => x[0]).join('');
            } catch (error) {
                console.error('谷歌翻译错误:', error);
                throw new Error('谷歌翻译失败: ' + error.message);
            }
        }),

        youdao: createTranslator('有道词典', async (text) => {
            try {
                const response = await new Promise((resolve, reject) => {
                    GM_xmlhttpRequest({
                        method: 'GET',
                        url: `https://dict.youdao.com/jsonapi?xmlVersion=5.1&jsonversion=2&q=${encodeURIComponent(text)}`,
                        headers: {
                            'Referer': 'https://dict.youdao.com',
                            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
                        },
                        onload: resolve, onerror: reject
                    });
                });

                const result = JSON.parse(response.responseText);
                let translation = '';
                const createPronHtml = (type, pron, url) => `<span class="phonetic-item">${type} /${pron}/ <button class="audio-button" data-url="${url}">🔊</button></span>`;
                const wordInfo = result.ec?.word?.[0];
                const audioUrls = {
                    uk: wordInfo?.ukspeech ? `https://dict.youdao.com/dictvoice?audio=${wordInfo.ukspeech}` : '',
                    us: wordInfo?.usspeech ? `https://dict.youdao.com/dictvoice?audio=${wordInfo.usspeech}` : ''
                };

                // 添加音标和发音按钮
                if (wordInfo?.ukphone || wordInfo?.usphone) {
                        translation += '<div class="phonetic-buttons">';
                    if (wordInfo.ukphone && audioUrls.uk) translation += createPronHtml('英', wordInfo.ukphone, audioUrls.uk);
                    if (wordInfo.usphone && audioUrls.us) translation += createPronHtml('美', wordInfo.usphone, audioUrls.us);
                        translation += '</div>\n\n';
                }

            // 获取翻译结果
                if (wordInfo?.trs) {
                    translation += wordInfo.trs.map(tr => tr.tr[0].l.i.join('; ')).join('\n');
            } else if (result.fanyi) {
                    translation = result.fanyi.tran;
            } else if (result.translation) {
                    translation = result.translation.join('\n');
            } else if (result.web_trans?.web_translation) {
                    translation = result.web_trans.web_translation
                        .map(item => item.trans.map(t => t.value).join('; '))
                        .join('\n');
                }

            if (!translation) throw new Error('未找到翻译结果');
                return translation;
            } catch (error) {
                console.error('有道词典错误:', error);
                throw new Error('有道词典失败: ' + error.message);
            }
        }),

        cambridge: createTranslator('剑桥词典', async (text) => {
            try {
                const response = await new Promise((resolve, reject) => {
                    GM_xmlhttpRequest({
                        method: 'GET',
                        url: `https://dictionary.cambridge.org/search/english-chinese-simplified/direct/?q=${encodeURIComponent(text)}`,
                        headers: {
                            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
                            'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
                            'Accept-Language': 'en-US,en;q=0.5',
                        },
                        onload: resolve,
                        onerror: reject,
                    });
                });

                const parser = new DOMParser();
                const doc = parser.parseFromString(response.responseText, 'text/html');
                let translation = '';

                // 辅助函数
                const createPosTagsHtml = posStr => !posStr ? '' : posStr.split(/[,，、\n]/).map(p => p.trim()).filter(p => p).map(tag => `<div class="pos-tag">${tag}</div>`).join('');
                const getFullUrl = url => !url ? '' : url.startsWith('http') ? url : url.startsWith('//') ? 'https:' + url : `https://dictionary.cambridge.org${url}`;
                const getPronunciations = container => {
                    if (!container) return { prons: [], audioUrls: [] };
                    const prons = Array.from(container.querySelectorAll('.pron')).map(el => el.textContent.trim());
                    const audioUrls = Array.from(container.querySelectorAll('source[type="audio/mpeg"]')).map(el => getFullUrl(el.getAttribute('src')));
                    return { prons, audioUrls };
                };
                const createPronHtml = (type, pron, audioUrl) => `<span class="phonetic-item">${type} ${pron} <button class="audio-button" data-url="${audioUrl}">🔊</button></span>`;

                // 获取主要发音并添加
                const mainUk = getPronunciations(doc.querySelector('.uk.dpron-i'));
                const mainUs = getPronunciations(doc.querySelector('.us.dpron-i'));
                if (mainUk.prons.length > 0 || mainUs.prons.length > 0) {
                    translation += '<div class="phonetic-buttons">';
                    mainUk.prons.forEach((pron, i) => translation += createPronHtml('英', pron, mainUk.audioUrls[i]));
                    mainUs.prons.forEach((pron, i) => translation += createPronHtml('美', pron, mainUs.audioUrls[i]));
                    translation += '</div>\n\n';
                }

                // 处理释义
                function processSenses(senses, pos) {
                    if (senses.length === 0 && pos)
                        return `<div class="sense-block pos-only"><div class="pos-tags">${createPosTagsHtml(pos)}</div></div>`;

                    return senses.map(sense => {
                        const def = sense.querySelector('.ddef_h .def')?.textContent.trim() || '';
                        const trans = sense.querySelector('.def-body .trans')?.textContent.trim() || '';
                        const levelTag = sense.querySelector('.dxref')?.textContent.trim() || '';
                        let senseProns = '';
                        const sensePronContainers = sense.querySelectorAll('.dpron-i');

                        if (sensePronContainers.length > 0) {
                            const ukContainer = Array.from(sensePronContainers).find(c => c.classList.contains('uk'));
                            const usContainer = Array.from(sensePronContainers).find(c => c.classList.contains('us'));
                            const sharedPron = sense.querySelector('.pron')?.textContent.trim();
                            senseProns = '<div class="sense-phonetic">';

                            if (sharedPron) {
                                const ukUrl = ukContainer ? getFullUrl(ukContainer.querySelector('source[type="audio/mpeg"]')?.getAttribute('src')) : '';
                                const usUrl = usContainer ? getFullUrl(usContainer.querySelector('source[type="audio/mpeg"]')?.getAttribute('src')) : '';
                                if (ukUrl) senseProns += createPronHtml('英', sharedPron, ukUrl);
                                if (usUrl) senseProns += createPronHtml('美', sharedPron, usUrl);
                            } else {
                                const ukProns = getPronunciations(ukContainer), usProns = getPronunciations(usContainer);
                                ukProns.prons.forEach((pron, i) => senseProns += createPronHtml('英', pron, ukProns.audioUrls[i]));
                                usProns.prons.forEach((pron, i) => senseProns += createPronHtml('美', pron, usProns.audioUrls[i]));
                            }
                            senseProns += '</div>';
                        }

                        return pos ?
                            `<div class="sense-block">
                                <div class="pos-tags">${createPosTagsHtml(pos)}${levelTag ? `<div class="level-tag">${levelTag}</div>` : ''}</div>
                                <div class="def-content">${senseProns}<div class="def-text">${def}</div>${trans ? `<div class="trans-line">${trans}</div>` : ''}</div>
                            </div>` :
                            `<div class="sense-block no-pos">
                                <div class="def-content">${senseProns}<div class="def-text">${def}</div>${trans ? `<div class="trans-line">${trans}</div>` : ''}</div>
                            </div>`;
                    }).join('\n');
                }

                // 获取释义
                const entries = doc.querySelectorAll('.pr.entry-body__el');
                if (entries.length > 0) {
                    translation += Array.from(entries).map(entry => {
                        const posElements = entry.querySelectorAll('.pos-header .pos');
                        const pos = posElements.length > 0 ?
                            Array.from(posElements).map(el => el.textContent.trim()).filter((v, i, s) => s.indexOf(v) === i).join('\n') :
                            entry.querySelector('.pos')?.textContent.trim() || '';

                        const senseGroups = Array.from(entry.querySelectorAll('.pr.dsense-block')).filter(g => !g.querySelector('.phrase-title, .idiom-title'));
                        if (senseGroups.length === 0) {
                            const senses = Array.from(entry.querySelectorAll('.ddef_block')).filter(s => !s.closest('.phrase-block, .idiom-block'));
                            return processSenses(senses, pos);
                        }

                        return senseGroups.map(group => {
                            const groupPos = group.querySelector('.dsense-header .pos')?.textContent.trim() || pos;
                            const levelTag = group.querySelector('.dsense-header .dxref')?.textContent.trim() || '';
                            const senses = Array.from(group.querySelectorAll('.ddef_block')).filter(s => !s.closest('.phrase-block, .idiom-block'));
                            const posHtml = groupPos ? `<div class="sense-block"><div class="pos-tags">${createPosTagsHtml(groupPos)}${levelTag ? `<div class="level-tag">${levelTag}</div>` : ''}</div></div>` : '';
                            return `${posHtml}${processSenses(senses, groupPos)}`;
                        }).join('\n');
                    }).join('\n');

                    // 获取短语
                    const phrases = doc.querySelectorAll('.phrase-block, .idiom-block');
                    if (phrases.length > 0) {
                        translation += '\n\n' + Array.from(phrases).map(phraseBlock => {
                            const phraseTitle = phraseBlock.querySelector('.phrase-title, .idiom-title')?.textContent.trim() || '';
                            const phraseDef = phraseBlock.querySelector('.ddef_block .def')?.textContent.trim() || '';
                            return `<div class="sense-block">
                                <div class="pos-tags">${createPosTagsHtml('phrase')}</div>
                                <div class="def-content"><div class="def-text">${phraseTitle}</div><div class="trans-line">${phraseDef}</div></div>
                            </div>`;
                        }).join('\n');
                    }
                } else {
                    throw new Error('未找到释义');
                }

                return translation;
            } catch (error) {
                console.error('剑桥词典错误:', error);
                throw new Error('剑桥词典失败: ' + error.message);
            }
        })
    };

    // 添加样式
    GM_addStyle(`
        /* ================ */
        /* 1. CSS 变量定义 */
        /* ================ */
        .translator-panel {
            /* 基础颜色 */
            --panel-bg: #ffffff;
            --panel-text: #2c3e50;
            --panel-border: #e2e8f0;
            --panel-shadow: rgba(0,0,0,0.1);

            /* 标题栏颜色 */
            --title-bg: #f8fafc;
            --title-text: #334155;
            --title-border: #e2e8f0;

            /* 次要文本颜色 */
            --text-secondary: #475569;
            --text-tertiary: #64748b;

            /* 交互颜色 */
            --hover-bg: #f1f5f9;
            --active-link: #3b82f6;
            --success: #22c55e;
            --error: #ef4444;

            /* 布局尺寸 */
            --spacing-xs: 2px;
            --spacing-sm: 4px;
            --spacing-md: 6px;
            --spacing-lg: 8px;
            --spacing-xl: 12px;

            /* 字体大小 */
            --font-xs: 10px;
            --font-sm: 12px;
            --font-md: 13px;
            --font-lg: 14px;
            --font-xl: 16px;

            /* 过渡效果 */
            --theme-transition: background-color 0.15s ease-out,
                                background-image 0.15s ease-out,
                                color 0.15s ease-out,
                                border-color 0.15s ease-out,
                                border-bottom-color 0.15s ease-out;
        }

        /* 深色模式变量 */
        .translator-panel.translator-panel-dark {
            --panel-bg: #1a1a1a;
            --panel-text: #e0e0e0;
            --panel-border: #333;
            --panel-shadow: rgba(0,0,0,0.3);

            --title-bg: #2c2c2c;
            --title-text: #e0e0e0;
            --title-border: #333;

            --text-secondary: #999;
            --text-tertiary: #888;

            --hover-bg: rgba(255, 255, 255, 0.1);
            --active-link: #4a9eff;
            --success: #73d13d;
            --error: #ff7875;
        }

        /* ================ */
        /* 2. 基础面板样式 */
        /* ================ */
        .translator-panel {
            font-size: ${CONFIG.fontSize}px !important;
            line-height: 1.5 !important;
            color: var(--panel-text) !important;
            background: var(--panel-bg) !important;
            border: 1px solid var(--panel-border) !important;
            border-radius: 6px !important;
            padding: var(--spacing-md) !important;
            box-shadow: 0 4px 12px var(--panel-shadow) !important;
            max-width: ${CONFIG.panelWidth}px !important;
            position: absolute !important; /* 使用absolute定位，相对于文档定位 */
            z-index: 2147483647 !important;
            display: none;
            opacity: 0;
            transform: translateY(-10px);
            transition: var(--theme-transition),
                        opacity 0.3s,
                        transform 0.3s !important;
            max-height: 80vh !important;
            overflow: hidden !important;
        }

        /* 拖动时的样式 */
        .translator-panel.dragging {
            transition: none !important;
            opacity: 0.95 !important;
            cursor: move !important;
            pointer-events: none !important; /* 防止拖动时影响其他元素 */
        }

        /* 标题栏禁用文本选择 */
        .translator-panel .title-bar {
            user-select: none !important;
            cursor: move !important; /* 明确指示可拖动 */
        }

        /* 调整内容区域的内边距和滚动条 */
        .translator-panel .content {
            position: relative !important;
            overflow: visible !important; /* 修改为visible，让子元素的滚动条可见 */
            display: flex !important;
            flex-direction: column !important;
            height: auto !important; /* 修改为auto，根据内容自动调整高度 */
            max-height: calc(80vh - ${CONFIG.titleBarHeight}px) !important; /* 限制最大高度，减去标题栏高度 */
        }

        /* 源文本容器样式 */
        .translator-panel .source-text-container {
            position: sticky !important;
            top: 0 !important;
            z-index: 1 !important;
            background: var(--panel-bg) !important;
            border-bottom: 1px solid var(--panel-border) !important;
            margin: calc(-1 * var(--spacing-md)) calc(-1 * var(--spacing-md)) 0 !important;
            padding: var(--spacing-md) var(--spacing-lg) var(--spacing-md) calc(var(--spacing-lg) + var(--spacing-sm)) !important;
            transition: var(--theme-transition) !important;
        }

        /* 源文本样式 */
        .translator-panel .source-text {
            color: var(--text-secondary) !important;
            font-size: ${CONFIG.sourceFontSize}px !important;
            line-height: 1.5 !important;
            user-select: text !important;
            word-wrap: break-word !important; /* 确保长单词换行 */
            overflow-wrap: break-word !important; /* 现代浏览器的单词换行 */
            white-space: pre-wrap !important; /* 保留换行但允许自动换行 */
        }

        .translator-panel .source-text strong {
            color: var(--panel-text) !important;
            font-weight: 600 !important;
        }

        /* 翻译内容容器样式 */
        .translator-panel .translation-container {
            flex: 1 !important;
            overflow-y: auto !important;
            padding: var(--spacing-md) var(--spacing-md) !important;
            max-height: calc(80vh - ${CONFIG.titleBarHeight}px - 100px) !important;
            word-wrap: break-word !important;
            overflow-wrap: break-word !important;
            white-space: normal !important;
            display: block !important;
        }

        /* 统一的滚动条样式 - WebKit 浏览器 */
        .translator-panel .translation-container::-webkit-scrollbar,
        .translator-panel .dropdown-menu::-webkit-scrollbar {
            width: 3px !important;
            height: 3px !important;
        }

        .translator-panel .translation-container::-webkit-scrollbar-thumb,
        .translator-panel .dropdown-menu::-webkit-scrollbar-thumb {
            background: var(--text-tertiary) !important;
            border-radius: 3px !important;
            transition: background-color 0.2s !important;
        }

        .translator-panel .translation-container::-webkit-scrollbar-thumb:hover,
        .translator-panel .dropdown-menu::-webkit-scrollbar-thumb:hover {
            background: var(--text-secondary) !important;
        }

        .translator-panel .translation-container::-webkit-scrollbar-track,
        .translator-panel .dropdown-menu::-webkit-scrollbar-track {
            background: transparent !important; /* 透明轨道，更简约 */
            border-radius: 3px !important;
        }

        /* 翻译结果样式 */
        .translator-panel .translation {
            color: var(--panel-text) !important;
            font-size: ${CONFIG.translationFontSize}px !important;
            line-height: 1.5 !important;
            user-select: text !important;
            word-wrap: break-word !important; /* 确保长单词换行 */
            overflow-wrap: break-word !important; /* 现代浏览器的单词换行 */
            white-space: normal !important; /* 允许正常换行 */
            max-width: 100% !important; /* 确保不超出容器宽度 */
            overflow: visible !important; /* 确保内容不被截断 */
        }

        /* 深色模式下的源文本样式调整 */
        .translator-panel.translator-panel-dark .source-text strong {
            color: #fff !important;
        }

        /* 调整滚动条样式 */
        .translator-panel .translation-container::-webkit-scrollbar {
            width: 5px !important; /* 增加滚动条宽度，提高可见性 */
            height: 5px !important;
        }

        .translator-panel .translation-container::-webkit-scrollbar-thumb {
            background: var(--text-tertiary) !important;
            border-radius: 4px !important;
            transition: background-color 0.2s !important;
        }

        .translator-panel .translation-container::-webkit-scrollbar-thumb:hover {
            background: var(--text-secondary) !important;
        }

        .translator-panel .translation-container::-webkit-scrollbar-track {
            background: var(--hover-bg) !important; /* 轻微可见的轨道 */
            border-radius: 4px !important;
        }

        /* 确保词性标签和音标也可以选择 */
        .translator-panel .pos-tag,
        .translator-panel .phonetic-item {
            user-select: text !important;
            margin-bottom: var(--spacing-xs) !important; /* 减少音标项的下边距 */
        }

        /* 调整释义块样式 */
        .translator-panel .sense-block {
            margin: var(--spacing-xs) 0 !important; /* 减少上下间距 */
            padding: var(--spacing-xs) 0 !important; /* 减少上下内边距 */
            display: flex !important;
            gap: var(--spacing-md) !important; /* 减少词性标签和释义内容之间的间距 */
            align-items: flex-start !important;
            border-bottom: 1px solid var(--panel-border) !important;
            transition: var(--theme-transition) !important;
        }

        .sense-block:first-child {
            margin-top: 0 !important;
        }

        .sense-block:last-child {
            margin-bottom: 0 !important;
            border-bottom: none !important;
        }

        /* 调整音标项样式 */
        .phonetic-item {
            display: flex !important;
            align-items: center !important;
            gap: var(--spacing-xs) !important; /* 减少间距 */
            color: var(--text-secondary) !important;
            padding: var(--spacing-xs) var(--spacing-sm) !important;
            white-space: nowrap !important;
        }

        /* 基础重置样式 */
        .translator-panel * {
            all: revert;
            box-sizing: border-box !important;
            margin: 0 !important;
            padding: 0 !important;
            font-family: inherit !important;
            line-height: inherit !important;
            color: inherit !important;
            pointer-events: auto !important;
        }

        /* ================ */
        /* 3. 布局组件样式 */
        /* ================ */

        /* 标题栏 */
        .translator-panel .title-bar {
            position: relative !important;
            display: flex !important;
            align-items: center !important;
            justify-content: space-between !important;
            border-bottom: 1px solid var(--title-border) !important;
            padding: var(--spacing-xs) var(--spacing-md) !important;
            margin: calc(-1 * var(--spacing-md)) calc(-1 * var(--spacing-md)) var(--spacing-md) calc(-1 * var(--spacing-md)) !important;
            background-color: var(--title-bg) !important;
            border-top-left-radius: 6px !important;
            border-top-right-radius: 6px !important;
            gap: var(--spacing-md) !important;
            cursor: move !important;
            transition: var(--theme-transition) !important;
        }

        /* 标题包装器和按钮基础样式 */
        .translator-panel .title-wrapper,
        .translator-panel .theme-button,
        .translator-panel .pin-button,
        .translator-panel .clear-button,
        .translator-panel .external-button {
            display: flex !important;
            align-items: center !important;
            cursor: pointer !important;
            transition: all 0.2s !important;
        }

        /* 标题包装器特有样式 */
        .translator-panel .title-wrapper {
            gap: var(--spacing-sm) !important;
            padding: var(--spacing-xs) var(--spacing-lg) !important;
            border-radius: var(--spacing-sm) !important;
            width: fit-content !important; /* 使用fit-content替代固定宽度 */
            margin-right: auto !important;
            position: relative !important; /* 添加相对定位，作为下拉菜单的参考点 */
        }

        .translator-panel .title-wrapper:hover {
            background-color: var(--hover-bg) !important;
        }

        /* 按钮共享样式 */
        .translator-panel .theme-button,
        .translator-panel .pin-button,
        .translator-panel .clear-button,
        .translator-panel .external-button {
            width: var(--font-xl) !important;
            height: var(--font-xl) !important;
            justify-content: center !important;
            font-size: var(--font-lg) !important;
            opacity: 0.6 !important;
            display: flex !important;
            align-items: center !important;
        }

        .translator-panel .theme-button:hover,
        .translator-panel .pin-button:hover,
        .translator-panel .clear-button:hover,
        .translator-panel .external-button:hover {
            opacity: 1 !important;
        }

        /* 按钮图标 */
        .translator-panel .pin-button::after {
            content: "" !important;
            display: inline-block !important;
            width: 16px !important;
            height: 16px !important;
            background-size: contain !important;
            background-repeat: no-repeat !important;
            background-position: center !important;
        }
        .translator-panel .pin-button.unpinned::after {
            background-image: url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="7" r="4"/><path d="M12 12v9"/></svg>') !important;
        }
        .translator-panel .pin-button.pinned::after {
            background-image: url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="7" r="4" fill="currentColor"/><path d="M12 12v9"/></svg>') !important;
        }
        .translator-panel.translator-panel-dark .pin-button.unpinned::after {
            background-image: url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="%23ffffff" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="7" r="4"/><path d="M12 12v9"/></svg>') !important;
        }
        .translator-panel.translator-panel-dark .pin-button.pinned::after {
            background-image: url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="%23ffffff" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="7" r="4" fill="%23ffffff"/><path d="M12 12v9"/></svg>') !important;
        }
        .translator-panel .theme-button::after {
            content: "" !important;
            display: inline-block !important;
            width: 16px !important;
            height: 16px !important;
            background-size: contain !important;
            background-repeat: no-repeat !important;
            background-position: center !important;
        }
        .translator-panel .theme-button.light::after {
            background-image: url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/></svg>') !important;
        }
        .translator-panel .theme-button.dark::after {
            background-image: url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="%23ffffff" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="5"/><line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/><line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/></svg>') !important;
        }
        .translator-panel .clear-button::after {
            content: "" !important;
            display: inline-block !important;
            width: 16px !important;
            height: 16px !important;
            background-size: contain !important;
            background-repeat: no-repeat !important;
            background-position: center !important;
            background-image: url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 3l18 18M3 21l18-18M12 12v.01"/></svg>') !important;
        }
        .translator-panel.translator-panel-dark .clear-button::after {
            background-image: url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="%23ffffff" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 3l18 18M3 21l18-18M12 12v.01"/></svg>') !important;
        }
        .translator-panel .external-button::after {
            content: "" !important;
            display: inline-block !important;
            width: 16px !important;
            height: 16px !important;
            background-size: contain !important;
            background-repeat: no-repeat !important;
            background-position: center !important;
            background-image: url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/></svg>') !important;
        }
        .translator-panel.translator-panel-dark .external-button::after {
            background-image: url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="%23ffffff" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/></svg>') !important;
        }

        /* 下拉菜单基础样式 */
        .translator-panel .dropdown-menu {
            position: fixed !important;
            top: 0 !important;
            left: 0 !important;
            min-width: 150px !important;
            max-height: 300px !important;
            overflow-y: auto !important;
            background: var(--panel-bg) !important;
            border: 1px solid var(--panel-border) !important;
            border-radius: 6px !important;
            box-shadow: 0 2px 8px var(--panel-shadow) !important;
            opacity: 0 !important;
            visibility: hidden !important;
            transform: scale(0.95) !important;
            transform-origin: top left !important;
            transition: opacity 0.15s ease-out, transform 0.15s ease-out, visibility 0.15s !important;
            z-index: 2147483647 !important;
            margin-top: 4px !important;
            margin-left: 4px !important;
        }

        /* 移除所有三角形装饰 */
        .translator-panel .dropdown-menu::before,
        .translator-panel .dropdown-menu::after,
        .translator-panel .title-wrapper::before,
        .translator-panel .title-wrapper::after,
        .translator-panel .title-bar::before,
        .translator-panel .title-bar::after {
            display: none !important;
            content: none !important;
            border: none !important;
            clip-path: none !important;
            background: none !important;
        }

        /* 下拉菜单显示状态 */
        .translator-panel .dropdown-menu.show {
            display: block !important;
            visibility: visible !important;
            opacity: 1 !important;
            transform: scale(1) !important;
        }

        /* 下拉菜单滚动条样式 */
        .translator-panel .dropdown-menu::-webkit-scrollbar {
            width: 3px !important; /* 更细的滚动条 */
            height: 3px !important;
        }

        .translator-panel .dropdown-menu::-webkit-scrollbar-thumb {
            background: var(--text-tertiary) !important;
            border-radius: 3px !important;
            transition: background-color 0.2s !important;
        }

        .translator-panel .dropdown-menu::-webkit-scrollbar-thumb:hover {
            background: var(--text-secondary) !important;
        }

        .translator-panel .dropdown-menu::-webkit-scrollbar-track {
            background: transparent !important; /* 透明轨道，更简约 */
            border-radius: 3px !important;
        }

        /* 下拉菜单项样式 */
        .translator-panel .dropdown-item {
            padding: var(--spacing-md) var(--spacing-xl) !important;
            cursor: pointer !important;
            font-size: var(--font-sm) !important;
            color: var(--panel-text) !important;
            display: flex !important;
            align-items: center !important;
            justify-content: space-between !important;
            white-space: nowrap !important;
            position: relative !important;
        }

        .translator-panel .dropdown-item:hover {
            background-color: var(--hover-bg) !important;
        }

        .translator-panel .dropdown-item .translator-name {
            display: flex !important;
            align-items: center !important;
            gap: var(--spacing-sm) !important;
        }

        .translator-panel .dropdown-item.active .translator-name {
            font-weight: 600 !important;
        }

        .translator-panel .dropdown-item.is-default .translator-name::after {
            content: '默认' !important;
            font-size: var(--font-xs) !important;
            font-weight: normal !important;
            padding: 2px 4px !important;
            border-radius: 3px !important;
            background: var(--text-tertiary) !important;
            color: var(--panel-bg) !important;
            margin-left: var(--spacing-sm) !important;
            opacity: 0.8 !important;
        }

        .translator-panel .dropdown-item .set-default {
            opacity: 0 !important;
            transition: all 0.2s !important;
            color: var(--text-tertiary) !important;
            padding: var(--spacing-xs) var(--spacing-sm) !important;
            border-radius: var(--spacing-xs) !important;
            font-size: var(--font-xs) !important;
        }

        .translator-panel .dropdown-item:hover .set-default {
            opacity: 1 !important;
        }

        .translator-panel .dropdown-item .set-default:hover {
            color: var(--active-link) !important;
            background-color: var(--hover-bg) !important;
        }

        .translator-panel .dropdown-item.is-default .set-default {
            display: none !important;
        }

        /* 文本样式 */
        .translator-panel .title {
            font-size: var(--font-sm) !important;
            font-weight: 500 !important;
            color: var(--title-text) !important;
            white-space: nowrap !important;
        }

        .translator-panel .switch-text {
            font-size: var(--font-sm) !important;
            color: var(--text-tertiary) !important;
            opacity: 0.8 !important;
            white-space: nowrap !important;
        }

        /* 错误状态 */
        .translator-panel .error {
            padding: var(--spacing-xl) 0 !important;
            text-align: center !important;
            font-size: var(--font-sm) !important;
            color: var(--error) !important;
        }

        /* 发音按钮样式 */
        .phonetic-buttons {
            margin: 0 0 var(--spacing-sm) 0 !important;
            display: flex !important;
            gap: var(--spacing-xl) !important;
            flex-wrap: wrap !important;
            padding: 0 !important;
        }

        .audio-button {
            border: none;
            background: none;
            cursor: pointer;
            padding: var(--spacing-xs) var(--spacing-sm);
            font-size: var(--font-xl);
            color: var(--active-link);
            transition: all 0.3s;
            border-radius: var(--spacing-xs);
            display: inline-flex;
            align-items: center;
            justify-content: center;
        }

        .audio-button:hover {
            background-color: var(--hover-bg);
        }

        .audio-button:active {
            transform: scale(0.95);
        }

        /* 词性标签容器样式 */
        .translator-panel .pos-tags {
            display: flex !important;
            flex-direction: column !important;
            gap: var(--spacing-xs) !important; /* 减少词性标签之间的间距 */
            min-width: 35px !important;
            flex-shrink: 0 !important;
            align-items: center !important;
        }

        /* 词性标签样式 */
        .translator-panel .pos-tag {
            font-weight: 500 !important;
            color: #fff !important;
            padding: var(--spacing-xs) var(--spacing-sm) !important;
            border-radius: var(--spacing-xs) !important;
            font-size: var(--font-sm) !important;
            text-align: center !important;
            width: 100% !important;
            margin-bottom: 0 !important;
            background: var(--pos-color, #6b7280) !important;
        }

        /* 词汇等级标识样式 */
        .translator-panel .level-tag {
            font-size: var(--font-xs) !important;
            padding: var(--spacing-xs) var(--spacing-sm) !important;
            border-radius: 3px !important;
            text-align: center !important;
            min-width: 24px !important;
            margin-top: 2px !important;
            font-weight: 500 !important;
            letter-spacing: 0.5px !important;
        }

        /* 调整释义块样式 */
        .translator-panel .sense-block {
            margin: var(--spacing-xs) 0 !important; /* 减少上下间距 */
            padding: var(--spacing-xs) 0 !important; /* 减少上下内边距 */
            display: flex !important;
            gap: var(--spacing-md) !important; /* 减少词性标签和释义内容之间的间距 */
            align-items: flex-start !important;
            border-bottom: 1px solid var(--panel-border) !important;
            transition: var(--theme-transition) !important;
        }

        /* 调整词性标签和释义内容的布局 */
        .translator-panel .def-content {
            flex: 1 !important;
            min-width: 0 !important; /* 确保flex子项可以收缩 */
            word-wrap: break-word !important; /* 确保长单词换行 */
            overflow-wrap: break-word !important; /* 现代浏览器的单词换行 */
            overflow: visible !important; /* 确保内容不被截断 */
        }

        /* 动画效果 */
        .translator-panel.show {
            opacity: 1 !important;
            transform: translateY(0) !important;
        }

        .translator-panel.active {
            display: block !important;
            opacity: 1 !important;
            transform: translateY(0) !important;
        }

        /* 添加释义发音样式 */
        .translator-panel .sense-phonetic {
            margin-bottom: var(--spacing-xs) !important; /* 减少下边距 */
            opacity: 0.8 !important;
            display: flex !important;
            flex-wrap: wrap !important;
            gap: var(--spacing-md) !important; /* 减少间距 */
        }

        .translator-panel .sense-phonetic .phonetic-item {
            font-size: var(--font-sm) !important;
            color: var(--text-secondary) !important;
            flex: 0 1 auto !important;
        }

        .translator-panel .sense-phonetic .audio-button {
            font-size: var(--font-lg) !important;
            padding: var(--spacing-xs) !important;
        }

        /* 添加切换图标样式 */
        .translator-panel .switch-icon {
            width: 12px !important;
            height: 12px !important;
            margin-left: 4px !important;
            transition: transform 0.2s !important;
            display: inline-block !important;
            vertical-align: middle !important;
            transform: rotate(0deg) !important;
        }

        .translator-panel .switch-icon.open {
            transform: rotate(180deg) !important;
        }
    `);

    // 状态管理
    const state = {
        currentText: '',
        isDragging: false,
        lastClickTime: 0,
        clickCount: 0,
        ignoreNextSelection: false,
        allPanels: new Set(),
        pinnedPanels: new Set(),
        activePanel: null,
        isSelectingInPanel: false,
        selectingPanel: null,
        isRightClickPending: false // 添加右键状态跟踪
    };

    // 工具函数
    const utils = {
        escapeMap: {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'},
        escapeHtml: text => text.replace(/[&<>"']/g, c => utils.escapeMap[c]),
        isDarkMode: () => GM_getValue('darkMode', false),
        toggleDarkMode() {
            const isDark = !GM_getValue('darkMode', false);
            GM_setValue('darkMode', isDark);
            document.querySelectorAll('.translator-panel').forEach(p => {
                p.classList.toggle(CONFIG.darkModeClass, isDark);
                p.querySelector('.theme-button').className = `theme-button ${isDark ? 'dark' : 'light'}`;
            });
        },
        debounce(fn, delay) {
            let timer;
            return (...args) => {
                clearTimeout(timer);
                timer = setTimeout(() => fn.apply(this, args), delay);
            };
        },
        addEventHandler(element, eventType, handler, options = {}) {
            if (!element || !eventType || !handler) return;
            if (element[`${eventType}Handler`]) element.removeEventListener(eventType, element[`${eventType}Handler`], options);
            element[`${eventType}Handler`] = handler;
            element.addEventListener(eventType, handler, options);
        },
        removeEventHandler(element, eventType, options = {}) {
            if (!element || !eventType) return;
            if (element[`${eventType}Handler`]) {
                element.removeEventListener(eventType, element[`${eventType}Handler`], options);
                delete element[`${eventType}Handler`];
            }
        },
        removeAllEventHandlers(element) {
            if (!element) return;
            const eventTypes = ['click', 'mousedown', 'mouseup', 'mousemove', 'contextmenu'];
            eventTypes.forEach(type => utils.removeEventHandler(element, type, {capture: true}));
            eventTypes.forEach(type => utils.removeEventHandler(element, type, {capture: false}));
        },
        createElement(tag, attributes = {}, children = []) {
            const element = document.createElement(tag);
            Object.entries(attributes).forEach(([k, v]) => k === 'style' && typeof v === 'object' ? Object.assign(element.style, v) : element.setAttribute(k, v));
            children.forEach(child => element.appendChild(typeof child === 'string' ? document.createTextNode(child) : child));
            return element;
        },
        setError(message, targetPanel) {
            const content = targetPanel?.querySelector('.content');
            if (content) content.innerHTML = `<div class="error">${message}</div>`;
        },
        showPanel(x, y, targetPanel = panel) {
            if (targetPanel.style.display === 'block') {
                targetPanel.classList.add('show');
                return;
            }
            const {innerWidth: vw, innerHeight: vh} = window;
            const {pageXOffset: sx, pageYOffset: sy} = window;
            const spacing = CONFIG.panelSpacing;
            const panelWidth = CONFIG.panelWidth;

            // 先临时显示面板以获取实际高度
            Object.assign(targetPanel.style, {
                position: 'absolute',
                left: '-9999px',
                top: '-9999px',
                display: 'block',
                maxHeight: `${CONFIG.maxPanelHeight}px`
            });

            // 获取实际高度
            const actualHeight = Math.min(targetPanel.offsetHeight, CONFIG.maxPanelHeight);
            const contentMaxHeight = actualHeight - CONFIG.titleBarHeight - CONFIG.panelSpacing;

            // 计算面板的水平位置，使用文档坐标
            const panelX = Math.max(
                spacing + sx,
                Math.min(sx + vw - panelWidth - spacing, x)
            );

            // 计算面板的垂直位置，使用文档坐标
            const spaceBelow = vh - (y - sy);
            const spaceAbove = y - sy;

            // 确定面板显示位置（上方或下方）
            const panelY = spaceBelow >= actualHeight || spaceBelow >= spaceAbove ?
                // 显示在下方，紧贴文本
                y + spacing :
                // 显示在上方，紧贴文本
                y - actualHeight - spacing;

            // 设置最终位置
            Object.assign(targetPanel.style, {
                position: 'absolute',
                left: `${panelX}px`,
                top: `${panelY}px`,
                maxHeight: `${actualHeight}px`,
                display: 'block'
            });

            const content = targetPanel.querySelector('.content');
            if (content) content.style.maxHeight = `${contentMaxHeight}px`;

            targetPanel.classList.toggle(CONFIG.darkModeClass, this.isDarkMode());
            setTimeout(() => targetPanel.classList.add('show'), 50);
        },
        hidePanel(targetPanel = panel) {
            if (!targetPanel || state.pinnedPanels.has(targetPanel)) return;
            targetPanel.classList.remove('show');
            setTimeout(() => {
                if (!targetPanel.classList.contains('show')) targetPanel.style.display = 'none';
            }, CONFIG.animationDuration);
            if (targetPanel === state.activePanel) state.activePanel = null;
        },
        isInvalidElement: e => {
            try {
                return e && e instanceof Element && (['INPUT', 'TEXTAREA', 'SELECT', 'OPTION'].includes(e.tagName) || e.isContentEditable || e.closest('[contenteditable]'));
            } catch (error) {
                console.error('检查元素有效性时出错:', error);
                return false;
            }
        },
        isTranslatable(text) {
            const t = text.trim().replace(/\s+/g, '');
            if (!t) return false;
            if (/[a-zA-Z]/.test(t)) return true;
            const chinesePattern = /[\u4e00-\u9fff]/;
            const nonChinesePattern = /[^\u4e00-\u9fff\d\s\p{P}\p{S}]/u;
            if (chinesePattern.test(t) && !nonChinesePattern.test(t)) return false;
            if (/^[\d\s\p{P}\p{S}]+$/u.test(t)) return false;
            return true;
        },
        createNewPanel() {
            const newPanel = panel.cloneNode(true);
            newPanel.style.display = 'none';
            document.body.appendChild(newPanel);
            state.allPanels.add(newPanel);
            setupPanelEvents(newPanel);
            return newPanel;
        },
        getOrCreatePanel() {
            if (state.activePanel && !state.pinnedPanels.has(state.activePanel)) return state.activePanel;
            const availablePanel = Array.from(state.allPanels).find(p => !state.pinnedPanels.has(p) && p.style.display !== 'block');
            if (availablePanel) {
                state.activePanel = availablePanel;
                return availablePanel;
            }
            state.activePanel = this.createNewPanel();
            return state.activePanel;
        },
        isClickInPanel: e => e.target.closest('.translator-panel') !== null,
        preventSelectionTrigger() {
            state.ignoreNextSelection = true;
            setTimeout(() => state.ignoreNextSelection = false, 100);
        },
        updateAllPanels(newTranslator, isDefaultUpdate = false) {
            const defaultTranslator = GM_getValue('defaultTranslator', 'google');
            if (!isDefaultUpdate) CONFIG.currentTranslator = newTranslator;

            document.querySelectorAll('.translator-panel').forEach(p => {
                if (!isDefaultUpdate) p.querySelector('.title').textContent = TRANSLATORS[newTranslator].name;

                p.querySelectorAll('.dropdown-item').forEach(item => {
                    const key = item.dataset.translator;
                    const isDefault = key === defaultTranslator;
                    const isActive = key === CONFIG.currentTranslator;

                    item.className = `dropdown-item${isActive ? ' active' : ''}${isDefault ? ' is-default' : ''}`;

                    const nameSpan = item.querySelector('.translator-name');
                    if (nameSpan) nameSpan.innerHTML = `${isActive ? '✓ ' : ''}${TRANSLATORS[key].name}`;

                    const defaultSpan = item.querySelector('.set-default');
                    if (defaultSpan) {
                        defaultSpan.textContent = isDefault ? '默认' : '设为默认';
                        if (isDefaultUpdate && isDefault) {
                            defaultSpan.classList.add('animating');
                            setTimeout(() => defaultSpan.classList.remove('animating'), 500);
                        }
                    }
                });
            });
        },
        cleanupPanel(targetPanel) {
            if (!targetPanel) return;
            this.removeAllEventHandlers(targetPanel);
            targetPanel.remove();
        }
    };

    // 翻译功能
    async function translate(text, targetPanel = panel) {
        if (!text || !targetPanel) {
            console.error('翻译参数无效:', { text, targetPanel });
            throw new Error('翻译参数无效');
        }

        const textToTranslate = text.replace(/\n\s*\n/g, '\n\n').replace(/\s*\n\s*/g, '\n').trim();
        if (!textToTranslate) throw new Error('翻译文本为空');

        const translator = TRANSLATORS[CONFIG.currentTranslator];
        if (!translator) throw new Error('未找到指定的翻译器');

        const formattedTranslation = await translator.translate(textToTranslate);
        if (!formattedTranslation) throw new Error('翻译结果为空');

        const content = targetPanel.querySelector('.content');
        if (!content) throw new Error('未找到内容容器元素');

        content.innerHTML = `
            <div class="source-text-container">
                <div class="source-text"><strong>${utils.escapeHtml(textToTranslate).replace(/\n/g, '<br>')}</strong></div>
            </div>
            <div class="translation-container">
                <div class="translation">${formattedTranslation}</div>
            </div>`;

        try {
            targetPanel.querySelectorAll('.audio-button').forEach(btn => {
                btn.addEventListener('click', async (e) => {
                    e.preventDefault(); e.stopPropagation();
                    const url = btn.getAttribute('data-url');
                    if (url) {
                        try {
                            utils.preventSelectionTrigger();
                            state.isSelectingInPanel = false;
                            state.selectingPanel = null;
                            await audio.play(url);
                        } catch (err) {
                            console.error('播放音频失败:', err);
                            utils.setError('音频播放失败', targetPanel);
                        }
                    }
                });
            });
        } catch (err) {
            console.error('添加音频按钮事件失败:', err);
        }

        targetPanel.classList.add('show');
    }

    // 创建翻译面板
    function createTranslatorPanel() {
        const panel = document.createElement('div');
        panel.className = 'translator-panel';
        panel.innerHTML = `<div class="title-bar">
                <div class="title-wrapper">
                    <span class="title">${TRANSLATORS[CONFIG.currentTranslator].name}</span>
                    <span class="switch-text">（点击切换）</span>
                <svg class="switch-icon" viewBox="0 0 1024 1024"><path fill="currentColor" d="M884 256h-75c-5.1 0-9.9 2.5-12.9 6.6L512 654.2 227.9 262.6c-3-4.1-7.8-6.6-12.9-6.6h-75c-6.5 0-10.3 7.4-6.5 12.7l352.6 486.1c12.8 17.6 39 17.6 51.7 0l352.6-486.1c3.9-5.3.1-12.7-6.4-12.7z"/></svg>
                <div class="dropdown-menu"></div>
                </div>
                <div class="external-button" title="在新窗口打开翻译"></div>
                <div class="pin-button unpinned" title="固定窗口"></div>
                <div class="theme-button light" title="切换深色模式"></div>
                <div class="clear-button" title="关闭所有窗口"></div>
            </div>
            <div class="content"></div>`;

        setupPanelEvents(panel);
        return panel;
    }

    // 修改事件处理函数
    const handleSelection = utils.debounce(async (e) => {
        if (isTranslating || state.ignoreNextSelection) return;

        try {
            const selection = window.getSelection();
            if (!selection) {
                throw new Error('无法获取选中文本');
            }

            const text = selection.toString().trim();
            if (!text || !utils.isTranslatable(text)) return;

            if (e && e.target && e.target.closest('.translator-panel')) return;

            isTranslating = true;
            beforeCreatePanel();

            try {
                const panel = createTranslatorPanel();
                if (!panel) {
                    throw new Error('创建翻译面板失败');
                }

                document.body.appendChild(panel);
                state.allPanels.add(panel);
                state.activePanel = panel;

                const range = selection.getRangeAt(0);
                if (!range) {
                    throw new Error('无法获取选中文本位置');
                }

                const rect = range.getBoundingClientRect();
                const scrollX = window.pageXOffset || document.documentElement.scrollLeft;
                const scrollY = window.pageYOffset || document.documentElement.scrollTop;

                utils.showPanel(rect.left + scrollX, rect.bottom + scrollY, panel);
                state.currentText = text;
                await translate(text, panel);
            } catch (error) {
                console.error('处理选中文本时出错:', error);
                if (state.activePanel) {
                    utils.setError(error.message || '翻译失败，请稍后重试', state.activePanel);
                }
            }
        } catch (error) {
            console.error('选中文本处理失败:', error);
        } finally {
            isTranslating = false;
        }
    }, CONFIG.triggerDelay);

    // 事件处理器
    const eventHandlers = {
        handleMouseDown(e) {
            if (state.isSelectingInPanel) {
                e.stopPropagation(); e.preventDefault();
                return;
            }
            if (e.button === 2) {
                state.isRightClickPending = true;
                return;
            }
            const now = Date.now();
            if (now - state.lastClickTime > 250) state.clickCount = 0;
            state.clickCount++;
            state.lastClickTime = now;
            if (state.clickCount >= 3) utils.preventSelectionTrigger();
        },

        handleMouseUp(e) {
            if (state.isSelectingInPanel) {
                e.stopPropagation(); e.preventDefault();
                return;
            }
            if (state.isRightClickPending && e.button === 0) {
                document.querySelectorAll('.translator-panel:not(.pinned)').forEach(p => utils.hidePanel(p));
                state.isRightClickPending = false;
                utils.preventSelectionTrigger();
                return;
            }
            if (e.button === 2) {
                state.isRightClickPending = false;
                return;
            }
            if (utils.isClickInPanel(e) || state.isDragging) {
                utils.preventSelectionTrigger();
                return;
            }
            handleSelection(e);
        },

        handleOutsideClick(e) {
            if (state.isSelectingInPanel) {
                e.stopPropagation(); e.preventDefault();
                return;
            }
            if (state.isRightClickPending || state.isDragging || utils.isClickInPanel(e)) return;

            document.querySelectorAll('.translator-panel:not(.pinned)').forEach(p => {
                p.classList.remove('show');
                    setTimeout(() => {
                    if (!p.classList.contains('show')) {
                        p.style.display = 'none';
                        if (p !== currentPanel && !p.classList.contains('pinned')) p.remove();
                        }
                    }, CONFIG.animationDuration);
                });
        }
    };

    // 注册事件监听器
    document.addEventListener('mousedown', eventHandlers.handleMouseDown, {capture: true, passive: false});
    document.addEventListener('mouseup', eventHandlers.handleMouseUp, {capture: true, passive: false});
    document.addEventListener('click', eventHandlers.handleOutsideClick, {capture: true, passive: false});

    // 添加右键菜单事件处理
    document.addEventListener('contextmenu', e => {
        if (!e.target.closest('.translator-panel')) state.isRightClickPending = true;
    }, {passive: false});

    // 处理翻译器切换
    function setupTranslatorSwitch(targetPanel) {
        const titleWrapper = targetPanel.querySelector('.title-wrapper');
        const switchIcon = targetPanel.querySelector('.switch-icon');
        const dropdownMenu = targetPanel.querySelector('.dropdown-menu');
        targetPanel.isDropdownOpen = false;

        function updateDropdownMenu() {
            const defaultTranslator = GM_getValue('defaultTranslator', 'google');
            dropdownMenu.innerHTML = Object.entries(TRANSLATORS)
                .map(([key, translator]) => `<div class="dropdown-item${key === CONFIG.currentTranslator ? ' active' : ''}${key === defaultTranslator ? ' is-default' : ''}" data-translator="${key}">
                    <span class="translator-name">${key === CONFIG.currentTranslator ? '✓ ' : ''}${translator.name}</span>
                        <span class="set-default" title="设为默认翻译器">设为默认</span>
                </div>`).join('');
        }

        const toggleDropdown = (show) => {
            if (show === targetPanel.isDropdownOpen) return;
            targetPanel.isDropdownOpen = show;
            switchIcon.classList.toggle('open', show);

            if (show) {
                updateDropdownMenu();
                dropdownMenu.classList.add('show');
                // 计算下拉菜单的位置，添加边距
                const titleRect = titleWrapper.getBoundingClientRect();
                dropdownMenu.style.top = `${titleRect.bottom + 4}px`; // 添加 4px 的上边距
                dropdownMenu.style.left = `${titleRect.left}px`;
                dropdownMenu.style.display = 'block';
                dropdownMenu.style.opacity = '1';
                dropdownMenu.style.transform = 'scale(1)';
            } else {
                dropdownMenu.classList.remove('show');
                setTimeout(() => {
                    if (!targetPanel.isDropdownOpen) {
                        dropdownMenu.innerHTML = '';
                        dropdownMenu.style.display = 'none';
                        dropdownMenu.style.opacity = '0';
                        dropdownMenu.style.transform = 'scale(0.95)';
                    }
                }, 150);
            }
        };

        // 点击标题栏切换下拉菜单
        utils.addEventHandler(titleWrapper, 'click', (e) => {
            e.preventDefault();
            e.stopPropagation();
            toggleDropdown(!targetPanel.isDropdownOpen);
        }, {passive: false});

        // 点击面板任何地方关闭下拉菜单
        utils.addEventHandler(targetPanel, 'click', (e) => {
            if (!e.target.closest('.title-wrapper') && targetPanel.isDropdownOpen) {
                toggleDropdown(false);
            }
        }, {passive: false});

        // 点击下拉菜单项切换翻译器
        utils.addEventHandler(dropdownMenu, 'click', (e) => {
            e.stopPropagation(); // 阻止事件冒泡
            const item = e.target.closest('.dropdown-item');
            if (!item) return;

            const translator = item.dataset.translator;
            if (translator) {
                if (e.target.closest('.set-default')) {
                    GM_setValue('defaultTranslator', translator);
                    updateDropdownMenu();
                } else {
                    CONFIG.currentTranslator = translator;
                    const switchText = targetPanel.querySelector('.switch-text');
                    switchText.textContent = TRANSLATORS[translator].name;
                    toggleDropdown(false);

                    // 如果有当前文本，重新翻译
                    if (state.currentText) {
                        translate(state.currentText, targetPanel);
                    }
                }
            }
        }, {passive: false});

        // 移除旧的事件监听器
        titleWrapper.removeEventListener('click', titleWrapper.clickHandler);
        dropdownMenu.removeEventListener('click', dropdownMenu.clickHandler);

        // 移除旧的鼠标离开事件监听器
        targetPanel.removeEventListener('mouseleave', targetPanel.mouseLeaveHandler);
        titleWrapper.removeEventListener('mouseleave', titleWrapper.mouseLeaveHandler);
        dropdownMenu.removeEventListener('mouseleave', dropdownMenu.mouseLeaveHandler);

        // 添加新的事件监听器
        titleWrapper.clickHandler = (e) => {
            e.preventDefault();
            e.stopPropagation();
            toggleDropdown(!targetPanel.isDropdownOpen);
        };
        titleWrapper.addEventListener('click', titleWrapper.clickHandler);

        dropdownMenu.clickHandler = (e) => {
            e.preventDefault();
            e.stopPropagation();

            const item = e.target.closest('.dropdown-item');
            if (!item) return;

            const setDefaultBtn = e.target.closest('.set-default');
            const translatorKey = item.dataset.translator;

            if (setDefaultBtn) {
                // 设为默认翻译器，但不改变当前翻译器
                GM_setValue('defaultTranslator', translatorKey);
                utils.updateAllPanels(translatorKey, true);
            } else if (translatorKey !== CONFIG.currentTranslator) {
                // 切换当前翻译器并重新翻译
                utils.updateAllPanels(translatorKey, false);

                // 如果有当前文本，重新翻译
                if (state.currentText) {
                    translate(state.currentText, targetPanel);
                }
            }

            // 更新下拉菜单内容但保持打开状态
            updateDropdownMenu();
        };
        dropdownMenu.addEventListener('click', dropdownMenu.clickHandler);

        // 添加鼠标进入事件处理
        const handleMouseEnter = () => {
            clearTimeout(targetPanel.dropdownCloseTimer);
        };

        // 添加鼠标离开事件处理
        const handleMouseLeave = () => {
            targetPanel.dropdownCloseTimer = setTimeout(() => {
            if (targetPanel.isDropdownOpen) {
                toggleDropdown(false);
            }
            }, 100); // 添加小延迟，使过渡更平滑
        };

        // 为整个面板添加鼠标进入/离开事件
        targetPanel.addEventListener('mouseenter', handleMouseEnter);
        targetPanel.addEventListener('mouseleave', handleMouseLeave);

        // 保存事件处理函数引用以便后续清理
        targetPanel.mouseEnterHandler = handleMouseEnter;
        targetPanel.mouseLeaveHandler = handleMouseLeave;
    }

    // 处理固定按钮点击
    function handlePinClick(e, targetPanel) {
        e.preventDefault(); e.stopPropagation();
        utils.preventSelectionTrigger();

        const pinButton = e.target;
        const isPinned = state.pinnedPanels.has(targetPanel);

        if (isPinned) {
            state.pinnedPanels.delete(targetPanel);
            targetPanel.classList.remove('pinned');
            pinButton.className = 'pin-button unpinned';
            pinButton.title = '固定窗口';
        } else {
            state.pinnedPanels.add(targetPanel);
            targetPanel.classList.add('pinned');
            pinButton.className = 'pin-button pinned';
            pinButton.title = '取消固定';
        }
    }

    // 设置面板事件
    function setupPanelEvents(targetPanel) {
        setupTranslatorSwitch(targetPanel);

        // 初始化固定按钮状态
        const pinButton = targetPanel.querySelector('.pin-button');
        const isPinned = state.pinnedPanels.has(targetPanel);
        pinButton.className = `pin-button ${isPinned ? 'pinned' : 'unpinned'}`;
        pinButton.title = isPinned ? '取消固定' : '固定窗口';
        utils.addEventHandler(pinButton, 'click', (e) => handlePinClick(e, targetPanel));

        // 初始化主题按钮状态和事件
        const themeButton = targetPanel.querySelector('.theme-button');
        const isDark = utils.isDarkMode();
        themeButton.className = `theme-button ${isDark ? 'dark' : 'light'}`;
        themeButton.title = isDark ? '切换亮色模式' : '切换深色模式';
        targetPanel.classList.toggle(CONFIG.darkModeClass, isDark);

        utils.addEventHandler(themeButton, 'click', (e) => {
            e.preventDefault(); e.stopPropagation();
            utils.toggleDarkMode();
            document.querySelectorAll('.translator-panel .theme-button').forEach(btn => {
                btn.title = btn.classList.contains('dark') ? '切换亮色模式' : '切换深色模式';
            });
        });

        // 初始化清除按钮事件
        utils.addEventHandler(targetPanel.querySelector('.clear-button'), 'click', (e) => {
            e.preventDefault(); e.stopPropagation();
            utils.preventSelectionTrigger();

            // 重置选择状态
            state.isSelectingInPanel = false;
            state.selectingPanel = null;
            document.body.style.userSelect = '';

            // 关闭所有翻译窗口
            Array.from(document.querySelectorAll('.translator-panel')).forEach(panel => {
                state.pinnedPanels.delete(panel);
                panel.classList.remove('pinned', 'show');
                utils.removeAllEventHandlers(panel);
                state.allPanels.delete(panel);
                panel.remove();
            });

            // 重置所有状态
            state.activePanel = null;
            state.currentText = '';
            state.isSelectingInPanel = false;
            state.selectingPanel = null;
            state.isDragging = false;
            state.dragTarget = null;
            state.lastClickTime = 0;
            state.clickCount = 0;
            state.ignoreNextSelection = false;
            state.isRightClickPending = false;

            // 重新创建主面板
            const newPanel = createTranslatorPanel();
            document.body.appendChild(newPanel);
            state.allPanels.add(newPanel);
            currentPanel = newPanel;
        });

        // 添加面板内选择事件处理
        utils.addEventHandler(targetPanel, 'mousedown', (e) => {
            if (e.target.closest('.audio-button')) return;
            if (e.target.closest('.content')) {
                const now = Date.now();
                if (now - state.lastClickTime < 250) {
                    state.clickCount++;
                    if (state.clickCount >= 3) {
                        state.lastClickTime = now;
                        return;
                    }
                } else {
                    state.clickCount = 1;
                }
                state.lastClickTime = now;
                state.isSelectingInPanel = true;
                state.selectingPanel = targetPanel;
                document.body.style.userSelect = 'none';
                e.stopPropagation();
            }
        }, {passive: false});

        // 添加右键菜单事件处理
        utils.addEventHandler(targetPanel, 'contextmenu', (e) => {
            const selection = window.getSelection();
            if (selection && !selection.isCollapsed && e.target.closest('.content')) {
                e.stopPropagation();
                return;
            }
            e.preventDefault(); e.stopPropagation();
            document.querySelectorAll('.translator-panel:not(.pinned)').forEach(p => utils.hidePanel(p));
        }, {passive: false});

        utils.addEventHandler(targetPanel, 'mousemove', e => {
            if (state.isSelectingInPanel) e.stopPropagation();
        }, {passive: false});

        utils.addEventHandler(targetPanel, 'mouseup', e => {
            if (state.isSelectingInPanel) {
                state.isSelectingInPanel = false;
                state.selectingPanel = null;
                document.body.style.userSelect = '';
                e.stopPropagation();
                utils.preventSelectionTrigger();
            }
        }, {passive: false});

        // 添加全局鼠标抬起事件处理
        utils.addEventHandler(document, 'mouseup', e => {
            if (state.isSelectingInPanel) {
                state.isSelectingInPanel = false;
                state.selectingPanel = null;
                document.body.style.userSelect = '';
                e.stopPropagation(); e.preventDefault();
                utils.preventSelectionTrigger();
            }
        }, { capture: true, passive: false });

        // 标题栏拖动功能
        const titleBar = targetPanel.querySelector('.title-bar');
        targetPanel.dataset.dragInfo = JSON.stringify({startX: 0, startY: 0, startLeft: 0, startTop: 0});

        const handleDragStart = e => {
            if (!e.target.closest('.title-bar')) return;
            state.isDragging = true;
            state.dragTarget = targetPanel;

            const dragInfo = {
                startX: e.clientX,
                startY: e.clientY,
                startLeft: parseFloat(targetPanel.style.left) || 0,
                startTop: parseFloat(targetPanel.style.top) || 0,
                scrollX: window.scrollX,
                scrollY: window.scrollY
            };
            targetPanel.dataset.dragInfo = JSON.stringify(dragInfo);

            targetPanel.classList.add('dragging');
            utils.addEventHandler(document, 'mousemove', handleDragMove, {passive: false});
            utils.addEventHandler(document, 'mouseup', handleDragEnd, {passive: false});
            e.preventDefault(); e.stopPropagation();
        };

        const handleDragMove = e => {
            if (!state.isDragging || state.dragTarget !== targetPanel) return;

            const dragInfo = JSON.parse(targetPanel.dataset.dragInfo);
            const dx = e.clientX - dragInfo.startX;
            const dy = e.clientY - dragInfo.startY;
            const scrollDX = window.scrollX - dragInfo.scrollX; // 使用scrollX替代pageXOffset
            const scrollDY = window.scrollY - dragInfo.scrollY; // 使用scrollY替代pageYOffset

            const viewportWidth = window.innerWidth;
            const viewportHeight = window.innerHeight;
            const currentPanelWidth = targetPanel.offsetWidth;
            const currentPanelHeight = targetPanel.offsetHeight;
            const minVisiblePart = CONFIG.titleBarHeight;

            // 计算新位置，考虑滚动偏移
            const newX = Math.max(
                -currentPanelWidth + minVisiblePart,
                Math.min(viewportWidth + window.scrollX - minVisiblePart,
                    dragInfo.startLeft + dx + scrollDX)
            );
            const newY = Math.max(
                window.scrollY,
                Math.min(viewportHeight + window.scrollY - minVisiblePart,
                    dragInfo.startTop + dy + scrollDY)
            );

            targetPanel.style.left = `${newX}px`;
            targetPanel.style.top = `${newY}px`;
            e.preventDefault(); e.stopPropagation();
        };

        const handleDragEnd = e => {
            if (!state.isDragging || state.dragTarget !== targetPanel) return;

            state.isDragging = false;
            state.dragTarget = null;
            targetPanel.classList.remove('dragging');

            utils.removeEventHandler(document, 'mousemove');
            utils.removeEventHandler(document, 'mouseup');

            const dragInfo = JSON.parse(targetPanel.dataset.dragInfo);
            if (Math.abs(dragInfo.startLeft - parseFloat(targetPanel.style.left)) > 5 ||
                Math.abs(dragInfo.startTop - parseFloat(targetPanel.style.top)) > 5) {
                if (!state.pinnedPanels.has(targetPanel)) {
                    const pinButton = targetPanel.querySelector('.pin-button');
                    pinButton.className = 'pin-button pinned';
                    pinButton.title = '取消固定';
                    targetPanel.classList.add('pinned');
                    state.pinnedPanels.add(targetPanel);
                }
            }

            if (e) {
                e.preventDefault(); e.stopPropagation();
            }
        };

        utils.addEventHandler(targetPanel, 'mousedown', handleDragStart, {passive: false});

        // 初始化外部链接按钮事件
        utils.addEventHandler(targetPanel.querySelector('.external-button'), 'click', e => {
            e.preventDefault(); e.stopPropagation();
            utils.preventSelectionTrigger();

            const text = state.currentText;
            if (!text) return;

            const urls = {
                'google': `https://translate.google.com/?sl=auto&tl=zh-CN&text=${encodeURIComponent(text)}`,
                'youdao': `https://dict.youdao.com/w/${encodeURIComponent(text)}`,
                'cambridge': `https://dictionary.cambridge.org/dictionary/english-chinese-simplified/${encodeURIComponent(text)}`
            };

            const url = urls[CONFIG.currentTranslator];
            if (url) window.open(url, '_blank');
        }, {passive: false});
    }

    // 添加滚动事件处理
    let scrollTimer = null;
    utils.addEventHandler(window, 'scroll', () => {
        if (scrollTimer) return;
        scrollTimer = setTimeout(() => {
            scrollTimer = null;
            document.querySelectorAll('.translator-panel:not(.dragging)').forEach(panel => {
                if (!panel.style.display || panel.style.display === 'none') return;

                const rect = panel.getBoundingClientRect();
                const viewportWidth = window.innerWidth;
                const viewportHeight = window.innerHeight;

                // 检查面板是否部分不可见
                if (rect.right < CONFIG.panelSpacing ||
                    rect.left > viewportWidth - CONFIG.panelSpacing ||
                    rect.bottom < CONFIG.panelSpacing ||
                    rect.top > viewportHeight - CONFIG.panelSpacing) {

                    // 调整位置使面板完全可见
                    const newLeft = Math.max(
                        CONFIG.panelSpacing + window.scrollX,
                        Math.min(
                            window.scrollX + viewportWidth - panel.offsetWidth - CONFIG.panelSpacing,
                            rect.left + window.scrollX
                        )
                    );

                    const newTop = Math.max(
                        CONFIG.panelSpacing + window.scrollY,
                        Math.min(
                            window.scrollY + viewportHeight - panel.offsetHeight - CONFIG.panelSpacing,
                            rect.top + window.scrollY
                        )
                    );

                    panel.style.left = `${newLeft}px`;
                    panel.style.top = `${newTop}px`;
                }
            });
        }, 100); // 使用节流来优化性能
    }, { passive: true });

    // 创建主翻译面板
    const panel = document.createElement('div');
    panel.className = 'translator-panel';
    panel.innerHTML = `
        <div class="title-bar">
            <div class="title-wrapper">
                <span class="title">${TRANSLATORS[CONFIG.currentTranslator].name}</span>
                <span class="switch-text">（点击切换）</span>
                <svg class="switch-icon" viewBox="0 0 1024 1024">
                    <path fill="currentColor" d="M884 256h-75c-5.1 0-9.9 2.5-12.9 6.6L512 654.2 227.9 262.6c-3-4.1-7.8-6.6-12.9-6.6h-75c-6.5 0-10.3 7.4-6.5 12.7l352.6 486.1c12.8 17.6 39 17.6 51.7 0l352.6-486.1c3.9-5.3.1-12.7-6.4-12.7z"/>
                </svg>
                <div class="dropdown-menu"></div>
            </div>
            <div class="external-button" title="在新窗口打开翻译"></div>
            <div class="pin-button unpinned" title="固定窗口"></div>
            <div class="theme-button light" title="切换深色模式"></div>
            <div class="clear-button" title="关闭所有窗口"></div>
        </div>
        <div class="content"></div>`;
    document.body.appendChild(panel);
    state.allPanels.add(panel);

    // 初始化面板事件
    setupPanelEvents(panel);
})();