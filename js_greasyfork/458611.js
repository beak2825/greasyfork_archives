// ==UserScript==
// @name         1ptba/hdfans-快捷下载种子
// @namespace    http://shenhaisu.cc/
// @version      1.1
// @description  在主页列表添加一个按键下载种子文件，不用打开详情页面
// @author       ShenHaiSu_KimSama
// @match        https://1ptba.com/torrents.php
// @match        https://1ptba.com/torrents.php?*
// @match        https://hdfans.org/torrents.php
// @match        https://hdfans.org/torrents.php?*
// @grant        none
// @license      MIT
// @noframes
// @downloadURL https://update.greasyfork.org/scripts/458611/1ptbahdfans-%E5%BF%AB%E6%8D%B7%E4%B8%8B%E8%BD%BD%E7%A7%8D%E5%AD%90.user.js
// @updateURL https://update.greasyfork.org/scripts/458611/1ptbahdfans-%E5%BF%AB%E6%8D%B7%E4%B8%8B%E8%BD%BD%E7%A7%8D%E5%AD%90.meta.js
// ==/UserScript==

(function () {
  // 种子列表：/torrents.php?inclbookmarked=0&incldead=1&spstate=0&page=1
  // 种子详情：/details.php?id=8785&hit=1
  // 种子下载：/download.php?id=8785
  let baseURL = location.origin;
  document
    .querySelectorAll("table.torrentname>tbody")
    .forEach((item) => mainfunc(item));

  function mainfunc(tbody) {
    let newNode = document.createElement("button");
    let targetURL = `${baseURL}/download.php?id=${getTorrentID(tbody)}`;
    newNode.innerText = "下载";
    newNode.style.fontSize = "12px";
    tbody.firstChild.children[2].firstChild.appendChild(newNode);
    newNode.addEventListener("click", () => open(targetURL));
  }

  function getHref(tbody) {
    return tbody.firstChild.children[1].querySelector("a[href]").href || "null";
  }

  function getTorrentID(tbody) {
    return getHref(tbody)
      .match(/id=[\w]+/)[0]
      .replace("id=", "");
  }
})();
