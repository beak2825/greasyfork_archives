// ==UserScript==
// @name         Aliexpress.com - USD to BUS conversion
// @version      1.0
// @description  USD -> NIS
// @author       Sugoi
// @match        *.aliexpress.com/item/*
// @grant        GM_xmlhttpRequest
// @require      https://ajax.googleapis.com/ajax/libs/jquery/2.1.3/jquery.min.js
// @namespace https://greasyfork.org/users/75787
// @downloadURL https://update.greasyfork.org/scripts/24309/Aliexpresscom%20-%20USD%20to%20BUS%20conversion.user.js
// @updateURL https://update.greasyfork.org/scripts/24309/Aliexpresscom%20-%20USD%20to%20BUS%20conversion.meta.js
// ==/UserScript==
/*******************/
//TODO: MAKE IT A GENERAL SCRIPT
var NIS;
GM_xmlhttpRequest ( {
    method:     "GET",
    url:        'https://currency-api.appspot.com/api/USD/NIS.json?amount=1.00',
    onload:     function (rsp){
        var rspJSON     = JSON.parse (rsp.responseText);
        var convRate    = rspJSON.rate;
        NIS = convRate;
        console.log ('kurs wynosi ',convRate);
    }
} );
/*******************/
function usdToNIS(usd) {
    var nisStr = '';

    if( ! $.isNumeric(usd)) {
        var val1 = parseFloat(usd.substring(4,usd.indexOf('-')-1));
        var val2 = parseFloat(usd.substring(usd.indexOf('-')+1, usd.length));
        val1 = (val1 * NIS).toFixed(2) + ' zł'
        val2 = (val2 * NIS).toFixed(2) + ' zł'
        NISStr = val1 + ' - ' + val2;
    }
    else {
        NISStr = parseFloat(usd * NIS).toFixed(2) + ' zł';
    }
    return NISStr; 
};

$(function(){
    $('span[itemprop="priceCurrency"]').hide();
    $('span[itemprop="lowPrice"]').text(usdToNIS($('span[itemprop="lowPrice"]').text()));
    $('span[itemprop="highPrice"]').text(usdToNIS($('span[itemprop="highPrice"]').text()));
    $('span[itemprop="price"]').each(function(index, val) {
    $(this).text(usdToNIS($(this).text()));
    });
});
