// ==UserScript==
// @name      Youtube "Remove From Playlist" Button
// @namespace http://tampermonkey.net/
// @version   1.8
// @description Adds a button next to the three dots menu to remove videos from a playlist with one click on YouTube
// @author    Lynrayy + art13
// @match     https://www.youtube.com/*
// @grant     none
// @license   MIT
// @source    https://github.com/lynrayy/YT-RM-BTN
// @downloadURL https://update.greasyfork.org/scripts/531430/Youtube%20%22Remove%20From%20Playlist%22%20Button.user.js
// @updateURL https://update.greasyfork.org/scripts/531430/Youtube%20%22Remove%20From%20Playlist%22%20Button.meta.js
// ==/UserScript==

(function() {
    'use strict';

    console.log('Script started');

    function addRemoveButton(video) {
        console.log('Adding remove button');
        const menuRenderer = video.querySelector('ytd-menu-renderer');
        if (!menuRenderer || menuRenderer.querySelector('.remove-button')) return;

        const buttonContainer = document.createElement('button');
        buttonContainer.className = 'remove-button style-scope ytd-menu-renderer';
        buttonContainer.style.cssText = 'background: none; border: none; cursor: pointer; padding: 0; display: inline-flex; align-items: center; margin-right: 10px;';

        // Создаём SVG иконку
        const trashIcon = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
        trashIcon.setAttribute('xmlns', 'http://www.w3.org/2000/svg');
        trashIcon.setAttribute('viewBox', '0 0 24 24');
        trashIcon.setAttribute('width', '24');
        trashIcon.setAttribute('height', '24');
        trashIcon.style.cssText = 'fill: #030303; vertical-align: middle;';

        // Добавляем путь для иконки корзины
        const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
        path.setAttribute('d', 'M19 3h-4V2a1 1 0 00-1-1h-4a1 1 0 00-1 1v1H5a2 2 0 00-2 2h18a2 2 0 00-2-2ZM6 19V7H4v12a4 4 0 004 4h8a4 4 0 004-4V7h-2v12a2 2 0 01-2 2H8a2 2 0 01-2-2Zm4-11a1 1 0 00-1 1v8a1 1 0 102 0V9a1 1 0 00-1-1Zm4 0a1 1 0 00-1 1v8a1 1 0 002 0V9a1 1 0 00-1-1Z');
        trashIcon.appendChild(path);

        buttonContainer.appendChild(trashIcon);

        buttonContainer.addEventListener('click', async () => {
            const menuButton = video.querySelector('ytd-menu-renderer yt-icon-button#button');
            if (!menuButton) return;

            menuButton.click();
            await new Promise(resolve => setTimeout(resolve, 100));

            const removeButton = document.querySelector('ytd-menu-service-item-renderer:nth-child(3) tp-yt-paper-item');
            const removeButton2 = document.querySelector('ytd-menu-service-item-renderer:nth-child(2) tp-yt-paper-item');
            if (removeButton) { // Для плейлистов на всю страницу (Только для "Смотреть позже")
                removeButton.click();
            } else if (removeButton2) { // Для мини плейлистов на странице видео
                removeButton2.click();
            } else {
                alert('It was not possible to delete the video. Please try again.');
            }
        });

        // Меняем flex-свойства для корректного выравнивания
        menuRenderer.style.display = 'flex';
        menuRenderer.style.alignItems = 'center';
        menuRenderer.insertBefore(buttonContainer, menuRenderer.firstChild);
    }

    function addRemoveButtons() {
        console.log('Adding remove buttons to all videos');
        // Для плейлистов на всю страницу
        const videoContainers = document.querySelectorAll('ytd-playlist-video-renderer');
        videoContainers.forEach(addRemoveButton);

        // Для компактных плейлистов на странице видео
        const videoContainers2 = document.querySelectorAll('ytd-playlist-panel-video-renderer');
        videoContainers2.forEach(addRemoveButton);
    }

    function init() {
        console.log('Initializing script');
        addRemoveButtons();

        const observer = new MutationObserver(mutations => {
            mutations.forEach(mutation => {
                mutation.addedNodes.forEach(node => {
                    if (node.nodeType === 1 && node.matches('ytd-playlist-video-renderer')) {
                        addRemoveButton(node);
                    }
                });
            });
        });

        observer.observe(document.body, { childList: true, subtree: true });
        window.addEventListener('yt-navigate-finish', addRemoveButtons);
    }

    init();
})();
