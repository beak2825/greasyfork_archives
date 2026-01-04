// ==UserScript==
// @name         RemoveRGAds
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  remove ads
// @author       zhiweizhang
// @license      GPL-3.0-only
// @match        https://refactoringguru.cn/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=refactoringguru.cn
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/454122/RemoveRGAds.user.js
// @updateURL https://update.greasyfork.org/scripts/454122/RemoveRGAds.meta.js
// ==/UserScript==

(function() {
    'use strict';

    var adsFromRight = document.getElementsByClassName("banner-inner")[0];//右侧书籍推广广告
        var menuBrand = document.getElementsByClassName("menu-brand")[0];//左侧菜单品牌logo
        var helpU = document.getElementsByClassName("russia-stop");
        var prom = document.getElementsByClassName("prom");//顶部和底部广告
        adsFromRight.remove();
        menuBrand.remove();
        for (var i = (prom.length - 1); i >= 0; i--) {
            prom[i].remove();
        }
        for (var j = (helpU.length - 1); j >= 0; j--) {
            helpU[j].remove();
        }
})();