// ==UserScript==
// @name         移除SpankBang年龄验证(Remove SpankBang Age Verification Modal Instantly)
// @namespace    http://tampermonkey.net/
// @version      1.2
// @description  Instantly removes the age verification modal on SpankBang.com with no flash
// @author       You
// @match        *://*.spankbang.com/*
// @grant        GM_addStyle
// @run-at       document-start
// @license MIT

// @downloadURL https://update.greasyfork.org/scripts/528337/%E7%A7%BB%E9%99%A4SpankBang%E5%B9%B4%E9%BE%84%E9%AA%8C%E8%AF%81%28Remove%20SpankBang%20Age%20Verification%20Modal%20Instantly%29.user.js
// @updateURL https://update.greasyfork.org/scripts/528337/%E7%A7%BB%E9%99%A4SpankBang%E5%B9%B4%E9%BE%84%E9%AA%8C%E8%AF%81%28Remove%20SpankBang%20Age%20Verification%20Modal%20Instantly%29.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 在文档开始时注入CSS，确保模态窗口永不显示
    GM_addStyle(`
        #advanced-av {
            display: none !important;
            visibility: hidden !important;
        }
        body {
            position: static !important;
            height: auto !important;
            width: auto !important;
            overflow: auto !important;
        }
    `);

    // 立即执行的函数，尝试在DOM构建前移除元素
    (function removeModalEarly() {
        const modal = document.getElementById('advanced-av');
        if (modal) {
            modal.remove();
            console.log('Modal removed early.');
            document.body.classList.remove('fixed', 'h-full', 'w-full');
        }
    })();

    // MutationObserver监控动态添加的模态窗口
    const observer = new MutationObserver(function(mutations) {
        mutations.forEach(function(mutation) {
            const modal = document.getElementById('advanced-av');
            if (modal) {
                modal.remove();
                console.log('Modal removed via MutationObserver.');
                document.body.classList.remove('fixed', 'h-full', 'w-full');
                observer.disconnect();
            }
        });
    });

    // 从文档开头开始观察
    observer.observe(document, {
        childList: true,
        subtree: true
    });

    // DOM加载完成时再次检查
    document.addEventListener('DOMContentLoaded', function() {
        const modal = document.getElementById('advanced-av');
        if (modal) {
            modal.remove();
            console.log('Modal removed on DOMContentLoaded.');
        }
        document.body.classList.remove('fixed', 'h-full', 'w-full');
    });

    // 页面完全加载时最后检查
    window.addEventListener('load', function() {
        const modal = document.getElementById('advanced-av');
        if (modal) {
            modal.remove();
            console.log('Modal removed on load.');
        }
        document.body.classList.remove('fixed', 'h-full', 'w-full');
    });
})();