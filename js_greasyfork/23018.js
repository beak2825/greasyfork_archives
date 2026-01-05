// ==UserScript==
// @name         test
// @namespace    http://tampermonkey.net/
// @version      0.1.2
// @description  try to take over the world!
// @author       You
// @match        http://*/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/23018/test.user.js
// @updateURL https://update.greasyfork.org/scripts/23018/test.meta.js
// ==/UserScript==

window.onload(function() {
    setInterval(function(){
        console.log('works');
    },1000);
    var ev = document.createEvent('KeyboardEvent');
    ev.initKeyEvent('keydown', true, true, window, false, false, false, false, 13, 0);
    document.body.dispatchEvent(ev);
});