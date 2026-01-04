// ==UserScript==
// @name         Pikabu. Звездный фон
// @namespace    https://pikabu.ru/
// @version      1.0.0
// @description  Вернуть звездный фон, как был на День космонавтики
// @author       maiks1900
// @match        https://pikabu.ru/*
// @match        http://pikabu.ru/*
// @icon         https://cs.pikabu.ru/assets/favicon.ico
// @license MIT
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/492456/Pikabu%20%D0%97%D0%B2%D0%B5%D0%B7%D0%B4%D0%BD%D1%8B%D0%B9%20%D1%84%D0%BE%D0%BD.user.js
// @updateURL https://update.greasyfork.org/scripts/492456/Pikabu%20%D0%97%D0%B2%D0%B5%D0%B7%D0%B4%D0%BD%D1%8B%D0%B9%20%D1%84%D0%BE%D0%BD.meta.js
// ==/UserScript==

(function() {
    'use strict';

    var css = `
    @keyframes slide {
        0% {
            background-position: 0 0;
        }
        100% {
            background-position: -300px -200px;
        }
    }
    html[data-theme-dark] {
        body {
            background: #000 url(https://cs13.pikabu.ru/images/big_size_comm/2024-04_3/1713015201116956858.jpg) repeat;
            background-attachment: fixed !important;
        }
        body:before {
            position: fixed;
            width: 100vw;
            height: 100vh;
            background: url(https://cs14.pikabu.ru/post_img/2024/04/09/6/1712655426155463209.png);
            content: ' ';
            animation: 10s slide infinite;
            animation-timing-function: linear;
        }
    }`,
    head = document.head || document.getElementsByTagName('head')[0],
    style = document.createElement('style');

    head.appendChild(style);

    style.type = 'text/css';
    if (style.styleSheet){
        // This is required for IE8 and below.
        style.styleSheet.cssText = css;
    } else {
        style.appendChild(document.createTextNode(css));
    }
})();