// ==UserScript==
// @name          Shiftdelete.Net Anti-Reklam
// @author        Ergin Akın
// @namespace			erginakin
// @version				1.0.0
// @description   Shiftdelete.Net Sitesindeki Kendi Kendine Oynayan Videoları ve Reklamları Kaldırır.
// @icon          http://www.shiftdelete.net/assets/default/img/favicon.ico
// @date          2013/06/22
// @include       http://www.shiftdelete.net/*
// @include       http://shiftdelete.net/*
// @require       https://code.jquery.com/jquery-1.12.4.min.js
// @run-at        document-end
// @grant         GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/26011/ShiftdeleteNet%20Anti-Reklam.user.js
// @updateURL https://update.greasyfork.org/scripts/26011/ShiftdeleteNet%20Anti-Reklam.meta.js
// ==/UserScript==


jQuery.fn.exists = function(){
    return this.length>0;
};

$(document).ready(function(){

if ($("div#Medyanet_Ad_Models_Pageskin_BannerLeft").exists()) {
    $("div#Medyanet_Ad_Models_Pageskin_BannerLeft").remove();
}

if ($("div#Medyanet_Ad_Models_Pageskin_BannerRight").exists()) {
    $("div#Medyanet_Ad_Models_Pageskin_BannerRight").remove();
}

if ($("div#adunit").exists()) {
    $("div#adunit").remove();
}

if ($("div#widget_icerik_iki_reklam_7").exists()) {
    $("div#widget_icerik_iki_reklam_7").remove();
}
    
if ($("div[id^='ENGAGEYA_WIDGET']").exists()) {
    $("div[id^='ENGAGEYA_WIDGET']").remove();
}
   
if ($("div.showCaseBox").exists()) {
    $("div.showCaseBox").remove();
}
    
if ($("div.allowNotifications-box").exists()) {
    $("div.allowNotifications-box").remove();
}

if ($("img[alt='Günün Popüleri']").exists()) {
    $("img[alt='Günün Popüleri']").remove();
}

if ($("div#animation_container").exists()) {
    $("div#animation_container").remove();
}

if ($("div[id^='div-gpt-ad']").exists()) {
    $("div[id^='div-gpt-ad']").remove();
}

if ($("div[id^='Medyanet_Ad_Models']").exists()) {
    $("div[id^='Medyanet_Ad_Models']").remove();
}
    
if ($("div.sideBarBox").exists()) {
    $("div.sideBarBox").remove();
}
    
});