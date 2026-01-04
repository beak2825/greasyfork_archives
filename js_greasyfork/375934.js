// ==UserScript==
// @name         百度收搜结果屏蔽部分垃圾网站
// @namespace    http://tampermonkey.net/
// @home-url     https://greasyfork.org/zh-CN/scripts/41037
// @description  去掉百度搜索结果部分不要网页，比如那种需要登录才能看答案的如：上学吧，考研资料网
// @version      0.1
// @include      http://www.baidu.com/*
// @include      https://www.baidu.com/*
// @author       babybing666
// @grant        none
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/375934/%E7%99%BE%E5%BA%A6%E6%94%B6%E6%90%9C%E7%BB%93%E6%9E%9C%E5%B1%8F%E8%94%BD%E9%83%A8%E5%88%86%E5%9E%83%E5%9C%BE%E7%BD%91%E7%AB%99.user.js
// @updateURL https://update.greasyfork.org/scripts/375934/%E7%99%BE%E5%BA%A6%E6%94%B6%E6%90%9C%E7%BB%93%E6%9E%9C%E5%B1%8F%E8%94%BD%E9%83%A8%E5%88%86%E5%9E%83%E5%9C%BE%E7%BD%91%E7%AB%99.meta.js
// ==/UserScript==

(function() {
    'use strict';
    // Your code here...
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
                    if (text.indexOf('shangxueba') > -1||text.indexOf('ppkao') > -1||text.indexOf('jd') > -1||text.indexOf('taobao') > -1||text.indexOf('tmall') > -1||text.indexOf('etao') > -1||text.indexOf('chinawenben') > -1){
                        results[i].parentNode.removeChild(results[i]);
                    }
                }
            }
        }
    }
})();