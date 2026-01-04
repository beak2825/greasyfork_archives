// ==UserScript==
// @name         jinteki 矩阵潜袭中文补全优化
// @namespace    https://github.com/klingeling/
// @description  jinteki 矩阵潜袭中文补全优化插件，包含动态内容解码功能
// @icon         https://www.jinteki.net/img/factions/NISEI_JINTEKI.svg
// @version      1.0.0
// @author       klingeling
// @license      GPL-3.0
// @match        https://www.jinteki.net/*
// @match        *localhost:1042/*
// @require      https://update.greasyfork.org/scripts/545902/1642106/jinteki%20%E4%B8%AD%E6%96%87%E5%8C%96%E6%8F%92%E4%BB%B6%E8%AF%8D%E5%BA%93.js
// @run-at       document-start
// @grant        GM_getValue
// @grant        GM_addStyle
// @supportURL   https://github.com/klingeling/
// @downloadURL https://update.greasyfork.org/scripts/545904/jinteki%20%E7%9F%A9%E9%98%B5%E6%BD%9C%E8%A2%AD%E4%B8%AD%E6%96%87%E8%A1%A5%E5%85%A8%E4%BC%98%E5%8C%96.user.js
// @updateURL https://update.greasyfork.org/scripts/545904/jinteki%20%E7%9F%A9%E9%98%B5%E6%BD%9C%E8%A2%AD%E4%B8%AD%E6%96%87%E8%A1%A5%E5%85%A8%E4%BC%98%E5%8C%96.meta.js
// ==/UserScript==

