// ==UserScript==
// @name         Style Forum BR (dark)
// @namespace    https://forum.blackrussia.online
// @version      1.0.1
// @description  Для стилизации форума
// @author       zendwall
// @license      zendwall
// @match        https://forum.blackrussia.online/*
// @include      https://forum.blackrussia.online/
// @icon         https://i.yapx.ru/ViO6c.png
// @grant        GM.addStyle
// @downloadURL https://update.greasyfork.org/scripts/485714/Style%20Forum%20BR%20%28dark%29.user.js
// @updateURL https://update.greasyfork.org/scripts/485714/Style%20Forum%20BR%20%28dark%29.meta.js
// ==/UserScript==
GM.addStyle("body{background-color:#000000!important}"); //Фон бэкграунда
// ==/UserScript==
(function () {
    'use strict';

    function createDark() {

        const Dark = [];

        function setupCanvas() {
            const canvas = document.createElement('canvas');
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
            canvas.id = 'dark';
            canvas.style.position = 'fixed';
            canvas.style.top = '0';
            canvas.style.left = '0';
            canvas.style.pointerEvents = 'none';
            canvas.style.zIndex = '99999';
            canvas.style.filter = 'blur(0px)';
            document.body.appendChild(canvas);

            return canvas.getContext('2d');
        }
    }

    function removeDark() {
        const darkCanvas = document.querySelector('#dark');
        document.body.removeChild(darkCanvas);
    }

    const messageCellUser = document.querySelectorAll('.message-cell--user');
    messageCellUser.forEach(function (cell) {
        cell.style.background = '#111111';
    });

    const messageCellMain = document.querySelectorAll('.message-cell--main');
    messageCellMain.forEach(function (cell) {
        cell.style.background = '#111111';
    });

    const avatar = document.querySelectorAll('.avatar-u374949-s');
    avatar.forEach(function (cell) {
        cell.style.border = '5px double #111111';
    });

    const hstyle1 = document.querySelectorAll('.p-header'); // Фон лого
    hstyle1.forEach(function(cell) {
        cell.style.background = '#000000';
    });

    const hstyle2 = document.querySelectorAll('.p-staffBar'); // Фон модер
    hstyle2.forEach(function(cell) {
        cell.style.background = '#000000';
    });

    const hstyle3 = document.querySelectorAll('.uix_searchForm'); // Фон поиска
    hstyle3.forEach(function(cell) {
        cell.style.background = '#000000';
    });

    const hstyle4 = document.querySelectorAll('.p-nav-inner');
    hstyle4.forEach(function(cell) {
        cell.style.background = '#000000';
    });

    const hstyle5 = document.querySelectorAll('.p-sectionLinks');
    hstyle5.forEach(function(cell) {
        cell.style.background = '#000000';
    });

    const hstyle7 = document.querySelectorAll('.p-nav');
    hstyle7.forEach(function(cell) {
        cell.style.background = '#000000';
    });

    const scrollbarStyle = document.createElement('style');
    scrollbarStyle.id = 'style-scrollbar';
    scrollbarStyle.textContent = `
    /* Стили для полосы прокрутки */
    ::-webkit-scrollbar {
        width: 16px;
    }

    /* Дорожка (track) */
    ::-webkit-scrollbar-track {
        background-color:  #0A0A0A;
    }

    /* Стиль полосы прокрутки */
    ::-webkit-scrollbar-thumb {
        background-color: #1C1C1C;
        border-radius: 0px;
        transition-duration: .3s;
    }

    /* Стиль полосы прокрутки при наведении */
    ::-webkit-scrollbar-thumb:hover {
        background-color: #343E40;
        transition-duration: .3s;
    }
    `;
    document.head.appendChild(scrollbarStyle);

    const pageHeader = document.querySelector('.pageContent');
    const switchStyleBlock = document.createElement('label');
    switchStyleBlock.className = 'switch';
    switchStyleBlock.innerHTML = `
            <input type="checkbox" id="styleToggleCheck">
            <span class="slider round" style="padding-right: 20px;">
            <span class="addingText" style="display: block; width: max-content; margin: 5px; margin-left: 42px; margin-top: 2px;">Тьма</span>
            </span>
        `;
    pageHeader.appendChild(switchStyleBlock);

    const styleToggleCheck = document.getElementById('styleToggleCheck');
    if (localStorage.getItem('darkEnabled') === 'true') {
        styleToggleCheck.checked = true;
        createDark();
    }
    styleToggleCheck.addEventListener('change', function () {
        if (styleToggleCheck.checked) {
            createDark();
            localStorage.setItem('darkEnabled', 'true');
        } else {
            removeDark();
            localStorage.setItem('darkEnabled', 'false');
        }
    });

    const sliderStyle = document.createElement('style');
    sliderStyle.id = 'slider-style';
    sliderStyle.textContent = `
    .switch {
        position: relative;
        display: inline-block;
        width: 40px;
        height: 20px;
        padding-left: 20px;
        margin: 0 30px 0 auto;
    }
    .switch input { display: none; }
    .slider {
        position: absolute;
        cursor: pointer;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        border: 1px solid #34aaeb;
        background-color: #212428;
        transition: all .4s ease;
    }
    .slider:hover{
        background-color: #29686d;
    }
    .slider:before {
        position: absolute;
        content: "";
        height: 14px;
        width: 14px;
        left: 2px;
        bottom: 2px;
        background-color: #32a0a8;
        box-shadow: 0 0 5px #000000;
        transition: all .4s ease;
    }
    input:checked + .slider {
        background-color: #212428;
    }
    input:checked + .slider:hover {
        background-color: #29686d;
    }
    input:focus + .slider {
        box-shadow: 0 0 5px #222222;
        background-color: #444444;
    }
    input:checked + .slider:before {
        transform: translateX(19px);
    }
    .slider.round {
        border-radius: 34px;
    }
    .slider.round:before {
        border-radius: 50%;
    }
`;
    document.head.appendChild(sliderStyle);
})();

