// ==UserScript==
// @name         破解旧施调登录
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  解除旧施调入口登录限制，需开启浏览器开发者模式，并搭配浏览器插件「AdGuard 广告拦截器」使用
// @author       Ze
// @match        http://10.53.160.88:28796/wfm-portal/index
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/521657/%E7%A0%B4%E8%A7%A3%E6%97%A7%E6%96%BD%E8%B0%83%E7%99%BB%E5%BD%95.user.js
// @updateURL https://update.greasyfork.org/scripts/521657/%E7%A0%B4%E8%A7%A3%E6%97%A7%E6%96%BD%E8%B0%83%E7%99%BB%E5%BD%95.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 1. 移除 fish.popup 绑定的特定 click 事件监听器
    window.addEventListener('load', function() {
        const originalFishPopup = fish.popup;

        fish.popup = function(a) {
            function b(a) {
                $.contains(e.get(d).value.$modalElement[0], a.target) || d.dismiss("click outside");
            }

            var c = $.Deferred(),
                d = {
                    result: c.promise(),
                    close: function(a) {
                        return h.close(d, a);
                    },
                    dismiss: function(a) {
                        return h.dismiss(d, a);
                    },
                    show: function() {
                        h.show(d);
                    },
                    hide: function() {
                        h.hide(d);
                    },
                    isOpen: function() {
                        return h.isOpen(d);
                    },
                    isDestroy: function() {
                        return h.isDestroy(d);
                    },
                    center: function() {
                        h.center(d);
                    }
                };

            // 调用原始 fish.popup 方法
            originalFishPopup.call(fish, a);

            // 如果 autoDismiss 为 true，绑定 click 事件监听器
            if (a.autoDismiss) {
                fish.defer(function() {
                    $(document).on("click", b);  // 绑定事件
                });

                // 确保在弹窗关闭时移除事件监听器
                d.result.always(function() {
                    $(document).off("click", b);  // 移除事件监听器
                    console.log('移除了特定的 click 事件监听器');
                });
            }

            return d;
        };

        console.log('已重写 fish.popup 方法并确保移除 click 事件监听器');
    });

    // 2. 移除指定 class 的弹窗
    const removePopup = () => {
        const popups = document.querySelectorAll('.ui-dialog.modal-info.ui-draggable');
        if (popups.length > 0) {
            popups.forEach(popup => {
                console.log('移除弹窗', popup);
                popup.remove();  // 移除弹窗
            });
        }
    };

    // 监视 DOM 变化，移除新增的弹窗
    const observer = new MutationObserver(function(mutations) {
        mutations.forEach(function(mutation) {
            mutation.addedNodes.forEach(function(node) {
                if (node.nodeType === 1 && node.classList.contains('ui-dialog') && node.classList.contains('modal-info') && node.classList.contains('ui-draggable')) {
                    console.log('检测到新增弹窗，移除它', node);
                    node.remove();
                }
            });
        });
    });

    // 监视整个 document.body 的变化
    observer.observe(document.body, { childList: true, subtree: true });

    // 页面加载完成后，移除已存在的弹窗
    window.addEventListener('load', () => {
        console.log('页面加载完成，检查并移除已存在的弹窗');
        removePopup();
    });

    // 定时检查页面上的弹窗，确保移除动态生成的弹窗
    setInterval(removePopup, 1000);  // 每秒检查一次
})();
