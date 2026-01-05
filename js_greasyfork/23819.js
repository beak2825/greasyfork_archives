// ==UserScript==
// @name JPGroupScan
// @namespace http://www.utzon.se/
// @icon http://www.jpgroupclassic.dk/media/1017/icon.png?anchor=center&mode=crop&width=58&height=58&rnd=131777746540000000
// @description Scan article numbers present on JPGroup article page.
// @version 1.8
// @include *://www.jpgroupclassic.dk/produkt/*
// @grant GM.xmlHttpRequest
// @downloadURL https://update.greasyfork.org/scripts/23819/JPGroupScan.user.js
// @updateURL https://update.greasyfork.org/scripts/23819/JPGroupScan.meta.js
// ==/UserScript==


var refNumbers = [],
apps = [],
matchIds = [],
matchLinks = [],
itemIds = [],
inPrices = [];

var jpNumber, oeNumber, oldNumber, weight, price, imgSrc, name;
var productPage = document.getElementsByClassName("product")[0];

var productSlider = productPage.getElementsByClassName("product-slider")[0];
var productImage = productSlider.getElementsByTagName("img")[0];

var productHeader = productPage.getElementsByClassName("header")[0];
var productInfo = productPage.getElementsByClassName("product-info")[0];
var productPrice = productInfo.getElementsByClassName("price")[0];
var productData = productInfo.getElementsByClassName("product-data")[0].children[0].children[0];
for (var i = 0; i < productData.children.length; i++) {
	var row = productData.children[i];
	var fields = row.children;
	
	var key = fields[0].textContent;
	var value = fields[1];
	if(key.includes("JP GROUP")) {
		console.log("JPG number: " + value.textContent.trim());
		jpNumber = value;
	}
	else if(key.includes("OE ")) {
		console.log("OE number: " + value.textContent.trim());
		oeNumber = value;
	}
	else if(key.includes(" JP ")) {
		console.log("Old number: " + value.textContent.trim());
		oldNumber = value;
	}
	else if(key.includes("(KG)")) {
		console.log("Weight: " + value.textContent.replace(",", "."));
		weight = value;
	}
}

if(jpNumber) refNumbers.push(jpNumber.textContent.trim());
if(oeNumber) refNumbers.push(oeNumber.textContent.trim());
if(oldNumber) refNumbers.push(oldNumber.textContent.trim());

if(productImage) {
	imgSrc = productImage.src;
	console.log("Image source: " + imgSrc);
}

if(productPrice && productHeader) {
	name = productHeader.innerText.trim();
	price = parseFloat(productPrice.textContent.replace(/[^\d,]*/g, "").replace(",", ".")) || 0;
	// Create
	var createButton = document.createElement("button");

	createButton.id = "utzon_create_button";
	createButton.innerHTML = "CREATE NEW";
	createButton.className = "btn";
	createButton.addEventListener('click', function() {
		if(itemIds.length > 0) {
			if(confirm("There are matching items already.\nAre you sure you wish to create a new item?"))
				postItemData('create');
		}
		else {
			postItemData('create');
		}
	});
	createButton.title = "Creates new item.";
	createButton.type = "button";

	// Update button
	var updateButton = document.createElement("button");

	updateButton.id = "utzon_update_button";
	updateButton.innerHTML = "UPDATE";
	updateButton.className = "btn";
	updateButton.style.display = "none";
	updateButton.addEventListener('click', function() {
		var itemId = 0;
		var select = document.getElementById("utzon_item_id");
		if(select)
			itemId = parseInt(select.value);
		postItemData('update', itemId);
	});
	updateButton.title = "Updates specified item.";
	updateButton.type = "button";

	// Select update ID
	var itemSelect = document.createElement("Select");

	itemSelect.style.display = "none";
	itemSelect.id = "utzon_item_id";
	itemSelect.className = "btn";
	itemSelect.addEventListener('change', function(){
		updateDBPrice(this.value);
	});

	// Add all to DOM
	var block = document.createElement("div");

	block.appendChild(createButton);
	block.appendChild(updateButton);
	block.appendChild(itemSelect);

	productHeader.appendChild(block);
}



