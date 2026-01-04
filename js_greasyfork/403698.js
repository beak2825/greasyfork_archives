// ==UserScript==
// @name         AliExpress Basket - price per item/lot
// @namespace    http://tampermonkey.net/
// @version      0.3
// @description  Re-calculate price per piece
// @author       AdobeScripts
// @match        https://shoppingcart.aliexpress.com/shopcart/shopcartDetail.htm*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/403698/AliExpress%20Basket%20-%20price%20per%20itemlot.user.js
// @updateURL https://update.greasyfork.org/scripts/403698/AliExpress%20Basket%20-%20price%20per%20itemlot.meta.js
// ==/UserScript==

function price_to_number(v){
    if(!v){return 0;}
    v=v.split(',').join('.');
    return Number(v.replace(/[^0-9.]/g, ""));
}

document.addEventListener("click", function() {
setTimeout(function() {
    
var i = 0;
var myELEMs = document.querySelectorAll("span.main-cost-price");
var myPrice = 0.0;
var myQty = 0;
var myPP = 0.0;

for (i = 0; i < myELEMs.length; i++)
{
    if (myELEMs[i].innerHTML.indexOf("-&gt") == -1)
    {
    }
    else
    {
        if (myELEMs[i].innerHTML.indexOf("sale-icon") > 0 )
        {
            myELEMs[i].innerHTML = myELEMs[i].innerHTML.split(";\">")[1].split("-")[0];
        }
        else
        {
            myELEMs[i].innerHTML = myELEMs[i].innerHTML.split("-")[0];
        }
    }
    
    if (myELEMs[i].innerHTML.indexOf("sale-icon") > 0 )
    {
        myPrice = price_to_number(myELEMs[i].innerHTML.split(";\">")[1]);
    }
    else
    {
        myPrice = price_to_number(myELEMs[i].innerHTML);
    }
    myQty = myELEMs[i].parentNode.parentNode.parentNode.nextSibling.childNodes[1].childNodes[0].childNodes[0].childNodes[0].childNodes[1].childNodes[0].value;
    myPP = price_to_number(myELEMs[i].parentNode.parentNode.nextSibling.childNodes[0].innerHTML);
    myELEMs[i].innerHTML += " -> " + myPrice + " * " + myQty + " = " + (myPrice*myQty).toFixed(2) + " + " + myPP + " = " + (myPrice*myQty + myPP).toFixed(2) + " -> " + ((myPrice*myQty + myPP)/myQty).toFixed(2);
}

}, false);
}, 1000);