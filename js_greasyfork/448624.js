// ==UserScript==
// @name         豆瓣小组暗黑主题
// @namespace    http://tampermonkey.net/
// @version      0.4
// @description  PC端豆瓣小组暗黑主题
// @author       YW
// @license      MIT
// @match        https://www.douban.com/group/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=douban.com
// @run-at       document-start
// @grant        GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/448624/%E8%B1%86%E7%93%A3%E5%B0%8F%E7%BB%84%E6%9A%97%E9%BB%91%E4%B8%BB%E9%A2%98.user.js
// @updateURL https://update.greasyfork.org/scripts/448624/%E8%B1%86%E7%93%A3%E5%B0%8F%E7%BB%84%E6%9A%97%E9%BB%91%E4%B8%BB%E9%A2%98.meta.js
// ==/UserScript==

(function () {

  "use strict";
  // 覆盖样式
  const cssText = `
    .dark_control{
      float: right;
      line-height: 28px;
      margin-right: 5px;
      cursor: pointer;
    }
    html.dark {
      --dark-theme-background: #262626;
      --dark-theme-color: #cdcdcd;
      --dark--theme-a-link: #cdcdcd;
      --dark--theme-a-visited: #a3a3a3;
      --dark--theme-dashed-border: 1px dashed #4a4a4a;
      --dark--theme-uname-background: #363636;
      --dark--theme-uname-color: #a5a5a5;
      --dark--theme-tx-background: #5c5c5c;
      --dark--theme-search-border: #6a6a6a;
      --dark--theme-logo: invert(87%) hue-rotate(180deg);
      --dark--theme-tabs: #5c5c5c;
      --dark--theme-pl: #898989;
      --dark--theme-unset: unset;
      --dark--theme-green: #23a548;
      --dark--theme-group-board: #b5b5b5;
      --dark--theme-group-visited: #606060;
      --dark--theme-nav: #1a1a1a;
      --dark--theme-fff: #fff;
    }
    body {
      background: var(--dark-theme-background);
      color: var(--dark-theme-color);
      min-height: 100vh ;
      transition: all 0.25s linear;
    }

    /* 顶部nav */
    .global-nav {
      background-color: var(--dark-theme-background, #545652) !important;
    }
    #db-nav-group {
      background: var(--dark-theme-background, #f0f6f3) !important;
    }
    #db-nav-group .nav-logo {
      filter: var(--dark--theme-logo, invert(0%) hue-rotate(0deg))
    }
    
    /* 表头 */
    .olt .th td,.member-info1 {
      color: var(--dark-theme-color, #666) !important;
    }
    #content h1 {
      color: var(--dark-theme-color, #494949) !important;
    }
    /* 分割虚线 */
    #g-side-info-member {
      border-bottom: 1px solid var(--dark--theme-group-visited, 1px solid #e3e3e3) !important;
    }
    .olt td {
      border-bottom: var(--dark--theme-dashed-border, 1px dashed #DDDDDD) !important;
    }
    #footer {
      border-top: var(--dark--theme-dashed-border, 1px dashed #ddd) !important;
    }
    /* 发言按钮 */
    .secondary.dui-button.apricot {
      background-color: var(--dark-theme-background, #FEF6ED) !important;
      color: var(--dark-theme-color, #E09014) !important;
    }
    /* 帖子标题 */
    .profile-entry .info p a:link,.olt td a:link,.bg-img-green h4 a:link {
      color: var(--dark--theme-a-link, #37a) !important;
    }
    .profile-entry .info p a:visited,.olt td a:visited,.bg-img-green h4 a:visited {
      color: var(--dark--theme-a-visited, #666699) !important;
    }
    .profile-entry .info p a:hover,.olt td a:hover, .bg-img-green h4 a:hover,
    .topic-list a:hover {
      color: var(--dark--theme-a-link, #fff) !important;
      background: #37a;
    }
    div a:hover {
      color: var(--dark--theme-a-link, #fff) !important;
      background: #37a;
    } 
    a:link {
      color: var(--dark--theme-a-link, #37a);
    }
    a:visited {
      color: var(--dark--theme-a-visited, #666699);
    }
    /* 搜索框 */
    /* 边框 */
    #db-nav-group .nav-search .inp{
      border: 1px solid var(--dark--theme-search-border, #e1e9e1) !important;
    }
    /* 背景 */
    .nav-search .inp input {
      background: var(--dark-theme-background, #fff) !important;
    }
    /* 按钮 */
    #db-nav-group .nav-search .inp-btn {
      border:1px solid var(--dark--theme-search-border, #e1e9e1) !important;
    }

    /* 帖子内容 */
    h3 .from {
      color: var(--dark-theme-color, #666666) !important;
    }
    .topic-content .topic-doc p,h2 {
      color: var(--dark-theme-color, #111) !important;
    }
    /* 发言人 */
    .bg-img-green {
      background: var(--dark--theme-uname-background, #f2fbf2) !important;
    }
    .nlst, .nlst h3, .bg-img-green h4{
      background-color: var(--dark--theme-uname-background, #f0f6f3) !important;
    }
    /* 发布时间 */
    .pubtime {
      color: var(--dark--theme-uname-color, #666) !important;
    }
    .tabs {
      border-bottom: 1px solid var(--dark--theme-tabs, #e6e6e6) !important;
    }
    /* 最新谈论发言人 */
    .pl {
      color: var(--dark--theme-pl, #666666) !important;
    }
    .topic-list li {
      border-bottom: var(--dark--theme-dashed-border, 1px dashed #ddd) !important;
    }
    .reply-quote {
      border-left: 2px solid var(--dark--theme-search-border, #ddd) !important;
    }
    .reply-quote .short {
      color: var(--dark--theme-a-visited ,#666)
    }
    .cmt-img {
      border: 1px solid var(--dark--theme-search-border, #f5f5f5) !important;
    }
    /* 投票 */
    .poll-wrapper {
      background-color: 1px sloid var(--dark-theme-background,#fafafa) !important;
      border: 1px solid var(--dark--theme-search-border, #dfdfdf) !important;
    }
    .poll-label {
      border-bottom: 1px solid var(--dark--theme-search-border, #e6e6e6) !important;
    }
    .disabled.poll-btn {
      background-color: var(--dark--theme-tabs, #e6e6e6) !important;
    }
    .list li {
      border-top: var(--dark--theme-dashed-border, 1px dashed #e6e6e6) !important;
    }

    /* 广告 */
    #dale_group_topic_new_top_right,#dale_group_topic_new_inner_middle,
    #dale_group_topic_new_download_middle,#dale_group_topic_doublemint,
    #dale_group_topic_new_bottom_right,#dale_group_home_new_top_right,
    #dale_newgroup_home_inner_middle,#dale_newgroup_home_bottom_right_201211,
    #dale_group_home_middle_right,#dale_each_group_home_bottom_right,
    #dale_each_group_home_bottom_right,#dale_group_more_discussion_top_right,
    #dale_group_more_discussion_inner_top,#dale_group_explore_bottom_right{
      display: none
    }
    .aside {
      bottom: unset !important;
    }

    /* 评论 */
    .comment-wrapper {
      border: 1px solid var(--dark--theme-search-border, #ccc) !important;
    }
    #last {
      background: var(--dark--theme-tx-background) ;
      color: var(--dark-theme-color) ;
    }
    .color-green {
      color: var(--dark--theme-green, #072) !important;
    }

    /* 我的小组首页 */
    .profile-entry {
      background: var(--dark-theme-background, #f9f9f9) !important;
    }
    .olt .td-reply {
      color: var(--dark-theme-color, #666) !important;
    }
    .topics h2{
      border-bottom: 1px solid var(--dark--theme-group-visited, #dcdcdc)
    }
    /* 小组首页 */
    .group-board {
      background: var(--dark-theme-background, #fff4e8) !important;
      border: 1px solid var(--dark--theme-group-visited, #fff) !important;
    }
    .group-info-item {
      color: var(--dark-theme-color, #111) !important;
      border-top: var(--dark--theme-dashed-border, 1px dashed rgba(0,0,0,0.3)) !important;
    }
    .group-info-item a:visited {
      color: var(--dark--theme-group-visited, #666699) !important;
    }
    .group-cards li {
      border: 1px solid var(--dark--theme-group-visited, #eee) !important;
    }
    .profile-nav {
      border-bottom: 1px solid var(--dark--theme-group-visited, #dcdcdc) !important;
    }
    .user-card {
      background: var(--dark-theme-background, #f9f9f9) !important;
    }
    .group-info-item .item-title {
      color: var(--dark-theme-color, #191919) !important;
    }
    .group-action {
      border-top: none !important;
    }
    .group-info-item:first-child {
      border-top: 0 !important;
    }
    .group-topic-search {
      border: 1px solid var(--dark--theme-search-border, #eaeaea) !important;
    }
    .group-topic-search .inp input {
      color: var(--dark-theme-color, #111) !important;
    }
    .dou-preview-image-popup {
      background-color: var(--dark-theme-background, #fff) !important;
    }
    .editor .editor-input {
      background: var(--dark-theme-background, #fff) !important;
      color: var(--dark--theme-a-link ,#111) !important;
      border: 1px solid var(--dark--theme-group-board, #fff) !important;
    }
    /* 发帖 */
    .DraftEditor-editorContainer span {
      color: var(--dark--theme-a-link ,#111) !important;
    }
    .editor-preview-article-content blockquote, .editor-preview-article-content p {
      color: var(--dark-theme-color, #111) !important;
    }
    .editor-preview-title {
      color: var(--dark-theme-color, #494949) !important;
    }
    .channel-item .block {
      color: var(--dark-theme-color, #999) !important;
      background: var(--dark--theme-group-visited, #f9f9f9) !important;
    }
    .channel-item .bd,.channel-group-rec li {
      border-bottom: 1px solid var(--dark--theme-a-visited, #e5e5e5) !important;
    }
    .channel-group-rec .bd {
      border-top: 1px solid var(--dark--theme-a-visited, #e5e5e5) !important;
    }
  `
  GM_addStyle(cssText);

  const href = window.location.href
  if(href.indexOf('group/people') === -1) {
    GM_addStyle(`
      .topics {
        border-top: 1px solid var(--dark--theme-search-border, #ededed) !important;
      }
    `)
  } else if (href.indexOf('group/explore') === -1) {
    GM_addStyle(`
      .aside .mod .hd{
        border-bottom: 1px solid var(--dark--theme-search-border, #eee) !important; 
      }
    `)
  }
  
  let theme = window.localStorage.getItem("theme_style");
  if (!theme) {
    window.localStorage.setItem("theme_style", "light");
    theme = "light";
  } else if (theme === "dark") {
    // changeDarkTheme();
    document.documentElement.classList.add('dark')
  }

  window.onload = function () {
    const darkControl = document.createElement("div");
    darkControl.setAttribute("class", "dark_control");
    darkControl.innerHTML = theme === "light" ? "切换至深色" : "切换至浅色";
    darkControl.addEventListener("click", () => {
      console.log("theme", theme);
      if (theme === "light") {
        document.documentElement.classList.add('dark')
        theme = "dark";
        darkControl.innerHTML = "切换至浅色";
        window.localStorage.setItem("theme_style", "dark");
      } else {
        document.documentElement.classList.remove('dark')
        theme = "light";
        darkControl.innerHTML = "切换至深色";
        window.localStorage.setItem("theme_style", "light");
      }
    });

    const bd = document.getElementsByClassName("bd");
    const topnav = document.getElementsByClassName("global-nav-items");
    bd[0].insertBefore(darkControl, topnav[0]);
  };
})();
