// ==UserScript==
// @name         Subeta: Price Helper
// @namespace    https://greasyfork.org/en/users/145271-aybecee
// @version      0.1.1
// @description  Helps with pricing items for your shops. Hover over the item until the tooltip pops up, and then click it. The user shop price should automatically be added to the input field.
// @author       AyBeCee
// @match        https://subeta.net/user_shops.php/mine/*
// @require      https://code.jquery.com/jquery-1.7.1.min.js
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/412477/Subeta%3A%20Price%20Helper.user.js
// @updateURL https://update.greasyfork.org/scripts/412477/Subeta%3A%20Price%20Helper.meta.js
// ==/UserScript==


$(`.card-header:contains('Your Items')`).after(`
<div id="loadiframes" style="text-align: center; color: #fff; background: red; padding: 5px; border-radius: 3px;cursor:pointer">Run auto pricing script!</div>`)




var itemIDArray = [];
$(`.wl_item.non_wishlist`).each( function() {
    var idText = parseInt( $(this).parent().parent().find(`td:first-child`).text() );
    itemIDArray.push(idText)
})
console.log(itemIDArray)

function itemPrice ( arrayName, i) {
    var itemID = arrayName[i]
    i ++
    console.log(itemID);
    $(`body`).append(`<iframe src="/hover_item.php?itemid=${itemID}" id="iframe${itemID}" style="visibility:hidden"></iframe>`);

    $(`#iframe${itemID}`).on("load", function () {
        console.log(`#iframe${itemID} is loaded`);


        // get the price from the iframe
        var iframeContents = $(`#iframe${itemID}`).contents().text().replace(/,/g, '');
        var iframePrice = parseInt (iframeContents.substring(
            iframeContents.lastIndexOf(`Recent Price: `) + 14,
            iframeContents.lastIndexOf(`Account Search`)
        ));

        // put new price into the input field
        $(`#sp_price_${itemID}`).val(iframePrice)
        $(`#sp_price_${itemID}`).attr("style","background: yellow;");

        // https://stackoverflow.com/questions/16615655/jquery-each-loop-pausing-for-iframe-to-fully-load

        if ( i < arrayName.length) { itemPrice(arrayName, i++) } else {
            $('[value="Update Items"]').click();
        }

    });
}


$("#loadiframes").on("click", function(){
itemPrice(itemIDArray, 0)
})



