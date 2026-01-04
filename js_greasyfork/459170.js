// ==UserScript==
// @name        搜索编程问题自动排除csdn的结果
// @namespace   Violentmonkey Scripts
// @match       *://*/*
// @grant       none
// @version     1.0.2
// @author      自来也
// @description 它会在你的搜索关键词的后面自动拼接上 -csdn，来达到过滤效果
// @require   http://code.jquery.com/jquery-migrate-1.2.1.min.js
// @match      https://www.baidu.com/*
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/459170/%E6%90%9C%E7%B4%A2%E7%BC%96%E7%A8%8B%E9%97%AE%E9%A2%98%E8%87%AA%E5%8A%A8%E6%8E%92%E9%99%A4csdn%E7%9A%84%E7%BB%93%E6%9E%9C.user.js
// @updateURL https://update.greasyfork.org/scripts/459170/%E6%90%9C%E7%B4%A2%E7%BC%96%E7%A8%8B%E9%97%AE%E9%A2%98%E8%87%AA%E5%8A%A8%E6%8E%92%E9%99%A4csdn%E7%9A%84%E7%BB%93%E6%9E%9C.meta.js
// ==/UserScript==
(function(){
  'use strict';
  let url = location.href
  if(url.indexOf('baidu') > -1){
    $(":submit").click(function(){
      let oldValue = $('#kw').val()
      if(oldValue){
        oldValue = oldValue.replace(' -csdn','')
        $('#kw').val(oldValue+' -csdn')
      }
    })
  }
})();
