// ==UserScript==
// @name         monopriceSaleListing
// @namespace    http://tampermonkey.net/
// @version      0.3
// @description  Reads a MonoPrice sale page and lists sale items by best deal.
// @author       dr3v
// @match        https://www.monoprice.com/pages/*
// @icon         https://www.google.com/s2/favicons?domain=monoprice.com
// @grant        none
// @license       MIT
// @downloadURL https://update.greasyfork.org/scripts/437006/monopriceSaleListing.user.js
// @updateURL https://update.greasyfork.org/scripts/437006/monopriceSaleListing.meta.js
// ==/UserScript==

(function() {
    'use strict';
	// Set variables and fetch master element
	const saleItems = [];

	var products = document.getElementsByClassName("product"); console.log(products);
    var prodNum = products.length; // console.log(prodNum);
  
    // Add text block
    var addList = document.getElementsByClassName("small text-muted well-sm");
    addList[0].innerHTML += ('<br><textarea id="saleAdd" style="width:100%; min-height:180px;" wrap="off">');

	for(let i = 0;i < prodNum; i+=1){
        let thisItem = products.item(i).children; // console.log(thisItem);

        // prod name and sale price
        let itemName = thisItem.item(1).innerText; // console.log(itemName);
        let salePrice = thisItem.item(4).innerText; // console.log(salePrice);
            salePrice = salePrice.replace(/[^\d\.]/,'');

        // original price and currency
        let priceHTML = products.item(i).innerHTML;

        var origPrice;
        var currency;

        if (/Was (.)(\d+,*\d*\.?\d+)/.test(priceHTML)){
            var priceStr = /Was (.)(\d+,*\d*\.?\d+)/g.exec(products.item(i).innerHTML);
            origPrice = priceStr[2]; // console.log(origPrice);
            origPrice = origPrice.replace(/[^\d\.]/,'');
            currency = priceStr[1];
        } else {
            origPrice = salePrice;
            currency = ("$");
        }

        // sale percent
        var salePerc;
        if(thisItem.item(6)){
            salePerc = /YOU.*\((\d+)%\)/.exec((thisItem.item(6).innerText))[1];
        } else {
            salePerc = 0;
        }

        ////// build array of objects
        let saleItemObject = {
            ID: (i + 1),
            description: itemName,
            price: Number(Number(salePrice).toFixed(2)),
            originalPrice: Number(Number(origPrice).toFixed(2)),
            savings: saveCalc(salePrice,origPrice),
            savingsPercent: Number(salePerc),
            itemCurrency: currency
        };

        // Push to array
        saleItems.push(saleItemObject);

        // Functions
        function saveCalc(x,y){
            let sPrice = Number(x);
            let oPrice = Number(y);

            let savs = (oPrice - sPrice);
            savs = savs.toFixed(2);

            let outNo = Number(savs);
            return outNo;
        };

        // debug
		// let thisArray = [i,itemName,salePrice,origPrice,currency,salePerc];
		// let output = thisArray.join("|");
		// console.log(output);
	}

    // Output to text block
    var outBlock = document.getElementById("saleAdd");

    var finalOut = [];
    saleItems.forEach(function(item,index){
        let name = item.description;
        let price = item.price;
        let ogprice = item.originalPrice;
        let savings = item.savings;
        let perc = item.savingsPercent;
        let curr = item.itemCurrency;

        let outStr = (perc + "% off: " + curr + price + " / " + curr + ogprice + " (" + curr + savings + " off!)" + " | " + name);

        finalOut.push(outStr);
    });

    finalOut.sort();
    finalOut.forEach(function(val,ind){
        outBlock.textContent += (val + "\n");
    });

    // debug
	console.log(saleItems);

})();
