// ==UserScript==
// @name         GOOGLE REDIRECT
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  google redirect
// @author       SON
// @match        https://www.google.com/*
// @license      none
// @icon         https://www.google.com/s2/favicons?sz=64&domain=google.com
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/542499/GOOGLE%20REDIRECT.user.js
// @updateURL https://update.greasyfork.org/scripts/542499/GOOGLE%20REDIRECT.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const tempoMinimo = 5 * 60 * 1000; // 5 minutos
    const tempoMaximo = 7 * 60 * 1000; // 7 minutos

    // Gera um tempo aleatório entre 5 e 7 minutos
    const tempoAleatorio = Math.floor(Math.random() * (tempoMaximo - tempoMinimo + 1)) + tempoMinimo;

    const urlDestino = "";

    setTimeout(() => {
        window.location.href = urlDestino;
    }, tempoAleatorio);

})();