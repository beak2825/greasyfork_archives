// ==UserScript==
// @namespace    nartag.com/asaduji
// @name         Nartag anti-adblock killer
// @match        https://*.nartag.com/*
// @version      0.1
// @description  Como de "amistosos" tienen poco pues a tomar por culo el anti-adblock
// @author       Asaduji
// @icon         https://nartag.com/favicon.ico
// @grant        none
// @run-at document-start
// @downloadURL https://update.greasyfork.org/scripts/431597/Nartag%20anti-adblock%20killer.user.js
// @updateURL https://update.greasyfork.org/scripts/431597/Nartag%20anti-adblock%20killer.meta.js
// ==/UserScript==

const ogEval = window.eval;

window.eval = (src) => {

    console.log("Eval called");
    if(src.toLowerCase().includes("adblock")){
        console.log("Obfuscated anti-adblock eval call found, prevented from running.");
        return;
    }

    return ogEval(src);
};