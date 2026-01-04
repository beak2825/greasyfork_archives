// ==UserScript==
// @name         Copy PC Specialist specification
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Copy a PC Specialist specification to the clipboard
// @author       sck451
// @match        https://www.pcspecialist.co.uk/misc/forum.php
// @icon         https://www.google.com/s2/favicons?sz=64&domain=pcspecialist.co.uk
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/477157/Copy%20PC%20Specialist%20specification.user.js
// @updateURL https://update.greasyfork.org/scripts/477157/Copy%20PC%20Specialist%20specification.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const button = document.createElement("button");
    button.textContent = "Copy to clipboard";
    button.style.position = "fixed";
    button.style.right = "10";
    button.style.top = "10";
    button.style.fontSize = "1.5em";
    button.style.padding = "0.5em";

    button.addEventListener("click", () => {
        const range = document.createRange();
        range.selectNode(document.querySelectorAll("div")[1]);
        window.getSelection().addRange(range);
        document.execCommand("copy");
        document.getSelection().removeAllRanges();
    });

    document.body.appendChild(button);
})();