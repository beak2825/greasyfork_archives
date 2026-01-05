// ==UserScript==
// @name        eBay - Gesamtpreis Search Results
// @namespace   conquerist2@gmail.com
// @include     http://www.ebay.de/sch/*i.html*
// @include     http://www.ebay.de/dsc/*i.html*
// @include     https://www.ebay.de/sch/*i.html*
// @include     https://www.ebay.de/dsc/*i.html*
// @include     http://www.ebay.com/sch/*i.html*
// @include     http://www.ebay.com/dsc/*i.html*
// @include     https://www.ebay.com/sch/*i.html*
// @include     https://www.ebay.com/dsc/*i.html*
// @description eBay.de - Gesamtpreis bei Suchergebnissen
// @version     4.2
// @grant       GM.xmlHttpRequest
// @downloadURL https://update.greasyfork.org/scripts/5055/eBay%20-%20Gesamtpreis%20Search%20Results.user.js
// @updateURL https://update.greasyfork.org/scripts/5055/eBay%20-%20Gesamtpreis%20Search%20Results.meta.js
// ==/UserScript==
// 2019 10 13 v4.2 -- Fix for on-sale GSP items
// 2019 10 11 v4.1 -- Fixed csv export
// 2019 10 11 v4.0 -- Update to new ebay page ids and class names (DOM scheme?)
// 2019 01 05 v3.0 -- Update to new ebay page ids and class names (DOM scheme?); GM 4.0 compatibility
// 2017 01 14 v2.6 -- Handle reult pages with "items from international sellers" correctly
// 2016 12 18 v2.5 -- Fix for updates in eBay HTML: 1) timeleft in ms 2) remove of .bids
// 2016 01 24 v2.4 -- Correctly handle dates that are implicitly from the previous year
// 2015 05 25 v2.3 -- Disable button when not sorting. Understand different display texts for "cheapest first".
// 2015 05 25 v2.2 -- Only sort if sorting by price is selected. Support UK GSP. Fixed conversion fee. Fixed query selector for unsortables.
// 2014 10 14 v2.1 -- Remove text area after copying
// 2014 10 14 v2.0 -- Copy to CSV feature
// 2014 10 12 v1.2 -- @include http://www.ebay.de/dsc/*i.html*
// 2014 10 02 v1.1 -- .grfsp for free shipping; support period as decimal separator; changed paypal conversion fee from 2.5% to 3.5%

items = document.querySelectorAll('#ListViewInner > li');
numItems = items.length;
console.log('numItems: ' + numItems);
if (lastRealItem = document.querySelector('.sifExp')) { //### 191011 noch notwendig?
	numItems = lastRealItem.parentElement.previousSibling.getAttribute('r') - 1;
}

// button
var btn_gesamtpreise = document.createElement('button');
btn_gesamtpreise.id = 'btn_gesamtpreise';
btn_gesamtpreise.type = 'button';
btn_gesamtpreise.style = 'float: right; padding: 5 0 0 0';
btn_gesamtpreise.addEventListener('click', gesamtpreise, false);
btn_gesamtpreise.innerHTML = 'Gesamtpreise';
var e = document.getElementById('CenterPanel'); //### delete when old ids no longer in use
if (e) e.insertBefore(btn_gesamtpreise, e.firstChild);
else if (e = document.querySelector('div.srp-shipping-location__flyout')) e.insertBefore(btn_gesamtpreise, e.firstChild);

// "to csv" button for completed items
//if( window.location.pathname.search(/LH_Complete=1/) ) {
	var btn_csv = document.createElement('button');
	btn_csv.id = 'btn_csv';
	btn_csv.type = 'button';
	btn_csv.style = 'float: right; padding: 5 0 0 0';
	btn_csv.addEventListener('click', to_csv, false);
	btn_csv.innerHTML = 'To Clipboard (CSV)';
	var e = document.getElementById('CenterPanel'); //### delete when old ids no longer in use
	if (e) e.insertBefore(btn_csv, e.firstChild);
  else if (e = document.querySelector('div.srp-shipping-location__flyout')) e.insertBefore(btn_csv, e.firstChild);
//}


