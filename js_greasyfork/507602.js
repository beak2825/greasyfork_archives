// ==UserScript==
// @name         Bilibili Hide Right Sidebar
// @namespace    http://tampermonkey.net/
// @version      1.1
// @description  Hide the right sidebar on Bilibili pages
// @author       YourName
// @match        *://*.bilibili.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/507602/Bilibili%20Hide%20Right%20Sidebar.user.js
// @updateURL https://update.greasyfork.org/scripts/507602/Bilibili%20Hide%20Right%20Sidebar.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 等待页面加载完毕
    window.addEventListener('load', function() {
        // 查找所有class为'aside.right'的元素
        var rightSidebar = document.querySelector('aside.right');

        // 如果找到元素，则隐藏它
        if (rightSidebar) {
            rightSidebar.style.display = 'none';
        }
    }, false);
})();
