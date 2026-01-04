// ==UserScript==
// @name         内蒙古网络学院
// @namespace    http://tampermonkey.net/
// @version      2025-1-7
// @description  离开页面时自动点击继续学习，持续播放视频
// @author       AN drew
// @match        *://*.nmgdj.gov.cn/*
// @exclude      *://wlxy.nmgdj.gov.cn/special/*
// @require      https://lib.baomitu.com/jquery/3.5.0/jquery.min.js
// @grant        GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/454519/%E5%86%85%E8%92%99%E5%8F%A4%E7%BD%91%E7%BB%9C%E5%AD%A6%E9%99%A2.user.js
// @updateURL https://update.greasyfork.org/scripts/454519/%E5%86%85%E8%92%99%E5%8F%A4%E7%BD%91%E7%BB%9C%E5%AD%A6%E9%99%A2.meta.js
// ==/UserScript==

(function() {
    'use strict';

    if(window.location.href.indexOf('wlxy.nmgdj.gov.cn/detail/') > -1)
    {
        setInterval(function(){
            if($('div[role="alertdialog"] .next-btn').length>0)
            {
                $('div[role="alertdialog"] .next-btn').click();
            }

            if($('.xgplayer-time-current').text()==$('.xgplayer-time-current+span').text())
            {

                $('title').text('【播放完成】内蒙古网络学院');
            }
        },3000)
    }
    else if(window.location.href.indexOf('rst.nmgdj.gov.cn/') > -1)
    {
        setInterval(function(){
            if($('div[role="dialog"] .el-button').length>0)
            {
                $('div[role="dialog"] .el-button').click();
            }

            if(window.location.href.indexOf('courseId') > -1)
            {
                if($('.vjs-current-time-display').text()==$('.vjs-duration-display').text() )
                {
                    $('title').text('【播放完成】内蒙古事业单位工作人员网络培训学院');
                }
            }
        },3000)
    }

    logo=setInterval(function(){
        if($('.wheader-logo').length>0)
        {
            $('.wheader-logo').wrap('<a href="https://rst.nmgdj.gov.cn"></a>');
            clearInterval(logo);
        }
    },3000)

    GM_addStyle(`
    [class="$id--option_key--LHu7jB9"] {background:#8080804d;}
    [class="$id--option_key--DNJl9Td"] {background:#8080804d;}
    `);

})();