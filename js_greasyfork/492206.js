// ==UserScript==
// @name         Скрываем нежелательные авто в ленте и бортжурнале drive2.ru
// @namespace    http://tampermonkey.net/
// @version      1.11
// @description  Скрипт создан для скрытия постов в ленте от нежелательных автомобилей https://www.drive2.ru/. Так же скрываются нежелательные автомобили в бортжурнале https://www.drive2.ru/experience/  Вставляете в окно название не желаемого авто — посты с этим авто больше не показываются в ленте. Если хотите, чтобы посты вновь отображались, просто удаляете из окна ввода ник и перезагружаете страницу. Окно можно сворачивать и перетаскивать в удобное вам место.
// @author       APEXWEB.RU
// @match        https://*.drive2.ru/
// @match        https://www.drive2.ru/experience/*
// @grant             GM_addStyle
// @grant             GM_addElement
// @grant             GM_setValue
// @grant             GM_getValue
// @run-at            document-body
// @downloadURL https://update.greasyfork.org/scripts/492206/%D0%A1%D0%BA%D1%80%D1%8B%D0%B2%D0%B0%D0%B5%D0%BC%20%D0%BD%D0%B5%D0%B6%D0%B5%D0%BB%D0%B0%D1%82%D0%B5%D0%BB%D1%8C%D0%BD%D1%8B%D0%B5%20%D0%B0%D0%B2%D1%82%D0%BE%20%D0%B2%20%D0%BB%D0%B5%D0%BD%D1%82%D0%B5%20%D0%B8%20%D0%B1%D0%BE%D1%80%D1%82%D0%B6%D1%83%D1%80%D0%BD%D0%B0%D0%BB%D0%B5%20drive2ru.user.js
// @updateURL https://update.greasyfork.org/scripts/492206/%D0%A1%D0%BA%D1%80%D1%8B%D0%B2%D0%B0%D0%B5%D0%BC%20%D0%BD%D0%B5%D0%B6%D0%B5%D0%BB%D0%B0%D1%82%D0%B5%D0%BB%D1%8C%D0%BD%D1%8B%D0%B5%20%D0%B0%D0%B2%D1%82%D0%BE%20%D0%B2%20%D0%BB%D0%B5%D0%BD%D1%82%D0%B5%20%D0%B8%20%D0%B1%D0%BE%D1%80%D1%82%D0%B6%D1%83%D1%80%D0%BD%D0%B0%D0%BB%D0%B5%20drive2ru.meta.js
// ==/UserScript==

(function() {
    'use strict';

    let savedTexts = GM_getValue('textsToCheck', '');
    let xPos = GM_getValue('xPos', '50%');
    let yPos = GM_getValue('yPos', '50%');
    let windowSize = GM_getValue('windowSize', '220px');
    let iconSize = GM_getValue('iconSize', '24px');
    let iconColor = GM_getValue('iconColor', 'green');

    const container = document.createElement('div');
    container.style.position = 'fixed';
    container.style.top = yPos;
    container.style.left = xPos;
    container.style.transform = 'translate(-50%, -50%)';
    container.style.zIndex = '9999';
    container.style.padding = '5px';
    container.style.background = '#fff';
    container.style.border = '1px solid #ccc';
    container.style.borderRadius = '5px';
    container.style.width = windowSize;
    container.style.height = windowSize;
    container.style.transition = 'width 0.3s, height 0.3s';
    container.style.overflow = 'hidden';
    container.draggable = true;

    container.addEventListener('dragstart', function() {
        container.style.cursor = 'move';
    });

    container.addEventListener('dragend', function(event) {
        xPos = event.clientX + 'px';
        yPos = event.clientY + 'px';
        GM_setValue('xPos', xPos);
        GM_setValue('yPos', yPos);
        container.style.top = yPos;
        container.style.left = xPos;
        container.style.cursor = 'auto';
    });

    const header = document.createElement('div');
    header.style.display = 'flex';
    header.style.justifyContent = 'center';
    header.style.alignItems = 'center';

    const iconButton = document.createElement('span');
    iconButton.innerHTML = `<svg width="${iconSize}" height="${iconSize}" viewBox="0 0 24 24"><path d="M20 12H4" stroke="${iconColor}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"></path></svg>`;
    iconButton.style.cursor = 'pointer';
    iconButton.style.fontSize = iconSize;
    iconButton.addEventListener('click', function() {
        if (container.style.width === '220px') {
            container.style.width = '32px';
            container.style.height = '32px';
            iconButton.innerHTML = `<svg width="24" height="24" viewBox="0 0 24 24"><path d="M14 5L4 12l10 7V5z" fill="blue"></path></svg>`;
            GM_setValue('windowSize', '32px');
            GM_setValue('iconSize', '24px');
            GM_setValue('iconColor', 'blue');
        } else {
            container.style.width = '220px';
            container.style.height = '220px';
            iconButton.innerHTML = `<svg width="${iconSize}" height="${iconSize}" viewBox="0 0 24 24"><path d="M20 12H4" stroke="${iconColor}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"></path></svg>`;
            GM_setValue('windowSize', '220px');
            GM_setValue('iconSize', '24px');
            GM_setValue('iconColor', 'green');
        }
    });

    header.appendChild(iconButton);
    container.appendChild(header);

    const textarea = document.createElement('textarea');
    textarea.placeholder = 'Введите тексты для проверки (каждый с новой строки)';
    textarea.style.width = '100%';
    textarea.style.height = 'calc(100% - 40px)';
    textarea.style.margin = '5px 0';
    textarea.style.resize = 'none';
    textarea.value = savedTexts;

    container.appendChild(textarea);
    document.body.appendChild(container);

    function applyHideRules(textsToCheck) {


        const elements = document.querySelectorAll('.c-user-badge__username .c-link--text');
        const carTitles = document.querySelectorAll('.c-car-title.c-link.c-link--current');


        elements.forEach((el) => {

            textsToCheck.forEach((text) => {
                if (el.textContent.trim().toLowerCase() === text.trim().toLowerCase()) {
                    el.closest('.c-user-badge__username').parentNode.parentNode.parentNode.style.display = 'none';
                }
            });
        });

        carTitles.forEach((title) => {
            textsToCheck.forEach((text) => {

                if (title.textContent.trim().toLowerCase() === text.trim().toLowerCase()) {
                    let parent = title;
                    //console.log(parent.parentNode.parentNode.parentNode.parentNode.parentNode)
                    parent.parentNode.parentNode.parentNode.parentNode.parentNode.style.display="none";

                }
            });
        });



    }

    document.addEventListener('DOMContentLoaded', function() {
        applyHideRules(savedTexts.split('\n').filter(text => text.trim() !== ''));
        // Установка иконки при загрузке страницы
        iconButton.innerHTML = `<svg width="${iconSize}" height="${iconSize}" viewBox="0 0 24 24"><path d="M20 12H4" stroke="${iconColor}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"></path></svg>`;
    });

    textarea.addEventListener('input', function() {
        savedTexts = textarea.value;
        GM_setValue('textsToCheck', savedTexts);
        applyHideRules(savedTexts.split('\n').filter(text => text.trim() !== ''));
    });

    document.addEventListener('scroll', function() {
        applyHideRules(savedTexts.split('\n').filter(text => text.trim() !== ''));
    });

})();
