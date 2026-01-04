// ==UserScript==
// @name         知乎Plus
// @namespace    zhihu_plus
// @version      0.3
// @description  知乎Plus: 1. 暗色极简阅读模式；2. 去除官方或用户插入的广告
// @author       Gaofang Huang
// @match        https://*.zhihu.com/*
// @match        https://v.vzuu.com/video/*
// @match        https://video.zhihu.com/video/*
// @connect      zhihu.com
// @connect      vzuu.com
// @require      https://cdn.bootcdn.net/ajax/libs/jquery/3.5.1/jquery.min.js
// @require      https://cdn.bootcdn.net/ajax/libs/jquery-cookie/1.4.1/jquery.cookie.min.js
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/411416/%E7%9F%A5%E4%B9%8EPlus.user.js
// @updateURL https://update.greasyfork.org/scripts/411416/%E7%9F%A5%E4%B9%8EPlus.meta.js
// ==/UserScript==

// 图标-眼睛关
const iconEyeClose = `<svg t="1600160078250" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="1172" width="200" height="200"><path d="M0 0h853.333333v853.333333H0z" fill="#FFFFFF" opacity=".01" p-id="1173"></path><path d="M942.933333 566.442667a32.256 32.256 0 0 1-2.602666 46.805333 36.693333 36.693333 0 0 1-22.741334 8.490667 35.584 35.584 0 0 1-25.856-10.965334l-85.248-91.605333c-0.512-0.512-0.512-0.981333-1.024-1.493333-44.458667 23.893333-95.104 41.813333-153.472 51.797333l35.626667 104.533333a32.426667 32.426667 0 0 1-21.674667 41.813334 40.704 40.704 0 0 1-10.88 1.493333 34.133333 34.133333 0 0 1-32.554666-22.869333l-39.765334-116.522667a1012.650667 1012.650667 0 0 1-166.912-0.981333l-38.229333 111.530666a34.133333 34.133333 0 0 1-32.554667 22.869334 40.704 40.704 0 0 1-10.88-1.493334c-18.090667-5.973333-27.904-24.362667-21.674666-41.813333l34.602666-101.077333c-62.506667-12.458667-112.64-31.872-153.472-56.277334l-90.965333 97.621334a33.962667 33.962667 0 0 1-25.813333 10.965333 34.602667 34.602667 0 0 1-22.741334-8.490667c-13.952-12.458667-15.488-33.365333-2.56-46.805333l86.272-93.098667c-31.530667-24.917333-57.344-52.778667-81.152-80.64a32.426667 32.426667 0 0 1 5.205334-46.848 35.370667 35.370667 0 0 1 48.554666 4.992c59.434667 70.229333 141.056 166.826667 392.192 166.826667 254.762667 0 342.101333-93.141333 385.536-162.858667a34.773333 34.773333 0 0 1 47.018667-11.434666c16.512 9.472 21.674667 29.866667 11.861333 45.312a366.976 366.976 0 0 1-84.736 94.122666l80.64 86.101334z" fill="#8590a6" p-id="1174"></path></svg>`

// 图标-眼睛开
const iconEyeOpen = `<svg t="1600160150452" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="1307" width="200" height="200"><path d="M0 0h853.333333v853.333333H0z" fill="#8590a6" opacity=".01" p-id="1308"></path><path d="M512 341.333333a170.666667 170.666667 0 1 1 0 341.333334 170.666667 170.666667 0 0 1 0-341.333334z m0 64a106.666667 106.666667 0 1 0 0 213.333334 106.666667 106.666667 0 0 0 0-213.333334z" fill="#8590a6" p-id="1309"></path><path d="M513.664 170.666667c143.658667 0 299.52 91.221333 467.626667 273.664l14.08 15.402666a85.333333 85.333333 0 0 1-0.725334 114.986667C823.253333 760.448 662.912 853.333333 513.706667 853.333333c-145.066667 0-301.44-88.106667-469.162667-264.32l-14.421333-15.36a85.333333 85.333333 0 0 1-0.426667-115.626666C204.8 266.453333 366.165333 170.666667 513.664 170.666667z m0 64c-126.122667 0-272.554667 86.954667-436.778667 266.538666a21.333333 21.333333 0 0 0-2.56 25.472l2.389334 3.157334 14.122666 15.018666c156.8 164.736 298.325333 244.48 422.826667 244.48 128.213333 0 273.493333-84.138667 433.962667-258.048a21.333333 21.333333 0 0 0 2.773333-25.301333l-2.346667-3.157333-13.781333-15.146667C777.088 317.141333 636.16 234.666667 513.664 234.666667z" fill="#8590a6" p-id="1310"></path></svg>`

