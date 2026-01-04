// ==UserScript==
// @name         CSDN 隐藏广告并自动展开全文
// @namespace    https://greasyfork.org/zh-CN/scripts/375146-csdn-%E9%9A%90%E8%97%8F%E5%B9%BF%E5%91%8A%E5%B9%B6%E8%87%AA%E5%8A%A8%E5%B1%95%E5%BC%80%E5%85%A8%E6%96%87
// @version      1.3
// @description  隐藏页面讨人厌的广告、自动展开全文
// @author       Doracoin
// @match        *://blog.csdn.net/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/375146/CSDN%20%E9%9A%90%E8%97%8F%E5%B9%BF%E5%91%8A%E5%B9%B6%E8%87%AA%E5%8A%A8%E5%B1%95%E5%BC%80%E5%85%A8%E6%96%87.user.js
// @updateURL https://update.greasyfork.org/scripts/375146/CSDN%20%E9%9A%90%E8%97%8F%E5%B9%BF%E5%91%8A%E5%B9%B6%E8%87%AA%E5%8A%A8%E5%B1%95%E5%BC%80%E5%85%A8%E6%96%87.meta.js
// ==/UserScript==

(function() {
    'use strict';

    if (window.location.host == "blog.csdn.net") {
        // CSDN花了很多小心思，展开全文的按钮ID经常会变动，此处保留两个id做为判断
        var btnReadMore = document.getElementById("btn-readmore-zk");
        if (btnReadMore !== null){
            btnReadMore.click();
        } else {
            btnReadMore = document.getElementById("btn-readmore");
            if (btnReadMore !== null){
                btnReadMore.click();
            }
        }

        // 清除CSDN学院广告
        // 以下代码的目的均为隐藏广告
        // 由于页面广告内容全部是动态策略，所以不一定保证以下代码的时效性及效果
        var csdn_edu = document.getElementsByClassName("edu-promotion");
        if (csdn_edu !== null && csdn_edu.length > 0) {
            csdn_edu[0].style.display="none";
        }
        var csdn_edu2 = document.getElementsByClassName("p4course_target");
        if (csdn_edu2 !== null && csdn_edu2.length > 0) {
            csdn_edu2[0].style.display="none";
        }
        var csdn_edu3 = document.getElementsByClassName("fourth_column");
        if (csdn_edu3 !== null && csdn_edu3.length > 0) {
            csdn_edu3[0].style.display="none";
        }
        var loginDiv = document.getElementsByClassName("pulllog-box");
        if (loginDiv !== null && loginDiv.length > 0) {
            loginDiv[0].style.display="none";
        }
        var adFooterWrapper = document.getElementByClassId("asideFooter");
        if (adFooterWrapper !== null) {
            //[0].style.display="none";
            adFooterWrapper.getElements;
        }
        var adBaiduRightItem = document.getElementsByClassName("right-item");
        if (adBaiduRightItem !== null) {
            for (var i=0; i<adBaiduRightItem.length; i++) {
                if (adBaiduRightItem[i].id !== null) {
                    console.log("find right id: " + adBaiduRightItem[i].id);
                    adBaiduRightItem[i].style.display="none";
                }
            }
        }
        var adBaiduRecommendAd = document.getElementsByClassName("recommend-item-box recommend-ad-box");
        if (adBaiduRecommendAd !== null) {
            for (var recommendIndex=0; recommendIndex<adBaiduRecommendAd.length; recommendIndex++) {
                adBaiduRecommendAd[recommendIndex].style.display="none";
            }
        }
        var adContentBottom = document.getElementsByClassName("mediav_ad");
        if (adContentBottom !== null) {
            adContentBottom[0].style.display="none";
        }
        console.log("已隐藏CSDN广告并自动展开全文");
    }
})();
