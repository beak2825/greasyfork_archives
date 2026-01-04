// ==UserScript==
// @name         Quotient to Omins Search
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Get a customers name or email from Quotient and search it on Omins
// @author       Bing & Will
// @match        https://go.quotientapp.com/q/*
// @grant        GM_xmlhttpRequest
// @grant        GM_addStyle
// @license      All Rights Reserved
// @downloadURL https://update.greasyfork.org/scripts/482248/Quotient%20to%20Omins%20Search.user.js
// @updateURL https://update.greasyfork.org/scripts/482248/Quotient%20to%20Omins%20Search.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Create a button element. It will be styled and positioned with CSS.
    var customerNameButton = document.createElement('button');
    customerNameButton.innerHTML = 'Search Customer Name on Omins';
    customerNameButton.style.position = 'fixed';
    customerNameButton.style.top = '40px';
    customerNameButton.style.right = '20px';
    customerNameButton.style.zIndex = '9999';

    var emailUrlButton = document.createElement('button');
    emailUrlButton.innerHTML = 'Search email on Omins';
    emailUrlButton.style.position = 'fixed';
    emailUrlButton.style.top = '60px';
    emailUrlButton.style.right = '20px';
    emailUrlButton.style.zIndex = '9999';
    // Append the button to the body of the document
    document.body.appendChild(customerNameButton);
    document.body.appendChild(emailUrlButton);

    // Activate the button. When clicked, it will get the value from Quotient and search it on Omins.
    customerNameButton.addEventListener("click", customerButtonClickAction, false);
    emailUrlButton.addEventListener("click", emailButtonClickAction, false);

    function customerButtonClickAction (zEvent) {
        // Get the value from the selector
// Get the customer's name from Quotient
var customerName = document.querySelector("#zBody .box-item .font-bold").textContent.trim();

        // Open the Omins site with the value from Quotient
        var customerNameUrl = "https://omins.snipesoft.net.nz/ominst/search.php?id=1043&help=0&tabledefid=1043&expandsearch=1&find=2121&startswithfield=2199&startswith=" + customerName + "&command=search&Selection=new&set_limit=200&set_offset=0&userinput=0&selectallacrosspages=0&sortit1=id&sortit2=ML&sortit3=FB&sortit4=AC&sortit5=spent&sortit6=name&sortit7=company&sortit8=email&sortit9=username&sortit10=Phone&sortit11=moblie&sortit12=city&sortit13=address&sortit14=postcode&sortit15=orders&";

        window.open(customerNameUrl, "_blank");
    }

    function emailButtonClickAction (zEvent) {
        // Get the value from the selector
// Get the customer's name from Quotient
var customerEmail = document.querySelector("#zBody .box-item .italic").textContent.trim();

        // Open the Omins site with the value from Quotient
        var emailUrl = "https://omins.snipesoft.net.nz/ominst/search.php?id=1043&help=0&tabledefid=1043&expandsearch=1&find=2121&startswithfield=2201&startswith=" + customerEmail + "&command=search&Selection=new&userinput=0&selectallacrosspages=0&sortit1=id&sortit2=ML&sortit3=FB&sortit4=AC&sortit5=spent&sortit6=name&sortit7=company&sortit8=email&sortit9=username&sortit10=Phone&sortit11=moblie&sortit12=city&sortit13=address&sortit14=postcode&sortit15=orders&";

        window.open(emailUrl, "_blank");
    }
})();
