// ==UserScript==
// @name         Tool Get Link Fshare, Mp3zing.vn, Nhaccuatui
// @namespace    Phạm Doãn Hiếu ||| FB: https://www.facebook.com/100010921898385 || neucodethi@gmail.com
// @version      3.3.9
// @icon         https://scontent.fhan3-1.fna.fbcdn.net/v/t1.0-9/12745629_1731761047052278_7588513378801632516_n.png?oh=4fc68353984cac9fd3d6f2f39708eb70&oe=5A2334FB
// @description  Download  nhạc nhất lượng cao tại mp3.zing.vn, NCT
// homepageURL   https://www.facebook.com/groups/j2team.community/permalink/558118934520231/
// @match        http://mp3.zing.vn/bai-hat/*.html*
// @match        http://mp3.zing.vn/album/*.html*
// @match        http://mp3.zing.vn/playlist/*.html*
// @match        http://mp3.zing.vn/nghe-si/*
// @match        http://mp3.zing.vn/tim-kiem/bai-hat.html?q=*
// @match        http://www.nhaccuatui.com/bai-hat/*
// @match        https://www.fshare.vn/file/*
// @match 		   https://javhd.com/*
// @copyright    2017+ / Phạm Doãn Hiếu
// @require      https://ajax.googleapis.com/ajax/libs/jquery/2.2.4/jquery.min.js
// @require      https://greasyfork.org/scripts/18532-filesaver/code/FileSaver.js?version=164030
// @noframes
// @connect      linksvip.net
// @connect      zing.vn
// @connect      zadn.vn
// @connect      zdn.vn
// @run-at       document-idle
// @grant        GM_xmlhttpRequest
// @grant        GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/12056/Tool%20Get%20Link%20Fshare%2C%20Mp3zingvn%2C%20Nhaccuatui.user.js
// @updateURL https://update.greasyfork.org/scripts/12056/Tool%20Get%20Link%20Fshare%2C%20Mp3zingvn%2C%20Nhaccuatui.meta.js
// ==/UserScript==
$(function () 
 
  
  {
  if (location.pathname.indexOf('/bai-hat/') === 0) {
     var code = $('div.fb-like').data('href');
    $('#tabService').replaceWith(' <a id="tabService" href="http://htstar.design/mp3zing.php?q=128&link=' + code + '"class="button-style-1 pull-left fn-tab"><i class="zicon icon-download"></i><span>Tải nhạc 128 kbps</span></a> <a id="tabService" href="http://htstar.design/mp3zing.php?q=320&link=' + code + '" class="button-style-1 pull-left fn-tab"><i class="zicon icon-download"></i><span>Tải nhạc 320 kbps</span></a> <a id="tabService" href="http://htstar.design/mp3zing.php?q=lossless&link=' + code + '" target="_blank" class="button-style-1 pull-left fn-tab"><i class="zicon icon-download"></i><span>Tải nhạc Lossless</span></a> ');}
    
    var linkbaihat = $("link[rel='canonical']").attr("href");
   if ($('#btnDownloadBox') === '<a href="javascript:;" id="btnDownloadBox"></span>Tải nhạc</a>'){
  $('#btnDownloadBox').replaceWith('<a href="http://htstar.design/nctgetlink.php?q=128&link=' +linkbaihat + '"><span class="icon_download"></span>   Tải nhạc 128kbps   </a><a href="http://htstar.design/nctgetlink.php?q=320&link=' +linkbaihat + '"></span>   Tải nhạc 320kbps   </a><a href="http://htstar.design/nctgetlink.php?q=lossless&link=' +linkbaihat + '"></span>   Tải nhạc Lossless</a>');}
  else
 { 
    $('#btnAddPlaylistNowPlaying').after('<a href="http://htstar.design/nctgetlink.php?q=128&link=' +linkbaihat + '"></span>   Tải nhạc 128kbps   </a></li><a href="http://htstar.design/nctgetlink.php?q=320&link=' +linkbaihat + '"></span>   Tải nhạc 320kbps   </a><a href="http://htstar.design/nctgetlink.php?q=lossless&link=' +linkbaihat + '"></span>   Tải nhạc Lossless</a>')};
  if (location.pathname.indexOf('/file/') === 0) {
	  {var link = window.location.href; var link1 = link.replace("fshare.vn", "getlinkfshare.com");} ;
	  $('.policy_download').prepend('<div class="col-xs-12"><a title="Download nhanh " style="margin-top: 10px; height: 70px;" class="btn btn-success btn-lg btn-block btn-download-sms" href="http://bfeu.tk/getfshare.php?link=' + location.href + '">        <i class="fa fa-cloud-download fa-2x pull-left"></i>        <span class="pull-right text-right download-txt">            Tải nhanh<br>            <small>Tool Get link From Tiện Ích Máy Tính </small>        </span></a></div><div class="col-xs-12"><a title="Download nhanh " style="margin-top: 10px; height: 70px;" class="btn btn-success btn-lg btn-block btn-download-sms" href="' + link1 + '">        <i class="fa fa-cloud-download fa-2x pull-left"></i>        <span class="pull-right text-right download-txt">            Tải nhanh qua GETLINKFSHARE.COM<br>            <small>Tool Get link From Tiện Ích Máy Tính </small>        </span></a></div> ')} 
  ;
  if( window.location.hostname == 'javhd.com' ) {
    
    var link = window.location.href;
    var linkget= 'http://htstar.design/getjav.php?link=' + link;
	$('.player-container').replaceWith('<div> <video autoplay controls> <source src="'+linkget+ '" type="video/mp4">Your browser does not support HTML5 video.</video></div>');
    $('.downloads').replaceWith('<div><a class="downloads" href="'+ linkget +'"><i>Downloads</i></a></div>' );
    
  };
{
/* some code to load */
}
  /*if (location.pathname.indexOf('/playlist/') === 0) {
var songid=  ($(this).closest('.idScrllSongInAlbum').attr('key').replace(/(chartitem)?song(rec)?/, ''));
$('.button_download').replaceWith('<a href="http://htstar.design/nctgetlink.php?q=128&link=' +songid + '"> class="button_download" title="Tải nhạc 128kbps" </a>')};*/
  
});


