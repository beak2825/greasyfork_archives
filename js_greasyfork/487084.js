// ==UserScript==
// @name         fookURLOpen
// @namespace    http://tampermonkey.net/
// @version      2024-02-11
// @description  blur the page when opening a new tab, then unblur it after 5 seconds
// @author       You
// @match        http://*/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=tampermonkey.net
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/487084/fookURLOpen.user.js
// @updateURL https://update.greasyfork.org/scripts/487084/fookURLOpen.meta.js
// ==/UserScript==

(function () {
'use strict';

// apply blur filter css to body
function setBlur(px) {
    if (px <= 0) {
        document.body.style.filter = `none`;
        return
    }
    document.body.style.filter = `blur(${px}px)`;
}


function hookNavigation() {
    navigation.addEventListener('navigatesuccess', (e) => {
        console.log(e);
        // alert('on navigate success');
        alert('destination url: ' + e.target.currentEntry.url);
        // if (e.target.currentEntry.url === 'https://www.youtube.com/') {
        // }
        startBlurLoop();
    });
}

function hookNavigationLegacy() {
    // jsによるurl書き換えをフックする
    let oldHref = document.location.href;
    const body = document.querySelector("body");
    const observer = new MutationObserver(mutations => {
        if (oldHref !== document.location.href) {
            oldHref = document.location.href;
            // Changed ! your code here
            // alert('url changed');
            startBlurLoop();
        }
    });
    observer.observe(body, { childList: true, subtree: true });
}

// setTimeout+blurの数値指定のが、アニメーションが安定しそう
function startBlurLoop() {
    const startBlur = 10;
    const duration = 5;
    const interval = 0.1;
    const maxFrame = duration / interval;
    const deltaBlur = startBlur / maxFrame;
    setBlur(startBlur);

    for (let i = 1; i <= maxFrame; i++) {
        setTimeout(() => {
            setBlur(startBlur - i * deltaBlur);
        }, interval * i * 1000);
    }
}

function main() {
    startBlurLoop();
    // hookNavigation();
    hookNavigationLegacy();
}

main();

})();