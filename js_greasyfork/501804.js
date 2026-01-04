// ==UserScript==
// @name         Redirigir pestaña si URL contiene referrer raid
// @namespace    http://tampermonkey.net/
// @version      1.2
// @description  redirigir la pestaña si la URL contiene "referrer=raid"
// @author       elanis
// @icon         https://www.google.com/s2/favicons?sz=64&domain=twitch.tv
// @license      Ns
// @match        *://*.twitch.tv/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/501804/Redirigir%20pesta%C3%B1a%20si%20URL%20contiene%20referrer%20raid.user.js
// @updateURL https://update.greasyfork.org/scripts/501804/Redirigir%20pesta%C3%B1a%20si%20URL%20contiene%20referrer%20raid.meta.js
// ==/UserScript==

(function() {
    'use strict';

    console.log('Script de Violentmonkey iniciado.');

    // Verificar la URL y redirigir a la página de cierre si contiene "referrer=raid"
    function checkURL() {
        console.log('Verificando URL:', window.location.href);
        if (window.location.href.includes("?referrer=raid")) {
            console.log('URL contiene "referrer=raid". Redirigiendo a la página de cierre en 30 segundos...');
            setTimeout(function() {
                window.location.href = 'https://www.twitch.tv/directory/category/tetr-io';
            }, 30000); // 30 segundos = 30000 ms
        } else {
            console.log('URL no contiene "referrer=raid".');
        }
    }

    // Verificar inmediatamente
    checkURL();
})();

