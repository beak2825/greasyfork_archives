// ==UserScript==
// @name         diep style
// @author       supa hero
// @description  kkk
// @match        *://diep.io/*
// @grant        none
// @version 0.0.1.20190324111712
// @namespace https://greasyfork.org/users/176941
// @downloadURL https://update.greasyfork.org/scripts/380860/diep%20style.user.js
// @updateURL https://update.greasyfork.org/scripts/380860/diep%20style.meta.js
// ==/UserScript==

(function() {
    var a = setInterval(function() {
        "use strict";
        if(window.input) {
            let exect = window.input.execute;
            exect("net_replace_color 2 0x0073cf");
            exect("net_replace_color 3 0x0073cf");
            exect("net_replace_color 4 0xed2939");
            exect("net_replace_color 5 0xac68cc");
            exect("net_replace_color 6 0x50c878");
            exect("net_replace_color 10 0x0073cf");
            exect("net_replace_color 15 0xed2939");
            clearInterval(a);
        }
    }, 10);
})();