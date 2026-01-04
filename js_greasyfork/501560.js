// ==UserScript==
// @name         B站纯净模式
// @namespace    http://tampermonkey.net/
// @version      2024-07-23
// @description  Disappear Recommended Video
// @author       Villiam
// @match        *://*.bilibili.com/**
// @icon         https://www.google.com/s2/favicons?sz=64&domain=bilibili.com
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/501560/B%E7%AB%99%E7%BA%AF%E5%87%80%E6%A8%A1%E5%BC%8F.user.js
// @updateURL https://update.greasyfork.org/scripts/501560/B%E7%AB%99%E7%BA%AF%E5%87%80%E6%A8%A1%E5%BC%8F.meta.js
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