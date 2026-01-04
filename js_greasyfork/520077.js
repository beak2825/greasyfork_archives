// ==UserScript==
// @name         No Fcking Bing Videos
// @name:en      No Fcking Bing Videos
// @name:uk      No Fcking Bing Videos
// @name:de      No Fcking Bing Videos
// @namespace    http://tampermonkey.net/
// @version      1
// @description:uk  Обхід Bing Videos під час пошуку відео в Bing
// @description:en  Bypass Bing Videos when searching video in Bing
// @description:de  Bing Videos bei der Videosuche in Bing umgehen
// @description  Обход Bing Videos при поиске видео в Bing
// @author       SSYLON
// @match        https://www.bing.com/videos/riverview/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=bing.com
// @grant        none
// @license      GPL-3.0-or-later
// @downloadURL https://update.greasyfork.org/scripts/520077/No%20Fcking%20Bing%20Videos.user.js
// @updateURL https://update.greasyfork.org/scripts/520077/No%20Fcking%20Bing%20Videos.meta.js
// ==/UserScript==


//КОД ВАЩЕ СОЧНЫЙ, АПТИМИЗИРОВАННЫЙ ВАЙ ТЫ ШО, ПАКУПАЙ, НЕ ПАЖАЛЕЕШ
(function () {
    'use strict';

    // проверка YT iframe
    const redirectToYouTubeWatch = () => {
        const iframes = document.querySelectorAll('iframe'); // ищем iframe на странице
        for (const iframe of iframes) {
            const src = iframe.getAttribute('src'); // Получаем src атрибут
            if (src && src.includes('youtube.com/embed')) { // ID ютубовский?
                const videoId = new URL(src).pathname.split('/')[2]; // ID видео
                const watchUrl = `https://www.youtube.com/watch?v=${videoId}`; // чут-чут меняем ссылку
                console.log('YouTube видео найдено. Переход на:', watchUrl);
                window.location.href = watchUrl; // ну и переходим типаа
                return;
            }
        }
        console.log('YouTube iframe не найден');
    };

    // праверочка после загрузки
    document.addEventListener('DOMContentLoaded', () => {
        console.log('DOM загружен. Проверяем iframe.');
        redirectToYouTubeWatch();
    });

    // обсервер если вдруг грузиться уёбищно будет
    const observer = new MutationObserver(() => {
        console.log('Обнаружено изменение DOM. Проверяем iframe.');
        redirectToYouTubeWatch();
    });

    // наблюдаем за изменениями DOM
    observer.observe(document.body, { childList: true, subtree: true });

    // на всякий проверяем ещё раз, вдруг оно там пиздец уёбищно грузит
    setTimeout(redirectToYouTubeWatch, 3000);
})();