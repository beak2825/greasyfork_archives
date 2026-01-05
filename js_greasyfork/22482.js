// ==UserScript==
// @name         VSR
// @namespace    https://greasyfork.org/en/users/27845
// @version      1.0
// @description  VSR stuff
// @author       Pablo Escobar
// @include      https://www.mturk.com/mturk/*
// @require      https://ajax.googleapis.com/ajax/libs/jquery/2.1.3/jquery.min.js
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/22482/VSR.user.js
// @updateURL https://update.greasyfork.org/scripts/22482/VSR.meta.js
// ==/UserScript==

var code = $('h3').eq(1).text().substring(23,99);
var defaultURL = 'https://www.google.com/search?q=' + " "  + code.replace(/&/g,'%26') + "  " + '-ebay';

var w = screen.availWidth/2;
var h = screen.availHeight;
myWindow = window.open(defaultURL, 'Search Page', 'width='+w+', height='+h+', scrollbars=yes, toolbar=yes');
myWindow.moveTo(w,0);
myWindow.blur();
self.focus();
$('#mturk_form').submit(function(evt){
myWindow.close();
});

var autosubmit = true;
window.focus();

window.onkeydown = function (event) {
   if ((event.keyCode === 49)) { // 1
       $("#Answer_4").click();
   if (autosubmit) {
       $( 'input[name="/submit"]' ).eq(0).click();
       }
   }
};