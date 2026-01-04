// ==UserScript==
// @name         搜狗搜索跳转到百度
// @version      0.1
// @include      http*://www.sogou.com/*
// @description  自动跳转
// @namespace https://greasyfork.org/users/246564
// @downloadURL https://update.greasyfork.org/scripts/377681/%E6%90%9C%E7%8B%97%E6%90%9C%E7%B4%A2%E8%B7%B3%E8%BD%AC%E5%88%B0%E7%99%BE%E5%BA%A6.user.js
// @updateURL https://update.greasyfork.org/scripts/377681/%E6%90%9C%E7%8B%97%E6%90%9C%E7%B4%A2%E8%B7%B3%E8%BD%AC%E5%88%B0%E7%99%BE%E5%BA%A6.meta.js
// ==/UserScript==

(function() {
    'use strict';
    var key = getUrlParam('query');
    if (key.indexOf("baidu.com")==-1){
        window.location.href= "https://www.baidu.com/s?wd=" +key;
    }
    function getUrlParam(name) {
        var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)");
        var r = window.location.search.substr(1).match(reg);
        if(r != null) {
            return decodeURI(r[2]);
        }
        return null;
    }
})();