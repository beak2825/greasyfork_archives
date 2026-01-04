// ==UserScript==
// @name         CSDN免VIP免登陆阅读全文
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  仅仅用于CSDN免VIP免登陆阅读全文
// @author       Justin
// @match        *://*.csdn.net/*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/490338/CSDN%E5%85%8DVIP%E5%85%8D%E7%99%BB%E9%99%86%E9%98%85%E8%AF%BB%E5%85%A8%E6%96%87.user.js
// @updateURL https://update.greasyfork.org/scripts/490338/CSDN%E5%85%8DVIP%E5%85%8D%E7%99%BB%E9%99%86%E9%98%85%E8%AF%BB%E5%85%A8%E6%96%87.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const adjustArticle = () => {
        // 移除内容底部遮罩
        document.querySelectorAll('.hide-article-box.hide-article-pos.text-center').forEach(el => el.remove());

        // 展开被限制高度的内容
        const articleContent = document.getElementById('article_content');
        if (articleContent) {
            articleContent.style.height = 'auto';
        }
    };

    const adjustLeft = () => {
        // 移除左侧除作者信息之外的内容
        document.querySelectorAll('aside.blog_container_aside > div').forEach(el => el.id !== 'asideProfile' && el.remove());
    }

    const adjustRight = () => {
        // 移除右侧
        const rightAside = document.getElementById('rightAside');
        if (rightAside) {
            rightAside.remove();
        }

        // 移除右侧工具栏(延迟移除，不然找不到)
        setTimeout(function(){
            // 获取name为“googlefcPresent”的iframe元素
            const iframe = document.querySelector('iframe[name="googlefcPresent"]');

            // 如果找到了iframe元素
            if (iframe) {
                // 获取上一个div元素
                const previousDivElement = iframe.previousElementSibling;

                // 确保上一个元素存在且为div元素
                if (previousDivElement && previousDivElement.tagName.toLowerCase() === 'div') {
                    previousDivElement.remove();
                }
            }}, 500);
    }

    adjustArticle();
    //adjustLeft();
    //adjustRight();
})();
