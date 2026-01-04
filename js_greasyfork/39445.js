// ==UserScript==
// @name         Neo usershop auto buyer
// @namespace    http://tampermonkey.net/
// @version      1.25
// @description  try to take over the world!
// @author       You
// @match        http://www.neopets.com/browseshop.phtml?owner=*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/39445/Neo%20usershop%20auto%20buyer.user.js
// @updateURL https://update.greasyfork.org/scripts/39445/Neo%20usershop%20auto%20buyer.meta.js
// ==/UserScript==

var td= $('#content > table > tbody > tr > td.content > div > table > tbody > tr > td')
var global_time=0
window.confirm = function myConfirm() {
  return true;
}


if(td.length==0){
setTimeout("window.close();",10000*2);}else{
var text=td[0].innerText
var cost=/Cost\s*:\s*(\d*)\s*NP/.exec(text)[1]
var stock=/(\d*)\s*in\s*stock/.exec(text)[1]


function go_buy(mylink,time){
	time=Math.random() * time+500
	setTimeout(function() {
       $("#content > table > tbody > tr > td.content > div:nth-child(13) > table > tbody > tr > td > a > img").trigger("click")
	}, Math.floor(Math.random() * time)+global_time);
	global_time+=time
}





if(parseInt(cost)<=200 && parseInt(cost)!=0){

var mylink=$('#content > table > tbody > tr > td.content > div > table > tbody > tr > td > a').attr("href");
console.log(String(mylink));

for(var i=0;i<stock;i++){
go_buy(mylink,1000)

}
//setTimeout('window.location.replace(window.location.href+"&lower=0")',3000*stock)
}

console.log(/Cost\s*:\s*(\d*)\s*NP/.exec(text))







}
