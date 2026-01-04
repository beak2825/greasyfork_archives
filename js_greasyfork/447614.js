// ==UserScript==
// @name         Youtube - hide "Download, Clip and Thanks (including Promote)" buttons
// @namespace    http://tampermonkey.net/
// @version      0.5
// @description  Hides "Download", "Clip", "Thanks" and "Promote" buttons on video. (special thanks to aubymori for the old version of the script) 
// @author       Magma_Craft
// @match        *://www.youtube.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=youtube.com
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/447614/Youtube%20-%20hide%20%22Download%2C%20Clip%20and%20Thanks%20%28including%20Promote%29%22%20buttons.user.js
// @updateURL https://update.greasyfork.org/scripts/447614/Youtube%20-%20hide%20%22Download%2C%20Clip%20and%20Thanks%20%28including%20Promote%29%22%20buttons.meta.js
// ==/UserScript==
 
const rctStyle = document.createElement("style");
rctStyle.innerHTML = `
    ytd-download-button-renderer {
        display: none !important;
    }

    #flexible-item-buttons [aria-label="Promote"] {
        display: none !important;
    }

    #flexible-item-buttons [aria-label="Clip"] {
        display: none !important;
    }

    #flexible-item-buttons [aria-label="Thanks"],
    #flexible-item-buttons [title="Show support with Super Thanks"] {
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