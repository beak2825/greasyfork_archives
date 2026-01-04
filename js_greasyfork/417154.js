// ==UserScript==
// @name         A岛搜索显示图片
// @namespace    adnmb
// @version      0.1
// @description  修复A岛搜索里不显示图片
// @author       Bowen Ding
// @match        https://adnmb3.com/Forum/search*
// @match        https://adnmb2.com/Forum/search*
// @grant        none
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/417154/A%E5%B2%9B%E6%90%9C%E7%B4%A2%E6%98%BE%E7%A4%BA%E5%9B%BE%E7%89%87.user.js
// @updateURL https://update.greasyfork.org/scripts/417154/A%E5%B2%9B%E6%90%9C%E7%B4%A2%E6%98%BE%E7%A4%BA%E5%9B%BE%E7%89%87.meta.js
// ==/UserScript==

(function() {
  'use strict';
  const callback = function(mutationRecords, observer) {
    console.debug(mutationRecords);
    const images = document.querySelectorAll(".h-threads-img");
    images.forEach(e => {
      if (e.src.startsWith("https://nmbimg.fastmirror.org/")) {
        return;
      }

      let real_path = e.src.split("/").slice(-2).join("/");
      //没有图片时的占位图
      if (! /\.(jpg|png|gif|webp|bmp|jpeg|svg)$/i.test(real_path) ) {
        real_path = "2017-02-14/58a278b022137.jpg";
      }
      e.src = "https://nmbimg.fastmirror.org/thumb/" + real_path;

      //修复图片链接
      e.parentNode.href = "https://nmbimg.fastmirror.org/image/" + real_path;
    });
  };

  const targetNode = document.querySelector(".h-threads-list");
  const config = {childList: true};
  const observer = new MutationObserver(callback);
  observer.observe(targetNode, config);
})();
