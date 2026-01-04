// ==UserScript==
// @name         新浪爱问共享资料
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  隐藏广告
// @author       AN drew
// @match        http://ishare.iask.sina.com.cn/f/*
// @grant        GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/437697/%E6%96%B0%E6%B5%AA%E7%88%B1%E9%97%AE%E5%85%B1%E4%BA%AB%E8%B5%84%E6%96%99.user.js
// @updateURL https://update.greasyfork.org/scripts/437697/%E6%96%B0%E6%B5%AA%E7%88%B1%E9%97%AE%E5%85%B1%E4%BA%AB%E8%B5%84%E6%96%99.meta.js
// ==/UserScript==

(function() {
    'use strict';

    GM_addStyle(`.copyright-container{display:none!important}
    .detail-fixed.detail-fixed-full{display:none!important}
    .detail-topbanner{display:none!important}
    #fix-right{display:none!important}
    .detail-search-info{display:none!important}
    .tui-open-vip{display:none!important}
    .guess-you-like{display:none!important}
    `);


    let timer = setInterval(function(){
        if($('.show-more-text').text().indexOf('¥') > -1)
        {
            console.log($('.show-more-text').text())
            clearInterval(timer);
        }
        else
        {
            $('.show-more-text .red-color').get(0).click();
        }
    },100);

})();