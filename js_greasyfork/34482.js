// ==UserScript==
// @name         卡提諾小說
// @namespace    http://tampermonkey.net/
// @version      0.4
// @description  移除廣告、開關【小說拉到底可載入下一頁】功能(預設開啟)
// @author       Kai
// @match        https://ck101.com/thread*
// @grant        none
// @require      http://code.jquery.com/jquery-3.2.1.min.js
// @downloadURL https://update.greasyfork.org/scripts/34482/%E5%8D%A1%E6%8F%90%E8%AB%BE%E5%B0%8F%E8%AA%AA.user.js
// @updateURL https://update.greasyfork.org/scripts/34482/%E5%8D%A1%E6%8F%90%E8%AB%BE%E5%B0%8F%E8%AA%AA.meta.js
// ==/UserScript==

(function() {
    'use strict';

    //增加可選的功能
    //$('.fontSize').append(`<a href="javascript:;" id="all_load" class="barIcon">全</a>`);               //占用資源太大，關掉不使用
    $('.fontSize').append(`<a href="javascript:;" id="scroll_load" class="barIcon barIconActive">底</a>`);

    //移除廣告
    function removeAD() {
        $('.side').remove();              //隱藏右半廣告
        $('.viewthread').width(1000);     //調整版面寬度
        $('.a_t').remove();
        $('.adTopBox').remove();
        $('.ad728Top').remove();
        $('.ad728Btm').remove();
        $('.side_ad').remove();
        $('.a_cn').remove();
        $('.adBox').remove();
        $('.threadBottom').remove();
        $('.wrapper').remove();
        $('.viewthread_announcements').remove();
        $('.editorRecommends-loadMore-con').remove();
        $('.fbfanBox').remove();
        $('.pi-pageMore-wrap').remove();
        console.clear();
    }
    var timejob = setInterval(removeAD, 3000);

    var author = $('.authorName')[0].text;
    var url = document.location.href.split('/');  // ex: https://ck101.com/thread-3673404-1-1.html
    var thread = url[3].split('-'); // ex: thread-3673404-1-1.html
    var current = thread[2];
    var maxpage = $('.last').attr('href').split('/')[3].split('-')[2];

    //console.log('author:', author);
    //console.log('url:', url);
    //console.log('thread:', thread);
    //console.log('current:', current);
    //console.log('maxpage:', maxpage);



    //拉到底時，開始載入下一頁
    function func_scroll_load(){
        $(window).scroll(function() {
            if ($(document).scrollTop() + $(window).height() >= $(document).height()) {
                if (current <= maxpage) {
                    current++;
                    $.get(`${url[0]}//${url[1]}${url[2]}/${thread[0]}-${thread[1]}-${current}-${thread[3]}`, function(data) {
                        var page = $(data).find('#postlist');
                        $('.mainBox').append(page);
                        removeAD();
                    });
                }
            }
        });
    }

    //一次取得所有頁數
    $('#all_load').click(function(){
        while (current <= maxpage) {
            current++;
            $.get(`${url[0]}//${url[1]}${url[2]}/${thread[0]}-${thread[1]}-${current}-${thread[3]}`, function(data) {
                var page = $(data).find('#postlist');
                $('.mainBox').append(page);
                removeAD();
            });
        }
    });

    //開關拉到底載入下一頁功能
    $('#scroll_load').click(function(){
        if($(this).hasClass('barIconActive')) {
            $(window).unbind(func_scroll_load());
            $('#scroll_load').removeClass('barIconActive');
        } else {
            func_scroll_load();
            $('#scroll_load').addClass('barIconActive');
        }
    });


    //預設開啟
    func_scroll_load();
})();