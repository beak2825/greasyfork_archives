// ==UserScript==
// @name        Keepa for Safari
// @description Loads Keepa price tracker for Amazon domains in Safari
// @author Skeptical Alien
// @license https://creativecommons.org/licenses/by-sa/4.0/
// @include     https://www.amazon.*/*/dp/*
// @include     https://www.amazon.*/dp/*
// @include     https://www.amazon.*/gp/product/*
// @version     1.0.1
// @icon
// @namespace https://greasyfork.org/en/users/685853-skeptical-alien
// @downloadURL https://update.greasyfork.org/scripts/410998/Keepa%20for%20Safari.user.js
// @updateURL https://update.greasyfork.org/scripts/410998/Keepa%20for%20Safari.meta.js
// ==/UserScript==
var prod_code;
if (prod_code = window.location.pathname.match(/^\/gp\/product\/(.*)\/.*$/)) {
  prod_code = prod_code[1]
}
else if (prod_code = window.location.pathname.match(/^\/.*\/dp\/(.*)\/.*$/)) {
  prod_code = prod_code[1];
}
else if (prod_code = window.location.pathname.match(/^\/dp\/(.*)\/.*$/)) {
  prod_code = prod_code[1];
}
else if(prod_code = window.location.pathname.match(/^\/gp\/product\/(.*)\\?.*$/)) {
  prod_code = prod_code[1];
}
else if (prod_code = window.location.pathname.match(/^\/.*\/dp\/(.*)\\?.*$/)) {
  prod_code = prod_code[1];
}
else if (prod_code = window.location.pathname.match(/^\/dp\/(.*)\\?.*$/)) {
  prod_code = prod_code[1];
}

var numl=0;
switch(document.location.hostname.match('.*\.amazon\.(.*)$')[1]){
    case 'com':
      numl=1;
      break;
    case 'ca':
      numl=6;
      break;
    case 'mx':
      numl=11;
      break;
    case 'uk':
      numl=2;
      break;
    case 'de':
      numl=3;
      break;
    case 'fr':
      numl=4;
      break;
    case 'it':
      numl=8;
      break;
    case 'es':
      numl=9;
      break;
    case 'jp':
      numl=5;
      break;
    case 'in':
      numl=10;
      break;
}

document.querySelector('#hover-zoom-end').innerHTML += '<div style="min-width: 935px; max-width: 960px; display: flex; height: 357px; border: 0px none; margin: 10px 0px 0px;" id="keepaContainer"><iframe style="width: 100%; height: 100%; border: 0px none; overflow: hidden;" src="https://keepa.com/iframe_addon.html#'+numl+'-0-'+prod_code+'" scrolling="no" id="keepa"></iframe></div>'
