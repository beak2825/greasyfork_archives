// ==UserScript==
// @name         DI Fix
// @namespace    http://tampermonkey.net/
// @version      0.1.1
// @description  Remove ad-bloats from DI
// @author       You
// @match        http://www.di.se/*
// @grant        none
// @require http://code.jquery.com/jquery-latest.js
// @downloadURL https://update.greasyfork.org/scripts/32922/DI%20Fix.user.js
// @updateURL https://update.greasyfork.org/scripts/32922/DI%20Fix.meta.js
// ==/UserScript==

$(document).on("ready", () => {
    $(".di_header").remove();
    $(".di_panorama-wrapper").remove();
});

$(window).on("load", () => {
    // Remove huge empty top element
    $(".di_panorama.js_panorama").remove();
    $(".di_panorama-compensation").css("height", "0px");

    // Remove paywall
    $(".paywall-mask").remove();
    $("#serviceplusPaywallpaywall-container").remove();

    // Show news content
    $(".paywall-content").css("height", "");
    $(".paywall-content").css("overflow", "");
    console.log("done");
});