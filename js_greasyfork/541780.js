// ==UserScript==
// @name         DeepSeek大屏优化
// @namespace    http://tampermonkey.net/
// @version      2.4.3
// @description  优化DeepSeek页面样式
// @author       HuSheng
// @match        https://chat.deepseek.com/**
// @exclude      https://chat.deepseek.com/sign_in
// @exclude      https://chat.deepseek.com/sign_up
// @exclude      https://chat.deepseek.com/forgot_password
// @icon         https://chat.deepseek.com/favicon.svg
// @grant        none
// @run-at       document-body
// @license       GPL-2.0-only
// @downloadURL https://update.greasyfork.org/scripts/541780/DeepSeek%E5%A4%A7%E5%B1%8F%E4%BC%98%E5%8C%96.user.js
// @updateURL https://update.greasyfork.org/scripts/541780/DeepSeek%E5%A4%A7%E5%B1%8F%E4%BC%98%E5%8C%96.meta.js
// ==/UserScript==

(function () {
    'use strict';

    // xpath
    const xpaths_css = [
        {key: '/html/body/div[1]/div/div/div[2]/div[1]/div/div[2]', value: 'display: none', sleep: 0},

        {key: '/html/body/div[1]/div/div/div[2]/div[3]/div/div/div[2]', value: 'width: 100%; max-width: 100%', sleep: 0},
        {key: '/html/body/div[1]/div/div/div[2]/div[3]/div/div[2]/div/div[2]', value: 'padding: 0', sleep: 0},
        {key: '/html/body/div[1]/div/div/div[2]/div[3]/div/div/div[2]/div[2]', value: 'width: 90%; max-width: 1200px', sleep: 0},

        {key: '/html/body/div[1]/div/div/div[2]/div[3]/div/div[2]/div/div[2]/div[2]/div[2]/div/div/div[1]', value: '--line-height: none;', sleep: 0},
        {key: '/html/body/div[1]/div/div/div[2]/div[3]/div/div[2]/div/div/div[3]/div[1]', value: 'width: 100%; max-width: 100%;', sleep: 0},
        {key: '/html/body/div[1]/div/div/div[2]/div[3]/div/div[2]/div/div[2]/div[2]/div[3]', value: 'display: none', sleep: 0},
        {key: '/html/body/div[1]/div/div/div[2]/div[3]/div/div[2]/div/div[2]/div[2]/div[2]', value: 'margin-bottom: 10px;', sleep: 0},

    ];

    // CSS
    const css_css = [
    ];


    function delay(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    function applyCSSStyles(element, cssText) {
        const styles = cssText.split(';').filter(style => style.trim() !== '');

        styles.forEach(style => {
            const [property, value] = style.split(':').map(s => s.trim());
            if (property && value) {
                // 处理CSS自定义属性
                if (property.startsWith('--')) {
                    element.style.setProperty(property, value);
                } else {
                    // 转换CSS属性名到JS格式（如background-color -> backgroundColor）
                    const jsProperty = property.replace(/-([a-z])/g, (g) => g[1].toUpperCase());
                    element.style[jsProperty] = value;
                }
            }
        });
    }

    // 修改元素样式
    async function modifyElementStyles() {
        // xpath方式
        for (const xpath of xpaths_css) {
            if (xpath.sleep > 0) {
                await delay(xpath.sleep);
            }

            try {
                const element = document.evaluate(
                    xpath.key,
                    document,
                    null,
                    XPathResult.FIRST_ORDERED_NODE_TYPE,
                    null
                ).singleNodeValue;

                if (element) {
                    applyCSSStyles(element, xpath.value);
                } else if (xpath.key) {
                    console.error(`未找到XPath目标元素：${xpath.key}`);
                }
            } catch (e) {
                console.error(`XPath查询错误：${xpath.key}`, e);
            }
        }

        // CSS方式
        for (const css of css_css) {
            if (css.sleep > 0) {
                await delay(css.sleep);
            }

            try {
                const elements = document.querySelectorAll(css.key);
                if (elements.length > 0) {
                    elements.forEach(element => {
                        applyCSSStyles(element, css.value);
                    });
                } else if (css.key) {
                    console.error(`未找到CSS目标元素：${css.key}`);
                }
            } catch (e) {
                console.error(`CSS查询错误：${css.key}`, e);
            }
        }
    }

    // 监听URL变化
    function observeUrlChanges() {
        let lastUrl = location.href;

        const urlChangeHandler = function() {
            if (location.href !== lastUrl) {
                lastUrl = location.href;
                modifyElementStyles();
            }
        };

        window.addEventListener('popstate', urlChangeHandler);
        window.addEventListener('hashchange', urlChangeHandler);

        const originalPushState = history.pushState;
        const originalReplaceState = history.replaceState;

        history.pushState = function() {
            originalPushState.apply(this, arguments);
            urlChangeHandler();
        };

        history.replaceState = function() {
            originalReplaceState.apply(this, arguments);
            urlChangeHandler();
        };
    }

    // 页面加载时执行
    function init() {
        modifyElementStyles();
        observeUrlChanges();

        const observer = new MutationObserver(function(mutations) {
            const shouldUpdate = mutations.some(mutation => {
                return true;
            });

            if (shouldUpdate) {
                modifyElementStyles();
            }
        });

        observer.observe(document.body, {
            childList: true,
            subtree: true
        });
    }

    if (document.readyState === 'complete' || document.readyState === 'interactive') {
        setTimeout(init, 0);
    } else {
        document.addEventListener('DOMContentLoaded', init);
        window.addEventListener('load', init);
    }
})();