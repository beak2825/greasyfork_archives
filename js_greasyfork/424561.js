// ==UserScript==
// @name        百度搜索去广告轻量版 - baidu.com
// @namespace   Violentmonkey Scripts
// @match       https://www.baidu.com/*
// @grant       none
// @version     1.1
// @author      -
// @description 安装即用，简单到不行，没有任何配置和设置。感受无广告的纯净百度吧！
// 2021/4/2上午9:55:09 仅用于个人学习
// 参考链接https://greasyfork.org/zh-CN/scripts/394099-%E7%99%BE%E5%BA%A6%E7%B3%BB%E7%BD%91%E7%AB%99%E5%8E%BB%E5%B9%BF%E5%91%8A
// @downloadURL https://update.greasyfork.org/scripts/424561/%E7%99%BE%E5%BA%A6%E6%90%9C%E7%B4%A2%E5%8E%BB%E5%B9%BF%E5%91%8A%E8%BD%BB%E9%87%8F%E7%89%88%20-%20baiducom.user.js
// @updateURL https://update.greasyfork.org/scripts/424561/%E7%99%BE%E5%BA%A6%E6%90%9C%E7%B4%A2%E5%8E%BB%E5%B9%BF%E5%91%8A%E8%BD%BB%E9%87%8F%E7%89%88%20-%20baiducom.meta.js
// ==/UserScript==

$(document).ready(function () {
  // 百度搜索去广告
    if (location.href.indexOf('www.baidu.com') > 0) {
        var refreshTime = 1000;   // 检测广告的刷新时间
        setInterval(function () {
            if (location.href.indexOf('www.baidu.com/s') > 0) {
                // 左侧搜索结果广告
                var divs = $('#content_left>div');
                if (divs) {
                    for(var i = 0; i < divs.length; i++){
                       if(!$(divs[i]).hasClass('result c-container new-pmd')){
                          $(divs[i]).remove();
                       }
                    }
                }
                // 右侧广告
                var rdivs = $('#content_right>div');
                if (rdivs) {
                    for(var i = 0; i < rdivs.length; i++){
                       $(rdivs[i]).remove();
                    }
                }
                // 右侧热榜广告
                var adbs = $('#content_right>table td>div .ad-block');
                if (adbs) {
                    for(var i = 0; i < adbs.length; i++){
                       $(adbs[i]).remove();
                    }
                }
            }
        }, refreshTime);
    }
})