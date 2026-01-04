// ==UserScript==
// @name         Adults Images Blur
// @namespace    http://tampermonkey.net/
// @version      5.2
// @description  Размывает картинки по ключевым словам в ссылках, описаниях и даже после клика
// @include      https://www.google.*/search*
// @include      https://yandex.*/images/*
// @match        *://images.google.*/*
// @match        https://www.bing.com/images/*
// @match        https://duckduckgo.com/*
// @icon         https://img.icons8.com/?size=100&id=l24cyKyOwOjt&format=png&color=000000
// @grant        GM_registerMenuCommand
// @grant        GM_getValue
// @grant        GM_setValue
// @downloadURL https://update.greasyfork.org/scripts/542123/Adults%20Images%20Blur.user.js
// @updateURL https://update.greasyfork.org/scripts/542123/Adults%20Images%20Blur.meta.js
// ==/UserScript==

(function () {
    'use strict';

    const defaultMasks = [
        "porn", "sex", "xvideo", "xnxx", "celebritate", "erotic", "xxx", "nsfw", "nude",
        "adult", "hentai", "fuck", "cam", "milf", "bdsm", "erome", "fapello", "tube8",
        "redtube", "youjizz", "pornhub", "spankwire", "xhamster", "motherless", "jav", "javhd",
        "babe", "anal", "fetish", "teen", "amateur", "blowjob", "hardcore", "lesbian",
        "cumshot", "gangbang", "striptease", "escort", "gay", "mature", "pov", "dp", "jailbait",
        "collage", "jb", "brima", "amour angels", "прон", "порно", "трах", "минет", "школьниц", "fity", "fap", "slut", "tnaflix",
        "College", "Reality Junkies", "freeones", "shahvani", "Hot", "suck", "3movs", "celeb",
        "xcafe", "boob", "thumbzilla", "drtuber", "pimpandhost", "bang", "Sperm", "titty", "ptorrents",
        "pornolab", "imagetwist", "whore", "hard", "tyler-brown", "pussy", "xgif", "ukdevilz", "gifsauce",
        "stapdad", "stapsister", "stapbrother", "babysitter", "rintor", "filthy", "phun"
    ];

    let masks = GM_getValue('masks', defaultMasks);

    function saveMasks() {
        GM_setValue('masks', masks);
    }

    function addMask() {
        const word = prompt("Введите новое слово для фильтра:");
        if (word && word.trim() !== '') {
            masks.push(word.trim());
            saveMasks();
            alert(`Слово "${word}" добавлено в список!`);
        }
    }

    function showMasks() {
        if (masks.length === 0) {
            alert("Список пуст.");
        } else {
            alert("Текущие маски:\n" + masks.join('\n'));
        }
    }

    function removeMask() {
        if (masks.length === 0) {
            alert("Список пуст, удалять нечего.");
            return;
        }

        const list = masks.map((item, index) => `${index + 1}. ${item}`).join('\n');
        const input = prompt("Выберите номер слова для удаления:\n\n" + list);

        const index = parseInt(input, 10);
        if (!isNaN(index) && index >= 1 && index <= masks.length) {
            const removed = masks.splice(index - 1, 1)[0];
            saveMasks();
            alert(`Слово "${removed}" удалено.`);
        } else {
            alert("Некорректный номер.");
        }
    }


    // Меню Tampermonkey
    GM_registerMenuCommand("➕ Добавить слово в masks", addMask);
    GM_registerMenuCommand("🗑️ Удалить слово из masks", removeMask);
    GM_registerMenuCommand("📋 Показать текущие masks", showMasks);

    // Здесь используйте `masks` в остальной логике скрипта
    console.log("Текущие маски:", masks);

     const blurStyle = `
        filter: blur(30px) grayscale(60%) !important;
        transition: filter 0.3s ease;
    `;

    function matchesMask(text) {
        if (!text) return false;
        const lowered = text.toLowerCase();
        return masks.some(mask => lowered.includes(mask.toLowerCase()));
    }

    function applyBlur(img) {
        if (!img || img.dataset.blurred) return;

        // Собираем всё что можем про картинку
        const dataPoints = [
            img.src,
            img.alt,
            img.title,
            img.closest('a')?.href,
            img.closest('figure, div, td, span, li')?.innerText,
            img.parentElement?.textContent
        ].filter(Boolean).join(" ").toLowerCase();

        if (matchesMask(dataPoints)) {
            img.style.filter = "blur(30px) grayscale(80%)";
            img.title = "Изображение скрыто по ключевому слову";
            img.dataset.blurred = "true";
            console.log('[BLURRED]', img.src);
        }
    }

    function applyBlurOld(img) {
        if (!img || img.dataset.blurred) return;
        img.style.cssText += blurStyle;
        img.dataset.blurred = 'true';
        console.log('[BLUR]', img);
    }

    function processLinksAndImages() {
        const links = document.querySelectorAll('a[href]');

        links.forEach(link => {
            const href = link.href;
            if (!matchesMask(href)) return;

            // ищем картинку в пределах того же контейнера
            let container = link.closest('figure, div, li, td, span');
            if (container) {
                const img = container.querySelector('img');
                if (img) {
                    console.log('[✔] Маска найдена в ссылке:', href);
                    applyBlur(img);
                    applyBlurOld(img);
                }
            }
        });
    }

    function processDescriptions() {
        const allBlocks = document.querySelectorAll('figure, div, li, td, span');

        allBlocks.forEach(block => {
            const text = block.innerText;
            if (!matchesMask(text)) return;

            const img = block.querySelector('img');
            if (img && !img.dataset.blurred) {
                console.log('[✔] Маска найдена в описании:', text);
                applyBlur(img);
                applyBlurOld(img);
            }
        });
    }

    function processAllImages() {
        document.querySelectorAll('img').forEach(applyBlur);
    }

    function runAll() {
        processLinksAndImages();
        processDescriptions();
        processAllImages();
    }

    // Наблюдение за динамическими изменениями DOM
    const observer = new MutationObserver(runAll);
    observer.observe(document.body, { childList: true, subtree: true });

    window.addEventListener('load', runAll);
    setInterval(runAll, 2000); // на всякий случай
})();
