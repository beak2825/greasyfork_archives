// ==UserScript==
// @name         Factorio Free Mods Downloader from re146.dev
// @namespace    https://re146.dev/
// @version      1.5
// @description  Changes all the links for download on https://mods.factorio.com with force download links. Don't forget say thanks to @radioegor146
// @author       radioegor146, Devito
// @match        https://mods.factorio.com/mod/*
// @match        https://mods.factorio.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=mods.factorio.com
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/517815/Factorio%20Free%20Mods%20Downloader%20from%20re146dev.user.js
// @updateURL https://update.greasyfork.org/scripts/517815/Factorio%20Free%20Mods%20Downloader%20from%20re146dev.meta.js
// ==/UserScript==



function FactorioFreeModsDownloader() {
    'use strict';
    //Инициализируем переменную с названием мода
    var ModNameGlobal = 0;
    // Проверяем, подходит ли ссылка под условие
    if (/^https:\/\/mods\.factorio\.com\/mod\/([^\/]+)/.test(location.href)) {
        // Если подходит, извлекаем имя мода
        ModNameGlobal = location.href.match(/^https:\/\/mods\.factorio\.com\/mod\/([^\/]+)/)[1];
        // Убираем все, что идет после символа вопросительного знака (если он есть)
        ModNameGlobal = ModNameGlobal.split('?')[0];
    }
    /*
        const elems = document.querySelectorAll(".button-green");
        [].forEach.call(elems, function(el) {
        el.classList.remove("disabled");
    });
    */
    let buttons = Array.from(document.getElementsByClassName('button-green'));
    for (const button of buttons) {
        let modName = ModNameGlobal
        const buttonText = button.innerText.trim().toLowerCase();
        const buttonParentType = button.parentElement.tagName.toLowerCase()
        // Если текст кнопки 'download'
        if (buttonText === 'download') {
            button.classList.remove('disabled');
            // Если модуль еще не задан, извлекаем название мода
            if (!modName) {
                const tempname = button.closest('.panel-inset-lighter')
                    .querySelector('.result-field')
                    .getAttribute('href');
                modName = tempname.split('?')[0].split('/mod/')[1];
            }
            // Определяем базовую логику для обновления кнопки
            const updateButton = (href) => {
                button.innerText = 'DownLoad';
                button.setAttribute('target', '_blank');
                button.setAttribute('href', href);
            };
            // Устанавливаем ссылки и другие атрибуты в зависимости от родительского элемента
            if (buttonParentType === 'div') {
                const href = `https://re146.dev/factorio/mods/ru#https://mods.factorio.com/mod/${modName}`;
                updateButton(href);
            } else if (buttonParentType === 'td') {
                const version = button.parentElement.parentElement.children[0].innerText;
                const href = `https://mods-storage.re146.dev/${modName}/${version}.zip`;
                updateButton(href);
            }
        }
    }
}


FactorioFreeModsDownloader();

// Выбираем элемент для наблюдения
const indicator = document.getElementById('indicator');
const observer = new MutationObserver((mutationsList, observer) => {
    // Здесь вы можете проверять, что именно изменилось на странице
    mutationsList.forEach(mutation => {
        if (mutation.type === 'attributes') {
            // Если структура DOM изменилась (например, добавление новых элементов)
            FactorioFreeModsDownloader();
        }
    });
});
// Определяем параметры для наблюдения
const config = {
    attributes: true, // Отслеживание изменений атрибутов (опционально)
};
// Начинаем наблюдение за indicator или любым другим элементом, который вам нужен
observer.observe(indicator, config);
