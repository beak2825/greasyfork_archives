// ==UserScript==
// @name         muahahaha cardmarket
// @namespace    muahahaha
// @version      1.1.1
// @description  jump from cardmarket to gatherer and scryfall
// @match        https://www.cardmarket.com/es/Magic/Products/Singles/*
// @downloadURL https://update.greasyfork.org/scripts/372368/muahahaha%20cardmarket.user.js
// @updateURL https://update.greasyfork.org/scripts/372368/muahahaha%20cardmarket.meta.js
// ==/UserScript==

(function() {
    'use strict';

    if(typeof(unsafeWindow.$)==='function'){

        var $=unsafeWindow.$;

        var n=$('.page-title-container h2').text().substr($('.expansionIcon').closest('div').find('a').last().text().length).replace(' - ','');
        if(!n){
            n=$('.page-title-container h1').text();
        }

        $('.page-title-container>div').last().prepend('<span class="d-none d-lg-inline"><a href="http://scryfall.com/search?unique=cards&as=grid&order=name&q='+encodeURIComponent(n)+'">scryfall</a></span><br/>');
        $('.page-title-container>div').last().prepend('<span class="d-none d-lg-inline"><a href="http://gatherer.wizards.com/Pages/Search/Default.aspx?name='+encodeURIComponent('['+n+']')+'">gatherer</a></span><br/>');

    }

})();