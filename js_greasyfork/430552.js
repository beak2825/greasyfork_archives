// ==UserScript==
// @name         Amazon Whishlist Helper
// @version      0.4
// @description  Amazon Whishlist helper
// @author       Nilsksk
// @match        https://www.amazon.com/hz/wishlist/*
// @match        https://www.amazon.de/hz/wishlist/*
// @match        https://www.amazon.com/*
// @match        https://www.amazon.de/*
// @icon         https://www.google.com/s2/favicons?domain=amazon.de
// @grant        none
// @namespace https://greasyfork.org/users/156494
// @downloadURL https://update.greasyfork.org/scripts/430552/Amazon%20Whishlist%20Helper.user.js
// @updateURL https://update.greasyfork.org/scripts/430552/Amazon%20Whishlist%20Helper.meta.js
// ==/UserScript==

var listData = document.getElementById("g-items").getElementsByClassName("a-offscreen");
var listLength = listData.length;
var listPriceTotal = 0.0;
var displayElement = document.createElement("p");

for (var i = 0; i < listLength; i++){
	listPriceTotal += parseFloat(listData[i].innerText.slice(0, -2).replace(",","."));
}

displayElement.innerText = "Total price of the list: " + listPriceTotal.toFixed(2);
displayElement.style = "text-align: center; color: #007185; font-weight: bold; font-size: 16px; line-height: 24px";

document.getElementById("control-bar").appendChild(displayElement);