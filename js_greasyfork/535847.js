// ==UserScript==
// @name         Upload from clipboard
// @namespace    http://tampermonkey.net/
// @version      2025-05-13-2
// @description  upload images to sillypost from your clipboard!
// @author       niko.earth
// @match        https://sillypost.net/
// @icon         https://www.google.com/s2/favicons?sz=64&domain=sillypost.net
// @grant        none
// @license GNU GPLv3
// @downloadURL https://update.greasyfork.org/scripts/535847/Upload%20from%20clipboard.user.js
// @updateURL https://update.greasyfork.org/scripts/535847/Upload%20from%20clipboard.meta.js
// ==/UserScript==

(function() {
    'use strict';

    async function onbuttonclicked() {
        const clipboardItems = await navigator.clipboard.read();
        if (clipboardItems.length == 0) {
            alert("clipboard was empty! did you try to paste a file instead of image data?");
        }
        clipboardItems.forEach(async element => {
            element.types.forEach(async type => {
                if (!["image/png", "image/gif", "image/jpeg"].includes(type)) { return }
                if (element.types.includes(type)) {
                    const blob = await element.getType(type)

                    let file = new File([blob], `clipboard-${new Date().toISOString().split(".")[0]}.${type.split("/")[1]}`,{type:type, lastModified:new Date().getTime()});
                    let container = new DataTransfer();
                    container.items.add(file);

                    document.getElementById("sketch").files = container.files;
                }
            })
        });
    }

    const sketchButton = document.getElementById("sketch");
    const clipboardButton = document.createElement("button");
    clipboardButton.innerText = "image from clipboard..."
    clipboardButton.onclick = onbuttonclicked;
    clipboardButton.setAttribute("type", "button");
    sketchButton.after(clipboardButton)
})();