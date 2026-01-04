// ==UserScript==
// @name               下载百度书签
// @name:zh-CN         下载百度书签
// @name:en            Download BaiDu bookmarks
// @description        下载百度首页导航中的书签，生成JSON和HTML文件。
// @description:zh-CN  下载百度首页导航中的书签，生成JSON和HTML文件。
// @description:en     Download the bookmarks of Baidu homepage.
// @namespace          https://github.com/HaleShaw
// @version            1.1.0
// @author             Hale Shaw
// @copyright          2020+, HaleShaw (https://github.com/HaleShaw)
// @license            AGPL-3.0-or-later
// @homepage           https://github.com/HaleShaw/TM-DownBaiDuBookmark
// @supportURL         https://github.com/HaleShaw/TM-DownBaiDuBookmark/issues
// @contributionURL    https://www.jianwudao.com/
// @icon               https://www.baidu.com/favicon.ico
// @match              https://www.baidu.com
// @match              https://www.baidu.com/
// @match              http://www.baidu.com
// @match              http://www.baidu.com/
// @license            AGPL-3.0-or-later
// @compatible	       Chrome
// @grant              none
// @downloadURL https://update.greasyfork.org/scripts/391482/%E4%B8%8B%E8%BD%BD%E7%99%BE%E5%BA%A6%E4%B9%A6%E7%AD%BE.user.js
// @updateURL https://update.greasyfork.org/scripts/391482/%E4%B8%8B%E8%BD%BD%E7%99%BE%E5%BA%A6%E4%B9%A6%E7%AD%BE.meta.js
// ==/UserScript==

(function () {
  'use strict';

  let jsonData = {};
  let htmlData = `
    <!DOCTYPE NETSCAPE-Bookmark-file-1>
    <META HTTP-EQUIV="Content-Type" CONTENT="text/html; charset=UTF-8">
    <TITLE>Bookmarks</TITLE>
    <H1>Bookmarks</H1>
    <DL><p>
    `;

  main();

  function main() {
    if (document.querySelectorAll('.cate-list_16dim').length == 0) {
      console.warn("No bookmarks! Please make sure you are logged in and switched to the bookmarks tab.");
      return;
    }
    getBaiDuBookmarks();
    const fileName = getFileName();
    downloadFile(JSON.stringify(jsonData), fileName + '.json');
    downloadFile(htmlData, fileName + '.html');
  }

  /**
   * 获取百度首页中“我的关注-我的导航”中的收藏夹
   */
  function getBaiDuBookmarks() {
    let titles = document.querySelectorAll('.cate-list_16dim');
    let linkParents = document.querySelectorAll('.cate-site-container.cate-site-container_ditOw');
    for (let i = 0; i < titles.length; i++) {
      let links = linkParents[i].children;
      if (links.length != 0) {
        var category = titles[i].firstChild.textContent;
        var list = [];
        let h = `    <DT><H3 PERSONAL_TOOLBAR_FOLDER="true">${category}</H3>\n`;
        h += '        <DL><p>\n';
        for (let j = 0; j < links.length; j++) {
          let link = new Object;
          link.title = links[j].children[0].children[1].textContent;
          link.url = links[j].children[0].children[1].href;
          link.img = links[j].children[0].children[0].children[0].getAttribute("src");
          list[j] = link;
          h += `            <DT><A HREF="${link.url}">${link.title}</A>\n`;
        }
        h += '        </DL><p>\n';
        htmlData += h;
        jsonData[category] = list;
      }
    }
    htmlData += '</DL><p>';
  }

  function getFileName() {
    let date = new Date();
    let month = date.getMonth() + 1;
    return "bookmarks_" + date.getFullYear() + month + date.getDate();
  }

  /**
   * 将数据根据文件名下载到本地
   * @param {Object} obj 需要下载的数据
   * @param {String} fileName 下载时的文件名
   */
  function downloadFile(obj, fileName) {
    // 创建a标签
    var elementA = document.createElement('a');
    elementA.download = fileName;
    elementA.style.display = 'none';

    //生成一个blob二进制数据
    var blob = new Blob([obj]);

    //生成一个指向blob的URL地址，并赋值给a标签的href属性
    elementA.href = URL.createObjectURL(blob);
    document.body.appendChild(elementA);
    elementA.click();
    document.body.removeChild(elementA);
  }
})();
