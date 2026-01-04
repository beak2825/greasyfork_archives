// ==UserScript==
// @name         百度题库直接显示答案，去除遮盖和广告
// @namespace    http://tampermonkey.net/
// @version      0.1.3
// @description  去除【百度题库】页面“查看答案”中对“查看答案与解析”的遮挡，去除会员广告。移除了更多无关内容。参考脚本：https://greasyfork.org/zh-CN/scripts/461406
// @author       Albresky
// @license      GPL v3
// @match        *://easylearn.baidu.com/edu-page/*
// @icon         https://www.baidu.com/favicon.ico
// @grant        none
// @run-at document-end
// @downloadURL https://update.greasyfork.org/scripts/462394/%E7%99%BE%E5%BA%A6%E9%A2%98%E5%BA%93%E7%9B%B4%E6%8E%A5%E6%98%BE%E7%A4%BA%E7%AD%94%E6%A1%88%EF%BC%8C%E5%8E%BB%E9%99%A4%E9%81%AE%E7%9B%96%E5%92%8C%E5%B9%BF%E5%91%8A.user.js
// @updateURL https://update.greasyfork.org/scripts/462394/%E7%99%BE%E5%BA%A6%E9%A2%98%E5%BA%93%E7%9B%B4%E6%8E%A5%E6%98%BE%E7%A4%BA%E7%AD%94%E6%A1%88%EF%BC%8C%E5%8E%BB%E9%99%A4%E9%81%AE%E7%9B%96%E5%92%8C%E5%B9%BF%E5%91%8A.meta.js
// ==/UserScript==

(function () {
  "use strict";
  let log_prefix = "[BDWK]";

  let mask = null;
  let tigan = null;
  let vipContentClasses = [".feedback-icon"];
  let vipContentDiv = [];

  window.addEventListener("scroll", fuckScroll);

  rmMask();

  function log(msg) {
    console.log(log_prefix + msg);
  }

  function rmMask() {
    let t = setInterval(function () {
      mask = document.querySelectorAll(".mask");
      tigan = document.querySelector(".tigan");
      getVipContent();
      if (tigan && mask) {
        log("show full tigan");
        tigan.classList.add("tigan-auto");
        log("mask found");
        for (let m of mask) {
          m.remove();
          log("mask removed.");
        }
        rmVipContent();
        clearInterval(t);
      }
    }, 100);
  }

  function getVipContent() {
    for (let c of vipContentClasses) {
      let vipContent = document.querySelector(c);
      if (vipContent) {
        vipContentDiv.push(vipContent);
        vipContentClasses.filter((item) => item != vipContent);
      }
    }
  }

  function rmVipContent() {
    for (let div of vipContentDiv) {
      if (div) {
        div.remove();
        log(div + " removed");
      }
    }
  }

  function rmVipBanner() {
    let t = setInterval(function () {
      let vipBanner = document.querySelector(".vip-banner-cont");
      if (vipBanner) {
        vipBanner.remove();
        log("vip-banner removed");
        clearInterval(t);
      }0
    }, 100);
  }

  function rmShijuancont() {
    let t = setInterval(function () {
      let shijuancont = document.querySelector(".shijuan-cont");
      if (shijuancont) {
        shijuancont.remove();
        log("shijuan-cont removed");
        clearInterval(t);
      }
    }, 100);
  }

   function rmVideo() {
    let t = setInterval(function () {
      let Video = document.querySelector(".question-video-cont");
      if (Video) {
        Video.remove();
        log("question-video-cont removed");
        clearInterval(t);
      }
    }, 100);
  }


  function fuckScroll() {
    var t = document.documentElement.scrollTop || document.body.scrollTop;
    if (t >= 0) {
      rmVipBanner();
      rmShijuancont();
      rmVideo();
    }
  }


})();
