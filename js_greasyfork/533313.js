// ==UserScript==
// @name         语雀渲染HTML附件
// @namespace    http://tampermonkey.net/
// @version      1.2
// @description  拦截 /api/attachments/*/content 接口返回的 JSON 数据，解析并渲染 HTML，方便查看文本的真实效果
// @author       SayHeya
// @match        https://www.yuque.com/raw?filekey=yuque*
// @grant        none
// @run-at       document-start
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/533313/%E8%AF%AD%E9%9B%80%E6%B8%B2%E6%9F%93HTML%E9%99%84%E4%BB%B6.user.js
// @updateURL https://update.greasyfork.org/scripts/533313/%E8%AF%AD%E9%9B%80%E6%B8%B2%E6%9F%93HTML%E9%99%84%E4%BB%B6.meta.js
// ==/UserScript==

(function () {
    'use strict';

    // 定义标题前缀常量
    const TITLE_PREFIX = '[渲染✅]';

    /** 判断是否是目标接口 */
    const isTargetURL = (url) =>
        typeof url === 'string' &&
        url.includes('/api/attachments/') &&
        url.includes('/content');

    /** 判断字符串是否是 HTML 内容 */
    function isLikelyHTML(str) {
        return typeof str === 'string' && /<[^>]+>/.test(str);
    }

    /** 设置页面标题前缀 */
    function setCustomTitle(prefix) {
        const observer = new MutationObserver(() => {
            if (!document.title.startsWith(prefix)) {
                document.title = prefix + ' ' + document.title.replace(new RegExp(`^${prefix}\\s*`), '');
            }
        });

        observer.observe(document.querySelector('title') || document.head, {
            childList: true,
            subtree: true,
            characterData: true
        });

        // 初始设置一次
        if (document.title) {
            document.title = prefix + ' ' + document.title.replace(new RegExp(`^${prefix}\\s*`), '');
        } else {
            const titleTag = document.createElement('title');
            titleTag.textContent = prefix;
            document.head.appendChild(titleTag);
        }
    }

    /** 渲染 HTML 内容到页面 */
    function renderHTML(htmlContent) {
        // 设置标题前缀
        setCustomTitle(TITLE_PREFIX);

        // 清空页面和样式
        document.head.innerHTML = '';
        document.body.innerHTML = '';
        document.documentElement.style.padding = '0';
        document.documentElement.style.margin = '0';
        document.documentElement.style.overflow = 'auto';
        document.body.style.padding = '0';
        document.body.style.margin = '0';
        document.body.style.overflow = 'auto';
        document.body.style.maxWidth = '100vw';

        // 添加基础样式
        const style = document.createElement('style');
        style.textContent = `
            * { box-sizing: border-box; }
            html, body {
                margin: 0;
                padding: 0;
                width: 100%;
                height: 100%;
                overflow: auto;
                background: #fff;
            }
            #yuque-rendered-container {
                padding: 40px;
                max-width: 100%;
                font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
            }
        `;
        document.head.appendChild(style);

        // 插入 HTML 内容
        const container = document.createElement('div');
        container.id = 'yuque-rendered-container';
        container.innerHTML = htmlContent;

        document.body.appendChild(container);
    }

    /** 尝试解析并渲染接口内容 */
    function tryRenderContent(data) {
        const content = data?.data?.content;
        if (isLikelyHTML(content)) {
            console.log('[✅ 语雀 HTML 内容捕获]');
            renderHTML(content);
        } else {
            console.log('[⛔ 内容不是 HTML]', content);
        }
    }

    /** 拦截 fetch 请求 */
    function hookFetch() {
        const originalFetch = window.fetch;
        window.fetch = async function (...args) {
            const [url] = args;
            const response = await originalFetch.apply(this, args);

            if (isTargetURL(url)) {
                const cloned = response.clone();
                cloned.json().then(data => {
                    console.log('[🎯 拦截 fetch]', url, data);
                    tryRenderContent(data);
                }).catch(e => console.warn('❌ fetch JSON 解析失败:', e));
            }

            return response;
        };
    }

    /** 拦截 XMLHttpRequest 请求 */
    function hookXHR() {
        const originalOpen = XMLHttpRequest.prototype.open;
        XMLHttpRequest.prototype.open = function (method, url, ...rest) {
            this._intercept_url = url;
            return originalOpen.call(this, method, url, ...rest);
        };

        const originalSend = XMLHttpRequest.prototype.send;
        XMLHttpRequest.prototype.send = function (...args) {
            this.addEventListener('load', function () {
                if (isTargetURL(this._intercept_url)) {
                    try {
                        const data = JSON.parse(this.responseText);
                        console.log('[🎯 拦截 XHR]', this._intercept_url, data);
                        tryRenderContent(data);
                    } catch (e) {
                        console.warn('❌ XHR JSON 解析失败:', e);
                    }
                }
            });
            return originalSend.apply(this, args);
        };
    }

    // 启动拦截器
    hookFetch();
    hookXHR();
})();