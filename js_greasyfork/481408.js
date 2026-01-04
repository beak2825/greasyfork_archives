// ==UserScript==
// @name         百度不挂科重定向—百度题库去遮挡答案
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  百度不挂科重定向→百度题库去遮挡、去广告
// @author       SilenceSik 
// @match        *://easylearn.baidu.com/edu-page/*
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/481408/%E7%99%BE%E5%BA%A6%E4%B8%8D%E6%8C%82%E7%A7%91%E9%87%8D%E5%AE%9A%E5%90%91%E2%80%94%E7%99%BE%E5%BA%A6%E9%A2%98%E5%BA%93%E5%8E%BB%E9%81%AE%E6%8C%A1%E7%AD%94%E6%A1%88.user.js
// @updateURL https://update.greasyfork.org/scripts/481408/%E7%99%BE%E5%BA%A6%E4%B8%8D%E6%8C%82%E7%A7%91%E9%87%8D%E5%AE%9A%E5%90%91%E2%80%94%E7%99%BE%E5%BA%A6%E9%A2%98%E5%BA%93%E5%8E%BB%E9%81%AE%E6%8C%A1%E7%AD%94%E6%A1%88.meta.js
// ==/UserScript==



(function () {
  "use strict";

  // 获取当前页面的 URL
  var url = window.location.href;

  // 检查是否为需要重定向的 URL 格式
  if (url.startsWith("https://easylearn.baidu.com/edu-page/tiangong/bgkdetail?id=")) {
      // 从 URL 中提取 ID 参数
      var id = url.split("id=")[1];

      // 构造新的 URL
      var newUrl = "https://easylearn.baidu.com/edu-page/tiangong/questiondetail?id=" + id;

      // 重定向到新 URL
      window.location.href = newUrl;
  }

  let log_prefix = "[BDWK]";

  let mask = null;
  let tigan = null;

  // 等待页面加载完成
  window.onload = function() {
    rmMask();
  };

  function log(msg) {
    console.log(log_prefix + msg);
  }

  function rmMask() {
    let t = setInterval(function () {
      mask = document.querySelectorAll(".mask");
      tigan = document.querySelector(".tigan");
      if (tigan && mask) {
        log("show full tigan");
        tigan.classList.add("tigan-auto");
        log("mask found");
        for (let m of mask) {
          m.remove();
          log("mask removed.");
        }

        // 屏蔽题目内容
        let docContV2 = document.querySelector("#app > div > div:nth-child(1) > div.container > div.left-wrap > div.left > div.question-cont > div.timu-wrap.common-block > div.doc-cont-v2");
        if (docContV2) {
          docContV2.style.display = "none";
          log("question content blocked");
        }

        // 屏蔽VIP广告
        let vipBannerCont = document.querySelector("#app > div > div:nth-child(1) > div.container > div.vip-banner-cont");
        if (vipBannerCont) {
          vipBannerCont.style.display = "none";
          log("VIP banner blocked");
        }

        // 屏蔽题目预览
        let docPreview = document.querySelector("#app > div > div:nth-child(1) > div.container > div.left-wrap > div.left > div.doc-preview");
        if (docPreview) {
          docPreview.style.display = "none";
          log("question preview blocked");
        }

        // 屏蔽右侧区域
        let rightDiv = document.querySelector("#app > div > div:nth-child(1) > div.container > div.right");
        if (rightDiv) {
          rightDiv.style.display = "none";
          log("right area blocked");
        }

        // 屏蔽视频解析
        let questionVideo = document.querySelector("#questionVideo");
        if (questionVideo) {
          questionVideo.style.display = "none";
          log("video analysis blocked");
        }

        // 屏蔽业务元素线
        let businessElLine = document.querySelector("#app > div > div:nth-child(1) > div.container > div.left-wrap > div.left > div.business-el-line");
        if (businessElLine) {
          businessElLine.style.display = "none";
          log("business element line blocked");
        }

        // 修改题干高度为150px
        let tiganDiv = document.querySelector("#app > div > div:nth-child(1) > div.container > div.left-wrap > div.left > div.question-cont > div.timu-wrap.common-block > div.tigan");
        if (tiganDiv) {
          tiganDiv.style.height = "150px";
          log("tigan height modified to 150px");
        }

        clearInterval(t);
      }
    }, 100);

    // 使用 MutationObserver 监听 DOM 树变化
    const observer = new MutationObserver(mutations => {
      mutations.forEach(mutation => {
        mutation.addedNodes.forEach(node => {
          if (node.nodeType === Node.ELEMENT_NODE) {
            // 如果新增节点是元素节点
            if (node.matches('#app > div > div:nth-child(1) > div.container > div.right')) {
              // 如果是右侧区域元素
              node.style.display = 'none';
              log('right area blocked');
            } else if (node.matches('#questionVideo')) {
              // 如果是视频解析元素
              node.style.display = 'none';
              log('video analysis blocked');
            }
          }
        });
      });
    });

    // 开始观察
    observer.observe(document.body, {childList: true, subtree: true});
  }
})();