// ==UserScript==
// @name         先知阅读模式
// @namespace    http://tampermonkey.net/
// @version      2025-06-14
// @description  去除侧边栏,优化title
// @author       Mrxn
// @homepage     https://mrxn.net/
// @match        https://xz.aliyun.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=aliyun.com
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/494413/%E5%85%88%E7%9F%A5%E9%98%85%E8%AF%BB%E6%A8%A1%E5%BC%8F.user.js
// @updateURL https://update.greasyfork.org/scripts/494413/%E5%85%88%E7%9F%A5%E9%98%85%E8%AF%BB%E6%A8%A1%E5%BC%8F.meta.js
// ==/UserScript==

(function() {
    'use strict';


    function modify_xz(){
        document.querySelector("body > div.wrap > div.main > div > div.left_container > div > div > div.detail_comment.comment_box_quill").remove();
        document.querySelector("body > div.footer.pd20").remove();
        document.querySelector("body > div.wrap > div.main > div > div.left_container > div > div > div.detail_share.mt20").remove();
        document.querySelector("body > div.wrap > div:nth-child(1) > div.nav.nav_border").remove();
        document.querySelector("body > div.wrap > div.noticebox").remove();
        // 移除侧边栏
        var container = document.querySelector('.right_container');
        if (container) {
            var children = Array.from(container.children);
            children.forEach(function(child) {
                container.removeChild(child);
            });
        }
        // 移除评论为0的comment_title
        var commentTitle = document.querySelector('.comment_title');
        if (commentTitle) {
            var countSpan = commentTitle.querySelector('.comment_count');
            if (countSpan && countSpan.textContent.trim() === '0') {
                commentTitle.remove();
            }
        }
        // 修改main的margin-top为5px
        var mainDiv = document.querySelector('.main');
        if (mainDiv) {
            mainDiv.style.marginTop = '5px';
        }
        //移除顶栏
        var wrap = document.querySelector('.wrap');
        if (wrap) {
            var firstDiv = wrap.querySelector('div');
            if (firstDiv) {
                firstDiv.remove();
            }
        }
        document.title = document.title.replace("-先知社区","");
        document.querySelector("body > div.wrap > div.main > div > div.left_container > div").style.width="80em";
        // 获取 .ne-viewer-body 下的所有 img 元素
        const images = document.querySelectorAll('.ne-viewer-body img');
        // 遍历所有 img 元素，修改 width 属性
        images.forEach(img => {
            // 只修改 img 标签中存在 width 属性的元素
            if (img.hasAttribute('width')) {
                img.setAttribute('width', '95%'); // 将 width 属性值改为 95%
            }
        });

    }
    function updateViewCount() {
        // 查找所有 span 元素
        const spans = document.querySelectorAll('div#news_toolbar span');
        let viewCountElement;

        // 遍历所有 span，找到包含 "浏览" 的那个 span
        spans.forEach(span => {
            if (span.textContent.includes('浏览')) {
                viewCountElement = span;
            }
        });

        // 如果找到包含 "浏览" 的 span
        if (viewCountElement) {
            // 使用正则提取并修改浏览数
            const match = viewCountElement.textContent.match(/(\d+)浏览/);
            if (match) {
                let currentCount = parseInt(match[1], 10); // 当前的浏览数

                // 计算减少三分之一后的数值
                let newCount = Math.floor(currentCount - currentCount / 3);

                // 生成随机的增加值，范围为 5 到 15
                let randomIncrease = Math.floor(Math.random() * 11) + 5; // 5 到 15

                // 新的浏览数为当前值加上随机增加值
                newCount = currentCount + randomIncrease;

                // 确保浏览数不会小于 0
                newCount = newCount < 0 ? 0 : newCount;

                // 仅替换浏览数的数字部分
                viewCountElement.textContent = viewCountElement.textContent.replace(/\d+浏览/, `${newCount}浏览`);
            }
        }
    }
    document.addEventListener("scroll", function() {
        if(document.querySelector("body > div.wrap > div.main > div > div.right_container")){
            console.log("end ...");
            modify_xz();
            updateViewCount();
        }
    });
})();