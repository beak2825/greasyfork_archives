// ==UserScript==
// @name         Anilist friend progress
// @namespace    https://greasyfork.org/users/412318
// @version      0.4
// @description  Show Anilist friend progress
// @author       henrik9999
// @match        https://anilist.co/*
// @icon         https://www.google.com/s2/favicons?domain=anilist.co
// @grant        none
// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/439433/Anilist%20friend%20progress.user.js
// @updateURL https://update.greasyfork.org/scripts/439433/Anilist%20friend%20progress.meta.js
// ==/UserScript==

function waitUntilTrue(condition, callback, interval = 100) {
    const intervalId = setInterval(function() {
        if (condition()) {
            clearInterval(intervalId);
            callback();
        }
    }, interval);

    return intervalId;
}

(function() {
    'use strict';
    const realWorker = Worker;
    Worker = function(...attr) {
        const tempWorker = new realWorker(...attr);

        tempWorker.addEventListener('message', (event) => {
            if (event.data && event.data.result && typeof event.data.result.result === "string" && event.data.result.result.startsWith("mediaFollowing-") && Object.keys(event.data.result.entities.listEntry).length) {
                if (window.location.href.startsWith("https://anilist.co/anime/") || window.location.href.startsWith("https://anilist.co/manga/")) {
                    waitUntilTrue(
                        () => document.querySelectorAll("div.following a").length,
                        () => {
                            const data = event.data.result.entities;
                            document.querySelectorAll("div.following a").forEach(e => {
                                const username = e.href.split("/")[4].toLowerCase();
                                const userid = data.userName[username].id
                                for (const entryid in data.listEntry) {
                                    const entry = data.listEntry[entryid];
                                    if (entry.user === userid) {
                                        if (entry.status !== "COMPLETED" && entry.status !== "PLANNING") {
                                            const progress = entry.progress;
                                            const statusDiv = e.querySelector("div.status")
                                            if (!statusDiv.innerText.includes("(")) {
                                                statusDiv.innerText = `${statusDiv.innerText} (${progress})`;
                                            }


                                            // const statusClone = statusDiv.cloneNode(false);
                                            // statusClone.innerText=progress.toString();
                                            // statusDiv.parentNode.insertBefore(statusClone, statusDiv)
                                        }

                                        break;
                                    }
                                }

                            })
                        })
                }
            }
        });
        return tempWorker;
    }
})();