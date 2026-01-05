// ==UserScript==
// @name         MyDealz Google Search
// @namespace    http://www.mydealz.de/profile/richi2k
// @version      0.1
// @description  Adds google search functionality on mydealz.de 
// @author       richi2k
// @require      https://ajax.googleapis.com/ajax/libs/jquery/3.1.0/jquery.min.js
// @match        http://www.mydealz.de/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/22367/MyDealz%20Google%20Search.user.js
// @updateURL https://update.greasyfork.org/scripts/22367/MyDealz%20Google%20Search.meta.js
// ==/UserScript==

(function() {
    'use strict';
    var gSearchElement = $('<a class="search-button" style="right: 1.7em;cursor: pointer;">'+
		'<img src="https://www.google.de/images/branding/product/ico/googleg_lodp.ico" style="height: 20px;">'+
	'</a>');
    
    gSearchElement.click(function(){
        window.open('https://www.google.de/#q=site:mydealz.de+' + $(this).siblings("input.search-input").val() , '_blank');
    });
    $("input.search-input").after(gSearchElement);
})();