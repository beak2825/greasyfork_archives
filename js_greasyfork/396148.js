// ==UserScript==
// @name         Flight Rising: Auto Buyer
// @namespace    https://greasyfork.org/en/users/145271-aybecee
// @version      0.3.1
// @description  Automatically refreshes until there's a cheap dragon to buy.
// @author       AyBeCee
// @match        https://www1.flightrising.com/auction-house/buy/realm/dragons?currency=0&d_age=1&sort=unit_cost_asc&nocollapse=1&collapse=1
// @match        https://www1.flightrising.com/auction-house/buy/realm/dragons?currency=0&sort=unit_cost_asc&nocollapse=1&collapse=1
// @grant        GM_setValue
// @grant        GM_getValue
// @downloadURL https://update.greasyfork.org/scripts/396148/Flight%20Rising%3A%20Auto%20Buyer.user.js
// @updateURL https://update.greasyfork.org/scripts/396148/Flight%20Rising%3A%20Auto%20Buyer.meta.js
// ==/UserScript==

var url = window.location.href;

Notification.requestPermission();

function flashySaved () {
    $("#savedFade1").fadeIn(500);
    setTimeout(function(){
        $("#savedFade1").fadeOut(500);
    }, 1000);
}

//// RANDOMISED TIMER ////

// calculate when to refresh based on the number of people online
var usersOnline = Number($('a.loginlinks').text().substring(0,4));

var minWaitKey;
var minToWait = Number(GM_getValue('minWaitKey',0));

var maxWaitKey;
var maxToWait = Number(GM_getValue('maxWaitKey',0));

var wait=Math.floor(Math.random() * (maxToWait - minToWait + 1)) + minToWait;


//  refresh counter
var refreshGM;
var refreshOld = GM_getValue('refreshGM',0);
var refreshCount = refreshOld + 1;
GM_setValue('refreshGM',refreshCount);

//// USER FRIENDLY PART ////

var maxPrice;
var maxPriceCode = GM_getValue('maxPrice',0);

var maxRefresh;
var maxRefreshNumber = GM_getValue('maxRefresh',0);

var maxLair;
var maxLairInput = GM_getValue('maxLair',0);

$('body').append(`<style>
    #floatyBox form {
        display: inline-block;
    }

    #floatyBox input {
        display: inline-block;
        width: 80px
    }

    #floatyBox {
        position: fixed;
        top: 0;
        left: 0;
        padding: 10px;
        width: 300px;
        background: #fff;
        z-index: 10
    }

    #savedFade1 {
        text-align: center;
        color: #ffffff;
        background: #4CAF50;
        padding: 2px 8px;
        display: none;
        margin-top: 5px;
    }
#floatyBox a {
    background: #731d08;
    color: #fff;
    display: inline-block;
    padding: 10px;
}
</style>
<div id="floatyBox">Maximum lair number:
    <form id="maxLairForm">
        <input type="number" id="maxLair" placeholder="${maxLairInput}">
    </form>
    <br>
    <br>Number of refreshes: ${refreshCount}
    <br>
    <br>Maximum refreshes:
    <form id="maxRefreshForm">
        <input type="number" id="maxRefresh" placeholder="${maxRefreshNumber}">
    </form>
    <br>
    <br>Refresh between
    <form id="minWaitForm">
        <input type="number" id="minWait" placeholder="${minToWait}">
    </form> and
    <form id="maxWaitForm">
        <input type="number" id="maxWait" placeholder="${maxToWait}">
    </form> milliseconds.
    <br>
    <br>Next refresh in ${wait} milliseconds.
    <br>
    <br>Maximum auto-buy price:
    <form id="maxPriceForm">
        <input type="number" id="maxPrice" placeholder="${maxPriceCode}">
    </form>
<br>
<br>
<a href="https://www1.flightrising.com/auction-house/buy/realm/dragons?currency=0&sort=unit_cost_asc&nocollapse=1&collapse=1">Hatchlings</a>
<a href="https://www1.flightrising.com/auction-house/buy/realm/dragons?currency=0&d_age=1&sort=unit_cost_asc&nocollapse=1&collapse=1">All dragons</a>
    <div id="savedFade1">Saved</div>
</div>
`)


