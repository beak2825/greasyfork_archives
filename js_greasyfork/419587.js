// ==UserScript==
// @name         Aliexpress min price firefox test
// @namespace    https://greasyfork.org/en/scripts/374715-aliexpress-min-price
// @version      0.2.4
// @author       Mateusz Kula
// @description  Update minimum available price
// @icon         https://kulam.pl/script/aliexpress-min%20price/icon.jpg
// @icon64       https://kulam.pl/script/aliexpress-min%20price/icon.jpg
// @supportURL   https://kulam.pl/kontakt
// @match        http://*.aliexpress.com/*
// @match        https://*.aliexpress.com/*
// @grant        GM_registerMenuCommand
// @grant        GM_xmlhttpRequest
// @homepageURL  https://kulam.pl

// @downloadURL https://update.greasyfork.org/scripts/419587/Aliexpress%20min%20price%20firefox%20test.user.js
// @updateURL https://update.greasyfork.org/scripts/419587/Aliexpress%20min%20price%20firefox%20test.meta.js
// ==/UserScript==

var displaySwitch = true; //show min price [true/false]
var replaceSwitch = false; //deprecated! replace aliexpress min price [true/false]
var alertSwitch = true; //show min price and quantity, [true/false]
var showCheapestVariantName = true;//show names of cheaper item

var cheapestVariantName = [];
var loaded = false;
window.addEventListener('load', function () {
	loaded = true;
	var skuProducts = runParams.data.skuModule.skuPriceList;
	if (alertSwitch || displaySwitch || showCheapestVariantName) {
		var first = true;
		for (var counter = 0; counter < skuProducts.length; counter++) {
			if (+skuProducts[counter].skuVal.availQuantity > 0) {
				if (first)//set first available item price as min
				{
					var price = null;
					if (skuProducts[0].skuVal.actSkuMultiCurrencyCalPrice > 0) { price = 'actSkuMultiCurrencyCalPrice'; }
					else {
						price = 'skuMultiCurrencyCalPrice';
					}

					var mini = +skuProducts[counter].skuVal[price]; var quantity = +skuProducts[counter].skuVal.availQuantity; first = false;
					cheapestVariantName.push(skuProducts[counter].skuAttr);
				}
				else {
					if (+skuProducts[counter].skuVal[price] <= mini)//found lower/the same price price
					{
						if (+skuProducts[counter].skuVal[price] < mini)//lower price
						{
							mini = +skuProducts[counter].skuVal[price]; quantity = +skuProducts[counter].skuVal.availQuantity;
							cheapestVariantName = [];
							cheapestVariantName.push(skuProducts[counter].skuAttr);
						}
						else//same price
						{
							quantity += +skuProducts[counter].skuVal.availQuantity;
							cheapestVariantName.push(skuProducts[counter].skuAttr);
						}
					}
				}
			}
		}
	}
	if (displaySwitch && +mini > 0) {
		var productPriceCurrent = document.querySelector('div.product-price-current');
		var miniNode = document.createTextNode("[" + mini + "] ");
		productPriceCurrent.insertBefore(miniNode, productPriceCurrent.childNodes[0]);
	}
}, false);
function formatSkuAttr(skuAttr) {
	let name = "";
	const specs = skuAttr.split(';');
	specs.forEach(function (spec) {
		const specName = spec.split('#');
		if (specName.length == 2) { name += specName[1] + " | "; }
		else { name += "name not found "; }
	});
	return name
}

GM_registerMenuCommand('Ali min price', function find() {
	if (alertSwitch) {
		var minPriceAlertMessage = "";
		if (loaded) {
			if (first == true) { minPriceAlertMessage = "not found\n"; }
			else {
				minPriceAlertMessage = "minimum price: " + mini + "\nquantity: " + quantity + "\n Variants:\n";
				cheapestVariantName.forEach(function (variantName) {
					minPriceAlertMessage += formatSkuAttr(variantName) + "\n";
				});
			}
		}
		else {
			minPriceAlertMessage = "Wait for page to load";
		}
		alert(minPriceAlertMessage);
	}

}, 'q');