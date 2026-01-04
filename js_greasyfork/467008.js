// ==UserScript==
// @name         Bilibili
// @namespace    https://www.bilibili.com/
// @version      0.2
// @description  Bilibili website script
// @author       youginil
// @match        https://www.bilibili.com/video/BV*
// @match        https://www.bilibili.com/video/av*
// @icon         https://www.bilibili.com/favicon.ico
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/467008/Bilibili.user.js
// @updateURL https://update.greasyfork.org/scripts/467008/Bilibili.meta.js
// ==/UserScript==

(function () {
    "use strict";
    const body = document.body;
    let timer = null;

    function resume() {
        if (timer !== null) {
            clearTimeout(timer);
        }
        timer = setTimeout(() => {
            timer = null;
            for (let i = 0; i < body.children.length; i++) {
                const child = body.children[i];
                if (child.className === "bili-mini-mask") {
                    console.log("Login box detected");
                    document
                        .querySelector(".bili-mini-mask .bili-mini-close-icon")
                        .click();
                    document
                        .querySelector(
                            ".bpx-player-control-bottom-left > .bpx-player-ctrl-play"
                        )
                        .click();
                    break;
                }
            }
        }, 1000);
    }

    const ob = new MutationObserver(() => {
        resume();
    });

    ob.observe(body, { attributes: false, childList: true, subtree: false });
})();

