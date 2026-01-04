// ==UserScript==
// @name         微博新版图片/动图自动全屏幻灯片（全兼容版）
// @namespace    http://tampermonkey.net/
// @version      1.3
// @description  微博新版点击图片或动图自动进入全网页幻灯片（查看大图）模式
// @author       YourName
// @match        https://weibo.com/*
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/541330/%E5%BE%AE%E5%8D%9A%E6%96%B0%E7%89%88%E5%9B%BE%E7%89%87%E5%8A%A8%E5%9B%BE%E8%87%AA%E5%8A%A8%E5%85%A8%E5%B1%8F%E5%B9%BB%E7%81%AF%E7%89%87%EF%BC%88%E5%85%A8%E5%85%BC%E5%AE%B9%E7%89%88%EF%BC%89.user.js
// @updateURL https://update.greasyfork.org/scripts/541330/%E5%BE%AE%E5%8D%9A%E6%96%B0%E7%89%88%E5%9B%BE%E7%89%87%E5%8A%A8%E5%9B%BE%E8%87%AA%E5%8A%A8%E5%85%A8%E5%B1%8F%E5%B9%BB%E7%81%AF%E7%89%87%EF%BC%88%E5%85%A8%E5%85%BC%E5%AE%B9%E7%89%88%EF%BC%89.meta.js
// ==/UserScript==

(function() {
    'use strict';

    let lastClickTime = 0;

    document.body.addEventListener('click', function(e) {
        let img = e.target.closest('img');
        if (!img) return;
        lastClickTime = Date.now();
    }, true);

    const observer = new MutationObserver((mutationsList) => {
        for (const mutation of mutationsList) {
            for (const node of mutation.addedNodes) {
                if (!(node instanceof HTMLElement)) continue;
                // 判断是否为弹窗
                if (
                    node.matches?.('[role="dialog"], [aria-modal="true"], .woo-modal, .picture-view-main') ||
                    node.querySelector?.('i.picture-tool-bar_icon_3UbxU')
                ) {
                    if (Date.now() - lastClickTime < 2000) {
                        // 1. 先找普通图片的“查看大图”按钮
                        let btn = Array.from(node.querySelectorAll('i.picture-tool-bar_icon_3UbxU'))
                            .map(i => i.parentElement)
                            .find(el => el && el.innerText.includes('查看大图') && el.offsetParent !== null);

                        // 2. 如果没找到，再找所有包含“查看大图”文本的按钮/链接/元素（兼容动图）
                        if (!btn) {
                            btn = Array.from(node.querySelectorAll('button,a,div,span'))
                                .find(el => el.innerText && el.innerText.includes('查看大图') && el.offsetParent !== null);
                        }

                        if (btn) {
                            btn.click();
                        }
                    }
                }
            }
        }
    });

    observer.observe(document.body, { childList: true, subtree: true });
})();