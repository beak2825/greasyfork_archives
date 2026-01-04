// ==UserScript==
// @name         闲鱼显示搜索
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  让闲鱼显示搜索框，去掉了一些广告。
// @author       You
// @match        https://s.2.taobao.com/*
// @match        https://2.taobao.com/*
// @require      http://cdn.bootcss.com/jquery/1.8.3/jquery.min.js
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/32784/%E9%97%B2%E9%B1%BC%E6%98%BE%E7%A4%BA%E6%90%9C%E7%B4%A2.user.js
// @updateURL https://update.greasyfork.org/scripts/32784/%E9%97%B2%E9%B1%BC%E6%98%BE%E7%A4%BA%E6%90%9C%E7%B4%A2.meta.js
// ==/UserScript==
(function(){
    $(document).ready(function(){
        //显示搜索框
        $('#J_IdleHeader').append('<div class="idle-search">'+
            '  <form method="get" action="//s.2.taobao.com/list/list.htm" name="search" target="_top">'+
            '    <input class="input-search" id="J_HeaderSearchQuery" name="q" type="text" value="" placeholder="搜闲鱼" />'+
            '    <input type="hidden" name="search_type" value="item" autocomplete="off" />'+
            '    <input type="hidden" name="app" value="shopsearch" autocomplete="off" />'+
            '    <button class="btn-search" type="submit"><i class="iconfont">&#xe602;</i><span class="search-img"></span></button>'+
            '  </form>'+
            '</div>');
        //去掉碍事的
        $.each(['download-layer','mau-guide','idle-footer','xy-guide'],function(index,value){
            $('.' + value).remove();
        });
        $.each(['guarantee'],function(index,value){
            $('#' + value).remove();
        });
        $('#J_Message').find('img').each(function(){
            $(this).remove();
            return false;
        });
    });
})();