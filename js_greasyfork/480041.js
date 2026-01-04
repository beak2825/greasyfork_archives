// ==UserScript==
// @name         PubMed下载助手
// @namespace    https://greasyfork.org/zh-CN
// @version      1.0
// @description  PubMed下载的好助手!
// @author       LYS
// @match        https://pubmed.ncbi.nlm.nih.gov/*/
// @run-at       document-end
// @icon         none
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/480041/PubMed%E4%B8%8B%E8%BD%BD%E5%8A%A9%E6%89%8B.user.js
// @updateURL https://update.greasyfork.org/scripts/480041/PubMed%E4%B8%8B%E8%BD%BD%E5%8A%A9%E6%89%8B.meta.js
// ==/UserScript==

(function() {
    'use strict';
// 等待文档加载完成
$(document).ready(function () {
  // 设置定时器
  var interval = setInterval(function() {
    // 检查目标元素是否存在
    if ($(".identifier.doi .id-label:contains('DOI：')").length > 0) {
      // 目标元素存在，执行相应的操作

      // 清除定时器
      clearInterval(interval);

      // 查找包含 "DOI："的元素
      var doiElement = $(".identifier.doi .id-label:contains('DOI：')");

      var doiText = doiElement.next().text().trim();

      // 创建新的按钮元素
      var button = $("<button>尝试SCI-HUB下载</button>");

      // 定义按钮的点击事件
      button.click(function() {
        var url = "https://sci-hub.et-fine.com/" + doiText;
        window.open(url, "_blank"); // 在新页面中打开链接
      });

      // 将按钮插入到元素后面
      doiElement.parent().append(button);
    }
  }, 500);
});


})();