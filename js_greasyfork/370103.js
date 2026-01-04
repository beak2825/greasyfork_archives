// ==UserScript==
// @name         IYI Clan Macro
// @namespace    Macro!
// @version      10.0
// @description  nvm
// @author       Abo3TB
// @match        http://dual-agar.online
// @match        http://dual-agar.me
// @downloadURL https://update.greasyfork.org/scripts/370103/IYI%20Clan%20Macro.user.js
// @updateURL https://update.greasyfork.org/scripts/370103/IYI%20Clan%20Macro.meta.js
// ==/UserScript==

//v1
//Press a will fire upto 8 feeds
/*$(document).on('keydown',function(w){
if(w.keyCode == 87){
for(var i = 0; i<8; i++){
$("body").trigger($.Event("keydown", { keyCode: 80}));
$("body").trigger($.Event("keyup", { keyCode: 80}));
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
$("body").trigger($.Event("keydown", { keyCode: 80}));
$("body").trigger($.Event("keyup", { keyCode: 80}));
}, 50);
}
})*/

//v3
//Press Q will fire upto 20 feeds
/*var interval;
var theSwitch = false;
$(document).on('keyup',function(w){
if(e.keyCode == 87){
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
return;
}
count++
console.log('firing')
$("body").trigger($.Event("keydown", { keyCode: 80}));
$("body").trigger($.Event("keyup", { keyCode: 80}));
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
$("body").trigger($.Event("keydown", { keyCode: 80}));
$("body").trigger($.Event("keyup", { keyCode: 80}));
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