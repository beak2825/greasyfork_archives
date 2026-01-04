// ==UserScript==
// @name         Pixiv 自动展开折叠评论/回复
// @namespace    https://blog.sxjeru.top/
// @version      1.0
// @description  自动帮你点击 Pixiv 评论区的 “查看后续” 与 “查看回复” 按钮，解放双手——
// @author       sxjeru
// @icon         https://blog.sxjeru.top/favicon.ico
// @grant        none
// @license      GPL-3.0
// @match        *://www.pixiv.net/*
// @downloadURL https://update.greasyfork.org/scripts/473153/Pixiv%20%E8%87%AA%E5%8A%A8%E5%B1%95%E5%BC%80%E6%8A%98%E5%8F%A0%E8%AF%84%E8%AE%BA%E5%9B%9E%E5%A4%8D.user.js
// @updateURL https://update.greasyfork.org/scripts/473153/Pixiv%20%E8%87%AA%E5%8A%A8%E5%B1%95%E5%BC%80%E6%8A%98%E5%8F%A0%E8%AF%84%E8%AE%BA%E5%9B%9E%E5%A4%8D.meta.js
// ==/UserScript==

(function() {
  'use strict';

    const targetText = '查看回复';

    var observer = new IntersectionObserver(function(entries) { // 自动点击“查看后续”
        entries.forEach(function(entry) {
            if (entry.isIntersecting) {
                clickButton(entry.target);
            }
        });
    });

    var observer2 = new IntersectionObserver((entries, observer) => { // 自动点击“查看回复”
        entries.forEach(entry => {
            if (entry.isIntersecting && entry.target.textContent === targetText) {
                setTimeout(function() {
                entry.target.parentNode.click();
                }, 300); // 延迟点击
                observer.unobserve(entry.target);
            }
        });
    }, { rootMargin: '0px', threshold: 0.1 });

    function clickButton(element) {
        var button = document.querySelector('button[aria-controls="' + element.id + '"]');
        if (button) {
            setTimeout(function() {
                button.click();
            }, 300); // 延迟点击

            observer.unobserve(element);
        }
    }

    // 创建一个MutationObserver实例来监视DOM的变化
    var mutationObserver = new MutationObserver(function(mutations) {
        mutations.forEach(function(mutation) {
            if (mutation.type === 'childList') {
                var newElements = mutation.target.querySelectorAll('[id^="expandable-paragraph-"], div');

                for (var i = 0; i < newElements.length; i++) {
                    var element = newElements[i];

                    if (element.id && element.id.startsWith('expandable-paragraph-')) {
                        observer.observe(element);
                    } else if (element.textContent === targetText) {
                        observer2.observe(element);
                    }

                    // 立即检查新元素是否已经在可视区域内
                    var rect = element.getBoundingClientRect();
                    if (rect.top >= 0 && rect.left >= 0 && rect.bottom <= window.innerHeight && rect.right <= window.innerWidth) {
                        if (element.id && element.id.startsWith('expandable-paragraph-')) {
                            clickButton(element);
                        } else if (element.textContent === targetText) {
                            element.click();
                        }
                    }
                }
            }
        });
    });

    // 开始监视整个文档的DOM变化
    mutationObserver.observe(document.body, { childList: true, subtree: true });
})();