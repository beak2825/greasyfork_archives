// ==UserScript==
// @name         常用网站去广告
// @version      1.0.4
// @homepage     https://greasyfork.org/zh-CN/users/233360-leeckent
// @match        *://btbtdy.tv/*
// @description  BT电影天堂去广告,后期支持其他网站
// @grant        unsafeWindow
// @require      http://cdn.bootcss.com/jquery/1.8.3/jquery.min.js
// @icon         http://music.sonimei.cn/favicon.ico
// @run-at       document-start
// @namespace    lee
// @downloadURL https://update.greasyfork.org/scripts/376720/%E5%B8%B8%E7%94%A8%E7%BD%91%E7%AB%99%E5%8E%BB%E5%B9%BF%E5%91%8A.user.js
// @updateURL https://update.greasyfork.org/scripts/376720/%E5%B8%B8%E7%94%A8%E7%BD%91%E7%AB%99%E5%8E%BB%E5%B9%BF%E5%91%8A.meta.js
// ==/UserScript==
(function () {
    'use strict';

    var MutationObserver = window.MutationObserver || window.WebKitMutationObserver || window.MozMutationObserver;
    var observer = new MutationObserver(function (records) {
        clearAD();
    });
    var option = {
        'childList': true,
        'subtree': true
    };
    document.onreadystatechange = function () {
        if (document.readyState == "interactive") {
            observer.observe(document.body, option);
        }
    };

    function clearAD() {
        var mAds = document.querySelectorAll(".tempWrap"), i;
        for (i = 0; i < mAds.length; i++) {
            var mAd = mAds[i];
            mAd.parentElement.parentElement.remove();
        }
    }

    setTimeout(function () {
        clearAD();
    }, 2000);
})();