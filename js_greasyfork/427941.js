// ==UserScript==
// @name         Keylistener Primewire TV Shows
// @namespace    http://tampermonkey.net/
// @version      0.3
// @description  Next or previous episodes using keyboard shortcuts.
// @author       Dan6erbond
// @match        https://www.primewire.ag/tv/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/427941/Keylistener%20Primewire%20TV%20Shows.user.js
// @updateURL https://update.greasyfork.org/scripts/427941/Keylistener%20Primewire%20TV%20Shows.meta.js
// ==/UserScript==

function pad(num) {
    const s = "0" + num;
    return s.substr(s.length - Math.max(2, num.toString().length));
}

(function() {
    'use strict';

    document.addEventListener("keyup", (e) => {
        const container = document.querySelector("body > div.container > div.col1 > div.main-body > div.index_container > div.choose_tabs > div.episode_prev_next");
        let hasNext = false, hasPrev = false, foundDivider = false;
        for (let i = 0; i < container.childNodes.length; i++) {
            const node = container.childNodes[i];
            if (node.nodeType === Node.TEXT_NODE && node.data.indexOf("|") !== -1) {
                foundDivider = true;
            } else if (node.nodeType === Node.ELEMENT_NODE) {
                if (foundDivider) {
                    hasNext = true;
                } else {
                    hasPrev = true;
                }
            }
        }
        if (!hasPrev || !hasNext) {
            if (e.code === "KeyP" && hasPrev) {
                const url = container.children[0].getAttribute("href");
                window.location.href = url;
            } else if (e.code === "KeyN" && hasNext) {
                const url = container.children[0].getAttribute("href");
                window.location.href = url;
            }
        } else if (e.code === "KeyP") {
            const url = container.children[0].getAttribute("href");
            window.location.href = url;
        } else if (e.code === "KeyN") {
            const url = container.children[1].getAttribute("href");
            window.location.href = url;
        }
    });

    const season = document.querySelector("body > div.container > div.col1 > div.main-body > div.index_container > div.stage_navigation.movie_navigation > h1 > span > strong:nth-child(2) > a").innerHTML.split(" ")[1];
    const episode = document.querySelector("body > div.container > div.col1 > div.main-body > div.index_container > div.stage_navigation.movie_navigation > h1 > span > strong:nth-child(3)").innerHTML.split(" ")[1];
    const title = document.querySelector("body > div.container > div.col1 > div.main-body > div.index_container > div.movie_info > table > tbody > tr:nth-child(2) > td:nth-child(2)").innerHTML;

    const td = document.querySelector("body > div.container > div.col1 > div.main-body > div.index_container > div.movie_info > table > tbody > tr:nth-child(2) > td:nth-child(2)");
    const button = document.createElement("button");
    button.innerHTML = "📑";
    button.addEventListener("click", async () => {
        await navigator.clipboard.writeText(`S${pad(season)}E${pad(episode)} - ${title}`);
    });
    td.appendChild(document.createTextNode(" "));
    td.appendChild(button);
})();