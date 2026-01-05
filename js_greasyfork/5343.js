// ==UserScript==
// @name          eBay - Display Totals with Shipping
// @namespace     http://www.facebook.com/Tophness
// @description	Computes and displays the total price with shipping added. Inserts prices for all the extra options that may be included in the eBay page. Makes a new column that shows the final price for both the BuyItNow and Shipping price.  Note: Only tested on ebay AU.
// @include       http://*.ebay.tld/*sch/*
// @include       http://*.ebay.tld/*i.html?*
// @version 0.0.1.20140928141320
// @downloadURL https://update.greasyfork.org/scripts/5343/eBay%20-%20Display%20Totals%20with%20Shipping.user.js
// @updateURL https://update.greasyfork.org/scripts/5343/eBay%20-%20Display%20Totals%20with%20Shipping.meta.js
// ==/UserScript==

var total = 0;
var crapfilteron = false;
var crapfilter = ['cable', 'adapter', 'case', 'only', 'protector', 'cord', 'guard'];
var urls = [];
var vurls = {};
var purls = {};
var ListingsRows = [];
var currencySymbol = '$'; //default to dollars
var price = /\$([\d\,]*.\d\d)/; // regexp to test for currency
var shippingText = 'Shipping';
var hostSplit = location.host.split ('.');
var tld = hostSplit [hostSplit.length - 1];
switch (tld) {
case 'uk':
	currencySymbol = '£';
	price = /£([\d\,]*.\d\d)/;
	shippingText = 'Postage';
	break;
}
FindAllRows();

function FindAllRows() {
	var allElements = document.getElementsByTagName('li');
	for (var i = 0; i < allElements.length; ++i) {
		if (allElements[i].outerHTML.indexOf('listingid=') != -1) {
			ListingsRows.push(allElements[i]);
		}
	}
	
	total = ListingsRows.length;
	if (ListingsRows.length > 0) {
		for (var i = 0; i < ListingsRows.length; ++i) {
			WorkOnRow(ListingsRows[i]);
		}
	}
}

function WorkOnRow(RowElement) {
	var buyItNowPrice = -1;
	var shippingPrice = -1;
	var allElements = RowElement.getElementsByTagName('ul');

	for (var i = 0; i < allElements.length; ++i) {
		if (allElements[i].className.indexOf("lvprices") != -1) {
			var pricedivs = allElements[i].getElementsByTagName('div');
			if (pricedivs.length > 0){
				for (var k = 0; k < pricedivs.length; ++k) {
					if(pricedivs[k].className == "cmpat"){
						pricedivs[k].parentNode.removeChild(pricedivs[k]);
					}
				}
			}
			var spans = allElements[i].getElementsByTagName('span');
			var buyItNow;
			var shipping;
			var tc;
			if(spans.length > 0){
				for (var j = 0; j < spans.length; ++j) {
					tc = spans[j].textContent;
					if (spans[j].className == "fee") {
						shipping = spans[j];
						if (/Free/.test (tc) || (/Digital delivery/.test(tc))) {
							shippingPrice = 0;
						} else if (/Not specified/.test(tc)) {
							shippingPrice = '?';
						} else if (price.test(tc)){
							shippingPrice = tc.match(price)[1].replace(',','');
						}
					}
					else if (spans[j].className == 'g-b') {
						buyItNow = spans[j];
						buyItNowPrice = tc.match(price)[1].replace(',','');
					}
				}
			}
			var buyItNowTotal;
			if (buyItNowPrice != -1 && shippingPrice != -1) {
				if(isNaN(buyItNowPrice) || isNaN(shippingPrice)){
					buyItNowTotal = "?";
				}
				else{
					buyItNowTotal = (parseFloat(buyItNowPrice) + parseFloat(shippingPrice)).toFixed(2);
				}
				buyItNow.innerHTML = buyItNow.innerHTML.substring(0, buyItNow.innerHTML.indexOf('</b>') + 4) + buyItNowTotal;
				shipping.innerHTML = '<b>$' + buyItNowPrice + '</b> + ' + shipping.innerHTML.substring(shipping.innerHTML.indexOf('$'));
			}
		}
		else if(allElements[i].className.indexOf("lvdetails") != -1){
			allElements[i].innerHTML = "";
		}
	}
	if (buyItNowPrice != -1) {
		purls[RowElement.getElementsByTagName('a')[0].href] = buyItNowPrice;
		ajaxsubmit(RowElement.getElementsByTagName('a')[0].href);
	}
}

