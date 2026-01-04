// ==UserScript==
// @name         RoyalMail Click&Drop link back to eBay, Amazon, Etsy
// @namespace    http://tampermonkey.net/
// @version      0.4
// @description  try to take over the world!
// @author       AdobeScripts (c)
// @match        https://business.parcel.royalmail.com/orders/
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/391149/RoyalMail%20ClickDrop%20link%20back%20to%20eBay%2C%20Amazon%2C%20Etsy.user.js
// @updateURL https://update.greasyfork.org/scripts/391149/RoyalMail%20ClickDrop%20link%20back%20to%20eBay%2C%20Amazon%2C%20Etsy.meta.js
// ==/UserScript==

var i = 0;
var qqq = "";
var myTDs = document.getElementsByTagName('td');

window.addEventListener('DOMSubtreeModified', function() {

// eBay section START
    for ( i = 0; i < myTDs.length; i++)
    {
        if (myTDs[i].innerHTML.match(/^\d\d\-\d\d\d\d\d\-\d\d\d\d\d/))
        {
            myTDs[i].style.backgroundColor = "#ccffe6";
            myTDs[i].style.wordWrap = "anywhere";
            qqq = myTDs[i].innerHTML;
            myTDs[i].innerHTML = '<a target="_blank" href="https://www.ebay.co.uk/sh/ord/?filter=status%3AAWAITING_SHIPMENT&search=ordernumber%3A' + qqq + '">' + qqq +'</a>';
        }
    }
// eBay section END


// Amazon section START
    for ( i = 0; i < myTDs.length; i++)
    {
        if (myTDs[i].innerHTML.match(/^\d\d\d\-\d\d\d\d\d\d\d\-\d\d\d\d\d\d\d/))
        {
            myTDs[i].style.backgroundColor = "#cc9900";
            myTDs[i].style.wordWrap = "anywhere";
            qqq = myTDs[i].innerHTML;
            myTDs[i].innerHTML = '<b><a target="_blank" href="https://sellercentral.amazon.co.uk/orders-v3/order/' + qqq + '">' + qqq +'</a></b>';
        }
    }
// Amazon section END


// Etsy section START
    for ( i = 0; i < myTDs.length; i++)
    {
        if (myTDs[i].innerHTML.match(/^\d\d\d\d\d\d\d\d\d\d/))
        {
            myTDs[i].style.backgroundColor = "#ffebe6";
            qqq = myTDs[i].innerHTML;
            myTDs[i].style.wordWrap = "anywhere";
            myTDs[i].innerHTML = '<b><a target="_blank" href="https://www.etsy.com/your/orders/' + qqq + '?order_id=' + qqq + '">' + qqq +'</a></b>';
        }
    }
// Etsy section END


}, false);
