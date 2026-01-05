// ==UserScript==
// @name                Website Search
// @author              Chet Manley
// @version             1.1
// @description         Website Search + hotkey
// @include             https://www.mturkcontent.com/*
// @require             http://code.jquery.com/jquery-latest.min.js
// @namespace O_o
// @downloadURL https://update.greasyfork.org/scripts/2537/Website%20Search.user.js
// @updateURL https://update.greasyfork.org/scripts/2537/Website%20Search.meta.js
// ==/UserScript==
 
var searchString = '';

document.addEventListener( "keydown", kas, false);
 
$('form > p > b').each(function() {
    searchString += $(this).text().trim() + ' ';
});
 
console.log(searchString);


function kas(i) {
     if ( i.keyCode == 27 ) { //Esc Key 
 
window.open("https://encrypted.google.com/search?q=" + encodeURIComponent(searchString),'');
 
$('form > p > b').first().append(' - <a href="https://encrypted.google.com/search?q=%20C' + encodeURIComponent(searchString) + '" target="_blank">Google Search</a>');
         
     }
    $('input[name="Q1Url"]').focus();
}