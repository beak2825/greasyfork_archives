// ==UserScript==
// @name        Faster Bing
// @name:en     Faster Bing
// @namespace   CoderJiang
// @version     1.1.5
// @description 将 Bing 的重定向 url 转换为真实 url
// @description:en  Convert Bing's redirect url to a real url
// @author      CoderJiang
// @match       *://*.bing.com/*
// @icon        https://cdn.coderjiang.com/pic-go/2024/faster-bing-logo-v1.png!pure
// @license     MIT
// @grant       GM_getValue
// @grant       GM_setValue
// @grant       GM_registerMenuCommand
// @grant       GM_unregisterMenuCommand
// @note        2026-01-21 v1.1.5
//                  - 功能：统计并在菜单中显示累计优化的重定向链接数量，提升用户体验。
// @note        2024-12-26 v1.1.4
//                  - 功能：修复一些动态创建的链接（例如第一条人工智能生成的解答）无法解析的问题，同时解决在 v1.1.2 中无法解析的问题
// @note        2024-07-19 v1.1.3
//                  - 功能：对于 e.so.com/search/eclk 的链接，需要再次解析（示例：Firefox 访问 https://cn.bing.com/search?q=ui%E8%AE%BE%E8%AE%A1%E7%BD%91%E7%AB%99&first=1&FORM=PERE 时）
// @note        2024-07-18 v1.1.2
//                  - 修复：修复在 Edge 浏览器中第二次之后搜索无法解析的问题
//                  - 功能：提供对 aclick 的中转链接解析支持
// @note        2024-06-24 v1.1.1
//                  - 修复：修复 Base64 解码问题，提升链接解析准确性。
//                  - 优化：针对脚本运行两遍的问题，限制脚本在主页面上运行，无需在 iframes 再运行一次。
// @note        2024-06-24 v1.1.0
//                  - 优化：识别并处理站内相对 URL，确保这些 URL 被正确解析并转换为绝对形式。
//                  - 优化：添加 LOGO
// @noframes
// @downloadURL https://update.greasyfork.org/scripts/490999/Faster%20Bing.user.js
// @updateURL https://update.greasyfork.org/scripts/490999/Faster%20Bing.meta.js
// ==/UserScript==

