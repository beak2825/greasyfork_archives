// ==UserScript==
// @name         CSDN去除收费项、免登录复制、免登录查看需关注的内容、沉浸式阅读
// @namespace    http://tampermonkey.net/
// @version      2.0
// @description  1.CSDN去除无用信息沉浸式阅读  2.免登录复制 3.免登录查看需要关注才能看的内容
// @description  更新内容（2023-04-07）==> 1、还原显示付费下载内容  2、删除多余显示项  3、修复部分页面显示问题
// @author       Mr.Chen
// @match        https://blog.csdn.net/*/article/details/*
// @match        https://*.blog.csdn.net/article/details/*
// @match        https://so.csdn.net/*
// @icon         https://www.google.com/s2/favicons?domain=csdn.net
// @grant        GM_addStyle
// @grant        unsafeWindow
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/438906/CSDN%E5%8E%BB%E9%99%A4%E6%94%B6%E8%B4%B9%E9%A1%B9%E3%80%81%E5%85%8D%E7%99%BB%E5%BD%95%E5%A4%8D%E5%88%B6%E3%80%81%E5%85%8D%E7%99%BB%E5%BD%95%E6%9F%A5%E7%9C%8B%E9%9C%80%E5%85%B3%E6%B3%A8%E7%9A%84%E5%86%85%E5%AE%B9%E3%80%81%E6%B2%89%E6%B5%B8%E5%BC%8F%E9%98%85%E8%AF%BB.user.js
// @updateURL https://update.greasyfork.org/scripts/438906/CSDN%E5%8E%BB%E9%99%A4%E6%94%B6%E8%B4%B9%E9%A1%B9%E3%80%81%E5%85%8D%E7%99%BB%E5%BD%95%E5%A4%8D%E5%88%B6%E3%80%81%E5%85%8D%E7%99%BB%E5%BD%95%E6%9F%A5%E7%9C%8B%E9%9C%80%E5%85%B3%E6%B3%A8%E7%9A%84%E5%86%85%E5%AE%B9%E3%80%81%E6%B2%89%E6%B5%B8%E5%BC%8F%E9%98%85%E8%AF%BB.meta.js
// ==/UserScript==

    // 如果为详情页则去除无用内容，开起沉浸式阅读
    GM_addStyle(`
        .blog_container_aside,#rightAside,.recommend-box,#treeSkill,#blogExtensionBox,#recommendNps,#toolBarBox,.comment-box-old,.insert-baidu-box,.blog-footer-bottom,.blog-footer-bottom,.comment-box,.template-box,.column-group,#csdn-toolbar,.csdn-side-toolbar,#passportbox,.passport-login-container,.hide-article-box{display:none!important;}
        .article_content{height:auto!important} #content_views pre code{user-select:text !important}
    `);

    // 调整主页面大小
    document.querySelector('#mainBox').style.width='100%';
    document.getElementsByTagName('main')[0].style.width='100%'