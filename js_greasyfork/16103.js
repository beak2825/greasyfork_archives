// ==UserScript==
// @name         Aliexpress.com - USD to PLN conversion
// @namespace    https://greasyfork.org/pl/scripts/16103-konwerter-do-pln-w-aliexpress
// @version      1.1
// @description  Attempts to convert USD to Polish zloty on aliexpress
// @author       Barricade
// @match        *.aliexpress.com/item/*
// @grant        GM_xmlhttpRequest
// @require      https://ajax.googleapis.com/ajax/libs/jquery/2.1.3/jquery.min.js
// @downloadURL https://update.greasyfork.org/scripts/16103/Aliexpresscom%20-%20USD%20to%20PLN%20conversion.user.js
// @updateURL https://update.greasyfork.org/scripts/16103/Aliexpresscom%20-%20USD%20to%20PLN%20conversion.meta.js
// ==/UserScript==
/*******************/
//Pobranie kursu zł//
var PLN;
GM_xmlhttpRequest ( {
    method:     "GET",
    url:        'https://currency-api.appspot.com/api/USD/PLN.json?amount=1.00',
    onload:     function (rsp){
        var rspJSON     = JSON.parse (rsp.responseText);
        var convRate    = rspJSON.rate;
        PLN = convRate;
        console.log ('kurs wynosi ',convRate);
    }
} );
/*******************/
function usdToPLN(usd) {
    var plnStr = '';
        
    // Check if string is not a single usd, i.e: US $0.67 - 10.56
    if( ! $.isNumeric(usd)) {
        var val1 = parseFloat(usd.substring(4,usd.indexOf('-')-1));
        var val2 = parseFloat(usd.substring(usd.indexOf('-')+1, usd.length));
        val1 = (val1 * PLN).toFixed(2) + ' zł'
        val2 = (val2 * PLN).toFixed(2) + ' zł'
        plnStr = val1 + ' - ' + val2;
    }
    else {
        plnStr = parseFloat(usd * PLN).toFixed(2) + ' zł';
    }
    return plnStr; 
};

$(function(){
    $('span[itemprop="priceCurrency"]').hide();
    $('span[itemprop="lowPrice"]').text(usdToPLN($('span[itemprop="lowPrice"]').text()));
    $('span[itemprop="highPrice"]').text(usdToPLN($('span[itemprop="highPrice"]').text()));
    $('span[itemprop="price"]').each(function(index, val) {
    $(this).text(usdToPLN($(this).text()));
    });
});





