// ==UserScript==
// @name         掘金广告隐藏
// @namespace
// @include      *://juejin.cn
// @include      *://juejin.cn/*
// @match        *://juejin.cn/*
// @version      0.0.4
// @description  通过简单的css隐藏掘金广告及无用内容
// @author       ymzhao
// @namespace 
// @license      MIT
// @grant        GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/534466/%E6%8E%98%E9%87%91%E5%B9%BF%E5%91%8A%E9%9A%90%E8%97%8F.user.js
// @updateURL https://update.greasyfork.org/scripts/534466/%E6%8E%98%E9%87%91%E5%B9%BF%E5%91%8A%E9%9A%90%E8%97%8F.meta.js
// ==/UserScript==
GM_addStyle(`
    /* 首页 */
    .index-aside>.sidebar-block.banner-block, /* 右侧栏广告 */
    .view-container>.top-banners-container, /* 顶部广告 */
    .main-nav-list .special-activity-item,  /* 顶部菜单旁 */
    /* 博文页 */
    article .author-info-block+img /* 文章标题下广告 */
    {
        display: none !important;
    }
    /* 顶部菜单定位调整 */
    .main-header.header-with-banner {
        top: 0;
    }
`);