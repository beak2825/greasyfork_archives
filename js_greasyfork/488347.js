// ==UserScript==
// @name         Facebook AutoPocker
// @namespace    http://tampermonkey.net/
// @version      2024-02-26
// @description  Auto Pock Back for Facebook
// @author       Al Jumman
// @match        https://www.facebook.com/pokes
// @icon         https://www.google.com/s2/favicons?sz=64&domain=facebook.com
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/488347/Facebook%20AutoPocker.user.js
// @updateURL https://update.greasyfork.org/scripts/488347/Facebook%20AutoPocker.meta.js
// ==/UserScript==

(function() {
    'use strict';
var interval = 2000; //set the interval in MiliSeconds
setInterval(function() {
    location.reload();
    $('span').each(function() {
        if ($(this).text() === 'Poke Back') {
            $(this).click();
            console.log('Poke Back found and clicked');
        }
    });
}, interval);


})();