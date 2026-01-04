// ==UserScript==
// @name         "knigoblud.club" downloader
// @namespace    http://tampermonkey.net/
// @version      2025-05-13
// @description  Скачивает аудиокниги с "knigoblud.club"
// @author       https://github.com/VladiStep
// @license      GPL-3.0-only
// @match        https://*.knigoblud.club/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=knigoblud.club
// @grant        GM_download
// @grant        GM_registerMenuCommand
// @grant        GM_unregisterMenuCommand
// @grant        GM_notification
// @downloadURL https://update.greasyfork.org/scripts/535903/%22knigobludclub%22%20downloader.user.js
// @updateURL https://update.greasyfork.org/scripts/535903/%22knigobludclub%22%20downloader.meta.js
// ==/UserScript==

(async function() {
    'use strict';

    let stopped = false;
    async function onStartClick() {
        if (window.location.pathname === '/') {
            alert('Вы на главной странице, выберите необходимую аудиокнигу.');
            return;
        }
        try {
            await startDownloading();
        }
        catch (e) {
            alert(`Ошибка во время попытки загрузки аудиокниги:\n${e.message}`);
        }
    }
    let startMenuID = GM_registerMenuCommand('Начать загрузку аудиокниги', () => onStartClick());

    function replaceInvalidChars(folderName, replacementChar = '_') {
        return folderName.replace(/[/\\?%*:|"<>]/g, replacementChar);
    }

    async function startDownloading() {
        if (GM_info.downloadMode !== 'browser') {
            alert('Не выставлен режим загрузки "Browser API", файлы не будут скачаны в отдельную папку.');
        }

        let bookTitleSafe = document.querySelector('div.PageTitle > h1')?.innerText;
        if (!bookTitleSafe) {
            throw new Error('Не найдено название книги.');
        }
        bookTitleSafe = replaceInvalidChars(bookTitleSafe);

        const scripts = document.querySelectorAll('script:not([src])');
        if (scripts.length === 0) {
            throw new Error('Не найден ни один встроенный (не загружаемый с другого адреса) скрипт.');
        }

        const playlistScript = Array.prototype.find.call(scripts, x => x.innerHTML.includes('"playlist":'));
        if (!playlistScript) {
            throw new Error('Не найден скрипт, который инициализирует плейлист.');
        }

        const playlistJSON = (/^\s+?KB\.playerInit\(({.+?})\);/gm).exec(playlistScript.textContent)?.[1];
        if (!playlistJSON) {
            throw new Error('Не найдена функция (и JSON) инициализации плейлиста.');
        }

        let playlist = null;
        try {
            playlist = JSON.parse(playlistJSON);
            if ((playlist.playlist?.length ?? 0) === 0) {
                throw new Error('Не найден `playlist` внутри объекта плейлиста (или он пуст).');
            }
        }
        catch (e) {
            throw new Error(`Ошибка при чтении JSON плейлиста - ${e}.`);
        }

        const firstFileURI = playlist.playlist[0].src;
        if (firstFileURI.includes('litres')) {
            throw new Error('Доступна только пробная глава, переключитесь на мобильную версию (в "Инструментах разработчика") и обновите страницу.')
        }
        const fileExt = (/.+(\.[^\/]+?)($|#|\?)/g).exec(firstFileURI)?.[1];
        if (!fileExt) {
            throw new Error(`Не удалось извлечь расширение файла из "${firstFileURI}".`);
        }

        const origTitle = document.title;
        let stopMenu = GM_registerMenuCommand('Прервать загрузку аудиокниги', () => { stopped = true });
        GM_unregisterMenuCommand(startMenuID);

        let hasError = false;
        for (let i = 0; i < playlist.playlist.length; i++) {
            if (stopped) {
                GM_notification({text: 'Загрузка аудиокниги прервана.'});
                break;
            }

            const downloaded = await new Promise((resolve) => {
                GM_download({
                    url: playlist.playlist[i].src,
                    name: `${bookTitleSafe}/${String(i).padStart(2, '0')}${fileExt}`,
                    saveAs: false,
                    onload: () => resolve(true),
                    onerror: () => resolve(false)
                });
            });
            if (!downloaded) {
                throw new Error('Ошибка при скачивании.');
            }

            document.title = `Скачано ${i}/${playlist.playlist.length}.`;
        }

        document.title = origTitle;

        if (!stopped) {
            GM_notification({text: 'Загрузка аудиокниги завершена.'});
        }
        else {
            stopped = false;
        }
        startMenuID = GM_registerMenuCommand('Начать загрузку аудиокниги', () => onStartClick());
        GM_unregisterMenuCommand(stopMenu);
    }
})();