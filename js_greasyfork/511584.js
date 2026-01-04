// ==UserScript==
// @name         Bilibili 哔哩哔哩显示评论区楼层编号
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  滚动到底等所有评论加载完成，点击“添加楼层编号”后插入楼层编号
// @author       YourName
// @match        *://*.bilibili.com/*
// @grant        GM_registerMenuCommand
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/511584/Bilibili%20%E5%93%94%E5%93%A9%E5%93%94%E5%93%A9%E6%98%BE%E7%A4%BA%E8%AF%84%E8%AE%BA%E5%8C%BA%E6%A5%BC%E5%B1%82%E7%BC%96%E5%8F%B7.user.js
// @updateURL https://update.greasyfork.org/scripts/511584/Bilibili%20%E5%93%94%E5%93%A9%E5%93%94%E5%93%A9%E6%98%BE%E7%A4%BA%E8%AF%84%E8%AE%BA%E5%8C%BA%E6%A5%BC%E5%B1%82%E7%BC%96%E5%8F%B7.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 注册菜单项，滚动到底等所有评论加载完成，点击后执行插入楼层编号的功能
    GM_registerMenuCommand('添加楼层编号', function() {
        let comments = document.querySelector('bili-comments').shadowRoot.querySelectorAll('bili-comment-thread-renderer');
        comments.forEach((comment, index) => {
            // 楼层编号从网页底部开始，1楼在最底部
            const floorNumber = comments.length - index;

            // 在每个评论楼层前面插入楼层编号
            const floorLabel = document.createElement('div');
            floorLabel.textContent = `${floorNumber}楼`;
            floorLabel.style.fontWeight = 'bold';
            floorLabel.style.marginBottom = '5px';

            const ele = comment.shadowRoot.querySelector('bili-comment-renderer').shadowRoot.querySelector('#body');
            ele.prepend(floorLabel);
        });
    });
})();