// ==UserScript==
// @name         手机百度去广告
// @namespace    https://m.baidu.com/
// @version      0.1.1
// @description  百度手机版搜索结果删除广告
// @author       You
// @match        https://m.baidu.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=baidu.com
// @downloadURL https://update.greasyfork.org/scripts/453520/%E6%89%8B%E6%9C%BA%E7%99%BE%E5%BA%A6%E5%8E%BB%E5%B9%BF%E5%91%8A.user.js
// @updateURL https://update.greasyfork.org/scripts/453520/%E6%89%8B%E6%9C%BA%E7%99%BE%E5%BA%A6%E5%8E%BB%E5%B9%BF%E5%91%8A.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 左下角名称
    const LB_TEXT = ["大家还在搜","百度APP内打开","百度手机助手","智能小程序","百度应用搜索"];
    function clearBaiduAds() {
        // 删除推广广告
        let ads = document.getElementsByClassName("ec_ad_results");
        while(ads[0]!=undefined){ads[0].remove()}
        // 删除指定网站广告
        let rels = document.getElementsByClassName("c-result result");
        for (let rel of rels){
            for(let t of LB_TEXT){
                if (rel.innerText.includes(t)){
                    rel.remove();
                }
            }
        }
        // 删除大家还在搜
        document.getElementById("page-relative").remove();
    }
    clearBaiduAds();
    clearBaiduAds();
})();