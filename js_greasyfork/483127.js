// ==UserScript==
// @name         Emmet's Direct Factorio Mods Downloader 2025
// @version      2.0.2
// @description  Directly download any of the latest mods from https://mods.factorio.com with just one click. No authorization needed.
// @author       Discord @EmmetPotet
// @match        https://mods.factorio.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=re146.dev/factorio/mods
// @grant        none
// @license      MIT
// @namespace https://re146.dev/
// @downloadURL https://update.greasyfork.org/scripts/483127/Emmet%27s%20Direct%20Factorio%20Mods%20Downloader%202025.user.js
// @updateURL https://update.greasyfork.org/scripts/483127/Emmet%27s%20Direct%20Factorio%20Mods%20Downloader%202025.meta.js
// ==/UserScript==

const parser = new DOMParser()
const getModVersionFromName = async (modName) => {
    return new Promise(async (resolve, reject) => {
        fetch(`https://mods.factorio.com/mod/${modName}`, {
            "method": "GET",
        }).then(async (res) => {
            let modPage = parser.parseFromString(await res.text(), 'text/html');
            for (const dd of modPage.querySelectorAll('dt')) {
                if (dd.innerHTML == "Latest Version:") {
                    resolve(dd.nextElementSibling.innerHTML.trim().split(" ")[0]);
                }
            }
        }).catch((e) => {
            console.log(e)
            reject()
        });
    });
}
const hijackButton = async (button, modName, version) => {
    version = (typeof version === 'undefined') ? await getModVersionFromName(modName) : version;
    button.classList.remove("disabled");
    button.setAttribute('href', `https://mods-storage.re146.dev/${modName}/${version}.zip?anticache=${Math.random()}`);
    button.setAttribute('title', `You don't need to own Factorio to download mods. ;3`);
}

(async function() {
    'use strict';

    let currentURL = new URL(location.href)
    if (currentURL.searchParams.has("next")) {
        let redirect = currentURL.searchParams.get("next");
        if (redirect.startsWith("/mod/")) {
            location.href = "https://mods.factorio.com" + redirect
        } else {
            location.href = "https://mods.factorio.com/"
        }
    }

    let isVersionSelectionPage = currentURL.href.endsWith('/downloads');
    for (const button of document.getElementsByClassName("button-green text-center")) {
        if (button.href == "") location.href = "https://mods.factorio.com/logout" // does not work while logged in.
        let buttonURL = new URL(button.href)
        let redirect = buttonURL.searchParams.get("next")
        if (redirect.startsWith("/mod/")) {
            let modName = redirect.split("/")[2];
            if (isVersionSelectionPage && button.parentNode.nodeName == "TD") {
                hijackButton(button, modName, button.parentNode.parentNode.firstElementChild.innerHTML)
            } else {
                hijackButton(button, modName)
            }
        }

    }

})();