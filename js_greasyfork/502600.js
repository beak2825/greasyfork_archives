// ==UserScript==
// @name         CRJ-哔哩哔哩纯净模式
// @namespace    CRJ-哔哩哔哩纯净模式
// @version      2024-07-23
// @match        *://*.bilibili.com/**
// @description  该用户脚本的目的是在B站（Bilibili）上实现一个所谓的“纯净模式”，通过隐藏推荐视频、直播推荐等元素来减少页面上的干扰，让用户能够更专注于观看视频内容。脚本通过定义一个`displayNone`函数来隐藏页面上特定的元素，然后通过创建一个新的`< style >`元素并添加CSS规则来实现这一目的。
// @license MIT

//©️版权信息
//作者：CRJ
//作者微信2640554600
//作者QQ2640554600
//Copyright CRJ All Rights Reserved.


// @downloadURL https://update.greasyfork.org/scripts/502600/CRJ-%E5%93%94%E5%93%A9%E5%93%94%E5%93%A9%E7%BA%AF%E5%87%80%E6%A8%A1%E5%BC%8F.user.js
// @updateURL https://update.greasyfork.org/scripts/502600/CRJ-%E5%93%94%E5%93%A9%E5%93%94%E5%93%A9%E7%BA%AF%E5%87%80%E6%A8%A1%E5%BC%8F.meta.js
// ==/UserScript==

(function() {
    'use strict';
    // Your code here...

    function displayNone(domTag) {
        const domSelector = document.querySelector(domTag)
        if(domSelector) {
            domSelector.style.display = 'none'
        }

    }

    // 创建一个新的<style>元素
    var style = document.createElement('style');
    style.type = 'text/css';
    // 定义CSS规则
    var css = `
    /* 下课客户端入口 */
    .download-entry,
    .download-client-trigger
    /* 首页推荐 */
    .bili-feed4-layout,
    /* 顶部推荐 */
    .header-channel,
    .header-channel-fixed,
    /* 推荐视频 */
    .recommend-list-v1,
    /* 直播间推荐 */
    .pop-live-small-mode {
        display: none!important;
    }
    `;

    if (style.styleSheet) {
        // 兼容IE的写法
        style.styleSheet.cssText = css;
    } else {
        // 其他浏览器的写法
        style.appendChild(document.createTextNode(css));
    }

    // 将样式应用到文档中
    document.head.appendChild(style);

    // home-page
    // vidoe-recommend
    displayNone('main.bili-feed4-layout')
    // displayNone('.header-channel')
    // displayNone('.header-channel-fixed')

    // video-page
    // vidoe-recommend-list
    // displayNone('.recommend-list-v1')

    // live-recommend
    // displayNone('.pop-live-small-mode')

})();