// ==UserScript==
// @name                 Spotify Web - Download Cover
// @name:es              Spotify Web - Descargar portada
// @name:pt              Spotify Web - Descarregar capa
// @name:pt-BR           Spotify Web - Baixar capa
// @name:it              Spotify Web - Scarica copertina
// @name:fr              Spotify Web - Télécharger pochette
// @name:de              Spotify Web - Cover herunterladen
// @name:ru              Spotify Web - Скачать обложку
// @name:zh-CN           Spotify Web - 下载封面
// @name:ja              Spotify Web - カバーをダウンロード
// @namespace            http://tampermonkey.net/
// @description          Adds a button to download the full size cover art from Spotify Web Player
// @description:es       Agrega un botón para descargar la portada en tamaño completo del reproductor web de Spotify
// @description:pt       Adiciona um botão para descarregar a capa em tamanho completo do reproductor web do Spotify
// @description:pt-BR    Adiciona um botão para baixar a capa em tamanho real do Spotify Web Player
// @description:it       Aggiunge un pulsante per scaricare la copertina a dimensione piena dal lettore web di Spotify
// @description:fr       Ajoute un bouton pour télécharger la pochette en taille réelle depuis le lecteur web Spotify
// @description:de       Fügt eine Schaltfläche zum Herunterladen des Covers in voller Größe vom Spotify Web Player hinzu
// @description:ru       Добавляет кнопку для скачивания обложки в полном размере из веб-плеера Spotify
// @description:zh-CN    为Spotify网页播放器添加下载全尺寸封面艺术的按钮
// @description:ja       Spotify Web Playerからフルサイズのカバーアートをダウンロードするボタンを追加します
// @version              1.7.2
// @match                https://open.spotify.com/*
// @author               Levi Somerset
// @license              MIT
// @icon                 https://www.google.com/s2/favicons?sz=64&domain=spotify.com
// @grant                GM_download
// @grant                GM_xmlhttpRequest
// @grant                window.onurlchange
// @connect              i.scdn.co
// @require              https://cdnjs.cloudflare.com/ajax/libs/FileSaver.js/2.0.5/FileSaver.min.js
// @downloadURL https://update.greasyfork.org/scripts/498854/Spotify%20Web%20-%20Download%20Cover.user.js
// @updateURL https://update.greasyfork.org/scripts/498854/Spotify%20Web%20-%20Download%20Cover.meta.js
// ==/UserScript==

