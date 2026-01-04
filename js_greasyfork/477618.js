// ==UserScript==
// @name         Авто Закрыто
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Суетная отправка
// @author       Mayni1337
// @match        https://zelenka.guru/*
// @grant        none
// @iconURL      https://nztcdn.com/files/310336b3-c10e-4ad1-8fdf-0bbe73835ca1.webp
// @downloadURL https://update.greasyfork.org/scripts/477618/%D0%90%D0%B2%D1%82%D0%BE%20%D0%97%D0%B0%D0%BA%D1%80%D1%8B%D1%82%D0%BE.user.js
// @updateURL https://update.greasyfork.org/scripts/477618/%D0%90%D0%B2%D1%82%D0%BE%20%D0%97%D0%B0%D0%BA%D1%80%D1%8B%D1%82%D0%BE.meta.js
// ==/UserScript==


// ==UserScript==
// @name         Засылка суеты
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Суетная отправка
// @author       Mayni1337
// @match        https://zelenka.guru/*
// @grant        none
// @iconURL      https://nztcdn.com/files/310336b3-c10e-4ad1-8fdf-0bbe73835ca1.webp
// ==/UserScript==

(function() {
    'use strict';


    function addSuetaText() {
        const contentElement = document.querySelector('.fr-element');
        const currentParagraph = contentElement.querySelector('p');


        currentParagraph.textContent += '[B]Закрыто[/B]:smile_closed:';
        sendButton.click();
    }


    const smilieButton = document.querySelector('div[data-cmd="xfSmilie"]');


    smilieButton.addEventListener('click', addSuetaText);


    const sendButton = document.querySelector('.lzt-fe-se-sendMessageButton');ццццццццццццццццц
})();