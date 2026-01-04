// ==UserScript==
// @name         Quizlet TSV Export
// @namespace    http://tampermonkey.net/
// @version      2024-03-21
// @description  Copies Quizlet flashcards to clipboard in TSV format
// @author       ioc
// @license      AGPLv3
// @match        https://quizlet.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=quizlet.com
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/490470/Quizlet%20TSV%20Export.user.js
// @updateURL https://update.greasyfork.org/scripts/490470/Quizlet%20TSV%20Export.meta.js
// ==/UserScript==

function getCards() {
    const data = document.querySelectorAll("span.TermText");
    if (!data.length) return;

    let result = [];

    Array.from(data).forEach((x, i, arr) => {
        if (i % 2 === 0) {
            result.push(`${x.innerText}\t${arr[i + 1].innerText}`);
        }
    });

    return result;
}

(function() {
    'use strict';

    const classes = ["AssemblyButtonBase", "AssemblySecondaryButton", "AssemblyButtonBase--medium", "AssemblyButtonBase--padding"];

    const result = getCards();
    const titleElem = document.querySelectorAll("h1")[0];
    const btn = document.createElement("button");

    btn.style.marginLeft = "0.5rem";

    classes.forEach((c) => {
        btn.classList.add(c);
    });

    btn.innerText = "Copy TSV";

    btn.onclick = () => {
        try {
            window.navigator.clipboard.writeText(result.join("\n\n"));
            btn.innerText = "Copied!";
        } catch (e) {
            btn.innerText = "Error";
            console.warn("Quizlet TSV Export:", e);
        }

        setTimeout(() => {
            btn.innerText = "Copy TSV";
        }, 500);
    };

    titleElem.appendChild(btn);

})();