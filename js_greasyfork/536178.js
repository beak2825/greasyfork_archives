// ==UserScript==
// @name         百鸽裁定按钮重定向为dev分支
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  修改 ygocdb.com 上“裁定”链接中的 latest 为 dev
// @author       coccvo
// @match        https://ygocdb.com/*
// @icon         https://ygocdb.com/favicon.ico
// @grant        none
// @run-at       document-idle
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/536178/%E7%99%BE%E9%B8%BD%E8%A3%81%E5%AE%9A%E6%8C%89%E9%92%AE%E9%87%8D%E5%AE%9A%E5%90%91%E4%B8%BAdev%E5%88%86%E6%94%AF.user.js
// @updateURL https://update.greasyfork.org/scripts/536178/%E7%99%BE%E9%B8%BD%E8%A3%81%E5%AE%9A%E6%8C%89%E9%92%AE%E9%87%8D%E5%AE%9A%E5%90%91%E4%B8%BAdev%E5%88%86%E6%94%AF.meta.js
// ==/UserScript==

(function() {
  // 获取所有"裁定"按钮元素
  const Buttons = document.querySelectorAll('a[href*="ocg-rule.readthedocs.io/zh_CN/latest/"]');

  // 遍历每个按钮并修改链接
 Buttons.forEach(button => {
    const latestlink = button.href;
    // 将"latest"替换为"dev"（不区分大小写）
    const devlink = latestlink.replace(/latest/i, 'dev');
    button.href = devlink;
  });
})();