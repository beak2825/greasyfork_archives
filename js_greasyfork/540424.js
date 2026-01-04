// ==UserScript==
// @name         移除百度首页推荐 (优化版)
// @version      1.2
// @author       wangws
// @namespace    https://www.acfun.cn/u/955021
// @match        https://www.baidu.com/*
// @match        https://ipv6.baidu.com/*
// @description:zh-cn 百度首页推荐内容移除 ，并确保“我的关注”正常显示
// @description 百度首页推荐内容移除，并确保“我的关注”正常显示
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/540424/%E7%A7%BB%E9%99%A4%E7%99%BE%E5%BA%A6%E9%A6%96%E9%A1%B5%E6%8E%A8%E8%8D%90%20%28%E4%BC%98%E5%8C%96%E7%89%88%29.user.js
// @updateURL https://update.greasyfork.org/scripts/540424/%E7%A7%BB%E9%99%A4%E7%99%BE%E5%BA%A6%E9%A6%96%E9%A1%B5%E6%8E%A8%E8%8D%90%20%28%E4%BC%98%E5%8C%96%E7%89%88%29.meta.js
// ==/UserScript==

(function( ) {
    'use strict';

    // 辅助函数：根据ID删除元素
    function removeElementById(elementId) {
        const element = document.getElementById(elementId);
        if (element) {
            element.remove();
            // console.log(`Removed element by ID: ${elementId}`); // 调试用
        }
    }

    // 辅助函数：根据类名删除所有匹配的元素
    function removeElementsByClassName(className) {
        const elements = document.getElementsByClassName(className);
        // 将 HTMLCollection 转换为数组，避免在删除元素时集合动态变化导致的问题
        Array.from(elements).forEach(element => {
            element.remove();
            // console.log(`Removed element by class: ${className}`); // 调试用
        });
    }

    // --- 主要逻辑开始 ---

    // 1. 删除热搜内容和相关引导
    removeElementById('s_new_search_guide'); // 新搜索引导
    removeElementById('s-hotsearch-wrapper'); // 热搜榜单

    // 2. 获取“推荐”标签和“我的关注”按钮
    const tuijianTab = document.querySelector('#s_menus_wrapper span[data-id="99"]'); // 推荐标签
    const mineButton = document.getElementById('s_menu_mine'); // “我的关注”按钮

    // 3. 优化“我的关注”点击逻辑，确保在“推荐”标签被移除前显示
    if (tuijianTab && tuijianTab.classList.contains('current') && mineButton) {
        // 如果“推荐”是当前激活的标签，并且“我的关注”按钮存在
        // 先点击“我的关注”，确保切换到正确的视图
        setTimeout(() => {
            // 再次获取 mineButton，确保元素在延迟后仍然存在且可点击
            const currentMineButton = document.getElementById('s_menu_mine');
            if (currentMineButton) {
                currentMineButton.click();
                // console.log('Clicked "我的关注" button before removing "推荐" tab.');
            }

            // 点击完成后，再移除“推荐”标签
            // 找到“推荐”标签的父级菜单项（通常是 li.s-menu-item）
            const tuijianMenuItem = tuijianTab.closest('.s-menu-item');
            if (tuijianMenuItem) {
                tuijianMenuItem.remove();
                // console.log('Removed "推荐" tab after clicking "我的关注".');
            } else {
                // 如果找不到父级 li，直接移除 span
                tuijianTab.remove();
                // console.log('Removed "推荐" span directly after clicking "我的关注".');
            }
        }, 100); // 短暂延迟100毫秒，给浏览器处理点击事件的时间
    } else if (tuijianTab) {
        // 如果“推荐”标签存在但不是当前激活的，或者“我的关注”不存在/已激活，则直接移除“推荐”标签
        const tuijianMenuItem = tuijianTab.closest('.s-menu-item');
        if (tuijianMenuItem) {
            tuijianMenuItem.remove();
            // console.log('Removed "推荐" tab (not active or "我的关注" not needed).');
        } else {
            tuijianTab.remove(); // Fallback if parent li not found
            // console.log('Removed "推荐" span directly (not active or "我的关注" not needed).');
        }
    }

    // 4. 清空搜索框的 placeholder 文本
    const kw = document.getElementById('kw'); // 搜索框
    if (kw) {
        kw.setAttribute('placeholder', '');
    }

    // 5. 优化首页格式（宽度调整）
    // 调整热点新闻区域宽度
    const hotNewsWrapper = document.querySelector('.c-wrapper-hot-news-all');
    if (hotNewsWrapper) {
        hotNewsWrapper.style.width = '65%';
    }

    // 调整小卡片区域宽度
    const smallCardWrapper = document.querySelector('.destop_wrapper_small .cardWidth_gb31u');
    if (smallCardWrapper) {
        smallCardWrapper.style.width = '100%';
    }

    const smallWrapper = document.querySelector('.destop_wrapper_small.destop_wrapper_3m2ep');
    if (smallWrapper) {
        smallWrapper.style.width = '100%';
    }

    const cardContentWrapper = document.querySelector('.destop_wrapper_small .card_layout_11HoJ .content_2q4gZ');
    if (cardContentWrapper) {
        cardContentWrapper.style.width = '100%';
    }

    // 调整站点容器宽度和边距
    const siteContainerWrappers = document.querySelectorAll('.destop_wrapper_small .site-container_3QJpT .cate-site-container_ditOw');
    siteContainerWrappers.forEach(wrapper => {
        wrapper.style.width = '100%';
        wrapper.style.marginRight = '-50px';
    });

    // console.log('UserScript execution finished.'); // 调试用
})();
