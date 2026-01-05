// ==UserScript==
// @name         Script
// @namespace    D SPLIT
// @version      1
// @description  MDAMDAMDA
// @author       Unknown
// @match        http://petri.online/
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/20793/Script.user.js
// @updateURL https://update.greasyfork.org/scripts/20793/Script.meta.js
// ==/UserScript==

//v1
/*$(document).on('keydown',function(e){
if(e.keyCode == 81){
for(var i = 0; i<8; i++){
$("body").trigger($.Event("keydown", { keyCode: 68}));
$("body").trigger($.Event("keyup", { keyCode: 68}));
}
}
})
*/

//v2
/*$(document).on('keyup',function(e){
if(e.keyCode == 81){
var count = 0;
var interval = setInterval(function() {
if(count > 7){
clearInterval(interval);
return;
}
count++
console.log('firing')
$("body").trigger($.Event("keydown", { keyCode: 68}));
$("body").trigger($.Event("keyup", { keyCode: 68}));
}, 10);
}
})*/

//v3
//Press Q 
/*var interval;
var theSwitch = false;
$(document).on('keyup',function(e){
if(e.keyCode == 81){
var count = 0;
if(theSwitch){
theSwitch = false;
clearInterval(interval);
return;
}
theSwitch = true;
interval = setInterval(function() {
if(count > 20){ //Поменяй
theSwitch = false;
clearInterval(interval);
return;
}
count++
console.log('firing')
$("body").trigger($.Event("keydown", { keyCode: 68}));
$("body").trigger($.Event("keyup", { keyCode: 68}));
}, 10);//More and slow
}
})*/

//v4
//Hold
console.log('called');
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
$("body").trigger($.Event("keydown", { keyCode: 68}));
$("body").trigger($.Event("keyup", { keyCode: 68}));
}, 3);//dada
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