// ==UserScript==
// @name         简书取消外链跳转确认
// @namespace    http://tampermonkey.net/
// @version      1.1.3
// @description  直接去掉a标签中的外链确认部分
// @author       topcloud
// @match        *://www.jianshu.com/*
// @grant        none
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/396157/%E7%AE%80%E4%B9%A6%E5%8F%96%E6%B6%88%E5%A4%96%E9%93%BE%E8%B7%B3%E8%BD%AC%E7%A1%AE%E8%AE%A4.user.js
// @updateURL https://update.greasyfork.org/scripts/396157/%E7%AE%80%E4%B9%A6%E5%8F%96%E6%B6%88%E5%A4%96%E9%93%BE%E8%B7%B3%E8%BD%AC%E7%A1%AE%E8%AE%A4.meta.js
// ==/UserScript==

// 根据网速自己设置时间间隔
var waitTime = 3000;

(function() {
    'use strict';
    setTimeout(function () {
        // 文章部分
        var container = document.querySelector('.ouvJEz');

        var aList = container.getElementsByTagName('a');
        for (var i = 0; i < aList.length; ++i) {
            // 不带有跳转确认的链接
            if (aList[i].href.indexOf('links.jianshu.com') == -1 && aList[i].href.indexOf('link.jianshu.com') == -1) {
                continue;
            }

            // 截取真实url
            var href = aList[i].href;
            var newUrl = href.substr(href.indexOf('=') + 1);
            // 解码并替换
            aList[i].href = decodeURIComponent(newUrl);
        }
    }, waitTime);
})();