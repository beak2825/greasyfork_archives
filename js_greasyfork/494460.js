// ==UserScript==
// @name         【屏蔽广告】百度热搜屏蔽
// @namespace    https://github.com/lischen2014/purify-baidu
// @version      0.11
// @description  屏蔽百度垃圾广告
// @author       王攀
// @match        https://www.baidu.com/*
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @grant        none
// @license      MIT

// @downloadURL https://update.greasyfork.org/scripts/494460/%E3%80%90%E5%B1%8F%E8%94%BD%E5%B9%BF%E5%91%8A%E3%80%91%E7%99%BE%E5%BA%A6%E7%83%AD%E6%90%9C%E5%B1%8F%E8%94%BD.user.js
// @updateURL https://update.greasyfork.org/scripts/494460/%E3%80%90%E5%B1%8F%E8%94%BD%E5%B9%BF%E5%91%8A%E3%80%91%E7%99%BE%E5%BA%A6%E7%83%AD%E6%90%9C%E5%B1%8F%E8%94%BD.meta.js
// ==/UserScript==

// 定义要屏蔽的广告选择器
var SearchResultAds = `#content_left [style*="display:block !important;visibility:visible !important"]`;

(function () {
  "use strict";

  // 获取要观察的目标节点（body）
  var targetNode = document.querySelector("body");

  // 设置 MutationObserver 的配置选项
  // childList: 观察目标节点的子节点是否有变化
  // subtree: 观察目标节点的所有后代节点
  var config = { childList: true, subtree: true };

  // 功能：移除热搜和其他广告
  var removeHotSearchAndAds = function () {
    // 移除搜索结果页侧边栏
    var baiduReSouSideBar = document.getElementById("content_right");
    if (baiduReSouSideBar) {
      baiduReSouSideBar.remove();
      console.log("搜索结果页侧边栏已关闭");
    }
    // 移除百度主页热搜框
    var baiduReSouInMainPage = document.getElementById("s-hotsearch-wrapper");
    if (baiduReSouInMainPage) {
      baiduReSouInMainPage.remove();
      console.log("主页热搜关键词已关闭");
    }

    // 移除默认搜索结果广告
    setTimeout(function () {
      // 使用选择器查询所有符合条件的广告元素
      var ads = document.querySelectorAll(SearchResultAds);
      // 遍历广告元素并将其移除
      ads.forEach(function (ad) {
        ad.remove();
        console.log("已屏蔽默认搜索结果广告");
      });
    }, 500); // 延迟500毫秒移除广告，以确保所有广告元素都已加载完成
  };

  // 功能：移除追加显示的广告
  var removeSpecificAds = function () {
    // 使用选择器查询所有符合条件的广告容器元素
    var candidates = document.querySelectorAll(
      "div.result.c-container.new-pmd"
    );
    // 遍历广告容器元素
    candidates.forEach((candidate) => {
      // 获取广告容器元素中的所有链接元素
      let links = candidate.querySelectorAll("div > a");
      // 遍历链接元素
      links.forEach((link) => {
        // 如果链接文本包含"广告"，则表示该链接指向广告内容
        if (link.textContent.includes("广告")) {
          // 移除包含广告链接的广告容器元素
          candidate.remove();
          console.log("追加生成广告已屏蔽");
        }
      });
    });
  };

  // MutationObserver回调函数
  var observer = new MutationObserver((mutations) => {
    mutations.forEach((mutation) => {
      // 如果有新节点被添加
      if (mutation.addedNodes && mutation.addedNodes.length) {
        removeHotSearchAndAds();
        setTimeout(removeSpecificAds, 300); // 针对动态加载内容，稍后重试
      }
    });
  });

  // 开始观察目标节点
  observer.observe(targetNode, config);
})();
