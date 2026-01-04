// ==UserScript==
// @name         Go Away!
// @namespace    http://tampermonkey.net/
// @version      10.932
// @description  Stop saving energy, dumb website!
// @author       Me
// @match        https://www.boohoo.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=boohoo.com
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/460071/Go%20Away%21.user.js
// @updateURL https://update.greasyfork.org/scripts/460071/Go%20Away%21.meta.js
// ==/UserScript==

    window.addEventListener('load', () => {
        console.log("removing thing!")
        document.querySelector("#page-body > div.b-sustainable_browsing-desktop > div.b-sustainable_toggle").remove();
        alert("I removed the annoying energy saver element!")
    })