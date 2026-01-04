// ==UserScript==
// @name liaoxuefeng.com 教程翻页
// @description liaoxuefeng.com 教程 增加翻页功能
// @namespace Violentmonkey Scripts
// @match *://www.liaoxuefeng.com/*
// @grant none
// @require https://cdn.staticfile.org/jquery/3.2.1/jquery.min.js
// @version 0.0.1.20170720111101
// @downloadURL https://update.greasyfork.org/scripts/31625/liaoxuefengcom%20%E6%95%99%E7%A8%8B%E7%BF%BB%E9%A1%B5.user.js
// @updateURL https://update.greasyfork.org/scripts/31625/liaoxuefengcom%20%E6%95%99%E7%A8%8B%E7%BF%BB%E9%A1%B5.meta.js
// ==/UserScript==




document.onkeydown = function(e) {
    //console.log(e.ctrlKey);
    if (39 == e.keyCode && e.ctrlKey)
    {
       
      window.location.href = $(".uk-float-right a").attr('href');
    } else if (37 == e.keyCode && e.ctrlKey) {
      
      
      window.location.href =  $(".uk-float-left a").attr('href');
    }
}

$('.uk-button-primary').remove();
$('.x-sponsor-a').remove();
//$('.uk-button-danger').parent().remove();
if ($('.uk-button-danger').text() == " 分享到微博") {
  $('.uk-button-danger').parent().remove();
}

$('h3').each(function () {
  if ($(this).text() == '感觉本站内容不错，读后有收获？' || $(this).text() == '还可以分享给朋友') {
    $(this).remove();
  }
})

$('body').css({"background": "#f2ffff","color": "#5f5f5f","line-height": "200%", "font-size": "1.2em"});