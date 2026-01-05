// ==UserScript== 
// @name ЦИРК ДОЛБАЕБОВ 
// @namespace http://tampermonkey.net/ 
// @version 0.1 
// @description MAMY EBAL 
// @author You 
// @match http://petridish.pw/* 
// @grant none 
// @downloadURL https://update.greasyfork.org/scripts/24159/%D0%A6%D0%98%D0%A0%D0%9A%20%D0%94%D0%9E%D0%9B%D0%91%D0%90%D0%95%D0%91%D0%9E%D0%92.user.js
// @updateURL https://update.greasyfork.org/scripts/24159/%D0%A6%D0%98%D0%A0%D0%9A%20%D0%94%D0%9E%D0%9B%D0%91%D0%90%D0%95%D0%91%D0%9E%D0%92.meta.js
// ==/UserScript==   
/* jshint -W097 */ 
'use strict'; 

// Your code here... 
var interval; 
var switchy = false; 
$(document).on('keydown',function(e){ 
if(e.keyCode == 86){ 
if(switchy){ 
return; 
} 
switchy = true; 
interval = setInterval(function() { 
console.log('firing') 
$("body").trigger($.Event("keydown", { keyCode: 32})); 
$("body").trigger($.Event("keyup", { keyCode: 32})); 
}, 10);//increase this number to make it fire them out slower 
} 
}) 

$(document).on('keyup',function(e){ 
if(e.keyCode == 86){ 
switchy = false; 
clearInterval(interval); 
return; 
} 
})