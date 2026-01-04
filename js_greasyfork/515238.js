// ==UserScript==
// @name         TDX: Open links in modal (1/2)
// @description  Make links open in a modal instead of a new window. Part 1 of 2 scripts to handle different cases at different URLs within TDX.
// @version      2024-11-01
// @author       Nate Kean
// @namespace    https://github.com/garlic-os
// @license      MIT
// @match        https://tdx.umsystem.edu/TDNext/Home/Desktop/Desktop.aspx
// @icon         https://tdx.umsystem.edu/favicon.ico
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/515238/TDX%3A%20Open%20links%20in%20modal%20%2812%29.user.js
// @updateURL https://update.greasyfork.org/scripts/515238/TDX%3A%20Open%20links%20in%20modal%20%2812%29.meta.js
// ==/UserScript==

(async function() {
    document.body.insertAdjacentHTML("beforeend", `
        <dialog id="ndk-dialog">
            <iframe id="ndk-dialog-inner"></iframe>
        </dialog>
    `);

    document.head.insertAdjacentHTML("beforeend", `
        <style id="ndk-style">
            #ndk-dialog {
                width: 80vw;
                height: 80vh;
                padding: 0;
            }

            #ndk-dialog-inner {
                width: 100%;
                height: 100%;
                padding: 1rem;
            }
        </style>
    `);

    const dialog = document.querySelector("#ndk-dialog");
    const iframe = document.querySelector("#ndk-dialog-inner");
    dialog.addEventListener("click", () => dialog.close());
    dialog.addEventListener("keydown", (event) => { if (event.key === "Escape") dialog.close(); });
    iframe.addEventListener("click", (event) => event.stopPropagation());

    const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));
    console.debug("Popups2Modals: Polling for openWinReturn function to override...");
    while (!("openWinReturn" in window)) {
        console.debug("Popups2ModalsNot found. Waiting 100ms...");
        await delay(100);
    }
    console.debug("Popups2ModalsopenWinReturn found. Overriding...");

    window.openWinReturn = (url, width, height, name, scrollbars) => {
        iframe.src = url;
        dialog.showModal();
    };
})();
