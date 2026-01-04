// ==UserScript==
// @name         解除淘宝店铺限制
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  隐藏指定的 popup-content 元素，结合 CSS 和 JavaScript 方法
// @author       mofasi666666
// @match        *://*.taobao.com/*
// @grant        none
// @run-at       document-idle
// @downloadURL https://update.greasyfork.org/scripts/522060/%E8%A7%A3%E9%99%A4%E6%B7%98%E5%AE%9D%E5%BA%97%E9%93%BA%E9%99%90%E5%88%B6.user.js
// @updateURL https://update.greasyfork.org/scripts/522060/%E8%A7%A3%E9%99%A4%E6%B7%98%E5%AE%9D%E5%BA%97%E9%93%BA%E9%99%90%E5%88%B6.meta.js
// ==/UserScript==

(function() {
    'use strict';
    console.log("[HidePopup] 脚本已启动");

    /**
     * 注入自定义 CSS 以隐藏所有具有 .popup-content 类的元素
     */
    function injectCSS() {
        const css = `
            .popup-content {
                display: none !important;
            }
        `;
        const style = document.createElement('style');
        style.type = 'text/css';
        style.textContent = css;
        document.head.appendChild(style);
        console.log("[HidePopup] 自定义 CSS 已注入");
    }

    /**
     * 隐藏或移除目标元素
     * @param {Document} doc - 要搜索的文档对象
     */
    function hideOrRemovePopupContent(doc = document) {
        const elements = doc.querySelectorAll('div.popup-content');
        if (elements.length > 0) {
            console.log(`[HidePopup] 找到 ${elements.length} 个 .popup-content 元素，正在隐藏/移除它们`);
            elements.forEach(el => {
                // 方法1：隐藏元素
                el.style.display = 'none';

                // 方法2：移除元素（根据需求选择一种）
                // el.remove();
                // console.log("[HidePopup] 移除了一个 .popup-content 元素");
            });
        }
    }

    /**
     * 设置 MutationObserver 以监控 DOM 变化
     */
    function setupMutationObserver() {
        const observer = new MutationObserver((mutations) => {
            mutations.forEach(mutation => {
                if (mutation.addedNodes.length > 0) {
                    hideOrRemovePopupContent();
                }
            });
        });

        observer.observe(document.body, { childList: true, subtree: true });
        console.log("[HidePopup] MutationObserver 已启动，正在监控 DOM 变化");
    }

    /**
     * 设置定时器作为备用方案，定期检查并隐藏目标元素
     */
    function setupInterval() {
        setInterval(() => {
            hideOrRemovePopupContent();
        }, 2000); // 每2秒检查一次
        console.log("[HidePopup] 定时器已设置，每2秒检查一次 .popup-content 元素");
    }

    /**
     * 处理 iframe 内的内容（如果存在）
     */
    function handleIframes() {
        const iframes = document.querySelectorAll('iframe');
        iframes.forEach(iframe => {
            try {
                // 确保 iframe 同源
                const iframeDoc = iframe.contentDocument || iframe.contentWindow.document;
                if (iframeDoc) {
                    hideOrRemovePopupContent(iframeDoc);

                    // 在 iframe 内设置 MutationObserver
                    const iframeObserver = new MutationObserver((mutations) => {
                        mutations.forEach(mutation => {
                            if (mutation.addedNodes.length > 0) {
                                hideOrRemovePopupContent(iframeDoc);
                            }
                        });
                    });

                    iframeObserver.observe(iframeDoc.body, { childList: true, subtree: true });
                    console.log("[HidePopup] 已设置 iframe 内的 MutationObserver");
                }
            } catch (e) {
                console.warn("[HidePopup] 无法访问 iframe 内容（可能是跨域）：", e);
            }
        });

        // 监控未来添加的 iframe
        const iframeMutationObserver = new MutationObserver((mutations) => {
            mutations.forEach(mutation => {
                mutation.addedNodes.forEach(node => {
                    if (node.tagName === 'IFRAME') {
                        node.addEventListener('load', () => {
                            try {
                                const iframeDoc = node.contentDocument || node.contentWindow.document;
                                if (iframeDoc) {
                                    hideOrRemovePopupContent(iframeDoc);

                                    const newIframeObserver = new MutationObserver((mutations) => {
                                        mutations.forEach(mutation => {
                                            if (mutation.addedNodes.length > 0) {
                                                hideOrRemovePopupContent(iframeDoc);
                                            }
                                        });
                                    });

                                    newIframeObserver.observe(iframeDoc.body, { childList: true, subtree: true });
                                    console.log("[HidePopup] 已处理新添加的 iframe");
                                }
                            } catch (e) {
                                console.warn("[HidePopup] 无法访问新 iframe 内容（可能是跨域）：", e);
                            }
                        });
                    }
                });
            });
        });

        iframeMutationObserver.observe(document.body, { childList: true, subtree: true });
        console.log("[HidePopup] iframe MutationObserver 已启动，正在监控 iframe 的添加");
    }

    /**
     * 主执行函数
     */
    function main() {
        injectCSS();
        hideOrRemovePopupContent();
        setupMutationObserver();
        setupInterval();
        handleIframes();
    }

    // 执行主函数
    main();

})();
