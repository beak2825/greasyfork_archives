// ==UserScript==
// @name         Trade Script
// @namespace    http://your.homepage/
// @include      https://politicsandwar.com/*
// @version      1.4
// @description  Shows which resources are below market average
// @author       Darth Phrogg
// @match        https://politicsandwar.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/10770/Trade%20Script.user.js
// @updateURL https://update.greasyfork.org/scripts/10770/Trade%20Script.meta.js
// ==/UserScript==

console.log("Script running");
//Find resource of page
var tag = document.getElementsByClassName("nationtable");
var rRow = tag[0].getElementsByTagName("tr");
var img = rRow[1].getElementsByTagName("img");
var title = titleFind();

function titleFind() {
	var test = img[2].getAttribute("title");
	if (test == "Price Per Unit") {
		return img[1].getAttribute("title");
	} else {
		return test;
	}
}
console.log(title);

//Split up marquee
var marquee = document.getElementsByTagName("marquee");
var avgString = marquee[0].innerText;
var avgArray = avgString.split(" ");
console.log(avgArray);

//Pull resource avg from marquee
var resourceIndex = avgArray.indexOf(title + ":");
var priceDollar = avgArray[resourceIndex + 1];
var priceString = priceDollar.substr(1);
var price = parseInt(priceString.replace(",", ""));
console.log(price);

//Find price in row
var row = document.getElementsByClassName("sell");

for (var i = 1; i <= 15; i++) {
	var cell = rRow[i].getElementsByTagName("td");
	var ppuCell = cell[5].innerText;
	var ppuTrimed = ppuCell.trim();
	var ppuArray = ppuTrimed.split(" ");
	var ppu = ppuArray[0].replace(/,/g, '');

	// Compare prices
	if (price >= ppu) {
		var forStyle = rRow[i];
		forStyle.style.backgroundColor = "#00E600";
	}
}