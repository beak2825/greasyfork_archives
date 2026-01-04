// ==UserScript==
// @name         search2.Taobao
// @name:zh-CN   咸鱼搜索框
// @namespace    Itzcy
// @version      0.3
// @description  search2Taobao
// @description:zh-CN  简陋的咸鱼搜索框
// @author       Itzcy
// @include      https://2.taobao.com/*
// @include      http://2.taobao.com/*
// @include      https://s.2.taobao.com/*
// @include      http://s.2.taobao.com/*
// @downloadURL https://update.greasyfork.org/scripts/379891/search2Taobao.user.js
// @updateURL https://update.greasyfork.org/scripts/379891/search2Taobao.meta.js
// ==/UserScript==

(function() {
    'use strict';

    window.onload = function(){
        var header = document.getElementById("J_IdleHeader");
        if (header) {
            console.log(header.innerHTML);
            var searchBoxHtml = "<div class=\"idle-search\">" + 
          "<form method=\"get\" action=\"//s.2.taobao.com/list\" name=\"search\" target=\"_top\">" + 
            "<input class=\"input-search\" id=\"J_HeaderSearchQuery\" name=\"q\" type=\"text\" value=\"\" placeholder=\"搜闲鱼\" />" + 
            "<button class=\"btn-search\" type=\"submit\"><i class=\"iconfont\">&#xe602;</i><span class=\"search-img\"></span></button>" + 
          "</form>" + 
        "</div>";
            header.innerHTML += searchBoxHtml;
            var search_filters = document.getElementsByClassName("search-filters")[0];
            search_filters.style.display = "block";
        } else {
            var header = document.getElementsByClassName('tab-wrap')[0]
            console.log(header.innerHTML);
            var searchBoxHtml = "<div class=\"idle-search\">" + 
          "<form method=\"get\" action=\"//s.2.taobao.com/list\" name=\"search\" target=\"_top\">" + 
            "<input class=\"input-search\" id=\"J_HeaderSearchQuery\" name=\"q\" type=\"text\" value=\"\" placeholder=\"搜闲鱼\" />" + 
            "<button class=\"btn-search\" type=\"submit\">搜索<span class=\"search-img\"></span></button>" + 
          "</form>" + 
        "</div>";
            header.innerHTML += searchBoxHtml;
        }
    
};
})();
