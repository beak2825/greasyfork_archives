// ==UserScript==
// @name         No distractions - dark
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  A no distractions, dark theme for learn.dvorak.nl (not recommended when learning dvorak).
// @author       KaHLK
// @match        https://learn.dvorak.nl/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/395584/No%20distractions%20-%20dark.user.js
// @updateURL https://update.greasyfork.org/scripts/395584/No%20distractions%20-%20dark.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const kb = document.querySelector("#kb");
    kb.innerHTML = "";

    const border = document.querySelector("#border");
    const body = document.body;
    body.innerHTML = "";

    body.append(border);

    const styl = document.createElement("style");

    styl.innerHTML = `
        #currentword{
            color: #222;
        }
`;

    body.append(styl);

    body.style = `
        background: #000;
`;

    border.style = `
        width: 70ch;
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);

        background: #222;
        color: #fafafa;
`;

    border.querySelector("#words-outer").style = `
        background: #333;
`;

    border.querySelector("#words").style = `
        background: transparent;
`;

    border.querySelector("#input").style = `
        color: #fafafa;
`;

    border.querySelector("#score").style = `
        display: flex;
        justify-content: space-between;
`;

    border.querySelectorAll("#score span").forEach(e => e.style = `
        background: transparent;
        font-size: 90%;
        padding: .5em;
        border: 1px solid #333;
`);

    border.querySelectorAll("#score select").forEach(e => e.style = `
        background: transparent;
        color: inherit;
        border: 0;
`);

    border.querySelector("div#score span").remove();

    const or = $tutor.report;
    $tutor.report = function() {
        const minutes = (time() - this.starttime) / 60;
        const seconds = Math.round(minutes % 1 * 60);
        const r = or();
        return `<p style='text-align: left; margin: 0 0 0 .5rem'>
            time: ${Math.round(minutes)}:${seconds > 9 ? seconds : "0" + seconds}<br>
            Accuracy: ${Math.round(this.goodchars / this.chars * 10000) / 100} (cpm = ${this.cpm}, wpm = ${this.wpm})<br>
            Wrong characters: ${this.chars - this.goodchars} (${this.chars} total, ${this.goodchars} good)
        </p>${r}`
    }
})();