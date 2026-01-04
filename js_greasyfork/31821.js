// ==UserScript==
// @name         Bitmarket24 chat/trollbox hiding script
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  hides the trollbox on the site
// @author       You
// @match        https://*bitmarket24.pl/*
// @downloadURL https://update.greasyfork.org/scripts/31821/Bitmarket24%20chattrollbox%20hiding%20script.user.js
// @updateURL https://update.greasyfork.org/scripts/31821/Bitmarket24%20chattrollbox%20hiding%20script.meta.js
// ==/UserScript==

var elems = document.getElementsByClassName("chat-outer");
for(var i = 0; i < elems.length; i++) {
    var elem = elems[i];
    elem.style.display = 'none';
}