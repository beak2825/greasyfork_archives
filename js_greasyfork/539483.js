// ==UserScript==
// @name         监督Sedoruee的神奇小工具
// @namespace    https://github.com/sedoruee
// @version      2.0.5.2
// @description  null
// @author       Sedoruee
// @grant        GM.xmlHttpRequest
// @grant        GM_xmlhttpRequest
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        GM.setValue
// @grant        GM_addStyle
// @grant        GM_deleteValue
// @grant        GM.info
// @run-at       document-start
// @match        *://bgm.tv/*
// @match        *://chii.in/*
// @match        *://bangumi.tv/*
// @require      https://cdnjs.cloudflare.com/ajax/libs/crypto-js/4.1.1/crypto-js.min.js
// @connect      *
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/539483/%E7%9B%91%E7%9D%A3Sedoruee%E7%9A%84%E7%A5%9E%E5%A5%87%E5%B0%8F%E5%B7%A5%E5%85%B7.user.js
// @updateURL https://update.greasyfork.org/scripts/539483/%E7%9B%91%E7%9D%A3Sedoruee%E7%9A%84%E7%A5%9E%E5%A5%87%E5%B0%8F%E5%B7%A5%E5%85%B7.meta.js
// ==/UserScript==
(function() {
    'use strict';

    const RULES_URL = 'https://bgm.tv/group/topic/426086';
    const DECRYPTION_KEY = 'Tx4d1gx2F';
    const CACHE_KEY = 'bgm_s_rules_cache_v1';
    let forwardRules = [];
    let reverseRules = [];
    let sensitiveWords = [];
    let blockedElementsRules = []; // New array for blocking rules

    const EDIT_PAGE_URL = 'https://bgm.tv/group/topic/425388/edit';
    const LOG_PANEL_ID = 'bgm-script-log-panel';

    function createEncryptorPanel() {
        const panel = document.createElement('div');
        panel.id = 'bgm-encryptor-panel';
        panel.style.cssText = `margin: 15px 0; padding: 10px; border: 1px solid #ddd; background-color: #f9f9f9;`;
        panel.innerHTML = `
            <h2 style="font-size: 14px; margin: 0 0 10px; padding-bottom: 5px; border-bottom: 1px solid #ccc;">规则加密/解密工具</h2>
            <textarea id="encryptor-input" placeholder='输入JSON规则。示例:\n{\n  "pattern": "白粉",\n  "sensitive_word": true\n},\n{\n  "url_pattern": "*/group/topic/426184",\n  "selector": ".block-me-class",\n  "block_element": true\n}' style="width: 98%; height: 120px; margin-bottom: 10px; font-family: monospace; resize: vertical;"></textarea>
            <button id="encryptor-button" style="padding: 5px 15px; background-color: #2b88ff; color: white; border: none; border-radius: 4px; cursor: pointer;">加密并复制</button>
            <div id="encryptor-status" style="display: inline-block; margin-left: 10px; font-size: 12px;"></div>
            <textarea id="encryptor-output" readonly placeholder="加密结果将显示在此处..." style="width: 98%; height: 60px; margin-top: 10px; font-family: monospace; background-color: #eee;"></textarea>
        `;
        return panel;
    }

    function handleEncryption() {
        const inputArea = document.getElementById('encryptor-input');
        const outputArea = document.getElementById('encryptor-output');
        const statusArea = document.getElementById('encryptor-status');
        const rawText = inputArea.value.trim();
        statusArea.textContent = '';
        outputArea.value = '';
        if (!rawText) {
            statusArea.style.color = 'red';
            statusArea.textContent = '错误：输入内容不能为空。';
            return;
        }
        try {
            JSON.parse(rawText);
        } catch (e) {
            statusArea.style.color = 'red';
            statusArea.textContent = '错误：输入的不是有效的JSON格式。';
            return;
        }
        const encrypted = CryptoJS.AES.encrypt(rawText, DECRYPTION_KEY);
        const finalOutput = `[Qe3t]${encrypted.toString()}[/Qe3t]`;
        outputArea.value = finalOutput;
        outputArea.select();
        document.execCommand('copy');
        statusArea.style.color = 'green';
        statusArea.textContent = '加密成功，已复制到剪贴板！';
    }

    function createLogPanel() {
        const logPanel = document.createElement('div');
        logPanel.id = LOG_PANEL_ID;
        logPanel.innerHTML = '<h2 style="font-size: 14px; margin: 0 0 5px; padding-bottom: 5px; border-bottom: 1px solid #ccc;">脚本日志</h2>';
        logPanel.style.cssText = `margin: 15px 0; padding: 10px; border: 1px solid #ddd; background-color: #f9f9f9; max-height: 300px; overflow-y: auto;`;
        return logPanel;
    }

    function logToPanel(message, level = 'INFO') {
        const logPanel = document.getElementById(LOG_PANEL_ID);
        if (!logPanel) {
            console.log(`[BGM SCRIPT LOG] ${level}: ${message}`);
            return;
        }
        const entry = document.createElement('div');
        const timestamp = new Date().toLocaleTimeString('en-GB');
        let color = '#333';
        switch (level) {
            case 'SUCCESS': color = '#28a745'; break;
            case 'ERROR':   color = '#dc3545'; break;
            case 'WARN':    color = '#ffc107'; break;
            case 'DEBUG':   color = '#6c757d'; break;
        }
        entry.style.cssText = `color: ${color}; margin: 2px 0; font-size: 12px; line-height: 1.4; border-bottom: 1px solid #eee; padding-bottom: 2px;`;
        entry.innerHTML = `<span style="font-family: 'Courier New', Courier, monospace; font-weight: bold; min-width: 80px; display: inline-block;">${timestamp}</span> [${level}] ${message}`;
        logPanel.appendChild(entry);
        logPanel.scrollTop = logPanel.scrollHeight;
    }

    function escapeRegex(string) {
        return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    }

    async function saveRulesToStorage(rulesData) {
        try {
            await GM.setValue(CACHE_KEY, JSON.stringify(rulesData));
            logToPanel('新规则已成功存入本地缓存。', 'DEBUG');
        } catch (e) {
            logToPanel(`储存规则到缓存失败: ${e.message}`, 'ERROR');
        }
    }

    async function loadRulesFromStorage() {
        try {
            const storedJson = await GM.getValue(CACHE_KEY, null);
            return storedJson ? JSON.parse(storedJson) : null;
        } catch (e) {
            logToPanel(`从缓存加载规则失败: ${e.message}`, 'WARN');
            await GM.deleteValue(CACHE_KEY);
            return null;
        }
    }

    function buildRulesFromData(rulesData) {
        const fwd = [], rev = [], sens = [], blocked = [];
        if (!Array.isArray(rulesData)) {
            logToPanel('构建规则失败：提供的数据不是数组。', 'ERROR');
            return [[], [], [], []];
        }
        rulesData.forEach(rule => {
            if (rule.sensitive_word === true && rule.pattern) {
                sens.push(rule.pattern);
            } else if (rule.block_element === true && rule.url_pattern && rule.selector) { // New rule type for blocking elements
                blocked.push({
                    url_pattern: rule.url_pattern,
                    selector: rule.selector
                });
            } else if (rule.pattern && typeof rule.replacement !== 'undefined' && typeof rule.original_text !== 'undefined') {
                fwd.push({ regex: new RegExp(rule.pattern, rule.flags || 'g'), replacement: rule.replacement });
                rev.push({ regex: new RegExp(escapeRegex(rule.replacement), 'g'), replacement: rule.original_text });
            }
        });
        logToPanel(`成功构建 ${fwd.length} 条替换规则，${sens.length} 条敏感词规则，和 ${blocked.length} 条元素屏蔽规则。`, 'SUCCESS');
        return [fwd, rev, sens, blocked];
    }

    async function fetchAndParseRules(shouldFillPanel) {
        logToPanel('开始从网络获取规则...', 'DEBUG');
        return new Promise((resolve, reject) => {
            if (typeof CryptoJS === 'undefined') return reject(new Error('未找到CryptoJS库。'));
            GM.xmlHttpRequest({
                method: "GET", url: RULES_URL,
                onload: (response) => {
                    if (response.status !== 200) return reject(new Error(`获取规则失败，状态码: ${response.status}`));
                    try {
                        const pageText = new DOMParser().parseFromString(response.responseText, 'text/html').body.innerText;
                        const match = pageText.match(/\[Qe3t\]([\s\S]*?)\[\/Qe3t\]/);
                        if (!match || !match[1]) return reject(new Error('未找到 [Qe3t] 标签或其内容为空。'));
                        const decryptedJson = CryptoJS.AES.decrypt(match[1].trim(), DECRYPTION_KEY).toString(CryptoJS.enc.Utf8);
                        if (!decryptedJson) return reject(new Error('解密失败。'));

                        if (shouldFillPanel) {
                            const inputArea = document.getElementById('encryptor-input');
                            if (inputArea) {
                                try {
                                    inputArea.value = JSON.stringify(JSON.parse(decryptedJson), null, 2);
                                } catch { inputArea.value = decryptedJson; }
                                logToPanel('已将最新规则自动填充到加密器。', 'INFO');
                            }
                        }

                        const rulesData = JSON.parse(decryptedJson);
                        if (!Array.isArray(rulesData)) return reject(new Error('解析的数据不是数组。'));
                        resolve(rulesData);
                    } catch (e) { reject(e); }
                },
                onerror: (err) => reject(new Error('网络错误，无法获取规则。'))
            });
        });
    }

    function applyReplacements(text, rules) {
        if (!rules.length || !text) return text;
        return rules.reduce((acc, rule) => acc.replace(rule.regex, rule.replacement), text);
    }

    function doesMatch(text, rules) {
        if (!text || !rules.length) return false;
        return rules.some(rule => rule.regex.test(text));
    }

    function replaceForwardsInTextarea(inputElement) {
        if (inputElement.id !== 'content' || inputElement.tagName !== 'TEXTAREA' || !doesMatch(inputElement.value, forwardRules)) return;
        const originalValue = inputElement.value, selectionStart = inputElement.selectionStart;
        const textBeforeCursor = originalValue.slice(0, selectionStart);
        const newTextBeforeCursor = applyReplacements(textBeforeCursor, forwardRules);
        if (textBeforeCursor !== newTextBeforeCursor) {
            inputElement.value = newTextBeforeCursor + originalValue.slice(selectionStart);
            inputElement.setSelectionRange(newTextBeforeCursor.length, newTextBeforeCursor.length);
        }
    }

    function revertBackwardsElsewhere(rootElement = document.body) {
        if (!rootElement || rootElement.nodeType !== Node.ELEMENT_NODE || !reverseRules.length) return;
        const walker = document.createTreeWalker(rootElement, NodeFilter.SHOW_TEXT, {
            acceptNode: (node) => (node.parentElement && (node.parentElement.closest('textarea#content') || /^(SCRIPT|STYLE|TEXTAREA|INPUT)$/i.test(node.parentElement.tagName))) ? NodeFilter.FILTER_REJECT : NodeFilter.FILTER_ACCEPT
        });
        const nodesToModify = [];
        let node;
        while ((node = walker.nextNode())) {
            if (doesMatch(node.nodeValue, reverseRules)) nodesToModify.push(node);
        }
        if (nodesToModify.length > 0) {
            nodesToModify.forEach(n => { n.nodeValue = applyReplacements(n.nodeValue, reverseRules); });
        }
    }

    // New function to check if current path matches pattern
    function pathMatchesPattern(pathname, pattern) {
        if (!pathname || !pattern) return false;
        const escapedPattern = pattern.replace(/[.+?^${}()|[\]\\]/g, '\\$&').replace(/\*/g, '.*');
        const regex = new RegExp(`^${escapedPattern}$`);
        return regex.test(pathname);
    }

    // New function to apply element blocking rules
    const blockedElementsProcessed = new WeakSet(); // Use WeakSet to avoid memory leaks
    function applyBlockedElementsRules(rootElement = document.body) {
        if (!blockedElementsRules.length) return;
        const currentPathname = window.location.pathname;

        blockedElementsRules.forEach(rule => {
            if (pathMatchesPattern(currentPathname, rule.url_pattern)) {
                try {
                    rootElement.querySelectorAll(rule.selector).forEach(element => {
                        if (!blockedElementsProcessed.has(element)) {
                            element.style.display = 'none';
                            blockedElementsProcessed.add(element);
                        }
                    });
                } catch (e) {
                    logToPanel(`应用屏蔽规则时出错: 选择器 "${rule.selector}" 无效或DOM操作失败。`, 'ERROR');
                }
            }
        });
    }

    const monitoredElements = new WeakSet();
    function setupInputMonitoringForElement(element) {
        if (!element || monitoredElements.has(element)) return;
        monitoredElements.add(element);
        if (element.id === 'content' && element.tagName === 'TEXTAREA') {
            element.addEventListener('input', (event) => replaceForwardsInTextarea(event.target));
            if (element.value) replaceForwardsInTextarea(element);
        }
    }

    function setupAllInputMonitoring() {
        const targetTextarea = document.querySelector('textarea#content');
        if (targetTextarea) setupInputMonitoringForElement(targetTextarea);
    }

    function setupMutationObserver() {
        const observer = new MutationObserver(mutations => {
            for (const mutation of mutations) {
                if (mutation.type === 'childList') {
                    for (const node of mutation.addedNodes) {
                        if (node.nodeType === Node.ELEMENT_NODE) {
                            revertBackwardsElsewhere(node);
                            applyBlockedElementsRules(node); // Apply blocking rules to newly added nodes
                            const targetTextarea = node.matches('textarea#content') ? node : node.querySelector('textarea#content');
                            if (targetTextarea) setupInputMonitoringForElement(targetTextarea);
                        }
                    }
                }
            }
        });
        if (document.body) observer.observe(document.body, { childList: true, subtree: true });
    }

    function setupSensitiveWordChecker(selector, words) {
        const target = document.querySelector(selector);
        if (!target || !words.length) return;

        target.addEventListener('blur', handleCheck);
        target.addEventListener('keyup', handleCheck);
        target.addEventListener('input', handleCheck);

        function handleCheck(event) {
            const currentWords = [...words];
            currentWords.forEach(word => {
                const patt = new RegExp(word, "g");
                const text = event.target.value;
                if (patt.test(text)) {
                    if (confirm("发现敏感词：" + word + ", 是否替换？")) {
                        const replacement = prompt("敏感词：" + word + ", 替换为：");
                        if (replacement !== null) {
                            event.target.value = text.replace(patt, replacement);
                        }
                    } else {
                        // If user cancels replacement, remove this specific word from the active check list for this session
                        const index = words.indexOf(word);
                        if (index > -1) {
                            words.splice(index, 1);
                        }
                    }
                }
            });
        }
        logToPanel(`为 ${selector} 设置了敏感词检查器。`, 'DEBUG');
    }

    function initializeSensitiveWordCheckers(words) {
        if (words.length === 0) return;
        const href = window.location.href;
        const localWords = [...words];

        if (href.match(/new_topic|topic\/\d+\/edit/)) {
            setupSensitiveWordChecker("#title", localWords);
            setupSensitiveWordChecker("#content", localWords);
        }
        if (href.match(/blog\/create|blog\/\d+\/edit/)) {
            setupSensitiveWordChecker("#title", localWords);
            setupSensitiveWordChecker("#tpc_content", localWords);
        }
        if (href.match(/subject\/\d+/)) {
            setupSensitiveWordChecker("#title", localWords);
            setupSensitiveWordChecker("#content", localWords);
            setupSensitiveWordChecker("#comment", localWords);
        }
    }

    async function runReplacementLogic() {
        const applyAllRulesAndSetupObservers = () => {
            if (document.body) {
                revertBackwardsElsewhere(document.body);
                applyBlockedElementsRules(document.body); // Apply blocking rules on initial load
                setupAllInputMonitoring();
                setupMutationObserver();
                initializeSensitiveWordCheckers(sensitiveWords);
                logToPanel('初始化完成，脚本正在运行。', 'SUCCESS');
            }
        };

        let rulesApplied = false;
        const cachedRulesData = await loadRulesFromStorage();
        if (cachedRulesData && cachedRulesData.length > 0) {
            [forwardRules, reverseRules, sensitiveWords, blockedElementsRules] = buildRulesFromData(cachedRulesData);
            applyAllRulesAndSetupObservers();
            rulesApplied = true;
        }

        try {
            const newRulesData = await fetchAndParseRules(false);
            await saveRulesToStorage(newRulesData);
            // Re-build rules even if cached rules were used, to ensure latest rules are active.
            [forwardRules, reverseRules, sensitiveWords, blockedElementsRules] = buildRulesFromData(newRulesData);
            if (!rulesApplied) { // Only call init if it hasn't been called with cached rules
                applyAllRulesAndSetupObservers();
            } else { // If already initialized with cached rules, just re-apply the new rules (e.g. blocking)
                revertBackwardsElsewhere(document.body); // Re-apply replacement as rules might have changed
                applyBlockedElementsRules(document.body); // Re-apply blocking rules
            }
        } catch (error) {
            logToPanel(`获取网络规则失败: ${error.message}`, 'ERROR');
            if (!rulesApplied) logToPanel('由于网络和缓存均失败，脚本无法运行。', 'ERROR');
        }
    }

    async function setupEditPagePanel() {
        const anchorElement = document.querySelector('div.light_odd');
        if (!anchorElement) return;

        const encryptorPanel = createEncryptorPanel();
        const logPanel = createLogPanel();

        anchorElement.after(logPanel);
        anchorElement.after(encryptorPanel);

        document.getElementById('encryptor-button').addEventListener('click', handleEncryption);

        logToPanel('调试面板已加载。');
        try {
            await fetchAndParseRules(true);
        } catch(e) {
            logToPanel(`获取规则以填充面板时出错: ${e.message}`, 'ERROR');
        }
    }

    async function initializeScript() {
        if (window.location.href.startsWith(EDIT_PAGE_URL)) {
            await setupEditPagePanel();
        } else {
            await setupEditPagePanel();
        }
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initializeScript);
    } else {
        initializeScript();
    }
})();