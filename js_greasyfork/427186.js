// ==UserScript==
// @name         AyBeCee's Price Watch
// @namespace    https://greasyfork.org/en/users/145271-aybecee
// @version      0.0.1
// @description  This script will alert you whenever an item is below your watch price or find the lowest possible price. Remember to enable Notifications while gaming on your Windows System.
// @author       AyBeCee
// @match        https://*.tamrieltradecentre.com/pc/Trade/SearchResult*
// @grant        GM_setValue
// @grant        GM_getValue

// @downloadURL https://update.greasyfork.org/scripts/427186/AyBeCee%27s%20Price%20Watch.user.js
// @updateURL https://update.greasyfork.org/scripts/427186/AyBeCee%27s%20Price%20Watch.meta.js
// ==/UserScript==

(function() {
    'use strict';


    Notification.requestPermission();


    // https://stackoverflow.com/questions/2901102/how-to-print-a-number-with-commas-as-thousands-separators-in-javascript
    function numberWithCommas(x) {
        return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    }


    var refreshTimeKey;
    var refreshTime = GM_getValue('refreshTimeKey',0);

    var openWindowKey;
    var openWindow = GM_getValue('openWindowKey',0);

    var notifyNoMatchesKey;
    var notifyNoMatches = GM_getValue('notifyNoMatchesKey',0);

    // activate script when looking at a specific item
    var particularItemKey;
    var particularItem = GM_getValue('particularItemKey',0);

    var myItemNameKey;
    var myItemName = GM_getValue('myItemNameKey',0);

    // find lowest available price

    var lowestAvailableKey;
    var lowestAvailable = GM_getValue('lowestAvailableKey',0);

    // find prices lower than xxxx

    var customPriceKey;
    var customPrice = GM_getValue('customPriceKey',0);


    var maxAmountKey;
    var maxAmount = GM_getValue('maxAmountKey',0);




    var lowestPrice;
    var lowestPriceAmount;
    var lowestPriceRow;

    var lowestPriceString;

    function displayNotification() {

        if ( openWindow == true ) {
            lowestPriceRow.click()
        }

        console.log(lowestPriceRow);
        var itemLocation = lowestPriceRow.find(`[data-bind="text: StringResource['TraderLocation' + DBData.GuildKioskLocation[GuildKioskLocationID]]"]`).text();
        var itemGuildName = lowestPriceRow.find(`[data-bind="text: GuildName"]`).text();

        var lastSeen = lowestPriceRow.find(`[data-bind="minutesElapsed: DiscoverUnixTime"]`).text();
        var totalPrice = lowestPrice * lowestPriceAmount;
        console.log(`totalPrice ${totalPrice}`)
        console.log(`lowestPrice ${lowestPrice}`)
        console.log(`lowestPriceAmount ${lowestPriceAmount}`)
        console.log(
`${lowestPrice} x ${lowestPriceAmount} = ${lowestPrice * lowestPriceAmount}
${lastSeen}

${itemLocation}
${itemGuildName}`);

        new Notification(
`${lowestPrice} x ${lowestPriceAmount} = ${lowestPrice * lowestPriceAmount}
${lastSeen}

${itemLocation}
${itemGuildName}`);
    }

    function formArray() {
        var arrayPrices = [];

        // for every row, get the unit price and add to arrayPrices
        $(`tr.cursor-pointer`).find(`td[data-bind="using: TradeAsset"]`).each(function() {
            var unitPrice = $(this).find(`span[data-bind="localizedNumber: UnitPrice"]`).text();

            // console.log(unitPrice)
            unitPrice = Number(unitPrice.replace(/,/g, ''));

            arrayPrices.push(unitPrice);
        });


        console.log(arrayPrices)

        // get the lowest value of arrayPrices
        lowestPrice = Math.min(...arrayPrices)
        console.log(`lowestPrice ${lowestPrice}`)

        // get the row which contains the lowest price

        var lowestPriceString = numberWithCommas(lowestPrice);

        lowestPriceRow = $(`span[data-bind="localizedNumber: UnitPrice"]:contains('${lowestPriceString}'):first`).parent().parent();
        console.log(lowestPriceRow);
        lowestPriceAmount = Number( lowestPriceRow.find(`[data-bind="localizedNumber: Amount"]`).text() );

        console.log(lowestAvailable)

        if ( ( maxAmount > 0 && customPrice > 0 )
            ||
            ( maxAmount > 0 && lowestAvailable == true ) ) {
            console.log(`check that user filled out maxAmount and customPrice`)
            if ( lowestPriceAmount <= maxAmount ) {  // check that the lowestPriceAmount (TTC listing) is less than maxAmount (amount the user wants)

                // YAY YOU FOUND A MATCH

                console.log(`lowestPriceAmount ${lowestPriceAmount}`)

                if ( lowestPrice !== Infinity ) { // check if prices loaded yet

                    if ( lowestAvailable == true ) {
                        displayNotification()
                    } else if ( lowestAvailable == false ) {
                        if ( lowestPrice <= customPrice ) {
                            displayNotification()
                        } else if ( refreshTime > 0 ){
                            console.log(`No prices lower than ${customPrice}. Refreshing in ${refreshTime}ms.`)
                            if ( notifyNoMatches == true ) { new Notification(`No prices lower than ${customPrice}. Refreshing in ${refreshTime}ms.`) }
                            setTimeout( function() {
                                location.reload()
                            }, refreshTime)
                        } else {
                            console.log(`No prices lower than ${customPrice}. Refresh time NOT entered. Not refreshing.`)
                            if ( notifyNoMatches == true ) { new Notification(`No prices lower than ${customPrice}. To auto-refresh, please input a 'Refresh time'.`) }
                        }
                    }

                } else {
                    console.log('Prices not loaded yet');
                    setTimeout(function() {formArray()}, 1000);
                }

            } else {

                console.log(`lowestPriceAmount is not less than maxAmount, removing the row and trying again`)
                // if lowestPriceAmount is not less than maxAmount, remove the row
                lowestPriceRow.remove();

                // if there's no rows left
                if ( $(`td[data-bind="using: TradeAsset"]`).length ) {
                    // make a new array and repeat
                    formArray()
                } else if ( refreshTime > 0 ) {
                    console.log(`No prices lower than ${customPrice}. Refreshing in ${refreshTime}ms`)
                    if ( notifyNoMatches == true ) { new Notification(`No prices lower than ${customPrice}. Refreshing in ${refreshTime}ms`) }
                    setTimeout( function() {
                        location.reload()
                    }, refreshTime)
                }
            }

        }
        else if ( lowestAvailable != true ) {
            alert('Please check that your Max Unit price and/or Max Amount is more than 0')
        }
        else if ( lowestAvailable == true ) {
            alert('Please check that your Max Amount is more than 0')
        }
    }

    if ( ( ( $(`#ItemNamePattern`).val() == myItemName ) && ( particularItem == true ) )
        || ( particularItem == false ) ) {
        setTimeout(function() {
            formArray()
        }, 1000);
    }

    $(`.glass-panel`).prepend(
        `<style>
        #pricewatch {
        background: #ece0f5; padding: 0 20px; border: 1px solid #52435c; margin-bottom: 20px; color: #52435c;border-radius:4px;
        }
        #pricewatch input {
        border:1px solid #000;
        }
        </style>
<div id="pricewatch">
<h2>AyBeCee's Price Watch</h2>

<label for="particularItem" title="Check to enable use ONLY on a specific item.">Run script only for a specific item</label>
<input type="checkbox" id="particularItem" name="particularItem">
<br>

  <label for="myItemName">Item name:</label>
  <input type="text" id="myItemName" name="myItemName" value="${myItemName}">
  <br>

<label for="lowestAvailable">Find lowest available price</label>
<input type="checkbox" id="lowestAvailable" name="lowestAvailable">

  <br>
<label for="customPrice">Max Unit price</label>
<input type="number" id="customPrice" name="customPrice" value="${customPrice}">

  <br>
<label for="maxAmount">Max Amount</label>
<input type="number" id="maxAmount" name="maxAmount" value="${maxAmount}" min="1" max="200">


  <br>
<label for="refreshTime" title="If no matches, milliseconds until next refresh. If you put 0, this script will not refresh.">Refresh time (ms)</label>
<input type="number" id="refreshTime" name="refreshTime" value="${refreshTime}">
<br>

<label for="openWindow">Open Trade if found a match</label>
<input type="checkbox" id="openWindow" name="openWindow">

<br>

<label for="notifyNoMatches">Notify if no matches found</label>
<input type="checkbox" id="notifyNoMatches" name="notifyNoMatches">

<br>
<button id="submit" class="btn btn-primary" style="background:#856898;border:1px solid #52435c;">Update parameters</button>
<br><br>
        </div>`);

    // for defaults
    if ( lowestAvailable == true ) {
        $('#lowestAvailable').prop('checked', true);

        $(`label[for="customPrice"]`).hide();
        $("#customPrice").hide();
    }
    if ( particularItem == true ) {
        $('#particularItem').prop('checked', true);

        $(`label[for="myItemName"]`).show();
        $("#myItemName").show();
    } else {
        $(`label[for="myItemName"]`).hide();
        $("#myItemName").hide();
    }
    if ( openWindow == true ) {
        $('#openWindow').prop('checked', true);
    }
    if ( notifyNoMatches == true ) {
        $('#notifyNoMatches').prop('checked', true);
    }

    // checkbox changing
    $('#lowestAvailable').change(function() {
        if ($('#lowestAvailable').is(':checked')) {
            $(`label[for="customPrice"]`).hide();
            $("#customPrice").hide();
        } else {
            $(`label[for="customPrice"]`).show();
            $("#customPrice").show();
        }
    });


    $('#particularItem').change(function() {
        if ($('#particularItem').is(':checked')) {
            $(`label[for="myItemName"]`).show();
            $("#myItemName").show();
        } else {
            $(`label[for="myItemName"]`).hide();
            $("#myItemName").hide();
        }
    });



    console.log(`lowestAvailable ${lowestAvailable}`)
    console.log(`particularItem ${particularItem}`)

    $(`#submit`).click( function() {

        if ($('#lowestAvailable').is(':checked')) {
            GM_setValue('lowestAvailableKey',true);
        } else {
            GM_setValue('lowestAvailableKey',false);
        }

        if ($('#particularItem').is(':checked')) {
            GM_setValue('particularItemKey',true);
        } else {
            GM_setValue('particularItemKey',false);
        }

        if ($('#openWindow').is(':checked')) {
            GM_setValue('openWindowKey',true);
        } else {
            GM_setValue('openWindowKey',false);
        }
        if ($('#notifyNoMatches').is(':checked')) {
            GM_setValue('notifyNoMatchesKey',true);
        } else {
            GM_setValue('notifyNoMatchesKey',false);
        }


        myItemName = $(`#myItemName`).val();
        GM_setValue('myItemNameKey',myItemName);

        refreshTime = Number( $(`#refreshTime`).val() );
        GM_setValue('refreshTimeKey',refreshTime);

        customPrice = Number( $(`#customPrice`).val() );
        GM_setValue('customPriceKey',customPrice);

        maxAmount = Number( $(`#maxAmount`).val() );
        GM_setValue('maxAmountKey',maxAmount);


        location.reload();
    });

})();