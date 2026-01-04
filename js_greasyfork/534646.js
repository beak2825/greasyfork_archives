// ==UserScript==
// @name         展开时间线更多菜单
// @namespace    https://bgm.tv/group/topic/422469
// @version      0.0.1
// @description  把更多里的选项全部移动到了一级菜单
// @author       默沨
// @match        bangumi.tv/*
// @match        bgm.tv/*
// @match        chii.in/*
// @grant        none
// @license      LGPLv3
// @downloadURL https://update.greasyfork.org/scripts/534646/%E5%B1%95%E5%BC%80%E6%97%B6%E9%97%B4%E7%BA%BF%E6%9B%B4%E5%A4%9A%E8%8F%9C%E5%8D%95.user.js
// @updateURL https://update.greasyfork.org/scripts/534646/%E5%B1%95%E5%BC%80%E6%97%B6%E9%97%B4%E7%BA%BF%E6%9B%B4%E5%A4%9A%E8%8F%9C%E5%8D%95.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const timelineTabs = document.getElementById('timelineTabs');
    if (!timelineTabs) {
        return;
    }

    const moreItem = timelineTabs.querySelector('li a.top')?.parentNode;
    if (!moreItem) {
        return;
    }

    const moreMenu = moreItem.querySelector('ul');
    if (!moreMenu) {
        return;
    }

    const mainMenuItems = Array.from(timelineTabs.children).filter(child => child.tagName === 'LI');
    const moreItemIndex = mainMenuItems.indexOf(moreItem);
    const subItems = Array.from(moreMenu.querySelectorAll('li'));

    subItems.forEach((item, index) => {
        timelineTabs.insertBefore(item, moreItem);
    });

    moreMenu.remove();
    moreItem.remove();
})();
