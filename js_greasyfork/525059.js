// ==UserScript==
// @name         超星学习通Tab键焦点切换
// @namespace    http://tampermonkey.net/
// @version      1.3
// @description  在ueditor编辑器中按Tab键切换焦点到下一个输入框
// @author       TeacherLi07
// @match        *://mooc1.chaoxing.com/*
// @grant        GM_addStyle
// @grant        GM_getResourceText
// @grant        GM_addElement
// @run-at       document-end
// @license       MIT
// @downloadURL https://update.greasyfork.org/scripts/525059/%E8%B6%85%E6%98%9F%E5%AD%A6%E4%B9%A0%E9%80%9ATab%E9%94%AE%E7%84%A6%E7%82%B9%E5%88%87%E6%8D%A2.user.js
// @updateURL https://update.greasyfork.org/scripts/525059/%E8%B6%85%E6%98%9F%E5%AD%A6%E4%B9%A0%E9%80%9ATab%E9%94%AE%E7%84%A6%E7%82%B9%E5%88%87%E6%8D%A2.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 配置参数
    const IFRAME_SELECTOR = 'iframe[id^="ueditor_"]';
    const EDITOR_BODY_SELECTOR = 'body.view';

    // 主逻辑
    function init() {
        setupMutationObserver();
        processExistingIframes();
    }

    // 处理已存在的iframe
    function processExistingIframes() {
        document.querySelectorAll(IFRAME_SELECTOR).forEach(iframe => {
            setupIframeHandler(iframe);
        });
    }

    // 设置DOM变化观察者
    function setupMutationObserver() {
        const observer = new MutationObserver(mutations => {
            mutations.forEach(mutation => {
                mutation.addedNodes.forEach(node => {
                    if (node.tagName === 'IFRAME' && node.matches(IFRAME_SELECTOR)) {
                        setupIframeHandler(node);
                    }
                });
            });
        });

        observer.observe(document.body, {
            childList: true,
            subtree: true
        });
    }

    // 设置iframe处理器
    function setupIframeHandler(iframe) {
        if (!iframe.contentDocument || !iframe.contentWindow) return;

        const onLoad = () => {
            try {
                const editorBody = iframe.contentDocument.querySelector(EDITOR_BODY_SELECTOR);
                if (editorBody) {
                    editorBody.addEventListener('keydown', handleTabKey);
                    editorBody.setAttribute('tabindex', '-1'); // 使元素可聚焦
                }
            } catch (e) {
                console.warn('无法访问iframe内容:', e);
            }
            iframe.removeEventListener('load', onLoad);
        };

        if (iframe.contentDocument.readyState === 'complete') {
            onLoad();
        } else {
            iframe.addEventListener('load', onLoad);
        }
    }

    // Tab键处理函数
    function handleTabKey(event) {
        if (event.key === 'Tab' && !event.ctrlKey && !event.altKey && !event.metaKey) {
            event.preventDefault();
            event.stopPropagation();

            const allEditors = Array.from(document.querySelectorAll(IFRAME_SELECTOR))
                .map(iframe => ({
                    iframe,
                    editor: iframe.contentDocument?.querySelector(EDITOR_BODY_SELECTOR)
                }))
                .filter(item => item.editor);

            const currentIndex = allEditors.findIndex(item =>
                item.editor === event.target ||
                item.editor.contains(event.target)
            );

            if (currentIndex === -1) return;

            const nextIndex = event.shiftKey ?
                (currentIndex - 1 + allEditors.length) % allEditors.length :
                (currentIndex + 1) % allEditors.length;

            const nextEditor = allEditors[nextIndex].editor;
            nextEditor.focus({ preventScroll: true });

            // 保持光标在末尾
            const range = document.createRange();
            const sel = window.getSelection();
            range.selectNodeContents(nextEditor);
            range.collapse(false);
            sel.removeAllRanges();
            sel.addRange(range);
        }
    }

    // 初始化
    setTimeout(init, 1000); // 等待页面稳定

})();