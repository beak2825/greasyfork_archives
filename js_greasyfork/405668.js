// ==UserScript==
// @name         百度收搜结果屏蔽汗血宝马这个傻逼网站
// @namespace    http://tampermonkey.net/
// @home-url     https://greasyfork.org/zh-CN/scripts/41037
// @version      0.1
// @include      http://www.baidu.com/*
// @include      https://www.baidu.com/*
// @author       lanweifeng
// @grant        none
// @run-at       document-end
// @description 去掉百度搜索结果部分不要网页，比如那种需要登录才能看答案的如：上学吧，考研资料网
// @downloadURL https://update.greasyfork.org/scripts/405668/%E7%99%BE%E5%BA%A6%E6%94%B6%E6%90%9C%E7%BB%93%E6%9E%9C%E5%B1%8F%E8%94%BD%E6%B1%97%E8%A1%80%E5%AE%9D%E9%A9%AC%E8%BF%99%E4%B8%AA%E5%82%BB%E9%80%BC%E7%BD%91%E7%AB%99.user.js
// @updateURL https://update.greasyfork.org/scripts/405668/%E7%99%BE%E5%BA%A6%E6%94%B6%E6%90%9C%E7%BB%93%E6%9E%9C%E5%B1%8F%E8%94%BD%E6%B1%97%E8%A1%80%E5%AE%9D%E9%A9%AC%E8%BF%99%E4%B8%AA%E5%82%BB%E9%80%BC%E7%BD%91%E7%AB%99.meta.js
// ==/UserScript==

(function() {
    'use strict';
    var hostname = window.location.hostname;
    if (hostname == 'www.baidu.com') {
        process();
        document.addEventListener("DOMSubtreeModified", process);
    }
    function process() {
        var results = document.getElementsByClassName('result c-container');
        //console.log(results)
        if (results && results.length > 0) {
            for (var i = results.length - 1; i >= 0; i--) {
                var links = results[i].getElementsByClassName('c-showurl');
                if (links && links.length > 0) {
                    var link = links[0];
                    var text = link.innerText;
                    if (text.indexOf('caotama') > -1){
                        results[i].parentNode.removeChild(results[i]);
                    }
                }
            }
        }
    }
})();