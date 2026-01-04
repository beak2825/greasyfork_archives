// ==UserScript==
// @name         绯月帖子显示大图
// @namespace    railguns
// @version      0.1
// @description  取消绯月帖子正文中的图片大小限制
// @author       railguns
// @match        https://bbs.kfpromax.com/read*
// @match        https://kfmax.com/read*
// @match        https://bbs.kfmax.com/read*
// @match        https://bbs.9dkf.com/read*
// @match        https://bbs.365gal.com/read*
// @match        https://bbs.365galgame.com/read*
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/482230/%E7%BB%AF%E6%9C%88%E5%B8%96%E5%AD%90%E6%98%BE%E7%A4%BA%E5%A4%A7%E5%9B%BE.user.js
// @updateURL https://update.greasyfork.org/scripts/482230/%E7%BB%AF%E6%9C%88%E5%B8%96%E5%AD%90%E6%98%BE%E7%A4%BA%E5%A4%A7%E5%9B%BE.meta.js
// ==/UserScript==

(function() {
    'use strict';

    function removeImageSizeRestrictions() {
        // 获取所有帖子中的图片元素
        var postImages = document.querySelectorAll("#pidtpc img");

        // 遍历图片元素并取消大小限制
        postImages.forEach(function(img) {
            // 移除宽度和高度属性
            img.removeAttribute('width');
            img.removeAttribute('height');
            // 修改样式，取消最大宽度和最大高度限制
            img.style.maxWidth = '100%';
            img.style.height = 'auto';
        });
    }

    // 使用 MutationObserver 监听DOM变化，以便在内容更新时重新应用脚本
    var observer = new MutationObserver(removeImageSizeRestrictions);
    var observerConfig = { childList: true, subtree: true };
    observer.observe(document.body, observerConfig);

    // 在页面加载完成后执行一次
    window.addEventListener('load', removeImageSizeRestrictions);
})();
