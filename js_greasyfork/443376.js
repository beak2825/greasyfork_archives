// ==UserScript==
// @name         eBay - Transactions Totals
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Calculate Totals
// @author       AdobeScripts.com
// @match        https://www.ebay.co.uk/sh/fin/transactions*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/443376/eBay%20-%20Transactions%20Totals.user.js
// @updateURL https://update.greasyfork.org/scripts/443376/eBay%20-%20Transactions%20Totals.meta.js
// ==/UserScript==

function price_to_number(v){
    if(!v){return 0;}
    v=v.split(',').join('.');
    return Number(v.replace(/[^0-9.]/g, ""));
}

document.addEventListener("click", function() {

setTimeout(function() {

var i = 0;

var qqq = "";

var myTDs = document.getElementsByTagName('td');

var total = 0;
var fees = 0;
var net = 0;

i = 0;
qqq = "";
total = 0;
myTDs = document.getElementsByTagName('td');

for ( i = 0; i < myTDs.length; i++)
{
	if (myTDs[i].className.includes("amountNet" ))
	{
            try {
                net += parseFloat(myTDs[i].childNodes[0].childNodes[0].innerHTML.replace('£',''));
            }
        catch (err){};
    }
}

myTDs = document.getElementsByTagName('td');

for ( i = 0; i < myTDs.length; i++)
{
	if (myTDs[i].className.includes("amountNet" ))
	{
            try {
            fees += parseFloat(myTDs[i].previousSibling.childNodes[0].childNodes[0].innerHTML.replace('£',''));
            }
        catch (err){};
    }
}

myTDs = document.getElementsByTagName('td');

for ( i = 0; i < myTDs.length; i++)
{
	if (myTDs[i].className.includes("amountNet" ))
	{
            try {
            total += parseFloat(myTDs[i].previousSibling.previousSibling.childNodes[0].childNodes[0].innerHTML.replace('£',''));
            }
        catch (err){};
    }
}

myTDs = document.getElementById("amount");
qqq = myTDs.textContent;
myTDs.innerHTML = total.toFixed(2);

myTDs = document.getElementById("amountFee");
qqq = myTDs.textContent;
myTDs.innerHTML = fees.toFixed(2);

myTDs = document.getElementById("amountNet");
qqq = myTDs.textContent;
myTDs.innerHTML = net.toFixed(2);

myTDs = document.getElementsByTagName('button');

for ( i = 0; i < myTDs.length; i++)
{
	if (myTDs[i].className.includes("btn category-filter-title greyButton" ))
	{
        if (myTDs[i].childNodes[0].innerHTML == 'Payout')
        {
            myTDs = document.getElementsByTagName('div');
            total=0;
            for ( i = 0; i < myTDs.length; i++)
            {
                if (myTDs[i].className.includes("transactions-buyer" ))
                {
                    try {
                        total += parseFloat(myTDs[i].previousSibling.childNodes[0].innerHTML.replace('£',''));
                    }
                    catch (err){};
                };
            };
            myTDs = document.getElementById("description");
            qqq = myTDs.textContent;
            myTDs.innerHTML = total.toFixed(2);
            break;
        };
    }
}


}, false);
}, 1000);