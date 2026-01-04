// ==UserScript==
// @name         Auction House Scanner V1
// @namespace    dakool.zero.torn
// @version      0.1
// @description  simple auction poster
// @author       -zero
// @match        https://www.torn.com/amarket.php*
// @require http://code.jquery.com/jquery-3.4.1.min.js
// @grant    GM.getValue
// @grant    GM.setValue
// @grant    GM.xmlHttpRequest
// @grant    unsafeWindow
// @grant    GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/472966/Auction%20House%20Scanner%20V1.user.js
// @updateURL https://update.greasyfork.org/scripts/472966/Auction%20House%20Scanner%20V1.meta.js
// ==/UserScript==

var alldata = [];


function send(){
    console.log(alldata);
    GM.xmlHttpRequest({
        method: "POST",
        url: "https://zerostar.pythonanywhere.com/auction",
        headers:    {
            "Content-Type": "application/json"
        },
        data: JSON.stringify(alldata),
        onload: function(response) {
            console.log(response.responseText);
        },
        onerror: function(response) {
            console.log(response.responseText);
        }

    });

}

function scan(){
    if ($('.bonus-attachment').length > 0){
        console.log('here');
        $('.items-list > li').each(function(){
            console.log(this);
            var id = $(this).attr('id');
            if (!id){
                return;
            }
            var dmg;
            var acc;
            var bonusD = {};

            var raritySel = $('.item-plate > img', $(this)).attr("class").split(" ");
            var rarity = "";

            if (raritySel.includes("yellow")){
                rarity = "yellow";
            }
            if (raritySel.includes("orange")){
                rarity = "orange";
            }
            if (raritySel.includes("red")){
                rarity = "red";
            }

            var topbidderSel = $(".seller-wrap > .namehight > a", $(this)).attr("href");
            console.log(topbidderSel);


            $('.bonus-attachment', $(this)).each(function(){
                if ($(this).html().includes('damage')){
                    dmg = $('.label-value', $(this)).text();
                }
                if ($(this).html().includes('accuracy')){
                    acc = $('.label-value', $(this)).text();
                }
            });

            $('.bonus-attachment-icons', $(this)).each(function(){
                var bonus = $('i',$(this)).prop('class').split('attachment-')[1];
                var bonusps = $(this).attr('title').split('<br/>')[1].split('%');
                var bonusp = 'NA';
                if (bonusp.length > 0){
                    bonusp = bonusps[0];
                }

                bonusD[bonus] = bonusp;
            });

            var name = $('.title > span', $(this)).text();

            var price = $('.c-bid-wrap', $(this)).text();

            alldata.push({
                "category": "weapon",
                "timestamp": Date.now(),
                "name": name,
                "dmg": dmg,
                "accuracy": acc,
                "bonus": bonusD,
                "quality_percent": '0',
                "sold_for": price.substring(1),
                "bidder": topbidderSel,
                "rarity": rarity
            });

           // send(name, id, dmg, acc, JSON.stringify(bonusD), price);
        });
        console.log(alldata);

       send();

    }
    else{
        setTimeout(scan, 300);
    }
}
scan();

$(window).on('hashchange', function(e){
    setTimeout(scan, 1000);

});
