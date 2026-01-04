// ==UserScript==
// @name         Remove Bonus Bitcoin Faucet AD
// @namespace    https://greasyfork.org/en/users/469274-gamefan
// @version      1.0
// @description  Remove Bonus Bitcoin Faucet 99% AD. If 100% Remove, Bonus Bitcoin Faucet cannot claim. Welcome to donate BTC(BITCOIN CORE):3QWDyXufVNjn6vKcqGMMoYjM4NZ3yFsfem
// @author       gamefan
// @match        http://bonusbitcoin.co/*
// @grant        none
// @require https://code.jquery.com/jquery-2.1.4.min.js
// @run-at document-start
// @copyright 2020, gamefan
// @license      GPL-3.0
// @downloadURL https://update.greasyfork.org/scripts/399642/Remove%20Bonus%20Bitcoin%20Faucet%20AD.user.js
// @updateURL https://update.greasyfork.org/scripts/399642/Remove%20Bonus%20Bitcoin%20Faucet%20AD.meta.js
// ==/UserScript==

$(document).ready(function() {

    $(".firstPanel").remove();

    $(".lastPanel").remove();

    $(".siteInfo").remove();

    $("div[style='text-align:center;margin-top:10px']").remove();

    $("div[style='z-index:99999;position:fixed;bottom:10px;right:10px']").remove();

    $("div[style='width:468px;max-height:80px;margin:20px -70px']").remove();

    $("div[style='text-align:center;margin:20px -90px;width:500px;height:402px;']").remove();

    if ($("#adX").length > 0)
    {
        $("#adX").attr('style',"position:fixed;bottom:0px;left:0;z-index:-99");
        $("#adX").css("visibility","hidden");
    }

});