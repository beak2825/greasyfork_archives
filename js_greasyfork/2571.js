// ==UserScript==
// @author     DCI 
// @name       Lplay (Safe)
// @version    2.1
// @description x
// @require     http://code.jquery.com/jquery-latest.min.js
// @include     https://www.mturk.com/mturk/submit
// @include     https://www.mturk.com/mturk/continue*
// @include     file:///C:/Users/Main/Desktop/Lplay.htm
// @namespace urmom
// @downloadURL https://update.greasyfork.org/scripts/2571/Lplay%20%28Safe%29.user.js
// @updateURL https://update.greasyfork.org/scripts/2571/Lplay%20%28Safe%29.meta.js
// ==/UserScript==

var textsearch = $( ":contains('Is this an online store?')" );
if (textsearch.length){
$("li").hide();
$('.overview-wrapper').eq(0).hide();}

var iframe = document.createElement('iframe');
iframe.src = $("a:contains('http')")[0].href;
iframe.width=1000;
iframe.height=500;
$(iframe).css('max-height', '500px');
$(iframe).css('max-width', '1000px');


if (textsearch.length){
$("a:contains('http')").eq(0).append(document.createElement('p'));
$("a:contains('http')").eq(0).append(iframe);}

if (textsearch.length){
document.addEventListener( "keydown", kas, false);}

var ev = $.Event('keypress');

function kas(i) {   
if ( i.keyCode == 112 ) { //F1 - 
    i.preventDefault();
    $('input[name="Answer_1"]').eq(0).click();
    $('input[name="/submit"]').eq(0).click();
       }
if ( i.keyCode == 113 ) { //F2 - 
    i.preventDefault();
   $('input[name="Answer_1"]').eq(1).click();
   $('input[name="/submit"]').eq(0).click();
       }
if ( i.keyCode == 114 ) { //F3 - 
    i.preventDefault();
    $('input[name="Answer_1"]').eq(2).click();
    $('input[name="/submit"]').eq(0).click();
       }
if ( i.keyCode == 115 ) { //F4 - 
    i.preventDefault();
    $('input[name="Answer_1"]').eq(3).click();
    $('input[name="/submit"]').eq(0).click();
       }
if ( i.keyCode == 116 ) { //F5 - 
    i.preventDefault();
    $('input[name="Answer_1"]').eq(4).click();
    $('input[name="/submit"]').eq(0).click();
       }   
   }