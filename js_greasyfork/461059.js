// ==UserScript==
// @name         Main Menu Button on Duels
// @version      1.0.0
// @description  Adds the Main Menu button back to the Duels Summary Screen
// @match        https://www.geoguessr.com/*
// @author       Tyow#3742
// @grant        none
// @license      MIT
// @namespace    https://greasyfork.org/en/users/1011193-tyow
// @downloadURL https://update.greasyfork.org/scripts/461059/Main%20Menu%20Button%20on%20Duels.user.js
// @updateURL https://update.greasyfork.org/scripts/461059/Main%20Menu%20Button%20on%20Duels.meta.js
// ==/UserScript==

function checkURL() {
    return location.pathname.startsWith("/duels") && location.pathname.endsWith("/summary")
};

let menuButton = document.createElement('a');
menuButton.classList.add("button_button__CnARx");
menuButton.classList.add("button_variantSecondary__lSxsR");
menuButton.href = "https://www.geoguessr.com/competitive";
menuButton.style.marginLeft = "15px";

let buttonWrapper = document.createElement('div');
buttonWrapper.classList.add("button_wrapper__NkcHZ");

let text = document.createElement('span');
text.classList.add("button_label__kpJrA");
text.innerHTML = "Main Menu";

buttonWrapper.appendChild(text);
menuButton.appendChild(buttonWrapper);


function doCheck() {
    let play = document.querySelector('button[class*="button_button__CnARx button_variantPrimary__xc8Hp"]');
    if (play) {
        play.parentElement.appendChild(menuButton);
    }
};

let lastDoCheckCall = 0;
new MutationObserver(async (mutations) => {
    if (!checkURL() || lastDoCheckCall >= (Date.now() - 50)) return;
    lastDoCheckCall = Date.now();
    doCheck();
}).observe(document.body, { subtree: true, childList: true });
