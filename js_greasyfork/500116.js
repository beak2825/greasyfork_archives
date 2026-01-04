// ==UserScript==
// @name            HH Automatic Pachinko Clicker
// @namespace       http://tampermonkey.net/
// @version         0.5
// @description     Simple script to auto buy pachinko
// @match           https://*.hentaiheroes.com/*
// @match           https://*.haremheroes.com/*
// @match           https://*.gayharem.com/*
// @match           https://*.comixharem.com/*
// @match           https://*.hornyheroes.com/*
// @match           https://*.pornstarharem.com/*
// @match           https://*.transpornstarharem.com/*
// @match           https://*.gaypornstarharem.com/*
// @match           https://*.mangarpg.com/*
// @icon            https://www.google.com/s2/favicons?sz=64&domain=hentaiheroes.com
// @author          fafnirtelu
// @grant           none
// @license         MIT
// @downloadURL https://update.greasyfork.org/scripts/500116/HH%20Automatic%20Pachinko%20Clicker.user.js
// @updateURL https://update.greasyfork.org/scripts/500116/HH%20Automatic%20Pachinko%20Clicker.meta.js
// ==/UserScript==

// Press s to start
// Press Esc to stop

let autoClickInterval;
document.addEventListener("keydown", (event) =>
 {
    if (event.key === "s") {
        startAutoClicker();
} else if (event.key === "Escape") {
        stopAutoClicker();
}
});
function startAutoClicker() {
    if (!autoClickInterval) {
        autoClickInterval = setInterval(autoClick, 100);
}
}

function stopAutoClicker() {
    if (autoClickInterval) {
        clearInterval(autoClickInterval);
autoClickInterval = null;
}
}

function autoClick() {
    if (document.getElementsByClassName("play-again-currency").length >
0) {
        document.getElementsByClassName("play-again-currency")[0].click();
}
}