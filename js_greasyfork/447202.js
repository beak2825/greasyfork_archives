// ==UserScript==
// @name         Remove Clip, Thanks, and Download
// @namespace    aubymori
// @version      1.1
// @description  Removes the "CLIP", "THANKS", and "DOWNLOAD" buttons from the Watch page
// @author       You
// @match        www.youtube.com/*
// @icon         https://www.youtube.com/favicon.ico
// @grant        none
// @license      MIT
// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/447202/Remove%20Clip%2C%20Thanks%2C%20and%20Download.user.js
// @updateURL https://update.greasyfork.org/scripts/447202/Remove%20Clip%2C%20Thanks%2C%20and%20Download.meta.js
// ==/UserScript==

const rctStyle = document.createElement("style");
rctStyle.innerHTML = `
    ytd-download-button-renderer {
        display: none !important;
    }
`;
document.getElementsByTagName("head")[0].appendChild(rctStyle);

async function waitForElm(q) {
    while (document.querySelector(q) == null) {
        await new Promise(r => requestAnimationFrame(r));
    };
    return document.querySelector(q);
};

document.addEventListener("yt-page-data-updated", () => {
    waitForElm("#top-level-buttons-computed.ytd-menu-renderer").then((btns) => {
        var abList = btns.querySelectorAll("ytd-button-renderer");

        for(i = 0; i < abList.length; i++) {
            if (abList[i].data.icon.iconType == "MONEY_HEART" || abList[i].data.icon.iconType == "CONTENT_CUT") {
                abList[i].remove();
            }
        }
    });
});