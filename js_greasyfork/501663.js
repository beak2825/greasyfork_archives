// ==UserScript==
// @name         自用屏蔽CSDN C知道（代码重构版）
// @namespace    https://github.com/adlered
// @version      2.0
// @description  自己写的屏蔽脚本，应该是我写的第一个油猴脚本
// @author       Broken9897
// @connect      www.csdn.net
// @include      *://*.csdn.net/*
// @antifeature  ads CSDNGreener 脚本中嵌入了可一键永久关闭的小广告，不会影响您的使用体验:) 请放心安装！
// @license MIT
// @note         24-07-24 2.0 重构版
// @note         24-05-23 1.0 初版
// @downloadURL https://update.greasyfork.org/scripts/501663/%E8%87%AA%E7%94%A8%E5%B1%8F%E8%94%BDCSDN%20C%E7%9F%A5%E9%81%93%EF%BC%88%E4%BB%A3%E7%A0%81%E9%87%8D%E6%9E%84%E7%89%88%EF%BC%89.user.js
// @updateURL https://update.greasyfork.org/scripts/501663/%E8%87%AA%E7%94%A8%E5%B1%8F%E8%94%BDCSDN%20C%E7%9F%A5%E9%81%93%EF%BC%88%E4%BB%A3%E7%A0%81%E9%87%8D%E6%9E%84%E7%89%88%EF%BC%89.meta.js
// ==/UserScript==

(function() {
    'use strict';

    let list = []; // 初始化空列表，用于存放广告选择器

    function put(selector) {
        list.push(selector);
    } // 将传入的 CSS 选择器字符串添加到 list 数组中

    function removeAds() {
        list.forEach(selector => {
            let elements = document.querySelectorAll(selector);
            elements.forEach(element => {
                element.remove();
            });
        });
    }

    // 添加选择器
    put('.chat-inline-content'); // 屏蔽大的C知道
    put('.side-search-box'); // 屏蔽是否满意
    put('body > div:nth-child(54) > div > div'); //屏蔽C知道总结全文1
    put('.btn-side-chatdoc');//屏蔽C知道总结全文2
    put('.btn-side-chatdoc-contentbox');//屏蔽C知道总结全文3
    put("#app > div > div.main.clearfix > div.so-search-bar > div.s-nav > div.s-nav-lt > ul > li:nth-child(2)"); //屏蔽搜索栏下的C知道
    put(".csdn-side-toolbar "); //屏蔽侧边栏
    put(".top-bar"); //屏蔽上侧广告

    // 立即执行一次移除广告
    removeAds();

    // 使用 MutationObserver 监视 DOM 变化
    const observer = new MutationObserver((mutations) => {
        mutations.forEach((mutation) => {
            if (mutation.type === 'childList') {
                removeAds();
            }
        });
    });

    // 配置观察选项
    const config = { childList: true, subtree: true };

    // 开始观察整个文档
    observer.observe(document.body, config);
})();
