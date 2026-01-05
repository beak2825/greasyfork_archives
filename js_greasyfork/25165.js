// ==UserScript==
// @name         2ch(5ch)サムネイル表示
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  2(5)ちゃんねるに貼られている画像のサムネイルを表示します。
// @author       ぬ
// @match        http://*.5ch.net/*
// @match        https://*.5ch.net/*
// @match        http://*.2ch.sc/*
// @match        https://*.2ch.sc/*
// @match        http://*.bbspink.com/*
// @match        https://*.bbspink.com/*
// @grant        none
// @require      http://ajax.googleapis.com/ajax/libs/jquery/1.11.1/jquery.min.js
// @downloadURL https://update.greasyfork.org/scripts/25165/2ch%285ch%29%E3%82%B5%E3%83%A0%E3%83%8D%E3%82%A4%E3%83%AB%E8%A1%A8%E7%A4%BA.user.js
// @updateURL https://update.greasyfork.org/scripts/25165/2ch%285ch%29%E3%82%B5%E3%83%A0%E3%83%8D%E3%82%A4%E3%83%AB%E8%A1%A8%E7%A4%BA.meta.js
// ==/UserScript==

$(function(){
  $('a').each(function(){
    var address = $(this).text();
    var tmp = address.split('.');
    var ext = tmp[tmp.length-1];
      if(ext=="jpg" ||ext=="jpeg" || ext=="png" || ext=="gif" || ext=="bmp" || ext=="jpg:large" || ext=="jpeg:large" || ext=="png:large"){
    $(this).after($('</br><a href='+address+' target="_blank"><img src='+address+' width=400/></a></br>'));
    }
  });

 $(".thumb_i").each(function(){
     $(this).hide();
  });

})(jQuery);