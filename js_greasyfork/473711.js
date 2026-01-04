// ==UserScript==
// @name         Limpiador
// @namespace    http://tampermonkey.net/
// @version      0.32
// @description  Modifica la página de Criptológico y oculta elementos específicos.
// @author       Tu nombre
// @match        https://criptologico.com/tools/cc*
// @match        https://freecardano.com/*
// @match        https://freebinancecoin.com/*
// @match        https://freebitcoin.io/*
// @match        https://freedash.io/*
// @match        https://free-doge.com/*
// @match        https://freeethereum.com/*
// @match        https://freecryptom.com/*
// @match        https://free-ltc.com/*
// @match        https://freeneo.io/*
// @match        https://freesteam.io/*
// @match        https://free-tron.com/*
// @match        https://freeusdcoin.com/*
// @match        https://freetether.com/*
// @match        https://freenem.com/*
// @match        https://freeshibainu.com/*
// @match        https://coinfaucet.io/*
// @match        https://freepancake.com/*
// @match        https://freematic.com/*
// @match        https://freebfg.com/*
// @match        https://freebittorrent.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/473711/Limpiador.user.js
// @updateURL https://update.greasyfork.org/scripts/473711/Limpiador.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Función para ocultar elementos específicos
    function hideElements() {
        const elementSelectors = [
            '.col-12.justify-content-center.text-center.no-padding',
            '.col-sm-12.col-md-3.col-lg-3',
            '.GoogleActiveViewElement',
            '.adsbygoogle-noablate',
            '.d-flex.justify-content-center.mb-5',
            '#bottomAdd',
            'a[href="https://bc.game/i-1ngntdlx-n/"]',
            '[id^="ad_position_box"]', // Selector para ocultar elementos con atributo id que comienza con "ad_position_box"
        ];

        elementSelectors.forEach(selector => {
            const elements = document.querySelectorAll(selector);
            elements.forEach(element => {
                element.style.display = 'none';
            });
        });
    }

    // Función para hacer clic en el botón "ROLL!" si la URL contiene "/free"
    function clickRollButtonIfFree() {
        if (window.location.href.includes('/free')) {
            const rollButton = document.querySelector('.main-button-2.roll-button.bg-2');
            if (rollButton && !rollButton.style.display) {
                // Esperar 1 segundo antes de hacer clic en el botón
                setTimeout(() => {
                    rollButton.click();
                }, 2000);
            }
        }
    }

    // Verificar si hay un fragmento en la URL y redirigir si es necesario
    if (window.location.hash === '#google_vignette') {
        const baseURL = 'https://criptologico.com/tools/cc';
        window.location.href = baseURL;
    } else {
        const buttonSelector = '#table-struct > div > div > div.card > div.card-header > div.d-flex.p-0 > div.card-tools.ml-auto.mt-2.mr-1 > button.btn.btn-tool.mx-1';
        const checkboxSelector = '#schedules-toggler > label:nth-child(3)';
        const elementToHideSelector = '#console-log';

        const button = document.querySelector(buttonSelector);
        const checkbox = document.querySelector(checkboxSelector);
        const elementToHide = document.querySelector(elementToHideSelector);

        if (button && checkbox && elementToHide) {
            button.click();
            checkbox.click();
            elementToHide.style.display = 'none';
        }

        clickRollButtonIfFree(); // Hacer clic en el botón "ROLL!" si es una página "/free"
        hideElements(); // Ocultar los elementos al cargar la página
    }
})();