function checkloaded(url){
	urls.push(url);
	if(urls.length == total){
		checkurls();
	}
}

function checkurls(){
	for (var i = 0; i < ListingsRows.length; ++i) {
		var curl = ListingsRows[i].getElementsByTagName('a')[0];
		if(curl != null){
			var viddata = vurls[curl.href];
			if(viddata){
				var lruls = ListingsRows[i].getElementsByTagName('ul');
				for (var j = 0; j < lruls.length; ++j) {
					if(lruls[j].className.indexOf("lvdetails") != -1){
						var el = document.createElement('div');
						el.innerHTML = viddata;
						lruls[j].appendChild(el);
					}
				}
			}
		}
	}
}

function ajaxsubmit(url)
{
	var mygetrequest=new ajaxRequest();
	mygetrequest.onreadystatechange=function(){
		if (mygetrequest.readyState==4){
			if (mygetrequest.status==200){
				var rdata = mygetrequest.responseText;
				var varipoint = rdata.indexOf('"itmVarModel":{"key":"ItemVariations"');
					if(varipoint != -1){
						var varidata = rdata.substring(varipoint);
						varidata = '{' + varidata.substring(0, varidata.indexOf('"unavailableVariationIds"')-1) + '}}';
						var finaldata = "";
						var varijson = JSON.parse(varidata)["itmVarModel"];
						var mmodels = varijson.menuModels;
						for(var m=0;m<mmodels.length;m++){
							finaldata += "<br><b>" + mmodels[m].displayName + "</b><br>";
							if(mmodels[m].menuItemValueIds){
								var itemmap = mmodels[m].menuItemValueIds;
								for(var i=0;i<itemmap.length;i++){
									if(varijson.menuItemMap[i]){
										var optname = varijson.menuItemMap[i].displayName;
										if(crapfilteron){
											for(var oi=0;oi<crapfilter.length;oi++){
												if(optname.indexOf(crapfilter[oi]) != -1){
													return;
												}
											}
										}
										var matchids = varijson.menuItemMap[i].matchingVariationIds;
										for(var j=0;j<matchids.length;j++){
											var convertedPrice;
											if(varijson.itemVariationsMap[matchids[j]].convertedPrice){
												convertedPrice = varijson.itemVariationsMap[matchids[j]].convertedPrice;
											}
											else{
												convertedPrice = varijson.itemVariationsMap[matchids[j]].price;
											}
											var currency = convertedPrice.substring(0, convertedPrice.indexOf('$') + 1);
											convertedPrice = convertedPrice.substring(convertedPrice.indexOf('$') + 1);
											if(convertedPrice != purls[url]){
												finaldata += optname + ' = ' + currency + convertedPrice + "<br>";
											}
										}
									}
								}
							}
						}
						vurls[url] = finaldata;
					}
				checkloaded(url);
			}
		}
	}
	mygetrequest.open("GET", url, true);
	mygetrequest.send(null);
}

function ajaxRequest(){
 var activexmodes=["Msxml2.XMLHTTP", "Microsoft.XMLHTTP"];
 if (window.ActiveXObject){
  for (var i=0; i<activexmodes.length; i++){
   try{
    return new ActiveXObject(activexmodes[i]);
   }
   catch(e){
   }
  }
 }
 else if (window.XMLHttpRequest)
  return new XMLHttpRequest();
 else
  return false;
}