function gesamtpreise(caller, cb) {
	var sortWanted = document.querySelector('.srtsel').textContent.match(/(Preis inkl. Versand: niedrigster zuerst|Niedrigster Preis inkl. Versand)/);
	//console.log("sortWanted: " + sortWanted ? "1" : "0");
	cb = (typeof cb === "undefined") ? (sortWanted ? sortTable : disable_gesamtpreise_button) : cb;
	//console.log(cb);
	//console.log(sortTable);
	
	var numGsp = 0, numGspProcessed = 0;
	for(var i = 0; i < numItems; i++){
    console.log('item: ' + i);
		// Get country and EU
		fromCountry = items[i].querySelector('.lvdetails');
		var country = 'Deutschland';
		var eu = true;
		if(fromCountry.innerHTML.match(/Aus (.*)/)) {
				var country = fromCountry.innerHTML.match(/Aus (.*)</)[1];
				var eu = isInEu(country);
    }
		
		// Get currency
		var euros = !items[i].querySelector('ul.conprices');
		// Get Global Shipping Partner
		var gsp = !!items[i].querySelector('div.epli');
    
		//url = items[i].querySelector('a.s-item__link').href; console.log(url);
    console.log('euros: ' + euros + ', gsp: ' + gsp + ', eu: ' + eu + ', country: ' + country);
    //if(gsp){console.log('euros: ' + euros + ', gsp: ' + gsp + ', eu: ' + eu + ', country: ' + country);}
		
		// Get price and shipping
		if( items[i].querySelector('li.lvshipping').textContent.match(/Keine Angaben zum Versand/) ) {
			items[i].className += ' unsortable';
			continue;
		}
		if (!items[i].querySelector('div.stk-thr')) { // ### ZWECK? 190105
			var price = parseFloat(items[i].querySelector('li.lvprice').innerHTML.replace(/\.([0-9]+),/g,'$1,').match(/[0-9]+[,.][0-9]{2}/)[0].replace(',','.'));
			if (items[i].querySelector('li.lvshipping span.bfsp')) {
				var shipping = 0.0;
			} else {
				var shipping = parseFloat(items[i].querySelector('span.ship').innerHTML.replace(/\.([0-9]+),/g,'$1,').match(/[0-9]+[,.][0-9]{2}/)[0].replace(',','.'));
			}
		}
    console.log('price: ' + price +', shipping: '  + shipping);
		//if(gsp){console.log('price: ' + price +', shipping: '  + shipping);}
		
		// Calculate total fees
		if( !euros ) {
			var feeConv = (price + shipping) * 0.037; // siehe (paypal statistic)
		} else {
			var feeConv = 0.0;
		}
		if ( !eu && !gsp && (feeConv + price + shipping > 22.0) ) {
			var feeCustoms = (feeConv + price + shipping) * 0.19;
		} else if( gsp ) {
			itemUrl = items[i].querySelector('a.vip').href + '&nordt=true&orig_cvip=true';
      //console.log(itemUrl);
			numGsp += 1;
			(function(i){
				GM.xmlHttpRequest({
					method: 'GET',
					url: itemUrl,
					onload: function(response) {
            console.log('hi! from onload for item: ' + i);
						var responseXML = new DOMParser().parseFromString(response.responseText, "text/html");
            if(responseXML.getElementById('prcIsum')) {
            	var usdPrice = parseFloat(responseXML.getElementById('prcIsum').innerHTML.replace(/\.([0-9]+),/g,'$1,').match(/[0-9]+[,.][0-9]{2}/)[0].replace(',','.'));
            } else {
            	var usdPrice = parseFloat(responseXML.getElementById('mm-saleDscPrc').innerHTML.replace(/\.([0-9]+),/g,'$1,').match(/[0-9]+[,.][0-9]{2}/)[0].replace(',','.'));
            }
						var usdCustoms = parseFloat(responseXML.getElementById('impchCost').innerHTML.replace(/\.([0-9]+),/g,'$1,').match(/[0-9]+[,.][0-9]{2}/)[0].replace(',','.'));
						var usdShipping = parseFloat(responseXML.getElementById('fshippingCost').innerHTML.replace(/\.([0-9]+),/g,'$1,').match(/[0-9]+[,.][0-9]{2}/)[0].replace(',','.'));
						var eurShipping = parseFloat(responseXML.getElementById('convetedPriceId').innerHTML.replace(/\.([0-9]+),/g,'$1,').match(/[0-9]+[,.][0-9]{2}/)[0].replace(',','.'));
						var eurPrice = parseFloat(responseXML.getElementById('prcIsumConv').innerHTML.replace(/\.([0-9]+),/g,'$1,').match(/[0-9]+[,.][0-9]{2}/)[0].replace(',','.'));
						var eurCustoms = usdCustoms * (eurShipping + eurPrice) / (usdShipping + usdPrice);
						var eurConv = (eurPrice + eurShipping + eurCustoms) * 0.037;
            
            console.log({i:i,usdCustoms:usdCustoms,usdShipping:usdShipping});
						setCosts(i, eurPrice, eurShipping, eurConv, eurCustoms);
						
						numGspProcessed += 1;
						console.log(responseXML.URL + ' ' + numGspProcessed + '/' + numGsp)
						btn_gesamtpreise.innerHTML = numGspProcessed + ' / ' + numGsp;
						if(numGspProcessed == numGsp) {
							cb();
						}
					}
				});
			})(i);
		} else {
			var feeCustoms = 0.0;
		}
    
    if(gsp){console.log('itm ' + i + ': ' + itemUrl.match(/\/([0-9]{12})\?/)[1] + ', eu: ' + eu + ', feeCustoms: ' + feeCustoms + ', feeconv: ' + feeConv);}
    if(!gsp){console.log('itm ' + i + ', eu: ' + eu + ', feeCustoms: ' + feeCustoms + ', feeconv: ' + feeConv);}
    
		if(!gsp) {
			setCosts(i, price, shipping, feeConv, feeCustoms);
		}
	}
	console.log(numGsp);
	if(numGsp == 0) {
		cb();
	}
}

