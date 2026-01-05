// ==UserScript==
// @name         Aliexpress.com - EUR to CZK conversion
// @version      1.3
// @description  Převod ceny z EUR na CZK na aliexpress.com
// @author       cuckycz
// @match        http://www.aliexpress.com/item/*
// @match        https://www.aliexpress.com/item/*
// @match		 https://shoppingcart.aliexpress.com/shopcart/*
// @grant        GM_xmlhttpRequest
// @require      https://ajax.googleapis.com/ajax/libs/jquery/2.1.3/jquery.min.js
// 
// @namespace https://greasyfork.org/users/39040
// @downloadURL https://update.greasyfork.org/scripts/18821/Aliexpresscom%20-%20EUR%20to%20CZK%20conversion.user.js
// @updateURL https://update.greasyfork.org/scripts/18821/Aliexpresscom%20-%20EUR%20to%20CZK%20conversion.meta.js
// ==/UserScript==
/*******************/
//zjisteni kurzu
var CZK;
GM_xmlhttpRequest ( {
    method:     "GET",
    url:        'https://currency-api.appspot.com/api/EUR/CZK.json?amount=1.00',
    onload:     function (rsp){
        var rspJSON     = JSON.parse (rsp.responseText);
        var convRate    = rspJSON.rate;
        CZK = convRate;
        console.log ('Kurz ',convRate); 
    }
} );

/*******************/
function eurToCZK(eur) {
    var plnStr = '';
  	eur = eur.replace(",", ".");
    if($.isNumeric(eur)) {
      plnStr = (parseFloat(eur) * CZK).toFixed(2) + ' Kč';

    }
    return plnStr.replace(".", ","); 
};

$(function(){
  
    $('span[itemprop="priceCurrency"]').hide();
 
  	var lowPrice = $('span[itemprop="lowPrice"]');
  	var lowEur = lowPrice.text();
    lowPrice.text(eurToCZK(lowEur));
	lowPrice.attr('title', lowEur + ' €\nKurz: '+CZK);
  
  	var highPrice = $('span[itemprop="highPrice"]');
  	var highEur = highPrice.text();
    highPrice.text(eurToCZK(highEur));
	highPrice.attr('title', highEur + ' €\nKurz: '+CZK);
	
	var price = $('span[itemprop="price"]');
 	var priceEur = price.text();
    price.text(eurToCZK(priceEur));
	price.attr('title', priceEur + ' €\nKurz: '+CZK);
  
  	var totalPrice = $('span#j-total-price-value');
  	var totalEur = totalPrice.text();
  	totalPrice.text(eurToCZK(totalEur.substring(2,totalEur.length)));
  	totalPrice.attr('title', totalEur + ' €\nKurz: '+CZK);
  
  	$('a[data-role="sku"]').click(function(e) {
      setTimeout(function(){
        var totalEur = totalPrice.text();
        totalPrice.text(eurToCZK(totalEur.substring(2,totalEur.length)));
        priceEur = price.text();
        price.text(eurToCZK(priceEur));
      }, 500);
       
	});
  
  
});
  




