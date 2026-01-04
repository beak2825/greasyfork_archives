// ==UserScript==
// @name         Torn Race Conditioner
// @namespace    https://www.torn.com/profiles.php?XID=2029670
// @version      1.0
// @description  Bugggggs
// @author       Mike Pence
// @match        https://www.torn.com/*
// @requires     https://ajax.googleapis.com/ajax/libs/jquery/3.2.0/jquery.min.js
// @downloadURL https://update.greasyfork.org/scripts/507501/Torn%20Race%20Conditioner.user.js
// @updateURL https://update.greasyfork.org/scripts/507501/Torn%20Race%20Conditioner.meta.js
// ==/UserScript==

function getMillisecsToNextTime() {
    let date = new Date();
    let millisecsToNextTime = 60 * 1000 - (date.getSeconds() * 1000 + date.getMilliseconds());
    while(millisecsToNextTime > 15 * 1000) {
        millisecsToNextTime -= 15 * 1000;
    }
    return millisecsToNextTime;
}

$(document).ready(function(){
    let div = "<div><h1>MikePence's Race Conditioner</h1><p>Rfcv: <input type='text' id='mprc-rfcv' value=''> Confirmation: <span id='mprc-rfcv-confirmation'></span></p><p>Delay: <input type='text' id='mprc-delay' value='0'> Confirmation: <span id='mprc-delay-confirmation'>0</span></p><p id='mprc-buttons'></p></div>";
    $(".content-wrapper").first().prepend(div);
    if(window.location.href.indexOf("bazaar.php") > -1){
        $("#mprc-buttons").html("<button id='mprc-list' class='torn-btn'>List</button><button id='mprc-remove' class='torn-btn'>Remove</button><button id='mprc-buy' class='torn-btn'>Buy</button>");
        $("#mprc-list").click(function(){
            $.post("https://www.torn.com/bazaar.php", {step: "addInventoryItems", "items[0][amount]": 1, "items[0][price]":1000,"items[0][type]":"Other","items[0][id]":8888210125,"items[0][itemID]":377,"items[0][estimatedPrice]":707},function(data){console.log(data);});
        });
        $("#mprc-remove").click(function(){
            setTimeout(function(){
                $.post("https://www.torn.com/bazaar.php?" + $.param({sid: "bazaarData", step: "manageItems"}),{items:'[{"bazaarID":"38856531","itemID":"377","remove":1}]'},function(data){console.log(data);});
            }, getMillisecsToNextTime() + parseInt($("#mprc-delay").val()));
        });
        $("#mprc-buy").click(function(){
            setTimeout(function(){
                $.post("https://www.torn.com/bazaar.php?" + $.param({sid: "bazaarData", step: "buyItem"}), {userID: 2029670, id: 38856531, itemID: 377, amount: 1, price: 1000, beforeval: 1000},function(data){console.log(data);});
            }, getMillisecsToNextTime() + parseInt($("#mprc-delay").val()));
        });
    }
    else if(window.location.href.indexOf("properties.php") > -1){
        $("#mprc-buttons").html("<button id='mprc-deposit' class='torn-btn'>Deposit</button><button id='mprc-withdraw' class='torn-btn'>Withdraw</button>");
        $("#mprc-deposit").click(function(){
            $.post("https://www.torn.com/properties.php?" + $.param({rfcv: $("#mprc-rfcv").val()}), {step: "vaultProperty", deposit: 1, ID: 3158724},function(data){console.log(data);});
        });
        $("#mprc-withdraw").click(function(){
            setTimeout(function(){
                $.post("https://www.torn.com/properties.php?" + $.param({rfcv: $("#mprc-rfcv").val()}), {step: "vaultProperty", withdraw: 1, ID: 3158724},function(data){console.log(data);});
            }, getMillisecsToNextTime() + parseInt($("#mprc-delay").val()));
        });
    }

    $("#mprc-delay").change(function(){
        $("#mprc-delay-confirmation").text($(this).val());
    });
    $("#mprc-rfcv").change(function(){
        $("#mprc-rfcv-confirmation").text($(this).val());
    });
});