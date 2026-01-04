// ==UserScript==
// @name              动漫翻滚器
// @version           0.1.1
// @description       按键翻屏
// @namespace         none
// @author            maple
// @require           https://cdn.bootcss.com/jquery/3.5.1/jquery.min.js
// @match             *://www.cocomanga.com/*
// @match             *://www.colamanhua.com/*
// @license           Apache-2.0
// @grant             unsafeWindow
// @grant             GM_openInTab
// @grant             GM.openInTab
// @grant             GM_getValue
// @grant             GM.getValue
// @grant             GM_setValue
// @grant             GM.setValue
// @grant             GM_xmlhttpRequest
// @grant             GM.xmlHttpRequest
// @grant             GM_registerMenuCommand
// @downloadURL https://update.greasyfork.org/scripts/453264/%E5%8A%A8%E6%BC%AB%E7%BF%BB%E6%BB%9A%E5%99%A8.user.js
// @updateURL https://update.greasyfork.org/scripts/453264/%E5%8A%A8%E6%BC%AB%E7%BF%BB%E6%BB%9A%E5%99%A8.meta.js
// ==/UserScript==

(function() {
    /**
    * 遵循开源协议,转载请注明出处谢谢
    * 此脚本参考代码相应位置附有出处
    */
    'use strict';

    document.onkeyup = function(e){
        let topx = $(window).scrollTop();
        if (e.keyCode == 88) {
            $(window).scrollTop(topx + 1300);
        }
        if (e.keyCode == 90) {
            $(window).scrollTop(topx - 1300);
        }
        if (e.keyCode == 67) {
            window.location.href = $(".mh_headpager a").eq(2).attr("href");
        }
    };


    // 定时删除广告
    window.onload=function(){
        setInterval(function(){
            $("[id^='container']").remove()
        }, 1000);
    }

})();