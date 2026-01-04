// ==UserScript==
// @name         Qwant Search Engine for Opera
// @namespace    https://github.com/LePliex/Qwant-Search-Engine-for-Opera-Browser
// @version      1.0
// @description  Redirect you to Qwant Services
// @author       LePliex (https://github.com/LePliex)
// @match        https://duckduckgo.com/*
// @icon         https://i.imgur.com/2pLe6tY.png
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/439959/Qwant%20Search%20Engine%20for%20Opera.user.js
// @updateURL https://update.greasyfork.org/scripts/439959/Qwant%20Search%20Engine%20for%20Opera.meta.js
// ==/UserScript==
(function() {
    document.querySelector("html").remove();
    document.appendChild(document.createElement("html"));
    document.querySelector("html").style.background = "#1c1c1c";
    let URL = window.location.href;
    let fSplit = URL.split("&");
    let sSplit = fSplit[0].split("=");
    let pSplit = sSplit[1].split("+");
    let final = "";
    let Maps = new RegExp('QMaps');
    let Music = new RegExp('QMusic');
    if (sSplit[0] === "" || sSplit[1] === undefined) {
        window.location.href = "https://www.qwant.com/";
    } else if (sSplit[1].match(Music)) {
        if (sSplit[1] != undefined) {
            for (let i = 1; i < pSplit.length; i++) {
                final += "%20" + pSplit[i];
            }
            window.location.href = "https://www.qwant.com/music/search?q=" + final;
        } else {
            window.location.href = "https://www.qwant.com/music";
        }
    } else if (sSplit[1].match(Maps)) {
        if (sSplit[1] != undefined) {
            for (let i = 1; i < pSplit.length; i++) {
                final += "%20" + pSplit[i];
            }
            window.location.href = "https://www.qwant.com/maps?q=" + final;
        } else {
            window.location.href = "https://www.qwant.com/maps";
        }
    } else {
        window.location.href = "https://www.qwant.com/?q=" + sSplit[1];
    }
    'use strict';
})();