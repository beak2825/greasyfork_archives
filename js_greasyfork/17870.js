// ==UserScript==
// @name         Diamondhunt servermessage
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  try to take over the world!
// @author       You
// @match        http://www.diamondhunt.co/game.php
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/17870/Diamondhunt%20servermessage.user.js
// @updateURL https://update.greasyfork.org/scripts/17870/Diamondhunt%20servermessage.meta.js
// ==/UserScript==
/* jshint -W097 */
'use strict';

// Your code here...

window.setInterval(function(){
$("span[style='color:blue;']").css("color","#0086b3"); }, 1000);