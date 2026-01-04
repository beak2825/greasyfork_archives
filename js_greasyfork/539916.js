// ==UserScript==
// @name         SBT+ - Bloquear Anúncio + Aviso Visual
// @namespace    http://tampermonkey.net/
// @version      1.1
// @description  Bloqueia iframes de anúncio e avisa visualmente quando isso ocorre
// @match        https://mais.sbt.com.br/vod/*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/539916/SBT%2B%20-%20Bloquear%20An%C3%BAncio%20%2B%20Aviso%20Visual.user.js
// @updateURL https://update.greasyfork.org/scripts/539916/SBT%2B%20-%20Bloquear%20An%C3%BAncio%20%2B%20Aviso%20Visual.meta.js
// ==/UserScript==

(function () {
    'use strict';

    // Mostra aviso visual temporário no canto superior direito
    function mostrarAvisoRemocao() {
        const aviso = document.createElement('div');
        aviso.innerText = 'Anúncio removido 🚫';
        aviso.style.position = 'fixed';
        aviso.style.top = '20px';
        aviso.style.right = '20px';
        aviso.style.padding = '10px 18px';
        aviso.style.backgroundColor = '#d32f2f';
        aviso.style.color = 'white';
        aviso.style.fontSize = '15px';
        aviso.style.borderRadius = '4px';
        aviso.style.boxShadow = '0 2px 6px rgba(0,0,0,0.3)';
        aviso.style.zIndex = '999999999';
        aviso.style.opacity = '0';
        aviso.style.transition = 'opacity 0.3s ease';

        document.body.appendChild(aviso);
        setTimeout(() => aviso.style.opacity = '1', 10);
        setTimeout(() => {
            aviso.style.opacity = '0';
            setTimeout(() => aviso.remove(), 300);
        }, 3000);
    }

    // Remove iframes de anúncios
    function removerIframesAnuncio() {
        let removed = false;
        const iframes = document.querySelectorAll('iframe');
        for (const iframe of iframes) {
            if (iframe.src.includes('imasdk.googleapis.com')) {
                iframe.remove();
                console.log('[Tampermonkey] Iframe de anúncio removido:', iframe.src);
                removed = true;
            }
        }
        if (removed) mostrarAvisoRemocao();
    }

    // Observa o DOM por novos iframes
    const observer = new MutationObserver((mutations) => {
        let removed = false;
        for (const mutation of mutations) {
            for (const node of mutation.addedNodes) {
                if (node.tagName === 'IFRAME' && node.src?.includes('imasdk.googleapis.com')) {
                    node.remove();
                    console.log('[Tampermonkey] Iframe de anúncio dinâmico removido.');
                    removed = true;
                }
                if (node.querySelectorAll) {
                    const innerIframes = node.querySelectorAll('iframe');
                    for (const inner of innerIframes) {
                        if (inner.src.includes('imasdk.googleapis.com')) {
                            inner.remove();
                            removed = true;
                        }
                    }
                }
            }
        }
        if (removed) mostrarAvisoRemocao();
    });

    // Inicia observador
    observer.observe(document.body, {
        childList: true,
        subtree: true
    });

    // Remove iframes já presentes
    setInterval(removerIframesAnuncio, 1500);

    console.log('[Tampermonkey] Bloqueio de iframe de anúncio ativado com aviso visual.');
})();
