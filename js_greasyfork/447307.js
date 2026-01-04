// ==UserScript==
// @name         Wordle Solution
// @namespace    http://github.com/Alex-M-Howard/UserSCripts
// @version      1.0
// @match        https://*.nytimes.com/games/wordle/*
// @description  Don't let wordle intimidate you, for you will always win. Hover your mouse on the wordle logo at top of page and you will see the daily word!
// @author       Alex Howard
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/447307/Wordle%20Solution.user.js
// @updateURL https://update.greasyfork.org/scripts/447307/Wordle%20Solution.meta.js
// ==/UserScript==

(function() {
    const header = document.getElementsByTagName("header")

    let timer = setInterval(function () {
        if (header.length > 0){
            console.log('Now we are here')
            runMouseOver(timer)
            //header[0].firstElementChild.nextElementSibling.innerText = solution
            clearInterval(timer);
        }
    }, 1000)
}

)()

function runMouseOver(timer) {
    clearInterval(timer);
    const solution = (JSON.parse(localStorage['nyt-wordle-state']).solution).toUpperCase();
    const header = document.getElementsByTagName("header")[0];
    let text = header.firstElementChild.nextElementSibling;
    const logo = text.innerText

    header.addEventListener("mouseover", function (event) {
        text.innerText = solution;
        return
    })

    header.addEventListener("mouseout", function (event) {
        text.innerText = logo;
    })

}