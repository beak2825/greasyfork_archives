// ==UserScript==
// @name         百度教育展开答案解析
// @namespace    http://tampermonkey.net/
// @version      2024-05-21
// @description  展开答案解析
// @author       AN drew
// @match        https://easylearn.baidu.com/edu-page/tiangong/*
// @require      https://lib.baomitu.com/jquery/3.5.0/jquery.min.js
// @grant        GM_addStyle
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/465793/%E7%99%BE%E5%BA%A6%E6%95%99%E8%82%B2%E5%B1%95%E5%BC%80%E7%AD%94%E6%A1%88%E8%A7%A3%E6%9E%90.user.js
// @updateURL https://update.greasyfork.org/scripts/465793/%E7%99%BE%E5%BA%A6%E6%95%99%E8%82%B2%E5%B1%95%E5%BC%80%E7%AD%94%E6%A1%88%E8%A7%A3%E6%9E%90.meta.js
// ==/UserScript==

(function() {
    'use strict';

    GM_addStyle(`.vip-banner-cont{display:none!important}
                 .feedback-icon{display:none!important}
                 .exercise-new-dialog-mask{display:none!important}
                 .overlay{display:none!important}
                 .everyone-search-box{display:none!important}
                 .vip-card-warp{display:none!important}
                 .doc-preview{display:none!important}
                 #questionVideo{display:none!important}
                 .business-el-line{display:none!important}
                 `);

    //查看答案
    let t1 =setInterval(function(){
        if($('.toogle-btn').length>0)
        {
            $('.toogle-btn').click();
            setTimeout(function(){
                $('.exercise-btn-4').click();
            },500);
            //clearInterval(t1);
        }
    },1000);

    //查看答案
    let t2 =setInterval(function(){
        if($('.more-text').length>0)
        {
            $('.more-text').click();
            setTimeout(function(){
                $('.dan-btn').click();
            },500);
            clearInterval(t2);
        }
    },1000)

    //展开解析
    let t3 =setInterval(function(){
        if($('.expand-btn').length>0)
        {
            $('.expand-btn').click();
            clearInterval(t3);
        }
    },1000)


})();