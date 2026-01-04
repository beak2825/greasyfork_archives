// ==UserScript==
// @name         hj remove ad　沪江小D 广告去除工具
// @namespace    https://github.com/nejidev
// @version      0.3
// @description  hj dic remove ad 沪江小D 广告去除工具
// @author       nejidev
// @match        https://dict.hjenglish.com/*
// @grant        none
// @require      http://code.jquery.com/jquery-3.4.1.min.js
// @downloadURL https://update.greasyfork.org/scripts/427560/hj%20remove%20ad%E3%80%80%E6%B2%AA%E6%B1%9F%E5%B0%8FD%20%E5%B9%BF%E5%91%8A%E5%8E%BB%E9%99%A4%E5%B7%A5%E5%85%B7.user.js
// @updateURL https://update.greasyfork.org/scripts/427560/hj%20remove%20ad%E3%80%80%E6%B2%AA%E6%B1%9F%E5%B0%8FD%20%E5%B9%BF%E5%91%8A%E5%8E%BB%E9%99%A4%E5%B7%A5%E5%85%B7.meta.js
// ==/UserScript==

(function() {
    'use strict';

    function div_remove(){
        $(".ad").hide();
        $("main").nextAll().hide();

        $("div").each(function(){
            if("fixed" == $(this).css("position") && ! $(this).hasClass("rocket"))
            {
                $(this).hide();
            }
        });
    }

    setTimeout(div_remove, 200);
    setTimeout(div_remove, 800);
    setTimeout(div_remove, 1000);
    setTimeout(div_remove, 2000);
})();