// ==UserScript==
// @name        RBLX rearrange tabs
// @namespace   Violentmonkey Scripts
// @match       https://www.roblox.com/home
// @grant       none
// @version     1.0
// @author      smqfl
// @license     MIT
// @description 4/8/2024, 7:37:51 PM
// @downloadURL https://update.greasyfork.org/scripts/492028/RBLX%20rearrange%20tabs.user.js
// @updateURL https://update.greasyfork.org/scripts/492028/RBLX%20rearrange%20tabs.meta.js
// ==/UserScript==

function waitForElm(selector) {
    return new Promise(resolve => {
        if (document.querySelector(selector)) {
            return resolve(document.querySelector(selector));
        }

        const observer = new MutationObserver(mutations => {
            if (document.querySelector(selector)) {
                observer.disconnect();
                resolve(document.querySelector(selector));
            }
        });

        // If you get "parameter 1 is not of type 'Node'" error, see https://stackoverflow.com/a/77855838/492336
        observer.observe(document.body, {
            childList: true,
            subtree: true
        });
    });
} // https://stackoverflow.com/questions/5525071/how-to-wait-until-an-element-exists        Listen. I'm Not An Javascript Man. I'm An Lua Man.

waitForElm("#place-list .game-home-page-container .friend-carousel-container").then((elm) => {
    var container = document.querySelector("#place-list .game-home-page-container .friend-carousel-container").parentElement
    container.style.display = "flex"
    container.style["flex-direction"] = "column"
    elm.style.order = "-99"
    document.querySelectorAll("#place-list .game-home-page-container .game-sort-header-container")[2].style.order = "-98"
    document.querySelectorAll("#place-list .game-home-page-container .game-carousel")[2].style.order = "-97"
});