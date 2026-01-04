// ==UserScript==
// @name        删除百度翻译的弹窗
// @namespace   Violentmonkey Scripts
// @match       https://fanyi.baidu.com/
// @grant       none
// @version     1.0
// @author      ulight
// @description 直接把弹窗删掉
// @downloadURL https://update.greasyfork.org/scripts/428575/%E5%88%A0%E9%99%A4%E7%99%BE%E5%BA%A6%E7%BF%BB%E8%AF%91%E7%9A%84%E5%BC%B9%E7%AA%97.user.js
// @updateURL https://update.greasyfork.org/scripts/428575/%E5%88%A0%E9%99%A4%E7%99%BE%E5%BA%A6%E7%BF%BB%E8%AF%91%E7%9A%84%E5%BC%B9%E7%AA%97.meta.js
// ==/UserScript==


$(document).ready(function(){ 
  document.getElementsByClassName('desktop-guide')[0].remove();
  document.getElementsByClassName('download-app')[0].remove();
});
