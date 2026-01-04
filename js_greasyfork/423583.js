// ==UserScript==
// @name         好看视频去除视频推荐
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  去除视频推荐，隐藏小窗播放
// @author       AN drew
// @match        https://haokan.baidu.com/*
// @match        https://haokan.baidu.com*
// @match        https://quanmin.baidu.com/*
// @match        https://quanmin.baidu.com*
// @match        https://mbd.baidu.com/newspage/*
// @require      https://lib.baomitu.com/jquery/3.5.0/jquery.min.js
// @grant        GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/423583/%E5%A5%BD%E7%9C%8B%E8%A7%86%E9%A2%91%E5%8E%BB%E9%99%A4%E8%A7%86%E9%A2%91%E6%8E%A8%E8%8D%90.user.js
// @updateURL https://update.greasyfork.org/scripts/423583/%E5%A5%BD%E7%9C%8B%E8%A7%86%E9%A2%91%E5%8E%BB%E9%99%A4%E8%A7%86%E9%A2%91%E6%8E%A8%E8%8D%90.meta.js
// ==/UserScript==

(function() {
    'use strict';

    setInterval(()=>{
        $('.page-search-input').attr('placeholder','');
        $('[class*="search-input_page-search-input"]').attr('placeholder','');
    },1);

    if(window.location.href.indexOf('haokan') > -1)
    {
        GM_addStyle(`
            .page-right{display:none!important}
            .guess{display:none!important}
            .lianmeng-pause{display:none!important}
            .endimagead-download{display:none!important}
            .page-top-rightinfo-download{display:none!important}
            .videolist-aditem{display:none!important}
            [class*='page-top-rightinfo-download']{display:none!important}
            [class*='playEnd']{display:none!important}
            [class*='videoList_videolist-aditem']{display:none!important}
            [class*='pageBase_h5-game-float']{display:none!important}
            [class*='guessLike_guess-item-link']{display:none!important}
            [class*='guessLike']{display:none!important}
            `)

        if($('.next-switch').hasClass('ant-switch-checked'))
        {
            $('.next-switch').click();
        }

        if($('.hkplayer-switch').hasClass('hkplayer-switch-active'))
        {
            $('.hkplayer-switch').click();
        }

        setTimeout(function(){
            if($('.art-control-quality .art-selector-value').text()=='自动')
            {
                $('.art-control-quality').click();
                $('.art-control-quality .art-selector-list .art-selector-item:nth-of-type(1)').click()
            }
        },3000)
    }
    else if(window.location.href.indexOf('quanmin') > -1)
    {
        GM_addStyle(`
        .next{display:none!important}
        .left-wrapper{max-width:100%}
        `)

        if($('.next-switch').hasClass('next-switch-checked'))
        {
            $('.next-switch').click();
        }
    }
    else if(window.location.href.indexOf('mbd') > -1)
    {
        GM_addStyle(`
        [class*="jYgGxY41xOhyNkkjO6OnAQ=="]{display:none!important}
        [class*="nyqAGhIAK2ahoh402VkTrA=="]{height:auto!important}
        `)

        if($('[class*="ybAX8rUNoQIyHb3vDdyTuQ=="]').hasClass('THX5PRlaMM2gpNNjzW4y6g=='))
        {
            $('[class*="ybAX8rUNoQIyHb3vDdyTuQ=="]').click();
        }

        setInterval(function(){
            if($('.art-video-player').length>0)
            {
                $('.art-video-player').removeClass('art-mini')
            }
        },100)
    }
})();