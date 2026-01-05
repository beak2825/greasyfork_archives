// ==UserScript==
// @name       巴哈姆特－阻擋廣告
// @name:zh-TW  巴哈姆特－阻擋廣告
// @name:zh-HK  巴哈姆特－阻擋廣告
// @name:en     Bahamut - No more Ads!
// @namespace   BahamutAntiAd
// @description 享受無廣告體驗的巴哈姆特吧！
// @description:zh-TW 享受無廣告體驗的巴哈姆特吧！
// @description:en Enjoy Bahamut Without any advertisement!
// @author      SeaBao
// @include     /https?:\/\/.+\.gamer\.com\.tw(\/.+)?/
// @version     1.2.1
// @grant       none
// @run-at      document-body
// @icon        http://i.imgur.com/uvVy2nm.png
// @date        2016-12-24
// @downloadURL https://update.greasyfork.org/scripts/16693/%E5%B7%B4%E5%93%88%E5%A7%86%E7%89%B9%EF%BC%8D%E9%98%BB%E6%93%8B%E5%BB%A3%E5%91%8A.user.js
// @updateURL https://update.greasyfork.org/scripts/16693/%E5%B7%B4%E5%93%88%E5%A7%86%E7%89%B9%EF%BC%8D%E9%98%BB%E6%93%8B%E5%BB%A3%E5%91%8A.meta.js
// ==/UserScript==
(function() {
    'use strict';
    var MutationObserver = window.MutationObserver || window.WebKitMutationObserver || window.MozMutationObserver;
    var observer = new MutationObserver(function(){
        killADs();
    });
    var option = {
        'childList': true,
        'subtree': true
    };
    observer.observe(document.body, option);

    // Send 'AntiAd' function to its Death
    Object.defineProperty(window, 'AntiAd', {
        enumerable: true,
        writable: false,
        value: null
    });

    function killADs() {
        // Remove the Ad elements on the website.
        var adList = document.body.querySelectorAll("#flyRightBox>div, #BH-bigbanner, .BA-billboard, .BA-cboxAD, #aswift_0_expand");
        for (var i=0; i < adList.length; i++) {
            adList[i].parentNode.removeChild(adList[i]);
        }
    }
})();