// ==UserScript==
// @name         New Userscript
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  try to take over the world!
// @author       You
// @match        http://bitcocity.com/index.php?do=/bonus/
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/18940/New%20Userscript.user.js
// @updateURL https://update.greasyfork.org/scripts/18940/New%20Userscript.meta.js
// ==/UserScript==
/* jshint -W097 */
'use strict';

// Your code here...
var unicorn = document.getElementsByClassName('button gray medium')[0]
if (unicorn) setTimeout(function(){ unicorn.click(); }, 7000);
else setTimeout(function(){location.reload()}, 62*60*1000);