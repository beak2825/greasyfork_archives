// ==UserScript==
// @name       按关键词屏蔽贴吧帖子
// @description  如标题
// @namespace  Violentmonkey Scripts
// @match      *://tieba.baidu.com/f?*
// @grant      none
// @require    http://code.jquery.com/jquery-1.11.0.min.js
// @version 0.0.1.20190903072847
// @downloadURL https://update.greasyfork.org/scripts/389718/%E6%8C%89%E5%85%B3%E9%94%AE%E8%AF%8D%E5%B1%8F%E8%94%BD%E8%B4%B4%E5%90%A7%E5%B8%96%E5%AD%90.user.js
// @updateURL https://update.greasyfork.org/scripts/389718/%E6%8C%89%E5%85%B3%E9%94%AE%E8%AF%8D%E5%B1%8F%E8%94%BD%E8%B4%B4%E5%90%A7%E5%B8%96%E5%AD%90.meta.js
// ==/UserScript==

//屏蔽掉标题中出现“考研”“租”字样的帖子
$(document).ready(function(){
  var lists = $("#thread_list > li");
  for(var i=1; i < lists.length; i++){
    var tit = lists[i].querySelector("a.j_th_tit");
    if(/(考研|租)/.test(tit.innerHTML)) {
      $(lists[i]).remove();
    }
  }
});
