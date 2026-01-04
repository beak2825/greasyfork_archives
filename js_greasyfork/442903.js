// ==UserScript==
// @name         Kahoot Nickname Length Bypass
// @namespace    http://tampermonkey.net/
// @version      1.0.3
// @license      MIT
// @description  Bypasses nickname length for Kahoot!
// @author       MegaKonami
// @match        *://kahoot.it*
// @icon         https://play-lh.googleusercontent.com/OOTBPTiGOs6jDhZSLCfwzXTSkELqoo5DBNcpl0O3pRXCwHcPCQ_-z0Yk8BpT45nu_A
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/442903/Kahoot%20Nickname%20Length%20Bypass.user.js
// @updateURL https://update.greasyfork.org/scripts/442903/Kahoot%20Nickname%20Length%20Bypass.meta.js
// ==/UserScript==

(function() { 'use strict'; setInterval(function() { document.getElementsByName('nickname').forEach(function(currentValue, index, array) { var v=currentValue,i=index,a=array; v.removeAttribute('maxLength'); v.placeholder = 'Nickname (No Length)'})}, 100);})();