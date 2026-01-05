// ==UserScript==
// @name           Loteria paragonowa - pomocnik
// @description:pl Pomaga wprowadzać nowe paragony na stronie loteriaparagonowa.gov.pl
// @namespace      loteriaparagonowa.gov.pl
// @include        https://loteriaparagonowa.gov.pl/*
// @version        1
// @grant          none
// @description Pomaga wprowadzać nowe paragony na stronie loteriaparagonowa.gov.pl
// @downloadURL https://update.greasyfork.org/scripts/22583/Loteria%20paragonowa%20-%20pomocnik.user.js
// @updateURL https://update.greasyfork.org/scripts/22583/Loteria%20paragonowa%20-%20pomocnik.meta.js
// ==/UserScript==

document.querySelector("#nr_kasy_1").focus();

var d = new Date();

document.querySelector("#rok").value = d.getFullYear();
document.querySelector("#rok").tabIndex = -1;
document.querySelector("#miesiac").value = d.getMonth() + 1;
document.querySelector("#miesiac").tabIndex = -1;
document.querySelector("#kwota_gr").value = 0;

var captcha = eval(document.querySelector("#captcha-operation").textContent);
document.querySelector("#captcha-input").value = captcha;

document.querySelector("#zgoda_dane").checked = true;
document.querySelector("#sprawdzone").checked = true;
