// ==UserScript==
// @name         Flood Mass - ChopCoin
// @namespace    ChopCoin
// @version      1.01
// @description  Flood mass when you press Q
// @author       HPrivakos
// @match        http://chopcoin.io/*
// @downloadURL https://update.greasyfork.org/scripts/15887/Flood%20Mass%20-%20ChopCoin.user.js
// @updateURL https://update.greasyfork.org/scripts/15887/Flood%20Mass%20-%20ChopCoin.meta.js
// ==/UserScript==

var interval;
var switchy = false;
$(document).on('keydown',function(e){
console.log('keydown e.keyCode="'+e.keyCode+'"');
if(e.keyCode == 81){
console.log('keydown 81, switchy '+switchy);
if(switchy){
return;
}
switchy = true;
interval = setInterval(function() {
console.log('firing');
$("body").trigger($.Event("keydown", { keyCode: 87}));
$("body").trigger($.Event("keyup", { keyCode: 87}));
}, 40);//increase this number to make it fire them out slower
}
})

$(document).on('keyup',function(e){
console.log('keyup e.keyCode="'+e.keyCode+'"');
if(e.keyCode == 81){
console.log('stop firing');
switchy = false;
clearInterval(interval);
return;
}
})