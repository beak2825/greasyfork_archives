// ==UserScript==
// @name         Gamdom Rain notifier by DK
// @description  Rain Notifications
// @version      1.1
// @author       DK
// @match        *://gamdom.com/*
// @namespace    http://tampermonkey.net/
// @run-at       document-end
// @grant        GM_notification
// @grant        window.focus
// @grant        unsafeWindow
// @downloadURL https://update.greasyfork.org/scripts/30377/Gamdom%20Rain%20notifier%20by%20DK.user.js
// @updateURL https://update.greasyfork.org/scripts/30377/Gamdom%20Rain%20notifier%20by%20DK.meta.js
// ==/UserScript==////// *://gamdom.com/* /// by var1212 /////
var init = 1 // inital bet amount
//////////////////////////////////////////////////////////

var start = init
var $lastNumber = $("#rolled-number")
var $bet = $("#play-points")
var $balance = $("#balance").text()
var lastBalance = $balance
var lastStatus

function roll()
{
var a=getStatus()
if(a!==lastStatus){
switch(a){
case"bet":bet();
break;
case"rolling":;
}
lastStatus=a
}

function getStatus()
{
var h=$('#countdown-timer').text();
if(h != "0.00")
{
return "bet"
}
else
{
return "rolling"
}
}

function bet()
{
$balance = $("#balance").text()
if($balance < lastBalance)
{
//przegrana
start = start * 2
}
if($balance > lastBalance)
{
start = init
lastBalance = $balance
}
$bet.val(start)
document.querySelector("button.btn.btn-lg.btn-danger.btn-bet").click()
}
}

refreshTimer=setInterval(roll,500);