// ==UserScript==
// @name         baidu去广告
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  baidu去广告 yyds
// @author       You
// @match        https://www.baidu.com/*
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/437074/baidu%E5%8E%BB%E5%B9%BF%E5%91%8A.user.js
// @updateURL https://update.greasyfork.org/scripts/437074/baidu%E5%8E%BB%E5%B9%BF%E5%91%8A.meta.js
// ==/UserScript==

(function() {
    'use strict';
    $("#content_left").css({"width":"600px"})
    init();
    setInterval(function(){
        init();
    },2000);
})();

function init(){
    var divs = $("#content_left > div");
    $("head").append("<style>.result-hover:hover{box-shadow: rgb(0 0 0 / 19%) 0px 10px 30px, rgb(0 0 0 / 23%) 0px 6px 10px}"+
                     ".result-hover{padding:20px; box-shadow:rgb(0 0 0 / 10%) 0px 2px 5px 0px;border-radius:12px;transition: all 450ms cubic-bezier(0.23, 1, 0.32, 1) 0ms</style>")
    divs.removeClass("result-hover")
    divs.addClass("result-hover")
    var length = divs.length;
    for(var i=0;i<length;i++){
        var tips = divs.eq(i).find(".c-gap-left");
        var tipsLength = tips.length;
        for(var j = 0; j < tipsLength; j++){
            if(tips.eq(j).text() === '广告'){
                divs.eq(i).css({"display":"none"});
            }
        }
    }
    $("#content_right").css({"display":"none"});
    $(".c-border").removeClass("c-border")
}