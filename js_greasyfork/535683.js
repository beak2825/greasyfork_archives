// ==UserScript==
// @name:en         [MWI]Recruitment Message Translator:zh-CN
// @name            [银河奶牛]组队招募副本信息翻译
// @namespace       https://cnb.cool/shenhuanjie/skyner-cn/tamper-monkey-script/mwi-recruitment-translator
// @version         1.0.6
// @description:en  Translate in-game recruitment messages to Chinese
// @description     将银河奶牛游戏中的招募信息自动翻译为中文
// @author          shenhuanjie
// @license         MIT
// @match           https://www.milkywayidle.com/*
// @icon            https://www.milkywayidle.com/favicon.svg
// @grant           none
// @run-at          document-end
// @homepage        https://greasyfork.org/zh-CN/scripts/535683
// @supportURL      https://greasyfork.org/zh-CN/scripts/535683
// @downloadURL https://update.greasyfork.org/scripts/535683/%5B%E9%93%B6%E6%B2%B3%E5%A5%B6%E7%89%9B%5D%E7%BB%84%E9%98%9F%E6%8B%9B%E5%8B%9F%E5%89%AF%E6%9C%AC%E4%BF%A1%E6%81%AF%E7%BF%BB%E8%AF%91.user.js
// @updateURL https://update.greasyfork.org/scripts/535683/%5B%E9%93%B6%E6%B2%B3%E5%A5%B6%E7%89%9B%5D%E7%BB%84%E9%98%9F%E6%8B%9B%E5%8B%9F%E5%89%AF%E6%9C%AC%E4%BF%A1%E6%81%AF%E7%BF%BB%E8%AF%91.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // ========== 全局配置 ==========
    const CONFIG = {
        enableConsoleLog: false,     // 控制台日志开关，默认关闭
        caseSensitive: false,        // 是否大小写敏感
        wholeWordOnly: true,         // 是否全词匹配
        chatSelector: '.chat-message', // 聊天消息选择器
        logLevel: 'INFO',            // 日志级别: DEBUG, INFO, WARNING, ERROR
        initialScanDelay: 500,       // 初始扫描延迟(ms)
        rescanInterval: 10000,       // 重新扫描间隔(ms)
        maxTranslationDepth: 3       // 最大翻译深度
    };
    // =============================

    // ========== 翻译配置 ==========
    const TRANSLATIONS = new Map([

        // 普通星球副本 - P前缀
        ["Party: Smelly Planet", "P1:臭臭星球"],
        ["Party: Swamp Planet", "P2:沼泽星球"],
        ["Party: Aqua Planet", "P3:海洋星球"],
        ["Party: Jungle Planet", "P4:丛林星球"],
        ["Party: Gobo Planet", "P5:哥布林星球"],
        ["Party: Planet Of The Eyes", "P6:眼球星球"],
        ["Party: Sorcerer's Tower", "P7:巫师之塔"],
        ["Party: Bear With It", "P8:熊熊星球"],
        ["Party: Golem Cave", "P9:魔像洞穴"],
        ["Party: Twilight Zone", "P10:暮光之地"],
        ["Party: Infernal Abyss", "P11:地狱深渊"],

        // 地下城副本 - D前缀
        ["Party: Chimerical Den", "D1:奇幻洞穴"],
        ["Party: Sinister Circus", "D2:阴森马戏团"],
        ["Party: Enchanted Fortress", "D3:秘法要塞"],
        ["Party: Pirate Cove", "D4:海盗基地"],
    ]);
    // =============================

    // 工具函数：日志记录
    function log(message, level = 'INFO') {
        if (!CONFIG.enableConsoleLog) return;

        if (!['DEBUG', 'INFO', 'WARNING', 'ERROR'].includes(level)) {
            level = 'INFO';
        }

        if (['DEBUG', 'INFO'].includes(level) && level !== CONFIG.logLevel) {
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

    // 工具函数：转义正则特殊字符
    function escapeRegExp(str) {
        return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    }

    // 生成翻译正则表达式模式
    function createTranslationPatterns() {
        return Array.from(TRANSLATIONS).map(([en, zh]) => {
            // 转义原始字符串中的正则特殊字符
            const escaped = escapeRegExp(en);

            // 使用字符串模板构建正则表达式，支持中英文括号的精英标识
            const patternStr = escaped
                .replace(/\((Elite)\)/, '(?:\\(|（)$1(?:\\)|）)')
                .replace(/（(Elite)）/, '(?:\\(|（)$1(?:\\)|）)');

            // 添加全词匹配边界（如果配置为全词匹配）
            const fullPattern = CONFIG.wholeWordOnly
                ? `\\b${patternStr}\\b`
                : patternStr;

            // 编译正则表达式
            const flags = CONFIG.caseSensitive ? 'g' : 'gi';

            return {
                pattern: new RegExp(fullPattern, flags),
                replacement: zh,
                original: en
            };
        }).sort((a, b) => b.pattern.source.length - a.pattern.source.length);
    }

    // 翻译处理器
    function translateTextNode(textNode) {
        if (!textNode || !textNode.nodeValue) return false;

        let content = textNode.nodeValue;
        let translatedContent = content;
        let modified = false;

        try {
            for (const {pattern, replacement, original} of translationPatterns) {
                if (pattern.test(translatedContent)) {
                    const newContent = translatedContent.replace(pattern, replacement);
                    if (newContent !== translatedContent) {
                        log(`替换: ${original} → ${replacement}`, 'DEBUG');
                        translatedContent = newContent;
                        modified = true;
                    }
                }
            }

            if (modified) {
                textNode.nodeValue = translatedContent;
                log(`已翻译节点: ${content.substring(0, 50)}...`, 'INFO');
                return true;
            }
        } catch (error) {
            log(`翻译过程中出错: ${error.message}`, 'ERROR');
        }

        return false;
    }

    // 检查节点是否为聊天消息
    function isChatNode(node) {
        return node.nodeType === Node.ELEMENT_NODE &&
               node.matches(CONFIG.chatSelector);
    }

    // 处理单个DOM节点及其子节点
    function processNode(node, depth = 0) {
        if (depth > CONFIG.maxTranslationDepth) return;

        if (isChatNode(node)) {
            const walker = document.createTreeWalker(
                node,
                NodeFilter.SHOW_TEXT,
                null,
                false
            );

            let translatedCount = 0;
            while (walker.nextNode()) {
                if (translateTextNode(walker.currentNode)) {
                    translatedCount++;
                }
            }

            if (translatedCount > 0) {
                log(`在聊天节点中翻译了 ${translatedCount} 处文本`, 'INFO');
            }
        } else if (node.nodeType === Node.TEXT_NODE) {
            // 直接文本节点
            translateTextNode(node);
        } else if (node.nodeType === Node.ELEMENT_NODE) {
            // 递归处理子节点
            const childNodes = Array.from(node.childNodes);
            childNodes.forEach(child => {
                processNode(child, depth + 1);
            });
        }
    }

    // 扫描并翻译整个DOM
    function scanAndTranslate() {
        log('开始扫描DOM...', 'INFO');
        const startTime = performance.now();

        try {
            const chatNodes = document.querySelectorAll(CONFIG.chatSelector);
            log(`找到 ${chatNodes.length} 个聊天节点`, 'INFO');

            let totalTranslations = 0;
            chatNodes.forEach(node => {
                const walker = document.createTreeWalker(
                    node,
                    NodeFilter.SHOW_TEXT,
                    null,
                    false
                );

                while (walker.nextNode()) {
                    if (translateTextNode(walker.currentNode)) {
                        totalTranslations++;
                    }
                }
            });

            const elapsedTime = performance.now() - startTime;
            log(`扫描完成: ${totalTranslations} 处翻译，耗时 ${elapsedTime.toFixed(2)}ms`, 'INFO');
            return totalTranslations;
        } catch (error) {
            log(`扫描过程中出错: ${error.message}`, 'ERROR');
            return 0;
        }
    }

    // 初始化函数
    function init() {
        log('翻译器初始化中...', 'INFO');

        try {
            // 初始延迟扫描，等待页面完全加载
            setTimeout(() => {
                log('执行初始DOM扫描...', 'INFO');
                const initialTranslations = scanAndTranslate();
                log(`初始扫描完成，翻译了 ${initialTranslations} 处文本`, 'INFO');

                // 动态监听DOM变化
                const observer = new MutationObserver(mutations => {
                    mutations.forEach(mutation => {
                        if (mutation.type === 'childList') {
                            // 处理新增节点
                            mutation.addedNodes.forEach(node => {
                                if (node.nodeType === Node.ELEMENT_NODE) {
                                    processNode(node);

                                    // 处理子节点
                                    const childWalker = document.createTreeWalker(
                                        node,
                                        NodeFilter.SHOW_ELEMENT,
                                        null,
                                        false
                                    );

                                    while (childWalker.nextNode()) {
                                        processNode(childWalker.currentNode);
                                    }
                                } else if (node.nodeType === Node.TEXT_NODE) {
                                    processNode(node);
                                }
                            });
                        } else if (mutation.type === 'characterData') {
                            // 处理文本内容变更
                            const textNode = mutation.target;
                            if (textNode && textNode.parentNode) {
                                if (isChatNode(textNode.parentNode)) {
                                    translateTextNode(textNode);
                                }
                            }
                        }
                    });
                });

                // 开始监听DOM变化
                observer.observe(document.body, {
                    childList: true,
                    subtree: true,
                    characterData: true
                });

                log('翻译器已启动并监听DOM变化', 'INFO');
            }, CONFIG.initialScanDelay);

            // 定期重新扫描整个DOM
            setInterval(() => {
                scanAndTranslate();
            }, CONFIG.rescanInterval);

            log(`翻译器配置: 大小写敏感=${CONFIG.caseSensitive}, 全词匹配=${CONFIG.wholeWordOnly}, 扫描间隔=${CONFIG.rescanInterval/1000}s`, 'INFO');
        } catch (error) {
            log(`初始化失败: ${error.message}`, 'ERROR');
        }
    }

    // 预编译翻译模式
    const translationPatterns = createTranslationPatterns();

    // 启动脚本
    if (document.readyState === 'loading') {
        window.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

    // 打印初始状态信息
    if (CONFIG.enableConsoleLog) {
        console.log('%c[Translator] 翻译器已加载，控制台日志已开启', 'color: #2196F3');
    } else {
        console.log('%c[Translator] 翻译器已加载，控制台日志已关闭', 'color: #888');
    }
})();