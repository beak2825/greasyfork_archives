// ==UserScript==
// @name        Asurascans Subscription AD Remover
// @namespace   Violentmonkey Scripts
// @match       https://asuracomic.net/*
// @grant       none
// @version     1.0
// @author      teena
// @description 12/02/2025, 12:19:44 pm
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/526659/Asurascans%20Subscription%20AD%20Remover.user.js
// @updateURL https://update.greasyfork.org/scripts/526659/Asurascans%20Subscription%20AD%20Remover.meta.js
// ==/UserScript==

window.addEventListener("DOMContentLoaded", () => {
    console.log("AsuraScans Loaded!");

    removeNavAdBanner();
    removeDialogAd();
});

function removeNavAdBanner() {
    const NAV_ADBANNER = `div.bg-gradient-to-br.from-indigo-900.via-purple-900.to-indigo-800`;

    const observer = new MutationObserver((mutations) => {
        for (const mutation of mutations) {
            for (const node of mutation.addedNodes) {
                if (node.nodeType !== Node.ELEMENT_NODE) continue;

                if (node === body.querySelector(NAV_ADBANNER)) {
                    console.log("Removing navigation AD ", node);
                    node.remove();
                    observer.disconnect();
                }
            }
        }
    });

    const body = document.body;

    observer.observe(body, { childList: true, subtree: true });
}

function removeDialogAd() {
    const DIALOG_WRAPPER = `div.jsx-5e69ac27470f8f66.min-h-min.my-auto`;

    const observer = new MutationObserver((mutations) => {
        for (const mutation of mutations) {
            for (const node of mutation.addedNodes) {
                if (node.nodeType !== Node.ELEMENT_NODE) continue;

                if (node === body.querySelector(DIALOG_WRAPPER)) {
                    console.log("Removing dialog AD ", node);
                    node.remove();
                    observer.disconnect();
                }
            }
        }
    });

    const body = document.body;

    observer.observe(body, { childList: true, subtree: true });
}
