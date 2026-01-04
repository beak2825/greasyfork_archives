// ==UserScript==
// @name         破產把手_2
// @namespace    http://tampermonkey.net/
// @version      0.12
// @description  try to take over the world!
// @author       You
// @match        http://www.neopets.com/space/leverofdoom.phtml
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/35266/%E7%A0%B4%E7%94%A2%E6%8A%8A%E6%89%8B_2.user.js
// @updateURL https://update.greasyfork.org/scripts/35266/%E7%A0%B4%E7%94%A2%E6%8A%8A%E6%89%8B_2.meta.js
// ==/UserScript==



if($("*:contains('Something Has Happened')").length == 0)
{
setTimeout(function(){$('input[value="Go Back to the Lever"]').trigger("click");},Math.floor(Math.random()*2000))
}