

// ==UserScript==
// @name         Amazon Wishlist Totals
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  get the total value of an amazon wishlist 
// @author       Alex Kwon
// @match        https://www.amazon.com/hz/wishlist/printview/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=amazon.com
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/446011/Amazon%20Wishlist%20Totals.user.js
// @updateURL https://update.greasyfork.org/scripts/446011/Amazon%20Wishlist%20Totals.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Your code here...

    let list = document.querySelectorAll('[id^=tableRow]')
    let sum = 0
    for (let x = 0; x < list.length; x++) {
    	let cost = list[x].childNodes[3].textContent.slice(1)
    	sum = parseFloat(cost) + sum
	}
	sum = parseFloat(sum).toFixed(2)
	let sum10 = (sum * 1.1 ).toFixed(2)
    const sumNode = document.createElement("span")
    const textNode = document.createTextNode(" ($" + sum + ", $" + sum10 + ")")
    sumNode.appendChild(textNode)
    document.querySelector('.a-text-ellipsis').appendChild(sumNode)
})();