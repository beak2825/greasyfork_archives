// ==UserScript==
// @name         New Userscript
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  try to take over the world!
// @author       You
// @match        https://*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/20536/New%20Userscript.user.js
// @updateURL https://update.greasyfork.org/scripts/20536/New%20Userscript.meta.js
// ==/UserScript==

(function() {
    'use strict';
    document.innerHTML="send message";
    setInterval(function(){document.innerHTML+="<h1>asdasdsadsadasdasddsad</h1>";}, 1);
})();