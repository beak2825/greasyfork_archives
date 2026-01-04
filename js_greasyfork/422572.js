// ==UserScript==
// @name 微博外链 APP 自动跳转
// @namespace https://github.com/fython
// @version 0.1
// @description 渣浪微博外链（t.cn）
// @author WSAT
// @match https://m.weibo.cn/feature/*
// @license  MIT
// @grant none
// @downloadURL https://update.greasyfork.org/scripts/422572/%E5%BE%AE%E5%8D%9A%E5%A4%96%E9%93%BE%20APP%20%E8%87%AA%E5%8A%A8%E8%B7%B3%E8%BD%AC.user.js
// @updateURL https://update.greasyfork.org/scripts/422572/%E5%BE%AE%E5%8D%9A%E5%A4%96%E9%93%BE%20APP%20%E8%87%AA%E5%8A%A8%E8%B7%B3%E8%BD%AC.meta.js
// ==/UserScript==

(function() {
    'use strict';


    function getQueryVariable(str,variable)
    {
        var query = str;
        var vars = query.split("&");
        for (var i=0;i<vars.length;i++) {
            var pair = vars[i].split("=");
            if(pair[0] == variable &&  pair[1].indexOf("weibo") < 0){
                return pair[1];
            }
        }
        return(false);
    }
    let url = window.location.href;
    url =decodeURIComponent(decodeURIComponent(decodeURIComponent(decodeURIComponent(url))));
    url = getQueryVariable(url,"url");
    window.location.href = url;
})();
