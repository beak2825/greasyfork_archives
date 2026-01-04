// ==UserScript==
// @name         Chaoxing Mouseout Force Clean
// @namespace    http://tampermonkey.net/
// @version      2.2
// @license      Apache
// @description  超星允许鼠标移出脚本
// @author       Yorge-M
// @match        *://*.mooc1.chaoxing.com/mycourse/*
// @match        *://mooc1.chaoxing.com/mycourse/*
// @match        *://*.mooc1-1.chaoxing.com/mycourse/*
// @match        *://mooc1-1.chaoxing.com/mycourse/*
// @grant        unsafeWindow
// @run-at       document-start
// @unwrap
// @downloadURL https://update.greasyfork.org/scripts/533148/Chaoxing%20Mouseout%20Force%20Clean.user.js
// @updateURL https://update.greasyfork.org/scripts/533148/Chaoxing%20Mouseout%20Force%20Clean.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 1. 暴力重写关键API（防事件系统检测）
    const nativeAdd = EventTarget.prototype.addEventListener;
    EventTarget.prototype.addEventListener = function(type) {
        if (typeof type === 'string' && /mouseout/i.test(type)) return;
        return nativeAdd.apply(this, arguments);
    };

    // 2. 创建隐藏的MutationObserver（处理动态内容）
    const observer = new MutationObserver(mutations => {
        mutations.forEach(mut => {
            mut.addedNodes.forEach(node => {
                if (node.nodeType === 1) node.onmouseout = null;
            });
        });
    });

    // 3. 启动多层清理
    const nuclearClean = () => {
        // 第一层：即时清理
        document.onmouseout = null;

        // 第二层：全量DOM扫描（改用更快的getElementsByTagName）
        const all = document.getElementsByTagName('*');
        for (let i = 0, el; el = all[i]; i++) {
            el.onmouseout = null;
            if (el._events) delete el._events.mouseout; // 处理Backbone等框架
        }

        // 第三层：特殊处理超星的React事件系统
        if (unsafeWindow.React) {
            document.querySelectorAll('[data-reactroot]').forEach(el => {
                Object.keys(el).forEach(key => {
                    if (/reactEvents/i.test(key)) delete el[key].onMouseOut;
                });
            });
        }

        console.log('Mouseout清理完成');
    };

    // 4. 执行策略
    window.addEventListener('load', () => {
        nuclearClean();
        observer.observe(document, {
            childList: true,
            subtree: true,
            attributes: false
        });

        // 5秒后关闭Observer避免性能影响
        setTimeout(() => observer.disconnect(), 5000);
    }, { once: true });
})();