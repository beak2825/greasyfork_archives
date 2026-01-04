// ==UserScript==
// @name         移除cnBeta文章底部的红框和弹窗
// @namespace    http://tampermonkey.net/
// @version      0.73
// @description  移除cnBeta文章底部的反adblock红框, 移除弹窗
// @author       You
// @match        https://*.cnbeta.com/*
// @match        https://*.cnbeta.com.tw/*
// @require http://code.jquery.com/jquery-3.4.1.min.js
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/404239/%E7%A7%BB%E9%99%A4cnBeta%E6%96%87%E7%AB%A0%E5%BA%95%E9%83%A8%E7%9A%84%E7%BA%A2%E6%A1%86%E5%92%8C%E5%BC%B9%E7%AA%97.user.js
// @updateURL https://update.greasyfork.org/scripts/404239/%E7%A7%BB%E9%99%A4cnBeta%E6%96%87%E7%AB%A0%E5%BA%95%E9%83%A8%E7%9A%84%E7%BA%A2%E6%A1%86%E5%92%8C%E5%BC%B9%E7%AA%97.meta.js
// ==/UserScript==

!function(){"use strict";
    $("#abd-ad-iframe-wrapper").remove();
    var e=0;e=setInterval(function(){
        let t,a=!1;0!==(t=$("a[href='//www.cnbeta.com/articles/3.htm']").parents().eq(2)).length&&(t.remove(),a=!0),a&&(clearInterval(e),$("body").css("padding-bottom","0"))
    },100);//I can't remember what is the original code
    //Then create another setInterval to make the function working
    var t=0;
    t=setInterval(function () {
        if ( $('.fc-ab-root i.fc-close-icon').length != 0 ) {
            $('.fc-ab-root i.fc-close-icon').click();
            var clicked = true;
        }
        if ( $('.fc-ab-root').length == 0 && clicked ) { // make the code easy to read for all people
            clearInterval(t);
        }
    }, 100);
}();