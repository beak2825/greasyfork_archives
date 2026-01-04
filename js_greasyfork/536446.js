// ==UserScript==
// @name         MWI 修改商店颜色
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  根据价格修改颜色
// @author       502y
// @match        https://www.milkywayidle.com/*
// @match        https://test.milkywayidle.com/*
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/536446/MWI%20%E4%BF%AE%E6%94%B9%E5%95%86%E5%BA%97%E9%A2%9C%E8%89%B2.user.js
// @updateURL https://update.greasyfork.org/scripts/536446/MWI%20%E4%BF%AE%E6%94%B9%E5%95%86%E5%BA%97%E9%A2%9C%E8%89%B2.meta.js
// ==/UserScript==

(function () {
    'use strict';

    const config = {
        enable:true,//是否启用插件 if enable this plugin
        K:"",//以K结尾的价格颜色 color for the price end with K
        M:"",//以M结尾的价格颜色 color for the price end with M
        B:"",//以B结尾的价格颜色 color for the price end with B
        O:""//没有结尾单位的价格颜色 color for the price end with nothing
        //所有颜色留空即为白色 keep blank to set colors to white
    }

    if(config.enable){
        setInterval(() => {
            let inMarketplace = document.querySelector(".MarketplacePanel_marketplacePanel__21b7o")?.checkVisibility();
            if(inMarketplace){
                const spans = document.querySelectorAll('.MarketplacePanel_price__hIzrY span');

                spans.forEach(span => {

                    const text = span.textContent.trim().toUpperCase();

                    if (text.endsWith('K')) {
                        span.style.color = config.K;
                    } else if (text.endsWith('M')) {
                        span.style.color = config.M;
                    } else if (text.endsWith('B')) {
                        span.style.color = config.B;
                    }else{
                        span.style.color = config.O
                    }

                });
            }

        }, 500);
    }
})();