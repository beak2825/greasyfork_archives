// ==UserScript==
// @name         手机网页版IT之家去除广告和干扰
// @namespace    https://greasyfork.org/zh-CN/users/442617-punkjet
// @version      2025.10.13
// @description  手机网页版IT之家去除广告，文章页去除分享、评分相关文章等。
// @author       PunkJet
// @run-at       document-end
// @match        *://m.ithome.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/396190/%E6%89%8B%E6%9C%BA%E7%BD%91%E9%A1%B5%E7%89%88IT%E4%B9%8B%E5%AE%B6%E5%8E%BB%E9%99%A4%E5%B9%BF%E5%91%8A%E5%92%8C%E5%B9%B2%E6%89%B0.user.js
// @updateURL https://update.greasyfork.org/scripts/396190/%E6%89%8B%E6%9C%BA%E7%BD%91%E9%A1%B5%E7%89%88IT%E4%B9%8B%E5%AE%B6%E5%8E%BB%E9%99%A4%E5%B9%BF%E5%91%8A%E5%92%8C%E5%B9%B2%E6%89%B0.meta.js
// ==/UserScript==
 
function removeHongbao(){
    const allIframes = document.querySelectorAll('iframe');
    allIframes.forEach(iframe=> {iframe.remove();});
}

(function() {
    'use strict';
 
    $(".open-app-banner").remove();
    $("modal has-title loaded").remove();
    $(".open-app").remove();
    $(".brand-column-lapin").remove();
    $(".main-site").remove();//去除文章内容中的购物链接
    $(".news-class").remove();
    setTimeout(removeHongbao, 250);
    removeIthomeAds();
 
    window.addEventListener("scroll", function() {
        removeIthomeAds();
        removeIthomeArticleAds();
    })
})();
 
function removeIthomeArticleAds() {
    $(".down-app-box").remove();
    $("div[class='relevant-news']").remove();
    $("div[class='hot-app']").remove();
    $("div[class='ggp-promotion']").remove();
    $("div[class='grade']").remove();
    $("div[id='bd-share-box']").remove();
    $("div[class='lapin']").remove();
}
 
function removeIthomeAds() {
    var spans1 = $("span[class='tip-suggest']");
    spans1.each(function() {
        $(this).closest("div.placeholder").remove();
    });
 
    var spans2 = $("span[class='tip tip-gray']");
    spans2.each(function() {
        $(this).closest("div.placeholder").remove();
    });
 
    var spans3 = $("span[class='tip tip-green']");
    spans3.each(function() {
        $(this).closest("div.placeholder").remove();
    });
 
    var p1 = $("p[class='plc-title']");//删除标题关键字
    p1.each(function() {
    let deleteStr=["领券","红包","福包","元","福包","大促","开售","预约","限免","精选","限时","节","抢","折","补贴","省钱","618","11"];

    for (let index in deleteStr){
        if($(this).text().match(deleteStr[index])){
        $(this).closest("div.placeholder").remove();
       }
    }
        
    });
 
 
}