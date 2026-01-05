// ==UserScript==
// @name        Ers Adv
// @namespace   ANAND KUMAR
// @include     https://www.irctc.co.in/nget/print-ticket*
// @include     https://www.irctc.co.in/nget/*
// @version     6.5
// @grant       none
// @description navoday2@gmail.com ERS Page
// @downloadURL https://update.greasyfork.org/scripts/24332/Ers%20Adv.user.js
// @updateURL https://update.greasyfork.org/scripts/24332/Ers%20Adv.meta.js
// ==/UserScript==
//var ad = document.getElementsByClassName('divTop')[0];
var ads= document.getElementById("link1");
var logi = localStorage.log;
//ad.querySelectorAll("td")[1].innerHTML =''
//ad.querySelectorAll("td")[2].innerHTML =''
//ad.querySelectorAll("td")[3].innerHTML =''//नवोदय कम्प्यूटर & सहज जन सेवा केन्द्र (Central & UP gov. Authorised)
ads.innerHTML ='<html><tbody><td><table style="width:100%"><tbody><td>&nbsp;<span  style="font-size:15px;">('+logi+')नवोदय कम्प्यूटर & सहज जन सेवा केन्द्र (Central & UP gov. Authorised) Mo.: 9005269231,7398767611</span></td></tr><td>&nbsp;<span  style="font-size:14px;" >::Digital India ::आधार कार्ड से पैसा लेन-देन /LIC पालिसी जमा /बिजली बिल जमा /फोटो कापी/ जाति प्रमाण पत्र /निवास प्रमाण पत्र / आय प्रमाण पत्र / पासपोर्ट / पैन कार्ड / खतौनी नक़ल  बनाने तथा नक़ल(प्रतिलिपि) के लिए सम्पर्क करे |धोखाधड़ी से बचे आई आर सी टी सी अधिकृत फार्म से टिकट कराये,सुखद यात्रा करे| वेटिग टिकट से यात्रा न करे |विशेष जानकारी के लिए सम्पर्क करे |</span></td></table></td></tbody></html>'
document.getElementById('iframeBanners').style.visibility = "hidden";