// ==UserScript==
// @name         Popcat.click autoclicker V2
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Clicker for popcat.click website
// @author       SILENCED
// @match        https://popcat.click/
// @icon         https://www.google.com/s2/favicons?sz=64&domain=popcat.click
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/489504/Popcatclick%20autoclicker%20V2.user.js
// @updateURL https://update.greasyfork.org/scripts/489504/Popcatclick%20autoclicker%20V2.meta.js
// ==/UserScript==

var event = new KeyboardEvent('keydown', {
    key: 'g',
    ctrlKey: true
});

setInterval(function(){
    for (var i = 0; i < 1000; i++) {
        document.dispatchEvent(event);
    }
}, 5);
