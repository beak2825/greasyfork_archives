// ==UserScript==
// @name         rgbLoadingBar
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Добавление RGB 
// @author       Уэнсдэй
// @match        https://zelenka.guru/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=zelenka.guru
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/479399/rgbLoadingBar.user.js
// @updateURL https://update.greasyfork.org/scripts/479399/rgbLoadingBar.meta.js
// ==/UserScript==

const observer = new MutationObserver((mutationsList, observer) => {
    const elements = document.querySelectorAll('.loadingBar');
    for(let i = 0; i < elements.length; i++) {

        elements[i].style.background = 'linear-gradient(90deg, red, orange, yellow, green, blue, indigo, violet)';
        elements[i].style.backgroundSize = '300% 300%';
        elements[i].style.animation = 'rainbow 3s ease infinite';
    }
});
const styleSheet = document.createElement("style");
styleSheet.type = "text/css";
styleSheet.innerText = `
@keyframes rainbow {
    0%,100% {
        background-position: 0% 50%;
    }
    50% {
        background-position: 100% 50%;
    }
}`;
document.head.appendChild(styleSheet);

observer.observe(document, { childList: true, subtree: true });
