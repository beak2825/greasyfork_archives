// ==UserScript==
// @name         Twitch VOD Copy Name Button
// @namespace    http://tampermonkey.net/
// @version      1
// @description  Adds a button to copy name of VOD. Useful when creating series of VODs with episode names.
// @author       Leonardo Vendrame
// @match        https://dashboard.twitch.tv/u/*/content/video-producer
// @icon         https://www.google.com/s2/favicons?sz=64&domain=twitch.tv
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/512391/Twitch%20VOD%20Copy%20Name%20Button.user.js
// @updateURL https://update.greasyfork.org/scripts/512391/Twitch%20VOD%20Copy%20Name%20Button.meta.js
// ==/UserScript==

function createCopyButtons() {
    document.querySelectorAll('[data-target="video-card"]').forEach(nod => {
        //console.log(nod);

        let divButton = document.createElement("div");
        divButton.classList.add("copy-button-class");
        divButton.style.display = "flex";
        divButton.style.alignItems = "center";
        divButton.style.justifyContent = "center";

        let copyButton = document.createElement("button");
        copyButton.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-copy" viewBox="0 0 16 16">
            <path fill-rule="evenodd" d="M4 2a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2zm2-1a1 1 0 0 0-1 1v8a1 1 0 0 0 1 1h8a1 1 0 0 0 1-1V2a1 1 0 0 0-1-1zM2 5a1 1 0 0 0-1 1v8a1 1 0 0 0 1 1h8a1 1 0 0 0 1-1v-1h1v1a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h1v1z"/>
        </svg>`;
        copyButton.style.backgroundColor = "#2f2f35";
        copyButton.style.width = "35px";
        copyButton.style.height = "35px";
        copyButton.style.padding = "5px";
        copyButton.style.display = "flex";
        copyButton.style.alignItems = "center";
        copyButton.style.justifyContent = "center";
        copyButton.style.borderRadius = "4px";
        copyButton.style.marginRight = "10px";

        // Attach the click event to the copyButton before cloning
        copyButton.onclick = function() {
            let self = this;
            let textToCopy = nod.querySelector('[data-a-target="video-card-container"]').firstChild.firstChild.textContent;
            navigator.clipboard.writeText(textToCopy)
                .then(() => {
                //console.log(self.style);
                self.style.backgroundColor = 'black';
                setTimeout(function() {self.style.backgroundColor = '#2f2f35';}, 600);
            })
                .catch(err => {
                console.error('Failed to copy text: ', err);
            });
        };

        // Append the button to the div and then add to the target node
        divButton.appendChild(copyButton);
        nod.style.display = "flex";
        nod.appendChild(divButton);
    });
}

(async function() {
    'use strict';

    await new Promise(r => setTimeout(r, 2000));

    document.querySelector('[aria-label="Next Page"]').addEventListener("click", async function() {
        await new Promise(r => setTimeout(r, 1000));
        createCopyButtons();
    });

    document.querySelector('[aria-label="Previous Page"]').addEventListener("click", async function() {
        await new Promise(r => setTimeout(r, 1000));
        createCopyButtons();
    });

    createCopyButtons();
})();
