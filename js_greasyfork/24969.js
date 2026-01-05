// ==UserScript==
// @name         Anti-kill script 
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Slight chance to avoid a kill. You input your minimum value and if your health reaches or goes below that value, your connect will stop instantly.
// @author       HighNoon643
// @match        http://vertix.io/
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/24969/Anti-kill%20script.user.js
// @updateURL https://update.greasyfork.org/scripts/24969/Anti-kill%20script.meta.js
// ==/UserScript==


var userInp=prompt("what would you like your minimum health to be?");userInp<=0&&(alert("That is not a number/Too low"),userInp=prompt("what would you like your minimum health to be?"));var int=setInterval(function(){player.health<userInp&&(clearInterval(int),socket.close());},5);