// ==UserScript==
// @name         Pay Upkeep
// @namespace    upkeep,zero.torn
// @version      0.1
// @description  Pay Upkeeps
// @author       nao
// @match        https://www.torn.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=torn.com
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/510188/Pay%20Upkeep.user.js
// @updateURL https://update.greasyfork.org/scripts/510188/Pay%20Upkeep.meta.js
// ==/UserScript==

let link = "";

let toPay = 0;
let propertyID = link.split("ID=")[1].split("&")[0];
function getRFC() {
    var rfc = $.cookie('rfc_v');
    if (!rfc) {
        var cookies = document.cookie.split('; ');
        for (var i in cookies) {
            var cookie = cookies[i].split('=');
            if (cookie[0] == 'rfc_v') {
                return cookie[1];
            }
        }
    }
    return rfc;
}

function insert(){

    if ($("#sidebar > div:nth-child(1) > div").length == 0){
        setTImeout(insert, 500);
        return;
    }
    let b = `<a href="${link}"><button id="payButton" class="torn-btn">Upkeep</button></a>`;
    $("#sidebar > div:nth-child(1) > div").append(b);

}

function pay(){
    $.post(`https://www.torn.com/properties.php?rfcv=${getRFC()}`,
        {
            step: "upkeepProperty",
            pay: toPay,
            ID:propertyID
        }
        , function(response){
        response = JSON.parse(response);
        if (response.success){
            $("#payButton").text("Paid");
        }
    });
}

function insertPayAmount(){
    if ($("#properties-page-wrap > div.property-option > div.upkeep-opt > div.pay-bills-wrap > div.pay-bills.cont-gray.bottom-round > form > div > input:nth-child(2)").length == 0){
        setTimeout(insertPayAmount, 500);
        return;
    }
    toPay = $("#properties-page-wrap > div.property-option > div.upkeep-opt > div.pay-bills-wrap > div.pay-bills.cont-gray.bottom-round > form > div > input:nth-child(2)").attr("value");
    $("#payButton").text("Pay " + toPay);
    $("#payButton").on("click", pay);
}



function main(){
    let url = window.location.href;
    insert();
    if (url.includes("tab=upkeep")){
        insertPayAmount();
    }
}

main();