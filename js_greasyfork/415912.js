// ==UserScript==
// @name         csdn广告隐藏(顶部及侧边)
// @namespace
// @include      *://*.csdn.net
// @include      *://*.csdn.net/*
// @match        *://*.csdn.net/*
// @version      0.7.10
// @description  通过简单的css隐藏csdn顶部及侧边广告；取消博文中被csdn不要face插入的牛皮藓链接
// @author       ymzhao
// @namespace 
// @license      MIT
// @grant        GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/415912/csdn%E5%B9%BF%E5%91%8A%E9%9A%90%E8%97%8F%28%E9%A1%B6%E9%83%A8%E5%8F%8A%E4%BE%A7%E8%BE%B9%29.user.js
// @updateURL https://update.greasyfork.org/scripts/415912/csdn%E5%B9%BF%E5%91%8A%E9%9A%90%E8%97%8F%28%E9%A1%B6%E9%83%A8%E5%8F%8A%E4%BE%A7%E8%BE%B9%29.meta.js
// ==/UserScript==
GM_addStyle(`
    /* 顶部菜单 */
    #csdn-toolbar .toolbar-advert, /* 广告 */
    #csdn-toolbar .toolbar-btn .csdn-toolbar-creative-mp, /* “创作中心”hover弹框 */
    #csdn-toolbar .toolbar-btn-vip, /* “VIP” */
    #csdn-plugin-vip, /* “会员中心”hover弹框 */

    /* 博客文章 - 左侧栏目 */
    #remuneration, /* 创作酬劳 */
    #asideWriteGuide, /* 写作提示 */
    #footerRightAds, /* 会员关闭广告 */
    #swiper-remuneration-container, /* 轮播-创作助手+广告 */
    
    /* 博客文章 - 右侧栏目 */
    .recommend-right_aside .rightside-fixed-hide,
    
    /* 右侧固定工具栏广告及无用工具 */
    .csdn-common-logo-advert,
    .csdn-side-toolbar a[data-type="app"],
    .csdn-side-toolbar a[data-type="mpNps"],
    .csdn-side-toolbar a[data-type="guide"],
    .csdn-side-toolbar a[data-type="vip"],
    .csdn-side-toolbar .sidetool-writeguide-box .activity-swiper-box,
    .csdn-side-toolbar .sidetool-writeguide-box .tip-box,
    .csdn-side-toolbar .btn-side-chatdoc-contentbox .side-chatdoc-desc-box,
    #recommend-right .programmer1Box, /* 工具栏上方广告位 */

    /* 博客文章 - 其它 */
    #toolBarBox .write-guide-buttom-box, /* 文末工具栏写作提示 */
    #recommendNps, /* 文末“相关推荐”反馈 */

    /* 博客主页 */
    #kp_box_www_swiper, /* 右侧轮播广告 */
    #kp_box_www_swiper_ban,
    #www-home-silde .ContentBlock, /* 右侧轮播广告下面的乐色社区 */
    .article-header .ai-title-box, /* AI标题 */

    /* 博客主页 - 左侧非常规版块 */
    .user-profile-body .user-profile-aside>div:not(.user-profile-aside-common-box),
    .blog_container_aside .swiper-slide-box-remuneration,

    /* 其它 */
    [class*="advert"],
    .so-questionnaire, /* 问卷 */
    .blog-rank-footer,
    #asideNewNps, /* 您愿意向朋友推荐“博客详情页”吗？ */
    .top-special-info-pos,
    #nps-box,
    .csdn-reapck-select /* 全屏模态框(平台红包用) */
    {
        display: none !important;
    }

    /* fvking csdn highlight: 取消博文中被插入的“GitCode”牛皮藓链接 */
    main #content_views .hl-git-1 {
        pointer-events: none !important;
        color: inherit !important;
        background-image: none !important;
        background: initial;
        margin-right: 0;
        padding-right: 0;
        cursor: inherit;
    }

    /* fvking csdn highlight: 取消博文中被插入的“csdn搜索”牛皮藓链接 */
    main #content_views .hl-1 {
        pointer-events: none !important;
        color: inherit !important;
        background-image: none !important;
        background: initial;
        margin-right: 0;
        padding-right: 0;
        padding-left: 0;
        cursor: inherit;
    }
`);