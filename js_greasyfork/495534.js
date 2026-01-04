// ==UserScript==
// @name         new ez4short
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  yeah!
// @author       LTW
// @match        https://game5s.com/*
// @match        https://ez4mods.com/*
// @license      none
// @icon         https://www.google.com/s2/favicons?sz=64&domain=game5s.com
// @grant        non
// @downloadURL https://update.greasyfork.org/scripts/495534/new%20ez4short.user.js
// @updateURL https://update.greasyfork.org/scripts/495534/new%20ez4short.meta.js
// ==/UserScript==

setTimeout(function() {
    show();
setTimeout(function() {
    var closeButton = document.getElementById('t_modal_close_x');

    if (closeButton) {
        closeButton.click();
setTimeout(function() {
    var button = document.getElementById('go_d2');
    if (button) {
        button.click();
    }
}, 2000)
}
}, 3000);
}, 25000);
if (window.location.href.includes('https://ez4mods.com/')) {
    setTimeout(function() {
        var button = document.getElementById('go_d');
        if (button) {
            button.click();
        }
    }, 2000);
}


