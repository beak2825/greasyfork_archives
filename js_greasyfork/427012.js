// ==UserScript==
// @name         百度经验、百度百科隐藏广告
// @namespace    http://tampermonkey.net/
// @version      0.1.2
// @description  隐藏广告，隐藏小窗播放
// @author       AN drew
// @match        *://jingyan.baidu.com/*
// @match        *://baike.baidu.com/*
// @require      https://lib.baomitu.com/jquery/3.5.0/jquery.min.js
// @grant        GM_addStyle
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/427012/%E7%99%BE%E5%BA%A6%E7%BB%8F%E9%AA%8C%E3%80%81%E7%99%BE%E5%BA%A6%E7%99%BE%E7%A7%91%E9%9A%90%E8%97%8F%E5%B9%BF%E5%91%8A.user.js
// @updateURL https://update.greasyfork.org/scripts/427012/%E7%99%BE%E5%BA%A6%E7%BB%8F%E9%AA%8C%E3%80%81%E7%99%BE%E5%BA%A6%E7%99%BE%E7%A7%91%E9%9A%90%E8%97%8F%E5%B9%BF%E5%91%8A.meta.js
// ==/UserScript==

(function() {
    'use strict';

    //百度经验
    GM_addStyle(`
.task-panel-entrance{display:none!important}
.wgt-left-promo{display:none!important}
.aside-wrap.wgt-cms-banner{display:none!important}
.aside-wrap.content{display:none!important}
.right-fixed-related-wrap{display:none!important}
.bottom-ads-container{display:none!important}
.bottom-pic-ads{display:none!important}
#aside-ads-container{display:none!important}
`);

    $('.exp-player-skin-area').click(function(){
        $('.exp-player-play-button .exp-player-control-icon:visible').get(0).click();
    })

    setInterval(function(){
        if($('.read-whole').length>0)
            $('.read-whole').get(0).click();

        if($('.video-originate-mini-close').length>0)
            $('.video-originate-mini-close').get(0).click();

        if($('.art-mini-close').length>0)
            $('.art-mini-close').get(0).click();
    },100);


    //百度百科
    GM_addStyle(`
.topA{display:none!important}
.appdownload{display:none!important}
.bds_task{display:none!important}
.task-tip{display:none!important}
#J-bottom-recommend-wrapper{display:none!important}
#J-related-search{display:none!important}
[class*='unionAd']{display:none!important}
[class*='rightAd']{display:none!important}
`);

    if( $('.larkplayer-switch').hasClass('checked') )
    {
        $('.larkplayer-switch').get(0).click();
    }

})();