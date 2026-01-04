// ==UserScript==
// @name         Gekichumai JP NET Auto Login
// @namespace    http://github.com/GalvinGao
// @version      2024-03-30
// @description  Automatically login to Gekichumai JP NET sites so you don't need to click all the buttons.
// @author       GalvinGao
// @license      MIT
// @match        https://maimaidx.jp/*
// @match        https://new.chunithm-net.com/*
// @match        https://ongeki-net.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=maimaidx.jp
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/491264/Gekichumai%20JP%20NET%20Auto%20Login.user.js
// @updateURL https://update.greasyfork.org/scripts/491264/Gekichumai%20JP%20NET%20Auto%20Login.meta.js
// ==/UserScript==

const SEGAID_USERNAME = "YOUR_USERNAME_HERE";
const SEGAID_PASSWORD = "YOUR_PASSWORD_HERE";

function getPageState() {
    const haveError = document.location.href.endsWith("/error/") || document.location.href.endsWith("/error") || document.location.href.endsWith("/nError/") || document.location.href.endsWith("/nError")
    if (haveError) return "error"

    const haveLoginField = !!document.querySelector("input[name=segaId]")
    if (haveLoginField) return "auth"

    const isAimeSelection = !!document.querySelector("img[src*=title_course\\.png]") || !!document.querySelector("button.btn_select_aime") || !!document.querySelector(".aime_main_block > form > button[type=submit]")
    if (isAimeSelection) return "aimeSelection"

    return null
}

function getGame() {
    if (document.location.hostname.includes("chunithm")) return "chunithm";
    if (document.location.hostname.includes("maimai")) return "maimai";
    if (document.location.hostname.includes("ongeki")) return "ongeki";
    return null;
}


(function() {
    'use strict';

    const page = getPageState();
    const game = getGame();
    console.log("[segaAutoLogin] page state", page);
    console.log("[segaAutoLogin] game", game);

    switch (page) {
        case "error":
            if (game === "chunithm") {
                document.querySelector("div.btn_back").click();
            } else if (game === "maimai") {
                document.querySelector("div.t_c > button.f_0").click();
            } else if (game === "ongeki") {
                document.querySelector("div.t_c > button.f_0").click();
            }
            break;

        case "auth":
            document.querySelector("input[name=segaId]").value = SEGAID_USERNAME;
            document.querySelector("input[name=password]").value = SEGAID_PASSWORD;
            document.querySelector("button[type=submit]").click();
            break;

        case "aimeSelection":
            if (game === "chunithm") {
                document.querySelector("button.btn_select_aime").click();
            } else if (game === "maimai") {
                document.querySelector("form > button[type=submit] > img.h_55").click();
            } else if (game === "ongeki") {
                document.querySelector(".aime_main_block > form > button[type=submit]").click();
            }
            break;

        case null:
            console.log("null page state")
            break;


        default:
            console.warn("entered unknown page state:", page);
    }
})();