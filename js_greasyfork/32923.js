// ==UserScript==
// @name        DN Paywall fix
// @namespace   wguoliang1113@gmail.com
// @include     *.dn.se*
// @description  Remove ad-bloats from DN
// @version     0.0.1
// @grant       none
// @downloadURL https://update.greasyfork.org/scripts/32923/DN%20Paywall%20fix.user.js
// @updateURL https://update.greasyfork.org/scripts/32923/DN%20Paywall%20fix.meta.js
// ==/UserScript==

$(window).load(() => {
    $("#serviceplusPaywallpaywall-container").remove();
    $(".article__premium-content").css("display","block");
    $(".ad.ad--panorama").each((k, v) => {v.remove();});
});

setTimeout(() => {
    $(".article__body--mask .article__lead").css("position", "inherit");
    console.log("max-height", $(".article__body--mask .article__lead").css("max-height", "2100px"));

    // hide paywall overlay
    const pwOverlay = $("#pwOverlay");
    console.log("pwOverlay", pwOverlay.length);
    pwOverlay.css("display", "none");

}, 2000);
 GM_addStyle(".article__lead::after {" +
            "box-shadow: 0 0 !important;" +
            "max-height: 2000px;"+
            "}");