// ==UserScript==
// @name         Aliexpress sort by price (menu version)
// @namespace    https://greasyfork.org/en/scripts/30604-aliexpress-sort-by-price-menu-version
// @version      0.0.7.1
// @description  Sort by price by one click using menu command
// @author       Mateusz Kula
// @match        *.aliexpress.com/*
// @grant GM_registerMenuCommand
// @grant GM_xmlhttpRequest
// @homepageURL     https://kulam.pl
// @supportURL      https://kulam.pl/kontakt
// @icon            https://i.imgur.com/R5IP5KN.png



// @downloadURL https://update.greasyfork.org/scripts/30604/Aliexpress%20sort%20by%20price%20%28menu%20version%29.user.js
// @updateURL https://update.greasyfork.org/scripts/30604/Aliexpress%20sort%20by%20price%20%28menu%20version%29.meta.js
// ==/UserScript==
//PRODUCTS
GM_registerMenuCommand('Sort by price', function sort () { 
	var targethost = "aliexpress.com"; //mozesz zmienic na "pl.aliexpress.com"
	var freeshipping= "no";  //wyszukiwanie z darmowa wysylka w zakladce produkty, wartosci "yes" lub "no"
	var pa=window.location.pathname;
	var number=0;
	if(pa.slice(0,7)=="/store/")
	number=pageConfig.storeId;
    if(!(number>1))
    {number=pa.slice(7);}
	
	if(pa.slice(0,6)=="/item/")
	{
		if(!(number=runParams.shopId))
		number=runParams.data.storeModule.storeNum;
	}
	
	var locationPathname = location.pathname.split('/');
	
	
	if(number>1)
	{
		if(freeshipping=="yes")
		window.location.href= window.location.protocol+'//'+targethost+"/store/"+number+'/search?SortType=price_asc&isFreeShip=y&'+window.location.search+window.location.hash;
		else
		window.location.href= window.location.protocol+'//'+targethost+"/store/"+number+'/search?SortType=price_asc&isFreeShip=n&'+window.location.search+window.location.hash;
	}
	else
    alert("Wrong page.");
}, 'a');

//SALE ITEMS
GM_registerMenuCommand('Sale items', function sort () {
	var targethost = "aliexpress.com"; //mozesz zmienic na "pl.aliexpress.com"
	var freeshipping= "no"; //wyszukiwanie z darmowa wysylka w zakladce sale items, wartosci "yes" lub "no"
	var pa=window.location.pathname;
	var number=0;
	if(pa.slice(0,7)=="/store/")
	{number=pageConfig.storeId;
		if(!(number>1))
		{number=pa.slice(7);}
	}
    else
    {
		if(pa.slice(0,6)=="/item/")
		if(!(number=runParams.shopId))
		number=runParams.data.storeModule.storeNum;
	}
	var locationPathname = location.pathname.split('/');
	
	
	if(number>1)
	{
		if(freeshipping=="yes")
        window.location.href= window.location.protocol+'//'+targethost+"/store/sale-items/"+number+'.html?SortType=price_asc&isFreeShip=y&'+window.location.search+window.location.hash;
		else
        window.location.href= window.location.protocol+'//'+targethost+"/store/sale-items/"+number+'.html?SortType=price_asc&isFreeShip=n&'+window.location.search+window.location.hash;
	}
	else
    alert("Wrong page.");
}, 's');