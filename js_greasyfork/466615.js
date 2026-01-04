// ==UserScript==
// @name         gitee广告隐藏
// @namespace
// @include      *://gitee.com
// @include      *://gitee.com/*
// @version      0.0.2
// @description  简单的gitee广告隐藏
// @author       ymzhao
// @namespace 
// @license      MIT
// @grant        GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/466615/gitee%E5%B9%BF%E5%91%8A%E9%9A%90%E8%97%8F.user.js
// @updateURL https://update.greasyfork.org/scripts/466615/gitee%E5%B9%BF%E5%91%8A%E9%9A%90%E8%97%8F.meta.js
// ==/UserScript==
GM_addStyle(`
    .gitee-stars-main-widget, /* 项目页及其他模块页固定定位广告 */
    #git-bulletin, /* 顶部公告 .fixed-notice-infos */
    #notice-app .wechat-banner, /* 通知页微信消息通知 */
    #__next>.fixed /* gitee首页固定定位的广告及控件 */
    {
        display: none !important;
    }
`);