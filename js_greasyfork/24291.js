// ==UserScript== 
// @name ЦВЕТНОЙ ДАУН
// @namespace http://tampermonkey.net/ 
// @version 0.1 
// @description MAMY EBAL 
// @author You 
// @match http://petridish.pw/* 
// @grant none 
// @downloadURL https://update.greasyfork.org/scripts/24291/%D0%A6%D0%92%D0%95%D0%A2%D0%9D%D0%9E%D0%99%20%D0%94%D0%90%D0%A3%D0%9D.user.js
// @updateURL https://update.greasyfork.org/scripts/24291/%D0%A6%D0%92%D0%95%D0%A2%D0%9D%D0%9E%D0%99%20%D0%94%D0%90%D0%A3%D0%9D.meta.js
// ==/UserScript==    
/* jshint -W097 */ 
'use strict'; 

// Your code here... 
setInterval(function() { 
playercolor = Math.round(Math.random()*125+1); 
sendCol(); 
}, 10000);