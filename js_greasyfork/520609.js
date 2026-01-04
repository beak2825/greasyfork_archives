// ==UserScript==
// @name [SAP] Shikimori AnimePlay
// @namespace http://tampermonkey.net/
// @homepage https://github.com/xray108/Shikimori-AnimePlay
// @version 0.2.1
// @description Добавляет кнопку "Смотреть онлайн" на странице с аниме и при нажатии выводит видеоплеер kodik для просмотра прямо на Shikimori, адаптирован для PC и Android
// @author XRay108
// @icon https://www.google.com/s2/favicons?sz=64&domain=shikimori.one
// @match https://shikimori.one/animes/*
// @license GPL3
// @grant none
// @downloadURL https://update.greasyfork.org/scripts/520609/%5BSAP%5D%20Shikimori%20AnimePlay.user.js
// @updateURL https://update.greasyfork.org/scripts/520609/%5BSAP%5D%20Shikimori%20AnimePlay.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const state = {
        currentPageTitle: document.title,
        watchOnlineButtonAdded: false,
        videoWindow: null,
        videoModal: null,
    };

    const targetSelector = '#animes_show > section > div > div.menu-slide-outer.x199 > div > div > div:nth-child(1) > div.b-db_entry > div.c-image > div.cc.block';

    function isMobileDevice() {
        return navigator.userAgent.match(/Android/i) !== null;
    }

    function toggleVideoPlayer(button) {
        if (isMobileDevice()) {
            if (!state.videoModal) {
                openVideoModal();
            } else {
                closeVideoModal();
            }
        } else {
            if (!state.videoWindow || state.videoWindow.closed) {
                openVideoWindow();
            } else {
                closeVideoWindow();
            }
        }
    }

    function openVideoWindow() {
        const shikimoriID = getShikimoriID();
        if (shikimoriID) {
            const width = 960;
            const height = Math.round(width * 9 / 16);
            state.videoWindow = window.open('', state.currentPageTitle, `width=${width},height=${height}`);

            if (state.videoWindow) {
                const videoContent = `
                    <!DOCTYPE html>
                    <html lang="en">
                    <head>
                        <meta charset="UTF-8">
                        <meta name="viewport" content="width=device-width, initial-scale=1.0">
                        <title>${state.currentPageTitle}</title>
                        <style>
                            body {
                                margin: 0;
                                overflow: hidden;
                                display: flex;
                                justify-content: center;
                                align-items: center;
                                height: 100vh;
                                background-color: #000;
                            }
                        </style>
                    </head>
                    <body>
                        <iframe
                            src="//kodik.cc/find-player?shikimoriID=${shikimoriID}"
                            width="100%"
                            height="100%"
                            frameborder="0"
                            allowfullscreen
                            allow="autoplay *; fullscreen *">
                        </iframe>
                    </body>
                    </html>
                `;

                state.videoWindow.document.open();
                state.videoWindow.document.write(videoContent);
                state.videoWindow.document.close();
            }
        }
    }

    function closeVideoWindow() {
        if (state.videoWindow && !state.videoWindow.closed) {
            state.videoWindow.close();
            state.videoWindow = null;
        }
    }

    function openVideoModal() {
        const shikimoriID = getShikimoriID();
        if (shikimoriID) {
            if (!state.videoModal) {
                state.videoModal = document.createElement('div');
                state.videoModal.style.cssText = `
                    position: fixed;
                    top: 0;
                    left: 0;
                    width: 100%;
                    height: 100%;
                    background-color: rgba(0, 0, 0, 0.8);
                    z-index: 1000;
                    display: flex;
                    justify-content: center;
                    align-items: center;
                `;
            }

            const videoIframe = document.createElement('iframe');
            videoIframe.src = `//kodik.cc/find-player?shikimoriID=${shikimoriID}`;
            videoIframe.style.cssText = `
                width: 100vw;
                height: 56.25vw;
                border: none;
            `;
            videoIframe.allowFullscreen = true;
            videoIframe.setAttribute('allow', 'autoplay *; fullscreen *');
            state.videoModal.appendChild(videoIframe);

            const closeButton = document.createElement('button');
            closeButton.textContent = '✖';
            closeButton.style.cssText = `
                position: absolute;
                top: 10px;
                right: 10px;
                background-color: #ff4500;
                color: #ffffff;
                border: none;
                border-radius: 5px;
                padding: 10px;
                cursor: pointer;
                z-index: 1001;
            `;
            closeButton.addEventListener('click', closeVideoModal);
            state.videoModal.appendChild(closeButton);

            document.body.appendChild(state.videoModal);

            if (window.screen.orientation && window.screen.orientation.lock) {
                window.screen.orientation.lock('landscape').catch(error => {
                    console.error('Ошибка при переключении в горизонтальное положение:', error);
                });
            }
        }
    }

    function closeVideoModal() {
        if (state.videoModal) {
            document.body.removeChild(state.videoModal);
            state.videoModal = null;

            if (window.screen.orientation && window.screen.orientation.unlock) {
                window.screen.orientation.unlock();
            }
        }
    }

    function addWatchOnlineButton(targetElement) {
        if (targetElement && !state.watchOnlineButtonAdded) {
            const watchOnlineButton = document.createElement('button');
            watchOnlineButton.textContent = '▶ Смотреть онлайн';
            watchOnlineButton.classList.add('b-link_button');
            watchOnlineButton.style.cssText = `
                background-color: #ff4500;
                color: #ffffff;
                font-size: 16px;
                font-weight: bold;
                padding: 10px 20px;
                border: none;
                border-radius: 5px;
                cursor: pointer;
                transition: background-color 0.3s;
            `;

            const style = document.createElement('style');
            style.textContent = `
                .b-link_button {
                    animation: pulse 2s infinite;
                }
                @keyframes pulse {
                    0% {
                        transform: scale(1);
                        opacity: 1;
                    }
                    50% {
                        transform: scale(1.05);
                        opacity: 0.9;
                    }
                    100% {
                        transform: scale(1);
                        opacity: 1;
                    }
                }
            `;
            document.head.appendChild(style);

            watchOnlineButton.addEventListener('mouseenter', () => {
                watchOnlineButton.style.animationPlayState = 'paused';
                watchOnlineButton.style.backgroundColor = '#ff6347';
            });
            watchOnlineButton.addEventListener('mouseleave', () => {
                watchOnlineButton.style.animationPlayState = 'running';
                watchOnlineButton.style.backgroundColor = '#ff4500';
            });

            targetElement.parentNode.insertBefore(watchOnlineButton, targetElement.nextSibling);
            state.watchOnlineButtonAdded = true;
        }
    }

    function getShikimoriID() {
        const urlParts = window.location.pathname.split('/');
        const idPart = urlParts[urlParts.length - 1];
        return idPart ? idPart.split('-')[0] : null;
    }

    const targetElement = document.querySelector(targetSelector);
    if (targetElement) {
        addWatchOnlineButton(targetElement);
    }

    document.body.addEventListener('click', (e) => {
        if (e.target && e.target.classList.contains('b-link_button')) {
            toggleVideoPlayer(e.target);
        }
    });

    const titleObserver = new MutationObserver(() => {
        if (document.title !== state.currentPageTitle) {
            state.currentPageTitle = document.title;
            if (isMobileDevice() ? state.videoModal : state.videoWindow) {
                if (isMobileDevice()) closeVideoModal();
                else closeVideoWindow();
            }
            state.watchOnlineButtonAdded = false;
            if (targetElement) addWatchOnlineButton(targetElement);
        }
    });
    titleObserver.observe(document.querySelector('title'), { subtree: true, characterData: true, childList: true });

})();
