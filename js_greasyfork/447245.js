// ==UserScript==
// @name         百度翻译andCSDN广告占位去除
// @namespace    http://tampermonkey.net/
// @version      0.1.7
// @license      MIT
// @description  ad cleanup !
// @author       Fianlly
// @include        *.csdn.net/*
// @include        *://fanyi.baidu.com/*
// @icon         https://g.csdnimg.cn/static/logo/favicon32.ico
// @original-script https://greasyfork.org/zh-CN/scripts/447244-%E7%99%BE%E5%BA%A6%E7%BF%BB%E8%AF%91andcsdn%E5%B9%BF%E5%91%8A%E5%8D%A0%E4%BD%8D%E5%8E%BB%E9%99%A4
// @require           https://lf26-cdn-tos.bytecdntp.com/cdn/expire-1-M/jquery/3.2.1/jquery.min.js
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/447245/%E7%99%BE%E5%BA%A6%E7%BF%BB%E8%AF%91andCSDN%E5%B9%BF%E5%91%8A%E5%8D%A0%E4%BD%8D%E5%8E%BB%E9%99%A4.user.js
// @updateURL https://update.greasyfork.org/scripts/447245/%E7%99%BE%E5%BA%A6%E7%BF%BB%E8%AF%91andCSDN%E5%B9%BF%E5%91%8A%E5%8D%A0%E4%BD%8D%E5%8E%BB%E9%99%A4.meta.js
// ==/UserScript==

(function () {
  "use strict";

  /**
   * 去除百度翻译占位
   */
  function clearBaiduAds() {
    document.querySelector(".programmer1Box").remove();
    document.querySelector("#kp_box_479").remove();
    document.querySelector(".box-shadow").remove();
    document.querySelector("#footerRightAds").remove();
    document.querySelector("#asideNewNps").remove();
    document.querySelector("#recommendNps").remove();
  }

  /**
   *  去除CSDN占位
   */
  function clearCSDNAds() {
    document.querySelector(".trans-operation-wrapper").style.marginBottom =
      "20px";
    document.querySelector("#side-nav").remove();
    document.querySelector("#sideBannerContainer").remove();
    document.querySelector(".navigation-wrapper").remove();
    document.querySelector(".footer").remove();
    document.querySelector(".translate-setting").remove();
    document.querySelector(".domain-trans-wrapper").remove();
  }

  /**
   * csdn 首页广告
   */

  function homeAds() {
    document.querySelector(".so-questionnaire").remove();
    document.querySelectorAll(".www-home-content")[1].remove();
  }

  /**
   * csdn 复制功能
   */
  function csdnCopy() {
    const list = document.querySelectorAll("pre");
    for (let i = 0; i < list.length; i++) {
      const item = list[i];
      item.style.userSelect = "auto";
      item.firstChild.style.userSelect = "auto";
    }
  }

  /**
   * 去除csdn需要关注才能阅读全部
   */
  function closeFollow() {
    document.querySelector("#article_content").style.height = "auto";
    document.querySelector(".hide-article-box").remove();
  }

  try {
    homeAds();
  } catch (e) {
    console.log("homeAds-error:" + e);
  }

  try {
    clearBaiduAds();
  } catch (e) {
    console.log("baidu-error:" + e);
  }

  try {
    csdnCopy();
  } catch (e) {
    console.log("csdnCopy-error:" + e);
  }
  try {
    clearCSDNAds();
  } catch (e) {
    console.log("clearCSDNAds-error:" + e);
  }
  try {
    closeFollow();
  } catch (e) {
    console.log("closeFollow-error:" + e);
  }
})();
