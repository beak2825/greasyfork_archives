// ==UserScript==
// @name         小广告移除
// @namespace    ads-remove
// @version      0.0.2
// @description  移除网站里面的小广告
// @author       不知名的程序员
// @match        http://*
// @match        https://*
// @include      http://*
// @include      https://*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=tampermonkey.net
// @grant        none
// @license      MIT License
// @downloadURL https://update.greasyfork.org/scripts/448170/%E5%B0%8F%E5%B9%BF%E5%91%8A%E7%A7%BB%E9%99%A4.user.js
// @updateURL https://update.greasyfork.org/scripts/448170/%E5%B0%8F%E5%B9%BF%E5%91%8A%E7%A7%BB%E9%99%A4.meta.js
// ==/UserScript==
console.log("广告移除小插件");
(function () {
    'use strict';
    var ids = ["HMcoupletDivleft", "HMcoupletDivright", "HMRichBox", "HMrichA", "wrap-fixed","ad_unit"]
    setInterval(function () {
        var idCount = 0;
        for (var i = 0; i < ids.length; i++) {
            var box = document.getElementById(ids[i]);
            if (box) {
                idCount += 1;
                box.remove();
            }
        }
        console.log("移除ID广告 " + idCount + " 个");
    }, 1000);

    var classes = ["adsbygoogle"]
    setInterval(function () {
        var idCount = 0;
        for (var i = 0; i < classes.length; i++) {
            var box = document.getElementsByClassName(classes[i]);
            if (box && box.length > 0) {
                for(var iBox = 0; iBox < box.length; iBox++) {
                    idCount += 1;
                    box[iBox].remove();
                }
            }
        }
       console.log("移除类是广告 " + idCount + " 个");
    }, 1000);
})();