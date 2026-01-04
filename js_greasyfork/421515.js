// ==UserScript==
// @name         软件源
// @namespace    http://tampermonkey.net/
// @version      1.2
// @description  软件源图标显示不正常修改
// @icon         https://www.appcgn.com/favicon.ico
// @author       kizj
// @match        *://www.appcgn.com/*
// @require      https://cdn.bootcdn.net/ajax/libs/jquery/3.5.1/jquery.min.js
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/421515/%E8%BD%AF%E4%BB%B6%E6%BA%90.user.js
// @updateURL https://update.greasyfork.org/scripts/421515/%E8%BD%AF%E4%BB%B6%E6%BA%90.meta.js
// ==/UserScript==

(function() {
  'use strict';
  // Your code here...

  $('p.pic').each(function(){
    let a = $(this).find('img').attr('src');
    $(this).find('img').remove();
    $(this).css({'background-image':'url('+a+')','background-repeat':'no-repeat','background-size':'cover','background-position':'center'});

  })

  $('.hot_rj').find('img').each(function(){
    let a = $(this).attr('src');
    $(this).parent().prepend('<div></div>');
    $(this).siblings("div").css({'background-image':'url('+a+')','background-repeat':'no-repeat','background-size':'cover','background-position':'center','width':'74px','height':'74px'});
    $(this).remove();
  })
  
  $('.rqxz_listt').find('img').each(function(){
    let a = $(this).attr('src');
    $(this).parent().prepend('<div></div>');
    $(this).siblings("div").css({'background-image':'url('+a+')','background-repeat':'no-repeat','background-size':'cover','background-position':'center','width':'74px','height':'74px'});
    $(this).remove();
  })

})();