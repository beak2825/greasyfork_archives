// ==UserScript==
// @name         Novelai Prompt Helper / Novelai 提示词增强
// @namespace    https://novelai.net
// @version      1.1.5
// @description  Tag suggestions and weight shortcuts for NovelAI prompts. 通过Ctrl+↑/↓快速调整输入光标所在的Tag权重，Ctrl+←/→移动Tag位置。自动格式化Prompt。
// @author       Takoro
// @match        https://novelai.net/image
// @icon         https://www.google.com/s2/favicons?sz=64&domain=novelai.net
// @license      MIT
// @grant        GM_xmlhttpRequest
// @grant        GM_addStyle
// @grant        GM_openInTab
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        GM_registerMenuCommand
// @grant        GM_unregisterMenuCommand
// @connect      danbooru.donmai.us
// @connect      raw.githubusercontent.com
// @downloadURL https://update.greasyfork.org/scripts/552450/Novelai%20Prompt%20Helper%20%20Novelai%20%E6%8F%90%E7%A4%BA%E8%AF%8D%E5%A2%9E%E5%BC%BA.user.js
// @updateURL https://update.greasyfork.org/scripts/552450/Novelai%20Prompt%20Helper%20%20Novelai%20%E6%8F%90%E7%A4%BA%E8%AF%8D%E5%A2%9E%E5%BC%BA.meta.js
// ==/UserScript==
(function () {
    'use strict';
    if (typeof window.__NAIWeightAdjusting !== 'boolean') {
        window.__NAIWeightAdjusting = false;
    }
    if (typeof window.__NAIWeightAdjustingUntil !== 'number') {
        window.__NAIWeightAdjustingUntil = 0;
    }
    const LOCALE_KEY = 'nai_prompt_helper_locale_v1';
    const AUTOFORMAT_KEY = 'nai_prompt_helper_autoformat_enabled_v1';
    const LOCALE_MESSAGES = {
        zh: {
            infoTitle: 'Did you mean...?',
            hints: [
                '按住 Ctrl + 左键点击标签可以打开对应的 Wiki 页面。',
                '紫色标签代表系列/IP，绿色标签代表角色。',
                '标签后面的数字表示相关作品数量。',
                '可以尝试使用 Tab、Enter 或方向键选择候选项。',
                'Takoro'
            ],
            fallbackHint: 'Danbooru API 连接失败，已切换到本地缓存。',
            apiTimeoutLog: '[NAI Prompt Helper] 网络请求超时，改用本地缓存。',
            logReady: '[NAI Prompt Helper] 标签联想模块就绪。',
            menuSwitchLabel: '切换到英文界面',
            menuEnableFormat: '启用自动格式化',
            menuDisableFormat: '禁用自动格式化',
        },
        en: {
            infoTitle: 'Did you mean...?',
            hints: [
                'Ctrl + Click a tag to open its Danbooru wiki page.',
                'Purple tags are series/IP names; green tags are characters.',
                'Numbers after a tag show total post counts.',
                'Use Tab, Enter, or arrow keys to pick a suggestion.',
                'Takoro'
            ],
            fallbackHint: 'Danbooru API error, switching to cached suggestions.',
            apiTimeoutLog: '[NAI Prompt Helper] API timeout, using cached suggestions.',
            logReady: '[NAI Prompt Helper] Tag suggestions ready.',
            menuSwitchLabel: 'Switch to Chinese UI',
            menuEnableFormat: 'Enable Auto-Formatting',
            menuDisableFormat: 'Disable Auto-Formatting',
        }
    };
    const SUPPORTED_LOCALES = Object.keys(LOCALE_MESSAGES);
    function detectInitialLocale() {
        try {
            if (typeof GM_getValue === 'function') {
                const stored = GM_getValue(LOCALE_KEY);
                if (stored && SUPPORTED_LOCALES.includes(stored)) {
                    return stored;
                }
            }
        } catch (error) { }
        const nav = (navigator.language || navigator.userLanguage || '').toLowerCase();
        if (nav.startsWith('zh')) { return 'zh'; }
        return 'en';
    }
    let currentLocale = detectInitialLocale();
    let autoFormatEnabled = true;
    try {
        if (typeof GM_getValue === 'function') {
            const storedValue = GM_getValue(AUTOFORMAT_KEY);
            if (typeof storedValue === 'boolean') {
                autoFormatEnabled = storedValue;
            } else {
                GM_setValue(AUTOFORMAT_KEY, true);
            }
        }
    } catch (e) { }
    let registeredMenuIds = [];
    const isChineseLocale = currentLocale === 'zh';
    function t(key) {
        const bundle = LOCALE_MESSAGES[currentLocale] || LOCALE_MESSAGES.en;
        return bundle[key] ?? LOCALE_MESSAGES.en[key] ?? key;
    }
    function getHints() {
        const bundle = LOCALE_MESSAGES[currentLocale] || LOCALE_MESSAGES.en;
        return bundle.hints || [];
    }
    function clearLocaleMenus() {
        if (typeof GM_unregisterMenuCommand !== 'function') return;
        registeredMenuIds.forEach(id => {
            try { GM_unregisterMenuCommand(id); } catch (error) { }
        });
        registeredMenuIds = [];
    }
    function registerMenus() {
        if (typeof GM_registerMenuCommand !== 'function') return;
        clearLocaleMenus();
        const otherLocale = currentLocale === 'zh' ? 'en' : 'zh';
        const localeLabel = LOCALE_MESSAGES[currentLocale].menuSwitchLabel;
        try {
            const localeCmdId = GM_registerMenuCommand(localeLabel, () => {
                try {
                    if (typeof GM_setValue === 'function') {
                        GM_setValue(LOCALE_KEY, otherLocale);
                    }
                } catch (error) { }
                window.location.reload();
            });
            if (typeof localeCmdId !== 'undefined') {
                registeredMenuIds.push(localeCmdId);
            }
        } catch (error) { }
        const formatLabel = autoFormatEnabled ? t('menuDisableFormat') : t('menuEnableFormat');
        try {
            const formatCmdId = GM_registerMenuCommand(formatLabel, () => {
                try {
                    if (typeof GM_setValue === 'function') {
                        GM_setValue(AUTOFORMAT_KEY, !autoFormatEnabled);
                    }
                } catch (error) { }
                window.location.reload();
            });
            if (typeof formatCmdId !== 'undefined') {
                registeredMenuIds.push(formatCmdId);
            }
        } catch (error) { }
    }
    function formatPromptText(text) {
        const structure = WeightShortcuts.parsePromptStructure(text);
        WeightShortcuts.normalizeTree(structure);
        return WeightShortcuts.serializeTree(structure);
    }
    registerMenus();
    const TagAssist = (() => {
        const MAX_SUGGESTIONS = 10;
        const DEBOUNCE_DELAY = 400;
        const API_BASE_URL = 'https://danbooru.donmai.us';
        const TRANSLATION_URL = 'https://raw.githubusercontent.com/Yellow-Rush/zh_CN-Tags/main/danbooru.csv';
        const CACHE_KEY = 'danbooru_translations_cache';
        const CACHE_DURATION_MS = 7 * 24 * 60 * 60 * 1000;
        const TITLE_COLOR = '#e3dccc';
        const SHORT_QUERY_PREFIX_LENGTH = 2;
        const ALLOWED_CHARS_REGEX = /^[a-zA-Z\d_\-\s'\^=@()\u4e00-\u9fa5\u3040-\u309F\u30A0-\u30FF]+$/;
        const BREAK_CHARS = ',{}[]:.';
        let popup = null;
        let selectedIndex = -1;
        let currentMatches = [];
        let isPopupActive = false;
        let isKeyboardNavigation = false;
        let apiAbortController = null;
        let lastKnownRange = null;
        let translations = new Map();
        GM_addStyle(`
                .autocomplete-container { position: absolute; background: #0e0f21; border: 1px solid #3B3B52; border-radius: 8px; box-shadow: 0 10px 25px rgba(0, 0, 0, 0.3); max-height: 450px; display: flex; flex-direction: column; z-index: 100000; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif; color: #EAEAEB; min-width: 350px; max-width: 500px; }
                .suggestion-info-display { display: flex; align-items: center; justify-content: space-between; padding: 8px 12px; background: #1a1c30; border-bottom: 1px solid #3B3B52; font-size: 13.5px; line-height: 1.6; min-height: 17px; font-weight: bold; }
                .info-hint { color: #8a8a9e; font-weight: normal; font-size: 12px; margin-left: 10px; white-space: nowrap; }
                .info-hint-error { color: #ff7b7b; font-weight: bold; font-size: 12px; margin-left: 10px; white-space: nowrap; }
                .info-title { color: ${TITLE_COLOR}; }
                .suggestion-scroll-wrapper { padding: 7px; overflow-y: auto; }
                .suggestion-flex { display: flex; flex-wrap: wrap; gap: 6px; }
                .suggestion-item { display: flex; align-items: center; justify-content: space-between; padding: 4px 10px; background: #22253f; border: 1px solid transparent; border-radius: 4px; cursor: pointer; transition: all 0.2s ease; font-size: 14px; height: 26px; white-space: nowrap; flex-shrink: 0; }
                .suggestion-item:hover, .suggestion-item.selected { background: #34395f; border-color: #F5F3C2; }
                .suggestion-text { overflow: hidden; text-overflow: ellipsis; color: #EAEAEB; }
                .suggestion-count { color: #8a8a9e; margin-left: 12px; font-size: 12px; }
                .suggestion-item[data-category='4'] .suggestion-text { color: #a6f3a6; }
                .suggestion-item[data-category='3'] .suggestion-text { color: #d6bcf5; }
            `);
        const normalizeQuery = (query) => query.trim().replace(/\s+/g, '_');
        function shouldSkipWeightSuggestions(textBeforeCursor, delimiterIndex) {
            if (delimiterIndex < 0 || textBeforeCursor[delimiterIndex] !== ':') return false;
            if (textBeforeCursor.substring(delimiterIndex - 1, delimiterIndex + 1) === '::') { return false; }
            let i = delimiterIndex - 1;
            if (i >= 0 && textBeforeCursor[i] === ':') {
                i--;
                while (i >= 0 && /\s/.test(textBeforeCursor[i])) i--;
                if (i >= 0 && /[\d.]/.test(textBeforeCursor[i])) {
                    let end = i;
                    while (i >= 0 && /[\d.]/.test(textBeforeCursor[i])) i--;
                    const numericPart = textBeforeCursor.substring(i + 1, end + 1);
                    if (numericPart && /^\d+(?:\.\d+)?$/.test(numericPart)) {
                        const precedingChar = i >= 0 ? textBeforeCursor[i] : '';
                        if (i < 0 || BREAK_CHARS.includes(precedingChar) || /\s/.test(precedingChar)) { return true; }
                    }
                }
                return false;
            }
            while (i >= 0 && /\s/.test(textBeforeCursor[i])) i--;
            if (i < 0) return false;
            let end = i;
            while (i >= 0 && /[\d.]/.test(textBeforeCursor[i])) i--;
            const numericPart = textBeforeCursor.substring(i + 1, end + 1);
            if (!numericPart || !/^\d+(?:\.\d+)?$/.test(numericPart)) return false;
            const precedingChar = i >= 0 ? textBeforeCursor[i] : '';
            if (i >= 0 && !BREAK_CHARS.includes(precedingChar) && !/\s/.test(precedingChar)) return false;
            return true;
        }
        function getClonedSelectionRange() {
            const selection = window.getSelection();
            if (!selection || !selection.rangeCount) return null;
            return selection.getRangeAt(0).cloneRange();
        }
        function loadTranslations() {
            if (!isChineseLocale) { translations = new Map(); return; }
            const cachedData = GM_getValue(CACHE_KEY);
            if (cachedData && cachedData.timestamp && (Date.now() - cachedData.timestamp < CACHE_DURATION_MS)) {
                translations = new Map(cachedData.translations); return;
            }
            GM_xmlhttpRequest({
                method: "GET", url: TRANSLATION_URL,
                onload: function (response) {
                    if (response.status === 200) {
                        const lines = response.responseText.split('\n').filter(line => line.trim());
                        lines.forEach(line => {
                            const columns = line.split(/,(?=(?:(?:[^"]*"){2})*[^"]*$)/);
                            if (columns.length >= 2) {
                                const en = (columns[0] || '').trim().replace(/^"|"$/g, '');
                                const zh = (columns[1] || '').trim().replace(/^"|"$/g, '');
                                if (en && zh) { translations.set(en, zh); }
                            }
                        });
                        GM_setValue(CACHE_KEY, { translations: Array.from(translations.entries()), timestamp: Date.now() });
                    }
                },
            });
        }
        function openWikiPage(tagName) { if (!tagName) return; GM_openInTab(`${API_BASE_URL}/wiki_pages/show_or_new?title=${tagName}`, { active: true }); }
        function getRandomHint() {
            const hints = getHints();
            if (!hints.length || Math.random() < 0.5) { return ""; }
            return hints[Math.floor(Math.random() * hints.length)];
        }
        function searchLocalSuggestions(query, input) {
            if (!isChineseLocale || !translations.size) return;
            const queryLower = query.toLowerCase();
            const rankedItems = [];
            for (const [en, zh] of translations.entries()) {
                const zhLower = zh.toLowerCase();
                let score = 0;
                if (zhLower.startsWith(queryLower)) score = 1;
                else if (zhLower.includes(queryLower)) score = 2;
                if (score > 0) { rankedItems.push({ score: score, data: { en: en, count: undefined, category: 0 } }); }
            }
            const finalMatches = rankedItems.sort((a, b) => a.score - b.score).map(item => item.data).slice(0, MAX_SUGGESTIONS);
            updatePopup(input, finalMatches);
        }
        function searchLocalFallback(query, input) {
            if (!isChineseLocale || !translations.size) { hidePopup(); return; }
            const queryLower = query.toLowerCase(), normalizedQuery = normalizeQuery(queryLower), spacedQuery = queryLower.replace(/\s+/g, ' ');
            if (!normalizedQuery) { hidePopup(); return; }
            const rankedItems = [];
            for (const en of translations.keys()) {
                const enLower = en.toLowerCase();
                let score = 0;
                const enNormalized = normalizeQuery(enLower), enSpaced = enLower.replace(/_/g, ' ');
                if (enNormalized.startsWith(normalizedQuery) || enSpaced.startsWith(spacedQuery)) score = 1;
                else if (enNormalized.includes(normalizedQuery) || enSpaced.includes(spacedQuery)) score = 2;
                if (score > 0) { rankedItems.push({ score: score, data: { en: en, count: undefined, category: 0 } }); }
            }
            const finalMatches = rankedItems.sort((a, b) => a.score - b.score).map(item => item.data).slice(0, MAX_SUGGESTIONS);
            if (finalMatches.length > 0) { updatePopup(input, finalMatches, t('fallbackHint')); } else { hidePopup(); }
        }
        function fetchSuggestions(query, input) {
            const normalizedQuery = normalizeQuery(query);
            if (!normalizedQuery) { hidePopup(); return; }
            if (apiAbortController) apiAbortController.abort();
            apiAbortController = new AbortController();
            const searchPattern = normalizedQuery.length <= SHORT_QUERY_PREFIX_LENGTH ? `${normalizedQuery}*` : `*${normalizedQuery}*`;
            const params = new URLSearchParams({ 'search[name_matches]': searchPattern, 'search[order]': 'count', 'limit': MAX_SUGGESTIONS, 'search[hide_empty]': 'true' });
            GM_xmlhttpRequest({
                method: "GET",
                url: `${API_BASE_URL}/tags.json?${params.toString()}`,
                signal: apiAbortController.signal,
                timeout: 1500,
                headers: {
                    "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/100.0.0.0 Safari/537.36",
                    "Referer": "https://danbooru.donmai.us/"
                },

                ontimeout: function () {
                    console.error(`[NAI Prompt Helper] API 请求超时 (ontimeout)。(Timeout: 1500ms). URL: ${API_BASE_URL}/tags.json?${params.toString()}`);
                    searchLocalFallback(query, input);
                },

                onload: function (response) {
                    if (response.status === 200) {
                        const matches = JSON.parse(response.responseText).map(tag => ({ en: tag.name, count: tag.post_count, category: tag.category }));
                        updatePopup(input, matches);
                    } else {
                        console.error(`[NAI Prompt Helper] API 错误: 收到 HTTP 状态 ${response.status} ${response.statusText}`);
                        console.warn(`[NAI Prompt Helper] 失败的URL: ${response.finalUrl}`);
                        searchLocalFallback(query, input);
                    }
             },

                onerror: (error) => {
                    console.error('[NAI Prompt Helper] API 请求失败 (onerror)。 详细信息:', error);
                    if (error.readyState !== 0) { // 忽略 abort 信号
                        searchLocalFallback(query, input);
                 }
                }
            });
        }
        function updatePopup(input, matches, overrideHint = null) {
            createPopup();
            let hintHTML = overrideHint ? `<span class="info-hint-error">${overrideHint}</span>` : (getRandomHint() ? `<span class="info-hint">${getRandomHint()}</span>` : '');
            popup.innerHTML = `<div class="suggestion-info-display"><span class="info-title">${t('infoTitle')}</span>${hintHTML}</div><div class="suggestion-scroll-wrapper"><div class="suggestion-flex"></div></div>`;
            const flexContainer = popup.querySelector('.suggestion-flex');
            currentMatches = matches;
            if (matches.length === 0) { hidePopup(); return; }
            matches.forEach((tag, index) => {
                const item = document.createElement('div');
                item.className = 'suggestion-item';
                item.dataset.category = tag.category || '0';
                const enText = tag.en.replace(/_/g, ' '), zhText = translations.get(tag.en), displayText = zhText ? `${enText} (${zhText})` : enText;
                let countHTML = '';
                if (tag.count !== undefined && tag.count !== null) {
                    const countText = tag.count > 1000 ? `${(tag.count / 1000).toFixed(1)}k` : tag.count;
                    countHTML = `<span class="suggestion-count">${countText}</span>`;
                }
                item.innerHTML = `<span class="suggestion-text">${displayText}</span>${countHTML}`;
                item.addEventListener('mouseover', () => {
                    isKeyboardNavigation = false;
                    if (selectedIndex !== index) { selectedIndex = index; updateSelectionUI(); }
                });
                item.addEventListener('mousedown', (e) => {
                    e.preventDefault();
                    selectedIndex = index;
                    updateSelectionUI();
                    if (e.ctrlKey) { openWikiPage(tag.en); }
                    else {
                        const currentInput = getActiveInputElement();
                        if (currentInput) {
                            const rangeToRestore = lastKnownRange ? lastKnownRange.cloneRange() : getClonedSelectionRange();
                            currentInput.focus();
                            requestAnimationFrame(() => insertTag(currentInput, tag.en, rangeToRestore));
                        }
                    }
                });
                flexContainer.appendChild(item);
            });
            positionPopup(input);
            popup.style.display = 'flex';
            isPopupActive = true;
            if (matches.length > 0) { selectedIndex = 0; updateSelectionUI(); }
        }

        function findNodeAndOffsetFromGlobal(root, globalOffset) {
            const treeWalker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT, null, false);
            let accumulatedLength = 0;
            let lastTextNode = null;
            let currentNode;
            while (currentNode = treeWalker.nextNode()) {
                lastTextNode = currentNode;
                const nodeLength = currentNode.textContent.length;
                if (accumulatedLength + nodeLength >= globalOffset) {
                    return { node: currentNode, offset: globalOffset - accumulatedLength };
                }
                accumulatedLength += nodeLength;
            }
            if (lastTextNode) {
                return { node: lastTextNode, offset: lastTextNode.textContent.length };
            }
            return { node: root, offset: 0 };
        }

        function insertTag(input, tag, rangeToRestore) {
            const cleanTag = tag.replace(/_/g, ' ');
            const workingRange = rangeToRestore ? rangeToRestore.cloneRange() : getClonedSelectionRange();
            if (!workingRange) return;

            const tempRange = document.createRange();
            tempRange.setStart(input, 0);
            tempRange.setEnd(workingRange.startContainer, workingRange.startOffset);
            const globalCursorPos = tempRange.toString().length;
            const fullText = input.textContent;

            if (autoFormatEnabled) {

                let start = globalCursorPos;
                while (start > 0 && !BREAK_CHARS.includes(fullText[start - 1])) { start--; }
                let end = globalCursorPos;
                while (end < fullText.length && !BREAK_CHARS.includes(fullText[end])) { end++; }

                const textBefore = fullText.substring(0, start);
                const textAfter = fullText.substring(end);
                const newFullText = textBefore + cleanTag + textAfter;

                let formattedText = formatPromptText(newFullText);
                formattedText = formattedText.trim();

                if (formattedText.length > 0 && !formattedText.endsWith(',')) {
                    formattedText += ', ';
                } else if (formattedText.endsWith(',')) {
                    formattedText += ' ';
                }

                let newCursorPos = -1;
                const searchStart = Math.max(0, start - 15);
                const foundIndex = formattedText.indexOf(cleanTag, searchStart);

                if (foundIndex !== -1) {
                    newCursorPos = foundIndex + cleanTag.length + 2;
                } else {
                    newCursorPos = start + cleanTag.length + 2;
                }

                if (newCursorPos >= 2 && formattedText.substring(newCursorPos - 2, newCursorPos) === '::') {
                    newCursorPos -= 2;
                }

                newCursorPos = Math.min(newCursorPos, formattedText.length);
                WeightShortcuts.updateInputContent(input, formattedText, newCursorPos, newCursorPos);

            } else {
                try {
                    if (!input.contains(workingRange.startContainer)) return;

                    let start = globalCursorPos;
                    while (start > 0 && !BREAK_CHARS.includes(fullText[start - 1])) { start--; }
                    let end = globalCursorPos;
                    while (end < fullText.length && !BREAK_CHARS.includes(fullText[end])) { end++; }

                    const { node: startNode, offset: startOffset } = findNodeAndOffsetFromGlobal(input, start);
                    const { node: endNode, offset: endOffset } = findNodeAndOffsetFromGlobal(input, end);

                    const replacementRange = document.createRange();
                    replacementRange.setStart(startNode, startOffset);
                    replacementRange.setEnd(endNode, endOffset);

                    replacementRange.deleteContents();

                    let textToInsert = cleanTag;
                    const textBefore = fullText.substring(0, start).trimEnd();
                    let prefix = '';
                    if (textBefore.length > 0) {
                        if (textBefore.endsWith(',')) {
                            prefix = ' ';
                        } else {
                            prefix = ', ';
                        }
                    }
                    textToInsert = prefix + textToInsert + ', ';

                    const newTextNode = document.createTextNode(textToInsert);
                    replacementRange.insertNode(newTextNode);

                    replacementRange.setStartAfter(newTextNode);
                    replacementRange.collapse(true);

                    const selection = window.getSelection();
                    selection.removeAllRanges();
                    selection.addRange(replacementRange);

                    const inputEvent = new Event('input', { bubbles: true, composed: true });
                    input.dispatchEvent(inputEvent);
                } catch (error) {
                     console.error("[NAI Prompt Helper] An error occurred during surgical insertTag:", error);
                }
            }

            window.__NAIWeightAdjustingUntil = Date.now() + 500;
            hidePopup();
        }
        function createPopup() { if (!popup) { popup = document.createElement('div'); popup.className = 'autocomplete-container'; document.body.appendChild(popup); } }
        function hidePopup() { if (popup) popup.style.display = 'none'; if (apiAbortController) apiAbortController.abort(); selectedIndex = -1; isPopupActive = false; currentMatches = []; isKeyboardNavigation = false; }
        const debounce = (func, delay) => { let timeout; return (...args) => { clearTimeout(timeout); timeout = setTimeout(() => func(...args), delay); }; };
        function getActiveInputElement() { const selection = window.getSelection(); if (!selection.rangeCount) return null; const node = selection.focusNode; const pElement = node.nodeType === 3 ? node.parentElement.closest('p') : node.closest('p'); if (pElement && (pElement.closest('[class*="prompt-input"]') || pElement.closest('[class*="character-prompt-input"]'))) { return pElement; } return null; }
        function positionPopup(input) { let rect; const selection = window.getSelection(); if (selection.rangeCount > 0) { const range = selection.getRangeAt(0).cloneRange(); if (range.collapsed) { const tempSpan = document.createElement('span'); tempSpan.appendChild(document.createTextNode('\u200b')); range.insertNode(tempSpan); rect = tempSpan.getBoundingClientRect(); tempSpan.remove(); } else { rect = range.getBoundingClientRect(); } } if (!rect || (rect.width === 0 && rect.height === 0)) { rect = input.getBoundingClientRect(); } popup.style.top = `${rect.bottom + window.scrollY + 5}px`; popup.style.left = `${rect.left + window.scrollX}px`; }
        function updateSelectionUI() { const items = popup.querySelectorAll('.suggestion-item'); items.forEach((item, index) => item.classList.toggle('selected', index === selectedIndex)); const selectedEl = popup.querySelector('.selected'); if (selectedEl) selectedEl.scrollIntoView({ block: 'nearest' }); }
        function saveSelection() {
            const selection = window.getSelection();
            const activeInput = getActiveInputElement();
            if (activeInput && selection.rangeCount > 0) {
                const range = selection.getRangeAt(0);
                if (activeInput.contains(range.commonAncestorContainer)) { lastKnownRange = range.cloneRange(); }
            }
        }
        const handleInput = debounce(() => {
            const now = Date.now();
            if (window.__NAIWeightAdjusting || now < window.__NAIWeightAdjustingUntil) { hidePopup(); return; }
            const input = getActiveInputElement(); if (!input) { hidePopup(); return; }
            const textBeforeCursor = (() => { const sel = window.getSelection(); if (!sel.rangeCount) return ''; const range = sel.getRangeAt(0).cloneRange(); const parent = sel.focusNode.parentElement; if (!parent) return ''; range.selectNodeContents(parent); range.setEnd(sel.focusNode, sel.focusOffset); return range.toString(); })();
            if (textBeforeCursor.endsWith(',')) { hidePopup(); return; }
            const lastDelimiterIndex = Math.max(textBeforeCursor.lastIndexOf(','), textBeforeCursor.lastIndexOf(':'), textBeforeCursor.lastIndexOf('['), textBeforeCursor.lastIndexOf('{'));
            const currentQuery = textBeforeCursor.substring(lastDelimiterIndex + 1).trim();
            if (shouldSkipWeightSuggestions(textBeforeCursor, lastDelimiterIndex)) { hidePopup(); return; }
            if (currentQuery.length < 1) { hidePopup(); return; }
            if (!ALLOWED_CHARS_REGEX.test(currentQuery)) { hidePopup(); return; }
            if (/^\d*\.?\d*$/.test(currentQuery)) { hidePopup(); return; }
            if (/[\u4e00-\u9fa5]/.test(currentQuery)) { searchLocalSuggestions(currentQuery, input); } else { fetchSuggestions(currentQuery, input); }
        }, DEBOUNCE_DELAY);
        function handleKeydown(e) {
            if (e.ctrlKey) { return; }
            if (e.key === ',') { hidePopup(); return; }
            if (!isPopupActive) return;
            const keyMap = { 'ArrowDown': 1, 'ArrowRight': 1, 'ArrowUp': -1, 'ArrowLeft': -1 };
            if (keyMap[e.key] !== undefined) {
                e.preventDefault();
                isKeyboardNavigation = true;
                selectedIndex = (selectedIndex + keyMap[e.key] + currentMatches.length) % currentMatches.length;
                updateSelectionUI();
            } else if (e.key === 'Enter' || e.key === 'Tab') {
                e.preventDefault(); e.stopPropagation();
                if (selectedIndex >= 0 && currentMatches[selectedIndex]) {
                    const input = getActiveInputElement();
                    if (input) {
                        const rangeForInsert = getClonedSelectionRange();
                        insertTag(input, currentMatches[selectedIndex].en, rangeForInsert);
                    }
                } else { hidePopup(); }
            } else if (e.key === 'Escape') { e.preventDefault(); hidePopup(); }
            else { isKeyboardNavigation = false; }
        }
        function handleClickOutside(e) { const input = getActiveInputElement(); if (isPopupActive && popup && !popup.contains(e.target) && !input?.contains(e.target)) { hidePopup(); } }
        function init() {
            loadTranslations();
            document.addEventListener('input', handleInput);
            document.addEventListener('keydown', handleKeydown, true);
            document.addEventListener('mousedown', handleClickOutside);
            document.addEventListener('keyup', saveSelection);
            document.addEventListener('mouseup', saveSelection);
            document.addEventListener('selectionchange', saveSelection);
        }
        return { init };
    })();
    const WeightShortcuts = (() => {
        function getActiveInputElement() {
            const selection = window.getSelection();
            if (!selection.rangeCount) return null;
            const node = selection.focusNode;
            const pElement = node.nodeType === 3 ? node.parentElement.closest('p') : node.closest('p');
            if (pElement && (pElement.closest('.prompt-input-box-prompt') || pElement.closest('.prompt-input-box-base-prompt') || pElement.closest('.prompt-input-box-negative-prompt') || pElement.closest('.prompt-input-box-undesired-content') || pElement.closest('[class*="character-prompt-input"]'))) {
                return pElement;
            }
            return null;
        }
        function getSelectedTagInfo(inputElement) {
            if (!inputElement) return null;
            const selection = window.getSelection();
            if (!selection.rangeCount) return null;
            const range = selection.getRangeAt(0);
            const node = range.startContainer;
            const offset = range.startOffset;
            const fullText = inputElement.textContent || '';
            let globalOffset = 0;
            if (node.nodeType === 3) {
                const treeWalker = document.createTreeWalker(inputElement, NodeFilter.SHOW_TEXT);
                let currentNode;
                while ((currentNode = treeWalker.nextNode())) {
                    if (currentNode === node) break;
                    globalOffset += currentNode.length;
                }
                globalOffset += offset;
            } else { globalOffset = offset; }
            let start = globalOffset;
            while (start > 0 && fullText[start - 1] !== ',' && fullText[start - 1] !== '\n') { start--; }
            let end = globalOffset;
            while (end < fullText.length && fullText[end] !== ',' && fullText[end] !== '\n') { end++; }
            if (fullText[start] === ',' || fullText[start] === '\n') start++;
            if (fullText[end - 1] === ',') end--;
            const tagText = fullText.slice(start, end).trim();
            return tagText ? { tagText, start, end, fullText, cursorOffset: globalOffset } : null;
        }
        function updateInputContent(inputElement, newContent, selectionStart, selectionEnd) {
            window.__NAIWeightAdjusting = true;
            window.__NAIWeightAdjustingUntil = Date.now() + 500;
            try {
                if (inputElement.childNodes.length === 1 && inputElement.firstChild.nodeType === 3) {
                    inputElement.firstChild.textContent = newContent;
                } else {
                    const newTextNode = document.createTextNode(newContent);
                    inputElement.innerHTML = '';
                    inputElement.appendChild(newTextNode);
                }
                const newRange = document.createRange();
                const textLength = inputElement.firstChild.textContent.length;
                const safeIndex = Math.max(0, Math.min(textLength, selectionEnd));
                newRange.setStart(inputElement.firstChild, safeIndex);
                newRange.setEnd(inputElement.firstChild, safeIndex);
                const selection = window.getSelection();
                selection.removeAllRanges();
                selection.addRange(newRange);
                const inputEvent = new Event('input', { bubbles: true });
                inputElement.dispatchEvent(inputEvent);
            } finally { window.__NAIWeightAdjusting = false; }
        }
        function parsePromptStructure(text) {
            return parseSequence(text, 0, false).items;
        }
        function parseSequence(text, startIndex, stopAtClose) {
            const items = [];
            let i = startIndex;
            const readSeparator = (input, index, shouldStopAtClose) => {
                let cursor = index; let separator = '';
                while (cursor < input.length) {
                    if (shouldStopAtClose && input.startsWith('::', cursor)) { break; }
                    const ch = input[cursor];
                    if (ch === ',') { separator += ch; cursor++; while (cursor < input.length && input[cursor] === ' ') { separator += input[cursor]; cursor++; } }
                    else if (ch === '\n' || ch === '\r') { separator += ch; cursor++; }
                    else if (ch === ' ' || ch === '\t') { separator += ch; cursor++; }
                    else { break; }
                }
                return { separator, nextIndex: cursor };
            };
            while (i < text.length) {
                if (stopAtClose && text.startsWith('::', i)) { return { items, index: i + 2, closeStart: i, closeEnd: i + 2 }; }
                while (i < text.length && (text[i] === ' ' || text[i] === '\t')) { i++; }
                if (stopAtClose && text.startsWith('::', i)) { return { items, index: i + 2, closeStart: i, closeEnd: i + 2 }; }
                if (i >= text.length) { break; }
                const doubleColonMatch = text.slice(i).match(/^(-?\d+(?:\.\d+)?)(::)(?!:)/);
                if (doubleColonMatch) {
                    const groupStart = i;
                    const weightString = doubleColonMatch[1];
                    const parsedWeight = parseFloat(weightString);
                    i += doubleColonMatch[0].length;
                    const childResult = parseSequence(text, i, true);
                    const groupNode = { type: 'group', weight: isNaN(parsedWeight) ? 1.0 : parsedWeight, format: 'doubleColon', start: groupStart, weightStart: groupStart, weightEnd: groupStart + weightString.length, prefixEnd: i, closeStart: childResult.closeStart ?? childResult.index, closeEnd: childResult.closeEnd ?? childResult.index, children: childResult.items };
                    i = childResult.index;
                    const separatorInfo = readSeparator(text, i, stopAtClose);
                    i = separatorInfo.nextIndex;
                    items.push({ node: groupNode, separator: separatorInfo.separator });
                    continue;
                }
                const groupMatch = text.slice(i).match(/^(-?\d+(?:\.\d+)?)(\s*):(?!:)/);
                if (groupMatch) {
                    const groupStart = i;
                    const weightString = groupMatch[1];
                    const parsedWeight = parseFloat(weightString);
                    i += groupMatch[0].length;
                    const childResult = parseSequence(text, i, true);
                    const groupNode = { type: 'group', weight: isNaN(parsedWeight) ? 1.0 : parsedWeight, format: 'singleColon', start: groupStart, weightStart: groupStart, weightEnd: groupStart + weightString.length, prefixEnd: i, closeStart: childResult.closeStart ?? childResult.index, closeEnd: childResult.closeEnd ?? childResult.index, children: childResult.items };
                    i = childResult.index;
                    const separatorInfo = readSeparator(text, i, stopAtClose);
                    i = separatorInfo.nextIndex;
                    items.push({ node: groupNode, separator: separatorInfo.separator });
                    continue;
                }
                const tagRawStart = i;
                while (i < text.length && text[i] !== ',' && text[i] !== '\n' && text[i] !== '\r') {
                    if (stopAtClose && text.startsWith('::', i)) { break; }
                    if (i === tagRawStart) {
                        const aheadMatch = text.slice(i).match(/^(-?\d+(?:\.\d+)?)(\s*):(?!:)/);
                        if (aheadMatch) { break; }
                    }
                    i++;
                }
                const rawSegment = text.slice(tagRawStart, i);
                if (rawSegment.trim()) {
                    let leadingSpaces = 0;
                    while (leadingSpaces < rawSegment.length && /\s/.test(rawSegment[leadingSpaces])) { leadingSpaces++; }
                    let trailingSpaces = 0;
                    while (trailingSpaces < rawSegment.length - leadingSpaces && /\s/.test(rawSegment[rawSegment.length - 1 - trailingSpaces])) { trailingSpaces++; }
                    const contentStart = tagRawStart + leadingSpaces;
                    const contentEnd = i - trailingSpaces;
                    const tagText = text.slice(contentStart, contentEnd);
                    const tagNode = { type: 'tag', text: tagText, start: contentStart, end: contentEnd };
                    const separatorInfo = readSeparator(text, i, stopAtClose);
                    i = separatorInfo.nextIndex;
                    items.push({ node: tagNode, separator: separatorInfo.separator });
                } else {
                    const separatorInfo = readSeparator(text, i, stopAtClose);
                    i = separatorInfo.nextIndex;
                    if (items.length) { items[items.length - 1].separator += separatorInfo.separator; }
                }
            }
            return { items, index: i };
        }
        function normalizeSequence(sequence) {
            for (let i = 0; i < sequence.length; i++) {
                sequence[i].separator = i < sequence.length - 1 ? ', ' : '';
                if (sequence[i].node.type === 'group') { normalizeSequence(sequence[i].node.children); }
            }
        }
        function normalizeTree(sequence) { normalizeSequence(sequence); }
        function formatWeightValue(value) {
            const rounded = Math.round(value * 20) / 20;
            let str = rounded.toFixed(2);
            return str.replace(/\.?0+$/, '');
        }
        function serializeTree(sequence) {
            const state = { output: '', offset: 0 };
            serializeSequence(sequence, state);
            return state.output;
        }
        function serializeSequence(sequence, state) {
            for (let i = 0; i < sequence.length; i++) {
                serializeNode(sequence[i].node, state);
                const sep = sequence[i].separator || '';
                state.output += sep;
                state.offset += sep.length;
            }
        }
        function serializeNode(node, state) {
            if (node.type === 'tag') {
                node.serializeStart = state.offset;
                node.serializeEnd = state.offset + node.text.length;
                state.output += node.text;
                state.offset += node.text.length;
            } else if (node.type === 'group') {
                const weightStr = formatWeightValue(node.weight);
                const format = node.format || 'singleColon';
                if (format === 'doubleColon') {
                    state.output += `${weightStr}::`;
                    state.offset += weightStr.length + 2;
                } else {
                    state.output += `${weightStr}:`;
                    state.offset += weightStr.length + 1;
                }
                serializeSequence(node.children, state);
                state.output += '::';
                state.offset += 2;
            }
        }
        function findTagNodeByOffset(sequence, offset, ancestors = []) {
            for (let i = 0; i < sequence.length; i++) {
                const item = sequence[i];
                const node = item.node;
                if (node.type === 'tag') {
                    if (node.start <= offset && offset <= node.end) { return { item, sequence, index: i, ancestors }; }
                } else if (node.type === 'group') {
                    const result = findTagNodeByOffset(node.children, offset, ancestors.concat({ groupNode: node, entry: item, parentSequence: sequence, index: i }));
                    if (result) { return result; }
                }
            }
            return null;
        }
        function removeGroupWrapper(groupInfo) {
            const { parentSequence, index, groupNode } = groupInfo;
            const children = groupNode.children;
            parentSequence.splice(index, 1, ...children);
        }
        function wrapTagWithGroup(target, newWeight) {
            const { sequence, index, item } = target;
            const tagNode = item.node, originalSeparator = item.separator || '';
            sequence.splice(index, 1);
            const groupNode = { type: 'group', weight: newWeight, format: 'doubleColon', children: [{ node: tagNode, separator: '' }] };
            sequence.splice(index, 0, { node: groupNode, separator: originalSeparator });
        }
        function adjustWeightForTag(target, direction) {
            const step = 0.05;
            const tagNode = target.item.node;
            const ancestors = target.ancestors;
            if (ancestors.length > 0) {
                const outerGroupInfo = ancestors[0];
                const groupNode = outerGroupInfo.groupNode;
                let newWeight = groupNode.weight + (direction * step);
                newWeight = Math.round(newWeight * 20) / 20;
                if (Math.abs(newWeight - 1.0) < 0.001) { removeGroupWrapper(outerGroupInfo); }
                else { groupNode.weight = newWeight; }
                return tagNode;
            }
            let newWeight = 1.0 + (direction * step);
            newWeight = Math.round(newWeight * 20) / 20;
            if (Math.abs(newWeight - 1.0) < 0.001) { return tagNode; }
            wrapTagWithGroup(target, newWeight);
            return tagNode;
        }
        function resolveMovementContext(target) {
            let { sequence, index, item, ancestors } = target;
            let movedAsGroup = false;
            if (ancestors.length) {
                const immediate = ancestors[ancestors.length - 1];
                if (immediate.groupNode.children.length === 1) {
                    movedAsGroup = true;
                    sequence = immediate.parentSequence;
                    index = immediate.index;
                    item = immediate.entry;
                    ancestors = ancestors.slice(0, -1);
                }
            }
            return { sequence, index, item, ancestors, movedAsGroup };
        }
        function moveTagWithinStructure(target, direction) {
            const context = resolveMovementContext(target);
            const { sequence, index, item, ancestors } = context;
            const isOriginalWeighted = target.ancestors.length > 0;
            if (direction === -1) {
                if (index > 0) {
                    const prevItem = sequence[index - 1];
                    if (!isOriginalWeighted && prevItem.node.type === 'group') {
                        sequence.splice(index, 1);
                        item.separator = '';
                        prevItem.node.children.push(item);
                        return true;
                    }
                    sequence[index - 1] = item;
                    sequence[index] = prevItem;
                    return true;
                }
                if (!ancestors.length) { return false; }
                const parentContext = ancestors[ancestors.length - 1];
                const { parentSequence, index: parentIndex } = parentContext;
                sequence.splice(index, 1);
                if (sequence.length === 0) {
                    parentSequence.splice(parentIndex, 1);
                    parentSequence.splice(parentIndex, 0, item);
                } else { parentSequence.splice(parentIndex, 0, item); }
                return true;
            }
            if (direction === 1) {
                if (index < sequence.length - 1) {
                    const nextItem = sequence[index + 1];
                    if (!isOriginalWeighted && nextItem.node.type === 'group') {
                        sequence.splice(index, 1);
                        item.separator = '';
                        nextItem.node.children.unshift(item);
                        return true;
                    }
                    sequence[index + 1] = item;
                    sequence[index] = nextItem;
                    return true;
                }
                if (!ancestors.length) { return false; }
                const parentContext = ancestors[ancestors.length - 1];
                const { parentSequence, index: parentIndex } = parentContext;
                sequence.splice(index, 1);
                if (sequence.length === 0) {
                    parentSequence.splice(parentIndex, 1);
                    parentSequence.splice(parentIndex, 0, item);
                } else { parentSequence.splice(parentIndex + 1, 0, item); }
                return true;
            }
            return false;
        }
        function handleKeydown(event) {
            const inputElement = getActiveInputElement();
            if (!inputElement || !event.ctrlKey) return;
            if (event.key === 'ArrowUp' || event.key === 'ArrowDown') {
                event.preventDefault(); event.stopPropagation();
                const tagInfo = getSelectedTagInfo(inputElement); if (!tagInfo) return;
                const direction = (event.key === 'ArrowUp') ? 1 : -1;
                const leadingWhitespace = tagInfo.fullText.slice(tagInfo.start, tagInfo.end).match(/^\s*/)[0];
                const structure = parsePromptStructure(tagInfo.fullText);
                const offsetForSearch = tagInfo.cursorOffset ?? (tagInfo.start + leadingWhitespace.length);
                const target = findTagNodeByOffset(structure, offsetForSearch); if (!target) { return; }
                const tagNode = adjustWeightForTag(target, direction);
                normalizeTree(structure);
                const serialized = serializeTree(structure);
                const newStart = tagNode.serializeStart ?? (tagInfo.start + leadingWhitespace.length);
                const newEnd = tagNode.serializeEnd ?? (newStart + tagNode.text.length);
                updateInputContent(inputElement, serialized, newStart, newEnd);
            } else if (event.key === 'ArrowLeft' || event.key === 'ArrowRight') {
                event.preventDefault(); event.stopPropagation();
                const tagInfo = getSelectedTagInfo(inputElement); if (!tagInfo) return;
                const direction = (event.key === 'ArrowLeft') ? -1 : 1;
                const leadingWhitespace = tagInfo.fullText.slice(tagInfo.start, tagInfo.end).match(/^\s*/)[0];
                const structure = parsePromptStructure(tagInfo.fullText);
                const offsetForSearch = tagInfo.cursorOffset ?? (tagInfo.start + leadingWhitespace.length);
                const target = findTagNodeByOffset(structure, offsetForSearch); if (!target) { return; }
                const tagNode = target.item.node;
                if (!moveTagWithinStructure(target, direction)) { return; }
                normalizeTree(structure);
                const serialized = serializeTree(structure);
                const newStart = tagNode.serializeStart ?? (tagInfo.start + leadingWhitespace.length);
                const newEnd = tagNode.serializeEnd ?? (newStart + tagNode.text.length);
                updateInputContent(inputElement, serialized, newStart, newEnd);
            }
        }
        function init() {
            const checkInterval = setInterval(() => {
                const inputElement = getActiveInputElement();
                if (inputElement) { clearInterval(checkInterval); document.addEventListener('keydown', handleKeydown, true); }
            }, 500);
        }
        return { init, parsePromptStructure, normalizeTree, serializeTree, updateInputContent };
    })();
    function init() {
        TagAssist.init();
        WeightShortcuts.init();
    }
    if (document.readyState === "loading") { document.addEventListener("DOMContentLoaded", init); }
    else { init(); }
})();