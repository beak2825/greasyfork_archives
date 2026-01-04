// ==UserScript==
// @name         FreshDesk界面优化
// @namespace    https://fezibo.com/
// @version      1.5
// @description  FreshDesk界面优化，加宽侧边栏和iframe内容
// @author       zhang_jiujiu
// @include      https://youniverse-service.freshdesk.com/*
// @include      https://d3h0owdjgzys62.cloudfront.net/app-assets/04843c0cbe3fc79e8c26/app/template.html?appId=621
// @include      https://www.channelreply.com/freshdesk/app/*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/438087/FreshDesk%E7%95%8C%E9%9D%A2%E4%BC%98%E5%8C%96.user.js
// @updateURL https://update.greasyfork.org/scripts/438087/FreshDesk%E7%95%8C%E9%9D%A2%E4%BC%98%E5%8C%96.meta.js
// ==/UserScript==

(function () {
  if (window.location.href.indexOf("youniverse-service.freshdesk") > -1) {
    console.warn("等待修改sidebar宽度");
    setInterval(function () {
      const mainView = document.querySelector(".content-widget .ember-view");
      if (mainView) {
        mainView.style.right = "460px";
        document.querySelector(".sidebar").style.width = "500px";
        console.warn("已修改sidebar宽度");
      }
    }, 2000);
  }

  if (window.location.href.indexOf("d3h0owdjgzys62.cloudfront.net") > -1) {
    let p = setInterval(function () {
      if (document.getElementById("app-iframe")) {
        document.getElementById("app-iframe").style.width = "100%";
        console.warn("已修改app-iframe宽度");
        // clearInterval(p);
      }
    }, 2000);
  }

  if (window.location.href.indexOf("www.channelreply.com/freshdesk/app") > -1) {
    console.warn("等待修改iframe内容宽度");
    let p = setInterval(function () {
      if (document.getElementById("data-section")) {
        document.body.style.margin = "0";
        document.body.style.maxWidth = "100%";
        console.warn("已修改iframe内容宽度");
        // clearInterval(p);
      }
    }, 2000);
  }
})();
