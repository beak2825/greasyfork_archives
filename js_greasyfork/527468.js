// ==UserScript==
// @name         Anti-AFK timeout
// @namespace    http://tampermonkey.net/
// @version      2025-02-18
// @description  doesn't work in full screen
// @author       r!PsAw
// @match        httos://diep.io/*
// @match        https://pctest.diep.io/
// @icon         https://www.google.com/s2/favicons?sz=64&domain=diep.io
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/527468/Anti-AFK%20timeout.user.js
// @updateURL https://update.greasyfork.org/scripts/527468/Anti-AFK%20timeout.meta.js
// ==/UserScript==

let _m = [true, 0, 0];
document.addEventListener('mousemove', anti_timeout);
function anti_timeout(e){
    _m = [_m[0], e.clientX, e.clientY];
}
setInterval(() => {
    if(_m[0]){
        extern.onTouchMove(_m[1], _m[2]);
    }
}, 1000);