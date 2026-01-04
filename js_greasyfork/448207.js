// ==UserScript==
// @name         鲜知软考（野人老师）
// @namespace    http://tampermonkey.net/
// @version      0.2.4.1
// @description  视频自动页面全屏
// @author       AN drew
// @match        https://appn27rhczr6822.pc.xiaoe-tech.com/p/t_pc/course_pc_detail/column/*
// @match        https://appn27rhczr6822.pc.xiaoe-tech.com/p/t_pc/course_pc_detail/video/*
// @require      https://lib.baomitu.com/jquery/3.5.0/jquery.min.js
// @grant        GM_addStyle
// @run-at       document-start
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/448207/%E9%B2%9C%E7%9F%A5%E8%BD%AF%E8%80%83%EF%BC%88%E9%87%8E%E4%BA%BA%E8%80%81%E5%B8%88%EF%BC%89.user.js
// @updateURL https://update.greasyfork.org/scripts/448207/%E9%B2%9C%E7%9F%A5%E8%BD%AF%E8%80%83%EF%BC%88%E9%87%8E%E4%BA%BA%E8%80%81%E5%B8%88%EF%BC%89.meta.js
// ==/UserScript==

(function() {
    'use strict';

    GM_addStyle(`.ss-loading-mask{display:none!important}`);

    if(window.location.href.indexOf("/column/") > -1)
    {
        let timer1 = setInterval(function(){
            if($('.load_more_btn').length > 0)
            {
                if($('.load_more_btn').css('display')!='none')
                {
                    $('.load_more_btn').get(0).click();
                }
                else
                {
                    clearInterval(timer1);
                }
            }
        },1000);
    }
    else if(window.location.href.indexOf("/video/") > -1)
    {
        let timer2 = setInterval(function(){
            if($('.xgplayer-fullscreen .xgplayer-icon-exitfull').length > 0)
            {
                console.log(11111111111)
                $('.xgplayer-fullscreen .xgplayer-icon-exitfull').click(function(){
                    setTimeout(function(){
                        $('.xgplayer-cssfullscreen .xgplayer-icon-requestfull').click();
                    },100)
                })
                clearInterval(timer2);
            }
        },1000);
        let timer3 = setInterval(function(){
            if($('.xgplayer-cssfullscreen .xgplayer-icon-requestfull').length > 0)
            {
                $('.xgplayer-cssfullscreen .xgplayer-icon-requestfull').click();
                clearInterval(timer3);
            }
        },1000);
    }
})();