// ==UserScript==
// @name         xSmoker
// @namespace    zero.itemabroad.torn
// @version      0.3
// @description  Quick buy for items abroad
// @author       -zero [2669774]
// @match        https://www.torn.com/index.php
// @icon         https://www.google.com/s2/favicons?sz=64&domain=torn.com
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/471867/xSmoker.user.js
// @updateURL https://update.greasyfork.org/scripts/471867/xSmoker.meta.js
// ==/UserScript==

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

function buy(){
    // var text = $("#re_trav_wrap").text().split("You have purchased")[1].split('/\n');
    // var bought = text[0];
    // var capacity = text[1].trim(" ").split(" ")[0];

    // var amount = capacity - bought;
    var amount = 29;


    $.post("https://www.torn.com/shops.php?rfcv="+getRFC(), {
        step:"buyShopItem",
        amount:amount,  //amount of item
        ID:42,  // the id of item
        travelShop:1

    },
           function(response){
        var responseJ = JSON.parse(response);
        $('#zero-response').html(responseJ.text);
    })
}

function insert(){
    if ($('.users-list > li').length > 0){
        const button = `<button class="torn-btn" id="buyZero">BUY</button><span id="zero-response"></span>`;
        $('.content-title').append(button);
        $('#buyZero').on('click', function(){
            buy();
        });

        $('.users-list > li').each(function(){
            var main = $('span[class="btn c-pointer"]', $(this)).attr("data-id");
            $(".name",$(this)).html(main);
        });

    }
    else{
        setTimeout(insert, 300);
    }

}

insert();