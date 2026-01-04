// ==UserScript==
// @name         Copy Bandcamp Album ID
// @namespace    http://tampermonkey.net/
// @version      2025-08-07
// @description  Adds a button to copy the album ID to system clipboard.
// @author       úlfurinn
// @license      MIT
// @match        https://*.bandcamp.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=bandcamp.com
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/544961/Copy%20Bandcamp%20Album%20ID.user.js
// @updateURL https://update.greasyfork.org/scripts/544961/Copy%20Bandcamp%20Album%20ID.meta.js
// ==/UserScript==

(function() {
    'use strict';

    let albumID = null;
    const re = /(album|track) id (\d+)/;
    for (const node of document.childNodes) {
        if (node.nodeType == Node.COMMENT_NODE) {
            let match = node.data.match(re);
            if (match) {
                console.log(match);
                albumID = match[2];
            }
        }
    }


    const controls = document.querySelector(".share-collect-controls ul");
    if (albumID && controls) {
        const li = document.createElement("li");
        controls.appendChild(li);

        const a = document.createElement("a");
        li.appendChild(a);

        a.style = "font-weight: bold";
        a.appendChild(document.createTextNode("📋 Copy ID"));
        a.addEventListener("click", (e) => {
            navigator.clipboard.writeText(albumID);
        });
    }

})();