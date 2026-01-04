// ==UserScript==
// @name         Show2TaobaoSearchBox
// @name:zh-CN   闲鱼显示搜索栏
// @namespace    BlueFire
// @version      0.1
// @description  Show 2.taobao.com SearchBox
// @description:zh-CN  显示闲鱼的搜索栏
// @author       BlueFire
// @include      https://2.taobao.com/*
// @include      http://2.taobao.com/*
// @include      https://s.2.taobao.com/*
// @include      http://s.2.taobao.com/*
// @grant        unsafeWindow
// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/32705/Show2TaobaoSearchBox.user.js
// @updateURL https://update.greasyfork.org/scripts/32705/Show2TaobaoSearchBox.meta.js
// ==/UserScript==

(function() {
    'use strict';

    window.onload = function(){
    var header = document.getElementById("J_IdleHeader");
    console.log(header.innerHTML);
    var searchBoxHtml = "<div class=\"idle-search\">" + 
  "<form method=\"get\" action=\"//s.2.taobao.com/list/list.htm\" name=\"search\" target=\"_top\">" + 
    "<input class=\"input-search\" id=\"J_HeaderSearchQuery\" name=\"q\" type=\"text\" value=\"\" placeholder=\"搜闲鱼\" />" + 
    "<input type=\"hidden\" name=\"search_type\" value=\"item\" autocomplete=\"off\" />" + 
    "<input type=\"hidden\" name=\"app\" value=\"shopsearch\" autocomplete=\"off\" />" + 
    "<button class=\"btn-search\" type=\"submit\"><i class=\"iconfont\">&#xe602;</i><span class=\"search-img\"></span></button>" + 
  "</form>" + 
"</div>";
    header.innerHTML += searchBoxHtml;
    var search_filters = document.getElementsByClassName("search-filters")[0];
    search_filters.style.display = "block";
};
})();