(function (window, document, undefined) {
    'use strict';

    /****************** 全局配置区（开发者可修改部分） ******************/
    const CONFIG = {
        LANG: 'zh-CN',
        OBSERVER_CONFIG: {
            childList: true,
            subtree: true
        },

    };

    let pageConfig = {};
    let letters = new Set();
    let letters_size = 0;

    // 添加解码器样式
    GM_addStyle(`
        .card-list .formats {border-top: 1px solid #ccc; padding-top: 10px;}
        pre {border-top: 1px solid #ccc; padding-top: 10px;}
        pre strong {color: yellow;}
        .gameboard.show-card-labels .me .ices .additional-subtypes {right: 12px; top: 27px;}
        .gameboard .start-game .keep-me:after,
        .gameboard .start-game .keep-op:after {content: "保留";}
        .gameboard .start-game .mulligan-me:after,
        .gameboard .start-game .mulligan-op:after {content: "调度";}

        .gameboard .start-game .mulligan-me:after {top: 170px; left: 80px;}
        .gameboard .start-game .mulligan-op:after {top: 160px; right: 80px;}
        .gameboard .start-game .keep-me:after {top: 160px; left: 80px;}
        .gameboard .start-game .keep-op:after {top: 170px; right: 70px;}

        .gameboard .additional-subtypes {top: 13px; line-height: 0.7rem;}
        .split-button > button.dropdown-toggle {vertical-align: top;}
    `);

    // 初始化
    init();

    // 更新页面设置
    function updatePageConfig(currentPageChangeTrigger) {
        const newType = detectPageType();
        if (newType && newType !== pageConfig.currentPageType) {
            pageConfig = buildPageConfig(newType);
        }
        console.log(`【Debug】${currentPageChangeTrigger}触发, 页面类型为 ${pageConfig.currentPageType}`);
    }

    // 构建页面设置 pageConfig 对象
    function buildPageConfig(pageType = pageConfig.currentPageType) {
        return {
            // 当前页面类型
            currentPageType: pageType,
            // 静态词库
            staticDict: {
                ...I18N[CONFIG.LANG].public.static,
                ...(I18N[CONFIG.LANG][pageType]?.static || {})
            },
            // 正则词库
            regexpRules: [
                ...(I18N[CONFIG.LANG][pageType]?.regexp || []),
                ...I18N[CONFIG.LANG].public.regexp
            ],
            // 忽略元素选择器规则（字符串）
            ignoreSelectors: [
                ...I18N.conf.ignoreSelectorPage['*'],
                ...(I18N.conf.ignoreSelectorPage[pageType] || [])
            ].join(', '),
            // CSS 选择器规则
            tranSelectors: [
                ...(I18N[CONFIG.LANG].public.selector || []),
                ...(I18N[CONFIG.LANG][pageType]?.selector || [])
            ],
        };
    }

    /**
     * watchUpdate 函数：监视页面变化，根据变化的节点进行翻译
     */
    function watchUpdate() {
        // 缓存当前页面的 URL
        let previousURL = window.location.href;

        const handleUrlChange = () => {
            const currentURL = window.location.href;
            // 如果页面的 URL 发生变化
            if (currentURL !== previousURL) {
                previousURL = currentURL;
                updatePageConfig("DOM变化");
            }
        }

        const processMutations = mutations => {
            // 处理动态内容解码
            decodeDynamicContent();

            // 平铺突变记录并过滤需要处理的节点（链式操作）
            mutations.flatMap(({ target, addedNodes, type }) => {
                // 处理子节点添加的情况
                if (type === 'childList' && addedNodes.length > 0) {
                    return [...addedNodes]; // 将新增节点转换为数组
                }
                // 处理属性和文本内容变更的情况
                return (type === 'attributes')
                    ? [target] // 否则，仅处理目标节点
                    : [];
            })
                .filter(node =>
                    !node.parentElement?.closest(pageConfig.ignoreMutationSelectors)
                )
                .forEach(node =>
                    traverseNode(node)
                );

            if (letters.size !== 0 && letters.size !== letters_size) {
                // console.log(key);
                letters_size = letters.size;
                console.log([...letters]);
            }
        }

        // 监听 document.body 下 DOM 变化，用于处理节点变化
        new MutationObserver(mutations => {
            handleUrlChange();
            if (pageConfig.currentPageType) processMutations(mutations);
        }).observe(document.body, CONFIG.OBSERVER_CONFIG);
    }

    /**
     * decodeHTML 函数：解码动态内容的HTML
     */
    function decodeHTML(html) {
        return html
            .replace(/&lt;strong所/g, "<strong>所")
            .replace(/&lt;strong拿/g, "<strong>拿")
            .replace(/&lt;li从/g, "<li>从")
            .replace(/&lt;strong&gt;:&lt;strong&gt;/g, "<strong>:</strong>")
            .replace(/&lt;\/strong&gt;分解模块&lt;\/strong&gt;/g, "<strong>分解模块</strong>")
            .replace(/&lt;\/strong&gt;屏障&lt;\/strong&gt;/g, "<strong>屏障</strong>")
            .replace(/条门禁子进程/g, "条<strong>门禁</strong>子进程")
            .replace(/条屏障子进程/g, "条<strong>屏障</strong>子进程")
            .replace(/破解.*<\/span>警报&lt;\/strong&gt;子进程/g, "破解<strong>警报</strong>子进程")
            .replace(
                /从你的存储栈中搜寻一一个程序。安装之。&lt;em&gt;\(Shuffle your stack after searching it.\)&lt;\/em&gt;/g,
                "从你的存储栈中搜寻一个程序。安装之。<em>(在搜寻存储栈后将其洗混。)</em>"
            )
            .replace(/&lt;trace&gt;追踪 (\d+|X)&lt;\/trace&gt;/g, "<trace><strong>追踪<sup>$1</sup></strong></trace> -")
            .replace(/&lt;/g, "<")
            .replace(/&gt;/g, ">")
            .replace(/&amp;/g, "&");
    }

    /**
     * decodeDynamicContent 函数：处理动态内容解码
     */
    function decodeDynamicContent() {
        document.querySelectorAll("pre:not([data-processed])").forEach((element) => {
            const originalHTML = element.innerHTML;
            const decodedHTML = decodeHTML(originalHTML);

            if (decodedHTML !== originalHTML) {
                element.innerHTML = decodedHTML;
                element.setAttribute('data-processed', 'true');
                // console.log("[Decoder] 已解码动态内容:", element);
            }
        });
    }

    /**
     * traverseNode 函数：遍历指定的节点，并对节点进行翻译。
     */
    function traverseNode(rootNode) {
        const start = performance.now();

        const handleTextNode = node => {
            if (node.length > 500) return;
            transElement(node, 'data');
        }

        // 如果 rootNode 是文本节点，直接处理
        if (rootNode.nodeType === Node.TEXT_NODE) {
            handleTextNode(rootNode);
            return;
        }

        const treeWalker = document.createTreeWalker(
            rootNode,
            NodeFilter.SHOW_ELEMENT | NodeFilter.SHOW_TEXT,
            node =>
                node.matches?.(pageConfig.ignoreSelectors)
                    ? NodeFilter.FILTER_REJECT
                    : NodeFilter.FILTER_ACCEPT,
        );

        const handleElement = node => {
            // 处理不同标签的元素属性翻译
            switch (node.tagName) {
                case "RELATIVE-TIME":
                    transTimeElement(node.shadowRoot);
                    return;

                case "INPUT":
                case "TEXTAREA":
                    if (['button', 'submit', 'reset'].includes(node.type)) {
                        transElement(node.dataset, 'confirm');
                        transElement(node, 'value');
                    } else {
                        transElement(node, 'placeholder');
                    }
                    break;

                case "OPTGROUP":
                    transElement(node, 'label');
                    break;

                case "BUTTON":
                    transElement(node, 'title');
                    transElement(node.dataset, 'confirm');
                    transElement(node.dataset, 'confirmText');
                    transElement(node.dataset, 'confirmCancelText');
                    transElement(node, 'cancelConfirmText');
                    transElement(node.dataset, 'disableWith');
                    break;

                case "A":
                    break;
                case "SPAN":
                    transElement(node, 'title');
                    transElement(node.dataset, 'visibleText');
                    break;

                default:
                    if (/tooltipped/.test(node.className)) transElement(node, 'ariaLabel');
            }
        }

        const handlers = {
            [Node.ELEMENT_NODE]: handleElement,
            [Node.TEXT_NODE]: handleTextNode
        };

        let currentNode;
        while ((currentNode = treeWalker.nextNode())) {
            handlers[currentNode.nodeType]?.(currentNode);
        }

        const duration = performance.now() - start;
        if (duration > 10) {
            console.log(`节点遍历耗时: ${duration.toFixed(2)}ms`);
        }
    }

    /**
     * detectPageType 函数：检测当前页面类型
     */
    function detectPageType() {
        const url = new URL(window.location.href);
        const { pathname } = url;
        const { rePagePath } = I18N.conf;


        let pageType;
        const pathMatch = pathname.match(rePagePath);
        if (pathname === '/') {
            pageType = 'homepage';
        }
        else {
            pageType = pathMatch ? (pathMatch[1] || pathMatch.slice(-1)[0]) : false;
        }
        console.log(`【Debug】pathname = ${pathname}`)

        if (pageType === false || !I18N[CONFIG.LANG]?.[pageType]) {
            console.warn(`[i18n] 页面类型未匹配或词库缺失: ${pageType}`);
            return false;
        }

        return pageType;
    }

    /**
     * transTitle 函数：翻译页面标题
     */
    function transTitle() {
        const text = document.title;
        let translatedText = I18N[CONFIG.LANG]['title']['static'][text] || '';
        if (!translatedText) {
            const res = I18N[CONFIG.LANG]['title'].regexp || [];
            for (const [pattern, replacement] of res) {
                translatedText = text.replace(pattern, replacement);
                if (translatedText !== text) break;
            }
        }
        document.title = translatedText;
    }

    /**
     * transTimeElement 函数：翻译时间元素
     */
    function transTimeElement(el) {
        const text = el.childNodes.length > 0 ? el.lastChild.textContent : el.textContent;
        const translatedText = text.replace(/^on/, "");
        if (translatedText !== text) {
            el.textContent = translatedText;
        }
    }

    /**
     * transElement 函数：翻译元素属性
     */
    function transElement(el, field) {
        const text = el[field];
        if (!text) return false;

        const translatedText = transText(text);
        if (translatedText) {
            el[field] = translatedText;
        }
    }

    /**
     * transText 函数：翻译文本内容
     */
    function transText(text) {
        const shouldSkip = text => /^[\s0-9]*$/.test(text) || /^[\u4e00-\u9fa5]+$/.test(text) || !/[a-zA-Z,.]/.test(text);
        if (shouldSkip(text)) return false;

        const trimmedText = text.trim();
        const cleanedText = trimmedText.replace(/\xa0|[\s]+/g, ' ');

        const translatedText = fetchTranslatedText(cleanedText);

        if (translatedText && translatedText !== cleanedText) {
            return text.replace(trimmedText, translatedText);
        }

        return false;
    }

    /**
     * fetchTranslatedText 函数：获取翻译文本
     */
    function fetchTranslatedText(text) {
        let translatedText = pageConfig.staticDict[text];

        if (typeof translatedText === 'string') return translatedText;

        for (const [pattern, replacement] of pageConfig.regexpRules) {
            translatedText = text.replace(pattern, replacement);
            if (translatedText !== text) return translatedText;
        }

        letters.add(text);

        return false;
    }

    /**
     * transBySelector 函数：通过选择器翻译
     */
    function transBySelector() {
        pageConfig.tranSelectors?.forEach(([selector, translatedText]) => {
            const element = document.querySelector(selector);
            if (element) {
                element.textContent = translatedText;
            }
        })
    }

    /**
     * init 函数：初始化
     */
    function init() {
        document.addEventListener('DOMContentLoaded', () => {
            updatePageConfig('首次载入');
            if (!pageConfig.currentPageType) return;

            transTitle();
            transBySelector();
            decodeDynamicContent(); // 初始解码

            let count = 0;
            const interval = setInterval(() => {
                if (count < 10) {
                    if (pageConfig.currentPageType) {
                        document.querySelectorAll('div.system').forEach(el => {
                            traverseNode(el);
                        });
                    }
                    count++;
                } else {
                    clearInterval(interval);
                }
            }, 500); // 500ms * 10 = 5秒
            // if (letters.size !== 0 && letters.size !== letters_size) {
            //     // console.log(key);
            //     letters_size = letters.size;
            //     console.log([...letters]);
            // }
        });

        // 监听点击事件进行解码
        document.addEventListener("click", () => {
            setTimeout(() => {
                decodeDynamicContent();
                if (pageConfig.currentPageType) {
                    traverseNode(document.body);
                    document.querySelectorAll('div.system').forEach(el => {
                        traverseNode(el);
                    });
                }
            }, 500);
        }, true);

        watchUpdate();
    }

})(window, document);