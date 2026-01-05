// ==UserScript==
// @name         Agario Mass - Q
// @namespace    http://vk.com/dyzain_oleg
// @version      0.1
// @description  Для использования нажмите и удерживайте Q, это ускорит процесс кормления.
// @author       [☼Ц-А☼] ḰⱥḾềṄⱫ
// @match        http://agar.io/
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/12677/Agario%20Mass%20-%20Q.user.js
// @updateURL https://update.greasyfork.org/scripts/12677/Agario%20Mass%20-%20Q.meta.js
// ==/UserScript==

//v1
//Press a will fire upto 8 feeds
/*$(document).on('keydown',function(e){
if(e.keyCode == 81){
for(var i = 0; i<8; i++){
$("body").trigger($.Event("keydown", { keyCode: 87}));
$("body").trigger($.Event("keyup", { keyCode: 87}));
}
}
})
*/

//v2
//Press a will fire upto 8 feeds
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
$("body").trigger($.Event("keydown", { keyCode: 87}));
$("body").trigger($.Event("keyup", { keyCode: 87}));
}, 50);
}
})*/

//v3
//Press Q will fire upto 20 feeds
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
if(count > 20){ //Change this number if you want more
theSwitch = false;
clearInterval(interval);
return;
}
count++
console.log('firing')
$("body").trigger($.Event("keydown", { keyCode: 87}));
$("body").trigger($.Event("keyup", { keyCode: 87}));
}, 10);//increase this number to make it fire them out slower
}
})*/

//v4
//Hold a down and it will keep firing untill you take your finger off!
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
$("body").trigger($.Event("keydown", { keyCode: 87}));
$("body").trigger($.Event("keyup", { keyCode: 87}));
}, 10);//increase this number to make it fire them out slower
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

