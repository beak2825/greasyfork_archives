// ==UserScript==
// @name         Auth Data Grabber
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Provides PPJS Auth data
// @author       Symmettry
// @match        https://pixelplace.io/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=pixelplace.io
// @license      MIT
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/546111/Auth%20Data%20Grabber.user.js
// @updateURL https://update.greasyfork.org/scripts/546111/Auth%20Data%20Grabber.meta.js
// ==/UserScript==
 
const boardID = parseInt(window.location.pathname.substring(1));
 
setTimeout(() => {
    const cookies = document.cookie.split(";").map(n => n.split("=").map(n => n.trim()));
    prompt("Copy this", `bot boardID=${boardID} authKey="${cookies.find(([n]) => n == "authKey")[1]}" authId="${cookies.find(([n]) => n == "authId")[1]}" authToken="${cookies.find(([n]) => n == "authToken")[1]}"`);
}, 2000);