// ==UserScript==
// @name         樱花动漫去广告
// @namespace    http://tampermonkey.net/
// @version      0.2.0
// @description  去除左右以及悬浮广告
// @author       YD XBUBBLE
// @include      http://www.yhdm.so/*
// @include      http://fjisu2.com/*
// @include      http://www.yinghuacd.com/*
// @include      http://www.fjisu2.com/*
// @include      http://www.yinghuajinju.com/*
// @include      http://www.iyinghua.com/*
// @require      https://code.jquery.com/jquery-3.6.0.min.js
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/508671/%E6%A8%B1%E8%8A%B1%E5%8A%A8%E6%BC%AB%E5%8E%BB%E5%B9%BF%E5%91%8A.user.js
// @updateURL https://update.greasyfork.org/scripts/508671/%E6%A8%B1%E8%8A%B1%E5%8A%A8%E6%BC%AB%E5%8E%BB%E5%B9%BF%E5%91%8A.meta.js
// ==/UserScript==

(function() {
    'use strict';
    console.log('start');
    var start_time = new Date().getTime();
    var restart_time = 200;
    var max_run_time = 3000;

    function wait_call(choose_id, callback) {
        var val = setInterval(() => {
            var choose = $(choose_id);
            if (new Date().getTime() - start_time > max_run_time) {
                clearInterval(val);
            }
            if (choose.length > 0) {
                callback(choose_id);
                clearInterval(val);
            } else {
                console.log('Failed to find', choose_id);
            }
        }, restart_time);
    }

    function removeEle(ad) {
        wait_call(ad, (ad) => {
            console.log('Start removing', ad);
            $(ad).remove();
            if ($(ad).length <= 0) {
                console.log('Successfully removed', ad);
            } else {
                console.log('Failed to remove', ad);
            }
        });
    }

    var adSelectors = {
        'yhdm.so': ['#HMcoupletDivleft', '#HMcoupletDivright', '#HMRichBox', '#HMimageright', '#HMimageleft', '#hbidbox'],
        'fjisu2.com': ['#HMcoupletDivleft', '#HMcoupletDivright', '#HMRichBox', '#HMimageright', '#HMimageleft', '#hbidbox'],
        'yinghuacd.com': ['#HMcoupletDivleft', '#HMcoupletDivright', '#HMRichBox', '#HMimageright', '#HMimageleft', '#hbidbox'],
        'yinghuajinju.com': ['#HMcoupletDivleft', '#HMcoupletDivright', '#HMRichBox', '#HMimageright', '#HMimageleft', '#hbidbox'],
        'iyinghua.com': ['#HMcoupletDivleft', '#HMcoupletDivright', '#HMRichBox', '#HMimageright', '#HMimageleft', '#hbidbox']
    };

    var currentUrl = window.location.href;

    for (var site in adSelectors) {
        var regex = new RegExp('^(http):(\\/\\/)(www.)?' + site + '\\/*', 'g');
        if (regex.test(currentUrl)) {
            var ads = adSelectors[site];
            for (let ad of ads) {
                removeEle(ad);
            }
            break;
        }
    }

    var observer = new MutationObserver(function(mutations) {
        mutations.forEach(function(mutation) {
            var ad = document.getElementById("HMrichA");
            if (ad) {
                ad.parentElement.remove();
                console.log('Successfully removed target element');
                observer.disconnect();  
            }
        });
    });

    observer.observe(document.body, { childList: true, subtree: true });

})();
