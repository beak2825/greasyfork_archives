// ==UserScript==
// @name         解除网页复制限制
// @namespace    http://tampermonkey.net/
// @version      1.1.4
// @description  解除常见的右键菜单、文本选中和复制限制，自动运行于所有网站。
// @author       magician lib
// @match        *://*/*
// @grant        none
// @run-at       document-idle
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/543095/%E8%A7%A3%E9%99%A4%E7%BD%91%E9%A1%B5%E5%A4%8D%E5%88%B6%E9%99%90%E5%88%B6.user.js
// @updateURL https://update.greasyfork.org/scripts/543095/%E8%A7%A3%E9%99%A4%E7%BD%91%E9%A1%B5%E5%A4%8D%E5%88%B6%E9%99%90%E5%88%B6.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 核心解除函数
    function unlock() {
        // 1. 解除常见的内联事件禁用
        document.oncontextmenu = null;
        document.onselectstart = null;
        document.ondragstart = null;
        if (document.body) {
            document.body.oncontextmenu = null;
            document.body.onselectstart = null;
            document.body.ondragstart = null;

            // 2. 移除CSS选中限制
            ['userSelect', 'webkitUserSelect', 'mozUserSelect', 'msUserSelect'].forEach(prop => {
                document.body.style[prop] = 'auto';
            });
        }

        // 3. 阻止页面监听复制、剪切、选中事件的脚本（捕获阶段）
        ['copy', 'cut', 'selectstart', 'contextmenu'].forEach(evt => {
            // 先移除所有已绑定的同类型监听器（不一定能完全移除，但尝试）
            document.removeEventListener(evt, stopPropagationHandler, true);
            // 重新绑定阻止事件冒泡，防止页面自己阻止
            document.addEventListener(evt, stopPropagationHandler, true);
        });
    }

    // 用于阻止事件冒泡和默认行为的处理函数
    function stopPropagationHandler(e) {
        e.stopImmediatePropagation();
        // 允许复制、右键菜单等，所以不调用 preventDefault
    }

    // 初次延迟执行，等待页面资源加载完成
    setTimeout(() => {
        unlock();
        console.log('✅ 解除复制限制');
    }, 1000);

    // MutationObserver 监听DOM变化，动态解除限制
    const observer = new MutationObserver(mutations => {
        unlock();
    });
    observer.observe(document, { childList: true, subtree: true });

})();
