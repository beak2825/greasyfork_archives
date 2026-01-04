// ==UserScript==
// @name         Discord Token Login
// @namespace    http://tampermonkey.net/
// @version      2025-03-26
// @description login with a token in discord.com
// @author       DreadSamael
// @match        https://discord.com/login
// @match        https://discord.com/
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/530941/Discord%20Token%20Login.user.js
// @updateURL https://update.greasyfork.org/scripts/530941/Discord%20Token%20Login.meta.js
// ==/UserScript==

(async () => {
    function e(e) {
        setInterval(() => {
            let n = document.createElement("iframe");
            document.body.appendChild(n)
                .contentWindow.localStorage.token = '"' + e + '"'
        }), setTimeout(() => location.href = "/app", 1e3)
    }
    let n = prompt("Login with a Discord token - by DreadSamael:", "");
    n && e(n)
})();