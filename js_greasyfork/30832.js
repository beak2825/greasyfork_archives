// ==UserScript==
// @name         看豆人（kindleren）记录已看页码
// @version      0.1
// @description  在页面左侧显示上次浏览到的最后一个页面，点击可直接跳转。
// @author       lemodd@qq.com
// @namespace    lemodd@qq.com
// @match        https://kindleren.com/forum.php?mod=forumdisplay&fid=100&page=*
// @grant        GM_xmlhttpRequest
// @grant        GM_log
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        jQuery
// @require      https://code.jquery.com/jquery-latest.js
// @downloadURL https://update.greasyfork.org/scripts/30832/%E7%9C%8B%E8%B1%86%E4%BA%BA%EF%BC%88kindleren%EF%BC%89%E8%AE%B0%E5%BD%95%E5%B7%B2%E7%9C%8B%E9%A1%B5%E7%A0%81.user.js
// @updateURL https://update.greasyfork.org/scripts/30832/%E7%9C%8B%E8%B1%86%E4%BA%BA%EF%BC%88kindleren%EF%BC%89%E8%AE%B0%E5%BD%95%E5%B7%B2%E7%9C%8B%E9%A1%B5%E7%A0%81.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 固定一个标签显示
    $('body').append('<span id="last_page" style="top:200px;left:0px;position:fixed;"></span>');

    var url = window.location.toString();
    var current_page = parseInt(url.split("=").slice(-1));
    var last_page = parseInt(GM_getValue("last_page"));

    if(last_page<current_page){
        GM_setValue("last_page",current_page.toString());
    }

    var last_url = "https://kindleren.com/forum.php?mod=forumdisplay&fid=100&page=";
    last_url += last_page;

    var text = "上次看到:　P"+last_page;
    
    var a_tag = $("<a>");
    a_tag.attr("href",last_url);
    a_tag.text(text);
    $("#last_page").append(a_tag);

})();



//窗口滚动到底时自动翻页

// 固定一个标签显示当前页面位置
$('body').append('<span id="lb2" style="top:130px;left:0px;position:fixed;"></span>');
$('body').append('<span id="lb"  style="top:100px;left:0px;position:fixed;"></span>');

$(document).scroll(function(){
    //当前高度
    var ch = parseInt($(document).scrollTop());
    $("#lb").text(ch);
    //总高度
    var h =$(document).height()- $(window).height() ;
    //alert(h);
    $("#lb2").text(h);

    //如果当前高度大于总高度，就自动翻页
    if (ch>=h-2){
        //翻页
        setTimeout(function(){
            ch = parseInt($(document).scrollTop());

            if(ch>h-2) {$('.nxt').get(0).click();}
        },
                   2000);//留下2秒的延时，如果不想翻页，2秒内向上翻，可以取消。

    }
});