(function () {
    'use strict';

    const CONFIG = {
        COVER_BASE: 'https://i.scdn.co/image/',
        SIZES: ['ab67616d0000b273', 'ab67616d00001e02', 'ab67616d00004851'],
        FULL_SIZE: 'ab67616d000082c1',
        DEBOUNCE_DELAY: 300
    };

    const translations = {
        en: ['Download Cover', 'Cover downloaded: %s', 'Failed to download cover'],
        es: ['Descargar portada', 'Portada descargada: %s', 'No se pudo descargar la portada'],
        pt: ['Descarregar capa', 'Capa descarregada: %s', 'Falha ao descarregar a capa'],
        "pt-BR": ['Baixar capa', 'Capa baixada: %s', 'Falha ao baixar a capa'],
        it: ['Scarica copertina', 'Copertina scaricata: %s', 'Impossibile scaricare la copertina'],
        fr: ['Télécharger pochette', 'Pochette téléchargée: %s', 'Échec du téléchargement de la pochette'],
        de: ['Cover herunterladen', 'Cover heruntergeladen: %s', 'Cover konnte nicht heruntergeladen werden'],
        ru: ['Скачать обложку', 'Обложка скачана: %s', 'Не удалось скачать обложку'],
        "zh-CN": ['下载封面', '封面已下载: %s', '下载封面失败'],
        ja: ['カバーをダウンロード', 'カバーがダウンロードされました: %s', 'カバーのダウンロードに失敗しました']
    };

    function initScript(saveAs) {
        function log(...args) {
            if (CONFIG.DEBUG) {
                console.log('[Spotify Cover Downloader]', ...args);
            }
        }

        function detectLanguage() {
            const htmlLang = document.documentElement.lang;
            if (htmlLang) {
                log('Language detected from HTML:', htmlLang);
                return htmlLang.split('-')[0];
            }

            const urlMatch = window.location.pathname.match(/\/intl-([a-z]{2})\//);
            if (urlMatch) {
                log('Language detected from URL:', urlMatch[1]);
                return urlMatch[1];
            }

            log('Language detected from browser:', navigator.language);
            return navigator.language.split('-')[0];
        }

        let language = detectLanguage();
        let [buttonText, downloadedText, errorText] = translations.en;

        if (language in translations) {
            [buttonText, downloadedText, errorText] = translations[language];
            log('Using translations for language:', language);
        } else {
            log('No translations for language:', language, 'using English');
        }

        const style = document.createElement('style');
        style.innerText = `
            .cover-download-btn {
                background-color: transparent;
                border: none;
                color: #b3b3b3;
                cursor: pointer;
                display: inline-flex;
                align-items: center;
                justify-content: center;
                margin-left: 0px;
                padding: 0px;
                position: relative;
                text-align: center;
                touch-action: manipulation;
                transition-duration: 33ms;
                transition-property: background-color, border-color, color, box-shadow, filter, transform;
                transition-timing-function: cubic-bezier(.3,0,.4,1);
                user-select: none;
                vertical-align: middle;
            }

            .cover-download-btn:hover {
                color: #ffffff;
                transform: scale(1.04);
            }

            .cover-download-btn:active {
                transform: scale(1);
            }

            .cover-download-btn svg {
                fill: currentColor;
            }
        `;
        document.head.appendChild(style);

        function downloadImage(imageSrc, fileName) {
            return new Promise((resolve, reject) => {
                log('Downloading image:', imageSrc, 'as', fileName);
                GM.xmlHttpRequest({
                    method: 'GET',
                    url: imageSrc,
                    responseType: 'blob',
                    onload: function (response) {
                        try {
                            const blob = response.response;
                            saveAs(blob, fileName);
                            showInfo(downloadedText.replace('%s', fileName), 'success');
                            log('Download successful');
                            resolve();
                        } catch (error) {
                            console.error('Error saving file:', error);
                            log('Error saving file:', error);
                            reject(error);
                        }
                    },
                    onerror: function (error) {
                        console.error('Error downloading image:', error);
                        log('Error downloading image:', error);
                        reject(error);
                    }
                });
            });
        }

        const albumInfoCache = new Map();

        function getAlbumInfo() {
            const cacheKey = window.location.href;
            if (albumInfoCache.has(cacheKey)) {
                log('Using cached album info for:', cacheKey);
                return albumInfoCache.get(cacheKey);
            }

            let artistName, albumName;

            const artistElements = document.querySelectorAll('a[data-testid="creator-link"]');
            if (artistElements.length > 0) {
                const artistNames = Array.from(artistElements).map(el => el.textContent.trim());
                artistName = artistNames.join(', ');
                log('Found artists:', artistName);
            }

            const albumTitleSelectors = [
                'span[data-testid="entityTitle"] h1[data-encore-id="text"]',
                'h1[data-encore-id="text"]',
                '.gj6rSoF7K4FohS2DJDEm',
                'span[data-testid="entityTitle"]',
                '.rEN7ncpaUeSGL9z0NGQR h1'
            ];

            for (const selector of albumTitleSelectors) {
                const element = document.querySelector(selector);
                if (element) {
                    albumName = element.textContent.trim();
                    log('Found album name using selector:', selector, ':', albumName);
                    break;
                }
            }

            if (!artistName) {
                const artistFallbackSelectors = [
                    '.b81TNrTkVyPCOH0aDdLG a',
                    '.rEN7ncpaUeSGL9z0NGQR',
                    '.RANLXG3qKB61Bh33I0r2 a'
                ];

                for (const selector of artistFallbackSelectors) {
                    const element = document.querySelector(selector);
                    if (element) {
                        artistName = element.textContent.trim();
                        log('Found artist using fallback selector:', selector, ':', artistName);
                        break;
                    }
                }
            }

            const info = {
                artist: artistName || 'Unknown Artist',
                album: albumName || 'Unknown Album'
            };

            log('Final album info:', info);
            albumInfoCache.set(cacheKey, info);
            return info;
        }

        function findAlbumCover() {
            const selectors = [
                'section[data-testid="album-page"] img[srcset*="i.scdn.co/image/"][sizes]',
                'section[data-testid="album-page"] img[src*="i.scdn.co/image/"]',
                'button[class*="_osiFNXU9Cy1X0CYaU9Z"] img[src*="i.scdn.co/image/"]',
                '.CmkY1Ag0tJDfnFXbGgju img[src*="i.scdn.co/image/"]',
                'img[srcset*="i.scdn.co/image/"][sizes]',
                'img[src*="i.scdn.co/image/"]'
            ];

            for (const selector of selectors) {
                const element = document.querySelector(selector);
                if (element && element.width >= 100) {
                    log('Found album cover using selector:', selector);
                    return element;
                }
            }

            log('Album cover not found');
            return null;
        }

        function getFullSizeCoverUrl() {
            const coverElement = findAlbumCover();

            if (!coverElement) {
                log('Cover element not found');
                return null;
            }

            const coverUrl = coverElement.src;
            for (const size of CONFIG.SIZES) {
                if (coverUrl.includes(size)) {
                    const fullSizeUrl = coverUrl.replace(size, CONFIG.FULL_SIZE);
                    log('Generated full size URL:', fullSizeUrl);
                    return fullSizeUrl;
                }
            }

            log('Failed to extract cover hash');
            return null;
        }

        function debounce(func, delay) {
            let timeoutId;
            return function (...args) {
                clearTimeout(timeoutId);
                timeoutId = setTimeout(() => func.apply(this, args), delay);
            };
        }

        function shouldShowButton() {
            const isAlbumPage = window.location.pathname.includes('/album/');
            log('Is album page:', isAlbumPage, 'Path:', window.location.pathname);
            return isAlbumPage;
        }

        function findActionBarRow() {
            const selectors = [
                '[data-testid="action-bar-row"]',
                '.eSg4ntPU2KQLfpLGXAww',
                '.action-bar-row'
            ];

            for (const selector of selectors) {
                const element = document.querySelector(selector);
                if (element) {
                    log('Found action bar using selector:', selector);
                    return element;
                }
            }

            log('Action bar not found, trying alternative approach');
            const moreButton = document.querySelector('[data-testid="more-button"]');
            if (moreButton) {
                log('Found more button, using its parent as action bar');
                return moreButton.parentNode;
            }

            log('Action bar not found');
            return null;
        }

        function createDownloadButton() {
            const button = document.createElement('button');

            button.className = 'Button-sc-1dqy6lx-0 iwlsM e-9890-overflow-wrap-anywhere e-9890-button-tertiary--icon-only e-9890-button-tertiary--condensed cover-download-btn';
            button.setAttribute('data-encore-id', 'buttonTertiary');
            button.setAttribute('title', buttonText);
            button.setAttribute('aria-label', buttonText);

            button.innerHTML = `
                <span aria-hidden="true" class="e-9890-button__icon-wrapper">
                    <svg data-encore-id="icon" role="img" aria-hidden="true" class="e-9890-icon e-9890-baseline" viewBox="0 0 24 24" style="--encore-icon-height: var(--encore-graphic-size-decorative-larger); --encore-icon-width: var(--encore-graphic-size-decorative-larger);">
                        <path d="M12 3a9 9 0 1 0 0 18 9 9 0 0 0 0-18zM1 12C1 5.925 5.925 1 12 1s11 4.925 11 11-4.925 11-11 11S1 18.075 1 12z"></path>
                        <path d="M12 6.05a1 1 0 0 1 1 1v7.486l1.793-1.793a1 1 0 1 1 1.414 1.414L12 18.364l-4.207-4.207a1 1 0 1 1 1.414-1.414L11 14.536V7.05a1 1 0 0 1 1-1z"></path>
                    </svg>
                </span>
            `;

            return button;
        }

        function addDownloadButton() {
            if (!shouldShowButton()) return;

            let actionBarRow = findActionBarRow();
            if (!actionBarRow) return;

            if (actionBarRow.querySelector('.cover-download-btn')) return;

            const moreButton = actionBarRow.querySelector('[data-testid="more-button"]');
            if (!moreButton) {
                log('More button not found, adding at the end of action bar');
                const downloadButton = createDownloadButton();
                actionBarRow.appendChild(downloadButton);

                downloadButton.addEventListener('click', async function () {
                    const fullSizeCoverUrl = getFullSizeCoverUrl();
                    if (fullSizeCoverUrl) {
                        try {
                            const albumInfo = getAlbumInfo();
                            const fileName = `${albumInfo.artist} - ${albumInfo.album}.jpg`;
                            await downloadImage(fullSizeCoverUrl, fileName);
                        } catch (error) {
                            showInfo(errorText, 'error');
                        }
                    } else {
                        showInfo(errorText, 'error');
                    }
                });

                return;
            }

            log('Found more button, inserting download button after it');
            const downloadButton = createDownloadButton();
            moreButton.parentNode.insertBefore(downloadButton, moreButton.nextSibling);

            downloadButton.addEventListener('click', async function () {
                const fullSizeCoverUrl = getFullSizeCoverUrl();
                if (fullSizeCoverUrl) {
                    try {
                        const albumInfo = getAlbumInfo();
                        const fileName = `${albumInfo.artist} - ${albumInfo.album}.jpg`;
                        await downloadImage(fullSizeCoverUrl, fileName);
                    } catch (error) {
                        showInfo(errorText, 'error');
                    }
                } else {
                    showInfo(errorText, 'error');
                }
            });
        }

        function removeDownloadButton() {
            const existingButton = document.querySelector('.cover-download-btn');
            if (existingButton) {
                log('Removing existing download button');
                existingButton.remove();
            }
        }

        function addOrRemoveButton() {
            if (shouldShowButton()) {
                log('Adding download button');
                addDownloadButton();
            } else {
                log('Removing download button');
                removeDownloadButton();
            }
        }

        function showInfo(str, type = 'success') {
            const infoDiv = document.createElement('div');
            infoDiv.style.cssText = `
                position: fixed;
                bottom: 20px;
                left: 50%;
                transform: translateX(-50%);
                background-color: ${type === 'success' ? '#1db954' : '#ff4444'};
                color: white;
                padding: 10px 20px;
                border-radius: 5px;
                z-index: 9999;
                font-family: spotify-circular, Helvetica, Arial, sans-serif;
                font-weight: 700;
            `;
            infoDiv.textContent = str;
            document.body.appendChild(infoDiv);
            setTimeout(() => infoDiv.remove(), 3000);
        }

        function watchForActionBar() {
            log('Starting aggressive DOM observation');
            const observer = new MutationObserver(() => {
                if (shouldShowButton()) {
                    const actionBar = findActionBarRow();
                    if (actionBar && !actionBar.querySelector('.cover-download-btn')) {
                        log('Action bar found during observation, adding button');
                        addDownloadButton();
                    }
                }
            });

            observer.observe(document.body, {
                childList: true,
                subtree: true
            });

            const intervalId = setInterval(() => {
                if (shouldShowButton()) {
                    log('Interval check: trying to add button');
                    addDownloadButton();
                } else {
                    log('Interval check: not an album page, clearing interval');
                    clearInterval(intervalId);
                }
            }, 1000);

            setTimeout(() => {
                log('Clearing interval after timeout');
                clearInterval(intervalId);
            }, 10000);

            return observer;
        }

        const debouncedAddOrRemoveButton = debounce(addOrRemoveButton, CONFIG.DEBOUNCE_DELAY);

        function init() {
            log('Initializing script');

            addOrRemoveButton();

            const observer = watchForActionBar();

            if ('onurlchange' in window) {
                log('URL change event supported, adding listener');
                window.addEventListener('urlchange', (e) => {
                    log('URL changed:', e.url);
                    debouncedAddOrRemoveButton();
                });
            }

            const regularObserver = new MutationObserver(() => {
                debouncedAddOrRemoveButton();
            });

            regularObserver.observe(document.body, {
                childList: true,
                subtree: true
            });

            const originalPushState = history.pushState;
            history.pushState = function () {
                log('History pushState detected');
                originalPushState.apply(this, arguments);
                debouncedAddOrRemoveButton();
            };

            window.addEventListener('popstate', () => {
                log('Popstate event detected');
                debouncedAddOrRemoveButton();
            });

            log('Initialization complete');
        }

        init();
    }

    if (typeof saveAs === 'undefined') {
        const script = document.createElement('script');
        script.src = 'https://cdnjs.cloudflare.com/ajax/libs/FileSaver.js/2.0.5/FileSaver.min.js';
        script.onload = () => initScript(saveAs);
        document.head.appendChild(script);
    } else {
        initScript(saveAs);
    }
})();