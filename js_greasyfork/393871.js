// ==UserScript==
// @name BM Lin Price Converter (Long\Short)
// @match http://139shoes.x.yupoo.com/*
// @match https://139clothes.x.yupoo.com*
// @match https://139shoes.x.yupoo.com/*
// @match https://139clothes.x.yupoo.com/albums*
// @grant none
// thanks @ https://www.reddit.com/r/FashionReps/comments/bt73g7/bm_lin_yupoo_price_converter_userscript/
// @description:en BM Lin Price Converter -> Translates the Prices to Yuan
// @namespace https://greasyfork.org/users/304922
// @version 0.0.1.20191217225256
// @description BM Lin Price Converter -> Translates the Prices to Yuan
// @downloadURL https://update.greasyfork.org/scripts/393871/BM%20Lin%20Price%20Converter%20%28Long%5CShort%29.user.js
// @updateURL https://update.greasyfork.org/scripts/393871/BM%20Lin%20Price%20Converter%20%28Long%5CShort%29.meta.js
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
    var arr_short = z.match(/\w\w\d\w/);
    if (Array.isArray(arr_short) && arr_short.length) {
        var price2 = prices[arr_short[0].charAt(0)];
        var total_1 = price2/10;
        x[i].innerText = "[" + total_1 + "¥] " + z;
    }
    var arr = z.match(/\w\w\d\w\w/);
    if (Array.isArray(arr) && arr.length) {
        var price3 = prices[arr[0].charAt(0)];
        var price4 = pricesMid[arr[0].charAt(2)];
        var total_2 = price3 + price4;
        x[i].innerText = "[" + total_2 + "¥] " + z;
    }
}