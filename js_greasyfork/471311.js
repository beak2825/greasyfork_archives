// ==UserScript==
// @name         HideHackingWithSwiftNavAndSkybar
// @namespace    https://www.hackingwithswift.com/
// @version      0.1
// @description  hide hackingWithSwift Nav and video
// @author       MorganWang
// @match        https://www.hackingwithswift.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=hackingwithswift.com
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/471311/HideHackingWithSwiftNavAndSkybar.user.js
// @updateURL https://update.greasyfork.org/scripts/471311/HideHackingWithSwiftNavAndSkybar.meta.js
// ==/UserScript==

(function() {
    'use strict';

    function hideNavAndSkyBar(){
        console.log("HHHH");
        var mAds=document.querySelectorAll(".navbar"),i;
        for(i=0;i<mAds.length;i++){
            var mAd=mAds[i];
            mAd.remove();
        }
        var list=document.querySelectorAll("#hws-latest-tutorial");
        for(i=0;i<list.length;i++){
            let item = list[i];
            item.remove();
        }
        var rightColumn=document.querySelectorAll(".col-lg-3");
        for(i=0;i<rightColumn.length;i++){
            let item = rightColumn[i];
            item.remove();
        }
    }

    function removeTopVideo(){
        var topVideo=document.querySelectorAll(".embed-responsive-16by9"),i;
        for(i=0;i<topVideo.length;i++){
            let item=topVideo[i];
            item.remove();
        }
    }

    function removeSupportImage() {
        var supportItems = document.querySelectorAll(".row.text-center"),i;
        for(i=0;i<supportItems.length;i++){
            var item=supportItems[i];
            item.remove();
        }
    }

    window.addEventListener('load', function() {
        hideNavAndSkyBar();
        removeTopVideo();
        removeSupportImage();
    }, false);

    setTimeout(() => {
        hideNavAndSkyBar();
        removeTopVideo();
        removeSupportImage();
    }, 2000);
})();
