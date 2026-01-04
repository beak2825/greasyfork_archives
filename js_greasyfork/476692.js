// ==UserScript==
// @name         Passei Direto Bypass Premium
// @namespace    http://tampermonkey.net/
// @version      0.4
// @description  Remove o efeito blur do conteúdo do site passeidireto.com
// @author       João Barbosa
// @match        *://www.passeidireto.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=passeidireto.com
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/476692/Passei%20Direto%20Bypass%20Premium.user.js
// @updateURL https://update.greasyfork.org/scripts/476692/Passei%20Direto%20Bypass%20Premium.meta.js
// ==/UserScript==

(function() {
    'use strict';
/*
    let body = document.querySelector('body')
    if (body) {body.className = ''}
    let bodyClone = body.cloneNode(true)
    body.parentNode.replaceChild(bodyClone, body)
*/
    window.addEventListener('load', function() {
        let blur = document.getElementById('text-inner-content')
        if (blur) {blur.remove()}

        let registro = document.querySelector('[data-testid="register-banner"]')
        if (registro) {registro.remove()}

        let preview = document.querySelectorAll('[data-testid="file-html-preview-page"]')
        if (preview) {preview.forEach( (x) => {x.className = ''} )}

        let blurFalso = document.querySelectorAll('[data-testid="file-html-viewer-page"] > div > div > img')
        if (blurFalso) {blurFalso.forEach( (x) => {x.remove()} )}

        let paywall = document.querySelector('[class^="NewRegisterBanner_paywall"]')
        if (paywall) {paywall.remove()}

        let paywallblur = document.querySelector('[class^="paywall"]')
        if (paywallblur) {paywallblur.remove()}

        let previa = document.querySelectorAll('[class^="FileViewerShareSection_preview-box"]')
        if (previa) {previa.forEach( (x) => {x.className = ''} )}

        let paginaBranca = document.querySelectorAll('div[class^="FileHtmlViewer_file-html-container"]  > div  > div > div[style]')
        if (paginaBranca) {paginaBranca.forEach( (x) => x.parentElement.parentElement.remove() )}

        let trialBanner = document.querySelectorAll('[class^="FreeTrialBanner_"]')
        if (trialBanner) {trialBanner.forEach( (x) => {x.remove()} )}

        let bannerGeral = document.querySelectorAll('[class^="BannerSelector_banner-"]')
        if (bannerGeral) {bannerGeral.forEach( (x) => {x.remove()} )}

        let blur2 = document.querySelectorAll('[id="text-content"]  div[style]')
        if (blur2) {blur2.forEach( (x) => {let temp = x.className; x.className = ''; x.style.filter = 'none'; x.className = temp} )}

        let blur3 = document.querySelectorAll('[style="filter: blur(10px);"]')
        if (blur3) {blur3.forEach( (x) => {let temp = x.className; x.className = ''; x.style.filter = 'none'; x.className = temp} )}

        let blur4 = document.querySelectorAll('[style="filter: blur(6px);"]')
        if (blur4) {blur4.forEach( (x) => {let temp = x.className; x.className = ''; x.style.filter = 'none'; x.className = temp} )}

        let blur5 = document.querySelectorAll('[style="filter:blur(6px)"]')
        if (blur5) {blur5.forEach( (x) => {let temp = x.className; x.className = ''; x.style.filter = 'none'; x.className = temp} )}

        let estilo = document.querySelectorAll('style')[document.querySelectorAll('style').length-1]
        if (estilo) {estilo.innerHTML = estilo.innerHTML.replaceAll('transparent', 'black')}
        if (estilo) {estilo.innerHTML = estilo.innerHTML.replaceAll('-0.015em 0 black,0 0.015em black,0.015em 0 black,0 -0.015em  black', 'none')}

        let bodyclone = document.body.cloneNode(true)
        document.body = bodyclone
    }, false);
})();