;(function () {
  'use strict'

  // 添加自定义样式
  const userStyle = document.createElement('style')
  userStyle.innerHTML = createUserStyle()
  $('head').append(userStyle)
  $('html').attr('data-plus', 'true')

  // 添加插件按钮
  const $plusButton = $(
    `<div class="switch-plus-btn"><div class="switch-plus-icon">${iconEyeClose}</div></div>`
  )
  $plusButton.click(() => {
    if ($('html').attr('data-plus') == 'true') {
      $('html').attr('data-plus', 'false')
      $('.switch-plus-icon').html(iconEyeClose)
      $.cookie('plusMode', 0, { expires: 365, path: '/', domain: 'zhihu.com' })
    } else {
      $('html').attr('data-plus', 'true')
      $('.switch-plus-icon').html(iconEyeOpen)
      $.cookie('plusMode', 1, { expires: 365, path: '/', domain: 'zhihu.com' })
    }
  })
  if ($('.switch-plus-btn').length === 0) {
    $('body').append($plusButton)
  }
  if (Number($.cookie('plusMode')) === 1) {
    $('html').attr('data-plus', 'true')
    $('.switch-plus-icon').html(iconEyeOpen)
  } else {
    $('html').attr('data-plus', 'false')
    $('.switch-plus-icon').html(iconEyeClose)
  }

  // 外站地址直接跳转
  const webHost = window.location.host
  if (webHost === 'link.zhihu.com') {
    const rule = /target=(.+?)(&|$)/
    const regRet = location.search.match(rule)
    if (regRet && regRet.length === 3) {
      location.href = decodeURIComponent(regRet[1])
    }
  }

})()

