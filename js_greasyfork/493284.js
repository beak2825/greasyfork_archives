// ==UserScript==
// @name         Highlight Answers
// @namespace    http://greasyfork.org/
// @version      13
// @description  View All The Correct Answers on Blooket
// @author       You
// @match        https://*.blooket.com/*
// @exclude      https://play.blooket.com/play
// @icon         https://res.cloudinary.com/blooket/image/upload/v1613003832/Blooks/purpleAstronaut.svg
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/493284/Highlight%20Answers.user.js
// @updateURL https://update.greasyfork.org/scripts/493284/Highlight%20Answers.meta.js
// ==/UserScript==
 
(() => {
    const cheat = (async () => {
        setInterval(() => {
            const { stateNode: { state, props } } = Object.values((function react(r = document.querySelector("body>div")) { return Object.values(r)[1]?.children?.[0]?._owner.stateNode ? r : react(r.querySelector(":scope>div")) })())[1].children[0]._owner;
            [...document.querySelectorAll(`[class*="answerContainer"]`)].forEach((answer, i) => {
                if ((state.question || props.client.question).correctAnswers.includes((state.question || props.client.question).answers[i])) answer.style.backgroundColor = "rgb(0, 207, 119)";
                else answer.style.backgroundColor = "rgb(189, 15, 38)";
            });
        });
    });
    let img = new Image;
    img.src = "https://raw.githubusercontent.com/05Konz/Blooket-Cheats/main/autoupdate/timestamps/global/intervals/highlightAnswers.png?" + Date.now();
    img.crossOrigin = "Anonymous";
    img.onload = function() {
        const c = document.createElement("canvas");
        const ctx = c.getContext("2d");
        ctx.drawImage(img, 0, 0, this.width, this.height);
        let { data } = ctx.getImageData(0, 0, this.width, this.height), decode = "", last;
        for (let i = 0; i < data.length; i += 4) {
            let char = String.fromCharCode(data[i + 1] * 256 + data[i + 2]);
            decode += char;
            if (char == "/" && last == "*") break;
            last = char;
        }
        const [_, time, error] = decode.match(/LastUpdated: (.+?); ErrorMessage: "([\s\S]+?)"/);
        if (parseInt(time) <= 1708817191528) cheat();
    }
    img.onerror = img.onabort = () => {
        img.onerror = img.onabort = null;
        cheat();
    }
})();