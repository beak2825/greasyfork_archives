// ==UserScript==
// @name        ZhuiXinFan.com 复制功能和链接点击功能修复
// @namespace   localhost
// @include     *zhuixinfan.com/main.php?mod=viewresource*
// @version     1.1
// @require     http://code.jquery.com/jquery-3.2.1.min.js
// @require     https://cdn.bootcss.com/clipboard.js/2.0.0/clipboard.min.js
// @grant       none
// @description:fix zhuixinfan.com copy button fuction,one click to open emule link and magnet link.
// @description:zh-CN 用于修复追新番页面的复制链接的Chrome兼容，magnet链接，电驴链接的点击。
// @description 用于修复追新番页面的复制链接的Chrome兼容，magnet链接，电驴链接的点击。
// @downloadURL https://update.greasyfork.org/scripts/40494/ZhuiXinFancom%20%E5%A4%8D%E5%88%B6%E5%8A%9F%E8%83%BD%E5%92%8C%E9%93%BE%E6%8E%A5%E7%82%B9%E5%87%BB%E5%8A%9F%E8%83%BD%E4%BF%AE%E5%A4%8D.user.js
// @updateURL https://update.greasyfork.org/scripts/40494/ZhuiXinFancom%20%E5%A4%8D%E5%88%B6%E5%8A%9F%E8%83%BD%E5%92%8C%E9%93%BE%E6%8E%A5%E7%82%B9%E5%87%BB%E5%8A%9F%E8%83%BD%E4%BF%AE%E5%A4%8D.meta.js
// ==/UserScript==
this.$ = this.jQuery = jQuery.noConflict(true);
torrent_html = $("#torrent_url").html();
$("#torrent_url").replaceWith("<dd class='a1' id='emule_url'><a href='"+torrent_html+"'>"+torrent_html+"</a></dd>");
emule_html =  $("#emule_url").html();
$("#emule_url").replaceWith("<dd class='a1' id='torrent_url'><a href='"+emule_html+"' class='a1'>"+emule_html+"</a></dd>");
$("#d_clip_button").replaceWith("<a href='javascript:;' id='d_clip_button' class='bt bt-dl bt-copy' data-clipboard-text='"+emule_html+"'>点击复制</button>");
$("a:contains('复制链接')").replaceWith("<a href='javascript:;' id='d_clip_button2' class='bt bt-dl bt-copy' data-clipboard-text='"+torrent_html+"'>点击复制</button>");
$("a:contains('电驴下载')").attr("href",emule_html);
$("a:contains('磁力下载')").attr("href",torrent_html);
$(document).ready(function(){
    var clipboard = new ClipboardJS('#d_clip_button');
    clipboard.on('success', function(e) {
        console.log(e);
        alert("电驴链接复制成功！");
    });
    clipboard.on('error', function(e) {
        console.log(e);
        alert("复制失败！请手动复制");
    });
    var clipboard2 = new ClipboardJS('#d_clip_button2');
    clipboard2.on('success', function(e) {
        console.log(e);
        alert("磁性链接复制成功！");
    });
    clipboard2.on('error', function(e) {
        console.log(e);
        alert("复制失败！请手动复制");
    });
});