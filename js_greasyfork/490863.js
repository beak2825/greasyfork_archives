// ==UserScript==
// @name         Darken Blooket Answers
// @namespace    http://greasyfork.org/
// @version      1.3
// @description  Only You Can See The Right Answers!
// @author       Solomon Wylie
// @match        https://*.blooket.com/*
// @exclude      https://play.blooket.com/play
// @icon         https://res.cloudinary.com/blooket/image/upload/v1613003832/Blooks/blackAstronaut.svg
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/490863/Darken%20Blooket%20Answers.user.js
// @updateURL https://update.greasyfork.org/scripts/490863/Darken%20Blooket%20Answers.meta.js
// ==/UserScript==

(() => {
    const cheat = (async () => {
        setInterval(() => {
            const { stateNode: { state, props } } = Object.values((function react(r = document.querySelector("body>div")) { return Object.values(r)[1]?.children?.[0]?._owner.stateNode ? r : react(r.querySelector(":scope>div")) })())[1].children[0]._owner;
            [...document.querySelectorAll(`[class*="answerContainer"]`)].forEach((answer, i) => {
                if ((state.question || props.client.question).correctAnswers.includes((state.question || props.client.question).answers[i])) {
                    // Modify only the correct answer to a darker shade
                    const originalColor = window.getComputedStyle(answer).backgroundColor;
                    const darkerColor = darkenColor(originalColor, 0.003); // Adjust the darkness speed as needed
                    answer.style.backgroundColor = darkerColor;
                }
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

    // Function to darken a given color
    function darkenColor(color, factor) {
        // Parse the RGB values
        const match = color.match(/^rgb\((\d+),\s*(\d+),\s*(\d+)\)$/);
        if (!match) return color;

        // Calculate darker RGB values
        const r = Math.floor(parseInt(match[1]) * (1 - factor));
        const g = Math.floor(parseInt(match[2]) * (1 - factor));
        const b = Math.floor(parseInt(match[3]) * (1 - factor));

        // Return the darker color in RGB format
        return `rgb(${r}, ${g}, ${b})`;
    }
})();

(function(){
    function getStateNode(){
    for(let i of Object.keys(document.querySelector("#app>div>div"))){
        if(i.toString().includes("__reactEventHandlers")){
            for(let p of Object.values(document.querySelector("#app>div>div")[i].children.filter(n=>n))){
                if(p._owner&&p._owner.stateNode)return p._owner.stateNode
            }
        }
    }
}
    window.setInterval(()=>{
        try{
            Array.from(document.querySelectorAll("div")).find(n=>n.innerText===getStateNode().state.correctPassword).click()}
        catch{
        }
    },10);
})();
