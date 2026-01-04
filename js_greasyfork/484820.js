// ==UserScript==
// @name         RaftModding Download Helper
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Download Mods by pressing 'D' key
// @author       mertemr
// @match        https://www.raftmodding.com/mods/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=raftmodding.com
// @grant        none
// @license      MIT
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/484820/RaftModding%20Download%20Helper.user.js
// @updateURL https://update.greasyfork.org/scripts/484820/RaftModding%20Download%20Helper.meta.js
// ==/UserScript==

function onKeyDown(e)
{
    let keyCode = e.which === 0 ? e.charCode : e.keyCode;
    if (keyCode === 68) {
        // 68 = d
        let downloadlink = document.querySelector("#download-warning-download-button").href;
        window.open(downloadlink);
    }
}

(() => {
    'use strict';
    document.addEventListener("keydown", onKeyDown);
})();