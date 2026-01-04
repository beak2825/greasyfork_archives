// ==UserScript==
// @name         快资讯美化
// @namespace    http://tampermonkey.net/
// @version      2025.12.17
// @description  将电脑版页面改为手机版，让新闻内容居中，隐藏推荐新闻
// @author       AN drew
// @match        *://www.360kuai.com/*
// @match        *://360kuai.com/*
// @run-at       document-start
// @require      https://lib.baomitu.com/jquery/3.5.0/jquery.min.js
// @grant        GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/400960/%E5%BF%AB%E8%B5%84%E8%AE%AF%E7%BE%8E%E5%8C%96.user.js
// @updateURL https://update.greasyfork.org/scripts/400960/%E5%BF%AB%E8%B5%84%E8%AE%AF%E7%BE%8E%E5%8C%96.meta.js
// ==/UserScript==

(function() {
    'use strict'

    GM_addStyle(`
    .main{overflow:visible!important}
    .main_content{overflow-y:visible!important}
    .main-section.article-section + .main-section{display:none!important}
    .detail-side{display:none!important}
    .detail-content__container{overflow-y:visible!important}
    .detail-content__overflow{overflow-y:visible!important}
    .maincar, .maincar_content{overflow-y:visible!important}
    .detail-content__recommend--wrapper{display:none!important}
    .detail-content__bottom{display:none!important}
    .detail-content__content{width:1024px!important}
    .detail-content{width: 1108px!important;}
    .modal.activity-paused-popup-modal{display:none!important}
    .asideCarBox{display:none!important}
    .g4.undefined{display:none!important}
    .article__content__textgg{display:none!important}
    .article__content__yyconfig{display:none!important}
    .deep-read .article-toolbar__wrapper{width: 440px!important}
    [id*=video-player]{width:auto!important; height:auto!important;}
    `);


    setInterval(function(){
        $('.content-body.clearfix').removeAttr('style');
        $('.ch-list-card-gg').closest('.ch-list-card').hide();
        $('.article-block-spliter').nextAll().hide();
    },500);
})();
