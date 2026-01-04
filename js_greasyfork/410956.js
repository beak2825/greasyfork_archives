// ==UserScript==
// @name         百度主页广告去除
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  删除百度主页广告
// @author       StarDust
// @match        https://www.baidu.com/
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/410956/%E7%99%BE%E5%BA%A6%E4%B8%BB%E9%A1%B5%E5%B9%BF%E5%91%8A%E5%8E%BB%E9%99%A4.user.js
// @updateURL https://update.greasyfork.org/scripts/410956/%E7%99%BE%E5%BA%A6%E4%B8%BB%E9%A1%B5%E5%B9%BF%E5%91%8A%E5%8E%BB%E9%99%A4.meta.js
// ==/UserScript==

(function () {
    'use strict';

    deleteMainPageAds();
    deleteBottomLayer();

    function deleteMainPageAds() {
        const bannerAdElement = document.getElementById("s-hotsearch-wrapper");
        if (bannerAdElement.parentNode) {
            const parentNode = bannerAdElement.parentNode;
            parentNode.removeChild(bannerAdElement);
        }
    }

    function deleteBottomLayer() {
        const bottomLayerElement = document.getElementById("bottom_layer");
        if (bottomLayerElement.parentNode) {
            const parentNode = bottomLayerElement.parentNode;
            parentNode.removeChild(bottomLayerElement);
        }
    }
    


})();