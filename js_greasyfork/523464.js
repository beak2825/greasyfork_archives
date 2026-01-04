// ==UserScript==
// @name         谷歌搜索萌娘百科净化
// @namespace    http://tampermonkey.net/
// @version      0.4
// @description  去除谷歌搜索结果中重复的moegirl页面，并重定向到镜像站
// @author       Sakari
// @match        https://www.google.*/*search?*
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/523464/%E8%B0%B7%E6%AD%8C%E6%90%9C%E7%B4%A2%E8%90%8C%E5%A8%98%E7%99%BE%E7%A7%91%E5%87%80%E5%8C%96.user.js
// @updateURL https://update.greasyfork.org/scripts/523464/%E8%B0%B7%E6%AD%8C%E6%90%9C%E7%B4%A2%E8%90%8C%E5%A8%98%E7%99%BE%E7%A7%91%E5%87%80%E5%8C%96.meta.js
// ==/UserScript==

(function () {
  "use strict";

  // 用户可选的功能，设置为true将zh.moegirl.org.cn的链接改为目标链接
  const rewriteLinks = true;
  // 重定向目标链接，可以根据需要修改
  const targetDomain = "moegirl.icu";
  // 搜索结果中包含以下域名的链接将被隐藏
  const dedupDomains = ["moegirl.icu", "moegirl.uk", "mzh.moegirl.org.cn"];

  // 获取搜索关键词
  const query = new URLSearchParams(window.location.search).get("q");

  // 检查关键词是否包含"萌娘"或"moegirl"
  if (
    query &&
    (query.includes("萌娘") || query.toLowerCase().includes("moegirl"))
  ) {
    console.log('关键词中包含"萌娘"或"moegirl"，禁用后续处理。');
    return; // 禁用后续处理
  }

  // 等待页面加载完成
  window.onload = function () {
    // 获取所有搜索结果
    let results = document.querySelectorAll("div#kp-wp-tab-overview");

    results.forEach((result) => {
      // 找到包含链接的元素
      let linkElement = result.querySelector("a");

      if (linkElement) {
        let url = linkElement.href;

        // 检查链接是否是moegirl页面
        if (dedupDomains.some((domain) => url.includes(domain))) {
          result.style.display = "none";
        }
        if (url.includes("zh.moegirl.org.cn")) {
          if (url.includes("zh.moegirl.org.cn/zh-tw") || url.includes("zh.moegirl.org.cn/zh-hk")) {
            // 去除搜索结果中重复的moegirl页面
            result.style.display = "none";
          }
          // 如果rewriteLinks为true，将zh.moegirl.org.cn的链接改为目标链接
          if (rewriteLinks) {
            linkElement.href = url.replace("zh.moegirl.org.cn", targetDomain);
          }
        }
      }
    });
  };
})();