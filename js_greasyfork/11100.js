// ==UserScript==
// @name         Alvin Amazon HKD
// @namespace    Alvin Amazon HKD
// @version      0.1
// @description  BETA
// @author       Alvin
// @require      http://code.jquery.com/jquery-1.11.3.min.js
// @match        http://www.amazon.co.jp/*
// @downloadURL https://update.greasyfork.org/scripts/11100/Alvin%20Amazon%20HKD.user.js
// @updateURL https://update.greasyfork.org/scripts/11100/Alvin%20Amazon%20HKD.meta.js
// ==/UserScript==

$( document ).ready(function() {

    var YENTEXT = $('span#priceblock_ourprice').text().match(/\d+/g);
    
    var YEN = "";
    var i;
    for (i=0; i<YENTEXT.length; i++){
        YEN = YEN + YENTEXT[i];
    }

    var HKD = YEN*0.062;
    $('span#priceblock_ourprice').append("　　　　　　　　　　　HKD:" + HKD);
});
