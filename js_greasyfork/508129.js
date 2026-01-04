// ==UserScript==
// @name         Restrict auto-refresh
// @namespace    http://tampermonkey.net/
// @version      0.1.2
// @description  Обновление на всех страницах откладывается по движению курсора/задержанию тапа на моб. устройстве
// @author       Something begins
// @license      none
// @include     /^https{0,1}:\/\/((www|my)\.(heroeswm|lordswm)\.(ru|com)|178\.248\.235\.15)\/.+/
// @icon         https://www.google.com/s2/favicons?sz=64&domain=heroeswm.ru
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/508129/Restrict%20auto-refresh.user.js
// @updateURL https://update.greasyfork.org/scripts/508129/Restrict%20auto-refresh.meta.js
// ==/UserScript==
const timeout = 3;

(function() {
    if (!Delta) return;
    document.addEventListener("mousemove", event =>{
        if (Delta <= timeout) Delta = timeout;
    });
    document.addEventListener("scroll", event =>{
        if (Delta <= timeout) Delta = timeout;
    });
    let tapHoldInterval;
    let isHolding = false;
    element.addEventListener('touchstart', (e) => {

        isHolding = true;
        tapHoldInterval = setInterval(() => {
            if (isHolding) {
                if (Delta <= timeout) Delta = timeout;
            }
        }, 100);
    });


    element.addEventListener('touchend', (e) => {
        // Stop the interval when the touch ends
        clearInterval(tapHoldInterval);
        isHolding = false;
    });
})();