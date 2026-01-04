// ==UserScript==
// @name         CSDN免登录复制脚本
// @namespace    http://tampermonkey.net/
// @version      5.0
// @description  破解CSDN登录限制，自由复制代码和文本
// @author       louk78
// @match        *://*.csdn.net/*
// @grant        none
// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/541401/CSDN%E5%85%8D%E7%99%BB%E5%BD%95%E5%A4%8D%E5%88%B6%E8%84%9A%E6%9C%AC.user.js
// @updateURL https://update.greasyfork.org/scripts/541401/CSDN%E5%85%8D%E7%99%BB%E5%BD%95%E5%A4%8D%E5%88%B6%E8%84%9A%E6%9C%AC.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const removeLoginModal = () => {
        const modal = document.querySelector('.login-mark, .passport-login-container');
        if (modal) {
            modal.style.display = 'none';
            document.body.style.overflow = 'auto';
        }
    };


    const overrideStyles = () => {
        const style = document.createElement('style');
        style.innerHTML = `
            body * {
                user-select: auto !important;
                -webkit-user-select: auto !important;
                pointer-events: auto !important;
            }
            .hide-article-box, .login-mark, .passport-login-container {
                display: none !important;
            }
            #article_content {
                height: auto !important;
                overflow: auto !important;
            }
        `;
        document.head.appendChild(style);
    };


    const removeCopyEvents = () => {
        const events = ['copy', 'cut', 'selectstart', 'contextmenu', 'mousedown', 'mouseup', 'keydown'];
        events.forEach(event => {
            document.addEventListener(event, e => {
                e.stopPropagation();
            }, true);
        });
    };


    const unlockCodeCopyButtons = () => {
        document.querySelectorAll('pre').forEach(pre => {
            pre.style.position = 'relative';
            pre.style.paddingTop = '30px';

            if (!pre.querySelector('.custom-copy-btn')) {
                const btn = document.createElement('button');
                btn.className = 'custom-copy-btn';
                btn.innerHTML = '复制代码';
                btn.style.position = 'absolute';
                btn.style.top = '5px';
                btn.style.right = '5px';
                btn.style.padding = '5px 10px';
                btn.style.background = '#4CAF50';
                btn.style.color = 'white';
                btn.style.border = 'none';
                btn.style.borderRadius = '3px';
                btn.style.cursor = 'pointer';

                btn.addEventListener('click', () => {
                    const code = pre.querySelector('code')?.innerText || pre.innerText;
                    navigator.clipboard.writeText(code).then(() => {
                        btn.innerHTML = '已复制!';
                        setTimeout(() => {
                            btn.innerHTML = '复制代码';
                        }, 1500);
                    });
                });

                pre.appendChild(btn);
            }
        });
    };


    const init = () => {

        removeLoginModal();
        overrideStyles();
        removeCopyEvents();

        setTimeout(() => {
            unlockCodeCopyButtons();
            removeLoginModal();
        }, 2000);


        const observer = new MutationObserver(() => {
            removeLoginModal();
            unlockCodeCopyButtons();
        });

        observer.observe(document.body, {
            childList: true,
            subtree: true
        });
    };


    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();