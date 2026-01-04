// ==UserScript==
// @name        全国中小学高校教师发展平台/新疆财经大学继续教育
// @namespace   可可教育
// @version     1.0
// @description 自动看课||自动换课||自动刷新||自动完成所有课程
// @author      可可
// @match       *://*.edueva.org/*
// @match       *://xuexi.chinabett.com/*
// @icon        keke31h
// @grant       none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/483675/%E5%85%A8%E5%9B%BD%E4%B8%AD%E5%B0%8F%E5%AD%A6%E9%AB%98%E6%A0%A1%E6%95%99%E5%B8%88%E5%8F%91%E5%B1%95%E5%B9%B3%E5%8F%B0%E6%96%B0%E7%96%86%E8%B4%A2%E7%BB%8F%E5%A4%A7%E5%AD%A6%E7%BB%A7%E7%BB%AD%E6%95%99%E8%82%B2.user.js
// @updateURL https://update.greasyfork.org/scripts/483675/%E5%85%A8%E5%9B%BD%E4%B8%AD%E5%B0%8F%E5%AD%A6%E9%AB%98%E6%A0%A1%E6%95%99%E5%B8%88%E5%8F%91%E5%B1%95%E5%B9%B3%E5%8F%B0%E6%96%B0%E7%96%86%E8%B4%A2%E7%BB%8F%E5%A4%A7%E5%AD%A6%E7%BB%A7%E7%BB%AD%E6%95%99%E8%82%B2.meta.js
// ==/UserScript==
(function () {
  'use strict';

  const tooltips = document.createElement("h2");
  tooltips.innerHTML = `<h1 style="text-align:center;color:black;padding:20px 0;margin:0;">可可学习助手提示您：</h1>脚本已经开始运行，请不需要操作该窗口，如果需要玩电脑请新开个浏览器窗口运行，谢谢！不想自己挂的可以联系keke31h，提供全部完成服务。`;
  tooltips.style.cssText = `
    color: red;
    display: inline-block;
    width: 500px;
    line-height: 2;
    background-color: white;
    padding: 20px 40px;
    position: fixed;
    bottom: 10vh;
    left: 5vw;
    z-index: 9999;
    box-shadow: 0 10px 20px rgb(0 0 0 / 20%);
  `;
  document.body.append(tooltips);

  document.addEventListener("visibilitychange", handleVisibilityChange);

  function handleVisibilityChange() {
    if (document.visibilityState === "visible" && document.URL.search('PrjStudent/Index') > 1) {
      setTimeout(() => {
        window.location.reload();
      }, 1000);
    }
  }
})();