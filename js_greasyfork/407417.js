// ==UserScript==
// @name        H2P: CSDN、掘金界面清爽
// @namespace   http://tampermonkey.net/
// @version     0.0.8
// @icon        https://csdnimg.cn/cdn/content-toolbar/csdn-logo.png?v=20200416.1
// @description CSDN、掘金界面清爽
// @author      H2P
// @compatible  chrome
// @match       *://www.csdn.net*
// @match       *://so.csdn.net/so/search/s.do?*
// @match       *://blog.csdn.net/*
// @match       *://juejin.im/*
// @note        2020.07.20-V0.0.01      搜索界面和博客界面元素隐藏
// @note        2020.07.20-V0.0.02      点赞栏位置固定
// @note        2020.07.20-V0.0.03-05   搜索、分类专栏位置调整
// @note        2020.07.20-V0.0.06-08   清爽掘金部分网页
// @downloadURL https://update.greasyfork.org/scripts/407417/H2P%3A%20CSDN%E3%80%81%E6%8E%98%E9%87%91%E7%95%8C%E9%9D%A2%E6%B8%85%E7%88%BD.user.js
// @updateURL https://update.greasyfork.org/scripts/407417/H2P%3A%20CSDN%E3%80%81%E6%8E%98%E9%87%91%E7%95%8C%E9%9D%A2%E6%B8%85%E7%88%BD.meta.js
// ==/UserScript==

(function() {
  'use strict';

  const $H2P = function (xpath, one = true) {
    if (one) { return document.querySelector(xpath); }
    else { return Array.from(document.querySelectorAll(xpath)); }
  }

  const isCSDN        = window.location.href.includes('csdn');
  const isCSDNHome    = window.location.href.includes('/www.csdn.net');
  const isCSDNSearch  = window.location.href.includes('/so.csdn.net/so/search/');
  const isCSDNBlog    = window.location.href.includes('/blog.csdn.net/');
  
  const isJueJin        = window.location.href.includes('juejin');

  let eleStyle = document.createElement('style');

  if (isCSDN) {
    if (isCSDNHome) {
      // 中间轮播广告、右侧轮播广告 begin
      eleStyle.innerHTML += `
        main .carousel .carousel-left { width: 100%!important; }
        .slide-outer.right_top,
        li.clearfix[data-type=other] { display: none!important; }
      `;
      // CSND 信息
      eleStyle.innerHTML += `
        .right_box.csdn-tracking-statistics,
        .persion_article { display: none!important; }
      `;
    }
    else if (isCSDNSearch) {
      // 右侧边栏
      eleStyle.innerHTML += `
        .con-r { display: none!important; }
        @media screen and (min-width: 900px) {
          .con-l { width: 100%; }
          .con-l .con-l-right { width: calc(100% - 104px); }
        }
      `;
    } else if (isCSDNBlog) {
      // 博主勋章
      eleStyle.innerHTML += `
        .aside-box-footer { display: none!important; }
      `;
      // 导航栏、主体
      eleStyle.innerHTML += `
        .csdn-toolbar { position: fixed!important; z-index: 9999; top: 0!important; }
        .main_father { margin-top: 44px!important; overflow-x: hidden!important; }
        .main_father main { margin-bottom: 10px!important; }
      `;
      // 右侧推荐、最新评论、热门文章
      eleStyle.innerHTML += `
        .recommend-right_aside, #asideNewComments,
        #asideHotArticle { display: none!important; }
        .more-toolbox .left-toolbox { position: relative!important; }
        aside.blog_container_aside { position: fixed!important; top: auto!important; bottom: auto!important; left: auto!important; z-index: 0!important; }
      `;
      // 分类专栏
      eleStyle.innerHTML += `
        #asideCategory > .aside-content { max-height: fit-content!important; overflow-y: scroll!important; }
        #asideCategory > .aside-content + p.text-center { display: none!important; }
      `;
      // 举报
      eleStyle.innerHTML += `
        .csdn-side-toolbar { display: none!important; }
      `;
      // 主体下方推荐、抢沙发
      eleStyle.innerHTML += `
        .first-recommend-box, .second-recommend-box,
        .recommend-item-box.recommend-recommend-box,
        .recommend-other-item-box,
        img.comment-sofa-flag { display: none!important; }
      `;
      // 皮肤主题、底部
      eleStyle.innerHTML += `
        .template-box, .bottom-pub-footer { display: none!important; }
      `;
    }

    // 调换分类专栏位置
    let ele = document.createElement('aside');
    ele.id = 'h2p-aside-right';
    ele.classList.add('blog_container_aside');
    let invl = setInterval(() => {
      if ($H2P('div#rightAside')) {
        $H2P('div#rightAside').appendChild(ele);
        window.clearInterval(invl);
        invl = null;
        let invl1 = setInterval(() => {
          if ($H2P('div#asideSearchArticle')) {
            $H2P('aside#h2p-aside-right').appendChild($H2P('div#asideSearchArticle'));
            window.clearInterval(invl1);
            invl1 = null;
          }
        }, 100);
        let invl2 = setInterval(() => {
          if ($H2P('div#asideCategory')) {
            $H2P('aside#h2p-aside-right').appendChild($H2P('div#asideCategory'));
            window.clearInterval(invl2);
            invl2 = null;
          }
        }, 100);
      }
    }, 100);
  } else if (isJueJin) {
    // 导航栏
    eleStyle.innerHTML += `
      .nav-banner { width: 100%!important; }
    `;
    // 搜索框大小
    eleStyle.innerHTML += `
      .search-form, .search-form .search-input { width: 100%!important; }
    `;
    // 掘金小册、下载、微信交流群
    eleStyle.innerHTML += `
      .index-book-collect, .app-download-sidebar-block,
      .wechat-sidebar-block { display: none!important; }
    `;

    // ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++ //
    // 
    //                                                              juejin post
    // 
    // ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++ //
    // 点赞位置
    eleStyle.innerHTML += `
      .article-suspended-panel { top: 81px!important; }
    `;
    // 作者信息、相关文章、目录位置
    eleStyle.innerHTML += `
      .author-block { position: fixed!important; width: 240px!important; }
      .related-entry-sidebar-block { position: fixed!important; width: 240px; top: 300px!important; }
      .sticky-block-box { position: fixed!important; width: 240px!important; left: calc(50% + 480px + 20px);!important; }
    `;
    // 作者广告
    eleStyle.innerHTML += `
      .article-banner { display: none!important; }
    `;

    // ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++ //
    // 
    //                                                              juejin search
    // 
    // ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++ //
    // 搜索 - 综合
    eleStyle.innerHTML += `
      .nav-block { justify-content: flex-start!important; }
      .result-list, .main-list { max-width: none!important; }
    `;
    // 搜索 - 文章、标签、用户
    eleStyle.innerHTML += `
      .entry-list, .tag-list, .user-list { max-width: none!important; }
    `;
  }
  document.head.appendChild(eleStyle);
})();