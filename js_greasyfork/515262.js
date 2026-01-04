// ==UserScript==
// @name         uprava
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  ass
// @author       Something begins
// @license      None
// @match       https://www.heroeswm.ru/war*
// @match       https://my.lordswm.com/war*
// @match       https://www.lordswm.com/war*
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @grant        GM_setValue
// @grant        GM_getValue
// @grant unsafeWindow
// @downloadURL https://update.greasyfork.org/scripts/515262/uprava.user.js
// @updateURL https://update.greasyfork.org/scripts/515262/uprava.meta.js
// ==/UserScript==

const inputHTML = `<input type="text" id="uprava_filter_input" placeholder="Ник для управы">`;

function insertInput() {
    const parent = document.querySelector("#bcontrol_users");
    if (parent.querySelector("#uprava_filter_input")) return;
    parent.insertAdjacentHTML("afterbegin", inputHTML);
}

document.addEventListener("keyup", event => {
    if (event.target.id !== "uprava_filter_input") return;

    const parent = document.querySelector("#bcontrol_users");
    for (const child of parent.children) {
        if (child.tagName === "INPUT") continue;

        // Reset all elements' visibility when input is empty
        if (event.target.value === "") {
            child.classList.remove("hidden");
            continue;
        }

        // Check if the element text includes the filter term
        const relevant = child.querySelector("span").textContent.toLowerCase().includes(event.target.value.toLowerCase());
        if (relevant) {
            child.classList.remove("hidden");
        } else {
            child.classList.add("hidden");
        }
    }
});
let root;
const loadedInterval = setInterval(() => {
    root = document.querySelector("#win_BattleControl");
    if (!root) return;
    else {
        clearInterval(loadedInterval);
        root.insertAdjacentHTML("afterbegin",
            `
        <style>
            .hidden {
                display: none;
            }
        </style>
            `);
        insertInput();

        const observer = new MutationObserver(mutations => {
            mutations.forEach(mutation => {
                if (mutation.type === 'childList' && mutation.addedNodes.length > 0) {
                    insertInput();
                }
            });
        });
        const config = { childList: true, subtree: true };
        observer.observe(root, config);
    }

}, 100);