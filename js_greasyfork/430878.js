// ==UserScript==
// @name         Lounaspori
// @namespace    http://tampermonkey.net/
// @version      0.3.5
// @description  Remove pretty much everything except select restaurants from the page
// @author       Jarmo Niinisalo
// @match        https://lounaspori.fi/ravintolat/lounasravintolat/
// @grant        none
// @require      https://ajax.googleapis.com/ajax/libs/jquery/3.5.1/jquery.min.js
// @downloadURL https://update.greasyfork.org/scripts/430878/Lounaspori.user.js
// @updateURL https://update.greasyfork.org/scripts/430878/Lounaspori.meta.js
// ==/UserScript==

(function() {
    'use strict';
    $("[id*='tm-row']:first").remove();
    $(".page-header").remove();
    $(".type-banner").remove();
    $("[class*='filter']").remove();
    $(".item-logo").remove();
    $(".item-favorite").remove();
    $(".page-footer-wrapper").remove();
    $(".page-title-bar").remove();
    $(".dow-tabs-list").remove();
    $(".item-hours").remove();
    $("hr").remove();
    $(".lunch-original").remove();
    $("[style*='text-align: center; margin: 3em auto;']").remove();
    $(".page-main-content").css("padding-top", "0px");
    $(".dow-menu-data").attr("style","max-height:390px; overflow-y:scroll");
    $(".grid-item").attr("style","display:inline-block;vertical-align:top;");
    $(".grid-ravintola").attr("style","display:inline-block");
    $(".grid-item")
        .not("[data-fullname*='Päre']")
        .not("[data-fullname*='Torero']")
        .not("[data-fullname*='Rosso']")
        .not("[data-fullname*='Vegpoint']")
        .not("[data-fullname*='Fusion Himalaya']")
        .not("[data-fullname*='Ravintola Royal Mustang']")
        .hide();
    $(".lunchtext").addClass("toggled");
    $(".scroll-to-top").click(function() {$(".grid-item").toggle()}).prop("title", "Show/Hide the Rest");
    $(".scroll-to-top i").removeClass("fa-arrow-up").addClass("fa-eye");
})();