// ==UserScript==
// @author LagSwitchedVirginity
// @namespace https://github.com/LagSwitchedVirginity/UserScripts-and-UserStyles
// @homepage https://github.com/LagSwitchedVirginity/UserScripts-and-UserStyles
// @supportURL https://github.com/LagSwitchedVirginity/UserScripts-and-UserStyles
// @name [COMBO] Hulu
// @description Another email:pass combo system
// @version 1570339125
// @match https://auth.hulu.com/web/login*
// @match http://auth.hulu.com/web/login*
// @run-at document-idle
// @downloadURL https://update.greasyfork.org/scripts/389616/%5BCOMBO%5D%20Hulu.user.js
// @updateURL https://update.greasyfork.org/scripts/389616/%5BCOMBO%5D%20Hulu.meta.js
// ==/UserScript==

function e() {
    document.querySelector('input[name="email"]').onkeyup = function(e, n) {
        this.value.replace(/((?:(?:[\w-]+(?:\.[\w-]+)*)@(?:(?:[\w-]+\.)*\w[\w-]{0,66})\.(?:[a-z]{2,6}(?:\.[a-z]{2})?))|[\w\d]+):(.*)/gi, function(e, n, t) {
            var u = e.split(":"), o = u.shift(), a = u.join(":");
            document.querySelector('input[name="email"]').value = o, document.querySelector('input[name="password"]').value = a;
        });
    };
}

document.onload = e, setTimeout(e, 1e3);