// ==UserScript==
// @name V2EX搜索替换
// @description 替换V2EX搜索为百度
// @namespace Violentmonkey Scripts
// @match https://www.v2ex.com/*
// @grant none
// @version 1.2
// @downloadURL https://update.greasyfork.org/scripts/383218/V2EX%E6%90%9C%E7%B4%A2%E6%9B%BF%E6%8D%A2.user.js
// @updateURL https://update.greasyfork.org/scripts/383218/V2EX%E6%90%9C%E7%B4%A2%E6%9B%BF%E6%8D%A2.meta.js
// ==/UserScript==
;(function() {

  function exec() {
    // 覆盖原有方法
    window.dispatch = function () {
      var value = document.getElementById('q').value
      if ( value) {
        var url = "https://www.baidu.com/s?wd=site%3Av2ex.com+" + encodeURIComponent(value);
        if (window.open) {
          window.open(url, '_blank')
        } else{
          location.href = url
        }
        return false
      }
      return false
    }
  }

  window.addEventListener('load', exec, false)
})()
