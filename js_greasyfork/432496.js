// ==UserScript==
// @name         Add Prev and Next Tab
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  自分用 / A, B問題の攻略
// @author       hayatoroid
// @match        https://atcoder.jp/contests/*/tasks/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/432496/Add%20Prev%20and%20Next%20Tab.user.js
// @updateURL https://update.greasyfork.org/scripts/432496/Add%20Prev%20and%20Next%20Tab.meta.js
// ==/UserScript==
 
$(function() {
    'use strict';
    var url = window.location.href;
    var num = Number(url.match(/\d+/));
    var url_prev;
    var url_next;
    if (url.match(/_a/)) {
        url_prev = url.replace(String(num).padStart(3, '0'), String(num - 1).padStart(3, '0')).replace(String(num).padStart(3, '0') + "_a", String(num - 1).padStart(3, '0') + "_b");
        url_next = url.replace("_a", "_b");
    } else {
        url_prev = url.replace("_b", "_a")
        url_next = url.replace(String(num).padStart(3, '0'), String(num + 1).padStart(3, '0')).replace(String(num).padStart(3, '0') + "_b", String(num + 1).padStart(3, '0') + "_a");
    }
    $("li.pull-right").before("<li><a href='"+url_prev+"'><span class='glyphicon glyphicon-step-backward' style='margin-right:4px;' aria-hidden='true'></span>Prev</a></li>");
    $("li.pull-right").before("<li><a href='"+url_next+"'><span class='glyphicon glyphicon-step-forward' style='margin-right:4px;' aria-hidden='true'></span>Next</a></li>");
});