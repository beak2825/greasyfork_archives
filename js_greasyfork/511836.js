// ==UserScript==
// @name        Item Market QBuy
// @namespace    qbuy.zero.nao
// @version      0.3
// @description quick buy
// @author       nao [2669774]
// @match        https://www.torn.com/imarket.php*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=torn.com
// @grant       GM_addStyle

// @downloadURL https://update.greasyfork.org/scripts/511836/Item%20Market%20QBuy.user.js
// @updateURL https://update.greasyfork.org/scripts/511836/Item%20Market%20QBuy.meta.js
// ==/UserScript==

GM_addStyle(`
.confirm-buy {
display: none;
}

`);

let api = "";
let url = window.location.href;
let rfc = getRFC();

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

function quickBuy(itemN, n, price, parent) {
    console.log(itemN + " " + n);
    $.post('https://www.torn.com/imarket.php?rfcv='+getRFC(), {
        step: 'buyItemConfirm',
        itemID: itemN,
        ID: n,
        price: price
    },
        function (response) {

            response = JSON.parse(response);
            console.log(response);
            $('#responseTextAreaZero').html(response.text);
            if (response.success){

                $(".confirm-buy").remove();
                $(parent).remove();


            }

        })
}

$(document).ready(function(){
    $(document).off("click", ".buy");
    $(document).on("click", ".buy", function(e){
        e.preventDefault();
        e.stopImmediatePropagation();

        let link;
        if (!window.location.href.includes("search")){
             link = $("a", $(this));
        }
        else{
             link = $("span", $(this));

        }

        console.log(link);
        let parent = $(this).parent();
        let item_id = $(link).attr('data-id');
        let item_type = $(link).attr('data-item');
        let price = $('.cost', $(parent)).text().split("\n")[2].replace("$", "").replaceAll(",","");

        quickBuy(item_type, item_id, price, parent);


    });
});
