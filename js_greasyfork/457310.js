// ==UserScript==
// @name         Wyłączenie wkurwiających reklam na Korso
// @namespace    http://tampermonkey.net/
// @version      0.0.0.0.1
// @description  Druciarska metoda wyjebania reklam na Korso. Ogólnie co sekundę wypierdala dynamicznie tworzone elementy reklamowe.
// @author       Hakeryk
// @match        https://korsokolbuszowskie.pl/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=korsokolbuszowskie.pl
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/457310/Wy%C5%82%C4%85czenie%20wkurwiaj%C4%85cych%20reklam%20na%20Korso.user.js
// @updateURL https://update.greasyfork.org/scripts/457310/Wy%C5%82%C4%85czenie%20wkurwiaj%C4%85cych%20reklam%20na%20Korso.meta.js
// ==/UserScript==

(function() {
    'use strict';
    setInterval(function(){
        $('.ads, #mys-wrapper, .addWrapper, #floorLayer, .syndicatedItem, .stayMore__container').hide();
        $('p:contains("Przejdź do artykułu teraz")').click();
        console.log('hue hue reklamy znikajo');
    }, 1000);
   
})();