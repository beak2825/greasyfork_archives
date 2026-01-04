// ==UserScript==
// @name         Webmail Log In
// @namespace    http://yu.net/
// @version      2024-03-19
// @description  Login Webmail
// @author       You
// @match        https://host62.registrar-servers.com:2096/*/3rdparty/roundcube/index.php
// @icon         https://www.google.com/s2/favicons?sz=64&domain:host62.registrar-servers.com:2096
// @grant        GM_registerMenuCommand
// @grant        GM_getValue
// @grant        GM_setValue
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/490333/Webmail%20Log%20In.user.js
// @updateURL https://update.greasyfork.org/scripts/490333/Webmail%20Log%20In.meta.js
// ==/UserScript==

(function() {
    'use strict';

    function onPaste(rawStr) {
        const data = rawStr.split("\t")
        document.querySelector("input#user").value = data[0]
        document.querySelector("input#pass").value = data[1]
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
            document.querySelector("#login_submit").click()
        }
    })
})();