function setCosts(numItem, price, shipping, feeConv, feeCustoms) {
	text = '<style>table tr td.placeholder {width: 5px;}</style><table class="ship">' + 
		'<tr class="fee"><td>+</td><td>EUR ' + shipping.toFixed(2).toString().replace('.',',') + '</td><td class="placeholder"/><td >Versand</td></tr>'
	if(feeCustoms) {
		text += '<tr class="fee"><td>+</td><td>EUR ' + feeCustoms.toFixed(2).toString().replace('.',',') + '</td><td class="placeholder"/><td>Einfuhrabgaben</td></tr>';
	}
	if(feeConv) {
		text += '<tr class="fee"><td>+</td><td>EUR ' + feeConv.toFixed(2).toString().replace('.',',') + '</td><td class="placeholder"/><td>Wechselgebühren</td></tr>'
	}
	text += '<tr><td colspan="3" style="border-bottom: solid 1px black"></tr>';
	text += '<tr class="fee gesamtpreis"><td/><td colspan="2"><b>EUR ' + (price + shipping + feeConv + feeCustoms).toFixed(2).toString().replace('.',',') + '</td></tr>';
	text += '</table>';
	//console.log(items[numItem]);
	items[numItem].querySelector('ul.lvprices li.lvshipping').innerHTML = text;
}

function sortTable() {
  console.log('sortTable() says hi!');
  btn_gesamtpreise.innerHTML = 'sorting...';

	lists = document.querySelectorAll('#ListViewInner');
	numLists = lists.length;
	
	valFun = function(item){return item.querySelector('.gesamtpreis').innerHTML.replace(/\.([0-9]+),/g,'$1,').replace(/.*?([0-9]+),([0-9]{2}).*/,'$1.$2'); };
	valFunUnsortable = function(item){ return item.querySelector('span.s-item__price').innerHTML.replace(/\.([0-9]+),/g,'$1,').replace(/.*?([0-9]+),([0-9]{2}).*/,'$1.$2'); };
	
	for(var i = 0; i < numLists; i++) {
		var listItems = Array.prototype.slice.call(lists[i].querySelectorAll('#ListViewInner > li'), 0);
		listItems = listItems.sort(function (a, b) { // sort rows
			if(a.className.match(/\bunsortable\b/) && !b.className.match(/\bunsortable\b/)) {
        return 1;
			} else if (!a.className.match(/\bunsortable\b/) && b.className.match(/\bunsortable\b/)) {
				return -1;
			} else if (a.className.match(/\bunsortable\b/) && b.className.match(/\bunsortable\b/)) {
				return valFunUnsortable(a) - valFunUnsortable(b);
			} else {
				return valFun(a) - valFun(b);
			}
		})
		for(var j = 0; j < listItems.length; j++) {
			lists[i].appendChild(listItems[j]); // append each row in order
		}
	}
	disable_gesamtpreise_button();
}

