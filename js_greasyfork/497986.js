// ==UserScript==
// @name            Youtube download button - y2meta
// @namespace       http://tampermonkey.net/
// @version         3.4
// @author          God Mario
// @match           *://*.youtube.com/*
// @match           *://*y2meta-us.com/*
// @run-at          document-start
// @icon            https://cdn.icon-icons.com/icons2/822/PNG/512/download_icon-icons.com_66472.png
// @grant           GM_addStyle
// @grant           GM_setValue
// @grant           GM_getValue
// @connect         *://*y2meta-us.com/*
// @license         MIT
// @description     This Script Adds a Download Button on the right side of the subscribe button, you can easily download Audio/Video
// @downloadURL https://update.greasyfork.org/scripts/497986/Youtube%20download%20button%20-%20y2meta.user.js
// @updateURL https://update.greasyfork.org/scripts/497986/Youtube%20download%20button%20-%20y2meta.meta.js
// ==/UserScript==

(function () {
    'use strict';

    if (window.location.hostname === 'www.youtube.com' && window.location.pathname === '/watch') {

        const SELECTORS = {
            subscribeButton: '#subscribe-button button',
            downloadButton: '.y2mate-download-btn'
        };

        const STRINGS = {
            downloadText: 'Download'
        };

        const STYLES = `
        .y2mate-download-btn {
            background-color: var(--yt-spec-additive-background);
            color: var(--yt-spec-text-primary);
            margin: 0px 2px;
            border-radius: 18px;
            width: 100px;
            height: 36px;
            line-height: 36px;
            text-align: center;
            font-style: normal;
            font-size: 14px;
            font-family: Roboto, Noto, sans-serif;
            font-weight: 500;
            text-decoration: none;
            display: flex;
            align-items: center;
            justify-content: center;
            text-decoration: none;
            border: none;
            cursor: pointer;
        }
        .y2mate-download-btn:hover {
            background-color: var(--yt-spec-mono-tonal-hover);
            color: var(--yt-spec-text-primary);
        }
        .y2mate-buttons-wrapper {
            display: flex;
            align-items: center;
            gap: 6px;
        }
    `;

        GM_addStyle(STYLES);

        function createDownloadButton() {
            if (document.querySelector(SELECTORS.downloadButton)) {
                return null;
            }

            const downloadButton = document.createElement('button');
            downloadButton.className = 'y2mate-download-btn';
            downloadButton.textContent = `${STRINGS.downloadText}`;

            downloadButton.addEventListener('click', function () {
                const videoUrl = window.location.href;
                GM_setValue('ultimaUrlYoutube', videoUrl);
                const downloadDomains = ['y2meta-us.com/'];
                const newUrl = videoUrl.replace('www.youtube.com/', downloadDomains);
                window.open(newUrl, '_blank');
            });

            return downloadButton;
        }

        function addDownloadButton() {
            const subscribeButton = document.querySelector(SELECTORS.subscribeButton);
            if (!subscribeButton) {
                return;
            }

            const downloadButton = createDownloadButton();
            if (!downloadButton) {
                return;
            }

            const container = subscribeButton.closest('#subscribe-button');
            if (container) {
                const wrapper = document.createElement('div');
                wrapper.className = 'y2mate-buttons-wrapper';

                container.parentNode.insertBefore(wrapper, container);
                wrapper.appendChild(container);
                wrapper.appendChild(downloadButton);
            }
        }

        function init() {
            if (window.location.pathname.includes('/watch')) {
                addDownloadButton();
            }
        }

        const observer = new MutationObserver(init);

        observer.observe(document.documentElement, {
            childList: true,
            subtree: true
        });

        window.addEventListener('yt-navigate-finish', init);

        init();

    } else if (window.location.hostname === 'y2meta-us.com') {


        function pegarUrlEnInput() {

            const urlGuardada = GM_getValue('ultimaUrlYoutube', null);


            if (urlGuardada) {

                const campoInput = document.querySelector('#txt-url');
                const botonSubmit = document.querySelector('#btn-submit');

                if (campoInput && botonSubmit) {
                    campoInput.value = urlGuardada;
                    console.log('✅ URL de YouTube pegada en el input:', urlGuardada);

                    campoInput.dispatchEvent(new Event('input', { bubbles: true }));

                    botonSubmit.click();
                    console.log('✅ Botón #btn-submit clickeado automáticamente.');

                    GM_setValue('ultimaUrlYoutube', '');

                } else {
                    console.warn('⚠️ Elemento(s) no encontrado(s). Reintentando...');

                    setTimeout(pegarUrlEnInput, 200);
                }
            } else {
                console.log('No se encontró una URL de YouTube guardada.');
            }
        }

        window.addEventListener('load', pegarUrlEnInput);

    }
}
)();