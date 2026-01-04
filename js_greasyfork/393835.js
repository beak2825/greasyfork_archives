// ==UserScript==
// @name         百度知道显示踩数
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  try to take over the world!
// @author       You
// @match        https://zhidao.baidu.com/question/*
// @grant        none
// @require      http://code.jquery.com/jquery-1.11.0.min.js
// @downloadURL https://update.greasyfork.org/scripts/393835/%E7%99%BE%E5%BA%A6%E7%9F%A5%E9%81%93%E6%98%BE%E7%A4%BA%E8%B8%A9%E6%95%B0.user.js
// @updateURL https://update.greasyfork.org/scripts/393835/%E7%99%BE%E5%BA%A6%E7%9F%A5%E9%81%93%E6%98%BE%E7%A4%BA%E8%B8%A9%E6%95%B0.meta.js
// ==/UserScript==
$(document).ready(function() {
    'use strict';

    $("span.evaluate-bad").each(function(){
        $(this).children("b.evaluate-num").text($(this).attr("data-evaluate"));
    });
});
