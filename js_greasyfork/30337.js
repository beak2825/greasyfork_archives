// ==UserScript==
// @name         delete price
// @namespace    http://tampermonkey.net/
// @version      0.4
// @description  try to take over the world!
// @author       You
// @match        https://book.goindigo.in/Booking/Print
// @match        https://mail-attachment.googleusercontent.com/attachment/u/0/?ui*
// @match        https://apac.ttinteractive.com/TTIDotNet/Transport/*
// @match        https://eticket.shaheenair.com/booking/ticket.php
// @match        https://ta.flydubai.com/en/booking/viewbooking/*
// @match        https://airindiaexpress.booksecure.net/HtmlReceipt.aspx?*
// @grant        none
// @require http://code.jquery.com/jquery-1.12.4.min.js
// @downloadURL https://update.greasyfork.org/scripts/30337/delete%20price.user.js
// @updateURL https://update.greasyfork.org/scripts/30337/delete%20price.meta.js
// ==/UserScript==

(function() {

    function doc_keyDown(e) {
        if (e.altKey && e.keyCode == 84) {
            //t delete 
            if (window.location.href.includes('indigo') === true){
                //indigo
                $('body > div.push.containerpage_main > div.pageHeight > section > div.itineraryWrapper.middle_container > section > div > div.indigo_flights > div:nth-child(9) > div.priceSummary-left > div > div').remove();
            }
            else  if (window.location.href.includes('googleusercontent') === true || window.location.href.includes('airindiaexpres') === true){
                //express
                $('body > div > span > a:nth-child(1) > table:last-child').remove();
                 $('body > div > span > a:nth-child(1) > table:nth-last-child(2)').remove(); 
                $('body > span > a:nth-child(1) > table:last-child').remove();
                
                $('body > span > a:nth-child(1) > table:nth-last-child(2)').remove();
                
            }
            else  if (window.location.href.includes('printItinerary') === true){
                //air arabia
                $('body > table > tbody > tr:nth-child(7)').remove(); 
            }
            else  if (window.location.href.includes('eticket.shaheenair.com') === true){
                //shaheeen
                $('body > table > tbody > tr:nth-child(3) > td > div > div:nth-child(3) > table:nth-child(1) > tbody > tr').remove(); 
                $('body > table > tbody > tr:nth-child(4) > td > table > tbody > tr:nth-child(3) > td:nth-child(1) > ul:nth-child(6) > table > tbody').remove(); 
            }
            else  if (window.location.href.includes('ta.flydubai.com') === true){
                //flydubai
                $('p:contains(OMR)').remove();
                $('h2:contains(OMR)').remove();
                $('tr:contains(OMR)').remove();
                // $('body > table > tbody > tr:nth-child(4) > td > table > tbody > tr:nth-child(3) > td:nth-child(1) > ul:nth-child(6) > table > tbody').remove(); 
            }
        }
    }
    document.addEventListener('keydown', doc_keyDown , false);
    // Your code here...
})();