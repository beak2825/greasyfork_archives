// ==UserScript==
// @name        bilibili-zen
// @namespace   Benature
// @match       https://www.bilibili.com/
// @grant       none
// @version     1.1
// @author      Benature
// @description 移除整个主页一片空白
// @run-at      document-end
// @require      https://cdn.jsdelivr.net/npm/jquery@3.4.1/dist/jquery.slim.min.js
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/451052/bilibili-zen.user.js
// @updateURL https://update.greasyfork.org/scripts/451052/bilibili-zen.meta.js
// ==/UserScript==



(function () {
  'use strict';
  $('.bili-header__channel').empty();
  $('.bili-header__channel').css("background-color", "grey");
  $('.recommended-container').empty();
  
  $('.bili-header__bar').css("margin-top", "200px");
  
  let style = "margin-top:30px; font-size:150px;"
  
  $('.recommended-container').append("<center><h2><p style='"+style+"'>𝓝𝓸 𝓣𝓲𝓶𝓮 𝓽𝓸<br/>𝓓𝓸 𝓒𝓸𝓯𝓯𝓮𝓮<p></h2></center>");
  
})();