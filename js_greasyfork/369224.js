// ==UserScript==
// @name         Tool Get Link Fshare
// @namespace    ShareLinkFree.Net ||| Website: sharelinkfree.net/ || sharelinkfree.net@gmail.com
// @version      3.3.9
// @icon         https://scontent.fhan3-1.fna.fbcdn.net/v/t1.0-9/12745629_1731761047052278_7588513378801632516_n.png?oh=4fc68353984cac9fd3d6f2f39708eb70&oe=5A2334FB
// @description  Download  nhạc nhất lượng cao tại mp3.zing.vn, NCT
// homepageURL   https://sharelinkfree.net/
// @match        https://www.fshare.vn/file/*
// @copyright    2018+ / Nguyễn Hữu Hoàng
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
// @downloadURL https://update.greasyfork.org/scripts/369224/Tool%20Get%20Link%20Fshare.user.js
// @updateURL https://update.greasyfork.org/scripts/369224/Tool%20Get%20Link%20Fshare.meta.js
// ==/UserScript==
$(function () 
 {
 
  if (location.pathname.indexOf('/file/') === 0) {
	  {var link = window.location.href; var link1 = link.replace("fshare.vn", "getlinkfshare.com");} ;
	  $('.policy_download').prepend('<div class="col-xs-12"><a title="Download nhanh " style="margin-top: 10px; height: 70px;" class="btn btn-success btn-lg btn-block btn-download-sms" href="http://bfeu.tk/getfshare.php?link=' + location.href + '">        <i class="fa fa-cloud-download fa-2x pull-left"></i>        <span class="pull-right text-right download-txt">            Tải nhanh<br>            <small>Tool Get link From ShareLinkFree </small>        </span></a></div><div class="col-xs-12"><a title="Download nhanh " style="margin-top: 10px; height: 70px;" class="btn btn-success btn-lg btn-block btn-download-sms" href="' + link1 + '">        <i class="fa fa-cloud-download fa-2x pull-left"></i>        <span class="pull-right text-right download-txt">            Tải nhanh qua GETLINKFSHARE.COM<br>            <small>Tool Get link ShareLinkFree </small>        </span></a></div> ')} 
  ;
  
})(jQuery, window, document);