// ==UserScript==
// @name         yucata 中文化插件
// @namespace    klingeling
// @description  中文化 yucata 界面的部分菜单及内容。
// @copyright    2023, klingeling
// @icon         https://www.yucata.de/netimages/c/yavatar.png
// @version      2.0.4
// @author       klingeling
// @match        *.yucata.de/*
// @require      https://update.greasyfork.org/scripts/500540/1619428/yucata%20%E4%B8%AD%E6%96%87%E5%8C%96%E6%8F%92%E4%BB%B6_%E8%AF%8D%E5%BA%93.js
// @run-at       document-end
// @grant        GM_xmlhttpRequest
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        GM_registerMenuCommand
// @supportURL   https://github.com/klingeling/18xx-i18n-plugin/issues
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/500541/yucata%20%E4%B8%AD%E6%96%87%E5%8C%96%E6%8F%92%E4%BB%B6.user.js
// @updateURL https://update.greasyfork.org/scripts/500541/yucata%20%E4%B8%AD%E6%96%87%E5%8C%96%E6%8F%92%E4%BB%B6.meta.js
// ==/UserScript==


(function (window, document, undefined) {
    'use strict';

    const lang = 'zh'; // 设置默认语言
    let page;
    //let enable_RegExp = GM_getValue("enable_RegExp", 1);
    let enable_RegExp = 1;
    const letters = new Set();
    let letters_size = 0;

    /**
     * watchUpdate 函数：监视页面变化，根据变化的节点进行翻译
     * file://C:/Code/i18n/yucata/locals.js
     */
    function watchUpdate() {
        // 检测浏览器是否支持 MutationObserver
        const MutationObserver =
            window.MutationObserver ||
            window.WebKitMutationObserver ||
            window.MozMutationObserver;

        // 获取当前页面的 URL
        const getCurrentURL = () => document.URL;
        getCurrentURL.previousURL = getCurrentURL();

        // 创建 MutationObserver 实例，监听 DOM 变化
        const observer = new MutationObserver((mutations, observer) => {
            const currentURL = getCurrentURL();

            // 如果页面的 URL 发生变化
            if (currentURL !== getCurrentURL.previousURL) {
                getCurrentURL.previousURL = currentURL;
                page = getPage(); // 当页面地址发生变化时，更新全局变量 page
                console.log(`链接变化 page= ${page}`);

                transTitle(); // 翻译页面标题
                transBySelector();
                if (page) {
                    setTimeout(() => {
                        // 使用 CSS 选择器找到页面上的元素，并将其文本内容替换为预定义的翻译
                        transTitle(); // 翻译页面标题
                        transBySelector();
                    }, 500);
                }
            }

            if (page) {
                // 使用 filter 方法对 mutations 数组进行筛选，
                // 返回 `节点增加 或 属性更改的 mutation` 组成的新数组 filteredMutations。
                const filteredMutations = mutations.filter(mutation => mutation.addedNodes.length > 0 || mutation.type === 'attributes' || mutation.type === 'characterData');

                // 处理每个变化
                // transTitle(); // 翻译页面标题
                filteredMutations.forEach(mutation => traverseNode(mutation.target));
                if (letters.size !== 0 && letters.size !== letters_size) {
                    // console.log(key);
                    letters_size = letters.size;
                    console.log([...letters]);
                }
            }
        });

        // 配置 MutationObserver
        const config = {
            subtree: true,
            childList: true,
            characterData: true,
            attributeFilter: ['value', 'placeholder', 'aria-label', 'data-confirm', 'title'], // 仅观察特定属性变化
        };

        // 开始观察 document.body 的变化
        observer.observe(document.body, config);
    }

    /**
     * traverseNode 函数：遍历指定的节点，并对节点进行翻译。
     * @param {Node} node - 需要遍历的节点。
     */
    function traverseNode(node) {
        // 跳过忽略
        if (I18N.conf.reIgnoreId.includes(node.id) ||
            I18N.conf.reIgnoreClass.test(node.className) ||
            I18N.conf.reIgnoreTag.includes(node.tagName) ||
            (node.getAttribute && I18N.conf.reIgnoreItemprop.includes(node.getAttribute("itemprop"))) ||
            (node.getAttribute && I18N.conf.reIgnorehrefprop.includes(node.getAttribute("href")))
        ) {
            return;
        }

        if (node.nodeType === Node.ELEMENT_NODE) { // 元素节点处理

            // 翻译时间元素
            if (
                ["RELATIVE-TIME", "TIME-AGO", "TIME", "LOCAL-TIME"].includes(node.tagName)
            ) {
                if (node.shadowRoot) {
                    transTimeElement(node.shadowRoot);
                    watchTimeElement(node.shadowRoot);
                } else {
                    transTimeElement(node);
                }
                return;
            }

            // 元素节点属性翻译
            if (["INPUT", "TEXTAREA"].includes(node.tagName)) { // 输入框 按钮 文本域
                if (node.hasAttribute('title')) {
                    transElement(node, 'title', true); // 翻译 浏览器 提示对话框
                }
                if (["button", "submit", "reset"].includes(node.type)) {
                    if (node.hasAttribute('data-confirm')) { // 翻译 浏览器 提示对话框
                        transElement(node, 'data-confirm', true);
                    }
                    transElement(node, 'value');
                } else {
                    transElement(node, 'placeholder');
                }
            } else if (node.tagName === 'BUTTON') {
                if (node.hasAttribute('aria-label') && ["tooltipped"].includes(node.className)) {
                    transElement(node, 'aria-label', true); // 翻译 浏览器 提示对话框
                }
                if (node.hasAttribute('title')) {
                    transElement(node, 'title', true); // 翻译 浏览器 提示对话框
                }
                if (node.hasAttribute('data-confirm')) {
                    transElement(node, 'data-confirm', true); // 翻译 浏览器 提示对话框 ok
                }
                if (node.hasAttribute('data-confirm-text')) {
                    transElement(node, 'data-confirm-text', true); // 翻译 浏览器 提示对话框 ok
                }
                if (node.hasAttribute('data-confirm-cancel-text')) {
                    transElement(node, 'data-confirm-cancel-text', true); // 取消按钮 提醒
                }
                if (node.hasAttribute('cancel-confirm-text')) {
                    transElement(node, 'cancel-confirm-text', true); // 取消按钮 提醒
                }
                if (node.hasAttribute('data-disable-with')) { // 按钮等待提示
                    transElement(node.dataset, 'disableWith');
                }
            } else if (node.tagName === 'OPTGROUP') { // 翻译 <optgroup> 的 label 属性
                transElement(node, 'label');
            } else if (["tooltipped"].includes(node.className)) { // 仅当 元素存在'tooltipped'样式 aria-label 才起效果
                transElement(node, 'aria-label', true); // 带提示的元素，类似 tooltip 效果的
            } else if (node.tagName === 'LABEL') { // 翻译 <LABEL> 的 label 属性
                if (node.hasAttribute('title')) {
                    transElement(node, 'title', true); // 翻译 浏览器 提示对话框
                }
            } else if (node.tagName === 'A') {
                if (node.hasAttribute('title')) {
                    transElement(node, 'title', true); // 翻译 浏览器 提示对话框
                }
                if (node.hasAttribute('data-hovercard-type')) {
                    return; // 不翻译
                }
            } else if (node.tagName === 'DIV') {
                if (node.hasAttribute('title')) {
                    transElement(node, 'title', true); // 翻译 浏览器 提示对话框
                }
            } else if (node.tagName === 'IMG') {
                if (node.hasAttribute('title')) {
                    transElement(node, 'title', true); // 翻译 浏览器 提示对话框
                }
            } else if (node.tagName === 'SPAN') {
                if (node.hasAttribute('title')) {
                    transElement(node, 'title', true); // 翻译 浏览器 提示对话框
                }
            } else if (node.tagName === 'LI') {
                if (node.hasAttribute('title')) {
                    transElement(node, 'title', true); // 翻译 浏览器 提示对话框
                }
            }

            let childNodes = node.childNodes;
            childNodes.forEach(traverseNode); // 遍历子节点

        } else if (node.nodeType === Node.TEXT_NODE) { // 文本节点翻译
            if (node.length <= 1000) { // 修复 许可证编辑框初始化载入内容被翻译
                transElement(node, 'data');
            }
        }
    }

    /**
     * getPage 函数：获取当前页面的类型。
     * @returns {string|boolean} 当前页面的类型，如果无法确定类型，那么返回 false。
     */
    function getPage() {

        // 站点，如 gist, developer, help 等，默认主站是 github
        const site = location.hostname === "www.yucata.de" ? "yucata" : "yucata"; // 站点
        const pathname = location.pathname; // 当前路径

        let page, t = document.body.className.match(I18N.conf.rePageClass);
        if (pathname === '/' && site === 'yucata') { // 18xx.games 首页
            page = 'homepage';
        } else {
            t = pathname.match(I18N.conf.rePagePath);
            page = t ? t[1] : false; // 取页面 key
        }

        if (!page || !I18N[lang][page]) {
            console.log(`请注意对应 page: ${page} 词库节点不存在`);
            console.log(`当前路径: ${pathname}`)
            page = false;
        }
        return page;
    }

    /**
     * transTitle 函数：翻译页面标题
     */
    function transTitle() {
        let key = document.title; // 标题文本内容
        let str = I18N[lang]['title']['static'][key] || '';
        if (str == '') {
            let res = I18N[lang]['title'].regexp || [];
            for (let [a, b] of res) {
                str = key.replace(a, b);
                if (str !== key) {
                    break;
                }
            }
        }
        if (str !== '') {
            document.title = str;
            // console.log(`【klingeling】document.title: ${document.title}`)
        }
    }

    /**
     * transTimeElement 函数：翻译时间元素文本内容。
     * @param {Element} el - 需要翻译的元素。
     */
    function transTimeElement(el) {
        let key = el.childNodes.length > 0 ? el.lastChild.textContent : el.textContent;
        let res = I18N[lang]['pubilc']['time-regexp']; // 时间正则规则

        for (let [a, b] of res) {
            let str = key.replace(a, b);
            if (str !== key) {
                el.textContent = str;
                break;
            }
        }
    }

    /**
     * watchTimeElement 函数：监视时间元素变化, 触发和调用时间元素翻译
     * @param {Element} el - 需要监视的元素。
     */
    function watchTimeElement(el) {
        const MutationObserver =
            window.MutationObserver ||
            window.WebKitMutationObserver ||
            window.MozMutationObserver;

        new MutationObserver(mutations => {
            transTimeElement(mutations[0].addedNodes[0]);
        }).observe(el, {
            childList: true
        });
    }

    /**
     * transElement 函数：翻译指定元素的文本内容或属性。
     * @param {Element} el - 需要翻译的元素。
     * @param {string} field - 需要翻译的文本内容或属性的名称。
     * @param {boolean} isAttr - 是否需要翻译属性。
     */
    function transElement(el, field, isAttr = false) {
        let text = isAttr ? el.getAttribute(field) : el[field]; // 需要翻译的文本
        let str = translateText(text); // 翻译后的文本

        // 替换翻译后的内容
        if (str) {
            if (!isAttr) {
                el[field] = str;
            } else {
                el.setAttribute(field, str);
            }
        }
    }

    /**
     * translateText 函数：翻译文本内容。
     * @param {string} text - 需要翻译的文本内容。
     * @returns {string|boolean} 翻译后的文本内容，如果没有找到对应的翻译，那么返回 false。
     */
    function translateText(text) { // 翻译

        // 内容为空, 空白字符和或数字, 不存在英文字母和符号,. 跳过
        if (!isNaN(text) || !/[a-zA-Z,.]+/.test(text)) {
            return false;
        }

        let _key = text.trim(); // 去除首尾空格的 key
        let _key_neat = _key.replace(/\xa0|[\s]+/g, ' ') // 去除多余空白字符(&nbsp; 空格 换行符)

        let str = fetchTranslatedText(_key_neat); // 翻译已知页面 (局部优先)

        if (str && str !== _key_neat) { // 已知页面翻译完成
            return text.replace(_key, str); // 替换原字符，保留首尾空白部分
        }

        if (page !== 'homepage' && !_key_neat.match(I18N.conf.keyClass) && !_key_neat.match(I18N.conf.userCompanyClass)) {
            // console.log(key);
            letters.add(_key_neat);
        }

        return false;
    }

    /**
     * fetchTranslatedText 函数：从特定页面的词库中获得翻译文本内容。
     * @param {string} key - 需要翻译的文本内容。
     * @returns {string|boolean} 翻译后的文本内容，如果没有找到对应的翻译，那么返回 false。
     */
    function fetchTranslatedText(key) {

        // 静态翻译
        let str = I18N[lang][page]['static'][key] || I18N[lang]['pubilc']['static'][key]; // 默认翻译 公共部分

        if (typeof str === 'string') {
            return str;
        }

        // 正则翻译
        if (enable_RegExp) {
            let res = (I18N[lang][page].regexp || []).concat(I18N[lang]['pubilc'].regexp || []); // 正则数组

            for (let [a, b] of res) {
                str = key.replace(a, b);
                if (str !== key) {
                    return str;
                }
            }
        }

        return false; // 没有翻译条目
    }

    /**
     * transBySelector 函数：通过 CSS 选择器找到页面上的元素，并将其文本内容替换为预定义的翻译。
     */
    function transBySelector() {
        // 获取当前页面的翻译规则，如果没有找到，那么使用公共的翻译规则
        let res = (I18N[lang][page]?.selector || []).concat(I18N[lang]['pubilc'].selector || []); // 数组

        // 如果找到了翻译规则
        if (res.length > 0) {
            // 遍历每个翻译规则
            for (let [selector, translation] of res) {
                // 使用 CSS 选择器找到对应的元素
                let element = document.querySelector(selector);
                // 如果找到了元素，那么将其文本内容替换为翻译后的文本
                if (element) {
                    element.textContent = translation;
                }
            }
        }
    }

    function init() {
        // 获取当前页面的翻译规则
        page = getPage();
        console.log(`开始page = ${page}`);

        // 翻译页面标题
        transTitle();

        if (page) {
            // 立即翻译页面
            traverseNode(document.body);
            // console.log([...letters]);
            if (letters.size !== 0 && letters.size !== letters_size) {
                // console.log(key);
                letters_size = letters.size;
                console.log([...letters]);
            }

            let attemptCount = 0;
            const MAX_ATTEMPTS = 50;  // 最多尝试 10 次
            const INTERVAL_DELAY = 100;  // 每次间隔 100ms（50次*100ms=5秒）

            const intervalId = setInterval(() => {
                attemptCount++;
                // console.log(`尝试第 ${attemptCount} 次`);

                // 执行翻译逻辑
                transTitle();
                transBySelector();

                // 如果达到最大尝试次数，清除定时器
                if (attemptCount >= MAX_ATTEMPTS) {
                    clearInterval(intervalId);
                    console.log("已达到最大尝试次数，停止检测");
                }
            }, INTERVAL_DELAY);
        }
        // 监视页面变化
        watchUpdate();
    }

    // 执行初始化
    init();
})(window, document);