(function () {
    'use strict';

    const Config = {
        /**
         * 日志配置
         * log.enable 是否打印日志
         * log.success.icon 成功的图标
         * log.fail.icon 失败的图标
         * log.success.originalLink.maxLength 原始链接最大长度，如果为-1则不截断
         * log.success.originalLink.frontChars 原始链接前面保留的字符数
         * log.success.realLink.maxLength 真实链接最大长度，如果为-1则不截断
         * log.success.realLink.frontChars 真实链接前面保留的字符数
         * log.fail.originalLink.maxLength 原始链接最大长度，如果为-1则不截断
         * log.fail.originalLink.frontChars 原始链接前面保留的字符数
         * log.fail.realLink.display 失败时不显示真实链接，用这个字符串代替
         */
        log: {
            enable: true,
            success: {
                icon: '✅',
                originalLink: {
                    maxLength: 30,
                    frontChars: 10,
                },
                realLink: {
                    maxLength: 30,
                    frontChars: 20,
                }
            },
            fail: {
                icon: '❎',
                originalLink: {
                    maxLength: -1,
                    frontChars: 20,
                },
                realLink: {
                    display: '------',
                }
            }
        }
    }
    const CONSTANTS = {
        STORAGE_KEYS: {
            totalSuccessConverted: 'Converted-Bing',
        }
    };
    const SYSTEM = {
        MENU_ID: {
            counter: null,
        },
    }

    const logo = `
   ________)                  ______
  (, /                       (, /    ) ,
    /___, _   _  _/_  _  __    /---(    __   _
 ) /     (_(_/_)_(___(/_/ (_) / ____)_(_/ (_(_/_
(_/                        (_/ (           .-/
                                          (_/`;

    /**
     * =============================
     * 存储功能
     * =============================
     */

    /**
     * 获取总共成功转换的链接数
     * @returns {number|number}
     */
    function getTotalSuccessConverted() {
        return Number(GM_getValue(CONSTANTS.STORAGE_KEYS.totalSuccessConverted, 0)) || 0;
    }

    /**
     * 添加总共成功转换的链接数
     * @param delta 增加的数量
     * @returns {*|number}
     */
    function addTotalSuccessConverted(delta) {
        const add = Number(delta) || 0;
        if (add <= 0) return getTotalSuccessConverted();
        const next = getTotalSuccessConverted() + add;
        GM_setValue(CONSTANTS.STORAGE_KEYS.totalSuccessConverted, next);
        // 刷新菜单标题
        renderMenu()
        return next;
    }

    /**
     * =============================
     * 菜单功能
     * =============================
     */

    /**
     * 渲染菜单
     */
    function renderMenu() {
        const total = getTotalSuccessConverted();
        const title = `🚀 累计优化 ${total} 个重定向链接`;

        if (SYSTEM.MENU_ID.counter !== null) {
            try {
                GM_unregisterMenuCommand(SYSTEM.MENU_ID.counter);
            } catch (e) {
                // 忽略：某些情况下可能无法注销
            }
            SYSTEM.MENU_ID.counter = null;
        }

        SYSTEM.MENU_ID.counter = GM_registerMenuCommand(title, () => {
            // 无操作
        });
    }

    /**
     * =============================
     * 主要功能函数
     * =============================
     */

    /**
     * 获取url中的参数
     *
     * @param url   url
     * @param key   参数名
     * @returns {string}    参数值，如果没有则返回null
     */
    function getUrlParameter(url, key) {
        const parsedUrl = new URL(url);
        const queryParams = parsedUrl.searchParams;
        return queryParams.get(key);
    }

    /**
     * 判断是否是bing的重定向url
     *
     * @param url   url
     * @returns {{valid: boolean, key: (string|null)}}   是否是bing的重定向url
     */
    function checkBingRedirectUrl(url) {
        const patterns = [
            // eg: https://www.bing.com/ck/a...
            {pattern: /^https?:\/\/(.*\.)?bing\.com\/(ck\/a|aclick)/, key: 'u'},
            // eg: https://e.so.com/search/eclk
            {pattern: /^https?:\/\/e\.so\.com\/search\/eclk/, key: 'aurl'},
        ];
        for (const {pattern, key} of patterns) {
            if (pattern.test(url)) {
                return {valid: true, key: key};
            }
        }
        return {valid: false, key: void 0};
    }

    /**
     * 判断url是否有效
     * @param urlString url字符串
     * @returns {boolean}   是否是有效的url
     */
    function isValidUrl(urlString) {
        try {
            new URL(urlString);
            return true; // 没有抛出异常，URL有效
        } catch (error) {
            return false; // 抛出异常，URL无效
        }
    }

    /**
     * 将重定向url转换为真实url
     * @param url   Bing的重定向url，必须包含 key 指定的链接参数(eg: u)
     * @param key   参数名
     * @returns {string|null}   真实url，转换失败则返回null
     */
    function redirect2RealUrl(url, key) {
        let urlBase64 = getUrlParameter(url, key)
        urlBase64 = urlBase64.replace(/^a1/, '');
        let realUrl = ''
        try {
            // 还原Base64 URL编码中的特殊字符以便解码
            realUrl = atob(urlBase64.replace(/_/g, '/').replace(/-/g, '+'));
        } catch (error) {
            return null;
        }
        // 解码后的 URL 可能包含特殊字符，例如 http%3a%2f%2fpuaai.net
        realUrl = decodeURIComponent(realUrl);
        // 检查 realUrl 是否是有效的相对路径（以 '/' 开头）
        if (realUrl.startsWith('/')) {
            // 获取当前协议和域
            let currentUrl = window.location.origin; // e.g., "https://www.bing.com"

            // 将相对路径追加到当前 URL
            realUrl = currentUrl + realUrl;
        }

        if (!isValidUrl(realUrl)) {
            return null;
        }
        return realUrl;
    }

    /**
     * 找到所有的链接并转换为真实url
     * @returns {{failedUrls: *[], processedUrls: *[]}}
     */
    function convertBingRedirectUrls() {
        const failedUrls = [];
        const processedUrls = [];
        const links = document.querySelectorAll("a");

        for (const link of links) {
            const {realUrl, originalUrl} = convertBingRedirectUrl(link);
            if (realUrl) {
                processedUrls.push({
                    realUrl,
                    originalUrl
                });
            } else {
                failedUrls.push(originalUrl);
            }
        }
        // 更新总共成功转换的链接数
        addTotalSuccessConverted(processedUrls.length);
        return {
            processedUrls,
            failedUrls
        };
    }

    /**
     * 将bing的重定向url转换为真实url
     * @param aElement  a标签元素
     * @returns {{realUrl: null, originalUrl: null}}
     */
    function convertBingRedirectUrl(aElement) {
        // v1.1.3: 对于 e.so.com/search/eclk 的链接，需要再次解析，因此使用递归解析
        const resolve = (href) => {
            const checkResult = checkBingRedirectUrl(href)
            if (!checkResult.valid) return href
            const realUrl = redirect2RealUrl(href, checkResult.key);
            return realUrl ? resolve(realUrl) : null;
        }
        const originalUrl = aElement.href;
        const checkResult = checkBingRedirectUrl(originalUrl)
        let realUrl = null;
        if (checkResult.valid) {
            realUrl = resolve(originalUrl);
            if (realUrl) {
                aElement.href = realUrl;
            }
        }
        return {realUrl, originalUrl}
    }

    /**
     * 可视化结果
     *
     * @param result    结果
     */
    function log(result) {
        function middleTruncate(str, maxLength, frontChars) {
            if (maxLength < 0) return str;
            if (str.length > maxLength) {
                const backChars = maxLength - frontChars - 3; // 确保总长度不超过maxLength
                return str.substring(0, frontChars) + '...' + str.substring(str.length - backChars);
            } else {
                return str;
            }
        }

        const overview = {
            "Success": result.processedUrls.length,
            "Failed": result.failedUrls.length,
        }
        const details = [];
        const successSample = {
            "Status": Config.log.success.icon,
            "Original": "",
            "Real": "",
        }
        const failedSample = {
            "Status": Config.log.fail.icon,
            "Original": "",
            "Real": Config.log.fail.realLink.display,
        }
        for (const processedUrl of result.processedUrls) {
            const success = {...successSample};
            success.Original = middleTruncate(
                processedUrl.originalUrl,
                Config.log.success.originalLink.maxLength,
                Config.log.success.originalLink.frontChars);
            success.Real = middleTruncate(
                processedUrl.realUrl,
                Config.log.success.realLink.maxLength,
                Config.log.success.realLink.frontChars);
            details.push(success);
        }
        for (const failedUrl of result.failedUrls) {
            const failed = {...failedSample};
            failed.Original = middleTruncate(failedUrl,
                Config.log.fail.originalLink.maxLength,
                Config.log.fail.originalLink.frontChars);
            details.push(failed);
        }

        console.table(overview);
        console.table(details);
    }

    /**
     * =============================
     * 脚本入口
     * =============================
     */

    console.log(logo);

    renderMenu();

    const result = convertBingRedirectUrls();
    if (Config.log.enable) {
        log(result)
    }

    // v1.1.3: 修复一些动态创建的链接无法解析的问题，同时解决在 v1.1.2 中无法解析的问题
    new MutationObserver((mutationsList) => {
        for (const mutation of mutationsList) {
            // 检测到新的 a 标签被添加
            if (mutation.type === 'childList') {
                mutation.addedNodes.forEach((node) => {
                    if (node.nodeType === 1) { // 元素节点
                        // 如果是 a 标签
                        if (node.tagName === 'A') {
                            convertBingRedirectUrl(node);
                        }
                        // 如果子节点中包含 a 标签
                        node.querySelectorAll?.('a').forEach((a) => {
                            convertBingRedirectUrl(a);
                        });
                    }
                });
            }
            // 检测到 a 标签的 href 属性被修改
            if (mutation.type === 'attributes' && mutation.attributeName === 'href') {
                const target = mutation.target;
                if (target.tagName === 'A') {
                    convertBingRedirectUrl(target);
                }
            }
        }
    }).observe(document.body, {
        childList: true,     // 监听子节点的添加或删除
        subtree: true,       // 监听所有后代节点
        attributes: true,    // 监听属性变化
        attributeFilter: ['href'] // 仅监听 href 属性的变化
    });

})();