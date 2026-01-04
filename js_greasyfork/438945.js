// ==UserScript==
// @name         Zapraszanie pod "V" na NI
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Zaprasza klan, przyjaciół i sojusz do grupy na przycisk
// @author       Arhq
// @match        http://*.margonem.pl/
// @match        https://*.margonem.pl/
// @icon         https://www.google.com/s2/favicons?domain=margonem.pl
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/438945/Zapraszanie%20pod%20%22V%22%20na%20NI.user.js
// @updateURL https://update.greasyfork.org/scripts/438945/Zapraszanie%20pod%20%22V%22%20na%20NI.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Your code here...

    document.addEventListener("keyup", ev => {
        if(ev.keyCode === 86 && !["INPUT", "TEXTAREA"].includes(ev.target.tagName)) {
            console.log('guzik');
            Object.entries(window.Engine.whoIsHere.getList()).forEach(([id, {relation}]) => {
                if(["clan-members", "friends", "clan-friends"].includes(relation)) {
                   _g(`party&a=inv&id=${id}`);
                   }
            });

        }
    });

})();