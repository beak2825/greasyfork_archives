// ==UserScript==
// @name         Open all(delay)
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  try to take over the world!
// @author       You
// @match        http://www.neopets.com/market.phtml?type=wizard*
// @match        http://www.neopets.com/market.phtml
// @require      http://code.jquery.com/jquery-1.12.4.min.js
// @downloadURL https://update.greasyfork.org/scripts/382750/Open%20all%28delay%29.user.js
// @updateURL https://update.greasyfork.org/scripts/382750/Open%20all%28delay%29.meta.js
// ==/UserScript==

$('#content > table > tbody > tr > td.content > div:nth-child(2) > div.contentModule > table > tbody > tr:nth-child(2) > td > div > div').append('<a herf="javascript(0)" id="open_new-d">Open all(delay)</a>')
var mytime=90000

$('#content > table > tbody > tr > td.content > div:nth-child(2) > table:nth-child(11) > tbody > tr > td:nth-child(2) > b').append('<a herf="javascript(0)" id="open_new-d">Open all(delay)</a>')


$('#open_new-d').click(function(){

var links=$("table > tbody > tr > td > a");
var goods=$("table > tbody > tr > td:nth-child(3)")


console.log(links,goods)
mytime=9000

for(var i=0;i<links.length;i++){

mylink=links[i].href


if (mylink.indexOf('http://www.neopets.com/browseshop.phtml?owner=') === 0){
setTimeout("window.open('"+mylink+"')",mytime)
mytime += 10000
console.log(mylink)
}



}


});



