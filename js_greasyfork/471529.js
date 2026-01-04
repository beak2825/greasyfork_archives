// ==UserScript==
// @name         Axalent
// @namespace    qtback.zero.torn
// @version      0.3
// @description  Quick buy and travel
// @author       -zero [2669774]
// @match        https://www.torn.com/index.php
// @icon         https://www.google.com/s2/favicons?sz=64&domain=torn.com
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/471529/Axalent.user.js
// @updateURL https://update.greasyfork.org/scripts/471529/Axalent.meta.js
// ==/UserScript==

const itemOrder = [];
var amount = 29;

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
    const availIds = [];

    $('.users-list > li').each(function(){
        var main = $('span[class="btn c-pointer"]', $(this)).attr("data-id");
        availIds.push(main);
    });
    var iid;

    for (let itemId of itemOrder){
        if (availIds.includes(itemId)){
            iid = itemId;
            break;
        }
    }

    if (iid){



        $.post("https://www.torn.com/shops.php?rfcv="+getRFC(), {
            step:"buyShopItem",
            amount:amount,  //amount of item
            ID:iid,  // the id of item
            travelShop:1

        },
               function(response){
            var responseJ = JSON.parse(response);
            $('#zero-response').html(responseJ.text);
        });
    }
    else{
        alert("No item found");
    }


}

function tback(){
    $.post("https://www.torn.com/travelagency.php?rfcv="+getRFC(), {
        step:"backHomeAction",
    },
           function(response){
        var responseJ = JSON.parse(response);
        $('#zero-response').html(responseJ.text);
        window.location.reload();

    });

}

function insert(){
    if ($('.users-list > li').length > 0){
        const button = `<button class="torn-btn" id="buyZero">BUY</button>`;

        if ($("#buyZero").length ==0){
            $('.content-title').append(button);
            $('#buyZero').on('click', function(){
                buy();
            });
        }


        const buttont = `<button class="torn-btn" id="travelZero">TBack</button><span id="zero-response"></span>`;
        if ($("#travelZero").length ==0){
            $('.content-title').append(buttont);
            $('#travelZero').on('click', function(){
                tback();
            });
        }


        $('.users-list > li').each(function(){
            var main = $('span[class="btn c-pointer"]', $(this)).attr("data-id");
            $(".name",$(this)).attr("title", main);
        });

    }
    else{
        setTimeout(insert, 300);
    }

}

insert();