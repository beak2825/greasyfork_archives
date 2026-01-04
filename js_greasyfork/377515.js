// ==UserScript==
// @name         思文学网自动加载
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  try to take over the world!
// @author       ZMeng
// @match        https://www.4wxw.com/book/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/377515/%E6%80%9D%E6%96%87%E5%AD%A6%E7%BD%91%E8%87%AA%E5%8A%A8%E5%8A%A0%E8%BD%BD.user.js
// @updateURL https://update.greasyfork.org/scripts/377515/%E6%80%9D%E6%96%87%E5%AD%A6%E7%BD%91%E8%87%AA%E5%8A%A8%E5%8A%A0%E8%BD%BD.meta.js
// ==/UserScript==

(function() {
    'use strict';

    var scriptObj = document.createElement("script");
    scriptObj.src = 'https://cdnjs.cloudflare.com/ajax/libs/clipboard.js/2.0.0/clipboard.min.js';
    scriptObj.type = "text/javascript";
    document.getElementsByTagName("head")[0].appendChild(scriptObj);
    $('.read_b').append('<button id="copyToClipboard" class="btn" style="margin-left:3px;border:1px solid #ccc;padding:3px 7px;background:#fff;color:#666" data-clipboard-action="copy" data-clipboard-target=".novel">复制</button>');
    $('.lm,.recommend,.pereview').remove();
    var $body=$('.novel');
    var $title=$body.find('h1');
    var $content=$body.find('#content');
    var $next=$content.find('.to_nextpage');
    var next_url=$next.find('a').attr('href');
    var title=$title.text();
    var timer,clipboard;
    var title=$title.text();
    title=title.replace('禁忌之地 ','');
    title=title.substring(0,title.indexOf('('));
    $title.text(title);

    function get_next(next_url){
        if (next_url == undefined || next_url == '') return;

        $.ajax({
            method:'get',
            url:next_url,
            dataType:'text',
            beforeSend:function(){

            },
            success:function(html){
                var $html=$('<div></div>').html(html);
                var $content=$html.find('#content');
                var content=$content.html();
                $('#content').append(content);
                var $next=$content.find('.to_nextpage');
                var next_url=$next.find('a').attr('href');
                get_next(next_url);
            },
            complete:function(){
                $('.to_nextpage').remove();
                if(timer) clearTimeout(timer);
                timer=setTimeout(function(){
                    if(!clipboard) clipboard = new ClipboardJS('.btn');
                    $('br').each(function(i){
                        if(i%2==0) $(this).remove();
                    });
                    $('#content').append('<br><br>');
                },500);
            }
        });
    }


    get_next(next_url);
})();
