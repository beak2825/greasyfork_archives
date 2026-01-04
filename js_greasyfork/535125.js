// ==UserScript==
// @name         MidjourneyCN
// @namespace    https://github.com/cwser/midjourney-chinese-plugin
// @version      1.0.2
// @license      MIT
// @description  Midjourney 全界面汉化 + 浮动控制面板（⚠️⚠️⚠️需开启开发者模式）
// @author       cwser
// @homepageURL  https://github.com/cwser/midjourney-chinese-plugin
// @supportURL   https://github.com/cwser/midjourney-chinese-plugin/issues
// @match        https://www.midjourney.com/*
// @grant        GM_xmlhttpRequest
// @grant        GM_addStyle
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_registerMenuCommand
// @connect      cdn.jsdelivr.net
// @connect      midjourney.com
// @run-at       document-end
// @noframes
// @downloadURL https://update.greasyfork.org/scripts/535125/MidjourneyCN.user.js
// @updateURL https://update.greasyfork.org/scripts/535125/MidjourneyCN.meta.js
// ==/UserScript==

(function () {
    'use strict';

    const LANG_URLS = {
        'zh-CN': 'https://cdn.jsdelivr.net/gh/cwser/midjourney-chinese-plugin@main/lang/zh-CN.json',
        'zh-TW': 'https://cdn.jsdelivr.net/gh/cwser/midjourney-chinese-plugin@main/lang/zh-TW.json'
    };
    const CACHE_EXPIRY = 6 * 60 * 60 * 1000;
    const TRANSLATED_ATTR = 'data-translated';

    let currentLang = GM_getValue('language', 'zh-CN');
    let translationEnabled = GM_getValue('translationEnabled', true);
    let dictionaryTimestamp = null;
    let dictionaryStatus = '⏳ 加载中';
    let translationError = null;
    let statusIndicator;

    function fetchTranslationDict(lang) {
        return new Promise((resolve, reject) => {
            if (!LANG_URLS[lang]) {
                translationError = 'Language not supported';
                updateStatusDisplay();
                return reject(new Error(translationError));
            }
            GM_xmlhttpRequest({
                method: 'GET',
                url: LANG_URLS[lang],
                onload: (response) => {
                    if (response.status === 200) {
                        try {
                            const data = JSON.parse(response.responseText);
                            dictionaryTimestamp = new Date().toLocaleString();
                            dictionaryStatus = '✅ 已加载';
                            GM_setValue(`${lang}_cache`, {
                                timestamp: Date.now(),
                                data
                            });
                            translationError = null;
                            updateStatusDisplay();
                            resolve(data);
                        } catch (e) {
                            translationError = `解析错误: ${e.message}`;
                            dictionaryStatus = '❌ 解析错误';
                            updateStatusDisplay();
                            reject(e);
                        }
                    } else {
                        translationError = `加载失败: ${response.statusText}`;
                        dictionaryStatus = '❌ 加载失败';
                        updateStatusDisplay();
                        reject(new Error(translationError));
                    }
                },
                onerror: (err) => {
                    translationError = `网络错误: ${err.message}`;
                    dictionaryStatus = '❌ 网络错误';
                    updateStatusDisplay();
                    reject(err);
                }
            });
        });
    }

    function loadTranslationDict(lang) {
        const cache = GM_getValue(`${lang}_cache`, null);
        if (cache && (Date.now() - cache.timestamp) < CACHE_EXPIRY) {
            dictionaryTimestamp = new Date(cache.timestamp).toLocaleString();
            dictionaryStatus = '✅ 来自缓存';
            return Promise.resolve(cache.data);
        }
        return fetchTranslationDict(lang);
    }

    function translateText(text, dict) {
        try {
            const clean = text.trim();
            return dict[clean] || text;
        } catch (error) {
            translationError = `翻译文本时出错: ${error.message}`;
            updateStatusDisplay();
            return text;
        }
    }

    function translateNode(node, dict) {
        try {
            if (node.nodeType === Node.TEXT_NODE) {
                const original = node.textContent.trim();
                if (!original) return;

                const translated = dict[original];
                if (translated && node.parentNode?.getAttribute(TRANSLATED_ATTR) !== original) {
                    node.textContent = translated;
                    node.parentNode?.setAttribute(TRANSLATED_ATTR, original);
                }
            } else if (node.nodeType === Node.ELEMENT_NODE) {
                if (node.getAttribute(TRANSLATED_ATTR) === '__translated__') return;

                Array.from(node.childNodes).forEach(child => translateNode(child, dict));
                node.setAttribute(TRANSLATED_ATTR, '__translated__');
            }
        } catch (error) {
            translationError = `翻译节点时出错: ${error.message}`;
            updateStatusDisplay();
        }
    }

    function initializeTranslation(dict) {
        try {
            const observer = new MutationObserver(mutations => {
                mutations.forEach(mutation => {
                    if (mutation.type === 'childList') {
                        mutation.addedNodes.forEach(node => translateNode(node, dict));
                    } else if (mutation.type === 'characterData' || mutation.type === 'attributes') {
                        translateNode(mutation.target, dict);
                    }
                });
            });

            observer.observe(document.body, {
                childList: true,
                subtree: true,
                characterData: true,
                attributes: true
            });

            translateNode(document.body, dict);
        } catch (error) {
            translationError = `初始化翻译时出错: ${error.message}`;
            updateStatusDisplay();
        }
    }

    function updateStatusDisplay() {
        if (!statusIndicator) return;
        const panelStatusText = document.getElementById('panel-status-text');
        const panelError = document.getElementById('panel-error');
        const panelErrorText = document.getElementById('panel-error-text');
        const panelUpdateTimeText = document.getElementById('panel-update-time-text');

        if (translationError) {
            panelStatusText.textContent = '异常';
            statusIndicator.textContent = '异常';
            statusIndicator.style.backgroundColor = '#ef4444';
            panelError.classList.remove('hidden');
            panelErrorText.textContent = translationError;
        } else if (translationEnabled) {
            panelStatusText.textContent = '开启';
            statusIndicator.textContent = '正常';
            statusIndicator.style.backgroundColor = '#a5d6a7';
            panelError.classList.add('hidden');
        } else {
            panelStatusText.textContent = '关闭';
            statusIndicator.textContent = '正常';
            statusIndicator.style.backgroundColor = '#cfd8dc';
            panelError.classList.add('hidden');
        }

        const now = new Date();
        const diff = now - new Date(dictionaryTimestamp);
        if (diff < 60 * 1000) {
            panelUpdateTimeText.textContent = '1分钟内';
        } else if (diff < 3600 * 1000) {
            panelUpdateTimeText.textContent = `${Math.floor(diff / 60000)}分钟前`;
        } else if (diff < 86400 * 1000) {
            panelUpdateTimeText.textContent = `${Math.floor(diff / 3600000)}小时前`;
        } else {
            panelUpdateTimeText.textContent = `${Math.floor(diff / 86400000)}天前`;
        }
    }

    function createControlPanel() {
        const panel = document.createElement('div');
        panel.id = 'translation-control-panel';
        panel.classList.add('fixed', 'bottom-2', 'right-2', 'z-50', 'transition-opacity', 'duration-500');
        panel.innerHTML = `
            <div id="mini-status-panel" class="bg-white rounded-lg shadow-md p-2 text-sm cursor-pointer w-16 h-16 flex flex-col justify-center items-center space-y-1 transform transition-transform duration-300">
                <div id="panel-title" class="text-xs font-bold">翻译工具</div>
                <div id="status-indicator" class="rounded-md px-1 py-0.5 text-xs"></div>
            </div>
            <div id="panel-body" class="overflow-hidden max-h-0 opacity-0 transition-all duration-300 absolute bottom-full right-full">
                <div class="mt-3 w-64 p-4 bg-white rounded-2xl shadow-lg space-y-4">
                    <h3 class="text-xl font-bold border-b border-gray-300 pb-2">翻译工具</h3>
                    <div id="panel-info" class="space-y-2">
                        <div id="panel-status" class="flex items-center space-x-2">
                            <span class="font-medium">翻译状态：</span>
                            <span id="panel-status-text"></span>
                        </div>
                        <div id="panel-update-time" class="flex items-center space-x-2">
                            <span class="font-medium">更新时间：</span>
                            <span id="panel-update-time-text"></span>
                        </div>
                        <div id="panel-error" class="flex items-center space-x-2 text-red-500 hidden">
                            <span class="font-medium">翻译错误：</span>
                            <span id="panel-error-text"></span>
                        </div>
                    </div>
                    <button id="toggle-translation" class="w-full py-2 px-4 text-white bg-blue-500 rounded-lg hover:bg-blue-600 transition-colors duration-300">${translationEnabled ? ' 关闭翻译' : ' 开启翻译'}</button>
                    <button id="reload-dictionary" class="w-full py-2 px-4 text-white bg-blue-500 rounded-lg hover:bg-blue-600 transition-colors duration-300"> 重新加载词典</button>
                    <div>
                        <label for="language-selector" class="block font-bold"> 选择语言：</label>
                        <select id="language-selector" class="w-full p-2 border border-gray-300 rounded-md mt-1">
                            <option value="zh-CN" ${currentLang === 'zh-CN' ? 'selected' : ''}>简体中文</option>
                            <option value="zh-TW" ${currentLang === 'zh-TW' ? 'selected' : ''}>繁体中文</option>
                        </select>
                    </div>
                </div>
            </div>
        `;
        document.body.appendChild(panel);

        const body = panel.querySelector('#panel-body');
        const mini = panel.querySelector('#mini-status-panel');
        statusIndicator = document.getElementById('status-indicator');

        mini.addEventListener('click', () => {
            if (body.classList.contains('max-h-0')) {
                body.style.maxHeight = body.scrollHeight + 'px';
                body.classList.remove('max-h-0', 'opacity-0');
                body.classList.add('max-h-full', 'opacity-100');
                mini.classList.add('hidden');
            } else {
                body.style.maxHeight = '0';
                body.classList.remove('max-h-full', 'opacity-100');
                body.classList.add('max-h-0', 'opacity-0');
                mini.classList.remove('hidden');
            }
            panel.classList.add('opacity-100');
            resetAutoHideTimer();
        });

        panel.querySelector('#toggle-translation').addEventListener('click', () => {
            translationEnabled = !translationEnabled;
            GM_setValue('translationEnabled', translationEnabled);
            location.reload();
        });

        panel.querySelector('#reload-dictionary').addEventListener('click', () => {
            GM_setValue(`${currentLang}_cache`, null);
            location.reload();
        });

        panel.querySelector('#language-selector').addEventListener('change', (e) => {
            currentLang = e.target.value;
            GM_setValue('language', currentLang);
            location.reload();
        });

        let hideTimer = null;
        let transparencyTimer = null;
        function resetAutoHideTimer() {
            clearTimeout(hideTimer);
            clearTimeout(transparencyTimer);
            panel.classList.add('opacity-100');
            hideTimer = setTimeout(() => {
                if (!body.classList.contains('max-h-0')) {
                    body.style.maxHeight = '0';
                    body.classList.remove('max-h-full', 'opacity-100');
                    body.classList.add('max-h-0', 'opacity-0');
                    mini.classList.remove('hidden');
                }
            }, 6000);
            transparencyTimer = setTimeout(() => {
                if (!body.classList.contains('opacity-100')) {
                    panel.classList.remove('opacity-100');
                    panel.classList.add('opacity-20');
                }
            }, 5000);
        }

        panel.addEventListener('mouseenter', () => {
            clearTimeout(hideTimer);
            clearTimeout(transparencyTimer);
            panel.classList.add('opacity-100');
        });
        panel.addEventListener('mouseleave', () => resetAutoHideTimer());

        document.addEventListener('click', (e) => {
            if (!panel.contains(e.target)) {
                if (!body.classList.contains('max-h-0')) {
                    body.style.maxHeight = '0';
                    body.classList.remove('max-h-full', 'opacity-100');
                    body.classList.add('max-h-0', 'opacity-0');
                    mini.classList.remove('hidden');
                }
            }
        });

        updateStatusDisplay();
        resetAutoHideTimer();
    }

    if (translationEnabled) {
        loadTranslationDict(currentLang).then(dict => {
            initializeTranslation(dict);
        }).catch(err => console.error('翻译加载失败:', err));
    }

    createControlPanel();
})();
