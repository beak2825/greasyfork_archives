// ==UserScript==
// @name         AuthClick
// @namespace    http://tampermonkey.net/
// @version      0.3
// @description  try to take over the world!
// @author       You
// @match        http://www.tadaigou.com/*
// @match        http://www.xun-niu.com/*
// @match        http*://www.macgn.com/*
// @match        http*://bbs.imoutolove.me/*
// @grant        none
// @require      https://cdn.bootcss.com/jquery/3.4.1/jquery.min.js
// @downloadURL https://update.greasyfork.org/scripts/404015/AuthClick.user.js
// @updateURL https://update.greasyfork.org/scripts/404015/AuthClick.meta.js
// ==/UserScript==

(function() {
    var inputInterval;
    if (location.href.indexOf("www.tadaigou.com") > 0) {
        if ($("#pageCover").is(":visible")){
            $("#pageCover").css('display','none');
            $("#dlgTest").css('display','none');
            $("div.down_five_b a")[1].click()
        }
    } else if (location.href.indexOf("www.xun-niu.com/down2-") > 0 || location.href.indexOf("www.xun-niu.com/file") > 0){
        console.warn("down_now 开始查找");
        setInterval(function (){
            if ($("a.down_now").length > 0) {
                console.warn("down_now 找到");
                $("a.down_now")[0].click()
            } else {
                console.warn("down_now 未找到");
            }
        },1000);
    } else if (location.href.indexOf("www.xun-niu.com/down-") > 0){
        inputInterval = setInterval(function (){
            if ($("input#code.span12")[0].value.length >= 4) {
                check_code()
                setTimeout(function(){$("a.down_btn")[5].click()}, 2000);
            }
        }, 1000);
    } else if ("https://www.macgn.com/" == (location.href)){
        setTimeout(function(){
            if ($("a.poi-tooltip.is-bottom.inn-nav__point-sign-daily__btn").length > 0) {
                $("a.poi-tooltip.is-bottom.inn-nav__point-sign-daily__btn")[0].click()
            } else {
                console.warn("a.poi-tooltip.is-bottom.inn-nav__point-sign-daily__btn 未找到");
            }
        }, 2000);
    } else if (location.href.indexOf("www.macgn.com") > 0){
        setTimeout(function(){
            if ($("a.inn-singular__post__toolbar__item__link").length > 0) {
                $("a.inn-singular__post__toolbar__item__link")[0].click()
                setTimeout(function(){ $("a.inn-singular__post__toolbar__item__link")[2].click()}, 5000);
            } else {
                console.warn("singular__post__toolbar__item__link 未找到");
            }
        }, 5000);
    } else if (location.href.indexOf("bbs.imoutolove.me/thread.php") > 0){
        location.href = location.href.replace("thread.php", "thread_new.php");
    }
}
)();