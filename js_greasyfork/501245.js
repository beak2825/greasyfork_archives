// ==UserScript==
// @name         elGoogle
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Better "Гугал поиск"
// @author       ellatuk
// @match        https://www.google.com/*
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/501245/elGoogle.user.js
// @updateURL https://update.greasyfork.org/scripts/501245/elGoogle.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Function to add CSS styles
    function addGlobalStyle(css) {
        const head = document.getElementsByTagName('head')[0];
        if (!head) { return; }
        const style = document.createElement('style');
        style.type = 'text/css';
        style.innerHTML = css;
        head.appendChild(style);
    }

    // Делаем гугал гуглам
    addGlobalStyle(`
        .lnXdpd {
            content: url('https://i7.imageban.ru/out/2024/07/20/eac25e8f5b8d656a7336d1fb7767b21c.png') !important;
            width: auto !important;
            height: auto !important;
        }
    `);

    // убираем нижний кринж
    addGlobalStyle(`
        #SIvCob {
            display: none !important;
        }
    `);

    // прям убираем этот кринж
    addGlobalStyle(`
        div[jscontroller="NzU6V"] * {
            color: transparent !important;
        }
    `);

    // поисковая строка может быть лучше!
    addGlobalStyle(`
        .RNNXgb {
            border-radius: 34px 14px !important;
            background-color: #121212 !important;
            border: 3px solid #1c1d1d !important;
            background: #121212 !important;
        }
        .Umvnrc {
            display: none !important;
        }
        .Ne6nSd {
            display: flex !important;
            align-items: center !important;
            padding: 1px !important;
            color: #121212 !important;
        }
        #gb {
            background-color: #161616 !important;
        }
    `);

    // убираем говно с экрана
    addGlobalStyle(`
        .gNO89b {
            display: none !important;
        }
    `);

    // вот теперь говна нет (почти)
    addGlobalStyle(`
        .RNmpXc {
            display: none !important;
        }
    `);

    // настоящий тёмный
    addGlobalStyle(`
        body {
            background-color: #161616 !important;
        }
    `);
})();