// ==UserScript==
// @name     Cachys Blog dark
// @description Anpassungen auf Cachys Blog, dark
// @version  1.1
// @grant    none
// @match https://*.stadt-bremerhaven.de/*
// @require https://ajax.googleapis.com/ajax/libs/jquery/3.3.1/jquery.min.js
// @namespace https://greasyfork.org/users/233939
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/468700/Cachys%20Blog%20dark.user.js
// @updateURL https://update.greasyfork.org/scripts/468700/Cachys%20Blog%20dark.meta.js
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
$('p').css({'background-color' : bgcolor, 'color' : txtcolor})
$('footer').css({'background-color' : bgcolor, 'color' : txtcolor})
$('.group').css({'background-color' : bgcolor, 'color' : txtcolor})

function removeAdBar(){
$('div').filter(function () {
        return $(this).css('bottom') == '0px';
    }).slice(-1).remove();
}


window.addEventListener('focus', function(event){
setTimeout(removeAdBar, 2500);
setTimeout(removeAdBar, 3500);
}, false);