// ==UserScript==
// @name         WSIS Autofill Signup
// @namespace    http://yu.net/
// @version      2024-03-19
// @description  Autofill Signup
// @author       You
// @match        https://www.itu.int/net4/wsis/stocktaking/Account/Register*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=itu.int
// @grant        GM_registerMenuCommand
// @grant        GM_getValue
// @grant        GM_setValue
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/490335/WSIS%20Autofill%20Signup.user.js
// @updateURL https://update.greasyfork.org/scripts/490335/WSIS%20Autofill%20Signup.meta.js
// ==/UserScript==

(function() {
    'use strict';

    function onPaste(rawStr) {
        const data = rawStr.split("\t")
        document.querySelector("input#Email").value = data[3]
        document.querySelector("input#Password").value = data[5]
        document.querySelector("input#ConfirmPassword").value = data[5]
        document.querySelector("select#Title").value = (data[2] === "Ms.") ? "MS" : "MR"
        document.querySelector("input#FirstName").value = data[0]
        document.querySelector("input#LastName").value = data[1]
        document.querySelector("select#StakeHolderType").value = 3
        document.querySelector("select#Country").value = 92
        document.querySelector(".btn.g-recaptcha").focus()
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