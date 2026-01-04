// ==UserScript==
// @name         Adults Images Blur by Keywords
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Замыливает картинки на DuckDuckGo Images по ключевым словам в URL, alt или title
// @match        *://duckduckgo.com/*
// @match        *://www.google.*/*tbm=isch*
// @match        *://yandex.ru/images/*
// @icon         https://img.icons8.com/?size=100&id=gMzkfOa49btb&format=png&color=000000
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/542124/Adults%20Images%20Blur%20by%20Keywords.user.js
// @updateURL https://update.greasyfork.org/scripts/542124/Adults%20Images%20Blur%20by%20Keywords.meta.js
// ==/UserScript==

(function () {
    'use strict';

    // Список ключевых слов (нижний регистр)
    const KEYWORDS = [
        "*porn*",
        "*sex*",
        "*xvideo*",
        "*xnxx*",
        "*celebritate*",
        "*erotic*",
        "*xxx*",
        "*nsfw*",
        "*nude*",
        "*adult*",
        "*hentai*",
        "*fuck*",
        "*cam*",
        "*milf*",
        "*bdsm*",
        "*erome*",
        "*fapello*",
        "*tube8*",
        "*redtube*",
        "*youjizz*",
        "*pornhub*",
        "*spankwire*",
        "*xhamster*",
        "*motherless*",
        "*jav*",
        "*javhd*",
        "*babe*",
        "*anal*",
        "*fetish*",
        "*teen*",
        "*amateur*",
        "*blowjob*",
        "*hardcore*",
        "*lesbian*",
        "*cumshot*",
        "*gangbang*",
        "*striptease*",
        "*escort*",
        "*mature*",
        "*POV*",
        "*DP*",
        "*Double penetration*",
        "*jailbait*",
        "*brima*",
        "*Collage*",
        "*jb*",
        "прон",
        "порно",
        "трах"
    ];

    function matchMask(text, mask) {
        // Экранируем спецсимволы кроме *
        const escaped = mask.replace(/[-\/\\^$+?.()|[\]{}]/g, '\\$&');
        // Заменяем * на .*
        const regexStr = escaped.replace(/\*/g, '.*');
        const regex = new RegExp(regexStr, 'i'); // i — игнор регистра
        return regex.test(text);
    }

    function containsKeyword(text) {
        if (!text) return false;
        return KEYWORDS.some(mask => matchMask(text, mask));
    }

    // Настройка: выбери режим — "blur", "hide"
    const FILTER_MODE = "blur"; // или "blur", "hide"

    function blurIfKeyword(img) {
        if (img.dataset.processed) return;
        img.dataset.processed = "true";

        const combinedText = [
            img.src,
            img.alt,
            img.title,
            img.parentElement?.textContent
        ].filter(Boolean).join(" ").toLowerCase();

        if (!containsKeyword(combinedText)) return;

        switch (FILTER_MODE) {
            case "blur":
                img.style.filter = "blur(30px) grayscale(80%)";
                img.title = "Скрыто по ключевому слову";
                break;

            case "hide":
                img.style.display = "none";
                img.title = "Скрыто по ключевому слову";
                break;
        }
    }



    function processAllImages() {
        document.querySelectorAll('img').forEach(blurIfKeyword);
    }

    // Наблюдаем за изменениями в DOM, чтобы замыливать новые картинки
    const observer = new MutationObserver(processAllImages);
    observer.observe(document.body, { childList: true, subtree: true });

    // Запуск на уже загруженных картинках
    window.addEventListener('load', processAllImages);
    setInterval(processAllImages, 2000); // на всякий случай
})();
