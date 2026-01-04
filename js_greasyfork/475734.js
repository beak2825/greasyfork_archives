// ==UserScript==
// @name         VoidPaste
// @namespace    http://tampermonkey.net/
// @version      0.2.0
// @description  Auto transform pasted image links.
// @author       voidnyan
// @match        https://anilist.co/*
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/475734/VoidPaste.user.js
// @updateURL https://update.greasyfork.org/scripts/475734/VoidPaste.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const imageFormats = [
        "jpg",
        "png",
        "gif",
        "webp",
        "apng",
        "avif",
        "jpeg",
        "svg",
    ];
    const imageWidth = "420";

    let isShiftPressed = false;

    window.addEventListener("keydown", (event) => {
        if (event.key !== "Shift") {
            return;
        }

        isShiftPressed = true;
    });

    window.addEventListener("keyup", (event) => {
        if (event.key !== "Shift") {
            return;
        }

        isShiftPressed = false;
    });

    window.addEventListener("paste", (event) => {
        const clipboard = event.clipboardData.getData("text/plain").trim();

        if (!isShiftPressed){
            return;
        }

        event.preventDefault();
        const rows = clipboard.split("\n");
        let urlList = [];


        for (const row of rows){
            if (!imageFormats.some(format => row.toLowerCase().endsWith(format))) {
                continue;
            }

            urlList.push(`[ img${imageWidth}(${row}) ](${row})`);
        }

        const transformedClipboard = urlList.join("\n\n");

        window.document.execCommand('insertText', false, transformedClipboard);
    });
})();