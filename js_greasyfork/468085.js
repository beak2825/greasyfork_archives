// ==UserScript==
// @name         New Userscript
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Script to change div element class
// @author       You
// @match        https://betterplaceuae.me.greythr.com/ngapp/payroll/main/overview/
// @icon         https://www.google.com/s2/favicons?sz=64&domain=greythr.com
// @grant        none
// @license MIT 
// @downloadURL https://update.greasyfork.org/scripts/468085/New%20Userscript.user.js
// @updateURL https://update.greasyfork.org/scripts/468085/New%20Userscript.meta.js
// ==/UserScript==

/*globals $*/

$(document).ready(function(){

var selected=document.querySelectorAll("powered-by-logo pull-right");
   for(var i = 0, max = selected.length; i < max; i++) {
    selected[i].className="pull-right";
   }
});
