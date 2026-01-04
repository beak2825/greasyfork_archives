// ==UserScript==
// @name         解决B站复制文本
// @namespace    http://tampermonkey.net/
// @version      1.2
// @description  解决B站专栏文本复制问题
// @author       Jonolo
// @run-at document-idle
// @match        http*://*.bilibili.com/read*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/382723/%E8%A7%A3%E5%86%B3B%E7%AB%99%E5%A4%8D%E5%88%B6%E6%96%87%E6%9C%AC.user.js
// @updateURL https://update.greasyfork.org/scripts/382723/%E8%A7%A3%E5%86%B3B%E7%AB%99%E5%A4%8D%E5%88%B6%E6%96%87%E6%9C%AC.meta.js
// ==/UserScript==

(function() {
  $(document).off()
  $(".article-holder").off()
  $(".article-holder").css("-webkit-user-select","auto")
  $(".article-holder").css("user-select","auto")



  $(".article-holder").bind('copy',function(e){
        var cpTxt = window.getSelection().toString()
        var clipboardData = e.originalEvent.clipboardData;
        clipboardData.setData('text', cpTxt);
  })
})();