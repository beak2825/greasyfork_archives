// ==UserScript==
// @name         bot for ultrex.io
// @namespace    http://tampermonkey.net/
// @version      0.5
// @description  Fastest Mass Ejector & Split Macro
// @match        ultrex.io
// @grant        none
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/375099/bot%20for%20ultrexio.user.js
// @updateURL https://update.greasyfork.org/scripts/375099/bot%20for%20ultrexio.meta.js
// ==/UserScript==
 
var e = $.Event("keydown", { keyCode: 87}); //"keydown" if that's what you're doing
$("body").trigger(e)

 
var r = $.Event("keydown", { keyCode: 84}); //"keydown" if that's what you're doing 
$("body").trigger(r)