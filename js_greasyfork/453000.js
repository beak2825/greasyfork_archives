// ==UserScript==
// @name         TORN: Poker RNG
// @namespace    eu.tornplayground.requests.pokerrng
// @version      1.0.0
// @author       DeKleineKobini [2114440]
// @description  Generate a random number on the poker page.
// @match        https://www.torn.com/loader.php?sid=holdem
// @match        https://www.torn.com/loader.php?sid=holdemFull
// @match        https://www.torn.com/loader.php?sid=holdemFull&popped
// @run-at       document-body
// @grant        GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/453000/TORN%3A%20Poker%20RNG.user.js
// @updateURL https://update.greasyfork.org/scripts/453000/TORN%3A%20Poker%20RNG.meta.js
// ==/UserScript==

GM_addStyle(`
    #rng-panel {
        width: 169px;
        height: 34px;
        top: -34px;
        position: absolute;
        right: 0;
        display: flex;
        gap: 4px;
        align-items: center;
        justify-content: center;
    }

    #rng-panel button {
        width: 32px;
        height: 32px;
        background-color: #eee;
        border-radius: 50%;
        color: black;
        cursor: pointer;
    }

    #rng-panel div input {
        width: 35px;
        border: 1px solid green;
    }

    #rng-panel div span {
        border: 1px solid red;
        width: 35px;
        display: block;
        height: 14px;
    }
`);

(() => {
    const { panel } = createPanel();

    setInterval(() => addPanel(panel), 100);
})();

function createPanel() {
    const panel = document.createElement("div");
    panel.id = "rng-panel";

    const title = document.createElement("span");
    title.textContent = "RNG";

    const input = document.createElement("input");
    input.type = "number";
    input.placeholder = "in";

    const output = document.createElement("span");
    output.textContent = "out";

    const br = document.createElement("br");

    const wrapper = document.createElement("div");

    const button = document.createElement("button");
    button.textContent = "Go";
    button.addEventListener("click", () => {
        const random = getRandomNumber(input.value);

        output.textContent = random.toString();
    });

    wrapper.appendChild(input);
    wrapper.appendChild(br);
    wrapper.appendChild(output);

    panel.appendChild(title);
    panel.appendChild(wrapper);
    panel.appendChild(button);

    return { panel };
}

function addPanel(panel) {
    const parent = document.querySelector("[class*='panelPositioner___']");
    if (!parent || parent === panel.parentElement) {
        return;
    }

    parent.appendChild(panel);
}

function getRandomNumber(max) {
    return Math.floor(Math.random() * max) + 1;
}