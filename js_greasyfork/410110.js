// ==UserScript==
// @name         Repubblica "Rep" Aesthetic Paywall Bypass
// @namespace    https://schiavo.me
// @version      1.1.2
// @description  Unhides the "paywalled" articles on Rep
// @author       Julian Schiavo, Original by Andrea Lazzarotto
// @include        https://rep.repubblica.it/*
// @include        https://palermo.repubblica.it/*
// @include        https://*.repubblica.it/*
// @include        https://*repubblica.it/*
// @include        https://repubblica.it/*
// @grant        GM_addStyle
// @require      https://greasyfork.org/scripts/35383-gm-addstyle-polyfill/code/GMaddStyle%20Polyfill.js?version=231590
// @license      GPL version 3 or any later version; http://www.gnu.org/copyleft/gpl.html
// @downloadURL https://update.greasyfork.org/scripts/410110/Repubblica%20%22Rep%22%20Aesthetic%20Paywall%20Bypass.user.js
// @updateURL https://update.greasyfork.org/scripts/410110/Repubblica%20%22Rep%22%20Aesthetic%20Paywall%20Bypass.meta.js
// ==/UserScript==

/* Greasemonkey 4 wrapper */
if (typeof GM !== "undefined" && !!GM.addStyle)
  GM_addStyle = GM.addStyle;

var watcher = function() {
    var pwa = location.href.indexOf("/pwa/") > 0;
    var comments = location.pathname.endsWith("/commenti");
    if (pwa && !comments) {
        location.href = location.href.replace("/pwa/", "/ws/detail/");
    }
var container_body = "#article-body,.article-body";
            var container_pw = "#ph-paywall";
            var container_pw_adblock = "paywall-banner-adblock";
    $(container_pw).hide();
    $("body").addClass("premium-user");
    $(container_body).removeAttr("style hidden");
    $("#" + container_pw_adblock).remove();
    $(container_body).removeAttr("style").attr('style', "max-height:10000px !important;overflow:visible !important;display:block !important").attr("hidden", false);
};

(function() {
    'use strict';

    GM_addStyle("div.detail-article_body > div:not(.paywall), .paywall-banner-inner, #paywall-banner-inner, #paywall-banner-adblock, #ph-paywall { display: none !important; } .paywall, .premium-pw-active, #latest-subscription-message, body:not(.i-amphtml-subs-grant-yes) [subscriptions-section='content']{ display: block !important; }");
    setInterval(watcher, 1000);
    window.dispatchEvent(new Event('resize'));
    MNZ_moreContent('Bottom', 'MNZInRead');

var container_body = "#article-body,.article-body";
            var container_pw = "#ph-paywall";
            var container_pw_adblock = "paywall-banner-adblock";
    $(container_pw).hide();
    $("body").addClass("premium-user");
    $(container_body).removeAttr("style hidden");
    $("#" + container_pw_adblock).remove();
    $(container_body).removeAttr("style").attr('style', "max-height:10000px !important;overflow:visible !important;display:block !important").attr("hidden", false);
})();