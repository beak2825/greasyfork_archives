// ==UserScript==
// @name         Hybrid Pending Calculator
// @author       Tehapollo
// @version      1.4
// @include      https://www.gethybrid.io/workers/payments
// @require      https://code.jquery.com/jquery-latest.min.js
// @namespace    http://tampermonkey.net/
// @description  Calculates changes for pending money
// @downloadURL https://update.greasyfork.org/scripts/378057/Hybrid%20Pending%20Calculator.user.js
// @updateURL https://update.greasyfork.org/scripts/378057/Hybrid%20Pending%20Calculator.meta.js
// ==/UserScript==
(function() {
    'use strict';
var money = document.getElementsByTagName('p')[2].innerHTML;
var money1 = money.replace("You also have $",'');
var money2 = money1.replace(" pending 72h approval.",'')
var money3 = parseFloat(money2)
var AMoney = document.getElementsByTagName('p')[1].innerHTML;
var AMoney1 = AMoney.replace("You currently have $",'')
var AMoney2 = AMoney1.replace("available in your account.",'')
var AMoney3 = parseFloat(AMoney2)
let Aoldvalue = localStorage.getItem('AOldValue')||'0.00';
let oldvalue = localStorage.getItem('OldValue')||'0.00';

if(AMoney3> Aoldvalue){
var Anewvalue = parseFloat(AMoney2-Aoldvalue).toFixed(2);
var newvalue = parseFloat((+Aoldvalue)+(+oldvalue)).toFixed(2);
var newvalue4 = parseFloat(AMoney3+money3).toFixed(2);
var newvalue5 =parseFloat((+newvalue4)-(+newvalue)).toFixed(2);
localStorage.setItem('AOldValue', AMoney3);
localStorage.setItem('OldValue', money3);
$('<h7><h7/>').insertAfter(document.getElementsByTagName('p')[2]);
 document.querySelectorAll("h7")[0].innerHTML=("-$" + Anewvalue + ' ' + "(Moved to Transfer)");
 document.querySelector('h7').style.fontSize = "x-large";
$('<p><p/>').insertAfter(document.getElementsByTagName('p')[2]);
$('<h8><h8/>').insertAfter(document.getElementsByTagName('p')[3]);
 document.querySelectorAll("h8")[0].innerHTML=("+$" + newvalue5);
 document.querySelector('h8').style.fontSize = "x-large";
 $('<h6><h6/>').insertAfter(document.getElementsByTagName('p')[1]);
 document.querySelectorAll("h6")[0].innerHTML=("+$" + Anewvalue);
 document.querySelector('h6').style.fontSize = "medium";

}
else if(money3 > oldvalue){
var newvalue3 = parseFloat(money2-oldvalue).toFixed(2);
localStorage.setItem('OldValue', money3);
$('<h6><h6/>').insertAfter(document.getElementsByTagName('p')[2]);
 document.querySelectorAll("h6")[0].innerHTML=("+$" + newvalue3);
 document.querySelector('h6').style.fontSize = "x-large";
}
else {
localStorage.setItem('AOldValue', AMoney3);
localStorage.setItem('OldValue', money3);
}
})();