// ==UserScript==
// @name         搜狐新闻美化
// @namespace    http://tampermonkey.net/
// @version      0.1.4
// @description  try to take over the world!
// @author       AN drew
// @match        https://www.sohu.com
// @match        *://*.sohu.com/*
// @grant        GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/402907/%E6%90%9C%E7%8B%90%E6%96%B0%E9%97%BB%E7%BE%8E%E5%8C%96.user.js
// @updateURL https://update.greasyfork.org/scripts/402907/%E6%90%9C%E7%8B%90%E6%96%B0%E9%97%BB%E7%BE%8E%E5%8C%96.meta.js
// ==/UserScript==

(function() {
    'use strict';

    GM_addStyle(`
.god_header.clearfix.area{display:none!important}
.god-wrapper.area.god-main.clearfix{display:none!important}
.godR{display:none; visibility:hidden; position:absolute; top:-1000px;}
.god-wrapper.area.clearfix{display:none!important}
.god-main.god-main-top{display:none!important}
.extend-mod.bordR{display:none!important}
.god-cut{display:none; visibility:hidden; position:absolute; top:-1000px;}
.god-main{display:none; visibility:hidden; position:absolute; top:-1000px;}
#left-bottom-ad{display:none!important}
#right-side-bar{display:none!important}
.groom-read{display:none!important}
#articleAllsee{display:none; visibility:hidden; position:absolute; top:-1000px;}
#god_bottom_banner{display:none; visibility:hidden; position:absolute; top:-1000px;}
.news-box.clear.news-box-thr{display:none!important}
#beans_15318{display:none!important}
.ad-rect{display:none!important}
.ad-feed-item{display:none!important}
#left-bottom-god{display:none!important}
.myBaiduAd{display:none!important}
.channel-top{display:none; visibility:hidden; position:absolute; top:-1000px;}
.ad_top{display:none!important}
.area.adbox{display:none; visibility:hidden; position:absolute; top:-1000px;}
div[id*=feed-ad]{display:none; visibility:hidden; position:absolute; top:-1000px;}
div[id*=div-xps-ad]{display:none; visibility:hidden; position:absolute; top:-1000px;}
#pic_container{display:none; visibility:hidden; position:absolute; top:-1000px;}
.article-page #article-container .main{width: 840px!important}
#videoRecContent{display:none!important}
#videoHotListContent{display:none!important}
#main-header.hide{display:none!important}
.article-video-page .main-content #sohuplayer{width: auto!important}
.mptcfe-player .mptcfe-player__control .progress-bar .progress-bar__line {height: 8px!important}
.mptcfe-player .mptcfe-player__control .progress-bar:hover .progress-bar__line {height: 8px!important}
.mptcfe-player .mptcfe-player__control .control-volume-btn .volume-line{width: 5px!important}
.mptcfe-player .mptcfe-player__control .control-volume-btn .volume-line__ing{width: 5px!important}
.mptcfe-player .mptcfe-player__control .control-volume-btn .volume-line__ball{width: 8px!important; height: 8px!important}
    `)

    setInterval(function(){
        if($('.mptcfe-player').hasClass('mptcfe-player__full-mode'))
        {
            $('#main-header').addClass('hide');
        }
        else
        {
            $('#main-header').removeClass('hide');
        }
    },500)
})();