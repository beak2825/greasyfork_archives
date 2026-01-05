// ==UserScript==
// @name        Amazon Export Inventory
// @namespace   riceball
// @locale      en-us
// @description Exports your Amazon inventory to text.
// @include     https://sellercentral.amazon.com/inventory/*
// @version     1
// @grant       none
// @run-at      document-end
// @downloadURL https://update.greasyfork.org/scripts/25023/Amazon%20Export%20Inventory.user.js
// @updateURL https://update.greasyfork.org/scripts/25023/Amazon%20Export%20Inventory.meta.js
// ==/UserScript==

/* Script assumes that Amazon has $ === jQuery, which is generally true.
 * 
 * The idea behind this script is to export your inventory and use
 * it to post Craigslist or other ads to other marketplaces.
 * It applies a fixed price increase on every item, and then 
 * calculates a shipping price based on the type of product:
 * CD, paperback, or hardcover.
 *
 * The shipping is a guess based on the product type, but it 
 * is a fixed price, so you will need to adjust for heavy books.
 *
 * To use it, set your inventory list to display all your inventory
 * if possible, and then click the button.  Copy-paste the data out.
 */

price_increase = 1.00
audio_cd_shipping = 2.75;
paperback_shipping = 2.80;
hardcover_shipping = 3.50;

function getRows() {
    var ids = [];
    var myrows = [];
    $rows = $('.mt-row');
    $rows.each(function (idx) {
        ids.push($(this).attr('id'));
    });
    ids.forEach(function(id) {
        var selector = '#'+id;
        var quantity = $(selector+'-quantity-quantity').find('.a-input-text').attr('value');
        if (parseInt(quantity)==0) return; // skip if we don't have it
        
        var title = $(selector+'-title-title').find('.mt-link').attr('title');
        var price = $(selector+'-price-price').find('.a-input-text').attr('value');
        var newPrice = round_price(price_increase + parseFloat(price));

        var withshipping = 0;
        if (title.match(/\[Audio CD\]/)) {
            withshipping = round_price(audio_cd_shipping + newPrice);
        } else if (title.match(/\[Hardcover\]/)) {
            withshipping = round_price(hardcover_shipping + newPrice);
        } else if (title.match(/\[Paperback\]/)) {
            withshipping = round_price(paperback_shipping + newPrice);
        }
        
        if (quantity > 1 && withshipping != 0 ) {
            myrows.push( title + " (qyt: " + quantity + ") :: $" + newPrice.toFixed(2) + " :: (w/shipping $" + withshipping.toFixed(2) + ")"  );
        } else if (withshipping != 0) {
            myrows.push( title + " :: $" + newPrice + " :: (w/shipping $" + withshipping.toFixed(2) + ")" );
        } else {
            myrows.push( title + " :: $" + newPrice + " :: (w/shipping tbd)" );
        }
    });
    showDialog(myrows.join("\n"));
}

function round_price(price) {
    return Math.round(price*100)/100;
}

// shows a textarea with your string
function showDialog(text) {
    var $ta = $('<textarea style="position:absolute; top:50px; left:0; width: 80%; height: 500px">');
    $ta.val(text);
    $('#sc-masthead').append($ta);
}

function button_attacher() {
	console.log("button_attacher trying to attach");
	if ($('#sc-mkt-switcher-form').length > 0) {
		$mybutton = $('<button id="myamazonbutton" style="margin-right: 9px;">Export Inventory</button>');
		$mybutton.click(getRows);
		$('#sc-mkt-switcher-form').prepend($mybutton);
		window.clearInterval(amazonExportInventoryAttacher);
		amazonExportInventoryAttacher = undefined;
	} else {
		console.log("found no dialog - skipping");
	}
}

console.log('export inventory executed');
console.log('adding the button attacher');
amazonExportInventoryAttacher = window.setInterval(button_attacher, 10000); // every 10 seconds, try to attach the button to the dialog.
