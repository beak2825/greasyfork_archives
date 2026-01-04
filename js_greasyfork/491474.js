// ==UserScript==
// @name         Custom Background CybHack
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Установка кастомного фона на всех страницах форума CybHack.
// @author       Elfiyka
// @match        https://cybhack.net/*
// @icon         https://cybhack.net/data/assets/logo/CH_emoji01.png
// @license MIT
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/491474/Custom%20Background%20CybHack.user.js
// @updateURL https://update.greasyfork.org/scripts/491474/Custom%20Background%20CybHack.meta.js
// ==/UserScript==

(function() {
    'use strict';

    var container = document.createElement('div');
    container.style.position = 'fixed';
    container.style.top = '97%';
    container.style.left = '99%';
    container.style.transform = 'translate(-50%, -50%)';
    container.style.zIndex = '9999';

    // Функция создания кнопки
    function createButton(iconURL, hoverColor, clickColor, clickHandler) {
        var button = document.createElement('button');
        button.style.backgroundColor = 'transparent';
        button.style.border = 'none';
        button.style.width = '35px';
        button.style.height = '35px';
        button.style.marginRight = '5px';
        button.style.boxShadow = 'none';

        var icon = new Image();
        icon.src = iconURL;
        icon.style.width = '100%';
        icon.style.height = '100%';
        icon.style.filter = 'invert(100%)';
        button.appendChild(icon);

        button.addEventListener('mouseover', function () {
            icon.style.opacity = '0.7';
        });

        button.addEventListener('mouseout', function () {
            icon.style.opacity = '1';
        });

        button.addEventListener('click', function () {
            icon.style.opacity = '0.5';
            clickHandler();
        });

        return button;
    }

    function handleUploadButtonClick() {
        var linkBG = prompt("Введите URL для фона:", localStorage.getItem('linkBG') || "");
        if (linkBG !== null && linkBG.trim() !== "") {
            localStorage.setItem('linkBG', linkBG);
            document.querySelectorAll('.p-code, .p-body').forEach(function(elem) {
                elem.style.backgroundImage = 'url(' + linkBG + ')';
                elem.style.backgroundSize = '100%';
                elem.style.backgroundAttachment = 'fixed';
            });
        } else {
            localStorage.removeItem('linkBG');
            document.querySelectorAll('.p-code, .p-body').forEach(function(elem) {
                elem.style.backgroundImage = '';
                elem.style.backgroundSize = '';
                elem.style.backgroundAttachment = '';
            });
        }
    }

    var uploadButton = createButton('https://www.svgrepo.com/show/239880/background.svg', 'darkgreen', 'lightgreen', handleUploadButtonClick);

    container.appendChild(uploadButton);

    document.body.appendChild(container);

    var storedLinkBG = localStorage.getItem('linkBG');
    if (storedLinkBG && storedLinkBG.trim() !== "") {
        document.querySelectorAll('.p-code, .p-body').forEach(function(elem) {
            elem.style.backgroundImage = 'url(' + storedLinkBG + ')';
            elem.style.backgroundSize = '100%';
            elem.style.backgroundAttachment = 'fixed';
        });
    }
})();
