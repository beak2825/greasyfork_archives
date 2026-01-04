// ==UserScript==
// @author          zhzLuke96
// @name            去除网易MC在MC官网的流氓弹窗！
// @name:en         NETEASE_MC_NO!WAY!
// @namespace       https://github.com/zhzLuke96/
// @version         0.1
// @description     网易MC我可去你的吧.
// @description:en  netease mc just garbage.
// @author          zhzLuke96
// @match           *://www.minecraft.net/zh-hans/*
// @match           *://my.minecraft.net/zh-hans/*
// @grant           none
// @downloadURL https://update.greasyfork.org/scripts/389360/%E5%8E%BB%E9%99%A4%E7%BD%91%E6%98%93MC%E5%9C%A8MC%E5%AE%98%E7%BD%91%E7%9A%84%E6%B5%81%E6%B0%93%E5%BC%B9%E7%AA%97%EF%BC%81.user.js
// @updateURL https://update.greasyfork.org/scripts/389360/%E5%8E%BB%E9%99%A4%E7%BD%91%E6%98%93MC%E5%9C%A8MC%E5%AE%98%E7%BD%91%E7%9A%84%E6%B5%81%E6%B0%93%E5%BC%B9%E7%AA%97%EF%BC%81.meta.js
// ==/UserScript==

(function() {
    'use strict';
    const $ = q => document.querySelector(q);
    for(let sele of [".modal-backdrop",
                     "#netease-promotion-modal",
                     ".geo-location-wrapper"]){
        let elem = $(sele);
        if(elem)elem.style.cssText = "display:none;";
    }
})();