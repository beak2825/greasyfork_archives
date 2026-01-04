// ==UserScript==
// @name         Aliexpress min price
// @namespace    https://greasyfork.org/en/scripts/374715-aliexpress-min-price
// @version      0.3
// @author       Mateusz Kula
// @description  Update minimum available price
// @icon         https://kulam.pl/script/aliexpress-min%20price/icon.jpg
// @icon64       https://kulam.pl/script/aliexpress-min%20price/icon.jpg
// @supportURL   https://kulam.pl/kontakt
// @match        https://*.aliexpress.com/*
// @match        http://*.aliexpress.com/*
// @match        http://aliexpress.com/*
// @match        https://aliexpress.com/*
// @grant        GM_registerMenuCommand
// @grant        unsafeWindow
// @homepageURL  https://kulam.pl


// @downloadURL https://update.greasyfork.org/scripts/374715/Aliexpress%20min%20price.user.js
// @updateURL https://update.greasyfork.org/scripts/374715/Aliexpress%20min%20price.meta.js
// ==/UserScript==

var displaySwitch = true; //show min price [true/false]
var replaceSwitch = false; //deprecated! replace aliexpress min price [true/false]
var alertSwitch = true; //show min price and quantity, [true/false]
var showCheapestVariantName = true;//show names of cheaper item

var cheapestVariantName = [];
var skuProducts = unsafeWindow.runParams.data.skuModule.skuPriceList;
if (alertSwitch || displaySwitch || showCheapestVariantName) {
	var first = true;
	for (var counter = 0; counter < skuProducts.length; counter++) {
		if (+skuProducts[counter].skuVal.availQuantity > 0) {

			var price = null;
			if (skuProducts[counter].skuVal.skuActivityAmount && skuProducts[counter].skuVal.skuActivityAmount.value) { price = 'skuActivityAmount'; }
			else {
				price = 'skuAmount';
			}

			if (first)//set first available item price as min
			{
				var mini = +skuProducts[counter].skuVal[price].value;
				var quantity = +skuProducts[counter].skuVal.availQuantity;
				first = false;
				cheapestVariantName.push(skuProducts[counter].skuAttr);
			}
			else {
				if (+skuProducts[counter].skuVal[price].value <= mini)//found lower/the same price price
				{
					if (+skuProducts[counter].skuVal[price].value < mini)//lower price
					{
						mini = +skuProducts[counter].skuVal[price].value; quantity = +skuProducts[counter].skuVal.availQuantity;
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
var cheapestProductsNames = parseItemsAttr(cheapestVariantName);
if (displaySwitch && +mini > 0) {
	var productPriceCurrent = document.querySelector('.product-info div.product-price-current,.product-info .uniform-banner-box-price');
	var miniNode = document.createElement("span");
	miniNode.innerHTML = ('<span id="aliminprice" style="cursor: help;">[' + mini + '] </span>');
	miniNode.title = cheapestProductsNames;
	productPriceCurrent.insertBefore(miniNode, productPriceCurrent.childNodes[0]);
}

function parseItemsAttr(cheapestVariantName) {
	//arrayOfItems example: ["14:200002984#Shape28;5:361386;154:1433"]
	var items = cheapestVariantName.map(parseItemAttr);
	/*
	items example:
	[
		[
			{"Id":"14","ValueId":"200002984"},{"Id":"5","ValueId":"361386"},{"Id":"154","ValueId":"1433"}
		]
	]
	*/
	var productsNamesArray = items.map(findProductNames);
	//productNames example: ["Shape28:M:3PCS","Shape30:L:3PCS"]
	var productNamesS = productsNamesArray.join(", \n");
	return productNamesS;

}
function parseItemAttr(e, i) {
	//e example: 14:200002984#Shape28;5:361386;154:1433
	const properties = e.split(";").map(formatProp);
	return properties;
}
function formatProp(e, i) {
	var temp = e.split(":");
	var prop = { Id: temp[0], ValueId: temp[1].split("#")[0] }
	return prop;
}
function findProductNames(e, i) {
	//e example:  {"Id":"14","ValueId":"200002984"},{"Id":"5","ValueId":"361386"},{"Id":"154","ValueId":"1433"}
	var productNames = e.map(productName)
	return productNames.join(" + ");
}
function productName(e, i) {
	//e example: {"Id":"14","ValueId":"200002984"}
	//search
	var productSKUPropertyList = unsafeWindow.runParams.data.skuModule.productSKUPropertyList;
	var productSKUPropertyListElement = productSKUPropertyList.find(({ skuPropertyId }) => skuPropertyId == e.Id);
	var skuPropertyValues = productSKUPropertyListElement.skuPropertyValues.find(({ propertyValueId }) => propertyValueId == e.ValueId);
	return skuPropertyValues.propertyValueDisplayName;
}

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
		if (first == true) { minPriceAlertMessage = "not found\n"; }
		else {
			minPriceAlertMessage = "minimum price: " + mini + "\nquantity: " + quantity + "\n Variants:\n" + cheapestProductsNames;
		}
		alert(minPriceAlertMessage);
	}

}, 'q');