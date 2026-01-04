// ==UserScript==
// @name         知乎界面简化
// @description  zhihu_sm
// @namespace    简化知乎网页样式|隐藏伪装标题
// @version      1.0
// @author       vizo
// @require      https://cdn.jsdelivr.net/npm/jquery@3.3.1/dist/jquery.min.js
// @include      *://*zhihu.com/*
// @run-at       document-body
// @grant        GM_addStyle
// @noframes
// @downloadURL https://update.greasyfork.org/scripts/391002/%E7%9F%A5%E4%B9%8E%E7%95%8C%E9%9D%A2%E7%AE%80%E5%8C%96.user.js
// @updateURL https://update.greasyfork.org/scripts/391002/%E7%9F%A5%E4%B9%8E%E7%95%8C%E9%9D%A2%E7%AE%80%E5%8C%96.meta.js
// ==/UserScript==

'use strict'

GM_addStyle(`
  .AppHeader-inner,
  .ColumnPageHeader-content,
  .Question-sideColumn,
  .Post-Author .Button,
  
  img {
    opacity: 0.1 !important;
    transition: opacity 0.4s;
  }
  
  .AppHeader-inner:hover,
  .ColumnPageHeader-content:hover,
  .Question-sideColumn:hover,
  .RichContent-cover:hover img,
  .Post-Author .Button:hover,
  
  img:hover {
    opacity: 0.8 !important;
  }
  
  .QuestionHeader,
  .PageHeader {
    opacity: 0.03 !important;
    transition: 0.4s;
  }
  .QuestionHeader:hover,
  .PageHeader:hover {
    opacity: 0.8 !important;
  }
  
  .GlobalSideBar,
  .ContentItem-actions>* {
    opacity: 0.3 !important;
    transition: 0.4s;
  }
  .GlobalSideBar:hover,
  .ContentItem-actions:hover >* {
    opacity: 0.8 !important;
  }
  
  
  
  .ZhihuLogo {
    opacity: 0.4 !important;
  }
  body {
    color: #66656d;
  }
  .ztext blockquote {
    color: #878b8e;
  }
  iframe,
  .Post-SideActions {
    opacity: 0.2 !important;
  }
  
  .Pc-feedAd-card-title,
  .Pc-feedAd-card-content,
  .Pc-feedAd-card-brand-wrapper>span,
  a {
    color: #9c9fa2;
  }
  .advert-signpc-label {
    color: #f00;
    background: #ffe1e1;
  }
  
`)

$(function () {
  const init = () => {
    changeTitle()
    changeIcon()
  }
  
  const changeTitle = () => {
    document.title = 'zhi-Github'
  }
  
  const changeIcon = () => {
    let icon = $('html').find('link[type="image/x-icon"]')
    icon.attr('href', 'https://github.githubassets.com/favicon.ico')
  }
  
  
  init()
  
})