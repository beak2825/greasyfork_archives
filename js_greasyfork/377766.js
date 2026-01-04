// ==UserScript==
// @name         Chatbox Temporary Fix
// @namespace    http://tampermonkey.net/
// @version      1.1
// @description  try to take over the world!
// @author       You
// @match        http://www.veneficium.org/chatbox/index.forum*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/377766/Chatbox%20Temporary%20Fix.user.js
// @updateURL https://update.greasyfork.org/scripts/377766/Chatbox%20Temporary%20Fix.meta.js
// ==/UserScript==

setInterval(function(){
    chatbox.get();
}, 2000);