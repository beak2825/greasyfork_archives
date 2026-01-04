// ==UserScript==
// @name         Download nhạc mp3 zing Vip made by Tuấndz
// @namespace    Phan Mạnh Tuấn ||| FB: https://www.facebook.com/my4fun || khongtrunght@gmail.com
// @version      1.0.0
// @icon         http://static.mp3.zdn.vn/skins/mp3_version3_05/images/new-logo.jpg
// @description  Download nhạc nhất lượng cao 320kbps tại mp3.zing.vn
// @match        http://mp3.zing.vn/bai-hat/*.html*
// @match        http://mp3.zing.vn/album/*.html*
// @match        http://mp3.zing.vn/playlist/*.html*
// @match        http://mp3.zing.vn/nghe-si/*
// @match        http://mp3.zing.vn/tim-kiem/bai-hat.html?q=*
// @match        http://www.nhaccuatui.com/bai-hat/*
// @copyright    2017+ / Phan Mạnh Tuấn
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/32702/Download%20nh%E1%BA%A1c%20mp3%20zing%20Vip%20made%20by%20Tu%E1%BA%A5ndz.user.js
// @updateURL https://update.greasyfork.org/scripts/32702/Download%20nh%E1%BA%A1c%20mp3%20zing%20Vip%20made%20by%20Tu%E1%BA%A5ndz.meta.js
// ==/UserScript==
$(function () 
 
  
  {
  if (location.pathname.indexOf('/bai-hat/') === 0) {
     var code = $('div.fb-like').data('href');
    $('#tabService').replaceWith(' <a id="tabService" href="http://htstar.design/zingmp3.php?q=128&link=' + code + '"class="button-style-1 pull-left fn-tab"><i class="zicon icon-download"></i><span>Tải nhạc 128 kbps</span></a> <a id="tabService" href="http://htstar.design/zingmp3.php?q=320&link=' + code + '"class="button-style-1 pull-left fn-tab"><i class="zicon icon-download"></i><span>Tải nhạc 320 kbps</span></a> <a id="tabService" href="http://htstar.design/zingmp3.php?q=lossless&link=' + code + '"class="button-style-1 pull-left fn-tab"><i class="zicon icon-download"></i><span>Tải nhạc Lossless</span></a> ');} 
    
    var linknct = $("link[rel='canonical']").attr("href");
   if ($('#btnDownloadBox') === '<a href="javascript:;" id="btnDownloadBox"></span>Tải nhạc</a>'){
  $('#btnDownloadBox').replaceWith('<a href="http://starlabs.ml/getlinknct.php?q=128&link=' +linknct + '"><span class="icon_download"></span>   Tải nhạc 128kbps   </a><a href="http://starlabs.ml/getlinknct.php?q=320&link=' +linknct + '"></span>   Tải nhạc 320kbps   </a><a href="http://starlabs.ml/getlinknct.php?q=lossless&link=' +linknct + '"></span>   Tải nhạc Lossless</a>');}
  else
 {
    $('#btnAddPlaylistNowPlaying').after('<a href="http://starlabs.ml/getlinknct.php?q=128&link=' +linknct + '"></span>   Tải nhạc 128kbps   </a></li><a href="http://starlabs.ml/getlinknct.php?q=320&link=' +linknct + '"></span>   Tải nhạc 320kbps   </a><a href="http://starlabs.ml/getlinknct.php?q=lossless&link=' +linknct + '"></span>   Tải nhạc Lossless</a>')};
});

