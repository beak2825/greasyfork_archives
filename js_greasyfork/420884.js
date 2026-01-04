// ==UserScript==
// @name        Ad blocker Adult sites 18+
// @description Prevents annoying ads from displaying 18+
// @version     2017.09.79
// @match     *://*.thepiratebay.org/*
// @match     *://*.pornhub.com/*
// @match     *://*.redtube.com/*
// @match     *://*.youporn.com/*
// @match     *://*.camwhores.tv/*
// @match     *://*.chaturbate.com/*
// @match     *://chaturbate.com/*
// @match     *://*.cam4.com/*
// @match     *://*.bongacams.com/*
// @namespace   https://openuserjs.org/users/nonedude
// @require     https://code.jquery.com/jquery-3.7.1.slim.js
// @license MIT
// @grant    GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/420884/Ad%20blocker%20Adult%20sites%2018%2B.user.js
// @updateURL https://update.greasyfork.org/scripts/420884/Ad%20blocker%20Adult%20sites%2018%2B.meta.js
// ==/UserScript==

var counter = 0;

String.prototype.contains = function (it) {
    return this.indexOf(it) != -1;
};

var ssss = location.href;

function pornhub() {
    $("iframe").each(function () {
        $(this).remove();
    });
    $(".adLinks").parent().parent().parent().remove();
    $(".abEnabled").remove();
    $(".streamatesModelsContainer").remove();
    $(".js_adblockPremium").remove();
    $(".premiumPromoBanner").remove();
    $(".js-abContainterMain").remove();
    $("#js-abContainterMain").remove();
    $("#welcome").remove();
}

function camwhores() {
    console.log("Running camwhores");
   
    $("#camsoda-embed").remove();
    $(".spot").remove();
    delete window.TotemToolsObject;

    loadTool = function () {};
    e = function () {};
    t = function () {};
    o = function () {};
    t = function () {};


    $("iframe").each(function () {
        $(this).remove();
    });

    $("#wrapper").remove();
    $("iframe").remove();
    $(".topad").remove();
    $(".row-models").remove();
    $(".list-live-models").remove();
    $("#videos-ad").remove();

    d9g = "";
    p9b0g = "";
    r3H4 = "";
    _0x9f02 = [];
    f = function () {};
    i = function () {};
    a = function () {};
    u = function () {};
    v = function () {};
    n = function () {};
    h = function () {};
    l = function () {};
    d = function () {};
    H = function () {};
    k = function () {};
    g = function () {};

    $(".fp-ui div:first-child").remove();
    $("div.adv").remove();
    $("canvas").each(function () {
        $(this).remove();
    });
    $("script").each(function () {
        $(this).html("vvvvvvv");
        $(this).attr("src", "localhost");
    });

    $('a[href*="faphouse"]').each(function() {
        $(this).remove();
    });
    $('img[src*="https://static.nc-img.com/uilayout2/34735a65a0c63bd007fa4c32f67dab4c.svg"]').each(function() {
        $(this).parent().remove();
    });

}

function chaturbate() {
    console.log("Running chaturbate"+ new Date().getTime() / 1000);

    $("div[data-testid='messaging-entrypoint']").parent().parent().remove();
    $(".adsbyxa").remove();
    $(".ad").remove();
    $(".banner").remove();
    $('.BioContents').css("max-height", "200px").css("overflow-y", "scroll");
    $('.BioContents').css("background-color", "gray");

    $("body").css("background-color", "gray");
    $("#VideoPanel").css("background-color", "gray");
    $(".msg-list-wrapper-split").css("background-color", "gray");

    $("#footer-holder").remove();

    GM_addStyle ( `.msg-text { background-color: gray !important;}`);
    GM_addStyle ( `.camBgColor { background-color: gray !important;}`);
    GM_addStyle ( `.homepageFilterPanel { background-color: gray !important;}`);
    GM_addStyle ( `.filterOption { color: black !important;}`);
    GM_addStyle ( `.top-section { background-color: gray !important;}`);
    GM_addStyle ( `.app-link { background-color: gray !important;}`);
    GM_addStyle ( `.pureChatColor { background-color: gray !important;}`);
    GM_addStyle ( `.BioContents { max-height: 200px !important; overflow-y: scroll}`);
    GM_addStyle ( `.emoticonImage { background-color: gray !important;}`);

}

function spankbang() {
    $(".ttaa").remove();
    $(".user_panel_guest").remove();
}

function cam4() {
    $(".acceptCookieConsent").click();
    $("input[id$='cookieConsent_consentCookieBtn']")
    $("#PrimaryDialogContainer").delete();
    $("#videoBannerMidrollAdWrapper").delete();
    $("#boost").delete();

}


function bongacams() {
    console.log("Running bongacams");
    $(".__give_away").click();
    //$("input[id$='cookieConsent_consentCookieBtn']")
    //$("#PrimaryDialogContainer").delete();
    //$("#videoBannerMidrollAdWrapper").delete();
    $(".boost").delete();

}


if (ssss.contains("pornhub") || ssss.contains("redtube") || ssss.contains("youporn")) {
    pornhub();
    window.setInterval(function () {
        if (counter < 10)
            pornhub();
        counter++;
    }, 500);

}
if (ssss.contains("camwhores")) {
    camwhores();
    window.setInterval(function () {
        if (counter < 15)
            camwhores();
        counter++;
    }, 500);
}

if (ssss.contains("spankbang")) {
    spankbang();
    window.setInterval(function () {
        if (counter < 15)
            spankbang();
        counter++;
    }, 500);
}

if (ssss.contains("chaturbate")) {
    chaturbate();
    window.setInterval(function () {
        if (counter < 15)
            chaturbate();
        counter++;
    }, 500);
}


if (ssss.contains("cam4")) {
    cam4();
    window.setInterval(function () {
        //if (counter < 10)
        cam4();
        //counter++;
    }, 1500);
}


if (ssss.contains("bongacams")) {
    bongacams();
    window.setInterval(function () {
        //if (counter < 10)
        bongacams();
        //counter++;
    }, 1500);
}
