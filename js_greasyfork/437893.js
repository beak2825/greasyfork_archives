// ==UserScript==
// @name                Remove dmhy.org AD
// @name:zh-CN          动漫花园dmhy.org广告去除插件
// @version             1.3
// @description         Remove dmhy.org Annoy AD
// @description:zh-CN   去除动漫花园上的广告
// @author              terry
// @require             https://code.jquery.com/jquery-3.6.0.min.js
// @include             https://*.dmhy.org/*
// @include             http*://dmhy.anoneko.com/*
// @icon                https://share.dmhy.org/images/sitelogo.gif
// @license             MIT
// @run-at              document-body
// @namespace https://greasyfork.org/users/859967
// @downloadURL https://update.greasyfork.org/scripts/437893/Remove%20dmhyorg%20AD.user.js
// @updateURL https://update.greasyfork.org/scripts/437893/Remove%20dmhyorg%20AD.meta.js
// ==/UserScript==

const filters = [
    '[class*="kiwi"]',
    '[href*="taobao"]',
    'a:not([href^="/"]):not([href*="dmhy.org"]):not([href*="magnet"]):not([href*="#"]):not([href*="google"])'
];

// Use ADBlock way to block some annoy element
(function removeFilters() {
    var $hiddenStyle = $('<style type="text/css"></style>');
    $($('head')[0]).append($hiddenStyle);
    $hiddenStyle.append(filters + "{display: none !important; visibility: hidden !important;}");
})();

// removeBackgroundAd
document.body.removeAttribute("data-href");
document.body.removeAttribute("style");

// set background to bar Color
$(document.body).css("background-color", $(".navbar").css("background-color"));

(function removeTopAds() {
    var topDiv = document.getElementsByClassName("logoCon")[0];
    var adCount = topDiv.children.length - 1;

    while (adCount > 0) {
        topDiv.removeChild(topDiv.lastElementChild);
        adCount--;
    }
})();
