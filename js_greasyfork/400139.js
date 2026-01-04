// ==UserScript==
// @name         自动京东配送，销量排序 20200409
// @namespace    http://tampermonkey.net/
// @version      20200430
// @description  在京东浏览商品时，可选择自动为你勾选 [京东配送]、[仅显示有货]、[销量排序]。无多余代码，响应速度快！
// @author       mudan_cn
// @include             *//search.jd.com/*
// @include             *//www.jd.com/pinpai/*
// @include             *//list.jd.com/list.html?*
// @run-at document-start
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/400139/%E8%87%AA%E5%8A%A8%E4%BA%AC%E4%B8%9C%E9%85%8D%E9%80%81%EF%BC%8C%E9%94%80%E9%87%8F%E6%8E%92%E5%BA%8F%2020200409.user.js
// @updateURL https://update.greasyfork.org/scripts/400139/%E8%87%AA%E5%8A%A8%E4%BA%AC%E4%B8%9C%E9%85%8D%E9%80%81%EF%BC%8C%E9%94%80%E9%87%8F%E6%8E%92%E5%BA%8F%2020200409.meta.js
// ==/UserScript==

+function() {
    var param = new URLSearchParams(location.search),
        param_ = {'psort':3,
                  'shop':1,
                  'stock':1};
    Object.keys(param_).filter(e=>!param.has(e)).map(e=>param.set(e, param_[e])).length && 
    (location.search = param.toString());
}();