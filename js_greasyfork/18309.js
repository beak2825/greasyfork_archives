// ==UserScript==
// @name        TrueSteamCalc
// @namespace   none
// @description Высчитывает количество потраченых на стим денег.
// @include     https://store.steampowered.com/account/history/
// @namespace   https://greasyfork.org/en/users/35350
// @version     1.1
// @grant       none
// @downloadURL https://update.greasyfork.org/scripts/18309/TrueSteamCalc.user.js
// @updateURL https://update.greasyfork.org/scripts/18309/TrueSteamCalc.meta.js
// ==/UserScript==
var sum_game=0;
var sum_market_profit=0;
var sum_market=0;
var i=0;
elements = document.getElementsByClassName('wallet_table_row'); 
for (i=0; i<elements.length; i++) {
el_string=elements[i];
if (el_string.cells[2].innerHTML.indexOf('Покупка')+1) { price=elements[i].cells[3].innerHTML; sum_game=sum_game+parseInt(price.replace(/\D+/g,"")); }
}
//alert(sum_game);
i=0;

for (i=0; i<elements.length; i++) {
el_string=elements[i];
if (el_string.cells[2].innerHTML.indexOf('Market Transaction')+1 && (elements[i].cells[3].innerHTML).indexOf('Кредит')+1 ) {
price=elements[i].cells[3].innerHTML;
sum_market_profit=sum_market_profit+parseFloat(price.replace(/[^\d\,]/g,'').replace(/,/,'.')); 
}
}

i=0;
for (i=0; i<elements.length; i++) {
el_string=elements[i];
if (el_string.cells[2].innerHTML.indexOf('Market Transaction')+1 && (elements[i].cells[3].innerHTML).indexOf('Кредит')==-1 ) {
price=elements[i].cells[3].innerHTML;
sum_market=sum_market+parseFloat(price.replace(/[^\d\,]/g,'').replace(/,/,'.')); 
}
}

alert(sum_game+sum_market-sum_market_profit);