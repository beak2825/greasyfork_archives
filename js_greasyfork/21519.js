// ==UserScript==
// @name         Check the card
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  Adds a warning to amazon and ebay to check card before checking out
// @author       You
// @match        https://www.amazon.co.uk/gp/buy/*
// @match        https://mbuy.ebay.co.uk/xo*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/21519/Check%20the%20card.user.js
// @updateURL https://update.greasyfork.org/scripts/21519/Check%20the%20card.meta.js
// ==/UserScript==

function addThis(id){
    var div = document.getElementById(id);
    if(div){
        div.innerHTML = '<p style="color: red; font-size: 50px; line-height: 50px"><b>CHECK THE DAMN CARD FIRST</b></p>' + div.innerHTML;
        div.style.backgroundColor = 'yellow';
    }
}

// Add more elements here for other websites
addThis('subtotals'); // amazon
addThis('order-summary-box'); //amazon
addThis('call-to-action'); //ebay