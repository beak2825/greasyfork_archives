// ==UserScript==
// @name         Remove Moon Faucet AD
// @namespace    https://greasyfork.org/en/users/469274-gamefan
// @version      1.1
// @description  Remove Moon Faucet 99% AD. If 100% Remove, Moon Faucet cannot claim. Welcome to donate BTC(BITCOIN CORE):3QWDyXufVNjn6vKcqGMMoYjM4NZ3yFsfem
// @author       gamefan
// @match        http://moonbit.co.in/*
// @match        http://moonliteco.in/*
// @match        http://moondoge.co.in/*
// @match        http://moondash.co.in/*
// @match        http://moonbitcoin.cash/*
// @grant        none
// @require https://code.jquery.com/jquery-2.1.4.min.js
// @run-at document-start
// @copyright 2020, gamefan
// @license      GPL-3.0
// @downloadURL https://update.greasyfork.org/scripts/398742/Remove%20Moon%20Faucet%20AD.user.js
// @updateURL https://update.greasyfork.org/scripts/398742/Remove%20Moon%20Faucet%20AD.meta.js
// ==/UserScript==

$(document).ready(function() {
    if ($("#lhsColumn") != null && $("#lhsColumn") != undefined)
    {
        $("#lhsColumn").remove();
    }

    if ($("#rhsColumn") != null && $("#rhsColumn") != undefined)
    {
        $("#rhsColumn").remove();
    }

    if ($("#BodyPlaceholder_claimMidContainer") != null && $("#BodyPlaceholder_claimMidContainer") != undefined)
    {
        $("#BodyPlaceholder_claimMidContainer").remove();
    }

    if ($("#advert-space") != null && $("#advert-space") != undefined)
    {
        $("#advert-space").attr('style',"position:fixed;bottom:0px;left:0;z-index:-99");
        $("#advert-space").css("visibility","hidden");
    }

    if ($("#claimAd") != null && $("#claimAd") != undefined)
    {
        $("#claimAd").css("visibility","hidden");
        $("#claimAd").css("width","1");
        $("#claimAd").css("height","1");
    }

    if ($("#AdArea") != null && $("#AdArea") != undefined)
    {
        $("#AdArea").remove();
    }

    if ($("#advert-space-2") != null && $("#advert-space-2") != undefined)
    {
        $("#advert-space-2").remove();
    }

    if ($("#WeeklyPaymentContent") != null && $("#WeeklyPaymentContent") != undefined)
    {
        $("#WeeklyPaymentContent").remove();
    }

    if ($(".advert") != null && $(".advert") != undefined)
    {
        $(".advert").remove();
    }
    if ($(".other-message-panel") != null && $(".other-message-panel") != undefined)
    {
        $(".other-message-panel").remove();
    }

    if ($("div[style='z-index:99999;position:fixed;bottom:10px;right:10px']") != null && $("div[style='z-index:99999;position:fixed;bottom:10px;right:10px']") != undefined)
    {
        $("div[style='z-index:99999;position:fixed;bottom:10px;right:10px']").remove();
    }

    if ($("#slideIn") != null && $("#slideIn") != undefined)
    {
        $("#slideIn").remove();
    }

    if ($(".flexBefore") != null && $(".flexBefore") != undefined)
    {
        $(".flexBefore").remove();
    }

    if ($(".flexAfter") != null && $(".flexAfter") != undefined)
    {
        $(".flexAfter").remove();
    }

    if ($(".flexContentAd") != null && $(".flexContentAd") != undefined)
    {
        $(".flexContentAd").remove();
    }

    if ($(".slideIn") != null && $(".slideIn") != undefined)
    {
        $(".slideIn").remove();
    }

    if ($(".hide-xs") != null && $(".hide-xs") != undefined)
    {
        $(".hide-xs").remove();
    }

    if ($(".captchaAd") != null && $(".captchaAd") != undefined)
    {
        $(".captchaAd").remove();
    }

    // if can not login, comment the next line
    document.getElementById("middleColumn").style.width = "100%";

    // try remove all page link AD, but it not work.

    //     $("script[src*='mellowads.com']").remove();
    //     $("a[href*='mellowads.com']").remove();

    //     var removelink = setInterval(function() {
    //          $("script[src*='mellowads.com']").remove();
    //         $("a[href*='mellowads.com']").remove();
    //     }, 800);

});