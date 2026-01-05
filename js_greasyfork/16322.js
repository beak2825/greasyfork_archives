// ==UserScript==
// @name        IRCTC DISPLAY Add
// @namespace   ANAND KUMAR
// @include     https://www.irctc.co.in/eticketing/printTicketHindi.jsf?pnr*
// @include     https://www.irctc.co.in/eticketing/printTicket.jsf?pnr*
// @version     2
// @grant       none
// @description DISPLAY PRINT NAME
// @downloadURL https://update.greasyfork.org/scripts/16322/IRCTC%20DISPLAY%20Add.user.js
// @updateURL https://update.greasyfork.org/scripts/16322/IRCTC%20DISPLAY%20Add.meta.js
// ==/UserScript==
document.getElementById("iframeBanners").style.display="none";
var ad = document.getElementsByClassName('divTop')[0];
var ads= document.getElementById("link1");
var logi = getCookie("loginid");
ads.innerHTML ='<html><body><table cellspacing="0" cellpadding="0" border="0" style="font-family:Arial;font-size:11px;color:black;width:100%">'+"Adv. Close on click"+logi+'<tbody><td><table cellspacing="0" cellpadding="0" border="1" style="width:100%"><tbody><td>&nbsp;<span  style="font-size:13px;FONT-WEIGHT: bold;color:blue;">नवोदय कम्प्यूटर सेन्टर & सहज जन सेवा केन्द्र (Central & UP gov. Authorised) </span></td><td>&nbsp&nbsp&nbsp;<span style="font-size:13px;FONT-WEIGHT: bold;color:blue;">Anytime 24 Hour </span></td></tr><td>&nbsp;<span  style="font-size:12px;color:red;" >राशन कार्ड ऑनलाइन /जाति प्रमाण पत्र /निवास प्रमाण पत्र / आय प्रमाण पत्र / मतदाता पहचान पत्र <br> &nbsp; पासपोर्ट / पैन कार्ड / खतौनी नक़ल  बनाने तथा नक़ल(प्रतिलिपि) के लिए सम्पर्क करे |</span></td><td>&nbsp;<span style="font-size:11px;color:green;">N०H० 28 सियरहा (सलेमगढ़)(चौराहे से 300 मीटर पूरब )<br> ई-मेल : navoday2@gmail.com मो० 9794115696<br>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;प्रो0_आनन्द कुमार (कुशवाहा जी )</span></td></table><table cellspacing="0" cellpadding="0" border="1" align="center" style="width:50%"><tbody><td>&nbsp;<span style="font-size:9px;FONT-WEIGHT: bold;font-color:black;">Pement Getway Charge</span></td><td><img height="10px" src="/eticketing/javax.faces.resource/indian-rupee-symbol24x18.png.jsf?ln=images"><span>15.0 (or) 2%</span></td></tr></tbody></table></tbody></tbody></td><td>&nbsp;<span style="font-size:13px;">धोखाधड़ी से बचे आई आर सी टी सी अधिकृत फार्म से टिकट कराये,सुखद यात्रा करे| वेटिग टिकट से यात्रा न करे |विशेष जानकारी के लिए सम्पर्क करे |</td></tbody></table></body></html>'