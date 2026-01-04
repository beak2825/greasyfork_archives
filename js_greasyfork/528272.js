// ==UserScript==
// @name         当页开搜
// @namespace    
// @version      4.0
// @description  增强表单处理与回车搜索功能
// @author       YourName
// @match        *://*/*
// @grant        none
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/528272/%E5%BD%93%E9%A1%B5%E5%BC%80%E6%90%9C.user.js
// @updateURL https://update.greasyfork.org/scripts/528272/%E5%BD%93%E9%A1%B5%E5%BC%80%E6%90%9C.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 增强表单处理器（2025-02-28更新）
    const processElements = elements => {
        elements.forEach(element => {
            // 处理输入框回车事件
            if (element.matches('input[type="search"], input[type="text"]')) {
                element.addEventListener('keydown', e => {
                    if (e.key === 'Enter') {
                        // 兼容IME输入法状态
                        if (e.isComposing) return;

                        // 动态值同步（解决框架绑定问题）
                        const syncValue = () => {
                            element.dispatchEvent(new Event('input', {
                                bubbles: true,
                                composed: true
                            }));
                            element.dispatchEvent(new Event('change', {
                                bubbles: true,
                                composed: true
                            }));
                        };

                        // 执行搜索（支持现代框架）
                        setTimeout(() => {
                            syncValue();
                            const form = element.closest('form');
                            if (form) {
                                // 触发原生表单提交流程
                                const submitBtn = form.querySelector('[type="submit"]');
                                if (submitBtn) {
                                    submitBtn.click();
                                } else {
                                    form.requestSubmit(); // 触发验证
                                }
                            }
                        }, 10);
                    }
                });
            }

            // 清理表单属性
            if (element.matches('form, msnhp-search-box')) {
                ['target', 'onclick'].forEach(attr =>
                    element.removeAttribute(attr)
                );
            }
        });
    };

    // 高性能观察器（支持Shadow DOM v3）
    new MutationObserver(mutations => {
        mutations.forEach(({ addedNodes }) => {
            addedNodes.forEach(node => {
                if (node.nodeType === 1) {
                    processElements([
                        node,
                        ...node.querySelectorAll(
                            'form, input[type="search"], input[type="text"], msnhp-search-box'
                        )
                    ]);
                }
            });
        });
    }).observe(document, {
        childList: true,
        subtree: true
    });

    // 初始处理
    processElements([
        ...document.forms,
        ...document.querySelectorAll('input[type="search"], input[type="text"], msnhp-search-box')
    ]);

    // 强化表单原型方法
    const nativeSubmit = HTMLFormElement.prototype.submit;
    HTMLFormElement.prototype.submit = function() {
        this.target = '_self';
        return nativeSubmit.call(this);
    };
})();
