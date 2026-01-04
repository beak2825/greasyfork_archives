// ==UserScript==
// @name         CSDN广告
// @namespace    leevsee
// @version      0.1
// @description  去除CSDN文章广告
// @author       Leeves
// @match        http*://blog.csdn.net/**/article/details/**
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/375728/CSDN%E5%B9%BF%E5%91%8A.user.js
// @updateURL https://update.greasyfork.org/scripts/375728/CSDN%E5%B9%BF%E5%91%8A.meta.js
// ==/UserScript==

(function() {
    'use strict';
    var MutationObserver = window.MutationObserver || window.WebKitMutationObserver || window.MozMutationObserver;
    var observer = new MutationObserver(function(records) {
        clearAD();
    });
    var option = {
        'childList': true,
        'subtree': true
    };
    document.onreadystatechange = function() {
        if(document.readyState == "interactive") {
            observer.observe(document.body, option);
        }
    };

    function clearAD() {

        var mAds = document.querySelectorAll(".pulllog-box,#asideFooter,.meau-gotop-box,.csdn-tracking-statistics.mb8.box-shadow,.bdsharebuttonbox _360_interactive bdshare-button-style0-16,.recommend-item-box.recommend-ad-box,.fourth_column,.right-item _paradigm_S3_csdn_ads_render,#dmp_ad_58"),
            i;
        for(i = 0; i < mAds.length; i++) {
            var mAd = mAds[i];
            mAd.remove();
        }

        var rAds = document.querySelectorAll(".right-item"),j;
        for (j = 0; j < rAds.length; j++) {
            var rAd = rAds[j];
            if(rAd.getAttribute("id")){
                rAd.remove();
            }
        }
    }
    setTimeout(() => {
        clearAD();
    }, 2000);
})();