function disable_gesamtpreise_button() {
	btn_gesamtpreise.innerHTML = 'Gesamtpreise';
	btn_gesamtpreise.disabled = true;
}

function isInEu(country) {
	var euCountries = ['Belgien', 'Griechenland', 'Malta', 'Slowenien', 'Bulgarien', 'Irland', 'Niederlande', 'Slowakei', 'Dänemark', 'Italien', 'Österreich', 'Spanien', 'Deutschland', 'Kroatien', 'Polen', 'Tschechien', 'Estland', 'Lettland', 'Portugal', 'Ungarn', 'Finnland', 'Litauen', 'Rumänien', 'Vereinigtes Königreich', 'Frankreich', 'Luxemburg', 'Schweden', 'Zypern', 'Großbritannien', 'Tschechische Republik'];
	
	for(var i = 0; i < euCountries.length; i++) {
		if(country == euCountries[i]) {
			return true;
		}
	}
	return false;
}

function to_csv() {
	// run gesamtpreise, if it hasn't already...
	if (!btn_gesamtpreise.disabled) {
		gesamtpreise('', to_csv_main);
	} else {
		to_csv_main()
	}
}
	
function to_csv_main() {
	csv = '';
	for(var i = 0; i < numItems; i++){
		// Get country and EU
		fromCountry = items[i].querySelector('.lvdetails');
		var country = 'Deutschland';
		var eu = true;
		if(fromCountry.innerHTML.match(/Aus (.*)/)) {
				var country = fromCountry.innerHTML.match(/Aus (.*)</)[1];
				var eu = isInEu(country);
    }
    
		// Get properties
		var item_name = items[i].querySelector('h3.lvtitle a').innerHTML.replace(/<wbr>/g,'');
		var item_number = items[i].querySelector('a.vip').href.match(/\/([0-9]{12})\?/)[1];
		//console.log(item_number);
		try {
      //console.log(items[i].querySelector('span.tme').textContent.replace(/\./g,'')); 
			var end_date = parse_date(items[i].querySelector('span.tme span').textContent.replace(/\./g,''));
		} catch(e) {
			var end_date = '';
		}
		try {
			var num_bids = items[i].querySelector('li.lvformat').textContent.match(/[0-9]+/)[0];
		} catch(e) {
			var num_bids = 'Sofortkauf';
		}
		var preis = items[i].querySelector('li.lvprice span.bidsold').textContent.match(/[0-9]+,[0-9]+/)[0];
		try {
			var gesamtpreis = items[i].querySelector('.gesamtpreis').textContent.match(/[0-9]+,[0-9]+/)[0];
		} catch(e) {
			var gesamtpreis = 'N/A';
		}
		//console.log(items[i].querySelector('.lvdetails').textContent);
		var seller = items[i].querySelector('ul.lvdetails').textContent.match(/Verkäufer: (.+)/)[1].trim().replace('(',' (');
		//var country - above
		//var eu - above
		
		csv += item_name + '\t' +
			  item_number + '\t' + 
			  end_date + '\t' + 
			  num_bids + '\t' + 
			  preis + '\t' + 
			  gesamtpreis + '\t' + 
			  seller + '\t' + 
			  country + '\t' + 
			  eu + '\r\n';
		console.log(csv);
	}
	copyToClipboard(csv);
	btn_csv.disabled = true;
}

function parse_date(string_date) {		
  console.log(string_date);
  var d = new Date();
  date_array = string_date.split(' ');
  date_array.splice(2, 0, d.getFullYear());
  string_date = date_array.join(' ');
  console.log(string_date);
	var date_parsed = new Date(string_date.replace('Mär','Mar').replace('Mai','May').replace('Okt','Oct').replace('Dez','Dec'));
	return date_parsed.toLocaleDateString('de-DE') + ' ' + date_parsed.toLocaleTimeString('de-DE');
}

function copyToClipboard(text) {
	var textarea = document.createElement('textarea');
	textarea.type = 'textarea';
	textarea.innerHTML = text;
	
	var e = document.querySelector('#loczip');
	if (e) e.insertBefore(textarea, e.firstChild);
	textarea.addEventListener('keyup', function(){textarea.parentNode.removeChild(textarea);}, false);
	
	textarea.select()
	textarea.focus()
}