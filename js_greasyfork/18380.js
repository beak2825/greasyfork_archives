// ==UserScript==
// @name         persian-ad-remover
// @namespace    https://github.com/shayax/persian-ad-remover
// @version      1.1.2
// @description Removes ads from some persian download sites.
// @author      https://github.com/shayax/
// @include      http://*.p30download.com/*
// @include      http://*.downloadha.com/*
// @include      http://*.softgozar.com/*
// @include      http://*.download.ir/*
// @include      http://*.mihandownload.com/*
// @include      http://soft98.ir/*
// @include      http://downloadly.ir/*
// @include      http://www.yasdl.com/*
// @include      http://www.20script.ir/*
// @include      http://www.instructables.com/*
// @include      http://persiangfx.com/fa/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/18380/persian-ad-remover.user.js
// @updateURL https://update.greasyfork.org/scripts/18380/persian-ad-remover.meta.js
// ==/UserScript==
/* jshint -W097 */
// Your code here...
// @run-at document-end
var siteUrl = window.location.href;
var dlha = siteUrl.search("downloadha.com");
var p30dl = siteUrl.search("p30download.com");
var softGoz = siteUrl.search("softgozar.com");
var dlir = siteUrl.search("download.ir");
var mihandl = siteUrl.search("mihandownload.com");
var soft98 = siteUrl.search("soft98.ir");
var downloady = siteUrl.search("downloadly.ir");
var yasdl = siteUrl.search("yasdl.com");
var bisCri = siteUrl.search("20script.ir");
var instru = siteUrl.search("www.instructables.com");
var pergfx = siteUrl.search("persiangfx.com/");
function adRem() {
    for (i = 0; i < adVar.length; i++) {
        adVar[i].remove();
    }
}
if (dlha >= 0) {
    document.querySelector("div.spbanners").remove();
    document.querySelector("div.topbanners468").remove();
    document.querySelector(".leftsidebar").remove();
    var adVar = document.querySelectorAll("div.entry-etc");
    adRem();
    var adVar = document.getElementsByTagName("center");
    adRem();
} else if (p30dl >= 0) {
    var adVar = document.querySelectorAll(".tabliq-468");
    adRem();
    var adVar = document.getElementsByTagName("iframe");
    adRem();
    document.querySelector("#content > div").remove();
    document.querySelector(".blogroll").remove();
    document.querySelector("#sidebar").remove();
    document.querySelector("#main-content > div:nth-child(1)").remove();
    document.querySelector(".product-wrapper").remove();
} else if (softGoz >= 0) {
    document.querySelector("div.MainBanner").remove();
    document.querySelector("#dtlAdvertiseBan").remove();
    document.querySelector("#dtlClaim").remove();
    document.querySelector("#MasterTable > tbody > tr:nth-child(4) > td > table > tbody > tr:nth-child(1) > td > table > tbody > tr > td:nth-child(2) > table > tbody > tr:nth-child(8) > td:nth-child(1)").remove();
    document.querySelector("#cphMaster_dtlAdvertiseWBan").remove();
    document.querySelector("#cphMaster_dtlAdvertiseM1").remove();
    document.querySelector("#cphMaster_dtlAdvertiseW2Ban").remove();
    document.querySelector("#cphMaster_dtlAdvertiseD1Ban").remove();
    document.querySelector("#dtlAdvertiseBTM").remove();
    document.querySelector("#anetwork-261045").remove();
    document.querySelector("#cphMaster_dtlAdvertiseS1Ban").remove();
    document.querySelector("#dtlAdvertiseBTM").remove();
} else if (dlir >= 0) {
    document.querySelector("#header").remove();
    document.querySelector("#text-7").remove();
    document.querySelector(".related").remove();
} else if (mihandl >= 0) {
    document.querySelector(".head-ads").remove();
    document.querySelector("#enhancedtextwidget-5").remove();
    document.querySelector("#enhancedtextwidget-6").remove();
    document.querySelector("#enhancedtextwidget-20").remove();
    var adVar = document.querySelectorAll(".well");
    adRem();
    var adVar = document.querySelectorAll(".widget-adds");
    adRem();
} else if (soft98 >= 0) {
    var adVar = document.querySelectorAll(".twotopfar");
    adRem();
    document.querySelector("#header > div").remove();
    document.querySelector(".elan").remove();
    document.querySelector(".topcenteradss").remove();
    document.querySelector("#left > div.banners").remove();
    document.querySelector("#right").remove();
    var adVar = document.querySelectorAll(".centp");
    adRem();
} else if (downloady >= 0) {
    var adVar = document.querySelectorAll(".mom-e3lanat-wrap");
    adRem();
    document.querySelector(".adhere").remove();
} else if (yasdl >= 0) {
    document.querySelector(".top-ads").remove();
    var adVar = document.querySelectorAll(".ads-block");
    adRem();
    var adVar = document.querySelectorAll(".fixed-post");
    adRem();
    var adVar = document.getElementsByTagName("center");
    adRem();
} else if (bisCri >= 0) {
    var adVar = document.querySelectorAll(".adver-post");
    adRem();
    document.querySelector("div[style='position:fixed;left:0px;top:0px;z-index:9999']").remove();
    document.querySelector("div[style='position:fixed;left:0px;top:220px;z-index:9999']").remove();
    document.querySelector("div[style='position:fixed;left:0px;bottom:-2px;z-index:300']").remove();
    document.querySelector("div[style='position:fixed;right:0px;top:0px;z-index:9999']").remove();
    document.querySelector("div[style='position:fixed;right:0px;top:220px;z-index:9999']").remove();
    document.querySelector("div[style='position:fixed;right:0px;bottom:-2px;z-index:300']").remove();
    document.querySelector("div[class='box row slow-transition']").remove();
    document.querySelector("div[class='box row slow-transition']").remove();
    document.querySelector(".ads-topppia").remove();
    document.querySelector(".sidebar").remove();
    document.querySelector(".pre-footer").remove();
    //document.querySelector(".advertising").remove();
    document.querySelector("div.bottom-header").remove();
    getCookie = null;
    setCookie = null;
    checkCookie = null;
    document.onclick = "window.open(document.openlocation.href.value)";
} else if (instru >= 0) {
	var adVar = document.querySelector(".adBlockWrapper").remove();
	var adVar = document.querySelector("#ible-stickyad-wrapper").remove();
	var adVar = document.querySelector("#double-inline-ads").remove();
	var adVar = document.querySelector("#gpt-ad-native-middle").remove();
	var adVar = document.querySelector("#gpt-ad-native-bottom").remove();
	var adVar = document.querySelector(".aspace-wrap").remove();
} else if (pergfx >= 0) {
	var adVar = document.querySelector("#sidebar-left").remove();
	var adVar = document.querySelector("#sidebar-right").remove();
	var adVar = document.querySelector(".linkbox-content").remove();
	var adVar = document.querySelector(".linkbox-top").remove();
	var adVar = document.querySelector(".linkbox-btt").remove();
	var adVar = document.querySelector(".best-posts").remove();
	var adVar = document.querySelector("#page-body > div:nth-child(1)").remove();
	var adVar = document.querySelector("#page-body > div:nth-child(1)").remove();
	var adVar = document.querySelector("#page-body > div:nth-child(2)").remove();
	var adVar = document.querySelector("#page-body > div:nth-child(2)").remove();
	var adVar = document.querySelector("#page-body > div:nth-child(3)").remove();
	var adVar = document.querySelector("#page-body > div:nth-child(3)").remove();
	var adVar = document.querySelector("#page-body > div:nth-child(2)").remove();
	var adVar = document.querySelector("#footer").remove();
} else {}