var postItemData = function(operation, itemId = 0) {
	GM.xmlHttpRequest({
		method: "POST",
		url: "http://old.utzon.se/red/php/addJPItem.php",
		data: JSON.stringify({ 
			p: "additemplease", 
			operation: operation,
			itemId: itemId,
			name: name,
			weight: weight.textContent.replace(",", "."),
			price: price,
			imgSrc: imgSrc,
			numbers: refNumbers,
			jpNumber: jpNumber.textContent.trim(),
			oeNumber: oeNumber.textContent.trim(),
			apps: apps
		}),
		headers: { "Content-Type": "application/json" },
		onload: function(response) {
			if(response.status != 200)
				return alert("Error: Status " + response.status);
			var parsed = JSON.parse(response.responseText);
			if(parsed.err)
				return alert("Error: " + parsed.err);
			if(confirm((parsed.create ? "Created" : "Updated") + " item #" + parsed.itemId + ".\n\n" +
				"Weight: " + parsed.weight + " grams.\n" +
				"Out Price: " + parsed.outPrice + ":-.\n" +
				"In Price: " + parsed.inPrice + "€.\n" +
				"Porsche No: " + parsed.itemPorscheNo + ".\n" + 
				"Supplier No: " + parsed.itemSupplierNo + ".\n" + 
				"Image Added: " + (parsed.image ? "Yes" : "No") + ".\n\n" +
				"Cars;\n\t" + parsed.cars.join(".\n\t") + ".")) {
				
				window.location.reload();
			}
		}
	});
};


function updateDBPrice(itemId) {
	var dbPrice = document.getElementById("utzon_db_price"),
	inPrice = inPrices[itemId] || 0;
	if(!dbPrice) return;
	dbPrice.innerHTML = inPrice > 0 ? "DB " + inPrice : "DB NONE";
	if(inPrice <= 0)
		dbPrice.style.color = "#940010";
	else if(inPrice != price)
		dbPrice.style.color = "#949410";
	else
		dbPrice.style.color = "#319400";
}

function arrayExists(arr, val)
{
	for (var i = arr.length - 1; i >= 0; i--) {
		if (arr[i] == val)
			return true;
	}
	return false;
}

function addReference(tr, reference) {
	let td = document.createElement("td");
	if(reference) {
		var ids = matchIds[reference];
		if(ids) {
			for (var i = 0; i < ids.length; i++) {
				let id = ids[i];
				let itemLink = document.createElement("a");
				itemLink.href = "http://old.utzon.se/admin/sok/redigera_artikel/" + id;
				itemLink.style.margin = "4px";
				itemLink.target = "_blank";
				itemLink.innerHTML = id;
				td.appendChild(itemLink);
				if(!arrayExists(itemIds, id))
					itemIds.push(id);
			}
		}
		var links = matchLinks[reference];
		if(links) {
			for (var l = 0; l < links.length; l++) {
				let link = links[l];
				let petLink = document.createElement("a");
				petLink.href = link;
				petLink.style.margin = "4px";
				petLink.target = "_blank";
				petLink.innerHTML = "PET";
				td.appendChild(petLink);
			}
		}
	}
	tr.appendChild(td);
}
GM.xmlHttpRequest({
	method: "POST",
	url: "http://old.utzon.se/red/php/checkJPNumbers.php",
	data: JSON.stringify({ p: "checkthesenumbersplease", numbers: refNumbers}),
	headers: { "Content-Type": "application/json" },
	onload: function(response) {
		if(response.status != 200)
			return console.log("Error: Status " + response.status);
		var parsed = JSON.parse(response.responseText);
		matchIds = parsed.matchIds || [];
		matchLinks = parsed.matchLinks || [];
		inPrices = parsed.inPrices || [];

		var header = document.createElement("th");
		header.innerHTML = "Item";
		/*loopTable("ContentPlaceHolderDefault_cp_content_ctl00_Product_view_13_grdSeeAllRefs", function(row) {
			row.appendChild(header);
		}, "kurv-headers2");*/

		if(jpNumber) addReference(jpNumber.parentNode, jpNumber.textContent.trim());
		if(oeNumber) addReference(oeNumber.parentNode, oeNumber.textContent.trim());
		if(oldNumber) addReference(oldNumber.parentNode, oldNumber.textContent.trim());

		var selectItemId = document.getElementById("utzon_item_id");
		var buttonUpdate = document.getElementById("utzon_update_button");
		var dbPrice = document.createElement("span");
		if(productPrice && itemIds.length > 0)
		{
			selectItemId.style.display = "initial";
			buttonUpdate.style.display = "initial";
			for (var i = 0; i < itemIds.length; i++) {
				let option = document.createElement("option");
				option.innerHTML = itemIds[i];
				option.value = itemIds[i];
				selectItemId.appendChild(option);
			}
		}

		if(productPrice) {
			dbPrice.id = "utzon_db_price";
			dbPrice.className = "header";
			dbPrice.style = "font-weight: 700; font-size: 24px;";
			dbPrice.title = "The price stored in our database.";

			productPrice.parentNode.insertBefore(dbPrice, productPrice);
			productPrice.parentNode.insertBefore(document.createElement("br"), productPrice);

			updateDBPrice(selectItemId.value);
		}
	}
});