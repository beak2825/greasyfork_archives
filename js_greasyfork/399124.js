// ==UserScript==
// @name         Remove Bitfun Faucet AD
// @namespace    https://greasyfork.org/en/users/469274-gamefan
// @version      1.0
// @description  Remove Bitfun Faucet 99% AD. If 100% Remove, Bitfun Faucet cannot claim. Welcome to donate BTC(BITCOIN CORE):3QWDyXufVNjn6vKcqGMMoYjM4NZ3yFsfem
// @author       gamefan
// @match        http://bitfun.co/*
// @grant        none
// @require https://code.jquery.com/jquery-2.1.4.min.js
// @run-at document-start
// @copyright 2020, gamefan
// @license      GPL-3.0
// @downloadURL https://update.greasyfork.org/scripts/399124/Remove%20Bitfun%20Faucet%20AD.user.js
// @updateURL https://update.greasyfork.org/scripts/399124/Remove%20Bitfun%20Faucet%20AD.meta.js
// ==/UserScript==

$(document).ready(function() {

    if ($(".flexClaimAd") != null && $(".flexClaimAd") != undefined)
    {
        $(".flexClaimAd").attr('style',"position:fixed;bottom:0px;left:0;z-index:-99");
        $(".flexClaimAd").css("visibility","hidden");
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

    if ($("#GamesPanel") != null && $("#GamesPanel") != undefined)
    {
        $("#GamesPanel").remove();
    }

    if ($("div[style='z-index:999;position:fixed;bottom:35px;left:50%;margin-left:-150px']") != null && $("div[style='z-index:999;position:fixed;bottom:35px;left:50%;margin-left:-150px']") != undefined)
    {
        $("div[style='z-index:999;position:fixed;bottom:35px;left:50%;margin-left:-150px']").remove();
    }

});