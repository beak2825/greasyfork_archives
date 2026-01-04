// ==UserScript==
// @name         Passei Direto Bypass
// @namespace    http://tampermonkey.net/
// @version      0.5
// @description  Remove o efeito blur do conteúdo do site passeidireto.com
// @author       João Barbosa
// @match        *://www.passeidireto.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=passeidireto.com
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/465129/Passei%20Direto%20Bypass.user.js
// @updateURL https://update.greasyfork.org/scripts/465129/Passei%20Direto%20Bypass.meta.js
// ==/UserScript==

(function() {
    'use strict';

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

    let previa = document.querySelectorAll('[class^="FileViewerShareSection_preview-box"]')
    if (previa) {previa.forEach( (x) => {x.className = ''} )}

    let paginaBranca = document.querySelectorAll('div[class^="FileHtmlViewer_file-html-container"]  > div  > div > div[style]')
    if (paginaBranca) {paginaBranca.forEach( (x) => x.parentElement.parentElement.remove() )}
})();