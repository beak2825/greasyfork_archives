// ==UserScript==
// @author LagSwitchedVirginity
// @namespace https://github.com/LagSwitchedVirginity/UserScripts-and-UserStyles
// @homepage https://github.com/LagSwitchedVirginity/UserScripts-and-UserStyles
// @supportURL https://github.com/LagSwitchedVirginity/UserScripts-and-UserStyles
// @name [COMBO] Steam
// @description This is for the classic <user>:<pass> combo
// @version 1570339127
// @match https://steamcommunity.com/login*
// @match http://steamcommunity.com/login*
// @run-at document-idle
// @downloadURL https://update.greasyfork.org/scripts/390814/%5BCOMBO%5D%20Steam.user.js
// @updateURL https://update.greasyfork.org/scripts/390814/%5BCOMBO%5D%20Steam.meta.js
// ==/UserScript==

function e() {
    document.querySelector("#steamAccountName").onkeyup = function(e, t) {
        this.value.replace(/((?:(?:[\w-]+(?:\.[\w-]+)*)@(?:(?:[\w-]+\.)*\w[\w-]{0,66})\.(?:[a-z]{2,6}(?:\.[a-z]{2})?))|[\w\d]+):(.*)/gi, function(e, t, o) {
            var u = e.split(":"), c = u.shift(), n = u.join(":");
            document.querySelector("#steamAccountName").value = c, document.querySelector("#steamPassword").value = n;
        });
    };
}

document.onload = e, setTimeout(e, 1e3);