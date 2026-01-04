// ==UserScript==
// @name         Taming.io Uncensor Chat
// @namespace    http://tampermonkey.net/
// @version      0.9
// @description  Uncensors selected words by the user.
// @author       You
// @match        https://taming.io/
// @match        https://biologyclass.school/
// @match        https://trymath.org/
// @match        https://school-homework.com/
// @match        https://tamming.io/
// @match        https://mathcool.glitch.me/
// @match        https://sandtimer.net/
// @match        https://mynotetaking.com/
// @icon         https://taming.io/img/creature/boss-grim-reaper-scythe-skin1.png
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/466952/Tamingio%20Uncensor%20Chat.user.js
// @updateURL https://update.greasyfork.org/scripts/466952/Tamingio%20Uncensor%20Chat.meta.js
// ==/UserScript==

const selector = document.querySelector("input");
const character = "‎";
let censoredWords = [];
let text;

selector.addEventListener("input", () => {
    text = selector.value;
    if (text.includes("/wl") || text.includes("/bl")) return;
    censoredWords.forEach((word) => {
        const regex = new RegExp(word, 'gi');
        selector.value = selector.value.replace(regex, (match) => {
            return match[0] + character + match.substring(1);
        });
    });
});
selector.addEventListener("keyup", (event) => {
    if (event.key === "Enter") {
        let words = [];

        if (text != undefined) words = text.split(" ");

        let word;

        if (words.includes("/wl")) {
            word = words[words.indexOf("/wl") + 1];
        } else if (words.includes("/bl")) {
            word = words[words.indexOf("/bl") + 1]
        } else {
            return;
        }

        if (words.length > 1 && word != "") {
            if (text.includes("/wl") && !censoredWords.includes(word)) {
                censoredWords.push(word);
            } else if (text.includes("/bl")) {
                if (censoredWords.includes(word)) censoredWords.splice(censoredWords.indexOf(word), 1);
            }
        }
    }
});