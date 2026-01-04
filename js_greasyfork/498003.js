// ==UserScript==
// @name         Bilibili Live Antimask
// @namespace    http://tampermonkey.net/
// @version      1.2
// @description  None
// @author       Lawsonwang
// @match        *://live.bilibili.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=bilibili.com
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/498003/Bilibili%20Live%20Antimask.user.js
// @updateURL https://update.greasyfork.org/scripts/498003/Bilibili%20Live%20Antimask.meta.js
// ==/UserScript==

(function () {
    'use strict';
    let url = window.location.href;
    let reg = new RegExp(/live.bilibili.com\/\d+/);
    if (!reg.test(url)) return;
    let fp = document.querySelector(".live-player-mounter");
    const observer = new MutationObserver((mutations) => {
        mutations.forEach((mutation) => {
            if (mutation.type === 'childList') {
                // mutation.addedNodes.forEach((addedNode) => {});
                let ch_list = document.querySelectorAll(".web-player-module-area-mask"), count = 0;
                ch_list.forEach((ch) => {
                    if (ch === null || ch.style.height == "0px") return;
                    ch.style.height = ch.style.width = "0px";
                    console.log("[Bilibili Live Antimask] Killed 1.");
                    count += 1;
                });
                if (count > 0) console.log("[Bilibili Live Antimask] Done.");
            }
        });
    });

    const config = { childList: true };
    observer.observe(fp, config);

    /*
    fp.addEventListener("DOMNodeInserted", (event) => {
        let ch_list = document.querySelectorAll(".web-player-module-area-mask"), count = 0;
        ch_list.forEach((ch) => {
            if (ch === null || ch.style.height == "0px") return;
            ch.style.height = ch.style.width = "0px";
            console.log("[Bilibili Live Antimask] Killed 1.");
            count += 1;
        });
        if (count > 0) console.log("[Bilibili Live Antimask] Done.");
    })
    */
})();