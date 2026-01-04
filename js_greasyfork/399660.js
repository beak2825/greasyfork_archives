
// ==UserScript==
// @name BM Lin Price Converter
// @match http://139shoes.x.yupoo.com/*
// @match https://139shoes.x.yupoo.com/*
// @grant none
// thanks @ https://www.reddit.com/r/FashionReps/comments/bt73g7/bm_lin_yupoo_price_converter_userscript/
// @description:en BM Lin Price Converter -> Translates the Prices to Yuan
// @version 0.0.2.20190526140950
// @namespace https://greasyfork.org/users/304922
// @description BM Lin Price Converter -> Translates the Prices to Yuan
// @downloadURL https://update.greasyfork.org/scripts/399660/BM%20Lin%20Price%20Converter.user.js
// @updateURL https://update.greasyfork.org/scripts/399660/BM%20Lin%20Price%20Converter.meta.js
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
        var price3 = total * 0.23;
        x[i].innerText = "[" + total + "¥] " +  "[" + [price3 + "0"] + "AUD$] " + z;
        console.log(price3);
    }

    
}