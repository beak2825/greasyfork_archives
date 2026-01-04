// ==UserScript==
// @name         CSDN免关注查看文章
// @namespace    xyz_xyz-CSDN%e5%85%8d%e5%85%b3%e6%b3%a8%e6%9f%a5%e7%9c%8b%e6%96%87%e7%ab%a0
// @version      1.0.0
// @description  无需关注博主，就可以查看csdn文章
// @author       xyz_xyz
// @match        https://blog.csdn.net/*
// @icon         https://g.csdnimg.cn/static/logo/favicon32.ico
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/546374/CSDN%E5%85%8D%E5%85%B3%E6%B3%A8%E6%9F%A5%E7%9C%8B%E6%96%87%E7%AB%A0.user.js
// @updateURL https://update.greasyfork.org/scripts/546374/CSDN%E5%85%8D%E5%85%B3%E6%B3%A8%E6%9F%A5%E7%9C%8B%E6%96%87%E7%AB%A0.meta.js
// ==/UserScript==

(function() {
    'use strict';
    const modifyArticle = () => {
        const article = document.querySelector('.article_content.clearfix');
        if (article) {
            article.style.height = 'auto';
            console.log('已修改 article_content 样式');
        }
        const mask = document.querySelector('.hide-article-box.hide-article-pos.text-center');
        if (mask) {
            mask.remove();
            console.log('已删除遮罩层');
        }
    };
    window.addEventListener('load', modifyArticle);
    const observer = new MutationObserver(modifyArticle);
    observer.observe(document.body, { childList: true, subtree: true });
})();