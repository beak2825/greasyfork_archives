// ==UserScript==
// @name        雅虎中国搜索回归版
// @namespace    http://tampermonkey.net/
// @version      1.0.0
// @description  让360搜索重现雅虎中国搜索的荣光!
// @author       wknet1988
// @match        https://www.so.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/398367/%E9%9B%85%E8%99%8E%E4%B8%AD%E5%9B%BD%E6%90%9C%E7%B4%A2%E5%9B%9E%E5%BD%92%E7%89%88.user.js
// @updateURL https://update.greasyfork.org/scripts/398367/%E9%9B%85%E8%99%8E%E4%B8%AD%E5%9B%BD%E6%90%9C%E7%B4%A2%E5%9B%9E%E5%BD%92%E7%89%88.meta.js
// ==/UserScript==

(function() {
    $("title").html("雅虎中国搜索");
    $("a[data-linkid='hao']").remove();
    $("link[rel='shortcut icon']").attr("href","https://images.search.yahoo.com/favicon.ico");
    $("#bd_logo").html('<img src="https://s.yimg.com/rz/p/yahoo_frontpage_en-US_s_f_p_205x58_frontpage_2x.png">').css("text-align","center");
    $(".g-hd-logo").html('<img src="https://s.yimg.com/pv/static/img/yahoo-search-logo-88x21.png">');
    $("#hd-rtools .show-bigscreen a.home-nav").html("雅虎中国搜索首页");
})();