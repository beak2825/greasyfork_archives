// ==UserScript==
// @name         Open all
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  try to take over the world!
// @author       You
// @match        http://www.neopets.com/market.phtml?type=wizard*
// @require      http://code.jquery.com/jquery-1.12.4.min.js
// @downloadURL https://update.greasyfork.org/scripts/39446/Open%20all.user.js
// @updateURL https://update.greasyfork.org/scripts/39446/Open%20all.meta.js
// ==/UserScript==

$('#content > table > tbody > tr > td.content > div:nth-child(2) > div.contentModule > table > tbody > tr:nth-child(2) > td > div > div').append('<a herf="javascript(0)" id="open_new">Open all</a>')
var mytime=0



$('#open_new').click(function(){

var links=$("#resultsTable > table > tbody > tr > td > a");
goods=$("#resultsTable > table > tbody > tr > td:nth-child(3)")





for(var i=0;i<links.length;i++){

console.log(links[i].href)
mylink=links[i].href

setTimeout("window.open('"+mylink+"')",mytime)

mytime+=3000*parseInt(goods[i+1].innerText)+5000

console.log(mytime)


}


});



