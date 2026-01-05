// ==UserScript==
// @name         Jared Hawkins
// @namespace    https://greasyfork.org/en/users/27845
// @version      1.0
// @description  Opens search window.
// @author       Pablo Escobar
// @include      https://s3.amazonaws.com/*
// @require      https://ajax.googleapis.com/ajax/libs/jquery/2.1.3/jquery.min.js
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/22347/Jared%20Hawkins.user.js
// @updateURL https://update.greasyfork.org/scripts/22347/Jared%20Hawkins.meta.js
// ==/UserScript==


var Name = $('td').eq(1).text().trim();
var defaultURL = 'https://www.google.com/search?q=twitter' + " " +Name.replace(/&/g,'%26');


$("input[name=web_url]").focus();


var w = screen.availWidth/2;
var h = screen.availHeight;
myWindow = window.open(defaultURL, 'Search Page', 'width='+w+', height='+h+', scrollbars=yes, toolbar=yes');
myWindow.moveTo(w,0);
myWindow.blur();
self.focus();
$('#mturk_form').submit(function(evt){
myWindow.close();
});