// ==UserScript==
// @name         13 京东手机版跳转电脑版
// @namespace    使用说明网址 找插件网
// @version      1.0
// @description  京东手机版跳转电脑版
// @author       老码（老码农）
// @match        *://*/* 
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/440889/13%20%E4%BA%AC%E4%B8%9C%E6%89%8B%E6%9C%BA%E7%89%88%E8%B7%B3%E8%BD%AC%E7%94%B5%E8%84%91%E7%89%88.user.js
// @updateURL https://update.greasyfork.org/scripts/440889/13%20%E4%BA%AC%E4%B8%9C%E6%89%8B%E6%9C%BA%E7%89%88%E8%B7%B3%E8%BD%AC%E7%94%B5%E8%84%91%E7%89%88.meta.js
// ==/UserScript==
 

(function () {
    'use strict';

    var type = 2;//1 如果电脑端，转手机端；2 手机端转电脑端
    var lhref = location.href;
    if (type == 1) {
        if (!lhref.includes('.m.')) {
            var newurl = lhref.replace("https://item.jd.com/", "https://item.m.jd.com/product/");
            location.href = newurl;
        }
    }
    if (type == 2) {
        if (lhref.includes('.m.')) {
            var newurl = lhref.replace("https://item.m.jd.com/product/", "https://item.jd.com/");
            location.href = newurl;
        }
    }

})();