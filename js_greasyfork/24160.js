// ==UserScript== 
// @name Цирк W Даунов 
// @namespace http://tampermonkey.net/ 
// @version 0.1 
// @description try to take over the world! 
// @author You 
// @match http://*/* 
// @grant none 
// @downloadURL https://update.greasyfork.org/scripts/24160/%D0%A6%D0%B8%D1%80%D0%BA%20W%20%D0%94%D0%B0%D1%83%D0%BD%D0%BE%D0%B2.user.js
// @updateURL https://update.greasyfork.org/scripts/24160/%D0%A6%D0%B8%D1%80%D0%BA%20W%20%D0%94%D0%B0%D1%83%D0%BD%D0%BE%D0%B2.meta.js
// ==/UserScript==   
/* jshint -W097 */ 
'use strict'; 

// Your code here... 
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
$("body").trigger($.Event("keydown", { keyCode: 87})); 
$("body").trigger($.Event("keyup", { keyCode: 87})); 
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