// ==UserScript==
// @name         追高清Google站内搜索
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  追高清网站使用Google站内搜索
// @author       Haiifenng
// @match        http://www.zhuihd.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/378210/%E8%BF%BD%E9%AB%98%E6%B8%85Google%E7%AB%99%E5%86%85%E6%90%9C%E7%B4%A2.user.js
// @updateURL https://update.greasyfork.org/scripts/378210/%E8%BF%BD%E9%AB%98%E6%B8%85Google%E7%AB%99%E5%86%85%E6%90%9C%E7%B4%A2.meta.js
// ==/UserScript==

(function() {
    'use strict';

    $("form[name='sogou_queryform']").remove();
    $("#baiduform").parent().remove();

    var formGoogle = '<form target="_blank" name="google_queryform" _lpchecked="1" onsubmit="javascript:return false;">';
	formGoogle +='		<span class="search-input">';
	formGoogle +='			<input type="text" placeholder="使用Google站内搜索关键字" id="google_query"><button type="button" id="google_submit">Google</button>';
	formGoogle +='		</span>';
	formGoogle +='</form>';
    var searchbar = $("#search-main").find(".searchbar");
    searchbar.append(formGoogle);

    var googleQuery = function(q) {
        if (!q){
            return;
        }
        var url = "https://www.google.com.hk/search?q="+q+"+site%3Azhuihd.com";
        window.open(url)
    };
    var input = $("#google_query");
    input.off("keydown").on("keydown",function(event){
        var q = $(this).val();
        if (q.length === 0) {
            return;
        }
        if(event.keyCode == 13) {
            googleQuery(q);
        }
    });

    var btn = $("#google_submit");
    btn.attr("type","button");
    btn.text("Google");
    btn.off("click").on("click",function(){
        var q = $("#google_query").val();
        googleQuery(q);
        return false;
    });
})();