// ==UserScript==
// @name         Macro Feed
// @namespace    http://tampermonkey.net/
// @version      1738
// @description  Macro Feed!
// @author       Agar_Swag
// @match        http://agar.io/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/19799/Macro%20Feed.user.js
// @updateURL https://update.greasyfork.org/scripts/19799/Macro%20Feed.meta.js
// ==/UserScript==
var interval;
var switchy = false;
$(document).on('keydown',function(e){
if(e.keyCode == 81){
if(switchy){
return;
}
switchy = true;
interval = setInterval(function() {
console.log('firing')
$("body").trigger($.Event("keydown", { keyCode: 87})); $("body").trigger($.Event("keyup", { keyCode: 87})); 
}, 10);//increase this number to make it fire them out slower
}
})

$(document).on('keyup',function(e){
if(e.keyCode == 81){
switchy = false;
clearInterval(interval);
return;
}
})