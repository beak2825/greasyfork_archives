// ==UserScript==
// @name         Name enlarger
// @namespace    http://tampermonkey.net/
// @version      v1.1
// @description  Enlarge and blacken the name on the ranklist
// @author       limesarine
// @match        *://mna.wang/contest/*
// @license      © 2024 Limesarine. All rights reserved.
// @icon         https://www.google.com/s2/favicons?sz=64&domain=mna.wang
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/504105/Name%20enlarger.user.js
// @updateURL https://update.greasyfork.org/scripts/504105/Name%20enlarger.meta.js
// ==/UserScript==
function insertCSS()
{
    let newCSS=document.createElement("style");
    newCSS.innerHTML=`.user-nameplate { font-size: 15px; color: black !important; }`;
    document.head.appendChild(newCSS);
}
(function() {
    'use strict';
    insertCSS();
    // Your code here...
})();