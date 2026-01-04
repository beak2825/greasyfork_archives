// ==UserScript==
// @name         https://tieba.baidu.com*/*
// @namespace    Tie Ba Bai Du - Remove Ads
// @icon         https://www.google.com/s2/favicons?domain=baidu.com
// @version      0.4
// @description  try to take over the world!
// @author       You
// @match        https://tieba.baidu.com*/*
// @supportURL   https://github.com/admin-ll55/
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/375529/https%3Atiebabaiducom%2A%2A.user.js
// @updateURL https://update.greasyfork.org/scripts/375529/https%3Atiebabaiducom%2A%2A.meta.js
// ==/UserScript==
setTimeout(function(){
    var script = document.createElement("SCRIPT");
    script.src = 'https://ajax.googleapis.com/ajax/libs/jquery/3.3.1/jquery.min.js';
    script.type = 'text/javascript';
    script.onload = function() {
        var $ = window.jQuery;
        //setInterval(function(){
            $("li.clearfix:not(.j_thread_list)").remove();
            $("div.l_post.l_post_bright.j_l_post.clearfix").each(function(){
                $(this).text().match("广告") ? $(this).remove() : void(0);
            });
        //}, 1000);
    };
    document.getElementsByTagName("head")[0].appendChild(script);
},5000);