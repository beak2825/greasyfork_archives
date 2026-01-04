// ==UserScript==
// @name         Ring Live View Auto-Reconnect
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Whenever Ring Live View Disconnects, this script automatically reconnects it. No BS.
// @author       Kenneth Anderson
// @match        *.ring.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=ring.com
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/470635/Ring%20Live%20View%20Auto-Reconnect.user.js
// @updateURL https://update.greasyfork.org/scripts/470635/Ring%20Live%20View%20Auto-Reconnect.meta.js
// ==/UserScript==

function ReconAuto(){
    var el = document.querySelector('[aria-label="Reconnect"]');
    if(el){ el.click(); }
}
setInterval(ReconAuto, 15000);