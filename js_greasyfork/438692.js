// ==UserScript==
// @name         FaceIT Inventory
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Shows inventory value
// @author       MaslovKK
// @match        https://www.faceit.com/*/csgo/room/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=faceit.com
// @grant        GM.xmlHttpRequest
// @require      https://cdnjs.cloudflare.com/ajax/libs/jquery/3.6.0/jquery.min.js
// @downloadURL https://update.greasyfork.org/scripts/438692/FaceIT%20Inventory.user.js
// @updateURL https://update.greasyfork.org/scripts/438692/FaceIT%20Inventory.meta.js
// ==/UserScript==

function addSum() {
    var currency;
    GM.xmlHttpRequest({
        method:"GET",
        url:"https://www.cbr-xml-daily.ru/daily_json.js",
        responseType:"json",
        onload: (d) => {
            currency = d.response.Valute.USD.Value;
        }
    });
    $(".match-team-member").each((i,e) => {
        let stid = $(e).find(".match-team-member__controls__button")[1].href;
        GM.xmlHttpRequest({
            method:"POST",
            url:"https://lzt.market/market/steam-value",
            headers: {
                "Content-Type":"application/x-www-form-urlencoded",
                "X-Requested-With":"XMLHttpRequest"
            },
            data:`link=${stid}&app_id=730&_xfResponseType=json`,
            responseType:"json",
            onload: (d) => {
                $(e).find(".ellipsis-b").append(`<a style="color:lime"> (${(d.response.totalValueSimple/currency).toFixed(2)})</a>`);
            }
        })
    });
}

(function() {
    'use strict';

    var inVal = setInterval(() => {
        if ($(".match-team-member").length) {
            addSum();
            clearInterval(inVal);
        }
    }, 100);
})();