function createUserStyle() {
  return `
  .switch-plus-btn {
    position: fixed;
    right: 40px;
    top: 15px;
    cursor: pointer;
    font-size: 12px;
    z-index: 999;
  }
  .switch-plus-icon svg {
    width: 24px;
    height: 24px;
  }
  /* 滚动条优化 */
  html[data-plus=true] .Favlists-items::-webkit-scrollbar,
  html[data-plus=true] .highlight pre::-webkit-scrollbar,
  html[data-plus=true] body::-webkit-scrollbar,
  html[data-plus=true] .CommentListV2::-webkit-scrollbar {
    width: 4px;
    height: 4px;
  }
  html[data-plus=true] .Favlists-items::-webkit-scrollbar-thumb,
  html[data-plus=true] .highlight pre::-webkit-scrollbar-thumb,
  html[data-plus=true] body::-webkit-scrollbar-thumb,
  html[data-plus=true] .CommentListV2::-webkit-scrollbar-thumb {
    background-color: rgb(133 144 166 / 0.2);
    transition: 0.2s;
    border-radius: 2px;
  }
  html[data-plus=true] .Favlists-items::-webkit-scrollbar-track,
  html[data-plus=true] .highlight pre::-webkit-scrollbar-track,
  html[data-plus=true] body::-webkit-scrollbar-track,
  html[data-plus=true] .CommentListV2::-webkit-scrollbar-track {
      background-color: rgba(0,0,0,0);
  }
  html[data-plus=true] .Favlists-items::-webkit-scrollbar-thumb,
  html[data-plus=true] .highlight pre::-webkit-scrollbar-thumb,
  html[data-plus=true] body::-webkit-scrollbar-thumb,
  html[data-plus=true] .CommentListV2:hover::-webkit-scrollbar-thumb {
      background-color: rgb(133 144 166 / 0.6);
  }
  /* 隐藏界面 */
  html[data-plus=true] .SearchSideBar,
  html[data-plus=true] .SearchTabs,
  html[data-plus=true] .PostIndex-Contributions,
  html[data-plus=true] .Recommendations-Main,
  html[data-plus=true] .ColumnPageHeader,
  html[data-plus=true] .Topstory-mainColumn .TopstoryItem--advertCard,
  html[data-plus=true] .TopstoryMain .TopstoryItem--advertCard,
  html[data-plus=true] .RichText-MCNLinkCardContainer,
  html[data-plus=true] .Reward,
  html[data-plus=true] .ContentItem-meta .AuthorInfo + .Labels,
  html[data-plus=true] .QuestionHeader,
  html[data-plus=true] .Question-sideColumn,
  html[data-plus=true] .GlobalSideBar,
  html[data-plus=true] .AppHeader {
    display: none !important;
  }
  /* 布局调整 */
  html[data-plus=true] .SearchMain,
  html[data-plus=true] .Question-mainColumn,
  html[data-plus=true] .Topstory-mainColumn {
    margin-left: auto;
    margin-right: auto;
  }
  /* 全局背景色 */
  html[data-plus=true] body {
    background: #333333;
  }
  /* 卡片背景色 & 内容工具栏 */
  html[data-plus=true] .Post-content {
    background: transparent;
  }
  html[data-plus=true] .HotListNavEditPad {
    background: #c9cdd8;
    border-color: #b6b8c3;
  }
  html[data-plus=true] .HotListNav-item--deleteButton {
    background: #a4adb3;
  }
  html[data-plus=true] .RichContent-actions.is-fixed,
  html[data-plus=true] .Post-RichTextContainer,
  html[data-plus=true] .ProfileHeader-wrapper,
  html[data-plus=true] .CommentsV2-withPagination,
  html[data-plus=true] .CommentEditorV2-inputWrap--active,
  html[data-plus=true] .CommentsV2-footer,
  html[data-plus=true] .CommentListV2-header-divider,
  html[data-plus=true] .Topbar,
  html[data-plus=true] .Modal-inner,
  html[data-plus=true] .InputLike,
  html[data-plus=true] .HotItem,
  html[data-plus=true] .HotListNav-wrapper,
  html[data-plus=true] .ContentItem-actions,
  html[data-plus=true] .Card {
    background: #bfc2ca;
  }
  html[data-plus=true] .Post-Main .Post-Title {
    color: #bfc2ca;
  }
  html[data-plus=true] .Post-Header {
    margin-bottom: 20px;
  }
  html[data-plus=true] .Post-RichTextContainer {
    box-sizing: border-box;
    padding: 20px;
    border-radius: 8px;
  }
  html[data-plus=true] .RichContent-actions {
    padding-left: 10px;
  }
  html[data-plus=true] .Highlight em {
    color: #5f649c;
  }
  /* 点赞按钮 */
  html[data-plus=true] .Post-SideActions button.like .Post-SideActions-icon,
  html[data-plus=true] .Tag,
  html[data-plus=true] .HotListNav-item,
  html[data-plus=true] .VoteButton {
    background: rgb(138 138 138 / 10%);
    color: #8590a6;
  }
  html[data-plus=true] .HotListNav-item.is-active {
    background: rgb(32 43 74 / 10%);
    color: #8590a6;
  }
  html[data-plus=true] .Button--blue {
    color: #7d94a9;
    border-color: #8fa5b9;
  }
  html[data-plus=true] .VoteButton.is-active {
    background: rgb(51 57 125 / 10%);
    color: #8590a6;
  }
  html[data-plus=true] .Button--primary.Button--blue {
    background: rgb(191 194 202);
    color: #50638a;
  }
  html[data-plus=true] .Modal-closeIcon {
    fill: #8590a6;
  }
  html[data-plus=true] .Post-SideActions button.like {
    color: #8590a6;
  }
  /* tab栏 & 卡片 */
  html[data-plus=true] .Favlists-item,
  html[data-plus=true] .CommentsV2-pagination,
  html[data-plus=true] .CommentsV2-withPagination,
  html[data-plus=true] .CommentEditorV2-inputWrap--active,
  html[data-plus=true] .NestComment .NestComment--child:after,
  html[data-plus=true] .NestComment--rootComment:after,
  html[data-plus=true] .NestComment:not(:last-child):after,
  html[data-plus=true] .Topbar,
  html[data-plus=true] .List-item+.List-item:after,
  html[data-plus=true] .List-header,
  html[data-plus=true] .Topstory--old .HotItem:not(:first-child),
  html[data-plus=true] .Topstory--old .HotListNav,
  html[data-plus=true] .Topstory-mainColumnCard .Card:not(.Topstory-tabCard),
  html[data-plus=true] .Topstory-tabs {
    border-color: rgb(181 185 197);
  }
  html[data-plus=true] .TopstoryTabs-link {
    color: #8590a6;
  }
  html[data-plus=true] .TopstoryTabs-link.is-active {
    color: #333333;
    font-weight: 600;
  }
  /* 查看更多 */
  html[data-plus=true] .ContentItem-more {
    color: rgb(106 114 119);
  }
  /* 卡片封面 & 标识 */
  html[data-plus=true] .css-18biwo,
  html[data-plus=true] .Avatar,
  html[data-plus=true] .HotItem-img,
  html[data-plus=true] .RichContent-cover {
    opacity: 0.45;
  }
  /* 返回顶部按钮 */
  html[data-plus=true] .CornerButton {
    background: #484b54;
  }
  /* 热度序号 */
  html[data-plus=true] .HotItem-hot {
    color: #4d72ab;
  }
  html[data-plus=true] .HotItem-label {
    background-color: #4d72ab !important;
  }
  /* 没有更多 */
  html[data-plus=true] .HotList-end {
    color: #47494c;
  }
  html[data-plus=true] .HotList-end:after, .HotList-end:before {
    background-color: #47494c;
  }
  /* 评论输入框 */
  html[data-plus=true] .ZVideoLinkCard-info,
  html[data-plus=true] .CommentsV2-footer {
    background-color: #b9beca;
  }
  html[data-plus=true] .CommentsV2-footer {
    border-color: #b6b9c1;
  }
  html[data-plus=true] .CommentEditorV2-inputWrap {
    border-color: #b6b9c1;
    background-color: #b9beca;
  }
  `
}
