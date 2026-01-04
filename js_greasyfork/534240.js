// ==UserScript==
// @name         Seasonvar Download Helper
// @name:en Seasonvar Download Helper
// @namespace    http://tampermonkey.net/
// @version      1.11
// @description  Добавляет кнопки для скачивания видео и получение прямых ссылок на скачивание файлов плейлиста
// @description:en  Adds download file and playlist buttons
// @author       Your Name
// @match        *://seasonvar.ru/*
// @grant        GM.cookie
// @grant        GM.openInTab
// @grant        GM.xmlHttpRequest
// @grant        GM.setValue
// @grant        GM.getValue
// @connect      seasonvar.ru
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/534240/Seasonvar%20Download%20Helper.user.js
// @updateURL https://update.greasyfork.org/scripts/534240/Seasonvar%20Download%20Helper.meta.js
// ==/UserScript==
(() => {
    'use strict';
    let logWindow = null;
    let originalActiveItem = null;

    const createDownloadButton = () => {
        new MutationObserver((_, observer) => {
            const video = document.querySelector('video');
            if (!video?.src) return;

            const container = document.querySelector('#oframehtmlPlayer');
            if (!container || container.querySelector('#video-download-btn')) return;

            const a = document.createElement('a');
            a.id = 'video-download-btn';
            a.textContent = 'Download';
            a.style.cssText = 'position:absolute;z-index:9999;color:white;cursor:pointer;padding:5px;background:red;';
            a.href = video.src;
            a.download = true;
            container.appendChild(a);
            observer.disconnect();
        }).observe(document.body, {subtree: true, childList: true});
    };

    const switchPlaylistItem = async (index) => {
        const items = document.querySelectorAll('#htmlPlayer_playlist > *');
        originalActiveItem = document.querySelector('#htmlPlayer_playlist > .current');

        return new Promise(resolve => {
            const observer = new MutationObserver((_, obs) => {
                const video = document.querySelector('video[src]');
                if (video?.src && !video.src.includes('undefined')) {
                    obs.disconnect();
                    resolve(video.src);
                }
            });

            observer.observe(document.body, {subtree: true, childList: true});
            items[index].click();
        });
    };

    const restoreOriginalState = () => {
        if (originalActiveItem) {
            originalActiveItem.click();
            originalActiveItem = null;
        }
    };

    const generateAriaCommands = async (urls) => {
        const cookieList = await GM.cookie.list({domain: 'seasonvar.ru'});
        const cookies = cookieList.map(c => `${c.name}=${c.value}`).join('; ');
        const commandPrefix = 'aria2 -j1 -x4 -s4 -c -m0 --stream-piece-selector=inorder --summary-interval=1 --console-log-level=notice';
        const commands = urls
            .map(url => `${commandPrefix} "${url}" --header="Referer: ${location.href}" --header="Cookie: ${cookies}"`);
        const batchOneCommand
            = `${commandPrefix} --header="Referer: ${location.href}" --header="Cookie: ${cookies}" -Z ${urls.join(' ')}`;

        return {commands, batchOneCommand};
    };

    const createPlaylistDownloader = () => {
        const btn = document.createElement('button');
        btn.textContent = 'Скачать плейлист';
        btn.style.cssText = 'position:fixed;top:30px;right:10px;z-index:9999;';
        document.body.appendChild(btn);

        btn.addEventListener('click', async () => {
            logWindow = window.open('', '_blank');
            logWindow.document.write(`
                <script>
                    function copyTxt(id) {
                        const textarea = document.getElementById(id);
                        textarea.value = textarea.value.trim();
                        textarea.focus();
                        textarea.select();
                        document.execCommand('copy');
                    }
                </script>
            `);
            logWindow.document.write('<pre>Инициализация скачивания плейлиста...</pre>');

            const playerContainer = document.querySelector('#oframehtmlPlayer');
            const video = document.querySelector('video');
            if (!playerContainer || !video) {
                logWindow.document.body.innerHTML += '<br>Ошибка: не найден плеер или видео';
                return;
            }

            const originalDisplay = playerContainer.style.display;

            playerContainer.style.display = 'none';
            video.muted = true;
            if (!video.paused) video.pause();

            try {
                const items = document.querySelectorAll('#htmlPlayer_playlist > *');
                const results = [];

                for (let i = 0; i < items.length; i++) {
                    try {
                        logWindow.document.body.innerHTML += `<br>Обрабатываю элемент ${i + 1}/${items.length}`;
                        const src = await Promise.race([
                            switchPlaylistItem(i),
                            new Promise((_, r) => setTimeout(() => r(null), 25000))
                        ]);

                        if (src) {
                            results.push(src);
                            logWindow.document.body.innerHTML += `<br>[${i + 1}/${items.length}] Получена ссылка: ${src}`;
                        }
                        restoreOriginalState();
                        await new Promise(r => setTimeout(r, 4000));
                    } catch (e) {
                        logWindow.document.body.innerHTML += `<br>Ошибка: ${e.message}`;
                    }
                }

                const {commands, batchOneCommand} = await generateAriaCommands(results);
                logWindow.document.body.innerHTML = `
                    <div>
                        <button id="copy-one-cmd" onclick="copyTxt('copy-one-txt')">copy</button>
                    </div>
                    <textarea id="copy-one-txt" cols="30" rows="10">
                        ${batchOneCommand.trim()}
                    </textarea>
                    <pre>${commands.join('<br>')}</pre>`;
            } catch (e) {
                logWindow.document.body.innerHTML += `<br>Критическая ошибка: ${e.message}`;
            } finally {
                playerContainer.style.display = originalDisplay;
            }
        });
    };

    window.addEventListener('load', () => {
        createDownloadButton();
        createPlaylistDownloader();
    }, {once: true});
})();
