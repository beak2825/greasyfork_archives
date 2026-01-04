// ==UserScript==
// @name         Libera PiP YouTube Mobile (Silencioso)
// @namespace    https://tampermonkey.net/
// @version      1.0
// @description  Permite Picture-in-Picture no YouTube Mobile mesmo quando bloqueado (sem botões visíveis)
// @author       Você
// @match        *://m.youtube.com/*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/543932/Libera%20PiP%20YouTube%20Mobile%20%28Silencioso%29.user.js
// @updateURL https://update.greasyfork.org/scripts/543932/Libera%20PiP%20YouTube%20Mobile%20%28Silencioso%29.meta.js
// ==/UserScript==

(function () {
    'use strict';

    // 🔧 Remove ?uniplayer_block_pip da URL
    function cleanUrl() {
        const url = new URL(location.href);
        if (url.searchParams.has('uniplayer_block_pip')) {
            url.searchParams.delete('uniplayer_block_pip');
            history.replaceState({}, '', url.toString());
            console.log('✅ Parâmetro uniplayer_block_pip removido!');
        }
    }

    cleanUrl();

    // 🧼 Remove atributo que bloqueia PiP
    function removeDisableAttribute() {
        const videos = document.querySelectorAll('video[disablePictureInPicture], video[disablepictureinpicture]');
        videos.forEach(v => {
            v.removeAttribute('disablePictureInPicture');
            v.removeAttribute('disablepictureinpicture');
            console.log('🧹 Atributo disablePictureInPicture removido');
        });
    }

    setInterval(removeDisableAttribute, 1000);

    // Detecta mudanças de URL (SPA)
    const observerUrl = new MutationObserver(cleanUrl);
    observerUrl.observe(document.body, { childList: true, subtree: true });
})();