$('#maxLairForm').change(function() {
    var lairInput = $('#maxLair').val();
    GM_setValue('maxLair',lairInput);

    flashySaved ()
});

$('#maxPriceForm').change(function() {
    var priceInput = $('#maxPrice').val();
    GM_setValue('maxPrice',priceInput);

    flashySaved ()
});

$('#maxRefreshForm').change(function() {
    var refreshInput = $('#maxRefresh').val();
    GM_setValue('maxRefresh',refreshInput);

    flashySaved ()
});


$('#minWaitForm').change(function() {
    var minWaitInput = $('#minWait').val();
    GM_setValue('minWaitKey',minWaitInput);

    flashySaved ()
});
$('#maxWaitForm').change(function() {
    var maxWaitInput = $('#maxWait').val();
    GM_setValue('maxWaitKey',maxWaitInput);

    flashySaved ()
});

// store purchase history
var historyGM;
var historyOld = GM_getValue('historyGM',0);

$('#ah-content').prepend('<style>#clear:hover{cursor:pointer}#purchasehistory{width: 100%;border:.5px solid #999;border-spacing: 0; border-collapse: separate;}#purchasehistory td{padding: 5px 10px; font-size: 12px;border:.5px solid #999;}#purchasehistory thead td{font: bold 12px verdana; background: #731d08; color: #e8cc9f; }}</style><div class="ah-sep-container"> <div class="ah-sep-text"> Purchase history </div> <div class="ah-sep-button-container"> <a id="clear" class="ah-copy-link" title="Click to clear your purchase history"><img src="/static/layout/forum/forum-icon-delete.png" style="width:15px"> CLEAR HISTORY </a> </div></div><table id="purchasehistory"><thead><tr><td>Item</td><td>Cost</td><td>Time</td></tr></thead><tbody>' + historyOld + '</tbody></table>');

$('#clear').click(function(){
    GM_setValue('historyGM',"");
    $('#purchasehistory tbody').hide();
});

// if lair is full
var dragonNumber = Number($('#login_ach').parent().text());
if ( dragonNumber < maxLairInput ) {


    //// DETECTING THE RIGHT PRICE AND BUYING ////

    var firstListing = Number($('.ah-listing-row:first .ah-listing-cost').text());

    if ( firstListing <= maxPriceCode ) {

        // click the buy button
        $('.ah-listing-row:first .ah-listing-buy-button').click()
        // click the purchase button
        $('#ah-buy-verify-dlg input[value="Purchase"]').click()
        $('#ah-buy-ok-dlg').append("<center><br><br><b>Cost:</b> " + firstListing + "</center>")

        // get the purchase details and add it to the local storage
        var itemName = $('.ah-listing-row:first .ah-listing-itemname').parent().parent().html();
        var itemCost = $('.ah-listing-row:first .ah-listing-currency').html();
        var itemTime = $('span.time.common-tooltip span').text();

        var historyNew;
        var purchaseHistory;

        setTimeout(function(){
            // if the 'Listing no longer exists' popup exists, add a strikethrough
            if( $('#ah-error-dlg').css('display') == 'block' ) {
                historyNew = '<tr style="text-decoration-line: line-through;"><td>' + itemName + "</td><td>" + itemCost + "</td><td>" + itemTime + "</td></tr>";
            } else {
                historyNew = "<tr><td>" + itemName + "</td><td>" + itemCost + "</td><td>" + itemTime + "</td></tr>";
                new Notification("Dragon bought!");
            }

            purchaseHistory = historyOld + historyNew;
            GM_setValue('historyGM',purchaseHistory);

            window.open(url, '_self');

        }, 500);

    } else {

        // if you've reached the maximum refreshes
        if ( refreshCount < maxRefreshNumber ) {

            setTimeout(function(){
                location.reload();
            },wait);

        } else {
            // beep when you've reached the max refreshes
            $('#floatyBox').append("<br><br><font color='red'>The script is no longer running because you've reached the maximum number of refreshes.</font>")
            new Notification("Max refresh hit");
        }

    }

} else {
    new Notification("Maximum lair number reached");
}