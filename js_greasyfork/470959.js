// ==UserScript==
// @name         在小码王顶部栏添加OpenXMW导航
// @namespace    https://world.xiaomawang.com/w/person/project/all/2695419
// @version      1.1
// @description  添加OpenXMW社区按钮以方便更好的创作
// @author       Lone Kuel-楼上小快
// @match        https://world.xiaomawang.com/w/index
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/470959/%E5%9C%A8%E5%B0%8F%E7%A0%81%E7%8E%8B%E9%A1%B6%E9%83%A8%E6%A0%8F%E6%B7%BB%E5%8A%A0OpenXMW%E5%AF%BC%E8%88%AA.user.js
// @updateURL https://update.greasyfork.org/scripts/470959/%E5%9C%A8%E5%B0%8F%E7%A0%81%E7%8E%8B%E9%A1%B6%E9%83%A8%E6%A0%8F%E6%B7%BB%E5%8A%A0OpenXMW%E5%AF%BC%E8%88%AA.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 创建一个新的超链接元素
    var link = document.createElement('a');
    link.href = 'https://forum.openxmw.tech/';
    link.target = '_blank';
    link.textContent = 'OpenXMW社区';

    // 获取顶部栏的父元素
    var topNav = document.querySelector('.top-nav-tabs__2GZFD');

    // 创建一个新的列表项元素
    var listItem = document.createElement('li');
    listItem.className = 'top-nav-tab__2IfWu';
    listItem.appendChild(link);

    // 将新的列表项插入到顶部栏中
    topNav.appendChild(listItem);
})();