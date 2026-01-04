// ==UserScript==
// @name        听蛙点赞数显示
// @namespace   Violentmonkey Scripts
// @match       https://www.itingwa.com/
// @grant       none
// @version     1.0
// @author      -
// @require      http://cdn.bootcss.com/jquery/1.8.3/jquery.min.js
// @description 显示首页推荐那里音乐的点赞数
// @downloadURL https://update.greasyfork.org/scripts/414489/%E5%90%AC%E8%9B%99%E7%82%B9%E8%B5%9E%E6%95%B0%E6%98%BE%E7%A4%BA.user.js
// @updateURL https://update.greasyfork.org/scripts/414489/%E5%90%AC%E8%9B%99%E7%82%B9%E8%B5%9E%E6%95%B0%E6%98%BE%E7%A4%BA.meta.js
// ==/UserScript==
$(function(){
  $('#music_item a[target=listen]').each(function(){
    var _this = $(this)
    var urlArr = _this.attr("href").split('/')
    var text = _this.text()
    $.get(`/?c=event&m=get_like&id=${urlArr[urlArr.length - 1]}&type=0`, 
    function(data) {
      var likeTotal = JSON.parse(data).total
      _this.html(`<span style="color: red;">${likeTotal}</span>-${text}`)
    })
  })
})