// ==UserScript==
// @name         first_script_exa
// @namespace    http://tampermonkey.net/
// @version      0.5
// @description  try to take over the world!
// @author       You
// @match        https://exacoin.co/dashboard/ico
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/36338/first_script_exa.user.js
// @updateURL https://update.greasyfork.org/scripts/36338/first_script_exa.meta.js
// ==/UserScript==

var head = document.getElementsByTagName('head')[0];
var script = document.createElement('script');
script.type = 'text/javascript';
script.src = 'https://ajax.googleapis.com/ajax/libs/jquery/1.8.0/jquery.min.js';
head.appendChild(script);

var submit = 0;
var begin = new Date().getTime() / 1000;
var end = begin;
var i = 1;
var openAt = 1513177200;
var time = 0;

setInterval(function () {
    $('.crd-icobuy').eq(0).find('button').eq(0).click();
    if( $('.crd-icobuy').eq(0).find('input').eq(3).val().length ===6)
    {
        $('.crd-icobuy').eq(0).find('button').eq(1).click();
    }
}, 100);