// ==UserScript==
// @name         Eksi - Reklam kaldırıcı
// @namespace    http://tampermonkey.net/
// @version      2
// @description  Üst taraftaki iğrenç reklam container'ını kaldırmaya çalışır. Siktiri boktan bir script ama iş görüyor.
// @author       angusyus
// @include        *eksisozluk*

// @license MIT
/*jshint esversion: 10 */
// @downloadURL https://update.greasyfork.org/scripts/470070/Eksi%20-%20Reklam%20kald%C4%B1r%C4%B1c%C4%B1.user.js
// @updateURL https://update.greasyfork.org/scripts/470070/Eksi%20-%20Reklam%20kald%C4%B1r%C4%B1c%C4%B1.meta.js
// ==/UserScript==

setTimeout(myTimer, 1500);

function myTimer() {
    const d = new Date();

    try {
        document.getElementById("_adr_abp_container_1").remove();
    } catch {}
    try {
        document.getElementById("_adr_abp_container_2").remove();
    } catch {}
    try {
        document.getElementById("_adr_abp_container_3").remove();
    } catch {}
    try {
        document.getElementById("_adr_abp_container_4").remove();
    } catch {}
    try {
        document.getElementById("_adr_abp_container_5").remove();
    } catch {}
    try {
        document.getElementById("_adr_abp_container_6").remove();
    } catch {}

  console.log("!!! reklam silindi");
}