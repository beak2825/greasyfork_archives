// ==UserScript==
// @name         WSIS Autofill Log In
// @namespace    http://yu.net/
// @version      2024-03-19
// @description  Autofill Log In
// @author       You
// @match        https://www.itu.int/net4/wsis/stocktaking/Account/Login*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=itu.int
// @grant        GM_registerMenuCommand
// @grant        GM_getValue
// @grant        GM_setValue
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/490334/WSIS%20Autofill%20Log%20In.user.js
// @updateURL https://update.greasyfork.org/scripts/490334/WSIS%20Autofill%20Log%20In.meta.js
// ==/UserScript==

(function() {
    'use strict';

    function onPaste(rawStr) {
        const data = rawStr.split("\t")
        document.querySelector("input#Email").value = data[0]
        document.querySelector("input#Password").value = data[2]
    }

    GM_registerMenuCommand("Fill Form", () => {
        let rawStr = prompt("Masukkan Data");
        onPaste(rawStr);
    }, "f")
    document.addEventListener("keydown", async (event) => {
        const key = event.key;
        if(event.ctrlKey && key === "v") {
            event.preventDefault();
            console.log()
            const rawStr = await navigator.clipboard.readText()
            onPaste(rawStr)
        }
    })
})();