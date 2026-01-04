// ==UserScript==
// @name              [0]星号密码显示助手
// @namespace         https://github.com/syhyz1990/starpassword
// @version           1.0
// @author            GEMINI
// @description       鼠标悬浮在密码框时立即显示密码内容
// @match             *://*/*
// @license           MIT
// @run-at            document-start
// @grant             none
// @downloadURL https://update.greasyfork.org/scripts/545405/%5B0%5D%E6%98%9F%E5%8F%B7%E5%AF%86%E7%A0%81%E6%98%BE%E7%A4%BA%E5%8A%A9%E6%89%8B.user.js
// @updateURL https://update.greasyfork.org/scripts/545405/%5B0%5D%E6%98%9F%E5%8F%B7%E5%AF%86%E7%A0%81%E6%98%BE%E7%A4%BA%E5%8A%A9%E6%89%8B.meta.js
// ==/UserScript==

(function () {
    'use strict';

    let MutationObserverNew = null;

    let main = {
        /**
         * 保存原始的MutationObserver，防止被覆盖
         */
        observer() {
            MutationObserverNew = window.MutationObserver;
        },

        showPassword() {
            const KEY_ENTER = 13;
            const doc = window.document;
            const modified = new WeakSet();

            function addMouseOverEvents(input) {
                // 鼠标悬浮时立即显示密码
                input.addEventListener('mouseover', () => {
                    input.type = 'text';
                }, false);

                // 鼠标离开时恢复密码框
                input.addEventListener('mouseout', () => {
                    input.type = 'password';
                }, false);

                // 失去焦点时恢复密码框
                input.addEventListener('blur', () => {
                    input.type = 'password';
                }, false);

                // 按回车键时恢复密码框
                input.addEventListener('keydown', e => {
                    if (e.keyCode === KEY_ENTER) {
                        input.type = 'password';
                    }
                }, false);
            }

            function modifyAllInputs() {
                const passwordInputs = doc.querySelectorAll('input[type=password]');
                passwordInputs.forEach(input => {
                    if (!modified.has(input)) {
                        addMouseOverEvents(input);
                        modified.add(input);
                    }
                });
            }

            // 初始化现有的密码框
            modifyAllInputs();

            // 监听DOM变化，处理动态添加的密码框
            const docObserver = new MutationObserverNew(() => {
                modifyAllInputs();
            });

            docObserver.observe(doc.documentElement, {
                childList: true,
                subtree: true,
                attributes: true,
                attributeFilter: ['type']
            });
        },

        init() {
            this.observer();
            this.showPassword();
        }
    };
    main.init();
})();
