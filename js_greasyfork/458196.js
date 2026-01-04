// ==UserScript==
// @name         Ghost Game Fix
// @version      1.0.0
// @description  Disables the "play again" button after you press it on duels for 30 seconds
// @match        https://www.geoguessr.com/*
// @author       Tyow#3742
// @grant        none
// @license      MIT
// @namespace    https://greasyfork.org/en/users/1011193-tyow
// @downloadURL https://update.greasyfork.org/scripts/458196/Ghost%20Game%20Fix.user.js
// @updateURL https://update.greasyfork.org/scripts/458196/Ghost%20Game%20Fix.meta.js
// ==/UserScript==

const disableButton = b => {
    b.disabled = true;
    // This only comes into play for a couple of the buttons
    b.style.color = "black";
    // Countdown div
    let d = document.createElement("div");
    d.style.fontSize = "22px";
    d.style.color = "white";
    b.appendChild(d);
    // Wait 30 seconds, then reenable
    // https://stackoverflow.com/questions/18785217/countdown-timer-in-javascript-using-settimeout
    const countDown = (endTime) => {
        if (endTime > 0) {
            d.innerText = endTime;
            setTimeout(() => countDown(endTime -1), 1000);
        } else {
            b.disabled = false;
            b.style.color = "white";
            b.removeChild(d);
        }
    }
    countDown(30);
}

// Wait for window to load, so that the button will be there
window.onload = (event) => {
    // Play Again button
    let button = document.getElementsByClassName("button_button__CnARx button_variantPrimary__xc8Hp")[0];
    if (location.pathname.startsWith("/duels") && location.pathname.endsWith("/summary")) {
        while (button == undefined) {
            button = document.getElementsByClassName("button_button__CnARx button_variantPrimary__xc8Hp")[0];
        }
        // If here, the buttons have loaded into the dom
        button.addEventListener("click", () => disableButton(button));
        console.log("disable button attached for: ");
        console.log(button);
        return;
    }
    // Buttons for game mode at /competitive page
    let compButtons = document.getElementsByClassName("play_card__svL35");
    if (location.pathname.startsWith("/competitive")) {
        while (compButtons.length == 0) {
            console.log(compButtons);
            compButtons = document.getElementsByClassName("play_card__svL35");
        }
        // If here, the buttons have loaded into the dom
        for (let i = 0; i < compButtons.length; i++) {
            compButtons[i].addEventListener("click", () => disableButton(compButtons[i]));
            console.log("disable button attached for: ");
            console.log(compButtons[i]);
        }
        return;
    }
    // Buttons at multiplayer page
    let multButtons = document.getElementsByClassName("game-menu-button_button__WPwVi game-menu-button_fillParent__2Dqat");
    if (location.pathname.startsWith("/multiplayer")) {
        while (multButtons.length == 0) {

            console.log(multButtons);
            multButtons = document.getElementsByClassName("game-menu-button_button__WPwVi game-menu-button_fillParent__2Dqat");
        }
        // If here, the buttons have loaded into the dom
        for (let i = 0; i < multButtons.length; i++) {
            multButtons[i].addEventListener("click", () => disableButton(multButtons[i]));
            console.log("disable button attached for: ");
            console.log(multButtons[i]);
        }
        return;
    }
};