// ==UserScript==
// @name TLS chrome
// @namespace Violentmonkey Scripts
 //  @description Indian Visa Bangladesh Appointment
// @match <a href="https://fr.tlscontact.com/dz/ORN/myapp.php**" target="_blank">https://fr.tlscontact.com/dz/ORN/myapp.php**</a>
// @grant none
// @version 0.0.1.20181118164549
// @downloadURL https://update.greasyfork.org/scripts/374495/TLS%20chrome.user.js
// @updateURL https://update.greasyfork.org/scripts/374495/TLS%20chrome.meta.js
// ==/UserScript==
var i,x,j,pureText,realI,realJ;
x=0;
window.setTimeout(function(){ if(x===0){location.reload();} }, 60*1000);
 
 
var all_dates = document.getElementsByClassName("take_appointment")[0].getElementsByTagName("ul")[0].getElementsByTagName("li");
 
 
for (i = 0; i < all_dates.length; i++) {
var times = all_dates[i].getElementsByTagName("a");
 
 
for( j = 0 ; j<times.length;j++) {
 
var dispo = times[j];
var inner = dispo.className;
if(inner!="full") {
x=1;
pureText = dispo.innerHTML;
realI=i;
realJ=j;
 
}
 
}
 
}
 
if(x==1) {
all_dates[realI].getElementsByTagName("a")[realJ].click();
}
 
//Starts here
setInterval (function (){
if(document.getElementById("ajaxConfirmCall_submit")!==null)
{//My work is done here
document.getElementById("ajaxConfirmCall_submit").click();
if(x>0){x=x-0.25;}
}
 
},3000);