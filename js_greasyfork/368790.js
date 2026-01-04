// ==UserScript==
// @name         IT之家手机版去除广告
// @namespace    http://tampermonkey.net/
// @version      0.7
// @description  IT之家手机版去除列表中的广告和文章中的广告
// @author       linmii
// @match        *://m.ithome.com/*
// @require      https://cdn.staticfile.org/jquery/3.4.1/jquery.min.js
// @grant        none

// @downloadURL https://update.greasyfork.org/scripts/368790/IT%E4%B9%8B%E5%AE%B6%E6%89%8B%E6%9C%BA%E7%89%88%E5%8E%BB%E9%99%A4%E5%B9%BF%E5%91%8A.user.js
// @updateURL https://update.greasyfork.org/scripts/368790/IT%E4%B9%8B%E5%AE%B6%E6%89%8B%E6%9C%BA%E7%89%88%E5%8E%BB%E9%99%A4%E5%B9%BF%E5%91%8A.meta.js
// ==/UserScript==

(function() {
    'use strict';

    removeAds();
    $(".open-app-banner").remove();
    $(".open-app").remove();

    window.addEventListener("scroll", function() {
        removeAds();
        removeArticleAds();
    })
})();

function removeArticleAds() {
    $(".down-app-box").remove();
    $("div[class='lapin']").remove();
}

function removeAds() {
    var spans = $("span[class='tip-suggest']");
    spans.each(function() {
        $(this).closest("div.placeholder").remove();
    });

    var spans2 = $("span[class='tip tip-gray']");
    spans2.each(function() {
        $(this).closest("div.placeholder").remove();
    });
}