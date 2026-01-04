// ==UserScript==
// @name         CSDN Clean
// @name:zh-CN   CSDN净化
// @namespace    https://slaier.github.io/
// @version      1.4
// @author       slaier
// @description  csdn align center, auto readmore, clean clipboard, no login.
// @description:zh-cn CSDN去广告后居中，自动展开，去除剪贴板劫持，免登录。请配合ABP规则使用：https://raw.githubusercontent.com/Slaier/AdBlockRule/master/AdBlockCN.txt。
// @include      https://blog.csdn.net/*/article/details/*
// @grant        GM_addStyle
// @icon         https://csdnimg.cn/public/favicon.ico
// @run-at       document-idle
// @downloadURL https://update.greasyfork.org/scripts/387955/CSDN%20Clean.user.js
// @updateURL https://update.greasyfork.org/scripts/387955/CSDN%20Clean.meta.js
// ==/UserScript==

(function () {
    'use strict';
    console.log(` %c CSDN净化 %c https://slaier.github.io/ `, `color: #fadfa3; background: #23b7e5; padding:5px;`, `background: #1c2b36; padding:5px;`);
    if (navigator.userAgent.indexOf("Android") > -1){ // 安卓
      $(".article_content").removeAttr("style"),
      $(".readall_box").show().addClass("readall_box_nobg"),
      $(".readall_box").hide().addClass("readall_box_nobg");
      GM_addStyle('body { padding-bottom: 0 !important;}');
      $(".view_comment>a").text("展开所有评论");
    }
    else {
      console.log("请配合ABP规则使用：https://raw.githubusercontent.com/Slaier/AdBlockRule/master/AdBlockCN.txt");
      GM_addStyle('* { margin: auto; padding: 0;}');
      GM_addStyle('main { float: unset;}');
      localStorage.setItem("anonymousUserLimit", ""); // 免登陆
      csdn.clearReadMoreBtn(); // 自动展开 
      $("#btnMoreComment>span").remove(); // 登录误触
      if (csdn.copyright){
        csdn.copyright.init("", "", ""); //去除剪贴板劫持
      }
    }
})();