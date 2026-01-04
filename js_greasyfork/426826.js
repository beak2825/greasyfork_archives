// ==UserScript==
// @name         Freerice
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Make sure you are on multiplication table
// @author       You
// @match        https://freerice.com/categories/multiplication-table
// @icon         https://www.google.com/s2/favicons?domain=google.com
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/426826/Freerice.user.js
// @updateURL https://update.greasyfork.org/scripts/426826/Freerice.meta.js
// ==/UserScript==

let getCard = () => {
    try {
        let solution = eval(document.getElementsByClassName("card-title")[0].innerHTML.replace("x", "*").split("=")[0]);
        let cards = document.getElementsByClassName("card-button");
        if (cards[0].innerHTML == solution) cards[0].click();
        else if (cards[1].innerHTML == solution) cards[1].click();
        else if (cards[2].innerHTML == solution) cards[2].click();
        else if (cards[3].innerHTML == solution) cards[3].click();
        else cards[0].click();
    }
    catch {
        try {
            document.getElementsByClassName("card-button")[0].click();
        }
        catch {
            alert("FATAL ERROR");
        }
    }
};
setInterval(getCard, 1000);
