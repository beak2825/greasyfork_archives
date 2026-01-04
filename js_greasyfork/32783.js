// ==UserScript==
// @name         闲鱼搜索
// @version      1.2.2
// @description  方便用户使用PC端直接搜索闲置物品
// @author       Sin
// @match        https://2.taobao.com/*
// @match        https://*.2.taobao.com/*
// @match        https://s.ershou.taobao.com/*
// @require      http://cdn.bootcss.com/jquery/1.8.3/jquery.min.js
// @grant        none
// @namespace http://tampermonkey.net/
// @downloadURL https://update.greasyfork.org/scripts/32783/%E9%97%B2%E9%B1%BC%E6%90%9C%E7%B4%A2.user.js
// @updateURL https://update.greasyfork.org/scripts/32783/%E9%97%B2%E9%B1%BC%E6%90%9C%E7%B4%A2.meta.js
// ==/UserScript==

(function() {
    // 顶部搜索栏
    var s = document.createElement("div");
    s.className = "idle-search";
    s.innerHTML ='<form method="get" action="//s.2.taobao.com/list/list.htm" name="search" target="_top">' +
        '<input class="input-search" id="J_HeaderSearchQuery" name="q" type="text" value="" placeholder="搜闲鱼" />' +
        '<button class="btn-search" type="submit"><i class="iconfont">&#xe602;</i><span class="search-img"></span></button>' +
        '</form>';
    document.getElementById("J_IdleHeader").appendChild(s);
    // 列表页搜索栏
    var x = document.getElementsByClassName('search-filters-block search-filters');
    if (x.length > 0) {
        x[0].style.display = "initial";
    }
 // 列表图片下显示描述
      function t(){
        var items = document.getElementsByClassName("item-pic");
        for (var i = 0; i < items.length; i++) {
            var item = items[i];
            var title = item.getElementsByTagName("a")[0].getAttribute("title");

            if(item.getElementsByTagName("t").length===0){
                var t = document.createElement("t");
                t.innerHTML = "<t style='margin-top: 0.5rem;'>" + title + "</p>";
                item.append(t);
            }
        }
    }
    t();
    document.body.onmousewheel = function(){
        t();
    };
    document.onkeyup = function(){
        t();
    };
    // 移除APP下载提示
    $(document).ready(function(){
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