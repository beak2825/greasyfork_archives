// ==UserScript==
// @name         eBay - Better Seller Hub
// @namespace    http://tampermonkey.net/
// @version      0.5
// @description  Makes your Seller Hub more productive.
// @include     http://k2b-bulk.ebay.co.uk/ws/eBayISAPI.dll?MfcISAPICommand=SalesRecordConsole&currentpage=SCSold*
// @include     http://k2b-bulk.ebay.co.uk/ws/eBayISAPI.dll?SalesRecordConsole*
// @include     https://k2b-bulk.ebay.co.uk/ws/eBayISAPI.dll?SalesRecordConsole*
// @include     http://k2b-bulk.ebay.co.uk/ws/eBayISAPI.dll?ListingConsole&currentpage=LCActive*
// @include     http://k2b-bulk.ebay.co.uk/ws/eBayISAPI.dll?MfcISAPICommand=ListingConsole&currentpage=LCActive*
// @include     https://www.ebay.co.uk/sh/ord/?filter=status:AWAITING_SHIPMENT
// @include     https://www.ebay.co.uk/sh/ord/*
// @downloadURL https://update.greasyfork.org/scripts/392548/eBay%20-%20Better%20Seller%20Hub.user.js
// @updateURL https://update.greasyfork.org/scripts/392548/eBay%20-%20Better%20Seller%20Hub.meta.js
// ==/UserScript==

var myElems = document.getElementsByTagName('strong');
var myTotalItems = 0;
var myTotalTrans = 0;
var qqq = "";

for (var i = 0; i < myElems.length; i++)
{
    if (myElems[i].parentNode.parentNode.className == "quantity-mod" )
	{
        myTotalItems += parseInt(myElems[i].innerHTML);
        myTotalTrans ++ ;
    }

}
myElems = document.getElementById("quantity");
myElems.childNodes[0].innerHTML = myTotalTrans + "&nbsp;/&nbsp;" + myTotalItems;
myElems.childNodes[0].style.fontSize = "15px";
myElems.childNodes[0].style.fontWeight = "900";



myElems = document.getElementsByTagName('div');
for (i = 0; i < myElems.length; i++)
{
	if (myElems[i].className == "total-price-mod")
	{
        if (myElems[i].parentNode.previousSibling.innerHTML != myElems[i].childNodes[0].childNodes[0].childNodes[0].innerHTML)
            {
                myElems[i].parentNode.style.backgroundColor="#FFAAAA";
                myElems[i].parentNode.previousSibling.style.backgroundColor="#FFAAAA";
            }
    }
	if (myElems[i].className == "order-details")
	{
        myElems[i].style.fontSize = "20px";
        myElems[i].style.width = "40%";
        qqq = myElems[i].childNodes[0].href.split("=")[1].split("&")[0];
        myElems[i].childNodes[0].innerHTML = myElems[i].childNodes[0].innerHTML + "&nbsp;/&nbsp;" + qqq;
        myElems[i].childNodes[0].target="_blank";
    }
}

var myTotalPaid = 0.0;
myElems = document.getElementsByTagName('div');
for (i = 0; i < myElems.length; i++)
{
	if (myElems[i].className == "total-price-mod")
	{
        myTotalPaid += parseFloat(myElems[i].childNodes[0].childNodes[0].childNodes[0].innerHTML.slice(1,9));

        if (myElems[i].parentNode.previousSibling.innerHTML != myElems[i].childNodes[0].childNodes[0].childNodes[0].innerHTML)
            {
                myElems[i].parentNode.style.backgroundColor="#FFAAAA";
                myElems[i].parentNode.previousSibling.style.backgroundColor="#FFAAAA";
            }
    }
}

myElems = document.getElementsByTagName('a');
for (i = 0; i < myElems.length; i++)
{
    if (myElems[i].parentNode.className == "order-details")
    {
        myElems[i].style.fontSize = "16px";
        myElems[i].style.width = "55%";

        qqq = myElems[i].href.split("=")[1].split("&")[0];
        myElems[i].innerHTML += "&nbsp;/&nbsp;" + qqq;
        myElems[i].target="_blank";
    }
}

myElems = document.getElementById("totalprice");
qqq = myElems.childNodes[0].innerHTML
myElems.childNodes[0].innerHTML = "&#163;" + myTotalPaid.toFixed(2);
myElems.childNodes[0].style.fontSize = "15px";
myElems.childNodes[0].style.fontWeight = "900";