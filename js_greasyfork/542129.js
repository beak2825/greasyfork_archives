// ==UserScript==
// @name         Anitsu Redirect Script
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  Automatiza o redirecionamento no Anitsu. Se a URL tiver um "?path=" o script espera o site carregar e captura o link atual do cloud e monta a url juntando o cloud com o path de download e redireciona.
// @author       KingVegeta
// @match        https://anitsu.moe/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=anitsu.moe
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/542129/Anitsu%20Redirect%20Script.user.js
// @updateURL https://update.greasyfork.org/scripts/542129/Anitsu%20Redirect%20Script.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Verifica se a URL atual tem o parâmetro ?path=
    const urlParams = new URLSearchParams(window.location.search);
    const pathParam = urlParams.get('path');
    if (!pathParam) return;

    // Redirecionador
    const tryRedirect = () => {
        const buttonLink = document.querySelector('a[href^="https://cloud.anitsu.moe/nextcloud/s/"]');
        if (buttonLink) {
            let baseHref = buttonLink.getAttribute('href');

            // Remove qualquer ? ou &path= que já exista
            const baseUrl = new URL(baseHref);
            baseUrl.searchParams.delete('path'); // remove o path se já tiver
            baseHref = baseUrl.toString();

            // Agora adiciona o path certo
            const newUrl = `${baseHref}${baseHref.includes('?') ? '&' : '?'}path=${encodeURIComponent(pathParam)}`;

            // Redireciona
            window.location.href = newUrl;
        }
    };

    // Observa mudanças no DOM para pegar o botão mesmo que demore
    const observer = new MutationObserver(() => {
        tryRedirect();
    });

    observer.observe(document.body, { childList: true, subtree: true });

    // Tenta logo de cara também
    tryRedirect();
})();
