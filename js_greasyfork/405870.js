// ==UserScript==
// @name        Amazon keepa
// @description Amazon keepa plugin
// @author Maxeo // Modified by SPeedY_B
// @license https://creativecommons.org/licenses/by-sa/4.0/
// @include     https://www.amazon.*/*/dp/*
// @include     https://www.amazon.*/dp/*
// @include     https://www.amazon.*/gp/product/*
// @version     1.0
// @icon        https://greasyfork.org/system/screenshots/screenshots/000/006/429/original/asd.png
// @namespace https://greasyfork.org/en/users/625486
// @downloadURL https://update.greasyfork.org/scripts/405870/Amazon%20keepa.user.js
// @updateURL https://update.greasyfork.org/scripts/405870/Amazon%20keepa.meta.js
// ==/UserScript==
var prod_code;
if (prod_code = window.location.pathname.match(/^\/gp\/product\/(.*)\/.*$/)) {      prod_code = prod_code[1]; }
else if (prod_code = window.location.pathname.match(/^\/.*\/dp\/(.*)\/.*$/)) {      prod_code = prod_code[1]; }
else if (prod_code = window.location.pathname.match(/^\/dp\/(.*)\/.*$/)) {          prod_code = prod_code[1]; }
else if(prod_code = window.location.pathname.match(/^\/gp\/product\/(.*)\\?.*$/)) { prod_code = prod_code[1]; }
else if (prod_code = window.location.pathname.match(/^\/.*\/dp\/(.*)\\?.*$/)) {     prod_code = prod_code[1]; }
else if (prod_code = window.location.pathname.match(/^\/dp\/(.*)\\?.*$/)) {         prod_code = prod_code[1]; }
var numl=0;
switch(document.location.hostname.match('.*\.amazon\.(.*)$')[1]){
    case 'com':     numl=1;   break;
    case 'co.uk':   numl=2;   break;
    case 'de':      numl=3;   break;
    case 'fr':      numl=4;   break;
    case 'co.jp':   numl=5;   break;
    case 'ca':      numl=6;   break;
    case 'it':      numl=8;   break;
    case 'es':      numl=9;   break;
    case 'in':      numl=10;  break;
    case 'mx':      numl=11;  break;
}
document.querySelector('#centerCol').insertAdjacentHTML('beforeend', '<iframe style="width: 100%; height: 400px; border:1px solid black; overflow: visible; " src="https://keepa.com/iframe_addon.html#'+numl+'-0-'+prod_code+'" scrolling="no" id="keepa"></iframe>')