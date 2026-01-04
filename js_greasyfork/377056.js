// ==UserScript==
// @name         再见了百家号搜索结果（包括搜索结果中“XX的最新相关信息”）
// @namespace    http://tampermonkey.net/
// @home-url     https://greasyfork.org/zh-CN/scripts/41037
// @description  删除百度搜索结果的百家号的结果，根据“依然菜刀”作品修改。原作者你更新了我这个功能后提醒我删除此脚本
// @version      0.2
// @include      http://www.baidu.com/*
// @include      https://www.baidu.com/*
// @author       依然菜刀
// @grant        none
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/377056/%E5%86%8D%E8%A7%81%E4%BA%86%E7%99%BE%E5%AE%B6%E5%8F%B7%E6%90%9C%E7%B4%A2%E7%BB%93%E6%9E%9C%EF%BC%88%E5%8C%85%E6%8B%AC%E6%90%9C%E7%B4%A2%E7%BB%93%E6%9E%9C%E4%B8%AD%E2%80%9CXX%E7%9A%84%E6%9C%80%E6%96%B0%E7%9B%B8%E5%85%B3%E4%BF%A1%E6%81%AF%E2%80%9D%EF%BC%89.user.js
// @updateURL https://update.greasyfork.org/scripts/377056/%E5%86%8D%E8%A7%81%E4%BA%86%E7%99%BE%E5%AE%B6%E5%8F%B7%E6%90%9C%E7%B4%A2%E7%BB%93%E6%9E%9C%EF%BC%88%E5%8C%85%E6%8B%AC%E6%90%9C%E7%B4%A2%E7%BB%93%E6%9E%9C%E4%B8%AD%E2%80%9CXX%E7%9A%84%E6%9C%80%E6%96%B0%E7%9B%B8%E5%85%B3%E4%BF%A1%E6%81%AF%E2%80%9D%EF%BC%89.meta.js
// ==/UserScript==

(function() {
    'use strict';
    // Your code here...
    var hostname = window.location.hostname;
    // 移除百家号的搜索结果
    if (hostname == 'www.baidu.com') {
        process();
        document.addEventListener("DOMSubtreeModified", process);
    }
    function process() {
        // 百度搜索结果
        var results = document.getElementsByClassName('result c-container');
        //console.log(results)
        if (results && results.length > 0) {
            for (var i = results.length - 1; i >= 0; i--) {
                var links = results[i].getElementsByClassName('c-showurl');
                if (links && links.length > 0) {
                    var link = links[0];
                    var text = link.innerText;
                    var imgs = link.getElementsByClassName('source-icon');
                    if (text && text.indexOf('baijia') > -1 || imgs.length > 0){
                        results[i].parentNode.removeChild(results[i]);
                    }
                }
            }
        }
        var results2 = document.getElementsByClassName('result-op c-container xpath-log');
        if (results2 && results2.length > 0) {
            for (var j = results2.length - 1; j >= 0; j--) {
                var links2 = results2[j].getElementsByClassName('t');
                if (links2 && links2.length > 0) {
                    var link2=links2[0]
                    var text2=link2.innerText
                    var reg = RegExp(/的最新相关信息/);
                    if(reg.exec(text2)){
                        results2[j].parentNode.removeChild(results2[j]);
                    }
                }
            }
        }
        // 百度资讯
        if (window.location.href.indexOf('&tn=news') != -1) {
            results = document.getElementsByClassName('c-title');
            for (var i = results.length - 1; i >= 0; i--) {
                var a = results[i].getElementsByTagName('a');
                //debugger;
                if (a && a.length > 0 && a[0].getAttribute('href').indexOf('baijia') != -1) {
                    results[i].parentNode.parentNode.removeChild(results[i].parentNode);
                }
            }
        }
    }
})();