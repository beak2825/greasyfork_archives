// ==UserScript==
// @name         巴哈姆特自動開圖
// @namespace    http://tampermonkey.net/
// @version      1.5
// @description  自動展開巴哈姆特哈拉區文章內的圖片和影片
// @author       Jian-Long Huang
// @match        https://forum.gamer.com.tw/*.php*
// @match        https://m.gamer.com.tw/forum/C.php*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/24745/%E5%B7%B4%E5%93%88%E5%A7%86%E7%89%B9%E8%87%AA%E5%8B%95%E9%96%8B%E5%9C%96.user.js
// @updateURL https://update.greasyfork.org/scripts/24745/%E5%B7%B4%E5%93%88%E5%A7%86%E7%89%B9%E8%87%AA%E5%8B%95%E9%96%8B%E5%9C%96.meta.js
// ==/UserScript==

(function() {
  'use strict';

  var i;
  var attachImgs = document.getElementsByName('attachImgName');
  var attachImg;
  for (i = 0; i < attachImgs.length; ++i) {
    attachImg = attachImgs[i];
    if (attachImg.innerHTML.match('請點選觀看圖片') || attachImg.innerHTML.match('開啟圖片')) {
      attachImg.click();
    }
  }

  var attachMovs = document.getElementsByName('attachMovieName');
  var attachMov;
  for (i = 0; i < attachMovs.length; ++i) {
    attachMov = attachMovs[i];
    if (attachMov.innerHTML.match('請點選觀看影片') || attachMov.innerHTML.match('開啟影片')) {
      attachMov.click();
    }
  }

  // 手機版
  attachImgs = document.getElementsByName('openimg');
  for (i = 0; i < attachImgs.length; ++i) {
    attachImg = attachImgs[i];
    if (attachImg.innerHTML.match('開啟本頁圖片')) {
      attachImg.getElementsByTagName('font')[0].click();
    }
  }
})();
