// ==UserScript==
// @name         今日头条-宽版
// @namespace    http://tampermonkey.net/
// @version      2024-03-28
// @description  新闻页隐藏侧边栏和下方新闻推荐
// @author       AN drew
// @match        https://www.toutiao.com/article/*
// @require      https://lib.baomitu.com/jquery/3.5.0/jquery.min.js
// @grant        GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/491107/%E4%BB%8A%E6%97%A5%E5%A4%B4%E6%9D%A1-%E5%AE%BD%E7%89%88.user.js
// @updateURL https://update.greasyfork.org/scripts/491107/%E4%BB%8A%E6%97%A5%E5%A4%B4%E6%9D%A1-%E5%AE%BD%E7%89%88.meta.js
// ==/UserScript==

(function() {
    'use strict';

    GM_addStyle(`
    .article-detail-container .main{
        width:auto!important;
    }
    .ttp-comment-block{
        width:auto!important;
    }
    .article-detail-container .right-sidebar{
        display:none!important;
    }
    .detail-end-feed{
        display:none!important;
    }
    .seo-hot-link-list{
        display:none!important;
    }
    .feed-m-loading{
        display:none!important;
    }
    .article-detail-container .main .divide{
        display:none!important;
    }
    `);
    setInterval(function(){
        $('.check-more-reply').each(function(){
            if(!$(this).hasClass('done'))
            {
                $(this).click();
                $(this).addClass('done');
            }
        })
    },3000);
})();