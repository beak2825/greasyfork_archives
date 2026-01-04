// ==UserScript==
// @name         CSES copy button
// @namespace    https://github.com/zica87/self-made-userscipts
// @version      1.0
// @description  Add copy buttons for input and output
// @author       zica
// @match        https://cses.fi/problemset/task/*
// @grant        GM_addStyle
// @license      GPL-3.0
// @downloadURL https://update.greasyfork.org/scripts/534112/CSES%20copy%20button.user.js
// @updateURL https://update.greasyfork.org/scripts/534112/CSES%20copy%20button.meta.js
// ==/UserScript==

(function () {
    "use strict";

    const cssString = `
.copy-button {
    margin-left: 0.5em;
}

.copy-mode {
    cursor: pointer;
}

.copied-mode {
    cursor: unset;
}

.copied-block{
    border: solid #ff9b30;
    padding: 10px;
}
`;
    GM_addStyle(cssString);
    add_buttons();

    function toCopyMode(button, block) {
        button.textContent = "copy";
        button.classList.add("copy-mode");
        button.classList.remove("copied-mode");
        block.classList.remove("copied-block");
    }
    function toCopiedMode(button, block) {
        button.textContent = "✅copied";
        button.classList.add("copied-mode");
        button.classList.remove("copy-mode");
        block.classList.add("copied-block");
    }
    function add_buttons() {
        const blocks = document.getElementsByTagName("pre");
        for (const block of blocks) {
            const button = document.createElement("button");
            button.className = "copy-button";
            button.onclick = async () => {
                if (button.textContent[0] === "✅") {
                    return;
                }
                try {
                    await navigator.clipboard.writeText(block.textContent);
                    toCopiedMode(button, block);
                    setTimeout(() => {
                        toCopyMode(button, block);
                    }, 3000);
                } catch (error) {
                    alert(error.message);
                    console.error(error);
                }
            };
            toCopyMode(button, block);
            block.previousElementSibling.append(button);
        }
    }
})();
