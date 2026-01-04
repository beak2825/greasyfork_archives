// ==UserScript==
// @name         Add Shortest Tab
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  開いている問題のコード長順の提出へのリンクを追加します
// @author       morioprog
// @match        https://atcoder.jp/contests/*/tasks/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/391692/Add%20Shortest%20Tab.user.js
// @updateURL https://update.greasyfork.org/scripts/391692/Add%20Shortest%20Tab.meta.js
// ==/UserScript==

$(function() {
    'use strict';
    var url = window.location.href.replace("?", "&").replace("tasks/","submissions?f.Status=AC&orderBy=source_length&f.Task=");
    $("li.pull-right").before("<li><a href='"+url+"'><span class='glyphicon glyphicon-flag' style='margin-right:4px;' aria-hidden='true'></span>最短コード</a></li>");
});