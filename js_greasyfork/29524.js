// ==UserScript==
// @name         Aliexpress sort by price
// @namespace    https://greasyfork.org/scripts/29524-aliexpress-sort-by-price
// @version      0.0.5
// @description  Sort by price by one click
// @author       Mateusz Kula
// @match        *.aliexpress.com/*
// @run-at context-menu
// @homepageURL     https://kulam.pl
// @supportURL      https://kulam.pl/kontakt
// @icon            https://i.imgur.com/R5IP5KN.png
// @downloadURL https://update.greasyfork.org/scripts/29524/Aliexpress%20sort%20by%20price.user.js
// @updateURL https://update.greasyfork.org/scripts/29524/Aliexpress%20sort%20by%20price.meta.js
// ==/UserScript==

var targethost = "aliexpress.com"; //mozesz zmienic na "pl.aliexpress.com"
var freeshipping= "no";  //wyszukiwanie z darmowa wysylka, wartosci "yes" lub "no"
var pa=window.location.pathname;
var number=0;
if(pa.slice(0,7)=="/store/")
number=pageConfig.storeId;
    if(!(number>1))
    {number=pa.slice(7);}

if(pa.slice(0,6)=="/item/")
number=hid_storeId.value;

     var locationPathname = location.pathname.split('/');
if(number>1)
{
if(freeshipping=="yes")
    window.location.href= window.location.protocol+'//'+targethost+"/store/"+number+'/search?SortType=price_asc&isFreeShip=y&'+window.location.search+window.location.hash;
else
    window.location.href= window.location.protocol+'//'+targethost+"/store/"+number+'/search?SortType=price_asc&'+window.location.search+window.location.hash;
}
else
    alert("Wrong page.");
