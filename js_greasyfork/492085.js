// ==UserScript==
// @name        [CSS]预加载CSS「CSDNGreener」
// @namespace   https://github.com/rikacelery
// @match       https://*.csdn.net/*
// @grant       GM_addStyle
// @run-at document-start
// @version     0.1.4
// @license MIT
// @author      rikacelery
// @description 提前加载一些CSS，减少页面闪烁
// @downloadURL https://update.greasyfork.org/scripts/492085/%5BCSS%5D%E9%A2%84%E5%8A%A0%E8%BD%BDCSS%E3%80%8CCSDNGreener%E3%80%8D.user.js
// @updateURL https://update.greasyfork.org/scripts/492085/%5BCSS%5D%E9%A2%84%E5%8A%A0%E8%BD%BDCSS%E3%80%8CCSDNGreener%E3%80%8D.meta.js
// ==/UserScript==
GM_addStyle(`
.toolbar-menus,
.toolbar-btn-msg,
.toolbar-btn-collect,
.toolbar-btn-mp,
.toolbar-btn-write,
li[title="阅读深度、前沿文章"],
li[title="系统学习·问答·比赛"],
li[title="高价值源码课程分享"],
li[title="找到志同道合的伙伴"],
li[title="开源代码托管"],
li[title="让你的灵感立即落地"],
li[title=""],
a.option-box.sidecolumn-show,
a.option-box.sidecolumn-hide,
a.option-box.sidecolumn-deepseek,
a.option-box.no-h,
a.option-box[data-type="app"],
a.option-box[data-type="guide"],
a.option-box[data-type="cs"],
a.option-box[data-type="report"],
.vip-caise,
.sidetool-writeguide-box,
.toolbar-btn-vip,
.blog_container_aside,
.recommend-right,
.side-chatdoc-desc-box,
#toolBarBox,
#asideWriteGuide,
.passport-login-container,
.passport-login-tip-container,
.btn-side-chatdoc-contentbox,
.hide-article-box,
#blogColumnPayAdvert,/*专栏订阅广告*/
.article-info-box/*专栏信息*/
{
  display:none !important;
}


#mainBox{
  width: 100%!important;
  margin:0!important;
}
/*页面宽度可缩到更小*/
body
{
  min-width:0px !important;
  width:100% !important;
}
.toolbar-container,
.toolbar-container-middle
{
  min-width:0px !important;
}
#csdn-toolbar{
  position: relative !important;;
  width:100vw !important;
}
#content_views .hl-1{
  background-image:none;
  padding:0;
  margin:0;
}
main
{
  width:calc(100vw - 24px) !important;
  max-width:unset!important;
}
.csdn-side-toolbar {
  left:unset!important;
  right:36px!important;
}
`)