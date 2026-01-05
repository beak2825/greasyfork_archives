// ==UserScript==
// @name         StarryNightPlusPack
// @namespace    http://raidforums.com/
// @version      0.3
// @description  try to take over the world!
// @author       You
// @match        https://raidforums.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/19668/StarryNightPlusPack.user.js
// @updateURL https://update.greasyfork.org/scripts/19668/StarryNightPlusPack.meta.js
// ==/UserScript==

//Credit to Jackz//

function greentext() {
var test
setInterval(function() {
$('.content_msgShout').each(function(test) {
test = $(this).text();
if (test.slice(0,1) == '>') {
$(this).css('color', '#00FF00');
}});
},100);
}
greentext()

function redtext() {
var test
setInterval(function() {
$('.content_msgShout').each(function(test) {
test = $(this).text();
if (test.slice(0,2) == 'k') {
$(this).css('color', '#FF0000');
}});
},100);
}
redtext()

function bluetext() {
var test
setInterval(function() {
$('.content_msgShout').each(function(test) {
test = $(this).text();
if (test.slice(0,1) == 'f') {
$(this).css('color', '#0000ff');
}});
},100);
}
bluetext()

$('img').each(function(){ 
    if ($(this).attr('src') == 'https://cdn.raidforums.com/s/logo.png' ){
        $(this).remove(); 
    }
});