(function ($, window, document) {
    'use strict';

    GM_addStyle('.bv-icon{background-image:url(http://static.mp3.zdn.vn/skins/zmp3-v4.1/images/icon.png)!important;background-repeat:no-repeat!important;background-position:-25px -2459px!important;}.bv-download{background-color:#70d4ff!important;border-color:#70d4ff!important;}.bv-download span{color:#fff!important;margin-left:8px!important;}.bv-disable,.bv-download:hover{background-color:#ff5e5e!important;border-color:#ff5e5e!important;}.bv-text{background-image:none!important;color:#fff!important;text-align:center!important;font-size:smaller!important;line-height:25px!important;}.bv-waiting{cursor:wait!important;background-color:#2980b9!important;border-color:#2980b9!important;}.bv-complete,.bv-complete:hover{background-color:#27ae60!important;border-color:#27ae60!important;}.bv-error,.bv-error:hover{background-color:#c0392b!important;border-color:#c0392b!important;}.bv-disable{cursor:not-allowed!important;opacity:0.4!important;}');

    function downloadSong(songId, progress, complete, error) {
        GM_xmlhttpRequest({
            method: 'GET',
            url: linksVip(songId),
            responseType: 'blob',

            onload: function (source) {
                complete(source.response, source.finalUrl.split('filename=')[1]);
            },

            onprogress: function (e) {
                if (e.total) {
                    progress(Math.floor(e.loaded * 100 / e.total) + '%');
                } else {
                    progress('');
                }
            },

            onerror: function (e) {
                console.error(e);
                error();
            }
        });
    }

    window.URL = window.URL || window.webkitURL;

       function multiDownloads() {
        var $smallBtn = $('.fn-dlsong');
        if (!$smallBtn.length) return;

        $smallBtn.replaceWith(function () {
            var songId = $(this).closest('li, .item-song').attr('id').replace(/(chartitem)?song(rec)?/, '');

           return '<a title=" Tải nhạc 128kbps " class="bv-download bv-multi-download bv-icon" href="http://htstar.design/mp3zing.php?q=128&code=' +songId+ '" data-id="' + songId + '"><a title=" Tải nhạc 320kbps " class="bv-download bv-multi-download bv-icon" href="http://htstar.design/mp3zing.php?q=320&code=' + songId + '" data-id="' + songId + '"></a></a><a title=" Tải nhạc Lossless " class="bv-download bv-multi-download bv-icon" target="_blank" href="http://htstar.design/mp3zing.php?q=lossless&code=' + songId + '" data-id="' + songId + '"></a>';
        });

}
    multiDownloads();
    $(document).on('ready', multiDownloads);
    $(window).on('load', multiDownloads);

})(jQuery, window, document);
