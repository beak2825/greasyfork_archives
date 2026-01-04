// ==UserScript==
// @name         [DOGEWARE]KahootBot Join Random Kahoots
// @namespace    http://tampermonkey.net/
// @version      2024-03-02
// @description  This will try to join hundreds of kahoot lobby until it finds a available lobby and joins it --Warnning this may take over 1-10 minutes to find a open lobby
// @author       Dogware
// @match        *://kahoot.it/*
// @exclude      *://kahoot.it/challenge/*
// @exclude      *://kahoot.it/play*
// @exclude      *://kahoot.it/join*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=kahoot.it
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/488769/%5BDOGEWARE%5DKahootBot%20Join%20Random%20Kahoots.user.js
// @updateURL https://update.greasyfork.org/scripts/488769/%5BDOGEWARE%5DKahootBot%20Join%20Random%20Kahoots.meta.js
// ==/UserScript==
let lux = 0;
let s_1 = 400;
function generateRandomNumbers() {
    let result = '';
    const characters = '0123456789';
    const charactersLength = characters.length;
    for (let i = 0; i < 7; i++) {
        result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
}
setInterval(() => {
    const overlays = document.getElementsByClassName('overlay__Overlay-sc-11p2bs0-0 gRviLo');

    for (let i = 0; i < overlays.length; i++) {
        const overlay = overlays[i];
        overlay.remove();
    }
    const elements = document.getElementsByClassName('notification-bar__NotificationBar-sc-1e4wbj0-0');

    const elementsArray = Array.from(elements);

    elementsArray.forEach(element => {
        element.remove();
    });
}, 0)
setInterval(() => {
    let nums = generateRandomNumbers()
    document.title = `KAHOOT.IT ${nums} DOGEWARE`;
    document.getElementById('game-input').value = nums
    setTimeout(() => {
        location.href = `https://kahoot.it/?pin=${nums}&refer_method=link`
    }, s_1 / 2);
    lux++
}, s_1);
if (lux >= 500) {
    location.reload()
}
