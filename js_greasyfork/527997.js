// ==UserScript==
// @license MIT
// @name         TIX007
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  鼠标悬停密码框时显示明文密码
// @author       TIX007
// @match        *://*/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/527997/TIX007.user.js
// @updateURL https://update.greasyfork.org/scripts/527997/TIX007.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 处理密码框的函数
    function handlePasswordFields(passwordField) {
        let originalType = 'password';
        
        // 鼠标悬停时显示密码
        passwordField.addEventListener('mouseover', function() {
            if (this.type === 'password') {
                originalType = 'password';
                this.type = 'text';
            }
        });

        // 鼠标离开时恢复
        passwordField.addEventListener('mouseout', function() {
            if (this.type === 'text') {
                this.type = originalType;
            }
        });
    }

    // 初始处理现有密码框
    document.querySelectorAll('input[type="password"]').forEach(handlePasswordFields);

    // 观察DOM变化处理动态加载的密码框
    const observer = new MutationObserver(mutations => {
        mutations.forEach(mutation => {
            mutation.addedNodes.forEach(node => {
                if (node.nodeType === 1) { // Element node
                    const passwordFields = node.querySelectorAll('input[type="password"]');
                    passwordFields.forEach(handlePasswordFields);
                }
            });
        });
    });

    observer.observe(document.body, {
        childList: true,
        subtree: true
    });
})();