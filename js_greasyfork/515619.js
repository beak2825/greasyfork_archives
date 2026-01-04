// ==UserScript==
// @name         osu! Auto Download Button Clicker
// @namespace    http://osu.ppy.sh/
// @version      1.6
// @description  Автоматическое нажатие кнопки "скачать" или "скачать без видео" на страницах osu! beatmapsets
// @match        https://osu.ppy.sh/beatmapsets/*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/515619/osu%21%20Auto%20Download%20Button%20Clicker.user.js
// @updateURL https://update.greasyfork.org/scripts/515619/osu%21%20Auto%20Download%20Button%20Clicker.meta.js
// ==/UserScript==

(function() {
    'use strict';

    function clickDownloadLink() {
        if (window.location.href.includes('https://osu.ppy.sh/beatmapsets/')) {
            let noVideoLink = document.querySelector('a[href*="download?noVideo=1"]');
            if (noVideoLink) {
                noVideoLink.click();
                console.log("Нажата ссылка 'Скачать без видео'");
                return;
            }

            // Получаем все ссылки с /download и фильтруем их
            let downloadLinks = Array.from(document.querySelectorAll('a[href*="/download"]'));
            let filteredLink = downloadLinks.find(link => /\d+\/download$/.test(link.getAttribute('href')));

            if (filteredLink) {
                filteredLink.click();
                console.log("Нажата ссылка 'Скачать'");
                return;
            }

            console.log("Ссылки для скачивания не найдены.");
        }
    }

    // задержка в 2 секунды перед запуском скрипта для прогрузки страницы
    setTimeout(clickDownloadLink, 2000);
})();
