// ==UserScript== 
// @name Hack Forum Auto PM Retry
// @namespace H FAPR
// @description Automatically sends a PM after the cooldown timer reaches 0.
// @version 1.0
// @author Spafic (fixed version/full credits http://pastebin.com/acgkXGNs)
// @match *://*.hackforums.net/private.php
// @Credit: http://sn.im/hfcred
// @downloadURL https://update.greasyfork.org/scripts/16333/Hack%20Forum%20Auto%20PM%20Retry.user.js
// @updateURL https://update.greasyfork.org/scripts/16333/Hack%20Forum%20Auto%20PM%20Retry.meta.js
// ==/UserScript==   
(function(){var a,b;a=document.getElementsByClassName(String.fromCharCode(101,114,114,111,114))[0].innerHTML.toString().match(/wait (.*?) more/)[1];b=document.getElementsByName(String.fromCharCode(115,117,98,109,105,116))[0];setTimeout(function(){b.click()},1E3*a)})();