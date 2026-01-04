// ==UserScript==
// @name         simpleCSDN
// @namespace    https://github.com/BackMountainDevil/simpleCSDN
// @supportURL   https://github.com/BackMountainDevil/simpleCSDN/issues
// @version      0.0.2
// @license      MIT
// @description  油猴脚本 优雅的浏览 CSDN（去广告、布局调整），尊重隐私
// @author       小易
// @match        *://blog.csdn.net/*/article/details/*
// @grant        none
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/433559/simpleCSDN.user.js
// @updateURL https://update.greasyfork.org/scripts/433559/simpleCSDN.meta.js
// ==/UserScript==
(function () {
  'use strict';

  var cssFix = document.createElement('style');
  cssFix.innerHTML += '.toolbar-advert{display:none !important;}'; // 顶部广告
  /* 顶部的导航栏 */
  cssFix.innerHTML += '.toolbar-logo{display:none !important;}'; // 最左侧的 logo
  cssFix.innerHTML += '.toolbar-menus{display:none !important;}'; // 博客、课程、下载、问答、社区、插件、认证（单个隐藏太费劲）
  cssFix.innerHTML += '.toolbar-btn-vip{display:none !important;}'; // 右侧的会员中心
  /* 根据 id 或者 类名 隐藏左侧栏目 */
  cssFix.innerHTML += '#asideProfile{display:none !important;}'; // 博主头像、数据、徽章
  cssFix.innerHTML += '#asideSearchArticle{display:none !important;}'; // 搜博主文章
  cssFix.innerHTML += '#asidedirectory{display:none !important;}'; // 目录
  cssFix.innerHTML += '#asideHotArticle{display:none !important;}'; // 热门文章
  cssFix.innerHTML += '#asideNewComments{display:none !important;}'; // 最新评论
  cssFix.innerHTML += '#asideCategory{display:none !important;}'; // 分类专栏
  cssFix.innerHTML += '#asideNewNps{display:none !important;}'; // 向朋友推荐
  var asideArchive = document.getElementById('asideArchive'); // 最新文章新办法隐藏
  asideArchive.remove();
  cssFix.innerHTML += '#footerRightAds{display:none !important;}'; // 广告
  /* 根据 id 或者 类名 隐藏底部栏目 */
  cssFix.innerHTML += '#copyright-box{display:none !important;}'; // 几乎没人想看的备案号
  cssFix.innerHTML += '.recommend-box{display:none !important;}'; // 相关文章
  cssFix.innerHTML += '.template-box{display:none !important;}'; // 皮肤主题显示栏（我又不能调，显摆用？）
  cssFix.innerHTML += '.left-toolbox{display:none !important;}'; // 没什么用的贴在底部的三连
  cssFix.innerHTML += '.csdn-side-toolbar{display:none !important;}'; // 广告、新手引导、客服、举报、很慢的回到顶部
  /* 容器宽度由默认的固定值修改为百分比，为主体内容铺开留下空间 */
  cssFix.innerHTML += '.nodata .container{width:100%;}';
  cssFix.innerHTML += '.column-group{display:none !important;}'; // 文章所属专栏和专栏文章的数量
  document.getElementsByTagName('head')[0].appendChild(cssFix); // 实施隐藏

  var content = document.getElementsByTagName('main')[0]; // 铺开内容主体
  content.style.width='100%';
})();