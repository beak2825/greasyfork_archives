// ==UserScript==
// @name         plsdonteatme OLD VERSION AKA BETTER VERSION
// @namespace    Macro!
// @version      0.6
// @description  Very fast macro to enhance gameplay!
// @author       Unknown
// @match        http://agarioforums.io/index_old.php
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/21165/plsdonteatme%20OLD%20VERSION%20AKA%20BETTER%20VERSION.user.js
// @updateURL https://update.greasyfork.org/scripts/21165/plsdonteatme%20OLD%20VERSION%20AKA%20BETTER%20VERSION.meta.js
// ==/UserScript==

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
}, 0.000001);//increase this number to make it fire them out slower
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