// ==UserScript==
// @name         果核剥壳净化
// @namespace    https://greasyfork.org/scripts/424372
// @version      1.01
// @description  果核剥壳 去广告
// @author       se7en
// @include      *://*.ghxi.com/*
// @icon         https://img.lguohe.com/uploads/2020/10/ghfavicon.png
// @grant        GM_addStyle
// @require      https://code.jquery.com/jquery-latest.js
// @downloadURL https://update.greasyfork.org/scripts/424372/%E6%9E%9C%E6%A0%B8%E5%89%A5%E5%A3%B3%E5%87%80%E5%8C%96.user.js
// @updateURL https://update.greasyfork.org/scripts/424372/%E6%9E%9C%E6%A0%B8%E5%89%A5%E5%A3%B3%E5%87%80%E5%8C%96.meta.js
// ==/UserScript==

(function() {
    $(".sidebar").remove(); $(".main-slider").remove();
    GM_addStyle(".post-loop-default .item-img{width: 10%}.main.j-modules-inner{width: 100%}");
    let ad_list = [".footer", ".action-item.j-share"]; let is_home = (window.location.href == "https://www.ghxi.com/");
    if (is_home) { $(".section").css("margin", "2px auto"); ad_list = ad_list.concat([".modules-carousel-posts", ".modules-special", "a[data-id='125']", "#modules-16", "#modules-17", "#modules-14", "#modules-7", "#modules-12"]); }
    else { ad_list = ad_list.concat([".entry-copyright", ".meta-item.dashang", ".info-item.share"]); $(".wrap.container").css("margin", "2px auto"); }
    for (let x in ad_list) $(ad_list[x]).remove();
    $(window).scroll(function () { if ($(document).scrollTop() + $(window).height() >= $(document).height()) { if (/\.html/.test(window.location.href) == false) $(".btn.load-more").click(); } });
})();
