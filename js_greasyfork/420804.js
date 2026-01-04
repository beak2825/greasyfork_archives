// ==UserScript==
// @name         RemoveAdsForRG
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Remove Ads for refactoringguru.cn
// @author       XVCoder
// @license      GPL-3.0-only
// @create       2021-01-28
// @lastmodified 2021-01-28
// @note         2021-01-28 v0.1 初始化
// @match        https://refactoringguru.cn/*
// @icon         https://blog.solutionx.top/assets/img/favicon.png
// @home-url     https://greasyfork.org/zh-CN/scripts/420804-removeadsforrg
// @home-url2    https://github.com/XVCoder/UserScripts/RemoveAdsForRG
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/420804/RemoveAdsForRG.user.js
// @updateURL https://update.greasyfork.org/scripts/420804/RemoveAdsForRG.meta.js
// ==/UserScript==


// 根据网速自己设置时间间隔
var interval = 3000;

(function() {
    'use strict';
    setTimeout(function () {
        var adsFromRight = document.getElementsByClassName("banner-inner")[0];//右侧书籍推广广告
        var menuBrand = document.getElementsByClassName("menu-brand")[0];//左侧菜单品牌logo
        var prom = document.getElementsByClassName("prom");//顶部和底部广告
        adsFromRight.remove();
        menuBrand.remove();
        for (var i = (prom.length - 1); i >= 0; i--) {
            prom[i].remove();
        }
    }, interval);
})();
