// ==UserScript==
// @name         Add Shortest Tab of C++
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  開いている問題のC++のコード長順の提出へのリンクを追加します
// @author       hayatoroid
// @match        https://atcoder.jp/contests/*/tasks/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/435135/Add%20Shortest%20Tab%20of%20C%2B%2B.user.js
// @updateURL https://update.greasyfork.org/scripts/435135/Add%20Shortest%20Tab%20of%20C%2B%2B.meta.js
// ==/UserScript==
 
$(function() {
    'use strict';
    var url = window.location.href.replace("?", "&").replace("tasks/","submissions?orderBy=source_length&f.LanguageName=C%2B%2B&f.Status=AC&f.Task=");
    $("li.pull-right").before("<li><a href='"+url+"'><span class='glyphicon glyphicon-flag' style='margin-right:4px;' aria-hidden='true'></span>C++</a></li>");
});