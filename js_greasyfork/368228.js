// ==UserScript==
// @name         AnimesTelecine - Redirect Automático
// @namespace    https://github.com/adriantodt
// @version      1.0
// @description  Automaticamente redireciona para o site de download após o tempo de espera.
// @author       AdrianTodt
// @include      http*://*.animestelecine.me/*
// @include      http*://*.animestelecine.top/*
// @grant        unsafeWindow
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/368228/AnimesTelecine%20-%20Redirect%20Autom%C3%A1tico.user.js
// @updateURL https://update.greasyfork.org/scripts/368228/AnimesTelecine%20-%20Redirect%20Autom%C3%A1tico.meta.js
// ==/UserScript==

setTimeout(function() {
    window.location.replace(document.getElementsByClassName('downlink')[0].href);
}, 7250);

