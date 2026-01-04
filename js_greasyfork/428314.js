// ==UserScript==
// @name         FANZAtoJavmix...etc
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  FANZAからjavmix等に飛ぶ
// @author       You
// @match        https://www.dmm.co.jp/digital/videoa/-/detail/=/*
// @grant        none
// @require      http://ajax.googleapis.com/ajax/libs/jquery/1.11.1/jquery.min.js
// @downloadURL https://update.greasyfork.org/scripts/428314/FANZAtoJavmixetc.user.js
// @updateURL https://update.greasyfork.org/scripts/428314/FANZAtoJavmixetc.meta.js
// ==/UserScript==


$(function(){

  var title = $("title:first").text();
  title = title.substring(0, title.indexOf(" -"))
  title = title.replace(/ /g, '+')
  //alert(title);

  //javmix
  var url = "https://javmix.tv/?s=" + title;
  $(".mg-t6:first").after($('<a class="d-btn" href=' + url + ' target="_blank"><span>javmixで見る</span></a></br>'));

  //YouAV
  url = "https://www.youav.com/search/videos/" + title;
  $(".mg-t6:first").after($('<a class="d-btn" href=' + url + ' target="_blank"><span>YouAVで見る</span></a></br>'));

  //SupJav
  url = "https://supjav.com/ja/?s=" + title;
  $(".mg-t6:first").after($('<a class="d-btn" href=' + url + ' target="_blank"><span>SupJavで見る</span></a></br>'));
})(jQuery);