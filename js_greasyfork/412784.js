// ==UserScript==
// @name        解决微博字体过细 - weibo.com
// @namespace   Violentmonkey Scripts
// @match       https://weibo.com/*
// @grant       none
// @version     1.3
// @author      lincong1987
// @description 2020/10/10 下午3:05:52
// @require https://unpkg.com/jquery@3.5.1/dist/jquery.js
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/412784/%E8%A7%A3%E5%86%B3%E5%BE%AE%E5%8D%9A%E5%AD%97%E4%BD%93%E8%BF%87%E7%BB%86%20-%20weibocom.user.js
// @updateURL https://update.greasyfork.org/scripts/412784/%E8%A7%A3%E5%86%B3%E5%BE%AE%E5%8D%9A%E5%AD%97%E4%BD%93%E8%BF%87%E7%BB%86%20-%20weibocom.meta.js
// ==/UserScript==


(function($){
  
  
  $("body").css({
    fontSize: "14px",
    fontFamily: '"Microsoft YaHei","WenQuanYi Micro Hei",sans-serif'
  });
  
  $("head").append(`
<style>


.WB_editor_iframe_new {
  height: auto !important;
}

.artical_add_box .btn_line {
  display: none !important;
}

</style>
`);
  
  
  
})($.noConflict(true));