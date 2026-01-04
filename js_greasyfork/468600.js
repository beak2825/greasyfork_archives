// ==UserScript==
// @name         Popcat.click autoclicker
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Clicker for popcat.click website
// @author       Zay
// @match        https://popcat.click/
// @icon         https://www.google.com/s2/favicons?sz=64&domain=popcat.click
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/468600/Popcatclick%20autoclicker.user.js
// @updateURL https://update.greasyfork.org/scripts/468600/Popcatclick%20autoclicker.meta.js
// ==/UserScript==

var event = new KeyboardEvent('keydown', {
    key: 'g',
    ctrlKey: true
});

setInterval(function(){
    for (i = 0; i < 1000; i++) {
        document.dispatchEvent(event);
    }
}, 0);
