// ==UserScript==
// @name         Bilibili Copy Cleaner 专栏复制免后缀
// @namespace    https://space.bilibili.com/13723713
// @version      1.0.2
// @description  移除 Bilibili 专栏复制时自动添加的多余信息，如作者、链接和出处。
// @author       朝潮
// @match        *://www.bilibili.com/read/*
// @match        *://www.bilibili.com/opus/*
// @grant        none
// @run-at       document-end
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/513047/Bilibili%20Copy%20Cleaner%20%E4%B8%93%E6%A0%8F%E5%A4%8D%E5%88%B6%E5%85%8D%E5%90%8E%E7%BC%80.user.js
// @updateURL https://update.greasyfork.org/scripts/513047/Bilibili%20Copy%20Cleaner%20%E4%B8%93%E6%A0%8F%E5%A4%8D%E5%88%B6%E5%85%8D%E5%90%8E%E7%BC%80.meta.js
// ==/UserScript==

(function() {
    'use strict';

    console.log('Bilibili Copy Cleaner 脚本已启动');

    /**
     * 向页面注入一个脚本，以便在页面上下文中监听并处理 copy 事件。
     */
    function injectScript() {
        const script = document.createElement('script');
        script.textContent = 
            `(function() {
                'use strict';

                console.log('Injected Copy Cleaner 脚本已启动');

                /**
                 * 处理 copy 事件，移除选中文本中的多余后缀信息。
                 * @param {ClipboardEvent} e - 复制事件对象
                 */
                function handleCopyEvent(e) {
                    console.log('捕获到 copy 事件（注入脚本）');

                    // 获取当前选中的文本
                    let selectedText = window.getSelection().toString();
                    console.log('原始选中的文本:', selectedText);

                    // 定义用于移除后缀的正则表达式
                    const suffixPattern = /作者：[\\s\\S]*?出处：bilibili\\s*$/;

                    // 使用正则表达式移除后缀
                    const cleanedText = selectedText.replace(suffixPattern, '');
                    console.log('清理后的文本:', cleanedText);

                    // 阻止默认的复制行为和事件传播
                    e.preventDefault();
                    e.stopImmediatePropagation();

                    // 将清理后的文本设置到剪贴板
                    if (e.clipboardData) {
                        e.clipboardData.setData('text/plain', cleanedText);
                        console.log('通过 e.clipboardData 更新剪贴板');
                    } else if (window.clipboardData) { // 兼容旧版 IE
                        window.clipboardData.setData('Text', cleanedText);
                        console.log('通过 window.clipboardData 更新剪贴板');
                    } else {
                        console.warn('无法访问剪贴板数据');
                    }
                }

                // 添加 copy 事件监听器，使用捕获阶段优先处理
                document.addEventListener('copy', handleCopyEvent, true);

                /**
                 * 使用 MutationObserver 监控页面内容的变化，移除动态添加的 copy 事件监听器或属性。
                 */
                const observer = new MutationObserver((mutations) => {
                    mutations.forEach((mutation) => {
                        mutation.addedNodes.forEach((node) => {
                            if (node.nodeType === Node.ELEMENT_NODE) {
                                // 选择可能包含 copy 限制的元素
                                node.querySelectorAll('.article-holder, .content-container, .qmd-editor, .ql-editor').forEach(element => {
                                    if (element.oncopy) {
                                        element.oncopy = null;
                                        console.log('移除动态添加元素的 oncopy 属性:', element);
                                    }
                                    // 移除可能存在的 copy 事件监听器
                                    element.removeEventListener('copy', null);
                                });
                            }
                        });
                    });
                });

                // 开始观察整个文档的子节点和子树变化
                observer.observe(document.body, { childList: true, subtree: true });

                /**
                 * 初始移除页面加载时可能存在的复制限制。
                 */
                document.querySelectorAll('.article-holder, .content-container, .qmd-editor, .ql-editor').forEach(element => {
                    // 解除用户选择限制，确保文本可被选中和复制
                    element.style.userSelect = 'text';
                    element.style.webkitUserSelect = 'text';
                    element.style.msUserSelect = 'text';
                    element.style.mozUserSelect = 'text';

                    if (element.oncopy) {
                        element.oncopy = null;
                        console.log('移除初始元素的 oncopy 属性:', element);
                    }

                    // 移除可能存在的 copy 事件监听器
                    element.removeEventListener('copy', null);
                });
            })();`;
        document.body.appendChild(script);
    }

    // 注入脚本到页面
    injectScript();

})();
