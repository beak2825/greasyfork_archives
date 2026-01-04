// ==UserScript==
// @name         gigabet hilo bot 3 cards (chooses the lower payout for all 3 cards) (beta release)
// @author       Dauersendung
// @description  open https://gigabet.com/game/hilow and watch
// @description  get your account here: https://www.gigabet.com/c/giveaways 
// @namespace    https://greasyfork.org/de/users/444902-dauersendung
// @version      1.0
// @match        https://gigabet.com/game/hilow
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/415553/gigabet%20hilo%20bot%203%20cards%20%28chooses%20the%20lower%20payout%20for%20all%203%20cards%29%20%28beta%20release%29.user.js
// @updateURL https://update.greasyfork.org/scripts/415553/gigabet%20hilo%20bot%203%20cards%20%28chooses%20the%20lower%20payout%20for%20all%203%20cards%29%20%28beta%20release%29.meta.js
// ==/UserScript==

//klick hi
//var item1= $("i.fas.fa-play.fa-rotate-270").click();
//klick lo
//var item2= $("i.fas.fa-play.fa-rotate-90").click();
//klick skip
//var item3= $("#btn--hilow--skip.NOltCg").click();
//klick payout
//var drop = $("#btn--hilow--cashout.gLCcGq.hilow-game-started").click();
//klick start
//var start = $("#btn--hilow--play.gLCcGq.hilow-game-not-started").click();
//playbutton
//var play = document.getElementById("btn--hilow--play").childNodes[1].textContent

setTimeout(function(){
document.getElementById("hilow--amount").value='1.00000000' ;
},300);


setInterval(function(){
setTimeout(function(){
//multi
var multi = document.getElementsByClassName("PERmvn")[0].firstElementChild.innerText.replace("TOTAL PROFIT (","").replace("x)","");


if($('#btn--hilow--cashout').css('display') === 'none'){
   $("#btn--hilow--play.gLCcGq.hilow-game-not-started").click();
     console.log("neue runde")
}else{

//spin 1
setTimeout(function(){
//high
var hi = document.getElementById("hilow--payout--hi--chance").innerHTML.replace(".","").replace("%","");
//low
var lo = document.getElementById("hilow--payout--low--chance").innerHTML.replace(".","").replace("%","");
if (lo >= hi){
($("i.fas.fa-play.fa-rotate-90").click())
console.log("karte 1: lo gespielt");
}else if (lo <= hi){
($("i.fas.fa-play.fa-rotate-270").click())}
console.log("karte 1: high gespielt");
 }, random(2000,4000));
}
//spin 2
setTimeout(function(){
if($('#btn--hilow--cashout').css('display') === 'none'){
   $("#btn--hilow--play.gLCcGq.hilow-game-not-started").click();
     console.log("neue runde")
}else{
//high
var hi = document.getElementById("hilow--payout--hi--chance").innerHTML.replace(".","").replace("%","");
//low
var lo = document.getElementById("hilow--payout--low--chance").innerHTML.replace(".","").replace("%","");
if (lo <= hi){
($("i.fas.fa-play.fa-rotate-90").click())
console.log("karte 1: lo gespielt");
}else if (lo >= hi){
($("i.fas.fa-play.fa-rotate-270").click())}
console.log("karte 1: high gespielt");
} }, random(2000,4000));

//spin 3
setTimeout(function(){
if($('#btn--hilow--cashout').css('display') === 'none'){
   $("#btn--hilow--play.gLCcGq.hilow-game-not-started").click();
     console.log("neue runde")
}else{
//high
var hi = document.getElementById("hilow--payout--hi--chance").innerHTML.replace(".","").replace("%","");
//low
var lo = document.getElementById("hilow--payout--low--chance").innerHTML.replace(".","").replace("%","");
if (lo >= hi){
($("i.fas.fa-play.fa-rotate-90").click())
console.log("karte 1: lo gespielt");
}else if (lo <= hi){
($("i.fas.fa-play.fa-rotate-270").click())}
console.log("karte 1: high gespielt");
} }, random(2000,4000));

    //spin 4
setTimeout(function(){
if($('#btn--hilow--cashout').css('display') === 'none'){
   $("#btn--hilow--play.gLCcGq.hilow-game-not-started").click();
     console.log("neue runde")
}else{
//high
var hi = document.getElementById("hilow--payout--hi--chance").innerHTML.replace(".","").replace("%","");
//low
var lo = document.getElementById("hilow--payout--low--chance").innerHTML.replace(".","").replace("%","");
if (lo <= hi){
($("i.fas.fa-play.fa-rotate-90").click())
console.log("karte 1: lo gespielt");
}else if (lo >=  hi){
($("i.fas.fa-play.fa-rotate-270").click())}
console.log("karte 1: high gespielt");
} }, random(2000,4000));

//cashout
setTimeout(function(){
    if($('#btn--hilow--cashout').css('display') === 'none'){
   $("#btn--hilow--play.gLCcGq.hilow-game-not-started").click();
     console.log("neue runde")
}else{
$("#btn--hilow--cashout.gLCcGq.hilow-game-started").click();
    console.log('cashout mit: ' +  multi);
} }, random(2000,4000));
 }, random(2000,4000))},20000)

function random(min,max){
   return min + (max - min) * Math.random();
}