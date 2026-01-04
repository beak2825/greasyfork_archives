// ==UserScript==
// @name         Remove Wave Accounting Banner
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Remove Wave Accounting Banner "Changes to Wave for businesses outside the United States and Canada"
// @author       Jayson Chua
// @match        https://next.waveapps.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/418460/Remove%20Wave%20Accounting%20Banner.user.js
// @updateURL https://update.greasyfork.org/scripts/418460/Remove%20Wave%20Accounting%20Banner.meta.js
// ==/UserScript==

document.addEventListener('readystatechange', event => {

    try {
        if (event.target.readyState === "complete") {
            document.querySelectorAll(".wv-notify--info")[0].style.display = "none";
            console.log("Banner was succesfully removed");
        }
    }
    catch(err) {
        alert("Userscipt error: !" + err.message);
    }
});