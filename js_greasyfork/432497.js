// ==UserScript==
// @name         Add Shortest Tab of Python3
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  開いている問題のPython3のコード長順の提出へのリンクを追加します
// @author       hayatoroid
// @match        https://atcoder.jp/contests/*/tasks/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/432497/Add%20Shortest%20Tab%20of%20Python3.user.js
// @updateURL https://update.greasyfork.org/scripts/432497/Add%20Shortest%20Tab%20of%20Python3.meta.js
// ==/UserScript==
 
$(function() {
    'use strict';
    var url = window.location.href.replace("?", "&").replace("tasks/","submissions?f.Status=AC&f.LanguageName=Python3&orderBy=source_length&f.Task=");
    $("li.pull-right").before("<li><a href='"+url+"'><span class='glyphicon glyphicon-flag' style='margin-right:4px;' aria-hidden='true'></span>Python3</a></li>");
});