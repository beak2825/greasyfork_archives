// ==UserScript==
// @name        Otpusk
// @description Подсказки для лабораторий
// @namespace   virta
// @include     https://virtonomica.*/*/main/unit/view/*
// @include     https://virtonomica.*/*/main/company/view/*
// @version     1.000001
// @grant       none
// @downloadURL https://update.greasyfork.org/scripts/395960/Otpusk.user.js
// @updateURL https://update.greasyfork.org/scripts/395960/Otpusk.meta.js
// ==/UserScript==
var win = (typeof(unsafeWindow) != 'undefined' ? unsafeWindow : top.window);
$ = win.$;
if((/(?:company)/.test(location.href))){
//прячем отпускников
$('table.unit-list-2014 tr').each(function(){
if($('td.prod>img[title*="отпуск"]',this).length){$(this).css({opacity:0.3})}});
}