// ==UserScript==
// @name         电子发烧友直接阅读全文
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  电子发烧友直接阅读全文并去除头部广告
// @author       DC
// @match        http://m.elecfans.com/*
// @grant        none
// @require      https://apps.bdimg.com/libs/jquery/2.1.4/jquery.min.js
// @run-at document-end
// @downloadURL https://update.greasyfork.org/scripts/430534/%E7%94%B5%E5%AD%90%E5%8F%91%E7%83%A7%E5%8F%8B%E7%9B%B4%E6%8E%A5%E9%98%85%E8%AF%BB%E5%85%A8%E6%96%87.user.js
// @updateURL https://update.greasyfork.org/scripts/430534/%E7%94%B5%E5%AD%90%E5%8F%91%E7%83%A7%E5%8F%8B%E7%9B%B4%E6%8E%A5%E9%98%85%E8%AF%BB%E5%85%A8%E6%96%87.meta.js
// ==/UserScript==

(function() {
    'use strict';
    function hideAd() {
        var AdList = document.querySelectorAll('.open_app.flex.open_app_fixed')
        if(AdList instanceof Object && AdList.length>0){
            for(var i=0;i<AdList.length;i++){
                AdList[i].style.display = 'none'
            }
        }
    }

    function hideReadMore(){
        $('.article').removeClass('limit_height').removeClass('limit_height_computer');
        // $('.show_more').parents('.see_more').remove();
        $('.see_more_arc').addClass('hide');
        layer.closeAll()
    }

    setTimeout(()=>{
       hideReadMore()
    }, 1000)

    $(window).scroll(function(){
        var scrollTop = document.documentElement.scrollTop || document.body.scrollTop;
        if (scrollTop > 0) {
            hideAd();
        }
    });
})();