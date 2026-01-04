// ==UserScript==
// @name         RARBG一键复制磁力链接
// @namespace    http://shenhaisu.cc/
// @version      1.0
// @description  只是用鼠标一次点击完成磁力链接的复制
// @author       ShenHaiSu_KimSama
// @match        https://rarbgmirror.org/torrent/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=rarbgmirror.org
// @require      https://cdn.jsdelivr.net/npm/clipboard@2.0.10/dist/clipboard.min.js
// @grant        GM_setClipboard
// @license      MIT
// @noframes
// @downloadURL https://update.greasyfork.org/scripts/458573/RARBG%E4%B8%80%E9%94%AE%E5%A4%8D%E5%88%B6%E7%A3%81%E5%8A%9B%E9%93%BE%E6%8E%A5.user.js
// @updateURL https://update.greasyfork.org/scripts/458573/RARBG%E4%B8%80%E9%94%AE%E5%A4%8D%E5%88%B6%E7%A3%81%E5%8A%9B%E9%93%BE%E6%8E%A5.meta.js
// ==/UserScript==

(function () {
  // 删除奇怪的div
  document.querySelector(".header2+td>div").remove();
  // 创建元素并挂载
  let newNode = document.createElement("button");
  let targetNode = document.querySelector(".header2+td");
  let hrefAddress = targetNode.children[2].href;
  newNode.innerText = "| Copy |";
  newNode.addEventListener("click", () => GM.setClipboard(hrefAddress));
  // 挂载标签
  targetNode.appendChild(newNode);
})();
