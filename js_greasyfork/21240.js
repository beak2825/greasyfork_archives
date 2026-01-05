// ==UserScript==
// @name        Furvilla - Price Checker
// @namespace   Shaun Dreclin
// @description Shows stall prices and sellback value of items on the quickstock and stall management pages.
// @include     /^https?://www\.furvilla\.com/stall/manage$/
// @include     /^https?://www\.furvilla\.com/inventory/quickstock$/
// @version     1.3
// @grant       GM_xmlhttpRequest
// @grant       GM_addStyle
// @grant       GM_setValue
// @grant       GM_getValue
// @downloadURL https://update.greasyfork.org/scripts/21240/Furvilla%20-%20Price%20Checker.user.js
// @updateURL https://update.greasyfork.org/scripts/21240/Furvilla%20-%20Price%20Checker.meta.js
// ==/UserScript==

GM_addStyle("\
.togglebox {\
	text-align: right;\
	font-size: 12px;\
	font-weight: bold;\
	color: rgb(14, 108, 176);\
	cursor: pointer;\
}\
.togglebox:hover {\
	text-decoration: underline;\
}\
.pricebox {\
	position: absolute;\
	right: 970px;\
	margin-top: -9px;\
	min-width: 50px;\
	padding: 0px 0px 0px 5px;\
	height: 68px;\
	border: 1px solid #daf3fc;\
	border-right: 0px;\
	border-radius: 5px 0px 0px 5px;\
	background: inherit;\
	text-align: right;\
	white-space: nowrap;\
}\
.sbbox {\
	position: absolute;\
	left: 95px;\
	margin-top: 35px;\
	width: 140px;\
	height: 20px;\
}\
")

var durpot = GM_getValue("durpot", false);
function toggleDurpot() {
	if(durpot) {
		durpot = false;
		GM_setValue("durpot", false);
		location.reload();
	} else {
		durpot = true;
		GM_setValue("durpot", true);
		location.reload();
	}
}

var everythingLoaded = setInterval(function() {
	if (document.querySelectorAll("img[src*='furvilla.com/img/items/0/']").length > 0) {
		clearInterval(everythingLoaded);
		
		var items = document.querySelectorAll("img[src*='furvilla.com/img/items/0/']");

		var togglebox = document.createElement("div");
		togglebox.className = "togglebox";
		togglebox.innerHTML = durpot ? "Price Checking with Durability/Potency": "Ignoring Durability/Potency";
		items[0].parentNode.parentNode.parentNode.parentNode.parentNode.insertBefore(togglebox, items[0].parentNode.parentNode.parentNode.parentNode);
		togglebox.onclick = function() { toggleDurpot(); }

		for(var item of items) {
			var itemID = item.src.split('furvilla.com/img/items/0/')[1].split('-')[0];
			var itemName = item.parentNode.parentNode.querySelector("td:nth-of-type(2)").innerHTML
			var itemDurability = "";
			var itemPotency = "";
			
			if(durpot) {
				if(itemName.indexOf("/") !== -1) {
					itemDurability = itemName.split("(")[1].split("/")[0];
				} else if(itemName.indexOf("%") !== -1) {
					itemPotency = itemName.split("(")[1].split("%")[0];
				}
			}

			GM_xmlhttpRequest({
				context: {item: item, itemID: itemID, itemDurability: itemDurability, itemPotency: itemPotency},
				method: "GET",
				url: "//www.furvilla.com/museum/item/" + itemID,
				onload: function(response) {
					var responseBody = document.createElement('div');
					responseBody.innerHTML = response.responseText;
					
					var rarity = responseBody.querySelector("p.form-control-static").innerHTML;
					var sellback = 0;
					switch(rarity) {
						case "Common":
							sellback = 10;
							break;
						case "Uncommon":
							sellback = 20;
							break;
						case "Rare":
							sellback = 50;
							break;
						case "Super Rare":
							sellback = 100;
							break;
					}
					
					response.context.item.parentNode.parentNode.querySelector("td:nth-of-type(2)").innerHTML = "<a href='//www.furvilla.com/museum/item/" + response.context.itemID + "'>" + response.context.item.parentNode.parentNode.querySelector("td:nth-of-type(2)").innerHTML + "</a>";
					response.context.item.parentNode.parentNode.querySelector("td:nth-of-type(2)").innerHTML = "<div class='sbbox'><a href='http://www.furvilla.com/stalls/search?furcash=1&name=" + response.context.itemID + "'><img src='http://i.imgur.com/BDWUXmz.png'></a> <span class='label label-warning'>" + sellback + " FC</span></div>" + response.context.item.parentNode.parentNode.querySelector("td:nth-of-type(2)").innerHTML; 

					GM_xmlhttpRequest({
						context: {item: response.context.item, sellback: sellback},
						method: "GET",
						url: "//www.furvilla.com/stalls/search?furcash=1&name=" + response.context.itemID + "&durability=" + response.context.itemDurability + "&potency=" + response.context.itemPotency,
						onload: function(response) {
							var responseBody = document.createElement('div');
							responseBody.innerHTML = response.responseText;
							var userLink = responseBody.querySelector(".user-info h4 a").href;
							
							var prices = "";
							var counter = 0;
							var results = responseBody.querySelectorAll('table:not(.notifications) tr td:nth-of-type(3)');
							for(var result of results) {
								counter++;
								if(result.parentNode.querySelector("td:nth-of-type(5) a").href == userLink) {
									prices += "<span style='color: #0D0;'>" + result.innerHTML + "</span><img src='/img/furcoins.gif'><br>";
								} else if(result.innerHTML < response.context.sellback) {
									prices += "<span style='color: #D00;'>" + result.innerHTML + "</span><img src='/img/furcoins.gif'><br>";
								} else {
									prices += result.innerHTML + "<img src='/img/furcoins.gif'><br>";
								}
								if(counter === 3) { break; }
							}
							
							prices = prices.substring(0, prices.length - 4);
							response.context.item.parentNode.innerHTML = "<div class='pricebox'>" + prices + "</div>" + response.context.item.parentNode.innerHTML;
							responseBody.innerHTML = "";
						}
					});
					responseBody.innerHTML = "";
				}
			});
		}
	}
}, 10);
