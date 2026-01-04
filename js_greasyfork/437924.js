// ==UserScript==
// @name         真不卡去广告
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  将广告移动到看不到地方。
// @author       weiv
// @match        *://www.zhenbuka3.com/*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/437924/%E7%9C%9F%E4%B8%8D%E5%8D%A1%E5%8E%BB%E5%B9%BF%E5%91%8A.user.js
// @updateURL https://update.greasyfork.org/scripts/437924/%E7%9C%9F%E4%B8%8D%E5%8D%A1%E5%8E%BB%E5%B9%BF%E5%91%8A.meta.js
// ==/UserScript==

(function() {
    'use strict';

    window.onload = function () {
        style_remove_ad_2022_01_02();
    }

    // weiv 2022-01-02 由于后面真不卡更新了，会检测页面的广告是否存在，如果不存在，就看不了，所以不能直接移除。
    function remove_ad_old () {
    $("#HMRichBox").remove();
        $("#hth616").remove();
        $(".marquee_outer").remove();
    }

    // weiv 2022-01-02 既然不能移除，所以就使用样式将其不在页面的可视范围内显示就可以了。
    function style_remove_ad_2022_01_02 () {
        var box = document.querySelector("#HMRichBox").style;
        box.zIndex = -99999;
        box.position = "fixed";
        box.top = "1920px";
        var img = document.querySelector("#hth616").style;
        img.zIndex = -99999;
        img.position = "fixed";
        img.top = "1920px";
    }
})();