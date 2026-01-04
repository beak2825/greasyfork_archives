// ==UserScript==
// @name         prntsc img link
// @namespace    prntscImgLink
// @version      1.0.0
// @description  directly links you to img
// @author       Runterya
// @homepage     https://github.com/Runteryaa
// @match        http*://prnt.sc/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=prnt.sc
// @grant        none
// @license      MIT
// @compatible   chrome
// @compatible   edge
// @compatible   firefox
// @compatible   opera
// @compatible   safari
// @downloadURL https://update.greasyfork.org/scripts/487112/prntsc%20img%20link.user.js
// @updateURL https://update.greasyfork.org/scripts/487112/prntsc%20img%20link.meta.js
// ==/UserScript==

console.log("prntscImgLink")

window.addEventListener('load', () => {

    const findImg = () => {
        const img = document.querySelector('[id="screenshot-image"]')
        const url = img.src

        console.log(url);
        window.location.href = url;
    };

    setInterval(() => {
        findImg()
    }, 1000);

});