// ==UserScript==
// @name         Inspirational Quotes.
// @namespace    http://tampermonkey.net/
// @version      1.85
// @description  try to take over the world!
// @author       Magnar Sausberg
// @match        *://www.vg.no/*
// @grant        none
// @require      http://code.jquery.com/jquery-1.12.4.min.js
// @downloadURL https://update.greasyfork.org/scripts/40542/Inspirational%20Quotes.user.js
// @updateURL https://update.greasyfork.org/scripts/40542/Inspirational%20Quotes.meta.js
// ==/UserScript==


var InspQuote = ['"Albert Einstein va så smart han faktisk kunna ha blitt magiker han faktisk." -Stian',
                 '"Hvis det er lagd av Microsoft, så funker det ikke." -Hans Erik',
                 '"iPhone er en bra mobil å bruke." -Hans Erik, rett før resten av avdelingen lo',
                 '"Selvsagt spiser jeg sunt, jeg spiser minst 1 grøn nonstop hver dag." -Birk',
                 '"Vann uten sitron er verre en kantine mat." -Roger',
                 '"Hvem lot Ranchana kjøpe en telefon?!" -Roger',
                 '"Hvem dro til Pizza bakeren i dag?" -Alle',
                 '"Alt funker som det skal." -IKT avdelingen til Trondelag fylkeskommune'];


setInterval(function Knawledge() {
    $("p").each(function(){
        if ($.inArray($(this).text(), InspQuote) == -1) {
            var myRandom = Math.floor(Math.random()*InspQuote.length);
            var randomQuote = InspQuote[myRandom];
            $(this).text(InspQuote[myRandom]);
        }});
}, 500)();