// ==UserScript==
// @name         Study Mode for WebAssign
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  blurs answers on WebAssign so you can go back and recomplete assignments without spoilers.
// @author       You
// @match        https://www.webassign.net/*
// @icon         https://www.google.com/s2/favicons?domain=webassign.net
// @grant        none
// @license GNU GPLv3
// @downloadURL https://update.greasyfork.org/scripts/436657/Study%20Mode%20for%20WebAssign.user.js
// @updateURL https://update.greasyfork.org/scripts/436657/Study%20Mode%20for%20WebAssign.meta.js
// ==/UserScript==

(function() {
    'use strict';
document.head.insertAdjacentHTML("beforeend", `
    <style>
        .mathpad-wrapper{filter: blur(7px); border: 1px black solid; transition: all .3s;}
        .mathpad-wrapper:hover{filter: none; border: 1px white solid; transition: all .3s;}
    </style>`)

    // Your code here...
})();