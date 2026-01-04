// ==UserScript==
// @name         小红书网站优化-摸鱼版本
// @namespace    mo_chrome
// @version      1.0.1
// @description  小红书上班摸鱼脚本，笔记封面增加毛玻璃样式，鼠标移动上去再消失。另外修改了小红薯网页的默认标题和图标。
// @author       Moxiaxian
// @match        *://www.xiaohongshu.com/*
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/540488/%E5%B0%8F%E7%BA%A2%E4%B9%A6%E7%BD%91%E7%AB%99%E4%BC%98%E5%8C%96-%E6%91%B8%E9%B1%BC%E7%89%88%E6%9C%AC.user.js
// @updateURL https://update.greasyfork.org/scripts/540488/%E5%B0%8F%E7%BA%A2%E4%B9%A6%E7%BD%91%E7%AB%99%E4%BC%98%E5%8C%96-%E6%91%B8%E9%B1%BC%E7%89%88%E6%9C%AC.meta.js
// ==/UserScript==
(function() {
    'use strict';

    // 初始化给已有note-item应用模糊效果与事件
    function applyBlurEffectToItems(items) {
        const blurStyle = 'filter: blur(5px); transition: filter 0.3s ease;';
        items.forEach(item => {
            // 避免重复绑定
            if (!item.dataset.blurApplied) {
                item.style.cssText += blurStyle;

                let hoverTimer = null;

                item.addEventListener('mouseenter', () => {
                    // 鼠标进入后启动定时器，0.5秒后去掉模糊
                    hoverTimer = setTimeout(() => {
                        item.style.filter = 'none';
                    }, 500);
                });

                item.addEventListener('mouseleave', () => {
                    // 鼠标离开时清除定时器，恢复模糊效果
                    if (hoverTimer) {
                        clearTimeout(hoverTimer);
                        hoverTimer = null;
                    }
                    item.style.filter = 'blur(5px)';
                });

                item.dataset.blurApplied = 'true';
            }
        });
    }

    setTimeout(() => {
        document.getElementById('link-guide').style.display = 'none';
        document.title = "CSDN";
        function changeFavicon(src) {
            let link = document.querySelector("link[rel~='icon']");
            if (!link) {
                // 如果没有favicon标签，则创建一个
                link = document.createElement('link');
                link.rel = 'icon';
                document.getElementsByTagName('head')[0].appendChild(link);
            }
            link.href = src;
        }
        changeFavicon('https://g.csdnimg.cn/static/logo/favicon32.ico');

        // 使用示例，替换为你想用的favicon地址
        changeFavicon('https://example.com/new-favicon.ico');

        // 先给当前已有的note-item应用效果
        const initialItems = document.querySelectorAll('.note-item');
        applyBlurEffectToItems(initialItems);

        // MutationObserver监听DOM变化，动态添加效果
        const observer = new MutationObserver(mutations => {
            mutations.forEach(mutation => {
                mutation.addedNodes.forEach(node => {
                    if (!(node instanceof HTMLElement)) return;

                    if (node.classList.contains('note-item')) {
                        applyBlurEffectToItems([node]);
                    } else {
                        const nestedItems = node.querySelectorAll('.note-item');
                        if (nestedItems.length > 0) {
                            applyBlurEffectToItems(nestedItems);
                        }
                    }
                });
            });
        });

        observer.observe(document.body, {
            childList: true,
            subtree: true
        });

    }, 200);

})();