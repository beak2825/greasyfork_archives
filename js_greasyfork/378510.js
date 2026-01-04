// ==UserScript==
// @name         Pin Resize Canvas
// @author       Tehapollo
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  try to take over the world!
// @include      https://sofia*.pinadmin.com/*
// @include      https://api.pinterest.com/*
// @require      https://code.jquery.com/jquery-latest.min.js
// @grant        GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/378510/Pin%20Resize%20Canvas.user.js
// @updateURL https://update.greasyfork.org/scripts/378510/Pin%20Resize%20Canvas.meta.js
// ==/UserScript==

$(document).ready(function(){
 var startresize = setInterval(function(){ resizer(); }, 250);

    function resizer(){
var canvas=document.getElementById("2");
var context =canvas.getContext("2d");
    canvas.style.width="650px";
    canvas.style.height="350px";
clearInterval(startresize);


 }
     $(document).keypress(function(event){

         var startresize = setInterval(function(){ resizer(); }, 250);
         });

})();