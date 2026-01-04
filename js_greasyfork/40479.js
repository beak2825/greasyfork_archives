// ==UserScript==
// @name         RH Hilight
// @description  RH trusted color for nyaa.si
// @namespace    https://rickyhorror.com/
// @version      1.2
// @author       rickyhorror
// @match        https://nyaa.si/*
// @match        https://sukebei.nyaa.si/*
// @grant        none
// @require      https://cdnjs.cloudflare.com/ajax/libs/jquery/3.2.1/jquery.min.js
// @downloadURL https://update.greasyfork.org/scripts/40479/RH%20Hilight.user.js
// @updateURL https://update.greasyfork.org/scripts/40479/RH%20Hilight.meta.js
// ==/UserScript==

(function() {
    $(".success:has(>td>a[title*='[RH]'])").addClass("rh");
    $(".rh").css({"background-image":"url('https://i.imgur.com/AZUwxlu.png')"});
    $(".rh>td").css({"background":"rgba(0,0,0,0)"});
    $(".rh>td>a").css({"color":"#333"});
    $(".rh>td>a:visited").css({"color":"#333"});
    $("h3:contains('[RH]')").addClass("header-rh");
    $(".panel-success>.panel-heading:has(.header-rh)").css({"background-image":"url('https://i.imgur.com/AZUwxlu.png')","color":"#333"});
})();