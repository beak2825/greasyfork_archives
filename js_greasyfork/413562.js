// ==UserScript==
// @name         Search anime on baha
// @namespace    http://tampermonkey.net/
// @version      1.1
// @description  在動畫瘋內搜尋相關資源
// @author       kater4343587
// @match        https://ani.gamer.com.tw/*
// @grant        GM_openInTab
// @downloadURL https://update.greasyfork.org/scripts/413562/Search%20anime%20on%20baha.user.js
// @updateURL https://update.greasyfork.org/scripts/413562/Search%20anime%20on%20baha.meta.js
// ==/UserScript==
(function() {
    'use strict';
    var searchText2 = $('div.anime_name h1').text();
       var delText=searchText2.substring(searchText2.lastIndexOf('[')+1, searchText2.lastIndexOf(']'));
       var slen=delText.length+2;
    var searchText = searchText2.substring(0,searchText2.length-slen);
    $('.anime_info_detail').after('<input type="button" id="Bangumi" value="Bangumi" class="btn self-btn bg s_btn" style="background-color:green;" /><input type="button" id="Anime1" value="Anime1" class="btn self-btn bg s_btn" style="background-color:green;" /><input type="button" id="Douban" value="Douban" class="btn self-btn bg s_btn" style="background-color:green;" /><input type="button" id="M1907" value="M1907" class="btn self-btn bg s_btn" style="background-color:green;" /><input type="button" id="Pianku" value="Pianku" class="btn self-btn bg s_btn" style="background-color:green;" /><input type="button" id="BiliBili" value="BiliBili" class="btn self-btn bg s_btn" style="background-color:green;" /><input type="button" id="ACG" value="ACG" class="btn self-btn bg s_btn" style="background-color:green;" />');
    $("#Bangumi").click(function() {
        GM_openInTab('https://bangumi.tv/subject_search/' + searchText +"?cat=all", false);
    });
    $("#Anime1").click(function() {
        GM_openInTab('https://anime1.cc/search?q=' + searchText, false);
    });
    $("#Douban").click(function() {
        GM_openInTab('https://search.douban.com/movie/subject_search?search_text=' + searchText, false);
    });
    $("#M1907").click(function() {
        GM_openInTab('https://z1.m1907.cn/?jx=' + searchText2, false);
    });
    $("#Pianku").click(function() {
        GM_openInTab('https://www.mypianku.net/s/go.php?q=' + searchText, false);
    })
    $("#BiliBili").click(function() {
        GM_openInTab('https://search.bilibili.com/all?keyword=' + searchText, false);
    })
    $("#ACG").click(function() {
        GM_openInTab('https://acg.rip/?term=' + searchText, false);
    })
})();