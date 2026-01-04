// ==UserScript==
// @name     YandexGame style fix old
// @description Сбор информации о текущих проектах поддержки розницы
// @version  3
// @include     https://yandex.ru/games/app/*
// @grant    none
// @license MIT
// @namespace https://greasyfork.org/users/2055
// @downloadURL https://update.greasyfork.org/scripts/474663/YandexGame%20style%20fix%20old.user.js
// @updateURL https://update.greasyfork.org/scripts/474663/YandexGame%20style%20fix%20old.meta.js
// ==/UserScript==

console.log("YAD__0/1 start")

window.onload = function() {
    setTimeout(function () {
        console.log("YAD__0/2 window loaded")
        let gameDiv = document.querySelector('div.game');
        if (gameDiv) {
            console.log("YAD__0", gameDiv)
            //gameDiv.style.width = '100% !important';
            gameDiv.style.boxSizing = 'border-box';
            gameDiv.style.width = 'calc(100% - 10px)';

            console.log("YAD__0/3", gameDiv.style)
            console.log("YAD__0/4", gameDiv.style.width)
            let previousDiv = gameDiv.previousElementSibling;
            console.log("YAD__1", previousDiv)
            if (previousDiv && previousDiv.tagName === 'DIV') {
                previousDiv.style.display = 'none';
            }
        }
    }, 10000); // Задержка в 5000 миллисекунд, или 5 секунд

    setInterval(function () {
        console.log("YAD__5 elements");
        let gameDiv = document.querySelector('div.game');
        if (gameDiv) {
            console.log("YAD__0", gameDiv)
            //gameDiv.style.width = '100% !important';
            gameDiv.style.boxSizing = 'border-box';
            gameDiv.style.width = 'calc(100% - 10px)';
        }
    }, 10000);
};

