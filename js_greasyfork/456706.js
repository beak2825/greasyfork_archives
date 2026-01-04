// ==UserScript==
// @name         Discord Clean Folder
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  A simple script to make discord folders look clean and uncluttered
// @author       Galesh Jayaskudre
// @match        *discord.com/channels/*
// @match        *://discord.com/channels/*
// @license      MIT
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/456706/Discord%20Clean%20Folder.user.js
// @updateURL https://update.greasyfork.org/scripts/456706/Discord%20Clean%20Folder.meta.js
// ==/UserScript==

setInterval(() => {
    for (let e = Array.from(document.getElementsByTagName("div")).filter(e => e.className.includes("closedFolderIconWrapper")), i = e.length; i--;) {
        setTimeout(() => e[i].parentElement.parentElement.click(), 0);
        e[i].click();
    }
}, 275);