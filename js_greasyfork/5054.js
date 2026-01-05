// ==UserScript==
// @name        eBay - Gesamtpreis Items
// @namespace   conquerist2@gmail.com
// @include     http://www.ebay.de/itm/*
// @description eBay.de - Gesamtpreis auf Artikelseiten
// @version     1.3
// @grant       none
// @downloadURL https://update.greasyfork.org/scripts/5054/eBay%20-%20Gesamtpreis%20Items.user.js
// @updateURL https://update.greasyfork.org/scripts/5054/eBay%20-%20Gesamtpreis%20Items.meta.js
// ==/UserScript==
// 2016 12 18 v1.3 -- fix for new span
// 2014 10 14 v1.2 -- use correct price on auctions
// 2014 10 02 v1.1 -- changed paypal conversion fee from 2.5% to 3.5%


try {
	var usdCustoms = parseFloat(document.getElementById('impchCost').innerHTML.replace('.','').match(/[0-9]+,[0-9]{2}/)[0].replace(',','.'));
} catch(e) {
	var usdCustoms = 0.0;
}
var gsp = !!usdCustoms;
try {
	var usdShipping = parseFloat(document.getElementById('fshippingCost').innerHTML.replace('.','').match(/[0-9]+,[0-9]{2}/)[0].replace(',','.'));
} catch(e) {
	var usdShipping = 0.0;
}
try {
	var eurShipping = parseFloat(document.getElementById('convetedPriceId').innerHTML.replace('.','').match(/[0-9]+,[0-9]{2}/)[0].replace(',','.'));
} catch(e) {
	var eurShipping = 0.0;
}
try {
	var eurPrice = parseFloat(document.getElementById('prcIsumConv').innerHTML.replace('.','').match(/[0-9]+,[0-9]{2}/)[0].replace(',','.'));
} catch(e) {
	var eurPrice = 0.0;
}

var euro = !eurPrice;
try {
	var usdPriceHtml = document.getElementById('prcIsum').innerHTML;
	var usdPrice = parseFloat(document.getElementById('prcIsum').innerHTML.replace('.','').match(/[0-9]+,[0-9]{2}/)[0].replace(',','.'));
} catch(e) {
	try { // auction
	var usdPriceHtml = document.getElementById('prcIsum_bidPrice').innerHTML;
	var usdPrice = parseFloat(document.getElementById('prcIsum_bidPrice').innerHTML.replace('.','').match(/[0-9]+,[0-9]{2}/)[0].replace(',','.'));
	} catch(e) {
		var usdPrice = 0.0;
	}
}
if (eurPrice) {
	var price = eurPrice;
} else {
	var price = usdPrice;
}
if (eurShipping) {
	var shipping = eurShipping;
} else {
	var shipping = usdShipping;
}
// EU
var e = document.querySelector('.iti-eu-bld-gry span')
var eu = true;
if(e) {
	var country = e.innerHTML.split(', ').slice(-1);;
	eu = isInEu(country);
}
var feeConv = 0, eurCustoms = 0;
var ttFeeConv = '', ttEurCustoms = '';
if (!eu && !euro && gsp) {
	eurCustoms = usdCustoms * eurShipping / usdShipping;
	ttEurCustoms = usdCustoms.toFixed(2).toString() + ' USD * (' + eurShipping.toFixed(2).toString() + ' EUR / ' +  usdShipping.toFixed(2).toString() + ' USD)';
	feeConv = (price + shipping + eurCustoms) * 0.035;
	ttFeeConv = '(' + price.toFixed(2).toString() + ' + ' + shipping.toFixed(2).toString() + ' + ' + eurCustoms.toFixed(2).toString() + ') * 0,035 = ' + feeConv.toFixed(2).toString();
} else if (!euro && !gsp) {
	feeConv = (price + shipping) * 0.035;
	ttFeeConv = '(' + price.toFixed(2).toString() + ' + ' + shipping.toFixed(2).toString() + ') * 0,035 = ' + feeConv.toFixed(2).toString();
}
if (!eu && !gsp && (feeConv + price + shipping) > 22.0) {
	eurCustoms = (feeConv + price + shipping) * 0.19;
	ttEurCustoms = '(' + price.toFixed(2).toString() + ' + ' + shipping.toFixed(2).toString() + ' + ' + feeConv.toFixed(2).toString() + ') * 0,19 = ' + eurCustoms.toFixed(2).toString();
}
//console.log(ttEurCustoms);
//console.log(ttFeeConv);

var style = document.createElement('style');
style.innerHTML = 'table {font-size: 16px;} table.converted {font-style: italic;} table tr td.placeholder {width: 5px;} table tr td.align-right {text-align: right;} table tr.bold td {font-weight: bold;}';
var table = document.createElement('table');
if(eurPrice) {
	table.className = 'converted';
}
text = '<tr class="fee bold"><td class="placeholder"/><td class="placeholder"/><td>EUR</td><td class="placeholder"/><td class="align-right"> ' + price.toFixed(2).toString().replace('.','</td><td>,') + '</td><td class="placeholder"/>' 
if(eurPrice) {
	text += '<td style="font-style: normal; font-size: 11px;">(' + usdPriceHtml + ')</td>';
} else {
	text += '<td/>';
}
text += '</tr>' + 
		'<tr class="fee"><td>+</td><td class="placeholder"/><td>EUR</td><td class="placeholder"/><td class="align-right"> ' + shipping.toFixed(2).toString().replace('.','</td><td>,') + '</td><td class="placeholder"/><td >Versand</td></tr>';
if(eurCustoms) {
	text += '<tr class="fee" title="' + ttEurCustoms.replace(/\./g,',') + '"><td>+</td><td class="placeholder"/><td>EUR</td><td class="placeholder"/><td class="align-right">' + eurCustoms.toFixed(2).toString().replace('.','</td><td>,') + '</td><td class="placeholder"/><td>Einfuhrabgaben</td></tr>';
}
if(feeConv) {
	text += '<tr class="fee" title="' + ttFeeConv.replace(/\./g,',') + '"><td>+</td><td class="placeholder"/><td>EUR</td><td class="placeholder"/><td class="align-right">' + feeConv.toFixed(2).toString().replace('.','</td><td>,') + '</td><td class="placeholder"/><td>Wechselgebühren</td></tr>';
}
text += '<tr colspan="3" style="border-bottom: solid 1px black">';
text += '<tr class="fee gesamtpreis bold"><td/><td class="placeholder"/><td>EUR</td><td class="placeholder"/><td class="align-right"> ' + (price + shipping + feeConv + eurCustoms).toFixed(2).toString().replace('.','</td><td>,') + '</td></tr>';
table.innerHTML = text;

var e = document.querySelector('td.vi-bboxrev-cntrcell > div.u-cb:nth-child(2)');
if(e) {
	//var btn = e.querySelector('.u-flL');
	e.innerHTML += '<div class="u-cb spcr vi-bbox-spcr10"></div>';
	e.appendChild(style);
	e.appendChild(table);
	//e.appendChild(btn);
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
