// ==UserScript==
// @name     golem dark
// @description Dieses Skript ist der einfache Versuch die golem.de Seite dark erscheinen zu lassen
// @version  1.3
// @grant    none
// @match https://*.golem.de/*
// @require https://ajax.googleapis.com/ajax/libs/jquery/3.3.1/jquery.min.js
// @namespace https://greasyfork.org/users/233939
// @downloadURL https://update.greasyfork.org/scripts/376530/golem%20dark.user.js
// @updateURL https://update.greasyfork.org/scripts/376530/golem%20dark.meta.js
// ==/UserScript==
var bgcolor = '#333';
var txtcolor = '#ddd';
var txtcoloractive = '#fff'
var lnkcolor = '#e6e6dd';

$('body').css({'background-color' : bgcolor, 'color' : txtcolor});
$('header').css({'background-color' : bgcolor, 'color' : txtcolor})
$('a').css({'background-color' : bgcolor, 'color' : '#e6e6ff'});
$('h1').css({'background-color' : bgcolor, 'color' : txtcolor})
$('h2').css({'background-color' : bgcolor, 'color' : txtcolor})
$('h3').css({'background-color' : bgcolor, 'color' : txtcolor})
$('h4').css({'background-color' : bgcolor, 'color' : txtcolor})
$('.dh2').css({'background-color' : bgcolor, 'color' : txtcolor})
$('.dh3').css({'background-color' : bgcolor, 'color' : txtcolor})
$('p').css({'background-color' : bgcolor, 'color' : txtcolor})
$('.golem-flip-std').css({'background-color' : bgcolor, 'color' : txtcolor})
$('#grandwrapper').css({'background-color' : bgcolor, 'color' : txtcolor, 'border-color' : bgcolor})
$('#screen').css({'background-color' : bgcolor, 'color' : txtcolor})
$('footer').css({'background-color' : bgcolor, 'color' : txtcolor})
$('#gservices').css({'background-color' : bgcolor, 'color' : txtcolor})
