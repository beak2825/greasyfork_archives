// ==UserScript==
// @name        ERS
// @namespace   ANAND KUMAR
// @include     https://www.irctc.co.in/eticketing/printTicketHindi.jsf?pnr*
// @include     https://www.irctc.co.in/eticketing/printTicket.jsf?pnr*
// @version     3.5
// @grant       none
// @description navoday2@gmail.com ERS Page
// @downloadURL https://update.greasyfork.org/scripts/17572/ERS.user.js
// @updateURL https://update.greasyfork.org/scripts/17572/ERS.meta.js
// ==/UserScript==
document.getElementById("iframeBanners").style.display="none";
var ad = document.getElementsByClassName('divTop')[0];
var ads= document.getElementById("link1");
var logi = localStorage.log;
ads.innerHTML ='<html><body><table cellspacing="0" cellpadding="0" border="0" style="font-family:Arial;font-size:12px;color:black;width:100%">'+"Adv. Close on click"+logi+'<tbody><td><table cellspacing="0" cellpadding="0" border="1" style="width:100%"><tbody><img src="http://www.buddhacsc.hostfree.pw/web_images/irctc_adv_csc.jpg"style="width:700px;height:300px;"></tbody></table></body></html>'