// ==UserScript==
// @name         煎蛋彩色名字
// @version      1.0
// @icon         http://cdn.jandan.net/static/img/favicon.ico
// @description  彩色名字
// @author       kasusa
// @match        http*://jandan.net/*
// @match        http*://i.jandan.net/*
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_deleteValue
// @grant        GM_addStyle
// @grant        GM_registerMenuCommand
// @namespace https://greasyfork.org/users/734613
// @downloadURL https://update.greasyfork.org/scripts/497637/%E7%85%8E%E8%9B%8B%E5%BD%A9%E8%89%B2%E5%90%8D%E5%AD%97.user.js
// @updateURL https://update.greasyfork.org/scripts/497637/%E7%85%8E%E8%9B%8B%E5%BD%A9%E8%89%B2%E5%90%8D%E5%AD%97.meta.js
// ==/UserScript==

(function() {

    var username = respond.textContent.split(',')[0];
    const style = document.createElement('style');
    style.textContent = `
    .rainbow-text {
        width: 200%;
        background-color: #4158D0;
        background-image: linear-gradient(43deg, #4158D0 0%, #C850C0 46%, #FFCC70 100%);

        -webkit-text-fill-color: transparent;
        background-clip: text;
        background-size: 200% 100%;
        animation: maskedAnimation 10s infinite linear;
    }

    @keyframes maskedAnimation {
        0% {
            background-position: 0 0;
        }

        50% {
            background-position: 100% 0;
        }

        100% {
            background-position: 0 0;
        }
    }

`;
    document.head.appendChild(style);
    document.querySelectorAll("strong").forEach(element => {
        if (element.textContent.trim() === username) {
            element.classList.add('rainbow-text');
        }});

})();