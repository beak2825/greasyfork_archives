// ==UserScript==
// @name         百度搜索加Google、头条搜索按钮
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  Add Google on Baidu searcher
// @author       aniu
// @match        https://www.baidu.com/*
// @grant        GM_openInTab
// @downloadURL https://update.greasyfork.org/scripts/424662/%E7%99%BE%E5%BA%A6%E6%90%9C%E7%B4%A2%E5%8A%A0Google%E3%80%81%E5%A4%B4%E6%9D%A1%E6%90%9C%E7%B4%A2%E6%8C%89%E9%92%AE.user.js
// @updateURL https://update.greasyfork.org/scripts/424662/%E7%99%BE%E5%BA%A6%E6%90%9C%E7%B4%A2%E5%8A%A0Google%E3%80%81%E5%A4%B4%E6%9D%A1%E6%90%9C%E7%B4%A2%E6%8C%89%E9%92%AE.meta.js
// ==/UserScript==
(function() {
    'use strict';
    $('#su').after('<div style="position: absolute;left: 115px;top: 0px;"><input type="button" id="google" value="Google搜索" class="btn bg s_btn" style="background-color:orange;" /></div><div style="position: absolute;left: 230px;top: 0px;"><input type="button" id="toutiao" value="头条搜索" class="btn bg s_btn" style="background-color:red;" /></div>');
    $("#google").click(function() {
        var searchText = $('#kw').val();
        GM_openInTab('https://www.google.com/search?q=' + document.getElementById('kw').value, false);
    });
    $("#toutiao").click(function() {
        var searchText = $('#kw').val();
        GM_openInTab('https://www.toutiao.com/search/?keyword=' + document.getElementById('kw').value, false);
    });
})();