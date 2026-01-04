// ==UserScript==
// @name         macro by me :>
// @namespace    Macro!
// @version      119
// @author       Abo3Tb
// @match        http://dual-agar.online
// @match        http://dual-agar.me
// @match        http://ixagar.net/
// @match        http://ixagar.net/classic/
// @grant        none
// @description nothing
// @downloadURL https://update.greasyfork.org/scripts/370624/macro%20by%20me%20%3A%3E.user.js
// @updateURL https://update.greasyfork.org/scripts/370624/macro%20by%20me%20%3A%3E.meta.js
// ==/UserScript==

//v1
//Press a will fire upto 8 feeds
/*$(document).on('keydown',function(w){
if(w.keyCode == 87){
for(var i = 0; i<8; i++){
$("body").trigger($.Event("keydown", { keyCode: 69}));
$("body").trigger($.Event("keyup", { keyCode: 69}));
}
}
})
*/

//v2
//Press a will fire upto 8 feeds
/*$(document).on('keyup',function(w){
if(w.keyCode == 87){
var count = 0;
var interval = setInterval(function() {
if(count > 7){
clearInterval(interval);
return;
}
count++
console.log('firing')
$("body").trigger($.Event("keydown", { keyCode: 69}));
$("body").trigger($.Event("keyup", { keyCode: 69}));
}, 50);
}
})*/

//v3
//Press Q will fire upto 20 feeds
/*var interval;
var theSwitch = false;
$(document).on('keyup',function(w){
if(w.keyCode == 87){
var count = 0;
if(theSwitch){
theSwitch = false;
clearInterval(interval);
return;
}
theSwitch = true;
interval = setInterval(function() {
if(count > 20){ //Change this number if you want more
theSwitch = false;
clearInterval(interval);
dual agar
An extended agar server for dual operation multiboxing feature.
ixagar.net
agar private server.
theSwitch = true;
interval = setInterval(function() {
if(count > 20){ //Change this number if you want more
theSwitch = false;
clearInterval(interval);
return;
}
count++
console.log('firing')
$("body").trigger($.Event("keydown", { keyCode: 69}));
$("body").trigger($.Event("keyup", { keyCode: 69}));
}, 10);//increase this number to make it fire them out slower
}
})*/

//v4
//Hold a down and it will keep firing untill you take your finger off!
console.log('called');
var interval;
var switchy = false;
$(document).on('keydown',function(w){
console.log('keydown w.keyCode="'+w.keyCode+'"');
if(w.keyCode == 87){
console.log('keydown 87, switchy '+switchy);
if(switchy){
return;
}
switchy = true;
interval = setInterval(function() {
console.log('firing');
$("body").trigger($.Event("keydown", { keyCode: 69}));
$("body").trigger($.Event("keyup", { keyCode: 69}));
}, 3);//increase this number to make it fire them out slower
}
})

$(document).on('keyup',function(w){
console.log('keyup e.keyCode="'+w.keyCode+'"');
if(w.keyCode == 87){
console.log('stop firing');
switchy = false;
clearInterval(interval);
return;
}
})