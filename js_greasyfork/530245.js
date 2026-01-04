// ==UserScript==
// @name         顯示 Discord Token
// @description  取得 Discord Token
// @version      1.0
// @license      MIT
// @match        *://*.discord.com/channels/*
// @icon         https://www.google.com/s2/favicons?domain=discord.com&sz=256
// @namespace https://greasyfork.org/users/1447528
// @downloadURL https://update.greasyfork.org/scripts/530245/%E9%A1%AF%E7%A4%BA%20Discord%20Token.user.js
// @updateURL https://update.greasyfork.org/scripts/530245/%E9%A1%AF%E7%A4%BA%20Discord%20Token.meta.js
// ==/UserScript==

(async () => {
    // 取得Token
    let token = localStorage.getItem("token")
        .split('"')
        .join("");

    let button = document.createElement("button");
    button.textContent = "顯示 Discord Token";
    button.style.position = "fixed";
    button.style.top = "10px";
    button.style.right = "10px";
    button.style.zIndex = "9999";

    button.onclick = function() {
        prompt("Your Discord token:", token);
    };

    document.body.appendChild(button);
})();