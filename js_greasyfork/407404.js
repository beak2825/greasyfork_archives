// ==UserScript==
// @name         Discord Text File Preview
// @namespace    http://tampermonkey.net/
// @version      1.0.1
// @description  Previewing uploaded text files in Discord
// @author       hnOsmium0001
// @match        https://discord.com/*
// @match        https://discordapp.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/407404/Discord%20Text%20File%20Preview.user.js
// @updateURL https://update.greasyfork.org/scripts/407404/Discord%20Text%20File%20Preview.meta.js
// ==/UserScript==

(function() {
    'use strict';

    document.addEventListener("click", (event) => {
        console.log(event.target.tagName);
        if (event.target.tagName == "A") {
            for (const elmClass of event.target.classList) {
                if (elmClass.startsWith("fileNameLink")) {
                    const parts = event.target.href.split("/");
                    if (parts.length < 3) {
                        break;
                    }
                    const fileID = `${parts[parts.length - 3]}/${parts[parts.length - 2]}/${parts[parts.length - 1]}`;
                    window.open(`https://hnosmium0001.github.io/FileCord/?file=${fileID}`);

                    // Stop other possible event listeners from receiving this event (not sure if there is any)
                    event.stopPropagation();
                    // Prevent the link to be opened (which will download the file)
                    event.preventDefault();
                    break;
                }
            }
        }
    });
})();