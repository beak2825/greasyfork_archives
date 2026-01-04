// ==UserScript==
// @name         豆瓣失败图片加载器
// @namespace    undefined
// @version      0.1.4
// @description  替换豆瓣加载失败的图片
// @author       watermelon
// @match        *://douban.com*
// @match        *://www.douban.com*
// @require      https://code.jquery.com/jquery-latest.js
// @run-at       document-start
// @grant        unsafeWindow
// @grant        GM_setClipboard
// @downloadURL https://update.greasyfork.org/scripts/32327/%E8%B1%86%E7%93%A3%E5%A4%B1%E8%B4%A5%E5%9B%BE%E7%89%87%E5%8A%A0%E8%BD%BD%E5%99%A8.user.js
// @updateURL https://update.greasyfork.org/scripts/32327/%E8%B1%86%E7%93%A3%E5%A4%B1%E8%B4%A5%E5%9B%BE%E7%89%87%E5%8A%A0%E8%BD%BD%E5%99%A8.meta.js
// ==/UserScript==

(function() {
  console.log("in");
  $("<img/>").on('error', function(event) {
    console.log("error");
    event.preventDefault();
    var src = $(this).attr("src");
    console.log("load image failed: " + src);
    $(this).attr(src.replace("img1", "img3"));
  });
})();