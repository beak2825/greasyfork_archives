// ==UserScript==
// @name STOS Price Converter
// @match http://stos.x.yupoo.com/*
// @match https://stos.x.yupoo.com/*
// @grant none
// @description STOS Price Converter -> Converts the price to Yuan
// @version 21.36
// @namespace https://greasyfork.org/users/746813
// @downloadURL https://update.greasyfork.org/scripts/423164/STOS%20Price%20Converter.user.js
// @updateURL https://update.greasyfork.org/scripts/423164/STOS%20Price%20Converter.meta.js
// ==/UserScript==
var prices = {};
prices["A"] = 100;
prices["B"] = 200;
prices["C"] = 300;
prices["D"] = 400;
prices["E"] = 500;
prices["F"] = 600;
 
var pricesMid = {};
pricesMid[0] = 50;
pricesMid[1] = 60;
pricesMid[2] = 70;
pricesMid[3] = 80;
pricesMid[4] = 90;
pricesMid[5] = 0;
pricesMid[6] = 10;
pricesMid[7] = 20;
pricesMid[8] = 30;
pricesMid[9] = 40;
 
var x = document.querySelectorAll('.album__title,.showalbumheader__gallerytitle');
var i;
for (i = 0; i < x.length; i++) {
    var z = x[i].innerText;
    var arr = z.match(/\w\w\d\w\w/);
    if (Array.isArray(arr) && arr.length) {
        var price1 = prices[arr[0].charAt(0)];
        var price2 = pricesMid[arr[0].charAt(2)];
        var total = price1 + price2;
        x[i].innerText = "[" + total + "¥] " + z;
    }
}