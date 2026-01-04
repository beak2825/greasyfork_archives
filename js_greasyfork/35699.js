// ==UserScript==
// @name         闲鱼显示搜索框
// @namespace    http://tampermonkey.net/
// @version      0.3
// @description  让闲鱼的搜索框显示出来
// @include      http*://s.2.taobao.com/*
// @include      http*://2.taobao.com/*
// @author       纳边的小黑屋
// @match        https://greasyfork.org/zh-CN
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/35699/%E9%97%B2%E9%B1%BC%E6%98%BE%E7%A4%BA%E6%90%9C%E7%B4%A2%E6%A1%86.user.js
// @updateURL https://update.greasyfork.org/scripts/35699/%E9%97%B2%E9%B1%BC%E6%98%BE%E7%A4%BA%E6%90%9C%E7%B4%A2%E6%A1%86.meta.js
// ==/UserScript==

(function() {
    'use strict';
    var header = document.getElementsByClassName("idle-header");
    var search = document.createElement("div");
    search.classList.add("idle-search");
    search.innerHTML = "<form method=\"get\" action=\"//s.2.taobao.com/list/list.htm\" name=\"search\" target=\"_top\">"+
            "<input class=\"input-search\" id=\"J_HeaderSearchQuery\" name=\"q\" type=\"text\" value=\"\" placeholder=\"搜闲鱼\" />"+
            "<input type=\"hidden\" name=\"search_type\" value=\"item\" autocomplete=\"off\" />"+
            "<input type=\"hidden\" name=\"app\" value=\"shopsearch\" autocomplete=\"off\" />"+
            "<button class=\"btn-search\" type=\"submit\"><i class=\"iconfont\">&#xe602;</i><span class=\"search-img\"></span></button>"+
        "</form>";

    header[0].appendChild(search);
})();