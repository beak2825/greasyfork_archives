// ==UserScript==
// @name          eBay - Display Totals with Shipping Redux
// @namespace     http://www.toraboka.com/~mrudat , MrBrax
// @description   Computes and displays the total price with shipping added.
// @include       http://*.ebay.tld/*sch/*
// @include       http://*.ebay.tld/*i.html?*
// @include       http://*.ebay.tld/itm/*
// @version       0.0.6
// @grant       none
// @downloadURL https://update.greasyfork.org/scripts/27585/eBay%20-%20Display%20Totals%20with%20Shipping%20Redux.user.js
// @updateURL https://update.greasyfork.org/scripts/27585/eBay%20-%20Display%20Totals%20with%20Shipping%20Redux.meta.js
// ==/UserScript==

/* jshint esnext: true */

process();

function process() {

	var countryText = {
		uk: 'United Kingdom'
	};

	var taxCountries = ['China', 'Hong Kong', 'Japan', 'Malaysia'];
	
	var currency = '$';
	
	var price = /\$([\d\,]*\.\d\d)/; // regexp to test for currency
	
	var tld = location.host.split('.').reverse()[0];
	
	switch (tld) {
		case 'uk':
			currency = '£';
			price = /£([\d\,]*.\d\d)/;
			break;
	}

	var itemPage = /^\/itm\//.test(location.pathname);

	if (itemPage) {
		var buyItNowPrice = -1;
		var shippingPrice = -1;

		//TODO display table of total price for 1 .. min(10,available) of item (presuming shipping cost differs)
		//FIXME only possible if we can work out conversion rate for extra shipping; possibly not worthwhile?
		//var priceTableTarget = document.querySelector('div.quantity').parentNode;
		//var shippingTable = document.querySelector('table.sh-tbl');
		
		var priceSummary = document.querySelector('span#prcIsum');
		var priceSummaryConverted = document.querySelector('span#convbinPrice');
		var priceSummaryConvertedContainer = document.querySelector('span#prcIsumConv');

		var priceSummaryText = null;
		if (priceSummaryConverted !== null) {
			priceSummaryText = priceSummaryConverted.textContent;
			priceSummaryConverted.parentNode;
		} else if (priceSummary !== null) {
			priceSummaryText = priceSummary.textContent;
		}
		var priceSummaryCurrency = "";
		if (priceSummaryText !== null) {
			priceSummaryCurrency = priceSummaryText.substring(0, priceSummaryText.indexOf(currency) + 1);
			buyItNowPrice = priceSummaryText.match(price)[1].replace(',','');
		}
		
		var shippingCost = document.querySelector('span#fshippingCost');
		var shippingCostConverted = document.querySelector('span#convetedPriceId');

		var shippingCostText = null;
		if (shippingCostConverted !== null) {
			shippingCostText = shippingCostConverted.textContent;
		} else if (shippingCost != null) {
			shippingCostText = shippingCost.textContent;
		}
		if (shippingCostText !== null) {
			if (/Free/.test (shippingCostText) || (/Digital delivery/.test(shippingCostText))) {
				shippingPrice = 0;
			} else if (/Not specified/.test(shippingCostText)) {
				shippingPrice = '?';
			} else if (price.test(shippingCostText)){
				shippingPrice = shippingCostText.match(price)[1].replace(',','');
			}
		}

		if (buyItNowPrice != -1 && shippingPrice != -1) {
			
			var buyItNowTotal = "?";
			
			if (!isNaN(buyItNowPrice) && !isNaN(shippingPrice)){
				buyItNowTotal = (parseFloat(buyItNowPrice) + parseFloat(shippingPrice)).toFixed(2);
			}
			
			if (priceSummaryConverted !== null){
				priceSummaryConverted.parentNode.parentNode.removeChild(priceSummaryConverted.parentNode);
			}
			
			priceSummary.innerHTML = '<span title="With shipping" style="cursor:help;">' + priceSummaryCurrency + buyItNowTotal + '</span> <small title="Without shipping" style="font-size:80%; color: #666; cursor:help;">(<strong>' + priceSummaryCurrency + buyItNowPrice + '</strong>+' + priceSummaryCurrency + shippingPrice + ')</small>';
		
		}

	} else {
		Array.prototype.forEach.call(document.querySelectorAll('li[listingid]'), rowElement => {
			var buyItNowPrice = -1;
			var shippingPrice = -1;

			var lvprices = rowElement.querySelector('ul.lvprices');

			// TODO what is this for?
			Array.prototype.forEach.call(lvprices.querySelectorAll('div.cmpat'),i => i.parentNode.removeChild(i));

			var shipping = lvprices.querySelector('span.fee');

			if (shipping !== null) {
				var tc = shipping.textContent;
				if (/Free/.test (tc) || (/Digital delivery/.test(tc))) {
					shippingPrice = 0;
				} else if (/Not specified/.test(tc)) {
					shippingPrice = '?';
				} else if (price.test(tc)){
					shippingPrice = tc.match(price)[1].replace(',','');
				}
			}

			var buyItNow = lvprices.querySelector('li.lvprice');

			var priceSummaryCurrency = "";
			if (buyItNow !== null) {
				var tc = buyItNow.textContent.trim();
				priceSummaryCurrency = tc.substring(0, tc.indexOf(currency) + 1).trim();
				buyItNowPrice = tc.match(price)[1].replace(',','');
			}

			if (buyItNowPrice != -1 && shippingPrice != -1) {
				var buyItNowTotal = "?";
				if (!isNaN(buyItNowPrice) && !isNaN(shippingPrice)){
					buyItNowTotal = (parseFloat(buyItNowPrice) + parseFloat(shippingPrice)).toFixed(2);
				}
				
				buyItNow.innerHTML = buyItNow.innerHTML.substring(0, buyItNow.innerHTML.indexOf('</b>') + 4);
				
				buyItNow.innerHTML += '<span title="Total cost" class="bold" style="cursor:help;">' + priceSummaryCurrency + buyItNowTotal + '</span><br><small style="font-size:80%; color: #666; cursor:help;">(<strong title="Item price">' + priceSummaryCurrency + buyItNowPrice + '</strong>+<span title="Shipping">' + priceSummaryCurrency + shippingPrice + '</span>)</small>';

				shipping.innerHTML = '';

			}

			var hasLocation = false;

			var itemLocation = null;

			var sellerIndex = -1;

			var detailLines = rowElement.querySelectorAll('ul.lvdetails li');
			
			for(var i = 0; i < detailLines.length; i++){
				
				if( detailLines[i].innerText.trim().substr(0,4) == 'From' ){
					hasLocation = true;
					itemLocation = detailLines[i].innerText.trim().substr(5);
				}

				if( detailLines[i].innerText.trim().substr(0,6) == 'Seller' ){
					sellerIndex = i;
					if(hasLocation) break;
				}

			}

			if(!hasLocation && sellerIndex != -1){
				var locLi = document.createElement('li');
				locLi.innerHTML = 'From ' + ( countryText[tld] ? countryText[tld] : tld ) + ' (probably)';
				detailLines[0].parentNode.insertBefore( locLi, detailLines[sellerIndex] );
			}

			if( taxCountries.indexOf(itemLocation) !== -1 ){
				
				var addedCost = 0;

				var cp = 0;
				var c1 = 0;
				var c2 = 0;

				if (buyItNowPrice != -1) {

					if(shippingPrice != -1) c2 = parseFloat(shippingPrice);

					cp = parseFloat( buyItNowPrice );
					
					addedCost += cp + c2;

					if(cp + c2 > 130){
						c1 = ( cp + c2 ) * 0.10; // toll
						addedCost += c1; 
					}
					
					addedCost += ( cp + c2 + c1 ) * 0.25; // moms

					addedCost += 13 // administrative;

				}else{

				}

				buyItNow.innerHTML += ' <small title="With swedish fees" style="color:' + ( addedCost < 50 ? '#308927' : '#C12828' ) + '; cursor: help;">(~' + priceSummaryCurrency + Math.round(addedCost) + ')</small>';

				if(addedCost >= 50){
					rowElement.style.backgroundColor = '#fff0f0';
				}

			}

		});
	}
}
