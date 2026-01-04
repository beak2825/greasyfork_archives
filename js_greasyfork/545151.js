// ==UserScript==
// @name         知乎专栏保存
// @namespace    http://tampermonkey.net/
// @version      1.0.1
// @description  保存知乎专栏文章内容
// @author       Kiyuiro
// @match        https://zhuanlan.zhihu.com/p/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=zhihu.com
// @grant        none
// @license      Apache-2.0
// @downloadURL https://update.greasyfork.org/scripts/545151/%E7%9F%A5%E4%B9%8E%E4%B8%93%E6%A0%8F%E4%BF%9D%E5%AD%98.user.js
// @updateURL https://update.greasyfork.org/scripts/545151/%E7%9F%A5%E4%B9%8E%E4%B8%93%E6%A0%8F%E4%BF%9D%E5%AD%98.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const btn = document.createElement('button');
    btn.textContent = '保存页面';
    btn.style.position = 'fixed';
    btn.style.top = '10px';
    btn.style.right = '10px';
    btn.style.zIndex = '99999';
    btn.style.padding = '6px 12px';
    btn.style.background = '#f44336';
    btn.style.color = '#fff';
    btn.style.border = 'none';
    btn.style.borderRadius = '4px';
    btn.style.cursor = 'pointer';
    document.body.appendChild(btn);

    btn.addEventListener('click', () => {
        [
            "Post-Row-Content-right",
            "Catalog",
            "AppHeader",
            "Post-Sub",
            "Comments-container",
            "ContentItem-time",
            "Post-topicsAndReviewer",
            "RichContent-actions",
            "Post-Header",
            "RichText-LinkCardContainer",
            "CornerButtons"
        ].forEach(className => {
            document.querySelectorAll(`.${className}`).forEach(el => el.remove());
        });

        document.querySelectorAll('.Post-RichTextContainer').forEach(el => {
          const parent = el.parentNode;
          Array.from(parent.children).forEach(child => {
            if (!child.classList.contains('Post-RichTextContainer')) {
              parent.removeChild(child);
            }
          });
        });

        btn.remove();

        window.print();
    });
})();